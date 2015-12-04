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

/*gulp.task('deploy:player:flowplayer', function() {
    var extVendors = [
        path.join('./node_modules', 'flowplayer', 'dist', 'flowplayer.swf'),
        path.join('./node_modules', 'flowplayer', 'dist', 'flowplayerhls.swf')
    ];
    return gulp.src(extVendors)
        .pipe(gulp.dest(path.join(conf.paths.dist, 'players/flowplayer')))
});

gulp.task('deploy:player:videojs', function() {
    return gulp.src(path.join('./node_modules', 'video.js', 'dist', 'video-js.swf'))
        .pipe(gulp.dest(path.join(conf.paths.dist, 'players/videojs')))
});

gulp.task('deploy:external-vendors', function() {
    gulp.start('deploy:player:flowplayer');
    return gulp.start('deploy:player:videojs')
});*/

gulp.task('deploy-vendors', ['deploy-videojs', 'deploy-flowplayer'], function() {
    /*return gulp.src([path.join(conf.paths.src, 'pluginView/assets/!**!/!*')])
        // .pipe(debug({title: 'deploy asset:'}))
        .pipe(gulp.dest(path.join(conf.paths.dist, 'assets')))*/
});