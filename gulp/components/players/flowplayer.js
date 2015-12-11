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

gulp.task('deploy-flowplayer-skin-assets', function() {
    var extVendors = [
        path.join('./node_modules', 'flowplayer', 'dist', 'skin', '**/!(*.js|*.map|*.css|*.html)'),
        // path.join('./node_modules', 'flowplayer', 'dist', 'skin', 'img/*'),
    ];
    return gulp.src(extVendors)
        .pipe(gulp.dest(path.join(conf.paths.dist, 'players/flowplayer/skin')))
});
gulp.task('deploy-flowplayer-skin', ['deploy-flowplayer-skin-assets'], function (done) {
    var sassOptions = {
        outputStyle: 'compressed'
    };
    gulp.src([
            path.join(conf.paths.src, 'components/players/video/flowplayer/styles/main.scss')
        ])
        .pipe(sourcemaps.init())
        .pipe(sass(sassOptions)).on('error', conf.errorHandler('Sass')) // sass.logError
        .pipe(autoprefixer()).on('error', conf.errorHandler('Autoprefixer'))
        .pipe(concat('flowplayer.css'))
        .pipe(importCss())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.join(conf.paths.dist, 'players/flowplayer/skin')))
        .on('end', done);
});



gulp.task('deploy-flowplayer-assets', function() {
    var extVendors = [
        path.join('./node_modules', 'flowplayer', 'dist', 'flowplayer.swf'),
        path.join('./node_modules', 'flowplayer', 'dist', 'flowplayerhls.swf')
    ];
    return gulp.src(extVendors)
        .pipe(gulp.dest(path.join(conf.paths.dist, 'players/flowplayer')))
});

gulp.task('watch-flowplayer-css', function() {
    return gulp.watch(path.join(conf.paths.src, 'components/players/video/flowplayer/styles/**/*.scss'), ['deploy-flowplayer-skin']);
});

gulp.task('deploy-flowplayer', function() {
    gulp.start('deploy-flowplayer-assets');
    gulp.start('deploy-flowplayer-skin');
});