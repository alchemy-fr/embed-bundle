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
            this.$embedContainer = $('body');
        }

        if( options.resizeCallback !== undefined ) {
            this.resizeCallback = options.resizeCallback;
        }


        if (options.resizeOnWindowChange === true) {
            $(<any>window).resize(_.debounce(() => {
                this.onResizeWindow(<any>window.innerWidth, <any>window.innerHeight);
            }, 300));
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

        this.$embedResource.css({width: resizeW, height: resizeH});
        this.$embedContainer.css({width: resizeW, height: resizeH, 'margin-top': marginTop});

        if( this.resizeCallback !== undefined) {
            this.resizeCallback.apply(this, [{width: resizeW, height: resizeH, 'margin-top': marginTop}]);
        }
    }
}
export default ResizeEl;
