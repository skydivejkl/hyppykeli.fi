import {connectLean} from "lean-redux";
import {withRouterProps} from "./utils";
import {createSelector} from "reselect";
import {compose} from "recompose";
import {getOr} from "lodash/fp";
import qs from "querystring";
import u from "updeep";
import axios from "axios";
import parseMetar from "metar";

import dropzones from "../dropzones";

const asLatLonPair = ({lat, lon}) => `${lat},${lon}`;

const parseFmiLatLon = s => {
    if (!s) {
        return null;
    }
    const [latS, lonS] = s.trim().split(" ");
    return {
        lat: parseFloat(latS, 10),
        lon: parseFloat(lonS, 10),
    };
};
const wait = t => new Promise(r => setTimeout(r, t));

const emptyArray = [];
const emptyObject = {};

const selectMetars = createSelector(
    (state, props) =>
        getOr(emptyArray, ["data", props.dzProps.icaocode, "metars"], state),
    metars => {
        return metars.map(raw => {
            return {
                raw,
                ...parseMetar(raw),
            };
        });
    }
);

const parseStationCoordinates = u({
    stationCoordinates: parseFmiLatLon,
});

export const addWeatherData = compose(
    withRouterProps(router => {
        var predifedProps = null;
        if (router.match.params.dz) {
            predifedProps = dropzones[router.match.params.dz];
        }

        return {
            dzProps: {
                name: router.match.params.dz,
                ...predifedProps,
                ...qs.parse(router.location.search.slice(1)),
            },
        };
    }),
    connectLean({
        scope: "weatherData",

        mapState(state, props) {
            return {
                metars: selectMetars(state, props),
                requestCount: state.requestCount,
                ...state.data[props.dzProps.fmisid],
                ...state.data[asLatLonPair(props.dzProps)],
            };
        },

        getInitialState() {
            return {requestCount: 0, data: emptyObject};
        },

        clearWeatherData() {
            this.setState({data: emptyObject});
        },

        _inc() {
            this.setState(s => ({
                requestCount: s.requestCount + 1,
            }));
        },

        _dec() {
            this.setState(s => ({
                requestCount: s.requestCount - 1,
            }));
        },

        request(url) {
            this._inc();

            return axios(url).then(
                res => {
                    this._dec();
                    return res;
                },
                error => {
                    this._dec();
                    throw error;
                }
            );
        },

        fetchGusts() {
            if (this.props.dzProps.fmisid) {
                return this.request(
                    `/api/observations/${this.props.dzProps.fmisid}/fi-1-1-windgust`
                ).then(res => {
                    console.log("setting gust observations");
                    this.setState(
                        u({
                            data: {
                                [this.props.dzProps.fmisid]: {
                                    gusts: parseStationCoordinates(res.data),
                                },
                            },
                        })
                    );
                });
            }

            return Promise.resolve();
        },

        fetchWindAvg() {
            if (this.props.dzProps.fmisid) {
                return this.request(
                    `/api/observations/${this.props.dzProps.fmisid}/fi-1-1-windspeedms`
                ).then(res => {
                    console.log("setting avg observations");
                    this.setState(
                        u({
                            data: {
                                [this.props.dzProps.fmisid]: {
                                    windAvg: parseStationCoordinates(res.data),
                                },
                            },
                        })
                    );
                });
            }

            return Promise.resolve();
        },

        fetchGustForecasts() {
            if (this.props.dzProps.lat && this.props.dzProps.lon) {
                return this.request(
                    `/api/forecasts/${asLatLonPair(this.props.dzProps)}/enn-s-1-1-windgust`
                ).then(res => {
                    console.log("setting gust forcecasts");
                    this.setState(
                        u({
                            data: {
                                [asLatLonPair(this.props.dzProps)]: {
                                    gustForecasts: res.data,
                                },
                            },
                        })
                    );
                });
            }

            return Promise.resolve();
        },

        fetchWindAvgForecasts() {
            if (this.props.dzProps.lat && this.props.dzProps.lon) {
                return this.request(
                    `/api/forecasts/${asLatLonPair(this.props.dzProps)}/enn-s-1-1-windspeedms`
                ).then(res => {
                    console.log("setting avg forcecasts");
                    this.setState(
                        u({
                            data: {
                                [asLatLonPair(this.props.dzProps)]: {
                                    windAvgForecasts: res.data,
                                },
                            },
                        })
                    );
                });
            }

            return Promise.resolve();
        },

        fetchMetars() {
            if (this.props.dzProps.icaocode) {
                return this.request(
                    `/api/metars/${this.props.dzProps.icaocode}`
                ).then(res => {
                    console.log("setting metar data");
                    this.setState(
                        u({
                            data: {
                                [this.props.dzProps.icaocode]: {
                                    metars: res.data,
                                },
                            },
                        })
                    );
                });
            }

            return Promise.resolve();
        },

        fetchAllWeatherData(options = {}) {
            if (!options.force && this.state.requestCount > 0) {
                console.warn("Request already in progress. Skipping fetch.");
                return;
            }

            this.fetchGusts().then(() => {
                this.fetchWindAvg();
                this.fetchGustForecasts();
                this.fetchWindAvgForecasts();
                this.fetchMetars();
            });
        },
    })
);
