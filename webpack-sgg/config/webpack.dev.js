const os = require('os');
const path = require('path');// nodejs模块,专门用来处理路径问题
const ESLintPlugin = require('eslint-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');


const threads = os.cpus().length;// cpu核数
module.exports = {
    // 入口
    entry: './src/main.js',// 相对路径
    // 输出
    output: {
        // 文件输出路径
        path: undefined,
        // 文件名
        filename: 'static/js/[name].js',
        // 给打包输出的其他文件命名
        chunkFilename:'static/js/[name].chunk.js',
        // 图片字体等通过type:asset处理资源命名方式
        assetModuleFilename:"static/media/[hash:10][ext][query]",
    },
    // 加载器
    module: {
        rules: [
            {
                // 每个文件只能被其中一个loader处理
                oneOf: [
                    // loader的配置
                    {
                        test: /\.css$/, // 只检测.css文件
                        use: [// 执行顺序从右到左,或者从上到下
                            "style-loader",//将js中的css通过创建style标签添加html文件中生效
                            "css-loader"//将css资源编译成commonjs的模块到js中
                        ]
                    },
                    {
                        test: /\.less$/,
                        use: [
                            "style-loader",
                            "css-loader",
                            "less-loader"
                        ]
                    },
                    {
                        test: /\.s[ac]ss$/,
                        use: [
                            "style-loader",
                            "css-loader",
                            "sass-loader"
                        ]
                    },
                    {
                        test: /\.styl$/,
                        use: [
                            "style-loader",
                            "css-loader",
                            "stylus-loader"
                        ]
                    },
                    {
                        test: /\.(png|jpe?g|gif|webp|svg)$/,
                        type: 'asset',
                        parser: {
                            dataUrlCondition: {
                                // 小于10kb会转base64
                                // 优点:减少请求数量,缺点:体积会变大一点
                                maxSize: 10 * 1024,// 10kb
                            }
                        },
                        // generator: {
                        //     // 生成图片名称
                        //     filename: "static/images/[hash:10][ext][query]"
                        // }
                    },
                    {
                        test: /\.js$/,
                        // exclude: /node_modules/,// 排除node_modules中的js文件不处理
                        include:path.resolve(__dirname,'../src'), // 只处理src下的文件,其他文件不处理
                        use: [
                            {
                                loader: 'thread-loader',// 开启多进程
                                options:{
                                    works: threads,// 进程数量
                                }
                            },
                            {
                                loader: 'babel-loader',
                                options: {
                                    // presets:['@babel/preset-env']
                                    cacheDirectory: true, // 开启babel缓存
                                    cacheCompression: false, // 关闭缓存文件压缩
                                    plugins: ["@babel/plugin-transform-runtime"],//减少代码体积
                                }
                            }
                        ]
                    }
                ]
            }
        ]
    },
    // 插件
    plugins: [
        // plugin的配置
        new ESLintPlugin({
            // 检测哪些文件
            context: path.resolve(__dirname, '../src'),
            exclude: 'node_modules', // 默认值
            cache: true, // 开启缓存
            cacheLocation: path.resolve(
                __dirname, 
                '../node_modules/.cache/eslintCache'
            ),
            threads,// 开启多进程和进程数量
        }),
        new HtmlWebpackPlugin({
            // 模板,以public/index.html文件创建新的html文件
            // 新的文件特点:1.结构和原来一致2.会自动引入打包输出的资源
            template: path.resolve(__dirname, '../public/index.html')
        })
    ],
    // 开发服务器:不会输出资源,在内存中编译打包的
    devServer: {
        host: 'localhost',// 启动会服务器域名
        port: '3000',
        open: true,
        hot: true
    },
    // 模式
    mode: 'development',
    devtool: 'cheap-module-source-map'
}