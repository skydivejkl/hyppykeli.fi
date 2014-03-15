/** @jsx React.DOM */

var React = require('react');
var _ = require("underscore");
var d3 = require("d3");
var Promise = require("bluebird");

var fetchJSON = Promise.promisify(d3.json.bind(d3));


// var studentLimit = 8;
var licenseLimit = 11;
var padding = 30;
var height = 400;

function toDates(d) {
    return _.extend({}, {
        time: new Date(d.time),
        value: parseFloat(d.value, 10)
    });
}

var WeatherDataPath = React.createClass({

    cleanedForecasts: function() {
        var latestsObservation = this.props.observations[this.props.observations.length-1];

        // We don't care about forecasts from the time we have actual
        // observations
        var forecasts = this.props.forecasts.filter(function(val) {
            return latestsObservation.time.getTime() < val.time.getTime();
        });

        // Start forecast drawing from the point we have the last observation
        forecasts.unshift(latestsObservation);

        return forecasts;
    },

    render: function() {

        return (
            <g className="weather-data-path">

                <path
                    className="observations"
                    d={ this.props.lineFunction(this.props.observations) }
                    stroke="black"
                    strokeWidth="2"
                    fill="none"
                />

                <path
                    className="forecasts"
                    d={ this.props.lineFunction.interpolate("monotone")(this.cleanedForecasts()) }
                    stroke="gray"
                    strokeWidth="2"
                    fill="none"
                />


            </g>
        );

    }

});

var SvgGraph = React.createClass({

    style: {
        backgroundColor: "red"
    },

    updateDimensions: function() {
        this.setState({
            width: window.innerWidth,
            height: height
        });
        this.updateScales();
    },

    getInitialState: function() {
        return {
            data: {},
            maxValue: 0,
            minValue: 0,
            history: 3,
            future: 3,
            startTime: new Date(),
            endTime: new Date()
        };
    },

    setPathData: function(name, values, virtualMin, virtualMax) {
        values = values.map(toDates);
        this.state.data[name] = values;

        var maxValue = d3.max(values, function(d) { return d.value; });

        console.log("max val", maxValue);
        var minValue = d3.min(values, function(d) { return d.value; });

        var startTime = d3.min(values, function(d) { return d.time; });
        var endTime = d3.max(values, function(d) { return d.time; });

        this.setState({
            data: this.state.data,

            maxValue: d3.max([maxValue, this.state.maxValue, virtualMax]),
            minValue: d3.min([minValue, this.state.minValue, virtualMin]),

            startTime: d3.min([startTime, this.state.startTime]),
            endTime: d3.max([endTime, this.state.endTime])
        });

        this.updateScales();
    },


    updateScales: function() {

        var xScale = d3.scale.linear()
            .domain([this.state.startTime, this.state.endTime])
            .range([padding, this.state.width - padding]);

        var yScale = d3.scale.linear()
            .domain([this.state.minValue, this.state.maxValue])
            .range([this.state.height - padding, padding])
            ;

        // educated guess
        var tickLabelWidth = 50;

        var xAxis = d3.svg.axis()
            .scale(xScale)
            .orient("bottom")
            .ticks( parseInt(this.state.width / tickLabelWidth) )
            .tickFormat(function(d) {
                return d3.time.format("%H:%M")(new Date(d));
            })
            ;

        var yAxis = d3.svg.axis()
            .scale(yScale)
            .orient("left")
            ;

        var yAxisRight = d3.svg.axis()
            .scale(yScale)
            .orient("right")
            ;

        this.setState({
            xScale: xScale,
            yScale: yScale,
            xAxis: xAxis,
            yAxis: yAxis,
            yAxisRight: yAxisRight
        });
    },

    componentWillMount: function() {
        this.updateDimensions();
        var self = this;
        this.lineFunction = d3.svg.line()
            .x(function(d) { return self.state.xScale(d.time.getTime()); })
            .y(function(d) { return self.state.yScale(d.value); })
            ;
    },


    renderAxes: function() {
        if (!this.state.xAxis) return;
        if (!this.state.yAxis) return;
        if (!this.state.yAxisRight) return;

        this.state.xAxis(d3.select(this.refs.xAxis.getDOMNode()));
        this.state.yAxis(d3.select(this.refs.yAxis.getDOMNode()));
        this.state.yAxisRight(d3.select(this.refs.yAxisRight.getDOMNode()));
    },

    componentDidMount: function() {
        window.addEventListener("resize", this.updateDimensions);
    },

    componentWillUnmount: function() {
        window.removeEventListener("resize", this.updateDimensions);
    },

    componentDidUpdate: function() {
        this.renderAxes();
    },


    render: function() {

        var paths = [];

        if (this.state.data.windGustObservations && this.state.data.windGustForecasts) {
            paths.push(
                <WeatherDataPath
                    lineFunction={this.lineFunction}
                    observations={this.state.data.windGustObservations}
                    forecasts={this.state.data.windGustForecasts}
                />
            );
        }

        if (this.state.data.windSpeedObservations && this.state.data.windSpeedForecasts) {
            paths.push(
                <WeatherDataPath
                    lineFunction={this.lineFunction}
                    observations={this.state.data.windSpeedObservations}
                    forecasts={this.state.data.windSpeedForecasts}
                />
            );
        }

        return (
            <div>
            <svg width={this.state.width} height={this.state.height}>
                {paths}
                <g
                    ref="xAxis"
                    className="axis"
                    transform={ "translate(0, " + (height - padding) + ")" }
                />

                <g
                    ref="yAxis"
                    className="axis"
                    transform={ "translate(" + padding + ",0)" }
                />

                <g
                    ref="yAxisRight"
                    className="axis"
                    transform={ "translate(" +  (this.state.width - padding) + ",0)" }
                />

            </svg>
            <input type="range" />
            </div>
        );
    }
});


var graph = <SvgGraph />;


var obs = fetchJSON("/api/fmi/observations?place=tikkakoski&parameters=winddirection,windspeedms,windgust");
var fore = fetchJSON("/api/fmi/forecasts?place=tikkakoski&parameters=winddirection,windspeedms,windgust");

Promise.all([obs, fore])
.spread(function(observations, forecasts) {
    setTimeout(function() {
        console.log(observations, forecasts);
        // {obs-obs-1-1-winddirection: Object, obs-obs-1-1-windspeedms: Object, obs-obs-1-1-windgust: Object}
        // {mts-1-1-WindDirection: Object, mts-1-1-WindSpeedMS: Object, mts-1-1-WindGust: Object}

        graph.setPathData(
            "windSpeedObservations",
            observations["obs-obs-1-1-windspeedms"].data,
            0,
            licenseLimit
        );

        graph.setPathData(
            "windSpeedForecasts",
            forecasts["mts-1-1-WindSpeedMS"].data,
            0,
            licenseLimit
        );

        graph.setPathData(
            "windGustObservations",
            observations["obs-obs-1-1-windgust"].data,
            licenseLimit,
            0
        );

        graph.setPathData(
            "windGustForecasts",
            forecasts["mts-1-1-WindGust"].data,
            0,
            licenseLimit
        );

    }, 1);
})
.catch(function(err) {
    console.error("Failed to fetch data", err);
});
React.renderComponent(
    graph,
    document.body
);

