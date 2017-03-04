const Koa = require("koa");
const router = require("koa-router")();
const serveStatic = require("koa-static");
const fs = require("fs");

const config = require("../config");

const app = new Koa();

const metar = require("./metar");
const fmi = require("./fmi");

app.use((ctx, next) => {
    ctx.state.fmiApikey = config.fmiApikey;
    return next();
});

const started = new Date();

router.get("/uptime", (ctx, next) => {
    ctx.type = "text/html";
    ctx.body = started.toString();
});

router.get("/*", (ctx, next) => {
    if (/\.[a-z]{1,3}$/.test(ctx.request.url)) {
        return next();
    }

    ctx.type = "text/html";
    ctx.body = fs.createReadStream(__dirname + "/../static/index.html");
});

app.use(metar.routes());
app.use(fmi.routes());

app.use(serveStatic("static"));

app.use(router.routes());

app.listen(8080);
console.log("Listening 8080");
