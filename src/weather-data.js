import {connectLean} from "lean-redux";
import {withRouterProps} from "./utils";
import {compose} from "recompose";
import {getOr} from "lodash/fp";
import qs from "querystring";
import u from "updeep";
import axios from "axios";
import parseMetar from "metar";

const asLatLonPair = ({lat, lon}) => `${lat},${lon}`;

export const addWeatherData = compose(
    withRouterProps(router => {
        return {
            dzProps: qs.parse(router.location.search.slice(1)),
        };
    }),
    connectLean({
        scope: "weatherData",

        mapState(state, props) {
            const metars = getOr(
                [],
                ["data", props.dzProps.icaocode, "metars"],
                state
            ).map(parseMetar);

            return {
                requestCount: state.requestCount,
                metars,
                ...state.data[props.dzProps.fmisid],
                ...state.data[asLatLonPair(props.dzProps)],
            };
        },

        getInitialState() {
            return {requestCount: 0, data: {}};
        },

        clearWeatherData() {
            this.setState({data: {}});
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
                    this.setState(
                        u({
                            data: {
                                [this.props.dzProps.fmisid]: {
                                    gusts: res.data,
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
                    this.setState(
                        u({
                            data: {
                                [this.props.dzProps.fmisid]: {
                                    windAvg: res.data,
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
