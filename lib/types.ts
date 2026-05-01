export type ProductStatus = "in_stock" | "limited" | "out_of_stock";

export type OrderStatus =
  | "pending_payment"
  | "paid_waiting_review"
  | "approved"
  | "completed"
  | "cancelled";

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: string;
  shortDescription: string;
  fullDescription: string;
  duration: string;
  price: number;
  currency: "VND";
  stock: number;
  status: ProductStatus;
  seoDescription: string;
  keywords: string[];
}

export interface Order {
  id: string;
  userName: string;
  createdAt: string;
  productName: string;
  amount: number;
  status: OrderStatus;
  paymentRef: string;
}

export interface PaymentInvoice {
  invoiceCode: string;
  orderId: string;
  provider: "PayOS";
  amount: number;
  paidAt: string;
  bankCode: string;
  status: "verified" | "waiting_admin" | "rejected";
}

export interface AccountCredential {
  id: string;
  productName: string;
  username: string;
  email: string;
  status: "available" | "assigned" | "sold";
  assignedOrder?: string;
}

export interface UserSummary {
  id: string;
  fullName: string;
  email: string;
  joinDate: string;
  totalOrders: number;
  status: "active" | "locked";
}
