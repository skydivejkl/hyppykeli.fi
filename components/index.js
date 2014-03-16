/** @jsx React.DOM */
var React = require('react');
var d3 = require("d3");
var Promise = require("bluebird");
var _ = require("lodash");

var Main = require("./Main");

var fetchJSON = Promise.promisify(d3.json.bind(d3));

var obs = fetchJSON("/api/fmi/observations?place=tikkakoski&parameters=winddirection,windspeedms,windgust");
var fore = fetchJSON("/api/fmi/forecasts?place=tikkakoski&parameters=winddirection,windspeedms,windgust");

var main = <Main />;

function cast(d) {
    return _.extend({}, {
        time: new Date(d.time),
        value: parseFloat(d.value, 10)
    });
}

Promise.all([obs, fore])
.spread(function(observations, forecasts) {
    setTimeout(function() {
        console.log(observations, forecasts);
        // {obs-obs-1-1-winddirection: Object, obs-obs-1-1-windspeedms: Object, obs-obs-1-1-windgust: Object}
        // {mts-1-1-WindDirection: Object, mts-1-1-WindSpeedMS: Object, mts-1-1-WindGust: Object}

        console.log("Setting main state");
        main.setState({
            data: {
                windSpeeds: {
                    observations: observations["obs-obs-1-1-windspeedms"].data.map(cast),
                    forecasts: forecasts["mts-1-1-WindSpeedMS"].data.map(cast),
                },
                windGusts: {
                    observations: observations["obs-obs-1-1-windgust"].data.map(cast),
                    forecasts: forecasts["mts-1-1-WindGust"].data.map(cast)
                }
            }
        });

    }, 1);
})
.catch(function(err) {
    console.error("Failed to fetch data", err);
});

React.renderComponent(main, document.body);

