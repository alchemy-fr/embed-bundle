webpackJsonp([6],{

/***/ 16:
/***/ (function(module, exports, __webpack_require__) {

/**
 * Entry point for Embed Images
 */
/// <reference path="./embed.d.ts" />
// require('html5shiv');
//import _ = require('underscore');
var service_1 = __webpack_require__(4);
var resizeEl_1 = __webpack_require__(3);
var Embed = function () {
    function Embed() {
        this.configService = new service_1.default();
        this.$embedContainer = document.getElementById('embed-content');
        this.$embedResource = document.getElementById('embed-image');
        this.resourceOriginalWidth = this.configService.get('resource.width');
        this.resourceOriginalHeight = this.configService.get('resource.height');
        this.resizer = new resizeEl_1.default({
            target: this.$embedResource,
            container: this.$embedContainer,
            resizeOnWindowChange: this.configService.get('resource.fitIn') === true ? true : false
        });
        this.resizer.setContainerDimensions({
            width: window.innerWidth,
            height: window.innerHeight
        });
        this.resizer.setTargetDimensions({
            width: this.resourceOriginalWidth,
            height: this.resourceOriginalHeight
        });
        this.resizer.resize();
    }
    return Embed;
}();
exports.default = Embed;
window.embedPlugin = new Embed();

/***/ }),

/***/ 3:
/***/ (function(module, exports, __webpack_require__) {

var _ = __webpack_require__(1);
var ResizeEl = function () {
    function ResizeEl(options) {
        var _this = this;
        if (!options) {
            options = {};
        }
        if (options.target) {
            this.$embedResource = options.target;
        }
        if (options.container) {
            this.$embedContainer = options.container;
        } else {
            var containers = document.getElementsByTagName('body');
            this.$embedContainer = containers[0];
        }
        if (options.resizeCallback !== undefined) {
            this.resizeCallback = options.resizeCallback;
        }
        if (options.resizeOnWindowChange === true) {
            window.addEventListener('resize', _.debounce(function () {
                _this.onResizeWindow(window.innerWidth, window.innerHeight);
            }, 300), false);
        }
        this.defaultWidth = 120;
        this.defaultHeight = 120;
    }
    ResizeEl.prototype.setContainerDimensions = function (dimensions) {
        this.containerDimensions = dimensions;
    };
    ResizeEl.prototype.setTargetDimensions = function (dimensions) {
        this.targetDimensions = dimensions;
    };
    ResizeEl.prototype.onResizeWindow = function (width, height) {
        this.setContainerDimensions({
            width: width,
            height: height
        });
        this.resize();
    };
    ResizeEl.prototype.resize = function () {
        // get original size
        var resized = false,
            maxWidth = this.containerDimensions.width,
            maxHeight = this.containerDimensions.height,
            resourceWidth = this.targetDimensions.width,
            resourceHeight = this.targetDimensions.height,
            resourceRatio = this.targetDimensions.height / this.targetDimensions.width;
        var resizeW = resourceWidth,
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
        if (resizeW === null && resizeH === null) {
            resizeW = this.defaultWidth;
            resizeH = this.defaultHeight;
        }
        resizeW = Math.floor(resizeW);
        resizeH = Math.floor(resizeH);
        // add top margin:
        var marginTop = 0;
        if (this.containerDimensions.height > resizeH) {
            marginTop = (this.containerDimensions.height - resizeH) / 2;
        }
        this.$embedResource.style.width = resizeW + 'px';
        this.$embedResource.style.height = resizeH + 'px';
        this.$embedContainer.style.width = resizeW + 'px';
        this.$embedContainer.style.height = resizeH + 'px';
        this.$embedContainer.style['margin-top'] = marginTop + 'px';
        if (this.resizeCallback !== undefined) {
            this.resizeCallback.apply(this, [{ width: resizeW, height: resizeH, 'margin-top': marginTop }]);
        }
    };
    return ResizeEl;
}();
exports.default = ResizeEl;

/***/ })

},[16]);
//# sourceMappingURL=image.js.map