"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Moon,
  ShoppingCart,
  FileText,
  BarChart3,
  Settings,
  Menu,
  X,
  ChevronLeft,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

const NAV_ITEMS = [
  { href: "/admin", label: "대시보드", icon: LayoutDashboard },
  { href: "/admin/users", label: "유저 관리", icon: Users },
  { href: "/admin/dreams", label: "꿈 관리", icon: Moon },
  { href: "/admin/orders", label: "주문 관리", icon: ShoppingCart },
  { href: "/admin/seo", label: "SEO 관리", icon: FileText },
  { href: "/admin/analytics", label: "애널리틱스", icon: BarChart3 },
  { href: "/admin/settings", label: "설정", icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  const navContent = (
    <nav className="flex flex-col gap-1 px-3 py-4">
      {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          onClick={() => setMobileOpen(false)}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium transition-all duration-200",
            isActive(href)
              ? "bg-primary-500/15 text-primary-300 border border-primary-500/10"
              : "text-text-muted/60 hover:text-text-secondary hover:bg-white/[0.03] border border-transparent",
          )}
        >
          <Icon className="w-4 h-4 shrink-0" />
          {label}
        </Link>
      ))}
    </nav>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-50 lg:hidden rounded-lg p-2 glass"
      >
        <Menu className="w-5 h-5 text-text-primary" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-screen w-[220px] flex flex-col border-r border-white/[0.04] bg-surface-50/95 backdrop-blur-xl transition-transform duration-300",
          "lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-white/[0.04]">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
              <Moon className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-[14px] font-bold text-text-primary tracking-tight">꿈그림</span>
            <span className="text-[10px] text-text-muted/40 font-medium">Admin</span>
          </Link>
          <button onClick={() => setMobileOpen(false)} className="lg:hidden text-text-muted/50 hover:text-text-primary">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto">{navContent}</div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-white/[0.04]">
          <Link
            href="/"
            className="flex items-center gap-2 text-[12px] text-text-muted/40 hover:text-text-secondary transition-colors"
          >
            <ChevronLeft className="w-3 h-3" />
            사이트로 돌아가기
          </Link>
        </div>
      </aside>
    </>
  );
}
