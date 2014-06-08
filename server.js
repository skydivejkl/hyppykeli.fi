
var express = require("express");
var Promise = require("bluebird");
Promise.longStackTraces();
var request = require("request");
var formatFmiUrl = require("./lib/formatFmiUrl");
var parseFmi = require("./lib/parseFmi");
var _ = require("lodash");
var browserify = require("browserify-middleware");
var parseMETAR = require("metar");

var config = require("./config.json");

var app = express();


var dropzones = require("./dropzones.json");

app.use(express.static(__dirname + "/public"));

// app.use(function(req, res, next) {
//     if (req.url === "/") return next();
//     console.log("middleware wait!", req.url);
//     setTimeout(function() {
//         console.log("wait done");
//         next();
//     }, 1000);
// });


function requestp(url, _opts) {
    var opts = _.extend({}, _opts, { url: url });

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

        // Bust cache after 30 seconds
        Promise.delay(1000 * 30).then(function() {
            requestCache[u] = null;
        });

        return res;
    });
}



var prettyStoredQueries = {
    observations: "fmi::observations::weather::timevaluepair",
    forecasts: "fmi::forecast::hirlam::surface::point::timevaluepair"
};

app.get("/dz/:key", function(req, res) {
    var dz = dropzones[req.params.key];
    if (!dz) return res.end(404, "Unknown DZ " + res.params.key);
    res.render("dz.ejs", {dz: dz});
});

app.get("/", function(req, res) {
    res.sendfile(__dirname + "/index.html");
});

app.get("/app.js", browserify("./client.js", {
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
        query: _.extend({
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


app.get("/api/metar/:airportCode", function(req, res) {
    cachedReq(
        "http://weather.noaa.gov/pub/data/observations/metar/stations/" +
        req.params.airportCode.toUpperCase() +
        ".TXT"
    ).then(function(apiRes) {
        // Remove extra timestamp header "2014/03/21 14:50" if any
        var metarString = _.last(apiRes.split("\n", 2).filter(_.identity));
        var metarJSON = parseMETAR(metarString);
        metarJSON.raw = metarString;
        res.json(metarJSON);
    });

});


var server = app.listen(3000, function() {
    console.log('Listening on port %d', server.address().port);
});
