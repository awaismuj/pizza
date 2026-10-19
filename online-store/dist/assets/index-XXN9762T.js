var Ep=Object.defineProperty;var _p=(s,f,u)=>f in s?Ep(s,f,{enumerable:!0,configurable:!0,writable:!0,value:u}):s[f]=u;var gc=(s,f,u)=>_p(s,typeof f!="symbol"?f+"":f,u);(function(){const f=document.createElement("link").relList;if(f&&f.supports&&f.supports("modulepreload"))return;for(const w of document.querySelectorAll('link[rel="modulepreload"]'))k(w);new MutationObserver(w=>{for(const _ of w)if(_.type==="childList")for(const q of _.addedNodes)q.tagName==="LINK"&&q.rel==="modulepreload"&&k(q)}).observe(document,{childList:!0,subtree:!0});function u(w){const _={};return w.integrity&&(_.integrity=w.integrity),w.referrerPolicy&&(_.referrerPolicy=w.referrerPolicy),w.crossOrigin==="use-credentials"?_.credentials="include":w.crossOrigin==="anonymous"?_.credentials="omit":_.credentials="same-origin",_}function k(w){if(w.ep)return;w.ep=!0;const _=u(w);fetch(w.href,_)}})();function Dc(s){return s&&s.__esModule&&Object.prototype.hasOwnProperty.call(s,"default")?s.default:s}var Ba={exports:{}},Ao={},Ua={exports:{}},ze={};/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var vc;function Pp(){if(vc)return ze;vc=1;var s=Symbol.for("react.element"),f=Symbol.for("react.portal"),u=Symbol.for("react.fragment"),k=Symbol.for("react.strict_mode"),w=Symbol.for("react.profiler"),_=Symbol.for("react.provider"),q=Symbol.for("react.context"),Y=Symbol.for("react.forward_ref"),$=Symbol.for("react.suspense"),ge=Symbol.for("react.memo"),O=Symbol.for("react.lazy"),T=Symbol.iterator;function B(h){return h===null||typeof h!="object"?null:(h=T&&h[T]||h["@@iterator"],typeof h=="function"?h:null)}var se={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},ae=Object.assign,J={};function F(h,j,ue){this.props=h,this.context=j,this.refs=J,this.updater=ue||se}F.prototype.isReactComponent={},F.prototype.setState=function(h,j){if(typeof h!="object"&&typeof h!="function"&&h!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,h,j,"setState")},F.prototype.forceUpdate=function(h){this.updater.enqueueForceUpdate(this,h,"forceUpdate")};function te(){}te.prototype=F.prototype;function xe(h,j,ue){this.props=h,this.context=j,this.refs=J,this.updater=ue||se}var Ne=xe.prototype=new te;Ne.constructor=xe,ae(Ne,F.prototype),Ne.isPureReactComponent=!0;var he=Array.isArray,oe=Object.prototype.hasOwnProperty,ve={current:null},ye={key:!0,ref:!0,__self:!0,__source:!0};function Ce(h,j,ue){var we,ke={},be=null,_e=null;if(j!=null)for(we in j.ref!==void 0&&(_e=j.ref),j.key!==void 0&&(be=""+j.key),j)oe.call(j,we)&&!ye.hasOwnProperty(we)&&(ke[we]=j[we]);var Te=arguments.length-2;if(Te===1)ke.children=ue;else if(1<Te){for(var M=Array(Te),Be=0;Be<Te;Be++)M[Be]=arguments[Be+2];ke.children=M}if(h&&h.defaultProps)for(we in Te=h.defaultProps,Te)ke[we]===void 0&&(ke[we]=Te[we]);return{$$typeof:s,type:h,key:be,ref:_e,props:ke,_owner:ve.current}}function re(h,j){return{$$typeof:s,type:h.type,key:j,ref:h.ref,props:h.props,_owner:h._owner}}function He(h){return typeof h=="object"&&h!==null&&h.$$typeof===s}function Le(h){var j={"=":"=0",":":"=2"};return"$"+h.replace(/[=:]/g,function(ue){return j[ue]})}var I=/\/+/g;function ne(h,j){return typeof h=="object"&&h!==null&&h.key!=null?Le(""+h.key):j.toString(36)}function S(h,j,ue,we,ke){var be=typeof h;(be==="undefined"||be==="boolean")&&(h=null);var _e=!1;if(h===null)_e=!0;else switch(be){case"string":case"number":_e=!0;break;case"object":switch(h.$$typeof){case s:case f:_e=!0}}if(_e)return _e=h,ke=ke(_e),h=we===""?"."+ne(_e,0):we,he(ke)?(ue="",h!=null&&(ue=h.replace(I,"$&/")+"/"),S(ke,j,ue,"",function(Be){return Be})):ke!=null&&(He(ke)&&(ke=re(ke,ue+(!ke.key||_e&&_e.key===ke.key?"":(""+ke.key).replace(I,"$&/")+"/")+h)),j.push(ke)),1;if(_e=0,we=we===""?".":we+":",he(h))for(var Te=0;Te<h.length;Te++){be=h[Te];var M=we+ne(be,Te);_e+=S(be,j,ue,M,ke)}else if(M=B(h),typeof M=="function")for(h=M.call(h),Te=0;!(be=h.next()).done;)be=be.value,M=we+ne(be,Te++),_e+=S(be,j,ue,M,ke);else if(be==="object")throw j=String(h),Error("Objects are not valid as a React child (found: "+(j==="[object Object]"?"object with keys {"+Object.keys(h).join(", ")+"}":j)+"). If you meant to render a collection of children, use an array instead.");return _e}function A(h,j,ue){if(h==null)return h;var we=[],ke=0;return S(h,we,"","",function(be){return j.call(ue,be,ke++)}),we}function ce(h){if(h._status===-1){var j=h._result;j=j(),j.then(function(ue){(h._status===0||h._status===-1)&&(h._status=1,h._result=ue)},function(ue){(h._status===0||h._status===-1)&&(h._status=2,h._result=ue)}),h._status===-1&&(h._status=0,h._result=j)}if(h._status===1)return h._result.default;throw h._result}var me={current:null},L={transition:null},W={ReactCurrentDispatcher:me,ReactCurrentBatchConfig:L,ReactCurrentOwner:ve};function D(){throw Error("act(...) is not supported in production builds of React.")}return ze.Children={map:A,forEach:function(h,j,ue){A(h,function(){j.apply(this,arguments)},ue)},count:function(h){var j=0;return A(h,function(){j++}),j},toArray:function(h){return A(h,function(j){return j})||[]},only:function(h){if(!He(h))throw Error("React.Children.only expected to receive a single React element child.");return h}},ze.Component=F,ze.Fragment=u,ze.Profiler=w,ze.PureComponent=xe,ze.StrictMode=k,ze.Suspense=$,ze.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=W,ze.act=D,ze.cloneElement=function(h,j,ue){if(h==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+h+".");var we=ae({},h.props),ke=h.key,be=h.ref,_e=h._owner;if(j!=null){if(j.ref!==void 0&&(be=j.ref,_e=ve.current),j.key!==void 0&&(ke=""+j.key),h.type&&h.type.defaultProps)var Te=h.type.defaultProps;for(M in j)oe.call(j,M)&&!ye.hasOwnProperty(M)&&(we[M]=j[M]===void 0&&Te!==void 0?Te[M]:j[M])}var M=arguments.length-2;if(M===1)we.children=ue;else if(1<M){Te=Array(M);for(var Be=0;Be<M;Be++)Te[Be]=arguments[Be+2];we.children=Te}return{$$typeof:s,type:h.type,key:ke,ref:be,props:we,_owner:_e}},ze.createContext=function(h){return h={$$typeof:q,_currentValue:h,_currentValue2:h,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},h.Provider={$$typeof:_,_context:h},h.Consumer=h},ze.createElement=Ce,ze.createFactory=function(h){var j=Ce.bind(null,h);return j.type=h,j},ze.createRef=function(){return{current:null}},ze.forwardRef=function(h){return{$$typeof:Y,render:h}},ze.isValidElement=He,ze.lazy=function(h){return{$$typeof:O,_payload:{_status:-1,_result:h},_init:ce}},ze.memo=function(h,j){return{$$typeof:ge,type:h,compare:j===void 0?null:j}},ze.startTransition=function(h){var j=L.transition;L.transition={};try{h()}finally{L.transition=j}},ze.unstable_act=D,ze.useCallback=function(h,j){return me.current.useCallback(h,j)},ze.useContext=function(h){return me.current.useContext(h)},ze.useDebugValue=function(){},ze.useDeferredValue=function(h){return me.current.useDeferredValue(h)},ze.useEffect=function(h,j){return me.current.useEffect(h,j)},ze.useId=function(){return me.current.useId()},ze.useImperativeHandle=function(h,j,ue){return me.current.useImperativeHandle(h,j,ue)},ze.useInsertionEffect=function(h,j){return me.current.useInsertionEffect(h,j)},ze.useLayoutEffect=function(h,j){return me.current.useLayoutEffect(h,j)},ze.useMemo=function(h,j){return me.current.useMemo(h,j)},ze.useReducer=function(h,j,ue){return me.current.useReducer(h,j,ue)},ze.useRef=function(h){return me.current.useRef(h)},ze.useState=function(h){return me.current.useState(h)},ze.useSyncExternalStore=function(h,j,ue){return me.current.useSyncExternalStore(h,j,ue)},ze.useTransition=function(){return me.current.useTransition()},ze.version="18.3.1",ze}var xc;function Ja(){return xc||(xc=1,Ua.exports=Pp()),Ua.exports}/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var yc;function Tp(){if(yc)return Ao;yc=1;var s=Ja(),f=Symbol.for("react.element"),u=Symbol.for("react.fragment"),k=Object.prototype.hasOwnProperty,w=s.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,_={key:!0,ref:!0,__self:!0,__source:!0};function q(Y,$,ge){var O,T={},B=null,se=null;ge!==void 0&&(B=""+ge),$.key!==void 0&&(B=""+$.key),$.ref!==void 0&&(se=$.ref);for(O in $)k.call($,O)&&!_.hasOwnProperty(O)&&(T[O]=$[O]);if(Y&&Y.defaultProps)for(O in $=Y.defaultProps,$)T[O]===void 0&&(T[O]=$[O]);return{$$typeof:f,type:Y,key:B,ref:se,props:T,_owner:w.current}}return Ao.Fragment=u,Ao.jsx=q,Ao.jsxs=q,Ao}var wc;function Lp(){return wc||(wc=1,Ba.exports=Tp()),Ba.exports}var i=Lp(),z=Ja();const $c=Dc(z);var qi={},Wa={exports:{}},bt={},Ha={exports:{}},Qa={};/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var bc;function Rp(){return bc||(bc=1,(function(s){function f(L,W){var D=L.length;L.push(W);e:for(;0<D;){var h=D-1>>>1,j=L[h];if(0<w(j,W))L[h]=W,L[D]=j,D=h;else break e}}function u(L){return L.length===0?null:L[0]}function k(L){if(L.length===0)return null;var W=L[0],D=L.pop();if(D!==W){L[0]=D;e:for(var h=0,j=L.length,ue=j>>>1;h<ue;){var we=2*(h+1)-1,ke=L[we],be=we+1,_e=L[be];if(0>w(ke,D))be<j&&0>w(_e,ke)?(L[h]=_e,L[be]=D,h=be):(L[h]=ke,L[we]=D,h=we);else if(be<j&&0>w(_e,D))L[h]=_e,L[be]=D,h=be;else break e}}return W}function w(L,W){var D=L.sortIndex-W.sortIndex;return D!==0?D:L.id-W.id}if(typeof performance=="object"&&typeof performance.now=="function"){var _=performance;s.unstable_now=function(){return _.now()}}else{var q=Date,Y=q.now();s.unstable_now=function(){return q.now()-Y}}var $=[],ge=[],O=1,T=null,B=3,se=!1,ae=!1,J=!1,F=typeof setTimeout=="function"?setTimeout:null,te=typeof clearTimeout=="function"?clearTimeout:null,xe=typeof setImmediate<"u"?setImmediate:null;typeof navigator<"u"&&navigator.scheduling!==void 0&&navigator.scheduling.isInputPending!==void 0&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function Ne(L){for(var W=u(ge);W!==null;){if(W.callback===null)k(ge);else if(W.startTime<=L)k(ge),W.sortIndex=W.expirationTime,f($,W);else break;W=u(ge)}}function he(L){if(J=!1,Ne(L),!ae)if(u($)!==null)ae=!0,ce(oe);else{var W=u(ge);W!==null&&me(he,W.startTime-L)}}function oe(L,W){ae=!1,J&&(J=!1,te(Ce),Ce=-1),se=!0;var D=B;try{for(Ne(W),T=u($);T!==null&&(!(T.expirationTime>W)||L&&!Le());){var h=T.callback;if(typeof h=="function"){T.callback=null,B=T.priorityLevel;var j=h(T.expirationTime<=W);W=s.unstable_now(),typeof j=="function"?T.callback=j:T===u($)&&k($),Ne(W)}else k($);T=u($)}if(T!==null)var ue=!0;else{var we=u(ge);we!==null&&me(he,we.startTime-W),ue=!1}return ue}finally{T=null,B=D,se=!1}}var ve=!1,ye=null,Ce=-1,re=5,He=-1;function Le(){return!(s.unstable_now()-He<re)}function I(){if(ye!==null){var L=s.unstable_now();He=L;var W=!0;try{W=ye(!0,L)}finally{W?ne():(ve=!1,ye=null)}}else ve=!1}var ne;if(typeof xe=="function")ne=function(){xe(I)};else if(typeof MessageChannel<"u"){var S=new MessageChannel,A=S.port2;S.port1.onmessage=I,ne=function(){A.postMessage(null)}}else ne=function(){F(I,0)};function ce(L){ye=L,ve||(ve=!0,ne())}function me(L,W){Ce=F(function(){L(s.unstable_now())},W)}s.unstable_IdlePriority=5,s.unstable_ImmediatePriority=1,s.unstable_LowPriority=4,s.unstable_NormalPriority=3,s.unstable_Profiling=null,s.unstable_UserBlockingPriority=2,s.unstable_cancelCallback=function(L){L.callback=null},s.unstable_continueExecution=function(){ae||se||(ae=!0,ce(oe))},s.unstable_forceFrameRate=function(L){0>L||125<L?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):re=0<L?Math.floor(1e3/L):5},s.unstable_getCurrentPriorityLevel=function(){return B},s.unstable_getFirstCallbackNode=function(){return u($)},s.unstable_next=function(L){switch(B){case 1:case 2:case 3:var W=3;break;default:W=B}var D=B;B=W;try{return L()}finally{B=D}},s.unstable_pauseExecution=function(){},s.unstable_requestPaint=function(){},s.unstable_runWithPriority=function(L,W){switch(L){case 1:case 2:case 3:case 4:case 5:break;default:L=3}var D=B;B=L;try{return W()}finally{B=D}},s.unstable_scheduleCallback=function(L,W,D){var h=s.unstable_now();switch(typeof D=="object"&&D!==null?(D=D.delay,D=typeof D=="number"&&0<D?h+D:h):D=h,L){case 1:var j=-1;break;case 2:j=250;break;case 5:j=1073741823;break;case 4:j=1e4;break;default:j=5e3}return j=D+j,L={id:O++,callback:W,priorityLevel:L,startTime:D,expirationTime:j,sortIndex:-1},D>h?(L.sortIndex=D,f(ge,L),u($)===null&&L===u(ge)&&(J?(te(Ce),Ce=-1):J=!0,me(he,D-h))):(L.sortIndex=j,f($,L),ae||se||(ae=!0,ce(oe))),L},s.unstable_shouldYield=Le,s.unstable_wrapCallback=function(L){var W=B;return function(){var D=B;B=W;try{return L.apply(this,arguments)}finally{B=D}}}})(Qa)),Qa}var zc;function Mp(){return zc||(zc=1,Ha.exports=Rp()),Ha.exports}/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var kc;function Ip(){if(kc)return bt;kc=1;var s=Ja(),f=Mp();function u(e){for(var t="https://reactjs.org/docs/error-decoder.html?invariant="+e,r=1;r<arguments.length;r++)t+="&args[]="+encodeURIComponent(arguments[r]);return"Minified React error #"+e+"; visit "+t+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var k=new Set,w={};function _(e,t){q(e,t),q(e+"Capture",t)}function q(e,t){for(w[e]=t,e=0;e<t.length;e++)k.add(t[e])}var Y=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),$=Object.prototype.hasOwnProperty,ge=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,O={},T={};function B(e){return $.call(T,e)?!0:$.call(O,e)?!1:ge.test(e)?T[e]=!0:(O[e]=!0,!1)}function se(e,t,r,n){if(r!==null&&r.type===0)return!1;switch(typeof t){case"function":case"symbol":return!0;case"boolean":return n?!1:r!==null?!r.acceptsBooleans:(e=e.toLowerCase().slice(0,5),e!=="data-"&&e!=="aria-");default:return!1}}function ae(e,t,r,n){if(t===null||typeof t>"u"||se(e,t,r,n))return!0;if(n)return!1;if(r!==null)switch(r.type){case 3:return!t;case 4:return t===!1;case 5:return isNaN(t);case 6:return isNaN(t)||1>t}return!1}function J(e,t,r,n,o,l,a){this.acceptsBooleans=t===2||t===3||t===4,this.attributeName=n,this.attributeNamespace=o,this.mustUseProperty=r,this.propertyName=e,this.type=t,this.sanitizeURL=l,this.removeEmptyString=a}var F={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(e){F[e]=new J(e,0,!1,e,null,!1,!1)}),[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(e){var t=e[0];F[t]=new J(t,1,!1,e[1],null,!1,!1)}),["contentEditable","draggable","spellCheck","value"].forEach(function(e){F[e]=new J(e,2,!1,e.toLowerCase(),null,!1,!1)}),["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(e){F[e]=new J(e,2,!1,e,null,!1,!1)}),"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(e){F[e]=new J(e,3,!1,e.toLowerCase(),null,!1,!1)}),["checked","multiple","muted","selected"].forEach(function(e){F[e]=new J(e,3,!0,e,null,!1,!1)}),["capture","download"].forEach(function(e){F[e]=new J(e,4,!1,e,null,!1,!1)}),["cols","rows","size","span"].forEach(function(e){F[e]=new J(e,6,!1,e,null,!1,!1)}),["rowSpan","start"].forEach(function(e){F[e]=new J(e,5,!1,e.toLowerCase(),null,!1,!1)});var te=/[\-:]([a-z])/g;function xe(e){return e[1].toUpperCase()}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(e){var t=e.replace(te,xe);F[t]=new J(t,1,!1,e,null,!1,!1)}),"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(e){var t=e.replace(te,xe);F[t]=new J(t,1,!1,e,"http://www.w3.org/1999/xlink",!1,!1)}),["xml:base","xml:lang","xml:space"].forEach(function(e){var t=e.replace(te,xe);F[t]=new J(t,1,!1,e,"http://www.w3.org/XML/1998/namespace",!1,!1)}),["tabIndex","crossOrigin"].forEach(function(e){F[e]=new J(e,1,!1,e.toLowerCase(),null,!1,!1)}),F.xlinkHref=new J("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1),["src","href","action","formAction"].forEach(function(e){F[e]=new J(e,1,!1,e.toLowerCase(),null,!0,!0)});function Ne(e,t,r,n){var o=F.hasOwnProperty(t)?F[t]:null;(o!==null?o.type!==0:n||!(2<t.length)||t[0]!=="o"&&t[0]!=="O"||t[1]!=="n"&&t[1]!=="N")&&(ae(t,r,o,n)&&(r=null),n||o===null?B(t)&&(r===null?e.removeAttribute(t):e.setAttribute(t,""+r)):o.mustUseProperty?e[o.propertyName]=r===null?o.type===3?!1:"":r:(t=o.attributeName,n=o.attributeNamespace,r===null?e.removeAttribute(t):(o=o.type,r=o===3||o===4&&r===!0?"":""+r,n?e.setAttributeNS(n,t,r):e.setAttribute(t,r))))}var he=s.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,oe=Symbol.for("react.element"),ve=Symbol.for("react.portal"),ye=Symbol.for("react.fragment"),Ce=Symbol.for("react.strict_mode"),re=Symbol.for("react.profiler"),He=Symbol.for("react.provider"),Le=Symbol.for("react.context"),I=Symbol.for("react.forward_ref"),ne=Symbol.for("react.suspense"),S=Symbol.for("react.suspense_list"),A=Symbol.for("react.memo"),ce=Symbol.for("react.lazy"),me=Symbol.for("react.offscreen"),L=Symbol.iterator;function W(e){return e===null||typeof e!="object"?null:(e=L&&e[L]||e["@@iterator"],typeof e=="function"?e:null)}var D=Object.assign,h;function j(e){if(h===void 0)try{throw Error()}catch(r){var t=r.stack.trim().match(/\n( *(at )?)/);h=t&&t[1]||""}return`
`+h+e}var ue=!1;function we(e,t){if(!e||ue)return"";ue=!0;var r=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(t)if(t=function(){throw Error()},Object.defineProperty(t.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(t,[])}catch(y){var n=y}Reflect.construct(e,[],t)}else{try{t.call()}catch(y){n=y}e.call(t.prototype)}else{try{throw Error()}catch(y){n=y}e()}}catch(y){if(y&&n&&typeof y.stack=="string"){for(var o=y.stack.split(`
`),l=n.stack.split(`
`),a=o.length-1,d=l.length-1;1<=a&&0<=d&&o[a]!==l[d];)d--;for(;1<=a&&0<=d;a--,d--)if(o[a]!==l[d]){if(a!==1||d!==1)do if(a--,d--,0>d||o[a]!==l[d]){var p=`
`+o[a].replace(" at new "," at ");return e.displayName&&p.includes("<anonymous>")&&(p=p.replace("<anonymous>",e.displayName)),p}while(1<=a&&0<=d);break}}}finally{ue=!1,Error.prepareStackTrace=r}return(e=e?e.displayName||e.name:"")?j(e):""}function ke(e){switch(e.tag){case 5:return j(e.type);case 16:return j("Lazy");case 13:return j("Suspense");case 19:return j("SuspenseList");case 0:case 2:case 15:return e=we(e.type,!1),e;case 11:return e=we(e.type.render,!1),e;case 1:return e=we(e.type,!0),e;default:return""}}function be(e){if(e==null)return null;if(typeof e=="function")return e.displayName||e.name||null;if(typeof e=="string")return e;switch(e){case ye:return"Fragment";case ve:return"Portal";case re:return"Profiler";case Ce:return"StrictMode";case ne:return"Suspense";case S:return"SuspenseList"}if(typeof e=="object")switch(e.$$typeof){case Le:return(e.displayName||"Context")+".Consumer";case He:return(e._context.displayName||"Context")+".Provider";case I:var t=e.render;return e=e.displayName,e||(e=t.displayName||t.name||"",e=e!==""?"ForwardRef("+e+")":"ForwardRef"),e;case A:return t=e.displayName||null,t!==null?t:be(e.type)||"Memo";case ce:t=e._payload,e=e._init;try{return be(e(t))}catch{}}return null}function _e(e){var t=e.type;switch(e.tag){case 24:return"Cache";case 9:return(t.displayName||"Context")+".Consumer";case 10:return(t._context.displayName||"Context")+".Provider";case 18:return"DehydratedFragment";case 11:return e=t.render,e=e.displayName||e.name||"",t.displayName||(e!==""?"ForwardRef("+e+")":"ForwardRef");case 7:return"Fragment";case 5:return t;case 4:return"Portal";case 3:return"Root";case 6:return"Text";case 16:return be(t);case 8:return t===Ce?"StrictMode":"Mode";case 22:return"Offscreen";case 12:return"Profiler";case 21:return"Scope";case 13:return"Suspense";case 19:return"SuspenseList";case 25:return"TracingMarker";case 1:case 0:case 17:case 2:case 14:case 15:if(typeof t=="function")return t.displayName||t.name||null;if(typeof t=="string")return t}return null}function Te(e){switch(typeof e){case"boolean":case"number":case"string":case"undefined":return e;case"object":return e;default:return""}}function M(e){var t=e.type;return(e=e.nodeName)&&e.toLowerCase()==="input"&&(t==="checkbox"||t==="radio")}function Be(e){var t=M(e)?"checked":"value",r=Object.getOwnPropertyDescriptor(e.constructor.prototype,t),n=""+e[t];if(!e.hasOwnProperty(t)&&typeof r<"u"&&typeof r.get=="function"&&typeof r.set=="function"){var o=r.get,l=r.set;return Object.defineProperty(e,t,{configurable:!0,get:function(){return o.call(this)},set:function(a){n=""+a,l.call(this,a)}}),Object.defineProperty(e,t,{enumerable:r.enumerable}),{getValue:function(){return n},setValue:function(a){n=""+a},stopTracking:function(){e._valueTracker=null,delete e[t]}}}}function $t(e){e._valueTracker||(e._valueTracker=Be(e))}function Wr(e){if(!e)return!1;var t=e._valueTracker;if(!t)return!0;var r=t.getValue(),n="";return e&&(n=M(e)?e.checked?"true":"false":e.value),e=n,e!==r?(t.setValue(e),!0):!1}function _t(e){if(e=e||(typeof document<"u"?document:void 0),typeof e>"u")return null;try{return e.activeElement||e.body}catch{return e.body}}function or(e,t){var r=t.checked;return D({},t,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:r??e._wrapperState.initialChecked})}function vr(e,t){var r=t.defaultValue==null?"":t.defaultValue,n=t.checked!=null?t.checked:t.defaultChecked;r=Te(t.value!=null?t.value:r),e._wrapperState={initialChecked:n,initialValue:r,controlled:t.type==="checkbox"||t.type==="radio"?t.checked!=null:t.value!=null}}function Hr(e,t){t=t.checked,t!=null&&Ne(e,"checked",t,!1)}function gn(e,t){Hr(e,t);var r=Te(t.value),n=t.type;if(r!=null)n==="number"?(r===0&&e.value===""||e.value!=r)&&(e.value=""+r):e.value!==""+r&&(e.value=""+r);else if(n==="submit"||n==="reset"){e.removeAttribute("value");return}t.hasOwnProperty("value")?xr(e,t.type,r):t.hasOwnProperty("defaultValue")&&xr(e,t.type,Te(t.defaultValue)),t.checked==null&&t.defaultChecked!=null&&(e.defaultChecked=!!t.defaultChecked)}function oo(e,t,r){if(t.hasOwnProperty("value")||t.hasOwnProperty("defaultValue")){var n=t.type;if(!(n!=="submit"&&n!=="reset"||t.value!==void 0&&t.value!==null))return;t=""+e._wrapperState.initialValue,r||t===e.value||(e.value=t),e.defaultValue=t}r=e.name,r!==""&&(e.name=""),e.defaultChecked=!!e._wrapperState.initialChecked,r!==""&&(e.name=r)}function xr(e,t,r){(t!=="number"||_t(e.ownerDocument)!==e)&&(r==null?e.defaultValue=""+e._wrapperState.initialValue:e.defaultValue!==""+r&&(e.defaultValue=""+r))}var mt=Array.isArray;function yr(e,t,r,n){if(e=e.options,t){t={};for(var o=0;o<r.length;o++)t["$"+r[o]]=!0;for(r=0;r<e.length;r++)o=t.hasOwnProperty("$"+e[r].value),e[r].selected!==o&&(e[r].selected=o),o&&n&&(e[r].defaultSelected=!0)}else{for(r=""+Te(r),t=null,o=0;o<e.length;o++){if(e[o].value===r){e[o].selected=!0,n&&(e[o].defaultSelected=!0);return}t!==null||e[o].disabled||(t=e[o])}t!==null&&(t.selected=!0)}}function io(e,t){if(t.dangerouslySetInnerHTML!=null)throw Error(u(91));return D({},t,{value:void 0,defaultValue:void 0,children:""+e._wrapperState.initialValue})}function At(e,t){var r=t.value;if(r==null){if(r=t.children,t=t.defaultValue,r!=null){if(t!=null)throw Error(u(92));if(mt(r)){if(1<r.length)throw Error(u(93));r=r[0]}t=r}t==null&&(t=""),r=t}e._wrapperState={initialValue:Te(r)}}function lo(e,t){var r=Te(t.value),n=Te(t.defaultValue);r!=null&&(r=""+r,r!==e.value&&(e.value=r),t.defaultValue==null&&e.defaultValue!==r&&(e.defaultValue=r)),n!=null&&(e.defaultValue=""+n)}function wr(e){var t=e.textContent;t===e._wrapperState.initialValue&&t!==""&&t!==null&&(e.value=t)}function vn(e){switch(e){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function zt(e,t){return e==null||e==="http://www.w3.org/1999/xhtml"?vn(t):e==="http://www.w3.org/2000/svg"&&t==="foreignObject"?"http://www.w3.org/1999/xhtml":e}var Qr,xn=(function(e){return typeof MSApp<"u"&&MSApp.execUnsafeLocalFunction?function(t,r,n,o){MSApp.execUnsafeLocalFunction(function(){return e(t,r,n,o)})}:e})(function(e,t){if(e.namespaceURI!=="http://www.w3.org/2000/svg"||"innerHTML"in e)e.innerHTML=t;else{for(Qr=Qr||document.createElement("div"),Qr.innerHTML="<svg>"+t.valueOf().toString()+"</svg>",t=Qr.firstChild;e.firstChild;)e.removeChild(e.firstChild);for(;t.firstChild;)e.appendChild(t.firstChild)}});function br(e,t){if(t){var r=e.firstChild;if(r&&r===e.lastChild&&r.nodeType===3){r.nodeValue=t;return}}e.textContent=t}var zr={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},Bo=["Webkit","ms","Moz","O"];Object.keys(zr).forEach(function(e){Bo.forEach(function(t){t=t+e.charAt(0).toUpperCase()+e.substring(1),zr[t]=zr[e]})});function yn(e,t,r){return t==null||typeof t=="boolean"||t===""?"":r||typeof t!="number"||t===0||zr.hasOwnProperty(e)&&zr[e]?(""+t).trim():t+"px"}function wn(e,t){e=e.style;for(var r in t)if(t.hasOwnProperty(r)){var n=r.indexOf("--")===0,o=yn(r,t[r],n);r==="float"&&(r="cssFloat"),n?e.setProperty(r,o):e[r]=o}}var Uo=D({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function Xt(e,t){if(t){if(Uo[e]&&(t.children!=null||t.dangerouslySetInnerHTML!=null))throw Error(u(137,e));if(t.dangerouslySetInnerHTML!=null){if(t.children!=null)throw Error(u(60));if(typeof t.dangerouslySetInnerHTML!="object"||!("__html"in t.dangerouslySetInnerHTML))throw Error(u(61))}if(t.style!=null&&typeof t.style!="object")throw Error(u(62))}}function bn(e,t){if(e.indexOf("-")===-1)return typeof t.is=="string";switch(e){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var Vr=null;function kr(e){return e=e.target||e.srcElement||window,e.correspondingUseElement&&(e=e.correspondingUseElement),e.nodeType===3?e.parentNode:e}var Pt=null,jr=null,ir=null;function Zt(e){if(e=So(e)){if(typeof Pt!="function")throw Error(u(280));var t=e.stateNode;t&&(t=di(t),Pt(e.stateNode,e.type,t))}}function ao(e){jr?ir?ir.push(e):ir=[e]:jr=e}function Wo(){if(jr){var e=jr,t=ir;if(ir=jr=null,Zt(e),t)for(e=0;e<t.length;e++)Zt(t[e])}}function Yr(e,t){return e(t)}function Jt(){}var zn=!1;function Kr(e,t,r){if(zn)return e(t,r);zn=!0;try{return Yr(e,t,r)}finally{zn=!1,(jr!==null||ir!==null)&&(Jt(),Wo())}}function ht(e,t){var r=e.stateNode;if(r===null)return null;var n=di(r);if(n===null)return null;r=n[t];e:switch(t){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(n=!n.disabled)||(e=e.type,n=!(e==="button"||e==="input"||e==="select"||e==="textarea")),e=!n;break e;default:e=!1}if(e)return null;if(r&&typeof r!="function")throw Error(u(231,t,typeof r));return r}var so=!1;if(Y)try{var lr={};Object.defineProperty(lr,"passive",{get:function(){so=!0}}),window.addEventListener("test",lr,lr),window.removeEventListener("test",lr,lr)}catch{so=!1}function Gr(e,t,r,n,o,l,a,d,p){var y=Array.prototype.slice.call(arguments,3);try{t.apply(r,y)}catch(C){this.onError(C)}}var Bt=!1,ar=null,qr=!1,kn=null,jn={onError:function(e){Bt=!0,ar=e}};function Sn(e,t,r,n,o,l,a,d,p){Bt=!1,ar=null,Gr.apply(jn,arguments)}function Sr(e,t,r,n,o,l,a,d,p){if(Sn.apply(this,arguments),Bt){if(Bt){var y=ar;Bt=!1,ar=null}else throw Error(u(198));qr||(qr=!0,kn=y)}}function Fe(e){var t=e,r=e;if(e.alternate)for(;t.return;)t=t.return;else{e=t;do t=e,(t.flags&4098)!==0&&(r=t.return),e=t.return;while(e)}return t.tag===3?r:null}function Nn(e){if(e.tag===13){var t=e.memoizedState;if(t===null&&(e=e.alternate,e!==null&&(t=e.memoizedState)),t!==null)return t.dehydrated}return null}function Ho(e){if(Fe(e)!==e)throw Error(u(188))}function ll(e){var t=e.alternate;if(!t){if(t=Fe(e),t===null)throw Error(u(188));return t!==e?null:e}for(var r=e,n=t;;){var o=r.return;if(o===null)break;var l=o.alternate;if(l===null){if(n=o.return,n!==null){r=n;continue}break}if(o.child===l.child){for(l=o.child;l;){if(l===r)return Ho(o),e;if(l===n)return Ho(o),t;l=l.sibling}throw Error(u(188))}if(r.return!==n.return)r=o,n=l;else{for(var a=!1,d=o.child;d;){if(d===r){a=!0,r=o,n=l;break}if(d===n){a=!0,n=o,r=l;break}d=d.sibling}if(!a){for(d=l.child;d;){if(d===r){a=!0,r=l,n=o;break}if(d===n){a=!0,n=l,r=o;break}d=d.sibling}if(!a)throw Error(u(189))}}if(r.alternate!==n)throw Error(u(190))}if(r.tag!==3)throw Error(u(188));return r.stateNode.current===r?e:t}function Ut(e){return e=ll(e),e!==null?Xr(e):null}function Xr(e){if(e.tag===5||e.tag===6)return e;for(e=e.child;e!==null;){var t=Xr(e);if(t!==null)return t;e=e.sibling}return null}var Cn=f.unstable_scheduleCallback,Zr=f.unstable_cancelCallback,uo=f.unstable_shouldYield,Qo=f.unstable_requestPaint,Ue=f.unstable_now,al=f.unstable_getCurrentPriorityLevel,sr=f.unstable_ImmediatePriority,Vo=f.unstable_UserBlockingPriority,En=f.unstable_NormalPriority,sl=f.unstable_LowPriority,_n=f.unstable_IdlePriority,Jr=null,Tt=null;function ul(e){if(Tt&&typeof Tt.onCommitFiberRoot=="function")try{Tt.onCommitFiberRoot(Jr,e,void 0,(e.current.flags&128)===128)}catch{}}var kt=Math.clz32?Math.clz32:pl,cl=Math.log,dl=Math.LN2;function pl(e){return e>>>=0,e===0?32:31-(cl(e)/dl|0)|0}var Pn=64,en=4194304;function Nr(e){switch(e&-e){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return e&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return e&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;default:return e}}function tn(e,t){var r=e.pendingLanes;if(r===0)return 0;var n=0,o=e.suspendedLanes,l=e.pingedLanes,a=r&268435455;if(a!==0){var d=a&~o;d!==0?n=Nr(d):(l&=a,l!==0&&(n=Nr(l)))}else a=r&~o,a!==0?n=Nr(a):l!==0&&(n=Nr(l));if(n===0)return 0;if(t!==0&&t!==n&&(t&o)===0&&(o=n&-n,l=t&-t,o>=l||o===16&&(l&4194240)!==0))return t;if((n&4)!==0&&(n|=r&16),t=e.entangledLanes,t!==0)for(e=e.entanglements,t&=n;0<t;)r=31-kt(t),o=1<<r,n|=e[r],t&=~o;return n}function Yo(e,t){switch(e){case 1:case 2:case 4:return t+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return t+5e3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return-1;case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function Ko(e,t){for(var r=e.suspendedLanes,n=e.pingedLanes,o=e.expirationTimes,l=e.pendingLanes;0<l;){var a=31-kt(l),d=1<<a,p=o[a];p===-1?((d&r)===0||(d&n)!==0)&&(o[a]=Yo(d,t)):p<=t&&(e.expiredLanes|=d),l&=~d}}function Tn(e){return e=e.pendingLanes&-1073741825,e!==0?e:e&1073741824?1073741824:0}function co(){var e=Pn;return Pn<<=1,(Pn&4194240)===0&&(Pn=64),e}function Ln(e){for(var t=[],r=0;31>r;r++)t.push(e);return t}function Cr(e,t,r){e.pendingLanes|=t,t!==536870912&&(e.suspendedLanes=0,e.pingedLanes=0),e=e.eventTimes,t=31-kt(t),e[t]=r}function c(e,t){var r=e.pendingLanes&~t;e.pendingLanes=t,e.suspendedLanes=0,e.pingedLanes=0,e.expiredLanes&=t,e.mutableReadLanes&=t,e.entangledLanes&=t,t=e.entanglements;var n=e.eventTimes;for(e=e.expirationTimes;0<r;){var o=31-kt(r),l=1<<o;t[o]=0,n[o]=-1,e[o]=-1,r&=~l}}function v(e,t){var r=e.entangledLanes|=t;for(e=e.entanglements;r;){var n=31-kt(r),o=1<<n;o&t|e[n]&t&&(e[n]|=t),r&=~o}}var b=0;function P(e){return e&=-e,1<e?4<e?(e&268435455)!==0?16:536870912:4:1}var H,Q,ee,de,Se,De=!1,Ie=[],Ye=null,Re=null,lt=null,Z=new Map,je=new Map,pe=[],Xe="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");function nt(e,t){switch(e){case"focusin":case"focusout":Ye=null;break;case"dragenter":case"dragleave":Re=null;break;case"mouseover":case"mouseout":lt=null;break;case"pointerover":case"pointerout":Z.delete(t.pointerId);break;case"gotpointercapture":case"lostpointercapture":je.delete(t.pointerId)}}function Lt(e,t,r,n,o,l){return e===null||e.nativeEvent!==l?(e={blockedOn:t,domEventName:r,eventSystemFlags:n,nativeEvent:l,targetContainers:[o]},t!==null&&(t=So(t),t!==null&&Q(t)),e):(e.eventSystemFlags|=n,t=e.targetContainers,o!==null&&t.indexOf(o)===-1&&t.push(o),e)}function Go(e,t,r,n,o){switch(t){case"focusin":return Ye=Lt(Ye,e,t,r,n,o),!0;case"dragenter":return Re=Lt(Re,e,t,r,n,o),!0;case"mouseover":return lt=Lt(lt,e,t,r,n,o),!0;case"pointerover":var l=o.pointerId;return Z.set(l,Lt(Z.get(l)||null,e,t,r,n,o)),!0;case"gotpointercapture":return l=o.pointerId,je.set(l,Lt(je.get(l)||null,e,t,r,n,o)),!0}return!1}function qo(e){var t=rn(e.target);if(t!==null){var r=Fe(t);if(r!==null){if(t=r.tag,t===13){if(t=Nn(r),t!==null){e.blockedOn=t,Se(e.priority,function(){ee(r)});return}}else if(t===3&&r.stateNode.current.memoizedState.isDehydrated){e.blockedOn=r.tag===3?r.stateNode.containerInfo:null;return}}}e.blockedOn=null}function Xo(e){if(e.blockedOn!==null)return!1;for(var t=e.targetContainers;0<t.length;){var r=ml(e.domEventName,e.eventSystemFlags,t[0],e.nativeEvent);if(r===null){r=e.nativeEvent;var n=new r.constructor(r.type,r);Vr=n,r.target.dispatchEvent(n),Vr=null}else return t=So(r),t!==null&&Q(t),e.blockedOn=r,!1;t.shift()}return!0}function ts(e,t,r){Xo(e)&&r.delete(t)}function Zc(){De=!1,Ye!==null&&Xo(Ye)&&(Ye=null),Re!==null&&Xo(Re)&&(Re=null),lt!==null&&Xo(lt)&&(lt=null),Z.forEach(ts),je.forEach(ts)}function po(e,t){e.blockedOn===t&&(e.blockedOn=null,De||(De=!0,f.unstable_scheduleCallback(f.unstable_NormalPriority,Zc)))}function fo(e){function t(o){return po(o,e)}if(0<Ie.length){po(Ie[0],e);for(var r=1;r<Ie.length;r++){var n=Ie[r];n.blockedOn===e&&(n.blockedOn=null)}}for(Ye!==null&&po(Ye,e),Re!==null&&po(Re,e),lt!==null&&po(lt,e),Z.forEach(t),je.forEach(t),r=0;r<pe.length;r++)n=pe[r],n.blockedOn===e&&(n.blockedOn=null);for(;0<pe.length&&(r=pe[0],r.blockedOn===null);)qo(r),r.blockedOn===null&&pe.shift()}var Rn=he.ReactCurrentBatchConfig,Zo=!0;function Jc(e,t,r,n){var o=b,l=Rn.transition;Rn.transition=null;try{b=1,fl(e,t,r,n)}finally{b=o,Rn.transition=l}}function ed(e,t,r,n){var o=b,l=Rn.transition;Rn.transition=null;try{b=4,fl(e,t,r,n)}finally{b=o,Rn.transition=l}}function fl(e,t,r,n){if(Zo){var o=ml(e,t,r,n);if(o===null)Tl(e,t,n,Jo,r),nt(e,n);else if(Go(o,e,t,r,n))n.stopPropagation();else if(nt(e,n),t&4&&-1<Xe.indexOf(e)){for(;o!==null;){var l=So(o);if(l!==null&&H(l),l=ml(e,t,r,n),l===null&&Tl(e,t,n,Jo,r),l===o)break;o=l}o!==null&&n.stopPropagation()}else Tl(e,t,n,null,r)}}var Jo=null;function ml(e,t,r,n){if(Jo=null,e=kr(n),e=rn(e),e!==null)if(t=Fe(e),t===null)e=null;else if(r=t.tag,r===13){if(e=Nn(t),e!==null)return e;e=null}else if(r===3){if(t.stateNode.current.memoizedState.isDehydrated)return t.tag===3?t.stateNode.containerInfo:null;e=null}else t!==e&&(e=null);return Jo=e,null}function rs(e){switch(e){case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 1;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"toggle":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 4;case"message":switch(al()){case sr:return 1;case Vo:return 4;case En:case sl:return 16;case _n:return 536870912;default:return 16}default:return 16}}var Er=null,hl=null,ei=null;function ns(){if(ei)return ei;var e,t=hl,r=t.length,n,o="value"in Er?Er.value:Er.textContent,l=o.length;for(e=0;e<r&&t[e]===o[e];e++);var a=r-e;for(n=1;n<=a&&t[r-n]===o[l-n];n++);return ei=o.slice(e,1<n?1-n:void 0)}function ti(e){var t=e.keyCode;return"charCode"in e?(e=e.charCode,e===0&&t===13&&(e=13)):e=t,e===10&&(e=13),32<=e||e===13?e:0}function ri(){return!0}function os(){return!1}function jt(e){function t(r,n,o,l,a){this._reactName=r,this._targetInst=o,this.type=n,this.nativeEvent=l,this.target=a,this.currentTarget=null;for(var d in e)e.hasOwnProperty(d)&&(r=e[d],this[d]=r?r(l):l[d]);return this.isDefaultPrevented=(l.defaultPrevented!=null?l.defaultPrevented:l.returnValue===!1)?ri:os,this.isPropagationStopped=os,this}return D(t.prototype,{preventDefault:function(){this.defaultPrevented=!0;var r=this.nativeEvent;r&&(r.preventDefault?r.preventDefault():typeof r.returnValue!="unknown"&&(r.returnValue=!1),this.isDefaultPrevented=ri)},stopPropagation:function(){var r=this.nativeEvent;r&&(r.stopPropagation?r.stopPropagation():typeof r.cancelBubble!="unknown"&&(r.cancelBubble=!0),this.isPropagationStopped=ri)},persist:function(){},isPersistent:ri}),t}var Mn={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(e){return e.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},gl=jt(Mn),mo=D({},Mn,{view:0,detail:0}),td=jt(mo),vl,xl,ho,ni=D({},mo,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:wl,button:0,buttons:0,relatedTarget:function(e){return e.relatedTarget===void 0?e.fromElement===e.srcElement?e.toElement:e.fromElement:e.relatedTarget},movementX:function(e){return"movementX"in e?e.movementX:(e!==ho&&(ho&&e.type==="mousemove"?(vl=e.screenX-ho.screenX,xl=e.screenY-ho.screenY):xl=vl=0,ho=e),vl)},movementY:function(e){return"movementY"in e?e.movementY:xl}}),is=jt(ni),rd=D({},ni,{dataTransfer:0}),nd=jt(rd),od=D({},mo,{relatedTarget:0}),yl=jt(od),id=D({},Mn,{animationName:0,elapsedTime:0,pseudoElement:0}),ld=jt(id),ad=D({},Mn,{clipboardData:function(e){return"clipboardData"in e?e.clipboardData:window.clipboardData}}),sd=jt(ad),ud=D({},Mn,{data:0}),ls=jt(ud),cd={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},dd={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},pd={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function fd(e){var t=this.nativeEvent;return t.getModifierState?t.getModifierState(e):(e=pd[e])?!!t[e]:!1}function wl(){return fd}var md=D({},mo,{key:function(e){if(e.key){var t=cd[e.key]||e.key;if(t!=="Unidentified")return t}return e.type==="keypress"?(e=ti(e),e===13?"Enter":String.fromCharCode(e)):e.type==="keydown"||e.type==="keyup"?dd[e.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:wl,charCode:function(e){return e.type==="keypress"?ti(e):0},keyCode:function(e){return e.type==="keydown"||e.type==="keyup"?e.keyCode:0},which:function(e){return e.type==="keypress"?ti(e):e.type==="keydown"||e.type==="keyup"?e.keyCode:0}}),hd=jt(md),gd=D({},ni,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),as=jt(gd),vd=D({},mo,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:wl}),xd=jt(vd),yd=D({},Mn,{propertyName:0,elapsedTime:0,pseudoElement:0}),wd=jt(yd),bd=D({},ni,{deltaX:function(e){return"deltaX"in e?e.deltaX:"wheelDeltaX"in e?-e.wheelDeltaX:0},deltaY:function(e){return"deltaY"in e?e.deltaY:"wheelDeltaY"in e?-e.wheelDeltaY:"wheelDelta"in e?-e.wheelDelta:0},deltaZ:0,deltaMode:0}),zd=jt(bd),kd=[9,13,27,32],bl=Y&&"CompositionEvent"in window,go=null;Y&&"documentMode"in document&&(go=document.documentMode);var jd=Y&&"TextEvent"in window&&!go,ss=Y&&(!bl||go&&8<go&&11>=go),us=" ",cs=!1;function ds(e,t){switch(e){case"keyup":return kd.indexOf(t.keyCode)!==-1;case"keydown":return t.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function ps(e){return e=e.detail,typeof e=="object"&&"data"in e?e.data:null}var In=!1;function Sd(e,t){switch(e){case"compositionend":return ps(t);case"keypress":return t.which!==32?null:(cs=!0,us);case"textInput":return e=t.data,e===us&&cs?null:e;default:return null}}function Nd(e,t){if(In)return e==="compositionend"||!bl&&ds(e,t)?(e=ns(),ei=hl=Er=null,In=!1,e):null;switch(e){case"paste":return null;case"keypress":if(!(t.ctrlKey||t.altKey||t.metaKey)||t.ctrlKey&&t.altKey){if(t.char&&1<t.char.length)return t.char;if(t.which)return String.fromCharCode(t.which)}return null;case"compositionend":return ss&&t.locale!=="ko"?null:t.data;default:return null}}var Cd={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function fs(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t==="input"?!!Cd[e.type]:t==="textarea"}function ms(e,t,r,n){ao(n),t=si(t,"onChange"),0<t.length&&(r=new gl("onChange","change",null,r,n),e.push({event:r,listeners:t}))}var vo=null,xo=null;function Ed(e){Ls(e,0)}function oi(e){var t=An(e);if(Wr(t))return e}function _d(e,t){if(e==="change")return t}var hs=!1;if(Y){var zl;if(Y){var kl="oninput"in document;if(!kl){var gs=document.createElement("div");gs.setAttribute("oninput","return;"),kl=typeof gs.oninput=="function"}zl=kl}else zl=!1;hs=zl&&(!document.documentMode||9<document.documentMode)}function vs(){vo&&(vo.detachEvent("onpropertychange",xs),xo=vo=null)}function xs(e){if(e.propertyName==="value"&&oi(xo)){var t=[];ms(t,xo,e,kr(e)),Kr(Ed,t)}}function Pd(e,t,r){e==="focusin"?(vs(),vo=t,xo=r,vo.attachEvent("onpropertychange",xs)):e==="focusout"&&vs()}function Td(e){if(e==="selectionchange"||e==="keyup"||e==="keydown")return oi(xo)}function Ld(e,t){if(e==="click")return oi(t)}function Rd(e,t){if(e==="input"||e==="change")return oi(t)}function Md(e,t){return e===t&&(e!==0||1/e===1/t)||e!==e&&t!==t}var Wt=typeof Object.is=="function"?Object.is:Md;function yo(e,t){if(Wt(e,t))return!0;if(typeof e!="object"||e===null||typeof t!="object"||t===null)return!1;var r=Object.keys(e),n=Object.keys(t);if(r.length!==n.length)return!1;for(n=0;n<r.length;n++){var o=r[n];if(!$.call(t,o)||!Wt(e[o],t[o]))return!1}return!0}function ys(e){for(;e&&e.firstChild;)e=e.firstChild;return e}function ws(e,t){var r=ys(e);e=0;for(var n;r;){if(r.nodeType===3){if(n=e+r.textContent.length,e<=t&&n>=t)return{node:r,offset:t-e};e=n}e:{for(;r;){if(r.nextSibling){r=r.nextSibling;break e}r=r.parentNode}r=void 0}r=ys(r)}}function bs(e,t){return e&&t?e===t?!0:e&&e.nodeType===3?!1:t&&t.nodeType===3?bs(e,t.parentNode):"contains"in e?e.contains(t):e.compareDocumentPosition?!!(e.compareDocumentPosition(t)&16):!1:!1}function zs(){for(var e=window,t=_t();t instanceof e.HTMLIFrameElement;){try{var r=typeof t.contentWindow.location.href=="string"}catch{r=!1}if(r)e=t.contentWindow;else break;t=_t(e.document)}return t}function jl(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t&&(t==="input"&&(e.type==="text"||e.type==="search"||e.type==="tel"||e.type==="url"||e.type==="password")||t==="textarea"||e.contentEditable==="true")}function Id(e){var t=zs(),r=e.focusedElem,n=e.selectionRange;if(t!==r&&r&&r.ownerDocument&&bs(r.ownerDocument.documentElement,r)){if(n!==null&&jl(r)){if(t=n.start,e=n.end,e===void 0&&(e=t),"selectionStart"in r)r.selectionStart=t,r.selectionEnd=Math.min(e,r.value.length);else if(e=(t=r.ownerDocument||document)&&t.defaultView||window,e.getSelection){e=e.getSelection();var o=r.textContent.length,l=Math.min(n.start,o);n=n.end===void 0?l:Math.min(n.end,o),!e.extend&&l>n&&(o=n,n=l,l=o),o=ws(r,l);var a=ws(r,n);o&&a&&(e.rangeCount!==1||e.anchorNode!==o.node||e.anchorOffset!==o.offset||e.focusNode!==a.node||e.focusOffset!==a.offset)&&(t=t.createRange(),t.setStart(o.node,o.offset),e.removeAllRanges(),l>n?(e.addRange(t),e.extend(a.node,a.offset)):(t.setEnd(a.node,a.offset),e.addRange(t)))}}for(t=[],e=r;e=e.parentNode;)e.nodeType===1&&t.push({element:e,left:e.scrollLeft,top:e.scrollTop});for(typeof r.focus=="function"&&r.focus(),r=0;r<t.length;r++)e=t[r],e.element.scrollLeft=e.left,e.element.scrollTop=e.top}}var Od=Y&&"documentMode"in document&&11>=document.documentMode,On=null,Sl=null,wo=null,Nl=!1;function ks(e,t,r){var n=r.window===r?r.document:r.nodeType===9?r:r.ownerDocument;Nl||On==null||On!==_t(n)||(n=On,"selectionStart"in n&&jl(n)?n={start:n.selectionStart,end:n.selectionEnd}:(n=(n.ownerDocument&&n.ownerDocument.defaultView||window).getSelection(),n={anchorNode:n.anchorNode,anchorOffset:n.anchorOffset,focusNode:n.focusNode,focusOffset:n.focusOffset}),wo&&yo(wo,n)||(wo=n,n=si(Sl,"onSelect"),0<n.length&&(t=new gl("onSelect","select",null,t,r),e.push({event:t,listeners:n}),t.target=On)))}function ii(e,t){var r={};return r[e.toLowerCase()]=t.toLowerCase(),r["Webkit"+e]="webkit"+t,r["Moz"+e]="moz"+t,r}var Fn={animationend:ii("Animation","AnimationEnd"),animationiteration:ii("Animation","AnimationIteration"),animationstart:ii("Animation","AnimationStart"),transitionend:ii("Transition","TransitionEnd")},Cl={},js={};Y&&(js=document.createElement("div").style,"AnimationEvent"in window||(delete Fn.animationend.animation,delete Fn.animationiteration.animation,delete Fn.animationstart.animation),"TransitionEvent"in window||delete Fn.transitionend.transition);function li(e){if(Cl[e])return Cl[e];if(!Fn[e])return e;var t=Fn[e],r;for(r in t)if(t.hasOwnProperty(r)&&r in js)return Cl[e]=t[r];return e}var Ss=li("animationend"),Ns=li("animationiteration"),Cs=li("animationstart"),Es=li("transitionend"),_s=new Map,Ps="abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");function _r(e,t){_s.set(e,t),_(t,[e])}for(var El=0;El<Ps.length;El++){var _l=Ps[El],Fd=_l.toLowerCase(),Dd=_l[0].toUpperCase()+_l.slice(1);_r(Fd,"on"+Dd)}_r(Ss,"onAnimationEnd"),_r(Ns,"onAnimationIteration"),_r(Cs,"onAnimationStart"),_r("dblclick","onDoubleClick"),_r("focusin","onFocus"),_r("focusout","onBlur"),_r(Es,"onTransitionEnd"),q("onMouseEnter",["mouseout","mouseover"]),q("onMouseLeave",["mouseout","mouseover"]),q("onPointerEnter",["pointerout","pointerover"]),q("onPointerLeave",["pointerout","pointerover"]),_("onChange","change click focusin focusout input keydown keyup selectionchange".split(" ")),_("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")),_("onBeforeInput",["compositionend","keypress","textInput","paste"]),_("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" ")),_("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" ")),_("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var bo="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),$d=new Set("cancel close invalid load scroll toggle".split(" ").concat(bo));function Ts(e,t,r){var n=e.type||"unknown-event";e.currentTarget=r,Sr(n,t,void 0,e),e.currentTarget=null}function Ls(e,t){t=(t&4)!==0;for(var r=0;r<e.length;r++){var n=e[r],o=n.event;n=n.listeners;e:{var l=void 0;if(t)for(var a=n.length-1;0<=a;a--){var d=n[a],p=d.instance,y=d.currentTarget;if(d=d.listener,p!==l&&o.isPropagationStopped())break e;Ts(o,d,y),l=p}else for(a=0;a<n.length;a++){if(d=n[a],p=d.instance,y=d.currentTarget,d=d.listener,p!==l&&o.isPropagationStopped())break e;Ts(o,d,y),l=p}}}if(qr)throw e=kn,qr=!1,kn=null,e}function $e(e,t){var r=t[Fl];r===void 0&&(r=t[Fl]=new Set);var n=e+"__bubble";r.has(n)||(Rs(t,e,2,!1),r.add(n))}function Pl(e,t,r){var n=0;t&&(n|=4),Rs(r,e,n,t)}var ai="_reactListening"+Math.random().toString(36).slice(2);function zo(e){if(!e[ai]){e[ai]=!0,k.forEach(function(r){r!=="selectionchange"&&($d.has(r)||Pl(r,!1,e),Pl(r,!0,e))});var t=e.nodeType===9?e:e.ownerDocument;t===null||t[ai]||(t[ai]=!0,Pl("selectionchange",!1,t))}}function Rs(e,t,r,n){switch(rs(t)){case 1:var o=Jc;break;case 4:o=ed;break;default:o=fl}r=o.bind(null,t,r,e),o=void 0,!so||t!=="touchstart"&&t!=="touchmove"&&t!=="wheel"||(o=!0),n?o!==void 0?e.addEventListener(t,r,{capture:!0,passive:o}):e.addEventListener(t,r,!0):o!==void 0?e.addEventListener(t,r,{passive:o}):e.addEventListener(t,r,!1)}function Tl(e,t,r,n,o){var l=n;if((t&1)===0&&(t&2)===0&&n!==null)e:for(;;){if(n===null)return;var a=n.tag;if(a===3||a===4){var d=n.stateNode.containerInfo;if(d===o||d.nodeType===8&&d.parentNode===o)break;if(a===4)for(a=n.return;a!==null;){var p=a.tag;if((p===3||p===4)&&(p=a.stateNode.containerInfo,p===o||p.nodeType===8&&p.parentNode===o))return;a=a.return}for(;d!==null;){if(a=rn(d),a===null)return;if(p=a.tag,p===5||p===6){n=l=a;continue e}d=d.parentNode}}n=n.return}Kr(function(){var y=l,C=kr(r),E=[];e:{var N=_s.get(e);if(N!==void 0){var U=gl,K=e;switch(e){case"keypress":if(ti(r)===0)break e;case"keydown":case"keyup":U=hd;break;case"focusin":K="focus",U=yl;break;case"focusout":K="blur",U=yl;break;case"beforeblur":case"afterblur":U=yl;break;case"click":if(r.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":U=is;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":U=nd;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":U=xd;break;case Ss:case Ns:case Cs:U=ld;break;case Es:U=wd;break;case"scroll":U=td;break;case"wheel":U=zd;break;case"copy":case"cut":case"paste":U=sd;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":U=as}var G=(t&4)!==0,Ge=!G&&e==="scroll",g=G?N!==null?N+"Capture":null:N;G=[];for(var m=y,x;m!==null;){x=m;var R=x.stateNode;if(x.tag===5&&R!==null&&(x=R,g!==null&&(R=ht(m,g),R!=null&&G.push(ko(m,R,x)))),Ge)break;m=m.return}0<G.length&&(N=new U(N,K,null,r,C),E.push({event:N,listeners:G}))}}if((t&7)===0){e:{if(N=e==="mouseover"||e==="pointerover",U=e==="mouseout"||e==="pointerout",N&&r!==Vr&&(K=r.relatedTarget||r.fromElement)&&(rn(K)||K[ur]))break e;if((U||N)&&(N=C.window===C?C:(N=C.ownerDocument)?N.defaultView||N.parentWindow:window,U?(K=r.relatedTarget||r.toElement,U=y,K=K?rn(K):null,K!==null&&(Ge=Fe(K),K!==Ge||K.tag!==5&&K.tag!==6)&&(K=null)):(U=null,K=y),U!==K)){if(G=is,R="onMouseLeave",g="onMouseEnter",m="mouse",(e==="pointerout"||e==="pointerover")&&(G=as,R="onPointerLeave",g="onPointerEnter",m="pointer"),Ge=U==null?N:An(U),x=K==null?N:An(K),N=new G(R,m+"leave",U,r,C),N.target=Ge,N.relatedTarget=x,R=null,rn(C)===y&&(G=new G(g,m+"enter",K,r,C),G.target=x,G.relatedTarget=Ge,R=G),Ge=R,U&&K)t:{for(G=U,g=K,m=0,x=G;x;x=Dn(x))m++;for(x=0,R=g;R;R=Dn(R))x++;for(;0<m-x;)G=Dn(G),m--;for(;0<x-m;)g=Dn(g),x--;for(;m--;){if(G===g||g!==null&&G===g.alternate)break t;G=Dn(G),g=Dn(g)}G=null}else G=null;U!==null&&Ms(E,N,U,G,!1),K!==null&&Ge!==null&&Ms(E,Ge,K,G,!0)}}e:{if(N=y?An(y):window,U=N.nodeName&&N.nodeName.toLowerCase(),U==="select"||U==="input"&&N.type==="file")var X=_d;else if(fs(N))if(hs)X=Rd;else{X=Td;var ie=Pd}else(U=N.nodeName)&&U.toLowerCase()==="input"&&(N.type==="checkbox"||N.type==="radio")&&(X=Ld);if(X&&(X=X(e,y))){ms(E,X,r,C);break e}ie&&ie(e,N,y),e==="focusout"&&(ie=N._wrapperState)&&ie.controlled&&N.type==="number"&&xr(N,"number",N.value)}switch(ie=y?An(y):window,e){case"focusin":(fs(ie)||ie.contentEditable==="true")&&(On=ie,Sl=y,wo=null);break;case"focusout":wo=Sl=On=null;break;case"mousedown":Nl=!0;break;case"contextmenu":case"mouseup":case"dragend":Nl=!1,ks(E,r,C);break;case"selectionchange":if(Od)break;case"keydown":case"keyup":ks(E,r,C)}var le;if(bl)e:{switch(e){case"compositionstart":var fe="onCompositionStart";break e;case"compositionend":fe="onCompositionEnd";break e;case"compositionupdate":fe="onCompositionUpdate";break e}fe=void 0}else In?ds(e,r)&&(fe="onCompositionEnd"):e==="keydown"&&r.keyCode===229&&(fe="onCompositionStart");fe&&(ss&&r.locale!=="ko"&&(In||fe!=="onCompositionStart"?fe==="onCompositionEnd"&&In&&(le=ns()):(Er=C,hl="value"in Er?Er.value:Er.textContent,In=!0)),ie=si(y,fe),0<ie.length&&(fe=new ls(fe,e,null,r,C),E.push({event:fe,listeners:ie}),le?fe.data=le:(le=ps(r),le!==null&&(fe.data=le)))),(le=jd?Sd(e,r):Nd(e,r))&&(y=si(y,"onBeforeInput"),0<y.length&&(C=new ls("onBeforeInput","beforeinput",null,r,C),E.push({event:C,listeners:y}),C.data=le))}Ls(E,t)})}function ko(e,t,r){return{instance:e,listener:t,currentTarget:r}}function si(e,t){for(var r=t+"Capture",n=[];e!==null;){var o=e,l=o.stateNode;o.tag===5&&l!==null&&(o=l,l=ht(e,r),l!=null&&n.unshift(ko(e,l,o)),l=ht(e,t),l!=null&&n.push(ko(e,l,o))),e=e.return}return n}function Dn(e){if(e===null)return null;do e=e.return;while(e&&e.tag!==5);return e||null}function Ms(e,t,r,n,o){for(var l=t._reactName,a=[];r!==null&&r!==n;){var d=r,p=d.alternate,y=d.stateNode;if(p!==null&&p===n)break;d.tag===5&&y!==null&&(d=y,o?(p=ht(r,l),p!=null&&a.unshift(ko(r,p,d))):o||(p=ht(r,l),p!=null&&a.push(ko(r,p,d)))),r=r.return}a.length!==0&&e.push({event:t,listeners:a})}var Ad=/\r\n?/g,Bd=/\u0000|\uFFFD/g;function Is(e){return(typeof e=="string"?e:""+e).replace(Ad,`
`).replace(Bd,"")}function ui(e,t,r){if(t=Is(t),Is(e)!==t&&r)throw Error(u(425))}function ci(){}var Ll=null,Rl=null;function Ml(e,t){return e==="textarea"||e==="noscript"||typeof t.children=="string"||typeof t.children=="number"||typeof t.dangerouslySetInnerHTML=="object"&&t.dangerouslySetInnerHTML!==null&&t.dangerouslySetInnerHTML.__html!=null}var Il=typeof setTimeout=="function"?setTimeout:void 0,Ud=typeof clearTimeout=="function"?clearTimeout:void 0,Os=typeof Promise=="function"?Promise:void 0,Wd=typeof queueMicrotask=="function"?queueMicrotask:typeof Os<"u"?function(e){return Os.resolve(null).then(e).catch(Hd)}:Il;function Hd(e){setTimeout(function(){throw e})}function Ol(e,t){var r=t,n=0;do{var o=r.nextSibling;if(e.removeChild(r),o&&o.nodeType===8)if(r=o.data,r==="/$"){if(n===0){e.removeChild(o),fo(t);return}n--}else r!=="$"&&r!=="$?"&&r!=="$!"||n++;r=o}while(r);fo(t)}function Pr(e){for(;e!=null;e=e.nextSibling){var t=e.nodeType;if(t===1||t===3)break;if(t===8){if(t=e.data,t==="$"||t==="$!"||t==="$?")break;if(t==="/$")return null}}return e}function Fs(e){e=e.previousSibling;for(var t=0;e;){if(e.nodeType===8){var r=e.data;if(r==="$"||r==="$!"||r==="$?"){if(t===0)return e;t--}else r==="/$"&&t++}e=e.previousSibling}return null}var $n=Math.random().toString(36).slice(2),er="__reactFiber$"+$n,jo="__reactProps$"+$n,ur="__reactContainer$"+$n,Fl="__reactEvents$"+$n,Qd="__reactListeners$"+$n,Vd="__reactHandles$"+$n;function rn(e){var t=e[er];if(t)return t;for(var r=e.parentNode;r;){if(t=r[ur]||r[er]){if(r=t.alternate,t.child!==null||r!==null&&r.child!==null)for(e=Fs(e);e!==null;){if(r=e[er])return r;e=Fs(e)}return t}e=r,r=e.parentNode}return null}function So(e){return e=e[er]||e[ur],!e||e.tag!==5&&e.tag!==6&&e.tag!==13&&e.tag!==3?null:e}function An(e){if(e.tag===5||e.tag===6)return e.stateNode;throw Error(u(33))}function di(e){return e[jo]||null}var Dl=[],Bn=-1;function Tr(e){return{current:e}}function Ae(e){0>Bn||(e.current=Dl[Bn],Dl[Bn]=null,Bn--)}function Oe(e,t){Bn++,Dl[Bn]=e.current,e.current=t}var Lr={},at=Tr(Lr),gt=Tr(!1),nn=Lr;function Un(e,t){var r=e.type.contextTypes;if(!r)return Lr;var n=e.stateNode;if(n&&n.__reactInternalMemoizedUnmaskedChildContext===t)return n.__reactInternalMemoizedMaskedChildContext;var o={},l;for(l in r)o[l]=t[l];return n&&(e=e.stateNode,e.__reactInternalMemoizedUnmaskedChildContext=t,e.__reactInternalMemoizedMaskedChildContext=o),o}function vt(e){return e=e.childContextTypes,e!=null}function pi(){Ae(gt),Ae(at)}function Ds(e,t,r){if(at.current!==Lr)throw Error(u(168));Oe(at,t),Oe(gt,r)}function $s(e,t,r){var n=e.stateNode;if(t=t.childContextTypes,typeof n.getChildContext!="function")return r;n=n.getChildContext();for(var o in n)if(!(o in t))throw Error(u(108,_e(e)||"Unknown",o));return D({},r,n)}function fi(e){return e=(e=e.stateNode)&&e.__reactInternalMemoizedMergedChildContext||Lr,nn=at.current,Oe(at,e),Oe(gt,gt.current),!0}function As(e,t,r){var n=e.stateNode;if(!n)throw Error(u(169));r?(e=$s(e,t,nn),n.__reactInternalMemoizedMergedChildContext=e,Ae(gt),Ae(at),Oe(at,e)):Ae(gt),Oe(gt,r)}var cr=null,mi=!1,$l=!1;function Bs(e){cr===null?cr=[e]:cr.push(e)}function Yd(e){mi=!0,Bs(e)}function Rr(){if(!$l&&cr!==null){$l=!0;var e=0,t=b;try{var r=cr;for(b=1;e<r.length;e++){var n=r[e];do n=n(!0);while(n!==null)}cr=null,mi=!1}catch(o){throw cr!==null&&(cr=cr.slice(e+1)),Cn(sr,Rr),o}finally{b=t,$l=!1}}return null}var Wn=[],Hn=0,hi=null,gi=0,Rt=[],Mt=0,on=null,dr=1,pr="";function ln(e,t){Wn[Hn++]=gi,Wn[Hn++]=hi,hi=e,gi=t}function Us(e,t,r){Rt[Mt++]=dr,Rt[Mt++]=pr,Rt[Mt++]=on,on=e;var n=dr;e=pr;var o=32-kt(n)-1;n&=~(1<<o),r+=1;var l=32-kt(t)+o;if(30<l){var a=o-o%5;l=(n&(1<<a)-1).toString(32),n>>=a,o-=a,dr=1<<32-kt(t)+o|r<<o|n,pr=l+e}else dr=1<<l|r<<o|n,pr=e}function Al(e){e.return!==null&&(ln(e,1),Us(e,1,0))}function Bl(e){for(;e===hi;)hi=Wn[--Hn],Wn[Hn]=null,gi=Wn[--Hn],Wn[Hn]=null;for(;e===on;)on=Rt[--Mt],Rt[Mt]=null,pr=Rt[--Mt],Rt[Mt]=null,dr=Rt[--Mt],Rt[Mt]=null}var St=null,Nt=null,We=!1,Ht=null;function Ws(e,t){var r=Dt(5,null,null,0);r.elementType="DELETED",r.stateNode=t,r.return=e,t=e.deletions,t===null?(e.deletions=[r],e.flags|=16):t.push(r)}function Hs(e,t){switch(e.tag){case 5:var r=e.type;return t=t.nodeType!==1||r.toLowerCase()!==t.nodeName.toLowerCase()?null:t,t!==null?(e.stateNode=t,St=e,Nt=Pr(t.firstChild),!0):!1;case 6:return t=e.pendingProps===""||t.nodeType!==3?null:t,t!==null?(e.stateNode=t,St=e,Nt=null,!0):!1;case 13:return t=t.nodeType!==8?null:t,t!==null?(r=on!==null?{id:dr,overflow:pr}:null,e.memoizedState={dehydrated:t,treeContext:r,retryLane:1073741824},r=Dt(18,null,null,0),r.stateNode=t,r.return=e,e.child=r,St=e,Nt=null,!0):!1;default:return!1}}function Ul(e){return(e.mode&1)!==0&&(e.flags&128)===0}function Wl(e){if(We){var t=Nt;if(t){var r=t;if(!Hs(e,t)){if(Ul(e))throw Error(u(418));t=Pr(r.nextSibling);var n=St;t&&Hs(e,t)?Ws(n,r):(e.flags=e.flags&-4097|2,We=!1,St=e)}}else{if(Ul(e))throw Error(u(418));e.flags=e.flags&-4097|2,We=!1,St=e}}}function Qs(e){for(e=e.return;e!==null&&e.tag!==5&&e.tag!==3&&e.tag!==13;)e=e.return;St=e}function vi(e){if(e!==St)return!1;if(!We)return Qs(e),We=!0,!1;var t;if((t=e.tag!==3)&&!(t=e.tag!==5)&&(t=e.type,t=t!=="head"&&t!=="body"&&!Ml(e.type,e.memoizedProps)),t&&(t=Nt)){if(Ul(e))throw Vs(),Error(u(418));for(;t;)Ws(e,t),t=Pr(t.nextSibling)}if(Qs(e),e.tag===13){if(e=e.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(u(317));e:{for(e=e.nextSibling,t=0;e;){if(e.nodeType===8){var r=e.data;if(r==="/$"){if(t===0){Nt=Pr(e.nextSibling);break e}t--}else r!=="$"&&r!=="$!"&&r!=="$?"||t++}e=e.nextSibling}Nt=null}}else Nt=St?Pr(e.stateNode.nextSibling):null;return!0}function Vs(){for(var e=Nt;e;)e=Pr(e.nextSibling)}function Qn(){Nt=St=null,We=!1}function Hl(e){Ht===null?Ht=[e]:Ht.push(e)}var Kd=he.ReactCurrentBatchConfig;function No(e,t,r){if(e=r.ref,e!==null&&typeof e!="function"&&typeof e!="object"){if(r._owner){if(r=r._owner,r){if(r.tag!==1)throw Error(u(309));var n=r.stateNode}if(!n)throw Error(u(147,e));var o=n,l=""+e;return t!==null&&t.ref!==null&&typeof t.ref=="function"&&t.ref._stringRef===l?t.ref:(t=function(a){var d=o.refs;a===null?delete d[l]:d[l]=a},t._stringRef=l,t)}if(typeof e!="string")throw Error(u(284));if(!r._owner)throw Error(u(290,e))}return e}function xi(e,t){throw e=Object.prototype.toString.call(t),Error(u(31,e==="[object Object]"?"object with keys {"+Object.keys(t).join(", ")+"}":e))}function Ys(e){var t=e._init;return t(e._payload)}function Ks(e){function t(g,m){if(e){var x=g.deletions;x===null?(g.deletions=[m],g.flags|=16):x.push(m)}}function r(g,m){if(!e)return null;for(;m!==null;)t(g,m),m=m.sibling;return null}function n(g,m){for(g=new Map;m!==null;)m.key!==null?g.set(m.key,m):g.set(m.index,m),m=m.sibling;return g}function o(g,m){return g=Br(g,m),g.index=0,g.sibling=null,g}function l(g,m,x){return g.index=x,e?(x=g.alternate,x!==null?(x=x.index,x<m?(g.flags|=2,m):x):(g.flags|=2,m)):(g.flags|=1048576,m)}function a(g){return e&&g.alternate===null&&(g.flags|=2),g}function d(g,m,x,R){return m===null||m.tag!==6?(m=Ia(x,g.mode,R),m.return=g,m):(m=o(m,x),m.return=g,m)}function p(g,m,x,R){var X=x.type;return X===ye?C(g,m,x.props.children,R,x.key):m!==null&&(m.elementType===X||typeof X=="object"&&X!==null&&X.$$typeof===ce&&Ys(X)===m.type)?(R=o(m,x.props),R.ref=No(g,m,x),R.return=g,R):(R=Ui(x.type,x.key,x.props,null,g.mode,R),R.ref=No(g,m,x),R.return=g,R)}function y(g,m,x,R){return m===null||m.tag!==4||m.stateNode.containerInfo!==x.containerInfo||m.stateNode.implementation!==x.implementation?(m=Oa(x,g.mode,R),m.return=g,m):(m=o(m,x.children||[]),m.return=g,m)}function C(g,m,x,R,X){return m===null||m.tag!==7?(m=mn(x,g.mode,R,X),m.return=g,m):(m=o(m,x),m.return=g,m)}function E(g,m,x){if(typeof m=="string"&&m!==""||typeof m=="number")return m=Ia(""+m,g.mode,x),m.return=g,m;if(typeof m=="object"&&m!==null){switch(m.$$typeof){case oe:return x=Ui(m.type,m.key,m.props,null,g.mode,x),x.ref=No(g,null,m),x.return=g,x;case ve:return m=Oa(m,g.mode,x),m.return=g,m;case ce:var R=m._init;return E(g,R(m._payload),x)}if(mt(m)||W(m))return m=mn(m,g.mode,x,null),m.return=g,m;xi(g,m)}return null}function N(g,m,x,R){var X=m!==null?m.key:null;if(typeof x=="string"&&x!==""||typeof x=="number")return X!==null?null:d(g,m,""+x,R);if(typeof x=="object"&&x!==null){switch(x.$$typeof){case oe:return x.key===X?p(g,m,x,R):null;case ve:return x.key===X?y(g,m,x,R):null;case ce:return X=x._init,N(g,m,X(x._payload),R)}if(mt(x)||W(x))return X!==null?null:C(g,m,x,R,null);xi(g,x)}return null}function U(g,m,x,R,X){if(typeof R=="string"&&R!==""||typeof R=="number")return g=g.get(x)||null,d(m,g,""+R,X);if(typeof R=="object"&&R!==null){switch(R.$$typeof){case oe:return g=g.get(R.key===null?x:R.key)||null,p(m,g,R,X);case ve:return g=g.get(R.key===null?x:R.key)||null,y(m,g,R,X);case ce:var ie=R._init;return U(g,m,x,ie(R._payload),X)}if(mt(R)||W(R))return g=g.get(x)||null,C(m,g,R,X,null);xi(m,R)}return null}function K(g,m,x,R){for(var X=null,ie=null,le=m,fe=m=0,rt=null;le!==null&&fe<x.length;fe++){le.index>fe?(rt=le,le=null):rt=le.sibling;var Pe=N(g,le,x[fe],R);if(Pe===null){le===null&&(le=rt);break}e&&le&&Pe.alternate===null&&t(g,le),m=l(Pe,m,fe),ie===null?X=Pe:ie.sibling=Pe,ie=Pe,le=rt}if(fe===x.length)return r(g,le),We&&ln(g,fe),X;if(le===null){for(;fe<x.length;fe++)le=E(g,x[fe],R),le!==null&&(m=l(le,m,fe),ie===null?X=le:ie.sibling=le,ie=le);return We&&ln(g,fe),X}for(le=n(g,le);fe<x.length;fe++)rt=U(le,g,fe,x[fe],R),rt!==null&&(e&&rt.alternate!==null&&le.delete(rt.key===null?fe:rt.key),m=l(rt,m,fe),ie===null?X=rt:ie.sibling=rt,ie=rt);return e&&le.forEach(function(Ur){return t(g,Ur)}),We&&ln(g,fe),X}function G(g,m,x,R){var X=W(x);if(typeof X!="function")throw Error(u(150));if(x=X.call(x),x==null)throw Error(u(151));for(var ie=X=null,le=m,fe=m=0,rt=null,Pe=x.next();le!==null&&!Pe.done;fe++,Pe=x.next()){le.index>fe?(rt=le,le=null):rt=le.sibling;var Ur=N(g,le,Pe.value,R);if(Ur===null){le===null&&(le=rt);break}e&&le&&Ur.alternate===null&&t(g,le),m=l(Ur,m,fe),ie===null?X=Ur:ie.sibling=Ur,ie=Ur,le=rt}if(Pe.done)return r(g,le),We&&ln(g,fe),X;if(le===null){for(;!Pe.done;fe++,Pe=x.next())Pe=E(g,Pe.value,R),Pe!==null&&(m=l(Pe,m,fe),ie===null?X=Pe:ie.sibling=Pe,ie=Pe);return We&&ln(g,fe),X}for(le=n(g,le);!Pe.done;fe++,Pe=x.next())Pe=U(le,g,fe,Pe.value,R),Pe!==null&&(e&&Pe.alternate!==null&&le.delete(Pe.key===null?fe:Pe.key),m=l(Pe,m,fe),ie===null?X=Pe:ie.sibling=Pe,ie=Pe);return e&&le.forEach(function(Cp){return t(g,Cp)}),We&&ln(g,fe),X}function Ge(g,m,x,R){if(typeof x=="object"&&x!==null&&x.type===ye&&x.key===null&&(x=x.props.children),typeof x=="object"&&x!==null){switch(x.$$typeof){case oe:e:{for(var X=x.key,ie=m;ie!==null;){if(ie.key===X){if(X=x.type,X===ye){if(ie.tag===7){r(g,ie.sibling),m=o(ie,x.props.children),m.return=g,g=m;break e}}else if(ie.elementType===X||typeof X=="object"&&X!==null&&X.$$typeof===ce&&Ys(X)===ie.type){r(g,ie.sibling),m=o(ie,x.props),m.ref=No(g,ie,x),m.return=g,g=m;break e}r(g,ie);break}else t(g,ie);ie=ie.sibling}x.type===ye?(m=mn(x.props.children,g.mode,R,x.key),m.return=g,g=m):(R=Ui(x.type,x.key,x.props,null,g.mode,R),R.ref=No(g,m,x),R.return=g,g=R)}return a(g);case ve:e:{for(ie=x.key;m!==null;){if(m.key===ie)if(m.tag===4&&m.stateNode.containerInfo===x.containerInfo&&m.stateNode.implementation===x.implementation){r(g,m.sibling),m=o(m,x.children||[]),m.return=g,g=m;break e}else{r(g,m);break}else t(g,m);m=m.sibling}m=Oa(x,g.mode,R),m.return=g,g=m}return a(g);case ce:return ie=x._init,Ge(g,m,ie(x._payload),R)}if(mt(x))return K(g,m,x,R);if(W(x))return G(g,m,x,R);xi(g,x)}return typeof x=="string"&&x!==""||typeof x=="number"?(x=""+x,m!==null&&m.tag===6?(r(g,m.sibling),m=o(m,x),m.return=g,g=m):(r(g,m),m=Ia(x,g.mode,R),m.return=g,g=m),a(g)):r(g,m)}return Ge}var Vn=Ks(!0),Gs=Ks(!1),yi=Tr(null),wi=null,Yn=null,Ql=null;function Vl(){Ql=Yn=wi=null}function Yl(e){var t=yi.current;Ae(yi),e._currentValue=t}function Kl(e,t,r){for(;e!==null;){var n=e.alternate;if((e.childLanes&t)!==t?(e.childLanes|=t,n!==null&&(n.childLanes|=t)):n!==null&&(n.childLanes&t)!==t&&(n.childLanes|=t),e===r)break;e=e.return}}function Kn(e,t){wi=e,Ql=Yn=null,e=e.dependencies,e!==null&&e.firstContext!==null&&((e.lanes&t)!==0&&(xt=!0),e.firstContext=null)}function It(e){var t=e._currentValue;if(Ql!==e)if(e={context:e,memoizedValue:t,next:null},Yn===null){if(wi===null)throw Error(u(308));Yn=e,wi.dependencies={lanes:0,firstContext:e}}else Yn=Yn.next=e;return t}var an=null;function Gl(e){an===null?an=[e]:an.push(e)}function qs(e,t,r,n){var o=t.interleaved;return o===null?(r.next=r,Gl(t)):(r.next=o.next,o.next=r),t.interleaved=r,fr(e,n)}function fr(e,t){e.lanes|=t;var r=e.alternate;for(r!==null&&(r.lanes|=t),r=e,e=e.return;e!==null;)e.childLanes|=t,r=e.alternate,r!==null&&(r.childLanes|=t),r=e,e=e.return;return r.tag===3?r.stateNode:null}var Mr=!1;function ql(e){e.updateQueue={baseState:e.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null}}function Xs(e,t){e=e.updateQueue,t.updateQueue===e&&(t.updateQueue={baseState:e.baseState,firstBaseUpdate:e.firstBaseUpdate,lastBaseUpdate:e.lastBaseUpdate,shared:e.shared,effects:e.effects})}function mr(e,t){return{eventTime:e,lane:t,tag:0,payload:null,callback:null,next:null}}function Ir(e,t,r){var n=e.updateQueue;if(n===null)return null;if(n=n.shared,(Ee&2)!==0){var o=n.pending;return o===null?t.next=t:(t.next=o.next,o.next=t),n.pending=t,fr(e,r)}return o=n.interleaved,o===null?(t.next=t,Gl(n)):(t.next=o.next,o.next=t),n.interleaved=t,fr(e,r)}function bi(e,t,r){if(t=t.updateQueue,t!==null&&(t=t.shared,(r&4194240)!==0)){var n=t.lanes;n&=e.pendingLanes,r|=n,t.lanes=r,v(e,r)}}function Zs(e,t){var r=e.updateQueue,n=e.alternate;if(n!==null&&(n=n.updateQueue,r===n)){var o=null,l=null;if(r=r.firstBaseUpdate,r!==null){do{var a={eventTime:r.eventTime,lane:r.lane,tag:r.tag,payload:r.payload,callback:r.callback,next:null};l===null?o=l=a:l=l.next=a,r=r.next}while(r!==null);l===null?o=l=t:l=l.next=t}else o=l=t;r={baseState:n.baseState,firstBaseUpdate:o,lastBaseUpdate:l,shared:n.shared,effects:n.effects},e.updateQueue=r;return}e=r.lastBaseUpdate,e===null?r.firstBaseUpdate=t:e.next=t,r.lastBaseUpdate=t}function zi(e,t,r,n){var o=e.updateQueue;Mr=!1;var l=o.firstBaseUpdate,a=o.lastBaseUpdate,d=o.shared.pending;if(d!==null){o.shared.pending=null;var p=d,y=p.next;p.next=null,a===null?l=y:a.next=y,a=p;var C=e.alternate;C!==null&&(C=C.updateQueue,d=C.lastBaseUpdate,d!==a&&(d===null?C.firstBaseUpdate=y:d.next=y,C.lastBaseUpdate=p))}if(l!==null){var E=o.baseState;a=0,C=y=p=null,d=l;do{var N=d.lane,U=d.eventTime;if((n&N)===N){C!==null&&(C=C.next={eventTime:U,lane:0,tag:d.tag,payload:d.payload,callback:d.callback,next:null});e:{var K=e,G=d;switch(N=t,U=r,G.tag){case 1:if(K=G.payload,typeof K=="function"){E=K.call(U,E,N);break e}E=K;break e;case 3:K.flags=K.flags&-65537|128;case 0:if(K=G.payload,N=typeof K=="function"?K.call(U,E,N):K,N==null)break e;E=D({},E,N);break e;case 2:Mr=!0}}d.callback!==null&&d.lane!==0&&(e.flags|=64,N=o.effects,N===null?o.effects=[d]:N.push(d))}else U={eventTime:U,lane:N,tag:d.tag,payload:d.payload,callback:d.callback,next:null},C===null?(y=C=U,p=E):C=C.next=U,a|=N;if(d=d.next,d===null){if(d=o.shared.pending,d===null)break;N=d,d=N.next,N.next=null,o.lastBaseUpdate=N,o.shared.pending=null}}while(!0);if(C===null&&(p=E),o.baseState=p,o.firstBaseUpdate=y,o.lastBaseUpdate=C,t=o.shared.interleaved,t!==null){o=t;do a|=o.lane,o=o.next;while(o!==t)}else l===null&&(o.shared.lanes=0);cn|=a,e.lanes=a,e.memoizedState=E}}function Js(e,t,r){if(e=t.effects,t.effects=null,e!==null)for(t=0;t<e.length;t++){var n=e[t],o=n.callback;if(o!==null){if(n.callback=null,n=r,typeof o!="function")throw Error(u(191,o));o.call(n)}}}var Co={},tr=Tr(Co),Eo=Tr(Co),_o=Tr(Co);function sn(e){if(e===Co)throw Error(u(174));return e}function Xl(e,t){switch(Oe(_o,t),Oe(Eo,e),Oe(tr,Co),e=t.nodeType,e){case 9:case 11:t=(t=t.documentElement)?t.namespaceURI:zt(null,"");break;default:e=e===8?t.parentNode:t,t=e.namespaceURI||null,e=e.tagName,t=zt(t,e)}Ae(tr),Oe(tr,t)}function Gn(){Ae(tr),Ae(Eo),Ae(_o)}function eu(e){sn(_o.current);var t=sn(tr.current),r=zt(t,e.type);t!==r&&(Oe(Eo,e),Oe(tr,r))}function Zl(e){Eo.current===e&&(Ae(tr),Ae(Eo))}var Qe=Tr(0);function ki(e){for(var t=e;t!==null;){if(t.tag===13){var r=t.memoizedState;if(r!==null&&(r=r.dehydrated,r===null||r.data==="$?"||r.data==="$!"))return t}else if(t.tag===19&&t.memoizedProps.revealOrder!==void 0){if((t.flags&128)!==0)return t}else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return null;t=t.return}t.sibling.return=t.return,t=t.sibling}return null}var Jl=[];function ea(){for(var e=0;e<Jl.length;e++)Jl[e]._workInProgressVersionPrimary=null;Jl.length=0}var ji=he.ReactCurrentDispatcher,ta=he.ReactCurrentBatchConfig,un=0,Ve=null,Ze=null,et=null,Si=!1,Po=!1,To=0,Gd=0;function st(){throw Error(u(321))}function ra(e,t){if(t===null)return!1;for(var r=0;r<t.length&&r<e.length;r++)if(!Wt(e[r],t[r]))return!1;return!0}function na(e,t,r,n,o,l){if(un=l,Ve=t,t.memoizedState=null,t.updateQueue=null,t.lanes=0,ji.current=e===null||e.memoizedState===null?Jd:ep,e=r(n,o),Po){l=0;do{if(Po=!1,To=0,25<=l)throw Error(u(301));l+=1,et=Ze=null,t.updateQueue=null,ji.current=tp,e=r(n,o)}while(Po)}if(ji.current=Ei,t=Ze!==null&&Ze.next!==null,un=0,et=Ze=Ve=null,Si=!1,t)throw Error(u(300));return e}function oa(){var e=To!==0;return To=0,e}function rr(){var e={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return et===null?Ve.memoizedState=et=e:et=et.next=e,et}function Ot(){if(Ze===null){var e=Ve.alternate;e=e!==null?e.memoizedState:null}else e=Ze.next;var t=et===null?Ve.memoizedState:et.next;if(t!==null)et=t,Ze=e;else{if(e===null)throw Error(u(310));Ze=e,e={memoizedState:Ze.memoizedState,baseState:Ze.baseState,baseQueue:Ze.baseQueue,queue:Ze.queue,next:null},et===null?Ve.memoizedState=et=e:et=et.next=e}return et}function Lo(e,t){return typeof t=="function"?t(e):t}function ia(e){var t=Ot(),r=t.queue;if(r===null)throw Error(u(311));r.lastRenderedReducer=e;var n=Ze,o=n.baseQueue,l=r.pending;if(l!==null){if(o!==null){var a=o.next;o.next=l.next,l.next=a}n.baseQueue=o=l,r.pending=null}if(o!==null){l=o.next,n=n.baseState;var d=a=null,p=null,y=l;do{var C=y.lane;if((un&C)===C)p!==null&&(p=p.next={lane:0,action:y.action,hasEagerState:y.hasEagerState,eagerState:y.eagerState,next:null}),n=y.hasEagerState?y.eagerState:e(n,y.action);else{var E={lane:C,action:y.action,hasEagerState:y.hasEagerState,eagerState:y.eagerState,next:null};p===null?(d=p=E,a=n):p=p.next=E,Ve.lanes|=C,cn|=C}y=y.next}while(y!==null&&y!==l);p===null?a=n:p.next=d,Wt(n,t.memoizedState)||(xt=!0),t.memoizedState=n,t.baseState=a,t.baseQueue=p,r.lastRenderedState=n}if(e=r.interleaved,e!==null){o=e;do l=o.lane,Ve.lanes|=l,cn|=l,o=o.next;while(o!==e)}else o===null&&(r.lanes=0);return[t.memoizedState,r.dispatch]}function la(e){var t=Ot(),r=t.queue;if(r===null)throw Error(u(311));r.lastRenderedReducer=e;var n=r.dispatch,o=r.pending,l=t.memoizedState;if(o!==null){r.pending=null;var a=o=o.next;do l=e(l,a.action),a=a.next;while(a!==o);Wt(l,t.memoizedState)||(xt=!0),t.memoizedState=l,t.baseQueue===null&&(t.baseState=l),r.lastRenderedState=l}return[l,n]}function tu(){}function ru(e,t){var r=Ve,n=Ot(),o=t(),l=!Wt(n.memoizedState,o);if(l&&(n.memoizedState=o,xt=!0),n=n.queue,aa(iu.bind(null,r,n,e),[e]),n.getSnapshot!==t||l||et!==null&&et.memoizedState.tag&1){if(r.flags|=2048,Ro(9,ou.bind(null,r,n,o,t),void 0,null),tt===null)throw Error(u(349));(un&30)!==0||nu(r,t,o)}return o}function nu(e,t,r){e.flags|=16384,e={getSnapshot:t,value:r},t=Ve.updateQueue,t===null?(t={lastEffect:null,stores:null},Ve.updateQueue=t,t.stores=[e]):(r=t.stores,r===null?t.stores=[e]:r.push(e))}function ou(e,t,r,n){t.value=r,t.getSnapshot=n,lu(t)&&au(e)}function iu(e,t,r){return r(function(){lu(t)&&au(e)})}function lu(e){var t=e.getSnapshot;e=e.value;try{var r=t();return!Wt(e,r)}catch{return!0}}function au(e){var t=fr(e,1);t!==null&&Kt(t,e,1,-1)}function su(e){var t=rr();return typeof e=="function"&&(e=e()),t.memoizedState=t.baseState=e,e={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:Lo,lastRenderedState:e},t.queue=e,e=e.dispatch=Zd.bind(null,Ve,e),[t.memoizedState,e]}function Ro(e,t,r,n){return e={tag:e,create:t,destroy:r,deps:n,next:null},t=Ve.updateQueue,t===null?(t={lastEffect:null,stores:null},Ve.updateQueue=t,t.lastEffect=e.next=e):(r=t.lastEffect,r===null?t.lastEffect=e.next=e:(n=r.next,r.next=e,e.next=n,t.lastEffect=e)),e}function uu(){return Ot().memoizedState}function Ni(e,t,r,n){var o=rr();Ve.flags|=e,o.memoizedState=Ro(1|t,r,void 0,n===void 0?null:n)}function Ci(e,t,r,n){var o=Ot();n=n===void 0?null:n;var l=void 0;if(Ze!==null){var a=Ze.memoizedState;if(l=a.destroy,n!==null&&ra(n,a.deps)){o.memoizedState=Ro(t,r,l,n);return}}Ve.flags|=e,o.memoizedState=Ro(1|t,r,l,n)}function cu(e,t){return Ni(8390656,8,e,t)}function aa(e,t){return Ci(2048,8,e,t)}function du(e,t){return Ci(4,2,e,t)}function pu(e,t){return Ci(4,4,e,t)}function fu(e,t){if(typeof t=="function")return e=e(),t(e),function(){t(null)};if(t!=null)return e=e(),t.current=e,function(){t.current=null}}function mu(e,t,r){return r=r!=null?r.concat([e]):null,Ci(4,4,fu.bind(null,t,e),r)}function sa(){}function hu(e,t){var r=Ot();t=t===void 0?null:t;var n=r.memoizedState;return n!==null&&t!==null&&ra(t,n[1])?n[0]:(r.memoizedState=[e,t],e)}function gu(e,t){var r=Ot();t=t===void 0?null:t;var n=r.memoizedState;return n!==null&&t!==null&&ra(t,n[1])?n[0]:(e=e(),r.memoizedState=[e,t],e)}function vu(e,t,r){return(un&21)===0?(e.baseState&&(e.baseState=!1,xt=!0),e.memoizedState=r):(Wt(r,t)||(r=co(),Ve.lanes|=r,cn|=r,e.baseState=!0),t)}function qd(e,t){var r=b;b=r!==0&&4>r?r:4,e(!0);var n=ta.transition;ta.transition={};try{e(!1),t()}finally{b=r,ta.transition=n}}function xu(){return Ot().memoizedState}function Xd(e,t,r){var n=$r(e);if(r={lane:n,action:r,hasEagerState:!1,eagerState:null,next:null},yu(e))wu(t,r);else if(r=qs(e,t,r,n),r!==null){var o=pt();Kt(r,e,n,o),bu(r,t,n)}}function Zd(e,t,r){var n=$r(e),o={lane:n,action:r,hasEagerState:!1,eagerState:null,next:null};if(yu(e))wu(t,o);else{var l=e.alternate;if(e.lanes===0&&(l===null||l.lanes===0)&&(l=t.lastRenderedReducer,l!==null))try{var a=t.lastRenderedState,d=l(a,r);if(o.hasEagerState=!0,o.eagerState=d,Wt(d,a)){var p=t.interleaved;p===null?(o.next=o,Gl(t)):(o.next=p.next,p.next=o),t.interleaved=o;return}}catch{}finally{}r=qs(e,t,o,n),r!==null&&(o=pt(),Kt(r,e,n,o),bu(r,t,n))}}function yu(e){var t=e.alternate;return e===Ve||t!==null&&t===Ve}function wu(e,t){Po=Si=!0;var r=e.pending;r===null?t.next=t:(t.next=r.next,r.next=t),e.pending=t}function bu(e,t,r){if((r&4194240)!==0){var n=t.lanes;n&=e.pendingLanes,r|=n,t.lanes=r,v(e,r)}}var Ei={readContext:It,useCallback:st,useContext:st,useEffect:st,useImperativeHandle:st,useInsertionEffect:st,useLayoutEffect:st,useMemo:st,useReducer:st,useRef:st,useState:st,useDebugValue:st,useDeferredValue:st,useTransition:st,useMutableSource:st,useSyncExternalStore:st,useId:st,unstable_isNewReconciler:!1},Jd={readContext:It,useCallback:function(e,t){return rr().memoizedState=[e,t===void 0?null:t],e},useContext:It,useEffect:cu,useImperativeHandle:function(e,t,r){return r=r!=null?r.concat([e]):null,Ni(4194308,4,fu.bind(null,t,e),r)},useLayoutEffect:function(e,t){return Ni(4194308,4,e,t)},useInsertionEffect:function(e,t){return Ni(4,2,e,t)},useMemo:function(e,t){var r=rr();return t=t===void 0?null:t,e=e(),r.memoizedState=[e,t],e},useReducer:function(e,t,r){var n=rr();return t=r!==void 0?r(t):t,n.memoizedState=n.baseState=t,e={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:e,lastRenderedState:t},n.queue=e,e=e.dispatch=Xd.bind(null,Ve,e),[n.memoizedState,e]},useRef:function(e){var t=rr();return e={current:e},t.memoizedState=e},useState:su,useDebugValue:sa,useDeferredValue:function(e){return rr().memoizedState=e},useTransition:function(){var e=su(!1),t=e[0];return e=qd.bind(null,e[1]),rr().memoizedState=e,[t,e]},useMutableSource:function(){},useSyncExternalStore:function(e,t,r){var n=Ve,o=rr();if(We){if(r===void 0)throw Error(u(407));r=r()}else{if(r=t(),tt===null)throw Error(u(349));(un&30)!==0||nu(n,t,r)}o.memoizedState=r;var l={value:r,getSnapshot:t};return o.queue=l,cu(iu.bind(null,n,l,e),[e]),n.flags|=2048,Ro(9,ou.bind(null,n,l,r,t),void 0,null),r},useId:function(){var e=rr(),t=tt.identifierPrefix;if(We){var r=pr,n=dr;r=(n&~(1<<32-kt(n)-1)).toString(32)+r,t=":"+t+"R"+r,r=To++,0<r&&(t+="H"+r.toString(32)),t+=":"}else r=Gd++,t=":"+t+"r"+r.toString(32)+":";return e.memoizedState=t},unstable_isNewReconciler:!1},ep={readContext:It,useCallback:hu,useContext:It,useEffect:aa,useImperativeHandle:mu,useInsertionEffect:du,useLayoutEffect:pu,useMemo:gu,useReducer:ia,useRef:uu,useState:function(){return ia(Lo)},useDebugValue:sa,useDeferredValue:function(e){var t=Ot();return vu(t,Ze.memoizedState,e)},useTransition:function(){var e=ia(Lo)[0],t=Ot().memoizedState;return[e,t]},useMutableSource:tu,useSyncExternalStore:ru,useId:xu,unstable_isNewReconciler:!1},tp={readContext:It,useCallback:hu,useContext:It,useEffect:aa,useImperativeHandle:mu,useInsertionEffect:du,useLayoutEffect:pu,useMemo:gu,useReducer:la,useRef:uu,useState:function(){return la(Lo)},useDebugValue:sa,useDeferredValue:function(e){var t=Ot();return Ze===null?t.memoizedState=e:vu(t,Ze.memoizedState,e)},useTransition:function(){var e=la(Lo)[0],t=Ot().memoizedState;return[e,t]},useMutableSource:tu,useSyncExternalStore:ru,useId:xu,unstable_isNewReconciler:!1};function Qt(e,t){if(e&&e.defaultProps){t=D({},t),e=e.defaultProps;for(var r in e)t[r]===void 0&&(t[r]=e[r]);return t}return t}function ua(e,t,r,n){t=e.memoizedState,r=r(n,t),r=r==null?t:D({},t,r),e.memoizedState=r,e.lanes===0&&(e.updateQueue.baseState=r)}var _i={isMounted:function(e){return(e=e._reactInternals)?Fe(e)===e:!1},enqueueSetState:function(e,t,r){e=e._reactInternals;var n=pt(),o=$r(e),l=mr(n,o);l.payload=t,r!=null&&(l.callback=r),t=Ir(e,l,o),t!==null&&(Kt(t,e,o,n),bi(t,e,o))},enqueueReplaceState:function(e,t,r){e=e._reactInternals;var n=pt(),o=$r(e),l=mr(n,o);l.tag=1,l.payload=t,r!=null&&(l.callback=r),t=Ir(e,l,o),t!==null&&(Kt(t,e,o,n),bi(t,e,o))},enqueueForceUpdate:function(e,t){e=e._reactInternals;var r=pt(),n=$r(e),o=mr(r,n);o.tag=2,t!=null&&(o.callback=t),t=Ir(e,o,n),t!==null&&(Kt(t,e,n,r),bi(t,e,n))}};function zu(e,t,r,n,o,l,a){return e=e.stateNode,typeof e.shouldComponentUpdate=="function"?e.shouldComponentUpdate(n,l,a):t.prototype&&t.prototype.isPureReactComponent?!yo(r,n)||!yo(o,l):!0}function ku(e,t,r){var n=!1,o=Lr,l=t.contextType;return typeof l=="object"&&l!==null?l=It(l):(o=vt(t)?nn:at.current,n=t.contextTypes,l=(n=n!=null)?Un(e,o):Lr),t=new t(r,l),e.memoizedState=t.state!==null&&t.state!==void 0?t.state:null,t.updater=_i,e.stateNode=t,t._reactInternals=e,n&&(e=e.stateNode,e.__reactInternalMemoizedUnmaskedChildContext=o,e.__reactInternalMemoizedMaskedChildContext=l),t}function ju(e,t,r,n){e=t.state,typeof t.componentWillReceiveProps=="function"&&t.componentWillReceiveProps(r,n),typeof t.UNSAFE_componentWillReceiveProps=="function"&&t.UNSAFE_componentWillReceiveProps(r,n),t.state!==e&&_i.enqueueReplaceState(t,t.state,null)}function ca(e,t,r,n){var o=e.stateNode;o.props=r,o.state=e.memoizedState,o.refs={},ql(e);var l=t.contextType;typeof l=="object"&&l!==null?o.context=It(l):(l=vt(t)?nn:at.current,o.context=Un(e,l)),o.state=e.memoizedState,l=t.getDerivedStateFromProps,typeof l=="function"&&(ua(e,t,l,r),o.state=e.memoizedState),typeof t.getDerivedStateFromProps=="function"||typeof o.getSnapshotBeforeUpdate=="function"||typeof o.UNSAFE_componentWillMount!="function"&&typeof o.componentWillMount!="function"||(t=o.state,typeof o.componentWillMount=="function"&&o.componentWillMount(),typeof o.UNSAFE_componentWillMount=="function"&&o.UNSAFE_componentWillMount(),t!==o.state&&_i.enqueueReplaceState(o,o.state,null),zi(e,r,o,n),o.state=e.memoizedState),typeof o.componentDidMount=="function"&&(e.flags|=4194308)}function qn(e,t){try{var r="",n=t;do r+=ke(n),n=n.return;while(n);var o=r}catch(l){o=`
Error generating stack: `+l.message+`
`+l.stack}return{value:e,source:t,stack:o,digest:null}}function da(e,t,r){return{value:e,source:null,stack:r??null,digest:t??null}}function pa(e,t){try{console.error(t.value)}catch(r){setTimeout(function(){throw r})}}var rp=typeof WeakMap=="function"?WeakMap:Map;function Su(e,t,r){r=mr(-1,r),r.tag=3,r.payload={element:null};var n=t.value;return r.callback=function(){Oi||(Oi=!0,Ca=n),pa(e,t)},r}function Nu(e,t,r){r=mr(-1,r),r.tag=3;var n=e.type.getDerivedStateFromError;if(typeof n=="function"){var o=t.value;r.payload=function(){return n(o)},r.callback=function(){pa(e,t)}}var l=e.stateNode;return l!==null&&typeof l.componentDidCatch=="function"&&(r.callback=function(){pa(e,t),typeof n!="function"&&(Fr===null?Fr=new Set([this]):Fr.add(this));var a=t.stack;this.componentDidCatch(t.value,{componentStack:a!==null?a:""})}),r}function Cu(e,t,r){var n=e.pingCache;if(n===null){n=e.pingCache=new rp;var o=new Set;n.set(t,o)}else o=n.get(t),o===void 0&&(o=new Set,n.set(t,o));o.has(r)||(o.add(r),e=gp.bind(null,e,t,r),t.then(e,e))}function Eu(e){do{var t;if((t=e.tag===13)&&(t=e.memoizedState,t=t!==null?t.dehydrated!==null:!0),t)return e;e=e.return}while(e!==null);return null}function _u(e,t,r,n,o){return(e.mode&1)===0?(e===t?e.flags|=65536:(e.flags|=128,r.flags|=131072,r.flags&=-52805,r.tag===1&&(r.alternate===null?r.tag=17:(t=mr(-1,1),t.tag=2,Ir(r,t,1))),r.lanes|=1),e):(e.flags|=65536,e.lanes=o,e)}var np=he.ReactCurrentOwner,xt=!1;function dt(e,t,r,n){t.child=e===null?Gs(t,null,r,n):Vn(t,e.child,r,n)}function Pu(e,t,r,n,o){r=r.render;var l=t.ref;return Kn(t,o),n=na(e,t,r,n,l,o),r=oa(),e!==null&&!xt?(t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~o,hr(e,t,o)):(We&&r&&Al(t),t.flags|=1,dt(e,t,n,o),t.child)}function Tu(e,t,r,n,o){if(e===null){var l=r.type;return typeof l=="function"&&!Ma(l)&&l.defaultProps===void 0&&r.compare===null&&r.defaultProps===void 0?(t.tag=15,t.type=l,Lu(e,t,l,n,o)):(e=Ui(r.type,null,n,t,t.mode,o),e.ref=t.ref,e.return=t,t.child=e)}if(l=e.child,(e.lanes&o)===0){var a=l.memoizedProps;if(r=r.compare,r=r!==null?r:yo,r(a,n)&&e.ref===t.ref)return hr(e,t,o)}return t.flags|=1,e=Br(l,n),e.ref=t.ref,e.return=t,t.child=e}function Lu(e,t,r,n,o){if(e!==null){var l=e.memoizedProps;if(yo(l,n)&&e.ref===t.ref)if(xt=!1,t.pendingProps=n=l,(e.lanes&o)!==0)(e.flags&131072)!==0&&(xt=!0);else return t.lanes=e.lanes,hr(e,t,o)}return fa(e,t,r,n,o)}function Ru(e,t,r){var n=t.pendingProps,o=n.children,l=e!==null?e.memoizedState:null;if(n.mode==="hidden")if((t.mode&1)===0)t.memoizedState={baseLanes:0,cachePool:null,transitions:null},Oe(Zn,Ct),Ct|=r;else{if((r&1073741824)===0)return e=l!==null?l.baseLanes|r:r,t.lanes=t.childLanes=1073741824,t.memoizedState={baseLanes:e,cachePool:null,transitions:null},t.updateQueue=null,Oe(Zn,Ct),Ct|=e,null;t.memoizedState={baseLanes:0,cachePool:null,transitions:null},n=l!==null?l.baseLanes:r,Oe(Zn,Ct),Ct|=n}else l!==null?(n=l.baseLanes|r,t.memoizedState=null):n=r,Oe(Zn,Ct),Ct|=n;return dt(e,t,o,r),t.child}function Mu(e,t){var r=t.ref;(e===null&&r!==null||e!==null&&e.ref!==r)&&(t.flags|=512,t.flags|=2097152)}function fa(e,t,r,n,o){var l=vt(r)?nn:at.current;return l=Un(t,l),Kn(t,o),r=na(e,t,r,n,l,o),n=oa(),e!==null&&!xt?(t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~o,hr(e,t,o)):(We&&n&&Al(t),t.flags|=1,dt(e,t,r,o),t.child)}function Iu(e,t,r,n,o){if(vt(r)){var l=!0;fi(t)}else l=!1;if(Kn(t,o),t.stateNode===null)Ti(e,t),ku(t,r,n),ca(t,r,n,o),n=!0;else if(e===null){var a=t.stateNode,d=t.memoizedProps;a.props=d;var p=a.context,y=r.contextType;typeof y=="object"&&y!==null?y=It(y):(y=vt(r)?nn:at.current,y=Un(t,y));var C=r.getDerivedStateFromProps,E=typeof C=="function"||typeof a.getSnapshotBeforeUpdate=="function";E||typeof a.UNSAFE_componentWillReceiveProps!="function"&&typeof a.componentWillReceiveProps!="function"||(d!==n||p!==y)&&ju(t,a,n,y),Mr=!1;var N=t.memoizedState;a.state=N,zi(t,n,a,o),p=t.memoizedState,d!==n||N!==p||gt.current||Mr?(typeof C=="function"&&(ua(t,r,C,n),p=t.memoizedState),(d=Mr||zu(t,r,d,n,N,p,y))?(E||typeof a.UNSAFE_componentWillMount!="function"&&typeof a.componentWillMount!="function"||(typeof a.componentWillMount=="function"&&a.componentWillMount(),typeof a.UNSAFE_componentWillMount=="function"&&a.UNSAFE_componentWillMount()),typeof a.componentDidMount=="function"&&(t.flags|=4194308)):(typeof a.componentDidMount=="function"&&(t.flags|=4194308),t.memoizedProps=n,t.memoizedState=p),a.props=n,a.state=p,a.context=y,n=d):(typeof a.componentDidMount=="function"&&(t.flags|=4194308),n=!1)}else{a=t.stateNode,Xs(e,t),d=t.memoizedProps,y=t.type===t.elementType?d:Qt(t.type,d),a.props=y,E=t.pendingProps,N=a.context,p=r.contextType,typeof p=="object"&&p!==null?p=It(p):(p=vt(r)?nn:at.current,p=Un(t,p));var U=r.getDerivedStateFromProps;(C=typeof U=="function"||typeof a.getSnapshotBeforeUpdate=="function")||typeof a.UNSAFE_componentWillReceiveProps!="function"&&typeof a.componentWillReceiveProps!="function"||(d!==E||N!==p)&&ju(t,a,n,p),Mr=!1,N=t.memoizedState,a.state=N,zi(t,n,a,o);var K=t.memoizedState;d!==E||N!==K||gt.current||Mr?(typeof U=="function"&&(ua(t,r,U,n),K=t.memoizedState),(y=Mr||zu(t,r,y,n,N,K,p)||!1)?(C||typeof a.UNSAFE_componentWillUpdate!="function"&&typeof a.componentWillUpdate!="function"||(typeof a.componentWillUpdate=="function"&&a.componentWillUpdate(n,K,p),typeof a.UNSAFE_componentWillUpdate=="function"&&a.UNSAFE_componentWillUpdate(n,K,p)),typeof a.componentDidUpdate=="function"&&(t.flags|=4),typeof a.getSnapshotBeforeUpdate=="function"&&(t.flags|=1024)):(typeof a.componentDidUpdate!="function"||d===e.memoizedProps&&N===e.memoizedState||(t.flags|=4),typeof a.getSnapshotBeforeUpdate!="function"||d===e.memoizedProps&&N===e.memoizedState||(t.flags|=1024),t.memoizedProps=n,t.memoizedState=K),a.props=n,a.state=K,a.context=p,n=y):(typeof a.componentDidUpdate!="function"||d===e.memoizedProps&&N===e.memoizedState||(t.flags|=4),typeof a.getSnapshotBeforeUpdate!="function"||d===e.memoizedProps&&N===e.memoizedState||(t.flags|=1024),n=!1)}return ma(e,t,r,n,l,o)}function ma(e,t,r,n,o,l){Mu(e,t);var a=(t.flags&128)!==0;if(!n&&!a)return o&&As(t,r,!1),hr(e,t,l);n=t.stateNode,np.current=t;var d=a&&typeof r.getDerivedStateFromError!="function"?null:n.render();return t.flags|=1,e!==null&&a?(t.child=Vn(t,e.child,null,l),t.child=Vn(t,null,d,l)):dt(e,t,d,l),t.memoizedState=n.state,o&&As(t,r,!0),t.child}function Ou(e){var t=e.stateNode;t.pendingContext?Ds(e,t.pendingContext,t.pendingContext!==t.context):t.context&&Ds(e,t.context,!1),Xl(e,t.containerInfo)}function Fu(e,t,r,n,o){return Qn(),Hl(o),t.flags|=256,dt(e,t,r,n),t.child}var ha={dehydrated:null,treeContext:null,retryLane:0};function ga(e){return{baseLanes:e,cachePool:null,transitions:null}}function Du(e,t,r){var n=t.pendingProps,o=Qe.current,l=!1,a=(t.flags&128)!==0,d;if((d=a)||(d=e!==null&&e.memoizedState===null?!1:(o&2)!==0),d?(l=!0,t.flags&=-129):(e===null||e.memoizedState!==null)&&(o|=1),Oe(Qe,o&1),e===null)return Wl(t),e=t.memoizedState,e!==null&&(e=e.dehydrated,e!==null)?((t.mode&1)===0?t.lanes=1:e.data==="$!"?t.lanes=8:t.lanes=1073741824,null):(a=n.children,e=n.fallback,l?(n=t.mode,l=t.child,a={mode:"hidden",children:a},(n&1)===0&&l!==null?(l.childLanes=0,l.pendingProps=a):l=Wi(a,n,0,null),e=mn(e,n,r,null),l.return=t,e.return=t,l.sibling=e,t.child=l,t.child.memoizedState=ga(r),t.memoizedState=ha,e):va(t,a));if(o=e.memoizedState,o!==null&&(d=o.dehydrated,d!==null))return op(e,t,a,n,d,o,r);if(l){l=n.fallback,a=t.mode,o=e.child,d=o.sibling;var p={mode:"hidden",children:n.children};return(a&1)===0&&t.child!==o?(n=t.child,n.childLanes=0,n.pendingProps=p,t.deletions=null):(n=Br(o,p),n.subtreeFlags=o.subtreeFlags&14680064),d!==null?l=Br(d,l):(l=mn(l,a,r,null),l.flags|=2),l.return=t,n.return=t,n.sibling=l,t.child=n,n=l,l=t.child,a=e.child.memoizedState,a=a===null?ga(r):{baseLanes:a.baseLanes|r,cachePool:null,transitions:a.transitions},l.memoizedState=a,l.childLanes=e.childLanes&~r,t.memoizedState=ha,n}return l=e.child,e=l.sibling,n=Br(l,{mode:"visible",children:n.children}),(t.mode&1)===0&&(n.lanes=r),n.return=t,n.sibling=null,e!==null&&(r=t.deletions,r===null?(t.deletions=[e],t.flags|=16):r.push(e)),t.child=n,t.memoizedState=null,n}function va(e,t){return t=Wi({mode:"visible",children:t},e.mode,0,null),t.return=e,e.child=t}function Pi(e,t,r,n){return n!==null&&Hl(n),Vn(t,e.child,null,r),e=va(t,t.pendingProps.children),e.flags|=2,t.memoizedState=null,e}function op(e,t,r,n,o,l,a){if(r)return t.flags&256?(t.flags&=-257,n=da(Error(u(422))),Pi(e,t,a,n)):t.memoizedState!==null?(t.child=e.child,t.flags|=128,null):(l=n.fallback,o=t.mode,n=Wi({mode:"visible",children:n.children},o,0,null),l=mn(l,o,a,null),l.flags|=2,n.return=t,l.return=t,n.sibling=l,t.child=n,(t.mode&1)!==0&&Vn(t,e.child,null,a),t.child.memoizedState=ga(a),t.memoizedState=ha,l);if((t.mode&1)===0)return Pi(e,t,a,null);if(o.data==="$!"){if(n=o.nextSibling&&o.nextSibling.dataset,n)var d=n.dgst;return n=d,l=Error(u(419)),n=da(l,n,void 0),Pi(e,t,a,n)}if(d=(a&e.childLanes)!==0,xt||d){if(n=tt,n!==null){switch(a&-a){case 4:o=2;break;case 16:o=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:o=32;break;case 536870912:o=268435456;break;default:o=0}o=(o&(n.suspendedLanes|a))!==0?0:o,o!==0&&o!==l.retryLane&&(l.retryLane=o,fr(e,o),Kt(n,e,o,-1))}return Ra(),n=da(Error(u(421))),Pi(e,t,a,n)}return o.data==="$?"?(t.flags|=128,t.child=e.child,t=vp.bind(null,e),o._reactRetry=t,null):(e=l.treeContext,Nt=Pr(o.nextSibling),St=t,We=!0,Ht=null,e!==null&&(Rt[Mt++]=dr,Rt[Mt++]=pr,Rt[Mt++]=on,dr=e.id,pr=e.overflow,on=t),t=va(t,n.children),t.flags|=4096,t)}function $u(e,t,r){e.lanes|=t;var n=e.alternate;n!==null&&(n.lanes|=t),Kl(e.return,t,r)}function xa(e,t,r,n,o){var l=e.memoizedState;l===null?e.memoizedState={isBackwards:t,rendering:null,renderingStartTime:0,last:n,tail:r,tailMode:o}:(l.isBackwards=t,l.rendering=null,l.renderingStartTime=0,l.last=n,l.tail=r,l.tailMode=o)}function Au(e,t,r){var n=t.pendingProps,o=n.revealOrder,l=n.tail;if(dt(e,t,n.children,r),n=Qe.current,(n&2)!==0)n=n&1|2,t.flags|=128;else{if(e!==null&&(e.flags&128)!==0)e:for(e=t.child;e!==null;){if(e.tag===13)e.memoizedState!==null&&$u(e,r,t);else if(e.tag===19)$u(e,r,t);else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break e;for(;e.sibling===null;){if(e.return===null||e.return===t)break e;e=e.return}e.sibling.return=e.return,e=e.sibling}n&=1}if(Oe(Qe,n),(t.mode&1)===0)t.memoizedState=null;else switch(o){case"forwards":for(r=t.child,o=null;r!==null;)e=r.alternate,e!==null&&ki(e)===null&&(o=r),r=r.sibling;r=o,r===null?(o=t.child,t.child=null):(o=r.sibling,r.sibling=null),xa(t,!1,o,r,l);break;case"backwards":for(r=null,o=t.child,t.child=null;o!==null;){if(e=o.alternate,e!==null&&ki(e)===null){t.child=o;break}e=o.sibling,o.sibling=r,r=o,o=e}xa(t,!0,r,null,l);break;case"together":xa(t,!1,null,null,void 0);break;default:t.memoizedState=null}return t.child}function Ti(e,t){(t.mode&1)===0&&e!==null&&(e.alternate=null,t.alternate=null,t.flags|=2)}function hr(e,t,r){if(e!==null&&(t.dependencies=e.dependencies),cn|=t.lanes,(r&t.childLanes)===0)return null;if(e!==null&&t.child!==e.child)throw Error(u(153));if(t.child!==null){for(e=t.child,r=Br(e,e.pendingProps),t.child=r,r.return=t;e.sibling!==null;)e=e.sibling,r=r.sibling=Br(e,e.pendingProps),r.return=t;r.sibling=null}return t.child}function ip(e,t,r){switch(t.tag){case 3:Ou(t),Qn();break;case 5:eu(t);break;case 1:vt(t.type)&&fi(t);break;case 4:Xl(t,t.stateNode.containerInfo);break;case 10:var n=t.type._context,o=t.memoizedProps.value;Oe(yi,n._currentValue),n._currentValue=o;break;case 13:if(n=t.memoizedState,n!==null)return n.dehydrated!==null?(Oe(Qe,Qe.current&1),t.flags|=128,null):(r&t.child.childLanes)!==0?Du(e,t,r):(Oe(Qe,Qe.current&1),e=hr(e,t,r),e!==null?e.sibling:null);Oe(Qe,Qe.current&1);break;case 19:if(n=(r&t.childLanes)!==0,(e.flags&128)!==0){if(n)return Au(e,t,r);t.flags|=128}if(o=t.memoizedState,o!==null&&(o.rendering=null,o.tail=null,o.lastEffect=null),Oe(Qe,Qe.current),n)break;return null;case 22:case 23:return t.lanes=0,Ru(e,t,r)}return hr(e,t,r)}var Bu,ya,Uu,Wu;Bu=function(e,t){for(var r=t.child;r!==null;){if(r.tag===5||r.tag===6)e.appendChild(r.stateNode);else if(r.tag!==4&&r.child!==null){r.child.return=r,r=r.child;continue}if(r===t)break;for(;r.sibling===null;){if(r.return===null||r.return===t)return;r=r.return}r.sibling.return=r.return,r=r.sibling}},ya=function(){},Uu=function(e,t,r,n){var o=e.memoizedProps;if(o!==n){e=t.stateNode,sn(tr.current);var l=null;switch(r){case"input":o=or(e,o),n=or(e,n),l=[];break;case"select":o=D({},o,{value:void 0}),n=D({},n,{value:void 0}),l=[];break;case"textarea":o=io(e,o),n=io(e,n),l=[];break;default:typeof o.onClick!="function"&&typeof n.onClick=="function"&&(e.onclick=ci)}Xt(r,n);var a;r=null;for(y in o)if(!n.hasOwnProperty(y)&&o.hasOwnProperty(y)&&o[y]!=null)if(y==="style"){var d=o[y];for(a in d)d.hasOwnProperty(a)&&(r||(r={}),r[a]="")}else y!=="dangerouslySetInnerHTML"&&y!=="children"&&y!=="suppressContentEditableWarning"&&y!=="suppressHydrationWarning"&&y!=="autoFocus"&&(w.hasOwnProperty(y)?l||(l=[]):(l=l||[]).push(y,null));for(y in n){var p=n[y];if(d=o!=null?o[y]:void 0,n.hasOwnProperty(y)&&p!==d&&(p!=null||d!=null))if(y==="style")if(d){for(a in d)!d.hasOwnProperty(a)||p&&p.hasOwnProperty(a)||(r||(r={}),r[a]="");for(a in p)p.hasOwnProperty(a)&&d[a]!==p[a]&&(r||(r={}),r[a]=p[a])}else r||(l||(l=[]),l.push(y,r)),r=p;else y==="dangerouslySetInnerHTML"?(p=p?p.__html:void 0,d=d?d.__html:void 0,p!=null&&d!==p&&(l=l||[]).push(y,p)):y==="children"?typeof p!="string"&&typeof p!="number"||(l=l||[]).push(y,""+p):y!=="suppressContentEditableWarning"&&y!=="suppressHydrationWarning"&&(w.hasOwnProperty(y)?(p!=null&&y==="onScroll"&&$e("scroll",e),l||d===p||(l=[])):(l=l||[]).push(y,p))}r&&(l=l||[]).push("style",r);var y=l;(t.updateQueue=y)&&(t.flags|=4)}},Wu=function(e,t,r,n){r!==n&&(t.flags|=4)};function Mo(e,t){if(!We)switch(e.tailMode){case"hidden":t=e.tail;for(var r=null;t!==null;)t.alternate!==null&&(r=t),t=t.sibling;r===null?e.tail=null:r.sibling=null;break;case"collapsed":r=e.tail;for(var n=null;r!==null;)r.alternate!==null&&(n=r),r=r.sibling;n===null?t||e.tail===null?e.tail=null:e.tail.sibling=null:n.sibling=null}}function ut(e){var t=e.alternate!==null&&e.alternate.child===e.child,r=0,n=0;if(t)for(var o=e.child;o!==null;)r|=o.lanes|o.childLanes,n|=o.subtreeFlags&14680064,n|=o.flags&14680064,o.return=e,o=o.sibling;else for(o=e.child;o!==null;)r|=o.lanes|o.childLanes,n|=o.subtreeFlags,n|=o.flags,o.return=e,o=o.sibling;return e.subtreeFlags|=n,e.childLanes=r,t}function lp(e,t,r){var n=t.pendingProps;switch(Bl(t),t.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return ut(t),null;case 1:return vt(t.type)&&pi(),ut(t),null;case 3:return n=t.stateNode,Gn(),Ae(gt),Ae(at),ea(),n.pendingContext&&(n.context=n.pendingContext,n.pendingContext=null),(e===null||e.child===null)&&(vi(t)?t.flags|=4:e===null||e.memoizedState.isDehydrated&&(t.flags&256)===0||(t.flags|=1024,Ht!==null&&(Pa(Ht),Ht=null))),ya(e,t),ut(t),null;case 5:Zl(t);var o=sn(_o.current);if(r=t.type,e!==null&&t.stateNode!=null)Uu(e,t,r,n,o),e.ref!==t.ref&&(t.flags|=512,t.flags|=2097152);else{if(!n){if(t.stateNode===null)throw Error(u(166));return ut(t),null}if(e=sn(tr.current),vi(t)){n=t.stateNode,r=t.type;var l=t.memoizedProps;switch(n[er]=t,n[jo]=l,e=(t.mode&1)!==0,r){case"dialog":$e("cancel",n),$e("close",n);break;case"iframe":case"object":case"embed":$e("load",n);break;case"video":case"audio":for(o=0;o<bo.length;o++)$e(bo[o],n);break;case"source":$e("error",n);break;case"img":case"image":case"link":$e("error",n),$e("load",n);break;case"details":$e("toggle",n);break;case"input":vr(n,l),$e("invalid",n);break;case"select":n._wrapperState={wasMultiple:!!l.multiple},$e("invalid",n);break;case"textarea":At(n,l),$e("invalid",n)}Xt(r,l),o=null;for(var a in l)if(l.hasOwnProperty(a)){var d=l[a];a==="children"?typeof d=="string"?n.textContent!==d&&(l.suppressHydrationWarning!==!0&&ui(n.textContent,d,e),o=["children",d]):typeof d=="number"&&n.textContent!==""+d&&(l.suppressHydrationWarning!==!0&&ui(n.textContent,d,e),o=["children",""+d]):w.hasOwnProperty(a)&&d!=null&&a==="onScroll"&&$e("scroll",n)}switch(r){case"input":$t(n),oo(n,l,!0);break;case"textarea":$t(n),wr(n);break;case"select":case"option":break;default:typeof l.onClick=="function"&&(n.onclick=ci)}n=o,t.updateQueue=n,n!==null&&(t.flags|=4)}else{a=o.nodeType===9?o:o.ownerDocument,e==="http://www.w3.org/1999/xhtml"&&(e=vn(r)),e==="http://www.w3.org/1999/xhtml"?r==="script"?(e=a.createElement("div"),e.innerHTML="<script><\/script>",e=e.removeChild(e.firstChild)):typeof n.is=="string"?e=a.createElement(r,{is:n.is}):(e=a.createElement(r),r==="select"&&(a=e,n.multiple?a.multiple=!0:n.size&&(a.size=n.size))):e=a.createElementNS(e,r),e[er]=t,e[jo]=n,Bu(e,t,!1,!1),t.stateNode=e;e:{switch(a=bn(r,n),r){case"dialog":$e("cancel",e),$e("close",e),o=n;break;case"iframe":case"object":case"embed":$e("load",e),o=n;break;case"video":case"audio":for(o=0;o<bo.length;o++)$e(bo[o],e);o=n;break;case"source":$e("error",e),o=n;break;case"img":case"image":case"link":$e("error",e),$e("load",e),o=n;break;case"details":$e("toggle",e),o=n;break;case"input":vr(e,n),o=or(e,n),$e("invalid",e);break;case"option":o=n;break;case"select":e._wrapperState={wasMultiple:!!n.multiple},o=D({},n,{value:void 0}),$e("invalid",e);break;case"textarea":At(e,n),o=io(e,n),$e("invalid",e);break;default:o=n}Xt(r,o),d=o;for(l in d)if(d.hasOwnProperty(l)){var p=d[l];l==="style"?wn(e,p):l==="dangerouslySetInnerHTML"?(p=p?p.__html:void 0,p!=null&&xn(e,p)):l==="children"?typeof p=="string"?(r!=="textarea"||p!=="")&&br(e,p):typeof p=="number"&&br(e,""+p):l!=="suppressContentEditableWarning"&&l!=="suppressHydrationWarning"&&l!=="autoFocus"&&(w.hasOwnProperty(l)?p!=null&&l==="onScroll"&&$e("scroll",e):p!=null&&Ne(e,l,p,a))}switch(r){case"input":$t(e),oo(e,n,!1);break;case"textarea":$t(e),wr(e);break;case"option":n.value!=null&&e.setAttribute("value",""+Te(n.value));break;case"select":e.multiple=!!n.multiple,l=n.value,l!=null?yr(e,!!n.multiple,l,!1):n.defaultValue!=null&&yr(e,!!n.multiple,n.defaultValue,!0);break;default:typeof o.onClick=="function"&&(e.onclick=ci)}switch(r){case"button":case"input":case"select":case"textarea":n=!!n.autoFocus;break e;case"img":n=!0;break e;default:n=!1}}n&&(t.flags|=4)}t.ref!==null&&(t.flags|=512,t.flags|=2097152)}return ut(t),null;case 6:if(e&&t.stateNode!=null)Wu(e,t,e.memoizedProps,n);else{if(typeof n!="string"&&t.stateNode===null)throw Error(u(166));if(r=sn(_o.current),sn(tr.current),vi(t)){if(n=t.stateNode,r=t.memoizedProps,n[er]=t,(l=n.nodeValue!==r)&&(e=St,e!==null))switch(e.tag){case 3:ui(n.nodeValue,r,(e.mode&1)!==0);break;case 5:e.memoizedProps.suppressHydrationWarning!==!0&&ui(n.nodeValue,r,(e.mode&1)!==0)}l&&(t.flags|=4)}else n=(r.nodeType===9?r:r.ownerDocument).createTextNode(n),n[er]=t,t.stateNode=n}return ut(t),null;case 13:if(Ae(Qe),n=t.memoizedState,e===null||e.memoizedState!==null&&e.memoizedState.dehydrated!==null){if(We&&Nt!==null&&(t.mode&1)!==0&&(t.flags&128)===0)Vs(),Qn(),t.flags|=98560,l=!1;else if(l=vi(t),n!==null&&n.dehydrated!==null){if(e===null){if(!l)throw Error(u(318));if(l=t.memoizedState,l=l!==null?l.dehydrated:null,!l)throw Error(u(317));l[er]=t}else Qn(),(t.flags&128)===0&&(t.memoizedState=null),t.flags|=4;ut(t),l=!1}else Ht!==null&&(Pa(Ht),Ht=null),l=!0;if(!l)return t.flags&65536?t:null}return(t.flags&128)!==0?(t.lanes=r,t):(n=n!==null,n!==(e!==null&&e.memoizedState!==null)&&n&&(t.child.flags|=8192,(t.mode&1)!==0&&(e===null||(Qe.current&1)!==0?Je===0&&(Je=3):Ra())),t.updateQueue!==null&&(t.flags|=4),ut(t),null);case 4:return Gn(),ya(e,t),e===null&&zo(t.stateNode.containerInfo),ut(t),null;case 10:return Yl(t.type._context),ut(t),null;case 17:return vt(t.type)&&pi(),ut(t),null;case 19:if(Ae(Qe),l=t.memoizedState,l===null)return ut(t),null;if(n=(t.flags&128)!==0,a=l.rendering,a===null)if(n)Mo(l,!1);else{if(Je!==0||e!==null&&(e.flags&128)!==0)for(e=t.child;e!==null;){if(a=ki(e),a!==null){for(t.flags|=128,Mo(l,!1),n=a.updateQueue,n!==null&&(t.updateQueue=n,t.flags|=4),t.subtreeFlags=0,n=r,r=t.child;r!==null;)l=r,e=n,l.flags&=14680066,a=l.alternate,a===null?(l.childLanes=0,l.lanes=e,l.child=null,l.subtreeFlags=0,l.memoizedProps=null,l.memoizedState=null,l.updateQueue=null,l.dependencies=null,l.stateNode=null):(l.childLanes=a.childLanes,l.lanes=a.lanes,l.child=a.child,l.subtreeFlags=0,l.deletions=null,l.memoizedProps=a.memoizedProps,l.memoizedState=a.memoizedState,l.updateQueue=a.updateQueue,l.type=a.type,e=a.dependencies,l.dependencies=e===null?null:{lanes:e.lanes,firstContext:e.firstContext}),r=r.sibling;return Oe(Qe,Qe.current&1|2),t.child}e=e.sibling}l.tail!==null&&Ue()>Jn&&(t.flags|=128,n=!0,Mo(l,!1),t.lanes=4194304)}else{if(!n)if(e=ki(a),e!==null){if(t.flags|=128,n=!0,r=e.updateQueue,r!==null&&(t.updateQueue=r,t.flags|=4),Mo(l,!0),l.tail===null&&l.tailMode==="hidden"&&!a.alternate&&!We)return ut(t),null}else 2*Ue()-l.renderingStartTime>Jn&&r!==1073741824&&(t.flags|=128,n=!0,Mo(l,!1),t.lanes=4194304);l.isBackwards?(a.sibling=t.child,t.child=a):(r=l.last,r!==null?r.sibling=a:t.child=a,l.last=a)}return l.tail!==null?(t=l.tail,l.rendering=t,l.tail=t.sibling,l.renderingStartTime=Ue(),t.sibling=null,r=Qe.current,Oe(Qe,n?r&1|2:r&1),t):(ut(t),null);case 22:case 23:return La(),n=t.memoizedState!==null,e!==null&&e.memoizedState!==null!==n&&(t.flags|=8192),n&&(t.mode&1)!==0?(Ct&1073741824)!==0&&(ut(t),t.subtreeFlags&6&&(t.flags|=8192)):ut(t),null;case 24:return null;case 25:return null}throw Error(u(156,t.tag))}function ap(e,t){switch(Bl(t),t.tag){case 1:return vt(t.type)&&pi(),e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 3:return Gn(),Ae(gt),Ae(at),ea(),e=t.flags,(e&65536)!==0&&(e&128)===0?(t.flags=e&-65537|128,t):null;case 5:return Zl(t),null;case 13:if(Ae(Qe),e=t.memoizedState,e!==null&&e.dehydrated!==null){if(t.alternate===null)throw Error(u(340));Qn()}return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 19:return Ae(Qe),null;case 4:return Gn(),null;case 10:return Yl(t.type._context),null;case 22:case 23:return La(),null;case 24:return null;default:return null}}var Li=!1,ct=!1,sp=typeof WeakSet=="function"?WeakSet:Set,V=null;function Xn(e,t){var r=e.ref;if(r!==null)if(typeof r=="function")try{r(null)}catch(n){Ke(e,t,n)}else r.current=null}function wa(e,t,r){try{r()}catch(n){Ke(e,t,n)}}var Hu=!1;function up(e,t){if(Ll=Zo,e=zs(),jl(e)){if("selectionStart"in e)var r={start:e.selectionStart,end:e.selectionEnd};else e:{r=(r=e.ownerDocument)&&r.defaultView||window;var n=r.getSelection&&r.getSelection();if(n&&n.rangeCount!==0){r=n.anchorNode;var o=n.anchorOffset,l=n.focusNode;n=n.focusOffset;try{r.nodeType,l.nodeType}catch{r=null;break e}var a=0,d=-1,p=-1,y=0,C=0,E=e,N=null;t:for(;;){for(var U;E!==r||o!==0&&E.nodeType!==3||(d=a+o),E!==l||n!==0&&E.nodeType!==3||(p=a+n),E.nodeType===3&&(a+=E.nodeValue.length),(U=E.firstChild)!==null;)N=E,E=U;for(;;){if(E===e)break t;if(N===r&&++y===o&&(d=a),N===l&&++C===n&&(p=a),(U=E.nextSibling)!==null)break;E=N,N=E.parentNode}E=U}r=d===-1||p===-1?null:{start:d,end:p}}else r=null}r=r||{start:0,end:0}}else r=null;for(Rl={focusedElem:e,selectionRange:r},Zo=!1,V=t;V!==null;)if(t=V,e=t.child,(t.subtreeFlags&1028)!==0&&e!==null)e.return=t,V=e;else for(;V!==null;){t=V;try{var K=t.alternate;if((t.flags&1024)!==0)switch(t.tag){case 0:case 11:case 15:break;case 1:if(K!==null){var G=K.memoizedProps,Ge=K.memoizedState,g=t.stateNode,m=g.getSnapshotBeforeUpdate(t.elementType===t.type?G:Qt(t.type,G),Ge);g.__reactInternalSnapshotBeforeUpdate=m}break;case 3:var x=t.stateNode.containerInfo;x.nodeType===1?x.textContent="":x.nodeType===9&&x.documentElement&&x.removeChild(x.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(u(163))}}catch(R){Ke(t,t.return,R)}if(e=t.sibling,e!==null){e.return=t.return,V=e;break}V=t.return}return K=Hu,Hu=!1,K}function Io(e,t,r){var n=t.updateQueue;if(n=n!==null?n.lastEffect:null,n!==null){var o=n=n.next;do{if((o.tag&e)===e){var l=o.destroy;o.destroy=void 0,l!==void 0&&wa(t,r,l)}o=o.next}while(o!==n)}}function Ri(e,t){if(t=t.updateQueue,t=t!==null?t.lastEffect:null,t!==null){var r=t=t.next;do{if((r.tag&e)===e){var n=r.create;r.destroy=n()}r=r.next}while(r!==t)}}function ba(e){var t=e.ref;if(t!==null){var r=e.stateNode;switch(e.tag){case 5:e=r;break;default:e=r}typeof t=="function"?t(e):t.current=e}}function Qu(e){var t=e.alternate;t!==null&&(e.alternate=null,Qu(t)),e.child=null,e.deletions=null,e.sibling=null,e.tag===5&&(t=e.stateNode,t!==null&&(delete t[er],delete t[jo],delete t[Fl],delete t[Qd],delete t[Vd])),e.stateNode=null,e.return=null,e.dependencies=null,e.memoizedProps=null,e.memoizedState=null,e.pendingProps=null,e.stateNode=null,e.updateQueue=null}function Vu(e){return e.tag===5||e.tag===3||e.tag===4}function Yu(e){e:for(;;){for(;e.sibling===null;){if(e.return===null||Vu(e.return))return null;e=e.return}for(e.sibling.return=e.return,e=e.sibling;e.tag!==5&&e.tag!==6&&e.tag!==18;){if(e.flags&2||e.child===null||e.tag===4)continue e;e.child.return=e,e=e.child}if(!(e.flags&2))return e.stateNode}}function za(e,t,r){var n=e.tag;if(n===5||n===6)e=e.stateNode,t?r.nodeType===8?r.parentNode.insertBefore(e,t):r.insertBefore(e,t):(r.nodeType===8?(t=r.parentNode,t.insertBefore(e,r)):(t=r,t.appendChild(e)),r=r._reactRootContainer,r!=null||t.onclick!==null||(t.onclick=ci));else if(n!==4&&(e=e.child,e!==null))for(za(e,t,r),e=e.sibling;e!==null;)za(e,t,r),e=e.sibling}function ka(e,t,r){var n=e.tag;if(n===5||n===6)e=e.stateNode,t?r.insertBefore(e,t):r.appendChild(e);else if(n!==4&&(e=e.child,e!==null))for(ka(e,t,r),e=e.sibling;e!==null;)ka(e,t,r),e=e.sibling}var ot=null,Vt=!1;function Or(e,t,r){for(r=r.child;r!==null;)Ku(e,t,r),r=r.sibling}function Ku(e,t,r){if(Tt&&typeof Tt.onCommitFiberUnmount=="function")try{Tt.onCommitFiberUnmount(Jr,r)}catch{}switch(r.tag){case 5:ct||Xn(r,t);case 6:var n=ot,o=Vt;ot=null,Or(e,t,r),ot=n,Vt=o,ot!==null&&(Vt?(e=ot,r=r.stateNode,e.nodeType===8?e.parentNode.removeChild(r):e.removeChild(r)):ot.removeChild(r.stateNode));break;case 18:ot!==null&&(Vt?(e=ot,r=r.stateNode,e.nodeType===8?Ol(e.parentNode,r):e.nodeType===1&&Ol(e,r),fo(e)):Ol(ot,r.stateNode));break;case 4:n=ot,o=Vt,ot=r.stateNode.containerInfo,Vt=!0,Or(e,t,r),ot=n,Vt=o;break;case 0:case 11:case 14:case 15:if(!ct&&(n=r.updateQueue,n!==null&&(n=n.lastEffect,n!==null))){o=n=n.next;do{var l=o,a=l.destroy;l=l.tag,a!==void 0&&((l&2)!==0||(l&4)!==0)&&wa(r,t,a),o=o.next}while(o!==n)}Or(e,t,r);break;case 1:if(!ct&&(Xn(r,t),n=r.stateNode,typeof n.componentWillUnmount=="function"))try{n.props=r.memoizedProps,n.state=r.memoizedState,n.componentWillUnmount()}catch(d){Ke(r,t,d)}Or(e,t,r);break;case 21:Or(e,t,r);break;case 22:r.mode&1?(ct=(n=ct)||r.memoizedState!==null,Or(e,t,r),ct=n):Or(e,t,r);break;default:Or(e,t,r)}}function Gu(e){var t=e.updateQueue;if(t!==null){e.updateQueue=null;var r=e.stateNode;r===null&&(r=e.stateNode=new sp),t.forEach(function(n){var o=xp.bind(null,e,n);r.has(n)||(r.add(n),n.then(o,o))})}}function Yt(e,t){var r=t.deletions;if(r!==null)for(var n=0;n<r.length;n++){var o=r[n];try{var l=e,a=t,d=a;e:for(;d!==null;){switch(d.tag){case 5:ot=d.stateNode,Vt=!1;break e;case 3:ot=d.stateNode.containerInfo,Vt=!0;break e;case 4:ot=d.stateNode.containerInfo,Vt=!0;break e}d=d.return}if(ot===null)throw Error(u(160));Ku(l,a,o),ot=null,Vt=!1;var p=o.alternate;p!==null&&(p.return=null),o.return=null}catch(y){Ke(o,t,y)}}if(t.subtreeFlags&12854)for(t=t.child;t!==null;)qu(t,e),t=t.sibling}function qu(e,t){var r=e.alternate,n=e.flags;switch(e.tag){case 0:case 11:case 14:case 15:if(Yt(t,e),nr(e),n&4){try{Io(3,e,e.return),Ri(3,e)}catch(G){Ke(e,e.return,G)}try{Io(5,e,e.return)}catch(G){Ke(e,e.return,G)}}break;case 1:Yt(t,e),nr(e),n&512&&r!==null&&Xn(r,r.return);break;case 5:if(Yt(t,e),nr(e),n&512&&r!==null&&Xn(r,r.return),e.flags&32){var o=e.stateNode;try{br(o,"")}catch(G){Ke(e,e.return,G)}}if(n&4&&(o=e.stateNode,o!=null)){var l=e.memoizedProps,a=r!==null?r.memoizedProps:l,d=e.type,p=e.updateQueue;if(e.updateQueue=null,p!==null)try{d==="input"&&l.type==="radio"&&l.name!=null&&Hr(o,l),bn(d,a);var y=bn(d,l);for(a=0;a<p.length;a+=2){var C=p[a],E=p[a+1];C==="style"?wn(o,E):C==="dangerouslySetInnerHTML"?xn(o,E):C==="children"?br(o,E):Ne(o,C,E,y)}switch(d){case"input":gn(o,l);break;case"textarea":lo(o,l);break;case"select":var N=o._wrapperState.wasMultiple;o._wrapperState.wasMultiple=!!l.multiple;var U=l.value;U!=null?yr(o,!!l.multiple,U,!1):N!==!!l.multiple&&(l.defaultValue!=null?yr(o,!!l.multiple,l.defaultValue,!0):yr(o,!!l.multiple,l.multiple?[]:"",!1))}o[jo]=l}catch(G){Ke(e,e.return,G)}}break;case 6:if(Yt(t,e),nr(e),n&4){if(e.stateNode===null)throw Error(u(162));o=e.stateNode,l=e.memoizedProps;try{o.nodeValue=l}catch(G){Ke(e,e.return,G)}}break;case 3:if(Yt(t,e),nr(e),n&4&&r!==null&&r.memoizedState.isDehydrated)try{fo(t.containerInfo)}catch(G){Ke(e,e.return,G)}break;case 4:Yt(t,e),nr(e);break;case 13:Yt(t,e),nr(e),o=e.child,o.flags&8192&&(l=o.memoizedState!==null,o.stateNode.isHidden=l,!l||o.alternate!==null&&o.alternate.memoizedState!==null||(Na=Ue())),n&4&&Gu(e);break;case 22:if(C=r!==null&&r.memoizedState!==null,e.mode&1?(ct=(y=ct)||C,Yt(t,e),ct=y):Yt(t,e),nr(e),n&8192){if(y=e.memoizedState!==null,(e.stateNode.isHidden=y)&&!C&&(e.mode&1)!==0)for(V=e,C=e.child;C!==null;){for(E=V=C;V!==null;){switch(N=V,U=N.child,N.tag){case 0:case 11:case 14:case 15:Io(4,N,N.return);break;case 1:Xn(N,N.return);var K=N.stateNode;if(typeof K.componentWillUnmount=="function"){n=N,r=N.return;try{t=n,K.props=t.memoizedProps,K.state=t.memoizedState,K.componentWillUnmount()}catch(G){Ke(n,r,G)}}break;case 5:Xn(N,N.return);break;case 22:if(N.memoizedState!==null){Ju(E);continue}}U!==null?(U.return=N,V=U):Ju(E)}C=C.sibling}e:for(C=null,E=e;;){if(E.tag===5){if(C===null){C=E;try{o=E.stateNode,y?(l=o.style,typeof l.setProperty=="function"?l.setProperty("display","none","important"):l.display="none"):(d=E.stateNode,p=E.memoizedProps.style,a=p!=null&&p.hasOwnProperty("display")?p.display:null,d.style.display=yn("display",a))}catch(G){Ke(e,e.return,G)}}}else if(E.tag===6){if(C===null)try{E.stateNode.nodeValue=y?"":E.memoizedProps}catch(G){Ke(e,e.return,G)}}else if((E.tag!==22&&E.tag!==23||E.memoizedState===null||E===e)&&E.child!==null){E.child.return=E,E=E.child;continue}if(E===e)break e;for(;E.sibling===null;){if(E.return===null||E.return===e)break e;C===E&&(C=null),E=E.return}C===E&&(C=null),E.sibling.return=E.return,E=E.sibling}}break;case 19:Yt(t,e),nr(e),n&4&&Gu(e);break;case 21:break;default:Yt(t,e),nr(e)}}function nr(e){var t=e.flags;if(t&2){try{e:{for(var r=e.return;r!==null;){if(Vu(r)){var n=r;break e}r=r.return}throw Error(u(160))}switch(n.tag){case 5:var o=n.stateNode;n.flags&32&&(br(o,""),n.flags&=-33);var l=Yu(e);ka(e,l,o);break;case 3:case 4:var a=n.stateNode.containerInfo,d=Yu(e);za(e,d,a);break;default:throw Error(u(161))}}catch(p){Ke(e,e.return,p)}e.flags&=-3}t&4096&&(e.flags&=-4097)}function cp(e,t,r){V=e,Xu(e)}function Xu(e,t,r){for(var n=(e.mode&1)!==0;V!==null;){var o=V,l=o.child;if(o.tag===22&&n){var a=o.memoizedState!==null||Li;if(!a){var d=o.alternate,p=d!==null&&d.memoizedState!==null||ct;d=Li;var y=ct;if(Li=a,(ct=p)&&!y)for(V=o;V!==null;)a=V,p=a.child,a.tag===22&&a.memoizedState!==null?ec(o):p!==null?(p.return=a,V=p):ec(o);for(;l!==null;)V=l,Xu(l),l=l.sibling;V=o,Li=d,ct=y}Zu(e)}else(o.subtreeFlags&8772)!==0&&l!==null?(l.return=o,V=l):Zu(e)}}function Zu(e){for(;V!==null;){var t=V;if((t.flags&8772)!==0){var r=t.alternate;try{if((t.flags&8772)!==0)switch(t.tag){case 0:case 11:case 15:ct||Ri(5,t);break;case 1:var n=t.stateNode;if(t.flags&4&&!ct)if(r===null)n.componentDidMount();else{var o=t.elementType===t.type?r.memoizedProps:Qt(t.type,r.memoizedProps);n.componentDidUpdate(o,r.memoizedState,n.__reactInternalSnapshotBeforeUpdate)}var l=t.updateQueue;l!==null&&Js(t,l,n);break;case 3:var a=t.updateQueue;if(a!==null){if(r=null,t.child!==null)switch(t.child.tag){case 5:r=t.child.stateNode;break;case 1:r=t.child.stateNode}Js(t,a,r)}break;case 5:var d=t.stateNode;if(r===null&&t.flags&4){r=d;var p=t.memoizedProps;switch(t.type){case"button":case"input":case"select":case"textarea":p.autoFocus&&r.focus();break;case"img":p.src&&(r.src=p.src)}}break;case 6:break;case 4:break;case 12:break;case 13:if(t.memoizedState===null){var y=t.alternate;if(y!==null){var C=y.memoizedState;if(C!==null){var E=C.dehydrated;E!==null&&fo(E)}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;default:throw Error(u(163))}ct||t.flags&512&&ba(t)}catch(N){Ke(t,t.return,N)}}if(t===e){V=null;break}if(r=t.sibling,r!==null){r.return=t.return,V=r;break}V=t.return}}function Ju(e){for(;V!==null;){var t=V;if(t===e){V=null;break}var r=t.sibling;if(r!==null){r.return=t.return,V=r;break}V=t.return}}function ec(e){for(;V!==null;){var t=V;try{switch(t.tag){case 0:case 11:case 15:var r=t.return;try{Ri(4,t)}catch(p){Ke(t,r,p)}break;case 1:var n=t.stateNode;if(typeof n.componentDidMount=="function"){var o=t.return;try{n.componentDidMount()}catch(p){Ke(t,o,p)}}var l=t.return;try{ba(t)}catch(p){Ke(t,l,p)}break;case 5:var a=t.return;try{ba(t)}catch(p){Ke(t,a,p)}}}catch(p){Ke(t,t.return,p)}if(t===e){V=null;break}var d=t.sibling;if(d!==null){d.return=t.return,V=d;break}V=t.return}}var dp=Math.ceil,Mi=he.ReactCurrentDispatcher,ja=he.ReactCurrentOwner,Ft=he.ReactCurrentBatchConfig,Ee=0,tt=null,qe=null,it=0,Ct=0,Zn=Tr(0),Je=0,Oo=null,cn=0,Ii=0,Sa=0,Fo=null,yt=null,Na=0,Jn=1/0,gr=null,Oi=!1,Ca=null,Fr=null,Fi=!1,Dr=null,Di=0,Do=0,Ea=null,$i=-1,Ai=0;function pt(){return(Ee&6)!==0?Ue():$i!==-1?$i:$i=Ue()}function $r(e){return(e.mode&1)===0?1:(Ee&2)!==0&&it!==0?it&-it:Kd.transition!==null?(Ai===0&&(Ai=co()),Ai):(e=b,e!==0||(e=window.event,e=e===void 0?16:rs(e.type)),e)}function Kt(e,t,r,n){if(50<Do)throw Do=0,Ea=null,Error(u(185));Cr(e,r,n),((Ee&2)===0||e!==tt)&&(e===tt&&((Ee&2)===0&&(Ii|=r),Je===4&&Ar(e,it)),wt(e,n),r===1&&Ee===0&&(t.mode&1)===0&&(Jn=Ue()+500,mi&&Rr()))}function wt(e,t){var r=e.callbackNode;Ko(e,t);var n=tn(e,e===tt?it:0);if(n===0)r!==null&&Zr(r),e.callbackNode=null,e.callbackPriority=0;else if(t=n&-n,e.callbackPriority!==t){if(r!=null&&Zr(r),t===1)e.tag===0?Yd(rc.bind(null,e)):Bs(rc.bind(null,e)),Wd(function(){(Ee&6)===0&&Rr()}),r=null;else{switch(P(n)){case 1:r=sr;break;case 4:r=Vo;break;case 16:r=En;break;case 536870912:r=_n;break;default:r=En}r=cc(r,tc.bind(null,e))}e.callbackPriority=t,e.callbackNode=r}}function tc(e,t){if($i=-1,Ai=0,(Ee&6)!==0)throw Error(u(327));var r=e.callbackNode;if(eo()&&e.callbackNode!==r)return null;var n=tn(e,e===tt?it:0);if(n===0)return null;if((n&30)!==0||(n&e.expiredLanes)!==0||t)t=Bi(e,n);else{t=n;var o=Ee;Ee|=2;var l=oc();(tt!==e||it!==t)&&(gr=null,Jn=Ue()+500,pn(e,t));do try{mp();break}catch(d){nc(e,d)}while(!0);Vl(),Mi.current=l,Ee=o,qe!==null?t=0:(tt=null,it=0,t=Je)}if(t!==0){if(t===2&&(o=Tn(e),o!==0&&(n=o,t=_a(e,o))),t===1)throw r=Oo,pn(e,0),Ar(e,n),wt(e,Ue()),r;if(t===6)Ar(e,n);else{if(o=e.current.alternate,(n&30)===0&&!pp(o)&&(t=Bi(e,n),t===2&&(l=Tn(e),l!==0&&(n=l,t=_a(e,l))),t===1))throw r=Oo,pn(e,0),Ar(e,n),wt(e,Ue()),r;switch(e.finishedWork=o,e.finishedLanes=n,t){case 0:case 1:throw Error(u(345));case 2:fn(e,yt,gr);break;case 3:if(Ar(e,n),(n&130023424)===n&&(t=Na+500-Ue(),10<t)){if(tn(e,0)!==0)break;if(o=e.suspendedLanes,(o&n)!==n){pt(),e.pingedLanes|=e.suspendedLanes&o;break}e.timeoutHandle=Il(fn.bind(null,e,yt,gr),t);break}fn(e,yt,gr);break;case 4:if(Ar(e,n),(n&4194240)===n)break;for(t=e.eventTimes,o=-1;0<n;){var a=31-kt(n);l=1<<a,a=t[a],a>o&&(o=a),n&=~l}if(n=o,n=Ue()-n,n=(120>n?120:480>n?480:1080>n?1080:1920>n?1920:3e3>n?3e3:4320>n?4320:1960*dp(n/1960))-n,10<n){e.timeoutHandle=Il(fn.bind(null,e,yt,gr),n);break}fn(e,yt,gr);break;case 5:fn(e,yt,gr);break;default:throw Error(u(329))}}}return wt(e,Ue()),e.callbackNode===r?tc.bind(null,e):null}function _a(e,t){var r=Fo;return e.current.memoizedState.isDehydrated&&(pn(e,t).flags|=256),e=Bi(e,t),e!==2&&(t=yt,yt=r,t!==null&&Pa(t)),e}function Pa(e){yt===null?yt=e:yt.push.apply(yt,e)}function pp(e){for(var t=e;;){if(t.flags&16384){var r=t.updateQueue;if(r!==null&&(r=r.stores,r!==null))for(var n=0;n<r.length;n++){var o=r[n],l=o.getSnapshot;o=o.value;try{if(!Wt(l(),o))return!1}catch{return!1}}}if(r=t.child,t.subtreeFlags&16384&&r!==null)r.return=t,t=r;else{if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return!0;t=t.return}t.sibling.return=t.return,t=t.sibling}}return!0}function Ar(e,t){for(t&=~Sa,t&=~Ii,e.suspendedLanes|=t,e.pingedLanes&=~t,e=e.expirationTimes;0<t;){var r=31-kt(t),n=1<<r;e[r]=-1,t&=~n}}function rc(e){if((Ee&6)!==0)throw Error(u(327));eo();var t=tn(e,0);if((t&1)===0)return wt(e,Ue()),null;var r=Bi(e,t);if(e.tag!==0&&r===2){var n=Tn(e);n!==0&&(t=n,r=_a(e,n))}if(r===1)throw r=Oo,pn(e,0),Ar(e,t),wt(e,Ue()),r;if(r===6)throw Error(u(345));return e.finishedWork=e.current.alternate,e.finishedLanes=t,fn(e,yt,gr),wt(e,Ue()),null}function Ta(e,t){var r=Ee;Ee|=1;try{return e(t)}finally{Ee=r,Ee===0&&(Jn=Ue()+500,mi&&Rr())}}function dn(e){Dr!==null&&Dr.tag===0&&(Ee&6)===0&&eo();var t=Ee;Ee|=1;var r=Ft.transition,n=b;try{if(Ft.transition=null,b=1,e)return e()}finally{b=n,Ft.transition=r,Ee=t,(Ee&6)===0&&Rr()}}function La(){Ct=Zn.current,Ae(Zn)}function pn(e,t){e.finishedWork=null,e.finishedLanes=0;var r=e.timeoutHandle;if(r!==-1&&(e.timeoutHandle=-1,Ud(r)),qe!==null)for(r=qe.return;r!==null;){var n=r;switch(Bl(n),n.tag){case 1:n=n.type.childContextTypes,n!=null&&pi();break;case 3:Gn(),Ae(gt),Ae(at),ea();break;case 5:Zl(n);break;case 4:Gn();break;case 13:Ae(Qe);break;case 19:Ae(Qe);break;case 10:Yl(n.type._context);break;case 22:case 23:La()}r=r.return}if(tt=e,qe=e=Br(e.current,null),it=Ct=t,Je=0,Oo=null,Sa=Ii=cn=0,yt=Fo=null,an!==null){for(t=0;t<an.length;t++)if(r=an[t],n=r.interleaved,n!==null){r.interleaved=null;var o=n.next,l=r.pending;if(l!==null){var a=l.next;l.next=o,n.next=a}r.pending=n}an=null}return e}function nc(e,t){do{var r=qe;try{if(Vl(),ji.current=Ei,Si){for(var n=Ve.memoizedState;n!==null;){var o=n.queue;o!==null&&(o.pending=null),n=n.next}Si=!1}if(un=0,et=Ze=Ve=null,Po=!1,To=0,ja.current=null,r===null||r.return===null){Je=1,Oo=t,qe=null;break}e:{var l=e,a=r.return,d=r,p=t;if(t=it,d.flags|=32768,p!==null&&typeof p=="object"&&typeof p.then=="function"){var y=p,C=d,E=C.tag;if((C.mode&1)===0&&(E===0||E===11||E===15)){var N=C.alternate;N?(C.updateQueue=N.updateQueue,C.memoizedState=N.memoizedState,C.lanes=N.lanes):(C.updateQueue=null,C.memoizedState=null)}var U=Eu(a);if(U!==null){U.flags&=-257,_u(U,a,d,l,t),U.mode&1&&Cu(l,y,t),t=U,p=y;var K=t.updateQueue;if(K===null){var G=new Set;G.add(p),t.updateQueue=G}else K.add(p);break e}else{if((t&1)===0){Cu(l,y,t),Ra();break e}p=Error(u(426))}}else if(We&&d.mode&1){var Ge=Eu(a);if(Ge!==null){(Ge.flags&65536)===0&&(Ge.flags|=256),_u(Ge,a,d,l,t),Hl(qn(p,d));break e}}l=p=qn(p,d),Je!==4&&(Je=2),Fo===null?Fo=[l]:Fo.push(l),l=a;do{switch(l.tag){case 3:l.flags|=65536,t&=-t,l.lanes|=t;var g=Su(l,p,t);Zs(l,g);break e;case 1:d=p;var m=l.type,x=l.stateNode;if((l.flags&128)===0&&(typeof m.getDerivedStateFromError=="function"||x!==null&&typeof x.componentDidCatch=="function"&&(Fr===null||!Fr.has(x)))){l.flags|=65536,t&=-t,l.lanes|=t;var R=Nu(l,d,t);Zs(l,R);break e}}l=l.return}while(l!==null)}lc(r)}catch(X){t=X,qe===r&&r!==null&&(qe=r=r.return);continue}break}while(!0)}function oc(){var e=Mi.current;return Mi.current=Ei,e===null?Ei:e}function Ra(){(Je===0||Je===3||Je===2)&&(Je=4),tt===null||(cn&268435455)===0&&(Ii&268435455)===0||Ar(tt,it)}function Bi(e,t){var r=Ee;Ee|=2;var n=oc();(tt!==e||it!==t)&&(gr=null,pn(e,t));do try{fp();break}catch(o){nc(e,o)}while(!0);if(Vl(),Ee=r,Mi.current=n,qe!==null)throw Error(u(261));return tt=null,it=0,Je}function fp(){for(;qe!==null;)ic(qe)}function mp(){for(;qe!==null&&!uo();)ic(qe)}function ic(e){var t=uc(e.alternate,e,Ct);e.memoizedProps=e.pendingProps,t===null?lc(e):qe=t,ja.current=null}function lc(e){var t=e;do{var r=t.alternate;if(e=t.return,(t.flags&32768)===0){if(r=lp(r,t,Ct),r!==null){qe=r;return}}else{if(r=ap(r,t),r!==null){r.flags&=32767,qe=r;return}if(e!==null)e.flags|=32768,e.subtreeFlags=0,e.deletions=null;else{Je=6,qe=null;return}}if(t=t.sibling,t!==null){qe=t;return}qe=t=e}while(t!==null);Je===0&&(Je=5)}function fn(e,t,r){var n=b,o=Ft.transition;try{Ft.transition=null,b=1,hp(e,t,r,n)}finally{Ft.transition=o,b=n}return null}function hp(e,t,r,n){do eo();while(Dr!==null);if((Ee&6)!==0)throw Error(u(327));r=e.finishedWork;var o=e.finishedLanes;if(r===null)return null;if(e.finishedWork=null,e.finishedLanes=0,r===e.current)throw Error(u(177));e.callbackNode=null,e.callbackPriority=0;var l=r.lanes|r.childLanes;if(c(e,l),e===tt&&(qe=tt=null,it=0),(r.subtreeFlags&2064)===0&&(r.flags&2064)===0||Fi||(Fi=!0,cc(En,function(){return eo(),null})),l=(r.flags&15990)!==0,(r.subtreeFlags&15990)!==0||l){l=Ft.transition,Ft.transition=null;var a=b;b=1;var d=Ee;Ee|=4,ja.current=null,up(e,r),qu(r,e),Id(Rl),Zo=!!Ll,Rl=Ll=null,e.current=r,cp(r),Qo(),Ee=d,b=a,Ft.transition=l}else e.current=r;if(Fi&&(Fi=!1,Dr=e,Di=o),l=e.pendingLanes,l===0&&(Fr=null),ul(r.stateNode),wt(e,Ue()),t!==null)for(n=e.onRecoverableError,r=0;r<t.length;r++)o=t[r],n(o.value,{componentStack:o.stack,digest:o.digest});if(Oi)throw Oi=!1,e=Ca,Ca=null,e;return(Di&1)!==0&&e.tag!==0&&eo(),l=e.pendingLanes,(l&1)!==0?e===Ea?Do++:(Do=0,Ea=e):Do=0,Rr(),null}function eo(){if(Dr!==null){var e=P(Di),t=Ft.transition,r=b;try{if(Ft.transition=null,b=16>e?16:e,Dr===null)var n=!1;else{if(e=Dr,Dr=null,Di=0,(Ee&6)!==0)throw Error(u(331));var o=Ee;for(Ee|=4,V=e.current;V!==null;){var l=V,a=l.child;if((V.flags&16)!==0){var d=l.deletions;if(d!==null){for(var p=0;p<d.length;p++){var y=d[p];for(V=y;V!==null;){var C=V;switch(C.tag){case 0:case 11:case 15:Io(8,C,l)}var E=C.child;if(E!==null)E.return=C,V=E;else for(;V!==null;){C=V;var N=C.sibling,U=C.return;if(Qu(C),C===y){V=null;break}if(N!==null){N.return=U,V=N;break}V=U}}}var K=l.alternate;if(K!==null){var G=K.child;if(G!==null){K.child=null;do{var Ge=G.sibling;G.sibling=null,G=Ge}while(G!==null)}}V=l}}if((l.subtreeFlags&2064)!==0&&a!==null)a.return=l,V=a;else e:for(;V!==null;){if(l=V,(l.flags&2048)!==0)switch(l.tag){case 0:case 11:case 15:Io(9,l,l.return)}var g=l.sibling;if(g!==null){g.return=l.return,V=g;break e}V=l.return}}var m=e.current;for(V=m;V!==null;){a=V;var x=a.child;if((a.subtreeFlags&2064)!==0&&x!==null)x.return=a,V=x;else e:for(a=m;V!==null;){if(d=V,(d.flags&2048)!==0)try{switch(d.tag){case 0:case 11:case 15:Ri(9,d)}}catch(X){Ke(d,d.return,X)}if(d===a){V=null;break e}var R=d.sibling;if(R!==null){R.return=d.return,V=R;break e}V=d.return}}if(Ee=o,Rr(),Tt&&typeof Tt.onPostCommitFiberRoot=="function")try{Tt.onPostCommitFiberRoot(Jr,e)}catch{}n=!0}return n}finally{b=r,Ft.transition=t}}return!1}function ac(e,t,r){t=qn(r,t),t=Su(e,t,1),e=Ir(e,t,1),t=pt(),e!==null&&(Cr(e,1,t),wt(e,t))}function Ke(e,t,r){if(e.tag===3)ac(e,e,r);else for(;t!==null;){if(t.tag===3){ac(t,e,r);break}else if(t.tag===1){var n=t.stateNode;if(typeof t.type.getDerivedStateFromError=="function"||typeof n.componentDidCatch=="function"&&(Fr===null||!Fr.has(n))){e=qn(r,e),e=Nu(t,e,1),t=Ir(t,e,1),e=pt(),t!==null&&(Cr(t,1,e),wt(t,e));break}}t=t.return}}function gp(e,t,r){var n=e.pingCache;n!==null&&n.delete(t),t=pt(),e.pingedLanes|=e.suspendedLanes&r,tt===e&&(it&r)===r&&(Je===4||Je===3&&(it&130023424)===it&&500>Ue()-Na?pn(e,0):Sa|=r),wt(e,t)}function sc(e,t){t===0&&((e.mode&1)===0?t=1:(t=en,en<<=1,(en&130023424)===0&&(en=4194304)));var r=pt();e=fr(e,t),e!==null&&(Cr(e,t,r),wt(e,r))}function vp(e){var t=e.memoizedState,r=0;t!==null&&(r=t.retryLane),sc(e,r)}function xp(e,t){var r=0;switch(e.tag){case 13:var n=e.stateNode,o=e.memoizedState;o!==null&&(r=o.retryLane);break;case 19:n=e.stateNode;break;default:throw Error(u(314))}n!==null&&n.delete(t),sc(e,r)}var uc;uc=function(e,t,r){if(e!==null)if(e.memoizedProps!==t.pendingProps||gt.current)xt=!0;else{if((e.lanes&r)===0&&(t.flags&128)===0)return xt=!1,ip(e,t,r);xt=(e.flags&131072)!==0}else xt=!1,We&&(t.flags&1048576)!==0&&Us(t,gi,t.index);switch(t.lanes=0,t.tag){case 2:var n=t.type;Ti(e,t),e=t.pendingProps;var o=Un(t,at.current);Kn(t,r),o=na(null,t,n,e,o,r);var l=oa();return t.flags|=1,typeof o=="object"&&o!==null&&typeof o.render=="function"&&o.$$typeof===void 0?(t.tag=1,t.memoizedState=null,t.updateQueue=null,vt(n)?(l=!0,fi(t)):l=!1,t.memoizedState=o.state!==null&&o.state!==void 0?o.state:null,ql(t),o.updater=_i,t.stateNode=o,o._reactInternals=t,ca(t,n,e,r),t=ma(null,t,n,!0,l,r)):(t.tag=0,We&&l&&Al(t),dt(null,t,o,r),t=t.child),t;case 16:n=t.elementType;e:{switch(Ti(e,t),e=t.pendingProps,o=n._init,n=o(n._payload),t.type=n,o=t.tag=wp(n),e=Qt(n,e),o){case 0:t=fa(null,t,n,e,r);break e;case 1:t=Iu(null,t,n,e,r);break e;case 11:t=Pu(null,t,n,e,r);break e;case 14:t=Tu(null,t,n,Qt(n.type,e),r);break e}throw Error(u(306,n,""))}return t;case 0:return n=t.type,o=t.pendingProps,o=t.elementType===n?o:Qt(n,o),fa(e,t,n,o,r);case 1:return n=t.type,o=t.pendingProps,o=t.elementType===n?o:Qt(n,o),Iu(e,t,n,o,r);case 3:e:{if(Ou(t),e===null)throw Error(u(387));n=t.pendingProps,l=t.memoizedState,o=l.element,Xs(e,t),zi(t,n,null,r);var a=t.memoizedState;if(n=a.element,l.isDehydrated)if(l={element:n,isDehydrated:!1,cache:a.cache,pendingSuspenseBoundaries:a.pendingSuspenseBoundaries,transitions:a.transitions},t.updateQueue.baseState=l,t.memoizedState=l,t.flags&256){o=qn(Error(u(423)),t),t=Fu(e,t,n,r,o);break e}else if(n!==o){o=qn(Error(u(424)),t),t=Fu(e,t,n,r,o);break e}else for(Nt=Pr(t.stateNode.containerInfo.firstChild),St=t,We=!0,Ht=null,r=Gs(t,null,n,r),t.child=r;r;)r.flags=r.flags&-3|4096,r=r.sibling;else{if(Qn(),n===o){t=hr(e,t,r);break e}dt(e,t,n,r)}t=t.child}return t;case 5:return eu(t),e===null&&Wl(t),n=t.type,o=t.pendingProps,l=e!==null?e.memoizedProps:null,a=o.children,Ml(n,o)?a=null:l!==null&&Ml(n,l)&&(t.flags|=32),Mu(e,t),dt(e,t,a,r),t.child;case 6:return e===null&&Wl(t),null;case 13:return Du(e,t,r);case 4:return Xl(t,t.stateNode.containerInfo),n=t.pendingProps,e===null?t.child=Vn(t,null,n,r):dt(e,t,n,r),t.child;case 11:return n=t.type,o=t.pendingProps,o=t.elementType===n?o:Qt(n,o),Pu(e,t,n,o,r);case 7:return dt(e,t,t.pendingProps,r),t.child;case 8:return dt(e,t,t.pendingProps.children,r),t.child;case 12:return dt(e,t,t.pendingProps.children,r),t.child;case 10:e:{if(n=t.type._context,o=t.pendingProps,l=t.memoizedProps,a=o.value,Oe(yi,n._currentValue),n._currentValue=a,l!==null)if(Wt(l.value,a)){if(l.children===o.children&&!gt.current){t=hr(e,t,r);break e}}else for(l=t.child,l!==null&&(l.return=t);l!==null;){var d=l.dependencies;if(d!==null){a=l.child;for(var p=d.firstContext;p!==null;){if(p.context===n){if(l.tag===1){p=mr(-1,r&-r),p.tag=2;var y=l.updateQueue;if(y!==null){y=y.shared;var C=y.pending;C===null?p.next=p:(p.next=C.next,C.next=p),y.pending=p}}l.lanes|=r,p=l.alternate,p!==null&&(p.lanes|=r),Kl(l.return,r,t),d.lanes|=r;break}p=p.next}}else if(l.tag===10)a=l.type===t.type?null:l.child;else if(l.tag===18){if(a=l.return,a===null)throw Error(u(341));a.lanes|=r,d=a.alternate,d!==null&&(d.lanes|=r),Kl(a,r,t),a=l.sibling}else a=l.child;if(a!==null)a.return=l;else for(a=l;a!==null;){if(a===t){a=null;break}if(l=a.sibling,l!==null){l.return=a.return,a=l;break}a=a.return}l=a}dt(e,t,o.children,r),t=t.child}return t;case 9:return o=t.type,n=t.pendingProps.children,Kn(t,r),o=It(o),n=n(o),t.flags|=1,dt(e,t,n,r),t.child;case 14:return n=t.type,o=Qt(n,t.pendingProps),o=Qt(n.type,o),Tu(e,t,n,o,r);case 15:return Lu(e,t,t.type,t.pendingProps,r);case 17:return n=t.type,o=t.pendingProps,o=t.elementType===n?o:Qt(n,o),Ti(e,t),t.tag=1,vt(n)?(e=!0,fi(t)):e=!1,Kn(t,r),ku(t,n,o),ca(t,n,o,r),ma(null,t,n,!0,e,r);case 19:return Au(e,t,r);case 22:return Ru(e,t,r)}throw Error(u(156,t.tag))};function cc(e,t){return Cn(e,t)}function yp(e,t,r,n){this.tag=e,this.key=r,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.ref=null,this.pendingProps=t,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=n,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function Dt(e,t,r,n){return new yp(e,t,r,n)}function Ma(e){return e=e.prototype,!(!e||!e.isReactComponent)}function wp(e){if(typeof e=="function")return Ma(e)?1:0;if(e!=null){if(e=e.$$typeof,e===I)return 11;if(e===A)return 14}return 2}function Br(e,t){var r=e.alternate;return r===null?(r=Dt(e.tag,t,e.key,e.mode),r.elementType=e.elementType,r.type=e.type,r.stateNode=e.stateNode,r.alternate=e,e.alternate=r):(r.pendingProps=t,r.type=e.type,r.flags=0,r.subtreeFlags=0,r.deletions=null),r.flags=e.flags&14680064,r.childLanes=e.childLanes,r.lanes=e.lanes,r.child=e.child,r.memoizedProps=e.memoizedProps,r.memoizedState=e.memoizedState,r.updateQueue=e.updateQueue,t=e.dependencies,r.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext},r.sibling=e.sibling,r.index=e.index,r.ref=e.ref,r}function Ui(e,t,r,n,o,l){var a=2;if(n=e,typeof e=="function")Ma(e)&&(a=1);else if(typeof e=="string")a=5;else e:switch(e){case ye:return mn(r.children,o,l,t);case Ce:a=8,o|=8;break;case re:return e=Dt(12,r,t,o|2),e.elementType=re,e.lanes=l,e;case ne:return e=Dt(13,r,t,o),e.elementType=ne,e.lanes=l,e;case S:return e=Dt(19,r,t,o),e.elementType=S,e.lanes=l,e;case me:return Wi(r,o,l,t);default:if(typeof e=="object"&&e!==null)switch(e.$$typeof){case He:a=10;break e;case Le:a=9;break e;case I:a=11;break e;case A:a=14;break e;case ce:a=16,n=null;break e}throw Error(u(130,e==null?e:typeof e,""))}return t=Dt(a,r,t,o),t.elementType=e,t.type=n,t.lanes=l,t}function mn(e,t,r,n){return e=Dt(7,e,n,t),e.lanes=r,e}function Wi(e,t,r,n){return e=Dt(22,e,n,t),e.elementType=me,e.lanes=r,e.stateNode={isHidden:!1},e}function Ia(e,t,r){return e=Dt(6,e,null,t),e.lanes=r,e}function Oa(e,t,r){return t=Dt(4,e.children!==null?e.children:[],e.key,t),t.lanes=r,t.stateNode={containerInfo:e.containerInfo,pendingChildren:null,implementation:e.implementation},t}function bp(e,t,r,n,o){this.tag=t,this.containerInfo=e,this.finishedWork=this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.pendingContext=this.context=null,this.callbackPriority=0,this.eventTimes=Ln(0),this.expirationTimes=Ln(-1),this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=Ln(0),this.identifierPrefix=n,this.onRecoverableError=o,this.mutableSourceEagerHydrationData=null}function Fa(e,t,r,n,o,l,a,d,p){return e=new bp(e,t,r,d,p),t===1?(t=1,l===!0&&(t|=8)):t=0,l=Dt(3,null,null,t),e.current=l,l.stateNode=e,l.memoizedState={element:n,isDehydrated:r,cache:null,transitions:null,pendingSuspenseBoundaries:null},ql(l),e}function zp(e,t,r){var n=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:ve,key:n==null?null:""+n,children:e,containerInfo:t,implementation:r}}function dc(e){if(!e)return Lr;e=e._reactInternals;e:{if(Fe(e)!==e||e.tag!==1)throw Error(u(170));var t=e;do{switch(t.tag){case 3:t=t.stateNode.context;break e;case 1:if(vt(t.type)){t=t.stateNode.__reactInternalMemoizedMergedChildContext;break e}}t=t.return}while(t!==null);throw Error(u(171))}if(e.tag===1){var r=e.type;if(vt(r))return $s(e,r,t)}return t}function pc(e,t,r,n,o,l,a,d,p){return e=Fa(r,n,!0,e,o,l,a,d,p),e.context=dc(null),r=e.current,n=pt(),o=$r(r),l=mr(n,o),l.callback=t??null,Ir(r,l,o),e.current.lanes=o,Cr(e,o,n),wt(e,n),e}function Hi(e,t,r,n){var o=t.current,l=pt(),a=$r(o);return r=dc(r),t.context===null?t.context=r:t.pendingContext=r,t=mr(l,a),t.payload={element:e},n=n===void 0?null:n,n!==null&&(t.callback=n),e=Ir(o,t,a),e!==null&&(Kt(e,o,a,l),bi(e,o,a)),a}function Qi(e){if(e=e.current,!e.child)return null;switch(e.child.tag){case 5:return e.child.stateNode;default:return e.child.stateNode}}function fc(e,t){if(e=e.memoizedState,e!==null&&e.dehydrated!==null){var r=e.retryLane;e.retryLane=r!==0&&r<t?r:t}}function Da(e,t){fc(e,t),(e=e.alternate)&&fc(e,t)}function kp(){return null}var mc=typeof reportError=="function"?reportError:function(e){console.error(e)};function $a(e){this._internalRoot=e}Vi.prototype.render=$a.prototype.render=function(e){var t=this._internalRoot;if(t===null)throw Error(u(409));Hi(e,t,null,null)},Vi.prototype.unmount=$a.prototype.unmount=function(){var e=this._internalRoot;if(e!==null){this._internalRoot=null;var t=e.containerInfo;dn(function(){Hi(null,e,null,null)}),t[ur]=null}};function Vi(e){this._internalRoot=e}Vi.prototype.unstable_scheduleHydration=function(e){if(e){var t=de();e={blockedOn:null,target:e,priority:t};for(var r=0;r<pe.length&&t!==0&&t<pe[r].priority;r++);pe.splice(r,0,e),r===0&&qo(e)}};function Aa(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11)}function Yi(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11&&(e.nodeType!==8||e.nodeValue!==" react-mount-point-unstable "))}function hc(){}function jp(e,t,r,n,o){if(o){if(typeof n=="function"){var l=n;n=function(){var y=Qi(a);l.call(y)}}var a=pc(t,n,e,0,null,!1,!1,"",hc);return e._reactRootContainer=a,e[ur]=a.current,zo(e.nodeType===8?e.parentNode:e),dn(),a}for(;o=e.lastChild;)e.removeChild(o);if(typeof n=="function"){var d=n;n=function(){var y=Qi(p);d.call(y)}}var p=Fa(e,0,!1,null,null,!1,!1,"",hc);return e._reactRootContainer=p,e[ur]=p.current,zo(e.nodeType===8?e.parentNode:e),dn(function(){Hi(t,p,r,n)}),p}function Ki(e,t,r,n,o){var l=r._reactRootContainer;if(l){var a=l;if(typeof o=="function"){var d=o;o=function(){var p=Qi(a);d.call(p)}}Hi(t,a,e,o)}else a=jp(r,t,e,o,n);return Qi(a)}H=function(e){switch(e.tag){case 3:var t=e.stateNode;if(t.current.memoizedState.isDehydrated){var r=Nr(t.pendingLanes);r!==0&&(v(t,r|1),wt(t,Ue()),(Ee&6)===0&&(Jn=Ue()+500,Rr()))}break;case 13:dn(function(){var n=fr(e,1);if(n!==null){var o=pt();Kt(n,e,1,o)}}),Da(e,1)}},Q=function(e){if(e.tag===13){var t=fr(e,134217728);if(t!==null){var r=pt();Kt(t,e,134217728,r)}Da(e,134217728)}},ee=function(e){if(e.tag===13){var t=$r(e),r=fr(e,t);if(r!==null){var n=pt();Kt(r,e,t,n)}Da(e,t)}},de=function(){return b},Se=function(e,t){var r=b;try{return b=e,t()}finally{b=r}},Pt=function(e,t,r){switch(t){case"input":if(gn(e,r),t=r.name,r.type==="radio"&&t!=null){for(r=e;r.parentNode;)r=r.parentNode;for(r=r.querySelectorAll("input[name="+JSON.stringify(""+t)+'][type="radio"]'),t=0;t<r.length;t++){var n=r[t];if(n!==e&&n.form===e.form){var o=di(n);if(!o)throw Error(u(90));Wr(n),gn(n,o)}}}break;case"textarea":lo(e,r);break;case"select":t=r.value,t!=null&&yr(e,!!r.multiple,t,!1)}},Yr=Ta,Jt=dn;var Sp={usingClientEntryPoint:!1,Events:[So,An,di,ao,Wo,Ta]},$o={findFiberByHostInstance:rn,bundleType:0,version:"18.3.1",rendererPackageName:"react-dom"},Np={bundleType:$o.bundleType,version:$o.version,rendererPackageName:$o.rendererPackageName,rendererConfig:$o.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:he.ReactCurrentDispatcher,findHostInstanceByFiber:function(e){return e=Ut(e),e===null?null:e.stateNode},findFiberByHostInstance:$o.findFiberByHostInstance||kp,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.3.1-next-f1338f8080-20240426"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var Gi=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!Gi.isDisabled&&Gi.supportsFiber)try{Jr=Gi.inject(Np),Tt=Gi}catch{}}return bt.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=Sp,bt.createPortal=function(e,t){var r=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!Aa(t))throw Error(u(200));return zp(e,t,null,r)},bt.createRoot=function(e,t){if(!Aa(e))throw Error(u(299));var r=!1,n="",o=mc;return t!=null&&(t.unstable_strictMode===!0&&(r=!0),t.identifierPrefix!==void 0&&(n=t.identifierPrefix),t.onRecoverableError!==void 0&&(o=t.onRecoverableError)),t=Fa(e,1,!1,null,null,r,!1,n,o),e[ur]=t.current,zo(e.nodeType===8?e.parentNode:e),new $a(t)},bt.findDOMNode=function(e){if(e==null)return null;if(e.nodeType===1)return e;var t=e._reactInternals;if(t===void 0)throw typeof e.render=="function"?Error(u(188)):(e=Object.keys(e).join(","),Error(u(268,e)));return e=Ut(t),e=e===null?null:e.stateNode,e},bt.flushSync=function(e){return dn(e)},bt.hydrate=function(e,t,r){if(!Yi(t))throw Error(u(200));return Ki(null,e,t,!0,r)},bt.hydrateRoot=function(e,t,r){if(!Aa(e))throw Error(u(405));var n=r!=null&&r.hydratedSources||null,o=!1,l="",a=mc;if(r!=null&&(r.unstable_strictMode===!0&&(o=!0),r.identifierPrefix!==void 0&&(l=r.identifierPrefix),r.onRecoverableError!==void 0&&(a=r.onRecoverableError)),t=pc(t,null,e,1,r??null,o,!1,l,a),e[ur]=t.current,zo(e),n)for(e=0;e<n.length;e++)r=n[e],o=r._getVersion,o=o(r._source),t.mutableSourceEagerHydrationData==null?t.mutableSourceEagerHydrationData=[r,o]:t.mutableSourceEagerHydrationData.push(r,o);return new Vi(t)},bt.render=function(e,t,r){if(!Yi(t))throw Error(u(200));return Ki(null,e,t,!1,r)},bt.unmountComponentAtNode=function(e){if(!Yi(e))throw Error(u(40));return e._reactRootContainer?(dn(function(){Ki(null,null,e,!1,function(){e._reactRootContainer=null,e[ur]=null})}),!0):!1},bt.unstable_batchedUpdates=Ta,bt.unstable_renderSubtreeIntoContainer=function(e,t,r,n){if(!Yi(r))throw Error(u(200));if(e==null||e._reactInternals===void 0)throw Error(u(38));return Ki(e,t,r,!1,n)},bt.version="18.3.1-next-f1338f8080-20240426",bt}var jc;function Op(){if(jc)return Wa.exports;jc=1;function s(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(s)}catch(f){console.error(f)}}return s(),Wa.exports=Ip(),Wa.exports}var Sc;function Fp(){if(Sc)return qi;Sc=1;var s=Op();return qi.createRoot=s.createRoot,qi.hydrateRoot=s.hydrateRoot,qi}var Dp=Fp();const $p=Dc(Dp),Ac="http://localhost:3000";async function qt(s,f={}){let u;try{u=await fetch(`${Ac}${s}`,{headers:{"Content-Type":"application/json"},...f})}catch{const _=new Error("Network error. Please check your connection.");throw _.isNetworkError=!0,_}const k=await u.json().catch(()=>({}));if(!u.ok){const w=new Error(k.message||"Something went wrong. Please try again.");throw w.status=u.status,w.data=k.data,w}return k}const Ap=()=>qt("/api/category/public"),Nc=()=>qt("/api/dish/public"),Cc=()=>qt("/api/deal/public"),Bp=()=>qt("/api/hero-slide/public"),Up=s=>qt("/api/order/public/checkout",{method:"POST",body:JSON.stringify(s)}),Ec=s=>qt(`/api/order/public/${s}`),Wp=s=>qt(`/api/order/public/${s}/cancel`,{method:"PATCH"}),Hp=s=>qt(`/api/order/public/lookup?phone=${encodeURIComponent(s)}`),_c=()=>qt("/api/settings"),Qp=(s=30)=>qt(`/api/review/public?limit=${s}`),Vp=s=>qt("/api/review/public",{method:"POST",body:JSON.stringify(s)});async function Yp(s){const f=new FormData;f.append("screenshot",s);let u;try{u=await fetch(`${Ac}/api/order/public/payment-proof`,{method:"POST",body:f})}catch{const w=new Error("Network error. Please check your connection and try again.");throw w.isNetworkError=!0,w}const k=await u.json().catch(()=>({}));if(!u.ok){const w=new Error(k.message||"Couldn't upload the screenshot. Please try again.");throw w.status=u.status,w}return k}const Kp="http://localhost:3000",Gt=s=>s?s.startsWith("http://")||s.startsWith("https://")?s:s.startsWith("/uploads/")?`${Kp}${s}`:s:"",ro="/assets/genz-pizza-land-logo-CQKpkaM4.jpg",Gp="/assets/sindbad-solution-logo-DhhzzCiL.png",qp=`
:root {
  --shell: 100%;
  --gutter: clamp(16px, 2.6vw, 56px);
  --header-h: 68px;
  --nav-h: 60px;

  --ink-900: #FFF8EF;
  --cream-2: #FFEFD9;
  --surface: #ffffff;
  --flour: #1f1b18;
  --flour-dim: #5d554d;
  --flour-faint: #85796e;
  --line: rgba(31, 27, 24, 0.10);

  --r-xl: 30px;
  --r-lg: 22px;
  --r-md: 14px;

  --shadow-soft: 0 1px 2px rgba(31, 27, 24, 0.05), 0 10px 30px -14px rgba(31, 27, 24, 0.18);
  --shadow-hover: 0 2px 4px rgba(31, 27, 24, 0.05), 0 26px 44px -18px rgba(230, 57, 47, 0.28);
}

html { scroll-padding-top: calc(var(--header-h) + var(--nav-h)); }

body {
  background:
    radial-gradient(1100px 600px at 100% -6%, rgba(255, 200, 61, 0.22), transparent 60%),
    radial-gradient(900px 600px at -6% 30%, rgba(230, 57, 47, 0.07), transparent 60%),
    var(--ink-900);
}
body::before { opacity: 0.025; }

/* The page itself spans the viewport. Content gets a modest gutter and,
   only on truly huge monitors, a very generous ceiling. */
.gzp-shell,
.gzp-header-inner,
.gzp-navbar-inner,
.v2-wrap {
  width: 100%;
  max-width: 2400px;
  margin-inline: auto;
}
.v2-wrap { padding-inline: var(--gutter); }

/* ---------- Header (glass) ---------- */

.gzp-header {
  background: rgba(255, 248, 239, 0.82);
  backdrop-filter: saturate(1.6) blur(16px);
  -webkit-backdrop-filter: saturate(1.6) blur(16px);
  border-bottom: 1px solid var(--line);
  box-shadow: none;
}
.gzp-header-inner { gap: 10px; }
.gzp-brand-mark { width: 42px; height: 42px; border-radius: 50%; box-shadow: 0 0 0 2px #fff, 0 4px 14px -4px rgba(230,57,47,.5); }
.gzp-brand-name { color: var(--flour); font-size: 1.12rem; }
.gzp-brand-sub { color: var(--flour-faint); }

.v2-links { display: none; align-items: center; gap: 4px; margin-right: 8px; }
@media (min-width: 1000px) { .v2-links { display: flex; } }
.v2-link {
  background: none; border: 0; cursor: pointer;
  padding: 9px 14px; border-radius: 999px;
  font-weight: 650; font-size: 0.93rem; color: var(--flour-dim);
  transition: background .15s, color .15s;
}
.v2-link:hover { background: rgba(31,27,24,.06); color: var(--flour); }

.gzp-icon-btn { background: #fff; border-color: var(--line); border-radius: 50%; width: 42px; height: 42px; }
.gzp-icon-btn:hover { background: #fff; border-color: var(--ember); color: var(--ember); }
.gzp-cart-btn { background: var(--ember); border-color: var(--ember); color: #fff; }
.gzp-cart-btn:hover { background: var(--ember-deep); border-color: var(--ember-deep); color: #fff; }
.gzp-cart-count { background: var(--gold); border-color: #fff; }

.v2-track-btn {
  display: none; align-items: center; gap: 8px;
  height: 42px; padding: 0 16px; border-radius: 999px;
  border: 1px solid var(--line); background: #fff; cursor: pointer;
  font-weight: 700; font-size: .9rem;
  transition: border-color .15s, color .15s;
}
.v2-track-btn:hover { border-color: var(--ember); color: var(--ember); }
.v2-track-btn svg { width: 18px; height: 18px; }
@media (min-width: 700px) { .v2-track-btn { display: inline-flex; } }

/* ---------- Hero intro ---------- */

.v2-hero { padding-top: clamp(20px, 3.4vw, 52px); }
.v2-hero-grid {
  display: grid; gap: clamp(20px, 3vw, 48px);
  grid-template-columns: 1fr; align-items: end;
}
@media (min-width: 1000px) { .v2-hero-grid { grid-template-columns: 1.35fr 1fr; } }

.v2-eyebrow {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 7px 14px; border-radius: 999px;
  background: #fff; border: 1px solid var(--line);
  font-weight: 700; font-size: .8rem; letter-spacing: .02em; color: var(--flour-dim);
  box-shadow: var(--shadow-soft);
}
.v2-eyebrow i { width: 8px; height: 8px; border-radius: 50%; background: var(--basil); box-shadow: 0 0 0 4px rgba(26,158,86,.18); }

.v2-hero h1 {
  margin: 18px 0 14px;
  font-size: clamp(2.3rem, 5.6vw, 5rem);
  line-height: 1.02; letter-spacing: -0.04em; font-weight: 900;
  font-variation-settings: "wdth" 116;
}
.v2-hero h1 em { font-style: normal; color: var(--ember); position: relative; white-space: nowrap; }
.v2-hero h1 em::after {
  content: ""; position: absolute; left: 0; right: 0; bottom: 0.06em; height: .22em;
  background: var(--gold); z-index: -1; border-radius: 6px; transform: rotate(-1deg);
}
.v2-hero p.lead { margin: 0; max-width: 56ch; font-size: clamp(1rem, 1.3vw, 1.2rem); color: var(--flour-dim); }
.v2-cta { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 26px; }
.v2-cta .gzp-btn { padding: 15px 26px; border-radius: 999px; font-size: 1rem; }
.v2-cta .gzp-btn-ghost { background: #fff; }

.v2-stats {
  display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;
}
.v2-stat {
  background: #fff; border: 1px solid var(--line); border-radius: var(--r-lg);
  padding: 18px 18px 16px; box-shadow: var(--shadow-soft);
}
.v2-stat:nth-child(1) { background: var(--ember); border-color: var(--ember); color: #fff; }
.v2-stat:nth-child(4) { background: var(--gold); border-color: var(--gold); }
.v2-stat b { display: block; font-family: "Archivo", sans-serif; font-size: clamp(1.4rem, 2.2vw, 2rem); font-weight: 850; letter-spacing: -.03em; line-height: 1.1; }
.v2-stat span { display: block; margin-top: 4px; font-size: .85rem; font-weight: 600; opacity: .8; }

/* Slider — rounded, framed, full width */
.gzp-hero { padding: clamp(18px, 2.4vw, 34px) var(--gutter) 0; }
.gzp-slider {
  border-radius: var(--r-xl);
  box-shadow: var(--shadow-soft);
  border: 1px solid var(--line);
  aspect-ratio: 16 / 7;
  max-width: 2400px; margin-inline: auto;
}
@media (min-width: 640px) { .gzp-slider { aspect-ratio: 16 / 6; } }
@media (min-width: 900px) { .gzp-slider { aspect-ratio: 21 / 6.4; } }
@media (min-width: 1500px) { .gzp-slider { aspect-ratio: 21 / 5.6; } }
.gzp-slider-dots { background: rgba(31,27,24,.55); }

/* ---------- Category nav ---------- */

.gzp-navbar { background: rgba(255,248,239,.9); border-bottom: 1px solid var(--line); }
.gzp-chip {
  border: 1px solid var(--line); background: #fff; color: var(--flour-dim);
  padding: 9px 18px; font-weight: 650;
}
.gzp-chip:hover { border-color: var(--ember); color: var(--ember); background: #fff; }
.gzp-chip.is-active { background: var(--flour); border-color: var(--flour); color: #fff; box-shadow: 0 8px 18px -8px rgba(31,27,24,.6); }

/* ---------- Section headings ---------- */

.gzp-section { padding-top: clamp(38px, 5vw, 76px); }
.gzp-section-head { margin-bottom: clamp(16px, 2vw, 26px); align-items: center; }
.gzp-section-head h2 {
  font-size: clamp(1.6rem, 3vw, 2.6rem); font-weight: 850; letter-spacing: -0.035em;
}
.gzp-section-count {
  padding: 5px 12px; border-radius: 999px; background: var(--cream-2);
  color: var(--flour-dim); font-weight: 700; font-size: .78rem;
}
.gzp-section-rule { background: linear-gradient(90deg, rgba(31,27,24,.14), transparent); }

/* ---------- Cards ---------- */

.gzp-grid { grid-template-columns: repeat(auto-fill, minmax(165px, 1fr)); gap: clamp(12px, 1.4vw, 24px); }
@media (min-width: 640px)  { .gzp-grid { grid-template-columns: repeat(auto-fill, minmax(230px, 1fr)); } }
@media (min-width: 1400px) { .gzp-grid { grid-template-columns: repeat(auto-fill, minmax(270px, 1fr)); } }

.gzp-card, .gzp-deal {
  background: var(--surface); border: 1px solid var(--line);
  border-radius: var(--r-lg); box-shadow: var(--shadow-soft);
  transition: transform .22s ease, box-shadow .22s ease, border-color .22s ease;
}
.gzp-card:hover, .gzp-deal:hover { transform: translateY(-5px); box-shadow: var(--shadow-hover); border-color: rgba(230,57,47,.35); }
.gzp-card-media { aspect-ratio: 1 / 0.82; }
.gzp-card-body { padding: 14px 16px 16px; gap: 12px; }
.gzp-card-body h3 { font-size: 1.04rem; font-weight: 750; }
.gzp-deal { flex-basis: 300px; }
@media (min-width: 720px)  { .gzp-deal { flex-basis: 340px; } }
@media (min-width: 1400px) { .gzp-deal { flex-basis: 380px; } }
.gzp-rail { gap: clamp(14px, 1.4vw, 24px); padding-bottom: 14px; }
.gzp-price { color: var(--flour); font-weight: 850; }
.gzp-add { border-radius: 50%; }
.gzp-add-wide { border-radius: 999px; }
.gzp-badge { background: var(--ember); box-shadow: 0 6px 14px -6px rgba(230,57,47,.7); }
.gzp-save { background: #fff; color: var(--basil); border-color: rgba(26,158,86,.4); }
.gzp-stock { background: #fff; color: #9a6a00; }

.gzp-sheet, .gzp-modal { border-radius: var(--r-xl); }

/* ---------- Generic new-section scaffolding ---------- */

.v2-section { padding-top: clamp(48px, 6.5vw, 110px); }
.v2-kicker {
  display: inline-block; margin-bottom: 10px;
  font-weight: 800; font-size: .78rem; letter-spacing: .14em; text-transform: uppercase; color: var(--ember);
}
.v2-title {
  font-size: clamp(1.8rem, 3.6vw, 3.1rem); line-height: 1.05; letter-spacing: -0.04em; font-weight: 880;
  font-variation-settings: "wdth" 114; max-width: 22ch;
}
.v2-sub { margin: 12px 0 0; color: var(--flour-dim); max-width: 60ch; font-size: 1.04rem; }

/* Features strip */
.v2-features { display: grid; gap: clamp(12px, 1.4vw, 22px); grid-template-columns: repeat(auto-fit, minmax(230px, 1fr)); margin-top: clamp(20px, 2.6vw, 36px); }
.v2-feature {
  background: #fff; border: 1px solid var(--line); border-radius: var(--r-lg);
  padding: 24px; box-shadow: var(--shadow-soft);
  transition: transform .2s ease, box-shadow .2s ease;
}
.v2-feature:hover { transform: translateY(-4px); box-shadow: var(--shadow-hover); }
.v2-ico {
  width: 52px; height: 52px; display: grid; place-items: center; border-radius: 16px;
  background: var(--cream-2); font-size: 1.5rem; margin-bottom: 16px;
}
.v2-feature h3 { font-size: 1.15rem; font-weight: 800; letter-spacing: -.02em; margin-bottom: 6px; }
.v2-feature p { margin: 0; color: var(--flour-dim); font-size: .95rem; }

/* How it works */
.v2-how {
  margin-top: clamp(48px, 6.5vw, 110px);
  background: var(--flour); color: #fff; border-radius: var(--r-xl);
  padding: clamp(28px, 4.5vw, 72px); position: relative; overflow: hidden;
}
.v2-how::before {
  content: ""; position: absolute; width: 520px; height: 520px; right: -140px; top: -200px;
  background: radial-gradient(closest-side, rgba(255,200,61,.28), transparent); pointer-events: none;
}
.v2-how .v2-kicker { color: var(--gold); }
.v2-how .v2-sub { color: rgba(255,255,255,.7); }
.v2-steps { display: grid; gap: clamp(14px, 2vw, 30px); grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); margin-top: clamp(24px, 3vw, 44px); position: relative; }
.v2-step { border-top: 2px solid rgba(255,255,255,.18); padding-top: 18px; }
.v2-step b {
  display: inline-grid; place-items: center; width: 40px; height: 40px; border-radius: 50%;
  background: var(--ember); font-family: "Archivo", sans-serif; font-weight: 850;
}
.v2-step h3 { margin: 14px 0 6px; font-size: 1.25rem; font-weight: 800; letter-spacing: -.02em; }
.v2-step p { margin: 0; color: rgba(255,255,255,.68); }

/* ---------- Reviews ---------- */

.v2-reviews-head { display: flex; flex-wrap: wrap; gap: 22px 40px; align-items: flex-end; justify-content: space-between; }
.v2-rv-layout { display: grid; gap: clamp(16px, 2vw, 32px); margin-top: clamp(20px, 2.6vw, 36px); grid-template-columns: 1fr; align-items: start; }
@media (min-width: 1000px) { .v2-rv-layout { grid-template-columns: 340px 1fr; } }
@media (min-width: 1700px) { .v2-rv-layout { grid-template-columns: 400px 1fr; } }

.v2-rv-summary {
  background: #fff; border: 1px solid var(--line); border-radius: var(--r-lg);
  padding: 26px; box-shadow: var(--shadow-soft);
}
@media (min-width: 1000px) { .v2-rv-summary { position: sticky; top: calc(var(--header-h) + var(--nav-h) + 16px); } }
.v2-rv-score { display: flex; align-items: center; gap: 16px; }
.v2-rv-score b { font-family: "Archivo", sans-serif; font-size: 3.6rem; line-height: 1; font-weight: 900; letter-spacing: -.05em; }
.v2-rv-score small { display: block; margin-top: 4px; color: var(--flour-faint); font-weight: 600; }
.v2-stars { display: inline-flex; gap: 2px; color: #f5a400; }
.v2-stars svg { width: 18px; height: 18px; }
.v2-stars .off { color: rgba(31,27,24,.16); }
.v2-bars { margin: 20px 0 22px; display: grid; gap: 8px; }
.v2-bar { display: grid; grid-template-columns: 22px 1fr 28px; align-items: center; gap: 10px; font-size: .82rem; font-weight: 700; color: var(--flour-dim); }
.v2-bar i { height: 8px; border-radius: 99px; background: rgba(31,27,24,.08); overflow: hidden; display: block; }
.v2-bar i span { display: block; height: 100%; border-radius: 99px; background: linear-gradient(90deg, #f5a400, var(--gold)); }
.v2-bar em { font-style: normal; text-align: right; color: var(--flour-faint); }

.v2-write {
  width: 100%; display: inline-flex; align-items: center; justify-content: center; gap: 10px;
  padding: 15px 20px; border: 0; border-radius: 999px; cursor: pointer;
  background: var(--ember); color: #fff; font-weight: 800; font-size: 1rem;
  box-shadow: 0 14px 28px -14px rgba(230,57,47,.8);
  transition: background .15s, transform .12s;
}
.v2-write:hover { background: var(--ember-deep); }
.v2-write:active { transform: translateY(1px); }
.v2-write svg { width: 18px; height: 18px; }
.v2-write.inline { width: auto; padding-inline: 26px; }

.v2-rv-list { display: grid; gap: clamp(12px, 1.4vw, 20px); grid-template-columns: repeat(auto-fill, minmax(min(100%, 340px), 1fr)); }
.v2-rv {
  background: #fff; border: 1px solid var(--line); border-radius: var(--r-lg);
  padding: 22px; box-shadow: var(--shadow-soft); display: flex; flex-direction: column; gap: 12px;
}
.v2-rv-top { display: flex; align-items: center; gap: 12px; }
.v2-avatar {
  width: 44px; height: 44px; border-radius: 50%; flex: none; display: grid; place-items: center;
  font-family: "Archivo", sans-serif; font-weight: 850; color: #fff;
}
.v2-rv-top strong { display: block; line-height: 1.2; }
.v2-rv-top span { color: var(--flour-faint); font-size: .82rem; }
.v2-rv h4 { margin: 0; font-size: 1.02rem; font-weight: 800; letter-spacing: -.01em; }
.v2-rv p { margin: 0; color: var(--flour-dim); overflow-wrap: anywhere; white-space: pre-line; }
.v2-rv-dish { align-self: flex-start; padding: 4px 11px; border-radius: 99px; background: var(--cream-2); font-size: .78rem; font-weight: 700; color: var(--flour-dim); }
.v2-rv-empty {
  grid-column: 1 / -1; text-align: center; padding: 44px 20px;
  border: 2px dashed rgba(31,27,24,.16); border-radius: var(--r-lg); color: var(--flour-dim);
}
.v2-rv-empty b { display: block; font-size: 1.2rem; color: var(--flour); margin: 6px 0 4px; }
.v2-more { margin: 22px auto 0; display: block; }

/* Review modal */
.v2-rvm-overlay {
  position: fixed; inset: 0; z-index: 120; display: flex; align-items: flex-end; justify-content: center;
  background: rgba(31,27,24,.55); backdrop-filter: blur(4px); padding: 0;
  animation: v2fade .18s ease;
}
@media (min-width: 700px) { .v2-rvm-overlay { align-items: center; padding: 24px; } }
.v2-rvm {
  width: 100%; max-width: 560px; max-height: 94vh; overflow-y: auto; background: #fff;
  border-radius: 28px 28px 0 0; padding: 26px 24px 28px; box-shadow: 0 40px 80px -20px rgba(0,0,0,.5);
  animation: v2up .22s ease;
}
@media (min-width: 700px) { .v2-rvm { border-radius: 28px; padding: 32px; } }
.v2-rvm-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; margin-bottom: 18px; }
.v2-rvm-head h3 { font-size: 1.6rem; font-weight: 880; letter-spacing: -.03em; }
.v2-rvm-head p { margin: 4px 0 0; color: var(--flour-dim); font-size: .94rem; }
.v2-rvm-form { display: grid; gap: 16px; }
.v2-rvm-form label.f { display: grid; gap: 6px; }
.v2-rvm-form label.f > span { font-weight: 700; font-size: .86rem; }
.v2-rvm-form label.f > span small { font-weight: 500; color: var(--flour-faint); }
.v2-rvm-form input[type="text"], .v2-rvm-form textarea {
  width: 100%; padding: 13px 15px; border-radius: 14px; background: #fff;
  border: 1.5px solid rgba(31,27,24,.16); transition: border-color .15s, box-shadow .15s;
}
.v2-rvm-form textarea { min-height: 120px; resize: vertical; }
.v2-rvm-form input:focus, .v2-rvm-form textarea:focus { outline: none; border-color: var(--ember); box-shadow: 0 0 0 4px rgba(230,57,47,.14); }
.v2-count { text-align: right; font-size: .76rem; color: var(--flour-faint); }
.v2-starpick { display: flex; gap: 6px; align-items: center; }
.v2-starpick button {
  background: none; border: 0; padding: 2px; cursor: pointer; color: rgba(31,27,24,.18);
  transition: transform .12s, color .12s;
}
.v2-starpick button svg { width: 38px; height: 38px; display: block; }
.v2-starpick button.on { color: #f5a400; }
.v2-starpick button:hover { transform: scale(1.12); }
.v2-starpick .lbl { margin-left: 10px; font-weight: 750; color: var(--flour-dim); }
.v2-hp { position: absolute; left: -9999px; width: 1px; height: 1px; opacity: 0; }
.v2-form-error { margin: 0; padding: 11px 14px; border-radius: 12px; background: rgba(230,57,47,.1); color: var(--ember-deep); font-weight: 650; font-size: .92rem; }
.v2-rvm-actions { display: flex; gap: 10px; }
.v2-rvm-actions .gzp-btn { flex: 1; padding: 15px; border-radius: 999px; }
.v2-thanks { text-align: center; padding: 18px 6px 6px; }
.v2-thanks .big { font-size: 3.2rem; }
.v2-thanks h3 { font-size: 1.6rem; font-weight: 880; letter-spacing: -.03em; margin: 8px 0; }
.v2-thanks p { color: var(--flour-dim); margin: 0 0 20px; }

@keyframes v2fade { from { opacity: 0; } to { opacity: 1; } }
@keyframes v2up { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: none; } }

/* ---------- Contact panel ---------- */

.v2-contact {
  margin-top: clamp(48px, 6.5vw, 110px);
  display: grid; gap: clamp(14px, 2vw, 28px); grid-template-columns: 1fr;
}
@media (min-width: 900px) { .v2-contact { grid-template-columns: 1.2fr 1fr; } }
.v2-panel {
  border-radius: var(--r-xl); padding: clamp(26px, 3.4vw, 52px);
  border: 1px solid var(--line); background: #fff; box-shadow: var(--shadow-soft);
}
.v2-panel.warm { background: linear-gradient(135deg, var(--ember), #ff6a3d); color: #fff; border: 0; }
.v2-panel.warm .v2-kicker { color: var(--gold); }
.v2-panel.warm .v2-sub { color: rgba(255,255,255,.88); }
.v2-panel .gzp-btn { text-decoration: none; display: inline-flex; border-radius: 999px; padding: 14px 24px; margin-top: 22px; }
.v2-panel.warm .gzp-btn { background: #fff; color: var(--ember-deep); box-shadow: none; }
.v2-facts { margin: 18px 0 0; padding: 0; list-style: none; display: grid; gap: 12px; }
.v2-facts li { display: flex; gap: 12px; align-items: flex-start; font-weight: 600; color: var(--flour-dim); }
.v2-facts li span { flex: none; width: 36px; height: 36px; border-radius: 12px; background: var(--cream-2); display: grid; place-items: center; }

/* ---------- Footer ---------- */

.v2-footer { margin-top: clamp(56px, 7vw, 120px); background: var(--flour); color: rgba(255,255,255,.78); }
.v2-footer-grid {
  display: grid; gap: 32px; padding-block: clamp(36px, 5vw, 72px);
  grid-template-columns: 1fr;
}
@media (min-width: 800px) { .v2-footer-grid { grid-template-columns: 1.6fr 1fr 1fr; } }
.v2-footer h4 { margin: 0 0 14px; color: #fff; font-family: "Archivo", sans-serif; font-weight: 800; font-size: 1rem; }
.v2-footer .brand { display: flex; align-items: center; gap: 12px; color: #fff; font-family: "Archivo", sans-serif; font-weight: 850; font-size: 1.3rem; }
.v2-footer .brand img { width: 48px; height: 48px; border-radius: 50%; object-fit: cover; }
.v2-footer p { margin: 12px 0 0; max-width: 46ch; font-size: .92rem; line-height: 1.6; color: rgba(255,255,255,.62); }
.v2-footer ul { list-style: none; margin: 0; padding: 0; display: grid; gap: 9px; }
.v2-footer li button { background: none; border: 0; padding: 0; cursor: pointer; color: rgba(255,255,255,.72); font-weight: 550; }
.v2-footer li button:hover { color: var(--gold); }
.v2-footer-bottom {
  border-top: 1px solid rgba(255,255,255,.12); padding-block: 18px; display: flex; flex-wrap: wrap;
  gap: 10px 20px; align-items: center; justify-content: space-between; font-size: .8rem; color: rgba(255,255,255,.5);
}
.v2-footer-bottom .credit { display: inline-flex; align-items: center; gap: 8px; }
.v2-footer-bottom .credit img { width: 24px; height: 24px; border-radius: 50%; }
.v2-footer-bottom .credit strong { color: rgba(255,255,255,.8); }

.gzp-app { padding-bottom: 0; }
.v2-footer-bottom { padding-bottom: 104px; }

/* ---------- Payment (JazzCash / Raast QR) ---------- */

.pay-methods { border: 0; padding: 0; margin: 4px 0 0; display: grid; gap: 10px; min-width: 0; }
.pay-methods legend { font-weight: 800; font-size: .86rem; margin-bottom: 8px; padding: 0; }
.pay-method {
  position: relative; display: flex; align-items: center; gap: 12px; cursor: pointer;
  padding: 14px 16px; border-radius: 16px; background: #fff;
  border: 2px solid rgba(31,27,24,.12); transition: border-color .15s, box-shadow .15s, background .15s;
}
.pay-method:hover { border-color: rgba(180,6,20,.4); }
.pay-method.is-on { border-color: #B40614; background: #fff5f4; box-shadow: 0 10px 24px -14px rgba(180,6,20,.6); }
.pay-method input { position: absolute; opacity: 0; pointer-events: none; }
.pay-method input:focus-visible ~ .pay-radio { outline: 2px solid var(--gold); outline-offset: 3px; }
.pay-ico { font-size: 1.6rem; flex: none; }
.pay-text { flex: 1; min-width: 0; display: grid; }
.pay-text b { font-size: .98rem; }
.pay-text small { color: var(--flour-dim); font-size: .8rem; }
.pay-radio { flex: none; width: 22px; height: 22px; border-radius: 50%; border: 2px solid rgba(31,27,24,.3); position: relative; }
.pay-method.is-on .pay-radio { border-color: #B40614; }
.pay-method.is-on .pay-radio::after { content: ""; position: absolute; inset: 3px; border-radius: 50%; background: #B40614; }

.pay-card { display: grid; gap: 18px; padding: 16px; border-radius: 20px; background: #fff; border: 1px solid var(--line); box-shadow: var(--shadow-soft); }
.pay-amount {
  display: grid; gap: 2px; text-align: center; padding: 16px; border-radius: 16px;
  background: linear-gradient(135deg, #B40614, #EE4540); color: #fff;
}
.pay-amount span { font-weight: 700; font-size: .82rem; letter-spacing: .08em; text-transform: uppercase; opacity: .9; }
.pay-amount strong { font-family: "Archivo", sans-serif; font-size: clamp(1.8rem, 6vw, 2.4rem); font-weight: 900; letter-spacing: -.03em; line-height: 1.1; }
.pay-amount small { opacity: .9; font-size: .8rem; }

.pay-grid { display: grid; gap: 18px; grid-template-columns: 1fr; align-items: start; }
.pay-qr { display: grid; gap: 8px; justify-items: center; text-align: center; }
.pay-grid, .pay-card, .pay-info { min-width: 0; }
.pay-qr img {
  width: 100%; max-width: 320px; height: auto; border-radius: 14px;
  border: 1px solid var(--line); background: #ffd800;
}
.pay-qr p { margin: 0; font-weight: 700; font-size: .86rem; color: var(--flour-dim); }
.pay-info { display: grid; gap: 12px; min-width: 0; }
.pay-row { display: grid; gap: 4px; padding: 12px 14px; border-radius: 14px; background: var(--cream-2); }
.pay-row > span { font-size: .74rem; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; color: var(--flour-faint); }
.pay-row > b { font-size: 1.1rem; overflow-wrap: anywhere; }
.pay-till { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
.pay-till b { font-family: "Archivo", sans-serif; font-size: 1.35rem; letter-spacing: .08em; }
.pay-mini {
  border: 1.5px solid #B40614; background: #fff; color: #B40614; border-radius: 999px;
  padding: 6px 14px; font-weight: 800; font-size: .8rem; cursor: pointer; flex: none;
}
.pay-mini:hover { background: #B40614; color: #fff; }
.pay-btn-ghost {
  padding: 12px 16px; border-radius: 999px; cursor: pointer; font-weight: 800;
  background: #fff; border: 1.5px solid rgba(31,27,24,.2);
}
.pay-btn-ghost:hover { border-color: #B40614; color: #B40614; }
.pay-dial { margin: 0; padding: 12px 14px; border-radius: 14px; border: 1.5px dashed rgba(180,6,20,.45); font-size: .92rem; }
.pay-hint { margin: 0; font-size: .82rem; color: var(--flour-dim); }

.pay-proof { display: grid; gap: 14px; padding-top: 16px; border-top: 1px dashed rgba(31,27,24,.18); }
.pay-proof h4 { margin: 0; font-size: 1.05rem; font-weight: 850; }
.pay-err { font-style: normal; font-size: .8rem; font-weight: 650; color: #B40614; }
.pay-file { position: absolute; width: 1px; height: 1px; opacity: 0; pointer-events: none; }
.pay-drop {
  width: 100%; padding: 22px; border-radius: 16px; cursor: pointer; font-weight: 800;
  background: #fffaf3; border: 2px dashed rgba(180,6,20,.4); color: #B40614;
}
.pay-drop:hover { background: #fff1ee; }
.pay-shot { display: flex; align-items: center; gap: 14px; padding: 10px; border-radius: 16px; background: #fffaf3; border: 1px solid var(--line); }
.pay-shot img { width: 72px; height: 96px; object-fit: cover; border-radius: 10px; flex: none; }
.pay-shot > div { display: grid; gap: 6px; justify-items: start; min-width: 0; }
.pay-shot b { max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: .9rem; }
.pay-shot small { color: var(--flour-dim); font-weight: 700; }
.pay-shot small.ok { color: var(--basil); }

.pay-banner { margin-top: 14px; padding: 14px 16px; border-radius: 16px; display: grid; gap: 4px; }
.pay-banner b { font-size: 1.02rem; }
.pay-banner p { margin: 0; font-size: .92rem; }
.pay-banner small { opacity: .75; font-weight: 700; }
.pay-banner.is-wait { background: #fff4d6; border: 1px solid #f5c542; color: #6b4e00; }
.pay-banner.is-bad { background: #fde8e6; border: 1px solid #f19a94; color: #8d0511; }
.pay-banner.is-ok { background: #e3f6ea; border: 1px solid #8ad3a8; color: #0d6b38; }
.pay-btn-wa {
  justify-self: start; margin-top: 8px; padding: 10px 18px; border-radius: 999px; font-weight: 800;
  background: #25d366; color: #fff; text-decoration: none;
}
.gzp-btn.pay-help { text-decoration: none; margin-top: 16px; }

@media (prefers-reduced-motion: reduce) {
  .v2-rvm-overlay, .v2-rvm { animation: none; }
}
`,Xp="/assets/jazzcash-raast-qr-BZ1REkAo.png",Ji="cod",el="jazzcash",Va={codEnabled:!0,jazzcashEnabled:!0,merchantName:"GEN Z FOOD",tillId:"984661930",dialCode:"*786*10#",qrImage:""},Zp=5*1024*1024,Jp=/^[A-Za-z0-9]{6,30}$/,ef=/^[\p{L}\p{N} .+\-']{3,60}$/u;function tf(){const[s,f]=z.useState(""),[u,k]=z.useState(""),[w,_]=z.useState(""),[q,Y]=z.useState(""),[$,ge]=z.useState(""),[O,T]=z.useState(!1),[B,se]=z.useState(""),ae=z.useRef(0);z.useEffect(()=>()=>q&&URL.revokeObjectURL(q),[q]);const J=z.useCallback(async oe=>{if(!oe)return;if(se(""),!["image/jpeg","image/png"].includes(oe.type)){se("Please choose a JPG or PNG screenshot.");return}if(oe.size>Zp){se("That screenshot is over 5 MB. Please choose a smaller image.");return}const ve=++ae.current;Y(URL.createObjectURL(oe)),ge(oe.name),_(""),T(!0);try{const ye=await Yp(oe);ve===ae.current&&_(ye.data.proofId)}catch(ye){ve===ae.current&&(Y(""),ge(""),se(ye.message))}finally{ve===ae.current&&T(!1)}},[]),F=z.useCallback(()=>{ae.current+=1,Y(""),ge(""),_(""),T(!1),se("")},[]),te=z.useCallback(()=>{f(""),k(""),F()},[F]),xe=Jp.test(s.replace(/\s+/g,"")),Ne=ef.test(u.trim().replace(/\s+/g," "));return{tid:s,setTid:f,sender:u,setSender:k,proofId:w,preview:q,fileName:$,uploading:O,uploadError:B,pickFile:J,clearFile:F,reset:te,tidOk:xe,senderOk:Ne,ready:xe&&Ne&&!!w&&!O}}const rf=async s=>{try{return await navigator.clipboard.writeText(s),!0}catch{try{const f=document.createElement("textarea");f.value=s,f.setAttribute("readonly",""),f.style.cssText="position:fixed;opacity:0;top:0;left:0",document.body.appendChild(f),f.select();const u=document.execCommand("copy");return document.body.removeChild(f),u}catch{return!1}}},nf=({cfg:s,value:f,onChange:u})=>{const k=[s.codEnabled&&{id:Ji,title:"Cash on Delivery",sub:"Pay the rider when it arrives",icon:"💵"},s.jazzcashEnabled&&{id:el,title:"Pay via JazzCash / Raast QR",sub:"Scan, pay & upload the screenshot",icon:"📱"}].filter(Boolean);return i.jsxs("fieldset",{className:"pay-methods",children:[i.jsx("legend",{children:"Payment method"}),k.map(w=>i.jsxs("label",{className:`pay-method${f===w.id?" is-on":""}`,children:[i.jsx("input",{type:"radio",name:"payMethod",value:w.id,checked:f===w.id,onChange:()=>u(w.id)}),i.jsx("span",{className:"pay-ico","aria-hidden":"true",children:w.icon}),i.jsxs("span",{className:"pay-text",children:[i.jsx("b",{children:w.title}),i.jsx("small",{children:w.sub})]}),i.jsx("span",{className:"pay-radio","aria-hidden":"true"})]},w.id))]})},of=({cfg:s,amountLabel:f,jazz:u})=>{const[k,w]=z.useState(!1),[_,q]=z.useState(""),Y=z.useRef(null),$=s.qrImage?Gt(s.qrImage):Xp,ge=async()=>{const T=await rf(s.tillId);w(T),T&&setTimeout(()=>w(!1),2e3)},O=async()=>{q("");try{const T=await fetch($);if(!T.ok)throw new Error("bad response");const B=await T.blob(),se=URL.createObjectURL(B),ae=document.createElement("a");ae.href=se,ae.download=`${s.merchantName.replace(/\s+/g,"-")}-JazzCash-QR.png`,document.body.appendChild(ae),ae.click(),ae.remove(),setTimeout(()=>URL.revokeObjectURL(se),1e3)}catch{window.open($,"_blank","noopener,noreferrer"),q("Opened in a new tab — press and hold the image to save it.")}};return i.jsxs("div",{className:"pay-card",children:[i.jsxs("div",{className:"pay-amount","aria-live":"polite",children:[i.jsx("span",{children:"Amount to pay"}),i.jsx("strong",{children:f}),i.jsx("small",{children:"Send exactly this amount so we can match your payment."})]}),i.jsxs("div",{className:"pay-grid",children:[i.jsxs("div",{className:"pay-qr",children:[i.jsx("img",{src:$,alt:`${s.merchantName} JazzCash and Raast payment QR code`,width:"340",height:"480"}),i.jsx("p",{children:"Scan with JazzCash, Easypaisa or any banking app"})]}),i.jsxs("div",{className:"pay-info",children:[i.jsxs("div",{className:"pay-row",children:[i.jsx("span",{children:"Merchant"}),i.jsx("b",{children:s.merchantName})]}),i.jsxs("div",{className:"pay-row",children:[i.jsx("span",{children:"Till ID"}),i.jsxs("div",{className:"pay-till",children:[i.jsx("b",{children:s.tillId}),i.jsx("button",{type:"button",className:"pay-mini",onClick:ge,children:k?"Copied ✓":"Copy"})]})]}),i.jsx("button",{type:"button",className:"pay-btn-ghost",onClick:O,children:"⬇ Download QR"}),_&&i.jsx("p",{className:"pay-hint",children:_}),i.jsxs("p",{className:"pay-dial",children:["Or dial ",i.jsx("b",{children:s.dialCode})," and enter the Till ID."]})]})]}),i.jsxs("div",{className:"pay-proof",children:[i.jsx("h4",{children:"After paying, add your payment details"}),i.jsxs("label",{className:"gzp-field",children:[i.jsx("span",{children:"Transaction ID (TID)"}),i.jsx("input",{value:u.tid,onChange:T=>u.setTid(T.target.value.replace(/[^A-Za-z0-9 ]/g,"").slice(0,34)),placeholder:"From your payment confirmation SMS / app",autoCapitalize:"characters",autoComplete:"off",required:!0,"aria-invalid":u.tid!==""&&!u.tidOk}),u.tid!==""&&!u.tidOk&&i.jsx("em",{className:"pay-err",children:"TID should be 6–30 letters or digits."})]}),i.jsxs("label",{className:"gzp-field",children:[i.jsx("span",{children:"Sender's name or mobile number"}),i.jsx("input",{value:u.sender,onChange:T=>u.setSender(T.target.value.slice(0,60)),placeholder:"Account holder name or 03001234567",autoComplete:"off",required:!0,"aria-invalid":u.sender!==""&&!u.senderOk}),u.sender!==""&&!u.senderOk&&i.jsx("em",{className:"pay-err",children:"Use 3–60 letters or digits, no special symbols."})]}),i.jsxs("div",{className:"gzp-field",children:[i.jsxs("span",{children:["Payment screenshot ",i.jsx("small",{children:"(JPG or PNG, up to 5 MB)"})]}),i.jsx("input",{ref:Y,type:"file",accept:"image/png,image/jpeg",className:"pay-file",onChange:T=>{var B;u.pickFile((B=T.target.files)==null?void 0:B[0]),T.target.value=""}}),u.preview?i.jsxs("div",{className:"pay-shot",children:[i.jsx("img",{src:u.preview,alt:"Your payment screenshot"}),i.jsxs("div",{children:[i.jsx("b",{children:u.fileName}),i.jsx("small",{className:u.proofId?"ok":"",children:u.uploading?"Uploading…":u.proofId?"Uploaded ✓":""}),i.jsx("button",{type:"button",className:"pay-mini",onClick:()=>{var T;u.clearFile(),(T=Y.current)==null||T.click()},children:"Change"})]})]}):i.jsx("button",{type:"button",className:"pay-drop",onClick:()=>{var T;return(T=Y.current)==null?void 0:T.click()},children:"📷 Choose screenshot"}),u.uploadError&&i.jsx("em",{className:"pay-err",role:"alert",children:u.uploadError})]}),i.jsx("p",{className:"pay-hint",children:"We'll check your payment and confirm your order shortly. Place Order unlocks once all three details are filled."})]})]})},lf=({order:s,whatsappHref:f})=>{const u=s==null?void 0:s.payment;return!u||u.method!=="JazzCash/Raast"?null:s.orderStatus==="Payment Pending Verification"?i.jsxs("div",{className:"pay-banner is-wait",children:[i.jsx("b",{children:"⏳ Payment under verification"}),i.jsx("p",{children:"Thanks! We'll verify your payment and confirm your order shortly. This page updates automatically."}),i.jsxs("small",{children:["TID ",u.tid]})]}):u.status==="Rejected"?i.jsxs("div",{className:"pay-banner is-bad",role:"alert",children:[i.jsx("b",{children:"✖ Payment not verified"}),i.jsx("p",{children:u.rejectionReason||"We couldn't confirm your payment."}),i.jsx("a",{className:"pay-btn-wa",href:f,target:"_blank",rel:"noopener noreferrer",children:"Message us on WhatsApp"})]}):u.status==="Verified"?i.jsxs("div",{className:"pay-banner is-ok",children:[i.jsx("b",{children:"✔ Payment verified"}),i.jsxs("p",{children:["Paid via JazzCash/Raast · TID ",u.tid]})]}):null},Bc={viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:1.8,strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",focusable:"false"},Uc=()=>i.jsx("svg",{viewBox:"0 0 24 24",fill:"currentColor","aria-hidden":"true",focusable:"false",children:i.jsx("path",{d:"M12 2.5l2.9 6.1 6.6.9-4.8 4.6 1.2 6.6L12 17.5l-5.9 3.2 1.2-6.6L2.5 9.5l6.6-.9L12 2.5z"})}),Pc=()=>i.jsxs("svg",{...Bc,children:[i.jsx("path",{d:"M12 20h9"}),i.jsx("path",{d:"M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4L16.5 3.5z"})]}),af=()=>i.jsx("svg",{...Bc,width:"20",height:"20",children:i.jsx("path",{d:"M6 6l12 12M18 6L6 18"})}),Tc=({value:s,label:f})=>i.jsx("span",{className:"v2-stars",role:"img","aria-label":f||`${s} out of 5 stars`,children:[1,2,3,4,5].map(u=>i.jsx("span",{className:u<=Math.round(s)?"":"off",style:{display:"inline-flex"},children:i.jsx(Uc,{})},u))}),Lc=["#E6392F","#d97706","#1a9e56","#2563eb","#7c3aed","#db2777","#0f766e"],sf=(s="")=>{let f=0;for(let u=0;u<s.length;u+=1)f=f*31+s.charCodeAt(u)>>>0;return Lc[f%Lc.length]},uf=s=>{const f=new Date(s).getTime();if(!f)return"";const u=Math.max(0,(Date.now()-f)/1e3);if(u<60)return"just now";const k=u/60;if(k<60)return`${Math.floor(k)} min ago`;const w=k/60;if(w<24)return`${Math.floor(w)} hour${Math.floor(w)===1?"":"s"} ago`;const _=w/24;if(_<30)return`${Math.floor(_)} day${Math.floor(_)===1?"":"s"} ago`;const q=_/30;return q<12?`${Math.floor(q)} month${Math.floor(q)===1?"":"s"} ago`:`${Math.floor(q/12)} year${Math.floor(q/12)===1?"":"s"} ago`},Rc=["","Poor","Fair","Good","Very good","Excellent"],Wc="gzp-reviewer-name",cf=()=>{try{return localStorage.getItem(Wc)||""}catch{return""}},df=s=>{try{localStorage.setItem(Wc,s)}catch{}},pf=({onOrder:s,onTrack:f,summary:u,taxFree:k})=>i.jsx("section",{className:"v2-hero",children:i.jsx("div",{className:"v2-wrap",children:i.jsxs("div",{className:"v2-hero-grid",children:[i.jsxs("div",{children:[i.jsxs("span",{className:"v2-eyebrow",children:[i.jsx("i",{})," Now delivering across Gojra"]}),i.jsxs("h1",{children:["Hot, cheesy & ",i.jsx("em",{children:"delivered"})," to your door."]}),i.jsx("p",{className:"lead",children:"Fresh pizzas, burgers and sides made to order. Build your own deal, pay cash when it arrives, and watch your order move from the kitchen to your doorstep."}),i.jsxs("div",{className:"v2-cta",children:[i.jsx("button",{type:"button",className:"gzp-btn gzp-btn-primary",onClick:s,children:"Order now"}),i.jsx("button",{type:"button",className:"gzp-btn gzp-btn-ghost",onClick:f,children:"Track my order"})]})]}),i.jsxs("div",{className:"v2-stats","aria-label":"Highlights",children:[i.jsxs("div",{className:"v2-stat",children:[i.jsx("b",{children:"Cash"}),i.jsx("span",{children:"on delivery, no account needed"})]}),i.jsxs("div",{className:"v2-stat",children:[i.jsx("b",{children:"Live"}),i.jsx("span",{children:"order tracking, step by step"})]}),i.jsxs("div",{className:"v2-stat",children:[i.jsx("b",{children:"Custom"}),i.jsx("span",{children:"build your own deal"})]}),i.jsxs("div",{className:"v2-stat",children:[i.jsx("b",{children:u!=null&&u.total?`${u.average} ★`:"Fresh"}),i.jsx("span",{children:u!=null&&u.total?`from ${u.total} customer review${u.total===1?"":"s"}`:"made to order, every time"})]})]})]})})}),ff=[{icon:"🍕",title:"Made to order",text:"Every pizza is built fresh when you order — never sitting under a heat lamp."},{icon:"🛵",title:"Hot to your door",text:"Our riders deliver across Gojra, so it arrives the way it left the oven."},{icon:"💳",title:"Pay your way",text:"Cash on delivery, or scan the JazzCash / Raast QR at checkout. No sign-up needed."},{icon:"🧩",title:"Build your own deal",text:"Mix flavours, sizes and sides into a bundle that fits your crowd and budget."}],mf=()=>i.jsxs("section",{className:"v2-section",id:"section-why",children:[i.jsx("span",{className:"v2-kicker",children:"Why GenZ Pizza Land"}),i.jsx("h2",{className:"v2-title",children:"Good food, without the fuss"}),i.jsx("div",{className:"v2-features",children:ff.map(s=>i.jsxs("div",{className:"v2-feature",children:[i.jsx("div",{className:"v2-ico","aria-hidden":"true",children:s.icon}),i.jsx("h3",{children:s.title}),i.jsx("p",{children:s.text})]},s.title))})]}),hf=()=>i.jsxs("section",{className:"v2-how",id:"section-how",children:[i.jsx("span",{className:"v2-kicker",children:"How it works"}),i.jsx("h2",{className:"v2-title",style:{color:"#fff"},children:"Three steps to a full table"}),i.jsx("p",{className:"v2-sub",children:"From first tap to first bite, it takes a couple of minutes."}),i.jsxs("div",{className:"v2-steps",children:[i.jsxs("div",{className:"v2-step",children:[i.jsx("b",{children:"1"}),i.jsx("h3",{children:"Pick your food"}),i.jsx("p",{children:"Browse the menu and deals, choose your size and crust, and add everything to your order."})]}),i.jsxs("div",{className:"v2-step",children:[i.jsx("b",{children:"2"}),i.jsx("h3",{children:"Confirm your details"}),i.jsx("p",{children:"Enter your name, phone and address. No account, no card — just your delivery details."})]}),i.jsxs("div",{className:"v2-step",children:[i.jsx("b",{children:"3"}),i.jsx("h3",{children:"Track & enjoy"}),i.jsx("p",{children:"Follow your order live as the kitchen cooks it, then pay the rider in cash on arrival."})]})]})]}),gf=({value:s,onChange:f})=>{const[u,k]=z.useState(0),w=u||s;return i.jsxs("div",{className:"v2-starpick",role:"radiogroup","aria-label":"Your rating",onMouseLeave:()=>k(0),children:[[1,2,3,4,5].map(_=>i.jsx("button",{type:"button",role:"radio","aria-checked":s===_,"aria-label":`${_} star${_===1?"":"s"} — ${Rc[_]}`,className:_<=w?"on":"",onMouseEnter:()=>k(_),onFocus:()=>k(_),onBlur:()=>k(0),onClick:()=>f(_),children:i.jsx(Uc,{})},_)),i.jsx("span",{className:"lbl",children:Rc[w]||"Tap a star"})]})},vf=({onClose:s,onSubmitted:f})=>{const[u,k]=z.useState(cf),[w,_]=z.useState(0),[q,Y]=z.useState(""),[$,ge]=z.useState(""),[O,T]=z.useState(""),[B,se]=z.useState(""),[ae,J]=z.useState(!1),[F,te]=z.useState(""),[xe,Ne]=z.useState(!1);z.useEffect(()=>{const oe=ye=>ye.key==="Escape"&&s();window.addEventListener("keydown",oe);const ve=document.body.style.overflow;return document.body.style.overflow="hidden",()=>{window.removeEventListener("keydown",oe),document.body.style.overflow=ve}},[s]);const he=async oe=>{if(oe.preventDefault(),!ae){if(!u.trim())return te("Please enter your name.");if(!w)return te("Please choose a star rating.");if(O.trim().length<10)return te("Please write at least a few words about your experience.");te(""),J(!0);try{const ve=await Vp({name:u,rating:w,dish:q,title:$,comment:O,website:B});df(u.trim()),Ne(!0),f(ve==null?void 0:ve.data)}catch(ve){te(ve.message||"Could not send your review. Please try again.")}finally{J(!1)}}};return i.jsx("div",{className:"v2-rvm-overlay",onMouseDown:oe=>oe.target===oe.currentTarget&&s(),role:"presentation",children:i.jsx("div",{className:"v2-rvm",role:"dialog","aria-modal":"true","aria-label":"Write a review",children:xe?i.jsxs("div",{className:"v2-thanks",children:[i.jsx("div",{className:"big","aria-hidden":"true",children:"🎉"}),i.jsx("h3",{children:"Thank you!"}),i.jsx("p",{children:"Your review is live. It really helps other hungry people in Gojra."}),i.jsx("button",{type:"button",className:"gzp-btn gzp-btn-primary gzp-btn-block",onClick:s,children:"Done"})]}):i.jsxs(i.Fragment,{children:[i.jsxs("div",{className:"v2-rvm-head",children:[i.jsxs("div",{children:[i.jsx("h3",{children:"Write a review"}),i.jsx("p",{children:"Tell us how we did — it only takes a minute."})]}),i.jsx("button",{type:"button",className:"gzp-icon-btn",onClick:s,"aria-label":"Close",children:i.jsx(af,{})})]}),i.jsxs("form",{className:"v2-rvm-form",onSubmit:he,noValidate:!0,children:[i.jsxs("div",{children:[i.jsx("div",{style:{fontWeight:700,fontSize:".86rem",marginBottom:6},children:"Your rating"}),i.jsx(gf,{value:w,onChange:_})]}),i.jsxs("label",{className:"f",children:[i.jsx("span",{children:"Your name"}),i.jsx("input",{type:"text",value:u,maxLength:60,autoComplete:"name",placeholder:"e.g. Ayesha K.",onChange:oe=>k(oe.target.value)})]}),i.jsxs("label",{className:"f",children:[i.jsxs("span",{children:["What did you order? ",i.jsx("small",{children:"(optional)"})]}),i.jsx("input",{type:"text",value:q,maxLength:80,placeholder:"e.g. Fajita pizza",onChange:oe=>Y(oe.target.value)})]}),i.jsxs("label",{className:"f",children:[i.jsxs("span",{children:["Headline ",i.jsx("small",{children:"(optional)"})]}),i.jsx("input",{type:"text",value:$,maxLength:100,placeholder:"Sum it up in a few words",onChange:oe=>ge(oe.target.value)})]}),i.jsxs("label",{className:"f",children:[i.jsx("span",{children:"Your review"}),i.jsx("textarea",{value:O,maxLength:1200,placeholder:"How was the food, the delivery, the service?",onChange:oe=>T(oe.target.value)}),i.jsxs("span",{className:"v2-count",children:[O.length,"/1200"]})]}),i.jsx("input",{className:"v2-hp",type:"text",tabIndex:-1,autoComplete:"off","aria-hidden":"true",value:B,onChange:oe=>se(oe.target.value)}),F&&i.jsx("p",{className:"v2-form-error",role:"alert",children:F}),i.jsxs("div",{className:"v2-rvm-actions",children:[i.jsx("button",{type:"button",className:"gzp-btn gzp-btn-ghost",onClick:s,children:"Cancel"}),i.jsx("button",{type:"submit",className:"gzp-btn gzp-btn-primary",disabled:ae,children:ae?"Sending…":"Post review"})]})]})]})})})},xf=({onSummary:s})=>{const[f,u]=z.useState([]),[k,w]=z.useState({total:0,average:0,distribution:{}}),[_,q]=z.useState(!0),[Y,$]=z.useState(""),[ge,O]=z.useState(!1),[T,B]=z.useState(6),se=z.useCallback(async()=>{var F,te;try{const xe=await Qp(60);u(((F=xe.data)==null?void 0:F.reviews)||[]),w(((te=xe.data)==null?void 0:te.summary)||{total:0,average:0,distribution:{}}),$("")}catch(xe){$(xe.message||"Could not load reviews.")}finally{q(!1)}},[]);z.useEffect(()=>{se()},[se]),z.useEffect(()=>{s==null||s(k)},[k,s]);const ae=z.useMemo(()=>[5,4,3,2,1].map(F=>{var xe;const te=((xe=k.distribution)==null?void 0:xe[F])||0;return{n:F,count:te,pct:k.total?Math.round(te/k.total*100):0}}),[k]),J=()=>O(!0);return i.jsxs("section",{className:"v2-section",id:"section-reviews",children:[i.jsxs("div",{className:"v2-reviews-head",children:[i.jsxs("div",{children:[i.jsx("span",{className:"v2-kicker",children:"Reviews"}),i.jsx("h2",{className:"v2-title",children:"What Gojra is saying"})]}),i.jsxs("button",{type:"button",className:"v2-write inline",onClick:J,children:[i.jsx(Pc,{})," Write a Review"]})]}),i.jsxs("div",{className:"v2-rv-layout",children:[i.jsxs("aside",{className:"v2-rv-summary","aria-label":"Rating summary",children:[i.jsxs("div",{className:"v2-rv-score",children:[i.jsx("b",{children:k.total?k.average.toFixed(1):"–"}),i.jsxs("div",{children:[i.jsx(Tc,{value:k.average}),i.jsx("small",{children:k.total?`${k.total} review${k.total===1?"":"s"}`:"No reviews yet"})]})]}),i.jsx("div",{className:"v2-bars",children:ae.map(F=>i.jsxs("div",{className:"v2-bar",children:[i.jsxs("span",{children:[F.n,"★"]}),i.jsx("i",{children:i.jsx("span",{style:{width:`${F.pct}%`}})}),i.jsx("em",{children:F.count})]},F.n))}),i.jsxs("button",{type:"button",className:"v2-write",onClick:J,children:[i.jsx(Pc,{})," Write a Review"]})]}),i.jsxs("div",{children:[i.jsxs("div",{className:"v2-rv-list",children:[_&&i.jsx("div",{className:"v2-rv-empty",children:"Loading reviews…"}),!_&&Y&&f.length===0&&i.jsxs("div",{className:"v2-rv-empty",children:[i.jsx("b",{children:"Couldn't load reviews"}),Y,i.jsx("div",{style:{marginTop:14},children:i.jsx("button",{type:"button",className:"gzp-btn gzp-btn-ghost",onClick:()=>{q(!0),se()},children:"Try again"})})]}),!_&&!Y&&f.length===0&&i.jsxs("div",{className:"v2-rv-empty",children:[i.jsx("span",{"aria-hidden":"true",style:{fontSize:"2rem"},children:"⭐"}),i.jsx("b",{children:"Be the first to review"}),"Ate with us? Tell others what you thought."]}),f.slice(0,T).map(F=>i.jsxs("article",{className:"v2-rv",children:[i.jsxs("div",{className:"v2-rv-top",children:[i.jsx("div",{className:"v2-avatar",style:{background:sf(F.name)},"aria-hidden":"true",children:(F.name||"?").trim().charAt(0).toUpperCase()}),i.jsxs("div",{children:[i.jsx("strong",{children:F.name}),i.jsx("span",{children:uf(F.createdAt)})]})]}),i.jsx(Tc,{value:F.rating}),F.title&&i.jsx("h4",{children:F.title}),i.jsx("p",{children:F.comment}),F.dish&&i.jsxs("span",{className:"v2-rv-dish",children:["🍽 ",F.dish]})]},F._id))]}),f.length>T&&i.jsx("button",{type:"button",className:"gzp-btn gzp-btn-ghost v2-more",onClick:()=>B(F=>F+6),children:"Show more reviews"})]})]}),ge&&i.jsx(vf,{onClose:()=>O(!1),onSubmitted:()=>{se()}})]})},yf=({whatsappLink:s,onTrack:f})=>i.jsxs("section",{className:"v2-contact",id:"section-contact",children:[i.jsxs("div",{className:"v2-panel warm",children:[i.jsx("span",{className:"v2-kicker",children:"Questions?"}),i.jsx("h2",{className:"v2-title",style:{color:"#fff"},children:"Talk to us on WhatsApp"}),i.jsx("p",{className:"v2-sub",children:"Special requests, party orders or a question about your delivery — message the shop directly."}),i.jsx("a",{className:"gzp-btn",href:s,target:"_blank",rel:"noopener noreferrer",children:"Chat on WhatsApp"})]}),i.jsxs("div",{className:"v2-panel",children:[i.jsx("span",{className:"v2-kicker",children:"Good to know"}),i.jsxs("ul",{className:"v2-facts",children:[i.jsxs("li",{children:[i.jsx("span",{"aria-hidden":"true",children:"📍"})," Delivering across Gojra"]}),i.jsxs("li",{children:[i.jsx("span",{"aria-hidden":"true",children:"💵"})," Cash on delivery or JazzCash / Raast QR"]}),i.jsxs("li",{children:[i.jsx("span",{"aria-hidden":"true",children:"⏱"})," Live order tracking from the kitchen to your door"]})]}),i.jsx("button",{type:"button",className:"gzp-btn gzp-btn-ghost",onClick:f,children:"Track an order"})]})]}),wf=({taxRatePercent:s,onNavigate:f,onTrack:u})=>i.jsx("footer",{className:"v2-footer",children:i.jsxs("div",{className:"v2-wrap",children:[i.jsxs("div",{className:"v2-footer-grid",children:[i.jsxs("div",{children:[i.jsxs("div",{className:"brand",children:[i.jsx("img",{src:ro,alt:""})," GenZ Pizza Land"]}),i.jsxs("p",{children:["Fresh pizzas, burgers and sides, delivered hot across Gojra. Prices are in rupees;"," ",s,"% tax is added at checkout. Pay cash on delivery or by JazzCash / Raast QR."]})]}),i.jsxs("div",{children:[i.jsx("h4",{children:"Explore"}),i.jsxs("ul",{children:[i.jsx("li",{children:i.jsx("button",{type:"button",onClick:()=>f("menu"),children:"Menu"})}),i.jsx("li",{children:i.jsx("button",{type:"button",onClick:()=>f("deals"),children:"Deals"})}),i.jsx("li",{children:i.jsx("button",{type:"button",onClick:()=>f("reviews"),children:"Reviews"})})]})]}),i.jsxs("div",{children:[i.jsx("h4",{children:"Help"}),i.jsxs("ul",{children:[i.jsx("li",{children:i.jsx("button",{type:"button",onClick:u,children:"Track an order"})}),i.jsx("li",{children:i.jsx("button",{type:"button",onClick:()=>f("how"),children:"How it works"})}),i.jsx("li",{children:i.jsx("button",{type:"button",onClick:()=>f("contact"),children:"Contact us"})})]})]})]}),i.jsxs("div",{className:"v2-footer-bottom",children:[i.jsxs("span",{children:["© ",new Date().getFullYear()," GenZ Pizza Land. All rights reserved."]}),i.jsxs("span",{className:"credit",children:["Developed by ",i.jsx("img",{src:Gp,alt:""})," ",i.jsx("strong",{children:"Sindbad Solution"})]})]})]})}),to={enabled:!0,minItems:3,discount3:15,discount4:17,discount5Plus:20,description:"Pick any 3 or more items from our menu — pizzas, burgers, wings, drinks, anything. The more you add, the more you save. No codes, the discount applies automatically."},Ya=s=>{const f=(k,w)=>typeof k=="number"&&!Number.isNaN(k)?k:w,u=s&&typeof s=="object"?s:{};return{enabled:typeof u.enabled=="boolean"?u.enabled:to.enabled,minItems:Math.max(1,Math.round(f(u.minItems,to.minItems))),discount3:f(u.discount3,to.discount3),discount4:f(u.discount4,to.discount4),discount5Plus:f(u.discount5Plus,to.discount5Plus),description:typeof u.description=="string"?u.description:to.description}},il=(s,f)=>!f.enabled||s<f.minItems?0:s>=5?f.discount5Plus:s===4?f.discount4:f.discount3,Et=s=>`${Number.isInteger(s)?s:Number(s.toFixed(1))}%`,tl=s=>{const f=Number(s)||0;return`Rs ${f.toLocaleString("en-PK",{minimumFractionDigits:Number.isInteger(f)?0:2,maximumFractionDigits:2})}`},Hc=(s,f)=>{const u=f.minItems-s;if(s===0)return`Pick ${f.minItems} items to unlock ${Et(f.discount3)} off`;if(u>0)return`Add ${u} more item${u===1?"":"s"} to unlock ${Et(f.discount3)} off`;const k=il(s,f),w=s>=5?null:s+1,_=w?il(w,f):null;return _&&_>k?`${Et(k)} off unlocked — add 1 more item for ${Et(_)} off`:s>=5?`Best discount unlocked — ${Et(k)} off your picks`:`${Et(k)} off unlocked`},bf=`
/* ===== Build Your Own Deal ===== */

.gzp-byo-section {
  padding-top: 30px;
}

.gzp-byo-banner {
  position: relative;
  overflow: hidden;
  display: grid;
  gap: 18px;
  padding: 22px 20px;
  border-radius: var(--r-xl);
  border: 1px solid rgba(230, 57, 47, 0.35);
  background:
    radial-gradient(520px 220px at 100% 0%, rgba(255, 200, 61, 0.2), transparent 65%),
    radial-gradient(420px 220px at 0% 100%, rgba(230, 57, 47, 0.08), transparent 65%),
    linear-gradient(135deg, #fff8ef, rgba(255, 248, 239, 0.9));
  box-shadow: 0 24px 60px -28px rgba(37, 37, 37, 0.2);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

@media (min-width: 820px) {
  .gzp-byo-banner {
    grid-template-columns: 1.25fr 1fr;
    align-items: center;
    padding: 30px 34px;
    gap: 30px;
  }
}

.gzp-byo-banner::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(115deg, transparent 35%, rgba(255, 255, 255, 0.07) 50%, transparent 65%);
  transform: translateX(-120%);
  animation: gzp-byo-sheen 5.5s ease-in-out infinite;
  pointer-events: none;
}

@keyframes gzp-byo-sheen {
  0%, 55% { transform: translateX(-120%); }
  100% { transform: translateX(120%); }
}

.gzp-byo-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 5px 12px;
  border-radius: var(--r-pill);
  background: var(--ember);
  border: 1px solid var(--ember-deep);
  color: #fff;
  font-weight: 800;
  font-size: 0.72rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.gzp-byo-banner h2 {
  margin: 12px 0 8px;
  font-family: "Archivo", system-ui, sans-serif;
  font-size: clamp(1.55rem, 4.2vw, 2.3rem);
  line-height: 1.08;
  letter-spacing: -0.02em;
}

.gzp-byo-banner h2 em {
  font-style: normal;
  background: var(--heat);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.gzp-byo-banner p {
  margin: 0 0 16px;
  color: var(--flour-dim);
  max-width: 46ch;
  line-height: 1.5;
}

.gzp-byo-tiers {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  position: relative;
  z-index: 1;
}

.gzp-byo-tier {
  text-align: center;
  padding: 14px 8px;
  border-radius: var(--r-lg);
  background: rgba(255, 255, 255, 0.5);
  border: 1px solid var(--line);
  transition: transform 0.2s ease, border-color 0.2s ease;
}

.gzp-byo-tier:hover {
  transform: translateY(-3px);
  border-color: rgba(230, 57, 47, 0.45);
}

.gzp-byo-tier b {
  display: block;
  font-family: "Archivo", system-ui, sans-serif;
  font-size: clamp(1.4rem, 4vw, 1.9rem);
  line-height: 1;
  background: var(--heat);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.gzp-byo-tier small {
  display: block;
  margin-top: 4px;
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--flour-dim);
}

.gzp-byo-tier span {
  display: block;
  margin-top: 8px;
  font-size: 0.82rem;
  font-weight: 700;
}

.gzp-byo-tier.is-best {
  border-color: rgba(230, 57, 47, 0.45);
  background: rgba(230, 57, 47, 0.06);
}

/* ---- builder (full-screen) ---- */

.gzp-byo-overlay {
  position: fixed;
  inset: 0;
  z-index: 95;
  background: rgba(7, 8, 10, 0.78);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  display: flex;
  align-items: stretch;
  justify-content: center;
  animation: gzp-fade 0.18s ease;
}

.gzp-byo-panel {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 1080px;
  height: 100%;
  background: #FFF8EF;
  border: 1px solid var(--line);
  box-shadow: var(--shadow-float);
  animation: gzp-sheet-up 0.26s cubic-bezier(0.2, 0.8, 0.3, 1);
}

@media (min-width: 900px) {
  .gzp-byo-overlay {
    padding: 24px;
  }
  .gzp-byo-panel {
    border-radius: var(--r-xl);
    overflow: hidden;
  }
}

.gzp-byo-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding: 16px 18px 12px;
  border-bottom: 1px solid var(--line);
}

.gzp-byo-head h2 {
  margin: 0;
  font-family: "Archivo", system-ui, sans-serif;
  font-size: 1.35rem;
  letter-spacing: -0.01em;
}

.gzp-byo-head p {
  margin: 4px 0 0;
  font-size: 0.86rem;
  color: var(--flour-dim);
}

.gzp-byo-progress {
  padding: 14px 18px 12px;
  border-bottom: 1px solid var(--line);
  background: linear-gradient(180deg, rgba(230, 57, 47, 0.06), transparent);
}

.gzp-byo-track {
  position: relative;
  height: 10px;
  border-radius: var(--r-pill);
  background: rgba(37, 37, 37, 0.16);
  margin: 6px 6px 26px;
}

.gzp-byo-fill {
  position: absolute;
  inset: 0 auto 0 0;
  border-radius: var(--r-pill);
  background: var(--heat);
  box-shadow: 0 0 14px rgba(230, 57, 47, 0.4);
  transition: width 0.35s cubic-bezier(0.2, 0.8, 0.3, 1);
}

.gzp-byo-mark {
  position: absolute;
  top: 50%;
  width: 24px;
  height: 24px;
  margin: -12px 0 0 -12px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  font-size: 0.7rem;
  font-weight: 800;
  background: #FFF8EF;
  border: 2px solid rgba(37, 37, 37, 0.28);
  color: var(--flour-dim);
  transition: all 0.25s ease;
}

.gzp-byo-mark.is-hit {
  background: var(--ember);
  border-color: #ffffff;
  color: #ffffff;
  transform: scale(1.12);
}

.gzp-byo-mark span {
  position: absolute;
  top: 28px;
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
  font-size: 0.7rem;
  font-weight: 800;
  color: var(--flour-dim);
}

.gzp-byo-mark.is-hit span {
  color: var(--gold);
}

.gzp-byo-nudge {
  margin: 0;
  text-align: center;
  font-weight: 700;
  font-size: 0.92rem;
}

.gzp-byo-nudge.is-ok {
  color: var(--gold);
}

.gzp-byo-cats {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding: 12px 18px;
  scrollbar-width: none;
  border-bottom: 1px solid var(--line);
}

.gzp-byo-cats::-webkit-scrollbar {
  display: none;
}

.gzp-byo-cat {
  flex: none;
  padding: 8px 16px;
  border-radius: var(--r-pill);
  border: 1px solid var(--line);
  background: transparent;
  color: var(--flour-dim);
  font: inherit;
  font-weight: 700;
  font-size: 0.86rem;
  cursor: pointer;
  transition: all 0.18s ease;
}

.gzp-byo-cat:hover {
  color: var(--flour);
  border-color: rgba(37, 37, 37, 0.32);
}

.gzp-byo-cat.is-active {
  background: var(--heat);
  border-color: transparent;
  color: #ffffff;
}

.gzp-byo-body {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 14px 18px 20px;
  overscroll-behavior: contain;
}

.gzp-byo-group h3 {
  margin: 16px 0 10px;
  font-family: "Archivo", system-ui, sans-serif;
  font-size: 1.05rem;
}

.gzp-byo-group:first-child h3 {
  margin-top: 4px;
}

.gzp-byo-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

@media (min-width: 720px) {
  .gzp-byo-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (min-width: 980px) {
  .gzp-byo-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

.gzp-byo-tile {
  display: flex;
  flex-direction: column;
  border-radius: var(--r-lg);
  border: 1px solid var(--line);
  background: rgba(255, 255, 255, 0.6);
  overflow: hidden;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
}

.gzp-byo-tile.is-picked {
  border-color: rgba(230, 57, 47, 0.6);
  box-shadow: 0 0 0 1px rgba(230, 57, 47, 0.25), 0 14px 34px -16px rgba(230, 57, 47, 0.35);
}

.gzp-byo-tile-media {
  position: relative;
  aspect-ratio: 4 / 3;
  background: var(--ink-900);
  display: grid;
  place-items: center;
  font-size: 2.2rem;
}

.gzp-byo-tile-media img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.gzp-byo-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  min-width: 26px;
  height: 26px;
  padding: 0 8px;
  border-radius: var(--r-pill);
  display: grid;
  place-items: center;
  background: var(--ember);
  color: #ffffff;
  font-weight: 800;
  font-size: 0.8rem;
  box-shadow: 0 6px 16px -6px rgba(230, 57, 47, 0.55);
  animation: gzp-byo-pop 0.25s ease;
}

@keyframes gzp-byo-pop {
  from { transform: scale(0.4); }
  to { transform: scale(1); }
}

.gzp-byo-tile-body {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 10px 10px 12px;
  flex: 1;
}

.gzp-byo-tile-body h4 {
  margin: 0;
  font-size: 0.92rem;
  line-height: 1.25;
}

.gzp-byo-price {
  font-weight: 800;
  color: var(--gold);
  font-size: 0.92rem;
}

.gzp-byo-price small {
  font-weight: 600;
  color: var(--flour-faint);
  margin-right: 4px;
  font-size: 0.7rem;
  text-transform: uppercase;
}

.gzp-byo-selects {
  display: grid;
  gap: 6px;
}

.gzp-byo-tile-foot {
  margin-top: auto;
  padding-top: 4px;
}

.gzp-byo-add {
  width: 100%;
  padding: 9px 10px;
  border-radius: var(--r-md);
  border: 1px solid rgba(230, 57, 47, 0.4);
  background: rgba(230, 57, 47, 0.06);
  color: var(--ember);
  font: inherit;
  font-weight: 800;
  font-size: 0.86rem;
  cursor: pointer;
  transition: background 0.18s ease, color 0.18s ease;
}

.gzp-byo-add:hover:not(:disabled) {
  background: var(--ember);
  color: #ffffff;
}

.gzp-byo-add:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.gzp-byo-foot {
  padding: 12px 18px calc(12px + env(safe-area-inset-bottom, 0px));
  border-top: 1px solid var(--line);
  background: rgba(255, 243, 218, 0.97);
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
}

.gzp-byo-sum {
  flex: 1 1 200px;
  min-width: 0;
}

.gzp-byo-sum small {
  display: block;
  color: var(--flour-dim);
  font-size: 0.78rem;
  font-weight: 700;
}

.gzp-byo-sum b {
  font-family: "Archivo", system-ui, sans-serif;
  font-size: 1.3rem;
}

.gzp-byo-sum s {
  margin-left: 8px;
  color: var(--flour-faint);
  font-size: 0.9rem;
}

.gzp-byo-sum em {
  display: inline-block;
  margin-left: 8px;
  padding: 2px 9px;
  border-radius: var(--r-pill);
  background: rgba(26, 158, 86, 0.18);
  color: #137a43;
  font-style: normal;
  font-size: 0.74rem;
  font-weight: 800;
}

.gzp-byo-foot .gzp-btn {
  flex: 0 1 260px;
  min-width: 190px;
}

@media (max-width: 520px) {
  .gzp-byo-foot .gzp-btn {
    flex: 1 1 100%;
  }
}

/* ---- cart group ---- */

.gzp-byo-cart {
  margin: 4px 0 14px;
  padding: 12px;
  border-radius: var(--r-lg);
  border: 1px solid rgba(230, 57, 47, 0.4);
  background: linear-gradient(135deg, rgba(230, 57, 47, 0.08), rgba(255, 255, 255, 0.02));
}

.gzp-byo-cart-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 4px;
}

.gzp-byo-cart-head h4 {
  margin: 0;
  font-size: 0.98rem;
}

.gzp-byo-cart-head button {
  background: none;
  border: none;
  color: var(--gold);
  font: inherit;
  font-weight: 800;
  font-size: 0.84rem;
  cursor: pointer;
  text-decoration: underline;
  text-underline-offset: 3px;
}

.gzp-byo-cart-note {
  margin: 4px 0 6px;
  font-size: 0.82rem;
  font-weight: 700;
  color: #137a43;
}

.gzp-byo-cart-note.is-warn {
  color: var(--gold);
}

.gzp-byo-cart-saving {
  margin: 8px 0 0;
  font-size: 0.82rem;
  color: var(--flour-dim);
}

.gzp-byo-cart-saving b {
  color: #137a43;
}

.gzp-totals .is-discount span {
  color: #137a43;
  font-weight: 700;
}

.gzp-byo-warn {
  margin: 0 0 10px;
  padding: 10px 12px;
  border-radius: var(--r-md);
  background: rgba(230, 57, 47, 0.08);
  border: 1px solid rgba(230, 57, 47, 0.4);
  color: var(--gold);
  font-size: 0.86rem;
  font-weight: 700;
}

@media (prefers-reduced-motion: reduce) {
  .gzp-byo-banner::after,
  .gzp-byo-badge {
    animation: none;
  }
  .gzp-byo-fill {
    transition: none;
  }
}
`,zf=({cfg:s,pickedCount:f,onStart:u})=>i.jsx("section",{className:"gzp-byo-section","aria-label":"Build your own deal",children:i.jsx("div",{className:"gzp-shell",children:i.jsxs("div",{className:"gzp-byo-banner",children:[i.jsxs("div",{style:{position:"relative",zIndex:1},children:[i.jsx("span",{className:"gzp-byo-eyebrow",children:"🎯 Make it yours"}),i.jsxs("h2",{children:["Build your ",i.jsx("em",{children:"own deal"})]}),s.description&&i.jsx("p",{children:s.description}),i.jsx("button",{type:"button",className:"gzp-btn gzp-btn-primary",onClick:u,children:f>0?`Edit your deal (${f} item${f===1?"":"s"})`:"Start building"})]}),i.jsxs("div",{className:"gzp-byo-tiers",children:[i.jsxs("div",{className:"gzp-byo-tier",children:[i.jsx("b",{children:Et(s.discount3)}),i.jsx("small",{children:"off"}),i.jsxs("span",{children:[s.minItems," items"]})]}),i.jsxs("div",{className:"gzp-byo-tier",children:[i.jsx("b",{children:Et(s.discount4)}),i.jsx("small",{children:"off"}),i.jsx("span",{children:"4 items"})]}),i.jsxs("div",{className:"gzp-byo-tier is-best",children:[i.jsx("b",{children:Et(s.discount5Plus)}),i.jsx("small",{children:"off"}),i.jsx("span",{children:"5+ items"})]})]})]})})}),kf=s=>{const f=[];return((s==null?void 0:s.variants)||[]).forEach(u=>{u.size&&!f.includes(u.size)&&f.push(u.size)}),f},jf=(s,f)=>{const u=[];return((s==null?void 0:s.variants)||[]).forEach(k=>{k.size===f&&k.crust&&!u.includes(k.crust)&&u.push(k.crust)}),u},Qc=(s,f,u)=>((s==null?void 0:s.variants)||[]).find(k=>k.size===f&&(k.crust||"")===(u||""))||null,Vc=(s,f="",u="")=>`${s}:${f||""}||${u||""}`,Sf=({dish:s,picks:f,dishQty:u,stockLeft:k,onAdd:w,onRemove:_})=>{const q=z.useMemo(()=>kf(s),[s]),Y=q.length>0,[$,ge]=z.useState(q[0]||""),O=z.useMemo(()=>jf(s,$),[s,$]),[T,B]=z.useState(O[0]||""),[se,ae]=z.useState(!1);z.useEffect(()=>{O.length>0&&!O.includes(T)?B(O[0]):O.length===0&&T!==""&&B("")},[$]);const J=Y?Qc(s,$,T):null,F=Y?(s.variants||[]).reduce((re,He)=>re===null||He.price<re.price?He:re,null):null,te=Y?(J==null?void 0:J.price)??(F==null?void 0:F.price)??s.price:s.price,xe=Vc(s._id,$,T),Ne=f[xe]||0,he=u,oe=typeof s.availableQty=="number"&&k<=0&&he===0,ve=typeof s.availableQty=="number"&&k<=0,ye=(!Y||!!J)&&!ve,Ce=Gt(s.image);return i.jsxs("div",{className:`gzp-byo-tile${he>0?" is-picked":""}`,children:[i.jsxs("div",{className:"gzp-byo-tile-media",children:[Ce&&!se?i.jsx("img",{src:Ce,alt:s.name,loading:"lazy",onError:()=>ae(!0)}):i.jsx("span",{"aria-hidden":"true",children:s.icon||"🍽️"}),he>0&&i.jsxs("span",{className:"gzp-byo-badge",children:["×",he]})]}),i.jsxs("div",{className:"gzp-byo-tile-body",children:[i.jsx("h4",{children:s.name}),i.jsxs("div",{className:"gzp-byo-price",children:[Y&&i.jsx("small",{children:"From"}),tl(te)]}),Y&&i.jsxs("div",{className:"gzp-byo-selects",children:[i.jsx("select",{className:"gzp-select",value:$,onChange:re=>ge(re.target.value),"aria-label":`Size for ${s.name}`,children:q.map(re=>i.jsx("option",{value:re,children:re},re))}),O.length>0&&i.jsx("select",{className:"gzp-select",value:T,onChange:re=>B(re.target.value),"aria-label":`Crust for ${s.name}`,children:O.map(re=>i.jsx("option",{value:re,children:re},re))})]}),i.jsx("div",{className:"gzp-byo-tile-foot",children:Ne>0?i.jsxs("div",{className:"gzp-stepper",style:{width:"100%",justifyContent:"space-between"},children:[i.jsx("button",{type:"button",onClick:()=>_(xe),"aria-label":`Remove one ${s.name}`,children:"−"}),i.jsx("span",{"aria-live":"polite",children:Ne}),i.jsx("button",{type:"button",disabled:!ye,onClick:()=>w(s,$,T),"aria-label":`Add one more ${s.name}`,children:"+"})]}):i.jsx("button",{type:"button",className:"gzp-byo-add",disabled:!ye,onClick:()=>w(s,$,T),children:oe?"Sold out":"+ Add"})})]})]})},Nf=({cfg:s,dishes:f,categories:u,initialPicks:k,getOtherQty:w,onClose:_,onConfirm:q})=>{const[Y,$]=z.useState(()=>({...k||{}})),[ge,O]=z.useState("all");z.useEffect(()=>{const I=document.body.style.overflow;document.body.style.overflow="hidden";const ne=S=>S.key==="Escape"&&_();return window.addEventListener("keydown",ne),()=>{document.body.style.overflow=I,window.removeEventListener("keydown",ne)}},[_]);const T=z.useMemo(()=>{const I={};return f.forEach(ne=>{I[ne._id]=ne}),I},[f]),B=z.useMemo(()=>{const I=new Map;f.forEach(ce=>{var L;const me=((L=ce.category)==null?void 0:L._id)||ce.category||"other";I.has(me)||I.set(me,[]),I.get(me).push(ce)});const ne=u.filter(ce=>(I.get(ce._id)||[]).length>0).map(ce=>({id:ce._id,name:ce.name,items:I.get(ce._id)})),S=new Set(u.map(ce=>ce._id)),A=f.filter(ce=>{var me;return!S.has(((me=ce.category)==null?void 0:me._id)||ce.category)});return A.length&&ne.push({id:"other",name:"More to eat",items:A}),ne},[f,u]),se=I=>Object.entries(Y).reduce((ne,[S,A])=>S.startsWith(`${I}:`)?ne+A:ne,0),ae=I=>typeof I.availableQty=="number"?I.availableQty-se(I._id)-(w?w(I._id):0):1/0,J=(I,ne,S)=>{if(ae(I)<=0)return;const A=Vc(I._id,ne,S);$(ce=>({...ce,[A]:(ce[A]||0)+1}))},F=I=>$(ne=>{const S={...ne,[I]:Math.max(0,(ne[I]||0)-1)};return S[I]===0&&delete S[I],S}),{count:te,gross:xe}=z.useMemo(()=>{let I=0,ne=0;return Object.entries(Y).forEach(([S,A])=>{const[ce,me="||"]=S.split(/:(.+)/),L=T[ce];if(!L)return;const[W,D]=me.split("||"),h=W?Qc(L,W,D):null;I+=A,ne+=(h?h.price:L.price)*A}),{count:I,gross:ne}},[Y,T]),Ne=il(te,s),he=Math.round(xe*Ne/100),oe=xe-he,ve=te>=s.minItems,ye=[{n:s.minItems,label:Et(s.discount3)},{n:4,label:Et(s.discount4)},{n:5,label:Et(s.discount5Plus)}].filter((I,ne,S)=>ne===0||I.n>S[ne-1].n),Ce=ye[ye.length-1].n,re=I=>`${I/Ce*100}%`,He=`${Math.min(te,Ce)/Ce*100}%`,Le=ge==="all"?B:B.filter(I=>I.id===ge);return i.jsx("div",{className:"gzp-byo-overlay",onClick:_,children:i.jsxs("div",{className:"gzp-byo-panel",onClick:I=>I.stopPropagation(),role:"dialog","aria-modal":"true","aria-label":"Build your own deal",children:[i.jsxs("div",{className:"gzp-byo-head",children:[i.jsxs("div",{children:[i.jsx("h2",{children:"🎯 Build your own deal"}),i.jsxs("p",{children:["Choose at least ",s.minItems," items — your discount grows with every item."]})]}),i.jsx("button",{className:"gzp-icon-btn",type:"button",onClick:_,"aria-label":"Close",children:"✕"})]}),i.jsxs("div",{className:"gzp-byo-progress",children:[i.jsxs("div",{className:"gzp-byo-track",role:"progressbar","aria-valuemin":0,"aria-valuemax":Ce,"aria-valuenow":Math.min(te,Ce),children:[i.jsx("div",{className:"gzp-byo-fill",style:{width:He}}),ye.map(I=>i.jsxs("div",{className:`gzp-byo-mark${te>=I.n?" is-hit":""}`,style:{left:re(I.n)},children:[I.n===Ce&&I.n>=5?`${I.n}+`:I.n,i.jsxs("span",{children:[I.label," off"]})]},I.n))]}),i.jsx("p",{className:`gzp-byo-nudge${ve?" is-ok":""}`,children:Hc(te,s)})]}),i.jsxs("div",{className:"gzp-byo-cats",role:"tablist","aria-label":"Menu categories",children:[i.jsx("button",{type:"button",className:`gzp-byo-cat${ge==="all"?" is-active":""}`,onClick:()=>O("all"),children:"All"}),B.map(I=>i.jsx("button",{type:"button",className:`gzp-byo-cat${ge===I.id?" is-active":""}`,onClick:()=>O(I.id),children:I.name},I.id))]}),i.jsx("div",{className:"gzp-byo-body",children:Le.map(I=>i.jsxs("div",{className:"gzp-byo-group",children:[i.jsx("h3",{children:I.name}),i.jsx("div",{className:"gzp-byo-grid",children:I.items.map(ne=>i.jsx(Sf,{dish:ne,picks:Y,dishQty:se(ne._id),stockLeft:ae(ne),onAdd:J,onRemove:F},ne._id))})]},I.id))}),i.jsxs("div",{className:"gzp-byo-foot",children:[i.jsxs("div",{className:"gzp-byo-sum",children:[i.jsxs("small",{children:[te," item",te===1?"":"s"," picked"]}),i.jsxs("div",{children:[i.jsx("b",{children:tl(oe)}),he>0&&i.jsx("s",{children:tl(xe)}),he>0&&i.jsxs("em",{children:["You save ",tl(he)]})]})]}),i.jsx("button",{type:"button",className:"gzp-btn gzp-btn-primary",disabled:!ve,onClick:()=>q(Y),children:ve?`Add to my order · ${Et(Ne)} off`:`Pick ${s.minItems-te} more to continue`})]})]})})},Cf="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,400..900&family=Hanken+Grotesk:wght@400..800&display=swap",Ef=`
/* ==========================================================================
   GenZ Pizza Land — storefront
   Palette: cream + charcoal with red actions and yellow offer accents.
   Green is reserved for live/delivery status.
   ========================================================================== */

:root {
  --ink-900: #FFF8EF;
  --ink-850: rgba(255, 248, 239, 0.98);
  --ink-800: rgba(255, 255, 255, 0.78);
  --ink-700: rgba(255, 255, 255, 0.56);
  --ink-600: rgba(37, 37, 37, 0.22);
  --line: rgba(37, 37, 37, 0.14);

  --flour: #252525;
  --flour-dim: #5b5b5b;
  --flour-faint: #777777;

  --ember: #E6392F;
  --ember-deep: #c92f27;
  --gold: #FFC83D;
  --basil: #1a9e56;
  --chili: #ff5d5d;

  --heat: #E6392F;

  --r-xl: 26px;
  --r-lg: 18px;
  --r-md: 12px;
  --r-pill: 999px;

  --shadow-lift: 0 18px 40px -18px rgba(37, 37, 37, 0.18);
  --shadow-float: 0 22px 50px -12px rgba(37, 37, 37, 0.22);

  --header-h: 60px;
  --nav-h: 54px;
  --shell: 100%;
  --gutter: clamp(16px, 2.6vw, 56px);
}

* {
  box-sizing: border-box;
}

html {
  /* clip (not hidden) — \`overflow-x: hidden\` turns the page into a scroll
     container and silently kills every \`position: sticky\` inside it. */
  overflow-x: clip;
  scroll-behavior: smooth;
}

body {
  margin: 0;
  overflow-x: clip;
  font-family: "Hanken Grotesk", ui-sans-serif, system-ui, -apple-system,
    "Segoe UI", Roboto, sans-serif;
  font-size: 16px;
  line-height: 1.5;
  background:
    radial-gradient(900px 520px at 88% -4%, rgba(255, 200, 61, 0.12), transparent 62%),
    radial-gradient(720px 520px at -4% 104%, rgba(230, 57, 47, 0.04), transparent 62%),
    var(--ink-900);
  background-attachment: fixed;
  color: var(--flour);
  color-scheme: light;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

/* See the scroll-hover-fix effect in App(). pointer-events is inherited,
   so suspending it on body while a scroll is in progress covers every
   descendant without touching each component's hover CSS individually. */
body.is-scrolling {
  pointer-events: none;
}

/* Fine grain over the whole page so flat dark panels don't look plastic. */
body::before {
  content: "";
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  opacity: 0.04;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)'/%3E%3C/svg%3E");
}

h1,
h2,
h3,
.gzp-num {
  font-family: "Archivo", "Hanken Grotesk", system-ui, sans-serif;
  font-variation-settings: "wdth" 112;
  margin: 0;
}

img {
  display: block;
}

button,
input,
textarea,
select {
  font: inherit;
  color: inherit;
}

:focus-visible {
  outline: 2px solid var(--gold);
  outline-offset: 2px;
  border-radius: 6px;
}

::selection {
  background: var(--ember);
  color: #ffffff;
}

/* Scrollbars on the rails and sheets */
.gzp-rail::-webkit-scrollbar,
.gzp-sheet-body::-webkit-scrollbar,
.gzp-navbar-chips::-webkit-scrollbar {
  height: 0;
  width: 0;
}

/* ---------- Shell ---------- */

.gzp-app {
  position: relative;
  z-index: 1;
  min-height: 100vh;
  padding-bottom: 120px;
}

.gzp-shell {
  width: 100%;
  max-width: var(--shell);
  margin: 0 auto;
  padding: 0 16px;
}

@media (min-width: 900px) {
  .gzp-shell {
    padding: 0 var(--gutter);
  }
}

/* ---------- Header ---------- */

.gzp-header {
  position: sticky;
  top: 0;
  z-index: 60;
  height: var(--header-h);
  display: flex;
  align-items: center;
  background: var(--flour);
  box-shadow: 0 6px 18px -10px rgba(37, 37, 37, 0.3);
  border-bottom: 1px solid rgba(0, 0, 0, 0.18);
}

.gzp-header-inner {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  max-width: var(--shell);
  margin: 0 auto;
  padding: 0 16px;
}

@media (min-width: 900px) {
  .gzp-header-inner {
    padding: 0 var(--gutter);
  }
}

.gzp-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-right: auto;
  min-width: 0;
  background: none;
  border: 0;
  padding: 0;
  cursor: pointer;
  text-align: left;
}

.gzp-brand-mark {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  object-fit: cover;
  flex: none;
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.85);
}

.gzp-brand-name {
  color: #ffffff;
  font-family: "Archivo", sans-serif;
  font-variation-settings: "wdth" 108;
  font-weight: 750;
  font-size: 1.02rem;
  letter-spacing: -0.02em;
  line-height: 1.1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.gzp-brand-sub {
  display: block;
  font-family: "Hanken Grotesk", sans-serif;
  font-variation-settings: normal;
  font-weight: 500;
  font-size: 0.7rem;
  letter-spacing: 0.01em;
  color: rgba(255, 255, 255, 0.86);
}

.gzp-icon-btn {
  position: relative;
  width: 40px;
  height: 40px;
  flex: none;
  display: grid;
  place-items: center;
  border-radius: var(--r-md);
  border: 1px solid var(--line);
  background: var(--ink-800);
  cursor: pointer;
  transition: border-color 0.15s ease, background 0.15s ease;
}

.gzp-icon-btn:hover {
  border-color: rgba(37, 37, 37, 0.32);
  background: var(--ink-700);
}

.gzp-icon-btn svg {
  width: 19px;
  height: 19px;
  flex: none;
}

.gzp-cart-btn {
  border-color: rgba(255, 255, 255, 0.8);
  background: rgba(255, 248, 239, 0.96);
}

.gzp-cart-btn:hover {
  border-color: #ffffff;
  background: #ffffff;
}

.gzp-cart-count {
  position: absolute;
  top: -6px;
  right: -6px;
  min-width: 20px;
  height: 20px;
  padding: 0 5px;
  border-radius: var(--r-pill);
  background: var(--gold);
  color: var(--flour);
  font-family: "Archivo", sans-serif;
  font-weight: 800;
  font-size: 0.68rem;
  display: grid;
  place-items: center;
  border: 2px solid var(--ink-900);
}

/* ---------- Hero ---------- */

/* Full-bleed slider — no text, no grid, just the banner staff configure
   from the POS dashboard (Dashboard > Hero Slider), edge-to-edge. */
.gzp-hero {
  position: relative;
}

/* Hero slider — now the entire hero: a full-width, edge-to-edge
   auto-rotating crossfade through whatever the admin panel has uploaded
   (Dashboard > Hero Slider), no rounded frame, no side padding. */
.gzp-slider {
  position: relative;
  overflow: hidden;
  background: var(--ink-800);
  width: 100%;
  aspect-ratio: 8 / 3;
  cursor: pointer;
}

@media (min-width: 640px) {
  .gzp-slider {
    aspect-ratio: 16 / 3.5;
  }
}

@media (min-width: 900px) {
  .gzp-slider {
    aspect-ratio: 21 / 3.5;
  }
}

.gzp-slider-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transition: opacity 0.7s ease;
}

.gzp-slider-img.is-active {
  opacity: 1;
}

.gzp-slider-fallback {
  display: grid;
  place-items: center;
  height: 100%;
  background: var(--ink-900);
}

.gzp-slider-fallback img {
  width: 96px;
  height: 96px;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.14);
}

.gzp-slider-dots {
  position: absolute;
  right: 16px;
  bottom: 16px;
  z-index: 2;
  display: flex;
  gap: 6px;
  padding: 7px;
  border-radius: var(--r-pill);
  background: rgba(11, 13, 16, 0.6);
  backdrop-filter: blur(6px);
}

.gzp-slider-dot {
  width: 6px;
  height: 6px;
  padding: 0;
  border-radius: 50%;
  border: 0;
  background: rgba(242, 239, 233, 0.4);
  cursor: pointer;
  transition: background 0.2s ease, width 0.2s ease;
}

.gzp-slider-dot.is-active {
  width: 16px;
  border-radius: var(--r-pill);
  background: var(--gold);
}

/* ---------- Buttons ---------- */

.gzp-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 20px;
  border-radius: var(--r-md);
  border: 1px solid transparent;
  font-weight: 700;
  font-size: 0.94rem;
  cursor: pointer;
  transition: transform 0.12s ease, filter 0.15s ease, background 0.15s ease,
    border-color 0.15s ease;
}

.gzp-btn svg {
  flex: none;
}

.gzp-btn:active {
  transform: translateY(1px);
}

.gzp-btn-primary {
  background: var(--heat);
  color: #ffffff;
  box-shadow: 0 10px 26px -12px rgba(230, 57, 47, 0.55);
}

.gzp-btn-primary:hover {
  background: var(--ember-deep);
}

.gzp-btn-primary:disabled {
  filter: grayscale(0.5) brightness(0.8);
  cursor: not-allowed;
}

.gzp-btn-ghost {
  background: transparent;
  border-color: var(--line);
  color: var(--flour);
}

.gzp-btn-ghost:hover {
  border-color: rgba(37, 37, 37, 0.32);
  background: var(--ink-800);
}

.gzp-btn-block {
  width: 100%;
}

/* ---------- Sticky category nav ---------- */

.gzp-navbar {
  position: sticky;
  top: var(--header-h);
  z-index: 50;
  background: rgba(255, 248, 239, 0.96);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border-bottom: 1px solid rgba(37, 37, 37, 0.14);
}

.gzp-navbar-inner {
  display: flex;
  align-items: center;
  gap: 10px;
  max-width: var(--shell);
  margin: 0 auto;
  padding: 0 16px;
  height: var(--nav-h);
}

@media (min-width: 900px) {
  .gzp-navbar-inner {
    padding: 0 var(--gutter);
  }
}

.gzp-navbar-chips {
  display: flex;
  gap: 6px;
  overflow-x: auto;
  scrollbar-width: none;
  flex: 1;
  height: 100%;
  align-items: center;
  scroll-snap-type: x proximity;
  -webkit-overflow-scrolling: touch;
}

.gzp-chip {
  flex: none;
  padding: 8px 15px;
  border-radius: var(--r-pill);
  border: 1px solid transparent;
  background: transparent;
  color: var(--flour-dim);
  font-weight: 600;
  font-size: 0.9rem;
  white-space: nowrap;
  cursor: pointer;
  scroll-snap-align: center;
  transition: color 0.15s ease, background 0.15s ease, border-color 0.15s ease;
}

.gzp-chip:hover {
  color: var(--flour);
  background: var(--ink-800);
}

.gzp-chip.is-active {
  color: #ffffff;
  background: var(--heat);
  font-weight: 700;
}

/* ---------- Sections ---------- */

.gzp-section {
  padding-top: 34px;
  scroll-margin-top: calc(var(--header-h) + var(--nav-h) + 10px);
}

.gzp-section-head {
  display: flex;
  align-items: baseline;
  gap: 12px;
  margin-bottom: 16px;
}

.gzp-section-head h2 {
  font-weight: 800;
  font-variation-settings: "wdth" 114;
  font-size: clamp(1.4rem, 3.6vw, 2.05rem);
  letter-spacing: -0.03em;
}

.gzp-section-count {
  color: var(--flour-faint);
  font-size: 0.85rem;
  font-weight: 500;
  white-space: nowrap;
}

.gzp-section-rule {
  flex: 1;
  min-width: 20px;
  height: 1px;
  background: linear-gradient(90deg, var(--line), transparent);
}

/* ---------- Deals rail ---------- */

.gzp-rail-wrap {
  position: relative;
}

.gzp-rail {
  display: flex;
  gap: 14px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;
  padding: 2px 2px 8px;
  -webkit-overflow-scrolling: touch;
}

.gzp-rail-nav {
  display: none;
  gap: 8px;
}

@media (min-width: 900px) {
  .gzp-rail-nav {
    display: flex;
  }
}

.gzp-rail-btn {
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid var(--line);
  background: var(--ink-800);
  cursor: pointer;
  transition: border-color 0.15s ease, background 0.15s ease;
}

.gzp-rail-btn:hover {
  border-color: var(--ember);
  background: var(--ink-700);
}

.gzp-rail-btn svg {
  width: 17px;
  height: 17px;
}

.gzp-deal {
  position: relative;
  flex: 0 0 272px;
  scroll-snap-align: start;
  display: flex;
  flex-direction: column;
  border-radius: var(--r-lg);
  border: 1px solid var(--line);
  background: var(--ink-800);
  overflow: hidden;
  cursor: pointer;
  text-align: left;
  padding: 0;
  transition: border-color 0.18s ease, transform 0.18s ease;
}

@media (min-width: 720px) {
  .gzp-deal {
    flex-basis: 310px;
  }
}

.gzp-deal:hover {
  border-color: rgba(230, 57, 47, 0.45);
  transform: translateY(-2px);
}

.gzp-deal-media {
  position: relative;
  aspect-ratio: 16 / 10;
  overflow: hidden;
  background: var(--ink-700);
}

.gzp-deal-media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.gzp-deal:hover .gzp-deal-media img {
  transform: scale(1.04);
}

.gzp-stock {
  position: absolute;
  left: 10px;
  bottom: 10px;
  padding: 4px 10px;
  border-radius: var(--r-pill);
  background: rgba(11, 13, 16, 0.85);
  border: 1px solid rgba(246, 177, 0, 0.55);
  color: #FFC83D;
  font-weight: 700;
  font-size: 0.72rem;
}

.gzp-stock.is-out {
  border-color: rgba(228, 20, 43, 0.6);
  color: var(--ember);
}

.gzp-stock-note {
  margin: 6px 0 0;
  font-weight: 700;
  font-size: 0.85rem;
  color: var(--flour);
}

.gzp-stock-note.is-out {
  color: var(--ember);
}

.gzp-whatsapp {
  position: fixed;
  right: 16px;
  bottom: 92px;
  z-index: 60;
  display: grid;
  place-items: center;
  width: 54px;
  height: 54px;
  border-radius: 50%;
  background: #25d366;
  box-shadow: 0 10px 26px -8px rgba(37, 211, 102, 0.75), 0 2px 8px rgba(0, 0, 0, 0.25);
  transition: transform 0.15s ease;
}

.gzp-whatsapp:hover {
  transform: scale(1.08);
}

.gzp-media-fallback {
  display: grid;
  place-items: center;
  width: 100%;
  height: 100%;
  font-size: 2.2rem;
  background: var(--ink-900);
}

.gzp-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  padding: 5px 10px;
  border-radius: var(--r-pill);
  background: var(--heat);
  color: #ffffff;
  font-family: "Archivo", sans-serif;
  font-weight: 800;
  font-size: 0.68rem;
  letter-spacing: 0.02em;
}

.gzp-save {
  position: absolute;
  top: 10px;
  left: 10px;
  padding: 5px 10px;
  border-radius: var(--r-pill);
  background: rgba(11, 13, 16, 0.82);
  backdrop-filter: blur(6px);
  border: 1px solid rgba(86, 209, 141, 0.4);
  color: var(--basil);
  font-weight: 700;
  font-size: 0.72rem;
}

.gzp-deal-body {
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 10px;
  padding: 14px 15px 15px;
}

.gzp-deal-body h3 {
  font-weight: 750;
  font-size: 1.08rem;
  letter-spacing: -0.02em;
  line-height: 1.2;
}

.gzp-deal-contents {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 4px;
  color: var(--flour-dim);
  font-size: 0.85rem;
}

.gzp-deal-contents li {
  display: flex;
  gap: 8px;
  align-items: flex-start;
  line-height: 1.35;
}

.gzp-deal-contents li::before {
  content: "";
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--ember);
  flex: none;
  margin-top: 7px;
}

.gzp-deal-more {
  color: var(--flour-faint);
  font-size: 0.8rem;
}

.gzp-deal-choice {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 10px 12px;
  border-radius: var(--r-md);
  background: var(--ink-800);
  border: 1px solid var(--line);
}

.gzp-deal-choice-label {
  margin: 0;
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--flour);
}

.gzp-deal-choice .gzp-variant-row {
  flex-wrap: wrap;
}

.gzp-deal-desc {
  margin: 0;
  color: var(--flour-dim);
  font-size: 0.87rem;
  line-height: 1.45;
}

.gzp-deal-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-top: auto;
  padding-top: 4px;
}

/* ---------- Price ---------- */

.gzp-price {
  display: flex;
  align-items: baseline;
  gap: 8px;
  font-family: "Archivo", sans-serif;
  font-variation-settings: "wdth" 108;
  font-weight: 800;
  font-size: 1.12rem;
  letter-spacing: -0.02em;
  color: var(--ember); /* prices in Pepperoni Red */
  font-variant-numeric: tabular-nums;
}

.gzp-price s {
  font-weight: 500;
  font-size: 0.82rem;
  color: var(--flour-faint);
  text-decoration-thickness: 1px;
}

/* ---------- Menu grid ---------- */

.gzp-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(158px, 1fr));
  gap: 12px;
}

@media (min-width: 640px) {
  .gzp-grid {
    grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
    gap: 16px;
  }
}

.gzp-card {
  position: relative;
  display: flex;
  flex-direction: column;
  border-radius: var(--r-lg);
  border: 1px solid var(--line);
  background: var(--ink-800);
  overflow: hidden;
  cursor: pointer;
  text-align: left;
  padding: 0;
  transition: border-color 0.18s ease, transform 0.18s ease;
}

.gzp-card:hover {
  border-color: rgba(230, 57, 47, 0.35);
  transform: translateY(-2px);
}

.gzp-card-media {
  position: relative;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  background: var(--ink-700);
}

.gzp-card-media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.gzp-card:hover .gzp-card-media img {
  transform: scale(1.05);
}

.gzp-card-body {
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;
  padding: 12px 13px 13px;
}

.gzp-card-body h3 {
  font-weight: 700;
  font-size: 0.98rem;
  line-height: 1.25;
  letter-spacing: -0.015em;
  cursor: pointer;
}

.gzp-card-desc {
  margin: -4px 0 0;
  color: var(--flour-dim);
  font-size: 0.82rem;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.gzp-price-from {
  font-family: "Inter", sans-serif;
  font-weight: 600;
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--flour-faint);
  margin-right: -2px;
}

.gzp-variant-row {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.gzp-select {
  flex: 1;
  min-width: 88px;
  appearance: none;
  -webkit-appearance: none;
  background: var(--ink-900)
    url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='6'><path d='M0 0l5 6 5-6z' fill='%2362666f'/></svg>")
    no-repeat right 10px center;
  border: 1px solid var(--line);
  border-radius: var(--r-md);
  padding: 8px 26px 8px 10px;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--flour);
  cursor: pointer;
}

.gzp-select:focus-visible {
  outline: 2px solid var(--gold);
  outline-offset: 1px;
}

.gzp-wish {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 2;
  width: 30px;
  height: 30px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  border: 0;
  background: rgba(18, 18, 21, 0.78);
  color: #FFC83D;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
  cursor: pointer;
  transition: transform 0.12s ease;
}

.gzp-wish svg {
  width: 15px;
  height: 15px;
}

.gzp-wish:active {
  transform: scale(0.9);
}

.gzp-wish.is-active {
  color: #ffffff;
  background: var(--ember);
}

.gzp-card-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-top: auto;
}

/* Add control — circle on grid cards, pill on deals */
.gzp-add {
  flex: none;
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  border-radius: var(--r-md);
  border: 0;
  background: var(--heat);
  color: #ffffff;
  cursor: pointer;
  transition: filter 0.15s ease, transform 0.12s ease;
}

.gzp-add:hover {
  filter: brightness(1.08);
}

.gzp-add:active {
  transform: scale(0.94);
}

.gzp-add svg {
  width: 18px;
  height: 18px;
}

.gzp-add-wide {
  width: auto;
  padding: 0 16px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-weight: 700;
  font-size: 0.88rem;
}

.gzp-add-wide svg {
  width: 16px;
  height: 16px;
}

.gzp-add-wide:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  filter: none;
}

.gzp-stepper {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  border-radius: var(--r-md);
  border: 1px solid rgba(230, 57, 47, 0.35);
  background: rgba(230, 57, 47, 0.06);
  overflow: hidden;
}

.gzp-stepper button {
  width: 32px;
  height: 34px;
  border: 0;
  background: transparent;
  color: var(--ember);
  font-size: 1.15rem;
  font-weight: 700;
  line-height: 1;
  cursor: pointer;
  transition: background 0.15s ease;
}

.gzp-stepper button:hover {
  background: rgba(230, 57, 47, 0.12);
}

.gzp-stepper span {
  min-width: 20px;
  text-align: center;
  font-family: "Archivo", sans-serif;
  font-weight: 800;
  font-size: 0.92rem;
  font-variant-numeric: tabular-nums;
}

.gzp-stepper-lg button {
  width: 44px;
  height: 46px;
  font-size: 1.4rem;
}

.gzp-stepper-lg span {
  min-width: 34px;
  font-size: 1.05rem;
}

/* ---------- Search overlay ---------- */

.gzp-search {
  position: fixed;
  inset: 0;
  z-index: 90;
  background: rgba(7, 8, 10, 0.72);
  backdrop-filter: blur(10px);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 16px;
}

.gzp-search-bar {
  width: 100%;
  max-width: 620px;
  margin-top: 14vh;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 6px 6px 16px;
  border-radius: var(--r-lg);
  border: 1px solid var(--line);
  background: var(--ink-800);
  box-shadow: var(--shadow-float);
}

.gzp-search-bar > svg {
  width: 20px;
  height: 20px;
  flex: none;
  color: var(--flour-faint);
}

.gzp-search-bar input {
  flex: 1;
  border: 0;
  background: transparent;
  outline: none;
  padding: 12px 0;
  font-size: 1.05rem;
}

.gzp-search-bar input::placeholder {
  color: var(--flour-faint);
}

.gzp-search-results {
  width: 100%;
  max-width: 620px;
  margin-top: 12px;
  max-height: 58vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-bottom: 20px;
}

.gzp-result {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 9px 12px;
  border-radius: var(--r-md);
  border: 1px solid var(--line);
  background: var(--ink-850);
  cursor: pointer;
  text-align: left;
  width: 100%;
}

.gzp-result:hover {
  border-color: rgba(37, 37, 37, 0.32);
}

.gzp-result img,
.gzp-result .gzp-result-icon {
  width: 46px;
  height: 46px;
  border-radius: 10px;
  object-fit: cover;
  flex: none;
  display: grid;
  place-items: center;
  background: var(--ink-700);
  font-size: 1.2rem;
}

.gzp-result-name {
  flex: 1;
  min-width: 0;
  font-weight: 600;
  font-size: 0.95rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.gzp-result-cat {
  display: block;
  font-size: 0.78rem;
  font-weight: 500;
  color: var(--flour-faint);
}

.gzp-search-empty {
  text-align: center;
  color: var(--flour-dim);
  padding: 26px 0;
}

/* ---------- Quick view ---------- */

.gzp-overlay {
  position: fixed;
  inset: 0;
  z-index: 80;
  background: rgba(7, 8, 10, 0.7);
  backdrop-filter: blur(6px);
  display: flex;
  animation: gzp-fade 0.18s ease;
}

@keyframes gzp-fade {
  from {
    opacity: 0;
  }
}

.gzp-modal {
  margin: auto;
  width: 100%;
  max-width: 460px;
  border-radius: var(--r-xl);
  border: 1px solid var(--line);
  background: var(--ink-850);
  box-shadow: var(--shadow-float);
  overflow: hidden;
  animation: gzp-rise 0.22s cubic-bezier(0.2, 0.8, 0.3, 1);
}

@keyframes gzp-rise {
  from {
    transform: translateY(14px);
    opacity: 0;
  }
}

.gzp-modal-media {
  position: relative;
  aspect-ratio: 16 / 10;
  background: var(--ink-700);
}

.gzp-modal-media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.gzp-modal-close {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: 1px solid var(--line);
  background: rgba(255, 248, 239, 0.96);
  backdrop-filter: blur(6px);
  color: var(--flour);
  font-size: 1rem;
  cursor: pointer;
  z-index: 3;
}

.gzp-modal-body {
  padding: 18px 20px 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.gzp-modal-body h2 {
  font-weight: 800;
  font-size: 1.5rem;
  letter-spacing: -0.03em;
  line-height: 1.15;
}

.gzp-modal-foot {
  display: flex;
  align-items: center;
  gap: 12px;
}

.gzp-modal-foot .gzp-btn {
  flex: 1;
}

.gzp-btn-split {
  justify-content: space-between;
  padding-left: 18px;
  padding-right: 18px;
  font-variant-numeric: tabular-nums;
}

/* ---------- Bottom cart bar ---------- */

.gzp-cartbar {
  position: fixed;
  left: 50%;
  bottom: 18px;
  transform: translateX(-50%);
  z-index: 70;
  width: calc(100% - 32px);
  max-width: 460px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  padding: 12px 14px 12px 18px;
  border-radius: var(--r-lg);
  border: 0;
  background: var(--heat);
  color: #ffffff;
  cursor: pointer;
  box-shadow: 0 18px 40px -14px rgba(230, 57, 47, 0.5);
  animation: gzp-rise 0.24s cubic-bezier(0.2, 0.8, 0.3, 1);
}

.gzp-cartbar-label {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  line-height: 1.15;
}

.gzp-cartbar-label small {
  font-size: 0.74rem;
  font-weight: 600;
  opacity: 0.75;
}

.gzp-cartbar-label b {
  font-family: "Archivo", sans-serif;
  font-weight: 800;
  font-size: 1.02rem;
  letter-spacing: -0.02em;
}

.gzp-cartbar-cta {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 8px 14px;
  border-radius: var(--r-md);
  background: rgba(255, 255, 255, 0.2);
  font-weight: 800;
  font-size: 0.9rem;
}

/* ---------- Sheet (cart / checkout / track) ---------- */

.gzp-sheet-overlay {
  position: fixed;
  inset: 0;
  z-index: 85;
  background: rgba(7, 8, 10, 0.7);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  animation: gzp-fade 0.18s ease;
}

@media (min-width: 720px) {
  .gzp-sheet-overlay {
    align-items: stretch;
    justify-content: flex-end;
  }
}

.gzp-sheet {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-height: 90vh;
  background: var(--ink-850);
  border: 1px solid var(--line);
  border-radius: var(--r-xl) var(--r-xl) 0 0;
  box-shadow: var(--shadow-float);
  animation: gzp-sheet-up 0.26s cubic-bezier(0.2, 0.8, 0.3, 1);
}

@keyframes gzp-sheet-up {
  from {
    transform: translateY(30px);
    opacity: 0;
  }
}

@media (min-width: 720px) {
  .gzp-sheet {
    width: 430px;
    max-height: none;
    height: 100%;
    border-radius: 0;
    border-right: 0;
    animation: gzp-sheet-in 0.26s cubic-bezier(0.2, 0.8, 0.3, 1);
  }
  @keyframes gzp-sheet-in {
    from {
      transform: translateX(30px);
      opacity: 0;
    }
  }
}

.gzp-sheet-head {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 18px 20px 14px;
  border-bottom: 1px solid var(--line);
}

.gzp-sheet-head h2 {
  flex: 1;
  font-weight: 800;
  font-size: 1.25rem;
  letter-spacing: -0.025em;
}

.gzp-sheet-body {
  flex: 1;
  overflow-y: auto;
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.gzp-sheet-foot {
  padding: 14px 20px 20px;
  border-top: 1px solid var(--line);
  background: var(--ink-800);
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.gzp-line {
  display: flex;
  align-items: center;
  gap: 12px;
}

.gzp-line img,
.gzp-line .gzp-line-icon {
  width: 52px;
  height: 52px;
  border-radius: 10px;
  object-fit: cover;
  flex: none;
  display: grid;
  place-items: center;
  background: var(--ink-700);
  font-size: 1.3rem;
}

.gzp-line-main {
  flex: 1;
  min-width: 0;
}

.gzp-line-main h4 {
  margin: 0;
  font-size: 0.95rem;
  font-weight: 650;
  line-height: 1.25;
}

.gzp-line-main span {
  font-size: 0.82rem;
  color: var(--flour-faint);
  font-variant-numeric: tabular-nums;
}

.gzp-line-variant {
  margin: 0;
  font-size: 0.76rem;
  color: var(--flour-faint);
}

.gzp-tag {
  display: inline-block;
  margin-right: 6px;
  padding: 2px 7px;
  border-radius: 5px;
  background: rgba(37, 37, 37, 0.16);
  color: var(--gold);
  font-family: "Archivo", sans-serif;
  font-weight: 800;
  font-size: 0.62rem;
  letter-spacing: 0.04em;
  vertical-align: middle;
}

.gzp-totals {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 0.92rem;
  color: var(--flour-dim);
}

.gzp-totals div {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  font-variant-numeric: tabular-nums;
}

.gzp-totals .gzp-grand {
  padding-top: 10px;
  border-top: 1px dashed var(--line);
  color: var(--flour);
  font-family: "Archivo", sans-serif;
  font-weight: 800;
  font-size: 1.14rem;
  letter-spacing: -0.02em;
}

/* ---------- Forms ---------- */

.gzp-form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.gzp-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.gzp-field span {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--flour-dim);
}

.gzp-field input,
.gzp-field textarea {
  width: 100%;
  padding: 12px 14px;
  border-radius: var(--r-md);
  border: 1px solid var(--line);
  background: var(--ink-900);
  outline: none;
  resize: vertical;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.gzp-field input:focus,
.gzp-field textarea:focus {
  border-color: var(--ember);
  box-shadow: 0 0 0 3px rgba(230, 57, 47, 0.14);
}

.gzp-field input::placeholder,
.gzp-field textarea::placeholder {
  color: var(--flour-faint);
}

.gzp-note {
  display: flex;
  gap: 10px;
  padding: 12px 14px;
  border-radius: var(--r-md);
  border: 1px solid rgba(86, 209, 141, 0.28);
  background: rgba(86, 209, 141, 0.07);
  color: var(--flour-dim);
  font-size: 0.86rem;
  line-height: 1.4;
}

.gzp-note svg {
  flex: none;
  color: var(--basil);
  margin-top: 1px;
}

.gzp-note b {
  color: var(--basil);
}

.gzp-error {
  padding: 11px 14px;
  border-radius: var(--r-md);
  border: 1px solid rgba(255, 93, 93, 0.35);
  background: rgba(255, 93, 93, 0.09);
  color: var(--ember);
  font-size: 0.88rem;
}

.gzp-error-banner {
  max-width: var(--shell);
  margin: 14px auto 0;
}

/* ---------- Order tracking ---------- */

.gzp-track {
  max-width: 620px;
  margin: 0 auto;
  padding: 28px 0 40px;
}

.gzp-track-hero {
  border-radius: var(--r-xl);
  border: 1px solid var(--line);
  background: linear-gradient(180deg, var(--ink-800), var(--ink-850));
  padding: 24px;
  position: relative;
  overflow: hidden;
}

.gzp-track-hero::after {
  content: "";
  position: absolute;
  top: -120px;
  right: -80px;
  width: 320px;
  height: 260px;
  background: radial-gradient(
    circle,
    rgba(230, 57, 47, 0.18),
    transparent 65%
  );
  pointer-events: none;
}

.gzp-track-top {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.gzp-track-top h1 {
  font-size: clamp(1.6rem, 5vw, 2.2rem);
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.1;
}

.gzp-track-id {
  margin: 6px 0 0;
  color: var(--flour-faint);
  font-size: 0.88rem;
  font-variant-numeric: tabular-nums;
}

.gzp-eta {
  margin: 16px 0 0;
  color: var(--flour-dim);
  font-size: 0.95rem;
}

.gzp-steps {
  list-style: none;
  margin: 22px 0 0;
  padding: 0;
  display: flex;
  flex-direction: column;
}

.gzp-steps li {
  position: relative;
  padding: 0 0 20px 34px;
  color: var(--flour-faint);
  font-size: 0.95rem;
}

.gzp-steps li:last-child {
  padding-bottom: 0;
}

.gzp-steps li::before {
  content: "";
  position: absolute;
  left: 4px;
  top: 3px;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 2px solid var(--line);
  background: var(--ink-850);
  z-index: 2;
}

.gzp-steps li::after {
  content: "";
  position: absolute;
  left: 10px;
  top: 17px;
  bottom: 0;
  width: 2px;
  background: var(--line);
}

.gzp-steps li:last-child::after {
  display: none;
}

.gzp-steps li.is-done {
  color: var(--flour);
  font-weight: 600;
}

.gzp-steps li.is-done::before {
  border-color: var(--basil);
  background: var(--basil);
}

.gzp-steps li.is-done::after {
  background: var(--basil);
}

.gzp-steps li.is-current::before {
  border-color: var(--ember);
  background: var(--ember);
  box-shadow: 0 0 0 5px rgba(230, 57, 47, 0.18);
}

.gzp-steps li.is-current {
  color: var(--flour);
  font-weight: 700;
}

.gzp-panel {
  margin-top: 16px;
  border-radius: var(--r-lg);
  border: 1px solid var(--line);
  background: var(--ink-850);
  padding: 18px 20px;
}

.gzp-panel h3 {
  font-size: 1.05rem;
  font-weight: 750;
  letter-spacing: -0.02em;
  margin-bottom: 12px;
}

.gzp-order-line {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 9px 0;
  border-bottom: 1px solid rgba(220, 222, 227, 0.9);
  font-size: 0.93rem;
  font-variant-numeric: tabular-nums;
}

.gzp-order-line:last-of-type {
  border-bottom: 0;
}

.gzp-order-sub {
  margin: 2px 0 0;
  color: var(--flour-faint);
  font-size: 0.8rem;
  line-height: 1.4;
}

.gzp-cancelled {
  margin: 18px 0 0;
  padding: 14px 16px;
  border-radius: var(--r-md);
  border: 1px solid rgba(255, 93, 93, 0.3);
  background: rgba(255, 93, 93, 0.08);
  color: var(--ember);
}

/* ---------- Footer ---------- */

.gzp-footer {
  margin-top: 54px;
  border-top: 1px solid var(--line);
  padding: 28px 0 10px;
}

.gzp-footer-inner {
  display: flex;
  flex-wrap: wrap;
  gap: 18px;
  align-items: center;
  justify-content: space-between;
}

.gzp-footer p {
  margin: 0;
  color: var(--flour-faint);
  font-size: 0.85rem;
  max-width: 46ch;
  line-height: 1.5;
}

.gzp-footer strong {
  display: block;
  font-family: "Archivo", sans-serif;
  font-weight: 800;
  font-size: 1.05rem;
  letter-spacing: -0.02em;
  color: var(--flour);
  margin-bottom: 4px;
}

.gzp-footer-credit {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 20px;
  color: var(--flour-faint);
  font-size: 0.75rem;
}

.gzp-footer-credit img {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  object-fit: cover;
}

.gzp-footer-credit strong {
  display: inline;
  margin: 0;
  color: var(--flour-dim);
  font-family: inherit;
  font-size: inherit;
  font-weight: 700;
  letter-spacing: normal;
}

/* ---------- Toast ---------- */

.gzp-toast {
  position: fixed;
  left: 50%;
  bottom: 96px;
  transform: translateX(-50%);
  z-index: 95;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 11px 16px;
  border-radius: var(--r-pill);
  background: var(--ink-700);
  border: 1px solid var(--line);
  box-shadow: var(--shadow-float);
  font-size: 0.9rem;
  font-weight: 600;
  white-space: nowrap;
  animation: gzp-toast-in 0.22s cubic-bezier(0.2, 0.8, 0.3, 1);
}

.gzp-toast i {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--basil);
  color: #06301c;
  display: grid;
  place-items: center;
  font-size: 0.7rem;
  font-style: normal;
  font-weight: 900;
}

@keyframes gzp-toast-in {
  from {
    transform: translate(-50%, 10px);
    opacity: 0;
  }
}

/* ---------- Loading / empty ---------- */

.gzp-boot {
  display: flex;
  min-height: 60vh;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  color: var(--flour-dim);
}

.gzp-boot img {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  object-fit: cover;
  animation: gzp-bob 1.3s ease-in-out infinite;
}

@keyframes gzp-bob {
  0%,
  100% {
    transform: translateY(0) rotate(-4deg);
  }
  50% {
    transform: translateY(-9px) rotate(4deg);
  }
}

.gzp-skeleton {
  border-radius: var(--r-lg);
  border: 1px solid var(--line);
  background: var(--ink-800);
  overflow: hidden;
}

.gzp-skeleton-media {
  aspect-ratio: 4 / 3;
  background: linear-gradient(
    100deg,
    var(--ink-700) 30%,
    var(--ink-600) 50%,
    var(--ink-700) 70%
  );
  background-size: 220% 100%;
  animation: gzp-shimmer 1.4s linear infinite;
}

.gzp-skeleton-lines {
  padding: 13px;
  display: flex;
  flex-direction: column;
  gap: 9px;
}

.gzp-skeleton-lines i {
  height: 11px;
  border-radius: 5px;
  background: var(--ink-700);
}

.gzp-skeleton-lines i:last-child {
  width: 52%;
}

@keyframes gzp-shimmer {
  to {
    background-position: -220% 0;
  }
}

.gzp-empty {
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 44px 20px;
  border-radius: var(--r-lg);
  border: 1px dashed var(--line);
  color: var(--flour-dim);
  text-align: center;
}

.gzp-empty span {
  font-size: 1.9rem;
}

/* ---------- Motion preferences ---------- */


/* ---- Order-confirmation popup: a small centered card, not full screen ---- */
.gzp-thankyou-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background: rgba(20, 22, 30, 0.55);
  backdrop-filter: blur(4px);
  overflow-y: auto;
}

.gzp-thankyou-card {
  position: relative;
  width: 100%;
  max-width: 380px;
  max-height: calc(100vh - 32px);
  max-height: calc(100dvh - 32px);
  overflow-y: auto;
  box-sizing: border-box;
  padding: 26px 24px 22px;
  border-radius: 24px;
  background: #FFF8EF;
  border: 1px solid rgba(230, 57, 47, 0.25);
  box-shadow: var(--shadow-float), 0 0 40px -10px rgba(230, 57, 47, 0.2);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: gzp-thankyou-pop 0.35s ease-out;
}

@keyframes gzp-thankyou-pop {
  from { opacity: 0; transform: translateY(12px) scale(0.96); }
  to { opacity: 1; transform: none; }
}

.gzp-thankyou-sticker {
  position: absolute;
  font-size: 20px;
  line-height: 1;
  pointer-events: none;
}
.gzp-thankyou-sticker.tl { top: 44px; left: 22px; transform: rotate(-14deg); }
.gzp-thankyou-sticker.tr { top: 30px; right: 34px; transform: rotate(10deg); }
.gzp-thankyou-sticker.bl { top: 82px; left: 64px; transform: rotate(-6deg); }
.gzp-thankyou-sticker.br { top: 70px; right: 22px; transform: rotate(14deg); }

.gzp-thankyou-badge {
  width: 56px;
  height: 56px;
  flex-shrink: 0;
  border-radius: 50%;
  overflow: hidden;
  background: #000;
  border: 3px solid #FFF8EF;
  box-shadow: 0 6px 16px -6px rgba(0, 0, 0, 0.4);
}
.gzp-thankyou-badge img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.gzp-thankyou-mascot {
  width: 96px;
  height: 96px;
  margin: 8px 0 4px;
  flex-shrink: 0;
}

.gzp-thankyou-title {
  margin: 8px 0 0;
  font-size: 26px;
  font-weight: 800;
  color: var(--flour);
}

.gzp-thankyou-sub {
  margin: 8px 0 14px;
  font-size: 14px;
  line-height: 1.45;
  color: var(--flour-dim);
  max-width: 280px;
}

.gzp-thankyou-pill {
  padding: 8px 16px;
  border-radius: var(--r-pill);
  background: var(--ink-800);
  border: 1px solid var(--line);
  font-size: 14px;
  font-weight: 700;
  color: var(--flour);
}

.gzp-thankyou-track-btn {
  width: 100%;
  margin-top: 20px;
  padding: 14px 16px;
  border: 0;
  border-radius: var(--r-md);
  background: var(--heat);
  color: #ffffff;
  font: inherit;
  font-weight: 700;
  font-size: 15px;
  cursor: pointer;
  box-shadow: 0 10px 24px -10px rgba(230, 57, 47, 0.55);
}
.gzp-thankyou-track-btn:hover { filter: brightness(1.06); }

.gzp-thankyou-link {
  margin-top: 14px;
  padding: 4px;
  border: 0;
  background: none;
  font: inherit;
  font-size: 13px;
  font-weight: 600;
  color: var(--flour-dim);
  text-decoration: underline;
  cursor: pointer;
}

/* Popup on small phones / short screens */
@media (max-width: 400px) {
  .gzp-thankyou-overlay { padding: 12px; align-items: center; }
  .gzp-thankyou-card { padding: 22px 18px 18px; border-radius: 20px; }
  .gzp-thankyou-mascot { width: 80px; height: 80px; }
  .gzp-thankyou-title { font-size: 22px; }
  .gzp-thankyou-sub { font-size: 13px; }
  .gzp-thankyou-sticker { font-size: 17px; }
  .gzp-thankyou-sticker.bl { left: 50px; }
}
@media (max-height: 560px) {
  .gzp-thankyou-overlay { align-items: flex-start; padding-top: 40px; }
  .gzp-thankyou-mascot { width: 64px; height: 64px; }
}

/* ---------- Dark + animated background polish ---------- */

/* Cards sit over the moving background: frosted glass + ember glow on hover. */
.gzp-card,
.gzp-deal {
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(37, 37, 37, 0.14);
  transition: box-shadow 0.25s ease, border-color 0.25s ease, transform 0.25s ease;
}
.gzp-card:hover,
.gzp-deal:hover {
  border-color: rgba(230, 57, 47, 0.45);
  box-shadow: 0 0 0 1px rgba(230, 57, 47, 0.18), 0 18px 44px -18px rgba(230, 57, 47, 0.3);
}

input,
textarea,
select {
  color-scheme: light;
}
input::placeholder,
textarea::placeholder {
  color: var(--flour-faint);
}

@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }
  *,
  *::before,
  *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
  }
}
`;(()=>{if(typeof document>"u")return;if(!document.getElementById("gzp-fonts")){const f=document.createElement("link");f.rel="preconnect",f.href="https://fonts.googleapis.com",document.head.appendChild(f);const u=document.createElement("link");u.rel="preconnect",u.href="https://fonts.gstatic.com",u.crossOrigin="",document.head.appendChild(u);const k=document.createElement("link");k.id="gzp-fonts",k.rel="stylesheet",k.href=Cf,document.head.appendChild(k)}let s=document.getElementById("gzp-styles");if(s||(s=document.createElement("style"),s.id="gzp-styles",document.head.appendChild(s)),s.textContent=Ef+bf+qp,!document.querySelector('meta[name="theme-color"]')){const f=document.createElement("meta");f.name="theme-color",f.content="#FFF8EF",document.head.appendChild(f)}})();const _f=16,Pf=["Pending","Accepted","Preparing","Ready to Deliver","Completed"],Tf=["Payment Pending Verification","Accepted","Preparing","Ready to Deliver","Completed"],es="Payment Pending Verification",Mc={[es]:"Verifying your payment",Pending:"Order received",Accepted:"Accepted by the kitchen",Preparing:"Preparing your food","Ready to Deliver":"Out for delivery",Completed:"Delivered",Cancelled:"Cancelled"},Lf={[es]:"Verifying your payment",Pending:"We've got your order",Accepted:"The kitchen is on it",Preparing:"Your food is cooking","Ready to Deliver":"On the way to you",Completed:"Delivered — enjoy",Cancelled:"Order cancelled"},Xi="deals",Yc="923259061006",Kc=`https://wa.me/${Yc}?text=${encodeURIComponent("Hello GenZ Pizza Land, I have an inquiry.")}`,Rf=1e4,ft=s=>{const f=Number(s)||0;return`Rs ${f.toLocaleString("en-PK",{minimumFractionDigits:Number.isInteger(f)?0:2,maximumFractionDigits:2})}`},qa=s=>{const f=[];return((s==null?void 0:s.variants)||[]).forEach(u=>{u.size&&!f.includes(u.size)&&f.push(u.size)}),f},rl=(s,f)=>{const u=[];return((s==null?void 0:s.variants)||[]).forEach(k=>{k.size===f&&k.crust&&!u.includes(k.crust)&&u.push(k.crust)}),u},Xa=(s,f,u)=>((s==null?void 0:s.variants)||[]).find(k=>k.size===f&&(k.crust||"")===(u||""))||null,Gc=s=>((s==null?void 0:s.variants)||[]).reduce((f,u)=>f===null||u.price<f.price?u:f,null),Zi=s=>{let f=s.replace(/[^\d+]/g,"");return f=f[0]==="+"?"+"+f.slice(1).replace(/\+/g,""):f.replace(/\+/g,""),f.slice(0,14)},Ic=s=>{const f=s.replace(/\D/g,"");return f.length>=10&&f.length<=13},no={width:20,height:20,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:1.8,strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",focusable:"false"},qc=s=>i.jsxs("svg",{...no,...s,children:[i.jsx("circle",{cx:"11",cy:"11",r:"7"}),i.jsx("path",{d:"m20 20-3.2-3.2"})]}),Mf=s=>i.jsxs("svg",{...no,...s,children:[i.jsx("path",{d:"M6 8h12l-1 11H7L6 8Z"}),i.jsx("path",{d:"M9.5 8V6.5a2.5 2.5 0 0 1 5 0V8"})]}),If=s=>i.jsx("svg",{...no,strokeWidth:2.4,...s,children:i.jsx("path",{d:"M12 5v14M5 12h14"})}),Ka=({dir:s="right",...f})=>i.jsx("svg",{...no,strokeWidth:2,...f,children:i.jsx("path",{d:s==="left"?"m14.5 5-7 7 7 7":"m9.5 5 7 7-7 7"})}),Xc=s=>i.jsxs("svg",{...no,...s,children:[i.jsx("path",{d:"M3 7h11v9H3zM14 10h4l3 3v3h-7z"}),i.jsx("circle",{cx:"7",cy:"18",r:"1.6"}),i.jsx("circle",{cx:"17.5",cy:"18",r:"1.6"})]}),Of=({filled:s,...f})=>i.jsx("svg",{...no,strokeWidth:2,fill:s?"currentColor":"none",...f,children:i.jsx("path",{d:"M12 20.5s-7.3-4.6-9.9-9.1C.5 8 1.9 4.6 5.1 3.6c2-.6 4.1.1 5.4 1.8l1.5 2 1.5-2c1.3-1.7 3.4-2.4 5.4-1.8 3.2 1 4.6 4.4 3 7.8-2.6 4.5-9.9 9.1-9.9 9.1Z"})}),nl=({price:s,originalPrice:f,from:u})=>i.jsxs("p",{className:"gzp-price",children:[u&&i.jsx("span",{className:"gzp-price-from",children:"From"}),ft(s),f>s&&i.jsx("s",{children:ft(f)})]}),Za=({src:s,alt:f,icon:u,className:k})=>{const[w,_]=z.useState(!1);return z.useEffect(()=>_(!1),[s]),s&&!w?i.jsx("img",{src:s,alt:f,className:k,loading:"lazy",onError:()=>_(!0)}):i.jsx("div",{className:"gzp-media-fallback",children:u||"🍽️"})},hn=s=>typeof s!="number"?null:s<=0?{text:"Sold out",out:!0}:s<=5?{text:`Only ${s} left`,out:!1}:null,Ff=({slides:s,onSlideClick:f})=>{var ge;const[u,k]=z.useState(0),[w,_]=z.useState(!1),q=z.useRef(typeof window<"u"&&((ge=window.matchMedia)==null?void 0:ge.call(window,"(prefers-reduced-motion: reduce)").matches)).current;if(z.useEffect(()=>{if(s.length<=1||w||q)return;const O=setInterval(()=>k(T=>(T+1)%s.length),4200);return()=>clearInterval(O)},[s.length,w,q]),z.useEffect(()=>{u>=s.length&&k(0)},[s.length,u]),s.length===0)return i.jsx("div",{className:"gzp-slider","aria-hidden":"true",children:i.jsx("div",{className:"gzp-slider-fallback",children:i.jsx("img",{src:ro,alt:""})})});const Y=s[u],$=!!f;return i.jsxs("div",{className:"gzp-slider",onMouseEnter:()=>_(!0),onMouseLeave:()=>_(!1),onTouchStart:()=>_(!0),onTouchEnd:()=>_(!1),onClick:$?()=>f(Y):void 0,role:$?"button":void 0,tabIndex:$?0:void 0,onKeyDown:$?O=>{(O.key==="Enter"||O.key===" ")&&f(Y)}:void 0,children:[s.map((O,T)=>i.jsx("img",{src:O.url,alt:O.alt||"","aria-hidden":T!==u||void 0,className:`gzp-slider-img${T===u?" is-active":""}`},O.url+T)),s.length>1&&i.jsx("div",{className:"gzp-slider-dots",role:"tablist","aria-label":"Featured photos",children:s.map((O,T)=>i.jsx("button",{type:"button",role:"tab","aria-selected":T===u,"aria-label":`Show photo ${T+1} of ${s.length}`,className:`gzp-slider-dot${T===u?" is-active":""}`,onClick:B=>{B.stopPropagation(),k(T)}},T))})]})},Df=()=>i.jsxs("svg",{viewBox:"0 0 140 140",className:"gzp-thankyou-mascot","aria-hidden":"true",children:[i.jsxs("g",{stroke:"#e0b84a",strokeWidth:"3",strokeLinecap:"round",fill:"none",opacity:"0.75",children:[i.jsx("path",{d:"M52 20 C 47 12, 57 9, 53 1"}),i.jsx("path",{d:"M70 20 C 65 12, 75 9, 71 1"}),i.jsx("path",{d:"M88 20 C 83 12, 93 9, 89 1"})]}),i.jsx("path",{d:"M20 32 L120 32 L70 132 Z",fill:"#ffcf5c",stroke:"#e0a92e",strokeWidth:"4",strokeLinejoin:"round"}),i.jsx("path",{d:"M20 32 Q70 47 120 32",fill:"none",stroke:"#e0a92e",strokeWidth:"4",strokeLinecap:"round"}),i.jsx("circle",{cx:"52",cy:"58",r:"6",fill:"#e6503d"}),i.jsx("circle",{cx:"88",cy:"62",r:"6",fill:"#e6503d"}),i.jsx("circle",{cx:"70",cy:"90",r:"6",fill:"#e6503d"}),i.jsx("circle",{cx:"56",cy:"76",r:"5.5",fill:"#3a2b1a"}),i.jsx("circle",{cx:"84",cy:"76",r:"5.5",fill:"#3a2b1a"}),i.jsx("path",{d:"M60 96 Q70 104 80 96",stroke:"#3a2b1a",strokeWidth:"3.5",fill:"none",strokeLinecap:"round"})]}),$f=({order:s,onTrack:f,onContinue:u})=>{const k=String((s==null?void 0:s._id)||"").slice(-6).toUpperCase();return i.jsx("div",{className:"gzp-thankyou-overlay",role:"dialog","aria-modal":"true","aria-label":"Order confirmed",children:i.jsxs("div",{className:"gzp-thankyou-card",children:[i.jsx("span",{className:"gzp-thankyou-sticker tl","aria-hidden":"true",children:"🎉"}),i.jsx("span",{className:"gzp-thankyou-sticker tr","aria-hidden":"true",children:"🍕"}),i.jsx("span",{className:"gzp-thankyou-sticker bl","aria-hidden":"true",children:"🧀"}),i.jsx("span",{className:"gzp-thankyou-sticker br","aria-hidden":"true",children:"🎊"}),i.jsx("div",{className:"gzp-thankyou-badge",children:i.jsx("img",{src:ro,alt:"GenZ Pizza Land"})}),i.jsx(Df,{}),i.jsx("h2",{className:"gzp-thankyou-title",children:"Thank you! 🎉"}),i.jsx("p",{className:"gzp-thankyou-sub",children:(s==null?void 0:s.orderStatus)===es?"We'll verify your payment and confirm your order shortly.":"Your order's in and the kitchen's already looking at it."}),k&&i.jsxs("span",{className:"gzp-thankyou-pill",children:["Order #",k]}),i.jsx("button",{type:"button",className:"gzp-thankyou-track-btn",onClick:f,children:"Track My Order"}),i.jsx("button",{type:"button",className:"gzp-thankyou-link",onClick:u,children:"Click for more order"})]})})},ol=({qty:s,onAdd:f,onRemove:u,size:k,label:w})=>i.jsxs("div",{className:`gzp-stepper${k==="lg"?" gzp-stepper-lg":""}`,children:[i.jsx("button",{type:"button",onClick:u,"aria-label":`Remove one ${w}`,children:"−"}),i.jsx("span",{"aria-live":"polite",children:s}),i.jsx("button",{type:"button",onClick:f,"aria-label":`Add one more ${w}`,children:"+"})]}),Af=({dish:s,cart:f,cartKey:u,addToCart:k,removeFromCart:w,onOpenQuickView:_})=>{const q=z.useMemo(()=>qa(s),[s]),Y=q.length>0,[$,ge]=z.useState(q[0]||""),O=z.useMemo(()=>rl(s,$),[s,$]),[T,B]=z.useState(O[0]||""),[se,ae]=z.useState(!1);z.useEffect(()=>{O.length>0&&!O.includes(T)?B(O[0]):O.length===0&&T!==""&&B("")},[$]);const J=Y?Xa(s,$,T):null,F=Y?Gc(s):null,te=Y?(J==null?void 0:J.price)??(F==null?void 0:F.price)??s.price:s.price,xe=Y?(J==null?void 0:J.originalPrice)??0:s.originalPrice,Ne=u("dish",s._id,$,T),he=f[Ne]||0,oe=hn(s.availableQty),ve=!!(oe!=null&&oe.out),ye=(!Y||!!J)&&!ve,Ce=()=>_(s);return i.jsxs("div",{className:"gzp-card",children:[i.jsxs("div",{className:"gzp-card-media",role:"button",tabIndex:0,onClick:Ce,onKeyDown:re=>re.key==="Enter"&&Ce(),children:[i.jsx(Za,{src:Gt(s.image),alt:s.name,icon:s.icon}),oe&&i.jsx("span",{className:`gzp-stock${oe.out?" is-out":""}`,children:oe.text}),!Y&&s.originalPrice>s.price&&i.jsxs("span",{className:"gzp-save",children:["Save ",Math.round((s.originalPrice-s.price)/s.originalPrice*100),"%"]}),i.jsx("button",{type:"button",className:`gzp-wish${se?" is-active":""}`,onClick:re=>{re.stopPropagation(),ae(He=>!He)},"aria-pressed":se,"aria-label":se?`Remove ${s.name} from favourites`:`Add ${s.name} to favourites`,children:i.jsx(Of,{filled:se})})]}),i.jsxs("div",{className:"gzp-card-body",children:[i.jsx("h3",{role:"button",tabIndex:0,onClick:Ce,onKeyDown:re=>re.key==="Enter"&&Ce(),children:s.name}),i.jsx(nl,{price:te,originalPrice:xe,from:Y}),s.description&&i.jsx("p",{className:"gzp-card-desc",children:s.description}),Y&&i.jsxs("div",{className:"gzp-variant-row",onClick:re=>re.stopPropagation(),role:"presentation",children:[i.jsx("select",{className:"gzp-select",value:$,onChange:re=>ge(re.target.value),"aria-label":`Size for ${s.name}`,children:q.map(re=>i.jsx("option",{value:re,children:re},re))}),O.length>0&&i.jsx("select",{className:"gzp-select",value:T,onChange:re=>B(re.target.value),"aria-label":`Crust for ${s.name}`,children:O.map(re=>i.jsx("option",{value:re,children:re},re))})]}),i.jsx("div",{className:"gzp-card-foot",onClick:re=>re.stopPropagation(),role:"presentation",children:he?i.jsx(ol,{qty:he,label:s.name,onAdd:()=>k("dish",s._id,s.name,$,T),onRemove:()=>w("dish",s._id,$,T)}):i.jsx("button",{type:"button",className:"gzp-add gzp-add-wide",disabled:!ye,onClick:()=>k("dish",s._id,s.name,$,T),children:ve?"Sold out":i.jsxs(i.Fragment,{children:[i.jsx(If,{})," Add"]})})})]})]})},Bf=()=>i.jsxs("div",{className:"gzp-skeleton",children:[i.jsx("div",{className:"gzp-skeleton-media"}),i.jsxs("div",{className:"gzp-skeleton-lines",children:[i.jsx("i",{}),i.jsx("i",{})]})]}),Uf=()=>i.jsx("a",{className:"gzp-whatsapp",href:Kc,target:"_blank",rel:"noopener noreferrer","aria-label":"Chat with us on WhatsApp for any inquiry",title:"WhatsApp inquiry: +92 325 9061006",children:i.jsx("svg",{viewBox:"0 0 32 32",width:"30",height:"30","aria-hidden":"true",fill:"#fff",children:i.jsx("path",{d:"M16.03 3C9.4 3 4 8.38 4 15c0 2.12.56 4.19 1.62 6.01L4 29l8.2-1.58A12.02 12.02 0 0 0 16.03 27C22.66 27 28 21.62 28 15S22.66 3 16.03 3zm0 21.9c-1.8 0-3.56-.48-5.1-1.4l-.37-.22-4.86.94.98-4.73-.24-.39A9.86 9.86 0 0 1 6.1 15c0-5.46 4.45-9.9 9.93-9.9S26 9.54 26 15s-4.5 9.9-9.97 9.9zm5.44-7.4c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.27-.47-2.42-1.49-.9-.8-1.5-1.78-1.67-2.08-.17-.3-.02-.46.13-.61.14-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.05 1.03-1.05 2.5s1.08 2.9 1.23 3.1c.15.2 2.12 3.23 5.13 4.53.72.31 1.28.5 1.71.63.72.23 1.37.2 1.89.12.58-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.13-.27-.2-.57-.35z"})})}),Ga=({minimal:s,cartCount:f,onSearch:u,onCart:k,onNavigate:w,onTrack:_})=>i.jsx("header",{className:"gzp-header",children:i.jsxs("div",{className:"gzp-header-inner",children:[i.jsxs("button",{className:"gzp-brand",onClick:()=>window.scrollTo({top:0,behavior:"smooth"}),type:"button",children:[i.jsx("img",{src:ro,alt:"",className:"gzp-brand-mark"}),i.jsxs("span",{className:"gzp-brand-name",children:["GenZ Pizza Land",i.jsx("span",{className:"gzp-brand-sub",children:"Delivered hot across Gojra"})]})]}),!s&&i.jsxs(i.Fragment,{children:[i.jsxs("nav",{className:"v2-links","aria-label":"Site",children:[i.jsx("button",{type:"button",className:"v2-link",onClick:()=>w==null?void 0:w("menu"),children:"Menu"}),i.jsx("button",{type:"button",className:"v2-link",onClick:()=>w==null?void 0:w("deals"),children:"Deals"}),i.jsx("button",{type:"button",className:"v2-link",onClick:()=>w==null?void 0:w("reviews"),children:"Reviews"}),i.jsx("button",{type:"button",className:"v2-link",onClick:()=>w==null?void 0:w("contact"),children:"Contact"})]}),i.jsxs("button",{className:"v2-track-btn",onClick:_,type:"button",children:[i.jsx(Xc,{})," Track order"]}),i.jsx("button",{className:"gzp-icon-btn",onClick:u,"aria-label":"Search the menu",type:"button",children:i.jsx(qc,{})}),i.jsxs("button",{className:"gzp-icon-btn gzp-cart-btn",onClick:k,"aria-label":`Your order, ${f} item${f===1?"":"s"}`,type:"button",children:[i.jsx(Mf,{}),f>0&&i.jsx("span",{className:"gzp-cart-count",children:f})]})]})]})});function Wf(){var Nr,tn,Yo,Ko,Tn,co,Ln,Cr;const[s,f]=z.useState([]),[u,k]=z.useState([]),[w,_]=z.useState([]),[q,Y]=z.useState([]),[$,ge]=z.useState(_f),[O,T]=z.useState(()=>Ya(null)),[B,se]=z.useState(!1),[ae,J]=z.useState({}),[F,te]=z.useState(!1),[xe,Ne]=z.useState(!1),[he,oe]=z.useState(!0),[ve,ye]=z.useState(""),[Ce,re]=z.useState(!1),[He,Le]=z.useState(!1),[I,ne]=z.useState(()=>localStorage.getItem("gzp_last_order")||null),[S,A]=z.useState(null),[ce,me]=z.useState(!1),[L,W]=z.useState(!1),D=S&&!["Completed","Closed","Cancelled"].includes(S.orderStatus),[h,j]=z.useState({name:"",phone:"",address:""}),[ue,we]=z.useState(Xi);z.useEffect(()=>{let c=null;const v=()=>{document.body.classList.add("is-scrolling"),c&&clearTimeout(c),c=setTimeout(()=>document.body.classList.remove("is-scrolling"),150)};return window.addEventListener("scroll",v,{passive:!0,capture:!0}),()=>{window.removeEventListener("scroll",v,{capture:!0}),c&&clearTimeout(c),document.body.classList.remove("is-scrolling")}},[]);const[ke,be]=z.useState(!1),[_e,Te]=z.useState(""),[M,Be]=z.useState(null),[$t,Wr]=z.useState(""),[_t,or]=z.useState(""),[vr,Hr]=z.useState({});z.useEffect(()=>{if((M==null?void 0:M.type)==="dish"){const v=qa(M.item)[0]||"";Wr(v),or(rl(M.item,v)[0]||""),Hr({})}else if((M==null?void 0:M.type)==="deal"){Wr(""),or("");const c={};(M.item.items||[]).forEach((v,b)=>{var Q;if(!v.customizable)return;const P=(v.flavourOptions||[])[0];if(!P)return;const H=(Q=P.variants)==null?void 0:Q[0];c[b]={dishId:P._id,size:(H==null?void 0:H.size)||"",crust:(H==null?void 0:H.crust)||""}}),Hr(c)}else Wr(""),or(""),Hr({})},[M]);const[gn,oo]=z.useState(""),[xr,mt]=z.useState(!1),[yr,io]=z.useState(null),[At,lo]=z.useState(Va),[wr,vn]=z.useState(Ji),zt=tf(),[Qr,xn]=z.useState(""),[br,zr]=z.useState(!1),[Bo,yn]=z.useState(""),wn=z.useRef(null),[Uo,Xt]=z.useState(!1),bn=z.useRef(null),Vr=z.useRef(null);z.useEffect(()=>{(async()=>{var c,v,b;try{const[P,H,Q,ee,de]=await Promise.all([Ap(),Nc(),Cc().catch(()=>({data:[]})),Bp().catch(()=>({data:[]})),_c().catch(()=>null)]);f(P.data||[]),k(H.data||[]),_(Q.data||[]),Y(ee.data||[]);const Se=(c=de==null?void 0:de.data)==null?void 0:c.taxRatePercent;typeof Se=="number"&&ge(Se),(v=de==null?void 0:de.data)!=null&&v.payments&&lo({...Va,...de.data.payments}),(b=de==null?void 0:de.data)!=null&&b.buildYourOwnDeal&&T(Ya(de.data.buildYourOwnDeal))}catch(P){ye(P.message)}finally{oe(!1)}})()},[]),z.useEffect(()=>{if(!I)return;let c=!1;const v=async()=>{try{const P=await Ec(I);c||A(P.data)}catch(P){if(c)return;P.status===404&&(localStorage.removeItem("gzp_last_order"),ne(null),A(null))}};v();const b=setInterval(v,8e3);return()=>{c=!0,clearInterval(b)}},[I]),z.useEffect(()=>()=>clearTimeout(Vr.current),[]);const kr=z.useMemo(()=>{const c=new Map;u.forEach(H=>{var ee;const Q=((ee=H.category)==null?void 0:ee._id)||H.category||"other";c.has(Q)||c.set(Q,[]),c.get(Q).push(H)});const v=s.filter(H=>(c.get(H._id)||[]).length>0).map(H=>({id:H._id,name:H.name,icon:H.icon,description:H.description,items:c.get(H._id)})),b=new Set(s.map(H=>H._id)),P=u.filter(H=>{var Q;return!b.has(((Q=H.category)==null?void 0:Q._id)||H.category)});return P.length>0&&v.push({id:"other",name:"More to eat",icon:"🍽️",items:P}),v},[s,u]),Pt=z.useMemo(()=>{const c=kr.map(v=>({id:v.id,name:v.name}));return w.length>0&&c.unshift({id:Xi,name:"Deals"}),c},[kr,w]),jr=z.useMemo(()=>{const c={};return s.forEach(v=>{c[v._id]=v.name}),c},[s]),ir=z.useMemo(()=>{const c=_e.trim().toLowerCase();if(!c)return[];const v=[];return w.forEach(b=>{b.name.toLowerCase().includes(c)&&v.push({type:"deal",item:b})}),u.forEach(b=>{b.name.toLowerCase().includes(c)&&v.push({type:"dish",item:b})}),v.slice(0,20)},[_e,u,w]),Zt=(c,v,b="",P="")=>`${c}:${v}:${b||""}||${P||""}`,ao=c=>{try{return`sel:${btoa(encodeURIComponent(JSON.stringify(c)))}`}catch{return"sel:"}},Wo=c=>{if(!c||!c.startsWith("sel:"))return null;try{return JSON.parse(decodeURIComponent(atob(c.slice(4))))}catch{return null}},Yr=c=>((c==null?void 0:c.items)||[]).some(v=>v.customizable),Jt=z.useMemo(()=>Object.entries(ae).filter(([,c])=>c>0).map(([c,v])=>{const[b,P,H="||"]=c.split(":"),Q=b==="deal"?w.find(Re=>Re._id===P):u.find(Re=>Re._id===P);if(!Q)return null;const[ee,de]=H.split("||");let Se=Q.price,De=Q.originalPrice,Ie="",Ye=null;if((b==="dish"||b==="byo")&&ee){const Re=Xa(Q,ee,de);Re&&(Se=Re.price,De=Re.originalPrice,Ie=[Re.size,Re.crust].filter(Boolean).join(", "))}if(b==="deal"){const Re=Wo(ee);Re&&(Ye=Re,Ie=Object.values(Re).map(lt=>{const Z=u.find(je=>je._id===lt.dishId);return Z?[lt.size,Z.name].filter(Boolean).join(" "):null}).filter(Boolean).join(", "))}return{type:b,item:Q,qty:v,key:c,size:ee,crust:de,unitPrice:Se,unitOriginalPrice:De,variantLabel:Ie,dealSelections:Ye}}).filter(Boolean),[ae,u,w]),zn=Jt.reduce((c,v)=>c+v.unitPrice*v.qty,0),Kr=Jt.filter(c=>c.type==="byo"),ht=Kr.reduce((c,v)=>c+v.qty,0),so=Kr.reduce((c,v)=>c+v.unitPrice*v.qty,0),lr=ht>0?il(ht,O):0,Gr=Math.round(so*lr/100),Bt=ht>0&&O.enabled?Math.max(0,O.minItems-ht):0,ar=ht>0&&(Bt>0||!O.enabled),qr=zn-Gr,kn=qr*$/100,jn=qr+kn,Sn=Jt.reduce((c,v)=>c+v.qty,0),Sr=z.useCallback((c,v=2e3)=>{oo(c),clearTimeout(Vr.current),Vr.current=setTimeout(()=>oo(""),v)},[]),Fe=z.useRef(ae);Fe.current=ae;const Nn=z.useRef({dishes:u,deals:w});Nn.current={dishes:u,deals:w};const Ho=(c,v,b)=>{const P=v==="deal"?["deal"]:["dish","byo"];return Object.entries(c).reduce((H,[Q,ee])=>P.some(de=>Q.startsWith(`${de}:${b}:`))?H+ee:H,0)},ll=(c,v)=>(c==="deal"?Nn.current.deals:Nn.current.dishes).find(b=>b._id===v),Ut=z.useCallback((c,v,b,P="",H="",Q=null)=>{const ee=ll(c,v),de=b||(ee==null?void 0:ee.name)||"This item",Se=typeof(ee==null?void 0:ee.availableQty)=="number"?ee.availableQty:1/0;if(Ho(Fe.current,c,v)+1>Se){Sr(Se<=0?`Sorry, ${de} is out of stock right now.`:`Only ${Se} ${de} in stock. Please select ${Se}.`,3500);return}const Ie=Q?Zt(c,v,ao(Q)):Zt(c,v,P,H);Fe.current={...Fe.current,[Ie]:(Fe.current[Ie]||0)+1},J(Fe.current),b&&Sr(`${b} added`)},[Sr]),Xr=z.useCallback((c,v,b="",P="")=>{const H=Zt(c,v,b,P);Fe.current={...Fe.current,[H]:Math.max(0,(Fe.current[H]||0)-1)},J(Fe.current)},[]),Cn=z.useCallback(async()=>{var c,v,b;try{const[P,H,Q]=await Promise.all([Nc(),Cc().catch(()=>null),_c().catch(()=>null)]);k(P.data||[]),H&&_(H.data||[]),(c=Q==null?void 0:Q.data)!=null&&c.buildYourOwnDeal&&T(Ya(Q.data.buildYourOwnDeal)),typeof((v=Q==null?void 0:Q.data)==null?void 0:v.taxRatePercent)=="number"&&ge(Q.data.taxRatePercent),(b=Q==null?void 0:Q.data)!=null&&b.payments&&lo({...Va,...Q.data.payments})}catch{}},[]);z.useEffect(()=>{if(he)return;const c=()=>{document.hidden||Cn()},v=setInterval(c,Rf);return document.addEventListener("visibilitychange",c),window.addEventListener("focus",c),()=>{clearInterval(v),document.removeEventListener("visibilitychange",c),window.removeEventListener("focus",c)}},[he,Cn]),z.useEffect(()=>{const c=Fe.current,v={};Object.entries(c).forEach(([H,Q])=>{if(Q<=0)return;const[ee,de]=H.split(":"),Se=ee==="byo"?"dish":ee;(v[`${Se}:${de}`]=v[`${Se}:${de}`]||[]).push(H)});let b=c;const P=[];Object.entries(v).forEach(([H,Q])=>{const[ee,de]=H.split(":"),Se=(ee==="deal"?w:u).find(Ie=>Ie._id===de);if(!Se||typeof Se.availableQty!="number")return;let De=Q.reduce((Ie,Ye)=>Ie+b[Ye],0);if(!(De<=Se.availableQty)){b={...b};for(const Ie of[...Q].reverse()){if(De<=Se.availableQty)break;const Ye=Math.min(b[Ie],De-Se.availableQty);b[Ie]-=Ye,De-=Ye}P.push(Se.availableQty<=0?`${Se.name} just sold out and was removed from your order.`:`Only ${Se.availableQty} ${Se.name} in stock - your order was set to ${Se.availableQty}.`)}}),P.length>0&&(Fe.current=b,J(b),Sr(P.join(" "),5e3))},[u,w,Sr]);const Zr=c=>{const v=document.getElementById(`section-${c}`);v&&(we(c),v.scrollIntoView({behavior:"smooth",block:"start"}))},uo=c=>{var b,P;if(c==="menu"){const H=w.length>0?Xi:(b=Pt[0])==null?void 0:b.id;if(H)return Zr(H)}if(c==="deals"&&w.length===0)return Zr((P=Pt[0])==null?void 0:P.id);const v=document.getElementById(`section-${c}`);v&&v.scrollIntoView({behavior:"smooth",block:"start"})};z.useEffect(()=>{if(he||I)return;let c=0;const v=()=>{c||(c=requestAnimationFrame(()=>{var H;c=0;const b=160;let P=(H=Pt[0])==null?void 0:H.id;Pt.forEach(Q=>{const ee=document.getElementById(`section-${Q.id}`);ee&&ee.getBoundingClientRect().top<=b&&(P=Q.id)}),P&&we(P)}))};return v(),window.addEventListener("scroll",v,{passive:!0}),()=>{window.removeEventListener("scroll",v),cancelAnimationFrame(c)}},[Pt,he,I]),z.useEffect(()=>{var v;const c=(v=bn.current)==null?void 0:v.querySelector(".is-active");c==null||c.scrollIntoView({block:"nearest",inline:"center",behavior:"smooth"})},[ue]);const Qo=c=>{const v=wn.current;v&&v.scrollBy({left:c*(v.clientWidth*.8),behavior:"smooth"})};z.useEffect(()=>{const c=wn.current;if(he||w.length<2||Uo||!c||window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;const v=window.setInterval(()=>{const b=c.querySelector(".gzp-deal"),P=c.scrollWidth-c.clientWidth;if(!b||P<=0)return;const H=Number.parseFloat(window.getComputedStyle(c).columnGap)||0,Q=b.getBoundingClientRect().width+H;c.scrollLeft>=P-2?c.scrollTo({left:0,behavior:"smooth"}):c.scrollBy({left:Math.min(Q,P-c.scrollLeft),behavior:"smooth"})},4e3);return()=>window.clearInterval(v)},[w.length,Uo,he]);const Ue=F||xe||xr||ke||!!M;z.useEffect(()=>(document.body.style.overflow=Ue?"hidden":"",()=>{document.body.style.overflow=""}),[Ue]),z.useEffect(()=>{const c=v=>{v.key==="Escape"&&(ke?be(!1):M?Be(null):xe?Ne(!1):xr?mt(!1):F&&te(!1))};return window.addEventListener("keydown",c),()=>window.removeEventListener("keydown",c)},[ke,M,xe,xr,F]);const al=z.useMemo(()=>{if(q.length>0)return q.map(b=>({url:Gt(b.image),link:b.link||"",alt:b.altText||""}));const c=new Set,v=[];return[...w,...u].forEach(b=>{const P=Gt(b.image);P&&!c.has(P)&&(c.add(P),v.push({url:P,link:"",alt:""}))}),v.slice(0,8)},[q,w,u]);z.useEffect(()=>{wr===Ji&&!At.codEnabled&&At.jazzcashEnabled&&vn(el),wr===el&&!At.jazzcashEnabled&&At.codEnabled&&vn(Ji)},[At,wr]);const sr=wr===el&&At.jazzcashEnabled,Vo=!Ce&&(!sr||zt.ready),En=async c=>{if(c.preventDefault(),Jt.length!==0){if(ar){ye(O.enabled?`Build Your Own Deal needs at least ${O.minItems} items - add ${Bt} more or remove the deal.`:"Build Your Own Deal isn't available right now - please remove it from your order.");return}if(!Ic(h.phone)){ye("That mobile number doesn't look complete. Use digits only, e.g. 03001234567.");return}if(sr&&!zt.ready){ye("Please add your Transaction ID, sender name/number and payment screenshot first.");return}re(!0),ye("");try{const v=await Up({customerName:h.name,customerPhone:h.phone,address:h.address,...sr?{paymentMethod:"jazzcash",tid:zt.tid,senderInfo:zt.sender,proofId:zt.proofId}:{paymentMethod:"cod"},items:Jt.map(P=>P.type==="deal"?{dealId:P.item._id,quantity:P.qty,dealSelections:P.dealSelections||void 0}:{dishId:P.item._id,quantity:P.qty,size:P.size||void 0,crust:P.crust||void 0,byo:P.type==="byo"?!0:void 0})}),b=v.data._id;localStorage.setItem("gzp_last_order",b),ne(b),A(v.data),me(!0),W(!1),zt.reset(),J({}),Ne(!1),te(!1),window.scrollTo({top:0})}catch(v){(v.status===409||/Build Your Own/i.test(v.message||""))&&Cn(),ye(v.message)}finally{re(!1)}}},sl=async()=>{if(!(!I||He)){Le(!0);try{const c=await Ec(I);A(c.data)}catch(c){c.status===404&&(localStorage.removeItem("gzp_last_order"),ne(null),A(null))}finally{Le(!1)}}},[_n,Jr]=z.useState(!1),Tt=async()=>{if(!(!I||_n)&&window.confirm("Cancel this order? You won't be charged anything.")){Jr(!0);try{const c=await Wp(I);A(v=>v&&{...v,orderStatus:c.data.orderStatus})}catch(c){window.alert(c.message||"Couldn't cancel the order — please call the shop.")}finally{Jr(!1)}}},ul=()=>{localStorage.removeItem("gzp_last_order"),ne(null),A(null)},kt=async c=>{c.preventDefault();const v=Qr.trim();if(v){if(!Ic(v)){yn("Enter the full mobile number you used at checkout, digits only.");return}zr(!0),yn("");try{const b=await Hp(v);localStorage.setItem("gzp_last_order",b.data._id),ne(b.data._id),A(b.data),mt(!1),xn("")}catch(b){yn(b.status===404?"No recent order on that number. Check the digits and try again.":b.message||"Couldn't reach the kitchen. Try again in a moment.")}finally{zr(!1)}}},cl=()=>{const c={};return Object.entries(ae).forEach(([v,b])=>{v.startsWith("byo:")&&b>0&&(c[v.slice(4)]=b)}),c},dl=c=>{const v={};Object.entries(Fe.current).forEach(([b,P])=>{b.startsWith("byo:")||(v[b]=P)}),Object.entries(c).forEach(([b,P])=>{P>0&&(v[`byo:${b}`]=P)}),Fe.current=v,J(v),se(!1),te(!0),Sr("Your custom deal is in your order")},pl=()=>{const c={};Object.entries(Fe.current).forEach(([v,b])=>{v.startsWith("byo:")||(c[v]=b)}),Fe.current=c,J(c)},Pn=c=>Object.entries(Fe.current).reduce((v,[b,P])=>b.startsWith(`dish:${c}:`)?v+P:v,0),en=c=>i.jsxs("div",{className:"gzp-line",children:[Gt(c.item.image)?i.jsx("img",{src:Gt(c.item.image),alt:"",onError:v=>{v.currentTarget.style.display="none"}}):i.jsx("span",{className:"gzp-line-icon",children:c.item.icon||"🍽️"}),i.jsxs("div",{className:"gzp-line-main",children:[i.jsxs("h4",{children:[c.type==="deal"&&i.jsx("span",{className:"gzp-tag",children:"DEAL"}),c.item.name]}),c.variantLabel&&i.jsx("p",{className:"gzp-line-variant",children:c.variantLabel}),i.jsx("span",{children:ft(c.unitPrice*c.qty)})]}),i.jsx(ol,{qty:c.qty,label:c.item.name,onAdd:()=>Ut(c.type,c.item._id,"",c.size,c.crust),onRemove:()=>Xr(c.type,c.item._id,c.size,c.crust)})]},c.key);if(I&&!S)return i.jsxs("div",{className:"gzp-app",children:[i.jsx(Ga,{minimal:!0}),i.jsxs("div",{className:"gzp-boot",children:[i.jsx("img",{src:ro,alt:""}),"Pulling up your order…"]})]});if(I&&S&&ce)return i.jsx($f,{order:S,onTrack:()=>me(!1),onContinue:()=>{me(!1),W(!0)}});if(I&&S&&!L){const c=((Nr=S.payment)==null?void 0:Nr.method)==="JazzCash/Raast",v=c?Tf:Pf,b=v.indexOf(S.orderStatus),P=S.orderStatus==="Cancelled",H=String(S._id||"").slice(-6).toUpperCase(),Q=`https://wa.me/${Yc}?text=${encodeURIComponent(`Hello GenZ Pizza Land, I need help with order #${H}.`)}`;return i.jsxs("div",{className:"gzp-app",children:[i.jsx(Ga,{minimal:!0}),i.jsx("div",{className:"gzp-shell",children:i.jsxs("section",{className:"gzp-track",children:[i.jsxs("div",{className:"gzp-track-hero",children:[i.jsxs("div",{className:"gzp-track-top",children:[i.jsxs("div",{style:{flex:1},children:[i.jsx("h1",{children:Lf[S.orderStatus]||"Order status"}),i.jsxs("p",{className:"gzp-track-id",children:["Order #",String(S._id||"").slice(-6).toUpperCase()," for"," ",((tn=S.customerDetails)==null?void 0:tn.name)||"you"]})]}),i.jsx("button",{type:"button",className:"gzp-btn gzp-btn-ghost",onClick:sl,disabled:He,children:He?"Checking…":"Refresh"})]}),i.jsx(lf,{order:S,whatsappHref:Q}),P?c?null:i.jsx("p",{className:"gzp-cancelled",children:"This order was cancelled. Nothing has been charged — you can order again any time."}):i.jsxs(i.Fragment,{children:[i.jsx("p",{className:"gzp-eta",children:"This page updates itself every few seconds. Keep it open and watch it move."}),i.jsx("ol",{className:"gzp-steps",children:v.map((ee,de)=>i.jsx("li",{className:de<b?"is-done":de===b?"is-current":"",children:Mc[ee]},ee))}),S.orderStatus==="Pending"&&i.jsx("button",{type:"button",className:"gzp-btn gzp-btn-ghost",style:{marginTop:14,color:"#E6392F",borderColor:"#E6392F"},onClick:Tt,disabled:_n,children:_n?"Cancelling…":"Cancel this order"})]})]}),i.jsxs("div",{className:"gzp-panel",children:[i.jsx("h3",{children:"What's coming"}),(S.items||[]).map((ee,de)=>{var Se;return i.jsxs("div",{children:[i.jsxs("div",{className:"gzp-order-line",children:[i.jsxs("span",{children:[ee.isDeal&&i.jsx("span",{className:"gzp-tag",children:"DEAL"}),ee.quantity,"× ",ee.name]}),i.jsx("span",{children:ft(ee.price*ee.quantity)})]}),ee.isDeal&&((Se=ee.dealItems)==null?void 0:Se.length)>0&&i.jsx("p",{className:"gzp-order-sub",children:ee.dealItems.map(De=>`${De.quantity>1?De.quantity+"× ":""}${De.label}`).join(", ")})]},de)}),i.jsxs("div",{className:"gzp-totals",style:{marginTop:14},children:[Number((Yo=S.bills)==null?void 0:Yo.discount)>0&&i.jsxs("div",{className:"is-discount",children:[i.jsx("span",{children:S.bills.discountLabel||"Build Your Own Deal discount"}),i.jsxs("span",{children:["−",ft(S.bills.discount)]})]}),i.jsxs("div",{className:"gzp-grand",children:[i.jsx("span",{children:c?((Ko=S.payment)==null?void 0:Ko.status)==="Verified"?"Paid via JazzCash/Raast":"Total (JazzCash/Raast)":"Pay on delivery"}),i.jsx("span",{children:ft(((Tn=S.bills)==null?void 0:Tn.totalWithTax)||0)})]})]})]}),((co=S.customerDetails)==null?void 0:co.address)&&i.jsxs("div",{className:"gzp-panel",children:[i.jsx("h3",{children:"Delivering to"}),i.jsx("p",{style:{margin:0,color:"var(--flour-dim)",fontSize:"0.93rem"},children:S.customerDetails.address})]}),i.jsx("a",{className:"gzp-btn gzp-btn-ghost gzp-btn-block pay-help",href:Q,target:"_blank",rel:"noopener noreferrer",children:"💬 Need help? Chat with us on WhatsApp"}),i.jsx("button",{className:"gzp-btn gzp-btn-ghost gzp-btn-block",style:{marginTop:12},onClick:ul,type:"button",children:"Start another order"})]})})]})}return i.jsxs("div",{className:"gzp-app",children:[i.jsx(Ga,{cartCount:Sn,onSearch:()=>be(!0),onCart:()=>te(!0),onNavigate:uo,onTrack:()=>mt(!0)}),L&&D&&i.jsxs("div",{className:"gzp-tracking-banner",children:[i.jsxs("span",{children:["Order #",String(S._id||"").slice(-6).toUpperCase()," — ",Mc[S.orderStatus]||S.orderStatus]}),i.jsx("button",{type:"button",onClick:()=>W(!1),children:"Track it"})]}),ve&&!xe&&i.jsx("div",{className:"gzp-shell",children:i.jsx("p",{className:"gzp-error gzp-error-banner",children:ve})}),i.jsx(pf,{summary:yr,onOrder:()=>uo("menu"),onTrack:()=>mt(!0)}),i.jsx("section",{className:"gzp-hero",children:i.jsx(Ff,{slides:al,onSlideClick:c=>{var v;c!=null&&c.link?window.open(c.link,"_blank","noopener,noreferrer"):Zr((v=Pt[0])==null?void 0:v.id)}})}),!he&&Pt.length>0&&i.jsx("nav",{className:"gzp-navbar","aria-label":"Menu sections",children:i.jsx("div",{className:"gzp-navbar-inner",children:i.jsx("div",{className:"gzp-navbar-chips",ref:bn,children:Pt.map(c=>i.jsx("button",{type:"button",className:`gzp-chip${ue===c.id?" is-active":""}`,onClick:()=>Zr(c.id),children:c.name},c.id))})})}),i.jsxs("div",{className:"gzp-shell",children:[he?i.jsxs("section",{className:"gzp-section",children:[i.jsxs("div",{className:"gzp-section-head",children:[i.jsx("h2",{children:"Loading the menu"}),i.jsx("div",{className:"gzp-section-rule"})]}),i.jsx("div",{className:"gzp-grid",children:Array.from({length:8}).map((c,v)=>i.jsx(Bf,{},v))})]}):i.jsxs(i.Fragment,{children:[O.enabled&&u.length>0&&i.jsx(zf,{cfg:O,pickedCount:ht,onStart:()=>se(!0)}),w.length>0&&i.jsxs("section",{className:"gzp-section",id:`section-${Xi}`,children:[i.jsxs("div",{className:"gzp-section-head",children:[i.jsx("h2",{children:"Today's deals"}),i.jsxs("span",{className:"gzp-section-count",children:[w.length," bundle",w.length===1?"":"s"]}),i.jsx("div",{className:"gzp-section-rule"}),i.jsxs("div",{className:"gzp-rail-nav",children:[i.jsx("button",{className:"gzp-rail-btn",onClick:()=>Qo(-1),"aria-label":"Scroll deals back",type:"button",children:i.jsx(Ka,{dir:"left"})}),i.jsx("button",{className:"gzp-rail-btn",onClick:()=>Qo(1),"aria-label":"Scroll deals forward",type:"button",children:i.jsx(Ka,{})})]})]}),i.jsx("div",{className:"gzp-rail-wrap",children:i.jsx("div",{className:"gzp-rail",ref:wn,onMouseEnter:()=>Xt(!0),onMouseLeave:()=>Xt(!1),onFocus:()=>Xt(!0),onBlur:c=>{c.currentTarget.contains(c.relatedTarget)||Xt(!1)},onPointerDown:c=>{c.pointerType!=="mouse"&&Xt(!0)},onPointerUp:c=>{c.pointerType!=="mouse"&&Xt(!1)},children:w.map(c=>{var P,H,Q;const v=Zt("deal",c._id),b=c.originalPrice>c.price?Math.round((c.originalPrice-c.price)/c.originalPrice*100):0;return i.jsxs("div",{className:"gzp-deal",role:"button",tabIndex:0,onClick:()=>Be({type:"deal",item:c}),onKeyDown:ee=>ee.key==="Enter"&&Be({type:"deal",item:c}),children:[i.jsxs("div",{className:"gzp-deal-media",children:[i.jsx(Za,{src:Gt(c.image),alt:c.name,icon:c.icon||"🔥"}),c.badge&&i.jsx("span",{className:"gzp-badge",children:c.badge}),b>0&&i.jsxs("span",{className:"gzp-save",children:["Save ",b,"%"]}),hn(c.availableQty)&&i.jsx("span",{className:`gzp-stock${hn(c.availableQty).out?" is-out":""}`,children:hn(c.availableQty).text})]}),i.jsxs("div",{className:"gzp-deal-body",children:[i.jsx("h3",{children:c.name}),((P=c.items)==null?void 0:P.length)>0?i.jsxs("ul",{className:"gzp-deal-contents",children:[c.items.slice(0,3).map((ee,de)=>i.jsxs("li",{children:[ee.quantity>1?`${ee.quantity}× `:"",ee.label]},de)),c.items.length>3&&i.jsxs("li",{className:"gzp-deal-more",children:["+",c.items.length-3," more in the box"]})]}):c.description&&i.jsx("p",{className:"gzp-deal-desc",children:c.description}),i.jsxs("div",{className:"gzp-deal-foot",onClick:ee=>ee.stopPropagation(),role:"presentation",children:[i.jsx(nl,{price:c.price,originalPrice:c.originalPrice}),ae[v]&&!Yr(c)?i.jsx(ol,{qty:ae[v],label:c.name,onAdd:()=>Ut("deal",c._id),onRemove:()=>Xr("deal",c._id)}):i.jsx("button",{type:"button",className:"gzp-add gzp-add-wide",disabled:(H=hn(c.availableQty))==null?void 0:H.out,onClick:()=>Yr(c)?Be({type:"deal",item:c}):Ut("deal",c._id,c.name),children:(Q=hn(c.availableQty))!=null&&Q.out?"Sold out":Yr(c)?"Choose & add":"Add deal"})]})]})]},c._id)})})})]}),kr.map(c=>i.jsxs("section",{className:"gzp-section",id:`section-${c.id}`,children:[i.jsxs("div",{className:"gzp-section-head",children:[i.jsx("h2",{children:c.name}),i.jsxs("span",{className:"gzp-section-count",children:[c.items.length," items"]}),i.jsx("div",{className:"gzp-section-rule"})]}),i.jsx("div",{className:"gzp-grid",children:c.items.map(v=>i.jsx(Af,{dish:v,cart:ae,cartKey:Zt,addToCart:Ut,removeFromCart:Xr,onOpenQuickView:b=>Be({type:"dish",item:b})},v._id))})]},c.id)),kr.length===0&&w.length===0&&i.jsx("section",{className:"gzp-section",children:i.jsxs("div",{className:"gzp-empty",children:[i.jsx("img",{src:ro,alt:"",className:"gzp-empty-logo"}),"The menu is being set up right now. Check back in a little while."]})})]}),i.jsx(mf,{}),i.jsx(xf,{onSummary:io}),i.jsx(hf,{}),i.jsx(yf,{whatsappLink:Kc,onTrack:()=>mt(!0)})]}),i.jsx(wf,{taxRatePercent:$,onNavigate:uo,onTrack:()=>mt(!0)}),Sn>0&&!F&&!xe&&i.jsxs("button",{className:"gzp-cartbar",onClick:()=>te(!0),type:"button",children:[i.jsxs("span",{className:"gzp-cartbar-label",children:[i.jsxs("small",{children:[Sn," item",Sn===1?"":"s"," in your order"]}),i.jsx("b",{children:ft(jn)})]}),i.jsx("span",{className:"gzp-cartbar-cta",children:"View order"})]}),i.jsx(Uf,{}),gn&&i.jsxs("div",{className:"gzp-toast",role:"status",children:[i.jsx("i",{children:"✓"}),gn]}),ke&&i.jsxs("div",{className:"gzp-search",onClick:()=>be(!1),children:[i.jsxs("div",{className:"gzp-search-bar",onClick:c=>c.stopPropagation(),children:[i.jsx(qc,{}),i.jsx("input",{autoFocus:!0,value:_e,onChange:c=>Te(c.target.value),placeholder:"Search for a pizza, burger or deal","aria-label":"Search the menu"}),i.jsx("button",{className:"gzp-btn gzp-btn-ghost",onClick:()=>be(!1),type:"button",children:"Close"})]}),i.jsxs("div",{className:"gzp-search-results",onClick:c=>c.stopPropagation(),children:[_e.trim()&&ir.length===0&&i.jsxs("p",{className:"gzp-search-empty",children:["Nothing matches “",_e.trim(),"”. Try a shorter word, like “pizza”."]}),ir.map(({type:c,item:v})=>{var b;return i.jsxs("button",{className:"gzp-result",type:"button",onClick:()=>{be(!1),Be({type:c,item:v})},children:[Gt(v.image)?i.jsx("img",{src:Gt(v.image),alt:"",onError:P=>{P.currentTarget.style.display="none"}}):i.jsx("span",{className:"gzp-result-icon",children:v.icon||"🍽️"}),i.jsxs("span",{className:"gzp-result-name",children:[v.name,i.jsx("span",{className:"gzp-result-cat",children:c==="deal"?"Deal":jr[((b=v.category)==null?void 0:b._id)||v.category]||"Menu"})]}),i.jsx(nl,{price:v.price})]},`${c}-${v._id}`)})]})]}),M&&i.jsx("div",{className:"gzp-overlay",onClick:()=>Be(null),children:i.jsxs("div",{className:"gzp-modal",onClick:c=>c.stopPropagation(),role:"dialog","aria-label":M.item.name,children:[i.jsxs("div",{className:"gzp-modal-media",children:[i.jsx(Za,{src:Gt(M.item.image),alt:M.item.name,icon:M.item.icon}),M.item.badge&&i.jsx("span",{className:"gzp-badge",children:M.item.badge}),i.jsx("button",{className:"gzp-modal-close",onClick:()=>Be(null),"aria-label":"Close",type:"button",children:"✕"})]}),i.jsxs("div",{className:"gzp-modal-body",children:[i.jsx("h2",{children:M.item.name}),M.type==="deal"&&((Ln=M.item.items)==null?void 0:Ln.length)>0&&i.jsx("ul",{className:"gzp-deal-contents",children:M.item.items.map((c,v)=>c.customizable?null:i.jsxs("li",{children:[c.quantity>1?`${c.quantity}× `:"",c.label]},v))}),M.type==="deal"&&((Cr=M.item.items)==null?void 0:Cr.map((c,v)=>{var Ye,Re,lt;if(!c.customizable)return null;const b=c.flavourOptions||[],P=vr[v]||{},H=[...new Map(b.map(Z=>{var je,pe;return[((je=Z.category)==null?void 0:je._id)||"",((pe=Z.category)==null?void 0:pe.name)||"Choose"]}))],Q=((Re=(Ye=b.find(Z=>Z._id===P.dishId))==null?void 0:Ye.category)==null?void 0:Re._id)||((lt=H[0])==null?void 0:lt[0])||"",ee=b.filter(Z=>{var je;return(((je=Z.category)==null?void 0:je._id)||"")===Q}),de=b.find(Z=>Z._id===P.dishId),Se=[...new Set(((de==null?void 0:de.variants)||[]).map(Z=>Z.size))],De=((de==null?void 0:de.variants)||[]).filter(Z=>Z.size===P.size&&Z.crust),Ie=Z=>Hr(je=>({...je,[v]:{...je[v],...Z}}));return i.jsxs("div",{className:"gzp-deal-choice",children:[i.jsxs("p",{className:"gzp-deal-choice-label",children:[c.quantity>1?`${c.quantity}× `:"",c.label," — pick yours"]}),i.jsxs("div",{className:"gzp-variant-row",children:[H.length>1&&i.jsx("select",{className:"gzp-select",value:Q,onChange:Z=>{var Xe;const je=b.find(nt=>{var Lt;return(((Lt=nt.category)==null?void 0:Lt._id)||"")===Z.target.value}),pe=(Xe=je==null?void 0:je.variants)==null?void 0:Xe[0];Ie({dishId:(je==null?void 0:je._id)||"",size:(pe==null?void 0:pe.size)||"",crust:(pe==null?void 0:pe.crust)||""})},"aria-label":`Category for ${c.label}`,children:H.map(([Z,je])=>i.jsx("option",{value:Z,children:je},Z))}),i.jsxs("select",{className:"gzp-select",value:P.dishId||"",onChange:Z=>{var Xe;const je=b.find(nt=>nt._id===Z.target.value),pe=(Xe=je==null?void 0:je.variants)==null?void 0:Xe[0];Ie({dishId:(je==null?void 0:je._id)||"",size:(pe==null?void 0:pe.size)||"",crust:(pe==null?void 0:pe.crust)||""})},"aria-label":`Flavour for ${c.label}`,children:[ee.length===0&&i.jsx("option",{value:"",children:"No flavours available"}),ee.map(Z=>i.jsx("option",{value:Z._id,children:Z.name},Z._id))]}),Se.length>0&&i.jsx("select",{className:"gzp-select",value:P.size||"",onChange:Z=>{var pe;const je=((de==null?void 0:de.variants)||[]).filter(Xe=>Xe.size===Z.target.value&&Xe.crust);Ie({size:Z.target.value,crust:je.some(Xe=>Xe.crust===P.crust)?P.crust:((pe=je[0])==null?void 0:pe.crust)||""})},"aria-label":`Size for ${c.label}`,children:Se.map(Z=>i.jsx("option",{value:Z,children:Z},Z))}),De.length>0&&i.jsx("select",{className:"gzp-select",value:P.crust||"",onChange:Z=>Ie({crust:Z.target.value}),"aria-label":`Crust for ${c.label}`,children:De.map(Z=>i.jsx("option",{value:Z.crust,children:Z.crust},Z.crust))})]})]},v)})),M.item.description&&i.jsx("p",{className:"gzp-deal-desc",children:M.item.description}),(()=>{const c=M.type==="dish",v=M.type==="deal",b=c?qa(M.item):[],P=b.length>0,H=c?rl(M.item,$t):[],Q=P?Xa(M.item,$t,_t):null,ee=P?Gc(M.item):null,de=P?(Q==null?void 0:Q.price)??(ee==null?void 0:ee.price)??M.item.price:M.item.price,Se=P?(Q==null?void 0:Q.originalPrice)??0:M.item.originalPrice,De=v&&Yr(M.item),Ie=!De||(M.item.items||[]).every((pe,Xe)=>{var Go;if(!pe.customizable)return!0;const nt=vr[Xe];if(!(nt!=null&&nt.dishId))return!1;const Lt=(pe.flavourOptions||[]).find(qo=>qo._id===nt.dishId);return((Go=Lt==null?void 0:Lt.variants)==null?void 0:Go.length)>0?!!nt.size:!0}),Ye=De?Zt(M.type,M.item._id,ao(vr)):Zt(M.type,M.item._id,$t,_t),Re=ae[Ye]||0,lt=(c?u:w).find(pe=>pe._id===M.item._id)||M.item,Z=hn(lt.availableQty),je=(!P||!!Q)&&Ie&&!(Z!=null&&Z.out);return i.jsxs(i.Fragment,{children:[i.jsx(nl,{price:de,originalPrice:Se,from:P}),Z&&i.jsx("p",{className:`gzp-stock-note${Z.out?" is-out":""}`,children:Z.text}),P&&i.jsxs("div",{className:"gzp-variant-row",children:[i.jsx("select",{className:"gzp-select",value:$t,onChange:pe=>{const Xe=pe.target.value;Wr(Xe);const nt=rl(M.item,Xe);or(nt.includes(_t)?_t:nt[0]||"")},"aria-label":`Size for ${M.item.name}`,children:b.map(pe=>i.jsx("option",{value:pe,children:pe},pe))}),H.length>0&&i.jsx("select",{className:"gzp-select",value:_t,onChange:pe=>or(pe.target.value),"aria-label":`Crust for ${M.item.name}`,children:H.map(pe=>i.jsx("option",{value:pe,children:pe},pe))})]}),i.jsx("div",{className:"gzp-modal-foot",children:Re?i.jsxs(i.Fragment,{children:[i.jsx(ol,{size:"lg",label:M.item.name,qty:Re,onAdd:()=>De?Ut(M.type,M.item._id,"","","",vr):Ut(M.type,M.item._id,"",$t,_t),onRemove:()=>{const[,,pe]=Ye.split(":"),[Xe,nt]=pe.split("||");Xr(M.type,M.item._id,Xe,nt)}}),i.jsx("button",{className:"gzp-btn gzp-btn-primary",onClick:()=>{Be(null),te(!0)},type:"button",children:"View order"})]}):i.jsxs("button",{className:"gzp-btn gzp-btn-primary gzp-btn-split",disabled:!je,onClick:()=>{De?Ut(M.type,M.item._id,M.item.name,"","",vr):Ut(M.type,M.item._id,M.item.name,$t,_t),Be(null)},type:"button",children:[i.jsx("span",{children:Z!=null&&Z.out?"Sold out":De&&!Ie?"Choose your options":"Add to order"}),i.jsx("span",{children:ft(de)})]})})]})})()]})]})}),B&&i.jsx(Nf,{cfg:O,dishes:u,categories:s,initialPicks:cl(),getOtherQty:Pn,onClose:()=>se(!1),onConfirm:dl}),F&&i.jsx("div",{className:"gzp-sheet-overlay",onClick:()=>te(!1),children:i.jsxs("div",{className:"gzp-sheet",onClick:c=>c.stopPropagation(),role:"dialog","aria-label":"Your order",children:[i.jsxs("div",{className:"gzp-sheet-head",children:[i.jsx("h2",{children:"Your order"}),i.jsx("button",{className:"gzp-icon-btn",onClick:()=>te(!1),"aria-label":"Close",type:"button",children:"✕"})]}),Jt.length===0?i.jsxs("div",{className:"gzp-sheet-body",children:[i.jsxs("div",{className:"gzp-empty",children:[i.jsx("span",{children:"🛒"}),"Nothing here yet. Add a deal or a pizza and it'll show up."]}),i.jsx("button",{className:"gzp-btn gzp-btn-primary",onClick:()=>te(!1),type:"button",children:"Back to the menu"})]}):i.jsxs(i.Fragment,{children:[i.jsxs("div",{className:"gzp-sheet-body",children:[Jt.filter(c=>c.type!=="byo").map(en),Kr.length>0&&i.jsxs("div",{className:"gzp-byo-cart",children:[i.jsxs("div",{className:"gzp-byo-cart-head",children:[i.jsx("h4",{children:"🎯 Your custom deal"}),i.jsx("button",{type:"button",onClick:()=>{te(!1),se(!0)},children:"Edit"})]}),i.jsx("p",{className:`gzp-byo-cart-note${Bt>0||!O.enabled?" is-warn":""}`,children:O.enabled?Hc(ht,O):"This deal isn't available right now."}),Kr.map(en),Gr>0&&i.jsxs("p",{className:"gzp-byo-cart-saving",children:["You save ",i.jsx("b",{children:ft(Gr)})," (",lr,"% off ",ht," items)"]})]})]}),i.jsxs("div",{className:"gzp-sheet-foot",children:[i.jsxs("div",{className:"gzp-totals",children:[i.jsxs("div",{children:[i.jsx("span",{children:"Subtotal"}),i.jsx("span",{children:ft(zn)})]}),Gr>0&&i.jsxs("div",{className:"is-discount",children:[i.jsxs("span",{children:["Custom deal discount (",lr,"%)"]}),i.jsxs("span",{children:["−",ft(Gr)]})]}),i.jsxs("div",{children:[i.jsxs("span",{children:["Tax (",$,"%)"]}),i.jsx("span",{children:ft(kn)})]}),i.jsxs("div",{className:"gzp-grand",children:[i.jsx("span",{children:"Total"}),i.jsx("span",{children:ft(jn)})]})]}),ar&&i.jsx("p",{className:"gzp-byo-warn",children:O.enabled?`Your custom deal needs ${Bt} more item${Bt===1?"":"s"} to qualify. Add more or remove the deal to continue.`:"The custom deal isn't available right now. Remove it to continue."}),i.jsx("button",{className:"gzp-btn gzp-btn-primary gzp-btn-block",onClick:()=>{te(!1),Ne(!0)},disabled:ar,type:"button",children:"Add delivery details"}),ar&&i.jsx("button",{type:"button",className:"gzp-btn gzp-btn-ghost gzp-btn-block",style:{marginTop:8},onClick:()=>{O.enabled?(te(!1),se(!0)):pl()},children:O.enabled?"Add more items to my deal":"Remove custom deal"})]})]})]})}),xe&&i.jsx("div",{className:"gzp-sheet-overlay",onClick:()=>Ne(!1),children:i.jsxs("div",{className:"gzp-sheet",onClick:c=>c.stopPropagation(),role:"dialog","aria-label":"Delivery details",children:[i.jsxs("div",{className:"gzp-sheet-head",children:[i.jsx("button",{className:"gzp-icon-btn",onClick:()=>{Ne(!1),te(!0)},"aria-label":"Back to your order",type:"button",children:i.jsx(Ka,{dir:"left"})}),i.jsx("h2",{children:"Where should we send it?"})]}),i.jsxs("form",{onSubmit:En,style:{display:"contents"},children:[i.jsx("div",{className:"gzp-sheet-body",children:i.jsxs("div",{className:"gzp-form",children:[i.jsxs("label",{className:"gzp-field",children:[i.jsx("span",{children:"Your name"}),i.jsx("input",{required:!0,value:h.name,onChange:c=>j({...h,name:c.target.value}),placeholder:"Who's the rider asking for?"})]}),i.jsxs("label",{className:"gzp-field",children:[i.jsx("span",{children:"Mobile number"}),i.jsx("input",{required:!0,type:"tel",inputMode:"numeric",pattern:"[0-9+]*",maxLength:14,value:h.phone,onChange:c=>j({...h,phone:Zi(c.target.value)}),onPaste:c=>{c.preventDefault();const v=(c.clipboardData||window.clipboardData).getData("text");j(b=>({...b,phone:Zi(b.phone+v)}))},placeholder:"03001234567"})]}),i.jsxs("label",{className:"gzp-field",children:[i.jsx("span",{children:"Delivery address"}),i.jsx("textarea",{required:!0,rows:3,value:h.address,onChange:c=>j({...h,address:c.target.value}),placeholder:"House or flat number, street, area, nearest landmark"})]}),i.jsx(nf,{cfg:At,value:wr,onChange:vn}),sr?i.jsx(of,{cfg:At,amountLabel:ft(jn),jazz:zt}):i.jsxs("p",{className:"gzp-note",children:[i.jsx(Xc,{}),i.jsxs("span",{children:[i.jsx("b",{children:"Cash on delivery."})," Pay the rider when the food arrives. We'll call this number if we can't find the address."]})]}),ve&&i.jsx("p",{className:"gzp-error",children:ve})]})}),i.jsxs("div",{className:"gzp-sheet-foot",children:[i.jsx("div",{className:"gzp-totals",children:i.jsxs("div",{className:"gzp-grand",children:[i.jsx("span",{children:"Total to pay"}),i.jsx("span",{children:ft(jn)})]})}),i.jsx("button",{type:"submit",className:"gzp-btn gzp-btn-primary gzp-btn-block",disabled:!Vo,children:Ce?"Sending to the kitchen…":sr&&!zt.ready?zt.uploading?"Uploading screenshot…":"Add payment details to continue":"Place order"})]})]})]})}),xr&&i.jsx("div",{className:"gzp-sheet-overlay",onClick:()=>mt(!1),children:i.jsxs("div",{className:"gzp-sheet",onClick:c=>c.stopPropagation(),role:"dialog","aria-label":"Track your order",children:[i.jsxs("div",{className:"gzp-sheet-head",children:[i.jsx("h2",{children:"Track your order"}),i.jsx("button",{className:"gzp-icon-btn",onClick:()=>mt(!1),"aria-label":"Close",type:"button",children:"✕"})]}),i.jsxs("form",{onSubmit:kt,style:{display:"contents"},children:[i.jsx("div",{className:"gzp-sheet-body",children:i.jsxs("div",{className:"gzp-form",children:[i.jsxs("label",{className:"gzp-field",children:[i.jsx("span",{children:"Mobile number used at checkout"}),i.jsx("input",{required:!0,autoFocus:!0,type:"tel",inputMode:"numeric",pattern:"[0-9+]*",maxLength:14,value:Qr,onChange:c=>xn(Zi(c.target.value)),onPaste:c=>{c.preventDefault();const v=(c.clipboardData||window.clipboardData).getData("text");xn(b=>Zi(b+v))},placeholder:"03001234567"})]}),Bo&&i.jsx("p",{className:"gzp-error",children:Bo})]})}),i.jsx("div",{className:"gzp-sheet-foot",children:i.jsx("button",{type:"submit",className:"gzp-btn gzp-btn-primary gzp-btn-block",disabled:br,children:br?"Looking…":"Find my order"})})]})]})})]})}class Hf extends $c.Component{constructor(u){super(u);gc(this,"handleReload",()=>{try{localStorage.removeItem("gzp_last_order")}catch{}window.location.reload()});this.state={hasError:!1}}static getDerivedStateFromError(){return{hasError:!0}}componentDidCatch(u,k){console.error("GenZ Pizza Land crashed while rendering:",u,k)}render(){return this.state.hasError?i.jsxs("div",{style:{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:14,padding:24,textAlign:"center",fontFamily:"system-ui, sans-serif",background:"#FFF8EF",color:"#252525"},children:[i.jsx("h1",{style:{fontSize:"1.3rem",margin:0},children:"Something went wrong on our end"}),i.jsx("p",{style:{maxWidth:420,opacity:.8,margin:0},children:"Your order may still have gone through — if you already saw an order number, it's safe. Reloading usually fixes this."}),i.jsx("button",{type:"button",onClick:this.handleReload,style:{padding:"10px 22px",borderRadius:8,border:"none",background:"#E6392F",color:"#fff",fontWeight:600,cursor:"pointer"},children:"Reload"})]}):this.props.children}}const Qf=["🍕","🍔","🍟","🌭","🌮","🥤","🍗","🍩","🥪","🍦"],Oc=["🍔","🍕","🍟","🍗","🌭","🥪","🌯","🌮","🍩"],Fc=["✨","⭐"],Me=(s,f)=>s+Math.random()*(f-s);function Vf(s,f){const u=Math.ceil(f*1.6),k=document.createElement("canvas");k.width=u,k.height=u;const w=k.getContext("2d");return w.textAlign="center",w.textBaseline="middle",w.font=`${f}px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif`,w.fillText(s,u/2,u/2+f*.05),k}function Yf(){const s=z.useRef(null);return z.useEffect(()=>{var He;const f=s.current;if(!f)return;const u=f.getContext("2d"),k=(He=window.matchMedia)==null?void 0:He.call(window,"(prefers-reduced-motion: reduce)").matches;let w=0,_=0,q=1,Y=[],$=[],ge=[],O=0,T=!1;const B={x:-9999,y:-9999,active:!1},se=document.createElement("div");se.setAttribute("aria-hidden","true"),Object.assign(se.style,{position:"fixed",inset:"0",zIndex:"1001",overflow:"hidden",pointerEvents:"none"}),document.body.appendChild(se);const ae=()=>window.innerWidth<700,J=()=>{q=Math.min(window.devicePixelRatio||1,ae()?1.5:2),w=window.innerWidth,_=window.innerHeight,f.width=Math.round(w*q),f.height=Math.round(_*q),f.style.width=`${w}px`,f.style.height=`${_}px`,u.setTransform(q,0,0,q,0,0);const Le=ae(),I=Math.min(Le?34:72,Math.round(w*_/(Le?15e3:17e3))),ne=Le?9:16;Y=Array.from({length:I},()=>({x:Me(0,w),y:Me(0,_),vx:Me(-.22,.22),vy:Me(-.22,.22),r:Me(1.1,2.8),life:1,temp:!1})),ge=Qf.map(S=>Vf(S,28)),$=Array.from({length:ne},(S,A)=>({s:ge[A%ge.length],x:Me(0,w),y:Me(0,_),vx:Me(-.35,.35)||.2,vy:Me(-.3,-.08),rot:Me(0,Math.PI*2),vr:Me(-.008,.008),scale:Me(.55,1.05),alpha:Me(.3,.55),phase:Me(0,6.28)}))},F=(Le,I)=>{if(!k){const ce=Math.hypot(w,_)||1;$.forEach(me=>{const L=me.x-Le,W=me.y-I,D=Math.hypot(L,W),h=D>1?Math.atan2(W,L):Me(0,Math.PI*2),j=3+(1-Math.min(D/ce,1))*3;me.vx+=Math.cos(h)*j+Me(-1,1),me.vy+=Math.sin(h)*j+Me(-1,1),me.vr+=Me(-.08,.08)})}const ne=2+Math.floor(Math.random()*3),S=ne>2&&Math.random()<.35?2:1,A=Array.from({length:ne-S},()=>({emoji:Oc[Math.floor(Math.random()*Oc.length)],size:Me(22,34)}));for(let ce=0;ce<S;ce++)A.push({emoji:Fc[Math.floor(Math.random()*Fc.length)],size:Me(15,23)});A.forEach(({emoji:ce,size:me},L)=>{const W=L/A.length*Math.PI*2+Me(-.35,.35),D=Me(55,115),h=Math.cos(W)*D,j=Math.sin(W)*D-Me(18,48),ue=document.createElement("span");if(ue.textContent=ce,Object.assign(ue.style,{position:"absolute",left:`${Le}px`,top:`${I}px`,fontSize:`${me}px`,lineHeight:"1",pointerEvents:"none",userSelect:"none",filter:"drop-shadow(0 2px 5px rgba(30,20,10,0.3))",transform:"translate(-50%, -50%) scale(0.3)"}),se.appendChild(ue),k){ue.style.transform=`translate(calc(-50% + ${h*.35}px), calc(-50% + ${j*.35}px)) scale(1)`,window.setTimeout(()=>ue.remove(),550);return}const we=ue.animate([{opacity:0,transform:"translate(-50%, -50%) scale(0.3) rotate(0deg)"},{opacity:1,transform:"translate(-50%, -50%) scale(1.25) rotate(10deg)",offset:.18},{opacity:1,transform:"translate(-50%, -50%) scale(1) rotate(-5deg)",offset:.34},{opacity:0,transform:`translate(calc(-50% + ${h}px), calc(-50% + ${j}px)) scale(0.7) rotate(${Me(-55,55)}deg)`}],{duration:Me(750,1050),easing:"cubic-bezier(0.2, 0.75, 0.3, 1)",fill:"forwards"});we.onfinish=()=>ue.remove()})},te=Le=>{u.clearRect(0,0,w,_);const ne=ae()?150:200;if(B.active){const S=u.createRadialGradient(B.x,B.y,0,B.x,B.y,220);S.addColorStop(0,"rgba(255,240,200,0.35)"),S.addColorStop(1,"rgba(255,240,200,0)"),u.fillStyle=S,u.fillRect(B.x-220,B.y-220,440,440)}for(let S=Y.length-1;S>=0;S--){const A=Y[S];if(A.temp&&(A.life-=.004,A.life<=0)){Y.splice(S,1);continue}if(B.active){const me=B.x-A.x,L=B.y-A.y,W=Math.hypot(me,L);W<ne&&W>1&&(A.vx+=me/W*.012,A.vy+=L/W*.012)}A.vx*=.985,A.vy*=.985,Math.hypot(A.vx,A.vy)<.08&&(A.vx+=Me(-.01,.01),A.vy+=Me(-.01,.01)),A.x+=A.vx,A.y+=A.vy,A.x<-20?A.x=w+20:A.x>w+20&&(A.x=-20),A.y<-20?A.y=_+20:A.y>_+20&&(A.y=-20)}for(const S of Y){const A=.35+.5*(S.r/2.8);u.fillStyle=`rgba(255,255,255,${Math.min(1,A+.25)*S.life})`,u.shadowColor="rgba(255,255,255,0.8)",u.shadowBlur=8,u.beginPath(),u.arc(S.x,S.y,S.r,0,Math.PI*2),u.fill()}u.shadowBlur=0;for(const S of $){S.vx*=.99,S.vy*=.99,Math.hypot(S.vx,S.vy)<.12&&(S.vx+=Me(-.01,.01),S.vy-=.004),S.vr*=.99,Math.abs(S.vr)<.004&&(S.vr+=S.vr>=0?4e-4:-4e-4),S.x+=S.vx,S.y+=S.vy+Math.sin(Le/1500+S.phase)*.12,S.rot+=S.vr;const A=40;S.x<-A?S.x=w+A:S.x>w+A&&(S.x=-A),S.y<-A?S.y=_+A:S.y>_+A&&(S.y=-A),u.save(),u.translate(S.x,S.y),u.rotate(S.rot),u.globalAlpha=S.alpha;const ce=S.s.width*S.scale;u.drawImage(S.s,-ce/2,-ce/2,ce,ce),u.restore()}u.globalAlpha=1,T&&(O=requestAnimationFrame(te))},xe=()=>{T||k||(T=!0,O=requestAnimationFrame(te))},Ne=()=>{T=!1,cancelAnimationFrame(O)};J(),k?te(0):xe();let he=0;const oe=()=>{clearTimeout(he),he=setTimeout(()=>{J(),k&&te(0)},150)},ve=Le=>{B.x=Le.clientX,B.y=Le.clientY,B.active=!0},ye=()=>{B.active=!1},Ce=Le=>{B.x=Le.clientX,B.y=Le.clientY,B.active=!0,F(Le.clientX,Le.clientY),Le.pointerType==="touch"&&setTimeout(ye,900)},re=()=>document.hidden?Ne():xe();return window.addEventListener("resize",oe),window.addEventListener("pointermove",ve,{passive:!0}),window.addEventListener("pointerdown",Ce,{passive:!0}),window.addEventListener("pointerleave",ye),document.addEventListener("mouseleave",ye),document.addEventListener("visibilitychange",re),()=>{Ne(),clearTimeout(he),se.remove(),window.removeEventListener("resize",oe),window.removeEventListener("pointermove",ve),window.removeEventListener("pointerdown",Ce),window.removeEventListener("pointerleave",ye),document.removeEventListener("mouseleave",ye),document.removeEventListener("visibilitychange",re)}},[]),i.jsx("canvas",{ref:s,"aria-hidden":"true",style:{position:"fixed",inset:0,zIndex:0,pointerEvents:"none"}})}$p.createRoot(document.getElementById("root")).render(i.jsxs($c.StrictMode,{children:[i.jsx(Yf,{}),i.jsx(Hf,{children:i.jsx(Wf,{})})]}));
