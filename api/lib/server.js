require("dotenv").config();
const Koa = require("koa");
const router = require("koa-router")();

const app = new Koa();

const {fmiStats} = require("./utils");
const metar = require("./metar");
const fmi = require("./fmi");

const API_PORT = process.env.API_PORT || 32944;

app.use((ctx, next) => {
    ctx.state.fmiApikey = process.env.FMI_API_KEY;

    if (ctx.state.fmiApikey) {
        console.error("FMI_API_KEY not defined");
    }

    return next();
});

const started = new Date();

router.get("/uptime", ctx => {
    ctx.type = "text/html";
    ctx.body = started.toString();
});

router.get("/stats", ctx => {
    ctx.body = fmiStats;
});

app.use(metar.routes());
app.use(fmi.routes());
app.use(router.routes());

app.listen(API_PORT, () => {
    console.log("Listening", API_PORT);
});
