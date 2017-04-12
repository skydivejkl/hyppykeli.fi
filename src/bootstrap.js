function loadSync(src) {
    var s = document.createElement("script");
    s.src = src;
    s.type = "text/javascript";
    s.async = false;
    document.getElementsByTagName("script")[0].parentNode.appendChild(s);
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
