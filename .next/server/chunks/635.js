exports.id=635,exports.ids=[635],exports.modules={23607:(e,r,t)=>{"use strict";t.d(r,{aI:()=>s});var n=t(32190);t(34747);let s={success:(e,r,t)=>n.NextResponse.json({success:!0,data:e,message:t,pagination:r}),created:(e,r)=>n.NextResponse.json({success:!0,data:e,message:r||"Resource created successfully"},{status:201}),error:(e,r=500)=>n.NextResponse.json({success:!1,error:e},{status:r}),badRequest(e="Bad request"){return this.error(e,400)},unauthorized(e="Unauthorized"){return this.error(e,401)},forbidden(e="Forbidden"){return this.error(e,403)},notFound(e="Resource not found"){return this.error(e,404)},noContent:()=>new n.NextResponse(null,{status:204})}},34747:(e,r,t)=>{"use strict";t.d(r,{default:()=>T});var n=t(56689),s=t(55511);let a="1"===process.env.VERCEL,o=a?":memory:":"./src/db.sqlite",i=null,T={getConnection:async()=>(!i&&(i=await new Promise((e,r)=>{try{let t=new n.Database(o,n=>{if(n){console.error("Error opening database:",n),r(n);return}t.run("PRAGMA foreign_keys = ON",n=>{if(n){console.error("Error setting PRAGMA:",n),r(n);return}e(t)})})}catch(e){r(e)}}),a&&console.log("Running in Vercel environment, using in-memory database")),i),async run(e,r=[]){return new Promise(async(t,n)=>{(await this.getConnection()).run(e,r,function(s){if(s){console.error("SQL Error in run:",e,"Params:",JSON.stringify(r),"Error:",s),n(s);return}t({lastInsertRowid:this.lastID,changes:this.changes})})})},async get(e,r=[]){return new Promise(async(t,n)=>{(await this.getConnection()).get(e,r,(s,a)=>{if(s){console.error("SQL Error in get:",e,"Params:",JSON.stringify(r),"Error:",s),n(s);return}t(a)})})},async all(e,r=[]){return new Promise(async(t,n)=>{(await this.getConnection()).all(e,r,(s,a)=>{if(s){console.error("SQL Error in all:",e,"Params:",JSON.stringify(r),"Error:",s),n(s);return}t(a)})})},async each(e,r=[],t){return new Promise(async(n,s)=>{let a=await this.getConnection(),o=0;a.each(e,r,(e,r)=>{if(e)return void s(e);t(r),o++},(e,r)=>{if(e)return void s(e);n(o)})})},async transaction(e){let r=await this.getConnection();return new Promise(async(t,n)=>{r.run("BEGIN TRANSACTION",async s=>{if(s)return void n(s);try{let s=await Promise.resolve(e());r.run("COMMIT",e=>{if(e)return void r.run("ROLLBACK",()=>{n(e)});t(s)})}catch(e){r.run("ROLLBACK",r=>{r&&console.error("Failed to roll back transaction:",r),n(e)})}})})},close:async()=>new Promise((e,r)=>{if(!i)return void e();i.close(t=>{if(t)return void r(t);i=null,e()})}),async paginate(e,r){let t=Math.max(1,Math.min(100,r));return{offset:(Math.max(1,e)-1)*t,limit:t}},generateId:()=>(0,s.randomUUID)(),async setupDatabase(){for(let e of(await this.getConnection(),[`CREATE TABLE IF NOT EXISTS users (
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
      )`]))await this.run(e);for(let e of["CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)","CREATE INDEX IF NOT EXISTS idx_events_slug ON events(slug)","CREATE INDEX IF NOT EXISTS idx_events_category ON events(categoryId)"])await this.run(e);if(!await this.get("SELECT id FROM users WHERE email = ? AND role = ?",["admin@example.com","ADMIN"])){console.log("Creating admin user...");let e=new Date().toISOString(),r=this.generateId();await this.run("INSERT INTO users (id, name, email, role, password, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)",[r,"Admin User","admin@example.com","ADMIN","$2a$10$8r0aGeQoqQioRh8LQgB5Y.BwqR6EUQ2oe5YHBnwKDJ0K0UZnuoiC.",e,e]),console.log("Admin user created with default password (admin123)")}}}},78335:()=>{},96487:()=>{}};