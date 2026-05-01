import {
  AccountCredential,
  Category,
  Order,
  OrderStatus,
  PaymentInvoice,
  Product,
  UserSummary
} from "@/lib/types";

export const categories: Category[] = [
  {
    id: "cat-claude",
    slug: "claude",
    name: "Claude",
    description: "Tai khoan Claude cho nghien cuu va viet noi dung chuyen sau."
  },
  {
    id: "cat-cursor",
    slug: "cursor",
    name: "Cursor",
    description: "Goi Cursor Pro cho lap trinh va review code nhanh."
  },
  {
    id: "cat-chatgpt",
    slug: "chatgpt",
    name: "ChatGPT",
    description: "Tai khoan ChatGPT Plus/Team theo chu ky linh hoat."
  },
  {
    id: "cat-gemini",
    slug: "gemini",
    name: "Gemini",
    description: "Tai khoan Gemini nang cao cho cong viec da phuong tien."
  }
];

export const products: Product[] = [
  {
    id: "prd-claude-max-1m",
    slug: "claude-max-1-thang",
    name: "Claude Max 1 thang",
    category: "claude",
    shortDescription: "Dung cho phan tich tai lieu dai, toan bo model Claude moi nhat.",
    fullDescription:
      "Goi Claude Max 1 thang phu hop cho user can toc do cao, quota lon va uu tien trong gio cao diem.",
    duration: "30 ngay",
    price: 690000,
    currency: "VND",
    stock: 34,
    status: "in_stock",
    seoDescription: "Mua Claude Max 1 thang gia tot, kich hoat sau khi admin duyet.",
    keywords: ["claude max", "claude 1 thang", "tai khoan claude"]
  },
  {
    id: "prd-cursor-pro-1m",
    slug: "cursor-pro-1-thang",
    name: "Cursor Pro 1 thang",
    category: "cursor",
    shortDescription: "Ho tro agent coding, autocomplete thong minh va review pull request.",
    fullDescription:
      "Goi Cursor Pro cho nhom ky su can workflow code nhanh va on dinh tren nhieu du an.",
    duration: "30 ngay",
    price: 520000,
    currency: "VND",
    stock: 12,
    status: "limited",
    seoDescription: "Tai khoan Cursor Pro 1 thang ban giao sau buoc admin xac minh giao dich.",
    keywords: ["cursor pro", "tai khoan cursor", "cursor monthly"]
  },
  {
    id: "prd-chatgpt-plus-1m",
    slug: "chatgpt-plus-1-thang",
    name: "ChatGPT Plus 1 thang",
    category: "chatgpt",
    shortDescription: "Su dung GPT cap cao, voice, image va cac tinh nang moi nhat.",
    fullDescription:
      "Goi ChatGPT Plus phu hop cho hoc tap va cong viec hang ngay, cap nhat lien tuc theo OpenAI.",
    duration: "30 ngay",
    price: 390000,
    currency: "VND",
    stock: 43,
    status: "in_stock",
    seoDescription: "Mua tai khoan ChatGPT Plus gia hop ly, quy trinh thanh toan PayOS ro rang.",
    keywords: ["chatgpt plus", "tai khoan chatgpt", "gpt plus"]
  },
  {
    id: "prd-gemini-advanced-1m",
    slug: "gemini-advanced-1-thang",
    name: "Gemini Advanced 1 thang",
    category: "gemini",
    shortDescription: "Toi uu cho tong hop thong tin va xu ly du lieu da nguon.",
    fullDescription:
      "Gemini Advanced da bao gom cac cong cu nang cao, phu hop cho nhu cau nghien cuu da kenh.",
    duration: "30 ngay",
    price: 450000,
    currency: "VND",
    stock: 0,
    status: "out_of_stock",
    seoDescription: "Gemini Advanced 1 thang, hien thi ton kho va trang thai don minh bach.",
    keywords: ["gemini advanced", "google gemini", "tai khoan gemini"]
  },
  {
    id: "prd-claude-team-3m",
    slug: "claude-team-3-thang",
    name: "Claude Team 3 thang",
    category: "claude",
    shortDescription: "Goi cho doi nhom, chia se workspace va quan tri truy cap.",
    fullDescription:
      "Goi Claude Team 3 thang phu hop startup va agency can cong cu AI on dinh cho nhieu thanh vien.",
    duration: "90 ngay",
    price: 1790000,
    currency: "VND",
    stock: 8,
    status: "limited",
    seoDescription: "Claude Team 3 thang cho nhom, co quy trinh admin duyet truoc khi ban giao.",
    keywords: ["claude team", "claude doanh nghiep", "tai khoan ai team"]
  },
  {
    id: "prd-cursor-business-3m",
    slug: "cursor-business-3-thang",
    name: "Cursor Business 3 thang",
    category: "cursor",
    shortDescription: "Mo rong cho team code, quan ly policy va logging.",
    fullDescription:
      "Goi Cursor Business 3 thang danh cho doanh nghiep can bao mat va kha nang quan tri tap trung.",
    duration: "90 ngay",
    price: 1950000,
    currency: "VND",
    stock: 6,
    status: "limited",
    seoDescription: "Cursor Business 3 thang cho team ky su, thanh toan PayOS va cho admin phe duyet.",
    keywords: ["cursor business", "cursor team", "tai khoan cursor doanh nghiep"]
  }
];

export const orders: Order[] = [
  {
    id: "ORD-2026-00018",
    userName: "Nguyen Hoang",
    createdAt: "2026-04-25T10:30:00+07:00",
    productName: "Cursor Pro 1 thang",
    amount: 520000,
    status: "paid_waiting_review",
    paymentRef: "PAYOS-992183"
  },
  {
    id: "ORD-2026-00017",
    userName: "Le Thu An",
    createdAt: "2026-04-24T14:08:00+07:00",
    productName: "ChatGPT Plus 1 thang",
    amount: 390000,
    status: "completed",
    paymentRef: "PAYOS-992170"
  },
  {
    id: "ORD-2026-00016",
    userName: "Tran Minh Quang",
    createdAt: "2026-04-24T09:12:00+07:00",
    productName: "Claude Max 1 thang",
    amount: 690000,
    status: "approved",
    paymentRef: "PAYOS-992162"
  },
  {
    id: "ORD-2026-00015",
    userName: "Pham Hai Yen",
    createdAt: "2026-04-22T17:20:00+07:00",
    productName: "Gemini Advanced 1 thang",
    amount: 450000,
    status: "cancelled",
    paymentRef: "PAYOS-992111"
  }
];

export const invoices: PaymentInvoice[] = [
  {
    invoiceCode: "INV-2026-0415",
    orderId: "ORD-2026-00018",
    provider: "PayOS",
    amount: 520000,
    paidAt: "2026-04-25T10:28:00+07:00",
    bankCode: "VCB",
    status: "waiting_admin"
  },
  {
    invoiceCode: "INV-2026-0414",
    orderId: "ORD-2026-00017",
    provider: "PayOS",
    amount: 390000,
    paidAt: "2026-04-24T14:05:00+07:00",
    bankCode: "TPB",
    status: "verified"
  },
  {
    invoiceCode: "INV-2026-0413",
    orderId: "ORD-2026-00016",
    provider: "PayOS",
    amount: 690000,
    paidAt: "2026-04-24T09:09:00+07:00",
    bankCode: "ACB",
    status: "verified"
  }
];

export const credentials: AccountCredential[] = [
  {
    id: "CR-001",
    productName: "Cursor Pro 1 thang",
    username: "cursor_user_112",
    email: "cursor112@stock.local",
    status: "assigned",
    assignedOrder: "ORD-2026-00018"
  },
  {
    id: "CR-002",
    productName: "ChatGPT Plus 1 thang",
    username: "plus_user_199",
    email: "plus199@stock.local",
    status: "sold",
    assignedOrder: "ORD-2026-00017"
  },
  {
    id: "CR-003",
    productName: "Claude Max 1 thang",
    username: "claude_300",
    email: "claude300@stock.local",
    status: "available"
  }
];

export const userSummaries: UserSummary[] = [
  {
    id: "USR-0098",
    fullName: "Nguyen Hoang",
    email: "hoang98@example.com",
    joinDate: "2026-02-14",
    totalOrders: 4,
    status: "active"
  },
  {
    id: "USR-0087",
    fullName: "Le Thu An",
    email: "an.le@example.com",
    joinDate: "2026-01-05",
    totalOrders: 8,
    status: "active"
  },
  {
    id: "USR-0062",
    fullName: "Pham Hai Yen",
    email: "yen.pham@example.com",
    joinDate: "2025-12-20",
    totalOrders: 2,
    status: "locked"
  }
];

export const dashboardStats = {
  revenueToday: 12680000,
  totalOrdersToday: 42,
  waitingApproval: 9,
  productsInStock: products.filter((item) => item.stock > 0).length,
  newCustomersThisWeek: 31
};

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((product) => product.slug === slug);
}

export function getRelatedProducts(product: Product): Product[] {
  return products
    .filter((item) => item.category === product.category && item.id !== product.id)
    .slice(0, 3);
}

export function toCurrency(amount: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0
  }).format(amount);
}

export function getOrderStatusLabel(status: OrderStatus): string {
  const map: Record<OrderStatus, string> = {
    pending_payment: "Cho thanh toan",
    paid_waiting_review: "Da thanh toan - cho duyet",
    approved: "Da duyet",
    completed: "Hoan tat",
    cancelled: "Da huy"
  };

  return map[status];
}
