const path = require('path'); //处理文件路径
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {
    CleanWebpackPlugin
} = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin"); // 分离css与html
const vueLoaderPlugin = require('vue-loader/lib/plugin');
const devMode = process.argv.indexOf('--mode=production') === -1;
const HappyPack = require('happypack');
const os = require('os');

const happyThreadPool = HappyPack.ThreadPool({size: os.cpus().length});

console.log(devMode, process.argv)
module.exports = {
    //mode: 'development', // 开发环境
    // 单文件入口
    // entry:"./src/main.js",
    // 多文件入口
    entry: {
        main: ["@babel/polyfill",path.resolve(__dirname, './src/main.js')],
        // header:[ path.resolve(__dirname, './src/header.js')]
    },
    // entry:[],
    output: {
        filename: 'js/[name].[hash:8].js', // 根据entry的文件名
        path: path.resolve(__dirname, 'dist'), //打包后目录
        chunkFilename:'js/[name].[hash:8].js'
    },
    module: {
        noParse:[/jquery/], // 不解析jquery的依赖库   提升打包速度
        rules: [{ // 处理一般css
                test: /\.css$/,
                use: [
                    {
                        loader: devMode? 'vue-style-loader' : MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: './dist/css/',
                            hmr: devMode
                            }
                    }, // vue style标签的处理
                    // MiniCssExtractPlugin.loader,  // 分离打包的css
                    // 'style-loader',
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: [require('autoprefixer')] // css添加前缀
                        }
                    },
                ]
            },
            {
                test: /\.less$/,
                use: [{
                    loader: devMode? 'vue-style-loader' : MiniCssExtractPlugin.loader,
                    options: {
                        publicPath: './dist/css/',
                        hmr: devMode
                        }
                    },
                    // MiniCssExtractPlugin.loader,
                    // 'style-loader', //该loader把css作为style标签插入html中
                    'css-loader',
                    'less-loader',
                    {
                        loader: 'postcss-loader', // 给css添加前缀
                        options: {
                            plugins: [require('autoprefixer')]
                        }
                    },
                ]
            },
            {
                test: /\.(png|gif|svg|jpe?g)$/, //图片文件
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 10240, //10MB ? 
                        fallback: { // 之后使用的loader
                            loader: 'file-loader',
                            options: {
                                name: 'image/[name].[hash:8].[ext]' // ext后缀
                            }
                        }
                    }
                }]
            },
            {
                test: /\.(mp4|webm|mp3|wav|flac|acc)(\?.*)?$/, //媒体文件  
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 10240,
                        fallback: {
                            loader: 'file-loader',
                            options: {
                                name: 'media/[name].[hash:8].[ext]'
                            }
                        }
                    }
                }]
            },
            {
                test: /\.(woff2|eot|ttf|otf)(\?.*)?$/, // 字体文件  
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 10240,
                        fallback: {
                            loader: 'file-loader',
                            options: {
                                name: 'fonts/[name].[hash:8].[ext]'
                            }
                        }
                    }
                }]
            },
            {
                test: /\.xml$/, //处理xml 转化成对象形式
                use: [
                    'xml-loader'
                ]
            },
            {
                test: /\.js$/,
                // use: {
                //     loader: 'babel-loader',
                //     options: {
                //         presets: ['@babel/preset-env']
                //     }
                // },
                use:[{
                    loader: 'happypack/loader?id=happyBabel'
                }],
                exclude: /node_modules/   //排除某些文件夹 提升速度
            },
            {
                test: /\.vue$/,
                // use: ['vue-loader']
                use: ['cache-loader', 'thread-loader', {
                    loader: 'vue-loader',
                    options: {
                        compilerOptions: {
                            preserveWhitespace: false
                        }
                    }
                }]
            }
        ]
    },
    resolve: {
        alias: {   //别名
            /**
             * alias: 当我们代码中出现 import 'vue'时， 
             * webpack会采用向上递归搜索的方式去node_modules 目录下找。
             * 为了减少搜索范围我们可以直接告诉webpack去哪个路径下查找。
             * 也就是别名(alias)的配置。
             * 
             */
            'vue$': 'vue/dist/vue.runtime.esm.js',
            '@': path.resolve(__dirname, './src'),
            // 'assets': resolve('src/assets'),
            // 'components': resolve('src/components') 
        },
        extensions: ['*', '.js', '.json', '.vue']
    },

    // devServer: {
    //     port: 3456,
    //     hot: true, //热更新
    //     contentBase: './dist'
    // },
    plugins: [
        new HappyPack({
            id: 'happyBabel', //对应js上loader后面的id
            loaders: [{
                loader: 'babel-loader',
                options: {
                    presets:[
                        ['@babel/preset-env']
                    ],
                    cacheDirectory: true
                }
            }],
            threadPoll: happyThreadPool // 共享进程池  happypack 开辟一个新的进程来共同build 
        }),
        new CleanWebpackPlugin(), // 清空之前的dist文件夹
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, './public/index.html'),
            // filename: 'index.html',
            // chunks: ['main'] // 与entry下面对应的模块名
        }),
        // new HtmlWebpackPlugin({
        //     template: path.resolve(__dirname, './public/header.html'),
        //     filename: 'header.html', // 输入的html文件名
        //     chunks: ['header'] // 与entry下面对应的模块名
        // }),
        new MiniCssExtractPlugin({
            filename:devMode? '[name].css': '[name].[hash].css',
            chunkFilename: devMode? "[id].css": "[id].[hash].css"
        }),
        new vueLoaderPlugin(),
        // new Webpack.HotModuleReplacementPlugin()
    ],
}