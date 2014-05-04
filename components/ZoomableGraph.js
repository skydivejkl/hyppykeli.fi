/** @jsx React.DOM */
var React = require("react");
var WeatherGraph = require("./WeatherGraph");
var Slider = require("./Slider");
var _ = require("lodash");

var ZoomableGraph = React.createClass({

    getInitialState: function() {
        return {
            noSliders: false,
            futureHours: 6,
            pastHours: 6
        };
    },

    futureSlice: function(arr) {
        var max = Date.now() + 1000 * 60 * 60 * this.state.futureHours;
        return arr.filter(function(d) {
            return d.time.getTime() < max;
        });
    },

    pastSlice: function(arr) {
        var min = Date.now() - 1000 * 60 * 60 * this.state.pastHours;
        return arr.filter(function(d) {
            return d.time.getTime() > min;
        });
    },

    handleObservationSlide: function(val) {
        this.setState({
            pastHours: Math.max(val, 0)
        });
    },

    handleForceastSlide: function(val) {
        this.setState({
            futureHours: Math.max(val, 0)
        });
    },

    renderSliders: function() {
        if (this.props.noSliders) return;
        return (
            <div>
                <Slider
                    className="observations"
                    title="Show observations from the last "
                    onChange={this.handleObservationSlide}
                    value={this.state.pastHours}
                />
                <Slider
                    className="forecasts"
                    title="Show forecasts for the next "
                    onChange={this.handleForceastSlide}
                    value={this.state.futureHours}
                />
            </div>
        );

    },

    render: function() {
        var self = this;

        var lines = this.props.lines.map(function(line) {
            line = _.clone(line);
            line.observations = self.pastSlice(line.observations);
            line.forecasts = self.futureSlice(line.forecasts);
            return line;
        });

        return (
            <div className="cf zoomable-graph">
                <WeatherGraph
                    onSlide={this.props.onSlide}
                    selectedPoints={this.props.selectedPoints}
                    cursorPosition={this.props.cursorPosition}
                    lines={lines}
                />

                {this.renderSliders()}
            </div>

        );
    }
});


module.exports = ZoomableGraph;
