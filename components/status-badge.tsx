import { OrderStatus } from "@/lib/types";
import { getOrderStatusLabel } from "@/lib/mock-data";

const styleByStatus: Record<OrderStatus, string> = {
  pending_payment: "bg-yellow-100 text-yellow-800",
  paid_waiting_review: "bg-blue-100 text-blue-800",
  approved: "bg-indigo-100 text-indigo-800",
  completed: "bg-emerald-100 text-emerald-800",
  cancelled: "bg-red-100 text-red-800"
};

export function StatusBadge({ status }: { status: OrderStatus }) {
  return <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-0.5 text-xs font-semibold ${styleByStatus[status]}`}>{getOrderStatusLabel(status)}</span>;
}

