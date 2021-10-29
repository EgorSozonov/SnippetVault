
import path from "path";
import merge from "webpack-merge";
import common from "./webpack.frontend.common";
import webpack from "webpack";
import StartServerPlugin from "start-server-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";

module.exports = merge(common, {
    mode: 'development',
    output: {
        filename: 'bundle.js'
    },
    devtool: false,
    plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index-dev.html',
      template: './src/common/html/index-dev.html'
    }),
    new MiniCssExtractPlugin({
      filename: 'style-dev.css',
    })
    ]
});