import { NextResponse } from "next/server";
import { createServerSupabase, createServiceClient } from "@/lib/supabase/server";

/**
 * Check if the current authenticated user is an admin.
 * Uses service client to bypass RLS.
 */
export async function isAdmin(): Promise<{ isAdmin: boolean; userId: string | null }> {
  try {
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { isAdmin: false, userId: null };

    // Check admin whitelist from env (fast path)
    const adminEmails = process.env.ADMIN_EMAILS?.split(",").map((e) => e.trim()) ?? [];
    if (user.email && adminEmails.includes(user.email)) {
      return { isAdmin: true, userId: user.id };
    }

    // Check database
    const service = createServiceClient();
    const { data } = await service
      .from("users")
      .select("is_admin")
      .eq("id", user.id)
      .single();

    return { isAdmin: data?.is_admin === true, userId: user.id };
  } catch {
    return { isAdmin: false, userId: null };
  }
}

/**
 * Wrapper for admin API route handlers.
 * Returns 401/403 if not authenticated or not admin.
 */
export function withAdmin(
  handler: (request: Request, context: { userId: string }) => Promise<NextResponse>,
) {
  return async (request: Request, routeContext?: unknown) => {
    const { isAdmin: admin, userId } = await isAdmin();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!admin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return handler(request, { userId, ...(routeContext as object) });
  };
}
