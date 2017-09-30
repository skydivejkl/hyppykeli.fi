setTimeout(function() {
    if (!window.bundleLoaded) {
        var container = document.getElementById("app-container");
        container.innerHTML = "<h1 class=loading>Hetki!</h1>";
    }
}, 1000);

window._trackJs = {token: "3333e432505347958ec3649474d80ef4"};
window.ga =
    window.ga ||
    function() {
        (ga.q = ga.q || []).push(arguments);
    };
ga.l = +new Date();
ga("create", "UA-41768455-1", "auto");

ga("require", "urlChangeTracker");
ga("require", "outboundLinkTracker");
ga("require", "pageVisibilityTracker");

ga("send", "pageview");

function loadSync(src) {
    var s = document.createElement("script");
    s.src = src;
    s.type = "text/javascript";
    s.async = false;
    document.getElementsByTagName("script")[0].parentNode.appendChild(s);
}

if (/hyppykeli\.fi/.test(window.location.toString())) {
    loadSync("/vendor/tracker.js");
}

if (
    !window.Promise ||
    !Object.assign ||
    ![].find ||
    ![].includes ||
    !"".includes
) {
    console.log("Loading polyfill");
    loadSync("/dist/polyfill.js");
} else {
    console.log("Polyfill not needed");
}

console.log("Loading main bundle");
loadSync(window.localStorage.bundle || "/dist/bundle.js");
