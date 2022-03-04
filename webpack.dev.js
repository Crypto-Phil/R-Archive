const path = require('path')
const { merge } = require('webpack-merge')
const common = require('./webpack.common.js')
const webpack = require('webpack')

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    static: path.join(__dirname, './public'),
    port: 3001,
    historyApiFallback: true,
    compress: true,
    client: {
      overlay: {
        errors: true,
        warnings: false,
      },
    },
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
        options: {
          eslint: {
            failOnError: true,
          },
          formatter: 'eslint-friendly-formatter',
        },
      },
    ],
  },
  plugins: [
    new webpack.EnvironmentPlugin({
      DEPLOY_ENV: 'development',
      GRAPHQL_ENDPOINT: 'http://localhost:1984/graphql',
      ARWEAVE_HOST: 'localhost',
      ARWEAVE_PORT: 1984,
      ARWEAVE_PROTOCOL: 'http',
    }),
  ],
})
