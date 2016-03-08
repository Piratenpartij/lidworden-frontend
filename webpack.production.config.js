var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  entry: __dirname + "/app/main.js",
  output: {
    path: __dirname + "/build",
    filename: "[name]-[hash].js"
  },

  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel'
      }, {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader?' + JSON.stringify({discardComments: {removeAll: true}}))
      }, {
        test: /\.(svg|ttf|woff|woff2|eot|png|jpg)$/,
        loader: 'file-loader'
      }

    ]
  },

  plugins: [
    new CleanWebpackPlugin(['build'], {
      verbose: true,
      dry: false
    }),
    new HtmlWebpackPlugin({
      template: __dirname + "/app/index.tmpl.html"
    }),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({comments: false}),
    new ExtractTextPlugin("[name]-[hash].css")
  ]
}
