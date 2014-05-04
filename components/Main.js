/** @jsx React.DOM */

var React = require("react");
window.React = React;
var Winds = require("./CurrentWinds");
var Sunset = require("./Sunset");
var Clouds = require("./Clouds");
var DataBox = require("./DataBox");

/**
 * DzLocation
 *
 * @namespace components
 * @class DzLocation
 */
var DzLocation = React.createClass({
    getGoogleMapsURL: function() {
        return [
            "https://maps.google.com/maps?q=",
            this.props.lat,
            ",",
            this.props.lon,
            "+(",
            this.props.airportCode,
            ")&z=14&ll=",
            this.props.lat,
            ",",
            this.props.lon
        ].join("");
    },

    render: function() {
        return (
            <div>
                <p>
                    <span>{this.props.name} </span>
                    (<span>{this.props.airportCode}</span>)
                </p>
                <div className="footer-text">
                        <a href={this.getGoogleMapsURL()} target="_new" >
                        {this.props.lat}, {this.props.lon}
                        </a>
                </div>
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

                    <Clouds metar={this.state.metar} />

                    <Sunset
                        latitude={this.props.options.lat}
                        longitude={this.props.options.lon}
                    />

                    <DataBox
                        icon="location2"
                        title="Location" >
                        <DzLocation
                            airportCode={this.props.options.airportCode}
                            name={this.props.options.name}
                            lat={this.props.options.lat}
                            lon={this.props.options.lon}
                        />
                    </DataBox>

                    <DataBox
                        icon="info"
                        title="About" >
                        <div className="about">
                            <p>
                                NEVER BLINDLY TRUST THIS APPLICATION! This only
                                meant as an additional help when deciding
                                whether to skydive or not.  There are zero
                                guarantees that the data or the interpretation
                                is correct.
                            </p>
                            <p>
                                It is made by Esa-Matti Suuronen
                                during the weather holds. Feel free the contact
                                me at esa-matti@suuronen.org for any
                                suggestions or issues you have with it.
                                Usage of this application is free but if you
                                want to support its development you can buy me
                                a jump ticket (or beer) :)
                            </p>
                            <p>
                                The source code is licensed under the MIT
                                license and is hosted on <a
                                    href="https://github.com/epeli/skydivingweather">Github</a>.
                            </p>
                        </div>

                    </DataBox>

                </div>

            </div>
        );
    }

});

module.exports = Main;
