import React from "react";
import ReactDOMServer from "react-dom/server";

import fs from "fs";

const script = fs.readFileSync(__dirname + "/bootstrap.js").toString();

const App = () => (
    <html>
        <head>
            <meta charSet="utf-8" />
            <title>Hyppykeli.fi</title>
            <link href="/parachute192.png" rel="icon" />
            <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
            <meta
                name="viewport"
                content="initial-scale=1.0, user-scalable=no"
            />
            <meta name="theme-color" content="skyblue" />
            <meta name="msapplication-navbutton-color" content="skyblue" />
            <meta
                name="apple-mobile-web-app-status-bar-style"
                content="skyblue"
            />
            <link rel="manifest" href="/manifest.json" />
            <style>
                {`
                body, html {
                    color: white;
                    padding: 0;
                    margin: 0;
                    overflow-x: hidden;
                    background-color: skyblue;
                }
                .loading {
                    text-align: center;
                    font-family: Helvetica;
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    padding: 0;
                    margin: 0;
                }
                `}
            </style>
        </head>
        <body>
            <div id="app-container" />
            <script dangerouslySetInnerHTML={{__html: script}} />
            <script async src="https://www.google-analytics.com/analytics.js" />
            <script
                async
                src="https://unpkg.com/autotrack@2.1.0/autotrack.js"
            />
        </body>
    </html>
);

console.log("<!doctype html>");
console.log(ReactDOMServer.renderToStaticMarkup(<App />));
