"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentAuthUser } from "@/lib/admin-api";

interface AdminAuthGuardProps {
  children: React.ReactNode;
}

export function AdminAuthGuard({ children }: AdminAuthGuardProps) {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const currentUser = getCurrentAuthUser();

    if (!currentUser) {
      router.replace("/account");
      return;
    }

    if (currentUser.role !== "admin") {
      router.replace("/buyer");
      return;
    }

    setAllowed(true);
  }, [router]);

  if (!allowed) {
    return (
      <div className="rounded-2xl border border-[#d7dce7] bg-white p-8 text-center text-sm text-[#5a6783]">
        Checking admin session...
      </div>
    );
  }

  return <>{children}</>;
}
