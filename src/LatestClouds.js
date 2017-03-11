import React from "react";
import {compose, mapProps} from "recompose";
import simple from "react-simple";
import {last} from "lodash/fp";

import {addWeatherData} from "./weather-data";
import {View} from "./core";
import Spinner from "./Spinner";
import {fromNowWithClock} from "./utils";

const CLOUDS = {
    NSC: "Yksittäisiä",
    FEW: "Muutamia",
    SCT: "Hajanaisia",
    BKN: "Rakoileva",
    OVC: "Täysi pilvikatto",
};

const getHumanMeaning = code => CLOUDS[code] || code;

const CloudTitle = simple(View, {
    color: "white",
    fontWeight: "bold",
    fontSize: 20,
    flexDirection: "row",
    // alignItems: "center",
    // textAlign: "center",
});

const Cloud = simple(View, {
    color: "white",
    fontWeight: "bold",
    fontSize: 15,
    margin: 5,
});

const TimeContainer = simple(View, {
    textAlign: "center !important",
});

var LatestClouds = ({metar}) => {
    if (!metar) {
        return <Spinner />;
    }

    if (metar.cavok) {
        return (
            <View>
                <CloudTitle>Ei pilviä alle 1500M (CAVOK)</CloudTitle>
                <TimeContainer>
                    {fromNowWithClock(metar.time)}
                </TimeContainer>
            </View>
        );
    }

    return (
        <View>
            <CloudTitle>Pilvikerrokset</CloudTitle>

            {metar.clouds.map((cloud, i) => (
                <Cloud key={i}>
                    {
                        `${getHumanMeaning(cloud.abbreviation)} ${Math.round(cloud.altitude * 0.3048)} M`
                    }
                </Cloud>
            ))}

            <TimeContainer>
                {fromNowWithClock(metar.time)}
            </TimeContainer>

        </View>
    );
};

LatestClouds = compose(
    addWeatherData,
    mapProps(({metars}) => {
        return {metar: last(metars)};
    })
)(LatestClouds);

export default LatestClouds;
