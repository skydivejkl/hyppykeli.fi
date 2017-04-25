const router = require("koa-router")();
const dropzones = require("../dropzones");

const h2pushJSON = path => `<${path}>; rel=preload; as=json`;

router.get("/dz/:dz", (ctx, next) => {
    const dz = dropzones[ctx.params.dz.toUpperCase()];

    ctx.set(
        "Link",
        [
            `/api/observations/${dz.fmisid}/fi-1-1-windgust`,
            `/api/observations/${dz.fmisid}/fi-1-1-windspeedms`,
            `/api/forecasts/${dz.lat},${dz.lon}/enn-s-1-1-windgust`,
            `/api/forecasts/${dz.lat},${dz.lon}/enn-s-1-1-windspeedms`,
            `/api/metars/${dz.icaocode}`,
        ]
            .map(h2pushJSON)
            .join(", ")
    );

    next();
});

module.exports = router;
