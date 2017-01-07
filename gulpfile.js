/**
 * Created by zhouyuson on 2016/12/13.
 * gulp 配置文件
 */
var gulp         = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),   // 自动添加css前缀
    notify       = require('gulp-notify'),         // 更改提醒
    rename       = require('gulp-rename'),         // 重命名
    plumber      = require('gulp-plumber'),        // 阻止gulp插件发生错误导致进程退出并输出错误日志
    minifycss    = require('gulp-minify-css'),     // css文件压缩
    imagemin     = require('gulp-imagemin'),       // 图片压缩
    uglify       = require('gulp-uglify'),         // js文件压缩
    cache        = require('gulp-cache'),          // 图片缓存，只有图片替换了才压缩
    less         = require('gulp-less'),           // less文件编译
    sass         = require('gulp-sass'),           // sass文件编译
    watch        = require('gulp-watch');          // 文件监听

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
            gulpPath + '/sass/**/*.{scss,sass}',
            '!' + gulpPath + '/sass/**/*_un.{scss,sass}'     // 不编译
        ],
        images: [
            gulpSrc + '/images/**/**',
            '!' + gulpSrc + '/images/**/*.psd'         // 不编译
        ],
        js    : gulpSrc + '/js/**/*.js'
    },
    dist: {
        css   : gulpDist + '/css',
        images: gulpDist + '/images',
        js    : gulpDist + '/js'
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

// 编译sass,scss文件
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
        .pipe(uglify())
        .pipe(gulp.dest(gulpPath.dist.js))
        .pipe(notify({message: 'scripts 文件有更改!'}));
});

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

});

// 默认任务
gulp.task('default', ['watch','less','sass','images', 'script']);