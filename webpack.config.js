const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: ['./app/index.js', './app/sass/app.scss'],
  output: {
    filename: 'app.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [{
      test: /\.scss$/,
      use: [{
        loader: "file-loader",
        options: {
          name: '[name].css',
          outputPath: 'styles/'
        }
      }, {
          loader: "sass-loader", // compiles Sass to CSS
          options: {
            includePaths: ['./app/components/accordion/accordion.scss']
          }
      }, 'postcss-loader']
    }]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./app/views/index.html",
      title: "Accordion Component", 
      "files": {
        "css": "css/app.css",
      }
    }),
    new CopyWebpackPlugin([
      { from: './data/**.*' },
      { from: './app/images', to: './images' },
      { from: './app/fonts', to: './fonts' },
    ])
  ]
};