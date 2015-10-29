var gulp = require('gulp');
var path = require('path');
var del = require('del');
var conf = require('./conf.js');

gulp.task('clean:tmp', function(done){
    del([path.join(conf.paths.tmp, '/**/*')], done);
});

/**
 * Direct tasks:
 */
gulp.task('watchOverall', ['clean:tmp'], function () {
    if( conf.checkDistPath() === false ) {
        return;
    }
    gulp.start('watchin');

});

gulp.task('build', ['clean:tmp'], function () {
    if( conf.checkDistPath() === false ) {
        return;
    }
    gulp.start('webpack:build');
    gulp.start('deploy:copy-styles');
    gulp.start('deploy:assets');
    gulp.start('deploy:external-vendors');
    gulp.start('themes');

});
gulp.task('build-dev', ['clean:tmp'], function () {
    if( conf.checkDistPath() === false ) {
        return;
    }
    gulp.start('webpack:build-dev');
    gulp.start('deploy:copy-styles-dev');
    gulp.start('deploy:assets');
    gulp.start('deploy:external-vendors');
    gulp.start('themes');

});


gulp.task('default', ['watchOverall']);