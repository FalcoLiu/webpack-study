const os = require('os');
const path = require('path');// nodejs模块,专门用来处理路径问题
const ESLintPlugin = require('eslint-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const PreloadWebpackPlugin = require('@vue/preload-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');

const threads = os.cpus().length;// cpu核数

// 用来获取处理样式的loader
function getStyleLoader(pre) {
    return [
        MiniCssExtractPlugin.loader,
        "css-loader",
        {
            loader: 'postcss-loader',
            options: {
                postcssOptions: {
                    plugins: [
                        'postcss-preset-env', // 能解决大多数样式兼容问题
                    ]
                }
            }
        },
        pre
    ].filter(Boolean)
}
module.exports = {
    // 入口
    entry: './src/main.js',// 相对路径
    // 输出
    output: {
        // 文件输出路径
        // __dirname nodejs的变量,代表当前文件的文件夹目录
        path: path.resolve(__dirname, '../dist'),// 绝对路径
        // 文件名
        filename: 'static/js/[name].[contenthash:10].js',
        // 给打包输出的其他文件命名
        chunkFilename:'static/js/[name].[contenthash:10].chunk.js',
        // 图片字体等通过type:asset处理资源命名方式
        assetModuleFilename:"static/media/[hash:10][ext][query]",
        // 自动清空上次打包的结果
        // 打包前将path整个目录清空,再进行打包
        clean: true
    },
    // 加载器
    module: {
        rules: [
            {
                oneOf: [
                    // loader的配置
                    {
                        test: /\.css$/, // 只检测.css文件
                        use: getStyleLoader()
                    },
                    {
                        test: /\.less$/,
                        use: getStyleLoader('less-loader')
                    },
                    {
                        test: /\.s[ac]ss$/,
                        use: getStyleLoader('sass-loader')
                    },
                    {
                        test: /\.styl$/,
                        use: getStyleLoader('stylus-loader')
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
                        include: path.resolve(__dirname, '../src'), // 只处理src下的文件,其他文件不处理
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
        }),
        new MiniCssExtractPlugin({
            filename: 'static/css/[name].[contenthash:10].css',
            chunkFilename:'static/css/[name].[contenthash:10].chunk.css',
        }),
        // new CssMinimizerPlugin(),
        // new TerserWebpackPlugin({
        //     parallel:threads,// 开启多进程和进程数量
        // })
        new PreloadWebpackPlugin({
            rel: 'preload',
            as: 'script'
        }),
        new WorkboxPlugin.GenerateSW({
            // 这些选项帮助快速启用 ServiceWorkers
            // 不允许遗留任何"旧的" ServiceWorkers
            clientsClaim: true,
            skipWaiting:true,
        })
    ],
    optimization:{
        // 压缩的操作
        minimizer:[
            // 压缩css
            new CssMinimizerPlugin(),
            // 压缩js
            new TerserWebpackPlugin({
                parallel:threads,// 开启多进程和进程数量
            })
        ],
        // 代码分割配置
        splitChunks: {
            chunks: 'all',
            // 其他都用默认值
        },
        runtimeChunk: {
            name: entrypoint => `runtime~${entrypoint.name}.js`,
        }
    },
    // 模式
    mode: 'production',
    devtool: 'source-map'
}