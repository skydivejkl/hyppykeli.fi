
var Backbone = require("backbone");
var d3 = require("d3");
var _ = require("underscore");
var asEvents =  require("./asEvents");

var SvgView = Backbone.View.extend({

    initialize: function(opts) {
        this.opts = opts || opts;
        this.selection = d3.select(this.el);

        this.xScale = opts.xScale;
        this.yScale = opts.yScale;

        this.xAxisFn = d3.svg.axis()
            .scale(this.xScale)
            .orient("bottom")
            .tickFormat(function(d) {
                return d3.time.format("%H:%M")(new Date(d));
            })
            ;

        this.yAxisFn = d3.svg.axis()
            .scale(this.yScale)
            .orient("left")
            ;

        this.listenTo(
            asEvents(window),
            "resize",
            _.debounce(this.updateScalesFromWindow.bind(this), 300)
        );

        this.listenTo(
            this.model,
            "change",
            this.updateScalesFromData.bind(this)
        );

        this.updateScalesFromWindow();
        this.listenTo(this, "scalechange", this.update.bind(this));
    },

    width: function() {
        return window.innerWidth;
    },

    height: function() {
        return 400;
    },

    padding: function() {
        return 30;
    },

    updateScalesFromWindow: function() {

        this.xScale.range([this.padding(), this.width() - this.padding()]);
        this.yScale.range([this.height() - this.padding(), this.padding()]);

        this.trigger("scalechange");
    },

    data: function() {
        return [].concat(
            this.model.get("obs-obs-1-1-wg_10min").data,
            this.model.get("obs-obs-1-1-ws_10min").data,

            this.model.get("mts-1-1-WindGust").data,
            this.model.get("mts-1-1-WindSpeedMS").data
        );
    },

    updateScalesFromData: function() {
        var all = this.data();

        this.startDate = d3.min(all, function(d) { return d.time.getTime(); });
        this.endDate = d3.max(all, function(d) { return d.time.getTime(); });

        this.maxValue = d3.max(all, function(d) { return d.value; });
        // this.maxValue = Math.max(this.maxValue, this.opts.maxValue);

        this.minValue = 0;

        this.xScale.domain([this.startDate, this.endDate]);
        this.yScale.domain([this.minValue, this.maxValue]);

        this.trigger("scalechange");
    },

    render: function() {
        this.xAxis = this.selection.append("g").attr("class", "axis");
        this.yAxis = this.selection.append("g").attr("class", "axis");
    },

    update: function() {
        this.selection
            .attr("width", this.width())
            .attr("height", this.height())
            ;

        this.xAxis
            .attr("transform", "translate(0," + (this.height() - this.padding()) + ")")
            .call(this.xAxisFn);

        this.yAxis
            .attr("transform", "translate(" + this.padding() + ",0)")
            .call(this.yAxisFn)
            ;

    }

});

module.exports = SvgView;
