import { NextResponse } from "next/server";
import { withAdmin } from "@/lib/auth/admin";
import { createServiceClient } from "@/lib/supabase/server";
import { z } from "zod";

const UpdateUserSchema = z.object({
  free_credits: z.number().int().min(0).optional(),
  subscription_status: z.enum(["free", "active", "cancelled", "suspended"]).optional(),
  is_admin: z.boolean().optional(),
});

export const GET = withAdmin(async (request) => {
  const id = request.url.split("/users/")[1]?.split("?")[0];
  const db = createServiceClient();

  const [userResult, dreamsResult, ordersResult] = await Promise.all([
    db.from("users").select("*").eq("id", id).single(),
    db.from("dreams").select("id, dream_text, artwork_style, is_paid, created_at").eq("user_id", id).order("created_at", { ascending: false }).limit(20),
    db.from("orders").select("id, order_type, amount, status, created_at").eq("user_id", id).order("created_at", { ascending: false }).limit(20),
  ]);

  if (userResult.error || !userResult.data) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({
    user: userResult.data,
    dreams: dreamsResult.data ?? [],
    orders: ordersResult.data ?? [],
  });
});

export const PATCH = withAdmin(async (request) => {
  const id = request.url.split("/users/")[1]?.split("?")[0];
  const body = await request.json();
  const parsed = UpdateUserSchema.parse(body);

  const db = createServiceClient();
  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };

  if (parsed.free_credits !== undefined) updates.free_credits = parsed.free_credits;
  if (parsed.subscription_status) updates.subscription_status = parsed.subscription_status;
  if (parsed.is_admin !== undefined) updates.is_admin = parsed.is_admin;

  const { data, error } = await db.from("users").update(updates).eq("id", id).select().single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ user: data });
});
