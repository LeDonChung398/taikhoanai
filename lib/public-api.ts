export interface PublicContact {
  id: string;
  telegram?: string;
  phone?: string;
  createdAt: string;
}

export interface PublicCategory {
  id: string;
  name: string;
  slug: string;
  imageUrl?: string;
  createdAt: string;
}

export interface PublicCountry {
  id: string;
  name: string;
  imgUrl?: string;
  createdAt: string;
}

export interface PublicProduct {
  id: string;
  name: string;
  slug: string;
  stockQuantity: number;
  soldQuantity: number;
  minPurchaseQuantity: number;
  price: number;
  note?: string;
  highlight?: string;
  imageUrl?: string;
  categoryId: string;
  countryId: string;
  category?: PublicCategory;
  country?: PublicCountry;
  createdAt: string;
}

export interface PublicCategoryWithProducts extends PublicCategory {
  products: PublicProduct[];
}

export interface PublicPaymentInfo {
  id: string;
  accountNumber: string;
  transferContent: string;
  accountHolder: string;
  bankName: string;
  qrImageUrl?: string;
  note?: string;
  createdAt: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api";

async function fetchPublic<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    next: { revalidate: 60 }
  });

  if (!response.ok) {
    throw new Error(`Khong the tai du lieu cong khai (${response.status})`);
  }

  return (await response.json()) as T;
}

export async function getPublicContacts() {
  return fetchPublic<PublicContact[]>("/contacts");
}

export async function getPublicCategories() {
  return fetchPublic<PublicCategory[]>("/categories");
}

export async function getPublicProducts() {
  return fetchPublic<PublicProduct[]>("/products");
}

export async function getPublicCatalogByCategory() {
  return fetchPublic<PublicCategoryWithProducts[]>("/categories/with-products");
}

export async function getPublicProductBySlug(slug: string) {
  return fetchPublic<PublicProduct>(`/products/slug/${slug}`);
}

export async function getPublicPaymentInfos() {
  return fetchPublic<PublicPaymentInfo[]>("/payment-info");
}
