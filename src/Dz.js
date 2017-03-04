import React from "react";
import {compose, lifecycle, withProps} from "recompose";
import {last} from "lodash/fp";
import {connectLean} from "lean-redux";
import qs from "querystring";
import u from "updeep";
import axios from "axios";
import moment from "moment";

import {View} from "./core";

var Dz = ({gusts, windAvg}) => {
    const g = gusts ? last(gusts.points) : "ladataan";
    const a = windAvg ? last(windAvg.points) : "ladataan";

    return (
        <View>
            dz näkymä3
            <View>
                {JSON.stringify(g)}
            </View>
            <View>
                {JSON.stringify(a)}
            </View>
        </View>
    );
};
Dz = compose(
    withProps(props => {
        return qs.parse(props.location.search.slice(1));
    }),
    connectLean({
        scope: "weatherData",

        mapState(state, props) {
            return state[props.fmisid];
        },

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
