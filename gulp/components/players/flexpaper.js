var gulp = require('gulp');
var path = require('path');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var importCss = require('gulp-import-css');
var sass = require('gulp-sass');
var conf = require('../../conf.js');

gulp.task('deploy-flexpaper-skin', function (done) {
    var sassOptions = {
        outputStyle: 'compressed'
    };
    gulp.src([
            path.join(conf.paths.src, 'components/players/document/flexpaper/styles/main.scss')
        ])
        .pipe(sourcemaps.init())
        .pipe(sass(sassOptions)).on('error', conf.errorHandler('Sass')) // sass.logError
        .pipe(autoprefixer()).on('error', conf.errorHandler('Autoprefixer'))
        .pipe(concat('flexpaper.css'))
        .pipe(importCss())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.join(conf.paths.dist, 'players/flexpaper/skin')))
        .on('end', done);
});

gulp.task('deploy-flexpaper-assets', function() {
    var extVendors = [
        path.join('./resources', 'components', 'players', 'document', 'flexpaper', 'FlexPaperViewer.swf')
    ];
    return gulp.src(extVendors)
        .pipe(gulp.dest(path.join(conf.paths.dist, 'players/flexpaper')))
});

gulp.task('watch-flexpaper-css', function() {
    return gulp.watch(path.join(conf.paths.src, 'components/players/document/flexpaper/styles/**/*.scss'), ['deploy-flexpaper-skin']);
});

gulp.task('deploy-flexpaper', function() {
    gulp.start('deploy-flexpaper-assets');
    gulp.start('deploy-flexpaper-skin');
});