import React from "react";
import {compose, mapProps} from "recompose";
import simple from "react-simple";
import {last} from "lodash/fp";
import Bolt_ from "react-icons/lib/fa/bolt";

import {addWeatherData} from "./weather-data";
import {View} from "./core";
import Spinner from "./Spinner";
import {fromNowWithClock} from "./utils";
import * as colors from "./colors";

const Bolt = simple(View.create(Bolt_), {
    width: 20,
    height: 20,
    color: colors.darkBlue,
});

const CLOUDS = {
    NCD: "Ei pilviä",
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
    flexDirection: "row",
    alignItems: "center",
    color: "white",
    fontWeight: "bold",
    fontSize: 15,
    margin: 5,
});

const TimeContainer = simple(View, {
    textAlign: "left !important",
});

var LatestClouds = ({metar}) => {
    if (!metar) {
        return <Spinner />;
    }

    if (metar.cavok) {
        return (
            <View>
                <CloudTitle>Pilvikerrokset</CloudTitle>
                <Cloud>Ei pilviä alle 1500M (CAVOK)</Cloud>
                <TimeContainer>
                    {fromNowWithClock(metar.time)}
                </TimeContainer>
            </View>
        );
    }

    return (
        <View>
            <CloudTitle>Pilvikerrokset</CloudTitle>

            {metar.clouds.map((cloud, i) => {
                var altText = "";

                if (cloud.altitude > 0) {
                    altText = Math.round(cloud.altitude * 0.3048) + " M";
                }

                return (
                    <Cloud key={i}>
                        {cloud.cumulonimbus && <Bolt title="Ukkospilvi!" />}
                        {`${getHumanMeaning(cloud.abbreviation)} ${altText}`}
                    </Cloud>
                );
            })}

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
