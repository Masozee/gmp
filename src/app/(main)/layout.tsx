"use client";

import { MainSiteLayout } from "@/components/layouts/main-site-layout";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MainSiteLayout>{children}</MainSiteLayout>;
}
