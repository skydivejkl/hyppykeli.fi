import React from "react";
import {compose, lifecycle} from "recompose";
import {getOr, isEmpty, throttle} from "lodash/fp";
const throttleWithOptions = throttle.convert({fixed: false});
import simple, {css} from "react-simple";
import {Link} from "react-router-dom";
import BackArrow from "react-icons/lib/fa/backward";

import {View} from "./core";
import {withBrowserEvent, addSetTimeout} from "./utils";
import {addWeatherData} from "./weather-data";
import WindChart from "./WindChart";
import LatestClouds from "./LatestClouds";
import {LatestGust, LatestWindAvg, addLatestGust} from "./LatestWindReadings";
import BrowserTitle from "./BrowserTitle";
import RefreshButton from "./RefreshButton";

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

const Sep = simple(View, {
    width: 10,
    height: 10,
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
        width: 230,
        backgroundRepeat: "no-repeat !important",
        backgroundPosition: "center",
        height: 250,
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

var ConnectedParachute = ({value}) => {
    // value = 8;
    var gust = parseFloat(value, 10);
    if (gust >= 11) {
        return <Parachute rotate />;
    }

    if (gust >= 8) {
        return <Parachute swing />;
    }

    return <Parachute />;
};
ConnectedParachute = addLatestGust(ConnectedParachute);

const ParachuteContainer = simple(View, {
    position: "absolute",
    alignItems: "center",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
});

const TitleLink = simple(View.create(Link), {
    color: "white",
    flexDirection: "row",
    position: "absolute",
    left: 1,
    top: 1,
    fontSize: 25,
    textDecoration: "none",
    alignItems: "center",
});

const Sky = simple(View, {
    backgroundColor: "skyblue",
    paddingBottom: 50,
    paddingTop: 25,
    overflow: "hidden",
    marginBottom: 25,
    minHeight: 300,
});

const CloudContainer = simple(Row, {
    marginTop: 35,
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
            <BrowserTitle title={dzProps.icaocode} />
            <Sky>
                <ParachuteContainer>
                    <ConnectedParachute />
                </ParachuteContainer>

                <Row>
                    <Title>{dzProps.icaocode}</Title>
                </Row>

                <Row>
                    <LatestGust />
                    <LatestWindAvg />
                </Row>

                <CloudContainer>
                    <LatestClouds />
                </CloudContainer>

            </Sky>

            {!dataMissing &&
                <View>
                    <Row>
                        <SubTitle>Tuulihavainnot ja ennusteet</SubTitle>
                    </Row>
                    <WindChart gusts={combinedGusts} avg={combinedAvg} />
                </View>}

            <TitleLink to="/"><BackArrow /><Sep />Hyppykeli.fi</TitleLink>
            <RefreshButton />
        </View>
    );
};
var i = 0;
Dz = compose(
    addWeatherData,
    addSetTimeout,
    lifecycle({
        componentDidMount() {
            this.props.fetchAllWeatherData({force: true});

            const {icaocode} = this.props.dzProps;

            const refreshTimeout = () => {
                this.props.setTimeout(
                    () => {
                        this.props.fetchAllWeatherData();
                        console.log(
                            "Automatic refresh from timer",
                            icaocode,
                            ++i
                        );
                        refreshTimeout();
                    },
                    1000 * 30
                );
            };

            refreshTimeout();
        },
    }),
    withBrowserEvent(
        window,
        "focus",
        throttleWithOptions(
            1000 * 30,
            ({props}) => {
                console.log("Triggering refresh from window focus");
                props.fetchAllWeatherData();
            },
            {trailing: false}
        )
    )
)(Dz);

export default Dz;
