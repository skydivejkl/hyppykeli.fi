import React from "react";
import simple from "react-simple";
import CloudFa from "react-icons/lib/fa/cloud";

import {View} from "./core";

const CloudFlex = simple(View.create(CloudFa), {
    color: "rgba(255, 255, 255, 0.7)",
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
    marginLeft: 10,
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    width: "100%",
});

const LinkText = simple(View, {
    textAlign: "center",
    color: "skyblue",
    fontSize: 40,
});

const Cloud = ({children}) => (
    <CloudContainer>
        <CloudBackground>
            <CloudFlex />
        </CloudBackground>
        <LinkText>{children}</LinkText>
    </CloudContainer>
);

export default Cloud;
