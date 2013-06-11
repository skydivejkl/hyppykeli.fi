if (!console) {
    window.console = {
        log: function() {},
        info: function() {},
        warn: function() {}
    };
}

var url = require("url");
var $ = require("./vendor/jquery");
window.jQuery = $; // Set for Backbone
var Backbone = require("backbone");
var Layout = require("./Layout");
var Weather = require("./Weather");


var pathParts = window.location.pathname.split("/");
var apiQuery = {};
// assumes /searchkey/searchvalue
apiQuery[pathParts[1]] = pathParts[2];
var apiUrl = url.format({
    pathname: "/api/observations",
    query: apiQuery
});


var settings = new Backbone.Model();


console.log("API requesto to", apiUrl);
$.getJSON(apiUrl, function(data) {
    var weather = new Weather(data);
    var layout = new Layout({
        settings: settings,
        model: weather
    });

    $("body").append(layout.el);
    layout.render();
});
