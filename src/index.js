console.log("git date", GIT_COMMIT_DATE);
console.log("git message", GIT_COMMIT_MESSAGE);
console.log("git rev", GIT_COMMIT_REV);

import initReactFastclick from "react-fastclick";
initReactFastclick();

import React from "react";
import ReactDOM from "react-dom";
import {BrowserRouter} from "react-router-dom";
import {Provider} from "react-redux";
import {leanReducer} from "lean-redux";
import {createStore} from "redux";

import Main from "./Main";

const store = createStore(
    leanReducer,
    {},
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

const Root = () => (
    <BrowserRouter>
        <Provider store={store}>
            <Main />
        </Provider>
    </BrowserRouter>
);

const container = document.getElementById("app-container");

ReactDOM.render(<Root />, container);
