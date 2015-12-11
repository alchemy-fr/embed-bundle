var gulp = require('gulp');
var path = require('path');
var uglify = require('gulp-uglify');
var minifyCss = require('gulp-minify-css');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var importCss = require('gulp-import-css');
var sass = require('gulp-sass');
var conf = require('../../conf.js');

gulp.task('deploy-videojs-skin-assets', function() {
    var extVendors = [
        path.join('./node_modules', 'video.js', 'dist', 'font', '**/*')
    ];
    return gulp.src(extVendors)
        .pipe(gulp.dest(path.join(conf.paths.dist, 'players/videojs/skin/font')))
});

gulp.task('deploy-videojs-skin', ['deploy-videojs-skin-assets'], function (done) {
    var sassOptions = {
        outputStyle: 'compressed'
    };
    gulp.src([
            path.join(conf.paths.src, 'components/players/video/videojs/styles/main.scss')
        ])
        .pipe(sourcemaps.init())
        .pipe(sass(sassOptions)).on('error', conf.errorHandler('Sass')) // sass.logError
        .pipe(autoprefixer()).on('error', conf.errorHandler('Autoprefixer'))
        .pipe(concat('videojs.css'))
        .pipe(importCss())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.join(conf.paths.dist, 'players/videojs/skin')))
        .on('end', done);
});

gulp.task('deploy-videojs-assets', function() {
    var extVendors = [
        path.join('./node_modules', 'video.js', 'dist', 'video-js.swf'),
        path.join('./node_modules', 'video.js', 'dist', 'ie8', 'videojs-ie8.js')
    ];
    return gulp.src(extVendors)
        .pipe(gulp.dest(path.join(conf.paths.dist, 'players/videojs')))
});

gulp.task('watch-videojs-css', function() {
    return gulp.watch(path.join(conf.paths.src, 'components/players/video/videojs/styles/**/*.scss'), ['deploy-videojs-skin']);
});

gulp.task('deploy-videojs', function() {
    gulp.start('deploy-videojs-assets');
    gulp.start('deploy-videojs-skin');
});