import gulp from 'gulp';
import shell from 'gulp-shell';
import run from 'run-sequence';
import watch from 'gulp-watch';
import server from 'gulp-live-server';
import webpack from 'webpack-stream';
import path from 'path';

const PATHS = {
  build: path.resolve(__dirname, 'public/js'),
  src: path.resolve(__dirname, 'src'),
  endpoints: path.resolve(__dirname, 'src/api/**/*.js'),
  sass: path.resolve(__dirname, 'src/sass/**/*.scss'),
  react: path.resolve(__dirname, 'src/react/**/*.js')
}

gulp.task('default', (cb) => {
  run(cb);
});

gulp.task('dev', (cb) => {
  run('sass','clean','flow','webpack','server',cb);
});

gulp.task('watch', ()=>{
  gulp.watch(PATHS.react, ['watch-webpack']);
  gulp.watch(PATHS.endpoints, ['server']);
  gulp.watch(PATHS.sass, ['sass']);
});

gulp.task('sass', shell.task(['compass compile ./src']));
gulp.task('sass-prod', shell.task(['compass compile ./src -e production']));

// gulp.task('clean');
// gulp.task('flow');
// gulp.task('webpack', ()=>{
//   return gulp.src('src/main.js')
//     .pipe(webpack( require('./webpack.config.js') ))
//     .pipe(gulp.dest('public/'));
// });
gulp.task('watch-webpack',()=>{
  return gulp.src('./src/react/main.js')
  .pipe(webpack({
    watch: true,
    entry: PATHS.src + "/react/main.js",
    output: {
      path: PATHS.build,
      filename: 'bundle.js'
    },
    module: {
      loaders: [{
        test: /\.jsx?/,
        include: PATHS.src,
        loader : 'babel'
      }]
    },
  }))
  .pipe(gulp.dest('dist/'));
})

// gulp.task('server');
