(()=>{var e={};e.id=1612,e.ids=[1612],e.modules={3295:e=>{"use strict";e.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},10846:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},29294:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-async-storage.external.js")},30929:(e,r,t)=>{"use strict";t.r(r),t.d(r,{patchFetch:()=>p,routeModule:()=>d,serverHooks:()=>N,workAsyncStorage:()=>c,workUnitAsyncStorage:()=>l});var s={};t.r(s),t.d(s,{POST:()=>E});var a=t(96559),n=t(48088),i=t(37719),o=t(32190),u=t(34747),T=t(85663);async function E(e){try{let{email:r,password:t,name:s}=await e.json();if(!r||!t||!s)return o.NextResponse.json({error:"Email, password, and name are required"},{status:400});if(await u.default.get("SELECT * FROM users WHERE email = ?",[r]))return o.NextResponse.json({error:"User already exists"},{status:409});let a=await (0,T.tW)(t,10),n=new Date().toISOString(),i=await u.default.run("INSERT INTO users (email, password, name, role, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)",[r,a,s,"user",n,n]),E=await u.default.get("SELECT id, email, name, role, createdAt, updatedAt FROM users WHERE id = ?",[i.lastInsertRowid]);return o.NextResponse.json(E)}catch(e){return console.error("Failed to register user:",e),o.NextResponse.json({error:"Failed to register user"},{status:500})}}let d=new a.AppRouteRouteModule({definition:{kind:n.RouteKind.APP_ROUTE,page:"/api/auth/register/route",pathname:"/api/auth/register",filename:"route",bundlePath:"app/api/auth/register/route"},resolvedPagePath:"/Users/pro/Dev/gmp/src/app/api/auth/register/route.ts",nextConfigOutput:"",userland:s}),{workAsyncStorage:c,workUnitAsyncStorage:l,serverHooks:N}=d;function p(){return(0,i.patchFetch)({workAsyncStorage:c,workUnitAsyncStorage:l})}},34747:(e,r,t)=>{"use strict";t.d(r,{default:()=>u});var s=t(56689),a=t(55511);let n="1"===process.env.VERCEL,i=n?":memory:":"./src/db.sqlite",o=null,u={getConnection:async()=>(!o&&(o=await new Promise((e,r)=>{try{let t=new s.Database(i,s=>{if(s){console.error("Error opening database:",s),r(s);return}t.run("PRAGMA foreign_keys = ON",s=>{if(s){console.error("Error setting PRAGMA:",s),r(s);return}e(t)})})}catch(e){r(e)}}),n&&console.log("Running in Vercel environment, using in-memory database")),o),async run(e,r=[]){return new Promise(async(t,s)=>{(await this.getConnection()).run(e,r,function(a){if(a){console.error("SQL Error in run:",e,"Params:",JSON.stringify(r),"Error:",a),s(a);return}t({lastInsertRowid:this.lastID,changes:this.changes})})})},async get(e,r=[]){return new Promise(async(t,s)=>{(await this.getConnection()).get(e,r,(a,n)=>{if(a){console.error("SQL Error in get:",e,"Params:",JSON.stringify(r),"Error:",a),s(a);return}t(n)})})},async all(e,r=[]){return new Promise(async(t,s)=>{(await this.getConnection()).all(e,r,(a,n)=>{if(a){console.error("SQL Error in all:",e,"Params:",JSON.stringify(r),"Error:",a),s(a);return}t(n)})})},async each(e,r=[],t){return new Promise(async(s,a)=>{let n=await this.getConnection(),i=0;n.each(e,r,(e,r)=>{if(e)return void a(e);t(r),i++},(e,r)=>{if(e)return void a(e);s(i)})})},async transaction(e){let r=await this.getConnection();return new Promise(async(t,s)=>{r.run("BEGIN TRANSACTION",async a=>{if(a)return void s(a);try{let a=await Promise.resolve(e());r.run("COMMIT",e=>{if(e)return void r.run("ROLLBACK",()=>{s(e)});t(a)})}catch(e){r.run("ROLLBACK",r=>{r&&console.error("Failed to roll back transaction:",r),s(e)})}})})},close:async()=>new Promise((e,r)=>{if(!o)return void e();o.close(t=>{if(t)return void r(t);o=null,e()})}),async paginate(e,r){let t=Math.max(1,Math.min(100,r));return{offset:(Math.max(1,e)-1)*t,limit:t}},generateId:()=>(0,a.randomUUID)(),async setupDatabase(){for(let e of(await this.getConnection(),[`CREATE TABLE IF NOT EXISTS users (
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
      )`]))await this.run(e);for(let e of["CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)","CREATE INDEX IF NOT EXISTS idx_events_slug ON events(slug)","CREATE INDEX IF NOT EXISTS idx_events_category ON events(categoryId)"])await this.run(e);if(!await this.get("SELECT id FROM users WHERE email = ? AND role = ?",["admin@example.com","ADMIN"])){console.log("Creating admin user...");let e=new Date().toISOString(),r=this.generateId();await this.run("INSERT INTO users (id, name, email, role, password, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)",[r,"Admin User","admin@example.com","ADMIN","$2a$10$8r0aGeQoqQioRh8LQgB5Y.BwqR6EUQ2oe5YHBnwKDJ0K0UZnuoiC.",e,e]),console.log("Admin user created with default password (admin123)")}}}},44870:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},55511:e=>{"use strict";e.exports=require("crypto")},56689:e=>{"use strict";e.exports=require("sqlite3")},63033:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},78335:()=>{},96487:()=>{}};var r=require("../../../../webpack-runtime.js");r.C(e);var t=e=>r(r.s=e),s=r.X(0,[4447,580,5663],()=>t(30929));module.exports=s})();