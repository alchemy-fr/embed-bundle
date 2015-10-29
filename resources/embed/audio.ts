/**
 * Entry point for Embed Audio
 */

/// <reference path="./embed.d.ts" />
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
    private resourceId;
    constructor() {
        this.resourceId = 'embed-audio';
        this.configService = new ConfigService();

        $(document).ready(() => {
            this.$embedContainer = $('#embed-content');
            this.$embedResource = $('#' + this.resourceId);
            this.resourceOriginalWidth = this.configService.get('resource.width');
            this.resourceOriginalHeight = this.configService.get('resource.height');



            this.resizer = new ResizeEl({
                target: this.$embedResource,
                container: this.$embedContainer,
                resizeOnWindowChange: this.configService.get('resource.fitIn') === true , true : false,
                resizeCallback: (dimensions) => {
                    console.log('has been resized', dimensions);

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

        console.log('video init with', options);

        let player: VideoJSPlayer = this.initVideo(this.resourceId, options, function() {
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
