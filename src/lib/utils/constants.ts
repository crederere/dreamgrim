export const ARTWORK_STYLES = [
  { id: "watercolor", name: "수채화", nameEn: "Watercolor", emoji: "🎨" },
  { id: "oil_painting", name: "유화", nameEn: "Oil Painting", emoji: "🖼️" },
  { id: "digital_art", name: "디지털아트", nameEn: "Digital Art", emoji: "💫" },
  { id: "ghibli", name: "지브리", nameEn: "Ghibli", emoji: "🌿" },
  { id: "monochrome", name: "흑백", nameEn: "Monochrome", emoji: "🌑" },
] as const;

export type ArtworkStyle = (typeof ARTWORK_STYLES)[number]["id"];

export const POPULAR_KEYWORDS = [
  "뱀", "바다", "하늘", "도망", "이빨", "돼지", "고양이",
  "불", "물", "죽음", "임신", "돈", "고래", "용", "호랑이",
  "꽃", "비행", "시험", "전쟁", "결혼",
] as const;

export const PRICES = {
  single_report: 4900,
  consult_session: 2900,
  subscription_monthly: 9900,
  goods_card: 12900,
  goods_poster: 19900,
  goods_poster_framed: 29900,
  goods_postcard: 14900,
  goods_calendar: 29900,
  taemong_basic: 39900,
  taemong_premium: 59900,
} as const;

export const FREE_CREDITS_PER_WEEK = 2;
export const MAX_DREAM_TEXT_LENGTH = 2000;
export const MIN_DREAM_TEXT_LENGTH = 10;
