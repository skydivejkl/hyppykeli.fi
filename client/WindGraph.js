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

        this.listenTo(this.settings, "change", function() {
            console.log(12312);
        });

    },

    windSpeeds: function() {
        return {
            label: "Tuulen keskinopeus",
            color: this.colors.speeds,
            lines: { fill: true },
            data: this.model.get("windSpeeds").data.map(flotrFormat)
        };
    },

    windGusts: function() {
        return {
            label: "Puuskat",
            color: this.colors.gusts,
            lines: { fill: true },
            data: this.model.get("windGusts").data.map(flotrFormat)
        };
    },

    drawYline: function(label, color, ypos) {
        var gusts = this.model.get("windGusts").data;
        return {
            label: label,
            color: color,
            data: [
                [new Date(gusts[0].time), ypos],
                [new Date(gusts[gusts.length - 1].time), ypos]
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
                minorTickFreq: 4,
                mode: "time",
                tickFormatter: function(time) {
                    return moment(time).fromNow();
                }
            },
            yaxis: {
                title: "m/s"
            },
            grid: {
                minorVerticalLines: true
            }
        });

        return el;
    },


    template: function() {
        return h("div.dummy",
            h("div.wind-graph"),
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
