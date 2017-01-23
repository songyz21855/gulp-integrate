/**
 * Created by zhouyuson on 17/1/23.
 */
var path    = require('path'),
    glob    = require('glob'),
    webpack = require('webpack');

// 项目入口js文件函数
function getEntry(){
    var entrys = {};
    var src    = new RegExp(__dirname.replace(/\\/g, "/") + "/src/common/");
    glob.sync(__dirname + '/src/common/**/*.js').forEach(function(name){
        // 前缀
        var entry = name.replace(src, "");

        // 后缀
        entry         = entry.replace(/\.js$/, "");
        entrys[entry] = name;
    });
    return entrys;
}

module.exports = {
    // devtool:'source-map',
    entry     : getEntry(),                                 // 获取项目入口js文件
    output    : {
        path       : path.join(__dirname, 'dist/common'),   // 文件输出目录
        publicPath : '',                                    // 用于配置文件发布路径，如CDN或本地服务器
        filename   : '[name].js'                            // 根据入口文件输出的对应多个文件名
    },
    module    : {
        // 各种加载器，即让各种文件格式可用require引用
        loaders : []
    },
    resolve   : {
        // 配置别名，在项目中可缩减引用路径
        alias : {
            tab         : __dirname + '/public/src/modules/tab',
        }
    },
    plugins   : [
        //提供全局的变量，在模块中使用无需用require引入
        new webpack.ProvidePlugin({
            "jQuery" : "jquery",
            "$"      : "jquery"
        })
    ],
    externals : {
        // require("jquery") 是引用自外部模块的
        // 对应全局变量 jQuery
    },
    devServer : {}
};