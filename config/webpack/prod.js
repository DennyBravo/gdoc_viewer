const merge = require('webpack-merge');
const CompressionPlugin = require('compression-webpack-plugin');
const BrotliPlugin = require('brotli-webpack-plugin');
const zopfli = require('@gfx/zopfli');
const OfflinePlugin = require('offline-plugin');
// const HtmlWebpackPartialsPlugin = require('html-webpack-partials-plugin');
const TerserPlugin = require('terser-webpack-plugin');
// const SentryPlugin = require('@sentry/webpack-plugin');

const common = require('./common.js');
// const paths = require('../paths');

module.exports = merge(common, {
  mode: 'production',
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
  },
  plugins: [
    // new HtmlWebpackPartialsPlugin({
    //   path: `${paths.assets}/analytics.html`,
    //   location: 'body',
    //   priority: 'low'
    // }),
    new CompressionPlugin({
      filename: '[path].gz[query]',
      test: /\.(js|css|html|svg)$/,
      threshold: 0,
      minRatio: 1,
      compressionOptions: {
        level: 11,
        numiterations: 15,
      },
      algorithm: zopfli.gzip,
    }),
    new BrotliPlugin({
      asset: '[path].br[query]',
      test: /\.(js|css|html|svg)$/,
      threshold: 0,
      minRatio: 1,
    }),
    // new SentryPlugin({
    //   include: './dist',
    //   ignore: ['node_modules', 'webpack.config.js'],
    // })
    // new OfflinePlugin(),
  ],
});
