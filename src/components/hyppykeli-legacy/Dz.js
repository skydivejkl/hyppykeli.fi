import React from "react";
import {pure, compose, lifecycle, withPropsOnChange} from "recompose";
import {throttle} from "lodash/fp";
const throttleWithOptions = throttle.convert({fixed: false});
import simple from "react-simple";

import {View, Title, Sep} from "./core";
import {withBrowserEvent, addSetTimeout, getWindowOr} from "./utils";
import {addWeatherData} from "./weather-data";
import WindChart from "./WindChart";
import LatestClouds from "./LatestClouds";
import {LatestGust, LatestWindAvg} from "./LatestWindReadings";
import BrowserTitle from "./BrowserTitle";
import RefreshButton from "./RefreshButton";
import TitleLink from "./TitleLink";
import Parachute from "./Parachute";
import Cloud from "./Cloud";
import Sources from "./Sources";
import * as colors from "./colors";

const Header = simple(View, {
    paddingTop: 170,
    backgroundColor: colors.skyblue,
    paddingBottom: 50,
    overflow: "hidden",
    minHeight: 300,
});

const Background = simple(View, {
    position: "absolute",
    alignItems: "center",
    top: -10,
    left: 0,
    right: 0,
    bottom: 0,
});

const Row = simple(View, {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
});

const CloudContainer = simple(View, {
    position: "absolute",
    top: -40,
    width: "100%",
    height: 240,
    left: 0,
    right: 0,
});

const ParachuteContainer = simple(View, {
    position: "absolute",
    top: 25,
    height: 250,
    left: 0,
    right: 0,
});

const CloudText = simple(View, {
    color: colors.skyblue,
    fontSize: 50,
    fontWeight: "bold",
});

const Details = simple(View, {
    backgroundColor: "white",
});

const NoClouds = simple(View, {
    marginTop: 40,
    textAlign: "center",
});

const Dz = ({dzProps}) => {
    return (
        <View>
            <BrowserTitle title={dzProps.icaocode} />
            <Header>
                <Background>
                    <CloudContainer>
                        <Cloud>
                            <CloudText>{dzProps.icaocode}</CloudText>
                        </Cloud>
                    </CloudContainer>
                    <ParachuteContainer>
                        <Parachute />
                    </ParachuteContainer>
                </Background>

                <Row>
                    <LatestGust />
                    <LatestWindAvg />
                </Row>

                <Row>
                    {Boolean(dzProps.icaocode) && <LatestClouds />}
                    {Boolean(!dzProps.icaocode) && (
                        <NoClouds>
                            Ei tietoa pilvistä.
                            <br />
                            Kentälle ei tiedettävästi tehdä METAR-sanomia :(
                        </NoClouds>
                    )}
                </Row>
            </Header>

            <Details>
                <View>
                    <Sep />
                    <Row>
                        <Title>Tuulihavainnot ja -ennusteet</Title>
                    </Row>
                    <WindChart />

                    <Sep />
                    <Sep />
                </View>
                <Sources />
            </Details>

            <TitleLink to="/">Hyppykeli.fi</TitleLink>

            <RefreshButton />
        </View>
    );
};
const DzConnected = compose(
    addWeatherData,
    withPropsOnChange(["fetchAllWeatherData"], props => {
        const throttledRefresh = throttleWithOptions(
            1000 * 60,
            () => {
                console.log("ACTUAL REFRESH");
                props.fetchAllWeatherData();
            },
            {trailing: false},
        );

        return {
            throttledRefresh() {
                if (document.hidden) {
                    console.log("Window hidden. Skipping refresh");
                } else {
                    throttledRefresh();
                }
            },
        };
    }),
    addSetTimeout,
    lifecycle({
        componentDidMount() {
            this.props.fetchAllWeatherData({force: true});

            const scheduleRefresh = () => {
                this.props.setTimeout(() => {
                    console.log("Trying refresh from timer");

                    this.props.throttledRefresh();
                    scheduleRefresh();
                }, 1000 * 120);
            };

            scheduleRefresh();
        },
    }),
    withBrowserEvent(getWindowOr(null), "focus", ({props}) => {
        console.log("Trying refresh from window focus");
        props.throttledRefresh();
    }),
    withBrowserEvent(getWindowOr(null), "visibilitychange", ({props}) => {
        if (!document.hidden) {
            console.log("Trying refresh from visibilitychange");
            props.throttledRefresh();
        }
    }),
    pure,
)(Dz);

export default DzConnected;
