const { parse, format } = require("url");
import qs from "querystring";
const { parseString } = require("xml2js");
import axios from "axios";

function extendUrlQuery(url: string, query: any): string {
    const o = parse(url, true);
    o.search = qs.stringify(Object.assign({}, o.query, query));

    return format(o);
}

async function xml2js(xml: any) {
    return new Promise((resove, reject) => {
        parseString(xml, (err: any, result: any) => {
            if (err) {
                reject(err);
            } else {
                resove(result);
            }
        });
    });
}

const fmiRequestCache: Record<string, any> = {};

async function fmiRawRequest(
    url: string,
    options: { cacheAge?: number; cacheKey: string },
) {
    if (!options) {
        throw new Error("options missing from fmiRawRequest");
    }

    if (!options.cacheAge) {
        options.cacheAge = 30;
    }

    console.log("FMI request", url);

    const existingRequest = fmiRequestCache[options.cacheKey];

    if (existingRequest) {
        await existingRequest.promise;
        const age = Date.now() - existingRequest.created;
        if (age / 1000 < options.cacheAge) {
            console.log("Cache fresh.");
            return existingRequest.promise;
        }

        console.log("Cache expired.");
    } else {
        console.log("No cache.");
    }

    const promise = axios(url)
        .then(res => {
            console.log("FMI request completed", url);
            return xml2js(res.data);
        })
        .catch(error => {
            console.error("FMI request failed", error);
            delete fmiRequestCache[options.cacheKey];
            throw error;
        });

    fmiRequestCache[options.cacheKey] = {
        promise,
        cacheAge: options.cacheAge,
        created: Date.now(),
    };

    return promise;
}

export function fmiRequest(options: {
    query: string;
    params: any;
    cacheKey: string;
    cacheAge?: number;
}) {
    const metarURL = `http://opendata.fmi.fi/wfs?request=getFeature`;

    const finalURL = extendUrlQuery(
        metarURL,
        Object.assign(
            {
                storedquery_id: options.query,
            },
            options.params,
        ),
    );

    return fmiRawRequest(finalURL, {
        cacheKey: options.cacheKey,
        cacheAge: options.cacheAge,
    });
}
