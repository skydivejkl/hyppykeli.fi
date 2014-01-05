
var Q = require("q");
Q.longStackSupport = true;

var express = require("express");
var browserify = require("browserify-middleware");


var fetchFmiObservations = require("./lib/fetchFmiObservations");
var fetchMetar = require("./lib/fetchMetar");

var config = require("./config.json");

// http://ilmatieteenlaitos.fi/tallennetut-kyselyt

var app = express();

app.use(express.static(__dirname + '/public'));

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

app.get("/api/observations", function(req, res) {
    var options = {apikey: config.apikey, query: req.query};

    fetchFmiObservations.cached(options).then(function(ob) {
        res.json(ob);
    }, function(err) {
        res.json(500, { error: err.message });
    });
});


app.get("/api/metar/:airport", function(req, res) {
    fetchMetar.cached(req.params.airport).then(function(ob) {
        res.json(ob);
    }, respondError(res));
});

app.get("/", function(req, res) {
    res.sendfile(__dirname + "/html/index.html");
});

app.get("/new.html", function(req, res) {
    res.sendfile(__dirname + "/html/new.html");
});

app.get("/:key/:value", function(req, res) {
    res.sendfile(__dirname + "/html/app.html");
});

app.get("/new.js", browserify("./new.js"));


var port = process.env.PORT || config.port || 8080;
app.listen(port, function() {
    console.log("Listening on http://localhost:" + port);
});

