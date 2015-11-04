var gulp = require('gulp');
var path = require('path');
var uglify = require('gulp-uglify');
var minifyCss = require('gulp-minify-css');
var conf = require('./conf.js');

gulp.task('deploy:styles-dev', ['styles'], function(){
    gulp.start('deploy:copy-styles-dev');
});

gulp.task('deploy:copy-styles-dev', function(){
    return gulp.src([path.join(conf.paths.tmp, '/**/*.css')])
        .pipe(gulp.dest(path.join(conf.paths.dist)))
});
gulp.task('deploy:copy-styles', function(){
    return gulp.src([path.join(conf.paths.tmp, '/**/*.css')])
        .pipe(minifyCss({compatibility: 'ie8'}))
        .pipe(gulp.dest(path.join(conf.paths.dist)))
});



gulp.task('deploy:minify:vendors', function() {
    var extVendors = [
        path.join('./bower_components', 'modernizr', 'modernizr.js')
    ];
    return gulp.src(extVendors)
        .pipe(uglify())
        .pipe(gulp.dest(path.join(conf.paths.dist, 'lib')))
});
gulp.task('deploy:external-vendors', ['deploy:minify:vendors'],function() {
    var extVendors = [
        path.join('./node_modules', 'jquery', 'dist', 'jquery.min.js'),
        path.join('./node_modules', 'respond.js', 'dest', 'respond.min.js'),
        path.join('./node_modules', 'es5-shim','es5-shim.min.js'),
        path.join('./node_modules', 'video.js', 'dist', 'video-js.swf')
    ];
    return gulp.src(extVendors)
        .pipe(gulp.dest(path.join(conf.paths.dist, 'lib')))
});
gulp.task('deploy:assets', function() {
    return gulp.src([path.join(conf.paths.src, 'pluginView/assets/**/*')])
        // .pipe(debug({title: 'deploy asset:'}))
        .pipe(gulp.dest(path.join(conf.paths.dist, 'assets')))
});