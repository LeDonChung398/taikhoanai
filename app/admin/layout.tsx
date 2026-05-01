import type { Metadata } from "next";
import { AdminAuthGuard } from "@/components/admin-auth-guard";
import { AdminSidebar } from "@/components/admin-sidebar";
import { AdminToolbar } from "@/components/admin-toolbar";

export const metadata: Metadata = {
  title: {
    default: "Admin",
    template: "%s | Admin TaiKhoanAI"
  },
  robots: {
    index: false,
    follow: false
  }
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="admin-shell min-h-screen text-[#20304b]">
      <div className="mx-auto w-full max-w-[1640px] px-4 py-6 md:px-6 lg:py-8">
        <div className="admin-card mb-6 overflow-hidden">
          <div className="bg-gradient-to-r from-[#17366e] via-[#1f4686] to-[#2b5cb3] px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/90">
            Back Office
          </div>
          <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-5">
            <div>
              <h1 className="text-2xl font-semibold text-[#213a6c] md:text-3xl">TaiKhoanAI Admin Workspace</h1>
              <p className="admin-muted mt-1 text-sm">Central place to manage operations, catalog, payments, and orders.</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded-full border border-[#d6deee] bg-[#f6f9ff] px-3 py-1 text-xs font-semibold text-[#315181]">Live API</span>
              <span className="rounded-full border border-[#cbe8dc] bg-[#ecfaf3] px-3 py-1 text-xs font-semibold text-[#177a4e]">Secure Admin</span>
              <AdminToolbar />
            </div>
          </div>
        </div>

        <AdminAuthGuard>
          <div className="grid gap-5 lg:grid-cols-[280px_1fr]">
            <AdminSidebar />
            <section className="space-y-5">{children}</section>
          </div>
        </AdminAuthGuard>
      </div>
    </main>
  );
}