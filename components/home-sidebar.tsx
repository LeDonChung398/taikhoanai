"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AuthUser } from "@/lib/auth";

function toCurrency(amount: number) {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 }).format(amount);
}

interface HomeSidebarProps {
  hotline?: string | null;
  telegram?: string | null;
}

export function HomeSidebar({ hotline, telegram }: HomeSidebarProps) {
  const router = useRouter();
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const raw = localStorage.getItem("authUser");
      if (raw) setAuthUser(JSON.parse(raw) as AuthUser);
    } catch {}
  }, []);

  function handleLogout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("authUser");
    setAuthUser(null);
    router.push("/");
    router.refresh();
  }

  return (
    <div className="lg:sticky lg:top-[80px] rounded-2xl border border-[#dbe2ef] bg-white p-4 shadow-[0_8px_24px_-16px_rgba(15,31,67,0.5)]">
      {mounted && authUser ? (
        <>
          <div className="mb-3">
            <p className="text-[13px] text-[#5f7398] mb-0.5">Số dư hiện tại</p>
            <p className="text-[26px] font-bold text-[#1d3f85] leading-tight">{toCurrency(authUser.balance)}</p>
          </div>
          <button
            onClick={handleLogout}
            className="inline-flex h-[42px] w-full items-center justify-center rounded-xl border border-[#d7e0ef] text-[13px] font-bold text-[#c0001e] hover:bg-[#fff0f0] transition"
          >
            ĐĂNG XUẤT
          </button>
        </>
      ) : (
        <div className="grid gap-2">
          <Link
            href="/account"
            className="inline-flex h-[42px] items-center justify-center gap-2 rounded-xl bg-[#3f5e9f] text-[13px] font-bold text-white transition hover:bg-[#2f4e8f]"
          >
            ĐĂNG NHẬP
          </Link>
          <Link
            href="/account/register"
            className="inline-flex h-[42px] items-center justify-center gap-2 rounded-xl bg-[#ef0030] text-[13px] font-bold text-white transition hover:bg-[#d0002a]"
          >
            ĐĂNG KÝ TÀI KHOẢN
          </Link>
        </div>
      )}

      {(hotline ?? telegram) && (
        <div className="mt-4 rounded-xl border border-[#e3e9f4] bg-[#f8fbff] p-3 text-[13px] text-[#3a4d72] space-y-1">
          {hotline && <p>Hotline: {hotline}</p>}
          {telegram && <p>Telegram: {telegram}</p>}
        </div>
      )}
    </div>
  );
}
