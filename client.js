/** @jsx React.DOM */
var React = require('react');
var d3 = require("d3");
var Promise = require("bluebird");
var _ = require("lodash");
var $ = require("jquery");
var url = require("url");

var Main = require("./components/Main");

var fetchJSON = Promise.promisify(d3.json.bind(d3));
var loadingScreen = $(".loading");
loadingScreen.remove();

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

    var main = <Main options={options} />;

    function cast(d) {
        return _.extend({}, {
            time: new Date(d.time),
            value: parseFloat(d.value, 10)
        });
    }

    function errorLogger(err) {
        console.log("Failed to load data", err);
    }

    obs.then(function(data) {

        _.forEach(data, function(val) {
            val.data = val.data.map(cast);
        });

        console.log("observations loaded");
        main.setState({
            windObservations: data["obs-obs-1-1-windspeedms"],
            gustObservations: data["obs-obs-1-1-windgust"],
        });



    }).catch(errorLogger);

    fore.then(function(data) {

        _.forEach(data, function(val) {
            val.data = val.data.map(cast);
        });

        console.log("forecasts loaded");
        main.setState({
            windForecasts: data["mts-1-1-WindSpeedMS"],
            gustForecasts: data["mts-1-1-WindGust"]
        });

    }).catch(errorLogger);

    React.renderComponent(main, $(container).get(0));
}


window.createWeatherApp = createWeatherApp;
