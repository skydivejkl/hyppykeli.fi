const Koa = require("koa");
const router = require("koa-router")();
const serveStatic = require("koa-static");
var {execSync} = require("child_process");

var gitRev = execSync("git rev-parse HEAD").toString().trim();
const config = require("../config");

const app = new Koa();

const metar = require("./metar");
const fmi = require("./fmi");

app.use((ctx, next) => {
    ctx.state.fmiApikey = config.fmiApikey;
    return next();
});

const renderHtml = script => `
<!doctype html>
<html>
    <head>
        <meta charset="utf-8">
        <title>Hyppykeli.fi</title>
        <link href="/parachute.ico" rel="icon">
        <meta name="viewport" content="initial-scale=1.0, user-scalable=no" />
        <meta name="theme-color" content="skyblue">
        <meta name="msapplication-navbutton-color" content="skyblue">
        <meta name="apple-mobile-web-app-status-bar-style" content="skyblue">
        <link rel="manifest" href="/manifest.json">
        <style>
        body, html {
            color: white;
            padding: 0;
            margin: 0;
            overflow-x: hidden;
            background-color: skyblue;
        }
        </style>
    </head>
    <body>
        <div id="app-container">hetki!</div>
        <script src="${script}" charset="utf-8"></script>
        <script>
        window.ga=window.ga||function(){(ga.q=ga.q||[]).push(arguments)};ga.l=+new Date;
        ga('create', 'UA-41768455-1', 'auto');

        ga('require', 'urlChangeTracker');
        ga('require', 'outboundLinkTracker');
        ga('require', 'pageVisibilityTracker');

        ga('send', 'pageview');
        </script>
        <script async src='https://www.google-analytics.com/analytics.js'></script>
        <script async src='https://unpkg.com/autotrack@2.1.0/autotrack.js'></script>
    </body>
</html>
`.trim();

const started = new Date();

router.get("/uptime", ctx => {
    ctx.type = "text/html";
    ctx.body = started.toString();
});

router.get("/*", (ctx, next) => {
    if (/\.[a-z]{1,3}$/.test(ctx.request.url)) {
        return next();
    }

    const hostname = ctx.header.host.split(":")[0];

    ctx.type = "text/html";
    ctx.body = renderHtml(
        process.env.NODE_ENV === "production"
            ? "/dist/bundle.js?v=" + gitRev
            : `http://${hostname}:${process.env.JS_SERVER_PORT || "JS_SERVER_PORT empty"}/dist/bundle.js`
    );
});

app.use(metar.routes());
app.use(fmi.routes());

app.use(serveStatic("static"));

app.use(router.routes());

app.listen(8080);
console.log("Listening 8080");
