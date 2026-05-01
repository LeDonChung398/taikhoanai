# TaiKhoanAI Frontend (Next.js)

Giao dien FE + Admin cho he thong ban tai khoan AI theo flow:
- User dat mua san pham
- Thanh toan qua PayOS
- He thong luu hoa don
- Admin duyet giao dich
- Moi ban giao tai khoan / kich hoat

## Chay local

```bash
npm install
npm run dev
```

## Cac route chinh

- `/` trang chu storefront
- `/products` danh sach va loc san pham
- `/products/[slug]` chi tiet san pham + JSON-LD
- `/checkout` giao dien dat mua va tao link PayOS (UI)
- `/orders` lich su don cua user
- `/account` ho so nguoi dung
- `/admin` dashboard admin
- `/admin/products` quan ly san pham
- `/admin/orders` duyet don
- `/admin/payments` doi soat hoa don PayOS
- `/admin/credentials` quan ly credential account
- `/admin/users` quan ly nguoi dung

## SEO da setup

- Metadata toan site + metadata rieng tung page
- Canonical URL cho product detail
- Open Graph/Twitter card
- JSON-LD Product schema
- `app/robots.ts` (chan index khu vuc admin)
- `app/sitemap.ts` (tu dong sinh URL san pham)

## Giai doan tiep theo

- Noi API NestJS cho auth, product, order, payment, invoice
- Tich hop SDK/API PayOS tao link thanh toan + webhook
- Day du thao tac duyet don va ban giao account credential
- Tich hop xac thuc admin/user va phan quyen
