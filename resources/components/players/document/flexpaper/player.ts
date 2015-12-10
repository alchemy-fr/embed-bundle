/// <reference path="../../../../embed/embed.d.ts" />
/**
 * FlexPaper Player for Embed Document
 */

require('html5shiv');
let swfobject = require('../../../../../node_modules/swfobject/index.js');

import * as $ from 'jquery';
import * as _ from 'underscore';
import ConfigService from '../../../embed/config/service';
let playerTemplate:any = require('./player.html');

export default class DocumentPlayer {
    private configService;
    private $documentContainer;
    private documentEmbedContainerId;
    constructor() {
        this.configService = new ConfigService();

        $(document).ready(() => {

            this.$documentContainer =  $('.document-player');
            this.$documentContainer.append(playerTemplate( this.configService.get('resource') ));
            this.documentEmbedContainerId = 'embed-document';

            let player = (<any>swfobject).embedSWF(
                '/assets/vendors/alchemy-embed-medias/players/flexpaper/FlexPaperViewer.swf',
                this.documentEmbedContainerId,
                '100%', '100%', '9.0.0', false, false, {
                    menu: 'false',
                    flashvars: "SwfFile=" +this.configService.get('resource.url') + "&Scale=0.6&ZoomTransition=easeOut&ZoomTime=0.5&ZoomInterval=0.1&FitPageOnLoad=true&FitWidthOnLoad=true&PrintEnabled=true&FullScreenAsMaxWindow=false&localeChain={{app.locale}}",
                    movie: '/assets/vendors/alchemy-embed-medias/players/flexpaper/FlexPaperViewer.swf',
                    allowFullScreen: 'true',
                    wmode: 'transparent'
                }, false
            );
        });
    }
}
(<any>window).embedPlugin = new DocumentPlayer();
