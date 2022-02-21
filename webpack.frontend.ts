import webpack, { Configuration } from "webpack";
import path from "path";
import Copy from "copy-webpack-plugin";
import CssMinimizer from "css-minimizer-webpack-plugin";
import { WebpackManifestPlugin as Manifest } from 'webpack-manifest-plugin';
import Html from "html-webpack-plugin";
import Terser from "terser-webpack-plugin";


const webpackFrontend = (args: any): Configuration => {
	const mode = (args && args["mode"] === "production") ? "production" : "development";

	console.log('');
	console.log(mode.toUpperCase() + " BUILD");
	console.log('');

	const config: Configuration = {
		entry: {
			"snippetVault": path.resolve("./src/frontend/core/App.ts"),
		},
		output: {
			path: path.resolve("./target/frontend/sv"),
            publicPath: "/sv",
		},
		target: "web",
		devtool: mode ? false : "source-map",
		optimization: {
            minimize: mode === "production",
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
                {
                    test: /\.(woff(2)?|eot|ttf|otf|svg|)$/,
                    type: 'asset/inline',
                },
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
            static: "target/frontend",
			compress: false,
			port: 10200,
			historyApiFallback:  {
                index: '/sv'
            },
			hot: true,
            magicHtml: true,
		},

		plugins: [
			new webpack.EnvironmentPlugin({
				NODE_ENV: mode,
				DEBUG: mode === "development",
			}),
            new Manifest({
                fileName: "manifest.json",
            }),
			new Copy({
				patterns: [
					// static files to the site root folder (index and robots)
					{
						from: "**/*",
						to: path.resolve("./target/"),
						context: "./src/frontend/resources/",
                        noErrorOnMissing: true
					},
				]
			}),
            new Html({
                title: "Snippet Vault",
                template: "./src/frontend/resources/template.html"
            }),
            // new CopyWebpackPlugin({
            //     patterns: [
            //         {
            //             from: path.resolve("./target/"),
            //             to: path.resolve("../backend/bin/StaticFiles/")
            //         }
            //     ]
            // })
	    ],
	};

	return config;
};

export default webpackFrontend
