import webpack from "webpack";
import path from "path";
import CopyWebpackPlugin from "copy-webpack-plugin";
import CssMinimizerWebpackPlugin from "css-minimizer-webpack-plugin";
import { WebpackManifestPlugin } from 'webpack-manifest-plugin';
import HtmlWebpackPlugin from "html-webpack-plugin";
import TerserPlugin from "terser-webpack-plugin";


const webpackFrontend = (args: any) => {
	const isProduction = args && args["mode"] === "production";
	console.log('');
	console.log(isProduction ? "PRODUCTION BUILD" : "DEVELOPMENT BUILD");
	console.log('');

	const config = {
		entry: {
			"snippetVault": path.resolve("./src/frontend/app.ts"),
		},
		output: {
			path: path.resolve("./target")
		},
		target: "web",
		devtool: isProduction ? false : "source-map",
		optimization: {
            minimize: isProduction,
            minimizer: isProduction 
                ? [
        			new TerserPlugin({extractComments: false}),
        			new CssMinimizerWebpackPlugin({}),
        		] 
                : [],
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
						context: "./src/frontend/static/",
                        noErrorOnMissing: true
					},
				]
			}),
            new HtmlWebpackPlugin({
                title: "Snippet Vault",
                template: "./public/template.html"
            }),
            // new CopyWebpackPlugin({
            //     patterns: [
            //         {
            //             from: path.resolve("./target/"),
            //             to: path.resolve("../backend/bin/StaticFiles/")
            //         }
            //     ]
            // })
            //new WebpackBundleAnalyzer.BundleAnalyzerPlugin(),
		],
	};

	return config;
};

export default webpackFrontend