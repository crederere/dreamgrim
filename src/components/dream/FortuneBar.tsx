"use client";

import { motion } from "framer-motion";

interface FortuneBarProps {
  label: string;
  score: number;
  locked?: boolean;
  delay?: number;
}

export default function FortuneBar({ label, score, locked = false, delay = 0 }: FortuneBarProps) {
  const getColor = () => {
    if (score >= 80) return { bar: "from-emerald-400/90 to-teal-400/90", glow: "shadow-emerald-400/15" };
    if (score >= 50) return { bar: "from-amber-400/90 to-yellow-400/90", glow: "shadow-amber-400/15" };
    return { bar: "from-rose-400/90 to-orange-400/90", glow: "shadow-rose-400/15" };
  };

  const { bar, glow } = getColor();

  return (
    <div className="flex items-center gap-3">
      <span className="w-12 text-[13px] text-text-muted shrink-0 tracking-tight">{label}</span>
      <div className="relative flex-1 h-[6px] bg-surface-300/30 rounded-full overflow-hidden">
        {locked ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex items-center gap-1">
              <svg className="w-2.5 h-2.5 text-text-muted/50" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${score}%` }}
            transition={{ duration: 1.4, delay, ease: [0.22, 1, 0.36, 1] }}
            className={`h-full rounded-full bg-gradient-to-r ${bar} shadow-md ${glow}`}
          />
        )}
      </div>
      {!locked && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delay + 1 }}
          className="w-7 text-right text-[13px] font-semibold text-text-primary tabular-nums"
        >
          {score}
        </motion.span>
      )}
      {locked && (
        <span className="w-7 text-right">
          <svg className="w-3 h-3 text-text-muted/40 ml-auto" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
        </span>
      )}
    </div>
  );
}
