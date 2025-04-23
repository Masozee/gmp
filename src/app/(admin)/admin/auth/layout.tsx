"use client"

// This layout should NOT use any shared components from the admin layout
// like AppSidebar or SiteHeader
export default function AdminAuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {children}
    </div>
  );
}