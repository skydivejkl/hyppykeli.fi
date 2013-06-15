
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
            h("h1", this.model.getStationName()),
            h("div.graph-container"),
            h("footer",
                h("p",
                    "Data on haettu Ilmatieteenlaitoksen avoimista rajapinnoista. ",
                    "Niiden tulkinnan oikellisuudesta ei ole kuitenkaan mitään takeita. "
                 ),

                h("p",
                    "Be safe, blue skies!"
                 ),

                h("p",
                    "Tämä sovellus on ",
                    h("a", "avointa lähdekoodia",
                        { href: "https://github.com/epeli/hyppykeli/" }),
                    " ja sitä ylläpitää ",
                    h("a", "Esa-Matti Suuronen", { href: "http://esa-matti.suuronen.org" }),
                    "."
                 )
            )
        );
    }


});

module.exports = Layout;
