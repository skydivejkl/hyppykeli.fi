/** @jsx React.DOM */

var React = require("react");
window.React = React;
var _ = require("lodash");
var Winds = require("./CurrentWinds");
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
            <div className="location">
                <h4>
                    {this.props.name}
                </h4>
                <table>
                    <tr>
                        <th>Name</th>
                        <td>{this.props.location.name}</td>
                    </tr>
                    <tr>
                        <th>fmisid</th>
                        <td>{this.props.location.fmisid}</td>
                    </tr>
                </table>
            </div>
        );
    }

});


var Main = React.createClass({

    getInitialState: function() {
        return {
            windObservations: { data: [] },
            gustObservations: { data: [] },
            windForecasts: { data: [] },
            gustForecasts: { data: [] }
        };
    },

    render: function() {
        return (
            <div>
                <div className="cf weather-boxes">

                    <Winds
                        windObservations={this.state.windObservations}
                        windForecasts={this.state.windForecasts}
                        gustObservations={this.state.gustObservations}
                        gustForecasts={this.state.gustForecasts}
                    />

                    <Sunset
                        latitude={this.props.options.lat}
                        longitude={this.props.options.lon}
                    />

                    <Clouds metar={this.state.metar} />

                </div>


                <div className="locations" id="stations">
                    <h3>Weather stations</h3>
                    <Location name="Wind average observations" location={this.state.windObservations.location} />
                    <Location name="Wind average forecasts" location={this.state.windForecasts.location} />
                    <Location name="Gust observations" location={this.state.gustObservations.location} />
                    <Location name="Gust forecasts" location={this.state.gustForecasts.location} />
                </div>
            </div>
        );
    }

});

module.exports = Main;
