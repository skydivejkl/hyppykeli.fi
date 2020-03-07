import { NextApiRequest, NextApiResponse } from "next";
import { get } from "lodash/fp";
import { fmiRequest, fmiRawRequest } from "../../../api-utils";
import url from "url";
import moment from "dayjs";

const getStartTime = () =>
    moment()
        .subtract(7, "hour")
        .startOf("hour")
        .toISOString();

const getFeatures = get("wfs:FeatureCollection.wfs:member");

const OBSERVATION_PARAMETERS = [
    "winddirection",
    "windspeedms",
    "windgust",
    "n_man",
];

const getFeatureDescriptionHref = get(
    "omso:PointTimeSeriesObservation[0].om:observedProperty[0].$.xlink:href",
);

const getFeatureId = get(
    "omso:PointTimeSeriesObservation[0].om:featureOfInterest[0].sams:SF_SpatialSamplingFeature[0].$.gml:id",
);

const getDescription = get("ObservableProperty.label[0]");

const getFeatureStationName = get(
    "omso:PointTimeSeriesObservation[0].om:featureOfInterest[0].sams:SF_SpatialSamplingFeature[0].sams:shape[0].gml:Point[0].gml:name[0]",
);

const getFeatureStationCoordinates = get(
    "omso:PointTimeSeriesObservation[0].om:featureOfInterest[0].sams:SF_SpatialSamplingFeature[0].sams:shape[0].gml:Point[0].gml:pos[0]",
);

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const fmisid = req.query.fmisid as string;

    const data = await fmiRequest({
        query: "fmi::observations::weather::timevaluepair",
        cacheKey: "observations:" + fmisid,
        params: {
            starttime: getStartTime(),
            // endtime: moment().toISOString(),
            parameters: OBSERVATION_PARAMETERS,
            fmisid: fmisid,
        },
    });

    const featuresWithDescriptions = await Promise.all(
        getFeatures(data).map(async (feature: any) => {
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

    res.json({
        fmisid: fmisid,
        stationsURL: "http://ilmatieteenlaitos.fi/havaintoasemat",
        features: featuresWithDescriptions,
    });
};
