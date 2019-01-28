const router = require("koa-router")();
const {get} = require("lodash/fp");
const moment = require("dayjs");

const {fmiRequest} = require("./utils");

// const query = "fmi::avi::observations::finland::iwxxm";
// const query = "fmi::avi::observations::finland::latest::iwxxm";
// const query = "fmi::avi::observations::latest::iwxxm";
const query = "fmi::avi::observations::iwxxm";

const getPoints = get("wfs:FeatureCollection.wfs:member");
const getMetar = get(
    "avi:VerifiableMessage[0].avi:metadata[0].avi:MessageMetadata[0].avi:source[0].avi:Process[0].avi:input[0]"
);

router.get("/api/metars/:icaocode", async ctx => {
    let data = null;

    try {
        data = await fmiRequest({
            apikey: ctx.state.fmiApikey,
            query,
            cacheKey: ctx.params.icaocode,
            params: {
                icaocode: ctx.params.icaocode,
                starttime: moment()
                    .subtract(1, "days")
                    .toISOString(),
                // endtime: moment().toISOString(),
            },
        });
    } catch (error) {
        if (String(error.response.status)[0] === "4") {
            ctx.status = error.response.status;
            ctx.body = {
                error: "Unknown icaocode " + ctx.params.icaocode,
            };
            return;
        } else {
            throw error;
        }
    }

    if (data) {
        const points = getPoints(data);
        if (points) {
            ctx.body = points.map(getMetar);
        } else {
            ctx.status = 400;
            ctx.body = {
                error: "No data for icaocode " + ctx.params.icaocode,
            };
        }
    }
});

module.exports = router;
