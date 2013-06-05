
var fs = require("fs");
var hyperquest = require("hyperquest");
var concat = require('concat-stream');
var express = require("express");
var memoize = require("memoize");

var config = require("./config.json");
var parseObservations = require("./parse_observations");

// http://ilmatieteenlaitos.fi/tallennetut-kyselyt

function fmiObservationsStream(place) {

    // return fs.createReadStream("./test.xml");

    var url = [
        "http://data.fmi.fi/fmi-apikey/",
        config.apikey,
        "/wfs?",
        "request=getFeature",
        "&storedquery_id=fmi::observations::weather::timevaluepair",
        "&place=",
        place
    ].join("");

    console.log("sending request to", url);

    return hyperquest(url);
}


var app = express();

app.use(express.static(__dirname + '/public'));

app.get("/api/:place/observations", function(req, res) {
    console.log("Requesting", req.params.place);

    fmiObservationsStream(req.params.place).pipe(concat(function(data) {
        res.json(parseObservations(data.toString()));
    }));

});

app.listen(8080);

