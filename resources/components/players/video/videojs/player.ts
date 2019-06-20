/// <reference path="../../../../embed/embed.d.ts" />
/**
 * VideoJS Player for Embed Videos
 */

// require('html5shiv');
(<any>window).HELP_IMPROVE_VIDEOJS = false;
let videojs = require('../../../../../node_modules/video.js/dist/video.js');


import * as _ from 'underscore';
import ConfigService from '../../../embed/config/service';
import ResizeEl from '../../../utils/resizeEl';
let playerTemplate:any = require('./player.html');
let pym = require('pym.js');

export default class VideoPlayer {
    private configService;
    private resourceOriginalWidth;
    private resourceOriginalHeight;
    private $embedContainer;
    private $embedVideoResource;
    private $currentTime;
    private resizer;
    private $playerContainer;
    private pymChild;
    constructor() {
        let that = this;
        this.configService = new ConfigService();

        let videoContainers =  document.getElementsByClassName('video-player'); //$('.video-player');
        this.$playerContainer = videoContainers[0];
        this.$playerContainer.insertAdjacentHTML('afterbegin', playerTemplate( this.configService.get('resource') ));

        this.$embedContainer = document.getElementById('embed-content'); //$('#embed-content');
        this.$embedVideoResource = document.getElementById('embed-video'); //$('#embed-video');

        this.$currentTime = this.configService.get('resource.currentTime'); // current time to start video

        this.resourceOriginalWidth = this.configService.get('resource.width');
        this.resourceOriginalHeight = this.configService.get('resource.height');

        /*add resizer*/
        this.resizer = new ResizeEl({
            target: this.$embedContainer, // don't target video directly to allow fullscreen
            container: this.$embedContainer,
            resizeOnWindowChange: this.configService.get('resource.fitIn') === true ? true : false,
            resizeCallback: (dimensions) => {
                this.$playerContainer.style.width = dimensions.width + 'px';
                this.$playerContainer.style.height = dimensions.height + 'px';
            }
        });

        if( this.configService.get('isStandalone') === true ) {
            this.initResizer();
        } else {
            this.pymChild = new (<any>pym).Child({id: 'phraseanet-embed-frame', renderCallback: function(windowWidth) {
                //let ratio = that.resourceOriginalHeight / that.resourceOriginalWidth;
                // send video calculated height
                //that.$embedContainer.style.height = windowWidth * ratio + 'px';
            }});
            window.addEventListener('resize', _.debounce(() => {
                if (this.pymChild !== undefined) {
                    this.pymChild.sendHeight()
                }
            }, 200), false);

            if (this.pymChild.parentUrl === '') {
                // no parent pym:
                this.initResizer();
            }
        }

        this.setupVideo();
    }

    initResizer() {
        this.resizer = new ResizeEl({
            target: this.$embedContainer, // don't target video directly to allow fullscreen
            container: this.$embedContainer,
            resizeOnWindowChange: this.configService.get('resource.fitIn') === true ? true : false,
            resizeCallback: (dimensions) => {
                this.$playerContainer.style.width = dimensions.width + 'px';
                this.$playerContainer.style.height = dimensions.height + 'px';
            }
        });
        this.resizer.setContainerDimensions({
            width:  <any>window.innerWidth,
            height: <any>window.innerHeight
        });
        this.resizer.setTargetDimensions({
            width:  this.resourceOriginalWidth,
            height: this.resourceOriginalHeight
        });

        this.resizer.resize();

    }

    setupVideo() {
        let aspectRatio = this.configService.get('resource.aspectRatio'),
            options: VideoJSOptions = {
            playbackRates: [],
            fluid: true
        };

        if( this.configService.get('resource.aspectRatio') !== null ) {
            options.aspectRatio = this.configService.get('resource.aspectRatio');
        }

        if( this.configService.get('resource.autoplay') !== null ) {
            options.autoplay = this.configService.get('resource.autoplay');
        }

        if( this.configService.get('resource.playbackRates') !== null ) {
            options.playbackRates = this.configService.get('resource.playbackRates');
        }

        options.techOrder = ['flash', 'html5' ];

        (<any>options).flash = {
            swf: '/assets/vendors/alchemy-embed-medias/players/videojs/video-js.swf'
        };

        let chapterTrack = null,
            tracks = this.configService.get('resource.tracks')
            if( tracks !== null ) {
                // search for chapter track:
                _.each(tracks, (track, i) => {
                    if( (<any>track).kind === 'chapters') {
                        chapterTrack = track;
                    }
                });
            }

        let player: VideoJSPlayer = this.initVideo('embed-video', options, () => {

            let metadatas = player.on('loadedmetadata', () => {

                let videoWidth = this.$embedVideoResource.videoWidth,
                    videoHeight = this.$embedVideoResource.videoHeight;

                if (videoWidth > 0 && videoHeight > 0) {
                    if( this.resizer !== null ) {
                        this.resizer.setTargetDimensions({
                            width: videoWidth,
                            height: videoHeight
                        });
                       /* this.resizer.resize();*/
                    }
                    /*set currentTime to play video */
                    if( this.$currentTime !== null ) {
                        player.currentTime(parseInt(this.$currentTime));

                    }
                }
            });

            player.on('ready', () => {
                if( this.pymChild !== undefined ) {
                    this.pymChild.sendMessage('childReady', {type: 'video'});
                }
            });

        });

        if( chapterTrack !== null ) {
            (<any>player).ready(function() {
                (<any>player).addRemoteTextTrack(chapterTrack);
            });
        }

        if( this.pymChild !== undefined ) {

            if (this.pymChild.parentUrl !== '') {
                // listen for parent events:
                // note: message are never received if there no message content with the subject
                this.pymChild.onMessage('play', () => {
                    player.play();
                });

                this.pymChild.onMessage('pause', () => {
                    player.pause();
                });

                this.pymChild.onMessage('dispose', () => {
                    player.dispose();
                });
            }
        }
    }

    initVideo(...args): VideoJSPlayer {
        return (<any>videojs).apply(this, args);
    }
}
(<any>window).embedPlugin = new VideoPlayer();
