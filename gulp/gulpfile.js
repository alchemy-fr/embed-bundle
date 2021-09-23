var gulp = require('gulp');
var path = require('path');
var del = require('del');
var conf = require('./conf.js');
var gutil = require("gulp-util");

gulp.task('clean:tmp', function(done){
    del([path.join(conf.paths.tmp, '/**/*')], done);
});

/**
 * Direct tasks:
 */
gulp.task('watchOverall', ['clean:tmp'], function () {
    gulp.start('watch');

});
gulp.task('deploy', function () {
    gulp.start('build');
});
gulp.task('build', ['clean:tmp'], function () {
    gulp.start('webpack:build');
    gulp.start('deploy:copy-styles');
    //gulp.start('deploy:assets');
    gulp.start('deploy-vendors');
    gulp.start('themes');

});
gulp.task('build-dev', ['clean:tmp'], function () {
    gulp.start('webpack:build-dev');
    gulp.start('deploy:copy-styles-dev');
    //gulp.start('deploy:assets');
    gulp.start('deploy-vendors');
    gulp.start('themes');

});


gulp.task('default', ['watchOverall']);
