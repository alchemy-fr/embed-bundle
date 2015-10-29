/**
 * Entry point for Embed Images
 */

/// <reference path="./embed.d.ts" />
require('html5shiv');

import * as $ from 'jquery';
import _ = require('underscore');
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
            this.$embedResource = $('#embed-image');
            this.resourceOriginalWidth = this.configService.get('resource.width');
            this.resourceOriginalHeight = this.configService.get('resource.height');
            
            this.resizer = new ResizeEl({
                target: this.$embedResource,
                container: this.$embedContainer,
                resizeOnWindowChange: this.configService.get('resource.fitIn') === true , true : false
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
        });
    }
}
(<any>window).embedPlugin = new Embed();
