"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AuthUser } from "@/lib/auth";
import { createOrder } from "@/lib/admin-api";
import { PublicProduct } from "@/lib/public-api";

function toCurrency(amount: number) {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 }).format(amount);
}

function splitLines(text?: string) {
  return (text ?? "").split(/\r?\n/).map((s) => s.trim()).filter(Boolean);
}

function BackIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" aria-hidden="true">
      <path d="M19 12H5M5 12l7 7M5 12l7-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" aria-hidden="true">
      <path d="M3 4h2l2 11h11l2-8H6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="10" cy="19" r="1.6" fill="currentColor" />
      <circle cx="17" cy="19" r="1.6" fill="currentColor" />
    </svg>
  );
}

interface Props {
  product: PublicProduct;
}

export function ProductDetailBuy({ product }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [qty, setQty] = useState(1);
  const [qtyError, setQtyError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<{ qty: number; total: number } | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const successOverlayRef = useRef<HTMLDivElement>(null);

  const total = product.price * qty;
  const highlightLines = splitLines(product.highlight);

  function openModal() {
    setQty(1);
    setQtyError(null);
    setSubmitError(null);
    setOpen(true);
  }

  function handleOverlayClick(e: React.MouseEvent) {
    if (e.target === overlayRef.current) setOpen(false);
  }

  function handleSuccessOverlayClick(e: React.MouseEvent) {
    if (e.target === successOverlayRef.current) setOrderSuccess(null);
  }

  async function handleCheckout() {
    setSubmitError(null);

    if (qty < product.minPurchaseQuantity) {
      setQtyError(`Sá»‘ lÆ°á»£ng tá»‘i thiá»ƒu lĂ  ${product.minPurchaseQuantity}`);
      return;
    }

    const raw = localStorage.getItem("authUser");
    if (!raw) {
      router.push("/account");
      return;
    }

    const authUser = JSON.parse(raw) as AuthUser;

    if (authUser.balance < total) {
      setSubmitError("Sá»‘ dÆ° khĂ´ng Ä‘á»§. Vui lĂ²ng náº¡p thĂªm tiá»n vĂ o tĂ i khoáº£n.");
      return;
    }

    setIsSubmitting(true);
    try {
      const order = await createOrder({ items: [{ productId: product.id, quantity: qty }] });

      const updated: AuthUser = { ...authUser, balance: Math.max(0, authUser.balance - order.totalAmount) };
      localStorage.setItem("authUser", JSON.stringify(updated));
      window.dispatchEvent(new Event("auth-user-updated"));

      setOpen(false);
      setOrderSuccess({ qty, total: order.totalAmount });
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Äáº·t hĂ ng tháº¥t báº¡i. Vui lĂ²ng thá»­ láº¡i.");
    } finally {
      setIsSubmitting(false);
    }
  }

  useEffect(() => {
    const anyOpen = open || orderSuccess !== null;
    document.body.style.overflow = anyOpen ? "hidden" : "";
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
      {/* Back + Buy buttons */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#d7e0ef] bg-white px-4 text-[14px] font-semibold text-[#3a4d72] transition hover:bg-[#f5f8ff]"
        >
          <BackIcon />
          Quay lại
        </button>
        <button
          type="button"
          onClick={openModal}
          disabled={product.stockQuantity === 0}
          className="inline-flex flex-1 h-11 items-center justify-center gap-2 rounded-xl bg-[#2f4b93] text-[14px] font-bold text-white transition hover:bg-[#243c7a] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <CartIcon />
          {product.stockQuantity === 0 ? "Háº¿t hĂ ng" : "MUA NGAY"}
        </button>
      </div>

      {/* â”€â”€ BUY MODAL â”€â”€ */}
      {open && (
        <div
          ref={overlayRef}
          onClick={handleOverlayClick}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 px-3 py-6"
        >
          <div className="relative w-full max-w-[380px] rounded-2xl bg-white shadow-2xl">
            {/* Close */}
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute -right-3 -top-3 z-10 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md text-[#3a4d72] hover:text-[#c0001e]"
              aria-label="ÄĂ³ng"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                <path d="M6 6l12 12M6 18L18 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>

            <div className="px-6 py-6">
              <p className="mb-1 text-center text-[13px] font-bold uppercase tracking-wide text-[#1d2e54]">
                ThĂ´ng tin mua hĂ ng
              </p>
              <p className="mb-4 text-center text-[13px] text-[#5f7398]">{product.name}</p>

              {highlightLines.length > 0 && (
                <div className="mb-4 space-y-1 rounded-lg border border-[#e3e9f4] bg-[#f8fbff] p-3 text-[12px] leading-5 text-[#3a4d72]">
                  {highlightLines.map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>
              )}

              {/* Quantity */}
              <div className="text-[13px] text-[#3a4d72]">Sá»‘ lÆ°á»£ng:</div>
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
                  âˆ’
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
                  <span>ÄÆ¡n giĂ¡:</span>
                  <span className="font-semibold">{toCurrency(product.price)}</span>
                </div>
                <div className="flex items-center justify-between font-bold text-[#1d2e54]">
                  <span>Tá»•ng thanh toĂ¡n:</span>
                  <span className="text-[15px] text-[#2f4b93]">{toCurrency(total)}</span>
                </div>
              </div>

              {submitError && (
                <div className="mt-3 rounded-lg bg-[#fff0f2] border border-[#ffc8d0] px-3 py-2 text-[12px] text-[#c0001e]">
                  {submitError}
                </div>
              )}

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
                  <CartIcon />
                )}
                {isSubmitting ? "Äang xá»­ lĂ½..." : "THANH TOĂN"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* â”€â”€ SUCCESS MODAL â”€â”€ */}
      {orderSuccess && (
        <div
          ref={successOverlayRef}
          onClick={handleSuccessOverlayClick}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 px-3"
        >
          <div className="w-full max-w-[400px] rounded-2xl bg-white p-8 text-center shadow-2xl">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#e6f4ea]">
              <svg viewBox="0 0 24 24" className="h-9 w-9" aria-hidden="true">
                <circle cx="12" cy="12" r="11" fill="#27a243" />
                <path d="m6.5 12.5 3.5 3.5 7-7" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            <h3 className="text-[20px] font-bold text-[#1d2e54]">Äáº·t hĂ ng thĂ nh cĂ´ng!</h3>
            <p className="mt-1 text-[13px] text-[#5f7398]">ÄÆ¡n hĂ ng cá»§a báº¡n Ä‘ang chá» xá»­ lĂ½.</p>

            <div className="mt-5 rounded-xl border border-[#e3e9f4] bg-[#f8fbff] p-4 text-left space-y-2 text-[13px] text-[#3a4d72]">
              <div className="flex justify-between">
                <span>Sáº£n pháº©m:</span>
                <span className="font-semibold text-[#1d2e54] text-right max-w-[200px]">{product.name}</span>
              </div>
              <div className="flex justify-between">
                <span>Sá»‘ lÆ°á»£ng:</span>
                <span className="font-semibold text-[#1d2e54]">{orderSuccess.qty}</span>
              </div>
              <div className="flex justify-between border-t border-[#e3e9f4] pt-2 font-bold">
                <span>ThĂ nh tiá»n:</span>
                <span className="text-[#2f4b93]">{toCurrency(orderSuccess.total)}</span>
              </div>
            </div>

            <div className="mt-5 grid gap-2">
              <Link
                href="/orders"
                className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-[#2f4b93] text-[14px] font-bold text-white transition hover:bg-[#243c7a]"
              >
                Xem lá»‹ch sá»­ Ä‘Æ¡n hĂ ng
              </Link>
              <button
                type="button"
                onClick={() => setOrderSuccess(null)}
                className="inline-flex h-10 w-full items-center justify-center rounded-xl border border-[#d7e0ef] text-[13px] font-semibold text-[#3a4d72] transition hover:bg-[#f5f8ff]"
              >
                Tiáº¿p tá»¥c mua
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
