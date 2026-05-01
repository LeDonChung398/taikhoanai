"use client";

import { FormEvent, useEffect, useState } from "react";
import { ApiCategory, createCategory, deleteCategory, getCategories, updateCategory, uploadImage } from "@/lib/admin-api";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    slug: "",
    imageUrl: ""
  });

  async function loadCategories() {
    try {
      setLoading(true);
      setError(null);
      setCategories(await getCategories());
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Failed to load categories");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadCategories();
  }, []);

  function resetForm() {
    setForm({ name: "", slug: "", imageUrl: "" });
    setEditingId(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setSubmitting(true);
      setError(null);
      if (editingId) {
        await updateCategory(editingId, form);
      } else {
        await createCategory(form);
      }
      resetForm();
      await loadCategories();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Failed to save category");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleUpload(file: File) {
    try {
      setSubmitting(true);
      const result = await uploadImage("categories", file);
      const url = result.imageUrl ?? result.imgUrl ?? result.url;
      if (!url) {
        throw new Error("Uploaded image URL is missing");
      }
      setForm((prev) => ({ ...prev, imageUrl: url }));
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Failed to upload category image");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      setError(null);
      await deleteCategory(id);
      await loadCategories();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Failed to delete category");
    }
  }

  function startEdit(category: ApiCategory) {
    setEditingId(category.id);
    setForm({ name: category.name, slug: category.slug, imageUrl: category.imageUrl ?? "" });
  }

  return (
    <>
      <header>
        <h1 className="text-3xl font-bold text-[#213a6c]">Category management</h1>
        <p className="mt-2 text-sm text-[#5b6f90]">Create, edit, and manage categories for product catalog.</p>
      </header>

      {error ? <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}

      <section className="admin-card p-5">
        <h2 className="text-lg font-semibold text-[#23385f]">{editingId ? "Edit category" : "Create category"}</h2>

        <form onSubmit={handleSubmit} className="mt-4 grid gap-3">
          <input value={form.name} onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))} placeholder="Category name" required className="admin-input" />
          <input value={form.slug} onChange={(event) => setForm((prev) => ({ ...prev, slug: event.target.value }))} placeholder="Slug" required className="admin-input" />
          <input value={form.imageUrl} onChange={(event) => setForm((prev) => ({ ...prev, imageUrl: event.target.value }))} placeholder="Image URL" className="admin-input" />
          <input type="file" accept="image/*" onChange={(event) => { const file = event.target.files?.[0]; if (file) { void handleUpload(file); } }} className="text-sm" />
          <div className="flex gap-2">
            <button type="submit" disabled={submitting} className="admin-btn-primary disabled:opacity-70">
              {submitting ? "Saving..." : editingId ? "Update category" : "Create category"}
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
        <h2 className="text-lg font-semibold text-[#23385f]">Categories</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr className="border-b border-[#e5eaf4] text-xs uppercase tracking-[0.12em] text-[#6b7f9f]">
                <th className="px-3 py-2">Name</th>
                <th className="px-3 py-2">Slug</th>
                <th className="px-3 py-2">Image</th>
                <th className="px-3 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id} className="border-b border-[#eef2f8]">
                  <td className="px-3 py-3 font-medium text-[#1f355c]">{category.name}</td>
                  <td className="px-3 py-3">{category.slug}</td>
                  <td className="px-3 py-3">{category.imageUrl ? <a href={category.imageUrl} target="_blank" rel="noreferrer" className="text-[#1f4686] underline">View image</a> : "-"}</td>
                  <td className="px-3 py-3">
                    <div className="flex gap-2">
                      <button type="button" onClick={() => startEdit(category)} className="rounded-lg border border-[#c7d4ea] px-3 py-1.5 text-xs font-semibold text-[#1f4686]">Edit</button>
                      <button type="button" onClick={() => void handleDelete(category.id)} className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-700">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {loading ? <p className="p-3 text-sm text-[#6b7f9f]">Loading categories...</p> : null}
        </div>
      </section>
    </>
  );
}
