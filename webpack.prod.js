const path = require('path');
// eslint-disable-next-line import/no-extraneous-dependencies
const HtmlWebPackPlugin = require('html-webpack-plugin');
// eslint-disable-next-line import/no-extraneous-dependencies
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// eslint-disable-next-line import/no-extraneous-dependencies
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
	devServer: {
		port: '9000',
	},
	devtool: 'source-map',
	mode: 'production',
	entry: {
		index: './src/index.js',
		preload: './src/preload.ts',
	},
	output: {
		path: path.resolve(__dirname, 'dist'),
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
				},
			},
			{
				test: /\.html$/,
				use: [
					{
						loader: 'html-loader',
					},
				],
			},
			{
				test: /\.css$/,
				use: [
					MiniCssExtractPlugin.loader, 'css-loader',
				],
			},
			{
				test: /\.tsx?$/,
				exclude: /node_modules/,
				use: {
					loader: 'ts-loader',
				},
			},
			{
				test: /\.(png|jpg|gif)$/i,
				type: 'asset/resource',
			},
		],
	},
	plugins: [
		new HtmlWebPackPlugin({
			template: './src/index.html',
			filename: './index.html',
			excludeChunks: ['preload'],
		}),
		new MiniCssExtractPlugin({
			filename: '[name].css',
			chunkFilename: '[id].css',
		}),
		new CopyWebpackPlugin({
			patterns: [
				{ from: './package.json', to: './' },
			],
		}),
	],
	resolve: {
		extensions: ['.ts', '.js', '.json'],
	},
	target: 'electron-main',
};
