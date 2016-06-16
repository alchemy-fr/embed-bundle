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
let pym = require('pym.js');
export default class DocumentPlayer {
    private configService;
    private $documentContainer;
    private documentEmbedContainerId;
    private pymChild;
    private $embedContainer;
    private resourceOriginalWidth;
    private resourceOriginalHeight;

    constructor() {
        this.configService = new ConfigService();
        let that = this;
        let docContainers = document.getElementsByClassName('document-player');
        this.$documentContainer = docContainers[0];
        this.$documentContainer.insertAdjacentHTML('afterbegin', playerTemplate(this.configService.get('resource')));
        this.$embedContainer = document.getElementById('embed-content');
        
        this.resourceOriginalWidth = this.configService.get('resource.width');
        this.resourceOriginalHeight = this.configService.get('resource.height');

        if (this.configService.get('isStandalone') !== true) {
            this.pymChild = new (<any>pym).Child({
                id: 'phraseanet-embed-frame', renderCallback: (windowWidth) => {
                    let ratio = that.resourceOriginalHeight / that.resourceOriginalWidth;
                    let height = windowWidth > 0 ? (windowWidth * ratio) : that.resourceOriginalHeight;
                    // send video calculated height
                    that.$embedContainer.style.height = height + 'px';
                }
            });

            this.pymChild.onMessage('shouldResize', (container) => {
                this.pymChild.sendHeight()
            })
        }
        let pdf = this.configService.get('resource.url');
        let viewerContainer = document.getElementById('viewerContainer');
        let pdfViewer = new (<any>window).PDFJS.PDFViewer({
            container: viewerContainer
        });

        window.addEventListener('resize', _.debounce(() => {
            if (this.pymChild !== undefined) {
                this.pymChild.sendHeight()
            }
            pdfViewer.currentScaleValue = 'page-width';
        }, 200), false);

        viewerContainer.addEventListener('pagesinit', function () {
            // change default scale.
            pdfViewer.currentScaleValue = 'page-width';
            if (this.pymChild !== undefined) {
                this.pymChild.sendHeight()
            }


        });

        (<any>window).PDFJS.getDocument(pdf)
            .then(function (document) {
                pdfViewer.setDocument(document);
                if (that.pymChild !== undefined) {
                    that.pymChild.sendHeight()
                }
            });
    }
}
(<any>window).embedPlugin = new DocumentPlayer();
