/* eslint-disable */
var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

var EXAMPLES_DIR = path.resolve(__dirname, 'examples');

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
        test: /\.tsx?$/,
        loader: 'babel-loader',
      },
      {
        test: /\.css$/,
        use: [
          {loader: 'style-loader'},
          {loader: 'css-loader'},
          {
          loader: 'postcss-loader',
          options: {config: {path: path.join(__dirname, 'postcss.config.js')}},
          },
        ],
      },
    ],
  },
  plugins: [
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
