import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/app-shell";

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["vietnamese", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-be-vietnam",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://taikhoanai.local";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "TaiKhoanAI | Nen tang tai khoan so",
    template: "%s | TaiKhoanAI"
  },
  description: "Nen tang mua tai khoan so voi thanh toan minh bach va ho tro nhanh.",
  alternates: { canonical: "/" },
  icons: {
    icon: "/logo.png",
    apple: "/logo.png"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning className={beVietnamPro.variable}>
      <body suppressHydrationWarning>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}