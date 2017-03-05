import {connectLean} from "lean-redux";
import {withRouterProps} from "./utils";
import {compose} from "recompose";
import qs from "querystring";
import u from "updeep";
import axios from "axios";

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
            return {
                ...state[props.dzProps.fmisid],
                ...state[asLatLonPair(props.dzProps)],
            };
        },

        fetchGusts() {
            if (this.props.dzProps.fmisid) {
                axios(
                    `/api/observations/${this.props.dzProps.fmisid}/fi-1-1-windgust`
                ).then(res => {
                    this.setState(
                        u({
                            [this.props.dzProps.fmisid]: {
                                gusts: res.data,
                            },
                        })
                    );
                });
            }
        },

        fetchWindAvg() {
            if (this.props.dzProps.fmisid) {
                axios(
                    `/api/observations/${this.props.dzProps.fmisid}/fi-1-1-windspeedms`
                ).then(res => {
                    this.setState(
                        u({
                            [this.props.dzProps.fmisid]: {
                                windAvg: res.data,
                            },
                        })
                    );
                });
            }
        },

        fetchGustForecasts() {
            if (this.props.dzProps.lat && this.props.dzProps.lon) {
                axios(
                    `/api/forecasts/${asLatLonPair(this.props.dzProps)}/enn-s-1-1-windgust`
                ).then(res => {
                    this.setState(
                        u({
                            [asLatLonPair(this.props.dzProps)]: {
                                gustForecasts: res.data,
                            },
                        })
                    );
                });
            }
        },

        fetchWindAvgForecasts() {
            if (this.props.dzProps.lat && this.props.dzProps.lon) {
                axios(
                    `/api/forecasts/${asLatLonPair(this.props.dzProps)}/enn-s-1-1-windspeedms`
                ).then(res => {
                    this.setState(
                        u({
                            [asLatLonPair(this.props.dzProps)]: {
                                windAvgForecasts: res.data,
                            },
                        })
                    );
                });
            }
        },

        fetchAll() {
            this.fetchGusts();
            this.fetchWindAvg();
            this.fetchGustForecasts();
            this.fetchWindAvgForecasts();
        },
    })
);
