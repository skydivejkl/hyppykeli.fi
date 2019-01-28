import {css, Global} from "@emotion/core";
import styled from "@emotion/styled";
import React from "react";

import {View} from "./core";

const Container = styled(View)({
    backgroundColor: "skyblue",
});

const globals = css`
    body,
    html {
        padding: 0;
        margin: 0;
    }
`;

export function Layout(props: {children: React.ReactNode}) {
    return (
        <Container>
            <Global styles={globals} />
            {props.children}
        </Container>
    );
}
