import { ReactNode } from "react";
import { AdminLayoutWrapper } from "@/components/admin-layout-wrapper";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 font-geist">
      <AdminLayoutWrapper>{children}</AdminLayoutWrapper>
    </div>
  );
} 