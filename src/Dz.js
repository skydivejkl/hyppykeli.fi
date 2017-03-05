import React from "react";
import {compose, lifecycle} from "recompose";
import {first, last, getOr, isEmpty, maxBy} from "lodash/fp";

import {View} from "./core";
import {addWeatherData} from "./weather-data";
import WindChart from "./WindChart";

const getPoints = getOr([], ["points"]);

const combineObsFore = (obs, avg) => getPoints(obs)
    .map(d => ({
        ...d,
        type: "observation",
    }))
    .concat(
        getPoints(avg).slice(0, 6).map(d => ({
            ...d,
            type: "forecast",
        }))
    );

var Dz = ({gusts, windAvg, gustForecasts, windAvgForecasts}) => {
    const g = gusts ? last(gusts.points) : "ladataan";

    const a = windAvg ? last(windAvg.points) : "ladataan";

    const dataMissing = [
        isEmpty(getPoints(gusts)),
        isEmpty(getPoints(windAvg)),
        isEmpty(getPoints(gustForecasts)),
        isEmpty(getPoints(windAvgForecasts)),
    ].some(Boolean);

    const combinedGusts = combineObsFore(gusts, gustForecasts);
    const combinedAvg = combineObsFore(windAvg, windAvgForecasts);

    return (
        <View>
            dz näkymä3
            {!dataMissing &&
                <WindChart gusts={combinedGusts} avg={combinedAvg} />}
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
    addWeatherData,
    lifecycle({
        componentDidMount() {
            this.props.fetchAll();
        },
    })
)(Dz);

export default Dz;
