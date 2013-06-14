
var ViewMaster = require("./vendor/backbone.viewmaster");
var WindGraph = require("./WindGraph");
var h = require("hyperscript");

var Layout = ViewMaster.extend({

    className: "layout",

    constructor: function(options) {
        ViewMaster.prototype.constructor.apply(this, arguments);
        this.settings = options.settings;
        this.setView(".graph-container", new WindGraph({
            model: this.model,
            settings: this.settings
        }));
    },

    template: function() {
        return h("div",
            h("h1", "Havaintoasema ", this.model.getStationName()),
            h("div.graph-container")
        );
    }


});

module.exports = Layout;
