
var d3 = require("d3");
var Promise = require("bluebird");
var fetchJSON = Promise.promisify(d3.json.bind(d3));


function ajaxpoller(url, opts) {

    console.log("Polling", url);
    var req = fetchJSON(url);

    opts.onPoll(req);

    req.then(function(res) {
        return Promise.delay(1000*60*2);
    }).then(ajaxpoller.bind(null, url, opts));
}

module.exports = ajaxpoller;
