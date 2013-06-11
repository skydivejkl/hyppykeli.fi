
var Backbone = require("backbone");

module.exports = Backbone.Model.extend({

    mapHours: function(fn) {
        return [
            fn(1),
            fn(2),
            fn(3),
            fn(4),
            fn(5),
            fn(12)
        ];
    },

    getStationName: function() {
        return this.get("windGusts").stationName;
    }

});
