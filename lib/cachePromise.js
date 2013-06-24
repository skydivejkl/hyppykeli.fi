var Q = require("q");

function cachePromise(origfn, isValid) {
    var cache = {};
    return function() {
        var self = this;
        var args = [].slice.call(arguments);
        var key = JSON.stringify(args);
        var current = cache[key] || next();
        function next() { return cache[key] = origfn.apply(self, args); }

        return isValid(current).then(function(valid) {
            return valid ? current : next();
        }, function(err) {
            console.error("Cache validation error", err);
            cache[key] = null;
            return Q.reject(err);
        });
    };
}

module.exports = cachePromise;
