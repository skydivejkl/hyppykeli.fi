require("dotenv").config();
const Koa = require("koa");
const router = require("koa-router")();

const app = new Koa();

const {fmiStats} = require("./utils");
const metar = require("./metar");
const fmi = require("./fmi");

const API_PORT = process.env.API_PORT || 32944;

if (!process.env.FMI_API_KEY) {
    console.error("FMI_API_KEY not defined");
    process.exit(1);
} else {
    console.log("using api key", process.env.FMI_API_KEY);
}

app.use((ctx, next) => {
    ctx.state.fmiApikey = process.env.FMI_API_KEY;
    return next();
});

const started = new Date();

router.get("/api/uptime", ctx => {
    ctx.type = "text/html";
    ctx.body = started.toString();
});

router.get("/api/hello", ctx => {
    ctx.type = "text/html";
    ctx.body = "hello1";
});

router.get("/api/stats", ctx => {
    ctx.body = fmiStats;
});

app.use(metar.routes());
app.use(fmi.routes());
app.use(router.routes());

app.listen(API_PORT, () => {
    console.log("Listening", API_PORT);
});
