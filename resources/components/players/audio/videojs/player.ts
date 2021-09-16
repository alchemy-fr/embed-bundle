/// <reference path="../../../../embed/embed.d.ts" />
/**
 * VideoJS Player for Embed Audio
 */

// require('html5shiv');
(<any>window).HELP_IMPROVE_VIDEOJS = false;
let videojs = require('../../../../../node_modules/video.js/dist/video.js');


import * as _ from 'underscore';
import ConfigService from '../../../embed/config/service';
import ResizeEl from '../../../utils/resizeEl';
let playerTemplate:any = require('./player.html');
let pym = require('pym.js');

export default class AudioPlayer {
    private configService;
    private resourceOriginalWidth;
    private resourceOriginalHeight;
    private $embedContainer;
    private $embedResource;
    //private resizer;
    private $playerContainer;
    private pymChild;
    constructor() {
        let that = this;
        this.configService = new ConfigService();

        let audioContainers =  document.getElementsByClassName('audio-player'); //$('.video-player');
        this.$playerContainer = audioContainers[0];
        this.$playerContainer.insertAdjacentHTML('afterbegin', playerTemplate( this.configService.get('resource') ));

        this.$embedContainer = document.getElementById('embed-content');
        this.$embedResource = document.getElementById('embed-audio');
        this.resourceOriginalWidth = this.configService.get('resource.width');
        this.resourceOriginalHeight = this.configService.get('resource.height');

        if( this.configService.get('isStandalone') === true ) {
           // this.initResizer();
        } else {
            this.pymChild = new (<any>pym).Child({id: 'phraseanet-embed-frame', renderCallback: function(windowWidth) {
                //let ratio = that.resourceOriginalHeight / that.resourceOriginalWidth;
                // send video calculated height
                //that.$embedContainer.style.height = windowWidth * ratio + 'px';
                that.$embedContainer.style.height = '240px';
                that.$embedContainer.style.width = '240px';
            }});

            window.addEventListener('resize', _.debounce(() => {
                if (this.pymChild !== undefined) {
                    this.pymChild.sendHeight()
                }
            }, 200), false);

            /*if (this.pymChild.parentUrl === '') {
                // no parent pym:
                this.initResizer();
            }*/
        }

        this.setupVideo();
    }

/*    initResizer() {
        this.resizer = new ResizeEl({
            target: this.$embedResource,
            container: this.$embedContainer,
            resizeOnWindowChange: this.configService.get('resource.fitIn') === true ? true : false,
            resizeCallback: (dimensions) => {
                this.$playerContainer.style.width = dimensions.width + 'px';
                this.$playerContainer.style.height = dimensions.height + 'px';

                this.$playerContainer.firstChild.style.width = dimensions.width + 'px';
                this.$playerContainer.firstChild.style.height = dimensions.height + 'px';
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
    }*/

    setupVideo() {
        let aspectRatio = this.configService.get('resource.aspectRatio'),
            options: VideoJSOptions = {
            fluid: true,
            // inactivityTimeout: 0 // force control to be alway active
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
