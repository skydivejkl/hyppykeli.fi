
var fs = require("fs");
var hyperquest = require("hyperquest");
var concat = require('concat-stream')
var cheerio = require("cheerio")

var config = require("./config.json");

// http://ilmatieteenlaitos.fi/tallennetut-kyselyt

function fmiObservationsStream(place, cb) {

    return fs.createReadStream("./test.xml");

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
    return hyperquest(url)
}

fmiObservationsStream("Tikkakoski").pipe(concat(function(data) {

    var $ = cheerio.load(data.toString(), {
        xmlMode: true
    });

    var gusts = $("wml2\\:MeasurementTimeseries[gml\\:id=\"obs-obs-1-1-wg_10min\"] wml2\\:MeasurementTVP").map(function(){
        var time = $(this).find("wml2\\:time").text();
        var value = $(this).find("wml2\\:value").text();
        return {
            time: new Date(time),
            value: value
        };
    });

    console.log(gusts);

}));

