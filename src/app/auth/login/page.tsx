"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Moon } from "lucide-react";
import StarField from "@/components/dream/StarField";

export default function LoginPage() {
  return (
    <div className="relative min-h-screen bg-surface-0 flex items-center justify-center">
      <StarField />

      {/* Background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-primary-600/10 blur-[80px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md px-6">
        {/* Back */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-text-secondary transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            홈으로
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass-card rounded-3xl p-8 sm:p-10"
        >
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 shadow-lg shadow-primary-500/25 mb-4">
              <Moon className="h-8 w-8 text-white" />
            </div>
            <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-text-primary">
              꿈그림에 오신 걸 환영해요
            </h1>
            <p className="mt-2 text-sm text-text-secondary">
              로그인하면 꿈 일기 저장, 구독 기능을 이용할 수 있어요
            </p>
          </div>

          {/* Social Login Buttons */}
          <div className="space-y-3">
            {/* Kakao */}
            <button className="flex w-full items-center justify-center gap-3 rounded-xl bg-[#FEE500] py-3.5 text-sm font-semibold text-[#191919] hover:bg-[#FDD835] transition-colors">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3C6.48 3 2 6.34 2 10.5c0 2.72 1.86 5.1 4.62 6.42-.16.56-.58 2.03-.67 2.35-.1.39.14.39.3.28.12-.08 1.94-1.32 2.72-1.86.64.1 1.32.16 2.03.16 5.52 0 10-3.34 10-7.5S17.52 3 12 3z" />
              </svg>
              카카오로 시작하기
            </button>

            {/* Google */}
            <button className="flex w-full items-center justify-center gap-3 rounded-xl bg-white py-3.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors border border-gray-200">
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Google로 시작하기
            </button>
          </div>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/5" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-surface-100 px-3 text-xs text-text-muted">또는</span>
            </div>
          </div>

          {/* Guest */}
          <Link
            href="/dream"
            className="block w-full text-center rounded-xl bg-surface-300/30 py-3.5 text-sm font-medium text-text-secondary hover:bg-surface-300/50 transition-colors"
          >
            로그인 없이 체험하기
          </Link>

          {/* Terms */}
          <p className="mt-6 text-center text-xs text-text-muted leading-relaxed">
            로그인 시{" "}
            <Link href="/terms" className="underline hover:text-text-secondary">
              이용약관
            </Link>
            {" "}및{" "}
            <Link href="/privacy" className="underline hover:text-text-secondary">
              개인정보처리방침
            </Link>
            에 동의하게 됩니다.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
