const nodeExternals = require('webpack-node-externals');
module.exports = {
  mode: "production",
  entry: "./src/stella.js",
  target: 'node',
  externals: [ nodeExternals() ],
  output: {
    filename: 'stella.js',
    libraryTarget: 'commonjs2'
  }
};
