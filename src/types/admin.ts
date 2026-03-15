export interface AdminUser {
  id: string;
  email: string;
  name: string | null;
  subscription_status: string;
  free_credits: number;
  total_dreams: number;
  total_paid_amount: number;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

export interface AdminDream {
  id: string;
  user_id: string | null;
  dream_text: string;
  interpretation: string | null;
  artwork_url: string | null;
  artwork_thumbnail_url: string | null;
  artwork_style: string;
  is_paid: boolean;
  is_public: boolean;
  shared_count: number;
  share_token: string | null;
  created_at: string;
}

export interface AdminOrder {
  id: string;
  user_id: string | null;
  dream_id: string | null;
  order_type: string;
  amount: number;
  status: string;
  payment_method: string | null;
  payment_key: string | null;
  shipping_name: string | null;
  shipping_phone: string | null;
  shipping_address: string | null;
  tracking_number: string | null;
  refund_reason: string | null;
  refunded_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface AdminSeoPage {
  id: string;
  slug: string;
  keyword_ko: string;
  tier: number;
  title: string;
  meta_description: string;
  h1_title: string;
  hero_artwork_url: string | null;
  intro_text: string;
  situations: Array<{ title: string; description: string }>;
  faq: Array<{ question: string; answer: string }>;
  related_slugs: string[];
  monthly_search_volume: number;
  current_rank: number | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export type OrderStatus = "pending" | "paid" | "processing" | "shipped" | "completed" | "refunded" | "cancelled";

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "대기",
  paid: "결제완료",
  processing: "처리중",
  shipped: "배송중",
  completed: "완료",
  refunded: "환불",
  cancelled: "취소",
};

export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  pending: "bg-yellow-500/15 text-yellow-300 border-yellow-500/20",
  paid: "bg-blue-500/15 text-blue-300 border-blue-500/20",
  processing: "bg-primary-500/15 text-primary-300 border-primary-500/20",
  shipped: "bg-cyan-500/15 text-cyan-300 border-cyan-500/20",
  completed: "bg-fortune-high/15 text-fortune-high border-fortune-high/20",
  refunded: "bg-fortune-low/15 text-fortune-low border-fortune-low/20",
  cancelled: "bg-white/5 text-text-muted/50 border-white/10",
};
