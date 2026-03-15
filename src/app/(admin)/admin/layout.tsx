import { createServerSupabase } from "@/lib/supabase/server";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopBar from "@/components/admin/AdminTopBar";

export const metadata = {
  title: "Admin | 꿈그림",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-surface-0">
      <AdminSidebar />
      <div className="lg:ml-[220px]">
        <AdminTopBar adminEmail={user?.email ?? undefined} />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
