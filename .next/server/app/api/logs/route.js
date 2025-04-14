"use strict";(()=>{var e={};e.id=1431,e.ids=[1431],e.modules={3295:e=>{e.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},10846:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},29294:e=>{e.exports=require("next/dist/server/app-render/work-async-storage.external.js")},33735:(e,t,r)=>{r.r(t),r.d(t,{patchFetch:()=>w,routeModule:()=>u,serverHooks:()=>h,workAsyncStorage:()=>y,workUnitAsyncStorage:()=>g});var a={};r.r(a),r.d(a,{GET:()=>p});var o=r(96559),n=r(48088),s=r(37719),i=r(34747),l=r(51364),d=r(23607),c=r(36463);async function p(e){try{let t=await (0,l.Mt)();if(!t?.user)return d.aI.unauthorized();if("ADMIN"!==t.user.role)return d.aI.forbidden("Only administrators can access logs");let r=new URL(e.url).searchParams,a=parseInt(r.get("page")||"1"),o=parseInt(r.get("limit")||"50"),n=r.get("userId")||null,s=r.get("severity")||null,c=r.get("startDate")||null,p=r.get("endDate")||null,{offset:u}=await i.default.paginate(a,o),y=[],g=[];n&&(y.push("userId = ?"),g.push(n)),s&&(y.push("severity = ?"),g.push(s)),c&&(y.push("timestamp >= ?"),g.push(new Date(c).toISOString())),p&&(y.push("timestamp <= ?"),g.push(new Date(p).toISOString()));let h=y.length>0?`WHERE ${y.join(" AND ")}`:"",w=`SELECT COUNT(*) as total FROM error_logs ${h}`,f=await i.default.get(w,g),m=f?.total||0,v=`
      SELECT id, timestamp, userId, severity, message, 
        SUBSTR(context, 1, 200) as context, 
        SUBSTR(stack, 1, 500) as stack
      FROM error_logs
      ${h}
      ORDER BY timestamp DESC
      LIMIT ? OFFSET ?
    `,S=[...g,o,u],b=await i.default.all(v,S);return d.aI.success(b,{total:m,page:a,limit:o,totalPages:Math.ceil(m/o)})}catch(e){return c.Ay.error("Failed to fetch error logs",e instanceof Error?e:Error(String(e))),d.aI.error("Failed to fetch error logs")}}let u=new o.AppRouteRouteModule({definition:{kind:n.RouteKind.APP_ROUTE,page:"/api/logs/route",pathname:"/api/logs",filename:"route",bundlePath:"app/api/logs/route"},resolvedPagePath:"/Users/pro/Dev/gmp/src/app/api/logs/route.ts",nextConfigOutput:"",userland:a}),{workAsyncStorage:y,workUnitAsyncStorage:g,serverHooks:h}=u;function w(){return(0,s.patchFetch)({workAsyncStorage:y,workUnitAsyncStorage:g})}},36463:(e,t,r)=>{r.d(t,{Ay:()=>n});let a=new Map;class o{debug(e,t){this.log("debug",e,t)}info(e,t){this.log("info",e,t)}warn(e,t){this.log("warn",e,t)}error(e,t,r){let a={...r,errorName:t?.name};this.log("error",e,a,t?.stack),this.saveErrorToDatabase("medium",e,a,t?.stack)}fatal(e,t,r){let a={...r,errorName:t?.name};this.log("fatal",e,a,t?.stack),this.saveErrorToDatabase("critical",e,a,t?.stack)}log(e,t,r,o){new Date().toISOString();let n=`${e}:${t}`,s=Date.now();if(s-(a.get(n)||0)<1e3)return;a.set(n,s);let i=`[${e.toUpperCase()}] ${t}`;switch(r&&(i+=` ${JSON.stringify(r)}`),e){case"debug":console.debug(i);break;case"info":console.info(i);break;case"warn":console.warn(i);break;case"error":case"fatal":console.error(i),o&&console.error(o)}}async saveErrorToDatabase(e,t,a,o){try{let{default:n}=await Promise.resolve().then(r.bind(r,34747));await n.run(`
        INSERT INTO error_logs (
          userId, severity, message, context, stack, timestamp
        ) VALUES (?, ?, ?, ?, ?, ?)
      `,[a?.userId||null,e,t,JSON.stringify(a||{}),o||null,new Date().toISOString()])}catch(e){console.error("Failed to save error log to database:",e)}}}let n=new o},44870:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},51364:(e,t,r)=>{r.d(t,{Mt:()=>k});var a=r(44999),o=r(21187),n=r(16263),s=r(92120),i=r(4208);let l=async(e,t,r,a)=>{let o=await (0,i.A)(e,t,"verify");(0,s.A)(e,o);let l=(0,n.A)(e,o.algorithm);try{return await crypto.subtle.verify(l,o,r,a)}catch{return!1}};var d=r(70803),c=r(97989),p=r(74996),u=r(89531),y=r(44032),g=r(41286);let h=(e,t)=>{if(void 0!==t&&(!Array.isArray(t)||t.some(e=>"string"!=typeof e)))throw TypeError(`"${e}" option must be an array of strings`);if(t)return new Set(t)};var w=r(95548);async function f(e,t,r){let a,n;if(!(0,u.A)(e))throw new d.Ye("Flattened JWS must be an object");if(void 0===e.protected&&void 0===e.header)throw new d.Ye('Flattened JWS must have either of the "protected" or "header" members');if(void 0!==e.protected&&"string"!=typeof e.protected)throw new d.Ye("JWS Protected Header incorrect type");if(void 0===e.payload)throw new d.Ye("JWS Payload missing");if("string"!=typeof e.signature)throw new d.Ye("JWS Signature missing or incorrect type");if(void 0!==e.header&&!(0,u.A)(e.header))throw new d.Ye("JWS Unprotected Header incorrect type");let s={};if(e.protected)try{let t=(0,o.D)(e.protected);s=JSON.parse(c.D0.decode(t))}catch{throw new d.Ye("JWS Protected Header is invalid")}if(!(0,p.A)(s,e.header))throw new d.Ye("JWS Protected and JWS Unprotected Header Parameter names must be disjoint");let i={...s,...e.header},f=(0,g.A)(d.Ye,new Map([["b64",!0]]),r?.crit,s,i),m=!0;if(f.has("b64")&&"boolean"!=typeof(m=s.b64))throw new d.Ye('The "b64" (base64url-encode payload) Header Parameter must be a boolean');let{alg:v}=i;if("string"!=typeof v||!v)throw new d.Ye('JWS "alg" (Algorithm) Header Parameter missing or invalid');let S=r&&h("algorithms",r.algorithms);if(S&&!S.has(v))throw new d.Rb('"alg" (Algorithm) Header Parameter value not allowed');if(m){if("string"!=typeof e.payload)throw new d.Ye("JWS Payload must be a string")}else if("string"!=typeof e.payload&&!(e.payload instanceof Uint8Array))throw new d.Ye("JWS Payload must be a string or an Uint8Array instance");let b=!1;"function"==typeof t&&(t=await t(s,e),b=!0),(0,y.A)(v,t,"verify");let A=(0,c.xW)(c.Rd.encode(e.protected??""),c.Rd.encode("."),"string"==typeof e.payload?c.Rd.encode(e.payload):e.payload);try{a=(0,o.D)(e.signature)}catch{throw new d.Ye("Failed to base64url decode the signature")}let k=await (0,w.A)(t,v);if(!await l(v,k,a,A))throw new d.h2;if(m)try{n=(0,o.D)(e.payload)}catch{throw new d.Ye("Failed to base64url decode the payload")}else n="string"==typeof e.payload?c.Rd.encode(e.payload):e.payload;let x={payload:n};return(void 0!==e.protected&&(x.protectedHeader=s),void 0!==e.header&&(x.unprotectedHeader=e.header),b)?{...x,key:k}:x}async function m(e,t,r){if(e instanceof Uint8Array&&(e=c.D0.decode(e)),"string"!=typeof e)throw new d.Ye("Compact JWS must be a string or Uint8Array");let{0:a,1:o,2:n,length:s}=e.split(".");if(3!==s)throw new d.Ye("Invalid Compact JWS");let i=await f({payload:o,protected:a,signature:n},t,r),l={payload:i.payload,protectedHeader:i.protectedHeader};return"function"==typeof t?{...l,key:i.key}:l}var v=r(91492);async function S(e,t,r){let a=await m(e,t,r);if(a.protectedHeader.crit?.includes("b64")&&!1===a.protectedHeader.b64)throw new d.Dp("JWTs MUST NOT use unencoded payload");let o={payload:(0,v.k)(a.protectedHeader,a.payload,r),protectedHeader:a.protectedHeader};return"function"==typeof t?{...o,key:a.key}:o}let b=new TextEncoder().encode(process.env.JWT_SECRET||"test_jwt_secret_for_development_only");async function A(){try{let e=await (0,a.UL)(),t=e.get("token")?.value;if(!t)return null;return(await S(t,b)).payload}catch(e){return console.error("Auth error:",e),null}}async function k(){try{let e=await A();if(!e)return null;return{user:{id:e.id,email:e.email,role:e.role}}}catch(e){return console.error("Failed to get server session:",e),null}}},55511:e=>{e.exports=require("crypto")},56689:e=>{e.exports=require("sqlite3")},63033:e=>{e.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")}};var t=require("../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),a=t.X(0,[4447,580,4999,4314,635],()=>r(33735));module.exports=a})();