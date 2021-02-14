const webpack = require('webpack')
const path = require('path')
const common = require('./webpack.common.cjs')
const { merge } = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = merge(common, {
  mode: 'development',
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/template.html'
    })
  ],
  module: {
    rules: [{
      test: /\.svelte$/,
      use: {
        loader: 'svelte-loader',
        options: {
          emitCss: false,
          hotReload: true
        }
      }
    }, {
      test: /\.css$/,
      use: [
        'style-loader',
        'css-loader'
      ]
    }]
  },
  devServer: {
    host: '0.0.0.0',
    disableHostCheck: true,
    port: 8080
  }
})
