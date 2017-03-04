var webpack = require("webpack");
var path = require("path");
var {execSync} = require("child_process");

var gitRev = execSync("git rev-parse HEAD").toString().trim();
var gitMessageShort = execSync("git log -1 --pretty=%s").toString().trim();
var gitMessageFull = execSync("git log -1 --pretty=%B").toString().trim();
var gitDate = execSync("git log -1 --format=%cd ").toString().trim();

var config = {
    entry: "./src/index.js",
    output: {
        path: __dirname + "/static/dist",
        filename: "bundle.js",
        publicPath: "/dist",
    },
    devtool: "sourceMap",
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: "babel-loader",
            },
        ],
    },
    plugins: [
        new webpack.DefinePlugin({
            "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
            GIT_COMMIT_REV: JSON.stringify(gitRev),
            GIT_COMMIT_MESSAGE: JSON.stringify(gitMessageShort),
            GIT_COMMIT_MESSAGE_FULL: JSON.stringify(gitMessageFull),
            GIT_COMMIT_DATE: JSON.stringify(gitDate),
        }),
    ],
};

module.exports = config;
