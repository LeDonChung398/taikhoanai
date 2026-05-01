"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const sections = [
  {
    title: "Overview",
    links: [{ href: "/admin", label: "Dashboard" }]
  },
  {
    title: "Catalog",
    links: [
      { href: "/admin/countries", label: "Countries" },
      { href: "/admin/contacts", label: "Contacts" },
      { href: "/admin/categories", label: "Categories" },
      { href: "/admin/products", label: "Products" }
    ]
  },
  {
    title: "Operations",
    links: [
      { href: "/admin/payments", label: "Payments" },
      { href: "/admin/orders", label: "Orders" },
      { href: "/admin/users", label: "Users" }
    ]
  }
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="admin-card sticky top-5 h-max overflow-hidden">
      <div className="border-b border-[#e4eaf5] bg-gradient-to-r from-[#f6f9ff] to-[#ffffff] px-4 py-4">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#5f7398]">Admin Panel</p>
        <p className="mt-1 text-sm font-semibold text-[#1f3f7a]">Navigation</p>
      </div>

      <div className="space-y-4 p-4">
        {sections.map((section) => (
          <div key={section.title}>
            <p className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#7e8fad]">{section.title}</p>
            <nav className="flex flex-col gap-1.5">
              {section.links.map((item) => {
                const active = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                      active
                        ? "bg-gradient-to-r from-[#1f4686] to-[#2b5cb3] text-white shadow-[0_10px_20px_-14px_rgba(22,40,74,0.8)]"
                        : "text-[#33486a] hover:bg-[#edf2fa]"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        ))}
      </div>
    </aside>
  );
}
