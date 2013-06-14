var ViewMaster = require("./vendor/backbone.viewmaster");
var h = require("hyperscript");

var WindGraphOptions = ViewMaster.extend({

    constructor: function(options) {
        ViewMaster.prototype.constructor.apply(this, arguments);
        this.settings = options.settings;
    },

    getHourOptions: function() {
        var hours = parseInt(this.model.getTimeScale() / 1000 / 60 / 60, 10);
        var options = [];
        for (var i = 1; i <= hours; i += 1) {
          options.push(h("option", i, " tuntia", {
            value: i,
            selected: i === this.settings.get("limit")
          }));
        }
        return options;
    },

    template: function() {
        return h("label", "Näytä",
            h("select", this.getHourOptions())
        );
    },

    events: {
        "change select": function(e) {
            this.settings.set("limit", parseInt(e.target.value, 10));
        }
    }

});


module.exports = WindGraphOptions;
