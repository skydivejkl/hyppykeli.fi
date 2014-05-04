/** @jsx React.DOM */
var React = require("react");
var WeatherGraph = require("./WeatherGraph");
var Slider = require("./Slider");

var ZoomableGraph = React.createClass({

    getInitialState: function() {
        return {
            futureHours: 6,
            pastHours: 6
        };
    },

    getDefaultProps: function() {
        return {
            onSlide: function() {},
            windObservations: { data: [] },
            gustObservations: { data: [] },
            windForecasts: { data: [] },
            gustForecasts: { data: [] },
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
        return;
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
        return (
            <div className="cf zoomable-graph">
                <WeatherGraph
                    onSlide={this.props.onSlide}
                    lines={[
                        {
                            title: "Gust",
                            observations: this.pastSlice(this.props.gustObservations.data),
                            forecasts: this.futureSlice(this.props.gustForecasts.data)
                        },
                        {
                            title: "Wind",
                            observations: this.pastSlice(this.props.windObservations.data),
                            forecasts: this.futureSlice(this.props.windForecasts.data)
                        }
                    ]}
                />

                {this.renderSliders()}
            </div>

        );
    }
});


module.exports = ZoomableGraph;
