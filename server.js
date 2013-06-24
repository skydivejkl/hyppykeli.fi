
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


var fetchObservations = function (query) {
    var fmiUrl = formatFmiUrl({
        apikey: config.apikey,
        query: query
    });

    return fetch(fmiUrl).then(function(data) {
        return parseObservations(data.toString());
    });
};
fetchObservations = cachePromise(fetchObservations, function isValid(observations) {
    return observations.then(function(data) {
        var weather = new Weather(data);
        return Q(!weather.isDataOld());
    });
});

var fetchMETAR = function(airportCode) {
    var url = "http://weather.noaa.gov/pub/data/observations/metar/stations/" +
        airportCode.toUpperCase() + ".TXT";
    return fetch(url).spread(function(res, body) {
        var metarPage = body.toString();
        var raw = metarPage.split("\n")[1];
        var ob = parseMETAR(raw);
        ob.raw = raw;
        return ob;
    });
};

app.get("/api/observations", function(req, res) {
    fetchObservations(req.query).then(function(ob) {
        res.json(ob);
    }, function(err) {
        res.json(500, { error: err.message });
    });
});

function respondError(res) {
    return function(err) {
        var out = { error: err.message };
        if (err.response) {
            console.error("Upstream responded error:",
                err.response.statusCode,
                err.url
            );
            out.statusCode = err.response.statusCode;
        }
        else {
            console.error("API Error", err);
        }
        res.json(500, out);
    };
}

app.get("/api/metar/:airport", function(req, res) {
    fetchMETAR(req.params.airport).then(function(ob) {
        res.json(ob);
    }, respondError(res));
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

