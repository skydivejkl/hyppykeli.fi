import { get } from "lodash/fp";
import moment from "dayjs";
import { fmiRequest } from "../../../api-utils";
import { NextApiRequest, NextApiResponse } from "next";

// const query = "fmi::avi::observations::finland::iwxxm";
// const query = "fmi::avi::observations::finland::latest::iwxxm";
// const query = "fmi::avi::observations::latest::iwxxm";
const observationQuery = "fmi::avi::observations::iwxxm";

const getPoints = get("wfs:FeatureCollection.wfs:member");

const getMetar = get(
    "avi:VerifiableMessage[0].avi:metadata[0].avi:MessageMetadata[0].avi:source[0].avi:Process[0].avi:input[0]",
);

async function fetchMetar(icaocode: string) {
    let data = null;

    try {
        data = await fmiRequest({
            storedQuery: observationQuery,
            cacheKey: icaocode,
            params: {
                icaocode: icaocode,
                starttime: moment()
                    .subtract(1, "day")
                    .toISOString(),
                // endtime: moment().toISOString(),
            },
        });
    } catch (error) {
        if (String(error.response.status)[0] === "4") {
            throw new Error("Unknown icaocode " + icaocode);
        } else {
            throw error;
        }
    }

    const points = getPoints(data);
    if (points) {
        return points.map(getMetar);
    }

    throw new Error("No data for icaocode " + icaocode);
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const icaocode = req.query.icaocode as string;

    fetchMetar(icaocode.toUpperCase()).then(
        metar => {
            res.status(200).json(metar);
        },
        error => {
            res.status(500).json({ error: error.message ?? "unknown error" });
        },
    );
};
