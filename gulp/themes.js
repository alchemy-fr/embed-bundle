"use strict";
var gulp = require('gulp');
var path = require('path');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var importCss = require('gulp-import-css');
var sass = require('gulp-sass');
var conf = require('./conf.js');
var fs = require('fs');

gulp.task('themes', function () {
    var sassOptions = {
        outputStyle: 'compressed',
        includePaths: [
            path.join(conf.paths.src ,'themes/') //shared across themes
        ]
    };

    var themeDistPath = path.join(conf.paths.dist, 'theme/' );


    var themeSource = path.join(conf.paths.baseClientConfig, '/theme/main.scss');
    if( conf.checkClientConfigPath()) {
        themeSource = path.join(conf.paths.useClientConfig, '/theme/main.scss');
    }

    return gulp.src([themeSource])
        .pipe(sourcemaps.init())
        .pipe(sass(sassOptions)).on('error', conf.errorHandler('Sass')) // sass.logError
        .pipe(autoprefixer()).on('error', conf.errorHandler('Autoprefixer'))
        .pipe(concat('main.css'))
        .pipe(importCss())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(themeDistPath));
});
