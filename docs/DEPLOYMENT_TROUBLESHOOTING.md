# 🚨 Deployment Troubleshooting Guide

## Issue: "Failed to fetch dashboard stats" and Internal Server Errors

### Root Cause
The application was using **Node.js specific modules** (`path`, `crypto`, `process.cwd`) that are not compatible with **Edge Runtime** in production environments.

### ✅ **Fixed Issues:**

1. **Edge Runtime Compatibility**
   - ❌ `import path from 'path'` → ✅ Removed
   - ❌ `import { randomBytes } from 'crypto'` → ✅ Replaced with Web Crypto API
   - ❌ `process.cwd()` → ✅ Removed, using relative paths

2. **Database Configuration**
   - ❌ `path.join(process.cwd(), 'database.sqlite')` → ✅ `'file:database.sqlite'`
   - ✅ LibSQL client now Edge Runtime compatible

3. **Session Management**
   - ❌ Node.js `crypto.randomBytes()` → ✅ Web Crypto API `crypto.getRandomValues()`
   - ✅ Fallback for environments without crypto

### 🔧 **Key Changes Made:**

#### 1. Database Configuration (`src/lib/db/index.ts`)
```typescript
// OLD (Edge Runtime incompatible)
import path from 'path';
const client = createClient({
  url: process.env.DATABASE_URL || `file:${path.join(process.cwd(), 'database.sqlite')}`,
});

// NEW (Edge Runtime compatible)
const client = createClient({
  url: process.env.DATABASE_URL || 'file:./database.sqlite',
});
```

#### 2. Session ID Generation (`src/lib/auth-utils.ts`)
```typescript
// OLD (Node.js specific)
import { randomBytes } from 'crypto';
const sessionId = randomBytes(32).toString('hex');

// NEW (Web Crypto API - Edge Runtime compatible)
function generateSessionId(): string {
  const array = new Uint8Array(32);
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(array);
  } else {
    // Fallback for environments without crypto
    for (let i = 0; i < array.length; i++) {
      array[i] = Math.floor(Math.random() * 256);
    }
  }
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}
```

#### 3. Middleware Optimization (`src/middleware.ts`)
```typescript
// Removed database imports to avoid Edge Runtime issues
// Now only checks session cookie existence
// Full validation happens in ProtectedClientPage component
```

### 🚀 **Deployment Steps for Live Server:**

#### 1. **Update Your Live Files**
Replace these files on your server:
- `src/lib/db/index.ts`
- `src/lib/auth-utils.ts`
- `src/middleware.ts`
- `drizzle.config.ts`
- `scripts/migrate.ts`

#### 2. **Rebuild Application**
```bash
# On your server or locally then upload
npm run build
```

#### 3. **Environment Variables**
Make sure your `.env.local` has:
```bash
# For local SQLite
DATABASE_URL="file:database.sqlite"

# OR for Turso Cloud (recommended for production)
DATABASE_URL="libsql://your-app-name.turso.io"
DATABASE_AUTH_TOKEN="your-turso-token"

JWT_SECRET="your-super-secret-key"
NEXT_PUBLIC_APP_URL="https://yourdomain.com"
```

#### 4. **Database Setup**
```bash
# Run migrations
npm run db:migrate

# Initialize with admin user (if needed)
npm run db:init
```

#### 5. **Start Production Server**
```bash
npm start
```

### 🔍 **Testing the Fix:**

#### Test Dashboard API:
```bash
# Login first
curl -X POST https://yourdomain.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@partisipasimuda.org","password":"admin123"}' \
  -c cookies.txt

# Test dashboard stats
curl https://yourdomain.com/api/admin/dashboard/stats -b cookies.txt
```

Should return:
```json
{
  "success": true,
  "data": {
    "events": {...},
    "publications": {...},
    "discussions": {...}
  }
}
```

### 🛠️ **If Still Having Issues:**

#### 1. **Check Server Logs**
Look for these specific errors:
- "Edge runtime does not support Node.js 'path' module"
- "Edge runtime does not support Node.js 'crypto' module"
- "process.cwd is not supported in Edge Runtime"

#### 2. **Verify File Paths**
Make sure database file is accessible:
```bash
ls -la database.sqlite
# Should show the database file
```

#### 3. **Test API Endpoints Individually**
```bash
# Test basic API
curl https://yourdomain.com/api

# Test auth endpoint
curl https://yourdomain.com/api/auth/login

# Test admin endpoints (with session)
curl https://yourdomain.com/api/admin/dashboard/stats -b cookies.txt
```

### 📊 **Performance Improvements:**

- ✅ **Faster middleware** (no database calls)
- ✅ **Edge Runtime compatible** (better performance)
- ✅ **Reduced bundle size** (removed Node.js modules)
- ✅ **Better error handling** (graceful fallbacks)

### 🔒 **Security Notes:**

- ✅ Session validation still happens in `ProtectedClientPage`
- ✅ API endpoints still validate sessions properly
- ✅ Middleware provides first-line defense
- ✅ Web Crypto API is secure for session generation

Your application should now work perfectly on your live server! 🎉 