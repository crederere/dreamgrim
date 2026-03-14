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

  return (
    <div className="relative min-h-screen bg-surface-0">
      <StarField />
      <Header />

      <main className="relative z-10">
        {/* ═══════════════════════════════════════════
            HERO — Atmospheric pricing header
        ═══════════════════════════════════════════ */}
        <section ref={heroRef} className="relative pt-32 pb-20 overflow-hidden">
          {/* Atmospheric layers */}
          <div className="absolute inset-0 pointer-events-none">
            <Image src="/images/hero-mist.png" alt="" fill className="object-cover opacity-[0.04] mix-blend-screen" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_30%,rgba(109,60,239,0.06),transparent)]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_40%_at_70%_60%,rgba(245,197,66,0.025),transparent)]" />
          </div>

          {/* Mystic ring */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none animate-mystic-ring" style={{ animationDuration: "90s" }}>
            <svg width="500" height="500" viewBox="0 0 500 500" className="opacity-[0.02]">
              <circle cx="250" cy="250" r="220" fill="none" stroke="rgba(167,139,255,0.5)" strokeWidth="0.5" strokeDasharray="6 14" />
              <circle cx="250" cy="250" r="180" fill="none" stroke="rgba(245,197,66,0.3)" strokeWidth="0.3" strokeDasharray="4 18" />
            </svg>
          </div>

          {/* Floating moon */}
          <motion.div
            style={{ y: floatY }}
            className="absolute right-[8%] top-[15%] w-[200px] h-[200px] pointer-events-none hidden lg:block"
          >
            <Image src="/images/hero-moon.png" alt="" fill className="object-contain opacity-[0.035]" />
            <div className="absolute inset-0 bg-glow-purple opacity-15 animate-breathe-deep" />
          </motion.div>

          <div className="relative mx-auto max-w-5xl px-5 sm:px-8">
            <Reveal className="text-center">
              <p className="text-[11px] tracking-[0.35em] text-primary-400/35 uppercase mb-5">Pricing</p>
              <h1 className="font-[family-name:var(--font-display)] text-[clamp(2rem,5vw,3.4rem)] font-bold text-text-primary leading-tight">
                당신의 꿈에 맞는 <span className="text-gradient">요금제</span>
              </h1>
              <p className="mt-5 text-[15px] text-text-muted/40 max-w-md mx-auto leading-relaxed">
                무료로 시작하고, 더 깊은 의미를 원할 때 업그레이드하세요
              </p>
            </Reveal>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            PRICING CARDS
        ═══════════════════════════════════════════ */}
        <section className="relative overflow-hidden pb-8">
          {/* Ambient orbs */}
          <div className="absolute top-[10%] left-[5%] w-[250px] h-[250px] rounded-full bg-primary-500/[0.015] blur-[70px] animate-breathe pointer-events-none" />
          <div className="absolute bottom-[20%] right-[8%] w-[200px] h-[200px] rounded-full bg-gold-400/[0.012] blur-[50px] animate-breathe-deep pointer-events-none" />

          <div className="relative mx-auto max-w-5xl px-5 sm:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Free */}
              <Reveal>
                <div className="group glass rounded-2xl p-7 h-full flex flex-col transition-all duration-700 hover:-translate-y-1.5 hover:border-white/[0.06]">
                  <div className="absolute inset-0 rounded-2xl bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.008),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                  <div className="relative">
                    <div className="text-[12px] text-text-muted/35 mb-2 tracking-wider">무료</div>
                    <div className="flex items-baseline gap-1 mb-1">
                      <span className="text-[2.4rem] font-bold text-text-primary tracking-tight leading-none">0</span>
                      <span className="text-[12px] text-text-muted/25">원</span>
                    </div>
                    <p className="text-[11px] text-text-muted/20 mb-7">주 2회 체험</p>

                    <div className="h-[1px] bg-gradient-to-r from-transparent via-white/[0.03] to-transparent mb-6" />

                    <ul className="space-y-3 mb-8 flex-1">
                      {["AI 아트워크 (저화질)", "한 줄 해몽", "재물운 점수", "행운 번호 2개", "수채화 스타일"].map((f) => (
                        <li key={f} className="flex items-start gap-2.5 text-[13px] text-text-secondary/55">
                          <svg className="w-3.5 h-3.5 text-white/12 mt-[2px] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                          {f}
                        </li>
                      ))}
                    </ul>
                    <Link
                      href="/dream"
                      className="block w-full text-center rounded-full py-3 text-[13px] font-semibold bg-white/[0.03] text-text-primary/60 border border-white/[0.04] hover:bg-white/[0.06] hover:border-white/[0.08] transition-all duration-500"
                    >
                      무료로 시작
                    </Link>
                  </div>
                </div>
              </Reveal>

              {/* Single Report — Highlighted */}
              <Reveal delay={0.1}>
                <div className="group relative glass-strong rounded-2xl p-7 border-primary-500/20 h-full flex flex-col transition-all duration-700 hover:-translate-y-2 shadow-[0_0_60px_rgba(109,60,239,0.05)]">
                  {/* Hover glow */}
                  <div className="absolute inset-0 rounded-2xl bg-[radial-gradient(ellipse_at_center,rgba(109,60,239,0.04),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 px-4 py-1 text-[10px] font-semibold text-white tracking-[0.1em] shadow-[0_4px_20px_rgba(109,60,239,0.25)]">
                    추천
                  </div>

                  <div className="relative">
                    <div className="text-[12px] text-primary-400/40 mb-2 tracking-wider">운세 리포트</div>
                    <div className="flex items-baseline gap-1.5 mb-1">
                      <span className="text-[2.4rem] font-bold text-gradient tracking-tight leading-none">4,900</span>
                      <span className="text-[12px] text-text-muted/25">원</span>
                    </div>
                    <p className="text-[11px] text-text-muted/20 mb-7">1회 구매</p>

                    <div className="h-[1px] bg-gradient-to-r from-transparent via-primary-400/[0.06] to-transparent mb-6" />

                    <ul className="space-y-3 mb-8 flex-1">
                      {[
                        "고화질 아트워크",
                        "상세 해몽 + 심리 분석",
                        "4개 영역 운세 전체",
                        "행운 번호 6개 전체",
                        "행운의 색 · 방향 · 시간",
                        "오늘의 조언",
                        "5가지 아트 스타일",
                      ].map((f) => (
                        <li key={f} className="flex items-start gap-2.5 text-[13px] text-text-secondary/60">
                          <svg className="w-3.5 h-3.5 text-primary-400/45 mt-[2px] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                          {f}
                        </li>
                      ))}
                    </ul>
                    <Link
                      href="/dream"
                      className="block w-full text-center rounded-full py-3 text-[13px] font-semibold bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:shadow-[0_0_30px_rgba(109,60,239,0.15)] hover:from-primary-400 hover:to-primary-500 transition-all duration-500"
                    >
                      리포트 받기
                    </Link>
                  </div>
                </div>
              </Reveal>

              {/* Subscription */}
              <Reveal delay={0.2}>
                <div className="group glass rounded-2xl p-7 h-full flex flex-col transition-all duration-700 hover:-translate-y-1.5 hover:border-gold-400/[0.08]">
                  <div className="absolute inset-0 rounded-2xl bg-[radial-gradient(ellipse_at_center,rgba(245,197,66,0.01),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                  <div className="relative">
                    <div className="text-[12px] text-gold-400/40 mb-2 tracking-wider">꿈 구독</div>
                    <div className="flex items-baseline gap-1.5 mb-1">
                      <span className="text-[2.4rem] font-bold text-gradient-gold tracking-tight leading-none">9,900</span>
                      <span className="text-[12px] text-text-muted/25">원/월</span>
                    </div>
                    <p className="text-[11px] text-text-muted/20 mb-7">매일 무제한</p>

                    <div className="h-[1px] bg-gradient-to-r from-transparent via-gold-400/[0.04] to-transparent mb-6" />

                    <ul className="space-y-3 mb-8 flex-1">
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
                          <svg className="w-3.5 h-3.5 text-gold-400/35 mt-[2px] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                          {f}
                        </li>
                      ))}
                    </ul>
                    <button className="block w-full text-center rounded-full py-3 text-[13px] font-semibold bg-gradient-to-r from-gold-400 to-gold-500 text-surface-0 transition-all duration-500 hover:shadow-[0_0_30px_rgba(245,197,66,0.15)]">
                      구독 시작
                    </button>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* Section mist transition */}
        <div className="relative h-32 sm:h-40 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 animate-drift-x" style={{ background: "radial-gradient(ellipse 80% 100% at 50% 50%, rgba(139,106,255,0.04), transparent 70%)" }} />
          <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-surface-0 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-surface-0 to-transparent" />
          <div className="absolute inset-x-[20%] top-1/2 -translate-y-1/2 h-[1px] bg-gradient-to-r from-transparent via-white/[0.03] to-transparent" />
        </div>

        {/* ═══════════════════════════════════════════
            COMPARISON TABLE
        ═══════════════════════════════════════════ */}
        <section className="relative overflow-hidden" style={{ padding: "clamp(3rem, 8vw, 6rem) 0" }}>
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_40%_at_50%_50%,rgba(109,60,239,0.03),transparent)]" />
          </div>

          <div className="relative mx-auto max-w-5xl px-5 sm:px-8">
            <Reveal className="text-center mb-12">
              <h2 className="font-[family-name:var(--font-display)] text-[clamp(1.5rem,3vw,2.2rem)] font-bold text-text-primary">
                상세 <span className="text-gradient">비교</span>
              </h2>
            </Reveal>

            <Reveal>
              <div className="overflow-x-auto rounded-2xl glass">
                <table className="w-full text-[13px]">
                  <thead>
                    <tr className="border-b border-white/[0.04]">
                      <th className="text-left p-4 sm:p-5 text-text-muted/40 font-medium text-[12px] tracking-wider">기능</th>
                      <th className="p-4 sm:p-5 text-text-muted/40 font-medium text-center text-[12px] tracking-wider">무료</th>
                      <th className="p-4 sm:p-5 text-primary-400/50 font-medium text-center text-[12px] tracking-wider">4,900원</th>
                      <th className="p-4 sm:p-5 text-gold-400/50 font-medium text-center text-[12px] tracking-wider">9,900원/월</th>
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
                        className={`border-b border-white/[0.02] transition-colors duration-300 hover:bg-white/[0.01] ${i % 2 === 0 ? "bg-white/[0.005]" : ""}`}
                      >
                        <td className="p-4 sm:p-5 text-text-secondary/70 font-medium">{row.feature}</td>
                        <td className="p-4 sm:p-5 text-center text-text-muted/30">{row.free}</td>
                        <td className="p-4 sm:p-5 text-center text-text-secondary/60">{row.paid}</td>
                        <td className="p-4 sm:p-5 text-center text-text-primary/80">{row.sub}</td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Section mist transition */}
        <div className="relative h-32 sm:h-40 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 animate-drift-x" style={{ background: "radial-gradient(ellipse 80% 100% at 50% 50%, rgba(245,197,66,0.03), transparent 70%)", animationDelay: "-5s" }} />
          <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-surface-0 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-surface-0 to-transparent" />
          <div className="absolute inset-x-[25%] top-1/2 -translate-y-1/2 h-[1px] bg-gradient-to-r from-transparent via-gold-400/[0.04] to-transparent" />
        </div>

        {/* ═══════════════════════════════════════════
            GOODS — Mystical product cards
        ═══════════════════════════════════════════ */}
        <section className="relative overflow-hidden" style={{ padding: "clamp(3rem, 8vw, 6rem) 0" }}>
          {/* Atmospheric */}
          <div className="absolute inset-0 pointer-events-none">
            <Image src="/images/section-clouds.png" alt="" fill className="object-cover opacity-[0.03] mix-blend-screen" />
          </div>
          <div className="absolute top-[30%] right-[5%] w-[200px] h-[200px] rounded-full bg-primary-500/[0.015] blur-[60px] animate-breathe-deep pointer-events-none" />

          <div className="relative mx-auto max-w-5xl px-5 sm:px-8">
            <Reveal className="text-center mb-12">
              <p className="text-[11px] tracking-[0.3em] text-primary-400/30 uppercase mb-3">Goods</p>
              <h2 className="font-[family-name:var(--font-display)] text-[clamp(1.5rem,3vw,2.2rem)] font-bold text-text-primary">
                꿈의 운을 <span className="text-gradient">간직하세요</span>
              </h2>
              <p className="mt-3 text-[13px] text-text-muted/30 max-w-sm mx-auto">실물 굿즈로 행운을 물리적으로 소유하는 경험</p>
            </Reveal>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {[
                { name: "꿈 부적 카드", price: "12,900원", desc: "신용카드 사이즈, 홀로그램 코팅. 지갑에 넣고 다니는 나만의 행운 부적.", accent: "primary" },
                { name: "꿈 아트 포스터", price: "19,900원~", desc: "A4 프리미엄 아트지 인쇄. 액자 포함 옵션.", accent: "gold" },
                { name: "꿈 엽서 세트", price: "14,900원", desc: "베스트 꿈 5장 엽서 세트. 특별한 선물로.", accent: "primary" },
                { name: "올해의 꿈 달력", price: "29,900원", desc: "12개의 꿈 아트워크로 만든 달력. (시즌 한정)", accent: "gold" },
              ].map((g, i) => (
                <Reveal key={g.name} delay={i * 0.08}>
                  <div className={`group glass rounded-2xl p-7 transition-all duration-700 hover:-translate-y-1 ${
                    g.accent === "gold" ? "hover:border-gold-400/[0.08]" : "hover:border-primary-400/[0.08]"
                  }`}>
                    {/* Hover glow */}
                    <div className={`absolute inset-0 rounded-2xl transition-opacity duration-700 opacity-0 group-hover:opacity-100 pointer-events-none ${
                      g.accent === "gold"
                        ? "bg-[radial-gradient(ellipse_at_center,rgba(245,197,66,0.015),transparent_70%)]"
                        : "bg-[radial-gradient(ellipse_at_center,rgba(109,60,239,0.02),transparent_70%)]"
                    }`} />
                    <div className="relative">
                      <h3 className="text-[15px] font-semibold text-text-primary/85 mb-2">{g.name}</h3>
                      <p className={`text-[14px] font-semibold mb-3 ${
                        g.accent === "gold" ? "text-gold-400/60" : "text-primary-400/60"
                      }`}>{g.price}</p>
                      <p className="text-[13px] text-text-muted/30 leading-relaxed">{g.desc}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Section mist transition */}
        <div className="relative h-32 sm:h-40 overflow-hidden pointer-events-none">
          <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 80% 100% at 50% 50%, rgba(219,112,147,0.03), transparent 70%)" }} />
          <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-surface-0 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-surface-0 to-transparent" />
        </div>

        {/* ═══════════════════════════════════════════
            TAEMONG PACKAGE — Immersive special section
        ═══════════════════════════════════════════ */}
        <section className="relative overflow-hidden" style={{ padding: "clamp(4rem, 10vw, 8rem) 0" }}>
          {/* Atmospheric layers */}
          <div className="absolute inset-0 pointer-events-none">
            <Image src="/images/hero-mist.png" alt="" fill className="object-cover opacity-[0.03] mix-blend-screen" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_40%,rgba(219,112,147,0.04),transparent)]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_40%_at_30%_60%,rgba(109,60,239,0.03),transparent)]" />
          </div>

          {/* Floating orbs */}
          <div className="absolute top-[20%] left-[10%] w-[180px] h-[180px] rounded-full bg-pink-400/[0.012] blur-[50px] animate-breathe pointer-events-none" />
          <div className="absolute bottom-[15%] right-[12%] w-[220px] h-[220px] rounded-full bg-primary-500/[0.015] blur-[60px] animate-breathe-deep pointer-events-none" />

          {/* Rotating mystic ring */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none animate-mystic-ring" style={{ animationDuration: "100s" }}>
            <svg width="400" height="400" viewBox="0 0 400 400" className="opacity-[0.015]">
              <circle cx="200" cy="200" r="180" fill="none" stroke="rgba(219,112,147,0.5)" strokeWidth="0.5" strokeDasharray="5 15" />
              <circle cx="200" cy="200" r="150" fill="none" stroke="rgba(167,139,255,0.3)" strokeWidth="0.3" strokeDasharray="3 18" />
            </svg>
          </div>

          <div className="relative mx-auto max-w-4xl px-5 sm:px-8">
            <Reveal>
              <div className="rounded-3xl glass-strong p-8 sm:p-14 text-center border-pink-400/[0.06] relative overflow-hidden">
                {/* Inner glow */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_30%,rgba(219,112,147,0.03),transparent)] pointer-events-none" />

                <div className="relative">
                  <p className="text-[11px] tracking-[0.3em] text-pink-400/35 uppercase mb-4">Taemong Package</p>
                  <h2 className="font-[family-name:var(--font-display)] text-[clamp(1.6rem,4vw,2.4rem)] font-bold text-text-primary mb-4">
                    태몽 패키지
                  </h2>
                  <p className="text-[14px] text-text-muted/35 max-w-md mx-auto mb-10 leading-relaxed">
                    태몽을 세상에서 가장 예쁘게 간직하는 방법.
                    <br />AI 아트워크 + 태몽 해석 + 아이의 성격 분석 + 실물 굿즈.
                  </p>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-10">
                    <div className="group glass rounded-2xl p-7 w-full sm:w-64 text-center transition-all duration-700 hover:-translate-y-1 hover:border-white/[0.06]">
                      <p className="text-[11px] text-text-muted/30 mb-2 tracking-wider">베이직</p>
                      <p className="text-[2rem] font-bold text-text-primary tracking-tight leading-none">39,900<span className="text-[11px] text-text-muted/25 font-normal ml-0.5">원</span></p>
                      <div className="h-[1px] bg-gradient-to-r from-transparent via-white/[0.03] to-transparent my-4" />
                      <p className="text-[12px] text-text-muted/25">아트워크 + 리포트 + 부적카드</p>
                    </div>
                    <div className="group glass rounded-2xl p-7 w-full sm:w-64 text-center border-gold-400/[0.08] transition-all duration-700 hover:-translate-y-1 hover:border-gold-400/[0.15] shadow-[0_0_40px_rgba(245,197,66,0.03)]">
                      {/* Glow */}
                      <div className="absolute inset-0 rounded-2xl bg-[radial-gradient(ellipse_at_center,rgba(245,197,66,0.01),transparent_70%)] pointer-events-none" />
                      <div className="relative">
                        <p className="text-[11px] text-gold-400/40 mb-2 tracking-wider">프리미엄</p>
                        <p className="text-[2rem] font-bold text-gradient-gold tracking-tight leading-none">59,900<span className="text-[11px] text-text-muted/25 font-normal ml-0.5">원</span></p>
                        <div className="h-[1px] bg-gradient-to-r from-transparent via-gold-400/[0.06] to-transparent my-4" />
                        <p className="text-[12px] text-text-muted/25">베이직 + 액자 포스터 + 스토리북</p>
                      </div>
                    </div>
                  </div>

                  <Link
                    href="/dream"
                    className="group inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-pink-500/70 to-primary-500/70 px-9 py-3.5 text-[14px] font-semibold text-white transition-all duration-600 hover:shadow-[0_0_40px_rgba(219,112,147,0.15),0_0_80px_rgba(109,60,239,0.06)]"
                  >
                    태몽 시각화하기
                    <svg className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            FINAL CTA
        ═══════════════════════════════════════════ */}
        <section className="relative overflow-hidden" style={{ padding: "clamp(5rem, 12vw, 10rem) 0" }}>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_50%_at_50%_50%,rgba(109,60,239,0.04),transparent)] pointer-events-none" />

          <div className="relative mx-auto max-w-3xl px-5 sm:px-8 text-center">
            <Reveal>
              <p className="text-[11px] tracking-[0.35em] text-primary-400/25 uppercase mb-5">Start Free</p>
              <h2 className="font-[family-name:var(--font-display)] text-[clamp(1.4rem,4vw,2.4rem)] font-bold text-text-primary leading-tight">
                무료로 시작하고<br />
                <span className="text-gradient">꿈의 의미를 발견하세요</span>
              </h2>
              <Link
                href="/dream"
                className="group relative mt-10 inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-primary-500/15 to-primary-600/15 hover:from-primary-500/25 hover:to-primary-600/25 backdrop-blur-md border border-primary-400/[0.08] hover:border-primary-400/[0.18] px-10 py-4 text-[15px] font-medium text-white transition-all duration-700 hover:shadow-[0_0_60px_rgba(109,60,239,0.1)]"
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
