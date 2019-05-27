const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const config = {
  target: 'electron-renderer',
  devtool: 'inline-source-map',
  entry: {
    chat: './src/renderer/chat.tsx',
  },
  output: {
    path: path.resolve(__dirname, 'dist/renderer'),
    filename: '[name].js',
    libraryTarget: 'commonjs2',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              modules: true,
              localIdentName: '[name]__[local]___[hash:base64:5]',
              importLoaders: 1,
            },
          },
          {
            loader: 'sass-loader',
            options: {
              includePaths: ['src/renderer/styles'],
            },
          },
        ],
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {},
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      chunks: ['chat'],
      filename: 'chat.html',
      template: 'src/renderer/template.html',
    }),
    new webpack.DefinePlugin({
      VERSION: JSON.stringify(require('./package.json').version),
    }),
  ],
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json'],
  },
  devServer: {
    compress: true,
    port: 8008,
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json'],
    alias: {
      '@common': path.resolve(__dirname, 'src/common/'),
      '@renderer': path.resolve(__dirname, 'src/renderer/'),
    },
  },
}

module.exports = config
