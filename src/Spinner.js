import "react-spinner/react-spinner.css";
import React from "react";
import simple, {css} from "react-simple";
import ReactSpinner from "react-spinner";

import {View} from "./core";

css.global(".react-spinner_bar", {
    backgroundColor: "gray !important",
});

const Spinner = simple(ReactSpinner, {
    width: "100% !important",
    height: "100% !important",
});

export default Spinner;
