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

gulp.task('deploy-vendors', [
    'deploy-videojs',
    'deploy-flowplayer',
    'deploy-flexpaper',
    'deploy-pdfjs',
], function() {});
