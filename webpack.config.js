const nodeExternals = require('webpack-node-externals');
module.exports = {
  mode: "production",
  entry: "./src/stella.js",
  target: 'node',
  // externals: [nodeExternals()],
  output: {
    filename: 'bundle.js',
    libraryTarget: 'commonjs2'
  },
  // module: {
  //   rules: [{
  //     test: /\.m?js$/,
  //     exclude: /(node_modules|bower_components)/,
  //     use: {
  //       loader: 'babel-loader',
  //       options: {
  //         presets: [
  //           ['@babel/preset-env', {
  //             useBuiltIns: "usage",
  //             corejs: 2
  //           }]
  //         ]
  //       }
  //     }
  //   }]
  // }
};