const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode:'development',
    entry: {
        main: './src/index.js'
    },
    module:{
        rules:[
            {
                test:/\.scss$/,
                loader:[
                    'style-loader',
                    'css-loader',
                    'postcss-loader',
                    'sass-loader'
                ]
            }
        ]
    },
    output: {
        filename:'[name].js',
        path: path.resolve(__dirname,'dist')
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html'
        })
    ]
}