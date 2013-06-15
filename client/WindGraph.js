var Flotr = require("./vendor/flotr2.shim");
var moment = require("moment");
var ViewMaster = require("./vendor/backbone.viewmaster");
var h = require("hyperscript");
var $ = require("./vendor/jquery");
var _ = require("underscore");

var WindGraphOptions = require("./WindGraphOptions");

function flotrFormat(point) {
    return [
        new Date(point.time).getTime(),
        point.value
    ];
}


var DataAge = ViewMaster.extend({

    tagName: "span",
    className: "data-age",

    constructor: function() {
        ViewMaster.prototype.constructor.apply(this, arguments);
        this.interval = setInterval(this.render.bind(this) , 30 * 100);
        this.listenTo(this.model, "change", this.render, this);
    },

    remove: function() {
        ViewMaster.prototype.remove.apply(this, arguments);
        clearInterval(this.interval);
    },

    getHumanAge: function() {
        return moment(this.model.getLastUpdateTime()).fromNow();
    },

    getHumanUpdateTime: function() {
        return moment.duration(this.model.nextUpdateIn()).humanize();
    },

    template: function() {
        return h("p",
            "Data päivitetty ", this.getHumanAge(), ". ",
            "Seuraava päivitys ", this.getHumanUpdateTime(), " päästä."
        );
    }

});

var WindGraph = ViewMaster.extend({

    className: "bb-wind-graph",

    colors: {
        speeds: "#6379ff",
        gusts: "#91a1ff",
        students: "pink",
        licensed: "red"
    },

    constructor: function(options) {
        ViewMaster.prototype.constructor.apply(this, arguments);
        this.settings = options.settings;

        this.setView(".options-container", new WindGraphOptions({
            model: this.model,
            settings: this.settings
        }));

        this.setView(".data-age-container", new DataAge({
            model: this.model
        }));

        this.listenTo(this.settings, "change", this.render, this);
        this.listenTo(this.model, "change", this.render, this);

        var debouncedRender = _.debounce(this.render.bind(this), 400);
        $(window).on("resize", debouncedRender);
    },

    filterOld: function(point) {
        var t = new Date(point.time).getTime();
        var diff = new Date().getTime() - t;
        var hoursAgo = diff / 1000 / 60 / 60;
        return this.settings.get("limit") > hoursAgo;
    },

    windSpeeds: function() {
        return {
            label: "Tuulen keskinopeus",
            color: this.colors.speeds,
            lines: { fill: true },
            data: this.model.get("windSpeeds").data
                .filter(this.filterOld.bind(this))
                .map(flotrFormat)
        };
    },

    windGusts: function() {
        return {
            label: "Puuskat",
            color: this.colors.gusts,
            lines: { fill: true },
            data: this.model.get("windGusts").data
                .filter(this.filterOld.bind(this))
                .map(flotrFormat)
        };
    },

    drawYline: function(label, color, ypos) {
        var gusts = this.windGusts().data;
        return {
            label: label,
            color: color,
            data: [
                [gusts[0][0], ypos],
                [gusts[gusts.length-1][0], ypos]
            ]
        };
    },

    drawGraph: function() {
        var el = this.$(".graph").get(0);

        var data = [
            this.windSpeeds(),
            this.windGusts(),
            this.drawYline(
                "Oppilaiden ja A-lisenssien raja 8 m/s",
                this.colors.students,
                8
            ),
            this.drawYline(
                "Muiden lisenssien raja 11 m/s",
                this.colors.licensed,
                11
            )
        ];

        Flotr.draw(el, data, {
            xaxis: {
                mode: "time",
                tickFormatter: function(time) {
                    return moment(time).format("LT");
                }
            },
            yaxis: {
                title: null
            },
            legend: {
                show: true,
                container: this.$(".legend")
            },
            mouse: {
                track: true,
                sensibility: 10,
                trackFormatter: function(p) {
                    var m = moment(parseInt(p.x, 10));
                    return p.y + "m/s klo " + m.format("LT") + " (" + m.fromNow() + ")";
                }
            }
        });

        return el;
    },


    template: function() {
        return h("div.dummy",
            h("div.data-age-container"),
            h("div",
                h("p", "Keskituuli ", this.model.getLatestWindSpeed(), " m/s, ",
                   "puuska ", this.model.getLatestGust(), " m/s"
                )
             ),
            h("div.graph-wrap",
                h("div.graph"),
                h("div.options-container"),
                h("div.legend")
             )
        );
    },

    afterTemplate: function() {
        // Flotr cannot draw before container has a size. Workaround it...
        setTimeout(function() {
            this.drawGraph();
        }.bind(this), 0);
    }

});

module.exports = WindGraph;
