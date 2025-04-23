// This file ensures that the auth layout is correctly applied and not overridden by parent layouts
export const dynamic = 'force-dynamic';
export const runtime = 'edge';

// Disable layouts from parent routes to ensure the auth layout is always used
export const layoutHooks = {
  useParentLayout: false,
}; 