"use client";

import { Check, X, ExternalLink } from "lucide-react";
import { PRICES, FREE_CREDITS_PER_WEEK, ARTWORK_STYLES } from "@/lib/utils/constants";

const ENV_CHECKS = [
  { key: "NEXT_PUBLIC_SUPABASE_URL", label: "Supabase URL" },
  { key: "NEXT_PUBLIC_SUPABASE_ANON_KEY", label: "Supabase Anon Key" },
  { key: "SUPABASE_SERVICE_ROLE_KEY", label: "Supabase Service Role Key" },
  { key: "ANTHROPIC_API_KEY", label: "Anthropic (Claude) API Key" },
  { key: "GEMINI_API_KEY", label: "Gemini API Key" },
  { key: "KAKAOPAY_CID", label: "KakaoPay CID" },
  { key: "TOSS_SECRET_KEY", label: "Toss Secret Key" },
  { key: "ADMIN_EMAILS", label: "Admin Emails" },
];

const PRICE_LABELS: Record<string, string> = {
  single_report: "단건 리포트",
  consult_session: "AI 상담",
  subscription_monthly: "월 구독",
  goods_card: "꿈 부적 카드",
  goods_poster: "아트 포스터",
  goods_poster_framed: "액자 포스터",
  goods_postcard: "엽서 세트",
  goods_calendar: "꿈 달력",
  taemong_basic: "태몽 베이직",
  taemong_premium: "태몽 프리미엄",
};

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6 max-w-3xl">
      {/* System Status */}
      <div className="glass rounded-xl p-6">
        <h3 className="text-[14px] font-semibold text-text-primary mb-5">시스템 상태</h3>
        <div className="space-y-3">
          {ENV_CHECKS.map((env) => {
            // We can't access server env from client, so show as config reference
            return (
              <div key={env.key} className="flex items-center justify-between py-2 border-b border-white/[0.03] last:border-0">
                <div>
                  <p className="text-[13px] text-text-secondary/60">{env.label}</p>
                  <p className="text-[10px] text-text-muted/25 font-mono mt-0.5">{env.key}</p>
                </div>
                <span className="text-[11px] text-text-muted/30">Vercel에서 확인</span>
              </div>
            );
          })}
        </div>
        <a
          href="https://vercel.com/dashboard"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-1.5 text-[12px] text-primary-400/60 hover:text-primary-300 transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5" /> Vercel 대시보드에서 환경 변수 관리
        </a>
      </div>

      {/* Pricing */}
      <div className="glass rounded-xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-[14px] font-semibold text-text-primary">가격 설정</h3>
          <span className="text-[10px] text-text-muted/25 border border-white/[0.04] rounded px-2 py-0.5">코드에서 관리</span>
        </div>
        <div className="space-y-2">
          {Object.entries(PRICES).map(([key, price]) => (
            <div key={key} className="flex items-center justify-between py-2 border-b border-white/[0.03] last:border-0">
              <span className="text-[13px] text-text-secondary/60">{PRICE_LABELS[key] ?? key}</span>
              <span className="text-[13px] text-text-primary font-medium">₩{price.toLocaleString()}</span>
            </div>
          ))}
        </div>
        <p className="mt-4 text-[11px] text-text-muted/25">
          가격 변경은 <code className="text-primary-400/40">src/lib/utils/constants.ts</code> 에서 수정 후 배포
        </p>
      </div>

      {/* Credits */}
      <div className="glass rounded-xl p-6">
        <h3 className="text-[14px] font-semibold text-text-primary mb-5">크레딧 정책</h3>
        <div className="flex items-center justify-between py-2">
          <span className="text-[13px] text-text-secondary/60">주간 무료 크레딧</span>
          <span className="text-[13px] text-text-primary font-medium">{FREE_CREDITS_PER_WEEK}회</span>
        </div>
      </div>

      {/* Art styles */}
      <div className="glass rounded-xl p-6">
        <h3 className="text-[14px] font-semibold text-text-primary mb-5">아트워크 스타일</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {ARTWORK_STYLES.map((style) => (
            <div key={style.id} className="rounded-lg bg-white/[0.02] border border-white/[0.03] p-3 text-center">
              <p className="text-[16px] mb-1">{style.emoji}</p>
              <p className="text-[13px] text-text-primary/70 font-medium">{style.name}</p>
              <p className="text-[10px] text-text-muted/30">{style.nameEn}</p>
            </div>
          ))}
        </div>
      </div>

      {/* AI Models */}
      <div className="glass rounded-xl p-6">
        <h3 className="text-[14px] font-semibold text-text-primary mb-5">AI 모델</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-white/[0.03]">
            <div>
              <p className="text-[13px] text-text-secondary/60">꿈 해석</p>
              <p className="text-[10px] text-text-muted/25 mt-0.5">Claude</p>
            </div>
            <span className="text-[12px] text-primary-400/50 font-mono">claude-sonnet-4-6</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-[13px] text-text-secondary/60">아트워크 생성</p>
              <p className="text-[10px] text-text-muted/25 mt-0.5">Gemini</p>
            </div>
            <span className="text-[12px] text-primary-400/50 font-mono">gemini-2.5-flash</span>
          </div>
        </div>
      </div>
    </div>
  );
}
