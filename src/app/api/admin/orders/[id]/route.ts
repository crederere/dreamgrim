import { NextResponse } from "next/server";
import { withAdmin } from "@/lib/auth/admin";
import { createServiceClient } from "@/lib/supabase/server";
import { z } from "zod";

const UpdateOrderSchema = z.object({
  status: z.enum(["pending", "paid", "processing", "shipped", "completed", "refunded", "cancelled"]).optional(),
  tracking_number: z.string().optional(),
});

export const GET = withAdmin(async (request) => {
  const id = request.url.split("/orders/")[1]?.split("?")[0];
  const db = createServiceClient();

  const { data, error } = await db.from("orders").select("*").eq("id", id).single();

  if (error || !data) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  return NextResponse.json({ order: data });
});

export const PATCH = withAdmin(async (request) => {
  const id = request.url.split("/orders/")[1]?.split("?")[0];
  const body = await request.json();
  const parsed = UpdateOrderSchema.parse(body);

  const db = createServiceClient();
  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };

  if (parsed.status) updates.status = parsed.status;
  if (parsed.tracking_number) updates.tracking_number = parsed.tracking_number;
  if (parsed.status === "refunded") updates.refunded_at = new Date().toISOString();

  const { data, error } = await db.from("orders").update(updates).eq("id", id).select().single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ order: data });
});
