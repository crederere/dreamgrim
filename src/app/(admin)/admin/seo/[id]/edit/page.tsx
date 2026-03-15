"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Trash2, ExternalLink } from "lucide-react";
import SeoForm from "@/components/admin/SeoForm";
import AdminModal, { AdminButton } from "@/components/admin/AdminModal";

export default function AdminSeoEditPage() {
  const params = useParams();
  const router = useRouter();
  const [initialData, setInitialData] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/seo/${params.id}`)
      .then((r) => r.json())
      .then((d) => setInitialData(d.page))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [params.id]);

  const handleSave = async (data: Record<string, unknown>) => {
    setSaving(true);
    await fetch(`/api/admin/seo/${params.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setSaving(false);
  };

  const handleDelete = async () => {
    await fetch(`/api/admin/seo/${params.id}`, { method: "DELETE" });
    router.push("/admin/seo");
  };

  if (loading) return <div className="glass rounded-xl h-96 animate-pulse" />;
  if (!initialData) return <div className="text-center py-20 text-text-muted/30">페이지를 찾을 수 없습니다</div>;

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <button onClick={() => router.push("/admin/seo")} className="flex items-center gap-2 text-[13px] text-text-muted/40 hover:text-text-secondary transition-colors">
          <ArrowLeft className="w-4 h-4" /> SEO 목록
        </button>
        <div className="flex gap-3">
          <a
            href={`/dream/${initialData.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-[12px] text-primary-400/60 hover:text-primary-300 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" /> 미리보기
          </a>
          <button onClick={() => setDeleteModal(true)} className="flex items-center gap-1.5 text-[12px] text-fortune-low/60 hover:text-fortune-low transition-colors">
            <Trash2 className="w-3.5 h-3.5" /> 삭제
          </button>
        </div>
      </div>

      <h2 className="text-[18px] font-bold text-text-primary">SEO 페이지 편집</h2>
      <SeoForm initialData={initialData} onSave={handleSave} saving={saving} />

      <AdminModal open={deleteModal} onClose={() => setDeleteModal(false)} title="페이지 삭제" size="sm"
        footer={
          <>
            <AdminButton onClick={() => setDeleteModal(false)}>취소</AdminButton>
            <AdminButton variant="danger" onClick={handleDelete}>삭제</AdminButton>
          </>
        }
      >
        <p className="text-[13px] text-text-secondary/60">이 SEO 페이지를 삭제하시겠습니까?</p>
      </AdminModal>
    </div>
  );
}
