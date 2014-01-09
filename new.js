var d3 = require("d3");
var _ = require("underscore");
var Q = require("q");
// http://examples.oreilly.com/0636920026938/chapter_09/20_axes_dynamic.html

var fetchJSON = Q.denodeify(d3.json);

var padding = 30;
var height = 400;
var width = window.innerWidth;

//The SVG Container
var svgContainer = d3.select(".container")
    .append("svg")
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

function drawPath(svgContainer, xScale, yScale, observations, forecast, opts) {
    var allData = observations.concat(forecast);
    forecast = [_.last(observations)].concat(forecast);

    svgContainer.selectAll("circle." + opts.klass)
        .data(allData)
        .enter()
        .append("circle")
        .attr("stroke", "red")
        .attr("fill", "none")
        .attr("stroke-width", "1")
        .attr("cx", function (d) {
            return xScale(d.time);
        })
        .attr("cy", function (d) {
            return yScale(d.value);
        })
        .attr("r", "5")
        ;

    var lineFunction = d3.svg.line()
        .x(function(d) { return xScale(d.time.getTime()); })
        .y(function(d) { return yScale(d.value); })
        .interpolate("linear")
        ;

    svgContainer.append("path")
        .attr("d", lineFunction(observations))
        .attr("stroke", opts.color)
        .attr("stroke-width", 2)
        .attr("fill", "none")
        ;

    svgContainer.append("path")
        .attr("d", lineFunction.interpolate("cardinal")(forecast))
        .attr("stroke", opts.color)
        .style("stroke-dasharray", ("3, 3"))
        .attr("stroke-width", 2)
        .attr("fill", "none")
        ;


    var rectHeight = 40;
    svgContainer.selectAll("rect." + opts.klass)
        .data(allData)
        .enter()
        .append("rect")
        .attr("fill", "transparent")
        .attr("stroke", "green")
        .attr("stroke-width", "0")
        .attr("fill-opacity", "0.2")
        .attr("x", function(d, i) {
            var current = d.time.getTime();
            var prev = (allData[i-1] || d).time.getTime();

            var diffToPrev = current - prev;
            return xScale(current - diffToPrev / 2);
        })
        .attr("width", function(d, i) {
            var current = d.time.getTime();
            var next = (allData[i+1] || d).time.getTime();
            var prev = (allData[i-1] || d).time.getTime();

            current = xScale(current);
            next = xScale(next);
            prev = xScale(prev);
            var diffToPrev = current - prev;
            var diffToNext = next - current;

            return diffToPrev/2 + diffToNext/2;

        })
        .attr("y", function(d) {
            return yScale(d.value) - rectHeight / 2;
        })
        .attr("height", rectHeight)
        .on("mouseover", function(d) {
            console.log("d", d);
            d3.select(this).attr("fill", "black");
            console.log("hovering");
        })
        .on("mouseout", function(d) {
            d3.select(this)
            .attr("fill", "transparent")
            ;
        })
        ;

}

Q.all([
    fetchJSON("/api/fmi/observations?place=tikkakoski"),
    fetchJSON("/api/fmi/forecast?place=tikkakoski")
]).spread(function(obs, forecast) {
    var studentLimit = 8;
    var licenseLimit = 11;

    var gustData = obs["obs-obs-1-1-wg_10min"].data.slice(0).map(toDates);
    var gustForecast = forecast["mts-1-1-WindGust"].data.slice(0, 10).map(toDates);

    var windAvg = obs["obs-obs-1-1-ws_10min"].data.slice(0).map(toDates);
    var windAvgForecast = forecast["mts-1-1-WindSpeedMS"].data.slice(0, 10).map(toDates);

    var all = gustData
        .concat(gustForecast)
        .concat(windAvg)
        .concat(windAvgForecast)
        ;

    var maxGust = d3.max(all, function(d) { return d.value; });
    maxGust = Math.max(maxGust, licenseLimit+1);
    console.log("max gust", maxGust);

    var startDate = d3.min(all, function(d) { return d.time.getTime(); });

    var endDate = d3.max(all, function(d) { return d.time.getTime(); });

    var xScale = d3.scale.linear()
        .domain([startDate, endDate])
        .range([padding, width - padding]);

    var yScale = d3.scale.linear()
        .domain([0, maxGust])
        .range([height - padding, padding])
        ;

    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient("bottom")
        .tickFormat(function(d) {
            return d3.time.format("%H:%M")(new Date(d));
        })
        ;

    svgContainer.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + (height - padding) + ")")
        .call(xAxis);

    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("left")
        ;

    svgContainer.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(" + padding + ",0)")
        .call(yAxis)
        ;

    var yAxisRight = d3.svg.axis()
        .scale(yScale)
        .orient("right")
        ;

    svgContainer.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(" +  (width - padding) + ",0)")
        .call(yAxisRight)
        ;

    drawVerticalLine(svgContainer, xScale, yScale, Date.now(), "red");
    drawHorizontalLine(svgContainer, xScale, yScale, studentLimit, "darkgray");
    drawHorizontalLine(svgContainer, xScale, yScale, licenseLimit, "gray");

    drawPath(svgContainer, xScale, yScale, gustData, gustForecast, {
        klass: "gust",
        color: "black"
    });
    drawPath(svgContainer, xScale, yScale, windAvg, windAvgForecast, {
        klass: "avg",
        color: "gray"
    });


}).done();

