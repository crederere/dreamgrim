"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import StarField from "@/components/dream/StarField";
import FortuneBar from "@/components/dream/FortuneBar";

const LOADING_MESSAGES = [
  "꿈의 세계로 들어가고 있어요",
  "상징과 은유를 해독하는 중",
  "별자리에서 운세를 읽고 있어요",
  "당신만의 행운 번호를 추출하는 중",
  "몽환적 아트워크를 그리고 있어요",
];

interface DreamResult {
  dream_id: string;
  artwork_url: string;
  interpretation: string;
  keywords: string[];
  detailed_report: {
    fortune: { wealth: number; love: number; health: number; career: number };
    lucky_numbers: number[];
    lucky_color: string;
    lucky_direction: string;
    lucky_time: string;
    do_today: string;
    avoid_today: string;
    psychological_insight: string;
  };
  is_paid: boolean;
  share_token: string;
  dream_text: string;
  artwork_style: string;
}

export default function DreamResultPage() {
  const [result, setResult] = useState<DreamResult | null>(null);
  const [isRevealing, setIsRevealing] = useState(true);
  const [loadingIdx, setLoadingIdx] = useState(0);
  const [revealPhase, setRevealPhase] = useState(0); // 0=loading, 1=artwork reveal, 2=full
  const [copied, setCopied] = useState(false);

  // Load result from sessionStorage
  useEffect(() => {
    const stored = sessionStorage.getItem("dreamResult");
    if (stored) {
      setResult(JSON.parse(stored));
    }
  }, []);

  // Loading message cycle
  useEffect(() => {
    if (!isRevealing) return;
    const interval = setInterval(() => {
      setLoadingIdx((prev) => {
        if (prev >= LOADING_MESSAGES.length - 1) return prev;
        return prev + 1;
      });
    }, 1800);
    return () => clearInterval(interval);
  }, [isRevealing]);

  // Reveal sequence
  useEffect(() => {
    if (!result) return;
    // After loading messages, reveal artwork
    const t1 = setTimeout(() => setRevealPhase(1), 2000);
    const t2 = setTimeout(() => {
      setRevealPhase(2);
      setIsRevealing(false);
    }, 3500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [result]);

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(`https://dreamgrim.com/shared/${result.share_token}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isPaid = result?.is_paid ?? false;

  /* ─── No data ─── */
  if (!result) {
    return (
      <div className="min-h-screen bg-surface-0 flex items-center justify-center">
        <StarField />
        <div className="relative z-10 text-center px-6">
          <div className="w-3 h-3 rounded-full bg-primary-400/40 animate-breathe mx-auto mb-6" />
          <p className="text-[14px] text-text-muted/50">꿈 결과를 불러오는 중...</p>
          <Link href="/dream" className="mt-4 inline-block text-[13px] text-primary-400/50 hover:text-primary-400/80 transition-colors">
            새 꿈 해몽하기
          </Link>
        </div>
      </div>
    );
  }

  /* ─── Loading / Reveal animation ─── */
  if (isRevealing) {
    return (
      <div className="min-h-screen bg-surface-0 overflow-hidden">
        <StarField />

        {/* Atmospheric layers */}
        <div className="fixed inset-0 pointer-events-none">
          <Image src="/images/hero-mist.png" alt="" fill className="object-cover opacity-15 mix-blend-screen" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(4,2,12,0.9)_80%)]" />
        </div>

        <div className="relative z-10 min-h-screen flex items-center justify-center">
          <AnimatePresence mode="wait">
            {revealPhase === 0 && (
              <motion.div
                key="loading"
                exit={{ opacity: 0, scale: 0.9 }}
                className="text-center px-6 max-w-sm"
              >
                {/* Mystical orb */}
                <div className="relative mx-auto mb-14 h-32 w-32">
                  <motion.div
                    animate={{ scale: [1, 1.4, 1], opacity: [0.1, 0.3, 0.1] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="absolute inset-0 rounded-full bg-primary-500/10 blur-3xl"
                  />
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-4 rounded-full border border-dashed border-primary-500/10"
                  />
                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-8 rounded-full border border-dashed border-gold-400/8"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.3, 0.8, 0.3] }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="w-4 h-4 rounded-full bg-primary-400/40"
                    />
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  <motion.p
                    key={loadingIdx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-[14px] text-text-primary/50"
                  >
                    {LOADING_MESSAGES[loadingIdx]}
                  </motion.p>
                </AnimatePresence>

                <div className="mt-8 w-48 mx-auto h-[1px] bg-surface-300/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 8, ease: "linear" }}
                    className="h-full bg-gradient-to-r from-primary-500/30 to-gold-400/20"
                  />
                </div>
              </motion.div>
            )}

            {revealPhase === 1 && result.artwork_url && (
              <motion.div
                key="artwork-reveal"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                className="relative"
              >
                <div className="w-[70vmin] max-w-[400px] aspect-square rounded-3xl overflow-hidden shadow-[0_0_100px_rgba(109,60,239,0.15)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={result.artwork_url}
                    alt="꿈 아트워크"
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Glow ring */}
                <div className="absolute -inset-4 rounded-[2rem] border border-primary-500/10 animate-breathe pointer-events-none" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  }

  /* ─── Full Result ─── */
  return (
    <div className="relative min-h-screen bg-surface-0">
      <StarField />

      {/* Atmospheric bg */}
      <div className="fixed inset-0 pointer-events-none">
        <Image src="/images/hero-mist.png" alt="" fill className="object-cover opacity-8 mix-blend-screen" />
      </div>

      <Header />

      <main className="relative z-10 pt-24 pb-16">
        <div className="mx-auto max-w-xl px-5 sm:px-8">
          {/* Back */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8">
            <Link href="/dream" className="inline-flex items-center gap-1.5 text-[12px] text-text-muted/30 hover:text-text-muted/50 transition-colors">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              새 꿈 해몽
            </Link>
          </motion.div>

          {/* ─── Artwork ─── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative rounded-2xl overflow-hidden shadow-[0_0_60px_rgba(109,60,239,0.1)]"
          >
            <div className="aspect-square relative bg-surface-100">
              {result.artwork_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={result.artwork_url} alt="꿈 아트워크" className="w-full h-full object-cover" />
              ) : (
                <Image src="/images/gallery-1.png" alt="꿈 아트워크" fill className="object-cover" />
              )}
              {!isPaid && (
                <div className="absolute inset-0 z-10 flex items-end justify-center pb-4">
                  <span className="text-[9px] text-white/20 tracking-[0.3em] uppercase">dreamgrim.com</span>
                </div>
              )}
            </div>
          </motion.div>

          {/* Dream text + keywords */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-8"
          >
            <p className="text-[13px] text-text-muted/40 italic leading-relaxed">
              &ldquo;{result.dream_text.slice(0, 200)}{result.dream_text.length > 200 ? "..." : ""}&rdquo;
            </p>
            <div className="flex flex-wrap gap-1.5 mt-3">
              {result.keywords.map((kw) => (
                <span key={kw} className="text-[10px] px-2 py-0.5 rounded-full bg-primary-500/6 text-primary-300/40 border border-primary-500/6">
                  {kw}
                </span>
              ))}
            </div>
          </motion.div>

          <div className="divider-glow my-8" />

          {/* ─── Interpretation ─── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass rounded-2xl p-6 border-white/[0.03]"
          >
            <h3 className="text-[10px] tracking-[0.2em] text-primary-400/40 uppercase mb-3 font-medium">해몽</h3>
            <p className="text-[15px] text-text-primary/80 leading-[1.9]">
              {result.interpretation}
            </p>
          </motion.div>

          {/* ─── Fortune ─── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-4 glass rounded-2xl p-6 border-white/[0.03]"
          >
            <h3 className="text-[10px] tracking-[0.2em] text-primary-400/40 uppercase mb-5 font-medium">오늘의 운세</h3>
            <div className="space-y-3.5">
              <FortuneBar label="재물운" score={result.detailed_report.fortune.wealth} delay={0.4} />
              <FortuneBar label="연애운" score={result.detailed_report.fortune.love} locked={!isPaid} delay={0.5} />
              <FortuneBar label="건강운" score={result.detailed_report.fortune.health} locked={!isPaid} delay={0.6} />
              <FortuneBar label="직장운" score={result.detailed_report.fortune.career} locked={!isPaid} delay={0.7} />
            </div>
          </motion.div>

          {/* ─── Lucky Numbers ─── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-4 glass rounded-2xl p-6 border-white/[0.03]"
          >
            <h3 className="text-[10px] tracking-[0.2em] text-gold-400/40 uppercase mb-5 font-medium">행운 번호</h3>
            <div className="flex gap-2.5 justify-center">
              {result.detailed_report.lucky_numbers.map((n, i) => {
                const isVisible = isPaid || i < 2;
                return (
                  <motion.div
                    key={i}
                    initial={{ scale: 0, rotateY: 180 }}
                    animate={{ scale: 1, rotateY: 0 }}
                    transition={{ delay: 0.8 + i * 0.1, type: "spring", stiffness: 180, damping: 15 }}
                    className={`flex h-11 w-11 items-center justify-center rounded-full text-base font-bold ${
                      isVisible ? "lucky-ball text-surface-0" : "lucky-ball-locked text-text-muted/20"
                    }`}
                  >
                    {isVisible ? n : (
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* ─── Psychological (locked) ─── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-4 glass rounded-2xl p-6 relative overflow-hidden border-white/[0.03]"
          >
            <h3 className="text-[10px] tracking-[0.2em] text-primary-400/40 uppercase mb-3 font-medium">심리 분석</h3>
            {isPaid ? (
              <p className="text-[15px] text-text-primary/80 leading-[1.9]">{result.detailed_report.psychological_insight}</p>
            ) : (
              <div className="relative">
                <p className="text-[15px] text-text-primary/80 leading-[1.9] content-locked">{result.detailed_report.psychological_insight}</p>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex items-center gap-2 text-[12px] text-text-muted/30">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    리포트에서 확인
                  </div>
                </div>
              </div>
            )}
          </motion.div>

          {/* ═══ PURCHASE CTA ═══ */}
          {!isPaid && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="mt-10 rounded-2xl overflow-hidden relative"
            >
              {/* BG glow */}
              <div className="absolute inset-0 bg-gradient-to-b from-primary-600/10 via-surface-100/50 to-surface-0 pointer-events-none" />
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200px] h-[1px] bg-gradient-to-r from-transparent via-primary-500/20 to-transparent" />

              <div className="relative p-8 text-center">
                <h3 className="text-[17px] font-semibold text-text-primary/90 mb-2">
                  전체 운세 리포트 열기
                </h3>
                <p className="text-[12px] text-text-muted/40 mb-6 max-w-xs mx-auto leading-relaxed">
                  운세 전체 · 행운 번호 6개 · 심리 분석 · 행운의 색 · 방향 · 시간 · 오늘의 조언
                </p>

                <div className="flex items-baseline justify-center gap-1 mb-6">
                  <span className="text-3xl font-bold text-text-primary tracking-tight">4,900</span>
                  <span className="text-[12px] text-text-muted/40">원</span>
                </div>

                <button className="w-full max-w-xs mx-auto flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary-600/90 to-primary-500/90 py-3.5 text-[14px] font-medium text-white transition-all duration-500 hover:shadow-[0_0_40px_rgba(109,60,239,0.15)] animate-gradient-shift">
                  카카오페이로 결제하기
                </button>

                <p className="mt-3 text-[10px] text-text-muted/20">카카오페이 · 토스페이먼츠</p>
              </div>
            </motion.div>
          )}

          {/* ─── Share ─── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-8 text-center"
          >
            <p className="text-[12px] text-text-muted/30 mb-4">
              공유하면 <span className="text-primary-400/50">무료 1회</span> 추가
            </p>
            <div className="flex justify-center gap-3">
              {[
                { label: "인스타그램", color: "from-pink-500/60 to-purple-600/60" },
                { label: "카카오톡", color: "from-yellow-400/60 to-amber-400/60" },
                { label: copied ? "복사됨" : "링크 복사", color: "from-white/[0.04] to-white/[0.06]", onClick: handleCopy },
              ].map((item) => (
                <button key={item.label} onClick={item.onClick} className="flex flex-col items-center gap-1.5 group">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${item.color} text-white/70 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg`}>
                    <span className="text-[11px] font-medium">
                      {item.label === "인스타그램" ? "IG" : item.label === "카카오톡" ? "KT" : "LK"}
                    </span>
                  </div>
                  <span className="text-[10px] text-text-muted/25">{item.label}</span>
                </button>
              ))}
            </div>
          </motion.div>

          {/* ─── AI Consult ─── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="mt-8 glass rounded-2xl p-6 text-center border-white/[0.03]"
          >
            <h4 className="text-[14px] font-medium text-text-primary/70 mb-1">이 꿈이 더 궁금하다면</h4>
            <p className="text-[12px] text-text-muted/30 mb-4">AI 꿈 상담사와 깊이 대화해보세요</p>
            <button className="inline-flex items-center gap-2 rounded-full bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.04] px-5 py-2.5 text-[13px] text-text-primary/60 transition-all duration-300">
              AI 상담 시작하기
              <span className="text-text-muted/25">2,900원</span>
            </button>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
