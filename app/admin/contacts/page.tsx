"use client";

import { FormEvent, useEffect, useState } from "react";
import { ApiContact, createContact, deleteContact, getContacts, updateContact } from "@/lib/admin-api";

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState<ApiContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    telegram: "",
    phone: ""
  });

  async function loadContacts() {
    try {
      setLoading(true);
      setError(null);
      setContacts(await getContacts());
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Failed to load contacts");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadContacts();
  }, []);

  function resetForm() {
    setForm({ telegram: "", phone: "" });
    setEditingId(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setSubmitting(true);
      setError(null);

      const payload = {
        telegram: form.telegram.trim() || undefined,
        phone: form.phone.trim() || undefined
      };

      if (editingId) {
        await updateContact(editingId, payload);
      } else {
        await createContact(payload);
      }

      resetForm();
      await loadContacts();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Failed to save contact");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      setError(null);
      await deleteContact(id);
      await loadContacts();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Failed to delete contact");
    }
  }

  function startEdit(contact: ApiContact) {
    setEditingId(contact.id);
    setForm({
      telegram: contact.telegram ?? "",
      phone: contact.phone ?? ""
    });
  }

  return (
    <>
      <header>
        <h1 className="text-3xl font-bold text-[#213a6c]">Contact management</h1>
        <p className="mt-2 text-sm text-[#5b6f90]">Manage Telegram and phone contact channels.</p>
      </header>

      {error ? <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}

      <section className="admin-card p-5">
        <h2 className="text-lg font-semibold text-[#23385f]">{editingId ? "Edit contact" : "Create contact"}</h2>

        <form onSubmit={handleSubmit} className="mt-4 grid gap-3 md:grid-cols-2">
          <input
            value={form.telegram}
            onChange={(event) => setForm((prev) => ({ ...prev, telegram: event.target.value }))}
            placeholder="Telegram"
            className="admin-input"
          />
          <input
            value={form.phone}
            onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
            placeholder="Phone"
            className="admin-input"
          />

          <div className="flex gap-2 md:col-span-2">
            <button type="submit" disabled={submitting} className="admin-btn-primary disabled:opacity-70">
              {submitting ? "Saving..." : editingId ? "Update contact" : "Create contact"}
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
        <h2 className="text-lg font-semibold text-[#23385f]">Contacts</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr className="border-b border-[#e5eaf4] text-xs uppercase tracking-[0.12em] text-[#6b7f9f]">
                <th className="px-3 py-2">Telegram</th>
                <th className="px-3 py-2">Phone</th>
                <th className="px-3 py-2">Created</th>
                <th className="px-3 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((contact) => (
                <tr key={contact.id} className="border-b border-[#eef2f8]">
                  <td className="px-3 py-3 font-medium text-[#1f355c]">{contact.telegram || "-"}</td>
                  <td className="px-3 py-3">{contact.phone || "-"}</td>
                  <td className="px-3 py-3">{new Date(contact.createdAt).toLocaleString()}</td>
                  <td className="px-3 py-3">
                    <div className="flex gap-2">
                      <button type="button" onClick={() => startEdit(contact)} className="rounded-lg border border-[#c7d4ea] px-3 py-1.5 text-xs font-semibold text-[#1f4686]">Edit</button>
                      <button type="button" onClick={() => void handleDelete(contact.id)} className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-700">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {loading ? <p className="p-3 text-sm text-[#6b7f9f]">Loading contacts...</p> : null}
        </div>
      </section>
    </>
  );
}
