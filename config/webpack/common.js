const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ComponentDirectoryPlugin = require('component-directory-webpack-plugin');
const FaviconWebpackPlugin = require('favicons-webpack-plugin');

const paths = require('../paths');
const { PRODUCTION } = require('../const');

const rules = require('./modules/rules');
const plugins = require('./modules/plugins');

module.exports = {
  entry: [`${paths.src}/index.tsx`],
  output: {
    path: paths.build,
    publicPath: '/',
    filename: 'js/[name].js?v=[hash:5]',
  },
  resolve: {
    alias: {
      assets: paths.assets,
      theme: `${paths.src}/UI/theme.styl`,
      'react-dom': '@hot-loader/react-dom',
    },
    modules: [paths.src, 'node_modules'],
    plugins: [new ComponentDirectoryPlugin()],
    extensions: ['.js', '.ts', '.tsx', '.json', '.scss'],
  },
  module: {
    rules: rules,
  },
  plugins: plugins,
};
