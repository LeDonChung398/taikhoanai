"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { AuthUser } from "@/lib/auth";
import { PublicCategory, PublicContact, getPublicCategories, getPublicContacts } from "@/lib/public-api";

function toCurrency(amount: number) {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 }).format(amount);
}

interface NavChildItem {
  href: string;
  label: string;
  iconUrl?: string;
}

interface NavItem {
  href: string;
  label: string;
  children?: NavChildItem[];
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" aria-hidden="true">
      <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="m20 20-4-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" aria-hidden="true">
      <path d="M3 4h2l2 11h11l2-8H6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="10" cy="19" r="1.6" fill="currentColor" />
      <circle cx="17" cy="19" r="1.6" fill="currentColor" />
    </svg>
  );
}

function ChevronDownIcon({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={`${className} shrink-0`} aria-hidden="true">
      <path d="m6 9 6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px] shrink-0" aria-hidden="true">
      <path d="M5 4h4l1.5 4-2 2a13 13 0 0 0 5.5 5.5l2-2L20 15v4c0 1-1 2-2 2C10 21 3 14 3 6c0-1 1-2 2-2Z" fill="none" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function TelegramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px] shrink-0" aria-hidden="true">
      <path d="m19.7 5.2-2.6 13.1c-.2.9-1.1 1.2-1.8.8l-4.2-3.1-2.1 2.1c-.3.3-.8.2-.9-.3l.6-4.3 8.1-7.3c.3-.3-.1-.8-.5-.5L6.4 12l-4.2-1.4c-.8-.3-.8-1.4 0-1.7l16-6.2c.8-.3 1.6.4 1.4 1.2Z" fill="currentColor" />
    </svg>
  );
}

function HamburgerIcon({ open }: { open: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
      {open ? (
        <path d="M6 6l12 12M6 18L18 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      ) : (
        <>
          <path d="M4 6h16M4 12h16M4 18h16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </>
      )}
    </svg>
  );
}

function ProductMegaMenu({ items }: { items: NavChildItem[] }) {
  return (
    <div className="invisible absolute left-0 top-[calc(100%+10px)] z-50 w-[min(780px,calc(100vw-2rem))] translate-y-2 rounded-2xl border border-[#e4e9f2] bg-white p-0 opacity-0 shadow-[0_18px_30px_-22px_rgba(25,36,58,0.9)] transition-all group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
      <div className="grid grid-cols-1 divide-y divide-[#edf2fa] md:grid-cols-3 md:divide-x md:divide-y-0">
        {items.map((item) => (
          <Link key={item.href} href={item.href} className="flex items-center gap-3 px-5 py-4 text-sm font-semibold uppercase tracking-[0.02em] text-[#3a4a67] hover:bg-[#f5f8ff] hover:text-[#1f4686]">
            {item.iconUrl ? (
              <Image src={item.iconUrl} alt={item.label} width={36} height={36} unoptimized className="h-9 w-9 rounded-lg object-cover" />
            ) : (
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[#e8efff] text-sm font-bold text-[#1f4686]">
                {item.label.charAt(0).toUpperCase()}
              </span>
            )}
            <span>{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function SiteHeader() {
  const router = useRouter();
  const [contacts, setContacts] = useState<PublicContact[]>([]);
  const [categories, setCategories] = useState<PublicCategory[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    async function loadHeaderData() {
      try {
        const [apiContacts, apiCategories] = await Promise.all([getPublicContacts(), getPublicCategories()]);
        setContacts(apiContacts);
        setCategories(apiCategories);
      } catch {
        setContacts([]);
        setCategories([]);
      }
    }

    function syncAuthUser() {
      try {
        const raw = localStorage.getItem("authUser");
        setAuthUser(raw ? (JSON.parse(raw) as AuthUser) : null);
      } catch {
        setAuthUser(null);
      }
    }

    void loadHeaderData();
    syncAuthUser();

    window.addEventListener("storage", syncAuthUser);
    window.addEventListener("auth-user-updated", syncAuthUser);
    return () => {
      window.removeEventListener("storage", syncAuthUser);
      window.removeEventListener("auth-user-updated", syncAuthUser);
    };
  }, []);

  function handleLogout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("authUser");
    setAuthUser(null);
    router.push("/");
  }

  useEffect(() => {
    function onResize() {
      if (window.innerWidth >= 1024) setMenuOpen(false);
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const hotline = useMemo(() => contacts.find((c) => c.phone)?.phone ?? null, [contacts]);
  const telegram = useMemo(() => contacts.find((c) => c.telegram)?.telegram ?? null, [contacts]);

  const menuLinks: NavItem[] = [
    { href: "/", label: "Trang chủ" },
    {
      href: "/#danh-muc",
      label: "Sản phẩm",
      children: categories.length > 0
        ? categories.map((cat) => ({ href: `/#danh-muc-${cat.slug}`, label: cat.name, iconUrl: cat.imageUrl }))
        : [{ href: "/#danh-muc", label: "Tất cả sản phẩm" }]
    },
    {
      href: "/checkout",
      label: "Nạp tiền"
    },
    {
      href: "/orders",
      label: "Lịch sử",
      children: [
        { href: "/orders", label: "Lịch sử mua hàng" },
        { href: "/orders/payments", label: "Lịch sử nạp tiền" }
      ]
    },
  ];

  return (
    <header className="text-[#1d2d4f]">
      {/* STICKY: top bar + logo/search */}
      <div className="sticky top-0 z-[90] border-b border-[#dbe2ef] bg-white shadow-[0_6px_20px_-12px_rgba(20,38,80,0.45)]">
        {/* Top gradient bar — hidden on mobile */}
        <div className="hidden bg-gradient-to-r from-[#1f3f8a] via-[#2b5ac8] to-[#1f3f8a] text-white sm:block">
          <div className="site-container flex items-center justify-between gap-2 py-1.5">
            <p className="text-xs font-medium">Chào mừng bạn đến với TaiKhoanAI – Shop Tài khoản số uy tín hàng đầu</p>
            <div className="flex gap-4 text-xs">
              <Link href="/chinh-sach" className="hover:underline">Chính sách</Link>
              <Link href="/faq" className="hover:underline">FAQ</Link>
              <Link href="/lien-he" className="hover:underline">Liên hệ</Link>
            </div>
          </div>
        </div>

        {/* Logo + search + actions */}
        <div className="bg-white/95 backdrop-blur">
          <div className="site-container flex items-center gap-3 py-3">
            {/* Logo */}
            <Link href="/" className="flex shrink-0 items-center gap-2" aria-label="Trang chủ TaiKhoanAI">
              <Image src="/logo.png" alt="TaiKhoanAI" width={44} height={44} className="h-10 w-10 rounded-xl object-cover" priority />
              <div className="hidden sm:block">
                <p className="text-base font-semibold leading-tight text-[#1d3f85]">TaiKhoanAI</p>
                <p className="text-[11px] text-[#5f7398]">Tài khoản số cho công việc</p>
              </div>
            </Link>

            {/* Search */}
            <form action="/products" method="get" className="flex flex-1 overflow-hidden rounded-xl border border-[#c9d5ea] bg-[#f7faff]">
              <input
                name="q"
                type="search"
                placeholder="Tìm sản phẩm..."
                className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-sm outline-none placeholder:text-[#8091ad]"
              />
              <button type="submit" className="px-3 text-[#3c5485]" aria-label="Tìm kiếm">
                <SearchIcon />
              </button>
            </form>

            {/* Actions */}
            <div className="flex shrink-0 items-center gap-2">
              <button type="button" className="relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#d7e0ef] bg-white text-[#47618f]" aria-label="Giỏ hàng">
                <CartIcon />
                <span className="absolute -right-0.5 -top-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-[#1f4686] px-0.5 text-[10px] font-bold text-white">0</span>
              </button>
              {authUser ? (
                <div className="relative hidden sm:flex">
                  <button
                    type="button"
                    onClick={() => setDropdownOpen((v) => !v)}
                    className="flex items-center gap-2 rounded-xl border border-[#c5d1ea] bg-white px-3 py-1.5 hover:border-[#a8bde0]"
                  >
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#1d4fba] text-xs font-bold text-white">
                      {authUser.username.charAt(0).toUpperCase()}
                    </span>
                    <div className="leading-tight text-left">
                      <p className="text-[13px] font-bold text-[#1d3f85]">{authUser.username}</p>
                      <p className="text-[11px] text-[#e09000] font-semibold">{toCurrency(authUser.balance)}</p>
                    </div>
                    <ChevronDownIcon className={`h-3.5 w-3.5 text-[#6b80aa] transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
                  </button>

                  {dropdownOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
                      <div className="absolute right-0 top-[calc(100%+8px)] z-50 w-44 rounded-xl border border-[#e4e9f2] bg-white py-1.5 shadow-[0_12px_28px_-16px_rgba(25,36,58,0.8)]">
                        <Link
                          href="/account/change-password"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-[#2f4268] hover:bg-[#f5f8ff]"
                        >
                          <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="11" width="18" height="11" rx="2" />
                            <path d="M7 11V7a5 5 0 0 1 10 0v4" strokeLinecap="round" />
                          </svg>
                          Đổi mật khẩu
                        </Link>
                        <div className="my-1 border-t border-[#edf2fa]" />
                        <button
                          onClick={() => { setDropdownOpen(false); handleLogout(); }}
                          className="flex w-full items-center gap-2.5 px-4 py-2.5 text-[13px] text-[#c0001e] hover:bg-[#fff5f5]"
                        >
                          <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          Đăng xuất
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <Link href="/account" className="hidden items-center gap-1.5 rounded-xl border border-[#c5d1ea] bg-white px-3 py-2 text-sm font-semibold text-[#1f4686] sm:inline-flex">
                  <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" aria-hidden="true">
                    <circle cx="12" cy="7" r="4" fill="none" stroke="currentColor" strokeWidth="2" />
                    <path d="M5 21c0-3.3 3.1-6 7-6s7 2.7 7 6" fill="none" stroke="currentColor" strokeWidth="2" />
                  </svg>
                  Đăng nhập
                </Link>
              )}
              {/* Hamburger — mobile only */}
              <button
                type="button"
                onClick={() => setMenuOpen((v) => !v)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[#d7e0ef] bg-white text-[#2e4267] lg:hidden"
                aria-label="Menu"
              >
                <HamburgerIcon open={menuOpen} />
              </button>
            </div>
          </div>
        </div>

        {/* MOBILE DRAWER */}
        {menuOpen && (
          <div className="border-t border-[#e6ebf5] bg-white lg:hidden">
            <nav className="site-container divide-y divide-[#edf2fa] pb-4">
              {menuLinks.map((item) => (
                <div key={item.label}>
                  <div className="flex items-center justify-between">
                    <Link
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                      className="flex-1 py-3 text-[15px] font-semibold text-[#2e4267]"
                    >
                      {item.label}
                    </Link>
                    {item.children && (
                      <button
                        type="button"
                        onClick={() => setExpandedItem(expandedItem === item.label ? null : item.label)}
                        className="p-2 text-[#60749a]"
                      >
                        <ChevronDownIcon className={`h-4 w-4 transition-transform ${expandedItem === item.label ? "rotate-180" : ""}`} />
                      </button>
                    )}
                  </div>
                  {item.children && expandedItem === item.label && (
                    <div className="mb-2 ml-3 space-y-1 border-l-2 border-[#e0e8ff] pl-3">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={() => setMenuOpen(false)}
                          className="block py-1.5 text-[14px] text-[#3a4d72] hover:text-[#1f4686]"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {(hotline ?? telegram) && (
                <div className="space-y-2 pt-3 text-[13px] text-[#3a4d72]">
                  {hotline && (
                    <p className="flex items-center gap-2"><PhoneIcon />Hotline: {hotline}</p>
                  )}
                  {telegram && (
                    <p className="flex items-center gap-2"><TelegramIcon />Telegram: {telegram}</p>
                  )}
                </div>
              )}

              {authUser ? (
                <div className="border-t border-[#edf2fa] pt-3">
                  <div className="flex items-center justify-between rounded-xl bg-[#f8fbff] border border-[#dbe2ef] px-4 py-3 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#1d4fba] text-sm font-bold text-white">
                        {authUser.username.charAt(0).toUpperCase()}
                      </span>
                      <div>
                        <p className="text-[13px] font-bold text-[#1d3f85]">{authUser.username}</p>
                        <p className="text-[12px] text-[#e09000] font-semibold">{toCurrency(authUser.balance)}</p>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="inline-flex h-10 w-full items-center justify-center rounded-xl border border-[#d7e0ef] text-sm font-bold text-[#c0001e]">
                    Đăng xuất
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2 pt-3">
                  <Link href="/account" onClick={() => setMenuOpen(false)} className="inline-flex h-10 items-center justify-center rounded-xl bg-[#3f5e9f] text-sm font-bold text-white">
                    Đăng nhập
                  </Link>
                  <Link href="/account/register" onClick={() => setMenuOpen(false)} className="inline-flex h-10 items-center justify-center rounded-xl bg-[#ef0030] text-sm font-bold text-white">
                    Đăng ký
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>

      {/* NON-STICKY: desktop nav row */}
      <div className="hidden border-b border-[#edf2fa] bg-white lg:block">
        <div className="site-container flex min-h-[52px] items-center justify-between gap-4">
          <nav className="flex flex-wrap gap-5 text-sm font-semibold text-[#2e4267]">
            {menuLinks.map((item) => (
              <div key={item.label} className="group relative">
                <Link href={item.href} className="inline-flex items-center gap-1 py-3 hover:text-[#1f4686]">
                  {item.label}
                  {item.children ? <ChevronDownIcon /> : null}
                </Link>
                {item.children ? (
                  item.label === "Sản phẩm" ? (
                    <ProductMegaMenu items={item.children} />
                  ) : (
                    <div className="invisible absolute left-0 top-[calc(100%+4px)] z-50 min-w-[200px] translate-y-2 rounded-xl border border-[#e4e9f2] bg-white p-1.5 opacity-0 shadow-[0_18px_30px_-22px_rgba(25,36,58,0.9)] transition-all group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                      {item.children.map((child) => (
                        <Link key={`${item.label}-${child.label}`} href={child.href} className="block rounded-lg px-3 py-2 text-sm text-[#2f4268] hover:bg-[#f2f6ff] hover:text-[#1f4686]">
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )
                ) : null}
              </div>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-5 text-sm text-[#3a4d72]">
            {hotline && (
              <span className="inline-flex items-center gap-1.5">
                <PhoneIcon />
                {hotline}
              </span>
            )}
            {telegram && (
              <span className="inline-flex items-center gap-1.5">
                <TelegramIcon />
                {telegram}
              </span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
