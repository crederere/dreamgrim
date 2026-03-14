import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative border-t border-white/[0.03] bg-surface-0">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 py-14">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-10">
          {/* Brand */}
          <div className="max-w-xs">
            <span className="font-[family-name:var(--font-display)] text-lg font-bold text-text-primary">
              꿈그림
            </span>
            <p className="mt-3 text-[13px] text-text-muted/50 leading-relaxed">
              AI가 해몽하고 그려주는<br />
              운세 · 행운 번호 · 꿈 아트워크
            </p>
          </div>

          {/* Links */}
          <div className="flex gap-16">
            <div>
              <h4 className="text-[11px] tracking-[0.15em] text-text-muted/40 uppercase mb-3 font-medium">서비스</h4>
              <ul className="space-y-2">
                {[
                  { href: "/dream", label: "꿈 해몽" },
                  { href: "/pricing", label: "요금제" },
                  { href: "/#gallery", label: "갤러리" },
                ].map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-[13px] text-text-muted/60 hover:text-text-secondary transition-colors duration-300">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-[11px] tracking-[0.15em] text-text-muted/40 uppercase mb-3 font-medium">안내</h4>
              <ul className="space-y-2">
                {[
                  { href: "/terms", label: "이용약관" },
                  { href: "/privacy", label: "개인정보처리방침" },
                ].map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-[13px] text-text-muted/60 hover:text-text-secondary transition-colors duration-300">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/[0.03]">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <p className="text-[11px] text-text-muted/30">
              &copy; 2026 꿈그림 DreamGrim
            </p>
            <p className="text-[11px] text-text-muted/20">
              엔터테인먼트 목적이며, 의료·심리·재정 조언이 아닙니다
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
