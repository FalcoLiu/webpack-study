const commonConfig = require('./webpack.base.config.js');
const { smart: merge} = require('webpack-merge');

const prodConfig = {
    mode:'production',
    module:{
        rules:[
            {
                test: /\.(jpeg|jpg|png)$/,
                loader:'url-loader',
                options:{
                    limit: 10 * 1024,
                    outputPath:'/img/'
                }
            }
        ]
    }
}

module.exports = merge(commonConfig,prodConfig);