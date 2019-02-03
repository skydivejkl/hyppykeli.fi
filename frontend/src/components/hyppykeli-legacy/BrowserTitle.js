import React from "react";
import {Helmet} from "react-helmet";

var BrowserTitle = props => {
    return (
        <Helmet>
            <title>
                {props.full ? props.title : props.title + " | Hyppykeli.fi"}
            </title>
        </Helmet>
    );
};

export default React.memo(BrowserTitle);
