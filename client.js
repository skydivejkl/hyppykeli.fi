/** @jsx React.DOM */
var React = require('react');
var d3 = require("d3");
var Promise = require("bluebird");
var _ = require("lodash");
var $ = require("jquery");
var url = require("url");

var Main = require("./components/Main");

var fetchJSON = Promise.promisify(d3.json.bind(d3));

function createWeatherApp(container, options) {

    var obs = fetchJSON(url.format({
        pathname: "/api/fmi/observations",
        query: {
            geoid: options.geoid,
            parameters: "winddirection,windspeedms,windgust"
        }
    }));

    var fore = fetchJSON(url.format({
        pathname: "/api/fmi/forecasts",
        query: {
            geoid: options.geoid,
            parameters: "winddirection,windspeedms,windgust"
        }
    }));

    var main = <Main />;

    function cast(d) {
        return _.extend({}, {
            time: new Date(d.time),
            value: parseFloat(d.value, 10)
        });
    }

    var removeSpinner = _.once(function() {
        $(".loading").remove();
    });


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
            }, removeSpinner);

        }, 1);
    })
    .catch(function(err) {
        console.error("Failed to fetch data", err);
    });

    React.renderComponent(main, $(container).get(0));
}


window.createWeatherApp = createWeatherApp;
