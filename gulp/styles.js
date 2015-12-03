"use strict";
var gulp = require('gulp');
var path = require('path');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var importCss = require('gulp-import-css');
var sass = require('gulp-sass');
var conf = require('./conf.js');

gulp.task('styles', function (done) {
    var sassOptions = {
        outputStyle: 'compressed'
    };

    gulp.src([
        path.join(conf.paths.src, 'embed/embed.scss')
    ])
        .pipe(sourcemaps.init())
        .pipe(sass(sassOptions)).on('error', conf.errorHandler('Sass')) // sass.logError
        .pipe(autoprefixer()).on('error', conf.errorHandler('Autoprefixer'))
        .pipe(concat('embed.css'))
        .pipe(importCss())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.join(conf.paths.tmp)))
        .on('end', done);
});

