var d3 = require("d3");
var _ = require("underscore");
var Q = require("q");

var fetchJSON = Q.denodeify(d3.json);

var padding = 30;
var height = 400;
var width = window.innerWidth - 100;

//The SVG Container
var svgContainer = d3.select(".container")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    ;


var windSpeedGroup = svgContainer.append("g");

console.log("loading");

function toDates(d) {
    return _.extend({}, {
        time: new Date(d.time),
        value: d.value
    });
}


Q.all([
    fetchJSON("/api/fmi/observations?place=tikkakoski"),
    fetchJSON("/api/fmi/forecast?place=tikkakoski")
]).spread(function(obs, forecast) {
    var studentLimit = 8;
    var licenseLimit = 11;


    var gustData = obs["obs-obs-1-1-wg_10min"].data.map(toDates);
    var gustForecast = forecast["mts-1-1-WindGust"].data.slice(0, 10).map(toDates);

    var maxGust = d3.max(
        gustData.concat(gustForecast),
        function(d) { return d.value; }
    );
    maxGust = Math.max(maxGust, licenseLimit+1);
    console.log("max gust", maxGust);

    var startDate = d3.min(gustData, function(d) {
        return d.time.getTime();
    });

    var endDate = d3.max(gustData.concat(gustForecast), function(d) {
        return d.time.getTime();
    });

    var xScale = d3.scale.linear()
        .domain([startDate, endDate])
        .range([padding, width - padding]);

    var yScale = d3.scale.linear()
        .domain([0, maxGust])
        .range([height - padding, padding])
        ;


    // var reverseLookup = d3.scale.linear()
    //     .domain([0, svgContainer.attr("width")])
    //     .rangeRound([0, gustData.length]);

    // console.log("gust point", gustData.length);
    // svgContainer.on("mousemove", function() {
    //     var point = d3.mouse(this);
    //     // var index = Math.round(reverseLookup(point[0]));
    //     console.log("index", reverseLookup(point[0]));
    //     // console.log(gustData[index-1].value);
    // });

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


    var lineFunction = d3.svg.line()
        .x(function(d) { return xScale(d.time.getTime()); })
        .y(function(d) { return yScale(d.value); })
        .interpolate("linear");

    windSpeedGroup.append("path")
        .attr("d", lineFunction(gustData))
        .attr("stroke", "black")
        .attr("stroke-width", 2)
        .attr("fill", "none")
        ;

    windSpeedGroup.append("path")
        .attr("d", lineFunction(gustForecast))
        .attr("stroke", "black")
        .style("stroke-dasharray", ("3, 3"))
        .attr("stroke-width", 2)
        .attr("fill", "none")
        ;

    var lastObs = _.last(gustData);
    var firstForecast = _.first(gustForecast);

    windSpeedGroup.append("line")
        .attr("x1", xScale(lastObs.time))
        .attr("y1", yScale(lastObs.value))

        .attr("x2", xScale(firstForecast.time))
        .attr("y2", yScale(firstForecast.value))

        .attr("stroke-width", 2)
        .style("stroke-dasharray", ("3, 3"))
        .attr("stroke", "black")
        ;

    function drawHorizontalLine(linePos, color) {
        windSpeedGroup.append("line")
            .attr("x1", padding)
            .attr("y1", yScale(linePos))

            .attr("x2", width - padding)
            .attr("y2", yScale(linePos))

            .attr("stroke-width", 2)
            .attr("stroke", color)
            ;
    }

    function drawVerticalLine(linePos, color) {
        windSpeedGroup.append("line")
            .attr("x1", xScale(linePos))
            .attr("y1", padding)

            .attr("x2", xScale(linePos))
            .attr("y2", height - padding)

            .attr("stroke-width", 1)
            .attr("stroke", color)
            ;
    }

    drawVerticalLine(Date.now(), "red");

    drawHorizontalLine(studentLimit, "darkgray");
    drawHorizontalLine(licenseLimit, "gray");

}).done();

