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

let FindStates = {
    FIND_FOUND: 0,
    FIND_NOTFOUND: 1,
    FIND_WRAPPED: 2,
    FIND_PENDING: 3
};



export default class DocumentPlayer {
    private configService;
    private $documentContainer;
    private documentEmbedContainerId;

    constructor() {
        let SCALE_DELTA = 1.5;
        let MIN_SCALE = 0.25;
        let MAX_SCALE = 2.5;

        let opened = false;
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
        let toggleFindButton = document.getElementById('viewFind');
        let bar = document.getElementById('findbar');
        let findField:HTMLInputElement = <HTMLInputElement>document.getElementById('findInput');
        let findNextButton = document.getElementById('findNext');
        let findPreviousButton = document.getElementById('findPrevious');
        let caseSensitive = <HTMLInputElement>document.getElementById('findMatchCase');
        let highlightAll = <HTMLInputElement>document.getElementById('findHighlightAll');
        let findResultsCount = document.getElementById('findResultsCount');
        let findMessage = document.getElementById('findMsg')


        let pdfViewer = new (<any>window).PDFJS.PDFViewer({
            container: container
        });


        let pdfFindController = new (<any>window).PDFJS.PDFFindController({
            pdfViewer: pdfViewer
        });

        pdfFindController.onUpdateResultsCount = function (matchCount) {
            updateResultsCount(matchCount);
        };

        pdfFindController.onUpdateState = function (state, previous, matchCount) {
            updateUIState(state, previous, matchCount);
        }


        pdfViewer.setFindController(pdfFindController);


        /* HANDLERS FUNCTIONS */
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

        toggleFindButton.addEventListener('click', function() {
            toggle();
        });

        findField.addEventListener('input', function() {
            dispatchEvent('', false);
        });

        findNextButton.addEventListener('click', function () {
            if(findField.value.length > 2) {
                dispatchEvent('again', false);
            }
        });

        findPreviousButton.addEventListener('click', () => {
            dispatchEvent('again', true);
        });

        highlightAll.addEventListener('click', () => {
            dispatchEvent('highlightallchange', false);
        });

        caseSensitive.addEventListener('click', () => {
            dispatchEvent('casesensitivitychange', false);
        });


        function dispatchEvent(type, findPrev) {
            pdfFindController.executeCommand('find' + type, {
                query: findField.value,
                phraseSearch: true,
                caseSensitive: caseSensitive.checked,
                highlightAll: highlightAll.checked,
                findPrevious: findPrev
            });
        }


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

        function open() {
            if (!opened) {
                opened = true;
                toggleFindButton.classList.add('toggled');
                bar.classList.remove('hidden');
            }

            if ((sessionStorage.getItem('search') != null
                || sessionStorage.getItem('search') !== '') && parent.document.body.getElementsByClassName('popover-content').length > 0) {
                findField.value = JSON.parse(sessionStorage.getItem('search'));
                dispatchEvent('', false);
                //sessionStorage.removeItem('search');
            }
            findField.select();
            findField.focus();

            _adjustWidth();
        }

        function close() {
            if (!opened) {
                return;
            }
            opened = false;
            toggleFindButton.classList.remove('toggled');
            bar.classList.add('hidden');
            pdfFindController.active = false;
        }

        function toggle() {
            if (opened) {
                close();
            } else {
                open();
            }
        }

        function _adjustWidth() {
            if (!opened) {
                return;
            }

            // The find bar has an absolute position and thus the browser extends
            // its width to the maximum possible width once the find bar does not fit
            // entirely within the window anymore (and its elements are automatically
            // wrapped). Here we detect and fix that.
            bar.classList.remove('wrapContainers');

            var findbarHeight = bar.clientHeight;
            var inputContainerHeight = bar.firstElementChild.clientHeight;

            if (findbarHeight > inputContainerHeight) {
                // The findbar is taller than the input container, which means that
                // the browser wrapped some of the elements. For a consistent look,
                // wrap all of them to adjust the width of the find bar.
                bar.classList.add('wrapContainers');
            }
        }

        function updateResultsCount(matchCount) {
            if (!findResultsCount) {
                return; // No UI control is provided. 
            }
            // If there are no matches, hide the counter. 
            if (!matchCount) {
                findResultsCount.classList.add('hidden');
                return;
            }
            // Create and show the match counter. 
            findResultsCount.textContent = matchCount.toLocaleString();
            findResultsCount.classList.remove('hidden');
        }

        function updateUIState(state, previous, matchCount) {
            var notFound = false;
            var findMsg = '';
            var status = '';
            switch (state) {
                case FindStates.FIND_FOUND:
                    break;
                case FindStates.FIND_PENDING:
                    status = 'pending';
                    break;
                case FindStates.FIND_NOTFOUND:
                    findMsg = 'Phrase not found';
                    notFound = true;
                    break;
                case FindStates.FIND_WRAPPED:
                    if (previous) {
                        findMsg = 'Reached top of document, continued from bottom';
                    } else {
                        findMsg = 'Reached end of document, continued from top';
                    }
                    break;
            }
            if (notFound) {
                findField.classList.add('notFound');
            } else {
                findField.classList.remove('notFound');
            }
            findField.setAttribute('data-status', status);
            findMessage.textContent = findMsg;
            updateResultsCount(matchCount);
            _adjustWidth();
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
