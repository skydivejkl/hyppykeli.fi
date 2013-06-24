
var Q = require("q");
var hyperquest = require("hyperquest");
var concat = require("concat-stream");

function fetch(url) {
    var body = Q.defer();
    var response = Q.defer();
    var s = hyperquest(url);
    var started = Date.now();

    s.on("error", body.reject);
    s.on("response", function(res) {
        if (res.statusCode === 200) response.resolve(res);
        else {
            var err = new Error("Upstream server error");
            err.url = url;
            err.response = res;
            response.reject(err);
        }
    });

    s.pipe(concat(function(data) {
        body.resolve(data);
    }));

    body.promise.fin(function() {
        console.info("Request to", url, "took", Date.now() - started, "ms" );
    });

    return Q.all([response.promise, body.promise]);
}

module.exports = fetch;
