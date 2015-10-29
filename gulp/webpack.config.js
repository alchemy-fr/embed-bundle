var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var BowerWebpackPlugin = require('bower-webpack-plugin');
var conf = require('./conf.js');

module.exports = {
    cache: true,
    entry: {
        image: conf.paths.src + '/embed/image.ts',
        document: conf.paths.src + '/embed/document.ts',
        video: conf.paths.src + '/embed/video.ts',
        audio: conf.paths.src + '/embed/audio.ts',
        common: ['jquery', 'underscore', 'html5shiv'],
    },
    output: {
        path: conf.paths.dist,
        publicPath: "/assets/embed/",
        filename: "[name].js",
        chunkFilename: "[chunkhash].js"
    },
    module: {
        loaders: [
            {
                test: /imageloaded/,
                loader: 'imports?define=>false&this=>window'
            },
            {
                test: /\.html/,
                loader: "handlebars-loader" // ?helperDirs[]=" + __dirname + "/resources/hbsHelpers > webpack will
                // throw error > https://github.com/altano/handlebars-loader/issues/41
            },
            {test: /\.css$/, loader: "style!css"},
            { test: /\.ts(x?)$/, exclude: /node_modules/, loader: 'babel-loader?loose[]=all!ts-loader' }
        ]
    },
    ts: {
        compiler: 'typescript'
    },
    externals: {
        jquery: 'jQuery',
        modernizr: 'Modernizr'
    },
    resolve: {
        extensions: ['', '.webpack.js', '.web.js', '.ts', '.tsx', '.js'],
        modulesDirectories: ['node_modules', 'bower_components'],
        // root: ['node_modules', 'app/bower_components'],
        alias: {
            // replace underscore with lodash:
            // 'underscore': 'lodash'
        }
    },
    plugins: [
        new BowerWebpackPlugin({
            modulesDirectories: ['bower_components'],
            manifestFiles:      'bower.json',
            includes:           /.*/,
            excludes:           /.*\.scss/, // assume all css will be handled by themes
            searchResolveModulesDirectories: true
        }),/*new webpack.ResolverPlugin(
            new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin("bower.json", ["main"])
        ),*/
        /*new ExtractTextPlugin('[name].css',{
         allChunks: true
         }),*/
        // new webpack.ContextReplacementPlugin(/moment[\/\\]locale/, /en|fr$/),
        // new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en-gb|fr$/),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'common',
            // minChunks: Infinity,
            filename: 'common.js'
        })
    ]
};