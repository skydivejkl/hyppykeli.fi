/** @jsx React.DOM */
var React = require('react');
var _ = require("lodash");
var d3 = require("d3");

var WeatherSvgPath = require("./WeatherSvgPath");


var WeatherGraph = React.createClass({

    style: {
        backgroundColor: "red"
    },

    componentWillReceiveProps: function(props) {
        this.computeData(props);
    },

    getWidth: function() {
        return window.innerWidth - 20;
    },

    getHeight: function() {
        // return parseInt(screen.height / 2);
        return Math.max(parseInt(window.innerHeight - 250), 300);
    },

    updateDimensions: function() {
        this.setState({
            width: this.getWidth(),
            height: this.getHeight()
        });
    },

    getInitialState: function() {
        return {
            width: this.getWidth(),
            height: this.getHeight(),

            maxValue: 13,
            minValue: 0,

            startTime: new Date(),
            endTime: new Date()
        };
    },

    getDefaultProps: function() {
        return {
            padding: 30
        };
    },

    computeData: function(props) {
        props = props || this.props;
        var newState = this.getInitialState();
        console.log("Computing DATA!");

        _.flatten(_.values(props.data).map(_.values), true).forEach(function(values) {

            var minValue = d3.min(values, function(d) { return d.value; });
            var maxValue = d3.max(values, function(d) { return d.value; });

            var startTime = d3.min(values, function(d) { return d.time; });
            var endTime = d3.max(values, function(d) { return d.time; });


            newState.maxValue = d3.max([maxValue, newState.maxValue]);
            newState.minValue = d3.min([minValue, newState.minValue]);

            newState.startTime = d3.min([startTime, newState.startTime]);
            newState.endTime = d3.max([endTime, newState.endTime]);

        });

        this.setState(newState);
    },


    updateScales: function() {
        var state = this.state;

        var xScale = d3.scale.linear()
            .domain([state.startTime, state.endTime])
            .range([this.props.padding, state.width - this.props.padding]);

        var yScale = d3.scale.linear()
            .domain([state.minValue, state.maxValue])
            .range([state.height - this.props.padding, this.props.padding])
            ;

        // educated guess
        var tickLabelWidth = 50;

        var xAxis = d3.svg.axis()
            .scale(xScale)
            .orient("bottom")
            .ticks( parseInt(state.width / tickLabelWidth) )
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

        _.extend(this, {
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
            .x(function(d) { return self.xScale(d.time.getTime()); })
            .y(function(d) { return self.yScale(d.value); })
            ;
    },


    renderAxes: function() {
        if (!this.xAxis) return;
        if (!this.yAxis) return;
        if (!this.yAxisRight) return;

        this.xAxis(d3.select(this.refs.xAxis.getDOMNode()));
        this.yAxis(d3.select(this.refs.yAxis.getDOMNode()));
        this.yAxisRight(d3.select(this.refs.yAxisRight.getDOMNode()));
    },

    componentDidMount: function() {
        this.computeData();
        window.addEventListener("resize", this.updateDimensions);
    },

    componentWillUnmount: function() {
        window.removeEventListener("resize", this.updateDimensions);
    },

    componentDidUpdate: function() {
        this.renderAxes();
    },


    render: function() {

        this.updateScales();


        var self = this;

        return (
            <div className="graph">
            <svg width={this.state.width} height={this.state.height}>

                {Object.keys(this.props.data).map(function(key) {
                    var d = self.props.data[key];
                    return (
                        <WeatherSvgPath
                            key={key}
                            lineFunction={self.lineFunction}
                            observations={d.observations}
                            forecasts={d.forecasts}
                        />
                    );
                })}

                <g
                    ref="xAxis"
                    className="axis"
                    transform={ "translate(0, " + (this.state.height - this.props.padding) + ")" }
                />

                <g
                    ref="yAxis"
                    className="axis"
                    transform={ "translate(" + this.props.padding + ",0)" }
                />

                <g
                    ref="yAxisRight"
                    className="axis"
                    transform={ "translate(" +  (this.state.width - this.props.padding) + ",0)" }
                />

            </svg>
            </div>
        );
    }
});

module.exports = WeatherGraph;
