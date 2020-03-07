import React from "react";

import Dz from "../../components/hyppykeli-legacy/Dz";
import { Layout } from "../../components/Layout";

import { Provider } from "react-redux";
import { createStore } from "redux";
const { leanReducer } = require("lean-redux");

declare const __REDUX_DEVTOOLS_EXTENSION__: any;

const store = createStore(
    leanReducer,
    {},
    typeof __REDUX_DEVTOOLS_EXTENSION__ !== "undefined"
        ? __REDUX_DEVTOOLS_EXTENSION__()
        : s => s,
);

function DzPage() {
    return (
        <Provider store={store}>
            <Layout>
                <Dz />
            </Layout>
        </Provider>
    );
}

DzPage.getInitialProps = async () => {
    return { disableStatic: true };
};

export default DzPage;
