"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { PublicContact, getPublicContacts } from "@/lib/public-api";

function AtIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[22px] w-[22px] shrink-0 text-[#4a6090]" aria-hidden="true">
      <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[22px] w-[22px] shrink-0 text-[#4a6090]" aria-hidden="true">
      <path
        d="M5 4h4l1.5 4-2 2a13 13 0 0 0 5.5 5.5l2-2L20 15v4c0 1-1 2-2 2C10 21 3 14 3 6c0-1 1-2 2-2Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[22px] w-[22px] shrink-0 text-[#4a6090]" aria-hidden="true">
      <path d="M12 21s7-6.1 7-11a7 7 0 1 0-14 0c0 4.9 7 11 7 11Z" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="10" r="2.3" fill="currentColor" />
    </svg>
  );
}

export function SiteFooter() {
  const [contacts, setContacts] = useState<PublicContact[]>([]);

  useEffect(() => {
    async function loadContacts() {
      try {
        setContacts(await getPublicContacts());
      } catch {
        setContacts([]);
      }
    }
    void loadContacts();
  }, []);

  const telegram = useMemo(() => contacts.find((c) => c.telegram)?.telegram ?? null, [contacts]);
  const hotline = useMemo(() => contacts.find((c) => c.phone)?.phone ?? null, [contacts]);

  return (
    <footer className="mt-10 border-t border-[#e3e8f2] bg-[#f9fbff]">
      <div className="mx-auto grid w-full max-w-[1640px] grid-cols-1 gap-6 px-4 py-8 sm:grid-cols-2 md:px-8 lg:grid-cols-12 lg:py-10">
        {/* Brand */}
        <div className="sm:col-span-2 lg:col-span-5">
          <Image src="/logo.png" alt="TaiKhoanAI" width={140} height={140} className="mb-4 h-auto w-[120px] rounded-xl object-contain" />
          <p className="max-w-[480px] text-sm leading-7 text-[#425170]">
            TaiKhoanAI là nền tảng cung cấp tài khoản số uy tín, minh bạch giá và hỗ trợ kỹ thuật xuyên suốt. Chúng tôi ưu tiên quy trình nhanh, rõ ràng và bảo mật thông tin khách hàng.
          </p>
        </div>

        {/* Liên hệ */}
        <div className="lg:col-span-4">
          <h3 className="text-lg font-bold text-[#1d3f85]">Liên hệ</h3>
          <div className="mt-4 space-y-4">
            {telegram && (
              <div className="flex items-center gap-3 text-sm text-[#425170]">
                <AtIcon />
                <span>Telegram: {telegram}</span>
              </div>
            )}
            {hotline && (
              <div className="flex items-center gap-3 text-sm text-[#425170]">
                <PhoneIcon />
                <span>Hotline: {hotline}</span>
              </div>
            )}
            <div className="flex items-center gap-3 text-sm text-[#425170]">
              <PinIcon />
              <span>Việt Nam</span>
            </div>
          </div>
        </div>

        {/* Liên kết */}
        <div className="lg:col-span-3">
          <h3 className="text-lg font-bold text-[#1d3f85]">Liên kết</h3>
          <div className="mt-4 space-y-3 text-sm text-[#425170]">
            <Link href="/chinh-sach" className="block hover:text-[#1f4686]">Chính sách</Link>
            <Link href="/faq" className="block hover:text-[#1f4686]">Câu hỏi thường gặp</Link>
            <Link href="/lien-he" className="block hover:text-[#1f4686]">Liên hệ chúng tôi</Link>
            <Link href="/api-docs" className="block hover:text-[#1f4686]">Tài liệu API</Link>
          </div>
        </div>
      </div>

      <div className="border-t border-[#dde6f3] bg-[#1f3f8a] text-sm text-[#c8d8f5]">
        <div className="mx-auto w-full max-w-[1640px] px-4 py-3 text-center md:px-8">
          © All Copyrights Reserved by TaiKhoanAI | Mua tài khoản số - Shop Tài khoản AI | Software By{" "}
          <span className="font-semibold text-white">CMSNT.CO</span>
        </div>
      </div>
    </footer>
  );
}
