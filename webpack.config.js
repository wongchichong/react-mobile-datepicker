/* eslint-disable */
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const EXAMPLES_DIR = path.resolve(__dirname, 'examples');

module.exports = {
  mode: 'development',
  devtool: 'eval-cheap-source-map',
  entry: path.resolve(EXAMPLES_DIR, 'src', 'index.tsx'),
  output: {
    path: path.resolve(EXAMPLES_DIR, 'build'),
    publicPath: '/',
  },
  devServer: {
    historyApiFallback: true,
    hot: true,
    host: '0.0.0.0',
  },
  resolve: {
    extensions: ['.json', '.js', '.jsx', '.ts', '.tsx', '.css'],
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
        ],
      },
      {
        test: /\.tsx?$/,
        loader: 'babel-loader',
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
        filename: '[name].css',
    }),
    new HtmlWebpackPlugin({
      title: 'lib-temlate',
      template: path.resolve(EXAMPLES_DIR, 'public', 'index.html'), // Load a custom template
      inject: 'body', // Inject all scripts into the body
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"development"',
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],
};
