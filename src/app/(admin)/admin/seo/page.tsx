"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import DataTable, { type Column } from "@/components/admin/DataTable";
import AdminBadge from "@/components/admin/AdminBadge";

interface SeoRow {
  id: string;
  slug: string;
  keyword_ko: string;
  tier: number;
  title: string;
  is_published: boolean;
  monthly_search_volume: number;
  current_rank: number | null;
  created_at: string;
}

const TIER_BADGE: Record<number, { label: string; variant: "gold" | "primary" | "default" }> = {
  1: { label: "Tier 1", variant: "gold" },
  2: { label: "Tier 2", variant: "primary" },
  3: { label: "Tier 3", variant: "default" },
};

export default function AdminSeoPage() {
  const router = useRouter();
  const [pages, setPages] = useState<SeoRow[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPages = () => {
    fetch("/api/admin/seo")
      .then((r) => r.json())
      .then((d) => setPages(d.pages ?? []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchPages(); }, []);

  const togglePublish = async (id: string, current: boolean) => {
    await fetch(`/api/admin/seo/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_published: !current }),
    });
    fetchPages();
  };

  const columns: Column<SeoRow>[] = [
    { key: "keyword_ko", label: "키워드", render: (row) => <span className="text-text-primary/80 font-medium">{row.keyword_ko}</span> },
    { key: "slug", label: "슬러그", render: (row) => <span className="text-text-muted/40 font-mono text-[11px]">/{row.slug}</span> },
    {
      key: "tier",
      label: "티어",
      sortable: true,
      render: (row) => {
        const t = TIER_BADGE[row.tier] ?? { label: `Tier ${row.tier}`, variant: "default" as const };
        return <AdminBadge variant={t.variant}>{t.label}</AdminBadge>;
      },
    },
    {
      key: "is_published",
      label: "발행",
      className: "text-center",
      render: (row) => (
        <button
          onClick={(e) => { e.stopPropagation(); togglePublish(row.id, row.is_published); }}
          className={`w-9 h-5 rounded-full transition-colors relative ${row.is_published ? "bg-fortune-high/30" : "bg-white/[0.06]"}`}
        >
          <div className={`absolute top-0.5 w-4 h-4 rounded-full transition-all ${row.is_published ? "left-4.5 bg-fortune-high" : "left-0.5 bg-text-muted/30"}`} />
        </button>
      ),
    },
    {
      key: "monthly_search_volume",
      label: "월검색량",
      sortable: true,
      className: "text-center",
      render: (row) => <span className="text-text-muted/40">{row.monthly_search_volume.toLocaleString()}</span>,
    },
    {
      key: "current_rank",
      label: "순위",
      sortable: true,
      className: "text-center",
      render: (row) => row.current_rank ? <span className="text-text-muted/50">{row.current_rank}</span> : "—",
    },
  ];

  if (loading) return <div className="glass rounded-xl h-96 animate-pulse" />;

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          onClick={() => router.push("/admin/seo/new")}
          className="flex items-center gap-2 rounded-lg px-4 py-2 text-[13px] font-medium bg-primary-500 text-white hover:bg-primary-400 transition-colors"
        >
          <Plus className="w-4 h-4" /> 새 SEO 페이지
        </button>
      </div>

      <DataTable
        columns={columns as unknown as Column<Record<string, unknown>>[]}
        data={pages as unknown as Record<string, unknown>[]}
        searchKeys={["keyword_ko", "slug", "title"]}
        searchPlaceholder="키워드 검색..."
        onRowClick={(row) => router.push(`/admin/seo/${(row as unknown as SeoRow).id}/edit`)}
      />
    </div>
  );
}
