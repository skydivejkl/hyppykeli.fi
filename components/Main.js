/** @jsx React.DOM */

var React = require("react");
var _ = require("lodash");

var WeatherGraph = require("./WeatherGraph");
var Slider = require("./Slider");
var CurrentWinds = require("./CurrentWinds");
var Sunset = require("./Sunset");
var DataBox = require("./DataBox");

var Main = React.createClass({

    getInitialState: function() {
        return {
            windObservations: { data: [] },
            gustObservations: { data: [] },
            windForecasts: { data: [] },
            gustForecasts: { data: [] },
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

    render: function() {
        return (
            <div>
                <div className="cf weather-boxes">

                    <CurrentWinds
                        avg={_.last(this.state.windObservations.data)}
                        gust={_.last(this.state.gustObservations.data)}
                    />

                    <Sunset
                        latitude={this.props.options.lat}
                        longitude={this.props.options.lon}
                    />


                    <DataBox
                        icon="Cloud-Sun"
                        title="Clouds"
                        time="23 minutes 41 seconds ago" >

                        <p>Broken at 2000m</p>
                        <p>Scattered at 800m</p>
                        <p>Few at 300m</p>
                        <p>Few at 300m with ksdjf lsdajfl asda</p>

                    </DataBox>

                </div>

                <h2>Wind gust/avg over time</h2>

                <WeatherGraph
                    lines={[
                        {
                            key: "winds",
                            observations: this.pastSlice(this.state.windObservations.data),
                            forecasts: this.futureSlice(this.state.windForecasts.data)
                        },
                        {
                            key: "gusts",
                            observations: this.pastSlice(this.state.gustObservations.data),
                            forecasts: this.futureSlice(this.state.gustForecasts.data)
                        }
                    ]}
                />

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
    }

});

module.exports = Main;
