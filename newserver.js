
var express = require("express");
var Promise = require("bluebird");
Promise.longStackTraces();
var request = require("request");
var formatFmiUrl = require("./lib/formatFmiUrl");
var parseFmi = require("./lib/parseFmi");
var xtend = require("xtend");
var browserify = require("browserify-middleware");


function requestp(url, _opts) {
    var opts = xtend({}, _opts, { url: url });

    return new Promise(function (resolve, reject) {
        request(opts, function (err, res, body) {
            if (err) {
                return reject(err);
            } else if (res.statusCode !== 200) {
                err = new Error("Unexpected status code: " + res.statusCode);
                err.res = res;
                return reject(err);
            }
            resolve(body);
        });
    });
}



var requestCache = {};

function cachedReq(u) {
    var cached;
    if (cached = requestCache[u]) {
        console.log("Using cache for", u);
        return cached;
    }

    console.log("Actually fetching", u);
    return requestp(u).then(function(res) {
        requestCache[u] = Promise.cast(res);

        Promise.delay(1000*30).then(function() {
            requestCache[u] = null;
        });

        return res;
    });
}

var config = require("./config.json");

var app = express();


var prettyStoredQueries = {
    observations: "fmi::observations::weather::timevaluepair",
    forecasts: "fmi::forecast::hirlam::surface::point::timevaluepair"
};

app.get("/", function(req, res) {
    res.sendfile(__dirname + "/html/new.html");
});

app.get("/react", function(req, res) {
    res.sendfile(__dirname + "/react.html");
});

app.get("/new.js", browserify("./new.js"));

app.get("/react.js", browserify("./react.js", {
    transform: ["reactify"]
}));

app.get("/api/fmi/:storedquery", function(req, res) {

    console.log("query", req.query);
    console.log("params", req.params);

    var storedquery = prettyStoredQueries[req.params.storedquery];
    if (!storedquery) {
        return res.json(404, {
            message: "Bad query",
            available: Object.keys(prettyStoredQueries)
        });
    }

    var u = formatFmiUrl({
        apikey: config.apikey,
        query: xtend({
            place: "tikkakoski",
            storedquery_id: storedquery
        }, req.query)
    });

    cachedReq(u).then(parseFmi).then(res.json.bind(res))
    .catch(function(err) {
        console.log("Failed to fetch fmi data", err);
        res.json(500, {
            message: "Failed to fetch fmi data",
            fmiError: err.message
        });
    });

});


app.listen(8080);
