/**
 * Entry point for Embed Images
 */

/// <reference path="./embed.d.ts" />
// require('html5shiv');

//import _ = require('underscore');

let pym = require('pym.js');
import ConfigService from '../components/embed/config/service';
import ResizeEl from '../components/utils/resizeEl';

export default class Embed {
    private configService;
    private resourceOriginalWidth;
    private resourceOriginalHeight;
    private $embedContainer;
    private $embedResource;
    private resizer;
    private pymChild;
    constructor() {
        let that = this;
        this.configService = new ConfigService();

        this.$embedContainer = document.getElementById('embed-content');
        this.$embedResource = document.getElementById('embed-image');

        this.resourceOriginalWidth = this.configService.get('resource.width');
        this.resourceOriginalHeight = this.configService.get('resource.height');

        if( this.configService.get('isStandalone') === true ) {
            this.initResizer();
        } else {
            this.$embedResource.style.width = '100%';
            this.$embedResource.style.height = 'auto';
            this.pymChild = new (<any>pym).Child({id: 'phraseanet-embed-frame', renderCallback: function(windowWidth) {
                let ratio = that.resourceOriginalHeight / that.resourceOriginalWidth;
                that.$embedResource.style.width = '100%';
                that.$embedResource.style.height = 'auto';
                // send image calculated height
                that.$embedContainer.style.height = windowWidth * ratio + 'px';
            }});

            if (this.pymChild.parentUrl === '') {
                // no parent pym:
                this.initResizer();
            }
        }
    }

    initResizer() {
        this.resizer = new ResizeEl({
            target: this.$embedResource,
            container: this.$embedContainer,
            resizeOnWindowChange: this.configService.get('resource.fitIn') === true ? true : false
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
}
(<any>window).embedPlugin = new Embed();
