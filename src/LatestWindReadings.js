import React from "react";

import Spinner from "./Spinner";
import {compose, mapProps} from "recompose";
import {last} from "lodash/fp";
import simple from "react-simple";

import {View} from "./core";
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
    color: "red",
    textDecoration: "none",
});

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

const LatestReading = ({title, time, value, distance}) => (
    <WindReading>
        <WindTitle>
            {title} <ValueOrSpinner>{value}</ValueOrSpinner> m/s
        </WindTitle>
        {Boolean(time) && <WindDesc>{fromNowWithClock(time)}</WindDesc>}
        {Boolean(distance > DISTANCE_WARN_THRESHOLD) &&
            <Warning href="#sources">
                Mittausasema on {Math.round(distance)} km päässä
            </Warning>}
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
