const webpack = require('webpack');
const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CssMinimizerWebpackPlugin = require("css-minimizer-webpack-plugin")
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const HtmlWebpackPlugin = require("html-webpack-plugin")


module.exports = (env, args) => {
	const isProduction = args && args["mode"] === "production";
	console.log('');
	console.log(isProduction ? "PRODUCTION BUILD" : "DEVELOPMENT BUILD");
	console.log('');

	const config = {
		entry: {
			"snippetVault": path.resolve("./src/app.ts"),
		},
		output: {
			path: path.resolve("./target")
		},
		target: "web",
		devtool: isProduction ? false : "source-map",
		optimization: {
			splitChunks: {
				// always create vendor.js
				cacheGroups: {
					vendor: {
						test: /[\\/]node_modules[\\/]/,
						name: "vendor",
						chunks: "initial",
						enforce: true,
					},
				},
			},
		},
		resolve: {
			extensions: [".ts", ".js", ".html", ".json"],
		},
		module: {
			rules: [
				{
					test: /\.ts?$/,
					exclude: /node_modules/,
					use: [{
						loader: "ts-loader",
						options: {
							transpileOnly: true,
						},
					}],
				},
                {
                    test: /\.css$/i,
                    use: ["style-loader", "css-loader"],
                },
				// app main .less file
				{
					test: /app\.less$/i,
					use: [
						{
							loader: 'file-loader',
							options: {
								name: 'styles/[name].css',
							}

						},
						{
							loader: 'less-loader',
						}
					]
				},
			],
		},

		watchOptions: {
			aggregateTimeout: 100,
			ignored: /node_modules/,
			poll: 300
		},

		devServer: {
			headers: {
				'Access-Control-Allow-Origin': '*'
			},
			contentBase: './target',
			publicPath: '/',
			compress: false,
			port: 47001,
			historyApiFallback: true,
			hot: true,
			inline: true,
			stats: 'normal',
			clientLogLevel: 'error'
		},

		plugins: [
			new webpack.EnvironmentPlugin({
				NODE_ENV: isProduction ? "production" : "development",
				DEBUG: !isProduction
			}),
            new WebpackManifestPlugin({
                fileName: "manifest.json",
            }),
			new CopyWebpackPlugin({
				patterns: [
					// static files to the site root folder (index and robots)
					{
						from: "**/*",
						to: path.resolve("./target/"),
						context: "./src/static/",
                        noErrorOnMissing: true
					},
				]
			}),
            new HtmlWebpackPlugin({
                title: "Snippet Vault",
                template: "./public/template.html"
            }),
		],
	};

	if (isProduction) {
		config.optimization.minimize = true;
		config.optimization.minimizer = [
			new TerserPlugin({extractComments: false}),
			new CssMinimizerWebpackPlugin({}),
		]
	}

	return config;
};