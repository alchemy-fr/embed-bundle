var path = require('path');
var webpack = require('webpack');
var conf = require('./conf.js');

module.exports = {
    cache: true,
    entry: {
        'pdf.worker': `./node_modules/pdfjs-dist/build/pdf.worker.js`, // for the pdfjsLib.GlobalWorkerOptions.workerSrc
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
        rules: [
            /* PDFjs loader configuration */
            {
                test: /\.pdf$/,
                loader: "url-loader",
                options: {
                    limit: 10000
                }
            },
            {
                test: /\.html$/,
                loader: "underscore-template-loader"
            },
            {
                test: /\.css$/,
                use: [
                    "style-loader",
                    "css-loader"
                ]
            },
            {
                test: /\.ts(x?)$/,
                exclude: /node_modules/,
                use: ["babel-loader", "ts-loader"]
            }
        ]
    },
    externals: {
        // jquery: 'jQuery',
        modernizr: 'Modernizr'
    },
    resolve: {
        extensions: ['*', '.webpack.js', '.web.js', '.ts', '.tsx', '.js'],
        modules: ['node_modules',],
        // root: ['node_modules', 'app/bower_components'],
        alias: {
            // replace underscore with lodash:
            // 'underscore': 'lodash'
        }
    },
    plugins: [
        new webpack.ProvidePlugin({
            _: "underscore",
            "videojs": "video.js",
            "window.videojs": "video.js"
        })
        // ,
        // new webpack.optimize.CommonsChunkPlugin({
        //     name: 'common',
        //     // minChunks: Infinity,
        //     filename: 'common.js'
        // })
    ]
};