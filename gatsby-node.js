const path = require("path");

exports.onCreateNode = ({node}) => {
    // console.log("wat", node.internal.type);
};

exports.createPages = async function({graphql, actions}) {
    console.log("CREATE");
    const {createPage} = actions;
    const res = await graphql(`
        {
            site {
                siteMetadata {
                    dropzones {
                        icaocode
                    }
                }
            }
        }
    `);

    for (const dz of res.data.site.siteMetadata.dropzones) {
        createPage({
            path: "/dz/" + dz.icaocode,
            component: path.resolve(`./src/templates/wp-page.tsx`),
            context: {icaocode: dz.icaocode},
        });
    }
};
