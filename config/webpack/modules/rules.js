const paths = require('../../paths');

module.exports = [
  {
    test: /\.(j|t)sx?$/,
    loader: 'babel-loader',
    include: paths.src,
    exclude: /node_modules/,
  },
  {
    test: /\.css$/,
    use: ['style-loader', 'css-loader'],
  },
  {
    test: /\.(scss|styl)$/,
    use: [
      'style-loader',
      { loader: 'css-modules-typescript-loader' },
      {
        loader: 'css-loader',
        options: {
          modules: {
            localIdentName: '[name]__[local]___[hash:base64:5]',
          },
        },
      },
      {
        loader: 'postcss-loader',
        options: {
          config: {
            path: './config/postcss.config.js',
          },
        },
      },
      'stylus-loader',
    ],
  },
  {
    test: /\.svg$/,
    exclude: paths.modules,
    oneOf: [
      {
        issuer: /\.tsx?$/,
        use: [
          {
            loader: 'babel-loader',
          },
          {
            loader: 'svg-react-loader',
          },
        ],
      },
      {
        loader: 'file-loader',
        options: {
          name: 'static/[name].[ext]',
          outputPath: 'images/',
        },
      },
    ],
  },
  {
    test: /\.png$/,
    exclude: paths.modules,
    use: [
      {
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'static/media/[name].[hash:8].[ext]',
        },
      },
    ],
  },
  {
    test: /\.woff2$/,
    use: {
      loader: 'file-loader',
      options: {
        name: 'static/[name].[ext]',
        outputPath: 'fonts/',
      },
    },
  },
];
