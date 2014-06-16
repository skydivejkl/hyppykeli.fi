
var Promise = require("bluebird");
var xml2json = Promise.promisify(require('xml2js').parseString);

function get(o, parts) {
    while (parts.length) {
        o = o[parts.shift()];
        if (!o) return;
    }
    return o;
}

function parseFmiJSON(jsonXml) {
    var doc = {};

    if (!jsonXml) throw new Error("Empty XML");

    if (!jsonXml['wfs:FeatureCollection']) {
        throw new Error("Empty wfs:FeatureCollection");
    }

    if (!jsonXml['wfs:FeatureCollection']["wfs:member"]) {
        throw new Error("Empty wfs:member");
    }

    jsonXml['wfs:FeatureCollection']["wfs:member"].forEach(function(d) {

        var rawLoc = get(d, [
            "omso:PointTimeSeriesObservation",  0,
            "om:featureOfInterest", 0,
            "sams:SF_SpatialSamplingFeature", 0,
            "sam:sampledFeature", 0,
            "target:LocationCollection", 0,
            "target:member", 0,
            "target:Location", 0
        ]);

        var rawCoordinates = get(d, [
            "omso:PointTimeSeriesObservation",  0,
            "om:featureOfInterest", 0,
            "sams:SF_SpatialSamplingFeature", 0,
            "sams:shape", 0,
            "gml:Point", 0,
            "gml:pos", 0,
        ]);


        // forecasts are multipoint
        if (!rawCoordinates) {
            // first one should enough for our purposes
            rawCoordinates = get(d, [
                "omso:PointTimeSeriesObservation",  0,
                "om:featureOfInterest", 0,
                "sams:SF_SpatialSamplingFeature", 0,
                "sams:shape", 0,
                "gml:MultiPoint", 0,
                "gml:pointMembers", 0,
                "gml:Point", 0,
                "gml:pos", 0,
            ]);
        }

        var rawData = get(d, [
            "omso:PointTimeSeriesObservation", 0,
            "om:result", 0,
            "wml2:MeasurementTimeseries", 0
        ]);

        var fmisid = get(rawLoc, ["gml:identifier", 0, "_"]);

        var name = get(rawLoc["gml:name"].filter(function(d) {
            return d.$.codeSpace === "http://xml.fmi.fi/namespace/locationcode/name";
        }), [0, "_"]);

        var wmo = get(rawLoc["gml:name"].filter(function(d) {
            return d.$.codeSpace === "http://xml.fmi.fi/namespace/locationcode/wmo";
        }), [0, "_"]);

        var dataId = rawData.$["gml:id"];

        var location = {
            name: name,
            wmo: wmo,
            fmisid: fmisid
        };

        if (rawCoordinates) {
            var parts = rawCoordinates.trim().split(" ");
            var lat = parts[0];
            var lon = parts[1];
            location.coordinates = {
                lat: lat,
                lon: lon
            };
        }

        var data = rawData["wml2:point"].map(function(d) {
            return {
                time: d["wml2:MeasurementTVP"][0]["wml2:time"][0],
                value: d["wml2:MeasurementTVP"][0]["wml2:value"][0]
            };
        });

        doc[dataId] = {
            data: data,
            location: location
        };
    });

    return doc;
}

function parseFmi(xml) {
    return xml2json(xml).then(parseFmiJSON);
}

module.exports = parseFmi;
