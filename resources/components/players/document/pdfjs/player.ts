/// <reference path="../../../../embed/embed.d.ts" />
/**
 * FlexPaper Player for Embed Document
 */

require('html5shiv');
require('../../../../../node_modules/pdfjs-dist/build/pdf');
// Webpack returns a string to the url because we configured the url-loader.
(<any>window).PDFJS.workerSrc = require('../../../../../node_modules/pdfjs-dist/build/pdf.worker.js');
require('../../../../../node_modules/pdfjs-dist/web/compatibility');
require('../../../../../node_modules/pdfjs-dist/web/pdf_viewer');

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


            let pdf = this.configService.get('resource.url')
            //let pdf = '/assets/helloworld.pdf';

            let pdfViewer = new (<any>window).PDFJS.PDFViewer({
                container: $('#viewerContainer')[0]
            });

            (<any>window).PDFJS.getDocument(pdf)
                .then(function(document){
                    pdfViewer.setDocument(document);
                });
        });
    }
}
(<any>window).embedPlugin = new DocumentPlayer();
