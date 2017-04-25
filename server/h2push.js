const router = require("koa-router")();
const dropzones = require("../dropzones");
const {bundlePath, gitRev} = require("./bundle-path");

const h2pushJSON = path => `<${path}>; rel=preload; as=json`;
const h2pushJS = path => `<${path}>; rel=preload; as=script`;

const pushStaticAssets = (ctx, next) => {
    // "Cache aware" push hack
    // Http2 pushing will skip browser caches so push the assets only
    // when we are sure that it's not in cache
    if (ctx.cookies.get("h2push") !== gitRev) {
        ctx.cookies.set("h2push", gitRev);
        ctx.append("Link", h2pushJS(bundlePath));
        ctx.append("Link", h2pushJS("/vendor/tracker.js"));
    }
    next();
};

router.get("/", pushStaticAssets);
router.get("/dz/:dz", pushStaticAssets);

router.get("/dz/:dz", (ctx, next) => {
    const dz = dropzones[ctx.params.dz.toUpperCase()];

    [
        `/api/observations/${dz.fmisid}/fi-1-1-windgust`,
        `/api/observations/${dz.fmisid}/fi-1-1-windspeedms`,
        `/api/forecasts/${dz.lat},${dz.lon}/enn-s-1-1-windgust`,
        `/api/forecasts/${dz.lat},${dz.lon}/enn-s-1-1-windspeedms`,
        `/api/metars/${dz.icaocode}`,
    ].forEach(path => {
        ctx.append("Link", h2pushJSON(path));
    });

    next();
});

module.exports = router;
