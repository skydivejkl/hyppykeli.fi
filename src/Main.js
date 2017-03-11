import React from "react";
import simple, {css} from "react-simple";
import {Route, Switch, Redirect} from "react-router-dom";

import {View} from "./core";
import Dz from "./Dz";
import FrontPage from "./FrontPage";

css.global("a", {
    WebkitTapHighlightColor: "rgba(255, 255, 255, 0)",
});

const Container = simple(View, {
    backgroundColor: "skyblue",
    alignItems: "center",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
});

const Wrap = simple(View, {
    flex: 1,
    width: "100%",
});

const NotFound = () => (
    <View>
        Tuntematon näkymä
    </View>
);

const Main = () => (
    <Container>
        <Wrap>
            <Switch>
                <Route exact path="/" component={FrontPage} />
                <Route
                    exact
                    path="/previous"
                    render={() => {
                        ga(
                            "send",
                            "event",
                            "HomeScreen",
                            "start-from-home-screen-app"
                        );
                        if (window.localStorage.previous) {
                            return (
                                <Redirect to={window.localStorage.previous} />
                            );
                        } else {
                            return <Redirect to="/" />;
                        }
                    }}
                />
                <Route path="/dz/:dz?" component={Dz} />
                <Route component={NotFound} />
            </Switch>
        </Wrap>
    </Container>
);

export default Main;
