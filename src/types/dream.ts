import type { ArtworkStyle } from "@/lib/utils/constants";

export interface FortuneScores {
  wealth: number;
  love: number;
  health: number;
  career: number;
}

export interface DetailedReport {
  fortune: FortuneScores;
  luckyNumbers: number[];
  luckyColor: string;
  luckyDirection: string;
  luckyTime: string;
  doToday: string;
  avoidToday: string;
  psychologicalInsight: string;
}

export interface DreamResult {
  dreamId: string;
  artworkUrl: string;
  artworkThumbnailUrl: string;
  artworkStyle: ArtworkStyle;
  interpretation: string;
  keywords: string[];
  fortunePreview: { wealth: number };
  luckyNumbersPreview: number[];
  isPaid: boolean;
  shareToken: string;
  detailedReport?: DetailedReport;
  createdAt: string;
  dreamText: string;
}

export interface DreamInput {
  dreamText: string;
  artworkStyle: ArtworkStyle;
  isTaeMong: boolean;
  taeName?: string;
}
