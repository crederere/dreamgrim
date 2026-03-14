"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import StarField from "@/components/dream/StarField";

function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 1.1, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const COMPARE = [
  { feature: "AI 꿈 아트워크", free: "저화질 + 워터마크", paid: "고화질", sub: "고화질 무제한" },
  { feature: "해몽", free: "한 줄 요약", paid: "상세 + 심리 분석", sub: "상세 + 심리 분석" },
  { feature: "운세", free: "재물운만", paid: "4개 영역", sub: "4개 영역" },
  { feature: "행운 번호", free: "2개", paid: "6개", sub: "6개" },
  { feature: "아트 스타일", free: "1종", paid: "5종", sub: "5종" },
  { feature: "꿈 일기", free: "최근 3개", paid: "—", sub: "무제한" },
  { feature: "주간/월간 분석", free: "—", paid: "—", sub: "포함" },
  { feature: "매주 행운 번호", free: "—", paid: "—", sub: "금요일 알림톡" },
  { feature: "AI 상담", free: "—", paid: "—", sub: "월 2회" },
];

export default function PricingPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const floatY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const moonRotate = useTransform(scrollYProgress, [0, 1], [0, 15]);

  return (
    <div className="relative min-h-screen bg-surface-0">
      <StarField />
      <Header />

      <main className="relative z-10">
        {/* ═══════════════════════════════════════════
            HERO — Immersive atmospheric header
        ═══════════════════════════════════════════ */}
        <section ref={heroRef} className="relative pt-36 pb-24 overflow-hidden">
          {/* Deep atmospheric layers */}
          <div className="absolute inset-0 pointer-events-none">
            <Image src="/images/hero-mist.png" alt="" fill className="object-cover opacity-[0.06] mix-blend-screen" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_20%,rgba(109,60,239,0.08),transparent)]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_50%_at_30%_70%,rgba(139,106,255,0.04),transparent)]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_40%_at_80%_30%,rgba(245,197,66,0.03),transparent)]" />
          </div>

          {/* Aurora streaks */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-[10%] left-[20%] w-[400px] h-[2px] bg-gradient-to-r from-transparent via-primary-400/[0.06] to-transparent rotate-[15deg] animate-aurora" />
            <div className="absolute top-[25%] right-[15%] w-[300px] h-[1px] bg-gradient-to-r from-transparent via-gold-400/[0.04] to-transparent -rotate-[10deg] animate-aurora" style={{ animationDelay: "-3s" }} />
          </div>

          {/* Constellation dots */}
          <div className="absolute inset-0 pointer-events-none hidden md:block">
            {[
              { x: "12%", y: "20%", size: 2, delay: 0 },
              { x: "25%", y: "35%", size: 1.5, delay: 1 },
              { x: "78%", y: "25%", size: 2, delay: 2 },
              { x: "85%", y: "45%", size: 1, delay: 0.5 },
              { x: "45%", y: "15%", size: 1.5, delay: 3 },
              { x: "65%", y: "55%", size: 1, delay: 1.5 },
            ].map((dot, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full bg-white/[0.15]"
                style={{ left: dot.x, top: dot.y, width: dot.size, height: dot.size }}
                animate={{ opacity: [0.1, 0.4, 0.1], scale: [1, 1.5, 1] }}
                transition={{ duration: 4, delay: dot.delay, repeat: Infinity, ease: "easeInOut" }}
              />
            ))}
          </div>

          {/* Large mystic ring */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none animate-mystic-ring" style={{ animationDuration: "80s" }}>
            <svg width="600" height="600" viewBox="0 0 600 600" className="opacity-[0.025]">
              <circle cx="300" cy="300" r="280" fill="none" stroke="rgba(167,139,255,0.5)" strokeWidth="0.5" strokeDasharray="8 16" />
              <circle cx="300" cy="300" r="240" fill="none" stroke="rgba(245,197,66,0.3)" strokeWidth="0.3" strokeDasharray="5 20" />
              <circle cx="300" cy="300" r="200" fill="none" stroke="rgba(219,112,147,0.25)" strokeWidth="0.3" strokeDasharray="3 22" />
            </svg>
          </div>

          {/* Floating moon with parallax */}
          <motion.div
            style={{ y: floatY, rotate: moonRotate }}
            className="absolute right-[6%] top-[10%] w-[240px] h-[240px] pointer-events-none hidden lg:block"
          >
            <Image src="/images/hero-moon.png" alt="" fill className="object-contain opacity-[0.05]" />
            <div className="absolute inset-0 bg-glow-purple opacity-20 animate-breathe-deep" />
            <div className="absolute inset-[-30%] rounded-full bg-primary-400/[0.02] blur-[40px] animate-breathe" />
          </motion.div>

          <div className="relative mx-auto max-w-5xl px-5 sm:px-8">
            <Reveal className="text-center">
              <motion.div
                className="inline-block mb-6"
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="w-10 h-10 mx-auto rounded-full border border-primary-400/[0.08] flex items-center justify-center">
                  <div className="w-4 h-4 rounded-full bg-gradient-to-br from-primary-400/20 to-gold-400/10 animate-breathe" />
                </div>
              </motion.div>
              <p className="text-[11px] tracking-[0.4em] text-primary-400/30 uppercase mb-6">Pricing</p>
              <h1 className="font-[family-name:var(--font-display)] text-[clamp(2rem,5vw,3.6rem)] font-bold text-text-primary leading-tight">
                당신의 꿈에 맞는 <span className="text-gradient">요금제</span>
              </h1>
              <p className="mt-6 text-[15px] text-text-muted/35 max-w-lg mx-auto leading-relaxed">
                무료로 시작하고, 더 깊은 의미를 원할 때 업그레이드하세요
              </p>
            </Reveal>
          </div>

          {/* Bottom fade into cards */}
          <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-surface-0 to-transparent pointer-events-none" />
        </section>

        {/* ═══════════════════════════════════════════
            PRICING CARDS — Immersive glass cards
        ═══════════════════════════════════════════ */}
        <section className="relative overflow-hidden pb-12">
          {/* Ambient atmospheric orbs */}
          <div className="absolute top-[5%] left-[3%] w-[300px] h-[300px] rounded-full bg-primary-500/[0.02] blur-[80px] animate-breathe pointer-events-none" />
          <div className="absolute bottom-[15%] right-[5%] w-[250px] h-[250px] rounded-full bg-gold-400/[0.015] blur-[60px] animate-breathe-deep pointer-events-none" />
          <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-primary-400/[0.01] blur-[100px] pointer-events-none" />

          <div className="relative mx-auto max-w-5xl px-5 sm:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Free Tier */}
              <Reveal>
                <div className="group relative glass rounded-2xl p-8 h-full flex flex-col transition-all duration-700 hover:-translate-y-2 hover:border-white/[0.08]">
                  {/* Subtle inner glow on hover */}
                  <div className="absolute inset-0 rounded-2xl bg-[radial-gradient(ellipse_at_50%_0%,rgba(255,255,255,0.01),transparent_60%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                  <div className="relative">
                    {/* Icon */}
                    <div className="w-12 h-12 rounded-full border border-white/[0.04] flex items-center justify-center mb-5 group-hover:border-white/[0.08] transition-colors duration-700">
                      <svg className="w-5 h-5 text-text-muted/25" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                      </svg>
                    </div>

                    <div className="text-[12px] text-text-muted/30 mb-2 tracking-wider">무료</div>
                    <div className="flex items-baseline gap-1 mb-1">
                      <span className="text-[2.6rem] font-bold text-text-primary tracking-tight leading-none">0</span>
                      <span className="text-[12px] text-text-muted/20">원</span>
                    </div>
                    <p className="text-[11px] text-text-muted/18 mb-8">주 2회 체험</p>

                    <div className="h-[1px] bg-gradient-to-r from-transparent via-white/[0.04] to-transparent mb-7" />

                    <ul className="space-y-3.5 mb-10 flex-1">
                      {["AI 아트워크 (저화질)", "한 줄 해몽", "재물운 점수", "행운 번호 2개", "수채화 스타일"].map((f) => (
                        <li key={f} className="flex items-start gap-2.5 text-[13px] text-text-secondary/50">
                          <svg className="w-3.5 h-3.5 text-white/10 mt-[2px] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                          {f}
                        </li>
                      ))}
                    </ul>
                    <Link
                      href="/dream"
                      className="block w-full text-center rounded-full py-3.5 text-[13px] font-semibold bg-white/[0.03] text-text-primary/55 border border-white/[0.04] hover:bg-white/[0.06] hover:border-white/[0.1] transition-all duration-500"
                    >
                      무료로 시작
                    </Link>
                  </div>
                </div>
              </Reveal>

              {/* Single Report — Recommended / Highlighted */}
              <Reveal delay={0.1}>
                <div className="group relative rounded-2xl h-full flex flex-col">
                  {/* Outer glow aura */}
                  <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-b from-primary-400/[0.12] via-primary-500/[0.04] to-transparent pointer-events-none" />
                  <div className="absolute -inset-[2px] rounded-2xl bg-primary-500/[0.03] blur-xl pointer-events-none animate-breathe" />

                  <div className="relative glass-strong rounded-2xl p-8 h-full flex flex-col border-primary-500/15 transition-all duration-700 hover:-translate-y-2 shadow-[0_0_80px_rgba(109,60,239,0.06)]">
                    {/* Inner atmospheric glow */}
                    <div className="absolute inset-0 rounded-2xl bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(109,60,239,0.06),transparent)] pointer-events-none" />
                    <div className="absolute inset-0 rounded-2xl bg-[radial-gradient(ellipse_at_center,rgba(109,60,239,0.02),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                    {/* Recommend badge */}
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                      <div className="relative">
                        <div className="absolute inset-0 rounded-full bg-primary-500/30 blur-md" />
                        <div className="relative rounded-full bg-gradient-to-r from-primary-400 to-primary-600 px-5 py-1.5 text-[10px] font-semibold text-white tracking-[0.15em] shadow-[0_4px_25px_rgba(109,60,239,0.3)]">
                          추천
                        </div>
                      </div>
                    </div>

                    <div className="relative">
                      {/* Icon */}
                      <div className="w-12 h-12 rounded-full border border-primary-400/[0.12] flex items-center justify-center mb-5 group-hover:border-primary-400/[0.2] transition-colors duration-700">
                        <svg className="w-5 h-5 text-primary-400/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                        </svg>
                      </div>

                      <div className="text-[12px] text-primary-400/40 mb-2 tracking-wider">운세 리포트</div>
                      <div className="flex items-baseline gap-1.5 mb-1">
                        <span className="text-[2.6rem] font-bold text-gradient tracking-tight leading-none">4,900</span>
                        <span className="text-[12px] text-text-muted/20">원</span>
                      </div>
                      <p className="text-[11px] text-text-muted/18 mb-8">1회 구매</p>

                      <div className="h-[1px] bg-gradient-to-r from-transparent via-primary-400/[0.08] to-transparent mb-7" />

                      <ul className="space-y-3.5 mb-10 flex-1">
                        {[
                          "고화질 아트워크",
                          "상세 해몽 + 심리 분석",
                          "4개 영역 운세 전체",
                          "행운 번호 6개 전체",
                          "행운의 색 · 방향 · 시간",
                          "오늘의 조언",
                          "5가지 아트 스타일",
                        ].map((f) => (
                          <li key={f} className="flex items-start gap-2.5 text-[13px] text-text-secondary/65">
                            <svg className="w-3.5 h-3.5 text-primary-400/40 mt-[2px] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                            {f}
                          </li>
                        ))}
                      </ul>
                      <Link
                        href="/dream"
                        className="relative block w-full text-center rounded-full py-3.5 text-[13px] font-semibold bg-gradient-to-r from-primary-500 to-primary-600 text-white transition-all duration-500 hover:shadow-[0_0_40px_rgba(109,60,239,0.2)] hover:from-primary-400 hover:to-primary-500 overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/[0.08] to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                        <span className="relative">리포트 받기</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </Reveal>

              {/* Subscription */}
              <Reveal delay={0.2}>
                <div className="group relative glass rounded-2xl p-8 h-full flex flex-col transition-all duration-700 hover:-translate-y-2 hover:border-gold-400/[0.1]">
                  {/* Gold glow on hover */}
                  <div className="absolute inset-0 rounded-2xl bg-[radial-gradient(ellipse_at_50%_0%,rgba(245,197,66,0.02),transparent_60%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                  <div className="relative">
                    {/* Icon */}
                    <div className="w-12 h-12 rounded-full border border-gold-400/[0.08] flex items-center justify-center mb-5 group-hover:border-gold-400/[0.15] transition-colors duration-700">
                      <svg className="w-5 h-5 text-gold-400/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
                      </svg>
                    </div>

                    <div className="text-[12px] text-gold-400/35 mb-2 tracking-wider">꿈 구독</div>
                    <div className="flex items-baseline gap-1.5 mb-1">
                      <span className="text-[2.6rem] font-bold text-gradient-gold tracking-tight leading-none">9,900</span>
                      <span className="text-[12px] text-text-muted/20">원/월</span>
                    </div>
                    <p className="text-[11px] text-text-muted/18 mb-8">매일 무제한</p>

                    <div className="h-[1px] bg-gradient-to-r from-transparent via-gold-400/[0.06] to-transparent mb-7" />

                    <ul className="space-y-3.5 mb-10 flex-1">
                      {[
                        "모든 단건 리포트 포함",
                        "꿈 일기 무제한 저장",
                        "주간 · 월간 꿈 분석",
                        "매주 금요일 행운 번호",
                        "AI 상담 월 2회",
                        "5가지 아트 스타일",
                        "매일 무제한 시각화",
                      ].map((f) => (
                        <li key={f} className="flex items-start gap-2.5 text-[13px] text-text-secondary/55">
                          <svg className="w-3.5 h-3.5 text-gold-400/30 mt-[2px] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                          {f}
                        </li>
                      ))}
                    </ul>
                    <button className="relative block w-full text-center rounded-full py-3.5 text-[13px] font-semibold bg-gradient-to-r from-gold-400 to-gold-500 text-surface-0 transition-all duration-500 hover:shadow-[0_0_40px_rgba(245,197,66,0.15)] overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/[0.1] to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                      <span className="relative">구독 시작</span>
                    </button>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* Flowing mist transition */}
        <div className="relative h-36 sm:h-44 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 animate-drift-x" style={{ background: "radial-gradient(ellipse 80% 100% at 50% 50%, rgba(139,106,255,0.04), transparent 70%)" }} />
          <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-surface-0 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-surface-0 to-transparent" />
          <div className="absolute inset-x-[15%] top-1/2 -translate-y-1/2 h-[1px] bg-gradient-to-r from-transparent via-white/[0.03] to-transparent" />
        </div>

        {/* ═══════════════════════════════════════════
            COMPARISON TABLE — Atmospheric glass table
        ═══════════════════════════════════════════ */}
        <section className="relative overflow-hidden" style={{ padding: "clamp(3rem, 8vw, 6rem) 0" }}>
          {/* Background atmosphere */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_30%,rgba(109,60,239,0.04),transparent)]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_40%_at_80%_70%,rgba(245,197,66,0.02),transparent)]" />
          </div>

          {/* Subtle mystic ring */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none animate-mystic-ring" style={{ animationDuration: "120s" }}>
            <svg width="500" height="500" viewBox="0 0 500 500" className="opacity-[0.015]">
              <circle cx="250" cy="250" r="230" fill="none" stroke="rgba(167,139,255,0.4)" strokeWidth="0.4" strokeDasharray="6 18" />
            </svg>
          </div>

          <div className="relative mx-auto max-w-5xl px-5 sm:px-8">
            <Reveal className="text-center mb-14">
              <p className="text-[11px] tracking-[0.3em] text-primary-400/25 uppercase mb-3">Compare</p>
              <h2 className="font-[family-name:var(--font-display)] text-[clamp(1.5rem,3vw,2.2rem)] font-bold text-text-primary">
                상세 <span className="text-gradient">비교</span>
              </h2>
            </Reveal>

            <Reveal>
              <div className="relative">
                {/* Table glow */}
                <div className="absolute -inset-4 rounded-3xl bg-primary-500/[0.01] blur-2xl pointer-events-none" />

                <div className="relative overflow-x-auto rounded-2xl glass border-white/[0.03]">
                  <table className="w-full text-[13px]">
                    <thead>
                      <tr className="border-b border-white/[0.05]">
                        <th className="text-left p-4 sm:p-5 text-text-muted/35 font-medium text-[12px] tracking-wider">기능</th>
                        <th className="p-4 sm:p-5 text-text-muted/30 font-medium text-center text-[12px] tracking-wider">무료</th>
                        <th className="p-4 sm:p-5 font-medium text-center text-[12px] tracking-wider">
                          <span className="text-gradient">4,900원</span>
                        </th>
                        <th className="p-4 sm:p-5 font-medium text-center text-[12px] tracking-wider">
                          <span className="text-gradient-gold">9,900원/월</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {COMPARE.map((row, i) => (
                        <motion.tr
                          key={row.feature}
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.04, duration: 0.5 }}
                          className={`border-b border-white/[0.02] transition-colors duration-300 hover:bg-white/[0.015] ${i % 2 === 0 ? "bg-white/[0.005]" : ""}`}
                        >
                          <td className="p-4 sm:p-5 text-text-secondary/65 font-medium">{row.feature}</td>
                          <td className="p-4 sm:p-5 text-center text-text-muted/25">{row.free}</td>
                          <td className="p-4 sm:p-5 text-center text-primary-300/50">{row.paid}</td>
                          <td className="p-4 sm:p-5 text-center text-gold-300/60 font-medium">{row.sub}</td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Flowing mist transition */}
        <div className="relative h-36 sm:h-44 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 animate-drift-x" style={{ background: "radial-gradient(ellipse 80% 100% at 50% 50%, rgba(245,197,66,0.03), transparent 70%)", animationDelay: "-5s" }} />
          <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-surface-0 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-surface-0 to-transparent" />
          <div className="absolute inset-x-[20%] top-1/2 -translate-y-1/2 h-[1px] bg-gradient-to-r from-transparent via-gold-400/[0.04] to-transparent" />
        </div>

        {/* ═══════════════════════════════════════════
            GOODS — Mystical product cards
        ═══════════════════════════════════════════ */}
        <section className="relative overflow-hidden" style={{ padding: "clamp(3rem, 8vw, 6rem) 0" }}>
          {/* Atmospheric */}
          <div className="absolute inset-0 pointer-events-none">
            <Image src="/images/section-clouds.png" alt="" fill className="object-cover opacity-[0.04] mix-blend-screen" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_40%_40%,rgba(109,60,239,0.03),transparent)]" />
          </div>
          <div className="absolute top-[20%] right-[5%] w-[250px] h-[250px] rounded-full bg-primary-500/[0.02] blur-[70px] animate-breathe-deep pointer-events-none" />
          <div className="absolute bottom-[30%] left-[8%] w-[200px] h-[200px] rounded-full bg-gold-400/[0.012] blur-[50px] animate-breathe pointer-events-none" />

          <div className="relative mx-auto max-w-5xl px-5 sm:px-8">
            <Reveal className="text-center mb-14">
              <p className="text-[11px] tracking-[0.3em] text-primary-400/25 uppercase mb-3">Goods</p>
              <h2 className="font-[family-name:var(--font-display)] text-[clamp(1.5rem,3vw,2.2rem)] font-bold text-text-primary">
                꿈의 운을 <span className="text-gradient">간직하세요</span>
              </h2>
              <p className="mt-4 text-[13px] text-text-muted/28 max-w-sm mx-auto">실물 굿즈로 행운을 물리적으로 소유하는 경험</p>
            </Reveal>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { name: "꿈 부적 카드", price: "12,900원", desc: "신용카드 사이즈, 홀로그램 코팅. 지갑에 넣고 다니는 나만의 행운 부적.", accent: "primary", icon: "M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" },
                { name: "꿈 아트 포스터", price: "19,900원~", desc: "A4 프리미엄 아트지 인쇄. 액자 포함 옵션.", accent: "gold", icon: "M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159M15 10.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v13.5A1.5 1.5 0 003.75 21z" },
                { name: "꿈 엽서 세트", price: "14,900원", desc: "베스트 꿈 5장 엽서 세트. 특별한 선물로.", accent: "primary", icon: "M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" },
                { name: "올해의 꿈 달력", price: "29,900원", desc: "12개의 꿈 아트워크로 만든 달력. (시즌 한정)", accent: "gold", icon: "M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" },
              ].map((g, i) => (
                <Reveal key={g.name} delay={i * 0.08}>
                  <div className={`group relative glass rounded-2xl p-8 transition-all duration-700 hover:-translate-y-1.5 ${
                    g.accent === "gold" ? "hover:border-gold-400/[0.1]" : "hover:border-primary-400/[0.1]"
                  }`}>
                    {/* Hover glow */}
                    <div className={`absolute inset-0 rounded-2xl transition-opacity duration-700 opacity-0 group-hover:opacity-100 pointer-events-none ${
                      g.accent === "gold"
                        ? "bg-[radial-gradient(ellipse_at_50%_0%,rgba(245,197,66,0.02),transparent_60%)]"
                        : "bg-[radial-gradient(ellipse_at_50%_0%,rgba(109,60,239,0.025),transparent_60%)]"
                    }`} />
                    <div className="relative flex items-start gap-5">
                      {/* Icon */}
                      <div className={`w-10 h-10 rounded-full border flex items-center justify-center shrink-0 transition-colors duration-700 ${
                        g.accent === "gold"
                          ? "border-gold-400/[0.08] group-hover:border-gold-400/[0.15]"
                          : "border-primary-400/[0.08] group-hover:border-primary-400/[0.15]"
                      }`}>
                        <svg className={`w-4 h-4 ${g.accent === "gold" ? "text-gold-400/30" : "text-primary-400/30"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d={g.icon} />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-[15px] font-semibold text-text-primary/80 mb-1.5">{g.name}</h3>
                        <p className={`text-[14px] font-semibold mb-2.5 ${
                          g.accent === "gold" ? "text-gold-400/55" : "text-primary-400/55"
                        }`}>{g.price}</p>
                        <p className="text-[13px] text-text-muted/28 leading-relaxed">{g.desc}</p>
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Flowing mist transition */}
        <div className="relative h-36 sm:h-44 overflow-hidden pointer-events-none">
          <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 80% 100% at 50% 50%, rgba(219,112,147,0.03), transparent 70%)" }} />
          <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-surface-0 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-surface-0 to-transparent" />
        </div>

        {/* ═══════════════════════════════════════════
            TAEMONG PACKAGE — Immersive special section
        ═══════════════════════════════════════════ */}
        <section className="relative overflow-hidden" style={{ padding: "clamp(4rem, 10vw, 8rem) 0" }}>
          {/* Deep atmospheric layers */}
          <div className="absolute inset-0 pointer-events-none">
            <Image src="/images/hero-mist.png" alt="" fill className="object-cover opacity-[0.04] mix-blend-screen" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_30%,rgba(219,112,147,0.05),transparent)]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_50%_at_25%_60%,rgba(109,60,239,0.04),transparent)]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_30%_at_75%_40%,rgba(245,197,66,0.02),transparent)]" />
          </div>

          {/* Floating orbs */}
          <div className="absolute top-[15%] left-[8%] w-[200px] h-[200px] rounded-full bg-pink-400/[0.015] blur-[60px] animate-breathe pointer-events-none" />
          <div className="absolute bottom-[10%] right-[10%] w-[250px] h-[250px] rounded-full bg-primary-500/[0.02] blur-[70px] animate-breathe-deep pointer-events-none" />
          <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-pink-300/[0.008] blur-[80px] pointer-events-none" />

          {/* Rotating mystic rings */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none animate-mystic-ring" style={{ animationDuration: "100s" }}>
            <svg width="500" height="500" viewBox="0 0 500 500" className="opacity-[0.02]">
              <circle cx="250" cy="250" r="230" fill="none" stroke="rgba(219,112,147,0.5)" strokeWidth="0.5" strokeDasharray="5 15" />
              <circle cx="250" cy="250" r="190" fill="none" stroke="rgba(167,139,255,0.3)" strokeWidth="0.3" strokeDasharray="3 18" />
              <circle cx="250" cy="250" r="150" fill="none" stroke="rgba(245,197,66,0.2)" strokeWidth="0.3" strokeDasharray="4 20" />
            </svg>
          </div>

          <div className="relative mx-auto max-w-4xl px-5 sm:px-8">
            <Reveal>
              <div className="relative rounded-3xl overflow-hidden">
                {/* Outer glow */}
                <div className="absolute -inset-[1px] rounded-3xl bg-gradient-to-b from-pink-400/[0.08] via-primary-400/[0.03] to-transparent pointer-events-none" />
                <div className="absolute -inset-4 rounded-3xl bg-pink-500/[0.02] blur-2xl pointer-events-none" />

                <div className="relative glass-strong rounded-3xl p-8 sm:p-14 text-center border-pink-400/[0.06]">
                  {/* Inner atmospheric glow */}
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_20%,rgba(219,112,147,0.04),transparent)] pointer-events-none rounded-3xl" />
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_40%_at_50%_80%,rgba(109,60,239,0.02),transparent)] pointer-events-none rounded-3xl" />

                  <div className="relative">
                    {/* Floating icon */}
                    <motion.div
                      className="inline-block mb-6"
                      animate={{ y: [0, -8, 0] }}
                      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <div className="w-14 h-14 mx-auto rounded-full border border-pink-400/[0.1] flex items-center justify-center">
                        <svg className="w-6 h-6 text-pink-400/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                        </svg>
                      </div>
                    </motion.div>

                    <p className="text-[11px] tracking-[0.35em] text-pink-400/30 uppercase mb-4">Taemong Package</p>
                    <h2 className="font-[family-name:var(--font-display)] text-[clamp(1.6rem,4vw,2.6rem)] font-bold text-text-primary mb-4">
                      태몽 패키지
                    </h2>
                    <p className="text-[14px] text-text-muted/30 max-w-md mx-auto mb-12 leading-relaxed">
                      태몽을 세상에서 가장 예쁘게 간직하는 방법.
                      <br />AI 아트워크 + 태몽 해석 + 아이의 성격 분석 + 실물 굿즈.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-12">
                      {/* Basic */}
                      <div className="group glass rounded-2xl p-7 w-full sm:w-64 text-center transition-all duration-700 hover:-translate-y-1.5 hover:border-white/[0.06]">
                        <div className="absolute inset-0 rounded-2xl bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.005),transparent_60%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                        <div className="relative">
                          <p className="text-[11px] text-text-muted/25 mb-3 tracking-wider">베이직</p>
                          <p className="text-[2.2rem] font-bold text-text-primary tracking-tight leading-none">39,900<span className="text-[11px] text-text-muted/20 font-normal ml-0.5">원</span></p>
                          <div className="h-[1px] bg-gradient-to-r from-transparent via-white/[0.04] to-transparent my-5" />
                          <p className="text-[12px] text-text-muted/22 leading-relaxed">아트워크 + 리포트 + 부적카드</p>
                        </div>
                      </div>
                      {/* Premium */}
                      <div className="group relative glass rounded-2xl p-7 w-full sm:w-64 text-center border-gold-400/[0.08] transition-all duration-700 hover:-translate-y-1.5 hover:border-gold-400/[0.15] shadow-[0_0_50px_rgba(245,197,66,0.03)]">
                        <div className="absolute inset-0 rounded-2xl bg-[radial-gradient(ellipse_at_50%_0%,rgba(245,197,66,0.015),transparent_60%)] pointer-events-none" />
                        <div className="relative">
                          <p className="text-[11px] text-gold-400/35 mb-3 tracking-wider">프리미엄</p>
                          <p className="text-[2.2rem] font-bold text-gradient-gold tracking-tight leading-none">59,900<span className="text-[11px] text-text-muted/20 font-normal ml-0.5">원</span></p>
                          <div className="h-[1px] bg-gradient-to-r from-transparent via-gold-400/[0.06] to-transparent my-5" />
                          <p className="text-[12px] text-text-muted/22 leading-relaxed">베이직 + 액자 포스터 + 스토리북</p>
                        </div>
                      </div>
                    </div>

                    <Link
                      href="/dream"
                      className="group relative inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-pink-500/70 to-primary-500/70 px-10 py-4 text-[14px] font-semibold text-white transition-all duration-600 hover:shadow-[0_0_50px_rgba(219,112,147,0.15),0_0_100px_rgba(109,60,239,0.08)] overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/[0.08] to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                      <span className="relative">태몽 시각화하기</span>
                      <svg className="relative w-4 h-4 transition-transform duration-500 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            FINAL CTA — Atmospheric closing
        ═══════════════════════════════════════════ */}
        <section className="relative overflow-hidden" style={{ padding: "clamp(5rem, 12vw, 10rem) 0" }}>
          {/* Atmospheric layers */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_50%_at_50%_40%,rgba(109,60,239,0.05),transparent)] pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_40%_at_50%_60%,rgba(139,106,255,0.02),transparent)] pointer-events-none" />

          {/* Floating moon */}
          <motion.div
            style={{ y: floatY }}
            className="absolute left-[10%] top-[20%] w-[160px] h-[160px] pointer-events-none hidden lg:block"
          >
            <Image src="/images/hero-moon.png" alt="" fill className="object-contain opacity-[0.03]" />
            <div className="absolute inset-0 bg-glow-purple opacity-10 animate-breathe" />
          </motion.div>

          <div className="relative mx-auto max-w-3xl px-5 sm:px-8 text-center">
            <Reveal>
              <motion.div
                className="inline-block mb-8"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="w-8 h-8 mx-auto rounded-full border border-primary-400/[0.06] flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-primary-400/15 animate-breathe" />
                </div>
              </motion.div>

              <p className="text-[11px] tracking-[0.35em] text-primary-400/22 uppercase mb-5">Start Free</p>
              <h2 className="font-[family-name:var(--font-display)] text-[clamp(1.4rem,4vw,2.6rem)] font-bold text-text-primary leading-tight">
                무료로 시작하고<br />
                <span className="text-gradient">꿈의 의미를 발견하세요</span>
              </h2>
              <p className="mt-5 text-[13px] text-text-muted/25 max-w-sm mx-auto">
                매일 밤 찾아오는 메시지, 놓치지 마세요
              </p>
              <Link
                href="/dream"
                className="group relative mt-10 inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-primary-500/15 to-primary-600/15 hover:from-primary-500/25 hover:to-primary-600/25 backdrop-blur-md border border-primary-400/[0.08] hover:border-primary-400/[0.18] px-10 py-4 text-[15px] font-medium text-white transition-all duration-700 hover:shadow-[0_0_60px_rgba(109,60,239,0.12)]"
              >
                <div className="absolute inset-0 rounded-full bg-primary-500/[0.03] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <span className="relative">무료로 꿈 해몽 받기</span>
                <svg className="relative w-4 h-4 transition-transform duration-500 group-hover:translate-x-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </Reveal>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
