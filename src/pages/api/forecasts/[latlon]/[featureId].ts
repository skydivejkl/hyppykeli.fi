import { NextApiRequest, NextApiResponse } from "next";
import { fmiRequest, FmiHelpers } from "../../../../api-utils";
import moment from "dayjs";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const latlon = req.query.latlon as string;
    const featureId = req.query.featureId as string;

    const data = await fmiRequest({
        storedQuery: "fmi::forecast::hirlam::surface::point::timevaluepair",
        cacheKey: "forecasts:" + latlon,
        params: {
            parameters: FmiHelpers.FORECAST_PAREMETERS,
            latlon: latlon,
        },
    });

    const features = FmiHelpers.getFeatures(data);
    if (!features) {
        return res.status(404).json({ error: `No data for ${latlon}` });
    }

    const feature = features.filter((feature: any) => {
        return FmiHelpers.getFeatureId(feature) === featureId;
    })[0];

    if (!feature) {
        return res.status(404).json({
            error: "No data for feature: " + featureId,
            features: features,
        });
    }

    res.json({
        locationName: FmiHelpers.getForecastLocationName(feature),
        locationCoordinates: FmiHelpers.getForecastLocationCoordinates(feature),
        points: FmiHelpers.getPoints(feature)
            .map((point: any) => ({
                time: FmiHelpers.getTime(point),
                value: FmiHelpers.getValue(point),
            }))
            .filter((point: any) => {
                const pointTime = moment(point.time);
                return (
                    pointTime.unix() >
                    moment()
                        .add(45, "minute")
                        .unix()
                );
            }),
    });
};
