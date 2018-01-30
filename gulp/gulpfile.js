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
    // ensure parent deploy path exists:
    if( conf.checkPath(conf.paths.deployParent) === false ) {
        gutil.log(gutil.colors.red('[ERROR]'), 'Deploy folder "'+conf.paths.deployParent+'" not found');
        return;
    }
    gulp.start('watch');

});
gulp.task('deploy', function () {
    gulp.start('build');
});
gulp.task('build', ['clean:tmp'], function () {
    if( conf.checkPath(conf.paths.deployParent) === false ) {
        gutil.log(gutil.colors.red('[ERROR]'), 'Deploy folder "'+conf.paths.deployParent+'" not found');
        return;
    }
    gulp.start('webpack:build');
    gulp.start('deploy:copy-styles');
    //gulp.start('deploy:assets');
    gulp.start('deploy-vendors');
    gulp.start('themes');

});
gulp.task('build-dev', ['clean:tmp'], function () {
    // if( conf.checkPath(conf.paths.deployParent) === false ) {
    //     gutil.log(gutil.colors.red('[ERROR]'), 'Deploy folder "'+conf.paths.deployParent+'" not found');
    //     return;
    // }
    gulp.start('webpack:build-dev');
    gulp.start('deploy:copy-styles-dev');
    //gulp.start('deploy:assets');
    gulp.start('deploy-vendors');
    gulp.start('themes');

});


gulp.task('default', ['watchOverall']);