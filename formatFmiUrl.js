
var url = require("url");

function formatFmiUrl(ob) {
    ob.query.request = "getFeature";
    ob.query.storedquery_id = ob.query.storedquery_id ||
        "fmi::observations::weather::timevaluepair";
    return url.format({
        protocol: "http",
        pathname: "/fmi-apikey/" + ob.apikey + "/wfs",
        hostname: "data.fmi.fi",
        query: ob.query
    });
}

module.exports = formatFmiUrl;
