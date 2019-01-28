const PRODUCTION = process.env.NODE_ENV === "production";

const fs = require("fs");
const Koa = require("koa");
const router = require("koa-router")();
const serveStatic = require("koa-static");
var {execSync} = require("child_process");

const config = require("../config");

const app = new Koa();

const {fmiStats} = require("./utils");
const metar = require("./metar");
const fmi = require("./fmi");
const h2push = require("./h2push");

app.use((ctx, next) => {
    ctx.state.fmiApikey = process.env.FMI_API_KEY;

    if (ctx.state.fmiApikey) {
        console.error("FMI_API_KEY not defined");
    }

    return next();
});

const htmlShell = fs
    .readFileSync(__dirname + "/../static/shell.html")
    .toString();

const started = new Date();

router.get("/uptime", ctx => {
    ctx.type = "text/html";
    ctx.body = started.toString();
});

router.get("/stats", ctx => {
    ctx.body = fmiStats;
});

router.get("/*", (ctx, next) => {
    if (/\.[a-z]{1,3}$/.test(ctx.request.url)) {
        return next();
    }
    ctx.type = "text/html";
    ctx.body = htmlShell;
});

app.use(metar.routes());
app.use(fmi.routes());

app.use(serveStatic("static"));

app.use(h2push.routes());
app.use(router.routes());

app.listen(8080);
console.log("Listening 8080");
