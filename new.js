var d3 = require("d3");
var _ = require("underscore");


//The SVG Container
var svgContainer = d3.select("body")
    .append("svg")
    .attr("width", window.innerWidth - 100)
    .attr("height", 400)
    ;


var windSpeedGroup = svgContainer.append("g")
    .attr("transform", "translate(0, 100)")
    ;


console.log("loading");
d3.json("/api/observations?place=tikkakoski", function(err, data) {
    console.log(err, data);
    var studentLimit = 8;
    var licenseLimit = 11;




    var gustData = data.windGusts.data.map(function(d) {
        return _.extend({}, {
            time: new Date(d.time),
            value: d.value
        });
    });



    var maxGust = d3.max(gustData, function(d) { return d.value; });
    maxGust = Math.max(maxGust, licenseLimit);

    var startDate = d3.min(gustData, function(d) {
        return d.time.getTime();
    });

    var endDate = d3.max(gustData, function(d) {
        return d.time.getTime();
    });

    var xScale = d3.scale.linear()
        .domain([startDate, endDate])
        .range([0, svgContainer.attr("width")]);

    var yScale_ = d3.scale.linear()
        .domain([0, maxGust])
        .range([0,svgContainer.attr("height")])
        ;

    var yScale = (function() {
        return function(val) {
            return svgContainer.attr("height") - yScale_(val);
        };
    })();

    var reverseLookup = d3.scale.linear()
        .domain([0, svgContainer.attr("width")])
        .range([0, gustData.length]);

    console.log("gust point", gustData.length);
    svgContainer.on("mousemove", function() {
        var point = d3.mouse(this);
        var index = Math.round(reverseLookup(point[0]));
        console.log("index", index);
        console.log(gustData[index-1].value);
    });

    var lineFunction = d3.svg.line()
        .x(function(d) { return xScale(d.time.getTime()); })
        .y(function(d) { return yScale(d.value); })
        .interpolate("linear");

    windSpeedGroup.append("path")
        .attr("d", lineFunction(gustData))
        .attr("stroke", "blue")
        .attr("stroke-width", 2)
        .attr("fill", "none")
        ;

    function drawHorizontalLine(height, color) {

        windSpeedGroup.append("line")
            .attr("x1", 0)
            .attr("y1", yScale(height))

            .attr("x2", svgContainer.attr("width"))
            .attr("y2", yScale(height))

            .attr("stroke-width", 2)
            .attr("stroke", color)
            ;
    }

    drawHorizontalLine(studentLimit, "yellow");
    drawHorizontalLine(licenseLimit, "red");

});

