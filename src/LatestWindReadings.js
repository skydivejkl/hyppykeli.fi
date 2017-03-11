import React from "react";

import Spinner from "./Spinner";
import {compose, mapProps} from "recompose";
import {last} from "lodash/fp";
import simple from "react-simple";

import {GUST_LIMIT, GUST_LIMIT_B, View} from "./core";
import {fromNowWithClock, gpsDistance} from "./utils";
import {addWeatherData} from "./weather-data";

const DISTANCE_WARN_THRESHOLD = 5;

const WindReading = simple(View, {
    paddingLeft: 10,
    paddingRight: 10,
});

const WindTitle = simple(View, {
    color: "white",
    fontWeight: "bold",
    fontSize: 20,
    flexDirection: "row",
    alignItems: "center",
});

const WindDesc = simple(View, {
    fontSize: 12,
});

const Warning = simple(WindDesc.create("a"), {
    marginTop: 2,
    backgroundColor: "red",
    color: "yellow",
    padding: 5,
    fontWeight: "bold",
    textAlign: "center",
    textDecoration: "none",
});

const WarningLink = Warning.create("a");

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
    if (gust > GUST_LIMIT_B) {
        return (
            <Warning>
                Tuuliraja B+ ylittyy
            </Warning>
        );
    }

    if (gust > GUST_LIMIT) {
        return (
            <Warning>
                Tuuliraja ylittyy
            </Warning>
        );
    }

    return null;
};

const LatestReading = ({title, time, value, distance}) => (
    <WindReading>
        <WindTitle>
            {title} <ValueOrSpinner>{value}</ValueOrSpinner> m/s
        </WindTitle>
        {Boolean(time) && <WindDesc>{fromNowWithClock(time)}</WindDesc>}

        {gustLimitWarning(value)}

        {Boolean(distance > DISTANCE_WARN_THRESHOLD) &&
            <WarningLink href="#sources">
                Etäisyys mittausasemalle {Math.round(distance)} km
            </WarningLink>}
    </WindReading>
);

export const addLatestGust = compose(
    addWeatherData,
    mapProps(({gusts, dzProps}) => {
        var distance, gust;

        if (gusts) {
            distance = gpsDistance(gusts.stationCoordinates, dzProps);
            gust = last(gusts.points);
        }

        return {
            ...gust,
            distance,
            title: "Puuska",
        };
    })
);

export const LatestGust = addLatestGust(LatestReading);

export var LatestWindAvg = compose(
    addWeatherData,
    mapProps(({windAvg}) => {
        const avg = windAvg ? last(windAvg.points) : null;
        return {...avg, title: "Keskituuli"};
    })
)(LatestReading);
