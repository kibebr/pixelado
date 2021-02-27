const webpack = require('webpack')
const path = require('path')
const Dotenv = require('dotenv-webpack')

module.exports = {
  entry: './src/App.js',
  plugins: [
    new Dotenv({ 
      systemvars: true,
      path: './.env'
    })
  ],
  resolve: {
    alias: {
      svelte: path.resolve('node_modules', 'svelte')
    },
    extensions: ['.mjs', '.js', '.svelte'],
    mainFields: ['svelte', 'browser', 'module', 'main']
  },
  module: {
    rules: [{
      test: /\.svg$/,
      use: {
        loader: 'svg-inline-loader',
        options: {}
      }
    }, {
      test: /.m?js$/, type: 'javascript/auto', resolve: { fullySpecified: false }
    }, {
      test: /\.jpg$/,
      use: {
        loader: 'url-loader'
      }
    }]
  }
}
