/// <reference path="../../../../embed/embed.d.ts" />
/**
 * FlexPaper Player for Embed Document
 */

//require('html5shiv');
require('../../../../../node_modules/pdfjs-dist/web/compatibility'); // should be loaded first
require('../../../../../node_modules/pdfjs-dist/build/pdf');
// Webpack returns a string to the url because we configured the url-loader.
(<any>window).PDFJS.workerSrc = require('../../../../../node_modules/pdfjs-dist/build/pdf.worker.js');
require('../../../../../node_modules/pdfjs-dist/web/pdf_viewer');

//import * as $ from 'jquery';
import * as _ from 'underscore';
import ConfigService from '../../../embed/config/service';
let playerTemplate:any = require('./player.html');

export default class DocumentPlayer {
    private configService;
    private $documentContainer;
    private documentEmbedContainerId;
    constructor() {
        this.configService = new ConfigService();

        let docContainers =  document.getElementsByClassName('document-player');
        this.$documentContainer = docContainers[0];
        this.$documentContainer.insertAdjacentHTML('afterbegin', playerTemplate( this.configService.get('resource') ));


        let pdf = this.configService.get('resource.url')
        //let pdf = '/assets/helloworld.pdf';

        let pdfViewer = new (<any>window).PDFJS.PDFViewer({
            container: document.getElementById('viewerContainer')
        });

        (<any>window).PDFJS.getDocument(pdf)
            .then(function(document){
                pdfViewer.setDocument(document);
            });
    }
}
(<any>window).embedPlugin = new DocumentPlayer();
