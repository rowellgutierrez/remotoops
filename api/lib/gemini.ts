import { GoogleGenAI } from "@google/genai";

export function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured in environment variables.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

export class GeminiParseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GeminiParseError";
  }
}

export async function generateGeminiJson(prompt: string): Promise<any> {
  const ai = getGeminiClient();
  const models = ["gemini-3.6-flash", "gemini-flash-latest"];

  let rawText = "";
  let lastError: any = null;

  for (const model of models) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });
      if (response && typeof response.text === "string" && response.text.trim()) {
        rawText = response.text.trim();
        break;
      }
    } catch (err: any) {
      lastError = err;
      console.error(`[Gemini API] Call failed for model ${model}:`, err.message || err);
    }
  }

  if (!rawText) {
    if (lastError) {
      throw lastError;
    }
    throw new GeminiParseError("Gemini returned an empty response.");
  }

  let cleaned = rawText;
  if (cleaned.startsWith("```json")) {
    cleaned = cleaned.slice(7);
  } else if (cleaned.startsWith("```")) {
    cleaned = cleaned.slice(3);
  }
  if (cleaned.endsWith("```")) {
    cleaned = cleaned.slice(0, -3);
  }
  cleaned = cleaned.trim();

  try {
    const parsed = JSON.parse(cleaned);
    if (!parsed || typeof parsed !== "object") {
      throw new GeminiParseError("Gemini output is not a JSON object.");
    }
    return parsed;
  } catch (err: any) {
    if (err instanceof GeminiParseError) {
      throw err;
    }
    console.error("[Gemini API] JSON parse error:", err.message, "Raw output:", rawText);
    throw new GeminiParseError("Gemini returned an invalid response.");
  }
}
