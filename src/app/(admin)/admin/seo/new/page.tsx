"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import SeoForm from "@/components/admin/SeoForm";

export default function AdminSeoNewPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const handleSave = async (data: Record<string, unknown>) => {
    setSaving(true);
    const res = await fetch("/api/admin/seo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      router.push("/admin/seo");
    }
    setSaving(false);
  };

  return (
    <div className="max-w-3xl space-y-6">
      <button onClick={() => router.push("/admin/seo")} className="flex items-center gap-2 text-[13px] text-text-muted/40 hover:text-text-secondary transition-colors">
        <ArrowLeft className="w-4 h-4" /> SEO 목록
      </button>
      <h2 className="text-[18px] font-bold text-text-primary">새 SEO 페이지</h2>
      <SeoForm onSave={handleSave} saving={saving} />
    </div>
  );
}
