var kp=Object.defineProperty;var jp=(s,m,c)=>m in s?kp(s,m,{enumerable:!0,configurable:!0,writable:!0,value:c}):s[m]=c;var cc=(s,m,c)=>jp(s,typeof m!="symbol"?m+"":m,c);(function(){const m=document.createElement("link").relList;if(m&&m.supports&&m.supports("modulepreload"))return;for(const w of document.querySelectorAll('link[rel="modulepreload"]'))k(w);new MutationObserver(w=>{for(const T of w)if(T.type==="childList")for(const re of T.addedNodes)re.tagName==="LINK"&&re.rel==="modulepreload"&&k(re)}).observe(document,{childList:!0,subtree:!0});function c(w){const T={};return w.integrity&&(T.integrity=w.integrity),w.referrerPolicy&&(T.referrerPolicy=w.referrerPolicy),w.crossOrigin==="use-credentials"?T.credentials="include":w.crossOrigin==="anonymous"?T.credentials="omit":T.credentials="same-origin",T}function k(w){if(w.ep)return;w.ep=!0;const T=c(w);fetch(w.href,T)}})();function Mc(s){return s&&s.__esModule&&Object.prototype.hasOwnProperty.call(s,"default")?s.default:s}var Ia={exports:{}},Do={},Fa={exports:{}},be={};/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var dc;function Sp(){if(dc)return be;dc=1;var s=Symbol.for("react.element"),m=Symbol.for("react.portal"),c=Symbol.for("react.fragment"),k=Symbol.for("react.strict_mode"),w=Symbol.for("react.profiler"),T=Symbol.for("react.provider"),re=Symbol.for("react.context"),G=Symbol.for("react.forward_ref"),B=Symbol.for("react.suspense"),ye=Symbol.for("react.memo"),F=Symbol.for("react.lazy"),U=Symbol.iterator;function V(g){return g===null||typeof g!="object"?null:(g=U&&g[U]||g["@@iterator"],typeof g=="function"?g:null)}var ge={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},ve=Object.assign,q={};function O(g,z,le){this.props=g,this.context=z,this.refs=q,this.updater=le||ge}O.prototype.isReactComponent={},O.prototype.setState=function(g,z){if(typeof g!="object"&&typeof g!="function"&&g!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,g,z,"setState")},O.prototype.forceUpdate=function(g){this.updater.enqueueForceUpdate(this,g,"forceUpdate")};function Z(){}Z.prototype=O.prototype;function xe(g,z,le){this.props=g,this.context=z,this.refs=q,this.updater=le||ge}var Te=xe.prototype=new Z;Te.constructor=xe,ve(Te,O.prototype),Te.isPureReactComponent=!0;var de=Array.isArray,ce=Object.prototype.hasOwnProperty,he={current:null},ze={key:!0,ref:!0,__self:!0,__source:!0};function Ne(g,z,le){var fe,ke={},we=null,Ee=null;if(z!=null)for(fe in z.ref!==void 0&&(Ee=z.ref),z.key!==void 0&&(we=""+z.key),z)ce.call(z,fe)&&!ze.hasOwnProperty(fe)&&(ke[fe]=z[fe]);var Le=arguments.length-2;if(Le===1)ke.children=le;else if(1<Le){for(var M=Array(Le),$e=0;$e<Le;$e++)M[$e]=arguments[$e+2];ke.children=M}if(g&&g.defaultProps)for(fe in Le=g.defaultProps,Le)ke[fe]===void 0&&(ke[fe]=Le[fe]);return{$$typeof:s,type:g,key:we,ref:Ee,props:ke,_owner:he.current}}function J(g,z){return{$$typeof:s,type:g.type,key:z,ref:g.ref,props:g.props,_owner:g._owner}}function Ue(g){return typeof g=="object"&&g!==null&&g.$$typeof===s}function Me(g){var z={"=":"=0",":":"=2"};return"$"+g.replace(/[=:]/g,function(le){return z[le]})}var R=/\/+/g;function ee(g,z){return typeof g=="object"&&g!==null&&g.key!=null?Me(""+g.key):z.toString(36)}function S(g,z,le,fe,ke){var we=typeof g;(we==="undefined"||we==="boolean")&&(g=null);var Ee=!1;if(g===null)Ee=!0;else switch(we){case"string":case"number":Ee=!0;break;case"object":switch(g.$$typeof){case s:case m:Ee=!0}}if(Ee)return Ee=g,ke=ke(Ee),g=fe===""?"."+ee(Ee,0):fe,de(ke)?(le="",g!=null&&(le=g.replace(R,"$&/")+"/"),S(ke,z,le,"",function($e){return $e})):ke!=null&&(Ue(ke)&&(ke=J(ke,le+(!ke.key||Ee&&Ee.key===ke.key?"":(""+ke.key).replace(R,"$&/")+"/")+g)),z.push(ke)),1;if(Ee=0,fe=fe===""?".":fe+":",de(g))for(var Le=0;Le<g.length;Le++){we=g[Le];var M=fe+ee(we,Le);Ee+=S(we,z,le,M,ke)}else if(M=V(g),typeof M=="function")for(g=M.call(g),Le=0;!(we=g.next()).done;)we=we.value,M=fe+ee(we,Le++),Ee+=S(we,z,le,M,ke);else if(we==="object")throw z=String(g),Error("Objects are not valid as a React child (found: "+(z==="[object Object]"?"object with keys {"+Object.keys(g).join(", ")+"}":z)+"). If you meant to render a collection of children, use an array instead.");return Ee}function D(g,z,le){if(g==null)return g;var fe=[],ke=0;return S(g,fe,"","",function(we){return z.call(le,we,ke++)}),fe}function ae(g){if(g._status===-1){var z=g._result;z=z(),z.then(function(le){(g._status===0||g._status===-1)&&(g._status=1,g._result=le)},function(le){(g._status===0||g._status===-1)&&(g._status=2,g._result=le)}),g._status===-1&&(g._status=0,g._result=z)}if(g._status===1)return g._result.default;throw g._result}var ue={current:null},P={transition:null},W={ReactCurrentDispatcher:ue,ReactCurrentBatchConfig:P,ReactCurrentOwner:he};function I(){throw Error("act(...) is not supported in production builds of React.")}return be.Children={map:D,forEach:function(g,z,le){D(g,function(){z.apply(this,arguments)},le)},count:function(g){var z=0;return D(g,function(){z++}),z},toArray:function(g){return D(g,function(z){return z})||[]},only:function(g){if(!Ue(g))throw Error("React.Children.only expected to receive a single React element child.");return g}},be.Component=O,be.Fragment=c,be.Profiler=w,be.PureComponent=xe,be.StrictMode=k,be.Suspense=B,be.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=W,be.act=I,be.cloneElement=function(g,z,le){if(g==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+g+".");var fe=ve({},g.props),ke=g.key,we=g.ref,Ee=g._owner;if(z!=null){if(z.ref!==void 0&&(we=z.ref,Ee=he.current),z.key!==void 0&&(ke=""+z.key),g.type&&g.type.defaultProps)var Le=g.type.defaultProps;for(M in z)ce.call(z,M)&&!ze.hasOwnProperty(M)&&(fe[M]=z[M]===void 0&&Le!==void 0?Le[M]:z[M])}var M=arguments.length-2;if(M===1)fe.children=le;else if(1<M){Le=Array(M);for(var $e=0;$e<M;$e++)Le[$e]=arguments[$e+2];fe.children=Le}return{$$typeof:s,type:g.type,key:ke,ref:we,props:fe,_owner:Ee}},be.createContext=function(g){return g={$$typeof:re,_currentValue:g,_currentValue2:g,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},g.Provider={$$typeof:T,_context:g},g.Consumer=g},be.createElement=Ne,be.createFactory=function(g){var z=Ne.bind(null,g);return z.type=g,z},be.createRef=function(){return{current:null}},be.forwardRef=function(g){return{$$typeof:G,render:g}},be.isValidElement=Ue,be.lazy=function(g){return{$$typeof:F,_payload:{_status:-1,_result:g},_init:ae}},be.memo=function(g,z){return{$$typeof:ye,type:g,compare:z===void 0?null:z}},be.startTransition=function(g){var z=P.transition;P.transition={};try{g()}finally{P.transition=z}},be.unstable_act=I,be.useCallback=function(g,z){return ue.current.useCallback(g,z)},be.useContext=function(g){return ue.current.useContext(g)},be.useDebugValue=function(){},be.useDeferredValue=function(g){return ue.current.useDeferredValue(g)},be.useEffect=function(g,z){return ue.current.useEffect(g,z)},be.useId=function(){return ue.current.useId()},be.useImperativeHandle=function(g,z,le){return ue.current.useImperativeHandle(g,z,le)},be.useInsertionEffect=function(g,z){return ue.current.useInsertionEffect(g,z)},be.useLayoutEffect=function(g,z){return ue.current.useLayoutEffect(g,z)},be.useMemo=function(g,z){return ue.current.useMemo(g,z)},be.useReducer=function(g,z,le){return ue.current.useReducer(g,z,le)},be.useRef=function(g){return ue.current.useRef(g)},be.useState=function(g){return ue.current.useState(g)},be.useSyncExternalStore=function(g,z,le){return ue.current.useSyncExternalStore(g,z,le)},be.useTransition=function(){return ue.current.useTransition()},be.version="18.3.1",be}var pc;function Va(){return pc||(pc=1,Fa.exports=Sp()),Fa.exports}/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var fc;function Np(){if(fc)return Do;fc=1;var s=Va(),m=Symbol.for("react.element"),c=Symbol.for("react.fragment"),k=Object.prototype.hasOwnProperty,w=s.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,T={key:!0,ref:!0,__self:!0,__source:!0};function re(G,B,ye){var F,U={},V=null,ge=null;ye!==void 0&&(V=""+ye),B.key!==void 0&&(V=""+B.key),B.ref!==void 0&&(ge=B.ref);for(F in B)k.call(B,F)&&!T.hasOwnProperty(F)&&(U[F]=B[F]);if(G&&G.defaultProps)for(F in B=G.defaultProps,B)U[F]===void 0&&(U[F]=B[F]);return{$$typeof:m,type:G,key:V,ref:ge,props:U,_owner:w.current}}return Do.Fragment=c,Do.jsx=re,Do.jsxs=re,Do}var gc;function Cp(){return gc||(gc=1,Ia.exports=Np()),Ia.exports}var i=Cp(),j=Va();const Rc=Mc(j);var Ki={},Oa={exports:{}},wt={},Da={exports:{}},$a={};/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var mc;function Ep(){return mc||(mc=1,(function(s){function m(P,W){var I=P.length;P.push(W);e:for(;0<I;){var g=I-1>>>1,z=P[g];if(0<w(z,W))P[g]=W,P[I]=z,I=g;else break e}}function c(P){return P.length===0?null:P[0]}function k(P){if(P.length===0)return null;var W=P[0],I=P.pop();if(I!==W){P[0]=I;e:for(var g=0,z=P.length,le=z>>>1;g<le;){var fe=2*(g+1)-1,ke=P[fe],we=fe+1,Ee=P[we];if(0>w(ke,I))we<z&&0>w(Ee,ke)?(P[g]=Ee,P[we]=I,g=we):(P[g]=ke,P[fe]=I,g=fe);else if(we<z&&0>w(Ee,I))P[g]=Ee,P[we]=I,g=we;else break e}}return W}function w(P,W){var I=P.sortIndex-W.sortIndex;return I!==0?I:P.id-W.id}if(typeof performance=="object"&&typeof performance.now=="function"){var T=performance;s.unstable_now=function(){return T.now()}}else{var re=Date,G=re.now();s.unstable_now=function(){return re.now()-G}}var B=[],ye=[],F=1,U=null,V=3,ge=!1,ve=!1,q=!1,O=typeof setTimeout=="function"?setTimeout:null,Z=typeof clearTimeout=="function"?clearTimeout:null,xe=typeof setImmediate<"u"?setImmediate:null;typeof navigator<"u"&&navigator.scheduling!==void 0&&navigator.scheduling.isInputPending!==void 0&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function Te(P){for(var W=c(ye);W!==null;){if(W.callback===null)k(ye);else if(W.startTime<=P)k(ye),W.sortIndex=W.expirationTime,m(B,W);else break;W=c(ye)}}function de(P){if(q=!1,Te(P),!ve)if(c(B)!==null)ve=!0,ae(ce);else{var W=c(ye);W!==null&&ue(de,W.startTime-P)}}function ce(P,W){ve=!1,q&&(q=!1,Z(Ne),Ne=-1),ge=!0;var I=V;try{for(Te(W),U=c(B);U!==null&&(!(U.expirationTime>W)||P&&!Me());){var g=U.callback;if(typeof g=="function"){U.callback=null,V=U.priorityLevel;var z=g(U.expirationTime<=W);W=s.unstable_now(),typeof z=="function"?U.callback=z:U===c(B)&&k(B),Te(W)}else k(B);U=c(B)}if(U!==null)var le=!0;else{var fe=c(ye);fe!==null&&ue(de,fe.startTime-W),le=!1}return le}finally{U=null,V=I,ge=!1}}var he=!1,ze=null,Ne=-1,J=5,Ue=-1;function Me(){return!(s.unstable_now()-Ue<J)}function R(){if(ze!==null){var P=s.unstable_now();Ue=P;var W=!0;try{W=ze(!0,P)}finally{W?ee():(he=!1,ze=null)}}else he=!1}var ee;if(typeof xe=="function")ee=function(){xe(R)};else if(typeof MessageChannel<"u"){var S=new MessageChannel,D=S.port2;S.port1.onmessage=R,ee=function(){D.postMessage(null)}}else ee=function(){O(R,0)};function ae(P){ze=P,he||(he=!0,ee())}function ue(P,W){Ne=O(function(){P(s.unstable_now())},W)}s.unstable_IdlePriority=5,s.unstable_ImmediatePriority=1,s.unstable_LowPriority=4,s.unstable_NormalPriority=3,s.unstable_Profiling=null,s.unstable_UserBlockingPriority=2,s.unstable_cancelCallback=function(P){P.callback=null},s.unstable_continueExecution=function(){ve||ge||(ve=!0,ae(ce))},s.unstable_forceFrameRate=function(P){0>P||125<P?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):J=0<P?Math.floor(1e3/P):5},s.unstable_getCurrentPriorityLevel=function(){return V},s.unstable_getFirstCallbackNode=function(){return c(B)},s.unstable_next=function(P){switch(V){case 1:case 2:case 3:var W=3;break;default:W=V}var I=V;V=W;try{return P()}finally{V=I}},s.unstable_pauseExecution=function(){},s.unstable_requestPaint=function(){},s.unstable_runWithPriority=function(P,W){switch(P){case 1:case 2:case 3:case 4:case 5:break;default:P=3}var I=V;V=P;try{return W()}finally{V=I}},s.unstable_scheduleCallback=function(P,W,I){var g=s.unstable_now();switch(typeof I=="object"&&I!==null?(I=I.delay,I=typeof I=="number"&&0<I?g+I:g):I=g,P){case 1:var z=-1;break;case 2:z=250;break;case 5:z=1073741823;break;case 4:z=1e4;break;default:z=5e3}return z=I+z,P={id:F++,callback:W,priorityLevel:P,startTime:I,expirationTime:z,sortIndex:-1},I>g?(P.sortIndex=I,m(ye,P),c(B)===null&&P===c(ye)&&(q?(Z(Ne),Ne=-1):q=!0,ue(de,I-g))):(P.sortIndex=z,m(B,P),ve||ge||(ve=!0,ae(ce))),P},s.unstable_shouldYield=Me,s.unstable_wrapCallback=function(P){var W=V;return function(){var I=V;V=W;try{return P.apply(this,arguments)}finally{V=I}}}})($a)),$a}var hc;function _p(){return hc||(hc=1,Da.exports=Ep()),Da.exports}/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var vc;function Pp(){if(vc)return wt;vc=1;var s=Va(),m=_p();function c(e){for(var t="https://reactjs.org/docs/error-decoder.html?invariant="+e,r=1;r<arguments.length;r++)t+="&args[]="+encodeURIComponent(arguments[r]);return"Minified React error #"+e+"; visit "+t+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var k=new Set,w={};function T(e,t){re(e,t),re(e+"Capture",t)}function re(e,t){for(w[e]=t,e=0;e<t.length;e++)k.add(t[e])}var G=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),B=Object.prototype.hasOwnProperty,ye=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,F={},U={};function V(e){return B.call(U,e)?!0:B.call(F,e)?!1:ye.test(e)?U[e]=!0:(F[e]=!0,!1)}function ge(e,t,r,n){if(r!==null&&r.type===0)return!1;switch(typeof t){case"function":case"symbol":return!0;case"boolean":return n?!1:r!==null?!r.acceptsBooleans:(e=e.toLowerCase().slice(0,5),e!=="data-"&&e!=="aria-");default:return!1}}function ve(e,t,r,n){if(t===null||typeof t>"u"||ge(e,t,r,n))return!0;if(n)return!1;if(r!==null)switch(r.type){case 3:return!t;case 4:return t===!1;case 5:return isNaN(t);case 6:return isNaN(t)||1>t}return!1}function q(e,t,r,n,o,l,a){this.acceptsBooleans=t===2||t===3||t===4,this.attributeName=n,this.attributeNamespace=o,this.mustUseProperty=r,this.propertyName=e,this.type=t,this.sanitizeURL=l,this.removeEmptyString=a}var O={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(e){O[e]=new q(e,0,!1,e,null,!1,!1)}),[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(e){var t=e[0];O[t]=new q(t,1,!1,e[1],null,!1,!1)}),["contentEditable","draggable","spellCheck","value"].forEach(function(e){O[e]=new q(e,2,!1,e.toLowerCase(),null,!1,!1)}),["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(e){O[e]=new q(e,2,!1,e,null,!1,!1)}),"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(e){O[e]=new q(e,3,!1,e.toLowerCase(),null,!1,!1)}),["checked","multiple","muted","selected"].forEach(function(e){O[e]=new q(e,3,!0,e,null,!1,!1)}),["capture","download"].forEach(function(e){O[e]=new q(e,4,!1,e,null,!1,!1)}),["cols","rows","size","span"].forEach(function(e){O[e]=new q(e,6,!1,e,null,!1,!1)}),["rowSpan","start"].forEach(function(e){O[e]=new q(e,5,!1,e.toLowerCase(),null,!1,!1)});var Z=/[\-:]([a-z])/g;function xe(e){return e[1].toUpperCase()}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(e){var t=e.replace(Z,xe);O[t]=new q(t,1,!1,e,null,!1,!1)}),"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(e){var t=e.replace(Z,xe);O[t]=new q(t,1,!1,e,"http://www.w3.org/1999/xlink",!1,!1)}),["xml:base","xml:lang","xml:space"].forEach(function(e){var t=e.replace(Z,xe);O[t]=new q(t,1,!1,e,"http://www.w3.org/XML/1998/namespace",!1,!1)}),["tabIndex","crossOrigin"].forEach(function(e){O[e]=new q(e,1,!1,e.toLowerCase(),null,!1,!1)}),O.xlinkHref=new q("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1),["src","href","action","formAction"].forEach(function(e){O[e]=new q(e,1,!1,e.toLowerCase(),null,!0,!0)});function Te(e,t,r,n){var o=O.hasOwnProperty(t)?O[t]:null;(o!==null?o.type!==0:n||!(2<t.length)||t[0]!=="o"&&t[0]!=="O"||t[1]!=="n"&&t[1]!=="N")&&(ve(t,r,o,n)&&(r=null),n||o===null?V(t)&&(r===null?e.removeAttribute(t):e.setAttribute(t,""+r)):o.mustUseProperty?e[o.propertyName]=r===null?o.type===3?!1:"":r:(t=o.attributeName,n=o.attributeNamespace,r===null?e.removeAttribute(t):(o=o.type,r=o===3||o===4&&r===!0?"":""+r,n?e.setAttributeNS(n,t,r):e.setAttribute(t,r))))}var de=s.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,ce=Symbol.for("react.element"),he=Symbol.for("react.portal"),ze=Symbol.for("react.fragment"),Ne=Symbol.for("react.strict_mode"),J=Symbol.for("react.profiler"),Ue=Symbol.for("react.provider"),Me=Symbol.for("react.context"),R=Symbol.for("react.forward_ref"),ee=Symbol.for("react.suspense"),S=Symbol.for("react.suspense_list"),D=Symbol.for("react.memo"),ae=Symbol.for("react.lazy"),ue=Symbol.for("react.offscreen"),P=Symbol.iterator;function W(e){return e===null||typeof e!="object"?null:(e=P&&e[P]||e["@@iterator"],typeof e=="function"?e:null)}var I=Object.assign,g;function z(e){if(g===void 0)try{throw Error()}catch(r){var t=r.stack.trim().match(/\n( *(at )?)/);g=t&&t[1]||""}return`
`+g+e}var le=!1;function fe(e,t){if(!e||le)return"";le=!0;var r=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(t)if(t=function(){throw Error()},Object.defineProperty(t.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(t,[])}catch(y){var n=y}Reflect.construct(e,[],t)}else{try{t.call()}catch(y){n=y}e.call(t.prototype)}else{try{throw Error()}catch(y){n=y}e()}}catch(y){if(y&&n&&typeof y.stack=="string"){for(var o=y.stack.split(`
`),l=n.stack.split(`
`),a=o.length-1,d=l.length-1;1<=a&&0<=d&&o[a]!==l[d];)d--;for(;1<=a&&0<=d;a--,d--)if(o[a]!==l[d]){if(a!==1||d!==1)do if(a--,d--,0>d||o[a]!==l[d]){var p=`
`+o[a].replace(" at new "," at ");return e.displayName&&p.includes("<anonymous>")&&(p=p.replace("<anonymous>",e.displayName)),p}while(1<=a&&0<=d);break}}}finally{le=!1,Error.prepareStackTrace=r}return(e=e?e.displayName||e.name:"")?z(e):""}function ke(e){switch(e.tag){case 5:return z(e.type);case 16:return z("Lazy");case 13:return z("Suspense");case 19:return z("SuspenseList");case 0:case 2:case 15:return e=fe(e.type,!1),e;case 11:return e=fe(e.type.render,!1),e;case 1:return e=fe(e.type,!0),e;default:return""}}function we(e){if(e==null)return null;if(typeof e=="function")return e.displayName||e.name||null;if(typeof e=="string")return e;switch(e){case ze:return"Fragment";case he:return"Portal";case J:return"Profiler";case Ne:return"StrictMode";case ee:return"Suspense";case S:return"SuspenseList"}if(typeof e=="object")switch(e.$$typeof){case Me:return(e.displayName||"Context")+".Consumer";case Ue:return(e._context.displayName||"Context")+".Provider";case R:var t=e.render;return e=e.displayName,e||(e=t.displayName||t.name||"",e=e!==""?"ForwardRef("+e+")":"ForwardRef"),e;case D:return t=e.displayName||null,t!==null?t:we(e.type)||"Memo";case ae:t=e._payload,e=e._init;try{return we(e(t))}catch{}}return null}function Ee(e){var t=e.type;switch(e.tag){case 24:return"Cache";case 9:return(t.displayName||"Context")+".Consumer";case 10:return(t._context.displayName||"Context")+".Provider";case 18:return"DehydratedFragment";case 11:return e=t.render,e=e.displayName||e.name||"",t.displayName||(e!==""?"ForwardRef("+e+")":"ForwardRef");case 7:return"Fragment";case 5:return t;case 4:return"Portal";case 3:return"Root";case 6:return"Text";case 16:return we(t);case 8:return t===Ne?"StrictMode":"Mode";case 22:return"Offscreen";case 12:return"Profiler";case 21:return"Scope";case 13:return"Suspense";case 19:return"SuspenseList";case 25:return"TracingMarker";case 1:case 0:case 17:case 2:case 14:case 15:if(typeof t=="function")return t.displayName||t.name||null;if(typeof t=="string")return t}return null}function Le(e){switch(typeof e){case"boolean":case"number":case"string":case"undefined":return e;case"object":return e;default:return""}}function M(e){var t=e.type;return(e=e.nodeName)&&e.toLowerCase()==="input"&&(t==="checkbox"||t==="radio")}function $e(e){var t=M(e)?"checked":"value",r=Object.getOwnPropertyDescriptor(e.constructor.prototype,t),n=""+e[t];if(!e.hasOwnProperty(t)&&typeof r<"u"&&typeof r.get=="function"&&typeof r.set=="function"){var o=r.get,l=r.set;return Object.defineProperty(e,t,{configurable:!0,get:function(){return o.call(this)},set:function(a){n=""+a,l.call(this,a)}}),Object.defineProperty(e,t,{enumerable:r.enumerable}),{getValue:function(){return n},setValue:function(a){n=""+a},stopTracking:function(){e._valueTracker=null,delete e[t]}}}}function Ot(e){e._valueTracker||(e._valueTracker=$e(e))}function Ur(e){if(!e)return!1;var t=e._valueTracker;if(!t)return!0;var r=t.getValue(),n="";return e&&(n=M(e)?e.checked?"true":"false":e.value),e=n,e!==r?(t.setValue(e),!0):!1}function Et(e){if(e=e||(typeof document<"u"?document:void 0),typeof e>"u")return null;try{return e.activeElement||e.body}catch{return e.body}}function sr(e,t){var r=t.checked;return I({},t,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:r??e._wrapperState.initialChecked})}function xr(e,t){var r=t.defaultValue==null?"":t.defaultValue,n=t.checked!=null?t.checked:t.defaultChecked;r=Le(t.value!=null?t.value:r),e._wrapperState={initialChecked:n,initialValue:r,controlled:t.type==="checkbox"||t.type==="radio"?t.checked!=null:t.value!=null}}function Wr(e,t){t=t.checked,t!=null&&Te(e,"checked",t,!1)}function un(e,t){Wr(e,t);var r=Le(t.value),n=t.type;if(r!=null)n==="number"?(r===0&&e.value===""||e.value!=r)&&(e.value=""+r):e.value!==""+r&&(e.value=""+r);else if(n==="submit"||n==="reset"){e.removeAttribute("value");return}t.hasOwnProperty("value")?yr(e,t.type,r):t.hasOwnProperty("defaultValue")&&yr(e,t.type,Le(t.defaultValue)),t.checked==null&&t.defaultChecked!=null&&(e.defaultChecked=!!t.defaultChecked)}function Vn(e,t,r){if(t.hasOwnProperty("value")||t.hasOwnProperty("defaultValue")){var n=t.type;if(!(n!=="submit"&&n!=="reset"||t.value!==void 0&&t.value!==null))return;t=""+e._wrapperState.initialValue,r||t===e.value||(e.value=t),e.defaultValue=t}r=e.name,r!==""&&(e.name=""),e.defaultChecked=!!e._wrapperState.initialChecked,r!==""&&(e.name=r)}function yr(e,t,r){(t!=="number"||Et(e.ownerDocument)!==e)&&(r==null?e.defaultValue=""+e._wrapperState.initialValue:e.defaultValue!==""+r&&(e.defaultValue=""+r))}var pt=Array.isArray;function wr(e,t,r,n){if(e=e.options,t){t={};for(var o=0;o<r.length;o++)t["$"+r[o]]=!0;for(r=0;r<e.length;r++)o=t.hasOwnProperty("$"+e[r].value),e[r].selected!==o&&(e[r].selected=o),o&&n&&(e[r].defaultSelected=!0)}else{for(r=""+Le(r),t=null,o=0;o<e.length;o++){if(e[o].value===r){e[o].selected=!0,n&&(e[o].defaultSelected=!0);return}t!==null||e[o].disabled||(t=e[o])}t!==null&&(t.selected=!0)}}function Yn(e,t){if(t.dangerouslySetInnerHTML!=null)throw Error(c(91));return I({},t,{value:void 0,defaultValue:void 0,children:""+e._wrapperState.initialValue})}function Kn(e,t){var r=t.value;if(r==null){if(r=t.children,t=t.defaultValue,r!=null){if(t!=null)throw Error(c(92));if(pt(r)){if(1<r.length)throw Error(c(93));r=r[0]}t=r}t==null&&(t=""),r=t}e._wrapperState={initialValue:Le(r)}}function cn(e,t){var r=Le(t.value),n=Le(t.defaultValue);r!=null&&(r=""+r,r!==e.value&&(e.value=r),t.defaultValue==null&&e.defaultValue!==r&&(e.defaultValue=r)),n!=null&&(e.defaultValue=""+n)}function Gn(e){var t=e.textContent;t===e._wrapperState.initialValue&&t!==""&&t!==null&&(e.value=t)}function Xn(e){switch(e){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function dn(e,t){return e==null||e==="http://www.w3.org/1999/xhtml"?Xn(t):e==="http://www.w3.org/2000/svg"&&t==="foreignObject"?"http://www.w3.org/1999/xhtml":e}var br,pn=(function(e){return typeof MSApp<"u"&&MSApp.execUnsafeLocalFunction?function(t,r,n,o){MSApp.execUnsafeLocalFunction(function(){return e(t,r,n,o)})}:e})(function(e,t){if(e.namespaceURI!=="http://www.w3.org/2000/svg"||"innerHTML"in e)e.innerHTML=t;else{for(br=br||document.createElement("div"),br.innerHTML="<svg>"+t.valueOf().toString()+"</svg>",t=br.firstChild;e.firstChild;)e.removeChild(e.firstChild);for(;t.firstChild;)e.appendChild(t.firstChild)}});function zr(e,t){if(t){var r=e.firstChild;if(r&&r===e.lastChild&&r.nodeType===3){r.nodeValue=t;return}}e.textContent=t}var _t={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},$o=["Webkit","ms","Moz","O"];Object.keys(_t).forEach(function(e){$o.forEach(function(t){t=t+e.charAt(0).toUpperCase()+e.substring(1),_t[t]=_t[e]})});function fn(e,t,r){return t==null||typeof t=="boolean"||t===""?"":r||typeof t!="number"||t===0||_t.hasOwnProperty(e)&&_t[e]?(""+t).trim():t+"px"}function Hr(e,t){e=e.style;for(var r in t)if(t.hasOwnProperty(r)){var n=r.indexOf("--")===0,o=fn(r,t[r],n);r==="float"&&(r="cssFloat"),n?e.setProperty(r,o):e[r]=o}}var qt=I({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function qn(e,t){if(t){if(qt[e]&&(t.children!=null||t.dangerouslySetInnerHTML!=null))throw Error(c(137,e));if(t.dangerouslySetInnerHTML!=null){if(t.children!=null)throw Error(c(60));if(typeof t.dangerouslySetInnerHTML!="object"||!("__html"in t.dangerouslySetInnerHTML))throw Error(c(61))}if(t.style!=null&&typeof t.style!="object")throw Error(c(62))}}function gn(e,t){if(e.indexOf("-")===-1)return typeof t.is=="string";switch(e){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var Dt=null;function mn(e){return e=e.target||e.srcElement||window,e.correspondingUseElement&&(e=e.correspondingUseElement),e.nodeType===3?e.parentNode:e}var Zn=null,$t=null,ft=null;function Jn(e){if(e=ko(e)){if(typeof Zn!="function")throw Error(c(280));var t=e.stateNode;t&&(t=ui(t),Zn(e.stateNode,e.type,t))}}function Qr(e){$t?ft?ft.push(e):ft=[e]:$t=e}function At(){if($t){var e=$t,t=ft;if(ft=$t=null,Jn(e),t)for(e=0;e<t.length;e++)Jn(t[e])}}function Ao(e,t){return e(t)}function hn(){}var ur=!1;function kr(e,t,r){if(ur)return e(t,r);ur=!0;try{return Ao(e,t,r)}finally{ur=!1,($t!==null||ft!==null)&&(hn(),At())}}function Zt(e,t){var r=e.stateNode;if(r===null)return null;var n=ui(r);if(n===null)return null;r=n[t];e:switch(t){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(n=!n.disabled)||(e=e.type,n=!(e==="button"||e==="input"||e==="select"||e==="textarea")),e=!n;break e;default:e=!1}if(e)return null;if(r&&typeof r!="function")throw Error(c(231,t,typeof r));return r}var vn=!1;if(G)try{var jr={};Object.defineProperty(jr,"passive",{get:function(){vn=!0}}),window.addEventListener("test",jr,jr),window.removeEventListener("test",jr,jr)}catch{vn=!1}function eo(e,t,r,n,o,l,a,d,p){var y=Array.prototype.slice.call(arguments,3);try{t.apply(r,y)}catch(C){this.onError(C)}}var Jt=!1,Bt=null,Qe=!1,Vr=null,rl={onError:function(e){Jt=!0,Bt=e}};function nl(e,t,r,n,o,l,a,d,p){Jt=!1,Bt=null,eo.apply(rl,arguments)}function er(e,t,r,n,o,l,a,d,p){if(nl.apply(this,arguments),Jt){if(Jt){var y=Bt;Jt=!1,Bt=null}else throw Error(c(198));Qe||(Qe=!0,Vr=y)}}function Pt(e){var t=e,r=e;if(e.alternate)for(;t.return;)t=t.return;else{e=t;do t=e,(t.flags&4098)!==0&&(r=t.return),e=t.return;while(e)}return t.tag===3?r:null}function xn(e){if(e.tag===13){var t=e.memoizedState;if(t===null&&(e=e.alternate,e!==null&&(t=e.memoizedState)),t!==null)return t.dehydrated}return null}function Yr(e){if(Pt(e)!==e)throw Error(c(188))}function to(e){var t=e.alternate;if(!t){if(t=Pt(e),t===null)throw Error(c(188));return t!==e?null:e}for(var r=e,n=t;;){var o=r.return;if(o===null)break;var l=o.alternate;if(l===null){if(n=o.return,n!==null){r=n;continue}break}if(o.child===l.child){for(l=o.child;l;){if(l===r)return Yr(o),e;if(l===n)return Yr(o),t;l=l.sibling}throw Error(c(188))}if(r.return!==n.return)r=o,n=l;else{for(var a=!1,d=o.child;d;){if(d===r){a=!0,r=o,n=l;break}if(d===n){a=!0,n=o,r=l;break}d=d.sibling}if(!a){for(d=l.child;d;){if(d===r){a=!0,r=l,n=o;break}if(d===n){a=!0,n=l,r=o;break}d=d.sibling}if(!a)throw Error(c(189))}}if(r.alternate!==n)throw Error(c(190))}if(r.tag!==3)throw Error(c(188));return r.stateNode.current===r?e:t}function ro(e){return e=to(e),e!==null?no(e):null}function no(e){if(e.tag===5||e.tag===6)return e;for(e=e.child;e!==null;){var t=no(e);if(t!==null)return t;e=e.sibling}return null}var Bo=m.unstable_scheduleCallback,Uo=m.unstable_cancelCallback,ol=m.unstable_shouldYield,oo=m.unstable_requestPaint,Ae=m.unstable_now,il=m.unstable_getCurrentPriorityLevel,io=m.unstable_ImmediatePriority,Wo=m.unstable_UserBlockingPriority,yn=m.unstable_NormalPriority,ll=m.unstable_LowPriority,Ho=m.unstable_IdlePriority,wn=null,zt=null;function Qo(e){if(zt&&typeof zt.onCommitFiberRoot=="function")try{zt.onCommitFiberRoot(wn,e,void 0,(e.current.flags&128)===128)}catch{}}var gt=Math.clz32?Math.clz32:Ko,Vo=Math.log,Yo=Math.LN2;function Ko(e){return e>>>=0,e===0?32:31-(Vo(e)/Yo|0)|0}var Kr=64,u=4194304;function v(e){switch(e&-e){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return e&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return e&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;default:return e}}function b(e,t){var r=e.pendingLanes;if(r===0)return 0;var n=0,o=e.suspendedLanes,l=e.pingedLanes,a=r&268435455;if(a!==0){var d=a&~o;d!==0?n=v(d):(l&=a,l!==0&&(n=v(l)))}else a=r&~o,a!==0?n=v(a):l!==0&&(n=v(l));if(n===0)return 0;if(t!==0&&t!==n&&(t&o)===0&&(o=n&-n,l=t&-t,o>=l||o===16&&(l&4194240)!==0))return t;if((n&4)!==0&&(n|=r&16),t=e.entangledLanes,t!==0)for(e=e.entanglements,t&=n;0<t;)r=31-gt(t),o=1<<r,n|=e[r],t&=~o;return n}function _(e,t){switch(e){case 1:case 2:case 4:return t+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return t+5e3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return-1;case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function $(e,t){for(var r=e.suspendedLanes,n=e.pingedLanes,o=e.expirationTimes,l=e.pendingLanes;0<l;){var a=31-gt(l),d=1<<a,p=o[a];p===-1?((d&r)===0||(d&n)!==0)&&(o[a]=_(d,t)):p<=t&&(e.expiredLanes|=d),l&=~d}}function te(e){return e=e.pendingLanes&-1073741825,e!==0?e:e&1073741824?1073741824:0}function ie(){var e=Kr;return Kr<<=1,(Kr&4194240)===0&&(Kr=64),e}function je(e){for(var t=[],r=0;31>r;r++)t.push(e);return t}function _e(e,t,r){e.pendingLanes|=t,t!==536870912&&(e.suspendedLanes=0,e.pingedLanes=0),e=e.eventTimes,t=31-gt(t),e[t]=r}function qe(e,t){var r=e.pendingLanes&~t;e.pendingLanes=t,e.suspendedLanes=0,e.pingedLanes=0,e.expiredLanes&=t,e.mutableReadLanes&=t,e.entangledLanes&=t,t=e.entanglements;var n=e.eventTimes;for(e=e.expirationTimes;0<r;){var o=31-gt(r),l=1<<o;t[o]=0,n[o]=-1,e[o]=-1,r&=~l}}function Fe(e,t){var r=e.entangledLanes|=t;for(e=e.entanglements;r;){var n=31-gt(r),o=1<<n;o&t|e[n]&t&&(e[n]|=t),r&=~o}}var pe=0;function Ve(e){return e&=-e,1<e?4<e?(e&268435455)!==0?16:536870912:4:1}var tr,X,Se,me,Ge,et=!1,Ut=[],Wt=null,rr=null,Sr=null,lo=new Map,ao=new Map,Nr=[],Qc="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");function Ya(e,t){switch(e){case"focusin":case"focusout":Wt=null;break;case"dragenter":case"dragleave":rr=null;break;case"mouseover":case"mouseout":Sr=null;break;case"pointerover":case"pointerout":lo.delete(t.pointerId);break;case"gotpointercapture":case"lostpointercapture":ao.delete(t.pointerId)}}function so(e,t,r,n,o,l){return e===null||e.nativeEvent!==l?(e={blockedOn:t,domEventName:r,eventSystemFlags:n,nativeEvent:l,targetContainers:[o]},t!==null&&(t=ko(t),t!==null&&X(t)),e):(e.eventSystemFlags|=n,t=e.targetContainers,o!==null&&t.indexOf(o)===-1&&t.push(o),e)}function Vc(e,t,r,n,o){switch(t){case"focusin":return Wt=so(Wt,e,t,r,n,o),!0;case"dragenter":return rr=so(rr,e,t,r,n,o),!0;case"mouseover":return Sr=so(Sr,e,t,r,n,o),!0;case"pointerover":var l=o.pointerId;return lo.set(l,so(lo.get(l)||null,e,t,r,n,o)),!0;case"gotpointercapture":return l=o.pointerId,ao.set(l,so(ao.get(l)||null,e,t,r,n,o)),!0}return!1}function Ka(e){var t=Gr(e.target);if(t!==null){var r=Pt(t);if(r!==null){if(t=r.tag,t===13){if(t=xn(r),t!==null){e.blockedOn=t,Ge(e.priority,function(){Se(r)});return}}else if(t===3&&r.stateNode.current.memoizedState.isDehydrated){e.blockedOn=r.tag===3?r.stateNode.containerInfo:null;return}}}e.blockedOn=null}function Go(e){if(e.blockedOn!==null)return!1;for(var t=e.targetContainers;0<t.length;){var r=sl(e.domEventName,e.eventSystemFlags,t[0],e.nativeEvent);if(r===null){r=e.nativeEvent;var n=new r.constructor(r.type,r);Dt=n,r.target.dispatchEvent(n),Dt=null}else return t=ko(r),t!==null&&X(t),e.blockedOn=r,!1;t.shift()}return!0}function Ga(e,t,r){Go(e)&&r.delete(t)}function Yc(){et=!1,Wt!==null&&Go(Wt)&&(Wt=null),rr!==null&&Go(rr)&&(rr=null),Sr!==null&&Go(Sr)&&(Sr=null),lo.forEach(Ga),ao.forEach(Ga)}function uo(e,t){e.blockedOn===t&&(e.blockedOn=null,et||(et=!0,m.unstable_scheduleCallback(m.unstable_NormalPriority,Yc)))}function co(e){function t(o){return uo(o,e)}if(0<Ut.length){uo(Ut[0],e);for(var r=1;r<Ut.length;r++){var n=Ut[r];n.blockedOn===e&&(n.blockedOn=null)}}for(Wt!==null&&uo(Wt,e),rr!==null&&uo(rr,e),Sr!==null&&uo(Sr,e),lo.forEach(t),ao.forEach(t),r=0;r<Nr.length;r++)n=Nr[r],n.blockedOn===e&&(n.blockedOn=null);for(;0<Nr.length&&(r=Nr[0],r.blockedOn===null);)Ka(r),r.blockedOn===null&&Nr.shift()}var bn=de.ReactCurrentBatchConfig,Xo=!0;function Kc(e,t,r,n){var o=pe,l=bn.transition;bn.transition=null;try{pe=1,al(e,t,r,n)}finally{pe=o,bn.transition=l}}function Gc(e,t,r,n){var o=pe,l=bn.transition;bn.transition=null;try{pe=4,al(e,t,r,n)}finally{pe=o,bn.transition=l}}function al(e,t,r,n){if(Xo){var o=sl(e,t,r,n);if(o===null)Sl(e,t,n,qo,r),Ya(e,n);else if(Vc(o,e,t,r,n))n.stopPropagation();else if(Ya(e,n),t&4&&-1<Qc.indexOf(e)){for(;o!==null;){var l=ko(o);if(l!==null&&tr(l),l=sl(e,t,r,n),l===null&&Sl(e,t,n,qo,r),l===o)break;o=l}o!==null&&n.stopPropagation()}else Sl(e,t,n,null,r)}}var qo=null;function sl(e,t,r,n){if(qo=null,e=mn(n),e=Gr(e),e!==null)if(t=Pt(e),t===null)e=null;else if(r=t.tag,r===13){if(e=xn(t),e!==null)return e;e=null}else if(r===3){if(t.stateNode.current.memoizedState.isDehydrated)return t.tag===3?t.stateNode.containerInfo:null;e=null}else t!==e&&(e=null);return qo=e,null}function Xa(e){switch(e){case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 1;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"toggle":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 4;case"message":switch(il()){case io:return 1;case Wo:return 4;case yn:case ll:return 16;case Ho:return 536870912;default:return 16}default:return 16}}var Cr=null,ul=null,Zo=null;function qa(){if(Zo)return Zo;var e,t=ul,r=t.length,n,o="value"in Cr?Cr.value:Cr.textContent,l=o.length;for(e=0;e<r&&t[e]===o[e];e++);var a=r-e;for(n=1;n<=a&&t[r-n]===o[l-n];n++);return Zo=o.slice(e,1<n?1-n:void 0)}function Jo(e){var t=e.keyCode;return"charCode"in e?(e=e.charCode,e===0&&t===13&&(e=13)):e=t,e===10&&(e=13),32<=e||e===13?e:0}function ei(){return!0}function Za(){return!1}function kt(e){function t(r,n,o,l,a){this._reactName=r,this._targetInst=o,this.type=n,this.nativeEvent=l,this.target=a,this.currentTarget=null;for(var d in e)e.hasOwnProperty(d)&&(r=e[d],this[d]=r?r(l):l[d]);return this.isDefaultPrevented=(l.defaultPrevented!=null?l.defaultPrevented:l.returnValue===!1)?ei:Za,this.isPropagationStopped=Za,this}return I(t.prototype,{preventDefault:function(){this.defaultPrevented=!0;var r=this.nativeEvent;r&&(r.preventDefault?r.preventDefault():typeof r.returnValue!="unknown"&&(r.returnValue=!1),this.isDefaultPrevented=ei)},stopPropagation:function(){var r=this.nativeEvent;r&&(r.stopPropagation?r.stopPropagation():typeof r.cancelBubble!="unknown"&&(r.cancelBubble=!0),this.isPropagationStopped=ei)},persist:function(){},isPersistent:ei}),t}var zn={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(e){return e.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},cl=kt(zn),po=I({},zn,{view:0,detail:0}),Xc=kt(po),dl,pl,fo,ti=I({},po,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:gl,button:0,buttons:0,relatedTarget:function(e){return e.relatedTarget===void 0?e.fromElement===e.srcElement?e.toElement:e.fromElement:e.relatedTarget},movementX:function(e){return"movementX"in e?e.movementX:(e!==fo&&(fo&&e.type==="mousemove"?(dl=e.screenX-fo.screenX,pl=e.screenY-fo.screenY):pl=dl=0,fo=e),dl)},movementY:function(e){return"movementY"in e?e.movementY:pl}}),Ja=kt(ti),qc=I({},ti,{dataTransfer:0}),Zc=kt(qc),Jc=I({},po,{relatedTarget:0}),fl=kt(Jc),ed=I({},zn,{animationName:0,elapsedTime:0,pseudoElement:0}),td=kt(ed),rd=I({},zn,{clipboardData:function(e){return"clipboardData"in e?e.clipboardData:window.clipboardData}}),nd=kt(rd),od=I({},zn,{data:0}),es=kt(od),id={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},ld={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},ad={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function sd(e){var t=this.nativeEvent;return t.getModifierState?t.getModifierState(e):(e=ad[e])?!!t[e]:!1}function gl(){return sd}var ud=I({},po,{key:function(e){if(e.key){var t=id[e.key]||e.key;if(t!=="Unidentified")return t}return e.type==="keypress"?(e=Jo(e),e===13?"Enter":String.fromCharCode(e)):e.type==="keydown"||e.type==="keyup"?ld[e.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:gl,charCode:function(e){return e.type==="keypress"?Jo(e):0},keyCode:function(e){return e.type==="keydown"||e.type==="keyup"?e.keyCode:0},which:function(e){return e.type==="keypress"?Jo(e):e.type==="keydown"||e.type==="keyup"?e.keyCode:0}}),cd=kt(ud),dd=I({},ti,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),ts=kt(dd),pd=I({},po,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:gl}),fd=kt(pd),gd=I({},zn,{propertyName:0,elapsedTime:0,pseudoElement:0}),md=kt(gd),hd=I({},ti,{deltaX:function(e){return"deltaX"in e?e.deltaX:"wheelDeltaX"in e?-e.wheelDeltaX:0},deltaY:function(e){return"deltaY"in e?e.deltaY:"wheelDeltaY"in e?-e.wheelDeltaY:"wheelDelta"in e?-e.wheelDelta:0},deltaZ:0,deltaMode:0}),vd=kt(hd),xd=[9,13,27,32],ml=G&&"CompositionEvent"in window,go=null;G&&"documentMode"in document&&(go=document.documentMode);var yd=G&&"TextEvent"in window&&!go,rs=G&&(!ml||go&&8<go&&11>=go),ns=" ",os=!1;function is(e,t){switch(e){case"keyup":return xd.indexOf(t.keyCode)!==-1;case"keydown":return t.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function ls(e){return e=e.detail,typeof e=="object"&&"data"in e?e.data:null}var kn=!1;function wd(e,t){switch(e){case"compositionend":return ls(t);case"keypress":return t.which!==32?null:(os=!0,ns);case"textInput":return e=t.data,e===ns&&os?null:e;default:return null}}function bd(e,t){if(kn)return e==="compositionend"||!ml&&is(e,t)?(e=qa(),Zo=ul=Cr=null,kn=!1,e):null;switch(e){case"paste":return null;case"keypress":if(!(t.ctrlKey||t.altKey||t.metaKey)||t.ctrlKey&&t.altKey){if(t.char&&1<t.char.length)return t.char;if(t.which)return String.fromCharCode(t.which)}return null;case"compositionend":return rs&&t.locale!=="ko"?null:t.data;default:return null}}var zd={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function as(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t==="input"?!!zd[e.type]:t==="textarea"}function ss(e,t,r,n){Qr(n),t=li(t,"onChange"),0<t.length&&(r=new cl("onChange","change",null,r,n),e.push({event:r,listeners:t}))}var mo=null,ho=null;function kd(e){Ns(e,0)}function ri(e){var t=En(e);if(Ur(t))return e}function jd(e,t){if(e==="change")return t}var us=!1;if(G){var hl;if(G){var vl="oninput"in document;if(!vl){var cs=document.createElement("div");cs.setAttribute("oninput","return;"),vl=typeof cs.oninput=="function"}hl=vl}else hl=!1;us=hl&&(!document.documentMode||9<document.documentMode)}function ds(){mo&&(mo.detachEvent("onpropertychange",ps),ho=mo=null)}function ps(e){if(e.propertyName==="value"&&ri(ho)){var t=[];ss(t,ho,e,mn(e)),kr(kd,t)}}function Sd(e,t,r){e==="focusin"?(ds(),mo=t,ho=r,mo.attachEvent("onpropertychange",ps)):e==="focusout"&&ds()}function Nd(e){if(e==="selectionchange"||e==="keyup"||e==="keydown")return ri(ho)}function Cd(e,t){if(e==="click")return ri(t)}function Ed(e,t){if(e==="input"||e==="change")return ri(t)}function _d(e,t){return e===t&&(e!==0||1/e===1/t)||e!==e&&t!==t}var Ht=typeof Object.is=="function"?Object.is:_d;function vo(e,t){if(Ht(e,t))return!0;if(typeof e!="object"||e===null||typeof t!="object"||t===null)return!1;var r=Object.keys(e),n=Object.keys(t);if(r.length!==n.length)return!1;for(n=0;n<r.length;n++){var o=r[n];if(!B.call(t,o)||!Ht(e[o],t[o]))return!1}return!0}function fs(e){for(;e&&e.firstChild;)e=e.firstChild;return e}function gs(e,t){var r=fs(e);e=0;for(var n;r;){if(r.nodeType===3){if(n=e+r.textContent.length,e<=t&&n>=t)return{node:r,offset:t-e};e=n}e:{for(;r;){if(r.nextSibling){r=r.nextSibling;break e}r=r.parentNode}r=void 0}r=fs(r)}}function ms(e,t){return e&&t?e===t?!0:e&&e.nodeType===3?!1:t&&t.nodeType===3?ms(e,t.parentNode):"contains"in e?e.contains(t):e.compareDocumentPosition?!!(e.compareDocumentPosition(t)&16):!1:!1}function hs(){for(var e=window,t=Et();t instanceof e.HTMLIFrameElement;){try{var r=typeof t.contentWindow.location.href=="string"}catch{r=!1}if(r)e=t.contentWindow;else break;t=Et(e.document)}return t}function xl(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t&&(t==="input"&&(e.type==="text"||e.type==="search"||e.type==="tel"||e.type==="url"||e.type==="password")||t==="textarea"||e.contentEditable==="true")}function Pd(e){var t=hs(),r=e.focusedElem,n=e.selectionRange;if(t!==r&&r&&r.ownerDocument&&ms(r.ownerDocument.documentElement,r)){if(n!==null&&xl(r)){if(t=n.start,e=n.end,e===void 0&&(e=t),"selectionStart"in r)r.selectionStart=t,r.selectionEnd=Math.min(e,r.value.length);else if(e=(t=r.ownerDocument||document)&&t.defaultView||window,e.getSelection){e=e.getSelection();var o=r.textContent.length,l=Math.min(n.start,o);n=n.end===void 0?l:Math.min(n.end,o),!e.extend&&l>n&&(o=n,n=l,l=o),o=gs(r,l);var a=gs(r,n);o&&a&&(e.rangeCount!==1||e.anchorNode!==o.node||e.anchorOffset!==o.offset||e.focusNode!==a.node||e.focusOffset!==a.offset)&&(t=t.createRange(),t.setStart(o.node,o.offset),e.removeAllRanges(),l>n?(e.addRange(t),e.extend(a.node,a.offset)):(t.setEnd(a.node,a.offset),e.addRange(t)))}}for(t=[],e=r;e=e.parentNode;)e.nodeType===1&&t.push({element:e,left:e.scrollLeft,top:e.scrollTop});for(typeof r.focus=="function"&&r.focus(),r=0;r<t.length;r++)e=t[r],e.element.scrollLeft=e.left,e.element.scrollTop=e.top}}var Ld=G&&"documentMode"in document&&11>=document.documentMode,jn=null,yl=null,xo=null,wl=!1;function vs(e,t,r){var n=r.window===r?r.document:r.nodeType===9?r:r.ownerDocument;wl||jn==null||jn!==Et(n)||(n=jn,"selectionStart"in n&&xl(n)?n={start:n.selectionStart,end:n.selectionEnd}:(n=(n.ownerDocument&&n.ownerDocument.defaultView||window).getSelection(),n={anchorNode:n.anchorNode,anchorOffset:n.anchorOffset,focusNode:n.focusNode,focusOffset:n.focusOffset}),xo&&vo(xo,n)||(xo=n,n=li(yl,"onSelect"),0<n.length&&(t=new cl("onSelect","select",null,t,r),e.push({event:t,listeners:n}),t.target=jn)))}function ni(e,t){var r={};return r[e.toLowerCase()]=t.toLowerCase(),r["Webkit"+e]="webkit"+t,r["Moz"+e]="moz"+t,r}var Sn={animationend:ni("Animation","AnimationEnd"),animationiteration:ni("Animation","AnimationIteration"),animationstart:ni("Animation","AnimationStart"),transitionend:ni("Transition","TransitionEnd")},bl={},xs={};G&&(xs=document.createElement("div").style,"AnimationEvent"in window||(delete Sn.animationend.animation,delete Sn.animationiteration.animation,delete Sn.animationstart.animation),"TransitionEvent"in window||delete Sn.transitionend.transition);function oi(e){if(bl[e])return bl[e];if(!Sn[e])return e;var t=Sn[e],r;for(r in t)if(t.hasOwnProperty(r)&&r in xs)return bl[e]=t[r];return e}var ys=oi("animationend"),ws=oi("animationiteration"),bs=oi("animationstart"),zs=oi("transitionend"),ks=new Map,js="abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");function Er(e,t){ks.set(e,t),T(t,[e])}for(var zl=0;zl<js.length;zl++){var kl=js[zl],Td=kl.toLowerCase(),Md=kl[0].toUpperCase()+kl.slice(1);Er(Td,"on"+Md)}Er(ys,"onAnimationEnd"),Er(ws,"onAnimationIteration"),Er(bs,"onAnimationStart"),Er("dblclick","onDoubleClick"),Er("focusin","onFocus"),Er("focusout","onBlur"),Er(zs,"onTransitionEnd"),re("onMouseEnter",["mouseout","mouseover"]),re("onMouseLeave",["mouseout","mouseover"]),re("onPointerEnter",["pointerout","pointerover"]),re("onPointerLeave",["pointerout","pointerover"]),T("onChange","change click focusin focusout input keydown keyup selectionchange".split(" ")),T("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")),T("onBeforeInput",["compositionend","keypress","textInput","paste"]),T("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" ")),T("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" ")),T("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var yo="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),Rd=new Set("cancel close invalid load scroll toggle".split(" ").concat(yo));function Ss(e,t,r){var n=e.type||"unknown-event";e.currentTarget=r,er(n,t,void 0,e),e.currentTarget=null}function Ns(e,t){t=(t&4)!==0;for(var r=0;r<e.length;r++){var n=e[r],o=n.event;n=n.listeners;e:{var l=void 0;if(t)for(var a=n.length-1;0<=a;a--){var d=n[a],p=d.instance,y=d.currentTarget;if(d=d.listener,p!==l&&o.isPropagationStopped())break e;Ss(o,d,y),l=p}else for(a=0;a<n.length;a++){if(d=n[a],p=d.instance,y=d.currentTarget,d=d.listener,p!==l&&o.isPropagationStopped())break e;Ss(o,d,y),l=p}}}if(Qe)throw e=Vr,Qe=!1,Vr=null,e}function Oe(e,t){var r=t[Ll];r===void 0&&(r=t[Ll]=new Set);var n=e+"__bubble";r.has(n)||(Cs(t,e,2,!1),r.add(n))}function jl(e,t,r){var n=0;t&&(n|=4),Cs(r,e,n,t)}var ii="_reactListening"+Math.random().toString(36).slice(2);function wo(e){if(!e[ii]){e[ii]=!0,k.forEach(function(r){r!=="selectionchange"&&(Rd.has(r)||jl(r,!1,e),jl(r,!0,e))});var t=e.nodeType===9?e:e.ownerDocument;t===null||t[ii]||(t[ii]=!0,jl("selectionchange",!1,t))}}function Cs(e,t,r,n){switch(Xa(t)){case 1:var o=Kc;break;case 4:o=Gc;break;default:o=al}r=o.bind(null,t,r,e),o=void 0,!vn||t!=="touchstart"&&t!=="touchmove"&&t!=="wheel"||(o=!0),n?o!==void 0?e.addEventListener(t,r,{capture:!0,passive:o}):e.addEventListener(t,r,!0):o!==void 0?e.addEventListener(t,r,{passive:o}):e.addEventListener(t,r,!1)}function Sl(e,t,r,n,o){var l=n;if((t&1)===0&&(t&2)===0&&n!==null)e:for(;;){if(n===null)return;var a=n.tag;if(a===3||a===4){var d=n.stateNode.containerInfo;if(d===o||d.nodeType===8&&d.parentNode===o)break;if(a===4)for(a=n.return;a!==null;){var p=a.tag;if((p===3||p===4)&&(p=a.stateNode.containerInfo,p===o||p.nodeType===8&&p.parentNode===o))return;a=a.return}for(;d!==null;){if(a=Gr(d),a===null)return;if(p=a.tag,p===5||p===6){n=l=a;continue e}d=d.parentNode}}n=n.return}kr(function(){var y=l,C=mn(r),E=[];e:{var N=ks.get(e);if(N!==void 0){var A=cl,Q=e;switch(e){case"keypress":if(Jo(r)===0)break e;case"keydown":case"keyup":A=cd;break;case"focusin":Q="focus",A=fl;break;case"focusout":Q="blur",A=fl;break;case"beforeblur":case"afterblur":A=fl;break;case"click":if(r.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":A=Ja;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":A=Zc;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":A=fd;break;case ys:case ws:case bs:A=td;break;case zs:A=md;break;case"scroll":A=Xc;break;case"wheel":A=vd;break;case"copy":case"cut":case"paste":A=nd;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":A=ts}var Y=(t&4)!==0,Ke=!Y&&e==="scroll",h=Y?N!==null?N+"Capture":null:N;Y=[];for(var f=y,x;f!==null;){x=f;var L=x.stateNode;if(x.tag===5&&L!==null&&(x=L,h!==null&&(L=Zt(f,h),L!=null&&Y.push(bo(f,L,x)))),Ke)break;f=f.return}0<Y.length&&(N=new A(N,Q,null,r,C),E.push({event:N,listeners:Y}))}}if((t&7)===0){e:{if(N=e==="mouseover"||e==="pointerover",A=e==="mouseout"||e==="pointerout",N&&r!==Dt&&(Q=r.relatedTarget||r.fromElement)&&(Gr(Q)||Q[cr]))break e;if((A||N)&&(N=C.window===C?C:(N=C.ownerDocument)?N.defaultView||N.parentWindow:window,A?(Q=r.relatedTarget||r.toElement,A=y,Q=Q?Gr(Q):null,Q!==null&&(Ke=Pt(Q),Q!==Ke||Q.tag!==5&&Q.tag!==6)&&(Q=null)):(A=null,Q=y),A!==Q)){if(Y=Ja,L="onMouseLeave",h="onMouseEnter",f="mouse",(e==="pointerout"||e==="pointerover")&&(Y=ts,L="onPointerLeave",h="onPointerEnter",f="pointer"),Ke=A==null?N:En(A),x=Q==null?N:En(Q),N=new Y(L,f+"leave",A,r,C),N.target=Ke,N.relatedTarget=x,L=null,Gr(C)===y&&(Y=new Y(h,f+"enter",Q,r,C),Y.target=x,Y.relatedTarget=Ke,L=Y),Ke=L,A&&Q)t:{for(Y=A,h=Q,f=0,x=Y;x;x=Nn(x))f++;for(x=0,L=h;L;L=Nn(L))x++;for(;0<f-x;)Y=Nn(Y),f--;for(;0<x-f;)h=Nn(h),x--;for(;f--;){if(Y===h||h!==null&&Y===h.alternate)break t;Y=Nn(Y),h=Nn(h)}Y=null}else Y=null;A!==null&&Es(E,N,A,Y,!1),Q!==null&&Ke!==null&&Es(E,Ke,Q,Y,!0)}}e:{if(N=y?En(y):window,A=N.nodeName&&N.nodeName.toLowerCase(),A==="select"||A==="input"&&N.type==="file")var K=jd;else if(as(N))if(us)K=Ed;else{K=Nd;var ne=Sd}else(A=N.nodeName)&&A.toLowerCase()==="input"&&(N.type==="checkbox"||N.type==="radio")&&(K=Cd);if(K&&(K=K(e,y))){ss(E,K,r,C);break e}ne&&ne(e,N,y),e==="focusout"&&(ne=N._wrapperState)&&ne.controlled&&N.type==="number"&&yr(N,"number",N.value)}switch(ne=y?En(y):window,e){case"focusin":(as(ne)||ne.contentEditable==="true")&&(jn=ne,yl=y,xo=null);break;case"focusout":xo=yl=jn=null;break;case"mousedown":wl=!0;break;case"contextmenu":case"mouseup":case"dragend":wl=!1,vs(E,r,C);break;case"selectionchange":if(Ld)break;case"keydown":case"keyup":vs(E,r,C)}var oe;if(ml)e:{switch(e){case"compositionstart":var se="onCompositionStart";break e;case"compositionend":se="onCompositionEnd";break e;case"compositionupdate":se="onCompositionUpdate";break e}se=void 0}else kn?is(e,r)&&(se="onCompositionEnd"):e==="keydown"&&r.keyCode===229&&(se="onCompositionStart");se&&(rs&&r.locale!=="ko"&&(kn||se!=="onCompositionStart"?se==="onCompositionEnd"&&kn&&(oe=qa()):(Cr=C,ul="value"in Cr?Cr.value:Cr.textContent,kn=!0)),ne=li(y,se),0<ne.length&&(se=new es(se,e,null,r,C),E.push({event:se,listeners:ne}),oe?se.data=oe:(oe=ls(r),oe!==null&&(se.data=oe)))),(oe=yd?wd(e,r):bd(e,r))&&(y=li(y,"onBeforeInput"),0<y.length&&(C=new es("onBeforeInput","beforeinput",null,r,C),E.push({event:C,listeners:y}),C.data=oe))}Ns(E,t)})}function bo(e,t,r){return{instance:e,listener:t,currentTarget:r}}function li(e,t){for(var r=t+"Capture",n=[];e!==null;){var o=e,l=o.stateNode;o.tag===5&&l!==null&&(o=l,l=Zt(e,r),l!=null&&n.unshift(bo(e,l,o)),l=Zt(e,t),l!=null&&n.push(bo(e,l,o))),e=e.return}return n}function Nn(e){if(e===null)return null;do e=e.return;while(e&&e.tag!==5);return e||null}function Es(e,t,r,n,o){for(var l=t._reactName,a=[];r!==null&&r!==n;){var d=r,p=d.alternate,y=d.stateNode;if(p!==null&&p===n)break;d.tag===5&&y!==null&&(d=y,o?(p=Zt(r,l),p!=null&&a.unshift(bo(r,p,d))):o||(p=Zt(r,l),p!=null&&a.push(bo(r,p,d)))),r=r.return}a.length!==0&&e.push({event:t,listeners:a})}var Id=/\r\n?/g,Fd=/\u0000|\uFFFD/g;function _s(e){return(typeof e=="string"?e:""+e).replace(Id,`
`).replace(Fd,"")}function ai(e,t,r){if(t=_s(t),_s(e)!==t&&r)throw Error(c(425))}function si(){}var Nl=null,Cl=null;function El(e,t){return e==="textarea"||e==="noscript"||typeof t.children=="string"||typeof t.children=="number"||typeof t.dangerouslySetInnerHTML=="object"&&t.dangerouslySetInnerHTML!==null&&t.dangerouslySetInnerHTML.__html!=null}var _l=typeof setTimeout=="function"?setTimeout:void 0,Od=typeof clearTimeout=="function"?clearTimeout:void 0,Ps=typeof Promise=="function"?Promise:void 0,Dd=typeof queueMicrotask=="function"?queueMicrotask:typeof Ps<"u"?function(e){return Ps.resolve(null).then(e).catch($d)}:_l;function $d(e){setTimeout(function(){throw e})}function Pl(e,t){var r=t,n=0;do{var o=r.nextSibling;if(e.removeChild(r),o&&o.nodeType===8)if(r=o.data,r==="/$"){if(n===0){e.removeChild(o),co(t);return}n--}else r!=="$"&&r!=="$?"&&r!=="$!"||n++;r=o}while(r);co(t)}function _r(e){for(;e!=null;e=e.nextSibling){var t=e.nodeType;if(t===1||t===3)break;if(t===8){if(t=e.data,t==="$"||t==="$!"||t==="$?")break;if(t==="/$")return null}}return e}function Ls(e){e=e.previousSibling;for(var t=0;e;){if(e.nodeType===8){var r=e.data;if(r==="$"||r==="$!"||r==="$?"){if(t===0)return e;t--}else r==="/$"&&t++}e=e.previousSibling}return null}var Cn=Math.random().toString(36).slice(2),nr="__reactFiber$"+Cn,zo="__reactProps$"+Cn,cr="__reactContainer$"+Cn,Ll="__reactEvents$"+Cn,Ad="__reactListeners$"+Cn,Bd="__reactHandles$"+Cn;function Gr(e){var t=e[nr];if(t)return t;for(var r=e.parentNode;r;){if(t=r[cr]||r[nr]){if(r=t.alternate,t.child!==null||r!==null&&r.child!==null)for(e=Ls(e);e!==null;){if(r=e[nr])return r;e=Ls(e)}return t}e=r,r=e.parentNode}return null}function ko(e){return e=e[nr]||e[cr],!e||e.tag!==5&&e.tag!==6&&e.tag!==13&&e.tag!==3?null:e}function En(e){if(e.tag===5||e.tag===6)return e.stateNode;throw Error(c(33))}function ui(e){return e[zo]||null}var Tl=[],_n=-1;function Pr(e){return{current:e}}function De(e){0>_n||(e.current=Tl[_n],Tl[_n]=null,_n--)}function Ie(e,t){_n++,Tl[_n]=e.current,e.current=t}var Lr={},lt=Pr(Lr),mt=Pr(!1),Xr=Lr;function Pn(e,t){var r=e.type.contextTypes;if(!r)return Lr;var n=e.stateNode;if(n&&n.__reactInternalMemoizedUnmaskedChildContext===t)return n.__reactInternalMemoizedMaskedChildContext;var o={},l;for(l in r)o[l]=t[l];return n&&(e=e.stateNode,e.__reactInternalMemoizedUnmaskedChildContext=t,e.__reactInternalMemoizedMaskedChildContext=o),o}function ht(e){return e=e.childContextTypes,e!=null}function ci(){De(mt),De(lt)}function Ts(e,t,r){if(lt.current!==Lr)throw Error(c(168));Ie(lt,t),Ie(mt,r)}function Ms(e,t,r){var n=e.stateNode;if(t=t.childContextTypes,typeof n.getChildContext!="function")return r;n=n.getChildContext();for(var o in n)if(!(o in t))throw Error(c(108,Ee(e)||"Unknown",o));return I({},r,n)}function di(e){return e=(e=e.stateNode)&&e.__reactInternalMemoizedMergedChildContext||Lr,Xr=lt.current,Ie(lt,e),Ie(mt,mt.current),!0}function Rs(e,t,r){var n=e.stateNode;if(!n)throw Error(c(169));r?(e=Ms(e,t,Xr),n.__reactInternalMemoizedMergedChildContext=e,De(mt),De(lt),Ie(lt,e)):De(mt),Ie(mt,r)}var dr=null,pi=!1,Ml=!1;function Is(e){dr===null?dr=[e]:dr.push(e)}function Ud(e){pi=!0,Is(e)}function Tr(){if(!Ml&&dr!==null){Ml=!0;var e=0,t=pe;try{var r=dr;for(pe=1;e<r.length;e++){var n=r[e];do n=n(!0);while(n!==null)}dr=null,pi=!1}catch(o){throw dr!==null&&(dr=dr.slice(e+1)),Bo(io,Tr),o}finally{pe=t,Ml=!1}}return null}var Ln=[],Tn=0,fi=null,gi=0,Lt=[],Tt=0,qr=null,pr=1,fr="";function Zr(e,t){Ln[Tn++]=gi,Ln[Tn++]=fi,fi=e,gi=t}function Fs(e,t,r){Lt[Tt++]=pr,Lt[Tt++]=fr,Lt[Tt++]=qr,qr=e;var n=pr;e=fr;var o=32-gt(n)-1;n&=~(1<<o),r+=1;var l=32-gt(t)+o;if(30<l){var a=o-o%5;l=(n&(1<<a)-1).toString(32),n>>=a,o-=a,pr=1<<32-gt(t)+o|r<<o|n,fr=l+e}else pr=1<<l|r<<o|n,fr=e}function Rl(e){e.return!==null&&(Zr(e,1),Fs(e,1,0))}function Il(e){for(;e===fi;)fi=Ln[--Tn],Ln[Tn]=null,gi=Ln[--Tn],Ln[Tn]=null;for(;e===qr;)qr=Lt[--Tt],Lt[Tt]=null,fr=Lt[--Tt],Lt[Tt]=null,pr=Lt[--Tt],Lt[Tt]=null}var jt=null,St=null,Be=!1,Qt=null;function Os(e,t){var r=Ft(5,null,null,0);r.elementType="DELETED",r.stateNode=t,r.return=e,t=e.deletions,t===null?(e.deletions=[r],e.flags|=16):t.push(r)}function Ds(e,t){switch(e.tag){case 5:var r=e.type;return t=t.nodeType!==1||r.toLowerCase()!==t.nodeName.toLowerCase()?null:t,t!==null?(e.stateNode=t,jt=e,St=_r(t.firstChild),!0):!1;case 6:return t=e.pendingProps===""||t.nodeType!==3?null:t,t!==null?(e.stateNode=t,jt=e,St=null,!0):!1;case 13:return t=t.nodeType!==8?null:t,t!==null?(r=qr!==null?{id:pr,overflow:fr}:null,e.memoizedState={dehydrated:t,treeContext:r,retryLane:1073741824},r=Ft(18,null,null,0),r.stateNode=t,r.return=e,e.child=r,jt=e,St=null,!0):!1;default:return!1}}function Fl(e){return(e.mode&1)!==0&&(e.flags&128)===0}function Ol(e){if(Be){var t=St;if(t){var r=t;if(!Ds(e,t)){if(Fl(e))throw Error(c(418));t=_r(r.nextSibling);var n=jt;t&&Ds(e,t)?Os(n,r):(e.flags=e.flags&-4097|2,Be=!1,jt=e)}}else{if(Fl(e))throw Error(c(418));e.flags=e.flags&-4097|2,Be=!1,jt=e}}}function $s(e){for(e=e.return;e!==null&&e.tag!==5&&e.tag!==3&&e.tag!==13;)e=e.return;jt=e}function mi(e){if(e!==jt)return!1;if(!Be)return $s(e),Be=!0,!1;var t;if((t=e.tag!==3)&&!(t=e.tag!==5)&&(t=e.type,t=t!=="head"&&t!=="body"&&!El(e.type,e.memoizedProps)),t&&(t=St)){if(Fl(e))throw As(),Error(c(418));for(;t;)Os(e,t),t=_r(t.nextSibling)}if($s(e),e.tag===13){if(e=e.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(c(317));e:{for(e=e.nextSibling,t=0;e;){if(e.nodeType===8){var r=e.data;if(r==="/$"){if(t===0){St=_r(e.nextSibling);break e}t--}else r!=="$"&&r!=="$!"&&r!=="$?"||t++}e=e.nextSibling}St=null}}else St=jt?_r(e.stateNode.nextSibling):null;return!0}function As(){for(var e=St;e;)e=_r(e.nextSibling)}function Mn(){St=jt=null,Be=!1}function Dl(e){Qt===null?Qt=[e]:Qt.push(e)}var Wd=de.ReactCurrentBatchConfig;function jo(e,t,r){if(e=r.ref,e!==null&&typeof e!="function"&&typeof e!="object"){if(r._owner){if(r=r._owner,r){if(r.tag!==1)throw Error(c(309));var n=r.stateNode}if(!n)throw Error(c(147,e));var o=n,l=""+e;return t!==null&&t.ref!==null&&typeof t.ref=="function"&&t.ref._stringRef===l?t.ref:(t=function(a){var d=o.refs;a===null?delete d[l]:d[l]=a},t._stringRef=l,t)}if(typeof e!="string")throw Error(c(284));if(!r._owner)throw Error(c(290,e))}return e}function hi(e,t){throw e=Object.prototype.toString.call(t),Error(c(31,e==="[object Object]"?"object with keys {"+Object.keys(t).join(", ")+"}":e))}function Bs(e){var t=e._init;return t(e._payload)}function Us(e){function t(h,f){if(e){var x=h.deletions;x===null?(h.deletions=[f],h.flags|=16):x.push(f)}}function r(h,f){if(!e)return null;for(;f!==null;)t(h,f),f=f.sibling;return null}function n(h,f){for(h=new Map;f!==null;)f.key!==null?h.set(f.key,f):h.set(f.index,f),f=f.sibling;return h}function o(h,f){return h=Ar(h,f),h.index=0,h.sibling=null,h}function l(h,f,x){return h.index=x,e?(x=h.alternate,x!==null?(x=x.index,x<f?(h.flags|=2,f):x):(h.flags|=2,f)):(h.flags|=1048576,f)}function a(h){return e&&h.alternate===null&&(h.flags|=2),h}function d(h,f,x,L){return f===null||f.tag!==6?(f=_a(x,h.mode,L),f.return=h,f):(f=o(f,x),f.return=h,f)}function p(h,f,x,L){var K=x.type;return K===ze?C(h,f,x.props.children,L,x.key):f!==null&&(f.elementType===K||typeof K=="object"&&K!==null&&K.$$typeof===ae&&Bs(K)===f.type)?(L=o(f,x.props),L.ref=jo(h,f,x),L.return=h,L):(L=Ai(x.type,x.key,x.props,null,h.mode,L),L.ref=jo(h,f,x),L.return=h,L)}function y(h,f,x,L){return f===null||f.tag!==4||f.stateNode.containerInfo!==x.containerInfo||f.stateNode.implementation!==x.implementation?(f=Pa(x,h.mode,L),f.return=h,f):(f=o(f,x.children||[]),f.return=h,f)}function C(h,f,x,L,K){return f===null||f.tag!==7?(f=an(x,h.mode,L,K),f.return=h,f):(f=o(f,x),f.return=h,f)}function E(h,f,x){if(typeof f=="string"&&f!==""||typeof f=="number")return f=_a(""+f,h.mode,x),f.return=h,f;if(typeof f=="object"&&f!==null){switch(f.$$typeof){case ce:return x=Ai(f.type,f.key,f.props,null,h.mode,x),x.ref=jo(h,null,f),x.return=h,x;case he:return f=Pa(f,h.mode,x),f.return=h,f;case ae:var L=f._init;return E(h,L(f._payload),x)}if(pt(f)||W(f))return f=an(f,h.mode,x,null),f.return=h,f;hi(h,f)}return null}function N(h,f,x,L){var K=f!==null?f.key:null;if(typeof x=="string"&&x!==""||typeof x=="number")return K!==null?null:d(h,f,""+x,L);if(typeof x=="object"&&x!==null){switch(x.$$typeof){case ce:return x.key===K?p(h,f,x,L):null;case he:return x.key===K?y(h,f,x,L):null;case ae:return K=x._init,N(h,f,K(x._payload),L)}if(pt(x)||W(x))return K!==null?null:C(h,f,x,L,null);hi(h,x)}return null}function A(h,f,x,L,K){if(typeof L=="string"&&L!==""||typeof L=="number")return h=h.get(x)||null,d(f,h,""+L,K);if(typeof L=="object"&&L!==null){switch(L.$$typeof){case ce:return h=h.get(L.key===null?x:L.key)||null,p(f,h,L,K);case he:return h=h.get(L.key===null?x:L.key)||null,y(f,h,L,K);case ae:var ne=L._init;return A(h,f,x,ne(L._payload),K)}if(pt(L)||W(L))return h=h.get(x)||null,C(f,h,L,K,null);hi(f,L)}return null}function Q(h,f,x,L){for(var K=null,ne=null,oe=f,se=f=0,nt=null;oe!==null&&se<x.length;se++){oe.index>se?(nt=oe,oe=null):nt=oe.sibling;var Pe=N(h,oe,x[se],L);if(Pe===null){oe===null&&(oe=nt);break}e&&oe&&Pe.alternate===null&&t(h,oe),f=l(Pe,f,se),ne===null?K=Pe:ne.sibling=Pe,ne=Pe,oe=nt}if(se===x.length)return r(h,oe),Be&&Zr(h,se),K;if(oe===null){for(;se<x.length;se++)oe=E(h,x[se],L),oe!==null&&(f=l(oe,f,se),ne===null?K=oe:ne.sibling=oe,ne=oe);return Be&&Zr(h,se),K}for(oe=n(h,oe);se<x.length;se++)nt=A(oe,h,se,x[se],L),nt!==null&&(e&&nt.alternate!==null&&oe.delete(nt.key===null?se:nt.key),f=l(nt,f,se),ne===null?K=nt:ne.sibling=nt,ne=nt);return e&&oe.forEach(function(Br){return t(h,Br)}),Be&&Zr(h,se),K}function Y(h,f,x,L){var K=W(x);if(typeof K!="function")throw Error(c(150));if(x=K.call(x),x==null)throw Error(c(151));for(var ne=K=null,oe=f,se=f=0,nt=null,Pe=x.next();oe!==null&&!Pe.done;se++,Pe=x.next()){oe.index>se?(nt=oe,oe=null):nt=oe.sibling;var Br=N(h,oe,Pe.value,L);if(Br===null){oe===null&&(oe=nt);break}e&&oe&&Br.alternate===null&&t(h,oe),f=l(Br,f,se),ne===null?K=Br:ne.sibling=Br,ne=Br,oe=nt}if(Pe.done)return r(h,oe),Be&&Zr(h,se),K;if(oe===null){for(;!Pe.done;se++,Pe=x.next())Pe=E(h,Pe.value,L),Pe!==null&&(f=l(Pe,f,se),ne===null?K=Pe:ne.sibling=Pe,ne=Pe);return Be&&Zr(h,se),K}for(oe=n(h,oe);!Pe.done;se++,Pe=x.next())Pe=A(oe,h,se,Pe.value,L),Pe!==null&&(e&&Pe.alternate!==null&&oe.delete(Pe.key===null?se:Pe.key),f=l(Pe,f,se),ne===null?K=Pe:ne.sibling=Pe,ne=Pe);return e&&oe.forEach(function(zp){return t(h,zp)}),Be&&Zr(h,se),K}function Ke(h,f,x,L){if(typeof x=="object"&&x!==null&&x.type===ze&&x.key===null&&(x=x.props.children),typeof x=="object"&&x!==null){switch(x.$$typeof){case ce:e:{for(var K=x.key,ne=f;ne!==null;){if(ne.key===K){if(K=x.type,K===ze){if(ne.tag===7){r(h,ne.sibling),f=o(ne,x.props.children),f.return=h,h=f;break e}}else if(ne.elementType===K||typeof K=="object"&&K!==null&&K.$$typeof===ae&&Bs(K)===ne.type){r(h,ne.sibling),f=o(ne,x.props),f.ref=jo(h,ne,x),f.return=h,h=f;break e}r(h,ne);break}else t(h,ne);ne=ne.sibling}x.type===ze?(f=an(x.props.children,h.mode,L,x.key),f.return=h,h=f):(L=Ai(x.type,x.key,x.props,null,h.mode,L),L.ref=jo(h,f,x),L.return=h,h=L)}return a(h);case he:e:{for(ne=x.key;f!==null;){if(f.key===ne)if(f.tag===4&&f.stateNode.containerInfo===x.containerInfo&&f.stateNode.implementation===x.implementation){r(h,f.sibling),f=o(f,x.children||[]),f.return=h,h=f;break e}else{r(h,f);break}else t(h,f);f=f.sibling}f=Pa(x,h.mode,L),f.return=h,h=f}return a(h);case ae:return ne=x._init,Ke(h,f,ne(x._payload),L)}if(pt(x))return Q(h,f,x,L);if(W(x))return Y(h,f,x,L);hi(h,x)}return typeof x=="string"&&x!==""||typeof x=="number"?(x=""+x,f!==null&&f.tag===6?(r(h,f.sibling),f=o(f,x),f.return=h,h=f):(r(h,f),f=_a(x,h.mode,L),f.return=h,h=f),a(h)):r(h,f)}return Ke}var Rn=Us(!0),Ws=Us(!1),vi=Pr(null),xi=null,In=null,$l=null;function Al(){$l=In=xi=null}function Bl(e){var t=vi.current;De(vi),e._currentValue=t}function Ul(e,t,r){for(;e!==null;){var n=e.alternate;if((e.childLanes&t)!==t?(e.childLanes|=t,n!==null&&(n.childLanes|=t)):n!==null&&(n.childLanes&t)!==t&&(n.childLanes|=t),e===r)break;e=e.return}}function Fn(e,t){xi=e,$l=In=null,e=e.dependencies,e!==null&&e.firstContext!==null&&((e.lanes&t)!==0&&(vt=!0),e.firstContext=null)}function Mt(e){var t=e._currentValue;if($l!==e)if(e={context:e,memoizedValue:t,next:null},In===null){if(xi===null)throw Error(c(308));In=e,xi.dependencies={lanes:0,firstContext:e}}else In=In.next=e;return t}var Jr=null;function Wl(e){Jr===null?Jr=[e]:Jr.push(e)}function Hs(e,t,r,n){var o=t.interleaved;return o===null?(r.next=r,Wl(t)):(r.next=o.next,o.next=r),t.interleaved=r,gr(e,n)}function gr(e,t){e.lanes|=t;var r=e.alternate;for(r!==null&&(r.lanes|=t),r=e,e=e.return;e!==null;)e.childLanes|=t,r=e.alternate,r!==null&&(r.childLanes|=t),r=e,e=e.return;return r.tag===3?r.stateNode:null}var Mr=!1;function Hl(e){e.updateQueue={baseState:e.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null}}function Qs(e,t){e=e.updateQueue,t.updateQueue===e&&(t.updateQueue={baseState:e.baseState,firstBaseUpdate:e.firstBaseUpdate,lastBaseUpdate:e.lastBaseUpdate,shared:e.shared,effects:e.effects})}function mr(e,t){return{eventTime:e,lane:t,tag:0,payload:null,callback:null,next:null}}function Rr(e,t,r){var n=e.updateQueue;if(n===null)return null;if(n=n.shared,(Ce&2)!==0){var o=n.pending;return o===null?t.next=t:(t.next=o.next,o.next=t),n.pending=t,gr(e,r)}return o=n.interleaved,o===null?(t.next=t,Wl(n)):(t.next=o.next,o.next=t),n.interleaved=t,gr(e,r)}function yi(e,t,r){if(t=t.updateQueue,t!==null&&(t=t.shared,(r&4194240)!==0)){var n=t.lanes;n&=e.pendingLanes,r|=n,t.lanes=r,Fe(e,r)}}function Vs(e,t){var r=e.updateQueue,n=e.alternate;if(n!==null&&(n=n.updateQueue,r===n)){var o=null,l=null;if(r=r.firstBaseUpdate,r!==null){do{var a={eventTime:r.eventTime,lane:r.lane,tag:r.tag,payload:r.payload,callback:r.callback,next:null};l===null?o=l=a:l=l.next=a,r=r.next}while(r!==null);l===null?o=l=t:l=l.next=t}else o=l=t;r={baseState:n.baseState,firstBaseUpdate:o,lastBaseUpdate:l,shared:n.shared,effects:n.effects},e.updateQueue=r;return}e=r.lastBaseUpdate,e===null?r.firstBaseUpdate=t:e.next=t,r.lastBaseUpdate=t}function wi(e,t,r,n){var o=e.updateQueue;Mr=!1;var l=o.firstBaseUpdate,a=o.lastBaseUpdate,d=o.shared.pending;if(d!==null){o.shared.pending=null;var p=d,y=p.next;p.next=null,a===null?l=y:a.next=y,a=p;var C=e.alternate;C!==null&&(C=C.updateQueue,d=C.lastBaseUpdate,d!==a&&(d===null?C.firstBaseUpdate=y:d.next=y,C.lastBaseUpdate=p))}if(l!==null){var E=o.baseState;a=0,C=y=p=null,d=l;do{var N=d.lane,A=d.eventTime;if((n&N)===N){C!==null&&(C=C.next={eventTime:A,lane:0,tag:d.tag,payload:d.payload,callback:d.callback,next:null});e:{var Q=e,Y=d;switch(N=t,A=r,Y.tag){case 1:if(Q=Y.payload,typeof Q=="function"){E=Q.call(A,E,N);break e}E=Q;break e;case 3:Q.flags=Q.flags&-65537|128;case 0:if(Q=Y.payload,N=typeof Q=="function"?Q.call(A,E,N):Q,N==null)break e;E=I({},E,N);break e;case 2:Mr=!0}}d.callback!==null&&d.lane!==0&&(e.flags|=64,N=o.effects,N===null?o.effects=[d]:N.push(d))}else A={eventTime:A,lane:N,tag:d.tag,payload:d.payload,callback:d.callback,next:null},C===null?(y=C=A,p=E):C=C.next=A,a|=N;if(d=d.next,d===null){if(d=o.shared.pending,d===null)break;N=d,d=N.next,N.next=null,o.lastBaseUpdate=N,o.shared.pending=null}}while(!0);if(C===null&&(p=E),o.baseState=p,o.firstBaseUpdate=y,o.lastBaseUpdate=C,t=o.shared.interleaved,t!==null){o=t;do a|=o.lane,o=o.next;while(o!==t)}else l===null&&(o.shared.lanes=0);rn|=a,e.lanes=a,e.memoizedState=E}}function Ys(e,t,r){if(e=t.effects,t.effects=null,e!==null)for(t=0;t<e.length;t++){var n=e[t],o=n.callback;if(o!==null){if(n.callback=null,n=r,typeof o!="function")throw Error(c(191,o));o.call(n)}}}var So={},or=Pr(So),No=Pr(So),Co=Pr(So);function en(e){if(e===So)throw Error(c(174));return e}function Ql(e,t){switch(Ie(Co,t),Ie(No,e),Ie(or,So),e=t.nodeType,e){case 9:case 11:t=(t=t.documentElement)?t.namespaceURI:dn(null,"");break;default:e=e===8?t.parentNode:t,t=e.namespaceURI||null,e=e.tagName,t=dn(t,e)}De(or),Ie(or,t)}function On(){De(or),De(No),De(Co)}function Ks(e){en(Co.current);var t=en(or.current),r=dn(t,e.type);t!==r&&(Ie(No,e),Ie(or,r))}function Vl(e){No.current===e&&(De(or),De(No))}var We=Pr(0);function bi(e){for(var t=e;t!==null;){if(t.tag===13){var r=t.memoizedState;if(r!==null&&(r=r.dehydrated,r===null||r.data==="$?"||r.data==="$!"))return t}else if(t.tag===19&&t.memoizedProps.revealOrder!==void 0){if((t.flags&128)!==0)return t}else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return null;t=t.return}t.sibling.return=t.return,t=t.sibling}return null}var Yl=[];function Kl(){for(var e=0;e<Yl.length;e++)Yl[e]._workInProgressVersionPrimary=null;Yl.length=0}var zi=de.ReactCurrentDispatcher,Gl=de.ReactCurrentBatchConfig,tn=0,He=null,Ze=null,tt=null,ki=!1,Eo=!1,_o=0,Hd=0;function at(){throw Error(c(321))}function Xl(e,t){if(t===null)return!1;for(var r=0;r<t.length&&r<e.length;r++)if(!Ht(e[r],t[r]))return!1;return!0}function ql(e,t,r,n,o,l){if(tn=l,He=t,t.memoizedState=null,t.updateQueue=null,t.lanes=0,zi.current=e===null||e.memoizedState===null?Kd:Gd,e=r(n,o),Eo){l=0;do{if(Eo=!1,_o=0,25<=l)throw Error(c(301));l+=1,tt=Ze=null,t.updateQueue=null,zi.current=Xd,e=r(n,o)}while(Eo)}if(zi.current=Ni,t=Ze!==null&&Ze.next!==null,tn=0,tt=Ze=He=null,ki=!1,t)throw Error(c(300));return e}function Zl(){var e=_o!==0;return _o=0,e}function ir(){var e={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return tt===null?He.memoizedState=tt=e:tt=tt.next=e,tt}function Rt(){if(Ze===null){var e=He.alternate;e=e!==null?e.memoizedState:null}else e=Ze.next;var t=tt===null?He.memoizedState:tt.next;if(t!==null)tt=t,Ze=e;else{if(e===null)throw Error(c(310));Ze=e,e={memoizedState:Ze.memoizedState,baseState:Ze.baseState,baseQueue:Ze.baseQueue,queue:Ze.queue,next:null},tt===null?He.memoizedState=tt=e:tt=tt.next=e}return tt}function Po(e,t){return typeof t=="function"?t(e):t}function Jl(e){var t=Rt(),r=t.queue;if(r===null)throw Error(c(311));r.lastRenderedReducer=e;var n=Ze,o=n.baseQueue,l=r.pending;if(l!==null){if(o!==null){var a=o.next;o.next=l.next,l.next=a}n.baseQueue=o=l,r.pending=null}if(o!==null){l=o.next,n=n.baseState;var d=a=null,p=null,y=l;do{var C=y.lane;if((tn&C)===C)p!==null&&(p=p.next={lane:0,action:y.action,hasEagerState:y.hasEagerState,eagerState:y.eagerState,next:null}),n=y.hasEagerState?y.eagerState:e(n,y.action);else{var E={lane:C,action:y.action,hasEagerState:y.hasEagerState,eagerState:y.eagerState,next:null};p===null?(d=p=E,a=n):p=p.next=E,He.lanes|=C,rn|=C}y=y.next}while(y!==null&&y!==l);p===null?a=n:p.next=d,Ht(n,t.memoizedState)||(vt=!0),t.memoizedState=n,t.baseState=a,t.baseQueue=p,r.lastRenderedState=n}if(e=r.interleaved,e!==null){o=e;do l=o.lane,He.lanes|=l,rn|=l,o=o.next;while(o!==e)}else o===null&&(r.lanes=0);return[t.memoizedState,r.dispatch]}function ea(e){var t=Rt(),r=t.queue;if(r===null)throw Error(c(311));r.lastRenderedReducer=e;var n=r.dispatch,o=r.pending,l=t.memoizedState;if(o!==null){r.pending=null;var a=o=o.next;do l=e(l,a.action),a=a.next;while(a!==o);Ht(l,t.memoizedState)||(vt=!0),t.memoizedState=l,t.baseQueue===null&&(t.baseState=l),r.lastRenderedState=l}return[l,n]}function Gs(){}function Xs(e,t){var r=He,n=Rt(),o=t(),l=!Ht(n.memoizedState,o);if(l&&(n.memoizedState=o,vt=!0),n=n.queue,ta(Js.bind(null,r,n,e),[e]),n.getSnapshot!==t||l||tt!==null&&tt.memoizedState.tag&1){if(r.flags|=2048,Lo(9,Zs.bind(null,r,n,o,t),void 0,null),rt===null)throw Error(c(349));(tn&30)!==0||qs(r,t,o)}return o}function qs(e,t,r){e.flags|=16384,e={getSnapshot:t,value:r},t=He.updateQueue,t===null?(t={lastEffect:null,stores:null},He.updateQueue=t,t.stores=[e]):(r=t.stores,r===null?t.stores=[e]:r.push(e))}function Zs(e,t,r,n){t.value=r,t.getSnapshot=n,eu(t)&&tu(e)}function Js(e,t,r){return r(function(){eu(t)&&tu(e)})}function eu(e){var t=e.getSnapshot;e=e.value;try{var r=t();return!Ht(e,r)}catch{return!0}}function tu(e){var t=gr(e,1);t!==null&&Gt(t,e,1,-1)}function ru(e){var t=ir();return typeof e=="function"&&(e=e()),t.memoizedState=t.baseState=e,e={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:Po,lastRenderedState:e},t.queue=e,e=e.dispatch=Yd.bind(null,He,e),[t.memoizedState,e]}function Lo(e,t,r,n){return e={tag:e,create:t,destroy:r,deps:n,next:null},t=He.updateQueue,t===null?(t={lastEffect:null,stores:null},He.updateQueue=t,t.lastEffect=e.next=e):(r=t.lastEffect,r===null?t.lastEffect=e.next=e:(n=r.next,r.next=e,e.next=n,t.lastEffect=e)),e}function nu(){return Rt().memoizedState}function ji(e,t,r,n){var o=ir();He.flags|=e,o.memoizedState=Lo(1|t,r,void 0,n===void 0?null:n)}function Si(e,t,r,n){var o=Rt();n=n===void 0?null:n;var l=void 0;if(Ze!==null){var a=Ze.memoizedState;if(l=a.destroy,n!==null&&Xl(n,a.deps)){o.memoizedState=Lo(t,r,l,n);return}}He.flags|=e,o.memoizedState=Lo(1|t,r,l,n)}function ou(e,t){return ji(8390656,8,e,t)}function ta(e,t){return Si(2048,8,e,t)}function iu(e,t){return Si(4,2,e,t)}function lu(e,t){return Si(4,4,e,t)}function au(e,t){if(typeof t=="function")return e=e(),t(e),function(){t(null)};if(t!=null)return e=e(),t.current=e,function(){t.current=null}}function su(e,t,r){return r=r!=null?r.concat([e]):null,Si(4,4,au.bind(null,t,e),r)}function ra(){}function uu(e,t){var r=Rt();t=t===void 0?null:t;var n=r.memoizedState;return n!==null&&t!==null&&Xl(t,n[1])?n[0]:(r.memoizedState=[e,t],e)}function cu(e,t){var r=Rt();t=t===void 0?null:t;var n=r.memoizedState;return n!==null&&t!==null&&Xl(t,n[1])?n[0]:(e=e(),r.memoizedState=[e,t],e)}function du(e,t,r){return(tn&21)===0?(e.baseState&&(e.baseState=!1,vt=!0),e.memoizedState=r):(Ht(r,t)||(r=ie(),He.lanes|=r,rn|=r,e.baseState=!0),t)}function Qd(e,t){var r=pe;pe=r!==0&&4>r?r:4,e(!0);var n=Gl.transition;Gl.transition={};try{e(!1),t()}finally{pe=r,Gl.transition=n}}function pu(){return Rt().memoizedState}function Vd(e,t,r){var n=Dr(e);if(r={lane:n,action:r,hasEagerState:!1,eagerState:null,next:null},fu(e))gu(t,r);else if(r=Hs(e,t,r,n),r!==null){var o=dt();Gt(r,e,n,o),mu(r,t,n)}}function Yd(e,t,r){var n=Dr(e),o={lane:n,action:r,hasEagerState:!1,eagerState:null,next:null};if(fu(e))gu(t,o);else{var l=e.alternate;if(e.lanes===0&&(l===null||l.lanes===0)&&(l=t.lastRenderedReducer,l!==null))try{var a=t.lastRenderedState,d=l(a,r);if(o.hasEagerState=!0,o.eagerState=d,Ht(d,a)){var p=t.interleaved;p===null?(o.next=o,Wl(t)):(o.next=p.next,p.next=o),t.interleaved=o;return}}catch{}finally{}r=Hs(e,t,o,n),r!==null&&(o=dt(),Gt(r,e,n,o),mu(r,t,n))}}function fu(e){var t=e.alternate;return e===He||t!==null&&t===He}function gu(e,t){Eo=ki=!0;var r=e.pending;r===null?t.next=t:(t.next=r.next,r.next=t),e.pending=t}function mu(e,t,r){if((r&4194240)!==0){var n=t.lanes;n&=e.pendingLanes,r|=n,t.lanes=r,Fe(e,r)}}var Ni={readContext:Mt,useCallback:at,useContext:at,useEffect:at,useImperativeHandle:at,useInsertionEffect:at,useLayoutEffect:at,useMemo:at,useReducer:at,useRef:at,useState:at,useDebugValue:at,useDeferredValue:at,useTransition:at,useMutableSource:at,useSyncExternalStore:at,useId:at,unstable_isNewReconciler:!1},Kd={readContext:Mt,useCallback:function(e,t){return ir().memoizedState=[e,t===void 0?null:t],e},useContext:Mt,useEffect:ou,useImperativeHandle:function(e,t,r){return r=r!=null?r.concat([e]):null,ji(4194308,4,au.bind(null,t,e),r)},useLayoutEffect:function(e,t){return ji(4194308,4,e,t)},useInsertionEffect:function(e,t){return ji(4,2,e,t)},useMemo:function(e,t){var r=ir();return t=t===void 0?null:t,e=e(),r.memoizedState=[e,t],e},useReducer:function(e,t,r){var n=ir();return t=r!==void 0?r(t):t,n.memoizedState=n.baseState=t,e={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:e,lastRenderedState:t},n.queue=e,e=e.dispatch=Vd.bind(null,He,e),[n.memoizedState,e]},useRef:function(e){var t=ir();return e={current:e},t.memoizedState=e},useState:ru,useDebugValue:ra,useDeferredValue:function(e){return ir().memoizedState=e},useTransition:function(){var e=ru(!1),t=e[0];return e=Qd.bind(null,e[1]),ir().memoizedState=e,[t,e]},useMutableSource:function(){},useSyncExternalStore:function(e,t,r){var n=He,o=ir();if(Be){if(r===void 0)throw Error(c(407));r=r()}else{if(r=t(),rt===null)throw Error(c(349));(tn&30)!==0||qs(n,t,r)}o.memoizedState=r;var l={value:r,getSnapshot:t};return o.queue=l,ou(Js.bind(null,n,l,e),[e]),n.flags|=2048,Lo(9,Zs.bind(null,n,l,r,t),void 0,null),r},useId:function(){var e=ir(),t=rt.identifierPrefix;if(Be){var r=fr,n=pr;r=(n&~(1<<32-gt(n)-1)).toString(32)+r,t=":"+t+"R"+r,r=_o++,0<r&&(t+="H"+r.toString(32)),t+=":"}else r=Hd++,t=":"+t+"r"+r.toString(32)+":";return e.memoizedState=t},unstable_isNewReconciler:!1},Gd={readContext:Mt,useCallback:uu,useContext:Mt,useEffect:ta,useImperativeHandle:su,useInsertionEffect:iu,useLayoutEffect:lu,useMemo:cu,useReducer:Jl,useRef:nu,useState:function(){return Jl(Po)},useDebugValue:ra,useDeferredValue:function(e){var t=Rt();return du(t,Ze.memoizedState,e)},useTransition:function(){var e=Jl(Po)[0],t=Rt().memoizedState;return[e,t]},useMutableSource:Gs,useSyncExternalStore:Xs,useId:pu,unstable_isNewReconciler:!1},Xd={readContext:Mt,useCallback:uu,useContext:Mt,useEffect:ta,useImperativeHandle:su,useInsertionEffect:iu,useLayoutEffect:lu,useMemo:cu,useReducer:ea,useRef:nu,useState:function(){return ea(Po)},useDebugValue:ra,useDeferredValue:function(e){var t=Rt();return Ze===null?t.memoizedState=e:du(t,Ze.memoizedState,e)},useTransition:function(){var e=ea(Po)[0],t=Rt().memoizedState;return[e,t]},useMutableSource:Gs,useSyncExternalStore:Xs,useId:pu,unstable_isNewReconciler:!1};function Vt(e,t){if(e&&e.defaultProps){t=I({},t),e=e.defaultProps;for(var r in e)t[r]===void 0&&(t[r]=e[r]);return t}return t}function na(e,t,r,n){t=e.memoizedState,r=r(n,t),r=r==null?t:I({},t,r),e.memoizedState=r,e.lanes===0&&(e.updateQueue.baseState=r)}var Ci={isMounted:function(e){return(e=e._reactInternals)?Pt(e)===e:!1},enqueueSetState:function(e,t,r){e=e._reactInternals;var n=dt(),o=Dr(e),l=mr(n,o);l.payload=t,r!=null&&(l.callback=r),t=Rr(e,l,o),t!==null&&(Gt(t,e,o,n),yi(t,e,o))},enqueueReplaceState:function(e,t,r){e=e._reactInternals;var n=dt(),o=Dr(e),l=mr(n,o);l.tag=1,l.payload=t,r!=null&&(l.callback=r),t=Rr(e,l,o),t!==null&&(Gt(t,e,o,n),yi(t,e,o))},enqueueForceUpdate:function(e,t){e=e._reactInternals;var r=dt(),n=Dr(e),o=mr(r,n);o.tag=2,t!=null&&(o.callback=t),t=Rr(e,o,n),t!==null&&(Gt(t,e,n,r),yi(t,e,n))}};function hu(e,t,r,n,o,l,a){return e=e.stateNode,typeof e.shouldComponentUpdate=="function"?e.shouldComponentUpdate(n,l,a):t.prototype&&t.prototype.isPureReactComponent?!vo(r,n)||!vo(o,l):!0}function vu(e,t,r){var n=!1,o=Lr,l=t.contextType;return typeof l=="object"&&l!==null?l=Mt(l):(o=ht(t)?Xr:lt.current,n=t.contextTypes,l=(n=n!=null)?Pn(e,o):Lr),t=new t(r,l),e.memoizedState=t.state!==null&&t.state!==void 0?t.state:null,t.updater=Ci,e.stateNode=t,t._reactInternals=e,n&&(e=e.stateNode,e.__reactInternalMemoizedUnmaskedChildContext=o,e.__reactInternalMemoizedMaskedChildContext=l),t}function xu(e,t,r,n){e=t.state,typeof t.componentWillReceiveProps=="function"&&t.componentWillReceiveProps(r,n),typeof t.UNSAFE_componentWillReceiveProps=="function"&&t.UNSAFE_componentWillReceiveProps(r,n),t.state!==e&&Ci.enqueueReplaceState(t,t.state,null)}function oa(e,t,r,n){var o=e.stateNode;o.props=r,o.state=e.memoizedState,o.refs={},Hl(e);var l=t.contextType;typeof l=="object"&&l!==null?o.context=Mt(l):(l=ht(t)?Xr:lt.current,o.context=Pn(e,l)),o.state=e.memoizedState,l=t.getDerivedStateFromProps,typeof l=="function"&&(na(e,t,l,r),o.state=e.memoizedState),typeof t.getDerivedStateFromProps=="function"||typeof o.getSnapshotBeforeUpdate=="function"||typeof o.UNSAFE_componentWillMount!="function"&&typeof o.componentWillMount!="function"||(t=o.state,typeof o.componentWillMount=="function"&&o.componentWillMount(),typeof o.UNSAFE_componentWillMount=="function"&&o.UNSAFE_componentWillMount(),t!==o.state&&Ci.enqueueReplaceState(o,o.state,null),wi(e,r,o,n),o.state=e.memoizedState),typeof o.componentDidMount=="function"&&(e.flags|=4194308)}function Dn(e,t){try{var r="",n=t;do r+=ke(n),n=n.return;while(n);var o=r}catch(l){o=`
Error generating stack: `+l.message+`
`+l.stack}return{value:e,source:t,stack:o,digest:null}}function ia(e,t,r){return{value:e,source:null,stack:r??null,digest:t??null}}function la(e,t){try{console.error(t.value)}catch(r){setTimeout(function(){throw r})}}var qd=typeof WeakMap=="function"?WeakMap:Map;function yu(e,t,r){r=mr(-1,r),r.tag=3,r.payload={element:null};var n=t.value;return r.callback=function(){Ri||(Ri=!0,ba=n),la(e,t)},r}function wu(e,t,r){r=mr(-1,r),r.tag=3;var n=e.type.getDerivedStateFromError;if(typeof n=="function"){var o=t.value;r.payload=function(){return n(o)},r.callback=function(){la(e,t)}}var l=e.stateNode;return l!==null&&typeof l.componentDidCatch=="function"&&(r.callback=function(){la(e,t),typeof n!="function"&&(Fr===null?Fr=new Set([this]):Fr.add(this));var a=t.stack;this.componentDidCatch(t.value,{componentStack:a!==null?a:""})}),r}function bu(e,t,r){var n=e.pingCache;if(n===null){n=e.pingCache=new qd;var o=new Set;n.set(t,o)}else o=n.get(t),o===void 0&&(o=new Set,n.set(t,o));o.has(r)||(o.add(r),e=dp.bind(null,e,t,r),t.then(e,e))}function zu(e){do{var t;if((t=e.tag===13)&&(t=e.memoizedState,t=t!==null?t.dehydrated!==null:!0),t)return e;e=e.return}while(e!==null);return null}function ku(e,t,r,n,o){return(e.mode&1)===0?(e===t?e.flags|=65536:(e.flags|=128,r.flags|=131072,r.flags&=-52805,r.tag===1&&(r.alternate===null?r.tag=17:(t=mr(-1,1),t.tag=2,Rr(r,t,1))),r.lanes|=1),e):(e.flags|=65536,e.lanes=o,e)}var Zd=de.ReactCurrentOwner,vt=!1;function ct(e,t,r,n){t.child=e===null?Ws(t,null,r,n):Rn(t,e.child,r,n)}function ju(e,t,r,n,o){r=r.render;var l=t.ref;return Fn(t,o),n=ql(e,t,r,n,l,o),r=Zl(),e!==null&&!vt?(t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~o,hr(e,t,o)):(Be&&r&&Rl(t),t.flags|=1,ct(e,t,n,o),t.child)}function Su(e,t,r,n,o){if(e===null){var l=r.type;return typeof l=="function"&&!Ea(l)&&l.defaultProps===void 0&&r.compare===null&&r.defaultProps===void 0?(t.tag=15,t.type=l,Nu(e,t,l,n,o)):(e=Ai(r.type,null,n,t,t.mode,o),e.ref=t.ref,e.return=t,t.child=e)}if(l=e.child,(e.lanes&o)===0){var a=l.memoizedProps;if(r=r.compare,r=r!==null?r:vo,r(a,n)&&e.ref===t.ref)return hr(e,t,o)}return t.flags|=1,e=Ar(l,n),e.ref=t.ref,e.return=t,t.child=e}function Nu(e,t,r,n,o){if(e!==null){var l=e.memoizedProps;if(vo(l,n)&&e.ref===t.ref)if(vt=!1,t.pendingProps=n=l,(e.lanes&o)!==0)(e.flags&131072)!==0&&(vt=!0);else return t.lanes=e.lanes,hr(e,t,o)}return aa(e,t,r,n,o)}function Cu(e,t,r){var n=t.pendingProps,o=n.children,l=e!==null?e.memoizedState:null;if(n.mode==="hidden")if((t.mode&1)===0)t.memoizedState={baseLanes:0,cachePool:null,transitions:null},Ie(An,Nt),Nt|=r;else{if((r&1073741824)===0)return e=l!==null?l.baseLanes|r:r,t.lanes=t.childLanes=1073741824,t.memoizedState={baseLanes:e,cachePool:null,transitions:null},t.updateQueue=null,Ie(An,Nt),Nt|=e,null;t.memoizedState={baseLanes:0,cachePool:null,transitions:null},n=l!==null?l.baseLanes:r,Ie(An,Nt),Nt|=n}else l!==null?(n=l.baseLanes|r,t.memoizedState=null):n=r,Ie(An,Nt),Nt|=n;return ct(e,t,o,r),t.child}function Eu(e,t){var r=t.ref;(e===null&&r!==null||e!==null&&e.ref!==r)&&(t.flags|=512,t.flags|=2097152)}function aa(e,t,r,n,o){var l=ht(r)?Xr:lt.current;return l=Pn(t,l),Fn(t,o),r=ql(e,t,r,n,l,o),n=Zl(),e!==null&&!vt?(t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~o,hr(e,t,o)):(Be&&n&&Rl(t),t.flags|=1,ct(e,t,r,o),t.child)}function _u(e,t,r,n,o){if(ht(r)){var l=!0;di(t)}else l=!1;if(Fn(t,o),t.stateNode===null)_i(e,t),vu(t,r,n),oa(t,r,n,o),n=!0;else if(e===null){var a=t.stateNode,d=t.memoizedProps;a.props=d;var p=a.context,y=r.contextType;typeof y=="object"&&y!==null?y=Mt(y):(y=ht(r)?Xr:lt.current,y=Pn(t,y));var C=r.getDerivedStateFromProps,E=typeof C=="function"||typeof a.getSnapshotBeforeUpdate=="function";E||typeof a.UNSAFE_componentWillReceiveProps!="function"&&typeof a.componentWillReceiveProps!="function"||(d!==n||p!==y)&&xu(t,a,n,y),Mr=!1;var N=t.memoizedState;a.state=N,wi(t,n,a,o),p=t.memoizedState,d!==n||N!==p||mt.current||Mr?(typeof C=="function"&&(na(t,r,C,n),p=t.memoizedState),(d=Mr||hu(t,r,d,n,N,p,y))?(E||typeof a.UNSAFE_componentWillMount!="function"&&typeof a.componentWillMount!="function"||(typeof a.componentWillMount=="function"&&a.componentWillMount(),typeof a.UNSAFE_componentWillMount=="function"&&a.UNSAFE_componentWillMount()),typeof a.componentDidMount=="function"&&(t.flags|=4194308)):(typeof a.componentDidMount=="function"&&(t.flags|=4194308),t.memoizedProps=n,t.memoizedState=p),a.props=n,a.state=p,a.context=y,n=d):(typeof a.componentDidMount=="function"&&(t.flags|=4194308),n=!1)}else{a=t.stateNode,Qs(e,t),d=t.memoizedProps,y=t.type===t.elementType?d:Vt(t.type,d),a.props=y,E=t.pendingProps,N=a.context,p=r.contextType,typeof p=="object"&&p!==null?p=Mt(p):(p=ht(r)?Xr:lt.current,p=Pn(t,p));var A=r.getDerivedStateFromProps;(C=typeof A=="function"||typeof a.getSnapshotBeforeUpdate=="function")||typeof a.UNSAFE_componentWillReceiveProps!="function"&&typeof a.componentWillReceiveProps!="function"||(d!==E||N!==p)&&xu(t,a,n,p),Mr=!1,N=t.memoizedState,a.state=N,wi(t,n,a,o);var Q=t.memoizedState;d!==E||N!==Q||mt.current||Mr?(typeof A=="function"&&(na(t,r,A,n),Q=t.memoizedState),(y=Mr||hu(t,r,y,n,N,Q,p)||!1)?(C||typeof a.UNSAFE_componentWillUpdate!="function"&&typeof a.componentWillUpdate!="function"||(typeof a.componentWillUpdate=="function"&&a.componentWillUpdate(n,Q,p),typeof a.UNSAFE_componentWillUpdate=="function"&&a.UNSAFE_componentWillUpdate(n,Q,p)),typeof a.componentDidUpdate=="function"&&(t.flags|=4),typeof a.getSnapshotBeforeUpdate=="function"&&(t.flags|=1024)):(typeof a.componentDidUpdate!="function"||d===e.memoizedProps&&N===e.memoizedState||(t.flags|=4),typeof a.getSnapshotBeforeUpdate!="function"||d===e.memoizedProps&&N===e.memoizedState||(t.flags|=1024),t.memoizedProps=n,t.memoizedState=Q),a.props=n,a.state=Q,a.context=p,n=y):(typeof a.componentDidUpdate!="function"||d===e.memoizedProps&&N===e.memoizedState||(t.flags|=4),typeof a.getSnapshotBeforeUpdate!="function"||d===e.memoizedProps&&N===e.memoizedState||(t.flags|=1024),n=!1)}return sa(e,t,r,n,l,o)}function sa(e,t,r,n,o,l){Eu(e,t);var a=(t.flags&128)!==0;if(!n&&!a)return o&&Rs(t,r,!1),hr(e,t,l);n=t.stateNode,Zd.current=t;var d=a&&typeof r.getDerivedStateFromError!="function"?null:n.render();return t.flags|=1,e!==null&&a?(t.child=Rn(t,e.child,null,l),t.child=Rn(t,null,d,l)):ct(e,t,d,l),t.memoizedState=n.state,o&&Rs(t,r,!0),t.child}function Pu(e){var t=e.stateNode;t.pendingContext?Ts(e,t.pendingContext,t.pendingContext!==t.context):t.context&&Ts(e,t.context,!1),Ql(e,t.containerInfo)}function Lu(e,t,r,n,o){return Mn(),Dl(o),t.flags|=256,ct(e,t,r,n),t.child}var ua={dehydrated:null,treeContext:null,retryLane:0};function ca(e){return{baseLanes:e,cachePool:null,transitions:null}}function Tu(e,t,r){var n=t.pendingProps,o=We.current,l=!1,a=(t.flags&128)!==0,d;if((d=a)||(d=e!==null&&e.memoizedState===null?!1:(o&2)!==0),d?(l=!0,t.flags&=-129):(e===null||e.memoizedState!==null)&&(o|=1),Ie(We,o&1),e===null)return Ol(t),e=t.memoizedState,e!==null&&(e=e.dehydrated,e!==null)?((t.mode&1)===0?t.lanes=1:e.data==="$!"?t.lanes=8:t.lanes=1073741824,null):(a=n.children,e=n.fallback,l?(n=t.mode,l=t.child,a={mode:"hidden",children:a},(n&1)===0&&l!==null?(l.childLanes=0,l.pendingProps=a):l=Bi(a,n,0,null),e=an(e,n,r,null),l.return=t,e.return=t,l.sibling=e,t.child=l,t.child.memoizedState=ca(r),t.memoizedState=ua,e):da(t,a));if(o=e.memoizedState,o!==null&&(d=o.dehydrated,d!==null))return Jd(e,t,a,n,d,o,r);if(l){l=n.fallback,a=t.mode,o=e.child,d=o.sibling;var p={mode:"hidden",children:n.children};return(a&1)===0&&t.child!==o?(n=t.child,n.childLanes=0,n.pendingProps=p,t.deletions=null):(n=Ar(o,p),n.subtreeFlags=o.subtreeFlags&14680064),d!==null?l=Ar(d,l):(l=an(l,a,r,null),l.flags|=2),l.return=t,n.return=t,n.sibling=l,t.child=n,n=l,l=t.child,a=e.child.memoizedState,a=a===null?ca(r):{baseLanes:a.baseLanes|r,cachePool:null,transitions:a.transitions},l.memoizedState=a,l.childLanes=e.childLanes&~r,t.memoizedState=ua,n}return l=e.child,e=l.sibling,n=Ar(l,{mode:"visible",children:n.children}),(t.mode&1)===0&&(n.lanes=r),n.return=t,n.sibling=null,e!==null&&(r=t.deletions,r===null?(t.deletions=[e],t.flags|=16):r.push(e)),t.child=n,t.memoizedState=null,n}function da(e,t){return t=Bi({mode:"visible",children:t},e.mode,0,null),t.return=e,e.child=t}function Ei(e,t,r,n){return n!==null&&Dl(n),Rn(t,e.child,null,r),e=da(t,t.pendingProps.children),e.flags|=2,t.memoizedState=null,e}function Jd(e,t,r,n,o,l,a){if(r)return t.flags&256?(t.flags&=-257,n=ia(Error(c(422))),Ei(e,t,a,n)):t.memoizedState!==null?(t.child=e.child,t.flags|=128,null):(l=n.fallback,o=t.mode,n=Bi({mode:"visible",children:n.children},o,0,null),l=an(l,o,a,null),l.flags|=2,n.return=t,l.return=t,n.sibling=l,t.child=n,(t.mode&1)!==0&&Rn(t,e.child,null,a),t.child.memoizedState=ca(a),t.memoizedState=ua,l);if((t.mode&1)===0)return Ei(e,t,a,null);if(o.data==="$!"){if(n=o.nextSibling&&o.nextSibling.dataset,n)var d=n.dgst;return n=d,l=Error(c(419)),n=ia(l,n,void 0),Ei(e,t,a,n)}if(d=(a&e.childLanes)!==0,vt||d){if(n=rt,n!==null){switch(a&-a){case 4:o=2;break;case 16:o=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:o=32;break;case 536870912:o=268435456;break;default:o=0}o=(o&(n.suspendedLanes|a))!==0?0:o,o!==0&&o!==l.retryLane&&(l.retryLane=o,gr(e,o),Gt(n,e,o,-1))}return Ca(),n=ia(Error(c(421))),Ei(e,t,a,n)}return o.data==="$?"?(t.flags|=128,t.child=e.child,t=pp.bind(null,e),o._reactRetry=t,null):(e=l.treeContext,St=_r(o.nextSibling),jt=t,Be=!0,Qt=null,e!==null&&(Lt[Tt++]=pr,Lt[Tt++]=fr,Lt[Tt++]=qr,pr=e.id,fr=e.overflow,qr=t),t=da(t,n.children),t.flags|=4096,t)}function Mu(e,t,r){e.lanes|=t;var n=e.alternate;n!==null&&(n.lanes|=t),Ul(e.return,t,r)}function pa(e,t,r,n,o){var l=e.memoizedState;l===null?e.memoizedState={isBackwards:t,rendering:null,renderingStartTime:0,last:n,tail:r,tailMode:o}:(l.isBackwards=t,l.rendering=null,l.renderingStartTime=0,l.last=n,l.tail=r,l.tailMode=o)}function Ru(e,t,r){var n=t.pendingProps,o=n.revealOrder,l=n.tail;if(ct(e,t,n.children,r),n=We.current,(n&2)!==0)n=n&1|2,t.flags|=128;else{if(e!==null&&(e.flags&128)!==0)e:for(e=t.child;e!==null;){if(e.tag===13)e.memoizedState!==null&&Mu(e,r,t);else if(e.tag===19)Mu(e,r,t);else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break e;for(;e.sibling===null;){if(e.return===null||e.return===t)break e;e=e.return}e.sibling.return=e.return,e=e.sibling}n&=1}if(Ie(We,n),(t.mode&1)===0)t.memoizedState=null;else switch(o){case"forwards":for(r=t.child,o=null;r!==null;)e=r.alternate,e!==null&&bi(e)===null&&(o=r),r=r.sibling;r=o,r===null?(o=t.child,t.child=null):(o=r.sibling,r.sibling=null),pa(t,!1,o,r,l);break;case"backwards":for(r=null,o=t.child,t.child=null;o!==null;){if(e=o.alternate,e!==null&&bi(e)===null){t.child=o;break}e=o.sibling,o.sibling=r,r=o,o=e}pa(t,!0,r,null,l);break;case"together":pa(t,!1,null,null,void 0);break;default:t.memoizedState=null}return t.child}function _i(e,t){(t.mode&1)===0&&e!==null&&(e.alternate=null,t.alternate=null,t.flags|=2)}function hr(e,t,r){if(e!==null&&(t.dependencies=e.dependencies),rn|=t.lanes,(r&t.childLanes)===0)return null;if(e!==null&&t.child!==e.child)throw Error(c(153));if(t.child!==null){for(e=t.child,r=Ar(e,e.pendingProps),t.child=r,r.return=t;e.sibling!==null;)e=e.sibling,r=r.sibling=Ar(e,e.pendingProps),r.return=t;r.sibling=null}return t.child}function ep(e,t,r){switch(t.tag){case 3:Pu(t),Mn();break;case 5:Ks(t);break;case 1:ht(t.type)&&di(t);break;case 4:Ql(t,t.stateNode.containerInfo);break;case 10:var n=t.type._context,o=t.memoizedProps.value;Ie(vi,n._currentValue),n._currentValue=o;break;case 13:if(n=t.memoizedState,n!==null)return n.dehydrated!==null?(Ie(We,We.current&1),t.flags|=128,null):(r&t.child.childLanes)!==0?Tu(e,t,r):(Ie(We,We.current&1),e=hr(e,t,r),e!==null?e.sibling:null);Ie(We,We.current&1);break;case 19:if(n=(r&t.childLanes)!==0,(e.flags&128)!==0){if(n)return Ru(e,t,r);t.flags|=128}if(o=t.memoizedState,o!==null&&(o.rendering=null,o.tail=null,o.lastEffect=null),Ie(We,We.current),n)break;return null;case 22:case 23:return t.lanes=0,Cu(e,t,r)}return hr(e,t,r)}var Iu,fa,Fu,Ou;Iu=function(e,t){for(var r=t.child;r!==null;){if(r.tag===5||r.tag===6)e.appendChild(r.stateNode);else if(r.tag!==4&&r.child!==null){r.child.return=r,r=r.child;continue}if(r===t)break;for(;r.sibling===null;){if(r.return===null||r.return===t)return;r=r.return}r.sibling.return=r.return,r=r.sibling}},fa=function(){},Fu=function(e,t,r,n){var o=e.memoizedProps;if(o!==n){e=t.stateNode,en(or.current);var l=null;switch(r){case"input":o=sr(e,o),n=sr(e,n),l=[];break;case"select":o=I({},o,{value:void 0}),n=I({},n,{value:void 0}),l=[];break;case"textarea":o=Yn(e,o),n=Yn(e,n),l=[];break;default:typeof o.onClick!="function"&&typeof n.onClick=="function"&&(e.onclick=si)}qn(r,n);var a;r=null;for(y in o)if(!n.hasOwnProperty(y)&&o.hasOwnProperty(y)&&o[y]!=null)if(y==="style"){var d=o[y];for(a in d)d.hasOwnProperty(a)&&(r||(r={}),r[a]="")}else y!=="dangerouslySetInnerHTML"&&y!=="children"&&y!=="suppressContentEditableWarning"&&y!=="suppressHydrationWarning"&&y!=="autoFocus"&&(w.hasOwnProperty(y)?l||(l=[]):(l=l||[]).push(y,null));for(y in n){var p=n[y];if(d=o!=null?o[y]:void 0,n.hasOwnProperty(y)&&p!==d&&(p!=null||d!=null))if(y==="style")if(d){for(a in d)!d.hasOwnProperty(a)||p&&p.hasOwnProperty(a)||(r||(r={}),r[a]="");for(a in p)p.hasOwnProperty(a)&&d[a]!==p[a]&&(r||(r={}),r[a]=p[a])}else r||(l||(l=[]),l.push(y,r)),r=p;else y==="dangerouslySetInnerHTML"?(p=p?p.__html:void 0,d=d?d.__html:void 0,p!=null&&d!==p&&(l=l||[]).push(y,p)):y==="children"?typeof p!="string"&&typeof p!="number"||(l=l||[]).push(y,""+p):y!=="suppressContentEditableWarning"&&y!=="suppressHydrationWarning"&&(w.hasOwnProperty(y)?(p!=null&&y==="onScroll"&&Oe("scroll",e),l||d===p||(l=[])):(l=l||[]).push(y,p))}r&&(l=l||[]).push("style",r);var y=l;(t.updateQueue=y)&&(t.flags|=4)}},Ou=function(e,t,r,n){r!==n&&(t.flags|=4)};function To(e,t){if(!Be)switch(e.tailMode){case"hidden":t=e.tail;for(var r=null;t!==null;)t.alternate!==null&&(r=t),t=t.sibling;r===null?e.tail=null:r.sibling=null;break;case"collapsed":r=e.tail;for(var n=null;r!==null;)r.alternate!==null&&(n=r),r=r.sibling;n===null?t||e.tail===null?e.tail=null:e.tail.sibling=null:n.sibling=null}}function st(e){var t=e.alternate!==null&&e.alternate.child===e.child,r=0,n=0;if(t)for(var o=e.child;o!==null;)r|=o.lanes|o.childLanes,n|=o.subtreeFlags&14680064,n|=o.flags&14680064,o.return=e,o=o.sibling;else for(o=e.child;o!==null;)r|=o.lanes|o.childLanes,n|=o.subtreeFlags,n|=o.flags,o.return=e,o=o.sibling;return e.subtreeFlags|=n,e.childLanes=r,t}function tp(e,t,r){var n=t.pendingProps;switch(Il(t),t.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return st(t),null;case 1:return ht(t.type)&&ci(),st(t),null;case 3:return n=t.stateNode,On(),De(mt),De(lt),Kl(),n.pendingContext&&(n.context=n.pendingContext,n.pendingContext=null),(e===null||e.child===null)&&(mi(t)?t.flags|=4:e===null||e.memoizedState.isDehydrated&&(t.flags&256)===0||(t.flags|=1024,Qt!==null&&(ja(Qt),Qt=null))),fa(e,t),st(t),null;case 5:Vl(t);var o=en(Co.current);if(r=t.type,e!==null&&t.stateNode!=null)Fu(e,t,r,n,o),e.ref!==t.ref&&(t.flags|=512,t.flags|=2097152);else{if(!n){if(t.stateNode===null)throw Error(c(166));return st(t),null}if(e=en(or.current),mi(t)){n=t.stateNode,r=t.type;var l=t.memoizedProps;switch(n[nr]=t,n[zo]=l,e=(t.mode&1)!==0,r){case"dialog":Oe("cancel",n),Oe("close",n);break;case"iframe":case"object":case"embed":Oe("load",n);break;case"video":case"audio":for(o=0;o<yo.length;o++)Oe(yo[o],n);break;case"source":Oe("error",n);break;case"img":case"image":case"link":Oe("error",n),Oe("load",n);break;case"details":Oe("toggle",n);break;case"input":xr(n,l),Oe("invalid",n);break;case"select":n._wrapperState={wasMultiple:!!l.multiple},Oe("invalid",n);break;case"textarea":Kn(n,l),Oe("invalid",n)}qn(r,l),o=null;for(var a in l)if(l.hasOwnProperty(a)){var d=l[a];a==="children"?typeof d=="string"?n.textContent!==d&&(l.suppressHydrationWarning!==!0&&ai(n.textContent,d,e),o=["children",d]):typeof d=="number"&&n.textContent!==""+d&&(l.suppressHydrationWarning!==!0&&ai(n.textContent,d,e),o=["children",""+d]):w.hasOwnProperty(a)&&d!=null&&a==="onScroll"&&Oe("scroll",n)}switch(r){case"input":Ot(n),Vn(n,l,!0);break;case"textarea":Ot(n),Gn(n);break;case"select":case"option":break;default:typeof l.onClick=="function"&&(n.onclick=si)}n=o,t.updateQueue=n,n!==null&&(t.flags|=4)}else{a=o.nodeType===9?o:o.ownerDocument,e==="http://www.w3.org/1999/xhtml"&&(e=Xn(r)),e==="http://www.w3.org/1999/xhtml"?r==="script"?(e=a.createElement("div"),e.innerHTML="<script><\/script>",e=e.removeChild(e.firstChild)):typeof n.is=="string"?e=a.createElement(r,{is:n.is}):(e=a.createElement(r),r==="select"&&(a=e,n.multiple?a.multiple=!0:n.size&&(a.size=n.size))):e=a.createElementNS(e,r),e[nr]=t,e[zo]=n,Iu(e,t,!1,!1),t.stateNode=e;e:{switch(a=gn(r,n),r){case"dialog":Oe("cancel",e),Oe("close",e),o=n;break;case"iframe":case"object":case"embed":Oe("load",e),o=n;break;case"video":case"audio":for(o=0;o<yo.length;o++)Oe(yo[o],e);o=n;break;case"source":Oe("error",e),o=n;break;case"img":case"image":case"link":Oe("error",e),Oe("load",e),o=n;break;case"details":Oe("toggle",e),o=n;break;case"input":xr(e,n),o=sr(e,n),Oe("invalid",e);break;case"option":o=n;break;case"select":e._wrapperState={wasMultiple:!!n.multiple},o=I({},n,{value:void 0}),Oe("invalid",e);break;case"textarea":Kn(e,n),o=Yn(e,n),Oe("invalid",e);break;default:o=n}qn(r,o),d=o;for(l in d)if(d.hasOwnProperty(l)){var p=d[l];l==="style"?Hr(e,p):l==="dangerouslySetInnerHTML"?(p=p?p.__html:void 0,p!=null&&pn(e,p)):l==="children"?typeof p=="string"?(r!=="textarea"||p!=="")&&zr(e,p):typeof p=="number"&&zr(e,""+p):l!=="suppressContentEditableWarning"&&l!=="suppressHydrationWarning"&&l!=="autoFocus"&&(w.hasOwnProperty(l)?p!=null&&l==="onScroll"&&Oe("scroll",e):p!=null&&Te(e,l,p,a))}switch(r){case"input":Ot(e),Vn(e,n,!1);break;case"textarea":Ot(e),Gn(e);break;case"option":n.value!=null&&e.setAttribute("value",""+Le(n.value));break;case"select":e.multiple=!!n.multiple,l=n.value,l!=null?wr(e,!!n.multiple,l,!1):n.defaultValue!=null&&wr(e,!!n.multiple,n.defaultValue,!0);break;default:typeof o.onClick=="function"&&(e.onclick=si)}switch(r){case"button":case"input":case"select":case"textarea":n=!!n.autoFocus;break e;case"img":n=!0;break e;default:n=!1}}n&&(t.flags|=4)}t.ref!==null&&(t.flags|=512,t.flags|=2097152)}return st(t),null;case 6:if(e&&t.stateNode!=null)Ou(e,t,e.memoizedProps,n);else{if(typeof n!="string"&&t.stateNode===null)throw Error(c(166));if(r=en(Co.current),en(or.current),mi(t)){if(n=t.stateNode,r=t.memoizedProps,n[nr]=t,(l=n.nodeValue!==r)&&(e=jt,e!==null))switch(e.tag){case 3:ai(n.nodeValue,r,(e.mode&1)!==0);break;case 5:e.memoizedProps.suppressHydrationWarning!==!0&&ai(n.nodeValue,r,(e.mode&1)!==0)}l&&(t.flags|=4)}else n=(r.nodeType===9?r:r.ownerDocument).createTextNode(n),n[nr]=t,t.stateNode=n}return st(t),null;case 13:if(De(We),n=t.memoizedState,e===null||e.memoizedState!==null&&e.memoizedState.dehydrated!==null){if(Be&&St!==null&&(t.mode&1)!==0&&(t.flags&128)===0)As(),Mn(),t.flags|=98560,l=!1;else if(l=mi(t),n!==null&&n.dehydrated!==null){if(e===null){if(!l)throw Error(c(318));if(l=t.memoizedState,l=l!==null?l.dehydrated:null,!l)throw Error(c(317));l[nr]=t}else Mn(),(t.flags&128)===0&&(t.memoizedState=null),t.flags|=4;st(t),l=!1}else Qt!==null&&(ja(Qt),Qt=null),l=!0;if(!l)return t.flags&65536?t:null}return(t.flags&128)!==0?(t.lanes=r,t):(n=n!==null,n!==(e!==null&&e.memoizedState!==null)&&n&&(t.child.flags|=8192,(t.mode&1)!==0&&(e===null||(We.current&1)!==0?Je===0&&(Je=3):Ca())),t.updateQueue!==null&&(t.flags|=4),st(t),null);case 4:return On(),fa(e,t),e===null&&wo(t.stateNode.containerInfo),st(t),null;case 10:return Bl(t.type._context),st(t),null;case 17:return ht(t.type)&&ci(),st(t),null;case 19:if(De(We),l=t.memoizedState,l===null)return st(t),null;if(n=(t.flags&128)!==0,a=l.rendering,a===null)if(n)To(l,!1);else{if(Je!==0||e!==null&&(e.flags&128)!==0)for(e=t.child;e!==null;){if(a=bi(e),a!==null){for(t.flags|=128,To(l,!1),n=a.updateQueue,n!==null&&(t.updateQueue=n,t.flags|=4),t.subtreeFlags=0,n=r,r=t.child;r!==null;)l=r,e=n,l.flags&=14680066,a=l.alternate,a===null?(l.childLanes=0,l.lanes=e,l.child=null,l.subtreeFlags=0,l.memoizedProps=null,l.memoizedState=null,l.updateQueue=null,l.dependencies=null,l.stateNode=null):(l.childLanes=a.childLanes,l.lanes=a.lanes,l.child=a.child,l.subtreeFlags=0,l.deletions=null,l.memoizedProps=a.memoizedProps,l.memoizedState=a.memoizedState,l.updateQueue=a.updateQueue,l.type=a.type,e=a.dependencies,l.dependencies=e===null?null:{lanes:e.lanes,firstContext:e.firstContext}),r=r.sibling;return Ie(We,We.current&1|2),t.child}e=e.sibling}l.tail!==null&&Ae()>Bn&&(t.flags|=128,n=!0,To(l,!1),t.lanes=4194304)}else{if(!n)if(e=bi(a),e!==null){if(t.flags|=128,n=!0,r=e.updateQueue,r!==null&&(t.updateQueue=r,t.flags|=4),To(l,!0),l.tail===null&&l.tailMode==="hidden"&&!a.alternate&&!Be)return st(t),null}else 2*Ae()-l.renderingStartTime>Bn&&r!==1073741824&&(t.flags|=128,n=!0,To(l,!1),t.lanes=4194304);l.isBackwards?(a.sibling=t.child,t.child=a):(r=l.last,r!==null?r.sibling=a:t.child=a,l.last=a)}return l.tail!==null?(t=l.tail,l.rendering=t,l.tail=t.sibling,l.renderingStartTime=Ae(),t.sibling=null,r=We.current,Ie(We,n?r&1|2:r&1),t):(st(t),null);case 22:case 23:return Na(),n=t.memoizedState!==null,e!==null&&e.memoizedState!==null!==n&&(t.flags|=8192),n&&(t.mode&1)!==0?(Nt&1073741824)!==0&&(st(t),t.subtreeFlags&6&&(t.flags|=8192)):st(t),null;case 24:return null;case 25:return null}throw Error(c(156,t.tag))}function rp(e,t){switch(Il(t),t.tag){case 1:return ht(t.type)&&ci(),e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 3:return On(),De(mt),De(lt),Kl(),e=t.flags,(e&65536)!==0&&(e&128)===0?(t.flags=e&-65537|128,t):null;case 5:return Vl(t),null;case 13:if(De(We),e=t.memoizedState,e!==null&&e.dehydrated!==null){if(t.alternate===null)throw Error(c(340));Mn()}return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 19:return De(We),null;case 4:return On(),null;case 10:return Bl(t.type._context),null;case 22:case 23:return Na(),null;case 24:return null;default:return null}}var Pi=!1,ut=!1,np=typeof WeakSet=="function"?WeakSet:Set,H=null;function $n(e,t){var r=e.ref;if(r!==null)if(typeof r=="function")try{r(null)}catch(n){Ye(e,t,n)}else r.current=null}function ga(e,t,r){try{r()}catch(n){Ye(e,t,n)}}var Du=!1;function op(e,t){if(Nl=Xo,e=hs(),xl(e)){if("selectionStart"in e)var r={start:e.selectionStart,end:e.selectionEnd};else e:{r=(r=e.ownerDocument)&&r.defaultView||window;var n=r.getSelection&&r.getSelection();if(n&&n.rangeCount!==0){r=n.anchorNode;var o=n.anchorOffset,l=n.focusNode;n=n.focusOffset;try{r.nodeType,l.nodeType}catch{r=null;break e}var a=0,d=-1,p=-1,y=0,C=0,E=e,N=null;t:for(;;){for(var A;E!==r||o!==0&&E.nodeType!==3||(d=a+o),E!==l||n!==0&&E.nodeType!==3||(p=a+n),E.nodeType===3&&(a+=E.nodeValue.length),(A=E.firstChild)!==null;)N=E,E=A;for(;;){if(E===e)break t;if(N===r&&++y===o&&(d=a),N===l&&++C===n&&(p=a),(A=E.nextSibling)!==null)break;E=N,N=E.parentNode}E=A}r=d===-1||p===-1?null:{start:d,end:p}}else r=null}r=r||{start:0,end:0}}else r=null;for(Cl={focusedElem:e,selectionRange:r},Xo=!1,H=t;H!==null;)if(t=H,e=t.child,(t.subtreeFlags&1028)!==0&&e!==null)e.return=t,H=e;else for(;H!==null;){t=H;try{var Q=t.alternate;if((t.flags&1024)!==0)switch(t.tag){case 0:case 11:case 15:break;case 1:if(Q!==null){var Y=Q.memoizedProps,Ke=Q.memoizedState,h=t.stateNode,f=h.getSnapshotBeforeUpdate(t.elementType===t.type?Y:Vt(t.type,Y),Ke);h.__reactInternalSnapshotBeforeUpdate=f}break;case 3:var x=t.stateNode.containerInfo;x.nodeType===1?x.textContent="":x.nodeType===9&&x.documentElement&&x.removeChild(x.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(c(163))}}catch(L){Ye(t,t.return,L)}if(e=t.sibling,e!==null){e.return=t.return,H=e;break}H=t.return}return Q=Du,Du=!1,Q}function Mo(e,t,r){var n=t.updateQueue;if(n=n!==null?n.lastEffect:null,n!==null){var o=n=n.next;do{if((o.tag&e)===e){var l=o.destroy;o.destroy=void 0,l!==void 0&&ga(t,r,l)}o=o.next}while(o!==n)}}function Li(e,t){if(t=t.updateQueue,t=t!==null?t.lastEffect:null,t!==null){var r=t=t.next;do{if((r.tag&e)===e){var n=r.create;r.destroy=n()}r=r.next}while(r!==t)}}function ma(e){var t=e.ref;if(t!==null){var r=e.stateNode;switch(e.tag){case 5:e=r;break;default:e=r}typeof t=="function"?t(e):t.current=e}}function $u(e){var t=e.alternate;t!==null&&(e.alternate=null,$u(t)),e.child=null,e.deletions=null,e.sibling=null,e.tag===5&&(t=e.stateNode,t!==null&&(delete t[nr],delete t[zo],delete t[Ll],delete t[Ad],delete t[Bd])),e.stateNode=null,e.return=null,e.dependencies=null,e.memoizedProps=null,e.memoizedState=null,e.pendingProps=null,e.stateNode=null,e.updateQueue=null}function Au(e){return e.tag===5||e.tag===3||e.tag===4}function Bu(e){e:for(;;){for(;e.sibling===null;){if(e.return===null||Au(e.return))return null;e=e.return}for(e.sibling.return=e.return,e=e.sibling;e.tag!==5&&e.tag!==6&&e.tag!==18;){if(e.flags&2||e.child===null||e.tag===4)continue e;e.child.return=e,e=e.child}if(!(e.flags&2))return e.stateNode}}function ha(e,t,r){var n=e.tag;if(n===5||n===6)e=e.stateNode,t?r.nodeType===8?r.parentNode.insertBefore(e,t):r.insertBefore(e,t):(r.nodeType===8?(t=r.parentNode,t.insertBefore(e,r)):(t=r,t.appendChild(e)),r=r._reactRootContainer,r!=null||t.onclick!==null||(t.onclick=si));else if(n!==4&&(e=e.child,e!==null))for(ha(e,t,r),e=e.sibling;e!==null;)ha(e,t,r),e=e.sibling}function va(e,t,r){var n=e.tag;if(n===5||n===6)e=e.stateNode,t?r.insertBefore(e,t):r.appendChild(e);else if(n!==4&&(e=e.child,e!==null))for(va(e,t,r),e=e.sibling;e!==null;)va(e,t,r),e=e.sibling}var ot=null,Yt=!1;function Ir(e,t,r){for(r=r.child;r!==null;)Uu(e,t,r),r=r.sibling}function Uu(e,t,r){if(zt&&typeof zt.onCommitFiberUnmount=="function")try{zt.onCommitFiberUnmount(wn,r)}catch{}switch(r.tag){case 5:ut||$n(r,t);case 6:var n=ot,o=Yt;ot=null,Ir(e,t,r),ot=n,Yt=o,ot!==null&&(Yt?(e=ot,r=r.stateNode,e.nodeType===8?e.parentNode.removeChild(r):e.removeChild(r)):ot.removeChild(r.stateNode));break;case 18:ot!==null&&(Yt?(e=ot,r=r.stateNode,e.nodeType===8?Pl(e.parentNode,r):e.nodeType===1&&Pl(e,r),co(e)):Pl(ot,r.stateNode));break;case 4:n=ot,o=Yt,ot=r.stateNode.containerInfo,Yt=!0,Ir(e,t,r),ot=n,Yt=o;break;case 0:case 11:case 14:case 15:if(!ut&&(n=r.updateQueue,n!==null&&(n=n.lastEffect,n!==null))){o=n=n.next;do{var l=o,a=l.destroy;l=l.tag,a!==void 0&&((l&2)!==0||(l&4)!==0)&&ga(r,t,a),o=o.next}while(o!==n)}Ir(e,t,r);break;case 1:if(!ut&&($n(r,t),n=r.stateNode,typeof n.componentWillUnmount=="function"))try{n.props=r.memoizedProps,n.state=r.memoizedState,n.componentWillUnmount()}catch(d){Ye(r,t,d)}Ir(e,t,r);break;case 21:Ir(e,t,r);break;case 22:r.mode&1?(ut=(n=ut)||r.memoizedState!==null,Ir(e,t,r),ut=n):Ir(e,t,r);break;default:Ir(e,t,r)}}function Wu(e){var t=e.updateQueue;if(t!==null){e.updateQueue=null;var r=e.stateNode;r===null&&(r=e.stateNode=new np),t.forEach(function(n){var o=fp.bind(null,e,n);r.has(n)||(r.add(n),n.then(o,o))})}}function Kt(e,t){var r=t.deletions;if(r!==null)for(var n=0;n<r.length;n++){var o=r[n];try{var l=e,a=t,d=a;e:for(;d!==null;){switch(d.tag){case 5:ot=d.stateNode,Yt=!1;break e;case 3:ot=d.stateNode.containerInfo,Yt=!0;break e;case 4:ot=d.stateNode.containerInfo,Yt=!0;break e}d=d.return}if(ot===null)throw Error(c(160));Uu(l,a,o),ot=null,Yt=!1;var p=o.alternate;p!==null&&(p.return=null),o.return=null}catch(y){Ye(o,t,y)}}if(t.subtreeFlags&12854)for(t=t.child;t!==null;)Hu(t,e),t=t.sibling}function Hu(e,t){var r=e.alternate,n=e.flags;switch(e.tag){case 0:case 11:case 14:case 15:if(Kt(t,e),lr(e),n&4){try{Mo(3,e,e.return),Li(3,e)}catch(Y){Ye(e,e.return,Y)}try{Mo(5,e,e.return)}catch(Y){Ye(e,e.return,Y)}}break;case 1:Kt(t,e),lr(e),n&512&&r!==null&&$n(r,r.return);break;case 5:if(Kt(t,e),lr(e),n&512&&r!==null&&$n(r,r.return),e.flags&32){var o=e.stateNode;try{zr(o,"")}catch(Y){Ye(e,e.return,Y)}}if(n&4&&(o=e.stateNode,o!=null)){var l=e.memoizedProps,a=r!==null?r.memoizedProps:l,d=e.type,p=e.updateQueue;if(e.updateQueue=null,p!==null)try{d==="input"&&l.type==="radio"&&l.name!=null&&Wr(o,l),gn(d,a);var y=gn(d,l);for(a=0;a<p.length;a+=2){var C=p[a],E=p[a+1];C==="style"?Hr(o,E):C==="dangerouslySetInnerHTML"?pn(o,E):C==="children"?zr(o,E):Te(o,C,E,y)}switch(d){case"input":un(o,l);break;case"textarea":cn(o,l);break;case"select":var N=o._wrapperState.wasMultiple;o._wrapperState.wasMultiple=!!l.multiple;var A=l.value;A!=null?wr(o,!!l.multiple,A,!1):N!==!!l.multiple&&(l.defaultValue!=null?wr(o,!!l.multiple,l.defaultValue,!0):wr(o,!!l.multiple,l.multiple?[]:"",!1))}o[zo]=l}catch(Y){Ye(e,e.return,Y)}}break;case 6:if(Kt(t,e),lr(e),n&4){if(e.stateNode===null)throw Error(c(162));o=e.stateNode,l=e.memoizedProps;try{o.nodeValue=l}catch(Y){Ye(e,e.return,Y)}}break;case 3:if(Kt(t,e),lr(e),n&4&&r!==null&&r.memoizedState.isDehydrated)try{co(t.containerInfo)}catch(Y){Ye(e,e.return,Y)}break;case 4:Kt(t,e),lr(e);break;case 13:Kt(t,e),lr(e),o=e.child,o.flags&8192&&(l=o.memoizedState!==null,o.stateNode.isHidden=l,!l||o.alternate!==null&&o.alternate.memoizedState!==null||(wa=Ae())),n&4&&Wu(e);break;case 22:if(C=r!==null&&r.memoizedState!==null,e.mode&1?(ut=(y=ut)||C,Kt(t,e),ut=y):Kt(t,e),lr(e),n&8192){if(y=e.memoizedState!==null,(e.stateNode.isHidden=y)&&!C&&(e.mode&1)!==0)for(H=e,C=e.child;C!==null;){for(E=H=C;H!==null;){switch(N=H,A=N.child,N.tag){case 0:case 11:case 14:case 15:Mo(4,N,N.return);break;case 1:$n(N,N.return);var Q=N.stateNode;if(typeof Q.componentWillUnmount=="function"){n=N,r=N.return;try{t=n,Q.props=t.memoizedProps,Q.state=t.memoizedState,Q.componentWillUnmount()}catch(Y){Ye(n,r,Y)}}break;case 5:$n(N,N.return);break;case 22:if(N.memoizedState!==null){Yu(E);continue}}A!==null?(A.return=N,H=A):Yu(E)}C=C.sibling}e:for(C=null,E=e;;){if(E.tag===5){if(C===null){C=E;try{o=E.stateNode,y?(l=o.style,typeof l.setProperty=="function"?l.setProperty("display","none","important"):l.display="none"):(d=E.stateNode,p=E.memoizedProps.style,a=p!=null&&p.hasOwnProperty("display")?p.display:null,d.style.display=fn("display",a))}catch(Y){Ye(e,e.return,Y)}}}else if(E.tag===6){if(C===null)try{E.stateNode.nodeValue=y?"":E.memoizedProps}catch(Y){Ye(e,e.return,Y)}}else if((E.tag!==22&&E.tag!==23||E.memoizedState===null||E===e)&&E.child!==null){E.child.return=E,E=E.child;continue}if(E===e)break e;for(;E.sibling===null;){if(E.return===null||E.return===e)break e;C===E&&(C=null),E=E.return}C===E&&(C=null),E.sibling.return=E.return,E=E.sibling}}break;case 19:Kt(t,e),lr(e),n&4&&Wu(e);break;case 21:break;default:Kt(t,e),lr(e)}}function lr(e){var t=e.flags;if(t&2){try{e:{for(var r=e.return;r!==null;){if(Au(r)){var n=r;break e}r=r.return}throw Error(c(160))}switch(n.tag){case 5:var o=n.stateNode;n.flags&32&&(zr(o,""),n.flags&=-33);var l=Bu(e);va(e,l,o);break;case 3:case 4:var a=n.stateNode.containerInfo,d=Bu(e);ha(e,d,a);break;default:throw Error(c(161))}}catch(p){Ye(e,e.return,p)}e.flags&=-3}t&4096&&(e.flags&=-4097)}function ip(e,t,r){H=e,Qu(e)}function Qu(e,t,r){for(var n=(e.mode&1)!==0;H!==null;){var o=H,l=o.child;if(o.tag===22&&n){var a=o.memoizedState!==null||Pi;if(!a){var d=o.alternate,p=d!==null&&d.memoizedState!==null||ut;d=Pi;var y=ut;if(Pi=a,(ut=p)&&!y)for(H=o;H!==null;)a=H,p=a.child,a.tag===22&&a.memoizedState!==null?Ku(o):p!==null?(p.return=a,H=p):Ku(o);for(;l!==null;)H=l,Qu(l),l=l.sibling;H=o,Pi=d,ut=y}Vu(e)}else(o.subtreeFlags&8772)!==0&&l!==null?(l.return=o,H=l):Vu(e)}}function Vu(e){for(;H!==null;){var t=H;if((t.flags&8772)!==0){var r=t.alternate;try{if((t.flags&8772)!==0)switch(t.tag){case 0:case 11:case 15:ut||Li(5,t);break;case 1:var n=t.stateNode;if(t.flags&4&&!ut)if(r===null)n.componentDidMount();else{var o=t.elementType===t.type?r.memoizedProps:Vt(t.type,r.memoizedProps);n.componentDidUpdate(o,r.memoizedState,n.__reactInternalSnapshotBeforeUpdate)}var l=t.updateQueue;l!==null&&Ys(t,l,n);break;case 3:var a=t.updateQueue;if(a!==null){if(r=null,t.child!==null)switch(t.child.tag){case 5:r=t.child.stateNode;break;case 1:r=t.child.stateNode}Ys(t,a,r)}break;case 5:var d=t.stateNode;if(r===null&&t.flags&4){r=d;var p=t.memoizedProps;switch(t.type){case"button":case"input":case"select":case"textarea":p.autoFocus&&r.focus();break;case"img":p.src&&(r.src=p.src)}}break;case 6:break;case 4:break;case 12:break;case 13:if(t.memoizedState===null){var y=t.alternate;if(y!==null){var C=y.memoizedState;if(C!==null){var E=C.dehydrated;E!==null&&co(E)}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;default:throw Error(c(163))}ut||t.flags&512&&ma(t)}catch(N){Ye(t,t.return,N)}}if(t===e){H=null;break}if(r=t.sibling,r!==null){r.return=t.return,H=r;break}H=t.return}}function Yu(e){for(;H!==null;){var t=H;if(t===e){H=null;break}var r=t.sibling;if(r!==null){r.return=t.return,H=r;break}H=t.return}}function Ku(e){for(;H!==null;){var t=H;try{switch(t.tag){case 0:case 11:case 15:var r=t.return;try{Li(4,t)}catch(p){Ye(t,r,p)}break;case 1:var n=t.stateNode;if(typeof n.componentDidMount=="function"){var o=t.return;try{n.componentDidMount()}catch(p){Ye(t,o,p)}}var l=t.return;try{ma(t)}catch(p){Ye(t,l,p)}break;case 5:var a=t.return;try{ma(t)}catch(p){Ye(t,a,p)}}}catch(p){Ye(t,t.return,p)}if(t===e){H=null;break}var d=t.sibling;if(d!==null){d.return=t.return,H=d;break}H=t.return}}var lp=Math.ceil,Ti=de.ReactCurrentDispatcher,xa=de.ReactCurrentOwner,It=de.ReactCurrentBatchConfig,Ce=0,rt=null,Xe=null,it=0,Nt=0,An=Pr(0),Je=0,Ro=null,rn=0,Mi=0,ya=0,Io=null,xt=null,wa=0,Bn=1/0,vr=null,Ri=!1,ba=null,Fr=null,Ii=!1,Or=null,Fi=0,Fo=0,za=null,Oi=-1,Di=0;function dt(){return(Ce&6)!==0?Ae():Oi!==-1?Oi:Oi=Ae()}function Dr(e){return(e.mode&1)===0?1:(Ce&2)!==0&&it!==0?it&-it:Wd.transition!==null?(Di===0&&(Di=ie()),Di):(e=pe,e!==0||(e=window.event,e=e===void 0?16:Xa(e.type)),e)}function Gt(e,t,r,n){if(50<Fo)throw Fo=0,za=null,Error(c(185));_e(e,r,n),((Ce&2)===0||e!==rt)&&(e===rt&&((Ce&2)===0&&(Mi|=r),Je===4&&$r(e,it)),yt(e,n),r===1&&Ce===0&&(t.mode&1)===0&&(Bn=Ae()+500,pi&&Tr()))}function yt(e,t){var r=e.callbackNode;$(e,t);var n=b(e,e===rt?it:0);if(n===0)r!==null&&Uo(r),e.callbackNode=null,e.callbackPriority=0;else if(t=n&-n,e.callbackPriority!==t){if(r!=null&&Uo(r),t===1)e.tag===0?Ud(Xu.bind(null,e)):Is(Xu.bind(null,e)),Dd(function(){(Ce&6)===0&&Tr()}),r=null;else{switch(Ve(n)){case 1:r=io;break;case 4:r=Wo;break;case 16:r=yn;break;case 536870912:r=Ho;break;default:r=yn}r=oc(r,Gu.bind(null,e))}e.callbackPriority=t,e.callbackNode=r}}function Gu(e,t){if(Oi=-1,Di=0,(Ce&6)!==0)throw Error(c(327));var r=e.callbackNode;if(Un()&&e.callbackNode!==r)return null;var n=b(e,e===rt?it:0);if(n===0)return null;if((n&30)!==0||(n&e.expiredLanes)!==0||t)t=$i(e,n);else{t=n;var o=Ce;Ce|=2;var l=Zu();(rt!==e||it!==t)&&(vr=null,Bn=Ae()+500,on(e,t));do try{up();break}catch(d){qu(e,d)}while(!0);Al(),Ti.current=l,Ce=o,Xe!==null?t=0:(rt=null,it=0,t=Je)}if(t!==0){if(t===2&&(o=te(e),o!==0&&(n=o,t=ka(e,o))),t===1)throw r=Ro,on(e,0),$r(e,n),yt(e,Ae()),r;if(t===6)$r(e,n);else{if(o=e.current.alternate,(n&30)===0&&!ap(o)&&(t=$i(e,n),t===2&&(l=te(e),l!==0&&(n=l,t=ka(e,l))),t===1))throw r=Ro,on(e,0),$r(e,n),yt(e,Ae()),r;switch(e.finishedWork=o,e.finishedLanes=n,t){case 0:case 1:throw Error(c(345));case 2:ln(e,xt,vr);break;case 3:if($r(e,n),(n&130023424)===n&&(t=wa+500-Ae(),10<t)){if(b(e,0)!==0)break;if(o=e.suspendedLanes,(o&n)!==n){dt(),e.pingedLanes|=e.suspendedLanes&o;break}e.timeoutHandle=_l(ln.bind(null,e,xt,vr),t);break}ln(e,xt,vr);break;case 4:if($r(e,n),(n&4194240)===n)break;for(t=e.eventTimes,o=-1;0<n;){var a=31-gt(n);l=1<<a,a=t[a],a>o&&(o=a),n&=~l}if(n=o,n=Ae()-n,n=(120>n?120:480>n?480:1080>n?1080:1920>n?1920:3e3>n?3e3:4320>n?4320:1960*lp(n/1960))-n,10<n){e.timeoutHandle=_l(ln.bind(null,e,xt,vr),n);break}ln(e,xt,vr);break;case 5:ln(e,xt,vr);break;default:throw Error(c(329))}}}return yt(e,Ae()),e.callbackNode===r?Gu.bind(null,e):null}function ka(e,t){var r=Io;return e.current.memoizedState.isDehydrated&&(on(e,t).flags|=256),e=$i(e,t),e!==2&&(t=xt,xt=r,t!==null&&ja(t)),e}function ja(e){xt===null?xt=e:xt.push.apply(xt,e)}function ap(e){for(var t=e;;){if(t.flags&16384){var r=t.updateQueue;if(r!==null&&(r=r.stores,r!==null))for(var n=0;n<r.length;n++){var o=r[n],l=o.getSnapshot;o=o.value;try{if(!Ht(l(),o))return!1}catch{return!1}}}if(r=t.child,t.subtreeFlags&16384&&r!==null)r.return=t,t=r;else{if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return!0;t=t.return}t.sibling.return=t.return,t=t.sibling}}return!0}function $r(e,t){for(t&=~ya,t&=~Mi,e.suspendedLanes|=t,e.pingedLanes&=~t,e=e.expirationTimes;0<t;){var r=31-gt(t),n=1<<r;e[r]=-1,t&=~n}}function Xu(e){if((Ce&6)!==0)throw Error(c(327));Un();var t=b(e,0);if((t&1)===0)return yt(e,Ae()),null;var r=$i(e,t);if(e.tag!==0&&r===2){var n=te(e);n!==0&&(t=n,r=ka(e,n))}if(r===1)throw r=Ro,on(e,0),$r(e,t),yt(e,Ae()),r;if(r===6)throw Error(c(345));return e.finishedWork=e.current.alternate,e.finishedLanes=t,ln(e,xt,vr),yt(e,Ae()),null}function Sa(e,t){var r=Ce;Ce|=1;try{return e(t)}finally{Ce=r,Ce===0&&(Bn=Ae()+500,pi&&Tr())}}function nn(e){Or!==null&&Or.tag===0&&(Ce&6)===0&&Un();var t=Ce;Ce|=1;var r=It.transition,n=pe;try{if(It.transition=null,pe=1,e)return e()}finally{pe=n,It.transition=r,Ce=t,(Ce&6)===0&&Tr()}}function Na(){Nt=An.current,De(An)}function on(e,t){e.finishedWork=null,e.finishedLanes=0;var r=e.timeoutHandle;if(r!==-1&&(e.timeoutHandle=-1,Od(r)),Xe!==null)for(r=Xe.return;r!==null;){var n=r;switch(Il(n),n.tag){case 1:n=n.type.childContextTypes,n!=null&&ci();break;case 3:On(),De(mt),De(lt),Kl();break;case 5:Vl(n);break;case 4:On();break;case 13:De(We);break;case 19:De(We);break;case 10:Bl(n.type._context);break;case 22:case 23:Na()}r=r.return}if(rt=e,Xe=e=Ar(e.current,null),it=Nt=t,Je=0,Ro=null,ya=Mi=rn=0,xt=Io=null,Jr!==null){for(t=0;t<Jr.length;t++)if(r=Jr[t],n=r.interleaved,n!==null){r.interleaved=null;var o=n.next,l=r.pending;if(l!==null){var a=l.next;l.next=o,n.next=a}r.pending=n}Jr=null}return e}function qu(e,t){do{var r=Xe;try{if(Al(),zi.current=Ni,ki){for(var n=He.memoizedState;n!==null;){var o=n.queue;o!==null&&(o.pending=null),n=n.next}ki=!1}if(tn=0,tt=Ze=He=null,Eo=!1,_o=0,xa.current=null,r===null||r.return===null){Je=1,Ro=t,Xe=null;break}e:{var l=e,a=r.return,d=r,p=t;if(t=it,d.flags|=32768,p!==null&&typeof p=="object"&&typeof p.then=="function"){var y=p,C=d,E=C.tag;if((C.mode&1)===0&&(E===0||E===11||E===15)){var N=C.alternate;N?(C.updateQueue=N.updateQueue,C.memoizedState=N.memoizedState,C.lanes=N.lanes):(C.updateQueue=null,C.memoizedState=null)}var A=zu(a);if(A!==null){A.flags&=-257,ku(A,a,d,l,t),A.mode&1&&bu(l,y,t),t=A,p=y;var Q=t.updateQueue;if(Q===null){var Y=new Set;Y.add(p),t.updateQueue=Y}else Q.add(p);break e}else{if((t&1)===0){bu(l,y,t),Ca();break e}p=Error(c(426))}}else if(Be&&d.mode&1){var Ke=zu(a);if(Ke!==null){(Ke.flags&65536)===0&&(Ke.flags|=256),ku(Ke,a,d,l,t),Dl(Dn(p,d));break e}}l=p=Dn(p,d),Je!==4&&(Je=2),Io===null?Io=[l]:Io.push(l),l=a;do{switch(l.tag){case 3:l.flags|=65536,t&=-t,l.lanes|=t;var h=yu(l,p,t);Vs(l,h);break e;case 1:d=p;var f=l.type,x=l.stateNode;if((l.flags&128)===0&&(typeof f.getDerivedStateFromError=="function"||x!==null&&typeof x.componentDidCatch=="function"&&(Fr===null||!Fr.has(x)))){l.flags|=65536,t&=-t,l.lanes|=t;var L=wu(l,d,t);Vs(l,L);break e}}l=l.return}while(l!==null)}ec(r)}catch(K){t=K,Xe===r&&r!==null&&(Xe=r=r.return);continue}break}while(!0)}function Zu(){var e=Ti.current;return Ti.current=Ni,e===null?Ni:e}function Ca(){(Je===0||Je===3||Je===2)&&(Je=4),rt===null||(rn&268435455)===0&&(Mi&268435455)===0||$r(rt,it)}function $i(e,t){var r=Ce;Ce|=2;var n=Zu();(rt!==e||it!==t)&&(vr=null,on(e,t));do try{sp();break}catch(o){qu(e,o)}while(!0);if(Al(),Ce=r,Ti.current=n,Xe!==null)throw Error(c(261));return rt=null,it=0,Je}function sp(){for(;Xe!==null;)Ju(Xe)}function up(){for(;Xe!==null&&!ol();)Ju(Xe)}function Ju(e){var t=nc(e.alternate,e,Nt);e.memoizedProps=e.pendingProps,t===null?ec(e):Xe=t,xa.current=null}function ec(e){var t=e;do{var r=t.alternate;if(e=t.return,(t.flags&32768)===0){if(r=tp(r,t,Nt),r!==null){Xe=r;return}}else{if(r=rp(r,t),r!==null){r.flags&=32767,Xe=r;return}if(e!==null)e.flags|=32768,e.subtreeFlags=0,e.deletions=null;else{Je=6,Xe=null;return}}if(t=t.sibling,t!==null){Xe=t;return}Xe=t=e}while(t!==null);Je===0&&(Je=5)}function ln(e,t,r){var n=pe,o=It.transition;try{It.transition=null,pe=1,cp(e,t,r,n)}finally{It.transition=o,pe=n}return null}function cp(e,t,r,n){do Un();while(Or!==null);if((Ce&6)!==0)throw Error(c(327));r=e.finishedWork;var o=e.finishedLanes;if(r===null)return null;if(e.finishedWork=null,e.finishedLanes=0,r===e.current)throw Error(c(177));e.callbackNode=null,e.callbackPriority=0;var l=r.lanes|r.childLanes;if(qe(e,l),e===rt&&(Xe=rt=null,it=0),(r.subtreeFlags&2064)===0&&(r.flags&2064)===0||Ii||(Ii=!0,oc(yn,function(){return Un(),null})),l=(r.flags&15990)!==0,(r.subtreeFlags&15990)!==0||l){l=It.transition,It.transition=null;var a=pe;pe=1;var d=Ce;Ce|=4,xa.current=null,op(e,r),Hu(r,e),Pd(Cl),Xo=!!Nl,Cl=Nl=null,e.current=r,ip(r),oo(),Ce=d,pe=a,It.transition=l}else e.current=r;if(Ii&&(Ii=!1,Or=e,Fi=o),l=e.pendingLanes,l===0&&(Fr=null),Qo(r.stateNode),yt(e,Ae()),t!==null)for(n=e.onRecoverableError,r=0;r<t.length;r++)o=t[r],n(o.value,{componentStack:o.stack,digest:o.digest});if(Ri)throw Ri=!1,e=ba,ba=null,e;return(Fi&1)!==0&&e.tag!==0&&Un(),l=e.pendingLanes,(l&1)!==0?e===za?Fo++:(Fo=0,za=e):Fo=0,Tr(),null}function Un(){if(Or!==null){var e=Ve(Fi),t=It.transition,r=pe;try{if(It.transition=null,pe=16>e?16:e,Or===null)var n=!1;else{if(e=Or,Or=null,Fi=0,(Ce&6)!==0)throw Error(c(331));var o=Ce;for(Ce|=4,H=e.current;H!==null;){var l=H,a=l.child;if((H.flags&16)!==0){var d=l.deletions;if(d!==null){for(var p=0;p<d.length;p++){var y=d[p];for(H=y;H!==null;){var C=H;switch(C.tag){case 0:case 11:case 15:Mo(8,C,l)}var E=C.child;if(E!==null)E.return=C,H=E;else for(;H!==null;){C=H;var N=C.sibling,A=C.return;if($u(C),C===y){H=null;break}if(N!==null){N.return=A,H=N;break}H=A}}}var Q=l.alternate;if(Q!==null){var Y=Q.child;if(Y!==null){Q.child=null;do{var Ke=Y.sibling;Y.sibling=null,Y=Ke}while(Y!==null)}}H=l}}if((l.subtreeFlags&2064)!==0&&a!==null)a.return=l,H=a;else e:for(;H!==null;){if(l=H,(l.flags&2048)!==0)switch(l.tag){case 0:case 11:case 15:Mo(9,l,l.return)}var h=l.sibling;if(h!==null){h.return=l.return,H=h;break e}H=l.return}}var f=e.current;for(H=f;H!==null;){a=H;var x=a.child;if((a.subtreeFlags&2064)!==0&&x!==null)x.return=a,H=x;else e:for(a=f;H!==null;){if(d=H,(d.flags&2048)!==0)try{switch(d.tag){case 0:case 11:case 15:Li(9,d)}}catch(K){Ye(d,d.return,K)}if(d===a){H=null;break e}var L=d.sibling;if(L!==null){L.return=d.return,H=L;break e}H=d.return}}if(Ce=o,Tr(),zt&&typeof zt.onPostCommitFiberRoot=="function")try{zt.onPostCommitFiberRoot(wn,e)}catch{}n=!0}return n}finally{pe=r,It.transition=t}}return!1}function tc(e,t,r){t=Dn(r,t),t=yu(e,t,1),e=Rr(e,t,1),t=dt(),e!==null&&(_e(e,1,t),yt(e,t))}function Ye(e,t,r){if(e.tag===3)tc(e,e,r);else for(;t!==null;){if(t.tag===3){tc(t,e,r);break}else if(t.tag===1){var n=t.stateNode;if(typeof t.type.getDerivedStateFromError=="function"||typeof n.componentDidCatch=="function"&&(Fr===null||!Fr.has(n))){e=Dn(r,e),e=wu(t,e,1),t=Rr(t,e,1),e=dt(),t!==null&&(_e(t,1,e),yt(t,e));break}}t=t.return}}function dp(e,t,r){var n=e.pingCache;n!==null&&n.delete(t),t=dt(),e.pingedLanes|=e.suspendedLanes&r,rt===e&&(it&r)===r&&(Je===4||Je===3&&(it&130023424)===it&&500>Ae()-wa?on(e,0):ya|=r),yt(e,t)}function rc(e,t){t===0&&((e.mode&1)===0?t=1:(t=u,u<<=1,(u&130023424)===0&&(u=4194304)));var r=dt();e=gr(e,t),e!==null&&(_e(e,t,r),yt(e,r))}function pp(e){var t=e.memoizedState,r=0;t!==null&&(r=t.retryLane),rc(e,r)}function fp(e,t){var r=0;switch(e.tag){case 13:var n=e.stateNode,o=e.memoizedState;o!==null&&(r=o.retryLane);break;case 19:n=e.stateNode;break;default:throw Error(c(314))}n!==null&&n.delete(t),rc(e,r)}var nc;nc=function(e,t,r){if(e!==null)if(e.memoizedProps!==t.pendingProps||mt.current)vt=!0;else{if((e.lanes&r)===0&&(t.flags&128)===0)return vt=!1,ep(e,t,r);vt=(e.flags&131072)!==0}else vt=!1,Be&&(t.flags&1048576)!==0&&Fs(t,gi,t.index);switch(t.lanes=0,t.tag){case 2:var n=t.type;_i(e,t),e=t.pendingProps;var o=Pn(t,lt.current);Fn(t,r),o=ql(null,t,n,e,o,r);var l=Zl();return t.flags|=1,typeof o=="object"&&o!==null&&typeof o.render=="function"&&o.$$typeof===void 0?(t.tag=1,t.memoizedState=null,t.updateQueue=null,ht(n)?(l=!0,di(t)):l=!1,t.memoizedState=o.state!==null&&o.state!==void 0?o.state:null,Hl(t),o.updater=Ci,t.stateNode=o,o._reactInternals=t,oa(t,n,e,r),t=sa(null,t,n,!0,l,r)):(t.tag=0,Be&&l&&Rl(t),ct(null,t,o,r),t=t.child),t;case 16:n=t.elementType;e:{switch(_i(e,t),e=t.pendingProps,o=n._init,n=o(n._payload),t.type=n,o=t.tag=mp(n),e=Vt(n,e),o){case 0:t=aa(null,t,n,e,r);break e;case 1:t=_u(null,t,n,e,r);break e;case 11:t=ju(null,t,n,e,r);break e;case 14:t=Su(null,t,n,Vt(n.type,e),r);break e}throw Error(c(306,n,""))}return t;case 0:return n=t.type,o=t.pendingProps,o=t.elementType===n?o:Vt(n,o),aa(e,t,n,o,r);case 1:return n=t.type,o=t.pendingProps,o=t.elementType===n?o:Vt(n,o),_u(e,t,n,o,r);case 3:e:{if(Pu(t),e===null)throw Error(c(387));n=t.pendingProps,l=t.memoizedState,o=l.element,Qs(e,t),wi(t,n,null,r);var a=t.memoizedState;if(n=a.element,l.isDehydrated)if(l={element:n,isDehydrated:!1,cache:a.cache,pendingSuspenseBoundaries:a.pendingSuspenseBoundaries,transitions:a.transitions},t.updateQueue.baseState=l,t.memoizedState=l,t.flags&256){o=Dn(Error(c(423)),t),t=Lu(e,t,n,r,o);break e}else if(n!==o){o=Dn(Error(c(424)),t),t=Lu(e,t,n,r,o);break e}else for(St=_r(t.stateNode.containerInfo.firstChild),jt=t,Be=!0,Qt=null,r=Ws(t,null,n,r),t.child=r;r;)r.flags=r.flags&-3|4096,r=r.sibling;else{if(Mn(),n===o){t=hr(e,t,r);break e}ct(e,t,n,r)}t=t.child}return t;case 5:return Ks(t),e===null&&Ol(t),n=t.type,o=t.pendingProps,l=e!==null?e.memoizedProps:null,a=o.children,El(n,o)?a=null:l!==null&&El(n,l)&&(t.flags|=32),Eu(e,t),ct(e,t,a,r),t.child;case 6:return e===null&&Ol(t),null;case 13:return Tu(e,t,r);case 4:return Ql(t,t.stateNode.containerInfo),n=t.pendingProps,e===null?t.child=Rn(t,null,n,r):ct(e,t,n,r),t.child;case 11:return n=t.type,o=t.pendingProps,o=t.elementType===n?o:Vt(n,o),ju(e,t,n,o,r);case 7:return ct(e,t,t.pendingProps,r),t.child;case 8:return ct(e,t,t.pendingProps.children,r),t.child;case 12:return ct(e,t,t.pendingProps.children,r),t.child;case 10:e:{if(n=t.type._context,o=t.pendingProps,l=t.memoizedProps,a=o.value,Ie(vi,n._currentValue),n._currentValue=a,l!==null)if(Ht(l.value,a)){if(l.children===o.children&&!mt.current){t=hr(e,t,r);break e}}else for(l=t.child,l!==null&&(l.return=t);l!==null;){var d=l.dependencies;if(d!==null){a=l.child;for(var p=d.firstContext;p!==null;){if(p.context===n){if(l.tag===1){p=mr(-1,r&-r),p.tag=2;var y=l.updateQueue;if(y!==null){y=y.shared;var C=y.pending;C===null?p.next=p:(p.next=C.next,C.next=p),y.pending=p}}l.lanes|=r,p=l.alternate,p!==null&&(p.lanes|=r),Ul(l.return,r,t),d.lanes|=r;break}p=p.next}}else if(l.tag===10)a=l.type===t.type?null:l.child;else if(l.tag===18){if(a=l.return,a===null)throw Error(c(341));a.lanes|=r,d=a.alternate,d!==null&&(d.lanes|=r),Ul(a,r,t),a=l.sibling}else a=l.child;if(a!==null)a.return=l;else for(a=l;a!==null;){if(a===t){a=null;break}if(l=a.sibling,l!==null){l.return=a.return,a=l;break}a=a.return}l=a}ct(e,t,o.children,r),t=t.child}return t;case 9:return o=t.type,n=t.pendingProps.children,Fn(t,r),o=Mt(o),n=n(o),t.flags|=1,ct(e,t,n,r),t.child;case 14:return n=t.type,o=Vt(n,t.pendingProps),o=Vt(n.type,o),Su(e,t,n,o,r);case 15:return Nu(e,t,t.type,t.pendingProps,r);case 17:return n=t.type,o=t.pendingProps,o=t.elementType===n?o:Vt(n,o),_i(e,t),t.tag=1,ht(n)?(e=!0,di(t)):e=!1,Fn(t,r),vu(t,n,o),oa(t,n,o,r),sa(null,t,n,!0,e,r);case 19:return Ru(e,t,r);case 22:return Cu(e,t,r)}throw Error(c(156,t.tag))};function oc(e,t){return Bo(e,t)}function gp(e,t,r,n){this.tag=e,this.key=r,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.ref=null,this.pendingProps=t,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=n,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function Ft(e,t,r,n){return new gp(e,t,r,n)}function Ea(e){return e=e.prototype,!(!e||!e.isReactComponent)}function mp(e){if(typeof e=="function")return Ea(e)?1:0;if(e!=null){if(e=e.$$typeof,e===R)return 11;if(e===D)return 14}return 2}function Ar(e,t){var r=e.alternate;return r===null?(r=Ft(e.tag,t,e.key,e.mode),r.elementType=e.elementType,r.type=e.type,r.stateNode=e.stateNode,r.alternate=e,e.alternate=r):(r.pendingProps=t,r.type=e.type,r.flags=0,r.subtreeFlags=0,r.deletions=null),r.flags=e.flags&14680064,r.childLanes=e.childLanes,r.lanes=e.lanes,r.child=e.child,r.memoizedProps=e.memoizedProps,r.memoizedState=e.memoizedState,r.updateQueue=e.updateQueue,t=e.dependencies,r.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext},r.sibling=e.sibling,r.index=e.index,r.ref=e.ref,r}function Ai(e,t,r,n,o,l){var a=2;if(n=e,typeof e=="function")Ea(e)&&(a=1);else if(typeof e=="string")a=5;else e:switch(e){case ze:return an(r.children,o,l,t);case Ne:a=8,o|=8;break;case J:return e=Ft(12,r,t,o|2),e.elementType=J,e.lanes=l,e;case ee:return e=Ft(13,r,t,o),e.elementType=ee,e.lanes=l,e;case S:return e=Ft(19,r,t,o),e.elementType=S,e.lanes=l,e;case ue:return Bi(r,o,l,t);default:if(typeof e=="object"&&e!==null)switch(e.$$typeof){case Ue:a=10;break e;case Me:a=9;break e;case R:a=11;break e;case D:a=14;break e;case ae:a=16,n=null;break e}throw Error(c(130,e==null?e:typeof e,""))}return t=Ft(a,r,t,o),t.elementType=e,t.type=n,t.lanes=l,t}function an(e,t,r,n){return e=Ft(7,e,n,t),e.lanes=r,e}function Bi(e,t,r,n){return e=Ft(22,e,n,t),e.elementType=ue,e.lanes=r,e.stateNode={isHidden:!1},e}function _a(e,t,r){return e=Ft(6,e,null,t),e.lanes=r,e}function Pa(e,t,r){return t=Ft(4,e.children!==null?e.children:[],e.key,t),t.lanes=r,t.stateNode={containerInfo:e.containerInfo,pendingChildren:null,implementation:e.implementation},t}function hp(e,t,r,n,o){this.tag=t,this.containerInfo=e,this.finishedWork=this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.pendingContext=this.context=null,this.callbackPriority=0,this.eventTimes=je(0),this.expirationTimes=je(-1),this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=je(0),this.identifierPrefix=n,this.onRecoverableError=o,this.mutableSourceEagerHydrationData=null}function La(e,t,r,n,o,l,a,d,p){return e=new hp(e,t,r,d,p),t===1?(t=1,l===!0&&(t|=8)):t=0,l=Ft(3,null,null,t),e.current=l,l.stateNode=e,l.memoizedState={element:n,isDehydrated:r,cache:null,transitions:null,pendingSuspenseBoundaries:null},Hl(l),e}function vp(e,t,r){var n=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:he,key:n==null?null:""+n,children:e,containerInfo:t,implementation:r}}function ic(e){if(!e)return Lr;e=e._reactInternals;e:{if(Pt(e)!==e||e.tag!==1)throw Error(c(170));var t=e;do{switch(t.tag){case 3:t=t.stateNode.context;break e;case 1:if(ht(t.type)){t=t.stateNode.__reactInternalMemoizedMergedChildContext;break e}}t=t.return}while(t!==null);throw Error(c(171))}if(e.tag===1){var r=e.type;if(ht(r))return Ms(e,r,t)}return t}function lc(e,t,r,n,o,l,a,d,p){return e=La(r,n,!0,e,o,l,a,d,p),e.context=ic(null),r=e.current,n=dt(),o=Dr(r),l=mr(n,o),l.callback=t??null,Rr(r,l,o),e.current.lanes=o,_e(e,o,n),yt(e,n),e}function Ui(e,t,r,n){var o=t.current,l=dt(),a=Dr(o);return r=ic(r),t.context===null?t.context=r:t.pendingContext=r,t=mr(l,a),t.payload={element:e},n=n===void 0?null:n,n!==null&&(t.callback=n),e=Rr(o,t,a),e!==null&&(Gt(e,o,a,l),yi(e,o,a)),a}function Wi(e){if(e=e.current,!e.child)return null;switch(e.child.tag){case 5:return e.child.stateNode;default:return e.child.stateNode}}function ac(e,t){if(e=e.memoizedState,e!==null&&e.dehydrated!==null){var r=e.retryLane;e.retryLane=r!==0&&r<t?r:t}}function Ta(e,t){ac(e,t),(e=e.alternate)&&ac(e,t)}function xp(){return null}var sc=typeof reportError=="function"?reportError:function(e){console.error(e)};function Ma(e){this._internalRoot=e}Hi.prototype.render=Ma.prototype.render=function(e){var t=this._internalRoot;if(t===null)throw Error(c(409));Ui(e,t,null,null)},Hi.prototype.unmount=Ma.prototype.unmount=function(){var e=this._internalRoot;if(e!==null){this._internalRoot=null;var t=e.containerInfo;nn(function(){Ui(null,e,null,null)}),t[cr]=null}};function Hi(e){this._internalRoot=e}Hi.prototype.unstable_scheduleHydration=function(e){if(e){var t=me();e={blockedOn:null,target:e,priority:t};for(var r=0;r<Nr.length&&t!==0&&t<Nr[r].priority;r++);Nr.splice(r,0,e),r===0&&Ka(e)}};function Ra(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11)}function Qi(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11&&(e.nodeType!==8||e.nodeValue!==" react-mount-point-unstable "))}function uc(){}function yp(e,t,r,n,o){if(o){if(typeof n=="function"){var l=n;n=function(){var y=Wi(a);l.call(y)}}var a=lc(t,n,e,0,null,!1,!1,"",uc);return e._reactRootContainer=a,e[cr]=a.current,wo(e.nodeType===8?e.parentNode:e),nn(),a}for(;o=e.lastChild;)e.removeChild(o);if(typeof n=="function"){var d=n;n=function(){var y=Wi(p);d.call(y)}}var p=La(e,0,!1,null,null,!1,!1,"",uc);return e._reactRootContainer=p,e[cr]=p.current,wo(e.nodeType===8?e.parentNode:e),nn(function(){Ui(t,p,r,n)}),p}function Vi(e,t,r,n,o){var l=r._reactRootContainer;if(l){var a=l;if(typeof o=="function"){var d=o;o=function(){var p=Wi(a);d.call(p)}}Ui(t,a,e,o)}else a=yp(r,t,e,o,n);return Wi(a)}tr=function(e){switch(e.tag){case 3:var t=e.stateNode;if(t.current.memoizedState.isDehydrated){var r=v(t.pendingLanes);r!==0&&(Fe(t,r|1),yt(t,Ae()),(Ce&6)===0&&(Bn=Ae()+500,Tr()))}break;case 13:nn(function(){var n=gr(e,1);if(n!==null){var o=dt();Gt(n,e,1,o)}}),Ta(e,1)}},X=function(e){if(e.tag===13){var t=gr(e,134217728);if(t!==null){var r=dt();Gt(t,e,134217728,r)}Ta(e,134217728)}},Se=function(e){if(e.tag===13){var t=Dr(e),r=gr(e,t);if(r!==null){var n=dt();Gt(r,e,t,n)}Ta(e,t)}},me=function(){return pe},Ge=function(e,t){var r=pe;try{return pe=e,t()}finally{pe=r}},Zn=function(e,t,r){switch(t){case"input":if(un(e,r),t=r.name,r.type==="radio"&&t!=null){for(r=e;r.parentNode;)r=r.parentNode;for(r=r.querySelectorAll("input[name="+JSON.stringify(""+t)+'][type="radio"]'),t=0;t<r.length;t++){var n=r[t];if(n!==e&&n.form===e.form){var o=ui(n);if(!o)throw Error(c(90));Ur(n),un(n,o)}}}break;case"textarea":cn(e,r);break;case"select":t=r.value,t!=null&&wr(e,!!r.multiple,t,!1)}},Ao=Sa,hn=nn;var wp={usingClientEntryPoint:!1,Events:[ko,En,ui,Qr,At,Sa]},Oo={findFiberByHostInstance:Gr,bundleType:0,version:"18.3.1",rendererPackageName:"react-dom"},bp={bundleType:Oo.bundleType,version:Oo.version,rendererPackageName:Oo.rendererPackageName,rendererConfig:Oo.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:de.ReactCurrentDispatcher,findHostInstanceByFiber:function(e){return e=ro(e),e===null?null:e.stateNode},findFiberByHostInstance:Oo.findFiberByHostInstance||xp,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.3.1-next-f1338f8080-20240426"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var Yi=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!Yi.isDisabled&&Yi.supportsFiber)try{wn=Yi.inject(bp),zt=Yi}catch{}}return wt.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=wp,wt.createPortal=function(e,t){var r=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!Ra(t))throw Error(c(200));return vp(e,t,null,r)},wt.createRoot=function(e,t){if(!Ra(e))throw Error(c(299));var r=!1,n="",o=sc;return t!=null&&(t.unstable_strictMode===!0&&(r=!0),t.identifierPrefix!==void 0&&(n=t.identifierPrefix),t.onRecoverableError!==void 0&&(o=t.onRecoverableError)),t=La(e,1,!1,null,null,r,!1,n,o),e[cr]=t.current,wo(e.nodeType===8?e.parentNode:e),new Ma(t)},wt.findDOMNode=function(e){if(e==null)return null;if(e.nodeType===1)return e;var t=e._reactInternals;if(t===void 0)throw typeof e.render=="function"?Error(c(188)):(e=Object.keys(e).join(","),Error(c(268,e)));return e=ro(t),e=e===null?null:e.stateNode,e},wt.flushSync=function(e){return nn(e)},wt.hydrate=function(e,t,r){if(!Qi(t))throw Error(c(200));return Vi(null,e,t,!0,r)},wt.hydrateRoot=function(e,t,r){if(!Ra(e))throw Error(c(405));var n=r!=null&&r.hydratedSources||null,o=!1,l="",a=sc;if(r!=null&&(r.unstable_strictMode===!0&&(o=!0),r.identifierPrefix!==void 0&&(l=r.identifierPrefix),r.onRecoverableError!==void 0&&(a=r.onRecoverableError)),t=lc(t,null,e,1,r??null,o,!1,l,a),e[cr]=t.current,wo(e),n)for(e=0;e<n.length;e++)r=n[e],o=r._getVersion,o=o(r._source),t.mutableSourceEagerHydrationData==null?t.mutableSourceEagerHydrationData=[r,o]:t.mutableSourceEagerHydrationData.push(r,o);return new Hi(t)},wt.render=function(e,t,r){if(!Qi(t))throw Error(c(200));return Vi(null,e,t,!1,r)},wt.unmountComponentAtNode=function(e){if(!Qi(e))throw Error(c(40));return e._reactRootContainer?(nn(function(){Vi(null,null,e,!1,function(){e._reactRootContainer=null,e[cr]=null})}),!0):!1},wt.unstable_batchedUpdates=Sa,wt.unstable_renderSubtreeIntoContainer=function(e,t,r,n){if(!Qi(r))throw Error(c(200));if(e==null||e._reactInternals===void 0)throw Error(c(38));return Vi(e,t,r,!1,n)},wt.version="18.3.1-next-f1338f8080-20240426",wt}var xc;function Lp(){if(xc)return Oa.exports;xc=1;function s(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(s)}catch(m){console.error(m)}}return s(),Oa.exports=Pp(),Oa.exports}var yc;function Tp(){if(yc)return Ki;yc=1;var s=Lp();return Ki.createRoot=s.createRoot,Ki.hydrateRoot=s.hydrateRoot,Ki}var Mp=Tp();const Rp=Mc(Mp),Ip="http://localhost:3000";async function Xt(s,m={}){let c;try{c=await fetch(`${Ip}${s}`,{headers:{"Content-Type":"application/json"},...m})}catch{const T=new Error("Network error. Please check your connection.");throw T.isNetworkError=!0,T}const k=await c.json().catch(()=>({}));if(!c.ok){const w=new Error(k.message||"Something went wrong. Please try again.");throw w.status=c.status,w.data=k.data,w}return k}const Fp=()=>Xt("/api/category/public"),wc=()=>Xt("/api/dish/public"),bc=()=>Xt("/api/deal/public"),Op=()=>Xt("/api/hero-slide/public"),Dp=s=>Xt("/api/order/public/checkout",{method:"POST",body:JSON.stringify(s)}),zc=s=>Xt(`/api/order/public/${s}`),$p=s=>Xt(`/api/order/public/${s}/cancel`,{method:"PATCH"}),Ap=s=>Xt(`/api/order/public/lookup?phone=${encodeURIComponent(s)}`),kc=()=>Xt("/api/settings"),Bp=(s=30)=>Xt(`/api/review/public?limit=${s}`),Up=s=>Xt("/api/review/public",{method:"POST",body:JSON.stringify(s)}),Wp="http://localhost:3000",ar=s=>s?s.startsWith("http://")||s.startsWith("https://")?s:s.startsWith("/uploads/")?`${Wp}${s}`:s:"",Hn="/assets/genz-pizza-land-logo-CQKpkaM4.jpg",Hp="/assets/sindbad-solution-logo-DhhzzCiL.png",Qp=`
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

@media (prefers-reduced-motion: reduce) {
  .v2-rvm-overlay, .v2-rvm { animation: none; }
}
`,Ic={viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:1.8,strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",focusable:"false"},Fc=()=>i.jsx("svg",{viewBox:"0 0 24 24",fill:"currentColor","aria-hidden":"true",focusable:"false",children:i.jsx("path",{d:"M12 2.5l2.9 6.1 6.6.9-4.8 4.6 1.2 6.6L12 17.5l-5.9 3.2 1.2-6.6L2.5 9.5l6.6-.9L12 2.5z"})}),jc=()=>i.jsxs("svg",{...Ic,children:[i.jsx("path",{d:"M12 20h9"}),i.jsx("path",{d:"M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4L16.5 3.5z"})]}),Vp=()=>i.jsx("svg",{...Ic,width:"20",height:"20",children:i.jsx("path",{d:"M6 6l12 12M18 6L6 18"})}),Sc=({value:s,label:m})=>i.jsx("span",{className:"v2-stars",role:"img","aria-label":m||`${s} out of 5 stars`,children:[1,2,3,4,5].map(c=>i.jsx("span",{className:c<=Math.round(s)?"":"off",style:{display:"inline-flex"},children:i.jsx(Fc,{})},c))}),Nc=["#E6392F","#d97706","#1a9e56","#2563eb","#7c3aed","#db2777","#0f766e"],Yp=(s="")=>{let m=0;for(let c=0;c<s.length;c+=1)m=m*31+s.charCodeAt(c)>>>0;return Nc[m%Nc.length]},Kp=s=>{const m=new Date(s).getTime();if(!m)return"";const c=Math.max(0,(Date.now()-m)/1e3);if(c<60)return"just now";const k=c/60;if(k<60)return`${Math.floor(k)} min ago`;const w=k/60;if(w<24)return`${Math.floor(w)} hour${Math.floor(w)===1?"":"s"} ago`;const T=w/24;if(T<30)return`${Math.floor(T)} day${Math.floor(T)===1?"":"s"} ago`;const re=T/30;return re<12?`${Math.floor(re)} month${Math.floor(re)===1?"":"s"} ago`:`${Math.floor(re/12)} year${Math.floor(re/12)===1?"":"s"} ago`},Cc=["","Poor","Fair","Good","Very good","Excellent"],Oc="gzp-reviewer-name",Gp=()=>{try{return localStorage.getItem(Oc)||""}catch{return""}},Xp=s=>{try{localStorage.setItem(Oc,s)}catch{}},qp=({onOrder:s,onTrack:m,summary:c,taxFree:k})=>i.jsx("section",{className:"v2-hero",children:i.jsx("div",{className:"v2-wrap",children:i.jsxs("div",{className:"v2-hero-grid",children:[i.jsxs("div",{children:[i.jsxs("span",{className:"v2-eyebrow",children:[i.jsx("i",{})," Now delivering across Gojra"]}),i.jsxs("h1",{children:["Hot, cheesy & ",i.jsx("em",{children:"delivered"})," to your door."]}),i.jsx("p",{className:"lead",children:"Fresh pizzas, burgers and sides made to order. Build your own deal, pay cash when it arrives, and watch your order move from the kitchen to your doorstep."}),i.jsxs("div",{className:"v2-cta",children:[i.jsx("button",{type:"button",className:"gzp-btn gzp-btn-primary",onClick:s,children:"Order now"}),i.jsx("button",{type:"button",className:"gzp-btn gzp-btn-ghost",onClick:m,children:"Track my order"})]})]}),i.jsxs("div",{className:"v2-stats","aria-label":"Highlights",children:[i.jsxs("div",{className:"v2-stat",children:[i.jsx("b",{children:"Cash"}),i.jsx("span",{children:"on delivery, no account needed"})]}),i.jsxs("div",{className:"v2-stat",children:[i.jsx("b",{children:"Live"}),i.jsx("span",{children:"order tracking, step by step"})]}),i.jsxs("div",{className:"v2-stat",children:[i.jsx("b",{children:"Custom"}),i.jsx("span",{children:"build your own deal"})]}),i.jsxs("div",{className:"v2-stat",children:[i.jsx("b",{children:c!=null&&c.total?`${c.average} ★`:"Fresh"}),i.jsx("span",{children:c!=null&&c.total?`from ${c.total} customer review${c.total===1?"":"s"}`:"made to order, every time"})]})]})]})})}),Zp=[{icon:"🍕",title:"Made to order",text:"Every pizza is built fresh when you order — never sitting under a heat lamp."},{icon:"🛵",title:"Hot to your door",text:"Our riders deliver across Gojra, so it arrives the way it left the oven."},{icon:"💵",title:"Pay on delivery",text:"No card and no sign-up. Pay the rider in cash when your food arrives."},{icon:"🧩",title:"Build your own deal",text:"Mix flavours, sizes and sides into a bundle that fits your crowd and budget."}],Jp=()=>i.jsxs("section",{className:"v2-section",id:"section-why",children:[i.jsx("span",{className:"v2-kicker",children:"Why GenZ Pizza Land"}),i.jsx("h2",{className:"v2-title",children:"Good food, without the fuss"}),i.jsx("div",{className:"v2-features",children:Zp.map(s=>i.jsxs("div",{className:"v2-feature",children:[i.jsx("div",{className:"v2-ico","aria-hidden":"true",children:s.icon}),i.jsx("h3",{children:s.title}),i.jsx("p",{children:s.text})]},s.title))})]}),ef=()=>i.jsxs("section",{className:"v2-how",id:"section-how",children:[i.jsx("span",{className:"v2-kicker",children:"How it works"}),i.jsx("h2",{className:"v2-title",style:{color:"#fff"},children:"Three steps to a full table"}),i.jsx("p",{className:"v2-sub",children:"From first tap to first bite, it takes a couple of minutes."}),i.jsxs("div",{className:"v2-steps",children:[i.jsxs("div",{className:"v2-step",children:[i.jsx("b",{children:"1"}),i.jsx("h3",{children:"Pick your food"}),i.jsx("p",{children:"Browse the menu and deals, choose your size and crust, and add everything to your order."})]}),i.jsxs("div",{className:"v2-step",children:[i.jsx("b",{children:"2"}),i.jsx("h3",{children:"Confirm your details"}),i.jsx("p",{children:"Enter your name, phone and address. No account, no card — just your delivery details."})]}),i.jsxs("div",{className:"v2-step",children:[i.jsx("b",{children:"3"}),i.jsx("h3",{children:"Track & enjoy"}),i.jsx("p",{children:"Follow your order live as the kitchen cooks it, then pay the rider in cash on arrival."})]})]})]}),tf=({value:s,onChange:m})=>{const[c,k]=j.useState(0),w=c||s;return i.jsxs("div",{className:"v2-starpick",role:"radiogroup","aria-label":"Your rating",onMouseLeave:()=>k(0),children:[[1,2,3,4,5].map(T=>i.jsx("button",{type:"button",role:"radio","aria-checked":s===T,"aria-label":`${T} star${T===1?"":"s"} — ${Cc[T]}`,className:T<=w?"on":"",onMouseEnter:()=>k(T),onFocus:()=>k(T),onBlur:()=>k(0),onClick:()=>m(T),children:i.jsx(Fc,{})},T)),i.jsx("span",{className:"lbl",children:Cc[w]||"Tap a star"})]})},rf=({onClose:s,onSubmitted:m})=>{const[c,k]=j.useState(Gp),[w,T]=j.useState(0),[re,G]=j.useState(""),[B,ye]=j.useState(""),[F,U]=j.useState(""),[V,ge]=j.useState(""),[ve,q]=j.useState(!1),[O,Z]=j.useState(""),[xe,Te]=j.useState(!1);j.useEffect(()=>{const ce=ze=>ze.key==="Escape"&&s();window.addEventListener("keydown",ce);const he=document.body.style.overflow;return document.body.style.overflow="hidden",()=>{window.removeEventListener("keydown",ce),document.body.style.overflow=he}},[s]);const de=async ce=>{if(ce.preventDefault(),!ve){if(!c.trim())return Z("Please enter your name.");if(!w)return Z("Please choose a star rating.");if(F.trim().length<10)return Z("Please write at least a few words about your experience.");Z(""),q(!0);try{const he=await Up({name:c,rating:w,dish:re,title:B,comment:F,website:V});Xp(c.trim()),Te(!0),m(he==null?void 0:he.data)}catch(he){Z(he.message||"Could not send your review. Please try again.")}finally{q(!1)}}};return i.jsx("div",{className:"v2-rvm-overlay",onMouseDown:ce=>ce.target===ce.currentTarget&&s(),role:"presentation",children:i.jsx("div",{className:"v2-rvm",role:"dialog","aria-modal":"true","aria-label":"Write a review",children:xe?i.jsxs("div",{className:"v2-thanks",children:[i.jsx("div",{className:"big","aria-hidden":"true",children:"🎉"}),i.jsx("h3",{children:"Thank you!"}),i.jsx("p",{children:"Your review is live. It really helps other hungry people in Gojra."}),i.jsx("button",{type:"button",className:"gzp-btn gzp-btn-primary gzp-btn-block",onClick:s,children:"Done"})]}):i.jsxs(i.Fragment,{children:[i.jsxs("div",{className:"v2-rvm-head",children:[i.jsxs("div",{children:[i.jsx("h3",{children:"Write a review"}),i.jsx("p",{children:"Tell us how we did — it only takes a minute."})]}),i.jsx("button",{type:"button",className:"gzp-icon-btn",onClick:s,"aria-label":"Close",children:i.jsx(Vp,{})})]}),i.jsxs("form",{className:"v2-rvm-form",onSubmit:de,noValidate:!0,children:[i.jsxs("div",{children:[i.jsx("div",{style:{fontWeight:700,fontSize:".86rem",marginBottom:6},children:"Your rating"}),i.jsx(tf,{value:w,onChange:T})]}),i.jsxs("label",{className:"f",children:[i.jsx("span",{children:"Your name"}),i.jsx("input",{type:"text",value:c,maxLength:60,autoComplete:"name",placeholder:"e.g. Ayesha K.",onChange:ce=>k(ce.target.value)})]}),i.jsxs("label",{className:"f",children:[i.jsxs("span",{children:["What did you order? ",i.jsx("small",{children:"(optional)"})]}),i.jsx("input",{type:"text",value:re,maxLength:80,placeholder:"e.g. Fajita pizza",onChange:ce=>G(ce.target.value)})]}),i.jsxs("label",{className:"f",children:[i.jsxs("span",{children:["Headline ",i.jsx("small",{children:"(optional)"})]}),i.jsx("input",{type:"text",value:B,maxLength:100,placeholder:"Sum it up in a few words",onChange:ce=>ye(ce.target.value)})]}),i.jsxs("label",{className:"f",children:[i.jsx("span",{children:"Your review"}),i.jsx("textarea",{value:F,maxLength:1200,placeholder:"How was the food, the delivery, the service?",onChange:ce=>U(ce.target.value)}),i.jsxs("span",{className:"v2-count",children:[F.length,"/1200"]})]}),i.jsx("input",{className:"v2-hp",type:"text",tabIndex:-1,autoComplete:"off","aria-hidden":"true",value:V,onChange:ce=>ge(ce.target.value)}),O&&i.jsx("p",{className:"v2-form-error",role:"alert",children:O}),i.jsxs("div",{className:"v2-rvm-actions",children:[i.jsx("button",{type:"button",className:"gzp-btn gzp-btn-ghost",onClick:s,children:"Cancel"}),i.jsx("button",{type:"submit",className:"gzp-btn gzp-btn-primary",disabled:ve,children:ve?"Sending…":"Post review"})]})]})]})})})},nf=({onSummary:s})=>{const[m,c]=j.useState([]),[k,w]=j.useState({total:0,average:0,distribution:{}}),[T,re]=j.useState(!0),[G,B]=j.useState(""),[ye,F]=j.useState(!1),[U,V]=j.useState(6),ge=j.useCallback(async()=>{var O,Z;try{const xe=await Bp(60);c(((O=xe.data)==null?void 0:O.reviews)||[]),w(((Z=xe.data)==null?void 0:Z.summary)||{total:0,average:0,distribution:{}}),B("")}catch(xe){B(xe.message||"Could not load reviews.")}finally{re(!1)}},[]);j.useEffect(()=>{ge()},[ge]),j.useEffect(()=>{s==null||s(k)},[k,s]);const ve=j.useMemo(()=>[5,4,3,2,1].map(O=>{var xe;const Z=((xe=k.distribution)==null?void 0:xe[O])||0;return{n:O,count:Z,pct:k.total?Math.round(Z/k.total*100):0}}),[k]),q=()=>F(!0);return i.jsxs("section",{className:"v2-section",id:"section-reviews",children:[i.jsxs("div",{className:"v2-reviews-head",children:[i.jsxs("div",{children:[i.jsx("span",{className:"v2-kicker",children:"Reviews"}),i.jsx("h2",{className:"v2-title",children:"What Gojra is saying"})]}),i.jsxs("button",{type:"button",className:"v2-write inline",onClick:q,children:[i.jsx(jc,{})," Write a Review"]})]}),i.jsxs("div",{className:"v2-rv-layout",children:[i.jsxs("aside",{className:"v2-rv-summary","aria-label":"Rating summary",children:[i.jsxs("div",{className:"v2-rv-score",children:[i.jsx("b",{children:k.total?k.average.toFixed(1):"–"}),i.jsxs("div",{children:[i.jsx(Sc,{value:k.average}),i.jsx("small",{children:k.total?`${k.total} review${k.total===1?"":"s"}`:"No reviews yet"})]})]}),i.jsx("div",{className:"v2-bars",children:ve.map(O=>i.jsxs("div",{className:"v2-bar",children:[i.jsxs("span",{children:[O.n,"★"]}),i.jsx("i",{children:i.jsx("span",{style:{width:`${O.pct}%`}})}),i.jsx("em",{children:O.count})]},O.n))}),i.jsxs("button",{type:"button",className:"v2-write",onClick:q,children:[i.jsx(jc,{})," Write a Review"]})]}),i.jsxs("div",{children:[i.jsxs("div",{className:"v2-rv-list",children:[T&&i.jsx("div",{className:"v2-rv-empty",children:"Loading reviews…"}),!T&&G&&m.length===0&&i.jsxs("div",{className:"v2-rv-empty",children:[i.jsx("b",{children:"Couldn't load reviews"}),G,i.jsx("div",{style:{marginTop:14},children:i.jsx("button",{type:"button",className:"gzp-btn gzp-btn-ghost",onClick:()=>{re(!0),ge()},children:"Try again"})})]}),!T&&!G&&m.length===0&&i.jsxs("div",{className:"v2-rv-empty",children:[i.jsx("span",{"aria-hidden":"true",style:{fontSize:"2rem"},children:"⭐"}),i.jsx("b",{children:"Be the first to review"}),"Ate with us? Tell others what you thought."]}),m.slice(0,U).map(O=>i.jsxs("article",{className:"v2-rv",children:[i.jsxs("div",{className:"v2-rv-top",children:[i.jsx("div",{className:"v2-avatar",style:{background:Yp(O.name)},"aria-hidden":"true",children:(O.name||"?").trim().charAt(0).toUpperCase()}),i.jsxs("div",{children:[i.jsx("strong",{children:O.name}),i.jsx("span",{children:Kp(O.createdAt)})]})]}),i.jsx(Sc,{value:O.rating}),O.title&&i.jsx("h4",{children:O.title}),i.jsx("p",{children:O.comment}),O.dish&&i.jsxs("span",{className:"v2-rv-dish",children:["🍽 ",O.dish]})]},O._id))]}),m.length>U&&i.jsx("button",{type:"button",className:"gzp-btn gzp-btn-ghost v2-more",onClick:()=>V(O=>O+6),children:"Show more reviews"})]})]}),ye&&i.jsx(rf,{onClose:()=>F(!1),onSubmitted:()=>{ge()}})]})},of=({whatsappLink:s,onTrack:m})=>i.jsxs("section",{className:"v2-contact",id:"section-contact",children:[i.jsxs("div",{className:"v2-panel warm",children:[i.jsx("span",{className:"v2-kicker",children:"Questions?"}),i.jsx("h2",{className:"v2-title",style:{color:"#fff"},children:"Talk to us on WhatsApp"}),i.jsx("p",{className:"v2-sub",children:"Special requests, party orders or a question about your delivery — message the shop directly."}),i.jsx("a",{className:"gzp-btn",href:s,target:"_blank",rel:"noopener noreferrer",children:"Chat on WhatsApp"})]}),i.jsxs("div",{className:"v2-panel",children:[i.jsx("span",{className:"v2-kicker",children:"Good to know"}),i.jsxs("ul",{className:"v2-facts",children:[i.jsxs("li",{children:[i.jsx("span",{"aria-hidden":"true",children:"📍"})," Delivering across Gojra"]}),i.jsxs("li",{children:[i.jsx("span",{"aria-hidden":"true",children:"💵"})," Cash on delivery — the rider collects the total"]}),i.jsxs("li",{children:[i.jsx("span",{"aria-hidden":"true",children:"⏱"})," Live order tracking from the kitchen to your door"]})]}),i.jsx("button",{type:"button",className:"gzp-btn gzp-btn-ghost",onClick:m,children:"Track an order"})]})]}),lf=({taxRatePercent:s,onNavigate:m,onTrack:c})=>i.jsx("footer",{className:"v2-footer",children:i.jsxs("div",{className:"v2-wrap",children:[i.jsxs("div",{className:"v2-footer-grid",children:[i.jsxs("div",{children:[i.jsxs("div",{className:"brand",children:[i.jsx("img",{src:Hn,alt:""})," GenZ Pizza Land"]}),i.jsxs("p",{children:["Fresh pizzas, burgers and sides, delivered hot across Gojra. Prices are in rupees;"," ",s,"% tax is added at checkout and the rider collects the total in cash."]})]}),i.jsxs("div",{children:[i.jsx("h4",{children:"Explore"}),i.jsxs("ul",{children:[i.jsx("li",{children:i.jsx("button",{type:"button",onClick:()=>m("menu"),children:"Menu"})}),i.jsx("li",{children:i.jsx("button",{type:"button",onClick:()=>m("deals"),children:"Deals"})}),i.jsx("li",{children:i.jsx("button",{type:"button",onClick:()=>m("reviews"),children:"Reviews"})})]})]}),i.jsxs("div",{children:[i.jsx("h4",{children:"Help"}),i.jsxs("ul",{children:[i.jsx("li",{children:i.jsx("button",{type:"button",onClick:c,children:"Track an order"})}),i.jsx("li",{children:i.jsx("button",{type:"button",onClick:()=>m("how"),children:"How it works"})}),i.jsx("li",{children:i.jsx("button",{type:"button",onClick:()=>m("contact"),children:"Contact us"})})]})]})]}),i.jsxs("div",{className:"v2-footer-bottom",children:[i.jsxs("span",{children:["© ",new Date().getFullYear()," GenZ Pizza Land. All rights reserved."]}),i.jsxs("span",{className:"credit",children:["Developed by ",i.jsx("img",{src:Hp,alt:""})," ",i.jsx("strong",{children:"Sindbad Solution"})]})]})]})}),Wn={enabled:!0,minItems:3,discount3:15,discount4:17,discount5Plus:20,description:"Pick any 3 or more items from our menu — pizzas, burgers, wings, drinks, anything. The more you add, the more you save. No codes, the discount applies automatically."},Aa=s=>{const m=(k,w)=>typeof k=="number"&&!Number.isNaN(k)?k:w,c=s&&typeof s=="object"?s:{};return{enabled:typeof c.enabled=="boolean"?c.enabled:Wn.enabled,minItems:Math.max(1,Math.round(m(c.minItems,Wn.minItems))),discount3:m(c.discount3,Wn.discount3),discount4:m(c.discount4,Wn.discount4),discount5Plus:m(c.discount5Plus,Wn.discount5Plus),description:typeof c.description=="string"?c.description:Wn.description}},tl=(s,m)=>!m.enabled||s<m.minItems?0:s>=5?m.discount5Plus:s===4?m.discount4:m.discount3,Ct=s=>`${Number.isInteger(s)?s:Number(s.toFixed(1))}%`,qi=s=>{const m=Number(s)||0;return`Rs ${m.toLocaleString("en-PK",{minimumFractionDigits:Number.isInteger(m)?0:2,maximumFractionDigits:2})}`},Dc=(s,m)=>{const c=m.minItems-s;if(s===0)return`Pick ${m.minItems} items to unlock ${Ct(m.discount3)} off`;if(c>0)return`Add ${c} more item${c===1?"":"s"} to unlock ${Ct(m.discount3)} off`;const k=tl(s,m),w=s>=5?null:s+1,T=w?tl(w,m):null;return T&&T>k?`${Ct(k)} off unlocked — add 1 more item for ${Ct(T)} off`:s>=5?`Best discount unlocked — ${Ct(k)} off your picks`:`${Ct(k)} off unlocked`},af=`
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
`,sf=({cfg:s,pickedCount:m,onStart:c})=>i.jsx("section",{className:"gzp-byo-section","aria-label":"Build your own deal",children:i.jsx("div",{className:"gzp-shell",children:i.jsxs("div",{className:"gzp-byo-banner",children:[i.jsxs("div",{style:{position:"relative",zIndex:1},children:[i.jsx("span",{className:"gzp-byo-eyebrow",children:"🎯 Make it yours"}),i.jsxs("h2",{children:["Build your ",i.jsx("em",{children:"own deal"})]}),s.description&&i.jsx("p",{children:s.description}),i.jsx("button",{type:"button",className:"gzp-btn gzp-btn-primary",onClick:c,children:m>0?`Edit your deal (${m} item${m===1?"":"s"})`:"Start building"})]}),i.jsxs("div",{className:"gzp-byo-tiers",children:[i.jsxs("div",{className:"gzp-byo-tier",children:[i.jsx("b",{children:Ct(s.discount3)}),i.jsx("small",{children:"off"}),i.jsxs("span",{children:[s.minItems," items"]})]}),i.jsxs("div",{className:"gzp-byo-tier",children:[i.jsx("b",{children:Ct(s.discount4)}),i.jsx("small",{children:"off"}),i.jsx("span",{children:"4 items"})]}),i.jsxs("div",{className:"gzp-byo-tier is-best",children:[i.jsx("b",{children:Ct(s.discount5Plus)}),i.jsx("small",{children:"off"}),i.jsx("span",{children:"5+ items"})]})]})]})})}),uf=s=>{const m=[];return((s==null?void 0:s.variants)||[]).forEach(c=>{c.size&&!m.includes(c.size)&&m.push(c.size)}),m},cf=(s,m)=>{const c=[];return((s==null?void 0:s.variants)||[]).forEach(k=>{k.size===m&&k.crust&&!c.includes(k.crust)&&c.push(k.crust)}),c},$c=(s,m,c)=>((s==null?void 0:s.variants)||[]).find(k=>k.size===m&&(k.crust||"")===(c||""))||null,Ac=(s,m="",c="")=>`${s}:${m||""}||${c||""}`,df=({dish:s,picks:m,dishQty:c,stockLeft:k,onAdd:w,onRemove:T})=>{const re=j.useMemo(()=>uf(s),[s]),G=re.length>0,[B,ye]=j.useState(re[0]||""),F=j.useMemo(()=>cf(s,B),[s,B]),[U,V]=j.useState(F[0]||""),[ge,ve]=j.useState(!1);j.useEffect(()=>{F.length>0&&!F.includes(U)?V(F[0]):F.length===0&&U!==""&&V("")},[B]);const q=G?$c(s,B,U):null,O=G?(s.variants||[]).reduce((J,Ue)=>J===null||Ue.price<J.price?Ue:J,null):null,Z=G?(q==null?void 0:q.price)??(O==null?void 0:O.price)??s.price:s.price,xe=Ac(s._id,B,U),Te=m[xe]||0,de=c,ce=typeof s.availableQty=="number"&&k<=0&&de===0,he=typeof s.availableQty=="number"&&k<=0,ze=(!G||!!q)&&!he,Ne=ar(s.image);return i.jsxs("div",{className:`gzp-byo-tile${de>0?" is-picked":""}`,children:[i.jsxs("div",{className:"gzp-byo-tile-media",children:[Ne&&!ge?i.jsx("img",{src:Ne,alt:s.name,loading:"lazy",onError:()=>ve(!0)}):i.jsx("span",{"aria-hidden":"true",children:s.icon||"🍽️"}),de>0&&i.jsxs("span",{className:"gzp-byo-badge",children:["×",de]})]}),i.jsxs("div",{className:"gzp-byo-tile-body",children:[i.jsx("h4",{children:s.name}),i.jsxs("div",{className:"gzp-byo-price",children:[G&&i.jsx("small",{children:"From"}),qi(Z)]}),G&&i.jsxs("div",{className:"gzp-byo-selects",children:[i.jsx("select",{className:"gzp-select",value:B,onChange:J=>ye(J.target.value),"aria-label":`Size for ${s.name}`,children:re.map(J=>i.jsx("option",{value:J,children:J},J))}),F.length>0&&i.jsx("select",{className:"gzp-select",value:U,onChange:J=>V(J.target.value),"aria-label":`Crust for ${s.name}`,children:F.map(J=>i.jsx("option",{value:J,children:J},J))})]}),i.jsx("div",{className:"gzp-byo-tile-foot",children:Te>0?i.jsxs("div",{className:"gzp-stepper",style:{width:"100%",justifyContent:"space-between"},children:[i.jsx("button",{type:"button",onClick:()=>T(xe),"aria-label":`Remove one ${s.name}`,children:"−"}),i.jsx("span",{"aria-live":"polite",children:Te}),i.jsx("button",{type:"button",disabled:!ze,onClick:()=>w(s,B,U),"aria-label":`Add one more ${s.name}`,children:"+"})]}):i.jsx("button",{type:"button",className:"gzp-byo-add",disabled:!ze,onClick:()=>w(s,B,U),children:ce?"Sold out":"+ Add"})})]})]})},pf=({cfg:s,dishes:m,categories:c,initialPicks:k,getOtherQty:w,onClose:T,onConfirm:re})=>{const[G,B]=j.useState(()=>({...k||{}})),[ye,F]=j.useState("all");j.useEffect(()=>{const R=document.body.style.overflow;document.body.style.overflow="hidden";const ee=S=>S.key==="Escape"&&T();return window.addEventListener("keydown",ee),()=>{document.body.style.overflow=R,window.removeEventListener("keydown",ee)}},[T]);const U=j.useMemo(()=>{const R={};return m.forEach(ee=>{R[ee._id]=ee}),R},[m]),V=j.useMemo(()=>{const R=new Map;m.forEach(ae=>{var P;const ue=((P=ae.category)==null?void 0:P._id)||ae.category||"other";R.has(ue)||R.set(ue,[]),R.get(ue).push(ae)});const ee=c.filter(ae=>(R.get(ae._id)||[]).length>0).map(ae=>({id:ae._id,name:ae.name,items:R.get(ae._id)})),S=new Set(c.map(ae=>ae._id)),D=m.filter(ae=>{var ue;return!S.has(((ue=ae.category)==null?void 0:ue._id)||ae.category)});return D.length&&ee.push({id:"other",name:"More to eat",items:D}),ee},[m,c]),ge=R=>Object.entries(G).reduce((ee,[S,D])=>S.startsWith(`${R}:`)?ee+D:ee,0),ve=R=>typeof R.availableQty=="number"?R.availableQty-ge(R._id)-(w?w(R._id):0):1/0,q=(R,ee,S)=>{if(ve(R)<=0)return;const D=Ac(R._id,ee,S);B(ae=>({...ae,[D]:(ae[D]||0)+1}))},O=R=>B(ee=>{const S={...ee,[R]:Math.max(0,(ee[R]||0)-1)};return S[R]===0&&delete S[R],S}),{count:Z,gross:xe}=j.useMemo(()=>{let R=0,ee=0;return Object.entries(G).forEach(([S,D])=>{const[ae,ue="||"]=S.split(/:(.+)/),P=U[ae];if(!P)return;const[W,I]=ue.split("||"),g=W?$c(P,W,I):null;R+=D,ee+=(g?g.price:P.price)*D}),{count:R,gross:ee}},[G,U]),Te=tl(Z,s),de=Math.round(xe*Te/100),ce=xe-de,he=Z>=s.minItems,ze=[{n:s.minItems,label:Ct(s.discount3)},{n:4,label:Ct(s.discount4)},{n:5,label:Ct(s.discount5Plus)}].filter((R,ee,S)=>ee===0||R.n>S[ee-1].n),Ne=ze[ze.length-1].n,J=R=>`${R/Ne*100}%`,Ue=`${Math.min(Z,Ne)/Ne*100}%`,Me=ye==="all"?V:V.filter(R=>R.id===ye);return i.jsx("div",{className:"gzp-byo-overlay",onClick:T,children:i.jsxs("div",{className:"gzp-byo-panel",onClick:R=>R.stopPropagation(),role:"dialog","aria-modal":"true","aria-label":"Build your own deal",children:[i.jsxs("div",{className:"gzp-byo-head",children:[i.jsxs("div",{children:[i.jsx("h2",{children:"🎯 Build your own deal"}),i.jsxs("p",{children:["Choose at least ",s.minItems," items — your discount grows with every item."]})]}),i.jsx("button",{className:"gzp-icon-btn",type:"button",onClick:T,"aria-label":"Close",children:"✕"})]}),i.jsxs("div",{className:"gzp-byo-progress",children:[i.jsxs("div",{className:"gzp-byo-track",role:"progressbar","aria-valuemin":0,"aria-valuemax":Ne,"aria-valuenow":Math.min(Z,Ne),children:[i.jsx("div",{className:"gzp-byo-fill",style:{width:Ue}}),ze.map(R=>i.jsxs("div",{className:`gzp-byo-mark${Z>=R.n?" is-hit":""}`,style:{left:J(R.n)},children:[R.n===Ne&&R.n>=5?`${R.n}+`:R.n,i.jsxs("span",{children:[R.label," off"]})]},R.n))]}),i.jsx("p",{className:`gzp-byo-nudge${he?" is-ok":""}`,children:Dc(Z,s)})]}),i.jsxs("div",{className:"gzp-byo-cats",role:"tablist","aria-label":"Menu categories",children:[i.jsx("button",{type:"button",className:`gzp-byo-cat${ye==="all"?" is-active":""}`,onClick:()=>F("all"),children:"All"}),V.map(R=>i.jsx("button",{type:"button",className:`gzp-byo-cat${ye===R.id?" is-active":""}`,onClick:()=>F(R.id),children:R.name},R.id))]}),i.jsx("div",{className:"gzp-byo-body",children:Me.map(R=>i.jsxs("div",{className:"gzp-byo-group",children:[i.jsx("h3",{children:R.name}),i.jsx("div",{className:"gzp-byo-grid",children:R.items.map(ee=>i.jsx(df,{dish:ee,picks:G,dishQty:ge(ee._id),stockLeft:ve(ee),onAdd:q,onRemove:O},ee._id))})]},R.id))}),i.jsxs("div",{className:"gzp-byo-foot",children:[i.jsxs("div",{className:"gzp-byo-sum",children:[i.jsxs("small",{children:[Z," item",Z===1?"":"s"," picked"]}),i.jsxs("div",{children:[i.jsx("b",{children:qi(ce)}),de>0&&i.jsx("s",{children:qi(xe)}),de>0&&i.jsxs("em",{children:["You save ",qi(de)]})]})]}),i.jsx("button",{type:"button",className:"gzp-btn gzp-btn-primary",disabled:!he,onClick:()=>re(G),children:he?`Add to my order · ${Ct(Te)} off`:`Pick ${s.minItems-Z} more to continue`})]})]})})},ff="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,400..900&family=Hanken+Grotesk:wght@400..800&display=swap",gf=`
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
`;(()=>{if(typeof document>"u")return;if(!document.getElementById("gzp-fonts")){const m=document.createElement("link");m.rel="preconnect",m.href="https://fonts.googleapis.com",document.head.appendChild(m);const c=document.createElement("link");c.rel="preconnect",c.href="https://fonts.gstatic.com",c.crossOrigin="",document.head.appendChild(c);const k=document.createElement("link");k.id="gzp-fonts",k.rel="stylesheet",k.href=ff,document.head.appendChild(k)}let s=document.getElementById("gzp-styles");if(s||(s=document.createElement("style"),s.id="gzp-styles",document.head.appendChild(s)),s.textContent=gf+af+Qp,!document.querySelector('meta[name="theme-color"]')){const m=document.createElement("meta");m.name="theme-color",m.content="#FFF8EF",document.head.appendChild(m)}})();const mf=16,Ec=["Pending","Accepted","Preparing","Ready to Deliver","Completed"],_c={Pending:"Order received",Accepted:"Accepted by the kitchen",Preparing:"Preparing your food","Ready to Deliver":"Out for delivery",Completed:"Delivered",Cancelled:"Cancelled"},hf={Pending:"We've got your order",Accepted:"The kitchen is on it",Preparing:"Your food is cooking","Ready to Deliver":"On the way to you",Completed:"Delivered — enjoy",Cancelled:"Order cancelled"},Gi="deals",vf="923259061006",Bc=`https://wa.me/${vf}?text=${encodeURIComponent("Hello GenZ Pizza Land, I have an inquiry.")}`,xf=1e4,bt=s=>{const m=Number(s)||0;return`Rs ${m.toLocaleString("en-PK",{minimumFractionDigits:Number.isInteger(m)?0:2,maximumFractionDigits:2})}`},Wa=s=>{const m=[];return((s==null?void 0:s.variants)||[]).forEach(c=>{c.size&&!m.includes(c.size)&&m.push(c.size)}),m},Zi=(s,m)=>{const c=[];return((s==null?void 0:s.variants)||[]).forEach(k=>{k.size===m&&k.crust&&!c.includes(k.crust)&&c.push(k.crust)}),c},Ha=(s,m,c)=>((s==null?void 0:s.variants)||[]).find(k=>k.size===m&&(k.crust||"")===(c||""))||null,Uc=s=>((s==null?void 0:s.variants)||[]).reduce((m,c)=>m===null||c.price<m.price?c:m,null),Xi=s=>{let m=s.replace(/[^\d+]/g,"");return m=m[0]==="+"?"+"+m.slice(1).replace(/\+/g,""):m.replace(/\+/g,""),m.slice(0,14)},Pc=s=>{const m=s.replace(/\D/g,"");return m.length>=10&&m.length<=13},Qn={width:20,height:20,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:1.8,strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",focusable:"false"},Wc=s=>i.jsxs("svg",{...Qn,...s,children:[i.jsx("circle",{cx:"11",cy:"11",r:"7"}),i.jsx("path",{d:"m20 20-3.2-3.2"})]}),yf=s=>i.jsxs("svg",{...Qn,...s,children:[i.jsx("path",{d:"M6 8h12l-1 11H7L6 8Z"}),i.jsx("path",{d:"M9.5 8V6.5a2.5 2.5 0 0 1 5 0V8"})]}),wf=s=>i.jsx("svg",{...Qn,strokeWidth:2.4,...s,children:i.jsx("path",{d:"M12 5v14M5 12h14"})}),Ba=({dir:s="right",...m})=>i.jsx("svg",{...Qn,strokeWidth:2,...m,children:i.jsx("path",{d:s==="left"?"m14.5 5-7 7 7 7":"m9.5 5 7 7-7 7"})}),Hc=s=>i.jsxs("svg",{...Qn,...s,children:[i.jsx("path",{d:"M3 7h11v9H3zM14 10h4l3 3v3h-7z"}),i.jsx("circle",{cx:"7",cy:"18",r:"1.6"}),i.jsx("circle",{cx:"17.5",cy:"18",r:"1.6"})]}),bf=({filled:s,...m})=>i.jsx("svg",{...Qn,strokeWidth:2,fill:s?"currentColor":"none",...m,children:i.jsx("path",{d:"M12 20.5s-7.3-4.6-9.9-9.1C.5 8 1.9 4.6 5.1 3.6c2-.6 4.1.1 5.4 1.8l1.5 2 1.5-2c1.3-1.7 3.4-2.4 5.4-1.8 3.2 1 4.6 4.4 3 7.8-2.6 4.5-9.9 9.1-9.9 9.1Z"})}),Ji=({price:s,originalPrice:m,from:c})=>i.jsxs("p",{className:"gzp-price",children:[c&&i.jsx("span",{className:"gzp-price-from",children:"From"}),bt(s),m>s&&i.jsx("s",{children:bt(m)})]}),Qa=({src:s,alt:m,icon:c,className:k})=>{const[w,T]=j.useState(!1);return j.useEffect(()=>T(!1),[s]),s&&!w?i.jsx("img",{src:s,alt:m,className:k,loading:"lazy",onError:()=>T(!0)}):i.jsx("div",{className:"gzp-media-fallback",children:c||"🍽️"})},sn=s=>typeof s!="number"?null:s<=0?{text:"Sold out",out:!0}:s<=5?{text:`Only ${s} left`,out:!1}:null,zf=({slides:s,onSlideClick:m})=>{var ye;const[c,k]=j.useState(0),[w,T]=j.useState(!1),re=j.useRef(typeof window<"u"&&((ye=window.matchMedia)==null?void 0:ye.call(window,"(prefers-reduced-motion: reduce)").matches)).current;if(j.useEffect(()=>{if(s.length<=1||w||re)return;const F=setInterval(()=>k(U=>(U+1)%s.length),4200);return()=>clearInterval(F)},[s.length,w,re]),j.useEffect(()=>{c>=s.length&&k(0)},[s.length,c]),s.length===0)return i.jsx("div",{className:"gzp-slider","aria-hidden":"true",children:i.jsx("div",{className:"gzp-slider-fallback",children:i.jsx("img",{src:Hn,alt:""})})});const G=s[c],B=!!m;return i.jsxs("div",{className:"gzp-slider",onMouseEnter:()=>T(!0),onMouseLeave:()=>T(!1),onTouchStart:()=>T(!0),onTouchEnd:()=>T(!1),onClick:B?()=>m(G):void 0,role:B?"button":void 0,tabIndex:B?0:void 0,onKeyDown:B?F=>{(F.key==="Enter"||F.key===" ")&&m(G)}:void 0,children:[s.map((F,U)=>i.jsx("img",{src:F.url,alt:F.alt||"","aria-hidden":U!==c||void 0,className:`gzp-slider-img${U===c?" is-active":""}`},F.url+U)),s.length>1&&i.jsx("div",{className:"gzp-slider-dots",role:"tablist","aria-label":"Featured photos",children:s.map((F,U)=>i.jsx("button",{type:"button",role:"tab","aria-selected":U===c,"aria-label":`Show photo ${U+1} of ${s.length}`,className:`gzp-slider-dot${U===c?" is-active":""}`,onClick:V=>{V.stopPropagation(),k(U)}},U))})]})},kf=()=>i.jsxs("svg",{viewBox:"0 0 140 140",className:"gzp-thankyou-mascot","aria-hidden":"true",children:[i.jsxs("g",{stroke:"#e0b84a",strokeWidth:"3",strokeLinecap:"round",fill:"none",opacity:"0.75",children:[i.jsx("path",{d:"M52 20 C 47 12, 57 9, 53 1"}),i.jsx("path",{d:"M70 20 C 65 12, 75 9, 71 1"}),i.jsx("path",{d:"M88 20 C 83 12, 93 9, 89 1"})]}),i.jsx("path",{d:"M20 32 L120 32 L70 132 Z",fill:"#ffcf5c",stroke:"#e0a92e",strokeWidth:"4",strokeLinejoin:"round"}),i.jsx("path",{d:"M20 32 Q70 47 120 32",fill:"none",stroke:"#e0a92e",strokeWidth:"4",strokeLinecap:"round"}),i.jsx("circle",{cx:"52",cy:"58",r:"6",fill:"#e6503d"}),i.jsx("circle",{cx:"88",cy:"62",r:"6",fill:"#e6503d"}),i.jsx("circle",{cx:"70",cy:"90",r:"6",fill:"#e6503d"}),i.jsx("circle",{cx:"56",cy:"76",r:"5.5",fill:"#3a2b1a"}),i.jsx("circle",{cx:"84",cy:"76",r:"5.5",fill:"#3a2b1a"}),i.jsx("path",{d:"M60 96 Q70 104 80 96",stroke:"#3a2b1a",strokeWidth:"3.5",fill:"none",strokeLinecap:"round"})]}),jf=({order:s,onTrack:m,onContinue:c})=>{const k=String((s==null?void 0:s._id)||"").slice(-6).toUpperCase();return i.jsx("div",{className:"gzp-thankyou-overlay",role:"dialog","aria-modal":"true","aria-label":"Order confirmed",children:i.jsxs("div",{className:"gzp-thankyou-card",children:[i.jsx("span",{className:"gzp-thankyou-sticker tl","aria-hidden":"true",children:"🎉"}),i.jsx("span",{className:"gzp-thankyou-sticker tr","aria-hidden":"true",children:"🍕"}),i.jsx("span",{className:"gzp-thankyou-sticker bl","aria-hidden":"true",children:"🧀"}),i.jsx("span",{className:"gzp-thankyou-sticker br","aria-hidden":"true",children:"🎊"}),i.jsx("div",{className:"gzp-thankyou-badge",children:i.jsx("img",{src:Hn,alt:"GenZ Pizza Land"})}),i.jsx(kf,{}),i.jsx("h2",{className:"gzp-thankyou-title",children:"Thank you! 🎉"}),i.jsx("p",{className:"gzp-thankyou-sub",children:"Your order's in and the kitchen's already looking at it."}),k&&i.jsxs("span",{className:"gzp-thankyou-pill",children:["Order #",k]}),i.jsx("button",{type:"button",className:"gzp-thankyou-track-btn",onClick:m,children:"Track My Order"}),i.jsx("button",{type:"button",className:"gzp-thankyou-link",onClick:c,children:"Click for more order"})]})})},el=({qty:s,onAdd:m,onRemove:c,size:k,label:w})=>i.jsxs("div",{className:`gzp-stepper${k==="lg"?" gzp-stepper-lg":""}`,children:[i.jsx("button",{type:"button",onClick:c,"aria-label":`Remove one ${w}`,children:"−"}),i.jsx("span",{"aria-live":"polite",children:s}),i.jsx("button",{type:"button",onClick:m,"aria-label":`Add one more ${w}`,children:"+"})]}),Sf=({dish:s,cart:m,cartKey:c,addToCart:k,removeFromCart:w,onOpenQuickView:T})=>{const re=j.useMemo(()=>Wa(s),[s]),G=re.length>0,[B,ye]=j.useState(re[0]||""),F=j.useMemo(()=>Zi(s,B),[s,B]),[U,V]=j.useState(F[0]||""),[ge,ve]=j.useState(!1);j.useEffect(()=>{F.length>0&&!F.includes(U)?V(F[0]):F.length===0&&U!==""&&V("")},[B]);const q=G?Ha(s,B,U):null,O=G?Uc(s):null,Z=G?(q==null?void 0:q.price)??(O==null?void 0:O.price)??s.price:s.price,xe=G?(q==null?void 0:q.originalPrice)??0:s.originalPrice,Te=c("dish",s._id,B,U),de=m[Te]||0,ce=sn(s.availableQty),he=!!(ce!=null&&ce.out),ze=(!G||!!q)&&!he,Ne=()=>T(s);return i.jsxs("div",{className:"gzp-card",children:[i.jsxs("div",{className:"gzp-card-media",role:"button",tabIndex:0,onClick:Ne,onKeyDown:J=>J.key==="Enter"&&Ne(),children:[i.jsx(Qa,{src:ar(s.image),alt:s.name,icon:s.icon}),ce&&i.jsx("span",{className:`gzp-stock${ce.out?" is-out":""}`,children:ce.text}),!G&&s.originalPrice>s.price&&i.jsxs("span",{className:"gzp-save",children:["Save ",Math.round((s.originalPrice-s.price)/s.originalPrice*100),"%"]}),i.jsx("button",{type:"button",className:`gzp-wish${ge?" is-active":""}`,onClick:J=>{J.stopPropagation(),ve(Ue=>!Ue)},"aria-pressed":ge,"aria-label":ge?`Remove ${s.name} from favourites`:`Add ${s.name} to favourites`,children:i.jsx(bf,{filled:ge})})]}),i.jsxs("div",{className:"gzp-card-body",children:[i.jsx("h3",{role:"button",tabIndex:0,onClick:Ne,onKeyDown:J=>J.key==="Enter"&&Ne(),children:s.name}),i.jsx(Ji,{price:Z,originalPrice:xe,from:G}),s.description&&i.jsx("p",{className:"gzp-card-desc",children:s.description}),G&&i.jsxs("div",{className:"gzp-variant-row",onClick:J=>J.stopPropagation(),role:"presentation",children:[i.jsx("select",{className:"gzp-select",value:B,onChange:J=>ye(J.target.value),"aria-label":`Size for ${s.name}`,children:re.map(J=>i.jsx("option",{value:J,children:J},J))}),F.length>0&&i.jsx("select",{className:"gzp-select",value:U,onChange:J=>V(J.target.value),"aria-label":`Crust for ${s.name}`,children:F.map(J=>i.jsx("option",{value:J,children:J},J))})]}),i.jsx("div",{className:"gzp-card-foot",onClick:J=>J.stopPropagation(),role:"presentation",children:de?i.jsx(el,{qty:de,label:s.name,onAdd:()=>k("dish",s._id,s.name,B,U),onRemove:()=>w("dish",s._id,B,U)}):i.jsx("button",{type:"button",className:"gzp-add gzp-add-wide",disabled:!ze,onClick:()=>k("dish",s._id,s.name,B,U),children:he?"Sold out":i.jsxs(i.Fragment,{children:[i.jsx(wf,{})," Add"]})})})]})]})},Nf=()=>i.jsxs("div",{className:"gzp-skeleton",children:[i.jsx("div",{className:"gzp-skeleton-media"}),i.jsxs("div",{className:"gzp-skeleton-lines",children:[i.jsx("i",{}),i.jsx("i",{})]})]}),Cf=()=>i.jsx("a",{className:"gzp-whatsapp",href:Bc,target:"_blank",rel:"noopener noreferrer","aria-label":"Chat with us on WhatsApp for any inquiry",title:"WhatsApp inquiry: +92 325 9061006",children:i.jsx("svg",{viewBox:"0 0 32 32",width:"30",height:"30","aria-hidden":"true",fill:"#fff",children:i.jsx("path",{d:"M16.03 3C9.4 3 4 8.38 4 15c0 2.12.56 4.19 1.62 6.01L4 29l8.2-1.58A12.02 12.02 0 0 0 16.03 27C22.66 27 28 21.62 28 15S22.66 3 16.03 3zm0 21.9c-1.8 0-3.56-.48-5.1-1.4l-.37-.22-4.86.94.98-4.73-.24-.39A9.86 9.86 0 0 1 6.1 15c0-5.46 4.45-9.9 9.93-9.9S26 9.54 26 15s-4.5 9.9-9.97 9.9zm5.44-7.4c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.27-.47-2.42-1.49-.9-.8-1.5-1.78-1.67-2.08-.17-.3-.02-.46.13-.61.14-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.05 1.03-1.05 2.5s1.08 2.9 1.23 3.1c.15.2 2.12 3.23 5.13 4.53.72.31 1.28.5 1.71.63.72.23 1.37.2 1.89.12.58-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.13-.27-.2-.57-.35z"})})}),Ua=({minimal:s,cartCount:m,onSearch:c,onCart:k,onNavigate:w,onTrack:T})=>i.jsx("header",{className:"gzp-header",children:i.jsxs("div",{className:"gzp-header-inner",children:[i.jsxs("button",{className:"gzp-brand",onClick:()=>window.scrollTo({top:0,behavior:"smooth"}),type:"button",children:[i.jsx("img",{src:Hn,alt:"",className:"gzp-brand-mark"}),i.jsxs("span",{className:"gzp-brand-name",children:["GenZ Pizza Land",i.jsx("span",{className:"gzp-brand-sub",children:"Delivered hot across Gojra"})]})]}),!s&&i.jsxs(i.Fragment,{children:[i.jsxs("nav",{className:"v2-links","aria-label":"Site",children:[i.jsx("button",{type:"button",className:"v2-link",onClick:()=>w==null?void 0:w("menu"),children:"Menu"}),i.jsx("button",{type:"button",className:"v2-link",onClick:()=>w==null?void 0:w("deals"),children:"Deals"}),i.jsx("button",{type:"button",className:"v2-link",onClick:()=>w==null?void 0:w("reviews"),children:"Reviews"}),i.jsx("button",{type:"button",className:"v2-link",onClick:()=>w==null?void 0:w("contact"),children:"Contact"})]}),i.jsxs("button",{className:"v2-track-btn",onClick:T,type:"button",children:[i.jsx(Hc,{})," Track order"]}),i.jsx("button",{className:"gzp-icon-btn",onClick:c,"aria-label":"Search the menu",type:"button",children:i.jsx(Wc,{})}),i.jsxs("button",{className:"gzp-icon-btn gzp-cart-btn",onClick:k,"aria-label":`Your order, ${m} item${m===1?"":"s"}`,type:"button",children:[i.jsx(yf,{}),m>0&&i.jsx("span",{className:"gzp-cart-count",children:m})]})]})]})});function Ef(){var Qo,gt,Vo,Yo,Ko,Kr;const[s,m]=j.useState([]),[c,k]=j.useState([]),[w,T]=j.useState([]),[re,G]=j.useState([]),[B,ye]=j.useState(mf),[F,U]=j.useState(()=>Aa(null)),[V,ge]=j.useState(!1),[ve,q]=j.useState({}),[O,Z]=j.useState(!1),[xe,Te]=j.useState(!1),[de,ce]=j.useState(!0),[he,ze]=j.useState(""),[Ne,J]=j.useState(!1),[Ue,Me]=j.useState(!1),[R,ee]=j.useState(()=>localStorage.getItem("gzp_last_order")||null),[S,D]=j.useState(null),[ae,ue]=j.useState(!1),[P,W]=j.useState(!1),I=S&&!["Completed","Closed","Cancelled"].includes(S.orderStatus),[g,z]=j.useState({name:"",phone:"",address:""}),[le,fe]=j.useState(Gi);j.useEffect(()=>{let u=null;const v=()=>{document.body.classList.add("is-scrolling"),u&&clearTimeout(u),u=setTimeout(()=>document.body.classList.remove("is-scrolling"),150)};return window.addEventListener("scroll",v,{passive:!0,capture:!0}),()=>{window.removeEventListener("scroll",v,{capture:!0}),u&&clearTimeout(u),document.body.classList.remove("is-scrolling")}},[]);const[ke,we]=j.useState(!1),[Ee,Le]=j.useState(""),[M,$e]=j.useState(null),[Ot,Ur]=j.useState(""),[Et,sr]=j.useState(""),[xr,Wr]=j.useState({});j.useEffect(()=>{if((M==null?void 0:M.type)==="dish"){const v=Wa(M.item)[0]||"";Ur(v),sr(Zi(M.item,v)[0]||""),Wr({})}else if((M==null?void 0:M.type)==="deal"){Ur(""),sr("");const u={};(M.item.items||[]).forEach((v,b)=>{var te;if(!v.customizable)return;const _=(v.flavourOptions||[])[0];if(!_)return;const $=(te=_.variants)==null?void 0:te[0];u[b]={dishId:_._id,size:($==null?void 0:$.size)||"",crust:($==null?void 0:$.crust)||""}}),Wr(u)}else Ur(""),sr(""),Wr({})},[M]);const[un,Vn]=j.useState(""),[yr,pt]=j.useState(!1),[wr,Yn]=j.useState(null),[Kn,cn]=j.useState(""),[Gn,Xn]=j.useState(!1),[dn,br]=j.useState(""),pn=j.useRef(null),[zr,_t]=j.useState(!1),$o=j.useRef(null),fn=j.useRef(null);j.useEffect(()=>{(async()=>{var u,v;try{const[b,_,$,te,ie]=await Promise.all([Fp(),wc(),bc().catch(()=>({data:[]})),Op().catch(()=>({data:[]})),kc().catch(()=>null)]);m(b.data||[]),k(_.data||[]),T($.data||[]),G(te.data||[]);const je=(u=ie==null?void 0:ie.data)==null?void 0:u.taxRatePercent;typeof je=="number"&&ye(je),(v=ie==null?void 0:ie.data)!=null&&v.buildYourOwnDeal&&U(Aa(ie.data.buildYourOwnDeal))}catch(b){ze(b.message)}finally{ce(!1)}})()},[]),j.useEffect(()=>{if(!R)return;let u=!1;const v=async()=>{try{const _=await zc(R);u||D(_.data)}catch(_){if(u)return;_.status===404&&(localStorage.removeItem("gzp_last_order"),ee(null),D(null))}};v();const b=setInterval(v,8e3);return()=>{u=!0,clearInterval(b)}},[R]),j.useEffect(()=>()=>clearTimeout(fn.current),[]);const Hr=j.useMemo(()=>{const u=new Map;c.forEach($=>{var ie;const te=((ie=$.category)==null?void 0:ie._id)||$.category||"other";u.has(te)||u.set(te,[]),u.get(te).push($)});const v=s.filter($=>(u.get($._id)||[]).length>0).map($=>({id:$._id,name:$.name,icon:$.icon,description:$.description,items:u.get($._id)})),b=new Set(s.map($=>$._id)),_=c.filter($=>{var te;return!b.has(((te=$.category)==null?void 0:te._id)||$.category)});return _.length>0&&v.push({id:"other",name:"More to eat",icon:"🍽️",items:_}),v},[s,c]),qt=j.useMemo(()=>{const u=Hr.map(v=>({id:v.id,name:v.name}));return w.length>0&&u.unshift({id:Gi,name:"Deals"}),u},[Hr,w]),qn=j.useMemo(()=>{const u={};return s.forEach(v=>{u[v._id]=v.name}),u},[s]),gn=j.useMemo(()=>{const u=Ee.trim().toLowerCase();if(!u)return[];const v=[];return w.forEach(b=>{b.name.toLowerCase().includes(u)&&v.push({type:"deal",item:b})}),c.forEach(b=>{b.name.toLowerCase().includes(u)&&v.push({type:"dish",item:b})}),v.slice(0,20)},[Ee,c,w]),Dt=(u,v,b="",_="")=>`${u}:${v}:${b||""}||${_||""}`,mn=u=>{try{return`sel:${btoa(encodeURIComponent(JSON.stringify(u)))}`}catch{return"sel:"}},Zn=u=>{if(!u||!u.startsWith("sel:"))return null;try{return JSON.parse(decodeURIComponent(atob(u.slice(4))))}catch{return null}},$t=u=>((u==null?void 0:u.items)||[]).some(v=>v.customizable),ft=j.useMemo(()=>Object.entries(ve).filter(([,u])=>u>0).map(([u,v])=>{const[b,_,$="||"]=u.split(":"),te=b==="deal"?w.find(Ve=>Ve._id===_):c.find(Ve=>Ve._id===_);if(!te)return null;const[ie,je]=$.split("||");let _e=te.price,qe=te.originalPrice,Fe="",pe=null;if((b==="dish"||b==="byo")&&ie){const Ve=Ha(te,ie,je);Ve&&(_e=Ve.price,qe=Ve.originalPrice,Fe=[Ve.size,Ve.crust].filter(Boolean).join(", "))}if(b==="deal"){const Ve=Zn(ie);Ve&&(pe=Ve,Fe=Object.values(Ve).map(tr=>{const X=c.find(Se=>Se._id===tr.dishId);return X?[tr.size,X.name].filter(Boolean).join(" "):null}).filter(Boolean).join(", "))}return{type:b,item:te,qty:v,key:u,size:ie,crust:je,unitPrice:_e,unitOriginalPrice:qe,variantLabel:Fe,dealSelections:pe}}).filter(Boolean),[ve,c,w]),Jn=ft.reduce((u,v)=>u+v.unitPrice*v.qty,0),Qr=ft.filter(u=>u.type==="byo"),At=Qr.reduce((u,v)=>u+v.qty,0),Ao=Qr.reduce((u,v)=>u+v.unitPrice*v.qty,0),hn=At>0?tl(At,F):0,ur=Math.round(Ao*hn/100),kr=At>0&&F.enabled?Math.max(0,F.minItems-At):0,Zt=At>0&&(kr>0||!F.enabled),vn=Jn-ur,jr=vn*B/100,eo=vn+jr,Jt=ft.reduce((u,v)=>u+v.qty,0),Bt=j.useCallback((u,v=2e3)=>{Vn(u),clearTimeout(fn.current),fn.current=setTimeout(()=>Vn(""),v)},[]),Qe=j.useRef(ve);Qe.current=ve;const Vr=j.useRef({dishes:c,deals:w});Vr.current={dishes:c,deals:w};const rl=(u,v,b)=>{const _=v==="deal"?["deal"]:["dish","byo"];return Object.entries(u).reduce(($,[te,ie])=>_.some(je=>te.startsWith(`${je}:${b}:`))?$+ie:$,0)},nl=(u,v)=>(u==="deal"?Vr.current.deals:Vr.current.dishes).find(b=>b._id===v),er=j.useCallback((u,v,b,_="",$="",te=null)=>{const ie=nl(u,v),je=b||(ie==null?void 0:ie.name)||"This item",_e=typeof(ie==null?void 0:ie.availableQty)=="number"?ie.availableQty:1/0;if(rl(Qe.current,u,v)+1>_e){Bt(_e<=0?`Sorry, ${je} is out of stock right now.`:`Only ${_e} ${je} in stock. Please select ${_e}.`,3500);return}const Fe=te?Dt(u,v,mn(te)):Dt(u,v,_,$);Qe.current={...Qe.current,[Fe]:(Qe.current[Fe]||0)+1},q(Qe.current),b&&Bt(`${b} added`)},[Bt]),Pt=j.useCallback((u,v,b="",_="")=>{const $=Dt(u,v,b,_);Qe.current={...Qe.current,[$]:Math.max(0,(Qe.current[$]||0)-1)},q(Qe.current)},[]),xn=j.useCallback(async()=>{var u,v;try{const[b,_,$]=await Promise.all([wc(),bc().catch(()=>null),kc().catch(()=>null)]);k(b.data||[]),_&&T(_.data||[]),(u=$==null?void 0:$.data)!=null&&u.buildYourOwnDeal&&U(Aa($.data.buildYourOwnDeal)),typeof((v=$==null?void 0:$.data)==null?void 0:v.taxRatePercent)=="number"&&ye($.data.taxRatePercent)}catch{}},[]);j.useEffect(()=>{if(de)return;const u=()=>{document.hidden||xn()},v=setInterval(u,xf);return document.addEventListener("visibilitychange",u),window.addEventListener("focus",u),()=>{clearInterval(v),document.removeEventListener("visibilitychange",u),window.removeEventListener("focus",u)}},[de,xn]),j.useEffect(()=>{const u=Qe.current,v={};Object.entries(u).forEach(([$,te])=>{if(te<=0)return;const[ie,je]=$.split(":"),_e=ie==="byo"?"dish":ie;(v[`${_e}:${je}`]=v[`${_e}:${je}`]||[]).push($)});let b=u;const _=[];Object.entries(v).forEach(([$,te])=>{const[ie,je]=$.split(":"),_e=(ie==="deal"?w:c).find(Fe=>Fe._id===je);if(!_e||typeof _e.availableQty!="number")return;let qe=te.reduce((Fe,pe)=>Fe+b[pe],0);if(!(qe<=_e.availableQty)){b={...b};for(const Fe of[...te].reverse()){if(qe<=_e.availableQty)break;const pe=Math.min(b[Fe],qe-_e.availableQty);b[Fe]-=pe,qe-=pe}_.push(_e.availableQty<=0?`${_e.name} just sold out and was removed from your order.`:`Only ${_e.availableQty} ${_e.name} in stock - your order was set to ${_e.availableQty}.`)}}),_.length>0&&(Qe.current=b,q(b),Bt(_.join(" "),5e3))},[c,w,Bt]);const Yr=u=>{const v=document.getElementById(`section-${u}`);v&&(fe(u),v.scrollIntoView({behavior:"smooth",block:"start"}))},to=u=>{var b,_;if(u==="menu"){const $=w.length>0?Gi:(b=qt[0])==null?void 0:b.id;if($)return Yr($)}if(u==="deals"&&w.length===0)return Yr((_=qt[0])==null?void 0:_.id);const v=document.getElementById(`section-${u}`);v&&v.scrollIntoView({behavior:"smooth",block:"start"})};j.useEffect(()=>{if(de||R)return;let u=0;const v=()=>{u||(u=requestAnimationFrame(()=>{var $;u=0;const b=160;let _=($=qt[0])==null?void 0:$.id;qt.forEach(te=>{const ie=document.getElementById(`section-${te.id}`);ie&&ie.getBoundingClientRect().top<=b&&(_=te.id)}),_&&fe(_)}))};return v(),window.addEventListener("scroll",v,{passive:!0}),()=>{window.removeEventListener("scroll",v),cancelAnimationFrame(u)}},[qt,de,R]),j.useEffect(()=>{var v;const u=(v=$o.current)==null?void 0:v.querySelector(".is-active");u==null||u.scrollIntoView({block:"nearest",inline:"center",behavior:"smooth"})},[le]);const ro=u=>{const v=pn.current;v&&v.scrollBy({left:u*(v.clientWidth*.8),behavior:"smooth"})};j.useEffect(()=>{const u=pn.current;if(de||w.length<2||zr||!u||window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;const v=window.setInterval(()=>{const b=u.querySelector(".gzp-deal"),_=u.scrollWidth-u.clientWidth;if(!b||_<=0)return;const $=Number.parseFloat(window.getComputedStyle(u).columnGap)||0,te=b.getBoundingClientRect().width+$;u.scrollLeft>=_-2?u.scrollTo({left:0,behavior:"smooth"}):u.scrollBy({left:Math.min(te,_-u.scrollLeft),behavior:"smooth"})},4e3);return()=>window.clearInterval(v)},[w.length,zr,de]);const no=O||xe||yr||ke||!!M;j.useEffect(()=>(document.body.style.overflow=no?"hidden":"",()=>{document.body.style.overflow=""}),[no]),j.useEffect(()=>{const u=v=>{v.key==="Escape"&&(ke?we(!1):M?$e(null):xe?Te(!1):yr?pt(!1):O&&Z(!1))};return window.addEventListener("keydown",u),()=>window.removeEventListener("keydown",u)},[ke,M,xe,yr,O]);const Bo=j.useMemo(()=>{if(re.length>0)return re.map(b=>({url:ar(b.image),link:b.link||"",alt:b.altText||""}));const u=new Set,v=[];return[...w,...c].forEach(b=>{const _=ar(b.image);_&&!u.has(_)&&(u.add(_),v.push({url:_,link:"",alt:""}))}),v.slice(0,8)},[re,w,c]),Uo=async u=>{if(u.preventDefault(),ft.length!==0){if(Zt){ze(F.enabled?`Build Your Own Deal needs at least ${F.minItems} items - add ${kr} more or remove the deal.`:"Build Your Own Deal isn't available right now - please remove it from your order.");return}if(!Pc(g.phone)){ze("That mobile number doesn't look complete. Use digits only, e.g. 03001234567.");return}J(!0),ze("");try{const v=await Dp({customerName:g.name,customerPhone:g.phone,address:g.address,items:ft.map(_=>_.type==="deal"?{dealId:_.item._id,quantity:_.qty,dealSelections:_.dealSelections||void 0}:{dishId:_.item._id,quantity:_.qty,size:_.size||void 0,crust:_.crust||void 0,byo:_.type==="byo"?!0:void 0})}),b=v.data._id;localStorage.setItem("gzp_last_order",b),ee(b),D(v.data),ue(!0),W(!1),q({}),Te(!1),Z(!1),window.scrollTo({top:0})}catch(v){(v.status===409||/Build Your Own/i.test(v.message||""))&&xn(),ze(v.message)}finally{J(!1)}}},ol=async()=>{if(!(!R||Ue)){Me(!0);try{const u=await zc(R);D(u.data)}catch(u){u.status===404&&(localStorage.removeItem("gzp_last_order"),ee(null),D(null))}finally{Me(!1)}}},[oo,Ae]=j.useState(!1),il=async()=>{if(!(!R||oo)&&window.confirm("Cancel this order? You won't be charged anything.")){Ae(!0);try{const u=await $p(R);D(v=>v&&{...v,orderStatus:u.data.orderStatus})}catch(u){window.alert(u.message||"Couldn't cancel the order — please call the shop.")}finally{Ae(!1)}}},io=()=>{localStorage.removeItem("gzp_last_order"),ee(null),D(null)},Wo=async u=>{u.preventDefault();const v=Kn.trim();if(v){if(!Pc(v)){br("Enter the full mobile number you used at checkout, digits only.");return}Xn(!0),br("");try{const b=await Ap(v);localStorage.setItem("gzp_last_order",b.data._id),ee(b.data._id),D(b.data),pt(!1),cn("")}catch(b){br(b.status===404?"No recent order on that number. Check the digits and try again.":b.message||"Couldn't reach the kitchen. Try again in a moment.")}finally{Xn(!1)}}},yn=()=>{const u={};return Object.entries(ve).forEach(([v,b])=>{v.startsWith("byo:")&&b>0&&(u[v.slice(4)]=b)}),u},ll=u=>{const v={};Object.entries(Qe.current).forEach(([b,_])=>{b.startsWith("byo:")||(v[b]=_)}),Object.entries(u).forEach(([b,_])=>{_>0&&(v[`byo:${b}`]=_)}),Qe.current=v,q(v),ge(!1),Z(!0),Bt("Your custom deal is in your order")},Ho=()=>{const u={};Object.entries(Qe.current).forEach(([v,b])=>{v.startsWith("byo:")||(u[v]=b)}),Qe.current=u,q(u)},wn=u=>Object.entries(Qe.current).reduce((v,[b,_])=>b.startsWith(`dish:${u}:`)?v+_:v,0),zt=u=>i.jsxs("div",{className:"gzp-line",children:[ar(u.item.image)?i.jsx("img",{src:ar(u.item.image),alt:"",onError:v=>{v.currentTarget.style.display="none"}}):i.jsx("span",{className:"gzp-line-icon",children:u.item.icon||"🍽️"}),i.jsxs("div",{className:"gzp-line-main",children:[i.jsxs("h4",{children:[u.type==="deal"&&i.jsx("span",{className:"gzp-tag",children:"DEAL"}),u.item.name]}),u.variantLabel&&i.jsx("p",{className:"gzp-line-variant",children:u.variantLabel}),i.jsx("span",{children:bt(u.unitPrice*u.qty)})]}),i.jsx(el,{qty:u.qty,label:u.item.name,onAdd:()=>er(u.type,u.item._id,"",u.size,u.crust),onRemove:()=>Pt(u.type,u.item._id,u.size,u.crust)})]},u.key);if(R&&!S)return i.jsxs("div",{className:"gzp-app",children:[i.jsx(Ua,{minimal:!0}),i.jsxs("div",{className:"gzp-boot",children:[i.jsx("img",{src:Hn,alt:""}),"Pulling up your order…"]})]});if(R&&S&&ae)return i.jsx(jf,{order:S,onTrack:()=>ue(!1),onContinue:()=>{ue(!1),W(!0)}});if(R&&S&&!P){const u=Ec.indexOf(S.orderStatus),v=S.orderStatus==="Cancelled";return i.jsxs("div",{className:"gzp-app",children:[i.jsx(Ua,{minimal:!0}),i.jsx("div",{className:"gzp-shell",children:i.jsxs("section",{className:"gzp-track",children:[i.jsxs("div",{className:"gzp-track-hero",children:[i.jsxs("div",{className:"gzp-track-top",children:[i.jsxs("div",{style:{flex:1},children:[i.jsx("h1",{children:hf[S.orderStatus]||"Order status"}),i.jsxs("p",{className:"gzp-track-id",children:["Order #",String(S._id||"").slice(-6).toUpperCase()," for"," ",((Qo=S.customerDetails)==null?void 0:Qo.name)||"you"]})]}),i.jsx("button",{type:"button",className:"gzp-btn gzp-btn-ghost",onClick:ol,disabled:Ue,children:Ue?"Checking…":"Refresh"})]}),v?i.jsx("p",{className:"gzp-cancelled",children:"This order was cancelled. Nothing has been charged — you can order again any time."}):i.jsxs(i.Fragment,{children:[i.jsx("p",{className:"gzp-eta",children:"This page updates itself every few seconds. Keep it open and watch it move."}),i.jsx("ol",{className:"gzp-steps",children:Ec.map((b,_)=>i.jsx("li",{className:_<u?"is-done":_===u?"is-current":"",children:_c[b]},b))}),S.orderStatus==="Pending"&&i.jsx("button",{type:"button",className:"gzp-btn gzp-btn-ghost",style:{marginTop:14,color:"#E6392F",borderColor:"#E6392F"},onClick:il,disabled:oo,children:oo?"Cancelling…":"Cancel this order"})]})]}),i.jsxs("div",{className:"gzp-panel",children:[i.jsx("h3",{children:"What's coming"}),(S.items||[]).map((b,_)=>{var $;return i.jsxs("div",{children:[i.jsxs("div",{className:"gzp-order-line",children:[i.jsxs("span",{children:[b.isDeal&&i.jsx("span",{className:"gzp-tag",children:"DEAL"}),b.quantity,"× ",b.name]}),i.jsx("span",{children:bt(b.price*b.quantity)})]}),b.isDeal&&(($=b.dealItems)==null?void 0:$.length)>0&&i.jsx("p",{className:"gzp-order-sub",children:b.dealItems.map(te=>`${te.quantity>1?te.quantity+"× ":""}${te.label}`).join(", ")})]},_)}),i.jsxs("div",{className:"gzp-totals",style:{marginTop:14},children:[Number((gt=S.bills)==null?void 0:gt.discount)>0&&i.jsxs("div",{className:"is-discount",children:[i.jsx("span",{children:S.bills.discountLabel||"Build Your Own Deal discount"}),i.jsxs("span",{children:["−",bt(S.bills.discount)]})]}),i.jsxs("div",{className:"gzp-grand",children:[i.jsx("span",{children:"Pay on delivery"}),i.jsx("span",{children:bt(((Vo=S.bills)==null?void 0:Vo.totalWithTax)||0)})]})]})]}),((Yo=S.customerDetails)==null?void 0:Yo.address)&&i.jsxs("div",{className:"gzp-panel",children:[i.jsx("h3",{children:"Delivering to"}),i.jsx("p",{style:{margin:0,color:"var(--flour-dim)",fontSize:"0.93rem"},children:S.customerDetails.address})]}),i.jsx("button",{className:"gzp-btn gzp-btn-ghost gzp-btn-block",style:{marginTop:16},onClick:io,type:"button",children:"Start another order"})]})})]})}return i.jsxs("div",{className:"gzp-app",children:[i.jsx(Ua,{cartCount:Jt,onSearch:()=>we(!0),onCart:()=>Z(!0),onNavigate:to,onTrack:()=>pt(!0)}),P&&I&&i.jsxs("div",{className:"gzp-tracking-banner",children:[i.jsxs("span",{children:["Order #",String(S._id||"").slice(-6).toUpperCase()," — ",_c[S.orderStatus]||S.orderStatus]}),i.jsx("button",{type:"button",onClick:()=>W(!1),children:"Track it"})]}),he&&!xe&&i.jsx("div",{className:"gzp-shell",children:i.jsx("p",{className:"gzp-error gzp-error-banner",children:he})}),i.jsx(qp,{summary:wr,onOrder:()=>to("menu"),onTrack:()=>pt(!0)}),i.jsx("section",{className:"gzp-hero",children:i.jsx(zf,{slides:Bo,onSlideClick:u=>{var v;u!=null&&u.link?window.open(u.link,"_blank","noopener,noreferrer"):Yr((v=qt[0])==null?void 0:v.id)}})}),!de&&qt.length>0&&i.jsx("nav",{className:"gzp-navbar","aria-label":"Menu sections",children:i.jsx("div",{className:"gzp-navbar-inner",children:i.jsx("div",{className:"gzp-navbar-chips",ref:$o,children:qt.map(u=>i.jsx("button",{type:"button",className:`gzp-chip${le===u.id?" is-active":""}`,onClick:()=>Yr(u.id),children:u.name},u.id))})})}),i.jsxs("div",{className:"gzp-shell",children:[de?i.jsxs("section",{className:"gzp-section",children:[i.jsxs("div",{className:"gzp-section-head",children:[i.jsx("h2",{children:"Loading the menu"}),i.jsx("div",{className:"gzp-section-rule"})]}),i.jsx("div",{className:"gzp-grid",children:Array.from({length:8}).map((u,v)=>i.jsx(Nf,{},v))})]}):i.jsxs(i.Fragment,{children:[F.enabled&&c.length>0&&i.jsx(sf,{cfg:F,pickedCount:At,onStart:()=>ge(!0)}),w.length>0&&i.jsxs("section",{className:"gzp-section",id:`section-${Gi}`,children:[i.jsxs("div",{className:"gzp-section-head",children:[i.jsx("h2",{children:"Today's deals"}),i.jsxs("span",{className:"gzp-section-count",children:[w.length," bundle",w.length===1?"":"s"]}),i.jsx("div",{className:"gzp-section-rule"}),i.jsxs("div",{className:"gzp-rail-nav",children:[i.jsx("button",{className:"gzp-rail-btn",onClick:()=>ro(-1),"aria-label":"Scroll deals back",type:"button",children:i.jsx(Ba,{dir:"left"})}),i.jsx("button",{className:"gzp-rail-btn",onClick:()=>ro(1),"aria-label":"Scroll deals forward",type:"button",children:i.jsx(Ba,{})})]})]}),i.jsx("div",{className:"gzp-rail-wrap",children:i.jsx("div",{className:"gzp-rail",ref:pn,onMouseEnter:()=>_t(!0),onMouseLeave:()=>_t(!1),onFocus:()=>_t(!0),onBlur:u=>{u.currentTarget.contains(u.relatedTarget)||_t(!1)},onPointerDown:u=>{u.pointerType!=="mouse"&&_t(!0)},onPointerUp:u=>{u.pointerType!=="mouse"&&_t(!1)},children:w.map(u=>{var _,$,te;const v=Dt("deal",u._id),b=u.originalPrice>u.price?Math.round((u.originalPrice-u.price)/u.originalPrice*100):0;return i.jsxs("div",{className:"gzp-deal",role:"button",tabIndex:0,onClick:()=>$e({type:"deal",item:u}),onKeyDown:ie=>ie.key==="Enter"&&$e({type:"deal",item:u}),children:[i.jsxs("div",{className:"gzp-deal-media",children:[i.jsx(Qa,{src:ar(u.image),alt:u.name,icon:u.icon||"🔥"}),u.badge&&i.jsx("span",{className:"gzp-badge",children:u.badge}),b>0&&i.jsxs("span",{className:"gzp-save",children:["Save ",b,"%"]}),sn(u.availableQty)&&i.jsx("span",{className:`gzp-stock${sn(u.availableQty).out?" is-out":""}`,children:sn(u.availableQty).text})]}),i.jsxs("div",{className:"gzp-deal-body",children:[i.jsx("h3",{children:u.name}),((_=u.items)==null?void 0:_.length)>0?i.jsxs("ul",{className:"gzp-deal-contents",children:[u.items.slice(0,3).map((ie,je)=>i.jsxs("li",{children:[ie.quantity>1?`${ie.quantity}× `:"",ie.label]},je)),u.items.length>3&&i.jsxs("li",{className:"gzp-deal-more",children:["+",u.items.length-3," more in the box"]})]}):u.description&&i.jsx("p",{className:"gzp-deal-desc",children:u.description}),i.jsxs("div",{className:"gzp-deal-foot",onClick:ie=>ie.stopPropagation(),role:"presentation",children:[i.jsx(Ji,{price:u.price,originalPrice:u.originalPrice}),ve[v]&&!$t(u)?i.jsx(el,{qty:ve[v],label:u.name,onAdd:()=>er("deal",u._id),onRemove:()=>Pt("deal",u._id)}):i.jsx("button",{type:"button",className:"gzp-add gzp-add-wide",disabled:($=sn(u.availableQty))==null?void 0:$.out,onClick:()=>$t(u)?$e({type:"deal",item:u}):er("deal",u._id,u.name),children:(te=sn(u.availableQty))!=null&&te.out?"Sold out":$t(u)?"Choose & add":"Add deal"})]})]})]},u._id)})})})]}),Hr.map(u=>i.jsxs("section",{className:"gzp-section",id:`section-${u.id}`,children:[i.jsxs("div",{className:"gzp-section-head",children:[i.jsx("h2",{children:u.name}),i.jsxs("span",{className:"gzp-section-count",children:[u.items.length," items"]}),i.jsx("div",{className:"gzp-section-rule"})]}),i.jsx("div",{className:"gzp-grid",children:u.items.map(v=>i.jsx(Sf,{dish:v,cart:ve,cartKey:Dt,addToCart:er,removeFromCart:Pt,onOpenQuickView:b=>$e({type:"dish",item:b})},v._id))})]},u.id)),Hr.length===0&&w.length===0&&i.jsx("section",{className:"gzp-section",children:i.jsxs("div",{className:"gzp-empty",children:[i.jsx("img",{src:Hn,alt:"",className:"gzp-empty-logo"}),"The menu is being set up right now. Check back in a little while."]})})]}),i.jsx(Jp,{}),i.jsx(nf,{onSummary:Yn}),i.jsx(ef,{}),i.jsx(of,{whatsappLink:Bc,onTrack:()=>pt(!0)})]}),i.jsx(lf,{taxRatePercent:B,onNavigate:to,onTrack:()=>pt(!0)}),Jt>0&&!O&&!xe&&i.jsxs("button",{className:"gzp-cartbar",onClick:()=>Z(!0),type:"button",children:[i.jsxs("span",{className:"gzp-cartbar-label",children:[i.jsxs("small",{children:[Jt," item",Jt===1?"":"s"," in your order"]}),i.jsx("b",{children:bt(eo)})]}),i.jsx("span",{className:"gzp-cartbar-cta",children:"View order"})]}),i.jsx(Cf,{}),un&&i.jsxs("div",{className:"gzp-toast",role:"status",children:[i.jsx("i",{children:"✓"}),un]}),ke&&i.jsxs("div",{className:"gzp-search",onClick:()=>we(!1),children:[i.jsxs("div",{className:"gzp-search-bar",onClick:u=>u.stopPropagation(),children:[i.jsx(Wc,{}),i.jsx("input",{autoFocus:!0,value:Ee,onChange:u=>Le(u.target.value),placeholder:"Search for a pizza, burger or deal","aria-label":"Search the menu"}),i.jsx("button",{className:"gzp-btn gzp-btn-ghost",onClick:()=>we(!1),type:"button",children:"Close"})]}),i.jsxs("div",{className:"gzp-search-results",onClick:u=>u.stopPropagation(),children:[Ee.trim()&&gn.length===0&&i.jsxs("p",{className:"gzp-search-empty",children:["Nothing matches “",Ee.trim(),"”. Try a shorter word, like “pizza”."]}),gn.map(({type:u,item:v})=>{var b;return i.jsxs("button",{className:"gzp-result",type:"button",onClick:()=>{we(!1),$e({type:u,item:v})},children:[ar(v.image)?i.jsx("img",{src:ar(v.image),alt:"",onError:_=>{_.currentTarget.style.display="none"}}):i.jsx("span",{className:"gzp-result-icon",children:v.icon||"🍽️"}),i.jsxs("span",{className:"gzp-result-name",children:[v.name,i.jsx("span",{className:"gzp-result-cat",children:u==="deal"?"Deal":qn[((b=v.category)==null?void 0:b._id)||v.category]||"Menu"})]}),i.jsx(Ji,{price:v.price})]},`${u}-${v._id}`)})]})]}),M&&i.jsx("div",{className:"gzp-overlay",onClick:()=>$e(null),children:i.jsxs("div",{className:"gzp-modal",onClick:u=>u.stopPropagation(),role:"dialog","aria-label":M.item.name,children:[i.jsxs("div",{className:"gzp-modal-media",children:[i.jsx(Qa,{src:ar(M.item.image),alt:M.item.name,icon:M.item.icon}),M.item.badge&&i.jsx("span",{className:"gzp-badge",children:M.item.badge}),i.jsx("button",{className:"gzp-modal-close",onClick:()=>$e(null),"aria-label":"Close",type:"button",children:"✕"})]}),i.jsxs("div",{className:"gzp-modal-body",children:[i.jsx("h2",{children:M.item.name}),M.type==="deal"&&((Ko=M.item.items)==null?void 0:Ko.length)>0&&i.jsx("ul",{className:"gzp-deal-contents",children:M.item.items.map((u,v)=>u.customizable?null:i.jsxs("li",{children:[u.quantity>1?`${u.quantity}× `:"",u.label]},v))}),M.type==="deal"&&((Kr=M.item.items)==null?void 0:Kr.map((u,v)=>{var pe,Ve,tr;if(!u.customizable)return null;const b=u.flavourOptions||[],_=xr[v]||{},$=[...new Map(b.map(X=>{var Se,me;return[((Se=X.category)==null?void 0:Se._id)||"",((me=X.category)==null?void 0:me.name)||"Choose"]}))],te=((Ve=(pe=b.find(X=>X._id===_.dishId))==null?void 0:pe.category)==null?void 0:Ve._id)||((tr=$[0])==null?void 0:tr[0])||"",ie=b.filter(X=>{var Se;return(((Se=X.category)==null?void 0:Se._id)||"")===te}),je=b.find(X=>X._id===_.dishId),_e=[...new Set(((je==null?void 0:je.variants)||[]).map(X=>X.size))],qe=((je==null?void 0:je.variants)||[]).filter(X=>X.size===_.size&&X.crust),Fe=X=>Wr(Se=>({...Se,[v]:{...Se[v],...X}}));return i.jsxs("div",{className:"gzp-deal-choice",children:[i.jsxs("p",{className:"gzp-deal-choice-label",children:[u.quantity>1?`${u.quantity}× `:"",u.label," — pick yours"]}),i.jsxs("div",{className:"gzp-variant-row",children:[$.length>1&&i.jsx("select",{className:"gzp-select",value:te,onChange:X=>{var Ge;const Se=b.find(et=>{var Ut;return(((Ut=et.category)==null?void 0:Ut._id)||"")===X.target.value}),me=(Ge=Se==null?void 0:Se.variants)==null?void 0:Ge[0];Fe({dishId:(Se==null?void 0:Se._id)||"",size:(me==null?void 0:me.size)||"",crust:(me==null?void 0:me.crust)||""})},"aria-label":`Category for ${u.label}`,children:$.map(([X,Se])=>i.jsx("option",{value:X,children:Se},X))}),i.jsxs("select",{className:"gzp-select",value:_.dishId||"",onChange:X=>{var Ge;const Se=b.find(et=>et._id===X.target.value),me=(Ge=Se==null?void 0:Se.variants)==null?void 0:Ge[0];Fe({dishId:(Se==null?void 0:Se._id)||"",size:(me==null?void 0:me.size)||"",crust:(me==null?void 0:me.crust)||""})},"aria-label":`Flavour for ${u.label}`,children:[ie.length===0&&i.jsx("option",{value:"",children:"No flavours available"}),ie.map(X=>i.jsx("option",{value:X._id,children:X.name},X._id))]}),_e.length>0&&i.jsx("select",{className:"gzp-select",value:_.size||"",onChange:X=>{var me;const Se=((je==null?void 0:je.variants)||[]).filter(Ge=>Ge.size===X.target.value&&Ge.crust);Fe({size:X.target.value,crust:Se.some(Ge=>Ge.crust===_.crust)?_.crust:((me=Se[0])==null?void 0:me.crust)||""})},"aria-label":`Size for ${u.label}`,children:_e.map(X=>i.jsx("option",{value:X,children:X},X))}),qe.length>0&&i.jsx("select",{className:"gzp-select",value:_.crust||"",onChange:X=>Fe({crust:X.target.value}),"aria-label":`Crust for ${u.label}`,children:qe.map(X=>i.jsx("option",{value:X.crust,children:X.crust},X.crust))})]})]},v)})),M.item.description&&i.jsx("p",{className:"gzp-deal-desc",children:M.item.description}),(()=>{const u=M.type==="dish",v=M.type==="deal",b=u?Wa(M.item):[],_=b.length>0,$=u?Zi(M.item,Ot):[],te=_?Ha(M.item,Ot,Et):null,ie=_?Uc(M.item):null,je=_?(te==null?void 0:te.price)??(ie==null?void 0:ie.price)??M.item.price:M.item.price,_e=_?(te==null?void 0:te.originalPrice)??0:M.item.originalPrice,qe=v&&$t(M.item),Fe=!qe||(M.item.items||[]).every((me,Ge)=>{var Wt;if(!me.customizable)return!0;const et=xr[Ge];if(!(et!=null&&et.dishId))return!1;const Ut=(me.flavourOptions||[]).find(rr=>rr._id===et.dishId);return((Wt=Ut==null?void 0:Ut.variants)==null?void 0:Wt.length)>0?!!et.size:!0}),pe=qe?Dt(M.type,M.item._id,mn(xr)):Dt(M.type,M.item._id,Ot,Et),Ve=ve[pe]||0,tr=(u?c:w).find(me=>me._id===M.item._id)||M.item,X=sn(tr.availableQty),Se=(!_||!!te)&&Fe&&!(X!=null&&X.out);return i.jsxs(i.Fragment,{children:[i.jsx(Ji,{price:je,originalPrice:_e,from:_}),X&&i.jsx("p",{className:`gzp-stock-note${X.out?" is-out":""}`,children:X.text}),_&&i.jsxs("div",{className:"gzp-variant-row",children:[i.jsx("select",{className:"gzp-select",value:Ot,onChange:me=>{const Ge=me.target.value;Ur(Ge);const et=Zi(M.item,Ge);sr(et.includes(Et)?Et:et[0]||"")},"aria-label":`Size for ${M.item.name}`,children:b.map(me=>i.jsx("option",{value:me,children:me},me))}),$.length>0&&i.jsx("select",{className:"gzp-select",value:Et,onChange:me=>sr(me.target.value),"aria-label":`Crust for ${M.item.name}`,children:$.map(me=>i.jsx("option",{value:me,children:me},me))})]}),i.jsx("div",{className:"gzp-modal-foot",children:Ve?i.jsxs(i.Fragment,{children:[i.jsx(el,{size:"lg",label:M.item.name,qty:Ve,onAdd:()=>qe?er(M.type,M.item._id,"","","",xr):er(M.type,M.item._id,"",Ot,Et),onRemove:()=>{const[,,me]=pe.split(":"),[Ge,et]=me.split("||");Pt(M.type,M.item._id,Ge,et)}}),i.jsx("button",{className:"gzp-btn gzp-btn-primary",onClick:()=>{$e(null),Z(!0)},type:"button",children:"View order"})]}):i.jsxs("button",{className:"gzp-btn gzp-btn-primary gzp-btn-split",disabled:!Se,onClick:()=>{qe?er(M.type,M.item._id,M.item.name,"","",xr):er(M.type,M.item._id,M.item.name,Ot,Et),$e(null)},type:"button",children:[i.jsx("span",{children:X!=null&&X.out?"Sold out":qe&&!Fe?"Choose your options":"Add to order"}),i.jsx("span",{children:bt(je)})]})})]})})()]})]})}),V&&i.jsx(pf,{cfg:F,dishes:c,categories:s,initialPicks:yn(),getOtherQty:wn,onClose:()=>ge(!1),onConfirm:ll}),O&&i.jsx("div",{className:"gzp-sheet-overlay",onClick:()=>Z(!1),children:i.jsxs("div",{className:"gzp-sheet",onClick:u=>u.stopPropagation(),role:"dialog","aria-label":"Your order",children:[i.jsxs("div",{className:"gzp-sheet-head",children:[i.jsx("h2",{children:"Your order"}),i.jsx("button",{className:"gzp-icon-btn",onClick:()=>Z(!1),"aria-label":"Close",type:"button",children:"✕"})]}),ft.length===0?i.jsxs("div",{className:"gzp-sheet-body",children:[i.jsxs("div",{className:"gzp-empty",children:[i.jsx("span",{children:"🛒"}),"Nothing here yet. Add a deal or a pizza and it'll show up."]}),i.jsx("button",{className:"gzp-btn gzp-btn-primary",onClick:()=>Z(!1),type:"button",children:"Back to the menu"})]}):i.jsxs(i.Fragment,{children:[i.jsxs("div",{className:"gzp-sheet-body",children:[ft.filter(u=>u.type!=="byo").map(zt),Qr.length>0&&i.jsxs("div",{className:"gzp-byo-cart",children:[i.jsxs("div",{className:"gzp-byo-cart-head",children:[i.jsx("h4",{children:"🎯 Your custom deal"}),i.jsx("button",{type:"button",onClick:()=>{Z(!1),ge(!0)},children:"Edit"})]}),i.jsx("p",{className:`gzp-byo-cart-note${kr>0||!F.enabled?" is-warn":""}`,children:F.enabled?Dc(At,F):"This deal isn't available right now."}),Qr.map(zt),ur>0&&i.jsxs("p",{className:"gzp-byo-cart-saving",children:["You save ",i.jsx("b",{children:bt(ur)})," (",hn,"% off ",At," items)"]})]})]}),i.jsxs("div",{className:"gzp-sheet-foot",children:[i.jsxs("div",{className:"gzp-totals",children:[i.jsxs("div",{children:[i.jsx("span",{children:"Subtotal"}),i.jsx("span",{children:bt(Jn)})]}),ur>0&&i.jsxs("div",{className:"is-discount",children:[i.jsxs("span",{children:["Custom deal discount (",hn,"%)"]}),i.jsxs("span",{children:["−",bt(ur)]})]}),i.jsxs("div",{children:[i.jsxs("span",{children:["Tax (",B,"%)"]}),i.jsx("span",{children:bt(jr)})]}),i.jsxs("div",{className:"gzp-grand",children:[i.jsx("span",{children:"Total"}),i.jsx("span",{children:bt(eo)})]})]}),Zt&&i.jsx("p",{className:"gzp-byo-warn",children:F.enabled?`Your custom deal needs ${kr} more item${kr===1?"":"s"} to qualify. Add more or remove the deal to continue.`:"The custom deal isn't available right now. Remove it to continue."}),i.jsx("button",{className:"gzp-btn gzp-btn-primary gzp-btn-block",onClick:()=>{Z(!1),Te(!0)},disabled:Zt,type:"button",children:"Add delivery details"}),Zt&&i.jsx("button",{type:"button",className:"gzp-btn gzp-btn-ghost gzp-btn-block",style:{marginTop:8},onClick:()=>{F.enabled?(Z(!1),ge(!0)):Ho()},children:F.enabled?"Add more items to my deal":"Remove custom deal"})]})]})]})}),xe&&i.jsx("div",{className:"gzp-sheet-overlay",onClick:()=>Te(!1),children:i.jsxs("div",{className:"gzp-sheet",onClick:u=>u.stopPropagation(),role:"dialog","aria-label":"Delivery details",children:[i.jsxs("div",{className:"gzp-sheet-head",children:[i.jsx("button",{className:"gzp-icon-btn",onClick:()=>{Te(!1),Z(!0)},"aria-label":"Back to your order",type:"button",children:i.jsx(Ba,{dir:"left"})}),i.jsx("h2",{children:"Where should we send it?"})]}),i.jsxs("form",{onSubmit:Uo,style:{display:"contents"},children:[i.jsx("div",{className:"gzp-sheet-body",children:i.jsxs("div",{className:"gzp-form",children:[i.jsxs("label",{className:"gzp-field",children:[i.jsx("span",{children:"Your name"}),i.jsx("input",{required:!0,value:g.name,onChange:u=>z({...g,name:u.target.value}),placeholder:"Who's the rider asking for?"})]}),i.jsxs("label",{className:"gzp-field",children:[i.jsx("span",{children:"Mobile number"}),i.jsx("input",{required:!0,type:"tel",inputMode:"numeric",pattern:"[0-9+]*",maxLength:14,value:g.phone,onChange:u=>z({...g,phone:Xi(u.target.value)}),onPaste:u=>{u.preventDefault();const v=(u.clipboardData||window.clipboardData).getData("text");z(b=>({...b,phone:Xi(b.phone+v)}))},placeholder:"03001234567"})]}),i.jsxs("label",{className:"gzp-field",children:[i.jsx("span",{children:"Delivery address"}),i.jsx("textarea",{required:!0,rows:3,value:g.address,onChange:u=>z({...g,address:u.target.value}),placeholder:"House or flat number, street, area, nearest landmark"})]}),i.jsxs("p",{className:"gzp-note",children:[i.jsx(Hc,{}),i.jsxs("span",{children:[i.jsx("b",{children:"Cash on delivery."})," Pay the rider when the food arrives. We'll call this number if we can't find the address."]})]}),he&&i.jsx("p",{className:"gzp-error",children:he})]})}),i.jsxs("div",{className:"gzp-sheet-foot",children:[i.jsx("div",{className:"gzp-totals",children:i.jsxs("div",{className:"gzp-grand",children:[i.jsx("span",{children:"Total to pay"}),i.jsx("span",{children:bt(eo)})]})}),i.jsx("button",{type:"submit",className:"gzp-btn gzp-btn-primary gzp-btn-block",disabled:Ne,children:Ne?"Sending to the kitchen…":"Place order"})]})]})]})}),yr&&i.jsx("div",{className:"gzp-sheet-overlay",onClick:()=>pt(!1),children:i.jsxs("div",{className:"gzp-sheet",onClick:u=>u.stopPropagation(),role:"dialog","aria-label":"Track your order",children:[i.jsxs("div",{className:"gzp-sheet-head",children:[i.jsx("h2",{children:"Track your order"}),i.jsx("button",{className:"gzp-icon-btn",onClick:()=>pt(!1),"aria-label":"Close",type:"button",children:"✕"})]}),i.jsxs("form",{onSubmit:Wo,style:{display:"contents"},children:[i.jsx("div",{className:"gzp-sheet-body",children:i.jsxs("div",{className:"gzp-form",children:[i.jsxs("label",{className:"gzp-field",children:[i.jsx("span",{children:"Mobile number used at checkout"}),i.jsx("input",{required:!0,autoFocus:!0,type:"tel",inputMode:"numeric",pattern:"[0-9+]*",maxLength:14,value:Kn,onChange:u=>cn(Xi(u.target.value)),onPaste:u=>{u.preventDefault();const v=(u.clipboardData||window.clipboardData).getData("text");cn(b=>Xi(b+v))},placeholder:"03001234567"})]}),dn&&i.jsx("p",{className:"gzp-error",children:dn})]})}),i.jsx("div",{className:"gzp-sheet-foot",children:i.jsx("button",{type:"submit",className:"gzp-btn gzp-btn-primary gzp-btn-block",disabled:Gn,children:Gn?"Looking…":"Find my order"})})]})]})})]})}class _f extends Rc.Component{constructor(c){super(c);cc(this,"handleReload",()=>{try{localStorage.removeItem("gzp_last_order")}catch{}window.location.reload()});this.state={hasError:!1}}static getDerivedStateFromError(){return{hasError:!0}}componentDidCatch(c,k){console.error("GenZ Pizza Land crashed while rendering:",c,k)}render(){return this.state.hasError?i.jsxs("div",{style:{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:14,padding:24,textAlign:"center",fontFamily:"system-ui, sans-serif",background:"#FFF8EF",color:"#252525"},children:[i.jsx("h1",{style:{fontSize:"1.3rem",margin:0},children:"Something went wrong on our end"}),i.jsx("p",{style:{maxWidth:420,opacity:.8,margin:0},children:"Your order may still have gone through — if you already saw an order number, it's safe. Reloading usually fixes this."}),i.jsx("button",{type:"button",onClick:this.handleReload,style:{padding:"10px 22px",borderRadius:8,border:"none",background:"#E6392F",color:"#fff",fontWeight:600,cursor:"pointer"},children:"Reload"})]}):this.props.children}}const Pf=["🍕","🍔","🍟","🌭","🌮","🥤","🍗","🍩","🥪","🍦"],Lc=["🍔","🍕","🍟","🍗","🌭","🥪","🌯","🌮","🍩"],Tc=["✨","⭐"],Re=(s,m)=>s+Math.random()*(m-s);function Lf(s,m){const c=Math.ceil(m*1.6),k=document.createElement("canvas");k.width=c,k.height=c;const w=k.getContext("2d");return w.textAlign="center",w.textBaseline="middle",w.font=`${m}px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif`,w.fillText(s,c/2,c/2+m*.05),k}function Tf(){const s=j.useRef(null);return j.useEffect(()=>{var Ue;const m=s.current;if(!m)return;const c=m.getContext("2d"),k=(Ue=window.matchMedia)==null?void 0:Ue.call(window,"(prefers-reduced-motion: reduce)").matches;let w=0,T=0,re=1,G=[],B=[],ye=[],F=0,U=!1;const V={x:-9999,y:-9999,active:!1},ge=document.createElement("div");ge.setAttribute("aria-hidden","true"),Object.assign(ge.style,{position:"fixed",inset:"0",zIndex:"1001",overflow:"hidden",pointerEvents:"none"}),document.body.appendChild(ge);const ve=()=>window.innerWidth<700,q=()=>{re=Math.min(window.devicePixelRatio||1,ve()?1.5:2),w=window.innerWidth,T=window.innerHeight,m.width=Math.round(w*re),m.height=Math.round(T*re),m.style.width=`${w}px`,m.style.height=`${T}px`,c.setTransform(re,0,0,re,0,0);const Me=ve(),R=Math.min(Me?34:72,Math.round(w*T/(Me?15e3:17e3))),ee=Me?9:16;G=Array.from({length:R},()=>({x:Re(0,w),y:Re(0,T),vx:Re(-.22,.22),vy:Re(-.22,.22),r:Re(1.1,2.8),life:1,temp:!1})),ye=Pf.map(S=>Lf(S,28)),B=Array.from({length:ee},(S,D)=>({s:ye[D%ye.length],x:Re(0,w),y:Re(0,T),vx:Re(-.35,.35)||.2,vy:Re(-.3,-.08),rot:Re(0,Math.PI*2),vr:Re(-.008,.008),scale:Re(.55,1.05),alpha:Re(.3,.55),phase:Re(0,6.28)}))},O=(Me,R)=>{if(!k){const ae=Math.hypot(w,T)||1;B.forEach(ue=>{const P=ue.x-Me,W=ue.y-R,I=Math.hypot(P,W),g=I>1?Math.atan2(W,P):Re(0,Math.PI*2),z=3+(1-Math.min(I/ae,1))*3;ue.vx+=Math.cos(g)*z+Re(-1,1),ue.vy+=Math.sin(g)*z+Re(-1,1),ue.vr+=Re(-.08,.08)})}const ee=2+Math.floor(Math.random()*3),S=ee>2&&Math.random()<.35?2:1,D=Array.from({length:ee-S},()=>({emoji:Lc[Math.floor(Math.random()*Lc.length)],size:Re(22,34)}));for(let ae=0;ae<S;ae++)D.push({emoji:Tc[Math.floor(Math.random()*Tc.length)],size:Re(15,23)});D.forEach(({emoji:ae,size:ue},P)=>{const W=P/D.length*Math.PI*2+Re(-.35,.35),I=Re(55,115),g=Math.cos(W)*I,z=Math.sin(W)*I-Re(18,48),le=document.createElement("span");if(le.textContent=ae,Object.assign(le.style,{position:"absolute",left:`${Me}px`,top:`${R}px`,fontSize:`${ue}px`,lineHeight:"1",pointerEvents:"none",userSelect:"none",filter:"drop-shadow(0 2px 5px rgba(30,20,10,0.3))",transform:"translate(-50%, -50%) scale(0.3)"}),ge.appendChild(le),k){le.style.transform=`translate(calc(-50% + ${g*.35}px), calc(-50% + ${z*.35}px)) scale(1)`,window.setTimeout(()=>le.remove(),550);return}const fe=le.animate([{opacity:0,transform:"translate(-50%, -50%) scale(0.3) rotate(0deg)"},{opacity:1,transform:"translate(-50%, -50%) scale(1.25) rotate(10deg)",offset:.18},{opacity:1,transform:"translate(-50%, -50%) scale(1) rotate(-5deg)",offset:.34},{opacity:0,transform:`translate(calc(-50% + ${g}px), calc(-50% + ${z}px)) scale(0.7) rotate(${Re(-55,55)}deg)`}],{duration:Re(750,1050),easing:"cubic-bezier(0.2, 0.75, 0.3, 1)",fill:"forwards"});fe.onfinish=()=>le.remove()})},Z=Me=>{c.clearRect(0,0,w,T);const ee=ve()?150:200;if(V.active){const S=c.createRadialGradient(V.x,V.y,0,V.x,V.y,220);S.addColorStop(0,"rgba(255,240,200,0.35)"),S.addColorStop(1,"rgba(255,240,200,0)"),c.fillStyle=S,c.fillRect(V.x-220,V.y-220,440,440)}for(let S=G.length-1;S>=0;S--){const D=G[S];if(D.temp&&(D.life-=.004,D.life<=0)){G.splice(S,1);continue}if(V.active){const ue=V.x-D.x,P=V.y-D.y,W=Math.hypot(ue,P);W<ee&&W>1&&(D.vx+=ue/W*.012,D.vy+=P/W*.012)}D.vx*=.985,D.vy*=.985,Math.hypot(D.vx,D.vy)<.08&&(D.vx+=Re(-.01,.01),D.vy+=Re(-.01,.01)),D.x+=D.vx,D.y+=D.vy,D.x<-20?D.x=w+20:D.x>w+20&&(D.x=-20),D.y<-20?D.y=T+20:D.y>T+20&&(D.y=-20)}for(const S of G){const D=.35+.5*(S.r/2.8);c.fillStyle=`rgba(255,255,255,${Math.min(1,D+.25)*S.life})`,c.shadowColor="rgba(255,255,255,0.8)",c.shadowBlur=8,c.beginPath(),c.arc(S.x,S.y,S.r,0,Math.PI*2),c.fill()}c.shadowBlur=0;for(const S of B){S.vx*=.99,S.vy*=.99,Math.hypot(S.vx,S.vy)<.12&&(S.vx+=Re(-.01,.01),S.vy-=.004),S.vr*=.99,Math.abs(S.vr)<.004&&(S.vr+=S.vr>=0?4e-4:-4e-4),S.x+=S.vx,S.y+=S.vy+Math.sin(Me/1500+S.phase)*.12,S.rot+=S.vr;const D=40;S.x<-D?S.x=w+D:S.x>w+D&&(S.x=-D),S.y<-D?S.y=T+D:S.y>T+D&&(S.y=-D),c.save(),c.translate(S.x,S.y),c.rotate(S.rot),c.globalAlpha=S.alpha;const ae=S.s.width*S.scale;c.drawImage(S.s,-ae/2,-ae/2,ae,ae),c.restore()}c.globalAlpha=1,U&&(F=requestAnimationFrame(Z))},xe=()=>{U||k||(U=!0,F=requestAnimationFrame(Z))},Te=()=>{U=!1,cancelAnimationFrame(F)};q(),k?Z(0):xe();let de=0;const ce=()=>{clearTimeout(de),de=setTimeout(()=>{q(),k&&Z(0)},150)},he=Me=>{V.x=Me.clientX,V.y=Me.clientY,V.active=!0},ze=()=>{V.active=!1},Ne=Me=>{V.x=Me.clientX,V.y=Me.clientY,V.active=!0,O(Me.clientX,Me.clientY),Me.pointerType==="touch"&&setTimeout(ze,900)},J=()=>document.hidden?Te():xe();return window.addEventListener("resize",ce),window.addEventListener("pointermove",he,{passive:!0}),window.addEventListener("pointerdown",Ne,{passive:!0}),window.addEventListener("pointerleave",ze),document.addEventListener("mouseleave",ze),document.addEventListener("visibilitychange",J),()=>{Te(),clearTimeout(de),ge.remove(),window.removeEventListener("resize",ce),window.removeEventListener("pointermove",he),window.removeEventListener("pointerdown",Ne),window.removeEventListener("pointerleave",ze),document.removeEventListener("mouseleave",ze),document.removeEventListener("visibilitychange",J)}},[]),i.jsx("canvas",{ref:s,"aria-hidden":"true",style:{position:"fixed",inset:0,zIndex:0,pointerEvents:"none"}})}Rp.createRoot(document.getElementById("root")).render(i.jsxs(Rc.StrictMode,{children:[i.jsx(Tf,{}),i.jsx(_f,{children:i.jsx(Ef,{})})]}));
