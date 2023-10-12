(()=>{var __webpack_modules__={902:(e,t,n)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(469),i={assetsPath:"/plugins/web-gallery/assets",api:{baseUrl:"/web-gallery",basePath:"",ajaxSetup:{accept:"application/json",contentType:"application/json",async:!0,cache:!1,dataType:"json",complete:function(){},error:function(e,t,n){var r;return console.log("ajax failed",e,t,n),(e.getResponseHeader("content-type")||"").indexOf("json")>-1&&(r=$.parseJSON(e.responseText)),r}}}},o=window.envConfiguration;void 0!==o&&(i=r.extend(i,o)),t.default=i},82:function(e,t,n){"use strict";var r,i=this&&this.__extends||(r=function(e,t){return r=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&(e[n]=t[n])},r(e,t)},function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Class extends value "+String(t)+" is not a constructor or null");function n(){this.constructor=e}r(e,t),e.prototype=null===t?Object.create(t):(n.prototype=t.prototype,new n)});Object.defineProperty(t,"__esModule",{value:!0});var o=n(788),a=n(902),u=null,l=function(e){function t(){var t=e.call(this,a.default)||this;return u||(u=t),u}return i(t,e),t}(o.default);t.default=l},788:(e,t,n)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(469),i=function(){function e(e){this.configuration=e}return e.prototype.get=function(e){if(void 0!==e){var t=this._findKeyValue(e||this.configuration);return"string"==typeof t?t:t||null}return this.configuration},e.prototype.set=function(e,t){void 0!==e&&(this.configuration[e]=t)},e.prototype._findKeyValue=function(e){if(e){var t=r.isString(e),n=t?e:e.name;if(e.indexOf(".")>0)return this._search(this.configuration,n);var i=this.configuration[n];return i&&(t||!t&&i===e)||t?i:void 0}},e.prototype._search=function(e,t){if(r.isNumber(t)&&(t=[t]),r.isEmpty(t))return e;if(r.isEmpty(e))return null;if(r.isString(t))return this._search(e,t.split("."));var n=t[0];return 1===t.length?void 0===e[n]?null:e[n]:this._search(e[n],t.slice(1))},e}();t.default=i},379:e=>{var t=function(){var e,n,r,i,o,a,u="undefined",l="object",c="Shockwave Flash",s="application/x-shockwave-flash",f="SWFObjectExprInst",p="onreadystatechange",d=window,v=document,h=navigator,y=!1,g=[function(){y?function(){var e=v.getElementsByTagName("body")[0],t=V(l);t.setAttribute("type",s);var n=e.appendChild(t);if(n){var r=0;!function(){if(typeof n.GetVariable!=u){var i=n.GetVariable("$version");i&&(i=i.split(" ")[1].split(","),S.pv=[parseInt(i[0],10),parseInt(i[1],10),parseInt(i[2],10)])}else if(r<10)return r++,void setTimeout(arguments.callee,10);e.removeChild(t),n=null,E()}()}else E()}():E()}],m=[],b=[],w=[],_=!1,j=!1,x=!0,S=function(){var e=typeof v.getElementById!=u&&typeof v.getElementsByTagName!=u&&typeof v.createElement!=u,t=h.userAgent.toLowerCase(),n=h.platform.toLowerCase(),r=/win/.test(n||t),i=/mac/.test(n||t),o=!!/webkit/.test(t)&&parseFloat(t.replace(/^.*webkit\/(\d+(\.\d+)?).*$/,"$1")),a=!1,f=[0,0,0],p=null;if(typeof h.plugins!=u&&typeof h.plugins[c]==l)!(p=h.plugins[c].description)||typeof h.mimeTypes!=u&&h.mimeTypes[s]&&!h.mimeTypes[s].enabledPlugin||(y=!0,a=!1,p=p.replace(/^.*\s+(\S+\s+\S+$)/,"$1"),f[0]=parseInt(p.replace(/^(.*)\..*$/,"$1"),10),f[1]=parseInt(p.replace(/^.*\.(.*)\s.*$/,"$1"),10),f[2]=/[a-zA-Z]/.test(p)?parseInt(p.replace(/^.*[a-zA-Z]+(.*)$/,"$1"),10):0);else if(typeof d[["Active"].concat("Object").join("X")]!=u)try{var g=new(window[["Active"].concat("Object").join("X")])("ShockwaveFlash.ShockwaveFlash");g&&(p=g.GetVariable("$version"))&&(a=!0,p=p.split(" ")[1].split(","),f=[parseInt(p[0],10),parseInt(p[1],10),parseInt(p[2],10)])}catch(e){}return{w3:e,pv:f,wk:o,ie:a,win:r,mac:i}}();function A(){if(!_){try{var e=v.getElementsByTagName("body")[0].appendChild(V("span"));e.parentNode.removeChild(e)}catch(e){return}_=!0;for(var t=g.length,n=0;n<t;n++)g[n]()}}function k(e){_?e():g[g.length]=e}function O(e){if(typeof d.addEventListener!=u)d.addEventListener("load",e,!1);else if(typeof v.addEventListener!=u)v.addEventListener("load",e,!1);else if(typeof d.attachEvent!=u)!function(e,t,n){e.attachEvent(t,n),w[w.length]=[e,t,n]}(d,"onload",e);else if("function"==typeof d.onload){var t=d.onload;d.onload=function(){t(),e()}}else d.onload=e}function E(){var e=m.length;if(e>0)for(var t=0;t<e;t++){var n=m[t].id,r=m[t].callbackFn,i={success:!1,id:n};if(S.pv[0]>0){var o=$(n);if(o)if(!R(m[t].swfVersion)||S.wk&&S.wk<312)if(m[t].expressInstall&&N()){var a={};a.data=m[t].expressInstall,a.width=o.getAttribute("width")||"0",a.height=o.getAttribute("height")||"0",o.getAttribute("class")&&(a.styleclass=o.getAttribute("class")),o.getAttribute("align")&&(a.align=o.getAttribute("align"));for(var l={},c=o.getElementsByTagName("param"),s=c.length,f=0;f<s;f++)"movie"!=c[f].getAttribute("name").toLowerCase()&&(l[c[f].getAttribute("name")]=c[f].getAttribute("value"));C(a,l,n,r)}else I(o),r&&r(i);else W(n,!0),r&&(i.success=!0,i.ref=T(n),r(i))}else if(W(n,!0),r){var p=T(n);p&&typeof p.SetVariable!=u&&(i.success=!0,i.ref=p),r(i)}}}function T(e){var t=null,n=$(e);if(n&&"OBJECT"==n.nodeName)if(typeof n.SetVariable!=u)t=n;else{var r=n.getElementsByTagName(l)[0];r&&(t=r)}return t}function N(){return!j&&R("6.0.65")&&(S.win||S.mac)&&!(S.wk&&S.wk<312)}function C(t,o,a,l){j=!0,r=l||null,i={success:!1,id:a};var c=$(a);if(c){"OBJECT"==c.nodeName?(e=F(c),n=null):(e=c,n=a),t.id=f,(typeof t.width==u||!/%$/.test(t.width)&&parseInt(t.width,10)<310)&&(t.width="310"),(typeof t.height==u||!/%$/.test(t.height)&&parseInt(t.height,10)<137)&&(t.height="137"),v.title=v.title.slice(0,47)+" - Flash Player Installation";var s=S.ie&&S.win?["Active"].concat("").join("X"):"PlugIn",p="MMredirectURL="+d.location.toString().replace(/&/g,"%26")+"&MMplayerType="+s+"&MMdoctitle="+v.title;if(typeof o.flashvars!=u?o.flashvars+="&"+p:o.flashvars=p,S.ie&&S.win&&4!=c.readyState){var h=V("div");a+="SWFObjectNew",h.setAttribute("id",a),c.parentNode.insertBefore(h,c),c.style.display="none",function(){4==c.readyState?c.parentNode.removeChild(c):setTimeout(arguments.callee,10)}()}M(t,o,a)}}function I(e){if(S.ie&&S.win&&4!=e.readyState){var t=V("div");e.parentNode.insertBefore(t,e),t.parentNode.replaceChild(F(e),t),e.style.display="none",function(){4==e.readyState?e.parentNode.removeChild(e):setTimeout(arguments.callee,10)}()}else e.parentNode.replaceChild(F(e),e)}function F(e){var t=V("div");if(S.win&&S.ie)t.innerHTML=e.innerHTML;else{var n=e.getElementsByTagName(l)[0];if(n){var r=n.childNodes;if(r)for(var i=r.length,o=0;o<i;o++)1==r[o].nodeType&&"PARAM"==r[o].nodeName||8==r[o].nodeType||t.appendChild(r[o].cloneNode(!0))}}return t}function M(e,t,n){var r,i=$(n);if(S.wk&&S.wk<312)return r;if(i)if(typeof e.id==u&&(e.id=n),S.ie&&S.win){var o="";for(var a in e)e[a]!=Object.prototype[a]&&("data"==a.toLowerCase()?t.movie=e[a]:"styleclass"==a.toLowerCase()?o+=' class="'+e[a]+'"':"classid"!=a.toLowerCase()&&(o+=" "+a+'="'+e[a]+'"'));var c="";for(var f in t)t[f]!=Object.prototype[f]&&(c+='<param name="'+f+'" value="'+t[f]+'" />');i.outerHTML='<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"'+o+">"+c+"</object>",b[b.length]=e.id,r=$(e.id)}else{var p=V(l);for(var d in p.setAttribute("type",s),e)e[d]!=Object.prototype[d]&&("styleclass"==d.toLowerCase()?p.setAttribute("class",e[d]):"classid"!=d.toLowerCase()&&p.setAttribute(d,e[d]));for(var v in t)t[v]!=Object.prototype[v]&&"movie"!=v.toLowerCase()&&B(p,v,t[v]);i.parentNode.replaceChild(p,i),r=p}return r}function B(e,t,n){var r=V("param");r.setAttribute("name",t),r.setAttribute("value",n),e.appendChild(r)}function L(e){var t=$(e);t&&"OBJECT"==t.nodeName&&(S.ie&&S.win?(t.style.display="none",function(){4==t.readyState?P(e):setTimeout(arguments.callee,10)}()):t.parentNode.removeChild(t))}function P(e){var t=$(e);if(t){for(var n in t)"function"==typeof t[n]&&(t[n]=null);t.parentNode.removeChild(t)}}function $(e){var t=null;try{t=v.getElementById(e)}catch(e){}return t}function V(e){return v.createElement(e)}function R(e){var t=S.pv,n=e.split(".");return n[0]=parseInt(n[0],10),n[1]=parseInt(n[1],10)||0,n[2]=parseInt(n[2],10)||0,t[0]>n[0]||t[0]==n[0]&&t[1]>n[1]||t[0]==n[0]&&t[1]==n[1]&&t[2]>=n[2]}function q(e,t,n,r){if(!S.ie||!S.mac){var i=v.getElementsByTagName("head")[0];if(i){var c=n&&"string"==typeof n?n:"screen";if(r&&(o=null,a=null),!o||a!=c){var s=V("style");s.setAttribute("type","text/css"),s.setAttribute("media",c),o=i.appendChild(s),S.ie&&S.win&&typeof v.styleSheets!=u&&v.styleSheets.length>0&&(o=v.styleSheets[v.styleSheets.length-1]),a=c}S.ie&&S.win?o&&typeof o.addRule==l&&o.addRule(e,t):o&&typeof v.createTextNode!=u&&o.appendChild(v.createTextNode(e+" {"+t+"}"))}}}function W(e,t){if(x){var n=t?"visible":"hidden";_&&$(e)?$(e).style.visibility=n:q("#"+e,"visibility:"+n)}}function D(e){return null!=/[\\\"<>\.;]/.exec(e)&&typeof encodeURIComponent!=u?encodeURIComponent(e):e}return S.w3&&((typeof v.readyState!=u&&"complete"==v.readyState||typeof v.readyState==u&&(v.getElementsByTagName("body")[0]||v.body))&&A(),_||(typeof v.addEventListener!=u&&v.addEventListener("DOMContentLoaded",A,!1),S.ie&&S.win&&(v.attachEvent(p,(function(){"complete"==v.readyState&&(v.detachEvent(p,arguments.callee),A())})),d==top&&function(){if(!_){try{v.documentElement.doScroll("left")}catch(e){return void setTimeout(arguments.callee,0)}A()}}()),S.wk&&function(){_||(/loaded|complete/.test(v.readyState)?A():setTimeout(arguments.callee,0))}(),O(A))),S.ie&&S.win&&window.attachEvent("onunload",(function(){for(var e=w.length,n=0;n<e;n++)w[n][0].detachEvent(w[n][1],w[n][2]);for(var r=b.length,i=0;i<r;i++)L(b[i]);for(var o in S)S[o]=null;for(var a in S=null,t)t[a]=null;t=null})),{registerObject:function(e,t,n,r){if(S.w3&&e&&t){var i={};i.id=e,i.swfVersion=t,i.expressInstall=n,i.callbackFn=r,m[m.length]=i,W(e,!1)}else r&&r({success:!1,id:e})},getObjectById:function(e){if(S.w3)return T(e)},embedSWF:function(e,t,n,r,i,o,a,c,s,f){var p={success:!1,id:t};S.w3&&!(S.wk&&S.wk<312)&&e&&t&&n&&r&&i?(W(t,!1),k((function(){n+="",r+="";var d={};if(s&&typeof s===l)for(var v in s)d[v]=s[v];d.data=e,d.width=n,d.height=r;var h={};if(c&&typeof c===l)for(var y in c)h[y]=c[y];if(a&&typeof a===l)for(var g in a)typeof h.flashvars!=u?h.flashvars+="&"+g+"="+a[g]:h.flashvars=g+"="+a[g];if(R(i)){var m=M(d,h,t);d.id==t&&W(t,!0),p.success=!0,p.ref=m}else{if(o&&N())return d.data=o,void C(d,h,t,f);W(t,!0)}f&&f(p)}))):f&&f(p)},switchOffAutoHideShow:function(){x=!1},ua:S,getFlashPlayerVersion:function(){return{major:S.pv[0],minor:S.pv[1],release:S.pv[2]}},hasFlashPlayerVersion:R,createSWF:function(e,t,n){return S.w3?M(e,t,n):void 0},showExpressInstall:function(e,t,n,r){S.w3&&N()&&C(e,t,n,r)},removeSWF:function(e){S.w3&&L(e)},createCSS:function(e,t,n,r){S.w3&&q(e,t,n,r)},addDomLoadEvent:k,addLoadEvent:O,getQueryParamValue:function(e){var t=v.location.search||v.location.hash;if(t){if(/\?/.test(t)&&(t=t.split("?")[1]),null==e)return D(t);for(var n=t.split("&"),r=0;r<n.length;r++)if(n[r].substring(0,n[r].indexOf("="))==e)return D(n[r].substring(n[r].indexOf("=")+1))}return""},expressInstallCallback:function(){if(j){var t=$(f);t&&e&&(t.parentNode.replaceChild(e,t),n&&(W(n,!0),S.ie&&S.win&&(e.style.display="block")),r&&r(i)),j=!1}}}}();e.exports=t},7:module=>{module.exports=function(obj){var __t,__p="",__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,"")};with(obj||{})__p+='<div id="embed-document" class="embed-resource"></div>';return __p}},469:(e,t,n)=>{var r;e=n.nmd(e),function(){var i="object"==typeof self&&self.self===self&&self||"object"==typeof n.g&&n.g.global===n.g&&n.g||this||{},o=i._,a=Array.prototype,u=Object.prototype,l="undefined"!=typeof Symbol?Symbol.prototype:null,c=a.push,s=a.slice,f=u.toString,p=u.hasOwnProperty,d=Array.isArray,v=Object.keys,h=Object.create,y=function(){},g=function(e){return e instanceof g?e:this instanceof g?void(this._wrapped=e):new g(e)};t.nodeType?i._=g:(!e.nodeType&&e.exports&&(t=e.exports=g),t._=g),g.VERSION="1.9.1";var m,b=function(e,t,n){if(void 0===t)return e;switch(null==n?3:n){case 1:return function(n){return e.call(t,n)};case 3:return function(n,r,i){return e.call(t,n,r,i)};case 4:return function(n,r,i,o){return e.call(t,n,r,i,o)}}return function(){return e.apply(t,arguments)}},w=function(e,t,n){return g.iteratee!==m?g.iteratee(e,t):null==e?g.identity:g.isFunction(e)?b(e,t,n):g.isObject(e)&&!g.isArray(e)?g.matcher(e):g.property(e)};g.iteratee=m=function(e,t){return w(e,t,1/0)};var _=function(e,t){return t=null==t?e.length-1:+t,function(){for(var n=Math.max(arguments.length-t,0),r=Array(n),i=0;i<n;i++)r[i]=arguments[i+t];switch(t){case 0:return e.call(this,r);case 1:return e.call(this,arguments[0],r);case 2:return e.call(this,arguments[0],arguments[1],r)}var o=Array(t+1);for(i=0;i<t;i++)o[i]=arguments[i];return o[t]=r,e.apply(this,o)}},j=function(e){if(!g.isObject(e))return{};if(h)return h(e);y.prototype=e;var t=new y;return y.prototype=null,t},x=function(e){return function(t){return null==t?void 0:t[e]}},S=function(e,t){return null!=e&&p.call(e,t)},A=function(e,t){for(var n=t.length,r=0;r<n;r++){if(null==e)return;e=e[t[r]]}return n?e:void 0},k=Math.pow(2,53)-1,O=x("length"),E=function(e){var t=O(e);return"number"==typeof t&&t>=0&&t<=k};g.each=g.forEach=function(e,t,n){var r,i;if(t=b(t,n),E(e))for(r=0,i=e.length;r<i;r++)t(e[r],r,e);else{var o=g.keys(e);for(r=0,i=o.length;r<i;r++)t(e[o[r]],o[r],e)}return e},g.map=g.collect=function(e,t,n){t=w(t,n);for(var r=!E(e)&&g.keys(e),i=(r||e).length,o=Array(i),a=0;a<i;a++){var u=r?r[a]:a;o[a]=t(e[u],u,e)}return o};var T=function(e){var t=function(t,n,r,i){var o=!E(t)&&g.keys(t),a=(o||t).length,u=e>0?0:a-1;for(i||(r=t[o?o[u]:u],u+=e);u>=0&&u<a;u+=e){var l=o?o[u]:u;r=n(r,t[l],l,t)}return r};return function(e,n,r,i){var o=arguments.length>=3;return t(e,b(n,i,4),r,o)}};g.reduce=g.foldl=g.inject=T(1),g.reduceRight=g.foldr=T(-1),g.find=g.detect=function(e,t,n){var r=(E(e)?g.findIndex:g.findKey)(e,t,n);if(void 0!==r&&-1!==r)return e[r]},g.filter=g.select=function(e,t,n){var r=[];return t=w(t,n),g.each(e,(function(e,n,i){t(e,n,i)&&r.push(e)})),r},g.reject=function(e,t,n){return g.filter(e,g.negate(w(t)),n)},g.every=g.all=function(e,t,n){t=w(t,n);for(var r=!E(e)&&g.keys(e),i=(r||e).length,o=0;o<i;o++){var a=r?r[o]:o;if(!t(e[a],a,e))return!1}return!0},g.some=g.any=function(e,t,n){t=w(t,n);for(var r=!E(e)&&g.keys(e),i=(r||e).length,o=0;o<i;o++){var a=r?r[o]:o;if(t(e[a],a,e))return!0}return!1},g.contains=g.includes=g.include=function(e,t,n,r){return E(e)||(e=g.values(e)),("number"!=typeof n||r)&&(n=0),g.indexOf(e,t,n)>=0},g.invoke=_((function(e,t,n){var r,i;return g.isFunction(t)?i=t:g.isArray(t)&&(r=t.slice(0,-1),t=t[t.length-1]),g.map(e,(function(e){var o=i;if(!o){if(r&&r.length&&(e=A(e,r)),null==e)return;o=e[t]}return null==o?o:o.apply(e,n)}))})),g.pluck=function(e,t){return g.map(e,g.property(t))},g.where=function(e,t){return g.filter(e,g.matcher(t))},g.findWhere=function(e,t){return g.find(e,g.matcher(t))},g.max=function(e,t,n){var r,i,o=-1/0,a=-1/0;if(null==t||"number"==typeof t&&"object"!=typeof e[0]&&null!=e)for(var u=0,l=(e=E(e)?e:g.values(e)).length;u<l;u++)null!=(r=e[u])&&r>o&&(o=r);else t=w(t,n),g.each(e,(function(e,n,r){((i=t(e,n,r))>a||i===-1/0&&o===-1/0)&&(o=e,a=i)}));return o},g.min=function(e,t,n){var r,i,o=1/0,a=1/0;if(null==t||"number"==typeof t&&"object"!=typeof e[0]&&null!=e)for(var u=0,l=(e=E(e)?e:g.values(e)).length;u<l;u++)null!=(r=e[u])&&r<o&&(o=r);else t=w(t,n),g.each(e,(function(e,n,r){((i=t(e,n,r))<a||i===1/0&&o===1/0)&&(o=e,a=i)}));return o},g.shuffle=function(e){return g.sample(e,1/0)},g.sample=function(e,t,n){if(null==t||n)return E(e)||(e=g.values(e)),e[g.random(e.length-1)];var r=E(e)?g.clone(e):g.values(e),i=O(r);t=Math.max(Math.min(t,i),0);for(var o=i-1,a=0;a<t;a++){var u=g.random(a,o),l=r[a];r[a]=r[u],r[u]=l}return r.slice(0,t)},g.sortBy=function(e,t,n){var r=0;return t=w(t,n),g.pluck(g.map(e,(function(e,n,i){return{value:e,index:r++,criteria:t(e,n,i)}})).sort((function(e,t){var n=e.criteria,r=t.criteria;if(n!==r){if(n>r||void 0===n)return 1;if(n<r||void 0===r)return-1}return e.index-t.index})),"value")};var N=function(e,t){return function(n,r,i){var o=t?[[],[]]:{};return r=w(r,i),g.each(n,(function(t,i){var a=r(t,i,n);e(o,t,a)})),o}};g.groupBy=N((function(e,t,n){S(e,n)?e[n].push(t):e[n]=[t]})),g.indexBy=N((function(e,t,n){e[n]=t})),g.countBy=N((function(e,t,n){S(e,n)?e[n]++:e[n]=1}));var C=/[^\ud800-\udfff]|[\ud800-\udbff][\udc00-\udfff]|[\ud800-\udfff]/g;g.toArray=function(e){return e?g.isArray(e)?s.call(e):g.isString(e)?e.match(C):E(e)?g.map(e,g.identity):g.values(e):[]},g.size=function(e){return null==e?0:E(e)?e.length:g.keys(e).length},g.partition=N((function(e,t,n){e[n?0:1].push(t)}),!0),g.first=g.head=g.take=function(e,t,n){return null==e||e.length<1?null==t?void 0:[]:null==t||n?e[0]:g.initial(e,e.length-t)},g.initial=function(e,t,n){return s.call(e,0,Math.max(0,e.length-(null==t||n?1:t)))},g.last=function(e,t,n){return null==e||e.length<1?null==t?void 0:[]:null==t||n?e[e.length-1]:g.rest(e,Math.max(0,e.length-t))},g.rest=g.tail=g.drop=function(e,t,n){return s.call(e,null==t||n?1:t)},g.compact=function(e){return g.filter(e,Boolean)};var I=function(e,t,n,r){for(var i=(r=r||[]).length,o=0,a=O(e);o<a;o++){var u=e[o];if(E(u)&&(g.isArray(u)||g.isArguments(u)))if(t)for(var l=0,c=u.length;l<c;)r[i++]=u[l++];else I(u,t,n,r),i=r.length;else n||(r[i++]=u)}return r};g.flatten=function(e,t){return I(e,t,!1)},g.without=_((function(e,t){return g.difference(e,t)})),g.uniq=g.unique=function(e,t,n,r){g.isBoolean(t)||(r=n,n=t,t=!1),null!=n&&(n=w(n,r));for(var i=[],o=[],a=0,u=O(e);a<u;a++){var l=e[a],c=n?n(l,a,e):l;t&&!n?(a&&o===c||i.push(l),o=c):n?g.contains(o,c)||(o.push(c),i.push(l)):g.contains(i,l)||i.push(l)}return i},g.union=_((function(e){return g.uniq(I(e,!0,!0))})),g.intersection=function(e){for(var t=[],n=arguments.length,r=0,i=O(e);r<i;r++){var o=e[r];if(!g.contains(t,o)){var a;for(a=1;a<n&&g.contains(arguments[a],o);a++);a===n&&t.push(o)}}return t},g.difference=_((function(e,t){return t=I(t,!0,!0),g.filter(e,(function(e){return!g.contains(t,e)}))})),g.unzip=function(e){for(var t=e&&g.max(e,O).length||0,n=Array(t),r=0;r<t;r++)n[r]=g.pluck(e,r);return n},g.zip=_(g.unzip),g.object=function(e,t){for(var n={},r=0,i=O(e);r<i;r++)t?n[e[r]]=t[r]:n[e[r][0]]=e[r][1];return n};var F=function(e){return function(t,n,r){n=w(n,r);for(var i=O(t),o=e>0?0:i-1;o>=0&&o<i;o+=e)if(n(t[o],o,t))return o;return-1}};g.findIndex=F(1),g.findLastIndex=F(-1),g.sortedIndex=function(e,t,n,r){for(var i=(n=w(n,r,1))(t),o=0,a=O(e);o<a;){var u=Math.floor((o+a)/2);n(e[u])<i?o=u+1:a=u}return o};var M=function(e,t,n){return function(r,i,o){var a=0,u=O(r);if("number"==typeof o)e>0?a=o>=0?o:Math.max(o+u,a):u=o>=0?Math.min(o+1,u):o+u+1;else if(n&&o&&u)return r[o=n(r,i)]===i?o:-1;if(i!=i)return(o=t(s.call(r,a,u),g.isNaN))>=0?o+a:-1;for(o=e>0?a:u-1;o>=0&&o<u;o+=e)if(r[o]===i)return o;return-1}};g.indexOf=M(1,g.findIndex,g.sortedIndex),g.lastIndexOf=M(-1,g.findLastIndex),g.range=function(e,t,n){null==t&&(t=e||0,e=0),n||(n=t<e?-1:1);for(var r=Math.max(Math.ceil((t-e)/n),0),i=Array(r),o=0;o<r;o++,e+=n)i[o]=e;return i},g.chunk=function(e,t){if(null==t||t<1)return[];for(var n=[],r=0,i=e.length;r<i;)n.push(s.call(e,r,r+=t));return n};var B=function(e,t,n,r,i){if(!(r instanceof t))return e.apply(n,i);var o=j(e.prototype),a=e.apply(o,i);return g.isObject(a)?a:o};g.bind=_((function(e,t,n){if(!g.isFunction(e))throw new TypeError("Bind must be called on a function");var r=_((function(i){return B(e,r,t,this,n.concat(i))}));return r})),g.partial=_((function(e,t){var n=g.partial.placeholder,r=function(){for(var i=0,o=t.length,a=Array(o),u=0;u<o;u++)a[u]=t[u]===n?arguments[i++]:t[u];for(;i<arguments.length;)a.push(arguments[i++]);return B(e,r,this,this,a)};return r})),g.partial.placeholder=g,g.bindAll=_((function(e,t){var n=(t=I(t,!1,!1)).length;if(n<1)throw new Error("bindAll must be passed function names");for(;n--;){var r=t[n];e[r]=g.bind(e[r],e)}})),g.memoize=function(e,t){var n=function(r){var i=n.cache,o=""+(t?t.apply(this,arguments):r);return S(i,o)||(i[o]=e.apply(this,arguments)),i[o]};return n.cache={},n},g.delay=_((function(e,t,n){return setTimeout((function(){return e.apply(null,n)}),t)})),g.defer=g.partial(g.delay,g,1),g.throttle=function(e,t,n){var r,i,o,a,u=0;n||(n={});var l=function(){u=!1===n.leading?0:g.now(),r=null,a=e.apply(i,o),r||(i=o=null)},c=function(){var c=g.now();u||!1!==n.leading||(u=c);var s=t-(c-u);return i=this,o=arguments,s<=0||s>t?(r&&(clearTimeout(r),r=null),u=c,a=e.apply(i,o),r||(i=o=null)):r||!1===n.trailing||(r=setTimeout(l,s)),a};return c.cancel=function(){clearTimeout(r),u=0,r=i=o=null},c},g.debounce=function(e,t,n){var r,i,o=function(t,n){r=null,n&&(i=e.apply(t,n))},a=_((function(a){if(r&&clearTimeout(r),n){var u=!r;r=setTimeout(o,t),u&&(i=e.apply(this,a))}else r=g.delay(o,t,this,a);return i}));return a.cancel=function(){clearTimeout(r),r=null},a},g.wrap=function(e,t){return g.partial(t,e)},g.negate=function(e){return function(){return!e.apply(this,arguments)}},g.compose=function(){var e=arguments,t=e.length-1;return function(){for(var n=t,r=e[t].apply(this,arguments);n--;)r=e[n].call(this,r);return r}},g.after=function(e,t){return function(){if(--e<1)return t.apply(this,arguments)}},g.before=function(e,t){var n;return function(){return--e>0&&(n=t.apply(this,arguments)),e<=1&&(t=null),n}},g.once=g.partial(g.before,2),g.restArguments=_;var L=!{toString:null}.propertyIsEnumerable("toString"),P=["valueOf","isPrototypeOf","toString","propertyIsEnumerable","hasOwnProperty","toLocaleString"],$=function(e,t){var n=P.length,r=e.constructor,i=g.isFunction(r)&&r.prototype||u,o="constructor";for(S(e,o)&&!g.contains(t,o)&&t.push(o);n--;)(o=P[n])in e&&e[o]!==i[o]&&!g.contains(t,o)&&t.push(o)};g.keys=function(e){if(!g.isObject(e))return[];if(v)return v(e);var t=[];for(var n in e)S(e,n)&&t.push(n);return L&&$(e,t),t},g.allKeys=function(e){if(!g.isObject(e))return[];var t=[];for(var n in e)t.push(n);return L&&$(e,t),t},g.values=function(e){for(var t=g.keys(e),n=t.length,r=Array(n),i=0;i<n;i++)r[i]=e[t[i]];return r},g.mapObject=function(e,t,n){t=w(t,n);for(var r=g.keys(e),i=r.length,o={},a=0;a<i;a++){var u=r[a];o[u]=t(e[u],u,e)}return o},g.pairs=function(e){for(var t=g.keys(e),n=t.length,r=Array(n),i=0;i<n;i++)r[i]=[t[i],e[t[i]]];return r},g.invert=function(e){for(var t={},n=g.keys(e),r=0,i=n.length;r<i;r++)t[e[n[r]]]=n[r];return t},g.functions=g.methods=function(e){var t=[];for(var n in e)g.isFunction(e[n])&&t.push(n);return t.sort()};var V=function(e,t){return function(n){var r=arguments.length;if(t&&(n=Object(n)),r<2||null==n)return n;for(var i=1;i<r;i++)for(var o=arguments[i],a=e(o),u=a.length,l=0;l<u;l++){var c=a[l];t&&void 0!==n[c]||(n[c]=o[c])}return n}};g.extend=V(g.allKeys),g.extendOwn=g.assign=V(g.keys),g.findKey=function(e,t,n){t=w(t,n);for(var r,i=g.keys(e),o=0,a=i.length;o<a;o++)if(t(e[r=i[o]],r,e))return r};var R,q,W=function(e,t,n){return t in n};g.pick=_((function(e,t){var n={},r=t[0];if(null==e)return n;g.isFunction(r)?(t.length>1&&(r=b(r,t[1])),t=g.allKeys(e)):(r=W,t=I(t,!1,!1),e=Object(e));for(var i=0,o=t.length;i<o;i++){var a=t[i],u=e[a];r(u,a,e)&&(n[a]=u)}return n})),g.omit=_((function(e,t){var n,r=t[0];return g.isFunction(r)?(r=g.negate(r),t.length>1&&(n=t[1])):(t=g.map(I(t,!1,!1),String),r=function(e,n){return!g.contains(t,n)}),g.pick(e,r,n)})),g.defaults=V(g.allKeys,!0),g.create=function(e,t){var n=j(e);return t&&g.extendOwn(n,t),n},g.clone=function(e){return g.isObject(e)?g.isArray(e)?e.slice():g.extend({},e):e},g.tap=function(e,t){return t(e),e},g.isMatch=function(e,t){var n=g.keys(t),r=n.length;if(null==e)return!r;for(var i=Object(e),o=0;o<r;o++){var a=n[o];if(t[a]!==i[a]||!(a in i))return!1}return!0},R=function(e,t,n,r){if(e===t)return 0!==e||1/e==1/t;if(null==e||null==t)return!1;if(e!=e)return t!=t;var i=typeof e;return("function"===i||"object"===i||"object"==typeof t)&&q(e,t,n,r)},q=function(e,t,n,r){e instanceof g&&(e=e._wrapped),t instanceof g&&(t=t._wrapped);var i=f.call(e);if(i!==f.call(t))return!1;switch(i){case"[object RegExp]":case"[object String]":return""+e==""+t;case"[object Number]":return+e!=+e?+t!=+t:0==+e?1/+e==1/t:+e==+t;case"[object Date]":case"[object Boolean]":return+e==+t;case"[object Symbol]":return l.valueOf.call(e)===l.valueOf.call(t)}var o="[object Array]"===i;if(!o){if("object"!=typeof e||"object"!=typeof t)return!1;var a=e.constructor,u=t.constructor;if(a!==u&&!(g.isFunction(a)&&a instanceof a&&g.isFunction(u)&&u instanceof u)&&"constructor"in e&&"constructor"in t)return!1}r=r||[];for(var c=(n=n||[]).length;c--;)if(n[c]===e)return r[c]===t;if(n.push(e),r.push(t),o){if((c=e.length)!==t.length)return!1;for(;c--;)if(!R(e[c],t[c],n,r))return!1}else{var s,p=g.keys(e);if(c=p.length,g.keys(t).length!==c)return!1;for(;c--;)if(s=p[c],!S(t,s)||!R(e[s],t[s],n,r))return!1}return n.pop(),r.pop(),!0},g.isEqual=function(e,t){return R(e,t)},g.isEmpty=function(e){return null==e||(E(e)&&(g.isArray(e)||g.isString(e)||g.isArguments(e))?0===e.length:0===g.keys(e).length)},g.isElement=function(e){return!(!e||1!==e.nodeType)},g.isArray=d||function(e){return"[object Array]"===f.call(e)},g.isObject=function(e){var t=typeof e;return"function"===t||"object"===t&&!!e},g.each(["Arguments","Function","String","Number","Date","RegExp","Error","Symbol","Map","WeakMap","Set","WeakSet"],(function(e){g["is"+e]=function(t){return f.call(t)==="[object "+e+"]"}})),g.isArguments(arguments)||(g.isArguments=function(e){return S(e,"callee")});var D=i.document&&i.document.childNodes;"object"!=typeof Int8Array&&"function"!=typeof D&&(g.isFunction=function(e){return"function"==typeof e||!1}),g.isFinite=function(e){return!g.isSymbol(e)&&isFinite(e)&&!isNaN(parseFloat(e))},g.isNaN=function(e){return g.isNumber(e)&&isNaN(e)},g.isBoolean=function(e){return!0===e||!1===e||"[object Boolean]"===f.call(e)},g.isNull=function(e){return null===e},g.isUndefined=function(e){return void 0===e},g.has=function(e,t){if(!g.isArray(t))return S(e,t);for(var n=t.length,r=0;r<n;r++){var i=t[r];if(null==e||!p.call(e,i))return!1;e=e[i]}return!!n},g.noConflict=function(){return i._=o,this},g.identity=function(e){return e},g.constant=function(e){return function(){return e}},g.noop=function(){},g.property=function(e){return g.isArray(e)?function(t){return A(t,e)}:x(e)},g.propertyOf=function(e){return null==e?function(){}:function(t){return g.isArray(t)?A(e,t):e[t]}},g.matcher=g.matches=function(e){return e=g.extendOwn({},e),function(t){return g.isMatch(t,e)}},g.times=function(e,t,n){var r=Array(Math.max(0,e));t=b(t,n,1);for(var i=0;i<e;i++)r[i]=t(i);return r},g.random=function(e,t){return null==t&&(t=e,e=0),e+Math.floor(Math.random()*(t-e+1))},g.now=Date.now||function(){return(new Date).getTime()};var K={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#x27;","`":"&#x60;"},z=g.invert(K),H=function(e){var t=function(t){return e[t]},n="(?:"+g.keys(e).join("|")+")",r=RegExp(n),i=RegExp(n,"g");return function(e){return e=null==e?"":""+e,r.test(e)?e.replace(i,t):e}};g.escape=H(K),g.unescape=H(z),g.result=function(e,t,n){g.isArray(t)||(t=[t]);var r=t.length;if(!r)return g.isFunction(n)?n.call(e):n;for(var i=0;i<r;i++){var o=null==e?void 0:e[t[i]];void 0===o&&(o=n,i=r),e=g.isFunction(o)?o.call(e):o}return e};var J=0;g.uniqueId=function(e){var t=++J+"";return e?e+t:t},g.templateSettings={evaluate:/<%([\s\S]+?)%>/g,interpolate:/<%=([\s\S]+?)%>/g,escape:/<%-([\s\S]+?)%>/g};var U=/(.)^/,Z={"'":"'","\\":"\\","\r":"r","\n":"n","\u2028":"u2028","\u2029":"u2029"},G=/\\|'|\r|\n|\u2028|\u2029/g,X=function(e){return"\\"+Z[e]};g.template=function(e,t,n){!t&&n&&(t=n),t=g.defaults({},t,g.templateSettings);var r,i=RegExp([(t.escape||U).source,(t.interpolate||U).source,(t.evaluate||U).source].join("|")+"|$","g"),o=0,a="__p+='";e.replace(i,(function(t,n,r,i,u){return a+=e.slice(o,u).replace(G,X),o=u+t.length,n?a+="'+\n((__t=("+n+"))==null?'':_.escape(__t))+\n'":r?a+="'+\n((__t=("+r+"))==null?'':__t)+\n'":i&&(a+="';\n"+i+"\n__p+='"),t})),a+="';\n",t.variable||(a="with(obj||{}){\n"+a+"}\n"),a="var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};\n"+a+"return __p;\n";try{r=new Function(t.variable||"obj","_",a)}catch(e){throw e.source=a,e}var u=function(e){return r.call(this,e,g)},l=t.variable||"obj";return u.source="function("+l+"){\n"+a+"}",u},g.chain=function(e){var t=g(e);return t._chain=!0,t};var Q=function(e,t){return e._chain?g(t).chain():t};g.mixin=function(e){return g.each(g.functions(e),(function(t){var n=g[t]=e[t];g.prototype[t]=function(){var e=[this._wrapped];return c.apply(e,arguments),Q(this,n.apply(g,e))}})),g},g.mixin(g),g.each(["pop","push","reverse","shift","sort","splice","unshift"],(function(e){var t=a[e];g.prototype[e]=function(){var n=this._wrapped;return t.apply(n,arguments),"shift"!==e&&"splice"!==e||0!==n.length||delete n[0],Q(this,n)}})),g.each(["concat","join","slice"],(function(e){var t=a[e];g.prototype[e]=function(){return Q(this,t.apply(this._wrapped,arguments))}})),g.prototype.value=function(){return this._wrapped},g.prototype.valueOf=g.prototype.toJSON=g.prototype.value,g.prototype.toString=function(){return String(this._wrapped)},void 0===(r=function(){return g}.apply(t,[]))||(e.exports=r)}()}},__webpack_module_cache__={};function __webpack_require__(e){var t=__webpack_module_cache__[e];if(void 0!==t)return t.exports;var n=__webpack_module_cache__[e]={id:e,loaded:!1,exports:{}};return __webpack_modules__[e].call(n.exports,n,n.exports,__webpack_require__),n.loaded=!0,n.exports}__webpack_require__.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}(),__webpack_require__.nmd=e=>(e.paths=[],e.children||(e.children=[]),e);var __webpack_exports__={};(()=>{"use strict";var e=__webpack_require__(379),t=__webpack_require__(82),n=__webpack_require__(7);window.embedPlugin=new function(){this.configService=new t.default;var r=document.getElementsByClassName("document-player");this.$documentContainer=r[0],this.$documentContainer.insertAdjacentHTML("afterbegin",n(this.configService.get("resource"))),this.documentEmbedContainerId="embed-document";var i=this.configService.get("resource.url"),o=window.location.protocol;"http:"===i.substring(0,o.length)||"https:"===i.substring(0,o.length)||(i=window.location.protocol+i),e.embedSWF("/assets/vendors/alchemy-embed-medias/players/flexpaper/FlexPaperViewer.swf",this.documentEmbedContainerId,"100%","100%","9.0.0",!1,!1,{menu:"false",flashvars:"SwfFile="+i+"&Scale=0.6&ZoomTransition=easeOut&ZoomTime=0.5&ZoomInterval=0.1&FitPageOnLoad=true&FitWidthOnLoad=true&PrintEnabled=true&FullScreenAsMaxWindow=false&localeChain={{app.locale}}",movie:"/assets/vendors/alchemy-embed-medias/players/flexpaper/FlexPaperViewer.swf",allowFullScreen:"true",wmode:"transparent"},!1)}})()})();
//# sourceMappingURL=document_flexpaper.js.map