"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import AdminInput, { AdminTextarea, AdminSelect } from "@/components/admin/AdminInput";
import { AdminButton } from "@/components/admin/AdminModal";

interface SeoFormProps {
  initialData?: Record<string, unknown>;
  onSave: (data: Record<string, unknown>) => Promise<void>;
  saving: boolean;
}

export default function SeoForm({ initialData, onSave, saving }: SeoFormProps) {
  const [form, setForm] = useState({
    slug: (initialData?.slug as string) ?? "",
    keyword_ko: (initialData?.keyword_ko as string) ?? "",
    tier: (initialData?.tier as number) ?? 2,
    title: (initialData?.title as string) ?? "",
    meta_description: (initialData?.meta_description as string) ?? "",
    h1_title: (initialData?.h1_title as string) ?? "",
    intro_text: (initialData?.intro_text as string) ?? "",
    monthly_search_volume: (initialData?.monthly_search_volume as number) ?? 0,
    current_rank: (initialData?.current_rank as number | null) ?? null,
    is_published: (initialData?.is_published as boolean) ?? false,
    situations: (initialData?.situations as Array<{ title: string; description: string }>) ?? [],
    faq: (initialData?.faq as Array<{ question: string; answer: string }>) ?? [],
    related_slugs: (initialData?.related_slugs as string[]) ?? [],
  });

  const set = <K extends keyof typeof form>(key: K, val: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic fields */}
      <div className="glass rounded-xl p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <AdminInput label="키워드 (한국어)" value={form.keyword_ko} onChange={(e) => set("keyword_ko", e.target.value)} required />
          <AdminInput label="슬러그 (URL)" value={form.slug} onChange={(e) => set("slug", e.target.value)} required placeholder="뱀-꿈-해몽" />
        </div>
        <AdminInput label="페이지 제목" value={form.title} onChange={(e) => set("title", e.target.value)} required />
        <AdminInput label="H1 타이틀" value={form.h1_title} onChange={(e) => set("h1_title", e.target.value)} />
        <AdminTextarea label="메타 설명" value={form.meta_description} onChange={(e) => set("meta_description", e.target.value)} rows={2} />
        <AdminTextarea label="인트로 텍스트" value={form.intro_text} onChange={(e) => set("intro_text", e.target.value)} rows={4} />
        <div className="grid grid-cols-3 gap-4">
          <AdminSelect
            label="티어"
            value={String(form.tier)}
            onChange={(e) => set("tier", parseInt(e.target.value))}
            options={[
              { value: "1", label: "Tier 1 (높음)" },
              { value: "2", label: "Tier 2 (중간)" },
              { value: "3", label: "Tier 3 (낮음)" },
            ]}
          />
          <AdminInput label="월 검색량" type="number" value={form.monthly_search_volume} onChange={(e) => set("monthly_search_volume", parseInt(e.target.value) || 0)} />
          <AdminInput label="현재 순위" type="number" value={form.current_rank ?? ""} onChange={(e) => set("current_rank", e.target.value ? parseInt(e.target.value) : null)} placeholder="없음" />
        </div>
      </div>

      {/* Situations */}
      <div className="glass rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[13px] font-semibold text-text-primary">상황별 해석</h3>
          <button type="button" onClick={() => set("situations", [...form.situations, { title: "", description: "" }])} className="flex items-center gap-1 text-[12px] text-primary-400/60 hover:text-primary-300">
            <Plus className="w-3.5 h-3.5" /> 추가
          </button>
        </div>
        <div className="space-y-3">
          {form.situations.map((s, i) => (
            <div key={i} className="flex gap-3 items-start">
              <div className="flex-1 grid grid-cols-2 gap-3">
                <AdminInput placeholder="제목" value={s.title} onChange={(e) => {
                  const arr = [...form.situations];
                  arr[i] = { ...arr[i], title: e.target.value };
                  set("situations", arr);
                }} />
                <AdminInput placeholder="설명" value={s.description} onChange={(e) => {
                  const arr = [...form.situations];
                  arr[i] = { ...arr[i], description: e.target.value };
                  set("situations", arr);
                }} />
              </div>
              <button type="button" onClick={() => set("situations", form.situations.filter((_, j) => j !== i))} className="mt-2 text-text-muted/30 hover:text-fortune-low">
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="glass rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[13px] font-semibold text-text-primary">FAQ</h3>
          <button type="button" onClick={() => set("faq", [...form.faq, { question: "", answer: "" }])} className="flex items-center gap-1 text-[12px] text-primary-400/60 hover:text-primary-300">
            <Plus className="w-3.5 h-3.5" /> 추가
          </button>
        </div>
        <div className="space-y-3">
          {form.faq.map((f, i) => (
            <div key={i} className="flex gap-3 items-start">
              <div className="flex-1 space-y-2">
                <AdminInput placeholder="질문" value={f.question} onChange={(e) => {
                  const arr = [...form.faq];
                  arr[i] = { ...arr[i], question: e.target.value };
                  set("faq", arr);
                }} />
                <AdminInput placeholder="답변" value={f.answer} onChange={(e) => {
                  const arr = [...form.faq];
                  arr[i] = { ...arr[i], answer: e.target.value };
                  set("faq", arr);
                }} />
              </div>
              <button type="button" onClick={() => set("faq", form.faq.filter((_, j) => j !== i))} className="mt-2 text-text-muted/30 hover:text-fortune-low">
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Publish toggle + Save */}
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-3 cursor-pointer">
          <button
            type="button"
            onClick={() => set("is_published", !form.is_published)}
            className={`w-10 h-5.5 rounded-full transition-colors relative ${form.is_published ? "bg-fortune-high/30" : "bg-white/[0.06]"}`}
          >
            <div className={`absolute top-0.5 w-4.5 h-4.5 rounded-full transition-all ${form.is_published ? "left-5 bg-fortune-high" : "left-0.5 bg-text-muted/30"}`} />
          </button>
          <span className="text-[13px] text-text-secondary/60">{form.is_published ? "발행됨" : "미발행"}</span>
        </label>

        <AdminButton variant="primary" onClick={() => onSave(form)} disabled={saving}>
          {saving ? "저장 중..." : "저장"}
        </AdminButton>
      </div>
    </form>
  );
}
