importScripts(
    "https://unpkg.com/workbox-sw@0.0.2/build/importScripts/workbox-sw.prod.v0.0.2.js",
);

/**
 * Create an instance of WorkboxSW.
 * Setting clientsClaims to true tells our service worker to take control as
 * soon as it's activated.
 */
const workboxSW = new WorkboxSW({clientsClaim: true});

workboxSW.router.registerRoute("/", workboxSW.strategies.cacheFirst());

workboxSW.router.registerRoute("/previous", workboxSW.strategies.cacheFirst());

workboxSW.router.registerRoute("/dz/:dz", workboxSW.strategies.cacheFirst());

workboxSW.router.registerRoute("/dist/*", workboxSW.strategies.cacheFirst());
