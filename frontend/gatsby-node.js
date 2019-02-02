const path = require("path");

const dropzones = require("./dropzones.json");

exports.createPages = async function({actions}) {
    const {createPage} = actions;

    for (const dz of Object.values(dropzones)) {
        createPage({
            path: "/dz/" + dz.icaocode,
            component: path.resolve(`./src/templates/dz-page.tsx`),
            context: {icaocode: dz.icaocode},
        });
    }
};

exports.onCreateWebpackConfig = function(gatsby) {
    gatsby.actions.setWebpackConfig({
        resolve: {
            alias: {
                "react-simple": __dirname + "/src/simple.js",
            },
        },
    });
};
