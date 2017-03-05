import React from "react";
import {compose, lifecycle} from "recompose";
import {getOr, isEmpty} from "lodash/fp";
import simple, {css} from "react-simple";
import {Link} from "react-router-dom";
import FaBeer from "react-icons/lib/fa/backward";

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
    fontSize: 45,
    fontWeight: "bold",
    color: "white",
});

const SubTitle = simple(View, {
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
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        height: "100%",
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

const TitleLink = simple(View.create(Link), {
    flexDirection: "row",
    position: "absolute",
    left: 1,
    top: 1,
    fontSize: 20,
    textDecoration: "none",
    color: "black",
    alignItems: "center",
});

const Sky = simple(View, {
    backgroundColor: "skyblue",
    paddingBottom: 200,
    overflow: "hidden",
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
            <Sky>
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

            </Sky>

            {!dataMissing &&
                <View>
                    <Row>
                        <SubTitle>Tuulihavainnot ja ennusteet</SubTitle>
                    </Row>
                    <WindChart gusts={combinedGusts} avg={combinedAvg} />
                </View>}
            <TitleLink to="/"><FaBeer />hyppykeli.fi</TitleLink>
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
