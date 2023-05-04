const commonConfig = require('./webpack.base.config.js');
const { smart: merge} = require('webpack-merge');

const devConfig = {
    mode:'development',
    devServer:{
        port:8080,// 服务器启动的端口
        contentBase: './dist', // 服务器静态资源文件夹
        progress:true, // 打包时显示进度条
        open: true, // 启动服务器后,自动打开浏览器
        compress: true, // 开启gzip压缩
        proxy:{
            '/api/yixiantong':{
                target:'http://study.jsplusplus.com',
                changeOrigin:true,
                pathRewrite:{
                    '^/api':''
                }
            }
        }
    },
    module:{
        rules:[
            {
                test: /\.(jpeg|jpg|png)$/,
                loader:'file-loader'
            }
        ]
    }
}

module.exports = merge(commonConfig,devConfig);