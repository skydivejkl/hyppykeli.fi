
var express = require("express");
var Q = require("q");
var parseMETAR = require("metar");

var config = require("./config.json");
var formatFmiUrl = require("./formatFmiUrl");
var parseObservations = require("./parseObservations");
var cachePromise = require("./cachePromise");
var Weather = require("./client/Weather");
var fetch = require("./fetch");

// http://ilmatieteenlaitos.fi/tallennetut-kyselyt

var app = express();

app.use(express.static(__dirname + '/public'));


var promiseObservations = function (query) {
    var fmiUrl = formatFmiUrl({
        apikey: config.apikey,
        query: query
    });

    var start = Date.now();
    console.log("API request to", fmiUrl);
    return fetch(fmiUrl).then(function(data) {
        console.log("Request took", Date.now() - start, "ms");
        return parseObservations(data.toString());
    });
};
promiseObservations = cachePromise(promiseObservations, function isValid(observations) {
    return observations.then(function(data) {
        var weather = new Weather(data);
        return Q(!weather.isDataOld());
    });
});

var fetchMETAR = function(airportCode) {
    var url = "http://weather.noaa.gov/pub/data/observations/metar/stations/" +
        airportCode.toUpperCase() + ".TXT";
    return fetch(url).then(function(data) {
        var metarPage = data.toString();
        var raw = metarPage.split("\n")[1];
        var ob = parseMETAR(raw);
        ob.raw = raw;
        return ob;
    });
};

app.get("/api/observations", function(req, res) {
    promiseObservations(req.query).then(function(ob) {
        res.json(ob);
    }, function(err) {
        res.json(500, { error: err.message });
    });
});

app.get("/api/metar/:airport", function(req, res) {
    fetchMETAR(req.params.airport).then(function(ob) {
        res.json(ob);
    }, function(err) {
        res.json(500, { error: err.message });
    });
});

app.get("/", function(req, res) {
    res.sendfile(__dirname + "/html/index.html");
});

app.get("/:key/:value", function(req, res) {
    res.sendfile(__dirname + "/html/app.html");
});


var port = process.env.PORT || config.port || 8080;
app.listen(port, function() {
    console.log("Listening on http://localhost:" + port);
});

