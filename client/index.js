if (!console) {
    window.console = {
        log: function() {},
        info: function() {},
        warn: function() {}
    };
}

var $ = require("./vendor/jquery");
window.jQuery = $; // Set for Backbone
var Backbone = require("backbone");
require("./vendor/moment_fi");


var Layout = require("./Layout");
var Weather = require("./Weather");

var settings = new Backbone.Model({ limit: 3 });
var weather = new Weather();
var layout = new Layout({
    model: weather,
    settings: settings
});

$("body").append(layout.el);

weather.once("change", function() {
    layout.render();
    weather.autoUpdate();
});
weather.fetch();
