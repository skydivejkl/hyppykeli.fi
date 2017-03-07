import React from "react";
import simple, {css} from "react-simple";
import {Route, Switch} from "react-router-dom";

import {View} from "./core";
import Dz from "./Dz";
import FrontPage from "./FrontPage";

css.global("body, html", {
    padding: 0,
    margin: 0,
    overflowX: "hidden",
});

const Container = simple(View, {
    alignItems: "center",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
});

const Wrap = simple(View, {
    backgroundColor: "white",
    flex: 1,
    width: "100%",
});

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
