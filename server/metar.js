const router = require("koa-router")();
const {get} = require("lodash/fp");
const moment = require("moment");

const {fmiRequest} = require("./utils");

// const query = "fmi::avi::observations::finland::iwxxm";
// const query = "fmi::avi::observations::finland::latest::iwxxm";
// const query = "fmi::avi::observations::latest::iwxxm";
const query = "fmi::avi::observations::iwxxm";

const getPoints = get("wfs:FeatureCollection.wfs:member");
const getMetar = get(
    "avi:VerifiableMessage[0].avi:metadata[0].avi:MessageMetadata[0].avi:source[0].avi:Process[0].avi:input[0]"
);

router.get("/api/metar/:icaocode", async ctx => {
    const data = await fmiRequest({
        apikey: ctx.state.fmiApikey,
        query,
        cacheKey: ctx.params.icaocode,
        params: {
            icaocode: ctx.params.icaocode,
            starttime: moment().subtract(1, "days").toISOString(),
            endtime: moment().toISOString(),
        },
    });

    const points = getPoints(data);
    ctx.body = points.map(getMetar);
});

module.exports = router;
