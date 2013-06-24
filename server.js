
var hyperquest = require("hyperquest");
var concat = require('concat-stream');
var express = require("express");
var Q = require("q");

var config = require("./config.json");
var formatFmiUrl = require("./formatFmiUrl");
var parseObservations = require("./parseObservations");
var cachePromise = require("./cachePromise");
var Weather = require("./client/Weather");

// http://ilmatieteenlaitos.fi/tallennetut-kyselyt

var app = express();

app.use(express.static(__dirname + '/public'));


var promiseObservations = function (query) {
    var d = Q.defer();

    var fmiUrl = formatFmiUrl({
        apikey: config.apikey,
        query: query
    });

    console.log("API request to", fmiUrl);
    var start = Date.now();
    var s = hyperquest(fmiUrl);

    s.on("error", d.reject);
    s.pipe(concat(function(data) {
        console.log("request took", Date.now() - start, "ms");
        try {
            d.resolve(parseObservations(data.toString()));
        } catch(err) {
            console.error("Failed to parse FMI data", err);
            d.reject(err);
        }
    }));

    return d.promise;
};

promiseObservations = cachePromise(promiseObservations, function isValid(observations) {
    return observations.then(function(data) {
        var weather = new Weather(data);
        return Q(!weather.isDataOld());
    });
});

app.get("/api/observations", function(req, res) {
    promiseObservations(req.query).then(function(json) {
        res.json(json);
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

