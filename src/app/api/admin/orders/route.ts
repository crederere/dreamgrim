import { NextResponse } from "next/server";
import { withAdmin } from "@/lib/auth/admin";
import { createServiceClient } from "@/lib/supabase/server";

export const GET = withAdmin(async (request) => {
  const db = createServiceClient();
  const url = new URL(request.url);
  const status = url.searchParams.get("status");
  const page = parseInt(url.searchParams.get("page") ?? "0");
  const limit = parseInt(url.searchParams.get("limit") ?? "50");

  let query = db
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false })
    .range(page * limit, (page + 1) * limit - 1);

  if (status && status !== "all") {
    query = query.eq("status", status);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ orders: data ?? [] });
});
