var ViewMaster = require("./vendor/backbone.viewmaster");
var h = require("hyperscript");

var WindGraphOptions = ViewMaster.extend({

    constructor: function(options) {
        ViewMaster.prototype.constructor.apply(this, arguments);
        this.settings = options.settings;
    },

    getHourOptions: function() {
        return this.model.mapHours(function(hour) {
            return h("option", hour, " tuntia", { value: hour });
        });
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
