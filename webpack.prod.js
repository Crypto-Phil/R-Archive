const { merge } = require('webpack-merge')
const common = require('./webpack.common.js')
const webpack = require('webpack')

module.exports = merge(common, {
  mode: 'production',
  devtool: 'source-map',
  plugins: [
    new webpack.EnvironmentPlugin({
      DEPLOY_ENV: 'production',
      GRAPHQL_ENDPOINT: 'https://arweave.net/graphql',
      ARWEAVE_HOST: 'arweave.net',
      ARWEAVE_PORT: 443,
      ARWEAVE_PROTOCOL: 'https',
      ARWEAVE_TIMEOUT: 200000,
    }),
  ],
})
