import * as path from 'path';
import * as webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import 'webpack-dev-server';

function isProd() {
	return process.env.NODE_ENV && process.env.NODE_ENV.replace(/\s/g, '') === 'production';
}

const outputDirName = isProd() ? 'prod' : 'dist';

const config: webpack.Configuration = {
	entry: './src/index.ts',
	mode: isProd() ? 'production' : 'development',
	devtool: isProd() ? undefined : 'inline-source-map',
	output: {
		filename: 'js/main.js',
		path: path.resolve(__dirname, outputDirName),
		assetModuleFilename: 'assets/[name].[ext]',
		clean: true,
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: 'ts-loader',
				exclude: /node_modules/,
			},
			{
				test: /\.s[ac]ss$/i,
				use: [
					isProd() ? MiniCssExtractPlugin.loader : 'style-loader',
					'css-loader',
					'sass-loader',
				],
				exclude: '/node_modules/',
			},
		],
	},
	plugins: [
		new HtmlWebpackPlugin({
			title: isProd() ? 'production mode' : 'development mode',
			template: path.resolve(__dirname, './src/template.html'),
			filename: isProd() ? 'calc.html' : 'index.html',
		}),
		new MiniCssExtractPlugin({
			filename: './styles/style.css',
		}),
	],

	devServer: {
		static: {
			directory: path.join(__dirname, outputDirName),
		},
		compress: true,
		port: 9000,
		open: true,
	},
};

export default config;
