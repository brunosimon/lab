const merge = require('webpack-merge')
const webpackCommonConfig = require('./webpack.common.js')
const webpack = require('webpack')
const ip = require('ip')

module.exports = merge(
    webpackCommonConfig,
    {
        devServer:
        {
            contentBase: './dist',
            host: ip.address()
        },
        plugins:
        [
            new webpack.HotModuleReplacementPlugin()
        ]
    }
)
