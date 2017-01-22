# gulp 工作流基本配置
<p align="center">
   <img height="257" width="114" src="https://github.com/zhouyuson/gulp-integrate/blob/master/dist/images/gulp.png">
</p>
基于gulp搭建的一个前端开发环境下编译源文件的基本配置，下载后进入目录运行npm install ,然后运行gulp


## 为何要用构建工具?
   自动化。对于需要反复重复的任务，例如压缩（minification）、编译、单元测试等，自动化工具可以减轻你的劳动，简化你的工作。当你正确配置好了任务，就会自动帮你完成大部分无聊的工作。


## 你需要知道的4个gulp命令
```
 gulp.task(name[,deps],fn) 定义任务 name: 任务名称  deps: 依赖任务名称  fn:回调函数
 gulp.watch(glob,fn) 当glob内容发生改变时，执行fn
 gulp.src(glob) 设置需要处理的文件的路径,可以是多个文件以数组的形式,也可以是正则
 gulp.dest(path[,options]) 设置生成文件的路径
```

## `gulpfile.js`
根据功能模块分开写实例，具体情况在根据项目需要进行组合
```js
var gulp         = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),   // 自动添加css前缀
    notify       = require('gulp-notify'),         // 更改提醒
    rename       = require('gulp-rename'),         // 重命名
    plumber      = require('gulp-plumber'),        // 阻止gulp插件发生错误导致进程退出并输出错误日志
    minifycss    = require('gulp-minify-css'),     // css文件压缩
    imagemin     = require('gulp-imagemin'),       // 图片压缩
    uglify       = require('gulp-uglify'),         // js文件压缩
    concat       = require('gulp-concat'),         // 合并js文件
    cache        = require('gulp-cache'),          // 图片缓存，只有图片替换了才压缩
    less         = require('gulp-less'),           // less文件编译
    sass         = require('gulp-sass'),           // sass文件编译
    babel        = require('gulp-babel'),          // 编译ES6语法
    watch        = require('gulp-watch'),          // 文件监听
    sourcemaps   = require('gulp-sourcemaps'),     // 源码压缩之后不易报错定位 sourcemaps用于错误查找
    livereload   = require('gulp-livereload');     // 自动刷新页面

/* 使用gulp-load-plugins模块，可以加载package.json文件中所有的gulp模块 */
/*var gulpLoadPlugins = require('gulp-load-plugins'),
    plugins         = gulpLoadPlugins();

gulp.task('script', function () {
    return gulp.src(gulpPath.src.js)
               .pipe(plugins.jshint())
               .pipe(plugins.uglify())
               .pipe(gulp.dest(gulpPath.dist.js));
});*/
/* end gulp-load-plugins模块 */

var gulpSrc  = './src',    // 源码目录
    gulpDist = './dist';   // 打包目录

// gulp 源文件与目标文件基本配置
var gulpPath = {
    src : {
        less  : [
            gulpSrc + '/less/**/*.less',
            '!' + gulpSrc + '/less/*_un.less'          // 不编译
        ],
        sass  : [
            gulpPath + '/sass/**/*.scss',
            '!' + gulpPath + '/sass/**/*_un.scss'     // 不编译
        ],
        images: [
            gulpSrc + '/images/**/**',
            '!' + gulpSrc + '/images/**/*.psd'         // 不编译
        ],
        js    : gulpSrc + '/js/**/*.js',
        babel : gulpSrc + '/babel/**/*.js'
    },
    dist: {
        css   : gulpDist + '/css',
        images: gulpDist + '/images',
        js    : gulpDist + '/js',
        babel : gulpDist + '/babel'
    }
}

// 编译less文件
gulp.task('less', function () {
    return gulp.src(gulpPath.src.less)
        .pipe(plumber())
        .pipe(less())
        .pipe(autoprefixer({
            browses: ['last 2 versions', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1'],
            cascade: false
        }))
        .pipe(rename({suffix: '.min'}))
        .pipe(minifycss())
        .pipe(gulp.dest(gulpPath.dist.css))
        .pipe(notify({message: 'less 文件有更改!'}));
});

// 编译scss文件
gulp.task('sass',function () {
    return gulp.src(gulpPath.src.sass)
        .pipe(plumber())
        .pipe(sass())
        .pipe(autoprefixer({
            browses: ['last 2 versions', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1'],
            cascade: false
        }))
        .pipe(rename({suffix: '.min'}))
        .pipe(minifycss())
        .pipe(gulp.dest(gulpPath.dist.css))
        .pipe(notify({message: 'sass 文件有更改!'}));
})

// 图片压缩
gulp.task('images', function () {
    return gulp.src(gulpPath.src.images)
        .pipe(plumber())
        .pipe(cache(imagemin({
            optimizationLevel: 3,
            progressive      : true,
            interlaced       : true
        })))
        .pipe(gulp.dest(gulpPath.dist.images))
        .pipe(notify({message: 'images 文件有更改!'}));
});

// 脚本代码合并压缩
gulp.task('script', function () {
    return gulp.src(gulpPath.src.js)
        .pipe(plumber())
        .pipe(concat('main.js'))
        .pipe(uglify())
        .pipe(gulp.dest(gulpPath.dist.js))
        .pipe(notify({message: 'scripts 文件有更改!'}));
});

// 编译ES6语法的文件
gulp.task('babel',function () {
    return gulp.src(gulpPath.src.babel)
               .pipe(plumber())
               .pipe(babel({
                   presets: ['es2015']
               }))
               .pipe(gulp.dest(gulpPath.dist.babel))
               .pipe(notify({message: 'ES6语法文件 文件有更改!'}));
})

// 文件监听
gulp.task('watch', function () {

    // 监听所有less文件
    gulp.watch(gulpPath.src.less[0], ['less']);

    // 监听所有的sass文件
    gulp.watch(gulpPath.src.sass[0], ['sass']);

    // 监听所有图片文件
    gulp.watch(gulpPath.src.images[0], ['images']);

    // 监听所有脚本文件
    gulp.watch(gulpPath.src.js, ['script']);

    // 监听所有的ES6脚本文件
    gulp.watch(gulpPath.src.babel, ['babel']);

    // 建立即时重整服务器
    var server = livereload();

    // 看守所有位在 dist/  目录下的档案，一旦有更动，便进行重整
    gulp.watch([gulpDist + '/**']).on('change', function(file) {
        server.changed(file.path);
    });

});

// 默认任务
gulp.task('default', ['watch','less','sass','images', 'script','babel']);
```