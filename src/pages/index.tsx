import styled from "@emotion/styled";
import {Location} from "@reach/router";
import {graphql as gql, Link} from "gatsby";
import React from "react";

import {View} from "../components/core";
import FrontPage from "../components/hyppykeli-legacy/FrontPage";
import Image from "../components/image";
import {GatsbyPage} from "../declarations";
import {DropzonesListQuery, DropzonesQuery} from "../graphql-generated";

const Container = styled(View)({
    backgroundColor: "skyblue",
    alignItems: "center",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
});

const Wrap = styled(View)({
    flex: 1,
    width: "100%",
});

export default (props: GatsbyPage<DropzonesListQuery, {icaocode: string}>) => (
    <Container>
        <Wrap>
            <FrontPage />
        </Wrap>
    </Container>
);

export const query = gql`
    query DropzonesList {
        site {
            siteMetadata {
                dropzones {
                    icaocode
                    lat
                    lon
                    fmisid
                }
            }
        }
    }
`;
