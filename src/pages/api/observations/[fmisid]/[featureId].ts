import { NextApiRequest, NextApiResponse } from "next";
import { fmiRequest, getStartTime, FmiHelpers } from "../../../../api-utils";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const fmisid = req.query.fmisid as string;
    const featureId = req.query.featureId as string;

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

    const features = FmiHelpers.getFeatures(data);
    if (!features) {
        return res.status(404).json({ error: "No data for fmisid: " + fmisid });
    }

    const feature = features.filter((feature: any) => {
        return FmiHelpers.getFeatureId(feature) === featureId;
    })[0];

    if (!feature) {
        return res.status(404).json({
            stationName: FmiHelpers.getFeatureStationName(feature),
            stationCoordinates: FmiHelpers.getFeatureStationCoordinates(
                feature,
            ),
            error: "No data for feature: " + featureId,
            features: features,
        });
    }

    res.json({
        stationName: FmiHelpers.getFeatureStationName(feature),
        stationCoordinates: FmiHelpers.getFeatureStationCoordinates(feature),
        points: FmiHelpers.getPoints(feature).map((point: any) => ({
            time: FmiHelpers.getTime(point),
            value: FmiHelpers.getValue(point),
        })),
    });
};
