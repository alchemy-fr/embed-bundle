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

    constructor() {
        this.configService = new ConfigService();
        let that = this;
        let docContainers = document.getElementsByClassName('document-player');
        this.$documentContainer = docContainers[0];
        this.$documentContainer.insertAdjacentHTML('afterbegin', playerTemplate(this.configService.get('resource')));
        this.$embedContainer = document.getElementById('embed-content');

        if (this.configService.get('isStandalone') !== true) {
            this.pymChild = new (<any>pym).Child({
                id: 'phraseanet-embed-frame', renderCallback: function (windowWidth) {
                    that.$embedContainer.style.height = windowWidth + 'px';
                }
            });
            this.pymChild.sendMessage('childReady', '');
            this.pymChild.sendMessage('documentReady', '');
            if (this.pymChild.parentUrl === '') {
                // no parent pym:
            }
        }
        let pdf = this.configService.get('resource.url');
        let viewerContainer = document.getElementById('viewerContainer');
        let pdfViewer = new (<any>window).PDFJS.PDFViewer({
            container: viewerContainer
        });

        let addEvent = function(obj, type, callback, eventReturn)
        {
            if(obj == null || typeof obj === 'undefined')
                return;

            if(obj.addEventListener)
                obj.addEventListener(type, callback, eventReturn ? true : false);
            else if(obj.attachEvent)
                obj.attachEvent('on' + type, callback);
            else
                obj['on' + type] = callback;
        };

        let debounce = function(func, wait, immediate) {
            var timeout;
            return function() {
                var context = this, args = arguments;
                var later = function() {
                    timeout = null;
                    if (!immediate) func.apply(context, args);
                };
                var callNow = immediate && !timeout;
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
                if (callNow) func.apply(context, args);
            };
        };

        addEvent(window, 'resize',
            debounce(() => {
                pdfViewer.currentScaleValue = 'page-width';
            }, 250, true)
        , true);

        viewerContainer.addEventListener('pagesinit', function () {
            // change default scale.
            pdfViewer.currentScaleValue = 'page-width';


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
