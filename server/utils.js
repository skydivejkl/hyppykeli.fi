const {parse, format} = require("url");
const qs = require("querystring");
const {parseString} = require("xml2js");
const axios = require("axios");

const extendUrlQuery = (url, query) => {
    const o = parse(url, true);
    o.search = qs.stringify(Object.assign({}, o.query, query));

    return format(o);
};

const xml2js = xml => new Promise((resove, reject) => {
    parseString(xml, (err, result) => {
        if (err) {
            reject(err);
        } else {
            resove(result);
        }
    });
});

const fmiRawRequest = async url => {
    console.log("Requesting", url);
    const response = await axios(url);
    return xml2js(response.data);
};

const fmiRequest = (apikey, query, params) => {
    const metarURL = `http://data.fmi.fi/fmi-apikey/${apikey}/wfs?request=getFeature`;

    const finalURL = extendUrlQuery(
        metarURL,
        Object.assign(
            {
                storedquery_id: query,
            },
            params
        )
    );

    return fmiRawRequest(finalURL);
};

module.exports = {
    xml2js,
    fmiRequest,
    fmiRawRequest,
};
