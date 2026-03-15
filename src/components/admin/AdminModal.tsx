"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface AdminModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: "sm" | "md" | "lg";
}

const sizes = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-2xl",
};

export default function AdminModal({ open, onClose, title, children, footer, size = "md" }: AdminModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={(e) => e.target === overlayRef.current && onClose()}
    >
      <div className={cn("w-full glass-strong rounded-2xl shadow-2xl", sizes[size])}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.04]">
          <h2 className="text-[15px] font-semibold text-text-primary">{title}</h2>
          <button onClick={onClose} className="text-text-muted/40 hover:text-text-primary transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-white/[0.04]">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

// Reusable button styles for modal footer
export function AdminButton({
  children,
  onClick,
  variant = "default",
  disabled = false,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "default" | "primary" | "danger";
  disabled?: boolean;
}) {
  const styles = {
    default: "bg-white/[0.04] text-text-secondary hover:bg-white/[0.08] border-white/[0.06]",
    primary: "bg-primary-500 text-white hover:bg-primary-400 border-primary-500/50",
    danger: "bg-fortune-low/20 text-fortune-low hover:bg-fortune-low/30 border-fortune-low/30",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "rounded-lg px-4 py-2 text-[13px] font-medium border transition-colors disabled:opacity-40 disabled:pointer-events-none",
        styles[variant],
      )}
    >
      {children}
    </button>
  );
}
