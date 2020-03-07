import "react-spinner/react-spinner.css";

import React from "react";
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

export default function MyApp(props: { Component: any; pageProps: any }) {
    return (
        <Provider store={store}>
            <props.Component {...props.pageProps} />
        </Provider>
    );
}
