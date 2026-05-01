"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { GlobalNotice } from "@/components/global-notice";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin") || pathname.startsWith("/isadmin");

  if (isAdminRoute) {
    return <>{children}</>;
  }

  return (
    <>
      <SiteHeader />
      <div className="mt-6">
        <GlobalNotice />
        {children}
      </div>
      <SiteFooter />
    </>
  );
}
