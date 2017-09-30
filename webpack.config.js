var webpack = require("webpack");
var {execSync} = require("child_process");
var BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
    .BundleAnalyzerPlugin;
const WorkboxBuildWebpackPlugin = require("workbox-webpack-plugin");

var gitRev = execSync("git rev-parse HEAD")
    .toString()
    .trim();
var gitMessageShort = execSync("git log -1 --pretty=%s")
    .toString()
    .trim();
var gitMessageFull = execSync("git log -1 --pretty=%B")
    .toString()
    .trim();
var gitDate = execSync("git log -1 --format=%cd ")
    .toString()
    .trim();

var config = {
    entry: {
        polyfill: "./src/polyfill.js",
        bundle: "./src/index.js",
    },
    output: {
        path: __dirname + "/static/dist",
        filename: "[name].js",
        publicPath: "/dist",
    },
    devtool: "source-map",
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: "babel-loader",
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"],
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
        // Drop unused locales from moment
        new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /fi/),
        new BundleAnalyzerPlugin({
            analyzerMode: "static",
        }),
        new WorkboxBuildWebpackPlugin({
            globDirectory: "static/",
            globPatterns: ["**/*.{js,css,html,json,ico,svg,png}"],
            swDest: "static/service-worker.js",
            swSrc: "src/service-worker.js",
            globIgnores: ["*/report.html"],
        }),
    ],
};

module.exports = config;
