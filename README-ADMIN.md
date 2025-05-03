# Partisipasi Muda Admin Panel

This is the admin panel for Partisipasi Muda built with Next.js, Hono, and Supabase.

## Setup Instructions

1. **Configure Supabase**:
   - Create a Supabase account at [supabase.io](https://supabase.io)
   - Create a new project
   - Copy your project URL and anon key from the project settings
   - Create a `.env.local` file in the root directory with the following:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

2. **Setup Authentication**:
   - In your Supabase dashboard, go to Authentication > Settings
   - Configure the authentication methods you want to use (Email/Password is used in this project)
   - Set up email templates if needed
   - Create your first admin user through the Supabase dashboard or using the API:
   ```
   POST /api/admin/create
   Authorization: Bearer your-secret-token
   Content-Type: application/json
   
   {
     "email": "admin@example.com",
     "password": "your-secure-password"
   }
   ```

3. **Database Setup**:
   - Create the necessary tables in Supabase SQL editor:
   ```sql
   -- Users table (optional if using Supabase Auth)
   CREATE TABLE IF NOT EXISTS public.users (
     id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
     email TEXT,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
   );

   -- Posts table
   CREATE TABLE IF NOT EXISTS public.posts (
     id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
     title TEXT NOT NULL,
     content TEXT,
     user_id UUID REFERENCES auth.users NOT NULL,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
   );

   -- Comments table
   CREATE TABLE IF NOT EXISTS public.comments (
     id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
     content TEXT NOT NULL,
     post_id UUID REFERENCES public.posts NOT NULL,
     user_id UUID REFERENCES auth.users NOT NULL,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
   );
   ```

4. **Run the application**:
   ```
   npm run dev
   ```

5. **Access the admin panel**:
   - Navigate to `/admin/login` in your browser
   - Login with your Supabase admin credentials
   - You'll be redirected to the admin dashboard

## Features

- **Authentication**: Secure login using Supabase Auth
- **Dashboard**: Overview of users, posts, and engagement
- **API Integration**: Hono API routes with Supabase integration

## Authentication Flow

The authentication system works through multiple layers:

1. **Middleware**: Handles redirects based on auth state:
   - If you're logged in and try to access `/admin/login`, you'll be redirected to `/admin`
   - If you're not logged in and try to access any `/admin/*` route (except `/admin/login`), you'll be redirected to `/admin/login`

2. **Server Components**: Uses `requireAuth()` to check authentication server-side

3. **Client Components**: Use `ProtectedClientPage` as an additional security layer

## Troubleshooting

### ERR_TOO_MANY_REDIRECTS

If you encounter a redirect loop:

1. Clear your browser cookies related to your site
2. Verify your `.env.local` has the correct Supabase credentials
3. Check your Supabase authentication settings
4. Ensure your Supabase cookies are being properly set and read

## Tech Stack

- Next.js 15 (App Router)
- React 19
- Supabase for authentication and database
- Hono for API routes
- shadcn/ui for the UI components 