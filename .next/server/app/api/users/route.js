(()=>{var e={};e.id=318,e.ids=[318],e.modules={3295:e=>{"use strict";e.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},10846:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},13247:(e,t,r)=>{"use strict";r.r(t),r.d(t,{patchFetch:()=>w,routeModule:()=>E,serverHooks:()=>g,workAsyncStorage:()=>T,workUnitAsyncStorage:()=>y});var a={};r.r(a),r.d(a,{DELETE:()=>p,GET:()=>u,PATCH:()=>l});var o=r(96559),n=r(48088),i=r(37719),s=r(32190),d=r(34747),c=r(51364);async function u(e,{params:t}){try{let e=await (0,c.Mt)();if(!e?.user)return s.NextResponse.json({error:"Unauthorized"},{status:401});let r=await d.default.get("SELECT * FROM event_categories WHERE id = ?",[t.id]);if(!r)return s.NextResponse.json({error:"Category not found"},{status:404});let a=await d.default.get("SELECT COUNT(*) as count FROM publications WHERE categoryId = ?",[t.id]);return s.NextResponse.json({...r,publicationsCount:a?a.count:0})}catch(e){return console.error("Failed to fetch category:",e),s.NextResponse.json({error:"Failed to fetch category"},{status:500})}}async function l(e,{params:t}){try{let r=await (0,c.Mt)();if(!r?.user)return s.NextResponse.json({error:"Unauthorized"},{status:401});let{name:a,description:o}=await e.json();if(!a)return s.NextResponse.json({error:"Name is required"},{status:400});let n=a.toLowerCase().replace(/[^a-z0-9]+/g,"-"),i=new Date().toISOString();await d.default.run("UPDATE event_categories SET name = ?, slug = ?, description = ?, updatedAt = ? WHERE id = ?",[a,n,o,i,t.id]);let u=await d.default.get("SELECT * FROM event_categories WHERE id = ?",[t.id]),l=await d.default.get("SELECT COUNT(*) as count FROM publications WHERE categoryId = ?",[t.id]);return s.NextResponse.json({...u,publicationsCount:l?l.count:0})}catch(e){return console.error("Failed to update category:",e),s.NextResponse.json({error:"Failed to update category"},{status:500})}}async function p(e,{params:t}){try{let e=await (0,c.Mt)();if(!e?.user)return s.NextResponse.json({error:"Unauthorized"},{status:401});return await d.default.run("DELETE FROM event_categories WHERE id = ?",[t.id]),new s.NextResponse(null,{status:204})}catch(e){return console.error("Failed to delete category:",e),s.NextResponse.json({error:"Failed to delete category"},{status:500})}}let E=new o.AppRouteRouteModule({definition:{kind:n.RouteKind.APP_ROUTE,page:"/api/users/route",pathname:"/api/users",filename:"route",bundlePath:"app/api/users/route"},resolvedPagePath:"/Users/pro/Dev/gmp/src/app/api/users/route.ts",nextConfigOutput:"",userland:a}),{workAsyncStorage:T,workUnitAsyncStorage:y,serverHooks:g}=E;function w(){return(0,i.patchFetch)({workAsyncStorage:T,workUnitAsyncStorage:y})}},29294:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-async-storage.external.js")},34747:(e,t,r)=>{"use strict";r.d(t,{default:()=>d});var a=r(56689),o=r(55511);let n="1"===process.env.VERCEL,i=n?":memory:":"./src/db.sqlite",s=null,d={getConnection:async()=>(!s&&(s=await new Promise((e,t)=>{try{let r=new a.Database(i,a=>{if(a){console.error("Error opening database:",a),t(a);return}r.run("PRAGMA foreign_keys = ON",a=>{if(a){console.error("Error setting PRAGMA:",a),t(a);return}e(r)})})}catch(e){t(e)}}),n&&console.log("Running in Vercel environment, using in-memory database")),s),async run(e,t=[]){return new Promise(async(r,a)=>{(await this.getConnection()).run(e,t,function(o){if(o){console.error("SQL Error in run:",e,"Params:",JSON.stringify(t),"Error:",o),a(o);return}r({lastInsertRowid:this.lastID,changes:this.changes})})})},async get(e,t=[]){return new Promise(async(r,a)=>{(await this.getConnection()).get(e,t,(o,n)=>{if(o){console.error("SQL Error in get:",e,"Params:",JSON.stringify(t),"Error:",o),a(o);return}r(n)})})},async all(e,t=[]){return new Promise(async(r,a)=>{(await this.getConnection()).all(e,t,(o,n)=>{if(o){console.error("SQL Error in all:",e,"Params:",JSON.stringify(t),"Error:",o),a(o);return}r(n)})})},async each(e,t=[],r){return new Promise(async(a,o)=>{let n=await this.getConnection(),i=0;n.each(e,t,(e,t)=>{if(e)return void o(e);r(t),i++},(e,t)=>{if(e)return void o(e);a(i)})})},async transaction(e){let t=await this.getConnection();return new Promise(async(r,a)=>{t.run("BEGIN TRANSACTION",async o=>{if(o)return void a(o);try{let o=await Promise.resolve(e());t.run("COMMIT",e=>{if(e)return void t.run("ROLLBACK",()=>{a(e)});r(o)})}catch(e){t.run("ROLLBACK",t=>{t&&console.error("Failed to roll back transaction:",t),a(e)})}})})},close:async()=>new Promise((e,t)=>{if(!s)return void e();s.close(r=>{if(r)return void t(r);s=null,e()})}),async paginate(e,t){let r=Math.max(1,Math.min(100,t));return{offset:(Math.max(1,e)-1)*r,limit:r}},generateId:()=>(0,o.randomUUID)(),async setupDatabase(){for(let e of(await this.getConnection(),[`CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT,
        email TEXT UNIQUE NOT NULL,
        emailVerified DATETIME,
        image TEXT,
        role TEXT,
        password TEXT,
        createdAt DATETIME NOT NULL,
        updatedAt DATETIME NOT NULL
      )`,`CREATE TABLE IF NOT EXISTS event_categories (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        description TEXT,
        createdAt DATETIME NOT NULL,
        updatedAt DATETIME NOT NULL
      )`,`CREATE TABLE IF NOT EXISTS events (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        description TEXT NOT NULL,
        content TEXT,
        location TEXT NOT NULL,
        venue TEXT,
        startDate DATETIME NOT NULL,
        endDate DATETIME NOT NULL,
        posterImage TEXT,
        posterCredit TEXT,
        status TEXT NOT NULL,
        published INTEGER NOT NULL DEFAULT 0,
        categoryId TEXT,
        createdAt DATETIME NOT NULL,
        updatedAt DATETIME NOT NULL,
        FOREIGN KEY (categoryId) REFERENCES event_categories(id)
      )`]))await this.run(e);for(let e of["CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)","CREATE INDEX IF NOT EXISTS idx_events_slug ON events(slug)","CREATE INDEX IF NOT EXISTS idx_events_category ON events(categoryId)"])await this.run(e);if(!await this.get("SELECT id FROM users WHERE email = ? AND role = ?",["admin@example.com","ADMIN"])){console.log("Creating admin user...");let e=new Date().toISOString(),t=this.generateId();await this.run("INSERT INTO users (id, name, email, role, password, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)",[t,"Admin User","admin@example.com","ADMIN","$2a$10$8r0aGeQoqQioRh8LQgB5Y.BwqR6EUQ2oe5YHBnwKDJ0K0UZnuoiC.",e,e]),console.log("Admin user created with default password (admin123)")}}}},44870:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},51364:(e,t,r)=>{"use strict";r.d(t,{Mt:()=>R});var a=r(44999),o=r(21187),n=r(16263),i=r(92120),s=r(4208);let d=async(e,t,r,a)=>{let o=await (0,s.A)(e,t,"verify");(0,i.A)(e,o);let d=(0,n.A)(e,o.algorithm);try{return await crypto.subtle.verify(d,o,r,a)}catch{return!1}};var c=r(70803),u=r(97989),l=r(74996),p=r(89531),E=r(44032),T=r(41286);let y=(e,t)=>{if(void 0!==t&&(!Array.isArray(t)||t.some(e=>"string"!=typeof e)))throw TypeError(`"${e}" option must be an array of strings`);if(t)return new Set(t)};var g=r(95548);async function w(e,t,r){let a,n;if(!(0,p.A)(e))throw new c.Ye("Flattened JWS must be an object");if(void 0===e.protected&&void 0===e.header)throw new c.Ye('Flattened JWS must have either of the "protected" or "header" members');if(void 0!==e.protected&&"string"!=typeof e.protected)throw new c.Ye("JWS Protected Header incorrect type");if(void 0===e.payload)throw new c.Ye("JWS Payload missing");if("string"!=typeof e.signature)throw new c.Ye("JWS Signature missing or incorrect type");if(void 0!==e.header&&!(0,p.A)(e.header))throw new c.Ye("JWS Unprotected Header incorrect type");let i={};if(e.protected)try{let t=(0,o.D)(e.protected);i=JSON.parse(u.D0.decode(t))}catch{throw new c.Ye("JWS Protected Header is invalid")}if(!(0,l.A)(i,e.header))throw new c.Ye("JWS Protected and JWS Unprotected Header Parameter names must be disjoint");let s={...i,...e.header},w=(0,T.A)(c.Ye,new Map([["b64",!0]]),r?.crit,i,s),f=!0;if(w.has("b64")&&"boolean"!=typeof(f=i.b64))throw new c.Ye('The "b64" (base64url-encode payload) Header Parameter must be a boolean');let{alg:h}=s;if("string"!=typeof h||!h)throw new c.Ye('JWS "alg" (Algorithm) Header Parameter missing or invalid');let m=r&&y("algorithms",r.algorithms);if(m&&!m.has(h))throw new c.Rb('"alg" (Algorithm) Header Parameter value not allowed');if(f){if("string"!=typeof e.payload)throw new c.Ye("JWS Payload must be a string")}else if("string"!=typeof e.payload&&!(e.payload instanceof Uint8Array))throw new c.Ye("JWS Payload must be a string or an Uint8Array instance");let N=!1;"function"==typeof t&&(t=await t(i,e),N=!0),(0,E.A)(h,t,"verify");let A=(0,u.xW)(u.Rd.encode(e.protected??""),u.Rd.encode("."),"string"==typeof e.payload?u.Rd.encode(e.payload):e.payload);try{a=(0,o.D)(e.signature)}catch{throw new c.Ye("Failed to base64url decode the signature")}let R=await (0,g.A)(t,h);if(!await d(h,R,a,A))throw new c.h2;if(f)try{n=(0,o.D)(e.payload)}catch{throw new c.Ye("Failed to base64url decode the payload")}else n="string"==typeof e.payload?u.Rd.encode(e.payload):e.payload;let v={payload:n};return(void 0!==e.protected&&(v.protectedHeader=i),void 0!==e.header&&(v.unprotectedHeader=e.header),N)?{...v,key:R}:v}async function f(e,t,r){if(e instanceof Uint8Array&&(e=u.D0.decode(e)),"string"!=typeof e)throw new c.Ye("Compact JWS must be a string or Uint8Array");let{0:a,1:o,2:n,length:i}=e.split(".");if(3!==i)throw new c.Ye("Invalid Compact JWS");let s=await w({payload:o,protected:a,signature:n},t,r),d={payload:s.payload,protectedHeader:s.protectedHeader};return"function"==typeof t?{...d,key:s.key}:d}var h=r(91492);async function m(e,t,r){let a=await f(e,t,r);if(a.protectedHeader.crit?.includes("b64")&&!1===a.protectedHeader.b64)throw new c.Dp("JWTs MUST NOT use unencoded payload");let o={payload:(0,h.k)(a.protectedHeader,a.payload,r),protectedHeader:a.protectedHeader};return"function"==typeof t?{...o,key:a.key}:o}let N=new TextEncoder().encode(process.env.JWT_SECRET||"test_jwt_secret_for_development_only");async function A(){try{let e=await (0,a.UL)(),t=e.get("token")?.value;if(!t)return null;return(await m(t,N)).payload}catch(e){return console.error("Auth error:",e),null}}async function R(){try{let e=await A();if(!e)return null;return{user:{id:e.id,email:e.email,role:e.role}}}catch(e){return console.error("Failed to get server session:",e),null}}},55511:e=>{"use strict";e.exports=require("crypto")},56689:e=>{"use strict";e.exports=require("sqlite3")},63033:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},78335:()=>{},96487:()=>{}};var t=require("../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),a=t.X(0,[4447,580,4999,4314],()=>r(13247));module.exports=a})();