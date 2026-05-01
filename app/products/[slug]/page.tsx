import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getPublicProductBySlug } from "@/lib/public-api";
import { ProductDetailBuy } from "@/components/product-detail-buy";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const product = await getPublicProductBySlug(slug);
    return {
      title: product.name,
      description: product.highlight || product.note || `Mua ${product.name} uy tín tại TaiKhoanAI.`,
      alternates: { canonical: `/products/${slug}` },
      openGraph: {
        title: product.name,
        description: product.highlight || product.note || undefined,
        type: "website",
        url: `/products/${slug}`,
      },
    };
  } catch {
    return { title: "Sản phẩm không tồn tại" };
  }
}

function toCurrency(amount: number) {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 }).format(amount);
}

function splitLines(text?: string) {
  return (text ?? "").split(/\r?\n/).map((s) => s.trim()).filter(Boolean);
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;

  let product: Awaited<ReturnType<typeof getPublicProductBySlug>>;
  try {
    product = await getPublicProductBySlug(slug);
  } catch {
    notFound();
  }

  const noteLines = splitLines(product.highlight || product.note);

  return (
    <main className="bg-[#f3f5f9] py-6 md:py-10">
      <div className="site-container">
        <div className="grid gap-5 lg:grid-cols-[1fr_320px]">

          {/* ── LEFT: Product info ── */}
          <div className="space-y-4">
            {/* Header card */}
            <div className="rounded-2xl border border-[#dbe2ef] bg-white p-5 md:p-6">
              {/* Category badge */}
              {product.category && (
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#e8efff] px-2.5 py-1 text-[12px] font-bold uppercase tracking-wide text-[#2f4b93]">
                  {product.category.imageUrl && (
                    <Image src={product.category.imageUrl} alt={product.category.name} width={16} height={16} unoptimized className="h-4 w-4 rounded object-cover" />
                  )}
                  {product.category.name}
                </span>
              )}

              <h1 className="mt-3 text-[22px] font-bold leading-snug text-[#1d2e54] md:text-[26px]">
                {product.name}
              </h1>

              <p className="mt-3 text-[26px] font-extrabold text-[#e09000] md:text-[30px]">
                {toCurrency(product.price)}
              </p>

              {/* Stats row */}
              <div className="mt-4 grid grid-cols-3 gap-3">
                <div className="rounded-xl border border-[#e3e9f4] bg-[#f8fbff] p-3 text-center">
                  <p className="text-[11px] font-medium text-[#60749a]">Kho hàng</p>
                  <p className="mt-1 text-[18px] font-extrabold text-[#27a243]">{product.stockQuantity}</p>
                </div>
                <div className="rounded-xl border border-[#e3e9f4] bg-[#f8fbff] p-3 text-center">
                  <p className="text-[11px] font-medium text-[#60749a]">Đã bán</p>
                  <p className="mt-1 text-[18px] font-extrabold text-[#2f4b93]">{product.soldQuantity}</p>
                </div>
                <div className="rounded-xl border border-[#e3e9f4] bg-[#f8fbff] p-3 text-center">
                  <p className="text-[11px] font-medium text-[#60749a]">Quốc gia</p>
                  <div className="mt-1 flex items-center justify-center">
                    {product.country?.imgUrl ? (
                      <Image src={product.country.imgUrl} alt={product.country.name} width={32} height={22} unoptimized className="h-[22px] w-8 rounded object-cover shadow-sm" />
                    ) : (
                      <span className="text-[15px] font-bold text-[#1d2e54]">{product.country?.name ?? "—"}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Description card */}
            {noteLines.length > 0 && (
              <div className="rounded-2xl border border-[#dbe2ef] bg-white p-5 md:p-6">
                <h2 className="mb-3 text-[15px] font-bold text-[#1d2e54]">Mô tả sản phẩm</h2>
                <div className="space-y-2 text-[13px] leading-7 text-[#3a4d72]">
                  {noteLines.map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── RIGHT: Purchase panel ── */}
          <aside>
            <div className="lg:sticky lg:top-[90px] rounded-2xl border border-[#dbe2ef] bg-white p-5">
              <p className="mb-1 text-[13px] font-bold uppercase tracking-wide text-[#1d2e54]">
                Thanh toán
              </p>

              <div className="my-4 space-y-2 border-y border-[#edf2f8] py-4 text-[13px] text-[#3a4d72]">
                <div className="flex justify-between">
                  <span>Đơn giá:</span>
                  <span className="font-semibold text-[#e09000]">{toCurrency(product.price)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Trạng thái:</span>
                  <span className={`font-semibold ${product.stockQuantity > 0 ? "text-[#27a243]" : "text-[#c0001e]"}`}>
                    {product.stockQuantity > 0 ? "Còn hàng" : "Hết hàng"}
                  </span>
                </div>
              </div>

              <ProductDetailBuy product={product} />
            </div>
          </aside>

        </div>
      </div>
    </main>
  );
}
