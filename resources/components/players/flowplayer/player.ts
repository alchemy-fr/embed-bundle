/// <reference path="../../../embed/embed.d.ts" />
/**
 * Entry point for Embed Videos
 */

require('html5shiv');
(<any>window).HELP_IMPROVE_VIDEOJS = false;
let flowplayer = require('../../../../node_modules/flowplayer/dist/flowplayer.js');

import * as $ from 'jquery';
import * as _ from 'underscore';
import ConfigService from '../../embed/config/service';
import ResizeEl from '../../utils/resizeEl';
let playerTemplate:any = require('./player.html');

export default class VideoPlayer {
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
            this.$videoContainer =  $('.video-player');
            this.$videoContainer.append(playerTemplate( this.configService.get('resource') ));

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

        let player = this.initVideo($('.flowplayer')[0], {
            clip: {
                sources: this.configService.get('resource.sources')
            }
        });
    }
    initVideo(...args) {
        return (<any>flowplayer).apply(this, args);
    }
}
(<any>window).embedPlugin = new VideoPlayer();
