"use client";

import { useEffect, useMemo, useState } from "react";
import { ApiOrder, ApiUser, getOrders, getUsers, updateOrderStatus } from "@/lib/admin-api";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [users, setUsers] = useState<ApiUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<ApiUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const userMap = useMemo(() => new Map(users.map((user) => [user.id, user])), [users]);

  async function loadOrders() {
    try {
      setLoading(true);
      setError(null);
      const [ordersData, usersData] = await Promise.all([getOrders(), getUsers()]);
      setOrders(ordersData);
      setUsers(usersData);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Failed to load orders");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadOrders();
  }, []);

  async function handleStatusChange(orderId: string, status: "pending" | "paid" | "cancelled") {
    try {
      setError(null);
      await updateOrderStatus(orderId, status);
      await loadOrders();
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : "Failed to update order status");
    }
  }

  return (
    <>
      <header>
        <h1 className="text-3xl font-bold text-[#213a6c]">Order management</h1>
        <p className="mt-2 text-sm text-[#5b6f90]">Track orders, update status, and inspect buyer details quickly.</p>
      </header>

      {error ? <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}

      <section className="admin-card p-5">
        <h2 className="text-lg font-semibold text-[#23385f]">Orders</h2>

        <div className="mt-4 overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Username</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const user = userMap.get(order.userId);
                return (
                  <tr key={order.id}>
                    <td className="font-medium text-[#1f355c]">{order.id}</td>
                    <td>
                      {user ? (
                        <button
                          type="button"
                          onClick={() => setSelectedUser(user)}
                          className="font-semibold text-[#1f4686] underline underline-offset-2"
                        >
                          {user.username}
                        </button>
                      ) : (
                        <span className="text-[#8091ad]">{order.userId}</span>
                      )}
                    </td>
                    <td>
                      <ul className="space-y-1">
                        {order.items.map((item) => (
                          <li key={item.id}>
                            {item.product?.name ?? item.productId} x {item.quantity}
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="font-semibold text-[#1f355c]">{order.totalAmount.toLocaleString()}</td>
                    <td>
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${
                        order.status === "paid"
                          ? "border border-[#a8d5b0] bg-[#e6f4ea] text-[#1e7e34]"
                          : order.status === "cancelled"
                            ? "border border-[#f5c0c0] bg-[#fde8e8] text-[#b00020]"
                            : "border border-[#ffe082] bg-[#fff8e1] text-[#a07000]"
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <button type="button" onClick={() => void handleStatusChange(order.id, "pending")} className="rounded-lg border border-[#d6ddec] bg-white px-2.5 py-1 text-xs font-semibold text-[#2d4268]">Pending</button>
                        <button type="button" onClick={() => void handleStatusChange(order.id, "paid")} className="rounded-lg border border-green-200 bg-[#f2fbf6] px-2.5 py-1 text-xs font-semibold text-green-700">Paid</button>
                        <button type="button" onClick={() => void handleStatusChange(order.id, "cancelled")} className="rounded-lg border border-red-200 bg-[#fff5f5] px-2.5 py-1 text-xs font-semibold text-red-700">Cancel</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {loading ? <p className="p-3 text-sm text-[#6b7f9f]">Loading orders...</p> : null}
        </div>
      </section>

      {selectedUser ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f1e3b]/40 p-4">
          <div className="w-full max-w-xl rounded-2xl border border-[#dbe2ef] bg-white p-5 shadow-xl">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-[#213a6c]">User details</h3>
              <button type="button" onClick={() => setSelectedUser(null)} className="admin-btn-secondary h-9 px-3 text-xs">Close</button>
            </div>
            <div className="grid grid-cols-[130px_1fr] gap-y-2 text-sm">
              <span className="admin-muted">Username</span><span className="font-semibold text-[#1f355c]">{selectedUser.username}</span>
              <span className="admin-muted">Email</span><span>{selectedUser.email}</span>
              <span className="admin-muted">Role</span><span>{selectedUser.role?.name ?? "buyer"}</span>
              <span className="admin-muted">Balance</span><span>{selectedUser.balance.toLocaleString()}</span>
              <span className="admin-muted">User ID</span><span className="break-all">{selectedUser.id}</span>
              <span className="admin-muted">Created</span><span>{new Date(selectedUser.createdAt).toLocaleString("vi-VN")}</span>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}