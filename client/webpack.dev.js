const path = require('path');
const webpack = require('webpack');
const { merge } = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const common = require('./webpack.common');

module.exports = merge(common, {
    mode: 'development',
    output: {
        filename: 'static/js/[name].bundle.js'
    },
    devServer: {
        compress: true,
        contentBase: path.join(__dirname, 'dist'),
        watchContentBase: true,
        port: 3000,
        historyApiFallback: true,
        hot: true,
        open: true,
        proxy: [{
            context: ['/api', '/auth'],
            target: 'http://localhost:5000'
        }]
    },
    devtool: 'inline-source-map',
    plugins: [
        new MiniCssExtractPlugin({ filename: 'static/css/[name].bundle.css' }),
        new webpack.HotModuleReplacementPlugin()
    ]
});
