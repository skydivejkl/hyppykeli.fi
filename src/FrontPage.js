import React from "react";
import {Link} from "react-router-dom";
import simple from "react-simple";
import qs from "querystring";

import dropzones from "../dropzones";

import BrowserTitle from "./BrowserTitle";
import Header from "./Header";
import Cloud from "./Cloud";

import {View} from "./core";

const Title = simple(View, {
    fontSize: 45,
    fontWeight: "bold",
    alignItems: "center",
    color: "white",
});

const FrontPageContainer = simple(View, {
    flexWrap: "wrap",
    // margin: "0 auto",
    // justifyContent: "center",
    // maxWidth: 400,
});

const LinkListWrap = simple(View, {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
});

const Sep = simple(View, {
    width: 120,
    height: 120,
});

const DZLinkStyled = simple(View.create(Link), {
    height: 200,
    width: 200,
    textDecoration: "none",
});

const DZLink = ({icaocode, fmisid, lat, lon, children}) => (
    <DZLinkStyled
        to={{
            pathname: "/dz",
            search: qs.stringify({icaocode, fmisid, lat, lon}),
        }}
    >
        <Cloud>{children}</Cloud>
    </DZLinkStyled>
);

const FrontPage = () => (
    <Header>
        <FrontPageContainer>
            <BrowserTitle full title="Hyppykeli.fi" />
            <Title>
                Hyppykeli.fi
            </Title>

            <Sep />

            <LinkListWrap>
                {Object.keys(dropzones).map(key => (
                    <DZLink key={key} {...dropzones[key]}>
                        {dropzones[key].icaocode}
                    </DZLink>
                ))}
            </LinkListWrap>

        </FrontPageContainer>
    </Header>
);

export default FrontPage;
