const path = require('path');

const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const VueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports = {
    entry: {
        index: './src/index.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: ['babel-loader']
            },
            {
                test: /\.scss$/,
                include: [
                    path.resolve(__dirname, 'src')
                ],
                use: [
                    MiniCssExtractPlugin.loader,  // replace ExtractTextPlugin.extract({..})
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                          sourceMap: true,
                          config: {
                            path: 'postcss.config.js'  // 这个得在项目根目录创建此文件
                          }
                        }
                      },
                    'sass-loader'
                  ]
            },
            {
                test: /\.vue$/,
                include: [
                    path.resolve(__dirname, 'src')
                ],
                use: ['vue-loader']
            },
            {
                test: /\.(png|jpg|jpeg|gif|eot|ttf|woff|woff2|svg|svgz|otf)(\?.+)?$/,
                include: [
                    path.resolve(__dirname, 'src')
                ],
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            limit: 10000
                        }
                    }
                ]
            },
            {
                test: /\.(mp3|ogg)(\?.*)?$/,
                include: [
                    path.resolve(__dirname, 'src')
                ],
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 10000,
                            name: '[name].[hash:7].[ext]'
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'src/index.html'
        }),
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: '[name].css',
            chunkFilename: '[id].css'
          }),
        new VueLoaderPlugin()
    ],
    devServer: {
        port: 8080,
        host: '0.0.0.0',
        proxy: {
            '/api/*': {
                target: 'http://127.0.0.1:3000',
                changeOrigin: true,
                // secure: false,
                pathRewrite: {
                    '^/api': ''
                }
            }
        }
    },
    devtool: '#eval-source-map'
};