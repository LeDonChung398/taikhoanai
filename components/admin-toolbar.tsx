"use client";

import { useRouter } from "next/navigation";
import { getCurrentAuthUser } from "@/lib/admin-api";

export function AdminToolbar() {
  const router = useRouter();
  const currentUser = getCurrentAuthUser();

  function handleLogout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("authUser");
    router.replace("/account");
  }

  return (
    <div className="flex items-center gap-2">
      {currentUser ? (
        <span className="rounded-full border border-[#d6deee] bg-[#f6f9ff] px-3 py-1 text-xs font-semibold text-[#315181]">
          {currentUser.username}
        </span>
      ) : null}
      <button type="button" onClick={handleLogout} className="admin-btn-secondary h-8 rounded-full px-3 text-xs">
        Đăng xuất
      </button>
    </div>
  );
}
