/// <reference path="../../../../embed/embed.d.ts" />
/**
 * FlowPlayer Player for Embed Videos
 */

// require('html5shiv');
(<any>window).HELP_IMPROVE_VIDEOJS = false;
let flowplayer = require('../../../../../node_modules/flowplayer/dist/flowplayer.js');

import * as _ from 'underscore';
import ConfigService from '../../../embed/config/service';
import ResizeEl from '../../../utils/resizeEl';
let playerTemplate:any = require('./player.html');

interface IClipOrigSource {
    type: string;
    url: string;
}
interface IClipSource {
    type: string;
    src: string;
}/*
interface ISources {
    sources?: ClipSource[]
}*/
interface IFlowPlayerOptions {
    aspectRatio?: any;
    autoplay?: boolean;
    speeds?: number[];
    clip: any;
}

export default class VideoPlayer {
    private configService;
    private resourceOriginalWidth;
    private resourceOriginalHeight;
    private $embedContainer;
    private $embedVideoResource;
    private resizer;
    private $playerContainer;
    constructor() {
        this.configService = new ConfigService();

        let videoContainers =  document.getElementsByClassName('video-player');
        this.$playerContainer = videoContainers[0];
        this.$playerContainer.insertAdjacentHTML('afterbegin', playerTemplate( this.configService.get('resource') ));

        this.$embedContainer = document.getElementById('embed-content');
        this.$embedVideoResource = document.getElementById('embed-video');

        this.resourceOriginalWidth = this.configService.get('resource.width');
        this.resourceOriginalHeight = this.configService.get('resource.height');

        this.resizer = new ResizeEl({
            target: this.$embedVideoResource,
            container: this.$embedContainer,
            resizeOnWindowChange: this.configService.get('resource.fitIn') === true ? true : false,
            resizeCallback: (dimensions) => {
                // this.$embedContainer.firstChild.setAttribute('style', 'width: '+dimensions.width+'px; height: '+dimensions.height+'px');
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

    }

    setupVideo() {
        let aspectRatio = this.configService.get('resource.aspectRatio'),
            options: IFlowPlayerOptions = {
                clip: {
                    sources: []
                },
                // embed: false,
                // splash: this.configService.get('resource.coverUrl')
            };

        if( this.configService.get('resource.aspectRatio') !== null ) {
            options.aspectRatio = this.configService.get('resource.aspectRatio');
        }

        if( this.configService.get('resource.autoplay') !== null ) {
            options.autoplay = true; // this.configService.get('resource.autoplay');
        }

        if( this.configService.get('resource.playbackRates') !== null ) {
            options.speeds = this.configService.get('resource.playbackRates');
        }

        (<any>options).swf =  '/assets/vendors/alchemy-embed-medias/players/flowplayer/flowplayer.swf';
        (<any>options).swfHls =  '/assets/vendors/alchemy-embed-medias/players/flowplayer/flowplayerhls.swf';

        _.each(this.configService.get('resource.sources'), function (s: IClipOrigSource) {
            let source: IClipSource = {
                type: s.type,
                src: s.url
            };
            options['clip']['sources'].push(source)
        });

        // console.log('player options', document.getElementById('embed-video'), options);
        let player = this.initVideo(document.getElementById('embed-video'), options)
            .on("ready", function () {})

    }
    initVideo(...args) {
        return (<any>flowplayer).apply(this, args);
    }
}
(<any>window).embedPlugin = new VideoPlayer();
