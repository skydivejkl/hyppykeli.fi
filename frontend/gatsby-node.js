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
