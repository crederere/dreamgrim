import Anthropic from "@anthropic-ai/sdk";
import { DREAM_ANALYSIS_SYSTEM_PROMPT, TAEMONG_ADDITIONAL_PROMPT } from "./prompts";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

interface AnalyzeDreamParams {
  dreamText: string;
  isTaeMong: boolean;
  userBirthDate?: string;
  today: string;
}

export interface DreamAnalysis {
  interpretation: string;
  keywords: string[];
  detailed_report: {
    fortune: { wealth: number; love: number; health: number; career: number };
    lucky_numbers: number[];
    lucky_color: string;
    lucky_direction: string;
    lucky_time: string;
    do_today: string;
    avoid_today: string;
    psychological_insight: string;
  };
  image_prompt: string;
}

export async function analyzeDream(params: AnalyzeDreamParams): Promise<DreamAnalysis> {
  const systemPrompt = params.isTaeMong
    ? DREAM_ANALYSIS_SYSTEM_PROMPT + TAEMONG_ADDITIONAL_PROMPT
    : DREAM_ANALYSIS_SYSTEM_PROMPT;

  let userMessage = `오늘 날짜: ${params.today}\n`;
  if (params.userBirthDate) {
    userMessage += `사용자 생년월일: ${params.userBirthDate}\n`;
  }
  userMessage += `\n꿈 내용:\n${params.dreamText}`;

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 2000,
    system: systemPrompt,
    messages: [{ role: "user", content: userMessage }],
  });

  const text =
    response.content[0].type === "text" ? response.content[0].text : "";

  // Parse JSON from response
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("Failed to parse dream analysis response");
  }

  const parsed = JSON.parse(jsonMatch[0]) as DreamAnalysis;

  // Validate lucky numbers
  if (
    !parsed.detailed_report.lucky_numbers ||
    parsed.detailed_report.lucky_numbers.length !== 6
  ) {
    parsed.detailed_report.lucky_numbers = generateFallbackNumbers();
  }

  return parsed;
}

function generateFallbackNumbers(): number[] {
  const nums = new Set<number>();
  while (nums.size < 6) {
    nums.add(Math.floor(Math.random() * 45) + 1);
  }
  return Array.from(nums).sort((a, b) => a - b);
}
