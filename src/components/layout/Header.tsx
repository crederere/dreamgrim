"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const NAV_ITEMS = [
  { href: "/dream", label: "꿈 해몽" },
  { href: "/pricing", label: "요금제" },
  { href: "/#gallery", label: "갤러리" },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
          isScrolled
            ? "bg-surface-0/70 backdrop-blur-2xl border-b border-white/[0.04]"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="flex h-16 sm:h-[72px] items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <span className="font-[family-name:var(--font-display)] text-[22px] font-bold tracking-tight text-text-primary">
                꿈그림
              </span>
              <span className="text-[10px] font-medium tracking-[0.2em] text-text-muted uppercase mt-0.5">
                dreamgrim
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-[13px] font-medium text-text-muted hover:text-text-primary transition-colors duration-300 tracking-wide"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center gap-5">
              <Link
                href="/auth/login"
                className="text-[13px] font-medium text-text-muted hover:text-text-primary transition-colors duration-300"
              >
                로그인
              </Link>
              <Link
                href="/dream"
                className="relative inline-flex items-center gap-2 rounded-full bg-primary-600/90 hover:bg-primary-500/90 px-5 py-2 text-[13px] font-semibold text-white transition-all duration-300 hover:shadow-lg hover:shadow-primary-500/20"
              >
                무료 체험
              </Link>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="md:hidden flex flex-col gap-[5px] p-2"
              aria-label="메뉴"
            >
              <motion.span
                animate={isMobileOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
                className="block w-5 h-[1.5px] bg-text-primary origin-center transition-colors"
              />
              <motion.span
                animate={isMobileOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
                className="block w-5 h-[1.5px] bg-text-primary origin-center"
              />
              <motion.span
                animate={isMobileOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
                className="block w-5 h-[1.5px] bg-text-primary origin-center transition-colors"
              />
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-surface-0/95 backdrop-blur-3xl md:hidden"
          >
            <div className="flex flex-col items-center justify-center h-full gap-8">
              {NAV_ITEMS.map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setIsMobileOpen(false)}
                    className="text-2xl font-medium text-text-primary hover:text-primary-400 transition-colors"
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                className="pt-4"
              >
                <Link
                  href="/dream"
                  onClick={() => setIsMobileOpen(false)}
                  className="inline-flex items-center gap-2 rounded-full bg-primary-600 px-8 py-3.5 text-base font-semibold text-white"
                >
                  무료로 꿈 해몽 받기
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
