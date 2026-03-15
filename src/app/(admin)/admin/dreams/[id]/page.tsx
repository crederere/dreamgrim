"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Eye, EyeOff, Trash2 } from "lucide-react";
import Image from "next/image";
import AdminBadge from "@/components/admin/AdminBadge";
import AdminModal, { AdminButton } from "@/components/admin/AdminModal";
import { format } from "date-fns";

interface DreamDetail {
  id: string;
  dream_text: string;
  interpretation: string | null;
  artwork_url: string | null;
  artwork_thumbnail_url: string | null;
  artwork_style: string;
  is_paid: boolean;
  is_public: boolean;
  shared_count: number;
  share_token: string | null;
  detailed_report: Record<string, unknown> | null;
  created_at: string;
  user_id: string | null;
}

export default function AdminDreamDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [dream, setDream] = useState<DreamDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState(false);
  const [updating, setUpdating] = useState(false);

  const fetchDream = () => {
    fetch(`/api/admin/dreams/${params.id}`)
      .then((r) => r.json())
      .then((d) => setDream(d.dream))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchDream(); }, [params.id]);

  const togglePublic = async () => {
    setUpdating(true);
    await fetch(`/api/admin/dreams/${params.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_public: !dream?.is_public }),
    });
    fetchDream();
    setUpdating(false);
  };

  const handleDelete = async () => {
    setUpdating(true);
    await fetch(`/api/admin/dreams/${params.id}`, { method: "DELETE" });
    router.push("/admin/dreams");
  };

  if (loading) return <div className="glass rounded-xl h-96 animate-pulse" />;
  if (!dream) return <div className="text-center py-20 text-text-muted/30">꿈을 찾을 수 없습니다</div>;

  return (
    <div className="space-y-6 max-w-4xl">
      <button onClick={() => router.push("/admin/dreams")} className="flex items-center gap-2 text-[13px] text-text-muted/40 hover:text-text-secondary transition-colors">
        <ArrowLeft className="w-4 h-4" /> 꿈 목록
      </button>

      <div className="flex items-start justify-between">
        <div className="flex gap-2">
          <AdminBadge variant="default">{dream.artwork_style}</AdminBadge>
          {dream.is_paid && <AdminBadge variant="gold">유료</AdminBadge>}
          {dream.is_public ? <AdminBadge variant="green">공개</AdminBadge> : <AdminBadge variant="default">비공개</AdminBadge>}
        </div>
        <span className="text-[11px] text-text-muted/25">{format(new Date(dream.created_at), "yyyy.MM.dd HH:mm:ss")}</span>
      </div>

      {/* Artwork */}
      {dream.artwork_url && (
        <div className="glass rounded-xl overflow-hidden">
          <div className="relative aspect-square max-w-md mx-auto">
            <Image src={dream.artwork_url} alt="Dream artwork" fill className="object-cover" unoptimized />
          </div>
        </div>
      )}

      {/* Dream text */}
      <div className="glass rounded-xl p-6">
        <h3 className="text-[13px] font-semibold text-text-primary mb-3">꿈 내용</h3>
        <p className="text-[13px] text-text-secondary/60 leading-relaxed whitespace-pre-wrap">{dream.dream_text}</p>
      </div>

      {/* Interpretation */}
      {dream.interpretation && (
        <div className="glass rounded-xl p-6">
          <h3 className="text-[13px] font-semibold text-text-primary mb-3">해석</h3>
          <p className="text-[13px] text-text-secondary/60 leading-relaxed whitespace-pre-wrap">{dream.interpretation}</p>
        </div>
      )}

      {/* Detailed report */}
      {dream.detailed_report && (
        <div className="glass rounded-xl p-6">
          <h3 className="text-[13px] font-semibold text-text-primary mb-3">상세 리포트</h3>
          <pre className="text-[11px] text-text-muted/40 overflow-x-auto whitespace-pre-wrap">
            {JSON.stringify(dream.detailed_report, null, 2)}
          </pre>
        </div>
      )}

      {/* Meta */}
      <div className="glass rounded-xl p-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-[13px]">
          <div><p className="text-[10px] text-text-muted/30 mb-1">유저 ID</p><p className="text-text-secondary/60">{dream.user_id ?? "비회원"}</p></div>
          <div><p className="text-[10px] text-text-muted/30 mb-1">공유 수</p><p className="text-text-secondary/60">{dream.shared_count}</p></div>
          <div><p className="text-[10px] text-text-muted/30 mb-1">공유 토큰</p><p className="text-text-secondary/60">{dream.share_token ?? "—"}</p></div>
          <div><p className="text-[10px] text-text-muted/30 mb-1">스타일</p><p className="text-text-secondary/60">{dream.artwork_style}</p></div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <AdminButton onClick={togglePublic} disabled={updating}>
          {dream.is_public ? <><EyeOff className="w-3.5 h-3.5 mr-1.5 inline" /> 비공개로 변경</> : <><Eye className="w-3.5 h-3.5 mr-1.5 inline" /> 공개로 변경</>}
        </AdminButton>
        <AdminButton variant="danger" onClick={() => setDeleteModal(true)} disabled={updating}>
          <Trash2 className="w-3.5 h-3.5 mr-1.5 inline" /> 삭제
        </AdminButton>
      </div>

      <AdminModal open={deleteModal} onClose={() => setDeleteModal(false)} title="꿈 삭제" size="sm"
        footer={
          <>
            <AdminButton onClick={() => setDeleteModal(false)}>취소</AdminButton>
            <AdminButton variant="danger" onClick={handleDelete} disabled={updating}>삭제 확정</AdminButton>
          </>
        }
      >
        <p className="text-[13px] text-text-secondary/60">이 꿈 데이터를 영구적으로 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.</p>
      </AdminModal>
    </div>
  );
}
