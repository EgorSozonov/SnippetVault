const path = require("path");
const merge = require("webpack-merge");
const common = require("./webpack.backend.common.ts");
const nodeExternals = require("webpack-node-externals");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const webpack = require("webpack");


module.exports = merge(common, {
    mode: "production",
    externals: nodeExternals(),
    entry: "./src/server/index",
    output: {
        filename: "server.[hash].js",
    }
});