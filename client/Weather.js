
var Backbone = require("backbone");

module.exports = Backbone.Model.extend({

    getTimeScale: function() {
        var gusts = this.get("windGusts").data;
        var first = new Date(gusts[0].time);
        var last =  new Date(gusts[gusts.length-1].time);
        return last.getTime() - first.getTime();
    },

    getStationName: function() {
        return this.get("windGusts").stationName;
    }

});
