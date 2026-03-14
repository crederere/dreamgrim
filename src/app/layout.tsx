import type { Metadata } from "next";
import { Playfair_Display } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "꿈그림 — AI가 그려주는 어젯밤 꿈",
    template: "%s | 꿈그림",
  },
  description:
    "어젯밤 꿈을 입력하면 AI가 몽환적 아트워크로 시각화하고, 꿈 해몽·운세·행운 번호를 알려드립니다.",
  keywords: [
    "꿈해몽",
    "꿈그림",
    "AI해몽",
    "꿈시각화",
    "운세",
    "행운번호",
    "태몽",
    "꿈일기",
  ],
  openGraph: {
    title: "꿈그림 — AI가 그려주는 어젯밤 꿈",
    description:
      "어젯밤 꿈을 입력하면 AI가 몽환적 아트워크로 시각화하고, 꿈 해몽·운세·행운 번호를 알려드립니다.",
    siteName: "꿈그림 DreamGrim",
    locale: "ko_KR",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="dark">
      <head>
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@400;700;900&display=swap"
        />
      </head>
      <body className={`${playfair.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
