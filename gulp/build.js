var gulp = require('gulp');
var path = require('path');
var gutil = require("gulp-util");
var webpack = require('webpack');
var webpackConfig = require("./webpack.config.js");
var conf = require('./conf.js');

gulp.task('hbs-tpl', function(){
    return gulp.src([path.join(conf.paths.src, '/**/*.{html,hbs}')])
        // .pipe(debug({title: 'file:'}))
        .pipe(gulp.dest(path.join(conf.paths.tmp)))
});


gulp.task('webpack:build', ['styles', 'hbs-tpl'], function(callback) {
    gulp.start('deploy:copy-styles');
    // modify some webpack config options
    var myConfig = Object.create(webpackConfig);
    // myConfig.plugins = myConfig.plugins.concat(
    //     new webpack.optimize.UglifyJsPlugin({
    //         compress: {
    //             drop_console: true,
    //             warnings: false
    //         }
    //     })
    // );
    // myConfig.output.filename = 'build.min.js';

    // run webpack
    webpack(myConfig, function(err, stats) {
        if(err) {
            throw new gutil.PluginError("webpack:build", err);
        }
        gutil.log("[webpack:build]", stats.toString({
            colors: true
        }));
        callback();
    });
});

gulp.task('webpack:build-dev', [
    'styles',
    'hbs-tpl',
    'themes'
], function(callback) {
    var devConfig = Object.create(webpackConfig);
    devConfig.devtool = "source-map";
    // create a single instance of the compiler to allow caching
    var devCompiler = webpack(devConfig);

    gulp.start('deploy:copy-styles-dev');
    // run webpack
    devCompiler.run(function(err, stats) {
        if(err) throw new gutil.PluginError("webpack:build-dev", err);
        gutil.log("[webpack:build-dev]", stats.toString({
            colors: true
        }));
        callback();
    });
});
