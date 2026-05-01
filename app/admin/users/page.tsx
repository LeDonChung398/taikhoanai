"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  ApiUser,
  ApiUserTransaction,
  UserTransactionType,
  createUser,
  createUserTransaction,
  getUserTransactions,
  getUsers,
  updateUser
} from "@/lib/admin-api";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<ApiUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "buyer" as "buyer" | "admin",
    balance: 0
  });

  const [transactionModalUser, setTransactionModalUser] = useState<ApiUser | null>(null);
  const [transactions, setTransactions] = useState<ApiUserTransaction[]>([]);
  const [transactionsLoading, setTransactionsLoading] = useState(false);
  const [transactionSubmitting, setTransactionSubmitting] = useState(false);
  const [transactionError, setTransactionError] = useState<string | null>(null);
  const [transactionForm, setTransactionForm] = useState({
    type: "credit" as UserTransactionType,
    amount: 1,
    reason: ""
  });

  async function loadUsers(): Promise<ApiUser[]> {
    try {
      setLoading(true);
      setError(null);
      const nextUsers = await getUsers();
      setUsers(nextUsers);
      return nextUsers;
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Failed to load users");
      return [];
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadUsers();
  }, []);

  function resetForm() {
    setForm({ username: "", email: "", password: "", role: "buyer", balance: 0 });
    setEditingUserId(null);
  }

  function resetTransactionForm() {
    setTransactionForm({ type: "credit", amount: 1, reason: "" });
  }

  async function loadTransactions(userId: string) {
    try {
      setTransactionsLoading(true);
      setTransactionError(null);
      setTransactions(await getUserTransactions(userId));
    } catch (loadError) {
      setTransactionError(loadError instanceof Error ? loadError.message : "Failed to load transactions");
    } finally {
      setTransactionsLoading(false);
    }
  }

  function openTransactionModal(user: ApiUser) {
    setTransactionModalUser(user);
    setTransactionError(null);
    resetTransactionForm();
    void loadTransactions(user.id);
  }

  function closeTransactionModal() {
    setTransactionModalUser(null);
    setTransactions([]);
    setTransactionError(null);
    resetTransactionForm();
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setSubmitting(true);
      setError(null);

      if (editingUserId) {
        const payload: { username?: string; email?: string; password?: string; role?: "buyer" | "admin"; balance?: number } = {
          username: form.username,
          email: form.email,
          role: form.role,
          balance: form.balance
        };
        if (form.password) {
          payload.password = form.password;
        }
        await updateUser(editingUserId, payload);
      } else {
        await createUser(form);
      }

      resetForm();
      await loadUsers();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Failed to save user");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleCreateTransaction(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!transactionModalUser) {
      return;
    }

    try {
      setTransactionSubmitting(true);
      setTransactionError(null);

      await createUserTransaction(transactionModalUser.id, {
        type: transactionForm.type,
        amount: Math.max(1, Math.floor(transactionForm.amount)),
        reason: transactionForm.reason.trim()
      });

      const nextUsers = await loadUsers();
      const refreshedUser = nextUsers.find((user) => user.id === transactionModalUser.id) ?? null;
      setTransactionModalUser(refreshedUser);
      await loadTransactions(transactionModalUser.id);
      resetTransactionForm();
    } catch (submitError) {
      setTransactionError(submitError instanceof Error ? submitError.message : "Failed to create transaction");
    } finally {
      setTransactionSubmitting(false);
    }
  }

  function startEdit(user: ApiUser) {
    setEditingUserId(user.id);
    setForm({
      username: user.username,
      email: user.email,
      password: "",
      role: user.role?.name ?? "buyer",
      balance: user.balance ?? 0
    });
  }

  return (
    <>
      <header>
        <h1 className="text-3xl font-bold text-[#213a6c]">User management</h1>
        <p className="mt-2 text-sm text-[#5b6f90]">Create and edit admin/buyer accounts.</p>
      </header>

      {error ? <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}

      <section className="admin-card p-5">
        <h2 className="text-lg font-semibold text-[#23385f]">{editingUserId ? "Edit user" : "Create user"}</h2>

        <form onSubmit={handleSubmit} className="mt-4 grid gap-3 md:grid-cols-2">
          <input value={form.username} onChange={(event) => setForm((prev) => ({ ...prev, username: event.target.value }))} placeholder="Username" required className="admin-input" />
          <input type="email" value={form.email} onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))} placeholder="Email" required className="admin-input" />
          <input type="password" value={form.password} onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))} placeholder={editingUserId ? "Password (optional)" : "Password"} required={!editingUserId} className="admin-input" />
          <select value={form.role} onChange={(event) => setForm((prev) => ({ ...prev, role: event.target.value as "admin" | "buyer" }))} className="admin-input">
            <option value="buyer">buyer</option>
            <option value="admin">admin</option>
          </select>
          <input
            type="number"
            min={0}
            step={1}
            value={form.balance}
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                balance: Number.isNaN(event.target.valueAsNumber) ? 0 : Math.max(0, Math.floor(event.target.valueAsNumber))
              }))
            }
            placeholder="Balance"
            required
            className="admin-input"
          />

          <div className="flex gap-2 md:col-span-2">
            <button type="submit" disabled={submitting} className="admin-btn-primary disabled:opacity-70">
              {submitting ? "Saving..." : editingUserId ? "Update user" : "Create user"}
            </button>
            {editingUserId ? (
              <button type="button" onClick={resetForm} className="admin-btn-secondary">
                Cancel edit
              </button>
            ) : null}
          </div>
        </form>
      </section>

      <section className="admin-card p-5">
        <h2 className="text-lg font-semibold text-[#23385f]">User list</h2>

        <div className="mt-4 overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr className="border-b border-[#e5eaf4] text-xs uppercase tracking-[0.12em] text-[#6b7f9f]">
                <th className="px-3 py-2">Username</th>
                <th className="px-3 py-2">Email</th>
                <th className="px-3 py-2">Role</th>
                <th className="px-3 py-2">Balance</th>
                <th className="px-3 py-2">Created</th>
                <th className="px-3 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-[#eef2f8]">
                  <td className="px-3 py-3 font-medium text-[#1f355c]">{user.username}</td>
                  <td className="px-3 py-3">{user.email}</td>
                  <td className="px-3 py-3">{user.role?.name ?? "buyer"}</td>
                  <td className="px-3 py-3">{user.balance.toLocaleString()}</td>
                  <td className="px-3 py-3">{new Date(user.createdAt).toLocaleString()}</td>
                  <td className="px-3 py-3">
                    <div className="flex gap-2">
                      <button type="button" onClick={() => startEdit(user)} className="rounded-lg border border-[#c7d4ea] px-3 py-1.5 text-xs font-semibold text-[#1f4686]">
                        Edit
                      </button>
                      <button type="button" onClick={() => openTransactionModal(user)} className="rounded-lg border border-[#c7d4ea] px-3 py-1.5 text-xs font-semibold text-[#1f4686]">
                        Transactions
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {loading ? <p className="p-3 text-sm text-[#6b7f9f]">Loading users...</p> : null}
        </div>
      </section>

      {transactionModalUser ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f1e3b]/40 p-4">
          <div className="w-full max-w-3xl rounded-2xl border border-[#dbe2ef] bg-white p-5 shadow-xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-xl font-semibold text-[#213a6c]">Transactions: {transactionModalUser.username}</h3>
                <p className="mt-1 text-sm text-[#5b6f90]">Current balance: {transactionModalUser.balance.toLocaleString()}</p>
              </div>
              <button type="button" onClick={closeTransactionModal} className="rounded-lg border border-[#d6ddec] px-3 py-1.5 text-sm font-medium text-[#2d4268]">
                Close
              </button>
            </div>

            {transactionError ? <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{transactionError}</p> : null}

            <section className="mt-4 rounded-xl border border-[#e4eaf5] bg-[#f8faff] p-4">
              <h4 className="text-sm font-semibold uppercase tracking-[0.12em] text-[#5f7398]">Create transaction</h4>
              <form onSubmit={handleCreateTransaction} className="mt-3 grid gap-3 md:grid-cols-3">
                <select
                  value={transactionForm.type}
                  onChange={(event) => setTransactionForm((prev) => ({ ...prev, type: event.target.value as UserTransactionType }))}
                  className="admin-input"
                >
                  <option value="credit">credit (add)</option>
                  <option value="debit">debit (subtract)</option>
                </select>
                <input
                  type="number"
                  min={1}
                  step={1}
                  value={transactionForm.amount}
                  onChange={(event) =>
                    setTransactionForm((prev) => ({
                      ...prev,
                      amount: Number.isNaN(event.target.valueAsNumber) ? 1 : Math.max(1, Math.floor(event.target.valueAsNumber))
                    }))
                  }
                  required
                  placeholder="Amount"
                  className="admin-input"
                />
                <input
                  value={transactionForm.reason}
                  onChange={(event) => setTransactionForm((prev) => ({ ...prev, reason: event.target.value }))}
                  required
                  maxLength={255}
                  placeholder="Reason"
                  className="admin-input md:col-span-2"
                />
                <button
                  type="submit"
                  disabled={transactionSubmitting}
                  className="admin-btn-primary disabled:opacity-70"
                >
                  {transactionSubmitting ? "Saving..." : "Create transaction"}
                </button>
              </form>
            </section>

            <section className="mt-4">
              <h4 className="text-sm font-semibold uppercase tracking-[0.12em] text-[#5f7398]">Transaction history</h4>
              <div className="mt-2 max-h-[320px] overflow-y-auto rounded-xl border border-[#e4eaf5]">
                <table className="admin-table">
                  <thead>
                    <tr className="border-b border-[#e5eaf4] text-xs uppercase tracking-[0.12em] text-[#6b7f9f]">
                      <th className="px-3 py-2">Type</th>
                      <th className="px-3 py-2">Amount</th>
                      <th className="px-3 py-2">Reason</th>
                      <th className="px-3 py-2">Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((transaction) => (
                      <tr key={transaction.id} className="border-b border-[#eef2f8]">
                        <td className="px-3 py-3 font-medium text-[#1f355c]">{transaction.type}</td>
                        <td className={`px-3 py-3 ${transaction.type === "credit" ? "text-green-700" : "text-red-700"}`}>
                          {transaction.type === "credit" ? "+" : "-"}
                          {transaction.amount.toLocaleString()}
                        </td>
                        <td className="px-3 py-3">{transaction.reason}</td>
                        <td className="px-3 py-3">{new Date(transaction.createdAt).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {transactionsLoading ? <p className="p-3 text-sm text-[#6b7f9f]">Loading transactions...</p> : null}
                {!transactionsLoading && transactions.length === 0 ? <p className="p-3 text-sm text-[#6b7f9f]">No transactions yet.</p> : null}
              </div>
            </section>
          </div>
        </div>
      ) : null}
    </>
  );
}
