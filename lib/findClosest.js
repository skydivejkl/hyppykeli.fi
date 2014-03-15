

function defaultCmp(a, b) {
    return a - b;
}

function findClosest(value, arr, cmp) {
    cmp = cmp || defaultCmp;

    return arr.reduce(function(best, current) {
        if (Math.abs(cmp(value, current)) < Math.abs(cmp(value, best))) {
            return current;
        } else {
            return best;
        }
    }, arr[0]);
}

function mid(v1,v2){
  return v1+Math.floor((v2-v1)/2);
}

function absIt(fn) {
    if (fn !== "function") return function(a, b) {
        return Math.abs(a - b);
    };
    return function(a, b) {
        return Math.abs(fn(a, b));
    };
}

function findClosestSorted(value, arr, cmp) {
    cmp = absIt(cmp);

    var end = arr.length - 1;
    var start = 0;
    var middle = mid(start, arr.length-1);

    var current = arr[middle];
    var best = current;

    var fail = end;

    while (fail--) {
        console.log(start, middle, end);
        if (start === end) return current;
        // if (start === middle) return current;
        // if (end === middle) return current;

        current = arr[middle];

        if (cmp(value, prev) < cmp(value, current)) {
            end = middle;
            middle = mid(start, middle);
        } else {
            start = middle;
            middle = mid(middle, end);
        }


        if (cmp(value, current) < cmp(value, best)) {
            best = current;
        }

        prev = current;

    }

    return best;

}

if (require.main === module) {
    var assert = require("assert");
    [
        {
            array: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            search: 8.8,
            res: 9
        },

        {
            array: [1, 5, 10],
            search: 6,
            res: 5
        },

        {
            array: [1, 5, 10],
            search: 0.1,
            res: 1
        },

        {
            array: [1, 5, 10],
            search: 10,
            res: 10
        },

        {
            array: [1, 5],
            search: 10,
            res: 5
        },

        {
            array: [1],
            search: 6,
            res: 1
        },

        {
            array: [],
            search: 6,
            res: undefined
        }


    ].forEach(function(sample) {
        console.log(sample);
        assert.equal(
            findClosestSorted(sample.search, sample.array),
            sample.res
        );
        console.log("OK");
    });
}
