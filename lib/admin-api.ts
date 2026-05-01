export type AdminRole = "admin" | "buyer";

export interface ApiUser {
  id: string;
  username: string;
  email: string;
  balance: number;
  role?: {
    id: string;
    name: AdminRole;
    description?: string;
  };
  createdAt: string;
}

export type UserTransactionType = "credit" | "debit";

export interface ApiUserTransaction {
  id: string;
  userId: string;
  type: UserTransactionType;
  amount: number;
  reason: string;
  createdAt: string;
}

export interface ApiCategory {
  id: string;
  name: string;
  slug: string;
  imageUrl?: string;
  createdAt: string;
}

export interface ApiCountry {
  id: string;
  name: string;
  imgUrl?: string;
  createdAt: string;
}

export interface ApiContact {
  id: string;
  telegram?: string;
  phone?: string;
  createdAt: string;
}

export interface ApiProduct {
  id: string;
  name: string;
  slug: string;
  stockQuantity: number;
  soldQuantity: number;
  minPurchaseQuantity: number;
  price: number;
  note?: string;
  highlight?: string;
  imageUrl?: string;
  categoryId: string;
  countryId: string;
  category?: ApiCategory;
  country?: ApiCountry;
  createdAt: string;
}

export interface ApiPaymentInfo {
  id: string;
  accountNumber: string;
  transferContent: string;
  accountHolder: string;
  bankName: string;
  qrImageUrl?: string;
  note?: string;
  createdAt: string;
}

export interface ApiOrderItem {
  id: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  product?: ApiProduct;
}

export interface ApiOrder {
  id: string;
  userId: string;
  totalAmount: number;
  status: "pending" | "paid" | "cancelled";
  items: ApiOrderItem[];
  createdAt: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api";

interface ApiErrorBody {
  message?: string | string[];
}

function getToken(): string {
  if (typeof window === "undefined") {
    throw new Error("Admin API is only available in browser context");
  }

  const token = localStorage.getItem("accessToken");
  if (!token) {
    throw new Error("Missing access token. Please log in again.");
  }

  return token;
}

function createHeaders(hasBody: boolean, bearerToken: string): HeadersInit {
  const headers: Record<string, string> = {
    Authorization: `Bearer ${bearerToken}`
  };

  if (hasBody) {
    headers["Content-Type"] = "application/json";
  }

  return headers;
}

async function readErrorMessage(response: Response): Promise<string> {
  let fallback = `Request failed (${response.status})`;

  if (response.status === 401 || response.status === 403) {
    fallback = "You are not authorized to perform this action";
  }

  try {
    const body = (await response.json()) as ApiErrorBody;
    const message = body.message;
    if (Array.isArray(message) && message.length > 0) {
      return message[0];
    }

    if (typeof message === "string" && message.trim().length > 0) {
      return message;
    }
  } catch {
    // Ignore malformed JSON body and fallback.
  }

  return fallback;
}

async function apiRequest<T>(
  path: string,
  options: {
    method?: "GET" | "POST" | "PATCH" | "DELETE";
    body?: unknown;
  } = {}
): Promise<T> {
  const token = getToken();
  const method = options.method ?? "GET";
  const hasBody = options.body !== undefined;

  const response = await fetch(`${API_BASE}${path}`, {
    method,
    headers: createHeaders(hasBody, token),
    body: hasBody ? JSON.stringify(options.body) : undefined
  });

  if (!response.ok) {
    throw new Error(await readErrorMessage(response));
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export async function uploadImage(
  scope: "countries" | "categories" | "products",
  file: File
): Promise<{ key: string; imageUrl?: string; imgUrl?: string; url?: string }> {
  const token = getToken();
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE}/${scope}/upload-image`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: formData
  });

  if (!response.ok) {
    throw new Error(await readErrorMessage(response));
  }

  return (await response.json()) as {
    key: string;
    imageUrl?: string;
    imgUrl?: string;
    url?: string;
  };
}

export async function uploadToStorage(file: File, folder = "payments"): Promise<{ key: string; url: string }> {
  const token = getToken();
  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", folder);

  const response = await fetch(`${API_BASE}/storage/upload`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: formData
  });

  if (!response.ok) {
    throw new Error(await readErrorMessage(response));
  }

  return (await response.json()) as { key: string; url: string };
}

export function getCurrentAuthUser(): { id: string; username: string; role: AdminRole } | null {
  if (typeof window === "undefined") {
    return null;
  }

  const value = localStorage.getItem("authUser");
  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value) as { id: string; username: string; role: AdminRole };
  } catch {
    return null;
  }
}

export async function getUsers() {
  return apiRequest<ApiUser[]>("/users");
}

export async function createUser(payload: {
  username: string;
  email: string;
  password: string;
  role: AdminRole;
  balance?: number;
}) {
  return apiRequest<ApiUser>("/users", { method: "POST", body: payload });
}

export async function updateUser(
  userId: string,
  payload: Partial<{ username: string; email: string; password: string; role: AdminRole; balance: number }>
) {
  return apiRequest<ApiUser>(`/users/${userId}`, { method: "PATCH", body: payload });
}

export async function getUserTransactions(userId: string) {
  return apiRequest<ApiUserTransaction[]>(`/users/${userId}/transactions`);
}

export async function createUserTransaction(
  userId: string,
  payload: { type: UserTransactionType; amount: number; reason: string }
) {
  return apiRequest<ApiUserTransaction>(`/users/${userId}/transactions`, {
    method: "POST",
    body: payload
  });
}

export async function getCategories() {
  return apiRequest<ApiCategory[]>("/categories");
}

export async function createCategory(payload: {
  name: string;
  slug: string;
  imageUrl?: string;
}) {
  return apiRequest<ApiCategory>("/categories", { method: "POST", body: payload });
}

export async function updateCategory(categoryId: string, payload: Partial<{ name: string; slug: string; imageUrl?: string }>) {
  return apiRequest<ApiCategory>(`/categories/${categoryId}`, { method: "PATCH", body: payload });
}

export async function deleteCategory(categoryId: string) {
  return apiRequest<{ success: boolean }>(`/categories/${categoryId}`, { method: "DELETE" });
}

export async function getCountries() {
  return apiRequest<ApiCountry[]>("/countries");
}

export async function getContacts() {
  return apiRequest<ApiContact[]>("/contacts");
}

export async function createContact(payload: { telegram?: string; phone?: string }) {
  return apiRequest<ApiContact>("/contacts", { method: "POST", body: payload });
}

export async function updateContact(contactId: string, payload: Partial<{ telegram?: string; phone?: string }>) {
  return apiRequest<ApiContact>(`/contacts/${contactId}`, { method: "PATCH", body: payload });
}

export async function deleteContact(contactId: string) {
  return apiRequest<{ success: boolean }>(`/contacts/${contactId}`, { method: "DELETE" });
}

export async function createCountry(payload: { name: string; imgUrl?: string }) {
  return apiRequest<ApiCountry>("/countries", { method: "POST", body: payload });
}

export async function updateCountry(countryId: string, payload: Partial<{ name: string; imgUrl?: string }>) {
  return apiRequest<ApiCountry>(`/countries/${countryId}`, { method: "PATCH", body: payload });
}

export async function deleteCountry(countryId: string) {
  return apiRequest<{ success: boolean }>(`/countries/${countryId}`, { method: "DELETE" });
}

export async function getProducts() {
  return apiRequest<ApiProduct[]>("/products");
}

export async function createProduct(payload: {
  name: string;
  slug: string;
  categoryId: string;
  countryId: string;
  stockQuantity: number;
  soldQuantity?: number;
  minPurchaseQuantity: number;
  price: number;
  note?: string;
  highlight?: string;
  imageUrl?: string;
}) {
  return apiRequest<ApiProduct>("/products", { method: "POST", body: payload });
}

export async function updateProduct(
  productId: string,
  payload: Partial<{
    name: string;
    slug: string;
    categoryId: string;
    countryId: string;
    stockQuantity: number;
    soldQuantity: number;
    minPurchaseQuantity: number;
    price: number;
    note?: string;
    highlight?: string;
    imageUrl?: string;
  }>
) {
  return apiRequest<ApiProduct>(`/products/${productId}`, { method: "PATCH", body: payload });
}

export async function deleteProduct(productId: string) {
  return apiRequest<{ success: boolean }>(`/products/${productId}`, { method: "DELETE" });
}

export async function getPaymentInfos() {
  return apiRequest<ApiPaymentInfo[]>("/payment-info");
}

export async function createPaymentInfo(payload: {
  accountNumber: string;
  transferContent: string;
  accountHolder: string;
  bankName: string;
  qrImageUrl?: string;
  note?: string;
}) {
  return apiRequest<ApiPaymentInfo>("/payment-info", { method: "POST", body: payload });
}

export async function updatePaymentInfo(
  paymentInfoId: string,
  payload: Partial<{
    accountNumber: string;
    transferContent: string;
    accountHolder: string;
    bankName: string;
    qrImageUrl?: string;
    note?: string;
  }>
) {
  return apiRequest<ApiPaymentInfo>(`/payment-info/${paymentInfoId}`, {
    method: "PATCH",
    body: payload
  });
}

export async function deletePaymentInfo(paymentInfoId: string) {
  return apiRequest<{ success: boolean }>(`/payment-info/${paymentInfoId}`, {
    method: "DELETE"
  });
}

export async function getOrders() {
  return apiRequest<ApiOrder[]>("/orders");
}

export async function getMyOrders() {
  return apiRequest<ApiOrder[]>("/orders/my");
}

export async function getMyTransactions() {
  return apiRequest<ApiUserTransaction[]>("/auth/my-transactions");
}

// ── Deposit requests ──────────────────────────────────────
export type DepositStatus = "pending" | "approved" | "rejected";

export interface ApiDepositRequest {
  id: string;
  userId: string;
  user?: { id: string; username: string; email: string };
  amount: number;
  status: DepositStatus;
  note?: string;
  createdAt: string;
}

export async function createDepositRequest(payload: { amount: number; note?: string }) {
  return apiRequest<ApiDepositRequest>("/deposit-requests", { method: "POST", body: payload });
}

export async function getMyDepositRequests() {
  return apiRequest<ApiDepositRequest[]>("/deposit-requests/my");
}

export async function getAllDepositRequests() {
  return apiRequest<ApiDepositRequest[]>("/deposit-requests");
}

export async function approveDepositRequest(id: string) {
  return apiRequest<ApiDepositRequest>(`/deposit-requests/${id}/approve`, { method: "PATCH" });
}

export async function rejectDepositRequest(id: string) {
  return apiRequest<ApiDepositRequest>(`/deposit-requests/${id}/reject`, { method: "PATCH" });
}

export async function createOrder(payload: {
  items: Array<{ productId: string; quantity: number }>;
}) {
  return apiRequest<ApiOrder>("/orders", { method: "POST", body: payload });
}

export async function updateOrderStatus(
  orderId: string,
  status: "pending" | "paid" | "cancelled"
) {
  return apiRequest<ApiOrder>(`/orders/${orderId}/status`, {
    method: "PATCH",
    body: { status }
  });
}
