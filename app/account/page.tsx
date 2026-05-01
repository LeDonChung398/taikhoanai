"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getRoleRedirectPath, login } from "@/lib/auth";

export default function AccountLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    try {
      setIsLoading(true);
      const result = await login({ username, password });
      localStorage.setItem("accessToken", result.accessToken);
      localStorage.setItem("authUser", JSON.stringify(result.user));
      window.dispatchEvent(new Event("auth-user-updated"));

      if (result.user.role === "admin") {
        router.push(getRoleRedirectPath(result.user.role));
      } else {
        const redirect = new URLSearchParams(window.location.search).get("redirect");
        router.push(redirect ?? "/");
      }
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="site-container py-8 pb-12">
      <div className="mx-auto w-full max-w-[460px]">
        <section className="rounded-xl border border-[#d9deea] bg-white px-6 py-7">
          <h1 className="text-center text-[26px] font-bold tracking-[0.01em] text-[#2f3f7c]">Đăng Nhập</h1>
          <p className="mt-1.5 text-center text-sm text-[#465675]">Vui lòng nhập thông tin đăng nhập</p>

          <form onSubmit={handleSubmit} className="mt-5 grid gap-3">
            <input
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="Vui lòng nhập username"
              required
              className="h-11 w-full rounded-lg border border-[#d5dae5] bg-[#f7f8fb] px-4 text-sm text-[#2b3f67] outline-none transition focus:border-[#4f68ab] focus:shadow-[0_0_0_3px_rgba(79,104,171,0.15)]"
            />
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Vui lòng nhập mật khẩu"
              required
              className="h-11 w-full rounded-lg border border-[#d5dae5] bg-[#f7f8fb] px-4 text-sm text-[#2b3f67] outline-none transition focus:border-[#4f68ab] focus:shadow-[0_0_0_3px_rgba(79,104,171,0.15)]"
            />
            {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex h-11 items-center justify-center rounded-lg border border-transparent bg-[#4a5695] text-sm font-bold tracking-[0.02em] text-white disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isLoading ? "Đăng nhập..." : "ĐĂNG NHẬP"}
            </button>
          </form>

          <Link href="#" className="mt-3 block text-center text-sm font-semibold text-[#3f4f8d]">
            Quên mật khẩu?
          </Link>
        </section>

        <section className="mt-3 rounded-xl border border-[#d9deea] bg-white p-4">
          <p className="m-0 text-center text-sm text-[#4c5975]">
            Bạn chưa có tài khoản?{" "}
            <Link href="/account/register" className="font-bold text-[#3a4d91]">
              Đăng Ký Ngay
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}
