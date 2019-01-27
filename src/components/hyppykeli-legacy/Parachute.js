import React from "react";
import simple, {css} from "react-simple";

import {View} from "./core";
import {addLatestGust} from "./LatestWindReadings";

const swing = css.keyframes({
    "0%": {transform: "rotate(30deg)"},
    "50%": {transform: "rotate(-30deg)"},
    "100%": {transform: "rotate(30deg)"},
});

const rotate = css.keyframes({
    "0%": {transform: "rotate(0deg)"},
    "100%": {transform: "rotate(360deg)"},
});

export const ParachutePlain = simple(
    View,
    {
        background: "url(https://hyppykeli.fi/parachute.svg)",
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat !important",
        backgroundPosition: "center",
        flex: 1,
        marginTop: 10,
        opacity: 0.08,
    },
    {
        swing: {
            animation: `${swing} 2s ease-in-out infinite`,
            transformOrigin: "50% 0%",
        },
        rotate: {
            animation: `${rotate} 1s linear infinite`,
            transformOrigin: "50% 15%",
        },
    },
);

var ConnectedParachute = ({value}) => {
    // value = 8;
    var gust = parseFloat(value, 10);
    if (gust >= 11) {
        return <ParachutePlain rotate />;
    }

    if (gust >= 8) {
        return <ParachutePlain swing />;
    }

    return <ParachutePlain />;
};
ConnectedParachute = addLatestGust(ConnectedParachute);

export default ConnectedParachute;
