
var url = require("url");
var Backbone = require("backbone");
var _ = require("underscore");

var MAX_AGE = 15 * 60 * 1000; // minutes

module.exports = Backbone.Model.extend({

    url: function() {
        var pathParts = window.location.pathname.split("/");
        var apiQuery = {};
        // assumes /searchkey/searchvalue
        apiQuery[pathParts[1]] = pathParts[2];

        var current = url.parse(window.location);

        var apiurl =  url.format({
            protocol: current.protocol,
            host: current.host,
            pathname: "/api/observations",
            query: apiQuery
        });

        console.log("request to", apiurl);

        return apiurl;
    },

    nextUpdateIn: function() {
        var next = MAX_AGE - this.getDataAge();
        if (next < 0) next = 0;
        next += 1000*10;
        return next;
    },

    autoUpdate: function() {
        var next = this.nextUpdateIn();
        console.log("Next update in", next/1000/60, "minutes");

        var recur = this.autoUpdate.bind(this);
        setTimeout(function() {
            this.fetch({success: recur, error: recur});
        }.bind(this), next);
    },

    getTimeScale: function() {
        var gusts = this.get("windGusts").data;
        var first = new Date(_.first(gusts).time);
        var last =  new Date(_.last(gusts).time);
        return last.getTime() - first.getTime();
    },

    getStationName: function() {
        return this.get("windGusts").stationName;
    },

    getDataAge: function() {
        var last = _.last(this.get("windGusts").data);
        return Date.now() - new Date(last.time).getTime();
    },

    isDataOld: function() {
        var age = this.getDataAge();
        console.log("Data for", this.getStationName(),  "is", age/1000/60, "minutes old");
        return age > MAX_AGE;
    }

});
