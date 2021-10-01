/// <reference path="../../../../embed/embed.d.ts" />
/**
 * FlexPaper Player for Embed Document
 */

//require('html5shiv');
require('webl10n/l10n');

import * as pdfjsLib from 'pdfjs-dist';
import {
    PDFViewer,
    PDFFindController,
    EventBus,
    NullL10n,
    PDFLinkService
} from 'pdfjs-dist/web/pdf_viewer';

const L10n = NullL10n; // TODO use real translator

// Setting worker path to worker bundle.

pdfjsLib.GlobalWorkerOptions.workerSrc = "/assets/vendors/alchemy-embed-medias/pdf.worker.js";

//import * as $ from 'jquery';
import * as _ from 'underscore';
import ConfigService from '../../../embed/config/service';
let playerTemplate:any = require('./player.html');
let pym = require('pym.js');

let FindStates = {
    FIND_FOUND: 0,
    FIND_NOTFOUND: 1,
    FIND_WRAPPED: 2,
    FIND_PENDING: 3
};

type MatchesCount = {
    total: number;
    current: number;
};

type FindEvent = {
    matchesCount: MatchesCount,
};

type UpdatefindcontrolstateEvent = {
    state: any;
    previous: any;
} & FindEvent;

export default class DocumentPlayer {
    private configService;
    private $documentContainer;
    private readonly pymChild;
    private $embedContainer;
    private resourceOriginalWidth;
    private resourceOriginalHeight;

    constructor() {
        let SCALE_DELTA = 1.5;
        let MIN_SCALE = 0.25;
        let MAX_SCALE = 2.5;

        let opened = false;
        let isFullScreen = false;
        this.configService = new ConfigService();
        let that = this;

        let docContainers =  document.getElementsByClassName('document-player');
        this.$documentContainer = docContainers[0];
        this.$documentContainer.insertAdjacentHTML('afterbegin', playerTemplate( this.configService.get('resource') ));
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
        //let pdf = '/assets/helloworld.pdf';

        const viewerElement = document.getElementById('viewer');
        const container = document.getElementById('viewerContainer');
        const zoomIn = document.getElementById('zoomIn');
        const zoomOut = document.getElementById('zoomOut');
        const reset = document.getElementById('reset');
        const toggleFindButton = document.getElementById('viewFind');
        const bar = document.getElementById('findbar');
        const findField:HTMLInputElement = <HTMLInputElement>document.getElementById('findInput');
        const findNextButton = document.getElementById('findNext');
        const findPreviousButton = document.getElementById('findPrevious');
        const caseSensitive = <HTMLInputElement>document.getElementById('findMatchCase');
        const highlightAll = <HTMLInputElement>document.getElementById('findHighlightAll');
        const findResultsCount = document.getElementById('findResultsCount');
        const findMessage = document.getElementById('findMsg');
        const presentationModeButton = document.getElementById('presentationMode');


        const eventBus = new EventBus({});

        const linkService = new PDFLinkService({
            eventBus,
        });
        const l10n = undefined;

        const findController = new PDFFindController({
            linkService,
            eventBus,
        });

        const pdfViewer = new PDFViewer({
            container: (container as HTMLDivElement),
            renderer: 'canvas',
            eventBus,
            linkService,
            findController,
            l10n,
        });
        linkService.setViewer(pdfViewer);

        window.addEventListener('resize', _.debounce(() => {
            if (this.pymChild !== undefined) {
                this.pymChild.sendHeight()
            }
            pdfViewer.currentScaleValue = 'page-width';
        }, 200), false);

        eventBus._on('pagesinit', () => {
            // change default scale.
            pdfViewer.currentScaleValue = 'page-width';
            if (this.pymChild !== undefined) {
                this.pymChild.sendHeight()
            }
        });

        eventBus._on('updatefindmatchescount', ({matchesCount}: Partial<FindEvent>) => {
            updateResultsCount(matchesCount.total);
        });

        eventBus._on('updatefindcontrolstate', ({state, previous, matchesCount}: UpdatefindcontrolstateEvent) => {
            updateUIState(state, previous, matchesCount.total);
        });

        /* HANDLERS FUNCTIONS */
        zoomIn.addEventListener("click", function() {
            const newScale = (pdfViewer.currentScale * SCALE_DELTA);
            if(newScale > MAX_SCALE) {
                pdfViewer.currentScale = MAX_SCALE;
            }else {
                pdfViewer.currentScale = newScale;
            }
            updateZoomButton(newScale);
        });

        zoomOut.addEventListener("click", function() {
            const newScale = (pdfViewer.currentScale / SCALE_DELTA);
            if(newScale < MIN_SCALE) {
                pdfViewer.currentScale = MIN_SCALE;
            }else {
                pdfViewer.currentScale = newScale;
            }
            updateZoomButton(newScale);
        });

        reset.addEventListener("click", function() {
            pdfViewer.currentScaleValue = "page-width";
            const newScale = pdfViewer.currentScale;
            updateZoomButton(newScale);
        });

        toggleFindButton.addEventListener('click', function() {
            toggle();
        });

        findField.addEventListener('input', function() {
            if(findField.value.length > 2) {
                dispatchEvent('', false);
            }
        });

        findNextButton.addEventListener('click', function () {
            dispatchEvent('again', false);
        });

        findPreviousButton.addEventListener('click', () => {
            dispatchEvent('again', true);
        });

        highlightAll.addEventListener('click', function () {
            dispatchEvent('highlightallchange', false);
        });

        caseSensitive.addEventListener('click', function () {
            dispatchEvent('casesensitivitychange', false);
        });

        presentationModeButton.addEventListener('click', function () {
            toggleFullScreen();
        });

        document.addEventListener('webkitfullscreenchange', exitHandler, false);
        document.addEventListener('mozfullscreenchange', exitHandler, false);
        document.addEventListener('fullscreenchange', exitHandler, false);
        document.addEventListener('MSFullscreenChange', exitHandler, false);

        function exitHandler() {
            var document:any = window.document;
            var fullscreen = document.webkitIsFullScreen ||    // alternative standard method
                document.mozFullScreen  || document.msFullscreenElement;
            if (fullscreen) {
                pdfViewer.currentScaleValue = "auto";
            } else {
                pdfViewer.currentScaleValue = "page-width";
            }
        }

        function toggleFullScreen() {
            var elem:any = viewerElement;
            var document:any = window.document;
            if (!isFullScreen) {
                if (elem.requestFullscreen) {
                    elem.requestFullscreen();
                } else if (elem.mozRequestFullScreen) {
                    elem.mozRequestFullScreen();
                } else if (elem.webkitRequestFullscreen) {
                    elem.webkitRequestFullscreen();
                } else if (elem.msRequestFullscreen) {
                    elem.msRequestFullscreen();
                }
            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.cancelFullScreen) {
                    document.cancelFullScreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen();
                } else if (document.webkitCancelFullScreen) {
                    document.webkitCancelFullScreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                }
            }
        }

        function dispatchEvent(type, findPrev) {
            findController.executeCommand('find' + type, {
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
                || sessionStorage.getItem('search') !== '') &&
                (parent.document.body.getElementsByClassName('documentTips')[0]
                    .parentElement.parentElement.getAttribute('class').indexOf('preview_col_cont') > 0
                || parent.document.body.getElementsByClassName('popover-content').length > 0)) {
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

        function updateResultsCount(matchCount: number) {
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

        async function updateUIState(state, previous, matchCount: number) {
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
                    findMsg = await L10n.get('find_not_found');
                    notFound = true;
                    break;
                case FindStates.FIND_WRAPPED:
                    if (previous) {
                        findMsg = await L10n.get('find_reached_top');
                    } else {
                        findMsg = await L10n.get('find_reached_bottom');
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

        pdfjsLib.getDocument(pdf)
            .promise
            .then(function(document){
                console.log("render");
                pdfViewer.setDocument(document);
                linkService.setDocument(document);
                if (that.pymChild !== undefined) {
                    that.pymChild.sendHeight()
                }
            });
    }
}

(<any>window).embedPlugin = new DocumentPlayer();
