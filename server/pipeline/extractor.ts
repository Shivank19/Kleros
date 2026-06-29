import { brainClient, brainModel } from "../services/llmClient";
import { extractorPrompt } from "./prompts";
import { parseJsonFromModel } from "../utils/parseJson";
import type { ClinicalFact } from "../../src/types";

type ExtractionResponse = {
  facts: ClinicalFact[];
};

export async function extractClinicalFacts(clinicalNote: string): Promise<ExtractionResponse> {
  console.log("[Extractor] Calling model:", process.env.BRAIN_MODEL);
  const response = await brainClient.chat.completions.create({
    model: brainModel,
    temperature: 0.1,
    messages: [
      {
        role: "system",
        content:
          "You extract structured clinical facts from notes. Return valid JSON only.",
      },
      {
        role: "user",
        content: extractorPrompt(clinicalNote),
      },
    ],
  });

  const content = response.choices[0]?.message?.content;

  if (!content) {
    throw new Error("Extractor returned empty response");
  }

  return parseJsonFromModel<ExtractionResponse>(content);
}
