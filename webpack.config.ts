import * as path from 'path';
import * as webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import 'webpack-dev-server';

const isProd = process.env.NODE_ENV && process.env.NODE_ENV.replace(/\s/g, '') === 'production';
const outputDirName = isProd ? 'prod' : 'dist';

const config: webpack.Configuration = {
	entry: './src/index.ts',
	mode: isProd ? 'production' : 'development',
	devtool: isProd ? undefined : 'inline-source-map',
	output: {
		filename: isProd ? 'calc/js/main.js' : 'js/main.js',
		path: path.resolve(__dirname, outputDirName),
		assetModuleFilename: isProd ? 'calc/assets/[name].[ext]' : 'assets/[name].[ext]',
		clean: true,
	},
	module: {
		rules: [
			{
				test: /favicon\.ico$/,
				loader: '[name].[ext]',
			},
			{
				test: /\.tsx?$/,
				use: 'ts-loader',
				exclude: /node_modules/,
			},
			{
				test: /\.s[ac]ss$/i,
				use: [
					isProd ? MiniCssExtractPlugin.loader : 'style-loader',
					'css-loader',
					'sass-loader',
				],
				exclude: '/node_modules/',
			},
		],
	},
	plugins: [
		new HtmlWebpackPlugin({
			title: isProd ? 'Calculator' : 'development mode',
			template: path.resolve(__dirname, './src/template.html'),
			filename: isProd ? 'calc.html' : 'index.html',
		}),
		new MiniCssExtractPlugin({
			filename: isProd ? './calc/styles/style.css' : './styles/style.css',
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
