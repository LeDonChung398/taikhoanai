import Link from "next/link";
import { Product } from "@/lib/types";
import { toCurrency } from "@/lib/mock-data";

function ProductStatusPill({ status }: { status: Product["status"] }) {
  const styleMap: Record<Product["status"], string> = {
    in_stock: "bg-mint/20 text-brand",
    limited: "bg-sand text-brand",
    out_of_stock: "bg-red-100 text-red-800"
  };

  const labelMap: Record<Product["status"], string> = {
    in_stock: "Con hang",
    limited: "Sap het",
    out_of_stock: "Het hang"
  };

  return <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-0.5 text-xs font-semibold ${styleMap[status]}`}>{labelMap[status]}</span>;
}

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="rounded-[14px] border border-[rgba(52,65,100,0.13)] bg-white shadow-none p-5 transition hover:-translate-y-1 hover:shadow-card">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-brand/60">{product.category}</p>
          <h3 className="mt-2 text-xl font-semibold text-brand">{product.name}</h3>
        </div>
        <ProductStatusPill status={product.status} />
      </div>

      <p className="mt-3 text-sm text-ink/80">{product.shortDescription}</p>

      <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div>
          <dt className="text-ink/60">Gia</dt>
          <dd className="font-semibold text-brand">{toCurrency(product.price)}</dd>
        </div>
        <div>
          <dt className="text-ink/60">Thoi han</dt>
          <dd className="font-semibold text-brand">{product.duration}</dd>
        </div>
      </dl>

      <div className="mt-5 flex items-center gap-2">
        <Link href={`/products/${product.slug}`} className="inline-flex items-center justify-center rounded-xl border border-[rgba(37,51,80,0.24)] bg-white px-4 py-2.5 font-semibold text-[#2b3e69] text-sm">
          Xem chi tiet
        </Link>
        <Link href={`/checkout?product=${product.slug}`} className="inline-flex items-center justify-center rounded-xl border border-transparent bg-[#234785] px-4 py-2.5 font-bold text-[#f3f6ff] text-sm">
          Dat mua
        </Link>
      </div>
    </article>
  );
}

