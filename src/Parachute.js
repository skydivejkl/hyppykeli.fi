import React from "react";
import simple, {css} from "react-simple";

import {View} from "./core";
import {addLatestGust} from "./LatestWindReadings";

const swing = css.keyframes({
    "0%": {transform: "rotate(60deg)"},
    "50%": {transform: "rotate(-60deg)"},
    "100%": {transform: "rotate(60deg)"},
});

const rotate = css.keyframes({
    "0%": {transform: "rotate(0deg)"},
    "100%": {transform: "rotate(360deg)"},
});

const Parachute = simple(
    View,
    {
        background: "url(/parachute.svg)",
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat !important",
        backgroundPosition: "center",
        width: "100%",
        height: "100%",
        marginTop: 10,
        opacity: 0.08,
    },
    {
        swing: {
            animation: `${swing} 2s ease-in-out infinite`,
            transformOrigin: "50% 0%",
        },
        rotate: {
            animation: `${rotate} 0.8s linear infinite`,
            transformOrigin: "50% 15%",
        },
    }
);

var ConnectedParachute = ({value}) => {
    // value = 8;
    var gust = parseFloat(value, 10);
    if (gust >= 11) {
        return <Parachute rotate />;
    }

    if (gust >= 8) {
        return <Parachute swing />;
    }

    return <Parachute />;
};
ConnectedParachute = addLatestGust(ConnectedParachute);

export default ConnectedParachute;
