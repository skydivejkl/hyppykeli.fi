import React from "react";
import {compose, mapProps} from "recompose";
import simple from "react-simple";
import {last, isEmpty} from "lodash/fp";
import Bolt_ from "react-icons/lib/fa/bolt";

import {addWeatherData} from "./weather-data";
import {View, Note} from "./core";
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

const CloudTitle = simple("div", {
    color: "white",
    fontWeight: "bold",
    fontSize: 20,
    flexDirection: "row",
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

const LatestCloudsContainer = simple(View, {
    minHeight: 100,
    width: "100%",
    alignItems: "center",
});

const SpinnerContainer = simple(View, {
    width: 40,
    height: 40,
});

const NoteLink = simple(Note.create("a"), {
    display: "inline",
    marginLeft: 4,
    ":hover": {
        textDecoration: "underline",
    },
});

var LatestClouds = ({metar}) => {
    if (!metar) {
        return (
            <LatestCloudsContainer>
                <CloudTitle>Pilvikerrokset</CloudTitle>
                <SpinnerContainer>
                    <Spinner />
                </SpinnerContainer>
            </LatestCloudsContainer>
        );
    }

    if (metar.cavok) {
        return (
            <LatestCloudsContainer>
                <CloudTitle>Pilvikerrokset</CloudTitle>
                <Cloud>Ei pilviä alle 1500M (CAVOK)</Cloud>
                <TimeContainer>
                    {fromNowWithClock(metar.time)}
                </TimeContainer>
            </LatestCloudsContainer>
        );
    }

    return (
        <LatestCloudsContainer>
            <CloudTitle>Pilvikerrokset</CloudTitle>

            {isEmpty(metar.clouds) &&
                <Cloud>
                    Ei tietoa.
                    <NoteLink warning href="#metar">
                        Tarkista METAR.
                    </NoteLink>
                </Cloud>}

            {!isEmpty(metar.clouds) &&
                metar.clouds.map((cloud, i) => {
                    var altText = "";

                    if (cloud.altitude > 0) {
                        altText = Math.round(cloud.altitude * 0.3048) + " M";
                    }

                    return (
                        <Cloud key={i}>
                            {cloud.cumulonimbus && <Bolt title="Ukkospilvi!" />}
                            {
                                `${getHumanMeaning(cloud.abbreviation)} ${altText}`
                            }
                        </Cloud>
                    );
                })}

            <TimeContainer>
                {fromNowWithClock(metar.time)}
            </TimeContainer>

        </LatestCloudsContainer>
    );
};

LatestClouds = compose(
    addWeatherData,
    mapProps(({metars}) => {
        return {metar: last(metars)};
    })
)(LatestClouds);

export default LatestClouds;
