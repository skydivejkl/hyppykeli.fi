
var Backbone = require("backbone");
var d3 = require("d3");

var SvgPath = Backbone.View.extend({

    constructor: function() {
        Backbone.View.prototype.apply.constructor(this, arguments);


        this.listenTo(this.model, "scalechange", this.render.bind(this));

        var self = this;
        this.lineFunction = d3.svg.line()
            .x(function(d) { return self.model.xScale(d.time.getTime()); })
            .y(function(d) { return self.model.yScale(d.value); })
            .interpolate("linear")
            ;
    },

    render: function() {
        this.svg = d3.select(this.el);

        this.svg.append("path")
            .attr("d", this.lineFunction(this.model.get("obs-obs-1-1-wg_10min"))
            .attr("stroke", "black")
            .attr("stroke-width", 2)
            .attr("fill", "none")
            ;

        this.svg.append("path")
            .attr("d", this.lineFunction.interpolate("cardinal")(forecast))
            .attr("stroke", "black")
            .style("stroke-dasharray", ("3, 3"))
            .attr("stroke-width", 2)
            .attr("fill", "none")
            ;

    }



});
