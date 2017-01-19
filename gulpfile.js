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
    concat       = require('gulp-concat'),         // 合并js文件
    cache        = require('gulp-cache'),          // 图片缓存，只有图片替换了才压缩
    less         = require('gulp-less'),           // less文件编译
    sass         = require('gulp-sass'),           // sass文件编译
    babel        = require('gulp-babel'),          // 编译ES6语法
    watch        = require('gulp-watch'),          // 文件监听
    livereload   = require('gulp-livereload');     // 自动刷新页面

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
