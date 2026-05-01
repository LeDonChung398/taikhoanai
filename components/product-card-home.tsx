"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AuthUser } from "@/lib/auth";
import { createOrder } from "@/lib/admin-api";
import { PublicCategory, PublicCountry, PublicProduct } from "@/lib/public-api";

function toCurrency(amount: number) {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 }).format(amount);
}

function splitLines(text?: string) {
  return (text ?? "").split(/\r?\n/).map((s) => s.trim()).filter(Boolean);
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" className="mt-[1px] h-[14px] w-[14px] shrink-0" aria-hidden="true">
      <circle cx="12" cy="12" r="11" fill="#27a243" />
      <path d="m7.2 12.4 3 2.9 6-6.3" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" aria-hidden="true">
      <circle cx="12" cy="12" r="11" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 8v.5M12 11v5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function CountryFlag({ country }: { country?: PublicCountry }) {
  if (!country) return <span className="text-[12px] font-semibold text-[#2f3f5d]">-</span>;
  if (country.imgUrl) {
    return <Image src={country.imgUrl} alt={country.name} width={28} height={20} unoptimized className="mt-0.5 h-5 w-7 rounded object-cover shadow-sm" />;
  }
  return <span className="mt-0.5 inline-block text-[12px] font-semibold text-[#2f3f5d]">{country.name}</span>;
}

interface Props {
  product: PublicProduct;
  category: PublicCategory;
  features: string[];
}

export function ProductCardHome({ product, category, features }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [qty, setQty] = useState(1);
  const [qtyError, setQtyError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<{ productName: string; qty: number; total: number } | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const successOverlayRef = useRef<HTMLDivElement>(null);

  const total = product.price * qty;
  const noteLines = splitLines(product.note);
  const highlightLines = splitLines(product.highlight);

  function openBuyModal() {
    setQty(1);
    setQtyError(null);
    setSubmitError(null);
    setOpen(true);
  }

  function closeBuyModal() {
    setOpen(false);
  }

  function handleOverlayClick(e: React.MouseEvent) {
    if (e.target === overlayRef.current) closeBuyModal();
  }

  function handleSuccessOverlayClick(e: React.MouseEvent) {
    if (e.target === successOverlayRef.current) setOrderSuccess(null);
  }

  async function handleCheckout() {
    setSubmitError(null);

    if (qty < product.minPurchaseQuantity) {
      setQtyError(`Số lượng tối thiểu là ${product.minPurchaseQuantity}`);
      return;
    }

    const raw = localStorage.getItem("authUser");
    if (!raw) {
      router.push("/account");
      return;
    }

    const authUser = JSON.parse(raw) as AuthUser;

    if (authUser.balance < total) {
      setSubmitError("Số dư không đủ. Vui lòng nạp thêm tiền vào tài khoản.");
      return;
    }

    setIsSubmitting(true);
    try {
      await createOrder({ items: [{ productId: product.id, quantity: qty }] });

      const updated: AuthUser = { ...authUser, balance: authUser.balance - total };
      localStorage.setItem("authUser", JSON.stringify(updated));

      closeBuyModal();
      setOrderSuccess({ productName: product.name, qty, total });
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Đặt hàng thất bại. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  }

  useEffect(() => {
    const isAnyModalOpen = open || orderSuccess !== null;
    document.body.style.overflow = isAnyModalOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open, orderSuccess]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        if (orderSuccess) setOrderSuccess(null);
        else setOpen(false);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [orderSuccess]);

  return (
    <>
      {/* ── CARD ── */}
      <article className="overflow-hidden rounded-xl border border-[#dbe2ef] bg-white shadow-[0_4px_16px_-8px_rgba(15,31,67,0.4)]">
        <header className="grid grid-cols-[auto_1fr] items-center gap-2.5 border-b border-[#edf2f8] px-3 py-2.5">
          {category.imageUrl ? (
            <Image src={category.imageUrl} alt={category.name} width={36} height={36} unoptimized className="h-9 w-9 rounded-lg object-cover" />
          ) : (
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[#2f4b93] text-sm font-bold text-white">
              {category.name.charAt(0).toUpperCase()}
            </span>
          )}
          <h3 className="text-[14px] font-bold leading-snug text-[#1d2e54]">{product.name}</h3>
        </header>

        <ul className="min-h-[100px] space-y-1 px-3 py-2.5 text-[13px] text-[#33486a]">
          {features.map((f) => (
            <li key={f} className="flex items-start gap-1.5">
              <CheckIcon />
              <span className="leading-snug">{f}</span>
            </li>
          ))}
        </ul>

        <div className="grid grid-cols-3 items-center border-y border-[#dbe2ef] bg-[#f8faff] px-2 py-2 text-center">
          <div className="flex flex-col items-center">
            <p className="text-[11px] font-medium text-[#60749a]">Quốc gia</p>
            <div className="mt-1 flex items-center justify-center">
              <CountryFlag country={product.country} />
            </div>
          </div>
          <div className="flex flex-col items-center border-x border-[#dbe2ef]">
            <p className="text-[11px] font-medium text-[#60749a]">Hiện có</p>
            <span className="mt-1 inline-flex h-6 min-w-[24px] items-center justify-center rounded-full bg-[#1f4aab] px-2 text-[12px] font-bold text-white">
              {product.stockQuantity}
            </span>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-[11px] font-medium text-[#60749a]">Giá bán</p>
            <p className="mt-0.5 text-[16px] font-extrabold leading-none text-[#e09000]">{toCurrency(product.price)}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 px-3 py-2.5">
          <a
            href={`/products/${product.slug}`}
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-[#b7c5e2] bg-white text-[12px] font-bold text-[#2f4b93] transition hover:bg-[#f0f4ff]"
          >
            <InfoIcon />
            CHI TIẾT
          </a>
          <button
            type="button"
            onClick={openBuyModal}
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-[#2f4b93] text-[12px] font-bold text-white transition hover:bg-[#243c7a]"
          >
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 shrink-0" aria-hidden="true">
              <path d="M3 4h2l2 11h11l2-8H6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <circle cx="10" cy="19" r="1.6" fill="currentColor" />
              <circle cx="17" cy="19" r="1.6" fill="currentColor" />
            </svg>
            MUA NGAY
          </button>
        </div>
      </article>

      {/* ── BUY MODAL ── */}
      {open && (
        <div
          ref={overlayRef}
          onClick={handleOverlayClick}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 px-3 py-6"
        >
          <div className="relative flex max-h-[90vh] w-full max-w-[760px] flex-col overflow-y-auto rounded-2xl bg-white shadow-2xl md:flex-row md:overflow-visible">
            {/* Close */}
            <button
              type="button"
              onClick={closeBuyModal}
              className="absolute -right-3 -top-3 z-10 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md text-[#3a4d72] hover:text-[#c0001e]"
              aria-label="Đóng"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                <path d="M6 6l12 12M6 18L18 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>

            {/* LEFT: product info */}
            <div className="flex-1 px-5 py-5 md:px-6 md:py-6">
              <h2 className="text-[17px] font-bold leading-snug text-[#1d2e54]">{product.name}</h2>

              <div className="mt-3 flex flex-wrap gap-2">
                <span className="rounded-md bg-[#e6f4ea] px-2.5 py-0.5 text-[12px] font-bold text-[#27a243]">
                  KHO HÀNG: {product.stockQuantity}
                </span>
                <span className="rounded-md bg-[#e8efff] px-2.5 py-0.5 text-[12px] font-bold text-[#2f4b93]">
                  ĐÃ BÁN: {product.soldQuantity}
                </span>
              </div>

              <p className="mt-3 text-[22px] font-extrabold text-[#e09000]">{toCurrency(product.price)}</p>

              {highlightLines.length > 0 && (
                <div className="mt-4 space-y-1 rounded-lg border border-[#e3e9f4] bg-[#f8fbff] p-3 text-[12px] leading-5 text-[#3a4d72]">
                  {highlightLines.map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>
              )}

              {noteLines.length > 0 && (
                <div className="mt-4 space-y-1 border-t border-[#edf2f8] pt-4 text-[13px] leading-6 text-[#3a4d72]">
                  {noteLines.map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>
              )}
            </div>

            {/* RIGHT: order form */}
            <div className="border-t border-[#edf2f8] md:border-l md:border-t-0 md:w-[260px] md:shrink-0">
              <div className="px-5 py-5 md:px-6 md:py-6">
                <p className="mb-4 text-center text-[13px] font-bold uppercase tracking-wide text-[#1d2e54]">
                  Thông tin mua hàng
                </p>

                {/* Quantity */}
                <div className="text-[13px] text-[#3a4d72]">
                  <span>Số lượng:</span>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const next = Math.max(1, qty - 1);
                      setQty(next);
                      if (next >= product.minPurchaseQuantity) setQtyError(null);
                    }}
                    className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#d5dae5] bg-[#f7f8fb] text-lg font-bold text-[#2f4b93] hover:bg-[#e8efff]"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    min={1}
                    max={product.stockQuantity}
                    value={qty}
                    onChange={(e) => {
                      const v = Math.max(1, Math.min(product.stockQuantity, Number(e.target.value) || 1));
                      setQty(v);
                      if (v >= product.minPurchaseQuantity) setQtyError(null);
                    }}
                    className={`h-9 flex-1 rounded-lg border bg-white text-center text-[15px] font-bold text-[#1d2e54] outline-none focus:border-[#4f68ab] ${qtyError ? "border-[#c0001e]" : "border-[#d5dae5]"}`}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const next = Math.min(product.stockQuantity, qty + 1);
                      setQty(next);
                      if (next >= product.minPurchaseQuantity) setQtyError(null);
                    }}
                    className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#d5dae5] bg-[#f7f8fb] text-lg font-bold text-[#2f4b93] hover:bg-[#e8efff]"
                  >
                    +
                  </button>
                </div>
                {qtyError && (
                  <p className="mt-1.5 text-[12px] text-[#c0001e]">{qtyError}</p>
                )}

                {/* Totals */}
                <div className="mt-4 space-y-2 border-t border-[#edf2f8] pt-4 text-[13px]">
                  <div className="flex items-center justify-between text-[#3a4d72]">
                    <span>Thành tiền:</span>
                    <span className="font-semibold">{toCurrency(total)}</span>
                  </div>
                  <div className="flex items-center justify-between font-bold text-[#1d2e54]">
                    <span>Tổng thanh toán:</span>
                    <span className="text-[15px] text-[#2f4b93]">{toCurrency(total)}</span>
                  </div>
                </div>

                {/* Submit error */}
                {submitError && (
                  <div className="mt-3 rounded-lg bg-[#fff0f2] border border-[#ffc8d0] px-3 py-2 text-[12px] text-[#c0001e]">
                    {submitError}
                  </div>
                )}

                {/* CTA */}
                <button
                  type="button"
                  onClick={handleCheckout}
                  disabled={isSubmitting}
                  className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#2f4b93] text-[14px] font-bold text-white transition hover:bg-[#243c7a] disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.3" />
                      <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" aria-hidden="true">
                      <path d="M3 4h2l2 11h11l2-8H6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      <circle cx="10" cy="19" r="1.6" fill="currentColor" />
                      <circle cx="17" cy="19" r="1.6" fill="currentColor" />
                    </svg>
                  )}
                  {isSubmitting ? "Đang xử lý..." : "THANH TOÁN"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── SUCCESS MODAL ── */}
      {orderSuccess && (
        <div
          ref={successOverlayRef}
          onClick={handleSuccessOverlayClick}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 px-3"
        >
          <div className="w-full max-w-[400px] rounded-2xl bg-white p-8 text-center shadow-2xl">
            {/* Icon */}
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#e6f4ea]">
              <svg viewBox="0 0 24 24" className="h-9 w-9" aria-hidden="true">
                <circle cx="12" cy="12" r="11" fill="#27a243" />
                <path d="m6.5 12.5 3.5 3.5 7-7" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            <h3 className="text-[20px] font-bold text-[#1d2e54]">Đặt hàng thành công!</h3>
            <p className="mt-1 text-[13px] text-[#5f7398]">Đơn hàng của bạn đang chờ xử lý.</p>

            {/* Order summary */}
            <div className="mt-5 rounded-xl border border-[#e3e9f4] bg-[#f8fbff] p-4 text-left space-y-2 text-[13px] text-[#3a4d72]">
              <div className="flex justify-between">
                <span>Sản phẩm:</span>
                <span className="font-semibold text-[#1d2e54] text-right max-w-[180px]">{orderSuccess.productName}</span>
              </div>
              <div className="flex justify-between">
                <span>Số lượng:</span>
                <span className="font-semibold text-[#1d2e54]">{orderSuccess.qty}</span>
              </div>
              <div className="flex justify-between border-t border-[#e3e9f4] pt-2 font-bold">
                <span>Thành tiền:</span>
                <span className="text-[#2f4b93]">{toCurrency(orderSuccess.total)}</span>
              </div>
            </div>

            <div className="mt-5 grid gap-2">
              <Link
                href="/orders"
                className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-[#2f4b93] text-[14px] font-bold text-white transition hover:bg-[#243c7a]"
              >
                Xem lịch sử đơn hàng
              </Link>
              <button
                type="button"
                onClick={() => setOrderSuccess(null)}
                className="inline-flex h-10 w-full items-center justify-center rounded-xl border border-[#d7e0ef] text-[13px] font-semibold text-[#3a4d72] transition hover:bg-[#f5f8ff]"
              >
                Tiếp tục mua
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
