import React from "react";
import {Link, graphql} from "gatsby";

import Layout from "../components/layout";

const SecondPage = (props: any) => (
    <Layout>
        <h1>Hi from the second page</h1>
        <p>Welcome to page 2</p>
        <pre>{JSON.stringify(props.data, null, "    ")}</pre>
        <Link to="/">Go back to the homepage</Link>
    </Layout>
);

export const query = graphql`
    query {
        site {
            siteMetadata {
                title
            }
        }
    }
`;

export default SecondPage;
