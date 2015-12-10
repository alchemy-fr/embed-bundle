/// <reference path="../../../../embed/embed.d.ts" />
/**
 * VideoJS Player for Embed Audio
 */

require('html5shiv');
(<any>window).HELP_IMPROVE_VIDEOJS = false;
let videojs = require('../../../../../node_modules/video.js/dist/video.js');

import * as $ from 'jquery';
import * as _ from 'underscore';
import ConfigService from '../../../embed/config/service';
import ResizeEl from '../../../utils/resizeEl';
let playerTemplate:any = require('./player.html');

export default class AudioPlayer {
    private configService;
    private resourceOriginalWidth;
    private resourceOriginalHeight;
    private $embedContainer;
    private $embedResource;
    private resizer;
    private $videoContainer;
    constructor() {
        this.configService = new ConfigService();

        $(document).ready(() => {
            this.$videoContainer =  $('.audio-player');
            this.$videoContainer.append(playerTemplate( this.configService.get('resource') ));

            this.$embedContainer = $('#embed-content');
            this.$embedResource = $('#embed-audio');
            this.resourceOriginalWidth = this.configService.get('resource.width');
            this.resourceOriginalHeight = this.configService.get('resource.height');

            this.resizer = new ResizeEl({
                target: this.$embedResource,
                container: this.$embedContainer,
                resizeOnWindowChange: this.configService.get('resource.fitIn') === true ? true : false,
                resizeCallback: (dimensions) => {
                    this.$embedContainer.find('> div').css({width: dimensions.width, height: dimensions.height});
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

            this.setupVideo();
        });
    }

    setupVideo() {
        let aspectRatio = this.configService.get('resource.aspectRatio'),
            options: VideoJSOptions = {
            fluid: true,
            inactivityTimeout: 0 // force control to be alway active
        };

        if( this.configService.get('resource.aspectRatio') !== null ) {
            options.aspectRatio = this.configService.get('resource.aspectRatio');
        }

        if( this.configService.get('resource.autoplay') !== null ) {
            options.autoplay = this.configService.get('resource.autoplay');
        }

        /*if( this.configService.get('resource.playbackRates') !== null ) {
            options.playbackRates = this.configService.get('resource.playbackRates');
        }*/

        options.techOrder = ['html5', 'flash'];
        (<any>options).flash = {
            swf: '/assets/vendors/alchemy-embed-medias/players/videojs/video-js.swf'
        };

        let player: VideoJSPlayer = this.initVideo('embed-audio', options, function() {
            // if( this.configService.get('resource.autoplay') === true) {
            // this.play();
            // }
            // this.on('ended', function() {});
        });
    }
    initVideo(...args): VideoJSPlayer {
        return (<any>videojs).apply(this, args);
    }
}
(<any>window).embedPlugin = new AudioPlayer();
