import { NextResponse } from "next/server";
import { withAdmin } from "@/lib/auth/admin";
import { createServiceClient } from "@/lib/supabase/server";

export const GET = withAdmin(async (request) => {
  const db = createServiceClient();
  const url = new URL(request.url);
  const style = url.searchParams.get("style");
  const paid = url.searchParams.get("paid");
  const isPublic = url.searchParams.get("public");
  const page = parseInt(url.searchParams.get("page") ?? "0");
  const limit = parseInt(url.searchParams.get("limit") ?? "50");

  let query = db
    .from("dreams")
    .select("id, dream_text, artwork_style, artwork_thumbnail_url, is_paid, is_public, shared_count, share_token, created_at, user_id")
    .order("created_at", { ascending: false })
    .range(page * limit, (page + 1) * limit - 1);

  if (style && style !== "all") query = query.eq("artwork_style", style);
  if (paid === "true") query = query.eq("is_paid", true);
  if (paid === "false") query = query.eq("is_paid", false);
  if (isPublic === "true") query = query.eq("is_public", true);

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ dreams: data ?? [] });
});
