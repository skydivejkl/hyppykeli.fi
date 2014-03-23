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
        return window.innerWidth - this.props.externalPadding;
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
            endTime: new Date(),

            mousePosition: 0
        };
    },

    getDefaultProps: function() {
        return {
            padding: 30,
            externalPadding: 20
        };
    },

    computeData: function(props) {
        props = props || this.props;
        var newState = this.getInitialState();
        console.log("Computing DATA!");

        props.lines.forEach(function(d) {
            _.forEach(d, function(values) {

                var minValue = d3.min(values, function(d) { return d.value; });
                var maxValue = d3.max(values, function(d) { return d.value; });

                var startTime = d3.min(values, function(d) { return d.time; });
                var endTime = d3.max(values, function(d) { return d.time; });


                newState.maxValue = d3.max([maxValue, newState.maxValue]);
                newState.minValue = d3.min([minValue, newState.minValue]);

                newState.startTime = d3.min([startTime, newState.startTime]);
                newState.endTime = d3.max([endTime, newState.endTime]);

            });
        });

        // Ensure that the current is always visible in the graph
        newState.endTime = new Date(
             Math.max(newState.endTime.getTime(), Date.now())
         );
        newState.startTime = new Date(
             Math.min(newState.startTime.getTime(), Date.now())
         );

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

    handleMouseMove: function(e) {
        var pos = e.clientX;
        pos -= this.refs.svg.getDOMNode().offsetLeft;
        this.setState({ mousePosition: pos });
    },

    render: function() {
        var self = this;

        this.updateScales();


        return (
            <div className="graph">
                <svg
                    ref="svg"
                    onMouseMove={this.handleMouseMove}
                    width={this.state.width}
                    height={this.state.height} >

                    {this.props.lines.map(function(d) {
                        return (
                            <WeatherSvgPath
                                key={d.key}
                                mousePosition={self.state.mousePosition}
                                xScale={self.xScale}
                                yScale={self.yScale}
                                observations={d.observations}
                                forecasts={d.forecasts}
                            />
                        );
                    })}

                    <line
                        x1={this.state.mousePosition}
                        y1="0"

                        x2={this.state.mousePosition}
                        y2={this.state.height}

                        stroke="black"
                        strokeWidth="black"

                    />

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
