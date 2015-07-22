/** @jsx React.DOM */
var React = require('react');
React.initializeTouchEvents(true);
var _ = require("lodash");
var $ = require("jquery");
var url = require("url");

var ajaxPoller = require("./lib/ajaxPoller");
var Main = require("./components/Main");

var logo = document.getElementById("logo");
window.spinLogo =  _.debounce(function(gust) {
    if (gust < 8) logo.className = "";
    if (gust >= 8) logo.className = "swing";
    if (gust >= 11) logo.className = "spin";
}, 500);

function ensureDataArray(ob) {
    if (!ob) return { data: [] };
    if (!ob.data) ob.data = [];
    return ob;
}

function createWeatherApp(container, options) {
    $(".loading").remove();

    var main = <Main options={options} />;
    React.renderComponent(main, $(container).get(0));

    ajaxPoller(url.format({
            pathname: "/api/fmi/observations",
            query: _.extend({
                    parameters: "winddirection,windspeedms,windgust"
                }, options.fmiObservations)
    }), {
        onPoll: function(req) {
            fixData(req).then(function(res) {
                main.setState({
                    windObservations: ensureDataArray(res["obs-obs-1-1-windspeedms"]),
                    gustObservations: ensureDataArray(res["obs-obs-1-1-windgust"]),
                });
            });
        }
    });

    ajaxPoller(url.format({
            pathname: "/api/fmi/forecasts",
            query: _.extend({
                    parameters: "winddirection,windspeedms,windgust"
                }, options.fmiForecasts)
    }), {
        onPoll: function(req) {
            fixData(req).then(function(res) {
                main.setState({
                    windForecasts: ensureDataArray(res["mts-1-1-WindSpeedMS"]),
                    gustForecasts: ensureDataArray(res["mts-1-1-WindGust"])
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

setTimeout(function() {
    window.location.reload();
}, 1000 * 60 * 5);
