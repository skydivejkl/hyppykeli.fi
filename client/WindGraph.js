var Flotr = require("./vendor/flotr2.shim");
var moment = require("moment");
var ViewMaster = require("./vendor/backbone.viewmaster");
var h = require("hyperscript");

var WindGraphOptions = require("./WindGraphOptions");

function flotrFormat(point) {
    return [
        new Date(point.time).getTime(),
        point.value
    ];
}

var WindGraph = ViewMaster.extend({

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

        this.listenTo(this.settings, "change", this.render.bind(this));
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
        var el = this.$(".wind-graph").get(0);

        var data = [
            this.windSpeeds(),
            this.windGusts(),
            this.drawYline(
                "Oppilaiden ja A-lisenssien raja",
                this.colors.students,
                8
            ),
            this.drawYline(
                "Muiden lisenssien raja",
                this.colors.licensed,
                11
            )
        ];

        Flotr.draw(el, data, {
            xaxis: {
                mode: "time",
                tickFormatter: function(time) {
                    return moment(time).fromNow();
                }
            },
            yaxis: {
                title: "m/s"
            },
            legend: {
                show: true,
                container: this.$(".legend")
            }
        });

        return el;
    },


    template: function() {
        return h("div.dummy",
            h("div.wind-graph"),
            h("div.legend"),
            h("div.options-container")
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
