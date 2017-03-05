import React from "react";
import simple, {css} from "react-simple";
import {Route, Switch, Link} from "react-router-dom";
import qs from "querystring";

import {View} from "./core";

import Dz from "./Dz";

css.global("body, html", {
    padding: 0,
    margin: 0,
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

const Title = simple(View.create(Link), {
    position: "absolute",
    left: 1,
    top: 1,
    fontSize: 20,
    textDecoration: "none",
    color: "black",
});

const DZLink = ({icaocode, fmisid, lat, lon, children}) => (
    <Link
        to={{
            pathname: "/dz",
            search: qs.stringify({icaocode, fmisid, lat, lon}),
        }}
    >
        {children}
    </Link>
);

const FrontPage = () => (
    <View>
        Etusivu
        <DZLink icaocode="EFJY" fmisid="101339" lat="62.407390" lon="62.407390">
            EFJY
        </DZLink>

        <DZLink icaocode="EFUT" fmisid="101191" lat="60.898498" lon="26.924409">
            EFUT
        </DZLink>

        <DZLink icaocode="EFKU" fmisid="101570" lat="63.012165" lon="27.790366">
            EFKU
        </DZLink>
    </View>
);

const Main = () => (
    <Container>
        <Wrap>
            <Switch>
                <Route exact path="/" component={FrontPage} />
                <Route path="/dz" component={Dz} />
            </Switch>
            <Title to="/">Hyppykeli.fi</Title>
        </Wrap>
    </Container>
);

export default Main;
