const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./common.js');
const paths = require('../paths');

module.exports = merge(common, {
  mode: 'development',
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
  ],
  devtool: 'source-map',
  devServer: {
    hot: true,
    contentBase: paths.build,
    compress: true,
    historyApiFallback: true,
    public: 'localhost',
    port: 8000,
  },
});
