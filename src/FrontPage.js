import React from "react";
import {Link} from "react-router-dom";
import simple from "react-simple";
import qs from "querystring";

import dropzones from "../dropzones";

import Parachute from "./Parachute";
import BrowserTitle from "./BrowserTitle";
import Cloud from "./Cloud";

import {View} from "./core";

const ParachuteContainer = simple(View, {
    position: "fixed",
    height: 250,
    width: 250,
});

const LinkText = simple(View, {
    textAlign: "center",
    color: "skyblue",
    fontSize: 40,
});

const Title = simple(View, {
    fontSize: 45,
    fontWeight: "bold",
    alignItems: "center",
    color: "white",
});

const FrontPageBackground = simple(View, {
    backgroundColor: "skyblue",
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
});

const Container = simple(
    View,
    {
        // alignItems: "center",
        // position: "absolute",
        // top: 0,
        // left: 0,
        // right: 0,
        // bottom: 0,
    }
);

const Center = simple(View, {
    alignItems: "center",
    flexWrap: "wrap",
    margin: "0 auto",
    maxWidth: 600,
});

const LinkListWrap = simple(View, {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
});

const Sep = simple(View, {
    width: 60,
    height: 60,
});

const DZLinkStyled = simple(View.create(Link), {
    height: 200,
    width: 200,
    marginLeft: 10,
    marginRight: 10,
    textDecoration: "none",
});

const DZLink = ({icaocode, fmisid, lat, lon, children}) => (
    <DZLinkStyled
        to={{
            pathname: "/dz",
            search: qs.stringify({icaocode, fmisid, lat, lon}),
        }}
    >
        <Cloud><LinkText>{children}</LinkText></Cloud>
    </DZLinkStyled>
);

const FrontPage = () => (
    <Container>
        <FrontPageBackground />
        <Center>
            <BrowserTitle full title="Hyppykeli.fi" />
            <ParachuteContainer>
                <Parachute />
            </ParachuteContainer>

            <Sep />
            <Sep />

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

        </Center>
    </Container>
);

export default FrontPage;
