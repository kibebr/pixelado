const webpack = require('webpack')
const path = require('path')
const Dotenv = require('dotenv-webpack')

module.exports = {
  entry: './src/App.js',
  plugins: [
    new Dotenv({ systemvars: true })
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
        loader: 'file-loader',
        options: '[name].[hash].[ext]'
      }
    }, {
      test: /\.ttf$/,
      use: {
        loader: 'file-loader',
        options: {
          name: '[name].[hash].[ext]',
          outputPath: 'fonts/'
        }
      }
    }, {
      test: /.m?js$/, type: 'javascript/auto', resolve: { fullySpecified: false }
    }]
  }
}
