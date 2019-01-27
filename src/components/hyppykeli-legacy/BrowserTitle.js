import {pure} from "recompose";

var BrowserTitle = ({title, full}) => {
    if (typeof document === "undefined") {
        return null;
    }

    if (full) {
        document.title = title;
    } else {
        document.title = title + " | Hyppykeli.fi";
    }
    return null;
};

export default pure(BrowserTitle);
