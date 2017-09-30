module.exports = {
    globDirectory: "static/",
    globPatterns: ["**/*.{js,css,html,json,ico,svg,png}"],
    swDest: "static/service-worker.js",
    swSrc: "src/service-worker.js",
    globIgnores: [
        "../workbox-cli-config.js",
        "*/report.html",
        "*/workbox-sw.dev*",
    ],
};
