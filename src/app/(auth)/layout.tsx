"use client"

import type { ReactNode } from "react";

// This is a clean layout for authentication pages with NO sidebar or navigation
export default function AuthLayout({
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