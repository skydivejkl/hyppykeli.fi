import React from "react";

import Spinner from "./Spinner";
import {compose, mapProps} from "recompose";
import {findLast} from "lodash/fp";
import simple from "react-simple";

import {Note, GUST_LIMIT, GUST_LIMIT_B, View} from "./core";
import {fromNowWithClock, gpsDistance} from "./utils";
import {addWeatherData} from "./weather-data";

const findLatestProperValue = findLast(point => !isNaN(point.value));

const DISTANCE_WARN_THRESHOLD = 5;

const WindReading = simple(View, {
    alignItems: "center",
    minHeight: 80,
    minWidth: 235,
});

const WindTitle = simple(View, {
    color: "white",
    fontWeight: "bold",
    fontSize: 20,
    flexDirection: "row",
    alignItems: "center",
});

const NoteLink = Note.create("a");

const SpinnerContainer = simple(View, {
    width: 40,
    height: 40,
    display: "inline-flex",
    marginRight: 4,
    marginLeft: 4,
});

const Value = simple(WindTitle, {
    fontSize: 30,
    marginRight: 4,
    marginLeft: 4,
});

const ValueOrSpinner = ({children}) =>
    children ? (
        <Value>{children}</Value>
    ) : (
        <SpinnerContainer>
            <Spinner />
        </SpinnerContainer>
    );

const gustLimitWarning = gust => {
    if (gust >= GUST_LIMIT_B) {
        return <Note warning>Tuuliraja B+ ylittyy</Note>;
    }

    if (gust >= GUST_LIMIT) {
        return <Note warning>Tuuliraja ylittyy</Note>;
    }

    return null;
};

export var LatestGust = ({time, value, distance}) => (
    <WindReading>
        <WindTitle>
            Puuska <ValueOrSpinner>{value}</ValueOrSpinner> m/s
        </WindTitle>
        {Boolean(time) && <Note>{fromNowWithClock(time)}</Note>}

        {gustLimitWarning(value)}

        {Boolean(distance > DISTANCE_WARN_THRESHOLD) && (
            <NoteLink important href="#sources">
                Etäisyys havaintoasemalle {Math.round(distance)} km
            </NoteLink>
        )}
    </WindReading>
);
LatestGust = compose(
    addWeatherData,
    mapProps(({gusts, dzProps}) => {
        var distance, gust;

        if (gusts) {
            distance = gpsDistance(gusts.stationCoordinates, dzProps);
            gust = findLatestProperValue(gusts.points);
        }

        return {...gust, distance};
    })
)(LatestGust);

export var LatestWindAvg = ({time, value, distance, difference, gust}) => (
    <WindReading>
        <WindTitle>
            Keskituuli <ValueOrSpinner>{value}</ValueOrSpinner> m/s
        </WindTitle>

        {Boolean(time) && <Note>{fromNowWithClock(time)}</Note>}

        {Boolean(gust >= 5 && difference > 30) && (
            <Note warning={difference >= 50}>
                Puuska on {difference}% voimakkaampi
            </Note>
        )}

        {Boolean(distance > DISTANCE_WARN_THRESHOLD) && (
            <NoteLink important href="#sources">
                Etäisyys havaintoasemalle {Math.round(distance)} km
            </NoteLink>
        )}
    </WindReading>
);
LatestWindAvg = compose(
    addWeatherData,
    mapProps(({windAvg, gusts}) => {
        const avg = windAvg ? findLatestProperValue(windAvg.points) : null;

        let difference = 0;
        let gust = null;
        if (gusts && avg !== null) {
            gust = findLatestProperValue(gusts.points);
            difference = Math.round((gust.value / avg.value) * 100 - 100);
        }

        return {
            value: avg ? avg.value : null,
            time: avg ? avg.time : null,
            gust: gust ? gust.value : 0,
            difference,
        };
    })
)(LatestWindAvg);

export const addLatestGust = compose(
    addWeatherData,
    mapProps(({gusts}) => {
        if (gusts) {
            return findLatestProperValue(gusts.points);
        }
        return {value: 0};
    })
);
