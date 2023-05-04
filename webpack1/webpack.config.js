const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');

module.export = {
    mode:'development',
    entry: {
        main: './src/index.js'
    },
    output: {
        filename:'[name].js',
        path: path.resolve(__dirname,'dist')
    },
    plugins:[
        new HtmlWebpackPlugin({
            template:'./src/index.html'
        })
    ]
}