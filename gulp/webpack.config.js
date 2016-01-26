var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var BowerWebpackPlugin = require('bower-webpack-plugin');
var conf = require('./conf.js');

module.exports = {
    cache: true,
    entry: {
        image: conf.paths.src + '/embed/image.ts',
        video_videojs: conf.paths.src + '/components/players/video/videojs/player.ts',
        video_flowplayer: conf.paths.src + '/components/players/video/flowplayer/player.ts',
        audio_videojs: conf.paths.src + '/components/players/audio/videojs/player.ts',
        document_flexpaper: conf.paths.src + '/components/players/document/flexpaper/player.ts',
        document_pdfjs: conf.paths.src + '/components/players/document/pdfjs/player.ts',
        common: ['underscore']
    },
    output: {
        path: conf.paths.dist,
        /**
         * May have to override publicPath value:
         * https://github.com/webpack/docs/wiki/configuration#outputpublicpath
         * PDFjs worker need it
         */
        publicPath: "/assets/vendors/alchemy-embed-medias/",
        filename: "[name].js",
        chunkFilename: "[chunkhash].js"
    },
    module: {
        loaders: [
            /* PDFjs loader configuration */
            {
                test: /\.pdf$|pdf\.worker\.js$/,
                loader: "url-loader?limit=10000"
            },
            { test: /\.html$/, loader: "underscore-template-loader" },
            {test: /\.css$/, loader: "style!css"},
            { test: /\.ts(x?)$/, exclude: /node_modules/, loader: 'babel-loader?loose[]=all!ts-loader' }
        ]
    },
    ts: {
        compiler: 'typescript'
    },
    externals: {
        // jquery: 'jQuery',
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
        }),
        new webpack.ProvidePlugin({
            _: "underscore",
            "videojs": "video.js",
            "window.videojs": "video.js"
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'common',
            // minChunks: Infinity,
            filename: 'common.js'
        })
    ]
};