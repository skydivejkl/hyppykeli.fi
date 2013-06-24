
var Q = require("q");
var hyperquest = require("hyperquest");
var concat = require("concat-stream");

function fetch(url) {
    var d = Q.defer();
    var s = hyperquest(url);
    s.on("error", d.reject);
    s.pipe(concat(function(data) {
        d.resolve(data);
    }));
    return d.promise;
}

module.exports = fetch;
