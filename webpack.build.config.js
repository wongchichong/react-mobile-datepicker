/* eslint-disable */
var path = require('path');
var webpack = require('webpack');

var LIB_DIR = path.resolve(__dirname, 'lib');
var BUILD_DIR = path.resolve(__dirname, 'dist');

module.exports = {
  mode: 'production',
  entry: path.resolve(LIB_DIR, 'index.tsx'),
  output: {
    library: 'reactMobileDatePickerTs',
    libraryTarget: 'umd',
    globalObject: 'this',
    filename: 'index.js',
    path: BUILD_DIR,
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
  externals: {
      react: {
        root: 'React',
        commonjs2: 'react',
        commonjs: 'react',
        amd: 'react',
        umd: 'react',
      },
      'react-dom': {
        root: 'ReactDOM',
        commonjs2: 'react-dom',
        commonjs: 'react-dom',
        amd: 'react-dom',
        umd: 'react-dom',
      },
    },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"production"',
    }),
  ],
};
