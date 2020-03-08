import "react-spinner/react-spinner.css";
import "../styles.css";

import React from "react";

console.log("next.js version");

export default function MyApp(props: { Component: any; pageProps: any }) {
    return <props.Component {...props.pageProps} />;
}
