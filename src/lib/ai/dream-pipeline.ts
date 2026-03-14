import { analyzeDream, type DreamAnalysis } from "./claude";
import { STYLE_PRESETS, QUALITY_SUFFIX } from "./prompts";
import type { ArtworkStyle } from "@/lib/utils/constants";

interface DreamPipelineInput {
  dreamText: string;
  artworkStyle: ArtworkStyle;
  isTaeMong: boolean;
  taeName?: string;
  userBirthDate?: string;
}

interface DreamPipelineResult {
  analysis: DreamAnalysis;
  artworkUrl: string;
  artworkThumbnailUrl: string;
  imagePrompt: string;
}

/**
 * Generate artwork using Gemini API (Google Generative AI).
 * Falls back to placeholder if generation fails.
 */
async function generateArtwork(imagePrompt: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("GEMINI_API_KEY not set, using placeholder");
    return "";
  }

  const models = [
    "gemini-2.5-flash-image",
    "gemini-2.0-flash-exp-image-generation",
  ];

  for (const model of models) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: imagePrompt }] }],
            generationConfig: {
              responseModalities: ["TEXT", "IMAGE"],
              imageConfig: {
                aspectRatio: "1:1",
                imageSize: "2K",
              },
            },
          }),
        }
      );

      if (!response.ok) {
        const err = await response.text();
        if (err.includes("429") || err.includes("RESOURCE_EXHAUSTED") || err.includes("404")) {
          continue;
        }
        console.warn(`Gemini ${model} error:`, err.slice(0, 200));
        continue;
      }

      const data = await response.json();
      const parts = data.candidates?.[0]?.content?.parts;
      if (parts) {
        for (const part of parts) {
          if (part.inlineData) {
            // Return as base64 data URL
            return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
          }
        }
      }
    } catch (error) {
      console.warn(`Gemini ${model} fetch error:`, error);
      continue;
    }
  }

  // Fallback: try Imagen
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:generateImages?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: imagePrompt,
          config: {
            numberOfImages: 1,
            aspectRatio: "1:1",
          },
        }),
      }
    );

    if (response.ok) {
      const data = await response.json();
      if (data.generatedImages?.[0]?.image?.imageBytes) {
        return `data:image/png;base64,${data.generatedImages[0].image.imageBytes}`;
      }
    }
  } catch (error) {
    console.warn("Imagen fallback error:", error);
  }

  return "";
}

/**
 * Full dream analysis pipeline:
 * 1. Claude API → dream interpretation + fortune + image prompt
 * 2. Gemini API → artwork generation
 */
export async function runDreamPipeline(
  input: DreamPipelineInput
): Promise<DreamPipelineResult> {
  const today = new Date().toISOString().split("T")[0];

  // Step 1: Claude analysis
  const analysis = await analyzeDream({
    dreamText: input.dreamText,
    isTaeMong: input.isTaeMong,
    userBirthDate: input.userBirthDate,
    today,
  });

  // Step 2: Build full image prompt
  const stylePreset = STYLE_PRESETS[input.artworkStyle];
  const fullImagePrompt = `${stylePreset.prefix}, ${analysis.image_prompt}. No text, no watermarks, no logos, no letters, no words overlaid on the image.${QUALITY_SUFFIX}`;

  // Step 3: Generate artwork via Gemini
  let artworkUrl = "";
  try {
    artworkUrl = await generateArtwork(fullImagePrompt);
  } catch (error) {
    console.error("Artwork generation error:", error);
  }

  return {
    analysis,
    artworkUrl,
    artworkThumbnailUrl: artworkUrl,
    imagePrompt: fullImagePrompt,
  };
}
