var Kp=Object.defineProperty;var Gp=(u,h,p)=>h in u?Kp(u,h,{enumerable:!0,configurable:!0,writable:!0,value:p}):u[h]=p;var td=(u,h,p)=>Gp(u,typeof h!="symbol"?h+"":h,p);(function(){const h=document.createElement("link").relList;if(h&&h.supports&&h.supports("modulepreload"))return;for(const k of document.querySelectorAll('link[rel="modulepreload"]'))j(k);new MutationObserver(k=>{for(const L of k)if(L.type==="childList")for(const ae of L.addedNodes)ae.tagName==="LINK"&&ae.rel==="modulepreload"&&j(ae)}).observe(document,{childList:!0,subtree:!0});function p(k){const L={};return k.integrity&&(L.integrity=k.integrity),k.referrerPolicy&&(L.referrerPolicy=k.referrerPolicy),k.crossOrigin==="use-credentials"?L.credentials="include":k.crossOrigin==="anonymous"?L.credentials="omit":L.credentials="same-origin",L}function j(k){if(k.ep)return;k.ep=!0;const L=p(k);fetch(k.href,L)}})();function Ed(u){return u&&u.__esModule&&Object.prototype.hasOwnProperty.call(u,"default")?u.default:u}var Bs={exports:{}},rl={},$s={exports:{}},Ze={};/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var rd;function qp(){if(rd)return Ze;rd=1;var u=Symbol.for("react.element"),h=Symbol.for("react.portal"),p=Symbol.for("react.fragment"),j=Symbol.for("react.strict_mode"),k=Symbol.for("react.profiler"),L=Symbol.for("react.provider"),ae=Symbol.for("react.context"),G=Symbol.for("react.forward_ref"),F=Symbol.for("react.suspense"),B=Symbol.for("react.memo"),Y=Symbol.for("react.lazy"),H=Symbol.iterator;function ie(z){return z===null||typeof z!="object"?null:(z=H&&z[H]||z["@@iterator"],typeof z=="function"?z:null)}var ne={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},he=Object.assign,ze={};function W(z,U,Oe){this.props=z,this.context=U,this.refs=ze,this.updater=Oe||ne}W.prototype.isReactComponent={},W.prototype.setState=function(z,U){if(typeof z!="object"&&typeof z!="function"&&z!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,z,U,"setState")},W.prototype.forceUpdate=function(z){this.updater.enqueueForceUpdate(this,z,"forceUpdate")};function ue(){}ue.prototype=W.prototype;function Pe(z,U,Oe){this.props=z,this.context=U,this.refs=ze,this.updater=Oe||ne}var Ke=Pe.prototype=new ue;Ke.constructor=Pe,he(Ke,W.prototype),Ke.isPureReactComponent=!0;var Te=Array.isArray,Ee=Object.prototype.hasOwnProperty,ke={current:null},ve={key:!0,ref:!0,__self:!0,__source:!0};function Ge(z,U,Oe){var Me,He={},We=null,et=null;if(U!=null)for(Me in U.ref!==void 0&&(et=U.ref),U.key!==void 0&&(We=""+U.key),U)Ee.call(U,Me)&&!ve.hasOwnProperty(Me)&&(He[Me]=U[Me]);var tt=arguments.length-2;if(tt===1)He.children=Oe;else if(1<tt){for(var X=Array(tt),rt=0;rt<tt;rt++)X[rt]=arguments[rt+2];He.children=X}if(z&&z.defaultProps)for(Me in tt=z.defaultProps,tt)He[Me]===void 0&&(He[Me]=tt[Me]);return{$$typeof:u,type:z,key:We,ref:et,props:He,_owner:ke.current}}function Se(z,U){return{$$typeof:u,type:z.type,key:U,ref:z.ref,props:z.props,_owner:z._owner}}function lt(z){return typeof z=="object"&&z!==null&&z.$$typeof===u}function Je(z){var U={"=":"=0",":":"=2"};return"$"+z.replace(/[=:]/g,function(Oe){return U[Oe]})}var q=/\/+/g;function me(z,U){return typeof z=="object"&&z!==null&&z.key!=null?Je(""+z.key):U.toString(36)}function O(z,U,Oe,Me,He){var We=typeof z;(We==="undefined"||We==="boolean")&&(z=null);var et=!1;if(z===null)et=!0;else switch(We){case"string":case"number":et=!0;break;case"object":switch(z.$$typeof){case u:case h:et=!0}}if(et)return et=z,He=He(et),z=Me===""?"."+me(et,0):Me,Te(He)?(Oe="",z!=null&&(Oe=z.replace(q,"$&/")+"/"),O(He,U,Oe,"",function(rt){return rt})):He!=null&&(lt(He)&&(He=Se(He,Oe+(!He.key||et&&et.key===He.key?"":(""+He.key).replace(q,"$&/")+"/")+z)),U.push(He)),1;if(et=0,Me=Me===""?".":Me+":",Te(z))for(var tt=0;tt<z.length;tt++){We=z[tt];var X=Me+me(We,tt);et+=O(We,U,Oe,X,He)}else if(X=ie(z),typeof X=="function")for(z=X.call(z),tt=0;!(We=z.next()).done;)We=We.value,X=Me+me(We,tt++),et+=O(We,U,Oe,X,He);else if(We==="object")throw U=String(z),Error("Objects are not valid as a React child (found: "+(U==="[object Object]"?"object with keys {"+Object.keys(z).join(", ")+"}":U)+"). If you meant to render a collection of children, use an array instead.");return et}function le(z,U,Oe){if(z==null)return z;var Me=[],He=0;return O(z,Me,"","",function(We){return U.call(Oe,We,He++)}),Me}function Le(z){if(z._status===-1){var U=z._result;U=U(),U.then(function(Oe){(z._status===0||z._status===-1)&&(z._status=1,z._result=Oe)},function(Oe){(z._status===0||z._status===-1)&&(z._status=2,z._result=Oe)}),z._status===-1&&(z._status=0,z._result=U)}if(z._status===1)return z._result.default;throw z._result}var Be={current:null},Z={transition:null},pe={ReactCurrentDispatcher:Be,ReactCurrentBatchConfig:Z,ReactCurrentOwner:ke};function ce(){throw Error("act(...) is not supported in production builds of React.")}return Ze.Children={map:le,forEach:function(z,U,Oe){le(z,function(){U.apply(this,arguments)},Oe)},count:function(z){var U=0;return le(z,function(){U++}),U},toArray:function(z){return le(z,function(U){return U})||[]},only:function(z){if(!lt(z))throw Error("React.Children.only expected to receive a single React element child.");return z}},Ze.Component=W,Ze.Fragment=p,Ze.Profiler=k,Ze.PureComponent=Pe,Ze.StrictMode=j,Ze.Suspense=F,Ze.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=pe,Ze.act=ce,Ze.cloneElement=function(z,U,Oe){if(z==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+z+".");var Me=he({},z.props),He=z.key,We=z.ref,et=z._owner;if(U!=null){if(U.ref!==void 0&&(We=U.ref,et=ke.current),U.key!==void 0&&(He=""+U.key),z.type&&z.type.defaultProps)var tt=z.type.defaultProps;for(X in U)Ee.call(U,X)&&!ve.hasOwnProperty(X)&&(Me[X]=U[X]===void 0&&tt!==void 0?tt[X]:U[X])}var X=arguments.length-2;if(X===1)Me.children=Oe;else if(1<X){tt=Array(X);for(var rt=0;rt<X;rt++)tt[rt]=arguments[rt+2];Me.children=tt}return{$$typeof:u,type:z.type,key:He,ref:We,props:Me,_owner:et}},Ze.createContext=function(z){return z={$$typeof:ae,_currentValue:z,_currentValue2:z,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},z.Provider={$$typeof:L,_context:z},z.Consumer=z},Ze.createElement=Ge,Ze.createFactory=function(z){var U=Ge.bind(null,z);return U.type=z,U},Ze.createRef=function(){return{current:null}},Ze.forwardRef=function(z){return{$$typeof:G,render:z}},Ze.isValidElement=lt,Ze.lazy=function(z){return{$$typeof:Y,_payload:{_status:-1,_result:z},_init:Le}},Ze.memo=function(z,U){return{$$typeof:B,type:z,compare:U===void 0?null:U}},Ze.startTransition=function(z){var U=Z.transition;Z.transition={};try{z()}finally{Z.transition=U}},Ze.unstable_act=ce,Ze.useCallback=function(z,U){return Be.current.useCallback(z,U)},Ze.useContext=function(z){return Be.current.useContext(z)},Ze.useDebugValue=function(){},Ze.useDeferredValue=function(z){return Be.current.useDeferredValue(z)},Ze.useEffect=function(z,U){return Be.current.useEffect(z,U)},Ze.useId=function(){return Be.current.useId()},Ze.useImperativeHandle=function(z,U,Oe){return Be.current.useImperativeHandle(z,U,Oe)},Ze.useInsertionEffect=function(z,U){return Be.current.useInsertionEffect(z,U)},Ze.useLayoutEffect=function(z,U){return Be.current.useLayoutEffect(z,U)},Ze.useMemo=function(z,U){return Be.current.useMemo(z,U)},Ze.useReducer=function(z,U,Oe){return Be.current.useReducer(z,U,Oe)},Ze.useRef=function(z){return Be.current.useRef(z)},Ze.useState=function(z){return Be.current.useState(z)},Ze.useSyncExternalStore=function(z,U,Oe){return Be.current.useSyncExternalStore(z,U,Oe)},Ze.useTransition=function(){return Be.current.useTransition()},Ze.version="18.3.1",Ze}var nd;function nl(){return nd||(nd=1,$s.exports=qp()),$s.exports}/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var od;function Xp(){if(od)return rl;od=1;var u=nl(),h=Symbol.for("react.element"),p=Symbol.for("react.fragment"),j=Object.prototype.hasOwnProperty,k=u.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,L={key:!0,ref:!0,__self:!0,__source:!0};function ae(G,F,B){var Y,H={},ie=null,ne=null;B!==void 0&&(ie=""+B),F.key!==void 0&&(ie=""+F.key),F.ref!==void 0&&(ne=F.ref);for(Y in F)j.call(F,Y)&&!L.hasOwnProperty(Y)&&(H[Y]=F[Y]);if(G&&G.defaultProps)for(Y in F=G.defaultProps,F)H[Y]===void 0&&(H[Y]=F[Y]);return{$$typeof:h,type:G,key:ie,ref:ne,props:H,_owner:k.current}}return rl.Fragment=p,rl.jsx=ae,rl.jsxs=ae,rl}var id;function Zp(){return id||(id=1,Bs.exports=Xp()),Bs.exports}var o=Zp(),I=nl();const Wn=Ed(I);var na={},As={exports:{}},_r={},Us={exports:{}},Hs={};/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var ld;function Jp(){return ld||(ld=1,(function(u){function h(Z,pe){var ce=Z.length;Z.push(pe);e:for(;0<ce;){var z=ce-1>>>1,U=Z[z];if(0<k(U,pe))Z[z]=pe,Z[ce]=U,ce=z;else break e}}function p(Z){return Z.length===0?null:Z[0]}function j(Z){if(Z.length===0)return null;var pe=Z[0],ce=Z.pop();if(ce!==pe){Z[0]=ce;e:for(var z=0,U=Z.length,Oe=U>>>1;z<Oe;){var Me=2*(z+1)-1,He=Z[Me],We=Me+1,et=Z[We];if(0>k(He,ce))We<U&&0>k(et,He)?(Z[z]=et,Z[We]=ce,z=We):(Z[z]=He,Z[Me]=ce,z=Me);else if(We<U&&0>k(et,ce))Z[z]=et,Z[We]=ce,z=We;else break e}}return pe}function k(Z,pe){var ce=Z.sortIndex-pe.sortIndex;return ce!==0?ce:Z.id-pe.id}if(typeof performance=="object"&&typeof performance.now=="function"){var L=performance;u.unstable_now=function(){return L.now()}}else{var ae=Date,G=ae.now();u.unstable_now=function(){return ae.now()-G}}var F=[],B=[],Y=1,H=null,ie=3,ne=!1,he=!1,ze=!1,W=typeof setTimeout=="function"?setTimeout:null,ue=typeof clearTimeout=="function"?clearTimeout:null,Pe=typeof setImmediate<"u"?setImmediate:null;typeof navigator<"u"&&navigator.scheduling!==void 0&&navigator.scheduling.isInputPending!==void 0&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function Ke(Z){for(var pe=p(B);pe!==null;){if(pe.callback===null)j(B);else if(pe.startTime<=Z)j(B),pe.sortIndex=pe.expirationTime,h(F,pe);else break;pe=p(B)}}function Te(Z){if(ze=!1,Ke(Z),!he)if(p(F)!==null)he=!0,Le(Ee);else{var pe=p(B);pe!==null&&Be(Te,pe.startTime-Z)}}function Ee(Z,pe){he=!1,ze&&(ze=!1,ue(Ge),Ge=-1),ne=!0;var ce=ie;try{for(Ke(pe),H=p(F);H!==null&&(!(H.expirationTime>pe)||Z&&!Je());){var z=H.callback;if(typeof z=="function"){H.callback=null,ie=H.priorityLevel;var U=z(H.expirationTime<=pe);pe=u.unstable_now(),typeof U=="function"?H.callback=U:H===p(F)&&j(F),Ke(pe)}else j(F);H=p(F)}if(H!==null)var Oe=!0;else{var Me=p(B);Me!==null&&Be(Te,Me.startTime-pe),Oe=!1}return Oe}finally{H=null,ie=ce,ne=!1}}var ke=!1,ve=null,Ge=-1,Se=5,lt=-1;function Je(){return!(u.unstable_now()-lt<Se)}function q(){if(ve!==null){var Z=u.unstable_now();lt=Z;var pe=!0;try{pe=ve(!0,Z)}finally{pe?me():(ke=!1,ve=null)}}else ke=!1}var me;if(typeof Pe=="function")me=function(){Pe(q)};else if(typeof MessageChannel<"u"){var O=new MessageChannel,le=O.port2;O.port1.onmessage=q,me=function(){le.postMessage(null)}}else me=function(){W(q,0)};function Le(Z){ve=Z,ke||(ke=!0,me())}function Be(Z,pe){Ge=W(function(){Z(u.unstable_now())},pe)}u.unstable_IdlePriority=5,u.unstable_ImmediatePriority=1,u.unstable_LowPriority=4,u.unstable_NormalPriority=3,u.unstable_Profiling=null,u.unstable_UserBlockingPriority=2,u.unstable_cancelCallback=function(Z){Z.callback=null},u.unstable_continueExecution=function(){he||ne||(he=!0,Le(Ee))},u.unstable_forceFrameRate=function(Z){0>Z||125<Z?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):Se=0<Z?Math.floor(1e3/Z):5},u.unstable_getCurrentPriorityLevel=function(){return ie},u.unstable_getFirstCallbackNode=function(){return p(F)},u.unstable_next=function(Z){switch(ie){case 1:case 2:case 3:var pe=3;break;default:pe=ie}var ce=ie;ie=pe;try{return Z()}finally{ie=ce}},u.unstable_pauseExecution=function(){},u.unstable_requestPaint=function(){},u.unstable_runWithPriority=function(Z,pe){switch(Z){case 1:case 2:case 3:case 4:case 5:break;default:Z=3}var ce=ie;ie=Z;try{return pe()}finally{ie=ce}},u.unstable_scheduleCallback=function(Z,pe,ce){var z=u.unstable_now();switch(typeof ce=="object"&&ce!==null?(ce=ce.delay,ce=typeof ce=="number"&&0<ce?z+ce:z):ce=z,Z){case 1:var U=-1;break;case 2:U=250;break;case 5:U=1073741823;break;case 4:U=1e4;break;default:U=5e3}return U=ce+U,Z={id:Y++,callback:pe,priorityLevel:Z,startTime:ce,expirationTime:U,sortIndex:-1},ce>z?(Z.sortIndex=ce,h(B,Z),p(F)===null&&Z===p(B)&&(ze?(ue(Ge),Ge=-1):ze=!0,Be(Te,ce-z))):(Z.sortIndex=U,h(F,Z),he||ne||(he=!0,Le(Ee))),Z},u.unstable_shouldYield=Je,u.unstable_wrapCallback=function(Z){var pe=ie;return function(){var ce=ie;ie=pe;try{return Z.apply(this,arguments)}finally{ie=ce}}}})(Hs)),Hs}var ad;function ef(){return ad||(ad=1,Us.exports=Jp()),Us.exports}/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var sd;function tf(){if(sd)return _r;sd=1;var u=nl(),h=ef();function p(e){for(var t="https://reactjs.org/docs/error-decoder.html?invariant="+e,r=1;r<arguments.length;r++)t+="&args[]="+encodeURIComponent(arguments[r]);return"Minified React error #"+e+"; visit "+t+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var j=new Set,k={};function L(e,t){ae(e,t),ae(e+"Capture",t)}function ae(e,t){for(k[e]=t,e=0;e<t.length;e++)j.add(t[e])}var G=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),F=Object.prototype.hasOwnProperty,B=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,Y={},H={};function ie(e){return F.call(H,e)?!0:F.call(Y,e)?!1:B.test(e)?H[e]=!0:(Y[e]=!0,!1)}function ne(e,t,r,n){if(r!==null&&r.type===0)return!1;switch(typeof t){case"function":case"symbol":return!0;case"boolean":return n?!1:r!==null?!r.acceptsBooleans:(e=e.toLowerCase().slice(0,5),e!=="data-"&&e!=="aria-");default:return!1}}function he(e,t,r,n){if(t===null||typeof t>"u"||ne(e,t,r,n))return!0;if(n)return!1;if(r!==null)switch(r.type){case 3:return!t;case 4:return t===!1;case 5:return isNaN(t);case 6:return isNaN(t)||1>t}return!1}function ze(e,t,r,n,i,s,f){this.acceptsBooleans=t===2||t===3||t===4,this.attributeName=n,this.attributeNamespace=i,this.mustUseProperty=r,this.propertyName=e,this.type=t,this.sanitizeURL=s,this.removeEmptyString=f}var W={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(e){W[e]=new ze(e,0,!1,e,null,!1,!1)}),[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(e){var t=e[0];W[t]=new ze(t,1,!1,e[1],null,!1,!1)}),["contentEditable","draggable","spellCheck","value"].forEach(function(e){W[e]=new ze(e,2,!1,e.toLowerCase(),null,!1,!1)}),["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(e){W[e]=new ze(e,2,!1,e,null,!1,!1)}),"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(e){W[e]=new ze(e,3,!1,e.toLowerCase(),null,!1,!1)}),["checked","multiple","muted","selected"].forEach(function(e){W[e]=new ze(e,3,!0,e,null,!1,!1)}),["capture","download"].forEach(function(e){W[e]=new ze(e,4,!1,e,null,!1,!1)}),["cols","rows","size","span"].forEach(function(e){W[e]=new ze(e,6,!1,e,null,!1,!1)}),["rowSpan","start"].forEach(function(e){W[e]=new ze(e,5,!1,e.toLowerCase(),null,!1,!1)});var ue=/[\-:]([a-z])/g;function Pe(e){return e[1].toUpperCase()}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(e){var t=e.replace(ue,Pe);W[t]=new ze(t,1,!1,e,null,!1,!1)}),"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(e){var t=e.replace(ue,Pe);W[t]=new ze(t,1,!1,e,"http://www.w3.org/1999/xlink",!1,!1)}),["xml:base","xml:lang","xml:space"].forEach(function(e){var t=e.replace(ue,Pe);W[t]=new ze(t,1,!1,e,"http://www.w3.org/XML/1998/namespace",!1,!1)}),["tabIndex","crossOrigin"].forEach(function(e){W[e]=new ze(e,1,!1,e.toLowerCase(),null,!1,!1)}),W.xlinkHref=new ze("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1),["src","href","action","formAction"].forEach(function(e){W[e]=new ze(e,1,!1,e.toLowerCase(),null,!0,!0)});function Ke(e,t,r,n){var i=W.hasOwnProperty(t)?W[t]:null;(i!==null?i.type!==0:n||!(2<t.length)||t[0]!=="o"&&t[0]!=="O"||t[1]!=="n"&&t[1]!=="N")&&(he(t,r,i,n)&&(r=null),n||i===null?ie(t)&&(r===null?e.removeAttribute(t):e.setAttribute(t,""+r)):i.mustUseProperty?e[i.propertyName]=r===null?i.type===3?!1:"":r:(t=i.attributeName,n=i.attributeNamespace,r===null?e.removeAttribute(t):(i=i.type,r=i===3||i===4&&r===!0?"":""+r,n?e.setAttributeNS(n,t,r):e.setAttribute(t,r))))}var Te=u.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,Ee=Symbol.for("react.element"),ke=Symbol.for("react.portal"),ve=Symbol.for("react.fragment"),Ge=Symbol.for("react.strict_mode"),Se=Symbol.for("react.profiler"),lt=Symbol.for("react.provider"),Je=Symbol.for("react.context"),q=Symbol.for("react.forward_ref"),me=Symbol.for("react.suspense"),O=Symbol.for("react.suspense_list"),le=Symbol.for("react.memo"),Le=Symbol.for("react.lazy"),Be=Symbol.for("react.offscreen"),Z=Symbol.iterator;function pe(e){return e===null||typeof e!="object"?null:(e=Z&&e[Z]||e["@@iterator"],typeof e=="function"?e:null)}var ce=Object.assign,z;function U(e){if(z===void 0)try{throw Error()}catch(r){var t=r.stack.trim().match(/\n( *(at )?)/);z=t&&t[1]||""}return`
`+z+e}var Oe=!1;function Me(e,t){if(!e||Oe)return"";Oe=!0;var r=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(t)if(t=function(){throw Error()},Object.defineProperty(t.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(t,[])}catch(R){var n=R}Reflect.construct(e,[],t)}else{try{t.call()}catch(R){n=R}e.call(t.prototype)}else{try{throw Error()}catch(R){n=R}e()}}catch(R){if(R&&n&&typeof R.stack=="string"){for(var i=R.stack.split(`
`),s=n.stack.split(`
`),f=i.length-1,w=s.length-1;1<=f&&0<=w&&i[f]!==s[w];)w--;for(;1<=f&&0<=w;f--,w--)if(i[f]!==s[w]){if(f!==1||w!==1)do if(f--,w--,0>w||i[f]!==s[w]){var b=`
`+i[f].replace(" at new "," at ");return e.displayName&&b.includes("<anonymous>")&&(b=b.replace("<anonymous>",e.displayName)),b}while(1<=f&&0<=w);break}}}finally{Oe=!1,Error.prepareStackTrace=r}return(e=e?e.displayName||e.name:"")?U(e):""}function He(e){switch(e.tag){case 5:return U(e.type);case 16:return U("Lazy");case 13:return U("Suspense");case 19:return U("SuspenseList");case 0:case 2:case 15:return e=Me(e.type,!1),e;case 11:return e=Me(e.type.render,!1),e;case 1:return e=Me(e.type,!0),e;default:return""}}function We(e){if(e==null)return null;if(typeof e=="function")return e.displayName||e.name||null;if(typeof e=="string")return e;switch(e){case ve:return"Fragment";case ke:return"Portal";case Se:return"Profiler";case Ge:return"StrictMode";case me:return"Suspense";case O:return"SuspenseList"}if(typeof e=="object")switch(e.$$typeof){case Je:return(e.displayName||"Context")+".Consumer";case lt:return(e._context.displayName||"Context")+".Provider";case q:var t=e.render;return e=e.displayName,e||(e=t.displayName||t.name||"",e=e!==""?"ForwardRef("+e+")":"ForwardRef"),e;case le:return t=e.displayName||null,t!==null?t:We(e.type)||"Memo";case Le:t=e._payload,e=e._init;try{return We(e(t))}catch{}}return null}function et(e){var t=e.type;switch(e.tag){case 24:return"Cache";case 9:return(t.displayName||"Context")+".Consumer";case 10:return(t._context.displayName||"Context")+".Provider";case 18:return"DehydratedFragment";case 11:return e=t.render,e=e.displayName||e.name||"",t.displayName||(e!==""?"ForwardRef("+e+")":"ForwardRef");case 7:return"Fragment";case 5:return t;case 4:return"Portal";case 3:return"Root";case 6:return"Text";case 16:return We(t);case 8:return t===Ge?"StrictMode":"Mode";case 22:return"Offscreen";case 12:return"Profiler";case 21:return"Scope";case 13:return"Suspense";case 19:return"SuspenseList";case 25:return"TracingMarker";case 1:case 0:case 17:case 2:case 14:case 15:if(typeof t=="function")return t.displayName||t.name||null;if(typeof t=="string")return t}return null}function tt(e){switch(typeof e){case"boolean":case"number":case"string":case"undefined":return e;case"object":return e;default:return""}}function X(e){var t=e.type;return(e=e.nodeName)&&e.toLowerCase()==="input"&&(t==="checkbox"||t==="radio")}function rt(e){var t=X(e)?"checked":"value",r=Object.getOwnPropertyDescriptor(e.constructor.prototype,t),n=""+e[t];if(!e.hasOwnProperty(t)&&typeof r<"u"&&typeof r.get=="function"&&typeof r.set=="function"){var i=r.get,s=r.set;return Object.defineProperty(e,t,{configurable:!0,get:function(){return i.call(this)},set:function(f){n=""+f,s.call(this,f)}}),Object.defineProperty(e,t,{enumerable:r.enumerable}),{getValue:function(){return n},setValue:function(f){n=""+f},stopTracking:function(){e._valueTracker=null,delete e[t]}}}}function jt(e){e._valueTracker||(e._valueTracker=rt(e))}function Tr(e){if(!e)return!1;var t=e._valueTracker;if(!t)return!0;var r=t.getValue(),n="";return e&&(n=X(e)?e.checked?"true":"false":e.value),e=n,e!==r?(t.setValue(e),!0):!1}function st(e){if(e=e||(typeof document<"u"?document:void 0),typeof e>"u")return null;try{return e.activeElement||e.body}catch{return e.body}}function Lt(e,t){var r=t.checked;return ce({},t,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:r??e._wrapperState.initialChecked})}function Mr(e,t){var r=t.defaultValue==null?"":t.defaultValue,n=t.checked!=null?t.checked:t.defaultChecked;r=tt(t.value!=null?t.value:r),e._wrapperState={initialChecked:n,initialValue:r,controlled:t.type==="checkbox"||t.type==="radio"?t.checked!=null:t.value!=null}}function yr(e,t){t=t.checked,t!=null&&Ke(e,"checked",t,!1)}function Tn(e,t){yr(e,t);var r=tt(t.value),n=t.type;if(r!=null)n==="number"?(r===0&&e.value===""||e.value!=r)&&(e.value=""+r):e.value!==""+r&&(e.value=""+r);else if(n==="submit"||n==="reset"){e.removeAttribute("value");return}t.hasOwnProperty("value")?nr(e,t.type,r):t.hasOwnProperty("defaultValue")&&nr(e,t.type,tt(t.defaultValue)),t.checked==null&&t.defaultChecked!=null&&(e.defaultChecked=!!t.defaultChecked)}function Yr(e,t,r){if(t.hasOwnProperty("value")||t.hasOwnProperty("defaultValue")){var n=t.type;if(!(n!=="submit"&&n!=="reset"||t.value!==void 0&&t.value!==null))return;t=""+e._wrapperState.initialValue,r||t===e.value||(e.value=t),e.defaultValue=t}r=e.name,r!==""&&(e.name=""),e.defaultChecked=!!e._wrapperState.initialChecked,r!==""&&(e.name=r)}function nr(e,t,r){(t!=="number"||st(e.ownerDocument)!==e)&&(r==null?e.defaultValue=""+e._wrapperState.initialValue:e.defaultValue!==""+r&&(e.defaultValue=""+r))}var Nt=Array.isArray;function Lr(e,t,r,n){if(e=e.options,t){t={};for(var i=0;i<r.length;i++)t["$"+r[i]]=!0;for(r=0;r<e.length;r++)i=t.hasOwnProperty("$"+e[r].value),e[r].selected!==i&&(e[r].selected=i),i&&n&&(e[r].defaultSelected=!0)}else{for(r=""+tt(r),t=null,i=0;i<e.length;i++){if(e[i].value===r){e[i].selected=!0,n&&(e[i].defaultSelected=!0);return}t!==null||e[i].disabled||(t=e[i])}t!==null&&(t.selected=!0)}}function or(e,t){if(t.dangerouslySetInnerHTML!=null)throw Error(p(91));return ce({},t,{value:void 0,defaultValue:void 0,children:""+e._wrapperState.initialValue})}function dt(e,t){var r=t.value;if(r==null){if(r=t.children,t=t.defaultValue,r!=null){if(t!=null)throw Error(p(92));if(Nt(r)){if(1<r.length)throw Error(p(93));r=r[0]}t=r}t==null&&(t=""),r=t}e._wrapperState={initialValue:tt(r)}}function Mn(e,t){var r=tt(t.value),n=tt(t.defaultValue);r!=null&&(r=""+r,r!==e.value&&(e.value=r),t.defaultValue==null&&e.defaultValue!==r&&(e.defaultValue=r)),n!=null&&(e.defaultValue=""+n)}function Fr(e){var t=e.textContent;t===e._wrapperState.initialValue&&t!==""&&t!==null&&(e.value=t)}function fn(e){switch(e){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function $t(e,t){return e==null||e==="http://www.w3.org/1999/xhtml"?fn(t):e==="http://www.w3.org/2000/svg"&&t==="foreignObject"?"http://www.w3.org/1999/xhtml":e}var wr,hn=(function(e){return typeof MSApp<"u"&&MSApp.execUnsafeLocalFunction?function(t,r,n,i){MSApp.execUnsafeLocalFunction(function(){return e(t,r,n,i)})}:e})(function(e,t){if(e.namespaceURI!=="http://www.w3.org/2000/svg"||"innerHTML"in e)e.innerHTML=t;else{for(wr=wr||document.createElement("div"),wr.innerHTML="<svg>"+t.valueOf().toString()+"</svg>",t=wr.firstChild;e.firstChild;)e.removeChild(e.firstChild);for(;t.firstChild;)e.appendChild(t.firstChild)}});function Rr(e,t){if(t){var r=e.firstChild;if(r&&r===e.lastChild&&r.nodeType===3){r.nodeValue=t;return}}e.textContent=t}var Kr={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},Ln=["Webkit","ms","Moz","O"];Object.keys(Kr).forEach(function(e){Ln.forEach(function(t){t=t+e.charAt(0).toUpperCase()+e.substring(1),Kr[t]=Kr[e]})});function Ir(e,t,r){return t==null||typeof t=="boolean"||t===""?"":r||typeof t!="number"||t===0||Kr.hasOwnProperty(e)&&Kr[e]?(""+t).trim():t+"px"}function Fn(e,t){e=e.style;for(var r in t)if(t.hasOwnProperty(r)){var n=r.indexOf("--")===0,i=Ir(r,t[r],n);r==="float"&&(r="cssFloat"),n?e.setProperty(r,i):e[r]=i}}var ao=ce({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function kr(e,t){if(t){if(ao[e]&&(t.children!=null||t.dangerouslySetInnerHTML!=null))throw Error(p(137,e));if(t.dangerouslySetInnerHTML!=null){if(t.children!=null)throw Error(p(60));if(typeof t.dangerouslySetInnerHTML!="object"||!("__html"in t.dangerouslySetInnerHTML))throw Error(p(61))}if(t.style!=null&&typeof t.style!="object")throw Error(p(62))}}function Rn(e,t){if(e.indexOf("-")===-1)return typeof t.is=="string";switch(e){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var mn=null;function Pt(e){return e=e.target||e.srcElement||window,e.correspondingUseElement&&(e=e.correspondingUseElement),e.nodeType===3?e.parentNode:e}var At=null,hr=null,Xe=null;function Ut(e){if(e=Ai(e)){if(typeof At!="function")throw Error(p(280));var t=e.stateNode;t&&(t=vl(t),At(e.stateNode,e.type,t))}}function Gr(e){hr?Xe?Xe.push(e):Xe=[e]:hr=e}function qr(){if(hr){var e=hr,t=Xe;if(Xe=hr=null,Ut(e),t)for(e=0;e<t.length;e++)Ut(t[e])}}function Ht(e,t){return e(t)}function Gt(){}var ir=!1;function Xr(e,t,r){if(ir)return e(t,r);ir=!0;try{return Ht(e,t,r)}finally{ir=!1,(hr!==null||Xe!==null)&&(Gt(),qr())}}function Ft(e,t){var r=e.stateNode;if(r===null)return null;var n=vl(r);if(n===null)return null;r=n[t];e:switch(t){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(n=!n.disabled)||(e=e.type,n=!(e==="button"||e==="input"||e==="select"||e==="textarea")),e=!n;break e;default:e=!1}if(e)return null;if(r&&typeof r!="function")throw Error(p(231,t,typeof r));return r}var gn=!1;if(G)try{var br={};Object.defineProperty(br,"passive",{get:function(){gn=!0}}),window.addEventListener("test",br,br),window.removeEventListener("test",br,br)}catch{gn=!1}function Zr(e,t,r,n,i,s,f,w,b){var R=Array.prototype.slice.call(arguments,3);try{t.apply(r,R)}catch(K){this.onError(K)}}var lr=!1,Or=null,Jr=!1,Dr=null,xn={onError:function(e){lr=!0,Or=e}};function ft(e,t,r,n,i,s,f,w,b){lr=!1,Or=null,Zr.apply(xn,arguments)}function In(e,t,r,n,i,s,f,w,b){if(ft.apply(this,arguments),lr){if(lr){var R=Or;lr=!1,Or=null}else throw Error(p(198));Jr||(Jr=!0,Dr=R)}}function ar(e){var t=e,r=e;if(e.alternate)for(;t.return;)t=t.return;else{e=t;do t=e,(t.flags&4098)!==0&&(r=t.return),e=t.return;while(e)}return t.tag===3?r:null}function qt(e){if(e.tag===13){var t=e.memoizedState;if(t===null&&(e=e.alternate,e!==null&&(t=e.memoizedState)),t!==null)return t.dehydrated}return null}function wt(e){if(ar(e)!==e)throw Error(p(188))}function vn(e){var t=e.alternate;if(!t){if(t=ar(e),t===null)throw Error(p(188));return t!==e?null:e}for(var r=e,n=t;;){var i=r.return;if(i===null)break;var s=i.alternate;if(s===null){if(n=i.return,n!==null){r=n;continue}break}if(i.child===s.child){for(s=i.child;s;){if(s===r)return wt(i),e;if(s===n)return wt(i),t;s=s.sibling}throw Error(p(188))}if(r.return!==n.return)r=i,n=s;else{for(var f=!1,w=i.child;w;){if(w===r){f=!0,r=i,n=s;break}if(w===n){f=!0,n=i,r=s;break}w=w.sibling}if(!f){for(w=s.child;w;){if(w===r){f=!0,r=s,n=i;break}if(w===n){f=!0,n=s,r=i;break}w=w.sibling}if(!f)throw Error(p(189))}}if(r.alternate!==n)throw Error(p(190))}if(r.tag!==3)throw Error(p(188));return r.stateNode.current===r?e:t}function yn(e){return e=vn(e),e!==null?en(e):null}function en(e){if(e.tag===5||e.tag===6)return e;for(e=e.child;e!==null;){var t=en(e);if(t!==null)return t;e=e.sibling}return null}var Wt=h.unstable_scheduleCallback,tn=h.unstable_cancelCallback,On=h.unstable_shouldYield,Vn=h.unstable_requestPaint,ot=h.unstable_now,_t=h.unstable_getCurrentPriorityLevel,wn=h.unstable_ImmediatePriority,kn=h.unstable_UserBlockingPriority,rn=h.unstable_NormalPriority,nn=h.unstable_LowPriority,Br=h.unstable_IdlePriority,mr=null,Xt=null;function $r(e){if(Xt&&typeof Xt.onCommitFiberRoot=="function")try{Xt.onCommitFiberRoot(mr,e,void 0,(e.current.flags&128)===128)}catch{}}var Ct=Math.clz32?Math.clz32:Kn,Qn=Math.log,Yn=Math.LN2;function Kn(e){return e>>>=0,e===0?32:31-(Qn(e)/Yn|0)|0}var Ar=64,bn=4194304;function on(e){switch(e&-e){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return e&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return e&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;default:return e}}function ln(e,t){var r=e.pendingLanes;if(r===0)return 0;var n=0,i=e.suspendedLanes,s=e.pingedLanes,f=r&268435455;if(f!==0){var w=f&~i;w!==0?n=on(w):(s&=f,s!==0&&(n=on(s)))}else f=r&~i,f!==0?n=on(f):s!==0&&(n=on(s));if(n===0)return 0;if(t!==0&&t!==n&&(t&i)===0&&(i=n&-n,s=t&-t,i>=s||i===16&&(s&4194240)!==0))return t;if((n&4)!==0&&(n|=r&16),t=e.entangledLanes,t!==0)for(e=e.entanglements,t&=n;0<t;)r=31-Ct(t),i=1<<r,n|=e[r],t&=~i;return n}function l(e,t){switch(e){case 1:case 2:case 4:return t+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return t+5e3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return-1;case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function d(e,t){for(var r=e.suspendedLanes,n=e.pingedLanes,i=e.expirationTimes,s=e.pendingLanes;0<s;){var f=31-Ct(s),w=1<<f,b=i[f];b===-1?((w&r)===0||(w&n)!==0)&&(i[f]=l(w,t)):b<=t&&(e.expiredLanes|=w),s&=~w}}function g(e){return e=e.pendingLanes&-1073741825,e!==0?e:e&1073741824?1073741824:0}function y(){var e=Ar;return Ar<<=1,(Ar&4194240)===0&&(Ar=64),e}function _(e){for(var t=[],r=0;31>r;r++)t.push(e);return t}function E(e,t,r){e.pendingLanes|=t,t!==536870912&&(e.suspendedLanes=0,e.pingedLanes=0),e=e.eventTimes,t=31-Ct(t),e[t]=r}function D(e,t){var r=e.pendingLanes&~t;e.pendingLanes=t,e.suspendedLanes=0,e.pingedLanes=0,e.expiredLanes&=t,e.mutableReadLanes&=t,e.entangledLanes&=t,t=e.entanglements;var n=e.eventTimes;for(e=e.expirationTimes;0<r;){var i=31-Ct(r),s=1<<i;t[i]=0,n[i]=-1,e[i]=-1,r&=~s}}function re(e,t){var r=e.entangledLanes|=t;for(e=e.entanglements;r;){var n=31-Ct(r),i=1<<n;i&t|e[n]&t&&(e[n]|=t),r&=~i}}var se=0;function Fe(e){return e&=-e,1<e?4<e?(e&268435455)!==0?16:536870912:4:1}var $e,at,Zt,Jt,x,C=!1,$=[],V=null,de=null,fe=null,ge=new Map,_e=new Map,Qe=[],gt="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");function ht(e,t){switch(e){case"focusin":case"focusout":V=null;break;case"dragenter":case"dragleave":de=null;break;case"mouseover":case"mouseout":fe=null;break;case"pointerover":case"pointerout":ge.delete(t.pointerId);break;case"gotpointercapture":case"lostpointercapture":_e.delete(t.pointerId)}}function Tt(e,t,r,n,i,s){return e===null||e.nativeEvent!==s?(e={blockedOn:t,domEventName:r,eventSystemFlags:n,nativeEvent:s,targetContainers:[i]},t!==null&&(t=Ai(t),t!==null&&at(t)),e):(e.eventSystemFlags|=n,t=e.targetContainers,i!==null&&t.indexOf(i)===-1&&t.push(i),e)}function bt(e,t,r,n,i){switch(t){case"focusin":return V=Tt(V,e,t,r,n,i),!0;case"dragenter":return de=Tt(de,e,t,r,n,i),!0;case"mouseover":return fe=Tt(fe,e,t,r,n,i),!0;case"pointerover":var s=i.pointerId;return ge.set(s,Tt(ge.get(s)||null,e,t,r,n,i)),!0;case"gotpointercapture":return s=i.pointerId,_e.set(s,Tt(_e.get(s)||null,e,t,r,n,i)),!0}return!1}function Rt(e){var t=Fo(e.target);if(t!==null){var r=ar(t);if(r!==null){if(t=r.tag,t===13){if(t=qt(r),t!==null){e.blockedOn=t,x(e.priority,function(){Zt(r)});return}}else if(t===3&&r.stateNode.current.memoizedState.isDehydrated){e.blockedOn=r.tag===3?r.stateNode.containerInfo:null;return}}}e.blockedOn=null}function Ce(e){if(e.blockedOn!==null)return!1;for(var t=e.targetContainers;0<t.length;){var r=No(e.domEventName,e.eventSystemFlags,t[0],e.nativeEvent);if(r===null){r=e.nativeEvent;var n=new r.constructor(r.type,r);mn=n,r.target.dispatchEvent(n),mn=null}else return t=Ai(r),t!==null&&at(t),e.blockedOn=r,!1;t.shift()}return!0}function qe(e,t,r){Ce(e)&&r.delete(t)}function ye(){C=!1,V!==null&&Ce(V)&&(V=null),de!==null&&Ce(de)&&(de=null),fe!==null&&Ce(fe)&&(fe=null),ge.forEach(qe),_e.forEach(qe)}function ut(e,t){e.blockedOn===t&&(e.blockedOn=null,C||(C=!0,h.unstable_scheduleCallback(h.unstable_NormalPriority,ye)))}function xt(e){function t(i){return ut(i,e)}if(0<$.length){ut($[0],e);for(var r=1;r<$.length;r++){var n=$[r];n.blockedOn===e&&(n.blockedOn=null)}}for(V!==null&&ut(V,e),de!==null&&ut(de,e),fe!==null&&ut(fe,e),ge.forEach(t),_e.forEach(t),r=0;r<Qe.length;r++)n=Qe[r],n.blockedOn===e&&(n.blockedOn=null);for(;0<Qe.length&&(r=Qe[0],r.blockedOn===null);)Rt(r),r.blockedOn===null&&Qe.shift()}var Ot=Te.ReactCurrentBatchConfig,sr=!0;function so(e,t,r,n){var i=se,s=Ot.transition;Ot.transition=null;try{se=1,Ko(e,t,r,n)}finally{se=i,Ot.transition=s}}function Gn(e,t,r,n){var i=se,s=Ot.transition;Ot.transition=null;try{se=4,Ko(e,t,r,n)}finally{se=i,Ot.transition=s}}function Ko(e,t,r,n){if(sr){var i=No(e,t,r,n);if(i===null)Pa(e,t,n,uo,r),ht(e,n);else if(bt(i,e,t,r,n))n.stopPropagation();else if(ht(e,n),t&4&&-1<gt.indexOf(e)){for(;i!==null;){var s=Ai(i);if(s!==null&&$e(s),s=No(e,t,r,n),s===null&&Pa(e,t,n,uo,r),s===i)break;i=s}i!==null&&n.stopPropagation()}else Pa(e,t,n,null,r)}}var uo=null;function No(e,t,r,n){if(uo=null,e=Pt(n),e=Fo(e),e!==null)if(t=ar(e),t===null)e=null;else if(r=t.tag,r===13){if(e=qt(t),e!==null)return e;e=null}else if(r===3){if(t.stateNode.current.memoizedState.isDehydrated)return t.tag===3?t.stateNode.containerInfo:null;e=null}else t!==e&&(e=null);return uo=e,null}function ji(e){switch(e){case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 1;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"toggle":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 4;case"message":switch(_t()){case wn:return 1;case kn:return 4;case rn:case nn:return 16;case Br:return 536870912;default:return 16}default:return 16}}var zn=null,Go=null,qo=null;function ol(){if(qo)return qo;var e,t=Go,r=t.length,n,i="value"in zn?zn.value:zn.textContent,s=i.length;for(e=0;e<r&&t[e]===i[e];e++);var f=r-e;for(n=1;n<=f&&t[r-n]===i[s-n];n++);return qo=i.slice(e,1<n?1-n:void 0)}function qn(e){var t=e.keyCode;return"charCode"in e?(e=e.charCode,e===0&&t===13&&(e=13)):e=t,e===10&&(e=13),32<=e||e===13?e:0}function Po(){return!0}function _o(){return!1}function er(e){function t(r,n,i,s,f){this._reactName=r,this._targetInst=i,this.type=n,this.nativeEvent=s,this.target=f,this.currentTarget=null;for(var w in e)e.hasOwnProperty(w)&&(r=e[w],this[w]=r?r(s):s[w]);return this.isDefaultPrevented=(s.defaultPrevented!=null?s.defaultPrevented:s.returnValue===!1)?Po:_o,this.isPropagationStopped=_o,this}return ce(t.prototype,{preventDefault:function(){this.defaultPrevented=!0;var r=this.nativeEvent;r&&(r.preventDefault?r.preventDefault():typeof r.returnValue!="unknown"&&(r.returnValue=!1),this.isDefaultPrevented=Po)},stopPropagation:function(){var r=this.nativeEvent;r&&(r.stopPropagation?r.stopPropagation():typeof r.cancelBubble!="unknown"&&(r.cancelBubble=!0),this.isPropagationStopped=Po)},persist:function(){},isPersistent:Po}),t}var co={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(e){return e.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},Xn=er(co),To=ce({},co,{view:0,detail:0}),Ci=er(To),po,Zn,Dn,Mo=ce({},To,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:ti,button:0,buttons:0,relatedTarget:function(e){return e.relatedTarget===void 0?e.fromElement===e.srcElement?e.toElement:e.fromElement:e.relatedTarget},movementX:function(e){return"movementX"in e?e.movementX:(e!==Dn&&(Dn&&e.type==="mousemove"?(po=e.screenX-Dn.screenX,Zn=e.screenY-Dn.screenY):Zn=po=0,Dn=e),po)},movementY:function(e){return"movementY"in e?e.movementY:Zn}}),Ei=er(Mo),il=ce({},Mo,{dataTransfer:0}),Ni=er(il),gr=ce({},To,{relatedTarget:0}),Xo=er(gr),Pi=ce({},co,{animationName:0,elapsedTime:0,pseudoElement:0}),ya=er(Pi),ll=ce({},co,{clipboardData:function(e){return"clipboardData"in e?e.clipboardData:window.clipboardData}}),Zo=er(ll),al=ce({},co,{data:0}),_i=er(al),Jo={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},ei={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},sl={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function ul(e){var t=this.nativeEvent;return t.getModifierState?t.getModifierState(e):(e=sl[e])?!!t[e]:!1}function ti(){return ul}var Ti=ce({},To,{key:function(e){if(e.key){var t=Jo[e.key]||e.key;if(t!=="Unidentified")return t}return e.type==="keypress"?(e=qn(e),e===13?"Enter":String.fromCharCode(e)):e.type==="keydown"||e.type==="keyup"?ei[e.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:ti,charCode:function(e){return e.type==="keypress"?qn(e):0},keyCode:function(e){return e.type==="keydown"||e.type==="keyup"?e.keyCode:0},which:function(e){return e.type==="keypress"?qn(e):e.type==="keydown"||e.type==="keyup"?e.keyCode:0}}),cl=er(Ti),a=ce({},Mo,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),c=er(a),m=ce({},To,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:ti}),v=er(m),M=ce({},co,{propertyName:0,elapsedTime:0,pseudoElement:0}),P=er(M),A=ce({},Mo,{deltaX:function(e){return"deltaX"in e?e.deltaX:"wheelDeltaX"in e?-e.wheelDeltaX:0},deltaY:function(e){return"deltaY"in e?e.deltaY:"wheelDeltaY"in e?-e.wheelDeltaY:"wheelDelta"in e?-e.wheelDelta:0},deltaZ:0,deltaMode:0}),te=er(A),De=[9,13,27,32],Ye=G&&"CompositionEvent"in window,Ae=null;G&&"documentMode"in document&&(Ae=document.documentMode);var pt=G&&"TextEvent"in window&&!Ae,ur=G&&(!Ye||Ae&&8<Ae&&11>=Ae),zr=" ",Sr=!1;function Lo(e,t){switch(e){case"keyup":return De.indexOf(t.keyCode)!==-1;case"keydown":return t.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function Mi(e){return e=e.detail,typeof e=="object"&&"data"in e?e.data:null}var Bn=!1;function Vd(e,t){switch(e){case"compositionend":return Mi(t);case"keypress":return t.which!==32?null:(Sr=!0,zr);case"textInput":return e=t.data,e===zr&&Sr?null:e;default:return null}}function Qd(e,t){if(Bn)return e==="compositionend"||!Ye&&Lo(e,t)?(e=ol(),qo=Go=zn=null,Bn=!1,e):null;switch(e){case"paste":return null;case"keypress":if(!(t.ctrlKey||t.altKey||t.metaKey)||t.ctrlKey&&t.altKey){if(t.char&&1<t.char.length)return t.char;if(t.which)return String.fromCharCode(t.which)}return null;case"compositionend":return ur&&t.locale!=="ko"?null:t.data;default:return null}}var Yd={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function Zs(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t==="input"?!!Yd[e.type]:t==="textarea"}function Js(e,t,r,n){Gr(n),t=ml(t,"onChange"),0<t.length&&(r=new Xn("onChange","change",null,r,n),e.push({event:r,listeners:t}))}var Li=null,Fi=null;function Kd(e){xu(e,0)}function dl(e){var t=li(e);if(Tr(t))return e}function Gd(e,t){if(e==="change")return t}var eu=!1;if(G){var wa;if(G){var ka="oninput"in document;if(!ka){var tu=document.createElement("div");tu.setAttribute("oninput","return;"),ka=typeof tu.oninput=="function"}wa=ka}else wa=!1;eu=wa&&(!document.documentMode||9<document.documentMode)}function ru(){Li&&(Li.detachEvent("onpropertychange",nu),Fi=Li=null)}function nu(e){if(e.propertyName==="value"&&dl(Fi)){var t=[];Js(t,Fi,e,Pt(e)),Xr(Kd,t)}}function qd(e,t,r){e==="focusin"?(ru(),Li=t,Fi=r,Li.attachEvent("onpropertychange",nu)):e==="focusout"&&ru()}function Xd(e){if(e==="selectionchange"||e==="keyup"||e==="keydown")return dl(Fi)}function Zd(e,t){if(e==="click")return dl(t)}function Jd(e,t){if(e==="input"||e==="change")return dl(t)}function ep(e,t){return e===t&&(e!==0||1/e===1/t)||e!==e&&t!==t}var Sn=typeof Object.is=="function"?Object.is:ep;function Ri(e,t){if(Sn(e,t))return!0;if(typeof e!="object"||e===null||typeof t!="object"||t===null)return!1;var r=Object.keys(e),n=Object.keys(t);if(r.length!==n.length)return!1;for(n=0;n<r.length;n++){var i=r[n];if(!F.call(t,i)||!Sn(e[i],t[i]))return!1}return!0}function ou(e){for(;e&&e.firstChild;)e=e.firstChild;return e}function iu(e,t){var r=ou(e);e=0;for(var n;r;){if(r.nodeType===3){if(n=e+r.textContent.length,e<=t&&n>=t)return{node:r,offset:t-e};e=n}e:{for(;r;){if(r.nextSibling){r=r.nextSibling;break e}r=r.parentNode}r=void 0}r=ou(r)}}function lu(e,t){return e&&t?e===t?!0:e&&e.nodeType===3?!1:t&&t.nodeType===3?lu(e,t.parentNode):"contains"in e?e.contains(t):e.compareDocumentPosition?!!(e.compareDocumentPosition(t)&16):!1:!1}function au(){for(var e=window,t=st();t instanceof e.HTMLIFrameElement;){try{var r=typeof t.contentWindow.location.href=="string"}catch{r=!1}if(r)e=t.contentWindow;else break;t=st(e.document)}return t}function ba(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t&&(t==="input"&&(e.type==="text"||e.type==="search"||e.type==="tel"||e.type==="url"||e.type==="password")||t==="textarea"||e.contentEditable==="true")}function tp(e){var t=au(),r=e.focusedElem,n=e.selectionRange;if(t!==r&&r&&r.ownerDocument&&lu(r.ownerDocument.documentElement,r)){if(n!==null&&ba(r)){if(t=n.start,e=n.end,e===void 0&&(e=t),"selectionStart"in r)r.selectionStart=t,r.selectionEnd=Math.min(e,r.value.length);else if(e=(t=r.ownerDocument||document)&&t.defaultView||window,e.getSelection){e=e.getSelection();var i=r.textContent.length,s=Math.min(n.start,i);n=n.end===void 0?s:Math.min(n.end,i),!e.extend&&s>n&&(i=n,n=s,s=i),i=iu(r,s);var f=iu(r,n);i&&f&&(e.rangeCount!==1||e.anchorNode!==i.node||e.anchorOffset!==i.offset||e.focusNode!==f.node||e.focusOffset!==f.offset)&&(t=t.createRange(),t.setStart(i.node,i.offset),e.removeAllRanges(),s>n?(e.addRange(t),e.extend(f.node,f.offset)):(t.setEnd(f.node,f.offset),e.addRange(t)))}}for(t=[],e=r;e=e.parentNode;)e.nodeType===1&&t.push({element:e,left:e.scrollLeft,top:e.scrollTop});for(typeof r.focus=="function"&&r.focus(),r=0;r<t.length;r++)e=t[r],e.element.scrollLeft=e.left,e.element.scrollTop=e.top}}var rp=G&&"documentMode"in document&&11>=document.documentMode,ri=null,za=null,Ii=null,Sa=!1;function su(e,t,r){var n=r.window===r?r.document:r.nodeType===9?r:r.ownerDocument;Sa||ri==null||ri!==st(n)||(n=ri,"selectionStart"in n&&ba(n)?n={start:n.selectionStart,end:n.selectionEnd}:(n=(n.ownerDocument&&n.ownerDocument.defaultView||window).getSelection(),n={anchorNode:n.anchorNode,anchorOffset:n.anchorOffset,focusNode:n.focusNode,focusOffset:n.focusOffset}),Ii&&Ri(Ii,n)||(Ii=n,n=ml(za,"onSelect"),0<n.length&&(t=new Xn("onSelect","select",null,t,r),e.push({event:t,listeners:n}),t.target=ri)))}function pl(e,t){var r={};return r[e.toLowerCase()]=t.toLowerCase(),r["Webkit"+e]="webkit"+t,r["Moz"+e]="moz"+t,r}var ni={animationend:pl("Animation","AnimationEnd"),animationiteration:pl("Animation","AnimationIteration"),animationstart:pl("Animation","AnimationStart"),transitionend:pl("Transition","TransitionEnd")},ja={},uu={};G&&(uu=document.createElement("div").style,"AnimationEvent"in window||(delete ni.animationend.animation,delete ni.animationiteration.animation,delete ni.animationstart.animation),"TransitionEvent"in window||delete ni.transitionend.transition);function fl(e){if(ja[e])return ja[e];if(!ni[e])return e;var t=ni[e],r;for(r in t)if(t.hasOwnProperty(r)&&r in uu)return ja[e]=t[r];return e}var cu=fl("animationend"),du=fl("animationiteration"),pu=fl("animationstart"),fu=fl("transitionend"),hu=new Map,mu="abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");function fo(e,t){hu.set(e,t),L(t,[e])}for(var Ca=0;Ca<mu.length;Ca++){var Ea=mu[Ca],np=Ea.toLowerCase(),op=Ea[0].toUpperCase()+Ea.slice(1);fo(np,"on"+op)}fo(cu,"onAnimationEnd"),fo(du,"onAnimationIteration"),fo(pu,"onAnimationStart"),fo("dblclick","onDoubleClick"),fo("focusin","onFocus"),fo("focusout","onBlur"),fo(fu,"onTransitionEnd"),ae("onMouseEnter",["mouseout","mouseover"]),ae("onMouseLeave",["mouseout","mouseover"]),ae("onPointerEnter",["pointerout","pointerover"]),ae("onPointerLeave",["pointerout","pointerover"]),L("onChange","change click focusin focusout input keydown keyup selectionchange".split(" ")),L("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")),L("onBeforeInput",["compositionend","keypress","textInput","paste"]),L("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" ")),L("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" ")),L("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var Oi="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),ip=new Set("cancel close invalid load scroll toggle".split(" ").concat(Oi));function gu(e,t,r){var n=e.type||"unknown-event";e.currentTarget=r,In(n,t,void 0,e),e.currentTarget=null}function xu(e,t){t=(t&4)!==0;for(var r=0;r<e.length;r++){var n=e[r],i=n.event;n=n.listeners;e:{var s=void 0;if(t)for(var f=n.length-1;0<=f;f--){var w=n[f],b=w.instance,R=w.currentTarget;if(w=w.listener,b!==s&&i.isPropagationStopped())break e;gu(i,w,R),s=b}else for(f=0;f<n.length;f++){if(w=n[f],b=w.instance,R=w.currentTarget,w=w.listener,b!==s&&i.isPropagationStopped())break e;gu(i,w,R),s=b}}}if(Jr)throw e=Dr,Jr=!1,Dr=null,e}function vt(e,t){var r=t[Ra];r===void 0&&(r=t[Ra]=new Set);var n=e+"__bubble";r.has(n)||(vu(t,e,2,!1),r.add(n))}function Na(e,t,r){var n=0;t&&(n|=4),vu(r,e,n,t)}var hl="_reactListening"+Math.random().toString(36).slice(2);function Di(e){if(!e[hl]){e[hl]=!0,j.forEach(function(r){r!=="selectionchange"&&(ip.has(r)||Na(r,!1,e),Na(r,!0,e))});var t=e.nodeType===9?e:e.ownerDocument;t===null||t[hl]||(t[hl]=!0,Na("selectionchange",!1,t))}}function vu(e,t,r,n){switch(ji(t)){case 1:var i=so;break;case 4:i=Gn;break;default:i=Ko}r=i.bind(null,t,r,e),i=void 0,!gn||t!=="touchstart"&&t!=="touchmove"&&t!=="wheel"||(i=!0),n?i!==void 0?e.addEventListener(t,r,{capture:!0,passive:i}):e.addEventListener(t,r,!0):i!==void 0?e.addEventListener(t,r,{passive:i}):e.addEventListener(t,r,!1)}function Pa(e,t,r,n,i){var s=n;if((t&1)===0&&(t&2)===0&&n!==null)e:for(;;){if(n===null)return;var f=n.tag;if(f===3||f===4){var w=n.stateNode.containerInfo;if(w===i||w.nodeType===8&&w.parentNode===i)break;if(f===4)for(f=n.return;f!==null;){var b=f.tag;if((b===3||b===4)&&(b=f.stateNode.containerInfo,b===i||b.nodeType===8&&b.parentNode===i))return;f=f.return}for(;w!==null;){if(f=Fo(w),f===null)return;if(b=f.tag,b===5||b===6){n=s=f;continue e}w=w.parentNode}}n=n.return}Xr(function(){var R=s,K=Pt(r),J=[];e:{var Q=hu.get(e);if(Q!==void 0){var xe=Xn,be=e;switch(e){case"keypress":if(qn(r)===0)break e;case"keydown":case"keyup":xe=cl;break;case"focusin":be="focus",xe=Xo;break;case"focusout":be="blur",xe=Xo;break;case"beforeblur":case"afterblur":xe=Xo;break;case"click":if(r.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":xe=Ei;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":xe=Ni;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":xe=v;break;case cu:case du:case pu:xe=ya;break;case fu:xe=P;break;case"scroll":xe=Ci;break;case"wheel":xe=te;break;case"copy":case"cut":case"paste":xe=Zo;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":xe=c}var je=(t&4)!==0,Mt=!je&&e==="scroll",N=je?Q!==null?Q+"Capture":null:Q;je=[];for(var S=R,T;S!==null;){T=S;var oe=T.stateNode;if(T.tag===5&&oe!==null&&(T=oe,N!==null&&(oe=Ft(S,N),oe!=null&&je.push(Bi(S,oe,T)))),Mt)break;S=S.return}0<je.length&&(Q=new xe(Q,be,null,r,K),J.push({event:Q,listeners:je}))}}if((t&7)===0){e:{if(Q=e==="mouseover"||e==="pointerover",xe=e==="mouseout"||e==="pointerout",Q&&r!==mn&&(be=r.relatedTarget||r.fromElement)&&(Fo(be)||be[Jn]))break e;if((xe||Q)&&(Q=K.window===K?K:(Q=K.ownerDocument)?Q.defaultView||Q.parentWindow:window,xe?(be=r.relatedTarget||r.toElement,xe=R,be=be?Fo(be):null,be!==null&&(Mt=ar(be),be!==Mt||be.tag!==5&&be.tag!==6)&&(be=null)):(xe=null,be=R),xe!==be)){if(je=Ei,oe="onMouseLeave",N="onMouseEnter",S="mouse",(e==="pointerout"||e==="pointerover")&&(je=c,oe="onPointerLeave",N="onPointerEnter",S="pointer"),Mt=xe==null?Q:li(xe),T=be==null?Q:li(be),Q=new je(oe,S+"leave",xe,r,K),Q.target=Mt,Q.relatedTarget=T,oe=null,Fo(K)===R&&(je=new je(N,S+"enter",be,r,K),je.target=T,je.relatedTarget=Mt,oe=je),Mt=oe,xe&&be)t:{for(je=xe,N=be,S=0,T=je;T;T=oi(T))S++;for(T=0,oe=N;oe;oe=oi(oe))T++;for(;0<S-T;)je=oi(je),S--;for(;0<T-S;)N=oi(N),T--;for(;S--;){if(je===N||N!==null&&je===N.alternate)break t;je=oi(je),N=oi(N)}je=null}else je=null;xe!==null&&yu(J,Q,xe,je,!1),be!==null&&Mt!==null&&yu(J,Mt,be,je,!0)}}e:{if(Q=R?li(R):window,xe=Q.nodeName&&Q.nodeName.toLowerCase(),xe==="select"||xe==="input"&&Q.type==="file")var Ne=Gd;else if(Zs(Q))if(eu)Ne=Jd;else{Ne=Xd;var Re=qd}else(xe=Q.nodeName)&&xe.toLowerCase()==="input"&&(Q.type==="checkbox"||Q.type==="radio")&&(Ne=Zd);if(Ne&&(Ne=Ne(e,R))){Js(J,Ne,r,K);break e}Re&&Re(e,Q,R),e==="focusout"&&(Re=Q._wrapperState)&&Re.controlled&&Q.type==="number"&&nr(Q,"number",Q.value)}switch(Re=R?li(R):window,e){case"focusin":(Zs(Re)||Re.contentEditable==="true")&&(ri=Re,za=R,Ii=null);break;case"focusout":Ii=za=ri=null;break;case"mousedown":Sa=!0;break;case"contextmenu":case"mouseup":case"dragend":Sa=!1,su(J,r,K);break;case"selectionchange":if(rp)break;case"keydown":case"keyup":su(J,r,K)}var Ie;if(Ye)e:{switch(e){case"compositionstart":var Ue="onCompositionStart";break e;case"compositionend":Ue="onCompositionEnd";break e;case"compositionupdate":Ue="onCompositionUpdate";break e}Ue=void 0}else Bn?Lo(e,r)&&(Ue="onCompositionEnd"):e==="keydown"&&r.keyCode===229&&(Ue="onCompositionStart");Ue&&(ur&&r.locale!=="ko"&&(Bn||Ue!=="onCompositionStart"?Ue==="onCompositionEnd"&&Bn&&(Ie=ol()):(zn=K,Go="value"in zn?zn.value:zn.textContent,Bn=!0)),Re=ml(R,Ue),0<Re.length&&(Ue=new _i(Ue,e,null,r,K),J.push({event:Ue,listeners:Re}),Ie?Ue.data=Ie:(Ie=Mi(r),Ie!==null&&(Ue.data=Ie)))),(Ie=pt?Vd(e,r):Qd(e,r))&&(R=ml(R,"onBeforeInput"),0<R.length&&(K=new _i("onBeforeInput","beforeinput",null,r,K),J.push({event:K,listeners:R}),K.data=Ie))}xu(J,t)})}function Bi(e,t,r){return{instance:e,listener:t,currentTarget:r}}function ml(e,t){for(var r=t+"Capture",n=[];e!==null;){var i=e,s=i.stateNode;i.tag===5&&s!==null&&(i=s,s=Ft(e,r),s!=null&&n.unshift(Bi(e,s,i)),s=Ft(e,t),s!=null&&n.push(Bi(e,s,i))),e=e.return}return n}function oi(e){if(e===null)return null;do e=e.return;while(e&&e.tag!==5);return e||null}function yu(e,t,r,n,i){for(var s=t._reactName,f=[];r!==null&&r!==n;){var w=r,b=w.alternate,R=w.stateNode;if(b!==null&&b===n)break;w.tag===5&&R!==null&&(w=R,i?(b=Ft(r,s),b!=null&&f.unshift(Bi(r,b,w))):i||(b=Ft(r,s),b!=null&&f.push(Bi(r,b,w)))),r=r.return}f.length!==0&&e.push({event:t,listeners:f})}var lp=/\r\n?/g,ap=/\u0000|\uFFFD/g;function wu(e){return(typeof e=="string"?e:""+e).replace(lp,`
`).replace(ap,"")}function gl(e,t,r){if(t=wu(t),wu(e)!==t&&r)throw Error(p(425))}function xl(){}var _a=null,Ta=null;function Ma(e,t){return e==="textarea"||e==="noscript"||typeof t.children=="string"||typeof t.children=="number"||typeof t.dangerouslySetInnerHTML=="object"&&t.dangerouslySetInnerHTML!==null&&t.dangerouslySetInnerHTML.__html!=null}var La=typeof setTimeout=="function"?setTimeout:void 0,sp=typeof clearTimeout=="function"?clearTimeout:void 0,ku=typeof Promise=="function"?Promise:void 0,up=typeof queueMicrotask=="function"?queueMicrotask:typeof ku<"u"?function(e){return ku.resolve(null).then(e).catch(cp)}:La;function cp(e){setTimeout(function(){throw e})}function Fa(e,t){var r=t,n=0;do{var i=r.nextSibling;if(e.removeChild(r),i&&i.nodeType===8)if(r=i.data,r==="/$"){if(n===0){e.removeChild(i),xt(t);return}n--}else r!=="$"&&r!=="$?"&&r!=="$!"||n++;r=i}while(r);xt(t)}function ho(e){for(;e!=null;e=e.nextSibling){var t=e.nodeType;if(t===1||t===3)break;if(t===8){if(t=e.data,t==="$"||t==="$!"||t==="$?")break;if(t==="/$")return null}}return e}function bu(e){e=e.previousSibling;for(var t=0;e;){if(e.nodeType===8){var r=e.data;if(r==="$"||r==="$!"||r==="$?"){if(t===0)return e;t--}else r==="/$"&&t++}e=e.previousSibling}return null}var ii=Math.random().toString(36).slice(2),$n="__reactFiber$"+ii,$i="__reactProps$"+ii,Jn="__reactContainer$"+ii,Ra="__reactEvents$"+ii,dp="__reactListeners$"+ii,pp="__reactHandles$"+ii;function Fo(e){var t=e[$n];if(t)return t;for(var r=e.parentNode;r;){if(t=r[Jn]||r[$n]){if(r=t.alternate,t.child!==null||r!==null&&r.child!==null)for(e=bu(e);e!==null;){if(r=e[$n])return r;e=bu(e)}return t}e=r,r=e.parentNode}return null}function Ai(e){return e=e[$n]||e[Jn],!e||e.tag!==5&&e.tag!==6&&e.tag!==13&&e.tag!==3?null:e}function li(e){if(e.tag===5||e.tag===6)return e.stateNode;throw Error(p(33))}function vl(e){return e[$i]||null}var Ia=[],ai=-1;function mo(e){return{current:e}}function yt(e){0>ai||(e.current=Ia[ai],Ia[ai]=null,ai--)}function mt(e,t){ai++,Ia[ai]=e.current,e.current=t}var go={},cr=mo(go),jr=mo(!1),Ro=go;function si(e,t){var r=e.type.contextTypes;if(!r)return go;var n=e.stateNode;if(n&&n.__reactInternalMemoizedUnmaskedChildContext===t)return n.__reactInternalMemoizedMaskedChildContext;var i={},s;for(s in r)i[s]=t[s];return n&&(e=e.stateNode,e.__reactInternalMemoizedUnmaskedChildContext=t,e.__reactInternalMemoizedMaskedChildContext=i),i}function Cr(e){return e=e.childContextTypes,e!=null}function yl(){yt(jr),yt(cr)}function zu(e,t,r){if(cr.current!==go)throw Error(p(168));mt(cr,t),mt(jr,r)}function Su(e,t,r){var n=e.stateNode;if(t=t.childContextTypes,typeof n.getChildContext!="function")return r;n=n.getChildContext();for(var i in n)if(!(i in t))throw Error(p(108,et(e)||"Unknown",i));return ce({},r,n)}function wl(e){return e=(e=e.stateNode)&&e.__reactInternalMemoizedMergedChildContext||go,Ro=cr.current,mt(cr,e),mt(jr,jr.current),!0}function ju(e,t,r){var n=e.stateNode;if(!n)throw Error(p(169));r?(e=Su(e,t,Ro),n.__reactInternalMemoizedMergedChildContext=e,yt(jr),yt(cr),mt(cr,e)):yt(jr),mt(jr,r)}var eo=null,kl=!1,Oa=!1;function Cu(e){eo===null?eo=[e]:eo.push(e)}function fp(e){kl=!0,Cu(e)}function xo(){if(!Oa&&eo!==null){Oa=!0;var e=0,t=se;try{var r=eo;for(se=1;e<r.length;e++){var n=r[e];do n=n(!0);while(n!==null)}eo=null,kl=!1}catch(i){throw eo!==null&&(eo=eo.slice(e+1)),Wt(wn,xo),i}finally{se=t,Oa=!1}}return null}var ui=[],ci=0,bl=null,zl=0,an=[],sn=0,Io=null,to=1,ro="";function Oo(e,t){ui[ci++]=zl,ui[ci++]=bl,bl=e,zl=t}function Eu(e,t,r){an[sn++]=to,an[sn++]=ro,an[sn++]=Io,Io=e;var n=to;e=ro;var i=32-Ct(n)-1;n&=~(1<<i),r+=1;var s=32-Ct(t)+i;if(30<s){var f=i-i%5;s=(n&(1<<f)-1).toString(32),n>>=f,i-=f,to=1<<32-Ct(t)+i|r<<i|n,ro=s+e}else to=1<<s|r<<i|n,ro=e}function Da(e){e.return!==null&&(Oo(e,1),Eu(e,1,0))}function Ba(e){for(;e===bl;)bl=ui[--ci],ui[ci]=null,zl=ui[--ci],ui[ci]=null;for(;e===Io;)Io=an[--sn],an[sn]=null,ro=an[--sn],an[sn]=null,to=an[--sn],an[sn]=null}var Ur=null,Hr=null,kt=!1,jn=null;function Nu(e,t){var r=pn(5,null,null,0);r.elementType="DELETED",r.stateNode=t,r.return=e,t=e.deletions,t===null?(e.deletions=[r],e.flags|=16):t.push(r)}function Pu(e,t){switch(e.tag){case 5:var r=e.type;return t=t.nodeType!==1||r.toLowerCase()!==t.nodeName.toLowerCase()?null:t,t!==null?(e.stateNode=t,Ur=e,Hr=ho(t.firstChild),!0):!1;case 6:return t=e.pendingProps===""||t.nodeType!==3?null:t,t!==null?(e.stateNode=t,Ur=e,Hr=null,!0):!1;case 13:return t=t.nodeType!==8?null:t,t!==null?(r=Io!==null?{id:to,overflow:ro}:null,e.memoizedState={dehydrated:t,treeContext:r,retryLane:1073741824},r=pn(18,null,null,0),r.stateNode=t,r.return=e,e.child=r,Ur=e,Hr=null,!0):!1;default:return!1}}function $a(e){return(e.mode&1)!==0&&(e.flags&128)===0}function Aa(e){if(kt){var t=Hr;if(t){var r=t;if(!Pu(e,t)){if($a(e))throw Error(p(418));t=ho(r.nextSibling);var n=Ur;t&&Pu(e,t)?Nu(n,r):(e.flags=e.flags&-4097|2,kt=!1,Ur=e)}}else{if($a(e))throw Error(p(418));e.flags=e.flags&-4097|2,kt=!1,Ur=e}}}function _u(e){for(e=e.return;e!==null&&e.tag!==5&&e.tag!==3&&e.tag!==13;)e=e.return;Ur=e}function Sl(e){if(e!==Ur)return!1;if(!kt)return _u(e),kt=!0,!1;var t;if((t=e.tag!==3)&&!(t=e.tag!==5)&&(t=e.type,t=t!=="head"&&t!=="body"&&!Ma(e.type,e.memoizedProps)),t&&(t=Hr)){if($a(e))throw Tu(),Error(p(418));for(;t;)Nu(e,t),t=ho(t.nextSibling)}if(_u(e),e.tag===13){if(e=e.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(p(317));e:{for(e=e.nextSibling,t=0;e;){if(e.nodeType===8){var r=e.data;if(r==="/$"){if(t===0){Hr=ho(e.nextSibling);break e}t--}else r!=="$"&&r!=="$!"&&r!=="$?"||t++}e=e.nextSibling}Hr=null}}else Hr=Ur?ho(e.stateNode.nextSibling):null;return!0}function Tu(){for(var e=Hr;e;)e=ho(e.nextSibling)}function di(){Hr=Ur=null,kt=!1}function Ua(e){jn===null?jn=[e]:jn.push(e)}var hp=Te.ReactCurrentBatchConfig;function Ui(e,t,r){if(e=r.ref,e!==null&&typeof e!="function"&&typeof e!="object"){if(r._owner){if(r=r._owner,r){if(r.tag!==1)throw Error(p(309));var n=r.stateNode}if(!n)throw Error(p(147,e));var i=n,s=""+e;return t!==null&&t.ref!==null&&typeof t.ref=="function"&&t.ref._stringRef===s?t.ref:(t=function(f){var w=i.refs;f===null?delete w[s]:w[s]=f},t._stringRef=s,t)}if(typeof e!="string")throw Error(p(284));if(!r._owner)throw Error(p(290,e))}return e}function jl(e,t){throw e=Object.prototype.toString.call(t),Error(p(31,e==="[object Object]"?"object with keys {"+Object.keys(t).join(", ")+"}":e))}function Mu(e){var t=e._init;return t(e._payload)}function Lu(e){function t(N,S){if(e){var T=N.deletions;T===null?(N.deletions=[S],N.flags|=16):T.push(S)}}function r(N,S){if(!e)return null;for(;S!==null;)t(N,S),S=S.sibling;return null}function n(N,S){for(N=new Map;S!==null;)S.key!==null?N.set(S.key,S):N.set(S.index,S),S=S.sibling;return N}function i(N,S){return N=jo(N,S),N.index=0,N.sibling=null,N}function s(N,S,T){return N.index=T,e?(T=N.alternate,T!==null?(T=T.index,T<S?(N.flags|=2,S):T):(N.flags|=2,S)):(N.flags|=1048576,S)}function f(N){return e&&N.alternate===null&&(N.flags|=2),N}function w(N,S,T,oe){return S===null||S.tag!==6?(S=Ls(T,N.mode,oe),S.return=N,S):(S=i(S,T),S.return=N,S)}function b(N,S,T,oe){var Ne=T.type;return Ne===ve?K(N,S,T.props.children,oe,T.key):S!==null&&(S.elementType===Ne||typeof Ne=="object"&&Ne!==null&&Ne.$$typeof===Le&&Mu(Ne)===S.type)?(oe=i(S,T.props),oe.ref=Ui(N,S,T),oe.return=N,oe):(oe=Gl(T.type,T.key,T.props,null,N.mode,oe),oe.ref=Ui(N,S,T),oe.return=N,oe)}function R(N,S,T,oe){return S===null||S.tag!==4||S.stateNode.containerInfo!==T.containerInfo||S.stateNode.implementation!==T.implementation?(S=Fs(T,N.mode,oe),S.return=N,S):(S=i(S,T.children||[]),S.return=N,S)}function K(N,S,T,oe,Ne){return S===null||S.tag!==7?(S=Vo(T,N.mode,oe,Ne),S.return=N,S):(S=i(S,T),S.return=N,S)}function J(N,S,T){if(typeof S=="string"&&S!==""||typeof S=="number")return S=Ls(""+S,N.mode,T),S.return=N,S;if(typeof S=="object"&&S!==null){switch(S.$$typeof){case Ee:return T=Gl(S.type,S.key,S.props,null,N.mode,T),T.ref=Ui(N,null,S),T.return=N,T;case ke:return S=Fs(S,N.mode,T),S.return=N,S;case Le:var oe=S._init;return J(N,oe(S._payload),T)}if(Nt(S)||pe(S))return S=Vo(S,N.mode,T,null),S.return=N,S;jl(N,S)}return null}function Q(N,S,T,oe){var Ne=S!==null?S.key:null;if(typeof T=="string"&&T!==""||typeof T=="number")return Ne!==null?null:w(N,S,""+T,oe);if(typeof T=="object"&&T!==null){switch(T.$$typeof){case Ee:return T.key===Ne?b(N,S,T,oe):null;case ke:return T.key===Ne?R(N,S,T,oe):null;case Le:return Ne=T._init,Q(N,S,Ne(T._payload),oe)}if(Nt(T)||pe(T))return Ne!==null?null:K(N,S,T,oe,null);jl(N,T)}return null}function xe(N,S,T,oe,Ne){if(typeof oe=="string"&&oe!==""||typeof oe=="number")return N=N.get(T)||null,w(S,N,""+oe,Ne);if(typeof oe=="object"&&oe!==null){switch(oe.$$typeof){case Ee:return N=N.get(oe.key===null?T:oe.key)||null,b(S,N,oe,Ne);case ke:return N=N.get(oe.key===null?T:oe.key)||null,R(S,N,oe,Ne);case Le:var Re=oe._init;return xe(N,S,T,Re(oe._payload),Ne)}if(Nt(oe)||pe(oe))return N=N.get(T)||null,K(S,N,oe,Ne,null);jl(S,oe)}return null}function be(N,S,T,oe){for(var Ne=null,Re=null,Ie=S,Ue=S=0,Yt=null;Ie!==null&&Ue<T.length;Ue++){Ie.index>Ue?(Yt=Ie,Ie=null):Yt=Ie.sibling;var it=Q(N,Ie,T[Ue],oe);if(it===null){Ie===null&&(Ie=Yt);break}e&&Ie&&it.alternate===null&&t(N,Ie),S=s(it,S,Ue),Re===null?Ne=it:Re.sibling=it,Re=it,Ie=Yt}if(Ue===T.length)return r(N,Ie),kt&&Oo(N,Ue),Ne;if(Ie===null){for(;Ue<T.length;Ue++)Ie=J(N,T[Ue],oe),Ie!==null&&(S=s(Ie,S,Ue),Re===null?Ne=Ie:Re.sibling=Ie,Re=Ie);return kt&&Oo(N,Ue),Ne}for(Ie=n(N,Ie);Ue<T.length;Ue++)Yt=xe(Ie,N,Ue,T[Ue],oe),Yt!==null&&(e&&Yt.alternate!==null&&Ie.delete(Yt.key===null?Ue:Yt.key),S=s(Yt,S,Ue),Re===null?Ne=Yt:Re.sibling=Yt,Re=Yt);return e&&Ie.forEach(function(Co){return t(N,Co)}),kt&&Oo(N,Ue),Ne}function je(N,S,T,oe){var Ne=pe(T);if(typeof Ne!="function")throw Error(p(150));if(T=Ne.call(T),T==null)throw Error(p(151));for(var Re=Ne=null,Ie=S,Ue=S=0,Yt=null,it=T.next();Ie!==null&&!it.done;Ue++,it=T.next()){Ie.index>Ue?(Yt=Ie,Ie=null):Yt=Ie.sibling;var Co=Q(N,Ie,it.value,oe);if(Co===null){Ie===null&&(Ie=Yt);break}e&&Ie&&Co.alternate===null&&t(N,Ie),S=s(Co,S,Ue),Re===null?Ne=Co:Re.sibling=Co,Re=Co,Ie=Yt}if(it.done)return r(N,Ie),kt&&Oo(N,Ue),Ne;if(Ie===null){for(;!it.done;Ue++,it=T.next())it=J(N,it.value,oe),it!==null&&(S=s(it,S,Ue),Re===null?Ne=it:Re.sibling=it,Re=it);return kt&&Oo(N,Ue),Ne}for(Ie=n(N,Ie);!it.done;Ue++,it=T.next())it=xe(Ie,N,Ue,it.value,oe),it!==null&&(e&&it.alternate!==null&&Ie.delete(it.key===null?Ue:it.key),S=s(it,S,Ue),Re===null?Ne=it:Re.sibling=it,Re=it);return e&&Ie.forEach(function(Yp){return t(N,Yp)}),kt&&Oo(N,Ue),Ne}function Mt(N,S,T,oe){if(typeof T=="object"&&T!==null&&T.type===ve&&T.key===null&&(T=T.props.children),typeof T=="object"&&T!==null){switch(T.$$typeof){case Ee:e:{for(var Ne=T.key,Re=S;Re!==null;){if(Re.key===Ne){if(Ne=T.type,Ne===ve){if(Re.tag===7){r(N,Re.sibling),S=i(Re,T.props.children),S.return=N,N=S;break e}}else if(Re.elementType===Ne||typeof Ne=="object"&&Ne!==null&&Ne.$$typeof===Le&&Mu(Ne)===Re.type){r(N,Re.sibling),S=i(Re,T.props),S.ref=Ui(N,Re,T),S.return=N,N=S;break e}r(N,Re);break}else t(N,Re);Re=Re.sibling}T.type===ve?(S=Vo(T.props.children,N.mode,oe,T.key),S.return=N,N=S):(oe=Gl(T.type,T.key,T.props,null,N.mode,oe),oe.ref=Ui(N,S,T),oe.return=N,N=oe)}return f(N);case ke:e:{for(Re=T.key;S!==null;){if(S.key===Re)if(S.tag===4&&S.stateNode.containerInfo===T.containerInfo&&S.stateNode.implementation===T.implementation){r(N,S.sibling),S=i(S,T.children||[]),S.return=N,N=S;break e}else{r(N,S);break}else t(N,S);S=S.sibling}S=Fs(T,N.mode,oe),S.return=N,N=S}return f(N);case Le:return Re=T._init,Mt(N,S,Re(T._payload),oe)}if(Nt(T))return be(N,S,T,oe);if(pe(T))return je(N,S,T,oe);jl(N,T)}return typeof T=="string"&&T!==""||typeof T=="number"?(T=""+T,S!==null&&S.tag===6?(r(N,S.sibling),S=i(S,T),S.return=N,N=S):(r(N,S),S=Ls(T,N.mode,oe),S.return=N,N=S),f(N)):r(N,S)}return Mt}var pi=Lu(!0),Fu=Lu(!1),Cl=mo(null),El=null,fi=null,Ha=null;function Wa(){Ha=fi=El=null}function Va(e){var t=Cl.current;yt(Cl),e._currentValue=t}function Qa(e,t,r){for(;e!==null;){var n=e.alternate;if((e.childLanes&t)!==t?(e.childLanes|=t,n!==null&&(n.childLanes|=t)):n!==null&&(n.childLanes&t)!==t&&(n.childLanes|=t),e===r)break;e=e.return}}function hi(e,t){El=e,Ha=fi=null,e=e.dependencies,e!==null&&e.firstContext!==null&&((e.lanes&t)!==0&&(Er=!0),e.firstContext=null)}function un(e){var t=e._currentValue;if(Ha!==e)if(e={context:e,memoizedValue:t,next:null},fi===null){if(El===null)throw Error(p(308));fi=e,El.dependencies={lanes:0,firstContext:e}}else fi=fi.next=e;return t}var Do=null;function Ya(e){Do===null?Do=[e]:Do.push(e)}function Ru(e,t,r,n){var i=t.interleaved;return i===null?(r.next=r,Ya(t)):(r.next=i.next,i.next=r),t.interleaved=r,no(e,n)}function no(e,t){e.lanes|=t;var r=e.alternate;for(r!==null&&(r.lanes|=t),r=e,e=e.return;e!==null;)e.childLanes|=t,r=e.alternate,r!==null&&(r.childLanes|=t),r=e,e=e.return;return r.tag===3?r.stateNode:null}var vo=!1;function Ka(e){e.updateQueue={baseState:e.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null}}function Iu(e,t){e=e.updateQueue,t.updateQueue===e&&(t.updateQueue={baseState:e.baseState,firstBaseUpdate:e.firstBaseUpdate,lastBaseUpdate:e.lastBaseUpdate,shared:e.shared,effects:e.effects})}function oo(e,t){return{eventTime:e,lane:t,tag:0,payload:null,callback:null,next:null}}function yo(e,t,r){var n=e.updateQueue;if(n===null)return null;if(n=n.shared,(nt&2)!==0){var i=n.pending;return i===null?t.next=t:(t.next=i.next,i.next=t),n.pending=t,no(e,r)}return i=n.interleaved,i===null?(t.next=t,Ya(n)):(t.next=i.next,i.next=t),n.interleaved=t,no(e,r)}function Nl(e,t,r){if(t=t.updateQueue,t!==null&&(t=t.shared,(r&4194240)!==0)){var n=t.lanes;n&=e.pendingLanes,r|=n,t.lanes=r,re(e,r)}}function Ou(e,t){var r=e.updateQueue,n=e.alternate;if(n!==null&&(n=n.updateQueue,r===n)){var i=null,s=null;if(r=r.firstBaseUpdate,r!==null){do{var f={eventTime:r.eventTime,lane:r.lane,tag:r.tag,payload:r.payload,callback:r.callback,next:null};s===null?i=s=f:s=s.next=f,r=r.next}while(r!==null);s===null?i=s=t:s=s.next=t}else i=s=t;r={baseState:n.baseState,firstBaseUpdate:i,lastBaseUpdate:s,shared:n.shared,effects:n.effects},e.updateQueue=r;return}e=r.lastBaseUpdate,e===null?r.firstBaseUpdate=t:e.next=t,r.lastBaseUpdate=t}function Pl(e,t,r,n){var i=e.updateQueue;vo=!1;var s=i.firstBaseUpdate,f=i.lastBaseUpdate,w=i.shared.pending;if(w!==null){i.shared.pending=null;var b=w,R=b.next;b.next=null,f===null?s=R:f.next=R,f=b;var K=e.alternate;K!==null&&(K=K.updateQueue,w=K.lastBaseUpdate,w!==f&&(w===null?K.firstBaseUpdate=R:w.next=R,K.lastBaseUpdate=b))}if(s!==null){var J=i.baseState;f=0,K=R=b=null,w=s;do{var Q=w.lane,xe=w.eventTime;if((n&Q)===Q){K!==null&&(K=K.next={eventTime:xe,lane:0,tag:w.tag,payload:w.payload,callback:w.callback,next:null});e:{var be=e,je=w;switch(Q=t,xe=r,je.tag){case 1:if(be=je.payload,typeof be=="function"){J=be.call(xe,J,Q);break e}J=be;break e;case 3:be.flags=be.flags&-65537|128;case 0:if(be=je.payload,Q=typeof be=="function"?be.call(xe,J,Q):be,Q==null)break e;J=ce({},J,Q);break e;case 2:vo=!0}}w.callback!==null&&w.lane!==0&&(e.flags|=64,Q=i.effects,Q===null?i.effects=[w]:Q.push(w))}else xe={eventTime:xe,lane:Q,tag:w.tag,payload:w.payload,callback:w.callback,next:null},K===null?(R=K=xe,b=J):K=K.next=xe,f|=Q;if(w=w.next,w===null){if(w=i.shared.pending,w===null)break;Q=w,w=Q.next,Q.next=null,i.lastBaseUpdate=Q,i.shared.pending=null}}while(!0);if(K===null&&(b=J),i.baseState=b,i.firstBaseUpdate=R,i.lastBaseUpdate=K,t=i.shared.interleaved,t!==null){i=t;do f|=i.lane,i=i.next;while(i!==t)}else s===null&&(i.shared.lanes=0);Ao|=f,e.lanes=f,e.memoizedState=J}}function Du(e,t,r){if(e=t.effects,t.effects=null,e!==null)for(t=0;t<e.length;t++){var n=e[t],i=n.callback;if(i!==null){if(n.callback=null,n=r,typeof i!="function")throw Error(p(191,i));i.call(n)}}}var Hi={},An=mo(Hi),Wi=mo(Hi),Vi=mo(Hi);function Bo(e){if(e===Hi)throw Error(p(174));return e}function Ga(e,t){switch(mt(Vi,t),mt(Wi,e),mt(An,Hi),e=t.nodeType,e){case 9:case 11:t=(t=t.documentElement)?t.namespaceURI:$t(null,"");break;default:e=e===8?t.parentNode:t,t=e.namespaceURI||null,e=e.tagName,t=$t(t,e)}yt(An),mt(An,t)}function mi(){yt(An),yt(Wi),yt(Vi)}function Bu(e){Bo(Vi.current);var t=Bo(An.current),r=$t(t,e.type);t!==r&&(mt(Wi,e),mt(An,r))}function qa(e){Wi.current===e&&(yt(An),yt(Wi))}var zt=mo(0);function _l(e){for(var t=e;t!==null;){if(t.tag===13){var r=t.memoizedState;if(r!==null&&(r=r.dehydrated,r===null||r.data==="$?"||r.data==="$!"))return t}else if(t.tag===19&&t.memoizedProps.revealOrder!==void 0){if((t.flags&128)!==0)return t}else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return null;t=t.return}t.sibling.return=t.return,t=t.sibling}return null}var Xa=[];function Za(){for(var e=0;e<Xa.length;e++)Xa[e]._workInProgressVersionPrimary=null;Xa.length=0}var Tl=Te.ReactCurrentDispatcher,Ja=Te.ReactCurrentBatchConfig,$o=0,St=null,Dt=null,Vt=null,Ml=!1,Qi=!1,Yi=0,mp=0;function dr(){throw Error(p(321))}function es(e,t){if(t===null)return!1;for(var r=0;r<t.length&&r<e.length;r++)if(!Sn(e[r],t[r]))return!1;return!0}function ts(e,t,r,n,i,s){if($o=s,St=t,t.memoizedState=null,t.updateQueue=null,t.lanes=0,Tl.current=e===null||e.memoizedState===null?yp:wp,e=r(n,i),Qi){s=0;do{if(Qi=!1,Yi=0,25<=s)throw Error(p(301));s+=1,Vt=Dt=null,t.updateQueue=null,Tl.current=kp,e=r(n,i)}while(Qi)}if(Tl.current=Rl,t=Dt!==null&&Dt.next!==null,$o=0,Vt=Dt=St=null,Ml=!1,t)throw Error(p(300));return e}function rs(){var e=Yi!==0;return Yi=0,e}function Un(){var e={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return Vt===null?St.memoizedState=Vt=e:Vt=Vt.next=e,Vt}function cn(){if(Dt===null){var e=St.alternate;e=e!==null?e.memoizedState:null}else e=Dt.next;var t=Vt===null?St.memoizedState:Vt.next;if(t!==null)Vt=t,Dt=e;else{if(e===null)throw Error(p(310));Dt=e,e={memoizedState:Dt.memoizedState,baseState:Dt.baseState,baseQueue:Dt.baseQueue,queue:Dt.queue,next:null},Vt===null?St.memoizedState=Vt=e:Vt=Vt.next=e}return Vt}function Ki(e,t){return typeof t=="function"?t(e):t}function ns(e){var t=cn(),r=t.queue;if(r===null)throw Error(p(311));r.lastRenderedReducer=e;var n=Dt,i=n.baseQueue,s=r.pending;if(s!==null){if(i!==null){var f=i.next;i.next=s.next,s.next=f}n.baseQueue=i=s,r.pending=null}if(i!==null){s=i.next,n=n.baseState;var w=f=null,b=null,R=s;do{var K=R.lane;if(($o&K)===K)b!==null&&(b=b.next={lane:0,action:R.action,hasEagerState:R.hasEagerState,eagerState:R.eagerState,next:null}),n=R.hasEagerState?R.eagerState:e(n,R.action);else{var J={lane:K,action:R.action,hasEagerState:R.hasEagerState,eagerState:R.eagerState,next:null};b===null?(w=b=J,f=n):b=b.next=J,St.lanes|=K,Ao|=K}R=R.next}while(R!==null&&R!==s);b===null?f=n:b.next=w,Sn(n,t.memoizedState)||(Er=!0),t.memoizedState=n,t.baseState=f,t.baseQueue=b,r.lastRenderedState=n}if(e=r.interleaved,e!==null){i=e;do s=i.lane,St.lanes|=s,Ao|=s,i=i.next;while(i!==e)}else i===null&&(r.lanes=0);return[t.memoizedState,r.dispatch]}function os(e){var t=cn(),r=t.queue;if(r===null)throw Error(p(311));r.lastRenderedReducer=e;var n=r.dispatch,i=r.pending,s=t.memoizedState;if(i!==null){r.pending=null;var f=i=i.next;do s=e(s,f.action),f=f.next;while(f!==i);Sn(s,t.memoizedState)||(Er=!0),t.memoizedState=s,t.baseQueue===null&&(t.baseState=s),r.lastRenderedState=s}return[s,n]}function $u(){}function Au(e,t){var r=St,n=cn(),i=t(),s=!Sn(n.memoizedState,i);if(s&&(n.memoizedState=i,Er=!0),n=n.queue,is(Wu.bind(null,r,n,e),[e]),n.getSnapshot!==t||s||Vt!==null&&Vt.memoizedState.tag&1){if(r.flags|=2048,Gi(9,Hu.bind(null,r,n,i,t),void 0,null),Qt===null)throw Error(p(349));($o&30)!==0||Uu(r,t,i)}return i}function Uu(e,t,r){e.flags|=16384,e={getSnapshot:t,value:r},t=St.updateQueue,t===null?(t={lastEffect:null,stores:null},St.updateQueue=t,t.stores=[e]):(r=t.stores,r===null?t.stores=[e]:r.push(e))}function Hu(e,t,r,n){t.value=r,t.getSnapshot=n,Vu(t)&&Qu(e)}function Wu(e,t,r){return r(function(){Vu(t)&&Qu(e)})}function Vu(e){var t=e.getSnapshot;e=e.value;try{var r=t();return!Sn(e,r)}catch{return!0}}function Qu(e){var t=no(e,1);t!==null&&Pn(t,e,1,-1)}function Yu(e){var t=Un();return typeof e=="function"&&(e=e()),t.memoizedState=t.baseState=e,e={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:Ki,lastRenderedState:e},t.queue=e,e=e.dispatch=vp.bind(null,St,e),[t.memoizedState,e]}function Gi(e,t,r,n){return e={tag:e,create:t,destroy:r,deps:n,next:null},t=St.updateQueue,t===null?(t={lastEffect:null,stores:null},St.updateQueue=t,t.lastEffect=e.next=e):(r=t.lastEffect,r===null?t.lastEffect=e.next=e:(n=r.next,r.next=e,e.next=n,t.lastEffect=e)),e}function Ku(){return cn().memoizedState}function Ll(e,t,r,n){var i=Un();St.flags|=e,i.memoizedState=Gi(1|t,r,void 0,n===void 0?null:n)}function Fl(e,t,r,n){var i=cn();n=n===void 0?null:n;var s=void 0;if(Dt!==null){var f=Dt.memoizedState;if(s=f.destroy,n!==null&&es(n,f.deps)){i.memoizedState=Gi(t,r,s,n);return}}St.flags|=e,i.memoizedState=Gi(1|t,r,s,n)}function Gu(e,t){return Ll(8390656,8,e,t)}function is(e,t){return Fl(2048,8,e,t)}function qu(e,t){return Fl(4,2,e,t)}function Xu(e,t){return Fl(4,4,e,t)}function Zu(e,t){if(typeof t=="function")return e=e(),t(e),function(){t(null)};if(t!=null)return e=e(),t.current=e,function(){t.current=null}}function Ju(e,t,r){return r=r!=null?r.concat([e]):null,Fl(4,4,Zu.bind(null,t,e),r)}function ls(){}function ec(e,t){var r=cn();t=t===void 0?null:t;var n=r.memoizedState;return n!==null&&t!==null&&es(t,n[1])?n[0]:(r.memoizedState=[e,t],e)}function tc(e,t){var r=cn();t=t===void 0?null:t;var n=r.memoizedState;return n!==null&&t!==null&&es(t,n[1])?n[0]:(e=e(),r.memoizedState=[e,t],e)}function rc(e,t,r){return($o&21)===0?(e.baseState&&(e.baseState=!1,Er=!0),e.memoizedState=r):(Sn(r,t)||(r=y(),St.lanes|=r,Ao|=r,e.baseState=!0),t)}function gp(e,t){var r=se;se=r!==0&&4>r?r:4,e(!0);var n=Ja.transition;Ja.transition={};try{e(!1),t()}finally{se=r,Ja.transition=n}}function nc(){return cn().memoizedState}function xp(e,t,r){var n=zo(e);if(r={lane:n,action:r,hasEagerState:!1,eagerState:null,next:null},oc(e))ic(t,r);else if(r=Ru(e,t,r,n),r!==null){var i=vr();Pn(r,e,n,i),lc(r,t,n)}}function vp(e,t,r){var n=zo(e),i={lane:n,action:r,hasEagerState:!1,eagerState:null,next:null};if(oc(e))ic(t,i);else{var s=e.alternate;if(e.lanes===0&&(s===null||s.lanes===0)&&(s=t.lastRenderedReducer,s!==null))try{var f=t.lastRenderedState,w=s(f,r);if(i.hasEagerState=!0,i.eagerState=w,Sn(w,f)){var b=t.interleaved;b===null?(i.next=i,Ya(t)):(i.next=b.next,b.next=i),t.interleaved=i;return}}catch{}finally{}r=Ru(e,t,i,n),r!==null&&(i=vr(),Pn(r,e,n,i),lc(r,t,n))}}function oc(e){var t=e.alternate;return e===St||t!==null&&t===St}function ic(e,t){Qi=Ml=!0;var r=e.pending;r===null?t.next=t:(t.next=r.next,r.next=t),e.pending=t}function lc(e,t,r){if((r&4194240)!==0){var n=t.lanes;n&=e.pendingLanes,r|=n,t.lanes=r,re(e,r)}}var Rl={readContext:un,useCallback:dr,useContext:dr,useEffect:dr,useImperativeHandle:dr,useInsertionEffect:dr,useLayoutEffect:dr,useMemo:dr,useReducer:dr,useRef:dr,useState:dr,useDebugValue:dr,useDeferredValue:dr,useTransition:dr,useMutableSource:dr,useSyncExternalStore:dr,useId:dr,unstable_isNewReconciler:!1},yp={readContext:un,useCallback:function(e,t){return Un().memoizedState=[e,t===void 0?null:t],e},useContext:un,useEffect:Gu,useImperativeHandle:function(e,t,r){return r=r!=null?r.concat([e]):null,Ll(4194308,4,Zu.bind(null,t,e),r)},useLayoutEffect:function(e,t){return Ll(4194308,4,e,t)},useInsertionEffect:function(e,t){return Ll(4,2,e,t)},useMemo:function(e,t){var r=Un();return t=t===void 0?null:t,e=e(),r.memoizedState=[e,t],e},useReducer:function(e,t,r){var n=Un();return t=r!==void 0?r(t):t,n.memoizedState=n.baseState=t,e={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:e,lastRenderedState:t},n.queue=e,e=e.dispatch=xp.bind(null,St,e),[n.memoizedState,e]},useRef:function(e){var t=Un();return e={current:e},t.memoizedState=e},useState:Yu,useDebugValue:ls,useDeferredValue:function(e){return Un().memoizedState=e},useTransition:function(){var e=Yu(!1),t=e[0];return e=gp.bind(null,e[1]),Un().memoizedState=e,[t,e]},useMutableSource:function(){},useSyncExternalStore:function(e,t,r){var n=St,i=Un();if(kt){if(r===void 0)throw Error(p(407));r=r()}else{if(r=t(),Qt===null)throw Error(p(349));($o&30)!==0||Uu(n,t,r)}i.memoizedState=r;var s={value:r,getSnapshot:t};return i.queue=s,Gu(Wu.bind(null,n,s,e),[e]),n.flags|=2048,Gi(9,Hu.bind(null,n,s,r,t),void 0,null),r},useId:function(){var e=Un(),t=Qt.identifierPrefix;if(kt){var r=ro,n=to;r=(n&~(1<<32-Ct(n)-1)).toString(32)+r,t=":"+t+"R"+r,r=Yi++,0<r&&(t+="H"+r.toString(32)),t+=":"}else r=mp++,t=":"+t+"r"+r.toString(32)+":";return e.memoizedState=t},unstable_isNewReconciler:!1},wp={readContext:un,useCallback:ec,useContext:un,useEffect:is,useImperativeHandle:Ju,useInsertionEffect:qu,useLayoutEffect:Xu,useMemo:tc,useReducer:ns,useRef:Ku,useState:function(){return ns(Ki)},useDebugValue:ls,useDeferredValue:function(e){var t=cn();return rc(t,Dt.memoizedState,e)},useTransition:function(){var e=ns(Ki)[0],t=cn().memoizedState;return[e,t]},useMutableSource:$u,useSyncExternalStore:Au,useId:nc,unstable_isNewReconciler:!1},kp={readContext:un,useCallback:ec,useContext:un,useEffect:is,useImperativeHandle:Ju,useInsertionEffect:qu,useLayoutEffect:Xu,useMemo:tc,useReducer:os,useRef:Ku,useState:function(){return os(Ki)},useDebugValue:ls,useDeferredValue:function(e){var t=cn();return Dt===null?t.memoizedState=e:rc(t,Dt.memoizedState,e)},useTransition:function(){var e=os(Ki)[0],t=cn().memoizedState;return[e,t]},useMutableSource:$u,useSyncExternalStore:Au,useId:nc,unstable_isNewReconciler:!1};function Cn(e,t){if(e&&e.defaultProps){t=ce({},t),e=e.defaultProps;for(var r in e)t[r]===void 0&&(t[r]=e[r]);return t}return t}function as(e,t,r,n){t=e.memoizedState,r=r(n,t),r=r==null?t:ce({},t,r),e.memoizedState=r,e.lanes===0&&(e.updateQueue.baseState=r)}var Il={isMounted:function(e){return(e=e._reactInternals)?ar(e)===e:!1},enqueueSetState:function(e,t,r){e=e._reactInternals;var n=vr(),i=zo(e),s=oo(n,i);s.payload=t,r!=null&&(s.callback=r),t=yo(e,s,i),t!==null&&(Pn(t,e,i,n),Nl(t,e,i))},enqueueReplaceState:function(e,t,r){e=e._reactInternals;var n=vr(),i=zo(e),s=oo(n,i);s.tag=1,s.payload=t,r!=null&&(s.callback=r),t=yo(e,s,i),t!==null&&(Pn(t,e,i,n),Nl(t,e,i))},enqueueForceUpdate:function(e,t){e=e._reactInternals;var r=vr(),n=zo(e),i=oo(r,n);i.tag=2,t!=null&&(i.callback=t),t=yo(e,i,n),t!==null&&(Pn(t,e,n,r),Nl(t,e,n))}};function ac(e,t,r,n,i,s,f){return e=e.stateNode,typeof e.shouldComponentUpdate=="function"?e.shouldComponentUpdate(n,s,f):t.prototype&&t.prototype.isPureReactComponent?!Ri(r,n)||!Ri(i,s):!0}function sc(e,t,r){var n=!1,i=go,s=t.contextType;return typeof s=="object"&&s!==null?s=un(s):(i=Cr(t)?Ro:cr.current,n=t.contextTypes,s=(n=n!=null)?si(e,i):go),t=new t(r,s),e.memoizedState=t.state!==null&&t.state!==void 0?t.state:null,t.updater=Il,e.stateNode=t,t._reactInternals=e,n&&(e=e.stateNode,e.__reactInternalMemoizedUnmaskedChildContext=i,e.__reactInternalMemoizedMaskedChildContext=s),t}function uc(e,t,r,n){e=t.state,typeof t.componentWillReceiveProps=="function"&&t.componentWillReceiveProps(r,n),typeof t.UNSAFE_componentWillReceiveProps=="function"&&t.UNSAFE_componentWillReceiveProps(r,n),t.state!==e&&Il.enqueueReplaceState(t,t.state,null)}function ss(e,t,r,n){var i=e.stateNode;i.props=r,i.state=e.memoizedState,i.refs={},Ka(e);var s=t.contextType;typeof s=="object"&&s!==null?i.context=un(s):(s=Cr(t)?Ro:cr.current,i.context=si(e,s)),i.state=e.memoizedState,s=t.getDerivedStateFromProps,typeof s=="function"&&(as(e,t,s,r),i.state=e.memoizedState),typeof t.getDerivedStateFromProps=="function"||typeof i.getSnapshotBeforeUpdate=="function"||typeof i.UNSAFE_componentWillMount!="function"&&typeof i.componentWillMount!="function"||(t=i.state,typeof i.componentWillMount=="function"&&i.componentWillMount(),typeof i.UNSAFE_componentWillMount=="function"&&i.UNSAFE_componentWillMount(),t!==i.state&&Il.enqueueReplaceState(i,i.state,null),Pl(e,r,i,n),i.state=e.memoizedState),typeof i.componentDidMount=="function"&&(e.flags|=4194308)}function gi(e,t){try{var r="",n=t;do r+=He(n),n=n.return;while(n);var i=r}catch(s){i=`
Error generating stack: `+s.message+`
`+s.stack}return{value:e,source:t,stack:i,digest:null}}function us(e,t,r){return{value:e,source:null,stack:r??null,digest:t??null}}function cs(e,t){try{console.error(t.value)}catch(r){setTimeout(function(){throw r})}}var bp=typeof WeakMap=="function"?WeakMap:Map;function cc(e,t,r){r=oo(-1,r),r.tag=3,r.payload={element:null};var n=t.value;return r.callback=function(){Hl||(Hl=!0,js=n),cs(e,t)},r}function dc(e,t,r){r=oo(-1,r),r.tag=3;var n=e.type.getDerivedStateFromError;if(typeof n=="function"){var i=t.value;r.payload=function(){return n(i)},r.callback=function(){cs(e,t)}}var s=e.stateNode;return s!==null&&typeof s.componentDidCatch=="function"&&(r.callback=function(){cs(e,t),typeof n!="function"&&(ko===null?ko=new Set([this]):ko.add(this));var f=t.stack;this.componentDidCatch(t.value,{componentStack:f!==null?f:""})}),r}function pc(e,t,r){var n=e.pingCache;if(n===null){n=e.pingCache=new bp;var i=new Set;n.set(t,i)}else i=n.get(t),i===void 0&&(i=new Set,n.set(t,i));i.has(r)||(i.add(r),e=Ip.bind(null,e,t,r),t.then(e,e))}function fc(e){do{var t;if((t=e.tag===13)&&(t=e.memoizedState,t=t!==null?t.dehydrated!==null:!0),t)return e;e=e.return}while(e!==null);return null}function hc(e,t,r,n,i){return(e.mode&1)===0?(e===t?e.flags|=65536:(e.flags|=128,r.flags|=131072,r.flags&=-52805,r.tag===1&&(r.alternate===null?r.tag=17:(t=oo(-1,1),t.tag=2,yo(r,t,1))),r.lanes|=1),e):(e.flags|=65536,e.lanes=i,e)}var zp=Te.ReactCurrentOwner,Er=!1;function xr(e,t,r,n){t.child=e===null?Fu(t,null,r,n):pi(t,e.child,r,n)}function mc(e,t,r,n,i){r=r.render;var s=t.ref;return hi(t,i),n=ts(e,t,r,n,s,i),r=rs(),e!==null&&!Er?(t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~i,io(e,t,i)):(kt&&r&&Da(t),t.flags|=1,xr(e,t,n,i),t.child)}function gc(e,t,r,n,i){if(e===null){var s=r.type;return typeof s=="function"&&!Ms(s)&&s.defaultProps===void 0&&r.compare===null&&r.defaultProps===void 0?(t.tag=15,t.type=s,xc(e,t,s,n,i)):(e=Gl(r.type,null,n,t,t.mode,i),e.ref=t.ref,e.return=t,t.child=e)}if(s=e.child,(e.lanes&i)===0){var f=s.memoizedProps;if(r=r.compare,r=r!==null?r:Ri,r(f,n)&&e.ref===t.ref)return io(e,t,i)}return t.flags|=1,e=jo(s,n),e.ref=t.ref,e.return=t,t.child=e}function xc(e,t,r,n,i){if(e!==null){var s=e.memoizedProps;if(Ri(s,n)&&e.ref===t.ref)if(Er=!1,t.pendingProps=n=s,(e.lanes&i)!==0)(e.flags&131072)!==0&&(Er=!0);else return t.lanes=e.lanes,io(e,t,i)}return ds(e,t,r,n,i)}function vc(e,t,r){var n=t.pendingProps,i=n.children,s=e!==null?e.memoizedState:null;if(n.mode==="hidden")if((t.mode&1)===0)t.memoizedState={baseLanes:0,cachePool:null,transitions:null},mt(vi,Wr),Wr|=r;else{if((r&1073741824)===0)return e=s!==null?s.baseLanes|r:r,t.lanes=t.childLanes=1073741824,t.memoizedState={baseLanes:e,cachePool:null,transitions:null},t.updateQueue=null,mt(vi,Wr),Wr|=e,null;t.memoizedState={baseLanes:0,cachePool:null,transitions:null},n=s!==null?s.baseLanes:r,mt(vi,Wr),Wr|=n}else s!==null?(n=s.baseLanes|r,t.memoizedState=null):n=r,mt(vi,Wr),Wr|=n;return xr(e,t,i,r),t.child}function yc(e,t){var r=t.ref;(e===null&&r!==null||e!==null&&e.ref!==r)&&(t.flags|=512,t.flags|=2097152)}function ds(e,t,r,n,i){var s=Cr(r)?Ro:cr.current;return s=si(t,s),hi(t,i),r=ts(e,t,r,n,s,i),n=rs(),e!==null&&!Er?(t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~i,io(e,t,i)):(kt&&n&&Da(t),t.flags|=1,xr(e,t,r,i),t.child)}function wc(e,t,r,n,i){if(Cr(r)){var s=!0;wl(t)}else s=!1;if(hi(t,i),t.stateNode===null)Dl(e,t),sc(t,r,n),ss(t,r,n,i),n=!0;else if(e===null){var f=t.stateNode,w=t.memoizedProps;f.props=w;var b=f.context,R=r.contextType;typeof R=="object"&&R!==null?R=un(R):(R=Cr(r)?Ro:cr.current,R=si(t,R));var K=r.getDerivedStateFromProps,J=typeof K=="function"||typeof f.getSnapshotBeforeUpdate=="function";J||typeof f.UNSAFE_componentWillReceiveProps!="function"&&typeof f.componentWillReceiveProps!="function"||(w!==n||b!==R)&&uc(t,f,n,R),vo=!1;var Q=t.memoizedState;f.state=Q,Pl(t,n,f,i),b=t.memoizedState,w!==n||Q!==b||jr.current||vo?(typeof K=="function"&&(as(t,r,K,n),b=t.memoizedState),(w=vo||ac(t,r,w,n,Q,b,R))?(J||typeof f.UNSAFE_componentWillMount!="function"&&typeof f.componentWillMount!="function"||(typeof f.componentWillMount=="function"&&f.componentWillMount(),typeof f.UNSAFE_componentWillMount=="function"&&f.UNSAFE_componentWillMount()),typeof f.componentDidMount=="function"&&(t.flags|=4194308)):(typeof f.componentDidMount=="function"&&(t.flags|=4194308),t.memoizedProps=n,t.memoizedState=b),f.props=n,f.state=b,f.context=R,n=w):(typeof f.componentDidMount=="function"&&(t.flags|=4194308),n=!1)}else{f=t.stateNode,Iu(e,t),w=t.memoizedProps,R=t.type===t.elementType?w:Cn(t.type,w),f.props=R,J=t.pendingProps,Q=f.context,b=r.contextType,typeof b=="object"&&b!==null?b=un(b):(b=Cr(r)?Ro:cr.current,b=si(t,b));var xe=r.getDerivedStateFromProps;(K=typeof xe=="function"||typeof f.getSnapshotBeforeUpdate=="function")||typeof f.UNSAFE_componentWillReceiveProps!="function"&&typeof f.componentWillReceiveProps!="function"||(w!==J||Q!==b)&&uc(t,f,n,b),vo=!1,Q=t.memoizedState,f.state=Q,Pl(t,n,f,i);var be=t.memoizedState;w!==J||Q!==be||jr.current||vo?(typeof xe=="function"&&(as(t,r,xe,n),be=t.memoizedState),(R=vo||ac(t,r,R,n,Q,be,b)||!1)?(K||typeof f.UNSAFE_componentWillUpdate!="function"&&typeof f.componentWillUpdate!="function"||(typeof f.componentWillUpdate=="function"&&f.componentWillUpdate(n,be,b),typeof f.UNSAFE_componentWillUpdate=="function"&&f.UNSAFE_componentWillUpdate(n,be,b)),typeof f.componentDidUpdate=="function"&&(t.flags|=4),typeof f.getSnapshotBeforeUpdate=="function"&&(t.flags|=1024)):(typeof f.componentDidUpdate!="function"||w===e.memoizedProps&&Q===e.memoizedState||(t.flags|=4),typeof f.getSnapshotBeforeUpdate!="function"||w===e.memoizedProps&&Q===e.memoizedState||(t.flags|=1024),t.memoizedProps=n,t.memoizedState=be),f.props=n,f.state=be,f.context=b,n=R):(typeof f.componentDidUpdate!="function"||w===e.memoizedProps&&Q===e.memoizedState||(t.flags|=4),typeof f.getSnapshotBeforeUpdate!="function"||w===e.memoizedProps&&Q===e.memoizedState||(t.flags|=1024),n=!1)}return ps(e,t,r,n,s,i)}function ps(e,t,r,n,i,s){yc(e,t);var f=(t.flags&128)!==0;if(!n&&!f)return i&&ju(t,r,!1),io(e,t,s);n=t.stateNode,zp.current=t;var w=f&&typeof r.getDerivedStateFromError!="function"?null:n.render();return t.flags|=1,e!==null&&f?(t.child=pi(t,e.child,null,s),t.child=pi(t,null,w,s)):xr(e,t,w,s),t.memoizedState=n.state,i&&ju(t,r,!0),t.child}function kc(e){var t=e.stateNode;t.pendingContext?zu(e,t.pendingContext,t.pendingContext!==t.context):t.context&&zu(e,t.context,!1),Ga(e,t.containerInfo)}function bc(e,t,r,n,i){return di(),Ua(i),t.flags|=256,xr(e,t,r,n),t.child}var fs={dehydrated:null,treeContext:null,retryLane:0};function hs(e){return{baseLanes:e,cachePool:null,transitions:null}}function zc(e,t,r){var n=t.pendingProps,i=zt.current,s=!1,f=(t.flags&128)!==0,w;if((w=f)||(w=e!==null&&e.memoizedState===null?!1:(i&2)!==0),w?(s=!0,t.flags&=-129):(e===null||e.memoizedState!==null)&&(i|=1),mt(zt,i&1),e===null)return Aa(t),e=t.memoizedState,e!==null&&(e=e.dehydrated,e!==null)?((t.mode&1)===0?t.lanes=1:e.data==="$!"?t.lanes=8:t.lanes=1073741824,null):(f=n.children,e=n.fallback,s?(n=t.mode,s=t.child,f={mode:"hidden",children:f},(n&1)===0&&s!==null?(s.childLanes=0,s.pendingProps=f):s=ql(f,n,0,null),e=Vo(e,n,r,null),s.return=t,e.return=t,s.sibling=e,t.child=s,t.child.memoizedState=hs(r),t.memoizedState=fs,e):ms(t,f));if(i=e.memoizedState,i!==null&&(w=i.dehydrated,w!==null))return Sp(e,t,f,n,w,i,r);if(s){s=n.fallback,f=t.mode,i=e.child,w=i.sibling;var b={mode:"hidden",children:n.children};return(f&1)===0&&t.child!==i?(n=t.child,n.childLanes=0,n.pendingProps=b,t.deletions=null):(n=jo(i,b),n.subtreeFlags=i.subtreeFlags&14680064),w!==null?s=jo(w,s):(s=Vo(s,f,r,null),s.flags|=2),s.return=t,n.return=t,n.sibling=s,t.child=n,n=s,s=t.child,f=e.child.memoizedState,f=f===null?hs(r):{baseLanes:f.baseLanes|r,cachePool:null,transitions:f.transitions},s.memoizedState=f,s.childLanes=e.childLanes&~r,t.memoizedState=fs,n}return s=e.child,e=s.sibling,n=jo(s,{mode:"visible",children:n.children}),(t.mode&1)===0&&(n.lanes=r),n.return=t,n.sibling=null,e!==null&&(r=t.deletions,r===null?(t.deletions=[e],t.flags|=16):r.push(e)),t.child=n,t.memoizedState=null,n}function ms(e,t){return t=ql({mode:"visible",children:t},e.mode,0,null),t.return=e,e.child=t}function Ol(e,t,r,n){return n!==null&&Ua(n),pi(t,e.child,null,r),e=ms(t,t.pendingProps.children),e.flags|=2,t.memoizedState=null,e}function Sp(e,t,r,n,i,s,f){if(r)return t.flags&256?(t.flags&=-257,n=us(Error(p(422))),Ol(e,t,f,n)):t.memoizedState!==null?(t.child=e.child,t.flags|=128,null):(s=n.fallback,i=t.mode,n=ql({mode:"visible",children:n.children},i,0,null),s=Vo(s,i,f,null),s.flags|=2,n.return=t,s.return=t,n.sibling=s,t.child=n,(t.mode&1)!==0&&pi(t,e.child,null,f),t.child.memoizedState=hs(f),t.memoizedState=fs,s);if((t.mode&1)===0)return Ol(e,t,f,null);if(i.data==="$!"){if(n=i.nextSibling&&i.nextSibling.dataset,n)var w=n.dgst;return n=w,s=Error(p(419)),n=us(s,n,void 0),Ol(e,t,f,n)}if(w=(f&e.childLanes)!==0,Er||w){if(n=Qt,n!==null){switch(f&-f){case 4:i=2;break;case 16:i=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:i=32;break;case 536870912:i=268435456;break;default:i=0}i=(i&(n.suspendedLanes|f))!==0?0:i,i!==0&&i!==s.retryLane&&(s.retryLane=i,no(e,i),Pn(n,e,i,-1))}return Ts(),n=us(Error(p(421))),Ol(e,t,f,n)}return i.data==="$?"?(t.flags|=128,t.child=e.child,t=Op.bind(null,e),i._reactRetry=t,null):(e=s.treeContext,Hr=ho(i.nextSibling),Ur=t,kt=!0,jn=null,e!==null&&(an[sn++]=to,an[sn++]=ro,an[sn++]=Io,to=e.id,ro=e.overflow,Io=t),t=ms(t,n.children),t.flags|=4096,t)}function Sc(e,t,r){e.lanes|=t;var n=e.alternate;n!==null&&(n.lanes|=t),Qa(e.return,t,r)}function gs(e,t,r,n,i){var s=e.memoizedState;s===null?e.memoizedState={isBackwards:t,rendering:null,renderingStartTime:0,last:n,tail:r,tailMode:i}:(s.isBackwards=t,s.rendering=null,s.renderingStartTime=0,s.last=n,s.tail=r,s.tailMode=i)}function jc(e,t,r){var n=t.pendingProps,i=n.revealOrder,s=n.tail;if(xr(e,t,n.children,r),n=zt.current,(n&2)!==0)n=n&1|2,t.flags|=128;else{if(e!==null&&(e.flags&128)!==0)e:for(e=t.child;e!==null;){if(e.tag===13)e.memoizedState!==null&&Sc(e,r,t);else if(e.tag===19)Sc(e,r,t);else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break e;for(;e.sibling===null;){if(e.return===null||e.return===t)break e;e=e.return}e.sibling.return=e.return,e=e.sibling}n&=1}if(mt(zt,n),(t.mode&1)===0)t.memoizedState=null;else switch(i){case"forwards":for(r=t.child,i=null;r!==null;)e=r.alternate,e!==null&&_l(e)===null&&(i=r),r=r.sibling;r=i,r===null?(i=t.child,t.child=null):(i=r.sibling,r.sibling=null),gs(t,!1,i,r,s);break;case"backwards":for(r=null,i=t.child,t.child=null;i!==null;){if(e=i.alternate,e!==null&&_l(e)===null){t.child=i;break}e=i.sibling,i.sibling=r,r=i,i=e}gs(t,!0,r,null,s);break;case"together":gs(t,!1,null,null,void 0);break;default:t.memoizedState=null}return t.child}function Dl(e,t){(t.mode&1)===0&&e!==null&&(e.alternate=null,t.alternate=null,t.flags|=2)}function io(e,t,r){if(e!==null&&(t.dependencies=e.dependencies),Ao|=t.lanes,(r&t.childLanes)===0)return null;if(e!==null&&t.child!==e.child)throw Error(p(153));if(t.child!==null){for(e=t.child,r=jo(e,e.pendingProps),t.child=r,r.return=t;e.sibling!==null;)e=e.sibling,r=r.sibling=jo(e,e.pendingProps),r.return=t;r.sibling=null}return t.child}function jp(e,t,r){switch(t.tag){case 3:kc(t),di();break;case 5:Bu(t);break;case 1:Cr(t.type)&&wl(t);break;case 4:Ga(t,t.stateNode.containerInfo);break;case 10:var n=t.type._context,i=t.memoizedProps.value;mt(Cl,n._currentValue),n._currentValue=i;break;case 13:if(n=t.memoizedState,n!==null)return n.dehydrated!==null?(mt(zt,zt.current&1),t.flags|=128,null):(r&t.child.childLanes)!==0?zc(e,t,r):(mt(zt,zt.current&1),e=io(e,t,r),e!==null?e.sibling:null);mt(zt,zt.current&1);break;case 19:if(n=(r&t.childLanes)!==0,(e.flags&128)!==0){if(n)return jc(e,t,r);t.flags|=128}if(i=t.memoizedState,i!==null&&(i.rendering=null,i.tail=null,i.lastEffect=null),mt(zt,zt.current),n)break;return null;case 22:case 23:return t.lanes=0,vc(e,t,r)}return io(e,t,r)}var Cc,xs,Ec,Nc;Cc=function(e,t){for(var r=t.child;r!==null;){if(r.tag===5||r.tag===6)e.appendChild(r.stateNode);else if(r.tag!==4&&r.child!==null){r.child.return=r,r=r.child;continue}if(r===t)break;for(;r.sibling===null;){if(r.return===null||r.return===t)return;r=r.return}r.sibling.return=r.return,r=r.sibling}},xs=function(){},Ec=function(e,t,r,n){var i=e.memoizedProps;if(i!==n){e=t.stateNode,Bo(An.current);var s=null;switch(r){case"input":i=Lt(e,i),n=Lt(e,n),s=[];break;case"select":i=ce({},i,{value:void 0}),n=ce({},n,{value:void 0}),s=[];break;case"textarea":i=or(e,i),n=or(e,n),s=[];break;default:typeof i.onClick!="function"&&typeof n.onClick=="function"&&(e.onclick=xl)}kr(r,n);var f;r=null;for(R in i)if(!n.hasOwnProperty(R)&&i.hasOwnProperty(R)&&i[R]!=null)if(R==="style"){var w=i[R];for(f in w)w.hasOwnProperty(f)&&(r||(r={}),r[f]="")}else R!=="dangerouslySetInnerHTML"&&R!=="children"&&R!=="suppressContentEditableWarning"&&R!=="suppressHydrationWarning"&&R!=="autoFocus"&&(k.hasOwnProperty(R)?s||(s=[]):(s=s||[]).push(R,null));for(R in n){var b=n[R];if(w=i!=null?i[R]:void 0,n.hasOwnProperty(R)&&b!==w&&(b!=null||w!=null))if(R==="style")if(w){for(f in w)!w.hasOwnProperty(f)||b&&b.hasOwnProperty(f)||(r||(r={}),r[f]="");for(f in b)b.hasOwnProperty(f)&&w[f]!==b[f]&&(r||(r={}),r[f]=b[f])}else r||(s||(s=[]),s.push(R,r)),r=b;else R==="dangerouslySetInnerHTML"?(b=b?b.__html:void 0,w=w?w.__html:void 0,b!=null&&w!==b&&(s=s||[]).push(R,b)):R==="children"?typeof b!="string"&&typeof b!="number"||(s=s||[]).push(R,""+b):R!=="suppressContentEditableWarning"&&R!=="suppressHydrationWarning"&&(k.hasOwnProperty(R)?(b!=null&&R==="onScroll"&&vt("scroll",e),s||w===b||(s=[])):(s=s||[]).push(R,b))}r&&(s=s||[]).push("style",r);var R=s;(t.updateQueue=R)&&(t.flags|=4)}},Nc=function(e,t,r,n){r!==n&&(t.flags|=4)};function qi(e,t){if(!kt)switch(e.tailMode){case"hidden":t=e.tail;for(var r=null;t!==null;)t.alternate!==null&&(r=t),t=t.sibling;r===null?e.tail=null:r.sibling=null;break;case"collapsed":r=e.tail;for(var n=null;r!==null;)r.alternate!==null&&(n=r),r=r.sibling;n===null?t||e.tail===null?e.tail=null:e.tail.sibling=null:n.sibling=null}}function pr(e){var t=e.alternate!==null&&e.alternate.child===e.child,r=0,n=0;if(t)for(var i=e.child;i!==null;)r|=i.lanes|i.childLanes,n|=i.subtreeFlags&14680064,n|=i.flags&14680064,i.return=e,i=i.sibling;else for(i=e.child;i!==null;)r|=i.lanes|i.childLanes,n|=i.subtreeFlags,n|=i.flags,i.return=e,i=i.sibling;return e.subtreeFlags|=n,e.childLanes=r,t}function Cp(e,t,r){var n=t.pendingProps;switch(Ba(t),t.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return pr(t),null;case 1:return Cr(t.type)&&yl(),pr(t),null;case 3:return n=t.stateNode,mi(),yt(jr),yt(cr),Za(),n.pendingContext&&(n.context=n.pendingContext,n.pendingContext=null),(e===null||e.child===null)&&(Sl(t)?t.flags|=4:e===null||e.memoizedState.isDehydrated&&(t.flags&256)===0||(t.flags|=1024,jn!==null&&(Ns(jn),jn=null))),xs(e,t),pr(t),null;case 5:qa(t);var i=Bo(Vi.current);if(r=t.type,e!==null&&t.stateNode!=null)Ec(e,t,r,n,i),e.ref!==t.ref&&(t.flags|=512,t.flags|=2097152);else{if(!n){if(t.stateNode===null)throw Error(p(166));return pr(t),null}if(e=Bo(An.current),Sl(t)){n=t.stateNode,r=t.type;var s=t.memoizedProps;switch(n[$n]=t,n[$i]=s,e=(t.mode&1)!==0,r){case"dialog":vt("cancel",n),vt("close",n);break;case"iframe":case"object":case"embed":vt("load",n);break;case"video":case"audio":for(i=0;i<Oi.length;i++)vt(Oi[i],n);break;case"source":vt("error",n);break;case"img":case"image":case"link":vt("error",n),vt("load",n);break;case"details":vt("toggle",n);break;case"input":Mr(n,s),vt("invalid",n);break;case"select":n._wrapperState={wasMultiple:!!s.multiple},vt("invalid",n);break;case"textarea":dt(n,s),vt("invalid",n)}kr(r,s),i=null;for(var f in s)if(s.hasOwnProperty(f)){var w=s[f];f==="children"?typeof w=="string"?n.textContent!==w&&(s.suppressHydrationWarning!==!0&&gl(n.textContent,w,e),i=["children",w]):typeof w=="number"&&n.textContent!==""+w&&(s.suppressHydrationWarning!==!0&&gl(n.textContent,w,e),i=["children",""+w]):k.hasOwnProperty(f)&&w!=null&&f==="onScroll"&&vt("scroll",n)}switch(r){case"input":jt(n),Yr(n,s,!0);break;case"textarea":jt(n),Fr(n);break;case"select":case"option":break;default:typeof s.onClick=="function"&&(n.onclick=xl)}n=i,t.updateQueue=n,n!==null&&(t.flags|=4)}else{f=i.nodeType===9?i:i.ownerDocument,e==="http://www.w3.org/1999/xhtml"&&(e=fn(r)),e==="http://www.w3.org/1999/xhtml"?r==="script"?(e=f.createElement("div"),e.innerHTML="<script><\/script>",e=e.removeChild(e.firstChild)):typeof n.is=="string"?e=f.createElement(r,{is:n.is}):(e=f.createElement(r),r==="select"&&(f=e,n.multiple?f.multiple=!0:n.size&&(f.size=n.size))):e=f.createElementNS(e,r),e[$n]=t,e[$i]=n,Cc(e,t,!1,!1),t.stateNode=e;e:{switch(f=Rn(r,n),r){case"dialog":vt("cancel",e),vt("close",e),i=n;break;case"iframe":case"object":case"embed":vt("load",e),i=n;break;case"video":case"audio":for(i=0;i<Oi.length;i++)vt(Oi[i],e);i=n;break;case"source":vt("error",e),i=n;break;case"img":case"image":case"link":vt("error",e),vt("load",e),i=n;break;case"details":vt("toggle",e),i=n;break;case"input":Mr(e,n),i=Lt(e,n),vt("invalid",e);break;case"option":i=n;break;case"select":e._wrapperState={wasMultiple:!!n.multiple},i=ce({},n,{value:void 0}),vt("invalid",e);break;case"textarea":dt(e,n),i=or(e,n),vt("invalid",e);break;default:i=n}kr(r,i),w=i;for(s in w)if(w.hasOwnProperty(s)){var b=w[s];s==="style"?Fn(e,b):s==="dangerouslySetInnerHTML"?(b=b?b.__html:void 0,b!=null&&hn(e,b)):s==="children"?typeof b=="string"?(r!=="textarea"||b!=="")&&Rr(e,b):typeof b=="number"&&Rr(e,""+b):s!=="suppressContentEditableWarning"&&s!=="suppressHydrationWarning"&&s!=="autoFocus"&&(k.hasOwnProperty(s)?b!=null&&s==="onScroll"&&vt("scroll",e):b!=null&&Ke(e,s,b,f))}switch(r){case"input":jt(e),Yr(e,n,!1);break;case"textarea":jt(e),Fr(e);break;case"option":n.value!=null&&e.setAttribute("value",""+tt(n.value));break;case"select":e.multiple=!!n.multiple,s=n.value,s!=null?Lr(e,!!n.multiple,s,!1):n.defaultValue!=null&&Lr(e,!!n.multiple,n.defaultValue,!0);break;default:typeof i.onClick=="function"&&(e.onclick=xl)}switch(r){case"button":case"input":case"select":case"textarea":n=!!n.autoFocus;break e;case"img":n=!0;break e;default:n=!1}}n&&(t.flags|=4)}t.ref!==null&&(t.flags|=512,t.flags|=2097152)}return pr(t),null;case 6:if(e&&t.stateNode!=null)Nc(e,t,e.memoizedProps,n);else{if(typeof n!="string"&&t.stateNode===null)throw Error(p(166));if(r=Bo(Vi.current),Bo(An.current),Sl(t)){if(n=t.stateNode,r=t.memoizedProps,n[$n]=t,(s=n.nodeValue!==r)&&(e=Ur,e!==null))switch(e.tag){case 3:gl(n.nodeValue,r,(e.mode&1)!==0);break;case 5:e.memoizedProps.suppressHydrationWarning!==!0&&gl(n.nodeValue,r,(e.mode&1)!==0)}s&&(t.flags|=4)}else n=(r.nodeType===9?r:r.ownerDocument).createTextNode(n),n[$n]=t,t.stateNode=n}return pr(t),null;case 13:if(yt(zt),n=t.memoizedState,e===null||e.memoizedState!==null&&e.memoizedState.dehydrated!==null){if(kt&&Hr!==null&&(t.mode&1)!==0&&(t.flags&128)===0)Tu(),di(),t.flags|=98560,s=!1;else if(s=Sl(t),n!==null&&n.dehydrated!==null){if(e===null){if(!s)throw Error(p(318));if(s=t.memoizedState,s=s!==null?s.dehydrated:null,!s)throw Error(p(317));s[$n]=t}else di(),(t.flags&128)===0&&(t.memoizedState=null),t.flags|=4;pr(t),s=!1}else jn!==null&&(Ns(jn),jn=null),s=!0;if(!s)return t.flags&65536?t:null}return(t.flags&128)!==0?(t.lanes=r,t):(n=n!==null,n!==(e!==null&&e.memoizedState!==null)&&n&&(t.child.flags|=8192,(t.mode&1)!==0&&(e===null||(zt.current&1)!==0?Bt===0&&(Bt=3):Ts())),t.updateQueue!==null&&(t.flags|=4),pr(t),null);case 4:return mi(),xs(e,t),e===null&&Di(t.stateNode.containerInfo),pr(t),null;case 10:return Va(t.type._context),pr(t),null;case 17:return Cr(t.type)&&yl(),pr(t),null;case 19:if(yt(zt),s=t.memoizedState,s===null)return pr(t),null;if(n=(t.flags&128)!==0,f=s.rendering,f===null)if(n)qi(s,!1);else{if(Bt!==0||e!==null&&(e.flags&128)!==0)for(e=t.child;e!==null;){if(f=_l(e),f!==null){for(t.flags|=128,qi(s,!1),n=f.updateQueue,n!==null&&(t.updateQueue=n,t.flags|=4),t.subtreeFlags=0,n=r,r=t.child;r!==null;)s=r,e=n,s.flags&=14680066,f=s.alternate,f===null?(s.childLanes=0,s.lanes=e,s.child=null,s.subtreeFlags=0,s.memoizedProps=null,s.memoizedState=null,s.updateQueue=null,s.dependencies=null,s.stateNode=null):(s.childLanes=f.childLanes,s.lanes=f.lanes,s.child=f.child,s.subtreeFlags=0,s.deletions=null,s.memoizedProps=f.memoizedProps,s.memoizedState=f.memoizedState,s.updateQueue=f.updateQueue,s.type=f.type,e=f.dependencies,s.dependencies=e===null?null:{lanes:e.lanes,firstContext:e.firstContext}),r=r.sibling;return mt(zt,zt.current&1|2),t.child}e=e.sibling}s.tail!==null&&ot()>yi&&(t.flags|=128,n=!0,qi(s,!1),t.lanes=4194304)}else{if(!n)if(e=_l(f),e!==null){if(t.flags|=128,n=!0,r=e.updateQueue,r!==null&&(t.updateQueue=r,t.flags|=4),qi(s,!0),s.tail===null&&s.tailMode==="hidden"&&!f.alternate&&!kt)return pr(t),null}else 2*ot()-s.renderingStartTime>yi&&r!==1073741824&&(t.flags|=128,n=!0,qi(s,!1),t.lanes=4194304);s.isBackwards?(f.sibling=t.child,t.child=f):(r=s.last,r!==null?r.sibling=f:t.child=f,s.last=f)}return s.tail!==null?(t=s.tail,s.rendering=t,s.tail=t.sibling,s.renderingStartTime=ot(),t.sibling=null,r=zt.current,mt(zt,n?r&1|2:r&1),t):(pr(t),null);case 22:case 23:return _s(),n=t.memoizedState!==null,e!==null&&e.memoizedState!==null!==n&&(t.flags|=8192),n&&(t.mode&1)!==0?(Wr&1073741824)!==0&&(pr(t),t.subtreeFlags&6&&(t.flags|=8192)):pr(t),null;case 24:return null;case 25:return null}throw Error(p(156,t.tag))}function Ep(e,t){switch(Ba(t),t.tag){case 1:return Cr(t.type)&&yl(),e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 3:return mi(),yt(jr),yt(cr),Za(),e=t.flags,(e&65536)!==0&&(e&128)===0?(t.flags=e&-65537|128,t):null;case 5:return qa(t),null;case 13:if(yt(zt),e=t.memoizedState,e!==null&&e.dehydrated!==null){if(t.alternate===null)throw Error(p(340));di()}return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 19:return yt(zt),null;case 4:return mi(),null;case 10:return Va(t.type._context),null;case 22:case 23:return _s(),null;case 24:return null;default:return null}}var Bl=!1,fr=!1,Np=typeof WeakSet=="function"?WeakSet:Set,we=null;function xi(e,t){var r=e.ref;if(r!==null)if(typeof r=="function")try{r(null)}catch(n){Et(e,t,n)}else r.current=null}function vs(e,t,r){try{r()}catch(n){Et(e,t,n)}}var Pc=!1;function Pp(e,t){if(_a=sr,e=au(),ba(e)){if("selectionStart"in e)var r={start:e.selectionStart,end:e.selectionEnd};else e:{r=(r=e.ownerDocument)&&r.defaultView||window;var n=r.getSelection&&r.getSelection();if(n&&n.rangeCount!==0){r=n.anchorNode;var i=n.anchorOffset,s=n.focusNode;n=n.focusOffset;try{r.nodeType,s.nodeType}catch{r=null;break e}var f=0,w=-1,b=-1,R=0,K=0,J=e,Q=null;t:for(;;){for(var xe;J!==r||i!==0&&J.nodeType!==3||(w=f+i),J!==s||n!==0&&J.nodeType!==3||(b=f+n),J.nodeType===3&&(f+=J.nodeValue.length),(xe=J.firstChild)!==null;)Q=J,J=xe;for(;;){if(J===e)break t;if(Q===r&&++R===i&&(w=f),Q===s&&++K===n&&(b=f),(xe=J.nextSibling)!==null)break;J=Q,Q=J.parentNode}J=xe}r=w===-1||b===-1?null:{start:w,end:b}}else r=null}r=r||{start:0,end:0}}else r=null;for(Ta={focusedElem:e,selectionRange:r},sr=!1,we=t;we!==null;)if(t=we,e=t.child,(t.subtreeFlags&1028)!==0&&e!==null)e.return=t,we=e;else for(;we!==null;){t=we;try{var be=t.alternate;if((t.flags&1024)!==0)switch(t.tag){case 0:case 11:case 15:break;case 1:if(be!==null){var je=be.memoizedProps,Mt=be.memoizedState,N=t.stateNode,S=N.getSnapshotBeforeUpdate(t.elementType===t.type?je:Cn(t.type,je),Mt);N.__reactInternalSnapshotBeforeUpdate=S}break;case 3:var T=t.stateNode.containerInfo;T.nodeType===1?T.textContent="":T.nodeType===9&&T.documentElement&&T.removeChild(T.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(p(163))}}catch(oe){Et(t,t.return,oe)}if(e=t.sibling,e!==null){e.return=t.return,we=e;break}we=t.return}return be=Pc,Pc=!1,be}function Xi(e,t,r){var n=t.updateQueue;if(n=n!==null?n.lastEffect:null,n!==null){var i=n=n.next;do{if((i.tag&e)===e){var s=i.destroy;i.destroy=void 0,s!==void 0&&vs(t,r,s)}i=i.next}while(i!==n)}}function $l(e,t){if(t=t.updateQueue,t=t!==null?t.lastEffect:null,t!==null){var r=t=t.next;do{if((r.tag&e)===e){var n=r.create;r.destroy=n()}r=r.next}while(r!==t)}}function ys(e){var t=e.ref;if(t!==null){var r=e.stateNode;switch(e.tag){case 5:e=r;break;default:e=r}typeof t=="function"?t(e):t.current=e}}function _c(e){var t=e.alternate;t!==null&&(e.alternate=null,_c(t)),e.child=null,e.deletions=null,e.sibling=null,e.tag===5&&(t=e.stateNode,t!==null&&(delete t[$n],delete t[$i],delete t[Ra],delete t[dp],delete t[pp])),e.stateNode=null,e.return=null,e.dependencies=null,e.memoizedProps=null,e.memoizedState=null,e.pendingProps=null,e.stateNode=null,e.updateQueue=null}function Tc(e){return e.tag===5||e.tag===3||e.tag===4}function Mc(e){e:for(;;){for(;e.sibling===null;){if(e.return===null||Tc(e.return))return null;e=e.return}for(e.sibling.return=e.return,e=e.sibling;e.tag!==5&&e.tag!==6&&e.tag!==18;){if(e.flags&2||e.child===null||e.tag===4)continue e;e.child.return=e,e=e.child}if(!(e.flags&2))return e.stateNode}}function ws(e,t,r){var n=e.tag;if(n===5||n===6)e=e.stateNode,t?r.nodeType===8?r.parentNode.insertBefore(e,t):r.insertBefore(e,t):(r.nodeType===8?(t=r.parentNode,t.insertBefore(e,r)):(t=r,t.appendChild(e)),r=r._reactRootContainer,r!=null||t.onclick!==null||(t.onclick=xl));else if(n!==4&&(e=e.child,e!==null))for(ws(e,t,r),e=e.sibling;e!==null;)ws(e,t,r),e=e.sibling}function ks(e,t,r){var n=e.tag;if(n===5||n===6)e=e.stateNode,t?r.insertBefore(e,t):r.appendChild(e);else if(n!==4&&(e=e.child,e!==null))for(ks(e,t,r),e=e.sibling;e!==null;)ks(e,t,r),e=e.sibling}var tr=null,En=!1;function wo(e,t,r){for(r=r.child;r!==null;)Lc(e,t,r),r=r.sibling}function Lc(e,t,r){if(Xt&&typeof Xt.onCommitFiberUnmount=="function")try{Xt.onCommitFiberUnmount(mr,r)}catch{}switch(r.tag){case 5:fr||xi(r,t);case 6:var n=tr,i=En;tr=null,wo(e,t,r),tr=n,En=i,tr!==null&&(En?(e=tr,r=r.stateNode,e.nodeType===8?e.parentNode.removeChild(r):e.removeChild(r)):tr.removeChild(r.stateNode));break;case 18:tr!==null&&(En?(e=tr,r=r.stateNode,e.nodeType===8?Fa(e.parentNode,r):e.nodeType===1&&Fa(e,r),xt(e)):Fa(tr,r.stateNode));break;case 4:n=tr,i=En,tr=r.stateNode.containerInfo,En=!0,wo(e,t,r),tr=n,En=i;break;case 0:case 11:case 14:case 15:if(!fr&&(n=r.updateQueue,n!==null&&(n=n.lastEffect,n!==null))){i=n=n.next;do{var s=i,f=s.destroy;s=s.tag,f!==void 0&&((s&2)!==0||(s&4)!==0)&&vs(r,t,f),i=i.next}while(i!==n)}wo(e,t,r);break;case 1:if(!fr&&(xi(r,t),n=r.stateNode,typeof n.componentWillUnmount=="function"))try{n.props=r.memoizedProps,n.state=r.memoizedState,n.componentWillUnmount()}catch(w){Et(r,t,w)}wo(e,t,r);break;case 21:wo(e,t,r);break;case 22:r.mode&1?(fr=(n=fr)||r.memoizedState!==null,wo(e,t,r),fr=n):wo(e,t,r);break;default:wo(e,t,r)}}function Fc(e){var t=e.updateQueue;if(t!==null){e.updateQueue=null;var r=e.stateNode;r===null&&(r=e.stateNode=new Np),t.forEach(function(n){var i=Dp.bind(null,e,n);r.has(n)||(r.add(n),n.then(i,i))})}}function Nn(e,t){var r=t.deletions;if(r!==null)for(var n=0;n<r.length;n++){var i=r[n];try{var s=e,f=t,w=f;e:for(;w!==null;){switch(w.tag){case 5:tr=w.stateNode,En=!1;break e;case 3:tr=w.stateNode.containerInfo,En=!0;break e;case 4:tr=w.stateNode.containerInfo,En=!0;break e}w=w.return}if(tr===null)throw Error(p(160));Lc(s,f,i),tr=null,En=!1;var b=i.alternate;b!==null&&(b.return=null),i.return=null}catch(R){Et(i,t,R)}}if(t.subtreeFlags&12854)for(t=t.child;t!==null;)Rc(t,e),t=t.sibling}function Rc(e,t){var r=e.alternate,n=e.flags;switch(e.tag){case 0:case 11:case 14:case 15:if(Nn(t,e),Hn(e),n&4){try{Xi(3,e,e.return),$l(3,e)}catch(je){Et(e,e.return,je)}try{Xi(5,e,e.return)}catch(je){Et(e,e.return,je)}}break;case 1:Nn(t,e),Hn(e),n&512&&r!==null&&xi(r,r.return);break;case 5:if(Nn(t,e),Hn(e),n&512&&r!==null&&xi(r,r.return),e.flags&32){var i=e.stateNode;try{Rr(i,"")}catch(je){Et(e,e.return,je)}}if(n&4&&(i=e.stateNode,i!=null)){var s=e.memoizedProps,f=r!==null?r.memoizedProps:s,w=e.type,b=e.updateQueue;if(e.updateQueue=null,b!==null)try{w==="input"&&s.type==="radio"&&s.name!=null&&yr(i,s),Rn(w,f);var R=Rn(w,s);for(f=0;f<b.length;f+=2){var K=b[f],J=b[f+1];K==="style"?Fn(i,J):K==="dangerouslySetInnerHTML"?hn(i,J):K==="children"?Rr(i,J):Ke(i,K,J,R)}switch(w){case"input":Tn(i,s);break;case"textarea":Mn(i,s);break;case"select":var Q=i._wrapperState.wasMultiple;i._wrapperState.wasMultiple=!!s.multiple;var xe=s.value;xe!=null?Lr(i,!!s.multiple,xe,!1):Q!==!!s.multiple&&(s.defaultValue!=null?Lr(i,!!s.multiple,s.defaultValue,!0):Lr(i,!!s.multiple,s.multiple?[]:"",!1))}i[$i]=s}catch(je){Et(e,e.return,je)}}break;case 6:if(Nn(t,e),Hn(e),n&4){if(e.stateNode===null)throw Error(p(162));i=e.stateNode,s=e.memoizedProps;try{i.nodeValue=s}catch(je){Et(e,e.return,je)}}break;case 3:if(Nn(t,e),Hn(e),n&4&&r!==null&&r.memoizedState.isDehydrated)try{xt(t.containerInfo)}catch(je){Et(e,e.return,je)}break;case 4:Nn(t,e),Hn(e);break;case 13:Nn(t,e),Hn(e),i=e.child,i.flags&8192&&(s=i.memoizedState!==null,i.stateNode.isHidden=s,!s||i.alternate!==null&&i.alternate.memoizedState!==null||(Ss=ot())),n&4&&Fc(e);break;case 22:if(K=r!==null&&r.memoizedState!==null,e.mode&1?(fr=(R=fr)||K,Nn(t,e),fr=R):Nn(t,e),Hn(e),n&8192){if(R=e.memoizedState!==null,(e.stateNode.isHidden=R)&&!K&&(e.mode&1)!==0)for(we=e,K=e.child;K!==null;){for(J=we=K;we!==null;){switch(Q=we,xe=Q.child,Q.tag){case 0:case 11:case 14:case 15:Xi(4,Q,Q.return);break;case 1:xi(Q,Q.return);var be=Q.stateNode;if(typeof be.componentWillUnmount=="function"){n=Q,r=Q.return;try{t=n,be.props=t.memoizedProps,be.state=t.memoizedState,be.componentWillUnmount()}catch(je){Et(n,r,je)}}break;case 5:xi(Q,Q.return);break;case 22:if(Q.memoizedState!==null){Dc(J);continue}}xe!==null?(xe.return=Q,we=xe):Dc(J)}K=K.sibling}e:for(K=null,J=e;;){if(J.tag===5){if(K===null){K=J;try{i=J.stateNode,R?(s=i.style,typeof s.setProperty=="function"?s.setProperty("display","none","important"):s.display="none"):(w=J.stateNode,b=J.memoizedProps.style,f=b!=null&&b.hasOwnProperty("display")?b.display:null,w.style.display=Ir("display",f))}catch(je){Et(e,e.return,je)}}}else if(J.tag===6){if(K===null)try{J.stateNode.nodeValue=R?"":J.memoizedProps}catch(je){Et(e,e.return,je)}}else if((J.tag!==22&&J.tag!==23||J.memoizedState===null||J===e)&&J.child!==null){J.child.return=J,J=J.child;continue}if(J===e)break e;for(;J.sibling===null;){if(J.return===null||J.return===e)break e;K===J&&(K=null),J=J.return}K===J&&(K=null),J.sibling.return=J.return,J=J.sibling}}break;case 19:Nn(t,e),Hn(e),n&4&&Fc(e);break;case 21:break;default:Nn(t,e),Hn(e)}}function Hn(e){var t=e.flags;if(t&2){try{e:{for(var r=e.return;r!==null;){if(Tc(r)){var n=r;break e}r=r.return}throw Error(p(160))}switch(n.tag){case 5:var i=n.stateNode;n.flags&32&&(Rr(i,""),n.flags&=-33);var s=Mc(e);ks(e,s,i);break;case 3:case 4:var f=n.stateNode.containerInfo,w=Mc(e);ws(e,w,f);break;default:throw Error(p(161))}}catch(b){Et(e,e.return,b)}e.flags&=-3}t&4096&&(e.flags&=-4097)}function _p(e,t,r){we=e,Ic(e)}function Ic(e,t,r){for(var n=(e.mode&1)!==0;we!==null;){var i=we,s=i.child;if(i.tag===22&&n){var f=i.memoizedState!==null||Bl;if(!f){var w=i.alternate,b=w!==null&&w.memoizedState!==null||fr;w=Bl;var R=fr;if(Bl=f,(fr=b)&&!R)for(we=i;we!==null;)f=we,b=f.child,f.tag===22&&f.memoizedState!==null?Bc(i):b!==null?(b.return=f,we=b):Bc(i);for(;s!==null;)we=s,Ic(s),s=s.sibling;we=i,Bl=w,fr=R}Oc(e)}else(i.subtreeFlags&8772)!==0&&s!==null?(s.return=i,we=s):Oc(e)}}function Oc(e){for(;we!==null;){var t=we;if((t.flags&8772)!==0){var r=t.alternate;try{if((t.flags&8772)!==0)switch(t.tag){case 0:case 11:case 15:fr||$l(5,t);break;case 1:var n=t.stateNode;if(t.flags&4&&!fr)if(r===null)n.componentDidMount();else{var i=t.elementType===t.type?r.memoizedProps:Cn(t.type,r.memoizedProps);n.componentDidUpdate(i,r.memoizedState,n.__reactInternalSnapshotBeforeUpdate)}var s=t.updateQueue;s!==null&&Du(t,s,n);break;case 3:var f=t.updateQueue;if(f!==null){if(r=null,t.child!==null)switch(t.child.tag){case 5:r=t.child.stateNode;break;case 1:r=t.child.stateNode}Du(t,f,r)}break;case 5:var w=t.stateNode;if(r===null&&t.flags&4){r=w;var b=t.memoizedProps;switch(t.type){case"button":case"input":case"select":case"textarea":b.autoFocus&&r.focus();break;case"img":b.src&&(r.src=b.src)}}break;case 6:break;case 4:break;case 12:break;case 13:if(t.memoizedState===null){var R=t.alternate;if(R!==null){var K=R.memoizedState;if(K!==null){var J=K.dehydrated;J!==null&&xt(J)}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;default:throw Error(p(163))}fr||t.flags&512&&ys(t)}catch(Q){Et(t,t.return,Q)}}if(t===e){we=null;break}if(r=t.sibling,r!==null){r.return=t.return,we=r;break}we=t.return}}function Dc(e){for(;we!==null;){var t=we;if(t===e){we=null;break}var r=t.sibling;if(r!==null){r.return=t.return,we=r;break}we=t.return}}function Bc(e){for(;we!==null;){var t=we;try{switch(t.tag){case 0:case 11:case 15:var r=t.return;try{$l(4,t)}catch(b){Et(t,r,b)}break;case 1:var n=t.stateNode;if(typeof n.componentDidMount=="function"){var i=t.return;try{n.componentDidMount()}catch(b){Et(t,i,b)}}var s=t.return;try{ys(t)}catch(b){Et(t,s,b)}break;case 5:var f=t.return;try{ys(t)}catch(b){Et(t,f,b)}}}catch(b){Et(t,t.return,b)}if(t===e){we=null;break}var w=t.sibling;if(w!==null){w.return=t.return,we=w;break}we=t.return}}var Tp=Math.ceil,Al=Te.ReactCurrentDispatcher,bs=Te.ReactCurrentOwner,dn=Te.ReactCurrentBatchConfig,nt=0,Qt=null,It=null,rr=0,Wr=0,vi=mo(0),Bt=0,Zi=null,Ao=0,Ul=0,zs=0,Ji=null,Nr=null,Ss=0,yi=1/0,lo=null,Hl=!1,js=null,ko=null,Wl=!1,bo=null,Vl=0,el=0,Cs=null,Ql=-1,Yl=0;function vr(){return(nt&6)!==0?ot():Ql!==-1?Ql:Ql=ot()}function zo(e){return(e.mode&1)===0?1:(nt&2)!==0&&rr!==0?rr&-rr:hp.transition!==null?(Yl===0&&(Yl=y()),Yl):(e=se,e!==0||(e=window.event,e=e===void 0?16:ji(e.type)),e)}function Pn(e,t,r,n){if(50<el)throw el=0,Cs=null,Error(p(185));E(e,r,n),((nt&2)===0||e!==Qt)&&(e===Qt&&((nt&2)===0&&(Ul|=r),Bt===4&&So(e,rr)),Pr(e,n),r===1&&nt===0&&(t.mode&1)===0&&(yi=ot()+500,kl&&xo()))}function Pr(e,t){var r=e.callbackNode;d(e,t);var n=ln(e,e===Qt?rr:0);if(n===0)r!==null&&tn(r),e.callbackNode=null,e.callbackPriority=0;else if(t=n&-n,e.callbackPriority!==t){if(r!=null&&tn(r),t===1)e.tag===0?fp(Ac.bind(null,e)):Cu(Ac.bind(null,e)),up(function(){(nt&6)===0&&xo()}),r=null;else{switch(Fe(n)){case 1:r=wn;break;case 4:r=kn;break;case 16:r=rn;break;case 536870912:r=Br;break;default:r=rn}r=Gc(r,$c.bind(null,e))}e.callbackPriority=t,e.callbackNode=r}}function $c(e,t){if(Ql=-1,Yl=0,(nt&6)!==0)throw Error(p(327));var r=e.callbackNode;if(wi()&&e.callbackNode!==r)return null;var n=ln(e,e===Qt?rr:0);if(n===0)return null;if((n&30)!==0||(n&e.expiredLanes)!==0||t)t=Kl(e,n);else{t=n;var i=nt;nt|=2;var s=Hc();(Qt!==e||rr!==t)&&(lo=null,yi=ot()+500,Ho(e,t));do try{Fp();break}catch(w){Uc(e,w)}while(!0);Wa(),Al.current=s,nt=i,It!==null?t=0:(Qt=null,rr=0,t=Bt)}if(t!==0){if(t===2&&(i=g(e),i!==0&&(n=i,t=Es(e,i))),t===1)throw r=Zi,Ho(e,0),So(e,n),Pr(e,ot()),r;if(t===6)So(e,n);else{if(i=e.current.alternate,(n&30)===0&&!Mp(i)&&(t=Kl(e,n),t===2&&(s=g(e),s!==0&&(n=s,t=Es(e,s))),t===1))throw r=Zi,Ho(e,0),So(e,n),Pr(e,ot()),r;switch(e.finishedWork=i,e.finishedLanes=n,t){case 0:case 1:throw Error(p(345));case 2:Wo(e,Nr,lo);break;case 3:if(So(e,n),(n&130023424)===n&&(t=Ss+500-ot(),10<t)){if(ln(e,0)!==0)break;if(i=e.suspendedLanes,(i&n)!==n){vr(),e.pingedLanes|=e.suspendedLanes&i;break}e.timeoutHandle=La(Wo.bind(null,e,Nr,lo),t);break}Wo(e,Nr,lo);break;case 4:if(So(e,n),(n&4194240)===n)break;for(t=e.eventTimes,i=-1;0<n;){var f=31-Ct(n);s=1<<f,f=t[f],f>i&&(i=f),n&=~s}if(n=i,n=ot()-n,n=(120>n?120:480>n?480:1080>n?1080:1920>n?1920:3e3>n?3e3:4320>n?4320:1960*Tp(n/1960))-n,10<n){e.timeoutHandle=La(Wo.bind(null,e,Nr,lo),n);break}Wo(e,Nr,lo);break;case 5:Wo(e,Nr,lo);break;default:throw Error(p(329))}}}return Pr(e,ot()),e.callbackNode===r?$c.bind(null,e):null}function Es(e,t){var r=Ji;return e.current.memoizedState.isDehydrated&&(Ho(e,t).flags|=256),e=Kl(e,t),e!==2&&(t=Nr,Nr=r,t!==null&&Ns(t)),e}function Ns(e){Nr===null?Nr=e:Nr.push.apply(Nr,e)}function Mp(e){for(var t=e;;){if(t.flags&16384){var r=t.updateQueue;if(r!==null&&(r=r.stores,r!==null))for(var n=0;n<r.length;n++){var i=r[n],s=i.getSnapshot;i=i.value;try{if(!Sn(s(),i))return!1}catch{return!1}}}if(r=t.child,t.subtreeFlags&16384&&r!==null)r.return=t,t=r;else{if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return!0;t=t.return}t.sibling.return=t.return,t=t.sibling}}return!0}function So(e,t){for(t&=~zs,t&=~Ul,e.suspendedLanes|=t,e.pingedLanes&=~t,e=e.expirationTimes;0<t;){var r=31-Ct(t),n=1<<r;e[r]=-1,t&=~n}}function Ac(e){if((nt&6)!==0)throw Error(p(327));wi();var t=ln(e,0);if((t&1)===0)return Pr(e,ot()),null;var r=Kl(e,t);if(e.tag!==0&&r===2){var n=g(e);n!==0&&(t=n,r=Es(e,n))}if(r===1)throw r=Zi,Ho(e,0),So(e,t),Pr(e,ot()),r;if(r===6)throw Error(p(345));return e.finishedWork=e.current.alternate,e.finishedLanes=t,Wo(e,Nr,lo),Pr(e,ot()),null}function Ps(e,t){var r=nt;nt|=1;try{return e(t)}finally{nt=r,nt===0&&(yi=ot()+500,kl&&xo())}}function Uo(e){bo!==null&&bo.tag===0&&(nt&6)===0&&wi();var t=nt;nt|=1;var r=dn.transition,n=se;try{if(dn.transition=null,se=1,e)return e()}finally{se=n,dn.transition=r,nt=t,(nt&6)===0&&xo()}}function _s(){Wr=vi.current,yt(vi)}function Ho(e,t){e.finishedWork=null,e.finishedLanes=0;var r=e.timeoutHandle;if(r!==-1&&(e.timeoutHandle=-1,sp(r)),It!==null)for(r=It.return;r!==null;){var n=r;switch(Ba(n),n.tag){case 1:n=n.type.childContextTypes,n!=null&&yl();break;case 3:mi(),yt(jr),yt(cr),Za();break;case 5:qa(n);break;case 4:mi();break;case 13:yt(zt);break;case 19:yt(zt);break;case 10:Va(n.type._context);break;case 22:case 23:_s()}r=r.return}if(Qt=e,It=e=jo(e.current,null),rr=Wr=t,Bt=0,Zi=null,zs=Ul=Ao=0,Nr=Ji=null,Do!==null){for(t=0;t<Do.length;t++)if(r=Do[t],n=r.interleaved,n!==null){r.interleaved=null;var i=n.next,s=r.pending;if(s!==null){var f=s.next;s.next=i,n.next=f}r.pending=n}Do=null}return e}function Uc(e,t){do{var r=It;try{if(Wa(),Tl.current=Rl,Ml){for(var n=St.memoizedState;n!==null;){var i=n.queue;i!==null&&(i.pending=null),n=n.next}Ml=!1}if($o=0,Vt=Dt=St=null,Qi=!1,Yi=0,bs.current=null,r===null||r.return===null){Bt=1,Zi=t,It=null;break}e:{var s=e,f=r.return,w=r,b=t;if(t=rr,w.flags|=32768,b!==null&&typeof b=="object"&&typeof b.then=="function"){var R=b,K=w,J=K.tag;if((K.mode&1)===0&&(J===0||J===11||J===15)){var Q=K.alternate;Q?(K.updateQueue=Q.updateQueue,K.memoizedState=Q.memoizedState,K.lanes=Q.lanes):(K.updateQueue=null,K.memoizedState=null)}var xe=fc(f);if(xe!==null){xe.flags&=-257,hc(xe,f,w,s,t),xe.mode&1&&pc(s,R,t),t=xe,b=R;var be=t.updateQueue;if(be===null){var je=new Set;je.add(b),t.updateQueue=je}else be.add(b);break e}else{if((t&1)===0){pc(s,R,t),Ts();break e}b=Error(p(426))}}else if(kt&&w.mode&1){var Mt=fc(f);if(Mt!==null){(Mt.flags&65536)===0&&(Mt.flags|=256),hc(Mt,f,w,s,t),Ua(gi(b,w));break e}}s=b=gi(b,w),Bt!==4&&(Bt=2),Ji===null?Ji=[s]:Ji.push(s),s=f;do{switch(s.tag){case 3:s.flags|=65536,t&=-t,s.lanes|=t;var N=cc(s,b,t);Ou(s,N);break e;case 1:w=b;var S=s.type,T=s.stateNode;if((s.flags&128)===0&&(typeof S.getDerivedStateFromError=="function"||T!==null&&typeof T.componentDidCatch=="function"&&(ko===null||!ko.has(T)))){s.flags|=65536,t&=-t,s.lanes|=t;var oe=dc(s,w,t);Ou(s,oe);break e}}s=s.return}while(s!==null)}Vc(r)}catch(Ne){t=Ne,It===r&&r!==null&&(It=r=r.return);continue}break}while(!0)}function Hc(){var e=Al.current;return Al.current=Rl,e===null?Rl:e}function Ts(){(Bt===0||Bt===3||Bt===2)&&(Bt=4),Qt===null||(Ao&268435455)===0&&(Ul&268435455)===0||So(Qt,rr)}function Kl(e,t){var r=nt;nt|=2;var n=Hc();(Qt!==e||rr!==t)&&(lo=null,Ho(e,t));do try{Lp();break}catch(i){Uc(e,i)}while(!0);if(Wa(),nt=r,Al.current=n,It!==null)throw Error(p(261));return Qt=null,rr=0,Bt}function Lp(){for(;It!==null;)Wc(It)}function Fp(){for(;It!==null&&!On();)Wc(It)}function Wc(e){var t=Kc(e.alternate,e,Wr);e.memoizedProps=e.pendingProps,t===null?Vc(e):It=t,bs.current=null}function Vc(e){var t=e;do{var r=t.alternate;if(e=t.return,(t.flags&32768)===0){if(r=Cp(r,t,Wr),r!==null){It=r;return}}else{if(r=Ep(r,t),r!==null){r.flags&=32767,It=r;return}if(e!==null)e.flags|=32768,e.subtreeFlags=0,e.deletions=null;else{Bt=6,It=null;return}}if(t=t.sibling,t!==null){It=t;return}It=t=e}while(t!==null);Bt===0&&(Bt=5)}function Wo(e,t,r){var n=se,i=dn.transition;try{dn.transition=null,se=1,Rp(e,t,r,n)}finally{dn.transition=i,se=n}return null}function Rp(e,t,r,n){do wi();while(bo!==null);if((nt&6)!==0)throw Error(p(327));r=e.finishedWork;var i=e.finishedLanes;if(r===null)return null;if(e.finishedWork=null,e.finishedLanes=0,r===e.current)throw Error(p(177));e.callbackNode=null,e.callbackPriority=0;var s=r.lanes|r.childLanes;if(D(e,s),e===Qt&&(It=Qt=null,rr=0),(r.subtreeFlags&2064)===0&&(r.flags&2064)===0||Wl||(Wl=!0,Gc(rn,function(){return wi(),null})),s=(r.flags&15990)!==0,(r.subtreeFlags&15990)!==0||s){s=dn.transition,dn.transition=null;var f=se;se=1;var w=nt;nt|=4,bs.current=null,Pp(e,r),Rc(r,e),tp(Ta),sr=!!_a,Ta=_a=null,e.current=r,_p(r),Vn(),nt=w,se=f,dn.transition=s}else e.current=r;if(Wl&&(Wl=!1,bo=e,Vl=i),s=e.pendingLanes,s===0&&(ko=null),$r(r.stateNode),Pr(e,ot()),t!==null)for(n=e.onRecoverableError,r=0;r<t.length;r++)i=t[r],n(i.value,{componentStack:i.stack,digest:i.digest});if(Hl)throw Hl=!1,e=js,js=null,e;return(Vl&1)!==0&&e.tag!==0&&wi(),s=e.pendingLanes,(s&1)!==0?e===Cs?el++:(el=0,Cs=e):el=0,xo(),null}function wi(){if(bo!==null){var e=Fe(Vl),t=dn.transition,r=se;try{if(dn.transition=null,se=16>e?16:e,bo===null)var n=!1;else{if(e=bo,bo=null,Vl=0,(nt&6)!==0)throw Error(p(331));var i=nt;for(nt|=4,we=e.current;we!==null;){var s=we,f=s.child;if((we.flags&16)!==0){var w=s.deletions;if(w!==null){for(var b=0;b<w.length;b++){var R=w[b];for(we=R;we!==null;){var K=we;switch(K.tag){case 0:case 11:case 15:Xi(8,K,s)}var J=K.child;if(J!==null)J.return=K,we=J;else for(;we!==null;){K=we;var Q=K.sibling,xe=K.return;if(_c(K),K===R){we=null;break}if(Q!==null){Q.return=xe,we=Q;break}we=xe}}}var be=s.alternate;if(be!==null){var je=be.child;if(je!==null){be.child=null;do{var Mt=je.sibling;je.sibling=null,je=Mt}while(je!==null)}}we=s}}if((s.subtreeFlags&2064)!==0&&f!==null)f.return=s,we=f;else e:for(;we!==null;){if(s=we,(s.flags&2048)!==0)switch(s.tag){case 0:case 11:case 15:Xi(9,s,s.return)}var N=s.sibling;if(N!==null){N.return=s.return,we=N;break e}we=s.return}}var S=e.current;for(we=S;we!==null;){f=we;var T=f.child;if((f.subtreeFlags&2064)!==0&&T!==null)T.return=f,we=T;else e:for(f=S;we!==null;){if(w=we,(w.flags&2048)!==0)try{switch(w.tag){case 0:case 11:case 15:$l(9,w)}}catch(Ne){Et(w,w.return,Ne)}if(w===f){we=null;break e}var oe=w.sibling;if(oe!==null){oe.return=w.return,we=oe;break e}we=w.return}}if(nt=i,xo(),Xt&&typeof Xt.onPostCommitFiberRoot=="function")try{Xt.onPostCommitFiberRoot(mr,e)}catch{}n=!0}return n}finally{se=r,dn.transition=t}}return!1}function Qc(e,t,r){t=gi(r,t),t=cc(e,t,1),e=yo(e,t,1),t=vr(),e!==null&&(E(e,1,t),Pr(e,t))}function Et(e,t,r){if(e.tag===3)Qc(e,e,r);else for(;t!==null;){if(t.tag===3){Qc(t,e,r);break}else if(t.tag===1){var n=t.stateNode;if(typeof t.type.getDerivedStateFromError=="function"||typeof n.componentDidCatch=="function"&&(ko===null||!ko.has(n))){e=gi(r,e),e=dc(t,e,1),t=yo(t,e,1),e=vr(),t!==null&&(E(t,1,e),Pr(t,e));break}}t=t.return}}function Ip(e,t,r){var n=e.pingCache;n!==null&&n.delete(t),t=vr(),e.pingedLanes|=e.suspendedLanes&r,Qt===e&&(rr&r)===r&&(Bt===4||Bt===3&&(rr&130023424)===rr&&500>ot()-Ss?Ho(e,0):zs|=r),Pr(e,t)}function Yc(e,t){t===0&&((e.mode&1)===0?t=1:(t=bn,bn<<=1,(bn&130023424)===0&&(bn=4194304)));var r=vr();e=no(e,t),e!==null&&(E(e,t,r),Pr(e,r))}function Op(e){var t=e.memoizedState,r=0;t!==null&&(r=t.retryLane),Yc(e,r)}function Dp(e,t){var r=0;switch(e.tag){case 13:var n=e.stateNode,i=e.memoizedState;i!==null&&(r=i.retryLane);break;case 19:n=e.stateNode;break;default:throw Error(p(314))}n!==null&&n.delete(t),Yc(e,r)}var Kc;Kc=function(e,t,r){if(e!==null)if(e.memoizedProps!==t.pendingProps||jr.current)Er=!0;else{if((e.lanes&r)===0&&(t.flags&128)===0)return Er=!1,jp(e,t,r);Er=(e.flags&131072)!==0}else Er=!1,kt&&(t.flags&1048576)!==0&&Eu(t,zl,t.index);switch(t.lanes=0,t.tag){case 2:var n=t.type;Dl(e,t),e=t.pendingProps;var i=si(t,cr.current);hi(t,r),i=ts(null,t,n,e,i,r);var s=rs();return t.flags|=1,typeof i=="object"&&i!==null&&typeof i.render=="function"&&i.$$typeof===void 0?(t.tag=1,t.memoizedState=null,t.updateQueue=null,Cr(n)?(s=!0,wl(t)):s=!1,t.memoizedState=i.state!==null&&i.state!==void 0?i.state:null,Ka(t),i.updater=Il,t.stateNode=i,i._reactInternals=t,ss(t,n,e,r),t=ps(null,t,n,!0,s,r)):(t.tag=0,kt&&s&&Da(t),xr(null,t,i,r),t=t.child),t;case 16:n=t.elementType;e:{switch(Dl(e,t),e=t.pendingProps,i=n._init,n=i(n._payload),t.type=n,i=t.tag=$p(n),e=Cn(n,e),i){case 0:t=ds(null,t,n,e,r);break e;case 1:t=wc(null,t,n,e,r);break e;case 11:t=mc(null,t,n,e,r);break e;case 14:t=gc(null,t,n,Cn(n.type,e),r);break e}throw Error(p(306,n,""))}return t;case 0:return n=t.type,i=t.pendingProps,i=t.elementType===n?i:Cn(n,i),ds(e,t,n,i,r);case 1:return n=t.type,i=t.pendingProps,i=t.elementType===n?i:Cn(n,i),wc(e,t,n,i,r);case 3:e:{if(kc(t),e===null)throw Error(p(387));n=t.pendingProps,s=t.memoizedState,i=s.element,Iu(e,t),Pl(t,n,null,r);var f=t.memoizedState;if(n=f.element,s.isDehydrated)if(s={element:n,isDehydrated:!1,cache:f.cache,pendingSuspenseBoundaries:f.pendingSuspenseBoundaries,transitions:f.transitions},t.updateQueue.baseState=s,t.memoizedState=s,t.flags&256){i=gi(Error(p(423)),t),t=bc(e,t,n,r,i);break e}else if(n!==i){i=gi(Error(p(424)),t),t=bc(e,t,n,r,i);break e}else for(Hr=ho(t.stateNode.containerInfo.firstChild),Ur=t,kt=!0,jn=null,r=Fu(t,null,n,r),t.child=r;r;)r.flags=r.flags&-3|4096,r=r.sibling;else{if(di(),n===i){t=io(e,t,r);break e}xr(e,t,n,r)}t=t.child}return t;case 5:return Bu(t),e===null&&Aa(t),n=t.type,i=t.pendingProps,s=e!==null?e.memoizedProps:null,f=i.children,Ma(n,i)?f=null:s!==null&&Ma(n,s)&&(t.flags|=32),yc(e,t),xr(e,t,f,r),t.child;case 6:return e===null&&Aa(t),null;case 13:return zc(e,t,r);case 4:return Ga(t,t.stateNode.containerInfo),n=t.pendingProps,e===null?t.child=pi(t,null,n,r):xr(e,t,n,r),t.child;case 11:return n=t.type,i=t.pendingProps,i=t.elementType===n?i:Cn(n,i),mc(e,t,n,i,r);case 7:return xr(e,t,t.pendingProps,r),t.child;case 8:return xr(e,t,t.pendingProps.children,r),t.child;case 12:return xr(e,t,t.pendingProps.children,r),t.child;case 10:e:{if(n=t.type._context,i=t.pendingProps,s=t.memoizedProps,f=i.value,mt(Cl,n._currentValue),n._currentValue=f,s!==null)if(Sn(s.value,f)){if(s.children===i.children&&!jr.current){t=io(e,t,r);break e}}else for(s=t.child,s!==null&&(s.return=t);s!==null;){var w=s.dependencies;if(w!==null){f=s.child;for(var b=w.firstContext;b!==null;){if(b.context===n){if(s.tag===1){b=oo(-1,r&-r),b.tag=2;var R=s.updateQueue;if(R!==null){R=R.shared;var K=R.pending;K===null?b.next=b:(b.next=K.next,K.next=b),R.pending=b}}s.lanes|=r,b=s.alternate,b!==null&&(b.lanes|=r),Qa(s.return,r,t),w.lanes|=r;break}b=b.next}}else if(s.tag===10)f=s.type===t.type?null:s.child;else if(s.tag===18){if(f=s.return,f===null)throw Error(p(341));f.lanes|=r,w=f.alternate,w!==null&&(w.lanes|=r),Qa(f,r,t),f=s.sibling}else f=s.child;if(f!==null)f.return=s;else for(f=s;f!==null;){if(f===t){f=null;break}if(s=f.sibling,s!==null){s.return=f.return,f=s;break}f=f.return}s=f}xr(e,t,i.children,r),t=t.child}return t;case 9:return i=t.type,n=t.pendingProps.children,hi(t,r),i=un(i),n=n(i),t.flags|=1,xr(e,t,n,r),t.child;case 14:return n=t.type,i=Cn(n,t.pendingProps),i=Cn(n.type,i),gc(e,t,n,i,r);case 15:return xc(e,t,t.type,t.pendingProps,r);case 17:return n=t.type,i=t.pendingProps,i=t.elementType===n?i:Cn(n,i),Dl(e,t),t.tag=1,Cr(n)?(e=!0,wl(t)):e=!1,hi(t,r),sc(t,n,i),ss(t,n,i,r),ps(null,t,n,!0,e,r);case 19:return jc(e,t,r);case 22:return vc(e,t,r)}throw Error(p(156,t.tag))};function Gc(e,t){return Wt(e,t)}function Bp(e,t,r,n){this.tag=e,this.key=r,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.ref=null,this.pendingProps=t,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=n,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function pn(e,t,r,n){return new Bp(e,t,r,n)}function Ms(e){return e=e.prototype,!(!e||!e.isReactComponent)}function $p(e){if(typeof e=="function")return Ms(e)?1:0;if(e!=null){if(e=e.$$typeof,e===q)return 11;if(e===le)return 14}return 2}function jo(e,t){var r=e.alternate;return r===null?(r=pn(e.tag,t,e.key,e.mode),r.elementType=e.elementType,r.type=e.type,r.stateNode=e.stateNode,r.alternate=e,e.alternate=r):(r.pendingProps=t,r.type=e.type,r.flags=0,r.subtreeFlags=0,r.deletions=null),r.flags=e.flags&14680064,r.childLanes=e.childLanes,r.lanes=e.lanes,r.child=e.child,r.memoizedProps=e.memoizedProps,r.memoizedState=e.memoizedState,r.updateQueue=e.updateQueue,t=e.dependencies,r.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext},r.sibling=e.sibling,r.index=e.index,r.ref=e.ref,r}function Gl(e,t,r,n,i,s){var f=2;if(n=e,typeof e=="function")Ms(e)&&(f=1);else if(typeof e=="string")f=5;else e:switch(e){case ve:return Vo(r.children,i,s,t);case Ge:f=8,i|=8;break;case Se:return e=pn(12,r,t,i|2),e.elementType=Se,e.lanes=s,e;case me:return e=pn(13,r,t,i),e.elementType=me,e.lanes=s,e;case O:return e=pn(19,r,t,i),e.elementType=O,e.lanes=s,e;case Be:return ql(r,i,s,t);default:if(typeof e=="object"&&e!==null)switch(e.$$typeof){case lt:f=10;break e;case Je:f=9;break e;case q:f=11;break e;case le:f=14;break e;case Le:f=16,n=null;break e}throw Error(p(130,e==null?e:typeof e,""))}return t=pn(f,r,t,i),t.elementType=e,t.type=n,t.lanes=s,t}function Vo(e,t,r,n){return e=pn(7,e,n,t),e.lanes=r,e}function ql(e,t,r,n){return e=pn(22,e,n,t),e.elementType=Be,e.lanes=r,e.stateNode={isHidden:!1},e}function Ls(e,t,r){return e=pn(6,e,null,t),e.lanes=r,e}function Fs(e,t,r){return t=pn(4,e.children!==null?e.children:[],e.key,t),t.lanes=r,t.stateNode={containerInfo:e.containerInfo,pendingChildren:null,implementation:e.implementation},t}function Ap(e,t,r,n,i){this.tag=t,this.containerInfo=e,this.finishedWork=this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.pendingContext=this.context=null,this.callbackPriority=0,this.eventTimes=_(0),this.expirationTimes=_(-1),this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=_(0),this.identifierPrefix=n,this.onRecoverableError=i,this.mutableSourceEagerHydrationData=null}function Rs(e,t,r,n,i,s,f,w,b){return e=new Ap(e,t,r,w,b),t===1?(t=1,s===!0&&(t|=8)):t=0,s=pn(3,null,null,t),e.current=s,s.stateNode=e,s.memoizedState={element:n,isDehydrated:r,cache:null,transitions:null,pendingSuspenseBoundaries:null},Ka(s),e}function Up(e,t,r){var n=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:ke,key:n==null?null:""+n,children:e,containerInfo:t,implementation:r}}function qc(e){if(!e)return go;e=e._reactInternals;e:{if(ar(e)!==e||e.tag!==1)throw Error(p(170));var t=e;do{switch(t.tag){case 3:t=t.stateNode.context;break e;case 1:if(Cr(t.type)){t=t.stateNode.__reactInternalMemoizedMergedChildContext;break e}}t=t.return}while(t!==null);throw Error(p(171))}if(e.tag===1){var r=e.type;if(Cr(r))return Su(e,r,t)}return t}function Xc(e,t,r,n,i,s,f,w,b){return e=Rs(r,n,!0,e,i,s,f,w,b),e.context=qc(null),r=e.current,n=vr(),i=zo(r),s=oo(n,i),s.callback=t??null,yo(r,s,i),e.current.lanes=i,E(e,i,n),Pr(e,n),e}function Xl(e,t,r,n){var i=t.current,s=vr(),f=zo(i);return r=qc(r),t.context===null?t.context=r:t.pendingContext=r,t=oo(s,f),t.payload={element:e},n=n===void 0?null:n,n!==null&&(t.callback=n),e=yo(i,t,f),e!==null&&(Pn(e,i,f,s),Nl(e,i,f)),f}function Zl(e){if(e=e.current,!e.child)return null;switch(e.child.tag){case 5:return e.child.stateNode;default:return e.child.stateNode}}function Zc(e,t){if(e=e.memoizedState,e!==null&&e.dehydrated!==null){var r=e.retryLane;e.retryLane=r!==0&&r<t?r:t}}function Is(e,t){Zc(e,t),(e=e.alternate)&&Zc(e,t)}function Hp(){return null}var Jc=typeof reportError=="function"?reportError:function(e){console.error(e)};function Os(e){this._internalRoot=e}Jl.prototype.render=Os.prototype.render=function(e){var t=this._internalRoot;if(t===null)throw Error(p(409));Xl(e,t,null,null)},Jl.prototype.unmount=Os.prototype.unmount=function(){var e=this._internalRoot;if(e!==null){this._internalRoot=null;var t=e.containerInfo;Uo(function(){Xl(null,e,null,null)}),t[Jn]=null}};function Jl(e){this._internalRoot=e}Jl.prototype.unstable_scheduleHydration=function(e){if(e){var t=Jt();e={blockedOn:null,target:e,priority:t};for(var r=0;r<Qe.length&&t!==0&&t<Qe[r].priority;r++);Qe.splice(r,0,e),r===0&&Rt(e)}};function Ds(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11)}function ea(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11&&(e.nodeType!==8||e.nodeValue!==" react-mount-point-unstable "))}function ed(){}function Wp(e,t,r,n,i){if(i){if(typeof n=="function"){var s=n;n=function(){var R=Zl(f);s.call(R)}}var f=Xc(t,n,e,0,null,!1,!1,"",ed);return e._reactRootContainer=f,e[Jn]=f.current,Di(e.nodeType===8?e.parentNode:e),Uo(),f}for(;i=e.lastChild;)e.removeChild(i);if(typeof n=="function"){var w=n;n=function(){var R=Zl(b);w.call(R)}}var b=Rs(e,0,!1,null,null,!1,!1,"",ed);return e._reactRootContainer=b,e[Jn]=b.current,Di(e.nodeType===8?e.parentNode:e),Uo(function(){Xl(t,b,r,n)}),b}function ta(e,t,r,n,i){var s=r._reactRootContainer;if(s){var f=s;if(typeof i=="function"){var w=i;i=function(){var b=Zl(f);w.call(b)}}Xl(t,f,e,i)}else f=Wp(r,t,e,i,n);return Zl(f)}$e=function(e){switch(e.tag){case 3:var t=e.stateNode;if(t.current.memoizedState.isDehydrated){var r=on(t.pendingLanes);r!==0&&(re(t,r|1),Pr(t,ot()),(nt&6)===0&&(yi=ot()+500,xo()))}break;case 13:Uo(function(){var n=no(e,1);if(n!==null){var i=vr();Pn(n,e,1,i)}}),Is(e,1)}},at=function(e){if(e.tag===13){var t=no(e,134217728);if(t!==null){var r=vr();Pn(t,e,134217728,r)}Is(e,134217728)}},Zt=function(e){if(e.tag===13){var t=zo(e),r=no(e,t);if(r!==null){var n=vr();Pn(r,e,t,n)}Is(e,t)}},Jt=function(){return se},x=function(e,t){var r=se;try{return se=e,t()}finally{se=r}},At=function(e,t,r){switch(t){case"input":if(Tn(e,r),t=r.name,r.type==="radio"&&t!=null){for(r=e;r.parentNode;)r=r.parentNode;for(r=r.querySelectorAll("input[name="+JSON.stringify(""+t)+'][type="radio"]'),t=0;t<r.length;t++){var n=r[t];if(n!==e&&n.form===e.form){var i=vl(n);if(!i)throw Error(p(90));Tr(n),Tn(n,i)}}}break;case"textarea":Mn(e,r);break;case"select":t=r.value,t!=null&&Lr(e,!!r.multiple,t,!1)}},Ht=Ps,Gt=Uo;var Vp={usingClientEntryPoint:!1,Events:[Ai,li,vl,Gr,qr,Ps]},tl={findFiberByHostInstance:Fo,bundleType:0,version:"18.3.1",rendererPackageName:"react-dom"},Qp={bundleType:tl.bundleType,version:tl.version,rendererPackageName:tl.rendererPackageName,rendererConfig:tl.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:Te.ReactCurrentDispatcher,findHostInstanceByFiber:function(e){return e=yn(e),e===null?null:e.stateNode},findFiberByHostInstance:tl.findFiberByHostInstance||Hp,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.3.1-next-f1338f8080-20240426"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var ra=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!ra.isDisabled&&ra.supportsFiber)try{mr=ra.inject(Qp),Xt=ra}catch{}}return _r.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=Vp,_r.createPortal=function(e,t){var r=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!Ds(t))throw Error(p(200));return Up(e,t,null,r)},_r.createRoot=function(e,t){if(!Ds(e))throw Error(p(299));var r=!1,n="",i=Jc;return t!=null&&(t.unstable_strictMode===!0&&(r=!0),t.identifierPrefix!==void 0&&(n=t.identifierPrefix),t.onRecoverableError!==void 0&&(i=t.onRecoverableError)),t=Rs(e,1,!1,null,null,r,!1,n,i),e[Jn]=t.current,Di(e.nodeType===8?e.parentNode:e),new Os(t)},_r.findDOMNode=function(e){if(e==null)return null;if(e.nodeType===1)return e;var t=e._reactInternals;if(t===void 0)throw typeof e.render=="function"?Error(p(188)):(e=Object.keys(e).join(","),Error(p(268,e)));return e=yn(t),e=e===null?null:e.stateNode,e},_r.flushSync=function(e){return Uo(e)},_r.hydrate=function(e,t,r){if(!ea(t))throw Error(p(200));return ta(null,e,t,!0,r)},_r.hydrateRoot=function(e,t,r){if(!Ds(e))throw Error(p(405));var n=r!=null&&r.hydratedSources||null,i=!1,s="",f=Jc;if(r!=null&&(r.unstable_strictMode===!0&&(i=!0),r.identifierPrefix!==void 0&&(s=r.identifierPrefix),r.onRecoverableError!==void 0&&(f=r.onRecoverableError)),t=Xc(t,null,e,1,r??null,i,!1,s,f),e[Jn]=t.current,Di(e),n)for(e=0;e<n.length;e++)r=n[e],i=r._getVersion,i=i(r._source),t.mutableSourceEagerHydrationData==null?t.mutableSourceEagerHydrationData=[r,i]:t.mutableSourceEagerHydrationData.push(r,i);return new Jl(t)},_r.render=function(e,t,r){if(!ea(t))throw Error(p(200));return ta(null,e,t,!1,r)},_r.unmountComponentAtNode=function(e){if(!ea(e))throw Error(p(40));return e._reactRootContainer?(Uo(function(){ta(null,null,e,!1,function(){e._reactRootContainer=null,e[Jn]=null})}),!0):!1},_r.unstable_batchedUpdates=Ps,_r.unstable_renderSubtreeIntoContainer=function(e,t,r,n){if(!ea(r))throw Error(p(200));if(e==null||e._reactInternals===void 0)throw Error(p(38));return ta(e,t,r,!1,n)},_r.version="18.3.1-next-f1338f8080-20240426",_r}var ud;function rf(){if(ud)return As.exports;ud=1;function u(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(u)}catch(h){console.error(h)}}return u(),As.exports=tf(),As.exports}var cd;function nf(){if(cd)return na;cd=1;var u=rf();return na.createRoot=u.createRoot,na.hydrateRoot=u.hydrateRoot,na}var of=nf();const lf=Ed(of),Nd="http://localhost:3000";async function Qr(u,h={}){let p;try{p=await fetch(`${Nd}${u}`,{headers:{"Content-Type":"application/json"},...h})}catch{const L=new Error("Network error. Please check your connection.");throw L.isNetworkError=!0,L}const j=await p.json().catch(()=>({}));if(!p.ok){const k=new Error(j.message||"Something went wrong. Please try again.");throw k.status=p.status,k.data=j.data,k}return j}const af=()=>Qr("/api/category/public"),dd=()=>Qr("/api/dish/public"),pd=()=>Qr("/api/deal/public"),sf=()=>Qr("/api/hero-slide/public"),uf=u=>Qr("/api/order/public/checkout",{method:"POST",body:JSON.stringify(u)}),fd=u=>Qr(`/api/order/public/${u}`),cf=u=>Qr(`/api/order/public/${u}/cancel`,{method:"PATCH"}),df=u=>Qr(`/api/order/public/lookup?phone=${encodeURIComponent(u)}`),hd=()=>Qr("/api/settings"),pf=(u=30)=>Qr(`/api/review/public?limit=${u}`),ff=u=>Qr("/api/review/public",{method:"POST",body:JSON.stringify(u)});async function hf(u){const h=new FormData;h.append("screenshot",u);let p;try{p=await fetch(`${Nd}/api/order/public/payment-proof`,{method:"POST",body:h})}catch{const k=new Error("Network error. Please check your connection and try again.");throw k.isNetworkError=!0,k}const j=await p.json().catch(()=>({}));if(!p.ok){const k=new Error(j.message||"Couldn't upload the screenshot. Please try again.");throw k.status=p.status,k}return j}const mf=()=>Qr("/api/branch/public"),gf=u=>Qr("/api/branch/public/quote",{method:"POST",body:JSON.stringify(u)}),xf="http://localhost:3000",_n=u=>u?u.startsWith("http://")||u.startsWith("https://")?u:u.startsWith("/uploads/")?`${xf}${u}`:u:"",zi="/assets/genz-pizza-land-logo-CQKpkaM4.jpg",vf="/assets/sindbad-solution-logo-DhhzzCiL.png",yf=`
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
`;var Pd={color:void 0,size:void 0,className:void 0,style:void 0,attr:void 0},md=Wn.createContext&&Wn.createContext(Pd),wf=["attr","size","title"];function kf(u,h){if(u==null)return{};var p,j,k=bf(u,h);if(Object.getOwnPropertySymbols){var L=Object.getOwnPropertySymbols(u);for(j=0;j<L.length;j++)p=L[j],h.indexOf(p)===-1&&{}.propertyIsEnumerable.call(u,p)&&(k[p]=u[p])}return k}function bf(u,h){if(u==null)return{};var p={};for(var j in u)if({}.hasOwnProperty.call(u,j)){if(h.indexOf(j)!==-1)continue;p[j]=u[j]}return p}function ha(){return ha=Object.assign?Object.assign.bind():function(u){for(var h=1;h<arguments.length;h++){var p=arguments[h];for(var j in p)({}).hasOwnProperty.call(p,j)&&(u[j]=p[j])}return u},ha.apply(null,arguments)}function gd(u,h){var p=Object.keys(u);if(Object.getOwnPropertySymbols){var j=Object.getOwnPropertySymbols(u);h&&(j=j.filter(function(k){return Object.getOwnPropertyDescriptor(u,k).enumerable})),p.push.apply(p,j)}return p}function ma(u){for(var h=1;h<arguments.length;h++){var p=arguments[h]!=null?arguments[h]:{};h%2?gd(Object(p),!0).forEach(function(j){zf(u,j,p[j])}):Object.getOwnPropertyDescriptors?Object.defineProperties(u,Object.getOwnPropertyDescriptors(p)):gd(Object(p)).forEach(function(j){Object.defineProperty(u,j,Object.getOwnPropertyDescriptor(p,j))})}return u}function zf(u,h,p){return(h=Sf(h))in u?Object.defineProperty(u,h,{value:p,enumerable:!0,configurable:!0,writable:!0}):u[h]=p,u}function Sf(u){var h=jf(u,"string");return typeof h=="symbol"?h:h+""}function jf(u,h){if(typeof u!="object"||!u)return u;var p=u[Symbol.toPrimitive];if(p!==void 0){var j=p.call(u,h);if(typeof j!="object")return j;throw new TypeError("@@toPrimitive must return a primitive value.")}return(h==="string"?String:Number)(u)}function _d(u){return u&&u.map((h,p)=>Wn.createElement(h.tag,ma({key:p},h.attr),_d(h.child)))}function Ve(u){return h=>Wn.createElement(Cf,ha({attr:ma({},u.attr)},h),_d(u.child))}function Cf(u){var h=p=>{var j=u.attr,k=u.size,L=u.title,ae=kf(u,wf),G=k||p.size||"1em",F;return p.className&&(F=p.className),u.className&&(F=(F?F+" ":"")+u.className),Wn.createElement("svg",ha({stroke:"currentColor",fill:"currentColor",strokeWidth:"0"},p.attr,j,ae,{className:F,style:ma(ma({color:u.color||p.color},p.style),u.style),height:G,width:G,xmlns:"http://www.w3.org/2000/svg"}),L&&Wn.createElement("title",null,L),u.children)};return md!==void 0?Wn.createElement(md.Consumer,null,p=>h(p)):h(Pd)}function Ef(u){return Ve({attr:{viewBox:"0 0 384 512"},child:[{tag:"path",attr:{d:"M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"},child:[]}]})(u)}function Nf(u){return Ve({attr:{viewBox:"0 0 320 512"},child:[{tag:"path",attr:{d:"M32.1 29.3C33.5 12.8 47.4 0 64 0L256 0c16.6 0 30.5 12.8 31.9 29.3l14 168.4c6 72-42.5 135.2-109.9 150.6l0 99.6 48 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-80 0-80 0c-17.7 0-32-14.3-32-32s14.3-32 32-32l48 0 0-99.6C60.6 333 12.1 269.8 18.1 197.8l14-168.4zm56 98.7l143.8 0-5.3-64L93.4 64l-5.3 64z"},child:[]}]})(u)}function Pf(u){return Ve({attr:{viewBox:"0 0 576 512"},child:[{tag:"path",attr:{d:"M234.7 42.7L197 56.8c-3 1.1-5 4-5 7.2s2 6.1 5 7.2l37.7 14.1L248.8 123c1.1 3 4 5 7.2 5s6.1-2 7.2-5l14.1-37.7L315 71.2c3-1.1 5-4 5-7.2s-2-6.1-5-7.2L277.3 42.7 263.2 5c-1.1-3-4-5-7.2-5s-6.1 2-7.2 5L234.7 42.7zM46.1 395.4c-18.7 18.7-18.7 49.1 0 67.9l34.6 34.6c18.7 18.7 49.1 18.7 67.9 0L529.9 116.5c18.7-18.7 18.7-49.1 0-67.9L495.3 14.1c-18.7-18.7-49.1-18.7-67.9 0L46.1 395.4zM484.6 82.6l-105 105-23.3-23.3 105-105 23.3 23.3zM7.5 117.2C3 118.9 0 123.2 0 128s3 9.1 7.5 10.8L64 160l21.2 56.5c1.7 4.5 6 7.5 10.8 7.5s9.1-3 10.8-7.5L128 160l56.5-21.2c4.5-1.7 7.5-6 7.5-10.8s-3-9.1-7.5-10.8L128 96 106.8 39.5C105.1 35 100.8 32 96 32s-9.1 3-10.8 7.5L64 96 7.5 117.2zm352 256c-4.5 1.7-7.5 6-7.5 10.8s3 9.1 7.5 10.8L416 416l21.2 56.5c1.7 4.5 6 7.5 10.8 7.5s9.1-3 10.8-7.5L480 416l56.5-21.2c4.5-1.7 7.5-6 7.5-10.8s-3-9.1-7.5-10.8L480 352l-21.2-56.5c-1.7-4.5-6-7.5-10.8-7.5s-9.1 3-10.8 7.5L416 352l-56.5 21.2z"},child:[]}]})(u)}function _f(u){return Ve({attr:{viewBox:"0 0 448 512"},child:[{tag:"path",attr:{d:"M416 0C400 0 288 32 288 176l0 112c0 35.3 28.7 64 64 64l32 0 0 128c0 17.7 14.3 32 32 32s32-14.3 32-32l0-128 0-112 0-208c0-17.7-14.3-32-32-32zM64 16C64 7.8 57.9 1 49.7 .1S34.2 4.6 32.4 12.5L2.1 148.8C.7 155.1 0 161.5 0 167.9c0 45.9 35.1 83.6 80 87.7L80 480c0 17.7 14.3 32 32 32s32-14.3 32-32l0-224.4c44.9-4.1 80-41.8 80-87.7c0-6.4-.7-12.8-2.1-19.1L191.6 12.5c-1.8-8-9.3-13.3-17.4-12.4S160 7.8 160 16l0 134.2c0 5.4-4.4 9.8-9.8 9.8c-5.1 0-9.3-3.9-9.8-9L127.9 14.6C127.2 6.3 120.3 0 112 0s-15.2 6.3-15.9 14.6L83.7 151c-.5 5.1-4.7 9-9.8 9c-5.4 0-9.8-4.4-9.8-9.8L64 16zm48.3 152l-.3 0-.3 0 .3-.7 .3 .7z"},child:[]}]})(u)}function Tf(u){return Ve({attr:{viewBox:"0 0 512 512"},child:[{tag:"path",attr:{d:"M256 32c14.2 0 27.3 7.5 34.5 19.8l216 368c7.3 12.4 7.3 27.7 .2 40.1S486.3 480 472 480L40 480c-14.3 0-27.6-7.7-34.7-20.1s-7-27.8 .2-40.1l216-368C228.7 39.5 241.8 32 256 32zm0 128c-13.3 0-24 10.7-24 24l0 112c0 13.3 10.7 24 24 24s24-10.7 24-24l0-112c0-13.3-10.7-24-24-24zm32 224a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z"},child:[]}]})(u)}function Mf(u){return Ve({attr:{viewBox:"0 0 576 512"},child:[{tag:"path",attr:{d:"M547.6 103.8L490.3 13.1C485.2 5 476.1 0 466.4 0L109.6 0C99.9 0 90.8 5 85.7 13.1L28.3 103.8c-29.6 46.8-3.4 111.9 51.9 119.4c4 .5 8.1 .8 12.1 .8c26.1 0 49.3-11.4 65.2-29c15.9 17.6 39.1 29 65.2 29c26.1 0 49.3-11.4 65.2-29c15.9 17.6 39.1 29 65.2 29c26.2 0 49.3-11.4 65.2-29c16 17.6 39.1 29 65.2 29c4.1 0 8.1-.3 12.1-.8c55.5-7.4 81.8-72.5 52.1-119.4zM499.7 254.9c0 0 0 0-.1 0c-5.3 .7-10.7 1.1-16.2 1.1c-12.4 0-24.3-1.9-35.4-5.3L448 384l-320 0 0-133.4c-11.2 3.5-23.2 5.4-35.6 5.4c-5.5 0-11-.4-16.3-1.1l-.1 0c-4.1-.6-8.1-1.3-12-2.3L64 384l0 64c0 35.3 28.7 64 64 64l320 0c35.3 0 64-28.7 64-64l0-64 0-131.4c-4 1-8 1.8-12.3 2.3z"},child:[]}]})(u)}function Lf(u){return Ve({attr:{viewBox:"0 0 576 512"},child:[{tag:"path",attr:{d:"M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"},child:[]}]})(u)}function Ff(u){return Ve({attr:{viewBox:"0 0 448 512"},child:[{tag:"path",attr:{d:"M0 216C0 149.7 53.7 96 120 96l8 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-8 0c-30.9 0-56 25.1-56 56l0 8 64 0c35.3 0 64 28.7 64 64l0 64c0 35.3-28.7 64-64 64l-64 0c-35.3 0-64-28.7-64-64l0-32 0-32 0-72zm256 0c0-66.3 53.7-120 120-120l8 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-8 0c-30.9 0-56 25.1-56 56l0 8 64 0c35.3 0 64 28.7 64 64l0 64c0 35.3-28.7 64-64 64l-64 0c-35.3 0-64-28.7-64-64l0-32 0-32 0-72z"},child:[]}]})(u)}function Rf(u){return Ve({attr:{viewBox:"0 0 512 512"},child:[{tag:"path",attr:{d:"M192 104.8c0-9.2-5.8-17.3-13.2-22.8C167.2 73.3 160 61.3 160 48c0-26.5 28.7-48 64-48s64 21.5 64 48c0 13.3-7.2 25.3-18.8 34c-7.4 5.5-13.2 13.6-13.2 22.8c0 12.8 10.4 23.2 23.2 23.2l56.8 0c26.5 0 48 21.5 48 48l0 56.8c0 12.8 10.4 23.2 23.2 23.2c9.2 0 17.3-5.8 22.8-13.2c8.7-11.6 20.7-18.8 34-18.8c26.5 0 48 28.7 48 64s-21.5 64-48 64c-13.3 0-25.3-7.2-34-18.8c-5.5-7.4-13.6-13.2-22.8-13.2c-12.8 0-23.2 10.4-23.2 23.2L384 464c0 26.5-21.5 48-48 48l-56.8 0c-12.8 0-23.2-10.4-23.2-23.2c0-9.2 5.8-17.3 13.2-22.8c11.6-8.7 18.8-20.7 18.8-34c0-26.5-28.7-48-64-48s-64 21.5-64 48c0 13.3 7.2 25.3 18.8 34c7.4 5.5 13.2 13.6 13.2 22.8c0 12.8-10.4 23.2-23.2 23.2L48 512c-26.5 0-48-21.5-48-48L0 343.2C0 330.4 10.4 320 23.2 320c9.2 0 17.3 5.8 22.8 13.2C54.7 344.8 66.7 352 80 352c26.5 0 48-28.7 48-64s-21.5-64-48-64c-13.3 0-25.3 7.2-34 18.8C40.5 250.2 32.4 256 23.2 256C10.4 256 0 245.6 0 232.8L0 176c0-26.5 21.5-48 48-48l120.8 0c12.8 0 23.2-10.4 23.2-23.2z"},child:[]}]})(u)}function If(u){return Ve({attr:{viewBox:"0 0 512 512"},child:[{tag:"path",attr:{d:"M169.7 .9c-22.8-1.6-41.9 14-47.5 34.7L110.4 80c.5 0 1.1 0 1.6 0c176.7 0 320 143.3 320 320c0 .5 0 1.1 0 1.6l44.4-11.8c20.8-5.5 36.3-24.7 34.7-47.5C498.5 159.5 352.5 13.5 169.7 .9zM399.8 410.2c.1-3.4 .2-6.8 .2-10.2c0-159.1-128.9-288-288-288c-3.4 0-6.8 .1-10.2 .2L.5 491.9c-1.5 5.5 .1 11.4 4.1 15.4s9.9 5.6 15.4 4.1L399.8 410.2zM176 208a32 32 0 1 1 0 64 32 32 0 1 1 0-64zm64 128a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zM96 384a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"},child:[]}]})(u)}function Of(u){return Ve({attr:{viewBox:"0 0 512 512"},child:[{tag:"path",attr:{d:"M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z"},child:[]}]})(u)}function Df(u){return Ve({attr:{viewBox:"0 0 512 512"},child:[{tag:"path",attr:{d:"M428.3 3c11.6-6.4 26.2-2.3 32.6 9.3l4.8 8.7c19.3 34.7 19.8 75.7 3.4 110C495.8 159.6 512 197.9 512 240c0 18.5-3.1 36.3-8.9 52.8c-6.1 17.3-28.5 16.3-36.8-.1l-11.7-23.4c-4.1-8.1-12.4-13.3-21.5-13.3L360 256c-13.3 0-24-10.7-24-24l0-80c0-13.3-10.7-24-24-24l-17.1 0c-21.3 0-30-23.9-10.8-32.9C304.7 85.4 327.7 80 352 80c28.3 0 54.8 7.3 77.8 20.2c5.5-18.2 3.7-38.4-6-55.8L419 35.7c-6.4-11.6-2.3-26.2 9.3-32.6zM171.2 345.5L264 160l40 0 0 80c0 26.5 21.5 48 48 48l76.2 0 23.9 47.8C372.3 443.9 244.3 512 103.2 512l-58.8 0C19.9 512 0 492.1 0 467.6c0-20.8 14.5-38.8 34.8-43.3l49.8-11.1c37.6-8.4 69.5-33.2 86.7-67.7z"},child:[]}]})(u)}function Bf(u){return Ve({attr:{viewBox:"0 0 512 512"},child:[{tag:"path",attr:{d:"M88 0C74.7 0 64 10.7 64 24c0 38.9 23.4 59.4 39.1 73.1l1.1 1C120.5 112.3 128 119.9 128 136c0 13.3 10.7 24 24 24s24-10.7 24-24c0-38.9-23.4-59.4-39.1-73.1l-1.1-1C119.5 47.7 112 40.1 112 24c0-13.3-10.7-24-24-24zM32 192c-17.7 0-32 14.3-32 32L0 416c0 53 43 96 96 96l192 0c53 0 96-43 96-96l16 0c61.9 0 112-50.1 112-112s-50.1-112-112-112l-48 0L32 192zm352 64l16 0c26.5 0 48 21.5 48 48s-21.5 48-48 48l-16 0 0-96zM224 24c0-13.3-10.7-24-24-24s-24 10.7-24 24c0 38.9 23.4 59.4 39.1 73.1l1.1 1C232.5 112.3 240 119.9 240 136c0 13.3 10.7 24 24 24s24-10.7 24-24c0-38.9-23.4-59.4-39.1-73.1l-1.1-1C231.5 47.7 224 40.1 224 24z"},child:[]}]})(u)}function $f(u){return Ve({attr:{viewBox:"0 0 640 512"},child:[{tag:"path",attr:{d:"M280 32c-13.3 0-24 10.7-24 24s10.7 24 24 24l57.7 0 16.4 30.3L256 192l-45.3-45.3c-12-12-28.3-18.7-45.3-18.7L64 128c-17.7 0-32 14.3-32 32l0 32 96 0c88.4 0 160 71.6 160 160c0 11-1.1 21.7-3.2 32l70.4 0c-2.1-10.3-3.2-21-3.2-32c0-52.2 25-98.6 63.7-127.8l15.4 28.6C402.4 276.3 384 312 384 352c0 70.7 57.3 128 128 128s128-57.3 128-128s-57.3-128-128-128c-13.5 0-26.5 2.1-38.7 6L418.2 128l61.8 0c17.7 0 32-14.3 32-32l0-32c0-17.7-14.3-32-32-32l-20.4 0c-7.5 0-14.7 2.6-20.5 7.4L391.7 78.9l-14-26c-7-12.9-20.5-21-35.2-21L280 32zM462.7 311.2l28.2 52.2c6.3 11.7 20.9 16 32.5 9.7s16-20.9 9.7-32.5l-28.2-52.2c2.3-.3 4.7-.4 7.1-.4c35.3 0 64 28.7 64 64s-28.7 64-64 64s-64-28.7-64-64c0-15.5 5.5-29.7 14.7-40.8zM187.3 376c-9.5 23.5-32.5 40-59.3 40c-35.3 0-64-28.7-64-64s28.7-64 64-64c26.9 0 49.9 16.5 59.3 40l66.4 0C242.5 268.8 190.5 224 128 224C57.3 224 0 281.3 0 352s57.3 128 128 128c62.5 0 114.5-44.8 125.8-104l-66.4 0zM128 384a32 32 0 1 0 0-64 32 32 0 1 0 0 64z"},child:[]}]})(u)}function Af(u){return Ve({attr:{viewBox:"0 0 576 512"},child:[{tag:"path",attr:{d:"M64 64C28.7 64 0 92.7 0 128L0 384c0 35.3 28.7 64 64 64l448 0c35.3 0 64-28.7 64-64l0-256c0-35.3-28.7-64-64-64L64 64zm64 320l-64 0 0-64c35.3 0 64 28.7 64 64zM64 192l0-64 64 0c0 35.3-28.7 64-64 64zM448 384c0-35.3 28.7-64 64-64l0 64-64 0zm64-192c-35.3 0-64-28.7-64-64l64 0 0 64zM288 160a96 96 0 1 1 0 192 96 96 0 1 1 0-192z"},child:[]}]})(u)}function Uf(u){return Ve({attr:{viewBox:"0 0 384 512"},child:[{tag:"path",attr:{d:"M16 64C16 28.7 44.7 0 80 0L304 0c35.3 0 64 28.7 64 64l0 384c0 35.3-28.7 64-64 64L80 512c-35.3 0-64-28.7-64-64L16 64zM144 448c0 8.8 7.2 16 16 16l64 0c8.8 0 16-7.2 16-16s-7.2-16-16-16l-64 0c-8.8 0-16 7.2-16 16zM304 64L80 64l0 320 224 0 0-320z"},child:[]}]})(u)}function Hf(u){return Ve({attr:{viewBox:"0 0 512 512"},child:[{tag:"path",attr:{d:"M32 0C19.1 0 7.4 7.8 2.4 19.8s-2.2 25.7 6.9 34.9L224 269.3 224 448l-64 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l96 0 96 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-64 0 0-178.7L502.6 54.6c9.2-9.2 11.9-22.9 6.9-34.9S492.9 0 480 0L32 0zM173.3 128l-64-64 293.5 0-64 64-165.5 0z"},child:[]}]})(u)}function Wf(u){return Ve({attr:{viewBox:"0 0 384 512"},child:[{tag:"path",attr:{d:"M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z"},child:[]}]})(u)}function Vf(u){return Ve({attr:{viewBox:"0 0 512 512"},child:[{tag:"path",attr:{d:"M272 96c-78.6 0-145.1 51.5-167.7 122.5c33.6-17 71.5-26.5 111.7-26.5l88 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-16 0-72 0s0 0 0 0c-16.6 0-32.7 1.9-48.3 5.4c-25.9 5.9-49.9 16.4-71.4 30.7c0 0 0 0 0 0C38.3 298.8 0 364.9 0 440l0 16c0 13.3 10.7 24 24 24s24-10.7 24-24l0-16c0-48.7 20.7-92.5 53.8-123.2C121.6 392.3 190.3 448 272 448l1 0c132.1-.7 239-130.9 239-291.4c0-42.6-7.5-83.1-21.1-119.6c-2.6-6.9-12.7-6.6-16.2-.1C455.9 72.1 418.7 96 376 96L272 96z"},child:[]}]})(u)}function Qf(u){return Ve({attr:{viewBox:"0 0 448 512"},child:[{tag:"path",attr:{d:"M367.1 160c.6-5.3 .9-10.6 .9-16C368 64.5 303.5 0 224 0S80 64.5 80 144c0 5.4 .3 10.7 .9 16l-.9 0c-26.5 0-48 21.5-48 48s21.5 48 48 48l53.5 0 181 0 53.5 0c26.5 0 48-21.5 48-48s-21.5-48-48-48l-.9 0zM96 288L200.8 497.7c4.4 8.8 13.3 14.3 23.2 14.3s18.8-5.5 23.2-14.3L352 288 96 288z"},child:[]}]})(u)}function Yf(u){return Ve({attr:{viewBox:"0 0 384 512"},child:[{tag:"path",attr:{d:"M32 0C14.3 0 0 14.3 0 32S14.3 64 32 64l0 11c0 42.4 16.9 83.1 46.9 113.1L146.7 256 78.9 323.9C48.9 353.9 32 394.6 32 437l0 11c-17.7 0-32 14.3-32 32s14.3 32 32 32l32 0 256 0 32 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l0-11c0-42.4-16.9-83.1-46.9-113.1L237.3 256l67.9-67.9c30-30 46.9-70.7 46.9-113.1l0-11c17.7 0 32-14.3 32-32s-14.3-32-32-32L320 0 64 0 32 0zM96 75l0-11 192 0 0 11c0 19-5.6 37.4-16 53L112 128c-10.3-15.6-16-34-16-53zm16 309c3.5-5.3 7.6-10.3 12.1-14.9L192 301.3l67.9 67.9c4.6 4.6 8.6 9.6 12.1 14.9L112 384z"},child:[]}]})(u)}function Kf(u){return Ve({attr:{viewBox:"0 0 512 512"},child:[{tag:"path",attr:{d:"M488.6 23.4c31.2 31.2 31.2 81.9 0 113.1l-352 352c-31.2 31.2-81.9 31.2-113.1 0s-31.2-81.9 0-113.1l352-352c31.2-31.2 81.9-31.2 113.1 0zM443.3 92.7c-6.2-6.2-16.4-6.2-22.6 0c-12.5 12.5-23.8 15.1-37.5 17.6l-2.5 .4c-13.8 2.5-31.6 5.6-48 22c-16.7 16.7-20.9 36-24.1 50.9c0 0 0 0 0 0s0 0 0 0l-.2 1c-3.4 15.6-6 26.4-15.7 36.1s-20.5 12.3-36.1 15.7l-1 .2c-14.9 3.2-34.2 7.4-50.9 24.1s-20.9 36-24.1 50.9l-.2 1c-3.4 15.6-6 26.4-15.7 36.1c-9.2 9.2-18 10.8-32.7 13.4c0 0 0 0 0 0l-.9 .2c-15.6 2.8-34.9 6.9-54.4 26.4c-6.2 6.2-6.2 16.4 0 22.6s16.4 6.2 22.6 0c12.5-12.5 23.8-15.1 37.5-17.6l2.5-.4c13.8-2.5 31.6-5.6 48-22c16.7-16.7 20.9-36 24.1-50.9l.2-1c3.4-15.6 6-26.4 15.7-36.1s20.5-12.3 36.1-15.7l1-.2c14.9-3.2 34.2-7.4 50.9-24.1s20.9-36 24.1-50.9l.2-1c3.4-15.6 6-26.4 15.7-36.1c9.2-9.2 18-10.8 32.7-13.4l.9-.2c15.6-2.8 34.9-6.9 54.4-26.4c6.2-6.2 6.2-16.4 0-22.6zM191.2 479.2l288-288L495 207c10.9 10.9 17 25.6 17 41s-6.1 30.1-17 41L289 495c-10.9 10.9-25.6 17-41 17s-30.1-6.1-41-17l-15.8-15.8zM17 305C6.1 294.1 0 279.4 0 264s6.1-30.1 17-41L223 17C233.9 6.1 248.6 0 264 0s30.1 6.1 41 17l15.8 15.8-288 288L17 305z"},child:[]}]})(u)}function Gf(u){return Ve({attr:{viewBox:"0 0 448 512"},child:[{tag:"path",attr:{d:"M159.3 5.4c7.8-7.3 19.9-7.2 27.7 .1c27.6 25.9 53.5 53.8 77.7 84c11-14.4 23.5-30.1 37-42.9c7.9-7.4 20.1-7.4 28 .1c34.6 33 63.9 76.6 84.5 118c20.3 40.8 33.8 82.5 33.8 111.9C448 404.2 348.2 512 224 512C98.4 512 0 404.1 0 276.5c0-38.4 17.8-85.3 45.4-131.7C73.3 97.7 112.7 48.6 159.3 5.4zM225.7 416c25.3 0 47.7-7 68.8-21c42.1-29.4 53.4-88.2 28.1-134.4c-4.5-9-16-9.6-22.5-2l-25.2 29.3c-6.6 7.6-18.5 7.4-24.7-.5c-16.5-21-46-58.5-62.8-79.8c-6.3-8-18.3-8.1-24.7-.1c-33.8 42.5-50.8 69.3-50.8 99.4C112 375.4 162.6 416 225.7 416z"},child:[]}]})(u)}function qf(u){return Ve({attr:{viewBox:"0 0 512 512"},child:[{tag:"path",attr:{d:"M160 265.2c0 8.5-3.4 16.6-9.4 22.6l-26.8 26.8c-12.3 12.3-32.5 11.4-49.4 7.2C69.8 320.6 65 320 60 320c-33.1 0-60 26.9-60 60s26.9 60 60 60c6.3 0 12 5.7 12 12c0 33.1 26.9 60 60 60s60-26.9 60-60c0-5-.6-9.8-1.8-14.5c-4.2-16.9-5.2-37.1 7.2-49.4l26.8-26.8c6-6 14.1-9.4 22.6-9.4l89.2 0c6.3 0 12.4-.3 18.5-1c11.9-1.2 16.4-15.5 10.8-26c-8.5-15.8-13.3-33.8-13.3-53c0-61.9 50.1-112 112-112c8 0 15.7 .8 23.2 2.4c11.7 2.5 24.1-5.9 22-17.6C494.5 62.5 422.5 0 336 0C238.8 0 160 78.8 160 176l0 89.2z"},child:[]}]})(u)}function Xf(u){return Ve({attr:{viewBox:"0 0 576 512"},child:[{tag:"path",attr:{d:"M64 32C28.7 32 0 60.7 0 96l0 32 576 0 0-32c0-35.3-28.7-64-64-64L64 32zM576 224L0 224 0 416c0 35.3 28.7 64 64 64l448 0c35.3 0 64-28.7 64-64l0-192zM112 352l64 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-64 0c-8.8 0-16-7.2-16-16s7.2-16 16-16zm112 16c0-8.8 7.2-16 16-16l128 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-128 0c-8.8 0-16-7.2-16-16z"},child:[]}]})(u)}function Zf(u){return Ve({attr:{viewBox:"0 0 512 512"},child:[{tag:"path",attr:{d:"M257.5 27.6c-.8-5.4-4.9-9.8-10.3-10.6c-22.1-3.1-44.6 .9-64.4 11.4l-74 39.5C89.1 78.4 73.2 94.9 63.4 115L26.7 190.6c-9.8 20.1-13 42.9-9.1 64.9l14.5 82.8c3.9 22.1 14.6 42.3 30.7 57.9l60.3 58.4c16.1 15.6 36.6 25.6 58.7 28.7l83 11.7c22.1 3.1 44.6-.9 64.4-11.4l74-39.5c19.7-10.5 35.6-27 45.4-47.2l36.7-75.5c9.8-20.1 13-42.9 9.1-64.9c-.9-5.3-5.3-9.3-10.6-10.1c-51.5-8.2-92.8-47.1-104.5-97.4c-1.8-7.6-8-13.4-15.7-14.6c-54.6-8.7-97.7-52-106.2-106.8zM208 144a32 32 0 1 1 0 64 32 32 0 1 1 0-64zM144 336a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm224-64a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"},child:[]}]})(u)}function Jf(u){return Ve({attr:{viewBox:"0 0 512 512"},child:[{tag:"path",attr:{d:"M256 448c141.4 0 256-93.1 256-208S397.4 32 256 32S0 125.1 0 240c0 45.1 17.7 86.8 47.7 120.9c-1.9 24.5-11.4 46.3-21.4 62.9c-5.5 9.2-11.1 16.6-15.2 21.6c-2.1 2.5-3.7 4.4-4.9 5.7c-.6 .6-1 1.1-1.3 1.4l-.3 .3c0 0 0 0 0 0c0 0 0 0 0 0s0 0 0 0s0 0 0 0c-4.6 4.6-5.9 11.4-3.4 17.4c2.5 6 8.3 9.9 14.8 9.9c28.7 0 57.6-8.9 81.6-19.3c22.9-10 42.4-21.9 54.3-30.6c31.8 11.5 67 17.9 104.1 17.9zM128 208a32 32 0 1 1 0 64 32 32 0 1 1 0-64zm128 0a32 32 0 1 1 0 64 32 32 0 1 1 0-64zm96 32a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"},child:[]}]})(u)}function e0(u){return Ve({attr:{viewBox:"0 0 512 512"},child:[{tag:"path",attr:{d:"M256 0a256 256 0 1 1 0 512A256 256 0 1 1 256 0zM232 120l0 136c0 8 4 15.5 10.7 20l96 64c11 7.4 25.9 4.4 33.3-6.7s4.4-25.9-6.7-33.3L280 243.2 280 120c0-13.3-10.7-24-24-24s-24 10.7-24 24z"},child:[]}]})(u)}function t0(u){return Ve({attr:{viewBox:"0 0 512 512"},child:[{tag:"path",attr:{d:"M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z"},child:[]}]})(u)}function r0(u){return Ve({attr:{viewBox:"0 0 512 512"},child:[{tag:"path",attr:{d:"M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"},child:[]}]})(u)}function n0(u){return Ve({attr:{viewBox:"0 0 512 512"},child:[{tag:"path",attr:{d:"M512 240.2l0 15.8L0 256c0-20 10-38.7 26.6-49.8L274.9 40.7c8.6-5.7 18.6-8.7 28.9-8.7C418.8 32 512 125.2 512 240.2zm0 47.8l0 128c0 35.3-28.7 64-64 64L64 480c-35.3 0-64-28.7-64-64L0 288l512 0z"},child:[]}]})(u)}function o0(u){return Ve({attr:{viewBox:"0 0 448 512"},child:[{tag:"path",attr:{d:"M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"},child:[]}]})(u)}function i0(u){return Ve({attr:{viewBox:"0 0 576 512"},child:[{tag:"path",attr:{d:"M0 24C0 10.7 10.7 0 24 0L69.5 0c22 0 41.5 12.8 50.6 32l411 0c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3l-288.5 0 5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5L488 336c13.3 0 24 10.7 24 24s-10.7 24-24 24l-288.3 0c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5L24 48C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z"},child:[]}]})(u)}function l0(u){return Ve({attr:{viewBox:"0 0 512 512"},child:[{tag:"path",attr:{d:"M149.1 64.8L138.7 96 64 96C28.7 96 0 124.7 0 160L0 416c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-256c0-35.3-28.7-64-64-64l-74.7 0L362.9 64.8C356.4 45.2 338.1 32 317.4 32L194.6 32c-20.7 0-39 13.2-45.5 32.8zM256 192a96 96 0 1 1 0 192 96 96 0 1 1 0-192z"},child:[]}]})(u)}function a0(u){return Ve({attr:{viewBox:"0 0 448 512"},child:[{tag:"path",attr:{d:"M86.4 5.5L61.8 47.6C58 54.1 56 61.6 56 69.2L56 72c0 22.1 17.9 40 40 40s40-17.9 40-40l0-2.8c0-7.6-2-15-5.8-21.6L105.6 5.5C103.6 2.1 100 0 96 0s-7.6 2.1-9.6 5.5zm128 0L189.8 47.6c-3.8 6.5-5.8 14-5.8 21.6l0 2.8c0 22.1 17.9 40 40 40s40-17.9 40-40l0-2.8c0-7.6-2-15-5.8-21.6L233.6 5.5C231.6 2.1 228 0 224 0s-7.6 2.1-9.6 5.5zM317.8 47.6c-3.8 6.5-5.8 14-5.8 21.6l0 2.8c0 22.1 17.9 40 40 40s40-17.9 40-40l0-2.8c0-7.6-2-15-5.8-21.6L361.6 5.5C359.6 2.1 356 0 352 0s-7.6 2.1-9.6 5.5L317.8 47.6zM128 176c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 48c-35.3 0-64 28.7-64 64l0 71c8.3 5.2 18.1 9 28.8 9c13.5 0 27.2-6.1 38.4-13.4c5.4-3.5 9.9-7.1 13-9.7c1.5-1.3 2.7-2.4 3.5-3.1c.4-.4 .7-.6 .8-.8l.1-.1s0 0 0 0s0 0 0 0s0 0 0 0s0 0 0 0c3.1-3.2 7.4-4.9 11.9-4.8s8.6 2.1 11.6 5.4c0 0 0 0 0 0s0 0 0 0l.1 .1c.1 .1 .4 .4 .7 .7c.7 .7 1.7 1.7 3.1 3c2.8 2.6 6.8 6.1 11.8 9.5c10.2 7.1 23 13.1 36.3 13.1s26.1-6 36.3-13.1c5-3.5 9-6.9 11.8-9.5c1.4-1.3 2.4-2.3 3.1-3c.3-.3 .6-.6 .7-.7l.1-.1c3-3.5 7.4-5.4 12-5.4s9 2 12 5.4l.1 .1c.1 .1 .4 .4 .7 .7c.7 .7 1.7 1.7 3.1 3c2.8 2.6 6.8 6.1 11.8 9.5c10.2 7.1 23 13.1 36.3 13.1s26.1-6 36.3-13.1c5-3.5 9-6.9 11.8-9.5c1.4-1.3 2.4-2.3 3.1-3c.3-.3 .6-.6 .7-.7l.1-.1c2.9-3.4 7.1-5.3 11.6-5.4s8.7 1.6 11.9 4.8c0 0 0 0 0 0s0 0 0 0s0 0 0 0l.1 .1c.2 .2 .4 .4 .8 .8c.8 .7 1.9 1.8 3.5 3.1c3.1 2.6 7.5 6.2 13 9.7c11.2 7.3 24.9 13.4 38.4 13.4c10.7 0 20.5-3.9 28.8-9l0-71c0-35.3-28.7-64-64-64l0-48c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 48-64 0 0-48c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 48-64 0 0-48zM448 394.6c-8.5 3.3-18.2 5.4-28.8 5.4c-22.5 0-42.4-9.9-55.8-18.6c-4.1-2.7-7.8-5.4-10.9-7.8c-2.8 2.4-6.1 5-9.8 7.5C329.8 390 310.6 400 288 400s-41.8-10-54.6-18.9c-3.5-2.4-6.7-4.9-9.4-7.2c-2.7 2.3-5.9 4.7-9.4 7.2C201.8 390 182.6 400 160 400s-41.8-10-54.6-18.9c-3.7-2.6-7-5.2-9.8-7.5c-3.1 2.4-6.8 5.1-10.9 7.8C71.2 390.1 51.3 400 28.8 400c-10.6 0-20.3-2.2-28.8-5.4L0 480c0 17.7 14.3 32 32 32l384 0c17.7 0 32-14.3 32-32l0-85.4z"},child:[]}]})(u)}function s0(u){return Ve({attr:{viewBox:"0 0 512 512"},child:[{tag:"path",attr:{d:"M61.1 224C45 224 32 211 32 194.9c0-1.9 .2-3.7 .6-5.6C37.9 168.3 78.8 32 256 32s218.1 136.3 223.4 157.3c.5 1.9 .6 3.7 .6 5.6c0 16.1-13 29.1-29.1 29.1L61.1 224zM144 128a16 16 0 1 0 -32 0 16 16 0 1 0 32 0zm240 16a16 16 0 1 0 0-32 16 16 0 1 0 0 32zM272 96a16 16 0 1 0 -32 0 16 16 0 1 0 32 0zM16 304c0-26.5 21.5-48 48-48l384 0c26.5 0 48 21.5 48 48s-21.5 48-48 48L64 352c-26.5 0-48-21.5-48-48zm16 96c0-8.8 7.2-16 16-16l416 0c8.8 0 16 7.2 16 16l0 16c0 35.3-28.7 64-64 64L96 480c-35.3 0-64-28.7-64-64l0-16z"},child:[]}]})(u)}function u0(u){return Ve({attr:{viewBox:"0 0 512 512"},child:[{tag:"path",attr:{d:"M448 256A192 192 0 1 0 64 256a192 192 0 1 0 384 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zm256 80a80 80 0 1 0 0-160 80 80 0 1 0 0 160zm0-224a144 144 0 1 1 0 288 144 144 0 1 1 0-288zM224 256a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"},child:[]}]})(u)}function c0(u){return Ve({attr:{viewBox:"0 0 512 512"},child:[{tag:"path",attr:{d:"M256 32C192 32 0 64 0 192c0 35.3 28.7 64 64 64V432c0 26.5 21.5 48 48 48H400c26.5 0 48-21.5 48-48V256c35.3 0 64-28.7 64-64C512 64 320 32 256 32z"},child:[]}]})(u)}function d0(u){return Ve({attr:{viewBox:"0 0 512 512"},child:[{tag:"path",attr:{d:"M176 56c0-13.3 10.7-24 24-24l16 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-16 0c-13.3 0-24-10.7-24-24zm24 48l16 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-16 0c-13.3 0-24-10.7-24-24s10.7-24 24-24zM56 176l16 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-16 0c-13.3 0-24-10.7-24-24s10.7-24 24-24zM0 283.4C0 268.3 12.3 256 27.4 256l457.1 0c15.1 0 27.4 12.3 27.4 27.4c0 70.5-44.4 130.7-106.7 154.1L403.5 452c-2 16-15.6 28-31.8 28l-231.5 0c-16.1 0-29.8-12-31.8-28l-1.8-14.4C44.4 414.1 0 353.9 0 283.4zM224 200c0-13.3 10.7-24 24-24l16 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-16 0c-13.3 0-24-10.7-24-24zm-96 0c0-13.3 10.7-24 24-24l16 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-16 0c-13.3 0-24-10.7-24-24zm-24-96l16 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-16 0c-13.3 0-24-10.7-24-24s10.7-24 24-24zm216 96c0-13.3 10.7-24 24-24l16 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-16 0c-13.3 0-24-10.7-24-24zm-24-96l16 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-16 0c-13.3 0-24-10.7-24-24s10.7-24 24-24zm120 96c0-13.3 10.7-24 24-24l16 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-16 0c-13.3 0-24-10.7-24-24zm-24-96l16 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-16 0c-13.3 0-24-10.7-24-24s10.7-24 24-24zM296 32l16 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-16 0c-13.3 0-24-10.7-24-24s10.7-24 24-24z"},child:[]}]})(u)}function p0(u){return Ve({attr:{viewBox:"0 0 512 512"},child:[{tag:"path",attr:{d:"M0 192c0-35.3 28.7-64 64-64c.5 0 1.1 0 1.6 0C73 91.5 105.3 64 144 64c15 0 29 4.1 40.9 11.2C198.2 49.6 225.1 32 256 32s57.8 17.6 71.1 43.2C339 68.1 353 64 368 64c38.7 0 71 27.5 78.4 64c.5 0 1.1 0 1.6 0c35.3 0 64 28.7 64 64c0 11.7-3.1 22.6-8.6 32L8.6 224C3.1 214.6 0 203.7 0 192zm0 91.4C0 268.3 12.3 256 27.4 256l457.1 0c15.1 0 27.4 12.3 27.4 27.4c0 70.5-44.4 130.7-106.7 154.1L403.5 452c-2 16-15.6 28-31.8 28l-231.5 0c-16.1 0-29.8-12-31.8-28l-1.8-14.4C44.4 414.1 0 353.9 0 283.4z"},child:[]}]})(u)}function f0(u){return Ve({attr:{viewBox:"0 0 320 512"},child:[{tag:"path",attr:{d:"M120 0l80 0c13.3 0 24 10.7 24 24l0 40L96 64l0-40c0-13.3 10.7-24 24-24zM32 167.5c0-19.5 10-37.6 26.6-47.9l15.8-9.9C88.7 100.7 105.2 96 122.1 96l75.8 0c16.9 0 33.4 4.7 47.7 13.7l15.8 9.9C278 129.9 288 148 288 167.5c0 17-7.5 32.3-19.4 42.6C280.6 221.7 288 238 288 256c0 19.1-8.4 36.3-21.7 48c13.3 11.7 21.7 28.9 21.7 48s-8.4 36.3-21.7 48c13.3 11.7 21.7 28.9 21.7 48c0 35.3-28.7 64-64 64L96 512c-35.3 0-64-28.7-64-64c0-19.1 8.4-36.3 21.7-48C40.4 388.3 32 371.1 32 352s8.4-36.3 21.7-48C40.4 292.3 32 275.1 32 256c0-18 7.4-34.3 19.4-45.9C39.5 199.7 32 184.5 32 167.5zM96 240c0 8.8 7.2 16 16 16l96 0c8.8 0 16-7.2 16-16s-7.2-16-16-16l-96 0c-8.8 0-16 7.2-16 16zm16 112c-8.8 0-16 7.2-16 16s7.2 16 16 16l96 0c8.8 0 16-7.2 16-16s-7.2-16-16-16l-96 0z"},child:[]}]})(u)}function h0(u){return Ve({attr:{viewBox:"0 0 448 512"},child:[{tag:"path",attr:{d:"M349.4 44.6c5.9-13.7 1.5-29.7-10.6-38.5s-28.6-8-39.9 1.8l-256 224c-10 8.8-13.6 22.9-8.9 35.3S50.7 288 64 288l111.5 0L98.6 467.4c-5.9 13.7-1.5 29.7 10.6 38.5s28.6 8 39.9-1.8l256-224c10-8.8 13.6-22.9 8.9-35.3s-16.6-20.7-30-20.7l-111.5 0L349.4 44.6z"},child:[]}]})(u)}function m0(u){return Ve({attr:{viewBox:"0 0 512 512"},child:[{tag:"path",attr:{d:"M32 64c0-17.7 14.3-32 32-32l288 0c17.7 0 32 14.3 32 32l0 32 51.2 0c42.4 0 76.8 34.4 76.8 76.8l0 102.1c0 30.4-17.9 57.9-45.6 70.2L384 381.7l0 34.3c0 35.3-28.7 64-64 64L96 480c-35.3 0-64-28.7-64-64L32 64zM384 311.6l56.4-25.1c4.6-2.1 7.6-6.6 7.6-11.7l0-102.1c0-7.1-5.7-12.8-12.8-12.8L384 160l0 151.6zM160 144c0-8.8-7.2-16-16-16s-16 7.2-16 16l0 224c0 8.8 7.2 16 16 16s16-7.2 16-16l0-224zm64 0c0-8.8-7.2-16-16-16s-16 7.2-16 16l0 224c0 8.8 7.2 16 16 16s16-7.2 16-16l0-224zm64 0c0-8.8-7.2-16-16-16s-16 7.2-16 16l0 224c0 8.8 7.2 16 16 16s16-7.2 16-16l0-224z"},child:[]}]})(u)}function g0(u){return Ve({attr:{viewBox:"0 0 448 512"},child:[{tag:"path",attr:{d:"M160 112c0-35.3 28.7-64 64-64s64 28.7 64 64l0 48-128 0 0-48zm-48 48l-64 0c-26.5 0-48 21.5-48 48L0 416c0 53 43 96 96 96l256 0c53 0 96-43 96-96l0-208c0-26.5-21.5-48-48-48l-64 0 0-48C336 50.1 285.9 0 224 0S112 50.1 112 112l0 48zm24 48a24 24 0 1 1 0 48 24 24 0 1 1 0-48zm152 24a24 24 0 1 1 48 0 24 24 0 1 1 -48 0z"},child:[]}]})(u)}const ee={Pizza:If,Burger:s0,Hotdog:Kf,Chicken:qf,IceCream:Qf,Cake:a0,Rice:d0,Cocktail:Hf,Beer:m0,Coffee:Bf,Drink:f0,Cheese:n0,Utensils:_f,Flame:Gf,Star:Lf,Bowl:p0,Rider:$f,Store:Mf,Card:Xf,Cash:Af,Pin:Wf,Puzzle:Rf,Clock:e0,Check:o0,Close:Ef,Chat:Jf,Cart:i0,Target:u0,Camera:l0,Phone:Uf,Hourglass:Yf,CheckCircle:r0,CrossCircle:t0,Sparkles:Pf,Bread:c0,Cookie:Zf,Pepper:Df,Leaf:Vf,Wine:Nf,Call:Of,Warning:Tf,Bag:g0,Bolt:h0,Quote:Ff},Td={pizza:ee.Pizza,burger:ee.Burger,hotdog:ee.Hotdog,chicken:ee.Chicken,icecream:ee.IceCream,cake:ee.Cake,rice:ee.Rice,cocktail:ee.Cocktail,beer:ee.Beer,coffee:ee.Coffee,drink:ee.Drink,cheese:ee.Cheese,utensils:ee.Utensils,flame:ee.Flame,star:ee.Star,bowl:ee.Bowl,bread:ee.Bread,cookie:ee.Cookie,pepper:ee.Pepper,salad:ee.Leaf,wine:ee.Wine},x0={"🍕":"pizza","🍔":"burger","🍟":"burger","🌭":"hotdog","🌮":"bread","🌯":"bread","🥪":"bread","🍗":"chicken","🍖":"chicken","🍦":"icecream","🍩":"cookie","🍰":"cake","🎂":"cake","🍛":"rice","🍚":"rice","🍜":"bowl","🍲":"bowl","🍣":"rice","🥗":"salad","🥤":"drink","🧃":"drink","☕":"coffee","🍹":"cocktail","🍷":"wine","🍺":"beer","🧀":"cheese","🔥":"flame","⭐":"star","🌶":"pepper","🍽":"utensils"};[["pizza","Pizza"],["burger","Burger"],["hotdog","Hot dog"],["chicken","Chicken"],["bread","Wraps & sandwiches"],["rice","Rice"],["bowl","Bowls & soups"],["salad","Salad"],["cheese","Cheese"],["pepper","Spicy"],["drink","Cold drink"],["coffee","Hot drink"],["cocktail","Mocktail"],["icecream","Ice cream"],["cookie","Snacks"],["cake","Dessert"],["flame","Hot deal"],["star","Popular"],["utensils","General"]].map(([u,h])=>({key:u,label:h}));const v0=u=>{const h=String(u||"").trim();if(!h)return"utensils";if(Td[h])return h;const p=h.replace(/\uFE0F/g,"");return x0[p]||"utensils"},ga=({icon:u,...h})=>{const p=Td[v0(u)]||ee.Utensils;return o.jsx(p,{"aria-hidden":"true",...h})},y0="/assets/jazzcash-raast-qr-BZ1REkAo.png",aa="cod",sa="jazzcash",Ws={codEnabled:!0,jazzcashEnabled:!0,merchantName:"GEN Z FOOD",tillId:"984661930",dialCode:"*786*10#",qrImage:""},w0=5*1024*1024,k0=/^[A-Za-z0-9]{6,30}$/,b0=/^[\p{L}\p{N} .+\-']{3,60}$/u;function z0(){const[u,h]=I.useState(""),[p,j]=I.useState(""),[k,L]=I.useState(""),[ae,G]=I.useState(""),[F,B]=I.useState(""),[Y,H]=I.useState(!1),[ie,ne]=I.useState(""),he=I.useRef(0);I.useEffect(()=>()=>ae&&URL.revokeObjectURL(ae),[ae]);const ze=I.useCallback(async Ee=>{if(!Ee)return;if(ne(""),!["image/jpeg","image/png"].includes(Ee.type)){ne("Please choose a JPG or PNG screenshot.");return}if(Ee.size>w0){ne("That screenshot is over 5 MB. Please choose a smaller image.");return}const ke=++he.current;G(URL.createObjectURL(Ee)),B(Ee.name),L(""),H(!0);try{const ve=await hf(Ee);ke===he.current&&L(ve.data.proofId)}catch(ve){ke===he.current&&(G(""),B(""),ne(ve.message))}finally{ke===he.current&&H(!1)}},[]),W=I.useCallback(()=>{he.current+=1,G(""),B(""),L(""),H(!1),ne("")},[]),ue=I.useCallback(()=>{h(""),j(""),W()},[W]),Pe=k0.test(u.replace(/\s+/g,"")),Ke=b0.test(p.trim().replace(/\s+/g," "));return{tid:u,setTid:h,sender:p,setSender:j,proofId:k,preview:ae,fileName:F,uploading:Y,uploadError:ie,pickFile:ze,clearFile:W,reset:ue,tidOk:Pe,senderOk:Ke,ready:Pe&&Ke&&!!k&&!Y}}const S0=async u=>{try{return await navigator.clipboard.writeText(u),!0}catch{try{const h=document.createElement("textarea");h.value=u,h.setAttribute("readonly",""),h.style.cssText="position:fixed;opacity:0;top:0;left:0",document.body.appendChild(h),h.select();const p=document.execCommand("copy");return document.body.removeChild(h),p}catch{return!1}}},j0=({cfg:u,value:h,onChange:p,pickup:j=!1})=>{const k=[u.codEnabled&&{id:aa,title:j?"Pay at Pickup":"Cash on Delivery",sub:j?"Pay at the counter when you collect":"Pay the rider when it arrives",icon:o.jsx(ee.Cash,{})},u.jazzcashEnabled&&{id:sa,title:"Pay via JazzCash / Raast QR",sub:"Scan, pay & upload the screenshot",icon:o.jsx(ee.Phone,{})}].filter(Boolean);return o.jsxs("fieldset",{className:"pay-methods",children:[o.jsx("legend",{children:"Payment method"}),k.map(L=>o.jsxs("label",{className:`pay-method${h===L.id?" is-on":""}`,children:[o.jsx("input",{type:"radio",name:"payMethod",value:L.id,checked:h===L.id,onChange:()=>p(L.id)}),o.jsx("span",{className:"pay-ico","aria-hidden":"true",children:L.icon}),o.jsxs("span",{className:"pay-text",children:[o.jsx("b",{children:L.title}),o.jsx("small",{children:L.sub})]}),o.jsx("span",{className:"pay-radio","aria-hidden":"true"})]},L.id))]})},C0=({cfg:u,amountLabel:h,jazz:p})=>{const[j,k]=I.useState(!1),[L,ae]=I.useState(""),G=I.useRef(null),F=u.qrImage?_n(u.qrImage):y0,B=async()=>{const H=await S0(u.tillId);k(H),H&&setTimeout(()=>k(!1),2e3)},Y=async()=>{ae("");try{const H=await fetch(F);if(!H.ok)throw new Error("bad response");const ie=await H.blob(),ne=URL.createObjectURL(ie),he=document.createElement("a");he.href=ne,he.download=`${u.merchantName.replace(/\s+/g,"-")}-JazzCash-QR.png`,document.body.appendChild(he),he.click(),he.remove(),setTimeout(()=>URL.revokeObjectURL(ne),1e3)}catch{window.open(F,"_blank","noopener,noreferrer"),ae("Opened in a new tab — press and hold the image to save it.")}};return o.jsxs("div",{className:"pay-card",children:[o.jsxs("div",{className:"pay-amount","aria-live":"polite",children:[o.jsx("span",{children:"Amount to pay"}),o.jsx("strong",{children:h}),o.jsx("small",{children:"Send exactly this amount so we can match your payment."})]}),o.jsxs("div",{className:"pay-grid",children:[o.jsxs("div",{className:"pay-qr",children:[o.jsx("img",{src:F,alt:`${u.merchantName} JazzCash and Raast payment QR code`,width:"340",height:"480"}),o.jsx("p",{children:"Scan with JazzCash, Easypaisa or any banking app"})]}),o.jsxs("div",{className:"pay-info",children:[o.jsxs("div",{className:"pay-row",children:[o.jsx("span",{children:"Merchant"}),o.jsx("b",{children:u.merchantName})]}),o.jsxs("div",{className:"pay-row",children:[o.jsx("span",{children:"Till ID"}),o.jsxs("div",{className:"pay-till",children:[o.jsx("b",{children:u.tillId}),o.jsx("button",{type:"button",className:"pay-mini",onClick:B,children:j?"Copied":"Copy"})]})]}),o.jsx("button",{type:"button",className:"pay-btn-ghost",onClick:Y,children:"⬇ Download QR"}),L&&o.jsx("p",{className:"pay-hint",children:L}),o.jsxs("p",{className:"pay-dial",children:["Or dial ",o.jsx("b",{children:u.dialCode})," and enter the Till ID."]})]})]}),o.jsxs("div",{className:"pay-proof",children:[o.jsx("h4",{children:"After paying, add your payment details"}),o.jsxs("label",{className:"gzp-field",children:[o.jsx("span",{children:"Transaction ID (TID)"}),o.jsx("input",{value:p.tid,onChange:H=>p.setTid(H.target.value.replace(/[^A-Za-z0-9 ]/g,"").slice(0,34)),placeholder:"From your payment confirmation SMS / app",autoCapitalize:"characters",autoComplete:"off",required:!0,"aria-invalid":p.tid!==""&&!p.tidOk}),p.tid!==""&&!p.tidOk&&o.jsx("em",{className:"pay-err",children:"TID should be 6–30 letters or digits."})]}),o.jsxs("label",{className:"gzp-field",children:[o.jsx("span",{children:"Sender's name or mobile number"}),o.jsx("input",{value:p.sender,onChange:H=>p.setSender(H.target.value.slice(0,60)),placeholder:"Account holder name or 03001234567",autoComplete:"off",required:!0,"aria-invalid":p.sender!==""&&!p.senderOk}),p.sender!==""&&!p.senderOk&&o.jsx("em",{className:"pay-err",children:"Use 3–60 letters or digits, no special symbols."})]}),o.jsxs("div",{className:"gzp-field",children:[o.jsxs("span",{children:["Payment screenshot ",o.jsx("small",{children:"(JPG or PNG, up to 5 MB)"})]}),o.jsx("input",{ref:G,type:"file",accept:"image/png,image/jpeg",className:"pay-file",onChange:H=>{var ie;p.pickFile((ie=H.target.files)==null?void 0:ie[0]),H.target.value=""}}),p.preview?o.jsxs("div",{className:"pay-shot",children:[o.jsx("img",{src:p.preview,alt:"Your payment screenshot"}),o.jsxs("div",{children:[o.jsx("b",{children:p.fileName}),o.jsx("small",{className:p.proofId?"ok":"",children:p.uploading?"Uploading…":p.proofId?"Uploaded":""}),o.jsx("button",{type:"button",className:"pay-mini",onClick:()=>{var H;p.clearFile(),(H=G.current)==null||H.click()},children:"Change"})]})]}):o.jsxs("button",{type:"button",className:"pay-drop",onClick:()=>{var H;return(H=G.current)==null?void 0:H.click()},children:[o.jsx(ee.Camera,{"aria-hidden":"true",style:{marginRight:8,verticalAlign:"-2px"}}),"Choose screenshot"]}),p.uploadError&&o.jsx("em",{className:"pay-err",role:"alert",children:p.uploadError})]}),o.jsx("p",{className:"pay-hint",children:"We'll check your payment and confirm your order shortly. Place Order unlocks once all three details are filled."})]})]})},E0=({order:u,whatsappHref:h})=>{const p=u==null?void 0:u.payment;return!p||p.method!=="JazzCash/Raast"?null:u.orderStatus==="Payment Pending Verification"?o.jsxs("div",{className:"pay-banner is-wait",children:[o.jsxs("b",{children:[o.jsx(ee.Hourglass,{"aria-hidden":"true",style:{marginRight:6,verticalAlign:"-2px"}}),"Payment under verification"]}),o.jsx("p",{children:"Thanks! We'll verify your payment and confirm your order shortly. This page updates automatically."}),o.jsxs("small",{children:["TID ",p.tid]})]}):p.status==="Rejected"?o.jsxs("div",{className:"pay-banner is-bad",role:"alert",children:[o.jsxs("b",{children:[o.jsx(ee.CrossCircle,{"aria-hidden":"true",style:{marginRight:6,verticalAlign:"-2px"}}),"Payment not verified"]}),o.jsx("p",{children:p.rejectionReason||"We couldn't confirm your payment."}),o.jsx("a",{className:"pay-btn-wa",href:h,target:"_blank",rel:"noopener noreferrer",children:"Message us on WhatsApp"})]}):p.status==="Verified"?o.jsxs("div",{className:"pay-banner is-ok",children:[o.jsxs("b",{children:[o.jsx(ee.CheckCircle,{"aria-hidden":"true",style:{marginRight:6,verticalAlign:"-2px"}}),"Payment verified"]}),o.jsxs("p",{children:["Paid via JazzCash/Raast · TID ",p.tid]})]}):null},Md={viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:1.8,strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",focusable:"false"},va=()=>o.jsx("svg",{viewBox:"0 0 24 24",fill:"currentColor","aria-hidden":"true",focusable:"false",children:o.jsx("path",{d:"M12 2.5l2.9 6.1 6.6.9-4.8 4.6 1.2 6.6L12 17.5l-5.9 3.2 1.2-6.6L2.5 9.5l6.6-.9L12 2.5z"})}),N0=()=>o.jsxs("svg",{...Md,children:[o.jsx("path",{d:"M12 20h9"}),o.jsx("path",{d:"M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4L16.5 3.5z"})]}),P0=()=>o.jsx("svg",{...Md,width:"20",height:"20",children:o.jsx("path",{d:"M6 6l12 12M18 6L6 18"})}),xd=({value:u,label:h})=>o.jsx("span",{className:"v2-stars",role:"img","aria-label":h||`${u} out of 5 stars`,children:[1,2,3,4,5].map(p=>o.jsx("span",{className:p<=Math.round(u)?"":"off",style:{display:"inline-flex"},children:o.jsx(va,{})},p))}),vd=["#E6392F","#d97706","#1a9e56","#2563eb","#7c3aed","#db2777","#0f766e"],_0=(u="")=>{let h=0;for(let p=0;p<u.length;p+=1)h=h*31+u.charCodeAt(p)>>>0;return vd[h%vd.length]},T0=u=>{const h=new Date(u).getTime();if(!h)return"";const p=Math.max(0,(Date.now()-h)/1e3);if(p<60)return"just now";const j=p/60;if(j<60)return`${Math.floor(j)} min ago`;const k=j/60;if(k<24)return`${Math.floor(k)} hour${Math.floor(k)===1?"":"s"} ago`;const L=k/24;if(L<30)return`${Math.floor(L)} day${Math.floor(L)===1?"":"s"} ago`;const ae=L/30;return ae<12?`${Math.floor(ae)} month${Math.floor(ae)===1?"":"s"} ago`:`${Math.floor(ae/12)} year${Math.floor(ae/12)===1?"":"s"} ago`},yd=["","Poor","Fair","Good","Very good","Excellent"],Ld="gzp-reviewer-name",M0=()=>{try{return localStorage.getItem(Ld)||""}catch{return""}},L0=u=>{try{localStorage.setItem(Ld,u)}catch{}},F0=({onOrder:u,onTrack:h,summary:p})=>o.jsx("section",{className:"v2-hero",children:o.jsxs("div",{className:"v2-wrap",children:[o.jsxs("div",{className:"v2-intro",children:[o.jsxs("div",{className:"v2-intro-copy",children:[o.jsxs("span",{className:"v2-eyebrow",children:[o.jsx("i",{})," Delivery & pickup in Gojra"]}),o.jsxs("h1",{children:["Hot, cheesy & ",o.jsx("em",{children:"delivered"})," to your door"]}),o.jsx("p",{className:"lead",children:"Fresh pizzas, burgers and sides made to order."})]}),o.jsxs("div",{className:"v2-cta",children:[o.jsx("button",{type:"button",className:"gzp-btn gzp-btn-primary",onClick:u,children:"Order now"}),o.jsx("button",{type:"button",className:"gzp-btn gzp-btn-ghost",onClick:h,children:"Track my order"})]})]}),o.jsxs("ul",{className:"v2-chips","aria-label":"Highlights",children:[o.jsxs("li",{children:[o.jsx(ee.Cash,{"aria-hidden":"true"})," Cash on delivery"]}),o.jsxs("li",{children:[o.jsx(ee.Pin,{"aria-hidden":"true"})," Live order tracking"]}),o.jsxs("li",{children:[o.jsx(ee.Puzzle,{"aria-hidden":"true"})," Build your own deal"]}),(p==null?void 0:p.total)>0&&o.jsxs("li",{className:"rating",children:[o.jsx(va,{})," ",p.average," · ",p.total," review",p.total===1?"":"s"]})]})]})}),R0=[{Icon:ee.Pizza,title:"Made to order",text:"Every pizza is built fresh when you order, never sitting under a heat lamp.",tag:"Fresh"},{Icon:ee.Rider,title:"Home delivery",text:"Riders bring it hot to your door. See your area's fee and time before you pay.",tag:"Door to door"},{Icon:ee.Store,title:"Pickup from the restaurant",text:"Skip the delivery fee. Order ahead and collect it from the counter when it is ready.",tag:"No fee"},{Icon:ee.Card,title:"Pay your way",text:"Cash on delivery or at pickup, or scan the JazzCash / Raast QR. No sign-up needed.",tag:"Flexible"},{Icon:ee.Puzzle,title:"Build your own deal",text:"Mix flavours, sizes and sides into a bundle that fits your crowd and your budget.",tag:"Save more"},{Icon:ee.Pin,title:"Live order tracking",text:"Follow your order from the kitchen to your hands, with an estimated time on the way.",tag:"Real time"}],I0=()=>o.jsxs("section",{className:"s3-section",id:"section-why",children:[o.jsxs("div",{className:"s3-head",children:[o.jsx("span",{className:"v2-kicker",children:"What we deliver"}),o.jsx("h2",{className:"v2-title",children:"Good food, your way"}),o.jsx("p",{className:"s3-lead",children:"Fresh from the oven, to your door or your hands. Here is what you get with every order."})]}),o.jsx("div",{className:"s3-deliver",children:R0.map(({Icon:u,title:h,text:p,tag:j})=>o.jsxs("article",{className:"s3-card",children:[o.jsxs("div",{className:"s3-card-top",children:[o.jsx("span",{className:"s3-ico",children:o.jsx(u,{"aria-hidden":"true"})}),o.jsx("span",{className:"s3-tag",children:j})]}),o.jsx("h3",{children:h}),o.jsx("p",{children:p})]},h))})]}),O0=[{Icon:ee.Utensils,title:"Pick your food",text:"Browse the menu and deals, choose size and crust, and add everything to your order."},{Icon:ee.Rider,title:"Delivery or pickup",text:"Choose home delivery or collect it yourself. Fees and times are shown up front."},{Icon:ee.Card,title:"Confirm and pay",text:"Add your name and phone. Pay in cash or by JazzCash / Raast. No account needed."},{Icon:ee.Clock,title:"Track and enjoy",text:"Watch your order progress live, then enjoy it hot, at your door or at the counter."}],D0=()=>o.jsx("section",{className:"s3-how",id:"section-how",children:o.jsxs("div",{className:"s3-how-inner",children:[o.jsxs("div",{className:"s3-head is-light",children:[o.jsx("span",{className:"v2-kicker",children:"How it works"}),o.jsx("h2",{className:"v2-title",children:"Four easy steps to a full table"}),o.jsx("p",{className:"s3-lead",children:"From first tap to first bite takes just a couple of minutes."})]}),o.jsx("ol",{className:"s3-steps",children:O0.map(({Icon:u,title:h,text:p},j)=>o.jsxs("li",{className:"s3-step",children:[o.jsxs("div",{className:"s3-step-ico",children:[o.jsx(u,{"aria-hidden":"true"}),o.jsx("b",{children:j+1})]}),o.jsx("h3",{children:h}),o.jsx("p",{children:p})]},h))})]})}),B0=({value:u,onChange:h})=>{const[p,j]=I.useState(0),k=p||u;return o.jsxs("div",{className:"v2-starpick",role:"radiogroup","aria-label":"Your rating",onMouseLeave:()=>j(0),children:[[1,2,3,4,5].map(L=>o.jsx("button",{type:"button",role:"radio","aria-checked":u===L,"aria-label":`${L} star${L===1?"":"s"} — ${yd[L]}`,className:L<=k?"on":"",onMouseEnter:()=>j(L),onFocus:()=>j(L),onBlur:()=>j(0),onClick:()=>h(L),children:o.jsx(va,{})},L)),o.jsx("span",{className:"lbl",children:yd[k]||"Tap a star"})]})},$0=({onClose:u,onSubmitted:h})=>{const[p,j]=I.useState(M0),[k,L]=I.useState(0),[ae,G]=I.useState(""),[F,B]=I.useState(""),[Y,H]=I.useState(""),[ie,ne]=I.useState(""),[he,ze]=I.useState(!1),[W,ue]=I.useState(""),[Pe,Ke]=I.useState(!1);I.useEffect(()=>{const Ee=ve=>ve.key==="Escape"&&u();window.addEventListener("keydown",Ee);const ke=document.body.style.overflow;return document.body.style.overflow="hidden",()=>{window.removeEventListener("keydown",Ee),document.body.style.overflow=ke}},[u]);const Te=async Ee=>{if(Ee.preventDefault(),!he){if(!p.trim())return ue("Please enter your name.");if(!k)return ue("Please choose a star rating.");if(Y.trim().length<10)return ue("Please write at least a few words about your experience.");ue(""),ze(!0);try{const ke=await ff({name:p,rating:k,dish:ae,title:F,comment:Y,website:ie});L0(p.trim()),Ke(!0),h(ke==null?void 0:ke.data)}catch(ke){ue(ke.message||"Could not send your review. Please try again.")}finally{ze(!1)}}};return o.jsx("div",{className:"v2-rvm-overlay",onMouseDown:Ee=>Ee.target===Ee.currentTarget&&u(),role:"presentation",children:o.jsx("div",{className:"v2-rvm",role:"dialog","aria-modal":"true","aria-label":"Write a review",children:Pe?o.jsxs("div",{className:"v2-thanks",children:[o.jsx("div",{className:"big","aria-hidden":"true",children:o.jsx(ee.CheckCircle,{})}),o.jsx("h3",{children:"Thank you!"}),o.jsx("p",{children:"Your review is live. It really helps other hungry people in Gojra."}),o.jsx("button",{type:"button",className:"gzp-btn gzp-btn-primary gzp-btn-block",onClick:u,children:"Done"})]}):o.jsxs(o.Fragment,{children:[o.jsxs("div",{className:"v2-rvm-head",children:[o.jsxs("div",{children:[o.jsx("h3",{children:"Write a review"}),o.jsx("p",{children:"Tell us how we did — it only takes a minute."})]}),o.jsx("button",{type:"button",className:"gzp-icon-btn",onClick:u,"aria-label":"Close",children:o.jsx(P0,{})})]}),o.jsxs("form",{className:"v2-rvm-form",onSubmit:Te,noValidate:!0,children:[o.jsxs("div",{children:[o.jsx("div",{style:{fontWeight:700,fontSize:".86rem",marginBottom:6},children:"Your rating"}),o.jsx(B0,{value:k,onChange:L})]}),o.jsxs("label",{className:"f",children:[o.jsx("span",{children:"Your name"}),o.jsx("input",{type:"text",value:p,maxLength:60,autoComplete:"name",placeholder:"e.g. Ayesha K.",onChange:Ee=>j(Ee.target.value)})]}),o.jsxs("label",{className:"f",children:[o.jsxs("span",{children:["What did you order? ",o.jsx("small",{children:"(optional)"})]}),o.jsx("input",{type:"text",value:ae,maxLength:80,placeholder:"e.g. Fajita pizza",onChange:Ee=>G(Ee.target.value)})]}),o.jsxs("label",{className:"f",children:[o.jsxs("span",{children:["Headline ",o.jsx("small",{children:"(optional)"})]}),o.jsx("input",{type:"text",value:F,maxLength:100,placeholder:"Sum it up in a few words",onChange:Ee=>B(Ee.target.value)})]}),o.jsxs("label",{className:"f",children:[o.jsx("span",{children:"Your review"}),o.jsx("textarea",{value:Y,maxLength:1200,placeholder:"How was the food, the delivery, the service?",onChange:Ee=>H(Ee.target.value)}),o.jsxs("span",{className:"v2-count",children:[Y.length,"/1200"]})]}),o.jsx("input",{className:"v2-hp",type:"text",tabIndex:-1,autoComplete:"off","aria-hidden":"true",value:ie,onChange:Ee=>ne(Ee.target.value)}),W&&o.jsx("p",{className:"v2-form-error",role:"alert",children:W}),o.jsxs("div",{className:"v2-rvm-actions",children:[o.jsx("button",{type:"button",className:"gzp-btn gzp-btn-ghost",onClick:u,children:"Cancel"}),o.jsx("button",{type:"submit",className:"gzp-btn gzp-btn-primary",disabled:he,children:he?"Sending…":"Post review"})]})]})]})})})},A0=({onSummary:u})=>{const[h,p]=I.useState([]),[j,k]=I.useState({total:0,average:0,distribution:{}}),[L,ae]=I.useState(!0),[G,F]=I.useState(""),[B,Y]=I.useState(!1),[H,ie]=I.useState(6),ne=I.useCallback(async()=>{var W,ue;try{const Pe=await pf(60);p(((W=Pe.data)==null?void 0:W.reviews)||[]),k(((ue=Pe.data)==null?void 0:ue.summary)||{total:0,average:0,distribution:{}}),F("")}catch(Pe){F(Pe.message||"Could not load reviews.")}finally{ae(!1)}},[]);I.useEffect(()=>{ne()},[ne]),I.useEffect(()=>{u==null||u(j)},[j,u]);const he=I.useMemo(()=>[5,4,3,2,1].map(W=>{var Pe;const ue=((Pe=j.distribution)==null?void 0:Pe[W])||0;return{n:W,count:ue,pct:j.total?Math.round(ue/j.total*100):0}}),[j]),ze=()=>Y(!0);return o.jsxs("section",{className:"s3-section",id:"section-reviews",children:[o.jsxs("div",{className:"s3-head",children:[o.jsx("span",{className:"v2-kicker",children:"Reviews"}),o.jsx("h2",{className:"v2-title",children:"What Gojra is saying"}),o.jsx("p",{className:"s3-lead",children:"Honest words from people who ordered with us."})]}),o.jsxs("div",{className:"s3-rv-layout",children:[o.jsxs("aside",{className:"s3-rv-summary","aria-label":"Rating summary",children:[o.jsxs("div",{className:"s3-rv-score",children:[o.jsx("b",{children:j.total?j.average.toFixed(1):"–"}),o.jsxs("div",{children:[o.jsx(xd,{value:j.average}),o.jsx("small",{children:j.total?`${j.total} review${j.total===1?"":"s"}`:"No reviews yet"})]})]}),o.jsx("div",{className:"s3-bars",children:he.map(W=>o.jsxs("div",{className:"s3-bar",children:[o.jsxs("span",{className:"s3-barn",children:[W.n," ",o.jsx(va,{})]}),o.jsx("i",{children:o.jsx("span",{style:{width:`${W.pct}%`}})}),o.jsx("em",{children:W.count})]},W.n))}),o.jsxs("button",{type:"button",className:"s3-write",onClick:ze,children:[o.jsx(N0,{})," Write a review"]})]}),o.jsxs("div",{children:[o.jsxs("div",{className:"s3-rv-list",children:[L&&o.jsx("div",{className:"v2-rv-empty",children:"Loading reviews…"}),!L&&G&&h.length===0&&o.jsxs("div",{className:"v2-rv-empty",children:[o.jsx("b",{children:"Couldn't load reviews"}),G,o.jsx("div",{style:{marginTop:14},children:o.jsx("button",{type:"button",className:"gzp-btn gzp-btn-ghost",onClick:()=>{ae(!0),ne()},children:"Try again"})})]}),!L&&!G&&h.length===0&&o.jsxs("div",{className:"v2-rv-empty",children:[o.jsx("span",{"aria-hidden":"true",className:"s3-empty-ico",children:o.jsx(ee.Star,{})}),o.jsx("b",{children:"Be the first to review"}),"Ate with us? Tell others what you thought."]}),h.slice(0,H).map(W=>o.jsxs("article",{className:"s3-rv",children:[o.jsx(ee.Quote,{className:"s3-quote","aria-hidden":"true"}),o.jsx(xd,{value:W.rating}),W.title&&o.jsx("h4",{children:W.title}),o.jsx("p",{children:W.comment}),o.jsxs("div",{className:"s3-rv-foot",children:[o.jsx("div",{className:"v2-avatar",style:{background:_0(W.name)},"aria-hidden":"true",children:(W.name||"?").trim().charAt(0).toUpperCase()}),o.jsxs("div",{children:[o.jsx("strong",{children:W.name}),o.jsx("span",{children:T0(W.createdAt)})]}),W.dish&&o.jsxs("span",{className:"v2-rv-dish",children:[o.jsx(ee.Utensils,{"aria-hidden":"true"})," ",W.dish]})]})]},W._id))]}),h.length>H&&o.jsx("button",{type:"button",className:"gzp-btn gzp-btn-ghost v2-more",onClick:()=>ie(W=>W+6),children:"Show more reviews"})]})]}),B&&o.jsx($0,{onClose:()=>Y(!1),onSubmitted:()=>{ne()}})]})},U0=({whatsappLink:u,onTrack:h})=>o.jsxs("section",{className:"v2-contact",id:"section-contact",children:[o.jsxs("div",{className:"v2-panel warm",children:[o.jsx("span",{className:"v2-kicker",children:"Questions?"}),o.jsx("h2",{className:"v2-title",style:{color:"#fff"},children:"Talk to us on WhatsApp"}),o.jsx("p",{className:"v2-sub",children:"Special requests, party orders or a question about your delivery — message the shop directly."}),o.jsx("a",{className:"gzp-btn",href:u,target:"_blank",rel:"noopener noreferrer",children:"Chat on WhatsApp"})]}),o.jsxs("div",{className:"v2-panel",children:[o.jsx("span",{className:"v2-kicker",children:"Good to know"}),o.jsxs("ul",{className:"v2-facts",children:[o.jsxs("li",{children:[o.jsx("span",{"aria-hidden":"true",children:o.jsx(ee.Pin,{})})," Home delivery and restaurant pickup in Gojra"]}),o.jsxs("li",{children:[o.jsx("span",{"aria-hidden":"true",children:o.jsx(ee.Cash,{})})," Cash on delivery or JazzCash / Raast QR"]}),o.jsxs("li",{children:[o.jsx("span",{"aria-hidden":"true",children:o.jsx(ee.Clock,{})})," Live order tracking from the kitchen to you"]})]}),o.jsx("button",{type:"button",className:"gzp-btn gzp-btn-ghost",onClick:h,children:"Track an order"})]})]}),H0=({taxRatePercent:u,onNavigate:h,onTrack:p})=>o.jsx("footer",{className:"v2-footer",children:o.jsxs("div",{className:"v2-wrap",children:[o.jsxs("div",{className:"v2-footer-grid",children:[o.jsxs("div",{children:[o.jsxs("div",{className:"brand",children:[o.jsx("img",{src:zi,alt:""})," GenZ Pizza Land"]}),o.jsxs("p",{children:["Fresh pizzas, burgers and sides, delivered hot across Gojra. Prices are in rupees;"," ",u,"% tax is added at checkout. Pay cash on delivery or by JazzCash / Raast QR."]})]}),o.jsxs("div",{children:[o.jsx("h4",{children:"Explore"}),o.jsxs("ul",{children:[o.jsx("li",{children:o.jsx("button",{type:"button",onClick:()=>h("menu"),children:"Menu"})}),o.jsx("li",{children:o.jsx("button",{type:"button",onClick:()=>h("deals"),children:"Deals"})}),o.jsx("li",{children:o.jsx("button",{type:"button",onClick:()=>h("reviews"),children:"Reviews"})})]})]}),o.jsxs("div",{children:[o.jsx("h4",{children:"Help"}),o.jsxs("ul",{children:[o.jsx("li",{children:o.jsx("button",{type:"button",onClick:p,children:"Track an order"})}),o.jsx("li",{children:o.jsx("button",{type:"button",onClick:()=>h("how"),children:"How it works"})}),o.jsx("li",{children:o.jsx("button",{type:"button",onClick:()=>h("contact"),children:"Contact us"})})]})]})]}),o.jsxs("div",{className:"v2-footer-bottom",children:[o.jsxs("span",{children:["© ",new Date().getFullYear()," GenZ Pizza Land. All rights reserved."]}),o.jsxs("span",{className:"credit",children:["Developed by ",o.jsx("img",{src:vf,alt:""})," ",o.jsx("strong",{children:"Sindbad Solution"})]})]})]})}),W0=`
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
`,Fd="gzp-fulfillment",ki=u=>`Rs. ${Math.round(Number(u)||0).toLocaleString("en-PK")}`,wd=(u="00:00")=>{const[h,p]=u.split(":").map(Number);return`${h%12===0?12:h%12}:${String(p).padStart(2,"0")} ${h>=12?"PM":"AM"}`},V0=u=>{const h=new Date().getDay(),p=((u==null?void 0:u.hours)||[]).find(j=>j.day===h);return p!=null&&p.open?`${wd(p.from)} – ${wd(p.to)}`:"Closed today"},Q0=u=>u&&u.etaMin!=null?`${u.etaMin}–${u.etaMax} min`:"",Y0=()=>{try{return JSON.parse(localStorage.getItem(Fd)||"{}")}catch{return{}}};function K0(u){const h=I.useMemo(Y0,[]),[p,j]=I.useState([]),[k,L]=I.useState(!0),[ae,G]=I.useState(""),[F,B]=I.useState(h.method||"delivery"),[Y,H]=I.useState(h.branchId||""),[ie,ne]=I.useState(h.zoneId||""),[he,ze]=I.useState(h.address||""),[W,ue]=I.useState(null),[Pe,Ke]=I.useState(!1),[Te,Ee]=I.useState(""),ke=I.useCallback(async()=>{L(!0),G("");try{const me=await mf();j(me.data||[])}catch(me){G(me.message||"Couldn't load branches.")}finally{L(!1)}},[]);I.useEffect(()=>{ke()},[ke]),I.useEffect(()=>{if(!p.length)return;const me=p.find(le=>le._id===Y)||p[0];me._id!==Y&&H(me._id);const O=me.delivery.zones;ie&&!O.some(le=>le._id===ie)&&ne(""),!ie&&O.length===1&&ne(O[0]._id)},[p,Y,ie]),I.useEffect(()=>{try{localStorage.setItem(Fd,JSON.stringify({method:F,branchId:Y,zoneId:ie,address:he}))}catch{}},[F,Y,ie,he]);const ve=p.find(me=>me._id===Y)||null;I.useEffect(()=>{if(!Y)return;let me=!1;Ke(!0);const O=setTimeout(async()=>{try{const le=await gf({branchId:Y,method:F,zoneId:ie,subtotal:u});me||(ue(le.data),Ee(""))}catch(le){me||(ue(null),Ee(le.message||"Couldn't check delivery details."))}finally{me||Ke(!1)}},250);return()=>{me=!0,clearTimeout(O)}},[Y,F,ie,u]);const Ge=F!=="delivery"||he.trim().length>=10,Se=!!W&&W.ok&&!Pe&&Ge,lt=W!=null&&W.ok?W.fee:0,Je=Te||(W&&!W.ok?W.error:"")||(F==="delivery"&&(W!=null&&W.ok)&&!Ge?"Enter your full delivery address (house, street, landmark).":"");return{branches:p,branch:ve,loading:k,loadError:ae,reload:ke,method:F,setMethod:me=>B(me),branchId:Y,setBranchId:H,zoneId:ie,setZoneId:ne,address:he,setAddress:ze,quote:W,quoting:Pe,fee:lt,ready:Se,blocker:Je,addressOk:Ge,payload:()=>({method:F,branchId:Y,zoneId:F==="delivery"?ie:void 0})}}const kd=({active:u,onClick:h,icon:p,title:j,desc:k,meta:L,disabled:ae,note:G})=>o.jsxs("button",{type:"button",className:`fx-opt${u?" is-on":""}`,onClick:h,disabled:ae,"aria-pressed":u,children:[o.jsx("span",{className:"fx-opt-ico",children:o.jsx(p,{"aria-hidden":"true"})}),o.jsxs("span",{className:"fx-opt-body",children:[o.jsx("b",{children:j}),o.jsx("small",{children:k}),G?o.jsx("em",{className:"fx-opt-note",children:G}):L?o.jsx("em",{children:L}):null]}),o.jsx("span",{className:"fx-opt-tick","aria-hidden":"true",children:u&&o.jsx(ee.Check,{})})]}),G0=({f:u})=>{const{branch:h,branches:p,method:j,quote:k}=u;if(u.loading)return o.jsx("div",{className:"fx-skeleton","aria-busy":"true",children:"Loading delivery options…"});if(u.loadError)return o.jsxs("div",{className:"fx-alert is-bad",role:"alert",children:[o.jsx(ee.Warning,{"aria-hidden":"true"}),o.jsxs("span",{children:[u.loadError," ",o.jsx("button",{type:"button",className:"fx-link",onClick:u.reload,children:"Try again"})]})]});if(!h)return o.jsx("div",{className:"fx-alert is-bad",children:"No branch is accepting orders right now."});const L=h.delivery.zones,ae=h.delivery,G=h.pickup,F=!ae.enabled||!!ae.blockedReason,B=!G.enabled||!!G.blockedReason,Y=L.find(ne=>ne._id===u.zoneId),H=Y?`${ki(Y.fee)} · ${Y.travelMinutes+ae.prepMinutes}+ min`:L.length?`From ${ki(Math.min(...L.map(ne=>ne.fee)))}`:"",ie=`Free · ready in ~${G.prepMinutes} min`;return o.jsxs("section",{className:"fx","aria-label":"Delivery or pickup",children:[o.jsx("h3",{className:"fx-h",children:"How do you want your order?"}),o.jsxs("div",{className:"fx-opts",role:"group","aria-label":"Fulfillment method",children:[o.jsx(kd,{active:j==="delivery",onClick:()=>u.setMethod("delivery"),icon:ee.Rider,title:"Home Delivery",desc:"A rider brings it to your door",meta:H,note:F?ae.blockedReason||"Unavailable at this branch":""}),o.jsx(kd,{active:j==="pickup",onClick:()=>u.setMethod("pickup"),icon:ee.Store,title:"Pickup from Restaurant",desc:"Collect it fresh from the counter",meta:ie,note:B?G.blockedReason||"Unavailable at this branch":""})]}),p.length>1&&o.jsxs("div",{className:"fx-block",children:[o.jsx("span",{className:"fx-label",children:j==="pickup"?"Pickup branch":"Delivering from"}),o.jsx("div",{className:"fx-branches",role:"radiogroup","aria-label":"Branch",children:p.map(ne=>{const he=j==="pickup"?!ne.pickup.enabled:!ne.delivery.enabled;return o.jsxs("button",{type:"button",role:"radio","aria-checked":ne._id===h._id,disabled:he,className:`fx-branch${ne._id===h._id?" is-on":""}`,onClick:()=>{u.setBranchId(ne._id),u.setZoneId("")},children:[o.jsx("b",{children:ne.name}),o.jsx("small",{children:ne.address}),o.jsx("span",{className:`fx-pill ${ne.openNow?"is-open":"is-closed"}`,children:he?"Not available":ne.openNow?"Open now":`Opens ${ne.nextOpen||"soon"}`})]},ne._id)})})]}),j==="delivery"?o.jsxs("div",{className:"fx-block",children:[o.jsx("span",{className:"fx-label",children:"Delivery area"}),L.length===0?o.jsxs("div",{className:"fx-alert is-bad",children:[o.jsx(ee.Warning,{"aria-hidden":"true"}),o.jsx("span",{children:"No delivery areas are set up for this branch yet. Please choose Pickup."})]}):o.jsx("div",{className:"fx-zones",role:"radiogroup","aria-label":"Delivery area",children:L.map(ne=>o.jsxs("button",{type:"button",role:"radio","aria-checked":ne._id===u.zoneId,className:`fx-zone${ne._id===u.zoneId?" is-on":""}`,onClick:()=>u.setZoneId(ne._id),children:[o.jsxs("span",{className:"fx-zone-main",children:[o.jsx("b",{children:ne.name}),ne.areas&&o.jsx("small",{children:ne.areas})]}),o.jsxs("span",{className:"fx-zone-fee",children:[ne.fee>0?ki(ne.fee):"Free",o.jsxs("small",{children:[ne.travelMinutes+ae.prepMinutes,"–",ne.travelMinutes+ae.prepMinutes+10," min"]})]})]},ne._id))}),o.jsxs("label",{className:"gzp-field fx-address",children:[o.jsx("span",{children:"Full delivery address"}),o.jsx("textarea",{rows:3,value:u.address,onChange:ne=>u.setAddress(ne.target.value),placeholder:"House or flat number, street, nearest landmark","aria-invalid":u.address.trim().length>0&&u.address.trim().length<10})]}),ae.freeAbove>0&&o.jsxs("p",{className:"fx-hint",children:[o.jsx(ee.Bolt,{"aria-hidden":"true"})," Free delivery on orders over ",ki(ae.freeAbove)," (before tax)."]})]}):o.jsxs("div",{className:"fx-block",children:[o.jsx("span",{className:"fx-label",children:"Pickup details"}),o.jsxs("div",{className:"fx-pickup",children:[o.jsxs("div",{className:"fx-pickup-row",children:[o.jsx(ee.Pin,{"aria-hidden":"true"}),o.jsxs("span",{children:[o.jsx("b",{children:h.name}),o.jsx("br",{}),h.address||"Address available at the restaurant"]})]}),o.jsxs("div",{className:"fx-pickup-row",children:[o.jsx(ee.Clock,{"aria-hidden":"true"}),o.jsxs("span",{children:["Today: ",V0(h)]})]}),h.phone&&o.jsxs("div",{className:"fx-pickup-row",children:[o.jsx(ee.Call,{"aria-hidden":"true"}),o.jsx("span",{children:h.phone})]}),G.instructions&&o.jsxs("div",{className:"fx-pickup-row",children:[o.jsx(ee.Bag,{"aria-hidden":"true"}),o.jsx("span",{children:G.instructions})]})]})]}),o.jsxs("div",{className:"fx-summary","aria-live":"polite",children:[o.jsxs("div",{children:[o.jsxs("small",{children:["Estimated ",j==="delivery"?"delivery":"ready in"]}),o.jsx("b",{children:k?Q0(k)||"—":u.quoting?"…":"—"})]}),o.jsxs("div",{children:[o.jsx("small",{children:j==="delivery"?"Delivery fee":"Pickup fee"}),o.jsx("b",{children:k!=null&&k.ok?k.fee>0?ki(k.fee):"Free":"—"})]}),(k==null?void 0:k.minOrder)>0&&o.jsxs("div",{children:[o.jsx("small",{children:"Minimum order"}),o.jsx("b",{children:ki(k.minOrder)})]})]}),u.blocker&&o.jsxs("div",{className:"fx-alert is-bad",role:"alert",children:[o.jsx(ee.Warning,{"aria-hidden":"true"}),o.jsx("span",{children:u.blocker})]})]})},q0=`
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
`,bi={enabled:!0,minItems:3,discount3:15,discount4:17,discount5Plus:20,description:"Pick any 3 or more items from our menu — pizzas, burgers, wings, drinks, anything. The more you add, the more you save. No codes, the discount applies automatically."},Vs=u=>{const h=(j,k)=>typeof j=="number"&&!Number.isNaN(j)?j:k,p=u&&typeof u=="object"?u:{};return{enabled:typeof p.enabled=="boolean"?p.enabled:bi.enabled,minItems:Math.max(1,Math.round(h(p.minItems,bi.minItems))),discount3:h(p.discount3,bi.discount3),discount4:h(p.discount4,bi.discount4),discount5Plus:h(p.discount5Plus,bi.discount5Plus),description:typeof p.description=="string"?p.description:bi.description}},xa=(u,h)=>!h.enabled||u<h.minItems?0:u>=5?h.discount5Plus:u===4?h.discount4:h.discount3,Vr=u=>`${Number.isInteger(u)?u:Number(u.toFixed(1))}%`,ua=u=>{const h=Number(u)||0;return`Rs ${h.toLocaleString("en-PK",{minimumFractionDigits:Number.isInteger(h)?0:2,maximumFractionDigits:2})}`},Rd=(u,h)=>{const p=h.minItems-u;if(u===0)return`Pick ${h.minItems} items to unlock ${Vr(h.discount3)} off`;if(p>0)return`Add ${p} more item${p===1?"":"s"} to unlock ${Vr(h.discount3)} off`;const j=xa(u,h),k=u>=5?null:u+1,L=k?xa(k,h):null;return L&&L>j?`${Vr(j)} off unlocked — add 1 more item for ${Vr(L)} off`:u>=5?`Best discount unlocked — ${Vr(j)} off your picks`:`${Vr(j)} off unlocked`},X0=`
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
`,Z0=({cfg:u,pickedCount:h,onStart:p})=>o.jsx("section",{className:"gzp-byo-section","aria-label":"Build your own deal",children:o.jsx("div",{className:"gzp-shell",children:o.jsxs("div",{className:"gzp-byo-banner",children:[o.jsxs("div",{style:{position:"relative",zIndex:1},children:[o.jsxs("span",{className:"gzp-byo-eyebrow",children:[o.jsx(ee.Target,{"aria-hidden":"true"})," Make it yours"]}),o.jsxs("h2",{children:["Build your ",o.jsx("em",{children:"own deal"})]}),u.description&&o.jsx("p",{children:u.description}),o.jsx("button",{type:"button",className:"gzp-btn gzp-btn-primary",onClick:p,children:h>0?`Edit your deal (${h} item${h===1?"":"s"})`:"Start building"})]}),o.jsxs("div",{className:"gzp-byo-tiers",children:[o.jsxs("div",{className:"gzp-byo-tier",children:[o.jsx("b",{children:Vr(u.discount3)}),o.jsx("small",{children:"off"}),o.jsxs("span",{children:[u.minItems," items"]})]}),o.jsxs("div",{className:"gzp-byo-tier",children:[o.jsx("b",{children:Vr(u.discount4)}),o.jsx("small",{children:"off"}),o.jsx("span",{children:"4 items"})]}),o.jsxs("div",{className:"gzp-byo-tier is-best",children:[o.jsx("b",{children:Vr(u.discount5Plus)}),o.jsx("small",{children:"off"}),o.jsx("span",{children:"5+ items"})]})]})]})})}),J0=u=>{const h=[];return((u==null?void 0:u.variants)||[]).forEach(p=>{p.size&&!h.includes(p.size)&&h.push(p.size)}),h},eh=(u,h)=>{const p=[];return((u==null?void 0:u.variants)||[]).forEach(j=>{j.size===h&&j.crust&&!p.includes(j.crust)&&p.push(j.crust)}),p},Id=(u,h,p)=>((u==null?void 0:u.variants)||[]).find(j=>j.size===h&&(j.crust||"")===(p||""))||null,Od=(u,h="",p="")=>`${u}:${h||""}||${p||""}`,th=({dish:u,picks:h,dishQty:p,stockLeft:j,onAdd:k,onRemove:L})=>{const ae=I.useMemo(()=>J0(u),[u]),G=ae.length>0,[F,B]=I.useState(ae[0]||""),Y=I.useMemo(()=>eh(u,F),[u,F]),[H,ie]=I.useState(Y[0]||""),[ne,he]=I.useState(!1);I.useEffect(()=>{Y.length>0&&!Y.includes(H)?ie(Y[0]):Y.length===0&&H!==""&&ie("")},[F]);const ze=G?Id(u,F,H):null,W=G?(u.variants||[]).reduce((Se,lt)=>Se===null||lt.price<Se.price?lt:Se,null):null,ue=G?(ze==null?void 0:ze.price)??(W==null?void 0:W.price)??u.price:u.price,Pe=Od(u._id,F,H),Ke=h[Pe]||0,Te=p,Ee=typeof u.availableQty=="number"&&j<=0&&Te===0,ke=typeof u.availableQty=="number"&&j<=0,ve=(!G||!!ze)&&!ke,Ge=_n(u.image);return o.jsxs("div",{className:`gzp-byo-tile${Te>0?" is-picked":""}`,children:[o.jsxs("div",{className:"gzp-byo-tile-media",children:[Ge&&!ne?o.jsx("img",{src:Ge,alt:u.name,loading:"lazy",onError:()=>he(!0)}):o.jsx("span",{"aria-hidden":"true",children:o.jsx(ga,{icon:u.icon})}),Te>0&&o.jsxs("span",{className:"gzp-byo-badge",children:["×",Te]})]}),o.jsxs("div",{className:"gzp-byo-tile-body",children:[o.jsx("h4",{children:u.name}),o.jsxs("div",{className:"gzp-byo-price",children:[G&&o.jsx("small",{children:"From"}),ua(ue)]}),G&&o.jsxs("div",{className:"gzp-byo-selects",children:[o.jsx("select",{className:"gzp-select",value:F,onChange:Se=>B(Se.target.value),"aria-label":`Size for ${u.name}`,children:ae.map(Se=>o.jsx("option",{value:Se,children:Se},Se))}),Y.length>0&&o.jsx("select",{className:"gzp-select",value:H,onChange:Se=>ie(Se.target.value),"aria-label":`Crust for ${u.name}`,children:Y.map(Se=>o.jsx("option",{value:Se,children:Se},Se))})]}),o.jsx("div",{className:"gzp-byo-tile-foot",children:Ke>0?o.jsxs("div",{className:"gzp-stepper",style:{width:"100%",justifyContent:"space-between"},children:[o.jsx("button",{type:"button",onClick:()=>L(Pe),"aria-label":`Remove one ${u.name}`,children:"−"}),o.jsx("span",{"aria-live":"polite",children:Ke}),o.jsx("button",{type:"button",disabled:!ve,onClick:()=>k(u,F,H),"aria-label":`Add one more ${u.name}`,children:"+"})]}):o.jsx("button",{type:"button",className:"gzp-byo-add",disabled:!ve,onClick:()=>k(u,F,H),children:Ee?"Sold out":"+ Add"})})]})]})},rh=({cfg:u,dishes:h,categories:p,initialPicks:j,getOtherQty:k,onClose:L,onConfirm:ae})=>{const[G,F]=I.useState(()=>({...j||{}})),[B,Y]=I.useState("all");I.useEffect(()=>{const q=document.body.style.overflow;document.body.style.overflow="hidden";const me=O=>O.key==="Escape"&&L();return window.addEventListener("keydown",me),()=>{document.body.style.overflow=q,window.removeEventListener("keydown",me)}},[L]);const H=I.useMemo(()=>{const q={};return h.forEach(me=>{q[me._id]=me}),q},[h]),ie=I.useMemo(()=>{const q=new Map;h.forEach(Le=>{var Z;const Be=((Z=Le.category)==null?void 0:Z._id)||Le.category||"other";q.has(Be)||q.set(Be,[]),q.get(Be).push(Le)});const me=p.filter(Le=>(q.get(Le._id)||[]).length>0).map(Le=>({id:Le._id,name:Le.name,items:q.get(Le._id)})),O=new Set(p.map(Le=>Le._id)),le=h.filter(Le=>{var Be;return!O.has(((Be=Le.category)==null?void 0:Be._id)||Le.category)});return le.length&&me.push({id:"other",name:"More to eat",items:le}),me},[h,p]),ne=q=>Object.entries(G).reduce((me,[O,le])=>O.startsWith(`${q}:`)?me+le:me,0),he=q=>typeof q.availableQty=="number"?q.availableQty-ne(q._id)-(k?k(q._id):0):1/0,ze=(q,me,O)=>{if(he(q)<=0)return;const le=Od(q._id,me,O);F(Le=>({...Le,[le]:(Le[le]||0)+1}))},W=q=>F(me=>{const O={...me,[q]:Math.max(0,(me[q]||0)-1)};return O[q]===0&&delete O[q],O}),{count:ue,gross:Pe}=I.useMemo(()=>{let q=0,me=0;return Object.entries(G).forEach(([O,le])=>{const[Le,Be="||"]=O.split(/:(.+)/),Z=H[Le];if(!Z)return;const[pe,ce]=Be.split("||"),z=pe?Id(Z,pe,ce):null;q+=le,me+=(z?z.price:Z.price)*le}),{count:q,gross:me}},[G,H]),Ke=xa(ue,u),Te=Math.round(Pe*Ke/100),Ee=Pe-Te,ke=ue>=u.minItems,ve=[{n:u.minItems,label:Vr(u.discount3)},{n:4,label:Vr(u.discount4)},{n:5,label:Vr(u.discount5Plus)}].filter((q,me,O)=>me===0||q.n>O[me-1].n),Ge=ve[ve.length-1].n,Se=q=>`${q/Ge*100}%`,lt=`${Math.min(ue,Ge)/Ge*100}%`,Je=B==="all"?ie:ie.filter(q=>q.id===B);return o.jsx("div",{className:"gzp-byo-overlay",onClick:L,children:o.jsxs("div",{className:"gzp-byo-panel",onClick:q=>q.stopPropagation(),role:"dialog","aria-modal":"true","aria-label":"Build your own deal",children:[o.jsxs("div",{className:"gzp-byo-head",children:[o.jsxs("div",{children:[o.jsxs("h2",{children:[o.jsx(ee.Target,{"aria-hidden":"true",style:{marginRight:8,verticalAlign:"-3px"}}),"Build your own deal"]}),o.jsxs("p",{children:["Choose at least ",u.minItems," items — your discount grows with every item."]})]}),o.jsx("button",{className:"gzp-icon-btn",type:"button",onClick:L,"aria-label":"Close",children:o.jsx(ee.Close,{"aria-hidden":"true"})})]}),o.jsxs("div",{className:"gzp-byo-progress",children:[o.jsxs("div",{className:"gzp-byo-track",role:"progressbar","aria-valuemin":0,"aria-valuemax":Ge,"aria-valuenow":Math.min(ue,Ge),children:[o.jsx("div",{className:"gzp-byo-fill",style:{width:lt}}),ve.map(q=>o.jsxs("div",{className:`gzp-byo-mark${ue>=q.n?" is-hit":""}`,style:{left:Se(q.n)},children:[q.n===Ge&&q.n>=5?`${q.n}+`:q.n,o.jsxs("span",{children:[q.label," off"]})]},q.n))]}),o.jsx("p",{className:`gzp-byo-nudge${ke?" is-ok":""}`,children:Rd(ue,u)})]}),o.jsxs("div",{className:"gzp-byo-cats",role:"tablist","aria-label":"Menu categories",children:[o.jsx("button",{type:"button",className:`gzp-byo-cat${B==="all"?" is-active":""}`,onClick:()=>Y("all"),children:"All"}),ie.map(q=>o.jsx("button",{type:"button",className:`gzp-byo-cat${B===q.id?" is-active":""}`,onClick:()=>Y(q.id),children:q.name},q.id))]}),o.jsx("div",{className:"gzp-byo-body",children:Je.map(q=>o.jsxs("div",{className:"gzp-byo-group",children:[o.jsx("h3",{children:q.name}),o.jsx("div",{className:"gzp-byo-grid",children:q.items.map(me=>o.jsx(th,{dish:me,picks:G,dishQty:ne(me._id),stockLeft:he(me),onAdd:ze,onRemove:W},me._id))})]},q.id))}),o.jsxs("div",{className:"gzp-byo-foot",children:[o.jsxs("div",{className:"gzp-byo-sum",children:[o.jsxs("small",{children:[ue," item",ue===1?"":"s"," picked"]}),o.jsxs("div",{children:[o.jsx("b",{children:ua(Ee)}),Te>0&&o.jsx("s",{children:ua(Pe)}),Te>0&&o.jsxs("em",{children:["You save ",ua(Te)]})]})]}),o.jsx("button",{type:"button",className:"gzp-btn gzp-btn-primary",disabled:!ke,onClick:()=>ae(G),children:ke?`Add to my order · ${Vr(Ke)} off`:`Pick ${u.minItems-ue} more to continue`})]})]})})},nh="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,400..900&family=Hanken+Grotesk:wght@400..800&display=swap",oh=`
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
`;(()=>{if(typeof document>"u")return;if(!document.getElementById("gzp-fonts")){const h=document.createElement("link");h.rel="preconnect",h.href="https://fonts.googleapis.com",document.head.appendChild(h);const p=document.createElement("link");p.rel="preconnect",p.href="https://fonts.gstatic.com",p.crossOrigin="",document.head.appendChild(p);const j=document.createElement("link");j.id="gzp-fonts",j.rel="stylesheet",j.href=nh,document.head.appendChild(j)}let u=document.getElementById("gzp-styles");if(u||(u=document.createElement("style"),u.id="gzp-styles",document.head.appendChild(u)),u.textContent=oh+X0+yf+q0+W0,!document.querySelector('meta[name="theme-color"]')){const h=document.createElement("meta");h.name="theme-color",h.content="#FFF8EF",document.head.appendChild(h)}})();const ih=16,lh=["Pending","Accepted","Preparing","Ready to Deliver","Completed"],ah=["Payment Pending Verification","Accepted","Preparing","Ready to Deliver","Completed"],Xs="Payment Pending Verification",bd={[Xs]:"Verifying your payment",Pending:"Order received",Accepted:"Accepted by the kitchen",Preparing:"Preparing your food","Ready to Deliver":"Out for delivery",Completed:"Delivered",Cancelled:"Cancelled"},sh={[Xs]:"Verifying your payment",Pending:"We've got your order",Accepted:"The kitchen is on it",Preparing:"Your food is cooking","Ready to Deliver":"On the way to you",Completed:"Delivered — enjoy",Cancelled:"Order cancelled"},oa="deals",Dd="923259061006",Bd=`https://wa.me/${Dd}?text=${encodeURIComponent("Hello GenZ Pizza Land, I have an inquiry.")}`,uh=1e4,Kt=u=>{const h=Number(u)||0;return`Rs ${h.toLocaleString("en-PK",{minimumFractionDigits:Number.isInteger(h)?0:2,maximumFractionDigits:2})}`},Ks=u=>{const h=[];return((u==null?void 0:u.variants)||[]).forEach(p=>{p.size&&!h.includes(p.size)&&h.push(p.size)}),h},ca=(u,h)=>{const p=[];return((u==null?void 0:u.variants)||[]).forEach(j=>{j.size===h&&j.crust&&!p.includes(j.crust)&&p.push(j.crust)}),p},Gs=(u,h,p)=>((u==null?void 0:u.variants)||[]).find(j=>j.size===h&&(j.crust||"")===(p||""))||null,$d=u=>((u==null?void 0:u.variants)||[]).reduce((h,p)=>h===null||p.price<h.price?p:h,null),ia=u=>{let h=u.replace(/[^\d+]/g,"");return h=h[0]==="+"?"+"+h.slice(1).replace(/\+/g,""):h.replace(/\+/g,""),h.slice(0,14)},zd=u=>{const h=u.replace(/\D/g,"");return h.length>=10&&h.length<=13},Si={width:20,height:20,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:1.8,strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",focusable:"false"},Ad=u=>o.jsxs("svg",{...Si,...u,children:[o.jsx("circle",{cx:"11",cy:"11",r:"7"}),o.jsx("path",{d:"m20 20-3.2-3.2"})]}),ch=u=>o.jsxs("svg",{...Si,...u,children:[o.jsx("path",{d:"M6 8h12l-1 11H7L6 8Z"}),o.jsx("path",{d:"M9.5 8V6.5a2.5 2.5 0 0 1 5 0V8"})]}),dh=u=>o.jsx("svg",{...Si,strokeWidth:2.4,...u,children:o.jsx("path",{d:"M12 5v14M5 12h14"})}),Qs=({dir:u="right",...h})=>o.jsx("svg",{...Si,strokeWidth:2,...h,children:o.jsx("path",{d:u==="left"?"m14.5 5-7 7 7 7":"m9.5 5 7 7-7 7"})}),Ud=u=>o.jsxs("svg",{...Si,...u,children:[o.jsx("path",{d:"M3 7h11v9H3zM14 10h4l3 3v3h-7z"}),o.jsx("circle",{cx:"7",cy:"18",r:"1.6"}),o.jsx("circle",{cx:"17.5",cy:"18",r:"1.6"})]}),ph=({filled:u,...h})=>o.jsx("svg",{...Si,strokeWidth:2,fill:u?"currentColor":"none",...h,children:o.jsx("path",{d:"M12 20.5s-7.3-4.6-9.9-9.1C.5 8 1.9 4.6 5.1 3.6c2-.6 4.1.1 5.4 1.8l1.5 2 1.5-2c1.3-1.7 3.4-2.4 5.4-1.8 3.2 1 4.6 4.4 3 7.8-2.6 4.5-9.9 9.1-9.9 9.1Z"})}),da=({price:u,originalPrice:h,from:p})=>o.jsxs("p",{className:"gzp-price",children:[p&&o.jsx("span",{className:"gzp-price-from",children:"From"}),Kt(u),h>u&&o.jsx("s",{children:Kt(h)})]}),qs=({src:u,alt:h,icon:p,className:j})=>{const[k,L]=I.useState(!1);return I.useEffect(()=>L(!1),[u]),u&&!k?o.jsx("img",{src:u,alt:h,className:j,loading:"lazy",onError:()=>L(!0)}):o.jsx("div",{className:"gzp-media-fallback",children:o.jsx(ga,{icon:p})})},Yo=u=>typeof u!="number"?null:u<=0?{text:"Sold out",out:!0}:u<=5?{text:`Only ${u} left`,out:!1}:null,fh=({slides:u,onSlideClick:h})=>{var B;const[p,j]=I.useState(0),[k,L]=I.useState(!1),ae=I.useRef(typeof window<"u"&&((B=window.matchMedia)==null?void 0:B.call(window,"(prefers-reduced-motion: reduce)").matches)).current;if(I.useEffect(()=>{if(u.length<=1||k||ae)return;const Y=setInterval(()=>j(H=>(H+1)%u.length),4200);return()=>clearInterval(Y)},[u.length,k,ae]),I.useEffect(()=>{p>=u.length&&j(0)},[u.length,p]),u.length===0)return o.jsx("div",{className:"gzp-slider","aria-hidden":"true",children:o.jsx("div",{className:"gzp-slider-fallback",children:o.jsx("img",{src:zi,alt:""})})});const G=u[p],F=!!h;return o.jsxs("div",{className:"gzp-slider",onMouseEnter:()=>L(!0),onMouseLeave:()=>L(!1),onTouchStart:()=>L(!0),onTouchEnd:()=>L(!1),onClick:F?()=>h(G):void 0,role:F?"button":void 0,tabIndex:F?0:void 0,onKeyDown:F?Y=>{(Y.key==="Enter"||Y.key===" ")&&h(G)}:void 0,children:[u.map((Y,H)=>o.jsx("img",{src:Y.url,alt:Y.alt||"","aria-hidden":H!==p||void 0,className:`gzp-slider-img${H===p?" is-active":""}`},Y.url+H)),u.length>1&&o.jsx("div",{className:"gzp-slider-dots",role:"tablist","aria-label":"Featured photos",children:u.map((Y,H)=>o.jsx("button",{type:"button",role:"tab","aria-selected":H===p,"aria-label":`Show photo ${H+1} of ${u.length}`,className:`gzp-slider-dot${H===p?" is-active":""}`,onClick:ie=>{ie.stopPropagation(),j(H)}},H))})]})},hh=()=>o.jsxs("svg",{viewBox:"0 0 140 140",className:"gzp-thankyou-mascot","aria-hidden":"true",children:[o.jsxs("g",{stroke:"#e0b84a",strokeWidth:"3",strokeLinecap:"round",fill:"none",opacity:"0.75",children:[o.jsx("path",{d:"M52 20 C 47 12, 57 9, 53 1"}),o.jsx("path",{d:"M70 20 C 65 12, 75 9, 71 1"}),o.jsx("path",{d:"M88 20 C 83 12, 93 9, 89 1"})]}),o.jsx("path",{d:"M20 32 L120 32 L70 132 Z",fill:"#ffcf5c",stroke:"#e0a92e",strokeWidth:"4",strokeLinejoin:"round"}),o.jsx("path",{d:"M20 32 Q70 47 120 32",fill:"none",stroke:"#e0a92e",strokeWidth:"4",strokeLinecap:"round"}),o.jsx("circle",{cx:"52",cy:"58",r:"6",fill:"#e6503d"}),o.jsx("circle",{cx:"88",cy:"62",r:"6",fill:"#e6503d"}),o.jsx("circle",{cx:"70",cy:"90",r:"6",fill:"#e6503d"}),o.jsx("circle",{cx:"56",cy:"76",r:"5.5",fill:"#3a2b1a"}),o.jsx("circle",{cx:"84",cy:"76",r:"5.5",fill:"#3a2b1a"}),o.jsx("path",{d:"M60 96 Q70 104 80 96",stroke:"#3a2b1a",strokeWidth:"3.5",fill:"none",strokeLinecap:"round"})]}),mh=({order:u,onTrack:h,onContinue:p})=>{const j=String((u==null?void 0:u._id)||"").slice(-6).toUpperCase();return o.jsx("div",{className:"gzp-thankyou-overlay",role:"dialog","aria-modal":"true","aria-label":"Order confirmed",children:o.jsxs("div",{className:"gzp-thankyou-card",children:[o.jsx("span",{className:"gzp-thankyou-sticker tl","aria-hidden":"true",children:o.jsx(ee.Sparkles,{})}),o.jsx("span",{className:"gzp-thankyou-sticker tr","aria-hidden":"true",children:o.jsx(ee.Pizza,{})}),o.jsx("span",{className:"gzp-thankyou-sticker bl","aria-hidden":"true",children:o.jsx(ee.Cheese,{})}),o.jsx("span",{className:"gzp-thankyou-sticker br","aria-hidden":"true",children:o.jsx(ee.Star,{})}),o.jsx("div",{className:"gzp-thankyou-badge",children:o.jsx("img",{src:zi,alt:"GenZ Pizza Land"})}),o.jsx(hh,{}),o.jsx("h2",{className:"gzp-thankyou-title",children:"Thank you!"}),o.jsx("p",{className:"gzp-thankyou-sub",children:(u==null?void 0:u.orderStatus)===Xs?"We'll verify your payment and confirm your order shortly.":"Your order's in and the kitchen's already looking at it."}),j&&o.jsxs("span",{className:"gzp-thankyou-pill",children:["Order #",j]}),o.jsx("button",{type:"button",className:"gzp-thankyou-track-btn",onClick:h,children:"Track My Order"}),o.jsx("button",{type:"button",className:"gzp-thankyou-link",onClick:p,children:"Click for more order"})]})})},pa=({qty:u,onAdd:h,onRemove:p,size:j,label:k})=>o.jsxs("div",{className:`gzp-stepper${j==="lg"?" gzp-stepper-lg":""}`,children:[o.jsx("button",{type:"button",onClick:p,"aria-label":`Remove one ${k}`,children:"−"}),o.jsx("span",{"aria-live":"polite",children:u}),o.jsx("button",{type:"button",onClick:h,"aria-label":`Add one more ${k}`,children:"+"})]}),gh=({dish:u,cart:h,cartKey:p,addToCart:j,removeFromCart:k,onOpenQuickView:L})=>{const ae=I.useMemo(()=>Ks(u),[u]),G=ae.length>0,[F,B]=I.useState(ae[0]||""),Y=I.useMemo(()=>ca(u,F),[u,F]),[H,ie]=I.useState(Y[0]||""),[ne,he]=I.useState(!1);I.useEffect(()=>{Y.length>0&&!Y.includes(H)?ie(Y[0]):Y.length===0&&H!==""&&ie("")},[F]);const ze=G?Gs(u,F,H):null,W=G?$d(u):null,ue=G?(ze==null?void 0:ze.price)??(W==null?void 0:W.price)??u.price:u.price,Pe=G?(ze==null?void 0:ze.originalPrice)??0:u.originalPrice,Ke=p("dish",u._id,F,H),Te=h[Ke]||0,Ee=Yo(u.availableQty),ke=!!(Ee!=null&&Ee.out),ve=(!G||!!ze)&&!ke,Ge=()=>L(u);return o.jsxs("div",{className:"gzp-card",children:[o.jsxs("div",{className:"gzp-card-media",role:"button",tabIndex:0,onClick:Ge,onKeyDown:Se=>Se.key==="Enter"&&Ge(),children:[o.jsx(qs,{src:_n(u.image),alt:u.name,icon:u.icon}),Ee&&o.jsx("span",{className:`gzp-stock${Ee.out?" is-out":""}`,children:Ee.text}),!G&&u.originalPrice>u.price&&o.jsxs("span",{className:"gzp-save",children:["Save ",Math.round((u.originalPrice-u.price)/u.originalPrice*100),"%"]}),o.jsx("button",{type:"button",className:`gzp-wish${ne?" is-active":""}`,onClick:Se=>{Se.stopPropagation(),he(lt=>!lt)},"aria-pressed":ne,"aria-label":ne?`Remove ${u.name} from favourites`:`Add ${u.name} to favourites`,children:o.jsx(ph,{filled:ne})})]}),o.jsxs("div",{className:"gzp-card-body",children:[o.jsx("h3",{role:"button",tabIndex:0,onClick:Ge,onKeyDown:Se=>Se.key==="Enter"&&Ge(),children:u.name}),o.jsx(da,{price:ue,originalPrice:Pe,from:G}),u.description&&o.jsx("p",{className:"gzp-card-desc",children:u.description}),G&&o.jsxs("div",{className:"gzp-variant-row",onClick:Se=>Se.stopPropagation(),role:"presentation",children:[o.jsx("select",{className:"gzp-select",value:F,onChange:Se=>B(Se.target.value),"aria-label":`Size for ${u.name}`,children:ae.map(Se=>o.jsx("option",{value:Se,children:Se},Se))}),Y.length>0&&o.jsx("select",{className:"gzp-select",value:H,onChange:Se=>ie(Se.target.value),"aria-label":`Crust for ${u.name}`,children:Y.map(Se=>o.jsx("option",{value:Se,children:Se},Se))})]}),o.jsx("div",{className:"gzp-card-foot",onClick:Se=>Se.stopPropagation(),role:"presentation",children:Te?o.jsx(pa,{qty:Te,label:u.name,onAdd:()=>j("dish",u._id,u.name,F,H),onRemove:()=>k("dish",u._id,F,H)}):o.jsx("button",{type:"button",className:"gzp-add gzp-add-wide",disabled:!ve,onClick:()=>j("dish",u._id,u.name,F,H),children:ke?"Sold out":o.jsxs(o.Fragment,{children:[o.jsx(dh,{})," Add"]})})})]})]})},xh=()=>o.jsxs("div",{className:"gzp-skeleton",children:[o.jsx("div",{className:"gzp-skeleton-media"}),o.jsxs("div",{className:"gzp-skeleton-lines",children:[o.jsx("i",{}),o.jsx("i",{})]})]}),vh=()=>o.jsx("a",{className:"gzp-whatsapp",href:Bd,target:"_blank",rel:"noopener noreferrer","aria-label":"Chat with us on WhatsApp for any inquiry",title:"WhatsApp inquiry: +92 325 9061006",children:o.jsx("svg",{viewBox:"0 0 32 32",width:"30",height:"30","aria-hidden":"true",fill:"#fff",children:o.jsx("path",{d:"M16.03 3C9.4 3 4 8.38 4 15c0 2.12.56 4.19 1.62 6.01L4 29l8.2-1.58A12.02 12.02 0 0 0 16.03 27C22.66 27 28 21.62 28 15S22.66 3 16.03 3zm0 21.9c-1.8 0-3.56-.48-5.1-1.4l-.37-.22-4.86.94.98-4.73-.24-.39A9.86 9.86 0 0 1 6.1 15c0-5.46 4.45-9.9 9.93-9.9S26 9.54 26 15s-4.5 9.9-9.97 9.9zm5.44-7.4c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.27-.47-2.42-1.49-.9-.8-1.5-1.78-1.67-2.08-.17-.3-.02-.46.13-.61.14-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.05 1.03-1.05 2.5s1.08 2.9 1.23 3.1c.15.2 2.12 3.23 5.13 4.53.72.31 1.28.5 1.71.63.72.23 1.37.2 1.89.12.58-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.13-.27-.2-.57-.35z"})})}),Ys=({minimal:u,cartCount:h,onSearch:p,onCart:j,onNavigate:k,onTrack:L})=>o.jsx("header",{className:"gzp-header",children:o.jsxs("div",{className:"gzp-header-inner",children:[o.jsxs("button",{className:"gzp-brand",onClick:()=>window.scrollTo({top:0,behavior:"smooth"}),type:"button",children:[o.jsx("img",{src:zi,alt:"",className:"gzp-brand-mark"}),o.jsxs("span",{className:"gzp-brand-name",children:["GenZ Pizza Land",o.jsx("span",{className:"gzp-brand-sub",children:"Delivered hot across Gojra"})]})]}),!u&&o.jsxs(o.Fragment,{children:[o.jsxs("nav",{className:"v2-links","aria-label":"Site",children:[o.jsx("button",{type:"button",className:"v2-link",onClick:()=>k==null?void 0:k("menu"),children:"Menu"}),o.jsx("button",{type:"button",className:"v2-link",onClick:()=>k==null?void 0:k("deals"),children:"Deals"}),o.jsx("button",{type:"button",className:"v2-link",onClick:()=>k==null?void 0:k("reviews"),children:"Reviews"}),o.jsx("button",{type:"button",className:"v2-link",onClick:()=>k==null?void 0:k("contact"),children:"Contact"})]}),o.jsxs("button",{className:"v2-track-btn",onClick:L,type:"button",children:[o.jsx(Ud,{})," Track order"]}),o.jsx("button",{className:"gzp-icon-btn",onClick:p,"aria-label":"Search the menu",type:"button",children:o.jsx(Ad,{})}),o.jsxs("button",{className:"gzp-icon-btn gzp-cart-btn",onClick:j,"aria-label":`Your order, ${h} item${h===1?"":"s"}`,type:"button",children:[o.jsx(ch,{}),h>0&&o.jsx("span",{className:"gzp-cart-count",children:h})]})]})]})});function yh(){var d,g,y,_,E,D,re,se,Fe,$e,at,Zt,Jt;const[u,h]=I.useState([]),[p,j]=I.useState([]),[k,L]=I.useState([]),[ae,G]=I.useState([]),[F,B]=I.useState(ih),[Y,H]=I.useState(()=>Vs(null)),[ie,ne]=I.useState(!1),[he,ze]=I.useState({}),[W,ue]=I.useState(!1),[Pe,Ke]=I.useState(!1),[Te,Ee]=I.useState(!0),[ke,ve]=I.useState(""),[Ge,Se]=I.useState(!1),[lt,Je]=I.useState(!1),[q,me]=I.useState(()=>localStorage.getItem("gzp_last_order")||null),[O,le]=I.useState(null),[Le,Be]=I.useState(!1),[Z,pe]=I.useState(!1),ce=O&&!["Completed","Closed","Cancelled"].includes(O.orderStatus),[z,U]=I.useState({name:"",phone:"",address:""}),[Oe,Me]=I.useState(oa);I.useEffect(()=>{let x=null;const C=()=>{document.body.classList.add("is-scrolling"),x&&clearTimeout(x),x=setTimeout(()=>document.body.classList.remove("is-scrolling"),150)};return window.addEventListener("scroll",C,{passive:!0,capture:!0}),()=>{window.removeEventListener("scroll",C,{capture:!0}),x&&clearTimeout(x),document.body.classList.remove("is-scrolling")}},[]);const[He,We]=I.useState(!1),[et,tt]=I.useState(""),[X,rt]=I.useState(null),[jt,Tr]=I.useState(""),[st,Lt]=I.useState(""),[Mr,yr]=I.useState({});I.useEffect(()=>{if((X==null?void 0:X.type)==="dish"){const C=Ks(X.item)[0]||"";Tr(C),Lt(ca(X.item,C)[0]||""),yr({})}else if((X==null?void 0:X.type)==="deal"){Tr(""),Lt("");const x={};(X.item.items||[]).forEach((C,$)=>{var fe;if(!C.customizable)return;const V=(C.flavourOptions||[])[0];if(!V)return;const de=(fe=V.variants)==null?void 0:fe[0];x[$]={dishId:V._id,size:(de==null?void 0:de.size)||"",crust:(de==null?void 0:de.crust)||""}}),yr(x)}else Tr(""),Lt(""),yr({})},[X]);const[Tn,Yr]=I.useState(""),[nr,Nt]=I.useState(!1),[Lr,or]=I.useState(null),[dt,Mn]=I.useState(Ws),[Fr,fn]=I.useState(aa),$t=z0(),[wr,hn]=I.useState(""),[Rr,Kr]=I.useState(!1),[Ln,Ir]=I.useState(""),Fn=I.useRef(null),[ao,kr]=I.useState(!1),Rn=I.useRef(null),mn=I.useRef(null);I.useEffect(()=>{(async()=>{var x,C,$;try{const[V,de,fe,ge,_e]=await Promise.all([af(),dd(),pd().catch(()=>({data:[]})),sf().catch(()=>({data:[]})),hd().catch(()=>null)]);h(V.data||[]),j(de.data||[]),L(fe.data||[]),G(ge.data||[]);const Qe=(x=_e==null?void 0:_e.data)==null?void 0:x.taxRatePercent;typeof Qe=="number"&&B(Qe),(C=_e==null?void 0:_e.data)!=null&&C.payments&&Mn({...Ws,..._e.data.payments}),($=_e==null?void 0:_e.data)!=null&&$.buildYourOwnDeal&&H(Vs(_e.data.buildYourOwnDeal))}catch(V){ve(V.message)}finally{Ee(!1)}})()},[]),I.useEffect(()=>{if(!q)return;let x=!1;const C=async()=>{try{const V=await fd(q);x||le(V.data)}catch(V){if(x)return;V.status===404&&(localStorage.removeItem("gzp_last_order"),me(null),le(null))}};C();const $=setInterval(C,8e3);return()=>{x=!0,clearInterval($)}},[q]),I.useEffect(()=>()=>clearTimeout(mn.current),[]);const Pt=I.useMemo(()=>{const x=new Map;p.forEach(de=>{var ge;const fe=((ge=de.category)==null?void 0:ge._id)||de.category||"other";x.has(fe)||x.set(fe,[]),x.get(fe).push(de)});const C=u.filter(de=>(x.get(de._id)||[]).length>0).map(de=>({id:de._id,name:de.name,icon:de.icon,description:de.description,items:x.get(de._id)})),$=new Set(u.map(de=>de._id)),V=p.filter(de=>{var fe;return!$.has(((fe=de.category)==null?void 0:fe._id)||de.category)});return V.length>0&&C.push({id:"other",name:"More to eat",icon:"utensils",items:V}),C},[u,p]),At=I.useMemo(()=>{const x=Pt.map(C=>({id:C.id,name:C.name}));return k.length>0&&x.unshift({id:oa,name:"Deals"}),x},[Pt,k]),hr=I.useMemo(()=>{const x={};return u.forEach(C=>{x[C._id]=C.name}),x},[u]),Xe=I.useMemo(()=>{const x=et.trim().toLowerCase();if(!x)return[];const C=[];return k.forEach($=>{$.name.toLowerCase().includes(x)&&C.push({type:"deal",item:$})}),p.forEach($=>{$.name.toLowerCase().includes(x)&&C.push({type:"dish",item:$})}),C.slice(0,20)},[et,p,k]),Ut=(x,C,$="",V="")=>`${x}:${C}:${$||""}||${V||""}`,Gr=x=>{try{return`sel:${btoa(encodeURIComponent(JSON.stringify(x)))}`}catch{return"sel:"}},qr=x=>{if(!x||!x.startsWith("sel:"))return null;try{return JSON.parse(decodeURIComponent(atob(x.slice(4))))}catch{return null}},Ht=x=>((x==null?void 0:x.items)||[]).some(C=>C.customizable),Gt=I.useMemo(()=>Object.entries(he).filter(([,x])=>x>0).map(([x,C])=>{const[$,V,de="||"]=x.split(":"),fe=$==="deal"?k.find(bt=>bt._id===V):p.find(bt=>bt._id===V);if(!fe)return null;const[ge,_e]=de.split("||");let Qe=fe.price,gt=fe.originalPrice,ht="",Tt=null;if(($==="dish"||$==="byo")&&ge){const bt=Gs(fe,ge,_e);bt&&(Qe=bt.price,gt=bt.originalPrice,ht=[bt.size,bt.crust].filter(Boolean).join(", "))}if($==="deal"){const bt=qr(ge);bt&&(Tt=bt,ht=Object.values(bt).map(Rt=>{const Ce=p.find(qe=>qe._id===Rt.dishId);return Ce?[Rt.size,Ce.name].filter(Boolean).join(" "):null}).filter(Boolean).join(", "))}return{type:$,item:fe,qty:C,key:x,size:ge,crust:_e,unitPrice:Qe,unitOriginalPrice:gt,variantLabel:ht,dealSelections:Tt}}).filter(Boolean),[he,p,k]),ir=Gt.reduce((x,C)=>x+C.unitPrice*C.qty,0),Xr=Gt.filter(x=>x.type==="byo"),Ft=Xr.reduce((x,C)=>x+C.qty,0),gn=Xr.reduce((x,C)=>x+C.unitPrice*C.qty,0),br=Ft>0?xa(Ft,Y):0,Zr=Math.round(gn*br/100),lr=Ft>0&&Y.enabled?Math.max(0,Y.minItems-Ft):0,Or=Ft>0&&(lr>0||!Y.enabled),Jr=ir-Zr,Dr=Jr*F/100,xn=Jr+Dr,ft=K0(Jr),In=xn+ft.fee,ar=Gt.reduce((x,C)=>x+C.qty,0),qt=I.useCallback((x,C=2e3)=>{Yr(x),clearTimeout(mn.current),mn.current=setTimeout(()=>Yr(""),C)},[]),wt=I.useRef(he);wt.current=he;const vn=I.useRef({dishes:p,deals:k});vn.current={dishes:p,deals:k};const yn=(x,C,$)=>{const V=C==="deal"?["deal"]:["dish","byo"];return Object.entries(x).reduce((de,[fe,ge])=>V.some(_e=>fe.startsWith(`${_e}:${$}:`))?de+ge:de,0)},en=(x,C)=>(x==="deal"?vn.current.deals:vn.current.dishes).find($=>$._id===C),Wt=I.useCallback((x,C,$,V="",de="",fe=null)=>{const ge=en(x,C),_e=$||(ge==null?void 0:ge.name)||"This item",Qe=typeof(ge==null?void 0:ge.availableQty)=="number"?ge.availableQty:1/0;if(yn(wt.current,x,C)+1>Qe){qt(Qe<=0?`Sorry, ${_e} is out of stock right now.`:`Only ${Qe} ${_e} in stock. Please select ${Qe}.`,3500);return}const ht=fe?Ut(x,C,Gr(fe)):Ut(x,C,V,de);wt.current={...wt.current,[ht]:(wt.current[ht]||0)+1},ze(wt.current),$&&qt(`${$} added`)},[qt]),tn=I.useCallback((x,C,$="",V="")=>{const de=Ut(x,C,$,V);wt.current={...wt.current,[de]:Math.max(0,(wt.current[de]||0)-1)},ze(wt.current)},[]),On=I.useCallback(async()=>{var x,C,$;try{const[V,de,fe]=await Promise.all([dd(),pd().catch(()=>null),hd().catch(()=>null)]);j(V.data||[]),de&&L(de.data||[]),(x=fe==null?void 0:fe.data)!=null&&x.buildYourOwnDeal&&H(Vs(fe.data.buildYourOwnDeal)),typeof((C=fe==null?void 0:fe.data)==null?void 0:C.taxRatePercent)=="number"&&B(fe.data.taxRatePercent),($=fe==null?void 0:fe.data)!=null&&$.payments&&Mn({...Ws,...fe.data.payments})}catch{}},[]);I.useEffect(()=>{if(Te)return;const x=()=>{document.hidden||On()},C=setInterval(x,uh);return document.addEventListener("visibilitychange",x),window.addEventListener("focus",x),()=>{clearInterval(C),document.removeEventListener("visibilitychange",x),window.removeEventListener("focus",x)}},[Te,On]),I.useEffect(()=>{const x=wt.current,C={};Object.entries(x).forEach(([de,fe])=>{if(fe<=0)return;const[ge,_e]=de.split(":"),Qe=ge==="byo"?"dish":ge;(C[`${Qe}:${_e}`]=C[`${Qe}:${_e}`]||[]).push(de)});let $=x;const V=[];Object.entries(C).forEach(([de,fe])=>{const[ge,_e]=de.split(":"),Qe=(ge==="deal"?k:p).find(ht=>ht._id===_e);if(!Qe||typeof Qe.availableQty!="number")return;let gt=fe.reduce((ht,Tt)=>ht+$[Tt],0);if(!(gt<=Qe.availableQty)){$={...$};for(const ht of[...fe].reverse()){if(gt<=Qe.availableQty)break;const Tt=Math.min($[ht],gt-Qe.availableQty);$[ht]-=Tt,gt-=Tt}V.push(Qe.availableQty<=0?`${Qe.name} just sold out and was removed from your order.`:`Only ${Qe.availableQty} ${Qe.name} in stock - your order was set to ${Qe.availableQty}.`)}}),V.length>0&&(wt.current=$,ze($),qt(V.join(" "),5e3))},[p,k,qt]);const Vn=x=>{var fe,ge;if(!x)return;const C=(((fe=document.querySelector(".gzp-header"))==null?void 0:fe.offsetHeight)||0)+(((ge=document.querySelector(".gzp-navbar"))==null?void 0:ge.offsetHeight)||0)+8,$=()=>Math.max(0,x.getBoundingClientRect().top+window.scrollY-C);window.scrollTo({top:$(),behavior:"smooth"});let V=0;const de=()=>{V+=1;const _e=$()-window.scrollY;Math.abs(_e)>6&&V<=4&&(window.scrollTo({top:$(),behavior:V<3?"smooth":"auto"}),window.setTimeout(de,450))};window.setTimeout(de,650)},ot=x=>{const C=document.getElementById(`section-${x}`);C&&(Me(x),Vn(C))},_t=x=>{var C,$;if(x==="menu"){const V=k.length>0?oa:(C=At[0])==null?void 0:C.id;if(V)return ot(V)}if(x==="deals"&&k.length===0)return ot(($=At[0])==null?void 0:$.id);Vn(document.getElementById(`section-${x}`))};I.useEffect(()=>{if(Te||q)return;let x=0;const C=()=>{x||(x=requestAnimationFrame(()=>{var de;x=0;const $=160;let V=(de=At[0])==null?void 0:de.id;At.forEach(fe=>{const ge=document.getElementById(`section-${fe.id}`);ge&&ge.getBoundingClientRect().top<=$&&(V=fe.id)}),V&&Me(V)}))};return C(),window.addEventListener("scroll",C,{passive:!0}),()=>{window.removeEventListener("scroll",C),cancelAnimationFrame(x)}},[At,Te,q]),I.useEffect(()=>{const x=Rn.current,C=x==null?void 0:x.querySelector(".is-active");if(x&&C){const $=C.offsetLeft-(x.clientWidth-C.offsetWidth)/2;x.scrollTo({left:Math.max(0,$),behavior:"auto"})}},[Oe]);const wn=x=>{const C=Fn.current;C&&C.scrollBy({left:x*(C.clientWidth*.8),behavior:"smooth"})};I.useEffect(()=>{const x=Fn.current;if(Te||k.length<2||ao||!x||window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;const C=window.setInterval(()=>{const $=x.querySelector(".gzp-deal"),V=x.scrollWidth-x.clientWidth;if(!$||V<=0)return;const de=Number.parseFloat(window.getComputedStyle(x).columnGap)||0,fe=$.getBoundingClientRect().width+de;x.scrollLeft>=V-2?x.scrollTo({left:0,behavior:"smooth"}):x.scrollBy({left:Math.min(fe,V-x.scrollLeft),behavior:"smooth"})},4e3);return()=>window.clearInterval(C)},[k.length,ao,Te]);const kn=W||Pe||nr||He||!!X;I.useEffect(()=>(document.body.style.overflow=kn?"hidden":"",()=>{document.body.style.overflow=""}),[kn]),I.useEffect(()=>{const x=C=>{C.key==="Escape"&&(He?We(!1):X?rt(null):Pe?Ke(!1):nr?Nt(!1):W&&ue(!1))};return window.addEventListener("keydown",x),()=>window.removeEventListener("keydown",x)},[He,X,Pe,nr,W]);const rn=I.useMemo(()=>{if(ae.length>0)return ae.map($=>({url:_n($.image),link:$.link||"",alt:$.altText||""}));const x=new Set,C=[];return[...k,...p].forEach($=>{const V=_n($.image);V&&!x.has(V)&&(x.add(V),C.push({url:V,link:"",alt:""}))}),C.slice(0,8)},[ae,k,p]);I.useEffect(()=>{Fr===aa&&!dt.codEnabled&&dt.jazzcashEnabled&&fn(sa),Fr===sa&&!dt.jazzcashEnabled&&dt.codEnabled&&fn(aa)},[dt,Fr]);const nn=Fr===sa&&dt.jazzcashEnabled,Br=!Ge&&ft.ready&&(!nn||$t.ready),mr=async x=>{if(x.preventDefault(),Gt.length!==0){if(Or){ve(Y.enabled?`Build Your Own Deal needs at least ${Y.minItems} items - add ${lr} more or remove the deal.`:"Build Your Own Deal isn't available right now - please remove it from your order.");return}if(!zd(z.phone)){ve("That mobile number doesn't look complete. Use digits only, e.g. 03001234567.");return}if(!ft.ready){ve(ft.blocker||"Please choose delivery or pickup and fill in the details.");return}if(nn&&!$t.ready){ve("Please add your Transaction ID, sender name/number and payment screenshot first.");return}Se(!0),ve("");try{const C=await uf({customerName:z.name,customerPhone:z.phone,address:ft.method==="delivery"?ft.address:"",fulfillment:ft.payload(),...nn?{paymentMethod:"jazzcash",tid:$t.tid,senderInfo:$t.sender,proofId:$t.proofId}:{paymentMethod:"cod"},items:Gt.map(V=>V.type==="deal"?{dealId:V.item._id,quantity:V.qty,dealSelections:V.dealSelections||void 0}:{dishId:V.item._id,quantity:V.qty,size:V.size||void 0,crust:V.crust||void 0,byo:V.type==="byo"?!0:void 0})}),$=C.data._id;localStorage.setItem("gzp_last_order",$),me($),le(C.data),Be(!0),pe(!1),$t.reset(),ze({}),Ke(!1),ue(!1),window.scrollTo({top:0})}catch(C){(C.status===409||/Build Your Own/i.test(C.message||""))&&On(),ve(C.message)}finally{Se(!1)}}},Xt=async()=>{if(!(!q||lt)){Je(!0);try{const x=await fd(q);le(x.data)}catch(x){x.status===404&&(localStorage.removeItem("gzp_last_order"),me(null),le(null))}finally{Je(!1)}}},[$r,Ct]=I.useState(!1),Qn=async()=>{if(!(!q||$r)&&window.confirm("Cancel this order? You won't be charged anything.")){Ct(!0);try{const x=await cf(q);le(C=>C&&{...C,orderStatus:x.data.orderStatus})}catch(x){window.alert(x.message||"Couldn't cancel the order — please call the shop.")}finally{Ct(!1)}}},Yn=()=>{localStorage.removeItem("gzp_last_order"),me(null),le(null)},Kn=async x=>{x.preventDefault();const C=wr.trim();if(C){if(!zd(C)){Ir("Enter the full mobile number you used at checkout, digits only.");return}Kr(!0),Ir("");try{const $=await df(C);localStorage.setItem("gzp_last_order",$.data._id),me($.data._id),le($.data),Nt(!1),hn("")}catch($){Ir($.status===404?"No recent order on that number. Check the digits and try again.":$.message||"Couldn't reach the kitchen. Try again in a moment.")}finally{Kr(!1)}}},Ar=()=>{const x={};return Object.entries(he).forEach(([C,$])=>{C.startsWith("byo:")&&$>0&&(x[C.slice(4)]=$)}),x},bn=x=>{const C={};Object.entries(wt.current).forEach(([$,V])=>{$.startsWith("byo:")||(C[$]=V)}),Object.entries(x).forEach(([$,V])=>{V>0&&(C[`byo:${$}`]=V)}),wt.current=C,ze(C),ne(!1),ue(!0),qt("Your custom deal is in your order")},on=()=>{const x={};Object.entries(wt.current).forEach(([C,$])=>{C.startsWith("byo:")||(x[C]=$)}),wt.current=x,ze(x)},ln=x=>Object.entries(wt.current).reduce((C,[$,V])=>$.startsWith(`dish:${x}:`)?C+V:C,0),l=x=>o.jsxs("div",{className:"gzp-line",children:[_n(x.item.image)?o.jsx("img",{src:_n(x.item.image),alt:"",onError:C=>{C.currentTarget.style.display="none"}}):o.jsx("span",{className:"gzp-line-icon",children:o.jsx(ga,{icon:x.item.icon})}),o.jsxs("div",{className:"gzp-line-main",children:[o.jsxs("h4",{children:[x.type==="deal"&&o.jsx("span",{className:"gzp-tag",children:"DEAL"}),x.item.name]}),x.variantLabel&&o.jsx("p",{className:"gzp-line-variant",children:x.variantLabel}),o.jsx("span",{children:Kt(x.unitPrice*x.qty)})]}),o.jsx(pa,{qty:x.qty,label:x.item.name,onAdd:()=>Wt(x.type,x.item._id,"",x.size,x.crust),onRemove:()=>tn(x.type,x.item._id,x.size,x.crust)})]},x.key);if(q&&!O)return o.jsxs("div",{className:"gzp-app",children:[o.jsx(Ys,{minimal:!0}),o.jsxs("div",{className:"gzp-boot",children:[o.jsx("img",{src:zi,alt:""}),"Pulling up your order…"]})]});if(q&&O&&Le)return o.jsx(mh,{order:O,onTrack:()=>Be(!1),onContinue:()=>{Be(!1),pe(!0)}});if(q&&O&&!Z){const x=((d=O.payment)==null?void 0:d.method)==="JazzCash/Raast",C=x?ah:lh,$=C.indexOf(O.orderStatus),V=O.orderStatus==="Cancelled",de=String(O._id||"").slice(-6).toUpperCase(),fe=`https://wa.me/${Dd}?text=${encodeURIComponent(`Hello GenZ Pizza Land, I need help with order #${de}.`)}`;return o.jsxs("div",{className:"gzp-app",children:[o.jsx(Ys,{minimal:!0}),o.jsx("div",{className:"gzp-shell",children:o.jsxs("section",{className:"gzp-track",children:[o.jsxs("div",{className:"gzp-track-hero",children:[o.jsxs("div",{className:"gzp-track-top",children:[o.jsxs("div",{style:{flex:1},children:[o.jsx("h1",{children:sh[O.orderStatus]||"Order status"}),o.jsxs("p",{className:"gzp-track-id",children:["Order #",String(O._id||"").slice(-6).toUpperCase()," for"," ",((g=O.customerDetails)==null?void 0:g.name)||"you"]})]}),o.jsx("button",{type:"button",className:"gzp-btn gzp-btn-ghost",onClick:Xt,disabled:lt,children:lt?"Checking…":"Refresh"})]}),o.jsx(E0,{order:O,whatsappHref:fe}),V?x?null:o.jsx("p",{className:"gzp-cancelled",children:"This order was cancelled. Nothing has been charged — you can order again any time."}):o.jsxs(o.Fragment,{children:[o.jsx("p",{className:"gzp-eta",children:"This page updates itself every few seconds. Keep it open and watch it move."}),o.jsx("ol",{className:"gzp-steps",children:C.map((ge,_e)=>o.jsx("li",{className:_e<$?"is-done":_e===$?"is-current":"",children:bd[ge]},ge))}),O.orderStatus==="Pending"&&o.jsx("button",{type:"button",className:"gzp-btn gzp-btn-ghost",style:{marginTop:14,color:"#E6392F",borderColor:"#E6392F"},onClick:Qn,disabled:$r,children:$r?"Cancelling…":"Cancel this order"})]})]}),o.jsxs("div",{className:"gzp-panel",children:[o.jsx("h3",{children:"What's coming"}),(O.items||[]).map((ge,_e)=>{var Qe;return o.jsxs("div",{children:[o.jsxs("div",{className:"gzp-order-line",children:[o.jsxs("span",{children:[ge.isDeal&&o.jsx("span",{className:"gzp-tag",children:"DEAL"}),ge.quantity,"× ",ge.name]}),o.jsx("span",{children:Kt(ge.price*ge.quantity)})]}),ge.isDeal&&((Qe=ge.dealItems)==null?void 0:Qe.length)>0&&o.jsx("p",{className:"gzp-order-sub",children:ge.dealItems.map(gt=>`${gt.quantity>1?gt.quantity+"× ":""}${gt.label}`).join(", ")})]},_e)}),o.jsxs("div",{className:"gzp-totals",style:{marginTop:14},children:[Number((y=O.bills)==null?void 0:y.discount)>0&&o.jsxs("div",{className:"is-discount",children:[o.jsx("span",{children:O.bills.discountLabel||"Build Your Own Deal discount"}),o.jsxs("span",{children:["−",Kt(O.bills.discount)]})]}),Number((_=O.bills)==null?void 0:_.deliveryFee)>0&&o.jsxs("div",{children:[o.jsx("span",{children:"Delivery fee"}),o.jsx("span",{children:Kt(O.bills.deliveryFee)})]}),o.jsxs("div",{className:"gzp-grand",children:[o.jsx("span",{children:x?((E=O.payment)==null?void 0:E.status)==="Verified"?"Paid via JazzCash/Raast":"Total (JazzCash/Raast)":((D=O.fulfillment)==null?void 0:D.method)==="pickup"?"Pay at pickup":"Pay on delivery"}),o.jsx("span",{children:Kt(((re=O.bills)==null?void 0:re.totalWithTax)||0)})]})]})]}),((se=O.fulfillment)==null?void 0:se.method)&&o.jsxs("div",{className:"gzp-panel",children:[o.jsx("h3",{children:O.fulfillment.method==="pickup"?"Pickup from":"Delivering to"}),o.jsxs("p",{style:{margin:0,color:"var(--flour-dim)",fontSize:"0.93rem",lineHeight:1.5},children:[O.fulfillment.method==="pickup"?O.fulfillment.branchName:(Fe=O.customerDetails)==null?void 0:Fe.address,O.fulfillment.method==="delivery"&&O.fulfillment.zoneName?` (${O.fulfillment.zoneName})`:"",O.fulfillment.method==="delivery"&&O.fulfillment.branchName?o.jsxs(o.Fragment,{children:[o.jsx("br",{}),"From ",O.fulfillment.branchName]}):null,(($e=O.fulfillment.estimatedMinutes)==null?void 0:$e.min)!=null&&o.jsxs(o.Fragment,{children:[o.jsx("br",{}),"Estimated ",O.fulfillment.method==="pickup"?"ready time":"arrival",": ",O.fulfillment.estimatedMinutes.min,"–",O.fulfillment.estimatedMinutes.max," min after confirmation"]})]})]}),o.jsxs("a",{className:"gzp-btn gzp-btn-ghost gzp-btn-block pay-help",href:fe,target:"_blank",rel:"noopener noreferrer",children:[o.jsx(ee.Chat,{"aria-hidden":"true",style:{marginRight:8,verticalAlign:"-2px"}}),"Need help? Chat with us on WhatsApp"]}),o.jsx("button",{className:"gzp-btn gzp-btn-ghost gzp-btn-block",style:{marginTop:12},onClick:Yn,type:"button",children:"Start another order"})]})})]})}return o.jsxs("div",{className:"gzp-app",children:[o.jsx(Ys,{cartCount:ar,onSearch:()=>We(!0),onCart:()=>ue(!0),onNavigate:_t,onTrack:()=>Nt(!0)}),Z&&ce&&o.jsxs("div",{className:"gzp-tracking-banner",children:[o.jsxs("span",{children:["Order #",String(O._id||"").slice(-6).toUpperCase()," — ",bd[O.orderStatus]||O.orderStatus]}),o.jsx("button",{type:"button",onClick:()=>pe(!1),children:"Track it"})]}),ke&&!Pe&&o.jsx("div",{className:"gzp-shell",children:o.jsx("p",{className:"gzp-error gzp-error-banner",children:ke})}),o.jsx(F0,{summary:Lr,onOrder:()=>_t("menu"),onTrack:()=>Nt(!0)}),o.jsx("section",{className:"gzp-hero",children:o.jsx(fh,{slides:rn,onSlideClick:x=>{var C;x!=null&&x.link?window.open(x.link,"_blank","noopener,noreferrer"):ot((C=At[0])==null?void 0:C.id)}})}),!Te&&At.length>0&&o.jsx("nav",{className:"gzp-navbar","aria-label":"Menu sections",children:o.jsx("div",{className:"gzp-navbar-inner",children:o.jsx("div",{className:"gzp-navbar-chips",ref:Rn,children:At.map(x=>o.jsx("button",{type:"button",className:`gzp-chip${Oe===x.id?" is-active":""}`,onClick:()=>ot(x.id),children:x.name},x.id))})})}),o.jsxs("div",{className:"gzp-shell",children:[Te?o.jsxs("section",{className:"gzp-section",children:[o.jsxs("div",{className:"gzp-section-head",children:[o.jsx("h2",{children:"Loading the menu"}),o.jsx("div",{className:"gzp-section-rule"})]}),o.jsx("div",{className:"gzp-grid",children:Array.from({length:8}).map((x,C)=>o.jsx(xh,{},C))})]}):o.jsxs(o.Fragment,{children:[Y.enabled&&p.length>0&&o.jsx(Z0,{cfg:Y,pickedCount:Ft,onStart:()=>ne(!0)}),k.length>0&&o.jsxs("section",{className:"gzp-section",id:`section-${oa}`,children:[o.jsxs("div",{className:"gzp-section-head",children:[o.jsx("h2",{children:"Today's deals"}),o.jsxs("span",{className:"gzp-section-count",children:[k.length," bundle",k.length===1?"":"s"]}),o.jsx("div",{className:"gzp-section-rule"}),o.jsxs("div",{className:"gzp-rail-nav",children:[o.jsx("button",{className:"gzp-rail-btn",onClick:()=>wn(-1),"aria-label":"Scroll deals back",type:"button",children:o.jsx(Qs,{dir:"left"})}),o.jsx("button",{className:"gzp-rail-btn",onClick:()=>wn(1),"aria-label":"Scroll deals forward",type:"button",children:o.jsx(Qs,{})})]})]}),o.jsx("div",{className:"gzp-rail-wrap",children:o.jsx("div",{className:"gzp-rail",ref:Fn,onMouseEnter:()=>kr(!0),onMouseLeave:()=>kr(!1),onFocus:()=>kr(!0),onBlur:x=>{x.currentTarget.contains(x.relatedTarget)||kr(!1)},onPointerDown:x=>{x.pointerType!=="mouse"&&kr(!0)},onPointerUp:x=>{x.pointerType!=="mouse"&&kr(!1)},children:k.map(x=>{var V,de,fe;const C=Ut("deal",x._id),$=x.originalPrice>x.price?Math.round((x.originalPrice-x.price)/x.originalPrice*100):0;return o.jsxs("div",{className:"gzp-deal",role:"button",tabIndex:0,onClick:()=>rt({type:"deal",item:x}),onKeyDown:ge=>ge.key==="Enter"&&rt({type:"deal",item:x}),children:[o.jsxs("div",{className:"gzp-deal-media",children:[o.jsx(qs,{src:_n(x.image),alt:x.name,icon:x.icon||"flame"}),x.badge&&o.jsx("span",{className:"gzp-badge",children:x.badge}),$>0&&o.jsxs("span",{className:"gzp-save",children:["Save ",$,"%"]}),Yo(x.availableQty)&&o.jsx("span",{className:`gzp-stock${Yo(x.availableQty).out?" is-out":""}`,children:Yo(x.availableQty).text})]}),o.jsxs("div",{className:"gzp-deal-body",children:[o.jsx("h3",{children:x.name}),((V=x.items)==null?void 0:V.length)>0?o.jsxs("ul",{className:"gzp-deal-contents",children:[x.items.slice(0,3).map((ge,_e)=>o.jsxs("li",{children:[ge.quantity>1?`${ge.quantity}× `:"",ge.label]},_e)),x.items.length>3&&o.jsxs("li",{className:"gzp-deal-more",children:["+",x.items.length-3," more in the box"]})]}):x.description&&o.jsx("p",{className:"gzp-deal-desc",children:x.description}),o.jsxs("div",{className:"gzp-deal-foot",onClick:ge=>ge.stopPropagation(),role:"presentation",children:[o.jsx(da,{price:x.price,originalPrice:x.originalPrice}),he[C]&&!Ht(x)?o.jsx(pa,{qty:he[C],label:x.name,onAdd:()=>Wt("deal",x._id),onRemove:()=>tn("deal",x._id)}):o.jsx("button",{type:"button",className:"gzp-add gzp-add-wide",disabled:(de=Yo(x.availableQty))==null?void 0:de.out,onClick:()=>Ht(x)?rt({type:"deal",item:x}):Wt("deal",x._id,x.name),children:(fe=Yo(x.availableQty))!=null&&fe.out?"Sold out":Ht(x)?"Choose & add":"Add deal"})]})]})]},x._id)})})})]}),Pt.map(x=>o.jsxs("section",{className:"gzp-section",id:`section-${x.id}`,children:[o.jsxs("div",{className:"gzp-section-head",children:[o.jsx("h2",{children:x.name}),o.jsxs("span",{className:"gzp-section-count",children:[x.items.length," items"]}),o.jsx("div",{className:"gzp-section-rule"})]}),o.jsx("div",{className:"gzp-grid",children:x.items.map(C=>o.jsx(gh,{dish:C,cart:he,cartKey:Ut,addToCart:Wt,removeFromCart:tn,onOpenQuickView:$=>rt({type:"dish",item:$})},C._id))})]},x.id)),Pt.length===0&&k.length===0&&o.jsx("section",{className:"gzp-section",children:o.jsxs("div",{className:"gzp-empty",children:[o.jsx("img",{src:zi,alt:"",className:"gzp-empty-logo"}),"The menu is being set up right now. Check back in a little while."]})})]}),o.jsx(I0,{}),o.jsx(A0,{onSummary:or}),o.jsx(D0,{}),o.jsx(U0,{whatsappLink:Bd,onTrack:()=>Nt(!0)})]}),o.jsx(H0,{taxRatePercent:F,onNavigate:_t,onTrack:()=>Nt(!0)}),ar>0&&!W&&!Pe&&o.jsxs("button",{className:"gzp-cartbar",onClick:()=>ue(!0),type:"button",children:[o.jsxs("span",{className:"gzp-cartbar-label",children:[o.jsxs("small",{children:[ar," item",ar===1?"":"s"," in your order"]}),o.jsx("b",{children:Kt(xn)})]}),o.jsx("span",{className:"gzp-cartbar-cta",children:"View order"})]}),o.jsx(vh,{}),Tn&&o.jsxs("div",{className:"gzp-toast",role:"status",children:[o.jsx("i",{children:o.jsx(ee.Check,{})}),Tn]}),He&&o.jsxs("div",{className:"gzp-search",onClick:()=>We(!1),children:[o.jsxs("div",{className:"gzp-search-bar",onClick:x=>x.stopPropagation(),children:[o.jsx(Ad,{}),o.jsx("input",{autoFocus:!0,value:et,onChange:x=>tt(x.target.value),placeholder:"Search for a pizza, burger or deal","aria-label":"Search the menu"}),o.jsx("button",{className:"gzp-btn gzp-btn-ghost",onClick:()=>We(!1),type:"button",children:"Close"})]}),o.jsxs("div",{className:"gzp-search-results",onClick:x=>x.stopPropagation(),children:[et.trim()&&Xe.length===0&&o.jsxs("p",{className:"gzp-search-empty",children:["Nothing matches “",et.trim(),"”. Try a shorter word, like “pizza”."]}),Xe.map(({type:x,item:C})=>{var $;return o.jsxs("button",{className:"gzp-result",type:"button",onClick:()=>{We(!1),rt({type:x,item:C})},children:[_n(C.image)?o.jsx("img",{src:_n(C.image),alt:"",onError:V=>{V.currentTarget.style.display="none"}}):o.jsx("span",{className:"gzp-result-icon",children:o.jsx(ga,{icon:C.icon})}),o.jsxs("span",{className:"gzp-result-name",children:[C.name,o.jsx("span",{className:"gzp-result-cat",children:x==="deal"?"Deal":hr[(($=C.category)==null?void 0:$._id)||C.category]||"Menu"})]}),o.jsx(da,{price:C.price})]},`${x}-${C._id}`)})]})]}),X&&o.jsx("div",{className:"gzp-overlay",onClick:()=>rt(null),children:o.jsxs("div",{className:"gzp-modal",onClick:x=>x.stopPropagation(),role:"dialog","aria-label":X.item.name,children:[o.jsxs("div",{className:"gzp-modal-media",children:[o.jsx(qs,{src:_n(X.item.image),alt:X.item.name,icon:X.item.icon}),X.item.badge&&o.jsx("span",{className:"gzp-badge",children:X.item.badge}),o.jsx("button",{className:"gzp-modal-close",onClick:()=>rt(null),"aria-label":"Close",type:"button",children:o.jsx(ee.Close,{"aria-hidden":"true"})})]}),o.jsxs("div",{className:"gzp-modal-body",children:[o.jsx("h2",{children:X.item.name}),X.type==="deal"&&((at=X.item.items)==null?void 0:at.length)>0&&o.jsx("ul",{className:"gzp-deal-contents",children:X.item.items.map((x,C)=>x.customizable?null:o.jsxs("li",{children:[x.quantity>1?`${x.quantity}× `:"",x.label]},C))}),X.type==="deal"&&((Zt=X.item.items)==null?void 0:Zt.map((x,C)=>{var Tt,bt,Rt;if(!x.customizable)return null;const $=x.flavourOptions||[],V=Mr[C]||{},de=[...new Map($.map(Ce=>{var qe,ye;return[((qe=Ce.category)==null?void 0:qe._id)||"",((ye=Ce.category)==null?void 0:ye.name)||"Choose"]}))],fe=((bt=(Tt=$.find(Ce=>Ce._id===V.dishId))==null?void 0:Tt.category)==null?void 0:bt._id)||((Rt=de[0])==null?void 0:Rt[0])||"",ge=$.filter(Ce=>{var qe;return(((qe=Ce.category)==null?void 0:qe._id)||"")===fe}),_e=$.find(Ce=>Ce._id===V.dishId),Qe=[...new Set(((_e==null?void 0:_e.variants)||[]).map(Ce=>Ce.size))],gt=((_e==null?void 0:_e.variants)||[]).filter(Ce=>Ce.size===V.size&&Ce.crust),ht=Ce=>yr(qe=>({...qe,[C]:{...qe[C],...Ce}}));return o.jsxs("div",{className:"gzp-deal-choice",children:[o.jsxs("p",{className:"gzp-deal-choice-label",children:[x.quantity>1?`${x.quantity}× `:"",x.label," — pick yours"]}),o.jsxs("div",{className:"gzp-variant-row",children:[de.length>1&&o.jsx("select",{className:"gzp-select",value:fe,onChange:Ce=>{var ut;const qe=$.find(xt=>{var Ot;return(((Ot=xt.category)==null?void 0:Ot._id)||"")===Ce.target.value}),ye=(ut=qe==null?void 0:qe.variants)==null?void 0:ut[0];ht({dishId:(qe==null?void 0:qe._id)||"",size:(ye==null?void 0:ye.size)||"",crust:(ye==null?void 0:ye.crust)||""})},"aria-label":`Category for ${x.label}`,children:de.map(([Ce,qe])=>o.jsx("option",{value:Ce,children:qe},Ce))}),o.jsxs("select",{className:"gzp-select",value:V.dishId||"",onChange:Ce=>{var ut;const qe=$.find(xt=>xt._id===Ce.target.value),ye=(ut=qe==null?void 0:qe.variants)==null?void 0:ut[0];ht({dishId:(qe==null?void 0:qe._id)||"",size:(ye==null?void 0:ye.size)||"",crust:(ye==null?void 0:ye.crust)||""})},"aria-label":`Flavour for ${x.label}`,children:[ge.length===0&&o.jsx("option",{value:"",children:"No flavours available"}),ge.map(Ce=>o.jsx("option",{value:Ce._id,children:Ce.name},Ce._id))]}),Qe.length>0&&o.jsx("select",{className:"gzp-select",value:V.size||"",onChange:Ce=>{var ye;const qe=((_e==null?void 0:_e.variants)||[]).filter(ut=>ut.size===Ce.target.value&&ut.crust);ht({size:Ce.target.value,crust:qe.some(ut=>ut.crust===V.crust)?V.crust:((ye=qe[0])==null?void 0:ye.crust)||""})},"aria-label":`Size for ${x.label}`,children:Qe.map(Ce=>o.jsx("option",{value:Ce,children:Ce},Ce))}),gt.length>0&&o.jsx("select",{className:"gzp-select",value:V.crust||"",onChange:Ce=>ht({crust:Ce.target.value}),"aria-label":`Crust for ${x.label}`,children:gt.map(Ce=>o.jsx("option",{value:Ce.crust,children:Ce.crust},Ce.crust))})]})]},C)})),X.item.description&&o.jsx("p",{className:"gzp-deal-desc",children:X.item.description}),(()=>{const x=X.type==="dish",C=X.type==="deal",$=x?Ks(X.item):[],V=$.length>0,de=x?ca(X.item,jt):[],fe=V?Gs(X.item,jt,st):null,ge=V?$d(X.item):null,_e=V?(fe==null?void 0:fe.price)??(ge==null?void 0:ge.price)??X.item.price:X.item.price,Qe=V?(fe==null?void 0:fe.originalPrice)??0:X.item.originalPrice,gt=C&&Ht(X.item),ht=!gt||(X.item.items||[]).every((ye,ut)=>{var sr;if(!ye.customizable)return!0;const xt=Mr[ut];if(!(xt!=null&&xt.dishId))return!1;const Ot=(ye.flavourOptions||[]).find(so=>so._id===xt.dishId);return((sr=Ot==null?void 0:Ot.variants)==null?void 0:sr.length)>0?!!xt.size:!0}),Tt=gt?Ut(X.type,X.item._id,Gr(Mr)):Ut(X.type,X.item._id,jt,st),bt=he[Tt]||0,Rt=(x?p:k).find(ye=>ye._id===X.item._id)||X.item,Ce=Yo(Rt.availableQty),qe=(!V||!!fe)&&ht&&!(Ce!=null&&Ce.out);return o.jsxs(o.Fragment,{children:[o.jsx(da,{price:_e,originalPrice:Qe,from:V}),Ce&&o.jsx("p",{className:`gzp-stock-note${Ce.out?" is-out":""}`,children:Ce.text}),V&&o.jsxs("div",{className:"gzp-variant-row",children:[o.jsx("select",{className:"gzp-select",value:jt,onChange:ye=>{const ut=ye.target.value;Tr(ut);const xt=ca(X.item,ut);Lt(xt.includes(st)?st:xt[0]||"")},"aria-label":`Size for ${X.item.name}`,children:$.map(ye=>o.jsx("option",{value:ye,children:ye},ye))}),de.length>0&&o.jsx("select",{className:"gzp-select",value:st,onChange:ye=>Lt(ye.target.value),"aria-label":`Crust for ${X.item.name}`,children:de.map(ye=>o.jsx("option",{value:ye,children:ye},ye))})]}),o.jsx("div",{className:"gzp-modal-foot",children:bt?o.jsxs(o.Fragment,{children:[o.jsx(pa,{size:"lg",label:X.item.name,qty:bt,onAdd:()=>gt?Wt(X.type,X.item._id,"","","",Mr):Wt(X.type,X.item._id,"",jt,st),onRemove:()=>{const[,,ye]=Tt.split(":"),[ut,xt]=ye.split("||");tn(X.type,X.item._id,ut,xt)}}),o.jsx("button",{className:"gzp-btn gzp-btn-primary",onClick:()=>{rt(null),ue(!0)},type:"button",children:"View order"})]}):o.jsxs("button",{className:"gzp-btn gzp-btn-primary gzp-btn-split",disabled:!qe,onClick:()=>{gt?Wt(X.type,X.item._id,X.item.name,"","",Mr):Wt(X.type,X.item._id,X.item.name,jt,st),rt(null)},type:"button",children:[o.jsx("span",{children:Ce!=null&&Ce.out?"Sold out":gt&&!ht?"Choose your options":"Add to order"}),o.jsx("span",{children:Kt(_e)})]})})]})})()]})]})}),ie&&o.jsx(rh,{cfg:Y,dishes:p,categories:u,initialPicks:Ar(),getOtherQty:ln,onClose:()=>ne(!1),onConfirm:bn}),W&&o.jsx("div",{className:"gzp-sheet-overlay",onClick:()=>ue(!1),children:o.jsxs("div",{className:"gzp-sheet",onClick:x=>x.stopPropagation(),role:"dialog","aria-label":"Your order",children:[o.jsxs("div",{className:"gzp-sheet-head",children:[o.jsx("h2",{children:"Your order"}),o.jsx("button",{className:"gzp-icon-btn",onClick:()=>ue(!1),"aria-label":"Close",type:"button",children:o.jsx(ee.Close,{"aria-hidden":"true"})})]}),Gt.length===0?o.jsxs("div",{className:"gzp-sheet-body",children:[o.jsxs("div",{className:"gzp-empty",children:[o.jsx("span",{children:o.jsx(ee.Cart,{"aria-hidden":"true"})}),"Nothing here yet. Add a deal or a pizza and it'll show up."]}),o.jsx("button",{className:"gzp-btn gzp-btn-primary",onClick:()=>ue(!1),type:"button",children:"Back to the menu"})]}):o.jsxs(o.Fragment,{children:[o.jsxs("div",{className:"gzp-sheet-body",children:[Gt.filter(x=>x.type!=="byo").map(l),Xr.length>0&&o.jsxs("div",{className:"gzp-byo-cart",children:[o.jsxs("div",{className:"gzp-byo-cart-head",children:[o.jsxs("h4",{children:[o.jsx(ee.Target,{"aria-hidden":"true",style:{marginRight:6,verticalAlign:"-2px"}}),"Your custom deal"]}),o.jsx("button",{type:"button",onClick:()=>{ue(!1),ne(!0)},children:"Edit"})]}),o.jsx("p",{className:`gzp-byo-cart-note${lr>0||!Y.enabled?" is-warn":""}`,children:Y.enabled?Rd(Ft,Y):"This deal isn't available right now."}),Xr.map(l),Zr>0&&o.jsxs("p",{className:"gzp-byo-cart-saving",children:["You save ",o.jsx("b",{children:Kt(Zr)})," (",br,"% off ",Ft," items)"]})]})]}),o.jsxs("div",{className:"gzp-sheet-foot",children:[o.jsxs("div",{className:"gzp-totals",children:[o.jsxs("div",{children:[o.jsx("span",{children:"Subtotal"}),o.jsx("span",{children:Kt(ir)})]}),Zr>0&&o.jsxs("div",{className:"is-discount",children:[o.jsxs("span",{children:["Custom deal discount (",br,"%)"]}),o.jsxs("span",{children:["−",Kt(Zr)]})]}),o.jsxs("div",{children:[o.jsxs("span",{children:["Tax (",F,"%)"]}),o.jsx("span",{children:Kt(Dr)})]}),o.jsxs("div",{children:[o.jsx("span",{children:"Delivery"}),o.jsx("span",{children:"Chosen at checkout"})]}),o.jsxs("div",{className:"gzp-grand",children:[o.jsx("span",{children:"Total"}),o.jsx("span",{children:Kt(xn)})]})]}),Or&&o.jsx("p",{className:"gzp-byo-warn",children:Y.enabled?`Your custom deal needs ${lr} more item${lr===1?"":"s"} to qualify. Add more or remove the deal to continue.`:"The custom deal isn't available right now. Remove it to continue."}),o.jsx("button",{className:"gzp-btn gzp-btn-primary gzp-btn-block",onClick:()=>{ue(!1),Ke(!0)},disabled:Or,type:"button",children:"Choose delivery or pickup"}),Or&&o.jsx("button",{type:"button",className:"gzp-btn gzp-btn-ghost gzp-btn-block",style:{marginTop:8},onClick:()=>{Y.enabled?(ue(!1),ne(!0)):on()},children:Y.enabled?"Add more items to my deal":"Remove custom deal"})]})]})]})}),Pe&&o.jsx("div",{className:"gzp-sheet-overlay",onClick:()=>Ke(!1),children:o.jsxs("div",{className:"gzp-sheet",onClick:x=>x.stopPropagation(),role:"dialog","aria-label":"Delivery or pickup details",children:[o.jsxs("div",{className:"gzp-sheet-head",children:[o.jsx("button",{className:"gzp-icon-btn",onClick:()=>{Ke(!1),ue(!0)},"aria-label":"Back to your order",type:"button",children:o.jsx(Qs,{dir:"left"})}),o.jsx("h2",{children:"Delivery or pickup"})]}),o.jsxs("form",{onSubmit:mr,style:{display:"contents"},children:[o.jsx("div",{className:"gzp-sheet-body",children:o.jsxs("div",{className:"gzp-form",children:[o.jsx(G0,{f:ft}),o.jsxs("label",{className:"gzp-field",children:[o.jsx("span",{children:"Your name"}),o.jsx("input",{required:!0,value:z.name,onChange:x=>U({...z,name:x.target.value}),placeholder:"Who's the rider asking for?"})]}),o.jsxs("label",{className:"gzp-field",children:[o.jsx("span",{children:"Mobile number"}),o.jsx("input",{required:!0,type:"tel",inputMode:"numeric",pattern:"[0-9+]*",maxLength:14,value:z.phone,onChange:x=>U({...z,phone:ia(x.target.value)}),onPaste:x=>{x.preventDefault();const C=(x.clipboardData||window.clipboardData).getData("text");U($=>({...$,phone:ia($.phone+C)}))},placeholder:"03001234567"})]}),o.jsx(j0,{cfg:dt,value:Fr,onChange:fn,pickup:ft.method==="pickup"}),nn?o.jsx(C0,{cfg:dt,amountLabel:Kt(In),jazz:$t}):o.jsxs("p",{className:"gzp-note",children:[o.jsx(Ud,{}),o.jsx("span",{children:ft.method==="pickup"?o.jsxs(o.Fragment,{children:[o.jsx("b",{children:"Pay at pickup."})," Pay at the counter when you collect your order. We'll call you if anything changes."]}):o.jsxs(o.Fragment,{children:[o.jsx("b",{children:"Cash on delivery."})," Pay the rider when the food arrives. We'll call this number if we can't find the address."]})})]}),ke&&o.jsx("p",{className:"gzp-error",children:ke})]})}),o.jsxs("div",{className:"gzp-sheet-foot",children:[o.jsxs("div",{className:"gzp-totals",children:[o.jsxs("div",{children:[o.jsx("span",{children:"Subtotal + tax"}),o.jsx("span",{children:Kt(xn)})]}),o.jsxs("div",{children:[o.jsx("span",{children:ft.method==="pickup"?"Pickup":"Delivery fee"}),o.jsx("span",{children:(Jt=ft.quote)!=null&&Jt.ok?ft.fee>0?Kt(ft.fee):"Free":"—"})]}),o.jsxs("div",{className:"gzp-grand",children:[o.jsx("span",{children:"Total to pay"}),o.jsx("span",{children:Kt(In)})]})]}),o.jsx("button",{type:"submit",className:"gzp-btn gzp-btn-primary gzp-btn-block",disabled:!Br,children:Ge?"Sending to the kitchen…":ft.ready?nn&&!$t.ready?$t.uploading?"Uploading screenshot…":"Add payment details to continue":"Place order":ft.quoting?"Checking…":ft.method==="delivery"?"Complete delivery details":"Check pickup details"})]})]})]})}),nr&&o.jsx("div",{className:"gzp-sheet-overlay",onClick:()=>Nt(!1),children:o.jsxs("div",{className:"gzp-sheet",onClick:x=>x.stopPropagation(),role:"dialog","aria-label":"Track your order",children:[o.jsxs("div",{className:"gzp-sheet-head",children:[o.jsx("h2",{children:"Track your order"}),o.jsx("button",{className:"gzp-icon-btn",onClick:()=>Nt(!1),"aria-label":"Close",type:"button",children:o.jsx(ee.Close,{"aria-hidden":"true"})})]}),o.jsxs("form",{onSubmit:Kn,style:{display:"contents"},children:[o.jsx("div",{className:"gzp-sheet-body",children:o.jsxs("div",{className:"gzp-form",children:[o.jsxs("label",{className:"gzp-field",children:[o.jsx("span",{children:"Mobile number used at checkout"}),o.jsx("input",{required:!0,autoFocus:!0,type:"tel",inputMode:"numeric",pattern:"[0-9+]*",maxLength:14,value:wr,onChange:x=>hn(ia(x.target.value)),onPaste:x=>{x.preventDefault();const C=(x.clipboardData||window.clipboardData).getData("text");hn($=>ia($+C))},placeholder:"03001234567"})]}),Ln&&o.jsx("p",{className:"gzp-error",children:Ln})]})}),o.jsx("div",{className:"gzp-sheet-foot",children:o.jsx("button",{type:"submit",className:"gzp-btn gzp-btn-primary gzp-btn-block",disabled:Rr,children:Rr?"Looking…":"Find my order"})})]})]})})]})}class wh extends Wn.Component{constructor(p){super(p);td(this,"handleReload",()=>{try{localStorage.removeItem("gzp_last_order")}catch{}window.location.reload()});this.state={hasError:!1}}static getDerivedStateFromError(){return{hasError:!0}}componentDidCatch(p,j){console.error("GenZ Pizza Land crashed while rendering:",p,j)}render(){return this.state.hasError?o.jsxs("div",{style:{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:14,padding:24,textAlign:"center",fontFamily:"system-ui, sans-serif",background:"#FFF8EF",color:"#252525"},children:[o.jsx("h1",{style:{fontSize:"1.3rem",margin:0},children:"Something went wrong on our end"}),o.jsx("p",{style:{maxWidth:420,opacity:.8,margin:0},children:"Your order may still have gone through — if you already saw an order number, it's safe. Reloading usually fixes this."}),o.jsx("button",{type:"button",onClick:this.handleReload,style:{padding:"10px 22px",borderRadius:8,border:"none",background:"#E6392F",color:"#fff",fontWeight:600,cursor:"pointer"},children:"Reload"})]}):this.props.children}}var Eo={},Qo={};/**
 * @license React
 * react-dom-server-legacy.browser.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Sd;function kh(){if(Sd)return Qo;Sd=1;var u=nl();function h(l){for(var d="https://reactjs.org/docs/error-decoder.html?invariant="+l,g=1;g<arguments.length;g++)d+="&args[]="+encodeURIComponent(arguments[g]);return"Minified React error #"+l+"; visit "+d+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var p=Object.prototype.hasOwnProperty,j=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,k={},L={};function ae(l){return p.call(L,l)?!0:p.call(k,l)?!1:j.test(l)?L[l]=!0:(k[l]=!0,!1)}function G(l,d,g,y,_,E,D){this.acceptsBooleans=d===2||d===3||d===4,this.attributeName=y,this.attributeNamespace=_,this.mustUseProperty=g,this.propertyName=l,this.type=d,this.sanitizeURL=E,this.removeEmptyString=D}var F={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(l){F[l]=new G(l,0,!1,l,null,!1,!1)}),[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(l){var d=l[0];F[d]=new G(d,1,!1,l[1],null,!1,!1)}),["contentEditable","draggable","spellCheck","value"].forEach(function(l){F[l]=new G(l,2,!1,l.toLowerCase(),null,!1,!1)}),["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(l){F[l]=new G(l,2,!1,l,null,!1,!1)}),"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(l){F[l]=new G(l,3,!1,l.toLowerCase(),null,!1,!1)}),["checked","multiple","muted","selected"].forEach(function(l){F[l]=new G(l,3,!0,l,null,!1,!1)}),["capture","download"].forEach(function(l){F[l]=new G(l,4,!1,l,null,!1,!1)}),["cols","rows","size","span"].forEach(function(l){F[l]=new G(l,6,!1,l,null,!1,!1)}),["rowSpan","start"].forEach(function(l){F[l]=new G(l,5,!1,l.toLowerCase(),null,!1,!1)});var B=/[\-:]([a-z])/g;function Y(l){return l[1].toUpperCase()}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(l){var d=l.replace(B,Y);F[d]=new G(d,1,!1,l,null,!1,!1)}),"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(l){var d=l.replace(B,Y);F[d]=new G(d,1,!1,l,"http://www.w3.org/1999/xlink",!1,!1)}),["xml:base","xml:lang","xml:space"].forEach(function(l){var d=l.replace(B,Y);F[d]=new G(d,1,!1,l,"http://www.w3.org/XML/1998/namespace",!1,!1)}),["tabIndex","crossOrigin"].forEach(function(l){F[l]=new G(l,1,!1,l.toLowerCase(),null,!1,!1)}),F.xlinkHref=new G("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1),["src","href","action","formAction"].forEach(function(l){F[l]=new G(l,1,!1,l.toLowerCase(),null,!0,!0)});var H={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},ie=["Webkit","ms","Moz","O"];Object.keys(H).forEach(function(l){ie.forEach(function(d){d=d+l.charAt(0).toUpperCase()+l.substring(1),H[d]=H[l]})});var ne=/["'&<>]/;function he(l){if(typeof l=="boolean"||typeof l=="number")return""+l;l=""+l;var d=ne.exec(l);if(d){var g="",y,_=0;for(y=d.index;y<l.length;y++){switch(l.charCodeAt(y)){case 34:d="&quot;";break;case 38:d="&amp;";break;case 39:d="&#x27;";break;case 60:d="&lt;";break;case 62:d="&gt;";break;default:continue}_!==y&&(g+=l.substring(_,y)),_=y+1,g+=d}l=_!==y?g+l.substring(_,y):g}return l}var ze=/([A-Z])/g,W=/^ms-/,ue=Array.isArray;function Pe(l,d){return{insertionMode:l,selectedValue:d}}function Ke(l,d,g){switch(d){case"select":return Pe(1,g.value!=null?g.value:g.defaultValue);case"svg":return Pe(2,null);case"math":return Pe(3,null);case"foreignObject":return Pe(1,null);case"table":return Pe(4,null);case"thead":case"tbody":case"tfoot":return Pe(5,null);case"colgroup":return Pe(7,null);case"tr":return Pe(6,null)}return 4<=l.insertionMode||l.insertionMode===0?Pe(1,null):l}var Te=new Map;function Ee(l,d,g){if(typeof g!="object")throw Error(h(62));d=!0;for(var y in g)if(p.call(g,y)){var _=g[y];if(_!=null&&typeof _!="boolean"&&_!==""){if(y.indexOf("--")===0){var E=he(y);_=he((""+_).trim())}else{E=y;var D=Te.get(E);D!==void 0||(D=he(E.replace(ze,"-$1").toLowerCase().replace(W,"-ms-")),Te.set(E,D)),E=D,_=typeof _=="number"?_===0||p.call(H,y)?""+_:_+"px":he((""+_).trim())}d?(d=!1,l.push(' style="',E,":",_)):l.push(";",E,":",_)}}d||l.push('"')}function ke(l,d,g,y){switch(g){case"style":Ee(l,d,y);return;case"defaultValue":case"defaultChecked":case"innerHTML":case"suppressContentEditableWarning":case"suppressHydrationWarning":return}if(!(2<g.length)||g[0]!=="o"&&g[0]!=="O"||g[1]!=="n"&&g[1]!=="N"){if(d=F.hasOwnProperty(g)?F[g]:null,d!==null){switch(typeof y){case"function":case"symbol":return;case"boolean":if(!d.acceptsBooleans)return}switch(g=d.attributeName,d.type){case 3:y&&l.push(" ",g,'=""');break;case 4:y===!0?l.push(" ",g,'=""'):y!==!1&&l.push(" ",g,'="',he(y),'"');break;case 5:isNaN(y)||l.push(" ",g,'="',he(y),'"');break;case 6:!isNaN(y)&&1<=y&&l.push(" ",g,'="',he(y),'"');break;default:d.sanitizeURL&&(y=""+y),l.push(" ",g,'="',he(y),'"')}}else if(ae(g)){switch(typeof y){case"function":case"symbol":return;case"boolean":if(d=g.toLowerCase().slice(0,5),d!=="data-"&&d!=="aria-")return}l.push(" ",g,'="',he(y),'"')}}}function ve(l,d,g){if(d!=null){if(g!=null)throw Error(h(60));if(typeof d!="object"||!("__html"in d))throw Error(h(61));d=d.__html,d!=null&&l.push(""+d)}}function Ge(l){var d="";return u.Children.forEach(l,function(g){g!=null&&(d+=g)}),d}function Se(l,d,g,y){l.push(q(g));var _=g=null,E;for(E in d)if(p.call(d,E)){var D=d[E];if(D!=null)switch(E){case"children":g=D;break;case"dangerouslySetInnerHTML":_=D;break;default:ke(l,y,E,D)}}return l.push(">"),ve(l,_,g),typeof g=="string"?(l.push(he(g)),null):g}var lt=/^[a-zA-Z][a-zA-Z:_\.\-\d]*$/,Je=new Map;function q(l){var d=Je.get(l);if(d===void 0){if(!lt.test(l))throw Error(h(65,l));d="<"+l,Je.set(l,d)}return d}function me(l,d,g,y,_){switch(d){case"select":l.push(q("select"));var E=null,D=null;for($e in g)if(p.call(g,$e)){var re=g[$e];if(re!=null)switch($e){case"children":E=re;break;case"dangerouslySetInnerHTML":D=re;break;case"defaultValue":case"value":break;default:ke(l,y,$e,re)}}return l.push(">"),ve(l,D,E),E;case"option":D=_.selectedValue,l.push(q("option"));var se=re=null,Fe=null,$e=null;for(E in g)if(p.call(g,E)){var at=g[E];if(at!=null)switch(E){case"children":re=at;break;case"selected":Fe=at;break;case"dangerouslySetInnerHTML":$e=at;break;case"value":se=at;default:ke(l,y,E,at)}}if(D!=null)if(g=se!==null?""+se:Ge(re),ue(D)){for(y=0;y<D.length;y++)if(""+D[y]===g){l.push(' selected=""');break}}else""+D===g&&l.push(' selected=""');else Fe&&l.push(' selected=""');return l.push(">"),ve(l,$e,re),re;case"textarea":l.push(q("textarea")),$e=D=E=null;for(re in g)if(p.call(g,re)&&(se=g[re],se!=null))switch(re){case"children":$e=se;break;case"value":E=se;break;case"defaultValue":D=se;break;case"dangerouslySetInnerHTML":throw Error(h(91));default:ke(l,y,re,se)}if(E===null&&D!==null&&(E=D),l.push(">"),$e!=null){if(E!=null)throw Error(h(92));if(ue($e)&&1<$e.length)throw Error(h(93));E=""+$e}return typeof E=="string"&&E[0]===`
`&&l.push(`
`),E!==null&&l.push(he(""+E)),null;case"input":l.push(q("input")),se=$e=re=E=null;for(D in g)if(p.call(g,D)&&(Fe=g[D],Fe!=null))switch(D){case"children":case"dangerouslySetInnerHTML":throw Error(h(399,"input"));case"defaultChecked":se=Fe;break;case"defaultValue":re=Fe;break;case"checked":$e=Fe;break;case"value":E=Fe;break;default:ke(l,y,D,Fe)}return $e!==null?ke(l,y,"checked",$e):se!==null&&ke(l,y,"checked",se),E!==null?ke(l,y,"value",E):re!==null&&ke(l,y,"value",re),l.push("/>"),null;case"menuitem":l.push(q("menuitem"));for(var Zt in g)if(p.call(g,Zt)&&(E=g[Zt],E!=null))switch(Zt){case"children":case"dangerouslySetInnerHTML":throw Error(h(400));default:ke(l,y,Zt,E)}return l.push(">"),null;case"title":l.push(q("title")),E=null;for(at in g)if(p.call(g,at)&&(D=g[at],D!=null))switch(at){case"children":E=D;break;case"dangerouslySetInnerHTML":throw Error(h(434));default:ke(l,y,at,D)}return l.push(">"),E;case"listing":case"pre":l.push(q(d)),D=E=null;for(se in g)if(p.call(g,se)&&(re=g[se],re!=null))switch(se){case"children":E=re;break;case"dangerouslySetInnerHTML":D=re;break;default:ke(l,y,se,re)}if(l.push(">"),D!=null){if(E!=null)throw Error(h(60));if(typeof D!="object"||!("__html"in D))throw Error(h(61));g=D.__html,g!=null&&(typeof g=="string"&&0<g.length&&g[0]===`
`?l.push(`
`,g):l.push(""+g))}return typeof E=="string"&&E[0]===`
`&&l.push(`
`),E;case"area":case"base":case"br":case"col":case"embed":case"hr":case"img":case"keygen":case"link":case"meta":case"param":case"source":case"track":case"wbr":l.push(q(d));for(var Jt in g)if(p.call(g,Jt)&&(E=g[Jt],E!=null))switch(Jt){case"children":case"dangerouslySetInnerHTML":throw Error(h(399,d));default:ke(l,y,Jt,E)}return l.push("/>"),null;case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return Se(l,g,d,y);case"html":return _.insertionMode===0&&l.push("<!DOCTYPE html>"),Se(l,g,d,y);default:if(d.indexOf("-")===-1&&typeof g.is!="string")return Se(l,g,d,y);l.push(q(d)),D=E=null;for(Fe in g)if(p.call(g,Fe)&&(re=g[Fe],re!=null))switch(Fe){case"children":E=re;break;case"dangerouslySetInnerHTML":D=re;break;case"style":Ee(l,y,re);break;case"suppressContentEditableWarning":case"suppressHydrationWarning":break;default:ae(Fe)&&typeof re!="function"&&typeof re!="symbol"&&l.push(" ",Fe,'="',he(re),'"')}return l.push(">"),ve(l,D,E),E}}function O(l,d,g){if(l.push('<!--$?--><template id="'),g===null)throw Error(h(395));return l.push(g),l.push('"></template>')}function le(l,d,g,y){switch(g.insertionMode){case 0:case 1:return l.push('<div hidden id="'),l.push(d.segmentPrefix),d=y.toString(16),l.push(d),l.push('">');case 2:return l.push('<svg aria-hidden="true" style="display:none" id="'),l.push(d.segmentPrefix),d=y.toString(16),l.push(d),l.push('">');case 3:return l.push('<math aria-hidden="true" style="display:none" id="'),l.push(d.segmentPrefix),d=y.toString(16),l.push(d),l.push('">');case 4:return l.push('<table hidden id="'),l.push(d.segmentPrefix),d=y.toString(16),l.push(d),l.push('">');case 5:return l.push('<table hidden><tbody id="'),l.push(d.segmentPrefix),d=y.toString(16),l.push(d),l.push('">');case 6:return l.push('<table hidden><tr id="'),l.push(d.segmentPrefix),d=y.toString(16),l.push(d),l.push('">');case 7:return l.push('<table hidden><colgroup id="'),l.push(d.segmentPrefix),d=y.toString(16),l.push(d),l.push('">');default:throw Error(h(397))}}function Le(l,d){switch(d.insertionMode){case 0:case 1:return l.push("</div>");case 2:return l.push("</svg>");case 3:return l.push("</math>");case 4:return l.push("</table>");case 5:return l.push("</tbody></table>");case 6:return l.push("</tr></table>");case 7:return l.push("</colgroup></table>");default:throw Error(h(397))}}var Be=/[<\u2028\u2029]/g;function Z(l){return JSON.stringify(l).replace(Be,function(d){switch(d){case"<":return"\\u003c";case"\u2028":return"\\u2028";case"\u2029":return"\\u2029";default:throw Error("escapeJSStringsForInstructionScripts encountered a match it does not know how to replace. this means the match regex and the replacement characters are no longer in sync. This is a bug in React")}})}function pe(l,d){return d=d===void 0?"":d,{bootstrapChunks:[],startInlineScript:"<script>",placeholderPrefix:d+"P:",segmentPrefix:d+"S:",boundaryPrefix:d+"B:",idPrefix:d,nextSuspenseID:0,sentCompleteSegmentFunction:!1,sentCompleteBoundaryFunction:!1,sentClientRenderFunction:!1,generateStaticMarkup:l}}function ce(l,d,g,y){return g.generateStaticMarkup?(l.push(he(d)),!1):(d===""?l=y:(y&&l.push("<!-- -->"),l.push(he(d)),l=!0),l)}var z=Object.assign,U=Symbol.for("react.element"),Oe=Symbol.for("react.portal"),Me=Symbol.for("react.fragment"),He=Symbol.for("react.strict_mode"),We=Symbol.for("react.profiler"),et=Symbol.for("react.provider"),tt=Symbol.for("react.context"),X=Symbol.for("react.forward_ref"),rt=Symbol.for("react.suspense"),jt=Symbol.for("react.suspense_list"),Tr=Symbol.for("react.memo"),st=Symbol.for("react.lazy"),Lt=Symbol.for("react.scope"),Mr=Symbol.for("react.debug_trace_mode"),yr=Symbol.for("react.legacy_hidden"),Tn=Symbol.for("react.default_value"),Yr=Symbol.iterator;function nr(l){if(l==null)return null;if(typeof l=="function")return l.displayName||l.name||null;if(typeof l=="string")return l;switch(l){case Me:return"Fragment";case Oe:return"Portal";case We:return"Profiler";case He:return"StrictMode";case rt:return"Suspense";case jt:return"SuspenseList"}if(typeof l=="object")switch(l.$$typeof){case tt:return(l.displayName||"Context")+".Consumer";case et:return(l._context.displayName||"Context")+".Provider";case X:var d=l.render;return l=l.displayName,l||(l=d.displayName||d.name||"",l=l!==""?"ForwardRef("+l+")":"ForwardRef"),l;case Tr:return d=l.displayName||null,d!==null?d:nr(l.type)||"Memo";case st:d=l._payload,l=l._init;try{return nr(l(d))}catch{}}return null}var Nt={};function Lr(l,d){if(l=l.contextTypes,!l)return Nt;var g={},y;for(y in l)g[y]=d[y];return g}var or=null;function dt(l,d){if(l!==d){l.context._currentValue2=l.parentValue,l=l.parent;var g=d.parent;if(l===null){if(g!==null)throw Error(h(401))}else{if(g===null)throw Error(h(401));dt(l,g)}d.context._currentValue2=d.value}}function Mn(l){l.context._currentValue2=l.parentValue,l=l.parent,l!==null&&Mn(l)}function Fr(l){var d=l.parent;d!==null&&Fr(d),l.context._currentValue2=l.value}function fn(l,d){if(l.context._currentValue2=l.parentValue,l=l.parent,l===null)throw Error(h(402));l.depth===d.depth?dt(l,d):fn(l,d)}function $t(l,d){var g=d.parent;if(g===null)throw Error(h(402));l.depth===g.depth?dt(l,g):$t(l,g),d.context._currentValue2=d.value}function wr(l){var d=or;d!==l&&(d===null?Fr(l):l===null?Mn(d):d.depth===l.depth?dt(d,l):d.depth>l.depth?fn(d,l):$t(d,l),or=l)}var hn={isMounted:function(){return!1},enqueueSetState:function(l,d){l=l._reactInternals,l.queue!==null&&l.queue.push(d)},enqueueReplaceState:function(l,d){l=l._reactInternals,l.replace=!0,l.queue=[d]},enqueueForceUpdate:function(){}};function Rr(l,d,g,y){var _=l.state!==void 0?l.state:null;l.updater=hn,l.props=g,l.state=_;var E={queue:[],replace:!1};l._reactInternals=E;var D=d.contextType;if(l.context=typeof D=="object"&&D!==null?D._currentValue2:y,D=d.getDerivedStateFromProps,typeof D=="function"&&(D=D(g,_),_=D==null?_:z({},_,D),l.state=_),typeof d.getDerivedStateFromProps!="function"&&typeof l.getSnapshotBeforeUpdate!="function"&&(typeof l.UNSAFE_componentWillMount=="function"||typeof l.componentWillMount=="function"))if(d=l.state,typeof l.componentWillMount=="function"&&l.componentWillMount(),typeof l.UNSAFE_componentWillMount=="function"&&l.UNSAFE_componentWillMount(),d!==l.state&&hn.enqueueReplaceState(l,l.state,null),E.queue!==null&&0<E.queue.length)if(d=E.queue,D=E.replace,E.queue=null,E.replace=!1,D&&d.length===1)l.state=d[0];else{for(E=D?d[0]:l.state,_=!0,D=D?1:0;D<d.length;D++){var re=d[D];re=typeof re=="function"?re.call(l,E,g,y):re,re!=null&&(_?(_=!1,E=z({},E,re)):z(E,re))}l.state=E}else E.queue=null}var Kr={id:1,overflow:""};function Ln(l,d,g){var y=l.id;l=l.overflow;var _=32-Ir(y)-1;y&=~(1<<_),g+=1;var E=32-Ir(d)+_;if(30<E){var D=_-_%5;return E=(y&(1<<D)-1).toString(32),y>>=D,_-=D,{id:1<<32-Ir(d)+_|g<<_|y,overflow:E+l}}return{id:1<<E|g<<_|y,overflow:l}}var Ir=Math.clz32?Math.clz32:kr,Fn=Math.log,ao=Math.LN2;function kr(l){return l>>>=0,l===0?32:31-(Fn(l)/ao|0)|0}function Rn(l,d){return l===d&&(l!==0||1/l===1/d)||l!==l&&d!==d}var mn=typeof Object.is=="function"?Object.is:Rn,Pt=null,At=null,hr=null,Xe=null,Ut=!1,Gr=!1,qr=0,Ht=null,Gt=0;function ir(){if(Pt===null)throw Error(h(321));return Pt}function Xr(){if(0<Gt)throw Error(h(312));return{memoizedState:null,queue:null,next:null}}function Ft(){return Xe===null?hr===null?(Ut=!1,hr=Xe=Xr()):(Ut=!0,Xe=hr):Xe.next===null?(Ut=!1,Xe=Xe.next=Xr()):(Ut=!0,Xe=Xe.next),Xe}function gn(){At=Pt=null,Gr=!1,hr=null,Gt=0,Xe=Ht=null}function br(l,d){return typeof d=="function"?d(l):d}function Zr(l,d,g){if(Pt=ir(),Xe=Ft(),Ut){var y=Xe.queue;if(d=y.dispatch,Ht!==null&&(g=Ht.get(y),g!==void 0)){Ht.delete(y),y=Xe.memoizedState;do y=l(y,g.action),g=g.next;while(g!==null);return Xe.memoizedState=y,[y,d]}return[Xe.memoizedState,d]}return l=l===br?typeof d=="function"?d():d:g!==void 0?g(d):d,Xe.memoizedState=l,l=Xe.queue={last:null,dispatch:null},l=l.dispatch=Or.bind(null,Pt,l),[Xe.memoizedState,l]}function lr(l,d){if(Pt=ir(),Xe=Ft(),d=d===void 0?null:d,Xe!==null){var g=Xe.memoizedState;if(g!==null&&d!==null){var y=g[1];e:if(y===null)y=!1;else{for(var _=0;_<y.length&&_<d.length;_++)if(!mn(d[_],y[_])){y=!1;break e}y=!0}if(y)return g[0]}}return l=l(),Xe.memoizedState=[l,d],l}function Or(l,d,g){if(25<=Gt)throw Error(h(301));if(l===Pt)if(Gr=!0,l={action:g,next:null},Ht===null&&(Ht=new Map),g=Ht.get(d),g===void 0)Ht.set(d,l);else{for(d=g;d.next!==null;)d=d.next;d.next=l}}function Jr(){throw Error(h(394))}function Dr(){}var xn={readContext:function(l){return l._currentValue2},useContext:function(l){return ir(),l._currentValue2},useMemo:lr,useReducer:Zr,useRef:function(l){Pt=ir(),Xe=Ft();var d=Xe.memoizedState;return d===null?(l={current:l},Xe.memoizedState=l):d},useState:function(l){return Zr(br,l)},useInsertionEffect:Dr,useLayoutEffect:function(){},useCallback:function(l,d){return lr(function(){return l},d)},useImperativeHandle:Dr,useEffect:Dr,useDebugValue:Dr,useDeferredValue:function(l){return ir(),l},useTransition:function(){return ir(),[!1,Jr]},useId:function(){var l=At.treeContext,d=l.overflow;l=l.id,l=(l&~(1<<32-Ir(l)-1)).toString(32)+d;var g=ft;if(g===null)throw Error(h(404));return d=qr++,l=":"+g.idPrefix+"R"+l,0<d&&(l+="H"+d.toString(32)),l+":"},useMutableSource:function(l,d){return ir(),d(l._source)},useSyncExternalStore:function(l,d,g){if(g===void 0)throw Error(h(407));return g()}},ft=null,In=u.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentDispatcher;function ar(l){return console.error(l),null}function qt(){}function wt(l,d,g,y,_,E,D,re,se){var Fe=[],$e=new Set;return d={destination:null,responseState:d,progressiveChunkSize:y===void 0?12800:y,status:0,fatalError:null,nextSegmentId:0,allPendingTasks:0,pendingRootTasks:0,completedRootSegment:null,abortableTasks:$e,pingedTasks:Fe,clientRenderedBoundaries:[],completedBoundaries:[],partialBoundaries:[],onError:_===void 0?ar:_,onAllReady:qt,onShellReady:D===void 0?qt:D,onShellError:qt,onFatalError:qt},g=yn(d,0,null,g,!1,!1),g.parentFlushed=!0,l=vn(d,l,null,g,$e,Nt,null,Kr),Fe.push(l),d}function vn(l,d,g,y,_,E,D,re){l.allPendingTasks++,g===null?l.pendingRootTasks++:g.pendingTasks++;var se={node:d,ping:function(){var Fe=l.pingedTasks;Fe.push(se),Fe.length===1&&Xt(l)},blockedBoundary:g,blockedSegment:y,abortSet:_,legacyContext:E,context:D,treeContext:re};return _.add(se),se}function yn(l,d,g,y,_,E){return{status:0,id:-1,index:d,parentFlushed:!1,chunks:[],children:[],formatContext:y,boundary:g,lastPushedText:_,textEmbedded:E}}function en(l,d){if(l=l.onError(d),l!=null&&typeof l!="string")throw Error('onError returned something with a type other than "string". onError should return a string and may return null or undefined but must not return anything else. It received something of type "'+typeof l+'" instead');return l}function Wt(l,d){var g=l.onShellError;g(d),g=l.onFatalError,g(d),l.destination!==null?(l.status=2,l.destination.destroy(d)):(l.status=1,l.fatalError=d)}function tn(l,d,g,y,_){for(Pt={},At=d,qr=0,l=g(y,_);Gr;)Gr=!1,qr=0,Gt+=1,Xe=null,l=g(y,_);return gn(),l}function On(l,d,g,y){var _=g.render(),E=y.childContextTypes;if(E!=null){var D=d.legacyContext;if(typeof g.getChildContext!="function")y=D;else{g=g.getChildContext();for(var re in g)if(!(re in E))throw Error(h(108,nr(y)||"Unknown",re));y=z({},D,g)}d.legacyContext=y,_t(l,d,_),d.legacyContext=D}else _t(l,d,_)}function Vn(l,d){if(l&&l.defaultProps){d=z({},d),l=l.defaultProps;for(var g in l)d[g]===void 0&&(d[g]=l[g]);return d}return d}function ot(l,d,g,y,_){if(typeof g=="function")if(g.prototype&&g.prototype.isReactComponent){_=Lr(g,d.legacyContext);var E=g.contextType;E=new g(y,typeof E=="object"&&E!==null?E._currentValue2:_),Rr(E,g,y,_),On(l,d,E,g)}else{E=Lr(g,d.legacyContext),_=tn(l,d,g,y,E);var D=qr!==0;if(typeof _=="object"&&_!==null&&typeof _.render=="function"&&_.$$typeof===void 0)Rr(_,g,y,E),On(l,d,_,g);else if(D){y=d.treeContext,d.treeContext=Ln(y,1,0);try{_t(l,d,_)}finally{d.treeContext=y}}else _t(l,d,_)}else if(typeof g=="string"){switch(_=d.blockedSegment,E=me(_.chunks,g,y,l.responseState,_.formatContext),_.lastPushedText=!1,D=_.formatContext,_.formatContext=Ke(D,g,y),kn(l,d,E),_.formatContext=D,g){case"area":case"base":case"br":case"col":case"embed":case"hr":case"img":case"input":case"keygen":case"link":case"meta":case"param":case"source":case"track":case"wbr":break;default:_.chunks.push("</",g,">")}_.lastPushedText=!1}else{switch(g){case yr:case Mr:case He:case We:case Me:_t(l,d,y.children);return;case jt:_t(l,d,y.children);return;case Lt:throw Error(h(343));case rt:e:{g=d.blockedBoundary,_=d.blockedSegment,E=y.fallback,y=y.children,D=new Set;var re={id:null,rootSegmentID:-1,parentFlushed:!1,pendingTasks:0,forceClientRender:!1,completedSegments:[],byteSize:0,fallbackAbortableTasks:D,errorDigest:null},se=yn(l,_.chunks.length,re,_.formatContext,!1,!1);_.children.push(se),_.lastPushedText=!1;var Fe=yn(l,0,null,_.formatContext,!1,!1);Fe.parentFlushed=!0,d.blockedBoundary=re,d.blockedSegment=Fe;try{if(kn(l,d,y),l.responseState.generateStaticMarkup||Fe.lastPushedText&&Fe.textEmbedded&&Fe.chunks.push("<!-- -->"),Fe.status=1,Br(re,Fe),re.pendingTasks===0)break e}catch($e){Fe.status=4,re.forceClientRender=!0,re.errorDigest=en(l,$e)}finally{d.blockedBoundary=g,d.blockedSegment=_}d=vn(l,E,g,se,D,d.legacyContext,d.context,d.treeContext),l.pingedTasks.push(d)}return}if(typeof g=="object"&&g!==null)switch(g.$$typeof){case X:if(y=tn(l,d,g.render,y,_),qr!==0){g=d.treeContext,d.treeContext=Ln(g,1,0);try{_t(l,d,y)}finally{d.treeContext=g}}else _t(l,d,y);return;case Tr:g=g.type,y=Vn(g,y),ot(l,d,g,y,_);return;case et:if(_=y.children,g=g._context,y=y.value,E=g._currentValue2,g._currentValue2=y,D=or,or=y={parent:D,depth:D===null?0:D.depth+1,context:g,parentValue:E,value:y},d.context=y,_t(l,d,_),l=or,l===null)throw Error(h(403));y=l.parentValue,l.context._currentValue2=y===Tn?l.context._defaultValue:y,l=or=l.parent,d.context=l;return;case tt:y=y.children,y=y(g._currentValue2),_t(l,d,y);return;case st:_=g._init,g=_(g._payload),y=Vn(g,y),ot(l,d,g,y,void 0);return}throw Error(h(130,g==null?g:typeof g,""))}}function _t(l,d,g){if(d.node=g,typeof g=="object"&&g!==null){switch(g.$$typeof){case U:ot(l,d,g.type,g.props,g.ref);return;case Oe:throw Error(h(257));case st:var y=g._init;g=y(g._payload),_t(l,d,g);return}if(ue(g)){wn(l,d,g);return}if(g===null||typeof g!="object"?y=null:(y=Yr&&g[Yr]||g["@@iterator"],y=typeof y=="function"?y:null),y&&(y=y.call(g))){if(g=y.next(),!g.done){var _=[];do _.push(g.value),g=y.next();while(!g.done);wn(l,d,_)}return}throw l=Object.prototype.toString.call(g),Error(h(31,l==="[object Object]"?"object with keys {"+Object.keys(g).join(", ")+"}":l))}typeof g=="string"?(y=d.blockedSegment,y.lastPushedText=ce(d.blockedSegment.chunks,g,l.responseState,y.lastPushedText)):typeof g=="number"&&(y=d.blockedSegment,y.lastPushedText=ce(d.blockedSegment.chunks,""+g,l.responseState,y.lastPushedText))}function wn(l,d,g){for(var y=g.length,_=0;_<y;_++){var E=d.treeContext;d.treeContext=Ln(E,y,_);try{kn(l,d,g[_])}finally{d.treeContext=E}}}function kn(l,d,g){var y=d.blockedSegment.formatContext,_=d.legacyContext,E=d.context;try{return _t(l,d,g)}catch(se){if(gn(),typeof se=="object"&&se!==null&&typeof se.then=="function"){g=se;var D=d.blockedSegment,re=yn(l,D.chunks.length,null,D.formatContext,D.lastPushedText,!0);D.children.push(re),D.lastPushedText=!1,l=vn(l,d.node,d.blockedBoundary,re,d.abortSet,d.legacyContext,d.context,d.treeContext).ping,g.then(l,l),d.blockedSegment.formatContext=y,d.legacyContext=_,d.context=E,wr(E)}else throw d.blockedSegment.formatContext=y,d.legacyContext=_,d.context=E,wr(E),se}}function rn(l){var d=l.blockedBoundary;l=l.blockedSegment,l.status=3,mr(this,d,l)}function nn(l,d,g){var y=l.blockedBoundary;l.blockedSegment.status=3,y===null?(d.allPendingTasks--,d.status!==2&&(d.status=2,d.destination!==null&&d.destination.push(null))):(y.pendingTasks--,y.forceClientRender||(y.forceClientRender=!0,l=g===void 0?Error(h(432)):g,y.errorDigest=d.onError(l),y.parentFlushed&&d.clientRenderedBoundaries.push(y)),y.fallbackAbortableTasks.forEach(function(_){return nn(_,d,g)}),y.fallbackAbortableTasks.clear(),d.allPendingTasks--,d.allPendingTasks===0&&(y=d.onAllReady,y()))}function Br(l,d){if(d.chunks.length===0&&d.children.length===1&&d.children[0].boundary===null){var g=d.children[0];g.id=d.id,g.parentFlushed=!0,g.status===1&&Br(l,g)}else l.completedSegments.push(d)}function mr(l,d,g){if(d===null){if(g.parentFlushed){if(l.completedRootSegment!==null)throw Error(h(389));l.completedRootSegment=g}l.pendingRootTasks--,l.pendingRootTasks===0&&(l.onShellError=qt,d=l.onShellReady,d())}else d.pendingTasks--,d.forceClientRender||(d.pendingTasks===0?(g.parentFlushed&&g.status===1&&Br(d,g),d.parentFlushed&&l.completedBoundaries.push(d),d.fallbackAbortableTasks.forEach(rn,l),d.fallbackAbortableTasks.clear()):g.parentFlushed&&g.status===1&&(Br(d,g),d.completedSegments.length===1&&d.parentFlushed&&l.partialBoundaries.push(d)));l.allPendingTasks--,l.allPendingTasks===0&&(l=l.onAllReady,l())}function Xt(l){if(l.status!==2){var d=or,g=In.current;In.current=xn;var y=ft;ft=l.responseState;try{var _=l.pingedTasks,E;for(E=0;E<_.length;E++){var D=_[E],re=l,se=D.blockedSegment;if(se.status===0){wr(D.context);try{_t(re,D,D.node),re.responseState.generateStaticMarkup||se.lastPushedText&&se.textEmbedded&&se.chunks.push("<!-- -->"),D.abortSet.delete(D),se.status=1,mr(re,D.blockedBoundary,se)}catch(x){if(gn(),typeof x=="object"&&x!==null&&typeof x.then=="function"){var Fe=D.ping;x.then(Fe,Fe)}else{D.abortSet.delete(D),se.status=4;var $e=D.blockedBoundary,at=x,Zt=en(re,at);if($e===null?Wt(re,at):($e.pendingTasks--,$e.forceClientRender||($e.forceClientRender=!0,$e.errorDigest=Zt,$e.parentFlushed&&re.clientRenderedBoundaries.push($e))),re.allPendingTasks--,re.allPendingTasks===0){var Jt=re.onAllReady;Jt()}}}finally{}}}_.splice(0,E),l.destination!==null&&Ar(l,l.destination)}catch(x){en(l,x),Wt(l,x)}finally{ft=y,In.current=g,g===xn&&wr(d)}}}function $r(l,d,g){switch(g.parentFlushed=!0,g.status){case 0:var y=g.id=l.nextSegmentId++;return g.lastPushedText=!1,g.textEmbedded=!1,l=l.responseState,d.push('<template id="'),d.push(l.placeholderPrefix),l=y.toString(16),d.push(l),d.push('"></template>');case 1:g.status=2;var _=!0;y=g.chunks;var E=0;g=g.children;for(var D=0;D<g.length;D++){for(_=g[D];E<_.index;E++)d.push(y[E]);_=Ct(l,d,_)}for(;E<y.length-1;E++)d.push(y[E]);return E<y.length&&(_=d.push(y[E])),_;default:throw Error(h(390))}}function Ct(l,d,g){var y=g.boundary;if(y===null)return $r(l,d,g);if(y.parentFlushed=!0,y.forceClientRender)return l.responseState.generateStaticMarkup||(y=y.errorDigest,d.push("<!--$!-->"),d.push("<template"),y&&(d.push(' data-dgst="'),y=he(y),d.push(y),d.push('"')),d.push("></template>")),$r(l,d,g),l=l.responseState.generateStaticMarkup?!0:d.push("<!--/$-->"),l;if(0<y.pendingTasks){y.rootSegmentID=l.nextSegmentId++,0<y.completedSegments.length&&l.partialBoundaries.push(y);var _=l.responseState,E=_.nextSuspenseID++;return _=_.boundaryPrefix+E.toString(16),y=y.id=_,O(d,l.responseState,y),$r(l,d,g),d.push("<!--/$-->")}if(y.byteSize>l.progressiveChunkSize)return y.rootSegmentID=l.nextSegmentId++,l.completedBoundaries.push(y),O(d,l.responseState,y.id),$r(l,d,g),d.push("<!--/$-->");if(l.responseState.generateStaticMarkup||d.push("<!--$-->"),g=y.completedSegments,g.length!==1)throw Error(h(391));return Ct(l,d,g[0]),l=l.responseState.generateStaticMarkup?!0:d.push("<!--/$-->"),l}function Qn(l,d,g){return le(d,l.responseState,g.formatContext,g.id),Ct(l,d,g),Le(d,g.formatContext)}function Yn(l,d,g){for(var y=g.completedSegments,_=0;_<y.length;_++)Kn(l,d,g,y[_]);if(y.length=0,l=l.responseState,y=g.id,g=g.rootSegmentID,d.push(l.startInlineScript),l.sentCompleteBoundaryFunction?d.push('$RC("'):(l.sentCompleteBoundaryFunction=!0,d.push('function $RC(a,b){a=document.getElementById(a);b=document.getElementById(b);b.parentNode.removeChild(b);if(a){a=a.previousSibling;var f=a.parentNode,c=a.nextSibling,e=0;do{if(c&&8===c.nodeType){var d=c.data;if("/$"===d)if(0===e)break;else e--;else"$"!==d&&"$?"!==d&&"$!"!==d||e++}d=c.nextSibling;f.removeChild(c);c=d}while(c);for(;b.firstChild;)f.insertBefore(b.firstChild,c);a.data="$";a._reactRetry&&a._reactRetry()}};$RC("')),y===null)throw Error(h(395));return g=g.toString(16),d.push(y),d.push('","'),d.push(l.segmentPrefix),d.push(g),d.push('")<\/script>')}function Kn(l,d,g,y){if(y.status===2)return!0;var _=y.id;if(_===-1){if((y.id=g.rootSegmentID)===-1)throw Error(h(392));return Qn(l,d,y)}return Qn(l,d,y),l=l.responseState,d.push(l.startInlineScript),l.sentCompleteSegmentFunction?d.push('$RS("'):(l.sentCompleteSegmentFunction=!0,d.push('function $RS(a,b){a=document.getElementById(a);b=document.getElementById(b);for(a.parentNode.removeChild(a);a.firstChild;)b.parentNode.insertBefore(a.firstChild,b);b.parentNode.removeChild(b)};$RS("')),d.push(l.segmentPrefix),_=_.toString(16),d.push(_),d.push('","'),d.push(l.placeholderPrefix),d.push(_),d.push('")<\/script>')}function Ar(l,d){try{var g=l.completedRootSegment;if(g!==null&&l.pendingRootTasks===0){Ct(l,d,g),l.completedRootSegment=null;var y=l.responseState.bootstrapChunks;for(g=0;g<y.length-1;g++)d.push(y[g]);g<y.length&&d.push(y[g])}var _=l.clientRenderedBoundaries,E;for(E=0;E<_.length;E++){var D=_[E];y=d;var re=l.responseState,se=D.id,Fe=D.errorDigest,$e=D.errorMessage,at=D.errorComponentStack;if(y.push(re.startInlineScript),re.sentClientRenderFunction?y.push('$RX("'):(re.sentClientRenderFunction=!0,y.push('function $RX(b,c,d,e){var a=document.getElementById(b);a&&(b=a.previousSibling,b.data="$!",a=a.dataset,c&&(a.dgst=c),d&&(a.msg=d),e&&(a.stck=e),b._reactRetry&&b._reactRetry())};$RX("')),se===null)throw Error(h(395));if(y.push(se),y.push('"'),Fe||$e||at){y.push(",");var Zt=Z(Fe||"");y.push(Zt)}if($e||at){y.push(",");var Jt=Z($e||"");y.push(Jt)}if(at){y.push(",");var x=Z(at);y.push(x)}if(!y.push(")<\/script>")){l.destination=null,E++,_.splice(0,E);return}}_.splice(0,E);var C=l.completedBoundaries;for(E=0;E<C.length;E++)if(!Yn(l,d,C[E])){l.destination=null,E++,C.splice(0,E);return}C.splice(0,E);var $=l.partialBoundaries;for(E=0;E<$.length;E++){var V=$[E];e:{_=l,D=d;var de=V.completedSegments;for(re=0;re<de.length;re++)if(!Kn(_,D,V,de[re])){re++,de.splice(0,re);var fe=!1;break e}de.splice(0,re),fe=!0}if(!fe){l.destination=null,E++,$.splice(0,E);return}}$.splice(0,E);var ge=l.completedBoundaries;for(E=0;E<ge.length;E++)if(!Yn(l,d,ge[E])){l.destination=null,E++,ge.splice(0,E);return}ge.splice(0,E)}finally{l.allPendingTasks===0&&l.pingedTasks.length===0&&l.clientRenderedBoundaries.length===0&&l.completedBoundaries.length===0&&d.push(null)}}function bn(l,d){try{var g=l.abortableTasks;g.forEach(function(y){return nn(y,l,d)}),g.clear(),l.destination!==null&&Ar(l,l.destination)}catch(y){en(l,y),Wt(l,y)}}function on(){}function ln(l,d,g,y){var _=!1,E=null,D="",re={push:function(Fe){return Fe!==null&&(D+=Fe),!0},destroy:function(Fe){_=!0,E=Fe}},se=!1;if(l=wt(l,pe(g,d?d.identifierPrefix:void 0),{insertionMode:1,selectedValue:null},1/0,on,void 0,function(){se=!0}),Xt(l),bn(l,y),l.status===1)l.status=2,re.destroy(l.fatalError);else if(l.status!==2&&l.destination===null){l.destination=re;try{Ar(l,re)}catch(Fe){en(l,Fe),Wt(l,Fe)}}if(_)throw E;if(!se)throw Error(h(426));return D}return Qo.renderToNodeStream=function(){throw Error(h(207))},Qo.renderToStaticMarkup=function(l,d){return ln(l,d,!0,'The server used "renderToStaticMarkup" which does not support Suspense. If you intended to have the server wait for the suspended component please switch to "renderToReadableStream" which supports Suspense on the server')},Qo.renderToStaticNodeStream=function(){throw Error(h(208))},Qo.renderToString=function(l,d){return ln(l,d,!1,'The server used "renderToString" which does not support Suspense. If you intended for this Suspense boundary to render the fallback content on the server consider throwing an Error somewhere within the Suspense boundary. If you intended to have the server wait for the suspended component please switch to "renderToReadableStream" which supports Suspense on the server')},Qo.version="18.3.1",Qo}var la={};/**
 * @license React
 * react-dom-server.browser.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var jd;function bh(){if(jd)return la;jd=1;var u=nl();function h(a){for(var c="https://reactjs.org/docs/error-decoder.html?invariant="+a,m=1;m<arguments.length;m++)c+="&args[]="+encodeURIComponent(arguments[m]);return"Minified React error #"+a+"; visit "+c+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var p=null,j=0;function k(a,c){if(c.length!==0)if(512<c.length)0<j&&(a.enqueue(new Uint8Array(p.buffer,0,j)),p=new Uint8Array(512),j=0),a.enqueue(c);else{var m=p.length-j;m<c.length&&(m===0?a.enqueue(p):(p.set(c.subarray(0,m),j),a.enqueue(p),c=c.subarray(m)),p=new Uint8Array(512),j=0),p.set(c,j),j+=c.length}}function L(a,c){return k(a,c),!0}function ae(a){p&&0<j&&(a.enqueue(new Uint8Array(p.buffer,0,j)),p=null,j=0)}var G=new TextEncoder;function F(a){return G.encode(a)}function B(a){return G.encode(a)}function Y(a,c){typeof a.error=="function"?a.error(c):a.close()}var H=Object.prototype.hasOwnProperty,ie=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,ne={},he={};function ze(a){return H.call(he,a)?!0:H.call(ne,a)?!1:ie.test(a)?he[a]=!0:(ne[a]=!0,!1)}function W(a,c,m,v,M,P,A){this.acceptsBooleans=c===2||c===3||c===4,this.attributeName=v,this.attributeNamespace=M,this.mustUseProperty=m,this.propertyName=a,this.type=c,this.sanitizeURL=P,this.removeEmptyString=A}var ue={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(a){ue[a]=new W(a,0,!1,a,null,!1,!1)}),[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(a){var c=a[0];ue[c]=new W(c,1,!1,a[1],null,!1,!1)}),["contentEditable","draggable","spellCheck","value"].forEach(function(a){ue[a]=new W(a,2,!1,a.toLowerCase(),null,!1,!1)}),["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(a){ue[a]=new W(a,2,!1,a,null,!1,!1)}),"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(a){ue[a]=new W(a,3,!1,a.toLowerCase(),null,!1,!1)}),["checked","multiple","muted","selected"].forEach(function(a){ue[a]=new W(a,3,!0,a,null,!1,!1)}),["capture","download"].forEach(function(a){ue[a]=new W(a,4,!1,a,null,!1,!1)}),["cols","rows","size","span"].forEach(function(a){ue[a]=new W(a,6,!1,a,null,!1,!1)}),["rowSpan","start"].forEach(function(a){ue[a]=new W(a,5,!1,a.toLowerCase(),null,!1,!1)});var Pe=/[\-:]([a-z])/g;function Ke(a){return a[1].toUpperCase()}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(a){var c=a.replace(Pe,Ke);ue[c]=new W(c,1,!1,a,null,!1,!1)}),"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(a){var c=a.replace(Pe,Ke);ue[c]=new W(c,1,!1,a,"http://www.w3.org/1999/xlink",!1,!1)}),["xml:base","xml:lang","xml:space"].forEach(function(a){var c=a.replace(Pe,Ke);ue[c]=new W(c,1,!1,a,"http://www.w3.org/XML/1998/namespace",!1,!1)}),["tabIndex","crossOrigin"].forEach(function(a){ue[a]=new W(a,1,!1,a.toLowerCase(),null,!1,!1)}),ue.xlinkHref=new W("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1),["src","href","action","formAction"].forEach(function(a){ue[a]=new W(a,1,!1,a.toLowerCase(),null,!0,!0)});var Te={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},Ee=["Webkit","ms","Moz","O"];Object.keys(Te).forEach(function(a){Ee.forEach(function(c){c=c+a.charAt(0).toUpperCase()+a.substring(1),Te[c]=Te[a]})});var ke=/["'&<>]/;function ve(a){if(typeof a=="boolean"||typeof a=="number")return""+a;a=""+a;var c=ke.exec(a);if(c){var m="",v,M=0;for(v=c.index;v<a.length;v++){switch(a.charCodeAt(v)){case 34:c="&quot;";break;case 38:c="&amp;";break;case 39:c="&#x27;";break;case 60:c="&lt;";break;case 62:c="&gt;";break;default:continue}M!==v&&(m+=a.substring(M,v)),M=v+1,m+=c}a=M!==v?m+a.substring(M,v):m}return a}var Ge=/([A-Z])/g,Se=/^ms-/,lt=Array.isArray,Je=B("<script>"),q=B("<\/script>"),me=B('<script src="'),O=B('<script type="module" src="'),le=B('" async=""><\/script>'),Le=/(<\/|<)(s)(cript)/gi;function Be(a,c,m,v){return""+c+(m==="s"?"\\u0073":"\\u0053")+v}function Z(a,c,m,v,M){a=a===void 0?"":a,c=c===void 0?Je:B('<script nonce="'+ve(c)+'">');var P=[];if(m!==void 0&&P.push(c,F((""+m).replace(Le,Be)),q),v!==void 0)for(m=0;m<v.length;m++)P.push(me,F(ve(v[m])),le);if(M!==void 0)for(v=0;v<M.length;v++)P.push(O,F(ve(M[v])),le);return{bootstrapChunks:P,startInlineScript:c,placeholderPrefix:B(a+"P:"),segmentPrefix:B(a+"S:"),boundaryPrefix:a+"B:",idPrefix:a,nextSuspenseID:0,sentCompleteSegmentFunction:!1,sentCompleteBoundaryFunction:!1,sentClientRenderFunction:!1}}function pe(a,c){return{insertionMode:a,selectedValue:c}}function ce(a){return pe(a==="http://www.w3.org/2000/svg"?2:a==="http://www.w3.org/1998/Math/MathML"?3:0,null)}function z(a,c,m){switch(c){case"select":return pe(1,m.value!=null?m.value:m.defaultValue);case"svg":return pe(2,null);case"math":return pe(3,null);case"foreignObject":return pe(1,null);case"table":return pe(4,null);case"thead":case"tbody":case"tfoot":return pe(5,null);case"colgroup":return pe(7,null);case"tr":return pe(6,null)}return 4<=a.insertionMode||a.insertionMode===0?pe(1,null):a}var U=B("<!-- -->");function Oe(a,c,m,v){return c===""?v:(v&&a.push(U),a.push(F(ve(c))),!0)}var Me=new Map,He=B(' style="'),We=B(":"),et=B(";");function tt(a,c,m){if(typeof m!="object")throw Error(h(62));c=!0;for(var v in m)if(H.call(m,v)){var M=m[v];if(M!=null&&typeof M!="boolean"&&M!==""){if(v.indexOf("--")===0){var P=F(ve(v));M=F(ve((""+M).trim()))}else{P=v;var A=Me.get(P);A!==void 0||(A=B(ve(P.replace(Ge,"-$1").toLowerCase().replace(Se,"-ms-"))),Me.set(P,A)),P=A,M=typeof M=="number"?M===0||H.call(Te,v)?F(""+M):F(M+"px"):F(ve((""+M).trim()))}c?(c=!1,a.push(He,P,We,M)):a.push(et,P,We,M)}}c||a.push(jt)}var X=B(" "),rt=B('="'),jt=B('"'),Tr=B('=""');function st(a,c,m,v){switch(m){case"style":tt(a,c,v);return;case"defaultValue":case"defaultChecked":case"innerHTML":case"suppressContentEditableWarning":case"suppressHydrationWarning":return}if(!(2<m.length)||m[0]!=="o"&&m[0]!=="O"||m[1]!=="n"&&m[1]!=="N"){if(c=ue.hasOwnProperty(m)?ue[m]:null,c!==null){switch(typeof v){case"function":case"symbol":return;case"boolean":if(!c.acceptsBooleans)return}switch(m=F(c.attributeName),c.type){case 3:v&&a.push(X,m,Tr);break;case 4:v===!0?a.push(X,m,Tr):v!==!1&&a.push(X,m,rt,F(ve(v)),jt);break;case 5:isNaN(v)||a.push(X,m,rt,F(ve(v)),jt);break;case 6:!isNaN(v)&&1<=v&&a.push(X,m,rt,F(ve(v)),jt);break;default:c.sanitizeURL&&(v=""+v),a.push(X,m,rt,F(ve(v)),jt)}}else if(ze(m)){switch(typeof v){case"function":case"symbol":return;case"boolean":if(c=m.toLowerCase().slice(0,5),c!=="data-"&&c!=="aria-")return}a.push(X,F(m),rt,F(ve(v)),jt)}}}var Lt=B(">"),Mr=B("/>");function yr(a,c,m){if(c!=null){if(m!=null)throw Error(h(60));if(typeof c!="object"||!("__html"in c))throw Error(h(61));c=c.__html,c!=null&&a.push(F(""+c))}}function Tn(a){var c="";return u.Children.forEach(a,function(m){m!=null&&(c+=m)}),c}var Yr=B(' selected=""');function nr(a,c,m,v){a.push(dt(m));var M=m=null,P;for(P in c)if(H.call(c,P)){var A=c[P];if(A!=null)switch(P){case"children":m=A;break;case"dangerouslySetInnerHTML":M=A;break;default:st(a,v,P,A)}}return a.push(Lt),yr(a,M,m),typeof m=="string"?(a.push(F(ve(m))),null):m}var Nt=B(`
`),Lr=/^[a-zA-Z][a-zA-Z:_\.\-\d]*$/,or=new Map;function dt(a){var c=or.get(a);if(c===void 0){if(!Lr.test(a))throw Error(h(65,a));c=B("<"+a),or.set(a,c)}return c}var Mn=B("<!DOCTYPE html>");function Fr(a,c,m,v,M){switch(c){case"select":a.push(dt("select"));var P=null,A=null;for(Ae in m)if(H.call(m,Ae)){var te=m[Ae];if(te!=null)switch(Ae){case"children":P=te;break;case"dangerouslySetInnerHTML":A=te;break;case"defaultValue":case"value":break;default:st(a,v,Ae,te)}}return a.push(Lt),yr(a,A,P),P;case"option":A=M.selectedValue,a.push(dt("option"));var De=te=null,Ye=null,Ae=null;for(P in m)if(H.call(m,P)){var pt=m[P];if(pt!=null)switch(P){case"children":te=pt;break;case"selected":Ye=pt;break;case"dangerouslySetInnerHTML":Ae=pt;break;case"value":De=pt;default:st(a,v,P,pt)}}if(A!=null)if(m=De!==null?""+De:Tn(te),lt(A)){for(v=0;v<A.length;v++)if(""+A[v]===m){a.push(Yr);break}}else""+A===m&&a.push(Yr);else Ye&&a.push(Yr);return a.push(Lt),yr(a,Ae,te),te;case"textarea":a.push(dt("textarea")),Ae=A=P=null;for(te in m)if(H.call(m,te)&&(De=m[te],De!=null))switch(te){case"children":Ae=De;break;case"value":P=De;break;case"defaultValue":A=De;break;case"dangerouslySetInnerHTML":throw Error(h(91));default:st(a,v,te,De)}if(P===null&&A!==null&&(P=A),a.push(Lt),Ae!=null){if(P!=null)throw Error(h(92));if(lt(Ae)&&1<Ae.length)throw Error(h(93));P=""+Ae}return typeof P=="string"&&P[0]===`
`&&a.push(Nt),P!==null&&a.push(F(ve(""+P))),null;case"input":a.push(dt("input")),De=Ae=te=P=null;for(A in m)if(H.call(m,A)&&(Ye=m[A],Ye!=null))switch(A){case"children":case"dangerouslySetInnerHTML":throw Error(h(399,"input"));case"defaultChecked":De=Ye;break;case"defaultValue":te=Ye;break;case"checked":Ae=Ye;break;case"value":P=Ye;break;default:st(a,v,A,Ye)}return Ae!==null?st(a,v,"checked",Ae):De!==null&&st(a,v,"checked",De),P!==null?st(a,v,"value",P):te!==null&&st(a,v,"value",te),a.push(Mr),null;case"menuitem":a.push(dt("menuitem"));for(var ur in m)if(H.call(m,ur)&&(P=m[ur],P!=null))switch(ur){case"children":case"dangerouslySetInnerHTML":throw Error(h(400));default:st(a,v,ur,P)}return a.push(Lt),null;case"title":a.push(dt("title")),P=null;for(pt in m)if(H.call(m,pt)&&(A=m[pt],A!=null))switch(pt){case"children":P=A;break;case"dangerouslySetInnerHTML":throw Error(h(434));default:st(a,v,pt,A)}return a.push(Lt),P;case"listing":case"pre":a.push(dt(c)),A=P=null;for(De in m)if(H.call(m,De)&&(te=m[De],te!=null))switch(De){case"children":P=te;break;case"dangerouslySetInnerHTML":A=te;break;default:st(a,v,De,te)}if(a.push(Lt),A!=null){if(P!=null)throw Error(h(60));if(typeof A!="object"||!("__html"in A))throw Error(h(61));m=A.__html,m!=null&&(typeof m=="string"&&0<m.length&&m[0]===`
`?a.push(Nt,F(m)):a.push(F(""+m)))}return typeof P=="string"&&P[0]===`
`&&a.push(Nt),P;case"area":case"base":case"br":case"col":case"embed":case"hr":case"img":case"keygen":case"link":case"meta":case"param":case"source":case"track":case"wbr":a.push(dt(c));for(var zr in m)if(H.call(m,zr)&&(P=m[zr],P!=null))switch(zr){case"children":case"dangerouslySetInnerHTML":throw Error(h(399,c));default:st(a,v,zr,P)}return a.push(Mr),null;case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return nr(a,m,c,v);case"html":return M.insertionMode===0&&a.push(Mn),nr(a,m,c,v);default:if(c.indexOf("-")===-1&&typeof m.is!="string")return nr(a,m,c,v);a.push(dt(c)),A=P=null;for(Ye in m)if(H.call(m,Ye)&&(te=m[Ye],te!=null))switch(Ye){case"children":P=te;break;case"dangerouslySetInnerHTML":A=te;break;case"style":tt(a,v,te);break;case"suppressContentEditableWarning":case"suppressHydrationWarning":break;default:ze(Ye)&&typeof te!="function"&&typeof te!="symbol"&&a.push(X,F(Ye),rt,F(ve(te)),jt)}return a.push(Lt),yr(a,A,P),P}}var fn=B("</"),$t=B(">"),wr=B('<template id="'),hn=B('"></template>'),Rr=B("<!--$-->"),Kr=B('<!--$?--><template id="'),Ln=B('"></template>'),Ir=B("<!--$!-->"),Fn=B("<!--/$-->"),ao=B("<template"),kr=B('"'),Rn=B(' data-dgst="');B(' data-msg="'),B(' data-stck="');var mn=B("></template>");function Pt(a,c,m){if(k(a,Kr),m===null)throw Error(h(395));return k(a,m),L(a,Ln)}var At=B('<div hidden id="'),hr=B('">'),Xe=B("</div>"),Ut=B('<svg aria-hidden="true" style="display:none" id="'),Gr=B('">'),qr=B("</svg>"),Ht=B('<math aria-hidden="true" style="display:none" id="'),Gt=B('">'),ir=B("</math>"),Xr=B('<table hidden id="'),Ft=B('">'),gn=B("</table>"),br=B('<table hidden><tbody id="'),Zr=B('">'),lr=B("</tbody></table>"),Or=B('<table hidden><tr id="'),Jr=B('">'),Dr=B("</tr></table>"),xn=B('<table hidden><colgroup id="'),ft=B('">'),In=B("</colgroup></table>");function ar(a,c,m,v){switch(m.insertionMode){case 0:case 1:return k(a,At),k(a,c.segmentPrefix),k(a,F(v.toString(16))),L(a,hr);case 2:return k(a,Ut),k(a,c.segmentPrefix),k(a,F(v.toString(16))),L(a,Gr);case 3:return k(a,Ht),k(a,c.segmentPrefix),k(a,F(v.toString(16))),L(a,Gt);case 4:return k(a,Xr),k(a,c.segmentPrefix),k(a,F(v.toString(16))),L(a,Ft);case 5:return k(a,br),k(a,c.segmentPrefix),k(a,F(v.toString(16))),L(a,Zr);case 6:return k(a,Or),k(a,c.segmentPrefix),k(a,F(v.toString(16))),L(a,Jr);case 7:return k(a,xn),k(a,c.segmentPrefix),k(a,F(v.toString(16))),L(a,ft);default:throw Error(h(397))}}function qt(a,c){switch(c.insertionMode){case 0:case 1:return L(a,Xe);case 2:return L(a,qr);case 3:return L(a,ir);case 4:return L(a,gn);case 5:return L(a,lr);case 6:return L(a,Dr);case 7:return L(a,In);default:throw Error(h(397))}}var wt=B('function $RS(a,b){a=document.getElementById(a);b=document.getElementById(b);for(a.parentNode.removeChild(a);a.firstChild;)b.parentNode.insertBefore(a.firstChild,b);b.parentNode.removeChild(b)};$RS("'),vn=B('$RS("'),yn=B('","'),en=B('")<\/script>'),Wt=B('function $RC(a,b){a=document.getElementById(a);b=document.getElementById(b);b.parentNode.removeChild(b);if(a){a=a.previousSibling;var f=a.parentNode,c=a.nextSibling,e=0;do{if(c&&8===c.nodeType){var d=c.data;if("/$"===d)if(0===e)break;else e--;else"$"!==d&&"$?"!==d&&"$!"!==d||e++}d=c.nextSibling;f.removeChild(c);c=d}while(c);for(;b.firstChild;)f.insertBefore(b.firstChild,c);a.data="$";a._reactRetry&&a._reactRetry()}};$RC("'),tn=B('$RC("'),On=B('","'),Vn=B('")<\/script>'),ot=B('function $RX(b,c,d,e){var a=document.getElementById(b);a&&(b=a.previousSibling,b.data="$!",a=a.dataset,c&&(a.dgst=c),d&&(a.msg=d),e&&(a.stck=e),b._reactRetry&&b._reactRetry())};$RX("'),_t=B('$RX("'),wn=B('"'),kn=B(")<\/script>"),rn=B(","),nn=/[<\u2028\u2029]/g;function Br(a){return JSON.stringify(a).replace(nn,function(c){switch(c){case"<":return"\\u003c";case"\u2028":return"\\u2028";case"\u2029":return"\\u2029";default:throw Error("escapeJSStringsForInstructionScripts encountered a match it does not know how to replace. this means the match regex and the replacement characters are no longer in sync. This is a bug in React")}})}var mr=Object.assign,Xt=Symbol.for("react.element"),$r=Symbol.for("react.portal"),Ct=Symbol.for("react.fragment"),Qn=Symbol.for("react.strict_mode"),Yn=Symbol.for("react.profiler"),Kn=Symbol.for("react.provider"),Ar=Symbol.for("react.context"),bn=Symbol.for("react.forward_ref"),on=Symbol.for("react.suspense"),ln=Symbol.for("react.suspense_list"),l=Symbol.for("react.memo"),d=Symbol.for("react.lazy"),g=Symbol.for("react.scope"),y=Symbol.for("react.debug_trace_mode"),_=Symbol.for("react.legacy_hidden"),E=Symbol.for("react.default_value"),D=Symbol.iterator;function re(a){if(a==null)return null;if(typeof a=="function")return a.displayName||a.name||null;if(typeof a=="string")return a;switch(a){case Ct:return"Fragment";case $r:return"Portal";case Yn:return"Profiler";case Qn:return"StrictMode";case on:return"Suspense";case ln:return"SuspenseList"}if(typeof a=="object")switch(a.$$typeof){case Ar:return(a.displayName||"Context")+".Consumer";case Kn:return(a._context.displayName||"Context")+".Provider";case bn:var c=a.render;return a=a.displayName,a||(a=c.displayName||c.name||"",a=a!==""?"ForwardRef("+a+")":"ForwardRef"),a;case l:return c=a.displayName||null,c!==null?c:re(a.type)||"Memo";case d:c=a._payload,a=a._init;try{return re(a(c))}catch{}}return null}var se={};function Fe(a,c){if(a=a.contextTypes,!a)return se;var m={},v;for(v in a)m[v]=c[v];return m}var $e=null;function at(a,c){if(a!==c){a.context._currentValue=a.parentValue,a=a.parent;var m=c.parent;if(a===null){if(m!==null)throw Error(h(401))}else{if(m===null)throw Error(h(401));at(a,m)}c.context._currentValue=c.value}}function Zt(a){a.context._currentValue=a.parentValue,a=a.parent,a!==null&&Zt(a)}function Jt(a){var c=a.parent;c!==null&&Jt(c),a.context._currentValue=a.value}function x(a,c){if(a.context._currentValue=a.parentValue,a=a.parent,a===null)throw Error(h(402));a.depth===c.depth?at(a,c):x(a,c)}function C(a,c){var m=c.parent;if(m===null)throw Error(h(402));a.depth===m.depth?at(a,m):C(a,m),c.context._currentValue=c.value}function $(a){var c=$e;c!==a&&(c===null?Jt(a):a===null?Zt(c):c.depth===a.depth?at(c,a):c.depth>a.depth?x(c,a):C(c,a),$e=a)}var V={isMounted:function(){return!1},enqueueSetState:function(a,c){a=a._reactInternals,a.queue!==null&&a.queue.push(c)},enqueueReplaceState:function(a,c){a=a._reactInternals,a.replace=!0,a.queue=[c]},enqueueForceUpdate:function(){}};function de(a,c,m,v){var M=a.state!==void 0?a.state:null;a.updater=V,a.props=m,a.state=M;var P={queue:[],replace:!1};a._reactInternals=P;var A=c.contextType;if(a.context=typeof A=="object"&&A!==null?A._currentValue:v,A=c.getDerivedStateFromProps,typeof A=="function"&&(A=A(m,M),M=A==null?M:mr({},M,A),a.state=M),typeof c.getDerivedStateFromProps!="function"&&typeof a.getSnapshotBeforeUpdate!="function"&&(typeof a.UNSAFE_componentWillMount=="function"||typeof a.componentWillMount=="function"))if(c=a.state,typeof a.componentWillMount=="function"&&a.componentWillMount(),typeof a.UNSAFE_componentWillMount=="function"&&a.UNSAFE_componentWillMount(),c!==a.state&&V.enqueueReplaceState(a,a.state,null),P.queue!==null&&0<P.queue.length)if(c=P.queue,A=P.replace,P.queue=null,P.replace=!1,A&&c.length===1)a.state=c[0];else{for(P=A?c[0]:a.state,M=!0,A=A?1:0;A<c.length;A++){var te=c[A];te=typeof te=="function"?te.call(a,P,m,v):te,te!=null&&(M?(M=!1,P=mr({},P,te)):mr(P,te))}a.state=P}else P.queue=null}var fe={id:1,overflow:""};function ge(a,c,m){var v=a.id;a=a.overflow;var M=32-_e(v)-1;v&=~(1<<M),m+=1;var P=32-_e(c)+M;if(30<P){var A=M-M%5;return P=(v&(1<<A)-1).toString(32),v>>=A,M-=A,{id:1<<32-_e(c)+M|m<<M|v,overflow:P+a}}return{id:1<<P|m<<M|v,overflow:a}}var _e=Math.clz32?Math.clz32:ht,Qe=Math.log,gt=Math.LN2;function ht(a){return a>>>=0,a===0?32:31-(Qe(a)/gt|0)|0}function Tt(a,c){return a===c&&(a!==0||1/a===1/c)||a!==a&&c!==c}var bt=typeof Object.is=="function"?Object.is:Tt,Rt=null,Ce=null,qe=null,ye=null,ut=!1,xt=!1,Ot=0,sr=null,so=0;function Gn(){if(Rt===null)throw Error(h(321));return Rt}function Ko(){if(0<so)throw Error(h(312));return{memoizedState:null,queue:null,next:null}}function uo(){return ye===null?qe===null?(ut=!1,qe=ye=Ko()):(ut=!0,ye=qe):ye.next===null?(ut=!1,ye=ye.next=Ko()):(ut=!0,ye=ye.next),ye}function No(){Ce=Rt=null,xt=!1,qe=null,so=0,ye=sr=null}function ji(a,c){return typeof c=="function"?c(a):c}function zn(a,c,m){if(Rt=Gn(),ye=uo(),ut){var v=ye.queue;if(c=v.dispatch,sr!==null&&(m=sr.get(v),m!==void 0)){sr.delete(v),v=ye.memoizedState;do v=a(v,m.action),m=m.next;while(m!==null);return ye.memoizedState=v,[v,c]}return[ye.memoizedState,c]}return a=a===ji?typeof c=="function"?c():c:m!==void 0?m(c):c,ye.memoizedState=a,a=ye.queue={last:null,dispatch:null},a=a.dispatch=qo.bind(null,Rt,a),[ye.memoizedState,a]}function Go(a,c){if(Rt=Gn(),ye=uo(),c=c===void 0?null:c,ye!==null){var m=ye.memoizedState;if(m!==null&&c!==null){var v=m[1];e:if(v===null)v=!1;else{for(var M=0;M<v.length&&M<c.length;M++)if(!bt(c[M],v[M])){v=!1;break e}v=!0}if(v)return m[0]}}return a=a(),ye.memoizedState=[a,c],a}function qo(a,c,m){if(25<=so)throw Error(h(301));if(a===Rt)if(xt=!0,a={action:m,next:null},sr===null&&(sr=new Map),m=sr.get(c),m===void 0)sr.set(c,a);else{for(c=m;c.next!==null;)c=c.next;c.next=a}}function ol(){throw Error(h(394))}function qn(){}var Po={readContext:function(a){return a._currentValue},useContext:function(a){return Gn(),a._currentValue},useMemo:Go,useReducer:zn,useRef:function(a){Rt=Gn(),ye=uo();var c=ye.memoizedState;return c===null?(a={current:a},ye.memoizedState=a):c},useState:function(a){return zn(ji,a)},useInsertionEffect:qn,useLayoutEffect:function(){},useCallback:function(a,c){return Go(function(){return a},c)},useImperativeHandle:qn,useEffect:qn,useDebugValue:qn,useDeferredValue:function(a){return Gn(),a},useTransition:function(){return Gn(),[!1,ol]},useId:function(){var a=Ce.treeContext,c=a.overflow;a=a.id,a=(a&~(1<<32-_e(a)-1)).toString(32)+c;var m=_o;if(m===null)throw Error(h(404));return c=Ot++,a=":"+m.idPrefix+"R"+a,0<c&&(a+="H"+c.toString(32)),a+":"},useMutableSource:function(a,c){return Gn(),c(a._source)},useSyncExternalStore:function(a,c,m){if(m===void 0)throw Error(h(407));return m()}},_o=null,er=u.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentDispatcher;function co(a){return console.error(a),null}function Xn(){}function To(a,c,m,v,M,P,A,te,De){var Ye=[],Ae=new Set;return c={destination:null,responseState:c,progressiveChunkSize:v===void 0?12800:v,status:0,fatalError:null,nextSegmentId:0,allPendingTasks:0,pendingRootTasks:0,completedRootSegment:null,abortableTasks:Ae,pingedTasks:Ye,clientRenderedBoundaries:[],completedBoundaries:[],partialBoundaries:[],onError:M===void 0?co:M,onAllReady:P===void 0?Xn:P,onShellReady:A===void 0?Xn:A,onShellError:te===void 0?Xn:te,onFatalError:De===void 0?Xn:De},m=po(c,0,null,m,!1,!1),m.parentFlushed=!0,a=Ci(c,a,null,m,Ae,se,null,fe),Ye.push(a),c}function Ci(a,c,m,v,M,P,A,te){a.allPendingTasks++,m===null?a.pendingRootTasks++:m.pendingTasks++;var De={node:c,ping:function(){var Ye=a.pingedTasks;Ye.push(De),Ye.length===1&&_i(a)},blockedBoundary:m,blockedSegment:v,abortSet:M,legacyContext:P,context:A,treeContext:te};return M.add(De),De}function po(a,c,m,v,M,P){return{status:0,id:-1,index:c,parentFlushed:!1,chunks:[],children:[],formatContext:v,boundary:m,lastPushedText:M,textEmbedded:P}}function Zn(a,c){if(a=a.onError(c),a!=null&&typeof a!="string")throw Error('onError returned something with a type other than "string". onError should return a string and may return null or undefined but must not return anything else. It received something of type "'+typeof a+'" instead');return a}function Dn(a,c){var m=a.onShellError;m(c),m=a.onFatalError,m(c),a.destination!==null?(a.status=2,Y(a.destination,c)):(a.status=1,a.fatalError=c)}function Mo(a,c,m,v,M){for(Rt={},Ce=c,Ot=0,a=m(v,M);xt;)xt=!1,Ot=0,so+=1,ye=null,a=m(v,M);return No(),a}function Ei(a,c,m,v){var M=m.render(),P=v.childContextTypes;if(P!=null){var A=c.legacyContext;if(typeof m.getChildContext!="function")v=A;else{m=m.getChildContext();for(var te in m)if(!(te in P))throw Error(h(108,re(v)||"Unknown",te));v=mr({},A,m)}c.legacyContext=v,gr(a,c,M),c.legacyContext=A}else gr(a,c,M)}function il(a,c){if(a&&a.defaultProps){c=mr({},c),a=a.defaultProps;for(var m in a)c[m]===void 0&&(c[m]=a[m]);return c}return c}function Ni(a,c,m,v,M){if(typeof m=="function")if(m.prototype&&m.prototype.isReactComponent){M=Fe(m,c.legacyContext);var P=m.contextType;P=new m(v,typeof P=="object"&&P!==null?P._currentValue:M),de(P,m,v,M),Ei(a,c,P,m)}else{P=Fe(m,c.legacyContext),M=Mo(a,c,m,v,P);var A=Ot!==0;if(typeof M=="object"&&M!==null&&typeof M.render=="function"&&M.$$typeof===void 0)de(M,m,v,P),Ei(a,c,M,m);else if(A){v=c.treeContext,c.treeContext=ge(v,1,0);try{gr(a,c,M)}finally{c.treeContext=v}}else gr(a,c,M)}else if(typeof m=="string"){switch(M=c.blockedSegment,P=Fr(M.chunks,m,v,a.responseState,M.formatContext),M.lastPushedText=!1,A=M.formatContext,M.formatContext=z(A,m,v),Pi(a,c,P),M.formatContext=A,m){case"area":case"base":case"br":case"col":case"embed":case"hr":case"img":case"input":case"keygen":case"link":case"meta":case"param":case"source":case"track":case"wbr":break;default:M.chunks.push(fn,F(m),$t)}M.lastPushedText=!1}else{switch(m){case _:case y:case Qn:case Yn:case Ct:gr(a,c,v.children);return;case ln:gr(a,c,v.children);return;case g:throw Error(h(343));case on:e:{m=c.blockedBoundary,M=c.blockedSegment,P=v.fallback,v=v.children,A=new Set;var te={id:null,rootSegmentID:-1,parentFlushed:!1,pendingTasks:0,forceClientRender:!1,completedSegments:[],byteSize:0,fallbackAbortableTasks:A,errorDigest:null},De=po(a,M.chunks.length,te,M.formatContext,!1,!1);M.children.push(De),M.lastPushedText=!1;var Ye=po(a,0,null,M.formatContext,!1,!1);Ye.parentFlushed=!0,c.blockedBoundary=te,c.blockedSegment=Ye;try{if(Pi(a,c,v),Ye.lastPushedText&&Ye.textEmbedded&&Ye.chunks.push(U),Ye.status=1,Zo(te,Ye),te.pendingTasks===0)break e}catch(Ae){Ye.status=4,te.forceClientRender=!0,te.errorDigest=Zn(a,Ae)}finally{c.blockedBoundary=m,c.blockedSegment=M}c=Ci(a,P,m,De,A,c.legacyContext,c.context,c.treeContext),a.pingedTasks.push(c)}return}if(typeof m=="object"&&m!==null)switch(m.$$typeof){case bn:if(v=Mo(a,c,m.render,v,M),Ot!==0){m=c.treeContext,c.treeContext=ge(m,1,0);try{gr(a,c,v)}finally{c.treeContext=m}}else gr(a,c,v);return;case l:m=m.type,v=il(m,v),Ni(a,c,m,v,M);return;case Kn:if(M=v.children,m=m._context,v=v.value,P=m._currentValue,m._currentValue=v,A=$e,$e=v={parent:A,depth:A===null?0:A.depth+1,context:m,parentValue:P,value:v},c.context=v,gr(a,c,M),a=$e,a===null)throw Error(h(403));v=a.parentValue,a.context._currentValue=v===E?a.context._defaultValue:v,a=$e=a.parent,c.context=a;return;case Ar:v=v.children,v=v(m._currentValue),gr(a,c,v);return;case d:M=m._init,m=M(m._payload),v=il(m,v),Ni(a,c,m,v,void 0);return}throw Error(h(130,m==null?m:typeof m,""))}}function gr(a,c,m){if(c.node=m,typeof m=="object"&&m!==null){switch(m.$$typeof){case Xt:Ni(a,c,m.type,m.props,m.ref);return;case $r:throw Error(h(257));case d:var v=m._init;m=v(m._payload),gr(a,c,m);return}if(lt(m)){Xo(a,c,m);return}if(m===null||typeof m!="object"?v=null:(v=D&&m[D]||m["@@iterator"],v=typeof v=="function"?v:null),v&&(v=v.call(m))){if(m=v.next(),!m.done){var M=[];do M.push(m.value),m=v.next();while(!m.done);Xo(a,c,M)}return}throw a=Object.prototype.toString.call(m),Error(h(31,a==="[object Object]"?"object with keys {"+Object.keys(m).join(", ")+"}":a))}typeof m=="string"?(v=c.blockedSegment,v.lastPushedText=Oe(c.blockedSegment.chunks,m,a.responseState,v.lastPushedText)):typeof m=="number"&&(v=c.blockedSegment,v.lastPushedText=Oe(c.blockedSegment.chunks,""+m,a.responseState,v.lastPushedText))}function Xo(a,c,m){for(var v=m.length,M=0;M<v;M++){var P=c.treeContext;c.treeContext=ge(P,v,M);try{Pi(a,c,m[M])}finally{c.treeContext=P}}}function Pi(a,c,m){var v=c.blockedSegment.formatContext,M=c.legacyContext,P=c.context;try{return gr(a,c,m)}catch(De){if(No(),typeof De=="object"&&De!==null&&typeof De.then=="function"){m=De;var A=c.blockedSegment,te=po(a,A.chunks.length,null,A.formatContext,A.lastPushedText,!0);A.children.push(te),A.lastPushedText=!1,a=Ci(a,c.node,c.blockedBoundary,te,c.abortSet,c.legacyContext,c.context,c.treeContext).ping,m.then(a,a),c.blockedSegment.formatContext=v,c.legacyContext=M,c.context=P,$(P)}else throw c.blockedSegment.formatContext=v,c.legacyContext=M,c.context=P,$(P),De}}function ya(a){var c=a.blockedBoundary;a=a.blockedSegment,a.status=3,al(this,c,a)}function ll(a,c,m){var v=a.blockedBoundary;a.blockedSegment.status=3,v===null?(c.allPendingTasks--,c.status!==2&&(c.status=2,c.destination!==null&&c.destination.close())):(v.pendingTasks--,v.forceClientRender||(v.forceClientRender=!0,a=m===void 0?Error(h(432)):m,v.errorDigest=c.onError(a),v.parentFlushed&&c.clientRenderedBoundaries.push(v)),v.fallbackAbortableTasks.forEach(function(M){return ll(M,c,m)}),v.fallbackAbortableTasks.clear(),c.allPendingTasks--,c.allPendingTasks===0&&(v=c.onAllReady,v()))}function Zo(a,c){if(c.chunks.length===0&&c.children.length===1&&c.children[0].boundary===null){var m=c.children[0];m.id=c.id,m.parentFlushed=!0,m.status===1&&Zo(a,m)}else a.completedSegments.push(c)}function al(a,c,m){if(c===null){if(m.parentFlushed){if(a.completedRootSegment!==null)throw Error(h(389));a.completedRootSegment=m}a.pendingRootTasks--,a.pendingRootTasks===0&&(a.onShellError=Xn,c=a.onShellReady,c())}else c.pendingTasks--,c.forceClientRender||(c.pendingTasks===0?(m.parentFlushed&&m.status===1&&Zo(c,m),c.parentFlushed&&a.completedBoundaries.push(c),c.fallbackAbortableTasks.forEach(ya,a),c.fallbackAbortableTasks.clear()):m.parentFlushed&&m.status===1&&(Zo(c,m),c.completedSegments.length===1&&c.parentFlushed&&a.partialBoundaries.push(c)));a.allPendingTasks--,a.allPendingTasks===0&&(a=a.onAllReady,a())}function _i(a){if(a.status!==2){var c=$e,m=er.current;er.current=Po;var v=_o;_o=a.responseState;try{var M=a.pingedTasks,P;for(P=0;P<M.length;P++){var A=M[P],te=a,De=A.blockedSegment;if(De.status===0){$(A.context);try{gr(te,A,A.node),De.lastPushedText&&De.textEmbedded&&De.chunks.push(U),A.abortSet.delete(A),De.status=1,al(te,A.blockedBoundary,De)}catch(Sr){if(No(),typeof Sr=="object"&&Sr!==null&&typeof Sr.then=="function"){var Ye=A.ping;Sr.then(Ye,Ye)}else{A.abortSet.delete(A),De.status=4;var Ae=A.blockedBoundary,pt=Sr,ur=Zn(te,pt);if(Ae===null?Dn(te,pt):(Ae.pendingTasks--,Ae.forceClientRender||(Ae.forceClientRender=!0,Ae.errorDigest=ur,Ae.parentFlushed&&te.clientRenderedBoundaries.push(Ae))),te.allPendingTasks--,te.allPendingTasks===0){var zr=te.onAllReady;zr()}}}finally{}}}M.splice(0,P),a.destination!==null&&Ti(a,a.destination)}catch(Sr){Zn(a,Sr),Dn(a,Sr)}finally{_o=v,er.current=m,m===Po&&$(c)}}}function Jo(a,c,m){switch(m.parentFlushed=!0,m.status){case 0:var v=m.id=a.nextSegmentId++;return m.lastPushedText=!1,m.textEmbedded=!1,a=a.responseState,k(c,wr),k(c,a.placeholderPrefix),a=F(v.toString(16)),k(c,a),L(c,hn);case 1:m.status=2;var M=!0;v=m.chunks;var P=0;m=m.children;for(var A=0;A<m.length;A++){for(M=m[A];P<M.index;P++)k(c,v[P]);M=ei(a,c,M)}for(;P<v.length-1;P++)k(c,v[P]);return P<v.length&&(M=L(c,v[P])),M;default:throw Error(h(390))}}function ei(a,c,m){var v=m.boundary;if(v===null)return Jo(a,c,m);if(v.parentFlushed=!0,v.forceClientRender)v=v.errorDigest,L(c,Ir),k(c,ao),v&&(k(c,Rn),k(c,F(ve(v))),k(c,kr)),L(c,mn),Jo(a,c,m);else if(0<v.pendingTasks){v.rootSegmentID=a.nextSegmentId++,0<v.completedSegments.length&&a.partialBoundaries.push(v);var M=a.responseState,P=M.nextSuspenseID++;M=B(M.boundaryPrefix+P.toString(16)),v=v.id=M,Pt(c,a.responseState,v),Jo(a,c,m)}else if(v.byteSize>a.progressiveChunkSize)v.rootSegmentID=a.nextSegmentId++,a.completedBoundaries.push(v),Pt(c,a.responseState,v.id),Jo(a,c,m);else{if(L(c,Rr),m=v.completedSegments,m.length!==1)throw Error(h(391));ei(a,c,m[0])}return L(c,Fn)}function sl(a,c,m){return ar(c,a.responseState,m.formatContext,m.id),ei(a,c,m),qt(c,m.formatContext)}function ul(a,c,m){for(var v=m.completedSegments,M=0;M<v.length;M++)ti(a,c,m,v[M]);if(v.length=0,a=a.responseState,v=m.id,m=m.rootSegmentID,k(c,a.startInlineScript),a.sentCompleteBoundaryFunction?k(c,tn):(a.sentCompleteBoundaryFunction=!0,k(c,Wt)),v===null)throw Error(h(395));return m=F(m.toString(16)),k(c,v),k(c,On),k(c,a.segmentPrefix),k(c,m),L(c,Vn)}function ti(a,c,m,v){if(v.status===2)return!0;var M=v.id;if(M===-1){if((v.id=m.rootSegmentID)===-1)throw Error(h(392));return sl(a,c,v)}return sl(a,c,v),a=a.responseState,k(c,a.startInlineScript),a.sentCompleteSegmentFunction?k(c,vn):(a.sentCompleteSegmentFunction=!0,k(c,wt)),k(c,a.segmentPrefix),M=F(M.toString(16)),k(c,M),k(c,yn),k(c,a.placeholderPrefix),k(c,M),L(c,en)}function Ti(a,c){p=new Uint8Array(512),j=0;try{var m=a.completedRootSegment;if(m!==null&&a.pendingRootTasks===0){ei(a,c,m),a.completedRootSegment=null;var v=a.responseState.bootstrapChunks;for(m=0;m<v.length-1;m++)k(c,v[m]);m<v.length&&L(c,v[m])}var M=a.clientRenderedBoundaries,P;for(P=0;P<M.length;P++){var A=M[P];v=c;var te=a.responseState,De=A.id,Ye=A.errorDigest,Ae=A.errorMessage,pt=A.errorComponentStack;if(k(v,te.startInlineScript),te.sentClientRenderFunction?k(v,_t):(te.sentClientRenderFunction=!0,k(v,ot)),De===null)throw Error(h(395));k(v,De),k(v,wn),(Ye||Ae||pt)&&(k(v,rn),k(v,F(Br(Ye||"")))),(Ae||pt)&&(k(v,rn),k(v,F(Br(Ae||"")))),pt&&(k(v,rn),k(v,F(Br(pt)))),L(v,kn)}M.splice(0,P);var ur=a.completedBoundaries;for(P=0;P<ur.length;P++)ul(a,c,ur[P]);ur.splice(0,P),ae(c),p=new Uint8Array(512),j=0;var zr=a.partialBoundaries;for(P=0;P<zr.length;P++){var Sr=zr[P];e:{M=a,A=c;var Lo=Sr.completedSegments;for(te=0;te<Lo.length;te++)if(!ti(M,A,Sr,Lo[te])){te++,Lo.splice(0,te);var Mi=!1;break e}Lo.splice(0,te),Mi=!0}if(!Mi){a.destination=null,P++,zr.splice(0,P);return}}zr.splice(0,P);var Bn=a.completedBoundaries;for(P=0;P<Bn.length;P++)ul(a,c,Bn[P]);Bn.splice(0,P)}finally{ae(c),a.allPendingTasks===0&&a.pingedTasks.length===0&&a.clientRenderedBoundaries.length===0&&a.completedBoundaries.length===0&&c.close()}}function cl(a,c){try{var m=a.abortableTasks;m.forEach(function(v){return ll(v,a,c)}),m.clear(),a.destination!==null&&Ti(a,a.destination)}catch(v){Zn(a,v),Dn(a,v)}}return la.renderToReadableStream=function(a,c){return new Promise(function(m,v){var M,P,A=new Promise(function(Ae,pt){P=Ae,M=pt}),te=To(a,Z(c?c.identifierPrefix:void 0,c?c.nonce:void 0,c?c.bootstrapScriptContent:void 0,c?c.bootstrapScripts:void 0,c?c.bootstrapModules:void 0),ce(c?c.namespaceURI:void 0),c?c.progressiveChunkSize:void 0,c?c.onError:void 0,P,function(){var Ae=new ReadableStream({type:"bytes",pull:function(pt){if(te.status===1)te.status=2,Y(pt,te.fatalError);else if(te.status!==2&&te.destination===null){te.destination=pt;try{Ti(te,pt)}catch(ur){Zn(te,ur),Dn(te,ur)}}},cancel:function(){cl(te)}},{highWaterMark:0});Ae.allReady=A,m(Ae)},function(Ae){A.catch(function(){}),v(Ae)},M);if(c&&c.signal){var De=c.signal,Ye=function(){cl(te,De.reason),De.removeEventListener("abort",Ye)};De.addEventListener("abort",Ye)}_i(te)})},la.version="18.3.1",la}var Cd;function zh(){if(Cd)return Eo;Cd=1;var u,h;return u=kh(),h=bh(),Eo.version=u.version,Eo.renderToString=u.renderToString,Eo.renderToStaticMarkup=u.renderToStaticMarkup,Eo.renderToNodeStream=u.renderToNodeStream,Eo.renderToStaticNodeStream=u.renderToStaticNodeStream,Eo.renderToReadableStream=h.renderToReadableStream,Eo}var Sh=zh();const jh=[ee.Pizza,ee.Burger,ee.Hotdog,ee.Chicken,ee.IceCream,ee.Cookie,ee.Drink,ee.Bread,ee.Cheese,ee.Cake],Ch=[ee.Burger,ee.Pizza,ee.Chicken,ee.Hotdog,ee.Bread,ee.Cookie,ee.Cheese,ee.IceCream],Eh=[ee.Sparkles,ee.Star],Hd=["#E6392F","#F59E0B","#D97706","#C2410C","#B45309"],ct=(u,h)=>u+Math.random()*(h-u),fa=u=>u[Math.floor(Math.random()*u.length)];function Wd(u,h,p){let j=Sh.renderToStaticMarkup(Wn.createElement(u,{size:p}));return j=j.replace(/currentColor/g,h),/xmlns=/.test(j)||(j=j.replace("<svg",'<svg xmlns="http://www.w3.org/2000/svg"')),j}function Nh(u,h){const p=Math.ceil(h*1.6),j=new Image(p,p),k=Wd(u,fa(Hd),h);return j.src=`data:image/svg+xml;charset=utf-8,${encodeURIComponent(k)}`,j}function Ph(){const u=I.useRef(null);return I.useEffect(()=>{var lt;const h=u.current;if(!h)return;const p=h.getContext("2d"),j=(lt=window.matchMedia)==null?void 0:lt.call(window,"(prefers-reduced-motion: reduce)").matches;let k=0,L=0,ae=1,G=[],F=[],B=[],Y=0,H=!1;const ie={x:-9999,y:-9999,active:!1},ne=document.createElement("div");ne.setAttribute("aria-hidden","true"),Object.assign(ne.style,{position:"fixed",inset:"0",zIndex:"1001",overflow:"hidden",pointerEvents:"none"}),document.body.appendChild(ne);const he=()=>window.innerWidth<700,ze=()=>{ae=Math.min(window.devicePixelRatio||1,he()?1.5:2),k=window.innerWidth,L=window.innerHeight,h.width=Math.round(k*ae),h.height=Math.round(L*ae),h.style.width=`${k}px`,h.style.height=`${L}px`,p.setTransform(ae,0,0,ae,0,0);const Je=he(),q=Math.min(Je?34:72,Math.round(k*L/(Je?15e3:17e3))),me=Je?9:16;G=Array.from({length:q},()=>({x:ct(0,k),y:ct(0,L),vx:ct(-.22,.22),vy:ct(-.22,.22),r:ct(1.1,2.8),life:1,temp:!1})),B=jh.map(O=>Nh(O,28)),F=Array.from({length:me},(O,le)=>({s:B[le%B.length],x:ct(0,k),y:ct(0,L),vx:ct(-.35,.35)||.2,vy:ct(-.3,-.08),rot:ct(0,Math.PI*2),vr:ct(-.008,.008),scale:ct(.55,1.05),alpha:ct(.3,.55),phase:ct(0,6.28)}))},W=(Je,q)=>{if(!j){const Le=Math.hypot(k,L)||1;F.forEach(Be=>{const Z=Be.x-Je,pe=Be.y-q,ce=Math.hypot(Z,pe),z=ce>1?Math.atan2(pe,Z):ct(0,Math.PI*2),U=3+(1-Math.min(ce/Le,1))*3;Be.vx+=Math.cos(z)*U+ct(-1,1),Be.vy+=Math.sin(z)*U+ct(-1,1),Be.vr+=ct(-.08,.08)})}const me=2+Math.floor(Math.random()*3),O=me>2&&Math.random()<.35?2:1,le=Array.from({length:me-O},()=>({Icon:fa(Ch),color:fa(Hd),size:ct(22,34)}));for(let Le=0;Le<O;Le++)le.push({Icon:fa(Eh),color:"#F5A524",size:ct(15,23)});le.forEach(({Icon:Le,color:Be,size:Z},pe)=>{const ce=pe/le.length*Math.PI*2+ct(-.35,.35),z=ct(55,115),U=Math.cos(ce)*z,Oe=Math.sin(ce)*z-ct(18,48),Me=document.createElement("span");if(Me.innerHTML=Wd(Le,Be,Z),Object.assign(Me.style,{position:"absolute",left:`${Je}px`,top:`${q}px`,fontSize:`${Z}px`,lineHeight:"1",pointerEvents:"none",userSelect:"none",filter:"drop-shadow(0 2px 5px rgba(30,20,10,0.3))",transform:"translate(-50%, -50%) scale(0.3)"}),ne.appendChild(Me),j){Me.style.transform=`translate(calc(-50% + ${U*.35}px), calc(-50% + ${Oe*.35}px)) scale(1)`,window.setTimeout(()=>Me.remove(),550);return}const He=Me.animate([{opacity:0,transform:"translate(-50%, -50%) scale(0.3) rotate(0deg)"},{opacity:1,transform:"translate(-50%, -50%) scale(1.25) rotate(10deg)",offset:.18},{opacity:1,transform:"translate(-50%, -50%) scale(1) rotate(-5deg)",offset:.34},{opacity:0,transform:`translate(calc(-50% + ${U}px), calc(-50% + ${Oe}px)) scale(0.7) rotate(${ct(-55,55)}deg)`}],{duration:ct(750,1050),easing:"cubic-bezier(0.2, 0.75, 0.3, 1)",fill:"forwards"});He.onfinish=()=>Me.remove()})},ue=Je=>{p.clearRect(0,0,k,L);const me=he()?150:200;if(ie.active){const O=p.createRadialGradient(ie.x,ie.y,0,ie.x,ie.y,220);O.addColorStop(0,"rgba(255,240,200,0.35)"),O.addColorStop(1,"rgba(255,240,200,0)"),p.fillStyle=O,p.fillRect(ie.x-220,ie.y-220,440,440)}for(let O=G.length-1;O>=0;O--){const le=G[O];if(le.temp&&(le.life-=.004,le.life<=0)){G.splice(O,1);continue}if(ie.active){const Be=ie.x-le.x,Z=ie.y-le.y,pe=Math.hypot(Be,Z);pe<me&&pe>1&&(le.vx+=Be/pe*.012,le.vy+=Z/pe*.012)}le.vx*=.985,le.vy*=.985,Math.hypot(le.vx,le.vy)<.08&&(le.vx+=ct(-.01,.01),le.vy+=ct(-.01,.01)),le.x+=le.vx,le.y+=le.vy,le.x<-20?le.x=k+20:le.x>k+20&&(le.x=-20),le.y<-20?le.y=L+20:le.y>L+20&&(le.y=-20)}for(const O of G){const le=.35+.5*(O.r/2.8);p.fillStyle=`rgba(255,255,255,${Math.min(1,le+.25)*O.life})`,p.shadowColor="rgba(255,255,255,0.8)",p.shadowBlur=8,p.beginPath(),p.arc(O.x,O.y,O.r,0,Math.PI*2),p.fill()}p.shadowBlur=0;for(const O of F){O.vx*=.99,O.vy*=.99,Math.hypot(O.vx,O.vy)<.12&&(O.vx+=ct(-.01,.01),O.vy-=.004),O.vr*=.99,Math.abs(O.vr)<.004&&(O.vr+=O.vr>=0?4e-4:-4e-4),O.x+=O.vx,O.y+=O.vy+Math.sin(Je/1500+O.phase)*.12,O.rot+=O.vr;const le=40;O.x<-le?O.x=k+le:O.x>k+le&&(O.x=-le),O.y<-le?O.y=L+le:O.y>L+le&&(O.y=-le),p.save(),p.translate(O.x,O.y),p.rotate(O.rot),p.globalAlpha=O.alpha;const Le=O.s.width*O.scale;p.drawImage(O.s,-Le/2,-Le/2,Le,Le),p.restore()}p.globalAlpha=1,H&&(Y=requestAnimationFrame(ue))},Pe=()=>{H||j||(H=!0,Y=requestAnimationFrame(ue))},Ke=()=>{H=!1,cancelAnimationFrame(Y)};ze(),j?ue(0):Pe();let Te=0;const Ee=()=>{clearTimeout(Te),Te=setTimeout(()=>{ze(),j&&ue(0)},150)},ke=Je=>{ie.x=Je.clientX,ie.y=Je.clientY,ie.active=!0},ve=()=>{ie.active=!1},Ge=Je=>{ie.x=Je.clientX,ie.y=Je.clientY,ie.active=!0,W(Je.clientX,Je.clientY),Je.pointerType==="touch"&&setTimeout(ve,900)},Se=()=>document.hidden?Ke():Pe();return window.addEventListener("resize",Ee),window.addEventListener("pointermove",ke,{passive:!0}),window.addEventListener("pointerdown",Ge,{passive:!0}),window.addEventListener("pointerleave",ve),document.addEventListener("mouseleave",ve),document.addEventListener("visibilitychange",Se),()=>{Ke(),clearTimeout(Te),ne.remove(),window.removeEventListener("resize",Ee),window.removeEventListener("pointermove",ke),window.removeEventListener("pointerdown",Ge),window.removeEventListener("pointerleave",ve),document.removeEventListener("mouseleave",ve),document.removeEventListener("visibilitychange",Se)}},[]),o.jsx("canvas",{ref:u,"aria-hidden":"true",style:{position:"fixed",inset:0,zIndex:0,pointerEvents:"none"}})}lf.createRoot(document.getElementById("root")).render(o.jsxs(Wn.StrictMode,{children:[o.jsx(Ph,{}),o.jsx(wh,{children:o.jsx(yh,{})})]}));
