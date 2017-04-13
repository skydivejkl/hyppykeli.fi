import React from "react";
import {renderStaticOptimized} from "glamor/server";
import ReactDOMServer from "react-dom/server";
import {MemoryRouter} from "react-router-dom";
import {Provider} from "react-redux";
import {leanReducer} from "lean-redux";
import {createStore} from "redux";
import moment from "moment";
import "moment/locale/fi";
moment.locale("fi");

import Main from "../src/Main";

const store = createStore(leanReducer, {});

const Root = () => (
    <MemoryRouter>
        <Provider store={store}>
            <Main />
        </Provider>
    </MemoryRouter>
);

const {html, css} = renderStaticOptimized(() =>
    ReactDOMServer.renderToString(<Root />)
);

const fs = require("fs");

fs.writeFileSync("static/dist/prerender.html", html);
fs.writeFileSync("static/dist/prerender.css", css);
