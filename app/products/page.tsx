import type { Metadata } from "next";
import Link from "next/link";
import { getPublicCategories, getPublicProducts } from "@/lib/public-api";

export const metadata: Metadata = {
  title: "Danh sách sản phẩm",
  description: "Xem danh sách sản phẩm theo thể loại, lọc nhanh theo từ khóa và tồn kho."
};

interface ProductsPageProps {
  searchParams?: Promise<{
    q?: string;
    category?: string;
    sort?: string;
  }>;
}

function toCurrency(amount: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0
  }).format(amount);
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const keyword = params?.q?.trim().toLowerCase() ?? "";
  const categoryFilter = params?.category?.trim().toLowerCase() ?? "all";
  const sort = params?.sort?.trim().toLowerCase() ?? "";

  let products = [] as Awaited<ReturnType<typeof getPublicProducts>>;
  let categories = [] as Awaited<ReturnType<typeof getPublicCategories>>;

  try {
    [products, categories] = await Promise.all([getPublicProducts(), getPublicCategories()]);
  } catch {
    products = [];
    categories = [];
  }

  const filteredProducts = products.filter((product) => {
    const matchCategory = categoryFilter === "all" ? true : product.category?.slug === categoryFilter;
    const normalizedText = `${product.name} ${product.highlight ?? ""} ${product.note ?? ""}`.toLowerCase();
    const matchKeyword = keyword.length === 0 ? true : normalizedText.includes(keyword);
    return matchCategory && matchKeyword;
  });

  const sortedProducts = [...filteredProducts];

  if (sort === "price_asc") {
    sortedProducts.sort((a, b) => a.price - b.price);
  } else if (sort === "price_desc") {
    sortedProducts.sort((a, b) => b.price - a.price);
  } else if (sort === "stock_desc") {
    sortedProducts.sort((a, b) => b.stockQuantity - a.stockQuantity);
  }

  return (
    <main className="mx-auto w-full max-w-[1640px] px-4 py-8 md:px-6">
      <header className="rounded-3xl border border-[#d9e3f3] bg-white p-6">
        <h1 className="text-3xl font-bold text-[#1d3f85]">Kho sản phẩm</h1>
        <p className="mt-2 text-sm text-[#4c6088]">Lọc nhanh theo thể loại, từ khóa và mức giá để tìm đúng sản phẩm bạn cần.</p>
      </header>

      <form method="get" className="mt-5 grid gap-4 rounded-3xl border border-[#d9e3f3] bg-white p-5 md:grid-cols-4">
        <label className="flex flex-col gap-1 text-sm text-[#3d537d]">
          Từ khóa
          <input type="search" name="q" defaultValue={params?.q} placeholder="Ví dụ: Zalo, Telegram..." className="h-11 rounded-xl border border-[#cad7ee] px-3" />
        </label>

        <label className="flex flex-col gap-1 text-sm text-[#3d537d]">
          Thể loại
          <select name="category" defaultValue={categoryFilter} className="h-11 rounded-xl border border-[#cad7ee] px-3">
            <option value="all">Tất cả</option>
            {categories.map((category) => (
              <option key={category.id} value={category.slug}>
                {category.name}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-sm text-[#3d537d]">
          Sắp xếp
          <select name="sort" defaultValue={sort} className="h-11 rounded-xl border border-[#cad7ee] px-3">
            <option value="">Mặc định</option>
            <option value="price_asc">Giá tăng dần</option>
            <option value="price_desc">Giá giảm dần</option>
            <option value="stock_desc">Tồn kho nhiều nhất</option>
          </select>
        </label>

        <button type="submit" className="mt-auto inline-flex h-11 items-center justify-center rounded-xl bg-[#1f4686] px-4 text-sm font-semibold text-white">
          Áp dụng bộ lọc
        </button>
      </form>

      <p className="mt-4 text-sm text-[#4f648c]">Tìm thấy {sortedProducts.length} sản phẩm.</p>

      <section className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {sortedProducts.map((product) => (
          <article key={product.id} className="rounded-2xl border border-[#dbe4f3] bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6178a3]">Thể loại: {product.category?.name ?? "Chưa phân loại"}</p>
            <h2 className="mt-2 text-xl font-semibold text-[#213a6c]">{product.name}</h2>
            <p className="mt-2 line-clamp-2 text-sm text-[#4f648c]">{product.highlight || product.note || "Sản phẩm bàn giao sau khi xác nhận thanh toán."}</p>

            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl bg-[#f6f9ff] p-3">
                <p className="text-[#6780ad]">Giá bán</p>
                <p className="mt-1 font-semibold text-[#1f4686]">{toCurrency(product.price)}</p>
              </div>
              <div className="rounded-xl bg-[#f6f9ff] p-3">
                <p className="text-[#6780ad]">Tồn kho</p>
                <p className="mt-1 font-semibold text-[#1f4686]">{product.stockQuantity}</p>
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <Link href={`/products/${product.slug}`} className="inline-flex flex-1 items-center justify-center rounded-xl border border-[#cad7ee] bg-white px-3 py-2.5 text-sm font-semibold text-[#2e4b7f]">
                Xem chi tiết
              </Link>
              <Link href={`/checkout?product=${product.slug}`} className="inline-flex flex-1 items-center justify-center rounded-xl bg-[#1f4686] px-3 py-2.5 text-sm font-semibold text-white">
                Mua ngay
              </Link>
            </div>
          </article>
        ))}

        {sortedProducts.length === 0 ? (
          <article className="rounded-2xl border border-[#dbe4f3] bg-white p-5 text-sm text-[#4f648c] md:col-span-2 xl:col-span-3">
            Không có sản phẩm phù hợp với bộ lọc hiện tại.
          </article>
        ) : null}
      </section>
    </main>
  );
}
