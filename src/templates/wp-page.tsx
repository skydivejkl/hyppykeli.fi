import React from "react";
import {graphql} from "gatsby";

export default (props: any) => {
    return (
        <div>
            <h1>a wp page</h1>

            <div
                dangerouslySetInnerHTML={{__html: props.data.wp.pageBy.content}}
            />

            <pre>{JSON.stringify(props, null, "    ")}</pre>
        </div>
    );
};

export const query = graphql`
    query GetPageContent($pageId: Int!) {
        wp {
            pageBy(pageId: $pageId) {
                title
                content
            }
        }
    }
`;
