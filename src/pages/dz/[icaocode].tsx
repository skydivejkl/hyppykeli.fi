import React from "react";

import Dz from "../../components/hyppykeli-legacy/Dz";
import { Layout } from "../../components/Layout";

import { Provider } from "react-redux";
import { createStore } from "redux";
import { Dropzones } from "../../DropzoneData";
import { SavePWAStart } from "../../components/SavePWAStart";
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
                <SavePWAStart></SavePWAStart>
                <Dz />
            </Layout>
        </Provider>
    );
}

export async function getStaticPaths() {
    return {
        fallback: false,
        paths: Object.keys(Dropzones).map(icaocode => ({
            params: {
                icaocode,
            },
        })),
    };
}

export async function getStaticProps() {
    return {
        props: {},
    };
}

export default DzPage;
