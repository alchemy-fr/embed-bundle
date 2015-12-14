"use strict";
var gulp = require('gulp');
var path = require('path');
var conf = require('./conf.js');

gulp.task('watch', ['webpack:build-dev'], function () {
    gulp.start('watch-pdfjs-css');
    gulp.start('watch-videojs-css');
    gulp.start('watch-flowplayer-css');
    gulp.start('watch-flexpaper-css');
    gulp.watch([path.join(conf.paths.src, '/**/*.scss'), path.join('!'+conf.paths.src, 'themes/**/*')], function() {
        gulp.start('deploy:styles-dev');
    });
    gulp.watch([path.join(conf.paths.src, '/**/*.{!scss,html,hbs,ts}') , path.join('!'+conf.paths.src, 'themes/**/*')], function() {
        gulp.start('webpack:build-dev');
    });
    gulp.watch([path.join(conf.paths.src, 'themes/**/*')], function() {
        gulp.start('themes');
    });
});
