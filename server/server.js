const PRODUCTION = process.env.NODE_ENV === "production";

const fs = require("fs");
const Koa = require("koa");
const router = require("koa-router")();
const serveStatic = require("koa-static");
var {execSync} = require("child_process");

const gitRev = execSync("git rev-parse HEAD").toString().trim();
const config = require("../config");

const app = new Koa();

const {fmiStats} = require("./utils");
const metar = require("./metar");
const fmi = require("./fmi");

app.use((ctx, next) => {
    ctx.state.fmiApikey = config.fmiApikey;
    return next();
});

const trackJSTags = `
<script type="text/javascript">window._trackJs = { token: '3333e432505347958ec3649474d80ef4' };</script>
<script type="text/javascript" src="https://cdn.trackjs.com/releases/current/tracker.js"></script>
`.trim();

const bootstrapScript = fs
    .readFileSync(__dirname + "/../src/bootstrap.js")
    .toString();

const prerenderedHTML = fs
    .readFileSync(__dirname + "/../static/dist/prerender.html")
    .toString();

const prerenderedCSS = fs
    .readFileSync(__dirname + "/../static/dist/prerender.css")
    .toString();

const renderHtml = ({mainBundlePath, css, html}) => `
<!doctype html>
<html>
    <head>
        <meta charset="utf-8">
        <title>Hyppykeli.fi</title>
        <link href="/parachute.ico" rel="icon">
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
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
        ${css}
        </style>
    </head>
    <body>
        <div id="app-container">${html ? html : "hetki!"}</div>
        ${PRODUCTION ? trackJSTags : ""}
        <script>
        window.ga=window.ga||function(){(ga.q=ga.q||[]).push(arguments)};ga.l=+new Date;
        ga('create', 'UA-41768455-1', 'auto');

        ga('require', 'urlChangeTracker');
        ga('require', 'outboundLinkTracker');
        ga('require', 'pageVisibilityTracker');

        ga('send', 'pageview');
        </script>
        <script>
        ${bootstrapScript}
        console.log("Loading main bundle");
        loadSync("${mainBundlePath}");
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

router.get("/stats", ctx => {
    ctx.body = fmiStats;
});

router.get("/*", (ctx, next) => {
    if (/\.[a-z]{1,3}$/.test(ctx.request.url)) {
        return next();
    }

    const hostname = ctx.header.host.split(":")[0];

    const prerender = ctx.path === "/"
        ? {css: prerenderedCSS, html: prerenderedHTML}
        : null;

    ctx.type = "text/html";
    ctx.body = renderHtml(
        Object.assign(
            {
                mainBundlePath: PRODUCTION
                    ? "/dist/bundle.js?v=" + gitRev
                    : `http://${hostname}:${process.env.JS_SERVER_PORT || "JS_SERVER_PORT empty"}/dist/bundle.js`,
            },
            prerender
        )
    );
});

app.use(metar.routes());
app.use(fmi.routes());

app.use(serveStatic("static"));

app.use(router.routes());

app.listen(8080);
console.log("Listening 8080");
