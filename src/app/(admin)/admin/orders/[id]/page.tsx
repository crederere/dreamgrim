"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Package, Truck, RefreshCw } from "lucide-react";
import AdminBadge from "@/components/admin/AdminBadge";
import AdminInput from "@/components/admin/AdminInput";
import AdminModal, { AdminButton } from "@/components/admin/AdminModal";
import { type AdminOrder, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS, type OrderStatus } from "@/types/admin";
import { format } from "date-fns";

const NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus[]>> = {
  pending: ["paid", "cancelled"],
  paid: ["processing", "refunded"],
  processing: ["shipped", "refunded"],
  shipped: ["completed"],
};

export default function AdminOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<AdminOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [trackingModal, setTrackingModal] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState("");
  const [refundModal, setRefundModal] = useState(false);

  const fetchOrder = () => {
    fetch(`/api/admin/orders/${params.id}`)
      .then((r) => r.json())
      .then((d) => setOrder(d.order))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchOrder(); }, [params.id]);

  const updateStatus = async (status: string) => {
    setUpdating(true);
    await fetch(`/api/admin/orders/${params.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    fetchOrder();
    setUpdating(false);
    setRefundModal(false);
  };

  const addTracking = async () => {
    if (!trackingNumber.trim()) return;
    setUpdating(true);
    await fetch(`/api/admin/orders/${params.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tracking_number: trackingNumber, status: "shipped" }),
    });
    fetchOrder();
    setUpdating(false);
    setTrackingModal(false);
  };

  if (loading) return <div className="glass rounded-xl h-96 animate-pulse" />;
  if (!order) return <div className="text-center py-20 text-text-muted/30">주문을 찾을 수 없습니다</div>;

  const nextStatuses = NEXT_STATUS[order.status as OrderStatus] ?? [];

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Back */}
      <button onClick={() => router.push("/admin/orders")} className="flex items-center gap-2 text-[13px] text-text-muted/40 hover:text-text-secondary transition-colors">
        <ArrowLeft className="w-4 h-4" /> 주문 목록
      </button>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[18px] font-bold text-text-primary">{order.order_type}</h2>
          <p className="text-[12px] text-text-muted/30 mt-1">ID: {order.id}</p>
        </div>
        <AdminBadge variant="custom" className={ORDER_STATUS_COLORS[order.status as OrderStatus] ?? ""}>
          {ORDER_STATUS_LABELS[order.status as OrderStatus] ?? order.status}
        </AdminBadge>
      </div>

      {/* Info grid */}
      <div className="glass rounded-xl p-6">
        <div className="grid grid-cols-2 gap-y-5 gap-x-8 text-[13px]">
          <InfoRow label="금액" value={`₩${(order.amount ?? 0).toLocaleString()}`} />
          <InfoRow label="결제수단" value={order.payment_method ?? "—"} />
          <InfoRow label="주문일시" value={format(new Date(order.created_at), "yyyy.MM.dd HH:mm:ss")} />
          <InfoRow label="수정일시" value={format(new Date(order.updated_at), "yyyy.MM.dd HH:mm:ss")} />
          <InfoRow label="유저 ID" value={order.user_id ?? "비회원"} />
          <InfoRow label="꿈 ID" value={order.dream_id ?? "—"} />
          {order.shipping_name && <InfoRow label="수령인" value={order.shipping_name} />}
          {order.shipping_phone && <InfoRow label="연락처" value={order.shipping_phone} />}
          {order.shipping_address && <InfoRow label="주소" value={order.shipping_address} />}
          {order.tracking_number && <InfoRow label="송장번호" value={order.tracking_number} />}
          {order.refund_reason && <InfoRow label="환불사유" value={order.refund_reason} />}
          {order.refunded_at && <InfoRow label="환불일시" value={format(new Date(order.refunded_at), "yyyy.MM.dd HH:mm")} />}
        </div>
      </div>

      {/* Actions */}
      {nextStatuses.length > 0 && (
        <div className="glass rounded-xl p-6">
          <h3 className="text-[13px] font-semibold text-text-primary mb-4">상태 변경</h3>
          <div className="flex gap-3 flex-wrap">
            {nextStatuses.map((s) =>
              s === "refunded" ? (
                <AdminButton key={s} variant="danger" onClick={() => setRefundModal(true)} disabled={updating}>
                  <RefreshCw className="w-3.5 h-3.5 mr-1.5 inline" /> 환불 처리
                </AdminButton>
              ) : s === "shipped" ? (
                <AdminButton key={s} variant="primary" onClick={() => setTrackingModal(true)} disabled={updating}>
                  <Truck className="w-3.5 h-3.5 mr-1.5 inline" /> 배송 처리
                </AdminButton>
              ) : (
                <AdminButton key={s} variant="primary" onClick={() => updateStatus(s)} disabled={updating}>
                  <Package className="w-3.5 h-3.5 mr-1.5 inline" /> {ORDER_STATUS_LABELS[s]}
                </AdminButton>
              ),
            )}
          </div>
        </div>
      )}

      {/* Tracking Modal */}
      <AdminModal open={trackingModal} onClose={() => setTrackingModal(false)} title="송장번호 입력" size="sm"
        footer={
          <>
            <AdminButton onClick={() => setTrackingModal(false)}>취소</AdminButton>
            <AdminButton variant="primary" onClick={addTracking} disabled={updating}>배송 처리</AdminButton>
          </>
        }
      >
        <AdminInput label="송장번호" value={trackingNumber} onChange={(e) => setTrackingNumber(e.target.value)} placeholder="송장번호를 입력하세요" />
      </AdminModal>

      {/* Refund Modal */}
      <AdminModal open={refundModal} onClose={() => setRefundModal(false)} title="환불 처리" size="sm"
        footer={
          <>
            <AdminButton onClick={() => setRefundModal(false)}>취소</AdminButton>
            <AdminButton variant="danger" onClick={() => updateStatus("refunded")} disabled={updating}>환불 확정</AdminButton>
          </>
        }
      >
        <p className="text-[13px] text-text-secondary/60">
          이 주문을 환불 처리하시겠습니까? ₩{(order.amount ?? 0).toLocaleString()} 금액이 환불됩니다.
        </p>
      </AdminModal>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] text-text-muted/35 mb-1">{label}</p>
      <p className="text-text-secondary/70">{value}</p>
    </div>
  );
}
