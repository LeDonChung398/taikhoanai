"use client";

import { useEffect, useMemo, useState } from "react";
import { PublicContact, getPublicContacts } from "@/lib/public-api";

export function GlobalNotice() {
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

  return (
    <section className="site-container mb-6">
      <div className="rounded-2xl border border-[#d9e3f3] bg-white px-5 py-5 text-sm leading-7 text-[#344260] md:px-7 md:text-[15px]">
        <p className="font-semibold text-[#1c2e55]">
          - NẠP TIỀN QUÁ 10 PHÚT KHÔNG ĐƯỢC CỘNG TIỀN, VUI LÒNG LIÊN HỆ ADMIN QUA TELE :{" "}
          {telegram && <span className="text-[#1f4aab]">@{telegram}</span>}
        </p>
        <p className="mt-1.5 font-semibold uppercase text-[#c0001e]">
          NGHIÊM CẤM HÀNH VI MUA TÀI KHOẢN SỬ DỤNG CHO MỤC ĐÍCH MƯỢN TIỀN, LỪA TIỀN. CHÚNG TÔI SẼ KHÔNG CHỊU BẤT KỲ TRÁCH NHIỆM
        </p>

        <h2 className="mt-4 text-[17px] font-bold text-[#1c2e55]">CHẾ ĐỘ BẢO HÀNH</h2>
        <p className="mt-1.5 text-[#344260]">Thông tin bảo hành ở các mục, đọc kĩ trước khi mua</p>
        {telegram && (
          <p className="mt-1.5 font-semibold text-[#1c2e55]">
            MỌI CHI TIẾT , VẤN ĐỀ CẦN HỖ TRỢ LIÊN HỆ QUA TELE :{" "}
            <span className="text-[#1f4aab]">@{telegram}</span>
          </p>
        )}
      </div>
    </section>
  );
}
