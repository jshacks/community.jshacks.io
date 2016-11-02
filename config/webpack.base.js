import path from 'path'
import text from 'extract-text-webpack-plugin'
import { Config } from 'webpack-config'
import webpack from 'webpack'

const exclude = /node_modules/

module.exports = new Config().merge({
  output: {
    filename: '[name].js'
  },
  resolve: {
    root: [
      process.env.CLIENT_PATH
    ],
    modulesDirectories: [
      'node_modules'
    ],
    alias: {
      'vue$': 'vue/dist/vue.js'
    }
  },
  plugins: [
    new text('[name].css')
  ],
  module: {
    preLoaders: [
      { test: /\.yml|\.yaml$/, exclude: exclude, loader: 'json-loader!yaml-loader' },
      { test: /\.json$/, exclude: exclude, loader: 'json-loader' },
      { test: /\.png$/, loader: 'url-loader?limit=5000' },
      { test: /\.css$/, include: /node_modules/, loader: "style-loader!css-loader" },
      { test: /\.css$/, exclude: /node_modules/, loader: "style-loader!css-loader!postcss-loader" },
      { test: /\.jpg$/, exclude: exclude, loader: 'url-loader?prefix=img/&limit=5000' },
      { test: /\.gif$/, exclude: exclude, loader: 'url-loader?prefix=img/&limit=5000' },
      { test: /\.woff$/, loader: 'url-loader?prefix=font/&limit=5000' },
      { test: /\.woff2$/, loader: 'url-loader?prefix=font/&limit=5000' },
      { test: /\.eot$/, loader: 'file-loader?prefix=font/' },
      { test: /\.ttf$/, loader: 'file-loader?prefix=font/' },
      { test: /\.svg$/, loader: 'file-loader?prefix=font/' }
    ],
    loaders: [
      { test: /\.vue$/, loader: "vue" }
    ]
  },
  postcss: function () {
    return [
      require('postcss-simple-vars'),
      require('autoprefixer'),
      require('precss'),
      require('postcss-import')({
        addDependencyTo: webpack,
        glob: true
      })
    ];
  }
})
