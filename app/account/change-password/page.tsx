"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { changePassword } from "@/lib/auth";

export default function ChangePasswordPage() {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      router.replace("/account?redirect=/account/change-password");
    }
  }, [router]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (newPassword !== confirmPassword) {
      setError("Mật khẩu mới không khớp");
      return;
    }

    if (newPassword.length < 6) {
      setError("Mật khẩu mới phải có ít nhất 6 ký tự");
      return;
    }

    try {
      setLoading(true);
      await changePassword({ currentPassword, newPassword });
      setSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đổi mật khẩu thất bại");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="site-container py-8 pb-12">
      <div className="mx-auto w-full max-w-[460px]">
        <section className="rounded-xl border border-[#d9deea] bg-white px-6 py-7">
          <h1 className="text-center text-[24px] font-bold text-[#2f3f7c]">Đổi mật khẩu</h1>
          <p className="mt-1.5 text-center text-sm text-[#465675]">Nhập mật khẩu hiện tại và mật khẩu mới</p>

          {success ? (
            <div className="mt-6 rounded-xl border border-[#a8d5b0] bg-[#e6f4ea] px-4 py-4 text-center">
              <p className="font-semibold text-[#1e7e34]">Đổi mật khẩu thành công!</p>
              <button
                type="button"
                onClick={() => router.back()}
                className="mt-3 text-sm font-semibold text-[#3a4d91] underline"
              >
                Quay lại
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-5 grid gap-3">
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Mật khẩu hiện tại"
                required
                className="h-11 w-full rounded-lg border border-[#d5dae5] bg-[#f7f8fb] px-4 text-sm text-[#2b3f67] outline-none transition focus:border-[#4f68ab] focus:shadow-[0_0_0_3px_rgba(79,104,171,0.15)]"
              />
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Mật khẩu mới (ít nhất 6 ký tự)"
                required
                className="h-11 w-full rounded-lg border border-[#d5dae5] bg-[#f7f8fb] px-4 text-sm text-[#2b3f67] outline-none transition focus:border-[#4f68ab] focus:shadow-[0_0_0_3px_rgba(79,104,171,0.15)]"
              />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Nhập lại mật khẩu mới"
                required
                className="h-11 w-full rounded-lg border border-[#d5dae5] bg-[#f7f8fb] px-4 text-sm text-[#2b3f67] outline-none transition focus:border-[#4f68ab] focus:shadow-[0_0_0_3px_rgba(79,104,171,0.15)]"
              />

              {error && <p className="text-sm font-medium text-red-600">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="inline-flex h-11 items-center justify-center rounded-lg bg-[#4a5695] text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "Đang xử lý..." : "XÁC NHẬN ĐỔI MẬT KHẨU"}
              </button>

              <button
                type="button"
                onClick={() => router.back()}
                className="text-center text-sm text-[#6b80aa] hover:underline"
              >
                Hủy, quay lại
              </button>
            </form>
          )}
        </section>
      </div>
    </main>
  );
}
