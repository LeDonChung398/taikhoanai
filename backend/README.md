# TaikhoanAI Backend

Backend API cho he thong tai khoan MMO.

## Stack

- NestJS 11
- PostgreSQL + TypeORM
- JWT authentication
- Cloudflare R2 (S3 compatible) de upload anh

## Cai dat

```bash
npm install
copy .env.example .env
npm run start:dev
```

API chay tai: `http://localhost:3001/api` (hoac `PORT` ban cau hinh).

## Env bat buoc

- `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_NAME`
- `JWT_SECRET`
- `R2_ENDPOINT`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET`

## Tao admin mac dinh

Neu set cac bien sau trong `.env`, he thong se tu seed 1 admin khi khoi dong:

- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `ADMIN_USERNAME` (mac dinh `admin`)

## Auth

- `POST /api/auth/register` (dang ky buyer)
- `POST /api/auth/login`
- `GET /api/auth/me` (Bearer token)

## Admin CRUD (can role `admin`)

- `POST/PATCH/DELETE` cho:
  - `/api/countries`
  - `/api/contacts`
  - `/api/categories`
  - `/api/products`
  - `/api/payment-info`
- Upload anh R2:
  - `/api/storage/upload`
  - `/api/countries/upload-image`
  - `/api/categories/upload-image`
  - `/api/products/upload-image`

## Public read

- `GET /api/countries`
- `GET /api/contacts`
- `GET /api/categories`
- `GET /api/products`
- `GET /api/payment-info`
