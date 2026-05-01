import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto w-full max-w-[1640px] px-4 md:px-5 flex min-h-[60vh] flex-col items-start justify-center py-10">
      <p className="inline-flex items-center gap-1.5 rounded-full px-3 py-0.5 text-xs font-semibold bg-brand/10 text-brand">404</p>
      <h1 className="mt-4 text-4xl font-bold">Khong tim thay trang</h1>
      <p className="mt-3 max-w-lg text-sm text-ink/80">Duong dan khong ton tai hoac san pham da bi go khoi danh sach.</p>
      <Link href="/products" className="inline-flex items-center justify-center rounded-xl border border-transparent bg-[#234785] px-4 py-2.5 font-bold text-[#f3f6ff] mt-6">
        Ve trang san pham
      </Link>
    </main>
  );
}

