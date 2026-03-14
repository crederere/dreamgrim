"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/layout/Header";
import StarField from "@/components/dream/StarField";
import {
  ARTWORK_STYLES,
  POPULAR_KEYWORDS,
  MAX_DREAM_TEXT_LENGTH,
  MIN_DREAM_TEXT_LENGTH,
} from "@/lib/utils/constants";
import type { ArtworkStyle } from "@/lib/utils/constants";

const STYLE_PREVIEWS: Record<string, { gradient: string; desc: string }> = {
  watercolor: { gradient: "from-sky-200/80 via-purple-200/80 to-pink-200/80", desc: "부드럽고 몽환적인" },
  oil_painting: { gradient: "from-amber-700/80 via-red-800/80 to-purple-900/80", desc: "깊이감 있는 클래식" },
  digital_art: { gradient: "from-cyan-500/80 via-blue-600/80 to-purple-600/80", desc: "선명하고 화려한" },
  ghibli: { gradient: "from-green-300/80 via-emerald-200/80 to-sky-200/80", desc: "따뜻하고 포근한" },
  monochrome: { gradient: "from-zinc-800/80 via-zinc-600/80 to-zinc-400/80", desc: "신비로운 흑백" },
};

export default function DreamInputPage() {
  const router = useRouter();
  const [dreamText, setDreamText] = useState("");
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [artworkStyle, setArtworkStyle] = useState<ArtworkStyle>("watercolor");
  const [isTaeMong, setIsTaeMong] = useState(false);
  const [taeName, setTaeName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState<"input" | "style">("input");
  const [error, setError] = useState("");

  // Optional user context
  const [showContext, setShowContext] = useState(false);
  const [gender, setGender] = useState<"" | "male" | "female" | "other">("");
  const [birthDate, setBirthDate] = useState("");
  const [concern, setConcern] = useState("");

  const charCount = dreamText.length;
  const isValid = charCount >= MIN_DREAM_TEXT_LENGTH;

  const toggleKeyword = useCallback((kw: string) => {
    setSelectedKeywords((prev) =>
      prev.includes(kw) ? prev.filter((k) => k !== kw) : [...prev, kw]
    );
  }, []);

  const handleSubmit = async () => {
    if (!isValid || isSubmitting) return;
    setIsSubmitting(true);
    setError("");

    const fullText = selectedKeywords.length > 0
      ? `${dreamText}\n(키워드: ${selectedKeywords.join(", ")})`
      : dreamText;

    try {
      const res = await fetch("/api/dream/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dream_text: fullText,
          artwork_style: artworkStyle,
          is_tae_mong: isTaeMong,
          tae_name: taeName || undefined,
          gender: gender || undefined,
          birth_date: birthDate || undefined,
          concern: concern || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "분석 중 오류가 발생했습니다");
      }

      sessionStorage.setItem("dreamResult", JSON.stringify({
        ...data,
        dream_text: fullText,
        artwork_style: artworkStyle,
      }));
      router.push("/dream/result");
    } catch (err) {
      setError(err instanceof Error ? err.message : "오류가 발생했습니다. 다시 시도해주세요.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-surface-0">
      <StarField />

      {/* Atmospheric background layers */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0">
          <Image src="/images/hero-mist.png" alt="" fill className="object-cover opacity-20 mix-blend-screen" />
        </div>
        <div className="absolute top-[10%] left-[10%] w-[500px] h-[500px] rounded-full bg-primary-600/5 animate-glow-pulse" />
        <div className="absolute bottom-[20%] right-[10%] w-[400px] h-[400px] rounded-full bg-gold-400/3 animate-glow-pulse [animation-delay:4s]" />
      </div>

      <Header />

      <main className="relative z-10 pt-24 pb-20 px-5 sm:px-8">
        <div className="mx-auto max-w-xl">
          {/* Back */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-10">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-[12px] text-text-muted/40 hover:text-text-muted/70 transition-colors duration-300"
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              홈으로
            </Link>
          </motion.div>

          <AnimatePresence mode="wait">
            {/* ─── Step 1: Input ─── */}
            {step === "input" && (
              <motion.div
                key="input"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.5 }}
              >
                {/* Moon icon + Title */}
                <div className="mb-10">
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", delay: 0.1, stiffness: 200 }}
                    className="relative w-16 h-16 mb-6"
                  >
                    <Image src="/images/hero-moon.png" alt="" fill className="object-contain opacity-60" />
                    <div className="absolute inset-0 bg-glow-purple opacity-40 blur-xl" />
                  </motion.div>

                  <h1 className="font-[family-name:var(--font-display)] text-[clamp(1.8rem,5vw,2.6rem)] font-bold text-text-primary leading-[1.15]">
                    어젯밤<br />
                    <span className="text-gradient">무슨 꿈</span>을 꾸셨나요
                  </h1>
                  <p className="mt-3 text-[14px] text-text-muted/50 leading-relaxed">
                    자세히 적을수록 더 정확한 해몽과 운세를 받을 수 있어요
                  </p>
                </div>

                {/* Textarea */}
                <div className="relative group">
                  <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-primary-500/5 via-transparent to-gold-400/5 opacity-0 group-focus-within:opacity-100 transition-opacity duration-700 blur-xl" />
                  <textarea
                    value={dreamText}
                    onChange={(e) => setDreamText(e.target.value.slice(0, MAX_DREAM_TEXT_LENGTH))}
                    placeholder="투명한 바다 위를 걸어가는데 하늘에서 고래가 내려왔어요. 고래 등 위에 타고 구름 사이를 날아다녔어요..."
                    rows={7}
                    className="relative w-full rounded-2xl bg-surface-100/40 backdrop-blur-sm border border-white/[0.04] focus:border-primary-500/15 focus:bg-surface-100/60 p-5 text-[15px] text-text-primary placeholder:text-text-muted/25 resize-none transition-all duration-500 outline-none leading-[1.8]"
                  />
                  <div className="absolute bottom-3.5 right-4 text-[11px] text-text-muted/30 tabular-nums">
                    <span className={charCount >= MIN_DREAM_TEXT_LENGTH ? "text-primary-400/50" : ""}>
                      {charCount}
                    </span>
                    <span className="text-text-muted/15">/{MAX_DREAM_TEXT_LENGTH}</span>
                  </div>
                </div>

                {/* Keywords */}
                <div className="mt-8">
                  <p className="text-[11px] text-text-muted/30 tracking-[0.15em] uppercase mb-3">꿈 키워드</p>
                  <div className="flex flex-wrap gap-2">
                    {POPULAR_KEYWORDS.map((kw) => {
                      const isActive = selectedKeywords.includes(kw);
                      return (
                        <button
                          key={kw}
                          onClick={() => toggleKeyword(kw)}
                          className={`rounded-full px-3 py-1.5 text-[12px] transition-all duration-400 ${
                            isActive
                              ? "bg-primary-500/12 text-primary-300/80 border border-primary-500/15 shadow-[0_0_15px_rgba(109,60,239,0.08)]"
                              : "bg-white/[0.02] text-text-muted/35 border border-white/[0.03] hover:border-white/[0.06] hover:text-text-muted/50"
                          }`}
                        >
                          {kw}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Optional context — collapsible, non-intrusive */}
                <div className="mt-8">
                  <button
                    onClick={() => setShowContext(!showContext)}
                    className="flex items-center gap-2 text-[12px] text-text-muted/30 hover:text-text-muted/50 transition-colors duration-300"
                  >
                    <svg
                      className={`w-3 h-3 transition-transform duration-300 ${showContext ? "rotate-90" : ""}`}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                    더 정확한 해몽을 원하시면 <span className="text-primary-400/40">(선택)</span>
                  </button>

                  <AnimatePresence>
                    {showContext && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-4 space-y-3">
                          {/* Gender */}
                          <div className="flex gap-2">
                            {[
                              { value: "female", label: "여성" },
                              { value: "male", label: "남성" },
                              { value: "other", label: "기타" },
                            ].map((g) => (
                              <button
                                key={g.value}
                                onClick={() => setGender(gender === g.value ? "" : g.value as typeof gender)}
                                className={`rounded-full px-4 py-1.5 text-[12px] transition-all duration-300 ${
                                  gender === g.value
                                    ? "bg-primary-500/10 text-primary-300/70 border border-primary-500/12"
                                    : "bg-white/[0.02] text-text-muted/30 border border-white/[0.03] hover:border-white/[0.06]"
                                }`}
                              >
                                {g.label}
                              </button>
                            ))}
                          </div>

                          {/* Birth date */}
                          <input
                            type="date"
                            value={birthDate}
                            onChange={(e) => setBirthDate(e.target.value)}
                            placeholder="생년월일"
                            className="w-full rounded-xl bg-white/[0.02] border border-white/[0.04] focus:border-primary-500/12 p-3 text-[13px] text-text-primary placeholder:text-text-muted/25 outline-none transition-colors duration-300 [color-scheme:dark]"
                          />

                          {/* Concern */}
                          <input
                            type="text"
                            value={concern}
                            onChange={(e) => setConcern(e.target.value.slice(0, 200))}
                            placeholder="요즘 고민이나 관심사 (예: 이직 고민, 연애 시작)"
                            className="w-full rounded-xl bg-white/[0.02] border border-white/[0.04] focus:border-primary-500/12 p-3 text-[13px] text-text-primary placeholder:text-text-muted/25 outline-none transition-colors duration-300"
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Taemong */}
                <div className="mt-6">
                  <div className="glass rounded-xl p-4 border-white/[0.03]">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <div
                        className={`relative h-5 w-10 rounded-full transition-all duration-400 ${
                          isTaeMong ? "bg-primary-500/80 shadow-[0_0_12px_rgba(109,60,239,0.2)]" : "bg-white/[0.05]"
                        }`}
                        onClick={() => setIsTaeMong(!isTaeMong)}
                      >
                        <div
                          className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-300 ${
                            isTaeMong ? "translate-x-5" : "translate-x-0.5"
                          }`}
                        />
                      </div>
                      <span className="text-[13px] text-text-primary/70">이 꿈은 태몽이에요</span>
                    </label>

                    <AnimatePresence>
                      {isTaeMong && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          className="overflow-hidden"
                        >
                          <input
                            type="text"
                            value={taeName}
                            onChange={(e) => setTaeName(e.target.value)}
                            placeholder="태명 또는 아이 이름 (선택)"
                            className="mt-3 w-full rounded-xl bg-white/[0.02] border border-white/[0.04] focus:border-primary-500/15 p-3 text-[13px] text-text-primary placeholder:text-text-muted/25 outline-none transition-colors duration-300"
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Next */}
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setStep("style")}
                  disabled={!isValid}
                  className={`mt-10 w-full flex items-center justify-center gap-2 rounded-full py-3.5 text-[15px] font-medium transition-all duration-500 ${
                    isValid
                      ? "bg-white/[0.06] hover:bg-white/[0.1] backdrop-blur-md border border-white/[0.06] hover:border-white/[0.1] text-white hover:shadow-[0_0_40px_rgba(167,139,255,0.08)]"
                      : "bg-white/[0.02] text-text-muted/20 cursor-not-allowed border border-transparent"
                  }`}
                >
                  다음
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </motion.button>

                <p className="mt-4 text-center text-[11px] text-text-muted/25">
                  남은 무료 횟수 <span className="text-primary-400/40">2/2</span>
                </p>
              </motion.div>
            )}

            {/* ─── Step 2: Style ─── */}
            {step === "style" && (
              <motion.div
                key="style"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.5 }}
              >
                <button
                  onClick={() => setStep("input")}
                  className="inline-flex items-center gap-1.5 text-[12px] text-text-muted/40 hover:text-text-muted/60 transition-colors duration-300 mb-10"
                >
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                  뒤로
                </button>

                <div className="mb-10">
                  <h2 className="font-[family-name:var(--font-display)] text-[clamp(1.8rem,5vw,2.6rem)] font-bold text-text-primary leading-[1.15]">
                    어떤 <span className="text-gradient">화풍</span>으로<br />그려드릴까요
                  </h2>
                </div>

                <div className="space-y-2.5">
                  {ARTWORK_STYLES.map((style, i) => {
                    const preview = STYLE_PREVIEWS[style.id];
                    const isActive = artworkStyle === style.id;
                    return (
                      <motion.button
                        key={style.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        onClick={() => setArtworkStyle(style.id)}
                        className={`group relative flex items-center gap-4 rounded-xl w-full p-3 text-left transition-all duration-400 ${
                          isActive
                            ? "bg-primary-500/8 border border-primary-500/15 shadow-[0_0_20px_rgba(109,60,239,0.06)]"
                            : "bg-white/[0.015] border border-white/[0.03] hover:border-white/[0.06] hover:bg-white/[0.025]"
                        }`}
                      >
                        <div className={`h-14 w-14 rounded-lg bg-gradient-to-br ${preview.gradient} shrink-0 relative overflow-hidden`}>
                          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(255,255,255,0.15),transparent_60%)]" />
                        </div>
                        <div className="flex-1">
                          <span className="text-[14px] font-medium text-text-primary/80">{style.name}</span>
                          <span className="text-[11px] text-text-muted/30 ml-2">{style.nameEn}</span>
                          <p className="text-[12px] text-text-muted/35 mt-0.5">{preview.desc}</p>
                        </div>
                        <div className={`flex h-4 w-4 items-center justify-center rounded-full shrink-0 transition-all duration-300 ${
                          isActive ? "bg-primary-500/80" : "border border-white/[0.08]"
                        }`}>
                          {isActive && (
                            <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>

                {/* Dream preview */}
                <div className="mt-6 p-4 rounded-xl bg-white/[0.015] border border-white/[0.03]">
                  <p className="text-[11px] text-text-muted/25 mb-1">입력한 꿈</p>
                  <p className="text-[12px] text-text-muted/50 line-clamp-2 leading-relaxed">{dreamText}</p>
                </div>

                {/* Error */}
                {error && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-4 text-[13px] text-rose-400/80 text-center"
                  >
                    {error}
                  </motion.p>
                )}

                {/* Submit */}
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="mt-8 w-full flex items-center justify-center gap-2 rounded-full py-4 text-[15px] font-medium text-white transition-all duration-500 bg-gradient-to-r from-primary-600/90 via-primary-500/90 to-primary-600/90 hover:shadow-[0_0_50px_rgba(109,60,239,0.2)] disabled:opacity-40 animate-gradient-shift"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      <span>꿈을 해석하는 중...</span>
                    </div>
                  ) : (
                    "꿈의 의미 알아보기"
                  )}
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
