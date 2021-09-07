import * as _ from 'underscore';


class ResizeEl {
    private resourceOriginalWidth;
    private resourceOriginalHeight;
    private $embedContainer;
    private $embedResource;
    private containerDimensions;
    private targetDimensions;
    private resizeCallback;
    private defaultWidth;
    private defaultHeight;

    constructor(options) {
        if (!options) {
            options = {}
        }
        if( options.target) {
            this.$embedResource = options.target;
        }

        if( options.container) {
            this.$embedContainer = options.container;
        } else {
            let containers = document.getElementsByTagName('body');
            this.$embedContainer = containers[0];
        }

        if( options.resizeCallback !== undefined ) {
            this.resizeCallback = options.resizeCallback;
        }


        if (options.resizeOnWindowChange === true) {

            window.addEventListener('resize', _.debounce(() => {
                this.onResizeWindow(<any>window.innerWidth, <any>window.innerHeight);
            }, 300), false);

            /*$(<any>window).resize(_.debounce(() => {
                this.onResizeWindow(<any>window.innerWidth, <any>window.innerHeight);
            }, 300));*/
        }

        this.defaultWidth = 120;
        this.defaultHeight = 120;
    }
    setContainerDimensions(dimensions) {
        this.containerDimensions = dimensions;
    }
    setTargetDimensions(dimensions) {
        this.targetDimensions = dimensions;
    }

    onResizeWindow(width, height) {
        this.setContainerDimensions({
            width:  width,
            height: height
        });

        this.setTargetDimensions({
            width: (<any>window).embedPlugin.resourceOriginalWidth,
            height: (<any>window).embedPlugin.resourceOriginalHeight
        });

        this.resize();
    }

    resize() {
        // get original size
        let resized = false,
            maxWidth = this.containerDimensions.width,
            maxHeight = this.containerDimensions.height,
            resourceWidth = this.targetDimensions.width,
            resourceHeight = this.targetDimensions.height,
            resourceRatio = (this.targetDimensions.height / this.targetDimensions.width);

        let resizeW = resourceWidth,
            resizeH = resourceHeight;

        // pass 1 make height ok:

        if (resourceWidth > resourceHeight) {
            // if width still too large:
            if (resizeW > maxWidth) {
                resizeW = maxWidth;
                resizeH = maxWidth * resourceRatio;
            }
            if (resizeH > maxHeight) {
                resizeW = maxHeight / resourceRatio;
                resizeH = maxHeight;
            }
        } else {
            if (resizeH > maxHeight) {
                resizeW = maxHeight / resourceRatio;
                resizeH = maxHeight;
            }
            if (resizeW > maxWidth) {
                resizeW = maxWidth;
                resizeH = maxWidth * resourceRatio;
            }

        }

        if( resizeW === null && resizeH === null ) {
            resizeW = this.defaultWidth;
            resizeH = this.defaultHeight;
        }

        resizeW = Math.floor(resizeW);
        resizeH = Math.floor(resizeH);

        // add top margin:
        let marginTop = 0;

        if (this.containerDimensions.height > resizeH) {
            marginTop = (this.containerDimensions.height - resizeH) / 2;
        }

        this.$embedResource.style.width = resizeW + 'px';
        this.$embedResource.style.height = resizeH + 'px';

        this.$embedContainer.style.width = resizeW + 'px';
        this.$embedContainer.style.height = resizeH + 'px';
        this.$embedContainer.style['margin-top'] = marginTop + 'px';

        if( this.resizeCallback !== undefined) {
            this.resizeCallback.apply(this, [{width: resizeW, height: resizeH, 'margin-top': marginTop}]);
        }

        /**
         * Post msg to window parent (iframe context)
         */
        let optimizedWidth = Math.floor(maxHeight / resourceRatio);
        let optimizedHeight = Math.floor(maxWidth * resourceRatio);
        let message = {
            id: "Phraseanet",
            url: (<any>window).location.href,
            optimizedWidth: resourceWidth < optimizedWidth ? resourceWidth : optimizedWidth,
            optimizedHeight: resourceHeight < optimizedHeight ? resourceHeight : optimizedHeight,
        };
        parent.postMessage(message, '*');

    }
}
export default ResizeEl;
