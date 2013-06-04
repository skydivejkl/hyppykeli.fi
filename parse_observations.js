
var cheerio = require("cheerio");

module.exports = function parseObservations(xmlDoc) {

    var $ = cheerio.load(xmlDoc, {
        xmlMode: true
    });

    function pickKeyValues() {
        var time = $(this).find("wml2\\:time").text();
        var value = $(this).find("wml2\\:value").text();
        return {
            time: new Date(time),
            value: parseFloat(value)
        };
    }

    return {
        speeds: $("wml2\\:MeasurementTimeseries[gml\\:id=\"obs-obs-1-1-ws_10min\"] wml2\\:MeasurementTVP").map(pickKeyValues),
        gusts: $("wml2\\:MeasurementTimeseries[gml\\:id=\"obs-obs-1-1-wg_10min\"] wml2\\:MeasurementTVP").map(pickKeyValues)

    };

};
