import { NextResponse } from "next/server";
import { withAdmin } from "@/lib/auth/admin";
import { createServiceClient } from "@/lib/supabase/server";

export const GET = withAdmin(async (request) => {
  const db = createServiceClient();
  const url = new URL(request.url);
  const search = url.searchParams.get("q");
  const page = parseInt(url.searchParams.get("page") ?? "0");
  const limit = parseInt(url.searchParams.get("limit") ?? "50");

  let query = db
    .from("users")
    .select("id, email, name, subscription_status, free_credits, total_dreams, total_paid_amount, is_admin, created_at, updated_at")
    .order("created_at", { ascending: false })
    .range(page * limit, (page + 1) * limit - 1);

  if (search) {
    query = query.or(`email.ilike.%${search}%,name.ilike.%${search}%`);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ users: data ?? [] });
});
