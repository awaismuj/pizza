var Ep=Object.defineProperty;var _p=(s,f,u)=>f in s?Ep(s,f,{enumerable:!0,configurable:!0,writable:!0,value:u}):s[f]=u;var hc=(s,f,u)=>_p(s,typeof f!="symbol"?f+"":f,u);(function(){const f=document.createElement("link").relList;if(f&&f.supports&&f.supports("modulepreload"))return;for(const w of document.querySelectorAll('link[rel="modulepreload"]'))z(w);new MutationObserver(w=>{for(const P of w)if(P.type==="childList")for(const q of P.addedNodes)q.tagName==="LINK"&&q.rel==="modulepreload"&&z(q)}).observe(document,{childList:!0,subtree:!0});function u(w){const P={};return w.integrity&&(P.integrity=w.integrity),w.referrerPolicy&&(P.referrerPolicy=w.referrerPolicy),w.crossOrigin==="use-credentials"?P.credentials="include":w.crossOrigin==="anonymous"?P.credentials="omit":P.credentials="same-origin",P}function z(w){if(w.ep)return;w.ep=!0;const P=u(w);fetch(w.href,P)}})();function Dc(s){return s&&s.__esModule&&Object.prototype.hasOwnProperty.call(s,"default")?s.default:s}var Ba={exports:{}},Wo={},Ua={exports:{}},ke={};/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var vc;function Pp(){if(vc)return ke;vc=1;var s=Symbol.for("react.element"),f=Symbol.for("react.portal"),u=Symbol.for("react.fragment"),z=Symbol.for("react.strict_mode"),w=Symbol.for("react.profiler"),P=Symbol.for("react.provider"),q=Symbol.for("react.context"),Y=Symbol.for("react.forward_ref"),$=Symbol.for("react.suspense"),ge=Symbol.for("react.memo"),O=Symbol.for("react.lazy"),T=Symbol.iterator;function B(h){return h===null||typeof h!="object"?null:(h=T&&h[T]||h["@@iterator"],typeof h=="function"?h:null)}var se={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},ae=Object.assign,ee={};function F(h,j,ue){this.props=h,this.context=j,this.refs=ee,this.updater=ue||se}F.prototype.isReactComponent={},F.prototype.setState=function(h,j){if(typeof h!="object"&&typeof h!="function"&&h!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,h,j,"setState")},F.prototype.forceUpdate=function(h){this.updater.enqueueForceUpdate(this,h,"forceUpdate")};function te(){}te.prototype=F.prototype;function ve(h,j,ue){this.props=h,this.context=j,this.refs=ee,this.updater=ue||se}var Ne=ve.prototype=new te;Ne.constructor=ve,ae(Ne,F.prototype),Ne.isPureReactComponent=!0;var me=Array.isArray,oe=Object.prototype.hasOwnProperty,he={current:null},xe={key:!0,ref:!0,__self:!0,__source:!0};function Ce(h,j,ue){var ye,je={},ze=null,_e=null;if(j!=null)for(ye in j.ref!==void 0&&(_e=j.ref),j.key!==void 0&&(ze=""+j.key),j)oe.call(j,ye)&&!xe.hasOwnProperty(ye)&&(je[ye]=j[ye]);var Te=arguments.length-2;if(Te===1)je.children=ue;else if(1<Te){for(var M=Array(Te),Be=0;Be<Te;Be++)M[Be]=arguments[Be+2];je.children=M}if(h&&h.defaultProps)for(ye in Te=h.defaultProps,Te)je[ye]===void 0&&(je[ye]=Te[ye]);return{$$typeof:s,type:h,key:ze,ref:_e,props:je,_owner:he.current}}function re(h,j){return{$$typeof:s,type:h.type,key:j,ref:h.ref,props:h.props,_owner:h._owner}}function He(h){return typeof h=="object"&&h!==null&&h.$$typeof===s}function Le(h){var j={"=":"=0",":":"=2"};return"$"+h.replace(/[=:]/g,function(ue){return j[ue]})}var I=/\/+/g;function ne(h,j){return typeof h=="object"&&h!==null&&h.key!=null?Le(""+h.key):j.toString(36)}function S(h,j,ue,ye,je){var ze=typeof h;(ze==="undefined"||ze==="boolean")&&(h=null);var _e=!1;if(h===null)_e=!0;else switch(ze){case"string":case"number":_e=!0;break;case"object":switch(h.$$typeof){case s:case f:_e=!0}}if(_e)return _e=h,je=je(_e),h=ye===""?"."+ne(_e,0):ye,me(je)?(ue="",h!=null&&(ue=h.replace(I,"$&/")+"/"),S(je,j,ue,"",function(Be){return Be})):je!=null&&(He(je)&&(je=re(je,ue+(!je.key||_e&&_e.key===je.key?"":(""+je.key).replace(I,"$&/")+"/")+h)),j.push(je)),1;if(_e=0,ye=ye===""?".":ye+":",me(h))for(var Te=0;Te<h.length;Te++){ze=h[Te];var M=ye+ne(ze,Te);_e+=S(ze,j,ue,M,je)}else if(M=B(h),typeof M=="function")for(h=M.call(h),Te=0;!(ze=h.next()).done;)ze=ze.value,M=ye+ne(ze,Te++),_e+=S(ze,j,ue,M,je);else if(ze==="object")throw j=String(h),Error("Objects are not valid as a React child (found: "+(j==="[object Object]"?"object with keys {"+Object.keys(h).join(", ")+"}":j)+"). If you meant to render a collection of children, use an array instead.");return _e}function A(h,j,ue){if(h==null)return h;var ye=[],je=0;return S(h,ye,"","",function(ze){return j.call(ue,ze,je++)}),ye}function ce(h){if(h._status===-1){var j=h._result;j=j(),j.then(function(ue){(h._status===0||h._status===-1)&&(h._status=1,h._result=ue)},function(ue){(h._status===0||h._status===-1)&&(h._status=2,h._result=ue)}),h._status===-1&&(h._status=0,h._result=j)}if(h._status===1)return h._result.default;throw h._result}var fe={current:null},L={transition:null},H={ReactCurrentDispatcher:fe,ReactCurrentBatchConfig:L,ReactCurrentOwner:he};function D(){throw Error("act(...) is not supported in production builds of React.")}return ke.Children={map:A,forEach:function(h,j,ue){A(h,function(){j.apply(this,arguments)},ue)},count:function(h){var j=0;return A(h,function(){j++}),j},toArray:function(h){return A(h,function(j){return j})||[]},only:function(h){if(!He(h))throw Error("React.Children.only expected to receive a single React element child.");return h}},ke.Component=F,ke.Fragment=u,ke.Profiler=w,ke.PureComponent=ve,ke.StrictMode=z,ke.Suspense=$,ke.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=H,ke.act=D,ke.cloneElement=function(h,j,ue){if(h==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+h+".");var ye=ae({},h.props),je=h.key,ze=h.ref,_e=h._owner;if(j!=null){if(j.ref!==void 0&&(ze=j.ref,_e=he.current),j.key!==void 0&&(je=""+j.key),h.type&&h.type.defaultProps)var Te=h.type.defaultProps;for(M in j)oe.call(j,M)&&!xe.hasOwnProperty(M)&&(ye[M]=j[M]===void 0&&Te!==void 0?Te[M]:j[M])}var M=arguments.length-2;if(M===1)ye.children=ue;else if(1<M){Te=Array(M);for(var Be=0;Be<M;Be++)Te[Be]=arguments[Be+2];ye.children=Te}return{$$typeof:s,type:h.type,key:je,ref:ze,props:ye,_owner:_e}},ke.createContext=function(h){return h={$$typeof:q,_currentValue:h,_currentValue2:h,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},h.Provider={$$typeof:P,_context:h},h.Consumer=h},ke.createElement=Ce,ke.createFactory=function(h){var j=Ce.bind(null,h);return j.type=h,j},ke.createRef=function(){return{current:null}},ke.forwardRef=function(h){return{$$typeof:Y,render:h}},ke.isValidElement=He,ke.lazy=function(h){return{$$typeof:O,_payload:{_status:-1,_result:h},_init:ce}},ke.memo=function(h,j){return{$$typeof:ge,type:h,compare:j===void 0?null:j}},ke.startTransition=function(h){var j=L.transition;L.transition={};try{h()}finally{L.transition=j}},ke.unstable_act=D,ke.useCallback=function(h,j){return fe.current.useCallback(h,j)},ke.useContext=function(h){return fe.current.useContext(h)},ke.useDebugValue=function(){},ke.useDeferredValue=function(h){return fe.current.useDeferredValue(h)},ke.useEffect=function(h,j){return fe.current.useEffect(h,j)},ke.useId=function(){return fe.current.useId()},ke.useImperativeHandle=function(h,j,ue){return fe.current.useImperativeHandle(h,j,ue)},ke.useInsertionEffect=function(h,j){return fe.current.useInsertionEffect(h,j)},ke.useLayoutEffect=function(h,j){return fe.current.useLayoutEffect(h,j)},ke.useMemo=function(h,j){return fe.current.useMemo(h,j)},ke.useReducer=function(h,j,ue){return fe.current.useReducer(h,j,ue)},ke.useRef=function(h){return fe.current.useRef(h)},ke.useState=function(h){return fe.current.useState(h)},ke.useSyncExternalStore=function(h,j,ue){return fe.current.useSyncExternalStore(h,j,ue)},ke.useTransition=function(){return fe.current.useTransition()},ke.version="18.3.1",ke}var xc;function Ja(){return xc||(xc=1,Ua.exports=Pp()),Ua.exports}/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var yc;function Tp(){if(yc)return Wo;yc=1;var s=Ja(),f=Symbol.for("react.element"),u=Symbol.for("react.fragment"),z=Object.prototype.hasOwnProperty,w=s.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,P={key:!0,ref:!0,__self:!0,__source:!0};function q(Y,$,ge){var O,T={},B=null,se=null;ge!==void 0&&(B=""+ge),$.key!==void 0&&(B=""+$.key),$.ref!==void 0&&(se=$.ref);for(O in $)z.call($,O)&&!P.hasOwnProperty(O)&&(T[O]=$[O]);if(Y&&Y.defaultProps)for(O in $=Y.defaultProps,$)T[O]===void 0&&(T[O]=$[O]);return{$$typeof:f,type:Y,key:B,ref:se,props:T,_owner:w.current}}return Wo.Fragment=u,Wo.jsx=q,Wo.jsxs=q,Wo}var wc;function Lp(){return wc||(wc=1,Ba.exports=Tp()),Ba.exports}var i=Lp(),b=Ja();const $c=Dc(b);var Xi={},Wa={exports:{}},wt={},Ha={exports:{}},Qa={};/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var bc;function Rp(){return bc||(bc=1,(function(s){function f(L,H){var D=L.length;L.push(H);e:for(;0<D;){var h=D-1>>>1,j=L[h];if(0<w(j,H))L[h]=H,L[D]=j,D=h;else break e}}function u(L){return L.length===0?null:L[0]}function z(L){if(L.length===0)return null;var H=L[0],D=L.pop();if(D!==H){L[0]=D;e:for(var h=0,j=L.length,ue=j>>>1;h<ue;){var ye=2*(h+1)-1,je=L[ye],ze=ye+1,_e=L[ze];if(0>w(je,D))ze<j&&0>w(_e,je)?(L[h]=_e,L[ze]=D,h=ze):(L[h]=je,L[ye]=D,h=ye);else if(ze<j&&0>w(_e,D))L[h]=_e,L[ze]=D,h=ze;else break e}}return H}function w(L,H){var D=L.sortIndex-H.sortIndex;return D!==0?D:L.id-H.id}if(typeof performance=="object"&&typeof performance.now=="function"){var P=performance;s.unstable_now=function(){return P.now()}}else{var q=Date,Y=q.now();s.unstable_now=function(){return q.now()-Y}}var $=[],ge=[],O=1,T=null,B=3,se=!1,ae=!1,ee=!1,F=typeof setTimeout=="function"?setTimeout:null,te=typeof clearTimeout=="function"?clearTimeout:null,ve=typeof setImmediate<"u"?setImmediate:null;typeof navigator<"u"&&navigator.scheduling!==void 0&&navigator.scheduling.isInputPending!==void 0&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function Ne(L){for(var H=u(ge);H!==null;){if(H.callback===null)z(ge);else if(H.startTime<=L)z(ge),H.sortIndex=H.expirationTime,f($,H);else break;H=u(ge)}}function me(L){if(ee=!1,Ne(L),!ae)if(u($)!==null)ae=!0,ce(oe);else{var H=u(ge);H!==null&&fe(me,H.startTime-L)}}function oe(L,H){ae=!1,ee&&(ee=!1,te(Ce),Ce=-1),se=!0;var D=B;try{for(Ne(H),T=u($);T!==null&&(!(T.expirationTime>H)||L&&!Le());){var h=T.callback;if(typeof h=="function"){T.callback=null,B=T.priorityLevel;var j=h(T.expirationTime<=H);H=s.unstable_now(),typeof j=="function"?T.callback=j:T===u($)&&z($),Ne(H)}else z($);T=u($)}if(T!==null)var ue=!0;else{var ye=u(ge);ye!==null&&fe(me,ye.startTime-H),ue=!1}return ue}finally{T=null,B=D,se=!1}}var he=!1,xe=null,Ce=-1,re=5,He=-1;function Le(){return!(s.unstable_now()-He<re)}function I(){if(xe!==null){var L=s.unstable_now();He=L;var H=!0;try{H=xe(!0,L)}finally{H?ne():(he=!1,xe=null)}}else he=!1}var ne;if(typeof ve=="function")ne=function(){ve(I)};else if(typeof MessageChannel<"u"){var S=new MessageChannel,A=S.port2;S.port1.onmessage=I,ne=function(){A.postMessage(null)}}else ne=function(){F(I,0)};function ce(L){xe=L,he||(he=!0,ne())}function fe(L,H){Ce=F(function(){L(s.unstable_now())},H)}s.unstable_IdlePriority=5,s.unstable_ImmediatePriority=1,s.unstable_LowPriority=4,s.unstable_NormalPriority=3,s.unstable_Profiling=null,s.unstable_UserBlockingPriority=2,s.unstable_cancelCallback=function(L){L.callback=null},s.unstable_continueExecution=function(){ae||se||(ae=!0,ce(oe))},s.unstable_forceFrameRate=function(L){0>L||125<L?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):re=0<L?Math.floor(1e3/L):5},s.unstable_getCurrentPriorityLevel=function(){return B},s.unstable_getFirstCallbackNode=function(){return u($)},s.unstable_next=function(L){switch(B){case 1:case 2:case 3:var H=3;break;default:H=B}var D=B;B=H;try{return L()}finally{B=D}},s.unstable_pauseExecution=function(){},s.unstable_requestPaint=function(){},s.unstable_runWithPriority=function(L,H){switch(L){case 1:case 2:case 3:case 4:case 5:break;default:L=3}var D=B;B=L;try{return H()}finally{B=D}},s.unstable_scheduleCallback=function(L,H,D){var h=s.unstable_now();switch(typeof D=="object"&&D!==null?(D=D.delay,D=typeof D=="number"&&0<D?h+D:h):D=h,L){case 1:var j=-1;break;case 2:j=250;break;case 5:j=1073741823;break;case 4:j=1e4;break;default:j=5e3}return j=D+j,L={id:O++,callback:H,priorityLevel:L,startTime:D,expirationTime:j,sortIndex:-1},D>h?(L.sortIndex=D,f(ge,L),u($)===null&&L===u(ge)&&(ee?(te(Ce),Ce=-1):ee=!0,fe(me,D-h))):(L.sortIndex=j,f($,L),ae||se||(ae=!0,ce(oe))),L},s.unstable_shouldYield=Le,s.unstable_wrapCallback=function(L){var H=B;return function(){var D=B;B=H;try{return L.apply(this,arguments)}finally{B=D}}}})(Qa)),Qa}var zc;function Mp(){return zc||(zc=1,Ha.exports=Rp()),Ha.exports}/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var kc;function Ip(){if(kc)return wt;kc=1;var s=Ja(),f=Mp();function u(e){for(var t="https://reactjs.org/docs/error-decoder.html?invariant="+e,r=1;r<arguments.length;r++)t+="&args[]="+encodeURIComponent(arguments[r]);return"Minified React error #"+e+"; visit "+t+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var z=new Set,w={};function P(e,t){q(e,t),q(e+"Capture",t)}function q(e,t){for(w[e]=t,e=0;e<t.length;e++)z.add(t[e])}var Y=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),$=Object.prototype.hasOwnProperty,ge=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,O={},T={};function B(e){return $.call(T,e)?!0:$.call(O,e)?!1:ge.test(e)?T[e]=!0:(O[e]=!0,!1)}function se(e,t,r,n){if(r!==null&&r.type===0)return!1;switch(typeof t){case"function":case"symbol":return!0;case"boolean":return n?!1:r!==null?!r.acceptsBooleans:(e=e.toLowerCase().slice(0,5),e!=="data-"&&e!=="aria-");default:return!1}}function ae(e,t,r,n){if(t===null||typeof t>"u"||se(e,t,r,n))return!0;if(n)return!1;if(r!==null)switch(r.type){case 3:return!t;case 4:return t===!1;case 5:return isNaN(t);case 6:return isNaN(t)||1>t}return!1}function ee(e,t,r,n,o,l,a){this.acceptsBooleans=t===2||t===3||t===4,this.attributeName=n,this.attributeNamespace=o,this.mustUseProperty=r,this.propertyName=e,this.type=t,this.sanitizeURL=l,this.removeEmptyString=a}var F={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(e){F[e]=new ee(e,0,!1,e,null,!1,!1)}),[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(e){var t=e[0];F[t]=new ee(t,1,!1,e[1],null,!1,!1)}),["contentEditable","draggable","spellCheck","value"].forEach(function(e){F[e]=new ee(e,2,!1,e.toLowerCase(),null,!1,!1)}),["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(e){F[e]=new ee(e,2,!1,e,null,!1,!1)}),"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(e){F[e]=new ee(e,3,!1,e.toLowerCase(),null,!1,!1)}),["checked","multiple","muted","selected"].forEach(function(e){F[e]=new ee(e,3,!0,e,null,!1,!1)}),["capture","download"].forEach(function(e){F[e]=new ee(e,4,!1,e,null,!1,!1)}),["cols","rows","size","span"].forEach(function(e){F[e]=new ee(e,6,!1,e,null,!1,!1)}),["rowSpan","start"].forEach(function(e){F[e]=new ee(e,5,!1,e.toLowerCase(),null,!1,!1)});var te=/[\-:]([a-z])/g;function ve(e){return e[1].toUpperCase()}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(e){var t=e.replace(te,ve);F[t]=new ee(t,1,!1,e,null,!1,!1)}),"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(e){var t=e.replace(te,ve);F[t]=new ee(t,1,!1,e,"http://www.w3.org/1999/xlink",!1,!1)}),["xml:base","xml:lang","xml:space"].forEach(function(e){var t=e.replace(te,ve);F[t]=new ee(t,1,!1,e,"http://www.w3.org/XML/1998/namespace",!1,!1)}),["tabIndex","crossOrigin"].forEach(function(e){F[e]=new ee(e,1,!1,e.toLowerCase(),null,!1,!1)}),F.xlinkHref=new ee("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1),["src","href","action","formAction"].forEach(function(e){F[e]=new ee(e,1,!1,e.toLowerCase(),null,!0,!0)});function Ne(e,t,r,n){var o=F.hasOwnProperty(t)?F[t]:null;(o!==null?o.type!==0:n||!(2<t.length)||t[0]!=="o"&&t[0]!=="O"||t[1]!=="n"&&t[1]!=="N")&&(ae(t,r,o,n)&&(r=null),n||o===null?B(t)&&(r===null?e.removeAttribute(t):e.setAttribute(t,""+r)):o.mustUseProperty?e[o.propertyName]=r===null?o.type===3?!1:"":r:(t=o.attributeName,n=o.attributeNamespace,r===null?e.removeAttribute(t):(o=o.type,r=o===3||o===4&&r===!0?"":""+r,n?e.setAttributeNS(n,t,r):e.setAttribute(t,r))))}var me=s.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,oe=Symbol.for("react.element"),he=Symbol.for("react.portal"),xe=Symbol.for("react.fragment"),Ce=Symbol.for("react.strict_mode"),re=Symbol.for("react.profiler"),He=Symbol.for("react.provider"),Le=Symbol.for("react.context"),I=Symbol.for("react.forward_ref"),ne=Symbol.for("react.suspense"),S=Symbol.for("react.suspense_list"),A=Symbol.for("react.memo"),ce=Symbol.for("react.lazy"),fe=Symbol.for("react.offscreen"),L=Symbol.iterator;function H(e){return e===null||typeof e!="object"?null:(e=L&&e[L]||e["@@iterator"],typeof e=="function"?e:null)}var D=Object.assign,h;function j(e){if(h===void 0)try{throw Error()}catch(r){var t=r.stack.trim().match(/\n( *(at )?)/);h=t&&t[1]||""}return`
`+h+e}var ue=!1;function ye(e,t){if(!e||ue)return"";ue=!0;var r=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(t)if(t=function(){throw Error()},Object.defineProperty(t.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(t,[])}catch(y){var n=y}Reflect.construct(e,[],t)}else{try{t.call()}catch(y){n=y}e.call(t.prototype)}else{try{throw Error()}catch(y){n=y}e()}}catch(y){if(y&&n&&typeof y.stack=="string"){for(var o=y.stack.split(`
`),l=n.stack.split(`
`),a=o.length-1,d=l.length-1;1<=a&&0<=d&&o[a]!==l[d];)d--;for(;1<=a&&0<=d;a--,d--)if(o[a]!==l[d]){if(a!==1||d!==1)do if(a--,d--,0>d||o[a]!==l[d]){var p=`
`+o[a].replace(" at new "," at ");return e.displayName&&p.includes("<anonymous>")&&(p=p.replace("<anonymous>",e.displayName)),p}while(1<=a&&0<=d);break}}}finally{ue=!1,Error.prepareStackTrace=r}return(e=e?e.displayName||e.name:"")?j(e):""}function je(e){switch(e.tag){case 5:return j(e.type);case 16:return j("Lazy");case 13:return j("Suspense");case 19:return j("SuspenseList");case 0:case 2:case 15:return e=ye(e.type,!1),e;case 11:return e=ye(e.type.render,!1),e;case 1:return e=ye(e.type,!0),e;default:return""}}function ze(e){if(e==null)return null;if(typeof e=="function")return e.displayName||e.name||null;if(typeof e=="string")return e;switch(e){case xe:return"Fragment";case he:return"Portal";case re:return"Profiler";case Ce:return"StrictMode";case ne:return"Suspense";case S:return"SuspenseList"}if(typeof e=="object")switch(e.$$typeof){case Le:return(e.displayName||"Context")+".Consumer";case He:return(e._context.displayName||"Context")+".Provider";case I:var t=e.render;return e=e.displayName,e||(e=t.displayName||t.name||"",e=e!==""?"ForwardRef("+e+")":"ForwardRef"),e;case A:return t=e.displayName||null,t!==null?t:ze(e.type)||"Memo";case ce:t=e._payload,e=e._init;try{return ze(e(t))}catch{}}return null}function _e(e){var t=e.type;switch(e.tag){case 24:return"Cache";case 9:return(t.displayName||"Context")+".Consumer";case 10:return(t._context.displayName||"Context")+".Provider";case 18:return"DehydratedFragment";case 11:return e=t.render,e=e.displayName||e.name||"",t.displayName||(e!==""?"ForwardRef("+e+")":"ForwardRef");case 7:return"Fragment";case 5:return t;case 4:return"Portal";case 3:return"Root";case 6:return"Text";case 16:return ze(t);case 8:return t===Ce?"StrictMode":"Mode";case 22:return"Offscreen";case 12:return"Profiler";case 21:return"Scope";case 13:return"Suspense";case 19:return"SuspenseList";case 25:return"TracingMarker";case 1:case 0:case 17:case 2:case 14:case 15:if(typeof t=="function")return t.displayName||t.name||null;if(typeof t=="string")return t}return null}function Te(e){switch(typeof e){case"boolean":case"number":case"string":case"undefined":return e;case"object":return e;default:return""}}function M(e){var t=e.type;return(e=e.nodeName)&&e.toLowerCase()==="input"&&(t==="checkbox"||t==="radio")}function Be(e){var t=M(e)?"checked":"value",r=Object.getOwnPropertyDescriptor(e.constructor.prototype,t),n=""+e[t];if(!e.hasOwnProperty(t)&&typeof r<"u"&&typeof r.get=="function"&&typeof r.set=="function"){var o=r.get,l=r.set;return Object.defineProperty(e,t,{configurable:!0,get:function(){return o.call(this)},set:function(a){n=""+a,l.call(this,a)}}),Object.defineProperty(e,t,{enumerable:r.enumerable}),{getValue:function(){return n},setValue:function(a){n=""+a},stopTracking:function(){e._valueTracker=null,delete e[t]}}}}function Dt(e){e._valueTracker||(e._valueTracker=Be(e))}function Hr(e){if(!e)return!1;var t=e._valueTracker;if(!t)return!0;var r=t.getValue(),n="";return e&&(n=M(e)?e.checked?"true":"false":e.value),e=n,e!==r?(t.setValue(e),!0):!1}function Pt(e){if(e=e||(typeof document<"u"?document:void 0),typeof e>"u")return null;try{return e.activeElement||e.body}catch{return e.body}}function nr(e,t){var r=t.checked;return D({},t,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:r??e._wrapperState.initialChecked})}function gr(e,t){var r=t.defaultValue==null?"":t.defaultValue,n=t.checked!=null?t.checked:t.defaultChecked;r=Te(t.value!=null?t.value:r),e._wrapperState={initialChecked:n,initialValue:r,controlled:t.type==="checkbox"||t.type==="radio"?t.checked!=null:t.value!=null}}function Qr(e,t){t=t.checked,t!=null&&Ne(e,"checked",t,!1)}function mn(e,t){Qr(e,t);var r=Te(t.value),n=t.type;if(r!=null)n==="number"?(r===0&&e.value===""||e.value!=r)&&(e.value=""+r):e.value!==""+r&&(e.value=""+r);else if(n==="submit"||n==="reset"){e.removeAttribute("value");return}t.hasOwnProperty("value")?hr(e,t.type,r):t.hasOwnProperty("defaultValue")&&hr(e,t.type,Te(t.defaultValue)),t.checked==null&&t.defaultChecked!=null&&(e.defaultChecked=!!t.defaultChecked)}function oo(e,t,r){if(t.hasOwnProperty("value")||t.hasOwnProperty("defaultValue")){var n=t.type;if(!(n!=="submit"&&n!=="reset"||t.value!==void 0&&t.value!==null))return;t=""+e._wrapperState.initialValue,r||t===e.value||(e.value=t),e.defaultValue=t}r=e.name,r!==""&&(e.name=""),e.defaultChecked=!!e._wrapperState.initialChecked,r!==""&&(e.name=r)}function hr(e,t,r){(t!=="number"||Pt(e.ownerDocument)!==e)&&(r==null?e.defaultValue=""+e._wrapperState.initialValue:e.defaultValue!==""+r&&(e.defaultValue=""+r))}var ft=Array.isArray;function vr(e,t,r,n){if(e=e.options,t){t={};for(var o=0;o<r.length;o++)t["$"+r[o]]=!0;for(r=0;r<e.length;r++)o=t.hasOwnProperty("$"+e[r].value),e[r].selected!==o&&(e[r].selected=o),o&&n&&(e[r].defaultSelected=!0)}else{for(r=""+Te(r),t=null,o=0;o<e.length;o++){if(e[o].value===r){e[o].selected=!0,n&&(e[o].defaultSelected=!0);return}t!==null||e[o].disabled||(t=e[o])}t!==null&&(t.selected=!0)}}function io(e,t){if(t.dangerouslySetInnerHTML!=null)throw Error(u(91));return D({},t,{value:void 0,defaultValue:void 0,children:""+e._wrapperState.initialValue})}function $t(e,t){var r=t.value;if(r==null){if(r=t.children,t=t.defaultValue,r!=null){if(t!=null)throw Error(u(92));if(ft(r)){if(1<r.length)throw Error(u(93));r=r[0]}t=r}t==null&&(t=""),r=t}e._wrapperState={initialValue:Te(r)}}function lo(e,t){var r=Te(t.value),n=Te(t.defaultValue);r!=null&&(r=""+r,r!==e.value&&(e.value=r),t.defaultValue==null&&e.defaultValue!==r&&(e.defaultValue=r)),n!=null&&(e.defaultValue=""+n)}function xr(e){var t=e.textContent;t===e._wrapperState.initialValue&&t!==""&&t!==null&&(e.value=t)}function gn(e){switch(e){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function bt(e,t){return e==null||e==="http://www.w3.org/1999/xhtml"?gn(t):e==="http://www.w3.org/2000/svg"&&t==="foreignObject"?"http://www.w3.org/1999/xhtml":e}var Vr,hn=(function(e){return typeof MSApp<"u"&&MSApp.execUnsafeLocalFunction?function(t,r,n,o){MSApp.execUnsafeLocalFunction(function(){return e(t,r,n,o)})}:e})(function(e,t){if(e.namespaceURI!=="http://www.w3.org/2000/svg"||"innerHTML"in e)e.innerHTML=t;else{for(Vr=Vr||document.createElement("div"),Vr.innerHTML="<svg>"+t.valueOf().toString()+"</svg>",t=Vr.firstChild;e.firstChild;)e.removeChild(e.firstChild);for(;t.firstChild;)e.appendChild(t.firstChild)}});function yr(e,t){if(t){var r=e.firstChild;if(r&&r===e.lastChild&&r.nodeType===3){r.nodeValue=t;return}}e.textContent=t}var wr={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},Ho=["Webkit","ms","Moz","O"];Object.keys(wr).forEach(function(e){Ho.forEach(function(t){t=t+e.charAt(0).toUpperCase()+e.substring(1),wr[t]=wr[e]})});function vn(e,t,r){return t==null||typeof t=="boolean"||t===""?"":r||typeof t!="number"||t===0||wr.hasOwnProperty(e)&&wr[e]?(""+t).trim():t+"px"}function xn(e,t){e=e.style;for(var r in t)if(t.hasOwnProperty(r)){var n=r.indexOf("--")===0,o=vn(r,t[r],n);r==="float"&&(r="cssFloat"),n?e.setProperty(r,o):e[r]=o}}var Qo=D({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function qt(e,t){if(t){if(Qo[e]&&(t.children!=null||t.dangerouslySetInnerHTML!=null))throw Error(u(137,e));if(t.dangerouslySetInnerHTML!=null){if(t.children!=null)throw Error(u(60));if(typeof t.dangerouslySetInnerHTML!="object"||!("__html"in t.dangerouslySetInnerHTML))throw Error(u(61))}if(t.style!=null&&typeof t.style!="object")throw Error(u(62))}}function yn(e,t){if(e.indexOf("-")===-1)return typeof t.is=="string";switch(e){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var Yr=null;function br(e){return e=e.target||e.srcElement||window,e.correspondingUseElement&&(e=e.correspondingUseElement),e.nodeType===3?e.parentNode:e}var Tt=null,zr=null,or=null;function Xt(e){if(e=Eo(e)){if(typeof Tt!="function")throw Error(u(280));var t=e.stateNode;t&&(t=pi(t),Tt(e.stateNode,e.type,t))}}function ao(e){zr?or?or.push(e):or=[e]:zr=e}function Vo(){if(zr){var e=zr,t=or;if(or=zr=null,Xt(e),t)for(e=0;e<t.length;e++)Xt(t[e])}}function Kr(e,t){return e(t)}function Zt(){}var wn=!1;function Gr(e,t,r){if(wn)return e(t,r);wn=!0;try{return Kr(e,t,r)}finally{wn=!1,(zr!==null||or!==null)&&(Zt(),Vo())}}function mt(e,t){var r=e.stateNode;if(r===null)return null;var n=pi(r);if(n===null)return null;r=n[t];e:switch(t){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(n=!n.disabled)||(e=e.type,n=!(e==="button"||e==="input"||e==="select"||e==="textarea")),e=!n;break e;default:e=!1}if(e)return null;if(r&&typeof r!="function")throw Error(u(231,t,typeof r));return r}var so=!1;if(Y)try{var ir={};Object.defineProperty(ir,"passive",{get:function(){so=!0}}),window.addEventListener("test",ir,ir),window.removeEventListener("test",ir,ir)}catch{so=!1}function qr(e,t,r,n,o,l,a,d,p){var y=Array.prototype.slice.call(arguments,3);try{t.apply(r,y)}catch(C){this.onError(C)}}var At=!1,lr=null,Xr=!1,bn=null,zn={onError:function(e){At=!0,lr=e}};function kn(e,t,r,n,o,l,a,d,p){At=!1,lr=null,qr.apply(zn,arguments)}function kr(e,t,r,n,o,l,a,d,p){if(kn.apply(this,arguments),At){if(At){var y=lr;At=!1,lr=null}else throw Error(u(198));Xr||(Xr=!0,bn=y)}}function De(e){var t=e,r=e;if(e.alternate)for(;t.return;)t=t.return;else{e=t;do t=e,(t.flags&4098)!==0&&(r=t.return),e=t.return;while(e)}return t.tag===3?r:null}function jn(e){if(e.tag===13){var t=e.memoizedState;if(t===null&&(e=e.alternate,e!==null&&(t=e.memoizedState)),t!==null)return t.dehydrated}return null}function Yo(e){if(De(e)!==e)throw Error(u(188))}function al(e){var t=e.alternate;if(!t){if(t=De(e),t===null)throw Error(u(188));return t!==e?null:e}for(var r=e,n=t;;){var o=r.return;if(o===null)break;var l=o.alternate;if(l===null){if(n=o.return,n!==null){r=n;continue}break}if(o.child===l.child){for(l=o.child;l;){if(l===r)return Yo(o),e;if(l===n)return Yo(o),t;l=l.sibling}throw Error(u(188))}if(r.return!==n.return)r=o,n=l;else{for(var a=!1,d=o.child;d;){if(d===r){a=!0,r=o,n=l;break}if(d===n){a=!0,n=o,r=l;break}d=d.sibling}if(!a){for(d=l.child;d;){if(d===r){a=!0,r=l,n=o;break}if(d===n){a=!0,n=l,r=o;break}d=d.sibling}if(!a)throw Error(u(189))}}if(r.alternate!==n)throw Error(u(190))}if(r.tag!==3)throw Error(u(188));return r.stateNode.current===r?e:t}function Bt(e){return e=al(e),e!==null?Zr(e):null}function Zr(e){if(e.tag===5||e.tag===6)return e;for(e=e.child;e!==null;){var t=Zr(e);if(t!==null)return t;e=e.sibling}return null}var Sn=f.unstable_scheduleCallback,uo=f.unstable_cancelCallback,Nn=f.unstable_shouldYield,co=f.unstable_requestPaint,Ue=f.unstable_now,Ko=f.unstable_getCurrentPriorityLevel,po=f.unstable_ImmediatePriority,jr=f.unstable_UserBlockingPriority,Cn=f.unstable_NormalPriority,sl=f.unstable_LowPriority,Go=f.unstable_IdlePriority,Sr=null,zt=null;function ul(e){if(zt&&typeof zt.onCommitFiberRoot=="function")try{zt.onCommitFiberRoot(Sr,e,void 0,(e.current.flags&128)===128)}catch{}}var kt=Math.clz32?Math.clz32:pl,cl=Math.log,dl=Math.LN2;function pl(e){return e>>>=0,e===0?32:31-(cl(e)/dl|0)|0}var En=64,_n=4194304;function Nr(e){switch(e&-e){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return e&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return e&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;default:return e}}function Jr(e,t){var r=e.pendingLanes;if(r===0)return 0;var n=0,o=e.suspendedLanes,l=e.pingedLanes,a=r&268435455;if(a!==0){var d=a&~o;d!==0?n=Nr(d):(l&=a,l!==0&&(n=Nr(l)))}else a=r&~o,a!==0?n=Nr(a):l!==0&&(n=Nr(l));if(n===0)return 0;if(t!==0&&t!==n&&(t&o)===0&&(o=n&-n,l=t&-t,o>=l||o===16&&(l&4194240)!==0))return t;if((n&4)!==0&&(n|=r&16),t=e.entangledLanes,t!==0)for(e=e.entanglements,t&=n;0<t;)r=31-kt(t),o=1<<r,n|=e[r],t&=~o;return n}function qo(e,t){switch(e){case 1:case 2:case 4:return t+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return t+5e3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return-1;case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function Xo(e,t){for(var r=e.suspendedLanes,n=e.pingedLanes,o=e.expirationTimes,l=e.pendingLanes;0<l;){var a=31-kt(l),d=1<<a,p=o[a];p===-1?((d&r)===0||(d&n)!==0)&&(o[a]=qo(d,t)):p<=t&&(e.expiredLanes|=d),l&=~d}}function Pn(e){return e=e.pendingLanes&-1073741825,e!==0?e:e&1073741824?1073741824:0}function fo(){var e=En;return En<<=1,(En&4194240)===0&&(En=64),e}function Tn(e){for(var t=[],r=0;31>r;r++)t.push(e);return t}function Cr(e,t,r){e.pendingLanes|=t,t!==536870912&&(e.suspendedLanes=0,e.pingedLanes=0),e=e.eventTimes,t=31-kt(t),e[t]=r}function Zo(e,t){var r=e.pendingLanes&~t;e.pendingLanes=t,e.suspendedLanes=0,e.pingedLanes=0,e.expiredLanes&=t,e.mutableReadLanes&=t,e.entangledLanes&=t,t=e.entanglements;var n=e.eventTimes;for(e=e.expirationTimes;0<r;){var o=31-kt(r),l=1<<o;t[o]=0,n[o]=-1,e[o]=-1,r&=~l}}function c(e,t){var r=e.entangledLanes|=t;for(e=e.entanglements;r;){var n=31-kt(r),o=1<<n;o&t|e[n]&t&&(e[n]|=t),r&=~o}}var g=0;function k(e){return e&=-e,1<e?4<e?(e&268435455)!==0?16:536870912:4:1}var E,Q,W,X,de,Se=!1,Oe=[],Re=null,Ye=null,Me=null,jt=new Map,J=new Map,we=[],be="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");function qe(e,t){switch(e){case"focusin":case"focusout":Re=null;break;case"dragenter":case"dragleave":Ye=null;break;case"mouseover":case"mouseout":Me=null;break;case"pointerover":case"pointerout":jt.delete(t.pointerId);break;case"gotpointercapture":case"lostpointercapture":J.delete(t.pointerId)}}function Xe(e,t,r,n,o,l){return e===null||e.nativeEvent!==l?(e={blockedOn:t,domEventName:r,eventSystemFlags:n,nativeEvent:l,targetContainers:[o]},t!==null&&(t=Eo(t),t!==null&&Q(t)),e):(e.eventSystemFlags|=n,t=e.targetContainers,o!==null&&t.indexOf(o)===-1&&t.push(o),e)}function Er(e,t,r,n,o){switch(t){case"focusin":return Re=Xe(Re,e,t,r,n,o),!0;case"dragenter":return Ye=Xe(Ye,e,t,r,n,o),!0;case"mouseover":return Me=Xe(Me,e,t,r,n,o),!0;case"pointerover":var l=o.pointerId;return jt.set(l,Xe(jt.get(l)||null,e,t,r,n,o)),!0;case"gotpointercapture":return l=o.pointerId,J.set(l,Xe(J.get(l)||null,e,t,r,n,o)),!0}return!1}function mo(e){var t=en(e.target);if(t!==null){var r=De(t);if(r!==null){if(t=r.tag,t===13){if(t=jn(r),t!==null){e.blockedOn=t,de(e.priority,function(){W(r)});return}}else if(t===3&&r.stateNode.current.memoizedState.isDehydrated){e.blockedOn=r.tag===3?r.stateNode.containerInfo:null;return}}}e.blockedOn=null}function Ln(e){if(e.blockedOn!==null)return!1;for(var t=e.targetContainers;0<t.length;){var r=ml(e.domEventName,e.eventSystemFlags,t[0],e.nativeEvent);if(r===null){r=e.nativeEvent;var n=new r.constructor(r.type,r);Yr=n,r.target.dispatchEvent(n),Yr=null}else return t=Eo(r),t!==null&&Q(t),e.blockedOn=r,!1;t.shift()}return!0}function ts(e,t,r){Ln(e)&&r.delete(t)}function Zc(){Se=!1,Re!==null&&Ln(Re)&&(Re=null),Ye!==null&&Ln(Ye)&&(Ye=null),Me!==null&&Ln(Me)&&(Me=null),jt.forEach(ts),J.forEach(ts)}function go(e,t){e.blockedOn===t&&(e.blockedOn=null,Se||(Se=!0,f.unstable_scheduleCallback(f.unstable_NormalPriority,Zc)))}function ho(e){function t(o){return go(o,e)}if(0<Oe.length){go(Oe[0],e);for(var r=1;r<Oe.length;r++){var n=Oe[r];n.blockedOn===e&&(n.blockedOn=null)}}for(Re!==null&&go(Re,e),Ye!==null&&go(Ye,e),Me!==null&&go(Me,e),jt.forEach(t),J.forEach(t),r=0;r<we.length;r++)n=we[r],n.blockedOn===e&&(n.blockedOn=null);for(;0<we.length&&(r=we[0],r.blockedOn===null);)mo(r),r.blockedOn===null&&we.shift()}var Rn=me.ReactCurrentBatchConfig,Jo=!0;function Jc(e,t,r,n){var o=g,l=Rn.transition;Rn.transition=null;try{g=1,fl(e,t,r,n)}finally{g=o,Rn.transition=l}}function ed(e,t,r,n){var o=g,l=Rn.transition;Rn.transition=null;try{g=4,fl(e,t,r,n)}finally{g=o,Rn.transition=l}}function fl(e,t,r,n){if(Jo){var o=ml(e,t,r,n);if(o===null)Tl(e,t,n,ei,r),qe(e,n);else if(Er(o,e,t,r,n))n.stopPropagation();else if(qe(e,n),t&4&&-1<be.indexOf(e)){for(;o!==null;){var l=Eo(o);if(l!==null&&E(l),l=ml(e,t,r,n),l===null&&Tl(e,t,n,ei,r),l===o)break;o=l}o!==null&&n.stopPropagation()}else Tl(e,t,n,null,r)}}var ei=null;function ml(e,t,r,n){if(ei=null,e=br(n),e=en(e),e!==null)if(t=De(e),t===null)e=null;else if(r=t.tag,r===13){if(e=jn(t),e!==null)return e;e=null}else if(r===3){if(t.stateNode.current.memoizedState.isDehydrated)return t.tag===3?t.stateNode.containerInfo:null;e=null}else t!==e&&(e=null);return ei=e,null}function rs(e){switch(e){case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 1;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"toggle":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 4;case"message":switch(Ko()){case po:return 1;case jr:return 4;case Cn:case sl:return 16;case Go:return 536870912;default:return 16}default:return 16}}var _r=null,gl=null,ti=null;function ns(){if(ti)return ti;var e,t=gl,r=t.length,n,o="value"in _r?_r.value:_r.textContent,l=o.length;for(e=0;e<r&&t[e]===o[e];e++);var a=r-e;for(n=1;n<=a&&t[r-n]===o[l-n];n++);return ti=o.slice(e,1<n?1-n:void 0)}function ri(e){var t=e.keyCode;return"charCode"in e?(e=e.charCode,e===0&&t===13&&(e=13)):e=t,e===10&&(e=13),32<=e||e===13?e:0}function ni(){return!0}function os(){return!1}function St(e){function t(r,n,o,l,a){this._reactName=r,this._targetInst=o,this.type=n,this.nativeEvent=l,this.target=a,this.currentTarget=null;for(var d in e)e.hasOwnProperty(d)&&(r=e[d],this[d]=r?r(l):l[d]);return this.isDefaultPrevented=(l.defaultPrevented!=null?l.defaultPrevented:l.returnValue===!1)?ni:os,this.isPropagationStopped=os,this}return D(t.prototype,{preventDefault:function(){this.defaultPrevented=!0;var r=this.nativeEvent;r&&(r.preventDefault?r.preventDefault():typeof r.returnValue!="unknown"&&(r.returnValue=!1),this.isDefaultPrevented=ni)},stopPropagation:function(){var r=this.nativeEvent;r&&(r.stopPropagation?r.stopPropagation():typeof r.cancelBubble!="unknown"&&(r.cancelBubble=!0),this.isPropagationStopped=ni)},persist:function(){},isPersistent:ni}),t}var Mn={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(e){return e.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},hl=St(Mn),vo=D({},Mn,{view:0,detail:0}),td=St(vo),vl,xl,xo,oi=D({},vo,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:wl,button:0,buttons:0,relatedTarget:function(e){return e.relatedTarget===void 0?e.fromElement===e.srcElement?e.toElement:e.fromElement:e.relatedTarget},movementX:function(e){return"movementX"in e?e.movementX:(e!==xo&&(xo&&e.type==="mousemove"?(vl=e.screenX-xo.screenX,xl=e.screenY-xo.screenY):xl=vl=0,xo=e),vl)},movementY:function(e){return"movementY"in e?e.movementY:xl}}),is=St(oi),rd=D({},oi,{dataTransfer:0}),nd=St(rd),od=D({},vo,{relatedTarget:0}),yl=St(od),id=D({},Mn,{animationName:0,elapsedTime:0,pseudoElement:0}),ld=St(id),ad=D({},Mn,{clipboardData:function(e){return"clipboardData"in e?e.clipboardData:window.clipboardData}}),sd=St(ad),ud=D({},Mn,{data:0}),ls=St(ud),cd={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},dd={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},pd={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function fd(e){var t=this.nativeEvent;return t.getModifierState?t.getModifierState(e):(e=pd[e])?!!t[e]:!1}function wl(){return fd}var md=D({},vo,{key:function(e){if(e.key){var t=cd[e.key]||e.key;if(t!=="Unidentified")return t}return e.type==="keypress"?(e=ri(e),e===13?"Enter":String.fromCharCode(e)):e.type==="keydown"||e.type==="keyup"?dd[e.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:wl,charCode:function(e){return e.type==="keypress"?ri(e):0},keyCode:function(e){return e.type==="keydown"||e.type==="keyup"?e.keyCode:0},which:function(e){return e.type==="keypress"?ri(e):e.type==="keydown"||e.type==="keyup"?e.keyCode:0}}),gd=St(md),hd=D({},oi,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),as=St(hd),vd=D({},vo,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:wl}),xd=St(vd),yd=D({},Mn,{propertyName:0,elapsedTime:0,pseudoElement:0}),wd=St(yd),bd=D({},oi,{deltaX:function(e){return"deltaX"in e?e.deltaX:"wheelDeltaX"in e?-e.wheelDeltaX:0},deltaY:function(e){return"deltaY"in e?e.deltaY:"wheelDeltaY"in e?-e.wheelDeltaY:"wheelDelta"in e?-e.wheelDelta:0},deltaZ:0,deltaMode:0}),zd=St(bd),kd=[9,13,27,32],bl=Y&&"CompositionEvent"in window,yo=null;Y&&"documentMode"in document&&(yo=document.documentMode);var jd=Y&&"TextEvent"in window&&!yo,ss=Y&&(!bl||yo&&8<yo&&11>=yo),us=" ",cs=!1;function ds(e,t){switch(e){case"keyup":return kd.indexOf(t.keyCode)!==-1;case"keydown":return t.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function ps(e){return e=e.detail,typeof e=="object"&&"data"in e?e.data:null}var In=!1;function Sd(e,t){switch(e){case"compositionend":return ps(t);case"keypress":return t.which!==32?null:(cs=!0,us);case"textInput":return e=t.data,e===us&&cs?null:e;default:return null}}function Nd(e,t){if(In)return e==="compositionend"||!bl&&ds(e,t)?(e=ns(),ti=gl=_r=null,In=!1,e):null;switch(e){case"paste":return null;case"keypress":if(!(t.ctrlKey||t.altKey||t.metaKey)||t.ctrlKey&&t.altKey){if(t.char&&1<t.char.length)return t.char;if(t.which)return String.fromCharCode(t.which)}return null;case"compositionend":return ss&&t.locale!=="ko"?null:t.data;default:return null}}var Cd={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function fs(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t==="input"?!!Cd[e.type]:t==="textarea"}function ms(e,t,r,n){ao(n),t=ui(t,"onChange"),0<t.length&&(r=new hl("onChange","change",null,r,n),e.push({event:r,listeners:t}))}var wo=null,bo=null;function Ed(e){Ls(e,0)}function ii(e){var t=An(e);if(Hr(t))return e}function _d(e,t){if(e==="change")return t}var gs=!1;if(Y){var zl;if(Y){var kl="oninput"in document;if(!kl){var hs=document.createElement("div");hs.setAttribute("oninput","return;"),kl=typeof hs.oninput=="function"}zl=kl}else zl=!1;gs=zl&&(!document.documentMode||9<document.documentMode)}function vs(){wo&&(wo.detachEvent("onpropertychange",xs),bo=wo=null)}function xs(e){if(e.propertyName==="value"&&ii(bo)){var t=[];ms(t,bo,e,br(e)),Gr(Ed,t)}}function Pd(e,t,r){e==="focusin"?(vs(),wo=t,bo=r,wo.attachEvent("onpropertychange",xs)):e==="focusout"&&vs()}function Td(e){if(e==="selectionchange"||e==="keyup"||e==="keydown")return ii(bo)}function Ld(e,t){if(e==="click")return ii(t)}function Rd(e,t){if(e==="input"||e==="change")return ii(t)}function Md(e,t){return e===t&&(e!==0||1/e===1/t)||e!==e&&t!==t}var Ut=typeof Object.is=="function"?Object.is:Md;function zo(e,t){if(Ut(e,t))return!0;if(typeof e!="object"||e===null||typeof t!="object"||t===null)return!1;var r=Object.keys(e),n=Object.keys(t);if(r.length!==n.length)return!1;for(n=0;n<r.length;n++){var o=r[n];if(!$.call(t,o)||!Ut(e[o],t[o]))return!1}return!0}function ys(e){for(;e&&e.firstChild;)e=e.firstChild;return e}function ws(e,t){var r=ys(e);e=0;for(var n;r;){if(r.nodeType===3){if(n=e+r.textContent.length,e<=t&&n>=t)return{node:r,offset:t-e};e=n}e:{for(;r;){if(r.nextSibling){r=r.nextSibling;break e}r=r.parentNode}r=void 0}r=ys(r)}}function bs(e,t){return e&&t?e===t?!0:e&&e.nodeType===3?!1:t&&t.nodeType===3?bs(e,t.parentNode):"contains"in e?e.contains(t):e.compareDocumentPosition?!!(e.compareDocumentPosition(t)&16):!1:!1}function zs(){for(var e=window,t=Pt();t instanceof e.HTMLIFrameElement;){try{var r=typeof t.contentWindow.location.href=="string"}catch{r=!1}if(r)e=t.contentWindow;else break;t=Pt(e.document)}return t}function jl(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t&&(t==="input"&&(e.type==="text"||e.type==="search"||e.type==="tel"||e.type==="url"||e.type==="password")||t==="textarea"||e.contentEditable==="true")}function Id(e){var t=zs(),r=e.focusedElem,n=e.selectionRange;if(t!==r&&r&&r.ownerDocument&&bs(r.ownerDocument.documentElement,r)){if(n!==null&&jl(r)){if(t=n.start,e=n.end,e===void 0&&(e=t),"selectionStart"in r)r.selectionStart=t,r.selectionEnd=Math.min(e,r.value.length);else if(e=(t=r.ownerDocument||document)&&t.defaultView||window,e.getSelection){e=e.getSelection();var o=r.textContent.length,l=Math.min(n.start,o);n=n.end===void 0?l:Math.min(n.end,o),!e.extend&&l>n&&(o=n,n=l,l=o),o=ws(r,l);var a=ws(r,n);o&&a&&(e.rangeCount!==1||e.anchorNode!==o.node||e.anchorOffset!==o.offset||e.focusNode!==a.node||e.focusOffset!==a.offset)&&(t=t.createRange(),t.setStart(o.node,o.offset),e.removeAllRanges(),l>n?(e.addRange(t),e.extend(a.node,a.offset)):(t.setEnd(a.node,a.offset),e.addRange(t)))}}for(t=[],e=r;e=e.parentNode;)e.nodeType===1&&t.push({element:e,left:e.scrollLeft,top:e.scrollTop});for(typeof r.focus=="function"&&r.focus(),r=0;r<t.length;r++)e=t[r],e.element.scrollLeft=e.left,e.element.scrollTop=e.top}}var Od=Y&&"documentMode"in document&&11>=document.documentMode,On=null,Sl=null,ko=null,Nl=!1;function ks(e,t,r){var n=r.window===r?r.document:r.nodeType===9?r:r.ownerDocument;Nl||On==null||On!==Pt(n)||(n=On,"selectionStart"in n&&jl(n)?n={start:n.selectionStart,end:n.selectionEnd}:(n=(n.ownerDocument&&n.ownerDocument.defaultView||window).getSelection(),n={anchorNode:n.anchorNode,anchorOffset:n.anchorOffset,focusNode:n.focusNode,focusOffset:n.focusOffset}),ko&&zo(ko,n)||(ko=n,n=ui(Sl,"onSelect"),0<n.length&&(t=new hl("onSelect","select",null,t,r),e.push({event:t,listeners:n}),t.target=On)))}function li(e,t){var r={};return r[e.toLowerCase()]=t.toLowerCase(),r["Webkit"+e]="webkit"+t,r["Moz"+e]="moz"+t,r}var Fn={animationend:li("Animation","AnimationEnd"),animationiteration:li("Animation","AnimationIteration"),animationstart:li("Animation","AnimationStart"),transitionend:li("Transition","TransitionEnd")},Cl={},js={};Y&&(js=document.createElement("div").style,"AnimationEvent"in window||(delete Fn.animationend.animation,delete Fn.animationiteration.animation,delete Fn.animationstart.animation),"TransitionEvent"in window||delete Fn.transitionend.transition);function ai(e){if(Cl[e])return Cl[e];if(!Fn[e])return e;var t=Fn[e],r;for(r in t)if(t.hasOwnProperty(r)&&r in js)return Cl[e]=t[r];return e}var Ss=ai("animationend"),Ns=ai("animationiteration"),Cs=ai("animationstart"),Es=ai("transitionend"),_s=new Map,Ps="abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");function Pr(e,t){_s.set(e,t),P(t,[e])}for(var El=0;El<Ps.length;El++){var _l=Ps[El],Fd=_l.toLowerCase(),Dd=_l[0].toUpperCase()+_l.slice(1);Pr(Fd,"on"+Dd)}Pr(Ss,"onAnimationEnd"),Pr(Ns,"onAnimationIteration"),Pr(Cs,"onAnimationStart"),Pr("dblclick","onDoubleClick"),Pr("focusin","onFocus"),Pr("focusout","onBlur"),Pr(Es,"onTransitionEnd"),q("onMouseEnter",["mouseout","mouseover"]),q("onMouseLeave",["mouseout","mouseover"]),q("onPointerEnter",["pointerout","pointerover"]),q("onPointerLeave",["pointerout","pointerover"]),P("onChange","change click focusin focusout input keydown keyup selectionchange".split(" ")),P("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")),P("onBeforeInput",["compositionend","keypress","textInput","paste"]),P("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" ")),P("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" ")),P("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var jo="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),$d=new Set("cancel close invalid load scroll toggle".split(" ").concat(jo));function Ts(e,t,r){var n=e.type||"unknown-event";e.currentTarget=r,kr(n,t,void 0,e),e.currentTarget=null}function Ls(e,t){t=(t&4)!==0;for(var r=0;r<e.length;r++){var n=e[r],o=n.event;n=n.listeners;e:{var l=void 0;if(t)for(var a=n.length-1;0<=a;a--){var d=n[a],p=d.instance,y=d.currentTarget;if(d=d.listener,p!==l&&o.isPropagationStopped())break e;Ts(o,d,y),l=p}else for(a=0;a<n.length;a++){if(d=n[a],p=d.instance,y=d.currentTarget,d=d.listener,p!==l&&o.isPropagationStopped())break e;Ts(o,d,y),l=p}}}if(Xr)throw e=bn,Xr=!1,bn=null,e}function $e(e,t){var r=t[Fl];r===void 0&&(r=t[Fl]=new Set);var n=e+"__bubble";r.has(n)||(Rs(t,e,2,!1),r.add(n))}function Pl(e,t,r){var n=0;t&&(n|=4),Rs(r,e,n,t)}var si="_reactListening"+Math.random().toString(36).slice(2);function So(e){if(!e[si]){e[si]=!0,z.forEach(function(r){r!=="selectionchange"&&($d.has(r)||Pl(r,!1,e),Pl(r,!0,e))});var t=e.nodeType===9?e:e.ownerDocument;t===null||t[si]||(t[si]=!0,Pl("selectionchange",!1,t))}}function Rs(e,t,r,n){switch(rs(t)){case 1:var o=Jc;break;case 4:o=ed;break;default:o=fl}r=o.bind(null,t,r,e),o=void 0,!so||t!=="touchstart"&&t!=="touchmove"&&t!=="wheel"||(o=!0),n?o!==void 0?e.addEventListener(t,r,{capture:!0,passive:o}):e.addEventListener(t,r,!0):o!==void 0?e.addEventListener(t,r,{passive:o}):e.addEventListener(t,r,!1)}function Tl(e,t,r,n,o){var l=n;if((t&1)===0&&(t&2)===0&&n!==null)e:for(;;){if(n===null)return;var a=n.tag;if(a===3||a===4){var d=n.stateNode.containerInfo;if(d===o||d.nodeType===8&&d.parentNode===o)break;if(a===4)for(a=n.return;a!==null;){var p=a.tag;if((p===3||p===4)&&(p=a.stateNode.containerInfo,p===o||p.nodeType===8&&p.parentNode===o))return;a=a.return}for(;d!==null;){if(a=en(d),a===null)return;if(p=a.tag,p===5||p===6){n=l=a;continue e}d=d.parentNode}}n=n.return}Gr(function(){var y=l,C=br(r),_=[];e:{var N=_s.get(e);if(N!==void 0){var U=hl,K=e;switch(e){case"keypress":if(ri(r)===0)break e;case"keydown":case"keyup":U=gd;break;case"focusin":K="focus",U=yl;break;case"focusout":K="blur",U=yl;break;case"beforeblur":case"afterblur":U=yl;break;case"click":if(r.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":U=is;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":U=nd;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":U=xd;break;case Ss:case Ns:case Cs:U=ld;break;case Es:U=wd;break;case"scroll":U=td;break;case"wheel":U=zd;break;case"copy":case"cut":case"paste":U=sd;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":U=as}var G=(t&4)!==0,Ge=!G&&e==="scroll",v=G?N!==null?N+"Capture":null:N;G=[];for(var m=y,x;m!==null;){x=m;var R=x.stateNode;if(x.tag===5&&R!==null&&(x=R,v!==null&&(R=mt(m,v),R!=null&&G.push(No(m,R,x)))),Ge)break;m=m.return}0<G.length&&(N=new U(N,K,null,r,C),_.push({event:N,listeners:G}))}}if((t&7)===0){e:{if(N=e==="mouseover"||e==="pointerover",U=e==="mouseout"||e==="pointerout",N&&r!==Yr&&(K=r.relatedTarget||r.fromElement)&&(en(K)||K[ar]))break e;if((U||N)&&(N=C.window===C?C:(N=C.ownerDocument)?N.defaultView||N.parentWindow:window,U?(K=r.relatedTarget||r.toElement,U=y,K=K?en(K):null,K!==null&&(Ge=De(K),K!==Ge||K.tag!==5&&K.tag!==6)&&(K=null)):(U=null,K=y),U!==K)){if(G=is,R="onMouseLeave",v="onMouseEnter",m="mouse",(e==="pointerout"||e==="pointerover")&&(G=as,R="onPointerLeave",v="onPointerEnter",m="pointer"),Ge=U==null?N:An(U),x=K==null?N:An(K),N=new G(R,m+"leave",U,r,C),N.target=Ge,N.relatedTarget=x,R=null,en(C)===y&&(G=new G(v,m+"enter",K,r,C),G.target=x,G.relatedTarget=Ge,R=G),Ge=R,U&&K)t:{for(G=U,v=K,m=0,x=G;x;x=Dn(x))m++;for(x=0,R=v;R;R=Dn(R))x++;for(;0<m-x;)G=Dn(G),m--;for(;0<x-m;)v=Dn(v),x--;for(;m--;){if(G===v||v!==null&&G===v.alternate)break t;G=Dn(G),v=Dn(v)}G=null}else G=null;U!==null&&Ms(_,N,U,G,!1),K!==null&&Ge!==null&&Ms(_,Ge,K,G,!0)}}e:{if(N=y?An(y):window,U=N.nodeName&&N.nodeName.toLowerCase(),U==="select"||U==="input"&&N.type==="file")var Z=_d;else if(fs(N))if(gs)Z=Rd;else{Z=Td;var ie=Pd}else(U=N.nodeName)&&U.toLowerCase()==="input"&&(N.type==="checkbox"||N.type==="radio")&&(Z=Ld);if(Z&&(Z=Z(e,y))){ms(_,Z,r,C);break e}ie&&ie(e,N,y),e==="focusout"&&(ie=N._wrapperState)&&ie.controlled&&N.type==="number"&&hr(N,"number",N.value)}switch(ie=y?An(y):window,e){case"focusin":(fs(ie)||ie.contentEditable==="true")&&(On=ie,Sl=y,ko=null);break;case"focusout":ko=Sl=On=null;break;case"mousedown":Nl=!0;break;case"contextmenu":case"mouseup":case"dragend":Nl=!1,ks(_,r,C);break;case"selectionchange":if(Od)break;case"keydown":case"keyup":ks(_,r,C)}var le;if(bl)e:{switch(e){case"compositionstart":var pe="onCompositionStart";break e;case"compositionend":pe="onCompositionEnd";break e;case"compositionupdate":pe="onCompositionUpdate";break e}pe=void 0}else In?ds(e,r)&&(pe="onCompositionEnd"):e==="keydown"&&r.keyCode===229&&(pe="onCompositionStart");pe&&(ss&&r.locale!=="ko"&&(In||pe!=="onCompositionStart"?pe==="onCompositionEnd"&&In&&(le=ns()):(_r=C,gl="value"in _r?_r.value:_r.textContent,In=!0)),ie=ui(y,pe),0<ie.length&&(pe=new ls(pe,e,null,r,C),_.push({event:pe,listeners:ie}),le?pe.data=le:(le=ps(r),le!==null&&(pe.data=le)))),(le=jd?Sd(e,r):Nd(e,r))&&(y=ui(y,"onBeforeInput"),0<y.length&&(C=new ls("onBeforeInput","beforeinput",null,r,C),_.push({event:C,listeners:y}),C.data=le))}Ls(_,t)})}function No(e,t,r){return{instance:e,listener:t,currentTarget:r}}function ui(e,t){for(var r=t+"Capture",n=[];e!==null;){var o=e,l=o.stateNode;o.tag===5&&l!==null&&(o=l,l=mt(e,r),l!=null&&n.unshift(No(e,l,o)),l=mt(e,t),l!=null&&n.push(No(e,l,o))),e=e.return}return n}function Dn(e){if(e===null)return null;do e=e.return;while(e&&e.tag!==5);return e||null}function Ms(e,t,r,n,o){for(var l=t._reactName,a=[];r!==null&&r!==n;){var d=r,p=d.alternate,y=d.stateNode;if(p!==null&&p===n)break;d.tag===5&&y!==null&&(d=y,o?(p=mt(r,l),p!=null&&a.unshift(No(r,p,d))):o||(p=mt(r,l),p!=null&&a.push(No(r,p,d)))),r=r.return}a.length!==0&&e.push({event:t,listeners:a})}var Ad=/\r\n?/g,Bd=/\u0000|\uFFFD/g;function Is(e){return(typeof e=="string"?e:""+e).replace(Ad,`
`).replace(Bd,"")}function ci(e,t,r){if(t=Is(t),Is(e)!==t&&r)throw Error(u(425))}function di(){}var Ll=null,Rl=null;function Ml(e,t){return e==="textarea"||e==="noscript"||typeof t.children=="string"||typeof t.children=="number"||typeof t.dangerouslySetInnerHTML=="object"&&t.dangerouslySetInnerHTML!==null&&t.dangerouslySetInnerHTML.__html!=null}var Il=typeof setTimeout=="function"?setTimeout:void 0,Ud=typeof clearTimeout=="function"?clearTimeout:void 0,Os=typeof Promise=="function"?Promise:void 0,Wd=typeof queueMicrotask=="function"?queueMicrotask:typeof Os<"u"?function(e){return Os.resolve(null).then(e).catch(Hd)}:Il;function Hd(e){setTimeout(function(){throw e})}function Ol(e,t){var r=t,n=0;do{var o=r.nextSibling;if(e.removeChild(r),o&&o.nodeType===8)if(r=o.data,r==="/$"){if(n===0){e.removeChild(o),ho(t);return}n--}else r!=="$"&&r!=="$?"&&r!=="$!"||n++;r=o}while(r);ho(t)}function Tr(e){for(;e!=null;e=e.nextSibling){var t=e.nodeType;if(t===1||t===3)break;if(t===8){if(t=e.data,t==="$"||t==="$!"||t==="$?")break;if(t==="/$")return null}}return e}function Fs(e){e=e.previousSibling;for(var t=0;e;){if(e.nodeType===8){var r=e.data;if(r==="$"||r==="$!"||r==="$?"){if(t===0)return e;t--}else r==="/$"&&t++}e=e.previousSibling}return null}var $n=Math.random().toString(36).slice(2),Jt="__reactFiber$"+$n,Co="__reactProps$"+$n,ar="__reactContainer$"+$n,Fl="__reactEvents$"+$n,Qd="__reactListeners$"+$n,Vd="__reactHandles$"+$n;function en(e){var t=e[Jt];if(t)return t;for(var r=e.parentNode;r;){if(t=r[ar]||r[Jt]){if(r=t.alternate,t.child!==null||r!==null&&r.child!==null)for(e=Fs(e);e!==null;){if(r=e[Jt])return r;e=Fs(e)}return t}e=r,r=e.parentNode}return null}function Eo(e){return e=e[Jt]||e[ar],!e||e.tag!==5&&e.tag!==6&&e.tag!==13&&e.tag!==3?null:e}function An(e){if(e.tag===5||e.tag===6)return e.stateNode;throw Error(u(33))}function pi(e){return e[Co]||null}var Dl=[],Bn=-1;function Lr(e){return{current:e}}function Ae(e){0>Bn||(e.current=Dl[Bn],Dl[Bn]=null,Bn--)}function Fe(e,t){Bn++,Dl[Bn]=e.current,e.current=t}var Rr={},lt=Lr(Rr),gt=Lr(!1),tn=Rr;function Un(e,t){var r=e.type.contextTypes;if(!r)return Rr;var n=e.stateNode;if(n&&n.__reactInternalMemoizedUnmaskedChildContext===t)return n.__reactInternalMemoizedMaskedChildContext;var o={},l;for(l in r)o[l]=t[l];return n&&(e=e.stateNode,e.__reactInternalMemoizedUnmaskedChildContext=t,e.__reactInternalMemoizedMaskedChildContext=o),o}function ht(e){return e=e.childContextTypes,e!=null}function fi(){Ae(gt),Ae(lt)}function Ds(e,t,r){if(lt.current!==Rr)throw Error(u(168));Fe(lt,t),Fe(gt,r)}function $s(e,t,r){var n=e.stateNode;if(t=t.childContextTypes,typeof n.getChildContext!="function")return r;n=n.getChildContext();for(var o in n)if(!(o in t))throw Error(u(108,_e(e)||"Unknown",o));return D({},r,n)}function mi(e){return e=(e=e.stateNode)&&e.__reactInternalMemoizedMergedChildContext||Rr,tn=lt.current,Fe(lt,e),Fe(gt,gt.current),!0}function As(e,t,r){var n=e.stateNode;if(!n)throw Error(u(169));r?(e=$s(e,t,tn),n.__reactInternalMemoizedMergedChildContext=e,Ae(gt),Ae(lt),Fe(lt,e)):Ae(gt),Fe(gt,r)}var sr=null,gi=!1,$l=!1;function Bs(e){sr===null?sr=[e]:sr.push(e)}function Yd(e){gi=!0,Bs(e)}function Mr(){if(!$l&&sr!==null){$l=!0;var e=0,t=g;try{var r=sr;for(g=1;e<r.length;e++){var n=r[e];do n=n(!0);while(n!==null)}sr=null,gi=!1}catch(o){throw sr!==null&&(sr=sr.slice(e+1)),Sn(po,Mr),o}finally{g=t,$l=!1}}return null}var Wn=[],Hn=0,hi=null,vi=0,Lt=[],Rt=0,rn=null,ur=1,cr="";function nn(e,t){Wn[Hn++]=vi,Wn[Hn++]=hi,hi=e,vi=t}function Us(e,t,r){Lt[Rt++]=ur,Lt[Rt++]=cr,Lt[Rt++]=rn,rn=e;var n=ur;e=cr;var o=32-kt(n)-1;n&=~(1<<o),r+=1;var l=32-kt(t)+o;if(30<l){var a=o-o%5;l=(n&(1<<a)-1).toString(32),n>>=a,o-=a,ur=1<<32-kt(t)+o|r<<o|n,cr=l+e}else ur=1<<l|r<<o|n,cr=e}function Al(e){e.return!==null&&(nn(e,1),Us(e,1,0))}function Bl(e){for(;e===hi;)hi=Wn[--Hn],Wn[Hn]=null,vi=Wn[--Hn],Wn[Hn]=null;for(;e===rn;)rn=Lt[--Rt],Lt[Rt]=null,cr=Lt[--Rt],Lt[Rt]=null,ur=Lt[--Rt],Lt[Rt]=null}var Nt=null,Ct=null,We=!1,Wt=null;function Ws(e,t){var r=Ft(5,null,null,0);r.elementType="DELETED",r.stateNode=t,r.return=e,t=e.deletions,t===null?(e.deletions=[r],e.flags|=16):t.push(r)}function Hs(e,t){switch(e.tag){case 5:var r=e.type;return t=t.nodeType!==1||r.toLowerCase()!==t.nodeName.toLowerCase()?null:t,t!==null?(e.stateNode=t,Nt=e,Ct=Tr(t.firstChild),!0):!1;case 6:return t=e.pendingProps===""||t.nodeType!==3?null:t,t!==null?(e.stateNode=t,Nt=e,Ct=null,!0):!1;case 13:return t=t.nodeType!==8?null:t,t!==null?(r=rn!==null?{id:ur,overflow:cr}:null,e.memoizedState={dehydrated:t,treeContext:r,retryLane:1073741824},r=Ft(18,null,null,0),r.stateNode=t,r.return=e,e.child=r,Nt=e,Ct=null,!0):!1;default:return!1}}function Ul(e){return(e.mode&1)!==0&&(e.flags&128)===0}function Wl(e){if(We){var t=Ct;if(t){var r=t;if(!Hs(e,t)){if(Ul(e))throw Error(u(418));t=Tr(r.nextSibling);var n=Nt;t&&Hs(e,t)?Ws(n,r):(e.flags=e.flags&-4097|2,We=!1,Nt=e)}}else{if(Ul(e))throw Error(u(418));e.flags=e.flags&-4097|2,We=!1,Nt=e}}}function Qs(e){for(e=e.return;e!==null&&e.tag!==5&&e.tag!==3&&e.tag!==13;)e=e.return;Nt=e}function xi(e){if(e!==Nt)return!1;if(!We)return Qs(e),We=!0,!1;var t;if((t=e.tag!==3)&&!(t=e.tag!==5)&&(t=e.type,t=t!=="head"&&t!=="body"&&!Ml(e.type,e.memoizedProps)),t&&(t=Ct)){if(Ul(e))throw Vs(),Error(u(418));for(;t;)Ws(e,t),t=Tr(t.nextSibling)}if(Qs(e),e.tag===13){if(e=e.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(u(317));e:{for(e=e.nextSibling,t=0;e;){if(e.nodeType===8){var r=e.data;if(r==="/$"){if(t===0){Ct=Tr(e.nextSibling);break e}t--}else r!=="$"&&r!=="$!"&&r!=="$?"||t++}e=e.nextSibling}Ct=null}}else Ct=Nt?Tr(e.stateNode.nextSibling):null;return!0}function Vs(){for(var e=Ct;e;)e=Tr(e.nextSibling)}function Qn(){Ct=Nt=null,We=!1}function Hl(e){Wt===null?Wt=[e]:Wt.push(e)}var Kd=me.ReactCurrentBatchConfig;function _o(e,t,r){if(e=r.ref,e!==null&&typeof e!="function"&&typeof e!="object"){if(r._owner){if(r=r._owner,r){if(r.tag!==1)throw Error(u(309));var n=r.stateNode}if(!n)throw Error(u(147,e));var o=n,l=""+e;return t!==null&&t.ref!==null&&typeof t.ref=="function"&&t.ref._stringRef===l?t.ref:(t=function(a){var d=o.refs;a===null?delete d[l]:d[l]=a},t._stringRef=l,t)}if(typeof e!="string")throw Error(u(284));if(!r._owner)throw Error(u(290,e))}return e}function yi(e,t){throw e=Object.prototype.toString.call(t),Error(u(31,e==="[object Object]"?"object with keys {"+Object.keys(t).join(", ")+"}":e))}function Ys(e){var t=e._init;return t(e._payload)}function Ks(e){function t(v,m){if(e){var x=v.deletions;x===null?(v.deletions=[m],v.flags|=16):x.push(m)}}function r(v,m){if(!e)return null;for(;m!==null;)t(v,m),m=m.sibling;return null}function n(v,m){for(v=new Map;m!==null;)m.key!==null?v.set(m.key,m):v.set(m.index,m),m=m.sibling;return v}function o(v,m){return v=Ur(v,m),v.index=0,v.sibling=null,v}function l(v,m,x){return v.index=x,e?(x=v.alternate,x!==null?(x=x.index,x<m?(v.flags|=2,m):x):(v.flags|=2,m)):(v.flags|=1048576,m)}function a(v){return e&&v.alternate===null&&(v.flags|=2),v}function d(v,m,x,R){return m===null||m.tag!==6?(m=Ia(x,v.mode,R),m.return=v,m):(m=o(m,x),m.return=v,m)}function p(v,m,x,R){var Z=x.type;return Z===xe?C(v,m,x.props.children,R,x.key):m!==null&&(m.elementType===Z||typeof Z=="object"&&Z!==null&&Z.$$typeof===ce&&Ys(Z)===m.type)?(R=o(m,x.props),R.ref=_o(v,m,x),R.return=v,R):(R=Wi(x.type,x.key,x.props,null,v.mode,R),R.ref=_o(v,m,x),R.return=v,R)}function y(v,m,x,R){return m===null||m.tag!==4||m.stateNode.containerInfo!==x.containerInfo||m.stateNode.implementation!==x.implementation?(m=Oa(x,v.mode,R),m.return=v,m):(m=o(m,x.children||[]),m.return=v,m)}function C(v,m,x,R,Z){return m===null||m.tag!==7?(m=pn(x,v.mode,R,Z),m.return=v,m):(m=o(m,x),m.return=v,m)}function _(v,m,x){if(typeof m=="string"&&m!==""||typeof m=="number")return m=Ia(""+m,v.mode,x),m.return=v,m;if(typeof m=="object"&&m!==null){switch(m.$$typeof){case oe:return x=Wi(m.type,m.key,m.props,null,v.mode,x),x.ref=_o(v,null,m),x.return=v,x;case he:return m=Oa(m,v.mode,x),m.return=v,m;case ce:var R=m._init;return _(v,R(m._payload),x)}if(ft(m)||H(m))return m=pn(m,v.mode,x,null),m.return=v,m;yi(v,m)}return null}function N(v,m,x,R){var Z=m!==null?m.key:null;if(typeof x=="string"&&x!==""||typeof x=="number")return Z!==null?null:d(v,m,""+x,R);if(typeof x=="object"&&x!==null){switch(x.$$typeof){case oe:return x.key===Z?p(v,m,x,R):null;case he:return x.key===Z?y(v,m,x,R):null;case ce:return Z=x._init,N(v,m,Z(x._payload),R)}if(ft(x)||H(x))return Z!==null?null:C(v,m,x,R,null);yi(v,x)}return null}function U(v,m,x,R,Z){if(typeof R=="string"&&R!==""||typeof R=="number")return v=v.get(x)||null,d(m,v,""+R,Z);if(typeof R=="object"&&R!==null){switch(R.$$typeof){case oe:return v=v.get(R.key===null?x:R.key)||null,p(m,v,R,Z);case he:return v=v.get(R.key===null?x:R.key)||null,y(m,v,R,Z);case ce:var ie=R._init;return U(v,m,x,ie(R._payload),Z)}if(ft(R)||H(R))return v=v.get(x)||null,C(m,v,R,Z,null);yi(m,R)}return null}function K(v,m,x,R){for(var Z=null,ie=null,le=m,pe=m=0,nt=null;le!==null&&pe<x.length;pe++){le.index>pe?(nt=le,le=null):nt=le.sibling;var Pe=N(v,le,x[pe],R);if(Pe===null){le===null&&(le=nt);break}e&&le&&Pe.alternate===null&&t(v,le),m=l(Pe,m,pe),ie===null?Z=Pe:ie.sibling=Pe,ie=Pe,le=nt}if(pe===x.length)return r(v,le),We&&nn(v,pe),Z;if(le===null){for(;pe<x.length;pe++)le=_(v,x[pe],R),le!==null&&(m=l(le,m,pe),ie===null?Z=le:ie.sibling=le,ie=le);return We&&nn(v,pe),Z}for(le=n(v,le);pe<x.length;pe++)nt=U(le,v,pe,x[pe],R),nt!==null&&(e&&nt.alternate!==null&&le.delete(nt.key===null?pe:nt.key),m=l(nt,m,pe),ie===null?Z=nt:ie.sibling=nt,ie=nt);return e&&le.forEach(function(Wr){return t(v,Wr)}),We&&nn(v,pe),Z}function G(v,m,x,R){var Z=H(x);if(typeof Z!="function")throw Error(u(150));if(x=Z.call(x),x==null)throw Error(u(151));for(var ie=Z=null,le=m,pe=m=0,nt=null,Pe=x.next();le!==null&&!Pe.done;pe++,Pe=x.next()){le.index>pe?(nt=le,le=null):nt=le.sibling;var Wr=N(v,le,Pe.value,R);if(Wr===null){le===null&&(le=nt);break}e&&le&&Wr.alternate===null&&t(v,le),m=l(Wr,m,pe),ie===null?Z=Wr:ie.sibling=Wr,ie=Wr,le=nt}if(Pe.done)return r(v,le),We&&nn(v,pe),Z;if(le===null){for(;!Pe.done;pe++,Pe=x.next())Pe=_(v,Pe.value,R),Pe!==null&&(m=l(Pe,m,pe),ie===null?Z=Pe:ie.sibling=Pe,ie=Pe);return We&&nn(v,pe),Z}for(le=n(v,le);!Pe.done;pe++,Pe=x.next())Pe=U(le,v,pe,Pe.value,R),Pe!==null&&(e&&Pe.alternate!==null&&le.delete(Pe.key===null?pe:Pe.key),m=l(Pe,m,pe),ie===null?Z=Pe:ie.sibling=Pe,ie=Pe);return e&&le.forEach(function(Cp){return t(v,Cp)}),We&&nn(v,pe),Z}function Ge(v,m,x,R){if(typeof x=="object"&&x!==null&&x.type===xe&&x.key===null&&(x=x.props.children),typeof x=="object"&&x!==null){switch(x.$$typeof){case oe:e:{for(var Z=x.key,ie=m;ie!==null;){if(ie.key===Z){if(Z=x.type,Z===xe){if(ie.tag===7){r(v,ie.sibling),m=o(ie,x.props.children),m.return=v,v=m;break e}}else if(ie.elementType===Z||typeof Z=="object"&&Z!==null&&Z.$$typeof===ce&&Ys(Z)===ie.type){r(v,ie.sibling),m=o(ie,x.props),m.ref=_o(v,ie,x),m.return=v,v=m;break e}r(v,ie);break}else t(v,ie);ie=ie.sibling}x.type===xe?(m=pn(x.props.children,v.mode,R,x.key),m.return=v,v=m):(R=Wi(x.type,x.key,x.props,null,v.mode,R),R.ref=_o(v,m,x),R.return=v,v=R)}return a(v);case he:e:{for(ie=x.key;m!==null;){if(m.key===ie)if(m.tag===4&&m.stateNode.containerInfo===x.containerInfo&&m.stateNode.implementation===x.implementation){r(v,m.sibling),m=o(m,x.children||[]),m.return=v,v=m;break e}else{r(v,m);break}else t(v,m);m=m.sibling}m=Oa(x,v.mode,R),m.return=v,v=m}return a(v);case ce:return ie=x._init,Ge(v,m,ie(x._payload),R)}if(ft(x))return K(v,m,x,R);if(H(x))return G(v,m,x,R);yi(v,x)}return typeof x=="string"&&x!==""||typeof x=="number"?(x=""+x,m!==null&&m.tag===6?(r(v,m.sibling),m=o(m,x),m.return=v,v=m):(r(v,m),m=Ia(x,v.mode,R),m.return=v,v=m),a(v)):r(v,m)}return Ge}var Vn=Ks(!0),Gs=Ks(!1),wi=Lr(null),bi=null,Yn=null,Ql=null;function Vl(){Ql=Yn=bi=null}function Yl(e){var t=wi.current;Ae(wi),e._currentValue=t}function Kl(e,t,r){for(;e!==null;){var n=e.alternate;if((e.childLanes&t)!==t?(e.childLanes|=t,n!==null&&(n.childLanes|=t)):n!==null&&(n.childLanes&t)!==t&&(n.childLanes|=t),e===r)break;e=e.return}}function Kn(e,t){bi=e,Ql=Yn=null,e=e.dependencies,e!==null&&e.firstContext!==null&&((e.lanes&t)!==0&&(vt=!0),e.firstContext=null)}function Mt(e){var t=e._currentValue;if(Ql!==e)if(e={context:e,memoizedValue:t,next:null},Yn===null){if(bi===null)throw Error(u(308));Yn=e,bi.dependencies={lanes:0,firstContext:e}}else Yn=Yn.next=e;return t}var on=null;function Gl(e){on===null?on=[e]:on.push(e)}function qs(e,t,r,n){var o=t.interleaved;return o===null?(r.next=r,Gl(t)):(r.next=o.next,o.next=r),t.interleaved=r,dr(e,n)}function dr(e,t){e.lanes|=t;var r=e.alternate;for(r!==null&&(r.lanes|=t),r=e,e=e.return;e!==null;)e.childLanes|=t,r=e.alternate,r!==null&&(r.childLanes|=t),r=e,e=e.return;return r.tag===3?r.stateNode:null}var Ir=!1;function ql(e){e.updateQueue={baseState:e.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null}}function Xs(e,t){e=e.updateQueue,t.updateQueue===e&&(t.updateQueue={baseState:e.baseState,firstBaseUpdate:e.firstBaseUpdate,lastBaseUpdate:e.lastBaseUpdate,shared:e.shared,effects:e.effects})}function pr(e,t){return{eventTime:e,lane:t,tag:0,payload:null,callback:null,next:null}}function Or(e,t,r){var n=e.updateQueue;if(n===null)return null;if(n=n.shared,(Ee&2)!==0){var o=n.pending;return o===null?t.next=t:(t.next=o.next,o.next=t),n.pending=t,dr(e,r)}return o=n.interleaved,o===null?(t.next=t,Gl(n)):(t.next=o.next,o.next=t),n.interleaved=t,dr(e,r)}function zi(e,t,r){if(t=t.updateQueue,t!==null&&(t=t.shared,(r&4194240)!==0)){var n=t.lanes;n&=e.pendingLanes,r|=n,t.lanes=r,c(e,r)}}function Zs(e,t){var r=e.updateQueue,n=e.alternate;if(n!==null&&(n=n.updateQueue,r===n)){var o=null,l=null;if(r=r.firstBaseUpdate,r!==null){do{var a={eventTime:r.eventTime,lane:r.lane,tag:r.tag,payload:r.payload,callback:r.callback,next:null};l===null?o=l=a:l=l.next=a,r=r.next}while(r!==null);l===null?o=l=t:l=l.next=t}else o=l=t;r={baseState:n.baseState,firstBaseUpdate:o,lastBaseUpdate:l,shared:n.shared,effects:n.effects},e.updateQueue=r;return}e=r.lastBaseUpdate,e===null?r.firstBaseUpdate=t:e.next=t,r.lastBaseUpdate=t}function ki(e,t,r,n){var o=e.updateQueue;Ir=!1;var l=o.firstBaseUpdate,a=o.lastBaseUpdate,d=o.shared.pending;if(d!==null){o.shared.pending=null;var p=d,y=p.next;p.next=null,a===null?l=y:a.next=y,a=p;var C=e.alternate;C!==null&&(C=C.updateQueue,d=C.lastBaseUpdate,d!==a&&(d===null?C.firstBaseUpdate=y:d.next=y,C.lastBaseUpdate=p))}if(l!==null){var _=o.baseState;a=0,C=y=p=null,d=l;do{var N=d.lane,U=d.eventTime;if((n&N)===N){C!==null&&(C=C.next={eventTime:U,lane:0,tag:d.tag,payload:d.payload,callback:d.callback,next:null});e:{var K=e,G=d;switch(N=t,U=r,G.tag){case 1:if(K=G.payload,typeof K=="function"){_=K.call(U,_,N);break e}_=K;break e;case 3:K.flags=K.flags&-65537|128;case 0:if(K=G.payload,N=typeof K=="function"?K.call(U,_,N):K,N==null)break e;_=D({},_,N);break e;case 2:Ir=!0}}d.callback!==null&&d.lane!==0&&(e.flags|=64,N=o.effects,N===null?o.effects=[d]:N.push(d))}else U={eventTime:U,lane:N,tag:d.tag,payload:d.payload,callback:d.callback,next:null},C===null?(y=C=U,p=_):C=C.next=U,a|=N;if(d=d.next,d===null){if(d=o.shared.pending,d===null)break;N=d,d=N.next,N.next=null,o.lastBaseUpdate=N,o.shared.pending=null}}while(!0);if(C===null&&(p=_),o.baseState=p,o.firstBaseUpdate=y,o.lastBaseUpdate=C,t=o.shared.interleaved,t!==null){o=t;do a|=o.lane,o=o.next;while(o!==t)}else l===null&&(o.shared.lanes=0);sn|=a,e.lanes=a,e.memoizedState=_}}function Js(e,t,r){if(e=t.effects,t.effects=null,e!==null)for(t=0;t<e.length;t++){var n=e[t],o=n.callback;if(o!==null){if(n.callback=null,n=r,typeof o!="function")throw Error(u(191,o));o.call(n)}}}var Po={},er=Lr(Po),To=Lr(Po),Lo=Lr(Po);function ln(e){if(e===Po)throw Error(u(174));return e}function Xl(e,t){switch(Fe(Lo,t),Fe(To,e),Fe(er,Po),e=t.nodeType,e){case 9:case 11:t=(t=t.documentElement)?t.namespaceURI:bt(null,"");break;default:e=e===8?t.parentNode:t,t=e.namespaceURI||null,e=e.tagName,t=bt(t,e)}Ae(er),Fe(er,t)}function Gn(){Ae(er),Ae(To),Ae(Lo)}function eu(e){ln(Lo.current);var t=ln(er.current),r=bt(t,e.type);t!==r&&(Fe(To,e),Fe(er,r))}function Zl(e){To.current===e&&(Ae(er),Ae(To))}var Qe=Lr(0);function ji(e){for(var t=e;t!==null;){if(t.tag===13){var r=t.memoizedState;if(r!==null&&(r=r.dehydrated,r===null||r.data==="$?"||r.data==="$!"))return t}else if(t.tag===19&&t.memoizedProps.revealOrder!==void 0){if((t.flags&128)!==0)return t}else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return null;t=t.return}t.sibling.return=t.return,t=t.sibling}return null}var Jl=[];function ea(){for(var e=0;e<Jl.length;e++)Jl[e]._workInProgressVersionPrimary=null;Jl.length=0}var Si=me.ReactCurrentDispatcher,ta=me.ReactCurrentBatchConfig,an=0,Ve=null,Je=null,tt=null,Ni=!1,Ro=!1,Mo=0,Gd=0;function at(){throw Error(u(321))}function ra(e,t){if(t===null)return!1;for(var r=0;r<t.length&&r<e.length;r++)if(!Ut(e[r],t[r]))return!1;return!0}function na(e,t,r,n,o,l){if(an=l,Ve=t,t.memoizedState=null,t.updateQueue=null,t.lanes=0,Si.current=e===null||e.memoizedState===null?Jd:ep,e=r(n,o),Ro){l=0;do{if(Ro=!1,Mo=0,25<=l)throw Error(u(301));l+=1,tt=Je=null,t.updateQueue=null,Si.current=tp,e=r(n,o)}while(Ro)}if(Si.current=_i,t=Je!==null&&Je.next!==null,an=0,tt=Je=Ve=null,Ni=!1,t)throw Error(u(300));return e}function oa(){var e=Mo!==0;return Mo=0,e}function tr(){var e={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return tt===null?Ve.memoizedState=tt=e:tt=tt.next=e,tt}function It(){if(Je===null){var e=Ve.alternate;e=e!==null?e.memoizedState:null}else e=Je.next;var t=tt===null?Ve.memoizedState:tt.next;if(t!==null)tt=t,Je=e;else{if(e===null)throw Error(u(310));Je=e,e={memoizedState:Je.memoizedState,baseState:Je.baseState,baseQueue:Je.baseQueue,queue:Je.queue,next:null},tt===null?Ve.memoizedState=tt=e:tt=tt.next=e}return tt}function Io(e,t){return typeof t=="function"?t(e):t}function ia(e){var t=It(),r=t.queue;if(r===null)throw Error(u(311));r.lastRenderedReducer=e;var n=Je,o=n.baseQueue,l=r.pending;if(l!==null){if(o!==null){var a=o.next;o.next=l.next,l.next=a}n.baseQueue=o=l,r.pending=null}if(o!==null){l=o.next,n=n.baseState;var d=a=null,p=null,y=l;do{var C=y.lane;if((an&C)===C)p!==null&&(p=p.next={lane:0,action:y.action,hasEagerState:y.hasEagerState,eagerState:y.eagerState,next:null}),n=y.hasEagerState?y.eagerState:e(n,y.action);else{var _={lane:C,action:y.action,hasEagerState:y.hasEagerState,eagerState:y.eagerState,next:null};p===null?(d=p=_,a=n):p=p.next=_,Ve.lanes|=C,sn|=C}y=y.next}while(y!==null&&y!==l);p===null?a=n:p.next=d,Ut(n,t.memoizedState)||(vt=!0),t.memoizedState=n,t.baseState=a,t.baseQueue=p,r.lastRenderedState=n}if(e=r.interleaved,e!==null){o=e;do l=o.lane,Ve.lanes|=l,sn|=l,o=o.next;while(o!==e)}else o===null&&(r.lanes=0);return[t.memoizedState,r.dispatch]}function la(e){var t=It(),r=t.queue;if(r===null)throw Error(u(311));r.lastRenderedReducer=e;var n=r.dispatch,o=r.pending,l=t.memoizedState;if(o!==null){r.pending=null;var a=o=o.next;do l=e(l,a.action),a=a.next;while(a!==o);Ut(l,t.memoizedState)||(vt=!0),t.memoizedState=l,t.baseQueue===null&&(t.baseState=l),r.lastRenderedState=l}return[l,n]}function tu(){}function ru(e,t){var r=Ve,n=It(),o=t(),l=!Ut(n.memoizedState,o);if(l&&(n.memoizedState=o,vt=!0),n=n.queue,aa(iu.bind(null,r,n,e),[e]),n.getSnapshot!==t||l||tt!==null&&tt.memoizedState.tag&1){if(r.flags|=2048,Oo(9,ou.bind(null,r,n,o,t),void 0,null),rt===null)throw Error(u(349));(an&30)!==0||nu(r,t,o)}return o}function nu(e,t,r){e.flags|=16384,e={getSnapshot:t,value:r},t=Ve.updateQueue,t===null?(t={lastEffect:null,stores:null},Ve.updateQueue=t,t.stores=[e]):(r=t.stores,r===null?t.stores=[e]:r.push(e))}function ou(e,t,r,n){t.value=r,t.getSnapshot=n,lu(t)&&au(e)}function iu(e,t,r){return r(function(){lu(t)&&au(e)})}function lu(e){var t=e.getSnapshot;e=e.value;try{var r=t();return!Ut(e,r)}catch{return!0}}function au(e){var t=dr(e,1);t!==null&&Yt(t,e,1,-1)}function su(e){var t=tr();return typeof e=="function"&&(e=e()),t.memoizedState=t.baseState=e,e={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:Io,lastRenderedState:e},t.queue=e,e=e.dispatch=Zd.bind(null,Ve,e),[t.memoizedState,e]}function Oo(e,t,r,n){return e={tag:e,create:t,destroy:r,deps:n,next:null},t=Ve.updateQueue,t===null?(t={lastEffect:null,stores:null},Ve.updateQueue=t,t.lastEffect=e.next=e):(r=t.lastEffect,r===null?t.lastEffect=e.next=e:(n=r.next,r.next=e,e.next=n,t.lastEffect=e)),e}function uu(){return It().memoizedState}function Ci(e,t,r,n){var o=tr();Ve.flags|=e,o.memoizedState=Oo(1|t,r,void 0,n===void 0?null:n)}function Ei(e,t,r,n){var o=It();n=n===void 0?null:n;var l=void 0;if(Je!==null){var a=Je.memoizedState;if(l=a.destroy,n!==null&&ra(n,a.deps)){o.memoizedState=Oo(t,r,l,n);return}}Ve.flags|=e,o.memoizedState=Oo(1|t,r,l,n)}function cu(e,t){return Ci(8390656,8,e,t)}function aa(e,t){return Ei(2048,8,e,t)}function du(e,t){return Ei(4,2,e,t)}function pu(e,t){return Ei(4,4,e,t)}function fu(e,t){if(typeof t=="function")return e=e(),t(e),function(){t(null)};if(t!=null)return e=e(),t.current=e,function(){t.current=null}}function mu(e,t,r){return r=r!=null?r.concat([e]):null,Ei(4,4,fu.bind(null,t,e),r)}function sa(){}function gu(e,t){var r=It();t=t===void 0?null:t;var n=r.memoizedState;return n!==null&&t!==null&&ra(t,n[1])?n[0]:(r.memoizedState=[e,t],e)}function hu(e,t){var r=It();t=t===void 0?null:t;var n=r.memoizedState;return n!==null&&t!==null&&ra(t,n[1])?n[0]:(e=e(),r.memoizedState=[e,t],e)}function vu(e,t,r){return(an&21)===0?(e.baseState&&(e.baseState=!1,vt=!0),e.memoizedState=r):(Ut(r,t)||(r=fo(),Ve.lanes|=r,sn|=r,e.baseState=!0),t)}function qd(e,t){var r=g;g=r!==0&&4>r?r:4,e(!0);var n=ta.transition;ta.transition={};try{e(!1),t()}finally{g=r,ta.transition=n}}function xu(){return It().memoizedState}function Xd(e,t,r){var n=Ar(e);if(r={lane:n,action:r,hasEagerState:!1,eagerState:null,next:null},yu(e))wu(t,r);else if(r=qs(e,t,r,n),r!==null){var o=dt();Yt(r,e,n,o),bu(r,t,n)}}function Zd(e,t,r){var n=Ar(e),o={lane:n,action:r,hasEagerState:!1,eagerState:null,next:null};if(yu(e))wu(t,o);else{var l=e.alternate;if(e.lanes===0&&(l===null||l.lanes===0)&&(l=t.lastRenderedReducer,l!==null))try{var a=t.lastRenderedState,d=l(a,r);if(o.hasEagerState=!0,o.eagerState=d,Ut(d,a)){var p=t.interleaved;p===null?(o.next=o,Gl(t)):(o.next=p.next,p.next=o),t.interleaved=o;return}}catch{}finally{}r=qs(e,t,o,n),r!==null&&(o=dt(),Yt(r,e,n,o),bu(r,t,n))}}function yu(e){var t=e.alternate;return e===Ve||t!==null&&t===Ve}function wu(e,t){Ro=Ni=!0;var r=e.pending;r===null?t.next=t:(t.next=r.next,r.next=t),e.pending=t}function bu(e,t,r){if((r&4194240)!==0){var n=t.lanes;n&=e.pendingLanes,r|=n,t.lanes=r,c(e,r)}}var _i={readContext:Mt,useCallback:at,useContext:at,useEffect:at,useImperativeHandle:at,useInsertionEffect:at,useLayoutEffect:at,useMemo:at,useReducer:at,useRef:at,useState:at,useDebugValue:at,useDeferredValue:at,useTransition:at,useMutableSource:at,useSyncExternalStore:at,useId:at,unstable_isNewReconciler:!1},Jd={readContext:Mt,useCallback:function(e,t){return tr().memoizedState=[e,t===void 0?null:t],e},useContext:Mt,useEffect:cu,useImperativeHandle:function(e,t,r){return r=r!=null?r.concat([e]):null,Ci(4194308,4,fu.bind(null,t,e),r)},useLayoutEffect:function(e,t){return Ci(4194308,4,e,t)},useInsertionEffect:function(e,t){return Ci(4,2,e,t)},useMemo:function(e,t){var r=tr();return t=t===void 0?null:t,e=e(),r.memoizedState=[e,t],e},useReducer:function(e,t,r){var n=tr();return t=r!==void 0?r(t):t,n.memoizedState=n.baseState=t,e={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:e,lastRenderedState:t},n.queue=e,e=e.dispatch=Xd.bind(null,Ve,e),[n.memoizedState,e]},useRef:function(e){var t=tr();return e={current:e},t.memoizedState=e},useState:su,useDebugValue:sa,useDeferredValue:function(e){return tr().memoizedState=e},useTransition:function(){var e=su(!1),t=e[0];return e=qd.bind(null,e[1]),tr().memoizedState=e,[t,e]},useMutableSource:function(){},useSyncExternalStore:function(e,t,r){var n=Ve,o=tr();if(We){if(r===void 0)throw Error(u(407));r=r()}else{if(r=t(),rt===null)throw Error(u(349));(an&30)!==0||nu(n,t,r)}o.memoizedState=r;var l={value:r,getSnapshot:t};return o.queue=l,cu(iu.bind(null,n,l,e),[e]),n.flags|=2048,Oo(9,ou.bind(null,n,l,r,t),void 0,null),r},useId:function(){var e=tr(),t=rt.identifierPrefix;if(We){var r=cr,n=ur;r=(n&~(1<<32-kt(n)-1)).toString(32)+r,t=":"+t+"R"+r,r=Mo++,0<r&&(t+="H"+r.toString(32)),t+=":"}else r=Gd++,t=":"+t+"r"+r.toString(32)+":";return e.memoizedState=t},unstable_isNewReconciler:!1},ep={readContext:Mt,useCallback:gu,useContext:Mt,useEffect:aa,useImperativeHandle:mu,useInsertionEffect:du,useLayoutEffect:pu,useMemo:hu,useReducer:ia,useRef:uu,useState:function(){return ia(Io)},useDebugValue:sa,useDeferredValue:function(e){var t=It();return vu(t,Je.memoizedState,e)},useTransition:function(){var e=ia(Io)[0],t=It().memoizedState;return[e,t]},useMutableSource:tu,useSyncExternalStore:ru,useId:xu,unstable_isNewReconciler:!1},tp={readContext:Mt,useCallback:gu,useContext:Mt,useEffect:aa,useImperativeHandle:mu,useInsertionEffect:du,useLayoutEffect:pu,useMemo:hu,useReducer:la,useRef:uu,useState:function(){return la(Io)},useDebugValue:sa,useDeferredValue:function(e){var t=It();return Je===null?t.memoizedState=e:vu(t,Je.memoizedState,e)},useTransition:function(){var e=la(Io)[0],t=It().memoizedState;return[e,t]},useMutableSource:tu,useSyncExternalStore:ru,useId:xu,unstable_isNewReconciler:!1};function Ht(e,t){if(e&&e.defaultProps){t=D({},t),e=e.defaultProps;for(var r in e)t[r]===void 0&&(t[r]=e[r]);return t}return t}function ua(e,t,r,n){t=e.memoizedState,r=r(n,t),r=r==null?t:D({},t,r),e.memoizedState=r,e.lanes===0&&(e.updateQueue.baseState=r)}var Pi={isMounted:function(e){return(e=e._reactInternals)?De(e)===e:!1},enqueueSetState:function(e,t,r){e=e._reactInternals;var n=dt(),o=Ar(e),l=pr(n,o);l.payload=t,r!=null&&(l.callback=r),t=Or(e,l,o),t!==null&&(Yt(t,e,o,n),zi(t,e,o))},enqueueReplaceState:function(e,t,r){e=e._reactInternals;var n=dt(),o=Ar(e),l=pr(n,o);l.tag=1,l.payload=t,r!=null&&(l.callback=r),t=Or(e,l,o),t!==null&&(Yt(t,e,o,n),zi(t,e,o))},enqueueForceUpdate:function(e,t){e=e._reactInternals;var r=dt(),n=Ar(e),o=pr(r,n);o.tag=2,t!=null&&(o.callback=t),t=Or(e,o,n),t!==null&&(Yt(t,e,n,r),zi(t,e,n))}};function zu(e,t,r,n,o,l,a){return e=e.stateNode,typeof e.shouldComponentUpdate=="function"?e.shouldComponentUpdate(n,l,a):t.prototype&&t.prototype.isPureReactComponent?!zo(r,n)||!zo(o,l):!0}function ku(e,t,r){var n=!1,o=Rr,l=t.contextType;return typeof l=="object"&&l!==null?l=Mt(l):(o=ht(t)?tn:lt.current,n=t.contextTypes,l=(n=n!=null)?Un(e,o):Rr),t=new t(r,l),e.memoizedState=t.state!==null&&t.state!==void 0?t.state:null,t.updater=Pi,e.stateNode=t,t._reactInternals=e,n&&(e=e.stateNode,e.__reactInternalMemoizedUnmaskedChildContext=o,e.__reactInternalMemoizedMaskedChildContext=l),t}function ju(e,t,r,n){e=t.state,typeof t.componentWillReceiveProps=="function"&&t.componentWillReceiveProps(r,n),typeof t.UNSAFE_componentWillReceiveProps=="function"&&t.UNSAFE_componentWillReceiveProps(r,n),t.state!==e&&Pi.enqueueReplaceState(t,t.state,null)}function ca(e,t,r,n){var o=e.stateNode;o.props=r,o.state=e.memoizedState,o.refs={},ql(e);var l=t.contextType;typeof l=="object"&&l!==null?o.context=Mt(l):(l=ht(t)?tn:lt.current,o.context=Un(e,l)),o.state=e.memoizedState,l=t.getDerivedStateFromProps,typeof l=="function"&&(ua(e,t,l,r),o.state=e.memoizedState),typeof t.getDerivedStateFromProps=="function"||typeof o.getSnapshotBeforeUpdate=="function"||typeof o.UNSAFE_componentWillMount!="function"&&typeof o.componentWillMount!="function"||(t=o.state,typeof o.componentWillMount=="function"&&o.componentWillMount(),typeof o.UNSAFE_componentWillMount=="function"&&o.UNSAFE_componentWillMount(),t!==o.state&&Pi.enqueueReplaceState(o,o.state,null),ki(e,r,o,n),o.state=e.memoizedState),typeof o.componentDidMount=="function"&&(e.flags|=4194308)}function qn(e,t){try{var r="",n=t;do r+=je(n),n=n.return;while(n);var o=r}catch(l){o=`
Error generating stack: `+l.message+`
`+l.stack}return{value:e,source:t,stack:o,digest:null}}function da(e,t,r){return{value:e,source:null,stack:r??null,digest:t??null}}function pa(e,t){try{console.error(t.value)}catch(r){setTimeout(function(){throw r})}}var rp=typeof WeakMap=="function"?WeakMap:Map;function Su(e,t,r){r=pr(-1,r),r.tag=3,r.payload={element:null};var n=t.value;return r.callback=function(){Fi||(Fi=!0,Ca=n),pa(e,t)},r}function Nu(e,t,r){r=pr(-1,r),r.tag=3;var n=e.type.getDerivedStateFromError;if(typeof n=="function"){var o=t.value;r.payload=function(){return n(o)},r.callback=function(){pa(e,t)}}var l=e.stateNode;return l!==null&&typeof l.componentDidCatch=="function"&&(r.callback=function(){pa(e,t),typeof n!="function"&&(Dr===null?Dr=new Set([this]):Dr.add(this));var a=t.stack;this.componentDidCatch(t.value,{componentStack:a!==null?a:""})}),r}function Cu(e,t,r){var n=e.pingCache;if(n===null){n=e.pingCache=new rp;var o=new Set;n.set(t,o)}else o=n.get(t),o===void 0&&(o=new Set,n.set(t,o));o.has(r)||(o.add(r),e=hp.bind(null,e,t,r),t.then(e,e))}function Eu(e){do{var t;if((t=e.tag===13)&&(t=e.memoizedState,t=t!==null?t.dehydrated!==null:!0),t)return e;e=e.return}while(e!==null);return null}function _u(e,t,r,n,o){return(e.mode&1)===0?(e===t?e.flags|=65536:(e.flags|=128,r.flags|=131072,r.flags&=-52805,r.tag===1&&(r.alternate===null?r.tag=17:(t=pr(-1,1),t.tag=2,Or(r,t,1))),r.lanes|=1),e):(e.flags|=65536,e.lanes=o,e)}var np=me.ReactCurrentOwner,vt=!1;function ct(e,t,r,n){t.child=e===null?Gs(t,null,r,n):Vn(t,e.child,r,n)}function Pu(e,t,r,n,o){r=r.render;var l=t.ref;return Kn(t,o),n=na(e,t,r,n,l,o),r=oa(),e!==null&&!vt?(t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~o,fr(e,t,o)):(We&&r&&Al(t),t.flags|=1,ct(e,t,n,o),t.child)}function Tu(e,t,r,n,o){if(e===null){var l=r.type;return typeof l=="function"&&!Ma(l)&&l.defaultProps===void 0&&r.compare===null&&r.defaultProps===void 0?(t.tag=15,t.type=l,Lu(e,t,l,n,o)):(e=Wi(r.type,null,n,t,t.mode,o),e.ref=t.ref,e.return=t,t.child=e)}if(l=e.child,(e.lanes&o)===0){var a=l.memoizedProps;if(r=r.compare,r=r!==null?r:zo,r(a,n)&&e.ref===t.ref)return fr(e,t,o)}return t.flags|=1,e=Ur(l,n),e.ref=t.ref,e.return=t,t.child=e}function Lu(e,t,r,n,o){if(e!==null){var l=e.memoizedProps;if(zo(l,n)&&e.ref===t.ref)if(vt=!1,t.pendingProps=n=l,(e.lanes&o)!==0)(e.flags&131072)!==0&&(vt=!0);else return t.lanes=e.lanes,fr(e,t,o)}return fa(e,t,r,n,o)}function Ru(e,t,r){var n=t.pendingProps,o=n.children,l=e!==null?e.memoizedState:null;if(n.mode==="hidden")if((t.mode&1)===0)t.memoizedState={baseLanes:0,cachePool:null,transitions:null},Fe(Zn,Et),Et|=r;else{if((r&1073741824)===0)return e=l!==null?l.baseLanes|r:r,t.lanes=t.childLanes=1073741824,t.memoizedState={baseLanes:e,cachePool:null,transitions:null},t.updateQueue=null,Fe(Zn,Et),Et|=e,null;t.memoizedState={baseLanes:0,cachePool:null,transitions:null},n=l!==null?l.baseLanes:r,Fe(Zn,Et),Et|=n}else l!==null?(n=l.baseLanes|r,t.memoizedState=null):n=r,Fe(Zn,Et),Et|=n;return ct(e,t,o,r),t.child}function Mu(e,t){var r=t.ref;(e===null&&r!==null||e!==null&&e.ref!==r)&&(t.flags|=512,t.flags|=2097152)}function fa(e,t,r,n,o){var l=ht(r)?tn:lt.current;return l=Un(t,l),Kn(t,o),r=na(e,t,r,n,l,o),n=oa(),e!==null&&!vt?(t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~o,fr(e,t,o)):(We&&n&&Al(t),t.flags|=1,ct(e,t,r,o),t.child)}function Iu(e,t,r,n,o){if(ht(r)){var l=!0;mi(t)}else l=!1;if(Kn(t,o),t.stateNode===null)Li(e,t),ku(t,r,n),ca(t,r,n,o),n=!0;else if(e===null){var a=t.stateNode,d=t.memoizedProps;a.props=d;var p=a.context,y=r.contextType;typeof y=="object"&&y!==null?y=Mt(y):(y=ht(r)?tn:lt.current,y=Un(t,y));var C=r.getDerivedStateFromProps,_=typeof C=="function"||typeof a.getSnapshotBeforeUpdate=="function";_||typeof a.UNSAFE_componentWillReceiveProps!="function"&&typeof a.componentWillReceiveProps!="function"||(d!==n||p!==y)&&ju(t,a,n,y),Ir=!1;var N=t.memoizedState;a.state=N,ki(t,n,a,o),p=t.memoizedState,d!==n||N!==p||gt.current||Ir?(typeof C=="function"&&(ua(t,r,C,n),p=t.memoizedState),(d=Ir||zu(t,r,d,n,N,p,y))?(_||typeof a.UNSAFE_componentWillMount!="function"&&typeof a.componentWillMount!="function"||(typeof a.componentWillMount=="function"&&a.componentWillMount(),typeof a.UNSAFE_componentWillMount=="function"&&a.UNSAFE_componentWillMount()),typeof a.componentDidMount=="function"&&(t.flags|=4194308)):(typeof a.componentDidMount=="function"&&(t.flags|=4194308),t.memoizedProps=n,t.memoizedState=p),a.props=n,a.state=p,a.context=y,n=d):(typeof a.componentDidMount=="function"&&(t.flags|=4194308),n=!1)}else{a=t.stateNode,Xs(e,t),d=t.memoizedProps,y=t.type===t.elementType?d:Ht(t.type,d),a.props=y,_=t.pendingProps,N=a.context,p=r.contextType,typeof p=="object"&&p!==null?p=Mt(p):(p=ht(r)?tn:lt.current,p=Un(t,p));var U=r.getDerivedStateFromProps;(C=typeof U=="function"||typeof a.getSnapshotBeforeUpdate=="function")||typeof a.UNSAFE_componentWillReceiveProps!="function"&&typeof a.componentWillReceiveProps!="function"||(d!==_||N!==p)&&ju(t,a,n,p),Ir=!1,N=t.memoizedState,a.state=N,ki(t,n,a,o);var K=t.memoizedState;d!==_||N!==K||gt.current||Ir?(typeof U=="function"&&(ua(t,r,U,n),K=t.memoizedState),(y=Ir||zu(t,r,y,n,N,K,p)||!1)?(C||typeof a.UNSAFE_componentWillUpdate!="function"&&typeof a.componentWillUpdate!="function"||(typeof a.componentWillUpdate=="function"&&a.componentWillUpdate(n,K,p),typeof a.UNSAFE_componentWillUpdate=="function"&&a.UNSAFE_componentWillUpdate(n,K,p)),typeof a.componentDidUpdate=="function"&&(t.flags|=4),typeof a.getSnapshotBeforeUpdate=="function"&&(t.flags|=1024)):(typeof a.componentDidUpdate!="function"||d===e.memoizedProps&&N===e.memoizedState||(t.flags|=4),typeof a.getSnapshotBeforeUpdate!="function"||d===e.memoizedProps&&N===e.memoizedState||(t.flags|=1024),t.memoizedProps=n,t.memoizedState=K),a.props=n,a.state=K,a.context=p,n=y):(typeof a.componentDidUpdate!="function"||d===e.memoizedProps&&N===e.memoizedState||(t.flags|=4),typeof a.getSnapshotBeforeUpdate!="function"||d===e.memoizedProps&&N===e.memoizedState||(t.flags|=1024),n=!1)}return ma(e,t,r,n,l,o)}function ma(e,t,r,n,o,l){Mu(e,t);var a=(t.flags&128)!==0;if(!n&&!a)return o&&As(t,r,!1),fr(e,t,l);n=t.stateNode,np.current=t;var d=a&&typeof r.getDerivedStateFromError!="function"?null:n.render();return t.flags|=1,e!==null&&a?(t.child=Vn(t,e.child,null,l),t.child=Vn(t,null,d,l)):ct(e,t,d,l),t.memoizedState=n.state,o&&As(t,r,!0),t.child}function Ou(e){var t=e.stateNode;t.pendingContext?Ds(e,t.pendingContext,t.pendingContext!==t.context):t.context&&Ds(e,t.context,!1),Xl(e,t.containerInfo)}function Fu(e,t,r,n,o){return Qn(),Hl(o),t.flags|=256,ct(e,t,r,n),t.child}var ga={dehydrated:null,treeContext:null,retryLane:0};function ha(e){return{baseLanes:e,cachePool:null,transitions:null}}function Du(e,t,r){var n=t.pendingProps,o=Qe.current,l=!1,a=(t.flags&128)!==0,d;if((d=a)||(d=e!==null&&e.memoizedState===null?!1:(o&2)!==0),d?(l=!0,t.flags&=-129):(e===null||e.memoizedState!==null)&&(o|=1),Fe(Qe,o&1),e===null)return Wl(t),e=t.memoizedState,e!==null&&(e=e.dehydrated,e!==null)?((t.mode&1)===0?t.lanes=1:e.data==="$!"?t.lanes=8:t.lanes=1073741824,null):(a=n.children,e=n.fallback,l?(n=t.mode,l=t.child,a={mode:"hidden",children:a},(n&1)===0&&l!==null?(l.childLanes=0,l.pendingProps=a):l=Hi(a,n,0,null),e=pn(e,n,r,null),l.return=t,e.return=t,l.sibling=e,t.child=l,t.child.memoizedState=ha(r),t.memoizedState=ga,e):va(t,a));if(o=e.memoizedState,o!==null&&(d=o.dehydrated,d!==null))return op(e,t,a,n,d,o,r);if(l){l=n.fallback,a=t.mode,o=e.child,d=o.sibling;var p={mode:"hidden",children:n.children};return(a&1)===0&&t.child!==o?(n=t.child,n.childLanes=0,n.pendingProps=p,t.deletions=null):(n=Ur(o,p),n.subtreeFlags=o.subtreeFlags&14680064),d!==null?l=Ur(d,l):(l=pn(l,a,r,null),l.flags|=2),l.return=t,n.return=t,n.sibling=l,t.child=n,n=l,l=t.child,a=e.child.memoizedState,a=a===null?ha(r):{baseLanes:a.baseLanes|r,cachePool:null,transitions:a.transitions},l.memoizedState=a,l.childLanes=e.childLanes&~r,t.memoizedState=ga,n}return l=e.child,e=l.sibling,n=Ur(l,{mode:"visible",children:n.children}),(t.mode&1)===0&&(n.lanes=r),n.return=t,n.sibling=null,e!==null&&(r=t.deletions,r===null?(t.deletions=[e],t.flags|=16):r.push(e)),t.child=n,t.memoizedState=null,n}function va(e,t){return t=Hi({mode:"visible",children:t},e.mode,0,null),t.return=e,e.child=t}function Ti(e,t,r,n){return n!==null&&Hl(n),Vn(t,e.child,null,r),e=va(t,t.pendingProps.children),e.flags|=2,t.memoizedState=null,e}function op(e,t,r,n,o,l,a){if(r)return t.flags&256?(t.flags&=-257,n=da(Error(u(422))),Ti(e,t,a,n)):t.memoizedState!==null?(t.child=e.child,t.flags|=128,null):(l=n.fallback,o=t.mode,n=Hi({mode:"visible",children:n.children},o,0,null),l=pn(l,o,a,null),l.flags|=2,n.return=t,l.return=t,n.sibling=l,t.child=n,(t.mode&1)!==0&&Vn(t,e.child,null,a),t.child.memoizedState=ha(a),t.memoizedState=ga,l);if((t.mode&1)===0)return Ti(e,t,a,null);if(o.data==="$!"){if(n=o.nextSibling&&o.nextSibling.dataset,n)var d=n.dgst;return n=d,l=Error(u(419)),n=da(l,n,void 0),Ti(e,t,a,n)}if(d=(a&e.childLanes)!==0,vt||d){if(n=rt,n!==null){switch(a&-a){case 4:o=2;break;case 16:o=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:o=32;break;case 536870912:o=268435456;break;default:o=0}o=(o&(n.suspendedLanes|a))!==0?0:o,o!==0&&o!==l.retryLane&&(l.retryLane=o,dr(e,o),Yt(n,e,o,-1))}return Ra(),n=da(Error(u(421))),Ti(e,t,a,n)}return o.data==="$?"?(t.flags|=128,t.child=e.child,t=vp.bind(null,e),o._reactRetry=t,null):(e=l.treeContext,Ct=Tr(o.nextSibling),Nt=t,We=!0,Wt=null,e!==null&&(Lt[Rt++]=ur,Lt[Rt++]=cr,Lt[Rt++]=rn,ur=e.id,cr=e.overflow,rn=t),t=va(t,n.children),t.flags|=4096,t)}function $u(e,t,r){e.lanes|=t;var n=e.alternate;n!==null&&(n.lanes|=t),Kl(e.return,t,r)}function xa(e,t,r,n,o){var l=e.memoizedState;l===null?e.memoizedState={isBackwards:t,rendering:null,renderingStartTime:0,last:n,tail:r,tailMode:o}:(l.isBackwards=t,l.rendering=null,l.renderingStartTime=0,l.last=n,l.tail=r,l.tailMode=o)}function Au(e,t,r){var n=t.pendingProps,o=n.revealOrder,l=n.tail;if(ct(e,t,n.children,r),n=Qe.current,(n&2)!==0)n=n&1|2,t.flags|=128;else{if(e!==null&&(e.flags&128)!==0)e:for(e=t.child;e!==null;){if(e.tag===13)e.memoizedState!==null&&$u(e,r,t);else if(e.tag===19)$u(e,r,t);else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break e;for(;e.sibling===null;){if(e.return===null||e.return===t)break e;e=e.return}e.sibling.return=e.return,e=e.sibling}n&=1}if(Fe(Qe,n),(t.mode&1)===0)t.memoizedState=null;else switch(o){case"forwards":for(r=t.child,o=null;r!==null;)e=r.alternate,e!==null&&ji(e)===null&&(o=r),r=r.sibling;r=o,r===null?(o=t.child,t.child=null):(o=r.sibling,r.sibling=null),xa(t,!1,o,r,l);break;case"backwards":for(r=null,o=t.child,t.child=null;o!==null;){if(e=o.alternate,e!==null&&ji(e)===null){t.child=o;break}e=o.sibling,o.sibling=r,r=o,o=e}xa(t,!0,r,null,l);break;case"together":xa(t,!1,null,null,void 0);break;default:t.memoizedState=null}return t.child}function Li(e,t){(t.mode&1)===0&&e!==null&&(e.alternate=null,t.alternate=null,t.flags|=2)}function fr(e,t,r){if(e!==null&&(t.dependencies=e.dependencies),sn|=t.lanes,(r&t.childLanes)===0)return null;if(e!==null&&t.child!==e.child)throw Error(u(153));if(t.child!==null){for(e=t.child,r=Ur(e,e.pendingProps),t.child=r,r.return=t;e.sibling!==null;)e=e.sibling,r=r.sibling=Ur(e,e.pendingProps),r.return=t;r.sibling=null}return t.child}function ip(e,t,r){switch(t.tag){case 3:Ou(t),Qn();break;case 5:eu(t);break;case 1:ht(t.type)&&mi(t);break;case 4:Xl(t,t.stateNode.containerInfo);break;case 10:var n=t.type._context,o=t.memoizedProps.value;Fe(wi,n._currentValue),n._currentValue=o;break;case 13:if(n=t.memoizedState,n!==null)return n.dehydrated!==null?(Fe(Qe,Qe.current&1),t.flags|=128,null):(r&t.child.childLanes)!==0?Du(e,t,r):(Fe(Qe,Qe.current&1),e=fr(e,t,r),e!==null?e.sibling:null);Fe(Qe,Qe.current&1);break;case 19:if(n=(r&t.childLanes)!==0,(e.flags&128)!==0){if(n)return Au(e,t,r);t.flags|=128}if(o=t.memoizedState,o!==null&&(o.rendering=null,o.tail=null,o.lastEffect=null),Fe(Qe,Qe.current),n)break;return null;case 22:case 23:return t.lanes=0,Ru(e,t,r)}return fr(e,t,r)}var Bu,ya,Uu,Wu;Bu=function(e,t){for(var r=t.child;r!==null;){if(r.tag===5||r.tag===6)e.appendChild(r.stateNode);else if(r.tag!==4&&r.child!==null){r.child.return=r,r=r.child;continue}if(r===t)break;for(;r.sibling===null;){if(r.return===null||r.return===t)return;r=r.return}r.sibling.return=r.return,r=r.sibling}},ya=function(){},Uu=function(e,t,r,n){var o=e.memoizedProps;if(o!==n){e=t.stateNode,ln(er.current);var l=null;switch(r){case"input":o=nr(e,o),n=nr(e,n),l=[];break;case"select":o=D({},o,{value:void 0}),n=D({},n,{value:void 0}),l=[];break;case"textarea":o=io(e,o),n=io(e,n),l=[];break;default:typeof o.onClick!="function"&&typeof n.onClick=="function"&&(e.onclick=di)}qt(r,n);var a;r=null;for(y in o)if(!n.hasOwnProperty(y)&&o.hasOwnProperty(y)&&o[y]!=null)if(y==="style"){var d=o[y];for(a in d)d.hasOwnProperty(a)&&(r||(r={}),r[a]="")}else y!=="dangerouslySetInnerHTML"&&y!=="children"&&y!=="suppressContentEditableWarning"&&y!=="suppressHydrationWarning"&&y!=="autoFocus"&&(w.hasOwnProperty(y)?l||(l=[]):(l=l||[]).push(y,null));for(y in n){var p=n[y];if(d=o!=null?o[y]:void 0,n.hasOwnProperty(y)&&p!==d&&(p!=null||d!=null))if(y==="style")if(d){for(a in d)!d.hasOwnProperty(a)||p&&p.hasOwnProperty(a)||(r||(r={}),r[a]="");for(a in p)p.hasOwnProperty(a)&&d[a]!==p[a]&&(r||(r={}),r[a]=p[a])}else r||(l||(l=[]),l.push(y,r)),r=p;else y==="dangerouslySetInnerHTML"?(p=p?p.__html:void 0,d=d?d.__html:void 0,p!=null&&d!==p&&(l=l||[]).push(y,p)):y==="children"?typeof p!="string"&&typeof p!="number"||(l=l||[]).push(y,""+p):y!=="suppressContentEditableWarning"&&y!=="suppressHydrationWarning"&&(w.hasOwnProperty(y)?(p!=null&&y==="onScroll"&&$e("scroll",e),l||d===p||(l=[])):(l=l||[]).push(y,p))}r&&(l=l||[]).push("style",r);var y=l;(t.updateQueue=y)&&(t.flags|=4)}},Wu=function(e,t,r,n){r!==n&&(t.flags|=4)};function Fo(e,t){if(!We)switch(e.tailMode){case"hidden":t=e.tail;for(var r=null;t!==null;)t.alternate!==null&&(r=t),t=t.sibling;r===null?e.tail=null:r.sibling=null;break;case"collapsed":r=e.tail;for(var n=null;r!==null;)r.alternate!==null&&(n=r),r=r.sibling;n===null?t||e.tail===null?e.tail=null:e.tail.sibling=null:n.sibling=null}}function st(e){var t=e.alternate!==null&&e.alternate.child===e.child,r=0,n=0;if(t)for(var o=e.child;o!==null;)r|=o.lanes|o.childLanes,n|=o.subtreeFlags&14680064,n|=o.flags&14680064,o.return=e,o=o.sibling;else for(o=e.child;o!==null;)r|=o.lanes|o.childLanes,n|=o.subtreeFlags,n|=o.flags,o.return=e,o=o.sibling;return e.subtreeFlags|=n,e.childLanes=r,t}function lp(e,t,r){var n=t.pendingProps;switch(Bl(t),t.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return st(t),null;case 1:return ht(t.type)&&fi(),st(t),null;case 3:return n=t.stateNode,Gn(),Ae(gt),Ae(lt),ea(),n.pendingContext&&(n.context=n.pendingContext,n.pendingContext=null),(e===null||e.child===null)&&(xi(t)?t.flags|=4:e===null||e.memoizedState.isDehydrated&&(t.flags&256)===0||(t.flags|=1024,Wt!==null&&(Pa(Wt),Wt=null))),ya(e,t),st(t),null;case 5:Zl(t);var o=ln(Lo.current);if(r=t.type,e!==null&&t.stateNode!=null)Uu(e,t,r,n,o),e.ref!==t.ref&&(t.flags|=512,t.flags|=2097152);else{if(!n){if(t.stateNode===null)throw Error(u(166));return st(t),null}if(e=ln(er.current),xi(t)){n=t.stateNode,r=t.type;var l=t.memoizedProps;switch(n[Jt]=t,n[Co]=l,e=(t.mode&1)!==0,r){case"dialog":$e("cancel",n),$e("close",n);break;case"iframe":case"object":case"embed":$e("load",n);break;case"video":case"audio":for(o=0;o<jo.length;o++)$e(jo[o],n);break;case"source":$e("error",n);break;case"img":case"image":case"link":$e("error",n),$e("load",n);break;case"details":$e("toggle",n);break;case"input":gr(n,l),$e("invalid",n);break;case"select":n._wrapperState={wasMultiple:!!l.multiple},$e("invalid",n);break;case"textarea":$t(n,l),$e("invalid",n)}qt(r,l),o=null;for(var a in l)if(l.hasOwnProperty(a)){var d=l[a];a==="children"?typeof d=="string"?n.textContent!==d&&(l.suppressHydrationWarning!==!0&&ci(n.textContent,d,e),o=["children",d]):typeof d=="number"&&n.textContent!==""+d&&(l.suppressHydrationWarning!==!0&&ci(n.textContent,d,e),o=["children",""+d]):w.hasOwnProperty(a)&&d!=null&&a==="onScroll"&&$e("scroll",n)}switch(r){case"input":Dt(n),oo(n,l,!0);break;case"textarea":Dt(n),xr(n);break;case"select":case"option":break;default:typeof l.onClick=="function"&&(n.onclick=di)}n=o,t.updateQueue=n,n!==null&&(t.flags|=4)}else{a=o.nodeType===9?o:o.ownerDocument,e==="http://www.w3.org/1999/xhtml"&&(e=gn(r)),e==="http://www.w3.org/1999/xhtml"?r==="script"?(e=a.createElement("div"),e.innerHTML="<script><\/script>",e=e.removeChild(e.firstChild)):typeof n.is=="string"?e=a.createElement(r,{is:n.is}):(e=a.createElement(r),r==="select"&&(a=e,n.multiple?a.multiple=!0:n.size&&(a.size=n.size))):e=a.createElementNS(e,r),e[Jt]=t,e[Co]=n,Bu(e,t,!1,!1),t.stateNode=e;e:{switch(a=yn(r,n),r){case"dialog":$e("cancel",e),$e("close",e),o=n;break;case"iframe":case"object":case"embed":$e("load",e),o=n;break;case"video":case"audio":for(o=0;o<jo.length;o++)$e(jo[o],e);o=n;break;case"source":$e("error",e),o=n;break;case"img":case"image":case"link":$e("error",e),$e("load",e),o=n;break;case"details":$e("toggle",e),o=n;break;case"input":gr(e,n),o=nr(e,n),$e("invalid",e);break;case"option":o=n;break;case"select":e._wrapperState={wasMultiple:!!n.multiple},o=D({},n,{value:void 0}),$e("invalid",e);break;case"textarea":$t(e,n),o=io(e,n),$e("invalid",e);break;default:o=n}qt(r,o),d=o;for(l in d)if(d.hasOwnProperty(l)){var p=d[l];l==="style"?xn(e,p):l==="dangerouslySetInnerHTML"?(p=p?p.__html:void 0,p!=null&&hn(e,p)):l==="children"?typeof p=="string"?(r!=="textarea"||p!=="")&&yr(e,p):typeof p=="number"&&yr(e,""+p):l!=="suppressContentEditableWarning"&&l!=="suppressHydrationWarning"&&l!=="autoFocus"&&(w.hasOwnProperty(l)?p!=null&&l==="onScroll"&&$e("scroll",e):p!=null&&Ne(e,l,p,a))}switch(r){case"input":Dt(e),oo(e,n,!1);break;case"textarea":Dt(e),xr(e);break;case"option":n.value!=null&&e.setAttribute("value",""+Te(n.value));break;case"select":e.multiple=!!n.multiple,l=n.value,l!=null?vr(e,!!n.multiple,l,!1):n.defaultValue!=null&&vr(e,!!n.multiple,n.defaultValue,!0);break;default:typeof o.onClick=="function"&&(e.onclick=di)}switch(r){case"button":case"input":case"select":case"textarea":n=!!n.autoFocus;break e;case"img":n=!0;break e;default:n=!1}}n&&(t.flags|=4)}t.ref!==null&&(t.flags|=512,t.flags|=2097152)}return st(t),null;case 6:if(e&&t.stateNode!=null)Wu(e,t,e.memoizedProps,n);else{if(typeof n!="string"&&t.stateNode===null)throw Error(u(166));if(r=ln(Lo.current),ln(er.current),xi(t)){if(n=t.stateNode,r=t.memoizedProps,n[Jt]=t,(l=n.nodeValue!==r)&&(e=Nt,e!==null))switch(e.tag){case 3:ci(n.nodeValue,r,(e.mode&1)!==0);break;case 5:e.memoizedProps.suppressHydrationWarning!==!0&&ci(n.nodeValue,r,(e.mode&1)!==0)}l&&(t.flags|=4)}else n=(r.nodeType===9?r:r.ownerDocument).createTextNode(n),n[Jt]=t,t.stateNode=n}return st(t),null;case 13:if(Ae(Qe),n=t.memoizedState,e===null||e.memoizedState!==null&&e.memoizedState.dehydrated!==null){if(We&&Ct!==null&&(t.mode&1)!==0&&(t.flags&128)===0)Vs(),Qn(),t.flags|=98560,l=!1;else if(l=xi(t),n!==null&&n.dehydrated!==null){if(e===null){if(!l)throw Error(u(318));if(l=t.memoizedState,l=l!==null?l.dehydrated:null,!l)throw Error(u(317));l[Jt]=t}else Qn(),(t.flags&128)===0&&(t.memoizedState=null),t.flags|=4;st(t),l=!1}else Wt!==null&&(Pa(Wt),Wt=null),l=!0;if(!l)return t.flags&65536?t:null}return(t.flags&128)!==0?(t.lanes=r,t):(n=n!==null,n!==(e!==null&&e.memoizedState!==null)&&n&&(t.child.flags|=8192,(t.mode&1)!==0&&(e===null||(Qe.current&1)!==0?et===0&&(et=3):Ra())),t.updateQueue!==null&&(t.flags|=4),st(t),null);case 4:return Gn(),ya(e,t),e===null&&So(t.stateNode.containerInfo),st(t),null;case 10:return Yl(t.type._context),st(t),null;case 17:return ht(t.type)&&fi(),st(t),null;case 19:if(Ae(Qe),l=t.memoizedState,l===null)return st(t),null;if(n=(t.flags&128)!==0,a=l.rendering,a===null)if(n)Fo(l,!1);else{if(et!==0||e!==null&&(e.flags&128)!==0)for(e=t.child;e!==null;){if(a=ji(e),a!==null){for(t.flags|=128,Fo(l,!1),n=a.updateQueue,n!==null&&(t.updateQueue=n,t.flags|=4),t.subtreeFlags=0,n=r,r=t.child;r!==null;)l=r,e=n,l.flags&=14680066,a=l.alternate,a===null?(l.childLanes=0,l.lanes=e,l.child=null,l.subtreeFlags=0,l.memoizedProps=null,l.memoizedState=null,l.updateQueue=null,l.dependencies=null,l.stateNode=null):(l.childLanes=a.childLanes,l.lanes=a.lanes,l.child=a.child,l.subtreeFlags=0,l.deletions=null,l.memoizedProps=a.memoizedProps,l.memoizedState=a.memoizedState,l.updateQueue=a.updateQueue,l.type=a.type,e=a.dependencies,l.dependencies=e===null?null:{lanes:e.lanes,firstContext:e.firstContext}),r=r.sibling;return Fe(Qe,Qe.current&1|2),t.child}e=e.sibling}l.tail!==null&&Ue()>Jn&&(t.flags|=128,n=!0,Fo(l,!1),t.lanes=4194304)}else{if(!n)if(e=ji(a),e!==null){if(t.flags|=128,n=!0,r=e.updateQueue,r!==null&&(t.updateQueue=r,t.flags|=4),Fo(l,!0),l.tail===null&&l.tailMode==="hidden"&&!a.alternate&&!We)return st(t),null}else 2*Ue()-l.renderingStartTime>Jn&&r!==1073741824&&(t.flags|=128,n=!0,Fo(l,!1),t.lanes=4194304);l.isBackwards?(a.sibling=t.child,t.child=a):(r=l.last,r!==null?r.sibling=a:t.child=a,l.last=a)}return l.tail!==null?(t=l.tail,l.rendering=t,l.tail=t.sibling,l.renderingStartTime=Ue(),t.sibling=null,r=Qe.current,Fe(Qe,n?r&1|2:r&1),t):(st(t),null);case 22:case 23:return La(),n=t.memoizedState!==null,e!==null&&e.memoizedState!==null!==n&&(t.flags|=8192),n&&(t.mode&1)!==0?(Et&1073741824)!==0&&(st(t),t.subtreeFlags&6&&(t.flags|=8192)):st(t),null;case 24:return null;case 25:return null}throw Error(u(156,t.tag))}function ap(e,t){switch(Bl(t),t.tag){case 1:return ht(t.type)&&fi(),e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 3:return Gn(),Ae(gt),Ae(lt),ea(),e=t.flags,(e&65536)!==0&&(e&128)===0?(t.flags=e&-65537|128,t):null;case 5:return Zl(t),null;case 13:if(Ae(Qe),e=t.memoizedState,e!==null&&e.dehydrated!==null){if(t.alternate===null)throw Error(u(340));Qn()}return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 19:return Ae(Qe),null;case 4:return Gn(),null;case 10:return Yl(t.type._context),null;case 22:case 23:return La(),null;case 24:return null;default:return null}}var Ri=!1,ut=!1,sp=typeof WeakSet=="function"?WeakSet:Set,V=null;function Xn(e,t){var r=e.ref;if(r!==null)if(typeof r=="function")try{r(null)}catch(n){Ke(e,t,n)}else r.current=null}function wa(e,t,r){try{r()}catch(n){Ke(e,t,n)}}var Hu=!1;function up(e,t){if(Ll=Jo,e=zs(),jl(e)){if("selectionStart"in e)var r={start:e.selectionStart,end:e.selectionEnd};else e:{r=(r=e.ownerDocument)&&r.defaultView||window;var n=r.getSelection&&r.getSelection();if(n&&n.rangeCount!==0){r=n.anchorNode;var o=n.anchorOffset,l=n.focusNode;n=n.focusOffset;try{r.nodeType,l.nodeType}catch{r=null;break e}var a=0,d=-1,p=-1,y=0,C=0,_=e,N=null;t:for(;;){for(var U;_!==r||o!==0&&_.nodeType!==3||(d=a+o),_!==l||n!==0&&_.nodeType!==3||(p=a+n),_.nodeType===3&&(a+=_.nodeValue.length),(U=_.firstChild)!==null;)N=_,_=U;for(;;){if(_===e)break t;if(N===r&&++y===o&&(d=a),N===l&&++C===n&&(p=a),(U=_.nextSibling)!==null)break;_=N,N=_.parentNode}_=U}r=d===-1||p===-1?null:{start:d,end:p}}else r=null}r=r||{start:0,end:0}}else r=null;for(Rl={focusedElem:e,selectionRange:r},Jo=!1,V=t;V!==null;)if(t=V,e=t.child,(t.subtreeFlags&1028)!==0&&e!==null)e.return=t,V=e;else for(;V!==null;){t=V;try{var K=t.alternate;if((t.flags&1024)!==0)switch(t.tag){case 0:case 11:case 15:break;case 1:if(K!==null){var G=K.memoizedProps,Ge=K.memoizedState,v=t.stateNode,m=v.getSnapshotBeforeUpdate(t.elementType===t.type?G:Ht(t.type,G),Ge);v.__reactInternalSnapshotBeforeUpdate=m}break;case 3:var x=t.stateNode.containerInfo;x.nodeType===1?x.textContent="":x.nodeType===9&&x.documentElement&&x.removeChild(x.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(u(163))}}catch(R){Ke(t,t.return,R)}if(e=t.sibling,e!==null){e.return=t.return,V=e;break}V=t.return}return K=Hu,Hu=!1,K}function Do(e,t,r){var n=t.updateQueue;if(n=n!==null?n.lastEffect:null,n!==null){var o=n=n.next;do{if((o.tag&e)===e){var l=o.destroy;o.destroy=void 0,l!==void 0&&wa(t,r,l)}o=o.next}while(o!==n)}}function Mi(e,t){if(t=t.updateQueue,t=t!==null?t.lastEffect:null,t!==null){var r=t=t.next;do{if((r.tag&e)===e){var n=r.create;r.destroy=n()}r=r.next}while(r!==t)}}function ba(e){var t=e.ref;if(t!==null){var r=e.stateNode;switch(e.tag){case 5:e=r;break;default:e=r}typeof t=="function"?t(e):t.current=e}}function Qu(e){var t=e.alternate;t!==null&&(e.alternate=null,Qu(t)),e.child=null,e.deletions=null,e.sibling=null,e.tag===5&&(t=e.stateNode,t!==null&&(delete t[Jt],delete t[Co],delete t[Fl],delete t[Qd],delete t[Vd])),e.stateNode=null,e.return=null,e.dependencies=null,e.memoizedProps=null,e.memoizedState=null,e.pendingProps=null,e.stateNode=null,e.updateQueue=null}function Vu(e){return e.tag===5||e.tag===3||e.tag===4}function Yu(e){e:for(;;){for(;e.sibling===null;){if(e.return===null||Vu(e.return))return null;e=e.return}for(e.sibling.return=e.return,e=e.sibling;e.tag!==5&&e.tag!==6&&e.tag!==18;){if(e.flags&2||e.child===null||e.tag===4)continue e;e.child.return=e,e=e.child}if(!(e.flags&2))return e.stateNode}}function za(e,t,r){var n=e.tag;if(n===5||n===6)e=e.stateNode,t?r.nodeType===8?r.parentNode.insertBefore(e,t):r.insertBefore(e,t):(r.nodeType===8?(t=r.parentNode,t.insertBefore(e,r)):(t=r,t.appendChild(e)),r=r._reactRootContainer,r!=null||t.onclick!==null||(t.onclick=di));else if(n!==4&&(e=e.child,e!==null))for(za(e,t,r),e=e.sibling;e!==null;)za(e,t,r),e=e.sibling}function ka(e,t,r){var n=e.tag;if(n===5||n===6)e=e.stateNode,t?r.insertBefore(e,t):r.appendChild(e);else if(n!==4&&(e=e.child,e!==null))for(ka(e,t,r),e=e.sibling;e!==null;)ka(e,t,r),e=e.sibling}var ot=null,Qt=!1;function Fr(e,t,r){for(r=r.child;r!==null;)Ku(e,t,r),r=r.sibling}function Ku(e,t,r){if(zt&&typeof zt.onCommitFiberUnmount=="function")try{zt.onCommitFiberUnmount(Sr,r)}catch{}switch(r.tag){case 5:ut||Xn(r,t);case 6:var n=ot,o=Qt;ot=null,Fr(e,t,r),ot=n,Qt=o,ot!==null&&(Qt?(e=ot,r=r.stateNode,e.nodeType===8?e.parentNode.removeChild(r):e.removeChild(r)):ot.removeChild(r.stateNode));break;case 18:ot!==null&&(Qt?(e=ot,r=r.stateNode,e.nodeType===8?Ol(e.parentNode,r):e.nodeType===1&&Ol(e,r),ho(e)):Ol(ot,r.stateNode));break;case 4:n=ot,o=Qt,ot=r.stateNode.containerInfo,Qt=!0,Fr(e,t,r),ot=n,Qt=o;break;case 0:case 11:case 14:case 15:if(!ut&&(n=r.updateQueue,n!==null&&(n=n.lastEffect,n!==null))){o=n=n.next;do{var l=o,a=l.destroy;l=l.tag,a!==void 0&&((l&2)!==0||(l&4)!==0)&&wa(r,t,a),o=o.next}while(o!==n)}Fr(e,t,r);break;case 1:if(!ut&&(Xn(r,t),n=r.stateNode,typeof n.componentWillUnmount=="function"))try{n.props=r.memoizedProps,n.state=r.memoizedState,n.componentWillUnmount()}catch(d){Ke(r,t,d)}Fr(e,t,r);break;case 21:Fr(e,t,r);break;case 22:r.mode&1?(ut=(n=ut)||r.memoizedState!==null,Fr(e,t,r),ut=n):Fr(e,t,r);break;default:Fr(e,t,r)}}function Gu(e){var t=e.updateQueue;if(t!==null){e.updateQueue=null;var r=e.stateNode;r===null&&(r=e.stateNode=new sp),t.forEach(function(n){var o=xp.bind(null,e,n);r.has(n)||(r.add(n),n.then(o,o))})}}function Vt(e,t){var r=t.deletions;if(r!==null)for(var n=0;n<r.length;n++){var o=r[n];try{var l=e,a=t,d=a;e:for(;d!==null;){switch(d.tag){case 5:ot=d.stateNode,Qt=!1;break e;case 3:ot=d.stateNode.containerInfo,Qt=!0;break e;case 4:ot=d.stateNode.containerInfo,Qt=!0;break e}d=d.return}if(ot===null)throw Error(u(160));Ku(l,a,o),ot=null,Qt=!1;var p=o.alternate;p!==null&&(p.return=null),o.return=null}catch(y){Ke(o,t,y)}}if(t.subtreeFlags&12854)for(t=t.child;t!==null;)qu(t,e),t=t.sibling}function qu(e,t){var r=e.alternate,n=e.flags;switch(e.tag){case 0:case 11:case 14:case 15:if(Vt(t,e),rr(e),n&4){try{Do(3,e,e.return),Mi(3,e)}catch(G){Ke(e,e.return,G)}try{Do(5,e,e.return)}catch(G){Ke(e,e.return,G)}}break;case 1:Vt(t,e),rr(e),n&512&&r!==null&&Xn(r,r.return);break;case 5:if(Vt(t,e),rr(e),n&512&&r!==null&&Xn(r,r.return),e.flags&32){var o=e.stateNode;try{yr(o,"")}catch(G){Ke(e,e.return,G)}}if(n&4&&(o=e.stateNode,o!=null)){var l=e.memoizedProps,a=r!==null?r.memoizedProps:l,d=e.type,p=e.updateQueue;if(e.updateQueue=null,p!==null)try{d==="input"&&l.type==="radio"&&l.name!=null&&Qr(o,l),yn(d,a);var y=yn(d,l);for(a=0;a<p.length;a+=2){var C=p[a],_=p[a+1];C==="style"?xn(o,_):C==="dangerouslySetInnerHTML"?hn(o,_):C==="children"?yr(o,_):Ne(o,C,_,y)}switch(d){case"input":mn(o,l);break;case"textarea":lo(o,l);break;case"select":var N=o._wrapperState.wasMultiple;o._wrapperState.wasMultiple=!!l.multiple;var U=l.value;U!=null?vr(o,!!l.multiple,U,!1):N!==!!l.multiple&&(l.defaultValue!=null?vr(o,!!l.multiple,l.defaultValue,!0):vr(o,!!l.multiple,l.multiple?[]:"",!1))}o[Co]=l}catch(G){Ke(e,e.return,G)}}break;case 6:if(Vt(t,e),rr(e),n&4){if(e.stateNode===null)throw Error(u(162));o=e.stateNode,l=e.memoizedProps;try{o.nodeValue=l}catch(G){Ke(e,e.return,G)}}break;case 3:if(Vt(t,e),rr(e),n&4&&r!==null&&r.memoizedState.isDehydrated)try{ho(t.containerInfo)}catch(G){Ke(e,e.return,G)}break;case 4:Vt(t,e),rr(e);break;case 13:Vt(t,e),rr(e),o=e.child,o.flags&8192&&(l=o.memoizedState!==null,o.stateNode.isHidden=l,!l||o.alternate!==null&&o.alternate.memoizedState!==null||(Na=Ue())),n&4&&Gu(e);break;case 22:if(C=r!==null&&r.memoizedState!==null,e.mode&1?(ut=(y=ut)||C,Vt(t,e),ut=y):Vt(t,e),rr(e),n&8192){if(y=e.memoizedState!==null,(e.stateNode.isHidden=y)&&!C&&(e.mode&1)!==0)for(V=e,C=e.child;C!==null;){for(_=V=C;V!==null;){switch(N=V,U=N.child,N.tag){case 0:case 11:case 14:case 15:Do(4,N,N.return);break;case 1:Xn(N,N.return);var K=N.stateNode;if(typeof K.componentWillUnmount=="function"){n=N,r=N.return;try{t=n,K.props=t.memoizedProps,K.state=t.memoizedState,K.componentWillUnmount()}catch(G){Ke(n,r,G)}}break;case 5:Xn(N,N.return);break;case 22:if(N.memoizedState!==null){Ju(_);continue}}U!==null?(U.return=N,V=U):Ju(_)}C=C.sibling}e:for(C=null,_=e;;){if(_.tag===5){if(C===null){C=_;try{o=_.stateNode,y?(l=o.style,typeof l.setProperty=="function"?l.setProperty("display","none","important"):l.display="none"):(d=_.stateNode,p=_.memoizedProps.style,a=p!=null&&p.hasOwnProperty("display")?p.display:null,d.style.display=vn("display",a))}catch(G){Ke(e,e.return,G)}}}else if(_.tag===6){if(C===null)try{_.stateNode.nodeValue=y?"":_.memoizedProps}catch(G){Ke(e,e.return,G)}}else if((_.tag!==22&&_.tag!==23||_.memoizedState===null||_===e)&&_.child!==null){_.child.return=_,_=_.child;continue}if(_===e)break e;for(;_.sibling===null;){if(_.return===null||_.return===e)break e;C===_&&(C=null),_=_.return}C===_&&(C=null),_.sibling.return=_.return,_=_.sibling}}break;case 19:Vt(t,e),rr(e),n&4&&Gu(e);break;case 21:break;default:Vt(t,e),rr(e)}}function rr(e){var t=e.flags;if(t&2){try{e:{for(var r=e.return;r!==null;){if(Vu(r)){var n=r;break e}r=r.return}throw Error(u(160))}switch(n.tag){case 5:var o=n.stateNode;n.flags&32&&(yr(o,""),n.flags&=-33);var l=Yu(e);ka(e,l,o);break;case 3:case 4:var a=n.stateNode.containerInfo,d=Yu(e);za(e,d,a);break;default:throw Error(u(161))}}catch(p){Ke(e,e.return,p)}e.flags&=-3}t&4096&&(e.flags&=-4097)}function cp(e,t,r){V=e,Xu(e)}function Xu(e,t,r){for(var n=(e.mode&1)!==0;V!==null;){var o=V,l=o.child;if(o.tag===22&&n){var a=o.memoizedState!==null||Ri;if(!a){var d=o.alternate,p=d!==null&&d.memoizedState!==null||ut;d=Ri;var y=ut;if(Ri=a,(ut=p)&&!y)for(V=o;V!==null;)a=V,p=a.child,a.tag===22&&a.memoizedState!==null?ec(o):p!==null?(p.return=a,V=p):ec(o);for(;l!==null;)V=l,Xu(l),l=l.sibling;V=o,Ri=d,ut=y}Zu(e)}else(o.subtreeFlags&8772)!==0&&l!==null?(l.return=o,V=l):Zu(e)}}function Zu(e){for(;V!==null;){var t=V;if((t.flags&8772)!==0){var r=t.alternate;try{if((t.flags&8772)!==0)switch(t.tag){case 0:case 11:case 15:ut||Mi(5,t);break;case 1:var n=t.stateNode;if(t.flags&4&&!ut)if(r===null)n.componentDidMount();else{var o=t.elementType===t.type?r.memoizedProps:Ht(t.type,r.memoizedProps);n.componentDidUpdate(o,r.memoizedState,n.__reactInternalSnapshotBeforeUpdate)}var l=t.updateQueue;l!==null&&Js(t,l,n);break;case 3:var a=t.updateQueue;if(a!==null){if(r=null,t.child!==null)switch(t.child.tag){case 5:r=t.child.stateNode;break;case 1:r=t.child.stateNode}Js(t,a,r)}break;case 5:var d=t.stateNode;if(r===null&&t.flags&4){r=d;var p=t.memoizedProps;switch(t.type){case"button":case"input":case"select":case"textarea":p.autoFocus&&r.focus();break;case"img":p.src&&(r.src=p.src)}}break;case 6:break;case 4:break;case 12:break;case 13:if(t.memoizedState===null){var y=t.alternate;if(y!==null){var C=y.memoizedState;if(C!==null){var _=C.dehydrated;_!==null&&ho(_)}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;default:throw Error(u(163))}ut||t.flags&512&&ba(t)}catch(N){Ke(t,t.return,N)}}if(t===e){V=null;break}if(r=t.sibling,r!==null){r.return=t.return,V=r;break}V=t.return}}function Ju(e){for(;V!==null;){var t=V;if(t===e){V=null;break}var r=t.sibling;if(r!==null){r.return=t.return,V=r;break}V=t.return}}function ec(e){for(;V!==null;){var t=V;try{switch(t.tag){case 0:case 11:case 15:var r=t.return;try{Mi(4,t)}catch(p){Ke(t,r,p)}break;case 1:var n=t.stateNode;if(typeof n.componentDidMount=="function"){var o=t.return;try{n.componentDidMount()}catch(p){Ke(t,o,p)}}var l=t.return;try{ba(t)}catch(p){Ke(t,l,p)}break;case 5:var a=t.return;try{ba(t)}catch(p){Ke(t,a,p)}}}catch(p){Ke(t,t.return,p)}if(t===e){V=null;break}var d=t.sibling;if(d!==null){d.return=t.return,V=d;break}V=t.return}}var dp=Math.ceil,Ii=me.ReactCurrentDispatcher,ja=me.ReactCurrentOwner,Ot=me.ReactCurrentBatchConfig,Ee=0,rt=null,Ze=null,it=0,Et=0,Zn=Lr(0),et=0,$o=null,sn=0,Oi=0,Sa=0,Ao=null,xt=null,Na=0,Jn=1/0,mr=null,Fi=!1,Ca=null,Dr=null,Di=!1,$r=null,$i=0,Bo=0,Ea=null,Ai=-1,Bi=0;function dt(){return(Ee&6)!==0?Ue():Ai!==-1?Ai:Ai=Ue()}function Ar(e){return(e.mode&1)===0?1:(Ee&2)!==0&&it!==0?it&-it:Kd.transition!==null?(Bi===0&&(Bi=fo()),Bi):(e=g,e!==0||(e=window.event,e=e===void 0?16:rs(e.type)),e)}function Yt(e,t,r,n){if(50<Bo)throw Bo=0,Ea=null,Error(u(185));Cr(e,r,n),((Ee&2)===0||e!==rt)&&(e===rt&&((Ee&2)===0&&(Oi|=r),et===4&&Br(e,it)),yt(e,n),r===1&&Ee===0&&(t.mode&1)===0&&(Jn=Ue()+500,gi&&Mr()))}function yt(e,t){var r=e.callbackNode;Xo(e,t);var n=Jr(e,e===rt?it:0);if(n===0)r!==null&&uo(r),e.callbackNode=null,e.callbackPriority=0;else if(t=n&-n,e.callbackPriority!==t){if(r!=null&&uo(r),t===1)e.tag===0?Yd(rc.bind(null,e)):Bs(rc.bind(null,e)),Wd(function(){(Ee&6)===0&&Mr()}),r=null;else{switch(k(n)){case 1:r=po;break;case 4:r=jr;break;case 16:r=Cn;break;case 536870912:r=Go;break;default:r=Cn}r=cc(r,tc.bind(null,e))}e.callbackPriority=t,e.callbackNode=r}}function tc(e,t){if(Ai=-1,Bi=0,(Ee&6)!==0)throw Error(u(327));var r=e.callbackNode;if(eo()&&e.callbackNode!==r)return null;var n=Jr(e,e===rt?it:0);if(n===0)return null;if((n&30)!==0||(n&e.expiredLanes)!==0||t)t=Ui(e,n);else{t=n;var o=Ee;Ee|=2;var l=oc();(rt!==e||it!==t)&&(mr=null,Jn=Ue()+500,cn(e,t));do try{mp();break}catch(d){nc(e,d)}while(!0);Vl(),Ii.current=l,Ee=o,Ze!==null?t=0:(rt=null,it=0,t=et)}if(t!==0){if(t===2&&(o=Pn(e),o!==0&&(n=o,t=_a(e,o))),t===1)throw r=$o,cn(e,0),Br(e,n),yt(e,Ue()),r;if(t===6)Br(e,n);else{if(o=e.current.alternate,(n&30)===0&&!pp(o)&&(t=Ui(e,n),t===2&&(l=Pn(e),l!==0&&(n=l,t=_a(e,l))),t===1))throw r=$o,cn(e,0),Br(e,n),yt(e,Ue()),r;switch(e.finishedWork=o,e.finishedLanes=n,t){case 0:case 1:throw Error(u(345));case 2:dn(e,xt,mr);break;case 3:if(Br(e,n),(n&130023424)===n&&(t=Na+500-Ue(),10<t)){if(Jr(e,0)!==0)break;if(o=e.suspendedLanes,(o&n)!==n){dt(),e.pingedLanes|=e.suspendedLanes&o;break}e.timeoutHandle=Il(dn.bind(null,e,xt,mr),t);break}dn(e,xt,mr);break;case 4:if(Br(e,n),(n&4194240)===n)break;for(t=e.eventTimes,o=-1;0<n;){var a=31-kt(n);l=1<<a,a=t[a],a>o&&(o=a),n&=~l}if(n=o,n=Ue()-n,n=(120>n?120:480>n?480:1080>n?1080:1920>n?1920:3e3>n?3e3:4320>n?4320:1960*dp(n/1960))-n,10<n){e.timeoutHandle=Il(dn.bind(null,e,xt,mr),n);break}dn(e,xt,mr);break;case 5:dn(e,xt,mr);break;default:throw Error(u(329))}}}return yt(e,Ue()),e.callbackNode===r?tc.bind(null,e):null}function _a(e,t){var r=Ao;return e.current.memoizedState.isDehydrated&&(cn(e,t).flags|=256),e=Ui(e,t),e!==2&&(t=xt,xt=r,t!==null&&Pa(t)),e}function Pa(e){xt===null?xt=e:xt.push.apply(xt,e)}function pp(e){for(var t=e;;){if(t.flags&16384){var r=t.updateQueue;if(r!==null&&(r=r.stores,r!==null))for(var n=0;n<r.length;n++){var o=r[n],l=o.getSnapshot;o=o.value;try{if(!Ut(l(),o))return!1}catch{return!1}}}if(r=t.child,t.subtreeFlags&16384&&r!==null)r.return=t,t=r;else{if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return!0;t=t.return}t.sibling.return=t.return,t=t.sibling}}return!0}function Br(e,t){for(t&=~Sa,t&=~Oi,e.suspendedLanes|=t,e.pingedLanes&=~t,e=e.expirationTimes;0<t;){var r=31-kt(t),n=1<<r;e[r]=-1,t&=~n}}function rc(e){if((Ee&6)!==0)throw Error(u(327));eo();var t=Jr(e,0);if((t&1)===0)return yt(e,Ue()),null;var r=Ui(e,t);if(e.tag!==0&&r===2){var n=Pn(e);n!==0&&(t=n,r=_a(e,n))}if(r===1)throw r=$o,cn(e,0),Br(e,t),yt(e,Ue()),r;if(r===6)throw Error(u(345));return e.finishedWork=e.current.alternate,e.finishedLanes=t,dn(e,xt,mr),yt(e,Ue()),null}function Ta(e,t){var r=Ee;Ee|=1;try{return e(t)}finally{Ee=r,Ee===0&&(Jn=Ue()+500,gi&&Mr())}}function un(e){$r!==null&&$r.tag===0&&(Ee&6)===0&&eo();var t=Ee;Ee|=1;var r=Ot.transition,n=g;try{if(Ot.transition=null,g=1,e)return e()}finally{g=n,Ot.transition=r,Ee=t,(Ee&6)===0&&Mr()}}function La(){Et=Zn.current,Ae(Zn)}function cn(e,t){e.finishedWork=null,e.finishedLanes=0;var r=e.timeoutHandle;if(r!==-1&&(e.timeoutHandle=-1,Ud(r)),Ze!==null)for(r=Ze.return;r!==null;){var n=r;switch(Bl(n),n.tag){case 1:n=n.type.childContextTypes,n!=null&&fi();break;case 3:Gn(),Ae(gt),Ae(lt),ea();break;case 5:Zl(n);break;case 4:Gn();break;case 13:Ae(Qe);break;case 19:Ae(Qe);break;case 10:Yl(n.type._context);break;case 22:case 23:La()}r=r.return}if(rt=e,Ze=e=Ur(e.current,null),it=Et=t,et=0,$o=null,Sa=Oi=sn=0,xt=Ao=null,on!==null){for(t=0;t<on.length;t++)if(r=on[t],n=r.interleaved,n!==null){r.interleaved=null;var o=n.next,l=r.pending;if(l!==null){var a=l.next;l.next=o,n.next=a}r.pending=n}on=null}return e}function nc(e,t){do{var r=Ze;try{if(Vl(),Si.current=_i,Ni){for(var n=Ve.memoizedState;n!==null;){var o=n.queue;o!==null&&(o.pending=null),n=n.next}Ni=!1}if(an=0,tt=Je=Ve=null,Ro=!1,Mo=0,ja.current=null,r===null||r.return===null){et=1,$o=t,Ze=null;break}e:{var l=e,a=r.return,d=r,p=t;if(t=it,d.flags|=32768,p!==null&&typeof p=="object"&&typeof p.then=="function"){var y=p,C=d,_=C.tag;if((C.mode&1)===0&&(_===0||_===11||_===15)){var N=C.alternate;N?(C.updateQueue=N.updateQueue,C.memoizedState=N.memoizedState,C.lanes=N.lanes):(C.updateQueue=null,C.memoizedState=null)}var U=Eu(a);if(U!==null){U.flags&=-257,_u(U,a,d,l,t),U.mode&1&&Cu(l,y,t),t=U,p=y;var K=t.updateQueue;if(K===null){var G=new Set;G.add(p),t.updateQueue=G}else K.add(p);break e}else{if((t&1)===0){Cu(l,y,t),Ra();break e}p=Error(u(426))}}else if(We&&d.mode&1){var Ge=Eu(a);if(Ge!==null){(Ge.flags&65536)===0&&(Ge.flags|=256),_u(Ge,a,d,l,t),Hl(qn(p,d));break e}}l=p=qn(p,d),et!==4&&(et=2),Ao===null?Ao=[l]:Ao.push(l),l=a;do{switch(l.tag){case 3:l.flags|=65536,t&=-t,l.lanes|=t;var v=Su(l,p,t);Zs(l,v);break e;case 1:d=p;var m=l.type,x=l.stateNode;if((l.flags&128)===0&&(typeof m.getDerivedStateFromError=="function"||x!==null&&typeof x.componentDidCatch=="function"&&(Dr===null||!Dr.has(x)))){l.flags|=65536,t&=-t,l.lanes|=t;var R=Nu(l,d,t);Zs(l,R);break e}}l=l.return}while(l!==null)}lc(r)}catch(Z){t=Z,Ze===r&&r!==null&&(Ze=r=r.return);continue}break}while(!0)}function oc(){var e=Ii.current;return Ii.current=_i,e===null?_i:e}function Ra(){(et===0||et===3||et===2)&&(et=4),rt===null||(sn&268435455)===0&&(Oi&268435455)===0||Br(rt,it)}function Ui(e,t){var r=Ee;Ee|=2;var n=oc();(rt!==e||it!==t)&&(mr=null,cn(e,t));do try{fp();break}catch(o){nc(e,o)}while(!0);if(Vl(),Ee=r,Ii.current=n,Ze!==null)throw Error(u(261));return rt=null,it=0,et}function fp(){for(;Ze!==null;)ic(Ze)}function mp(){for(;Ze!==null&&!Nn();)ic(Ze)}function ic(e){var t=uc(e.alternate,e,Et);e.memoizedProps=e.pendingProps,t===null?lc(e):Ze=t,ja.current=null}function lc(e){var t=e;do{var r=t.alternate;if(e=t.return,(t.flags&32768)===0){if(r=lp(r,t,Et),r!==null){Ze=r;return}}else{if(r=ap(r,t),r!==null){r.flags&=32767,Ze=r;return}if(e!==null)e.flags|=32768,e.subtreeFlags=0,e.deletions=null;else{et=6,Ze=null;return}}if(t=t.sibling,t!==null){Ze=t;return}Ze=t=e}while(t!==null);et===0&&(et=5)}function dn(e,t,r){var n=g,o=Ot.transition;try{Ot.transition=null,g=1,gp(e,t,r,n)}finally{Ot.transition=o,g=n}return null}function gp(e,t,r,n){do eo();while($r!==null);if((Ee&6)!==0)throw Error(u(327));r=e.finishedWork;var o=e.finishedLanes;if(r===null)return null;if(e.finishedWork=null,e.finishedLanes=0,r===e.current)throw Error(u(177));e.callbackNode=null,e.callbackPriority=0;var l=r.lanes|r.childLanes;if(Zo(e,l),e===rt&&(Ze=rt=null,it=0),(r.subtreeFlags&2064)===0&&(r.flags&2064)===0||Di||(Di=!0,cc(Cn,function(){return eo(),null})),l=(r.flags&15990)!==0,(r.subtreeFlags&15990)!==0||l){l=Ot.transition,Ot.transition=null;var a=g;g=1;var d=Ee;Ee|=4,ja.current=null,up(e,r),qu(r,e),Id(Rl),Jo=!!Ll,Rl=Ll=null,e.current=r,cp(r),co(),Ee=d,g=a,Ot.transition=l}else e.current=r;if(Di&&(Di=!1,$r=e,$i=o),l=e.pendingLanes,l===0&&(Dr=null),ul(r.stateNode),yt(e,Ue()),t!==null)for(n=e.onRecoverableError,r=0;r<t.length;r++)o=t[r],n(o.value,{componentStack:o.stack,digest:o.digest});if(Fi)throw Fi=!1,e=Ca,Ca=null,e;return($i&1)!==0&&e.tag!==0&&eo(),l=e.pendingLanes,(l&1)!==0?e===Ea?Bo++:(Bo=0,Ea=e):Bo=0,Mr(),null}function eo(){if($r!==null){var e=k($i),t=Ot.transition,r=g;try{if(Ot.transition=null,g=16>e?16:e,$r===null)var n=!1;else{if(e=$r,$r=null,$i=0,(Ee&6)!==0)throw Error(u(331));var o=Ee;for(Ee|=4,V=e.current;V!==null;){var l=V,a=l.child;if((V.flags&16)!==0){var d=l.deletions;if(d!==null){for(var p=0;p<d.length;p++){var y=d[p];for(V=y;V!==null;){var C=V;switch(C.tag){case 0:case 11:case 15:Do(8,C,l)}var _=C.child;if(_!==null)_.return=C,V=_;else for(;V!==null;){C=V;var N=C.sibling,U=C.return;if(Qu(C),C===y){V=null;break}if(N!==null){N.return=U,V=N;break}V=U}}}var K=l.alternate;if(K!==null){var G=K.child;if(G!==null){K.child=null;do{var Ge=G.sibling;G.sibling=null,G=Ge}while(G!==null)}}V=l}}if((l.subtreeFlags&2064)!==0&&a!==null)a.return=l,V=a;else e:for(;V!==null;){if(l=V,(l.flags&2048)!==0)switch(l.tag){case 0:case 11:case 15:Do(9,l,l.return)}var v=l.sibling;if(v!==null){v.return=l.return,V=v;break e}V=l.return}}var m=e.current;for(V=m;V!==null;){a=V;var x=a.child;if((a.subtreeFlags&2064)!==0&&x!==null)x.return=a,V=x;else e:for(a=m;V!==null;){if(d=V,(d.flags&2048)!==0)try{switch(d.tag){case 0:case 11:case 15:Mi(9,d)}}catch(Z){Ke(d,d.return,Z)}if(d===a){V=null;break e}var R=d.sibling;if(R!==null){R.return=d.return,V=R;break e}V=d.return}}if(Ee=o,Mr(),zt&&typeof zt.onPostCommitFiberRoot=="function")try{zt.onPostCommitFiberRoot(Sr,e)}catch{}n=!0}return n}finally{g=r,Ot.transition=t}}return!1}function ac(e,t,r){t=qn(r,t),t=Su(e,t,1),e=Or(e,t,1),t=dt(),e!==null&&(Cr(e,1,t),yt(e,t))}function Ke(e,t,r){if(e.tag===3)ac(e,e,r);else for(;t!==null;){if(t.tag===3){ac(t,e,r);break}else if(t.tag===1){var n=t.stateNode;if(typeof t.type.getDerivedStateFromError=="function"||typeof n.componentDidCatch=="function"&&(Dr===null||!Dr.has(n))){e=qn(r,e),e=Nu(t,e,1),t=Or(t,e,1),e=dt(),t!==null&&(Cr(t,1,e),yt(t,e));break}}t=t.return}}function hp(e,t,r){var n=e.pingCache;n!==null&&n.delete(t),t=dt(),e.pingedLanes|=e.suspendedLanes&r,rt===e&&(it&r)===r&&(et===4||et===3&&(it&130023424)===it&&500>Ue()-Na?cn(e,0):Sa|=r),yt(e,t)}function sc(e,t){t===0&&((e.mode&1)===0?t=1:(t=_n,_n<<=1,(_n&130023424)===0&&(_n=4194304)));var r=dt();e=dr(e,t),e!==null&&(Cr(e,t,r),yt(e,r))}function vp(e){var t=e.memoizedState,r=0;t!==null&&(r=t.retryLane),sc(e,r)}function xp(e,t){var r=0;switch(e.tag){case 13:var n=e.stateNode,o=e.memoizedState;o!==null&&(r=o.retryLane);break;case 19:n=e.stateNode;break;default:throw Error(u(314))}n!==null&&n.delete(t),sc(e,r)}var uc;uc=function(e,t,r){if(e!==null)if(e.memoizedProps!==t.pendingProps||gt.current)vt=!0;else{if((e.lanes&r)===0&&(t.flags&128)===0)return vt=!1,ip(e,t,r);vt=(e.flags&131072)!==0}else vt=!1,We&&(t.flags&1048576)!==0&&Us(t,vi,t.index);switch(t.lanes=0,t.tag){case 2:var n=t.type;Li(e,t),e=t.pendingProps;var o=Un(t,lt.current);Kn(t,r),o=na(null,t,n,e,o,r);var l=oa();return t.flags|=1,typeof o=="object"&&o!==null&&typeof o.render=="function"&&o.$$typeof===void 0?(t.tag=1,t.memoizedState=null,t.updateQueue=null,ht(n)?(l=!0,mi(t)):l=!1,t.memoizedState=o.state!==null&&o.state!==void 0?o.state:null,ql(t),o.updater=Pi,t.stateNode=o,o._reactInternals=t,ca(t,n,e,r),t=ma(null,t,n,!0,l,r)):(t.tag=0,We&&l&&Al(t),ct(null,t,o,r),t=t.child),t;case 16:n=t.elementType;e:{switch(Li(e,t),e=t.pendingProps,o=n._init,n=o(n._payload),t.type=n,o=t.tag=wp(n),e=Ht(n,e),o){case 0:t=fa(null,t,n,e,r);break e;case 1:t=Iu(null,t,n,e,r);break e;case 11:t=Pu(null,t,n,e,r);break e;case 14:t=Tu(null,t,n,Ht(n.type,e),r);break e}throw Error(u(306,n,""))}return t;case 0:return n=t.type,o=t.pendingProps,o=t.elementType===n?o:Ht(n,o),fa(e,t,n,o,r);case 1:return n=t.type,o=t.pendingProps,o=t.elementType===n?o:Ht(n,o),Iu(e,t,n,o,r);case 3:e:{if(Ou(t),e===null)throw Error(u(387));n=t.pendingProps,l=t.memoizedState,o=l.element,Xs(e,t),ki(t,n,null,r);var a=t.memoizedState;if(n=a.element,l.isDehydrated)if(l={element:n,isDehydrated:!1,cache:a.cache,pendingSuspenseBoundaries:a.pendingSuspenseBoundaries,transitions:a.transitions},t.updateQueue.baseState=l,t.memoizedState=l,t.flags&256){o=qn(Error(u(423)),t),t=Fu(e,t,n,r,o);break e}else if(n!==o){o=qn(Error(u(424)),t),t=Fu(e,t,n,r,o);break e}else for(Ct=Tr(t.stateNode.containerInfo.firstChild),Nt=t,We=!0,Wt=null,r=Gs(t,null,n,r),t.child=r;r;)r.flags=r.flags&-3|4096,r=r.sibling;else{if(Qn(),n===o){t=fr(e,t,r);break e}ct(e,t,n,r)}t=t.child}return t;case 5:return eu(t),e===null&&Wl(t),n=t.type,o=t.pendingProps,l=e!==null?e.memoizedProps:null,a=o.children,Ml(n,o)?a=null:l!==null&&Ml(n,l)&&(t.flags|=32),Mu(e,t),ct(e,t,a,r),t.child;case 6:return e===null&&Wl(t),null;case 13:return Du(e,t,r);case 4:return Xl(t,t.stateNode.containerInfo),n=t.pendingProps,e===null?t.child=Vn(t,null,n,r):ct(e,t,n,r),t.child;case 11:return n=t.type,o=t.pendingProps,o=t.elementType===n?o:Ht(n,o),Pu(e,t,n,o,r);case 7:return ct(e,t,t.pendingProps,r),t.child;case 8:return ct(e,t,t.pendingProps.children,r),t.child;case 12:return ct(e,t,t.pendingProps.children,r),t.child;case 10:e:{if(n=t.type._context,o=t.pendingProps,l=t.memoizedProps,a=o.value,Fe(wi,n._currentValue),n._currentValue=a,l!==null)if(Ut(l.value,a)){if(l.children===o.children&&!gt.current){t=fr(e,t,r);break e}}else for(l=t.child,l!==null&&(l.return=t);l!==null;){var d=l.dependencies;if(d!==null){a=l.child;for(var p=d.firstContext;p!==null;){if(p.context===n){if(l.tag===1){p=pr(-1,r&-r),p.tag=2;var y=l.updateQueue;if(y!==null){y=y.shared;var C=y.pending;C===null?p.next=p:(p.next=C.next,C.next=p),y.pending=p}}l.lanes|=r,p=l.alternate,p!==null&&(p.lanes|=r),Kl(l.return,r,t),d.lanes|=r;break}p=p.next}}else if(l.tag===10)a=l.type===t.type?null:l.child;else if(l.tag===18){if(a=l.return,a===null)throw Error(u(341));a.lanes|=r,d=a.alternate,d!==null&&(d.lanes|=r),Kl(a,r,t),a=l.sibling}else a=l.child;if(a!==null)a.return=l;else for(a=l;a!==null;){if(a===t){a=null;break}if(l=a.sibling,l!==null){l.return=a.return,a=l;break}a=a.return}l=a}ct(e,t,o.children,r),t=t.child}return t;case 9:return o=t.type,n=t.pendingProps.children,Kn(t,r),o=Mt(o),n=n(o),t.flags|=1,ct(e,t,n,r),t.child;case 14:return n=t.type,o=Ht(n,t.pendingProps),o=Ht(n.type,o),Tu(e,t,n,o,r);case 15:return Lu(e,t,t.type,t.pendingProps,r);case 17:return n=t.type,o=t.pendingProps,o=t.elementType===n?o:Ht(n,o),Li(e,t),t.tag=1,ht(n)?(e=!0,mi(t)):e=!1,Kn(t,r),ku(t,n,o),ca(t,n,o,r),ma(null,t,n,!0,e,r);case 19:return Au(e,t,r);case 22:return Ru(e,t,r)}throw Error(u(156,t.tag))};function cc(e,t){return Sn(e,t)}function yp(e,t,r,n){this.tag=e,this.key=r,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.ref=null,this.pendingProps=t,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=n,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function Ft(e,t,r,n){return new yp(e,t,r,n)}function Ma(e){return e=e.prototype,!(!e||!e.isReactComponent)}function wp(e){if(typeof e=="function")return Ma(e)?1:0;if(e!=null){if(e=e.$$typeof,e===I)return 11;if(e===A)return 14}return 2}function Ur(e,t){var r=e.alternate;return r===null?(r=Ft(e.tag,t,e.key,e.mode),r.elementType=e.elementType,r.type=e.type,r.stateNode=e.stateNode,r.alternate=e,e.alternate=r):(r.pendingProps=t,r.type=e.type,r.flags=0,r.subtreeFlags=0,r.deletions=null),r.flags=e.flags&14680064,r.childLanes=e.childLanes,r.lanes=e.lanes,r.child=e.child,r.memoizedProps=e.memoizedProps,r.memoizedState=e.memoizedState,r.updateQueue=e.updateQueue,t=e.dependencies,r.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext},r.sibling=e.sibling,r.index=e.index,r.ref=e.ref,r}function Wi(e,t,r,n,o,l){var a=2;if(n=e,typeof e=="function")Ma(e)&&(a=1);else if(typeof e=="string")a=5;else e:switch(e){case xe:return pn(r.children,o,l,t);case Ce:a=8,o|=8;break;case re:return e=Ft(12,r,t,o|2),e.elementType=re,e.lanes=l,e;case ne:return e=Ft(13,r,t,o),e.elementType=ne,e.lanes=l,e;case S:return e=Ft(19,r,t,o),e.elementType=S,e.lanes=l,e;case fe:return Hi(r,o,l,t);default:if(typeof e=="object"&&e!==null)switch(e.$$typeof){case He:a=10;break e;case Le:a=9;break e;case I:a=11;break e;case A:a=14;break e;case ce:a=16,n=null;break e}throw Error(u(130,e==null?e:typeof e,""))}return t=Ft(a,r,t,o),t.elementType=e,t.type=n,t.lanes=l,t}function pn(e,t,r,n){return e=Ft(7,e,n,t),e.lanes=r,e}function Hi(e,t,r,n){return e=Ft(22,e,n,t),e.elementType=fe,e.lanes=r,e.stateNode={isHidden:!1},e}function Ia(e,t,r){return e=Ft(6,e,null,t),e.lanes=r,e}function Oa(e,t,r){return t=Ft(4,e.children!==null?e.children:[],e.key,t),t.lanes=r,t.stateNode={containerInfo:e.containerInfo,pendingChildren:null,implementation:e.implementation},t}function bp(e,t,r,n,o){this.tag=t,this.containerInfo=e,this.finishedWork=this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.pendingContext=this.context=null,this.callbackPriority=0,this.eventTimes=Tn(0),this.expirationTimes=Tn(-1),this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=Tn(0),this.identifierPrefix=n,this.onRecoverableError=o,this.mutableSourceEagerHydrationData=null}function Fa(e,t,r,n,o,l,a,d,p){return e=new bp(e,t,r,d,p),t===1?(t=1,l===!0&&(t|=8)):t=0,l=Ft(3,null,null,t),e.current=l,l.stateNode=e,l.memoizedState={element:n,isDehydrated:r,cache:null,transitions:null,pendingSuspenseBoundaries:null},ql(l),e}function zp(e,t,r){var n=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:he,key:n==null?null:""+n,children:e,containerInfo:t,implementation:r}}function dc(e){if(!e)return Rr;e=e._reactInternals;e:{if(De(e)!==e||e.tag!==1)throw Error(u(170));var t=e;do{switch(t.tag){case 3:t=t.stateNode.context;break e;case 1:if(ht(t.type)){t=t.stateNode.__reactInternalMemoizedMergedChildContext;break e}}t=t.return}while(t!==null);throw Error(u(171))}if(e.tag===1){var r=e.type;if(ht(r))return $s(e,r,t)}return t}function pc(e,t,r,n,o,l,a,d,p){return e=Fa(r,n,!0,e,o,l,a,d,p),e.context=dc(null),r=e.current,n=dt(),o=Ar(r),l=pr(n,o),l.callback=t??null,Or(r,l,o),e.current.lanes=o,Cr(e,o,n),yt(e,n),e}function Qi(e,t,r,n){var o=t.current,l=dt(),a=Ar(o);return r=dc(r),t.context===null?t.context=r:t.pendingContext=r,t=pr(l,a),t.payload={element:e},n=n===void 0?null:n,n!==null&&(t.callback=n),e=Or(o,t,a),e!==null&&(Yt(e,o,a,l),zi(e,o,a)),a}function Vi(e){if(e=e.current,!e.child)return null;switch(e.child.tag){case 5:return e.child.stateNode;default:return e.child.stateNode}}function fc(e,t){if(e=e.memoizedState,e!==null&&e.dehydrated!==null){var r=e.retryLane;e.retryLane=r!==0&&r<t?r:t}}function Da(e,t){fc(e,t),(e=e.alternate)&&fc(e,t)}function kp(){return null}var mc=typeof reportError=="function"?reportError:function(e){console.error(e)};function $a(e){this._internalRoot=e}Yi.prototype.render=$a.prototype.render=function(e){var t=this._internalRoot;if(t===null)throw Error(u(409));Qi(e,t,null,null)},Yi.prototype.unmount=$a.prototype.unmount=function(){var e=this._internalRoot;if(e!==null){this._internalRoot=null;var t=e.containerInfo;un(function(){Qi(null,e,null,null)}),t[ar]=null}};function Yi(e){this._internalRoot=e}Yi.prototype.unstable_scheduleHydration=function(e){if(e){var t=X();e={blockedOn:null,target:e,priority:t};for(var r=0;r<we.length&&t!==0&&t<we[r].priority;r++);we.splice(r,0,e),r===0&&mo(e)}};function Aa(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11)}function Ki(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11&&(e.nodeType!==8||e.nodeValue!==" react-mount-point-unstable "))}function gc(){}function jp(e,t,r,n,o){if(o){if(typeof n=="function"){var l=n;n=function(){var y=Vi(a);l.call(y)}}var a=pc(t,n,e,0,null,!1,!1,"",gc);return e._reactRootContainer=a,e[ar]=a.current,So(e.nodeType===8?e.parentNode:e),un(),a}for(;o=e.lastChild;)e.removeChild(o);if(typeof n=="function"){var d=n;n=function(){var y=Vi(p);d.call(y)}}var p=Fa(e,0,!1,null,null,!1,!1,"",gc);return e._reactRootContainer=p,e[ar]=p.current,So(e.nodeType===8?e.parentNode:e),un(function(){Qi(t,p,r,n)}),p}function Gi(e,t,r,n,o){var l=r._reactRootContainer;if(l){var a=l;if(typeof o=="function"){var d=o;o=function(){var p=Vi(a);d.call(p)}}Qi(t,a,e,o)}else a=jp(r,t,e,o,n);return Vi(a)}E=function(e){switch(e.tag){case 3:var t=e.stateNode;if(t.current.memoizedState.isDehydrated){var r=Nr(t.pendingLanes);r!==0&&(c(t,r|1),yt(t,Ue()),(Ee&6)===0&&(Jn=Ue()+500,Mr()))}break;case 13:un(function(){var n=dr(e,1);if(n!==null){var o=dt();Yt(n,e,1,o)}}),Da(e,1)}},Q=function(e){if(e.tag===13){var t=dr(e,134217728);if(t!==null){var r=dt();Yt(t,e,134217728,r)}Da(e,134217728)}},W=function(e){if(e.tag===13){var t=Ar(e),r=dr(e,t);if(r!==null){var n=dt();Yt(r,e,t,n)}Da(e,t)}},X=function(){return g},de=function(e,t){var r=g;try{return g=e,t()}finally{g=r}},Tt=function(e,t,r){switch(t){case"input":if(mn(e,r),t=r.name,r.type==="radio"&&t!=null){for(r=e;r.parentNode;)r=r.parentNode;for(r=r.querySelectorAll("input[name="+JSON.stringify(""+t)+'][type="radio"]'),t=0;t<r.length;t++){var n=r[t];if(n!==e&&n.form===e.form){var o=pi(n);if(!o)throw Error(u(90));Hr(n),mn(n,o)}}}break;case"textarea":lo(e,r);break;case"select":t=r.value,t!=null&&vr(e,!!r.multiple,t,!1)}},Kr=Ta,Zt=un;var Sp={usingClientEntryPoint:!1,Events:[Eo,An,pi,ao,Vo,Ta]},Uo={findFiberByHostInstance:en,bundleType:0,version:"18.3.1",rendererPackageName:"react-dom"},Np={bundleType:Uo.bundleType,version:Uo.version,rendererPackageName:Uo.rendererPackageName,rendererConfig:Uo.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:me.ReactCurrentDispatcher,findHostInstanceByFiber:function(e){return e=Bt(e),e===null?null:e.stateNode},findFiberByHostInstance:Uo.findFiberByHostInstance||kp,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.3.1-next-f1338f8080-20240426"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var qi=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!qi.isDisabled&&qi.supportsFiber)try{Sr=qi.inject(Np),zt=qi}catch{}}return wt.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=Sp,wt.createPortal=function(e,t){var r=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!Aa(t))throw Error(u(200));return zp(e,t,null,r)},wt.createRoot=function(e,t){if(!Aa(e))throw Error(u(299));var r=!1,n="",o=mc;return t!=null&&(t.unstable_strictMode===!0&&(r=!0),t.identifierPrefix!==void 0&&(n=t.identifierPrefix),t.onRecoverableError!==void 0&&(o=t.onRecoverableError)),t=Fa(e,1,!1,null,null,r,!1,n,o),e[ar]=t.current,So(e.nodeType===8?e.parentNode:e),new $a(t)},wt.findDOMNode=function(e){if(e==null)return null;if(e.nodeType===1)return e;var t=e._reactInternals;if(t===void 0)throw typeof e.render=="function"?Error(u(188)):(e=Object.keys(e).join(","),Error(u(268,e)));return e=Bt(t),e=e===null?null:e.stateNode,e},wt.flushSync=function(e){return un(e)},wt.hydrate=function(e,t,r){if(!Ki(t))throw Error(u(200));return Gi(null,e,t,!0,r)},wt.hydrateRoot=function(e,t,r){if(!Aa(e))throw Error(u(405));var n=r!=null&&r.hydratedSources||null,o=!1,l="",a=mc;if(r!=null&&(r.unstable_strictMode===!0&&(o=!0),r.identifierPrefix!==void 0&&(l=r.identifierPrefix),r.onRecoverableError!==void 0&&(a=r.onRecoverableError)),t=pc(t,null,e,1,r??null,o,!1,l,a),e[ar]=t.current,So(e),n)for(e=0;e<n.length;e++)r=n[e],o=r._getVersion,o=o(r._source),t.mutableSourceEagerHydrationData==null?t.mutableSourceEagerHydrationData=[r,o]:t.mutableSourceEagerHydrationData.push(r,o);return new Yi(t)},wt.render=function(e,t,r){if(!Ki(t))throw Error(u(200));return Gi(null,e,t,!1,r)},wt.unmountComponentAtNode=function(e){if(!Ki(e))throw Error(u(40));return e._reactRootContainer?(un(function(){Gi(null,null,e,!1,function(){e._reactRootContainer=null,e[ar]=null})}),!0):!1},wt.unstable_batchedUpdates=Ta,wt.unstable_renderSubtreeIntoContainer=function(e,t,r,n){if(!Ki(r))throw Error(u(200));if(e==null||e._reactInternals===void 0)throw Error(u(38));return Gi(e,t,r,!1,n)},wt.version="18.3.1-next-f1338f8080-20240426",wt}var jc;function Op(){if(jc)return Wa.exports;jc=1;function s(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(s)}catch(f){console.error(f)}}return s(),Wa.exports=Ip(),Wa.exports}var Sc;function Fp(){if(Sc)return Xi;Sc=1;var s=Op();return Xi.createRoot=s.createRoot,Xi.hydrateRoot=s.hydrateRoot,Xi}var Dp=Fp();const $p=Dc(Dp),Ac="http://localhost:3000";async function Gt(s,f={}){let u;try{u=await fetch(`${Ac}${s}`,{headers:{"Content-Type":"application/json"},...f})}catch{const P=new Error("Network error. Please check your connection.");throw P.isNetworkError=!0,P}const z=await u.json().catch(()=>({}));if(!u.ok){const w=new Error(z.message||"Something went wrong. Please try again.");throw w.status=u.status,w.data=z.data,w}return z}const Ap=()=>Gt("/api/category/public"),Nc=()=>Gt("/api/dish/public"),Cc=()=>Gt("/api/deal/public"),Bp=()=>Gt("/api/hero-slide/public"),Up=s=>Gt("/api/order/public/checkout",{method:"POST",body:JSON.stringify(s)}),Ec=s=>Gt(`/api/order/public/${s}`),Wp=s=>Gt(`/api/order/public/${s}/cancel`,{method:"PATCH"}),Hp=s=>Gt(`/api/order/public/lookup?phone=${encodeURIComponent(s)}`),_c=()=>Gt("/api/settings"),Qp=(s=30)=>Gt(`/api/review/public?limit=${s}`),Vp=s=>Gt("/api/review/public",{method:"POST",body:JSON.stringify(s)});async function Yp(s){const f=new FormData;f.append("screenshot",s);let u;try{u=await fetch(`${Ac}/api/order/public/payment-proof`,{method:"POST",body:f})}catch{const w=new Error("Network error. Please check your connection and try again.");throw w.isNetworkError=!0,w}const z=await u.json().catch(()=>({}));if(!u.ok){const w=new Error(z.message||"Couldn't upload the screenshot. Please try again.");throw w.status=u.status,w}return z}const Kp="http://localhost:3000",Kt=s=>s?s.startsWith("http://")||s.startsWith("https://")?s:s.startsWith("/uploads/")?`${Kp}${s}`:s:"",ro="/assets/genz-pizza-land-logo-CQKpkaM4.jpg",Gp="/assets/sindbad-solution-logo-DhhzzCiL.png",qp=`
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
  background: rgba(255, 248, 239, 0.96);
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

/* ---------- Hero intro (compact) ---------- */

.v2-hero { padding-top: clamp(14px, 2vw, 28px); }
.v2-intro {
  display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between;
  gap: 16px 28px;
}
.v2-eyebrow {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 5px 12px; border-radius: 999px;
  background: #fff; border: 1px solid var(--line);
  font-weight: 700; font-size: .76rem; color: var(--flour-dim);
}
.v2-eyebrow i { width: 7px; height: 7px; border-radius: 50%; background: var(--basil); box-shadow: 0 0 0 3px rgba(26,158,86,.18); }
.v2-hero h1 {
  margin: 10px 0 4px;
  font-size: clamp(1.55rem, 2.6vw, 2.5rem);
  line-height: 1.1; letter-spacing: -0.03em; font-weight: 850;
  font-variation-settings: "wdth" 108;
}
.v2-hero h1 em { font-style: normal; color: var(--ember); }
.v2-hero p.lead { margin: 0; color: var(--flour-dim); font-size: clamp(.92rem, 1.1vw, 1.05rem); }
.v2-cta { display: flex; flex-wrap: wrap; gap: 10px; }
.v2-cta .gzp-btn { padding: 12px 22px; border-radius: 999px; font-size: .95rem; }
.v2-cta .gzp-btn-ghost { background: #fff; }
.v2-chips { list-style: none; margin: 14px 0 0; padding: 0; display: flex; flex-wrap: wrap; gap: 8px; }
.v2-chips li {
  padding: 6px 13px; border-radius: 999px; background: var(--cream-2);
  font-size: .82rem; font-weight: 650; color: var(--flour-dim);
}
.v2-chips li.rating { background: var(--gold); color: var(--flour); }

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

.gzp-navbar { background: rgba(255,248,239,.97); backdrop-filter: none; -webkit-backdrop-filter: none; border-bottom: 1px solid var(--line); }
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
`,Xp="/assets/jazzcash-raast-qr-BZ1REkAo.png",el="cod",tl="jazzcash",Va={codEnabled:!0,jazzcashEnabled:!0,merchantName:"GEN Z FOOD",tillId:"984661930",dialCode:"*786*10#",qrImage:""},Zp=5*1024*1024,Jp=/^[A-Za-z0-9]{6,30}$/,ef=/^[\p{L}\p{N} .+\-']{3,60}$/u;function tf(){const[s,f]=b.useState(""),[u,z]=b.useState(""),[w,P]=b.useState(""),[q,Y]=b.useState(""),[$,ge]=b.useState(""),[O,T]=b.useState(!1),[B,se]=b.useState(""),ae=b.useRef(0);b.useEffect(()=>()=>q&&URL.revokeObjectURL(q),[q]);const ee=b.useCallback(async oe=>{if(!oe)return;if(se(""),!["image/jpeg","image/png"].includes(oe.type)){se("Please choose a JPG or PNG screenshot.");return}if(oe.size>Zp){se("That screenshot is over 5 MB. Please choose a smaller image.");return}const he=++ae.current;Y(URL.createObjectURL(oe)),ge(oe.name),P(""),T(!0);try{const xe=await Yp(oe);he===ae.current&&P(xe.data.proofId)}catch(xe){he===ae.current&&(Y(""),ge(""),se(xe.message))}finally{he===ae.current&&T(!1)}},[]),F=b.useCallback(()=>{ae.current+=1,Y(""),ge(""),P(""),T(!1),se("")},[]),te=b.useCallback(()=>{f(""),z(""),F()},[F]),ve=Jp.test(s.replace(/\s+/g,"")),Ne=ef.test(u.trim().replace(/\s+/g," "));return{tid:s,setTid:f,sender:u,setSender:z,proofId:w,preview:q,fileName:$,uploading:O,uploadError:B,pickFile:ee,clearFile:F,reset:te,tidOk:ve,senderOk:Ne,ready:ve&&Ne&&!!w&&!O}}const rf=async s=>{try{return await navigator.clipboard.writeText(s),!0}catch{try{const f=document.createElement("textarea");f.value=s,f.setAttribute("readonly",""),f.style.cssText="position:fixed;opacity:0;top:0;left:0",document.body.appendChild(f),f.select();const u=document.execCommand("copy");return document.body.removeChild(f),u}catch{return!1}}},nf=({cfg:s,value:f,onChange:u})=>{const z=[s.codEnabled&&{id:el,title:"Cash on Delivery",sub:"Pay the rider when it arrives",icon:"💵"},s.jazzcashEnabled&&{id:tl,title:"Pay via JazzCash / Raast QR",sub:"Scan, pay & upload the screenshot",icon:"📱"}].filter(Boolean);return i.jsxs("fieldset",{className:"pay-methods",children:[i.jsx("legend",{children:"Payment method"}),z.map(w=>i.jsxs("label",{className:`pay-method${f===w.id?" is-on":""}`,children:[i.jsx("input",{type:"radio",name:"payMethod",value:w.id,checked:f===w.id,onChange:()=>u(w.id)}),i.jsx("span",{className:"pay-ico","aria-hidden":"true",children:w.icon}),i.jsxs("span",{className:"pay-text",children:[i.jsx("b",{children:w.title}),i.jsx("small",{children:w.sub})]}),i.jsx("span",{className:"pay-radio","aria-hidden":"true"})]},w.id))]})},of=({cfg:s,amountLabel:f,jazz:u})=>{const[z,w]=b.useState(!1),[P,q]=b.useState(""),Y=b.useRef(null),$=s.qrImage?Kt(s.qrImage):Xp,ge=async()=>{const T=await rf(s.tillId);w(T),T&&setTimeout(()=>w(!1),2e3)},O=async()=>{q("");try{const T=await fetch($);if(!T.ok)throw new Error("bad response");const B=await T.blob(),se=URL.createObjectURL(B),ae=document.createElement("a");ae.href=se,ae.download=`${s.merchantName.replace(/\s+/g,"-")}-JazzCash-QR.png`,document.body.appendChild(ae),ae.click(),ae.remove(),setTimeout(()=>URL.revokeObjectURL(se),1e3)}catch{window.open($,"_blank","noopener,noreferrer"),q("Opened in a new tab — press and hold the image to save it.")}};return i.jsxs("div",{className:"pay-card",children:[i.jsxs("div",{className:"pay-amount","aria-live":"polite",children:[i.jsx("span",{children:"Amount to pay"}),i.jsx("strong",{children:f}),i.jsx("small",{children:"Send exactly this amount so we can match your payment."})]}),i.jsxs("div",{className:"pay-grid",children:[i.jsxs("div",{className:"pay-qr",children:[i.jsx("img",{src:$,alt:`${s.merchantName} JazzCash and Raast payment QR code`,width:"340",height:"480"}),i.jsx("p",{children:"Scan with JazzCash, Easypaisa or any banking app"})]}),i.jsxs("div",{className:"pay-info",children:[i.jsxs("div",{className:"pay-row",children:[i.jsx("span",{children:"Merchant"}),i.jsx("b",{children:s.merchantName})]}),i.jsxs("div",{className:"pay-row",children:[i.jsx("span",{children:"Till ID"}),i.jsxs("div",{className:"pay-till",children:[i.jsx("b",{children:s.tillId}),i.jsx("button",{type:"button",className:"pay-mini",onClick:ge,children:z?"Copied ✓":"Copy"})]})]}),i.jsx("button",{type:"button",className:"pay-btn-ghost",onClick:O,children:"⬇ Download QR"}),P&&i.jsx("p",{className:"pay-hint",children:P}),i.jsxs("p",{className:"pay-dial",children:["Or dial ",i.jsx("b",{children:s.dialCode})," and enter the Till ID."]})]})]}),i.jsxs("div",{className:"pay-proof",children:[i.jsx("h4",{children:"After paying, add your payment details"}),i.jsxs("label",{className:"gzp-field",children:[i.jsx("span",{children:"Transaction ID (TID)"}),i.jsx("input",{value:u.tid,onChange:T=>u.setTid(T.target.value.replace(/[^A-Za-z0-9 ]/g,"").slice(0,34)),placeholder:"From your payment confirmation SMS / app",autoCapitalize:"characters",autoComplete:"off",required:!0,"aria-invalid":u.tid!==""&&!u.tidOk}),u.tid!==""&&!u.tidOk&&i.jsx("em",{className:"pay-err",children:"TID should be 6–30 letters or digits."})]}),i.jsxs("label",{className:"gzp-field",children:[i.jsx("span",{children:"Sender's name or mobile number"}),i.jsx("input",{value:u.sender,onChange:T=>u.setSender(T.target.value.slice(0,60)),placeholder:"Account holder name or 03001234567",autoComplete:"off",required:!0,"aria-invalid":u.sender!==""&&!u.senderOk}),u.sender!==""&&!u.senderOk&&i.jsx("em",{className:"pay-err",children:"Use 3–60 letters or digits, no special symbols."})]}),i.jsxs("div",{className:"gzp-field",children:[i.jsxs("span",{children:["Payment screenshot ",i.jsx("small",{children:"(JPG or PNG, up to 5 MB)"})]}),i.jsx("input",{ref:Y,type:"file",accept:"image/png,image/jpeg",className:"pay-file",onChange:T=>{var B;u.pickFile((B=T.target.files)==null?void 0:B[0]),T.target.value=""}}),u.preview?i.jsxs("div",{className:"pay-shot",children:[i.jsx("img",{src:u.preview,alt:"Your payment screenshot"}),i.jsxs("div",{children:[i.jsx("b",{children:u.fileName}),i.jsx("small",{className:u.proofId?"ok":"",children:u.uploading?"Uploading…":u.proofId?"Uploaded ✓":""}),i.jsx("button",{type:"button",className:"pay-mini",onClick:()=>{var T;u.clearFile(),(T=Y.current)==null||T.click()},children:"Change"})]})]}):i.jsx("button",{type:"button",className:"pay-drop",onClick:()=>{var T;return(T=Y.current)==null?void 0:T.click()},children:"📷 Choose screenshot"}),u.uploadError&&i.jsx("em",{className:"pay-err",role:"alert",children:u.uploadError})]}),i.jsx("p",{className:"pay-hint",children:"We'll check your payment and confirm your order shortly. Place Order unlocks once all three details are filled."})]})]})},lf=({order:s,whatsappHref:f})=>{const u=s==null?void 0:s.payment;return!u||u.method!=="JazzCash/Raast"?null:s.orderStatus==="Payment Pending Verification"?i.jsxs("div",{className:"pay-banner is-wait",children:[i.jsx("b",{children:"⏳ Payment under verification"}),i.jsx("p",{children:"Thanks! We'll verify your payment and confirm your order shortly. This page updates automatically."}),i.jsxs("small",{children:["TID ",u.tid]})]}):u.status==="Rejected"?i.jsxs("div",{className:"pay-banner is-bad",role:"alert",children:[i.jsx("b",{children:"✖ Payment not verified"}),i.jsx("p",{children:u.rejectionReason||"We couldn't confirm your payment."}),i.jsx("a",{className:"pay-btn-wa",href:f,target:"_blank",rel:"noopener noreferrer",children:"Message us on WhatsApp"})]}):u.status==="Verified"?i.jsxs("div",{className:"pay-banner is-ok",children:[i.jsx("b",{children:"✔ Payment verified"}),i.jsxs("p",{children:["Paid via JazzCash/Raast · TID ",u.tid]})]}):null},Bc={viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:1.8,strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",focusable:"false"},Uc=()=>i.jsx("svg",{viewBox:"0 0 24 24",fill:"currentColor","aria-hidden":"true",focusable:"false",children:i.jsx("path",{d:"M12 2.5l2.9 6.1 6.6.9-4.8 4.6 1.2 6.6L12 17.5l-5.9 3.2 1.2-6.6L2.5 9.5l6.6-.9L12 2.5z"})}),Pc=()=>i.jsxs("svg",{...Bc,children:[i.jsx("path",{d:"M12 20h9"}),i.jsx("path",{d:"M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4L16.5 3.5z"})]}),af=()=>i.jsx("svg",{...Bc,width:"20",height:"20",children:i.jsx("path",{d:"M6 6l12 12M18 6L6 18"})}),Tc=({value:s,label:f})=>i.jsx("span",{className:"v2-stars",role:"img","aria-label":f||`${s} out of 5 stars`,children:[1,2,3,4,5].map(u=>i.jsx("span",{className:u<=Math.round(s)?"":"off",style:{display:"inline-flex"},children:i.jsx(Uc,{})},u))}),Lc=["#E6392F","#d97706","#1a9e56","#2563eb","#7c3aed","#db2777","#0f766e"],sf=(s="")=>{let f=0;for(let u=0;u<s.length;u+=1)f=f*31+s.charCodeAt(u)>>>0;return Lc[f%Lc.length]},uf=s=>{const f=new Date(s).getTime();if(!f)return"";const u=Math.max(0,(Date.now()-f)/1e3);if(u<60)return"just now";const z=u/60;if(z<60)return`${Math.floor(z)} min ago`;const w=z/60;if(w<24)return`${Math.floor(w)} hour${Math.floor(w)===1?"":"s"} ago`;const P=w/24;if(P<30)return`${Math.floor(P)} day${Math.floor(P)===1?"":"s"} ago`;const q=P/30;return q<12?`${Math.floor(q)} month${Math.floor(q)===1?"":"s"} ago`:`${Math.floor(q/12)} year${Math.floor(q/12)===1?"":"s"} ago`},Rc=["","Poor","Fair","Good","Very good","Excellent"],Wc="gzp-reviewer-name",cf=()=>{try{return localStorage.getItem(Wc)||""}catch{return""}},df=s=>{try{localStorage.setItem(Wc,s)}catch{}},pf=({onOrder:s,onTrack:f,summary:u})=>i.jsx("section",{className:"v2-hero",children:i.jsxs("div",{className:"v2-wrap",children:[i.jsxs("div",{className:"v2-intro",children:[i.jsxs("div",{className:"v2-intro-copy",children:[i.jsxs("span",{className:"v2-eyebrow",children:[i.jsx("i",{})," Now delivering across Gojra"]}),i.jsxs("h1",{children:["Hot, cheesy & ",i.jsx("em",{children:"delivered"})," to your door"]}),i.jsx("p",{className:"lead",children:"Fresh pizzas, burgers and sides made to order."})]}),i.jsxs("div",{className:"v2-cta",children:[i.jsx("button",{type:"button",className:"gzp-btn gzp-btn-primary",onClick:s,children:"Order now"}),i.jsx("button",{type:"button",className:"gzp-btn gzp-btn-ghost",onClick:f,children:"Track my order"})]})]}),i.jsxs("ul",{className:"v2-chips","aria-label":"Highlights",children:[i.jsx("li",{children:"💵 Cash on delivery"}),i.jsx("li",{children:"📍 Live order tracking"}),i.jsx("li",{children:"🧩 Build your own deal"}),(u==null?void 0:u.total)>0&&i.jsxs("li",{className:"rating",children:["★ ",u.average," · ",u.total," review",u.total===1?"":"s"]})]})]})}),ff=[{icon:"🍕",title:"Made to order",text:"Every pizza is built fresh when you order — never sitting under a heat lamp."},{icon:"🛵",title:"Hot to your door",text:"Our riders deliver across Gojra, so it arrives the way it left the oven."},{icon:"💳",title:"Pay your way",text:"Cash on delivery, or scan the JazzCash / Raast QR at checkout. No sign-up needed."},{icon:"🧩",title:"Build your own deal",text:"Mix flavours, sizes and sides into a bundle that fits your crowd and budget."}],mf=()=>i.jsxs("section",{className:"v2-section",id:"section-why",children:[i.jsx("span",{className:"v2-kicker",children:"Why GenZ Pizza Land"}),i.jsx("h2",{className:"v2-title",children:"Good food, without the fuss"}),i.jsx("div",{className:"v2-features",children:ff.map(s=>i.jsxs("div",{className:"v2-feature",children:[i.jsx("div",{className:"v2-ico","aria-hidden":"true",children:s.icon}),i.jsx("h3",{children:s.title}),i.jsx("p",{children:s.text})]},s.title))})]}),gf=()=>i.jsxs("section",{className:"v2-how",id:"section-how",children:[i.jsx("span",{className:"v2-kicker",children:"How it works"}),i.jsx("h2",{className:"v2-title",style:{color:"#fff"},children:"Three steps to a full table"}),i.jsx("p",{className:"v2-sub",children:"From first tap to first bite, it takes a couple of minutes."}),i.jsxs("div",{className:"v2-steps",children:[i.jsxs("div",{className:"v2-step",children:[i.jsx("b",{children:"1"}),i.jsx("h3",{children:"Pick your food"}),i.jsx("p",{children:"Browse the menu and deals, choose your size and crust, and add everything to your order."})]}),i.jsxs("div",{className:"v2-step",children:[i.jsx("b",{children:"2"}),i.jsx("h3",{children:"Confirm your details"}),i.jsx("p",{children:"Enter your name, phone and address. No account, no card — just your delivery details."})]}),i.jsxs("div",{className:"v2-step",children:[i.jsx("b",{children:"3"}),i.jsx("h3",{children:"Track & enjoy"}),i.jsx("p",{children:"Follow your order live as the kitchen cooks it, then pay the rider in cash on arrival."})]})]})]}),hf=({value:s,onChange:f})=>{const[u,z]=b.useState(0),w=u||s;return i.jsxs("div",{className:"v2-starpick",role:"radiogroup","aria-label":"Your rating",onMouseLeave:()=>z(0),children:[[1,2,3,4,5].map(P=>i.jsx("button",{type:"button",role:"radio","aria-checked":s===P,"aria-label":`${P} star${P===1?"":"s"} — ${Rc[P]}`,className:P<=w?"on":"",onMouseEnter:()=>z(P),onFocus:()=>z(P),onBlur:()=>z(0),onClick:()=>f(P),children:i.jsx(Uc,{})},P)),i.jsx("span",{className:"lbl",children:Rc[w]||"Tap a star"})]})},vf=({onClose:s,onSubmitted:f})=>{const[u,z]=b.useState(cf),[w,P]=b.useState(0),[q,Y]=b.useState(""),[$,ge]=b.useState(""),[O,T]=b.useState(""),[B,se]=b.useState(""),[ae,ee]=b.useState(!1),[F,te]=b.useState(""),[ve,Ne]=b.useState(!1);b.useEffect(()=>{const oe=xe=>xe.key==="Escape"&&s();window.addEventListener("keydown",oe);const he=document.body.style.overflow;return document.body.style.overflow="hidden",()=>{window.removeEventListener("keydown",oe),document.body.style.overflow=he}},[s]);const me=async oe=>{if(oe.preventDefault(),!ae){if(!u.trim())return te("Please enter your name.");if(!w)return te("Please choose a star rating.");if(O.trim().length<10)return te("Please write at least a few words about your experience.");te(""),ee(!0);try{const he=await Vp({name:u,rating:w,dish:q,title:$,comment:O,website:B});df(u.trim()),Ne(!0),f(he==null?void 0:he.data)}catch(he){te(he.message||"Could not send your review. Please try again.")}finally{ee(!1)}}};return i.jsx("div",{className:"v2-rvm-overlay",onMouseDown:oe=>oe.target===oe.currentTarget&&s(),role:"presentation",children:i.jsx("div",{className:"v2-rvm",role:"dialog","aria-modal":"true","aria-label":"Write a review",children:ve?i.jsxs("div",{className:"v2-thanks",children:[i.jsx("div",{className:"big","aria-hidden":"true",children:"🎉"}),i.jsx("h3",{children:"Thank you!"}),i.jsx("p",{children:"Your review is live. It really helps other hungry people in Gojra."}),i.jsx("button",{type:"button",className:"gzp-btn gzp-btn-primary gzp-btn-block",onClick:s,children:"Done"})]}):i.jsxs(i.Fragment,{children:[i.jsxs("div",{className:"v2-rvm-head",children:[i.jsxs("div",{children:[i.jsx("h3",{children:"Write a review"}),i.jsx("p",{children:"Tell us how we did — it only takes a minute."})]}),i.jsx("button",{type:"button",className:"gzp-icon-btn",onClick:s,"aria-label":"Close",children:i.jsx(af,{})})]}),i.jsxs("form",{className:"v2-rvm-form",onSubmit:me,noValidate:!0,children:[i.jsxs("div",{children:[i.jsx("div",{style:{fontWeight:700,fontSize:".86rem",marginBottom:6},children:"Your rating"}),i.jsx(hf,{value:w,onChange:P})]}),i.jsxs("label",{className:"f",children:[i.jsx("span",{children:"Your name"}),i.jsx("input",{type:"text",value:u,maxLength:60,autoComplete:"name",placeholder:"e.g. Ayesha K.",onChange:oe=>z(oe.target.value)})]}),i.jsxs("label",{className:"f",children:[i.jsxs("span",{children:["What did you order? ",i.jsx("small",{children:"(optional)"})]}),i.jsx("input",{type:"text",value:q,maxLength:80,placeholder:"e.g. Fajita pizza",onChange:oe=>Y(oe.target.value)})]}),i.jsxs("label",{className:"f",children:[i.jsxs("span",{children:["Headline ",i.jsx("small",{children:"(optional)"})]}),i.jsx("input",{type:"text",value:$,maxLength:100,placeholder:"Sum it up in a few words",onChange:oe=>ge(oe.target.value)})]}),i.jsxs("label",{className:"f",children:[i.jsx("span",{children:"Your review"}),i.jsx("textarea",{value:O,maxLength:1200,placeholder:"How was the food, the delivery, the service?",onChange:oe=>T(oe.target.value)}),i.jsxs("span",{className:"v2-count",children:[O.length,"/1200"]})]}),i.jsx("input",{className:"v2-hp",type:"text",tabIndex:-1,autoComplete:"off","aria-hidden":"true",value:B,onChange:oe=>se(oe.target.value)}),F&&i.jsx("p",{className:"v2-form-error",role:"alert",children:F}),i.jsxs("div",{className:"v2-rvm-actions",children:[i.jsx("button",{type:"button",className:"gzp-btn gzp-btn-ghost",onClick:s,children:"Cancel"}),i.jsx("button",{type:"submit",className:"gzp-btn gzp-btn-primary",disabled:ae,children:ae?"Sending…":"Post review"})]})]})]})})})},xf=({onSummary:s})=>{const[f,u]=b.useState([]),[z,w]=b.useState({total:0,average:0,distribution:{}}),[P,q]=b.useState(!0),[Y,$]=b.useState(""),[ge,O]=b.useState(!1),[T,B]=b.useState(6),se=b.useCallback(async()=>{var F,te;try{const ve=await Qp(60);u(((F=ve.data)==null?void 0:F.reviews)||[]),w(((te=ve.data)==null?void 0:te.summary)||{total:0,average:0,distribution:{}}),$("")}catch(ve){$(ve.message||"Could not load reviews.")}finally{q(!1)}},[]);b.useEffect(()=>{se()},[se]),b.useEffect(()=>{s==null||s(z)},[z,s]);const ae=b.useMemo(()=>[5,4,3,2,1].map(F=>{var ve;const te=((ve=z.distribution)==null?void 0:ve[F])||0;return{n:F,count:te,pct:z.total?Math.round(te/z.total*100):0}}),[z]),ee=()=>O(!0);return i.jsxs("section",{className:"v2-section",id:"section-reviews",children:[i.jsxs("div",{className:"v2-reviews-head",children:[i.jsxs("div",{children:[i.jsx("span",{className:"v2-kicker",children:"Reviews"}),i.jsx("h2",{className:"v2-title",children:"What Gojra is saying"})]}),i.jsxs("button",{type:"button",className:"v2-write inline",onClick:ee,children:[i.jsx(Pc,{})," Write a Review"]})]}),i.jsxs("div",{className:"v2-rv-layout",children:[i.jsxs("aside",{className:"v2-rv-summary","aria-label":"Rating summary",children:[i.jsxs("div",{className:"v2-rv-score",children:[i.jsx("b",{children:z.total?z.average.toFixed(1):"–"}),i.jsxs("div",{children:[i.jsx(Tc,{value:z.average}),i.jsx("small",{children:z.total?`${z.total} review${z.total===1?"":"s"}`:"No reviews yet"})]})]}),i.jsx("div",{className:"v2-bars",children:ae.map(F=>i.jsxs("div",{className:"v2-bar",children:[i.jsxs("span",{children:[F.n,"★"]}),i.jsx("i",{children:i.jsx("span",{style:{width:`${F.pct}%`}})}),i.jsx("em",{children:F.count})]},F.n))}),i.jsxs("button",{type:"button",className:"v2-write",onClick:ee,children:[i.jsx(Pc,{})," Write a Review"]})]}),i.jsxs("div",{children:[i.jsxs("div",{className:"v2-rv-list",children:[P&&i.jsx("div",{className:"v2-rv-empty",children:"Loading reviews…"}),!P&&Y&&f.length===0&&i.jsxs("div",{className:"v2-rv-empty",children:[i.jsx("b",{children:"Couldn't load reviews"}),Y,i.jsx("div",{style:{marginTop:14},children:i.jsx("button",{type:"button",className:"gzp-btn gzp-btn-ghost",onClick:()=>{q(!0),se()},children:"Try again"})})]}),!P&&!Y&&f.length===0&&i.jsxs("div",{className:"v2-rv-empty",children:[i.jsx("span",{"aria-hidden":"true",style:{fontSize:"2rem"},children:"⭐"}),i.jsx("b",{children:"Be the first to review"}),"Ate with us? Tell others what you thought."]}),f.slice(0,T).map(F=>i.jsxs("article",{className:"v2-rv",children:[i.jsxs("div",{className:"v2-rv-top",children:[i.jsx("div",{className:"v2-avatar",style:{background:sf(F.name)},"aria-hidden":"true",children:(F.name||"?").trim().charAt(0).toUpperCase()}),i.jsxs("div",{children:[i.jsx("strong",{children:F.name}),i.jsx("span",{children:uf(F.createdAt)})]})]}),i.jsx(Tc,{value:F.rating}),F.title&&i.jsx("h4",{children:F.title}),i.jsx("p",{children:F.comment}),F.dish&&i.jsxs("span",{className:"v2-rv-dish",children:["🍽 ",F.dish]})]},F._id))]}),f.length>T&&i.jsx("button",{type:"button",className:"gzp-btn gzp-btn-ghost v2-more",onClick:()=>B(F=>F+6),children:"Show more reviews"})]})]}),ge&&i.jsx(vf,{onClose:()=>O(!1),onSubmitted:()=>{se()}})]})},yf=({whatsappLink:s,onTrack:f})=>i.jsxs("section",{className:"v2-contact",id:"section-contact",children:[i.jsxs("div",{className:"v2-panel warm",children:[i.jsx("span",{className:"v2-kicker",children:"Questions?"}),i.jsx("h2",{className:"v2-title",style:{color:"#fff"},children:"Talk to us on WhatsApp"}),i.jsx("p",{className:"v2-sub",children:"Special requests, party orders or a question about your delivery — message the shop directly."}),i.jsx("a",{className:"gzp-btn",href:s,target:"_blank",rel:"noopener noreferrer",children:"Chat on WhatsApp"})]}),i.jsxs("div",{className:"v2-panel",children:[i.jsx("span",{className:"v2-kicker",children:"Good to know"}),i.jsxs("ul",{className:"v2-facts",children:[i.jsxs("li",{children:[i.jsx("span",{"aria-hidden":"true",children:"📍"})," Delivering across Gojra"]}),i.jsxs("li",{children:[i.jsx("span",{"aria-hidden":"true",children:"💵"})," Cash on delivery or JazzCash / Raast QR"]}),i.jsxs("li",{children:[i.jsx("span",{"aria-hidden":"true",children:"⏱"})," Live order tracking from the kitchen to your door"]})]}),i.jsx("button",{type:"button",className:"gzp-btn gzp-btn-ghost",onClick:f,children:"Track an order"})]})]}),wf=({taxRatePercent:s,onNavigate:f,onTrack:u})=>i.jsx("footer",{className:"v2-footer",children:i.jsxs("div",{className:"v2-wrap",children:[i.jsxs("div",{className:"v2-footer-grid",children:[i.jsxs("div",{children:[i.jsxs("div",{className:"brand",children:[i.jsx("img",{src:ro,alt:""})," GenZ Pizza Land"]}),i.jsxs("p",{children:["Fresh pizzas, burgers and sides, delivered hot across Gojra. Prices are in rupees;"," ",s,"% tax is added at checkout. Pay cash on delivery or by JazzCash / Raast QR."]})]}),i.jsxs("div",{children:[i.jsx("h4",{children:"Explore"}),i.jsxs("ul",{children:[i.jsx("li",{children:i.jsx("button",{type:"button",onClick:()=>f("menu"),children:"Menu"})}),i.jsx("li",{children:i.jsx("button",{type:"button",onClick:()=>f("deals"),children:"Deals"})}),i.jsx("li",{children:i.jsx("button",{type:"button",onClick:()=>f("reviews"),children:"Reviews"})})]})]}),i.jsxs("div",{children:[i.jsx("h4",{children:"Help"}),i.jsxs("ul",{children:[i.jsx("li",{children:i.jsx("button",{type:"button",onClick:u,children:"Track an order"})}),i.jsx("li",{children:i.jsx("button",{type:"button",onClick:()=>f("how"),children:"How it works"})}),i.jsx("li",{children:i.jsx("button",{type:"button",onClick:()=>f("contact"),children:"Contact us"})})]})]})]}),i.jsxs("div",{className:"v2-footer-bottom",children:[i.jsxs("span",{children:["© ",new Date().getFullYear()," GenZ Pizza Land. All rights reserved."]}),i.jsxs("span",{className:"credit",children:["Developed by ",i.jsx("img",{src:Gp,alt:""})," ",i.jsx("strong",{children:"Sindbad Solution"})]})]})]})}),to={enabled:!0,minItems:3,discount3:15,discount4:17,discount5Plus:20,description:"Pick any 3 or more items from our menu — pizzas, burgers, wings, drinks, anything. The more you add, the more you save. No codes, the discount applies automatically."},Ya=s=>{const f=(z,w)=>typeof z=="number"&&!Number.isNaN(z)?z:w,u=s&&typeof s=="object"?s:{};return{enabled:typeof u.enabled=="boolean"?u.enabled:to.enabled,minItems:Math.max(1,Math.round(f(u.minItems,to.minItems))),discount3:f(u.discount3,to.discount3),discount4:f(u.discount4,to.discount4),discount5Plus:f(u.discount5Plus,to.discount5Plus),description:typeof u.description=="string"?u.description:to.description}},ll=(s,f)=>!f.enabled||s<f.minItems?0:s>=5?f.discount5Plus:s===4?f.discount4:f.discount3,_t=s=>`${Number.isInteger(s)?s:Number(s.toFixed(1))}%`,rl=s=>{const f=Number(s)||0;return`Rs ${f.toLocaleString("en-PK",{minimumFractionDigits:Number.isInteger(f)?0:2,maximumFractionDigits:2})}`},Hc=(s,f)=>{const u=f.minItems-s;if(s===0)return`Pick ${f.minItems} items to unlock ${_t(f.discount3)} off`;if(u>0)return`Add ${u} more item${u===1?"":"s"} to unlock ${_t(f.discount3)} off`;const z=ll(s,f),w=s>=5?null:s+1,P=w?ll(w,f):null;return P&&P>z?`${_t(z)} off unlocked — add 1 more item for ${_t(P)} off`:s>=5?`Best discount unlocked — ${_t(z)} off your picks`:`${_t(z)} off unlocked`},bf=`
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
`,zf=({cfg:s,pickedCount:f,onStart:u})=>i.jsx("section",{className:"gzp-byo-section","aria-label":"Build your own deal",children:i.jsx("div",{className:"gzp-shell",children:i.jsxs("div",{className:"gzp-byo-banner",children:[i.jsxs("div",{style:{position:"relative",zIndex:1},children:[i.jsx("span",{className:"gzp-byo-eyebrow",children:"🎯 Make it yours"}),i.jsxs("h2",{children:["Build your ",i.jsx("em",{children:"own deal"})]}),s.description&&i.jsx("p",{children:s.description}),i.jsx("button",{type:"button",className:"gzp-btn gzp-btn-primary",onClick:u,children:f>0?`Edit your deal (${f} item${f===1?"":"s"})`:"Start building"})]}),i.jsxs("div",{className:"gzp-byo-tiers",children:[i.jsxs("div",{className:"gzp-byo-tier",children:[i.jsx("b",{children:_t(s.discount3)}),i.jsx("small",{children:"off"}),i.jsxs("span",{children:[s.minItems," items"]})]}),i.jsxs("div",{className:"gzp-byo-tier",children:[i.jsx("b",{children:_t(s.discount4)}),i.jsx("small",{children:"off"}),i.jsx("span",{children:"4 items"})]}),i.jsxs("div",{className:"gzp-byo-tier is-best",children:[i.jsx("b",{children:_t(s.discount5Plus)}),i.jsx("small",{children:"off"}),i.jsx("span",{children:"5+ items"})]})]})]})})}),kf=s=>{const f=[];return((s==null?void 0:s.variants)||[]).forEach(u=>{u.size&&!f.includes(u.size)&&f.push(u.size)}),f},jf=(s,f)=>{const u=[];return((s==null?void 0:s.variants)||[]).forEach(z=>{z.size===f&&z.crust&&!u.includes(z.crust)&&u.push(z.crust)}),u},Qc=(s,f,u)=>((s==null?void 0:s.variants)||[]).find(z=>z.size===f&&(z.crust||"")===(u||""))||null,Vc=(s,f="",u="")=>`${s}:${f||""}||${u||""}`,Sf=({dish:s,picks:f,dishQty:u,stockLeft:z,onAdd:w,onRemove:P})=>{const q=b.useMemo(()=>kf(s),[s]),Y=q.length>0,[$,ge]=b.useState(q[0]||""),O=b.useMemo(()=>jf(s,$),[s,$]),[T,B]=b.useState(O[0]||""),[se,ae]=b.useState(!1);b.useEffect(()=>{O.length>0&&!O.includes(T)?B(O[0]):O.length===0&&T!==""&&B("")},[$]);const ee=Y?Qc(s,$,T):null,F=Y?(s.variants||[]).reduce((re,He)=>re===null||He.price<re.price?He:re,null):null,te=Y?(ee==null?void 0:ee.price)??(F==null?void 0:F.price)??s.price:s.price,ve=Vc(s._id,$,T),Ne=f[ve]||0,me=u,oe=typeof s.availableQty=="number"&&z<=0&&me===0,he=typeof s.availableQty=="number"&&z<=0,xe=(!Y||!!ee)&&!he,Ce=Kt(s.image);return i.jsxs("div",{className:`gzp-byo-tile${me>0?" is-picked":""}`,children:[i.jsxs("div",{className:"gzp-byo-tile-media",children:[Ce&&!se?i.jsx("img",{src:Ce,alt:s.name,loading:"lazy",onError:()=>ae(!0)}):i.jsx("span",{"aria-hidden":"true",children:s.icon||"🍽️"}),me>0&&i.jsxs("span",{className:"gzp-byo-badge",children:["×",me]})]}),i.jsxs("div",{className:"gzp-byo-tile-body",children:[i.jsx("h4",{children:s.name}),i.jsxs("div",{className:"gzp-byo-price",children:[Y&&i.jsx("small",{children:"From"}),rl(te)]}),Y&&i.jsxs("div",{className:"gzp-byo-selects",children:[i.jsx("select",{className:"gzp-select",value:$,onChange:re=>ge(re.target.value),"aria-label":`Size for ${s.name}`,children:q.map(re=>i.jsx("option",{value:re,children:re},re))}),O.length>0&&i.jsx("select",{className:"gzp-select",value:T,onChange:re=>B(re.target.value),"aria-label":`Crust for ${s.name}`,children:O.map(re=>i.jsx("option",{value:re,children:re},re))})]}),i.jsx("div",{className:"gzp-byo-tile-foot",children:Ne>0?i.jsxs("div",{className:"gzp-stepper",style:{width:"100%",justifyContent:"space-between"},children:[i.jsx("button",{type:"button",onClick:()=>P(ve),"aria-label":`Remove one ${s.name}`,children:"−"}),i.jsx("span",{"aria-live":"polite",children:Ne}),i.jsx("button",{type:"button",disabled:!xe,onClick:()=>w(s,$,T),"aria-label":`Add one more ${s.name}`,children:"+"})]}):i.jsx("button",{type:"button",className:"gzp-byo-add",disabled:!xe,onClick:()=>w(s,$,T),children:oe?"Sold out":"+ Add"})})]})]})},Nf=({cfg:s,dishes:f,categories:u,initialPicks:z,getOtherQty:w,onClose:P,onConfirm:q})=>{const[Y,$]=b.useState(()=>({...z||{}})),[ge,O]=b.useState("all");b.useEffect(()=>{const I=document.body.style.overflow;document.body.style.overflow="hidden";const ne=S=>S.key==="Escape"&&P();return window.addEventListener("keydown",ne),()=>{document.body.style.overflow=I,window.removeEventListener("keydown",ne)}},[P]);const T=b.useMemo(()=>{const I={};return f.forEach(ne=>{I[ne._id]=ne}),I},[f]),B=b.useMemo(()=>{const I=new Map;f.forEach(ce=>{var L;const fe=((L=ce.category)==null?void 0:L._id)||ce.category||"other";I.has(fe)||I.set(fe,[]),I.get(fe).push(ce)});const ne=u.filter(ce=>(I.get(ce._id)||[]).length>0).map(ce=>({id:ce._id,name:ce.name,items:I.get(ce._id)})),S=new Set(u.map(ce=>ce._id)),A=f.filter(ce=>{var fe;return!S.has(((fe=ce.category)==null?void 0:fe._id)||ce.category)});return A.length&&ne.push({id:"other",name:"More to eat",items:A}),ne},[f,u]),se=I=>Object.entries(Y).reduce((ne,[S,A])=>S.startsWith(`${I}:`)?ne+A:ne,0),ae=I=>typeof I.availableQty=="number"?I.availableQty-se(I._id)-(w?w(I._id):0):1/0,ee=(I,ne,S)=>{if(ae(I)<=0)return;const A=Vc(I._id,ne,S);$(ce=>({...ce,[A]:(ce[A]||0)+1}))},F=I=>$(ne=>{const S={...ne,[I]:Math.max(0,(ne[I]||0)-1)};return S[I]===0&&delete S[I],S}),{count:te,gross:ve}=b.useMemo(()=>{let I=0,ne=0;return Object.entries(Y).forEach(([S,A])=>{const[ce,fe="||"]=S.split(/:(.+)/),L=T[ce];if(!L)return;const[H,D]=fe.split("||"),h=H?Qc(L,H,D):null;I+=A,ne+=(h?h.price:L.price)*A}),{count:I,gross:ne}},[Y,T]),Ne=ll(te,s),me=Math.round(ve*Ne/100),oe=ve-me,he=te>=s.minItems,xe=[{n:s.minItems,label:_t(s.discount3)},{n:4,label:_t(s.discount4)},{n:5,label:_t(s.discount5Plus)}].filter((I,ne,S)=>ne===0||I.n>S[ne-1].n),Ce=xe[xe.length-1].n,re=I=>`${I/Ce*100}%`,He=`${Math.min(te,Ce)/Ce*100}%`,Le=ge==="all"?B:B.filter(I=>I.id===ge);return i.jsx("div",{className:"gzp-byo-overlay",onClick:P,children:i.jsxs("div",{className:"gzp-byo-panel",onClick:I=>I.stopPropagation(),role:"dialog","aria-modal":"true","aria-label":"Build your own deal",children:[i.jsxs("div",{className:"gzp-byo-head",children:[i.jsxs("div",{children:[i.jsx("h2",{children:"🎯 Build your own deal"}),i.jsxs("p",{children:["Choose at least ",s.minItems," items — your discount grows with every item."]})]}),i.jsx("button",{className:"gzp-icon-btn",type:"button",onClick:P,"aria-label":"Close",children:"✕"})]}),i.jsxs("div",{className:"gzp-byo-progress",children:[i.jsxs("div",{className:"gzp-byo-track",role:"progressbar","aria-valuemin":0,"aria-valuemax":Ce,"aria-valuenow":Math.min(te,Ce),children:[i.jsx("div",{className:"gzp-byo-fill",style:{width:He}}),xe.map(I=>i.jsxs("div",{className:`gzp-byo-mark${te>=I.n?" is-hit":""}`,style:{left:re(I.n)},children:[I.n===Ce&&I.n>=5?`${I.n}+`:I.n,i.jsxs("span",{children:[I.label," off"]})]},I.n))]}),i.jsx("p",{className:`gzp-byo-nudge${he?" is-ok":""}`,children:Hc(te,s)})]}),i.jsxs("div",{className:"gzp-byo-cats",role:"tablist","aria-label":"Menu categories",children:[i.jsx("button",{type:"button",className:`gzp-byo-cat${ge==="all"?" is-active":""}`,onClick:()=>O("all"),children:"All"}),B.map(I=>i.jsx("button",{type:"button",className:`gzp-byo-cat${ge===I.id?" is-active":""}`,onClick:()=>O(I.id),children:I.name},I.id))]}),i.jsx("div",{className:"gzp-byo-body",children:Le.map(I=>i.jsxs("div",{className:"gzp-byo-group",children:[i.jsx("h3",{children:I.name}),i.jsx("div",{className:"gzp-byo-grid",children:I.items.map(ne=>i.jsx(Sf,{dish:ne,picks:Y,dishQty:se(ne._id),stockLeft:ae(ne),onAdd:ee,onRemove:F},ne._id))})]},I.id))}),i.jsxs("div",{className:"gzp-byo-foot",children:[i.jsxs("div",{className:"gzp-byo-sum",children:[i.jsxs("small",{children:[te," item",te===1?"":"s"," picked"]}),i.jsxs("div",{children:[i.jsx("b",{children:rl(oe)}),me>0&&i.jsx("s",{children:rl(ve)}),me>0&&i.jsxs("em",{children:["You save ",rl(me)]})]})]}),i.jsx("button",{type:"button",className:"gzp-btn gzp-btn-primary",disabled:!he,onClick:()=>q(Y),children:he?`Add to my order · ${_t(Ne)} off`:`Pick ${s.minItems-te} more to continue`})]})]})})},Cf="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,400..900&family=Hanken+Grotesk:wght@400..800&display=swap",Ef=`
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
`;(()=>{if(typeof document>"u")return;if(!document.getElementById("gzp-fonts")){const f=document.createElement("link");f.rel="preconnect",f.href="https://fonts.googleapis.com",document.head.appendChild(f);const u=document.createElement("link");u.rel="preconnect",u.href="https://fonts.gstatic.com",u.crossOrigin="",document.head.appendChild(u);const z=document.createElement("link");z.id="gzp-fonts",z.rel="stylesheet",z.href=Cf,document.head.appendChild(z)}let s=document.getElementById("gzp-styles");if(s||(s=document.createElement("style"),s.id="gzp-styles",document.head.appendChild(s)),s.textContent=Ef+bf+qp,!document.querySelector('meta[name="theme-color"]')){const f=document.createElement("meta");f.name="theme-color",f.content="#FFF8EF",document.head.appendChild(f)}})();const _f=16,Pf=["Pending","Accepted","Preparing","Ready to Deliver","Completed"],Tf=["Payment Pending Verification","Accepted","Preparing","Ready to Deliver","Completed"],es="Payment Pending Verification",Mc={[es]:"Verifying your payment",Pending:"Order received",Accepted:"Accepted by the kitchen",Preparing:"Preparing your food","Ready to Deliver":"Out for delivery",Completed:"Delivered",Cancelled:"Cancelled"},Lf={[es]:"Verifying your payment",Pending:"We've got your order",Accepted:"The kitchen is on it",Preparing:"Your food is cooking","Ready to Deliver":"On the way to you",Completed:"Delivered — enjoy",Cancelled:"Order cancelled"},Zi="deals",Yc="923259061006",Kc=`https://wa.me/${Yc}?text=${encodeURIComponent("Hello GenZ Pizza Land, I have an inquiry.")}`,Rf=1e4,pt=s=>{const f=Number(s)||0;return`Rs ${f.toLocaleString("en-PK",{minimumFractionDigits:Number.isInteger(f)?0:2,maximumFractionDigits:2})}`},qa=s=>{const f=[];return((s==null?void 0:s.variants)||[]).forEach(u=>{u.size&&!f.includes(u.size)&&f.push(u.size)}),f},nl=(s,f)=>{const u=[];return((s==null?void 0:s.variants)||[]).forEach(z=>{z.size===f&&z.crust&&!u.includes(z.crust)&&u.push(z.crust)}),u},Xa=(s,f,u)=>((s==null?void 0:s.variants)||[]).find(z=>z.size===f&&(z.crust||"")===(u||""))||null,Gc=s=>((s==null?void 0:s.variants)||[]).reduce((f,u)=>f===null||u.price<f.price?u:f,null),Ji=s=>{let f=s.replace(/[^\d+]/g,"");return f=f[0]==="+"?"+"+f.slice(1).replace(/\+/g,""):f.replace(/\+/g,""),f.slice(0,14)},Ic=s=>{const f=s.replace(/\D/g,"");return f.length>=10&&f.length<=13},no={width:20,height:20,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:1.8,strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",focusable:"false"},qc=s=>i.jsxs("svg",{...no,...s,children:[i.jsx("circle",{cx:"11",cy:"11",r:"7"}),i.jsx("path",{d:"m20 20-3.2-3.2"})]}),Mf=s=>i.jsxs("svg",{...no,...s,children:[i.jsx("path",{d:"M6 8h12l-1 11H7L6 8Z"}),i.jsx("path",{d:"M9.5 8V6.5a2.5 2.5 0 0 1 5 0V8"})]}),If=s=>i.jsx("svg",{...no,strokeWidth:2.4,...s,children:i.jsx("path",{d:"M12 5v14M5 12h14"})}),Ka=({dir:s="right",...f})=>i.jsx("svg",{...no,strokeWidth:2,...f,children:i.jsx("path",{d:s==="left"?"m14.5 5-7 7 7 7":"m9.5 5 7 7-7 7"})}),Xc=s=>i.jsxs("svg",{...no,...s,children:[i.jsx("path",{d:"M3 7h11v9H3zM14 10h4l3 3v3h-7z"}),i.jsx("circle",{cx:"7",cy:"18",r:"1.6"}),i.jsx("circle",{cx:"17.5",cy:"18",r:"1.6"})]}),Of=({filled:s,...f})=>i.jsx("svg",{...no,strokeWidth:2,fill:s?"currentColor":"none",...f,children:i.jsx("path",{d:"M12 20.5s-7.3-4.6-9.9-9.1C.5 8 1.9 4.6 5.1 3.6c2-.6 4.1.1 5.4 1.8l1.5 2 1.5-2c1.3-1.7 3.4-2.4 5.4-1.8 3.2 1 4.6 4.4 3 7.8-2.6 4.5-9.9 9.1-9.9 9.1Z"})}),ol=({price:s,originalPrice:f,from:u})=>i.jsxs("p",{className:"gzp-price",children:[u&&i.jsx("span",{className:"gzp-price-from",children:"From"}),pt(s),f>s&&i.jsx("s",{children:pt(f)})]}),Za=({src:s,alt:f,icon:u,className:z})=>{const[w,P]=b.useState(!1);return b.useEffect(()=>P(!1),[s]),s&&!w?i.jsx("img",{src:s,alt:f,className:z,loading:"lazy",onError:()=>P(!0)}):i.jsx("div",{className:"gzp-media-fallback",children:u||"🍽️"})},fn=s=>typeof s!="number"?null:s<=0?{text:"Sold out",out:!0}:s<=5?{text:`Only ${s} left`,out:!1}:null,Ff=({slides:s,onSlideClick:f})=>{var ge;const[u,z]=b.useState(0),[w,P]=b.useState(!1),q=b.useRef(typeof window<"u"&&((ge=window.matchMedia)==null?void 0:ge.call(window,"(prefers-reduced-motion: reduce)").matches)).current;if(b.useEffect(()=>{if(s.length<=1||w||q)return;const O=setInterval(()=>z(T=>(T+1)%s.length),4200);return()=>clearInterval(O)},[s.length,w,q]),b.useEffect(()=>{u>=s.length&&z(0)},[s.length,u]),s.length===0)return i.jsx("div",{className:"gzp-slider","aria-hidden":"true",children:i.jsx("div",{className:"gzp-slider-fallback",children:i.jsx("img",{src:ro,alt:""})})});const Y=s[u],$=!!f;return i.jsxs("div",{className:"gzp-slider",onMouseEnter:()=>P(!0),onMouseLeave:()=>P(!1),onTouchStart:()=>P(!0),onTouchEnd:()=>P(!1),onClick:$?()=>f(Y):void 0,role:$?"button":void 0,tabIndex:$?0:void 0,onKeyDown:$?O=>{(O.key==="Enter"||O.key===" ")&&f(Y)}:void 0,children:[s.map((O,T)=>i.jsx("img",{src:O.url,alt:O.alt||"","aria-hidden":T!==u||void 0,className:`gzp-slider-img${T===u?" is-active":""}`},O.url+T)),s.length>1&&i.jsx("div",{className:"gzp-slider-dots",role:"tablist","aria-label":"Featured photos",children:s.map((O,T)=>i.jsx("button",{type:"button",role:"tab","aria-selected":T===u,"aria-label":`Show photo ${T+1} of ${s.length}`,className:`gzp-slider-dot${T===u?" is-active":""}`,onClick:B=>{B.stopPropagation(),z(T)}},T))})]})},Df=()=>i.jsxs("svg",{viewBox:"0 0 140 140",className:"gzp-thankyou-mascot","aria-hidden":"true",children:[i.jsxs("g",{stroke:"#e0b84a",strokeWidth:"3",strokeLinecap:"round",fill:"none",opacity:"0.75",children:[i.jsx("path",{d:"M52 20 C 47 12, 57 9, 53 1"}),i.jsx("path",{d:"M70 20 C 65 12, 75 9, 71 1"}),i.jsx("path",{d:"M88 20 C 83 12, 93 9, 89 1"})]}),i.jsx("path",{d:"M20 32 L120 32 L70 132 Z",fill:"#ffcf5c",stroke:"#e0a92e",strokeWidth:"4",strokeLinejoin:"round"}),i.jsx("path",{d:"M20 32 Q70 47 120 32",fill:"none",stroke:"#e0a92e",strokeWidth:"4",strokeLinecap:"round"}),i.jsx("circle",{cx:"52",cy:"58",r:"6",fill:"#e6503d"}),i.jsx("circle",{cx:"88",cy:"62",r:"6",fill:"#e6503d"}),i.jsx("circle",{cx:"70",cy:"90",r:"6",fill:"#e6503d"}),i.jsx("circle",{cx:"56",cy:"76",r:"5.5",fill:"#3a2b1a"}),i.jsx("circle",{cx:"84",cy:"76",r:"5.5",fill:"#3a2b1a"}),i.jsx("path",{d:"M60 96 Q70 104 80 96",stroke:"#3a2b1a",strokeWidth:"3.5",fill:"none",strokeLinecap:"round"})]}),$f=({order:s,onTrack:f,onContinue:u})=>{const z=String((s==null?void 0:s._id)||"").slice(-6).toUpperCase();return i.jsx("div",{className:"gzp-thankyou-overlay",role:"dialog","aria-modal":"true","aria-label":"Order confirmed",children:i.jsxs("div",{className:"gzp-thankyou-card",children:[i.jsx("span",{className:"gzp-thankyou-sticker tl","aria-hidden":"true",children:"🎉"}),i.jsx("span",{className:"gzp-thankyou-sticker tr","aria-hidden":"true",children:"🍕"}),i.jsx("span",{className:"gzp-thankyou-sticker bl","aria-hidden":"true",children:"🧀"}),i.jsx("span",{className:"gzp-thankyou-sticker br","aria-hidden":"true",children:"🎊"}),i.jsx("div",{className:"gzp-thankyou-badge",children:i.jsx("img",{src:ro,alt:"GenZ Pizza Land"})}),i.jsx(Df,{}),i.jsx("h2",{className:"gzp-thankyou-title",children:"Thank you! 🎉"}),i.jsx("p",{className:"gzp-thankyou-sub",children:(s==null?void 0:s.orderStatus)===es?"We'll verify your payment and confirm your order shortly.":"Your order's in and the kitchen's already looking at it."}),z&&i.jsxs("span",{className:"gzp-thankyou-pill",children:["Order #",z]}),i.jsx("button",{type:"button",className:"gzp-thankyou-track-btn",onClick:f,children:"Track My Order"}),i.jsx("button",{type:"button",className:"gzp-thankyou-link",onClick:u,children:"Click for more order"})]})})},il=({qty:s,onAdd:f,onRemove:u,size:z,label:w})=>i.jsxs("div",{className:`gzp-stepper${z==="lg"?" gzp-stepper-lg":""}`,children:[i.jsx("button",{type:"button",onClick:u,"aria-label":`Remove one ${w}`,children:"−"}),i.jsx("span",{"aria-live":"polite",children:s}),i.jsx("button",{type:"button",onClick:f,"aria-label":`Add one more ${w}`,children:"+"})]}),Af=({dish:s,cart:f,cartKey:u,addToCart:z,removeFromCart:w,onOpenQuickView:P})=>{const q=b.useMemo(()=>qa(s),[s]),Y=q.length>0,[$,ge]=b.useState(q[0]||""),O=b.useMemo(()=>nl(s,$),[s,$]),[T,B]=b.useState(O[0]||""),[se,ae]=b.useState(!1);b.useEffect(()=>{O.length>0&&!O.includes(T)?B(O[0]):O.length===0&&T!==""&&B("")},[$]);const ee=Y?Xa(s,$,T):null,F=Y?Gc(s):null,te=Y?(ee==null?void 0:ee.price)??(F==null?void 0:F.price)??s.price:s.price,ve=Y?(ee==null?void 0:ee.originalPrice)??0:s.originalPrice,Ne=u("dish",s._id,$,T),me=f[Ne]||0,oe=fn(s.availableQty),he=!!(oe!=null&&oe.out),xe=(!Y||!!ee)&&!he,Ce=()=>P(s);return i.jsxs("div",{className:"gzp-card",children:[i.jsxs("div",{className:"gzp-card-media",role:"button",tabIndex:0,onClick:Ce,onKeyDown:re=>re.key==="Enter"&&Ce(),children:[i.jsx(Za,{src:Kt(s.image),alt:s.name,icon:s.icon}),oe&&i.jsx("span",{className:`gzp-stock${oe.out?" is-out":""}`,children:oe.text}),!Y&&s.originalPrice>s.price&&i.jsxs("span",{className:"gzp-save",children:["Save ",Math.round((s.originalPrice-s.price)/s.originalPrice*100),"%"]}),i.jsx("button",{type:"button",className:`gzp-wish${se?" is-active":""}`,onClick:re=>{re.stopPropagation(),ae(He=>!He)},"aria-pressed":se,"aria-label":se?`Remove ${s.name} from favourites`:`Add ${s.name} to favourites`,children:i.jsx(Of,{filled:se})})]}),i.jsxs("div",{className:"gzp-card-body",children:[i.jsx("h3",{role:"button",tabIndex:0,onClick:Ce,onKeyDown:re=>re.key==="Enter"&&Ce(),children:s.name}),i.jsx(ol,{price:te,originalPrice:ve,from:Y}),s.description&&i.jsx("p",{className:"gzp-card-desc",children:s.description}),Y&&i.jsxs("div",{className:"gzp-variant-row",onClick:re=>re.stopPropagation(),role:"presentation",children:[i.jsx("select",{className:"gzp-select",value:$,onChange:re=>ge(re.target.value),"aria-label":`Size for ${s.name}`,children:q.map(re=>i.jsx("option",{value:re,children:re},re))}),O.length>0&&i.jsx("select",{className:"gzp-select",value:T,onChange:re=>B(re.target.value),"aria-label":`Crust for ${s.name}`,children:O.map(re=>i.jsx("option",{value:re,children:re},re))})]}),i.jsx("div",{className:"gzp-card-foot",onClick:re=>re.stopPropagation(),role:"presentation",children:me?i.jsx(il,{qty:me,label:s.name,onAdd:()=>z("dish",s._id,s.name,$,T),onRemove:()=>w("dish",s._id,$,T)}):i.jsx("button",{type:"button",className:"gzp-add gzp-add-wide",disabled:!xe,onClick:()=>z("dish",s._id,s.name,$,T),children:he?"Sold out":i.jsxs(i.Fragment,{children:[i.jsx(If,{})," Add"]})})})]})]})},Bf=()=>i.jsxs("div",{className:"gzp-skeleton",children:[i.jsx("div",{className:"gzp-skeleton-media"}),i.jsxs("div",{className:"gzp-skeleton-lines",children:[i.jsx("i",{}),i.jsx("i",{})]})]}),Uf=()=>i.jsx("a",{className:"gzp-whatsapp",href:Kc,target:"_blank",rel:"noopener noreferrer","aria-label":"Chat with us on WhatsApp for any inquiry",title:"WhatsApp inquiry: +92 325 9061006",children:i.jsx("svg",{viewBox:"0 0 32 32",width:"30",height:"30","aria-hidden":"true",fill:"#fff",children:i.jsx("path",{d:"M16.03 3C9.4 3 4 8.38 4 15c0 2.12.56 4.19 1.62 6.01L4 29l8.2-1.58A12.02 12.02 0 0 0 16.03 27C22.66 27 28 21.62 28 15S22.66 3 16.03 3zm0 21.9c-1.8 0-3.56-.48-5.1-1.4l-.37-.22-4.86.94.98-4.73-.24-.39A9.86 9.86 0 0 1 6.1 15c0-5.46 4.45-9.9 9.93-9.9S26 9.54 26 15s-4.5 9.9-9.97 9.9zm5.44-7.4c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.27-.47-2.42-1.49-.9-.8-1.5-1.78-1.67-2.08-.17-.3-.02-.46.13-.61.14-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.05 1.03-1.05 2.5s1.08 2.9 1.23 3.1c.15.2 2.12 3.23 5.13 4.53.72.31 1.28.5 1.71.63.72.23 1.37.2 1.89.12.58-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.13-.27-.2-.57-.35z"})})}),Ga=({minimal:s,cartCount:f,onSearch:u,onCart:z,onNavigate:w,onTrack:P})=>i.jsx("header",{className:"gzp-header",children:i.jsxs("div",{className:"gzp-header-inner",children:[i.jsxs("button",{className:"gzp-brand",onClick:()=>window.scrollTo({top:0,behavior:"smooth"}),type:"button",children:[i.jsx("img",{src:ro,alt:"",className:"gzp-brand-mark"}),i.jsxs("span",{className:"gzp-brand-name",children:["GenZ Pizza Land",i.jsx("span",{className:"gzp-brand-sub",children:"Delivered hot across Gojra"})]})]}),!s&&i.jsxs(i.Fragment,{children:[i.jsxs("nav",{className:"v2-links","aria-label":"Site",children:[i.jsx("button",{type:"button",className:"v2-link",onClick:()=>w==null?void 0:w("menu"),children:"Menu"}),i.jsx("button",{type:"button",className:"v2-link",onClick:()=>w==null?void 0:w("deals"),children:"Deals"}),i.jsx("button",{type:"button",className:"v2-link",onClick:()=>w==null?void 0:w("reviews"),children:"Reviews"}),i.jsx("button",{type:"button",className:"v2-link",onClick:()=>w==null?void 0:w("contact"),children:"Contact"})]}),i.jsxs("button",{className:"v2-track-btn",onClick:P,type:"button",children:[i.jsx(Xc,{})," Track order"]}),i.jsx("button",{className:"gzp-icon-btn",onClick:u,"aria-label":"Search the menu",type:"button",children:i.jsx(qc,{})}),i.jsxs("button",{className:"gzp-icon-btn gzp-cart-btn",onClick:z,"aria-label":`Your order, ${f} item${f===1?"":"s"}`,type:"button",children:[i.jsx(Mf,{}),f>0&&i.jsx("span",{className:"gzp-cart-count",children:f})]})]})]})});function Wf(){var Jr,qo,Xo,Pn,fo,Tn,Cr,Zo;const[s,f]=b.useState([]),[u,z]=b.useState([]),[w,P]=b.useState([]),[q,Y]=b.useState([]),[$,ge]=b.useState(_f),[O,T]=b.useState(()=>Ya(null)),[B,se]=b.useState(!1),[ae,ee]=b.useState({}),[F,te]=b.useState(!1),[ve,Ne]=b.useState(!1),[me,oe]=b.useState(!0),[he,xe]=b.useState(""),[Ce,re]=b.useState(!1),[He,Le]=b.useState(!1),[I,ne]=b.useState(()=>localStorage.getItem("gzp_last_order")||null),[S,A]=b.useState(null),[ce,fe]=b.useState(!1),[L,H]=b.useState(!1),D=S&&!["Completed","Closed","Cancelled"].includes(S.orderStatus),[h,j]=b.useState({name:"",phone:"",address:""}),[ue,ye]=b.useState(Zi);b.useEffect(()=>{let c=null;const g=()=>{document.body.classList.add("is-scrolling"),c&&clearTimeout(c),c=setTimeout(()=>document.body.classList.remove("is-scrolling"),150)};return window.addEventListener("scroll",g,{passive:!0,capture:!0}),()=>{window.removeEventListener("scroll",g,{capture:!0}),c&&clearTimeout(c),document.body.classList.remove("is-scrolling")}},[]);const[je,ze]=b.useState(!1),[_e,Te]=b.useState(""),[M,Be]=b.useState(null),[Dt,Hr]=b.useState(""),[Pt,nr]=b.useState(""),[gr,Qr]=b.useState({});b.useEffect(()=>{if((M==null?void 0:M.type)==="dish"){const g=qa(M.item)[0]||"";Hr(g),nr(nl(M.item,g)[0]||""),Qr({})}else if((M==null?void 0:M.type)==="deal"){Hr(""),nr("");const c={};(M.item.items||[]).forEach((g,k)=>{var W;if(!g.customizable)return;const E=(g.flavourOptions||[])[0];if(!E)return;const Q=(W=E.variants)==null?void 0:W[0];c[k]={dishId:E._id,size:(Q==null?void 0:Q.size)||"",crust:(Q==null?void 0:Q.crust)||""}}),Qr(c)}else Hr(""),nr(""),Qr({})},[M]);const[mn,oo]=b.useState(""),[hr,ft]=b.useState(!1),[vr,io]=b.useState(null),[$t,lo]=b.useState(Va),[xr,gn]=b.useState(el),bt=tf(),[Vr,hn]=b.useState(""),[yr,wr]=b.useState(!1),[Ho,vn]=b.useState(""),xn=b.useRef(null),[Qo,qt]=b.useState(!1),yn=b.useRef(null),Yr=b.useRef(null);b.useEffect(()=>{(async()=>{var c,g,k;try{const[E,Q,W,X,de]=await Promise.all([Ap(),Nc(),Cc().catch(()=>({data:[]})),Bp().catch(()=>({data:[]})),_c().catch(()=>null)]);f(E.data||[]),z(Q.data||[]),P(W.data||[]),Y(X.data||[]);const Se=(c=de==null?void 0:de.data)==null?void 0:c.taxRatePercent;typeof Se=="number"&&ge(Se),(g=de==null?void 0:de.data)!=null&&g.payments&&lo({...Va,...de.data.payments}),(k=de==null?void 0:de.data)!=null&&k.buildYourOwnDeal&&T(Ya(de.data.buildYourOwnDeal))}catch(E){xe(E.message)}finally{oe(!1)}})()},[]),b.useEffect(()=>{if(!I)return;let c=!1;const g=async()=>{try{const E=await Ec(I);c||A(E.data)}catch(E){if(c)return;E.status===404&&(localStorage.removeItem("gzp_last_order"),ne(null),A(null))}};g();const k=setInterval(g,8e3);return()=>{c=!0,clearInterval(k)}},[I]),b.useEffect(()=>()=>clearTimeout(Yr.current),[]);const br=b.useMemo(()=>{const c=new Map;u.forEach(Q=>{var X;const W=((X=Q.category)==null?void 0:X._id)||Q.category||"other";c.has(W)||c.set(W,[]),c.get(W).push(Q)});const g=s.filter(Q=>(c.get(Q._id)||[]).length>0).map(Q=>({id:Q._id,name:Q.name,icon:Q.icon,description:Q.description,items:c.get(Q._id)})),k=new Set(s.map(Q=>Q._id)),E=u.filter(Q=>{var W;return!k.has(((W=Q.category)==null?void 0:W._id)||Q.category)});return E.length>0&&g.push({id:"other",name:"More to eat",icon:"🍽️",items:E}),g},[s,u]),Tt=b.useMemo(()=>{const c=br.map(g=>({id:g.id,name:g.name}));return w.length>0&&c.unshift({id:Zi,name:"Deals"}),c},[br,w]),zr=b.useMemo(()=>{const c={};return s.forEach(g=>{c[g._id]=g.name}),c},[s]),or=b.useMemo(()=>{const c=_e.trim().toLowerCase();if(!c)return[];const g=[];return w.forEach(k=>{k.name.toLowerCase().includes(c)&&g.push({type:"deal",item:k})}),u.forEach(k=>{k.name.toLowerCase().includes(c)&&g.push({type:"dish",item:k})}),g.slice(0,20)},[_e,u,w]),Xt=(c,g,k="",E="")=>`${c}:${g}:${k||""}||${E||""}`,ao=c=>{try{return`sel:${btoa(encodeURIComponent(JSON.stringify(c)))}`}catch{return"sel:"}},Vo=c=>{if(!c||!c.startsWith("sel:"))return null;try{return JSON.parse(decodeURIComponent(atob(c.slice(4))))}catch{return null}},Kr=c=>((c==null?void 0:c.items)||[]).some(g=>g.customizable),Zt=b.useMemo(()=>Object.entries(ae).filter(([,c])=>c>0).map(([c,g])=>{const[k,E,Q="||"]=c.split(":"),W=k==="deal"?w.find(Me=>Me._id===E):u.find(Me=>Me._id===E);if(!W)return null;const[X,de]=Q.split("||");let Se=W.price,Oe=W.originalPrice,Re="",Ye=null;if((k==="dish"||k==="byo")&&X){const Me=Xa(W,X,de);Me&&(Se=Me.price,Oe=Me.originalPrice,Re=[Me.size,Me.crust].filter(Boolean).join(", "))}if(k==="deal"){const Me=Vo(X);Me&&(Ye=Me,Re=Object.values(Me).map(jt=>{const J=u.find(we=>we._id===jt.dishId);return J?[jt.size,J.name].filter(Boolean).join(" "):null}).filter(Boolean).join(", "))}return{type:k,item:W,qty:g,key:c,size:X,crust:de,unitPrice:Se,unitOriginalPrice:Oe,variantLabel:Re,dealSelections:Ye}}).filter(Boolean),[ae,u,w]),wn=Zt.reduce((c,g)=>c+g.unitPrice*g.qty,0),Gr=Zt.filter(c=>c.type==="byo"),mt=Gr.reduce((c,g)=>c+g.qty,0),so=Gr.reduce((c,g)=>c+g.unitPrice*g.qty,0),ir=mt>0?ll(mt,O):0,qr=Math.round(so*ir/100),At=mt>0&&O.enabled?Math.max(0,O.minItems-mt):0,lr=mt>0&&(At>0||!O.enabled),Xr=wn-qr,bn=Xr*$/100,zn=Xr+bn,kn=Zt.reduce((c,g)=>c+g.qty,0),kr=b.useCallback((c,g=2e3)=>{oo(c),clearTimeout(Yr.current),Yr.current=setTimeout(()=>oo(""),g)},[]),De=b.useRef(ae);De.current=ae;const jn=b.useRef({dishes:u,deals:w});jn.current={dishes:u,deals:w};const Yo=(c,g,k)=>{const E=g==="deal"?["deal"]:["dish","byo"];return Object.entries(c).reduce((Q,[W,X])=>E.some(de=>W.startsWith(`${de}:${k}:`))?Q+X:Q,0)},al=(c,g)=>(c==="deal"?jn.current.deals:jn.current.dishes).find(k=>k._id===g),Bt=b.useCallback((c,g,k,E="",Q="",W=null)=>{const X=al(c,g),de=k||(X==null?void 0:X.name)||"This item",Se=typeof(X==null?void 0:X.availableQty)=="number"?X.availableQty:1/0;if(Yo(De.current,c,g)+1>Se){kr(Se<=0?`Sorry, ${de} is out of stock right now.`:`Only ${Se} ${de} in stock. Please select ${Se}.`,3500);return}const Re=W?Xt(c,g,ao(W)):Xt(c,g,E,Q);De.current={...De.current,[Re]:(De.current[Re]||0)+1},ee(De.current),k&&kr(`${k} added`)},[kr]),Zr=b.useCallback((c,g,k="",E="")=>{const Q=Xt(c,g,k,E);De.current={...De.current,[Q]:Math.max(0,(De.current[Q]||0)-1)},ee(De.current)},[]),Sn=b.useCallback(async()=>{var c,g,k;try{const[E,Q,W]=await Promise.all([Nc(),Cc().catch(()=>null),_c().catch(()=>null)]);z(E.data||[]),Q&&P(Q.data||[]),(c=W==null?void 0:W.data)!=null&&c.buildYourOwnDeal&&T(Ya(W.data.buildYourOwnDeal)),typeof((g=W==null?void 0:W.data)==null?void 0:g.taxRatePercent)=="number"&&ge(W.data.taxRatePercent),(k=W==null?void 0:W.data)!=null&&k.payments&&lo({...Va,...W.data.payments})}catch{}},[]);b.useEffect(()=>{if(me)return;const c=()=>{document.hidden||Sn()},g=setInterval(c,Rf);return document.addEventListener("visibilitychange",c),window.addEventListener("focus",c),()=>{clearInterval(g),document.removeEventListener("visibilitychange",c),window.removeEventListener("focus",c)}},[me,Sn]),b.useEffect(()=>{const c=De.current,g={};Object.entries(c).forEach(([Q,W])=>{if(W<=0)return;const[X,de]=Q.split(":"),Se=X==="byo"?"dish":X;(g[`${Se}:${de}`]=g[`${Se}:${de}`]||[]).push(Q)});let k=c;const E=[];Object.entries(g).forEach(([Q,W])=>{const[X,de]=Q.split(":"),Se=(X==="deal"?w:u).find(Re=>Re._id===de);if(!Se||typeof Se.availableQty!="number")return;let Oe=W.reduce((Re,Ye)=>Re+k[Ye],0);if(!(Oe<=Se.availableQty)){k={...k};for(const Re of[...W].reverse()){if(Oe<=Se.availableQty)break;const Ye=Math.min(k[Re],Oe-Se.availableQty);k[Re]-=Ye,Oe-=Ye}E.push(Se.availableQty<=0?`${Se.name} just sold out and was removed from your order.`:`Only ${Se.availableQty} ${Se.name} in stock - your order was set to ${Se.availableQty}.`)}}),E.length>0&&(De.current=k,ee(k),kr(E.join(" "),5e3))},[u,w,kr]);const uo=c=>{var W,X;if(!c)return;const g=(((W=document.querySelector(".gzp-header"))==null?void 0:W.offsetHeight)||0)+(((X=document.querySelector(".gzp-navbar"))==null?void 0:X.offsetHeight)||0)+8,k=()=>Math.max(0,c.getBoundingClientRect().top+window.scrollY-g);window.scrollTo({top:k(),behavior:"smooth"});let E=0;const Q=()=>{E+=1;const de=k()-window.scrollY;Math.abs(de)>6&&E<=4&&(window.scrollTo({top:k(),behavior:E<3?"smooth":"auto"}),window.setTimeout(Q,450))};window.setTimeout(Q,650)},Nn=c=>{const g=document.getElementById(`section-${c}`);g&&(ye(c),uo(g))},co=c=>{var g,k;if(c==="menu"){const E=w.length>0?Zi:(g=Tt[0])==null?void 0:g.id;if(E)return Nn(E)}if(c==="deals"&&w.length===0)return Nn((k=Tt[0])==null?void 0:k.id);uo(document.getElementById(`section-${c}`))};b.useEffect(()=>{if(me||I)return;let c=0;const g=()=>{c||(c=requestAnimationFrame(()=>{var Q;c=0;const k=160;let E=(Q=Tt[0])==null?void 0:Q.id;Tt.forEach(W=>{const X=document.getElementById(`section-${W.id}`);X&&X.getBoundingClientRect().top<=k&&(E=W.id)}),E&&ye(E)}))};return g(),window.addEventListener("scroll",g,{passive:!0}),()=>{window.removeEventListener("scroll",g),cancelAnimationFrame(c)}},[Tt,me,I]),b.useEffect(()=>{const c=yn.current,g=c==null?void 0:c.querySelector(".is-active");if(c&&g){const k=g.offsetLeft-(c.clientWidth-g.offsetWidth)/2;c.scrollTo({left:Math.max(0,k),behavior:"auto"})}},[ue]);const Ue=c=>{const g=xn.current;g&&g.scrollBy({left:c*(g.clientWidth*.8),behavior:"smooth"})};b.useEffect(()=>{const c=xn.current;if(me||w.length<2||Qo||!c||window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;const g=window.setInterval(()=>{const k=c.querySelector(".gzp-deal"),E=c.scrollWidth-c.clientWidth;if(!k||E<=0)return;const Q=Number.parseFloat(window.getComputedStyle(c).columnGap)||0,W=k.getBoundingClientRect().width+Q;c.scrollLeft>=E-2?c.scrollTo({left:0,behavior:"smooth"}):c.scrollBy({left:Math.min(W,E-c.scrollLeft),behavior:"smooth"})},4e3);return()=>window.clearInterval(g)},[w.length,Qo,me]);const Ko=F||ve||hr||je||!!M;b.useEffect(()=>(document.body.style.overflow=Ko?"hidden":"",()=>{document.body.style.overflow=""}),[Ko]),b.useEffect(()=>{const c=g=>{g.key==="Escape"&&(je?ze(!1):M?Be(null):ve?Ne(!1):hr?ft(!1):F&&te(!1))};return window.addEventListener("keydown",c),()=>window.removeEventListener("keydown",c)},[je,M,ve,hr,F]);const po=b.useMemo(()=>{if(q.length>0)return q.map(k=>({url:Kt(k.image),link:k.link||"",alt:k.altText||""}));const c=new Set,g=[];return[...w,...u].forEach(k=>{const E=Kt(k.image);E&&!c.has(E)&&(c.add(E),g.push({url:E,link:"",alt:""}))}),g.slice(0,8)},[q,w,u]);b.useEffect(()=>{xr===el&&!$t.codEnabled&&$t.jazzcashEnabled&&gn(tl),xr===tl&&!$t.jazzcashEnabled&&$t.codEnabled&&gn(el)},[$t,xr]);const jr=xr===tl&&$t.jazzcashEnabled,Cn=!Ce&&(!jr||bt.ready),sl=async c=>{if(c.preventDefault(),Zt.length!==0){if(lr){xe(O.enabled?`Build Your Own Deal needs at least ${O.minItems} items - add ${At} more or remove the deal.`:"Build Your Own Deal isn't available right now - please remove it from your order.");return}if(!Ic(h.phone)){xe("That mobile number doesn't look complete. Use digits only, e.g. 03001234567.");return}if(jr&&!bt.ready){xe("Please add your Transaction ID, sender name/number and payment screenshot first.");return}re(!0),xe("");try{const g=await Up({customerName:h.name,customerPhone:h.phone,address:h.address,...jr?{paymentMethod:"jazzcash",tid:bt.tid,senderInfo:bt.sender,proofId:bt.proofId}:{paymentMethod:"cod"},items:Zt.map(E=>E.type==="deal"?{dealId:E.item._id,quantity:E.qty,dealSelections:E.dealSelections||void 0}:{dishId:E.item._id,quantity:E.qty,size:E.size||void 0,crust:E.crust||void 0,byo:E.type==="byo"?!0:void 0})}),k=g.data._id;localStorage.setItem("gzp_last_order",k),ne(k),A(g.data),fe(!0),H(!1),bt.reset(),ee({}),Ne(!1),te(!1),window.scrollTo({top:0})}catch(g){(g.status===409||/Build Your Own/i.test(g.message||""))&&Sn(),xe(g.message)}finally{re(!1)}}},Go=async()=>{if(!(!I||He)){Le(!0);try{const c=await Ec(I);A(c.data)}catch(c){c.status===404&&(localStorage.removeItem("gzp_last_order"),ne(null),A(null))}finally{Le(!1)}}},[Sr,zt]=b.useState(!1),ul=async()=>{if(!(!I||Sr)&&window.confirm("Cancel this order? You won't be charged anything.")){zt(!0);try{const c=await Wp(I);A(g=>g&&{...g,orderStatus:c.data.orderStatus})}catch(c){window.alert(c.message||"Couldn't cancel the order — please call the shop.")}finally{zt(!1)}}},kt=()=>{localStorage.removeItem("gzp_last_order"),ne(null),A(null)},cl=async c=>{c.preventDefault();const g=Vr.trim();if(g){if(!Ic(g)){vn("Enter the full mobile number you used at checkout, digits only.");return}wr(!0),vn("");try{const k=await Hp(g);localStorage.setItem("gzp_last_order",k.data._id),ne(k.data._id),A(k.data),ft(!1),hn("")}catch(k){vn(k.status===404?"No recent order on that number. Check the digits and try again.":k.message||"Couldn't reach the kitchen. Try again in a moment.")}finally{wr(!1)}}},dl=()=>{const c={};return Object.entries(ae).forEach(([g,k])=>{g.startsWith("byo:")&&k>0&&(c[g.slice(4)]=k)}),c},pl=c=>{const g={};Object.entries(De.current).forEach(([k,E])=>{k.startsWith("byo:")||(g[k]=E)}),Object.entries(c).forEach(([k,E])=>{E>0&&(g[`byo:${k}`]=E)}),De.current=g,ee(g),se(!1),te(!0),kr("Your custom deal is in your order")},En=()=>{const c={};Object.entries(De.current).forEach(([g,k])=>{g.startsWith("byo:")||(c[g]=k)}),De.current=c,ee(c)},_n=c=>Object.entries(De.current).reduce((g,[k,E])=>k.startsWith(`dish:${c}:`)?g+E:g,0),Nr=c=>i.jsxs("div",{className:"gzp-line",children:[Kt(c.item.image)?i.jsx("img",{src:Kt(c.item.image),alt:"",onError:g=>{g.currentTarget.style.display="none"}}):i.jsx("span",{className:"gzp-line-icon",children:c.item.icon||"🍽️"}),i.jsxs("div",{className:"gzp-line-main",children:[i.jsxs("h4",{children:[c.type==="deal"&&i.jsx("span",{className:"gzp-tag",children:"DEAL"}),c.item.name]}),c.variantLabel&&i.jsx("p",{className:"gzp-line-variant",children:c.variantLabel}),i.jsx("span",{children:pt(c.unitPrice*c.qty)})]}),i.jsx(il,{qty:c.qty,label:c.item.name,onAdd:()=>Bt(c.type,c.item._id,"",c.size,c.crust),onRemove:()=>Zr(c.type,c.item._id,c.size,c.crust)})]},c.key);if(I&&!S)return i.jsxs("div",{className:"gzp-app",children:[i.jsx(Ga,{minimal:!0}),i.jsxs("div",{className:"gzp-boot",children:[i.jsx("img",{src:ro,alt:""}),"Pulling up your order…"]})]});if(I&&S&&ce)return i.jsx($f,{order:S,onTrack:()=>fe(!1),onContinue:()=>{fe(!1),H(!0)}});if(I&&S&&!L){const c=((Jr=S.payment)==null?void 0:Jr.method)==="JazzCash/Raast",g=c?Tf:Pf,k=g.indexOf(S.orderStatus),E=S.orderStatus==="Cancelled",Q=String(S._id||"").slice(-6).toUpperCase(),W=`https://wa.me/${Yc}?text=${encodeURIComponent(`Hello GenZ Pizza Land, I need help with order #${Q}.`)}`;return i.jsxs("div",{className:"gzp-app",children:[i.jsx(Ga,{minimal:!0}),i.jsx("div",{className:"gzp-shell",children:i.jsxs("section",{className:"gzp-track",children:[i.jsxs("div",{className:"gzp-track-hero",children:[i.jsxs("div",{className:"gzp-track-top",children:[i.jsxs("div",{style:{flex:1},children:[i.jsx("h1",{children:Lf[S.orderStatus]||"Order status"}),i.jsxs("p",{className:"gzp-track-id",children:["Order #",String(S._id||"").slice(-6).toUpperCase()," for"," ",((qo=S.customerDetails)==null?void 0:qo.name)||"you"]})]}),i.jsx("button",{type:"button",className:"gzp-btn gzp-btn-ghost",onClick:Go,disabled:He,children:He?"Checking…":"Refresh"})]}),i.jsx(lf,{order:S,whatsappHref:W}),E?c?null:i.jsx("p",{className:"gzp-cancelled",children:"This order was cancelled. Nothing has been charged — you can order again any time."}):i.jsxs(i.Fragment,{children:[i.jsx("p",{className:"gzp-eta",children:"This page updates itself every few seconds. Keep it open and watch it move."}),i.jsx("ol",{className:"gzp-steps",children:g.map((X,de)=>i.jsx("li",{className:de<k?"is-done":de===k?"is-current":"",children:Mc[X]},X))}),S.orderStatus==="Pending"&&i.jsx("button",{type:"button",className:"gzp-btn gzp-btn-ghost",style:{marginTop:14,color:"#E6392F",borderColor:"#E6392F"},onClick:ul,disabled:Sr,children:Sr?"Cancelling…":"Cancel this order"})]})]}),i.jsxs("div",{className:"gzp-panel",children:[i.jsx("h3",{children:"What's coming"}),(S.items||[]).map((X,de)=>{var Se;return i.jsxs("div",{children:[i.jsxs("div",{className:"gzp-order-line",children:[i.jsxs("span",{children:[X.isDeal&&i.jsx("span",{className:"gzp-tag",children:"DEAL"}),X.quantity,"× ",X.name]}),i.jsx("span",{children:pt(X.price*X.quantity)})]}),X.isDeal&&((Se=X.dealItems)==null?void 0:Se.length)>0&&i.jsx("p",{className:"gzp-order-sub",children:X.dealItems.map(Oe=>`${Oe.quantity>1?Oe.quantity+"× ":""}${Oe.label}`).join(", ")})]},de)}),i.jsxs("div",{className:"gzp-totals",style:{marginTop:14},children:[Number((Xo=S.bills)==null?void 0:Xo.discount)>0&&i.jsxs("div",{className:"is-discount",children:[i.jsx("span",{children:S.bills.discountLabel||"Build Your Own Deal discount"}),i.jsxs("span",{children:["−",pt(S.bills.discount)]})]}),i.jsxs("div",{className:"gzp-grand",children:[i.jsx("span",{children:c?((Pn=S.payment)==null?void 0:Pn.status)==="Verified"?"Paid via JazzCash/Raast":"Total (JazzCash/Raast)":"Pay on delivery"}),i.jsx("span",{children:pt(((fo=S.bills)==null?void 0:fo.totalWithTax)||0)})]})]})]}),((Tn=S.customerDetails)==null?void 0:Tn.address)&&i.jsxs("div",{className:"gzp-panel",children:[i.jsx("h3",{children:"Delivering to"}),i.jsx("p",{style:{margin:0,color:"var(--flour-dim)",fontSize:"0.93rem"},children:S.customerDetails.address})]}),i.jsx("a",{className:"gzp-btn gzp-btn-ghost gzp-btn-block pay-help",href:W,target:"_blank",rel:"noopener noreferrer",children:"💬 Need help? Chat with us on WhatsApp"}),i.jsx("button",{className:"gzp-btn gzp-btn-ghost gzp-btn-block",style:{marginTop:12},onClick:kt,type:"button",children:"Start another order"})]})})]})}return i.jsxs("div",{className:"gzp-app",children:[i.jsx(Ga,{cartCount:kn,onSearch:()=>ze(!0),onCart:()=>te(!0),onNavigate:co,onTrack:()=>ft(!0)}),L&&D&&i.jsxs("div",{className:"gzp-tracking-banner",children:[i.jsxs("span",{children:["Order #",String(S._id||"").slice(-6).toUpperCase()," — ",Mc[S.orderStatus]||S.orderStatus]}),i.jsx("button",{type:"button",onClick:()=>H(!1),children:"Track it"})]}),he&&!ve&&i.jsx("div",{className:"gzp-shell",children:i.jsx("p",{className:"gzp-error gzp-error-banner",children:he})}),i.jsx(pf,{summary:vr,onOrder:()=>co("menu"),onTrack:()=>ft(!0)}),i.jsx("section",{className:"gzp-hero",children:i.jsx(Ff,{slides:po,onSlideClick:c=>{var g;c!=null&&c.link?window.open(c.link,"_blank","noopener,noreferrer"):Nn((g=Tt[0])==null?void 0:g.id)}})}),!me&&Tt.length>0&&i.jsx("nav",{className:"gzp-navbar","aria-label":"Menu sections",children:i.jsx("div",{className:"gzp-navbar-inner",children:i.jsx("div",{className:"gzp-navbar-chips",ref:yn,children:Tt.map(c=>i.jsx("button",{type:"button",className:`gzp-chip${ue===c.id?" is-active":""}`,onClick:()=>Nn(c.id),children:c.name},c.id))})})}),i.jsxs("div",{className:"gzp-shell",children:[me?i.jsxs("section",{className:"gzp-section",children:[i.jsxs("div",{className:"gzp-section-head",children:[i.jsx("h2",{children:"Loading the menu"}),i.jsx("div",{className:"gzp-section-rule"})]}),i.jsx("div",{className:"gzp-grid",children:Array.from({length:8}).map((c,g)=>i.jsx(Bf,{},g))})]}):i.jsxs(i.Fragment,{children:[O.enabled&&u.length>0&&i.jsx(zf,{cfg:O,pickedCount:mt,onStart:()=>se(!0)}),w.length>0&&i.jsxs("section",{className:"gzp-section",id:`section-${Zi}`,children:[i.jsxs("div",{className:"gzp-section-head",children:[i.jsx("h2",{children:"Today's deals"}),i.jsxs("span",{className:"gzp-section-count",children:[w.length," bundle",w.length===1?"":"s"]}),i.jsx("div",{className:"gzp-section-rule"}),i.jsxs("div",{className:"gzp-rail-nav",children:[i.jsx("button",{className:"gzp-rail-btn",onClick:()=>Ue(-1),"aria-label":"Scroll deals back",type:"button",children:i.jsx(Ka,{dir:"left"})}),i.jsx("button",{className:"gzp-rail-btn",onClick:()=>Ue(1),"aria-label":"Scroll deals forward",type:"button",children:i.jsx(Ka,{})})]})]}),i.jsx("div",{className:"gzp-rail-wrap",children:i.jsx("div",{className:"gzp-rail",ref:xn,onMouseEnter:()=>qt(!0),onMouseLeave:()=>qt(!1),onFocus:()=>qt(!0),onBlur:c=>{c.currentTarget.contains(c.relatedTarget)||qt(!1)},onPointerDown:c=>{c.pointerType!=="mouse"&&qt(!0)},onPointerUp:c=>{c.pointerType!=="mouse"&&qt(!1)},children:w.map(c=>{var E,Q,W;const g=Xt("deal",c._id),k=c.originalPrice>c.price?Math.round((c.originalPrice-c.price)/c.originalPrice*100):0;return i.jsxs("div",{className:"gzp-deal",role:"button",tabIndex:0,onClick:()=>Be({type:"deal",item:c}),onKeyDown:X=>X.key==="Enter"&&Be({type:"deal",item:c}),children:[i.jsxs("div",{className:"gzp-deal-media",children:[i.jsx(Za,{src:Kt(c.image),alt:c.name,icon:c.icon||"🔥"}),c.badge&&i.jsx("span",{className:"gzp-badge",children:c.badge}),k>0&&i.jsxs("span",{className:"gzp-save",children:["Save ",k,"%"]}),fn(c.availableQty)&&i.jsx("span",{className:`gzp-stock${fn(c.availableQty).out?" is-out":""}`,children:fn(c.availableQty).text})]}),i.jsxs("div",{className:"gzp-deal-body",children:[i.jsx("h3",{children:c.name}),((E=c.items)==null?void 0:E.length)>0?i.jsxs("ul",{className:"gzp-deal-contents",children:[c.items.slice(0,3).map((X,de)=>i.jsxs("li",{children:[X.quantity>1?`${X.quantity}× `:"",X.label]},de)),c.items.length>3&&i.jsxs("li",{className:"gzp-deal-more",children:["+",c.items.length-3," more in the box"]})]}):c.description&&i.jsx("p",{className:"gzp-deal-desc",children:c.description}),i.jsxs("div",{className:"gzp-deal-foot",onClick:X=>X.stopPropagation(),role:"presentation",children:[i.jsx(ol,{price:c.price,originalPrice:c.originalPrice}),ae[g]&&!Kr(c)?i.jsx(il,{qty:ae[g],label:c.name,onAdd:()=>Bt("deal",c._id),onRemove:()=>Zr("deal",c._id)}):i.jsx("button",{type:"button",className:"gzp-add gzp-add-wide",disabled:(Q=fn(c.availableQty))==null?void 0:Q.out,onClick:()=>Kr(c)?Be({type:"deal",item:c}):Bt("deal",c._id,c.name),children:(W=fn(c.availableQty))!=null&&W.out?"Sold out":Kr(c)?"Choose & add":"Add deal"})]})]})]},c._id)})})})]}),br.map(c=>i.jsxs("section",{className:"gzp-section",id:`section-${c.id}`,children:[i.jsxs("div",{className:"gzp-section-head",children:[i.jsx("h2",{children:c.name}),i.jsxs("span",{className:"gzp-section-count",children:[c.items.length," items"]}),i.jsx("div",{className:"gzp-section-rule"})]}),i.jsx("div",{className:"gzp-grid",children:c.items.map(g=>i.jsx(Af,{dish:g,cart:ae,cartKey:Xt,addToCart:Bt,removeFromCart:Zr,onOpenQuickView:k=>Be({type:"dish",item:k})},g._id))})]},c.id)),br.length===0&&w.length===0&&i.jsx("section",{className:"gzp-section",children:i.jsxs("div",{className:"gzp-empty",children:[i.jsx("img",{src:ro,alt:"",className:"gzp-empty-logo"}),"The menu is being set up right now. Check back in a little while."]})})]}),i.jsx(mf,{}),i.jsx(xf,{onSummary:io}),i.jsx(gf,{}),i.jsx(yf,{whatsappLink:Kc,onTrack:()=>ft(!0)})]}),i.jsx(wf,{taxRatePercent:$,onNavigate:co,onTrack:()=>ft(!0)}),kn>0&&!F&&!ve&&i.jsxs("button",{className:"gzp-cartbar",onClick:()=>te(!0),type:"button",children:[i.jsxs("span",{className:"gzp-cartbar-label",children:[i.jsxs("small",{children:[kn," item",kn===1?"":"s"," in your order"]}),i.jsx("b",{children:pt(zn)})]}),i.jsx("span",{className:"gzp-cartbar-cta",children:"View order"})]}),i.jsx(Uf,{}),mn&&i.jsxs("div",{className:"gzp-toast",role:"status",children:[i.jsx("i",{children:"✓"}),mn]}),je&&i.jsxs("div",{className:"gzp-search",onClick:()=>ze(!1),children:[i.jsxs("div",{className:"gzp-search-bar",onClick:c=>c.stopPropagation(),children:[i.jsx(qc,{}),i.jsx("input",{autoFocus:!0,value:_e,onChange:c=>Te(c.target.value),placeholder:"Search for a pizza, burger or deal","aria-label":"Search the menu"}),i.jsx("button",{className:"gzp-btn gzp-btn-ghost",onClick:()=>ze(!1),type:"button",children:"Close"})]}),i.jsxs("div",{className:"gzp-search-results",onClick:c=>c.stopPropagation(),children:[_e.trim()&&or.length===0&&i.jsxs("p",{className:"gzp-search-empty",children:["Nothing matches “",_e.trim(),"”. Try a shorter word, like “pizza”."]}),or.map(({type:c,item:g})=>{var k;return i.jsxs("button",{className:"gzp-result",type:"button",onClick:()=>{ze(!1),Be({type:c,item:g})},children:[Kt(g.image)?i.jsx("img",{src:Kt(g.image),alt:"",onError:E=>{E.currentTarget.style.display="none"}}):i.jsx("span",{className:"gzp-result-icon",children:g.icon||"🍽️"}),i.jsxs("span",{className:"gzp-result-name",children:[g.name,i.jsx("span",{className:"gzp-result-cat",children:c==="deal"?"Deal":zr[((k=g.category)==null?void 0:k._id)||g.category]||"Menu"})]}),i.jsx(ol,{price:g.price})]},`${c}-${g._id}`)})]})]}),M&&i.jsx("div",{className:"gzp-overlay",onClick:()=>Be(null),children:i.jsxs("div",{className:"gzp-modal",onClick:c=>c.stopPropagation(),role:"dialog","aria-label":M.item.name,children:[i.jsxs("div",{className:"gzp-modal-media",children:[i.jsx(Za,{src:Kt(M.item.image),alt:M.item.name,icon:M.item.icon}),M.item.badge&&i.jsx("span",{className:"gzp-badge",children:M.item.badge}),i.jsx("button",{className:"gzp-modal-close",onClick:()=>Be(null),"aria-label":"Close",type:"button",children:"✕"})]}),i.jsxs("div",{className:"gzp-modal-body",children:[i.jsx("h2",{children:M.item.name}),M.type==="deal"&&((Cr=M.item.items)==null?void 0:Cr.length)>0&&i.jsx("ul",{className:"gzp-deal-contents",children:M.item.items.map((c,g)=>c.customizable?null:i.jsxs("li",{children:[c.quantity>1?`${c.quantity}× `:"",c.label]},g))}),M.type==="deal"&&((Zo=M.item.items)==null?void 0:Zo.map((c,g)=>{var Ye,Me,jt;if(!c.customizable)return null;const k=c.flavourOptions||[],E=gr[g]||{},Q=[...new Map(k.map(J=>{var we,be;return[((we=J.category)==null?void 0:we._id)||"",((be=J.category)==null?void 0:be.name)||"Choose"]}))],W=((Me=(Ye=k.find(J=>J._id===E.dishId))==null?void 0:Ye.category)==null?void 0:Me._id)||((jt=Q[0])==null?void 0:jt[0])||"",X=k.filter(J=>{var we;return(((we=J.category)==null?void 0:we._id)||"")===W}),de=k.find(J=>J._id===E.dishId),Se=[...new Set(((de==null?void 0:de.variants)||[]).map(J=>J.size))],Oe=((de==null?void 0:de.variants)||[]).filter(J=>J.size===E.size&&J.crust),Re=J=>Qr(we=>({...we,[g]:{...we[g],...J}}));return i.jsxs("div",{className:"gzp-deal-choice",children:[i.jsxs("p",{className:"gzp-deal-choice-label",children:[c.quantity>1?`${c.quantity}× `:"",c.label," — pick yours"]}),i.jsxs("div",{className:"gzp-variant-row",children:[Q.length>1&&i.jsx("select",{className:"gzp-select",value:W,onChange:J=>{var qe;const we=k.find(Xe=>{var Er;return(((Er=Xe.category)==null?void 0:Er._id)||"")===J.target.value}),be=(qe=we==null?void 0:we.variants)==null?void 0:qe[0];Re({dishId:(we==null?void 0:we._id)||"",size:(be==null?void 0:be.size)||"",crust:(be==null?void 0:be.crust)||""})},"aria-label":`Category for ${c.label}`,children:Q.map(([J,we])=>i.jsx("option",{value:J,children:we},J))}),i.jsxs("select",{className:"gzp-select",value:E.dishId||"",onChange:J=>{var qe;const we=k.find(Xe=>Xe._id===J.target.value),be=(qe=we==null?void 0:we.variants)==null?void 0:qe[0];Re({dishId:(we==null?void 0:we._id)||"",size:(be==null?void 0:be.size)||"",crust:(be==null?void 0:be.crust)||""})},"aria-label":`Flavour for ${c.label}`,children:[X.length===0&&i.jsx("option",{value:"",children:"No flavours available"}),X.map(J=>i.jsx("option",{value:J._id,children:J.name},J._id))]}),Se.length>0&&i.jsx("select",{className:"gzp-select",value:E.size||"",onChange:J=>{var be;const we=((de==null?void 0:de.variants)||[]).filter(qe=>qe.size===J.target.value&&qe.crust);Re({size:J.target.value,crust:we.some(qe=>qe.crust===E.crust)?E.crust:((be=we[0])==null?void 0:be.crust)||""})},"aria-label":`Size for ${c.label}`,children:Se.map(J=>i.jsx("option",{value:J,children:J},J))}),Oe.length>0&&i.jsx("select",{className:"gzp-select",value:E.crust||"",onChange:J=>Re({crust:J.target.value}),"aria-label":`Crust for ${c.label}`,children:Oe.map(J=>i.jsx("option",{value:J.crust,children:J.crust},J.crust))})]})]},g)})),M.item.description&&i.jsx("p",{className:"gzp-deal-desc",children:M.item.description}),(()=>{const c=M.type==="dish",g=M.type==="deal",k=c?qa(M.item):[],E=k.length>0,Q=c?nl(M.item,Dt):[],W=E?Xa(M.item,Dt,Pt):null,X=E?Gc(M.item):null,de=E?(W==null?void 0:W.price)??(X==null?void 0:X.price)??M.item.price:M.item.price,Se=E?(W==null?void 0:W.originalPrice)??0:M.item.originalPrice,Oe=g&&Kr(M.item),Re=!Oe||(M.item.items||[]).every((be,qe)=>{var mo;if(!be.customizable)return!0;const Xe=gr[qe];if(!(Xe!=null&&Xe.dishId))return!1;const Er=(be.flavourOptions||[]).find(Ln=>Ln._id===Xe.dishId);return((mo=Er==null?void 0:Er.variants)==null?void 0:mo.length)>0?!!Xe.size:!0}),Ye=Oe?Xt(M.type,M.item._id,ao(gr)):Xt(M.type,M.item._id,Dt,Pt),Me=ae[Ye]||0,jt=(c?u:w).find(be=>be._id===M.item._id)||M.item,J=fn(jt.availableQty),we=(!E||!!W)&&Re&&!(J!=null&&J.out);return i.jsxs(i.Fragment,{children:[i.jsx(ol,{price:de,originalPrice:Se,from:E}),J&&i.jsx("p",{className:`gzp-stock-note${J.out?" is-out":""}`,children:J.text}),E&&i.jsxs("div",{className:"gzp-variant-row",children:[i.jsx("select",{className:"gzp-select",value:Dt,onChange:be=>{const qe=be.target.value;Hr(qe);const Xe=nl(M.item,qe);nr(Xe.includes(Pt)?Pt:Xe[0]||"")},"aria-label":`Size for ${M.item.name}`,children:k.map(be=>i.jsx("option",{value:be,children:be},be))}),Q.length>0&&i.jsx("select",{className:"gzp-select",value:Pt,onChange:be=>nr(be.target.value),"aria-label":`Crust for ${M.item.name}`,children:Q.map(be=>i.jsx("option",{value:be,children:be},be))})]}),i.jsx("div",{className:"gzp-modal-foot",children:Me?i.jsxs(i.Fragment,{children:[i.jsx(il,{size:"lg",label:M.item.name,qty:Me,onAdd:()=>Oe?Bt(M.type,M.item._id,"","","",gr):Bt(M.type,M.item._id,"",Dt,Pt),onRemove:()=>{const[,,be]=Ye.split(":"),[qe,Xe]=be.split("||");Zr(M.type,M.item._id,qe,Xe)}}),i.jsx("button",{className:"gzp-btn gzp-btn-primary",onClick:()=>{Be(null),te(!0)},type:"button",children:"View order"})]}):i.jsxs("button",{className:"gzp-btn gzp-btn-primary gzp-btn-split",disabled:!we,onClick:()=>{Oe?Bt(M.type,M.item._id,M.item.name,"","",gr):Bt(M.type,M.item._id,M.item.name,Dt,Pt),Be(null)},type:"button",children:[i.jsx("span",{children:J!=null&&J.out?"Sold out":Oe&&!Re?"Choose your options":"Add to order"}),i.jsx("span",{children:pt(de)})]})})]})})()]})]})}),B&&i.jsx(Nf,{cfg:O,dishes:u,categories:s,initialPicks:dl(),getOtherQty:_n,onClose:()=>se(!1),onConfirm:pl}),F&&i.jsx("div",{className:"gzp-sheet-overlay",onClick:()=>te(!1),children:i.jsxs("div",{className:"gzp-sheet",onClick:c=>c.stopPropagation(),role:"dialog","aria-label":"Your order",children:[i.jsxs("div",{className:"gzp-sheet-head",children:[i.jsx("h2",{children:"Your order"}),i.jsx("button",{className:"gzp-icon-btn",onClick:()=>te(!1),"aria-label":"Close",type:"button",children:"✕"})]}),Zt.length===0?i.jsxs("div",{className:"gzp-sheet-body",children:[i.jsxs("div",{className:"gzp-empty",children:[i.jsx("span",{children:"🛒"}),"Nothing here yet. Add a deal or a pizza and it'll show up."]}),i.jsx("button",{className:"gzp-btn gzp-btn-primary",onClick:()=>te(!1),type:"button",children:"Back to the menu"})]}):i.jsxs(i.Fragment,{children:[i.jsxs("div",{className:"gzp-sheet-body",children:[Zt.filter(c=>c.type!=="byo").map(Nr),Gr.length>0&&i.jsxs("div",{className:"gzp-byo-cart",children:[i.jsxs("div",{className:"gzp-byo-cart-head",children:[i.jsx("h4",{children:"🎯 Your custom deal"}),i.jsx("button",{type:"button",onClick:()=>{te(!1),se(!0)},children:"Edit"})]}),i.jsx("p",{className:`gzp-byo-cart-note${At>0||!O.enabled?" is-warn":""}`,children:O.enabled?Hc(mt,O):"This deal isn't available right now."}),Gr.map(Nr),qr>0&&i.jsxs("p",{className:"gzp-byo-cart-saving",children:["You save ",i.jsx("b",{children:pt(qr)})," (",ir,"% off ",mt," items)"]})]})]}),i.jsxs("div",{className:"gzp-sheet-foot",children:[i.jsxs("div",{className:"gzp-totals",children:[i.jsxs("div",{children:[i.jsx("span",{children:"Subtotal"}),i.jsx("span",{children:pt(wn)})]}),qr>0&&i.jsxs("div",{className:"is-discount",children:[i.jsxs("span",{children:["Custom deal discount (",ir,"%)"]}),i.jsxs("span",{children:["−",pt(qr)]})]}),i.jsxs("div",{children:[i.jsxs("span",{children:["Tax (",$,"%)"]}),i.jsx("span",{children:pt(bn)})]}),i.jsxs("div",{className:"gzp-grand",children:[i.jsx("span",{children:"Total"}),i.jsx("span",{children:pt(zn)})]})]}),lr&&i.jsx("p",{className:"gzp-byo-warn",children:O.enabled?`Your custom deal needs ${At} more item${At===1?"":"s"} to qualify. Add more or remove the deal to continue.`:"The custom deal isn't available right now. Remove it to continue."}),i.jsx("button",{className:"gzp-btn gzp-btn-primary gzp-btn-block",onClick:()=>{te(!1),Ne(!0)},disabled:lr,type:"button",children:"Add delivery details"}),lr&&i.jsx("button",{type:"button",className:"gzp-btn gzp-btn-ghost gzp-btn-block",style:{marginTop:8},onClick:()=>{O.enabled?(te(!1),se(!0)):En()},children:O.enabled?"Add more items to my deal":"Remove custom deal"})]})]})]})}),ve&&i.jsx("div",{className:"gzp-sheet-overlay",onClick:()=>Ne(!1),children:i.jsxs("div",{className:"gzp-sheet",onClick:c=>c.stopPropagation(),role:"dialog","aria-label":"Delivery details",children:[i.jsxs("div",{className:"gzp-sheet-head",children:[i.jsx("button",{className:"gzp-icon-btn",onClick:()=>{Ne(!1),te(!0)},"aria-label":"Back to your order",type:"button",children:i.jsx(Ka,{dir:"left"})}),i.jsx("h2",{children:"Where should we send it?"})]}),i.jsxs("form",{onSubmit:sl,style:{display:"contents"},children:[i.jsx("div",{className:"gzp-sheet-body",children:i.jsxs("div",{className:"gzp-form",children:[i.jsxs("label",{className:"gzp-field",children:[i.jsx("span",{children:"Your name"}),i.jsx("input",{required:!0,value:h.name,onChange:c=>j({...h,name:c.target.value}),placeholder:"Who's the rider asking for?"})]}),i.jsxs("label",{className:"gzp-field",children:[i.jsx("span",{children:"Mobile number"}),i.jsx("input",{required:!0,type:"tel",inputMode:"numeric",pattern:"[0-9+]*",maxLength:14,value:h.phone,onChange:c=>j({...h,phone:Ji(c.target.value)}),onPaste:c=>{c.preventDefault();const g=(c.clipboardData||window.clipboardData).getData("text");j(k=>({...k,phone:Ji(k.phone+g)}))},placeholder:"03001234567"})]}),i.jsxs("label",{className:"gzp-field",children:[i.jsx("span",{children:"Delivery address"}),i.jsx("textarea",{required:!0,rows:3,value:h.address,onChange:c=>j({...h,address:c.target.value}),placeholder:"House or flat number, street, area, nearest landmark"})]}),i.jsx(nf,{cfg:$t,value:xr,onChange:gn}),jr?i.jsx(of,{cfg:$t,amountLabel:pt(zn),jazz:bt}):i.jsxs("p",{className:"gzp-note",children:[i.jsx(Xc,{}),i.jsxs("span",{children:[i.jsx("b",{children:"Cash on delivery."})," Pay the rider when the food arrives. We'll call this number if we can't find the address."]})]}),he&&i.jsx("p",{className:"gzp-error",children:he})]})}),i.jsxs("div",{className:"gzp-sheet-foot",children:[i.jsx("div",{className:"gzp-totals",children:i.jsxs("div",{className:"gzp-grand",children:[i.jsx("span",{children:"Total to pay"}),i.jsx("span",{children:pt(zn)})]})}),i.jsx("button",{type:"submit",className:"gzp-btn gzp-btn-primary gzp-btn-block",disabled:!Cn,children:Ce?"Sending to the kitchen…":jr&&!bt.ready?bt.uploading?"Uploading screenshot…":"Add payment details to continue":"Place order"})]})]})]})}),hr&&i.jsx("div",{className:"gzp-sheet-overlay",onClick:()=>ft(!1),children:i.jsxs("div",{className:"gzp-sheet",onClick:c=>c.stopPropagation(),role:"dialog","aria-label":"Track your order",children:[i.jsxs("div",{className:"gzp-sheet-head",children:[i.jsx("h2",{children:"Track your order"}),i.jsx("button",{className:"gzp-icon-btn",onClick:()=>ft(!1),"aria-label":"Close",type:"button",children:"✕"})]}),i.jsxs("form",{onSubmit:cl,style:{display:"contents"},children:[i.jsx("div",{className:"gzp-sheet-body",children:i.jsxs("div",{className:"gzp-form",children:[i.jsxs("label",{className:"gzp-field",children:[i.jsx("span",{children:"Mobile number used at checkout"}),i.jsx("input",{required:!0,autoFocus:!0,type:"tel",inputMode:"numeric",pattern:"[0-9+]*",maxLength:14,value:Vr,onChange:c=>hn(Ji(c.target.value)),onPaste:c=>{c.preventDefault();const g=(c.clipboardData||window.clipboardData).getData("text");hn(k=>Ji(k+g))},placeholder:"03001234567"})]}),Ho&&i.jsx("p",{className:"gzp-error",children:Ho})]})}),i.jsx("div",{className:"gzp-sheet-foot",children:i.jsx("button",{type:"submit",className:"gzp-btn gzp-btn-primary gzp-btn-block",disabled:yr,children:yr?"Looking…":"Find my order"})})]})]})})]})}class Hf extends $c.Component{constructor(u){super(u);hc(this,"handleReload",()=>{try{localStorage.removeItem("gzp_last_order")}catch{}window.location.reload()});this.state={hasError:!1}}static getDerivedStateFromError(){return{hasError:!0}}componentDidCatch(u,z){console.error("GenZ Pizza Land crashed while rendering:",u,z)}render(){return this.state.hasError?i.jsxs("div",{style:{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:14,padding:24,textAlign:"center",fontFamily:"system-ui, sans-serif",background:"#FFF8EF",color:"#252525"},children:[i.jsx("h1",{style:{fontSize:"1.3rem",margin:0},children:"Something went wrong on our end"}),i.jsx("p",{style:{maxWidth:420,opacity:.8,margin:0},children:"Your order may still have gone through — if you already saw an order number, it's safe. Reloading usually fixes this."}),i.jsx("button",{type:"button",onClick:this.handleReload,style:{padding:"10px 22px",borderRadius:8,border:"none",background:"#E6392F",color:"#fff",fontWeight:600,cursor:"pointer"},children:"Reload"})]}):this.props.children}}const Qf=["🍕","🍔","🍟","🌭","🌮","🥤","🍗","🍩","🥪","🍦"],Oc=["🍔","🍕","🍟","🍗","🌭","🥪","🌯","🌮","🍩"],Fc=["✨","⭐"],Ie=(s,f)=>s+Math.random()*(f-s);function Vf(s,f){const u=Math.ceil(f*1.6),z=document.createElement("canvas");z.width=u,z.height=u;const w=z.getContext("2d");return w.textAlign="center",w.textBaseline="middle",w.font=`${f}px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif`,w.fillText(s,u/2,u/2+f*.05),z}function Yf(){const s=b.useRef(null);return b.useEffect(()=>{var He;const f=s.current;if(!f)return;const u=f.getContext("2d"),z=(He=window.matchMedia)==null?void 0:He.call(window,"(prefers-reduced-motion: reduce)").matches;let w=0,P=0,q=1,Y=[],$=[],ge=[],O=0,T=!1;const B={x:-9999,y:-9999,active:!1},se=document.createElement("div");se.setAttribute("aria-hidden","true"),Object.assign(se.style,{position:"fixed",inset:"0",zIndex:"1001",overflow:"hidden",pointerEvents:"none"}),document.body.appendChild(se);const ae=()=>window.innerWidth<700,ee=()=>{q=Math.min(window.devicePixelRatio||1,ae()?1.5:2),w=window.innerWidth,P=window.innerHeight,f.width=Math.round(w*q),f.height=Math.round(P*q),f.style.width=`${w}px`,f.style.height=`${P}px`,u.setTransform(q,0,0,q,0,0);const Le=ae(),I=Math.min(Le?34:72,Math.round(w*P/(Le?15e3:17e3))),ne=Le?9:16;Y=Array.from({length:I},()=>({x:Ie(0,w),y:Ie(0,P),vx:Ie(-.22,.22),vy:Ie(-.22,.22),r:Ie(1.1,2.8),life:1,temp:!1})),ge=Qf.map(S=>Vf(S,28)),$=Array.from({length:ne},(S,A)=>({s:ge[A%ge.length],x:Ie(0,w),y:Ie(0,P),vx:Ie(-.35,.35)||.2,vy:Ie(-.3,-.08),rot:Ie(0,Math.PI*2),vr:Ie(-.008,.008),scale:Ie(.55,1.05),alpha:Ie(.3,.55),phase:Ie(0,6.28)}))},F=(Le,I)=>{if(!z){const ce=Math.hypot(w,P)||1;$.forEach(fe=>{const L=fe.x-Le,H=fe.y-I,D=Math.hypot(L,H),h=D>1?Math.atan2(H,L):Ie(0,Math.PI*2),j=3+(1-Math.min(D/ce,1))*3;fe.vx+=Math.cos(h)*j+Ie(-1,1),fe.vy+=Math.sin(h)*j+Ie(-1,1),fe.vr+=Ie(-.08,.08)})}const ne=2+Math.floor(Math.random()*3),S=ne>2&&Math.random()<.35?2:1,A=Array.from({length:ne-S},()=>({emoji:Oc[Math.floor(Math.random()*Oc.length)],size:Ie(22,34)}));for(let ce=0;ce<S;ce++)A.push({emoji:Fc[Math.floor(Math.random()*Fc.length)],size:Ie(15,23)});A.forEach(({emoji:ce,size:fe},L)=>{const H=L/A.length*Math.PI*2+Ie(-.35,.35),D=Ie(55,115),h=Math.cos(H)*D,j=Math.sin(H)*D-Ie(18,48),ue=document.createElement("span");if(ue.textContent=ce,Object.assign(ue.style,{position:"absolute",left:`${Le}px`,top:`${I}px`,fontSize:`${fe}px`,lineHeight:"1",pointerEvents:"none",userSelect:"none",filter:"drop-shadow(0 2px 5px rgba(30,20,10,0.3))",transform:"translate(-50%, -50%) scale(0.3)"}),se.appendChild(ue),z){ue.style.transform=`translate(calc(-50% + ${h*.35}px), calc(-50% + ${j*.35}px)) scale(1)`,window.setTimeout(()=>ue.remove(),550);return}const ye=ue.animate([{opacity:0,transform:"translate(-50%, -50%) scale(0.3) rotate(0deg)"},{opacity:1,transform:"translate(-50%, -50%) scale(1.25) rotate(10deg)",offset:.18},{opacity:1,transform:"translate(-50%, -50%) scale(1) rotate(-5deg)",offset:.34},{opacity:0,transform:`translate(calc(-50% + ${h}px), calc(-50% + ${j}px)) scale(0.7) rotate(${Ie(-55,55)}deg)`}],{duration:Ie(750,1050),easing:"cubic-bezier(0.2, 0.75, 0.3, 1)",fill:"forwards"});ye.onfinish=()=>ue.remove()})},te=Le=>{u.clearRect(0,0,w,P);const ne=ae()?150:200;if(B.active){const S=u.createRadialGradient(B.x,B.y,0,B.x,B.y,220);S.addColorStop(0,"rgba(255,240,200,0.35)"),S.addColorStop(1,"rgba(255,240,200,0)"),u.fillStyle=S,u.fillRect(B.x-220,B.y-220,440,440)}for(let S=Y.length-1;S>=0;S--){const A=Y[S];if(A.temp&&(A.life-=.004,A.life<=0)){Y.splice(S,1);continue}if(B.active){const fe=B.x-A.x,L=B.y-A.y,H=Math.hypot(fe,L);H<ne&&H>1&&(A.vx+=fe/H*.012,A.vy+=L/H*.012)}A.vx*=.985,A.vy*=.985,Math.hypot(A.vx,A.vy)<.08&&(A.vx+=Ie(-.01,.01),A.vy+=Ie(-.01,.01)),A.x+=A.vx,A.y+=A.vy,A.x<-20?A.x=w+20:A.x>w+20&&(A.x=-20),A.y<-20?A.y=P+20:A.y>P+20&&(A.y=-20)}for(const S of Y){const A=.35+.5*(S.r/2.8);u.fillStyle=`rgba(255,255,255,${Math.min(1,A+.25)*S.life})`,u.shadowColor="rgba(255,255,255,0.8)",u.shadowBlur=8,u.beginPath(),u.arc(S.x,S.y,S.r,0,Math.PI*2),u.fill()}u.shadowBlur=0;for(const S of $){S.vx*=.99,S.vy*=.99,Math.hypot(S.vx,S.vy)<.12&&(S.vx+=Ie(-.01,.01),S.vy-=.004),S.vr*=.99,Math.abs(S.vr)<.004&&(S.vr+=S.vr>=0?4e-4:-4e-4),S.x+=S.vx,S.y+=S.vy+Math.sin(Le/1500+S.phase)*.12,S.rot+=S.vr;const A=40;S.x<-A?S.x=w+A:S.x>w+A&&(S.x=-A),S.y<-A?S.y=P+A:S.y>P+A&&(S.y=-A),u.save(),u.translate(S.x,S.y),u.rotate(S.rot),u.globalAlpha=S.alpha;const ce=S.s.width*S.scale;u.drawImage(S.s,-ce/2,-ce/2,ce,ce),u.restore()}u.globalAlpha=1,T&&(O=requestAnimationFrame(te))},ve=()=>{T||z||(T=!0,O=requestAnimationFrame(te))},Ne=()=>{T=!1,cancelAnimationFrame(O)};ee(),z?te(0):ve();let me=0;const oe=()=>{clearTimeout(me),me=setTimeout(()=>{ee(),z&&te(0)},150)},he=Le=>{B.x=Le.clientX,B.y=Le.clientY,B.active=!0},xe=()=>{B.active=!1},Ce=Le=>{B.x=Le.clientX,B.y=Le.clientY,B.active=!0,F(Le.clientX,Le.clientY),Le.pointerType==="touch"&&setTimeout(xe,900)},re=()=>document.hidden?Ne():ve();return window.addEventListener("resize",oe),window.addEventListener("pointermove",he,{passive:!0}),window.addEventListener("pointerdown",Ce,{passive:!0}),window.addEventListener("pointerleave",xe),document.addEventListener("mouseleave",xe),document.addEventListener("visibilitychange",re),()=>{Ne(),clearTimeout(me),se.remove(),window.removeEventListener("resize",oe),window.removeEventListener("pointermove",he),window.removeEventListener("pointerdown",Ce),window.removeEventListener("pointerleave",xe),document.removeEventListener("mouseleave",xe),document.removeEventListener("visibilitychange",re)}},[]),i.jsx("canvas",{ref:s,"aria-hidden":"true",style:{position:"fixed",inset:0,zIndex:0,pointerEvents:"none"}})}$p.createRoot(document.getElementById("root")).render(i.jsxs($c.StrictMode,{children:[i.jsx(Yf,{}),i.jsx(Hf,{children:i.jsx(Wf,{})})]}));
