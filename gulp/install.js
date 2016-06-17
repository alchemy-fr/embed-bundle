var gulp = require('gulp');
var install = require('gulp-install');

gulp.task('install-bower-dependencies', function(){
    return gulp.src(['./bower.json'])
        .pipe(install());
});

gulp.task('install', ['install-bower-dependencies'], function(){
    gulp.start('build');
});

