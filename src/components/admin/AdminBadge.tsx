import { cn } from "@/lib/utils/cn";

interface AdminBadgeProps {
  children: React.ReactNode;
  variant?: "default" | "primary" | "gold" | "green" | "red" | "blue" | "cyan" | "custom";
  className?: string;
}

const variants = {
  default: "bg-white/5 text-text-muted/60 border-white/10",
  primary: "bg-primary-500/15 text-primary-300 border-primary-500/20",
  gold: "bg-gold-400/15 text-gold-300 border-gold-400/20",
  green: "bg-fortune-high/15 text-fortune-high border-fortune-high/20",
  red: "bg-fortune-low/15 text-fortune-low border-fortune-low/20",
  blue: "bg-blue-500/15 text-blue-300 border-blue-500/20",
  cyan: "bg-cyan-500/15 text-cyan-300 border-cyan-500/20",
  custom: "",
};

export default function AdminBadge({ children, variant = "default", className }: AdminBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-medium border",
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
