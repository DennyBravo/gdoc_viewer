module.exports = function exports(api) {
  api.cache(true);

  return {
    presets: [
      [
        '@babel/env',
        {
          modules: false,
          targets: {
            browsers: [
              'last 2 Chrome versions',
              'last 2 Firefox versions',
              'last 2 Safari versions',
              'last 2 Edge versions',
            ],
          },
        },
      ],
      '@babel/react',
      ['@babel/preset-typescript', { allExtensions: true, isTSX: true }],
    ],
    plugins: [
      '@babel/syntax-dynamic-import',
      '@babel/plugin-proposal-optional-chaining',
      [
        '@babel/plugin-proposal-decorators',
        {
          legacy: true,
        },
      ],
      '@babel/proposal-class-properties',
    ],
    env: {
      development: {
        plugins: ['@babel/transform-runtime', 'react-hot-loader/babel'],
      },
    },
  };
};
