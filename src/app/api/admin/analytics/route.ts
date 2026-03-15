import { NextResponse } from "next/server";
import { withAdmin } from "@/lib/auth/admin";
import { createServiceClient } from "@/lib/supabase/server";

export const GET = withAdmin(async (request) => {
  const db = createServiceClient();
  const url = new URL(request.url);
  const period = url.searchParams.get("period") ?? "30d";

  const days = period === "7d" ? 7 : period === "90d" ? 90 : 30;
  const since = new Date();
  since.setDate(since.getDate() - days);
  const sinceISO = since.toISOString();

  // Fetch raw data in parallel
  const [ordersResult, dreamsResult, usersResult, allUsersCount, paidDreamsCount] = await Promise.all([
    db.from("orders").select("amount, status, order_type, created_at").gte("created_at", sinceISO).in("status", ["paid", "completed"]),
    db.from("dreams").select("artwork_style, is_paid, created_at").gte("created_at", sinceISO),
    db.from("users").select("created_at").gte("created_at", sinceISO),
    db.from("users").select("*", { count: "exact", head: true }),
    db.from("users").select("*", { count: "exact", head: true }).gt("total_paid_amount", 0),
  ]);

  const orders = ordersResult.data ?? [];
  const dreams = dreamsResult.data ?? [];
  const users = usersResult.data ?? [];

  // Revenue by day
  const revenueByDay: Record<string, number> = {};
  orders.forEach((o) => {
    const day = o.created_at.slice(0, 10);
    revenueByDay[day] = (revenueByDay[day] ?? 0) + (o.amount ?? 0);
  });

  // Dreams by day
  const dreamsByDay: Record<string, number> = {};
  dreams.forEach((d) => {
    const day = d.created_at.slice(0, 10);
    dreamsByDay[day] = (dreamsByDay[day] ?? 0) + 1;
  });

  // Users by day
  const usersByDay: Record<string, number> = {};
  users.forEach((u) => {
    const day = u.created_at.slice(0, 10);
    usersByDay[day] = (usersByDay[day] ?? 0) + 1;
  });

  // Fill in missing days
  const allDays: string[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    allDays.push(d.toISOString().slice(0, 10));
  }

  const revenueChart = allDays.map((day) => ({ date: day, revenue: revenueByDay[day] ?? 0 }));
  const dreamsChart = allDays.map((day) => ({ date: day, count: dreamsByDay[day] ?? 0 }));
  const usersChart = allDays.map((day) => ({ date: day, count: usersByDay[day] ?? 0 }));

  // Style breakdown
  const styleCount: Record<string, number> = {};
  dreams.forEach((d) => {
    styleCount[d.artwork_style] = (styleCount[d.artwork_style] ?? 0) + 1;
  });
  const styleBreakdown = Object.entries(styleCount).map(([name, value]) => ({ name, value }));

  // Revenue by product type
  const productRevenue: Record<string, number> = {};
  orders.forEach((o) => {
    productRevenue[o.order_type] = (productRevenue[o.order_type] ?? 0) + (o.amount ?? 0);
  });
  const productBreakdown = Object.entries(productRevenue).map(([name, value]) => ({ name, value }));

  // Funnel
  const totalUsers = allUsersCount.count ?? 0;
  const usersWithDreams = dreams.length;
  const paidUsers = paidDreamsCount.count ?? 0;

  return NextResponse.json({
    revenueChart,
    dreamsChart,
    usersChart,
    styleBreakdown,
    productBreakdown,
    funnel: {
      totalUsers,
      usersWithDreams,
      paidUsers,
    },
    summary: {
      totalRevenue: orders.reduce((s, o) => s + (o.amount ?? 0), 0),
      totalDreams: dreams.length,
      newUsers: users.length,
      paidDreams: dreams.filter((d) => d.is_paid).length,
    },
  });
});
