import React from "react";
import { FaCloud } from "react-icons/fa";

import { View, simple } from "./core";

const CloudFlex = simple(View.create(FaCloud), {
    color: "white",
    height: "100%",
    width: "100%",
});

const CloudBackground = simple(View, {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
});

const CloudContainer = simple(View, {
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    width: "100%",
});

const Cloud = ({ children }) => (
    <CloudContainer>
        <CloudBackground>
            <CloudFlex />
        </CloudBackground>
        {children}
    </CloudContainer>
);

export default Cloud;
