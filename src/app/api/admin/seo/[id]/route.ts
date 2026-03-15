import { NextResponse } from "next/server";
import { withAdmin } from "@/lib/auth/admin";
import { createServiceClient } from "@/lib/supabase/server";
import { z } from "zod";

export const GET = withAdmin(async (request) => {
  const id = request.url.split("/seo/")[1]?.split("?")[0];
  const db = createServiceClient();

  const { data, error } = await db.from("seo_pages").select("*").eq("id", id).single();
  if (error || !data) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ page: data });
});

const UpdateSeoSchema = z.object({
  slug: z.string().min(1).optional(),
  keyword_ko: z.string().min(1).optional(),
  tier: z.number().int().min(1).max(3).optional(),
  title: z.string().min(1).optional(),
  meta_description: z.string().optional(),
  h1_title: z.string().optional(),
  intro_text: z.string().optional(),
  situations: z.array(z.object({ title: z.string(), description: z.string() })).optional(),
  faq: z.array(z.object({ question: z.string(), answer: z.string() })).optional(),
  related_slugs: z.array(z.string()).optional(),
  monthly_search_volume: z.number().int().optional(),
  current_rank: z.number().int().nullable().optional(),
  is_published: z.boolean().optional(),
});

export const PUT = withAdmin(async (request) => {
  const id = request.url.split("/seo/")[1]?.split("?")[0];
  const body = await request.json();
  const parsed = UpdateSeoSchema.parse(body);

  const db = createServiceClient();
  const { data, error } = await db
    .from("seo_pages")
    .update({ ...parsed, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ page: data });
});

export const DELETE = withAdmin(async (request) => {
  const id = request.url.split("/seo/")[1]?.split("?")[0];
  const db = createServiceClient();

  const { error } = await db.from("seo_pages").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
});
