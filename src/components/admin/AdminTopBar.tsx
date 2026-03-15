"use client";

import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const PAGE_TITLES: Record<string, string> = {
  "/admin": "대시보드",
  "/admin/users": "유저 관리",
  "/admin/dreams": "꿈 관리",
  "/admin/orders": "주문 관리",
  "/admin/seo": "SEO 관리",
  "/admin/analytics": "애널리틱스",
  "/admin/settings": "설정",
};

export default function AdminTopBar({ adminEmail }: { adminEmail?: string }) {
  const pathname = usePathname();
  const router = useRouter();

  const title = Object.entries(PAGE_TITLES).find(([path]) => {
    if (path === "/admin") return pathname === "/admin";
    return pathname.startsWith(path);
  })?.[1] ?? "Admin";

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-14 px-6 border-b border-white/[0.04] bg-surface-50/80 backdrop-blur-lg">
      <h1 className="text-[15px] font-semibold text-text-primary pl-10 lg:pl-0">{title}</h1>
      <div className="flex items-center gap-4">
        {adminEmail && (
          <span className="text-[12px] text-text-muted/40 hidden sm:block">{adminEmail}</span>
        )}
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 text-[12px] text-text-muted/40 hover:text-fortune-low transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          로그아웃
        </button>
      </div>
    </header>
  );
}
