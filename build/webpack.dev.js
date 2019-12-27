const Webpack = require('webpack')
const webpackConfig = require('../webpack.config.js')
const WebpackMerge = require('webpack-merge')
module.exports = WebpackMerge(webpackConfig,{
  mode:'development',
  devtool:'cheap-module-eval-source-map',
  devServer:{
    port:3456,
    hot:true,
    contentBase:'../dist'
  },
  plugins:[
    new Webpack.HotModuleReplacementPlugin()
  ]
})
