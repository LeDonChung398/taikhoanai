import type { Metadata } from "next";
import Image from "next/image";
import { getPublicCatalogByCategory, getPublicContacts } from "@/lib/public-api";
import { ProductCardHome } from "@/components/product-card-home";
import { HomeSidebar } from "@/components/home-sidebar";

export const metadata: Metadata = {
  title: "Trang chủ",
  description: "Mua tài khoản số uy tín, phân loại rõ ràng, hỗ trợ nhanh qua Telegram và Hotline."
};

function splitLines(content?: string) {
  return (content ?? "").split(/\r?\n/g).map((s) => s.trim()).filter(Boolean);
}

function buildFeatureList(note?: string, highlight?: string, minPurchaseQuantity = 1, soldQuantity = 0) {
  const lines = splitLines(highlight).length > 0 ? splitLines(highlight) : splitLines(note);
  if (lines.length > 0) return lines.slice(0, 8);
  return [`Mua tối thiểu ${minPurchaseQuantity} tài khoản / lần`, `Đã bán hơn ${soldQuantity}+`, "Hỗ trợ xử lý nhanh sau thanh toán"];
}

export default async function HomePage() {
  let catalog = [] as Awaited<ReturnType<typeof getPublicCatalogByCategory>>;
  let contacts = [] as Awaited<ReturnType<typeof getPublicContacts>>;

  try {
    [catalog, contacts] = await Promise.all([getPublicCatalogByCategory(), getPublicContacts()]);
  } catch {
    catalog = [];
    contacts = [];
  }

  const hotline = contacts.find((item) => item.phone)?.phone ?? null;
  const telegram = contacts.find((item) => item.telegram)?.telegram ?? null;
  const sortedCatalog = [...catalog].sort((a, b) => b.products.length - a.products.length);

  return (
    <main id="danh-muc" className="bg-[#f3f5f9] py-5 md:py-8">
      <section className="site-container grid grid-cols-1 gap-4 lg:grid-cols-12">
        <div className="order-2 lg:order-1 lg:col-span-9">
          <div className="space-y-7">
            {sortedCatalog.map((category) => (
              <section key={category.id} id={`danh-muc-${category.slug}`} className="scroll-mt-[220px]">
                <div className="mb-4 flex items-center gap-2.5 rounded-xl bg-gradient-to-r from-[#31498f] to-[#204a8f] px-4 py-3 shadow-[0_6px_18px_-12px_rgba(15,35,85,0.8)]">
                  {category.imageUrl ? <Image src={category.imageUrl} alt={category.name} width={30} height={30} unoptimized className="h-[30px] w-[30px] rounded-lg object-cover" /> : null}
                  <h2 className="text-[18px] font-bold uppercase tracking-[0.04em] text-white">{category.name}</h2>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {category.products.map((product) => {
                    const features = buildFeatureList(product.note, product.highlight, product.minPurchaseQuantity, product.soldQuantity);
                    return (
                      <ProductCardHome key={product.id} product={product} category={category} features={features} />
                    );
                  })}

                  {category.products.length === 0 ? (
                    <article className="rounded-2xl border border-[#dbe4f3] bg-white p-5 text-sm text-[#4f648c] md:col-span-2 xl:col-span-3">
                      Danh mục này hiện chưa có sản phẩm.
                    </article>
                  ) : null}
                </div>
              </section>
            ))}

            {catalog.length === 0 ? (
              <article className="rounded-2xl border border-[#dbe4f3] bg-white p-5 text-sm text-[#4f648c]">Chưa có dữ liệu danh mục/sản phẩm từ API. Vui lòng kiểm tra backend.</article>
            ) : null}
          </div>
        </div>

        <aside className="order-1 lg:order-2 lg:col-span-3">
          <HomeSidebar hotline={hotline} telegram={telegram} />
        </aside>
      </section>
    </main>
  );
}
