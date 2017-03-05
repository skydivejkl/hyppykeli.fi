import React from "react";
import {compose, lifecycle, mapProps} from "recompose";
import {first, last, getOr, isEmpty, maxBy} from "lodash/fp";
import simple from "react-simple";

import {View} from "./core";
import {addWeatherData} from "./weather-data";
import WindChart from "./WindChart";
import {LatestGust, LatestWindAvg} from "./LatestWindReadings";

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

const Row = simple(View, {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "center",
    paddingLeft: 10,
    paddingRight: 10,
});

const Title = simple(View, {
    fontSize: 35,
});

var Dz = ({dzProps, gusts, windAvg, gustForecasts, windAvgForecasts}) => {
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
            <Row>
                <Title>{dzProps.icaocode}</Title>
            </Row>
            <Row>
                <LatestGust />
                <LatestWindAvg />
            </Row>

            {!dataMissing &&
                <WindChart gusts={combinedGusts} avg={combinedAvg} />}
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
