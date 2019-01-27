import {graphql as gql} from "gatsby";
import React from "react";

import Dz from "../components/hyppykeli-legacy/Dz";
import {GatsbyPage} from "../declarations";
import {DropzonesQuery} from "../graphql-generated";

function getDzData(dzQuery: DropzonesQuery, icaocode: string) {
    return (
        dzQuery.site!.siteMetadata!.dropzones!.find(
            dz => dz.icaocode === icaocode,
        ) || null
    );
}

export default (props: GatsbyPage<DropzonesQuery, {icaocode: string}>) => {
    return (
        <div>
            <Dz />

            <h1>{props.pageContext.icaocode}</h1>

            <pre>
                {JSON.stringify(
                    getDzData(props.data, props.pageContext.icaocode),
                    null,
                    "    ",
                )}
            </pre>
            {/* <pre>{JSON.stringify(props, null, "    ")}</pre> */}
        </div>
    );
};

export const query = gql`
    query Dropzones {
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
