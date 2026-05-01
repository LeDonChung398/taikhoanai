"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { getPublicContacts, getPublicPaymentInfos, PublicContact, PublicPaymentInfo } from "@/lib/public-api";
import {
  ApiDepositRequest,
  ApiUserTransaction,
  createDepositRequest,
  getMyDepositRequests,
  getMyTransactions
} from "@/lib/admin-api";
import { CopyButton } from "@/components/copy-button";
import { getBankTheme, getDisplayBankName } from "@/lib/bank";

function toCurrency(amount: number) {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 }).format(amount);
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

const QUICK_AMOUNTS = [50_000, 100_000, 200_000, 500_000, 1_000_000, 2_000_000];

const DEPOSIT_STATUS_LABEL: Record<ApiDepositRequest["status"], { label: string; className: string }> = {
  pending: { label: "Chờ duyệt", className: "border border-[#ffe082] bg-[#fff8e1] text-[#a07000]" },
  approved: { label: "Đã duyệt", className: "border border-[#a8d5b0] bg-[#e6f4ea] text-[#1e7e34]" },
  rejected: { label: "Từ chối", className: "border border-[#f5c0c0] bg-[#fde8e8] text-[#b00020]" }
};

export default function CheckoutPage() {
  const router = useRouter();
  const [info, setInfo] = useState<PublicPaymentInfo | null>(null);
  const [contacts, setContacts] = useState<PublicContact[]>([]);

  const [amount, setAmount] = useState("");
  const [amountError, setAmountError] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const amountRef = useRef<HTMLInputElement>(null);

  const [depositRequests, setDepositRequests] = useState<ApiDepositRequest[]>([]);
  const [transactions, setTransactions] = useState<ApiUserTransaction[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [historyError, setHistoryError] = useState<string | null>(null);

  const isLoggedIn = useMemo(() => {
    if (typeof window === "undefined") return false;
    return Boolean(localStorage.getItem("accessToken"));
  }, []);

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      router.replace("/account?redirect=/checkout");
      return;
    }
  }, [router]);

  useEffect(() => {
    Promise.all([getPublicPaymentInfos(), getPublicContacts()])
      .then(([paymentInfos, publicContacts]) => {
        setInfo(paymentInfos[0] ?? null);
        setContacts(publicContacts);
      })
      .catch(() => {
        setInfo(null);
        setContacts([]);
      });
  }, []);

  const telegramContact = useMemo(() => contacts.find((item) => item.telegram)?.telegram ?? null, [contacts]);

  async function loadMyHistory() {
    if (!localStorage.getItem("accessToken")) {
      setDepositRequests([]);
      setTransactions([]);
      setHistoryLoading(false);
      return;
    }

    try {
      setHistoryLoading(true);
      setHistoryError(null);
      const [myRequests, myTransactions] = await Promise.all([getMyDepositRequests(), getMyTransactions()]);
      setDepositRequests(myRequests);
      setTransactions(myTransactions);
    } catch (error) {
      setHistoryError(error instanceof Error ? error.message : "Không tải được lịch sử giao dịch");
    } finally {
      setHistoryLoading(false);
    }
  }

  useEffect(() => {
    void loadMyHistory();
  }, []);

  function handleAmountChange(raw: string) {
    const digits = raw.replace(/\D/g, "");
    setAmount(digits);
    setAmountError(null);
    setSuccessNotice(null);
  }

  async function handleSubmit() {
    const num = Number(amount);

    if (!amount) {
      setAmountError("Vui lòng nhập số tiền nạp (bắt buộc).");
      amountRef.current?.focus();
      return;
    }

    if (num < 10_000) {
      setAmountError("Số tiền tối thiểu là 10.000đ");
      amountRef.current?.focus();
      return;
    }

    const token = localStorage.getItem("accessToken");
    if (!token) {
      router.push("/account");
      return;
    }

    setSubmitting(true);
    setAmountError(null);

    try {
      const bankLabel = getDisplayBankName(info?.bankName ?? "");
      await createDepositRequest({
        amount: num,
        note: `Nạp tiền qua ${bankLabel || "chuyển khoản"}`
      });
      setSuccessNotice(
        telegramContact
          ? `Số tiền sẽ tự động cộng sau ít phút. Nếu quá 10 phút chưa được cộng, vui lòng liên hệ qua telegram: ${telegramContact}.`
          : "Số tiền sẽ tự động cộng sau ít phút. Nếu quá 10 phút chưa được cộng, vui lòng liên hệ qua telegram: contact.telegram."
      );
      setAmount("");
      await loadMyHistory();
    } catch (error) {
      setAmountError(error instanceof Error ? error.message : "Gửi yêu cầu thất bại");
    } finally {
      setSubmitting(false);
    }
  }

  const bankLabel = getDisplayBankName(info?.bankName ?? "");

  return (
    <main className="bg-[#f3f5f9] py-6 md:py-10">
      <div className="site-container space-y-5">
        <div className="grid gap-5 lg:grid-cols-[1fr_400px]">
          <div className="space-y-4">
            <div className="flex items-center gap-3 rounded-2xl bg-[#1d3f85] px-5 py-4">
              <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 text-yellow-300" fill="currentColor" aria-hidden="true">
                <path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zm0 15a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm1-5h-2V7h2v5z" />
              </svg>
              <span className="text-[15px] font-bold uppercase tracking-wide text-white">Lưu ý nạp tiền</span>
            </div>

            <div className="rounded-2xl border border-[#dbe2ef] bg-white p-5">
              <ul className="space-y-3 text-[14px] text-[#3a4d72]">
                <li className="flex items-start gap-2.5">
                  <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#2f4b93] text-[11px] font-bold text-white">1</span>
                  Chuyển khoản đúng số tiền và đúng nội dung chuyển khoản ở khung bên phải.
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#2f4b93] text-[11px] font-bold text-white">2</span>
                  Nhập số tiền nạp (bắt buộc), sau đó bấm <strong>Đã thanh toán</strong>.
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#2f4b93] text-[11px] font-bold text-white">3</span>
                  Số tiền sẽ <strong>tự động cộng</strong>. Nếu quá 10 phút chưa được cộng, vui lòng liên hệ qua telegram:{" "}
                  <strong>{telegramContact ?? "contact.telegram"}</strong>.
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-[#dbe2ef] bg-white p-5">
              <label className="mb-1 block text-[13px] font-bold text-[#1d2e54]">
                Số tiền đã nạp <span className="text-[#c0001e]">*</span>
              </label>
              <p className="mb-3 text-[12px] text-[#8091ad]">Bắt buộc nhập. Tối thiểu 10.000đ</p>

              <div className="mb-3 flex flex-wrap gap-2">
                {QUICK_AMOUNTS.map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => {
                      setAmount(String(v));
                      setAmountError(null);
                      setSuccessNotice(null);
                    }}
                    className={`rounded-lg border px-3 py-1.5 text-[12px] font-semibold transition ${
                      amount === String(v)
                        ? "border-[#2f4b93] bg-[#2f4b93] text-white"
                        : "border-[#d5dae5] bg-[#f7f8fb] text-[#3a4d72] hover:border-[#2f4b93] hover:text-[#2f4b93]"
                    }`}
                  >
                    {toCurrency(v)}
                  </button>
                ))}
              </div>

              <div className="relative">
                <input
                  ref={amountRef}
                  type="text"
                  inputMode="numeric"
                  placeholder="Nhập số tiền..."
                  value={amount ? Number(amount).toLocaleString("vi-VN") : ""}
                  onChange={(e) => handleAmountChange(e.target.value)}
                  className={`h-11 w-full rounded-xl border bg-white px-4 pr-10 text-[15px] font-bold text-[#1d2e54] outline-none focus:border-[#4f68ab] ${
                    amountError ? "border-[#c0001e]" : "border-[#d5dae5]"
                  }`}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[13px] font-semibold text-[#8091ad]">đ</span>
              </div>

              {amountError ? <p className="mt-1.5 text-[12px] text-[#c0001e]">{amountError}</p> : null}
              {successNotice ? <p className="mt-1.5 text-[12px] text-[#1f6f45]">{successNotice}</p> : null}

              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="mt-4 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#2f4b93] text-[15px] font-bold text-white transition hover:bg-[#243c7a] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? (
                  <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.3" />
                    <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
                    <path d="M5 12l5 5L20 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
                {submitting ? "Đang gửi..." : "Đã thanh toán"}
              </button>
            </div>
          </div>

          {info ? (
            <aside className="rounded-2xl border border-[#dbe2ef] bg-white p-5 shadow-[0_8px_24px_-16px_rgba(15,31,67,0.4)]">
              {(() => {
                const { bg, text } = getBankTheme(info.bankName);
                return (
                  <div className="mb-4 flex justify-center">
                    <div
                      className="rounded-xl px-5 py-2 text-[15px] font-extrabold uppercase tracking-wider shadow-sm"
                      style={{ backgroundColor: bg, color: text }}
                    >
                      {bankLabel}
                    </div>
                  </div>
                );
              })()}

              {info.qrImageUrl ? (
                <div className="flex justify-center">
                  <div className="overflow-hidden rounded-xl border border-[#e3e9f4] p-2">
                    <Image
                      src={info.qrImageUrl}
                      alt={`QR nạp tiền ${bankLabel}`}
                      width={220}
                      height={220}
                      unoptimized
                      className="h-[220px] w-[220px] object-contain"
                    />
                  </div>
                </div>
              ) : (
                <div className="flex h-[220px] items-center justify-center rounded-xl border border-dashed border-[#d0d8ee] text-[13px] text-[#8091ad]">
                  Chưa có mã QR
                </div>
              )}

              <div className="mt-5 space-y-2.5 rounded-xl border border-[#e3e9f4] bg-[#f8fbff] p-4 text-[13px]">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[#5f7398]">Số tài khoản:</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-[#1d6f42]">{info.accountNumber}</span>
                    <CopyButton value={info.accountNumber} />
                  </div>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[#5f7398]">Nội dung CK:</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-[#c0001e]">{info.transferContent}</span>
                    <CopyButton value={info.transferContent} />
                  </div>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[#5f7398]">Chủ tài khoản:</span>
                  <span className="font-bold text-[#1d2e54]">{info.accountHolder}</span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[#5f7398]">Ngân hàng:</span>
                  <span className="font-bold text-[#1d2e54]">{bankLabel}</span>
                </div>
              </div>

              <p className="mt-3 text-center text-[12px] text-[#2f4b93]">Nhập đúng nội dung chuyển khoản để hệ thống xác nhận nhanh hơn.</p>
              {info.note ? <p className="mt-1 text-center text-[12px] text-[#8091ad]">{info.note}</p> : null}
            </aside>
          ) : (
            <aside className="flex items-center justify-center rounded-2xl border border-[#dbe2ef] bg-white p-10 text-[14px] text-[#8091ad]">
              Chưa có thông tin thanh toán. Vui lòng liên hệ Admin.
            </aside>
          )}
        </div>

        <section className="rounded-2xl border border-[#dbe2ef] bg-white p-5 shadow-[0_4px_16px_-8px_rgba(15,31,67,0.15)]">
          <div className="mb-3 flex items-center justify-between gap-2">
            <h2 className="text-[18px] font-bold text-[#1d2e54]">Lịch sử yêu cầu nạp tiền</h2>
            {isLoggedIn ? null : (
              <button
                type="button"
                onClick={() => router.push("/account")}
                className="rounded-lg border border-[#d7e0ef] px-3 py-1.5 text-[12px] font-semibold text-[#2f4b93]"
              >
                Đăng nhập để xem
              </button>
            )}
          </div>

          {historyLoading ? (
            <p className="py-8 text-sm text-[#8091ad]">Đang tải lịch sử...</p>
          ) : historyError ? (
            <p className="py-8 text-sm text-[#c0001e]">{historyError}</p>
          ) : depositRequests.length === 0 ? (
            <p className="py-8 text-sm text-[#8091ad]">Bạn chưa có yêu cầu nạp tiền nào.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-[13px]">
                <thead>
                  <tr className="border-b border-[#edf2f8] bg-[#f8fbff]">
                    <th className="px-4 py-3 text-left font-semibold text-[#5f7398]">Thời gian</th>
                    <th className="px-4 py-3 text-right font-semibold text-[#5f7398]">Số tiền</th>
                    <th className="px-4 py-3 text-center font-semibold text-[#5f7398]">Trạng thái</th>
                    <th className="px-4 py-3 text-left font-semibold text-[#5f7398]">Ghi chú</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#edf2f8]">
                  {depositRequests.map((item) => {
                    const badge = DEPOSIT_STATUS_LABEL[item.status];
                    return (
                      <tr key={item.id}>
                        <td className="px-4 py-3 text-[#3a4d72]">{formatDate(item.createdAt)}</td>
                        <td className="px-4 py-3 text-right font-bold text-[#1d2e54]">{toCurrency(item.amount)}</td>
                        <td className="px-4 py-3 text-center">
                          <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-bold ${badge.className}`}>{badge.label}</span>
                        </td>
                        <td className="px-4 py-3 text-[#5f7398]">{item.note?.trim() || "-"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-[#dbe2ef] bg-white p-5 shadow-[0_4px_16px_-8px_rgba(15,31,67,0.15)]">
          <h2 className="mb-3 text-[18px] font-bold text-[#1d2e54]">Biến động số dư (transaction)</h2>

          {historyLoading ? (
            <p className="py-8 text-sm text-[#8091ad]">Đang tải giao dịch...</p>
          ) : historyError ? (
            <p className="py-8 text-sm text-[#c0001e]">{historyError}</p>
          ) : transactions.length === 0 ? (
            <p className="py-8 text-sm text-[#8091ad]">Chưa có transaction nào.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-[13px]">
                <thead>
                  <tr className="border-b border-[#edf2f8] bg-[#f8fbff]">
                    <th className="px-4 py-3 text-left font-semibold text-[#5f7398]">Thời gian</th>
                    <th className="px-4 py-3 text-center font-semibold text-[#5f7398]">Loại</th>
                    <th className="px-4 py-3 text-right font-semibold text-[#5f7398]">Số tiền</th>
                    <th className="px-4 py-3 text-left font-semibold text-[#5f7398]">Lý do</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#edf2f8]">
                  {transactions.map((tx) => {
                    const isCredit = tx.type === "credit";
                    return (
                      <tr key={tx.id}>
                        <td className="px-4 py-3 text-[#3a4d72]">{formatDate(tx.createdAt)}</td>
                        <td className="px-4 py-3 text-center">
                          <span
                            className={`inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${
                              isCredit
                                ? "border-[#a8d5b0] bg-[#e6f4ea] text-[#1e7e34]"
                                : "border-[#f5c0c0] bg-[#fde8e8] text-[#b00020]"
                            }`}
                          >
                            {isCredit ? "Nạp vào" : "Trừ ra"}
                          </span>
                        </td>
                        <td className={`px-4 py-3 text-right font-bold ${isCredit ? "text-[#27a243]" : "text-[#c0001e]"}`}>
                          {isCredit ? "+" : "-"}
                          {toCurrency(tx.amount)}
                        </td>
                        <td className="px-4 py-3 text-[#5f7398]">{tx.reason?.trim() || "-"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
