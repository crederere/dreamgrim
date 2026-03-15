import { NextResponse } from "next/server";
import { withAdmin } from "@/lib/auth/admin";
import { createServiceClient } from "@/lib/supabase/server";
import { z } from "zod";

export const GET = withAdmin(async () => {
  const db = createServiceClient();
  const { data, error } = await db
    .from("seo_pages")
    .select("id, slug, keyword_ko, tier, title, is_published, monthly_search_volume, current_rank, created_at")
    .order("tier", { ascending: true })
    .order("monthly_search_volume", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ pages: data ?? [] });
});

const CreateSeoSchema = z.object({
  slug: z.string().min(1),
  keyword_ko: z.string().min(1),
  tier: z.number().int().min(1).max(3),
  title: z.string().min(1),
  meta_description: z.string(),
  h1_title: z.string(),
  intro_text: z.string(),
  situations: z.array(z.object({ title: z.string(), description: z.string() })).default([]),
  faq: z.array(z.object({ question: z.string(), answer: z.string() })).default([]),
  related_slugs: z.array(z.string()).default([]),
  monthly_search_volume: z.number().int().default(0),
  is_published: z.boolean().default(false),
});

export const POST = withAdmin(async (request) => {
  const body = await request.json();
  const parsed = CreateSeoSchema.parse(body);

  const db = createServiceClient();
  const { data, error } = await db.from("seo_pages").insert(parsed).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ page: data }, { status: 201 });
});
