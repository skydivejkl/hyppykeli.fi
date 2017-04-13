import React from "react";
import simple from "react-simple";

import {View} from "./core";
import Parachute from "./Parachute";

const Header = ({children, ...props}) => (
    <HeaderContainer {...props}>
        {children}
    </HeaderContainer>
);

export default Header;
