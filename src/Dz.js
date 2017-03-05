import React from "react";
import {compose, lifecycle, mapProps} from "recompose";
import {getOr, isEmpty} from "lodash/fp";
import simple, {css} from "react-simple";

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
    flexWrap: "wrap",
});

const Title = simple(View, {
    fontSize: 35,
});

const SubTitle = simple(View, {
    marginTop: 50,
    fontSize: 25,
});

const swing = css.keyframes({
    "0%": {transform: "rotate(60deg)"},
    "50%": {transform: "rotate(-60deg)"},
    "100%": {transform: "rotate(60deg)"},
});

const rotate = css.keyframes({
    "0%": {transform: "rotate(0deg)"},
    "100%": {transform: "rotate(360deg)"},
});

const Parachute = simple(
    View,
    {
        background: "url(/parachute.svg)",
        backgroundSize: "contain",
        width: 200,
        height: 200,
        marginTop: 10,
        opacity: 0.08,
    },
    {
        swing: {
            animation: `${swing} 2s ease-in-out infinite`,
            transformOrigin: "50% 0%",
        },
        rotate: {
            animation: `${rotate} 0.8s linear infinite`,
            transformOrigin: "50% 15%",
        },
    }
);

const ParachuteContainer = simple(View, {
    position: "absolute",
    alignItems: "center",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
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
            <ParachuteContainer>
                <Parachute swing />
            </ParachuteContainer>
            <Row>
                <Title>{dzProps.icaocode}</Title>
            </Row>

            <Row>
                <LatestGust />
                <LatestWindAvg />
            </Row>

            {!dataMissing &&
                <View>
                    <Row>
                        <SubTitle>Tuulihavainnot ja ennusteet</SubTitle>
                    </Row>
                    <WindChart gusts={combinedGusts} avg={combinedAvg} />
                </View>}
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
