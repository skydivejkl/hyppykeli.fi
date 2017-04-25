var {execSync} = require("child_process");

const gitRev = execSync("git rev-parse HEAD").toString().trim();

exports.gitRev = gitRev;
exports.bundlePath = "/dist/bundle.js?v=" + gitRev;
