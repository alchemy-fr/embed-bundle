/// <reference path="./embed.d.ts" />
/**
 * Entry point for Embed Videos
 */

require('html5shiv');
(<any>window).HELP_IMPROVE_VIDEOJS = false;
let videojs = require('../../node_modules/video.js/dist/video.js');

import * as $ from 'jquery';
import * as _ from 'underscore';
import ConfigService from '../components/embed/config/service';
import ResizeEl from '../components/utils/resizeEl';

export default class Embed {
    private configService;
    private resourceOriginalWidth;
    private resourceOriginalHeight;
    private $embedContainer;
    private $embedResource;
    private resizer;
    constructor() {
        this.configService = new ConfigService();

        $(document).ready(() => {
            this.$embedContainer = $('#embed-content');
            this.$embedResource = $('#embed-video');
            this.resourceOriginalWidth = this.configService.get('resource.width');
            this.resourceOriginalHeight = this.configService.get('resource.height');



            this.resizer = new ResizeEl({
                target: this.$embedResource,
                container: this.$embedContainer,
                resizeOnWindowChange: this.configService.get('resource.fitIn') === true , true : false,
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
                fluid: true
            };

        if( this.configService.get('resource.aspectRatio') !== null ) {
            options.aspectRatio = this.configService.get('resource.aspectRatio');
        }

        options.techOrder = ['html5', 'flash'];
        (<any>options).flash = {
            swf: '/assets/embed/lib/video-js.swf'
        };

        let player: VideoJSPlayer = this.initVideo('embed-video', options, function() {
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
(<any>window).embedPlugin = new Embed();
