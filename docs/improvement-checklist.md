# Improvement Checklist (Security & Performance)

## Security Improvements

1.  **JWT Secret Management:**
    *   **Area:** Authentication (`/src/app/api/auth/login/route.ts`)
    *   **Issue:** The JWT secret has a hardcoded development fallback (`test_jwt_secret_for_development_only`).
    *   **Recommendation:** Ensure a strong, unique `JWT_SECRET` is always set via environment variables in all environments (development, staging, production). Never commit secrets to the repository. Rotate secrets periodically.

2.  **Default Admin Credentials:**
    *   **Area:** Database Initialization (`/src/lib/db-init.ts`, `/src/lib/sqlite.ts`, `/src/init-db.js`)
    *   **Issue:** Default admin user (`admin@example.com`) is created with a hardcoded password ('admin123' or its hash). Initialization scripts might run unintentionally.
    *   **Recommendation:** Remove automatic admin creation with hardcoded passwords from initialization scripts intended for production. Implement a secure first-time setup process (e.g., a setup command that prompts for admin details, or using secure environment variables for initial credentials only during the *very first* setup). Ensure `init-db.js` is not runnable in production.

3.  **Input Validation Consistency:**
    *   **Area:** API Routes (e.g., `/src/app/api/**/route.ts`)
    *   **Issue:** While Zod is used on the frontend, server-side validation coverage across all API endpoints needs verification. Missing or incomplete validation can lead to vulnerabilities or errors.
    *   **Recommendation:** Ensure all API routes rigorously validate and sanitize *all* incoming data (body, query parameters, route parameters) using a library like Zod on the server-side, even if validation exists on the client. Check edge cases and data types.

4.  **File Upload Security:**
    *   **Area:** File Upload Handling (Likely an API route like `/api/upload`, related code in `/src/components/profiles/create-profile-dialog.tsx`)
    *   **Issue:** Potential vulnerabilities if file uploads are not handled securely on the server-side. Client-side checks are insufficient.
    *   **Recommendation:** Implement robust server-side validation for file uploads:
        *   Strictly validate file types (MIME types and extensions).
        *   Enforce reasonable file size limits.
        *   Sanitize filenames to prevent path traversal or injection attacks.
        *   Consider storing uploaded files outside the web root or in a dedicated object storage service (like S3) with appropriate access controls.
        *   Scan uploaded files for malware if applicable.

5.  **Dependency Vulnerabilities:**
    *   **Area:** Project Dependencies (`package.json`, `bun.lock`)
    *   **Issue:** Dependencies may contain known security vulnerabilities.
    *   **Recommendation:** Regularly audit dependencies using `bun audit` (or `npm audit` / `yarn audit` if applicable) or integrate automated security scanning tools (like Snyk, Dependabot) into the CI/CD pipeline. Keep dependencies updated.

6.  **Error Handling Verbosity:**
    *   **Area:** API Routes (`/src/app/api/**/route.ts`)
    *   **Issue:** Returning overly detailed error messages in production can leak sensitive information about the application's internals.
    *   **Recommendation:** Configure error handling to log detailed errors internally (using the existing logger) but return generic, non-informative error messages to the client in production environments.

7.  **Cross-Site Scripting (XSS):**
    *   **Area:** Frontend Rendering (React Components)
    *   **Issue:** Potential risk if user-generated content is rendered without proper sanitization, especially if using `dangerouslySetInnerHTML`.
    *   **Recommendation:** Review all instances where user-controlled content is rendered. Avoid `dangerouslySetInnerHTML` where possible. If necessary, use a robust sanitization library (like DOMPurify) before rendering user content. Rely on React's default escaping for most cases.

8.  **Rate Limiting:**
    *   **Area:** API Endpoints (`/src/app/api/**/route.ts`, `middleware.ts`)
    *   **Issue:** Lack of rate limiting can make APIs vulnerable to brute-force attacks (e.g., on login) and denial-of-service (DoS) attacks.
    *   **Recommendation:** Implement rate limiting on sensitive endpoints (like login, registration) and potentially globally. Use libraries like `rate-limiter-flexible` or cloud provider services.

## Performance Improvements

1.  **Database Optimization (SQLite):**
    *   **Area:** Database Queries (`/src/lib/sqlite.ts`, API routes like `/src/app/api/events/route.ts`)
    *   **Issue:** The `/api/events` endpoint was identified as the least efficient in stress tests. SQLite performance might degrade under heavy concurrent load.
    *   **Recommendation:**
        *   Analyze queries used by `/api/events` and ensure they utilize existing indexes (`idx_events_slug`, `idx_events_category`). Use `EXPLAIN QUERY PLAN` in SQLite.
        *   Add additional indexes based on common query patterns (e.g., `WHERE` clauses, `ORDER BY` columns).
        *   For production environments with significant load, plan migration from SQLite to a more robust database like PostgreSQL or MySQL, as recommended in the stress test report.

2.  **API Caching:**
    *   **Area:** API Routes (especially read-heavy ones like `/api/event-categories`, `/api/tags`)
    *   **Issue:** Repeatedly fetching the same data can strain the database and increase response times.
    *   **Recommendation:** Implement caching strategies:
        *   **Response Caching:** Use `Cache-Control` headers for public, static data.
        *   **Data Caching:** Leverage Next.js App Router's built-in `fetch` caching or `unstable_cache` for server-side data fetching.
        *   **External Cache:** For higher scalability, consider an in-memory cache like Redis or Memcached.

3.  **Frontend Bundle Size:**
    *   **Area:** Next.js Build Output (`.next/`)
    *   **Issue:** Large JavaScript bundles increase page load times.
    *   **Recommendation:**
        *   Use `@next/bundle-analyzer` to inspect bundle contents.
        *   Identify large dependencies and consider alternatives or code splitting.
        *   Utilize `next/dynamic` for lazy loading components and pages that are not needed immediately.
        *   Ensure tree-shaking is effective.

4.  **Image Optimization:**
    *   **Area:** Image Usage (`/public/`, React Components)
    *   **Issue:** Unoptimized images significantly impact load times.
    *   **Recommendation:**
        *   Consistently use the `next/image` component for automatic optimization (resizing, format conversion like WebP, lazy loading).
        *   Ensure source images in `/public/` are reasonably sized before being processed by `next/image`.

5.  **Component Rendering:**
    *   **Area:** React Components (`/src/components/`)
    *   **Issue:** Unnecessary re-renders of components can slow down the UI.
    *   **Recommendation:**
        *   Use `React.memo` for functional components that render the same output given the same props.
        *   Profile component rendering using React DevTools to identify bottlenecks.
        *   Optimize data fetching and state management to prevent cascading re-renders.

6.  **Middleware Performance:**
    *   **Area:** `/src/middleware.ts`
    *   **Issue:** Middleware runs on many requests; inefficient logic can add latency.
    *   **Recommendation:** Ensure the token verification logic (`verifyToken`) and path matching are highly efficient. Minimize complex computations within the middleware.

7.  **Connection Pooling (Post-Migration):**
    *   **Area:** Database Connection (Relevant if migrating from SQLite)
    *   **Issue:** Creating new database connections for each request is inefficient.
    *   **Recommendation:** If migrating to PostgreSQL/MySQL, ensure proper connection pooling is configured in the database library or ORM used.
