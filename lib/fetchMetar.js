var Q = require("q");

var cachePromise = require("./cachePromise");
var fetch = require("./fetch");
var parseMetar = require("metar");

function fetchMetar(airportCode) {
    var url = "http://weather.noaa.gov/pub/data/observations/metar/stations/" +
        airportCode.toUpperCase() + ".TXT";
    return fetch(url).spread(function(res, body) {
        var metarPage = body.toString();
        var raw = metarPage.split("\n")[1];
        var ob = parseMetar(raw);
        ob.raw = raw;
        return ob;
    });
}

fetchMetar.cached = cachePromise(fetchMetar, function(metar) {
    return metar.then(function(val) {
        var age = (Date.now() - val.time.getTime()) / 1000 / 60;
        console.log(val.station, "METAR is",
            Math.round(age*100)/100, "minutes old");
        return Q(age < 35);
    });
});

module.exports = fetchMetar;
