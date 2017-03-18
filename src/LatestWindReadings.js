import React from "react";

import Spinner from "./Spinner";
import {compose, mapProps} from "recompose";
import {findLast} from "lodash/fp";
import simple from "react-simple";

import {GUST_LIMIT, GUST_LIMIT_B, View} from "./core";
import {fromNowWithClock, gpsDistance} from "./utils";
import {addWeatherData} from "./weather-data";
import * as colors from "./colors";

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

const Note = simple(
    View,
    {
        marginTop: 2,
        fontWeight: "bold",
        textDecoration: "none",
    },
    {
        warning: {
            color: colors.darkBlue,
        },
        important: {
            textAlign: "center",
            padding: 5,
            backgroundColor: "red",
            color: "yellow",
        },
    }
);

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
    children
        ? <Value>{children}</Value>
        : <SpinnerContainer><Spinner /></SpinnerContainer>;

const gustLimitWarning = gust => {
    if (gust >= GUST_LIMIT_B) {
        return (
            <Note warning>
                Tuuliraja B+ ylittyy
            </Note>
        );
    }

    if (gust >= GUST_LIMIT) {
        return (
            <Note warning>
                Tuuliraja ylittyy
            </Note>
        );
    }

    return null;
};

const LatestReading = ({title, time, value, distance}) => (
    <WindReading>
        <WindTitle>
            {title} <ValueOrSpinner>{value}</ValueOrSpinner> m/s
        </WindTitle>
        {Boolean(time) && <Note>{fromNowWithClock(time)}</Note>}

        {gustLimitWarning(value)}

        {Boolean(distance > DISTANCE_WARN_THRESHOLD) &&
            <NoteLink important href="#sources">
                Etäisyys havaintoasemalle {Math.round(distance)} km
            </NoteLink>}
    </WindReading>
);

export const addLatestGust = compose(
    addWeatherData,
    mapProps(({gusts, dzProps}) => {
        var distance, gust;

        if (gusts) {
            distance = gpsDistance(gusts.stationCoordinates, dzProps);
            gust = findLatestProperValue(gusts.points);
        }

        return {
            ...gust,
            distance,
            title: "Puuska",
            // value: 8,
        };
    })
);

export const LatestGust = addLatestGust(LatestReading);

export var LatestWindAvg = compose(
    addWeatherData,
    mapProps(({windAvg}) => {
        const avg = windAvg ? findLatestProperValue(windAvg.points) : null;
        return {...avg, title: "Keskituuli"};
    })
)(LatestReading);
