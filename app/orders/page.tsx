"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ApiOrder, getMyOrders } from "@/lib/admin-api";

function toCurrency(amount: number) {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 }).format(amount);
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

function shortId(id: string) {
  return id.slice(0, 8).toUpperCase();
}

const STATUS_MAP: Record<ApiOrder["status"], { label: string; className: string }> = {
  pending: { label: "Chờ xử lý", className: "bg-[#fff8e1] text-[#a07000] border border-[#ffe082]" },
  paid:    { label: "Đã thanh toán", className: "bg-[#e6f4ea] text-[#1e7e34] border border-[#a8d5b0]" },
  cancelled: { label: "Đã huỷ", className: "bg-[#fde8e8] text-[#b00020] border border-[#f5c0c0]" },
};

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      router.push("/account");
      return;
    }
    getMyOrders()
      .then(setOrders)
      .catch((e) => setError(e instanceof Error ? e.message : "Không tải được dữ liệu"))
      .finally(() => setLoading(false));
  }, [router]);

  return (
    <main className="bg-[#f3f5f9] py-6 md:py-10">
      <div className="site-container">
        {/* Header */}
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h1 className="text-[20px] font-bold text-[#1d2e54]">Lịch sử đơn hàng</h1>
            <p className="mt-0.5 text-[13px] text-[#5f7398]">Theo dõi trạng thái các đơn mua hàng của bạn.</p>
          </div>
          <Link
            href="/orders/payments"
            className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-[#d7e0ef] bg-white px-3 text-[13px] font-semibold text-[#3a4d72] transition hover:bg-[#f5f8ff]"
          >
            Biến động số dư →
          </Link>
        </div>

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
          ) : orders.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-[14px] text-[#8091ad]">Bạn chưa có đơn hàng nào.</p>
              <Link href="/" className="mt-3 inline-flex h-9 items-center rounded-xl bg-[#2f4b93] px-4 text-[13px] font-bold text-white hover:bg-[#243c7a]">
                Mua ngay
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-[13px]">
                <thead>
                  <tr className="border-b border-[#edf2f8] bg-[#f8fbff]">
                    <th className="px-4 py-3 text-left font-semibold text-[#5f7398]">STT</th>
                    <th className="px-4 py-3 text-left font-semibold text-[#5f7398]">Mã đơn</th>
                    <th className="px-4 py-3 text-left font-semibold text-[#5f7398]">Sản phẩm</th>
                    <th className="px-4 py-3 text-center font-semibold text-[#5f7398]">SL</th>
                    <th className="px-4 py-3 text-right font-semibold text-[#5f7398]">Đơn giá</th>
                    <th className="px-4 py-3 text-right font-semibold text-[#5f7398]">Tổng tiền</th>
                    <th className="px-4 py-3 text-center font-semibold text-[#5f7398]">Trạng thái</th>
                    <th className="px-4 py-3 text-left font-semibold text-[#5f7398]">Ngày tạo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#edf2f8]">
                  {orders.map((order, idx) => {
                    const item = order.items[0];
                    const badge = STATUS_MAP[order.status] ?? STATUS_MAP.pending;
                    return (
                      <tr key={order.id} className="hover:bg-[#fafbff]">
                        <td className="px-4 py-3 text-[#8091ad]">{idx + 1}</td>
                        <td className="px-4 py-3 font-mono font-bold text-[#2f4b93]">{shortId(order.id)}</td>
                        <td className="px-4 py-3 text-[#1d2e54]">
                          {item?.product?.name ?? `${order.items.length} sản phẩm`}
                        </td>
                        <td className="px-4 py-3 text-center text-[#1d2e54]">{item?.quantity ?? "—"}</td>
                        <td className="px-4 py-3 text-right text-[#5f7398]">{item ? toCurrency(item.unitPrice) : "—"}</td>
                        <td className="px-4 py-3 text-right font-bold text-[#1d2e54]">{toCurrency(order.totalAmount)}</td>
                        <td className="px-4 py-3 text-center">
                          <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-bold ${badge.className}`}>
                            {badge.label}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-[#8091ad]">{formatDate(order.createdAt as unknown as string)}</td>
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
