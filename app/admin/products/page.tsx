"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  ApiCategory,
  ApiCountry,
  ApiProduct,
  createProduct,
  deleteProduct,
  getCategories,
  getCountries,
  getProducts,
  updateProduct,
  uploadImage
} from "@/lib/admin-api";

interface ProductFormState {
  name: string;
  slug: string;
  categoryId: string;
  countryId: string;
  stockQuantity: string;
  soldQuantity: string;
  minPurchaseQuantity: string;
  price: string;
  note: string;
  highlight: string;
  imageUrl: string;
}

const initialProductForm: ProductFormState = {
  name: "",
  slug: "",
  categoryId: "",
  countryId: "",
  stockQuantity: "0",
  soldQuantity: "0",
  minPurchaseQuantity: "1",
  price: "",
  note: "",
  highlight: "",
  imageUrl: ""
};

export default function AdminProductsPage() {
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [countries, setCountries] = useState<ApiCountry[]>([]);
  const [products, setProducts] = useState<ApiProduct[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState<ProductFormState>(initialProductForm);

  const canSave = useMemo(
    () => Boolean(form.categoryId && form.countryId && form.price && form.name && form.slug),
    [form]
  );

  async function loadData() {
    try {
      setLoading(true);
      setError(null);

      const [categoryData, countryData, productData] = await Promise.all([getCategories(), getCountries(), getProducts()]);

      setCategories(categoryData);
      setCountries(countryData);
      setProducts(productData);

      setForm((prev) => ({
        ...prev,
        categoryId: prev.categoryId || categoryData[0]?.id || "",
        countryId: prev.countryId || countryData[0]?.id || ""
      }));
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Failed to load product resources");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadData();
  }, []);

  function resetForm() {
    setForm((prev) => ({
      ...initialProductForm,
      categoryId: prev.categoryId,
      countryId: prev.countryId
    }));
    setEditingId(null);
  }

  async function handleUpload(file: File) {
    try {
      setSubmitting("upload");
      const result = await uploadImage("products", file);
      const url = result.imageUrl ?? result.imgUrl ?? result.url;
      if (!url) {
        throw new Error("Upload succeeded but image URL is missing");
      }
      setForm((prev) => ({ ...prev, imageUrl: url }));
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Failed to upload image");
    } finally {
      setSubmitting(null);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setSubmitting(editingId ? `update-${editingId}` : "create");
      setError(null);

      const payload = {
        name: form.name,
        slug: form.slug,
        categoryId: form.categoryId,
        countryId: form.countryId,
        stockQuantity: Number(form.stockQuantity),
        soldQuantity: Number(form.soldQuantity),
        minPurchaseQuantity: Number(form.minPurchaseQuantity),
        price: Number(form.price),
        note: form.note || undefined,
        highlight: form.highlight || undefined,
        imageUrl: form.imageUrl || undefined
      };

      if (editingId) {
        await updateProduct(editingId, payload);
      } else {
        await createProduct(payload);
      }

      resetForm();
      await loadData();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Failed to save product");
    } finally {
      setSubmitting(null);
    }
  }

  async function handleDeleteProduct(productId: string) {
    try {
      setSubmitting(`delete-${productId}`);
      setError(null);
      await deleteProduct(productId);
      await loadData();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Failed to delete product");
    } finally {
      setSubmitting(null);
    }
  }

  function startEdit(product: ApiProduct) {
    setEditingId(product.id);
    setForm({
      name: product.name,
      slug: product.slug,
      categoryId: product.categoryId,
      countryId: product.countryId,
      stockQuantity: String(product.stockQuantity),
      soldQuantity: String(product.soldQuantity),
      minPurchaseQuantity: String(product.minPurchaseQuantity),
      price: String(product.price),
      note: product.note ?? "",
      highlight: product.highlight ?? "",
      imageUrl: product.imageUrl ?? ""
    });
  }

  return (
    <>
      <header>
        <h1 className="text-3xl font-bold text-[#213a6c]">Product management</h1>
        <p className="mt-2 text-sm text-[#5b6f90]">Manage product stock, sold quantity, and minimum purchase quantity with edit support.</p>
      </header>

      {error ? <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}

      <section className="admin-card p-5">
        <h2 className="text-lg font-semibold text-[#23385f]">{editingId ? "Edit product" : "Create product"}</h2>

        <form onSubmit={handleSubmit} className="mt-4 grid gap-3 md:grid-cols-2">
          <input value={form.name} onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))} placeholder="Product name" required className="admin-input" />
          <input value={form.slug} onChange={(event) => setForm((prev) => ({ ...prev, slug: event.target.value }))} placeholder="Slug" required className="admin-input" />

          <select value={form.categoryId} onChange={(event) => setForm((prev) => ({ ...prev, categoryId: event.target.value }))} className="admin-input">
            {categories.map((category) => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
          <select value={form.countryId} onChange={(event) => setForm((prev) => ({ ...prev, countryId: event.target.value }))} className="admin-input">
            {countries.map((country) => (
              <option key={country.id} value={country.id}>{country.name}</option>
            ))}
          </select>

          <input type="number" min={0} value={form.stockQuantity} onChange={(event) => setForm((prev) => ({ ...prev, stockQuantity: event.target.value }))} placeholder="Stock quantity" required className="admin-input" />
          <input type="number" min={0} value={form.soldQuantity} onChange={(event) => setForm((prev) => ({ ...prev, soldQuantity: event.target.value }))} placeholder="Sold quantity" required className="admin-input" />

          <input type="number" min={1} value={form.minPurchaseQuantity} onChange={(event) => setForm((prev) => ({ ...prev, minPurchaseQuantity: event.target.value }))} placeholder="Minimum purchase quantity" required className="admin-input" />
          <input type="number" min={1} step="0.01" value={form.price} onChange={(event) => setForm((prev) => ({ ...prev, price: event.target.value }))} placeholder="Price" required className="admin-input" />

          <textarea value={form.note} onChange={(event) => setForm((prev) => ({ ...prev, note: event.target.value }))} placeholder="Note" rows={3} className="admin-textarea" />
          <textarea value={form.highlight} onChange={(event) => setForm((prev) => ({ ...prev, highlight: event.target.value }))} placeholder="Highlight" rows={3} className="admin-textarea" />

          <input value={form.imageUrl} onChange={(event) => setForm((prev) => ({ ...prev, imageUrl: event.target.value }))} placeholder="Product image URL" className="admin-input md:col-span-2" />
          <input type="file" accept="image/*" onChange={(event) => { const file = event.target.files?.[0]; if (file) { void handleUpload(file); } }} className="text-sm md:col-span-2" />

          <div className="flex gap-2 md:col-span-2">
            <button type="submit" disabled={!canSave || submitting?.startsWith("delete-")} className="admin-btn-primary disabled:opacity-70">
              {editingId ? "Update product" : "Create product"}
            </button>
            {editingId ? (
              <button type="button" onClick={resetForm} className="admin-btn-secondary">
                Cancel edit
              </button>
            ) : null}
          </div>
        </form>
      </section>

      <section className="admin-card p-5">
        <h2 className="text-lg font-semibold text-[#23385f]">Products</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr className="border-b border-[#e5eaf4] text-xs uppercase tracking-[0.12em] text-[#6b7f9f]">
                <th className="px-3 py-2">Name</th>
                <th className="px-3 py-2">Stock</th>
                <th className="px-3 py-2">Sold</th>
                <th className="px-3 py-2">Min/order</th>
                <th className="px-3 py-2">Price</th>
                <th className="px-3 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b border-[#eef2f8]">
                  <td className="px-3 py-3 font-medium text-[#1f355c]">{product.name}</td>
                  <td className="px-3 py-3">{product.stockQuantity}</td>
                  <td className="px-3 py-3">{product.soldQuantity}</td>
                  <td className="px-3 py-3">{product.minPurchaseQuantity}</td>
                  <td className="px-3 py-3">{product.price}</td>
                  <td className="px-3 py-3">
                    <div className="flex gap-2">
                      <button type="button" onClick={() => startEdit(product)} className="rounded-lg border border-[#c7d4ea] px-3 py-1.5 text-xs font-semibold text-[#1f4686]">Edit</button>
                      <button type="button" onClick={() => void handleDeleteProduct(product.id)} disabled={submitting === `delete-${product.id}`} className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-700 disabled:opacity-60">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {loading ? <p className="p-3 text-sm text-[#6b7f9f]">Loading products...</p> : null}
        </div>
      </section>
    </>
  );
}
