# URL Checklist for Restructured Website

This document lists all the URLs that should be tested after the project restructuring into (main) and (admin) route groups. The URLs should remain the same as before, but the underlying folder structure has changed.

## Main Website URLs

- [ ] `/` - Homepage
- [ ] `/about` - About page
- [ ] `/events` - Events page
- [ ] `/news` - News page
- [ ] `/partners` - Partners page
- [ ] `/presentations` - Presentations page
- [ ] `/programs` - Programs page
- [ ] `/publications` - Publications page

## Admin/Dashboard URLs

- [ ] `/admin/auth/login` - Admin login page
- [ ] `/dashboard` - Dashboard home
- [ ] `/users` - Users management

## Testing Instructions

1. Run the development server:
   ```bash
   npm run dev
   # or
   bun run dev
   ```

2. Visit each URL in the browser and check that:
   - The page loads correctly
   - The layout is appropriate for that section (main or admin)
   - All links on the page work correctly
   - No 404 errors occur

3. Check for any navigation between sections:
   - Main website to admin dashboard links
   - Admin dashboard to main website links

4. Mark each URL as tested by changing `[ ]` to `[x]` in this document

## Notes on Restructuring

The project has been restructured into two main route groups:

1. `(main)` - Contains all main website content
   - Original URL paths are preserved (e.g., /about, /events)
   
2. `(admin)` - Contains all admin dashboard content
   - Original URL paths are preserved (e.g., /admin, /dashboard)

The parentheses in the folder names (e.g., (main), (admin)) indicate to Next.js that these are route groups that don't affect the URL structure.