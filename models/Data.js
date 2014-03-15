
var Backbone = require("backbone");
var _ = require("underscore");
var d3 = require("d3");
var asEvents = require("../lib/asEvents");


var Data = Backbone.Model.extend({

    constructor: function(xScale, yScale, opts) {
        Backbone.Model.apply(this);
        this.opts = opts || {};
        this.xScale = xScale;
        this.yScale = yScale;

        this.listenTo("change", this, this.updateScalesFromData.bind(this));
        this.listenTo(
            "resize",
            asEvents(window),
            _.debounce(this.updateScalesFromWindow.bind(this), 300)
        );
    },

    updateScalesFromWindow: function() {
        var padding = 30;
        var height = 400;
        var width = window.innerWidth;

        this.xScale.range([padding, width - padding]);
        this.yScale.range([height - padding, padding]);

        this.trigger("scalechange");
    },

    updateScalesFromData: function() {
        var all = _.flatten(this.values());

        this.startDate = d3.min(all, function(d) { return d.time.getTime(); });
        this.endDate = d3.max(all, function(d) { return d.time.getTime(); });

        this.maxValue = d3.max(all, function(d) { return d.value; });
        this.maxValue = Math.max(this.maxValue, this.opts.maxValue);

        this.minValue = 0;

        this.xScale.domain(this.startDate, this.endDate);
        this.yScale.domain(this.minValue, this.maxValue);

        this.trigger("scalechange");
    }

});


module.exports = Data;
