var Q = require("q");

function cachePromise(origfn, isValid) {
    var cache = {};
    return function() {
        var self = this;
        var args = [].slice.call(arguments);
        var key = JSON.stringify(args);
        var d = Q.defer();
        var current = cache[key] || next();
        function next() { return cache[key] = origfn.apply(self, args); }

        isValid(current).then(function() {
            d.resolve(current);
        }, function() {
            d.resolve(next());
        });

        return d.promise;
    };
}

module.exports = cachePromise;
