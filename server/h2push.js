const router = require("koa-router")();
const dropzones = require("../dropzones");

router.get("/dz/:dz", (ctx, next) => {
    ctx.set("X-dz", ctx.params.dz);
    ctx.set(
        "Link",
        "</api/forecasts/62.40739,25.66362/enn-s-1-1-windgust>; rel=preload; as=json"
    );
    next();
});

module.exports = router;
