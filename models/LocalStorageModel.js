
var Backbone = require("backbone");
var _ = require("underscore");

var LocalStorageModel = Backbone.Model.extend({

    constructor: function(attrs, options) {
        this.key = options.key;

        attrs = _.extend({}, attrs, this.loadLocalStorage());

        Backbone.Model.prototype.constructor.call(this, attrs);

        this.on("change", function() {
            console.log("saving");
            localStorage[this.key] = JSON.stringify(this.toJSON());
        }, this);
    },

    loadLocalStorage: function() {
        var data = localStorage[this.key];
        if (!data) return;
        try {
            return JSON.parse(data);
        } catch(err) {
            console.error("failed to parse json from local storage", err);
            return;
        }
    }

});

module.exports = LocalStorageModel;
