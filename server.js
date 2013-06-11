
var hyperquest = require("hyperquest");
var concat = require('concat-stream');
var express = require("express");

var config = require("./config.json");
var formatFmiUrl = require("./formatFmiUrl");
var parseObservations = require("./parseObservations");

// http://ilmatieteenlaitos.fi/tallennetut-kyselyt

var app = express();

app.use(express.static(__dirname + '/public'));

app.get("/api/observations", function(req, res) {
    var fmiUrl = formatFmiUrl({
        apikey: config.apikey,
        query: req.query
    });
    console.log("API request to", fmiUrl);

    // TODO: errs
    hyperquest(fmiUrl).pipe(concat(function(data) {
        res.json(parseObservations(data.toString()));
    }));
});

app.get("/", function(req, res) {
    res.sendfile(__dirname + "/html/index.html");
});

app.get("/:key/:value", function(req, res) {
    res.sendfile(__dirname + "/html/app.html");
});


app.listen(8080, function() {
    console.log("Listening on http://localhost:8080");
});

