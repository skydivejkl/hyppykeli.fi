const router = require("koa-router")();
const {get} = require("lodash/fp");
const moment = require("moment");
const url = require("url");

const {fmiRequest, fmiRawRequest} = require("./utils");

const getStartTime = () =>
    moment()
        .subtract(7, "hours")
        .startOf("hour")
        .toISOString();

// Get the paths with https://chrome.google.com/webstore/detail/jsonview/chklaanhfefbnpoihckbnefhakgolnmc?hl=en

const getFeatures = get("wfs:FeatureCollection.wfs:member");

const getFeatureId = get(
    "omso:PointTimeSeriesObservation[0].om:featureOfInterest[0].sams:SF_SpatialSamplingFeature[0].$.gml:id",
);
const getFeatureStationName = get(
    "omso:PointTimeSeriesObservation[0].om:featureOfInterest[0].sams:SF_SpatialSamplingFeature[0].sams:shape[0].gml:Point[0].gml:name[0]",
);
const getFeatureStationCoordinates = get(
    "omso:PointTimeSeriesObservation[0].om:featureOfInterest[0].sams:SF_SpatialSamplingFeature[0].sams:shape[0].gml:Point[0].gml:pos[0]",
);

const getFeatureDescriptionHref = get(
    "omso:PointTimeSeriesObservation[0].om:observedProperty[0].$.xlink:href",
);

const getPoints = get(
    "omso:PointTimeSeriesObservation[0].om:result[0].wml2:MeasurementTimeseries[0].wml2:point",
);

const getTime = get("wml2:MeasurementTVP[0].wml2:time[0]");
const getValue = get("wml2:MeasurementTVP[0].wml2:value[0]");

const getDescription = get("ObservableProperty.label[0]");

const getForecastLocationName = get(
    "omso:PointTimeSeriesObservation[0].om:featureOfInterest[0].sams:SF_SpatialSamplingFeature[0].sams:shape[0].gml:MultiPoint[0].gml:pointMembers[0].gml:Point[0].gml:name[0]",
);
const getForecastLocationCoordinates = get(
    "omso:PointTimeSeriesObservation[0].om:featureOfInterest[0].sams:SF_SpatialSamplingFeature[0].sams:shape[0].gml:MultiPoint[0].gml:pointMembers[0].gml:Point[0].gml:pos[0]",
);

const OBSERVATION_PARAMETERS = [
    "winddirection",
    "windspeedms",
    "windgust",
    "n_man",
];
router.get("/api/observations/:fmisid", async ctx => {
    const data = await fmiRequest({
        apikey: ctx.state.fmiApikey,
        query: "fmi::observations::weather::timevaluepair",
        cacheKey: "observations:" + ctx.params.fmisid,
        params: {
            starttime: getStartTime(),
            // endtime: moment().toISOString(),
            parameters: OBSERVATION_PARAMETERS,
            fmisid: ctx.params.fmisid,
        },
    });

    const featuresWithDescriptions = await Promise.all(
        getFeatures(data).map(async feature => {
            const featureDescriptionHref = getFeatureDescriptionHref(feature);
            const descriptionData = await fmiRawRequest(
                featureDescriptionHref,
                {
                    cacheKey: featureDescriptionHref,
                },
            );

            return {
                id: getFeatureId(feature),
                description: getDescription(descriptionData),
                stationName: getFeatureStationName(feature),
                stationCoordinates: getFeatureStationCoordinates(feature),
                googleMaps: url.resolve(
                    "https://www.google.fi/maps/place/",
                    getFeatureStationCoordinates(feature),
                ),
            };
        }),
    );

    ctx.body = {
        fmisid: ctx.params.fmisid,
        stationsURL: "http://ilmatieteenlaitos.fi/havaintoasemat",
        features: featuresWithDescriptions,
    };
});

router.get("/api/observations/:fmisid/:feature", async ctx => {
    const data = await fmiRequest({
        apikey: ctx.state.fmiApikey,
        query: "fmi::observations::weather::timevaluepair",
        cacheKey: "observations:" + ctx.params.fmisid,
        params: {
            starttime: getStartTime(),
            // endtime: moment().toISOString(),
            parameters: OBSERVATION_PARAMETERS,
            fmisid: ctx.params.fmisid,
        },
    });

    const features = getFeatures(data);
    if (!features) {
        ctx.status = 404;
        ctx.body = {error: "No data for fmisid: " + ctx.params.fmisid};
        return;
    }

    const feature = features.filter(feature => {
        return getFeatureId(feature) === ctx.params.feature;
    })[0];

    if (!feature) {
        ctx.status = 404;
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

const FORECAST_PAREMETERS = [
    "winddirection",
    "windspeedms",
    "windgust",
    "maximumwind",
];

router.get("/api/forecasts/:latlon", async ctx => {
    const data = await fmiRequest({
        apikey: ctx.state.fmiApikey,
        query: "fmi::forecast::hirlam::surface::point::timevaluepair",
        cacheKey: "forecasts:" + ctx.params.latlon,
        params: {
            parameters: FORECAST_PAREMETERS,
            latlon: ctx.params.latlon,
        },
    });

    ctx.body = {
        features: getFeatures(data).map(feature => ({
            id: getFeatureId(feature),
            locationName: getForecastLocationName(feature),
            locationCoordinates: getForecastLocationCoordinates(feature),
        })),
    };
});

router.get("/api/forecasts/:latlon/:feature", async ctx => {
    const data = await fmiRequest({
        apikey: ctx.state.fmiApikey,
        query: "fmi::forecast::hirlam::surface::point::timevaluepair",
        cacheKey: "forecasts:" + ctx.params.latlon,
        params: {
            parameters: FORECAST_PAREMETERS,
            latlon: ctx.params.latlon,
        },
    });

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
            error: "No data for feature: " + ctx.params.feature,
            features: features,
        };
        return;
    }

    ctx.body = {
        locationName: getForecastLocationName(feature),
        locationCoordinates: getForecastLocationCoordinates(feature),
        points: getPoints(feature)
            .map(point => ({
                time: getTime(point),
                value: getValue(point),
            }))
            .filter(point => {
                const pointTime = moment(point.time);
                return (
                    pointTime.unix() >
                    moment()
                        .add(45, "minutes")
                        .unix()
                );
            }),
    };
});

module.exports = router;
