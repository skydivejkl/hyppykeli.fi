var Q = require("q");

function cachePromise(origfn, isValid) {
    var cache = {};
    return function() {
        var self = this;
        var args = [].slice.call(arguments);
        var key = JSON.stringify(args);
        var d = Q.defer();
        function next() { return cache[key] = origfn.apply(self, args); }
        function current() { return cache[key] || (cache[key] = next()); }

        isValid(current()).then(function() {
            current().then(d.resolve);
        }, function() {
            next().then(d.resolve, d.reject);
        });

        return d.promise;
    };
}

module.exports = cachePromise;
