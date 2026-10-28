var Up=Object.defineProperty;var Wp=(l,u,c)=>u in l?Up(l,u,{enumerable:!0,configurable:!0,writable:!0,value:c}):l[u]=c;var su=(l,u,c)=>Wp(l,typeof u!="symbol"?u+"":u,c);(function(){const u=document.createElement("link").relList;if(u&&u.supports&&u.supports("modulepreload"))return;for(const z of document.querySelectorAll('link[rel="modulepreload"]'))y(z);new MutationObserver(z=>{for(const C of z)if(C.type==="childList")for(const S of C.addedNodes)S.tagName==="LINK"&&S.rel==="modulepreload"&&y(S)}).observe(document,{childList:!0,subtree:!0});function c(z){const C={};return z.integrity&&(C.integrity=z.integrity),z.referrerPolicy&&(C.referrerPolicy=z.referrerPolicy),z.crossOrigin==="use-credentials"?C.credentials="include":z.crossOrigin==="anonymous"?C.credentials="omit":C.credentials="same-origin",C}function y(z){if(z.ep)return;z.ep=!0;const C=c(z);fetch(z.href,C)}})();function Pu(l){return l&&l.__esModule&&Object.prototype.hasOwnProperty.call(l,"default")?l.default:l}var Us={exports:{}},Co={},Ws={exports:{}},Ee={};/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var cu;function Hp(){if(cu)return Ee;cu=1;var l=Symbol.for("react.element"),u=Symbol.for("react.portal"),c=Symbol.for("react.fragment"),y=Symbol.for("react.strict_mode"),z=Symbol.for("react.profiler"),C=Symbol.for("react.provider"),S=Symbol.for("react.context"),O=Symbol.for("react.forward_ref"),j=Symbol.for("react.suspense"),ae=Symbol.for("react.memo"),D=Symbol.for("react.lazy"),N=Symbol.iterator;function B(h){return h===null||typeof h!="object"?null:(h=N&&h[N]||h["@@iterator"],typeof h=="function"?h:null)}var ue={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},J=Object.assign,le={};function P(h,E,ke){this.props=h,this.context=E,this.refs=le,this.updater=ke||ue}P.prototype.isReactComponent={},P.prototype.setState=function(h,E){if(typeof h!="object"&&typeof h!="function"&&h!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,h,E,"setState")},P.prototype.forceUpdate=function(h){this.updater.enqueueForceUpdate(this,h,"forceUpdate")};function we(){}we.prototype=P.prototype;function X(h,E,ke){this.props=h,this.context=E,this.refs=le,this.updater=ke||ue}var ge=X.prototype=new we;ge.constructor=X,J(ge,P.prototype),ge.isPureReactComponent=!0;var ye=Array.isArray,pe=Object.prototype.hasOwnProperty,ve={current:null},ze={key:!0,ref:!0,__self:!0,__source:!0};function Ce(h,E,ke){var xe,_e={},Pe=null,Me=null;if(E!=null)for(xe in E.ref!==void 0&&(Me=E.ref),E.key!==void 0&&(Pe=""+E.key),E)pe.call(E,xe)&&!ze.hasOwnProperty(xe)&&(_e[xe]=E[xe]);var Te=arguments.length-2;if(Te===1)_e.children=ke;else if(1<Te){for(var $e=Array(Te),St=0;St<Te;St++)$e[St]=arguments[St+2];_e.children=$e}if(h&&h.defaultProps)for(xe in Te=h.defaultProps,Te)_e[xe]===void 0&&(_e[xe]=Te[xe]);return{$$typeof:l,type:h,key:Pe,ref:Me,props:_e,_owner:ve.current}}function ie(h,E){return{$$typeof:l,type:h.type,key:E,ref:h.ref,props:h.props,_owner:h._owner}}function V(h){return typeof h=="object"&&h!==null&&h.$$typeof===l}function Je(h){var E={"=":"=0",":":"=2"};return"$"+h.replace(/[=:]/g,function(ke){return E[ke]})}var $=/\/+/g;function L(h,E){return typeof h=="object"&&h!==null&&h.key!=null?Je(""+h.key):E.toString(36)}function W(h,E,ke,xe,_e){var Pe=typeof h;(Pe==="undefined"||Pe==="boolean")&&(h=null);var Me=!1;if(h===null)Me=!0;else switch(Pe){case"string":case"number":Me=!0;break;case"object":switch(h.$$typeof){case l:case u:Me=!0}}if(Me)return Me=h,_e=_e(Me),h=xe===""?"."+L(Me,0):xe,ye(_e)?(ke="",h!=null&&(ke=h.replace($,"$&/")+"/"),W(_e,E,ke,"",function(St){return St})):_e!=null&&(V(_e)&&(_e=ie(_e,ke+(!_e.key||Me&&Me.key===_e.key?"":(""+_e.key).replace($,"$&/")+"/")+h)),E.push(_e)),1;if(Me=0,xe=xe===""?".":xe+":",ye(h))for(var Te=0;Te<h.length;Te++){Pe=h[Te];var $e=xe+L(Pe,Te);Me+=W(Pe,E,ke,$e,_e)}else if($e=B(h),typeof $e=="function")for(h=$e.call(h),Te=0;!(Pe=h.next()).done;)Pe=Pe.value,$e=xe+L(Pe,Te++),Me+=W(Pe,E,ke,$e,_e);else if(Pe==="object")throw E=String(h),Error("Objects are not valid as a React child (found: "+(E==="[object Object]"?"object with keys {"+Object.keys(h).join(", ")+"}":E)+"). If you meant to render a collection of children, use an array instead.");return Me}function Ne(h,E,ke){if(h==null)return h;var xe=[],_e=0;return W(h,xe,"","",function(Pe){return E.call(ke,Pe,_e++)}),xe}function me(h){if(h._status===-1){var E=h._result;E=E(),E.then(function(ke){(h._status===0||h._status===-1)&&(h._status=1,h._result=ke)},function(ke){(h._status===0||h._status===-1)&&(h._status=2,h._result=ke)}),h._status===-1&&(h._status=0,h._result=E)}if(h._status===1)return h._result.default;throw h._result}var ne={current:null},T={transition:null},H={ReactCurrentDispatcher:ne,ReactCurrentBatchConfig:T,ReactCurrentOwner:ve};function U(){throw Error("act(...) is not supported in production builds of React.")}return Ee.Children={map:Ne,forEach:function(h,E,ke){Ne(h,function(){E.apply(this,arguments)},ke)},count:function(h){var E=0;return Ne(h,function(){E++}),E},toArray:function(h){return Ne(h,function(E){return E})||[]},only:function(h){if(!V(h))throw Error("React.Children.only expected to receive a single React element child.");return h}},Ee.Component=P,Ee.Fragment=c,Ee.Profiler=z,Ee.PureComponent=X,Ee.StrictMode=y,Ee.Suspense=j,Ee.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=H,Ee.act=U,Ee.cloneElement=function(h,E,ke){if(h==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+h+".");var xe=J({},h.props),_e=h.key,Pe=h.ref,Me=h._owner;if(E!=null){if(E.ref!==void 0&&(Pe=E.ref,Me=ve.current),E.key!==void 0&&(_e=""+E.key),h.type&&h.type.defaultProps)var Te=h.type.defaultProps;for($e in E)pe.call(E,$e)&&!ze.hasOwnProperty($e)&&(xe[$e]=E[$e]===void 0&&Te!==void 0?Te[$e]:E[$e])}var $e=arguments.length-2;if($e===1)xe.children=ke;else if(1<$e){Te=Array($e);for(var St=0;St<$e;St++)Te[St]=arguments[St+2];xe.children=Te}return{$$typeof:l,type:h.type,key:_e,ref:Pe,props:xe,_owner:Me}},Ee.createContext=function(h){return h={$$typeof:S,_currentValue:h,_currentValue2:h,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},h.Provider={$$typeof:C,_context:h},h.Consumer=h},Ee.createElement=Ce,Ee.createFactory=function(h){var E=Ce.bind(null,h);return E.type=h,E},Ee.createRef=function(){return{current:null}},Ee.forwardRef=function(h){return{$$typeof:O,render:h}},Ee.isValidElement=V,Ee.lazy=function(h){return{$$typeof:D,_payload:{_status:-1,_result:h},_init:me}},Ee.memo=function(h,E){return{$$typeof:ae,type:h,compare:E===void 0?null:E}},Ee.startTransition=function(h){var E=T.transition;T.transition={};try{h()}finally{T.transition=E}},Ee.unstable_act=U,Ee.useCallback=function(h,E){return ne.current.useCallback(h,E)},Ee.useContext=function(h){return ne.current.useContext(h)},Ee.useDebugValue=function(){},Ee.useDeferredValue=function(h){return ne.current.useDeferredValue(h)},Ee.useEffect=function(h,E){return ne.current.useEffect(h,E)},Ee.useId=function(){return ne.current.useId()},Ee.useImperativeHandle=function(h,E,ke){return ne.current.useImperativeHandle(h,E,ke)},Ee.useInsertionEffect=function(h,E){return ne.current.useInsertionEffect(h,E)},Ee.useLayoutEffect=function(h,E){return ne.current.useLayoutEffect(h,E)},Ee.useMemo=function(h,E){return ne.current.useMemo(h,E)},Ee.useReducer=function(h,E,ke){return ne.current.useReducer(h,E,ke)},Ee.useRef=function(h){return ne.current.useRef(h)},Ee.useState=function(h){return ne.current.useState(h)},Ee.useSyncExternalStore=function(h,E,ke){return ne.current.useSyncExternalStore(h,E,ke)},Ee.useTransition=function(){return ne.current.useTransition()},Ee.version="18.3.1",Ee}var du;function ic(){return du||(du=1,Ws.exports=Hp()),Ws.exports}/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var uu;function Qp(){if(uu)return Co;uu=1;var l=ic(),u=Symbol.for("react.element"),c=Symbol.for("react.fragment"),y=Object.prototype.hasOwnProperty,z=l.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,C={key:!0,ref:!0,__self:!0,__source:!0};function S(O,j,ae){var D,N={},B=null,ue=null;ae!==void 0&&(B=""+ae),j.key!==void 0&&(B=""+j.key),j.ref!==void 0&&(ue=j.ref);for(D in j)y.call(j,D)&&!C.hasOwnProperty(D)&&(N[D]=j[D]);if(O&&O.defaultProps)for(D in j=O.defaultProps,j)N[D]===void 0&&(N[D]=j[D]);return{$$typeof:u,type:O,key:B,ref:ue,props:N,_owner:z.current}}return Co.Fragment=c,Co.jsx=S,Co.jsxs=S,Co}var pu;function Yp(){return pu||(pu=1,Us.exports=Qp()),Us.exports}var i=Yp(),v=ic();const Ar=Pu(v);var rl={},Hs={exports:{}},Tt={},Qs={exports:{}},Ys={};/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var fu;function Vp(){return fu||(fu=1,(function(l){function u(T,H){var U=T.length;T.push(H);e:for(;0<U;){var h=U-1>>>1,E=T[h];if(0<z(E,H))T[h]=H,T[U]=E,U=h;else break e}}function c(T){return T.length===0?null:T[0]}function y(T){if(T.length===0)return null;var H=T[0],U=T.pop();if(U!==H){T[0]=U;e:for(var h=0,E=T.length,ke=E>>>1;h<ke;){var xe=2*(h+1)-1,_e=T[xe],Pe=xe+1,Me=T[Pe];if(0>z(_e,U))Pe<E&&0>z(Me,_e)?(T[h]=Me,T[Pe]=U,h=Pe):(T[h]=_e,T[xe]=U,h=xe);else if(Pe<E&&0>z(Me,U))T[h]=Me,T[Pe]=U,h=Pe;else break e}}return H}function z(T,H){var U=T.sortIndex-H.sortIndex;return U!==0?U:T.id-H.id}if(typeof performance=="object"&&typeof performance.now=="function"){var C=performance;l.unstable_now=function(){return C.now()}}else{var S=Date,O=S.now();l.unstable_now=function(){return S.now()-O}}var j=[],ae=[],D=1,N=null,B=3,ue=!1,J=!1,le=!1,P=typeof setTimeout=="function"?setTimeout:null,we=typeof clearTimeout=="function"?clearTimeout:null,X=typeof setImmediate<"u"?setImmediate:null;typeof navigator<"u"&&navigator.scheduling!==void 0&&navigator.scheduling.isInputPending!==void 0&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function ge(T){for(var H=c(ae);H!==null;){if(H.callback===null)y(ae);else if(H.startTime<=T)y(ae),H.sortIndex=H.expirationTime,u(j,H);else break;H=c(ae)}}function ye(T){if(le=!1,ge(T),!J)if(c(j)!==null)J=!0,me(pe);else{var H=c(ae);H!==null&&ne(ye,H.startTime-T)}}function pe(T,H){J=!1,le&&(le=!1,we(Ce),Ce=-1),ue=!0;var U=B;try{for(ge(H),N=c(j);N!==null&&(!(N.expirationTime>H)||T&&!Je());){var h=N.callback;if(typeof h=="function"){N.callback=null,B=N.priorityLevel;var E=h(N.expirationTime<=H);H=l.unstable_now(),typeof E=="function"?N.callback=E:N===c(j)&&y(j),ge(H)}else y(j);N=c(j)}if(N!==null)var ke=!0;else{var xe=c(ae);xe!==null&&ne(ye,xe.startTime-H),ke=!1}return ke}finally{N=null,B=U,ue=!1}}var ve=!1,ze=null,Ce=-1,ie=5,V=-1;function Je(){return!(l.unstable_now()-V<ie)}function $(){if(ze!==null){var T=l.unstable_now();V=T;var H=!0;try{H=ze(!0,T)}finally{H?L():(ve=!1,ze=null)}}else ve=!1}var L;if(typeof X=="function")L=function(){X($)};else if(typeof MessageChannel<"u"){var W=new MessageChannel,Ne=W.port2;W.port1.onmessage=$,L=function(){Ne.postMessage(null)}}else L=function(){P($,0)};function me(T){ze=T,ve||(ve=!0,L())}function ne(T,H){Ce=P(function(){T(l.unstable_now())},H)}l.unstable_IdlePriority=5,l.unstable_ImmediatePriority=1,l.unstable_LowPriority=4,l.unstable_NormalPriority=3,l.unstable_Profiling=null,l.unstable_UserBlockingPriority=2,l.unstable_cancelCallback=function(T){T.callback=null},l.unstable_continueExecution=function(){J||ue||(J=!0,me(pe))},l.unstable_forceFrameRate=function(T){0>T||125<T?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):ie=0<T?Math.floor(1e3/T):5},l.unstable_getCurrentPriorityLevel=function(){return B},l.unstable_getFirstCallbackNode=function(){return c(j)},l.unstable_next=function(T){switch(B){case 1:case 2:case 3:var H=3;break;default:H=B}var U=B;B=H;try{return T()}finally{B=U}},l.unstable_pauseExecution=function(){},l.unstable_requestPaint=function(){},l.unstable_runWithPriority=function(T,H){switch(T){case 1:case 2:case 3:case 4:case 5:break;default:T=3}var U=B;B=T;try{return H()}finally{B=U}},l.unstable_scheduleCallback=function(T,H,U){var h=l.unstable_now();switch(typeof U=="object"&&U!==null?(U=U.delay,U=typeof U=="number"&&0<U?h+U:h):U=h,T){case 1:var E=-1;break;case 2:E=250;break;case 5:E=1073741823;break;case 4:E=1e4;break;default:E=5e3}return E=U+E,T={id:D++,callback:H,priorityLevel:T,startTime:U,expirationTime:E,sortIndex:-1},U>h?(T.sortIndex=U,u(ae,T),c(j)===null&&T===c(ae)&&(le?(we(Ce),Ce=-1):le=!0,ne(ye,U-h))):(T.sortIndex=E,u(j,T),J||ue||(J=!0,me(pe))),T},l.unstable_shouldYield=Je,l.unstable_wrapCallback=function(T){var H=B;return function(){var U=B;B=H;try{return T.apply(this,arguments)}finally{B=U}}}})(Ys)),Ys}var mu;function Gp(){return mu||(mu=1,Qs.exports=Vp()),Qs.exports}/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var hu;function Kp(){if(hu)return Tt;hu=1;var l=ic(),u=Gp();function c(e){for(var t="https://reactjs.org/docs/error-decoder.html?invariant="+e,r=1;r<arguments.length;r++)t+="&args[]="+encodeURIComponent(arguments[r]);return"Minified React error #"+e+"; visit "+t+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var y=new Set,z={};function C(e,t){S(e,t),S(e+"Capture",t)}function S(e,t){for(z[e]=t,e=0;e<t.length;e++)y.add(t[e])}var O=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),j=Object.prototype.hasOwnProperty,ae=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,D={},N={};function B(e){return j.call(N,e)?!0:j.call(D,e)?!1:ae.test(e)?N[e]=!0:(D[e]=!0,!1)}function ue(e,t,r,n){if(r!==null&&r.type===0)return!1;switch(typeof t){case"function":case"symbol":return!0;case"boolean":return n?!1:r!==null?!r.acceptsBooleans:(e=e.toLowerCase().slice(0,5),e!=="data-"&&e!=="aria-");default:return!1}}function J(e,t,r,n){if(t===null||typeof t>"u"||ue(e,t,r,n))return!0;if(n)return!1;if(r!==null)switch(r.type){case 3:return!t;case 4:return t===!1;case 5:return isNaN(t);case 6:return isNaN(t)||1>t}return!1}function le(e,t,r,n,o,a,s){this.acceptsBooleans=t===2||t===3||t===4,this.attributeName=n,this.attributeNamespace=o,this.mustUseProperty=r,this.propertyName=e,this.type=t,this.sanitizeURL=a,this.removeEmptyString=s}var P={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(e){P[e]=new le(e,0,!1,e,null,!1,!1)}),[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(e){var t=e[0];P[t]=new le(t,1,!1,e[1],null,!1,!1)}),["contentEditable","draggable","spellCheck","value"].forEach(function(e){P[e]=new le(e,2,!1,e.toLowerCase(),null,!1,!1)}),["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(e){P[e]=new le(e,2,!1,e,null,!1,!1)}),"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(e){P[e]=new le(e,3,!1,e.toLowerCase(),null,!1,!1)}),["checked","multiple","muted","selected"].forEach(function(e){P[e]=new le(e,3,!0,e,null,!1,!1)}),["capture","download"].forEach(function(e){P[e]=new le(e,4,!1,e,null,!1,!1)}),["cols","rows","size","span"].forEach(function(e){P[e]=new le(e,6,!1,e,null,!1,!1)}),["rowSpan","start"].forEach(function(e){P[e]=new le(e,5,!1,e.toLowerCase(),null,!1,!1)});var we=/[\-:]([a-z])/g;function X(e){return e[1].toUpperCase()}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(e){var t=e.replace(we,X);P[t]=new le(t,1,!1,e,null,!1,!1)}),"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(e){var t=e.replace(we,X);P[t]=new le(t,1,!1,e,"http://www.w3.org/1999/xlink",!1,!1)}),["xml:base","xml:lang","xml:space"].forEach(function(e){var t=e.replace(we,X);P[t]=new le(t,1,!1,e,"http://www.w3.org/XML/1998/namespace",!1,!1)}),["tabIndex","crossOrigin"].forEach(function(e){P[e]=new le(e,1,!1,e.toLowerCase(),null,!1,!1)}),P.xlinkHref=new le("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1),["src","href","action","formAction"].forEach(function(e){P[e]=new le(e,1,!1,e.toLowerCase(),null,!0,!0)});function ge(e,t,r,n){var o=P.hasOwnProperty(t)?P[t]:null;(o!==null?o.type!==0:n||!(2<t.length)||t[0]!=="o"&&t[0]!=="O"||t[1]!=="n"&&t[1]!=="N")&&(J(t,r,o,n)&&(r=null),n||o===null?B(t)&&(r===null?e.removeAttribute(t):e.setAttribute(t,""+r)):o.mustUseProperty?e[o.propertyName]=r===null?o.type===3?!1:"":r:(t=o.attributeName,n=o.attributeNamespace,r===null?e.removeAttribute(t):(o=o.type,r=o===3||o===4&&r===!0?"":""+r,n?e.setAttributeNS(n,t,r):e.setAttribute(t,r))))}var ye=l.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,pe=Symbol.for("react.element"),ve=Symbol.for("react.portal"),ze=Symbol.for("react.fragment"),Ce=Symbol.for("react.strict_mode"),ie=Symbol.for("react.profiler"),V=Symbol.for("react.provider"),Je=Symbol.for("react.context"),$=Symbol.for("react.forward_ref"),L=Symbol.for("react.suspense"),W=Symbol.for("react.suspense_list"),Ne=Symbol.for("react.memo"),me=Symbol.for("react.lazy"),ne=Symbol.for("react.offscreen"),T=Symbol.iterator;function H(e){return e===null||typeof e!="object"?null:(e=T&&e[T]||e["@@iterator"],typeof e=="function"?e:null)}var U=Object.assign,h;function E(e){if(h===void 0)try{throw Error()}catch(r){var t=r.stack.trim().match(/\n( *(at )?)/);h=t&&t[1]||""}return`
`+h+e}var ke=!1;function xe(e,t){if(!e||ke)return"";ke=!0;var r=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(t)if(t=function(){throw Error()},Object.defineProperty(t.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(t,[])}catch(w){var n=w}Reflect.construct(e,[],t)}else{try{t.call()}catch(w){n=w}e.call(t.prototype)}else{try{throw Error()}catch(w){n=w}e()}}catch(w){if(w&&n&&typeof w.stack=="string"){for(var o=w.stack.split(`
`),a=n.stack.split(`
`),s=o.length-1,p=a.length-1;1<=s&&0<=p&&o[s]!==a[p];)p--;for(;1<=s&&0<=p;s--,p--)if(o[s]!==a[p]){if(s!==1||p!==1)do if(s--,p--,0>p||o[s]!==a[p]){var f=`
`+o[s].replace(" at new "," at ");return e.displayName&&f.includes("<anonymous>")&&(f=f.replace("<anonymous>",e.displayName)),f}while(1<=s&&0<=p);break}}}finally{ke=!1,Error.prepareStackTrace=r}return(e=e?e.displayName||e.name:"")?E(e):""}function _e(e){switch(e.tag){case 5:return E(e.type);case 16:return E("Lazy");case 13:return E("Suspense");case 19:return E("SuspenseList");case 0:case 2:case 15:return e=xe(e.type,!1),e;case 11:return e=xe(e.type.render,!1),e;case 1:return e=xe(e.type,!0),e;default:return""}}function Pe(e){if(e==null)return null;if(typeof e=="function")return e.displayName||e.name||null;if(typeof e=="string")return e;switch(e){case ze:return"Fragment";case ve:return"Portal";case ie:return"Profiler";case Ce:return"StrictMode";case L:return"Suspense";case W:return"SuspenseList"}if(typeof e=="object")switch(e.$$typeof){case Je:return(e.displayName||"Context")+".Consumer";case V:return(e._context.displayName||"Context")+".Provider";case $:var t=e.render;return e=e.displayName,e||(e=t.displayName||t.name||"",e=e!==""?"ForwardRef("+e+")":"ForwardRef"),e;case Ne:return t=e.displayName||null,t!==null?t:Pe(e.type)||"Memo";case me:t=e._payload,e=e._init;try{return Pe(e(t))}catch{}}return null}function Me(e){var t=e.type;switch(e.tag){case 24:return"Cache";case 9:return(t.displayName||"Context")+".Consumer";case 10:return(t._context.displayName||"Context")+".Provider";case 18:return"DehydratedFragment";case 11:return e=t.render,e=e.displayName||e.name||"",t.displayName||(e!==""?"ForwardRef("+e+")":"ForwardRef");case 7:return"Fragment";case 5:return t;case 4:return"Portal";case 3:return"Root";case 6:return"Text";case 16:return Pe(t);case 8:return t===Ce?"StrictMode":"Mode";case 22:return"Offscreen";case 12:return"Profiler";case 21:return"Scope";case 13:return"Suspense";case 19:return"SuspenseList";case 25:return"TracingMarker";case 1:case 0:case 17:case 2:case 14:case 15:if(typeof t=="function")return t.displayName||t.name||null;if(typeof t=="string")return t}return null}function Te(e){switch(typeof e){case"boolean":case"number":case"string":case"undefined":return e;case"object":return e;default:return""}}function $e(e){var t=e.type;return(e=e.nodeName)&&e.toLowerCase()==="input"&&(t==="checkbox"||t==="radio")}function St(e){var t=$e(e)?"checked":"value",r=Object.getOwnPropertyDescriptor(e.constructor.prototype,t),n=""+e[t];if(!e.hasOwnProperty(t)&&typeof r<"u"&&typeof r.get=="function"&&typeof r.set=="function"){var o=r.get,a=r.set;return Object.defineProperty(e,t,{configurable:!0,get:function(){return o.call(this)},set:function(s){n=""+s,a.call(this,s)}}),Object.defineProperty(e,t,{enumerable:r.enumerable}),{getValue:function(){return n},setValue:function(s){n=""+s},stopTracking:function(){e._valueTracker=null,delete e[t]}}}}function Bi(e){e._valueTracker||(e._valueTracker=St(e))}function gn(e){if(!e)return!1;var t=e._valueTracker;if(!t)return!0;var r=t.getValue(),n="";return e&&(n=$e(e)?e.checked?"true":"false":e.value),e=n,e!==r?(t.setValue(e),!0):!1}function $i(e){if(e=e||(typeof document<"u"?document:void 0),typeof e>"u")return null;try{return e.activeElement||e.body}catch{return e.body}}function Xt(e,t){var r=t.checked;return U({},t,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:r??e._wrapperState.initialChecked})}function xl(e,t){var r=t.defaultValue==null?"":t.defaultValue,n=t.checked!=null?t.checked:t.defaultChecked;r=Te(t.value!=null?t.value:r),e._wrapperState={initialChecked:n,initialValue:r,controlled:t.type==="checkbox"||t.type==="radio"?t.checked!=null:t.value!=null}}function No(e,t){t=t.checked,t!=null&&ge(e,"checked",t,!1)}function zr(e,t){No(e,t);var r=Te(t.value),n=t.type;if(r!=null)n==="number"?(r===0&&e.value===""||e.value!=r)&&(e.value=""+r):e.value!==""+r&&(e.value=""+r);else if(n==="submit"||n==="reset"){e.removeAttribute("value");return}t.hasOwnProperty("value")?Br(e,t.type,r):t.hasOwnProperty("defaultValue")&&Br(e,t.type,Te(t.defaultValue)),t.checked==null&&t.defaultChecked!=null&&(e.defaultChecked=!!t.defaultChecked)}function Rt(e,t,r){if(t.hasOwnProperty("value")||t.hasOwnProperty("defaultValue")){var n=t.type;if(!(n!=="submit"&&n!=="reset"||t.value!==void 0&&t.value!==null))return;t=""+e._wrapperState.initialValue,r||t===e.value||(e.value=t),e.defaultValue=t}r=e.name,r!==""&&(e.name=""),e.defaultChecked=!!e._wrapperState.initialChecked,r!==""&&(e.name=r)}function Br(e,t,r){(t!=="number"||$i(e.ownerDocument)!==e)&&(r==null?e.defaultValue=""+e._wrapperState.initialValue:e.defaultValue!==""+r&&(e.defaultValue=""+r))}var $r=Array.isArray;function xn(e,t,r,n){if(e=e.options,t){t={};for(var o=0;o<r.length;o++)t["$"+r[o]]=!0;for(r=0;r<e.length;r++)o=t.hasOwnProperty("$"+e[r].value),e[r].selected!==o&&(e[r].selected=o),o&&n&&(e[r].defaultSelected=!0)}else{for(r=""+Te(r),t=null,o=0;o<e.length;o++){if(e[o].value===r){e[o].selected=!0,n&&(e[o].defaultSelected=!0);return}t!==null||e[o].disabled||(t=e[o])}t!==null&&(t.selected=!0)}}function vn(e,t){if(t.dangerouslySetInnerHTML!=null)throw Error(c(91));return U({},t,{value:void 0,defaultValue:void 0,children:""+e._wrapperState.initialValue})}function vl(e,t){var r=t.value;if(r==null){if(r=t.children,t=t.defaultValue,r!=null){if(t!=null)throw Error(c(92));if($r(r)){if(1<r.length)throw Error(c(93));r=r[0]}t=r}t==null&&(t=""),r=t}e._wrapperState={initialValue:Te(r)}}function Eo(e,t){var r=Te(t.value),n=Te(t.defaultValue);r!=null&&(r=""+r,r!==e.value&&(e.value=r),t.defaultValue==null&&e.defaultValue!==r&&(e.defaultValue=r)),n!=null&&(e.defaultValue=""+n)}function Ui(e){var t=e.textContent;t===e._wrapperState.initialValue&&t!==""&&t!==null&&(e.value=t)}function Wi(e){switch(e){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function Kn(e,t){return e==null||e==="http://www.w3.org/1999/xhtml"?Wi(t):e==="http://www.w3.org/2000/svg"&&t==="foreignObject"?"http://www.w3.org/1999/xhtml":e}var Ur,qn=(function(e){return typeof MSApp<"u"&&MSApp.execUnsafeLocalFunction?function(t,r,n,o){MSApp.execUnsafeLocalFunction(function(){return e(t,r,n,o)})}:e})(function(e,t){if(e.namespaceURI!=="http://www.w3.org/2000/svg"||"innerHTML"in e)e.innerHTML=t;else{for(Ur=Ur||document.createElement("div"),Ur.innerHTML="<svg>"+t.valueOf().toString()+"</svg>",t=Ur.firstChild;e.firstChild;)e.removeChild(e.firstChild);for(;t.firstChild;)e.appendChild(t.firstChild)}});function Wr(e,t){if(t){var r=e.firstChild;if(r&&r===e.lastChild&&r.nodeType===3){r.nodeValue=t;return}}e.textContent=t}var at={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},yn=["Webkit","ms","Moz","O"];Object.keys(at).forEach(function(e){yn.forEach(function(t){t=t+e.charAt(0).toUpperCase()+e.substring(1),at[t]=at[e]})});function se(e,t,r){return t==null||typeof t=="boolean"||t===""?"":r||typeof t!="number"||t===0||at.hasOwnProperty(e)&&at[e]?(""+t).trim():t+"px"}function er(e,t){e=e.style;for(var r in t)if(t.hasOwnProperty(r)){var n=r.indexOf("--")===0,o=se(r,t[r],n);r==="float"&&(r="cssFloat"),n?e.setProperty(r,o):e[r]=o}}var yl=U({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function bn(e,t){if(t){if(yl[e]&&(t.children!=null||t.dangerouslySetInnerHTML!=null))throw Error(c(137,e));if(t.dangerouslySetInnerHTML!=null){if(t.children!=null)throw Error(c(60));if(typeof t.dangerouslySetInnerHTML!="object"||!("__html"in t.dangerouslySetInnerHTML))throw Error(c(61))}if(t.style!=null&&typeof t.style!="object")throw Error(c(62))}}function Zn(e,t){if(e.indexOf("-")===-1)return typeof t.is=="string";switch(e){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var wn=null;function Hi(e){return e=e.target||e.srcElement||window,e.correspondingUseElement&&(e=e.correspondingUseElement),e.nodeType===3?e.parentNode:e}var ct=null,$t=null,kr=null;function Qi(e){if(e=uo(e)){if(typeof ct!="function")throw Error(c(280));var t=e.stateNode;t&&(t=xa(t),ct(e.stateNode,e.type,t))}}function zn(e){$t?kr?kr.push(e):kr=[e]:$t=e}function Hr(){if($t){var e=$t,t=kr;if(kr=$t=null,Qi(e),t)for(e=0;e<t.length;e++)Qi(t[e])}}function Qr(e,t){return e(t)}function Po(){}var Jn=!1;function Lo(e,t,r){if(Jn)return e(t,r);Jn=!0;try{return Qr(e,t,r)}finally{Jn=!1,($t!==null||kr!==null)&&(Po(),Hr())}}function G(e,t){var r=e.stateNode;if(r===null)return null;var n=xa(r);if(n===null)return null;r=n[t];e:switch(t){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(n=!n.disabled)||(e=e.type,n=!(e==="button"||e==="input"||e==="select"||e==="textarea")),e=!n;break e;default:e=!1}if(e)return null;if(r&&typeof r!="function")throw Error(c(231,t,typeof r));return r}var Ct=!1;if(O)try{var Ut={};Object.defineProperty(Ut,"passive",{get:function(){Ct=!0}}),window.addEventListener("test",Ut,Ut),window.removeEventListener("test",Ut,Ut)}catch{Ct=!1}function Xn(e,t,r,n,o,a,s,p,f){var w=Array.prototype.slice.call(arguments,3);try{t.apply(r,w)}catch(M){this.onError(M)}}var Ft=!1,ur=null,pr=!1,Yr=null,_o={onError:function(e){Ft=!0,ur=e}};function Mo(e,t,r,n,o,a,s,p,f){Ft=!1,ur=null,Xn.apply(_o,arguments)}function ei(e,t,r,n,o,a,s,p,f){if(Mo.apply(this,arguments),Ft){if(Ft){var w=ur;Ft=!1,ur=null}else throw Error(c(198));pr||(pr=!0,Yr=w)}}function xt(e){var t=e,r=e;if(e.alternate)for(;t.return;)t=t.return;else{e=t;do t=e,(t.flags&4098)!==0&&(r=t.return),e=t.return;while(e)}return t.tag===3?r:null}function To(e){if(e.tag===13){var t=e.memoizedState;if(t===null&&(e=e.alternate,e!==null&&(t=e.memoizedState)),t!==null)return t.dehydrated}return null}function Ro(e){if(xt(e)!==e)throw Error(c(188))}function fr(e){var t=e.alternate;if(!t){if(t=xt(e),t===null)throw Error(c(188));return t!==e?null:e}for(var r=e,n=t;;){var o=r.return;if(o===null)break;var a=o.alternate;if(a===null){if(n=o.return,n!==null){r=n;continue}break}if(o.child===a.child){for(a=o.child;a;){if(a===r)return Ro(o),e;if(a===n)return Ro(o),t;a=a.sibling}throw Error(c(188))}if(r.return!==n.return)r=o,n=a;else{for(var s=!1,p=o.child;p;){if(p===r){s=!0,r=o,n=a;break}if(p===n){s=!0,n=o,r=a;break}p=p.sibling}if(!s){for(p=a.child;p;){if(p===r){s=!0,r=a,n=o;break}if(p===n){s=!0,n=a,r=o;break}p=p.sibling}if(!s)throw Error(c(189))}}if(r.alternate!==n)throw Error(c(190))}if(r.tag!==3)throw Error(c(188));return r.stateNode.current===r?e:t}function Yi(e){return e=fr(e),e!==null?mr(e):null}function mr(e){if(e.tag===5||e.tag===6)return e;for(e=e.child;e!==null;){var t=mr(e);if(t!==null)return t;e=e.sibling}return null}var ti=u.unstable_scheduleCallback,dt=u.unstable_cancelCallback,Fo=u.unstable_shouldYield,Vi=u.unstable_requestPaint,He=u.unstable_now,Io=u.unstable_getCurrentPriorityLevel,ri=u.unstable_ImmediatePriority,ni=u.unstable_UserBlockingPriority,Vr=u.unstable_NormalPriority,Oo=u.unstable_LowPriority,jr=u.unstable_IdlePriority,kn=null,Nt=null;function ii(e){if(Nt&&typeof Nt.onCommitFiberRoot=="function")try{Nt.onCommitFiberRoot(kn,e,void 0,(e.current.flags&128)===128)}catch{}}var rt=Math.clz32?Math.clz32:Sr,bl=Math.log,Do=Math.LN2;function Sr(e){return e>>>=0,e===0?32:31-(bl(e)/Do|0)|0}var jn=64,oi=4194304;function hr(e){switch(e&-e){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return e&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return e&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;default:return e}}function It(e,t){var r=e.pendingLanes;if(r===0)return 0;var n=0,o=e.suspendedLanes,a=e.pingedLanes,s=r&268435455;if(s!==0){var p=s&~o;p!==0?n=hr(p):(a&=s,a!==0&&(n=hr(a)))}else s=r&~o,s!==0?n=hr(s):a!==0&&(n=hr(a));if(n===0)return 0;if(t!==0&&t!==n&&(t&o)===0&&(o=n&-n,a=t&-t,o>=a||o===16&&(a&4194240)!==0))return t;if((n&4)!==0&&(n|=r&16),t=e.entangledLanes,t!==0)for(e=e.entanglements,t&=n;0<t;)r=31-rt(t),o=1<<r,n|=e[r],t&=~o;return n}function Ao(e,t){switch(e){case 1:case 2:case 4:return t+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return t+5e3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return-1;case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function ai(e,t){for(var r=e.suspendedLanes,n=e.pingedLanes,o=e.expirationTimes,a=e.pendingLanes;0<a;){var s=31-rt(a),p=1<<s,f=o[s];f===-1?((p&r)===0||(p&n)!==0)&&(o[s]=Ao(p,t)):f<=t&&(e.expiredLanes|=p),a&=~p}}function Wt(e){return e=e.pendingLanes&-1073741825,e!==0?e:e&1073741824?1073741824:0}function Bo(){var e=jn;return jn<<=1,(jn&4194240)===0&&(jn=64),e}function Sn(e){for(var t=[],r=0;31>r;r++)t.push(e);return t}function tr(e,t,r){e.pendingLanes|=t,t!==536870912&&(e.suspendedLanes=0,e.pingedLanes=0),e=e.eventTimes,t=31-rt(t),e[t]=r}function Cn(e,t){var r=e.pendingLanes&~t;e.pendingLanes=t,e.suspendedLanes=0,e.pingedLanes=0,e.expiredLanes&=t,e.mutableReadLanes&=t,e.entangledLanes&=t,t=e.entanglements;var n=e.eventTimes;for(e=e.expirationTimes;0<r;){var o=31-rt(r),a=1<<o;t[o]=0,n[o]=-1,e[o]=-1,r&=~a}}function Gr(e,t){var r=e.entangledLanes|=t;for(e=e.entanglements;r;){var n=31-rt(r),o=1<<n;o&t|e[n]&t&&(e[n]|=t),r&=~o}}var Oe=0;function Kr(e){return e&=-e,1<e?4<e?(e&268435455)!==0?16:536870912:4:1}var li,Nn,Gi,En,je,Pn=!1,Cr=[],rr=null,Ht=null,nr=null,gr=new Map,Qt=new Map,Ae=[],Ki="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");function $o(e,t){switch(e){case"focusin":case"focusout":rr=null;break;case"dragenter":case"dragleave":Ht=null;break;case"mouseover":case"mouseout":nr=null;break;case"pointerover":case"pointerout":gr.delete(t.pointerId);break;case"gotpointercapture":case"lostpointercapture":Qt.delete(t.pointerId)}}function Ln(e,t,r,n,o,a){return e===null||e.nativeEvent!==a?(e={blockedOn:t,domEventName:r,eventSystemFlags:n,nativeEvent:a,targetContainers:[o]},t!==null&&(t=uo(t),t!==null&&Nn(t)),e):(e.eventSystemFlags|=n,t=e.targetContainers,o!==null&&t.indexOf(o)===-1&&t.push(o),e)}function xr(e,t,r,n,o){switch(t){case"focusin":return rr=Ln(rr,e,t,r,n,o),!0;case"dragenter":return Ht=Ln(Ht,e,t,r,n,o),!0;case"mouseover":return nr=Ln(nr,e,t,r,n,o),!0;case"pointerover":var a=o.pointerId;return gr.set(a,Ln(gr.get(a)||null,e,t,r,n,o)),!0;case"gotpointercapture":return a=o.pointerId,Qt.set(a,Ln(Qt.get(a)||null,e,t,r,n,o)),!0}return!1}function _n(e){var t=Fn(e.target);if(t!==null){var r=xt(t);if(r!==null){if(t=r.tag,t===13){if(t=To(r),t!==null){e.blockedOn=t,je(e.priority,function(){Gi(r)});return}}else if(t===3&&r.stateNode.current.memoizedState.isDehydrated){e.blockedOn=r.tag===3?r.stateNode.containerInfo:null;return}}}e.blockedOn=null}function qr(e){if(e.blockedOn!==null)return!1;for(var t=e.targetContainers;0<t.length;){var r=Ji(e.domEventName,e.eventSystemFlags,t[0],e.nativeEvent);if(r===null){r=e.nativeEvent;var n=new r.constructor(r.type,r);wn=n,r.target.dispatchEvent(n),wn=null}else return t=uo(r),t!==null&&Nn(t),e.blockedOn=r,!1;t.shift()}return!0}function qi(e,t,r){qr(e)&&r.delete(t)}function si(){Pn=!1,rr!==null&&qr(rr)&&(rr=null),Ht!==null&&qr(Ht)&&(Ht=null),nr!==null&&qr(nr)&&(nr=null),gr.forEach(qi),Qt.forEach(qi)}function Nr(e,t){e.blockedOn===t&&(e.blockedOn=null,Pn||(Pn=!0,u.unstable_scheduleCallback(u.unstable_NormalPriority,si)))}function Zr(e){function t(o){return Nr(o,e)}if(0<Cr.length){Nr(Cr[0],e);for(var r=1;r<Cr.length;r++){var n=Cr[r];n.blockedOn===e&&(n.blockedOn=null)}}for(rr!==null&&Nr(rr,e),Ht!==null&&Nr(Ht,e),nr!==null&&Nr(nr,e),gr.forEach(t),Qt.forEach(t),r=0;r<Ae.length;r++)n=Ae[r],n.blockedOn===e&&(n.blockedOn=null);for(;0<Ae.length&&(r=Ae[0],r.blockedOn===null);)_n(r),r.blockedOn===null&&Ae.shift()}var Er=ye.ReactCurrentBatchConfig,ci=!0;function Mn(e,t,r,n){var o=Oe,a=Er.transition;Er.transition=null;try{Oe=1,Zi(e,t,r,n)}finally{Oe=o,Er.transition=a}}function wl(e,t,r,n){var o=Oe,a=Er.transition;Er.transition=null;try{Oe=4,Zi(e,t,r,n)}finally{Oe=o,Er.transition=a}}function Zi(e,t,r,n){if(ci){var o=Ji(e,t,r,n);if(o===null)Ml(e,t,n,di,r),$o(e,n);else if(xr(o,e,t,r,n))n.stopPropagation();else if($o(e,n),t&4&&-1<Ki.indexOf(e)){for(;o!==null;){var a=uo(o);if(a!==null&&li(a),a=Ji(e,t,r,n),a===null&&Ml(e,t,n,di,r),a===o)break;o=a}o!==null&&n.stopPropagation()}else Ml(e,t,n,null,r)}}var di=null;function Ji(e,t,r,n){if(di=null,e=Hi(n),e=Fn(e),e!==null)if(t=xt(e),t===null)e=null;else if(r=t.tag,r===13){if(e=To(t),e!==null)return e;e=null}else if(r===3){if(t.stateNode.current.memoizedState.isDehydrated)return t.tag===3?t.stateNode.containerInfo:null;e=null}else t!==e&&(e=null);return di=e,null}function Uo(e){switch(e){case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 1;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"toggle":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 4;case"message":switch(Io()){case ri:return 1;case ni:return 4;case Vr:case Oo:return 16;case jr:return 536870912;default:return 16}default:return 16}}var Yt=null,ui=null,pi=null;function Wo(){if(pi)return pi;var e,t=ui,r=t.length,n,o="value"in Yt?Yt.value:Yt.textContent,a=o.length;for(e=0;e<r&&t[e]===o[e];e++);var s=r-e;for(n=1;n<=s&&t[r-n]===o[a-n];n++);return pi=o.slice(e,1<n?1-n:void 0)}function fi(e){var t=e.keyCode;return"charCode"in e?(e=e.charCode,e===0&&t===13&&(e=13)):e=t,e===10&&(e=13),32<=e||e===13?e:0}function mi(){return!0}function Ho(){return!1}function zt(e){function t(r,n,o,a,s){this._reactName=r,this._targetInst=o,this.type=n,this.nativeEvent=a,this.target=s,this.currentTarget=null;for(var p in e)e.hasOwnProperty(p)&&(r=e[p],this[p]=r?r(a):a[p]);return this.isDefaultPrevented=(a.defaultPrevented!=null?a.defaultPrevented:a.returnValue===!1)?mi:Ho,this.isPropagationStopped=Ho,this}return U(t.prototype,{preventDefault:function(){this.defaultPrevented=!0;var r=this.nativeEvent;r&&(r.preventDefault?r.preventDefault():typeof r.returnValue!="unknown"&&(r.returnValue=!1),this.isDefaultPrevented=mi)},stopPropagation:function(){var r=this.nativeEvent;r&&(r.stopPropagation?r.stopPropagation():typeof r.cancelBubble!="unknown"&&(r.cancelBubble=!0),this.isPropagationStopped=mi)},persist:function(){},isPersistent:mi}),t}var Jr={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(e){return e.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},Xi=zt(Jr),Xr=U({},Jr,{view:0,detail:0}),eo=zt(Xr),to,hi,Tn,gi=U({},Xr,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:vi,button:0,buttons:0,relatedTarget:function(e){return e.relatedTarget===void 0?e.fromElement===e.srcElement?e.toElement:e.fromElement:e.relatedTarget},movementX:function(e){return"movementX"in e?e.movementX:(e!==Tn&&(Tn&&e.type==="mousemove"?(to=e.screenX-Tn.screenX,hi=e.screenY-Tn.screenY):hi=to=0,Tn=e),to)},movementY:function(e){return"movementY"in e?e.movementY:hi}}),Qo=zt(gi),Yo=U({},gi,{dataTransfer:0}),Vo=zt(Yo),Go=U({},Xr,{relatedTarget:0}),xi=zt(Go),Ko=U({},Jr,{animationName:0,elapsedTime:0,pseudoElement:0}),qo=zt(Ko),Zo=U({},Jr,{clipboardData:function(e){return"clipboardData"in e?e.clipboardData:window.clipboardData}}),Jo=zt(Zo),Xo=U({},Jr,{data:0}),ro=zt(Xo),ea={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},ta={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},ra={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function na(e){var t=this.nativeEvent;return t.getModifierState?t.getModifierState(e):(e=ra[e])?!!t[e]:!1}function vi(){return na}var ia=U({},Xr,{key:function(e){if(e.key){var t=ea[e.key]||e.key;if(t!=="Unidentified")return t}return e.type==="keypress"?(e=fi(e),e===13?"Enter":String.fromCharCode(e)):e.type==="keydown"||e.type==="keyup"?ta[e.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:vi,charCode:function(e){return e.type==="keypress"?fi(e):0},keyCode:function(e){return e.type==="keydown"||e.type==="keyup"?e.keyCode:0},which:function(e){return e.type==="keypress"?fi(e):e.type==="keydown"||e.type==="keyup"?e.keyCode:0}}),oa=zt(ia),aa=U({},gi,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),no=zt(aa),la=U({},Xr,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:vi}),sa=zt(la),ca=U({},Jr,{propertyName:0,elapsedTime:0,pseudoElement:0}),da=zt(ca),d=U({},gi,{deltaX:function(e){return"deltaX"in e?e.deltaX:"wheelDeltaX"in e?-e.wheelDeltaX:0},deltaY:function(e){return"deltaY"in e?e.deltaY:"wheelDeltaY"in e?-e.wheelDeltaY:"wheelDelta"in e?-e.wheelDelta:0},deltaZ:0,deltaMode:0}),g=zt(d),k=[9,13,27,32],R=O&&"CompositionEvent"in window,A=null;O&&"documentMode"in document&&(A=document.documentMode);var Y=O&&"TextEvent"in window&&!A,te=O&&(!R||A&&8<A&&11>=A),fe=" ",Le=!1;function Qe(e,t){switch(e){case"keyup":return k.indexOf(t.keyCode)!==-1;case"keydown":return t.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function Ye(e){return e=e.detail,typeof e=="object"&&"data"in e?e.data:null}var nt=!1;function et(e,t){switch(e){case"compositionend":return Ye(t);case"keypress":return t.which!==32?null:(Le=!0,fe);case"textInput":return e=t.data,e===fe&&Le?null:e;default:return null}}function Pr(e,t){if(nt)return e==="compositionend"||!R&&Qe(e,t)?(e=Wo(),pi=ui=Yt=null,nt=!1,e):null;switch(e){case"paste":return null;case"keypress":if(!(t.ctrlKey||t.altKey||t.metaKey)||t.ctrlKey&&t.altKey){if(t.char&&1<t.char.length)return t.char;if(t.which)return String.fromCharCode(t.which)}return null;case"compositionend":return te&&t.locale!=="ko"?null:t.data;default:return null}}var oe={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function Re(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t==="input"?!!oe[e.type]:t==="textarea"}function Se(e,t,r,n){zn(n),t=ma(t,"onChange"),0<t.length&&(r=new Xi("onChange","change",null,r,n),e.push({event:r,listeners:t}))}var Ge=null,it=null;function en(e){jc(e,0)}function Rn(e){var t=ki(e);if(gn(t))return e}function zl(e,t){if(e==="change")return t}var lc=!1;if(O){var kl;if(O){var jl="oninput"in document;if(!jl){var sc=document.createElement("div");sc.setAttribute("oninput","return;"),jl=typeof sc.oninput=="function"}kl=jl}else kl=!1;lc=kl&&(!document.documentMode||9<document.documentMode)}function cc(){Ge&&(Ge.detachEvent("onpropertychange",dc),it=Ge=null)}function dc(e){if(e.propertyName==="value"&&Rn(it)){var t=[];Se(t,it,e,Hi(e)),Lo(en,t)}}function Hu(e,t,r){e==="focusin"?(cc(),Ge=t,it=r,Ge.attachEvent("onpropertychange",dc)):e==="focusout"&&cc()}function Qu(e){if(e==="selectionchange"||e==="keyup"||e==="keydown")return Rn(it)}function Yu(e,t){if(e==="click")return Rn(t)}function Vu(e,t){if(e==="input"||e==="change")return Rn(t)}function Gu(e,t){return e===t&&(e!==0||1/e===1/t)||e!==e&&t!==t}var ir=typeof Object.is=="function"?Object.is:Gu;function io(e,t){if(ir(e,t))return!0;if(typeof e!="object"||e===null||typeof t!="object"||t===null)return!1;var r=Object.keys(e),n=Object.keys(t);if(r.length!==n.length)return!1;for(n=0;n<r.length;n++){var o=r[n];if(!j.call(t,o)||!ir(e[o],t[o]))return!1}return!0}function uc(e){for(;e&&e.firstChild;)e=e.firstChild;return e}function pc(e,t){var r=uc(e);e=0;for(var n;r;){if(r.nodeType===3){if(n=e+r.textContent.length,e<=t&&n>=t)return{node:r,offset:t-e};e=n}e:{for(;r;){if(r.nextSibling){r=r.nextSibling;break e}r=r.parentNode}r=void 0}r=uc(r)}}function fc(e,t){return e&&t?e===t?!0:e&&e.nodeType===3?!1:t&&t.nodeType===3?fc(e,t.parentNode):"contains"in e?e.contains(t):e.compareDocumentPosition?!!(e.compareDocumentPosition(t)&16):!1:!1}function mc(){for(var e=window,t=$i();t instanceof e.HTMLIFrameElement;){try{var r=typeof t.contentWindow.location.href=="string"}catch{r=!1}if(r)e=t.contentWindow;else break;t=$i(e.document)}return t}function Sl(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t&&(t==="input"&&(e.type==="text"||e.type==="search"||e.type==="tel"||e.type==="url"||e.type==="password")||t==="textarea"||e.contentEditable==="true")}function Ku(e){var t=mc(),r=e.focusedElem,n=e.selectionRange;if(t!==r&&r&&r.ownerDocument&&fc(r.ownerDocument.documentElement,r)){if(n!==null&&Sl(r)){if(t=n.start,e=n.end,e===void 0&&(e=t),"selectionStart"in r)r.selectionStart=t,r.selectionEnd=Math.min(e,r.value.length);else if(e=(t=r.ownerDocument||document)&&t.defaultView||window,e.getSelection){e=e.getSelection();var o=r.textContent.length,a=Math.min(n.start,o);n=n.end===void 0?a:Math.min(n.end,o),!e.extend&&a>n&&(o=n,n=a,a=o),o=pc(r,a);var s=pc(r,n);o&&s&&(e.rangeCount!==1||e.anchorNode!==o.node||e.anchorOffset!==o.offset||e.focusNode!==s.node||e.focusOffset!==s.offset)&&(t=t.createRange(),t.setStart(o.node,o.offset),e.removeAllRanges(),a>n?(e.addRange(t),e.extend(s.node,s.offset)):(t.setEnd(s.node,s.offset),e.addRange(t)))}}for(t=[],e=r;e=e.parentNode;)e.nodeType===1&&t.push({element:e,left:e.scrollLeft,top:e.scrollTop});for(typeof r.focus=="function"&&r.focus(),r=0;r<t.length;r++)e=t[r],e.element.scrollLeft=e.left,e.element.scrollTop=e.top}}var qu=O&&"documentMode"in document&&11>=document.documentMode,yi=null,Cl=null,oo=null,Nl=!1;function hc(e,t,r){var n=r.window===r?r.document:r.nodeType===9?r:r.ownerDocument;Nl||yi==null||yi!==$i(n)||(n=yi,"selectionStart"in n&&Sl(n)?n={start:n.selectionStart,end:n.selectionEnd}:(n=(n.ownerDocument&&n.ownerDocument.defaultView||window).getSelection(),n={anchorNode:n.anchorNode,anchorOffset:n.anchorOffset,focusNode:n.focusNode,focusOffset:n.focusOffset}),oo&&io(oo,n)||(oo=n,n=ma(Cl,"onSelect"),0<n.length&&(t=new Xi("onSelect","select",null,t,r),e.push({event:t,listeners:n}),t.target=yi)))}function ua(e,t){var r={};return r[e.toLowerCase()]=t.toLowerCase(),r["Webkit"+e]="webkit"+t,r["Moz"+e]="moz"+t,r}var bi={animationend:ua("Animation","AnimationEnd"),animationiteration:ua("Animation","AnimationIteration"),animationstart:ua("Animation","AnimationStart"),transitionend:ua("Transition","TransitionEnd")},El={},gc={};O&&(gc=document.createElement("div").style,"AnimationEvent"in window||(delete bi.animationend.animation,delete bi.animationiteration.animation,delete bi.animationstart.animation),"TransitionEvent"in window||delete bi.transitionend.transition);function pa(e){if(El[e])return El[e];if(!bi[e])return e;var t=bi[e],r;for(r in t)if(t.hasOwnProperty(r)&&r in gc)return El[e]=t[r];return e}var xc=pa("animationend"),vc=pa("animationiteration"),yc=pa("animationstart"),bc=pa("transitionend"),wc=new Map,zc="abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");function tn(e,t){wc.set(e,t),C(t,[e])}for(var Pl=0;Pl<zc.length;Pl++){var Ll=zc[Pl],Zu=Ll.toLowerCase(),Ju=Ll[0].toUpperCase()+Ll.slice(1);tn(Zu,"on"+Ju)}tn(xc,"onAnimationEnd"),tn(vc,"onAnimationIteration"),tn(yc,"onAnimationStart"),tn("dblclick","onDoubleClick"),tn("focusin","onFocus"),tn("focusout","onBlur"),tn(bc,"onTransitionEnd"),S("onMouseEnter",["mouseout","mouseover"]),S("onMouseLeave",["mouseout","mouseover"]),S("onPointerEnter",["pointerout","pointerover"]),S("onPointerLeave",["pointerout","pointerover"]),C("onChange","change click focusin focusout input keydown keyup selectionchange".split(" ")),C("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")),C("onBeforeInput",["compositionend","keypress","textInput","paste"]),C("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" ")),C("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" ")),C("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var ao="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),Xu=new Set("cancel close invalid load scroll toggle".split(" ").concat(ao));function kc(e,t,r){var n=e.type||"unknown-event";e.currentTarget=r,ei(n,t,void 0,e),e.currentTarget=null}function jc(e,t){t=(t&4)!==0;for(var r=0;r<e.length;r++){var n=e[r],o=n.event;n=n.listeners;e:{var a=void 0;if(t)for(var s=n.length-1;0<=s;s--){var p=n[s],f=p.instance,w=p.currentTarget;if(p=p.listener,f!==a&&o.isPropagationStopped())break e;kc(o,p,w),a=f}else for(s=0;s<n.length;s++){if(p=n[s],f=p.instance,w=p.currentTarget,p=p.listener,f!==a&&o.isPropagationStopped())break e;kc(o,p,w),a=f}}}if(pr)throw e=Yr,pr=!1,Yr=null,e}function Ue(e,t){var r=t[Dl];r===void 0&&(r=t[Dl]=new Set);var n=e+"__bubble";r.has(n)||(Sc(t,e,2,!1),r.add(n))}function _l(e,t,r){var n=0;t&&(n|=4),Sc(r,e,n,t)}var fa="_reactListening"+Math.random().toString(36).slice(2);function lo(e){if(!e[fa]){e[fa]=!0,y.forEach(function(r){r!=="selectionchange"&&(Xu.has(r)||_l(r,!1,e),_l(r,!0,e))});var t=e.nodeType===9?e:e.ownerDocument;t===null||t[fa]||(t[fa]=!0,_l("selectionchange",!1,t))}}function Sc(e,t,r,n){switch(Uo(t)){case 1:var o=Mn;break;case 4:o=wl;break;default:o=Zi}r=o.bind(null,t,r,e),o=void 0,!Ct||t!=="touchstart"&&t!=="touchmove"&&t!=="wheel"||(o=!0),n?o!==void 0?e.addEventListener(t,r,{capture:!0,passive:o}):e.addEventListener(t,r,!0):o!==void 0?e.addEventListener(t,r,{passive:o}):e.addEventListener(t,r,!1)}function Ml(e,t,r,n,o){var a=n;if((t&1)===0&&(t&2)===0&&n!==null)e:for(;;){if(n===null)return;var s=n.tag;if(s===3||s===4){var p=n.stateNode.containerInfo;if(p===o||p.nodeType===8&&p.parentNode===o)break;if(s===4)for(s=n.return;s!==null;){var f=s.tag;if((f===3||f===4)&&(f=s.stateNode.containerInfo,f===o||f.nodeType===8&&f.parentNode===o))return;s=s.return}for(;p!==null;){if(s=Fn(p),s===null)return;if(f=s.tag,f===5||f===6){n=a=s;continue e}p=p.parentNode}}n=n.return}Lo(function(){var w=a,M=Hi(r),F=[];e:{var _=wc.get(e);if(_!==void 0){var Q=Xi,Z=e;switch(e){case"keypress":if(fi(r)===0)break e;case"keydown":case"keyup":Q=oa;break;case"focusin":Z="focus",Q=xi;break;case"focusout":Z="blur",Q=xi;break;case"beforeblur":case"afterblur":Q=xi;break;case"click":if(r.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":Q=Qo;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":Q=Vo;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":Q=sa;break;case xc:case vc:case yc:Q=qo;break;case bc:Q=da;break;case"scroll":Q=eo;break;case"wheel":Q=g;break;case"copy":case"cut":case"paste":Q=Jo;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":Q=no}var ee=(t&4)!==0,tt=!ee&&e==="scroll",x=ee?_!==null?_+"Capture":null:_;ee=[];for(var m=w,b;m!==null;){b=m;var I=b.stateNode;if(b.tag===5&&I!==null&&(b=I,x!==null&&(I=G(m,x),I!=null&&ee.push(so(m,I,b)))),tt)break;m=m.return}0<ee.length&&(_=new Q(_,Z,null,r,M),F.push({event:_,listeners:ee}))}}if((t&7)===0){e:{if(_=e==="mouseover"||e==="pointerover",Q=e==="mouseout"||e==="pointerout",_&&r!==wn&&(Z=r.relatedTarget||r.fromElement)&&(Fn(Z)||Z[Lr]))break e;if((Q||_)&&(_=M.window===M?M:(_=M.ownerDocument)?_.defaultView||_.parentWindow:window,Q?(Z=r.relatedTarget||r.toElement,Q=w,Z=Z?Fn(Z):null,Z!==null&&(tt=xt(Z),Z!==tt||Z.tag!==5&&Z.tag!==6)&&(Z=null)):(Q=null,Z=w),Q!==Z)){if(ee=Qo,I="onMouseLeave",x="onMouseEnter",m="mouse",(e==="pointerout"||e==="pointerover")&&(ee=no,I="onPointerLeave",x="onPointerEnter",m="pointer"),tt=Q==null?_:ki(Q),b=Z==null?_:ki(Z),_=new ee(I,m+"leave",Q,r,M),_.target=tt,_.relatedTarget=b,I=null,Fn(M)===w&&(ee=new ee(x,m+"enter",Z,r,M),ee.target=b,ee.relatedTarget=tt,I=ee),tt=I,Q&&Z)t:{for(ee=Q,x=Z,m=0,b=ee;b;b=wi(b))m++;for(b=0,I=x;I;I=wi(I))b++;for(;0<m-b;)ee=wi(ee),m--;for(;0<b-m;)x=wi(x),b--;for(;m--;){if(ee===x||x!==null&&ee===x.alternate)break t;ee=wi(ee),x=wi(x)}ee=null}else ee=null;Q!==null&&Cc(F,_,Q,ee,!1),Z!==null&&tt!==null&&Cc(F,tt,Z,ee,!0)}}e:{if(_=w?ki(w):window,Q=_.nodeName&&_.nodeName.toLowerCase(),Q==="select"||Q==="input"&&_.type==="file")var re=zl;else if(Re(_))if(lc)re=Vu;else{re=Qu;var ce=Hu}else(Q=_.nodeName)&&Q.toLowerCase()==="input"&&(_.type==="checkbox"||_.type==="radio")&&(re=Yu);if(re&&(re=re(e,w))){Se(F,re,r,M);break e}ce&&ce(e,_,w),e==="focusout"&&(ce=_._wrapperState)&&ce.controlled&&_.type==="number"&&Br(_,"number",_.value)}switch(ce=w?ki(w):window,e){case"focusin":(Re(ce)||ce.contentEditable==="true")&&(yi=ce,Cl=w,oo=null);break;case"focusout":oo=Cl=yi=null;break;case"mousedown":Nl=!0;break;case"contextmenu":case"mouseup":case"dragend":Nl=!1,hc(F,r,M);break;case"selectionchange":if(qu)break;case"keydown":case"keyup":hc(F,r,M)}var de;if(R)e:{switch(e){case"compositionstart":var he="onCompositionStart";break e;case"compositionend":he="onCompositionEnd";break e;case"compositionupdate":he="onCompositionUpdate";break e}he=void 0}else nt?Qe(e,r)&&(he="onCompositionEnd"):e==="keydown"&&r.keyCode===229&&(he="onCompositionStart");he&&(te&&r.locale!=="ko"&&(nt||he!=="onCompositionStart"?he==="onCompositionEnd"&&nt&&(de=Wo()):(Yt=M,ui="value"in Yt?Yt.value:Yt.textContent,nt=!0)),ce=ma(w,he),0<ce.length&&(he=new ro(he,e,null,r,M),F.push({event:he,listeners:ce}),de?he.data=de:(de=Ye(r),de!==null&&(he.data=de)))),(de=Y?et(e,r):Pr(e,r))&&(w=ma(w,"onBeforeInput"),0<w.length&&(M=new ro("onBeforeInput","beforeinput",null,r,M),F.push({event:M,listeners:w}),M.data=de))}jc(F,t)})}function so(e,t,r){return{instance:e,listener:t,currentTarget:r}}function ma(e,t){for(var r=t+"Capture",n=[];e!==null;){var o=e,a=o.stateNode;o.tag===5&&a!==null&&(o=a,a=G(e,r),a!=null&&n.unshift(so(e,a,o)),a=G(e,t),a!=null&&n.push(so(e,a,o))),e=e.return}return n}function wi(e){if(e===null)return null;do e=e.return;while(e&&e.tag!==5);return e||null}function Cc(e,t,r,n,o){for(var a=t._reactName,s=[];r!==null&&r!==n;){var p=r,f=p.alternate,w=p.stateNode;if(f!==null&&f===n)break;p.tag===5&&w!==null&&(p=w,o?(f=G(r,a),f!=null&&s.unshift(so(r,f,p))):o||(f=G(r,a),f!=null&&s.push(so(r,f,p)))),r=r.return}s.length!==0&&e.push({event:t,listeners:s})}var ep=/\r\n?/g,tp=/\u0000|\uFFFD/g;function Nc(e){return(typeof e=="string"?e:""+e).replace(ep,`
`).replace(tp,"")}function ha(e,t,r){if(t=Nc(t),Nc(e)!==t&&r)throw Error(c(425))}function ga(){}var Tl=null,Rl=null;function Fl(e,t){return e==="textarea"||e==="noscript"||typeof t.children=="string"||typeof t.children=="number"||typeof t.dangerouslySetInnerHTML=="object"&&t.dangerouslySetInnerHTML!==null&&t.dangerouslySetInnerHTML.__html!=null}var Il=typeof setTimeout=="function"?setTimeout:void 0,rp=typeof clearTimeout=="function"?clearTimeout:void 0,Ec=typeof Promise=="function"?Promise:void 0,np=typeof queueMicrotask=="function"?queueMicrotask:typeof Ec<"u"?function(e){return Ec.resolve(null).then(e).catch(ip)}:Il;function ip(e){setTimeout(function(){throw e})}function Ol(e,t){var r=t,n=0;do{var o=r.nextSibling;if(e.removeChild(r),o&&o.nodeType===8)if(r=o.data,r==="/$"){if(n===0){e.removeChild(o),Zr(t);return}n--}else r!=="$"&&r!=="$?"&&r!=="$!"||n++;r=o}while(r);Zr(t)}function rn(e){for(;e!=null;e=e.nextSibling){var t=e.nodeType;if(t===1||t===3)break;if(t===8){if(t=e.data,t==="$"||t==="$!"||t==="$?")break;if(t==="/$")return null}}return e}function Pc(e){e=e.previousSibling;for(var t=0;e;){if(e.nodeType===8){var r=e.data;if(r==="$"||r==="$!"||r==="$?"){if(t===0)return e;t--}else r==="/$"&&t++}e=e.previousSibling}return null}var zi=Math.random().toString(36).slice(2),vr="__reactFiber$"+zi,co="__reactProps$"+zi,Lr="__reactContainer$"+zi,Dl="__reactEvents$"+zi,op="__reactListeners$"+zi,ap="__reactHandles$"+zi;function Fn(e){var t=e[vr];if(t)return t;for(var r=e.parentNode;r;){if(t=r[Lr]||r[vr]){if(r=t.alternate,t.child!==null||r!==null&&r.child!==null)for(e=Pc(e);e!==null;){if(r=e[vr])return r;e=Pc(e)}return t}e=r,r=e.parentNode}return null}function uo(e){return e=e[vr]||e[Lr],!e||e.tag!==5&&e.tag!==6&&e.tag!==13&&e.tag!==3?null:e}function ki(e){if(e.tag===5||e.tag===6)return e.stateNode;throw Error(c(33))}function xa(e){return e[co]||null}var Al=[],ji=-1;function nn(e){return{current:e}}function We(e){0>ji||(e.current=Al[ji],Al[ji]=null,ji--)}function Be(e,t){ji++,Al[ji]=e.current,e.current=t}var on={},vt=nn(on),Et=nn(!1),In=on;function Si(e,t){var r=e.type.contextTypes;if(!r)return on;var n=e.stateNode;if(n&&n.__reactInternalMemoizedUnmaskedChildContext===t)return n.__reactInternalMemoizedMaskedChildContext;var o={},a;for(a in r)o[a]=t[a];return n&&(e=e.stateNode,e.__reactInternalMemoizedUnmaskedChildContext=t,e.__reactInternalMemoizedMaskedChildContext=o),o}function Pt(e){return e=e.childContextTypes,e!=null}function va(){We(Et),We(vt)}function Lc(e,t,r){if(vt.current!==on)throw Error(c(168));Be(vt,t),Be(Et,r)}function _c(e,t,r){var n=e.stateNode;if(t=t.childContextTypes,typeof n.getChildContext!="function")return r;n=n.getChildContext();for(var o in n)if(!(o in t))throw Error(c(108,Me(e)||"Unknown",o));return U({},r,n)}function ya(e){return e=(e=e.stateNode)&&e.__reactInternalMemoizedMergedChildContext||on,In=vt.current,Be(vt,e),Be(Et,Et.current),!0}function Mc(e,t,r){var n=e.stateNode;if(!n)throw Error(c(169));r?(e=_c(e,t,In),n.__reactInternalMemoizedMergedChildContext=e,We(Et),We(vt),Be(vt,e)):We(Et),Be(Et,r)}var _r=null,ba=!1,Bl=!1;function Tc(e){_r===null?_r=[e]:_r.push(e)}function lp(e){ba=!0,Tc(e)}function an(){if(!Bl&&_r!==null){Bl=!0;var e=0,t=Oe;try{var r=_r;for(Oe=1;e<r.length;e++){var n=r[e];do n=n(!0);while(n!==null)}_r=null,ba=!1}catch(o){throw _r!==null&&(_r=_r.slice(e+1)),ti(ri,an),o}finally{Oe=t,Bl=!1}}return null}var Ci=[],Ni=0,wa=null,za=0,Vt=[],Gt=0,On=null,Mr=1,Tr="";function Dn(e,t){Ci[Ni++]=za,Ci[Ni++]=wa,wa=e,za=t}function Rc(e,t,r){Vt[Gt++]=Mr,Vt[Gt++]=Tr,Vt[Gt++]=On,On=e;var n=Mr;e=Tr;var o=32-rt(n)-1;n&=~(1<<o),r+=1;var a=32-rt(t)+o;if(30<a){var s=o-o%5;a=(n&(1<<s)-1).toString(32),n>>=s,o-=s,Mr=1<<32-rt(t)+o|r<<o|n,Tr=a+e}else Mr=1<<a|r<<o|n,Tr=e}function $l(e){e.return!==null&&(Dn(e,1),Rc(e,1,0))}function Ul(e){for(;e===wa;)wa=Ci[--Ni],Ci[Ni]=null,za=Ci[--Ni],Ci[Ni]=null;for(;e===On;)On=Vt[--Gt],Vt[Gt]=null,Tr=Vt[--Gt],Vt[Gt]=null,Mr=Vt[--Gt],Vt[Gt]=null}var Ot=null,Dt=null,Ve=!1,or=null;function Fc(e,t){var r=Jt(5,null,null,0);r.elementType="DELETED",r.stateNode=t,r.return=e,t=e.deletions,t===null?(e.deletions=[r],e.flags|=16):t.push(r)}function Ic(e,t){switch(e.tag){case 5:var r=e.type;return t=t.nodeType!==1||r.toLowerCase()!==t.nodeName.toLowerCase()?null:t,t!==null?(e.stateNode=t,Ot=e,Dt=rn(t.firstChild),!0):!1;case 6:return t=e.pendingProps===""||t.nodeType!==3?null:t,t!==null?(e.stateNode=t,Ot=e,Dt=null,!0):!1;case 13:return t=t.nodeType!==8?null:t,t!==null?(r=On!==null?{id:Mr,overflow:Tr}:null,e.memoizedState={dehydrated:t,treeContext:r,retryLane:1073741824},r=Jt(18,null,null,0),r.stateNode=t,r.return=e,e.child=r,Ot=e,Dt=null,!0):!1;default:return!1}}function Wl(e){return(e.mode&1)!==0&&(e.flags&128)===0}function Hl(e){if(Ve){var t=Dt;if(t){var r=t;if(!Ic(e,t)){if(Wl(e))throw Error(c(418));t=rn(r.nextSibling);var n=Ot;t&&Ic(e,t)?Fc(n,r):(e.flags=e.flags&-4097|2,Ve=!1,Ot=e)}}else{if(Wl(e))throw Error(c(418));e.flags=e.flags&-4097|2,Ve=!1,Ot=e}}}function Oc(e){for(e=e.return;e!==null&&e.tag!==5&&e.tag!==3&&e.tag!==13;)e=e.return;Ot=e}function ka(e){if(e!==Ot)return!1;if(!Ve)return Oc(e),Ve=!0,!1;var t;if((t=e.tag!==3)&&!(t=e.tag!==5)&&(t=e.type,t=t!=="head"&&t!=="body"&&!Fl(e.type,e.memoizedProps)),t&&(t=Dt)){if(Wl(e))throw Dc(),Error(c(418));for(;t;)Fc(e,t),t=rn(t.nextSibling)}if(Oc(e),e.tag===13){if(e=e.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(c(317));e:{for(e=e.nextSibling,t=0;e;){if(e.nodeType===8){var r=e.data;if(r==="/$"){if(t===0){Dt=rn(e.nextSibling);break e}t--}else r!=="$"&&r!=="$!"&&r!=="$?"||t++}e=e.nextSibling}Dt=null}}else Dt=Ot?rn(e.stateNode.nextSibling):null;return!0}function Dc(){for(var e=Dt;e;)e=rn(e.nextSibling)}function Ei(){Dt=Ot=null,Ve=!1}function Ql(e){or===null?or=[e]:or.push(e)}var sp=ye.ReactCurrentBatchConfig;function po(e,t,r){if(e=r.ref,e!==null&&typeof e!="function"&&typeof e!="object"){if(r._owner){if(r=r._owner,r){if(r.tag!==1)throw Error(c(309));var n=r.stateNode}if(!n)throw Error(c(147,e));var o=n,a=""+e;return t!==null&&t.ref!==null&&typeof t.ref=="function"&&t.ref._stringRef===a?t.ref:(t=function(s){var p=o.refs;s===null?delete p[a]:p[a]=s},t._stringRef=a,t)}if(typeof e!="string")throw Error(c(284));if(!r._owner)throw Error(c(290,e))}return e}function ja(e,t){throw e=Object.prototype.toString.call(t),Error(c(31,e==="[object Object]"?"object with keys {"+Object.keys(t).join(", ")+"}":e))}function Ac(e){var t=e._init;return t(e._payload)}function Bc(e){function t(x,m){if(e){var b=x.deletions;b===null?(x.deletions=[m],x.flags|=16):b.push(m)}}function r(x,m){if(!e)return null;for(;m!==null;)t(x,m),m=m.sibling;return null}function n(x,m){for(x=new Map;m!==null;)m.key!==null?x.set(m.key,m):x.set(m.index,m),m=m.sibling;return x}function o(x,m){return x=mn(x,m),x.index=0,x.sibling=null,x}function a(x,m,b){return x.index=b,e?(b=x.alternate,b!==null?(b=b.index,b<m?(x.flags|=2,m):b):(x.flags|=2,m)):(x.flags|=1048576,m)}function s(x){return e&&x.alternate===null&&(x.flags|=2),x}function p(x,m,b,I){return m===null||m.tag!==6?(m=Is(b,x.mode,I),m.return=x,m):(m=o(m,b),m.return=x,m)}function f(x,m,b,I){var re=b.type;return re===ze?M(x,m,b.props.children,I,b.key):m!==null&&(m.elementType===re||typeof re=="object"&&re!==null&&re.$$typeof===me&&Ac(re)===m.type)?(I=o(m,b.props),I.ref=po(x,m,b),I.return=x,I):(I=Ga(b.type,b.key,b.props,null,x.mode,I),I.ref=po(x,m,b),I.return=x,I)}function w(x,m,b,I){return m===null||m.tag!==4||m.stateNode.containerInfo!==b.containerInfo||m.stateNode.implementation!==b.implementation?(m=Os(b,x.mode,I),m.return=x,m):(m=o(m,b.children||[]),m.return=x,m)}function M(x,m,b,I,re){return m===null||m.tag!==7?(m=Yn(b,x.mode,I,re),m.return=x,m):(m=o(m,b),m.return=x,m)}function F(x,m,b){if(typeof m=="string"&&m!==""||typeof m=="number")return m=Is(""+m,x.mode,b),m.return=x,m;if(typeof m=="object"&&m!==null){switch(m.$$typeof){case pe:return b=Ga(m.type,m.key,m.props,null,x.mode,b),b.ref=po(x,null,m),b.return=x,b;case ve:return m=Os(m,x.mode,b),m.return=x,m;case me:var I=m._init;return F(x,I(m._payload),b)}if($r(m)||H(m))return m=Yn(m,x.mode,b,null),m.return=x,m;ja(x,m)}return null}function _(x,m,b,I){var re=m!==null?m.key:null;if(typeof b=="string"&&b!==""||typeof b=="number")return re!==null?null:p(x,m,""+b,I);if(typeof b=="object"&&b!==null){switch(b.$$typeof){case pe:return b.key===re?f(x,m,b,I):null;case ve:return b.key===re?w(x,m,b,I):null;case me:return re=b._init,_(x,m,re(b._payload),I)}if($r(b)||H(b))return re!==null?null:M(x,m,b,I,null);ja(x,b)}return null}function Q(x,m,b,I,re){if(typeof I=="string"&&I!==""||typeof I=="number")return x=x.get(b)||null,p(m,x,""+I,re);if(typeof I=="object"&&I!==null){switch(I.$$typeof){case pe:return x=x.get(I.key===null?b:I.key)||null,f(m,x,I,re);case ve:return x=x.get(I.key===null?b:I.key)||null,w(m,x,I,re);case me:var ce=I._init;return Q(x,m,b,ce(I._payload),re)}if($r(I)||H(I))return x=x.get(b)||null,M(m,x,I,re,null);ja(m,I)}return null}function Z(x,m,b,I){for(var re=null,ce=null,de=m,he=m=0,ft=null;de!==null&&he<b.length;he++){de.index>he?(ft=de,de=null):ft=de.sibling;var Ie=_(x,de,b[he],I);if(Ie===null){de===null&&(de=ft);break}e&&de&&Ie.alternate===null&&t(x,de),m=a(Ie,m,he),ce===null?re=Ie:ce.sibling=Ie,ce=Ie,de=ft}if(he===b.length)return r(x,de),Ve&&Dn(x,he),re;if(de===null){for(;he<b.length;he++)de=F(x,b[he],I),de!==null&&(m=a(de,m,he),ce===null?re=de:ce.sibling=de,ce=de);return Ve&&Dn(x,he),re}for(de=n(x,de);he<b.length;he++)ft=Q(de,x,he,b[he],I),ft!==null&&(e&&ft.alternate!==null&&de.delete(ft.key===null?he:ft.key),m=a(ft,m,he),ce===null?re=ft:ce.sibling=ft,ce=ft);return e&&de.forEach(function(hn){return t(x,hn)}),Ve&&Dn(x,he),re}function ee(x,m,b,I){var re=H(b);if(typeof re!="function")throw Error(c(150));if(b=re.call(b),b==null)throw Error(c(151));for(var ce=re=null,de=m,he=m=0,ft=null,Ie=b.next();de!==null&&!Ie.done;he++,Ie=b.next()){de.index>he?(ft=de,de=null):ft=de.sibling;var hn=_(x,de,Ie.value,I);if(hn===null){de===null&&(de=ft);break}e&&de&&hn.alternate===null&&t(x,de),m=a(hn,m,he),ce===null?re=hn:ce.sibling=hn,ce=hn,de=ft}if(Ie.done)return r(x,de),Ve&&Dn(x,he),re;if(de===null){for(;!Ie.done;he++,Ie=b.next())Ie=F(x,Ie.value,I),Ie!==null&&(m=a(Ie,m,he),ce===null?re=Ie:ce.sibling=Ie,ce=Ie);return Ve&&Dn(x,he),re}for(de=n(x,de);!Ie.done;he++,Ie=b.next())Ie=Q(de,x,he,Ie.value,I),Ie!==null&&(e&&Ie.alternate!==null&&de.delete(Ie.key===null?he:Ie.key),m=a(Ie,m,he),ce===null?re=Ie:ce.sibling=Ie,ce=Ie);return e&&de.forEach(function($p){return t(x,$p)}),Ve&&Dn(x,he),re}function tt(x,m,b,I){if(typeof b=="object"&&b!==null&&b.type===ze&&b.key===null&&(b=b.props.children),typeof b=="object"&&b!==null){switch(b.$$typeof){case pe:e:{for(var re=b.key,ce=m;ce!==null;){if(ce.key===re){if(re=b.type,re===ze){if(ce.tag===7){r(x,ce.sibling),m=o(ce,b.props.children),m.return=x,x=m;break e}}else if(ce.elementType===re||typeof re=="object"&&re!==null&&re.$$typeof===me&&Ac(re)===ce.type){r(x,ce.sibling),m=o(ce,b.props),m.ref=po(x,ce,b),m.return=x,x=m;break e}r(x,ce);break}else t(x,ce);ce=ce.sibling}b.type===ze?(m=Yn(b.props.children,x.mode,I,b.key),m.return=x,x=m):(I=Ga(b.type,b.key,b.props,null,x.mode,I),I.ref=po(x,m,b),I.return=x,x=I)}return s(x);case ve:e:{for(ce=b.key;m!==null;){if(m.key===ce)if(m.tag===4&&m.stateNode.containerInfo===b.containerInfo&&m.stateNode.implementation===b.implementation){r(x,m.sibling),m=o(m,b.children||[]),m.return=x,x=m;break e}else{r(x,m);break}else t(x,m);m=m.sibling}m=Os(b,x.mode,I),m.return=x,x=m}return s(x);case me:return ce=b._init,tt(x,m,ce(b._payload),I)}if($r(b))return Z(x,m,b,I);if(H(b))return ee(x,m,b,I);ja(x,b)}return typeof b=="string"&&b!==""||typeof b=="number"?(b=""+b,m!==null&&m.tag===6?(r(x,m.sibling),m=o(m,b),m.return=x,x=m):(r(x,m),m=Is(b,x.mode,I),m.return=x,x=m),s(x)):r(x,m)}return tt}var Pi=Bc(!0),$c=Bc(!1),Sa=nn(null),Ca=null,Li=null,Yl=null;function Vl(){Yl=Li=Ca=null}function Gl(e){var t=Sa.current;We(Sa),e._currentValue=t}function Kl(e,t,r){for(;e!==null;){var n=e.alternate;if((e.childLanes&t)!==t?(e.childLanes|=t,n!==null&&(n.childLanes|=t)):n!==null&&(n.childLanes&t)!==t&&(n.childLanes|=t),e===r)break;e=e.return}}function _i(e,t){Ca=e,Yl=Li=null,e=e.dependencies,e!==null&&e.firstContext!==null&&((e.lanes&t)!==0&&(Lt=!0),e.firstContext=null)}function Kt(e){var t=e._currentValue;if(Yl!==e)if(e={context:e,memoizedValue:t,next:null},Li===null){if(Ca===null)throw Error(c(308));Li=e,Ca.dependencies={lanes:0,firstContext:e}}else Li=Li.next=e;return t}var An=null;function ql(e){An===null?An=[e]:An.push(e)}function Uc(e,t,r,n){var o=t.interleaved;return o===null?(r.next=r,ql(t)):(r.next=o.next,o.next=r),t.interleaved=r,Rr(e,n)}function Rr(e,t){e.lanes|=t;var r=e.alternate;for(r!==null&&(r.lanes|=t),r=e,e=e.return;e!==null;)e.childLanes|=t,r=e.alternate,r!==null&&(r.childLanes|=t),r=e,e=e.return;return r.tag===3?r.stateNode:null}var ln=!1;function Zl(e){e.updateQueue={baseState:e.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null}}function Wc(e,t){e=e.updateQueue,t.updateQueue===e&&(t.updateQueue={baseState:e.baseState,firstBaseUpdate:e.firstBaseUpdate,lastBaseUpdate:e.lastBaseUpdate,shared:e.shared,effects:e.effects})}function Fr(e,t){return{eventTime:e,lane:t,tag:0,payload:null,callback:null,next:null}}function sn(e,t,r){var n=e.updateQueue;if(n===null)return null;if(n=n.shared,(Fe&2)!==0){var o=n.pending;return o===null?t.next=t:(t.next=o.next,o.next=t),n.pending=t,Rr(e,r)}return o=n.interleaved,o===null?(t.next=t,ql(n)):(t.next=o.next,o.next=t),n.interleaved=t,Rr(e,r)}function Na(e,t,r){if(t=t.updateQueue,t!==null&&(t=t.shared,(r&4194240)!==0)){var n=t.lanes;n&=e.pendingLanes,r|=n,t.lanes=r,Gr(e,r)}}function Hc(e,t){var r=e.updateQueue,n=e.alternate;if(n!==null&&(n=n.updateQueue,r===n)){var o=null,a=null;if(r=r.firstBaseUpdate,r!==null){do{var s={eventTime:r.eventTime,lane:r.lane,tag:r.tag,payload:r.payload,callback:r.callback,next:null};a===null?o=a=s:a=a.next=s,r=r.next}while(r!==null);a===null?o=a=t:a=a.next=t}else o=a=t;r={baseState:n.baseState,firstBaseUpdate:o,lastBaseUpdate:a,shared:n.shared,effects:n.effects},e.updateQueue=r;return}e=r.lastBaseUpdate,e===null?r.firstBaseUpdate=t:e.next=t,r.lastBaseUpdate=t}function Ea(e,t,r,n){var o=e.updateQueue;ln=!1;var a=o.firstBaseUpdate,s=o.lastBaseUpdate,p=o.shared.pending;if(p!==null){o.shared.pending=null;var f=p,w=f.next;f.next=null,s===null?a=w:s.next=w,s=f;var M=e.alternate;M!==null&&(M=M.updateQueue,p=M.lastBaseUpdate,p!==s&&(p===null?M.firstBaseUpdate=w:p.next=w,M.lastBaseUpdate=f))}if(a!==null){var F=o.baseState;s=0,M=w=f=null,p=a;do{var _=p.lane,Q=p.eventTime;if((n&_)===_){M!==null&&(M=M.next={eventTime:Q,lane:0,tag:p.tag,payload:p.payload,callback:p.callback,next:null});e:{var Z=e,ee=p;switch(_=t,Q=r,ee.tag){case 1:if(Z=ee.payload,typeof Z=="function"){F=Z.call(Q,F,_);break e}F=Z;break e;case 3:Z.flags=Z.flags&-65537|128;case 0:if(Z=ee.payload,_=typeof Z=="function"?Z.call(Q,F,_):Z,_==null)break e;F=U({},F,_);break e;case 2:ln=!0}}p.callback!==null&&p.lane!==0&&(e.flags|=64,_=o.effects,_===null?o.effects=[p]:_.push(p))}else Q={eventTime:Q,lane:_,tag:p.tag,payload:p.payload,callback:p.callback,next:null},M===null?(w=M=Q,f=F):M=M.next=Q,s|=_;if(p=p.next,p===null){if(p=o.shared.pending,p===null)break;_=p,p=_.next,_.next=null,o.lastBaseUpdate=_,o.shared.pending=null}}while(!0);if(M===null&&(f=F),o.baseState=f,o.firstBaseUpdate=w,o.lastBaseUpdate=M,t=o.shared.interleaved,t!==null){o=t;do s|=o.lane,o=o.next;while(o!==t)}else a===null&&(o.shared.lanes=0);Un|=s,e.lanes=s,e.memoizedState=F}}function Qc(e,t,r){if(e=t.effects,t.effects=null,e!==null)for(t=0;t<e.length;t++){var n=e[t],o=n.callback;if(o!==null){if(n.callback=null,n=r,typeof o!="function")throw Error(c(191,o));o.call(n)}}}var fo={},yr=nn(fo),mo=nn(fo),ho=nn(fo);function Bn(e){if(e===fo)throw Error(c(174));return e}function Jl(e,t){switch(Be(ho,t),Be(mo,e),Be(yr,fo),e=t.nodeType,e){case 9:case 11:t=(t=t.documentElement)?t.namespaceURI:Kn(null,"");break;default:e=e===8?t.parentNode:t,t=e.namespaceURI||null,e=e.tagName,t=Kn(t,e)}We(yr),Be(yr,t)}function Mi(){We(yr),We(mo),We(ho)}function Yc(e){Bn(ho.current);var t=Bn(yr.current),r=Kn(t,e.type);t!==r&&(Be(mo,e),Be(yr,r))}function Xl(e){mo.current===e&&(We(yr),We(mo))}var Ke=nn(0);function Pa(e){for(var t=e;t!==null;){if(t.tag===13){var r=t.memoizedState;if(r!==null&&(r=r.dehydrated,r===null||r.data==="$?"||r.data==="$!"))return t}else if(t.tag===19&&t.memoizedProps.revealOrder!==void 0){if((t.flags&128)!==0)return t}else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return null;t=t.return}t.sibling.return=t.return,t=t.sibling}return null}var es=[];function ts(){for(var e=0;e<es.length;e++)es[e]._workInProgressVersionPrimary=null;es.length=0}var La=ye.ReactCurrentDispatcher,rs=ye.ReactCurrentBatchConfig,$n=0,qe=null,lt=null,ut=null,_a=!1,go=!1,xo=0,cp=0;function yt(){throw Error(c(321))}function ns(e,t){if(t===null)return!1;for(var r=0;r<t.length&&r<e.length;r++)if(!ir(e[r],t[r]))return!1;return!0}function is(e,t,r,n,o,a){if($n=a,qe=t,t.memoizedState=null,t.updateQueue=null,t.lanes=0,La.current=e===null||e.memoizedState===null?fp:mp,e=r(n,o),go){a=0;do{if(go=!1,xo=0,25<=a)throw Error(c(301));a+=1,ut=lt=null,t.updateQueue=null,La.current=hp,e=r(n,o)}while(go)}if(La.current=Ra,t=lt!==null&&lt.next!==null,$n=0,ut=lt=qe=null,_a=!1,t)throw Error(c(300));return e}function os(){var e=xo!==0;return xo=0,e}function br(){var e={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return ut===null?qe.memoizedState=ut=e:ut=ut.next=e,ut}function qt(){if(lt===null){var e=qe.alternate;e=e!==null?e.memoizedState:null}else e=lt.next;var t=ut===null?qe.memoizedState:ut.next;if(t!==null)ut=t,lt=e;else{if(e===null)throw Error(c(310));lt=e,e={memoizedState:lt.memoizedState,baseState:lt.baseState,baseQueue:lt.baseQueue,queue:lt.queue,next:null},ut===null?qe.memoizedState=ut=e:ut=ut.next=e}return ut}function vo(e,t){return typeof t=="function"?t(e):t}function as(e){var t=qt(),r=t.queue;if(r===null)throw Error(c(311));r.lastRenderedReducer=e;var n=lt,o=n.baseQueue,a=r.pending;if(a!==null){if(o!==null){var s=o.next;o.next=a.next,a.next=s}n.baseQueue=o=a,r.pending=null}if(o!==null){a=o.next,n=n.baseState;var p=s=null,f=null,w=a;do{var M=w.lane;if(($n&M)===M)f!==null&&(f=f.next={lane:0,action:w.action,hasEagerState:w.hasEagerState,eagerState:w.eagerState,next:null}),n=w.hasEagerState?w.eagerState:e(n,w.action);else{var F={lane:M,action:w.action,hasEagerState:w.hasEagerState,eagerState:w.eagerState,next:null};f===null?(p=f=F,s=n):f=f.next=F,qe.lanes|=M,Un|=M}w=w.next}while(w!==null&&w!==a);f===null?s=n:f.next=p,ir(n,t.memoizedState)||(Lt=!0),t.memoizedState=n,t.baseState=s,t.baseQueue=f,r.lastRenderedState=n}if(e=r.interleaved,e!==null){o=e;do a=o.lane,qe.lanes|=a,Un|=a,o=o.next;while(o!==e)}else o===null&&(r.lanes=0);return[t.memoizedState,r.dispatch]}function ls(e){var t=qt(),r=t.queue;if(r===null)throw Error(c(311));r.lastRenderedReducer=e;var n=r.dispatch,o=r.pending,a=t.memoizedState;if(o!==null){r.pending=null;var s=o=o.next;do a=e(a,s.action),s=s.next;while(s!==o);ir(a,t.memoizedState)||(Lt=!0),t.memoizedState=a,t.baseQueue===null&&(t.baseState=a),r.lastRenderedState=a}return[a,n]}function Vc(){}function Gc(e,t){var r=qe,n=qt(),o=t(),a=!ir(n.memoizedState,o);if(a&&(n.memoizedState=o,Lt=!0),n=n.queue,ss(Zc.bind(null,r,n,e),[e]),n.getSnapshot!==t||a||ut!==null&&ut.memoizedState.tag&1){if(r.flags|=2048,yo(9,qc.bind(null,r,n,o,t),void 0,null),pt===null)throw Error(c(349));($n&30)!==0||Kc(r,t,o)}return o}function Kc(e,t,r){e.flags|=16384,e={getSnapshot:t,value:r},t=qe.updateQueue,t===null?(t={lastEffect:null,stores:null},qe.updateQueue=t,t.stores=[e]):(r=t.stores,r===null?t.stores=[e]:r.push(e))}function qc(e,t,r,n){t.value=r,t.getSnapshot=n,Jc(t)&&Xc(e)}function Zc(e,t,r){return r(function(){Jc(t)&&Xc(e)})}function Jc(e){var t=e.getSnapshot;e=e.value;try{var r=t();return!ir(e,r)}catch{return!0}}function Xc(e){var t=Rr(e,1);t!==null&&cr(t,e,1,-1)}function ed(e){var t=br();return typeof e=="function"&&(e=e()),t.memoizedState=t.baseState=e,e={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:vo,lastRenderedState:e},t.queue=e,e=e.dispatch=pp.bind(null,qe,e),[t.memoizedState,e]}function yo(e,t,r,n){return e={tag:e,create:t,destroy:r,deps:n,next:null},t=qe.updateQueue,t===null?(t={lastEffect:null,stores:null},qe.updateQueue=t,t.lastEffect=e.next=e):(r=t.lastEffect,r===null?t.lastEffect=e.next=e:(n=r.next,r.next=e,e.next=n,t.lastEffect=e)),e}function td(){return qt().memoizedState}function Ma(e,t,r,n){var o=br();qe.flags|=e,o.memoizedState=yo(1|t,r,void 0,n===void 0?null:n)}function Ta(e,t,r,n){var o=qt();n=n===void 0?null:n;var a=void 0;if(lt!==null){var s=lt.memoizedState;if(a=s.destroy,n!==null&&ns(n,s.deps)){o.memoizedState=yo(t,r,a,n);return}}qe.flags|=e,o.memoizedState=yo(1|t,r,a,n)}function rd(e,t){return Ma(8390656,8,e,t)}function ss(e,t){return Ta(2048,8,e,t)}function nd(e,t){return Ta(4,2,e,t)}function id(e,t){return Ta(4,4,e,t)}function od(e,t){if(typeof t=="function")return e=e(),t(e),function(){t(null)};if(t!=null)return e=e(),t.current=e,function(){t.current=null}}function ad(e,t,r){return r=r!=null?r.concat([e]):null,Ta(4,4,od.bind(null,t,e),r)}function cs(){}function ld(e,t){var r=qt();t=t===void 0?null:t;var n=r.memoizedState;return n!==null&&t!==null&&ns(t,n[1])?n[0]:(r.memoizedState=[e,t],e)}function sd(e,t){var r=qt();t=t===void 0?null:t;var n=r.memoizedState;return n!==null&&t!==null&&ns(t,n[1])?n[0]:(e=e(),r.memoizedState=[e,t],e)}function cd(e,t,r){return($n&21)===0?(e.baseState&&(e.baseState=!1,Lt=!0),e.memoizedState=r):(ir(r,t)||(r=Bo(),qe.lanes|=r,Un|=r,e.baseState=!0),t)}function dp(e,t){var r=Oe;Oe=r!==0&&4>r?r:4,e(!0);var n=rs.transition;rs.transition={};try{e(!1),t()}finally{Oe=r,rs.transition=n}}function dd(){return qt().memoizedState}function up(e,t,r){var n=pn(e);if(r={lane:n,action:r,hasEagerState:!1,eagerState:null,next:null},ud(e))pd(t,r);else if(r=Uc(e,t,r,n),r!==null){var o=jt();cr(r,e,n,o),fd(r,t,n)}}function pp(e,t,r){var n=pn(e),o={lane:n,action:r,hasEagerState:!1,eagerState:null,next:null};if(ud(e))pd(t,o);else{var a=e.alternate;if(e.lanes===0&&(a===null||a.lanes===0)&&(a=t.lastRenderedReducer,a!==null))try{var s=t.lastRenderedState,p=a(s,r);if(o.hasEagerState=!0,o.eagerState=p,ir(p,s)){var f=t.interleaved;f===null?(o.next=o,ql(t)):(o.next=f.next,f.next=o),t.interleaved=o;return}}catch{}finally{}r=Uc(e,t,o,n),r!==null&&(o=jt(),cr(r,e,n,o),fd(r,t,n))}}function ud(e){var t=e.alternate;return e===qe||t!==null&&t===qe}function pd(e,t){go=_a=!0;var r=e.pending;r===null?t.next=t:(t.next=r.next,r.next=t),e.pending=t}function fd(e,t,r){if((r&4194240)!==0){var n=t.lanes;n&=e.pendingLanes,r|=n,t.lanes=r,Gr(e,r)}}var Ra={readContext:Kt,useCallback:yt,useContext:yt,useEffect:yt,useImperativeHandle:yt,useInsertionEffect:yt,useLayoutEffect:yt,useMemo:yt,useReducer:yt,useRef:yt,useState:yt,useDebugValue:yt,useDeferredValue:yt,useTransition:yt,useMutableSource:yt,useSyncExternalStore:yt,useId:yt,unstable_isNewReconciler:!1},fp={readContext:Kt,useCallback:function(e,t){return br().memoizedState=[e,t===void 0?null:t],e},useContext:Kt,useEffect:rd,useImperativeHandle:function(e,t,r){return r=r!=null?r.concat([e]):null,Ma(4194308,4,od.bind(null,t,e),r)},useLayoutEffect:function(e,t){return Ma(4194308,4,e,t)},useInsertionEffect:function(e,t){return Ma(4,2,e,t)},useMemo:function(e,t){var r=br();return t=t===void 0?null:t,e=e(),r.memoizedState=[e,t],e},useReducer:function(e,t,r){var n=br();return t=r!==void 0?r(t):t,n.memoizedState=n.baseState=t,e={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:e,lastRenderedState:t},n.queue=e,e=e.dispatch=up.bind(null,qe,e),[n.memoizedState,e]},useRef:function(e){var t=br();return e={current:e},t.memoizedState=e},useState:ed,useDebugValue:cs,useDeferredValue:function(e){return br().memoizedState=e},useTransition:function(){var e=ed(!1),t=e[0];return e=dp.bind(null,e[1]),br().memoizedState=e,[t,e]},useMutableSource:function(){},useSyncExternalStore:function(e,t,r){var n=qe,o=br();if(Ve){if(r===void 0)throw Error(c(407));r=r()}else{if(r=t(),pt===null)throw Error(c(349));($n&30)!==0||Kc(n,t,r)}o.memoizedState=r;var a={value:r,getSnapshot:t};return o.queue=a,rd(Zc.bind(null,n,a,e),[e]),n.flags|=2048,yo(9,qc.bind(null,n,a,r,t),void 0,null),r},useId:function(){var e=br(),t=pt.identifierPrefix;if(Ve){var r=Tr,n=Mr;r=(n&~(1<<32-rt(n)-1)).toString(32)+r,t=":"+t+"R"+r,r=xo++,0<r&&(t+="H"+r.toString(32)),t+=":"}else r=cp++,t=":"+t+"r"+r.toString(32)+":";return e.memoizedState=t},unstable_isNewReconciler:!1},mp={readContext:Kt,useCallback:ld,useContext:Kt,useEffect:ss,useImperativeHandle:ad,useInsertionEffect:nd,useLayoutEffect:id,useMemo:sd,useReducer:as,useRef:td,useState:function(){return as(vo)},useDebugValue:cs,useDeferredValue:function(e){var t=qt();return cd(t,lt.memoizedState,e)},useTransition:function(){var e=as(vo)[0],t=qt().memoizedState;return[e,t]},useMutableSource:Vc,useSyncExternalStore:Gc,useId:dd,unstable_isNewReconciler:!1},hp={readContext:Kt,useCallback:ld,useContext:Kt,useEffect:ss,useImperativeHandle:ad,useInsertionEffect:nd,useLayoutEffect:id,useMemo:sd,useReducer:ls,useRef:td,useState:function(){return ls(vo)},useDebugValue:cs,useDeferredValue:function(e){var t=qt();return lt===null?t.memoizedState=e:cd(t,lt.memoizedState,e)},useTransition:function(){var e=ls(vo)[0],t=qt().memoizedState;return[e,t]},useMutableSource:Vc,useSyncExternalStore:Gc,useId:dd,unstable_isNewReconciler:!1};function ar(e,t){if(e&&e.defaultProps){t=U({},t),e=e.defaultProps;for(var r in e)t[r]===void 0&&(t[r]=e[r]);return t}return t}function ds(e,t,r,n){t=e.memoizedState,r=r(n,t),r=r==null?t:U({},t,r),e.memoizedState=r,e.lanes===0&&(e.updateQueue.baseState=r)}var Fa={isMounted:function(e){return(e=e._reactInternals)?xt(e)===e:!1},enqueueSetState:function(e,t,r){e=e._reactInternals;var n=jt(),o=pn(e),a=Fr(n,o);a.payload=t,r!=null&&(a.callback=r),t=sn(e,a,o),t!==null&&(cr(t,e,o,n),Na(t,e,o))},enqueueReplaceState:function(e,t,r){e=e._reactInternals;var n=jt(),o=pn(e),a=Fr(n,o);a.tag=1,a.payload=t,r!=null&&(a.callback=r),t=sn(e,a,o),t!==null&&(cr(t,e,o,n),Na(t,e,o))},enqueueForceUpdate:function(e,t){e=e._reactInternals;var r=jt(),n=pn(e),o=Fr(r,n);o.tag=2,t!=null&&(o.callback=t),t=sn(e,o,n),t!==null&&(cr(t,e,n,r),Na(t,e,n))}};function md(e,t,r,n,o,a,s){return e=e.stateNode,typeof e.shouldComponentUpdate=="function"?e.shouldComponentUpdate(n,a,s):t.prototype&&t.prototype.isPureReactComponent?!io(r,n)||!io(o,a):!0}function hd(e,t,r){var n=!1,o=on,a=t.contextType;return typeof a=="object"&&a!==null?a=Kt(a):(o=Pt(t)?In:vt.current,n=t.contextTypes,a=(n=n!=null)?Si(e,o):on),t=new t(r,a),e.memoizedState=t.state!==null&&t.state!==void 0?t.state:null,t.updater=Fa,e.stateNode=t,t._reactInternals=e,n&&(e=e.stateNode,e.__reactInternalMemoizedUnmaskedChildContext=o,e.__reactInternalMemoizedMaskedChildContext=a),t}function gd(e,t,r,n){e=t.state,typeof t.componentWillReceiveProps=="function"&&t.componentWillReceiveProps(r,n),typeof t.UNSAFE_componentWillReceiveProps=="function"&&t.UNSAFE_componentWillReceiveProps(r,n),t.state!==e&&Fa.enqueueReplaceState(t,t.state,null)}function us(e,t,r,n){var o=e.stateNode;o.props=r,o.state=e.memoizedState,o.refs={},Zl(e);var a=t.contextType;typeof a=="object"&&a!==null?o.context=Kt(a):(a=Pt(t)?In:vt.current,o.context=Si(e,a)),o.state=e.memoizedState,a=t.getDerivedStateFromProps,typeof a=="function"&&(ds(e,t,a,r),o.state=e.memoizedState),typeof t.getDerivedStateFromProps=="function"||typeof o.getSnapshotBeforeUpdate=="function"||typeof o.UNSAFE_componentWillMount!="function"&&typeof o.componentWillMount!="function"||(t=o.state,typeof o.componentWillMount=="function"&&o.componentWillMount(),typeof o.UNSAFE_componentWillMount=="function"&&o.UNSAFE_componentWillMount(),t!==o.state&&Fa.enqueueReplaceState(o,o.state,null),Ea(e,r,o,n),o.state=e.memoizedState),typeof o.componentDidMount=="function"&&(e.flags|=4194308)}function Ti(e,t){try{var r="",n=t;do r+=_e(n),n=n.return;while(n);var o=r}catch(a){o=`
Error generating stack: `+a.message+`
`+a.stack}return{value:e,source:t,stack:o,digest:null}}function ps(e,t,r){return{value:e,source:null,stack:r??null,digest:t??null}}function fs(e,t){try{console.error(t.value)}catch(r){setTimeout(function(){throw r})}}var gp=typeof WeakMap=="function"?WeakMap:Map;function xd(e,t,r){r=Fr(-1,r),r.tag=3,r.payload={element:null};var n=t.value;return r.callback=function(){Ua||(Ua=!0,Es=n),fs(e,t)},r}function vd(e,t,r){r=Fr(-1,r),r.tag=3;var n=e.type.getDerivedStateFromError;if(typeof n=="function"){var o=t.value;r.payload=function(){return n(o)},r.callback=function(){fs(e,t)}}var a=e.stateNode;return a!==null&&typeof a.componentDidCatch=="function"&&(r.callback=function(){fs(e,t),typeof n!="function"&&(dn===null?dn=new Set([this]):dn.add(this));var s=t.stack;this.componentDidCatch(t.value,{componentStack:s!==null?s:""})}),r}function yd(e,t,r){var n=e.pingCache;if(n===null){n=e.pingCache=new gp;var o=new Set;n.set(t,o)}else o=n.get(t),o===void 0&&(o=new Set,n.set(t,o));o.has(r)||(o.add(r),e=Lp.bind(null,e,t,r),t.then(e,e))}function bd(e){do{var t;if((t=e.tag===13)&&(t=e.memoizedState,t=t!==null?t.dehydrated!==null:!0),t)return e;e=e.return}while(e!==null);return null}function wd(e,t,r,n,o){return(e.mode&1)===0?(e===t?e.flags|=65536:(e.flags|=128,r.flags|=131072,r.flags&=-52805,r.tag===1&&(r.alternate===null?r.tag=17:(t=Fr(-1,1),t.tag=2,sn(r,t,1))),r.lanes|=1),e):(e.flags|=65536,e.lanes=o,e)}var xp=ye.ReactCurrentOwner,Lt=!1;function kt(e,t,r,n){t.child=e===null?$c(t,null,r,n):Pi(t,e.child,r,n)}function zd(e,t,r,n,o){r=r.render;var a=t.ref;return _i(t,o),n=is(e,t,r,n,a,o),r=os(),e!==null&&!Lt?(t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~o,Ir(e,t,o)):(Ve&&r&&$l(t),t.flags|=1,kt(e,t,n,o),t.child)}function kd(e,t,r,n,o){if(e===null){var a=r.type;return typeof a=="function"&&!Fs(a)&&a.defaultProps===void 0&&r.compare===null&&r.defaultProps===void 0?(t.tag=15,t.type=a,jd(e,t,a,n,o)):(e=Ga(r.type,null,n,t,t.mode,o),e.ref=t.ref,e.return=t,t.child=e)}if(a=e.child,(e.lanes&o)===0){var s=a.memoizedProps;if(r=r.compare,r=r!==null?r:io,r(s,n)&&e.ref===t.ref)return Ir(e,t,o)}return t.flags|=1,e=mn(a,n),e.ref=t.ref,e.return=t,t.child=e}function jd(e,t,r,n,o){if(e!==null){var a=e.memoizedProps;if(io(a,n)&&e.ref===t.ref)if(Lt=!1,t.pendingProps=n=a,(e.lanes&o)!==0)(e.flags&131072)!==0&&(Lt=!0);else return t.lanes=e.lanes,Ir(e,t,o)}return ms(e,t,r,n,o)}function Sd(e,t,r){var n=t.pendingProps,o=n.children,a=e!==null?e.memoizedState:null;if(n.mode==="hidden")if((t.mode&1)===0)t.memoizedState={baseLanes:0,cachePool:null,transitions:null},Be(Fi,At),At|=r;else{if((r&1073741824)===0)return e=a!==null?a.baseLanes|r:r,t.lanes=t.childLanes=1073741824,t.memoizedState={baseLanes:e,cachePool:null,transitions:null},t.updateQueue=null,Be(Fi,At),At|=e,null;t.memoizedState={baseLanes:0,cachePool:null,transitions:null},n=a!==null?a.baseLanes:r,Be(Fi,At),At|=n}else a!==null?(n=a.baseLanes|r,t.memoizedState=null):n=r,Be(Fi,At),At|=n;return kt(e,t,o,r),t.child}function Cd(e,t){var r=t.ref;(e===null&&r!==null||e!==null&&e.ref!==r)&&(t.flags|=512,t.flags|=2097152)}function ms(e,t,r,n,o){var a=Pt(r)?In:vt.current;return a=Si(t,a),_i(t,o),r=is(e,t,r,n,a,o),n=os(),e!==null&&!Lt?(t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~o,Ir(e,t,o)):(Ve&&n&&$l(t),t.flags|=1,kt(e,t,r,o),t.child)}function Nd(e,t,r,n,o){if(Pt(r)){var a=!0;ya(t)}else a=!1;if(_i(t,o),t.stateNode===null)Oa(e,t),hd(t,r,n),us(t,r,n,o),n=!0;else if(e===null){var s=t.stateNode,p=t.memoizedProps;s.props=p;var f=s.context,w=r.contextType;typeof w=="object"&&w!==null?w=Kt(w):(w=Pt(r)?In:vt.current,w=Si(t,w));var M=r.getDerivedStateFromProps,F=typeof M=="function"||typeof s.getSnapshotBeforeUpdate=="function";F||typeof s.UNSAFE_componentWillReceiveProps!="function"&&typeof s.componentWillReceiveProps!="function"||(p!==n||f!==w)&&gd(t,s,n,w),ln=!1;var _=t.memoizedState;s.state=_,Ea(t,n,s,o),f=t.memoizedState,p!==n||_!==f||Et.current||ln?(typeof M=="function"&&(ds(t,r,M,n),f=t.memoizedState),(p=ln||md(t,r,p,n,_,f,w))?(F||typeof s.UNSAFE_componentWillMount!="function"&&typeof s.componentWillMount!="function"||(typeof s.componentWillMount=="function"&&s.componentWillMount(),typeof s.UNSAFE_componentWillMount=="function"&&s.UNSAFE_componentWillMount()),typeof s.componentDidMount=="function"&&(t.flags|=4194308)):(typeof s.componentDidMount=="function"&&(t.flags|=4194308),t.memoizedProps=n,t.memoizedState=f),s.props=n,s.state=f,s.context=w,n=p):(typeof s.componentDidMount=="function"&&(t.flags|=4194308),n=!1)}else{s=t.stateNode,Wc(e,t),p=t.memoizedProps,w=t.type===t.elementType?p:ar(t.type,p),s.props=w,F=t.pendingProps,_=s.context,f=r.contextType,typeof f=="object"&&f!==null?f=Kt(f):(f=Pt(r)?In:vt.current,f=Si(t,f));var Q=r.getDerivedStateFromProps;(M=typeof Q=="function"||typeof s.getSnapshotBeforeUpdate=="function")||typeof s.UNSAFE_componentWillReceiveProps!="function"&&typeof s.componentWillReceiveProps!="function"||(p!==F||_!==f)&&gd(t,s,n,f),ln=!1,_=t.memoizedState,s.state=_,Ea(t,n,s,o);var Z=t.memoizedState;p!==F||_!==Z||Et.current||ln?(typeof Q=="function"&&(ds(t,r,Q,n),Z=t.memoizedState),(w=ln||md(t,r,w,n,_,Z,f)||!1)?(M||typeof s.UNSAFE_componentWillUpdate!="function"&&typeof s.componentWillUpdate!="function"||(typeof s.componentWillUpdate=="function"&&s.componentWillUpdate(n,Z,f),typeof s.UNSAFE_componentWillUpdate=="function"&&s.UNSAFE_componentWillUpdate(n,Z,f)),typeof s.componentDidUpdate=="function"&&(t.flags|=4),typeof s.getSnapshotBeforeUpdate=="function"&&(t.flags|=1024)):(typeof s.componentDidUpdate!="function"||p===e.memoizedProps&&_===e.memoizedState||(t.flags|=4),typeof s.getSnapshotBeforeUpdate!="function"||p===e.memoizedProps&&_===e.memoizedState||(t.flags|=1024),t.memoizedProps=n,t.memoizedState=Z),s.props=n,s.state=Z,s.context=f,n=w):(typeof s.componentDidUpdate!="function"||p===e.memoizedProps&&_===e.memoizedState||(t.flags|=4),typeof s.getSnapshotBeforeUpdate!="function"||p===e.memoizedProps&&_===e.memoizedState||(t.flags|=1024),n=!1)}return hs(e,t,r,n,a,o)}function hs(e,t,r,n,o,a){Cd(e,t);var s=(t.flags&128)!==0;if(!n&&!s)return o&&Mc(t,r,!1),Ir(e,t,a);n=t.stateNode,xp.current=t;var p=s&&typeof r.getDerivedStateFromError!="function"?null:n.render();return t.flags|=1,e!==null&&s?(t.child=Pi(t,e.child,null,a),t.child=Pi(t,null,p,a)):kt(e,t,p,a),t.memoizedState=n.state,o&&Mc(t,r,!0),t.child}function Ed(e){var t=e.stateNode;t.pendingContext?Lc(e,t.pendingContext,t.pendingContext!==t.context):t.context&&Lc(e,t.context,!1),Jl(e,t.containerInfo)}function Pd(e,t,r,n,o){return Ei(),Ql(o),t.flags|=256,kt(e,t,r,n),t.child}var gs={dehydrated:null,treeContext:null,retryLane:0};function xs(e){return{baseLanes:e,cachePool:null,transitions:null}}function Ld(e,t,r){var n=t.pendingProps,o=Ke.current,a=!1,s=(t.flags&128)!==0,p;if((p=s)||(p=e!==null&&e.memoizedState===null?!1:(o&2)!==0),p?(a=!0,t.flags&=-129):(e===null||e.memoizedState!==null)&&(o|=1),Be(Ke,o&1),e===null)return Hl(t),e=t.memoizedState,e!==null&&(e=e.dehydrated,e!==null)?((t.mode&1)===0?t.lanes=1:e.data==="$!"?t.lanes=8:t.lanes=1073741824,null):(s=n.children,e=n.fallback,a?(n=t.mode,a=t.child,s={mode:"hidden",children:s},(n&1)===0&&a!==null?(a.childLanes=0,a.pendingProps=s):a=Ka(s,n,0,null),e=Yn(e,n,r,null),a.return=t,e.return=t,a.sibling=e,t.child=a,t.child.memoizedState=xs(r),t.memoizedState=gs,e):vs(t,s));if(o=e.memoizedState,o!==null&&(p=o.dehydrated,p!==null))return vp(e,t,s,n,p,o,r);if(a){a=n.fallback,s=t.mode,o=e.child,p=o.sibling;var f={mode:"hidden",children:n.children};return(s&1)===0&&t.child!==o?(n=t.child,n.childLanes=0,n.pendingProps=f,t.deletions=null):(n=mn(o,f),n.subtreeFlags=o.subtreeFlags&14680064),p!==null?a=mn(p,a):(a=Yn(a,s,r,null),a.flags|=2),a.return=t,n.return=t,n.sibling=a,t.child=n,n=a,a=t.child,s=e.child.memoizedState,s=s===null?xs(r):{baseLanes:s.baseLanes|r,cachePool:null,transitions:s.transitions},a.memoizedState=s,a.childLanes=e.childLanes&~r,t.memoizedState=gs,n}return a=e.child,e=a.sibling,n=mn(a,{mode:"visible",children:n.children}),(t.mode&1)===0&&(n.lanes=r),n.return=t,n.sibling=null,e!==null&&(r=t.deletions,r===null?(t.deletions=[e],t.flags|=16):r.push(e)),t.child=n,t.memoizedState=null,n}function vs(e,t){return t=Ka({mode:"visible",children:t},e.mode,0,null),t.return=e,e.child=t}function Ia(e,t,r,n){return n!==null&&Ql(n),Pi(t,e.child,null,r),e=vs(t,t.pendingProps.children),e.flags|=2,t.memoizedState=null,e}function vp(e,t,r,n,o,a,s){if(r)return t.flags&256?(t.flags&=-257,n=ps(Error(c(422))),Ia(e,t,s,n)):t.memoizedState!==null?(t.child=e.child,t.flags|=128,null):(a=n.fallback,o=t.mode,n=Ka({mode:"visible",children:n.children},o,0,null),a=Yn(a,o,s,null),a.flags|=2,n.return=t,a.return=t,n.sibling=a,t.child=n,(t.mode&1)!==0&&Pi(t,e.child,null,s),t.child.memoizedState=xs(s),t.memoizedState=gs,a);if((t.mode&1)===0)return Ia(e,t,s,null);if(o.data==="$!"){if(n=o.nextSibling&&o.nextSibling.dataset,n)var p=n.dgst;return n=p,a=Error(c(419)),n=ps(a,n,void 0),Ia(e,t,s,n)}if(p=(s&e.childLanes)!==0,Lt||p){if(n=pt,n!==null){switch(s&-s){case 4:o=2;break;case 16:o=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:o=32;break;case 536870912:o=268435456;break;default:o=0}o=(o&(n.suspendedLanes|s))!==0?0:o,o!==0&&o!==a.retryLane&&(a.retryLane=o,Rr(e,o),cr(n,e,o,-1))}return Rs(),n=ps(Error(c(421))),Ia(e,t,s,n)}return o.data==="$?"?(t.flags|=128,t.child=e.child,t=_p.bind(null,e),o._reactRetry=t,null):(e=a.treeContext,Dt=rn(o.nextSibling),Ot=t,Ve=!0,or=null,e!==null&&(Vt[Gt++]=Mr,Vt[Gt++]=Tr,Vt[Gt++]=On,Mr=e.id,Tr=e.overflow,On=t),t=vs(t,n.children),t.flags|=4096,t)}function _d(e,t,r){e.lanes|=t;var n=e.alternate;n!==null&&(n.lanes|=t),Kl(e.return,t,r)}function ys(e,t,r,n,o){var a=e.memoizedState;a===null?e.memoizedState={isBackwards:t,rendering:null,renderingStartTime:0,last:n,tail:r,tailMode:o}:(a.isBackwards=t,a.rendering=null,a.renderingStartTime=0,a.last=n,a.tail=r,a.tailMode=o)}function Md(e,t,r){var n=t.pendingProps,o=n.revealOrder,a=n.tail;if(kt(e,t,n.children,r),n=Ke.current,(n&2)!==0)n=n&1|2,t.flags|=128;else{if(e!==null&&(e.flags&128)!==0)e:for(e=t.child;e!==null;){if(e.tag===13)e.memoizedState!==null&&_d(e,r,t);else if(e.tag===19)_d(e,r,t);else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break e;for(;e.sibling===null;){if(e.return===null||e.return===t)break e;e=e.return}e.sibling.return=e.return,e=e.sibling}n&=1}if(Be(Ke,n),(t.mode&1)===0)t.memoizedState=null;else switch(o){case"forwards":for(r=t.child,o=null;r!==null;)e=r.alternate,e!==null&&Pa(e)===null&&(o=r),r=r.sibling;r=o,r===null?(o=t.child,t.child=null):(o=r.sibling,r.sibling=null),ys(t,!1,o,r,a);break;case"backwards":for(r=null,o=t.child,t.child=null;o!==null;){if(e=o.alternate,e!==null&&Pa(e)===null){t.child=o;break}e=o.sibling,o.sibling=r,r=o,o=e}ys(t,!0,r,null,a);break;case"together":ys(t,!1,null,null,void 0);break;default:t.memoizedState=null}return t.child}function Oa(e,t){(t.mode&1)===0&&e!==null&&(e.alternate=null,t.alternate=null,t.flags|=2)}function Ir(e,t,r){if(e!==null&&(t.dependencies=e.dependencies),Un|=t.lanes,(r&t.childLanes)===0)return null;if(e!==null&&t.child!==e.child)throw Error(c(153));if(t.child!==null){for(e=t.child,r=mn(e,e.pendingProps),t.child=r,r.return=t;e.sibling!==null;)e=e.sibling,r=r.sibling=mn(e,e.pendingProps),r.return=t;r.sibling=null}return t.child}function yp(e,t,r){switch(t.tag){case 3:Ed(t),Ei();break;case 5:Yc(t);break;case 1:Pt(t.type)&&ya(t);break;case 4:Jl(t,t.stateNode.containerInfo);break;case 10:var n=t.type._context,o=t.memoizedProps.value;Be(Sa,n._currentValue),n._currentValue=o;break;case 13:if(n=t.memoizedState,n!==null)return n.dehydrated!==null?(Be(Ke,Ke.current&1),t.flags|=128,null):(r&t.child.childLanes)!==0?Ld(e,t,r):(Be(Ke,Ke.current&1),e=Ir(e,t,r),e!==null?e.sibling:null);Be(Ke,Ke.current&1);break;case 19:if(n=(r&t.childLanes)!==0,(e.flags&128)!==0){if(n)return Md(e,t,r);t.flags|=128}if(o=t.memoizedState,o!==null&&(o.rendering=null,o.tail=null,o.lastEffect=null),Be(Ke,Ke.current),n)break;return null;case 22:case 23:return t.lanes=0,Sd(e,t,r)}return Ir(e,t,r)}var Td,bs,Rd,Fd;Td=function(e,t){for(var r=t.child;r!==null;){if(r.tag===5||r.tag===6)e.appendChild(r.stateNode);else if(r.tag!==4&&r.child!==null){r.child.return=r,r=r.child;continue}if(r===t)break;for(;r.sibling===null;){if(r.return===null||r.return===t)return;r=r.return}r.sibling.return=r.return,r=r.sibling}},bs=function(){},Rd=function(e,t,r,n){var o=e.memoizedProps;if(o!==n){e=t.stateNode,Bn(yr.current);var a=null;switch(r){case"input":o=Xt(e,o),n=Xt(e,n),a=[];break;case"select":o=U({},o,{value:void 0}),n=U({},n,{value:void 0}),a=[];break;case"textarea":o=vn(e,o),n=vn(e,n),a=[];break;default:typeof o.onClick!="function"&&typeof n.onClick=="function"&&(e.onclick=ga)}bn(r,n);var s;r=null;for(w in o)if(!n.hasOwnProperty(w)&&o.hasOwnProperty(w)&&o[w]!=null)if(w==="style"){var p=o[w];for(s in p)p.hasOwnProperty(s)&&(r||(r={}),r[s]="")}else w!=="dangerouslySetInnerHTML"&&w!=="children"&&w!=="suppressContentEditableWarning"&&w!=="suppressHydrationWarning"&&w!=="autoFocus"&&(z.hasOwnProperty(w)?a||(a=[]):(a=a||[]).push(w,null));for(w in n){var f=n[w];if(p=o!=null?o[w]:void 0,n.hasOwnProperty(w)&&f!==p&&(f!=null||p!=null))if(w==="style")if(p){for(s in p)!p.hasOwnProperty(s)||f&&f.hasOwnProperty(s)||(r||(r={}),r[s]="");for(s in f)f.hasOwnProperty(s)&&p[s]!==f[s]&&(r||(r={}),r[s]=f[s])}else r||(a||(a=[]),a.push(w,r)),r=f;else w==="dangerouslySetInnerHTML"?(f=f?f.__html:void 0,p=p?p.__html:void 0,f!=null&&p!==f&&(a=a||[]).push(w,f)):w==="children"?typeof f!="string"&&typeof f!="number"||(a=a||[]).push(w,""+f):w!=="suppressContentEditableWarning"&&w!=="suppressHydrationWarning"&&(z.hasOwnProperty(w)?(f!=null&&w==="onScroll"&&Ue("scroll",e),a||p===f||(a=[])):(a=a||[]).push(w,f))}r&&(a=a||[]).push("style",r);var w=a;(t.updateQueue=w)&&(t.flags|=4)}},Fd=function(e,t,r,n){r!==n&&(t.flags|=4)};function bo(e,t){if(!Ve)switch(e.tailMode){case"hidden":t=e.tail;for(var r=null;t!==null;)t.alternate!==null&&(r=t),t=t.sibling;r===null?e.tail=null:r.sibling=null;break;case"collapsed":r=e.tail;for(var n=null;r!==null;)r.alternate!==null&&(n=r),r=r.sibling;n===null?t||e.tail===null?e.tail=null:e.tail.sibling=null:n.sibling=null}}function bt(e){var t=e.alternate!==null&&e.alternate.child===e.child,r=0,n=0;if(t)for(var o=e.child;o!==null;)r|=o.lanes|o.childLanes,n|=o.subtreeFlags&14680064,n|=o.flags&14680064,o.return=e,o=o.sibling;else for(o=e.child;o!==null;)r|=o.lanes|o.childLanes,n|=o.subtreeFlags,n|=o.flags,o.return=e,o=o.sibling;return e.subtreeFlags|=n,e.childLanes=r,t}function bp(e,t,r){var n=t.pendingProps;switch(Ul(t),t.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return bt(t),null;case 1:return Pt(t.type)&&va(),bt(t),null;case 3:return n=t.stateNode,Mi(),We(Et),We(vt),ts(),n.pendingContext&&(n.context=n.pendingContext,n.pendingContext=null),(e===null||e.child===null)&&(ka(t)?t.flags|=4:e===null||e.memoizedState.isDehydrated&&(t.flags&256)===0||(t.flags|=1024,or!==null&&(_s(or),or=null))),bs(e,t),bt(t),null;case 5:Xl(t);var o=Bn(ho.current);if(r=t.type,e!==null&&t.stateNode!=null)Rd(e,t,r,n,o),e.ref!==t.ref&&(t.flags|=512,t.flags|=2097152);else{if(!n){if(t.stateNode===null)throw Error(c(166));return bt(t),null}if(e=Bn(yr.current),ka(t)){n=t.stateNode,r=t.type;var a=t.memoizedProps;switch(n[vr]=t,n[co]=a,e=(t.mode&1)!==0,r){case"dialog":Ue("cancel",n),Ue("close",n);break;case"iframe":case"object":case"embed":Ue("load",n);break;case"video":case"audio":for(o=0;o<ao.length;o++)Ue(ao[o],n);break;case"source":Ue("error",n);break;case"img":case"image":case"link":Ue("error",n),Ue("load",n);break;case"details":Ue("toggle",n);break;case"input":xl(n,a),Ue("invalid",n);break;case"select":n._wrapperState={wasMultiple:!!a.multiple},Ue("invalid",n);break;case"textarea":vl(n,a),Ue("invalid",n)}bn(r,a),o=null;for(var s in a)if(a.hasOwnProperty(s)){var p=a[s];s==="children"?typeof p=="string"?n.textContent!==p&&(a.suppressHydrationWarning!==!0&&ha(n.textContent,p,e),o=["children",p]):typeof p=="number"&&n.textContent!==""+p&&(a.suppressHydrationWarning!==!0&&ha(n.textContent,p,e),o=["children",""+p]):z.hasOwnProperty(s)&&p!=null&&s==="onScroll"&&Ue("scroll",n)}switch(r){case"input":Bi(n),Rt(n,a,!0);break;case"textarea":Bi(n),Ui(n);break;case"select":case"option":break;default:typeof a.onClick=="function"&&(n.onclick=ga)}n=o,t.updateQueue=n,n!==null&&(t.flags|=4)}else{s=o.nodeType===9?o:o.ownerDocument,e==="http://www.w3.org/1999/xhtml"&&(e=Wi(r)),e==="http://www.w3.org/1999/xhtml"?r==="script"?(e=s.createElement("div"),e.innerHTML="<script><\/script>",e=e.removeChild(e.firstChild)):typeof n.is=="string"?e=s.createElement(r,{is:n.is}):(e=s.createElement(r),r==="select"&&(s=e,n.multiple?s.multiple=!0:n.size&&(s.size=n.size))):e=s.createElementNS(e,r),e[vr]=t,e[co]=n,Td(e,t,!1,!1),t.stateNode=e;e:{switch(s=Zn(r,n),r){case"dialog":Ue("cancel",e),Ue("close",e),o=n;break;case"iframe":case"object":case"embed":Ue("load",e),o=n;break;case"video":case"audio":for(o=0;o<ao.length;o++)Ue(ao[o],e);o=n;break;case"source":Ue("error",e),o=n;break;case"img":case"image":case"link":Ue("error",e),Ue("load",e),o=n;break;case"details":Ue("toggle",e),o=n;break;case"input":xl(e,n),o=Xt(e,n),Ue("invalid",e);break;case"option":o=n;break;case"select":e._wrapperState={wasMultiple:!!n.multiple},o=U({},n,{value:void 0}),Ue("invalid",e);break;case"textarea":vl(e,n),o=vn(e,n),Ue("invalid",e);break;default:o=n}bn(r,o),p=o;for(a in p)if(p.hasOwnProperty(a)){var f=p[a];a==="style"?er(e,f):a==="dangerouslySetInnerHTML"?(f=f?f.__html:void 0,f!=null&&qn(e,f)):a==="children"?typeof f=="string"?(r!=="textarea"||f!=="")&&Wr(e,f):typeof f=="number"&&Wr(e,""+f):a!=="suppressContentEditableWarning"&&a!=="suppressHydrationWarning"&&a!=="autoFocus"&&(z.hasOwnProperty(a)?f!=null&&a==="onScroll"&&Ue("scroll",e):f!=null&&ge(e,a,f,s))}switch(r){case"input":Bi(e),Rt(e,n,!1);break;case"textarea":Bi(e),Ui(e);break;case"option":n.value!=null&&e.setAttribute("value",""+Te(n.value));break;case"select":e.multiple=!!n.multiple,a=n.value,a!=null?xn(e,!!n.multiple,a,!1):n.defaultValue!=null&&xn(e,!!n.multiple,n.defaultValue,!0);break;default:typeof o.onClick=="function"&&(e.onclick=ga)}switch(r){case"button":case"input":case"select":case"textarea":n=!!n.autoFocus;break e;case"img":n=!0;break e;default:n=!1}}n&&(t.flags|=4)}t.ref!==null&&(t.flags|=512,t.flags|=2097152)}return bt(t),null;case 6:if(e&&t.stateNode!=null)Fd(e,t,e.memoizedProps,n);else{if(typeof n!="string"&&t.stateNode===null)throw Error(c(166));if(r=Bn(ho.current),Bn(yr.current),ka(t)){if(n=t.stateNode,r=t.memoizedProps,n[vr]=t,(a=n.nodeValue!==r)&&(e=Ot,e!==null))switch(e.tag){case 3:ha(n.nodeValue,r,(e.mode&1)!==0);break;case 5:e.memoizedProps.suppressHydrationWarning!==!0&&ha(n.nodeValue,r,(e.mode&1)!==0)}a&&(t.flags|=4)}else n=(r.nodeType===9?r:r.ownerDocument).createTextNode(n),n[vr]=t,t.stateNode=n}return bt(t),null;case 13:if(We(Ke),n=t.memoizedState,e===null||e.memoizedState!==null&&e.memoizedState.dehydrated!==null){if(Ve&&Dt!==null&&(t.mode&1)!==0&&(t.flags&128)===0)Dc(),Ei(),t.flags|=98560,a=!1;else if(a=ka(t),n!==null&&n.dehydrated!==null){if(e===null){if(!a)throw Error(c(318));if(a=t.memoizedState,a=a!==null?a.dehydrated:null,!a)throw Error(c(317));a[vr]=t}else Ei(),(t.flags&128)===0&&(t.memoizedState=null),t.flags|=4;bt(t),a=!1}else or!==null&&(_s(or),or=null),a=!0;if(!a)return t.flags&65536?t:null}return(t.flags&128)!==0?(t.lanes=r,t):(n=n!==null,n!==(e!==null&&e.memoizedState!==null)&&n&&(t.child.flags|=8192,(t.mode&1)!==0&&(e===null||(Ke.current&1)!==0?st===0&&(st=3):Rs())),t.updateQueue!==null&&(t.flags|=4),bt(t),null);case 4:return Mi(),bs(e,t),e===null&&lo(t.stateNode.containerInfo),bt(t),null;case 10:return Gl(t.type._context),bt(t),null;case 17:return Pt(t.type)&&va(),bt(t),null;case 19:if(We(Ke),a=t.memoizedState,a===null)return bt(t),null;if(n=(t.flags&128)!==0,s=a.rendering,s===null)if(n)bo(a,!1);else{if(st!==0||e!==null&&(e.flags&128)!==0)for(e=t.child;e!==null;){if(s=Pa(e),s!==null){for(t.flags|=128,bo(a,!1),n=s.updateQueue,n!==null&&(t.updateQueue=n,t.flags|=4),t.subtreeFlags=0,n=r,r=t.child;r!==null;)a=r,e=n,a.flags&=14680066,s=a.alternate,s===null?(a.childLanes=0,a.lanes=e,a.child=null,a.subtreeFlags=0,a.memoizedProps=null,a.memoizedState=null,a.updateQueue=null,a.dependencies=null,a.stateNode=null):(a.childLanes=s.childLanes,a.lanes=s.lanes,a.child=s.child,a.subtreeFlags=0,a.deletions=null,a.memoizedProps=s.memoizedProps,a.memoizedState=s.memoizedState,a.updateQueue=s.updateQueue,a.type=s.type,e=s.dependencies,a.dependencies=e===null?null:{lanes:e.lanes,firstContext:e.firstContext}),r=r.sibling;return Be(Ke,Ke.current&1|2),t.child}e=e.sibling}a.tail!==null&&He()>Ii&&(t.flags|=128,n=!0,bo(a,!1),t.lanes=4194304)}else{if(!n)if(e=Pa(s),e!==null){if(t.flags|=128,n=!0,r=e.updateQueue,r!==null&&(t.updateQueue=r,t.flags|=4),bo(a,!0),a.tail===null&&a.tailMode==="hidden"&&!s.alternate&&!Ve)return bt(t),null}else 2*He()-a.renderingStartTime>Ii&&r!==1073741824&&(t.flags|=128,n=!0,bo(a,!1),t.lanes=4194304);a.isBackwards?(s.sibling=t.child,t.child=s):(r=a.last,r!==null?r.sibling=s:t.child=s,a.last=s)}return a.tail!==null?(t=a.tail,a.rendering=t,a.tail=t.sibling,a.renderingStartTime=He(),t.sibling=null,r=Ke.current,Be(Ke,n?r&1|2:r&1),t):(bt(t),null);case 22:case 23:return Ts(),n=t.memoizedState!==null,e!==null&&e.memoizedState!==null!==n&&(t.flags|=8192),n&&(t.mode&1)!==0?(At&1073741824)!==0&&(bt(t),t.subtreeFlags&6&&(t.flags|=8192)):bt(t),null;case 24:return null;case 25:return null}throw Error(c(156,t.tag))}function wp(e,t){switch(Ul(t),t.tag){case 1:return Pt(t.type)&&va(),e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 3:return Mi(),We(Et),We(vt),ts(),e=t.flags,(e&65536)!==0&&(e&128)===0?(t.flags=e&-65537|128,t):null;case 5:return Xl(t),null;case 13:if(We(Ke),e=t.memoizedState,e!==null&&e.dehydrated!==null){if(t.alternate===null)throw Error(c(340));Ei()}return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 19:return We(Ke),null;case 4:return Mi(),null;case 10:return Gl(t.type._context),null;case 22:case 23:return Ts(),null;case 24:return null;default:return null}}var Da=!1,wt=!1,zp=typeof WeakSet=="function"?WeakSet:Set,K=null;function Ri(e,t){var r=e.ref;if(r!==null)if(typeof r=="function")try{r(null)}catch(n){Xe(e,t,n)}else r.current=null}function ws(e,t,r){try{r()}catch(n){Xe(e,t,n)}}var Id=!1;function kp(e,t){if(Tl=ci,e=mc(),Sl(e)){if("selectionStart"in e)var r={start:e.selectionStart,end:e.selectionEnd};else e:{r=(r=e.ownerDocument)&&r.defaultView||window;var n=r.getSelection&&r.getSelection();if(n&&n.rangeCount!==0){r=n.anchorNode;var o=n.anchorOffset,a=n.focusNode;n=n.focusOffset;try{r.nodeType,a.nodeType}catch{r=null;break e}var s=0,p=-1,f=-1,w=0,M=0,F=e,_=null;t:for(;;){for(var Q;F!==r||o!==0&&F.nodeType!==3||(p=s+o),F!==a||n!==0&&F.nodeType!==3||(f=s+n),F.nodeType===3&&(s+=F.nodeValue.length),(Q=F.firstChild)!==null;)_=F,F=Q;for(;;){if(F===e)break t;if(_===r&&++w===o&&(p=s),_===a&&++M===n&&(f=s),(Q=F.nextSibling)!==null)break;F=_,_=F.parentNode}F=Q}r=p===-1||f===-1?null:{start:p,end:f}}else r=null}r=r||{start:0,end:0}}else r=null;for(Rl={focusedElem:e,selectionRange:r},ci=!1,K=t;K!==null;)if(t=K,e=t.child,(t.subtreeFlags&1028)!==0&&e!==null)e.return=t,K=e;else for(;K!==null;){t=K;try{var Z=t.alternate;if((t.flags&1024)!==0)switch(t.tag){case 0:case 11:case 15:break;case 1:if(Z!==null){var ee=Z.memoizedProps,tt=Z.memoizedState,x=t.stateNode,m=x.getSnapshotBeforeUpdate(t.elementType===t.type?ee:ar(t.type,ee),tt);x.__reactInternalSnapshotBeforeUpdate=m}break;case 3:var b=t.stateNode.containerInfo;b.nodeType===1?b.textContent="":b.nodeType===9&&b.documentElement&&b.removeChild(b.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(c(163))}}catch(I){Xe(t,t.return,I)}if(e=t.sibling,e!==null){e.return=t.return,K=e;break}K=t.return}return Z=Id,Id=!1,Z}function wo(e,t,r){var n=t.updateQueue;if(n=n!==null?n.lastEffect:null,n!==null){var o=n=n.next;do{if((o.tag&e)===e){var a=o.destroy;o.destroy=void 0,a!==void 0&&ws(t,r,a)}o=o.next}while(o!==n)}}function Aa(e,t){if(t=t.updateQueue,t=t!==null?t.lastEffect:null,t!==null){var r=t=t.next;do{if((r.tag&e)===e){var n=r.create;r.destroy=n()}r=r.next}while(r!==t)}}function zs(e){var t=e.ref;if(t!==null){var r=e.stateNode;switch(e.tag){case 5:e=r;break;default:e=r}typeof t=="function"?t(e):t.current=e}}function Od(e){var t=e.alternate;t!==null&&(e.alternate=null,Od(t)),e.child=null,e.deletions=null,e.sibling=null,e.tag===5&&(t=e.stateNode,t!==null&&(delete t[vr],delete t[co],delete t[Dl],delete t[op],delete t[ap])),e.stateNode=null,e.return=null,e.dependencies=null,e.memoizedProps=null,e.memoizedState=null,e.pendingProps=null,e.stateNode=null,e.updateQueue=null}function Dd(e){return e.tag===5||e.tag===3||e.tag===4}function Ad(e){e:for(;;){for(;e.sibling===null;){if(e.return===null||Dd(e.return))return null;e=e.return}for(e.sibling.return=e.return,e=e.sibling;e.tag!==5&&e.tag!==6&&e.tag!==18;){if(e.flags&2||e.child===null||e.tag===4)continue e;e.child.return=e,e=e.child}if(!(e.flags&2))return e.stateNode}}function ks(e,t,r){var n=e.tag;if(n===5||n===6)e=e.stateNode,t?r.nodeType===8?r.parentNode.insertBefore(e,t):r.insertBefore(e,t):(r.nodeType===8?(t=r.parentNode,t.insertBefore(e,r)):(t=r,t.appendChild(e)),r=r._reactRootContainer,r!=null||t.onclick!==null||(t.onclick=ga));else if(n!==4&&(e=e.child,e!==null))for(ks(e,t,r),e=e.sibling;e!==null;)ks(e,t,r),e=e.sibling}function js(e,t,r){var n=e.tag;if(n===5||n===6)e=e.stateNode,t?r.insertBefore(e,t):r.appendChild(e);else if(n!==4&&(e=e.child,e!==null))for(js(e,t,r),e=e.sibling;e!==null;)js(e,t,r),e=e.sibling}var mt=null,lr=!1;function cn(e,t,r){for(r=r.child;r!==null;)Bd(e,t,r),r=r.sibling}function Bd(e,t,r){if(Nt&&typeof Nt.onCommitFiberUnmount=="function")try{Nt.onCommitFiberUnmount(kn,r)}catch{}switch(r.tag){case 5:wt||Ri(r,t);case 6:var n=mt,o=lr;mt=null,cn(e,t,r),mt=n,lr=o,mt!==null&&(lr?(e=mt,r=r.stateNode,e.nodeType===8?e.parentNode.removeChild(r):e.removeChild(r)):mt.removeChild(r.stateNode));break;case 18:mt!==null&&(lr?(e=mt,r=r.stateNode,e.nodeType===8?Ol(e.parentNode,r):e.nodeType===1&&Ol(e,r),Zr(e)):Ol(mt,r.stateNode));break;case 4:n=mt,o=lr,mt=r.stateNode.containerInfo,lr=!0,cn(e,t,r),mt=n,lr=o;break;case 0:case 11:case 14:case 15:if(!wt&&(n=r.updateQueue,n!==null&&(n=n.lastEffect,n!==null))){o=n=n.next;do{var a=o,s=a.destroy;a=a.tag,s!==void 0&&((a&2)!==0||(a&4)!==0)&&ws(r,t,s),o=o.next}while(o!==n)}cn(e,t,r);break;case 1:if(!wt&&(Ri(r,t),n=r.stateNode,typeof n.componentWillUnmount=="function"))try{n.props=r.memoizedProps,n.state=r.memoizedState,n.componentWillUnmount()}catch(p){Xe(r,t,p)}cn(e,t,r);break;case 21:cn(e,t,r);break;case 22:r.mode&1?(wt=(n=wt)||r.memoizedState!==null,cn(e,t,r),wt=n):cn(e,t,r);break;default:cn(e,t,r)}}function $d(e){var t=e.updateQueue;if(t!==null){e.updateQueue=null;var r=e.stateNode;r===null&&(r=e.stateNode=new zp),t.forEach(function(n){var o=Mp.bind(null,e,n);r.has(n)||(r.add(n),n.then(o,o))})}}function sr(e,t){var r=t.deletions;if(r!==null)for(var n=0;n<r.length;n++){var o=r[n];try{var a=e,s=t,p=s;e:for(;p!==null;){switch(p.tag){case 5:mt=p.stateNode,lr=!1;break e;case 3:mt=p.stateNode.containerInfo,lr=!0;break e;case 4:mt=p.stateNode.containerInfo,lr=!0;break e}p=p.return}if(mt===null)throw Error(c(160));Bd(a,s,o),mt=null,lr=!1;var f=o.alternate;f!==null&&(f.return=null),o.return=null}catch(w){Xe(o,t,w)}}if(t.subtreeFlags&12854)for(t=t.child;t!==null;)Ud(t,e),t=t.sibling}function Ud(e,t){var r=e.alternate,n=e.flags;switch(e.tag){case 0:case 11:case 14:case 15:if(sr(t,e),wr(e),n&4){try{wo(3,e,e.return),Aa(3,e)}catch(ee){Xe(e,e.return,ee)}try{wo(5,e,e.return)}catch(ee){Xe(e,e.return,ee)}}break;case 1:sr(t,e),wr(e),n&512&&r!==null&&Ri(r,r.return);break;case 5:if(sr(t,e),wr(e),n&512&&r!==null&&Ri(r,r.return),e.flags&32){var o=e.stateNode;try{Wr(o,"")}catch(ee){Xe(e,e.return,ee)}}if(n&4&&(o=e.stateNode,o!=null)){var a=e.memoizedProps,s=r!==null?r.memoizedProps:a,p=e.type,f=e.updateQueue;if(e.updateQueue=null,f!==null)try{p==="input"&&a.type==="radio"&&a.name!=null&&No(o,a),Zn(p,s);var w=Zn(p,a);for(s=0;s<f.length;s+=2){var M=f[s],F=f[s+1];M==="style"?er(o,F):M==="dangerouslySetInnerHTML"?qn(o,F):M==="children"?Wr(o,F):ge(o,M,F,w)}switch(p){case"input":zr(o,a);break;case"textarea":Eo(o,a);break;case"select":var _=o._wrapperState.wasMultiple;o._wrapperState.wasMultiple=!!a.multiple;var Q=a.value;Q!=null?xn(o,!!a.multiple,Q,!1):_!==!!a.multiple&&(a.defaultValue!=null?xn(o,!!a.multiple,a.defaultValue,!0):xn(o,!!a.multiple,a.multiple?[]:"",!1))}o[co]=a}catch(ee){Xe(e,e.return,ee)}}break;case 6:if(sr(t,e),wr(e),n&4){if(e.stateNode===null)throw Error(c(162));o=e.stateNode,a=e.memoizedProps;try{o.nodeValue=a}catch(ee){Xe(e,e.return,ee)}}break;case 3:if(sr(t,e),wr(e),n&4&&r!==null&&r.memoizedState.isDehydrated)try{Zr(t.containerInfo)}catch(ee){Xe(e,e.return,ee)}break;case 4:sr(t,e),wr(e);break;case 13:sr(t,e),wr(e),o=e.child,o.flags&8192&&(a=o.memoizedState!==null,o.stateNode.isHidden=a,!a||o.alternate!==null&&o.alternate.memoizedState!==null||(Ns=He())),n&4&&$d(e);break;case 22:if(M=r!==null&&r.memoizedState!==null,e.mode&1?(wt=(w=wt)||M,sr(t,e),wt=w):sr(t,e),wr(e),n&8192){if(w=e.memoizedState!==null,(e.stateNode.isHidden=w)&&!M&&(e.mode&1)!==0)for(K=e,M=e.child;M!==null;){for(F=K=M;K!==null;){switch(_=K,Q=_.child,_.tag){case 0:case 11:case 14:case 15:wo(4,_,_.return);break;case 1:Ri(_,_.return);var Z=_.stateNode;if(typeof Z.componentWillUnmount=="function"){n=_,r=_.return;try{t=n,Z.props=t.memoizedProps,Z.state=t.memoizedState,Z.componentWillUnmount()}catch(ee){Xe(n,r,ee)}}break;case 5:Ri(_,_.return);break;case 22:if(_.memoizedState!==null){Qd(F);continue}}Q!==null?(Q.return=_,K=Q):Qd(F)}M=M.sibling}e:for(M=null,F=e;;){if(F.tag===5){if(M===null){M=F;try{o=F.stateNode,w?(a=o.style,typeof a.setProperty=="function"?a.setProperty("display","none","important"):a.display="none"):(p=F.stateNode,f=F.memoizedProps.style,s=f!=null&&f.hasOwnProperty("display")?f.display:null,p.style.display=se("display",s))}catch(ee){Xe(e,e.return,ee)}}}else if(F.tag===6){if(M===null)try{F.stateNode.nodeValue=w?"":F.memoizedProps}catch(ee){Xe(e,e.return,ee)}}else if((F.tag!==22&&F.tag!==23||F.memoizedState===null||F===e)&&F.child!==null){F.child.return=F,F=F.child;continue}if(F===e)break e;for(;F.sibling===null;){if(F.return===null||F.return===e)break e;M===F&&(M=null),F=F.return}M===F&&(M=null),F.sibling.return=F.return,F=F.sibling}}break;case 19:sr(t,e),wr(e),n&4&&$d(e);break;case 21:break;default:sr(t,e),wr(e)}}function wr(e){var t=e.flags;if(t&2){try{e:{for(var r=e.return;r!==null;){if(Dd(r)){var n=r;break e}r=r.return}throw Error(c(160))}switch(n.tag){case 5:var o=n.stateNode;n.flags&32&&(Wr(o,""),n.flags&=-33);var a=Ad(e);js(e,a,o);break;case 3:case 4:var s=n.stateNode.containerInfo,p=Ad(e);ks(e,p,s);break;default:throw Error(c(161))}}catch(f){Xe(e,e.return,f)}e.flags&=-3}t&4096&&(e.flags&=-4097)}function jp(e,t,r){K=e,Wd(e)}function Wd(e,t,r){for(var n=(e.mode&1)!==0;K!==null;){var o=K,a=o.child;if(o.tag===22&&n){var s=o.memoizedState!==null||Da;if(!s){var p=o.alternate,f=p!==null&&p.memoizedState!==null||wt;p=Da;var w=wt;if(Da=s,(wt=f)&&!w)for(K=o;K!==null;)s=K,f=s.child,s.tag===22&&s.memoizedState!==null?Yd(o):f!==null?(f.return=s,K=f):Yd(o);for(;a!==null;)K=a,Wd(a),a=a.sibling;K=o,Da=p,wt=w}Hd(e)}else(o.subtreeFlags&8772)!==0&&a!==null?(a.return=o,K=a):Hd(e)}}function Hd(e){for(;K!==null;){var t=K;if((t.flags&8772)!==0){var r=t.alternate;try{if((t.flags&8772)!==0)switch(t.tag){case 0:case 11:case 15:wt||Aa(5,t);break;case 1:var n=t.stateNode;if(t.flags&4&&!wt)if(r===null)n.componentDidMount();else{var o=t.elementType===t.type?r.memoizedProps:ar(t.type,r.memoizedProps);n.componentDidUpdate(o,r.memoizedState,n.__reactInternalSnapshotBeforeUpdate)}var a=t.updateQueue;a!==null&&Qc(t,a,n);break;case 3:var s=t.updateQueue;if(s!==null){if(r=null,t.child!==null)switch(t.child.tag){case 5:r=t.child.stateNode;break;case 1:r=t.child.stateNode}Qc(t,s,r)}break;case 5:var p=t.stateNode;if(r===null&&t.flags&4){r=p;var f=t.memoizedProps;switch(t.type){case"button":case"input":case"select":case"textarea":f.autoFocus&&r.focus();break;case"img":f.src&&(r.src=f.src)}}break;case 6:break;case 4:break;case 12:break;case 13:if(t.memoizedState===null){var w=t.alternate;if(w!==null){var M=w.memoizedState;if(M!==null){var F=M.dehydrated;F!==null&&Zr(F)}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;default:throw Error(c(163))}wt||t.flags&512&&zs(t)}catch(_){Xe(t,t.return,_)}}if(t===e){K=null;break}if(r=t.sibling,r!==null){r.return=t.return,K=r;break}K=t.return}}function Qd(e){for(;K!==null;){var t=K;if(t===e){K=null;break}var r=t.sibling;if(r!==null){r.return=t.return,K=r;break}K=t.return}}function Yd(e){for(;K!==null;){var t=K;try{switch(t.tag){case 0:case 11:case 15:var r=t.return;try{Aa(4,t)}catch(f){Xe(t,r,f)}break;case 1:var n=t.stateNode;if(typeof n.componentDidMount=="function"){var o=t.return;try{n.componentDidMount()}catch(f){Xe(t,o,f)}}var a=t.return;try{zs(t)}catch(f){Xe(t,a,f)}break;case 5:var s=t.return;try{zs(t)}catch(f){Xe(t,s,f)}}}catch(f){Xe(t,t.return,f)}if(t===e){K=null;break}var p=t.sibling;if(p!==null){p.return=t.return,K=p;break}K=t.return}}var Sp=Math.ceil,Ba=ye.ReactCurrentDispatcher,Ss=ye.ReactCurrentOwner,Zt=ye.ReactCurrentBatchConfig,Fe=0,pt=null,ot=null,ht=0,At=0,Fi=nn(0),st=0,zo=null,Un=0,$a=0,Cs=0,ko=null,_t=null,Ns=0,Ii=1/0,Or=null,Ua=!1,Es=null,dn=null,Wa=!1,un=null,Ha=0,jo=0,Ps=null,Qa=-1,Ya=0;function jt(){return(Fe&6)!==0?He():Qa!==-1?Qa:Qa=He()}function pn(e){return(e.mode&1)===0?1:(Fe&2)!==0&&ht!==0?ht&-ht:sp.transition!==null?(Ya===0&&(Ya=Bo()),Ya):(e=Oe,e!==0||(e=window.event,e=e===void 0?16:Uo(e.type)),e)}function cr(e,t,r,n){if(50<jo)throw jo=0,Ps=null,Error(c(185));tr(e,r,n),((Fe&2)===0||e!==pt)&&(e===pt&&((Fe&2)===0&&($a|=r),st===4&&fn(e,ht)),Mt(e,n),r===1&&Fe===0&&(t.mode&1)===0&&(Ii=He()+500,ba&&an()))}function Mt(e,t){var r=e.callbackNode;ai(e,t);var n=It(e,e===pt?ht:0);if(n===0)r!==null&&dt(r),e.callbackNode=null,e.callbackPriority=0;else if(t=n&-n,e.callbackPriority!==t){if(r!=null&&dt(r),t===1)e.tag===0?lp(Gd.bind(null,e)):Tc(Gd.bind(null,e)),np(function(){(Fe&6)===0&&an()}),r=null;else{switch(Kr(n)){case 1:r=ri;break;case 4:r=ni;break;case 16:r=Vr;break;case 536870912:r=jr;break;default:r=Vr}r=ru(r,Vd.bind(null,e))}e.callbackPriority=t,e.callbackNode=r}}function Vd(e,t){if(Qa=-1,Ya=0,(Fe&6)!==0)throw Error(c(327));var r=e.callbackNode;if(Oi()&&e.callbackNode!==r)return null;var n=It(e,e===pt?ht:0);if(n===0)return null;if((n&30)!==0||(n&e.expiredLanes)!==0||t)t=Va(e,n);else{t=n;var o=Fe;Fe|=2;var a=qd();(pt!==e||ht!==t)&&(Or=null,Ii=He()+500,Hn(e,t));do try{Ep();break}catch(p){Kd(e,p)}while(!0);Vl(),Ba.current=a,Fe=o,ot!==null?t=0:(pt=null,ht=0,t=st)}if(t!==0){if(t===2&&(o=Wt(e),o!==0&&(n=o,t=Ls(e,o))),t===1)throw r=zo,Hn(e,0),fn(e,n),Mt(e,He()),r;if(t===6)fn(e,n);else{if(o=e.current.alternate,(n&30)===0&&!Cp(o)&&(t=Va(e,n),t===2&&(a=Wt(e),a!==0&&(n=a,t=Ls(e,a))),t===1))throw r=zo,Hn(e,0),fn(e,n),Mt(e,He()),r;switch(e.finishedWork=o,e.finishedLanes=n,t){case 0:case 1:throw Error(c(345));case 2:Qn(e,_t,Or);break;case 3:if(fn(e,n),(n&130023424)===n&&(t=Ns+500-He(),10<t)){if(It(e,0)!==0)break;if(o=e.suspendedLanes,(o&n)!==n){jt(),e.pingedLanes|=e.suspendedLanes&o;break}e.timeoutHandle=Il(Qn.bind(null,e,_t,Or),t);break}Qn(e,_t,Or);break;case 4:if(fn(e,n),(n&4194240)===n)break;for(t=e.eventTimes,o=-1;0<n;){var s=31-rt(n);a=1<<s,s=t[s],s>o&&(o=s),n&=~a}if(n=o,n=He()-n,n=(120>n?120:480>n?480:1080>n?1080:1920>n?1920:3e3>n?3e3:4320>n?4320:1960*Sp(n/1960))-n,10<n){e.timeoutHandle=Il(Qn.bind(null,e,_t,Or),n);break}Qn(e,_t,Or);break;case 5:Qn(e,_t,Or);break;default:throw Error(c(329))}}}return Mt(e,He()),e.callbackNode===r?Vd.bind(null,e):null}function Ls(e,t){var r=ko;return e.current.memoizedState.isDehydrated&&(Hn(e,t).flags|=256),e=Va(e,t),e!==2&&(t=_t,_t=r,t!==null&&_s(t)),e}function _s(e){_t===null?_t=e:_t.push.apply(_t,e)}function Cp(e){for(var t=e;;){if(t.flags&16384){var r=t.updateQueue;if(r!==null&&(r=r.stores,r!==null))for(var n=0;n<r.length;n++){var o=r[n],a=o.getSnapshot;o=o.value;try{if(!ir(a(),o))return!1}catch{return!1}}}if(r=t.child,t.subtreeFlags&16384&&r!==null)r.return=t,t=r;else{if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return!0;t=t.return}t.sibling.return=t.return,t=t.sibling}}return!0}function fn(e,t){for(t&=~Cs,t&=~$a,e.suspendedLanes|=t,e.pingedLanes&=~t,e=e.expirationTimes;0<t;){var r=31-rt(t),n=1<<r;e[r]=-1,t&=~n}}function Gd(e){if((Fe&6)!==0)throw Error(c(327));Oi();var t=It(e,0);if((t&1)===0)return Mt(e,He()),null;var r=Va(e,t);if(e.tag!==0&&r===2){var n=Wt(e);n!==0&&(t=n,r=Ls(e,n))}if(r===1)throw r=zo,Hn(e,0),fn(e,t),Mt(e,He()),r;if(r===6)throw Error(c(345));return e.finishedWork=e.current.alternate,e.finishedLanes=t,Qn(e,_t,Or),Mt(e,He()),null}function Ms(e,t){var r=Fe;Fe|=1;try{return e(t)}finally{Fe=r,Fe===0&&(Ii=He()+500,ba&&an())}}function Wn(e){un!==null&&un.tag===0&&(Fe&6)===0&&Oi();var t=Fe;Fe|=1;var r=Zt.transition,n=Oe;try{if(Zt.transition=null,Oe=1,e)return e()}finally{Oe=n,Zt.transition=r,Fe=t,(Fe&6)===0&&an()}}function Ts(){At=Fi.current,We(Fi)}function Hn(e,t){e.finishedWork=null,e.finishedLanes=0;var r=e.timeoutHandle;if(r!==-1&&(e.timeoutHandle=-1,rp(r)),ot!==null)for(r=ot.return;r!==null;){var n=r;switch(Ul(n),n.tag){case 1:n=n.type.childContextTypes,n!=null&&va();break;case 3:Mi(),We(Et),We(vt),ts();break;case 5:Xl(n);break;case 4:Mi();break;case 13:We(Ke);break;case 19:We(Ke);break;case 10:Gl(n.type._context);break;case 22:case 23:Ts()}r=r.return}if(pt=e,ot=e=mn(e.current,null),ht=At=t,st=0,zo=null,Cs=$a=Un=0,_t=ko=null,An!==null){for(t=0;t<An.length;t++)if(r=An[t],n=r.interleaved,n!==null){r.interleaved=null;var o=n.next,a=r.pending;if(a!==null){var s=a.next;a.next=o,n.next=s}r.pending=n}An=null}return e}function Kd(e,t){do{var r=ot;try{if(Vl(),La.current=Ra,_a){for(var n=qe.memoizedState;n!==null;){var o=n.queue;o!==null&&(o.pending=null),n=n.next}_a=!1}if($n=0,ut=lt=qe=null,go=!1,xo=0,Ss.current=null,r===null||r.return===null){st=1,zo=t,ot=null;break}e:{var a=e,s=r.return,p=r,f=t;if(t=ht,p.flags|=32768,f!==null&&typeof f=="object"&&typeof f.then=="function"){var w=f,M=p,F=M.tag;if((M.mode&1)===0&&(F===0||F===11||F===15)){var _=M.alternate;_?(M.updateQueue=_.updateQueue,M.memoizedState=_.memoizedState,M.lanes=_.lanes):(M.updateQueue=null,M.memoizedState=null)}var Q=bd(s);if(Q!==null){Q.flags&=-257,wd(Q,s,p,a,t),Q.mode&1&&yd(a,w,t),t=Q,f=w;var Z=t.updateQueue;if(Z===null){var ee=new Set;ee.add(f),t.updateQueue=ee}else Z.add(f);break e}else{if((t&1)===0){yd(a,w,t),Rs();break e}f=Error(c(426))}}else if(Ve&&p.mode&1){var tt=bd(s);if(tt!==null){(tt.flags&65536)===0&&(tt.flags|=256),wd(tt,s,p,a,t),Ql(Ti(f,p));break e}}a=f=Ti(f,p),st!==4&&(st=2),ko===null?ko=[a]:ko.push(a),a=s;do{switch(a.tag){case 3:a.flags|=65536,t&=-t,a.lanes|=t;var x=xd(a,f,t);Hc(a,x);break e;case 1:p=f;var m=a.type,b=a.stateNode;if((a.flags&128)===0&&(typeof m.getDerivedStateFromError=="function"||b!==null&&typeof b.componentDidCatch=="function"&&(dn===null||!dn.has(b)))){a.flags|=65536,t&=-t,a.lanes|=t;var I=vd(a,p,t);Hc(a,I);break e}}a=a.return}while(a!==null)}Jd(r)}catch(re){t=re,ot===r&&r!==null&&(ot=r=r.return);continue}break}while(!0)}function qd(){var e=Ba.current;return Ba.current=Ra,e===null?Ra:e}function Rs(){(st===0||st===3||st===2)&&(st=4),pt===null||(Un&268435455)===0&&($a&268435455)===0||fn(pt,ht)}function Va(e,t){var r=Fe;Fe|=2;var n=qd();(pt!==e||ht!==t)&&(Or=null,Hn(e,t));do try{Np();break}catch(o){Kd(e,o)}while(!0);if(Vl(),Fe=r,Ba.current=n,ot!==null)throw Error(c(261));return pt=null,ht=0,st}function Np(){for(;ot!==null;)Zd(ot)}function Ep(){for(;ot!==null&&!Fo();)Zd(ot)}function Zd(e){var t=tu(e.alternate,e,At);e.memoizedProps=e.pendingProps,t===null?Jd(e):ot=t,Ss.current=null}function Jd(e){var t=e;do{var r=t.alternate;if(e=t.return,(t.flags&32768)===0){if(r=bp(r,t,At),r!==null){ot=r;return}}else{if(r=wp(r,t),r!==null){r.flags&=32767,ot=r;return}if(e!==null)e.flags|=32768,e.subtreeFlags=0,e.deletions=null;else{st=6,ot=null;return}}if(t=t.sibling,t!==null){ot=t;return}ot=t=e}while(t!==null);st===0&&(st=5)}function Qn(e,t,r){var n=Oe,o=Zt.transition;try{Zt.transition=null,Oe=1,Pp(e,t,r,n)}finally{Zt.transition=o,Oe=n}return null}function Pp(e,t,r,n){do Oi();while(un!==null);if((Fe&6)!==0)throw Error(c(327));r=e.finishedWork;var o=e.finishedLanes;if(r===null)return null;if(e.finishedWork=null,e.finishedLanes=0,r===e.current)throw Error(c(177));e.callbackNode=null,e.callbackPriority=0;var a=r.lanes|r.childLanes;if(Cn(e,a),e===pt&&(ot=pt=null,ht=0),(r.subtreeFlags&2064)===0&&(r.flags&2064)===0||Wa||(Wa=!0,ru(Vr,function(){return Oi(),null})),a=(r.flags&15990)!==0,(r.subtreeFlags&15990)!==0||a){a=Zt.transition,Zt.transition=null;var s=Oe;Oe=1;var p=Fe;Fe|=4,Ss.current=null,kp(e,r),Ud(r,e),Ku(Rl),ci=!!Tl,Rl=Tl=null,e.current=r,jp(r),Vi(),Fe=p,Oe=s,Zt.transition=a}else e.current=r;if(Wa&&(Wa=!1,un=e,Ha=o),a=e.pendingLanes,a===0&&(dn=null),ii(r.stateNode),Mt(e,He()),t!==null)for(n=e.onRecoverableError,r=0;r<t.length;r++)o=t[r],n(o.value,{componentStack:o.stack,digest:o.digest});if(Ua)throw Ua=!1,e=Es,Es=null,e;return(Ha&1)!==0&&e.tag!==0&&Oi(),a=e.pendingLanes,(a&1)!==0?e===Ps?jo++:(jo=0,Ps=e):jo=0,an(),null}function Oi(){if(un!==null){var e=Kr(Ha),t=Zt.transition,r=Oe;try{if(Zt.transition=null,Oe=16>e?16:e,un===null)var n=!1;else{if(e=un,un=null,Ha=0,(Fe&6)!==0)throw Error(c(331));var o=Fe;for(Fe|=4,K=e.current;K!==null;){var a=K,s=a.child;if((K.flags&16)!==0){var p=a.deletions;if(p!==null){for(var f=0;f<p.length;f++){var w=p[f];for(K=w;K!==null;){var M=K;switch(M.tag){case 0:case 11:case 15:wo(8,M,a)}var F=M.child;if(F!==null)F.return=M,K=F;else for(;K!==null;){M=K;var _=M.sibling,Q=M.return;if(Od(M),M===w){K=null;break}if(_!==null){_.return=Q,K=_;break}K=Q}}}var Z=a.alternate;if(Z!==null){var ee=Z.child;if(ee!==null){Z.child=null;do{var tt=ee.sibling;ee.sibling=null,ee=tt}while(ee!==null)}}K=a}}if((a.subtreeFlags&2064)!==0&&s!==null)s.return=a,K=s;else e:for(;K!==null;){if(a=K,(a.flags&2048)!==0)switch(a.tag){case 0:case 11:case 15:wo(9,a,a.return)}var x=a.sibling;if(x!==null){x.return=a.return,K=x;break e}K=a.return}}var m=e.current;for(K=m;K!==null;){s=K;var b=s.child;if((s.subtreeFlags&2064)!==0&&b!==null)b.return=s,K=b;else e:for(s=m;K!==null;){if(p=K,(p.flags&2048)!==0)try{switch(p.tag){case 0:case 11:case 15:Aa(9,p)}}catch(re){Xe(p,p.return,re)}if(p===s){K=null;break e}var I=p.sibling;if(I!==null){I.return=p.return,K=I;break e}K=p.return}}if(Fe=o,an(),Nt&&typeof Nt.onPostCommitFiberRoot=="function")try{Nt.onPostCommitFiberRoot(kn,e)}catch{}n=!0}return n}finally{Oe=r,Zt.transition=t}}return!1}function Xd(e,t,r){t=Ti(r,t),t=xd(e,t,1),e=sn(e,t,1),t=jt(),e!==null&&(tr(e,1,t),Mt(e,t))}function Xe(e,t,r){if(e.tag===3)Xd(e,e,r);else for(;t!==null;){if(t.tag===3){Xd(t,e,r);break}else if(t.tag===1){var n=t.stateNode;if(typeof t.type.getDerivedStateFromError=="function"||typeof n.componentDidCatch=="function"&&(dn===null||!dn.has(n))){e=Ti(r,e),e=vd(t,e,1),t=sn(t,e,1),e=jt(),t!==null&&(tr(t,1,e),Mt(t,e));break}}t=t.return}}function Lp(e,t,r){var n=e.pingCache;n!==null&&n.delete(t),t=jt(),e.pingedLanes|=e.suspendedLanes&r,pt===e&&(ht&r)===r&&(st===4||st===3&&(ht&130023424)===ht&&500>He()-Ns?Hn(e,0):Cs|=r),Mt(e,t)}function eu(e,t){t===0&&((e.mode&1)===0?t=1:(t=oi,oi<<=1,(oi&130023424)===0&&(oi=4194304)));var r=jt();e=Rr(e,t),e!==null&&(tr(e,t,r),Mt(e,r))}function _p(e){var t=e.memoizedState,r=0;t!==null&&(r=t.retryLane),eu(e,r)}function Mp(e,t){var r=0;switch(e.tag){case 13:var n=e.stateNode,o=e.memoizedState;o!==null&&(r=o.retryLane);break;case 19:n=e.stateNode;break;default:throw Error(c(314))}n!==null&&n.delete(t),eu(e,r)}var tu;tu=function(e,t,r){if(e!==null)if(e.memoizedProps!==t.pendingProps||Et.current)Lt=!0;else{if((e.lanes&r)===0&&(t.flags&128)===0)return Lt=!1,yp(e,t,r);Lt=(e.flags&131072)!==0}else Lt=!1,Ve&&(t.flags&1048576)!==0&&Rc(t,za,t.index);switch(t.lanes=0,t.tag){case 2:var n=t.type;Oa(e,t),e=t.pendingProps;var o=Si(t,vt.current);_i(t,r),o=is(null,t,n,e,o,r);var a=os();return t.flags|=1,typeof o=="object"&&o!==null&&typeof o.render=="function"&&o.$$typeof===void 0?(t.tag=1,t.memoizedState=null,t.updateQueue=null,Pt(n)?(a=!0,ya(t)):a=!1,t.memoizedState=o.state!==null&&o.state!==void 0?o.state:null,Zl(t),o.updater=Fa,t.stateNode=o,o._reactInternals=t,us(t,n,e,r),t=hs(null,t,n,!0,a,r)):(t.tag=0,Ve&&a&&$l(t),kt(null,t,o,r),t=t.child),t;case 16:n=t.elementType;e:{switch(Oa(e,t),e=t.pendingProps,o=n._init,n=o(n._payload),t.type=n,o=t.tag=Rp(n),e=ar(n,e),o){case 0:t=ms(null,t,n,e,r);break e;case 1:t=Nd(null,t,n,e,r);break e;case 11:t=zd(null,t,n,e,r);break e;case 14:t=kd(null,t,n,ar(n.type,e),r);break e}throw Error(c(306,n,""))}return t;case 0:return n=t.type,o=t.pendingProps,o=t.elementType===n?o:ar(n,o),ms(e,t,n,o,r);case 1:return n=t.type,o=t.pendingProps,o=t.elementType===n?o:ar(n,o),Nd(e,t,n,o,r);case 3:e:{if(Ed(t),e===null)throw Error(c(387));n=t.pendingProps,a=t.memoizedState,o=a.element,Wc(e,t),Ea(t,n,null,r);var s=t.memoizedState;if(n=s.element,a.isDehydrated)if(a={element:n,isDehydrated:!1,cache:s.cache,pendingSuspenseBoundaries:s.pendingSuspenseBoundaries,transitions:s.transitions},t.updateQueue.baseState=a,t.memoizedState=a,t.flags&256){o=Ti(Error(c(423)),t),t=Pd(e,t,n,r,o);break e}else if(n!==o){o=Ti(Error(c(424)),t),t=Pd(e,t,n,r,o);break e}else for(Dt=rn(t.stateNode.containerInfo.firstChild),Ot=t,Ve=!0,or=null,r=$c(t,null,n,r),t.child=r;r;)r.flags=r.flags&-3|4096,r=r.sibling;else{if(Ei(),n===o){t=Ir(e,t,r);break e}kt(e,t,n,r)}t=t.child}return t;case 5:return Yc(t),e===null&&Hl(t),n=t.type,o=t.pendingProps,a=e!==null?e.memoizedProps:null,s=o.children,Fl(n,o)?s=null:a!==null&&Fl(n,a)&&(t.flags|=32),Cd(e,t),kt(e,t,s,r),t.child;case 6:return e===null&&Hl(t),null;case 13:return Ld(e,t,r);case 4:return Jl(t,t.stateNode.containerInfo),n=t.pendingProps,e===null?t.child=Pi(t,null,n,r):kt(e,t,n,r),t.child;case 11:return n=t.type,o=t.pendingProps,o=t.elementType===n?o:ar(n,o),zd(e,t,n,o,r);case 7:return kt(e,t,t.pendingProps,r),t.child;case 8:return kt(e,t,t.pendingProps.children,r),t.child;case 12:return kt(e,t,t.pendingProps.children,r),t.child;case 10:e:{if(n=t.type._context,o=t.pendingProps,a=t.memoizedProps,s=o.value,Be(Sa,n._currentValue),n._currentValue=s,a!==null)if(ir(a.value,s)){if(a.children===o.children&&!Et.current){t=Ir(e,t,r);break e}}else for(a=t.child,a!==null&&(a.return=t);a!==null;){var p=a.dependencies;if(p!==null){s=a.child;for(var f=p.firstContext;f!==null;){if(f.context===n){if(a.tag===1){f=Fr(-1,r&-r),f.tag=2;var w=a.updateQueue;if(w!==null){w=w.shared;var M=w.pending;M===null?f.next=f:(f.next=M.next,M.next=f),w.pending=f}}a.lanes|=r,f=a.alternate,f!==null&&(f.lanes|=r),Kl(a.return,r,t),p.lanes|=r;break}f=f.next}}else if(a.tag===10)s=a.type===t.type?null:a.child;else if(a.tag===18){if(s=a.return,s===null)throw Error(c(341));s.lanes|=r,p=s.alternate,p!==null&&(p.lanes|=r),Kl(s,r,t),s=a.sibling}else s=a.child;if(s!==null)s.return=a;else for(s=a;s!==null;){if(s===t){s=null;break}if(a=s.sibling,a!==null){a.return=s.return,s=a;break}s=s.return}a=s}kt(e,t,o.children,r),t=t.child}return t;case 9:return o=t.type,n=t.pendingProps.children,_i(t,r),o=Kt(o),n=n(o),t.flags|=1,kt(e,t,n,r),t.child;case 14:return n=t.type,o=ar(n,t.pendingProps),o=ar(n.type,o),kd(e,t,n,o,r);case 15:return jd(e,t,t.type,t.pendingProps,r);case 17:return n=t.type,o=t.pendingProps,o=t.elementType===n?o:ar(n,o),Oa(e,t),t.tag=1,Pt(n)?(e=!0,ya(t)):e=!1,_i(t,r),hd(t,n,o),us(t,n,o,r),hs(null,t,n,!0,e,r);case 19:return Md(e,t,r);case 22:return Sd(e,t,r)}throw Error(c(156,t.tag))};function ru(e,t){return ti(e,t)}function Tp(e,t,r,n){this.tag=e,this.key=r,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.ref=null,this.pendingProps=t,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=n,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function Jt(e,t,r,n){return new Tp(e,t,r,n)}function Fs(e){return e=e.prototype,!(!e||!e.isReactComponent)}function Rp(e){if(typeof e=="function")return Fs(e)?1:0;if(e!=null){if(e=e.$$typeof,e===$)return 11;if(e===Ne)return 14}return 2}function mn(e,t){var r=e.alternate;return r===null?(r=Jt(e.tag,t,e.key,e.mode),r.elementType=e.elementType,r.type=e.type,r.stateNode=e.stateNode,r.alternate=e,e.alternate=r):(r.pendingProps=t,r.type=e.type,r.flags=0,r.subtreeFlags=0,r.deletions=null),r.flags=e.flags&14680064,r.childLanes=e.childLanes,r.lanes=e.lanes,r.child=e.child,r.memoizedProps=e.memoizedProps,r.memoizedState=e.memoizedState,r.updateQueue=e.updateQueue,t=e.dependencies,r.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext},r.sibling=e.sibling,r.index=e.index,r.ref=e.ref,r}function Ga(e,t,r,n,o,a){var s=2;if(n=e,typeof e=="function")Fs(e)&&(s=1);else if(typeof e=="string")s=5;else e:switch(e){case ze:return Yn(r.children,o,a,t);case Ce:s=8,o|=8;break;case ie:return e=Jt(12,r,t,o|2),e.elementType=ie,e.lanes=a,e;case L:return e=Jt(13,r,t,o),e.elementType=L,e.lanes=a,e;case W:return e=Jt(19,r,t,o),e.elementType=W,e.lanes=a,e;case ne:return Ka(r,o,a,t);default:if(typeof e=="object"&&e!==null)switch(e.$$typeof){case V:s=10;break e;case Je:s=9;break e;case $:s=11;break e;case Ne:s=14;break e;case me:s=16,n=null;break e}throw Error(c(130,e==null?e:typeof e,""))}return t=Jt(s,r,t,o),t.elementType=e,t.type=n,t.lanes=a,t}function Yn(e,t,r,n){return e=Jt(7,e,n,t),e.lanes=r,e}function Ka(e,t,r,n){return e=Jt(22,e,n,t),e.elementType=ne,e.lanes=r,e.stateNode={isHidden:!1},e}function Is(e,t,r){return e=Jt(6,e,null,t),e.lanes=r,e}function Os(e,t,r){return t=Jt(4,e.children!==null?e.children:[],e.key,t),t.lanes=r,t.stateNode={containerInfo:e.containerInfo,pendingChildren:null,implementation:e.implementation},t}function Fp(e,t,r,n,o){this.tag=t,this.containerInfo=e,this.finishedWork=this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.pendingContext=this.context=null,this.callbackPriority=0,this.eventTimes=Sn(0),this.expirationTimes=Sn(-1),this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=Sn(0),this.identifierPrefix=n,this.onRecoverableError=o,this.mutableSourceEagerHydrationData=null}function Ds(e,t,r,n,o,a,s,p,f){return e=new Fp(e,t,r,p,f),t===1?(t=1,a===!0&&(t|=8)):t=0,a=Jt(3,null,null,t),e.current=a,a.stateNode=e,a.memoizedState={element:n,isDehydrated:r,cache:null,transitions:null,pendingSuspenseBoundaries:null},Zl(a),e}function Ip(e,t,r){var n=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:ve,key:n==null?null:""+n,children:e,containerInfo:t,implementation:r}}function nu(e){if(!e)return on;e=e._reactInternals;e:{if(xt(e)!==e||e.tag!==1)throw Error(c(170));var t=e;do{switch(t.tag){case 3:t=t.stateNode.context;break e;case 1:if(Pt(t.type)){t=t.stateNode.__reactInternalMemoizedMergedChildContext;break e}}t=t.return}while(t!==null);throw Error(c(171))}if(e.tag===1){var r=e.type;if(Pt(r))return _c(e,r,t)}return t}function iu(e,t,r,n,o,a,s,p,f){return e=Ds(r,n,!0,e,o,a,s,p,f),e.context=nu(null),r=e.current,n=jt(),o=pn(r),a=Fr(n,o),a.callback=t??null,sn(r,a,o),e.current.lanes=o,tr(e,o,n),Mt(e,n),e}function qa(e,t,r,n){var o=t.current,a=jt(),s=pn(o);return r=nu(r),t.context===null?t.context=r:t.pendingContext=r,t=Fr(a,s),t.payload={element:e},n=n===void 0?null:n,n!==null&&(t.callback=n),e=sn(o,t,s),e!==null&&(cr(e,o,s,a),Na(e,o,s)),s}function Za(e){if(e=e.current,!e.child)return null;switch(e.child.tag){case 5:return e.child.stateNode;default:return e.child.stateNode}}function ou(e,t){if(e=e.memoizedState,e!==null&&e.dehydrated!==null){var r=e.retryLane;e.retryLane=r!==0&&r<t?r:t}}function As(e,t){ou(e,t),(e=e.alternate)&&ou(e,t)}function Op(){return null}var au=typeof reportError=="function"?reportError:function(e){console.error(e)};function Bs(e){this._internalRoot=e}Ja.prototype.render=Bs.prototype.render=function(e){var t=this._internalRoot;if(t===null)throw Error(c(409));qa(e,t,null,null)},Ja.prototype.unmount=Bs.prototype.unmount=function(){var e=this._internalRoot;if(e!==null){this._internalRoot=null;var t=e.containerInfo;Wn(function(){qa(null,e,null,null)}),t[Lr]=null}};function Ja(e){this._internalRoot=e}Ja.prototype.unstable_scheduleHydration=function(e){if(e){var t=En();e={blockedOn:null,target:e,priority:t};for(var r=0;r<Ae.length&&t!==0&&t<Ae[r].priority;r++);Ae.splice(r,0,e),r===0&&_n(e)}};function $s(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11)}function Xa(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11&&(e.nodeType!==8||e.nodeValue!==" react-mount-point-unstable "))}function lu(){}function Dp(e,t,r,n,o){if(o){if(typeof n=="function"){var a=n;n=function(){var w=Za(s);a.call(w)}}var s=iu(t,n,e,0,null,!1,!1,"",lu);return e._reactRootContainer=s,e[Lr]=s.current,lo(e.nodeType===8?e.parentNode:e),Wn(),s}for(;o=e.lastChild;)e.removeChild(o);if(typeof n=="function"){var p=n;n=function(){var w=Za(f);p.call(w)}}var f=Ds(e,0,!1,null,null,!1,!1,"",lu);return e._reactRootContainer=f,e[Lr]=f.current,lo(e.nodeType===8?e.parentNode:e),Wn(function(){qa(t,f,r,n)}),f}function el(e,t,r,n,o){var a=r._reactRootContainer;if(a){var s=a;if(typeof o=="function"){var p=o;o=function(){var f=Za(s);p.call(f)}}qa(t,s,e,o)}else s=Dp(r,t,e,o,n);return Za(s)}li=function(e){switch(e.tag){case 3:var t=e.stateNode;if(t.current.memoizedState.isDehydrated){var r=hr(t.pendingLanes);r!==0&&(Gr(t,r|1),Mt(t,He()),(Fe&6)===0&&(Ii=He()+500,an()))}break;case 13:Wn(function(){var n=Rr(e,1);if(n!==null){var o=jt();cr(n,e,1,o)}}),As(e,1)}},Nn=function(e){if(e.tag===13){var t=Rr(e,134217728);if(t!==null){var r=jt();cr(t,e,134217728,r)}As(e,134217728)}},Gi=function(e){if(e.tag===13){var t=pn(e),r=Rr(e,t);if(r!==null){var n=jt();cr(r,e,t,n)}As(e,t)}},En=function(){return Oe},je=function(e,t){var r=Oe;try{return Oe=e,t()}finally{Oe=r}},ct=function(e,t,r){switch(t){case"input":if(zr(e,r),t=r.name,r.type==="radio"&&t!=null){for(r=e;r.parentNode;)r=r.parentNode;for(r=r.querySelectorAll("input[name="+JSON.stringify(""+t)+'][type="radio"]'),t=0;t<r.length;t++){var n=r[t];if(n!==e&&n.form===e.form){var o=xa(n);if(!o)throw Error(c(90));gn(n),zr(n,o)}}}break;case"textarea":Eo(e,r);break;case"select":t=r.value,t!=null&&xn(e,!!r.multiple,t,!1)}},Qr=Ms,Po=Wn;var Ap={usingClientEntryPoint:!1,Events:[uo,ki,xa,zn,Hr,Ms]},So={findFiberByHostInstance:Fn,bundleType:0,version:"18.3.1",rendererPackageName:"react-dom"},Bp={bundleType:So.bundleType,version:So.version,rendererPackageName:So.rendererPackageName,rendererConfig:So.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:ye.ReactCurrentDispatcher,findHostInstanceByFiber:function(e){return e=Yi(e),e===null?null:e.stateNode},findFiberByHostInstance:So.findFiberByHostInstance||Op,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.3.1-next-f1338f8080-20240426"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var tl=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!tl.isDisabled&&tl.supportsFiber)try{kn=tl.inject(Bp),Nt=tl}catch{}}return Tt.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=Ap,Tt.createPortal=function(e,t){var r=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!$s(t))throw Error(c(200));return Ip(e,t,null,r)},Tt.createRoot=function(e,t){if(!$s(e))throw Error(c(299));var r=!1,n="",o=au;return t!=null&&(t.unstable_strictMode===!0&&(r=!0),t.identifierPrefix!==void 0&&(n=t.identifierPrefix),t.onRecoverableError!==void 0&&(o=t.onRecoverableError)),t=Ds(e,1,!1,null,null,r,!1,n,o),e[Lr]=t.current,lo(e.nodeType===8?e.parentNode:e),new Bs(t)},Tt.findDOMNode=function(e){if(e==null)return null;if(e.nodeType===1)return e;var t=e._reactInternals;if(t===void 0)throw typeof e.render=="function"?Error(c(188)):(e=Object.keys(e).join(","),Error(c(268,e)));return e=Yi(t),e=e===null?null:e.stateNode,e},Tt.flushSync=function(e){return Wn(e)},Tt.hydrate=function(e,t,r){if(!Xa(t))throw Error(c(200));return el(null,e,t,!0,r)},Tt.hydrateRoot=function(e,t,r){if(!$s(e))throw Error(c(405));var n=r!=null&&r.hydratedSources||null,o=!1,a="",s=au;if(r!=null&&(r.unstable_strictMode===!0&&(o=!0),r.identifierPrefix!==void 0&&(a=r.identifierPrefix),r.onRecoverableError!==void 0&&(s=r.onRecoverableError)),t=iu(t,null,e,1,r??null,o,!1,a,s),e[Lr]=t.current,lo(e),n)for(e=0;e<n.length;e++)r=n[e],o=r._getVersion,o=o(r._source),t.mutableSourceEagerHydrationData==null?t.mutableSourceEagerHydrationData=[r,o]:t.mutableSourceEagerHydrationData.push(r,o);return new Ja(t)},Tt.render=function(e,t,r){if(!Xa(t))throw Error(c(200));return el(null,e,t,!1,r)},Tt.unmountComponentAtNode=function(e){if(!Xa(e))throw Error(c(40));return e._reactRootContainer?(Wn(function(){el(null,null,e,!1,function(){e._reactRootContainer=null,e[Lr]=null})}),!0):!1},Tt.unstable_batchedUpdates=Ms,Tt.unstable_renderSubtreeIntoContainer=function(e,t,r,n){if(!Xa(r))throw Error(c(200));if(e==null||e._reactInternals===void 0)throw Error(c(38));return el(e,t,r,!1,n)},Tt.version="18.3.1-next-f1338f8080-20240426",Tt}var gu;function qp(){if(gu)return Hs.exports;gu=1;function l(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(l)}catch(u){console.error(u)}}return l(),Hs.exports=Kp(),Hs.exports}var xu;function Zp(){if(xu)return rl;xu=1;var l=qp();return rl.createRoot=l.createRoot,rl.hydrateRoot=l.hydrateRoot,rl}var Jp=Zp();const Xp=Pu(Jp),Lu="https://apipos.muscatfood.com",Xs="gzp_customer_token",ec="gzp_checkout_idempotency_key";let Dr="";const ef=()=>{if(Dr)return Dr;try{Dr=sessionStorage.getItem(ec)||""}catch{}if(!Dr){const l=globalThis.crypto;if(l!=null&&l.randomUUID)Dr=l.randomUUID();else if(l!=null&&l.getRandomValues)Dr=Array.from(l.getRandomValues(new Uint8Array(24)),u=>u.toString(16).padStart(2,"0")).join("");else throw new Error("Secure random generation is unavailable. Please use a modern browser to place your order.");try{sessionStorage.setItem(ec,Dr)}catch{}}return Dr},vu=()=>{Dr="";try{sessionStorage.removeItem(ec)}catch{}},oc=l=>{l?sessionStorage.setItem(Xs,l):sessionStorage.removeItem(Xs)};async function gt(l,u={}){let c;try{const z=sessionStorage.getItem(Xs);c=await fetch(`${Lu}${l}`,{...u,credentials:"include",headers:{"Content-Type":"application/json","X-Storefront-Client":"online-store",...z?{Authorization:`Bearer ${z}`}:{},...u.headers}})}catch{const C=new Error("Network error. Please check your connection.");throw C.isNetworkError=!0,C}const y=await c.json().catch(()=>({}));if(!c.ok){const z=new Error(y.message||"Something went wrong. Please try again.");throw z.status=c.status,z.data=y.data,z}return y}const tf=()=>gt("/api/category/public"),yu=()=>gt("/api/dish/public"),bu=()=>gt("/api/deal/public"),rf=()=>gt("/api/hero-slide/public"),nf=(l,u)=>gt("/api/order/public/checkout",{method:"POST",headers:{"Idempotency-Key":u},body:JSON.stringify(l)}),of=l=>gt("/api/coupon/public/validate",{method:"POST",body:JSON.stringify(l)}),af=l=>gt("/api/coupon/public/welcome",{method:"POST",body:JSON.stringify(l)}),lf=async l=>{const u=await gt("/api/customer/register",{method:"POST",body:JSON.stringify(l)});return oc(u.data.token),u},sf=async l=>{const u=await gt("/api/customer/login",{method:"POST",body:JSON.stringify(l)});return oc(u.data.token),u},cf=()=>gt("/api/customer/me"),df=async()=>{try{return await gt("/api/customer/logout",{method:"POST"})}finally{oc("")}},wu=l=>gt(`/api/order/public/${l}`),uf=l=>gt(`/api/order/public/${l}/cancel`,{method:"PATCH"}),pf=l=>gt(`/api/order/public/lookup?phone=${encodeURIComponent(l)}`),zu=()=>gt("/api/settings");async function ff(l){const u=new FormData;u.append("screenshot",l);let c;try{c=await fetch(`${Lu}/api/order/public/payment-proof`,{method:"POST",body:u})}catch{const z=new Error("Network error. Please check your connection and try again.");throw z.isNetworkError=!0,z}const y=await c.json().catch(()=>({}));if(!c.ok){const z=new Error(y.message||"Couldn't upload the screenshot. Please try again.");throw z.status=c.status,z}return y}const mf=()=>gt("/api/branch/public"),hf=l=>gt("/api/branch/public/quote",{method:"POST",body:JSON.stringify(l)}),gf="https://apipos.muscatfood.com",dr=l=>l?l.startsWith("http://")||l.startsWith("https://")?l:l.startsWith("/uploads/")?`${gf}${l}`:l:"",Gn="/assets/genz-pizza-land-logo-CQKpkaM4.jpg",xf="/assets/sindbad-solution-logo-DhhzzCiL.png",vf=`
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
`;var _u={color:void 0,size:void 0,className:void 0,style:void 0,attr:void 0},ku=Ar.createContext&&Ar.createContext(_u),yf=["attr","size","title"];function bf(l,u){if(l==null)return{};var c,y,z=wf(l,u);if(Object.getOwnPropertySymbols){var C=Object.getOwnPropertySymbols(l);for(y=0;y<C.length;y++)c=C[y],u.indexOf(c)===-1&&{}.propertyIsEnumerable.call(l,c)&&(z[c]=l[c])}return z}function wf(l,u){if(l==null)return{};var c={};for(var y in l)if({}.hasOwnProperty.call(l,y)){if(u.indexOf(y)!==-1)continue;c[y]=l[y]}return c}function pl(){return pl=Object.assign?Object.assign.bind():function(l){for(var u=1;u<arguments.length;u++){var c=arguments[u];for(var y in c)({}).hasOwnProperty.call(c,y)&&(l[y]=c[y])}return l},pl.apply(null,arguments)}function ju(l,u){var c=Object.keys(l);if(Object.getOwnPropertySymbols){var y=Object.getOwnPropertySymbols(l);u&&(y=y.filter(function(z){return Object.getOwnPropertyDescriptor(l,z).enumerable})),c.push.apply(c,y)}return c}function fl(l){for(var u=1;u<arguments.length;u++){var c=arguments[u]!=null?arguments[u]:{};u%2?ju(Object(c),!0).forEach(function(y){zf(l,y,c[y])}):Object.getOwnPropertyDescriptors?Object.defineProperties(l,Object.getOwnPropertyDescriptors(c)):ju(Object(c)).forEach(function(y){Object.defineProperty(l,y,Object.getOwnPropertyDescriptor(c,y))})}return l}function zf(l,u,c){return(u=kf(u))in l?Object.defineProperty(l,u,{value:c,enumerable:!0,configurable:!0,writable:!0}):l[u]=c,l}function kf(l){var u=jf(l,"string");return typeof u=="symbol"?u:u+""}function jf(l,u){if(typeof l!="object"||!l)return l;var c=l[Symbol.toPrimitive];if(c!==void 0){var y=c.call(l,u);if(typeof y!="object")return y;throw new TypeError("@@toPrimitive must return a primitive value.")}return(u==="string"?String:Number)(l)}function Mu(l){return l&&l.map((u,c)=>Ar.createElement(u.tag,fl({key:c},u.attr),Mu(u.child)))}function be(l){return u=>Ar.createElement(Sf,pl({attr:fl({},l.attr)},u),Mu(l.child))}function Sf(l){var u=c=>{var y=l.attr,z=l.size,C=l.title,S=bf(l,yf),O=z||c.size||"1em",j;return c.className&&(j=c.className),l.className&&(j=(j?j+" ":"")+l.className),Ar.createElement("svg",pl({stroke:"currentColor",fill:"currentColor",strokeWidth:"0"},c.attr,y,S,{className:j,style:fl(fl({color:l.color||c.color},c.style),l.style),height:O,width:O,xmlns:"http://www.w3.org/2000/svg"}),C&&Ar.createElement("title",null,C),l.children)};return ku!==void 0?Ar.createElement(ku.Consumer,null,c=>u(c)):u(_u)}function Cf(l){return be({attr:{viewBox:"0 0 384 512"},child:[{tag:"path",attr:{d:"M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"},child:[]}]})(l)}function Nf(l){return be({attr:{viewBox:"0 0 320 512"},child:[{tag:"path",attr:{d:"M32.1 29.3C33.5 12.8 47.4 0 64 0L256 0c16.6 0 30.5 12.8 31.9 29.3l14 168.4c6 72-42.5 135.2-109.9 150.6l0 99.6 48 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-80 0-80 0c-17.7 0-32-14.3-32-32s14.3-32 32-32l48 0 0-99.6C60.6 333 12.1 269.8 18.1 197.8l14-168.4zm56 98.7l143.8 0-5.3-64L93.4 64l-5.3 64z"},child:[]}]})(l)}function Ef(l){return be({attr:{viewBox:"0 0 576 512"},child:[{tag:"path",attr:{d:"M234.7 42.7L197 56.8c-3 1.1-5 4-5 7.2s2 6.1 5 7.2l37.7 14.1L248.8 123c1.1 3 4 5 7.2 5s6.1-2 7.2-5l14.1-37.7L315 71.2c3-1.1 5-4 5-7.2s-2-6.1-5-7.2L277.3 42.7 263.2 5c-1.1-3-4-5-7.2-5s-6.1 2-7.2 5L234.7 42.7zM46.1 395.4c-18.7 18.7-18.7 49.1 0 67.9l34.6 34.6c18.7 18.7 49.1 18.7 67.9 0L529.9 116.5c18.7-18.7 18.7-49.1 0-67.9L495.3 14.1c-18.7-18.7-49.1-18.7-67.9 0L46.1 395.4zM484.6 82.6l-105 105-23.3-23.3 105-105 23.3 23.3zM7.5 117.2C3 118.9 0 123.2 0 128s3 9.1 7.5 10.8L64 160l21.2 56.5c1.7 4.5 6 7.5 10.8 7.5s9.1-3 10.8-7.5L128 160l56.5-21.2c4.5-1.7 7.5-6 7.5-10.8s-3-9.1-7.5-10.8L128 96 106.8 39.5C105.1 35 100.8 32 96 32s-9.1 3-10.8 7.5L64 96 7.5 117.2zm352 256c-4.5 1.7-7.5 6-7.5 10.8s3 9.1 7.5 10.8L416 416l21.2 56.5c1.7 4.5 6 7.5 10.8 7.5s9.1-3 10.8-7.5L480 416l56.5-21.2c4.5-1.7 7.5-6 7.5-10.8s-3-9.1-7.5-10.8L480 352l-21.2-56.5c-1.7-4.5-6-7.5-10.8-7.5s-9.1 3-10.8 7.5L416 352l-56.5 21.2z"},child:[]}]})(l)}function Pf(l){return be({attr:{viewBox:"0 0 448 512"},child:[{tag:"path",attr:{d:"M416 0C400 0 288 32 288 176l0 112c0 35.3 28.7 64 64 64l32 0 0 128c0 17.7 14.3 32 32 32s32-14.3 32-32l0-128 0-112 0-208c0-17.7-14.3-32-32-32zM64 16C64 7.8 57.9 1 49.7 .1S34.2 4.6 32.4 12.5L2.1 148.8C.7 155.1 0 161.5 0 167.9c0 45.9 35.1 83.6 80 87.7L80 480c0 17.7 14.3 32 32 32s32-14.3 32-32l0-224.4c44.9-4.1 80-41.8 80-87.7c0-6.4-.7-12.8-2.1-19.1L191.6 12.5c-1.8-8-9.3-13.3-17.4-12.4S160 7.8 160 16l0 134.2c0 5.4-4.4 9.8-9.8 9.8c-5.1 0-9.3-3.9-9.8-9L127.9 14.6C127.2 6.3 120.3 0 112 0s-15.2 6.3-15.9 14.6L83.7 151c-.5 5.1-4.7 9-9.8 9c-5.4 0-9.8-4.4-9.8-9.8L64 16zm48.3 152l-.3 0-.3 0 .3-.7 .3 .7z"},child:[]}]})(l)}function Lf(l){return be({attr:{viewBox:"0 0 512 512"},child:[{tag:"path",attr:{d:"M256 32c14.2 0 27.3 7.5 34.5 19.8l216 368c7.3 12.4 7.3 27.7 .2 40.1S486.3 480 472 480L40 480c-14.3 0-27.6-7.7-34.7-20.1s-7-27.8 .2-40.1l216-368C228.7 39.5 241.8 32 256 32zm0 128c-13.3 0-24 10.7-24 24l0 112c0 13.3 10.7 24 24 24s24-10.7 24-24l0-112c0-13.3-10.7-24-24-24zm32 224a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z"},child:[]}]})(l)}function _f(l){return be({attr:{viewBox:"0 0 576 512"},child:[{tag:"path",attr:{d:"M547.6 103.8L490.3 13.1C485.2 5 476.1 0 466.4 0L109.6 0C99.9 0 90.8 5 85.7 13.1L28.3 103.8c-29.6 46.8-3.4 111.9 51.9 119.4c4 .5 8.1 .8 12.1 .8c26.1 0 49.3-11.4 65.2-29c15.9 17.6 39.1 29 65.2 29c26.1 0 49.3-11.4 65.2-29c15.9 17.6 39.1 29 65.2 29c26.2 0 49.3-11.4 65.2-29c16 17.6 39.1 29 65.2 29c4.1 0 8.1-.3 12.1-.8c55.5-7.4 81.8-72.5 52.1-119.4zM499.7 254.9c0 0 0 0-.1 0c-5.3 .7-10.7 1.1-16.2 1.1c-12.4 0-24.3-1.9-35.4-5.3L448 384l-320 0 0-133.4c-11.2 3.5-23.2 5.4-35.6 5.4c-5.5 0-11-.4-16.3-1.1l-.1 0c-4.1-.6-8.1-1.3-12-2.3L64 384l0 64c0 35.3 28.7 64 64 64l320 0c35.3 0 64-28.7 64-64l0-64 0-131.4c-4 1-8 1.8-12.3 2.3z"},child:[]}]})(l)}function Mf(l){return be({attr:{viewBox:"0 0 576 512"},child:[{tag:"path",attr:{d:"M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"},child:[]}]})(l)}function Tf(l){return be({attr:{viewBox:"0 0 512 512"},child:[{tag:"path",attr:{d:"M192 104.8c0-9.2-5.8-17.3-13.2-22.8C167.2 73.3 160 61.3 160 48c0-26.5 28.7-48 64-48s64 21.5 64 48c0 13.3-7.2 25.3-18.8 34c-7.4 5.5-13.2 13.6-13.2 22.8c0 12.8 10.4 23.2 23.2 23.2l56.8 0c26.5 0 48 21.5 48 48l0 56.8c0 12.8 10.4 23.2 23.2 23.2c9.2 0 17.3-5.8 22.8-13.2c8.7-11.6 20.7-18.8 34-18.8c26.5 0 48 28.7 48 64s-21.5 64-48 64c-13.3 0-25.3-7.2-34-18.8c-5.5-7.4-13.6-13.2-22.8-13.2c-12.8 0-23.2 10.4-23.2 23.2L384 464c0 26.5-21.5 48-48 48l-56.8 0c-12.8 0-23.2-10.4-23.2-23.2c0-9.2 5.8-17.3 13.2-22.8c11.6-8.7 18.8-20.7 18.8-34c0-26.5-28.7-48-64-48s-64 21.5-64 48c0 13.3 7.2 25.3 18.8 34c7.4 5.5 13.2 13.6 13.2 22.8c0 12.8-10.4 23.2-23.2 23.2L48 512c-26.5 0-48-21.5-48-48L0 343.2C0 330.4 10.4 320 23.2 320c9.2 0 17.3 5.8 22.8 13.2C54.7 344.8 66.7 352 80 352c26.5 0 48-28.7 48-64s-21.5-64-48-64c-13.3 0-25.3 7.2-34 18.8C40.5 250.2 32.4 256 23.2 256C10.4 256 0 245.6 0 232.8L0 176c0-26.5 21.5-48 48-48l120.8 0c12.8 0 23.2-10.4 23.2-23.2z"},child:[]}]})(l)}function Rf(l){return be({attr:{viewBox:"0 0 512 512"},child:[{tag:"path",attr:{d:"M169.7 .9c-22.8-1.6-41.9 14-47.5 34.7L110.4 80c.5 0 1.1 0 1.6 0c176.7 0 320 143.3 320 320c0 .5 0 1.1 0 1.6l44.4-11.8c20.8-5.5 36.3-24.7 34.7-47.5C498.5 159.5 352.5 13.5 169.7 .9zM399.8 410.2c.1-3.4 .2-6.8 .2-10.2c0-159.1-128.9-288-288-288c-3.4 0-6.8 .1-10.2 .2L.5 491.9c-1.5 5.5 .1 11.4 4.1 15.4s9.9 5.6 15.4 4.1L399.8 410.2zM176 208a32 32 0 1 1 0 64 32 32 0 1 1 0-64zm64 128a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zM96 384a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"},child:[]}]})(l)}function Ff(l){return be({attr:{viewBox:"0 0 512 512"},child:[{tag:"path",attr:{d:"M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z"},child:[]}]})(l)}function If(l){return be({attr:{viewBox:"0 0 512 512"},child:[{tag:"path",attr:{d:"M428.3 3c11.6-6.4 26.2-2.3 32.6 9.3l4.8 8.7c19.3 34.7 19.8 75.7 3.4 110C495.8 159.6 512 197.9 512 240c0 18.5-3.1 36.3-8.9 52.8c-6.1 17.3-28.5 16.3-36.8-.1l-11.7-23.4c-4.1-8.1-12.4-13.3-21.5-13.3L360 256c-13.3 0-24-10.7-24-24l0-80c0-13.3-10.7-24-24-24l-17.1 0c-21.3 0-30-23.9-10.8-32.9C304.7 85.4 327.7 80 352 80c28.3 0 54.8 7.3 77.8 20.2c5.5-18.2 3.7-38.4-6-55.8L419 35.7c-6.4-11.6-2.3-26.2 9.3-32.6zM171.2 345.5L264 160l40 0 0 80c0 26.5 21.5 48 48 48l76.2 0 23.9 47.8C372.3 443.9 244.3 512 103.2 512l-58.8 0C19.9 512 0 492.1 0 467.6c0-20.8 14.5-38.8 34.8-43.3l49.8-11.1c37.6-8.4 69.5-33.2 86.7-67.7z"},child:[]}]})(l)}function Of(l){return be({attr:{viewBox:"0 0 512 512"},child:[{tag:"path",attr:{d:"M88 0C74.7 0 64 10.7 64 24c0 38.9 23.4 59.4 39.1 73.1l1.1 1C120.5 112.3 128 119.9 128 136c0 13.3 10.7 24 24 24s24-10.7 24-24c0-38.9-23.4-59.4-39.1-73.1l-1.1-1C119.5 47.7 112 40.1 112 24c0-13.3-10.7-24-24-24zM32 192c-17.7 0-32 14.3-32 32L0 416c0 53 43 96 96 96l192 0c53 0 96-43 96-96l16 0c61.9 0 112-50.1 112-112s-50.1-112-112-112l-48 0L32 192zm352 64l16 0c26.5 0 48 21.5 48 48s-21.5 48-48 48l-16 0 0-96zM224 24c0-13.3-10.7-24-24-24s-24 10.7-24 24c0 38.9 23.4 59.4 39.1 73.1l1.1 1C232.5 112.3 240 119.9 240 136c0 13.3 10.7 24 24 24s24-10.7 24-24c0-38.9-23.4-59.4-39.1-73.1l-1.1-1C231.5 47.7 224 40.1 224 24z"},child:[]}]})(l)}function Df(l){return be({attr:{viewBox:"0 0 640 512"},child:[{tag:"path",attr:{d:"M280 32c-13.3 0-24 10.7-24 24s10.7 24 24 24l57.7 0 16.4 30.3L256 192l-45.3-45.3c-12-12-28.3-18.7-45.3-18.7L64 128c-17.7 0-32 14.3-32 32l0 32 96 0c88.4 0 160 71.6 160 160c0 11-1.1 21.7-3.2 32l70.4 0c-2.1-10.3-3.2-21-3.2-32c0-52.2 25-98.6 63.7-127.8l15.4 28.6C402.4 276.3 384 312 384 352c0 70.7 57.3 128 128 128s128-57.3 128-128s-57.3-128-128-128c-13.5 0-26.5 2.1-38.7 6L418.2 128l61.8 0c17.7 0 32-14.3 32-32l0-32c0-17.7-14.3-32-32-32l-20.4 0c-7.5 0-14.7 2.6-20.5 7.4L391.7 78.9l-14-26c-7-12.9-20.5-21-35.2-21L280 32zM462.7 311.2l28.2 52.2c6.3 11.7 20.9 16 32.5 9.7s16-20.9 9.7-32.5l-28.2-52.2c2.3-.3 4.7-.4 7.1-.4c35.3 0 64 28.7 64 64s-28.7 64-64 64s-64-28.7-64-64c0-15.5 5.5-29.7 14.7-40.8zM187.3 376c-9.5 23.5-32.5 40-59.3 40c-35.3 0-64-28.7-64-64s28.7-64 64-64c26.9 0 49.9 16.5 59.3 40l66.4 0C242.5 268.8 190.5 224 128 224C57.3 224 0 281.3 0 352s57.3 128 128 128c62.5 0 114.5-44.8 125.8-104l-66.4 0zM128 384a32 32 0 1 0 0-64 32 32 0 1 0 0 64z"},child:[]}]})(l)}function Af(l){return be({attr:{viewBox:"0 0 576 512"},child:[{tag:"path",attr:{d:"M64 64C28.7 64 0 92.7 0 128L0 384c0 35.3 28.7 64 64 64l448 0c35.3 0 64-28.7 64-64l0-256c0-35.3-28.7-64-64-64L64 64zm64 320l-64 0 0-64c35.3 0 64 28.7 64 64zM64 192l0-64 64 0c0 35.3-28.7 64-64 64zM448 384c0-35.3 28.7-64 64-64l0 64-64 0zm64-192c-35.3 0-64-28.7-64-64l64 0 0 64zM288 160a96 96 0 1 1 0 192 96 96 0 1 1 0-192z"},child:[]}]})(l)}function Bf(l){return be({attr:{viewBox:"0 0 384 512"},child:[{tag:"path",attr:{d:"M16 64C16 28.7 44.7 0 80 0L304 0c35.3 0 64 28.7 64 64l0 384c0 35.3-28.7 64-64 64L80 512c-35.3 0-64-28.7-64-64L16 64zM144 448c0 8.8 7.2 16 16 16l64 0c8.8 0 16-7.2 16-16s-7.2-16-16-16l-64 0c-8.8 0-16 7.2-16 16zM304 64L80 64l0 320 224 0 0-320z"},child:[]}]})(l)}function $f(l){return be({attr:{viewBox:"0 0 512 512"},child:[{tag:"path",attr:{d:"M32 0C19.1 0 7.4 7.8 2.4 19.8s-2.2 25.7 6.9 34.9L224 269.3 224 448l-64 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l96 0 96 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-64 0 0-178.7L502.6 54.6c9.2-9.2 11.9-22.9 6.9-34.9S492.9 0 480 0L32 0zM173.3 128l-64-64 293.5 0-64 64-165.5 0z"},child:[]}]})(l)}function Uf(l){return be({attr:{viewBox:"0 0 384 512"},child:[{tag:"path",attr:{d:"M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z"},child:[]}]})(l)}function Wf(l){return be({attr:{viewBox:"0 0 512 512"},child:[{tag:"path",attr:{d:"M272 96c-78.6 0-145.1 51.5-167.7 122.5c33.6-17 71.5-26.5 111.7-26.5l88 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-16 0-72 0s0 0 0 0c-16.6 0-32.7 1.9-48.3 5.4c-25.9 5.9-49.9 16.4-71.4 30.7c0 0 0 0 0 0C38.3 298.8 0 364.9 0 440l0 16c0 13.3 10.7 24 24 24s24-10.7 24-24l0-16c0-48.7 20.7-92.5 53.8-123.2C121.6 392.3 190.3 448 272 448l1 0c132.1-.7 239-130.9 239-291.4c0-42.6-7.5-83.1-21.1-119.6c-2.6-6.9-12.7-6.6-16.2-.1C455.9 72.1 418.7 96 376 96L272 96z"},child:[]}]})(l)}function Hf(l){return be({attr:{viewBox:"0 0 448 512"},child:[{tag:"path",attr:{d:"M367.1 160c.6-5.3 .9-10.6 .9-16C368 64.5 303.5 0 224 0S80 64.5 80 144c0 5.4 .3 10.7 .9 16l-.9 0c-26.5 0-48 21.5-48 48s21.5 48 48 48l53.5 0 181 0 53.5 0c26.5 0 48-21.5 48-48s-21.5-48-48-48l-.9 0zM96 288L200.8 497.7c4.4 8.8 13.3 14.3 23.2 14.3s18.8-5.5 23.2-14.3L352 288 96 288z"},child:[]}]})(l)}function Qf(l){return be({attr:{viewBox:"0 0 384 512"},child:[{tag:"path",attr:{d:"M32 0C14.3 0 0 14.3 0 32S14.3 64 32 64l0 11c0 42.4 16.9 83.1 46.9 113.1L146.7 256 78.9 323.9C48.9 353.9 32 394.6 32 437l0 11c-17.7 0-32 14.3-32 32s14.3 32 32 32l32 0 256 0 32 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l0-11c0-42.4-16.9-83.1-46.9-113.1L237.3 256l67.9-67.9c30-30 46.9-70.7 46.9-113.1l0-11c17.7 0 32-14.3 32-32s-14.3-32-32-32L320 0 64 0 32 0zM96 75l0-11 192 0 0 11c0 19-5.6 37.4-16 53L112 128c-10.3-15.6-16-34-16-53zm16 309c3.5-5.3 7.6-10.3 12.1-14.9L192 301.3l67.9 67.9c4.6 4.6 8.6 9.6 12.1 14.9L112 384z"},child:[]}]})(l)}function Yf(l){return be({attr:{viewBox:"0 0 512 512"},child:[{tag:"path",attr:{d:"M488.6 23.4c31.2 31.2 31.2 81.9 0 113.1l-352 352c-31.2 31.2-81.9 31.2-113.1 0s-31.2-81.9 0-113.1l352-352c31.2-31.2 81.9-31.2 113.1 0zM443.3 92.7c-6.2-6.2-16.4-6.2-22.6 0c-12.5 12.5-23.8 15.1-37.5 17.6l-2.5 .4c-13.8 2.5-31.6 5.6-48 22c-16.7 16.7-20.9 36-24.1 50.9c0 0 0 0 0 0s0 0 0 0l-.2 1c-3.4 15.6-6 26.4-15.7 36.1s-20.5 12.3-36.1 15.7l-1 .2c-14.9 3.2-34.2 7.4-50.9 24.1s-20.9 36-24.1 50.9l-.2 1c-3.4 15.6-6 26.4-15.7 36.1c-9.2 9.2-18 10.8-32.7 13.4c0 0 0 0 0 0l-.9 .2c-15.6 2.8-34.9 6.9-54.4 26.4c-6.2 6.2-6.2 16.4 0 22.6s16.4 6.2 22.6 0c12.5-12.5 23.8-15.1 37.5-17.6l2.5-.4c13.8-2.5 31.6-5.6 48-22c16.7-16.7 20.9-36 24.1-50.9l.2-1c3.4-15.6 6-26.4 15.7-36.1s20.5-12.3 36.1-15.7l1-.2c14.9-3.2 34.2-7.4 50.9-24.1s20.9-36 24.1-50.9l.2-1c3.4-15.6 6-26.4 15.7-36.1c9.2-9.2 18-10.8 32.7-13.4l.9-.2c15.6-2.8 34.9-6.9 54.4-26.4c6.2-6.2 6.2-16.4 0-22.6zM191.2 479.2l288-288L495 207c10.9 10.9 17 25.6 17 41s-6.1 30.1-17 41L289 495c-10.9 10.9-25.6 17-41 17s-30.1-6.1-41-17l-15.8-15.8zM17 305C6.1 294.1 0 279.4 0 264s6.1-30.1 17-41L223 17C233.9 6.1 248.6 0 264 0s30.1 6.1 41 17l15.8 15.8-288 288L17 305z"},child:[]}]})(l)}function Vf(l){return be({attr:{viewBox:"0 0 448 512"},child:[{tag:"path",attr:{d:"M159.3 5.4c7.8-7.3 19.9-7.2 27.7 .1c27.6 25.9 53.5 53.8 77.7 84c11-14.4 23.5-30.1 37-42.9c7.9-7.4 20.1-7.4 28 .1c34.6 33 63.9 76.6 84.5 118c20.3 40.8 33.8 82.5 33.8 111.9C448 404.2 348.2 512 224 512C98.4 512 0 404.1 0 276.5c0-38.4 17.8-85.3 45.4-131.7C73.3 97.7 112.7 48.6 159.3 5.4zM225.7 416c25.3 0 47.7-7 68.8-21c42.1-29.4 53.4-88.2 28.1-134.4c-4.5-9-16-9.6-22.5-2l-25.2 29.3c-6.6 7.6-18.5 7.4-24.7-.5c-16.5-21-46-58.5-62.8-79.8c-6.3-8-18.3-8.1-24.7-.1c-33.8 42.5-50.8 69.3-50.8 99.4C112 375.4 162.6 416 225.7 416z"},child:[]}]})(l)}function Gf(l){return be({attr:{viewBox:"0 0 512 512"},child:[{tag:"path",attr:{d:"M160 265.2c0 8.5-3.4 16.6-9.4 22.6l-26.8 26.8c-12.3 12.3-32.5 11.4-49.4 7.2C69.8 320.6 65 320 60 320c-33.1 0-60 26.9-60 60s26.9 60 60 60c6.3 0 12 5.7 12 12c0 33.1 26.9 60 60 60s60-26.9 60-60c0-5-.6-9.8-1.8-14.5c-4.2-16.9-5.2-37.1 7.2-49.4l26.8-26.8c6-6 14.1-9.4 22.6-9.4l89.2 0c6.3 0 12.4-.3 18.5-1c11.9-1.2 16.4-15.5 10.8-26c-8.5-15.8-13.3-33.8-13.3-53c0-61.9 50.1-112 112-112c8 0 15.7 .8 23.2 2.4c11.7 2.5 24.1-5.9 22-17.6C494.5 62.5 422.5 0 336 0C238.8 0 160 78.8 160 176l0 89.2z"},child:[]}]})(l)}function Kf(l){return be({attr:{viewBox:"0 0 576 512"},child:[{tag:"path",attr:{d:"M64 32C28.7 32 0 60.7 0 96l0 32 576 0 0-32c0-35.3-28.7-64-64-64L64 32zM576 224L0 224 0 416c0 35.3 28.7 64 64 64l448 0c35.3 0 64-28.7 64-64l0-192zM112 352l64 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-64 0c-8.8 0-16-7.2-16-16s7.2-16 16-16zm112 16c0-8.8 7.2-16 16-16l128 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-128 0c-8.8 0-16-7.2-16-16z"},child:[]}]})(l)}function qf(l){return be({attr:{viewBox:"0 0 512 512"},child:[{tag:"path",attr:{d:"M257.5 27.6c-.8-5.4-4.9-9.8-10.3-10.6c-22.1-3.1-44.6 .9-64.4 11.4l-74 39.5C89.1 78.4 73.2 94.9 63.4 115L26.7 190.6c-9.8 20.1-13 42.9-9.1 64.9l14.5 82.8c3.9 22.1 14.6 42.3 30.7 57.9l60.3 58.4c16.1 15.6 36.6 25.6 58.7 28.7l83 11.7c22.1 3.1 44.6-.9 64.4-11.4l74-39.5c19.7-10.5 35.6-27 45.4-47.2l36.7-75.5c9.8-20.1 13-42.9 9.1-64.9c-.9-5.3-5.3-9.3-10.6-10.1c-51.5-8.2-92.8-47.1-104.5-97.4c-1.8-7.6-8-13.4-15.7-14.6c-54.6-8.7-97.7-52-106.2-106.8zM208 144a32 32 0 1 1 0 64 32 32 0 1 1 0-64zM144 336a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm224-64a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"},child:[]}]})(l)}function Zf(l){return be({attr:{viewBox:"0 0 512 512"},child:[{tag:"path",attr:{d:"M256 448c141.4 0 256-93.1 256-208S397.4 32 256 32S0 125.1 0 240c0 45.1 17.7 86.8 47.7 120.9c-1.9 24.5-11.4 46.3-21.4 62.9c-5.5 9.2-11.1 16.6-15.2 21.6c-2.1 2.5-3.7 4.4-4.9 5.7c-.6 .6-1 1.1-1.3 1.4l-.3 .3c0 0 0 0 0 0c0 0 0 0 0 0s0 0 0 0s0 0 0 0c-4.6 4.6-5.9 11.4-3.4 17.4c2.5 6 8.3 9.9 14.8 9.9c28.7 0 57.6-8.9 81.6-19.3c22.9-10 42.4-21.9 54.3-30.6c31.8 11.5 67 17.9 104.1 17.9zM128 208a32 32 0 1 1 0 64 32 32 0 1 1 0-64zm128 0a32 32 0 1 1 0 64 32 32 0 1 1 0-64zm96 32a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"},child:[]}]})(l)}function Jf(l){return be({attr:{viewBox:"0 0 512 512"},child:[{tag:"path",attr:{d:"M256 0a256 256 0 1 1 0 512A256 256 0 1 1 256 0zM232 120l0 136c0 8 4 15.5 10.7 20l96 64c11 7.4 25.9 4.4 33.3-6.7s4.4-25.9-6.7-33.3L280 243.2 280 120c0-13.3-10.7-24-24-24s-24 10.7-24 24z"},child:[]}]})(l)}function Xf(l){return be({attr:{viewBox:"0 0 512 512"},child:[{tag:"path",attr:{d:"M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z"},child:[]}]})(l)}function em(l){return be({attr:{viewBox:"0 0 512 512"},child:[{tag:"path",attr:{d:"M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"},child:[]}]})(l)}function tm(l){return be({attr:{viewBox:"0 0 512 512"},child:[{tag:"path",attr:{d:"M512 240.2l0 15.8L0 256c0-20 10-38.7 26.6-49.8L274.9 40.7c8.6-5.7 18.6-8.7 28.9-8.7C418.8 32 512 125.2 512 240.2zm0 47.8l0 128c0 35.3-28.7 64-64 64L64 480c-35.3 0-64-28.7-64-64L0 288l512 0z"},child:[]}]})(l)}function rm(l){return be({attr:{viewBox:"0 0 448 512"},child:[{tag:"path",attr:{d:"M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"},child:[]}]})(l)}function nm(l){return be({attr:{viewBox:"0 0 576 512"},child:[{tag:"path",attr:{d:"M0 24C0 10.7 10.7 0 24 0L69.5 0c22 0 41.5 12.8 50.6 32l411 0c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3l-288.5 0 5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5L488 336c13.3 0 24 10.7 24 24s-10.7 24-24 24l-288.3 0c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5L24 48C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z"},child:[]}]})(l)}function im(l){return be({attr:{viewBox:"0 0 512 512"},child:[{tag:"path",attr:{d:"M149.1 64.8L138.7 96 64 96C28.7 96 0 124.7 0 160L0 416c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-256c0-35.3-28.7-64-64-64l-74.7 0L362.9 64.8C356.4 45.2 338.1 32 317.4 32L194.6 32c-20.7 0-39 13.2-45.5 32.8zM256 192a96 96 0 1 1 0 192 96 96 0 1 1 0-192z"},child:[]}]})(l)}function om(l){return be({attr:{viewBox:"0 0 448 512"},child:[{tag:"path",attr:{d:"M86.4 5.5L61.8 47.6C58 54.1 56 61.6 56 69.2L56 72c0 22.1 17.9 40 40 40s40-17.9 40-40l0-2.8c0-7.6-2-15-5.8-21.6L105.6 5.5C103.6 2.1 100 0 96 0s-7.6 2.1-9.6 5.5zm128 0L189.8 47.6c-3.8 6.5-5.8 14-5.8 21.6l0 2.8c0 22.1 17.9 40 40 40s40-17.9 40-40l0-2.8c0-7.6-2-15-5.8-21.6L233.6 5.5C231.6 2.1 228 0 224 0s-7.6 2.1-9.6 5.5zM317.8 47.6c-3.8 6.5-5.8 14-5.8 21.6l0 2.8c0 22.1 17.9 40 40 40s40-17.9 40-40l0-2.8c0-7.6-2-15-5.8-21.6L361.6 5.5C359.6 2.1 356 0 352 0s-7.6 2.1-9.6 5.5L317.8 47.6zM128 176c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 48c-35.3 0-64 28.7-64 64l0 71c8.3 5.2 18.1 9 28.8 9c13.5 0 27.2-6.1 38.4-13.4c5.4-3.5 9.9-7.1 13-9.7c1.5-1.3 2.7-2.4 3.5-3.1c.4-.4 .7-.6 .8-.8l.1-.1s0 0 0 0s0 0 0 0s0 0 0 0s0 0 0 0c3.1-3.2 7.4-4.9 11.9-4.8s8.6 2.1 11.6 5.4c0 0 0 0 0 0s0 0 0 0l.1 .1c.1 .1 .4 .4 .7 .7c.7 .7 1.7 1.7 3.1 3c2.8 2.6 6.8 6.1 11.8 9.5c10.2 7.1 23 13.1 36.3 13.1s26.1-6 36.3-13.1c5-3.5 9-6.9 11.8-9.5c1.4-1.3 2.4-2.3 3.1-3c.3-.3 .6-.6 .7-.7l.1-.1c3-3.5 7.4-5.4 12-5.4s9 2 12 5.4l.1 .1c.1 .1 .4 .4 .7 .7c.7 .7 1.7 1.7 3.1 3c2.8 2.6 6.8 6.1 11.8 9.5c10.2 7.1 23 13.1 36.3 13.1s26.1-6 36.3-13.1c5-3.5 9-6.9 11.8-9.5c1.4-1.3 2.4-2.3 3.1-3c.3-.3 .6-.6 .7-.7l.1-.1c2.9-3.4 7.1-5.3 11.6-5.4s8.7 1.6 11.9 4.8c0 0 0 0 0 0s0 0 0 0s0 0 0 0l.1 .1c.2 .2 .4 .4 .8 .8c.8 .7 1.9 1.8 3.5 3.1c3.1 2.6 7.5 6.2 13 9.7c11.2 7.3 24.9 13.4 38.4 13.4c10.7 0 20.5-3.9 28.8-9l0-71c0-35.3-28.7-64-64-64l0-48c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 48-64 0 0-48c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 48-64 0 0-48zM448 394.6c-8.5 3.3-18.2 5.4-28.8 5.4c-22.5 0-42.4-9.9-55.8-18.6c-4.1-2.7-7.8-5.4-10.9-7.8c-2.8 2.4-6.1 5-9.8 7.5C329.8 390 310.6 400 288 400s-41.8-10-54.6-18.9c-3.5-2.4-6.7-4.9-9.4-7.2c-2.7 2.3-5.9 4.7-9.4 7.2C201.8 390 182.6 400 160 400s-41.8-10-54.6-18.9c-3.7-2.6-7-5.2-9.8-7.5c-3.1 2.4-6.8 5.1-10.9 7.8C71.2 390.1 51.3 400 28.8 400c-10.6 0-20.3-2.2-28.8-5.4L0 480c0 17.7 14.3 32 32 32l384 0c17.7 0 32-14.3 32-32l0-85.4z"},child:[]}]})(l)}function am(l){return be({attr:{viewBox:"0 0 512 512"},child:[{tag:"path",attr:{d:"M61.1 224C45 224 32 211 32 194.9c0-1.9 .2-3.7 .6-5.6C37.9 168.3 78.8 32 256 32s218.1 136.3 223.4 157.3c.5 1.9 .6 3.7 .6 5.6c0 16.1-13 29.1-29.1 29.1L61.1 224zM144 128a16 16 0 1 0 -32 0 16 16 0 1 0 32 0zm240 16a16 16 0 1 0 0-32 16 16 0 1 0 0 32zM272 96a16 16 0 1 0 -32 0 16 16 0 1 0 32 0zM16 304c0-26.5 21.5-48 48-48l384 0c26.5 0 48 21.5 48 48s-21.5 48-48 48L64 352c-26.5 0-48-21.5-48-48zm16 96c0-8.8 7.2-16 16-16l416 0c8.8 0 16 7.2 16 16l0 16c0 35.3-28.7 64-64 64L96 480c-35.3 0-64-28.7-64-64l0-16z"},child:[]}]})(l)}function lm(l){return be({attr:{viewBox:"0 0 512 512"},child:[{tag:"path",attr:{d:"M448 256A192 192 0 1 0 64 256a192 192 0 1 0 384 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zm256 80a80 80 0 1 0 0-160 80 80 0 1 0 0 160zm0-224a144 144 0 1 1 0 288 144 144 0 1 1 0-288zM224 256a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"},child:[]}]})(l)}function sm(l){return be({attr:{viewBox:"0 0 512 512"},child:[{tag:"path",attr:{d:"M256 32C192 32 0 64 0 192c0 35.3 28.7 64 64 64V432c0 26.5 21.5 48 48 48H400c26.5 0 48-21.5 48-48V256c35.3 0 64-28.7 64-64C512 64 320 32 256 32z"},child:[]}]})(l)}function cm(l){return be({attr:{viewBox:"0 0 512 512"},child:[{tag:"path",attr:{d:"M176 56c0-13.3 10.7-24 24-24l16 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-16 0c-13.3 0-24-10.7-24-24zm24 48l16 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-16 0c-13.3 0-24-10.7-24-24s10.7-24 24-24zM56 176l16 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-16 0c-13.3 0-24-10.7-24-24s10.7-24 24-24zM0 283.4C0 268.3 12.3 256 27.4 256l457.1 0c15.1 0 27.4 12.3 27.4 27.4c0 70.5-44.4 130.7-106.7 154.1L403.5 452c-2 16-15.6 28-31.8 28l-231.5 0c-16.1 0-29.8-12-31.8-28l-1.8-14.4C44.4 414.1 0 353.9 0 283.4zM224 200c0-13.3 10.7-24 24-24l16 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-16 0c-13.3 0-24-10.7-24-24zm-96 0c0-13.3 10.7-24 24-24l16 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-16 0c-13.3 0-24-10.7-24-24zm-24-96l16 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-16 0c-13.3 0-24-10.7-24-24s10.7-24 24-24zm216 96c0-13.3 10.7-24 24-24l16 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-16 0c-13.3 0-24-10.7-24-24zm-24-96l16 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-16 0c-13.3 0-24-10.7-24-24s10.7-24 24-24zm120 96c0-13.3 10.7-24 24-24l16 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-16 0c-13.3 0-24-10.7-24-24zm-24-96l16 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-16 0c-13.3 0-24-10.7-24-24s10.7-24 24-24zM296 32l16 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-16 0c-13.3 0-24-10.7-24-24s10.7-24 24-24z"},child:[]}]})(l)}function dm(l){return be({attr:{viewBox:"0 0 512 512"},child:[{tag:"path",attr:{d:"M0 192c0-35.3 28.7-64 64-64c.5 0 1.1 0 1.6 0C73 91.5 105.3 64 144 64c15 0 29 4.1 40.9 11.2C198.2 49.6 225.1 32 256 32s57.8 17.6 71.1 43.2C339 68.1 353 64 368 64c38.7 0 71 27.5 78.4 64c.5 0 1.1 0 1.6 0c35.3 0 64 28.7 64 64c0 11.7-3.1 22.6-8.6 32L8.6 224C3.1 214.6 0 203.7 0 192zm0 91.4C0 268.3 12.3 256 27.4 256l457.1 0c15.1 0 27.4 12.3 27.4 27.4c0 70.5-44.4 130.7-106.7 154.1L403.5 452c-2 16-15.6 28-31.8 28l-231.5 0c-16.1 0-29.8-12-31.8-28l-1.8-14.4C44.4 414.1 0 353.9 0 283.4z"},child:[]}]})(l)}function um(l){return be({attr:{viewBox:"0 0 320 512"},child:[{tag:"path",attr:{d:"M120 0l80 0c13.3 0 24 10.7 24 24l0 40L96 64l0-40c0-13.3 10.7-24 24-24zM32 167.5c0-19.5 10-37.6 26.6-47.9l15.8-9.9C88.7 100.7 105.2 96 122.1 96l75.8 0c16.9 0 33.4 4.7 47.7 13.7l15.8 9.9C278 129.9 288 148 288 167.5c0 17-7.5 32.3-19.4 42.6C280.6 221.7 288 238 288 256c0 19.1-8.4 36.3-21.7 48c13.3 11.7 21.7 28.9 21.7 48s-8.4 36.3-21.7 48c13.3 11.7 21.7 28.9 21.7 48c0 35.3-28.7 64-64 64L96 512c-35.3 0-64-28.7-64-64c0-19.1 8.4-36.3 21.7-48C40.4 388.3 32 371.1 32 352s8.4-36.3 21.7-48C40.4 292.3 32 275.1 32 256c0-18 7.4-34.3 19.4-45.9C39.5 199.7 32 184.5 32 167.5zM96 240c0 8.8 7.2 16 16 16l96 0c8.8 0 16-7.2 16-16s-7.2-16-16-16l-96 0c-8.8 0-16 7.2-16 16zm16 112c-8.8 0-16 7.2-16 16s7.2 16 16 16l96 0c8.8 0 16-7.2 16-16s-7.2-16-16-16l-96 0z"},child:[]}]})(l)}function pm(l){return be({attr:{viewBox:"0 0 448 512"},child:[{tag:"path",attr:{d:"M349.4 44.6c5.9-13.7 1.5-29.7-10.6-38.5s-28.6-8-39.9 1.8l-256 224c-10 8.8-13.6 22.9-8.9 35.3S50.7 288 64 288l111.5 0L98.6 467.4c-5.9 13.7-1.5 29.7 10.6 38.5s28.6 8 39.9-1.8l256-224c10-8.8 13.6-22.9 8.9-35.3s-16.6-20.7-30-20.7l-111.5 0L349.4 44.6z"},child:[]}]})(l)}function fm(l){return be({attr:{viewBox:"0 0 512 512"},child:[{tag:"path",attr:{d:"M32 64c0-17.7 14.3-32 32-32l288 0c17.7 0 32 14.3 32 32l0 32 51.2 0c42.4 0 76.8 34.4 76.8 76.8l0 102.1c0 30.4-17.9 57.9-45.6 70.2L384 381.7l0 34.3c0 35.3-28.7 64-64 64L96 480c-35.3 0-64-28.7-64-64L32 64zM384 311.6l56.4-25.1c4.6-2.1 7.6-6.6 7.6-11.7l0-102.1c0-7.1-5.7-12.8-12.8-12.8L384 160l0 151.6zM160 144c0-8.8-7.2-16-16-16s-16 7.2-16 16l0 224c0 8.8 7.2 16 16 16s16-7.2 16-16l0-224zm64 0c0-8.8-7.2-16-16-16s-16 7.2-16 16l0 224c0 8.8 7.2 16 16 16s16-7.2 16-16l0-224zm64 0c0-8.8-7.2-16-16-16s-16 7.2-16 16l0 224c0 8.8 7.2 16 16 16s16-7.2 16-16l0-224z"},child:[]}]})(l)}function mm(l){return be({attr:{viewBox:"0 0 448 512"},child:[{tag:"path",attr:{d:"M160 112c0-35.3 28.7-64 64-64s64 28.7 64 64l0 48-128 0 0-48zm-48 48l-64 0c-26.5 0-48 21.5-48 48L0 416c0 53 43 96 96 96l256 0c53 0 96-43 96-96l0-208c0-26.5-21.5-48-48-48l-64 0 0-48C336 50.1 285.9 0 224 0S112 50.1 112 112l0 48zm24 48a24 24 0 1 1 0 48 24 24 0 1 1 0-48zm152 24a24 24 0 1 1 48 0 24 24 0 1 1 -48 0z"},child:[]}]})(l)}const q={Pizza:Rf,Burger:am,Hotdog:Yf,Chicken:Gf,IceCream:Hf,Cake:om,Rice:cm,Cocktail:$f,Beer:fm,Coffee:Of,Drink:um,Cheese:tm,Utensils:Pf,Flame:Vf,Star:Mf,Bowl:dm,Rider:Df,Store:_f,Card:Kf,Cash:Af,Pin:Uf,Puzzle:Tf,Clock:Jf,Check:rm,Close:Cf,Chat:Zf,Cart:nm,Target:lm,Camera:im,Phone:Bf,Hourglass:Qf,CheckCircle:em,CrossCircle:Xf,Sparkles:Ef,Bread:sm,Cookie:qf,Pepper:If,Leaf:Wf,Wine:Nf,Call:Ff,Warning:Lf,Bag:mm,Bolt:pm},Tu={pizza:q.Pizza,burger:q.Burger,hotdog:q.Hotdog,chicken:q.Chicken,icecream:q.IceCream,cake:q.Cake,rice:q.Rice,cocktail:q.Cocktail,beer:q.Beer,coffee:q.Coffee,drink:q.Drink,cheese:q.Cheese,utensils:q.Utensils,flame:q.Flame,star:q.Star,bowl:q.Bowl,bread:q.Bread,cookie:q.Cookie,pepper:q.Pepper,salad:q.Leaf,wine:q.Wine},hm={"🍕":"pizza","🍔":"burger","🍟":"burger","🌭":"hotdog","🌮":"bread","🌯":"bread","🥪":"bread","🍗":"chicken","🍖":"chicken","🍦":"icecream","🍩":"cookie","🍰":"cake","🎂":"cake","🍛":"rice","🍚":"rice","🍜":"bowl","🍲":"bowl","🍣":"rice","🥗":"salad","🥤":"drink","🧃":"drink","☕":"coffee","🍹":"cocktail","🍷":"wine","🍺":"beer","🧀":"cheese","🔥":"flame","⭐":"star","🌶":"pepper","🍽":"utensils"};[["pizza","Pizza"],["burger","Burger"],["hotdog","Hot dog"],["chicken","Chicken"],["bread","Wraps & sandwiches"],["rice","Rice"],["bowl","Bowls & soups"],["salad","Salad"],["cheese","Cheese"],["pepper","Spicy"],["drink","Cold drink"],["coffee","Hot drink"],["cocktail","Mocktail"],["icecream","Ice cream"],["cookie","Snacks"],["cake","Dessert"],["flame","Hot deal"],["star","Popular"],["utensils","General"]].map(([l,u])=>({key:l,label:u}));const gm=l=>{const u=String(l||"").trim();if(!u)return"utensils";if(Tu[u])return u;const c=u.replace(/\uFE0F/g,"");return hm[c]||"utensils"},ml=({icon:l,...u})=>{const c=Tu[gm(l)]||q.Utensils;return i.jsx(c,{"aria-hidden":"true",...u})},xm="/assets/jazzcash-raast-qr-BZ1REkAo.png",al="cod",ll="jazzcash",Vs={codEnabled:!0,jazzcashEnabled:!0,merchantName:"GEN Z FOOD",tillId:"984661930",dialCode:"*786*10#",qrImage:""},vm=5*1024*1024,ym=/^[A-Za-z0-9]{6,30}$/,bm=/^[\p{L}\p{N} .+\-']{3,60}$/u;function wm(){const[l,u]=v.useState(""),[c,y]=v.useState(""),[z,C]=v.useState(""),[S,O]=v.useState(""),[j,ae]=v.useState(""),[D,N]=v.useState(!1),[B,ue]=v.useState(""),J=v.useRef(0);v.useEffect(()=>()=>S&&URL.revokeObjectURL(S),[S]);const le=v.useCallback(async pe=>{if(!pe)return;if(ue(""),!["image/jpeg","image/png"].includes(pe.type)){ue("Please choose a JPG or PNG screenshot.");return}if(pe.size>vm){ue("That screenshot is over 5 MB. Please choose a smaller image.");return}const ve=++J.current;O(URL.createObjectURL(pe)),ae(pe.name),C(""),N(!0);try{const ze=await ff(pe);ve===J.current&&C(ze.data.proofId)}catch(ze){ve===J.current&&(O(""),ae(""),ue(ze.message))}finally{ve===J.current&&N(!1)}},[]),P=v.useCallback(()=>{J.current+=1,O(""),ae(""),C(""),N(!1),ue("")},[]),we=v.useCallback(()=>{u(""),y(""),P()},[P]),X=ym.test(l.replace(/\s+/g,"")),ge=bm.test(c.trim().replace(/\s+/g," "));return{tid:l,setTid:u,sender:c,setSender:y,proofId:z,preview:S,fileName:j,uploading:D,uploadError:B,pickFile:le,clearFile:P,reset:we,tidOk:X,senderOk:ge,ready:X&&ge&&!!z&&!D}}const zm=async l=>{try{return await navigator.clipboard.writeText(l),!0}catch{try{const u=document.createElement("textarea");u.value=l,u.setAttribute("readonly",""),u.style.cssText="position:fixed;opacity:0;top:0;left:0",document.body.appendChild(u),u.select();const c=document.execCommand("copy");return document.body.removeChild(u),c}catch{return!1}}},km=({cfg:l,value:u,onChange:c,pickup:y=!1,showCashDescription:z=!0})=>{const C=[l.codEnabled&&{id:al,title:y?"Pay at Pickup":"Cash on Delivery",sub:z?y?"Pay at the counter when you collect":"Pay the rider when it arrives":"",icon:i.jsx(q.Cash,{})},l.jazzcashEnabled&&{id:ll,title:"Pay via JazzCash / Raast QR",sub:"Scan, pay & upload the screenshot",icon:i.jsx(q.Phone,{})}].filter(Boolean);return i.jsxs("fieldset",{className:"pay-methods",children:[i.jsx("legend",{children:"Payment method"}),C.map(S=>i.jsxs("label",{className:`pay-method${u===S.id?" is-on":""}`,children:[i.jsx("input",{type:"radio",name:"payMethod",value:S.id,checked:u===S.id,onChange:()=>c(S.id)}),i.jsx("span",{className:"pay-ico","aria-hidden":"true",children:S.icon}),i.jsxs("span",{className:"pay-text",children:[i.jsx("b",{children:S.title}),i.jsx("small",{children:S.sub})]}),i.jsx("span",{className:"pay-radio","aria-hidden":"true"})]},S.id))]})},jm=({cfg:l,amountLabel:u,jazz:c})=>{const[y,z]=v.useState(!1),[C,S]=v.useState(""),O=v.useRef(null),j=l.qrImage?dr(l.qrImage):xm,ae=async()=>{const N=await zm(l.tillId);z(N),N&&setTimeout(()=>z(!1),2e3)},D=async()=>{S("");try{const N=await fetch(j);if(!N.ok)throw new Error("bad response");const B=await N.blob(),ue=URL.createObjectURL(B),J=document.createElement("a");J.href=ue,J.download=`${l.merchantName.replace(/\s+/g,"-")}-JazzCash-QR.png`,document.body.appendChild(J),J.click(),J.remove(),setTimeout(()=>URL.revokeObjectURL(ue),1e3)}catch{window.open(j,"_blank","noopener,noreferrer"),S("Opened in a new tab — press and hold the image to save it.")}};return i.jsxs("div",{className:"pay-card",children:[i.jsxs("div",{className:"pay-amount","aria-live":"polite",children:[i.jsx("span",{children:"Amount to pay"}),i.jsx("strong",{children:u}),i.jsx("small",{children:"Send exactly this amount so we can match your payment."})]}),i.jsxs("div",{className:"pay-grid",children:[i.jsxs("div",{className:"pay-qr",children:[i.jsx("img",{src:j,alt:`${l.merchantName} JazzCash and Raast payment QR code`,width:"340",height:"480"}),i.jsx("p",{children:"Scan with JazzCash, Easypaisa or any banking app"})]}),i.jsxs("div",{className:"pay-info",children:[i.jsxs("div",{className:"pay-row",children:[i.jsx("span",{children:"Merchant"}),i.jsx("b",{children:l.merchantName})]}),i.jsxs("div",{className:"pay-row",children:[i.jsx("span",{children:"Till ID"}),i.jsxs("div",{className:"pay-till",children:[i.jsx("b",{children:l.tillId}),i.jsx("button",{type:"button",className:"pay-mini",onClick:ae,children:y?"Copied":"Copy"})]})]}),i.jsx("button",{type:"button",className:"pay-btn-ghost",onClick:D,children:"⬇ Download QR"}),C&&i.jsx("p",{className:"pay-hint",children:C}),i.jsxs("p",{className:"pay-dial",children:["Or dial ",i.jsx("b",{children:l.dialCode})," and enter the Till ID."]})]})]}),i.jsxs("div",{className:"pay-proof",children:[i.jsx("h4",{children:"After paying, add your payment details"}),i.jsxs("label",{className:"gzp-field",children:[i.jsx("span",{children:"Transaction ID (TID)"}),i.jsx("input",{value:c.tid,onChange:N=>c.setTid(N.target.value.replace(/[^A-Za-z0-9 ]/g,"").slice(0,34)),placeholder:"From your payment confirmation SMS / app",autoCapitalize:"characters",autoComplete:"off",required:!0,"aria-invalid":c.tid!==""&&!c.tidOk}),c.tid!==""&&!c.tidOk&&i.jsx("em",{className:"pay-err",children:"TID should be 6–30 letters or digits."})]}),i.jsxs("label",{className:"gzp-field",children:[i.jsx("span",{children:"Sender's name or mobile number"}),i.jsx("input",{value:c.sender,onChange:N=>c.setSender(N.target.value.slice(0,60)),placeholder:"Account holder name or 03001234567",autoComplete:"off",required:!0,"aria-invalid":c.sender!==""&&!c.senderOk}),c.sender!==""&&!c.senderOk&&i.jsx("em",{className:"pay-err",children:"Use 3–60 letters or digits, no special symbols."})]}),i.jsxs("div",{className:"gzp-field",children:[i.jsxs("span",{children:["Payment screenshot ",i.jsx("small",{children:"(JPG or PNG, up to 5 MB)"})]}),i.jsx("input",{ref:O,type:"file",accept:"image/png,image/jpeg",className:"pay-file",onChange:N=>{var B;c.pickFile((B=N.target.files)==null?void 0:B[0]),N.target.value=""}}),c.preview?i.jsxs("div",{className:"pay-shot",children:[i.jsx("img",{src:c.preview,alt:"Your payment screenshot"}),i.jsxs("div",{children:[i.jsx("b",{children:c.fileName}),i.jsx("small",{className:c.proofId?"ok":"",children:c.uploading?"Uploading…":c.proofId?"Uploaded":""}),i.jsx("button",{type:"button",className:"pay-mini",onClick:()=>{var N;c.clearFile(),(N=O.current)==null||N.click()},children:"Change"})]})]}):i.jsxs("button",{type:"button",className:"pay-drop",onClick:()=>{var N;return(N=O.current)==null?void 0:N.click()},children:[i.jsx(q.Camera,{"aria-hidden":"true",style:{marginRight:8,verticalAlign:"-2px"}}),"Choose screenshot"]}),c.uploadError&&i.jsx("em",{className:"pay-err",role:"alert",children:c.uploadError})]}),i.jsx("p",{className:"pay-hint",children:"We'll check your payment and confirm your order shortly. Place Order unlocks once all three details are filled."})]})]})},Sm=({order:l,whatsappHref:u})=>{const c=l==null?void 0:l.payment;return!c||c.method!=="JazzCash/Raast"?null:l.orderStatus==="Payment Pending Verification"?i.jsxs("div",{className:"pay-banner is-wait",children:[i.jsxs("b",{children:[i.jsx(q.Hourglass,{"aria-hidden":"true",style:{marginRight:6,verticalAlign:"-2px"}}),"Payment under verification"]}),i.jsx("p",{children:"Thanks! We'll verify your payment and confirm your order shortly. This page updates automatically."}),i.jsxs("small",{children:["TID ",c.tid]})]}):c.status==="Rejected"?i.jsxs("div",{className:"pay-banner is-bad",role:"alert",children:[i.jsxs("b",{children:[i.jsx(q.CrossCircle,{"aria-hidden":"true",style:{marginRight:6,verticalAlign:"-2px"}}),"Payment not verified"]}),i.jsx("p",{children:c.rejectionReason||"We couldn't confirm your payment."}),i.jsx("a",{className:"pay-btn-wa",href:u,target:"_blank",rel:"noopener noreferrer",children:"Message us on WhatsApp"})]}):c.status==="Verified"?i.jsxs("div",{className:"pay-banner is-ok",children:[i.jsxs("b",{children:[i.jsx(q.CheckCircle,{"aria-hidden":"true",style:{marginRight:6,verticalAlign:"-2px"}}),"Payment verified"]}),i.jsxs("p",{children:["Paid via JazzCash/Raast · TID ",c.tid]})]}):null},Cm=()=>i.jsx("svg",{viewBox:"0 0 24 24",fill:"currentColor","aria-hidden":"true",focusable:"false",children:i.jsx("path",{d:"M12 2.5l2.9 6.1 6.6.9-4.8 4.6 1.2 6.6L12 17.5l-5.9 3.2 1.2-6.6L2.5 9.5l6.6-.9L12 2.5z"})}),Nm=({onOrder:l,onTrack:u,summary:c})=>i.jsx("section",{className:"v2-hero",children:i.jsxs("div",{className:"v2-wrap",children:[i.jsxs("div",{className:"v2-intro",children:[i.jsxs("div",{className:"v2-intro-copy",children:[i.jsxs("span",{className:"v2-eyebrow",children:[i.jsx("i",{})," Delivery & pickup in Gojra"]}),i.jsxs("h1",{children:["Hot, cheesy & ",i.jsx("em",{children:"delivered"})," to your door"]}),i.jsx("p",{className:"lead",children:"Fresh pizzas, burgers and sides made to order."})]}),i.jsxs("div",{className:"v2-cta",children:[i.jsx("button",{type:"button",className:"gzp-btn gzp-btn-primary",onClick:l,children:"Order now"}),i.jsx("button",{type:"button",className:"gzp-btn gzp-btn-ghost",onClick:u,children:"Track my order"})]})]}),(c==null?void 0:c.total)>0&&i.jsx("ul",{className:"v2-chips","aria-label":"Highlights",children:i.jsxs("li",{className:"rating",children:[i.jsx(Cm,{})," ",c.average," · ",c.total," review",c.total===1?"":"s"]})})]})}),Em=[{Icon:q.Pizza,title:"Made to order",text:"Every pizza is built fresh when you order, never sitting under a heat lamp.",tag:"Fresh"},{Icon:q.Rider,title:"Home delivery",text:"Riders bring it hot to your door. See your area's fee and time before you pay.",tag:"Door to door"},{Icon:q.Store,title:"Pickup from the restaurant",text:"Skip the delivery fee. Order ahead and collect it from the counter when it is ready.",tag:"No fee"},{Icon:q.Card,title:"Pay your way",text:"Cash on delivery or at pickup, or scan the JazzCash / Raast QR. No sign-up needed.",tag:"Flexible"},{Icon:q.Puzzle,title:"Build your own deal",text:"Mix flavours, sizes and sides into a bundle that fits your crowd and your budget.",tag:"Save more"},{Icon:q.Pin,title:"Live order tracking",text:"Follow your order from the kitchen to your hands, with an estimated time on the way.",tag:"Real time"}],Pm=()=>i.jsxs("section",{className:"s3-section",id:"section-why",children:[i.jsxs("div",{className:"s3-head",children:[i.jsx("span",{className:"v2-kicker",children:"What we deliver"}),i.jsx("h2",{className:"v2-title",children:"Good food, your way"}),i.jsx("p",{className:"s3-lead",children:"Fresh from the oven, to your door or your hands. Here is what you get with every order."})]}),i.jsx("div",{className:"s3-deliver",children:Em.map(({Icon:l,title:u,text:c,tag:y})=>i.jsxs("article",{className:"s3-card",children:[i.jsxs("div",{className:"s3-card-top",children:[i.jsx("span",{className:"s3-ico",children:i.jsx(l,{"aria-hidden":"true"})}),i.jsx("span",{className:"s3-tag",children:y})]}),i.jsx("h3",{children:u}),i.jsx("p",{children:c})]},u))})]}),Lm=[{Icon:q.Utensils,title:"Pick your food",text:"Browse the menu and deals, choose size and crust, and add everything to your order."},{Icon:q.Rider,title:"Delivery or pickup",text:"Choose home delivery or collect it yourself. Fees and times are shown up front."},{Icon:q.Card,title:"Confirm and pay",text:"Add your name and phone. Pay in cash or by JazzCash / Raast. No account needed."},{Icon:q.Clock,title:"Track and enjoy",text:"Watch your order progress live, then enjoy it hot, at your door or at the counter."}],_m=()=>i.jsx("section",{className:"s3-how",id:"section-how",children:i.jsxs("div",{className:"s3-how-inner",children:[i.jsxs("div",{className:"s3-head is-light",children:[i.jsx("span",{className:"v2-kicker",children:"How it works"}),i.jsx("h2",{className:"v2-title",children:"Four easy steps to a full table"}),i.jsx("p",{className:"s3-lead",children:"From first tap to first bite takes just a couple of minutes."})]}),i.jsx("ol",{className:"s3-steps",children:Lm.map(({Icon:l,title:u,text:c},y)=>i.jsxs("li",{className:"s3-step",children:[i.jsxs("div",{className:"s3-step-ico",children:[i.jsx(l,{"aria-hidden":"true"}),i.jsx("b",{children:y+1})]}),i.jsx("h3",{children:u}),i.jsx("p",{children:c})]},u))})]})}),Mm=({whatsappLink:l,onTrack:u})=>i.jsxs("section",{className:"v2-contact",id:"section-contact",children:[i.jsxs("div",{className:"v2-panel warm",children:[i.jsx("span",{className:"v2-kicker",children:"Questions?"}),i.jsx("h2",{className:"v2-title",style:{color:"#fff"},children:"Talk to us on WhatsApp"}),i.jsx("p",{className:"v2-sub",children:"Special requests, party orders or a question about your delivery — message the shop directly."}),i.jsx("a",{className:"gzp-btn",href:l,target:"_blank",rel:"noopener noreferrer",children:"Chat on WhatsApp"})]}),i.jsxs("div",{className:"v2-panel",children:[i.jsx("span",{className:"v2-kicker",children:"Good to know"}),i.jsxs("ul",{className:"v2-facts",children:[i.jsxs("li",{children:[i.jsx("span",{"aria-hidden":"true",children:i.jsx(q.Pin,{})})," Home delivery and restaurant pickup in Gojra"]}),i.jsxs("li",{children:[i.jsx("span",{"aria-hidden":"true",children:i.jsx(q.Cash,{})})," Cash on delivery or JazzCash / Raast QR"]}),i.jsxs("li",{children:[i.jsx("span",{"aria-hidden":"true",children:i.jsx(q.Clock,{})})," Live order tracking from the kitchen to you"]})]}),i.jsx("button",{type:"button",className:"gzp-btn gzp-btn-ghost",onClick:u,children:"Track an order"})]})]}),Tm=({taxRatePercent:l,onNavigate:u,onTrack:c})=>i.jsx("footer",{className:"v2-footer",children:i.jsxs("div",{className:"v2-wrap",children:[i.jsxs("div",{className:"v2-footer-grid",children:[i.jsxs("div",{children:[i.jsxs("div",{className:"brand",children:[i.jsx("img",{src:Gn,alt:""})," GenZ Pizza Land"]}),i.jsxs("p",{children:["Fresh pizzas, burgers and sides, delivered hot across Gojra. Prices are in rupees;"," ",l,"% tax is added at checkout. Pay cash on delivery or by JazzCash / Raast QR."]})]}),i.jsxs("div",{children:[i.jsx("h4",{children:"Explore"}),i.jsxs("ul",{children:[i.jsx("li",{children:i.jsx("button",{type:"button",onClick:()=>u("menu"),children:"Menu"})}),i.jsx("li",{children:i.jsx("button",{type:"button",onClick:()=>u("deals"),children:"Deals"})}),i.jsx("li",{children:i.jsx("button",{type:"button",onClick:()=>u("reviews"),children:"Reviews"})})]})]}),i.jsxs("div",{children:[i.jsx("h4",{children:"Help"}),i.jsxs("ul",{children:[i.jsx("li",{children:i.jsx("button",{type:"button",onClick:c,children:"Track an order"})}),i.jsx("li",{children:i.jsx("button",{type:"button",onClick:()=>u("how"),children:"How it works"})}),i.jsx("li",{children:i.jsx("button",{type:"button",onClick:()=>u("contact"),children:"Contact us"})}),i.jsx("li",{children:i.jsx("a",{href:"/help",children:"Customer help"})}),i.jsx("li",{children:i.jsx("a",{href:"/terms",children:"Terms and Conditions"})}),i.jsx("li",{children:i.jsx("a",{href:"/privacy",children:"Privacy policy"})})]})]})]}),i.jsxs("div",{className:"v2-footer-bottom",children:[i.jsxs("span",{children:["© ",new Date().getFullYear()," GenZ Pizza Land. All rights reserved."]}),i.jsxs("span",{className:"credit",children:["Developed by ",i.jsx("img",{src:xf,alt:""})," ",i.jsx("strong",{children:"Sindbad Solution"})]})]})]})}),Rm=`
.s3-section { padding: clamp(40px, 6vw, 84px) var(--gutter); }
.s3-head { max-width: 640px; margin: 0 auto 32px; text-align: center; }
.s3-head .v2-title { margin: 6px 0 10px; }
.s3-lead { margin: 0; color: var(--flour-dim); font-size: 1.02rem; line-height: 1.55; }
.s3-head.is-light .v2-title, .s3-head.is-light .s3-lead { color: #fff; }
.s3-head.is-light .s3-lead { opacity: .78; }

.s3-deliver { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; max-width: 1200px; margin: 0 auto; }
@media (max-width: 960px) { .s3-deliver { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 580px) { .s3-deliver { grid-template-columns: 1fr; } }
.s3-card { background: #fff; border: 1px solid var(--line); border-radius: 22px; padding: 22px; display: flex; flex-direction: column; gap: 10px; transition: transform .2s, box-shadow .2s, border-color .2s; }
.s3-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-hover); border-color: rgba(230,57,47,.3); }
.s3-card-top { display: flex; justify-content: space-between; align-items: center; }
.s3-ico { width: 52px; height: 52px; border-radius: 16px; display: grid; place-items: center; font-size: 1.3rem; color: #fff; background: linear-gradient(135deg, #E6392F, #ff7a45); box-shadow: 0 10px 20px -8px rgba(230,57,47,.55); }
.s3-tag { font-size: .72rem; font-weight: 800; letter-spacing: .04em; text-transform: uppercase; color: var(--ember-deep); background: #fff0ec; padding: 5px 10px; border-radius: 999px; }
.s3-card h3 { margin: 6px 0 0; font-size: 1.12rem; }
.s3-card p { margin: 0; color: var(--flour-dim); font-size: .94rem; line-height: 1.55; }

.s3-how { background: linear-gradient(160deg, #2a1d17, #1c1410); padding: clamp(44px, 6vw, 88px) var(--gutter); }
.s3-how-inner { max-width: 1200px; margin: 0 auto; }
.s3-steps { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(4, 1fr); gap: 22px; position: relative; counter-reset: s; }
@media (min-width: 961px) { .s3-steps::before { content: ""; position: absolute; top: 36px; left: 12%; right: 12%; border-top: 2px dashed rgba(255,255,255,.22); } }
@media (max-width: 960px) { .s3-steps { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 560px) { .s3-steps { grid-template-columns: 1fr; } }
.s3-step { position: relative; text-align: center; padding: 0 6px; }
.s3-step-ico { position: relative; width: 72px; height: 72px; margin: 0 auto 16px; border-radius: 50%; display: grid; place-items: center; font-size: 1.5rem; color: #fff; background: linear-gradient(135deg, #E6392F, #ff7a45); box-shadow: 0 0 0 6px #2a1d17, 0 14px 26px -8px rgba(230,57,47,.6); }
.s3-step-ico b { position: absolute; top: -4px; right: -4px; width: 26px; height: 26px; border-radius: 50%; background: #FFC83D; color: #2a1d17; font-size: .8rem; display: grid; place-items: center; box-shadow: 0 0 0 3px #2a1d17; }
.s3-step h3 { margin: 0 0 6px; color: #fff; font-size: 1.08rem; }
.s3-step p { margin: 0; color: rgba(255,255,255,.72); font-size: .92rem; line-height: 1.55; }

.s3-rv-layout { display: grid; grid-template-columns: 320px 1fr; gap: 22px; max-width: 1200px; margin: 0 auto; align-items: start; }
@media (max-width: 900px) { .s3-rv-layout { grid-template-columns: 1fr; } }
.s3-rv-summary { background: #fff; border: 1px solid var(--line); border-radius: 22px; padding: 24px; display: flex; flex-direction: column; gap: 18px; position: sticky; top: calc(var(--header-h) + var(--nav-h) + 12px); }
@media (max-width: 900px) { .s3-rv-summary { position: static; } }
.s3-rv-score { display: flex; align-items: center; gap: 14px; }
.s3-rv-score > b { font-size: 3.4rem; line-height: 1; font-weight: 900; color: var(--flour); }
.s3-rv-score small { display: block; margin-top: 4px; color: var(--flour-dim); }
.s3-bars { display: flex; flex-direction: column; gap: 8px; }
.s3-bar { display: grid; grid-template-columns: 34px 1fr 26px; align-items: center; gap: 10px; font-size: .82rem; color: var(--flour-dim); }
.s3-barn { display: inline-flex; align-items: center; gap: 3px; font-weight: 700; }
.s3-barn svg { width: 11px; height: 11px; color: #f5a524; }
.s3-bar i { height: 8px; background: #f3e8dc; border-radius: 999px; overflow: hidden; display: block; }
.s3-bar i span { display: block; height: 100%; background: linear-gradient(90deg, #f5a524, #E6392F); border-radius: 999px; }
.s3-bar em { font-style: normal; text-align: right; }
.s3-write { display: inline-flex; align-items: center; justify-content: center; gap: 8px; border: 0; border-radius: 14px; padding: 13px 16px; font: inherit; font-weight: 800; color: #fff; background: var(--ember); cursor: pointer; box-shadow: 0 12px 22px -10px rgba(230,57,47,.6); }
.s3-write:hover { background: var(--ember-deep); }
.s3-write svg { width: 16px; height: 16px; }
.s3-rv-list { columns: 2 280px; column-gap: 16px; }
.s3-rv-list > .v2-rv-empty { column-span: all; }
.s3-rv { position: relative; break-inside: avoid; margin: 0 0 16px; background: #fff; border: 1px solid var(--line); border-radius: 20px; padding: 20px; display: flex; flex-direction: column; gap: 10px; }
.s3-rv .s3-quote { position: absolute; top: 16px; right: 18px; font-size: 1.4rem; color: #ffd9d3; }
.s3-rv h4 { margin: 0; font-size: 1rem; }
.s3-rv p { margin: 0; color: var(--flour-dim); line-height: 1.6; font-size: .94rem; }
.s3-rv-foot { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; margin-top: 4px; padding-top: 12px; border-top: 1px solid var(--line); }
.s3-rv-foot strong { display: block; font-size: .9rem; }
.s3-rv-foot > div:nth-child(2) span { font-size: .76rem; color: var(--flour-faint); }
.s3-rv-foot .v2-rv-dish { margin-left: auto; display: inline-flex; align-items: center; gap: 6px; font-size: .76rem; background: #fff0ec; color: var(--ember-deep); padding: 4px 10px; border-radius: 999px; }
.s3-empty-ico { display: grid; place-items: center; font-size: 2rem; color: #f5a524; margin-bottom: 6px; }
.v2-thanks .big svg { width: 54px; height: 54px; color: var(--basil); }
.v2-chips li svg { width: 14px; height: 14px; vertical-align: -2px; margin-right: 4px; }
.v2-facts li > span svg { color: var(--ember); }
`,Ru="gzp-fulfillment",nl=l=>`Rs. ${Math.round(Number(l)||0).toLocaleString("en-PK")}`,Su=(l="00:00")=>{const[u,c]=l.split(":").map(Number);return`${u%12===0?12:u%12}:${String(c).padStart(2,"0")} ${u>=12?"PM":"AM"}`},Fm=l=>{const u=new Date().getDay(),c=((l==null?void 0:l.hours)||[]).find(y=>y.day===u);return c!=null&&c.open?`${Su(c.from)} – ${Su(c.to)}`:"Closed today"},Im=l=>l&&l.etaMin!=null?`${l.etaMin}–${l.etaMax} min`:"",Om=()=>{try{return JSON.parse(localStorage.getItem(Ru)||"{}")}catch{return{}}};function Dm(l){var Ne,me;const u=v.useMemo(Om,[]),[c,y]=v.useState([]),[z,C]=v.useState(!0),[S,O]=v.useState(""),[j,ae]=v.useState(u.method||"delivery"),[D,N]=v.useState(u.branchId||""),[B,ue]=v.useState(u.zoneId||""),[J,le]=v.useState(u.address||""),[P,we]=v.useState(null),[X,ge]=v.useState(!1),[ye,pe]=v.useState(""),ve=v.useCallback(async()=>{C(!0),O("");try{const ne=await mf();y(ne.data||[])}catch(ne){O(ne.message||"Couldn't load branches.")}finally{C(!1)}},[]);v.useEffect(()=>{ve()},[ve]),v.useEffect(()=>{if(!c.length)return;const ne=c.find(H=>H._id===D)||c[0];ne._id!==D&&N(ne._id);const T=ne.delivery.zones;B&&!T.some(H=>H._id===B)&&ue(""),!B&&T.length===1&&ue(T[0]._id)},[c,D,B]),v.useEffect(()=>{try{localStorage.setItem(Ru,JSON.stringify({method:j,branchId:D,zoneId:B,address:J}))}catch{}},[j,D,B,J]);const ze=c.find(ne=>ne._id===D)||null;v.useEffect(()=>{if(!D)return;let ne=!1;ge(!0);const T=setTimeout(async()=>{try{const H=await hf({branchId:D,method:j,zoneId:B,subtotal:l});ne||(we(H.data),pe(""))}catch(H){ne||(we(null),pe(H.message||"Couldn't check delivery details."))}finally{ne||ge(!1)}},250);return()=>{ne=!0,clearTimeout(T)}},[D,j,B,l]);const Ce=j!=="delivery"||J.trim().length>=10,ie=!!P&&P.ok&&!X&&Ce,V=P!=null&&P.ok?P.fee:0,Je=!!(P!=null&&P.branchName&&((Ne=P.error)!=null&&Ne.startsWith(`${P.branchName} is closed right now.`))),$=P&&!P.ok?Je&&((me=ze==null?void 0:ze.customerDisplay)==null?void 0:me.showClosedNotice)===!1?"":P.error:"",L=ye||$||(j==="delivery"&&(P!=null&&P.ok)&&!Ce?"Enter your full delivery address (house, street, landmark).":"");return{branches:c,branch:ze,loading:z,loadError:S,reload:ve,method:j,setMethod:ne=>ae(ne),branchId:D,setBranchId:N,zoneId:B,setZoneId:ue,address:J,setAddress:le,quote:P,quoting:X,fee:V,ready:ie,blocker:L,addressOk:Ce,payload:()=>({method:j,branchId:D,zoneId:j==="delivery"?B:void 0})}}const Cu=({active:l,onClick:u,icon:c,title:y,meta:z,disabled:C,note:S})=>i.jsxs("button",{type:"button",className:`fx-opt${l?" is-on":""}`,onClick:u,disabled:C,"aria-pressed":l,children:[i.jsx("span",{className:"fx-opt-ico",children:i.jsx(c,{"aria-hidden":"true"})}),i.jsxs("span",{className:"fx-opt-body",children:[i.jsx("b",{children:y}),S?i.jsx("em",{className:"fx-opt-note",children:S}):z?i.jsx("em",{children:z}):null]}),i.jsx("span",{className:"fx-opt-tick","aria-hidden":"true",children:l&&i.jsx(q.Check,{})})]}),Am=({f:l})=>{const{branch:u,branches:c,method:y,quote:z}=l;if(l.loading)return i.jsx("div",{className:"fx-skeleton","aria-busy":"true",children:"Loading delivery options…"});if(l.loadError)return i.jsxs("div",{className:"fx-alert is-bad",role:"alert",children:[i.jsx(q.Warning,{"aria-hidden":"true"}),i.jsxs("span",{children:[l.loadError," ",i.jsx("button",{type:"button",className:"fx-link",onClick:l.reload,children:"Try again"})]})]});if(!u)return i.jsx("div",{className:"fx-alert is-bad",children:"No branch is accepting orders right now."});const C=u.delivery.zones,S=u.delivery,O=u.pickup,j=u.customerDisplay||{},ae=!S.enabled||!!S.blockedReason,D=!O.enabled||!!O.blockedReason,N=C.find(P=>P._id===l.zoneId),B=P=>S.freeWithinKm>0&&P.distanceKm!=null&&P.distanceKm<=S.freeWithinKm?0:P.fee,ue=P=>B(P)>0?nl(B(P)):"Free",J=N?[j.showDeliveryFees!==!1?ue(N):"",j.showEstimatedTimes!==!1?`${N.travelMinutes+S.prepMinutes}+ min`:""].filter(Boolean).join(" · "):C.length&&j.showDeliveryFees!==!1?`From ${ue({fee:Math.min(...C.map(B))})}`:"",le=[j.showDeliveryFees!==!1?"Free":"",j.showEstimatedTimes!==!1?`ready in ~${O.prepMinutes} min`:""].filter(Boolean).join(" · ");return i.jsxs("section",{className:"fx","aria-label":"Delivery or pickup",children:[i.jsx("h3",{className:"fx-h",children:"How do you want your order?"}),i.jsxs("div",{className:"fx-opts",role:"group","aria-label":"Fulfillment method",children:[i.jsx(Cu,{active:y==="delivery",onClick:()=>l.setMethod("delivery"),icon:q.Rider,title:"Home Delivery",meta:J,note:ae?S.blockedReason||"Unavailable at this branch":""}),i.jsx(Cu,{active:y==="pickup",onClick:()=>l.setMethod("pickup"),icon:q.Store,title:"Pickup from Restaurant",meta:le,note:D?O.blockedReason||"Unavailable at this branch":""})]}),c.length>1&&i.jsxs("div",{className:"fx-block",children:[i.jsx("span",{className:"fx-label",children:y==="pickup"?"Pickup branch":"Delivering from"}),i.jsx("div",{className:"fx-branches",role:"radiogroup","aria-label":"Branch",children:c.map(P=>{var X;const we=y==="pickup"?!P.pickup.enabled:!P.delivery.enabled;return i.jsxs("button",{type:"button",role:"radio","aria-checked":P._id===u._id,disabled:we,className:`fx-branch${P._id===u._id?" is-on":""}`,onClick:()=>{l.setBranchId(P._id),l.setZoneId("")},children:[i.jsx("b",{children:P.name}),i.jsx("small",{children:P.address}),(P.openNow||((X=P.customerDisplay)==null?void 0:X.showClosedNotice)===!0)&&i.jsx("span",{className:`fx-pill ${P.openNow?"is-open":"is-closed"}`,children:we?"Not available":P.openNow?"Open now":`Opens ${P.nextOpen||"soon"}`})]},P._id)})})]}),y==="delivery"?i.jsxs("div",{className:"fx-block",children:[i.jsx("span",{className:"fx-label",children:"Delivery area"}),C.length===0?i.jsxs("div",{className:"fx-alert is-bad",children:[i.jsx(q.Warning,{"aria-hidden":"true"}),i.jsx("span",{children:"No delivery areas are set up for this branch yet. Please choose Pickup."})]}):i.jsx("div",{className:"fx-zones",role:"radiogroup","aria-label":"Delivery area",children:C.map(P=>i.jsxs("button",{type:"button",role:"radio","aria-checked":P._id===l.zoneId,className:`fx-zone${P._id===l.zoneId?" is-on":""}`,onClick:()=>l.setZoneId(P._id),children:[i.jsxs("span",{className:"fx-zone-main",children:[i.jsx("b",{children:P.name}),P.areas&&j.showDeliveryAreaText!==!1&&i.jsx("small",{children:P.areas})]}),(j.showDeliveryFees!==!1||j.showEstimatedTimes!==!1)&&i.jsxs("span",{className:"fx-zone-fee",children:[j.showDeliveryFees!==!1&&ue(P),j.showEstimatedTimes!==!1&&i.jsxs("small",{children:[P.travelMinutes+S.prepMinutes,"–",P.travelMinutes+S.prepMinutes+10," min"]})]})]},P._id))}),i.jsxs("label",{className:"gzp-field fx-address",children:[i.jsx("span",{children:"Full delivery address"}),i.jsx("textarea",{rows:3,value:l.address,onChange:P=>l.setAddress(P.target.value),placeholder:"House or flat number, street, nearest landmark","aria-invalid":l.address.trim().length>0&&l.address.trim().length<10})]}),j.showFreeDeliveryNote!==!1&&(S.freeAbove>0||S.freeWithinKm>0)&&i.jsxs("p",{className:"fx-hint",children:[i.jsx(q.Bolt,{"aria-hidden":"true"})," Free delivery",S.freeAbove>0?` on orders of ${nl(S.freeAbove)} or more`:"",S.freeAbove>0&&S.freeWithinKm>0?" or":"",S.freeWithinKm>0?` within ${S.freeWithinKm} km`:"","."]})]}):i.jsxs("div",{className:"fx-block",children:[i.jsx("span",{className:"fx-label",children:"Pickup details"}),i.jsxs("div",{className:"fx-pickup",children:[i.jsxs("div",{className:"fx-pickup-row",children:[i.jsx(q.Pin,{"aria-hidden":"true"}),i.jsxs("span",{children:[i.jsx("b",{children:u.name}),i.jsx("br",{}),u.address||"Address available at the restaurant"]})]}),i.jsxs("div",{className:"fx-pickup-row",children:[i.jsx(q.Clock,{"aria-hidden":"true"}),i.jsxs("span",{children:["Today: ",Fm(u)]})]}),u.phone&&i.jsxs("div",{className:"fx-pickup-row",children:[i.jsx(q.Call,{"aria-hidden":"true"}),i.jsx("span",{children:u.phone})]}),O.instructions&&i.jsxs("div",{className:"fx-pickup-row",children:[i.jsx(q.Bag,{"aria-hidden":"true"}),i.jsx("span",{children:O.instructions})]})]})]}),(j.showEstimatedTimes!==!1||j.showDeliveryFees!==!1||(z==null?void 0:z.minOrder)>0)&&i.jsxs("div",{className:"fx-summary","aria-live":"polite",children:[j.showEstimatedTimes!==!1&&i.jsxs("div",{children:[i.jsxs("small",{children:["Estimated ",y==="delivery"?"delivery":"ready in"]}),i.jsx("b",{children:z?Im(z)||"—":l.quoting?"…":"—"})]}),j.showDeliveryFees!==!1&&i.jsxs("div",{children:[i.jsx("small",{children:y==="delivery"?"Delivery fee":"Pickup fee"}),i.jsx("b",{children:z!=null&&z.ok?z.fee>0?nl(z.fee):"Free":"—"})]}),(z==null?void 0:z.minOrder)>0&&i.jsxs("div",{children:[i.jsx("small",{children:"Minimum order"}),i.jsx("b",{children:nl(z.minOrder)})]})]}),l.blocker&&i.jsxs("div",{className:"fx-alert is-bad",role:"alert",children:[i.jsx(q.Warning,{"aria-hidden":"true"}),i.jsx("span",{children:l.blocker})]})]})},Bm=`
.fx { display: flex; flex-direction: column; gap: 14px; }
.fx-h { margin: 0; font-size: 1.02rem; font-weight: 800; color: var(--flour); }
.fx-opts { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
@media (max-width: 520px) { .fx-opts { grid-template-columns: 1fr; } }
.fx-opt { position: relative; display: flex; gap: 12px; align-items: flex-start; text-align: left; padding: 14px; border: 1.5px solid var(--line); border-radius: var(--r-lg); background: #fff; color: var(--flour); cursor: pointer; font: inherit; transition: border-color .15s, box-shadow .15s, transform .15s; }
.fx-opt:hover:not(:disabled) { border-color: rgba(230,57,47,.45); transform: translateY(-1px); }
.fx-opt:disabled { opacity: .55; cursor: not-allowed; }
.fx-opt.is-on { border-color: var(--ember); box-shadow: 0 0 0 3px rgba(230,57,47,.12); background: #fff7f5; }
.fx-opt-ico { flex: none; width: 42px; height: 42px; border-radius: 12px; display: grid; place-items: center; background: #fff0ec; color: var(--ember); font-size: 1.1rem; }
.fx-opt.is-on .fx-opt-ico { background: var(--ember); color: #fff; }
.fx-opt-body { display: flex; flex-direction: column; gap: 2px; min-width: 0; padding-right: 22px; }
.fx-opt-body b { font-size: .95rem; }
.fx-opt-body small { color: var(--flour-dim); font-size: .8rem; line-height: 1.3; }
.fx-opt-body em { font-style: normal; font-weight: 700; font-size: .8rem; color: var(--ember-deep); margin-top: 4px; }
.fx-opt-body em.fx-opt-note { color: #b42318; }
.fx-opt-tick { position: absolute; top: 12px; right: 12px; width: 20px; height: 20px; border-radius: 50%; border: 1.5px solid var(--line); display: grid; place-items: center; font-size: .65rem; color: #fff; }
.fx-opt.is-on .fx-opt-tick { background: var(--ember); border-color: var(--ember); }
.fx-block { display: flex; flex-direction: column; gap: 8px; }
.fx-label { font-size: .85rem; font-weight: 700; color: var(--flour-dim); }
.fx-branches, .fx-zones { display: flex; flex-direction: column; gap: 8px; }
.fx-branch, .fx-zone { display: flex; justify-content: space-between; align-items: center; gap: 12px; padding: 12px 14px; border: 1.5px solid var(--line); border-radius: var(--r-md); background: #fff; font: inherit; color: var(--flour); text-align: left; cursor: pointer; }
.fx-branch { flex-wrap: wrap; }
.fx-branch b, .fx-zone b { font-size: .92rem; }
.fx-branch small, .fx-zone small { display: block; color: var(--flour-dim); font-size: .78rem; }
.fx-branch.is-on, .fx-zone.is-on { border-color: var(--ember); background: #fff7f5; box-shadow: 0 0 0 3px rgba(230,57,47,.1); }
.fx-branch:disabled { opacity: .5; cursor: not-allowed; }
.fx-zone-fee { text-align: right; font-weight: 800; white-space: nowrap; }
.fx-zone-fee small { font-weight: 500; }
.fx-pill { font-size: .72rem; font-weight: 700; padding: 3px 9px; border-radius: 999px; }
.fx-pill.is-open { background: #e3f6ea; color: #15753f; }
.fx-pill.is-closed { background: #fdeaea; color: #b42318; }
.fx-pickup { display: flex; flex-direction: column; gap: 10px; padding: 14px; border: 1.5px dashed var(--line); border-radius: var(--r-md); background: #fff; }
.fx-pickup-row { display: flex; gap: 10px; align-items: flex-start; font-size: .88rem; color: var(--flour-dim); line-height: 1.4; }
.fx-pickup-row svg { flex: none; margin-top: 3px; color: var(--ember); }
.fx-pickup-row b { color: var(--flour); }
.fx-hint { margin: 0; display: flex; gap: 8px; align-items: center; font-size: .82rem; color: #15753f; font-weight: 600; }
.fx-summary { display: grid; grid-auto-flow: column; grid-auto-columns: 1fr; gap: 1px; background: var(--line); border: 1px solid var(--line); border-radius: var(--r-md); overflow: hidden; }
.fx-summary > div { background: #fff; padding: 10px 12px; display: flex; flex-direction: column; gap: 2px; }
.fx-summary small { font-size: .72rem; color: var(--flour-faint); }
.fx-summary b { font-size: .95rem; }
.fx-alert { display: flex; gap: 10px; align-items: flex-start; padding: 11px 13px; border-radius: var(--r-md); font-size: .86rem; line-height: 1.4; }
.fx-alert.is-bad { background: #fdeaea; color: #8f1d14; border: 1px solid #f6c7c3; }
.fx-alert svg { flex: none; margin-top: 2px; }
.fx-link { background: none; border: 0; padding: 0; font: inherit; font-weight: 700; color: inherit; text-decoration: underline; cursor: pointer; }
.fx-skeleton { padding: 18px; border-radius: var(--r-md); background: #fff; border: 1px dashed var(--line); color: var(--flour-dim); font-size: .9rem; text-align: center; }
`,Di={enabled:!0,minItems:3,discount3:15,discount4:17,discount5Plus:20,description:"Pick any 3 or more items from our menu — pizzas, burgers, wings, drinks, anything. The more you add, the more you save. No codes, the discount applies automatically."},Gs=l=>{const u=(y,z)=>typeof y=="number"&&!Number.isNaN(y)?y:z,c=l&&typeof l=="object"?l:{};return{enabled:typeof c.enabled=="boolean"?c.enabled:Di.enabled,minItems:Math.max(1,Math.round(u(c.minItems,Di.minItems))),discount3:u(c.discount3,Di.discount3),discount4:u(c.discount4,Di.discount4),discount5Plus:u(c.discount5Plus,Di.discount5Plus),description:typeof c.description=="string"?c.description:Di.description}},hl=(l,u)=>!u.enabled||l<u.minItems?0:l>=5?u.discount5Plus:l===4?u.discount4:u.discount3,Bt=l=>`${Number.isInteger(l)?l:Number(l.toFixed(1))}%`,sl=l=>{const u=Number(l)||0;return`Rs ${u.toLocaleString("en-PK",{minimumFractionDigits:Number.isInteger(u)?0:2,maximumFractionDigits:2})}`},Fu=(l,u)=>{const c=u.minItems-l;if(l===0)return`Pick ${u.minItems} items to unlock ${Bt(u.discount3)} off`;if(c>0)return`Add ${c} more item${c===1?"":"s"} to unlock ${Bt(u.discount3)} off`;const y=hl(l,u),z=l>=5?null:l+1,C=z?hl(z,u):null;return C&&C>y?`${Bt(y)} off unlocked — add 1 more item for ${Bt(C)} off`:l>=5?`Best discount unlocked — ${Bt(y)} off your picks`:`${Bt(y)} off unlocked`},$m=`
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
`,Um=({cfg:l,pickedCount:u,onStart:c})=>i.jsx("section",{className:"gzp-byo-section","aria-label":"Build your own deal",children:i.jsx("div",{className:"gzp-shell",children:i.jsxs("div",{className:"gzp-byo-banner",children:[i.jsxs("div",{style:{position:"relative",zIndex:1},children:[i.jsxs("span",{className:"gzp-byo-eyebrow",children:[i.jsx(q.Target,{"aria-hidden":"true"})," Make it yours"]}),i.jsxs("h2",{children:["Build your ",i.jsx("em",{children:"own deal"})]}),l.description&&i.jsx("p",{children:l.description}),i.jsx("button",{type:"button",className:"gzp-btn gzp-btn-primary",onClick:c,children:u>0?`Edit your deal (${u} item${u===1?"":"s"})`:"Start building"})]}),i.jsxs("div",{className:"gzp-byo-tiers",children:[i.jsxs("div",{className:"gzp-byo-tier",children:[i.jsx("b",{children:Bt(l.discount3)}),i.jsx("small",{children:"off"}),i.jsxs("span",{children:[l.minItems," items"]})]}),i.jsxs("div",{className:"gzp-byo-tier",children:[i.jsx("b",{children:Bt(l.discount4)}),i.jsx("small",{children:"off"}),i.jsx("span",{children:"4 items"})]}),i.jsxs("div",{className:"gzp-byo-tier is-best",children:[i.jsx("b",{children:Bt(l.discount5Plus)}),i.jsx("small",{children:"off"}),i.jsx("span",{children:"5+ items"})]})]})]})})}),Wm=l=>{const u=[];return((l==null?void 0:l.variants)||[]).forEach(c=>{c.size&&!u.includes(c.size)&&u.push(c.size)}),u},Hm=(l,u)=>{const c=[];return((l==null?void 0:l.variants)||[]).forEach(y=>{y.size===u&&y.crust&&!c.includes(y.crust)&&c.push(y.crust)}),c},Iu=(l,u,c)=>((l==null?void 0:l.variants)||[]).find(y=>y.size===u&&(y.crust||"")===(c||""))||null,Ou=(l,u="",c="")=>`${l}:${u||""}||${c||""}`,Qm=({dish:l,picks:u,dishQty:c,stockLeft:y,onAdd:z,onRemove:C})=>{const S=v.useMemo(()=>Wm(l),[l]),O=S.length>0,[j,ae]=v.useState(S[0]||""),D=v.useMemo(()=>Hm(l,j),[l,j]),[N,B]=v.useState(D[0]||""),[ue,J]=v.useState(!1);v.useEffect(()=>{D.length>0&&!D.includes(N)?B(D[0]):D.length===0&&N!==""&&B("")},[j]);const le=O?Iu(l,j,N):null,P=O?(l.variants||[]).reduce((ie,V)=>ie===null||V.price<ie.price?V:ie,null):null,we=O?(le==null?void 0:le.price)??(P==null?void 0:P.price)??l.price:l.price,X=Ou(l._id,j,N),ge=u[X]||0,ye=c,pe=typeof l.availableQty=="number"&&y<=0&&ye===0,ve=typeof l.availableQty=="number"&&y<=0,ze=(!O||!!le)&&!ve,Ce=dr(l.image);return i.jsxs("div",{className:`gzp-byo-tile${ye>0?" is-picked":""}`,children:[i.jsxs("div",{className:"gzp-byo-tile-media",children:[Ce&&!ue?i.jsx("img",{src:Ce,alt:l.name,loading:"lazy",onError:()=>J(!0)}):i.jsx("span",{"aria-hidden":"true",children:i.jsx(ml,{icon:l.icon})}),ye>0&&i.jsxs("span",{className:"gzp-byo-badge",children:["×",ye]})]}),i.jsxs("div",{className:"gzp-byo-tile-body",children:[i.jsx("h4",{children:l.name}),i.jsxs("div",{className:"gzp-byo-price",children:[O&&i.jsx("small",{children:"From"}),sl(we)]}),O&&i.jsxs("div",{className:"gzp-byo-selects",children:[i.jsx("select",{className:"gzp-select",value:j,onChange:ie=>ae(ie.target.value),"aria-label":`Size for ${l.name}`,children:S.map(ie=>i.jsx("option",{value:ie,children:ie},ie))}),D.length>0&&i.jsx("select",{className:"gzp-select",value:N,onChange:ie=>B(ie.target.value),"aria-label":`Crust for ${l.name}`,children:D.map(ie=>i.jsx("option",{value:ie,children:ie},ie))})]}),i.jsx("div",{className:"gzp-byo-tile-foot",children:ge>0?i.jsxs("div",{className:"gzp-stepper",style:{width:"100%",justifyContent:"space-between"},children:[i.jsx("button",{type:"button",onClick:()=>C(X),"aria-label":`Remove one ${l.name}`,children:"−"}),i.jsx("span",{"aria-live":"polite",children:ge}),i.jsx("button",{type:"button",disabled:!ze,onClick:()=>z(l,j,N),"aria-label":`Add one more ${l.name}`,children:"+"})]}):i.jsx("button",{type:"button",className:"gzp-byo-add",disabled:!ze,onClick:()=>z(l,j,N),children:pe?"Sold out":"+ Add"})})]})]})},Ym=({cfg:l,dishes:u,categories:c,initialPicks:y,getOtherQty:z,onClose:C,onConfirm:S})=>{const[O,j]=v.useState(()=>({...y||{}})),[ae,D]=v.useState("all");v.useEffect(()=>{const $=document.body.style.overflow;document.body.style.overflow="hidden";const L=W=>W.key==="Escape"&&C();return window.addEventListener("keydown",L),()=>{document.body.style.overflow=$,window.removeEventListener("keydown",L)}},[C]);const N=v.useMemo(()=>{const $={};return u.forEach(L=>{$[L._id]=L}),$},[u]),B=v.useMemo(()=>{const $=new Map;u.forEach(me=>{var T;const ne=((T=me.category)==null?void 0:T._id)||me.category||"other";$.has(ne)||$.set(ne,[]),$.get(ne).push(me)});const L=c.filter(me=>($.get(me._id)||[]).length>0).map(me=>({id:me._id,name:me.name,items:$.get(me._id)})),W=new Set(c.map(me=>me._id)),Ne=u.filter(me=>{var ne;return!W.has(((ne=me.category)==null?void 0:ne._id)||me.category)});return Ne.length&&L.push({id:"other",name:"More to eat",items:Ne}),L},[u,c]),ue=$=>Object.entries(O).reduce((L,[W,Ne])=>W.startsWith(`${$}:`)?L+Ne:L,0),J=$=>typeof $.availableQty=="number"?$.availableQty-ue($._id)-(z?z($._id):0):1/0,le=($,L,W)=>{if(J($)<=0)return;const Ne=Ou($._id,L,W);j(me=>({...me,[Ne]:(me[Ne]||0)+1}))},P=$=>j(L=>{const W={...L,[$]:Math.max(0,(L[$]||0)-1)};return W[$]===0&&delete W[$],W}),{count:we,gross:X}=v.useMemo(()=>{let $=0,L=0;return Object.entries(O).forEach(([W,Ne])=>{const[me,ne="||"]=W.split(/:(.+)/),T=N[me];if(!T)return;const[H,U]=ne.split("||"),h=H?Iu(T,H,U):null;$+=Ne,L+=(h?h.price:T.price)*Ne}),{count:$,gross:L}},[O,N]),ge=hl(we,l),ye=Math.round(X*ge/100),pe=X-ye,ve=we>=l.minItems,ze=[{n:l.minItems,label:Bt(l.discount3)},{n:4,label:Bt(l.discount4)},{n:5,label:Bt(l.discount5Plus)}].filter(($,L,W)=>L===0||$.n>W[L-1].n),Ce=ze[ze.length-1].n,ie=$=>`${$/Ce*100}%`,V=`${Math.min(we,Ce)/Ce*100}%`,Je=ae==="all"?B:B.filter($=>$.id===ae);return i.jsx("div",{className:"gzp-byo-overlay",onClick:C,children:i.jsxs("div",{className:"gzp-byo-panel",onClick:$=>$.stopPropagation(),role:"dialog","aria-modal":"true","aria-label":"Build your own deal",children:[i.jsxs("div",{className:"gzp-byo-head",children:[i.jsxs("div",{children:[i.jsxs("h2",{children:[i.jsx(q.Target,{"aria-hidden":"true",style:{marginRight:8,verticalAlign:"-3px"}}),"Build your own deal"]}),i.jsxs("p",{children:["Choose at least ",l.minItems," items — your discount grows with every item."]})]}),i.jsx("button",{className:"gzp-icon-btn",type:"button",onClick:C,"aria-label":"Close",children:i.jsx(q.Close,{"aria-hidden":"true"})})]}),i.jsxs("div",{className:"gzp-byo-progress",children:[i.jsxs("div",{className:"gzp-byo-track",role:"progressbar","aria-valuemin":0,"aria-valuemax":Ce,"aria-valuenow":Math.min(we,Ce),children:[i.jsx("div",{className:"gzp-byo-fill",style:{width:V}}),ze.map($=>i.jsxs("div",{className:`gzp-byo-mark${we>=$.n?" is-hit":""}`,style:{left:ie($.n)},children:[$.n===Ce&&$.n>=5?`${$.n}+`:$.n,i.jsxs("span",{children:[$.label," off"]})]},$.n))]}),i.jsx("p",{className:`gzp-byo-nudge${ve?" is-ok":""}`,children:Fu(we,l)})]}),i.jsxs("div",{className:"gzp-byo-cats",role:"tablist","aria-label":"Menu categories",children:[i.jsx("button",{type:"button",className:`gzp-byo-cat${ae==="all"?" is-active":""}`,onClick:()=>D("all"),children:"All"}),B.map($=>i.jsx("button",{type:"button",className:`gzp-byo-cat${ae===$.id?" is-active":""}`,onClick:()=>D($.id),children:$.name},$.id))]}),i.jsx("div",{className:"gzp-byo-body",children:Je.map($=>i.jsxs("div",{className:"gzp-byo-group",children:[i.jsx("h3",{children:$.name}),i.jsx("div",{className:"gzp-byo-grid",children:$.items.map(L=>i.jsx(Qm,{dish:L,picks:O,dishQty:ue(L._id),stockLeft:J(L),onAdd:le,onRemove:P},L._id))})]},$.id))}),i.jsxs("div",{className:"gzp-byo-foot",children:[i.jsxs("div",{className:"gzp-byo-sum",children:[i.jsxs("small",{children:[we," item",we===1?"":"s"," picked"]}),i.jsxs("div",{children:[i.jsx("b",{children:sl(pe)}),ye>0&&i.jsx("s",{children:sl(X)}),ye>0&&i.jsxs("em",{children:["You save ",sl(ye)]})]})]}),i.jsx("button",{type:"button",className:"gzp-btn gzp-btn-primary",disabled:!ve,onClick:()=>S(O),children:ve?`Add to my order · ${Bt(ge)} off`:`Pick ${l.minItems-we} more to continue`})]})]})})},Nu={name:"",email:"",phone:"",password:"",dateOfBirth:""};function Vm(){const[l,u]=v.useState(null);return v.useEffect(()=>{if(!sessionStorage.getItem("gzp_customer_token"))return;let c=!0;return cf().then(y=>{c&&u(y.data)}).catch(()=>{c&&sessionStorage.removeItem("gzp_customer_token")}),()=>{c=!1}},[]),[l,u]}function Gm({customer:l,setCustomer:u,open:c,setOpen:y}){const[z,C]=v.useState("login"),[S,O]=v.useState(Nu),[j,ae]=v.useState(""),[D,N]=v.useState(""),[B,ue]=v.useState(!1),J=(X,ge)=>O(ye=>({...ye,[X]:ge})),le=()=>{y(!1),ae(""),N(""),O(Nu)},P=async X=>{X.preventDefault(),ue(!0),N(""),ae("");try{if(z==="register"){const ge=await lf(S);u(ge.data.customer),ae(`Your account is active. Welcome, ${ge.data.customer.name}.`)}else{const ge=await sf({email:S.email,password:S.password});u(ge.data.customer),ae(`Welcome, ${ge.data.customer.name}.`)}}catch(ge){N(ge.message||"Could not complete this account request.")}finally{ue(!1)}},we=async()=>{ue(!0);try{await df(),u(null),ae("You are signed out.")}catch(X){u(null),N(`Signed out on this device, but the server could not revoke the session: ${X.message||"request failed"}`)}finally{ue(!1)}};return i.jsx(i.Fragment,{children:c&&i.jsx("div",{className:"gzp-sheet-overlay",role:"presentation",onMouseDown:X=>{X.target===X.currentTarget&&le()},children:i.jsxs("section",{className:"gzp-sheet",role:"dialog","aria-modal":"true","aria-label":"Customer account",children:[i.jsxs("div",{className:"gzp-sheet-head",children:[i.jsx("h2",{children:l?"Your account":z==="register"?"Create an account":"Customer sign in"}),i.jsx("button",{className:"gzp-icon-btn",type:"button",onClick:le,"aria-label":"Close account dialog",children:"×"})]}),i.jsxs("div",{className:"gzp-sheet-body",children:[l?i.jsxs("div",{className:"gzp-form",children:[i.jsxs("p",{children:[l.name,i.jsx("br",{}),l.email,i.jsx("br",{}),l.phone]}),i.jsx("button",{type:"button",className:"gzp-btn gzp-btn-ghost",disabled:B,onClick:we,children:"Sign out"})]}):i.jsxs("form",{className:"gzp-form",onSubmit:P,children:[z==="register"&&i.jsxs(i.Fragment,{children:[i.jsxs("label",{className:"gzp-field",children:[i.jsx("span",{children:"Name"}),i.jsx("input",{required:!0,minLength:2,maxLength:120,value:S.name,onChange:X=>J("name",X.target.value)})]}),i.jsxs("label",{className:"gzp-field",children:[i.jsx("span",{children:"Mobile number"}),i.jsx("input",{required:!0,type:"tel",inputMode:"tel",value:S.phone,onChange:X=>J("phone",X.target.value)})]}),i.jsxs("label",{className:"gzp-field",children:[i.jsx("span",{children:"Date of birth (optional)"}),i.jsx("input",{type:"date",value:S.dateOfBirth,onChange:X=>J("dateOfBirth",X.target.value)})]})]}),i.jsxs("label",{className:"gzp-field",children:[i.jsx("span",{children:"Email"}),i.jsx("input",{required:!0,type:"email",maxLength:254,autoComplete:"email",value:S.email,onChange:X=>J("email",X.target.value)})]}),i.jsxs("label",{className:"gzp-field",children:[i.jsxs("span",{children:["Password ",z==="register"&&"(at least 12 characters)"]}),i.jsx("input",{required:!0,type:"password",minLength:z==="register"?12:void 0,maxLength:128,autoComplete:z==="register"?"new-password":"current-password",value:S.password,onChange:X=>J("password",X.target.value)})]}),i.jsx("button",{className:"gzp-btn gzp-btn-primary gzp-btn-block",disabled:B,children:B?"Please wait…":z==="register"?"Create account":"Sign in"}),i.jsx("button",{type:"button",className:"gzp-btn gzp-btn-ghost gzp-btn-block",onClick:()=>{C(z==="login"?"register":"login"),N(""),ae("")},children:z==="login"?"Create an account":"I already have an account"})]}),j&&i.jsx("p",{role:"status",children:j}),D&&i.jsx("p",{className:"gzp-error",role:"alert",children:D})]})]})})})}const gl=({children:l})=>i.jsx("main",{style:{minHeight:"100vh",background:"#fff8ef",color:"#252525",fontFamily:"system-ui, sans-serif",padding:"clamp(24px, 6vw, 72px) 20px"},children:i.jsxs("div",{style:{maxWidth:820,margin:"0 auto"},children:[i.jsxs("nav",{"aria-label":"Store pages",style:{display:"flex",flexWrap:"wrap",gap:16,marginBottom:32},children:[i.jsx("a",{href:"/",style:{color:"#c92f27"},children:"Home"}),i.jsx("a",{href:"/help",style:{color:"#c92f27"},children:"Help"}),i.jsx("a",{href:"/terms",style:{color:"#c92f27"},children:"Terms and Conditions"}),i.jsx("a",{href:"/privacy",style:{color:"#c92f27"},children:"Privacy Policy"})]}),l]})}),Km=()=>i.jsx(gl,{children:i.jsxs("article",{children:[i.jsx("h1",{style:{fontSize:"clamp(2rem, 5vw, 3rem)",margin:"0 0 8px"},children:"Privacy Policy"}),i.jsx("p",{children:"Last updated: October 22, 2026"}),i.jsx("p",{children:"GenZ Pizza Land respects your privacy. This policy explains what information is used when you browse our online store, place an order, create a customer account, or submit a review."}),i.jsx("h2",{children:"Information we collect"}),i.jsxs("ul",{children:[i.jsx("li",{children:"Order details you provide, such as your name, phone number, delivery address, selected items, and fulfillment instructions."}),i.jsx("li",{children:"Account details, if you register, such as your name, email, phone number, date of birth if supplied, and marketing preference."}),i.jsx("li",{children:"Payment verification details for JazzCash/Raast orders, including the transaction information and screenshot you choose to upload."}),i.jsx("li",{children:"Reviews and ratings you submit. Do not include sensitive personal information in a public review."}),i.jsx("li",{children:"Basic technical information that our hosting and API providers may log to secure and operate the service."})]}),i.jsx("h2",{children:"How we use information"}),i.jsx("p",{children:"We use this information to prepare and deliver orders, confirm payments, provide order status, support customer accounts, prevent abuse, respond to requests, and meet applicable legal or accounting requirements. Marketing messages are sent only when you opt in; you can withdraw that choice in your account."}),i.jsx("h2",{children:"Analytics"}),i.jsx("p",{children:"If Google Analytics is enabled for this store, Google receives usage information such as page views and browser/device details to help us understand how visitors use the site. Google processes this information under its own privacy policy. You can manage cookies and other browser storage through your browser settings."}),i.jsx("h2",{children:"Sharing and storage"}),i.jsx("p",{children:"Order and account information is processed by the restaurant's ordering system and its hosting, database, email, and payment-verification providers as needed to provide the service. We do not sell your personal information. Payment screenshots are used for verification and are not a substitute for confirmation from the payment provider."}),i.jsx("h2",{children:"Retention and your choices"}),i.jsx("p",{children:"We keep order and financial records for operational, dispute-resolution, and legal recordkeeping needs. Account and review information is retained while needed to provide those features. You may request access, correction, or deletion of information that is not required to be retained by contacting the restaurant."}),i.jsx("h2",{children:"Security and children"}),i.jsx("p",{children:"We use access controls and technical safeguards appropriate to operate the service, but no internet transmission or storage system can be guaranteed completely secure. This store is intended for customers placing orders with the restaurant; an adult should place orders on behalf of children."}),i.jsx("h2",{children:"Contact us"}),i.jsxs("p",{children:["For a privacy question or request, contact GenZ Pizza Land using the WhatsApp contact link on our ",i.jsx("a",{href:"/#section-contact",style:{color:"#c92f27"},children:"home page"}),"."]})]})}),qm=()=>i.jsx(gl,{children:i.jsxs("article",{children:[i.jsx("h1",{style:{fontSize:"clamp(2rem, 5vw, 3rem)",margin:"0 0 8px"},children:"Terms and Conditions"}),i.jsx("p",{children:"Last updated: October 26, 2026"}),i.jsxs("p",{children:["These terms apply when you browse or place an order through the GenZ Pizza Land online store. By using the store, you agree to these terms. If you have a question, please visit our ",i.jsx("a",{href:"/help",style:{color:"#c92f27"},children:"Help page"})," or contact the restaurant before placing an order."]}),i.jsx("h2",{children:"Orders and availability"}),i.jsx("p",{children:"Menu items, prices, offers, delivery availability and estimated times may change. Your order request is subject to restaurant confirmation and item availability. Please check your order details, phone number, delivery address and the total shown at checkout before submitting. We may contact you if we need to clarify an order or cannot fulfil an item as requested."}),i.jsx("h2",{children:"Delivery, pickup and charges"}),i.jsx("p",{children:"Delivery and pickup are offered in areas and at times shown by the store. Any delivery fee and applicable tax are shown during checkout before you submit your order. Please provide an accurate address and contact number, and be available to receive or collect your order."}),i.jsx("h2",{children:"Payments"}),i.jsx("p",{children:"Available payment methods are shown at checkout and may include cash on delivery or pickup, and JazzCash / Raast QR payment. For QR payments, follow the checkout instructions. A payment screenshot alone does not confirm that funds were received; submitted payments are subject to verification."}),i.jsx("h2",{children:"Changes, cancellations and order issues"}),i.jsxs("p",{children:["If you need to change or cancel an order, contact the restaurant as soon as possible using the details on the ",i.jsx("a",{href:"/#section-contact",style:{color:"#c92f27"},children:"home page"}),". We cannot guarantee a change or cancellation after preparation has started. If an order is missing, incorrect or has another issue, contact us promptly with your order details so we can review it. Any refund or payment correction is handled after review of the order and payment record."]}),i.jsx("h2",{children:"Website use"}),i.jsx("p",{children:"Please provide accurate information and use the store only for lawful purposes. Do not interfere with the website, attempt unauthorized access, or submit false or abusive orders, reviews or account information."}),i.jsx("h2",{children:"Updates and contact"}),i.jsxs("p",{children:["We may update these terms when our service changes; the latest version will be posted on this page. For help with an order, see ",i.jsx("a",{href:"/help",style:{color:"#c92f27"},children:"customer help"}),". Our ",i.jsx("a",{href:"/privacy",style:{color:"#c92f27"},children:"Privacy Policy"})," explains how information is used."]})]})}),Zm=()=>i.jsx(gl,{children:i.jsxs("article",{children:[i.jsx("h1",{style:{fontSize:"clamp(2rem, 5vw, 3rem)",margin:"0 0 8px"},children:"Customer Help"}),i.jsxs("p",{children:["Need help ordering, paying or checking on an order? Here are quick answers. For personal order assistance, ",i.jsx("a",{href:"/#section-contact",style:{color:"#c92f27"},children:"contact GenZ Pizza Land"}),"."]}),i.jsx("h2",{children:"How do I place an order?"}),i.jsxs("p",{children:["Choose items from the ",i.jsx("a",{href:"/",style:{color:"#c92f27"},children:"online menu"}),", add them to your order, select delivery or pickup, enter your contact details and review the total before submitting."]}),i.jsx("h2",{children:"Where do you deliver, and how much does it cost?"}),i.jsx("p",{children:"Delivery availability and any delivery fee are shown during checkout for your address. Pickup availability is also shown by the store."}),i.jsx("h2",{children:"How can I pay?"}),i.jsx("p",{children:"Choose from the methods offered at checkout, which may include cash on delivery or pickup and JazzCash / Raast QR. If you pay by QR, follow the payment instructions and allow the restaurant to verify it. An uploaded screenshot by itself is not payment confirmation."}),i.jsx("h2",{children:"How do I track my order?"}),i.jsxs("p",{children:["Use the order tracking option on the ",i.jsx("a",{href:"/",style:{color:"#c92f27"},children:"home page"})," and provide the requested order details."]}),i.jsx("h2",{children:"Can I change or cancel my order?"}),i.jsxs("p",{children:[i.jsx("a",{href:"/#section-contact",style:{color:"#c92f27"},children:"Contact the restaurant as soon as possible"})," with your order details. Changes or cancellation may not be possible after preparation has started."]}),i.jsx("h2",{children:"There is a problem with my order or payment"}),i.jsx("p",{children:"Contact the restaurant promptly and include your order details and the phone number used at checkout. Do not post payment details or personal information in a public review."}),i.jsx("h2",{children:"More information"}),i.jsxs("p",{children:["Read our ",i.jsx("a",{href:"/terms",style:{color:"#c92f27"},children:"Terms and Conditions"})," and ",i.jsx("a",{href:"/privacy",style:{color:"#c92f27"},children:"Privacy Policy"}),"."]})]})}),Jm=()=>i.jsx(gl,{children:i.jsxs("section",{style:{paddingTop:"15vh",textAlign:"center"},children:[i.jsx("p",{style:{color:"#c92f27",fontWeight:700},children:"404 · Page not found"}),i.jsx("h1",{style:{fontSize:"clamp(2rem, 5vw, 3rem)"},children:"This page isn’t on the menu."}),i.jsx("p",{children:"That address may be incorrect, or the page may have moved."}),i.jsx("a",{href:"/",style:{display:"inline-block",marginTop:16,borderRadius:999,background:"#e6392f",color:"white",padding:"12px 20px",textDecoration:"none"},children:"Return to the store"})]})}),Xm="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,400..900&family=Hanken+Grotesk:wght@400..800&display=swap",eh=`
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

.gzp-success {
  color: var(--basil);
  font-size: 0.84rem;
  line-height: 1.4;
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

.gzp-delivered-mascot {
  animation: gzp-delivered-bob 2.2s ease-in-out infinite;
}
@keyframes gzp-delivered-bob {
  0%, 100% { transform: translateY(0) rotate(-3deg); }
  50% { transform: translateY(-8px) rotate(3deg); }
}
.gzp-delivered-countdown {
  margin: 16px 0 0;
  color: var(--flour-dim);
  font-size: 13px;
}
@media (prefers-reduced-motion: reduce) {
  .gzp-delivered-mascot { animation: none; }
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
/* ---------- Reviews section ---------- */

.gzp-reviews-section {
  padding: 56px 0 80px;
  background: var(--ink-900);
}

.gzp-reviews-section .gzp-shell {
  max-width: var(--shell);
  margin: 0 auto;
  padding: 0 20px;
}

.gzp-reviews-header {
  display: flex;
  flex-direction: column;
  gap: 24px;
  align-items: flex-start;
  margin-bottom: 40px;
  text-align: left;
}

@media (min-width: 768px) {
  .gzp-reviews-header {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    text-align: left;
  }
}

.gzp-reviews-intro h2 {
  font-family: "Archivo", "Hanken Grotesk", ui-sans-serif, system-ui,
    -apple-system, "Segoe UI", Roboto, sans-serif;
  font-size: clamp(1.8rem, 4vw, 2.5rem);
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.1;
  margin: 0 0 8px;
  color: var(--flour);
}

.gzp-reviews-intro p {
  margin: 0;
  font-size: 1.05rem;
  color: var(--flour-dim);
}

.gzp-reviews-stats {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.gzp-stats-rating {
  display: flex;
  align-items: baseline;
  gap: 10px;
}

.gzp-stats-average {
  font-family: "Archivo", "Hanken Grotesk", ui-sans-serif, system-ui,
    -apple-system, "Segoe UI", Roboto, sans-serif;
  font-size: 2.5rem;
  font-weight: 800;
  color: var(--flour);
  line-height: 1;
}

.gzp-stats-stars {
  display: flex;
  gap: 4px;
  color: var(--gold);
}

.gzp-stats-count {
  font-size: 1rem;
  color: var(--flour-dim);
}

.gzp-reviews-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.gzp-review-card {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--line);
  border-radius: var(--r-lg);
  background: var(--ink-850);
  padding: 20px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.gzp-review-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lift);
}

.gzp-review-head {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 12px;
}

@media (min-width: 480px) {
  .gzp-review-head {
    flex-direction: row;
    align-items: flex-start;
    justify-content: space-between;
  }
}

.gzp-review-head > div:first-child {
  display: flex;
  align-items: center;
  gap: 10px;
}

.gzp-review-name {
  font-weight: 700;
  font-size: 0.95rem;
  color: var(--flour);
}

.gzp-review-verified {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.7rem;
  font-weight: 700;
  color: var(--basil);
  background: rgba(26, 158, 86, 0.1);
  padding: 2px 8px;
  border-radius: var(--r-pill);
}

.gzp-review-meta {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

@media (min-width: 480px) {
  .gzp-review-meta {
    flex-direction: row;
    align-items: center;
    gap: 14px;
  }
}

.gzp-review-stars {
  display: flex;
  gap: 4px;
  color: var(--gold);
}

.gzp-review-product {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--ember);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.gzp-review-date {
  font-size: 0.8rem;
  color: var(--flour-faint);
}

.gzp-review-text {
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.55;
  color: var(--flour);
}

.gzp-reviews-foot {
  display: flex;
  justify-content: center;
  margin-top: 8px;
}

.gzp-empty-reviews {
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 24px;
  color: var(--flour-dim);
}

.gzp-rating-picker {
  display: flex;
  direction: rtl;
  gap: 6px;
  justify-content: center;
}

.gzp-star-btn {
  background: none;
  border: none;
  padding: 4px;
  cursor: pointer;
  color: #ccc;
  transition: transform 0.1s ease;
}

.gzp-star-btn:hover,
.gzp-star-btn.is-active {
  color: var(--gold);
}

.gzp-star-btn:active {
  transform: scale(0.9);
}

.gzp-star-btn svg {
  display: block;
}

.gzp-review-form-foot {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 16px;
}

.gzp-review-success {
  color: var(--basil);
  font-size: 0.9rem;
  margin-bottom: 12px;
}

/* ---------- All reviews page ---------- */

.gzp-all-reviews-page {
  padding: 26px 0 120px;
}

.gzp-all-reviews-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  margin-bottom: 26px;
  flex-wrap: wrap;
}

.gzp-all-reviews-intro {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.gzp-all-reviews-intro h2 {
  font-weight: 800;
  font-variation-settings: "wdth" 114;
  font-size: clamp(1.6rem, 4vw, 2.4rem);
  letter-spacing: -0.03em;
}

.gzp-all-reviews-intro p {
  color: var(--flour-dim);
  font-size: 0.95rem;
}

.gzp-all-reviews-stats {
  display: flex;
  align-items: baseline;
  gap: 10px;
  flex-shrink: 0;
}

.gzp-all-reviews-average {
  font-family: "Archivo", sans-serif;
  font-variation-settings: "wdth" 108;
  font-weight: 800;
  font-size: 2.4rem;
  letter-spacing: -0.02em;
  color: var(--flour);
}

.gzp-all-reviews-stars {
  display: flex;
  gap: 4px;
  color: var(--gold);
}

.gzp-all-reviews-count {
  color: var(--flour-faint);
  font-size: 0.9rem;
  font-weight: 600;
  margin-left: 8px;
}

.gzp-all-reviews-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 18px;
  margin-top: 6px;
}

@media (min-width: 720px) {
  .gzp-all-reviews-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .gzp-all-reviews-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.gzp-all-reviews-foot {
  margin-top: 34px;
  display: flex;
  justify-content: center;
}

.gzp-empty {
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 24px;
  color: var(--flour-dim);
  text-align: center;
}

.gzp-empty p {
  margin: 0;
  font-size: 1rem;
}

@media (max-width: 640px) {
  .gzp-reviews-section {
    padding: 40px 0 60px;
  }
  .gzp-reviews-grid {
    grid-template-columns: 1fr;
  }
}
`;(()=>{if(typeof document>"u")return;if(!document.getElementById("gzp-fonts")){const u=document.createElement("link");u.rel="preconnect",u.href="https://fonts.googleapis.com",document.head.appendChild(u);const c=document.createElement("link");c.rel="preconnect",c.href="https://fonts.gstatic.com",c.crossOrigin="",document.head.appendChild(c);const y=document.createElement("link");y.id="gzp-fonts",y.rel="stylesheet",y.href=Xm,document.head.appendChild(y)}let l=document.getElementById("gzp-styles");if(l||(l=document.createElement("style"),l.id="gzp-styles",document.head.appendChild(l)),l.textContent=eh+$m+vf+Bm+Rm,!document.querySelector('meta[name="theme-color"]')){const u=document.createElement("meta");u.name="theme-color",u.content="#FFF8EF",document.head.appendChild(u)}})();const th=16,rh=["Pending","Accepted","Preparing","Ready to Deliver","Completed"],nh=["Payment Pending Verification","Accepted","Preparing","Ready to Deliver","Completed"],ac="Payment Pending Verification",Eu={[ac]:"Verifying your payment",Pending:"Order received",Accepted:"Accepted by the kitchen",Preparing:"Preparing your food","Ready to Deliver":"Out for delivery",Completed:"Delivered",Cancelled:"Cancelled"},ih={[ac]:"Verifying your payment",Pending:"We've got your order",Accepted:"The kitchen is on it",Preparing:"Your food is cooking","Ready to Deliver":"On the way to you",Completed:"Delivered — enjoy",Cancelled:"Order cancelled"},il="deals",Du="923259061006",Au=`https://wa.me/${Du}?text=${encodeURIComponent("Hello GenZ Pizza Land, I have an inquiry.")}`,oh=1e4,Ze=l=>{const u=Number(l)||0;return`Rs ${u.toLocaleString("en-PK",{minimumFractionDigits:Number.isInteger(u)?0:2,maximumFractionDigits:2})}`},tc=l=>{const u=[];return((l==null?void 0:l.variants)||[]).forEach(c=>{c.size&&!u.includes(c.size)&&u.push(c.size)}),u},cl=(l,u)=>{const c=[];return((l==null?void 0:l.variants)||[]).forEach(y=>{y.size===u&&y.crust&&!c.includes(y.crust)&&c.push(y.crust)}),c},rc=(l,u,c)=>((l==null?void 0:l.variants)||[]).find(y=>y.size===u&&(y.crust||"")===(c||""))||null,Bu=l=>((l==null?void 0:l.variants)||[]).reduce((u,c)=>u===null||c.price<u.price?c:u,null),ol=l=>{let u=l.replace(/[^\d+]/g,"");return u=u[0]==="+"?"+"+u.slice(1).replace(/\+/g,""):u.replace(/\+/g,""),u.slice(0,14)},Ks=l=>{const u=l.replace(/\D/g,"");return u.length>=10&&u.length<=13},Ai={width:20,height:20,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:1.8,strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",focusable:"false"},$u=l=>i.jsxs("svg",{...Ai,...l,children:[i.jsx("circle",{cx:"11",cy:"11",r:"7"}),i.jsx("path",{d:"m20 20-3.2-3.2"})]}),ah=l=>i.jsxs("svg",{...Ai,...l,children:[i.jsx("path",{d:"M6 8h12l-1 11H7L6 8Z"}),i.jsx("path",{d:"M9.5 8V6.5a2.5 2.5 0 0 1 5 0V8"})]}),lh=l=>i.jsx("svg",{...Ai,strokeWidth:2.4,...l,children:i.jsx("path",{d:"M12 5v14M5 12h14"})}),qs=({dir:l="right",...u})=>i.jsx("svg",{...Ai,strokeWidth:2,...u,children:i.jsx("path",{d:l==="left"?"m14.5 5-7 7 7 7":"m9.5 5 7 7-7 7"})}),Uu=l=>i.jsxs("svg",{...Ai,...l,children:[i.jsx("path",{d:"M3 7h11v9H3zM14 10h4l3 3v3h-7z"}),i.jsx("circle",{cx:"7",cy:"18",r:"1.6"}),i.jsx("circle",{cx:"17.5",cy:"18",r:"1.6"})]}),sh=({filled:l,...u})=>i.jsx("svg",{...Ai,strokeWidth:2,fill:l?"currentColor":"none",...u,children:i.jsx("path",{d:"M12 20.5s-7.3-4.6-9.9-9.1C.5 8 1.9 4.6 5.1 3.6c2-.6 4.1.1 5.4 1.8l1.5 2 1.5-2c1.3-1.7 3.4-2.4 5.4-1.8 3.2 1 4.6 4.4 3 7.8-2.6 4.5-9.9 9.1-9.9 9.1Z"})}),dl=({price:l,originalPrice:u,from:c})=>i.jsxs("p",{className:"gzp-price",children:[c&&i.jsx("span",{className:"gzp-price-from",children:"From"}),Ze(l),u>l&&i.jsx("s",{children:Ze(u)})]}),nc=({src:l,alt:u,icon:c,className:y})=>{const[z,C]=v.useState(!1);return v.useEffect(()=>C(!1),[l]),l&&!z?i.jsx("img",{src:l,alt:u,className:y,loading:"lazy",onError:()=>C(!0)}):i.jsx("div",{className:"gzp-media-fallback",children:i.jsx(ml,{icon:c})})},Vn=l=>typeof l!="number"?null:l<=0?{text:"Sold out",out:!0}:l<=5?{text:`Only ${l} left`,out:!1}:null,ch=({slides:l,onSlideClick:u})=>{var ae;const[c,y]=v.useState(0),[z,C]=v.useState(!1),S=v.useRef(typeof window<"u"&&((ae=window.matchMedia)==null?void 0:ae.call(window,"(prefers-reduced-motion: reduce)").matches)).current;if(v.useEffect(()=>{if(l.length<=1||z||S)return;const D=setInterval(()=>y(N=>(N+1)%l.length),4200);return()=>clearInterval(D)},[l.length,z,S]),v.useEffect(()=>{c>=l.length&&y(0)},[l.length,c]),l.length===0)return i.jsx("div",{className:"gzp-slider","aria-hidden":"true",children:i.jsx("div",{className:"gzp-slider-fallback",children:i.jsx("img",{src:Gn,alt:""})})});const O=l[c],j=!!u;return i.jsxs("div",{className:"gzp-slider",onMouseEnter:()=>C(!0),onMouseLeave:()=>C(!1),onTouchStart:()=>C(!0),onTouchEnd:()=>C(!1),onClick:j?()=>u(O):void 0,role:j?"button":void 0,tabIndex:j?0:void 0,onKeyDown:j?D=>{(D.key==="Enter"||D.key===" ")&&u(O)}:void 0,children:[l.map((D,N)=>i.jsx("img",{src:D.url,alt:D.alt||"GenZ Pizza Land menu and food promotion","aria-hidden":N!==c||void 0,className:`gzp-slider-img${N===c?" is-active":""}`},D.url+N)),l.length>1&&i.jsx("div",{className:"gzp-slider-dots",role:"tablist","aria-label":"Featured photos",children:l.map((D,N)=>i.jsx("button",{type:"button",role:"tab","aria-selected":N===c,"aria-label":`Show photo ${N+1} of ${l.length}`,className:`gzp-slider-dot${N===c?" is-active":""}`,onClick:B=>{B.stopPropagation(),y(N)}},N))})]})},Wu=()=>i.jsxs("svg",{viewBox:"0 0 140 140",className:"gzp-thankyou-mascot","aria-hidden":"true",children:[i.jsxs("g",{stroke:"#e0b84a",strokeWidth:"3",strokeLinecap:"round",fill:"none",opacity:"0.75",children:[i.jsx("path",{d:"M52 20 C 47 12, 57 9, 53 1"}),i.jsx("path",{d:"M70 20 C 65 12, 75 9, 71 1"}),i.jsx("path",{d:"M88 20 C 83 12, 93 9, 89 1"})]}),i.jsx("path",{d:"M20 32 L120 32 L70 132 Z",fill:"#ffcf5c",stroke:"#e0a92e",strokeWidth:"4",strokeLinejoin:"round"}),i.jsx("path",{d:"M20 32 Q70 47 120 32",fill:"none",stroke:"#e0a92e",strokeWidth:"4",strokeLinecap:"round"}),i.jsx("circle",{cx:"52",cy:"58",r:"6",fill:"#e6503d"}),i.jsx("circle",{cx:"88",cy:"62",r:"6",fill:"#e6503d"}),i.jsx("circle",{cx:"70",cy:"90",r:"6",fill:"#e6503d"}),i.jsx("circle",{cx:"56",cy:"76",r:"5.5",fill:"#3a2b1a"}),i.jsx("circle",{cx:"84",cy:"76",r:"5.5",fill:"#3a2b1a"}),i.jsx("path",{d:"M60 96 Q70 104 80 96",stroke:"#3a2b1a",strokeWidth:"3.5",fill:"none",strokeLinecap:"round"})]}),dh=({order:l,onTrack:u,onContinue:c})=>{const y=String((l==null?void 0:l._id)||"").slice(-6).toUpperCase();return i.jsx("div",{className:"gzp-thankyou-overlay",role:"dialog","aria-modal":"true","aria-label":"Order confirmed",children:i.jsxs("div",{className:"gzp-thankyou-card",children:[i.jsx("span",{className:"gzp-thankyou-sticker tl","aria-hidden":"true",children:i.jsx(q.Sparkles,{})}),i.jsx("span",{className:"gzp-thankyou-sticker tr","aria-hidden":"true",children:i.jsx(q.Pizza,{})}),i.jsx("span",{className:"gzp-thankyou-sticker bl","aria-hidden":"true",children:i.jsx(q.Cheese,{})}),i.jsx("span",{className:"gzp-thankyou-sticker br","aria-hidden":"true",children:i.jsx(q.Star,{})}),i.jsx("div",{className:"gzp-thankyou-badge",children:i.jsx("img",{src:Gn,alt:"GenZ Pizza Land"})}),i.jsx(Wu,{}),i.jsx("h2",{className:"gzp-thankyou-title",children:"Thank you!"}),i.jsx("p",{className:"gzp-thankyou-sub",children:(l==null?void 0:l.orderStatus)===ac?"We'll verify your payment and confirm your order shortly.":"Your order's in and the kitchen's already looking at it."}),y&&i.jsxs("span",{className:"gzp-thankyou-pill",children:["Order #",y]}),i.jsx("button",{type:"button",className:"gzp-thankyou-track-btn",onClick:u,children:"Track My Order"}),i.jsx("button",{type:"button",className:"gzp-thankyou-link",onClick:c,children:"Click for more order"})]})})},uh=({order:l,onComplete:u})=>{const[c,y]=v.useState(8),z=String((l==null?void 0:l._id)||"").slice(-6).toUpperCase();return v.useEffect(()=>{const C=window.setTimeout(u,8e3),S=window.setInterval(()=>y(O=>Math.max(0,O-1)),1e3);if("speechSynthesis"in window&&"SpeechSynthesisUtterance"in window){const O=new SpeechSynthesisUtterance("Thank you for your order. Enjoy your meal!");O.lang="en-US",O.rate=.95,window.speechSynthesis.speak(O)}return()=>{window.clearTimeout(C),window.clearInterval(S),"speechSynthesis"in window&&window.speechSynthesis.cancel()}},[u]),i.jsx("div",{className:"gzp-thankyou-overlay",role:"status","aria-live":"polite",children:i.jsxs("section",{className:"gzp-thankyou-card","aria-labelledby":"gzp-delivered-title",children:[i.jsx("div",{className:"gzp-thankyou-badge",children:i.jsx("img",{src:Gn,alt:"GenZ Pizza Land"})}),i.jsx("div",{className:"gzp-delivered-mascot",children:i.jsx(Wu,{})}),i.jsx("h1",{id:"gzp-delivered-title",className:"gzp-thankyou-title",children:"Your order has arrived!"}),i.jsxs("p",{className:"gzp-thankyou-sub",children:[z?`Order #${z} is delivered. `:"","Thank you for your order. Enjoy your meal!"]}),i.jsxs("p",{className:"gzp-delivered-countdown",children:["Taking you back to the home page in ",c," seconds…"]})]})})},ul=({qty:l,onAdd:u,onRemove:c,size:y,label:z})=>i.jsxs("div",{className:`gzp-stepper${y==="lg"?" gzp-stepper-lg":""}`,children:[i.jsx("button",{type:"button",onClick:c,"aria-label":`Remove one ${z}`,children:"−"}),i.jsx("span",{"aria-live":"polite",children:l}),i.jsx("button",{type:"button",onClick:u,"aria-label":`Add one more ${z}`,children:"+"})]}),ph=({dish:l,cart:u,cartKey:c,addToCart:y,removeFromCart:z,onOpenQuickView:C})=>{const S=v.useMemo(()=>tc(l),[l]),O=S.length>0,[j,ae]=v.useState(S[0]||""),D=v.useMemo(()=>cl(l,j),[l,j]),[N,B]=v.useState(D[0]||""),[ue,J]=v.useState(!1);v.useEffect(()=>{D.length>0&&!D.includes(N)?B(D[0]):D.length===0&&N!==""&&B("")},[j]);const le=O?rc(l,j,N):null,P=O?Bu(l):null,we=O?(le==null?void 0:le.price)??(P==null?void 0:P.price)??l.price:l.price,X=O?(le==null?void 0:le.originalPrice)??0:l.originalPrice,ge=c("dish",l._id,j,N),ye=u[ge]||0,pe=Vn(l.availableQty),ve=!!(pe!=null&&pe.out),ze=(!O||!!le)&&!ve,Ce=()=>C(l);return i.jsxs("div",{className:"gzp-card",children:[i.jsxs("div",{className:"gzp-card-media",role:"button",tabIndex:0,onClick:Ce,onKeyDown:ie=>ie.key==="Enter"&&Ce(),children:[i.jsx(nc,{src:dr(l.image),alt:l.name,icon:l.icon}),pe&&i.jsx("span",{className:`gzp-stock${pe.out?" is-out":""}`,children:pe.text}),!O&&l.originalPrice>l.price&&i.jsxs("span",{className:"gzp-save",children:["Save ",Math.round((l.originalPrice-l.price)/l.originalPrice*100),"%"]}),i.jsx("button",{type:"button",className:`gzp-wish${ue?" is-active":""}`,onClick:ie=>{ie.stopPropagation(),J(V=>!V)},"aria-pressed":ue,"aria-label":ue?`Remove ${l.name} from favourites`:`Add ${l.name} to favourites`,children:i.jsx(sh,{filled:ue})})]}),i.jsxs("div",{className:"gzp-card-body",children:[i.jsx("h3",{role:"button",tabIndex:0,onClick:Ce,onKeyDown:ie=>ie.key==="Enter"&&Ce(),children:l.name}),i.jsx(dl,{price:we,originalPrice:X,from:O}),l.description&&i.jsx("p",{className:"gzp-card-desc",children:l.description}),O&&i.jsxs("div",{className:"gzp-variant-row",onClick:ie=>ie.stopPropagation(),role:"presentation",children:[i.jsx("select",{className:"gzp-select",value:j,onChange:ie=>ae(ie.target.value),"aria-label":`Size for ${l.name}`,children:S.map(ie=>i.jsx("option",{value:ie,children:ie},ie))}),D.length>0&&i.jsx("select",{className:"gzp-select",value:N,onChange:ie=>B(ie.target.value),"aria-label":`Crust for ${l.name}`,children:D.map(ie=>i.jsx("option",{value:ie,children:ie},ie))})]}),i.jsx("div",{className:"gzp-card-foot",onClick:ie=>ie.stopPropagation(),role:"presentation",children:ye?i.jsx(ul,{qty:ye,label:l.name,onAdd:()=>y("dish",l._id,l.name,j,N),onRemove:()=>z("dish",l._id,j,N)}):i.jsx("button",{type:"button",className:"gzp-add gzp-add-wide",disabled:!ze,onClick:()=>y("dish",l._id,l.name,j,N),children:ve?"Sold out":i.jsxs(i.Fragment,{children:[i.jsx(lh,{})," Add"]})})})]})]})},fh=()=>i.jsxs("div",{className:"gzp-skeleton",children:[i.jsx("div",{className:"gzp-skeleton-media"}),i.jsxs("div",{className:"gzp-skeleton-lines",children:[i.jsx("i",{}),i.jsx("i",{})]})]}),mh=()=>i.jsx("a",{className:"gzp-whatsapp",href:Au,target:"_blank",rel:"noopener noreferrer","aria-label":"Chat with us on WhatsApp for any inquiry",title:"WhatsApp inquiry: +92 325 9061006",children:i.jsx("svg",{viewBox:"0 0 32 32",width:"30",height:"30","aria-hidden":"true",fill:"#fff",children:i.jsx("path",{d:"M16.03 3C9.4 3 4 8.38 4 15c0 2.12.56 4.19 1.62 6.01L4 29l8.2-1.58A12.02 12.02 0 0 0 16.03 27C22.66 27 28 21.62 28 15S22.66 3 16.03 3zm0 21.9c-1.8 0-3.56-.48-5.1-1.4l-.37-.22-4.86.94.98-4.73-.24-.39A9.86 9.86 0 0 1 6.1 15c0-5.46 4.45-9.9 9.93-9.9S26 9.54 26 15s-4.5 9.9-9.97 9.9zm5.44-7.4c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.27-.47-2.42-1.49-.9-.8-1.5-1.78-1.67-2.08-.17-.3-.02-.46.13-.61.14-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.05 1.03-1.05 2.5s1.08 2.9 1.23 3.1c.15.2 2.12 3.23 5.13 4.53.72.31 1.28.5 1.71.63.72.23 1.37.2 1.89.12.58-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.13-.27-.2-.57-.35z"})})}),Zs=({minimal:l,cartCount:u,customer:c,onSearch:y,onCart:z,onNavigate:C,onTrack:S,onAccount:O})=>i.jsx("header",{className:"gzp-header",children:i.jsxs("div",{className:"gzp-header-inner",children:[i.jsxs("button",{className:"gzp-brand",onClick:()=>window.scrollTo({top:0,behavior:"smooth"}),type:"button",children:[i.jsx("img",{src:Gn,alt:"",className:"gzp-brand-mark"}),i.jsxs("span",{className:"gzp-brand-name",children:["GenZ Pizza Land",i.jsx("span",{className:"gzp-brand-sub",children:"Delivered hot across Gojra"})]})]}),!l&&i.jsxs(i.Fragment,{children:[i.jsxs("nav",{className:"v2-links","aria-label":"Site",children:[i.jsx("button",{type:"button",className:"v2-link",onClick:()=>C==null?void 0:C("menu"),children:"Menu"}),i.jsx("button",{type:"button",className:"v2-link",onClick:()=>C==null?void 0:C("deals"),children:"Deals"}),i.jsx("button",{type:"button",className:"v2-link",onClick:()=>C==null?void 0:C("reviews"),children:"Reviews"}),i.jsx("button",{type:"button",className:"v2-link",onClick:()=>C==null?void 0:C("contact"),children:"Contact"})]}),i.jsxs("button",{className:"v2-track-btn",onClick:S,type:"button",children:[i.jsx(Uu,{})," Track order"]}),i.jsx("button",{className:"v2-track-btn",onClick:O,type:"button",children:c?c.name:"Account"}),i.jsx("button",{className:"gzp-icon-btn",onClick:y,"aria-label":"Search the menu",type:"button",children:i.jsx($u,{})}),i.jsxs("button",{className:"gzp-icon-btn gzp-cart-btn",onClick:z,"aria-label":`Your order, ${u} item${u===1?"":"s"}`,type:"button",children:[i.jsx(ah,{}),u>0&&i.jsx("span",{className:"gzp-cart-count",children:u})]})]})]})});function hh(){var Yo,Vo,Go,xi,Ko,qo,Zo,Jo,Xo,ro,ea,ta,ra,na,vi,ia,oa,aa,no,la,sa,ca,da;const[l,u]=Vm(),[c,y]=v.useState(!1),[z,C]=v.useState([]),[S,O]=v.useState([]),[j,ae]=v.useState([]),[D,N]=v.useState([]),[B,ue]=v.useState(th),[J,le]=v.useState(()=>Gs(null)),[P,we]=v.useState(!1),[X,ge]=v.useState({}),[ye,pe]=v.useState(!1),[ve,ze]=v.useState(!1),[Ce,ie]=v.useState(""),[V,Je]=v.useState(null),[$,L]=v.useState(""),[W,Ne]=v.useState(!1),[me,ne]=v.useState(""),[T,H]=v.useState(""),[U,h]=v.useState(!1),[E,ke]=v.useState(""),[xe,_e]=v.useState(!0),[Pe,Me]=v.useState(""),[Te,$e]=v.useState([]),[St,Bi]=v.useState(!1),[gn,$i]=v.useState(0),[Xt,xl]=v.useState(0),[No,zr]=v.useState(!1),[Rt,Br]=v.useState({customerName:"",rating:5,reviewText:"",productName:""}),[$r,xn]=v.useState(!1),[vn,vl]=v.useState({type:"",text:""}),[Eo,Ui]=v.useState(!1),[Wi,Kn]=v.useState(!1),Ur=v.useRef(!1),[qn,Wr]=v.useState(!1),[at,yn]=v.useState(()=>localStorage.getItem("gzp_last_order")||null),[se,er]=v.useState(null),[yl,bn]=v.useState(!1),[Zn,wn]=v.useState(!1),Hi=se&&!["Completed","Closed","Cancelled"].includes(se.orderStatus),[ct,$t]=v.useState({name:"",phone:"",address:""});v.useEffect(()=>{l&&$t(d=>({...d,name:l.name,phone:l.phone}))},[l]);const[kr,Qi]=v.useState(il);v.useEffect(()=>{let d=null;const g=()=>{document.body.classList.add("is-scrolling"),d&&clearTimeout(d),d=setTimeout(()=>document.body.classList.remove("is-scrolling"),150)};return window.addEventListener("scroll",g,{passive:!0,capture:!0}),()=>{window.removeEventListener("scroll",g,{capture:!0}),d&&clearTimeout(d),document.body.classList.remove("is-scrolling")}},[]);const[zn,Hr]=v.useState(!1),[Qr,Po]=v.useState(""),[Jn,Lo]=v.useState(""),[G,Ct]=v.useState(null),[Ut,Xn]=v.useState(""),[Ft,ur]=v.useState(""),[pr,Yr]=v.useState({});v.useEffect(()=>{if((G==null?void 0:G.type)==="dish"){const g=tc(G.item)[0]||"";Xn(g),ur(cl(G.item,g)[0]||""),Yr({})}else if((G==null?void 0:G.type)==="deal"){Xn(""),ur("");const d={};(G.item.items||[]).forEach((g,k)=>{var Y;if(!g.customizable)return;const R=(g.flavourOptions||[])[0];if(!R)return;const A=(Y=R.variants)==null?void 0:Y[0];d[k]={dishId:R._id,size:(A==null?void 0:A.size)||"",crust:(A==null?void 0:A.crust)||""}}),Yr(d)}else Xn(""),ur(""),Yr({})},[G]);const[_o,Mo]=v.useState(""),[ei,xt]=v.useState(!1),[To,Ro]=v.useState(null),[fr,Yi]=v.useState(Vs),[mr,ti]=v.useState(al),dt=wm(),[Fo,Vi]=v.useState(""),[He,Io]=v.useState(!1),[ri,ni]=v.useState(""),Vr=v.useRef(null),[Oo,jr]=v.useState(!1),kn=v.useRef(null),Nt=v.useRef(null);v.useEffect(()=>{(async()=>{var d,g,k;try{const[R,A,Y,te,fe]=await Promise.all([tf(),yu(),bu().catch(()=>({data:[]})),rf().catch(()=>({data:[]})),zu().catch(()=>null)]);C(R.data||[]),O(A.data||[]),ae(Y.data||[]),N(te.data||[]);const Le=(d=fe==null?void 0:fe.data)==null?void 0:d.taxRatePercent;typeof Le=="number"&&ue(Le),(g=fe==null?void 0:fe.data)!=null&&g.payments&&Yi({...Vs,...fe.data.payments}),(k=fe==null?void 0:fe.data)!=null&&k.buildYourOwnDeal&&le(Gs(fe.data.buildYourOwnDeal))}catch(R){Me(R.message)}finally{_e(!1)}})()},[]),v.useEffect(()=>{if(!at)return;let d=!1;const g=async()=>{try{const R=await wu(at);d||er(R.data)}catch(R){if(d)return;R.status===404&&(localStorage.removeItem("gzp_last_order"),yn(null),er(null))}};g();const k=setInterval(g,8e3);return()=>{d=!0,clearInterval(k)}},[at]),v.useEffect(()=>()=>clearTimeout(Nt.current),[]);const ii=v.useMemo(()=>{const d=new Map;S.forEach(A=>{var te;const Y=((te=A.category)==null?void 0:te._id)||A.category||"other";d.has(Y)||d.set(Y,[]),d.get(Y).push(A)});const g=z.filter(A=>(d.get(A._id)||[]).length>0).map(A=>({id:A._id,name:A.name,icon:A.icon,description:A.description,items:d.get(A._id)})),k=new Set(z.map(A=>A._id)),R=S.filter(A=>{var Y;return!k.has(((Y=A.category)==null?void 0:Y._id)||A.category)});return R.length>0&&g.push({id:"other",name:"More to eat",icon:"utensils",items:R}),g},[z,S]),rt=v.useMemo(()=>{const d=ii.map(g=>({id:g.id,name:g.name}));return j.length>0&&d.unshift({id:il,name:"Deals"}),d},[ii,j]),bl=v.useMemo(()=>{const d={};return z.forEach(g=>{d[g._id]=g.name}),d},[z]),Do=v.useMemo(()=>{const d=Jn.trim().toLowerCase();if(!d)return[];const g=[];return j.forEach(k=>{k.name.toLowerCase().includes(d)&&g.push({type:"deal",item:k})}),S.forEach(k=>{k.name.toLowerCase().includes(d)&&g.push({type:"dish",item:k})}),g.slice(0,20)},[Jn,S,j]);v.useEffect(()=>{const d=window.setTimeout(()=>Lo(Qr),180);return()=>window.clearTimeout(d)},[Qr]);const Sr=(d,g,k="",R="")=>`${d}:${g}:${k||""}||${R||""}`,jn=d=>{try{return`sel:${btoa(encodeURIComponent(JSON.stringify(d)))}`}catch{return"sel:"}},oi=d=>{if(!d||!d.startsWith("sel:"))return null;try{return JSON.parse(decodeURIComponent(atob(d.slice(4))))}catch{return null}},hr=d=>((d==null?void 0:d.items)||[]).some(g=>g.customizable),It=v.useMemo(()=>Object.entries(X).filter(([,d])=>d>0).map(([d,g])=>{const[k,R,A="||"]=d.split(":"),Y=k==="deal"?j.find(et=>et._id===R):S.find(et=>et._id===R);if(!Y)return null;const[te,fe]=A.split("||");let Le=Y.price,Qe=Y.originalPrice,Ye="",nt=null;if((k==="dish"||k==="byo")&&te){const et=rc(Y,te,fe);et&&(Le=et.price,Qe=et.originalPrice,Ye=[et.size,et.crust].filter(Boolean).join(", "))}if(k==="deal"){const et=oi(te);et&&(nt=et,Ye=Object.values(et).map(Pr=>{const oe=S.find(Re=>Re._id===Pr.dishId);return oe?[Pr.size,oe.name].filter(Boolean).join(" "):null}).filter(Boolean).join(", "))}return{type:k,item:Y,qty:g,key:d,size:te,crust:fe,unitPrice:Le,unitOriginalPrice:Qe,variantLabel:Ye,dealSelections:nt}}).filter(Boolean),[X,S,j]),Ao=It.reduce((d,g)=>d+g.unitPrice*g.qty,0),ai=It.filter(d=>d.type==="byo"),Wt=ai.reduce((d,g)=>d+g.qty,0),Bo=ai.reduce((d,g)=>d+g.unitPrice*g.qty,0),Sn=Wt>0?hl(Wt,J):0,tr=Math.round(Bo*Sn/100),Cn=Wt>0&&J.enabled?Math.max(0,J.minItems-Wt):0,Gr=Wt>0&&(Cn>0||!J.enabled),Oe=Math.max(0,Ao-tr),Kr=Number(V==null?void 0:V.discountAmount)||0,li=Number(V==null?void 0:V.deliveryDiscount)||0,Nn=Math.max(0,Oe-Kr),Gi=Nn*B/100,En=Nn+Gi,je=Dm(Nn),Pn=Math.max(0,je.fee-li),Cr=JSON.stringify({cart:X,fulfillment:[je.method,je.branchId,je.zoneId],phone:ct.phone,email:E,customerId:(l==null?void 0:l.id)||""}),rr=v.useRef(Cr);v.useEffect(()=>{rr.current!==Cr&&V&&(Je(null),L("Cart or checkout details changed. Reapply your coupon.")),rr.current=Cr},[Cr,V]);const Ht=v.useRef(null);v.useEffect(()=>{const d=JSON.stringify({cart:X,name:ct.name,phone:ct.phone,fulfillment:[je.method,je.branchId,je.zoneId,je.address],payment:[mr,dt.tid,dt.sender,dt.proofId],coupon:(V==null?void 0:V.code)||"",couponCustomerEmail:E});Ht.current!==null&&Ht.current!==d&&vu(),Ht.current=d},[X,ct.name,ct.phone,je.method,je.branchId,je.zoneId,je.address,mr,dt.tid,dt.sender,dt.proofId,V==null?void 0:V.code,E]);const nr=En+Pn,gr=It.reduce((d,g)=>d+g.qty,0),Qt=v.useCallback((d,g=2e3)=>{Mo(d),clearTimeout(Nt.current),Nt.current=setTimeout(()=>Mo(""),g)},[]),Ae=v.useRef(X);Ae.current=X;const Ki=v.useRef({dishes:S,deals:j});Ki.current={dishes:S,deals:j};const $o=(d,g,k)=>{const R=g==="deal"?["deal"]:["dish","byo"];return Object.entries(d).reduce((A,[Y,te])=>R.some(fe=>Y.startsWith(`${fe}:${k}:`))?A+te:A,0)},Ln=(d,g)=>(d==="deal"?Ki.current.deals:Ki.current.dishes).find(k=>k._id===g),xr=v.useCallback((d,g,k,R="",A="",Y=null)=>{const te=Ln(d,g),fe=k||(te==null?void 0:te.name)||"This item",Le=typeof(te==null?void 0:te.availableQty)=="number"?te.availableQty:1/0;if($o(Ae.current,d,g)+1>Le){Qt(Le<=0?`Sorry, ${fe} is out of stock right now.`:`Only ${Le} ${fe} in stock. Please select ${Le}.`,3500);return}const Ye=Y?Sr(d,g,jn(Y)):Sr(d,g,R,A);Ae.current={...Ae.current,[Ye]:(Ae.current[Ye]||0)+1},ge(Ae.current),k&&Qt(`${k} added`)},[Qt]),_n=v.useCallback((d,g,k="",R="")=>{const A=Sr(d,g,k,R);Ae.current={...Ae.current,[A]:Math.max(0,(Ae.current[A]||0)-1)},ge(Ae.current)},[]),qr=v.useCallback(async()=>{var d,g,k;try{const[R,A,Y]=await Promise.all([yu(),bu().catch(()=>null),zu().catch(()=>null)]);O(R.data||[]),A&&ae(A.data||[]),(d=Y==null?void 0:Y.data)!=null&&d.buildYourOwnDeal&&le(Gs(Y.data.buildYourOwnDeal)),typeof((g=Y==null?void 0:Y.data)==null?void 0:g.taxRatePercent)=="number"&&ue(Y.data.taxRatePercent),(k=Y==null?void 0:Y.data)!=null&&k.payments&&Yi({...Vs,...Y.data.payments})}catch{}},[]);v.useEffect(()=>{if(xe)return;const d=()=>{document.hidden||qr()},g=setInterval(d,oh);return document.addEventListener("visibilitychange",d),window.addEventListener("focus",d),()=>{clearInterval(g),document.removeEventListener("visibilitychange",d),window.removeEventListener("focus",d)}},[xe,qr]),v.useEffect(()=>{const d=Ae.current,g={};Object.entries(d).forEach(([A,Y])=>{if(Y<=0)return;const[te,fe]=A.split(":"),Le=te==="byo"?"dish":te;(g[`${Le}:${fe}`]=g[`${Le}:${fe}`]||[]).push(A)});let k=d;const R=[];Object.entries(g).forEach(([A,Y])=>{const[te,fe]=A.split(":"),Le=(te==="deal"?j:S).find(Ye=>Ye._id===fe);if(!Le||typeof Le.availableQty!="number")return;let Qe=Y.reduce((Ye,nt)=>Ye+k[nt],0);if(!(Qe<=Le.availableQty)){k={...k};for(const Ye of[...Y].reverse()){if(Qe<=Le.availableQty)break;const nt=Math.min(k[Ye],Qe-Le.availableQty);k[Ye]-=nt,Qe-=nt}R.push(Le.availableQty<=0?`${Le.name} just sold out and was removed from your order.`:`Only ${Le.availableQty} ${Le.name} in stock - your order was set to ${Le.availableQty}.`)}}),R.length>0&&(Ae.current=k,ge(k),Qt(R.join(" "),5e3))},[S,j,Qt]);const qi=d=>{var Y,te;if(!d)return;const g=(((Y=document.querySelector(".gzp-header"))==null?void 0:Y.offsetHeight)||0)+(((te=document.querySelector(".gzp-navbar"))==null?void 0:te.offsetHeight)||0)+8,k=()=>Math.max(0,d.getBoundingClientRect().top+window.scrollY-g);window.scrollTo({top:k(),behavior:"smooth"});let R=0;const A=()=>{R+=1;const fe=k()-window.scrollY;Math.abs(fe)>6&&R<=4&&(window.scrollTo({top:k(),behavior:R<3?"smooth":"auto"}),window.setTimeout(A,450))};window.setTimeout(A,650)},si=d=>{const g=document.getElementById(`section-${d}`);g&&(Qi(d),qi(g))},Nr=d=>{var g,k;if(d==="menu"){const R=j.length>0?il:(g=rt[0])==null?void 0:g.id;if(R)return si(R)}if(d==="deals"&&j.length===0)return si((k=rt[0])==null?void 0:k.id);qi(document.getElementById(`section-${d}`))};v.useEffect(()=>{if(xe||at)return;let d=0;const g=()=>{d||(d=requestAnimationFrame(()=>{var A;d=0;const k=160;let R=(A=rt[0])==null?void 0:A.id;rt.forEach(Y=>{const te=document.getElementById(`section-${Y.id}`);te&&te.getBoundingClientRect().top<=k&&(R=Y.id)}),R&&Qi(R)}))};return g(),window.addEventListener("scroll",g,{passive:!0}),()=>{window.removeEventListener("scroll",g),cancelAnimationFrame(d)}},[rt,xe,at]),v.useEffect(()=>{const d=kn.current,g=d==null?void 0:d.querySelector(".is-active");if(d&&g){const k=g.offsetLeft-(d.clientWidth-g.offsetWidth)/2;d.scrollTo({left:Math.max(0,k),behavior:"auto"})}},[kr]);const Zr=d=>{const g=Vr.current;g&&g.scrollBy({left:d*(g.clientWidth*.8),behavior:"smooth"})};v.useEffect(()=>{const d=Vr.current;if(xe||j.length<2||Oo||!d||window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;const g=window.setInterval(()=>{const k=d.querySelector(".gzp-deal"),R=d.scrollWidth-d.clientWidth;if(!k||R<=0)return;const A=Number.parseFloat(window.getComputedStyle(d).columnGap)||0,Y=k.getBoundingClientRect().width+A;d.scrollLeft>=R-2?d.scrollTo({left:0,behavior:"smooth"}):d.scrollBy({left:Math.min(Y,R-d.scrollLeft),behavior:"smooth"})},4e3);return()=>window.clearInterval(g)},[j.length,Oo,xe]);const Er=ye||ve||ei||zn||!!G;v.useEffect(()=>(document.body.style.overflow=Er?"hidden":"",()=>{document.body.style.overflow=""}),[Er]),v.useEffect(()=>{const d=g=>{g.key==="Escape"&&(zn?Hr(!1):G?Ct(null):ve?ze(!1):ei?xt(!1):ye&&pe(!1))};return window.addEventListener("keydown",d),()=>window.removeEventListener("keydown",d)},[zn,G,ve,ei,ye]);const ci=v.useMemo(()=>{if(D.length>0)return D.map(k=>({url:dr(k.image),link:k.link||"",alt:k.altText||""}));const d=new Set,g=[];return[...j,...S].forEach(k=>{const R=dr(k.image);R&&!d.has(R)&&(d.add(R),g.push({url:R,link:"",alt:""}))}),g.slice(0,8)},[D,j,S]);v.useEffect(()=>{mr===al&&!fr.codEnabled&&fr.jazzcashEnabled&&ti(ll),mr===ll&&!fr.jazzcashEnabled&&fr.codEnabled&&ti(al)},[fr,mr]);const Mn=mr===ll&&fr.jazzcashEnabled,wl=!Wi&&je.ready&&(!Mn||dt.ready),Zi=async d=>{if(d.preventDefault(),!Ce.trim()){L("Enter a coupon code.");return}if(!je.ready){L(je.blocker||"Choose delivery or pickup before applying a coupon.");return}if(!Ks(ct.phone)){L("Enter a valid mobile number before applying a coupon.");return}Ne(!0),L("");try{const g=await of({code:Ce,phone:ct.phone,email:(l==null?void 0:l.email)||E||"",orderType:je.method,fulfillment:je.payload(),items:It.map(k=>k.type==="deal"?{dealId:k.item._id,quantity:k.qty}:{dishId:k.item._id,quantity:k.qty,size:k.size||void 0,crust:k.crust||void 0,byo:k.type==="byo"?!0:void 0})});Je(g.data),ie(g.data.code),L("Coupon applied successfully.")}catch(g){L(g.message||"Could not apply this coupon.")}finally{Ne(!1)}},di=async()=>{const d=me.trim();if(!d){H("Enter your mobile number or email address.");return}const g=d.includes("@");h(!0),H("");try{const R=(await af(g?{email:d.toLowerCase()}:{phone:d})).data;ie(R.code),g?ke(d.toLowerCase()):$t(Y=>({...Y,phone:d}));const A=new Intl.DateTimeFormat(void 0,{dateStyle:"medium",timeStyle:"short",timeZone:"UTC",timeZoneName:"short"}).format(new Date(R.expiresAt));H(`Your coupon is ready: ${R.code} (${R.discountPercentage}% off). Expires ${A}. Enter your cart details and apply it below.`)}catch(k){H(k.message||"A welcome coupon is not available for this account.")}finally{h(!1)}},Ji=async d=>{if(d.preventDefault(),!Ur.current&&It.length!==0){if(Gr){Me(J.enabled?`Build Your Own Deal needs at least ${J.minItems} items - add ${Cn} more or remove the deal.`:"Build Your Own Deal isn't available right now - please remove it from your order.");return}if(!Ks(ct.phone)){Me("That mobile number doesn't look complete. Use digits only, e.g. 03001234567.");return}if(!je.ready){Me(je.blocker||"Please choose delivery or pickup and fill in the details.");return}if(Mn&&!dt.ready){Me("Please add your Transaction ID, sender name/number and payment screenshot first.");return}Ur.current=!0,Kn(!0),Me("");try{const g={customerName:ct.name,customerPhone:ct.phone,...E?{customerEmail:E}:{},address:je.method==="delivery"?je.address:"",fulfillment:je.payload(),couponCode:V==null?void 0:V.code,...Mn?{paymentMethod:"jazzcash",tid:dt.tid,senderInfo:dt.sender,proofId:dt.proofId}:{paymentMethod:"cod"},items:It.map(A=>A.type==="deal"?{dealId:A.item._id,quantity:A.qty,dealSelections:A.dealSelections||void 0}:{dishId:A.item._id,quantity:A.qty,size:A.size||void 0,crust:A.crust||void 0,byo:A.type==="byo"?!0:void 0})},k=await nf(g,ef());vu();const R=k.data._id;localStorage.setItem("gzp_last_order",R),yn(R),er(k.data),Je(null),ie(""),L(""),bn(!0),wn(!1),dt.reset(),ge({}),ze(!1),pe(!1),window.scrollTo({top:0})}catch(g){(g.status===409||/Build Your Own/i.test(g.message||""))&&qr(),Me(g.message)}finally{Ur.current=!1,Kn(!1)}}},Uo=async()=>{if(!(!at||qn)){Wr(!0);try{const d=await wu(at);er(d.data)}catch(d){d.status===404&&(localStorage.removeItem("gzp_last_order"),yn(null),er(null))}finally{Wr(!1)}}},[Yt,ui]=v.useState(!1),pi=async()=>{if(!(!at||Yt)&&window.confirm("Cancel this order? You won't be charged anything.")){ui(!0);try{const d=await uf(at);er(g=>g&&{...g,orderStatus:d.data.orderStatus})}catch(d){window.alert(d.message||"Couldn't cancel the order — please call the shop.")}finally{ui(!1)}}},Wo=()=>{localStorage.removeItem("gzp_last_order"),yn(null),er(null)},fi=v.useCallback(()=>{localStorage.removeItem("gzp_last_order"),window.location.reload()},[]),mi=async d=>{d.preventDefault();const g=Fo.trim();if(g){if(!Ks(g)){ni("Enter the full mobile number you used at checkout, digits only.");return}Io(!0),ni("");try{const k=await pf(g);localStorage.setItem("gzp_last_order",k.data._id),yn(k.data._id),er(k.data),xt(!1),Vi("")}catch(k){ni(k.status===404?"No recent order on that number. Check the digits and try again.":k.message||"Couldn't reach the kitchen. Try again in a moment.")}finally{Io(!1)}}},Ho=()=>{const d={};return Object.entries(X).forEach(([g,k])=>{g.startsWith("byo:")&&k>0&&(d[g.slice(4)]=k)}),d},zt=d=>{const g={};Object.entries(Ae.current).forEach(([k,R])=>{k.startsWith("byo:")||(g[k]=R)}),Object.entries(d).forEach(([k,R])=>{R>0&&(g[`byo:${k}`]=R)}),Ae.current=g,ge(g),we(!1),pe(!0),Qt("Your custom deal is in your order")},Jr=()=>{const d={};Object.entries(Ae.current).forEach(([g,k])=>{g.startsWith("byo:")||(d[g]=k)}),Ae.current=d,ge(d)},Xi=d=>Object.entries(Ae.current).reduce((g,[k,R])=>k.startsWith(`dish:${d}:`)?g+R:g,0),Xr=d=>i.jsxs("div",{className:"gzp-line",children:[dr(d.item.image)?i.jsx("img",{src:dr(d.item.image),alt:d.item.name||"Menu item",loading:"lazy",decoding:"async",onError:g=>{g.currentTarget.style.display="none"}}):i.jsx("span",{className:"gzp-line-icon",children:i.jsx(ml,{icon:d.item.icon})}),i.jsxs("div",{className:"gzp-line-main",children:[i.jsxs("h4",{children:[d.type==="deal"&&i.jsx("span",{className:"gzp-tag",children:"DEAL"}),d.item.name]}),d.variantLabel&&i.jsx("p",{className:"gzp-line-variant",children:d.variantLabel}),i.jsx("span",{children:Ze(d.unitPrice*d.qty)})]}),i.jsx(ul,{qty:d.qty,label:d.item.name,onAdd:()=>xr(d.type,d.item._id,"",d.size,d.crust),onRemove:()=>_n(d.type,d.item._id,d.size,d.crust)})]},d.key);if(at&&!se)return i.jsxs("div",{className:"gzp-app",children:[i.jsx(Zs,{minimal:!0}),i.jsxs("div",{className:"gzp-boot",children:[i.jsx("img",{src:Gn,alt:""}),"Pulling up your order…"]})]});if(at&&(se==null?void 0:se.orderStatus)==="Completed")return i.jsx(uh,{order:se,onComplete:fi});if(at&&se&&yl)return i.jsx(dh,{order:se,onTrack:()=>bn(!1),onContinue:()=>{bn(!1),wn(!0)}});if(at&&se&&!Zn){const d=((Yo=se.payment)==null?void 0:Yo.method)==="JazzCash/Raast",g=d?nh:rh,k=g.indexOf(se.orderStatus),R=se.orderStatus==="Cancelled",A=String(se._id||"").slice(-6).toUpperCase(),Y=`https://wa.me/${Du}?text=${encodeURIComponent(`Hello GenZ Pizza Land, I need help with order #${A}.`)}`;return i.jsxs("div",{className:"gzp-app",children:[i.jsx(Zs,{minimal:!0}),i.jsx("div",{className:"gzp-shell",children:i.jsxs("section",{className:"gzp-track",children:[i.jsxs("div",{className:"gzp-track-hero",children:[i.jsxs("div",{className:"gzp-track-top",children:[i.jsxs("div",{style:{flex:1},children:[i.jsx("h1",{children:ih[se.orderStatus]||"Order status"}),i.jsxs("p",{className:"gzp-track-id",children:["Order #",String(se._id||"").slice(-6).toUpperCase()," for"," ",((Vo=se.customerDetails)==null?void 0:Vo.name)||"you"]})]}),i.jsx("button",{type:"button",className:"gzp-btn gzp-btn-ghost",onClick:Uo,disabled:qn,children:qn?"Checking…":"Refresh"})]}),i.jsx(Sm,{order:se,whatsappHref:Y}),R?d?null:i.jsx("p",{className:"gzp-cancelled",children:"This order was cancelled. Nothing has been charged — you can order again any time."}):i.jsxs(i.Fragment,{children:[i.jsx("p",{className:"gzp-eta",children:"This page updates itself every few seconds. Keep it open and watch it move."}),i.jsx("ol",{className:"gzp-steps",children:g.map((te,fe)=>i.jsx("li",{className:fe<k?"is-done":fe===k?"is-current":"",children:Eu[te]},te))}),se.orderStatus==="Pending"&&i.jsx("button",{type:"button",className:"gzp-btn gzp-btn-ghost",style:{marginTop:14,color:"#E6392F",borderColor:"#E6392F"},onClick:pi,disabled:Yt,children:Yt?"Cancelling…":"Cancel this order"})]})]}),i.jsxs("div",{className:"gzp-panel",children:[i.jsx("h3",{children:"What's coming"}),(se.items||[]).map((te,fe)=>{var Le;return i.jsxs("div",{children:[i.jsxs("div",{className:"gzp-order-line",children:[i.jsxs("span",{children:[te.isDeal&&i.jsx("span",{className:"gzp-tag",children:"DEAL"}),te.quantity,"× ",te.name]}),i.jsx("span",{children:Ze(te.price*te.quantity)})]}),te.isDeal&&((Le=te.dealItems)==null?void 0:Le.length)>0&&i.jsx("p",{className:"gzp-order-sub",children:te.dealItems.map(Qe=>`${Qe.quantity>1?Qe.quantity+"× ":""}${Qe.label}`).join(", ")})]},fe)}),i.jsxs("div",{className:"gzp-totals",style:{marginTop:14},children:[Number((Go=se.bills)==null?void 0:Go.deliveryFee)>0&&i.jsxs("div",{children:[i.jsx("span",{children:"Delivery fee"}),i.jsx("span",{children:Ze(se.bills.deliveryFee)})]}),Number((xi=se.bills)==null?void 0:xi.couponDiscount)>0&&i.jsxs("div",{className:"is-discount",children:[i.jsxs("span",{children:["Coupon ",(Ko=se.coupon)!=null&&Ko.code?`(${se.coupon.code})`:"discount"]}),i.jsxs("span",{children:["−",Ze(se.bills.couponDiscount)]})]}),Number((qo=se.bills)==null?void 0:qo.couponDeliveryDiscount)>0&&i.jsxs("div",{className:"is-discount",children:[i.jsx("span",{children:"Free delivery coupon"}),i.jsxs("span",{children:["−",Ze(se.bills.couponDeliveryDiscount)]})]}),i.jsxs("div",{className:"gzp-grand",children:[i.jsx("span",{children:d?((Zo=se.payment)==null?void 0:Zo.status)==="Verified"?"Paid via JazzCash/Raast":"Total (JazzCash/Raast)":((Jo=se.fulfillment)==null?void 0:Jo.method)==="pickup"?"Pay at pickup":"Pay on delivery"}),i.jsx("span",{children:Ze(((Xo=se.bills)==null?void 0:Xo.totalWithTax)||0)})]})]})]}),((ro=se.fulfillment)==null?void 0:ro.method)&&i.jsxs("div",{className:"gzp-panel",children:[i.jsx("h3",{children:se.fulfillment.method==="pickup"?"Pickup from":"Delivering to"}),i.jsxs("p",{style:{margin:0,color:"var(--flour-dim)",fontSize:"0.93rem",lineHeight:1.5},children:[se.fulfillment.method==="pickup"?se.fulfillment.branchName:(ea=se.customerDetails)==null?void 0:ea.address,se.fulfillment.method==="delivery"&&se.fulfillment.zoneName?` (${se.fulfillment.zoneName})`:"",se.fulfillment.method==="delivery"&&se.fulfillment.branchName?i.jsxs(i.Fragment,{children:[i.jsx("br",{}),"From ",se.fulfillment.branchName]}):null,((ta=se.fulfillment.estimatedMinutes)==null?void 0:ta.min)!=null&&i.jsxs(i.Fragment,{children:[i.jsx("br",{}),"Estimated ",se.fulfillment.method==="pickup"?"ready time":"arrival",": ",se.fulfillment.estimatedMinutes.min,"–",se.fulfillment.estimatedMinutes.max," min after confirmation"]})]})]}),i.jsxs("a",{className:"gzp-btn gzp-btn-ghost gzp-btn-block pay-help",href:Y,target:"_blank",rel:"noopener noreferrer",children:[i.jsx(q.Chat,{"aria-hidden":"true",style:{marginRight:8,verticalAlign:"-2px"}}),"Need help? Chat with us on WhatsApp"]}),i.jsx("button",{className:"gzp-btn gzp-btn-ghost gzp-btn-block",style:{marginTop:12},onClick:Wo,type:"button",children:"Start another order"})]})})]})}const eo=d=>{const g=[];for(let k=1;k<=5;k++)g.push(k<=Math.round(d));return g},to=d=>d?new Date(d).toLocaleDateString(void 0,{year:"numeric",month:"short",day:"numeric"}):"",hi=({review:d,size:g="small"})=>i.jsxs("article",{className:`gzp-review-card gzp-review-card--${g}`,role:"listitem",children:[i.jsxs("div",{className:"gzp-review-head",children:[i.jsxs("div",{children:[i.jsx("span",{className:"gzp-review-name",children:d.customerName}),d.verified&&i.jsxs("span",{className:"gzp-review-verified","aria-label":"Verified purchase",children:[i.jsx(IconCheck,{})," ",i.jsx("span",{className:"gzp-visually-hidden",children:"Verified purchase"})]})]}),i.jsxs("div",{className:"gzp-review-meta",children:[i.jsx("div",{className:"gzp-review-stars","aria-label":`Rating of ${d.rating} out of 5 stars`,children:eo(d.rating).map((k,R)=>i.jsx(IconStar,{filled:k,size:g==="large"?22:18},R))}),d.productName&&i.jsx("span",{className:"gzp-review-product",children:d.productName}),i.jsx("span",{className:"gzp-review-date",children:to(d.createdAt)})]})]}),i.jsx("p",{className:"gzp-review-text",children:d.reviewText})]}),Tn=()=>i.jsx("div",{className:"gzp-sheet-overlay",onClick:()=>zr(!1),children:i.jsxs("div",{className:"gzp-sheet",onClick:d=>d.stopPropagation(),role:"dialog","aria-modal":"true","aria-label":"Leave a review",children:[i.jsxs("div",{className:"gzp-sheet-head",children:[i.jsx("h2",{children:"Leave a Review"}),i.jsx("button",{className:"gzp-icon-btn",onClick:()=>zr(!1),"aria-label":"Close",type:"button",children:"✕"})]}),i.jsxs("div",{className:"gzp-sheet-body",children:[vn.type&&i.jsx("p",{className:`gzp-error ${vn.type==="success"?"gzp-review-success":""}`,role:"status","aria-live":"polite",children:vn.text}),i.jsxs("form",{onSubmit:handleSubmitReview,className:"gzp-review-form",children:[i.jsxs("div",{className:"gzp-form",children:[i.jsxs("label",{className:"gzp-field",children:[i.jsx("span",{children:"Your name or nickname"}),i.jsx("input",{required:!0,type:"text",maxLength:60,value:Rt.customerName,onChange:d=>Br({...Rt,customerName:d.target.value}),placeholder:"e.g. Ayesha"})]}),i.jsxs("label",{className:"gzp-field",children:[i.jsx("span",{children:"Your rating"}),i.jsx("div",{className:"gzp-rating-picker",role:"radiogroup","aria-label":"Select your rating",children:[5,4,3,2,1].map(d=>i.jsx("button",{type:"button",role:"radio","aria-checked":Rt.rating===d,"aria-label":`${d} star${d===1?"":"s"}`,className:`gzp-star-btn${Rt.rating===d?" is-active":""}`,onClick:()=>Br({...Rt,rating:d}),children:i.jsx(IconStar,{filled:Rt.rating>=d,size:24})},d))})]}),i.jsxs("label",{className:"gzp-field",children:[i.jsx("span",{children:"Your review"}),i.jsx("textarea",{required:!0,maxLength:1e3,value:Rt.reviewText,onChange:d=>Br({...Rt,reviewText:d.target.value}),rows:4,placeholder:"Tell us what you loved about your order…"})]}),i.jsxs("label",{className:"gzp-field",children:[i.jsx("span",{children:"Product (optional)"}),i.jsx("input",{type:"text",maxLength:120,value:Rt.productName,onChange:d=>Br({...Rt,productName:d.target.value}),placeholder:"e.g. Large Pepperoni Pizza"})]})]}),i.jsxs("div",{className:"gzp-review-form-foot",children:[i.jsx("button",{type:"button",className:"gzp-btn gzp-btn-ghost",onClick:()=>zr(!1),children:"Cancel"}),i.jsx("button",{type:"submit",className:"gzp-btn gzp-btn-primary",disabled:$r,children:$r?"Sending…":"Submit review"})]})]})]})]})}),gi=()=>i.jsx("section",{className:"gzp-all-reviews-page","aria-label":"All customer reviews",children:i.jsxs("div",{className:"gzp-shell",children:[i.jsxs("div",{className:"gzp-all-reviews-header",children:[i.jsx("button",{className:"gzp-btn gzp-btn-ghost",onClick:()=>Ui(!1),"aria-label":"Back to homepage",children:"← Back"}),i.jsxs("div",{className:"gzp-all-reviews-intro",children:[i.jsx("h2",{children:"Loved by Pizza Lovers"}),i.jsx("p",{children:"See what our customers have to say."})]}),Xt>0&&i.jsxs("div",{className:"gzp-all-reviews-stats",children:[i.jsx("span",{className:"gzp-all-reviews-average",children:gn.toFixed(1)}),i.jsx("div",{className:"gzp-all-reviews-stars","aria-hidden":"true",children:eo(gn).map((d,g)=>i.jsx(IconStar,{filled:d,size:32},g))}),i.jsxs("span",{className:"gzp-all-reviews-count",children:[Xt," review",Xt===1?"":"s"]})]})]}),i.jsx("div",{className:"gzp-all-reviews-grid",children:Te.length>0?i.jsx("ul",{role:"list",children:Te.map(d=>i.jsx(hi,{review:d,size:"large"},d._id))}):i.jsx("div",{className:"gzp-empty gzp-empty-reviews",children:i.jsx("p",{children:"No reviews yet. Be the first to share your experience."})})}),Xt>0&&i.jsx("div",{className:"gzp-all-reviews-foot",children:i.jsx("button",{className:"gzp-btn gzp-btn-primary",onClick:()=>zr(!0),children:"Write a review"})})]})}),Qo=()=>i.jsx("section",{className:"gzp-section gzp-reviews-section",id:"section-reviews","aria-label":"Customer reviews",children:i.jsxs("div",{className:"gzp-shell",children:[i.jsxs("div",{className:"gzp-reviews-header",children:[i.jsxs("div",{className:"gzp-reviews-intro",children:[i.jsx("h2",{children:"Loved by Pizza Lovers"}),i.jsx("p",{children:"See what our customers have to say."})]}),Xt>0&&i.jsxs("div",{className:"gzp-reviews-stats",children:[i.jsx("span",{className:"gzp-stats-average",children:gn.toFixed(1)}),i.jsx("div",{className:"gzp-stats-stars","aria-hidden":"true",children:eo(gn).map((d,g)=>i.jsx(IconStar,{filled:d,size:20},g))}),i.jsxs("span",{className:"gzp-stats-count",children:[Xt," review",Xt===1?"":"s"]})]}),i.jsx("button",{className:"gzp-btn gzp-btn-ghost",onClick:()=>zr(!0),children:"Write a review"})]}),i.jsx("div",{className:"gzp-reviews-grid",children:Te.length>0?i.jsx("ul",{role:"list",children:Te.map(d=>i.jsx(hi,{review:d,size:"small"},d._id))}):i.jsx("div",{className:"gzp-empty gzp-empty-reviews",children:i.jsx("p",{children:"No reviews yet. Be the first to share your experience."})})}),i.jsx("div",{className:"gzp-reviews-foot",children:i.jsx("button",{className:"gzp-btn gzp-btn-outline",onClick:()=>Ui(!0),children:"Read All Reviews"})})]})});return i.jsxs("div",{className:"gzp-app",children:[i.jsx(Zs,{cartCount:gr,customer:l,onAccount:()=>y(!0),onSearch:()=>Hr(!0),onCart:()=>pe(!0),onNavigate:Nr,onTrack:()=>xt(!0)}),i.jsx(Gm,{customer:l,setCustomer:u,open:c,setOpen:y}),Zn&&Hi&&i.jsxs("div",{className:"gzp-tracking-banner",children:[i.jsxs("span",{children:["Order #",String(se._id||"").slice(-6).toUpperCase()," — ",Eu[se.orderStatus]||se.orderStatus]}),i.jsx("button",{type:"button",onClick:()=>wn(!1),children:"Track it"})]}),Pe&&!ve&&i.jsx("div",{className:"gzp-shell",children:i.jsx("p",{className:"gzp-error gzp-error-banner",children:Pe})}),i.jsx(Nm,{summary:To,onOrder:()=>Nr("menu"),onTrack:()=>xt(!0)}),i.jsx("section",{className:"gzp-hero",children:i.jsx(ch,{slides:ci,onSlideClick:d=>{var g;d!=null&&d.link?window.open(d.link,"_blank","noopener,noreferrer"):si((g=rt[0])==null?void 0:g.id)}})}),!xe&&rt.length>0&&i.jsx("nav",{className:"gzp-navbar","aria-label":"Menu sections",children:i.jsx("div",{className:"gzp-navbar-inner",children:i.jsx("div",{className:"gzp-navbar-chips",ref:kn,children:rt.map(d=>i.jsx("button",{type:"button",className:`gzp-chip${kr===d.id?" is-active":""}`,onClick:()=>si(d.id),children:d.name},d.id))})})}),i.jsxs("div",{className:"gzp-shell",children:[xe?i.jsxs("section",{className:"gzp-section",children:[i.jsxs("div",{className:"gzp-section-head",children:[i.jsx("h2",{children:"Loading the menu"}),i.jsx("div",{className:"gzp-section-rule"})]}),i.jsx("div",{className:"gzp-grid",children:Array.from({length:8}).map((d,g)=>i.jsx(fh,{},g))})]}):i.jsxs(i.Fragment,{children:[J.enabled&&S.length>0&&i.jsx(Um,{cfg:J,pickedCount:Wt,onStart:()=>we(!0)}),j.length>0&&i.jsxs("section",{className:"gzp-section",id:`section-${il}`,children:[i.jsxs("div",{className:"gzp-section-head",children:[i.jsx("h2",{children:"Today's deals"}),i.jsxs("span",{className:"gzp-section-count",children:[j.length," bundle",j.length===1?"":"s"]}),i.jsx("div",{className:"gzp-section-rule"}),i.jsxs("div",{className:"gzp-rail-nav",children:[i.jsx("button",{className:"gzp-rail-btn",onClick:()=>Zr(-1),"aria-label":"Scroll deals back",type:"button",children:i.jsx(qs,{dir:"left"})}),i.jsx("button",{className:"gzp-rail-btn",onClick:()=>Zr(1),"aria-label":"Scroll deals forward",type:"button",children:i.jsx(qs,{})})]})]}),i.jsx("div",{className:"gzp-rail-wrap",children:i.jsx("div",{className:"gzp-rail",ref:Vr,onMouseEnter:()=>jr(!0),onMouseLeave:()=>jr(!1),onFocus:()=>jr(!0),onBlur:d=>{d.currentTarget.contains(d.relatedTarget)||jr(!1)},onPointerDown:d=>{d.pointerType!=="mouse"&&jr(!0)},onPointerUp:d=>{d.pointerType!=="mouse"&&jr(!1)},children:j.map(d=>{var R,A,Y;const g=Sr("deal",d._id),k=d.originalPrice>d.price?Math.round((d.originalPrice-d.price)/d.originalPrice*100):0;return i.jsxs("div",{className:"gzp-deal",role:"button",tabIndex:0,onClick:()=>Ct({type:"deal",item:d}),onKeyDown:te=>te.key==="Enter"&&Ct({type:"deal",item:d}),children:[i.jsxs("div",{className:"gzp-deal-media",children:[i.jsx(nc,{src:dr(d.image),alt:d.name,icon:d.icon||"flame"}),d.badge&&i.jsx("span",{className:"gzp-badge",children:d.badge}),k>0&&i.jsxs("span",{className:"gzp-save",children:["Save ",k,"%"]}),Vn(d.availableQty)&&i.jsx("span",{className:`gzp-stock${Vn(d.availableQty).out?" is-out":""}`,children:Vn(d.availableQty).text})]}),i.jsxs("div",{className:"gzp-deal-body",children:[i.jsx("h3",{children:d.name}),((R=d.items)==null?void 0:R.length)>0?i.jsxs("ul",{className:"gzp-deal-contents",children:[d.items.slice(0,3).map((te,fe)=>i.jsxs("li",{children:[te.quantity>1?`${te.quantity}× `:"",te.label]},fe)),d.items.length>3&&i.jsxs("li",{className:"gzp-deal-more",children:["+",d.items.length-3," more in the box"]})]}):d.description&&i.jsx("p",{className:"gzp-deal-desc",children:d.description}),i.jsxs("div",{className:"gzp-deal-foot",onClick:te=>te.stopPropagation(),role:"presentation",children:[i.jsx(dl,{price:d.price,originalPrice:d.originalPrice}),X[g]&&!hr(d)?i.jsx(ul,{qty:X[g],label:d.name,onAdd:()=>xr("deal",d._id),onRemove:()=>_n("deal",d._id)}):i.jsx("button",{type:"button",className:"gzp-add gzp-add-wide",disabled:(A=Vn(d.availableQty))==null?void 0:A.out,onClick:()=>hr(d)?Ct({type:"deal",item:d}):xr("deal",d._id,d.name),children:(Y=Vn(d.availableQty))!=null&&Y.out?"Sold out":hr(d)?"Choose & add":"Add deal"})]})]})]},d._id)})})})]}),ii.map(d=>i.jsxs("section",{className:"gzp-section",id:`section-${d.id}`,children:[i.jsxs("div",{className:"gzp-section-head",children:[i.jsx("h2",{children:d.name}),i.jsxs("span",{className:"gzp-section-count",children:[d.items.length," items"]}),i.jsx("div",{className:"gzp-section-rule"})]}),i.jsx("div",{className:"gzp-grid",children:d.items.map(g=>i.jsx(ph,{dish:g,cart:X,cartKey:Sr,addToCart:xr,removeFromCart:_n,onOpenQuickView:k=>Ct({type:"dish",item:k})},g._id))})]},d.id)),ii.length===0&&j.length===0&&i.jsx("section",{className:"gzp-section",children:i.jsxs("div",{className:"gzp-empty",children:[i.jsx("img",{src:Gn,alt:"",className:"gzp-empty-logo"}),"The menu is being set up right now. Check back in a little while."]})})]}),i.jsx(Pm,{}),i.jsx(Qo,{onSummary:Ro}),i.jsx(_m,{}),i.jsx(Mm,{whatsappLink:Au,onTrack:()=>xt(!0)})]}),i.jsx(Tm,{taxRatePercent:B,onNavigate:Nr,onTrack:()=>xt(!0)}),gr>0&&!ye&&!ve&&i.jsxs("button",{className:"gzp-cartbar",onClick:()=>pe(!0),type:"button",children:[i.jsxs("span",{className:"gzp-cartbar-label",children:[i.jsxs("small",{children:[gr," item",gr===1?"":"s"," in your order"]}),i.jsx("b",{children:Ze(En)})]}),i.jsx("span",{className:"gzp-cartbar-cta",children:"View order"})]}),i.jsx(mh,{}),_o&&i.jsxs("div",{className:"gzp-toast",role:"status",children:[i.jsx("i",{children:i.jsx(q.Check,{})}),_o]}),zn&&i.jsxs("div",{className:"gzp-search",onClick:()=>Hr(!1),children:[i.jsxs("div",{className:"gzp-search-bar",onClick:d=>d.stopPropagation(),children:[i.jsx($u,{}),i.jsx("input",{autoFocus:!0,value:Qr,onChange:d=>Po(d.target.value),placeholder:"Search for a pizza, burger or deal","aria-label":"Search the menu"}),i.jsx("button",{className:"gzp-btn gzp-btn-ghost",onClick:()=>Hr(!1),type:"button",children:"Close"})]}),i.jsxs("div",{className:"gzp-search-results",onClick:d=>d.stopPropagation(),children:[Qr.trim()&&Do.length===0&&i.jsxs("p",{className:"gzp-search-empty",children:["Nothing matches “",Qr.trim(),"”. Try a shorter word, like “pizza”."]}),Do.map(({type:d,item:g})=>{var k;return i.jsxs("button",{className:"gzp-result",type:"button",onClick:()=>{Hr(!1),Ct({type:d,item:g})},children:[dr(g.image)?i.jsx("img",{src:dr(g.image),alt:g.name||"Menu item",loading:"lazy",decoding:"async",onError:R=>{R.currentTarget.style.display="none"}}):i.jsx("span",{className:"gzp-result-icon",children:i.jsx(ml,{icon:g.icon})}),i.jsxs("span",{className:"gzp-result-name",children:[g.name,i.jsx("span",{className:"gzp-result-cat",children:d==="deal"?"Deal":bl[((k=g.category)==null?void 0:k._id)||g.category]||"Menu"})]}),i.jsx(dl,{price:g.price})]},`${d}-${g._id}`)})]})]}),G&&i.jsx("div",{className:"gzp-overlay",onClick:()=>Ct(null),children:i.jsxs("div",{className:"gzp-modal",onClick:d=>d.stopPropagation(),role:"dialog","aria-label":G.item.name,children:[i.jsxs("div",{className:"gzp-modal-media",children:[i.jsx(nc,{src:dr(G.item.image),alt:G.item.name,icon:G.item.icon}),G.item.badge&&i.jsx("span",{className:"gzp-badge",children:G.item.badge}),i.jsx("button",{className:"gzp-modal-close",onClick:()=>Ct(null),"aria-label":"Close",type:"button",children:i.jsx(q.Close,{"aria-hidden":"true"})})]}),i.jsxs("div",{className:"gzp-modal-body",children:[i.jsx("h2",{children:G.item.name}),G.type==="deal"&&((ra=G.item.items)==null?void 0:ra.length)>0&&i.jsx("ul",{className:"gzp-deal-contents",children:G.item.items.map((d,g)=>d.customizable?null:i.jsxs("li",{children:[d.quantity>1?`${d.quantity}× `:"",d.label]},g))}),G.type==="deal"&&((na=G.item.items)==null?void 0:na.map((d,g)=>{var nt,et,Pr;if(!d.customizable)return null;const k=d.flavourOptions||[],R=pr[g]||{},A=[...new Map(k.map(oe=>{var Re,Se;return[((Re=oe.category)==null?void 0:Re._id)||"",((Se=oe.category)==null?void 0:Se.name)||"Choose"]}))],Y=((et=(nt=k.find(oe=>oe._id===R.dishId))==null?void 0:nt.category)==null?void 0:et._id)||((Pr=A[0])==null?void 0:Pr[0])||"",te=k.filter(oe=>{var Re;return(((Re=oe.category)==null?void 0:Re._id)||"")===Y}),fe=k.find(oe=>oe._id===R.dishId),Le=[...new Set(((fe==null?void 0:fe.variants)||[]).map(oe=>oe.size))],Qe=((fe==null?void 0:fe.variants)||[]).filter(oe=>oe.size===R.size&&oe.crust),Ye=oe=>Yr(Re=>({...Re,[g]:{...Re[g],...oe}}));return i.jsxs("div",{className:"gzp-deal-choice",children:[i.jsxs("p",{className:"gzp-deal-choice-label",children:[d.quantity>1?`${d.quantity}× `:"",d.label," — pick yours"]}),i.jsxs("div",{className:"gzp-variant-row",children:[A.length>1&&i.jsx("select",{className:"gzp-select",value:Y,onChange:oe=>{var Ge;const Re=k.find(it=>{var en;return(((en=it.category)==null?void 0:en._id)||"")===oe.target.value}),Se=(Ge=Re==null?void 0:Re.variants)==null?void 0:Ge[0];Ye({dishId:(Re==null?void 0:Re._id)||"",size:(Se==null?void 0:Se.size)||"",crust:(Se==null?void 0:Se.crust)||""})},"aria-label":`Category for ${d.label}`,children:A.map(([oe,Re])=>i.jsx("option",{value:oe,children:Re},oe))}),i.jsxs("select",{className:"gzp-select",value:R.dishId||"",onChange:oe=>{var Ge;const Re=k.find(it=>it._id===oe.target.value),Se=(Ge=Re==null?void 0:Re.variants)==null?void 0:Ge[0];Ye({dishId:(Re==null?void 0:Re._id)||"",size:(Se==null?void 0:Se.size)||"",crust:(Se==null?void 0:Se.crust)||""})},"aria-label":`Flavour for ${d.label}`,children:[te.length===0&&i.jsx("option",{value:"",children:"No flavours available"}),te.map(oe=>i.jsx("option",{value:oe._id,children:oe.name},oe._id))]}),Le.length>0&&i.jsx("select",{className:"gzp-select",value:R.size||"",onChange:oe=>{var Se;const Re=((fe==null?void 0:fe.variants)||[]).filter(Ge=>Ge.size===oe.target.value&&Ge.crust);Ye({size:oe.target.value,crust:Re.some(Ge=>Ge.crust===R.crust)?R.crust:((Se=Re[0])==null?void 0:Se.crust)||""})},"aria-label":`Size for ${d.label}`,children:Le.map(oe=>i.jsx("option",{value:oe,children:oe},oe))}),Qe.length>0&&i.jsx("select",{className:"gzp-select",value:R.crust||"",onChange:oe=>Ye({crust:oe.target.value}),"aria-label":`Crust for ${d.label}`,children:Qe.map(oe=>i.jsx("option",{value:oe.crust,children:oe.crust},oe.crust))})]})]},g)})),G.item.description&&i.jsx("p",{className:"gzp-deal-desc",children:G.item.description}),(()=>{const d=G.type==="dish",g=G.type==="deal",k=d?tc(G.item):[],R=k.length>0,A=d?cl(G.item,Ut):[],Y=R?rc(G.item,Ut,Ft):null,te=R?Bu(G.item):null,fe=R?(Y==null?void 0:Y.price)??(te==null?void 0:te.price)??G.item.price:G.item.price,Le=R?(Y==null?void 0:Y.originalPrice)??0:G.item.originalPrice,Qe=g&&hr(G.item),Ye=!Qe||(G.item.items||[]).every((Se,Ge)=>{var Rn;if(!Se.customizable)return!0;const it=pr[Ge];if(!(it!=null&&it.dishId))return!1;const en=(Se.flavourOptions||[]).find(zl=>zl._id===it.dishId);return((Rn=en==null?void 0:en.variants)==null?void 0:Rn.length)>0?!!it.size:!0}),nt=Qe?Sr(G.type,G.item._id,jn(pr)):Sr(G.type,G.item._id,Ut,Ft),et=X[nt]||0,Pr=(d?S:j).find(Se=>Se._id===G.item._id)||G.item,oe=Vn(Pr.availableQty),Re=(!R||!!Y)&&Ye&&!(oe!=null&&oe.out);return i.jsxs(i.Fragment,{children:[i.jsx(dl,{price:fe,originalPrice:Le,from:R}),oe&&i.jsx("p",{className:`gzp-stock-note${oe.out?" is-out":""}`,children:oe.text}),R&&i.jsxs("div",{className:"gzp-variant-row",children:[i.jsx("select",{className:"gzp-select",value:Ut,onChange:Se=>{const Ge=Se.target.value;Xn(Ge);const it=cl(G.item,Ge);ur(it.includes(Ft)?Ft:it[0]||"")},"aria-label":`Size for ${G.item.name}`,children:k.map(Se=>i.jsx("option",{value:Se,children:Se},Se))}),A.length>0&&i.jsx("select",{className:"gzp-select",value:Ft,onChange:Se=>ur(Se.target.value),"aria-label":`Crust for ${G.item.name}`,children:A.map(Se=>i.jsx("option",{value:Se,children:Se},Se))})]}),i.jsx("div",{className:"gzp-modal-foot",children:et?i.jsxs(i.Fragment,{children:[i.jsx(ul,{size:"lg",label:G.item.name,qty:et,onAdd:()=>Qe?xr(G.type,G.item._id,"","","",pr):xr(G.type,G.item._id,"",Ut,Ft),onRemove:()=>{const[,,Se]=nt.split(":"),[Ge,it]=Se.split("||");_n(G.type,G.item._id,Ge,it)}}),i.jsx("button",{className:"gzp-btn gzp-btn-primary",onClick:()=>{Ct(null),pe(!0)},type:"button",children:"View order"})]}):i.jsxs("button",{className:"gzp-btn gzp-btn-primary gzp-btn-split",disabled:!Re,onClick:()=>{Qe?xr(G.type,G.item._id,G.item.name,"","",pr):xr(G.type,G.item._id,G.item.name,Ut,Ft),Ct(null)},type:"button",children:[i.jsx("span",{children:oe!=null&&oe.out?"Sold out":Qe&&!Ye?"Choose your options":"Add to order"}),i.jsx("span",{children:Ze(fe)})]})})]})})()]})]})}),P&&i.jsx(Ym,{cfg:J,dishes:S,categories:z,initialPicks:Ho(),getOtherQty:Xi,onClose:()=>we(!1),onConfirm:zt}),ye&&i.jsx("div",{className:"gzp-sheet-overlay",onClick:()=>pe(!1),children:i.jsxs("div",{className:"gzp-sheet",onClick:d=>d.stopPropagation(),role:"dialog","aria-label":"Your order",children:[i.jsxs("div",{className:"gzp-sheet-head",children:[i.jsx("h2",{children:"Your order"}),i.jsx("button",{className:"gzp-icon-btn",onClick:()=>pe(!1),"aria-label":"Close",type:"button",children:i.jsx(q.Close,{"aria-hidden":"true"})})]}),It.length===0?i.jsxs("div",{className:"gzp-sheet-body",children:[i.jsxs("div",{className:"gzp-empty",children:[i.jsx("span",{children:i.jsx(q.Cart,{"aria-hidden":"true"})}),"Nothing here yet. Add a deal or a pizza and it'll show up."]}),i.jsx("button",{className:"gzp-btn gzp-btn-primary",onClick:()=>pe(!1),type:"button",children:"Back to the menu"})]}):i.jsxs(i.Fragment,{children:[i.jsxs("div",{className:"gzp-sheet-body",children:[It.filter(d=>d.type!=="byo").map(Xr),ai.length>0&&i.jsxs("div",{className:"gzp-byo-cart",children:[i.jsxs("div",{className:"gzp-byo-cart-head",children:[i.jsxs("h4",{children:[i.jsx(q.Target,{"aria-hidden":"true",style:{marginRight:6,verticalAlign:"-2px"}}),"Your custom deal"]}),i.jsx("button",{type:"button",onClick:()=>{pe(!1),we(!0)},children:"Edit"})]}),i.jsx("p",{className:`gzp-byo-cart-note${Cn>0||!J.enabled?" is-warn":""}`,children:J.enabled?Fu(Wt,J):"This deal isn't available right now."}),ai.map(Xr),tr>0&&i.jsxs("p",{className:"gzp-byo-cart-saving",children:["You save ",i.jsx("b",{children:Ze(tr)})," (",Sn,"% off ",Wt," items)"]})]})]}),i.jsxs("div",{className:"gzp-sheet-foot",children:[i.jsxs("div",{className:"gzp-totals",children:[i.jsxs("div",{children:[i.jsx("span",{children:"Subtotal"}),i.jsx("span",{children:Ze(Ao)})]}),tr>0&&i.jsxs("div",{className:"is-discount",children:[i.jsxs("span",{children:["Custom deal discount (",Sn,"%)"]}),i.jsxs("span",{children:["−",Ze(tr)]})]}),Kr>0&&i.jsxs("div",{className:"is-discount",children:[i.jsxs("span",{children:["Coupon ",V!=null&&V.code?`(${V.code})`:"discount"]}),i.jsxs("span",{children:["−",Ze(Kr)]})]}),i.jsxs("div",{children:[i.jsxs("span",{children:["Tax (",B,"%)"]}),i.jsx("span",{children:Ze(Gi)})]}),i.jsxs("div",{children:[i.jsx("span",{children:"Delivery"}),i.jsx("span",{children:"Chosen at checkout"})]}),i.jsxs("div",{className:"gzp-grand",children:[i.jsx("span",{children:"Total"}),i.jsx("span",{children:Ze(En)})]})]}),Gr&&i.jsx("p",{className:"gzp-byo-warn",children:J.enabled?`Your custom deal needs ${Cn} more item${Cn===1?"":"s"} to qualify. Add more or remove the deal to continue.`:"The custom deal isn't available right now. Remove it to continue."}),i.jsx("button",{className:"gzp-btn gzp-btn-primary gzp-btn-block",onClick:()=>{pe(!1),ze(!0)},disabled:Gr,type:"button",children:"Choose delivery or pickup"}),Gr&&i.jsx("button",{type:"button",className:"gzp-btn gzp-btn-ghost gzp-btn-block",style:{marginTop:8},onClick:()=>{J.enabled?(pe(!1),we(!0)):Jr()},children:J.enabled?"Add more items to my deal":"Remove custom deal"})]})]})]})}),ve&&i.jsx("div",{className:"gzp-sheet-overlay",onClick:()=>ze(!1),children:i.jsxs("div",{className:"gzp-sheet",onClick:d=>d.stopPropagation(),role:"dialog","aria-label":"Delivery or pickup details",children:[i.jsxs("div",{className:"gzp-sheet-head",children:[i.jsx("button",{className:"gzp-icon-btn",onClick:()=>{ze(!1),pe(!0)},"aria-label":"Back to your order",type:"button",children:i.jsx(qs,{dir:"left"})}),i.jsx("h2",{children:"Delivery or pickup"})]}),i.jsxs("form",{onSubmit:Ji,style:{display:"contents"},children:[i.jsx("div",{className:"gzp-sheet-body",children:i.jsxs("div",{className:"gzp-form",children:[i.jsx(Am,{f:je}),i.jsxs("label",{className:"gzp-field",children:[i.jsx("span",{children:"Your name"}),i.jsx("input",{required:!0,value:ct.name,onChange:d=>$t({...ct,name:d.target.value})})]}),i.jsxs("label",{className:"gzp-field",children:[i.jsx("span",{children:"Mobile number"}),i.jsx("input",{required:!0,type:"tel",inputMode:"numeric",pattern:"[0-9+]*",maxLength:14,value:ct.phone,onChange:d=>$t({...ct,phone:ol(d.target.value)}),onPaste:d=>{d.preventDefault();const g=(d.clipboardData||window.clipboardData).getData("text");$t(k=>({...k,phone:ol(k.phone+g)}))},placeholder:"03001234567"})]}),i.jsxs("div",{style:{border:"1px solid var(--line)",borderRadius:12,padding:14},children:[i.jsxs("div",{className:"gzp-form",style:{marginBottom:14},children:[i.jsxs("label",{className:"gzp-field",htmlFor:"welcome-coupon-identity",children:[i.jsx("span",{children:"New customer? Check for a welcome coupon"}),i.jsxs("div",{style:{display:"flex",gap:8},children:[i.jsx("input",{id:"welcome-coupon-identity",value:me,onChange:d=>ne(d.target.value),autoComplete:"email tel",placeholder:"Mobile number or email",style:{flex:1,minWidth:0}}),i.jsx("button",{type:"button",className:"gzp-btn gzp-btn-ghost",onClick:di,disabled:U,children:U?"Checking…":"Check coupon"})]})]}),T&&i.jsx("p",{role:"status",children:T})]}),i.jsxs("label",{className:"gzp-field",htmlFor:"checkout-coupon-code",children:[i.jsx("span",{children:"Coupon code"}),i.jsxs("div",{style:{display:"flex",gap:8},children:[i.jsx("input",{id:"checkout-coupon-code",value:Ce,onChange:d=>ie(d.target.value.toUpperCase()),autoComplete:"off",maxLength:40,placeholder:"Enter coupon code",style:{flex:1,minWidth:0}}),i.jsx("button",{type:"button",className:"gzp-btn gzp-btn-ghost",onClick:Zi,disabled:W||!je.ready,children:W?"Checking…":V?"Replace":"Apply"})]})]}),V&&i.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",gap:8},children:[i.jsxs("small",{className:"gzp-success",children:[V.code," applied · save ",Ze(V.totalDiscount)]}),i.jsx("button",{type:"button",className:"gzp-btn gzp-btn-ghost",onClick:()=>{Je(null),L("")},children:"Remove"})]}),$&&i.jsx("p",{className:V?"gzp-success":"gzp-error",role:"status",children:$})]}),i.jsx(km,{cfg:fr,value:mr,onChange:ti,pickup:je.method==="pickup",showCashDescription:((ia=(vi=je.branch)==null?void 0:vi.customerDisplay)==null?void 0:ia.showCashPaymentNote)!==!1}),Mn?i.jsx(jm,{cfg:fr,amountLabel:Ze(nr),jazz:dt}):((aa=(oa=je.branch)==null?void 0:oa.customerDisplay)==null?void 0:aa.showCashPaymentNote)!==!1?i.jsxs("p",{className:"gzp-note",children:[i.jsx(Uu,{}),i.jsx("span",{children:je.method==="pickup"?i.jsxs(i.Fragment,{children:[i.jsx("b",{children:"Pay at pickup."})," Pay at the counter."]}):i.jsxs(i.Fragment,{children:[i.jsx("b",{children:"Cash on delivery."})," Pay the rider when the food arrives. We'll call this number if we can't find the address."]})})]}):null,Pe&&i.jsx("p",{className:"gzp-error",children:Pe})]})}),i.jsxs("div",{className:"gzp-sheet-foot",children:[i.jsxs("div",{className:"gzp-totals",children:[i.jsxs("div",{children:[i.jsx("span",{children:"Subtotal + tax"}),i.jsx("span",{children:Ze(En)})]}),Kr>0&&i.jsxs("div",{className:"is-discount",children:[i.jsxs("span",{children:["Coupon ",V!=null&&V.code?`(${V.code})`:"discount"]}),i.jsxs("span",{children:["−",Ze(Kr)]})]}),li>0&&i.jsxs("div",{className:"is-discount",children:[i.jsx("span",{children:"Free delivery"}),i.jsxs("span",{children:["−",Ze(li)]})]}),((la=(no=je.branch)==null?void 0:no.customerDisplay)==null?void 0:la.showDeliveryFees)===!0&&i.jsxs("div",{children:[i.jsx("span",{children:je.method==="pickup"?"Pickup":"Delivery fee"}),i.jsx("span",{children:(sa=je.quote)!=null&&sa.ok?Pn>0?Ze(Pn):"Free":"—"})]}),i.jsxs("div",{className:"gzp-grand",children:[i.jsx("span",{children:"Total to pay"}),i.jsx("span",{children:Ze(nr)})]})]}),i.jsx("button",{type:"submit",className:"gzp-btn gzp-btn-primary gzp-btn-block",disabled:!wl,"aria-label":!je.ready&&((ca=je.blocker)!=null&&ca.includes("is closed right now."))?je.blocker:void 0,children:Wi?"Sending to the kitchen…":je.ready?Mn&&!dt.ready?dt.uploading?"Uploading screenshot…":"Add payment details to continue":"Place order":je.quoting?"Checking…":(da=je.blocker)!=null&&da.includes("is closed right now.")?"Restaurant closed":je.method==="delivery"?"Complete delivery details":"Check pickup details"})]})]})]})}),ei&&i.jsx("div",{className:"gzp-sheet-overlay",onClick:()=>xt(!1),children:i.jsxs("div",{className:"gzp-sheet",onClick:d=>d.stopPropagation(),role:"dialog","aria-label":"Track your order",children:[i.jsxs("div",{className:"gzp-sheet-head",children:[i.jsx("h2",{children:"Track your order"}),i.jsx("button",{className:"gzp-icon-btn",onClick:()=>xt(!1),"aria-label":"Close",type:"button",children:i.jsx(q.Close,{"aria-hidden":"true"})})]}),i.jsxs("form",{onSubmit:mi,style:{display:"contents"},children:[i.jsx("div",{className:"gzp-sheet-body",children:i.jsxs("div",{className:"gzp-form",children:[i.jsxs("label",{className:"gzp-field",children:[i.jsx("span",{children:"Mobile number used at checkout"}),i.jsx("input",{required:!0,autoFocus:!0,type:"tel",inputMode:"numeric",pattern:"[0-9+]*",maxLength:14,value:Fo,onChange:d=>Vi(ol(d.target.value)),onPaste:d=>{d.preventDefault();const g=(d.clipboardData||window.clipboardData).getData("text");Vi(k=>ol(k+g))},placeholder:"03001234567"})]}),ri&&i.jsx("p",{className:"gzp-error",children:ri})]})}),i.jsx("div",{className:"gzp-sheet-foot",children:i.jsx("button",{type:"submit",className:"gzp-btn gzp-btn-primary gzp-btn-block",disabled:He,children:He?"Looking…":"Find my order"})})]})]})}),No&&i.jsx(Tn,{}),Eo&&i.jsx(gi,{})]})}function gh(){const[l,u]=v.useState(window.location.pathname.replace(/\/+$/,"")||"/");return v.useEffect(()=>{const c=()=>u(window.location.pathname.replace(/\/+$/,"")||"/");return window.addEventListener("popstate",c),()=>window.removeEventListener("popstate",c)},[]),v.useEffect(()=>{const y={"/":{title:"Pizza, Burgers & Deals in Gojra | GenZ Pizza Land",description:"Order fresh pizza, burgers and deals online from GenZ Pizza Land in Gojra. Choose delivery or pickup, pay at the door or by JazzCash/Raast.",canonical:"https://genzpizza.muscatfood.com/",robots:"index,follow"},"/privacy":{title:"Privacy Policy | GenZ Pizza Land",description:"Learn how GenZ Pizza Land uses and protects information for online orders, customer accounts, payment verification and reviews.",canonical:"https://genzpizza.muscatfood.com/privacy",robots:"index,follow",label:"Privacy Policy"},"/terms":{title:"Terms and Conditions | GenZ Pizza Land",description:"Read the terms for ordering online from GenZ Pizza Land, including order availability, delivery, pickup, payments and cancellations.",canonical:"https://genzpizza.muscatfood.com/terms",robots:"index,follow",label:"Terms and Conditions"},"/help":{title:"Customer Help | GenZ Pizza Land",description:"Get help with placing an order, delivery and pickup, payments, order tracking, changes and order issues.",canonical:"https://genzpizza.muscatfood.com/help",robots:"index,follow",label:"Customer Help"}}[l]||{title:"Page Not Found | GenZ Pizza Land",description:"The page you requested could not be found. Return to the GenZ Pizza Land online store.",canonical:"",robots:"noindex,nofollow"};document.title=y.title;const z=(O,j,ae)=>{let D=document.head.querySelector(O);D||(D=document.createElement("meta"),Object.entries(j).forEach(([N,B])=>D.setAttribute(N,B)),document.head.appendChild(D)),D.setAttribute("content",ae)};z('meta[name="description"]',{name:"description"},y.description),z('meta[name="robots"]',{name:"robots"},y.robots),z('meta[property="og:title"]',{property:"og:title"},y.title),z('meta[property="og:description"]',{property:"og:description"},y.description),z('meta[property="og:url"]',{property:"og:url"},y.canonical||`https://genzpizza.muscatfood.com${l}`);let C=document.head.querySelector('link[rel="canonical"]');y.canonical?(C||(C=document.createElement("link"),C.rel="canonical",document.head.appendChild(C)),C.href=y.canonical):C==null||C.remove();let S=document.getElementById("gzp-structured-data");y.canonical?(S||(S=document.createElement("script"),S.id="gzp-structured-data",S.type="application/ld+json",document.head.appendChild(S)),S.textContent=JSON.stringify(l==="/"?{"@context":"https://schema.org","@type":"Restaurant",name:"GenZ Pizza Land",url:y.canonical,servesCuisine:["Pizza","Burgers","Fast Food"],address:{"@type":"PostalAddress",addressLocality:"Gojra",addressCountry:"PK"}}:{"@context":"https://schema.org","@type":"BreadcrumbList",itemListElement:[{"@type":"ListItem",position:1,name:"Home",item:"https://genzpizza.muscatfood.com/"},{"@type":"ListItem",position:2,name:y.label,item:y.canonical}]})):S==null||S.remove()},[l]),v.useEffect(()=>{},[l]),l==="/"?i.jsx(hh,{}):l==="/privacy"?i.jsx(Km,{}):l==="/terms"?i.jsx(qm,{}):l==="/help"?i.jsx(Zm,{}):i.jsx(Jm,{})}class xh extends Ar.Component{constructor(c){super(c);su(this,"handleReload",()=>{try{localStorage.removeItem("gzp_last_order")}catch{}window.location.reload()});this.state={hasError:!1}}static getDerivedStateFromError(){return{hasError:!0}}componentDidCatch(c,y){console.error("GenZ Pizza Land crashed while rendering:",c,y)}render(){return this.state.hasError?i.jsxs("div",{style:{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:14,padding:24,textAlign:"center",fontFamily:"system-ui, sans-serif",background:"#FFF8EF",color:"#252525"},children:[i.jsx("h1",{style:{fontSize:"1.3rem",margin:0},children:"Something went wrong on our end"}),i.jsx("p",{style:{maxWidth:420,opacity:.8,margin:0},children:"Your order may still have gone through — if you already saw an order number, it's safe. Reloading usually fixes this."}),i.jsx("button",{type:"button",onClick:this.handleReload,style:{padding:"10px 22px",borderRadius:8,border:"none",background:"#E6392F",color:"#fff",fontWeight:600,cursor:"pointer"},children:"Reload"})]}):this.props.children}}const Js=["🍔","🍟","🍕","🌮","🌯","🥪","🥤","🧋","🍗"],De=(l,u)=>l+Math.random()*(u-l),vh=l=>l[Math.floor(Math.random()*l.length)];function yh(){const l=v.useRef(null);return v.useEffect(()=>{var ie;const u=l.current;if(!u)return;const c=u.getContext("2d"),y=(ie=window.matchMedia)==null?void 0:ie.call(window,"(prefers-reduced-motion: reduce)").matches;let z=0,C=0,S=1,O=[],j=[],ae=0,D=!1;const N={x:-9999,y:-9999,active:!1},B=document.createElement("div");B.setAttribute("aria-hidden","true"),Object.assign(B.style,{position:"fixed",inset:"0",zIndex:"1001",overflow:"hidden",pointerEvents:"none"}),document.body.appendChild(B);const ue=()=>window.innerWidth<700,J=()=>{S=Math.min(window.devicePixelRatio||1,ue()?1.5:2),z=window.innerWidth,C=window.innerHeight,u.width=Math.round(z*S),u.height=Math.round(C*S),u.style.width=`${z}px`,u.style.height=`${C}px`,c.setTransform(S,0,0,S,0,0);const V=ue(),Je=Math.min(V?34:72,Math.round(z*C/(V?15e3:17e3))),$=V?9:16;O=Array.from({length:Je},()=>({x:De(0,z),y:De(0,C),vx:De(-.22,.22),vy:De(-.22,.22),r:De(1.1,2.8),life:1,temp:!1})),j=Array.from({length:$},(L,W)=>({emoji:Js[W%Js.length],x:De(0,z),y:De(0,C),vx:De(-.35,.35)||.2,vy:De(-.3,-.08),rot:De(0,Math.PI*2),vr:De(-.008,.008),scale:De(.55,1.05),alpha:De(.3,.55),phase:De(0,6.28)}))},le=(V,Je)=>{if(!y){const W=Math.hypot(z,C)||1;j.forEach(Ne=>{const me=Ne.x-V,ne=Ne.y-Je,T=Math.hypot(me,ne),H=T>1?Math.atan2(ne,me):De(0,Math.PI*2),U=3+(1-Math.min(T/W,1))*3;Ne.vx+=Math.cos(H)*U+De(-1,1),Ne.vy+=Math.sin(H)*U+De(-1,1),Ne.vr+=De(-.08,.08)})}const $=2+Math.floor(Math.random()*3),L=Array.from({length:$},()=>({emoji:vh(Js),size:De(22,34)}));L.forEach(({emoji:W,size:Ne},me)=>{const ne=me/L.length*Math.PI*2+De(-.35,.35),T=De(55,115),H=Math.cos(ne)*T,U=Math.sin(ne)*T-De(18,48),h=document.createElement("span");if(h.textContent=W,Object.assign(h.style,{position:"absolute",left:`${V}px`,top:`${Je}px`,fontSize:`${Ne}px`,lineHeight:"1",pointerEvents:"none",userSelect:"none",filter:"drop-shadow(0 2px 5px rgba(30,20,10,0.3))",transform:"translate(-50%, -50%) scale(0.3)"}),B.appendChild(h),y){h.style.transform=`translate(calc(-50% + ${H*.35}px), calc(-50% + ${U*.35}px)) scale(1)`,window.setTimeout(()=>h.remove(),550);return}const E=h.animate([{opacity:0,transform:"translate(-50%, -50%) scale(0.3) rotate(0deg)"},{opacity:1,transform:"translate(-50%, -50%) scale(1.25) rotate(10deg)",offset:.18},{opacity:1,transform:"translate(-50%, -50%) scale(1) rotate(-5deg)",offset:.34},{opacity:0,transform:`translate(calc(-50% + ${H}px), calc(-50% + ${U}px)) scale(0.7) rotate(${De(-55,55)}deg)`}],{duration:De(750,1050),easing:"cubic-bezier(0.2, 0.75, 0.3, 1)",fill:"forwards"});E.onfinish=()=>h.remove()})},P=V=>{c.clearRect(0,0,z,C);const $=ue()?150:200;if(N.active){const L=c.createRadialGradient(N.x,N.y,0,N.x,N.y,220);L.addColorStop(0,"rgba(255,240,200,0.35)"),L.addColorStop(1,"rgba(255,240,200,0)"),c.fillStyle=L,c.fillRect(N.x-220,N.y-220,440,440)}for(let L=O.length-1;L>=0;L--){const W=O[L];if(W.temp&&(W.life-=.004,W.life<=0)){O.splice(L,1);continue}if(N.active){const me=N.x-W.x,ne=N.y-W.y,T=Math.hypot(me,ne);T<$&&T>1&&(W.vx+=me/T*.012,W.vy+=ne/T*.012)}W.vx*=.985,W.vy*=.985,Math.hypot(W.vx,W.vy)<.08&&(W.vx+=De(-.01,.01),W.vy+=De(-.01,.01)),W.x+=W.vx,W.y+=W.vy,W.x<-20?W.x=z+20:W.x>z+20&&(W.x=-20),W.y<-20?W.y=C+20:W.y>C+20&&(W.y=-20)}for(const L of O){const W=.35+.5*(L.r/2.8);c.fillStyle=`rgba(255,255,255,${Math.min(1,W+.25)*L.life})`,c.shadowColor="rgba(255,255,255,0.8)",c.shadowBlur=8,c.beginPath(),c.arc(L.x,L.y,L.r,0,Math.PI*2),c.fill()}c.shadowBlur=0;for(const L of j){L.vx*=.99,L.vy*=.99,Math.hypot(L.vx,L.vy)<.12&&(L.vx+=De(-.01,.01),L.vy-=.004),L.vr*=.99,Math.abs(L.vr)<.004&&(L.vr+=L.vr>=0?4e-4:-4e-4),L.x+=L.vx,L.y+=L.vy+Math.sin(V/1500+L.phase)*.12,L.rot+=L.vr;const W=40;L.x<-W?L.x=z+W:L.x>z+W&&(L.x=-W),L.y<-W?L.y=C+W:L.y>C+W&&(L.y=-W),c.save(),c.translate(L.x,L.y),c.rotate(L.rot),c.globalAlpha=L.alpha;const Ne=28*L.scale;c.font=`${Ne}px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif`,c.textAlign="center",c.textBaseline="middle",c.fillText(L.emoji,0,0),c.restore()}c.globalAlpha=1,D&&(ae=requestAnimationFrame(P))},we=()=>{D||y||(D=!0,ae=requestAnimationFrame(P))},X=()=>{D=!1,cancelAnimationFrame(ae)};J(),y?P(0):we();let ge=0;const ye=()=>{clearTimeout(ge),ge=setTimeout(()=>{J(),y&&P(0)},150)},pe=V=>{N.x=V.clientX,N.y=V.clientY,N.active=!0},ve=()=>{N.active=!1},ze=V=>{N.x=V.clientX,N.y=V.clientY,N.active=!0,le(V.clientX,V.clientY),V.pointerType==="touch"&&setTimeout(ve,900)},Ce=()=>document.hidden?X():we();return window.addEventListener("resize",ye),window.addEventListener("pointermove",pe,{passive:!0}),window.addEventListener("pointerdown",ze,{passive:!0}),window.addEventListener("pointerleave",ve),document.addEventListener("mouseleave",ve),document.addEventListener("visibilitychange",Ce),()=>{X(),clearTimeout(ge),B.remove(),window.removeEventListener("resize",ye),window.removeEventListener("pointermove",pe),window.removeEventListener("pointerdown",ze),window.removeEventListener("pointerleave",ve),document.removeEventListener("mouseleave",ve),document.removeEventListener("visibilitychange",Ce)}},[]),i.jsx("canvas",{ref:l,"aria-hidden":"true",style:{position:"fixed",inset:0,zIndex:0,pointerEvents:"none"}})}Xp.createRoot(document.getElementById("root")).render(i.jsxs(Ar.StrictMode,{children:[i.jsx(yh,{}),i.jsx(xh,{children:i.jsx(gh,{})})]}));
