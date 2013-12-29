

var d3 = require("d3");
var _ = require("underscore");

var weather = null;

function draw() {
    if (!weather) return;
    var width = window.innerWidth - 50;
    var height = window.innerHeight - 50;

    var minWind = 0;
    var maxWind = d3.max(weather.windGusts.data, function(d) {
        return d.value;
    });
    console.log("max wind", maxWind);

    var minWind_ = d3.min(weather.windGusts.data, function(d) {
        return d.value;
    });

    var startTime = d3.max(weather.windGusts.data, function(d) {
        return d.time;
    });
    var endTime = d3.min(weather.windGusts.data, function(d) {
        return d.time;
    });

    var minCloudHeight = 0;
    var maxCloudHeight = 1600;

    var cloudGraphSize = height * 0.5;


    d3.select("svg").remove();
    var svgContainer = d3.select("body")
        .append("svg")
        .attr("width", width + 20)
        .attr("height", height + 20)
        .style("border", "1px solid green");



    var cloudsScale = d3.scale.linear()
        .domain([minCloudHeight, maxCloudHeight])
        .range([cloudGraphSize, 10]);

    var cloudAxis = d3.svg.axis()
        .scale(cloudsScale)
        .orient("right")
        .tickFormat(function(altitude) {
           return altitude + " m";
        });


    var windScale = d3.scale.linear()
        .domain([maxWind, minWind])
        .range([cloudGraphSize+50, height]);

    var timeScale = d3.scale.linear()
        .domain([startTime, endTime])
        .range([50, width-10]);

    var windAxis = d3.svg.axis()
        .scale(windScale)
        .orient("right")
        .tickFormat(function(altitude) {
            return altitude + " m/s";
        });

    svgContainer.append("g")
        .attr("class", "y axis")
        .attr("class", "wind-axis")
        .call(windAxis);

    svgContainer.append("g")
        .attr("class", "y axis")
        .attr("class", "cloud-axis")
        .call(cloudAxis);



    var lineFunction = d3.svg.line()
        .x(function(d) {
            return timeScale(d.time);
        })
        .y(function(d) {
            console.log(d.value);
            return windScale(d.value);
        })
        // .interpolate("cardinal");
        .interpolate("monotone");

    svgContainer.selectAll("circle")
        .data(weather.windGusts.data)
        .enter()
        .append("circle")
        .attr("r", 2)
        .attr("cx", function(d) {
            return timeScale(d.time);
        })
        .attr("cy", function(d) {
            return windScale(d.value);
        }).on("mouseover", function(d) {
            console.log(d);
        });

    svgContainer
        // .on("mousemove", function() {
        //     var current = windScale.invert(d3.event.y);
        //     console.log(minWind_, maxWind, current);
        //     // console.log(windScale.invert(d3.event.y), maxWind, val);
        // })
        .append("path")
        .attr("d", lineFunction(weather.windGusts.data))
        .attr("stroke", "blue")
        .attr("stroke-width", 2)
        .attr("fill", "none");

}

window.onresize = _.debounce(draw, 500);

d3.json("/api/observations?place=tikkakoski", function(err, data) {
    if (err) {
        throw err;
    }
    weather = data;
    weather.windGusts.data = weather.windGusts.data.filter(function(d) {
        return d.time && d.value;
    }).map(function(d) {
        d.time = new Date(d.time).getTime();
        return d;
    });
    weather.windGusts.data.push({
        value: 0,
        time: weather.windGusts.data[weather.windGusts.data.length-1].time - 60 * 60
    });


    // weather.windGusts.data = weather.windGusts.data.reverse().slice(30, 60).reverse();
    draw();
});


