var gp=Object.defineProperty;var mp=(u,y,c)=>y in u?gp(u,y,{enumerable:!0,configurable:!0,writable:!0,value:c}):u[y]=c;var dc=(u,y,c)=>mp(u,typeof y!="symbol"?y+"":y,c);(function(){const y=document.createElement("link").relList;if(y&&y.supports&&y.supports("modulepreload"))return;for(const E of document.querySelectorAll('link[rel="modulepreload"]'))I(E);new MutationObserver(E=>{for(const W of E)if(W.type==="childList")for(const de of W.addedNodes)de.tagName==="LINK"&&de.rel==="modulepreload"&&I(de)}).observe(document,{childList:!0,subtree:!0});function c(E){const W={};return E.integrity&&(W.integrity=E.integrity),E.referrerPolicy&&(W.referrerPolicy=E.referrerPolicy),E.crossOrigin==="use-credentials"?W.credentials="include":E.crossOrigin==="anonymous"?W.credentials="omit":W.credentials="same-origin",W}function I(E){if(E.ep)return;E.ep=!0;const W=c(E);fetch(E.href,W)}})();function _c(u){return u&&u.__esModule&&Object.prototype.hasOwnProperty.call(u,"default")?u.default:u}var Ra={exports:{}},Ll={},Ia={exports:{}},me={};/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var pc;function hp(){if(pc)return me;pc=1;var u=Symbol.for("react.element"),y=Symbol.for("react.portal"),c=Symbol.for("react.fragment"),I=Symbol.for("react.strict_mode"),E=Symbol.for("react.profiler"),W=Symbol.for("react.provider"),de=Symbol.for("react.context"),X=Symbol.for("react.forward_ref"),Q=Symbol.for("react.suspense"),ze=Symbol.for("react.memo"),B=Symbol.for("react.lazy"),V=Symbol.iterator;function ae(g){return g===null||typeof g!="object"?null:(g=V&&g[V]||g["@@iterator"],typeof g=="function"?g:null)}var re={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},we=Object.assign,ie={};function se(g,w,ue){this.props=g,this.context=w,this.refs=ie,this.updater=ue||re}se.prototype.isReactComponent={},se.prototype.setState=function(g,w){if(typeof g!="object"&&typeof g!="function"&&g!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,g,w,"setState")},se.prototype.forceUpdate=function(g){this.updater.enqueueForceUpdate(this,g,"forceUpdate")};function ce(){}ce.prototype=se.prototype;function _e(g,w,ue){this.props=g,this.context=w,this.refs=ie,this.updater=ue||re}var Pe=_e.prototype=new ce;Pe.constructor=_e,we(Pe,se.prototype),Pe.isPureReactComponent=!0;var pe=Array.isArray,Le=Object.prototype.hasOwnProperty,Se={current:null},ve={key:!0,ref:!0,__self:!0,__source:!0};function ke(g,w,ue){var fe,he={},ge=null,je=null;if(w!=null)for(fe in w.ref!==void 0&&(je=w.ref),w.key!==void 0&&(ge=""+w.key),w)Le.call(w,fe)&&!ve.hasOwnProperty(fe)&&(he[fe]=w[fe]);var Ee=arguments.length-2;if(Ee===1)he.children=ue;else if(1<Ee){for(var T=Array(Ee),De=0;De<Ee;De++)T[De]=arguments[De+2];he.children=T}if(g&&g.defaultProps)for(fe in Ee=g.defaultProps,Ee)he[fe]===void 0&&(he[fe]=Ee[fe]);return{$$typeof:u,type:g,key:ge,ref:je,props:he,_owner:Se.current}}function q(g,w){return{$$typeof:u,type:g.type,key:w,ref:g.ref,props:g.props,_owner:g._owner}}function $e(g){return typeof g=="object"&&g!==null&&g.$$typeof===u}function Ne(g){var w={"=":"=0",":":"=2"};return"$"+g.replace(/[=:]/g,function(ue){return w[ue]})}var P=/\/+/g;function G(g,w){return typeof g=="object"&&g!==null&&g.key!=null?Ne(""+g.key):w.toString(36)}function O(g,w,ue,fe,he){var ge=typeof g;(ge==="undefined"||ge==="boolean")&&(g=null);var je=!1;if(g===null)je=!0;else switch(ge){case"string":case"number":je=!0;break;case"object":switch(g.$$typeof){case u:case y:je=!0}}if(je)return je=g,he=he(je),g=fe===""?"."+G(je,0):fe,pe(he)?(ue="",g!=null&&(ue=g.replace(P,"$&/")+"/"),O(he,w,ue,"",function(De){return De})):he!=null&&($e(he)&&(he=q(he,ue+(!he.key||je&&je.key===he.key?"":(""+he.key).replace(P,"$&/")+"/")+g)),w.push(he)),1;if(je=0,fe=fe===""?".":fe+":",pe(g))for(var Ee=0;Ee<g.length;Ee++){ge=g[Ee];var T=fe+G(ge,Ee);je+=O(ge,w,ue,T,he)}else if(T=ae(g),typeof T=="function")for(g=T.call(g),Ee=0;!(ge=g.next()).done;)ge=ge.value,T=fe+G(ge,Ee++),je+=O(ge,w,ue,T,he);else if(ge==="object")throw w=String(g),Error("Objects are not valid as a React child (found: "+(w==="[object Object]"?"object with keys {"+Object.keys(g).join(", ")+"}":w)+"). If you meant to render a collection of children, use an array instead.");return je}function N(g,w,ue){if(g==null)return g;var fe=[],he=0;return O(g,fe,"","",function(ge){return w.call(ue,ge,he++)}),fe}function j(g){if(g._status===-1){var w=g._result;w=w(),w.then(function(ue){(g._status===0||g._status===-1)&&(g._status=1,g._result=ue)},function(ue){(g._status===0||g._status===-1)&&(g._status=2,g._result=ue)}),g._status===-1&&(g._status=0,g._result=w)}if(g._status===1)return g._result.default;throw g._result}var le={current:null},S={transition:null},$={ReactCurrentDispatcher:le,ReactCurrentBatchConfig:S,ReactCurrentOwner:Se};function M(){throw Error("act(...) is not supported in production builds of React.")}return me.Children={map:N,forEach:function(g,w,ue){N(g,function(){w.apply(this,arguments)},ue)},count:function(g){var w=0;return N(g,function(){w++}),w},toArray:function(g){return N(g,function(w){return w})||[]},only:function(g){if(!$e(g))throw Error("React.Children.only expected to receive a single React element child.");return g}},me.Component=se,me.Fragment=c,me.Profiler=E,me.PureComponent=_e,me.StrictMode=I,me.Suspense=Q,me.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=$,me.act=M,me.cloneElement=function(g,w,ue){if(g==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+g+".");var fe=we({},g.props),he=g.key,ge=g.ref,je=g._owner;if(w!=null){if(w.ref!==void 0&&(ge=w.ref,je=Se.current),w.key!==void 0&&(he=""+w.key),g.type&&g.type.defaultProps)var Ee=g.type.defaultProps;for(T in w)Le.call(w,T)&&!ve.hasOwnProperty(T)&&(fe[T]=w[T]===void 0&&Ee!==void 0?Ee[T]:w[T])}var T=arguments.length-2;if(T===1)fe.children=ue;else if(1<T){Ee=Array(T);for(var De=0;De<T;De++)Ee[De]=arguments[De+2];fe.children=Ee}return{$$typeof:u,type:g.type,key:he,ref:ge,props:fe,_owner:je}},me.createContext=function(g){return g={$$typeof:de,_currentValue:g,_currentValue2:g,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},g.Provider={$$typeof:W,_context:g},g.Consumer=g},me.createElement=ke,me.createFactory=function(g){var w=ke.bind(null,g);return w.type=g,w},me.createRef=function(){return{current:null}},me.forwardRef=function(g){return{$$typeof:X,render:g}},me.isValidElement=$e,me.lazy=function(g){return{$$typeof:B,_payload:{_status:-1,_result:g},_init:j}},me.memo=function(g,w){return{$$typeof:ze,type:g,compare:w===void 0?null:w}},me.startTransition=function(g){var w=S.transition;S.transition={};try{g()}finally{S.transition=w}},me.unstable_act=M,me.useCallback=function(g,w){return le.current.useCallback(g,w)},me.useContext=function(g){return le.current.useContext(g)},me.useDebugValue=function(){},me.useDeferredValue=function(g){return le.current.useDeferredValue(g)},me.useEffect=function(g,w){return le.current.useEffect(g,w)},me.useId=function(){return le.current.useId()},me.useImperativeHandle=function(g,w,ue){return le.current.useImperativeHandle(g,w,ue)},me.useInsertionEffect=function(g,w){return le.current.useInsertionEffect(g,w)},me.useLayoutEffect=function(g,w){return le.current.useLayoutEffect(g,w)},me.useMemo=function(g,w){return le.current.useMemo(g,w)},me.useReducer=function(g,w,ue){return le.current.useReducer(g,w,ue)},me.useRef=function(g){return le.current.useRef(g)},me.useState=function(g){return le.current.useState(g)},me.useSyncExternalStore=function(g,w,ue){return le.current.useSyncExternalStore(g,w,ue)},me.useTransition=function(){return le.current.useTransition()},me.version="18.3.1",me}var fc;function Va(){return fc||(fc=1,Ia.exports=hp()),Ia.exports}/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var gc;function vp(){if(gc)return Ll;gc=1;var u=Va(),y=Symbol.for("react.element"),c=Symbol.for("react.fragment"),I=Object.prototype.hasOwnProperty,E=u.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,W={key:!0,ref:!0,__self:!0,__source:!0};function de(X,Q,ze){var B,V={},ae=null,re=null;ze!==void 0&&(ae=""+ze),Q.key!==void 0&&(ae=""+Q.key),Q.ref!==void 0&&(re=Q.ref);for(B in Q)I.call(Q,B)&&!W.hasOwnProperty(B)&&(V[B]=Q[B]);if(X&&X.defaultProps)for(B in Q=X.defaultProps,Q)V[B]===void 0&&(V[B]=Q[B]);return{$$typeof:y,type:X,key:ae,ref:re,props:V,_owner:E.current}}return Ll.Fragment=c,Ll.jsx=de,Ll.jsxs=de,Ll}var mc;function yp(){return mc||(mc=1,Ra.exports=vp()),Ra.exports}var o=yp(),L=Va();const Pc=_c(L);var Qi={},Ma={exports:{}},yt={},Oa={exports:{}},Da={};/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var hc;function xp(){return hc||(hc=1,(function(u){function y(S,$){var M=S.length;S.push($);e:for(;0<M;){var g=M-1>>>1,w=S[g];if(0<E(w,$))S[g]=$,S[M]=w,M=g;else break e}}function c(S){return S.length===0?null:S[0]}function I(S){if(S.length===0)return null;var $=S[0],M=S.pop();if(M!==$){S[0]=M;e:for(var g=0,w=S.length,ue=w>>>1;g<ue;){var fe=2*(g+1)-1,he=S[fe],ge=fe+1,je=S[ge];if(0>E(he,M))ge<w&&0>E(je,he)?(S[g]=je,S[ge]=M,g=ge):(S[g]=he,S[fe]=M,g=fe);else if(ge<w&&0>E(je,M))S[g]=je,S[ge]=M,g=ge;else break e}}return $}function E(S,$){var M=S.sortIndex-$.sortIndex;return M!==0?M:S.id-$.id}if(typeof performance=="object"&&typeof performance.now=="function"){var W=performance;u.unstable_now=function(){return W.now()}}else{var de=Date,X=de.now();u.unstable_now=function(){return de.now()-X}}var Q=[],ze=[],B=1,V=null,ae=3,re=!1,we=!1,ie=!1,se=typeof setTimeout=="function"?setTimeout:null,ce=typeof clearTimeout=="function"?clearTimeout:null,_e=typeof setImmediate<"u"?setImmediate:null;typeof navigator<"u"&&navigator.scheduling!==void 0&&navigator.scheduling.isInputPending!==void 0&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function Pe(S){for(var $=c(ze);$!==null;){if($.callback===null)I(ze);else if($.startTime<=S)I(ze),$.sortIndex=$.expirationTime,y(Q,$);else break;$=c(ze)}}function pe(S){if(ie=!1,Pe(S),!we)if(c(Q)!==null)we=!0,j(Le);else{var $=c(ze);$!==null&&le(pe,$.startTime-S)}}function Le(S,$){we=!1,ie&&(ie=!1,ce(ke),ke=-1),re=!0;var M=ae;try{for(Pe($),V=c(Q);V!==null&&(!(V.expirationTime>$)||S&&!Ne());){var g=V.callback;if(typeof g=="function"){V.callback=null,ae=V.priorityLevel;var w=g(V.expirationTime<=$);$=u.unstable_now(),typeof w=="function"?V.callback=w:V===c(Q)&&I(Q),Pe($)}else I(Q);V=c(Q)}if(V!==null)var ue=!0;else{var fe=c(ze);fe!==null&&le(pe,fe.startTime-$),ue=!1}return ue}finally{V=null,ae=M,re=!1}}var Se=!1,ve=null,ke=-1,q=5,$e=-1;function Ne(){return!(u.unstable_now()-$e<q)}function P(){if(ve!==null){var S=u.unstable_now();$e=S;var $=!0;try{$=ve(!0,S)}finally{$?G():(Se=!1,ve=null)}}else Se=!1}var G;if(typeof _e=="function")G=function(){_e(P)};else if(typeof MessageChannel<"u"){var O=new MessageChannel,N=O.port2;O.port1.onmessage=P,G=function(){N.postMessage(null)}}else G=function(){se(P,0)};function j(S){ve=S,Se||(Se=!0,G())}function le(S,$){ke=se(function(){S(u.unstable_now())},$)}u.unstable_IdlePriority=5,u.unstable_ImmediatePriority=1,u.unstable_LowPriority=4,u.unstable_NormalPriority=3,u.unstable_Profiling=null,u.unstable_UserBlockingPriority=2,u.unstable_cancelCallback=function(S){S.callback=null},u.unstable_continueExecution=function(){we||re||(we=!0,j(Le))},u.unstable_forceFrameRate=function(S){0>S||125<S?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):q=0<S?Math.floor(1e3/S):5},u.unstable_getCurrentPriorityLevel=function(){return ae},u.unstable_getFirstCallbackNode=function(){return c(Q)},u.unstable_next=function(S){switch(ae){case 1:case 2:case 3:var $=3;break;default:$=ae}var M=ae;ae=$;try{return S()}finally{ae=M}},u.unstable_pauseExecution=function(){},u.unstable_requestPaint=function(){},u.unstable_runWithPriority=function(S,$){switch(S){case 1:case 2:case 3:case 4:case 5:break;default:S=3}var M=ae;ae=S;try{return $()}finally{ae=M}},u.unstable_scheduleCallback=function(S,$,M){var g=u.unstable_now();switch(typeof M=="object"&&M!==null?(M=M.delay,M=typeof M=="number"&&0<M?g+M:g):M=g,S){case 1:var w=-1;break;case 2:w=250;break;case 5:w=1073741823;break;case 4:w=1e4;break;default:w=5e3}return w=M+w,S={id:B++,callback:$,priorityLevel:S,startTime:M,expirationTime:w,sortIndex:-1},M>g?(S.sortIndex=M,y(ze,S),c(Q)===null&&S===c(ze)&&(ie?(ce(ke),ke=-1):ie=!0,le(pe,M-g))):(S.sortIndex=w,y(Q,S),we||re||(we=!0,j(Le))),S},u.unstable_shouldYield=Ne,u.unstable_wrapCallback=function(S){var $=ae;return function(){var M=ae;ae=$;try{return S.apply(this,arguments)}finally{ae=M}}}})(Da)),Da}var vc;function zp(){return vc||(vc=1,Oa.exports=xp()),Oa.exports}/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var yc;function wp(){if(yc)return yt;yc=1;var u=Va(),y=zp();function c(e){for(var t="https://reactjs.org/docs/error-decoder.html?invariant="+e,n=1;n<arguments.length;n++)t+="&args[]="+encodeURIComponent(arguments[n]);return"Minified React error #"+e+"; visit "+t+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var I=new Set,E={};function W(e,t){de(e,t),de(e+"Capture",t)}function de(e,t){for(E[e]=t,e=0;e<t.length;e++)I.add(t[e])}var X=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),Q=Object.prototype.hasOwnProperty,ze=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,B={},V={};function ae(e){return Q.call(V,e)?!0:Q.call(B,e)?!1:ze.test(e)?V[e]=!0:(B[e]=!0,!1)}function re(e,t,n,r){if(n!==null&&n.type===0)return!1;switch(typeof t){case"function":case"symbol":return!0;case"boolean":return r?!1:n!==null?!n.acceptsBooleans:(e=e.toLowerCase().slice(0,5),e!=="data-"&&e!=="aria-");default:return!1}}function we(e,t,n,r){if(t===null||typeof t>"u"||re(e,t,n,r))return!0;if(r)return!1;if(n!==null)switch(n.type){case 3:return!t;case 4:return t===!1;case 5:return isNaN(t);case 6:return isNaN(t)||1>t}return!1}function ie(e,t,n,r,l,i,a){this.acceptsBooleans=t===2||t===3||t===4,this.attributeName=r,this.attributeNamespace=l,this.mustUseProperty=n,this.propertyName=e,this.type=t,this.sanitizeURL=i,this.removeEmptyString=a}var se={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(e){se[e]=new ie(e,0,!1,e,null,!1,!1)}),[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(e){var t=e[0];se[t]=new ie(t,1,!1,e[1],null,!1,!1)}),["contentEditable","draggable","spellCheck","value"].forEach(function(e){se[e]=new ie(e,2,!1,e.toLowerCase(),null,!1,!1)}),["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(e){se[e]=new ie(e,2,!1,e,null,!1,!1)}),"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(e){se[e]=new ie(e,3,!1,e.toLowerCase(),null,!1,!1)}),["checked","multiple","muted","selected"].forEach(function(e){se[e]=new ie(e,3,!0,e,null,!1,!1)}),["capture","download"].forEach(function(e){se[e]=new ie(e,4,!1,e,null,!1,!1)}),["cols","rows","size","span"].forEach(function(e){se[e]=new ie(e,6,!1,e,null,!1,!1)}),["rowSpan","start"].forEach(function(e){se[e]=new ie(e,5,!1,e.toLowerCase(),null,!1,!1)});var ce=/[\-:]([a-z])/g;function _e(e){return e[1].toUpperCase()}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(e){var t=e.replace(ce,_e);se[t]=new ie(t,1,!1,e,null,!1,!1)}),"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(e){var t=e.replace(ce,_e);se[t]=new ie(t,1,!1,e,"http://www.w3.org/1999/xlink",!1,!1)}),["xml:base","xml:lang","xml:space"].forEach(function(e){var t=e.replace(ce,_e);se[t]=new ie(t,1,!1,e,"http://www.w3.org/XML/1998/namespace",!1,!1)}),["tabIndex","crossOrigin"].forEach(function(e){se[e]=new ie(e,1,!1,e.toLowerCase(),null,!1,!1)}),se.xlinkHref=new ie("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1),["src","href","action","formAction"].forEach(function(e){se[e]=new ie(e,1,!1,e.toLowerCase(),null,!0,!0)});function Pe(e,t,n,r){var l=se.hasOwnProperty(t)?se[t]:null;(l!==null?l.type!==0:r||!(2<t.length)||t[0]!=="o"&&t[0]!=="O"||t[1]!=="n"&&t[1]!=="N")&&(we(t,n,l,r)&&(n=null),r||l===null?ae(t)&&(n===null?e.removeAttribute(t):e.setAttribute(t,""+n)):l.mustUseProperty?e[l.propertyName]=n===null?l.type===3?!1:"":n:(t=l.attributeName,r=l.attributeNamespace,n===null?e.removeAttribute(t):(l=l.type,n=l===3||l===4&&n===!0?"":""+n,r?e.setAttributeNS(r,t,n):e.setAttribute(t,n))))}var pe=u.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,Le=Symbol.for("react.element"),Se=Symbol.for("react.portal"),ve=Symbol.for("react.fragment"),ke=Symbol.for("react.strict_mode"),q=Symbol.for("react.profiler"),$e=Symbol.for("react.provider"),Ne=Symbol.for("react.context"),P=Symbol.for("react.forward_ref"),G=Symbol.for("react.suspense"),O=Symbol.for("react.suspense_list"),N=Symbol.for("react.memo"),j=Symbol.for("react.lazy"),le=Symbol.for("react.offscreen"),S=Symbol.iterator;function $(e){return e===null||typeof e!="object"?null:(e=S&&e[S]||e["@@iterator"],typeof e=="function"?e:null)}var M=Object.assign,g;function w(e){if(g===void 0)try{throw Error()}catch(n){var t=n.stack.trim().match(/\n( *(at )?)/);g=t&&t[1]||""}return`
`+g+e}var ue=!1;function fe(e,t){if(!e||ue)return"";ue=!0;var n=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(t)if(t=function(){throw Error()},Object.defineProperty(t.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(t,[])}catch(x){var r=x}Reflect.construct(e,[],t)}else{try{t.call()}catch(x){r=x}e.call(t.prototype)}else{try{throw Error()}catch(x){r=x}e()}}catch(x){if(x&&r&&typeof x.stack=="string"){for(var l=x.stack.split(`
`),i=r.stack.split(`
`),a=l.length-1,d=i.length-1;1<=a&&0<=d&&l[a]!==i[d];)d--;for(;1<=a&&0<=d;a--,d--)if(l[a]!==i[d]){if(a!==1||d!==1)do if(a--,d--,0>d||l[a]!==i[d]){var p=`
`+l[a].replace(" at new "," at ");return e.displayName&&p.includes("<anonymous>")&&(p=p.replace("<anonymous>",e.displayName)),p}while(1<=a&&0<=d);break}}}finally{ue=!1,Error.prepareStackTrace=n}return(e=e?e.displayName||e.name:"")?w(e):""}function he(e){switch(e.tag){case 5:return w(e.type);case 16:return w("Lazy");case 13:return w("Suspense");case 19:return w("SuspenseList");case 0:case 2:case 15:return e=fe(e.type,!1),e;case 11:return e=fe(e.type.render,!1),e;case 1:return e=fe(e.type,!0),e;default:return""}}function ge(e){if(e==null)return null;if(typeof e=="function")return e.displayName||e.name||null;if(typeof e=="string")return e;switch(e){case ve:return"Fragment";case Se:return"Portal";case q:return"Profiler";case ke:return"StrictMode";case G:return"Suspense";case O:return"SuspenseList"}if(typeof e=="object")switch(e.$$typeof){case Ne:return(e.displayName||"Context")+".Consumer";case $e:return(e._context.displayName||"Context")+".Provider";case P:var t=e.render;return e=e.displayName,e||(e=t.displayName||t.name||"",e=e!==""?"ForwardRef("+e+")":"ForwardRef"),e;case N:return t=e.displayName||null,t!==null?t:ge(e.type)||"Memo";case j:t=e._payload,e=e._init;try{return ge(e(t))}catch{}}return null}function je(e){var t=e.type;switch(e.tag){case 24:return"Cache";case 9:return(t.displayName||"Context")+".Consumer";case 10:return(t._context.displayName||"Context")+".Provider";case 18:return"DehydratedFragment";case 11:return e=t.render,e=e.displayName||e.name||"",t.displayName||(e!==""?"ForwardRef("+e+")":"ForwardRef");case 7:return"Fragment";case 5:return t;case 4:return"Portal";case 3:return"Root";case 6:return"Text";case 16:return ge(t);case 8:return t===ke?"StrictMode":"Mode";case 22:return"Offscreen";case 12:return"Profiler";case 21:return"Scope";case 13:return"Suspense";case 19:return"SuspenseList";case 25:return"TracingMarker";case 1:case 0:case 17:case 2:case 14:case 15:if(typeof t=="function")return t.displayName||t.name||null;if(typeof t=="string")return t}return null}function Ee(e){switch(typeof e){case"boolean":case"number":case"string":case"undefined":return e;case"object":return e;default:return""}}function T(e){var t=e.type;return(e=e.nodeName)&&e.toLowerCase()==="input"&&(t==="checkbox"||t==="radio")}function De(e){var t=T(e)?"checked":"value",n=Object.getOwnPropertyDescriptor(e.constructor.prototype,t),r=""+e[t];if(!e.hasOwnProperty(t)&&typeof n<"u"&&typeof n.get=="function"&&typeof n.set=="function"){var l=n.get,i=n.set;return Object.defineProperty(e,t,{configurable:!0,get:function(){return l.call(this)},set:function(a){r=""+a,i.call(this,a)}}),Object.defineProperty(e,t,{enumerable:n.enumerable}),{getValue:function(){return r},setValue:function(a){r=""+a},stopTracking:function(){e._valueTracker=null,delete e[t]}}}}function Ot(e){e._valueTracker||(e._valueTracker=De(e))}function Bn(e){if(!e)return!1;var t=e._valueTracker;if(!t)return!0;var n=t.getValue(),r="";return e&&(r=T(e)?e.checked?"true":"false":e.value),e=r,e!==n?(t.setValue(e),!0):!1}function Et(e){if(e=e||(typeof document<"u"?document:void 0),typeof e>"u")return null;try{return e.activeElement||e.body}catch{return e.body}}function nn(e,t){var n=t.checked;return M({},t,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:n??e._wrapperState.initialChecked})}function gn(e,t){var n=t.defaultValue==null?"":t.defaultValue,r=t.checked!=null?t.checked:t.defaultChecked;n=Ee(t.value!=null?t.value:n),e._wrapperState={initialChecked:r,initialValue:n,controlled:t.type==="checkbox"||t.type==="radio"?t.checked!=null:t.value!=null}}function Un(e,t){t=t.checked,t!=null&&Pe(e,"checked",t,!1)}function sr(e,t){Un(e,t);var n=Ee(t.value),r=t.type;if(n!=null)r==="number"?(n===0&&e.value===""||e.value!=n)&&(e.value=""+n):e.value!==""+n&&(e.value=""+n);else if(r==="submit"||r==="reset"){e.removeAttribute("value");return}t.hasOwnProperty("value")?mn(e,t.type,n):t.hasOwnProperty("defaultValue")&&mn(e,t.type,Ee(t.defaultValue)),t.checked==null&&t.defaultChecked!=null&&(e.defaultChecked=!!t.defaultChecked)}function Br(e,t,n){if(t.hasOwnProperty("value")||t.hasOwnProperty("defaultValue")){var r=t.type;if(!(r!=="submit"&&r!=="reset"||t.value!==void 0&&t.value!==null))return;t=""+e._wrapperState.initialValue,n||t===e.value||(e.value=t),e.defaultValue=t}n=e.name,n!==""&&(e.name=""),e.defaultChecked=!!e._wrapperState.initialChecked,n!==""&&(e.name=n)}function mn(e,t,n){(t!=="number"||Et(e.ownerDocument)!==e)&&(n==null?e.defaultValue=""+e._wrapperState.initialValue:e.defaultValue!==""+n&&(e.defaultValue=""+n))}var Dt=Array.isArray;function rn(e,t,n,r){if(e=e.options,t){t={};for(var l=0;l<n.length;l++)t["$"+n[l]]=!0;for(n=0;n<e.length;n++)l=t.hasOwnProperty("$"+e[n].value),e[n].selected!==l&&(e[n].selected=l),l&&r&&(e[n].defaultSelected=!0)}else{for(n=""+Ee(n),t=null,l=0;l<e.length;l++){if(e[l].value===n){e[l].selected=!0,r&&(e[l].defaultSelected=!0);return}t!==null||e[l].disabled||(t=e[l])}t!==null&&(t.selected=!0)}}function Wn(e,t){if(t.dangerouslySetInnerHTML!=null)throw Error(c(91));return M({},t,{value:void 0,defaultValue:void 0,children:""+e._wrapperState.initialValue})}function Ur(e,t){var n=t.value;if(n==null){if(n=t.children,t=t.defaultValue,n!=null){if(t!=null)throw Error(c(92));if(Dt(n)){if(1<n.length)throw Error(c(93));n=n[0]}t=n}t==null&&(t=""),n=t}e._wrapperState={initialValue:Ee(n)}}function Wr(e,t){var n=Ee(t.value),r=Ee(t.defaultValue);n!=null&&(n=""+n,n!==e.value&&(e.value=n),t.defaultValue==null&&e.defaultValue!==n&&(e.defaultValue=n)),r!=null&&(e.defaultValue=""+r)}function Hr(e){var t=e.textContent;t===e._wrapperState.initialValue&&t!==""&&t!==null&&(e.value=t)}function ur(e){switch(e){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function cr(e,t){return e==null||e==="http://www.w3.org/1999/xhtml"?ur(t):e==="http://www.w3.org/2000/svg"&&t==="foreignObject"?"http://www.w3.org/1999/xhtml":e}var Hn,dr=(function(e){return typeof MSApp<"u"&&MSApp.execUnsafeLocalFunction?function(t,n,r,l){MSApp.execUnsafeLocalFunction(function(){return e(t,n,r,l)})}:e})(function(e,t){if(e.namespaceURI!=="http://www.w3.org/2000/svg"||"innerHTML"in e)e.innerHTML=t;else{for(Hn=Hn||document.createElement("div"),Hn.innerHTML="<svg>"+t.valueOf().toString()+"</svg>",t=Hn.firstChild;e.firstChild;)e.removeChild(e.firstChild);for(;t.firstChild;)e.appendChild(t.firstChild)}});function Qt(e,t){if(t){var n=e.firstChild;if(n&&n===e.lastChild&&n.nodeType===3){n.nodeValue=t;return}}e.textContent=t}var _t={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},Zi=["Webkit","ms","Moz","O"];Object.keys(_t).forEach(function(e){Zi.forEach(function(t){t=t+e.charAt(0).toUpperCase()+e.substring(1),_t[t]=_t[e]})});function Qr(e,t,n){return t==null||typeof t=="boolean"||t===""?"":n||typeof t!="number"||t===0||_t.hasOwnProperty(e)&&_t[e]?(""+t).trim():t+"px"}function Vt(e,t){e=e.style;for(var n in t)if(t.hasOwnProperty(n)){var r=n.indexOf("--")===0,l=Qr(n,t[n],r);n==="float"&&(n="cssFloat"),r?e.setProperty(n,l):e[n]=l}}var Ml=M({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function Vr(e,t){if(t){if(Ml[e]&&(t.children!=null||t.dangerouslySetInnerHTML!=null))throw Error(c(137,e));if(t.dangerouslySetInnerHTML!=null){if(t.children!=null)throw Error(c(60));if(typeof t.dangerouslySetInnerHTML!="object"||!("__html"in t.dangerouslySetInnerHTML))throw Error(c(61))}if(t.style!=null&&typeof t.style!="object")throw Error(c(62))}}function hn(e,t){if(e.indexOf("-")===-1)return typeof t.is=="string";switch(e){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var Ft=null;function pr(e){return e=e.target||e.srcElement||window,e.correspondingUseElement&&(e=e.correspondingUseElement),e.nodeType===3?e.parentNode:e}var vn=null,ct=null,yn=null;function fr(e){if(e=vl(e)){if(typeof vn!="function")throw Error(c(280));var t=e.stateNode;t&&(t=oi(t),vn(e.stateNode,e.type,t))}}function xn(e){ct?yn?yn.push(e):yn=[e]:ct=e}function zn(){if(ct){var e=ct,t=yn;if(yn=ct=null,fr(e),t)for(e=0;e<t.length;e++)fr(t[e])}}function Qn(e,t){return e(t)}function Yr(){}var gr=!1;function mr(e,t,n){if(gr)return e(t,n);gr=!0;try{return Qn(e,t,n)}finally{gr=!1,(ct!==null||yn!==null)&&(Yr(),zn())}}function Yt(e,t){var n=e.stateNode;if(n===null)return null;var r=oi(n);if(r===null)return null;n=r[t];e:switch(t){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(r=!r.disabled)||(e=e.type,r=!(e==="button"||e==="input"||e==="select"||e==="textarea")),e=!r;break e;default:e=!1}if(e)return null;if(n&&typeof n!="function")throw Error(c(231,t,typeof n));return n}var Kt=!1;if(X)try{var Ae={};Object.defineProperty(Ae,"passive",{get:function(){Kt=!0}}),window.addEventListener("test",Ae,Ae),window.removeEventListener("test",Ae,Ae)}catch{Kt=!1}function Kr(e,t,n,r,l,i,a,d,p){var x=Array.prototype.slice.call(arguments,3);try{t.apply(n,x)}catch(b){this.onError(b)}}var Vn=!1,hr=null,zt=!1,wn=null,Xr={onError:function(e){Vn=!0,hr=e}};function Ol(e,t,n,r,l,i,a,d,p){Vn=!1,hr=null,Kr.apply(Xr,arguments)}function Dl(e,t,n,r,l,i,a,d,p){if(Ol.apply(this,arguments),Vn){if(Vn){var x=hr;Vn=!1,hr=null}else throw Error(c(198));zt||(zt=!0,wn=x)}}function Xt(e){var t=e,n=e;if(e.alternate)for(;t.return;)t=t.return;else{e=t;do t=e,(t.flags&4098)!==0&&(n=t.return),e=t.return;while(e)}return t.tag===3?n:null}function Fl(e){if(e.tag===13){var t=e.memoizedState;if(t===null&&(e=e.alternate,e!==null&&(t=e.memoizedState)),t!==null)return t.dehydrated}return null}function $l(e){if(Xt(e)!==e)throw Error(c(188))}function Ji(e){var t=e.alternate;if(!t){if(t=Xt(e),t===null)throw Error(c(188));return t!==e?null:e}for(var n=e,r=t;;){var l=n.return;if(l===null)break;var i=l.alternate;if(i===null){if(r=l.return,r!==null){n=r;continue}break}if(l.child===i.child){for(i=l.child;i;){if(i===n)return $l(l),e;if(i===r)return $l(l),t;i=i.sibling}throw Error(c(188))}if(n.return!==r.return)n=l,r=i;else{for(var a=!1,d=l.child;d;){if(d===n){a=!0,n=l,r=i;break}if(d===r){a=!0,r=l,n=i;break}d=d.sibling}if(!a){for(d=i.child;d;){if(d===n){a=!0,n=i,r=l;break}if(d===r){a=!0,r=i,n=l;break}d=d.sibling}if(!a)throw Error(c(189))}}if(n.alternate!==r)throw Error(c(190))}if(n.tag!==3)throw Error(c(188));return n.stateNode.current===n?e:t}function vr(e){return e=Ji(e),e!==null?Gr(e):null}function Gr(e){if(e.tag===5||e.tag===6)return e;for(e=e.child;e!==null;){var t=Gr(e);if(t!==null)return t;e=e.sibling}return null}var Al=y.unstable_scheduleCallback,Bl=y.unstable_cancelCallback,eo=y.unstable_shouldYield,to=y.unstable_requestPaint,Be=y.unstable_now,no=y.unstable_getCurrentPriorityLevel,qr=y.unstable_ImmediatePriority,Zr=y.unstable_UserBlockingPriority,Yn=y.unstable_NormalPriority,Ul=y.unstable_LowPriority,Jr=y.unstable_IdlePriority,Kn=null,wt=null;function Wl(e){if(wt&&typeof wt.onCommitFiberRoot=="function")try{wt.onCommitFiberRoot(Kn,e,void 0,(e.current.flags&128)===128)}catch{}}var s=Math.clz32?Math.clz32:R,v=Math.log,z=Math.LN2;function R(e){return e>>>=0,e===0?32:31-(v(e)/z|0)|0}var D=64,ee=4194304;function Z(e){switch(e&-e){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return e&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return e&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;default:return e}}function ye(e,t){var n=e.pendingLanes;if(n===0)return 0;var r=0,l=e.suspendedLanes,i=e.pingedLanes,a=n&268435455;if(a!==0){var d=a&~l;d!==0?r=Z(d):(i&=a,i!==0&&(r=Z(i)))}else a=n&~l,a!==0?r=Z(a):i!==0&&(r=Z(i));if(r===0)return 0;if(t!==0&&t!==r&&(t&l)===0&&(l=r&-r,i=t&-t,l>=i||l===16&&(i&4194240)!==0))return t;if((r&4)!==0&&(r|=n&16),t=e.entangledLanes,t!==0)for(e=e.entanglements,t&=r;0<t;)n=31-s(t),l=1<<n,r|=e[n],t&=~l;return r}function Te(e,t){switch(e){case 1:case 2:case 4:return t+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return t+5e3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return-1;case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function Ge(e,t){for(var n=e.suspendedLanes,r=e.pingedLanes,l=e.expirationTimes,i=e.pendingLanes;0<i;){var a=31-s(i),d=1<<a,p=l[a];p===-1?((d&n)===0||(d&r)!==0)&&(l[a]=Te(d,t)):p<=t&&(e.expiredLanes|=d),i&=~d}}function Ie(e){return e=e.pendingLanes&-1073741825,e!==0?e:e&1073741824?1073741824:0}function it(){var e=D;return D<<=1,(D&4194240)===0&&(D=64),e}function Ue(e){for(var t=[],n=0;31>n;n++)t.push(e);return t}function kt(e,t,n){e.pendingLanes|=t,t!==536870912&&(e.suspendedLanes=0,e.pingedLanes=0),e=e.eventTimes,t=31-s(t),e[t]=n}function J(e,t){var n=e.pendingLanes&~t;e.pendingLanes=t,e.suspendedLanes=0,e.pingedLanes=0,e.expiredLanes&=t,e.mutableReadLanes&=t,e.entangledLanes&=t,t=e.entanglements;var r=e.eventTimes;for(e=e.expirationTimes;0<n;){var l=31-s(n),i=1<<l;t[l]=0,r[l]=-1,e[l]=-1,n&=~i}}function xe(e,t){var n=e.entangledLanes|=t;for(e=e.entanglements;n;){var r=31-s(n),l=1<<r;l&t|e[r]&t&&(e[r]|=t),n&=~l}}var A=0;function Ke(e){return e&=-e,1<e?4<e?(e&268435455)!==0?16:536870912:4:1}var nt,Gt,el,Hl,Ya,ro=!1,Ql=[],kn=null,bn=null,Sn=null,tl=new Map,nl=new Map,jn=[],Oc="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");function Ka(e,t){switch(e){case"focusin":case"focusout":kn=null;break;case"dragenter":case"dragleave":bn=null;break;case"mouseover":case"mouseout":Sn=null;break;case"pointerover":case"pointerout":tl.delete(t.pointerId);break;case"gotpointercapture":case"lostpointercapture":nl.delete(t.pointerId)}}function rl(e,t,n,r,l,i){return e===null||e.nativeEvent!==i?(e={blockedOn:t,domEventName:n,eventSystemFlags:r,nativeEvent:i,targetContainers:[l]},t!==null&&(t=vl(t),t!==null&&Gt(t)),e):(e.eventSystemFlags|=r,t=e.targetContainers,l!==null&&t.indexOf(l)===-1&&t.push(l),e)}function Dc(e,t,n,r,l){switch(t){case"focusin":return kn=rl(kn,e,t,n,r,l),!0;case"dragenter":return bn=rl(bn,e,t,n,r,l),!0;case"mouseover":return Sn=rl(Sn,e,t,n,r,l),!0;case"pointerover":var i=l.pointerId;return tl.set(i,rl(tl.get(i)||null,e,t,n,r,l)),!0;case"gotpointercapture":return i=l.pointerId,nl.set(i,rl(nl.get(i)||null,e,t,n,r,l)),!0}return!1}function Xa(e){var t=Xn(e.target);if(t!==null){var n=Xt(t);if(n!==null){if(t=n.tag,t===13){if(t=Fl(n),t!==null){e.blockedOn=t,Ya(e.priority,function(){el(n)});return}}else if(t===3&&n.stateNode.current.memoizedState.isDehydrated){e.blockedOn=n.tag===3?n.stateNode.containerInfo:null;return}}}e.blockedOn=null}function Vl(e){if(e.blockedOn!==null)return!1;for(var t=e.targetContainers;0<t.length;){var n=io(e.domEventName,e.eventSystemFlags,t[0],e.nativeEvent);if(n===null){n=e.nativeEvent;var r=new n.constructor(n.type,n);Ft=r,n.target.dispatchEvent(r),Ft=null}else return t=vl(n),t!==null&&Gt(t),e.blockedOn=n,!1;t.shift()}return!0}function Ga(e,t,n){Vl(e)&&n.delete(t)}function Fc(){ro=!1,kn!==null&&Vl(kn)&&(kn=null),bn!==null&&Vl(bn)&&(bn=null),Sn!==null&&Vl(Sn)&&(Sn=null),tl.forEach(Ga),nl.forEach(Ga)}function ll(e,t){e.blockedOn===t&&(e.blockedOn=null,ro||(ro=!0,y.unstable_scheduleCallback(y.unstable_NormalPriority,Fc)))}function il(e){function t(l){return ll(l,e)}if(0<Ql.length){ll(Ql[0],e);for(var n=1;n<Ql.length;n++){var r=Ql[n];r.blockedOn===e&&(r.blockedOn=null)}}for(kn!==null&&ll(kn,e),bn!==null&&ll(bn,e),Sn!==null&&ll(Sn,e),tl.forEach(t),nl.forEach(t),n=0;n<jn.length;n++)r=jn[n],r.blockedOn===e&&(r.blockedOn=null);for(;0<jn.length&&(n=jn[0],n.blockedOn===null);)Xa(n),n.blockedOn===null&&jn.shift()}var yr=pe.ReactCurrentBatchConfig,Yl=!0;function $c(e,t,n,r){var l=A,i=yr.transition;yr.transition=null;try{A=1,lo(e,t,n,r)}finally{A=l,yr.transition=i}}function Ac(e,t,n,r){var l=A,i=yr.transition;yr.transition=null;try{A=4,lo(e,t,n,r)}finally{A=l,yr.transition=i}}function lo(e,t,n,r){if(Yl){var l=io(e,t,n,r);if(l===null)bo(e,t,r,Kl,n),Ka(e,r);else if(Dc(l,e,t,n,r))r.stopPropagation();else if(Ka(e,r),t&4&&-1<Oc.indexOf(e)){for(;l!==null;){var i=vl(l);if(i!==null&&nt(i),i=io(e,t,n,r),i===null&&bo(e,t,r,Kl,n),i===l)break;l=i}l!==null&&r.stopPropagation()}else bo(e,t,r,null,n)}}var Kl=null;function io(e,t,n,r){if(Kl=null,e=pr(r),e=Xn(e),e!==null)if(t=Xt(e),t===null)e=null;else if(n=t.tag,n===13){if(e=Fl(t),e!==null)return e;e=null}else if(n===3){if(t.stateNode.current.memoizedState.isDehydrated)return t.tag===3?t.stateNode.containerInfo:null;e=null}else t!==e&&(e=null);return Kl=e,null}function qa(e){switch(e){case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 1;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"toggle":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 4;case"message":switch(no()){case qr:return 1;case Zr:return 4;case Yn:case Ul:return 16;case Jr:return 536870912;default:return 16}default:return 16}}var Cn=null,oo=null,Xl=null;function Za(){if(Xl)return Xl;var e,t=oo,n=t.length,r,l="value"in Cn?Cn.value:Cn.textContent,i=l.length;for(e=0;e<n&&t[e]===l[e];e++);var a=n-e;for(r=1;r<=a&&t[n-r]===l[i-r];r++);return Xl=l.slice(e,1<r?1-r:void 0)}function Gl(e){var t=e.keyCode;return"charCode"in e?(e=e.charCode,e===0&&t===13&&(e=13)):e=t,e===10&&(e=13),32<=e||e===13?e:0}function ql(){return!0}function Ja(){return!1}function bt(e){function t(n,r,l,i,a){this._reactName=n,this._targetInst=l,this.type=r,this.nativeEvent=i,this.target=a,this.currentTarget=null;for(var d in e)e.hasOwnProperty(d)&&(n=e[d],this[d]=n?n(i):i[d]);return this.isDefaultPrevented=(i.defaultPrevented!=null?i.defaultPrevented:i.returnValue===!1)?ql:Ja,this.isPropagationStopped=Ja,this}return M(t.prototype,{preventDefault:function(){this.defaultPrevented=!0;var n=this.nativeEvent;n&&(n.preventDefault?n.preventDefault():typeof n.returnValue!="unknown"&&(n.returnValue=!1),this.isDefaultPrevented=ql)},stopPropagation:function(){var n=this.nativeEvent;n&&(n.stopPropagation?n.stopPropagation():typeof n.cancelBubble!="unknown"&&(n.cancelBubble=!0),this.isPropagationStopped=ql)},persist:function(){},isPersistent:ql}),t}var xr={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(e){return e.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},ao=bt(xr),ol=M({},xr,{view:0,detail:0}),Bc=bt(ol),so,uo,al,Zl=M({},ol,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:po,button:0,buttons:0,relatedTarget:function(e){return e.relatedTarget===void 0?e.fromElement===e.srcElement?e.toElement:e.fromElement:e.relatedTarget},movementX:function(e){return"movementX"in e?e.movementX:(e!==al&&(al&&e.type==="mousemove"?(so=e.screenX-al.screenX,uo=e.screenY-al.screenY):uo=so=0,al=e),so)},movementY:function(e){return"movementY"in e?e.movementY:uo}}),es=bt(Zl),Uc=M({},Zl,{dataTransfer:0}),Wc=bt(Uc),Hc=M({},ol,{relatedTarget:0}),co=bt(Hc),Qc=M({},xr,{animationName:0,elapsedTime:0,pseudoElement:0}),Vc=bt(Qc),Yc=M({},xr,{clipboardData:function(e){return"clipboardData"in e?e.clipboardData:window.clipboardData}}),Kc=bt(Yc),Xc=M({},xr,{data:0}),ts=bt(Xc),Gc={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},qc={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},Zc={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function Jc(e){var t=this.nativeEvent;return t.getModifierState?t.getModifierState(e):(e=Zc[e])?!!t[e]:!1}function po(){return Jc}var ed=M({},ol,{key:function(e){if(e.key){var t=Gc[e.key]||e.key;if(t!=="Unidentified")return t}return e.type==="keypress"?(e=Gl(e),e===13?"Enter":String.fromCharCode(e)):e.type==="keydown"||e.type==="keyup"?qc[e.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:po,charCode:function(e){return e.type==="keypress"?Gl(e):0},keyCode:function(e){return e.type==="keydown"||e.type==="keyup"?e.keyCode:0},which:function(e){return e.type==="keypress"?Gl(e):e.type==="keydown"||e.type==="keyup"?e.keyCode:0}}),td=bt(ed),nd=M({},Zl,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),ns=bt(nd),rd=M({},ol,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:po}),ld=bt(rd),id=M({},xr,{propertyName:0,elapsedTime:0,pseudoElement:0}),od=bt(id),ad=M({},Zl,{deltaX:function(e){return"deltaX"in e?e.deltaX:"wheelDeltaX"in e?-e.wheelDeltaX:0},deltaY:function(e){return"deltaY"in e?e.deltaY:"wheelDeltaY"in e?-e.wheelDeltaY:"wheelDelta"in e?-e.wheelDelta:0},deltaZ:0,deltaMode:0}),sd=bt(ad),ud=[9,13,27,32],fo=X&&"CompositionEvent"in window,sl=null;X&&"documentMode"in document&&(sl=document.documentMode);var cd=X&&"TextEvent"in window&&!sl,rs=X&&(!fo||sl&&8<sl&&11>=sl),ls=" ",is=!1;function os(e,t){switch(e){case"keyup":return ud.indexOf(t.keyCode)!==-1;case"keydown":return t.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function as(e){return e=e.detail,typeof e=="object"&&"data"in e?e.data:null}var zr=!1;function dd(e,t){switch(e){case"compositionend":return as(t);case"keypress":return t.which!==32?null:(is=!0,ls);case"textInput":return e=t.data,e===ls&&is?null:e;default:return null}}function pd(e,t){if(zr)return e==="compositionend"||!fo&&os(e,t)?(e=Za(),Xl=oo=Cn=null,zr=!1,e):null;switch(e){case"paste":return null;case"keypress":if(!(t.ctrlKey||t.altKey||t.metaKey)||t.ctrlKey&&t.altKey){if(t.char&&1<t.char.length)return t.char;if(t.which)return String.fromCharCode(t.which)}return null;case"compositionend":return rs&&t.locale!=="ko"?null:t.data;default:return null}}var fd={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function ss(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t==="input"?!!fd[e.type]:t==="textarea"}function us(e,t,n,r){xn(r),t=ri(t,"onChange"),0<t.length&&(n=new ao("onChange","change",null,n,r),e.push({event:n,listeners:t}))}var ul=null,cl=null;function gd(e){Ns(e,0)}function Jl(e){var t=jr(e);if(Bn(t))return e}function md(e,t){if(e==="change")return t}var cs=!1;if(X){var go;if(X){var mo="oninput"in document;if(!mo){var ds=document.createElement("div");ds.setAttribute("oninput","return;"),mo=typeof ds.oninput=="function"}go=mo}else go=!1;cs=go&&(!document.documentMode||9<document.documentMode)}function ps(){ul&&(ul.detachEvent("onpropertychange",fs),cl=ul=null)}function fs(e){if(e.propertyName==="value"&&Jl(cl)){var t=[];us(t,cl,e,pr(e)),mr(gd,t)}}function hd(e,t,n){e==="focusin"?(ps(),ul=t,cl=n,ul.attachEvent("onpropertychange",fs)):e==="focusout"&&ps()}function vd(e){if(e==="selectionchange"||e==="keyup"||e==="keydown")return Jl(cl)}function yd(e,t){if(e==="click")return Jl(t)}function xd(e,t){if(e==="input"||e==="change")return Jl(t)}function zd(e,t){return e===t&&(e!==0||1/e===1/t)||e!==e&&t!==t}var $t=typeof Object.is=="function"?Object.is:zd;function dl(e,t){if($t(e,t))return!0;if(typeof e!="object"||e===null||typeof t!="object"||t===null)return!1;var n=Object.keys(e),r=Object.keys(t);if(n.length!==r.length)return!1;for(r=0;r<n.length;r++){var l=n[r];if(!Q.call(t,l)||!$t(e[l],t[l]))return!1}return!0}function gs(e){for(;e&&e.firstChild;)e=e.firstChild;return e}function ms(e,t){var n=gs(e);e=0;for(var r;n;){if(n.nodeType===3){if(r=e+n.textContent.length,e<=t&&r>=t)return{node:n,offset:t-e};e=r}e:{for(;n;){if(n.nextSibling){n=n.nextSibling;break e}n=n.parentNode}n=void 0}n=gs(n)}}function hs(e,t){return e&&t?e===t?!0:e&&e.nodeType===3?!1:t&&t.nodeType===3?hs(e,t.parentNode):"contains"in e?e.contains(t):e.compareDocumentPosition?!!(e.compareDocumentPosition(t)&16):!1:!1}function vs(){for(var e=window,t=Et();t instanceof e.HTMLIFrameElement;){try{var n=typeof t.contentWindow.location.href=="string"}catch{n=!1}if(n)e=t.contentWindow;else break;t=Et(e.document)}return t}function ho(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t&&(t==="input"&&(e.type==="text"||e.type==="search"||e.type==="tel"||e.type==="url"||e.type==="password")||t==="textarea"||e.contentEditable==="true")}function wd(e){var t=vs(),n=e.focusedElem,r=e.selectionRange;if(t!==n&&n&&n.ownerDocument&&hs(n.ownerDocument.documentElement,n)){if(r!==null&&ho(n)){if(t=r.start,e=r.end,e===void 0&&(e=t),"selectionStart"in n)n.selectionStart=t,n.selectionEnd=Math.min(e,n.value.length);else if(e=(t=n.ownerDocument||document)&&t.defaultView||window,e.getSelection){e=e.getSelection();var l=n.textContent.length,i=Math.min(r.start,l);r=r.end===void 0?i:Math.min(r.end,l),!e.extend&&i>r&&(l=r,r=i,i=l),l=ms(n,i);var a=ms(n,r);l&&a&&(e.rangeCount!==1||e.anchorNode!==l.node||e.anchorOffset!==l.offset||e.focusNode!==a.node||e.focusOffset!==a.offset)&&(t=t.createRange(),t.setStart(l.node,l.offset),e.removeAllRanges(),i>r?(e.addRange(t),e.extend(a.node,a.offset)):(t.setEnd(a.node,a.offset),e.addRange(t)))}}for(t=[],e=n;e=e.parentNode;)e.nodeType===1&&t.push({element:e,left:e.scrollLeft,top:e.scrollTop});for(typeof n.focus=="function"&&n.focus(),n=0;n<t.length;n++)e=t[n],e.element.scrollLeft=e.left,e.element.scrollTop=e.top}}var kd=X&&"documentMode"in document&&11>=document.documentMode,wr=null,vo=null,pl=null,yo=!1;function ys(e,t,n){var r=n.window===n?n.document:n.nodeType===9?n:n.ownerDocument;yo||wr==null||wr!==Et(r)||(r=wr,"selectionStart"in r&&ho(r)?r={start:r.selectionStart,end:r.selectionEnd}:(r=(r.ownerDocument&&r.ownerDocument.defaultView||window).getSelection(),r={anchorNode:r.anchorNode,anchorOffset:r.anchorOffset,focusNode:r.focusNode,focusOffset:r.focusOffset}),pl&&dl(pl,r)||(pl=r,r=ri(vo,"onSelect"),0<r.length&&(t=new ao("onSelect","select",null,t,n),e.push({event:t,listeners:r}),t.target=wr)))}function ei(e,t){var n={};return n[e.toLowerCase()]=t.toLowerCase(),n["Webkit"+e]="webkit"+t,n["Moz"+e]="moz"+t,n}var kr={animationend:ei("Animation","AnimationEnd"),animationiteration:ei("Animation","AnimationIteration"),animationstart:ei("Animation","AnimationStart"),transitionend:ei("Transition","TransitionEnd")},xo={},xs={};X&&(xs=document.createElement("div").style,"AnimationEvent"in window||(delete kr.animationend.animation,delete kr.animationiteration.animation,delete kr.animationstart.animation),"TransitionEvent"in window||delete kr.transitionend.transition);function ti(e){if(xo[e])return xo[e];if(!kr[e])return e;var t=kr[e],n;for(n in t)if(t.hasOwnProperty(n)&&n in xs)return xo[e]=t[n];return e}var zs=ti("animationend"),ws=ti("animationiteration"),ks=ti("animationstart"),bs=ti("transitionend"),Ss=new Map,js="abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");function Nn(e,t){Ss.set(e,t),W(t,[e])}for(var zo=0;zo<js.length;zo++){var wo=js[zo],bd=wo.toLowerCase(),Sd=wo[0].toUpperCase()+wo.slice(1);Nn(bd,"on"+Sd)}Nn(zs,"onAnimationEnd"),Nn(ws,"onAnimationIteration"),Nn(ks,"onAnimationStart"),Nn("dblclick","onDoubleClick"),Nn("focusin","onFocus"),Nn("focusout","onBlur"),Nn(bs,"onTransitionEnd"),de("onMouseEnter",["mouseout","mouseover"]),de("onMouseLeave",["mouseout","mouseover"]),de("onPointerEnter",["pointerout","pointerover"]),de("onPointerLeave",["pointerout","pointerover"]),W("onChange","change click focusin focusout input keydown keyup selectionchange".split(" ")),W("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")),W("onBeforeInput",["compositionend","keypress","textInput","paste"]),W("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" ")),W("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" ")),W("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var fl="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),jd=new Set("cancel close invalid load scroll toggle".split(" ").concat(fl));function Cs(e,t,n){var r=e.type||"unknown-event";e.currentTarget=n,Dl(r,t,void 0,e),e.currentTarget=null}function Ns(e,t){t=(t&4)!==0;for(var n=0;n<e.length;n++){var r=e[n],l=r.event;r=r.listeners;e:{var i=void 0;if(t)for(var a=r.length-1;0<=a;a--){var d=r[a],p=d.instance,x=d.currentTarget;if(d=d.listener,p!==i&&l.isPropagationStopped())break e;Cs(l,d,x),i=p}else for(a=0;a<r.length;a++){if(d=r[a],p=d.instance,x=d.currentTarget,d=d.listener,p!==i&&l.isPropagationStopped())break e;Cs(l,d,x),i=p}}}if(zt)throw e=wn,zt=!1,wn=null,e}function Me(e,t){var n=t[_o];n===void 0&&(n=t[_o]=new Set);var r=e+"__bubble";n.has(r)||(Es(t,e,2,!1),n.add(r))}function ko(e,t,n){var r=0;t&&(r|=4),Es(n,e,r,t)}var ni="_reactListening"+Math.random().toString(36).slice(2);function gl(e){if(!e[ni]){e[ni]=!0,I.forEach(function(n){n!=="selectionchange"&&(jd.has(n)||ko(n,!1,e),ko(n,!0,e))});var t=e.nodeType===9?e:e.ownerDocument;t===null||t[ni]||(t[ni]=!0,ko("selectionchange",!1,t))}}function Es(e,t,n,r){switch(qa(t)){case 1:var l=$c;break;case 4:l=Ac;break;default:l=lo}n=l.bind(null,t,n,e),l=void 0,!Kt||t!=="touchstart"&&t!=="touchmove"&&t!=="wheel"||(l=!0),r?l!==void 0?e.addEventListener(t,n,{capture:!0,passive:l}):e.addEventListener(t,n,!0):l!==void 0?e.addEventListener(t,n,{passive:l}):e.addEventListener(t,n,!1)}function bo(e,t,n,r,l){var i=r;if((t&1)===0&&(t&2)===0&&r!==null)e:for(;;){if(r===null)return;var a=r.tag;if(a===3||a===4){var d=r.stateNode.containerInfo;if(d===l||d.nodeType===8&&d.parentNode===l)break;if(a===4)for(a=r.return;a!==null;){var p=a.tag;if((p===3||p===4)&&(p=a.stateNode.containerInfo,p===l||p.nodeType===8&&p.parentNode===l))return;a=a.return}for(;d!==null;){if(a=Xn(d),a===null)return;if(p=a.tag,p===5||p===6){r=i=a;continue e}d=d.parentNode}}r=r.return}mr(function(){var x=i,b=pr(n),C=[];e:{var k=Ss.get(e);if(k!==void 0){var F=ao,H=e;switch(e){case"keypress":if(Gl(n)===0)break e;case"keydown":case"keyup":F=td;break;case"focusin":H="focus",F=co;break;case"focusout":H="blur",F=co;break;case"beforeblur":case"afterblur":F=co;break;case"click":if(n.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":F=es;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":F=Wc;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":F=ld;break;case zs:case ws:case ks:F=Vc;break;case bs:F=od;break;case"scroll":F=Bc;break;case"wheel":F=sd;break;case"copy":case"cut":case"paste":F=Kc;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":F=ns}var Y=(t&4)!==0,Ve=!Y&&e==="scroll",m=Y?k!==null?k+"Capture":null:k;Y=[];for(var f=x,h;f!==null;){h=f;var _=h.stateNode;if(h.tag===5&&_!==null&&(h=_,m!==null&&(_=Yt(f,m),_!=null&&Y.push(ml(f,_,h)))),Ve)break;f=f.return}0<Y.length&&(k=new F(k,H,null,n,b),C.push({event:k,listeners:Y}))}}if((t&7)===0){e:{if(k=e==="mouseover"||e==="pointerover",F=e==="mouseout"||e==="pointerout",k&&n!==Ft&&(H=n.relatedTarget||n.fromElement)&&(Xn(H)||H[ln]))break e;if((F||k)&&(k=b.window===b?b:(k=b.ownerDocument)?k.defaultView||k.parentWindow:window,F?(H=n.relatedTarget||n.toElement,F=x,H=H?Xn(H):null,H!==null&&(Ve=Xt(H),H!==Ve||H.tag!==5&&H.tag!==6)&&(H=null)):(F=null,H=x),F!==H)){if(Y=es,_="onMouseLeave",m="onMouseEnter",f="mouse",(e==="pointerout"||e==="pointerover")&&(Y=ns,_="onPointerLeave",m="onPointerEnter",f="pointer"),Ve=F==null?k:jr(F),h=H==null?k:jr(H),k=new Y(_,f+"leave",F,n,b),k.target=Ve,k.relatedTarget=h,_=null,Xn(b)===x&&(Y=new Y(m,f+"enter",H,n,b),Y.target=h,Y.relatedTarget=Ve,_=Y),Ve=_,F&&H)t:{for(Y=F,m=H,f=0,h=Y;h;h=br(h))f++;for(h=0,_=m;_;_=br(_))h++;for(;0<f-h;)Y=br(Y),f--;for(;0<h-f;)m=br(m),h--;for(;f--;){if(Y===m||m!==null&&Y===m.alternate)break t;Y=br(Y),m=br(m)}Y=null}else Y=null;F!==null&&_s(C,k,F,Y,!1),H!==null&&Ve!==null&&_s(C,Ve,H,Y,!0)}}e:{if(k=x?jr(x):window,F=k.nodeName&&k.nodeName.toLowerCase(),F==="select"||F==="input"&&k.type==="file")var K=md;else if(ss(k))if(cs)K=xd;else{K=vd;var te=hd}else(F=k.nodeName)&&F.toLowerCase()==="input"&&(k.type==="checkbox"||k.type==="radio")&&(K=yd);if(K&&(K=K(e,x))){us(C,K,n,b);break e}te&&te(e,k,x),e==="focusout"&&(te=k._wrapperState)&&te.controlled&&k.type==="number"&&mn(k,"number",k.value)}switch(te=x?jr(x):window,e){case"focusin":(ss(te)||te.contentEditable==="true")&&(wr=te,vo=x,pl=null);break;case"focusout":pl=vo=wr=null;break;case"mousedown":yo=!0;break;case"contextmenu":case"mouseup":case"dragend":yo=!1,ys(C,n,b);break;case"selectionchange":if(kd)break;case"keydown":case"keyup":ys(C,n,b)}var ne;if(fo)e:{switch(e){case"compositionstart":var oe="onCompositionStart";break e;case"compositionend":oe="onCompositionEnd";break e;case"compositionupdate":oe="onCompositionUpdate";break e}oe=void 0}else zr?os(e,n)&&(oe="onCompositionEnd"):e==="keydown"&&n.keyCode===229&&(oe="onCompositionStart");oe&&(rs&&n.locale!=="ko"&&(zr||oe!=="onCompositionStart"?oe==="onCompositionEnd"&&zr&&(ne=Za()):(Cn=b,oo="value"in Cn?Cn.value:Cn.textContent,zr=!0)),te=ri(x,oe),0<te.length&&(oe=new ts(oe,e,null,n,b),C.push({event:oe,listeners:te}),ne?oe.data=ne:(ne=as(n),ne!==null&&(oe.data=ne)))),(ne=cd?dd(e,n):pd(e,n))&&(x=ri(x,"onBeforeInput"),0<x.length&&(b=new ts("onBeforeInput","beforeinput",null,n,b),C.push({event:b,listeners:x}),b.data=ne))}Ns(C,t)})}function ml(e,t,n){return{instance:e,listener:t,currentTarget:n}}function ri(e,t){for(var n=t+"Capture",r=[];e!==null;){var l=e,i=l.stateNode;l.tag===5&&i!==null&&(l=i,i=Yt(e,n),i!=null&&r.unshift(ml(e,i,l)),i=Yt(e,t),i!=null&&r.push(ml(e,i,l))),e=e.return}return r}function br(e){if(e===null)return null;do e=e.return;while(e&&e.tag!==5);return e||null}function _s(e,t,n,r,l){for(var i=t._reactName,a=[];n!==null&&n!==r;){var d=n,p=d.alternate,x=d.stateNode;if(p!==null&&p===r)break;d.tag===5&&x!==null&&(d=x,l?(p=Yt(n,i),p!=null&&a.unshift(ml(n,p,d))):l||(p=Yt(n,i),p!=null&&a.push(ml(n,p,d)))),n=n.return}a.length!==0&&e.push({event:t,listeners:a})}var Cd=/\r\n?/g,Nd=/\u0000|\uFFFD/g;function Ps(e){return(typeof e=="string"?e:""+e).replace(Cd,`
`).replace(Nd,"")}function li(e,t,n){if(t=Ps(t),Ps(e)!==t&&n)throw Error(c(425))}function ii(){}var So=null,jo=null;function Co(e,t){return e==="textarea"||e==="noscript"||typeof t.children=="string"||typeof t.children=="number"||typeof t.dangerouslySetInnerHTML=="object"&&t.dangerouslySetInnerHTML!==null&&t.dangerouslySetInnerHTML.__html!=null}var No=typeof setTimeout=="function"?setTimeout:void 0,Ed=typeof clearTimeout=="function"?clearTimeout:void 0,Ts=typeof Promise=="function"?Promise:void 0,_d=typeof queueMicrotask=="function"?queueMicrotask:typeof Ts<"u"?function(e){return Ts.resolve(null).then(e).catch(Pd)}:No;function Pd(e){setTimeout(function(){throw e})}function Eo(e,t){var n=t,r=0;do{var l=n.nextSibling;if(e.removeChild(n),l&&l.nodeType===8)if(n=l.data,n==="/$"){if(r===0){e.removeChild(l),il(t);return}r--}else n!=="$"&&n!=="$?"&&n!=="$!"||r++;n=l}while(n);il(t)}function En(e){for(;e!=null;e=e.nextSibling){var t=e.nodeType;if(t===1||t===3)break;if(t===8){if(t=e.data,t==="$"||t==="$!"||t==="$?")break;if(t==="/$")return null}}return e}function Ls(e){e=e.previousSibling;for(var t=0;e;){if(e.nodeType===8){var n=e.data;if(n==="$"||n==="$!"||n==="$?"){if(t===0)return e;t--}else n==="/$"&&t++}e=e.previousSibling}return null}var Sr=Math.random().toString(36).slice(2),qt="__reactFiber$"+Sr,hl="__reactProps$"+Sr,ln="__reactContainer$"+Sr,_o="__reactEvents$"+Sr,Td="__reactListeners$"+Sr,Ld="__reactHandles$"+Sr;function Xn(e){var t=e[qt];if(t)return t;for(var n=e.parentNode;n;){if(t=n[ln]||n[qt]){if(n=t.alternate,t.child!==null||n!==null&&n.child!==null)for(e=Ls(e);e!==null;){if(n=e[qt])return n;e=Ls(e)}return t}e=n,n=e.parentNode}return null}function vl(e){return e=e[qt]||e[ln],!e||e.tag!==5&&e.tag!==6&&e.tag!==13&&e.tag!==3?null:e}function jr(e){if(e.tag===5||e.tag===6)return e.stateNode;throw Error(c(33))}function oi(e){return e[hl]||null}var Po=[],Cr=-1;function _n(e){return{current:e}}function Oe(e){0>Cr||(e.current=Po[Cr],Po[Cr]=null,Cr--)}function Re(e,t){Cr++,Po[Cr]=e.current,e.current=t}var Pn={},ot=_n(Pn),ft=_n(!1),Gn=Pn;function Nr(e,t){var n=e.type.contextTypes;if(!n)return Pn;var r=e.stateNode;if(r&&r.__reactInternalMemoizedUnmaskedChildContext===t)return r.__reactInternalMemoizedMaskedChildContext;var l={},i;for(i in n)l[i]=t[i];return r&&(e=e.stateNode,e.__reactInternalMemoizedUnmaskedChildContext=t,e.__reactInternalMemoizedMaskedChildContext=l),l}function gt(e){return e=e.childContextTypes,e!=null}function ai(){Oe(ft),Oe(ot)}function Rs(e,t,n){if(ot.current!==Pn)throw Error(c(168));Re(ot,t),Re(ft,n)}function Is(e,t,n){var r=e.stateNode;if(t=t.childContextTypes,typeof r.getChildContext!="function")return n;r=r.getChildContext();for(var l in r)if(!(l in t))throw Error(c(108,je(e)||"Unknown",l));return M({},n,r)}function si(e){return e=(e=e.stateNode)&&e.__reactInternalMemoizedMergedChildContext||Pn,Gn=ot.current,Re(ot,e),Re(ft,ft.current),!0}function Ms(e,t,n){var r=e.stateNode;if(!r)throw Error(c(169));n?(e=Is(e,t,Gn),r.__reactInternalMemoizedMergedChildContext=e,Oe(ft),Oe(ot),Re(ot,e)):Oe(ft),Re(ft,n)}var on=null,ui=!1,To=!1;function Os(e){on===null?on=[e]:on.push(e)}function Rd(e){ui=!0,Os(e)}function Tn(){if(!To&&on!==null){To=!0;var e=0,t=A;try{var n=on;for(A=1;e<n.length;e++){var r=n[e];do r=r(!0);while(r!==null)}on=null,ui=!1}catch(l){throw on!==null&&(on=on.slice(e+1)),Al(qr,Tn),l}finally{A=t,To=!1}}return null}var Er=[],_r=0,ci=null,di=0,Pt=[],Tt=0,qn=null,an=1,sn="";function Zn(e,t){Er[_r++]=di,Er[_r++]=ci,ci=e,di=t}function Ds(e,t,n){Pt[Tt++]=an,Pt[Tt++]=sn,Pt[Tt++]=qn,qn=e;var r=an;e=sn;var l=32-s(r)-1;r&=~(1<<l),n+=1;var i=32-s(t)+l;if(30<i){var a=l-l%5;i=(r&(1<<a)-1).toString(32),r>>=a,l-=a,an=1<<32-s(t)+l|n<<l|r,sn=i+e}else an=1<<i|n<<l|r,sn=e}function Lo(e){e.return!==null&&(Zn(e,1),Ds(e,1,0))}function Ro(e){for(;e===ci;)ci=Er[--_r],Er[_r]=null,di=Er[--_r],Er[_r]=null;for(;e===qn;)qn=Pt[--Tt],Pt[Tt]=null,sn=Pt[--Tt],Pt[Tt]=null,an=Pt[--Tt],Pt[Tt]=null}var St=null,jt=null,Fe=!1,At=null;function Fs(e,t){var n=Mt(5,null,null,0);n.elementType="DELETED",n.stateNode=t,n.return=e,t=e.deletions,t===null?(e.deletions=[n],e.flags|=16):t.push(n)}function $s(e,t){switch(e.tag){case 5:var n=e.type;return t=t.nodeType!==1||n.toLowerCase()!==t.nodeName.toLowerCase()?null:t,t!==null?(e.stateNode=t,St=e,jt=En(t.firstChild),!0):!1;case 6:return t=e.pendingProps===""||t.nodeType!==3?null:t,t!==null?(e.stateNode=t,St=e,jt=null,!0):!1;case 13:return t=t.nodeType!==8?null:t,t!==null?(n=qn!==null?{id:an,overflow:sn}:null,e.memoizedState={dehydrated:t,treeContext:n,retryLane:1073741824},n=Mt(18,null,null,0),n.stateNode=t,n.return=e,e.child=n,St=e,jt=null,!0):!1;default:return!1}}function Io(e){return(e.mode&1)!==0&&(e.flags&128)===0}function Mo(e){if(Fe){var t=jt;if(t){var n=t;if(!$s(e,t)){if(Io(e))throw Error(c(418));t=En(n.nextSibling);var r=St;t&&$s(e,t)?Fs(r,n):(e.flags=e.flags&-4097|2,Fe=!1,St=e)}}else{if(Io(e))throw Error(c(418));e.flags=e.flags&-4097|2,Fe=!1,St=e}}}function As(e){for(e=e.return;e!==null&&e.tag!==5&&e.tag!==3&&e.tag!==13;)e=e.return;St=e}function pi(e){if(e!==St)return!1;if(!Fe)return As(e),Fe=!0,!1;var t;if((t=e.tag!==3)&&!(t=e.tag!==5)&&(t=e.type,t=t!=="head"&&t!=="body"&&!Co(e.type,e.memoizedProps)),t&&(t=jt)){if(Io(e))throw Bs(),Error(c(418));for(;t;)Fs(e,t),t=En(t.nextSibling)}if(As(e),e.tag===13){if(e=e.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(c(317));e:{for(e=e.nextSibling,t=0;e;){if(e.nodeType===8){var n=e.data;if(n==="/$"){if(t===0){jt=En(e.nextSibling);break e}t--}else n!=="$"&&n!=="$!"&&n!=="$?"||t++}e=e.nextSibling}jt=null}}else jt=St?En(e.stateNode.nextSibling):null;return!0}function Bs(){for(var e=jt;e;)e=En(e.nextSibling)}function Pr(){jt=St=null,Fe=!1}function Oo(e){At===null?At=[e]:At.push(e)}var Id=pe.ReactCurrentBatchConfig;function yl(e,t,n){if(e=n.ref,e!==null&&typeof e!="function"&&typeof e!="object"){if(n._owner){if(n=n._owner,n){if(n.tag!==1)throw Error(c(309));var r=n.stateNode}if(!r)throw Error(c(147,e));var l=r,i=""+e;return t!==null&&t.ref!==null&&typeof t.ref=="function"&&t.ref._stringRef===i?t.ref:(t=function(a){var d=l.refs;a===null?delete d[i]:d[i]=a},t._stringRef=i,t)}if(typeof e!="string")throw Error(c(284));if(!n._owner)throw Error(c(290,e))}return e}function fi(e,t){throw e=Object.prototype.toString.call(t),Error(c(31,e==="[object Object]"?"object with keys {"+Object.keys(t).join(", ")+"}":e))}function Us(e){var t=e._init;return t(e._payload)}function Ws(e){function t(m,f){if(e){var h=m.deletions;h===null?(m.deletions=[f],m.flags|=16):h.push(f)}}function n(m,f){if(!e)return null;for(;f!==null;)t(m,f),f=f.sibling;return null}function r(m,f){for(m=new Map;f!==null;)f.key!==null?m.set(f.key,f):m.set(f.index,f),f=f.sibling;return m}function l(m,f){return m=$n(m,f),m.index=0,m.sibling=null,m}function i(m,f,h){return m.index=h,e?(h=m.alternate,h!==null?(h=h.index,h<f?(m.flags|=2,f):h):(m.flags|=2,f)):(m.flags|=1048576,f)}function a(m){return e&&m.alternate===null&&(m.flags|=2),m}function d(m,f,h,_){return f===null||f.tag!==6?(f=Na(h,m.mode,_),f.return=m,f):(f=l(f,h),f.return=m,f)}function p(m,f,h,_){var K=h.type;return K===ve?b(m,f,h.props.children,_,h.key):f!==null&&(f.elementType===K||typeof K=="object"&&K!==null&&K.$$typeof===j&&Us(K)===f.type)?(_=l(f,h.props),_.ref=yl(m,f,h),_.return=m,_):(_=Di(h.type,h.key,h.props,null,m.mode,_),_.ref=yl(m,f,h),_.return=m,_)}function x(m,f,h,_){return f===null||f.tag!==4||f.stateNode.containerInfo!==h.containerInfo||f.stateNode.implementation!==h.implementation?(f=Ea(h,m.mode,_),f.return=m,f):(f=l(f,h.children||[]),f.return=m,f)}function b(m,f,h,_,K){return f===null||f.tag!==7?(f=or(h,m.mode,_,K),f.return=m,f):(f=l(f,h),f.return=m,f)}function C(m,f,h){if(typeof f=="string"&&f!==""||typeof f=="number")return f=Na(""+f,m.mode,h),f.return=m,f;if(typeof f=="object"&&f!==null){switch(f.$$typeof){case Le:return h=Di(f.type,f.key,f.props,null,m.mode,h),h.ref=yl(m,null,f),h.return=m,h;case Se:return f=Ea(f,m.mode,h),f.return=m,f;case j:var _=f._init;return C(m,_(f._payload),h)}if(Dt(f)||$(f))return f=or(f,m.mode,h,null),f.return=m,f;fi(m,f)}return null}function k(m,f,h,_){var K=f!==null?f.key:null;if(typeof h=="string"&&h!==""||typeof h=="number")return K!==null?null:d(m,f,""+h,_);if(typeof h=="object"&&h!==null){switch(h.$$typeof){case Le:return h.key===K?p(m,f,h,_):null;case Se:return h.key===K?x(m,f,h,_):null;case j:return K=h._init,k(m,f,K(h._payload),_)}if(Dt(h)||$(h))return K!==null?null:b(m,f,h,_,null);fi(m,h)}return null}function F(m,f,h,_,K){if(typeof _=="string"&&_!==""||typeof _=="number")return m=m.get(h)||null,d(f,m,""+_,K);if(typeof _=="object"&&_!==null){switch(_.$$typeof){case Le:return m=m.get(_.key===null?h:_.key)||null,p(f,m,_,K);case Se:return m=m.get(_.key===null?h:_.key)||null,x(f,m,_,K);case j:var te=_._init;return F(m,f,h,te(_._payload),K)}if(Dt(_)||$(_))return m=m.get(h)||null,b(f,m,_,K,null);fi(f,_)}return null}function H(m,f,h,_){for(var K=null,te=null,ne=f,oe=f=0,tt=null;ne!==null&&oe<h.length;oe++){ne.index>oe?(tt=ne,ne=null):tt=ne.sibling;var Ce=k(m,ne,h[oe],_);if(Ce===null){ne===null&&(ne=tt);break}e&&ne&&Ce.alternate===null&&t(m,ne),f=i(Ce,f,oe),te===null?K=Ce:te.sibling=Ce,te=Ce,ne=tt}if(oe===h.length)return n(m,ne),Fe&&Zn(m,oe),K;if(ne===null){for(;oe<h.length;oe++)ne=C(m,h[oe],_),ne!==null&&(f=i(ne,f,oe),te===null?K=ne:te.sibling=ne,te=ne);return Fe&&Zn(m,oe),K}for(ne=r(m,ne);oe<h.length;oe++)tt=F(ne,m,oe,h[oe],_),tt!==null&&(e&&tt.alternate!==null&&ne.delete(tt.key===null?oe:tt.key),f=i(tt,f,oe),te===null?K=tt:te.sibling=tt,te=tt);return e&&ne.forEach(function(An){return t(m,An)}),Fe&&Zn(m,oe),K}function Y(m,f,h,_){var K=$(h);if(typeof K!="function")throw Error(c(150));if(h=K.call(h),h==null)throw Error(c(151));for(var te=K=null,ne=f,oe=f=0,tt=null,Ce=h.next();ne!==null&&!Ce.done;oe++,Ce=h.next()){ne.index>oe?(tt=ne,ne=null):tt=ne.sibling;var An=k(m,ne,Ce.value,_);if(An===null){ne===null&&(ne=tt);break}e&&ne&&An.alternate===null&&t(m,ne),f=i(An,f,oe),te===null?K=An:te.sibling=An,te=An,ne=tt}if(Ce.done)return n(m,ne),Fe&&Zn(m,oe),K;if(ne===null){for(;!Ce.done;oe++,Ce=h.next())Ce=C(m,Ce.value,_),Ce!==null&&(f=i(Ce,f,oe),te===null?K=Ce:te.sibling=Ce,te=Ce);return Fe&&Zn(m,oe),K}for(ne=r(m,ne);!Ce.done;oe++,Ce=h.next())Ce=F(ne,m,oe,Ce.value,_),Ce!==null&&(e&&Ce.alternate!==null&&ne.delete(Ce.key===null?oe:Ce.key),f=i(Ce,f,oe),te===null?K=Ce:te.sibling=Ce,te=Ce);return e&&ne.forEach(function(fp){return t(m,fp)}),Fe&&Zn(m,oe),K}function Ve(m,f,h,_){if(typeof h=="object"&&h!==null&&h.type===ve&&h.key===null&&(h=h.props.children),typeof h=="object"&&h!==null){switch(h.$$typeof){case Le:e:{for(var K=h.key,te=f;te!==null;){if(te.key===K){if(K=h.type,K===ve){if(te.tag===7){n(m,te.sibling),f=l(te,h.props.children),f.return=m,m=f;break e}}else if(te.elementType===K||typeof K=="object"&&K!==null&&K.$$typeof===j&&Us(K)===te.type){n(m,te.sibling),f=l(te,h.props),f.ref=yl(m,te,h),f.return=m,m=f;break e}n(m,te);break}else t(m,te);te=te.sibling}h.type===ve?(f=or(h.props.children,m.mode,_,h.key),f.return=m,m=f):(_=Di(h.type,h.key,h.props,null,m.mode,_),_.ref=yl(m,f,h),_.return=m,m=_)}return a(m);case Se:e:{for(te=h.key;f!==null;){if(f.key===te)if(f.tag===4&&f.stateNode.containerInfo===h.containerInfo&&f.stateNode.implementation===h.implementation){n(m,f.sibling),f=l(f,h.children||[]),f.return=m,m=f;break e}else{n(m,f);break}else t(m,f);f=f.sibling}f=Ea(h,m.mode,_),f.return=m,m=f}return a(m);case j:return te=h._init,Ve(m,f,te(h._payload),_)}if(Dt(h))return H(m,f,h,_);if($(h))return Y(m,f,h,_);fi(m,h)}return typeof h=="string"&&h!==""||typeof h=="number"?(h=""+h,f!==null&&f.tag===6?(n(m,f.sibling),f=l(f,h),f.return=m,m=f):(n(m,f),f=Na(h,m.mode,_),f.return=m,m=f),a(m)):n(m,f)}return Ve}var Tr=Ws(!0),Hs=Ws(!1),gi=_n(null),mi=null,Lr=null,Do=null;function Fo(){Do=Lr=mi=null}function $o(e){var t=gi.current;Oe(gi),e._currentValue=t}function Ao(e,t,n){for(;e!==null;){var r=e.alternate;if((e.childLanes&t)!==t?(e.childLanes|=t,r!==null&&(r.childLanes|=t)):r!==null&&(r.childLanes&t)!==t&&(r.childLanes|=t),e===n)break;e=e.return}}function Rr(e,t){mi=e,Do=Lr=null,e=e.dependencies,e!==null&&e.firstContext!==null&&((e.lanes&t)!==0&&(mt=!0),e.firstContext=null)}function Lt(e){var t=e._currentValue;if(Do!==e)if(e={context:e,memoizedValue:t,next:null},Lr===null){if(mi===null)throw Error(c(308));Lr=e,mi.dependencies={lanes:0,firstContext:e}}else Lr=Lr.next=e;return t}var Jn=null;function Bo(e){Jn===null?Jn=[e]:Jn.push(e)}function Qs(e,t,n,r){var l=t.interleaved;return l===null?(n.next=n,Bo(t)):(n.next=l.next,l.next=n),t.interleaved=n,un(e,r)}function un(e,t){e.lanes|=t;var n=e.alternate;for(n!==null&&(n.lanes|=t),n=e,e=e.return;e!==null;)e.childLanes|=t,n=e.alternate,n!==null&&(n.childLanes|=t),n=e,e=e.return;return n.tag===3?n.stateNode:null}var Ln=!1;function Uo(e){e.updateQueue={baseState:e.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null}}function Vs(e,t){e=e.updateQueue,t.updateQueue===e&&(t.updateQueue={baseState:e.baseState,firstBaseUpdate:e.firstBaseUpdate,lastBaseUpdate:e.lastBaseUpdate,shared:e.shared,effects:e.effects})}function cn(e,t){return{eventTime:e,lane:t,tag:0,payload:null,callback:null,next:null}}function Rn(e,t,n){var r=e.updateQueue;if(r===null)return null;if(r=r.shared,(be&2)!==0){var l=r.pending;return l===null?t.next=t:(t.next=l.next,l.next=t),r.pending=t,un(e,n)}return l=r.interleaved,l===null?(t.next=t,Bo(r)):(t.next=l.next,l.next=t),r.interleaved=t,un(e,n)}function hi(e,t,n){if(t=t.updateQueue,t!==null&&(t=t.shared,(n&4194240)!==0)){var r=t.lanes;r&=e.pendingLanes,n|=r,t.lanes=n,xe(e,n)}}function Ys(e,t){var n=e.updateQueue,r=e.alternate;if(r!==null&&(r=r.updateQueue,n===r)){var l=null,i=null;if(n=n.firstBaseUpdate,n!==null){do{var a={eventTime:n.eventTime,lane:n.lane,tag:n.tag,payload:n.payload,callback:n.callback,next:null};i===null?l=i=a:i=i.next=a,n=n.next}while(n!==null);i===null?l=i=t:i=i.next=t}else l=i=t;n={baseState:r.baseState,firstBaseUpdate:l,lastBaseUpdate:i,shared:r.shared,effects:r.effects},e.updateQueue=n;return}e=n.lastBaseUpdate,e===null?n.firstBaseUpdate=t:e.next=t,n.lastBaseUpdate=t}function vi(e,t,n,r){var l=e.updateQueue;Ln=!1;var i=l.firstBaseUpdate,a=l.lastBaseUpdate,d=l.shared.pending;if(d!==null){l.shared.pending=null;var p=d,x=p.next;p.next=null,a===null?i=x:a.next=x,a=p;var b=e.alternate;b!==null&&(b=b.updateQueue,d=b.lastBaseUpdate,d!==a&&(d===null?b.firstBaseUpdate=x:d.next=x,b.lastBaseUpdate=p))}if(i!==null){var C=l.baseState;a=0,b=x=p=null,d=i;do{var k=d.lane,F=d.eventTime;if((r&k)===k){b!==null&&(b=b.next={eventTime:F,lane:0,tag:d.tag,payload:d.payload,callback:d.callback,next:null});e:{var H=e,Y=d;switch(k=t,F=n,Y.tag){case 1:if(H=Y.payload,typeof H=="function"){C=H.call(F,C,k);break e}C=H;break e;case 3:H.flags=H.flags&-65537|128;case 0:if(H=Y.payload,k=typeof H=="function"?H.call(F,C,k):H,k==null)break e;C=M({},C,k);break e;case 2:Ln=!0}}d.callback!==null&&d.lane!==0&&(e.flags|=64,k=l.effects,k===null?l.effects=[d]:k.push(d))}else F={eventTime:F,lane:k,tag:d.tag,payload:d.payload,callback:d.callback,next:null},b===null?(x=b=F,p=C):b=b.next=F,a|=k;if(d=d.next,d===null){if(d=l.shared.pending,d===null)break;k=d,d=k.next,k.next=null,l.lastBaseUpdate=k,l.shared.pending=null}}while(!0);if(b===null&&(p=C),l.baseState=p,l.firstBaseUpdate=x,l.lastBaseUpdate=b,t=l.shared.interleaved,t!==null){l=t;do a|=l.lane,l=l.next;while(l!==t)}else i===null&&(l.shared.lanes=0);nr|=a,e.lanes=a,e.memoizedState=C}}function Ks(e,t,n){if(e=t.effects,t.effects=null,e!==null)for(t=0;t<e.length;t++){var r=e[t],l=r.callback;if(l!==null){if(r.callback=null,r=n,typeof l!="function")throw Error(c(191,l));l.call(r)}}}var xl={},Zt=_n(xl),zl=_n(xl),wl=_n(xl);function er(e){if(e===xl)throw Error(c(174));return e}function Wo(e,t){switch(Re(wl,t),Re(zl,e),Re(Zt,xl),e=t.nodeType,e){case 9:case 11:t=(t=t.documentElement)?t.namespaceURI:cr(null,"");break;default:e=e===8?t.parentNode:t,t=e.namespaceURI||null,e=e.tagName,t=cr(t,e)}Oe(Zt),Re(Zt,t)}function Ir(){Oe(Zt),Oe(zl),Oe(wl)}function Xs(e){er(wl.current);var t=er(Zt.current),n=cr(t,e.type);t!==n&&(Re(zl,e),Re(Zt,n))}function Ho(e){zl.current===e&&(Oe(Zt),Oe(zl))}var We=_n(0);function yi(e){for(var t=e;t!==null;){if(t.tag===13){var n=t.memoizedState;if(n!==null&&(n=n.dehydrated,n===null||n.data==="$?"||n.data==="$!"))return t}else if(t.tag===19&&t.memoizedProps.revealOrder!==void 0){if((t.flags&128)!==0)return t}else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return null;t=t.return}t.sibling.return=t.return,t=t.sibling}return null}var Qo=[];function Vo(){for(var e=0;e<Qo.length;e++)Qo[e]._workInProgressVersionPrimary=null;Qo.length=0}var xi=pe.ReactCurrentDispatcher,Yo=pe.ReactCurrentBatchConfig,tr=0,He=null,qe=null,Je=null,zi=!1,kl=!1,bl=0,Md=0;function at(){throw Error(c(321))}function Ko(e,t){if(t===null)return!1;for(var n=0;n<t.length&&n<e.length;n++)if(!$t(e[n],t[n]))return!1;return!0}function Xo(e,t,n,r,l,i){if(tr=i,He=t,t.memoizedState=null,t.updateQueue=null,t.lanes=0,xi.current=e===null||e.memoizedState===null?$d:Ad,e=n(r,l),kl){i=0;do{if(kl=!1,bl=0,25<=i)throw Error(c(301));i+=1,Je=qe=null,t.updateQueue=null,xi.current=Bd,e=n(r,l)}while(kl)}if(xi.current=bi,t=qe!==null&&qe.next!==null,tr=0,Je=qe=He=null,zi=!1,t)throw Error(c(300));return e}function Go(){var e=bl!==0;return bl=0,e}function Jt(){var e={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return Je===null?He.memoizedState=Je=e:Je=Je.next=e,Je}function Rt(){if(qe===null){var e=He.alternate;e=e!==null?e.memoizedState:null}else e=qe.next;var t=Je===null?He.memoizedState:Je.next;if(t!==null)Je=t,qe=e;else{if(e===null)throw Error(c(310));qe=e,e={memoizedState:qe.memoizedState,baseState:qe.baseState,baseQueue:qe.baseQueue,queue:qe.queue,next:null},Je===null?He.memoizedState=Je=e:Je=Je.next=e}return Je}function Sl(e,t){return typeof t=="function"?t(e):t}function qo(e){var t=Rt(),n=t.queue;if(n===null)throw Error(c(311));n.lastRenderedReducer=e;var r=qe,l=r.baseQueue,i=n.pending;if(i!==null){if(l!==null){var a=l.next;l.next=i.next,i.next=a}r.baseQueue=l=i,n.pending=null}if(l!==null){i=l.next,r=r.baseState;var d=a=null,p=null,x=i;do{var b=x.lane;if((tr&b)===b)p!==null&&(p=p.next={lane:0,action:x.action,hasEagerState:x.hasEagerState,eagerState:x.eagerState,next:null}),r=x.hasEagerState?x.eagerState:e(r,x.action);else{var C={lane:b,action:x.action,hasEagerState:x.hasEagerState,eagerState:x.eagerState,next:null};p===null?(d=p=C,a=r):p=p.next=C,He.lanes|=b,nr|=b}x=x.next}while(x!==null&&x!==i);p===null?a=r:p.next=d,$t(r,t.memoizedState)||(mt=!0),t.memoizedState=r,t.baseState=a,t.baseQueue=p,n.lastRenderedState=r}if(e=n.interleaved,e!==null){l=e;do i=l.lane,He.lanes|=i,nr|=i,l=l.next;while(l!==e)}else l===null&&(n.lanes=0);return[t.memoizedState,n.dispatch]}function Zo(e){var t=Rt(),n=t.queue;if(n===null)throw Error(c(311));n.lastRenderedReducer=e;var r=n.dispatch,l=n.pending,i=t.memoizedState;if(l!==null){n.pending=null;var a=l=l.next;do i=e(i,a.action),a=a.next;while(a!==l);$t(i,t.memoizedState)||(mt=!0),t.memoizedState=i,t.baseQueue===null&&(t.baseState=i),n.lastRenderedState=i}return[i,r]}function Gs(){}function qs(e,t){var n=He,r=Rt(),l=t(),i=!$t(r.memoizedState,l);if(i&&(r.memoizedState=l,mt=!0),r=r.queue,Jo(eu.bind(null,n,r,e),[e]),r.getSnapshot!==t||i||Je!==null&&Je.memoizedState.tag&1){if(n.flags|=2048,jl(9,Js.bind(null,n,r,l,t),void 0,null),et===null)throw Error(c(349));(tr&30)!==0||Zs(n,t,l)}return l}function Zs(e,t,n){e.flags|=16384,e={getSnapshot:t,value:n},t=He.updateQueue,t===null?(t={lastEffect:null,stores:null},He.updateQueue=t,t.stores=[e]):(n=t.stores,n===null?t.stores=[e]:n.push(e))}function Js(e,t,n,r){t.value=n,t.getSnapshot=r,tu(t)&&nu(e)}function eu(e,t,n){return n(function(){tu(t)&&nu(e)})}function tu(e){var t=e.getSnapshot;e=e.value;try{var n=t();return!$t(e,n)}catch{return!0}}function nu(e){var t=un(e,1);t!==null&&Ht(t,e,1,-1)}function ru(e){var t=Jt();return typeof e=="function"&&(e=e()),t.memoizedState=t.baseState=e,e={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:Sl,lastRenderedState:e},t.queue=e,e=e.dispatch=Fd.bind(null,He,e),[t.memoizedState,e]}function jl(e,t,n,r){return e={tag:e,create:t,destroy:n,deps:r,next:null},t=He.updateQueue,t===null?(t={lastEffect:null,stores:null},He.updateQueue=t,t.lastEffect=e.next=e):(n=t.lastEffect,n===null?t.lastEffect=e.next=e:(r=n.next,n.next=e,e.next=r,t.lastEffect=e)),e}function lu(){return Rt().memoizedState}function wi(e,t,n,r){var l=Jt();He.flags|=e,l.memoizedState=jl(1|t,n,void 0,r===void 0?null:r)}function ki(e,t,n,r){var l=Rt();r=r===void 0?null:r;var i=void 0;if(qe!==null){var a=qe.memoizedState;if(i=a.destroy,r!==null&&Ko(r,a.deps)){l.memoizedState=jl(t,n,i,r);return}}He.flags|=e,l.memoizedState=jl(1|t,n,i,r)}function iu(e,t){return wi(8390656,8,e,t)}function Jo(e,t){return ki(2048,8,e,t)}function ou(e,t){return ki(4,2,e,t)}function au(e,t){return ki(4,4,e,t)}function su(e,t){if(typeof t=="function")return e=e(),t(e),function(){t(null)};if(t!=null)return e=e(),t.current=e,function(){t.current=null}}function uu(e,t,n){return n=n!=null?n.concat([e]):null,ki(4,4,su.bind(null,t,e),n)}function ea(){}function cu(e,t){var n=Rt();t=t===void 0?null:t;var r=n.memoizedState;return r!==null&&t!==null&&Ko(t,r[1])?r[0]:(n.memoizedState=[e,t],e)}function du(e,t){var n=Rt();t=t===void 0?null:t;var r=n.memoizedState;return r!==null&&t!==null&&Ko(t,r[1])?r[0]:(e=e(),n.memoizedState=[e,t],e)}function pu(e,t,n){return(tr&21)===0?(e.baseState&&(e.baseState=!1,mt=!0),e.memoizedState=n):($t(n,t)||(n=it(),He.lanes|=n,nr|=n,e.baseState=!0),t)}function Od(e,t){var n=A;A=n!==0&&4>n?n:4,e(!0);var r=Yo.transition;Yo.transition={};try{e(!1),t()}finally{A=n,Yo.transition=r}}function fu(){return Rt().memoizedState}function Dd(e,t,n){var r=Dn(e);if(n={lane:r,action:n,hasEagerState:!1,eagerState:null,next:null},gu(e))mu(t,n);else if(n=Qs(e,t,n,r),n!==null){var l=pt();Ht(n,e,r,l),hu(n,t,r)}}function Fd(e,t,n){var r=Dn(e),l={lane:r,action:n,hasEagerState:!1,eagerState:null,next:null};if(gu(e))mu(t,l);else{var i=e.alternate;if(e.lanes===0&&(i===null||i.lanes===0)&&(i=t.lastRenderedReducer,i!==null))try{var a=t.lastRenderedState,d=i(a,n);if(l.hasEagerState=!0,l.eagerState=d,$t(d,a)){var p=t.interleaved;p===null?(l.next=l,Bo(t)):(l.next=p.next,p.next=l),t.interleaved=l;return}}catch{}finally{}n=Qs(e,t,l,r),n!==null&&(l=pt(),Ht(n,e,r,l),hu(n,t,r))}}function gu(e){var t=e.alternate;return e===He||t!==null&&t===He}function mu(e,t){kl=zi=!0;var n=e.pending;n===null?t.next=t:(t.next=n.next,n.next=t),e.pending=t}function hu(e,t,n){if((n&4194240)!==0){var r=t.lanes;r&=e.pendingLanes,n|=r,t.lanes=n,xe(e,n)}}var bi={readContext:Lt,useCallback:at,useContext:at,useEffect:at,useImperativeHandle:at,useInsertionEffect:at,useLayoutEffect:at,useMemo:at,useReducer:at,useRef:at,useState:at,useDebugValue:at,useDeferredValue:at,useTransition:at,useMutableSource:at,useSyncExternalStore:at,useId:at,unstable_isNewReconciler:!1},$d={readContext:Lt,useCallback:function(e,t){return Jt().memoizedState=[e,t===void 0?null:t],e},useContext:Lt,useEffect:iu,useImperativeHandle:function(e,t,n){return n=n!=null?n.concat([e]):null,wi(4194308,4,su.bind(null,t,e),n)},useLayoutEffect:function(e,t){return wi(4194308,4,e,t)},useInsertionEffect:function(e,t){return wi(4,2,e,t)},useMemo:function(e,t){var n=Jt();return t=t===void 0?null:t,e=e(),n.memoizedState=[e,t],e},useReducer:function(e,t,n){var r=Jt();return t=n!==void 0?n(t):t,r.memoizedState=r.baseState=t,e={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:e,lastRenderedState:t},r.queue=e,e=e.dispatch=Dd.bind(null,He,e),[r.memoizedState,e]},useRef:function(e){var t=Jt();return e={current:e},t.memoizedState=e},useState:ru,useDebugValue:ea,useDeferredValue:function(e){return Jt().memoizedState=e},useTransition:function(){var e=ru(!1),t=e[0];return e=Od.bind(null,e[1]),Jt().memoizedState=e,[t,e]},useMutableSource:function(){},useSyncExternalStore:function(e,t,n){var r=He,l=Jt();if(Fe){if(n===void 0)throw Error(c(407));n=n()}else{if(n=t(),et===null)throw Error(c(349));(tr&30)!==0||Zs(r,t,n)}l.memoizedState=n;var i={value:n,getSnapshot:t};return l.queue=i,iu(eu.bind(null,r,i,e),[e]),r.flags|=2048,jl(9,Js.bind(null,r,i,n,t),void 0,null),n},useId:function(){var e=Jt(),t=et.identifierPrefix;if(Fe){var n=sn,r=an;n=(r&~(1<<32-s(r)-1)).toString(32)+n,t=":"+t+"R"+n,n=bl++,0<n&&(t+="H"+n.toString(32)),t+=":"}else n=Md++,t=":"+t+"r"+n.toString(32)+":";return e.memoizedState=t},unstable_isNewReconciler:!1},Ad={readContext:Lt,useCallback:cu,useContext:Lt,useEffect:Jo,useImperativeHandle:uu,useInsertionEffect:ou,useLayoutEffect:au,useMemo:du,useReducer:qo,useRef:lu,useState:function(){return qo(Sl)},useDebugValue:ea,useDeferredValue:function(e){var t=Rt();return pu(t,qe.memoizedState,e)},useTransition:function(){var e=qo(Sl)[0],t=Rt().memoizedState;return[e,t]},useMutableSource:Gs,useSyncExternalStore:qs,useId:fu,unstable_isNewReconciler:!1},Bd={readContext:Lt,useCallback:cu,useContext:Lt,useEffect:Jo,useImperativeHandle:uu,useInsertionEffect:ou,useLayoutEffect:au,useMemo:du,useReducer:Zo,useRef:lu,useState:function(){return Zo(Sl)},useDebugValue:ea,useDeferredValue:function(e){var t=Rt();return qe===null?t.memoizedState=e:pu(t,qe.memoizedState,e)},useTransition:function(){var e=Zo(Sl)[0],t=Rt().memoizedState;return[e,t]},useMutableSource:Gs,useSyncExternalStore:qs,useId:fu,unstable_isNewReconciler:!1};function Bt(e,t){if(e&&e.defaultProps){t=M({},t),e=e.defaultProps;for(var n in e)t[n]===void 0&&(t[n]=e[n]);return t}return t}function ta(e,t,n,r){t=e.memoizedState,n=n(r,t),n=n==null?t:M({},t,n),e.memoizedState=n,e.lanes===0&&(e.updateQueue.baseState=n)}var Si={isMounted:function(e){return(e=e._reactInternals)?Xt(e)===e:!1},enqueueSetState:function(e,t,n){e=e._reactInternals;var r=pt(),l=Dn(e),i=cn(r,l);i.payload=t,n!=null&&(i.callback=n),t=Rn(e,i,l),t!==null&&(Ht(t,e,l,r),hi(t,e,l))},enqueueReplaceState:function(e,t,n){e=e._reactInternals;var r=pt(),l=Dn(e),i=cn(r,l);i.tag=1,i.payload=t,n!=null&&(i.callback=n),t=Rn(e,i,l),t!==null&&(Ht(t,e,l,r),hi(t,e,l))},enqueueForceUpdate:function(e,t){e=e._reactInternals;var n=pt(),r=Dn(e),l=cn(n,r);l.tag=2,t!=null&&(l.callback=t),t=Rn(e,l,r),t!==null&&(Ht(t,e,r,n),hi(t,e,r))}};function vu(e,t,n,r,l,i,a){return e=e.stateNode,typeof e.shouldComponentUpdate=="function"?e.shouldComponentUpdate(r,i,a):t.prototype&&t.prototype.isPureReactComponent?!dl(n,r)||!dl(l,i):!0}function yu(e,t,n){var r=!1,l=Pn,i=t.contextType;return typeof i=="object"&&i!==null?i=Lt(i):(l=gt(t)?Gn:ot.current,r=t.contextTypes,i=(r=r!=null)?Nr(e,l):Pn),t=new t(n,i),e.memoizedState=t.state!==null&&t.state!==void 0?t.state:null,t.updater=Si,e.stateNode=t,t._reactInternals=e,r&&(e=e.stateNode,e.__reactInternalMemoizedUnmaskedChildContext=l,e.__reactInternalMemoizedMaskedChildContext=i),t}function xu(e,t,n,r){e=t.state,typeof t.componentWillReceiveProps=="function"&&t.componentWillReceiveProps(n,r),typeof t.UNSAFE_componentWillReceiveProps=="function"&&t.UNSAFE_componentWillReceiveProps(n,r),t.state!==e&&Si.enqueueReplaceState(t,t.state,null)}function na(e,t,n,r){var l=e.stateNode;l.props=n,l.state=e.memoizedState,l.refs={},Uo(e);var i=t.contextType;typeof i=="object"&&i!==null?l.context=Lt(i):(i=gt(t)?Gn:ot.current,l.context=Nr(e,i)),l.state=e.memoizedState,i=t.getDerivedStateFromProps,typeof i=="function"&&(ta(e,t,i,n),l.state=e.memoizedState),typeof t.getDerivedStateFromProps=="function"||typeof l.getSnapshotBeforeUpdate=="function"||typeof l.UNSAFE_componentWillMount!="function"&&typeof l.componentWillMount!="function"||(t=l.state,typeof l.componentWillMount=="function"&&l.componentWillMount(),typeof l.UNSAFE_componentWillMount=="function"&&l.UNSAFE_componentWillMount(),t!==l.state&&Si.enqueueReplaceState(l,l.state,null),vi(e,n,l,r),l.state=e.memoizedState),typeof l.componentDidMount=="function"&&(e.flags|=4194308)}function Mr(e,t){try{var n="",r=t;do n+=he(r),r=r.return;while(r);var l=n}catch(i){l=`
Error generating stack: `+i.message+`
`+i.stack}return{value:e,source:t,stack:l,digest:null}}function ra(e,t,n){return{value:e,source:null,stack:n??null,digest:t??null}}function la(e,t){try{console.error(t.value)}catch(n){setTimeout(function(){throw n})}}var Ud=typeof WeakMap=="function"?WeakMap:Map;function zu(e,t,n){n=cn(-1,n),n.tag=3,n.payload={element:null};var r=t.value;return n.callback=function(){Ti||(Ti=!0,xa=r),la(e,t)},n}function wu(e,t,n){n=cn(-1,n),n.tag=3;var r=e.type.getDerivedStateFromError;if(typeof r=="function"){var l=t.value;n.payload=function(){return r(l)},n.callback=function(){la(e,t)}}var i=e.stateNode;return i!==null&&typeof i.componentDidCatch=="function"&&(n.callback=function(){la(e,t),typeof r!="function"&&(Mn===null?Mn=new Set([this]):Mn.add(this));var a=t.stack;this.componentDidCatch(t.value,{componentStack:a!==null?a:""})}),n}function ku(e,t,n){var r=e.pingCache;if(r===null){r=e.pingCache=new Ud;var l=new Set;r.set(t,l)}else l=r.get(t),l===void 0&&(l=new Set,r.set(t,l));l.has(n)||(l.add(n),e=np.bind(null,e,t,n),t.then(e,e))}function bu(e){do{var t;if((t=e.tag===13)&&(t=e.memoizedState,t=t!==null?t.dehydrated!==null:!0),t)return e;e=e.return}while(e!==null);return null}function Su(e,t,n,r,l){return(e.mode&1)===0?(e===t?e.flags|=65536:(e.flags|=128,n.flags|=131072,n.flags&=-52805,n.tag===1&&(n.alternate===null?n.tag=17:(t=cn(-1,1),t.tag=2,Rn(n,t,1))),n.lanes|=1),e):(e.flags|=65536,e.lanes=l,e)}var Wd=pe.ReactCurrentOwner,mt=!1;function dt(e,t,n,r){t.child=e===null?Hs(t,null,n,r):Tr(t,e.child,n,r)}function ju(e,t,n,r,l){n=n.render;var i=t.ref;return Rr(t,l),r=Xo(e,t,n,r,i,l),n=Go(),e!==null&&!mt?(t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~l,dn(e,t,l)):(Fe&&n&&Lo(t),t.flags|=1,dt(e,t,r,l),t.child)}function Cu(e,t,n,r,l){if(e===null){var i=n.type;return typeof i=="function"&&!Ca(i)&&i.defaultProps===void 0&&n.compare===null&&n.defaultProps===void 0?(t.tag=15,t.type=i,Nu(e,t,i,r,l)):(e=Di(n.type,null,r,t,t.mode,l),e.ref=t.ref,e.return=t,t.child=e)}if(i=e.child,(e.lanes&l)===0){var a=i.memoizedProps;if(n=n.compare,n=n!==null?n:dl,n(a,r)&&e.ref===t.ref)return dn(e,t,l)}return t.flags|=1,e=$n(i,r),e.ref=t.ref,e.return=t,t.child=e}function Nu(e,t,n,r,l){if(e!==null){var i=e.memoizedProps;if(dl(i,r)&&e.ref===t.ref)if(mt=!1,t.pendingProps=r=i,(e.lanes&l)!==0)(e.flags&131072)!==0&&(mt=!0);else return t.lanes=e.lanes,dn(e,t,l)}return ia(e,t,n,r,l)}function Eu(e,t,n){var r=t.pendingProps,l=r.children,i=e!==null?e.memoizedState:null;if(r.mode==="hidden")if((t.mode&1)===0)t.memoizedState={baseLanes:0,cachePool:null,transitions:null},Re(Dr,Ct),Ct|=n;else{if((n&1073741824)===0)return e=i!==null?i.baseLanes|n:n,t.lanes=t.childLanes=1073741824,t.memoizedState={baseLanes:e,cachePool:null,transitions:null},t.updateQueue=null,Re(Dr,Ct),Ct|=e,null;t.memoizedState={baseLanes:0,cachePool:null,transitions:null},r=i!==null?i.baseLanes:n,Re(Dr,Ct),Ct|=r}else i!==null?(r=i.baseLanes|n,t.memoizedState=null):r=n,Re(Dr,Ct),Ct|=r;return dt(e,t,l,n),t.child}function _u(e,t){var n=t.ref;(e===null&&n!==null||e!==null&&e.ref!==n)&&(t.flags|=512,t.flags|=2097152)}function ia(e,t,n,r,l){var i=gt(n)?Gn:ot.current;return i=Nr(t,i),Rr(t,l),n=Xo(e,t,n,r,i,l),r=Go(),e!==null&&!mt?(t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~l,dn(e,t,l)):(Fe&&r&&Lo(t),t.flags|=1,dt(e,t,n,l),t.child)}function Pu(e,t,n,r,l){if(gt(n)){var i=!0;si(t)}else i=!1;if(Rr(t,l),t.stateNode===null)Ci(e,t),yu(t,n,r),na(t,n,r,l),r=!0;else if(e===null){var a=t.stateNode,d=t.memoizedProps;a.props=d;var p=a.context,x=n.contextType;typeof x=="object"&&x!==null?x=Lt(x):(x=gt(n)?Gn:ot.current,x=Nr(t,x));var b=n.getDerivedStateFromProps,C=typeof b=="function"||typeof a.getSnapshotBeforeUpdate=="function";C||typeof a.UNSAFE_componentWillReceiveProps!="function"&&typeof a.componentWillReceiveProps!="function"||(d!==r||p!==x)&&xu(t,a,r,x),Ln=!1;var k=t.memoizedState;a.state=k,vi(t,r,a,l),p=t.memoizedState,d!==r||k!==p||ft.current||Ln?(typeof b=="function"&&(ta(t,n,b,r),p=t.memoizedState),(d=Ln||vu(t,n,d,r,k,p,x))?(C||typeof a.UNSAFE_componentWillMount!="function"&&typeof a.componentWillMount!="function"||(typeof a.componentWillMount=="function"&&a.componentWillMount(),typeof a.UNSAFE_componentWillMount=="function"&&a.UNSAFE_componentWillMount()),typeof a.componentDidMount=="function"&&(t.flags|=4194308)):(typeof a.componentDidMount=="function"&&(t.flags|=4194308),t.memoizedProps=r,t.memoizedState=p),a.props=r,a.state=p,a.context=x,r=d):(typeof a.componentDidMount=="function"&&(t.flags|=4194308),r=!1)}else{a=t.stateNode,Vs(e,t),d=t.memoizedProps,x=t.type===t.elementType?d:Bt(t.type,d),a.props=x,C=t.pendingProps,k=a.context,p=n.contextType,typeof p=="object"&&p!==null?p=Lt(p):(p=gt(n)?Gn:ot.current,p=Nr(t,p));var F=n.getDerivedStateFromProps;(b=typeof F=="function"||typeof a.getSnapshotBeforeUpdate=="function")||typeof a.UNSAFE_componentWillReceiveProps!="function"&&typeof a.componentWillReceiveProps!="function"||(d!==C||k!==p)&&xu(t,a,r,p),Ln=!1,k=t.memoizedState,a.state=k,vi(t,r,a,l);var H=t.memoizedState;d!==C||k!==H||ft.current||Ln?(typeof F=="function"&&(ta(t,n,F,r),H=t.memoizedState),(x=Ln||vu(t,n,x,r,k,H,p)||!1)?(b||typeof a.UNSAFE_componentWillUpdate!="function"&&typeof a.componentWillUpdate!="function"||(typeof a.componentWillUpdate=="function"&&a.componentWillUpdate(r,H,p),typeof a.UNSAFE_componentWillUpdate=="function"&&a.UNSAFE_componentWillUpdate(r,H,p)),typeof a.componentDidUpdate=="function"&&(t.flags|=4),typeof a.getSnapshotBeforeUpdate=="function"&&(t.flags|=1024)):(typeof a.componentDidUpdate!="function"||d===e.memoizedProps&&k===e.memoizedState||(t.flags|=4),typeof a.getSnapshotBeforeUpdate!="function"||d===e.memoizedProps&&k===e.memoizedState||(t.flags|=1024),t.memoizedProps=r,t.memoizedState=H),a.props=r,a.state=H,a.context=p,r=x):(typeof a.componentDidUpdate!="function"||d===e.memoizedProps&&k===e.memoizedState||(t.flags|=4),typeof a.getSnapshotBeforeUpdate!="function"||d===e.memoizedProps&&k===e.memoizedState||(t.flags|=1024),r=!1)}return oa(e,t,n,r,i,l)}function oa(e,t,n,r,l,i){_u(e,t);var a=(t.flags&128)!==0;if(!r&&!a)return l&&Ms(t,n,!1),dn(e,t,i);r=t.stateNode,Wd.current=t;var d=a&&typeof n.getDerivedStateFromError!="function"?null:r.render();return t.flags|=1,e!==null&&a?(t.child=Tr(t,e.child,null,i),t.child=Tr(t,null,d,i)):dt(e,t,d,i),t.memoizedState=r.state,l&&Ms(t,n,!0),t.child}function Tu(e){var t=e.stateNode;t.pendingContext?Rs(e,t.pendingContext,t.pendingContext!==t.context):t.context&&Rs(e,t.context,!1),Wo(e,t.containerInfo)}function Lu(e,t,n,r,l){return Pr(),Oo(l),t.flags|=256,dt(e,t,n,r),t.child}var aa={dehydrated:null,treeContext:null,retryLane:0};function sa(e){return{baseLanes:e,cachePool:null,transitions:null}}function Ru(e,t,n){var r=t.pendingProps,l=We.current,i=!1,a=(t.flags&128)!==0,d;if((d=a)||(d=e!==null&&e.memoizedState===null?!1:(l&2)!==0),d?(i=!0,t.flags&=-129):(e===null||e.memoizedState!==null)&&(l|=1),Re(We,l&1),e===null)return Mo(t),e=t.memoizedState,e!==null&&(e=e.dehydrated,e!==null)?((t.mode&1)===0?t.lanes=1:e.data==="$!"?t.lanes=8:t.lanes=1073741824,null):(a=r.children,e=r.fallback,i?(r=t.mode,i=t.child,a={mode:"hidden",children:a},(r&1)===0&&i!==null?(i.childLanes=0,i.pendingProps=a):i=Fi(a,r,0,null),e=or(e,r,n,null),i.return=t,e.return=t,i.sibling=e,t.child=i,t.child.memoizedState=sa(n),t.memoizedState=aa,e):ua(t,a));if(l=e.memoizedState,l!==null&&(d=l.dehydrated,d!==null))return Hd(e,t,a,r,d,l,n);if(i){i=r.fallback,a=t.mode,l=e.child,d=l.sibling;var p={mode:"hidden",children:r.children};return(a&1)===0&&t.child!==l?(r=t.child,r.childLanes=0,r.pendingProps=p,t.deletions=null):(r=$n(l,p),r.subtreeFlags=l.subtreeFlags&14680064),d!==null?i=$n(d,i):(i=or(i,a,n,null),i.flags|=2),i.return=t,r.return=t,r.sibling=i,t.child=r,r=i,i=t.child,a=e.child.memoizedState,a=a===null?sa(n):{baseLanes:a.baseLanes|n,cachePool:null,transitions:a.transitions},i.memoizedState=a,i.childLanes=e.childLanes&~n,t.memoizedState=aa,r}return i=e.child,e=i.sibling,r=$n(i,{mode:"visible",children:r.children}),(t.mode&1)===0&&(r.lanes=n),r.return=t,r.sibling=null,e!==null&&(n=t.deletions,n===null?(t.deletions=[e],t.flags|=16):n.push(e)),t.child=r,t.memoizedState=null,r}function ua(e,t){return t=Fi({mode:"visible",children:t},e.mode,0,null),t.return=e,e.child=t}function ji(e,t,n,r){return r!==null&&Oo(r),Tr(t,e.child,null,n),e=ua(t,t.pendingProps.children),e.flags|=2,t.memoizedState=null,e}function Hd(e,t,n,r,l,i,a){if(n)return t.flags&256?(t.flags&=-257,r=ra(Error(c(422))),ji(e,t,a,r)):t.memoizedState!==null?(t.child=e.child,t.flags|=128,null):(i=r.fallback,l=t.mode,r=Fi({mode:"visible",children:r.children},l,0,null),i=or(i,l,a,null),i.flags|=2,r.return=t,i.return=t,r.sibling=i,t.child=r,(t.mode&1)!==0&&Tr(t,e.child,null,a),t.child.memoizedState=sa(a),t.memoizedState=aa,i);if((t.mode&1)===0)return ji(e,t,a,null);if(l.data==="$!"){if(r=l.nextSibling&&l.nextSibling.dataset,r)var d=r.dgst;return r=d,i=Error(c(419)),r=ra(i,r,void 0),ji(e,t,a,r)}if(d=(a&e.childLanes)!==0,mt||d){if(r=et,r!==null){switch(a&-a){case 4:l=2;break;case 16:l=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:l=32;break;case 536870912:l=268435456;break;default:l=0}l=(l&(r.suspendedLanes|a))!==0?0:l,l!==0&&l!==i.retryLane&&(i.retryLane=l,un(e,l),Ht(r,e,l,-1))}return ja(),r=ra(Error(c(421))),ji(e,t,a,r)}return l.data==="$?"?(t.flags|=128,t.child=e.child,t=rp.bind(null,e),l._reactRetry=t,null):(e=i.treeContext,jt=En(l.nextSibling),St=t,Fe=!0,At=null,e!==null&&(Pt[Tt++]=an,Pt[Tt++]=sn,Pt[Tt++]=qn,an=e.id,sn=e.overflow,qn=t),t=ua(t,r.children),t.flags|=4096,t)}function Iu(e,t,n){e.lanes|=t;var r=e.alternate;r!==null&&(r.lanes|=t),Ao(e.return,t,n)}function ca(e,t,n,r,l){var i=e.memoizedState;i===null?e.memoizedState={isBackwards:t,rendering:null,renderingStartTime:0,last:r,tail:n,tailMode:l}:(i.isBackwards=t,i.rendering=null,i.renderingStartTime=0,i.last=r,i.tail=n,i.tailMode=l)}function Mu(e,t,n){var r=t.pendingProps,l=r.revealOrder,i=r.tail;if(dt(e,t,r.children,n),r=We.current,(r&2)!==0)r=r&1|2,t.flags|=128;else{if(e!==null&&(e.flags&128)!==0)e:for(e=t.child;e!==null;){if(e.tag===13)e.memoizedState!==null&&Iu(e,n,t);else if(e.tag===19)Iu(e,n,t);else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break e;for(;e.sibling===null;){if(e.return===null||e.return===t)break e;e=e.return}e.sibling.return=e.return,e=e.sibling}r&=1}if(Re(We,r),(t.mode&1)===0)t.memoizedState=null;else switch(l){case"forwards":for(n=t.child,l=null;n!==null;)e=n.alternate,e!==null&&yi(e)===null&&(l=n),n=n.sibling;n=l,n===null?(l=t.child,t.child=null):(l=n.sibling,n.sibling=null),ca(t,!1,l,n,i);break;case"backwards":for(n=null,l=t.child,t.child=null;l!==null;){if(e=l.alternate,e!==null&&yi(e)===null){t.child=l;break}e=l.sibling,l.sibling=n,n=l,l=e}ca(t,!0,n,null,i);break;case"together":ca(t,!1,null,null,void 0);break;default:t.memoizedState=null}return t.child}function Ci(e,t){(t.mode&1)===0&&e!==null&&(e.alternate=null,t.alternate=null,t.flags|=2)}function dn(e,t,n){if(e!==null&&(t.dependencies=e.dependencies),nr|=t.lanes,(n&t.childLanes)===0)return null;if(e!==null&&t.child!==e.child)throw Error(c(153));if(t.child!==null){for(e=t.child,n=$n(e,e.pendingProps),t.child=n,n.return=t;e.sibling!==null;)e=e.sibling,n=n.sibling=$n(e,e.pendingProps),n.return=t;n.sibling=null}return t.child}function Qd(e,t,n){switch(t.tag){case 3:Tu(t),Pr();break;case 5:Xs(t);break;case 1:gt(t.type)&&si(t);break;case 4:Wo(t,t.stateNode.containerInfo);break;case 10:var r=t.type._context,l=t.memoizedProps.value;Re(gi,r._currentValue),r._currentValue=l;break;case 13:if(r=t.memoizedState,r!==null)return r.dehydrated!==null?(Re(We,We.current&1),t.flags|=128,null):(n&t.child.childLanes)!==0?Ru(e,t,n):(Re(We,We.current&1),e=dn(e,t,n),e!==null?e.sibling:null);Re(We,We.current&1);break;case 19:if(r=(n&t.childLanes)!==0,(e.flags&128)!==0){if(r)return Mu(e,t,n);t.flags|=128}if(l=t.memoizedState,l!==null&&(l.rendering=null,l.tail=null,l.lastEffect=null),Re(We,We.current),r)break;return null;case 22:case 23:return t.lanes=0,Eu(e,t,n)}return dn(e,t,n)}var Ou,da,Du,Fu;Ou=function(e,t){for(var n=t.child;n!==null;){if(n.tag===5||n.tag===6)e.appendChild(n.stateNode);else if(n.tag!==4&&n.child!==null){n.child.return=n,n=n.child;continue}if(n===t)break;for(;n.sibling===null;){if(n.return===null||n.return===t)return;n=n.return}n.sibling.return=n.return,n=n.sibling}},da=function(){},Du=function(e,t,n,r){var l=e.memoizedProps;if(l!==r){e=t.stateNode,er(Zt.current);var i=null;switch(n){case"input":l=nn(e,l),r=nn(e,r),i=[];break;case"select":l=M({},l,{value:void 0}),r=M({},r,{value:void 0}),i=[];break;case"textarea":l=Wn(e,l),r=Wn(e,r),i=[];break;default:typeof l.onClick!="function"&&typeof r.onClick=="function"&&(e.onclick=ii)}Vr(n,r);var a;n=null;for(x in l)if(!r.hasOwnProperty(x)&&l.hasOwnProperty(x)&&l[x]!=null)if(x==="style"){var d=l[x];for(a in d)d.hasOwnProperty(a)&&(n||(n={}),n[a]="")}else x!=="dangerouslySetInnerHTML"&&x!=="children"&&x!=="suppressContentEditableWarning"&&x!=="suppressHydrationWarning"&&x!=="autoFocus"&&(E.hasOwnProperty(x)?i||(i=[]):(i=i||[]).push(x,null));for(x in r){var p=r[x];if(d=l!=null?l[x]:void 0,r.hasOwnProperty(x)&&p!==d&&(p!=null||d!=null))if(x==="style")if(d){for(a in d)!d.hasOwnProperty(a)||p&&p.hasOwnProperty(a)||(n||(n={}),n[a]="");for(a in p)p.hasOwnProperty(a)&&d[a]!==p[a]&&(n||(n={}),n[a]=p[a])}else n||(i||(i=[]),i.push(x,n)),n=p;else x==="dangerouslySetInnerHTML"?(p=p?p.__html:void 0,d=d?d.__html:void 0,p!=null&&d!==p&&(i=i||[]).push(x,p)):x==="children"?typeof p!="string"&&typeof p!="number"||(i=i||[]).push(x,""+p):x!=="suppressContentEditableWarning"&&x!=="suppressHydrationWarning"&&(E.hasOwnProperty(x)?(p!=null&&x==="onScroll"&&Me("scroll",e),i||d===p||(i=[])):(i=i||[]).push(x,p))}n&&(i=i||[]).push("style",n);var x=i;(t.updateQueue=x)&&(t.flags|=4)}},Fu=function(e,t,n,r){n!==r&&(t.flags|=4)};function Cl(e,t){if(!Fe)switch(e.tailMode){case"hidden":t=e.tail;for(var n=null;t!==null;)t.alternate!==null&&(n=t),t=t.sibling;n===null?e.tail=null:n.sibling=null;break;case"collapsed":n=e.tail;for(var r=null;n!==null;)n.alternate!==null&&(r=n),n=n.sibling;r===null?t||e.tail===null?e.tail=null:e.tail.sibling=null:r.sibling=null}}function st(e){var t=e.alternate!==null&&e.alternate.child===e.child,n=0,r=0;if(t)for(var l=e.child;l!==null;)n|=l.lanes|l.childLanes,r|=l.subtreeFlags&14680064,r|=l.flags&14680064,l.return=e,l=l.sibling;else for(l=e.child;l!==null;)n|=l.lanes|l.childLanes,r|=l.subtreeFlags,r|=l.flags,l.return=e,l=l.sibling;return e.subtreeFlags|=r,e.childLanes=n,t}function Vd(e,t,n){var r=t.pendingProps;switch(Ro(t),t.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return st(t),null;case 1:return gt(t.type)&&ai(),st(t),null;case 3:return r=t.stateNode,Ir(),Oe(ft),Oe(ot),Vo(),r.pendingContext&&(r.context=r.pendingContext,r.pendingContext=null),(e===null||e.child===null)&&(pi(t)?t.flags|=4:e===null||e.memoizedState.isDehydrated&&(t.flags&256)===0||(t.flags|=1024,At!==null&&(ka(At),At=null))),da(e,t),st(t),null;case 5:Ho(t);var l=er(wl.current);if(n=t.type,e!==null&&t.stateNode!=null)Du(e,t,n,r,l),e.ref!==t.ref&&(t.flags|=512,t.flags|=2097152);else{if(!r){if(t.stateNode===null)throw Error(c(166));return st(t),null}if(e=er(Zt.current),pi(t)){r=t.stateNode,n=t.type;var i=t.memoizedProps;switch(r[qt]=t,r[hl]=i,e=(t.mode&1)!==0,n){case"dialog":Me("cancel",r),Me("close",r);break;case"iframe":case"object":case"embed":Me("load",r);break;case"video":case"audio":for(l=0;l<fl.length;l++)Me(fl[l],r);break;case"source":Me("error",r);break;case"img":case"image":case"link":Me("error",r),Me("load",r);break;case"details":Me("toggle",r);break;case"input":gn(r,i),Me("invalid",r);break;case"select":r._wrapperState={wasMultiple:!!i.multiple},Me("invalid",r);break;case"textarea":Ur(r,i),Me("invalid",r)}Vr(n,i),l=null;for(var a in i)if(i.hasOwnProperty(a)){var d=i[a];a==="children"?typeof d=="string"?r.textContent!==d&&(i.suppressHydrationWarning!==!0&&li(r.textContent,d,e),l=["children",d]):typeof d=="number"&&r.textContent!==""+d&&(i.suppressHydrationWarning!==!0&&li(r.textContent,d,e),l=["children",""+d]):E.hasOwnProperty(a)&&d!=null&&a==="onScroll"&&Me("scroll",r)}switch(n){case"input":Ot(r),Br(r,i,!0);break;case"textarea":Ot(r),Hr(r);break;case"select":case"option":break;default:typeof i.onClick=="function"&&(r.onclick=ii)}r=l,t.updateQueue=r,r!==null&&(t.flags|=4)}else{a=l.nodeType===9?l:l.ownerDocument,e==="http://www.w3.org/1999/xhtml"&&(e=ur(n)),e==="http://www.w3.org/1999/xhtml"?n==="script"?(e=a.createElement("div"),e.innerHTML="<script><\/script>",e=e.removeChild(e.firstChild)):typeof r.is=="string"?e=a.createElement(n,{is:r.is}):(e=a.createElement(n),n==="select"&&(a=e,r.multiple?a.multiple=!0:r.size&&(a.size=r.size))):e=a.createElementNS(e,n),e[qt]=t,e[hl]=r,Ou(e,t,!1,!1),t.stateNode=e;e:{switch(a=hn(n,r),n){case"dialog":Me("cancel",e),Me("close",e),l=r;break;case"iframe":case"object":case"embed":Me("load",e),l=r;break;case"video":case"audio":for(l=0;l<fl.length;l++)Me(fl[l],e);l=r;break;case"source":Me("error",e),l=r;break;case"img":case"image":case"link":Me("error",e),Me("load",e),l=r;break;case"details":Me("toggle",e),l=r;break;case"input":gn(e,r),l=nn(e,r),Me("invalid",e);break;case"option":l=r;break;case"select":e._wrapperState={wasMultiple:!!r.multiple},l=M({},r,{value:void 0}),Me("invalid",e);break;case"textarea":Ur(e,r),l=Wn(e,r),Me("invalid",e);break;default:l=r}Vr(n,l),d=l;for(i in d)if(d.hasOwnProperty(i)){var p=d[i];i==="style"?Vt(e,p):i==="dangerouslySetInnerHTML"?(p=p?p.__html:void 0,p!=null&&dr(e,p)):i==="children"?typeof p=="string"?(n!=="textarea"||p!=="")&&Qt(e,p):typeof p=="number"&&Qt(e,""+p):i!=="suppressContentEditableWarning"&&i!=="suppressHydrationWarning"&&i!=="autoFocus"&&(E.hasOwnProperty(i)?p!=null&&i==="onScroll"&&Me("scroll",e):p!=null&&Pe(e,i,p,a))}switch(n){case"input":Ot(e),Br(e,r,!1);break;case"textarea":Ot(e),Hr(e);break;case"option":r.value!=null&&e.setAttribute("value",""+Ee(r.value));break;case"select":e.multiple=!!r.multiple,i=r.value,i!=null?rn(e,!!r.multiple,i,!1):r.defaultValue!=null&&rn(e,!!r.multiple,r.defaultValue,!0);break;default:typeof l.onClick=="function"&&(e.onclick=ii)}switch(n){case"button":case"input":case"select":case"textarea":r=!!r.autoFocus;break e;case"img":r=!0;break e;default:r=!1}}r&&(t.flags|=4)}t.ref!==null&&(t.flags|=512,t.flags|=2097152)}return st(t),null;case 6:if(e&&t.stateNode!=null)Fu(e,t,e.memoizedProps,r);else{if(typeof r!="string"&&t.stateNode===null)throw Error(c(166));if(n=er(wl.current),er(Zt.current),pi(t)){if(r=t.stateNode,n=t.memoizedProps,r[qt]=t,(i=r.nodeValue!==n)&&(e=St,e!==null))switch(e.tag){case 3:li(r.nodeValue,n,(e.mode&1)!==0);break;case 5:e.memoizedProps.suppressHydrationWarning!==!0&&li(r.nodeValue,n,(e.mode&1)!==0)}i&&(t.flags|=4)}else r=(n.nodeType===9?n:n.ownerDocument).createTextNode(r),r[qt]=t,t.stateNode=r}return st(t),null;case 13:if(Oe(We),r=t.memoizedState,e===null||e.memoizedState!==null&&e.memoizedState.dehydrated!==null){if(Fe&&jt!==null&&(t.mode&1)!==0&&(t.flags&128)===0)Bs(),Pr(),t.flags|=98560,i=!1;else if(i=pi(t),r!==null&&r.dehydrated!==null){if(e===null){if(!i)throw Error(c(318));if(i=t.memoizedState,i=i!==null?i.dehydrated:null,!i)throw Error(c(317));i[qt]=t}else Pr(),(t.flags&128)===0&&(t.memoizedState=null),t.flags|=4;st(t),i=!1}else At!==null&&(ka(At),At=null),i=!0;if(!i)return t.flags&65536?t:null}return(t.flags&128)!==0?(t.lanes=n,t):(r=r!==null,r!==(e!==null&&e.memoizedState!==null)&&r&&(t.child.flags|=8192,(t.mode&1)!==0&&(e===null||(We.current&1)!==0?Ze===0&&(Ze=3):ja())),t.updateQueue!==null&&(t.flags|=4),st(t),null);case 4:return Ir(),da(e,t),e===null&&gl(t.stateNode.containerInfo),st(t),null;case 10:return $o(t.type._context),st(t),null;case 17:return gt(t.type)&&ai(),st(t),null;case 19:if(Oe(We),i=t.memoizedState,i===null)return st(t),null;if(r=(t.flags&128)!==0,a=i.rendering,a===null)if(r)Cl(i,!1);else{if(Ze!==0||e!==null&&(e.flags&128)!==0)for(e=t.child;e!==null;){if(a=yi(e),a!==null){for(t.flags|=128,Cl(i,!1),r=a.updateQueue,r!==null&&(t.updateQueue=r,t.flags|=4),t.subtreeFlags=0,r=n,n=t.child;n!==null;)i=n,e=r,i.flags&=14680066,a=i.alternate,a===null?(i.childLanes=0,i.lanes=e,i.child=null,i.subtreeFlags=0,i.memoizedProps=null,i.memoizedState=null,i.updateQueue=null,i.dependencies=null,i.stateNode=null):(i.childLanes=a.childLanes,i.lanes=a.lanes,i.child=a.child,i.subtreeFlags=0,i.deletions=null,i.memoizedProps=a.memoizedProps,i.memoizedState=a.memoizedState,i.updateQueue=a.updateQueue,i.type=a.type,e=a.dependencies,i.dependencies=e===null?null:{lanes:e.lanes,firstContext:e.firstContext}),n=n.sibling;return Re(We,We.current&1|2),t.child}e=e.sibling}i.tail!==null&&Be()>Fr&&(t.flags|=128,r=!0,Cl(i,!1),t.lanes=4194304)}else{if(!r)if(e=yi(a),e!==null){if(t.flags|=128,r=!0,n=e.updateQueue,n!==null&&(t.updateQueue=n,t.flags|=4),Cl(i,!0),i.tail===null&&i.tailMode==="hidden"&&!a.alternate&&!Fe)return st(t),null}else 2*Be()-i.renderingStartTime>Fr&&n!==1073741824&&(t.flags|=128,r=!0,Cl(i,!1),t.lanes=4194304);i.isBackwards?(a.sibling=t.child,t.child=a):(n=i.last,n!==null?n.sibling=a:t.child=a,i.last=a)}return i.tail!==null?(t=i.tail,i.rendering=t,i.tail=t.sibling,i.renderingStartTime=Be(),t.sibling=null,n=We.current,Re(We,r?n&1|2:n&1),t):(st(t),null);case 22:case 23:return Sa(),r=t.memoizedState!==null,e!==null&&e.memoizedState!==null!==r&&(t.flags|=8192),r&&(t.mode&1)!==0?(Ct&1073741824)!==0&&(st(t),t.subtreeFlags&6&&(t.flags|=8192)):st(t),null;case 24:return null;case 25:return null}throw Error(c(156,t.tag))}function Yd(e,t){switch(Ro(t),t.tag){case 1:return gt(t.type)&&ai(),e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 3:return Ir(),Oe(ft),Oe(ot),Vo(),e=t.flags,(e&65536)!==0&&(e&128)===0?(t.flags=e&-65537|128,t):null;case 5:return Ho(t),null;case 13:if(Oe(We),e=t.memoizedState,e!==null&&e.dehydrated!==null){if(t.alternate===null)throw Error(c(340));Pr()}return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 19:return Oe(We),null;case 4:return Ir(),null;case 10:return $o(t.type._context),null;case 22:case 23:return Sa(),null;case 24:return null;default:return null}}var Ni=!1,ut=!1,Kd=typeof WeakSet=="function"?WeakSet:Set,U=null;function Or(e,t){var n=e.ref;if(n!==null)if(typeof n=="function")try{n(null)}catch(r){Qe(e,t,r)}else n.current=null}function pa(e,t,n){try{n()}catch(r){Qe(e,t,r)}}var $u=!1;function Xd(e,t){if(So=Yl,e=vs(),ho(e)){if("selectionStart"in e)var n={start:e.selectionStart,end:e.selectionEnd};else e:{n=(n=e.ownerDocument)&&n.defaultView||window;var r=n.getSelection&&n.getSelection();if(r&&r.rangeCount!==0){n=r.anchorNode;var l=r.anchorOffset,i=r.focusNode;r=r.focusOffset;try{n.nodeType,i.nodeType}catch{n=null;break e}var a=0,d=-1,p=-1,x=0,b=0,C=e,k=null;t:for(;;){for(var F;C!==n||l!==0&&C.nodeType!==3||(d=a+l),C!==i||r!==0&&C.nodeType!==3||(p=a+r),C.nodeType===3&&(a+=C.nodeValue.length),(F=C.firstChild)!==null;)k=C,C=F;for(;;){if(C===e)break t;if(k===n&&++x===l&&(d=a),k===i&&++b===r&&(p=a),(F=C.nextSibling)!==null)break;C=k,k=C.parentNode}C=F}n=d===-1||p===-1?null:{start:d,end:p}}else n=null}n=n||{start:0,end:0}}else n=null;for(jo={focusedElem:e,selectionRange:n},Yl=!1,U=t;U!==null;)if(t=U,e=t.child,(t.subtreeFlags&1028)!==0&&e!==null)e.return=t,U=e;else for(;U!==null;){t=U;try{var H=t.alternate;if((t.flags&1024)!==0)switch(t.tag){case 0:case 11:case 15:break;case 1:if(H!==null){var Y=H.memoizedProps,Ve=H.memoizedState,m=t.stateNode,f=m.getSnapshotBeforeUpdate(t.elementType===t.type?Y:Bt(t.type,Y),Ve);m.__reactInternalSnapshotBeforeUpdate=f}break;case 3:var h=t.stateNode.containerInfo;h.nodeType===1?h.textContent="":h.nodeType===9&&h.documentElement&&h.removeChild(h.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(c(163))}}catch(_){Qe(t,t.return,_)}if(e=t.sibling,e!==null){e.return=t.return,U=e;break}U=t.return}return H=$u,$u=!1,H}function Nl(e,t,n){var r=t.updateQueue;if(r=r!==null?r.lastEffect:null,r!==null){var l=r=r.next;do{if((l.tag&e)===e){var i=l.destroy;l.destroy=void 0,i!==void 0&&pa(t,n,i)}l=l.next}while(l!==r)}}function Ei(e,t){if(t=t.updateQueue,t=t!==null?t.lastEffect:null,t!==null){var n=t=t.next;do{if((n.tag&e)===e){var r=n.create;n.destroy=r()}n=n.next}while(n!==t)}}function fa(e){var t=e.ref;if(t!==null){var n=e.stateNode;switch(e.tag){case 5:e=n;break;default:e=n}typeof t=="function"?t(e):t.current=e}}function Au(e){var t=e.alternate;t!==null&&(e.alternate=null,Au(t)),e.child=null,e.deletions=null,e.sibling=null,e.tag===5&&(t=e.stateNode,t!==null&&(delete t[qt],delete t[hl],delete t[_o],delete t[Td],delete t[Ld])),e.stateNode=null,e.return=null,e.dependencies=null,e.memoizedProps=null,e.memoizedState=null,e.pendingProps=null,e.stateNode=null,e.updateQueue=null}function Bu(e){return e.tag===5||e.tag===3||e.tag===4}function Uu(e){e:for(;;){for(;e.sibling===null;){if(e.return===null||Bu(e.return))return null;e=e.return}for(e.sibling.return=e.return,e=e.sibling;e.tag!==5&&e.tag!==6&&e.tag!==18;){if(e.flags&2||e.child===null||e.tag===4)continue e;e.child.return=e,e=e.child}if(!(e.flags&2))return e.stateNode}}function ga(e,t,n){var r=e.tag;if(r===5||r===6)e=e.stateNode,t?n.nodeType===8?n.parentNode.insertBefore(e,t):n.insertBefore(e,t):(n.nodeType===8?(t=n.parentNode,t.insertBefore(e,n)):(t=n,t.appendChild(e)),n=n._reactRootContainer,n!=null||t.onclick!==null||(t.onclick=ii));else if(r!==4&&(e=e.child,e!==null))for(ga(e,t,n),e=e.sibling;e!==null;)ga(e,t,n),e=e.sibling}function ma(e,t,n){var r=e.tag;if(r===5||r===6)e=e.stateNode,t?n.insertBefore(e,t):n.appendChild(e);else if(r!==4&&(e=e.child,e!==null))for(ma(e,t,n),e=e.sibling;e!==null;)ma(e,t,n),e=e.sibling}var rt=null,Ut=!1;function In(e,t,n){for(n=n.child;n!==null;)Wu(e,t,n),n=n.sibling}function Wu(e,t,n){if(wt&&typeof wt.onCommitFiberUnmount=="function")try{wt.onCommitFiberUnmount(Kn,n)}catch{}switch(n.tag){case 5:ut||Or(n,t);case 6:var r=rt,l=Ut;rt=null,In(e,t,n),rt=r,Ut=l,rt!==null&&(Ut?(e=rt,n=n.stateNode,e.nodeType===8?e.parentNode.removeChild(n):e.removeChild(n)):rt.removeChild(n.stateNode));break;case 18:rt!==null&&(Ut?(e=rt,n=n.stateNode,e.nodeType===8?Eo(e.parentNode,n):e.nodeType===1&&Eo(e,n),il(e)):Eo(rt,n.stateNode));break;case 4:r=rt,l=Ut,rt=n.stateNode.containerInfo,Ut=!0,In(e,t,n),rt=r,Ut=l;break;case 0:case 11:case 14:case 15:if(!ut&&(r=n.updateQueue,r!==null&&(r=r.lastEffect,r!==null))){l=r=r.next;do{var i=l,a=i.destroy;i=i.tag,a!==void 0&&((i&2)!==0||(i&4)!==0)&&pa(n,t,a),l=l.next}while(l!==r)}In(e,t,n);break;case 1:if(!ut&&(Or(n,t),r=n.stateNode,typeof r.componentWillUnmount=="function"))try{r.props=n.memoizedProps,r.state=n.memoizedState,r.componentWillUnmount()}catch(d){Qe(n,t,d)}In(e,t,n);break;case 21:In(e,t,n);break;case 22:n.mode&1?(ut=(r=ut)||n.memoizedState!==null,In(e,t,n),ut=r):In(e,t,n);break;default:In(e,t,n)}}function Hu(e){var t=e.updateQueue;if(t!==null){e.updateQueue=null;var n=e.stateNode;n===null&&(n=e.stateNode=new Kd),t.forEach(function(r){var l=lp.bind(null,e,r);n.has(r)||(n.add(r),r.then(l,l))})}}function Wt(e,t){var n=t.deletions;if(n!==null)for(var r=0;r<n.length;r++){var l=n[r];try{var i=e,a=t,d=a;e:for(;d!==null;){switch(d.tag){case 5:rt=d.stateNode,Ut=!1;break e;case 3:rt=d.stateNode.containerInfo,Ut=!0;break e;case 4:rt=d.stateNode.containerInfo,Ut=!0;break e}d=d.return}if(rt===null)throw Error(c(160));Wu(i,a,l),rt=null,Ut=!1;var p=l.alternate;p!==null&&(p.return=null),l.return=null}catch(x){Qe(l,t,x)}}if(t.subtreeFlags&12854)for(t=t.child;t!==null;)Qu(t,e),t=t.sibling}function Qu(e,t){var n=e.alternate,r=e.flags;switch(e.tag){case 0:case 11:case 14:case 15:if(Wt(t,e),en(e),r&4){try{Nl(3,e,e.return),Ei(3,e)}catch(Y){Qe(e,e.return,Y)}try{Nl(5,e,e.return)}catch(Y){Qe(e,e.return,Y)}}break;case 1:Wt(t,e),en(e),r&512&&n!==null&&Or(n,n.return);break;case 5:if(Wt(t,e),en(e),r&512&&n!==null&&Or(n,n.return),e.flags&32){var l=e.stateNode;try{Qt(l,"")}catch(Y){Qe(e,e.return,Y)}}if(r&4&&(l=e.stateNode,l!=null)){var i=e.memoizedProps,a=n!==null?n.memoizedProps:i,d=e.type,p=e.updateQueue;if(e.updateQueue=null,p!==null)try{d==="input"&&i.type==="radio"&&i.name!=null&&Un(l,i),hn(d,a);var x=hn(d,i);for(a=0;a<p.length;a+=2){var b=p[a],C=p[a+1];b==="style"?Vt(l,C):b==="dangerouslySetInnerHTML"?dr(l,C):b==="children"?Qt(l,C):Pe(l,b,C,x)}switch(d){case"input":sr(l,i);break;case"textarea":Wr(l,i);break;case"select":var k=l._wrapperState.wasMultiple;l._wrapperState.wasMultiple=!!i.multiple;var F=i.value;F!=null?rn(l,!!i.multiple,F,!1):k!==!!i.multiple&&(i.defaultValue!=null?rn(l,!!i.multiple,i.defaultValue,!0):rn(l,!!i.multiple,i.multiple?[]:"",!1))}l[hl]=i}catch(Y){Qe(e,e.return,Y)}}break;case 6:if(Wt(t,e),en(e),r&4){if(e.stateNode===null)throw Error(c(162));l=e.stateNode,i=e.memoizedProps;try{l.nodeValue=i}catch(Y){Qe(e,e.return,Y)}}break;case 3:if(Wt(t,e),en(e),r&4&&n!==null&&n.memoizedState.isDehydrated)try{il(t.containerInfo)}catch(Y){Qe(e,e.return,Y)}break;case 4:Wt(t,e),en(e);break;case 13:Wt(t,e),en(e),l=e.child,l.flags&8192&&(i=l.memoizedState!==null,l.stateNode.isHidden=i,!i||l.alternate!==null&&l.alternate.memoizedState!==null||(ya=Be())),r&4&&Hu(e);break;case 22:if(b=n!==null&&n.memoizedState!==null,e.mode&1?(ut=(x=ut)||b,Wt(t,e),ut=x):Wt(t,e),en(e),r&8192){if(x=e.memoizedState!==null,(e.stateNode.isHidden=x)&&!b&&(e.mode&1)!==0)for(U=e,b=e.child;b!==null;){for(C=U=b;U!==null;){switch(k=U,F=k.child,k.tag){case 0:case 11:case 14:case 15:Nl(4,k,k.return);break;case 1:Or(k,k.return);var H=k.stateNode;if(typeof H.componentWillUnmount=="function"){r=k,n=k.return;try{t=r,H.props=t.memoizedProps,H.state=t.memoizedState,H.componentWillUnmount()}catch(Y){Qe(r,n,Y)}}break;case 5:Or(k,k.return);break;case 22:if(k.memoizedState!==null){Ku(C);continue}}F!==null?(F.return=k,U=F):Ku(C)}b=b.sibling}e:for(b=null,C=e;;){if(C.tag===5){if(b===null){b=C;try{l=C.stateNode,x?(i=l.style,typeof i.setProperty=="function"?i.setProperty("display","none","important"):i.display="none"):(d=C.stateNode,p=C.memoizedProps.style,a=p!=null&&p.hasOwnProperty("display")?p.display:null,d.style.display=Qr("display",a))}catch(Y){Qe(e,e.return,Y)}}}else if(C.tag===6){if(b===null)try{C.stateNode.nodeValue=x?"":C.memoizedProps}catch(Y){Qe(e,e.return,Y)}}else if((C.tag!==22&&C.tag!==23||C.memoizedState===null||C===e)&&C.child!==null){C.child.return=C,C=C.child;continue}if(C===e)break e;for(;C.sibling===null;){if(C.return===null||C.return===e)break e;b===C&&(b=null),C=C.return}b===C&&(b=null),C.sibling.return=C.return,C=C.sibling}}break;case 19:Wt(t,e),en(e),r&4&&Hu(e);break;case 21:break;default:Wt(t,e),en(e)}}function en(e){var t=e.flags;if(t&2){try{e:{for(var n=e.return;n!==null;){if(Bu(n)){var r=n;break e}n=n.return}throw Error(c(160))}switch(r.tag){case 5:var l=r.stateNode;r.flags&32&&(Qt(l,""),r.flags&=-33);var i=Uu(e);ma(e,i,l);break;case 3:case 4:var a=r.stateNode.containerInfo,d=Uu(e);ga(e,d,a);break;default:throw Error(c(161))}}catch(p){Qe(e,e.return,p)}e.flags&=-3}t&4096&&(e.flags&=-4097)}function Gd(e,t,n){U=e,Vu(e)}function Vu(e,t,n){for(var r=(e.mode&1)!==0;U!==null;){var l=U,i=l.child;if(l.tag===22&&r){var a=l.memoizedState!==null||Ni;if(!a){var d=l.alternate,p=d!==null&&d.memoizedState!==null||ut;d=Ni;var x=ut;if(Ni=a,(ut=p)&&!x)for(U=l;U!==null;)a=U,p=a.child,a.tag===22&&a.memoizedState!==null?Xu(l):p!==null?(p.return=a,U=p):Xu(l);for(;i!==null;)U=i,Vu(i),i=i.sibling;U=l,Ni=d,ut=x}Yu(e)}else(l.subtreeFlags&8772)!==0&&i!==null?(i.return=l,U=i):Yu(e)}}function Yu(e){for(;U!==null;){var t=U;if((t.flags&8772)!==0){var n=t.alternate;try{if((t.flags&8772)!==0)switch(t.tag){case 0:case 11:case 15:ut||Ei(5,t);break;case 1:var r=t.stateNode;if(t.flags&4&&!ut)if(n===null)r.componentDidMount();else{var l=t.elementType===t.type?n.memoizedProps:Bt(t.type,n.memoizedProps);r.componentDidUpdate(l,n.memoizedState,r.__reactInternalSnapshotBeforeUpdate)}var i=t.updateQueue;i!==null&&Ks(t,i,r);break;case 3:var a=t.updateQueue;if(a!==null){if(n=null,t.child!==null)switch(t.child.tag){case 5:n=t.child.stateNode;break;case 1:n=t.child.stateNode}Ks(t,a,n)}break;case 5:var d=t.stateNode;if(n===null&&t.flags&4){n=d;var p=t.memoizedProps;switch(t.type){case"button":case"input":case"select":case"textarea":p.autoFocus&&n.focus();break;case"img":p.src&&(n.src=p.src)}}break;case 6:break;case 4:break;case 12:break;case 13:if(t.memoizedState===null){var x=t.alternate;if(x!==null){var b=x.memoizedState;if(b!==null){var C=b.dehydrated;C!==null&&il(C)}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;default:throw Error(c(163))}ut||t.flags&512&&fa(t)}catch(k){Qe(t,t.return,k)}}if(t===e){U=null;break}if(n=t.sibling,n!==null){n.return=t.return,U=n;break}U=t.return}}function Ku(e){for(;U!==null;){var t=U;if(t===e){U=null;break}var n=t.sibling;if(n!==null){n.return=t.return,U=n;break}U=t.return}}function Xu(e){for(;U!==null;){var t=U;try{switch(t.tag){case 0:case 11:case 15:var n=t.return;try{Ei(4,t)}catch(p){Qe(t,n,p)}break;case 1:var r=t.stateNode;if(typeof r.componentDidMount=="function"){var l=t.return;try{r.componentDidMount()}catch(p){Qe(t,l,p)}}var i=t.return;try{fa(t)}catch(p){Qe(t,i,p)}break;case 5:var a=t.return;try{fa(t)}catch(p){Qe(t,a,p)}}}catch(p){Qe(t,t.return,p)}if(t===e){U=null;break}var d=t.sibling;if(d!==null){d.return=t.return,U=d;break}U=t.return}}var qd=Math.ceil,_i=pe.ReactCurrentDispatcher,ha=pe.ReactCurrentOwner,It=pe.ReactCurrentBatchConfig,be=0,et=null,Xe=null,lt=0,Ct=0,Dr=_n(0),Ze=0,El=null,nr=0,Pi=0,va=0,_l=null,ht=null,ya=0,Fr=1/0,pn=null,Ti=!1,xa=null,Mn=null,Li=!1,On=null,Ri=0,Pl=0,za=null,Ii=-1,Mi=0;function pt(){return(be&6)!==0?Be():Ii!==-1?Ii:Ii=Be()}function Dn(e){return(e.mode&1)===0?1:(be&2)!==0&&lt!==0?lt&-lt:Id.transition!==null?(Mi===0&&(Mi=it()),Mi):(e=A,e!==0||(e=window.event,e=e===void 0?16:qa(e.type)),e)}function Ht(e,t,n,r){if(50<Pl)throw Pl=0,za=null,Error(c(185));kt(e,n,r),((be&2)===0||e!==et)&&(e===et&&((be&2)===0&&(Pi|=n),Ze===4&&Fn(e,lt)),vt(e,r),n===1&&be===0&&(t.mode&1)===0&&(Fr=Be()+500,ui&&Tn()))}function vt(e,t){var n=e.callbackNode;Ge(e,t);var r=ye(e,e===et?lt:0);if(r===0)n!==null&&Bl(n),e.callbackNode=null,e.callbackPriority=0;else if(t=r&-r,e.callbackPriority!==t){if(n!=null&&Bl(n),t===1)e.tag===0?Rd(qu.bind(null,e)):Os(qu.bind(null,e)),_d(function(){(be&6)===0&&Tn()}),n=null;else{switch(Ke(r)){case 1:n=qr;break;case 4:n=Zr;break;case 16:n=Yn;break;case 536870912:n=Jr;break;default:n=Yn}n=ic(n,Gu.bind(null,e))}e.callbackPriority=t,e.callbackNode=n}}function Gu(e,t){if(Ii=-1,Mi=0,(be&6)!==0)throw Error(c(327));var n=e.callbackNode;if($r()&&e.callbackNode!==n)return null;var r=ye(e,e===et?lt:0);if(r===0)return null;if((r&30)!==0||(r&e.expiredLanes)!==0||t)t=Oi(e,r);else{t=r;var l=be;be|=2;var i=Ju();(et!==e||lt!==t)&&(pn=null,Fr=Be()+500,lr(e,t));do try{ep();break}catch(d){Zu(e,d)}while(!0);Fo(),_i.current=i,be=l,Xe!==null?t=0:(et=null,lt=0,t=Ze)}if(t!==0){if(t===2&&(l=Ie(e),l!==0&&(r=l,t=wa(e,l))),t===1)throw n=El,lr(e,0),Fn(e,r),vt(e,Be()),n;if(t===6)Fn(e,r);else{if(l=e.current.alternate,(r&30)===0&&!Zd(l)&&(t=Oi(e,r),t===2&&(i=Ie(e),i!==0&&(r=i,t=wa(e,i))),t===1))throw n=El,lr(e,0),Fn(e,r),vt(e,Be()),n;switch(e.finishedWork=l,e.finishedLanes=r,t){case 0:case 1:throw Error(c(345));case 2:ir(e,ht,pn);break;case 3:if(Fn(e,r),(r&130023424)===r&&(t=ya+500-Be(),10<t)){if(ye(e,0)!==0)break;if(l=e.suspendedLanes,(l&r)!==r){pt(),e.pingedLanes|=e.suspendedLanes&l;break}e.timeoutHandle=No(ir.bind(null,e,ht,pn),t);break}ir(e,ht,pn);break;case 4:if(Fn(e,r),(r&4194240)===r)break;for(t=e.eventTimes,l=-1;0<r;){var a=31-s(r);i=1<<a,a=t[a],a>l&&(l=a),r&=~i}if(r=l,r=Be()-r,r=(120>r?120:480>r?480:1080>r?1080:1920>r?1920:3e3>r?3e3:4320>r?4320:1960*qd(r/1960))-r,10<r){e.timeoutHandle=No(ir.bind(null,e,ht,pn),r);break}ir(e,ht,pn);break;case 5:ir(e,ht,pn);break;default:throw Error(c(329))}}}return vt(e,Be()),e.callbackNode===n?Gu.bind(null,e):null}function wa(e,t){var n=_l;return e.current.memoizedState.isDehydrated&&(lr(e,t).flags|=256),e=Oi(e,t),e!==2&&(t=ht,ht=n,t!==null&&ka(t)),e}function ka(e){ht===null?ht=e:ht.push.apply(ht,e)}function Zd(e){for(var t=e;;){if(t.flags&16384){var n=t.updateQueue;if(n!==null&&(n=n.stores,n!==null))for(var r=0;r<n.length;r++){var l=n[r],i=l.getSnapshot;l=l.value;try{if(!$t(i(),l))return!1}catch{return!1}}}if(n=t.child,t.subtreeFlags&16384&&n!==null)n.return=t,t=n;else{if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return!0;t=t.return}t.sibling.return=t.return,t=t.sibling}}return!0}function Fn(e,t){for(t&=~va,t&=~Pi,e.suspendedLanes|=t,e.pingedLanes&=~t,e=e.expirationTimes;0<t;){var n=31-s(t),r=1<<n;e[n]=-1,t&=~r}}function qu(e){if((be&6)!==0)throw Error(c(327));$r();var t=ye(e,0);if((t&1)===0)return vt(e,Be()),null;var n=Oi(e,t);if(e.tag!==0&&n===2){var r=Ie(e);r!==0&&(t=r,n=wa(e,r))}if(n===1)throw n=El,lr(e,0),Fn(e,t),vt(e,Be()),n;if(n===6)throw Error(c(345));return e.finishedWork=e.current.alternate,e.finishedLanes=t,ir(e,ht,pn),vt(e,Be()),null}function ba(e,t){var n=be;be|=1;try{return e(t)}finally{be=n,be===0&&(Fr=Be()+500,ui&&Tn())}}function rr(e){On!==null&&On.tag===0&&(be&6)===0&&$r();var t=be;be|=1;var n=It.transition,r=A;try{if(It.transition=null,A=1,e)return e()}finally{A=r,It.transition=n,be=t,(be&6)===0&&Tn()}}function Sa(){Ct=Dr.current,Oe(Dr)}function lr(e,t){e.finishedWork=null,e.finishedLanes=0;var n=e.timeoutHandle;if(n!==-1&&(e.timeoutHandle=-1,Ed(n)),Xe!==null)for(n=Xe.return;n!==null;){var r=n;switch(Ro(r),r.tag){case 1:r=r.type.childContextTypes,r!=null&&ai();break;case 3:Ir(),Oe(ft),Oe(ot),Vo();break;case 5:Ho(r);break;case 4:Ir();break;case 13:Oe(We);break;case 19:Oe(We);break;case 10:$o(r.type._context);break;case 22:case 23:Sa()}n=n.return}if(et=e,Xe=e=$n(e.current,null),lt=Ct=t,Ze=0,El=null,va=Pi=nr=0,ht=_l=null,Jn!==null){for(t=0;t<Jn.length;t++)if(n=Jn[t],r=n.interleaved,r!==null){n.interleaved=null;var l=r.next,i=n.pending;if(i!==null){var a=i.next;i.next=l,r.next=a}n.pending=r}Jn=null}return e}function Zu(e,t){do{var n=Xe;try{if(Fo(),xi.current=bi,zi){for(var r=He.memoizedState;r!==null;){var l=r.queue;l!==null&&(l.pending=null),r=r.next}zi=!1}if(tr=0,Je=qe=He=null,kl=!1,bl=0,ha.current=null,n===null||n.return===null){Ze=1,El=t,Xe=null;break}e:{var i=e,a=n.return,d=n,p=t;if(t=lt,d.flags|=32768,p!==null&&typeof p=="object"&&typeof p.then=="function"){var x=p,b=d,C=b.tag;if((b.mode&1)===0&&(C===0||C===11||C===15)){var k=b.alternate;k?(b.updateQueue=k.updateQueue,b.memoizedState=k.memoizedState,b.lanes=k.lanes):(b.updateQueue=null,b.memoizedState=null)}var F=bu(a);if(F!==null){F.flags&=-257,Su(F,a,d,i,t),F.mode&1&&ku(i,x,t),t=F,p=x;var H=t.updateQueue;if(H===null){var Y=new Set;Y.add(p),t.updateQueue=Y}else H.add(p);break e}else{if((t&1)===0){ku(i,x,t),ja();break e}p=Error(c(426))}}else if(Fe&&d.mode&1){var Ve=bu(a);if(Ve!==null){(Ve.flags&65536)===0&&(Ve.flags|=256),Su(Ve,a,d,i,t),Oo(Mr(p,d));break e}}i=p=Mr(p,d),Ze!==4&&(Ze=2),_l===null?_l=[i]:_l.push(i),i=a;do{switch(i.tag){case 3:i.flags|=65536,t&=-t,i.lanes|=t;var m=zu(i,p,t);Ys(i,m);break e;case 1:d=p;var f=i.type,h=i.stateNode;if((i.flags&128)===0&&(typeof f.getDerivedStateFromError=="function"||h!==null&&typeof h.componentDidCatch=="function"&&(Mn===null||!Mn.has(h)))){i.flags|=65536,t&=-t,i.lanes|=t;var _=wu(i,d,t);Ys(i,_);break e}}i=i.return}while(i!==null)}tc(n)}catch(K){t=K,Xe===n&&n!==null&&(Xe=n=n.return);continue}break}while(!0)}function Ju(){var e=_i.current;return _i.current=bi,e===null?bi:e}function ja(){(Ze===0||Ze===3||Ze===2)&&(Ze=4),et===null||(nr&268435455)===0&&(Pi&268435455)===0||Fn(et,lt)}function Oi(e,t){var n=be;be|=2;var r=Ju();(et!==e||lt!==t)&&(pn=null,lr(e,t));do try{Jd();break}catch(l){Zu(e,l)}while(!0);if(Fo(),be=n,_i.current=r,Xe!==null)throw Error(c(261));return et=null,lt=0,Ze}function Jd(){for(;Xe!==null;)ec(Xe)}function ep(){for(;Xe!==null&&!eo();)ec(Xe)}function ec(e){var t=lc(e.alternate,e,Ct);e.memoizedProps=e.pendingProps,t===null?tc(e):Xe=t,ha.current=null}function tc(e){var t=e;do{var n=t.alternate;if(e=t.return,(t.flags&32768)===0){if(n=Vd(n,t,Ct),n!==null){Xe=n;return}}else{if(n=Yd(n,t),n!==null){n.flags&=32767,Xe=n;return}if(e!==null)e.flags|=32768,e.subtreeFlags=0,e.deletions=null;else{Ze=6,Xe=null;return}}if(t=t.sibling,t!==null){Xe=t;return}Xe=t=e}while(t!==null);Ze===0&&(Ze=5)}function ir(e,t,n){var r=A,l=It.transition;try{It.transition=null,A=1,tp(e,t,n,r)}finally{It.transition=l,A=r}return null}function tp(e,t,n,r){do $r();while(On!==null);if((be&6)!==0)throw Error(c(327));n=e.finishedWork;var l=e.finishedLanes;if(n===null)return null;if(e.finishedWork=null,e.finishedLanes=0,n===e.current)throw Error(c(177));e.callbackNode=null,e.callbackPriority=0;var i=n.lanes|n.childLanes;if(J(e,i),e===et&&(Xe=et=null,lt=0),(n.subtreeFlags&2064)===0&&(n.flags&2064)===0||Li||(Li=!0,ic(Yn,function(){return $r(),null})),i=(n.flags&15990)!==0,(n.subtreeFlags&15990)!==0||i){i=It.transition,It.transition=null;var a=A;A=1;var d=be;be|=4,ha.current=null,Xd(e,n),Qu(n,e),wd(jo),Yl=!!So,jo=So=null,e.current=n,Gd(n),to(),be=d,A=a,It.transition=i}else e.current=n;if(Li&&(Li=!1,On=e,Ri=l),i=e.pendingLanes,i===0&&(Mn=null),Wl(n.stateNode),vt(e,Be()),t!==null)for(r=e.onRecoverableError,n=0;n<t.length;n++)l=t[n],r(l.value,{componentStack:l.stack,digest:l.digest});if(Ti)throw Ti=!1,e=xa,xa=null,e;return(Ri&1)!==0&&e.tag!==0&&$r(),i=e.pendingLanes,(i&1)!==0?e===za?Pl++:(Pl=0,za=e):Pl=0,Tn(),null}function $r(){if(On!==null){var e=Ke(Ri),t=It.transition,n=A;try{if(It.transition=null,A=16>e?16:e,On===null)var r=!1;else{if(e=On,On=null,Ri=0,(be&6)!==0)throw Error(c(331));var l=be;for(be|=4,U=e.current;U!==null;){var i=U,a=i.child;if((U.flags&16)!==0){var d=i.deletions;if(d!==null){for(var p=0;p<d.length;p++){var x=d[p];for(U=x;U!==null;){var b=U;switch(b.tag){case 0:case 11:case 15:Nl(8,b,i)}var C=b.child;if(C!==null)C.return=b,U=C;else for(;U!==null;){b=U;var k=b.sibling,F=b.return;if(Au(b),b===x){U=null;break}if(k!==null){k.return=F,U=k;break}U=F}}}var H=i.alternate;if(H!==null){var Y=H.child;if(Y!==null){H.child=null;do{var Ve=Y.sibling;Y.sibling=null,Y=Ve}while(Y!==null)}}U=i}}if((i.subtreeFlags&2064)!==0&&a!==null)a.return=i,U=a;else e:for(;U!==null;){if(i=U,(i.flags&2048)!==0)switch(i.tag){case 0:case 11:case 15:Nl(9,i,i.return)}var m=i.sibling;if(m!==null){m.return=i.return,U=m;break e}U=i.return}}var f=e.current;for(U=f;U!==null;){a=U;var h=a.child;if((a.subtreeFlags&2064)!==0&&h!==null)h.return=a,U=h;else e:for(a=f;U!==null;){if(d=U,(d.flags&2048)!==0)try{switch(d.tag){case 0:case 11:case 15:Ei(9,d)}}catch(K){Qe(d,d.return,K)}if(d===a){U=null;break e}var _=d.sibling;if(_!==null){_.return=d.return,U=_;break e}U=d.return}}if(be=l,Tn(),wt&&typeof wt.onPostCommitFiberRoot=="function")try{wt.onPostCommitFiberRoot(Kn,e)}catch{}r=!0}return r}finally{A=n,It.transition=t}}return!1}function nc(e,t,n){t=Mr(n,t),t=zu(e,t,1),e=Rn(e,t,1),t=pt(),e!==null&&(kt(e,1,t),vt(e,t))}function Qe(e,t,n){if(e.tag===3)nc(e,e,n);else for(;t!==null;){if(t.tag===3){nc(t,e,n);break}else if(t.tag===1){var r=t.stateNode;if(typeof t.type.getDerivedStateFromError=="function"||typeof r.componentDidCatch=="function"&&(Mn===null||!Mn.has(r))){e=Mr(n,e),e=wu(t,e,1),t=Rn(t,e,1),e=pt(),t!==null&&(kt(t,1,e),vt(t,e));break}}t=t.return}}function np(e,t,n){var r=e.pingCache;r!==null&&r.delete(t),t=pt(),e.pingedLanes|=e.suspendedLanes&n,et===e&&(lt&n)===n&&(Ze===4||Ze===3&&(lt&130023424)===lt&&500>Be()-ya?lr(e,0):va|=n),vt(e,t)}function rc(e,t){t===0&&((e.mode&1)===0?t=1:(t=ee,ee<<=1,(ee&130023424)===0&&(ee=4194304)));var n=pt();e=un(e,t),e!==null&&(kt(e,t,n),vt(e,n))}function rp(e){var t=e.memoizedState,n=0;t!==null&&(n=t.retryLane),rc(e,n)}function lp(e,t){var n=0;switch(e.tag){case 13:var r=e.stateNode,l=e.memoizedState;l!==null&&(n=l.retryLane);break;case 19:r=e.stateNode;break;default:throw Error(c(314))}r!==null&&r.delete(t),rc(e,n)}var lc;lc=function(e,t,n){if(e!==null)if(e.memoizedProps!==t.pendingProps||ft.current)mt=!0;else{if((e.lanes&n)===0&&(t.flags&128)===0)return mt=!1,Qd(e,t,n);mt=(e.flags&131072)!==0}else mt=!1,Fe&&(t.flags&1048576)!==0&&Ds(t,di,t.index);switch(t.lanes=0,t.tag){case 2:var r=t.type;Ci(e,t),e=t.pendingProps;var l=Nr(t,ot.current);Rr(t,n),l=Xo(null,t,r,e,l,n);var i=Go();return t.flags|=1,typeof l=="object"&&l!==null&&typeof l.render=="function"&&l.$$typeof===void 0?(t.tag=1,t.memoizedState=null,t.updateQueue=null,gt(r)?(i=!0,si(t)):i=!1,t.memoizedState=l.state!==null&&l.state!==void 0?l.state:null,Uo(t),l.updater=Si,t.stateNode=l,l._reactInternals=t,na(t,r,e,n),t=oa(null,t,r,!0,i,n)):(t.tag=0,Fe&&i&&Lo(t),dt(null,t,l,n),t=t.child),t;case 16:r=t.elementType;e:{switch(Ci(e,t),e=t.pendingProps,l=r._init,r=l(r._payload),t.type=r,l=t.tag=op(r),e=Bt(r,e),l){case 0:t=ia(null,t,r,e,n);break e;case 1:t=Pu(null,t,r,e,n);break e;case 11:t=ju(null,t,r,e,n);break e;case 14:t=Cu(null,t,r,Bt(r.type,e),n);break e}throw Error(c(306,r,""))}return t;case 0:return r=t.type,l=t.pendingProps,l=t.elementType===r?l:Bt(r,l),ia(e,t,r,l,n);case 1:return r=t.type,l=t.pendingProps,l=t.elementType===r?l:Bt(r,l),Pu(e,t,r,l,n);case 3:e:{if(Tu(t),e===null)throw Error(c(387));r=t.pendingProps,i=t.memoizedState,l=i.element,Vs(e,t),vi(t,r,null,n);var a=t.memoizedState;if(r=a.element,i.isDehydrated)if(i={element:r,isDehydrated:!1,cache:a.cache,pendingSuspenseBoundaries:a.pendingSuspenseBoundaries,transitions:a.transitions},t.updateQueue.baseState=i,t.memoizedState=i,t.flags&256){l=Mr(Error(c(423)),t),t=Lu(e,t,r,n,l);break e}else if(r!==l){l=Mr(Error(c(424)),t),t=Lu(e,t,r,n,l);break e}else for(jt=En(t.stateNode.containerInfo.firstChild),St=t,Fe=!0,At=null,n=Hs(t,null,r,n),t.child=n;n;)n.flags=n.flags&-3|4096,n=n.sibling;else{if(Pr(),r===l){t=dn(e,t,n);break e}dt(e,t,r,n)}t=t.child}return t;case 5:return Xs(t),e===null&&Mo(t),r=t.type,l=t.pendingProps,i=e!==null?e.memoizedProps:null,a=l.children,Co(r,l)?a=null:i!==null&&Co(r,i)&&(t.flags|=32),_u(e,t),dt(e,t,a,n),t.child;case 6:return e===null&&Mo(t),null;case 13:return Ru(e,t,n);case 4:return Wo(t,t.stateNode.containerInfo),r=t.pendingProps,e===null?t.child=Tr(t,null,r,n):dt(e,t,r,n),t.child;case 11:return r=t.type,l=t.pendingProps,l=t.elementType===r?l:Bt(r,l),ju(e,t,r,l,n);case 7:return dt(e,t,t.pendingProps,n),t.child;case 8:return dt(e,t,t.pendingProps.children,n),t.child;case 12:return dt(e,t,t.pendingProps.children,n),t.child;case 10:e:{if(r=t.type._context,l=t.pendingProps,i=t.memoizedProps,a=l.value,Re(gi,r._currentValue),r._currentValue=a,i!==null)if($t(i.value,a)){if(i.children===l.children&&!ft.current){t=dn(e,t,n);break e}}else for(i=t.child,i!==null&&(i.return=t);i!==null;){var d=i.dependencies;if(d!==null){a=i.child;for(var p=d.firstContext;p!==null;){if(p.context===r){if(i.tag===1){p=cn(-1,n&-n),p.tag=2;var x=i.updateQueue;if(x!==null){x=x.shared;var b=x.pending;b===null?p.next=p:(p.next=b.next,b.next=p),x.pending=p}}i.lanes|=n,p=i.alternate,p!==null&&(p.lanes|=n),Ao(i.return,n,t),d.lanes|=n;break}p=p.next}}else if(i.tag===10)a=i.type===t.type?null:i.child;else if(i.tag===18){if(a=i.return,a===null)throw Error(c(341));a.lanes|=n,d=a.alternate,d!==null&&(d.lanes|=n),Ao(a,n,t),a=i.sibling}else a=i.child;if(a!==null)a.return=i;else for(a=i;a!==null;){if(a===t){a=null;break}if(i=a.sibling,i!==null){i.return=a.return,a=i;break}a=a.return}i=a}dt(e,t,l.children,n),t=t.child}return t;case 9:return l=t.type,r=t.pendingProps.children,Rr(t,n),l=Lt(l),r=r(l),t.flags|=1,dt(e,t,r,n),t.child;case 14:return r=t.type,l=Bt(r,t.pendingProps),l=Bt(r.type,l),Cu(e,t,r,l,n);case 15:return Nu(e,t,t.type,t.pendingProps,n);case 17:return r=t.type,l=t.pendingProps,l=t.elementType===r?l:Bt(r,l),Ci(e,t),t.tag=1,gt(r)?(e=!0,si(t)):e=!1,Rr(t,n),yu(t,r,l),na(t,r,l,n),oa(null,t,r,!0,e,n);case 19:return Mu(e,t,n);case 22:return Eu(e,t,n)}throw Error(c(156,t.tag))};function ic(e,t){return Al(e,t)}function ip(e,t,n,r){this.tag=e,this.key=n,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.ref=null,this.pendingProps=t,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=r,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function Mt(e,t,n,r){return new ip(e,t,n,r)}function Ca(e){return e=e.prototype,!(!e||!e.isReactComponent)}function op(e){if(typeof e=="function")return Ca(e)?1:0;if(e!=null){if(e=e.$$typeof,e===P)return 11;if(e===N)return 14}return 2}function $n(e,t){var n=e.alternate;return n===null?(n=Mt(e.tag,t,e.key,e.mode),n.elementType=e.elementType,n.type=e.type,n.stateNode=e.stateNode,n.alternate=e,e.alternate=n):(n.pendingProps=t,n.type=e.type,n.flags=0,n.subtreeFlags=0,n.deletions=null),n.flags=e.flags&14680064,n.childLanes=e.childLanes,n.lanes=e.lanes,n.child=e.child,n.memoizedProps=e.memoizedProps,n.memoizedState=e.memoizedState,n.updateQueue=e.updateQueue,t=e.dependencies,n.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext},n.sibling=e.sibling,n.index=e.index,n.ref=e.ref,n}function Di(e,t,n,r,l,i){var a=2;if(r=e,typeof e=="function")Ca(e)&&(a=1);else if(typeof e=="string")a=5;else e:switch(e){case ve:return or(n.children,l,i,t);case ke:a=8,l|=8;break;case q:return e=Mt(12,n,t,l|2),e.elementType=q,e.lanes=i,e;case G:return e=Mt(13,n,t,l),e.elementType=G,e.lanes=i,e;case O:return e=Mt(19,n,t,l),e.elementType=O,e.lanes=i,e;case le:return Fi(n,l,i,t);default:if(typeof e=="object"&&e!==null)switch(e.$$typeof){case $e:a=10;break e;case Ne:a=9;break e;case P:a=11;break e;case N:a=14;break e;case j:a=16,r=null;break e}throw Error(c(130,e==null?e:typeof e,""))}return t=Mt(a,n,t,l),t.elementType=e,t.type=r,t.lanes=i,t}function or(e,t,n,r){return e=Mt(7,e,r,t),e.lanes=n,e}function Fi(e,t,n,r){return e=Mt(22,e,r,t),e.elementType=le,e.lanes=n,e.stateNode={isHidden:!1},e}function Na(e,t,n){return e=Mt(6,e,null,t),e.lanes=n,e}function Ea(e,t,n){return t=Mt(4,e.children!==null?e.children:[],e.key,t),t.lanes=n,t.stateNode={containerInfo:e.containerInfo,pendingChildren:null,implementation:e.implementation},t}function ap(e,t,n,r,l){this.tag=t,this.containerInfo=e,this.finishedWork=this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.pendingContext=this.context=null,this.callbackPriority=0,this.eventTimes=Ue(0),this.expirationTimes=Ue(-1),this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=Ue(0),this.identifierPrefix=r,this.onRecoverableError=l,this.mutableSourceEagerHydrationData=null}function _a(e,t,n,r,l,i,a,d,p){return e=new ap(e,t,n,d,p),t===1?(t=1,i===!0&&(t|=8)):t=0,i=Mt(3,null,null,t),e.current=i,i.stateNode=e,i.memoizedState={element:r,isDehydrated:n,cache:null,transitions:null,pendingSuspenseBoundaries:null},Uo(i),e}function sp(e,t,n){var r=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:Se,key:r==null?null:""+r,children:e,containerInfo:t,implementation:n}}function oc(e){if(!e)return Pn;e=e._reactInternals;e:{if(Xt(e)!==e||e.tag!==1)throw Error(c(170));var t=e;do{switch(t.tag){case 3:t=t.stateNode.context;break e;case 1:if(gt(t.type)){t=t.stateNode.__reactInternalMemoizedMergedChildContext;break e}}t=t.return}while(t!==null);throw Error(c(171))}if(e.tag===1){var n=e.type;if(gt(n))return Is(e,n,t)}return t}function ac(e,t,n,r,l,i,a,d,p){return e=_a(n,r,!0,e,l,i,a,d,p),e.context=oc(null),n=e.current,r=pt(),l=Dn(n),i=cn(r,l),i.callback=t??null,Rn(n,i,l),e.current.lanes=l,kt(e,l,r),vt(e,r),e}function $i(e,t,n,r){var l=t.current,i=pt(),a=Dn(l);return n=oc(n),t.context===null?t.context=n:t.pendingContext=n,t=cn(i,a),t.payload={element:e},r=r===void 0?null:r,r!==null&&(t.callback=r),e=Rn(l,t,a),e!==null&&(Ht(e,l,a,i),hi(e,l,a)),a}function Ai(e){if(e=e.current,!e.child)return null;switch(e.child.tag){case 5:return e.child.stateNode;default:return e.child.stateNode}}function sc(e,t){if(e=e.memoizedState,e!==null&&e.dehydrated!==null){var n=e.retryLane;e.retryLane=n!==0&&n<t?n:t}}function Pa(e,t){sc(e,t),(e=e.alternate)&&sc(e,t)}function up(){return null}var uc=typeof reportError=="function"?reportError:function(e){console.error(e)};function Ta(e){this._internalRoot=e}Bi.prototype.render=Ta.prototype.render=function(e){var t=this._internalRoot;if(t===null)throw Error(c(409));$i(e,t,null,null)},Bi.prototype.unmount=Ta.prototype.unmount=function(){var e=this._internalRoot;if(e!==null){this._internalRoot=null;var t=e.containerInfo;rr(function(){$i(null,e,null,null)}),t[ln]=null}};function Bi(e){this._internalRoot=e}Bi.prototype.unstable_scheduleHydration=function(e){if(e){var t=Hl();e={blockedOn:null,target:e,priority:t};for(var n=0;n<jn.length&&t!==0&&t<jn[n].priority;n++);jn.splice(n,0,e),n===0&&Xa(e)}};function La(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11)}function Ui(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11&&(e.nodeType!==8||e.nodeValue!==" react-mount-point-unstable "))}function cc(){}function cp(e,t,n,r,l){if(l){if(typeof r=="function"){var i=r;r=function(){var x=Ai(a);i.call(x)}}var a=ac(t,r,e,0,null,!1,!1,"",cc);return e._reactRootContainer=a,e[ln]=a.current,gl(e.nodeType===8?e.parentNode:e),rr(),a}for(;l=e.lastChild;)e.removeChild(l);if(typeof r=="function"){var d=r;r=function(){var x=Ai(p);d.call(x)}}var p=_a(e,0,!1,null,null,!1,!1,"",cc);return e._reactRootContainer=p,e[ln]=p.current,gl(e.nodeType===8?e.parentNode:e),rr(function(){$i(t,p,n,r)}),p}function Wi(e,t,n,r,l){var i=n._reactRootContainer;if(i){var a=i;if(typeof l=="function"){var d=l;l=function(){var p=Ai(a);d.call(p)}}$i(t,a,e,l)}else a=cp(n,t,e,l,r);return Ai(a)}nt=function(e){switch(e.tag){case 3:var t=e.stateNode;if(t.current.memoizedState.isDehydrated){var n=Z(t.pendingLanes);n!==0&&(xe(t,n|1),vt(t,Be()),(be&6)===0&&(Fr=Be()+500,Tn()))}break;case 13:rr(function(){var r=un(e,1);if(r!==null){var l=pt();Ht(r,e,1,l)}}),Pa(e,1)}},Gt=function(e){if(e.tag===13){var t=un(e,134217728);if(t!==null){var n=pt();Ht(t,e,134217728,n)}Pa(e,134217728)}},el=function(e){if(e.tag===13){var t=Dn(e),n=un(e,t);if(n!==null){var r=pt();Ht(n,e,t,r)}Pa(e,t)}},Hl=function(){return A},Ya=function(e,t){var n=A;try{return A=e,t()}finally{A=n}},vn=function(e,t,n){switch(t){case"input":if(sr(e,n),t=n.name,n.type==="radio"&&t!=null){for(n=e;n.parentNode;)n=n.parentNode;for(n=n.querySelectorAll("input[name="+JSON.stringify(""+t)+'][type="radio"]'),t=0;t<n.length;t++){var r=n[t];if(r!==e&&r.form===e.form){var l=oi(r);if(!l)throw Error(c(90));Bn(r),sr(r,l)}}}break;case"textarea":Wr(e,n);break;case"select":t=n.value,t!=null&&rn(e,!!n.multiple,t,!1)}},Qn=ba,Yr=rr;var dp={usingClientEntryPoint:!1,Events:[vl,jr,oi,xn,zn,ba]},Tl={findFiberByHostInstance:Xn,bundleType:0,version:"18.3.1",rendererPackageName:"react-dom"},pp={bundleType:Tl.bundleType,version:Tl.version,rendererPackageName:Tl.rendererPackageName,rendererConfig:Tl.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:pe.ReactCurrentDispatcher,findHostInstanceByFiber:function(e){return e=vr(e),e===null?null:e.stateNode},findFiberByHostInstance:Tl.findFiberByHostInstance||up,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.3.1-next-f1338f8080-20240426"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var Hi=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!Hi.isDisabled&&Hi.supportsFiber)try{Kn=Hi.inject(pp),wt=Hi}catch{}}return yt.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=dp,yt.createPortal=function(e,t){var n=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!La(t))throw Error(c(200));return sp(e,t,null,n)},yt.createRoot=function(e,t){if(!La(e))throw Error(c(299));var n=!1,r="",l=uc;return t!=null&&(t.unstable_strictMode===!0&&(n=!0),t.identifierPrefix!==void 0&&(r=t.identifierPrefix),t.onRecoverableError!==void 0&&(l=t.onRecoverableError)),t=_a(e,1,!1,null,null,n,!1,r,l),e[ln]=t.current,gl(e.nodeType===8?e.parentNode:e),new Ta(t)},yt.findDOMNode=function(e){if(e==null)return null;if(e.nodeType===1)return e;var t=e._reactInternals;if(t===void 0)throw typeof e.render=="function"?Error(c(188)):(e=Object.keys(e).join(","),Error(c(268,e)));return e=vr(t),e=e===null?null:e.stateNode,e},yt.flushSync=function(e){return rr(e)},yt.hydrate=function(e,t,n){if(!Ui(t))throw Error(c(200));return Wi(null,e,t,!0,n)},yt.hydrateRoot=function(e,t,n){if(!La(e))throw Error(c(405));var r=n!=null&&n.hydratedSources||null,l=!1,i="",a=uc;if(n!=null&&(n.unstable_strictMode===!0&&(l=!0),n.identifierPrefix!==void 0&&(i=n.identifierPrefix),n.onRecoverableError!==void 0&&(a=n.onRecoverableError)),t=ac(t,null,e,1,n??null,l,!1,i,a),e[ln]=t.current,gl(e),r)for(e=0;e<r.length;e++)n=r[e],l=n._getVersion,l=l(n._source),t.mutableSourceEagerHydrationData==null?t.mutableSourceEagerHydrationData=[n,l]:t.mutableSourceEagerHydrationData.push(n,l);return new Bi(t)},yt.render=function(e,t,n){if(!Ui(t))throw Error(c(200));return Wi(null,e,t,!1,n)},yt.unmountComponentAtNode=function(e){if(!Ui(e))throw Error(c(40));return e._reactRootContainer?(rr(function(){Wi(null,null,e,!1,function(){e._reactRootContainer=null,e[ln]=null})}),!0):!1},yt.unstable_batchedUpdates=ba,yt.unstable_renderSubtreeIntoContainer=function(e,t,n,r){if(!Ui(n))throw Error(c(200));if(e==null||e._reactInternals===void 0)throw Error(c(38));return Wi(e,t,n,!1,r)},yt.version="18.3.1-next-f1338f8080-20240426",yt}var xc;function kp(){if(xc)return Ma.exports;xc=1;function u(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(u)}catch(y){console.error(y)}}return u(),Ma.exports=wp(),Ma.exports}var zc;function bp(){if(zc)return Qi;zc=1;var u=kp();return Qi.createRoot=u.createRoot,Qi.hydrateRoot=u.hydrateRoot,Qi}var Sp=bp();const jp=_c(Sp),Cp="http://localhost:3000";async function fn(u,y={}){let c;try{c=await fetch(`${Cp}${u}`,{headers:{"Content-Type":"application/json"},...y})}catch{const W=new Error("Network error. Please check your connection.");throw W.isNetworkError=!0,W}const I=await c.json().catch(()=>({}));if(!c.ok){const E=new Error(I.message||"Something went wrong. Please try again.");throw E.status=c.status,E.data=I.data,E}return I}const Np=()=>fn("/api/category/public"),wc=()=>fn("/api/dish/public"),kc=()=>fn("/api/deal/public"),Ep=()=>fn("/api/hero-slide/public"),_p=u=>fn("/api/order/public/checkout",{method:"POST",body:JSON.stringify(u)}),bc=u=>fn(`/api/order/public/${u}`),Pp=u=>fn(`/api/order/public/${u}/cancel`,{method:"PATCH"}),Tp=u=>fn(`/api/order/public/lookup?phone=${encodeURIComponent(u)}`),Sc=()=>fn("/api/settings"),Lp="http://localhost:3000",tn=u=>u?u.startsWith("http://")||u.startsWith("https://")?u:u.startsWith("/uploads/")?`${Lp}${u}`:u:"",Il="/assets/genz-pizza-land-logo-CQKpkaM4.jpg",Rl={enabled:!0,minItems:3,discount3:15,discount4:17,discount5Plus:20},Fa=u=>{const y=(I,E)=>typeof I=="number"&&!Number.isNaN(I)?I:E,c=u&&typeof u=="object"?u:{};return{enabled:typeof c.enabled=="boolean"?c.enabled:Rl.enabled,minItems:Math.max(1,Math.round(y(c.minItems,Rl.minItems))),discount3:y(c.discount3,Rl.discount3),discount4:y(c.discount4,Rl.discount4),discount5Plus:y(c.discount5Plus,Rl.discount5Plus)}},qi=(u,y)=>!y.enabled||u<y.minItems?0:u>=5?y.discount5Plus:u===4?y.discount4:y.discount3,Nt=u=>`${Number.isInteger(u)?u:Number(u.toFixed(1))}%`,Yi=u=>{const y=Number(u)||0;return`Rs ${y.toLocaleString("en-PK",{minimumFractionDigits:Number.isInteger(y)?0:2,maximumFractionDigits:2})}`},Tc=(u,y)=>{const c=y.minItems-u;if(u===0)return`Pick ${y.minItems} items to unlock ${Nt(y.discount3)} off`;if(c>0)return`Add ${c} more item${c===1?"":"s"} to unlock ${Nt(y.discount3)} off`;const I=qi(u,y),E=u>=5?null:u+1,W=E?qi(E,y):null;return W&&W>I?`${Nt(I)} off unlocked — add 1 more item for ${Nt(W)} off`:u>=5?`Best discount unlocked — ${Nt(I)} off your picks`:`${Nt(I)} off unlocked`},Rp=`
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
  background: rgba(255, 200, 61, 0.22);
  border: 1px solid rgba(255, 200, 61, 0.65);
  color: var(--gold);
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
`,Ip=({cfg:u,pickedCount:y,onStart:c})=>o.jsx("section",{className:"gzp-byo-section","aria-label":"Build your own deal",children:o.jsx("div",{className:"gzp-shell",children:o.jsxs("div",{className:"gzp-byo-banner",children:[o.jsxs("div",{style:{position:"relative",zIndex:1},children:[o.jsx("span",{className:"gzp-byo-eyebrow",children:"🎯 Make it yours"}),o.jsxs("h2",{children:["Build your ",o.jsx("em",{children:"own deal"})]}),o.jsxs("p",{children:["Pick any ",u.minItems," or more items from our menu — pizzas, burgers, wings, drinks, anything. The more you add, the more you save. No codes, the discount applies automatically."]}),o.jsx("button",{type:"button",className:"gzp-btn gzp-btn-primary",onClick:c,children:y>0?`Edit your deal (${y} item${y===1?"":"s"})`:"Start building"})]}),o.jsxs("div",{className:"gzp-byo-tiers",children:[o.jsxs("div",{className:"gzp-byo-tier",children:[o.jsx("b",{children:Nt(u.discount3)}),o.jsx("small",{children:"off"}),o.jsxs("span",{children:[u.minItems," items"]})]}),o.jsxs("div",{className:"gzp-byo-tier",children:[o.jsx("b",{children:Nt(u.discount4)}),o.jsx("small",{children:"off"}),o.jsx("span",{children:"4 items"})]}),o.jsxs("div",{className:"gzp-byo-tier is-best",children:[o.jsx("b",{children:Nt(u.discount5Plus)}),o.jsx("small",{children:"off"}),o.jsx("span",{children:"5+ items"})]})]})]})})}),Mp=u=>{const y=[];return((u==null?void 0:u.variants)||[]).forEach(c=>{c.size&&!y.includes(c.size)&&y.push(c.size)}),y},Op=(u,y)=>{const c=[];return((u==null?void 0:u.variants)||[]).forEach(I=>{I.size===y&&I.crust&&!c.includes(I.crust)&&c.push(I.crust)}),c},Lc=(u,y,c)=>((u==null?void 0:u.variants)||[]).find(I=>I.size===y&&(I.crust||"")===(c||""))||null,Rc=(u,y="",c="")=>`${u}:${y||""}||${c||""}`,Dp=({dish:u,picks:y,dishQty:c,stockLeft:I,onAdd:E,onRemove:W})=>{const de=L.useMemo(()=>Mp(u),[u]),X=de.length>0,[Q,ze]=L.useState(de[0]||""),B=L.useMemo(()=>Op(u,Q),[u,Q]),[V,ae]=L.useState(B[0]||""),[re,we]=L.useState(!1);L.useEffect(()=>{B.length>0&&!B.includes(V)?ae(B[0]):B.length===0&&V!==""&&ae("")},[Q]);const ie=X?Lc(u,Q,V):null,se=X?(u.variants||[]).reduce((q,$e)=>q===null||$e.price<q.price?$e:q,null):null,ce=X?(ie==null?void 0:ie.price)??(se==null?void 0:se.price)??u.price:u.price,_e=Rc(u._id,Q,V),Pe=y[_e]||0,pe=c,Le=typeof u.availableQty=="number"&&I<=0&&pe===0,Se=typeof u.availableQty=="number"&&I<=0,ve=(!X||!!ie)&&!Se,ke=tn(u.image);return o.jsxs("div",{className:`gzp-byo-tile${pe>0?" is-picked":""}`,children:[o.jsxs("div",{className:"gzp-byo-tile-media",children:[ke&&!re?o.jsx("img",{src:ke,alt:u.name,loading:"lazy",onError:()=>we(!0)}):o.jsx("span",{"aria-hidden":"true",children:u.icon||"🍽️"}),pe>0&&o.jsxs("span",{className:"gzp-byo-badge",children:["×",pe]})]}),o.jsxs("div",{className:"gzp-byo-tile-body",children:[o.jsx("h4",{children:u.name}),o.jsxs("div",{className:"gzp-byo-price",children:[X&&o.jsx("small",{children:"From"}),Yi(ce)]}),X&&o.jsxs("div",{className:"gzp-byo-selects",children:[o.jsx("select",{className:"gzp-select",value:Q,onChange:q=>ze(q.target.value),"aria-label":`Size for ${u.name}`,children:de.map(q=>o.jsx("option",{value:q,children:q},q))}),B.length>0&&o.jsx("select",{className:"gzp-select",value:V,onChange:q=>ae(q.target.value),"aria-label":`Crust for ${u.name}`,children:B.map(q=>o.jsx("option",{value:q,children:q},q))})]}),o.jsx("div",{className:"gzp-byo-tile-foot",children:Pe>0?o.jsxs("div",{className:"gzp-stepper",style:{width:"100%",justifyContent:"space-between"},children:[o.jsx("button",{type:"button",onClick:()=>W(_e),"aria-label":`Remove one ${u.name}`,children:"−"}),o.jsx("span",{"aria-live":"polite",children:Pe}),o.jsx("button",{type:"button",disabled:!ve,onClick:()=>E(u,Q,V),"aria-label":`Add one more ${u.name}`,children:"+"})]}):o.jsx("button",{type:"button",className:"gzp-byo-add",disabled:!ve,onClick:()=>E(u,Q,V),children:Le?"Sold out":"+ Add"})})]})]})},Fp=({cfg:u,dishes:y,categories:c,initialPicks:I,getOtherQty:E,onClose:W,onConfirm:de})=>{const[X,Q]=L.useState(()=>({...I||{}})),[ze,B]=L.useState("all");L.useEffect(()=>{const P=document.body.style.overflow;document.body.style.overflow="hidden";const G=O=>O.key==="Escape"&&W();return window.addEventListener("keydown",G),()=>{document.body.style.overflow=P,window.removeEventListener("keydown",G)}},[W]);const V=L.useMemo(()=>{const P={};return y.forEach(G=>{P[G._id]=G}),P},[y]),ae=L.useMemo(()=>{const P=new Map;y.forEach(j=>{var S;const le=((S=j.category)==null?void 0:S._id)||j.category||"other";P.has(le)||P.set(le,[]),P.get(le).push(j)});const G=c.filter(j=>(P.get(j._id)||[]).length>0).map(j=>({id:j._id,name:j.name,items:P.get(j._id)})),O=new Set(c.map(j=>j._id)),N=y.filter(j=>{var le;return!O.has(((le=j.category)==null?void 0:le._id)||j.category)});return N.length&&G.push({id:"other",name:"More to eat",items:N}),G},[y,c]),re=P=>Object.entries(X).reduce((G,[O,N])=>O.startsWith(`${P}:`)?G+N:G,0),we=P=>typeof P.availableQty=="number"?P.availableQty-re(P._id)-(E?E(P._id):0):1/0,ie=(P,G,O)=>{if(we(P)<=0)return;const N=Rc(P._id,G,O);Q(j=>({...j,[N]:(j[N]||0)+1}))},se=P=>Q(G=>{const O={...G,[P]:Math.max(0,(G[P]||0)-1)};return O[P]===0&&delete O[P],O}),{count:ce,gross:_e}=L.useMemo(()=>{let P=0,G=0;return Object.entries(X).forEach(([O,N])=>{const[j,le="||"]=O.split(/:(.+)/),S=V[j];if(!S)return;const[$,M]=le.split("||"),g=$?Lc(S,$,M):null;P+=N,G+=(g?g.price:S.price)*N}),{count:P,gross:G}},[X,V]),Pe=qi(ce,u),pe=Math.round(_e*Pe/100),Le=_e-pe,Se=ce>=u.minItems,ve=[{n:u.minItems,label:Nt(u.discount3)},{n:4,label:Nt(u.discount4)},{n:5,label:Nt(u.discount5Plus)}].filter((P,G,O)=>G===0||P.n>O[G-1].n),ke=ve[ve.length-1].n,q=P=>`${P/ke*100}%`,$e=`${Math.min(ce,ke)/ke*100}%`,Ne=ze==="all"?ae:ae.filter(P=>P.id===ze);return o.jsx("div",{className:"gzp-byo-overlay",onClick:W,children:o.jsxs("div",{className:"gzp-byo-panel",onClick:P=>P.stopPropagation(),role:"dialog","aria-modal":"true","aria-label":"Build your own deal",children:[o.jsxs("div",{className:"gzp-byo-head",children:[o.jsxs("div",{children:[o.jsx("h2",{children:"🎯 Build your own deal"}),o.jsxs("p",{children:["Choose at least ",u.minItems," items — your discount grows with every item."]})]}),o.jsx("button",{className:"gzp-icon-btn",type:"button",onClick:W,"aria-label":"Close",children:"✕"})]}),o.jsxs("div",{className:"gzp-byo-progress",children:[o.jsxs("div",{className:"gzp-byo-track",role:"progressbar","aria-valuemin":0,"aria-valuemax":ke,"aria-valuenow":Math.min(ce,ke),children:[o.jsx("div",{className:"gzp-byo-fill",style:{width:$e}}),ve.map(P=>o.jsxs("div",{className:`gzp-byo-mark${ce>=P.n?" is-hit":""}`,style:{left:q(P.n)},children:[P.n===ke&&P.n>=5?`${P.n}+`:P.n,o.jsxs("span",{children:[P.label," off"]})]},P.n))]}),o.jsx("p",{className:`gzp-byo-nudge${Se?" is-ok":""}`,children:Tc(ce,u)})]}),o.jsxs("div",{className:"gzp-byo-cats",role:"tablist","aria-label":"Menu categories",children:[o.jsx("button",{type:"button",className:`gzp-byo-cat${ze==="all"?" is-active":""}`,onClick:()=>B("all"),children:"All"}),ae.map(P=>o.jsx("button",{type:"button",className:`gzp-byo-cat${ze===P.id?" is-active":""}`,onClick:()=>B(P.id),children:P.name},P.id))]}),o.jsx("div",{className:"gzp-byo-body",children:Ne.map(P=>o.jsxs("div",{className:"gzp-byo-group",children:[o.jsx("h3",{children:P.name}),o.jsx("div",{className:"gzp-byo-grid",children:P.items.map(G=>o.jsx(Dp,{dish:G,picks:X,dishQty:re(G._id),stockLeft:we(G),onAdd:ie,onRemove:se},G._id))})]},P.id))}),o.jsxs("div",{className:"gzp-byo-foot",children:[o.jsxs("div",{className:"gzp-byo-sum",children:[o.jsxs("small",{children:[ce," item",ce===1?"":"s"," picked"]}),o.jsxs("div",{children:[o.jsx("b",{children:Yi(Le)}),pe>0&&o.jsx("s",{children:Yi(_e)}),pe>0&&o.jsxs("em",{children:["You save ",Yi(pe)]})]})]}),o.jsx("button",{type:"button",className:"gzp-btn gzp-btn-primary",disabled:!Se,onClick:()=>de(X),children:Se?`Add to my order · ${Nt(Pe)} off`:`Pick ${u.minItems-ce} more to continue`})]})]})})},$p="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,400..900&family=Hanken+Grotesk:wght@400..800&display=swap",Ap=`
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
  --shell: 1200px;
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
    padding: 0 28px;
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
    padding: 0 28px;
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
    padding: 0 28px;
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
`;(()=>{if(typeof document>"u")return;if(!document.getElementById("gzp-fonts")){const y=document.createElement("link");y.rel="preconnect",y.href="https://fonts.googleapis.com",document.head.appendChild(y);const c=document.createElement("link");c.rel="preconnect",c.href="https://fonts.gstatic.com",c.crossOrigin="",document.head.appendChild(c);const I=document.createElement("link");I.id="gzp-fonts",I.rel="stylesheet",I.href=$p,document.head.appendChild(I)}let u=document.getElementById("gzp-styles");if(u||(u=document.createElement("style"),u.id="gzp-styles",document.head.appendChild(u)),u.textContent=Ap+Rp,!document.querySelector('meta[name="theme-color"]')){const y=document.createElement("meta");y.name="theme-color",y.content="#FFF8EF",document.head.appendChild(y)}})();const Bp=16,jc=["Pending","Accepted","Preparing","Ready to Deliver","Completed"],Cc={Pending:"Order received",Accepted:"Accepted by the kitchen",Preparing:"Preparing your food","Ready to Deliver":"Out for delivery",Completed:"Delivered",Cancelled:"Cancelled"},Up={Pending:"We've got your order",Accepted:"The kitchen is on it",Preparing:"Your food is cooking","Ready to Deliver":"On the way to you",Completed:"Delivered — enjoy",Cancelled:"Order cancelled"},$a="deals",Wp="923259061006",Hp=`https://wa.me/${Wp}?text=${encodeURIComponent("Hello GenZ Pizza Land, I have an inquiry.")}`,Qp=1e4,xt=u=>{const y=Number(u)||0;return`Rs ${y.toLocaleString("en-PK",{minimumFractionDigits:Number.isInteger(y)?0:2,maximumFractionDigits:2})}`},Wa=u=>{const y=[];return((u==null?void 0:u.variants)||[]).forEach(c=>{c.size&&!y.includes(c.size)&&y.push(c.size)}),y},Ki=(u,y)=>{const c=[];return((u==null?void 0:u.variants)||[]).forEach(I=>{I.size===y&&I.crust&&!c.includes(I.crust)&&c.push(I.crust)}),c},Ha=(u,y,c)=>((u==null?void 0:u.variants)||[]).find(I=>I.size===y&&(I.crust||"")===(c||""))||null,Ic=u=>((u==null?void 0:u.variants)||[]).reduce((y,c)=>y===null||c.price<y.price?c:y,null),Vi=u=>{let y=u.replace(/[^\d+]/g,"");return y=y[0]==="+"?"+"+y.slice(1).replace(/\+/g,""):y.replace(/\+/g,""),y.slice(0,14)},Nc=u=>{const y=u.replace(/\D/g,"");return y.length>=10&&y.length<=13},Ar={width:20,height:20,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:1.8,strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",focusable:"false"},Mc=u=>o.jsxs("svg",{...Ar,...u,children:[o.jsx("circle",{cx:"11",cy:"11",r:"7"}),o.jsx("path",{d:"m20 20-3.2-3.2"})]}),Vp=u=>o.jsxs("svg",{...Ar,...u,children:[o.jsx("path",{d:"M6 8h12l-1 11H7L6 8Z"}),o.jsx("path",{d:"M9.5 8V6.5a2.5 2.5 0 0 1 5 0V8"})]}),Yp=u=>o.jsx("svg",{...Ar,strokeWidth:2.4,...u,children:o.jsx("path",{d:"M12 5v14M5 12h14"})}),Aa=({dir:u="right",...y})=>o.jsx("svg",{...Ar,strokeWidth:2,...y,children:o.jsx("path",{d:u==="left"?"m14.5 5-7 7 7 7":"m9.5 5 7 7-7 7"})}),Ec=u=>o.jsxs("svg",{...Ar,...u,children:[o.jsx("path",{d:"M3 7h11v9H3zM14 10h4l3 3v3h-7z"}),o.jsx("circle",{cx:"7",cy:"18",r:"1.6"}),o.jsx("circle",{cx:"17.5",cy:"18",r:"1.6"})]}),Kp=({filled:u,...y})=>o.jsx("svg",{...Ar,strokeWidth:2,fill:u?"currentColor":"none",...y,children:o.jsx("path",{d:"M12 20.5s-7.3-4.6-9.9-9.1C.5 8 1.9 4.6 5.1 3.6c2-.6 4.1.1 5.4 1.8l1.5 2 1.5-2c1.3-1.7 3.4-2.4 5.4-1.8 3.2 1 4.6 4.4 3 7.8-2.6 4.5-9.9 9.1-9.9 9.1Z"})}),Xi=({price:u,originalPrice:y,from:c})=>o.jsxs("p",{className:"gzp-price",children:[c&&o.jsx("span",{className:"gzp-price-from",children:"From"}),xt(u),y>u&&o.jsx("s",{children:xt(y)})]}),Qa=({src:u,alt:y,icon:c,className:I})=>{const[E,W]=L.useState(!1);return L.useEffect(()=>W(!1),[u]),u&&!E?o.jsx("img",{src:u,alt:y,className:I,loading:"lazy",onError:()=>W(!0)}):o.jsx("div",{className:"gzp-media-fallback",children:c||"🍽️"})},ar=u=>typeof u!="number"?null:u<=0?{text:"Sold out",out:!0}:u<=5?{text:`Only ${u} left`,out:!1}:null,Xp=({slides:u,onSlideClick:y})=>{var ze;const[c,I]=L.useState(0),[E,W]=L.useState(!1),de=L.useRef(typeof window<"u"&&((ze=window.matchMedia)==null?void 0:ze.call(window,"(prefers-reduced-motion: reduce)").matches)).current;if(L.useEffect(()=>{if(u.length<=1||E||de)return;const B=setInterval(()=>I(V=>(V+1)%u.length),4200);return()=>clearInterval(B)},[u.length,E,de]),L.useEffect(()=>{c>=u.length&&I(0)},[u.length,c]),u.length===0)return o.jsx("div",{className:"gzp-slider","aria-hidden":"true",children:o.jsx("div",{className:"gzp-slider-fallback",children:o.jsx("img",{src:Il,alt:""})})});const X=u[c],Q=!!y;return o.jsxs("div",{className:"gzp-slider",onMouseEnter:()=>W(!0),onMouseLeave:()=>W(!1),onTouchStart:()=>W(!0),onTouchEnd:()=>W(!1),onClick:Q?()=>y(X):void 0,role:Q?"button":void 0,tabIndex:Q?0:void 0,onKeyDown:Q?B=>{(B.key==="Enter"||B.key===" ")&&y(X)}:void 0,children:[u.map((B,V)=>o.jsx("img",{src:B.url,alt:B.alt||"","aria-hidden":V!==c||void 0,className:`gzp-slider-img${V===c?" is-active":""}`},B.url+V)),u.length>1&&o.jsx("div",{className:"gzp-slider-dots",role:"tablist","aria-label":"Featured photos",children:u.map((B,V)=>o.jsx("button",{type:"button",role:"tab","aria-selected":V===c,"aria-label":`Show photo ${V+1} of ${u.length}`,className:`gzp-slider-dot${V===c?" is-active":""}`,onClick:ae=>{ae.stopPropagation(),I(V)}},V))})]})},Gp=()=>o.jsxs("svg",{viewBox:"0 0 140 140",className:"gzp-thankyou-mascot","aria-hidden":"true",children:[o.jsxs("g",{stroke:"#e0b84a",strokeWidth:"3",strokeLinecap:"round",fill:"none",opacity:"0.75",children:[o.jsx("path",{d:"M52 20 C 47 12, 57 9, 53 1"}),o.jsx("path",{d:"M70 20 C 65 12, 75 9, 71 1"}),o.jsx("path",{d:"M88 20 C 83 12, 93 9, 89 1"})]}),o.jsx("path",{d:"M20 32 L120 32 L70 132 Z",fill:"#ffcf5c",stroke:"#e0a92e",strokeWidth:"4",strokeLinejoin:"round"}),o.jsx("path",{d:"M20 32 Q70 47 120 32",fill:"none",stroke:"#e0a92e",strokeWidth:"4",strokeLinecap:"round"}),o.jsx("circle",{cx:"52",cy:"58",r:"6",fill:"#e6503d"}),o.jsx("circle",{cx:"88",cy:"62",r:"6",fill:"#e6503d"}),o.jsx("circle",{cx:"70",cy:"90",r:"6",fill:"#e6503d"}),o.jsx("circle",{cx:"56",cy:"76",r:"5.5",fill:"#3a2b1a"}),o.jsx("circle",{cx:"84",cy:"76",r:"5.5",fill:"#3a2b1a"}),o.jsx("path",{d:"M60 96 Q70 104 80 96",stroke:"#3a2b1a",strokeWidth:"3.5",fill:"none",strokeLinecap:"round"})]}),qp=({order:u,onTrack:y,onContinue:c})=>{const I=String((u==null?void 0:u._id)||"").slice(-6).toUpperCase();return o.jsx("div",{className:"gzp-thankyou-overlay",role:"dialog","aria-modal":"true","aria-label":"Order confirmed",children:o.jsxs("div",{className:"gzp-thankyou-card",children:[o.jsx("span",{className:"gzp-thankyou-sticker tl","aria-hidden":"true",children:"🎉"}),o.jsx("span",{className:"gzp-thankyou-sticker tr","aria-hidden":"true",children:"🍕"}),o.jsx("span",{className:"gzp-thankyou-sticker bl","aria-hidden":"true",children:"🧀"}),o.jsx("span",{className:"gzp-thankyou-sticker br","aria-hidden":"true",children:"🎊"}),o.jsx("div",{className:"gzp-thankyou-badge",children:o.jsx("img",{src:Il,alt:"GenZ Pizza Land"})}),o.jsx(Gp,{}),o.jsx("h2",{className:"gzp-thankyou-title",children:"Thank you! 🎉"}),o.jsx("p",{className:"gzp-thankyou-sub",children:"Your order's in and the kitchen's already looking at it."}),I&&o.jsxs("span",{className:"gzp-thankyou-pill",children:["Order #",I]}),o.jsx("button",{type:"button",className:"gzp-thankyou-track-btn",onClick:y,children:"Track My Order"}),o.jsx("button",{type:"button",className:"gzp-thankyou-link",onClick:c,children:"Click for more order"})]})})},Gi=({qty:u,onAdd:y,onRemove:c,size:I,label:E})=>o.jsxs("div",{className:`gzp-stepper${I==="lg"?" gzp-stepper-lg":""}`,children:[o.jsx("button",{type:"button",onClick:c,"aria-label":`Remove one ${E}`,children:"−"}),o.jsx("span",{"aria-live":"polite",children:u}),o.jsx("button",{type:"button",onClick:y,"aria-label":`Add one more ${E}`,children:"+"})]}),Zp=({dish:u,cart:y,cartKey:c,addToCart:I,removeFromCart:E,onOpenQuickView:W})=>{const de=L.useMemo(()=>Wa(u),[u]),X=de.length>0,[Q,ze]=L.useState(de[0]||""),B=L.useMemo(()=>Ki(u,Q),[u,Q]),[V,ae]=L.useState(B[0]||""),[re,we]=L.useState(!1);L.useEffect(()=>{B.length>0&&!B.includes(V)?ae(B[0]):B.length===0&&V!==""&&ae("")},[Q]);const ie=X?Ha(u,Q,V):null,se=X?Ic(u):null,ce=X?(ie==null?void 0:ie.price)??(se==null?void 0:se.price)??u.price:u.price,_e=X?(ie==null?void 0:ie.originalPrice)??0:u.originalPrice,Pe=c("dish",u._id,Q,V),pe=y[Pe]||0,Le=ar(u.availableQty),Se=!!(Le!=null&&Le.out),ve=(!X||!!ie)&&!Se,ke=()=>W(u);return o.jsxs("div",{className:"gzp-card",children:[o.jsxs("div",{className:"gzp-card-media",role:"button",tabIndex:0,onClick:ke,onKeyDown:q=>q.key==="Enter"&&ke(),children:[o.jsx(Qa,{src:tn(u.image),alt:u.name,icon:u.icon}),Le&&o.jsx("span",{className:`gzp-stock${Le.out?" is-out":""}`,children:Le.text}),!X&&u.originalPrice>u.price&&o.jsxs("span",{className:"gzp-save",children:["Save ",Math.round((u.originalPrice-u.price)/u.originalPrice*100),"%"]}),o.jsx("button",{type:"button",className:`gzp-wish${re?" is-active":""}`,onClick:q=>{q.stopPropagation(),we($e=>!$e)},"aria-pressed":re,"aria-label":re?`Remove ${u.name} from favourites`:`Add ${u.name} to favourites`,children:o.jsx(Kp,{filled:re})})]}),o.jsxs("div",{className:"gzp-card-body",children:[o.jsx("h3",{role:"button",tabIndex:0,onClick:ke,onKeyDown:q=>q.key==="Enter"&&ke(),children:u.name}),o.jsx(Xi,{price:ce,originalPrice:_e,from:X}),u.description&&o.jsx("p",{className:"gzp-card-desc",children:u.description}),X&&o.jsxs("div",{className:"gzp-variant-row",onClick:q=>q.stopPropagation(),role:"presentation",children:[o.jsx("select",{className:"gzp-select",value:Q,onChange:q=>ze(q.target.value),"aria-label":`Size for ${u.name}`,children:de.map(q=>o.jsx("option",{value:q,children:q},q))}),B.length>0&&o.jsx("select",{className:"gzp-select",value:V,onChange:q=>ae(q.target.value),"aria-label":`Crust for ${u.name}`,children:B.map(q=>o.jsx("option",{value:q,children:q},q))})]}),o.jsx("div",{className:"gzp-card-foot",onClick:q=>q.stopPropagation(),role:"presentation",children:pe?o.jsx(Gi,{qty:pe,label:u.name,onAdd:()=>I("dish",u._id,u.name,Q,V),onRemove:()=>E("dish",u._id,Q,V)}):o.jsx("button",{type:"button",className:"gzp-add gzp-add-wide",disabled:!ve,onClick:()=>I("dish",u._id,u.name,Q,V),children:Se?"Sold out":o.jsxs(o.Fragment,{children:[o.jsx(Yp,{})," Add"]})})})]})]})},Jp=()=>o.jsxs("div",{className:"gzp-skeleton",children:[o.jsx("div",{className:"gzp-skeleton-media"}),o.jsxs("div",{className:"gzp-skeleton-lines",children:[o.jsx("i",{}),o.jsx("i",{})]})]}),ef=()=>o.jsx("a",{className:"gzp-whatsapp",href:Hp,target:"_blank",rel:"noopener noreferrer","aria-label":"Chat with us on WhatsApp for any inquiry",title:"WhatsApp inquiry: +92 325 9061006",children:o.jsx("svg",{viewBox:"0 0 32 32",width:"30",height:"30","aria-hidden":"true",fill:"#fff",children:o.jsx("path",{d:"M16.03 3C9.4 3 4 8.38 4 15c0 2.12.56 4.19 1.62 6.01L4 29l8.2-1.58A12.02 12.02 0 0 0 16.03 27C22.66 27 28 21.62 28 15S22.66 3 16.03 3zm0 21.9c-1.8 0-3.56-.48-5.1-1.4l-.37-.22-4.86.94.98-4.73-.24-.39A9.86 9.86 0 0 1 6.1 15c0-5.46 4.45-9.9 9.93-9.9S26 9.54 26 15s-4.5 9.9-9.97 9.9zm5.44-7.4c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.27-.47-2.42-1.49-.9-.8-1.5-1.78-1.67-2.08-.17-.3-.02-.46.13-.61.14-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.05 1.03-1.05 2.5s1.08 2.9 1.23 3.1c.15.2 2.12 3.23 5.13 4.53.72.31 1.28.5 1.71.63.72.23 1.37.2 1.89.12.58-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.13-.27-.2-.57-.35z"})})}),Ba=({minimal:u,cartCount:y,onSearch:c,onCart:I})=>o.jsx("header",{className:"gzp-header",children:o.jsxs("div",{className:"gzp-header-inner",children:[o.jsxs("button",{className:"gzp-brand",onClick:()=>window.scrollTo({top:0,behavior:"smooth"}),type:"button",children:[o.jsx("img",{src:Il,alt:"",className:"gzp-brand-mark"}),o.jsxs("span",{className:"gzp-brand-name",children:["GenZ Pizza Land",o.jsx("span",{className:"gzp-brand-sub",children:"Delivered hot across Gojra"})]})]}),!u&&o.jsxs(o.Fragment,{children:[o.jsx("button",{className:"gzp-icon-btn",onClick:c,"aria-label":"Search the menu",type:"button",children:o.jsx(Mc,{})}),o.jsxs("button",{className:"gzp-icon-btn gzp-cart-btn",onClick:I,"aria-label":`Your order, ${y} item${y===1?"":"s"}`,type:"button",children:[o.jsx(Vp,{}),y>0&&o.jsx("span",{className:"gzp-cart-count",children:y})]})]})]})});function tf(){var Yn,Ul,Jr,Kn,wt,Wl;const[u,y]=L.useState([]),[c,I]=L.useState([]),[E,W]=L.useState([]),[de,X]=L.useState([]),[Q,ze]=L.useState(Bp),[B,V]=L.useState(()=>Fa(null)),[ae,re]=L.useState(!1),[we,ie]=L.useState({}),[se,ce]=L.useState(!1),[_e,Pe]=L.useState(!1),[pe,Le]=L.useState(!0),[Se,ve]=L.useState(""),[ke,q]=L.useState(!1),[$e,Ne]=L.useState(!1),[P,G]=L.useState(()=>localStorage.getItem("gzp_last_order")||null),[O,N]=L.useState(null),[j,le]=L.useState(!1),[S,$]=L.useState(!1),M=O&&!["Completed","Closed","Cancelled"].includes(O.orderStatus),[g,w]=L.useState({name:"",phone:"",address:""}),[ue,fe]=L.useState($a);L.useEffect(()=>{let s=null;const v=()=>{document.body.classList.add("is-scrolling"),s&&clearTimeout(s),s=setTimeout(()=>document.body.classList.remove("is-scrolling"),150)};return window.addEventListener("scroll",v,{passive:!0,capture:!0}),()=>{window.removeEventListener("scroll",v,{capture:!0}),s&&clearTimeout(s),document.body.classList.remove("is-scrolling")}},[]);const[he,ge]=L.useState(!1),[je,Ee]=L.useState(""),[T,De]=L.useState(null),[Ot,Bn]=L.useState(""),[Et,nn]=L.useState(""),[gn,Un]=L.useState({});L.useEffect(()=>{if((T==null?void 0:T.type)==="dish"){const v=Wa(T.item)[0]||"";Bn(v),nn(Ki(T.item,v)[0]||""),Un({})}else if((T==null?void 0:T.type)==="deal"){Bn(""),nn("");const s={};(T.item.items||[]).forEach((v,z)=>{var ee;if(!v.customizable)return;const R=(v.flavourOptions||[])[0];if(!R)return;const D=(ee=R.variants)==null?void 0:ee[0];s[z]={dishId:R._id,size:(D==null?void 0:D.size)||"",crust:(D==null?void 0:D.crust)||""}}),Un(s)}else Bn(""),nn(""),Un({})},[T]);const[sr,Br]=L.useState(""),[mn,Dt]=L.useState(!1),[rn,Wn]=L.useState(""),[Ur,Wr]=L.useState(!1),[Hr,ur]=L.useState(""),cr=L.useRef(null),Hn=L.useRef(null),dr=L.useRef(null);L.useEffect(()=>{(async()=>{var s,v;try{const[z,R,D,ee,Z]=await Promise.all([Np(),wc(),kc().catch(()=>({data:[]})),Ep().catch(()=>({data:[]})),Sc().catch(()=>null)]);y(z.data||[]),I(R.data||[]),W(D.data||[]),X(ee.data||[]);const ye=(s=Z==null?void 0:Z.data)==null?void 0:s.taxRatePercent;typeof ye=="number"&&ze(ye),(v=Z==null?void 0:Z.data)!=null&&v.buildYourOwnDeal&&V(Fa(Z.data.buildYourOwnDeal))}catch(z){ve(z.message)}finally{Le(!1)}})()},[]),L.useEffect(()=>{if(!P)return;let s=!1;const v=async()=>{try{const R=await bc(P);s||N(R.data)}catch(R){if(s)return;R.status===404&&(localStorage.removeItem("gzp_last_order"),G(null),N(null))}};v();const z=setInterval(v,8e3);return()=>{s=!0,clearInterval(z)}},[P]),L.useEffect(()=>()=>clearTimeout(dr.current),[]);const Qt=L.useMemo(()=>{const s=new Map;c.forEach(D=>{var Z;const ee=((Z=D.category)==null?void 0:Z._id)||D.category||"other";s.has(ee)||s.set(ee,[]),s.get(ee).push(D)});const v=u.filter(D=>(s.get(D._id)||[]).length>0).map(D=>({id:D._id,name:D.name,icon:D.icon,description:D.description,items:s.get(D._id)})),z=new Set(u.map(D=>D._id)),R=c.filter(D=>{var ee;return!z.has(((ee=D.category)==null?void 0:ee._id)||D.category)});return R.length>0&&v.push({id:"other",name:"More to eat",icon:"🍽️",items:R}),v},[u,c]),_t=L.useMemo(()=>{const s=Qt.map(v=>({id:v.id,name:v.name}));return E.length>0&&s.unshift({id:$a,name:"Deals"}),s},[Qt,E]),Zi=L.useMemo(()=>{const s={};return u.forEach(v=>{s[v._id]=v.name}),s},[u]),Qr=L.useMemo(()=>{const s=je.trim().toLowerCase();if(!s)return[];const v=[];return E.forEach(z=>{z.name.toLowerCase().includes(s)&&v.push({type:"deal",item:z})}),c.forEach(z=>{z.name.toLowerCase().includes(s)&&v.push({type:"dish",item:z})}),v.slice(0,20)},[je,c,E]),Vt=(s,v,z="",R="")=>`${s}:${v}:${z||""}||${R||""}`,Ml=s=>{try{return`sel:${btoa(encodeURIComponent(JSON.stringify(s)))}`}catch{return"sel:"}},Vr=s=>{if(!s||!s.startsWith("sel:"))return null;try{return JSON.parse(decodeURIComponent(atob(s.slice(4))))}catch{return null}},hn=s=>((s==null?void 0:s.items)||[]).some(v=>v.customizable),Ft=L.useMemo(()=>Object.entries(we).filter(([,s])=>s>0).map(([s,v])=>{const[z,R,D="||"]=s.split(":"),ee=z==="deal"?E.find(Ue=>Ue._id===R):c.find(Ue=>Ue._id===R);if(!ee)return null;const[Z,ye]=D.split("||");let Te=ee.price,Ge=ee.originalPrice,Ie="",it=null;if((z==="dish"||z==="byo")&&Z){const Ue=Ha(ee,Z,ye);Ue&&(Te=Ue.price,Ge=Ue.originalPrice,Ie=[Ue.size,Ue.crust].filter(Boolean).join(", "))}if(z==="deal"){const Ue=Vr(Z);Ue&&(it=Ue,Ie=Object.values(Ue).map(kt=>{const J=c.find(xe=>xe._id===kt.dishId);return J?[kt.size,J.name].filter(Boolean).join(" "):null}).filter(Boolean).join(", "))}return{type:z,item:ee,qty:v,key:s,size:Z,crust:ye,unitPrice:Te,unitOriginalPrice:Ge,variantLabel:Ie,dealSelections:it}}).filter(Boolean),[we,c,E]),pr=Ft.reduce((s,v)=>s+v.unitPrice*v.qty,0),vn=Ft.filter(s=>s.type==="byo"),ct=vn.reduce((s,v)=>s+v.qty,0),yn=vn.reduce((s,v)=>s+v.unitPrice*v.qty,0),fr=ct>0?qi(ct,B):0,xn=Math.round(yn*fr/100),zn=ct>0&&B.enabled?Math.max(0,B.minItems-ct):0,Qn=ct>0&&(zn>0||!B.enabled),Yr=pr-xn,gr=Yr*Q/100,mr=Yr+gr,Yt=Ft.reduce((s,v)=>s+v.qty,0),Kt=L.useCallback((s,v=2e3)=>{Br(s),clearTimeout(dr.current),dr.current=setTimeout(()=>Br(""),v)},[]),Ae=L.useRef(we);Ae.current=we;const Kr=L.useRef({dishes:c,deals:E});Kr.current={dishes:c,deals:E};const Vn=(s,v,z)=>{const R=v==="deal"?["deal"]:["dish","byo"];return Object.entries(s).reduce((D,[ee,Z])=>R.some(ye=>ee.startsWith(`${ye}:${z}:`))?D+Z:D,0)},hr=(s,v)=>(s==="deal"?Kr.current.deals:Kr.current.dishes).find(z=>z._id===v),zt=L.useCallback((s,v,z,R="",D="",ee=null)=>{const Z=hr(s,v),ye=z||(Z==null?void 0:Z.name)||"This item",Te=typeof(Z==null?void 0:Z.availableQty)=="number"?Z.availableQty:1/0;if(Vn(Ae.current,s,v)+1>Te){Kt(Te<=0?`Sorry, ${ye} is out of stock right now.`:`Only ${Te} ${ye} in stock. Please select ${Te}.`,3500);return}const Ie=ee?Vt(s,v,Ml(ee)):Vt(s,v,R,D);Ae.current={...Ae.current,[Ie]:(Ae.current[Ie]||0)+1},ie(Ae.current),z&&Kt(`${z} added`)},[Kt]),wn=L.useCallback((s,v,z="",R="")=>{const D=Vt(s,v,z,R);Ae.current={...Ae.current,[D]:Math.max(0,(Ae.current[D]||0)-1)},ie(Ae.current)},[]),Xr=L.useCallback(async()=>{var s,v;try{const[z,R,D]=await Promise.all([wc(),kc().catch(()=>null),Sc().catch(()=>null)]);I(z.data||[]),R&&W(R.data||[]),(s=D==null?void 0:D.data)!=null&&s.buildYourOwnDeal&&V(Fa(D.data.buildYourOwnDeal)),typeof((v=D==null?void 0:D.data)==null?void 0:v.taxRatePercent)=="number"&&ze(D.data.taxRatePercent)}catch{}},[]);L.useEffect(()=>{if(pe)return;const s=()=>{document.hidden||Xr()},v=setInterval(s,Qp);return document.addEventListener("visibilitychange",s),window.addEventListener("focus",s),()=>{clearInterval(v),document.removeEventListener("visibilitychange",s),window.removeEventListener("focus",s)}},[pe,Xr]),L.useEffect(()=>{const s=Ae.current,v={};Object.entries(s).forEach(([D,ee])=>{if(ee<=0)return;const[Z,ye]=D.split(":"),Te=Z==="byo"?"dish":Z;(v[`${Te}:${ye}`]=v[`${Te}:${ye}`]||[]).push(D)});let z=s;const R=[];Object.entries(v).forEach(([D,ee])=>{const[Z,ye]=D.split(":"),Te=(Z==="deal"?E:c).find(Ie=>Ie._id===ye);if(!Te||typeof Te.availableQty!="number")return;let Ge=ee.reduce((Ie,it)=>Ie+z[it],0);if(!(Ge<=Te.availableQty)){z={...z};for(const Ie of[...ee].reverse()){if(Ge<=Te.availableQty)break;const it=Math.min(z[Ie],Ge-Te.availableQty);z[Ie]-=it,Ge-=it}R.push(Te.availableQty<=0?`${Te.name} just sold out and was removed from your order.`:`Only ${Te.availableQty} ${Te.name} in stock - your order was set to ${Te.availableQty}.`)}}),R.length>0&&(Ae.current=z,ie(z),Kt(R.join(" "),5e3))},[c,E,Kt]);const Ol=s=>{const v=document.getElementById(`section-${s}`);v&&(fe(s),v.scrollIntoView({behavior:"smooth",block:"start"}))};L.useEffect(()=>{if(pe||P)return;let s=0;const v=()=>{s||(s=requestAnimationFrame(()=>{var D;s=0;const z=160;let R=(D=_t[0])==null?void 0:D.id;_t.forEach(ee=>{const Z=document.getElementById(`section-${ee.id}`);Z&&Z.getBoundingClientRect().top<=z&&(R=ee.id)}),R&&fe(R)}))};return v(),window.addEventListener("scroll",v,{passive:!0}),()=>{window.removeEventListener("scroll",v),cancelAnimationFrame(s)}},[_t,pe,P]),L.useEffect(()=>{var v;const s=(v=Hn.current)==null?void 0:v.querySelector(".is-active");s==null||s.scrollIntoView({block:"nearest",inline:"center",behavior:"smooth"})},[ue]);const Dl=s=>{const v=cr.current;v&&v.scrollBy({left:s*(v.clientWidth*.8),behavior:"smooth"})},Xt=se||_e||mn||he||!!T;L.useEffect(()=>(document.body.style.overflow=Xt?"hidden":"",()=>{document.body.style.overflow=""}),[Xt]),L.useEffect(()=>{const s=v=>{v.key==="Escape"&&(he?ge(!1):T?De(null):_e?Pe(!1):mn?Dt(!1):se&&ce(!1))};return window.addEventListener("keydown",s),()=>window.removeEventListener("keydown",s)},[he,T,_e,mn,se]);const Fl=L.useMemo(()=>{if(de.length>0)return de.map(z=>({url:tn(z.image),link:z.link||"",alt:z.altText||""}));const s=new Set,v=[];return[...E,...c].forEach(z=>{const R=tn(z.image);R&&!s.has(R)&&(s.add(R),v.push({url:R,link:"",alt:""}))}),v.slice(0,8)},[de,E,c]),$l=async s=>{if(s.preventDefault(),Ft.length!==0){if(Qn){ve(B.enabled?`Build Your Own Deal needs at least ${B.minItems} items - add ${zn} more or remove the deal.`:"Build Your Own Deal isn't available right now - please remove it from your order.");return}if(!Nc(g.phone)){ve("That mobile number doesn't look complete. Use digits only, e.g. 03001234567.");return}q(!0),ve("");try{const v=await _p({customerName:g.name,customerPhone:g.phone,address:g.address,items:Ft.map(R=>R.type==="deal"?{dealId:R.item._id,quantity:R.qty,dealSelections:R.dealSelections||void 0}:{dishId:R.item._id,quantity:R.qty,size:R.size||void 0,crust:R.crust||void 0,byo:R.type==="byo"?!0:void 0})}),z=v.data._id;localStorage.setItem("gzp_last_order",z),G(z),N(v.data),le(!0),$(!1),ie({}),Pe(!1),ce(!1),window.scrollTo({top:0})}catch(v){(v.status===409||/Build Your Own/i.test(v.message||""))&&Xr(),ve(v.message)}finally{q(!1)}}},Ji=async()=>{if(!(!P||$e)){Ne(!0);try{const s=await bc(P);N(s.data)}catch(s){s.status===404&&(localStorage.removeItem("gzp_last_order"),G(null),N(null))}finally{Ne(!1)}}},[vr,Gr]=L.useState(!1),Al=async()=>{if(!(!P||vr)&&window.confirm("Cancel this order? You won't be charged anything.")){Gr(!0);try{const s=await Pp(P);N(v=>v&&{...v,orderStatus:s.data.orderStatus})}catch(s){window.alert(s.message||"Couldn't cancel the order — please call the shop.")}finally{Gr(!1)}}},Bl=()=>{localStorage.removeItem("gzp_last_order"),G(null),N(null)},eo=async s=>{s.preventDefault();const v=rn.trim();if(v){if(!Nc(v)){ur("Enter the full mobile number you used at checkout, digits only.");return}Wr(!0),ur("");try{const z=await Tp(v);localStorage.setItem("gzp_last_order",z.data._id),G(z.data._id),N(z.data),Dt(!1),Wn("")}catch(z){ur(z.status===404?"No recent order on that number. Check the digits and try again.":z.message||"Couldn't reach the kitchen. Try again in a moment.")}finally{Wr(!1)}}},to=()=>{const s={};return Object.entries(we).forEach(([v,z])=>{v.startsWith("byo:")&&z>0&&(s[v.slice(4)]=z)}),s},Be=s=>{const v={};Object.entries(Ae.current).forEach(([z,R])=>{z.startsWith("byo:")||(v[z]=R)}),Object.entries(s).forEach(([z,R])=>{R>0&&(v[`byo:${z}`]=R)}),Ae.current=v,ie(v),re(!1),ce(!0),Kt("Your custom deal is in your order")},no=()=>{const s={};Object.entries(Ae.current).forEach(([v,z])=>{v.startsWith("byo:")||(s[v]=z)}),Ae.current=s,ie(s)},qr=s=>Object.entries(Ae.current).reduce((v,[z,R])=>z.startsWith(`dish:${s}:`)?v+R:v,0),Zr=s=>o.jsxs("div",{className:"gzp-line",children:[tn(s.item.image)?o.jsx("img",{src:tn(s.item.image),alt:"",onError:v=>{v.currentTarget.style.display="none"}}):o.jsx("span",{className:"gzp-line-icon",children:s.item.icon||"🍽️"}),o.jsxs("div",{className:"gzp-line-main",children:[o.jsxs("h4",{children:[s.type==="deal"&&o.jsx("span",{className:"gzp-tag",children:"DEAL"}),s.item.name]}),s.variantLabel&&o.jsx("p",{className:"gzp-line-variant",children:s.variantLabel}),o.jsx("span",{children:xt(s.unitPrice*s.qty)})]}),o.jsx(Gi,{qty:s.qty,label:s.item.name,onAdd:()=>zt(s.type,s.item._id,"",s.size,s.crust),onRemove:()=>wn(s.type,s.item._id,s.size,s.crust)})]},s.key);if(P&&!O)return o.jsxs("div",{className:"gzp-app",children:[o.jsx(Ba,{minimal:!0}),o.jsxs("div",{className:"gzp-boot",children:[o.jsx("img",{src:Il,alt:""}),"Pulling up your order…"]})]});if(P&&O&&j)return o.jsx(qp,{order:O,onTrack:()=>le(!1),onContinue:()=>{le(!1),$(!0)}});if(P&&O&&!S){const s=jc.indexOf(O.orderStatus),v=O.orderStatus==="Cancelled";return o.jsxs("div",{className:"gzp-app",children:[o.jsx(Ba,{minimal:!0}),o.jsx("div",{className:"gzp-shell",children:o.jsxs("section",{className:"gzp-track",children:[o.jsxs("div",{className:"gzp-track-hero",children:[o.jsxs("div",{className:"gzp-track-top",children:[o.jsxs("div",{style:{flex:1},children:[o.jsx("h1",{children:Up[O.orderStatus]||"Order status"}),o.jsxs("p",{className:"gzp-track-id",children:["Order #",String(O._id||"").slice(-6).toUpperCase()," for"," ",((Yn=O.customerDetails)==null?void 0:Yn.name)||"you"]})]}),o.jsx("button",{type:"button",className:"gzp-btn gzp-btn-ghost",onClick:Ji,disabled:$e,children:$e?"Checking…":"Refresh"})]}),v?o.jsx("p",{className:"gzp-cancelled",children:"This order was cancelled. Nothing has been charged — you can order again any time."}):o.jsxs(o.Fragment,{children:[o.jsx("p",{className:"gzp-eta",children:"This page updates itself every few seconds. Keep it open and watch it move."}),o.jsx("ol",{className:"gzp-steps",children:jc.map((z,R)=>o.jsx("li",{className:R<s?"is-done":R===s?"is-current":"",children:Cc[z]},z))}),O.orderStatus==="Pending"&&o.jsx("button",{type:"button",className:"gzp-btn gzp-btn-ghost",style:{marginTop:14,color:"#E6392F",borderColor:"#E6392F"},onClick:Al,disabled:vr,children:vr?"Cancelling…":"Cancel this order"})]})]}),o.jsxs("div",{className:"gzp-panel",children:[o.jsx("h3",{children:"What's coming"}),(O.items||[]).map((z,R)=>{var D;return o.jsxs("div",{children:[o.jsxs("div",{className:"gzp-order-line",children:[o.jsxs("span",{children:[z.isDeal&&o.jsx("span",{className:"gzp-tag",children:"DEAL"}),z.quantity,"× ",z.name]}),o.jsx("span",{children:xt(z.price*z.quantity)})]}),z.isDeal&&((D=z.dealItems)==null?void 0:D.length)>0&&o.jsx("p",{className:"gzp-order-sub",children:z.dealItems.map(ee=>`${ee.quantity>1?ee.quantity+"× ":""}${ee.label}`).join(", ")})]},R)}),o.jsxs("div",{className:"gzp-totals",style:{marginTop:14},children:[Number((Ul=O.bills)==null?void 0:Ul.discount)>0&&o.jsxs("div",{className:"is-discount",children:[o.jsx("span",{children:O.bills.discountLabel||"Build Your Own Deal discount"}),o.jsxs("span",{children:["−",xt(O.bills.discount)]})]}),o.jsxs("div",{className:"gzp-grand",children:[o.jsx("span",{children:"Pay on delivery"}),o.jsx("span",{children:xt(((Jr=O.bills)==null?void 0:Jr.totalWithTax)||0)})]})]})]}),((Kn=O.customerDetails)==null?void 0:Kn.address)&&o.jsxs("div",{className:"gzp-panel",children:[o.jsx("h3",{children:"Delivering to"}),o.jsx("p",{style:{margin:0,color:"var(--flour-dim)",fontSize:"0.93rem"},children:O.customerDetails.address})]}),o.jsx("button",{className:"gzp-btn gzp-btn-ghost gzp-btn-block",style:{marginTop:16},onClick:Bl,type:"button",children:"Start another order"})]})})]})}return o.jsxs("div",{className:"gzp-app",children:[o.jsx(Ba,{cartCount:Yt,onSearch:()=>ge(!0),onCart:()=>ce(!0)}),S&&M&&o.jsxs("div",{className:"gzp-tracking-banner",children:[o.jsxs("span",{children:["Order #",String(O._id||"").slice(-6).toUpperCase()," — ",Cc[O.orderStatus]||O.orderStatus]}),o.jsx("button",{type:"button",onClick:()=>$(!1),children:"Track it"})]}),Se&&!_e&&o.jsx("div",{className:"gzp-shell",children:o.jsx("p",{className:"gzp-error gzp-error-banner",children:Se})}),o.jsx("section",{className:"gzp-hero",children:o.jsx(Xp,{slides:Fl,onSlideClick:s=>{var v;s!=null&&s.link?window.open(s.link,"_blank","noopener,noreferrer"):Ol((v=_t[0])==null?void 0:v.id)}})}),!pe&&_t.length>0&&o.jsx("nav",{className:"gzp-navbar","aria-label":"Menu sections",children:o.jsx("div",{className:"gzp-navbar-inner",children:o.jsx("div",{className:"gzp-navbar-chips",ref:Hn,children:_t.map(s=>o.jsx("button",{type:"button",className:`gzp-chip${ue===s.id?" is-active":""}`,onClick:()=>Ol(s.id),children:s.name},s.id))})})}),o.jsxs("div",{className:"gzp-shell",children:[pe?o.jsxs("section",{className:"gzp-section",children:[o.jsxs("div",{className:"gzp-section-head",children:[o.jsx("h2",{children:"Loading the menu"}),o.jsx("div",{className:"gzp-section-rule"})]}),o.jsx("div",{className:"gzp-grid",children:Array.from({length:8}).map((s,v)=>o.jsx(Jp,{},v))})]}):o.jsxs(o.Fragment,{children:[B.enabled&&c.length>0&&o.jsx(Ip,{cfg:B,pickedCount:ct,onStart:()=>re(!0)}),E.length>0&&o.jsxs("section",{className:"gzp-section",id:`section-${$a}`,children:[o.jsxs("div",{className:"gzp-section-head",children:[o.jsx("h2",{children:"Today's deals"}),o.jsxs("span",{className:"gzp-section-count",children:[E.length," bundle",E.length===1?"":"s"]}),o.jsx("div",{className:"gzp-section-rule"}),o.jsxs("div",{className:"gzp-rail-nav",children:[o.jsx("button",{className:"gzp-rail-btn",onClick:()=>Dl(-1),"aria-label":"Scroll deals back",type:"button",children:o.jsx(Aa,{dir:"left"})}),o.jsx("button",{className:"gzp-rail-btn",onClick:()=>Dl(1),"aria-label":"Scroll deals forward",type:"button",children:o.jsx(Aa,{})})]})]}),o.jsx("div",{className:"gzp-rail-wrap",children:o.jsx("div",{className:"gzp-rail",ref:cr,children:E.map(s=>{var R,D,ee;const v=Vt("deal",s._id),z=s.originalPrice>s.price?Math.round((s.originalPrice-s.price)/s.originalPrice*100):0;return o.jsxs("div",{className:"gzp-deal",role:"button",tabIndex:0,onClick:()=>De({type:"deal",item:s}),onKeyDown:Z=>Z.key==="Enter"&&De({type:"deal",item:s}),children:[o.jsxs("div",{className:"gzp-deal-media",children:[o.jsx(Qa,{src:tn(s.image),alt:s.name,icon:s.icon||"🔥"}),s.badge&&o.jsx("span",{className:"gzp-badge",children:s.badge}),z>0&&o.jsxs("span",{className:"gzp-save",children:["Save ",z,"%"]}),ar(s.availableQty)&&o.jsx("span",{className:`gzp-stock${ar(s.availableQty).out?" is-out":""}`,children:ar(s.availableQty).text})]}),o.jsxs("div",{className:"gzp-deal-body",children:[o.jsx("h3",{children:s.name}),((R=s.items)==null?void 0:R.length)>0?o.jsxs("ul",{className:"gzp-deal-contents",children:[s.items.slice(0,3).map((Z,ye)=>o.jsxs("li",{children:[Z.quantity>1?`${Z.quantity}× `:"",Z.label]},ye)),s.items.length>3&&o.jsxs("li",{className:"gzp-deal-more",children:["+",s.items.length-3," more in the box"]})]}):s.description&&o.jsx("p",{className:"gzp-deal-desc",children:s.description}),o.jsxs("div",{className:"gzp-deal-foot",onClick:Z=>Z.stopPropagation(),role:"presentation",children:[o.jsx(Xi,{price:s.price,originalPrice:s.originalPrice}),we[v]&&!hn(s)?o.jsx(Gi,{qty:we[v],label:s.name,onAdd:()=>zt("deal",s._id),onRemove:()=>wn("deal",s._id)}):o.jsx("button",{type:"button",className:"gzp-add gzp-add-wide",disabled:(D=ar(s.availableQty))==null?void 0:D.out,onClick:()=>hn(s)?De({type:"deal",item:s}):zt("deal",s._id,s.name),children:(ee=ar(s.availableQty))!=null&&ee.out?"Sold out":hn(s)?"Choose & add":"Add deal"})]})]})]},s._id)})})})]}),Qt.map(s=>o.jsxs("section",{className:"gzp-section",id:`section-${s.id}`,children:[o.jsxs("div",{className:"gzp-section-head",children:[o.jsx("h2",{children:s.name}),o.jsxs("span",{className:"gzp-section-count",children:[s.items.length," items"]}),o.jsx("div",{className:"gzp-section-rule"})]}),o.jsx("div",{className:"gzp-grid",children:s.items.map(v=>o.jsx(Zp,{dish:v,cart:we,cartKey:Vt,addToCart:zt,removeFromCart:wn,onOpenQuickView:z=>De({type:"dish",item:z})},v._id))})]},s.id)),Qt.length===0&&E.length===0&&o.jsx("section",{className:"gzp-section",children:o.jsxs("div",{className:"gzp-empty",children:[o.jsx("img",{src:Il,alt:"",className:"gzp-empty-logo"}),"The menu is being set up right now. Check back in a little while."]})})]}),o.jsx("footer",{className:"gzp-footer",children:o.jsxs("div",{className:"gzp-footer-inner",children:[o.jsxs("p",{children:[o.jsx("strong",{children:"GenZ Pizza Land"}),"Prices are in rupees. ",Q,"% tax is added at checkout and the rider collects the total in cash."]}),o.jsxs("button",{className:"gzp-btn gzp-btn-ghost",onClick:()=>Dt(!0),type:"button",children:[o.jsx(Ec,{})," Track an order"]})]})})]}),Yt>0&&!se&&!_e&&o.jsxs("button",{className:"gzp-cartbar",onClick:()=>ce(!0),type:"button",children:[o.jsxs("span",{className:"gzp-cartbar-label",children:[o.jsxs("small",{children:[Yt," item",Yt===1?"":"s"," in your order"]}),o.jsx("b",{children:xt(mr)})]}),o.jsx("span",{className:"gzp-cartbar-cta",children:"View order"})]}),o.jsx(ef,{}),sr&&o.jsxs("div",{className:"gzp-toast",role:"status",children:[o.jsx("i",{children:"✓"}),sr]}),he&&o.jsxs("div",{className:"gzp-search",onClick:()=>ge(!1),children:[o.jsxs("div",{className:"gzp-search-bar",onClick:s=>s.stopPropagation(),children:[o.jsx(Mc,{}),o.jsx("input",{autoFocus:!0,value:je,onChange:s=>Ee(s.target.value),placeholder:"Search for a pizza, burger or deal","aria-label":"Search the menu"}),o.jsx("button",{className:"gzp-btn gzp-btn-ghost",onClick:()=>ge(!1),type:"button",children:"Close"})]}),o.jsxs("div",{className:"gzp-search-results",onClick:s=>s.stopPropagation(),children:[je.trim()&&Qr.length===0&&o.jsxs("p",{className:"gzp-search-empty",children:["Nothing matches “",je.trim(),"”. Try a shorter word, like “pizza”."]}),Qr.map(({type:s,item:v})=>{var z;return o.jsxs("button",{className:"gzp-result",type:"button",onClick:()=>{ge(!1),De({type:s,item:v})},children:[tn(v.image)?o.jsx("img",{src:tn(v.image),alt:"",onError:R=>{R.currentTarget.style.display="none"}}):o.jsx("span",{className:"gzp-result-icon",children:v.icon||"🍽️"}),o.jsxs("span",{className:"gzp-result-name",children:[v.name,o.jsx("span",{className:"gzp-result-cat",children:s==="deal"?"Deal":Zi[((z=v.category)==null?void 0:z._id)||v.category]||"Menu"})]}),o.jsx(Xi,{price:v.price})]},`${s}-${v._id}`)})]})]}),T&&o.jsx("div",{className:"gzp-overlay",onClick:()=>De(null),children:o.jsxs("div",{className:"gzp-modal",onClick:s=>s.stopPropagation(),role:"dialog","aria-label":T.item.name,children:[o.jsxs("div",{className:"gzp-modal-media",children:[o.jsx(Qa,{src:tn(T.item.image),alt:T.item.name,icon:T.item.icon}),T.item.badge&&o.jsx("span",{className:"gzp-badge",children:T.item.badge}),o.jsx("button",{className:"gzp-modal-close",onClick:()=>De(null),"aria-label":"Close",type:"button",children:"✕"})]}),o.jsxs("div",{className:"gzp-modal-body",children:[o.jsx("h2",{children:T.item.name}),T.type==="deal"&&((wt=T.item.items)==null?void 0:wt.length)>0&&o.jsx("ul",{className:"gzp-deal-contents",children:T.item.items.map((s,v)=>s.customizable?null:o.jsxs("li",{children:[s.quantity>1?`${s.quantity}× `:"",s.label]},v))}),T.type==="deal"&&((Wl=T.item.items)==null?void 0:Wl.map((s,v)=>{var it,Ue,kt;if(!s.customizable)return null;const z=s.flavourOptions||[],R=gn[v]||{},D=[...new Map(z.map(J=>{var xe,A;return[((xe=J.category)==null?void 0:xe._id)||"",((A=J.category)==null?void 0:A.name)||"Choose"]}))],ee=((Ue=(it=z.find(J=>J._id===R.dishId))==null?void 0:it.category)==null?void 0:Ue._id)||((kt=D[0])==null?void 0:kt[0])||"",Z=z.filter(J=>{var xe;return(((xe=J.category)==null?void 0:xe._id)||"")===ee}),ye=z.find(J=>J._id===R.dishId),Te=[...new Set(((ye==null?void 0:ye.variants)||[]).map(J=>J.size))],Ge=((ye==null?void 0:ye.variants)||[]).filter(J=>J.size===R.size&&J.crust),Ie=J=>Un(xe=>({...xe,[v]:{...xe[v],...J}}));return o.jsxs("div",{className:"gzp-deal-choice",children:[o.jsxs("p",{className:"gzp-deal-choice-label",children:[s.quantity>1?`${s.quantity}× `:"",s.label," — pick yours"]}),o.jsxs("div",{className:"gzp-variant-row",children:[D.length>1&&o.jsx("select",{className:"gzp-select",value:ee,onChange:J=>{var Ke;const xe=z.find(nt=>{var Gt;return(((Gt=nt.category)==null?void 0:Gt._id)||"")===J.target.value}),A=(Ke=xe==null?void 0:xe.variants)==null?void 0:Ke[0];Ie({dishId:(xe==null?void 0:xe._id)||"",size:(A==null?void 0:A.size)||"",crust:(A==null?void 0:A.crust)||""})},"aria-label":`Category for ${s.label}`,children:D.map(([J,xe])=>o.jsx("option",{value:J,children:xe},J))}),o.jsxs("select",{className:"gzp-select",value:R.dishId||"",onChange:J=>{var Ke;const xe=z.find(nt=>nt._id===J.target.value),A=(Ke=xe==null?void 0:xe.variants)==null?void 0:Ke[0];Ie({dishId:(xe==null?void 0:xe._id)||"",size:(A==null?void 0:A.size)||"",crust:(A==null?void 0:A.crust)||""})},"aria-label":`Flavour for ${s.label}`,children:[Z.length===0&&o.jsx("option",{value:"",children:"No flavours available"}),Z.map(J=>o.jsx("option",{value:J._id,children:J.name},J._id))]}),Te.length>0&&o.jsx("select",{className:"gzp-select",value:R.size||"",onChange:J=>{var A;const xe=((ye==null?void 0:ye.variants)||[]).filter(Ke=>Ke.size===J.target.value&&Ke.crust);Ie({size:J.target.value,crust:xe.some(Ke=>Ke.crust===R.crust)?R.crust:((A=xe[0])==null?void 0:A.crust)||""})},"aria-label":`Size for ${s.label}`,children:Te.map(J=>o.jsx("option",{value:J,children:J},J))}),Ge.length>0&&o.jsx("select",{className:"gzp-select",value:R.crust||"",onChange:J=>Ie({crust:J.target.value}),"aria-label":`Crust for ${s.label}`,children:Ge.map(J=>o.jsx("option",{value:J.crust,children:J.crust},J.crust))})]})]},v)})),T.item.description&&o.jsx("p",{className:"gzp-deal-desc",children:T.item.description}),(()=>{const s=T.type==="dish",v=T.type==="deal",z=s?Wa(T.item):[],R=z.length>0,D=s?Ki(T.item,Ot):[],ee=R?Ha(T.item,Ot,Et):null,Z=R?Ic(T.item):null,ye=R?(ee==null?void 0:ee.price)??(Z==null?void 0:Z.price)??T.item.price:T.item.price,Te=R?(ee==null?void 0:ee.originalPrice)??0:T.item.originalPrice,Ge=v&&hn(T.item),Ie=!Ge||(T.item.items||[]).every((A,Ke)=>{var el;if(!A.customizable)return!0;const nt=gn[Ke];if(!(nt!=null&&nt.dishId))return!1;const Gt=(A.flavourOptions||[]).find(Hl=>Hl._id===nt.dishId);return((el=Gt==null?void 0:Gt.variants)==null?void 0:el.length)>0?!!nt.size:!0}),it=Ge?Vt(T.type,T.item._id,Ml(gn)):Vt(T.type,T.item._id,Ot,Et),Ue=we[it]||0,kt=(s?c:E).find(A=>A._id===T.item._id)||T.item,J=ar(kt.availableQty),xe=(!R||!!ee)&&Ie&&!(J!=null&&J.out);return o.jsxs(o.Fragment,{children:[o.jsx(Xi,{price:ye,originalPrice:Te,from:R}),J&&o.jsx("p",{className:`gzp-stock-note${J.out?" is-out":""}`,children:J.text}),R&&o.jsxs("div",{className:"gzp-variant-row",children:[o.jsx("select",{className:"gzp-select",value:Ot,onChange:A=>{const Ke=A.target.value;Bn(Ke);const nt=Ki(T.item,Ke);nn(nt.includes(Et)?Et:nt[0]||"")},"aria-label":`Size for ${T.item.name}`,children:z.map(A=>o.jsx("option",{value:A,children:A},A))}),D.length>0&&o.jsx("select",{className:"gzp-select",value:Et,onChange:A=>nn(A.target.value),"aria-label":`Crust for ${T.item.name}`,children:D.map(A=>o.jsx("option",{value:A,children:A},A))})]}),o.jsx("div",{className:"gzp-modal-foot",children:Ue?o.jsxs(o.Fragment,{children:[o.jsx(Gi,{size:"lg",label:T.item.name,qty:Ue,onAdd:()=>Ge?zt(T.type,T.item._id,"","","",gn):zt(T.type,T.item._id,"",Ot,Et),onRemove:()=>{const[,,A]=it.split(":"),[Ke,nt]=A.split("||");wn(T.type,T.item._id,Ke,nt)}}),o.jsx("button",{className:"gzp-btn gzp-btn-primary",onClick:()=>{De(null),ce(!0)},type:"button",children:"View order"})]}):o.jsxs("button",{className:"gzp-btn gzp-btn-primary gzp-btn-split",disabled:!xe,onClick:()=>{Ge?zt(T.type,T.item._id,T.item.name,"","",gn):zt(T.type,T.item._id,T.item.name,Ot,Et),De(null)},type:"button",children:[o.jsx("span",{children:J!=null&&J.out?"Sold out":Ge&&!Ie?"Choose your options":"Add to order"}),o.jsx("span",{children:xt(ye)})]})})]})})()]})]})}),ae&&o.jsx(Fp,{cfg:B,dishes:c,categories:u,initialPicks:to(),getOtherQty:qr,onClose:()=>re(!1),onConfirm:Be}),se&&o.jsx("div",{className:"gzp-sheet-overlay",onClick:()=>ce(!1),children:o.jsxs("div",{className:"gzp-sheet",onClick:s=>s.stopPropagation(),role:"dialog","aria-label":"Your order",children:[o.jsxs("div",{className:"gzp-sheet-head",children:[o.jsx("h2",{children:"Your order"}),o.jsx("button",{className:"gzp-icon-btn",onClick:()=>ce(!1),"aria-label":"Close",type:"button",children:"✕"})]}),Ft.length===0?o.jsxs("div",{className:"gzp-sheet-body",children:[o.jsxs("div",{className:"gzp-empty",children:[o.jsx("span",{children:"🛒"}),"Nothing here yet. Add a deal or a pizza and it'll show up."]}),o.jsx("button",{className:"gzp-btn gzp-btn-primary",onClick:()=>ce(!1),type:"button",children:"Back to the menu"})]}):o.jsxs(o.Fragment,{children:[o.jsxs("div",{className:"gzp-sheet-body",children:[Ft.filter(s=>s.type!=="byo").map(Zr),vn.length>0&&o.jsxs("div",{className:"gzp-byo-cart",children:[o.jsxs("div",{className:"gzp-byo-cart-head",children:[o.jsx("h4",{children:"🎯 Your custom deal"}),o.jsx("button",{type:"button",onClick:()=>{ce(!1),re(!0)},children:"Edit"})]}),o.jsx("p",{className:`gzp-byo-cart-note${zn>0||!B.enabled?" is-warn":""}`,children:B.enabled?Tc(ct,B):"This deal isn't available right now."}),vn.map(Zr),xn>0&&o.jsxs("p",{className:"gzp-byo-cart-saving",children:["You save ",o.jsx("b",{children:xt(xn)})," (",fr,"% off ",ct," items)"]})]})]}),o.jsxs("div",{className:"gzp-sheet-foot",children:[o.jsxs("div",{className:"gzp-totals",children:[o.jsxs("div",{children:[o.jsx("span",{children:"Subtotal"}),o.jsx("span",{children:xt(pr)})]}),xn>0&&o.jsxs("div",{className:"is-discount",children:[o.jsxs("span",{children:["Custom deal discount (",fr,"%)"]}),o.jsxs("span",{children:["−",xt(xn)]})]}),o.jsxs("div",{children:[o.jsxs("span",{children:["Tax (",Q,"%)"]}),o.jsx("span",{children:xt(gr)})]}),o.jsxs("div",{className:"gzp-grand",children:[o.jsx("span",{children:"Total"}),o.jsx("span",{children:xt(mr)})]})]}),Qn&&o.jsx("p",{className:"gzp-byo-warn",children:B.enabled?`Your custom deal needs ${zn} more item${zn===1?"":"s"} to qualify. Add more or remove the deal to continue.`:"The custom deal isn't available right now. Remove it to continue."}),o.jsx("button",{className:"gzp-btn gzp-btn-primary gzp-btn-block",onClick:()=>{ce(!1),Pe(!0)},disabled:Qn,type:"button",children:"Add delivery details"}),Qn&&o.jsx("button",{type:"button",className:"gzp-btn gzp-btn-ghost gzp-btn-block",style:{marginTop:8},onClick:()=>{B.enabled?(ce(!1),re(!0)):no()},children:B.enabled?"Add more items to my deal":"Remove custom deal"})]})]})]})}),_e&&o.jsx("div",{className:"gzp-sheet-overlay",onClick:()=>Pe(!1),children:o.jsxs("div",{className:"gzp-sheet",onClick:s=>s.stopPropagation(),role:"dialog","aria-label":"Delivery details",children:[o.jsxs("div",{className:"gzp-sheet-head",children:[o.jsx("button",{className:"gzp-icon-btn",onClick:()=>{Pe(!1),ce(!0)},"aria-label":"Back to your order",type:"button",children:o.jsx(Aa,{dir:"left"})}),o.jsx("h2",{children:"Where should we send it?"})]}),o.jsxs("form",{onSubmit:$l,style:{display:"contents"},children:[o.jsx("div",{className:"gzp-sheet-body",children:o.jsxs("div",{className:"gzp-form",children:[o.jsxs("label",{className:"gzp-field",children:[o.jsx("span",{children:"Your name"}),o.jsx("input",{required:!0,value:g.name,onChange:s=>w({...g,name:s.target.value}),placeholder:"Who's the rider asking for?"})]}),o.jsxs("label",{className:"gzp-field",children:[o.jsx("span",{children:"Mobile number"}),o.jsx("input",{required:!0,type:"tel",inputMode:"numeric",pattern:"[0-9+]*",maxLength:14,value:g.phone,onChange:s=>w({...g,phone:Vi(s.target.value)}),onPaste:s=>{s.preventDefault();const v=(s.clipboardData||window.clipboardData).getData("text");w(z=>({...z,phone:Vi(z.phone+v)}))},placeholder:"03001234567"})]}),o.jsxs("label",{className:"gzp-field",children:[o.jsx("span",{children:"Delivery address"}),o.jsx("textarea",{required:!0,rows:3,value:g.address,onChange:s=>w({...g,address:s.target.value}),placeholder:"House or flat number, street, area, nearest landmark"})]}),o.jsxs("p",{className:"gzp-note",children:[o.jsx(Ec,{}),o.jsxs("span",{children:[o.jsx("b",{children:"Cash on delivery."})," Pay the rider when the food arrives. We'll call this number if we can't find the address."]})]}),Se&&o.jsx("p",{className:"gzp-error",children:Se})]})}),o.jsxs("div",{className:"gzp-sheet-foot",children:[o.jsx("div",{className:"gzp-totals",children:o.jsxs("div",{className:"gzp-grand",children:[o.jsx("span",{children:"Total to pay"}),o.jsx("span",{children:xt(mr)})]})}),o.jsx("button",{type:"submit",className:"gzp-btn gzp-btn-primary gzp-btn-block",disabled:ke,children:ke?"Sending to the kitchen…":"Place order"})]})]})]})}),mn&&o.jsx("div",{className:"gzp-sheet-overlay",onClick:()=>Dt(!1),children:o.jsxs("div",{className:"gzp-sheet",onClick:s=>s.stopPropagation(),role:"dialog","aria-label":"Track your order",children:[o.jsxs("div",{className:"gzp-sheet-head",children:[o.jsx("h2",{children:"Track your order"}),o.jsx("button",{className:"gzp-icon-btn",onClick:()=>Dt(!1),"aria-label":"Close",type:"button",children:"✕"})]}),o.jsxs("form",{onSubmit:eo,style:{display:"contents"},children:[o.jsx("div",{className:"gzp-sheet-body",children:o.jsxs("div",{className:"gzp-form",children:[o.jsxs("label",{className:"gzp-field",children:[o.jsx("span",{children:"Mobile number used at checkout"}),o.jsx("input",{required:!0,autoFocus:!0,type:"tel",inputMode:"numeric",pattern:"[0-9+]*",maxLength:14,value:rn,onChange:s=>Wn(Vi(s.target.value)),onPaste:s=>{s.preventDefault();const v=(s.clipboardData||window.clipboardData).getData("text");Wn(z=>Vi(z+v))},placeholder:"03001234567"})]}),Hr&&o.jsx("p",{className:"gzp-error",children:Hr})]})}),o.jsx("div",{className:"gzp-sheet-foot",children:o.jsx("button",{type:"submit",className:"gzp-btn gzp-btn-primary gzp-btn-block",disabled:Ur,children:Ur?"Looking…":"Find my order"})})]})]})})]})}class nf extends Pc.Component{constructor(c){super(c);dc(this,"handleReload",()=>{try{localStorage.removeItem("gzp_last_order")}catch{}window.location.reload()});this.state={hasError:!1}}static getDerivedStateFromError(){return{hasError:!0}}componentDidCatch(c,I){console.error("GenZ Pizza Land crashed while rendering:",c,I)}render(){return this.state.hasError?o.jsxs("div",{style:{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:14,padding:24,textAlign:"center",fontFamily:"system-ui, sans-serif",background:"#FFF8EF",color:"#252525"},children:[o.jsx("h1",{style:{fontSize:"1.3rem",margin:0},children:"Something went wrong on our end"}),o.jsx("p",{style:{maxWidth:420,opacity:.8,margin:0},children:"Your order may still have gone through — if you already saw an order number, it's safe. Reloading usually fixes this."}),o.jsx("button",{type:"button",onClick:this.handleReload,style:{padding:"10px 22px",borderRadius:8,border:"none",background:"#E6392F",color:"#fff",fontWeight:600,cursor:"pointer"},children:"Reload"})]}):this.props.children}}const rf=["🍕","🍔","🍟","🌭","🌮","🥤","🍗","🍩","🥪","🍦"],Ua=[255,255,255],Ye=(u,y)=>u+Math.random()*(y-u);function lf(u,y){const c=Math.ceil(y*1.6),I=document.createElement("canvas");I.width=c,I.height=c;const E=I.getContext("2d");return E.textAlign="center",E.textBaseline="middle",E.font=`${y}px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif`,E.fillText(u,c/2,c/2+y*.05),I}function of(){const u=L.useRef(null);return L.useEffect(()=>{var $e;const y=u.current;if(!y)return;const c=y.getContext("2d"),I=($e=window.matchMedia)==null?void 0:$e.call(window,"(prefers-reduced-motion: reduce)").matches;let E=0,W=0,de=1,X=[],Q=[],ze=[],B=[],V=0,ae=!1;const re={x:-9999,y:-9999,active:!1},we=()=>window.innerWidth<700,ie=()=>{de=Math.min(window.devicePixelRatio||1,we()?1.5:2),E=window.innerWidth,W=window.innerHeight,y.width=Math.round(E*de),y.height=Math.round(W*de),y.style.width=`${E}px`,y.style.height=`${W}px`,c.setTransform(de,0,0,de,0,0);const Ne=we(),P=Math.min(Ne?34:72,Math.round(E*W/(Ne?15e3:17e3))),G=Ne?9:16;X=Array.from({length:P},()=>({x:Ye(0,E),y:Ye(0,W),vx:Ye(-.22,.22),vy:Ye(-.22,.22),r:Ye(1.1,2.8),life:1,temp:!1})),ze=rf.map(O=>lf(O,28)),Q=Array.from({length:G},(O,N)=>({s:ze[N%ze.length],x:Ye(0,E),y:Ye(0,W),vx:Ye(-.35,.35)||.2,vy:Ye(-.3,-.08),rot:Ye(0,Math.PI*2),vr:Ye(-.008,.008),scale:Ye(.55,1.05),alpha:Ye(.3,.55),phase:Ye(0,6.28)}))},se=(Ne,P)=>{B.push({x:Ne,y:P,t:0});const G=(O,N)=>{const j=O.x-Ne,le=O.y-P,S=Math.hypot(j,le)||1;if(S<320){const $=(1-S/320)*N;O.vx+=j/S*$,O.vy+=le/S*$}};X.forEach(O=>G(O,3.2)),Q.forEach(O=>{G(O,4.5),O.vr+=Ye(-.05,.05)});for(let O=0;O<6;O++){const N=Ye(0,Math.PI*2),j=Ye(.8,2.2);X.push({x:Ne,y:P,vx:Math.cos(N)*j,vy:Math.sin(N)*j,r:Ye(1.4,2.6),life:.999,temp:!0})}},ce=Ne=>{c.clearRect(0,0,E,W);const P=we(),G=P?105:150,O=P?150:200;if(re.active){const N=c.createRadialGradient(re.x,re.y,0,re.x,re.y,220);N.addColorStop(0,"rgba(255,240,200,0.35)"),N.addColorStop(1,"rgba(255,240,200,0)"),c.fillStyle=N,c.fillRect(re.x-220,re.y-220,440,440)}for(let N=X.length-1;N>=0;N--){const j=X[N];if(j.temp&&(j.life-=.004,j.life<=0)){X.splice(N,1);continue}if(re.active){const S=re.x-j.x,$=re.y-j.y,M=Math.hypot(S,$);M<O&&M>1&&(j.vx+=S/M*.012,j.vy+=$/M*.012)}j.vx*=.985,j.vy*=.985,Math.hypot(j.vx,j.vy)<.08&&(j.vx+=Ye(-.01,.01),j.vy+=Ye(-.01,.01)),j.x+=j.vx,j.y+=j.vy,j.x<-20?j.x=E+20:j.x>E+20&&(j.x=-20),j.y<-20?j.y=W+20:j.y>W+20&&(j.y=-20)}c.lineWidth=1;for(let N=0;N<X.length;N++){const j=X[N];for(let le=N+1;le<X.length;le++){const S=X[le],$=j.x-S.x,M=j.y-S.y,g=$*$+M*M;if(g<G*G){const ue=(1-Math.sqrt(g)/G)*.6*Math.min(j.life,S.life);c.strokeStyle=`rgba(${Ua[0]},${Ua[1]},${Ua[2]},${ue})`,c.beginPath(),c.moveTo(j.x,j.y),c.lineTo(S.x,S.y),c.stroke()}}if(re.active){const le=j.x-re.x,S=j.y-re.y,$=Math.hypot(le,S);if($<O){const M=1-$/O;c.strokeStyle=`rgba(255,255,255,${M*.9})`,c.beginPath(),c.moveTo(j.x,j.y),c.lineTo(re.x,re.y),c.stroke()}}}for(const N of X){const j=.35+.5*(N.r/2.8);c.fillStyle=`rgba(255,255,255,${Math.min(1,j+.25)*N.life})`,c.shadowColor="rgba(255,255,255,0.8)",c.shadowBlur=8,c.beginPath(),c.arc(N.x,N.y,N.r,0,Math.PI*2),c.fill()}c.shadowBlur=0;for(let N=B.length-1;N>=0;N--){const j=B[N];if(j.t+=.025,j.t>=1){B.splice(N,1);continue}c.strokeStyle=`rgba(255,255,255,${(1-j.t)*.7})`,c.lineWidth=1.5,c.beginPath(),c.arc(j.x,j.y,j.t*220,0,Math.PI*2),c.stroke()}for(const N of Q){N.vx*=.99,N.vy*=.99,Math.hypot(N.vx,N.vy)<.12&&(N.vx+=Ye(-.01,.01),N.vy-=.004),N.vr*=.99,Math.abs(N.vr)<.004&&(N.vr+=N.vr>=0?4e-4:-4e-4),N.x+=N.vx,N.y+=N.vy+Math.sin(Ne/1500+N.phase)*.12,N.rot+=N.vr;const j=40;N.x<-j?N.x=E+j:N.x>E+j&&(N.x=-j),N.y<-j?N.y=W+j:N.y>W+j&&(N.y=-j),c.save(),c.translate(N.x,N.y),c.rotate(N.rot),c.globalAlpha=N.alpha;const le=N.s.width*N.scale;c.drawImage(N.s,-le/2,-le/2,le,le),c.restore()}c.globalAlpha=1,ae&&(V=requestAnimationFrame(ce))},_e=()=>{ae||I||(ae=!0,V=requestAnimationFrame(ce))},Pe=()=>{ae=!1,cancelAnimationFrame(V)};ie(),I?ce(0):_e();let pe=0;const Le=()=>{clearTimeout(pe),pe=setTimeout(()=>{ie(),I&&ce(0)},150)},Se=Ne=>{re.x=Ne.clientX,re.y=Ne.clientY,re.active=!0},ve=()=>{re.active=!1},ke=Ne=>{re.x=Ne.clientX,re.y=Ne.clientY,re.active=!0,I||se(Ne.clientX,Ne.clientY),Ne.pointerType==="touch"&&setTimeout(ve,900)},q=()=>document.hidden?Pe():_e();return window.addEventListener("resize",Le),window.addEventListener("pointermove",Se,{passive:!0}),window.addEventListener("pointerdown",ke,{passive:!0}),window.addEventListener("pointerleave",ve),document.addEventListener("mouseleave",ve),document.addEventListener("visibilitychange",q),()=>{Pe(),clearTimeout(pe),window.removeEventListener("resize",Le),window.removeEventListener("pointermove",Se),window.removeEventListener("pointerdown",ke),window.removeEventListener("pointerleave",ve),document.removeEventListener("mouseleave",ve),document.removeEventListener("visibilitychange",q)}},[]),o.jsx("canvas",{ref:u,"aria-hidden":"true",style:{position:"fixed",inset:0,zIndex:0,pointerEvents:"none"}})}jp.createRoot(document.getElementById("root")).render(o.jsxs(Pc.StrictMode,{children:[o.jsx(of,{}),o.jsx(nf,{children:o.jsx(tf,{})})]}));
