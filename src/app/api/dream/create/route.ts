import { NextResponse } from "next/server";
import { z } from "zod";
import { runDreamPipeline } from "@/lib/ai/dream-pipeline";

const DreamCreateSchema = z.object({
  dream_text: z
    .string()
    .min(10, "꿈 내용은 최소 10자 이상이어야 합니다")
    .max(2000, "꿈 내용은 2000자를 초과할 수 없습니다"),
  artwork_style: z.enum([
    "watercolor",
    "oil_painting",
    "digital_art",
    "ghibli",
    "monochrome",
  ]),
  is_tae_mong: z.boolean().default(false),
  tae_name: z.string().optional(),
  gender: z.enum(["male", "female", "other"]).optional(),
  birth_date: z.string().optional(),
  concern: z.string().max(200).optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = DreamCreateSchema.parse(body);

    // Build enriched dream text with context
    let enrichedText = parsed.dream_text;
    const contextParts: string[] = [];
    if (parsed.gender) {
      const genderMap = { male: "남성", female: "여성", other: "기타" };
      contextParts.push(`성별: ${genderMap[parsed.gender]}`);
    }
    if (parsed.birth_date) {
      contextParts.push(`생년월일: ${parsed.birth_date}`);
    }
    if (parsed.concern) {
      contextParts.push(`현재 고민/관심사: ${parsed.concern}`);
    }
    if (contextParts.length > 0) {
      enrichedText += `\n\n[사용자 정보]\n${contextParts.join("\n")}`;
    }

    const result = await runDreamPipeline({
      dreamText: enrichedText,
      artworkStyle: parsed.artwork_style,
      isTaeMong: parsed.is_tae_mong,
      taeName: parsed.tae_name,
      userBirthDate: parsed.birth_date,
    });

    const dreamId = crypto.randomUUID();

    return NextResponse.json({
      dream_id: dreamId,
      artwork_url: result.artworkUrl,
      artwork_thumbnail_url: result.artworkThumbnailUrl,
      interpretation: result.analysis.interpretation,
      keywords: result.analysis.keywords,
      detailed_report: result.analysis.detailed_report,
      is_paid: false,
      share_token: dreamId.slice(0, 8),
      remaining_credits: 1,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "입력값이 올바르지 않습니다", details: error.issues },
        { status: 400 },
      );
    }

    console.error("Dream creation error:", error);
    return NextResponse.json(
      { error: "꿈 분석 중 오류가 발생했습니다. 다시 시도해주세요." },
      { status: 500 },
    );
  }
}
