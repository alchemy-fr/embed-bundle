var gulp = require('gulp');
var path = require('path');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var importCss = require('gulp-import-css');
var sass = require('gulp-sass');
var conf = require('../../conf.js');
// node_modules/pdfjs-dist/web/compatibility.js
gulp.task('deploy-pdfjs-skin', function (done) {
    var sassOptions = {
        outputStyle: 'compressed'
    };
    gulp.src([
            path.join(conf.paths.src, 'components/players/document/pdfjs/styles/main.scss')
        ])
        .pipe(sourcemaps.init())
        .pipe(sass(sassOptions)).on('error', conf.errorHandler('Sass')) // sass.logError
        .pipe(autoprefixer()).on('error', conf.errorHandler('Autoprefixer'))
        .pipe(concat('pdfjs.css'))
        .pipe(importCss())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.join(conf.paths.dist, 'players/pdfjs/skin')))
        .on('end', done);
});

gulp.task('deploy-pdfjs-assets', function() {
    var extVendors = [
        // node_modules/pdfjs-dist/web/images
        path.join('./node_modules', 'pdfjs-dist', 'web', 'images', '**/*')
    ];
    return gulp.src(extVendors)
        .pipe(gulp.dest(path.join(conf.paths.dist, 'players/pdfjs/skin/images')))
        //.pipe(gulp.dest(path.join(conf.paths.dist, 'players/pdfjs')))
});

gulp.task('deploy-pdfjs-toolbar-assets', function() {
    var extVendors = [
        path.join('./resources', 'components', 'players', 'document', 'pdfjs', 'toolbar-images', '**/*')
    ];
    return gulp.src(extVendors)
        .pipe(gulp.dest(path.join(conf.paths.dist, 'players/pdfjs/toolbar-images')))
});

gulp.task('deploy-pdfjs-localization', function() {
    var extVendors = [
        path.join('./resources', 'components', 'players', 'document', 'pdfjs', 'l10n', '**/*')
    ];
    return gulp.src(extVendors)
        .pipe(gulp.dest(path.join(conf.paths.dist, 'players/pdfjs/l10n')))
});

gulp.task('watch-pdfjs-css', function() {
    return gulp.watch(path.join(conf.paths.src, 'components/players/document/pdfjs/styles/**/*.scss'), ['deploy-pdfjs-skin']);
});

gulp.task('deploy-pdfjs', function() {
    gulp.start('deploy-pdfjs-localization');
    gulp.start('deploy-pdfjs-assets');
    gulp.start('deploy-pdfjs-toolbar-assets');
    gulp.start('deploy-pdfjs-skin');
});
