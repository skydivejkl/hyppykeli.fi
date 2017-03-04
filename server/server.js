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

router.get("/*", (ctx, next) => {
    if (ctx.request.url.includes(".")) {
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
