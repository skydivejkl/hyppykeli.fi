/** @jsx React.DOM */
var React = require("react");
var moment = require("moment");
var s = require("underscore.string");

var DataBox = require("./DataBox");

var Clouds = React.createClass({

    renderClouds: function(cloud) {
        if (!this.props.metar) return;

        if (this.props.metar.cavok) return <p>No clouds under 1500 m (CAVOK)</p>;

        if (!this.props.metar.clouds) return <p>No clouds?</p>;

        return this.props.metar.clouds.map(function(cloud) {
            var altitude = Math.round(cloud.altitude * 0.3048);
            return (
                <p>
                    {s.capitalize(cloud.meaning)} at {altitude} m
                </p>
            );
        });
    },

    render: function() {
        if (!this.props.metar) return <p>Loading...</p>;

        return (
            <DataBox
                icon="Cloud-Sun"
                title="Clouds" >

                {this.renderClouds()}

                <div className="footer-text">
                    <p>{moment(this.props.metar.time).fromNow()}</p>
                    <p><a href="http://weather.noaa.gov/pub/data/observations/metar/stations/">Source</a>: METAR</p>
                    <p className="metar">{this.props.metar.raw}</p>
                </div>


            </DataBox>

        );
    }

});

module.exports = Clouds;
