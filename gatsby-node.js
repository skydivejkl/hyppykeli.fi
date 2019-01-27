const path = require("path");

exports.onCreateNode = ({node}) => {
    // console.log("wat", node.internal.type);
};

exports.createPages = async function({graphql, actions}) {
    console.log("CREATE");
    const {createPage} = actions;
    const res = await graphql(`
        {
            wp {
                pages {
                    edges {
                        node {
                            pageId
                            slug
                        }
                    }
                }
            }
        }
    `);

    for (const edge of res.data.wp.pages.edges) {
        createPage({
            path: edge.node.slug,
            component: path.resolve(`./src/templates/wp-page.tsx`),
            context: {pageId: edge.node.pageId},
        });
    }
};
