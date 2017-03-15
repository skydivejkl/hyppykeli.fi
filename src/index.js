import "babel-polyfill";
console.log("git date", GIT_COMMIT_DATE);
console.log("git message", GIT_COMMIT_MESSAGE);
console.log("git rev", GIT_COMMIT_REV);

if (window.trackjs && typeof window.trackJs.addMetadata === "function") {
    window.trackJs.addMetadata("gitrev", GIT_COMMIT_REV);
    window.trackJs.addMetadata("gitmessage", GIT_COMMIT_MESSAGE);
}

import initReactFastclick from "react-fastclick";
initReactFastclick();

import React from "react";
import ReactDOM from "react-dom";
import {BrowserRouter} from "react-router-dom";
import {Provider} from "react-redux";
import {leanReducer} from "lean-redux";
import {createStore} from "redux";
import moment from "moment";
import "moment/locale/fi";
moment.locale("fi");

import Main from "./Main";
import ScrollToTop from "./ScrollToTop";

const store = createStore(
    leanReducer,
    {},
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

const Root = () => (
    <BrowserRouter>
        <Provider store={store}>
            <ScrollToTop>
                <Main />
            </ScrollToTop>
        </Provider>
    </BrowserRouter>
);

const container = document.getElementById("app-container");

ReactDOM.render(<Root />, container);

if ("serviceWorker" in navigator) {
    window.addEventListener("load", function() {
        navigator.serviceWorker
            .register("/sw.js")
            .then(function(registration) {
                console.log(
                    "ServiceWorker registration successful with scope: ",
                    registration.scope
                );
            })
            .catch(function(err) {
                console.log("ServiceWorker registration failed: ", err);
            });
    });
}

window.addEventListener("beforeinstallprompt", function(e) {
    ga("send", "event", "AddToHomeScreen", "install-started");
    e.userChoice.then(function(choiceResult) {
        if (choiceResult.outcome == "dismissed") {
            console.log("User cancelled home screen install");
            ga("send", "event", "AddToHomeScreen", "install-cancelled");
        } else {
            console.log("User added to home screen");
            ga("send", "event", "AddToHomeScreen", "install-completed");
        }
    });
});
