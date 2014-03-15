var d3 = require("d3");
var _ = require("underscore");
var Q = require("q");
Q.longStackSupport = true;
var createJQuery = require("jquery");
var Backbone = require("backbone");
Backbone.$ = createJQuery(window);

// http://examples.oreilly.com/0636920026938/chapter_09/20_axes_dynamic.html

var fetchJSON = Q.denodeify(d3.json);

var padding = 30;
var height = 400;
var width = window.innerWidth;


var el = document.querySelector("svg");
var svgContainer = d3.select(el)
    .attr("width", width)
    .attr("height", height)
    ;



console.log("loading");

function toDates(d) {
    return _.extend({}, {
        time: new Date(d.time),
        value: d.value
    });
}

function drawHorizontalLine(svgContainer, xScale, yScale, linePos, color) {
    svgContainer.append("line")
        .attr("x1", padding)
        .attr("y1", yScale(linePos))

        .attr("x2", width - padding)
        .attr("y2", yScale(linePos))

        .attr("stroke-width", 2)
        .attr("stroke", color)
        ;
}

function drawVerticalLine(svgContainer, xScale, yScale, linePos, color) {
    svgContainer.append("line")
        .attr("x1", xScale(linePos))
        .attr("y1", padding)

        .attr("x2", xScale(linePos))
        .attr("y2", height - padding)

        .attr("stroke-width", 1)
        .attr("stroke", color)
        ;
}

function defaultGetter(d) {
    return d;
}

function findClosest(value, arr, getter, _best) {
    getter = getter || defaultGetter;

    return arr.reduce(function(best, c) {
        if (Math.abs(getter(c) - value) < Math.abs(getter(best) - value)) {
            return c;
        } else {
            return best;
        }
    }, arr[0]);
}

function drawPath(svgContainer, xScale, yScale, observations, forecast, opts) {
    var allData = observations.concat(forecast);
    forecast = [_.last(observations)].concat(forecast);

    // svgContainer.selectAll("circle." + opts.klass)
    //     .data(allData)
    //     .enter()
    //     .append("circle")
    //     .attr("stroke", "red")
    //     .attr("fill", "none")
    //     .attr("stroke-width", "1")
    //     .attr("cx", function (d) {
    //         return xScale(d.time);
    //     })
    //     .attr("cy", function (d) {
    //         return yScale(d.value);
    //     })
    //     .attr("r", "5")
    //     ;

    var currentDoc = null;
    var cirle = svgContainer.append("circle")
        .attr("stroke", "red")
        .attr("fill", "none")
        .attr("stroke-width", "1")
        .attr("r", "5")
        ;

    var moveCircle = function(point) {
        var d = findClosest(xScale.invert(point), allData, function(d) {
            return d.time;
        });

        if (currentDoc && d.time === currentDoc.time) return;

        cirle
            .attr("cx", xScale(d.time))
            .attr("cy", yScale(d.value))
            .attr("stroke", "red")
            ;
    };

    moveCircle = _.throttle(moveCircle, 50);

    svgContainer.on("mouseout." + opts.klass, function() {
        console.log("OIUT");
        setTimeout(function() {
        cirle
            .attr("stroke", "none")
            ;
        }, 100);
    });

    svgContainer.on("mousemove." + opts.klass, function() {
        var point = d3.mouse(this)[0];
        moveCircle(point);
    });

    var lineFunction = d3.svg.line()
        .x(function(d) { return xScale(d.time.getTime()); })
        .y(function(d) { return yScale(d.value); })
        .interpolate("linear")
        ;

    svgContainer.append("path")
        .attr("d", lineFunction.interpolate("monotone")(observations))
        .attr("stroke", opts.color)
        .attr("stroke-width", 2)
        .attr("fill", "none")
        ;

    svgContainer.append("path")
        .attr("d", lineFunction.interpolate("monotone")(forecast))
        .attr("stroke", opts.color)
        .style("stroke-dasharray", ("3, 3"))
        .attr("stroke-width", 2)
        .attr("fill", "none")
        ;


    // var rectHeight = 40;
    // svgContainer.selectAll("rect." + opts.klass)
    //     .data(allData)
    //     .enter()
    //     .append("rect")
    //     .attr("fill", "transparent")
    //     .attr("stroke", "green")
    //     .attr("stroke-width", "0")
    //     .attr("fill-opacity", "0.2")
    //     .attr("x", function(d, i) {
    //         var current = d.time.getTime();
    //         var prev = (allData[i-1] || d).time.getTime();

    //         var diffToPrev = current - prev;
    //         return xScale(current - diffToPrev / 2);
    //     })
    //     .attr("width", function(d, i) {
    //         var current = d.time.getTime();
    //         var next = (allData[i+1] || d).time.getTime();
    //         var prev = (allData[i-1] || d).time.getTime();

    //         current = xScale(current);
    //         next = xScale(next);
    //         prev = xScale(prev);
    //         var diffToPrev = current - prev;
    //         var diffToNext = next - current;

    //         return diffToPrev/2 + diffToNext/2;

    //     })
    //     .attr("y", function(d) {
    //         return yScale(d.value) - rectHeight / 2;
    //     })
    //     .attr("height", rectHeight)
    //     .on("mouseover", function(d) {
    //         console.log("d", d);
    //         d3.select(this).attr("fill", "black");
    //         console.log("hovering");
    //     })
    //     .on("mouseout", function(d) {
    //         d3.select(this)
    //         .attr("fill", "transparent")
    //         ;
    //     })
    //     ;

}


var SvgView = require("./lib/SvgView");
var WeatherData = Backbone.Model.extend({

    parse: function(res, opts) {
        return res;
    }

});

var SvgPath = Backbone.View.extend({

    initialize: function(opts) {
        this.parent = opts.parent;
        this.sources = opts.sources;

        this.lineFn = d3.svg.line()
            .x(function(d) { return opts.parent.xScale(d.time.getTime()); })
            .y(function(d) { return opts.parent.yScale(d.value); })
            .interpolate("linear")
            ;

        this.listenTo(this.parent, "scalechange", this.update.bind(this));
    },

    render: function() {
        var self = this;

        this.sources.forEach(function(src) {
            src.selection = self.parent.selection.append("path")
                .attr("class", src.klass + " data")
                ;
        });

    },

    update: function() {
        var self = this;

        this.sources.forEach(function(src) {
            src.selection.attr("d",
                self.lineFn(self.parent.model.get(src.key).data)
            );
        });

    }


});



var model = new WeatherData();


function parse(res, klass) {
    Object.keys(res).forEach(function(k) {
        res[k].data.forEach(function(d) {
            d.time = new Date(d.time);
            d.value = parseInt(d.value, 10);
            d.klass = klass;
        });
    });
    return res;
}

var winds = new SvgView({
    el: document.querySelector("svg"),
    model: model,

    xScale: d3.scale.linear(),
    yScale: d3.scale.linear()
});

winds.render();


var gusts = new SvgPath({
    parent: winds,
    model: model,
    sources: [
        {
            key: "obs-obs-1-1-wg_10min",
            klass: "gust obs"
        },

        {
            key: "mts-1-1-WindGust",
            klass: "gust fc"
        }
    ]

});

gusts.render();

Q.all([
    fetchJSON("/api/fmi/observations?place=tikkakoski"),
    fetchJSON("/api/fmi/forecast?place=tikkakoski")
]).done(function(res) {
    setTimeout(function() {
        model.set(parse(res[0], "obs"), { silent: true });
        model.set(parse(res[1], "fc"));
    }, 0);
});



// Q.all([observations.fetch(), forecast.fetch()]).then(function() {
//     setTimeout(function() {
//     
//     var v = new SvgView({
//         el: document.querySelector("svg"),
//         observations: observations,
//         forecast: forecast,
// 
//         xScale: d3.scale.linear(),
//         yScale: d3.scale.linear()
//     });
//     v.render();
//     }, 0);
// }).done();

// Q.all([
//     fetchJSON("/api/fmi/observations?place=tikkakoski"),
//     fetchJSON("/api/fmi/forecast?place=tikkakoski")
// ]).spread(function(obs, forecast) {
//     var studentLimit = 8;
//     var licenseLimit = 11;
// 
//     var gustData = obs["obs-obs-1-1-wg_10min"].data.slice(0).map(toDates);
//     var gustForecast = forecast["mts-1-1-WindGust"].data.slice(0, 10).map(toDates);
// 
//     var windAvg = obs["obs-obs-1-1-ws_10min"].data.slice(0).map(toDates);
//     var windAvgForecast = forecast["mts-1-1-WindSpeedMS"].data.slice(0, 10).map(toDates);
// 
// 
// 
//     return;
// 
//     var all = gustData
//         .concat(gustForecast)
//         .concat(windAvg)
//         .concat(windAvgForecast)
//         ;
// 
//     var maxGust = d3.max(all, function(d) { return d.value; });
//     maxGust = Math.max(maxGust, licenseLimit+1);
// 
//     var startDate = d3.min(all, function(d) { return d.time.getTime(); });
// 
//     var endDate = d3.max(all, function(d) { return d.time.getTime(); });
// 
//     var xScale = d3.scale.linear()
//         .domain([startDate, endDate])
//         .range([padding, width - padding]);
// 
//     var yScale = d3.scale.linear()
//         .domain([0, maxGust])
//         .range([height - padding, padding])
//         ;
// 
//     var xAxis = d3.svg.axis()
//         .scale(xScale)
//         .orient("bottom")
//         .tickFormat(function(d) {
//             return d3.time.format("%H:%M")(new Date(d));
//         })
//         ;
// 
//     svgContainer.append("g")
//         .attr("class", "axis")
//         .attr("transform", "translate(0," + (height - padding) + ")")
//         .call(xAxis);
// 
//     var yAxis = d3.svg.axis()
//         .scale(yScale)
//         .orient("left")
//         ;
// 
//     svgContainer.append("g")
//         .attr("class", "axis")
//         .attr("transform", "translate(" + padding + ",0)")
//         .call(yAxis)
//         ;
// 
//     var yAxisRight = d3.svg.axis()
//         .scale(yScale)
//         .orient("right")
//         ;
// 
//     svgContainer.append("g")
//         .attr("class", "axis")
//         .attr("transform", "translate(" +  (width - padding) + ",0)")
//         .call(yAxisRight)
//         ;
// 
//     drawVerticalLine(svgContainer, xScale, yScale, Date.now(), "red");
//     drawHorizontalLine(svgContainer, xScale, yScale, studentLimit, "darkgray");
//     drawHorizontalLine(svgContainer, xScale, yScale, licenseLimit, "gray");
// 
//     drawPath(svgContainer, xScale, yScale, gustData, gustForecast, {
//         klass: "gust",
//         color: "black"
//     });
//     drawPath(svgContainer, xScale, yScale, windAvg, windAvgForecast, {
//         klass: "avg",
//         color: "gray"
//     });
// 
// 
// }).done();
// 
