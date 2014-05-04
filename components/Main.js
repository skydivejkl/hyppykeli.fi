/** @jsx React.DOM */

var React = require("react");
var _ = require("lodash");

var WeatherGraph = require("./WeatherGraph");
var Slider = require("./Slider");
var CurrentWinds = require("./CurrentWinds");
var Sunset = require("./Sunset");
var Clouds = require("./Clouds");


/**
 * Location
 *
 * @namespace components
 * @class Location
 */
var Location = React.createClass({

    render: function() {
        if (!this.props.location) return <script></script>;
        return (
            <table className="location">
                <tr>
                    <th>
                    {this.props.name}
                    </th>
                </tr>
                <tr>
                    <th>Name</th>
                    <td>{this.props.location.name}</td>
                </tr>
                <tr>
                    <th>fmisid</th>
                    <td>{this.props.location.fmisid}</td>
                </tr>
            </table>
        );
    }

});



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

                    <Clouds metar={this.state.metar} />

                </div>

                <h2>Wind over time</h2>


                <WeatherGraph
                    lines={[
                        {
                            title: "Gusts",
                            observations: this.pastSlice(this.state.gustObservations.data),
                            forecasts: this.futureSlice(this.state.gustForecasts.data)
                        },
                        {
                            title: "Wind",
                            observations: this.pastSlice(this.state.windObservations.data),
                            forecasts: this.futureSlice(this.state.windForecasts.data)
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

                <div className="locations" id="stations">
                    <h3>Weather stations</h3>
                    <Location name="Wind observations" location={this.state.windObservations.location} />
                    <Location name="Wind forecasts" location={this.state.windForecasts.location} />
                    <Location name="Gust observations" location={this.state.gustObservations.location} />
                    <Location name="Gust forecasts" location={this.state.gustForecasts.location} />
                </div>
            </div>
        );
    }

});

module.exports = Main;
