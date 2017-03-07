import React from "react";
import simple from "react-simple";
import {Link} from "react-router-dom";
import BackArrowIcon_ from "react-icons/lib/fa/backward";

import {View} from "./core";

const BackArrowIcon = simple(View.create(BackArrowIcon_), {
    width: 30,
    height: 30,
    color: "white",
});

const Row = simple(View, {
    flexDirection: "row",
    alignItems: "center",
    fontSize: 15,
});

const Sep = simple(View, {
    width: 10,
    height: 10,
});

const TitleLinkContainer = simple(View.create(Link), {
    color: "white",
    flexDirection: "row",
    position: "absolute",
    left: 0,
    top: 0,
    height: 70,
    minWidth: 70,
    alignItems: "flex-start",
    textDecoration: "none",
});

const TitleLink = ({children, ...props}) => (
    <TitleLinkContainer {...props}>
        <Row>
            <BackArrowIcon /><Sep />{children}
        </Row>
    </TitleLinkContainer>
);

export default TitleLink;
