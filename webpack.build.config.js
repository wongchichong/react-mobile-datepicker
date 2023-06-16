const path = require('path')
const webpack = require('webpack')
const TerserPlugin = require('terser-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const LIB_DIR = path.resolve(__dirname, 'lib')
const BUILD_DIR = path.resolve(__dirname, 'dist')

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
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
        ],
      },
      {
        test: /\.tsx?$/,
        use: [
          'babel-loader',
          'ts-loader',
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
    new MiniCssExtractPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"production"',
    }),
  ],
  optimization: {
    minimize: false,
    minimizer: [
      new TerserPlugin({
        minify: TerserPlugin.uglifyJsMinify,
        parallel: true,
      }),
    ],
  }
}
