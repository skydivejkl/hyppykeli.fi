import React from "react";
import simple, {css} from "react-simple";
import {compose, withHandlers} from "recompose";

import Spinner from "./Spinner";
import {View} from "./core";

import {addWeatherData} from "./weather-data";
import RefreshIcon_ from "react-icons/lib/fa/refresh";

const RefreshIcon = simple(View.create(RefreshIcon_), {
    color: "white",
    width: "100%",
    height: "100%",
});

const RefreshButtonContainer = simple(View.create("a"), {
    position: "absolute",
    top: 0,
    right: 0,
    width: 70,
    height: 70,
    alignItems: "flex-end",
    textDecoration: "none",
});

const SizeWrap = simple(View, {
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
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
        <SizeWrap>
            {requestCount !== 0 && <Background>{requestCount}</Background>}
            {requestCount === 0 ? <RefreshIcon /> : <Spinner />}
        </SizeWrap>
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
