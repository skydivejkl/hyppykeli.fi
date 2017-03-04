import React from "react";
import {compose, lifecycle, withProps} from "recompose";
import {connectLean} from "lean-redux";
import qs from "querystring";
import u from "updeep";
import axios from "axios";

import {View} from "./core";

var Dz = () => (
    <View>
        dz näkymä3
    </View>
);
Dz = compose(
    withProps(props => {
        return qs.parse(props.location.search.slice(1));
    }),
    connectLean({
        scope: "weatherData",

        fetchGusts() {
            if (this.props.fmisid) {
                axios(
                    `/api/observations/${this.props.fmisid}/fi-1-1-windgust`
                ).then(res => {
                    this.setState(
                        u({
                            [this.props.fmisid]: {
                                gusts: res.data,
                            },
                        })
                    );
                });
            }
        },

        fetchWindAvg() {
            if (this.props.fmisid) {
                axios(
                    `/api/observations/${this.props.fmisid}/fi-1-1-windspeedms`
                ).then(res => {
                    this.setState(
                        u({
                            [this.props.fmisid]: {
                                windAvg: res.data,
                            },
                        })
                    );
                });
            }
        },

        fetchAll() {
            this.fetchGusts();
            this.fetchWindAvg();
        },
    }),
    lifecycle({
        componentDidMount() {
            this.props.fetchAll();
        },
    })
)(Dz);

export default Dz;
