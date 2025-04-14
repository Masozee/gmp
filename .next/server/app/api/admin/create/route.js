(()=>{var e={};e.id=3786,e.ids=[3786],e.modules={3295:e=>{"use strict";e.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},10846:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},29294:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-async-storage.external.js")},34747:(e,r,t)=>{"use strict";t.d(r,{default:()=>T});var n=t(56689),s=t(55511);let a="1"===process.env.VERCEL,i=a?":memory:":"./src/db.sqlite",o=null,T={getConnection:async()=>(!o&&(o=await new Promise((e,r)=>{try{let t=new n.Database(i,n=>{if(n){console.error("Error opening database:",n),r(n);return}t.run("PRAGMA foreign_keys = ON",n=>{if(n){console.error("Error setting PRAGMA:",n),r(n);return}e(t)})})}catch(e){r(e)}}),a&&console.log("Running in Vercel environment, using in-memory database")),o),async run(e,r=[]){return new Promise(async(t,n)=>{(await this.getConnection()).run(e,r,function(s){if(s){console.error("SQL Error in run:",e,"Params:",JSON.stringify(r),"Error:",s),n(s);return}t({lastInsertRowid:this.lastID,changes:this.changes})})})},async get(e,r=[]){return new Promise(async(t,n)=>{(await this.getConnection()).get(e,r,(s,a)=>{if(s){console.error("SQL Error in get:",e,"Params:",JSON.stringify(r),"Error:",s),n(s);return}t(a)})})},async all(e,r=[]){return new Promise(async(t,n)=>{(await this.getConnection()).all(e,r,(s,a)=>{if(s){console.error("SQL Error in all:",e,"Params:",JSON.stringify(r),"Error:",s),n(s);return}t(a)})})},async each(e,r=[],t){return new Promise(async(n,s)=>{let a=await this.getConnection(),i=0;a.each(e,r,(e,r)=>{if(e)return void s(e);t(r),i++},(e,r)=>{if(e)return void s(e);n(i)})})},async transaction(e){let r=await this.getConnection();return new Promise(async(t,n)=>{r.run("BEGIN TRANSACTION",async s=>{if(s)return void n(s);try{let s=await Promise.resolve(e());r.run("COMMIT",e=>{if(e)return void r.run("ROLLBACK",()=>{n(e)});t(s)})}catch(e){r.run("ROLLBACK",r=>{r&&console.error("Failed to roll back transaction:",r),n(e)})}})})},close:async()=>new Promise((e,r)=>{if(!o)return void e();o.close(t=>{if(t)return void r(t);o=null,e()})}),async paginate(e,r){let t=Math.max(1,Math.min(100,r));return{offset:(Math.max(1,e)-1)*t,limit:t}},generateId:()=>(0,s.randomUUID)(),async setupDatabase(){for(let e of(await this.getConnection(),[`CREATE TABLE IF NOT EXISTS users (
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
      )`]))await this.run(e);for(let e of["CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)","CREATE INDEX IF NOT EXISTS idx_events_slug ON events(slug)","CREATE INDEX IF NOT EXISTS idx_events_category ON events(categoryId)"])await this.run(e);if(!await this.get("SELECT id FROM users WHERE email = ? AND role = ?",["admin@example.com","ADMIN"])){console.log("Creating admin user...");let e=new Date().toISOString(),r=this.generateId();await this.run("INSERT INTO users (id, name, email, role, password, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)",[r,"Admin User","admin@example.com","ADMIN","$2a$10$8r0aGeQoqQioRh8LQgB5Y.BwqR6EUQ2oe5YHBnwKDJ0K0UZnuoiC.",e,e]),console.log("Admin user created with default password (admin123)")}}}},44870:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},55511:e=>{"use strict";e.exports=require("crypto")},56689:e=>{"use strict";e.exports=require("sqlite3")},63033:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},78335:()=>{},86642:(e,r,t)=>{"use strict";t.r(r),t.d(r,{patchFetch:()=>p,routeModule:()=>E,serverHooks:()=>N,workAsyncStorage:()=>d,workUnitAsyncStorage:()=>l});var n={};t.r(n),t.d(n,{POST:()=>c});var s=t(96559),a=t(48088),i=t(37719),o=t(32190),T=t(34747),u=t(85663);async function c(e){try{let{email:r,password:t,name:n}=await e.json();if(!r||!t||!n)return o.NextResponse.json({error:"Missing required fields"},{status:400});let s=new Date().toISOString(),a=await (0,u.tW)(t,12),i=await T.default.run("INSERT INTO users (email, password, name, role, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)",[r,a,n,"ADMIN",s,s]);return o.NextResponse.json({success:!0,id:i.lastInsertRowid})}catch(e){return console.error("Error creating admin:",e),o.NextResponse.json({error:"Failed to create admin user"},{status:500})}}let E=new s.AppRouteRouteModule({definition:{kind:a.RouteKind.APP_ROUTE,page:"/api/admin/create/route",pathname:"/api/admin/create",filename:"route",bundlePath:"app/api/admin/create/route"},resolvedPagePath:"/Users/pro/Dev/gmp/src/app/api/admin/create/route.ts",nextConfigOutput:"",userland:n}),{workAsyncStorage:d,workUnitAsyncStorage:l,serverHooks:N}=E;function p(){return(0,i.patchFetch)({workAsyncStorage:d,workUnitAsyncStorage:l})}},96487:()=>{}};var r=require("../../../../webpack-runtime.js");r.C(e);var t=e=>r(r.s=e),n=r.X(0,[4447,580,5663],()=>t(86642));module.exports=n})();