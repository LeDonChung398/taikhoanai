"use client";

import { useEffect, useMemo, useState } from "react";
import { PublicContact, getPublicContacts } from "@/lib/public-api";

function TelegramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6 shrink-0 text-[#229ed9]" aria-hidden="true">
      <path d="m19.7 5.2-2.6 13.1c-.2.9-1.1 1.2-1.8.8l-4.2-3.1-2.1 2.1c-.3.3-.8.2-.9-.3l.6-4.3 8.1-7.3c.3-.3-.1-.8-.5-.5L6.4 12l-4.2-1.4c-.8-.3-.8-1.4 0-1.7l16-6.2c.8-.3 1.6.4 1.4 1.2Z" fill="currentColor" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6 shrink-0 text-[#27a243]" aria-hidden="true">
      <path d="M5 4h4l1.5 4-2 2a13 13 0 0 0 5.5 5.5l2-2L20 15v4c0 1-1 2-2 2C10 21 3 14 3 6c0-1 1-2 2-2Z" fill="none" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 text-[#e09000]" aria-hidden="true">
      <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export default function LienHePage() {
  const [contacts, setContacts] = useState<PublicContact[]>([]);

  useEffect(() => {
    async function load() {
      try {
        setContacts(await getPublicContacts());
      } catch {
        setContacts([]);
      }
    }
    void load();
  }, []);

  const telegram = useMemo(() => contacts.find((c) => c.telegram)?.telegram ?? null, [contacts]);
  const hotline = useMemo(() => contacts.find((c) => c.phone)?.phone ?? null, [contacts]);

  return (
    <main className="site-container py-8 pb-14">
      <div className="mx-auto max-w-[820px]">
        {/* Hero */}
        <div className="mb-6 rounded-2xl bg-gradient-to-r from-[#1f3f8a] to-[#2b5ac8] px-5 py-6 md:px-7 md:py-8">
          <h1 className="text-[22px] font-bold text-white md:text-[26px]">Liên hệ hỗ trợ</h1>
          <p className="mt-2 text-[13px] text-blue-100 md:text-[14px]">
            Đội ngũ TaiKhoanAI hỗ trợ 24/24 — phản hồi nhanh chóng và tận tâm.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {/* Telegram */}
          {telegram && (
            <div className="flex items-start gap-4 rounded-xl border border-[#dbe2ef] bg-white p-5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#e8f4fd]">
                <TelegramIcon />
              </div>
              <div>
                <p className="text-[13px] font-semibold uppercase tracking-wide text-[#60749a]">Telegram</p>
                <p className="mt-0.5 text-[16px] font-bold text-[#1c2e55]">@{telegram}</p>
                <p className="mt-1 text-[13px] text-[#3a4d72]">Phản hồi nhanh nhất qua kênh này</p>
              </div>
            </div>
          )}

          {/* Hotline */}
          {hotline && (
            <div className="flex items-start gap-4 rounded-xl border border-[#dbe2ef] bg-white p-5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#e8f8ee]">
                <PhoneIcon />
              </div>
              <div>
                <p className="text-[13px] font-semibold uppercase tracking-wide text-[#60749a]">Hotline</p>
                <p className="mt-0.5 text-[16px] font-bold text-[#1c2e55]">{hotline}</p>
                <p className="mt-1 text-[13px] text-[#3a4d72]">Gọi hoặc nhắn tin trực tiếp</p>
              </div>
            </div>
          )}

          {/* Thời gian */}
          <div className="flex items-start gap-4 rounded-xl border border-[#dbe2ef] bg-white p-5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#fff8e8]">
              <ClockIcon />
            </div>
            <div>
              <p className="text-[13px] font-semibold uppercase tracking-wide text-[#60749a]">Thời gian hỗ trợ</p>
              <p className="mt-0.5 text-[16px] font-bold text-[#1c2e55]">24/24 — 7 ngày/tuần</p>
              <p className="mt-1 text-[13px] text-[#3a4d72]">Phản hồi mọi lúc, không nghỉ lễ</p>
            </div>
          </div>

          {/* Địa chỉ */}
          <div className="flex items-start gap-4 rounded-xl border border-[#dbe2ef] bg-white p-5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#f0f0ff]">
              <svg viewBox="0 0 24 24" className="h-6 w-6 text-[#5b4fcf]" aria-hidden="true">
                <path d="M12 21s7-6.1 7-11a7 7 0 1 0-14 0c0 4.9 7 11 7 11Z" fill="none" stroke="currentColor" strokeWidth="1.8" />
                <circle cx="12" cy="10" r="2.3" fill="currentColor" />
              </svg>
            </div>
            <div>
              <p className="text-[13px] font-semibold uppercase tracking-wide text-[#60749a]">Địa chỉ</p>
              <p className="mt-0.5 text-[16px] font-bold text-[#1c2e55]">Việt Nam</p>
              <p className="mt-1 text-[13px] text-[#3a4d72]">Hoạt động toàn quốc &amp; quốc tế</p>
            </div>
          </div>
        </div>

        {/* Notice */}
        <div className="mt-6 rounded-xl border border-[#dbe2ef] bg-white px-6 py-5">
          <h2 className="text-[15px] font-bold text-[#1c2e55]">Lưu ý khi liên hệ</h2>
          <ul className="mt-3 space-y-2 text-[14px] leading-6 text-[#3a4d72]">
            <li className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#1f4aab]" />
              Cung cấp <strong>mã đơn hàng</strong> hoặc <strong>username</strong> để được hỗ trợ nhanh hơn.
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#1f4aab]" />
              Nếu nạp tiền quá <strong>10 phút chưa được cộng</strong>, gửi ảnh chụp màn hình giao dịch kèm theo.
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#1f4aab]" />
              Vui lòng <strong className="text-[#c0001e]">không</strong> cung cấp mật khẩu tài khoản cho bất kỳ ai, kể cả nhân viên hỗ trợ.
            </li>
          </ul>
        </div>
      </div>
    </main>
  );
}
