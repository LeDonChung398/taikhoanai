"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ApiUserTransaction, getMyTransactions } from "@/lib/admin-api";

function toCurrency(amount: number) {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 }).format(amount);
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default function PaymentsPage() {
  const router = useRouter();
  const [transactions, setTransactions] = useState<ApiUserTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      router.push("/account");
      return;
    }
    getMyTransactions()
      .then(setTransactions)
      .catch((e) => setError(e instanceof Error ? e.message : "Không tải được dữ liệu"))
      .finally(() => setLoading(false));
  }, [router]);

  const totalCredit = transactions.filter((t) => t.type === "credit").reduce((s, t) => s + t.amount, 0);
  const totalDebit  = transactions.filter((t) => t.type === "debit").reduce((s, t) => s + t.amount, 0);

  return (
    <main className="bg-[#f3f5f9] py-6 md:py-10">
      <div className="site-container">
        {/* Header */}
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h1 className="text-[20px] font-bold text-[#1d2e54]">Biến động số dư</h1>
            <p className="mt-0.5 text-[13px] text-[#5f7398]">Lịch sử nạp tiền và trừ tiền trong tài khoản.</p>
          </div>
          <Link
            href="/orders"
            className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-[#d7e0ef] bg-white px-3 text-[13px] font-semibold text-[#3a4d72] transition hover:bg-[#f5f8ff]"
          >
            ← Lịch sử đơn hàng
          </Link>
        </div>

        {/* Summary cards */}
        {!loading && !error && (
          <div className="mb-5 grid grid-cols-2 gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-[#dbe2ef] bg-white p-4">
              <p className="text-[12px] font-medium text-[#5f7398]">Tổng nạp</p>
              <p className="mt-1 text-[18px] font-extrabold text-[#27a243]">{toCurrency(totalCredit)}</p>
            </div>
            <div className="rounded-2xl border border-[#dbe2ef] bg-white p-4">
              <p className="text-[12px] font-medium text-[#5f7398]">Tổng chi</p>
              <p className="mt-1 text-[18px] font-extrabold text-[#c0001e]">{toCurrency(totalDebit)}</p>
            </div>
            <div className="rounded-2xl border border-[#dbe2ef] bg-white p-4 col-span-2 sm:col-span-1">
              <p className="text-[12px] font-medium text-[#5f7398]">Số giao dịch</p>
              <p className="mt-1 text-[18px] font-extrabold text-[#2f4b93]">{transactions.length}</p>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="rounded-2xl border border-[#dbe2ef] bg-white shadow-[0_4px_16px_-8px_rgba(15,31,67,0.15)]">
          {loading ? (
            <div className="flex items-center justify-center py-16 text-[14px] text-[#8091ad]">
              <svg className="mr-2 h-5 w-5 animate-spin text-[#2f4b93]" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.2" />
                <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              </svg>
              Đang tải...
            </div>
          ) : error ? (
            <div className="py-16 text-center text-[14px] text-[#c0001e]">{error}</div>
          ) : transactions.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-[14px] text-[#8091ad]">Chưa có giao dịch nào.</p>
              <Link href="/checkout" className="mt-3 inline-flex h-9 items-center rounded-xl bg-[#2f4b93] px-4 text-[13px] font-bold text-white hover:bg-[#243c7a]">
                Nạp tiền ngay
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-[13px]">
                <thead>
                  <tr className="border-b border-[#edf2f8] bg-[#f8fbff]">
                    <th className="px-4 py-3 text-left font-semibold text-[#5f7398]">STT</th>
                    <th className="px-4 py-3 text-left font-semibold text-[#5f7398]">Thời gian</th>
                    <th className="px-4 py-3 text-center font-semibold text-[#5f7398]">Loại</th>
                    <th className="px-4 py-3 text-right font-semibold text-[#5f7398]">Số tiền</th>
                    <th className="px-4 py-3 text-left font-semibold text-[#5f7398]">Lý do</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#edf2f8]">
                  {transactions.map((tx, idx) => {
                    const isCredit = tx.type === "credit";
                    return (
                      <tr key={tx.id} className="hover:bg-[#fafbff]">
                        <td className="px-4 py-3 text-[#8091ad]">{idx + 1}</td>
                        <td className="px-4 py-3 text-[#3a4d72]">{formatDate(tx.createdAt)}</td>
                        <td className="px-4 py-3 text-center">
                          <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                            isCredit
                              ? "bg-[#e6f4ea] text-[#1e7e34] border border-[#a8d5b0]"
                              : "bg-[#fde8e8] text-[#b00020] border border-[#f5c0c0]"
                          }`}>
                            {isCredit ? "Nạp tiền" : "Trừ tiền"}
                          </span>
                        </td>
                        <td className={`px-4 py-3 text-right font-bold ${isCredit ? "text-[#27a243]" : "text-[#c0001e]"}`}>
                          {isCredit ? "+" : "−"}{toCurrency(tx.amount)}
                        </td>
                        <td className="px-4 py-3 text-[#5f7398]">{tx.reason || "—"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
