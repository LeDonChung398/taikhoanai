"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  ApiDepositRequest,
  ApiPaymentInfo,
  approveDepositRequest,
  createPaymentInfo,
  deletePaymentInfo,
  getAllDepositRequests,
  getPaymentInfos,
  rejectDepositRequest,
  updatePaymentInfo,
  uploadToStorage
} from "@/lib/admin-api";
import { getDisplayBankName } from "@/lib/bank";

const defaultNote = "Enter the exact transfer content so the system can auto credit your balance";

const STATUS_BADGE: Record<ApiDepositRequest["status"], string> = {
  pending: "border border-[#ffe082] bg-[#fff8e1] text-[#a07000]",
  approved: "border border-[#a8d5b0] bg-[#e6f4ea] text-[#1e7e34]",
  rejected: "border border-[#f5c0c0] bg-[#fde8e8] text-[#b00020]"
};

function toCurrency(amount: number) {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 }).format(amount);
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function shortId(id: string) {
  return id.slice(0, 8).toUpperCase();
}

export default function AdminPaymentsPage() {
  const [paymentInfos, setPaymentInfos] = useState<ApiPaymentInfo[]>([]);
  const [paymentInfoLoading, setPaymentInfoLoading] = useState(true);
  const [depositRequests, setDepositRequests] = useState<ApiDepositRequest[]>([]);
  const [depositLoading, setDepositLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [actioningRequestId, setActioningRequestId] = useState<string | null>(null);

  const [form, setForm] = useState({
    accountNumber: "",
    transferContent: "",
    accountHolder: "",
    bankName: "",
    qrImageUrl: "",
    note: defaultNote
  });

  async function loadPaymentInfos() {
    try {
      setPaymentInfoLoading(true);
      setError(null);
      setPaymentInfos(await getPaymentInfos());
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Failed to load payment info");
    } finally {
      setPaymentInfoLoading(false);
    }
  }

  async function loadDepositRequests() {
    try {
      setDepositLoading(true);
      setError(null);
      setDepositRequests(await getAllDepositRequests());
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Failed to load deposit requests");
    } finally {
      setDepositLoading(false);
    }
  }

  useEffect(() => {
    void Promise.all([loadPaymentInfos(), loadDepositRequests()]);
  }, []);

  function resetForm() {
    setForm({
      accountNumber: "",
      transferContent: "",
      accountHolder: "",
      bankName: "",
      qrImageUrl: "",
      note: defaultNote
    });
    setEditingId(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setSubmitting(true);
      setError(null);
      if (editingId) {
        await updatePaymentInfo(editingId, form);
      } else {
        await createPaymentInfo(form);
      }
      resetForm();
      await loadPaymentInfos();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Failed to save payment info");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleUploadQr(file: File) {
    try {
      setSubmitting(true);
      setError(null);
      const result = await uploadToStorage(file, "payments");
      setForm((prev) => ({ ...prev, qrImageUrl: result.url }));
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Failed to upload QR image");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(paymentInfoId: string) {
    try {
      setError(null);
      await deletePaymentInfo(paymentInfoId);
      await loadPaymentInfos();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Failed to delete payment info");
    }
  }

  async function handleApproveRequest(id: string) {
    try {
      setActioningRequestId(id);
      setError(null);
      await approveDepositRequest(id);
      await loadDepositRequests();
    } catch (actionError) {
      setError(actionError instanceof Error ? actionError.message : "Failed to approve request");
    } finally {
      setActioningRequestId(null);
    }
  }

  async function handleRejectRequest(id: string) {
    try {
      setActioningRequestId(id);
      setError(null);
      await rejectDepositRequest(id);
      await loadDepositRequests();
    } catch (actionError) {
      setError(actionError instanceof Error ? actionError.message : "Failed to reject request");
    } finally {
      setActioningRequestId(null);
    }
  }

  function startEdit(item: ApiPaymentInfo) {
    setEditingId(item.id);
    setForm({
      accountNumber: item.accountNumber,
      transferContent: item.transferContent,
      accountHolder: item.accountHolder,
      bankName: item.bankName,
      qrImageUrl: item.qrImageUrl ?? "",
      note: item.note ?? defaultNote
    });
  }

  return (
    <>
      <header>
        <h1 className="text-3xl font-bold text-[#213a6c]">Payment info management</h1>
        <p className="mt-2 text-sm text-[#5b6f90]">Qu?n l? thông tin chuy?n kho?n và duy?t yêu c?u n?p ti?n c?a ngư?i dùng.</p>
      </header>

      {error ? <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}

      <section className="admin-card p-5">
        <h2 className="text-lg font-semibold text-[#23385f]">{editingId ? "Edit payment info" : "Create payment info"}</h2>

        <form onSubmit={handleSubmit} className="mt-4 grid gap-3 md:grid-cols-2">
          <input value={form.accountNumber} onChange={(event) => setForm((prev) => ({ ...prev, accountNumber: event.target.value }))} placeholder="Account number" required className="admin-input" />
          <input value={form.transferContent} onChange={(event) => setForm((prev) => ({ ...prev, transferContent: event.target.value }))} placeholder="Transfer content" required className="admin-input" />
          <input value={form.accountHolder} onChange={(event) => setForm((prev) => ({ ...prev, accountHolder: event.target.value }))} placeholder="Account holder" required className="admin-input" />
          <input value={form.bankName} onChange={(event) => setForm((prev) => ({ ...prev, bankName: event.target.value }))} placeholder="Bank name" required className="admin-input" />

          <input value={form.qrImageUrl} onChange={(event) => setForm((prev) => ({ ...prev, qrImageUrl: event.target.value }))} placeholder="QR image URL" className="admin-input md:col-span-2" />
          <input type="file" accept="image/*" onChange={(event) => { const file = event.target.files?.[0]; if (file) { void handleUploadQr(file); } }} className="text-sm md:col-span-2" />

          <textarea value={form.note} onChange={(event) => setForm((prev) => ({ ...prev, note: event.target.value }))} placeholder="Note" rows={3} className="admin-textarea md:col-span-2" />

          <div className="flex gap-2 md:col-span-2">
            <button type="submit" disabled={submitting} className="admin-btn-primary disabled:opacity-70">
              {submitting ? "Saving..." : editingId ? "Update payment info" : "Create payment info"}
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
        <h2 className="text-lg font-semibold text-[#23385f]">Payment info list</h2>

        <div className="mt-4 overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr className="border-b border-[#e5eaf4] text-xs uppercase tracking-[0.12em] text-[#6b7f9f]">
                <th className="px-3 py-2">Bank</th>
                <th className="px-3 py-2">Account number</th>
                <th className="px-3 py-2">Account holder</th>
                <th className="px-3 py-2">Transfer content</th>
                <th className="px-3 py-2">QR</th>
                <th className="px-3 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {paymentInfos.map((item) => (
                <tr key={item.id} className="border-b border-[#eef2f8]">
                  <td className="px-3 py-3 font-semibold">{getDisplayBankName(item.bankName)}</td>
                  <td className="px-3 py-3 font-medium text-[#1f355c]">{item.accountNumber}</td>
                  <td className="px-3 py-3">{item.accountHolder}</td>
                  <td className="px-3 py-3">{item.transferContent}</td>
                  <td className="px-3 py-3">{item.qrImageUrl ? <a href={item.qrImageUrl} target="_blank" rel="noreferrer" className="text-[#1f4686] underline">View QR</a> : "-"}</td>
                  <td className="px-3 py-3">
                    <div className="flex gap-2">
                      <button type="button" onClick={() => startEdit(item)} className="rounded-lg border border-[#c7d4ea] px-3 py-1.5 text-xs font-semibold text-[#1f4686]">Edit</button>
                      <button type="button" onClick={() => void handleDelete(item.id)} className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-700">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {paymentInfoLoading ? <p className="p-3 text-sm text-[#6b7f9f]">Loading payment info...</p> : null}
        </div>
      </section>

      <section className="admin-card p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[#23385f]">Deposit requests (pending review)</h2>
          <button
            type="button"
            onClick={() => void loadDepositRequests()}
            className="rounded-lg border border-[#d6ddec] px-3 py-1.5 text-xs font-semibold text-[#2d4268]"
          >
            Refresh
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr className="border-b border-[#e5eaf4] text-xs uppercase tracking-[0.12em] text-[#6b7f9f]">
                <th className="px-3 py-2">Request</th>
                <th className="px-3 py-2">User</th>
                <th className="px-3 py-2">Amount</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Note</th>
                <th className="px-3 py-2">Created at</th>
                <th className="px-3 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {depositRequests.map((request) => {
                const isPending = request.status === "pending";
                return (
                  <tr key={request.id} className="border-b border-[#eef2f8]">
                    <td className="px-3 py-3 font-mono font-semibold text-[#2f4b93]">#{shortId(request.id)}</td>
                    <td className="px-3 py-3">
                      <p className="font-medium text-[#1f355c]">{request.user?.username ?? request.userId}</p>
                      <p className="text-xs text-[#6b7f9f]">{request.user?.email ?? "-"}</p>
                    </td>
                    <td className="px-3 py-3 font-bold text-[#1f355c]">{toCurrency(request.amount)}</td>
                    <td className="px-3 py-3">
                      <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-bold ${STATUS_BADGE[request.status]}`}>{request.status}</span>
                    </td>
                    <td className="px-3 py-3">{request.note?.trim() || "-"}</td>
                    <td className="px-3 py-3">{formatDate(request.createdAt)}</td>
                    <td className="px-3 py-3">
                      {isPending ? (
                        <div className="flex gap-2">
                          <button
                            type="button"
                            disabled={actioningRequestId === request.id}
                            onClick={() => void handleApproveRequest(request.id)}
                            className="rounded-lg border border-green-200 px-3 py-1.5 text-xs font-semibold text-green-700 disabled:opacity-60"
                          >
                            Duy?t
                          </button>
                          <button
                            type="button"
                            disabled={actioningRequestId === request.id}
                            onClick={() => void handleRejectRequest(request.id)}
                            className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-700 disabled:opacity-60"
                          >
                            T? ch?i
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-[#8091ad]">Đ? x? l?</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {depositLoading ? <p className="p-3 text-sm text-[#6b7f9f]">Loading deposit requests...</p> : null}
          {!depositLoading && depositRequests.length === 0 ? <p className="p-3 text-sm text-[#6b7f9f]">No deposit requests yet.</p> : null}
        </div>
      </section>
    </>
  );
}
