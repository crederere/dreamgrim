"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DataTable, { type Column } from "@/components/admin/DataTable";
import AdminBadge from "@/components/admin/AdminBadge";
import type { AdminDream } from "@/types/admin";
import { format } from "date-fns";

const STYLE_LABELS: Record<string, string> = {
  watercolor: "수채화",
  oil_painting: "유화",
  digital_art: "디지털아트",
  ghibli: "지브리",
  monochrome: "흑백",
};

export default function AdminDreamsPage() {
  const router = useRouter();
  const [dreams, setDreams] = useState<AdminDream[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ style: "all", paid: "all" });

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filter.style !== "all") params.set("style", filter.style);
    if (filter.paid !== "all") params.set("paid", filter.paid);
    const qs = params.toString();

    fetch(`/api/admin/dreams${qs ? `?${qs}` : ""}`)
      .then((r) => r.json())
      .then((d) => setDreams(d.dreams ?? []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [filter]);

  const columns: Column<AdminDream>[] = [
    {
      key: "dream_text",
      label: "꿈 내용",
      render: (row) => (
        <span className="text-text-primary/70 truncate block max-w-[300px]">
          {row.dream_text?.slice(0, 60)}{row.dream_text?.length > 60 ? "..." : ""}
        </span>
      ),
    },
    {
      key: "artwork_style",
      label: "스타일",
      render: (row) => (
        <AdminBadge variant="default">{STYLE_LABELS[row.artwork_style] ?? row.artwork_style}</AdminBadge>
      ),
    },
    {
      key: "is_paid",
      label: "유료",
      className: "text-center",
      render: (row) => row.is_paid ? <AdminBadge variant="gold">유료</AdminBadge> : <span className="text-text-muted/25">무료</span>,
    },
    {
      key: "is_public",
      label: "공개",
      className: "text-center",
      render: (row) => row.is_public ? <AdminBadge variant="green">공개</AdminBadge> : <span className="text-text-muted/25">비공개</span>,
    },
    {
      key: "shared_count",
      label: "공유",
      sortable: true,
      className: "text-center",
      render: (row) => <span className="text-text-muted/40">{row.shared_count}</span>,
    },
    {
      key: "created_at",
      label: "일시",
      sortable: true,
      render: (row) => format(new Date(row.created_at), "yy.MM.dd HH:mm"),
    },
  ];

  if (loading) return <div className="glass rounded-xl h-96 animate-pulse" />;

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex gap-4 flex-wrap">
        <div className="flex gap-2">
          {[{ value: "all", label: "전체 스타일" }, ...Object.entries(STYLE_LABELS).map(([v, l]) => ({ value: v, label: l }))].map((opt) => (
            <button
              key={opt.value}
              onClick={() => setFilter((f) => ({ ...f, style: opt.value }))}
              className={`rounded-lg px-3 py-1.5 text-[12px] font-medium border transition-colors ${
                filter.style === opt.value
                  ? "bg-primary-500/15 text-primary-300 border-primary-500/20"
                  : "bg-white/[0.02] text-text-muted/40 border-white/[0.04] hover:text-text-muted/60"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          {[{ value: "all", label: "전체" }, { value: "true", label: "유료" }, { value: "false", label: "무료" }].map((opt) => (
            <button
              key={opt.value}
              onClick={() => setFilter((f) => ({ ...f, paid: opt.value }))}
              className={`rounded-lg px-3 py-1.5 text-[12px] font-medium border transition-colors ${
                filter.paid === opt.value
                  ? "bg-gold-400/15 text-gold-300 border-gold-400/20"
                  : "bg-white/[0.02] text-text-muted/40 border-white/[0.04] hover:text-text-muted/60"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <DataTable
        columns={columns as unknown as Column<Record<string, unknown>>[]}
        data={dreams as unknown as Record<string, unknown>[]}
        searchKeys={["dream_text"]}
        searchPlaceholder="꿈 내용으로 검색..."
        onRowClick={(row) => router.push(`/admin/dreams/${(row as unknown as AdminDream).id}`)}
      />
    </div>
  );
}
