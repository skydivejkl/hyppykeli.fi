import React from "react";
import {Link, graphql as gql} from "gatsby";

import Layout from "../components/layout";
import {FuckQuery} from "../graphql-generated";

const SecondPage = (props: {data: FuckQuery}) => (
    <Layout>
        <h1>Hi from the second page</h1>
        <p>Welcome to page 2</p>
        <div>lol: {props.data.site!.siteMetadata!.loljee}</div>
        <pre>{JSON.stringify(props.data, null, "    ")}</pre>
        <Link to="/">Go back to the homepage</Link>
    </Layout>
);

export const Fuck = gql`
    query Fuck {
        site {
            siteMetadata {
                loljee: title
            }
        }
        ding {
            pages {
                edges {
                    node {
                        title
                    }
                }
            }
        }
    }
`;

export default SecondPage;
