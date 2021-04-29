const CopyWebpackPlugin = require('copy-webpack-plugin');

const paths = require('../../paths');

module.exports = function CopyPlugin(additional, to) {
  const dist = to || paths.build;

  return new CopyWebpackPlugin(
    [
      {
        from: `${paths.assets}/*.css`,
        to: dist,
      },
      {
        from: `${paths.assets}/*.svg`,
        to: dist,
      },
      {
        from: `${paths.assets}/*.png`,
        to: dist,
      },
      {
        from: `${paths.assets}/data`,
        to: `${dist}/data`,
      },
      {
        from: `${paths.assets}/fonts`,
        to: `${dist}/fonts`,
      },
    ].concat(additional || [])
  );
};
