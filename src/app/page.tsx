"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import StarField from "@/components/dream/StarField";
import FortuneBar from "@/components/dream/FortuneBar";

/* ─── Gallery ─── */
const GALLERY = [
  { id: 1, src: "/images/gallery-1.png", title: "투명한 바다 위, 하늘을 나는 고래", mood: "신비", score: 85 },
  { id: 2, src: "/images/gallery-2.png", title: "금빛 비늘의 용이 구름을 가르다", mood: "웅장", score: 92 },
  { id: 3, src: "/images/gallery-3.png", title: "대나무 숲의 황금 돼지", mood: "길몽", score: 98 },
  { id: 4, src: "/images/gallery-4.png", title: "달빛 아래 벚꽃 비가 내리다", mood: "평화", score: 88 },
  { id: 5, src: "/images/gallery-5.png", title: "끝없이 이어지는 우주의 계단", mood: "몽환", score: 67 },
  { id: 6, src: "/images/gallery-6.png", title: "연꽃 위의 무지개빛 뱀", mood: "신비", score: 76 },
];

/* ─── Reveal with glow ─── */
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

/* ─── Section Divider: flowing mist between sections ─── */
function SectionMist({ variant = "purple" }: { variant?: "purple" | "gold" | "mixed" }) {
  const colors = {
    purple: "rgba(109,60,239,0.08)",
    gold: "rgba(245,197,66,0.06)",
    mixed: "rgba(139,106,255,0.06)",
  };
  return (
    <div className="relative h-32 sm:h-48 overflow-hidden pointer-events-none">
      <div
        className="absolute inset-0 animate-drift-x"
        style={{
          background: `radial-gradient(ellipse 80% 100% at 50% 50%, ${colors[variant]}, transparent 70%)`,
        }}
      />
      <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-surface-0 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-surface-0 to-transparent" />
      <div className="absolute inset-x-[20%] top-1/2 -translate-y-1/2 h-[1px] bg-gradient-to-r from-transparent via-white/[0.03] to-transparent" />
    </div>
  );
}

export default function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  // Hero scroll effects
  const heroScale = useTransform(heroProgress, [0, 1], [1, 1.35]);
  const heroOpacity = useTransform(heroProgress, [0, 0.5, 1], [1, 1, 0]);
  const heroHue = useTransform(heroProgress, [0, 1], [0, 15]);
  const textY = useTransform(heroProgress, [0, 1], [0, -150]);
  const textOpacity = useTransform(heroProgress, [0, 0.35], [1, 0]);
  const mistY = useTransform(heroProgress, [0, 1], [0, 80]);
  const auroraOpacity = useTransform(heroProgress, [0, 0.3, 0.6], [0.3, 0.6, 0]);

  // Multiple parallax speeds
  const { scrollYProgress: pageProgress } = useScroll();
  const floatY1 = useTransform(pageProgress, [0, 1], [0, -220]);
  const floatY2 = useTransform(pageProgress, [0, 1], [0, -380]);
  const floatY3 = useTransform(pageProgress, [0, 1], [0, -160]);
  const floatY4 = useTransform(pageProgress, [0, 1], [0, -280]);

  // Gallery section scroll
  const galleryRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: galleryProgress } = useScroll({
    target: galleryRef,
    offset: ["start end", "end start"],
  });
  const galleryParallax = useTransform(galleryProgress, [0, 1], [60, -60]);

  // Lucky numbers section scroll
  const luckyRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: luckyProgress } = useScroll({
    target: luckyRef,
    offset: ["start end", "end start"],
  });
  const orbScale = useTransform(luckyProgress, [0, 0.5, 1], [0.8, 1.1, 0.9]);
  const orbRotate = useTransform(luckyProgress, [0, 1], [0, 30]);

  return (
    <div className="relative bg-surface-0">
      <StarField />
      <Header />

      {/* ═══════════════════════════════════════════
          HERO — Immersive scroll-zoom with aurora layers
      ═══════════════════════════════════════════ */}
      <section ref={heroRef} className="relative h-[220vh]">
        <div className="sticky top-0 h-screen overflow-hidden">
          {/* Base landscape — zooms into the dream */}
          <motion.div
            style={{ scale: heroScale, opacity: heroOpacity, filter: useTransform(heroHue, v => `hue-rotate(${v}deg)`) }}
            className="absolute inset-0 origin-center"
          >
            <Image
              src="/images/hero-bg.png"
              alt=""
              fill
              className="object-cover object-center"
              priority
              quality={90}
            />
          </motion.div>

          {/* Aurora borealis layer — slow moving ethereal light */}
          <motion.div
            style={{ opacity: auroraOpacity }}
            className="absolute inset-0 pointer-events-none animate-aurora"
          >
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_100%_40%_at_30%_20%,rgba(109,60,239,0.15),transparent_60%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_30%_at_70%_30%,rgba(139,106,255,0.1),transparent_60%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_25%_at_50%_15%,rgba(245,197,66,0.04),transparent_60%)]" />
          </motion.div>

          {/* Atmospheric mist — separate parallax speed */}
          <motion.div
            style={{ y: mistY }}
            className="absolute inset-0 pointer-events-none"
          >
            <Image
              src="/images/hero-mist.png"
              alt=""
              fill
              className="object-cover opacity-50 mix-blend-screen"
            />
          </motion.div>

          {/* Second mist layer — moves opposite direction */}
          <motion.div
            style={{ y: useTransform(heroProgress, [0, 1], [0, -40]), x: useTransform(heroProgress, [0, 1], [0, 30]) }}
            className="absolute inset-0 pointer-events-none"
          >
            <Image
              src="/images/section-clouds.png"
              alt=""
              fill
              className="object-cover opacity-[0.08] mix-blend-screen scale-125"
            />
          </motion.div>

          {/* Vignette — deeper edges for focus */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_center,transparent_20%,rgba(4,2,12,0.75)_100%)] pointer-events-none" />

          {/* Bottom fade — seamless meld into page */}
          <div className="absolute bottom-0 inset-x-0 h-[45%] bg-gradient-to-t from-surface-0 via-surface-0/85 to-transparent pointer-events-none" />

          {/* Mystic ring — very subtle sacred geometry hint */}
          <motion.div
            style={{ opacity: useTransform(heroProgress, [0, 0.3, 0.7], [0, 0.03, 0]) }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none animate-mystic-ring"
          >
            <svg width="600" height="600" viewBox="0 0 600 600" className="opacity-100">
              <circle cx="300" cy="300" r="250" fill="none" stroke="rgba(167,139,255,0.5)" strokeWidth="0.5" strokeDasharray="8 12" />
              <circle cx="300" cy="300" r="200" fill="none" stroke="rgba(245,197,66,0.3)" strokeWidth="0.3" strokeDasharray="4 16" />
              <circle cx="300" cy="300" r="150" fill="none" stroke="rgba(167,139,255,0.2)" strokeWidth="0.3" strokeDasharray="2 20" />
            </svg>
          </motion.div>

          {/* Content */}
          <motion.div
            style={{ y: textY, opacity: textOpacity }}
            className="absolute inset-0 z-10 flex items-center justify-center"
          >
            <div className="text-center px-5 max-w-4xl">
              <motion.p
                initial={{ opacity: 0, letterSpacing: "0.2em" }}
                animate={{ opacity: 1, letterSpacing: "0.35em" }}
                transition={{ duration: 1.5, delay: 0.5 }}
                className="text-[11px] text-gold-400/60 uppercase mb-7 font-medium"
              >
                AI Dream Fortune
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.4, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="font-[family-name:var(--font-display)] text-[clamp(2.6rem,7vw,5.5rem)] font-bold leading-[1.08] tracking-tight"
              >
                <span className="text-white drop-shadow-[0_0_80px_rgba(109,60,239,0.35)]">어젯밤 꿈이</span>
                <br />
                <span className="text-gradient drop-shadow-[0_0_60px_rgba(167,139,255,0.25)]">알려주는 내 운명</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, delay: 1.1 }}
                className="mt-7 text-[clamp(0.95rem,2vw,1.15rem)] text-white/55 max-w-lg mx-auto leading-relaxed"
              >
                꿈을 입력하면 AI가 해몽하고, 오늘의 운세와
                <br className="hidden sm:block" />
                행운 번호 6개를 알려드립니다
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.5 }}
                className="mt-12"
              >
                <Link
                  href="/dream"
                  className="group relative inline-flex items-center gap-3 rounded-full bg-white/[0.08] hover:bg-white/[0.14] backdrop-blur-md border border-white/[0.08] hover:border-white/[0.18] px-10 py-4 text-[15px] font-medium text-white transition-all duration-700 hover:shadow-[0_0_60px_rgba(167,139,255,0.12),0_0_120px_rgba(109,60,239,0.06)]"
                >
                  <div className="absolute inset-0 rounded-full bg-primary-500/5 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  <span className="relative">무료로 꿈 해몽 받기</span>
                  <svg className="relative w-4 h-4 transition-transform duration-500 group-hover:translate-x-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </motion.div>

              {/* Scroll indicator */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.35 }}
                transition={{ delay: 3 }}
                className="mt-24"
              >
                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                  className="flex flex-col items-center gap-3"
                >
                  <span className="text-[9px] text-white/25 tracking-[0.3em]">SCROLL</span>
                  <div className="w-[1px] h-12 bg-gradient-to-b from-white/15 via-primary-400/10 to-transparent" />
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          TRANSITION — Floating artworks + "What dreams reveal"
          Dream world continues, no hard cuts
      ═══════════════════════════════════════════ */}
      <section className="relative -mt-[35vh] z-10 pb-16">
        {/* Ambient glow behind floating images */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[5vh] left-[10%] w-[300px] h-[300px] rounded-full bg-primary-500/[0.03] blur-[80px]" />
          <div className="absolute top-[30vh] right-[15%] w-[250px] h-[250px] rounded-full bg-gold-400/[0.02] blur-[60px]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
          {/* Left floating artwork with glow */}
          <motion.div
            style={{ y: floatY1 }}
            className="absolute -left-4 sm:left-[4%] top-[8vh] w-[35vw] max-w-[280px] pointer-events-none hidden md:block"
          >
            <div className="relative">
              <div className="absolute -inset-4 bg-primary-500/[0.04] rounded-3xl blur-2xl" />
              <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-primary-900/40 rotate-[-4deg]">
                <Image src="/images/gallery-4.png" alt="" width={280} height={280} className="object-cover" />
              </div>
            </div>
          </motion.div>

          {/* Right floating artwork with glow */}
          <motion.div
            style={{ y: floatY2 }}
            className="absolute -right-4 sm:right-[2%] top-[20vh] w-[30vw] max-w-[240px] pointer-events-none hidden md:block"
          >
            <div className="relative">
              <div className="absolute -inset-4 bg-gold-400/[0.03] rounded-3xl blur-2xl" />
              <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-primary-900/40 rotate-[3deg]">
                <Image src="/images/gallery-2.png" alt="" width={240} height={240} className="object-cover" />
              </div>
            </div>
          </motion.div>

          {/* Third floating — bottom left, subtle */}
          <motion.div
            style={{ y: floatY4 }}
            className="absolute left-[15%] top-[55vh] w-[20vw] max-w-[180px] pointer-events-none hidden lg:block"
          >
            <div className="relative opacity-40">
              <div className="rounded-2xl overflow-hidden shadow-xl rotate-[5deg]">
                <Image src="/images/gallery-6.png" alt="" width={180} height={180} className="object-cover" />
              </div>
            </div>
          </motion.div>

          {/* Center content */}
          <div className="relative max-w-2xl mx-auto pt-[18vh]">
            <Reveal className="text-center mb-10">
              <p className="text-[11px] tracking-[0.3em] text-primary-400/40 uppercase mb-4">What your dream reveals</p>
              <h2 className="font-[family-name:var(--font-display)] text-[clamp(1.6rem,4vw,2.8rem)] font-bold text-text-primary leading-tight">
                꿈 하나로<br />
                <span className="text-gradient">이 모든 것을</span>
              </h2>
            </Reveal>

            <div className="space-y-1">
              {[
                { title: "AI 해몽", desc: "동양 해몽학 × 심리학 교차 분석", icon: "M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" },
                { title: "4가지 운세", desc: "재물운 · 연애운 · 건강운 · 직장운", icon: "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" },
                { title: "행운 번호 6개", desc: "꿈 기반 맞춤 번호, 로또 번호로 즉시 활용", icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" },
                { title: "꿈 아트워크", desc: "AI가 그려주는 몽환적 일러스트, SNS 공유", icon: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" },
              ].map((item, i) => (
                <Reveal key={item.title} delay={i * 0.08}>
                  <div className="group flex items-center gap-5 py-5 border-b border-white/[0.03] last:border-0 transition-all duration-500 hover:pl-2">
                    <div className="w-8 h-8 rounded-full bg-white/[0.02] border border-white/[0.04] flex items-center justify-center shrink-0 group-hover:border-primary-400/15 group-hover:bg-primary-500/[0.04] transition-all duration-500">
                      <svg className="w-3.5 h-3.5 text-primary-400/30 group-hover:text-primary-400/60 transition-colors duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                      </svg>
                    </div>
                    <div className="flex items-baseline gap-4 flex-1">
                      <span className="text-[14px] font-semibold text-text-primary whitespace-nowrap">{item.title}</span>
                      <span className="text-[13px] text-text-muted/40">{item.desc}</span>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <SectionMist variant="purple" />

      {/* ═══════════════════════════════════════════
          GALLERY — Staggered masonry with glow borders
      ═══════════════════════════════════════════ */}
      <section ref={galleryRef} className="relative overflow-hidden" style={{ padding: "clamp(4rem, 10vw, 8rem) 0" }} id="gallery">
        {/* Deep atmospheric layers */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div style={{ y: galleryParallax }}>
            <Image src="/images/section-clouds.png" alt="" fill className="object-cover opacity-[0.06] mix-blend-screen" />
          </motion.div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_40%,rgba(109,60,239,0.04),transparent)]" />
        </div>

        {/* Floating ambient orbs */}
        <div className="absolute top-[20%] left-[5%] w-[200px] h-[200px] rounded-full bg-primary-500/[0.02] blur-[60px] animate-breathe-deep pointer-events-none" />
        <div className="absolute bottom-[15%] right-[8%] w-[180px] h-[180px] rounded-full bg-gold-400/[0.015] blur-[50px] animate-breathe pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
          <Reveal className="text-center mb-16">
            <p className="text-[11px] tracking-[0.3em] text-primary-400/40 uppercase mb-3">Gallery</p>
            <h2 className="font-[family-name:var(--font-display)] text-[clamp(1.6rem,4vw,2.8rem)] font-bold text-text-primary">
              이런 <span className="text-gradient">꿈이 그려졌어요</span>
            </h2>
            <p className="mt-3 text-[13px] text-text-muted/30 max-w-sm mx-auto">실제 사용자들의 꿈에서 탄생한 아트워크</p>
          </Reveal>

          {/* Staggered grid with glow-border cards */}
          <div className="grid grid-cols-12 gap-3 sm:gap-4">
            {/* Row 1: large + small */}
            <Reveal className="col-span-12 sm:col-span-7">
              <div className="artwork-card-glow group cursor-pointer">
                <div className="aspect-[4/3] relative">
                  <Image src={GALLERY[0].src} alt={GALLERY[0].title} fill className="object-cover" sizes="60vw" />
                  <div className="absolute inset-0 z-10 flex flex-col justify-end p-5 opacity-0 group-hover:opacity-100 transition-all duration-600">
                    <p className="text-[14px] text-white font-medium drop-shadow-lg">{GALLERY[0].title}</p>
                    <p className="text-[11px] text-white/50 mt-1">{GALLERY[0].mood} · {GALLERY[0].score}점</p>
                  </div>
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.1} className="col-span-6 sm:col-span-5">
              <div className="artwork-card-glow group cursor-pointer">
                <div className="aspect-square relative">
                  <Image src={GALLERY[1].src} alt={GALLERY[1].title} fill className="object-cover" sizes="40vw" />
                  <div className="absolute inset-0 z-10 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-all duration-600">
                    <p className="text-[13px] text-white font-medium drop-shadow-lg">{GALLERY[1].title}</p>
                    <p className="text-[11px] text-gold-400/70 mt-1">{GALLERY[1].score}점 · {GALLERY[1].mood}</p>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Row 2: small + large */}
            <Reveal delay={0.05} className="col-span-6 sm:col-span-5">
              <div className="artwork-card-glow group cursor-pointer">
                <div className="aspect-square relative">
                  <Image src={GALLERY[2].src} alt={GALLERY[2].title} fill className="object-cover" sizes="40vw" />
                  <div className="absolute inset-0 z-10 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-all duration-600">
                    <p className="text-[13px] text-white font-medium drop-shadow-lg">{GALLERY[2].title}</p>
                    <p className="text-[11px] text-gold-400/70 mt-1">{GALLERY[2].score}점 · {GALLERY[2].mood}</p>
                  </div>
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.15} className="col-span-12 sm:col-span-7">
              <div className="artwork-card-glow group cursor-pointer">
                <div className="aspect-[4/3] relative">
                  <Image src={GALLERY[3].src} alt={GALLERY[3].title} fill className="object-cover" sizes="60vw" />
                  <div className="absolute inset-0 z-10 flex flex-col justify-end p-5 opacity-0 group-hover:opacity-100 transition-all duration-600">
                    <p className="text-[14px] text-white font-medium drop-shadow-lg">{GALLERY[3].title}</p>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Row 3: two equal tall */}
            <Reveal delay={0.1} className="col-span-6">
              <div className="artwork-card-glow group cursor-pointer">
                <div className="aspect-[3/4] relative">
                  <Image src={GALLERY[4].src} alt={GALLERY[4].title} fill className="object-cover" sizes="50vw" />
                  <div className="absolute inset-0 z-10 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-all duration-600">
                    <p className="text-[13px] text-white font-medium drop-shadow-lg">{GALLERY[4].title}</p>
                  </div>
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.2} className="col-span-6">
              <div className="artwork-card-glow group cursor-pointer">
                <div className="aspect-[3/4] relative">
                  <Image src={GALLERY[5].src} alt={GALLERY[5].title} fill className="object-cover" sizes="50vw" />
                  <div className="absolute inset-0 z-10 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-all duration-600">
                    <p className="text-[13px] text-white font-medium drop-shadow-lg">{GALLERY[5].title}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.2} className="text-center mt-12">
            <Link
              href="/dream"
              className="group inline-flex items-center gap-2.5 text-[13px] text-text-muted/40 hover:text-primary-400/70 transition-all duration-500"
            >
              당신의 꿈도 그려보세요
              <svg className="w-3.5 h-3.5 transition-transform duration-500 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </Reveal>
        </div>
      </section>

      <SectionMist variant="mixed" />

      {/* ═══════════════════════════════════════════
          HOW IT WORKS — Immersive visual journey
      ═══════════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ padding: "clamp(6rem, 14vw, 12rem) 0" }}>
        {/* Full atmospheric backdrop */}
        <div className="absolute inset-0 pointer-events-none">
          <Image src="/images/section-clouds.png" alt="" fill className="object-cover opacity-[0.04] mix-blend-screen" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_40%_40%,rgba(109,60,239,0.05),transparent)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_40%_at_70%_70%,rgba(245,197,66,0.025),transparent)]" />
        </div>

        {/* Floating moon with parallax */}
        <motion.div
          style={{ y: floatY3 }}
          className="absolute right-[2%] top-[5%] w-[300px] h-[300px] pointer-events-none hidden lg:block"
        >
          <Image src="/images/hero-moon.png" alt="" fill className="object-contain opacity-[0.04]" />
          <div className="absolute inset-0 bg-glow-purple opacity-20 animate-breathe-deep" />
        </motion.div>

        {/* Floating gallery artwork — adds visual richness */}
        <motion.div
          style={{ y: floatY1 }}
          className="absolute left-[3%] bottom-[10%] w-[180px] h-[180px] pointer-events-none hidden lg:block"
        >
          <div className="relative opacity-25 rotate-[-6deg]">
            <div className="absolute -inset-3 bg-primary-500/[0.04] rounded-2xl blur-xl" />
            <div className="rounded-2xl overflow-hidden">
              <Image src="/images/gallery-3.png" alt="" width={180} height={180} className="object-cover" />
            </div>
          </div>
        </motion.div>

        {/* Ambient orbs */}
        <div className="absolute top-[30%] left-[8%] w-[250px] h-[250px] rounded-full bg-primary-500/[0.02] blur-[70px] animate-breathe pointer-events-none" />
        <div className="absolute bottom-[20%] right-[10%] w-[200px] h-[200px] rounded-full bg-gold-400/[0.015] blur-[50px] animate-breathe-deep pointer-events-none" />

        <div className="relative mx-auto max-w-4xl px-5 sm:px-8">
          <Reveal className="text-center mb-20">
            <p className="text-[11px] tracking-[0.3em] text-primary-400/30 uppercase mb-3">How It Works</p>
            <h2 className="font-[family-name:var(--font-display)] text-[clamp(1.8rem,5vw,3rem)] font-bold text-text-primary leading-tight">
              <span className="text-gradient-gold">3단계</span>로 끝
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {[
              { n: "01", title: "꿈을 적어주세요", desc: "어젯밤 꾼 꿈을 자유롭게 적어주세요. 기억나는 만큼만 괜찮아요.", accent: "primary", icon: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" },
              { n: "02", title: "AI가 분석합니다", desc: "해몽학과 심리학을 결합한 AI가 꿈의 의미를 해석하고, 아트워크를 그립니다.", accent: "gold", icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" },
              { n: "03", title: "운세와 행운 번호", desc: "재물운 · 연애운 · 건강운 · 직장운과 행운 번호 6개까지 한 번에.", accent: "primary", icon: "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" },
            ].map((item, i) => (
              <Reveal key={item.n} delay={i * 0.15}>
                <div className="group relative glass rounded-2xl p-8 text-center h-full transition-all duration-700 hover:-translate-y-2 hover:border-white/[0.06]">
                  {/* Hover glow */}
                  <div className={`absolute inset-0 rounded-2xl transition-opacity duration-700 opacity-0 group-hover:opacity-100 pointer-events-none ${
                    item.accent === "gold"
                      ? "bg-[radial-gradient(ellipse_at_center,rgba(245,197,66,0.02),transparent_70%)]"
                      : "bg-[radial-gradient(ellipse_at_center,rgba(109,60,239,0.03),transparent_70%)]"
                  }`} />

                  <div className="relative">
                    {/* Icon with glow */}
                    <div className="relative mx-auto mb-6 w-14 h-14">
                      <div className={`absolute inset-0 rounded-full blur-xl ${
                        item.accent === "gold" ? "bg-gold-400/[0.08]" : "bg-primary-500/[0.08]"
                      }`} />
                      <div className={`relative w-14 h-14 rounded-full border flex items-center justify-center ${
                        item.accent === "gold"
                          ? "border-gold-400/15 bg-gold-400/[0.03]"
                          : "border-primary-400/10 bg-primary-500/[0.03]"
                      }`}>
                        <svg className={`w-5 h-5 ${
                          item.accent === "gold" ? "text-gold-400/40" : "text-primary-400/35"
                        }`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                        </svg>
                      </div>
                    </div>

                    <span className={`text-[11px] font-bold tabular-nums tracking-wider ${
                      item.accent === "gold" ? "text-gold-400/30" : "text-primary-400/25"
                    }`}>{item.n}</span>

                    <h3 className="text-[16px] font-semibold text-text-primary/85 mt-2 mb-3">{item.title}</h3>
                    <p className="text-[13px] text-text-muted/30 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <SectionMist variant="gold" />

      {/* ═══════════════════════════════════════════
          REPORT PREVIEW — Full immersive phone-style mockup
      ═══════════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ padding: "clamp(6rem, 14vw, 12rem) 0" }}>
        {/* Deep atmospheric layers */}
        <div className="absolute inset-0 pointer-events-none">
          <Image src="/images/hero-mist.png" alt="" fill className="object-cover opacity-[0.04] mix-blend-screen" />
          <Image src="/images/section-clouds.png" alt="" fill className="object-cover opacity-[0.04] mix-blend-screen" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_40%_40%,rgba(109,60,239,0.06),transparent)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_70%_60%,rgba(245,197,66,0.03),transparent)]" />
        </div>

        {/* Ambient orbs */}
        <div className="absolute top-[10%] right-[5%] w-[300px] h-[300px] rounded-full bg-primary-500/[0.02] blur-[80px] animate-breathe-deep pointer-events-none" />
        <div className="absolute bottom-[15%] left-[5%] w-[250px] h-[250px] rounded-full bg-gold-400/[0.015] blur-[60px] animate-breathe pointer-events-none" />

        {/* Mystic ring */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none animate-mystic-ring" style={{ animationDuration: "100s" }}>
          <svg width="700" height="700" viewBox="0 0 700 700" className="opacity-[0.015]">
            <circle cx="350" cy="350" r="320" fill="none" stroke="rgba(245,197,66,0.4)" strokeWidth="0.5" strokeDasharray="5 18" />
          </svg>
        </div>

        <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
          <Reveal className="text-center mb-20">
            <p className="text-[11px] tracking-[0.3em] text-gold-400/35 uppercase mb-3">Report Preview</p>
            <h2 className="font-[family-name:var(--font-display)] text-[clamp(1.8rem,5vw,3rem)] font-bold text-text-primary leading-tight">
              이런 <span className="text-gradient-gold">리포트</span>를 받아보세요
            </h2>
            <p className="mt-4 text-[13px] text-text-muted/25 max-w-md mx-auto">꿈 하나로 해몽, 운세, 아트워크, 행운 번호까지</p>
          </Reveal>

          <Reveal>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-center">
              {/* Artwork with dramatic glow */}
              <div className="relative mx-auto lg:mx-0 max-w-[380px] w-full">
                {/* Multi-layer glow */}
                <div className="absolute -inset-8 bg-gradient-to-br from-primary-500/[0.05] via-transparent to-gold-400/[0.04] rounded-[2rem] blur-2xl" />
                <div className="absolute -inset-4 bg-primary-500/[0.02] rounded-3xl blur-xl animate-breathe-deep" />
                <div className="relative rounded-2xl overflow-hidden shadow-[0_0_80px_rgba(109,60,239,0.1)]">
                  <div className="aspect-[3/4] relative">
                    <Image src="/images/report-preview.png" alt="꿈 아트워크" fill className="object-cover" sizes="(max-width:1024px) 100vw, 50vw" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-surface-0/70 via-transparent to-transparent" />
                  <div className="absolute bottom-5 left-5 right-5 z-10">
                    <p className="text-[10px] text-white/30 tracking-[0.2em] uppercase">AI Generated Dream Artwork</p>
                    <p className="text-[14px] text-white/70 font-medium mt-1">투명한 바다 위, 하늘을 나는 고래</p>
                  </div>
                </div>
              </div>

              {/* Report cards — stacked with stagger */}
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.9, delay: 0.2 }}
                  className="glass rounded-2xl p-6"
                >
                  <h3 className="text-[10px] tracking-[0.2em] text-primary-400/40 uppercase mb-3 font-medium">해몽</h3>
                  <p className="text-[14px] text-text-primary/80 leading-[1.9]">
                    이 꿈은 <span className="text-primary-300/70">자유에 대한 깊은 갈망</span>을 반영합니다.
                    투명한 바다는 감정의 명료함을, 하늘의 고래는 무의식에서 올라오는
                    <span className="text-gold-400/60"> 거대한 직관력</span>을 상징합니다.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.9, delay: 0.35 }}
                  className="glass rounded-2xl p-6"
                >
                  <h3 className="text-[10px] tracking-[0.2em] text-primary-400/40 uppercase mb-4 font-medium">오늘의 운세</h3>
                  <div className="space-y-3">
                    <FortuneBar label="재물운" score={78} delay={0} />
                    <FortuneBar label="연애운" score={85} delay={0.1} />
                    <FortuneBar label="건강운" score={62} delay={0.2} />
                    <FortuneBar label="직장운" score={71} delay={0.3} />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.9, delay: 0.5 }}
                  className="glass rounded-2xl p-6"
                >
                  <h3 className="text-[10px] tracking-[0.2em] text-gold-400/40 uppercase mb-4 font-medium">행운 번호</h3>
                  <div className="flex gap-3 justify-center">
                    {[7, 14, 23, 31, 38, 42].map((n, i) => (
                      <motion.div
                        key={n}
                        initial={{ scale: 0, rotateY: 180 }}
                        whileInView={{ scale: 1, rotateY: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.6 + i * 0.1, type: "spring", stiffness: 180, damping: 15 }}
                        className="relative"
                      >
                        <div className="absolute -inset-1.5 bg-gold-400/[0.05] rounded-full blur-md" />
                        <div className="relative lucky-ball flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full text-surface-0 text-base sm:text-lg font-bold">
                          {n}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  <div className="mt-3 mx-auto w-40 h-4 bg-glow-gold opacity-10 blur-xl" />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: 0.7 }}
                  className="text-center pt-3"
                >
                  <Link
                    href="/dream"
                    className="group inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-gold-400 to-gold-500 px-9 py-3.5 text-[14px] font-semibold text-surface-0 transition-all duration-600 hover:shadow-[0_0_40px_rgba(245,197,66,0.2),0_0_80px_rgba(245,197,66,0.06)]"
                  >
                    내 꿈 리포트 받기
                    <svg className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </motion.div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <SectionMist variant="purple" />

      {/* ═══════════════════════════════════════════
          LUCKY NUMBERS — Full mystical atmospheric
      ═══════════════════════════════════════════ */}
      <section ref={luckyRef} className="relative overflow-hidden" style={{ padding: "clamp(7rem, 16vw, 14rem) 0" }}>
        {/* Fortune orb — large, pulsing, parallax */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <motion.div style={{ scale: orbScale, rotate: orbRotate }} className="relative w-[700px] h-[700px]">
            <Image src="/images/fortune-orb.png" alt="" fill className="object-contain opacity-[0.06]" />
            <div className="absolute inset-0 bg-glow-purple opacity-25 animate-breathe-deep" />
          </motion.div>
        </div>

        {/* Mystic rings around orb */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="animate-mystic-ring" style={{ animationDuration: "80s" }}>
            <svg width="500" height="500" viewBox="0 0 500 500" className="opacity-[0.03]">
              <circle cx="250" cy="250" r="220" fill="none" stroke="rgba(245,197,66,0.5)" strokeWidth="0.5" strokeDasharray="6 14" />
            </svg>
          </div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="animate-mystic-ring" style={{ animationDuration: "120s", animationDirection: "reverse" }}>
            <svg width="650" height="650" viewBox="0 0 650 650" className="opacity-[0.02]">
              <circle cx="325" cy="325" r="300" fill="none" stroke="rgba(167,139,255,0.5)" strokeWidth="0.5" strokeDasharray="4 20" />
            </svg>
          </div>
        </div>

        {/* Ambient mist layers */}
        <div className="absolute inset-0 pointer-events-none">
          <Image src="/images/hero-mist.png" alt="" fill className="object-cover opacity-[0.04] mix-blend-screen" />
        </div>

        {/* Glow pools */}
        <div className="absolute top-[30%] left-[15%] w-[200px] h-[200px] rounded-full bg-gold-400/[0.02] blur-[60px] animate-breathe pointer-events-none" />
        <div className="absolute bottom-[20%] right-[10%] w-[250px] h-[250px] rounded-full bg-primary-500/[0.02] blur-[70px] animate-breathe-deep pointer-events-none" />

        <div className="relative mx-auto max-w-2xl px-5 sm:px-8 text-center">
          <Reveal>
            <p className="text-[11px] tracking-[0.3em] text-gold-400/35 uppercase mb-4">Lucky Numbers</p>
            <h2 className="font-[family-name:var(--font-display)] text-[clamp(1.8rem,5vw,3.2rem)] font-bold text-text-primary leading-tight mb-7">
              꿈에서 추출한<br />
              <span className="text-gradient-gold">행운 번호 6개</span>
            </h2>
            <p className="text-[13px] text-text-muted/30 leading-[1.9] max-w-md mx-auto">
              &ldquo;돼지꿈 꿨으니까 로또 사야지&rdquo; — 매주 수백만 명에게 일어나는 일.
              꿈의 상징과 운세를 분석해 맞춤 행운 번호를 생성합니다.
              구독하면 <span className="text-gold-400/45">매주 금요일</span> 새 번호를 받아보세요.
            </p>
          </Reveal>

          <Reveal delay={0.2} className="mt-16">
            <div className="flex gap-4 sm:gap-6 justify-center">
              {[3, 17, 24, 33, 39, 44].map((n, i) => (
                <motion.div
                  key={n}
                  initial={{ scale: 0, rotateY: 180 }}
                  whileInView={{ scale: 1, rotateY: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.12, type: "spring", stiffness: 140, damping: 13 }}
                  className="relative"
                >
                  {/* Individual ball glow */}
                  <div className="absolute -inset-2 bg-gold-400/[0.06] rounded-full blur-lg" />
                  <div className="relative lucky-ball flex h-14 w-14 sm:h-[76px] sm:w-[76px] items-center justify-center rounded-full text-surface-0 text-xl sm:text-2xl font-bold">
                    {n}
                  </div>
                </motion.div>
              ))}
            </div>
            {/* Reflection glow */}
            <div className="mt-6 mx-auto w-56 h-10 bg-glow-gold opacity-15 blur-2xl" />
          </Reveal>

          <Reveal delay={0.4} className="mt-10">
            <p className="text-[12px] text-text-muted/20">
              매주 <span className="text-gold-400/30">금요일 오전 6시</span> 새 번호가 도착합니다
            </p>
          </Reveal>
        </div>
      </section>

      <SectionMist variant="mixed" />

      {/* ═══════════════════════════════════════════
          PRICING — Mystical atmospheric pricing
      ═══════════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ padding: "clamp(5rem, 12vw, 10rem) 0" }} id="pricing">
        {/* Deep atmospheric layers */}
        <div className="absolute inset-0 pointer-events-none">
          <Image src="/images/section-clouds.png" alt="" fill className="object-cover opacity-[0.04] mix-blend-screen" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_30%,rgba(109,60,239,0.04),transparent)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_50%_at_80%_70%,rgba(167,139,255,0.025),transparent)]" />
        </div>

        {/* Floating orb accents */}
        <div className="absolute top-[15%] left-[8%] w-[200px] h-[200px] rounded-full bg-primary-500/[0.015] blur-[60px] animate-breathe pointer-events-none" />
        <div className="absolute bottom-[10%] right-[12%] w-[220px] h-[220px] rounded-full bg-gold-400/[0.015] blur-[50px] animate-float-slow pointer-events-none" />

        <div className="relative mx-auto max-w-5xl px-5 sm:px-8">
          <Reveal className="text-center mb-16">
            <p className="text-[11px] tracking-[0.3em] text-primary-400/35 uppercase mb-3">Pricing</p>
            <h2 className="font-[family-name:var(--font-display)] text-[clamp(1.6rem,4vw,2.8rem)] font-bold text-text-primary">
              커피 한 잔 가격에<br />
              <span className="text-gradient">운명의 문을 여세요</span>
            </h2>
            <p className="mt-4 text-[13px] text-text-muted/30">타로 카페 2~3만원 vs 꿈그림 4,900원</p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                name: "무료", price: "0", unit: "원", desc: "체험",
                features: ["AI 아트워크 (워터마크)", "한 줄 해몽", "재물운만", "행운 번호 2개", "주 2회"],
                cta: "무료로 시작", href: "/dream", highlight: false,
              },
              {
                name: "운세 리포트", price: "4,900", unit: "원", desc: "1회",
                features: ["고화질 아트워크", "상세 해몽 + 심리", "운세 4개 영역", "행운 번호 6개", "행운의 색·방향·시간", "오늘의 조언"],
                cta: "리포트 받기", href: "/dream", highlight: true,
              },
              {
                name: "꿈 구독", price: "9,900", unit: "원/월", desc: "무제한",
                features: ["모든 리포트 포함", "꿈 일기 무제한", "주간/월간 분석", "매주 행운 번호", "AI 상담 월 2회", "5가지 스타일"],
                cta: "구독 시작", href: "/pricing", highlight: false,
              },
            ].map((plan, i) => (
              <Reveal key={plan.name} delay={i * 0.1}>
                <div className={`group relative rounded-2xl p-7 h-full flex flex-col transition-all duration-700 hover:-translate-y-1.5 ${
                  plan.highlight
                    ? "glass-strong border-primary-500/20 shadow-[0_0_60px_rgba(109,60,239,0.05)]"
                    : "glass hover:border-white/[0.06]"
                }`}>
                  {/* Hover glow */}
                  <div className={`absolute inset-0 rounded-2xl transition-opacity duration-700 opacity-0 group-hover:opacity-100 pointer-events-none ${
                    plan.highlight
                      ? "bg-[radial-gradient(ellipse_at_center,rgba(109,60,239,0.04),transparent_70%)]"
                      : "bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.01),transparent_70%)]"
                  }`} />

                  {plan.highlight && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 px-4 py-1 text-[10px] font-semibold text-white tracking-[0.1em] shadow-[0_4px_20px_rgba(109,60,239,0.25)]">
                      추천
                    </div>
                  )}

                  <div className="relative">
                    <div className="text-[12px] text-text-muted/35 mb-2 tracking-wider">{plan.name}</div>
                    <div className="flex items-baseline gap-1.5 mb-1">
                      <span className={`text-[2.2rem] font-bold tracking-tight leading-none ${
                        plan.highlight ? "text-gradient" : "text-text-primary"
                      }`}>{plan.price}</span>
                      <span className="text-[12px] text-text-muted/25">{plan.unit}</span>
                    </div>
                    <p className="text-[11px] text-text-muted/20 mb-7">{plan.desc}</p>

                    <div className="h-[1px] bg-gradient-to-r from-transparent via-white/[0.03] to-transparent mb-6" />

                    <ul className="space-y-3 mb-8 flex-1">
                      {plan.features.map((f) => (
                        <li key={f} className="flex items-start gap-2.5 text-[13px] text-text-secondary/55">
                          <svg className={`w-3.5 h-3.5 mt-[2px] shrink-0 ${
                            plan.highlight ? "text-primary-400/45" : "text-white/12"
                          }`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                          {f}
                        </li>
                      ))}
                    </ul>

                    <Link
                      href={plan.href}
                      className={`block w-full text-center rounded-full py-3 text-[13px] font-semibold transition-all duration-500 ${
                        plan.highlight
                          ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:shadow-[0_0_30px_rgba(109,60,239,0.15)] hover:from-primary-400 hover:to-primary-500"
                          : "bg-white/[0.03] text-text-primary/60 border border-white/[0.04] hover:bg-white/[0.06] hover:border-white/[0.08]"
                      }`}
                    >
                      {plan.cta}
                    </Link>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.3} className="text-center mt-8">
            <Link href="/pricing" className="inline-flex items-center gap-2 text-[12px] text-text-muted/20 hover:text-primary-400/40 transition-colors duration-500">
              부적 카드 · 태몽 패키지 더 보기
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          FINAL CTA — Full immersive dreamlike
      ═══════════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ padding: "clamp(8rem, 18vw, 16rem) 0" }}>
        {/* Multi-layer atmospheric bg */}
        <div className="absolute inset-0 pointer-events-none">
          <Image src="/images/hero-mist.png" alt="" fill className="object-cover opacity-[0.04] mix-blend-screen" />
          <Image src="/images/section-clouds.png" alt="" fill className="object-cover opacity-[0.03] mix-blend-screen" />
        </div>

        {/* Moon — larger, ethereal, parallax */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <motion.div
            style={{ y: floatY3 }}
            className="relative w-[550px] h-[550px]"
          >
            <Image src="/images/hero-moon.png" alt="" fill className="object-contain opacity-[0.04]" />
            <div className="absolute inset-0 bg-glow-purple opacity-15 animate-breathe-deep" />
          </motion.div>
        </div>

        {/* Radial glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_50%_at_50%_50%,rgba(109,60,239,0.05),transparent)] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_30%_30%_at_50%_50%,rgba(245,197,66,0.02),transparent)] pointer-events-none" />

        {/* Rotating mystic ring */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="animate-mystic-ring" style={{ animationDuration: "90s" }}>
            <svg width="400" height="400" viewBox="0 0 400 400" className="opacity-[0.02]">
              <circle cx="200" cy="200" r="180" fill="none" stroke="rgba(167,139,255,0.5)" strokeWidth="0.5" strokeDasharray="3 12" />
            </svg>
          </div>
        </div>

        <div className="relative mx-auto max-w-3xl px-5 sm:px-8 text-center">
          <Reveal>
            <motion.div
              initial={{ scale: 0.93 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="text-[11px] tracking-[0.35em] text-primary-400/25 uppercase mb-6">Begin Your Journey</p>
              <h2 className="font-[family-name:var(--font-display)] text-[clamp(1.6rem,5vw,3.4rem)] font-bold text-text-primary leading-[1.12]">
                오늘 밤 꿈을 꾸면
                <br />
                <span className="text-gradient">내일 아침, 운명이 바뀝니다</span>
              </h2>
              <p className="mt-7 text-[14px] text-text-muted/30 leading-relaxed max-w-md mx-auto">
                회원가입 없이, 무료로, 지금 바로
              </p>

              <div className="mt-14 flex flex-col items-center gap-7">
                <Link
                  href="/dream"
                  className="group relative inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-primary-500/15 to-primary-600/15 hover:from-primary-500/25 hover:to-primary-600/25 backdrop-blur-md border border-primary-400/[0.08] hover:border-primary-400/[0.18] px-12 py-5 text-[16px] font-medium text-white transition-all duration-700 hover:shadow-[0_0_60px_rgba(109,60,239,0.12),0_0_120px_rgba(109,60,239,0.04)]"
                >
                  {/* Animated glow ring */}
                  <div className="absolute -inset-[1px] rounded-full bg-gradient-to-r from-primary-400/10 via-gold-400/5 to-primary-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-sm" />
                  <div className="absolute inset-0 rounded-full bg-primary-500/[0.03] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  <span className="relative">무료로 꿈 해몽 받기</span>
                  <svg className="relative w-4 h-4 transition-transform duration-500 group-hover:translate-x-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>

                {/* Trust signal */}
                <p className="text-[11px] text-text-muted/15 tracking-wide">
                  지금까지 <span className="text-primary-400/25">12,847</span>개의 꿈이 해석되었습니다
                </p>
              </div>
            </motion.div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </div>
  );
}
