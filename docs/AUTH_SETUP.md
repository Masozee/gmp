# Authentication System Setup

This project now uses SQLite with Drizzle ORM and Hono for authentication instead of Supabase.

## Database Setup

1. **Install dependencies** (already done):
   ```bash
   npm install drizzle-orm better-sqlite3 @types/better-sqlite3 drizzle-kit hono bcryptjs @types/bcryptjs jsonwebtoken @types/jsonwebtoken
   ```

2. **Generate and run migrations**:
   ```bash
   npm run db:generate
   npm run db:migrate
   ```

3. **Initialize database with default admin user**:
   ```bash
   npm run db:init
   ```

## Environment Variables

Copy `env.example` to `.env.local` and update the values:

```bash
cp env.example .env.local
```

Make sure to change the `JWT_SECRET` to a secure random string in production.

## Default Admin Credentials

After running `npm run db:init`, you can login with:

- **Email**: `admin@partisipasimuda.org`
- **Password**: `admin123`

⚠️ **Important**: Change the default password after first login!

## API Endpoints

### Authentication Routes (Next.js API Routes)

- `POST /api/auth/login` - Login with email/password
- `DELETE /api/auth/login` - Logout (delete session)
- `GET /api/auth/login` - Check current session
- `POST /api/auth/register` - Register new user

### Hono API Routes

- `GET /api/hono/health` - Health check (public)
- `GET /api/hono/protected/profile` - Get current user profile
- `PUT /api/hono/protected/profile` - Update user profile
- `GET /api/hono/protected/users` - Get all users (admin only)

## Database Schema

### Users Table
- `id` - Primary key
- `email` - Unique email address
- `password` - Hashed password
- `name` - User's full name
- `role` - Either 'admin' or 'user'
- `createdAt` - Timestamp
- `updatedAt` - Timestamp

### Sessions Table
- `id` - Session ID (primary key)
- `userId` - Foreign key to users table
- `expiresAt` - Session expiration timestamp
- `createdAt` - Timestamp

## Available Scripts

- `npm run db:generate` - Generate new migrations
- `npm run db:migrate` - Run database migrations
- `npm run db:init` - Initialize database with default admin user
- `npm run db:studio` - Open Drizzle Studio (database GUI)

## Security Features

- **Password Hashing**: Uses bcrypt with salt rounds of 12
- **Session Management**: HTTP-only cookies with secure settings
- **JWT Tokens**: For API authentication
- **Role-based Access**: Admin and user roles
- **Session Expiration**: 7-day session duration
- **CSRF Protection**: SameSite cookie settings

## Usage in Components

### Client-side Authentication Check

```typescript
const response = await fetch('/api/auth/login', {
  method: 'GET',
  credentials: 'include',
});

if (response.ok) {
  const data = await response.json();
  console.log('Current user:', data.user);
}
```

### Login

```typescript
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({ email, password }),
});
```

### Logout

```typescript
const response = await fetch('/api/auth/login', {
  method: 'DELETE',
  credentials: 'include',
});
```

## Migration from Supabase

The login form and protected page components have been updated to use the new authentication system. The old Supabase code has been replaced with fetch calls to the new API endpoints.

## Database File Location

The SQLite database file is created at `./database.sqlite` in the project root. This file contains all user data and sessions.

⚠️ **Important**: Add `database.sqlite` to your `.gitignore` file to avoid committing sensitive data to version control. 