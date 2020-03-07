import React from "react";
import styled from "@emotion/styled";
import {keyframes} from "@emotion/core";

import {View} from "./core";
import {addLatestGust} from "./LatestWindReadings";

const swing = keyframes`
    0% {
        transform: rotate(30deg);
    }
    50% {
        transform: rotate(-30deg);
    }
    100% {
        transform: rotate(30deg);
    }
`;

const rotate = keyframes`
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
`;

export const ParachutePlain = styled(View)(
    {
        background: "url(/parachute.svg)",
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat !important",
        backgroundPosition: "center",
        flex: 1,
        marginTop: 10,
        opacity: 0.08,
    },
    props => {
        if (props.swing) {
            return {
                animation: `${swing} 2s ease-in-out infinite`,
                transformOrigin: "50% 0%",
            };
        }

        if (props.rotate) {
            return {
                animation: `${rotate} 1s linear infinite`,
                transformOrigin: "50% 15%",
            };
        }

        return {};
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
