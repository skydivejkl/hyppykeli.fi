
var cheerio = require("cheerio");
var Q = require("q");
var fs = require("fs");

var fetch = require("./fetch");
var formatFmiUrl = require("./formatFmiUrl");
var cachePromise = require("./cachePromise");
var Weather = require("../models/Weather");


function parseObservations(xmlDoc) {

    fs.writeFileSync("foo.xml", xmlDoc);

    var $ = cheerio.load(xmlDoc, { xmlMode: true });

    // cool fmi xml parser
    function observedPropertyById(id) {

        // data is under <om:observedProperty>
        return $("om\\:observedProperty").filter(function() {
            // grab the one with our id
            var property = $("sams\\:SF_SpatialSamplingFeature[gml\\:id=\""+ id + "\"]", this);
            return property.length > 0;
        }).map(function() {
            return {
                id: id,

                // grab some metadata
                fmisid: $("target\\:Location gml\\:identifier", this).text(),
                wmo: $("target\\:Location gml\\:name[codeSpace=\"http://xml.fmi.fi/namespace/locationcode/wmo\"]", this).text(),
                stationName: $("target\\:Location gml\\:name[codeSpace=\"http://xml.fmi.fi/namespace/locationcode/name\"]", this).text(),

                // extract data from <wml2:point> elements
                data: $("wml2\\:point", this).map(function() {
                    var time = $(this).find("wml2\\:time").text();
                    var value = $(this).find("wml2\\:value").text();
                    return {
                        time: new Date(time),
                        value: parseFloat(value)
                    };
                })
            };
        })[0];
    }

    return {
        windSpeeds: observedPropertyById("fi-1-1-ws_10min"),
        windGusts: observedPropertyById("fi-1-1-wg_10min"),
        windDirections: observedPropertyById("fi-1-1-wd_10min")
    };

}

function fetchFmiObservations(options) {
    var fmiUrl = formatFmiUrl(options);
    return fetch(fmiUrl).spread(function(res, body) {
        return parseObservations(body.toString());
    });
}

fetchFmiObservations.cached = cachePromise(fetchFmiObservations, function isValid(observations) {
    return observations.then(function(data) {
        var weather = new Weather(data);
        return Q(!weather.isDataOld());
    });
});

module.exports = fetchFmiObservations;
