const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const FaviconWebpackPlugin = require('favicons-webpack-plugin');

const paths = require('../../paths');
const { PRODUCTION, WEBPACK_DEV_MODE, ENV_CONFIG } = require('../../const');
const versions = require('./versions');

const CopyPlugin = require('./copy');

const plugins = [
  CopyPlugin([]),
  new webpack.ProvidePlugin({
    React: 'react',
    ReactDOM: 'react-dom',
  }),
  new webpack.DefinePlugin({
    'process.env.PRODUCTION': JSON.stringify(PRODUCTION),
    'process.env.VERSIONS': JSON.stringify(versions),
    'process.env.ENV_CONFIG': JSON.stringify(ENV_CONFIG),
  }),
  new HtmlWebpackPlugin({
    // lang: PAGE_LANG,
    // title: PAGE_TITLE,
    filename: 'index.html',
    template: `${paths.assets}/index.html`,
    minify: {
      removeComments: true,
      collapseWhitespace: true,
      removeRedundantAttributes: true,
      useShortDoctype: true,
      removeEmptyAttributes: true,
      removeStyleLinkTypeAttributes: true,
      keepClosingSlash: true,
      minifyJS: true,
      minifyCSS: true,
      minifyURLs: true,
    },
  }),
  new FaviconWebpackPlugin({
    logo: `${paths.assets}/favicon.svg`,
    mode: 'webapp', // optional can be 'webapp' or 'light' - 'webapp' by default
    devMode: 'webapp', // optional can be 'webapp' or 'light' - 'light' by default
    favicons: {
      appName: 'Mercaux',
      appDescription: 'Mercaux',
      developerName: 'Mercaux',
      developerURL: null, // prevent retrieving from the nearest package.json
      background: '#fff',
      theme_color: '#00B19D',
      icons: {
        coast: false,
        yandex: false,
      },
    },
  }),
  new MiniCssExtractPlugin({
    filename: PRODUCTION ? '[name].[hash].css' : '[name].css',
    chunkFilename: PRODUCTION ? '[id].[hash].css' : '[id].css',
  }),
];

if (WEBPACK_DEV_MODE !== 'server') {
  plugins.unshift(new CleanWebpackPlugin());
}

module.exports = plugins;
