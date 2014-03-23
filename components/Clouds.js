/** @jsx React.DOM */
var React = require("react");
var moment = require("moment");
var s = require("underscore.string");

var DataBox = require("./DataBox");

var Clouds = React.createClass({

    renderClouds: function(cloud) {
        if (!this.props.metar) return;

        if (this.props.metar.cavok) return <p>CAVOK</p>;

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
                title="Clouds"
                time={moment(this.props.metar.time).fromNow()} >

                {this.renderClouds()}

            </DataBox>

        );
    }

});

module.exports = Clouds;
