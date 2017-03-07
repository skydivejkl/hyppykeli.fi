import React from "react";
import {compose, lifecycle} from "recompose";
import {getOr, isEmpty, throttle} from "lodash/fp";
const throttleWithOptions = throttle.convert({fixed: false});
import simple from "react-simple";

import {View} from "./core";
import {withBrowserEvent, addSetTimeout} from "./utils";
import Header from "./Header";
import {addWeatherData} from "./weather-data";
import WindChart from "./WindChart";
import LatestClouds from "./LatestClouds";
import {LatestGust, LatestWindAvg, addLatestGust} from "./LatestWindReadings";
import BrowserTitle from "./BrowserTitle";
import RefreshButton from "./RefreshButton";
import TitleLink from "./TitleLink";

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

const Sep = simple(View, {
    width: 15,
    height: 15,
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
            <Header>

                <Row>
                    <Title>{dzProps.icaocode}</Title>
                </Row>

                <Sep />

                <Row>
                    <LatestGust />
                    <LatestWindAvg />
                </Row>

                <Sep />
                <Sep />

                <Row>
                    <LatestClouds />
                </Row>

            </Header>

            {!dataMissing &&
                <View>
                    <Row>
                        <SubTitle>Tuulihavainnot ja -ennusteet</SubTitle>
                    </Row>
                    <WindChart gusts={combinedGusts} avg={combinedAvg} />
                </View>}

            <TitleLink to="/">
                Hyppykeli.fi
            </TitleLink>
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
