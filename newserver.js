
var express = require("express");
// var Q = require("q");
// Q.longStackSupport = true;
// var fetch = require("./lib/fetch");
var request = require("request");
var formatFmiUrl = require("./lib/formatFmiUrl");
var parseFmi = require("./lib/parseFmi");
var xtend = require("xtend");
var browserify = require("browserify-middleware");

var config = require("./config.json");

var app = express();




var prettyStoredQueries = {
    observations: "fmi::observations::weather::timevaluepair",
    forecast: "fmi::forecast::hirlam::surface::point::timevaluepair"
};

app.get("/", function(req, res) {
    res.sendfile(__dirname + "/html/new.html");
});

app.get("/new.js", browserify("./new.js"));

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

    console.log("fetching", u);
    request(u).pipe(parseFmi()).pipe(res);

});


app.listen(8080);
