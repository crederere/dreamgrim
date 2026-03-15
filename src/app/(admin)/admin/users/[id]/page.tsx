"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, CreditCard, Crown, ShieldOff } from "lucide-react";
import AdminBadge from "@/components/admin/AdminBadge";
import AdminInput from "@/components/admin/AdminInput";
import AdminModal, { AdminButton } from "@/components/admin/AdminModal";
import type { AdminUser } from "@/types/admin";
import { format } from "date-fns";

interface UserDetail {
  user: AdminUser & Record<string, unknown>;
  dreams: Array<{ id: string; dream_text: string; artwork_style: string; is_paid: boolean; created_at: string }>;
  orders: Array<{ id: string; order_type: string; amount: number; status: string; created_at: string }>;
}

export default function AdminUserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [data, setData] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [creditModal, setCreditModal] = useState(false);
  const [newCredits, setNewCredits] = useState(0);
  const [updating, setUpdating] = useState(false);

  const fetchUser = () => {
    fetch(`/api/admin/users/${params.id}`)
      .then((r) => r.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchUser(); }, [params.id]);

  const updateUser = async (updates: Record<string, unknown>) => {
    setUpdating(true);
    await fetch(`/api/admin/users/${params.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    fetchUser();
    setUpdating(false);
    setCreditModal(false);
  };

  if (loading) return <div className="glass rounded-xl h-96 animate-pulse" />;
  if (!data) return <div className="text-center py-20 text-text-muted/30">유저를 찾을 수 없습니다</div>;

  const { user, dreams, orders } = data;

  return (
    <div className="space-y-6 max-w-4xl">
      <button onClick={() => router.push("/admin/users")} className="flex items-center gap-2 text-[13px] text-text-muted/40 hover:text-text-secondary transition-colors">
        <ArrowLeft className="w-4 h-4" /> 유저 목록
      </button>

      {/* User Info */}
      <div className="glass rounded-xl p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-[18px] font-bold text-text-primary">{user.email}</h2>
            <p className="text-[12px] text-text-muted/30 mt-1">{user.name ?? "이름 없음"} · ID: {user.id}</p>
          </div>
          {user.is_admin && <AdminBadge variant="primary">Admin</AdminBadge>}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-[13px]">
          <InfoCard label="구독 상태" value={user.subscription_status} />
          <InfoCard label="크레딧" value={String(user.free_credits)} />
          <InfoCard label="총 꿈" value={String(user.total_dreams)} />
          <InfoCard label="총 결제" value={`₩${(user.total_paid_amount ?? 0).toLocaleString()}`} />
        </div>

        <div className="flex gap-3 mt-5 flex-wrap">
          <AdminButton variant="primary" onClick={() => { setNewCredits(user.free_credits); setCreditModal(true); }}>
            <CreditCard className="w-3.5 h-3.5 mr-1.5 inline" /> 크레딧 조정
          </AdminButton>
          {user.subscription_status !== "active" ? (
            <AdminButton onClick={() => updateUser({ subscription_status: "active" })} disabled={updating}>
              <Crown className="w-3.5 h-3.5 mr-1.5 inline" /> 구독 활성화
            </AdminButton>
          ) : (
            <AdminButton variant="danger" onClick={() => updateUser({ subscription_status: "suspended" })} disabled={updating}>
              <ShieldOff className="w-3.5 h-3.5 mr-1.5 inline" /> 정지
            </AdminButton>
          )}
        </div>
      </div>

      {/* Dreams */}
      <div className="glass rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-white/[0.04]">
          <h3 className="text-[14px] font-semibold text-text-primary">꿈 내역 ({dreams.length})</h3>
        </div>
        {dreams.length === 0 ? (
          <div className="text-center py-8 text-[13px] text-text-muted/30">꿈 내역이 없습니다</div>
        ) : (
          <div className="divide-y divide-white/[0.03]">
            {dreams.map((d) => (
              <div key={d.id} className="px-5 py-3 flex items-center justify-between hover:bg-white/[0.01] cursor-pointer" onClick={() => router.push(`/admin/dreams/${d.id}`)}>
                <div className="min-w-0">
                  <p className="text-[13px] text-text-secondary/70 truncate">{d.dream_text.slice(0, 60)}</p>
                  <p className="text-[11px] text-text-muted/30 mt-0.5">{d.artwork_style}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0 ml-4">
                  {d.is_paid && <AdminBadge variant="gold">유료</AdminBadge>}
                  <span className="text-[11px] text-text-muted/25">{format(new Date(d.created_at), "yy.MM.dd")}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Orders */}
      <div className="glass rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-white/[0.04]">
          <h3 className="text-[14px] font-semibold text-text-primary">주문 내역 ({orders.length})</h3>
        </div>
        {orders.length === 0 ? (
          <div className="text-center py-8 text-[13px] text-text-muted/30">주문 내역이 없습니다</div>
        ) : (
          <div className="divide-y divide-white/[0.03]">
            {orders.map((o) => (
              <div key={o.id} className="px-5 py-3 flex items-center justify-between hover:bg-white/[0.01] cursor-pointer" onClick={() => router.push(`/admin/orders/${o.id}`)}>
                <div>
                  <p className="text-[13px] text-text-secondary/70">{o.order_type}</p>
                  <p className="text-[11px] text-text-muted/30 mt-0.5">₩{(o.amount ?? 0).toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-3">
                  <AdminBadge variant="default">{o.status}</AdminBadge>
                  <span className="text-[11px] text-text-muted/25">{format(new Date(o.created_at), "yy.MM.dd")}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Credit Modal */}
      <AdminModal open={creditModal} onClose={() => setCreditModal(false)} title="크레딧 조정" size="sm"
        footer={
          <>
            <AdminButton onClick={() => setCreditModal(false)}>취소</AdminButton>
            <AdminButton variant="primary" onClick={() => updateUser({ free_credits: newCredits })} disabled={updating}>저장</AdminButton>
          </>
        }
      >
        <AdminInput type="number" label="크레딧 수" value={newCredits} onChange={(e) => setNewCredits(parseInt(e.target.value) || 0)} min={0} />
      </AdminModal>
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-white/[0.02] border border-white/[0.03] p-3">
      <p className="text-[10px] text-text-muted/30 mb-1">{label}</p>
      <p className="text-[14px] font-semibold text-text-primary">{value}</p>
    </div>
  );
}
