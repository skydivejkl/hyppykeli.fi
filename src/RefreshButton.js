import React from "react";
import simple, {css} from "react-simple";
import {compose, withHandlers} from "recompose";

import Spinner from "./Spinner";
import {View} from "./core";

import {addWeatherData} from "./weather-data";
import RefreshIcon_ from "react-icons/lib/fa/refresh";

const RefreshIcon = simple(View.create(RefreshIcon_), {
    width: "70%",
    height: "70%",
    color: "white",
});

const rotate = css.keyframes({
    "0%": {transform: "rotate(0deg)"},
    "100%": {transform: "rotate(360deg)"},
});

const RefreshButtonContainer = simple(View.create("a"), {
    position: "absolute",
    top: 0,
    right: 0,
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    ":hover": {
        animation: `${rotate} 3s linear infinite`,
    },
});

const Background = simple(View, {
    position: "absolute",
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    color: "white",
});

var RefreshButton = ({requestCount, refresh}) => (
    <RefreshButtonContainer href="#" onClick={refresh}>
        {requestCount !== 0 && <Background>{requestCount}</Background>}
        {requestCount === 0 ? <RefreshIcon /> : <Spinner />}
    </RefreshButtonContainer>
);
RefreshButton = compose(
    addWeatherData,
    withHandlers({
        refresh: props => e => {
            e.preventDefault();
            props.clearWeatherData();
            props.fetchAllWeatherData();
        },
    })
)(RefreshButton);

export default addWeatherData(RefreshButton);
