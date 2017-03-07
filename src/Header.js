import React from "react";
import simple from "react-simple";

import {View} from "./core";
import Parachute from "./Parachute";

const HeaderContainer = simple(View, {
    backgroundColor: "skyblue",
    paddingBottom: 50,
    paddingTop: 25,
    overflow: "hidden",
    marginBottom: 25,
    minHeight: 300,
});

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
            <Parachute />
        </ParachuteContainer>
        {children}
    </HeaderContainer>
);

export default Header;
