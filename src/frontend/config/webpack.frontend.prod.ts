const path = require("path");
const merge = require("webpack-merge");
const common = require("./webpack.backend.common.ts");
const nodeExternals = require("webpack-node-externals");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const webpack = require("webpack");
import WebpackBundleAnalyzer from "webpack-bundle-analyzer";
import HtmlWebpackPlugin from "html-webpack-plugin";


module.exports = merge(common, {
    mode: 'production',
    output: {
        filename: '[name].[hash].js'
    },
    devtool: "source-map",
    plugins: [
        new webpack.HashedModuleIdsPlugin(),
        new HtmlWebpackPlugin({
            filename: 'index-prod.html',
            template: 'src/common/html/index-prod.html'
        }),
        new MiniCssExtractPlugin({
            filename: 'style.[contenthash].css',
        })
    ],
    optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      chunks: 'all',
      maxInitialRequests: Infinity,
      minSize: 0,
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name(module) {
            // get the name. E.g. node_modules/packageName/not/this/part.js
            // or node_modules/packageName
            const nodeModule = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/);

            let packageName;
            if (nodeModule) {
              packageName = nodeModule[1];
            } else {
              // This is a bug, check where this comes from later.
              packageName = 'somefilename';
            }

            // npm package names are URL-safe, but some servers don't like @ symbols
            return `npm.${packageName.replace('@', '')}`;
          },
        },
      },
    },
    }
});