import "react-spinner/react-spinner.css";
import simple, {css} from "react-simple";
import cn from "classnames";
import ReactSpinner from "react-spinner";
import {mapProps} from "recompose";

css.global(".color-white .react-spinner_bar", {
    backgroundColor: "white !important",
});

css.global(".color-black .react-spinner_bar", {
    backgroundColor: "black !important",
});

var Spinner = simple(ReactSpinner, {
    width: "100% !important",
    height: "100% !important",
});
Spinner = mapProps(({color, className, ...props}) => {
    return {
        ...props,
        className: cn(className, "color-" + color),
    };
})(Spinner);

export default Spinner;
