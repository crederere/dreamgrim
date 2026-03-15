"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DataTable, { type Column } from "@/components/admin/DataTable";
import AdminBadge from "@/components/admin/AdminBadge";
import { type AdminOrder, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS, type OrderStatus } from "@/types/admin";
import { format } from "date-fns";

const STATUS_OPTIONS = [
  { value: "all", label: "전체" },
  { value: "pending", label: "대기" },
  { value: "paid", label: "결제완료" },
  { value: "processing", label: "처리중" },
  { value: "shipped", label: "배송중" },
  { value: "completed", label: "완료" },
  { value: "refunded", label: "환불" },
  { value: "cancelled", label: "취소" },
];

export default function AdminOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    setLoading(true);
    const params = statusFilter !== "all" ? `?status=${statusFilter}` : "";
    fetch(`/api/admin/orders${params}`)
      .then((r) => r.json())
      .then((d) => setOrders(d.orders ?? []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [statusFilter]);

  const columns: Column<AdminOrder>[] = [
    {
      key: "order_type",
      label: "상품",
      render: (row) => <span className="text-text-primary/80 font-medium">{row.order_type}</span>,
    },
    {
      key: "amount",
      label: "금액",
      sortable: true,
      render: (row) => `₩${(row.amount ?? 0).toLocaleString()}`,
    },
    {
      key: "status",
      label: "상태",
      render: (row) => (
        <AdminBadge variant="custom" className={ORDER_STATUS_COLORS[row.status as OrderStatus] ?? ""}>
          {ORDER_STATUS_LABELS[row.status as OrderStatus] ?? row.status}
        </AdminBadge>
      ),
    },
    {
      key: "payment_method",
      label: "결제수단",
      render: (row) => row.payment_method ?? "—",
    },
    {
      key: "tracking_number",
      label: "송장번호",
      render: (row) => row.tracking_number ?? "—",
    },
    {
      key: "created_at",
      label: "일시",
      sortable: true,
      render: (row) => format(new Date(row.created_at), "yy.MM.dd HH:mm"),
    },
  ];

  if (loading) {
    return <div className="glass rounded-xl h-96 animate-pulse" />;
  }

  return (
    <div className="space-y-4">
      {/* Status filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {STATUS_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setStatusFilter(opt.value)}
            className={`rounded-lg px-3 py-1.5 text-[12px] font-medium border transition-colors ${
              statusFilter === opt.value
                ? "bg-primary-500/15 text-primary-300 border-primary-500/20"
                : "bg-white/[0.02] text-text-muted/40 border-white/[0.04] hover:text-text-muted/60"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <DataTable
        columns={columns as unknown as Column<Record<string, unknown>>[]}
        data={orders as unknown as Record<string, unknown>[]}
        searchKeys={["order_type", "payment_method", "tracking_number"]}
        searchPlaceholder="주문 검색..."
        onRowClick={(row) => router.push(`/admin/orders/${(row as unknown as AdminOrder).id}`)}
      />
    </div>
  );
}
