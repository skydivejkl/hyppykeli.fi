import Spinner from "./Spinner";
import React from "react";
import {compose, mapProps} from "recompose";
import {last} from "lodash/fp";
import simple from "react-simple";

import {View} from "./core";
import {fromNowWithClock} from "./utils";
import {addWeatherData} from "./weather-data";

const WindReading = simple(View, {
    paddingLeft: 10,
    paddingRight: 10,
});

const WindTitle = simple(View, {
    fontWeight: "bold",
    fontSize: 20,
    flexDirection: "row",
    alignItems: "center",
});

const WindDesc = simple(View, {
    fontSize: 12,
});

const SpinnerContainer = simple(View, {
    width: 30,
    height: 30,
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

const LatestReading = ({title, time, value}) => (
    <WindReading>
        <WindTitle>
            {title} <ValueOrSpinner>{value}</ValueOrSpinner> m/s
        </WindTitle>
        {Boolean(time) && <WindDesc>{fromNowWithClock(time)}</WindDesc>}
    </WindReading>
);

export var LatestGust = compose(
    addWeatherData,
    mapProps(({gusts}) => {
        const gust = gusts ? last(gusts.points) : null;
        return {...gust, title: "Puuska"};
    })
)(LatestReading);

export var LatestWindAvg = compose(
    addWeatherData,
    mapProps(({windAvg}) => {
        const avg = windAvg ? last(windAvg.points) : null;
        return {...avg, title: "Keskituuli"};
    })
)(LatestReading);
