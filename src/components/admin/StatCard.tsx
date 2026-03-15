import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  icon: LucideIcon;
  accent?: "primary" | "gold" | "green" | "default";
}

const accentStyles = {
  primary: "text-primary-400/50 border-primary-500/[0.06] bg-primary-500/[0.03]",
  gold: "text-gold-400/50 border-gold-400/[0.06] bg-gold-400/[0.03]",
  green: "text-fortune-high/50 border-fortune-high/[0.06] bg-fortune-high/[0.03]",
  default: "text-text-muted/40 border-white/[0.04] bg-white/[0.02]",
};

export default function StatCard({ label, value, sub, icon: Icon, accent = "default" }: StatCardProps) {
  return (
    <div className="glass rounded-xl p-5 flex items-start gap-4">
      <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border", accentStyles[accent])}>
        <Icon className="w-4.5 h-4.5" />
      </div>
      <div>
        <p className="text-[11px] text-text-muted/40 tracking-wider mb-1">{label}</p>
        <p className="text-[1.6rem] font-bold text-text-primary tracking-tight leading-none">{value}</p>
        {sub && <p className="text-[11px] text-text-muted/30 mt-1.5">{sub}</p>}
      </div>
    </div>
  );
}
