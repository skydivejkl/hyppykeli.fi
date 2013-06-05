
var $ = require("./vendor/jquery");
window.jQuery = $; // Set for Backbone
var Backbone = require("backbone");
var WindGraph = require("./wind_graph_view");

$.getJSON("/api/Tikkakoski/observations", function(data) {
    var weather = new Backbone.Model(data);
    var graph = new WindGraph({
        model: weather
    });

    $("body").append(graph.el);
    graph.render();
});
