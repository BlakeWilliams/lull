const path = require('path')

const config = {
  target: 'electron-main',
  devtool: 'inline-source-map',
  entry: './src/main/index.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main/index.js',
    libraryTarget: 'commonjs2',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /(node_modules|__tests__)/,
      },
    ],
  },
  node: {
    __dirname: false,
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json'],
    alias: {
      '@common': path.resolve(__dirname, 'src/common/'),
      '@main': path.resolve(__dirname, 'src/main/'),
    },
  },
}

module.exports = config
