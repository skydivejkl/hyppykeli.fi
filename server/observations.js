const router = require("koa-router")();
const {get} = require("lodash/fp");
const moment = require("moment");

const {fmiRequest} = require("./utils");

// Get the paths with https://chrome.google.com/webstore/detail/jsonview/chklaanhfefbnpoihckbnefhakgolnmc?hl=en

const getFeatures = get("wfs:FeatureCollection.wfs:member");

const getFeatureId = get(
    "omso:PointTimeSeriesObservation[0].om:featureOfInterest[0].sams:SF_SpatialSamplingFeature[0].$.gml:id"
);
const getFeatureStationName = get(
    "omso:PointTimeSeriesObservation[0].om:featureOfInterest[0].sams:SF_SpatialSamplingFeature[0].sams:shape[0].gml:Point[0].gml:name[0]"
);
const getFeatureStationCoordinates = get(
    "omso:PointTimeSeriesObservation[0].om:featureOfInterest[0].sams:SF_SpatialSamplingFeature[0].sams:shape[0].gml:Point[0].gml:pos[0]"
);

const getPoints = get(
    "omso:PointTimeSeriesObservation[0].om:result[0].wml2:MeasurementTimeseries[0].wml2:point"
);

const getTime = get("wml2:MeasurementTVP[0].wml2:time[0]");
const getValue = get("wml2:MeasurementTVP[0].wml2:value[0]");

router.get("/api/observations/:fmisid", async ctx => {
    const data = await fmiRequest(
        ctx.state.fmiApikey,
        "fmi::observations::weather::timevaluepair",
        {
            starttime: moment().subtract(1, "days").toISOString(),
            endtime: moment().toISOString(),
            parameters: "winddirection,windspeedms,windgust",
            fmisid: ctx.params.fmisid,
        }
    );

    ctx.body = {
        fmisid: ctx.params.fmisid,
        stationsURL: "http://ilmatieteenlaitos.fi/havaintoasemat",
        features: getFeatures(data).map(feature => ({
            id: getFeatureId(feature),
            stationName: getFeatureStationName(feature),
            stationCoordinates: getFeatureStationCoordinates(feature),
        })),
    };
});

router.get("/api/observations/:fmisid/:feature", async ctx => {
    const data = await fmiRequest(
        ctx.state.fmiApikey,
        "fmi::observations::weather::timevaluepair",
        {
            starttime: moment().subtract(1, "days").toISOString(),
            endtime: moment().toISOString(),
            parameters: "winddirection,windspeedms,windgust",
            fmisid: ctx.params.fmisid,
        }
    );

    const features = getFeatures(data);
    if (!features) {
        ctx.body = {error: "No data for fmisid: " + ctx.params.fmisid};
        return;
    }

    const feature = features.filter(feature => {
        return getFeatureId(feature) === ctx.params.feature;
    })[0];

    if (!feature) {
        ctx.body = {
            stationName: getFeatureStationName(feature),
            stationCoordinates: getFeatureStationCoordinates(feature),
            error: "No data for feature: " + ctx.params.feature,
            features: features,
        };
        return;
    }

    ctx.body = {
        stationName: getFeatureStationName(feature),
        stationCoordinates: getFeatureStationCoordinates(feature),
        points: getPoints(feature).map(point => ({
            time: getTime(point),
            value: getValue(point),
        })),
    };
});

module.exports = router;
