"use client";

import { FormEvent, useEffect, useState } from "react";
import { ApiCountry, createCountry, deleteCountry, getCountries, updateCountry, uploadImage } from "@/lib/admin-api";

export default function AdminCountriesPage() {
  const [countries, setCountries] = useState<ApiCountry[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    imgUrl: ""
  });

  async function loadCountries() {
    try {
      setLoading(true);
      setError(null);
      setCountries(await getCountries());
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Failed to load countries");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadCountries();
  }, []);

  function resetForm() {
    setForm({ name: "", imgUrl: "" });
    setEditingId(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setSubmitting(true);
      setError(null);
      if (editingId) {
        await updateCountry(editingId, form);
      } else {
        await createCountry(form);
      }
      resetForm();
      await loadCountries();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Failed to save country");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleUpload(file: File) {
    try {
      setSubmitting(true);
      const result = await uploadImage("countries", file);
      const url = result.imgUrl ?? result.imageUrl ?? result.url;
      if (!url) {
        throw new Error("Uploaded image URL is missing");
      }
      setForm((prev) => ({ ...prev, imgUrl: url }));
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Failed to upload country image");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      setError(null);
      await deleteCountry(id);
      await loadCountries();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Failed to delete country");
    }
  }

  function startEdit(country: ApiCountry) {
    setEditingId(country.id);
    setForm({ name: country.name, imgUrl: country.imgUrl ?? "" });
  }

  return (
    <>
      <header>
        <h1 className="text-3xl font-bold text-[#213a6c]">Country management</h1>
        <p className="mt-2 text-sm text-[#5b6f90]">Create, edit, and manage countries for products.</p>
      </header>

      {error ? <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}

      <section className="admin-card p-5">
        <h2 className="text-lg font-semibold text-[#23385f]">{editingId ? "Edit country" : "Create country"}</h2>

        <form onSubmit={handleSubmit} className="mt-4 grid gap-3">
          <input value={form.name} onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))} placeholder="Country name" required className="admin-input" />
          <input value={form.imgUrl} onChange={(event) => setForm((prev) => ({ ...prev, imgUrl: event.target.value }))} placeholder="Image URL" className="admin-input" />
          <input type="file" accept="image/*" onChange={(event) => { const file = event.target.files?.[0]; if (file) { void handleUpload(file); } }} className="text-sm" />
          <div className="flex gap-2">
            <button type="submit" disabled={submitting} className="admin-btn-primary disabled:opacity-70">
              {submitting ? "Saving..." : editingId ? "Update country" : "Create country"}
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
        <h2 className="text-lg font-semibold text-[#23385f]">Countries</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr className="border-b border-[#e5eaf4] text-xs uppercase tracking-[0.12em] text-[#6b7f9f]">
                <th className="px-3 py-2">Name</th>
                <th className="px-3 py-2">Image</th>
                <th className="px-3 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {countries.map((country) => (
                <tr key={country.id} className="border-b border-[#eef2f8]">
                  <td className="px-3 py-3 font-medium text-[#1f355c]">{country.name}</td>
                  <td className="px-3 py-3">{country.imgUrl ? <a href={country.imgUrl} target="_blank" rel="noreferrer" className="text-[#1f4686] underline">View image</a> : "-"}</td>
                  <td className="px-3 py-3">
                    <div className="flex gap-2">
                      <button type="button" onClick={() => startEdit(country)} className="rounded-lg border border-[#c7d4ea] px-3 py-1.5 text-xs font-semibold text-[#1f4686]">Edit</button>
                      <button type="button" onClick={() => void handleDelete(country.id)} className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-700">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {loading ? <p className="p-3 text-sm text-[#6b7f9f]">Loading countries...</p> : null}
        </div>
      </section>
    </>
  );
}
