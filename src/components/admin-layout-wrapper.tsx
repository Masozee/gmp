"use client";

import { ReactNode } from "react";
import { ProtectedClientPage } from "@/components/protected-client-page";

export function AdminLayoutWrapper({ children }: { children: ReactNode }) {
  return (
    <ProtectedClientPage>
      {children}
    </ProtectedClientPage>
  );
} 