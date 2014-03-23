/** @jsx React.DOM */
var React = require("react");
var moment= require("moment");
var SunCalc = require("suncalc");
var s = require("underscore.string");

var DataBox = require("./DataBox");

var Sunset = React.createClass({

    componentDidMount: function() {
        setInterval(this.forceUpdate.bind(this), 1000 * 30);
    },

    render: function() {

        var sunset = SunCalc.getTimes(
            new Date(),
            this.props.latitude,
            this.props.longitude
        ).sunset;

        return (
            <DataBox
                icon="Sunset"
                title="Sunset"
                time={"at " + moment(sunset).format("HH:mm")} >
                <p>{s.capitalize(moment(sunset).fromNow())}</p>

            </DataBox>
        );
    }
});

module.exports = Sunset;
