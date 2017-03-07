import React from "react";
import simple, {css} from "react-simple";

import {View} from "./core";
import {addLatestGust} from "./LatestWindReadings";

const HeaderContainer = simple(View, {
    backgroundColor: "skyblue",
    paddingBottom: 50,
    paddingTop: 25,
    overflow: "hidden",
    marginBottom: 25,
    minHeight: 300,
});

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
        width: 230,
        backgroundRepeat: "no-repeat !important",
        backgroundPosition: "center",
        height: 250,
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

const ParachuteContainer = simple(View, {
    position: "absolute",
    alignItems: "center",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
});

const Header = ({children, ...props}) => (
    <HeaderContainer {...props}>
        <ParachuteContainer>
            <ConnectedParachute />
        </ParachuteContainer>
        {children}
    </HeaderContainer>
);

export default Header;
