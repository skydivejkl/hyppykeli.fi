const { parse, format } = require("url");
import { get } from "lodash/fp";
import qs from "querystring";
const { parseString } = require("xml2js");
import axios from "axios";
import moment from "dayjs";

export const getStartTime = () =>
    moment()
        .subtract(7, "hour")
        .startOf("hour")
        .toISOString();

export const FmiHelpers = {
    getFeatures: get("wfs:FeatureCollection.wfs:member"),

    OBSERVATION_PARAMETERS: [
        "winddirection",
        "windspeedms",
        "windgust",
        "n_man",
    ],

    FORECAST_PAREMETERS: [
        "winddirection",
        "windspeedms",
        "windgust",
        "maximumwind",
    ],

    getFeatureDescriptionHref: get(
        "omso:PointTimeSeriesObservation[0].om:observedProperty[0].$.xlink:href",
    ),

    getFeatureId: get(
        "omso:PointTimeSeriesObservation[0].om:featureOfInterest[0].sams:SF_SpatialSamplingFeature[0].$.gml:id",
    ),

    getDescription: get("ObservableProperty.label[0]"),

    getFeatureStationName: get(
        "omso:PointTimeSeriesObservation[0].om:featureOfInterest[0].sams:SF_SpatialSamplingFeature[0].sams:shape[0].gml:Point[0].gml:name[0]",
    ),

    getFeatureStationCoordinates: get(
        "omso:PointTimeSeriesObservation[0].om:featureOfInterest[0].sams:SF_SpatialSamplingFeature[0].sams:shape[0].gml:Point[0].gml:pos[0]",
    ),

    getPoints: get(
        "omso:PointTimeSeriesObservation[0].om:result[0].wml2:MeasurementTimeseries[0].wml2:point",
    ),

    getTime: get("wml2:MeasurementTVP[0].wml2:time[0]"),

    getValue: get("wml2:MeasurementTVP[0].wml2:value[0]"),

    getForecastLocationName: get(
        "omso:PointTimeSeriesObservation[0].om:featureOfInterest[0].sams:SF_SpatialSamplingFeature[0].sams:shape[0].gml:MultiPoint[0].gml:pointMembers[0].gml:Point[0].gml:name[0]",
    ),
    getForecastLocationCoordinates: get(
        "omso:PointTimeSeriesObservation[0].om:featureOfInterest[0].sams:SF_SpatialSamplingFeature[0].sams:shape[0].gml:MultiPoint[0].gml:pointMembers[0].gml:Point[0].gml:pos[0]",
    ),
};

function extendUrlQuery(url: string, query: any): string {
    const o = parse(url, true);
    o.search = qs.stringify(Object.assign({}, o.query, query));

    return format(o);
}

async function xml2js(xml: any) {
    return new Promise((resove, reject) => {
        parseString(xml, (err: any, result: any) => {
            if (err) {
                reject(err);
            } else {
                resove(result);
            }
        });
    });
}

const fmiRequestCache: Record<string, any> = {};

export async function fmiRawRequest(
    url: string,
    options: { cacheAge?: number; cacheKey: string },
) {
    if (!options) {
        throw new Error("options missing from fmiRawRequest");
    }

    if (!options.cacheAge) {
        options.cacheAge = 30;
    }

    console.log("FMI request", url);

    const existingRequest = fmiRequestCache[options.cacheKey];

    if (existingRequest) {
        await existingRequest.promise;
        const age = Date.now() - existingRequest.created;
        if (age / 1000 < options.cacheAge) {
            console.log("Cache fresh.");
            return existingRequest.promise;
        }

        console.log("Cache expired.");
    } else {
        console.log("No cache.");
    }

    const promise = axios(url)
        .then(res => {
            console.log("FMI request completed", url);
            return xml2js(res.data);
        })
        .catch(error => {
            console.error("FMI request failed", error);
            delete fmiRequestCache[options.cacheKey];
            throw error;
        });

    fmiRequestCache[options.cacheKey] = {
        promise,
        cacheAge: options.cacheAge,
        created: Date.now(),
    };

    return promise;
}

export function fmiRequest(options: {
    storedQuery: string;
    params: any;
    cacheKey: string;
    cacheAge?: number;
}) {
    const metarURL = `http://opendata.fmi.fi/wfs?request=getFeature`;

    const finalURL = extendUrlQuery(
        metarURL,
        Object.assign(
            {
                storedquery_id: options.storedQuery,
            },
            options.params,
        ),
    );

    return fmiRawRequest(finalURL, {
        cacheKey: options.cacheKey,
        cacheAge: options.cacheAge,
    });
}
