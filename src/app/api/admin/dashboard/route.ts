import { NextResponse } from "next/server";
import { withAdmin } from "@/lib/auth/admin";
import { createServiceClient } from "@/lib/supabase/server";

export const GET = withAdmin(async () => {
  const db = createServiceClient();

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayISO = today.toISOString();

  // Run all queries in parallel
  const [usersResult, todayDreamsResult, revenueResult, subscribersResult, recentDreams, recentOrders] =
    await Promise.all([
      db.from("users").select("*", { count: "exact", head: true }),
      db.from("dreams").select("*", { count: "exact", head: true }).gte("created_at", todayISO),
      db.from("orders").select("amount").in("status", ["paid", "completed"]),
      db.from("users").select("*", { count: "exact", head: true }).eq("subscription_status", "active"),
      db.from("dreams").select("id, dream_text, artwork_style, is_paid, created_at, user_id").order("created_at", { ascending: false }).limit(10),
      db.from("orders").select("id, order_type, amount, status, created_at, user_id").order("created_at", { ascending: false }).limit(5),
    ]);

  const totalRevenue = revenueResult.data?.reduce((sum, o) => sum + (o.amount || 0), 0) ?? 0;

  // Build activity feed
  const activities = [
    ...(recentDreams.data?.map((d) => ({
      id: d.id,
      type: "dream" as const,
      title: d.dream_text?.slice(0, 50) + (d.dream_text?.length > 50 ? "..." : ""),
      description: `${d.artwork_style} · ${d.is_paid ? "유료" : "무료"}`,
      timestamp: d.created_at,
    })) ?? []),
    ...(recentOrders.data?.map((o) => ({
      id: o.id,
      type: "order" as const,
      title: `${o.order_type} 주문`,
      description: `₩${(o.amount ?? 0).toLocaleString()} · ${o.status}`,
      timestamp: o.created_at,
    })) ?? []),
  ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 10);

  return NextResponse.json({
    stats: {
      totalUsers: usersResult.count ?? 0,
      todayDreams: todayDreamsResult.count ?? 0,
      totalRevenue,
      activeSubscribers: subscribersResult.count ?? 0,
    },
    activities,
  });
});
