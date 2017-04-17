var webpack = require('webpack');
var path = require('path');
var uglifyJsPlugin = webpack.optimize.UglifyJsPlugin;

var PATHS = {
  build: path.resolve(__dirname, 'build'),
  bundle: path.resolve(__dirname, 'public/js'),
  src: path.resolve(__dirname, 'src')
};


var config = {
  entry: PATHS.src + "/react/main.js",
  output: {
    path: PATHS.bundle,
    filename: 'bundle.min.js'
  },
  module: {
    loaders: [{
      test: /\.jsx?/,
      include: PATHS.src,
      exclude: /node_modules/,
      loader : 'babel-loader'
    }]
  },
  plugins: [
    new uglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  ]
};

module.exports = config;
