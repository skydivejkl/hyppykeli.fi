import "react-spinner/react-spinner.css";

import React from "react";

export default function MyApp(props: { Component: any; pageProps: any }) {
    return <props.Component {...props.pageProps} />;
}
