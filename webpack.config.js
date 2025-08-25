const path = require('path');
const webpack = require('webpack');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');
const NodeExternals = require('webpack-node-externals');

module.exports = {
  mode: 'development', // ou 'production', dependendo do ambiente
  entry: './src/main.server.ts', // Define o ponto de entrada correto
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'server.bundle.js',
    libraryTarget: 'commonjs2',
  },
  target: 'node',
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      tslib: path.resolve(__dirname, 'node_modules/tslib/tslib.es6.js'),
    },
    fallback: {
      "path": require.resolve("path-browserify"),
      "crypto": require.resolve("crypto-browserify"),
      "fs": require.resolve("browserify-fs"),
      "url": require.resolve("url/"),
      "buffer": require.resolve("buffer/"),
      "stream": require.resolve("stream-browserify"),
      "util": require.resolve("util/"),
      "zlib": require.resolve("browserify-zlib"),
      "querystring": require.resolve("querystring-es3"),
      "http": require.resolve("stream-http"),
      "https": require.resolve("https-browserify"),
      "net": false,
      "process": require.resolve("process"),
      "vm": require.resolve("vm-browserify"),
      "async_hooks": false,
      ...require('node-libs-browser').fallback,
    },
  },
  externals: [NodeExternals()],
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
      process: 'process',
    }),
    new NodePolyfillPlugin(),
  ],
};
