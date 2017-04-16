import gulp from 'gulp';
import shell from 'gulp-shell';
import run from 'run-sequence';
import watch from 'gulp-watch';
import server from 'gulp-live-server';
import webpack from 'webpack-stream';
import path from 'path';
import colors from 'colors';

const PATHS = {
  build: path.resolve(__dirname, 'build'),
  bundle: path.resolve(__dirname, 'public/js'),
  src: path.resolve(__dirname, 'src'),
  endpoints: path.resolve(__dirname, 'src/api/**/*.js'),
  sass: path.resolve(__dirname, 'src/sass/**/*.scss'),
  react: path.resolve(__dirname, 'src/react/**/*.js'),
  api: path.resolve(__dirname, 'api')
}

gulp.task('default', (cb) => {
  run('sass','flow','webpack','api','server','restart','watch',cb);
});
gulp.task('prod-build', (cb) => {
  run('sass-prod','webpack-prod','prod-clean');
});

gulp.task('watch', ()=>{
  gulp.watch(PATHS.react, ['watch-webpack']);
  gulp.watch(PATHS.endpoints, ['api','restart']);
  gulp.watch(PATHS.sass, ['sass']);
});

gulp.task('sass', shell.task(['compass compile ./src']));
gulp.task('sass-prod', shell.task(['compass compile ./src -e production']));

gulp.task('prod-clean', shell.task([
    `echo '~~~~~~~~  UPDATING THE BUILD FOLDER  ~~~~~~~~'`,
    `rm -rf build/*`,
    `cp -a ./public/ ./build/`,
    `rm build/css/main.css.map build/js/bundle.js public/js/bundle.min.js`
  ])
);

gulp.task('flow', shell.task(['flow'],{ignoreErrors: true}));

gulp.task('api', shell.task([
  'rm -rf api/*', 'mkdir -p api',
  'babel ./src/api --out-dir ./api/ --no-comments --minified'
  // 'babel ./src/api/truth.server.js --out-file ./api/truth.server.js --no-comments --minified'
]));

gulp.task('webpack',()=>{
  return gulp.src('./src/react/main.js')
  .pipe(webpack({
    watch: false,
    entry: PATHS.src + "/react/main.js",
    output: {
      path: PATHS.bundle,
      filename: 'bundle.js'
    },
    module: {
      loaders: [{
        test: /\.jsx?/,
        include: PATHS.src,
        // loader : 'babel',
        exclude: /node_modules/,
        loader: 'babel-loader?presets[]=es2015&presets[]=react',
      }]
    },
  }))
  .pipe(gulp.dest(PATHS.bundle));
});
gulp.task('watch-webpack',()=>{
  return gulp.src('./src/react/main.js')
  .pipe(webpack({
    watch: true,
    entry: PATHS.src + "/react/main.js",
    output: {
      path: PATHS.bundle,
      filename: 'bundle.js'
    },
    module: {
      loaders: [{
        test: /\.jsx?/,
        include: PATHS.src,
        // loader : 'babel',
        exclude: /node_modules/,
        loader: 'babel-loader?presets[]=es2015&presets[]=react',
      }]
    },
  }))
  .pipe(gulp.dest(PATHS.bundle));
});
gulp.task('webpack-prod', shell.task(['webpack -p']));

let express;
gulp.task('server', ()=>{ express = server.new(`${PATHS.api}/truth.server.js`); });
gulp.task('restart', ()=>{express.start.bind(express)(); });
