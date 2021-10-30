import webpack, { Configuration } from "webpack";
import path from "path";
import Copy from "copy-webpack-plugin";
import { WebpackManifestPlugin as Manifest } from 'webpack-manifest-plugin';


const webpackBackend = (args: any): Configuration => {
	const isProduction = args && args["mode"] === "production";
	console.log('');
	console.log(isProduction ? "PRODUCTION BUILD" : "DEVELOPMENT BUILD");
	console.log('');
    if (isProduction === true) {
        require('dotenv').config({ path: `.env.production` })
    }
    

	const config: Configuration = {
		entry: {
			"snippetVaultBackend": path.resolve("./src/backend/App.ts"),
		},
		output: {
			path: path.resolve("./target/backend")
		},
		target: "node",
        node: {
            __dirname: false,
            __filename: false,
        },
		devtool: isProduction ? false : "source-map",
		optimization: {
            minimize: isProduction,			
		},
		resolve: {
			extensions: [".ts", ".js", ".json"],
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
			static: {directory: "./target/staticFiles", publicPath: "/", },
			compress: false,
			port: 47000,
			historyApiFallback: true,
			hot: true,
            magicHtml: false,
		},

		plugins: [
			new webpack.EnvironmentPlugin({
				NODE_ENV: isProduction ? "production" : "development",
				//DEBUG: ""
			}),            
			new Copy({
				patterns: [
					// static files to the site root folder (index and robots)
					{
						from: "**/*",
						to: path.resolve("./target/"),
						context: "./src/backend/static/",
                        noErrorOnMissing: true
					},
				]
			}),
	    ],
	};

	return config;
};

export default webpackBackend