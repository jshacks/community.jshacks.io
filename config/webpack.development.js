import path from 'path'
import webpack from 'webpack'
import { Config } from 'webpack-config'
import fs from 'fs'
import HtmlWebpackPlugin from 'html-webpack-plugin'

const globals = {}

const envVars = {
  BASE_URL: `"${process.env.BASE_URL}"`,
  BASE_PATH: `"${process.env.BASE_PATH}"`,
  DEVELOPMENT_ENV: `"${'development' === process.env.NODE_ENV}"`,
  PRODUCTION_ENV: `"${'production' === process.env.NODE_ENV}"`
}

const exclude = /node_modules/

const HOST_IP = process.env.HOST_IP === 'localhost' ? '0.0.0.0' : process.env.HOST_IP

const conf = new Config()
  .extend('./webpack.base.js')
  .merge({
    node: {
      fs: 'empty'
    },
    filename: __filename,
    debug: true,
    devtool: '#source-map',
    output: {
      path: `${process.env.DIST_PATH}/client`,
      pathinfo: true,
      publicPath: process.env.BASE_PATH
    },
    entry: {
      server: [
        `webpack-dev-server/client?http://${HOST_IP}:${process.env.WEBPACK_PORT}`,
        'webpack/hot/dev-server'
      ],
      app: [
         `${process.env.CLIENT_PATH}/index.js`
      ],
      vendor: [
        'ramda'
      ]
    },

    resolve: {
      alias: {
        'css': `${process.env.CLIENT_PATH}/assets/css`,
        'img': `${process.env.CLIENT_PATH}/assets/img`
      },
      extensions: ['', '.webpack.js', '.web.js', '.ts', '.js', '.css', '.tag', '.yml', '.yaml']
    },
    plugins: [
      new webpack.ProvidePlugin(globals),
      new webpack.DefinePlugin(envVars),
      new webpack.HotModuleReplacementPlugin(),
      new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.js'),
      new HtmlWebpackPlugin({
        inject: false,
        template: `${process.env.CLIENT_PATH}/index.html`,
        mobile: true,
        baseHref: HOST_IP,
        appMountId: 'app',
        devServer: `http://${HOST_IP}:${process.env.WEBPACK_PORT}`,
        title: process.env.APP_TITLE,
        hash: true,
        favicon: `${process.env.CLIENT_PATH}/assets/favicon.ico`
      })
    ],
    devServer: {
      historyApiFallback: true,
      contentBase: `${process.env.CLIENT_PATH}`,
      hot: true,
      inline: true,
      progress: true,
      stats: 'errors-only',
      port: process.env.WEBPACK_PORT,
      host: HOST_IP,
    },
    module: {
      noParse: [
        /^ramda$/
      ],
      loaders: [
        { test: /\.js$/, exclude: exclude, loader: 'babel',
          query: {
            presets: ['es2015'],
            plugins: []
          }
        },
        { test: /\.js$/, exclude: exclude, loader: 'ramda-loader?debug=true' }
      ]
    }
  })

module.exports = conf
