import { NextResponse } from "next/server";
import { withAdmin } from "@/lib/auth/admin";
import { createServiceClient } from "@/lib/supabase/server";
import { z } from "zod";

const UpdateDreamSchema = z.object({
  is_public: z.boolean().optional(),
  is_paid: z.boolean().optional(),
});

export const GET = withAdmin(async (request) => {
  const id = request.url.split("/dreams/")[1]?.split("?")[0];
  const db = createServiceClient();

  const { data, error } = await db.from("dreams").select("*").eq("id", id).single();

  if (error || !data) {
    return NextResponse.json({ error: "Dream not found" }, { status: 404 });
  }

  return NextResponse.json({ dream: data });
});

export const PATCH = withAdmin(async (request) => {
  const id = request.url.split("/dreams/")[1]?.split("?")[0];
  const body = await request.json();
  const parsed = UpdateDreamSchema.parse(body);

  const db = createServiceClient();
  const updates: Record<string, unknown> = {};

  if (parsed.is_public !== undefined) updates.is_public = parsed.is_public;
  if (parsed.is_paid !== undefined) updates.is_paid = parsed.is_paid;

  const { data, error } = await db.from("dreams").update(updates).eq("id", id).select().single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ dream: data });
});

export const DELETE = withAdmin(async (request) => {
  const id = request.url.split("/dreams/")[1]?.split("?")[0];
  const db = createServiceClient();

  const { error } = await db.from("dreams").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
});
