import React from "react";
import Head from "next/head";

var BrowserTitle = props => {
    return (
        <Head>
            <title>
                {props.full ? props.title : props.title + " | Hyppykeli.fi"}
            </title>
        </Head>
    );
};

export default React.memo(BrowserTitle);
