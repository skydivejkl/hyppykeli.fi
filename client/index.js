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
var Weather = require("../models/Weather");
var LocalStorageModel = require("../models/LocalStorageModel");

var settings = new LocalStorageModel({ limit: 3 }, {
    key: "settings"
});
var weather = new Weather();
var layout = new Layout({
    model: weather,
    settings: settings
});

$("body").append(layout.el);

var loading = $(".loading");
loading.text("Ladataan Ilmatieteenlaitoksen dataa...");

weather.on("error", function(m, xhr) {
    console.error("fetch failed", xhr.responseJSON);
    layout.remove();
    $("body").text("FMI:n datan lataus epäonnistui :(");
});

weather.once("change", function() {
    loading.remove();
    layout.render();
    weather.autoUpdate();
});
weather.fetch();
