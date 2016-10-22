import gulp from 'gulp'
import gutil from 'gulp-util'
import watch from 'gulp-watch'
import babel from 'gulp-babel'
import nodemon from 'gulp-nodemon'
import header from 'gulp-header'
import webpack from 'webpack'
import WebpackDevServer from 'webpack-dev-server'
import webpackConfig from './webpack.config.js'
import R from 'ramda'

let onChange = (delay, fn) => {
  let timeout
  return () => {
    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(fn, delay)
  }
}

gulp.task('client:build', (done) => {

  webpack(webpackConfig).run(x => {
    done()
  })

})

gulp.task('client:watch', () => {
  let compiler = webpack(webpackConfig)
  let server = new WebpackDevServer(compiler, webpackConfig.devServer)
  let port = webpackConfig.devServer.port
  let host = webpackConfig.devServer.host

  let fn = err => {
    if(err) throw new gutil.PluginError("webpack-dev-server", err);
    gutil.log("[webpack-dev-server]", "http://" + host + ":" + port);
  }

  server.listen(port, host, fn)
})

/**
 * server:build
 *
 * Builds the server code from src/server to dist/server
 * Used babel to compile code.
 */
gulp.task('server:watch', (done) => {
  let server
  let ramdaHeader = `\nimport { ${Object.keys(R).join(', \n')} } from 'ramda'\n`
  let headerLoc = ramdaHeader.split('\n').length

  let restartServer = () => {
    if (!server) {
      server = nodemon({
        script: `${process.env.DIST_PATH}/server/index.js`,
        watch: `${process.env.DIST_PATH}/server/`,
        delay: 2500
      })
    }
  }

  let rebuildProject = () => {

    let babelStream = babel().on('error', function (){
      let args = Array.prototype.slice.call(arguments)
      let err = args[0]
      gutil.log(`Error occured
${err.fileName}:${err.loc.line - headerLoc}:${err.loc.column}
${unescape(err.stack)}
`)
      babelStream.end()
    })


    gulp.src(`${process.env.SERVER_PATH}/**/*`)
      .pipe(header(ramdaHeader))
      .pipe(babelStream)
      .pipe(gulp.dest(`${process.env.DIST_PATH}/server`))
      .on('end', restartServer)
  }


  return watch(
    `${process.env.SERVER_PATH}/**/*`,
    { ignoreInitial: false },
    onChange(500, rebuildProject)
  )

})

gulp.task('start:development', ['client:watch', 'server:watch'])
gulp.task('start:production', ['client:build'])

gulp.task('build', ['client:build'])
