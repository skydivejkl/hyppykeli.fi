
var cheerio = require("cheerio");

function parseObservations(xmlDoc) {

    var $ = cheerio.load(xmlDoc, { xmlMode: true });

    // cool fmi xml parser
    function observedPropertyById(id) {

        // data is under <om:observedProperty>
        return $("om\\:observedProperty").filter(function() {
            // grap the one with our id
            var property = $("sams\\:SF_SpatialSamplingFeature[gml\\:id=\""+ id + "\"]", this);
            return property.length > 0;
        }).map(function() {
            return {
                id: id,

                // grap some metadata
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

module.exports = parseObservations;

if (require.main === module) {
    var fs = require("fs");
    var xml = fs.readFileSync("./test.xml").toString();
    console.log(JSON.stringify(parseObservations(xml), null, "  "));
}
