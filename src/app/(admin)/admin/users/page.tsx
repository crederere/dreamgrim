"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DataTable, { type Column } from "@/components/admin/DataTable";
import AdminBadge from "@/components/admin/AdminBadge";
import type { AdminUser } from "@/types/admin";
import { format } from "date-fns";

const SUB_BADGE: Record<string, { label: string; variant: "green" | "gold" | "default" | "red" }> = {
  active: { label: "구독중", variant: "green" },
  free: { label: "무료", variant: "default" },
  cancelled: { label: "해지", variant: "gold" },
  suspended: { label: "정지", variant: "red" },
};

export default function AdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/users")
      .then((r) => r.json())
      .then((d) => setUsers(d.users ?? []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const columns: Column<AdminUser>[] = [
    {
      key: "email",
      label: "이메일",
      render: (row) => (
        <div>
          <span className="text-text-primary/80 font-medium">{row.email ?? "—"}</span>
          {row.is_admin && <AdminBadge variant="primary" className="ml-2">Admin</AdminBadge>}
        </div>
      ),
    },
    {
      key: "name",
      label: "이름",
      render: (row) => row.name ?? "—",
    },
    {
      key: "subscription_status",
      label: "구독",
      render: (row) => {
        const info = SUB_BADGE[row.subscription_status] ?? { label: row.subscription_status, variant: "default" as const };
        return <AdminBadge variant={info.variant}>{info.label}</AdminBadge>;
      },
    },
    {
      key: "total_dreams",
      label: "꿈",
      sortable: true,
      className: "text-center",
      render: (row) => <span className="text-text-muted/50">{row.total_dreams}</span>,
    },
    {
      key: "total_paid_amount",
      label: "결제액",
      sortable: true,
      render: (row) => row.total_paid_amount > 0 ? `₩${row.total_paid_amount.toLocaleString()}` : "—",
    },
    {
      key: "free_credits",
      label: "크레딧",
      className: "text-center",
      render: (row) => <span className="text-text-muted/50">{row.free_credits}</span>,
    },
    {
      key: "created_at",
      label: "가입일",
      sortable: true,
      render: (row) => format(new Date(row.created_at), "yy.MM.dd"),
    },
  ];

  if (loading) return <div className="glass rounded-xl h-96 animate-pulse" />;

  return (
    <DataTable
      columns={columns as unknown as Column<Record<string, unknown>>[]}
      data={users as unknown as Record<string, unknown>[]}
      searchKeys={["email", "name"]}
      searchPlaceholder="이메일 또는 이름으로 검색..."
      onRowClick={(row) => router.push(`/admin/users/${(row as unknown as AdminUser).id}`)}
    />
  );
}
