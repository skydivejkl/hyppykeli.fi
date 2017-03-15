if (!window.Promise || !Object.assign || ![].find || ![].includes || !"".includes) {
    console.log("Loading polyfill");
    var script = document.createElement("script");
    script.src = "/dist/polyfill.js";
    document.getElementsByTagName("head")[0].appendChild(script);
} else {
    console.log("Polyfill not needed");
}

