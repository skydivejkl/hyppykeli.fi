/** @jsx React.DOM */
var React = require('react');
React.initializeTouchEvents(true);
var _ = require("lodash");
var $ = require("jquery");
var url = require("url");

var ajaxPoller = require("./lib/ajaxPoller");
var Main = require("./components/Main");


function createWeatherApp(container, options) {
    $(".loading").remove();

    var main = <Main options={options} />;
    React.renderComponent(main, $(container).get(0));

    ajaxPoller(url.format({
            pathname: "/api/fmi/observations",
            query: {
                geoid: options.geoid,
                parameters: "winddirection,windspeedms,windgust"
            }
    }), {
        onPoll: function(req) {
            fixData(req).then(function(res) {
                main.setState({
                    windObservations: res["obs-obs-1-1-windspeedms"],
                    gustObservations: res["obs-obs-1-1-windgust"],
                });
            });
        }
    });

    ajaxPoller(url.format({
            pathname: "/api/fmi/forecasts",
            query: {
                geoid: options.geoid,
                parameters: "winddirection,windspeedms,windgust"
            }
    }), {
        onPoll: function(req) {
            fixData(req).then(function(res) {
                main.setState({
                    windForecasts: res["mts-1-1-WindSpeedMS"],
                    gustForecasts: res["mts-1-1-WindGust"]
                });
            });
        }
    });

    ajaxPoller("/api/metar/" + options.airportCode, {
        onPoll: function(req) {
            req.then(function(res) {
                res.time = new Date(res.time);
                main.setState({
                    metar: res
                });
            });
        }
    });

}

function fixData(req) {
    return req.then(function(val) {

        _.forEach(val, function(val) {
            val.data = val.data.map(function(d) {
                return _.extend({}, {
                    time: new Date(d.time),
                    value: parseFloat(d.value, 10)
                });
            }).filter(function(d) {
                // fmi data some times has "nan" as the value
                return !_.isNaN(d.value);
            });
        });

        return val;
    }).catch(function(err) {
        console.error("Failed to get data", err);
        return {};
    });
}


window.createWeatherApp = createWeatherApp;
