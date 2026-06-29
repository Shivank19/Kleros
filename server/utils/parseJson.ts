export function parseJsonFromModel<T = unknown>(content: string): T {
  let cleaned = content.trim();

  // Remove markdown JSON/code fences if model returns ```json ... ```
  if (cleaned.startsWith("```")) {
    cleaned = cleaned
      .replace(/^```(?:json)?/i, "")
      .replace(/```$/i, "")
      .trim();
  }

  // Extra fallback: extract the first JSON object from the response
  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");

  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    cleaned = cleaned.slice(firstBrace, lastBrace + 1);
  }

  try {
    return JSON.parse(cleaned) as T;
  } catch {
    console.error("[JSON Parse Error] Raw model output:");
    console.error(content);
    console.error("[JSON Parse Error] Cleaned output:");
    console.error(cleaned);

    throw new Error("Model returned invalid JSON after cleanup.");
  }
}