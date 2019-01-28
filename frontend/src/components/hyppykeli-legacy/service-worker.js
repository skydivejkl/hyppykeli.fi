/* global self */
importScripts("/vendor/workbox-sw.prod.v2.0.3.js");

function log(...args) {
    console.log("SW", ...args);
}

const workboxSW = (self.workboxSW = new self.WorkboxSW());

log("Hello from Workbox Service Worker");

workboxSW.precache([]);

function sendShell(req) {
    log("Sending shell", req.url.href);
    return caches.match("shell.html");
}

workboxSW.router.registerRoute("/dz/:dz", sendShell);
workboxSW.router.registerRoute("/previous", sendShell);
workboxSW.router.registerRoute("/", sendShell);

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", () => self.clients.claim());
