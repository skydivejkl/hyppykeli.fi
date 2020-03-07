import { NextApiRequest, NextApiResponse } from "next";
import {
    fmiRequest,
    fmiRawRequest,
    FmiHelpers,
    getStartTime,
} from "../../../api-utils";
import url from "url";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const fmisid = req.query.fmisid as string;

    const data = await fmiRequest({
        storedQuery: "fmi::observations::weather::timevaluepair",
        cacheKey: "observations:" + fmisid,
        params: {
            starttime: getStartTime(),
            // endtime: moment().toISOString(),
            parameters: FmiHelpers.OBSERVATION_PARAMETERS,
            fmisid: fmisid,
        },
    });

    const featuresWithDescriptions = await Promise.all(
        FmiHelpers.getFeatures(data).map(async (feature: any) => {
            const featureDescriptionHref = FmiHelpers.getFeatureDescriptionHref(
                feature,
            );
            const descriptionData = await fmiRawRequest(
                featureDescriptionHref,
                {
                    cacheKey: featureDescriptionHref,
                },
            );

            return {
                id: FmiHelpers.getFeatureId(feature),
                description: FmiHelpers.getDescription(descriptionData),
                stationName: FmiHelpers.getFeatureStationName(feature),
                stationCoordinates: FmiHelpers.getFeatureStationCoordinates(
                    feature,
                ),
                googleMaps: url.resolve(
                    "https://www.google.fi/maps/place/",
                    FmiHelpers.getFeatureStationCoordinates(feature),
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
