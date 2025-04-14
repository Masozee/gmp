"use strict";(()=>{var e={};e.id=7758,e.ids=[7758],e.modules={3295:e=>{e.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},10846:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},29294:e=>{e.exports=require("next/dist/server/app-render/work-async-storage.external.js")},36463:(e,t,r)=>{r.d(t,{Ay:()=>o});let a=new Map;class s{debug(e,t){this.log("debug",e,t)}info(e,t){this.log("info",e,t)}warn(e,t){this.log("warn",e,t)}error(e,t,r){let a={...r,errorName:t?.name};this.log("error",e,a,t?.stack),this.saveErrorToDatabase("medium",e,a,t?.stack)}fatal(e,t,r){let a={...r,errorName:t?.name};this.log("fatal",e,a,t?.stack),this.saveErrorToDatabase("critical",e,a,t?.stack)}log(e,t,r,s){new Date().toISOString();let o=`${e}:${t}`,i=Date.now();if(i-(a.get(o)||0)<1e3)return;a.set(o,i);let n=`[${e.toUpperCase()}] ${t}`;switch(r&&(n+=` ${JSON.stringify(r)}`),e){case"debug":console.debug(n);break;case"info":console.info(n);break;case"warn":console.warn(n);break;case"error":case"fatal":console.error(n),s&&console.error(s)}}async saveErrorToDatabase(e,t,a,s){try{let{default:o}=await Promise.resolve().then(r.bind(r,34747));await o.run(`
        INSERT INTO error_logs (
          userId, severity, message, context, stack, timestamp
        ) VALUES (?, ?, ?, ?, ?, ?)
      `,[a?.userId||null,e,t,JSON.stringify(a||{}),s||null,new Date().toISOString()])}catch(e){console.error("Failed to save error log to database:",e)}}}let o=new s},44870:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},48558:(e,t,r)=>{r.r(t),r.d(t,{patchFetch:()=>k,routeModule:()=>X,serverHooks:()=>M,workAsyncStorage:()=>P,workUnitAsyncStorage:()=>j});var a={};r.r(a),r.d(a,{POST:()=>R});var s=r(96559),o=r(48088),i=r(37719),n=r(32190),d=r(85663),l=r(21187),c=r(16263),u=r(92120),p=r(4208);let T=async(e,t,r)=>{let a=await (0,p.A)(e,t,"sign");return(0,u.A)(e,a),new Uint8Array(await crypto.subtle.sign((0,c.A)(e,a.algorithm),a,r))};var E=r(74996),g=r(70803),h=r(97989),m=r(44032),w=r(41286),f=r(95548);class A{#e;#t;#r;constructor(e){if(!(e instanceof Uint8Array))throw TypeError("payload must be an instance of Uint8Array");this.#e=e}setProtectedHeader(e){if(this.#t)throw TypeError("setProtectedHeader can only be called once");return this.#t=e,this}setUnprotectedHeader(e){if(this.#r)throw TypeError("setUnprotectedHeader can only be called once");return this.#r=e,this}async sign(e,t){let r;if(!this.#t&&!this.#r)throw new g.Ye("either setProtectedHeader or setUnprotectedHeader must be called before #sign()");if(!(0,E.A)(this.#t,this.#r))throw new g.Ye("JWS Protected and JWS Unprotected Header Parameter names must be disjoint");let a={...this.#t,...this.#r},s=(0,w.A)(g.Ye,new Map([["b64",!0]]),t?.crit,this.#t,a),o=!0;if(s.has("b64")&&"boolean"!=typeof(o=this.#t.b64))throw new g.Ye('The "b64" (base64url-encode payload) Header Parameter must be a boolean');let{alg:i}=a;if("string"!=typeof i||!i)throw new g.Ye('JWS "alg" (Algorithm) Header Parameter missing or invalid');(0,m.A)(i,e,"sign");let n=this.#e;o&&(n=h.Rd.encode((0,l.l)(n))),r=this.#t?h.Rd.encode((0,l.l)(JSON.stringify(this.#t))):h.Rd.encode("");let d=(0,h.xW)(r,h.Rd.encode("."),n),c=await (0,f.A)(e,i),u=await T(i,c,d),p={signature:(0,l.l)(u),payload:""};return o&&(p.payload=h.D0.decode(n)),this.#r&&(p.header=this.#r),this.#t&&(p.protected=h.D0.decode(r)),p}}class N{#a;constructor(e){this.#a=new A(e)}setProtectedHeader(e){return this.#a.setProtectedHeader(e),this}async sign(e,t){let r=await this.#a.sign(e,t);if(void 0===r.payload)throw TypeError("use the flattened module for creating JWS with b64: false");return`${r.protected}.${r.payload}.${r.signature}`}}var y=r(91492);class I{#t;#s;constructor(e={}){this.#s=new y.c(e)}setIssuer(e){return this.#s.iss=e,this}setSubject(e){return this.#s.sub=e,this}setAudience(e){return this.#s.aud=e,this}setJti(e){return this.#s.jti=e,this}setNotBefore(e){return this.#s.nbf=e,this}setExpirationTime(e){return this.#s.exp=e,this}setIssuedAt(e){return this.#s.iat=e,this}setProtectedHeader(e){return this.#t=e,this}async sign(e,t){let r=new N(this.#s.data());if(r.setProtectedHeader(this.#t),Array.isArray(this.#t?.crit)&&this.#t.crit.includes("b64")&&!1===this.#t.b64)throw new g.Dp("JWTs MUST NOT use unencoded payload");return r.sign(e,t)}}let S=new TextEncoder().encode(process.env.JWT_SECRET||"test_jwt_secret_for_development_only");async function L(e){return await new I(e).setProtectedHeader({alg:"HS256"}).setIssuedAt().setExpirationTime("8h").sign(S)}var U=r(34747),H=r(55511);let O=!1;async function v(){await U.default.run(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT,
      email TEXT UNIQUE NOT NULL,
      emailVerified DATETIME,
      image TEXT,
      role TEXT,
      password TEXT,
      createdAt DATETIME NOT NULL,
      updatedAt DATETIME NOT NULL
    )
  `),await U.default.run(`
    CREATE TABLE IF NOT EXISTS events (
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
      updatedAt DATETIME NOT NULL
    )
  `),await U.default.run(`
    CREATE TABLE IF NOT EXISTS event_categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT,
      createdAt DATETIME NOT NULL,
      updatedAt DATETIME NOT NULL
    )
  `),await U.default.run("CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)"),await U.default.run("CREATE INDEX IF NOT EXISTS idx_events_slug ON events(slug)")}async function b(){if(!await U.default.get("SELECT id FROM users WHERE email = ? AND role = ?",["admin@example.com","ADMIN"])){console.log("Creating admin user for Vercel deployment...");let e=new Date().toISOString(),t=(0,H.randomUUID)();await U.default.run("INSERT INTO users (id, name, email, role, password, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)",[t,"Admin User","admin@example.com","ADMIN","$2a$10$8r0aGeQoqQioRh8LQgB5Y.BwqR6EUQ2oe5YHBnwKDJ0K0UZnuoiC.",e,e])}if(!await U.default.get("SELECT id FROM event_categories WHERE slug = ?",["example-category"])){console.log("Creating example category for Vercel deployment...");let e=new Date().toISOString(),t=(0,H.randomUUID)();await U.default.run("INSERT INTO event_categories (id, name, slug, description, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)",[t,"Example Category","example-category","This is an example category created during initialization",e,e]);let r=(0,H.randomUUID)();await U.default.run(`
      INSERT INTO events (id, title, slug, description, location, startDate, endDate, status, published, categoryId, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,[r,"Sample Vercel Event","sample-vercel-event","This is a sample event for Vercel deployments","Online",new Date().toISOString(),new Date(Date.now()+864e5).toISOString(),"PUBLISHED",1,t,e,e])}}!async function(){if(!O&&"1"===process.env.VERCEL){console.log("Initializing in-memory database for Vercel deployment...");try{await v(),await b(),O=!0,console.log("Vercel database initialization complete")}catch(e){console.error("Error initializing Vercel database:",e)}}}();var D=r(23607),x=r(36463);async function R(e){try{let{email:t,password:r}=await e.json();if(!t||!r)return D.aI.error("Email and password are required",400);let a=await U.default.get("SELECT id, email, password, role FROM users WHERE email = ?",[t]);if(!a||!await d.Ay.compare(r,a.password))return D.aI.error("Invalid credentials",401);let s=await L({id:a.id,email:a.email,role:a.role});console.log(`[Login API] Generated token (first 20 chars): ${s.substring(0,20)}...`);let o=n.NextResponse.json({success:!0,data:{id:a.id,email:a.email,role:a.role}});return o.cookies.set({name:"token",value:s,httpOnly:!0,secure:!0,sameSite:"lax",maxAge:604800,path:"/"}),console.log(`[Login API] Set token cookie for user: ${t}`),x.Ay.info(`User ${t} logged in successfully`,{userId:a.id}),o}catch(e){return console.error("[Login API] Error during login:",e),console.error("Login failed:",e instanceof Error?e.message:String(e)),D.aI.error("Authentication failed",500)}}process.env.JWT_SECRET;let X=new s.AppRouteRouteModule({definition:{kind:o.RouteKind.APP_ROUTE,page:"/api/auth/login/route",pathname:"/api/auth/login",filename:"route",bundlePath:"app/api/auth/login/route"},resolvedPagePath:"/Users/pro/Dev/gmp/src/app/api/auth/login/route.ts",nextConfigOutput:"",userland:a}),{workAsyncStorage:P,workUnitAsyncStorage:j,serverHooks:M}=X;function k(){return(0,i.patchFetch)({workAsyncStorage:P,workUnitAsyncStorage:j})}},55511:e=>{e.exports=require("crypto")},56689:e=>{e.exports=require("sqlite3")},63033:e=>{e.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")}};var t=require("../../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),a=t.X(0,[4447,580,4314,5663,635],()=>r(48558));module.exports=a})();