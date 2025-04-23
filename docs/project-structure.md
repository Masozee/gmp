# GMP Project Structure

This document explains the project structure for the Generasi Melek Politik website after the April 2025 restructuring.

## Overview

The project has been restructured into two main route groups within the Next.js app directory:

1. `(main)` - Contains all main website content
2. `(admin)` - Contains all admin dashboard content

## Route Groups

In Next.js, folders with parentheses `()` are route groups. Route groups allow you to organize files into groups without affecting the URL path. For example:

- Files in `/src/app/(main)/about/page.tsx` will be accessible at `/about` (not `/main/about`)
- Files in `/src/app/(admin)/dashboard/page.tsx` will be accessible at `/dashboard` (not `/admin/dashboard`)

## Structure Details

### Main Website `(main)`

The `(main)` route group contains all public-facing pages with a consistent layout that includes the site header and footer.

```
src/app/(main)/
├── about/
├── events/
├── news/
├── partners/
├── presentations/
├── programs/
├── publications/
├── globals.css
├── layout.tsx   # Layout wraps all main website pages
└── page.tsx     # Homepage
```

### Admin Dashboard `(admin)`

The `(admin)` route group contains all administrative pages with their own layout.

```
src/app/(admin)/
├── admin/
├── dashboard/
├── users/
└── layout.tsx   # Layout wraps all admin pages
```

### Root Level Files

The root level of the app directory contains:

```
src/app/
├── (admin)/     # Admin route group
├── (main)/      # Main website route group
├── api/         # API routes
├── error.tsx    # Global error handling
├── global-error.tsx
├── globals.css  # Global styles
├── layout.tsx   # Root layout applied to all pages
├── not-found.tsx
└── page.tsx     # Root page (redirects to homepage)
```

## Benefits of This Structure

1. **Separation of Concerns**: Clear separation between main website and admin dashboard code
2. **Consistent Layouts**: Each section has its own layout file
3. **Preserved URLs**: URLs remain clean and intuitive despite organizational structure
4. **Improved Developer Experience**: Easier to understand and maintain the codebase

## Common Development Tasks

- To add a new page to the main website, create it under `/src/app/(main)/`
- To add a new admin page, create it under `/src/app/(admin)/`
- To modify the main website layout, edit `/src/app/(main)/layout.tsx`
- To modify the admin dashboard layout, edit `/src/app/(admin)/layout.tsx`