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
        let SCALE_DELTA = 1.5;
        let MIN_SCALE = 0.25;
        let MAX_SCALE = 2.5;
        this.configService = new ConfigService();

        let docContainers =  document.getElementsByClassName('document-player');
        this.$documentContainer = docContainers[0];
        this.$documentContainer.insertAdjacentHTML('afterbegin', playerTemplate( this.configService.get('resource') ));


        let pdf = this.configService.get('resource.url')
        //let pdf = '/assets/helloworld.pdf';

        let container = document.getElementById('viewerContainer');

        let zoomIn = document.getElementById('zoomIn');
        let zoomOut = document.getElementById('zoomOut');
        let reset = document.getElementById('reset');



        let pdfViewer = new (<any>window).PDFJS.PDFViewer({
            container: container
        });

        zoomIn.addEventListener("click", function() {
            var newScale = pdfViewer.currentScale;
            newScale = (newScale * SCALE_DELTA).toFixed(2);
            if(newScale > MAX_SCALE) {
                pdfViewer.currentScale = MAX_SCALE;
            }else {
                pdfViewer.currentScale = newScale;
            }
            updateZoomButton(newScale);
        });

        zoomOut.addEventListener("click", function() {
            var newScale = pdfViewer.currentScale;
            newScale = (newScale / SCALE_DELTA).toFixed(2);
            if(newScale < MIN_SCALE) {
                pdfViewer.currentScale = MIN_SCALE;
            }else {
                pdfViewer.currentScale = newScale;
            }
            updateZoomButton(newScale);
        });

        reset.addEventListener("click", function() {
            pdfViewer.currentScaleValue = "page-width";
            var newScale = pdfViewer.currentScale;
            updateZoomButton(newScale);
        });

        function updateZoomButton(scale) {
            if(scale >= MAX_SCALE) {
                zoomIn.setAttribute("disabled","disabled");
            }else {
                zoomIn.removeAttribute("disabled");
            }

            if(scale <= MIN_SCALE) {
                zoomOut.setAttribute("disabled","disabled");
            }else {
                zoomOut.removeAttribute("disabled");
            }
        }

        container.addEventListener("pagesinit", function () {
            pdfViewer.currentScaleValue = "page-width";
        });



        (<any>window).PDFJS.getDocument(pdf)
            .then(function(document){
                console.log("render");
                pdfViewer.setDocument(document);
            });
    }
}
(<any>window).embedPlugin = new DocumentPlayer();
