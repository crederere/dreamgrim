import Link from "next/link";
import { Sparkles, ArrowRight, Star, ChevronRight } from "lucide-react";
import type { Metadata } from "next";

/* ─── Demo SEO data (will be replaced with Supabase query) ─── */
const SEO_PAGES: Record<string, {
  keyword: string;
  h1: string;
  intro: string;
  situations: { title: string; interpretation: string; score: number }[];
  faq: { q: string; a: string }[];
  related: { slug: string; name: string }[];
}> = {
  snake: {
    keyword: "뱀꿈 해몽",
    h1: "뱀꿈 해몽 — 변화와 재생의 신호",
    intro:
      "뱀꿈은 동서양을 막론하고 가장 강렬한 상징을 지닌 꿈입니다. 뱀은 변화, 재생, 숨겨진 두려움, 그리고 지혜를 상징하며, 꿈 속 뱀의 행동과 상황에 따라 해석이 크게 달라집니다.",
    situations: [
      {
        title: "뱀에게 물리는 꿈",
        interpretation:
          "뱀에게 물리는 꿈은 변화의 시작을 알리는 강력한 신호입니다. 특히 재물운과 관련이 깊어, 예상치 못한 금전적 행운이 찾아올 수 있습니다. 물린 부위에 따라 해석이 달라지는데, 손을 물렸다면 새로운 기회를, 발을 물렸다면 삶의 방향 전환을 의미합니다.",
        score: 85,
      },
      {
        title: "큰 뱀을 보는 꿈",
        interpretation:
          "거대한 뱀이 등장하는 꿈은 대길몽으로, 큰 재물이나 성공이 다가오고 있음을 암시합니다. 뱀이 클수록, 그리고 금색이나 흰색일수록 길한 의미가 강해집니다.",
        score: 92,
      },
      {
        title: "뱀이 집에 들어오는 꿈",
        interpretation:
          "뱀이 집으로 들어오는 꿈은 가정에 경사가 있을 것을 예고합니다. 재산 증식, 가족의 좋은 소식, 또는 새로운 식구가 생길 수 있습니다. 전통적으로 매우 길한 꿈으로 해석됩니다.",
        score: 88,
      },
      {
        title: "뱀을 잡는 꿈",
        interpretation:
          "뱀을 잡는 꿈은 당신이 두려움이나 어려운 상황을 극복하고 원하는 것을 성취할 것임을 의미합니다. 직장에서의 승진, 사업의 성공, 또는 오래된 문제의 해결을 암시합니다.",
        score: 80,
      },
      {
        title: "뱀에게 쫓기는 꿈",
        interpretation:
          "뱀에게 쫓기는 꿈은 현재 삶에서 회피하고 있는 문제가 있음을 시사합니다. 하지만 이 꿈은 경고가 아니라, 그 문제를 직면할 준비가 되었다는 무의식의 메시지입니다.",
        score: 55,
      },
    ],
    faq: [
      {
        q: "뱀꿈은 길몽인가요 흉몽인가요?",
        a: "뱀꿈은 대부분 길몽으로 해석됩니다. 특히 큰 뱀, 금색 뱀, 뱀에게 물리는 꿈은 재물운과 관련된 대길몽입니다. 다만 뱀에게 쫓기거나 공포를 느끼는 꿈은 회피하고 있는 문제를 직면하라는 메시지일 수 있습니다.",
      },
      {
        q: "뱀꿈을 꾸면 로또를 사야 하나요?",
        a: "뱀꿈은 전통적으로 재물운과 연관된 꿈이지만, 로또 당첨을 보장하지는 않습니다. 다만 길한 기운을 활용하고 싶다면, 꿈그림에서 AI 기반 맞춤 행운 번호를 받아보세요.",
      },
      {
        q: "뱀꿈이 반복적으로 나타나면 어떤 의미인가요?",
        a: "반복되는 뱀꿈은 삶에서 큰 변화가 필요하다는 강력한 신호입니다. 무의식이 변화를 갈망하고 있으며, 그 변화를 받아들일 준비가 되어가고 있음을 나타냅니다.",
      },
    ],
    related: [
      { slug: "water", name: "물꿈" },
      { slug: "dragon", name: "용꿈" },
      { slug: "spider", name: "거미꿈" },
      { slug: "frog", name: "개구리꿈" },
      { slug: "tiger", name: "호랑이꿈" },
    ],
  },
};

// Fallback for other slugs
function getPageData(slug: string) {
  return SEO_PAGES[slug] || SEO_PAGES.snake;
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const data = getPageData(slug);
  return {
    title: `${data.keyword} — 꿈그림 AI 해몽`,
    description: data.intro.slice(0, 155),
    openGraph: {
      title: `${data.keyword} — 꿈그림 AI 해몽`,
      description: data.intro.slice(0, 155),
    },
  };
}

export default async function SeoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = getPageData(slug);

  const GRADIENTS = [
    "from-indigo-900 via-purple-800 to-pink-700",
    "from-emerald-900 via-teal-800 to-cyan-700",
    "from-amber-900 via-orange-800 to-rose-700",
    "from-slate-900 via-violet-900 to-fuchsia-800",
    "from-sky-900 via-blue-800 to-indigo-700",
  ];

  // JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: data.h1,
    description: data.intro,
    publisher: {
      "@type": "Organization",
      name: "꿈그림 DreamGrim",
      url: "https://dreamgrim.com",
    },
    mainEntity: data.faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-surface-0">
        {/* Hero */}
        <section className="relative">
          <div className={`h-72 sm:h-96 bg-gradient-to-br ${GRADIENTS[0]} relative overflow-hidden`}>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(255,255,255,0.08),transparent_60%)]" />
            <div className="absolute inset-0 bg-gradient-to-t from-surface-0 via-transparent to-transparent" />
            <div className="absolute bottom-0 inset-x-0 p-6 sm:p-10">
              <div className="mx-auto max-w-3xl">
                <h1 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight">
                  {data.h1}
                </h1>
              </div>
            </div>
          </div>
        </section>

        <main className="mx-auto max-w-3xl px-4 sm:px-6 py-10 sm:py-16">
          {/* Intro */}
          <section className="mb-12">
            <p className="text-lg text-text-secondary leading-relaxed">
              {data.intro}
            </p>
          </section>

          {/* Situations */}
          <section className="mb-16 space-y-8">
            <h2 className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl font-bold text-text-primary">
              상황별 해몽
            </h2>

            {data.situations.map((sit, i) => (
              <article
                key={sit.title}
                className="glass-card rounded-2xl overflow-hidden"
              >
                {/* Mini artwork */}
                <div className={`h-48 bg-gradient-to-br ${GRADIENTS[i % GRADIENTS.length]} relative`}>
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.08),transparent_60%)]" />
                  <div className="absolute top-4 right-4 flex items-center gap-1.5 rounded-full bg-black/40 backdrop-blur-md px-3 py-1.5 text-xs font-medium text-white">
                    <Star className="h-3 w-3 text-gold-400 fill-gold-400" />
                    재물운 {sit.score}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-text-primary mb-3">
                    {sit.title}
                  </h3>
                  <p className="text-text-secondary leading-relaxed">
                    {sit.interpretation}
                  </p>
                </div>
              </article>
            ))}
          </section>

          {/* CTA */}
          <section className="mb-16 rounded-3xl bg-gradient-to-br from-primary-600/15 via-primary-500/10 to-surface-100 border border-primary-500/15 p-8 sm:p-10 text-center">
            <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-text-primary mb-3">
              당신의 꿈은 더 구체적인가요?
            </h2>
            <p className="text-text-secondary mb-6">
              AI에게 직접 물어보세요. 당신만의 맞춤 해몽과 아트워크를 무료로 받아보세요.
            </p>
            <Link
              href="/dream"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary-600 to-primary-500 px-7 py-3.5 text-base font-bold text-white shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 transition-all hover:scale-[1.02]"
            >
              <Sparkles className="h-5 w-5" />
              무료로 꿈 그리기
              <ArrowRight className="h-5 w-5" />
            </Link>
          </section>

          {/* Related Dreams */}
          <section className="mb-16">
            <h2 className="font-[family-name:var(--font-display)] text-xl font-bold text-text-primary mb-5">
              관련 꿈 해몽
            </h2>
            <div className="flex flex-wrap gap-3">
              {data.related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/dream/${r.slug}`}
                  className="inline-flex items-center gap-1.5 rounded-full bg-surface-200/50 px-4 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-surface-300/50 transition-colors"
                >
                  {r.name} 해몽
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              ))}
            </div>
          </section>

          {/* FAQ */}
          <section className="mb-12">
            <h2 className="font-[family-name:var(--font-display)] text-xl font-bold text-text-primary mb-5">
              자주 묻는 질문
            </h2>
            <div className="space-y-4">
              {data.faq.map((f) => (
                <details
                  key={f.q}
                  className="glass-card rounded-xl group"
                >
                  <summary className="cursor-pointer p-5 text-text-primary font-medium flex items-center justify-between">
                    {f.q}
                    <ChevronRight className="h-4 w-4 text-text-muted transition-transform group-open:rotate-90 shrink-0" />
                  </summary>
                  <div className="px-5 pb-5 text-sm text-text-secondary leading-relaxed">
                    {f.a}
                  </div>
                </details>
              ))}
            </div>
          </section>

          {/* Disclaimer */}
          <div className="text-center text-xs text-text-muted/60 py-6 border-t border-white/5">
            본 서비스는 AI 기반 엔터테인먼트 서비스이며, 의료·심리·재정 조언이 아닙니다.
            <br />
            행운 번호는 당첨을 보장하지 않습니다.
          </div>
        </main>
      </div>
    </>
  );
}
