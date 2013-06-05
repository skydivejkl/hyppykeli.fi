
var Backbone = require("backbone");
var Flotr = require("./vendor/flotr2.shim");
var moment = window.m = require("moment");

function flotrFormat(point) {
    return [
        new Date(point.time).getTime(),
        point.value
    ];
}

module.exports = Backbone.View.extend({
    className: "wind-graph",

    render: function() {
        var speeds = {
            data: this.model.get("speeds").map(flotrFormat),
            lines: {
                fill: true,
                color: "#6379ff",
                fillColor: "#6379ff"
            }
        };
        var gusts = {
            data: this.model.get("gusts").map(flotrFormat),
            lines: {
                fill: true,
                color: "#91a1ff",
                fillColor: "#91a1ff"
            }
        };

        Flotr.draw(this.el, [gusts, speeds], {
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
    }

});

