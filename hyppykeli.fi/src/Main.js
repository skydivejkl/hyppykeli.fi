import React from "react";
import simple, {css} from "react-simple";
import {Route, Switch, Link} from "react-router-dom";
import qs from "querystring";

import {View} from "./core";
import Dz from "./Dz";

import dropzones from "../dropzones";

css.global("body, html", {
    padding: 0,
    margin: 0,
    overflowX: "hidden",
});

const Container = simple(View, {
    alignItems: "center",
});

const Wrap = simple(View, {
    backgroundColor: "white",
    flex: 1,
    width: "100%",
    // overflowX: "auto",
    // "@media (min-width: 450px)": {
    //     width: 450,
    // },
});

const DZLinkStyled = simple(View.create(Link), {
    textDecoration: "none",
    color: "white",
    marginBottom: 10,
    fontSize: 40,
    textAlign: "center",
    backgroundColor: "skyblue",
    padding: 10,
});

const DZLink = ({icaocode, fmisid, lat, lon, children}) => (
    <DZLinkStyled
        to={{
            pathname: "/dz",
            search: qs.stringify({icaocode, fmisid, lat, lon}),
        }}
    >
        {children}
    </DZLinkStyled>
);

const Title = simple(View, {
    fontSize: 50,
    marginBottom: 50,
});

const FrontPageContainer = simple(View, {
    margin: "0 auto",
    justifyContent: "center",
    maxWidth: 400,
});

const FrontPage = () => (
    <FrontPageContainer>
        <Title>
            Hyppykeli.fi
        </Title>
        {Object.keys(dropzones).map(key => (
            <DZLink key={key} {...dropzones[key]}>
                {dropzones[key].icaocode}
            </DZLink>
        ))}

    </FrontPageContainer>
);

const Main = () => (
    <Container>
        <Wrap>
            <Switch>
                <Route exact path="/" component={FrontPage} />
                <Route path="/dz" component={Dz} />
            </Switch>
        </Wrap>
    </Container>
);

export default Main;
