"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ApiProduct,
  ApiUser,
  getCategories,
  getCountries,
  getPaymentInfos,
  getProducts,
  getUsers
} from "@/lib/admin-api";

interface DashboardState {
  users: ApiUser[];
  products: ApiProduct[];
  payments: number;
  categories: number;
  countries: number;
}

export default function AdminDashboardPage() {
  const [state, setState] = useState<DashboardState>({
    users: [],
    products: [],
    payments: 0,
    categories: 0,
    countries: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError(null);

        const [users, products, paymentInfos, categories, countries] = await Promise.all([
          getUsers(),
          getProducts(),
          getPaymentInfos(),
          getCategories(),
          getCountries()
        ]);

        setState({
          users,
          products,
          payments: paymentInfos.length,
          categories: categories.length,
          countries: countries.length
        });
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    }

    void load();
  }, []);

  const metrics = [
    { label: "Total users", value: state.users.length.toString() },
    { label: "Total products", value: state.products.length.toString() },
    { label: "Payment accounts", value: state.payments.toString() },
    { label: "Categories", value: state.categories.toString() },
    { label: "Countries", value: state.countries.toString() }
  ];

  return (
    <>
      <section className="admin-card overflow-hidden">
        <div className="bg-gradient-to-r from-[#e9f1ff] via-[#f7faff] to-[#edf7f3] px-6 py-5">
          <p className="text-xs uppercase tracking-[0.22em] text-[#5f7398]">Overview</p>
          <h2 className="mt-2 text-3xl font-semibold text-[#213a6c]">Admin Dashboard</h2>
          <p className="mt-2 max-w-3xl text-sm text-[#506384]">
            Real-time snapshot from backend APIs for users, products, countries, categories, and payment information.
          </p>
        </div>
      </section>

      {error ? <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {metrics.map((metric) => (
          <article key={metric.label} className="admin-card p-5">
            <p className="text-xs uppercase tracking-[0.14em] text-[#6b7f9f]">{metric.label}</p>
            <p className="mt-3 text-3xl font-semibold text-[#1f4686]">{loading ? "..." : metric.value}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.3fr_1fr]">
        <article className="admin-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-[#22365b]">Latest users</h3>
            <Link href="/admin/users" className="text-sm text-[#1f4686] hover:underline">
              Manage users
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>
                {state.users.slice(0, 5).map((user) => (
                  <tr key={user.id}>
                    <td className="font-medium text-[#1f355c]">{user.username}</td>
                    <td>{user.email}</td>
                    <td>{user.role?.name ?? "buyer"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <article className="admin-card p-5">
          <h3 className="text-lg font-semibold text-[#22365b]">Quick actions</h3>
          <div className="mt-4 grid gap-3">
            <Link href="/admin/countries" className="rounded-xl border border-[#d5deec] bg-[#f7f9fd] px-4 py-3 text-sm font-semibold text-[#2e4369] hover:bg-[#edf3fc]">
              Add or update countries
            </Link>
            <Link href="/admin/categories" className="rounded-xl border border-[#d5deec] bg-[#f7f9fd] px-4 py-3 text-sm font-semibold text-[#2e4369] hover:bg-[#edf3fc]">
              Add or update categories
            </Link>
            <Link href="/admin/products" className="rounded-xl border border-[#d5deec] bg-[#f7f9fd] px-4 py-3 text-sm font-semibold text-[#2e4369] hover:bg-[#edf3fc]">
              Manage product catalog
            </Link>
            <Link href="/admin/payments" className="rounded-xl border border-[#d5deec] bg-[#f7f9fd] px-4 py-3 text-sm font-semibold text-[#2e4369] hover:bg-[#edf3fc]">
              Manage payment info
            </Link>
            <Link href="/admin/users" className="rounded-xl border border-[#d5deec] bg-[#f7f9fd] px-4 py-3 text-sm font-semibold text-[#2e4369] hover:bg-[#edf3fc]">
              Create admin or buyer users
            </Link>
          </div>
        </article>
      </section>
    </>
  );
}
