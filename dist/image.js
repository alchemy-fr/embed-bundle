webpackJsonp([5],{0:function(e,i,t){"use strict";var n=t(2),s=t(7),r=function(){function e(){this.configService=new n.default,this.$embedContainer=document.getElementById("embed-content"),this.$embedResource=document.getElementById("embed-image"),this.resourceOriginalWidth=this.configService.get("resource.width"),this.resourceOriginalHeight=this.configService.get("resource.height"),this.resizer=new s.default({target:this.$embedResource,container:this.$embedContainer,resizeOnWindowChange:this.configService.get("resource.fitIn")===!0}),this.resizer.setContainerDimensions({width:window.innerWidth,height:window.innerHeight}),this.resizer.setTargetDimensions({width:this.resourceOriginalWidth,height:this.resourceOriginalHeight}),this.resizer.resize()}return e}();i.default=r,window.embedPlugin=new r},7:function(e,i,t){"use strict";var n=t(4),s=function(){function e(e){var i=this;if(e||(e={}),e.target&&(this.$embedResource=e.target),e.container)this.$embedContainer=e.container;else{var t=document.getElementsByTagName("body");this.$embedContainer=t[0]}void 0!==e.resizeCallback&&(this.resizeCallback=e.resizeCallback),e.resizeOnWindowChange===!0&&window.addEventListener("resize",n.debounce(function(){i.onResizeWindow(window.innerWidth,window.innerHeight)},300),!1),this.defaultWidth=120,this.defaultHeight=120}return e.prototype.setContainerDimensions=function(e){this.containerDimensions=e},e.prototype.setTargetDimensions=function(e){this.targetDimensions=e},e.prototype.onResizeWindow=function(e,i){this.setContainerDimensions({width:e,height:i}),this.resize()},e.prototype.resize=function(){var e=this.containerDimensions.width,i=this.containerDimensions.height,t=this.targetDimensions.width,n=this.targetDimensions.height,s=this.targetDimensions.height/this.targetDimensions.width,r=t,h=n;t>n?(r>e&&(r=e,h=e*s),h>i&&(r=i/s,h=i)):h>i&&(r=i/s,h=i),null===r&&null===h&&(r=this.defaultWidth,h=this.defaultHeight),r=Math.floor(r),h=Math.floor(h);var o=0;this.containerDimensions.height>h&&(o=(this.containerDimensions.height-h)/2),this.$embedResource.style.width=r+"px",this.$embedResource.style.height=h+"px",this.$embedContainer.style.width=r+"px",this.$embedContainer.style.height=h+"px",this.$embedContainer.style["margin-top"]=o+"px",void 0!==this.resizeCallback&&this.resizeCallback.apply(this,[{width:r,height:h,"margin-top":o}])},e}();i.default=s}});