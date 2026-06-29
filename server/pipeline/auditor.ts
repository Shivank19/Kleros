import { brainClient, brainModel } from "../services/llmClient";
import { auditorPrompt } from "./prompts";
import { parseJsonFromModel } from "../utils/parseJson";
import type { MissingDocumentation, PolicyRequirementCheck } from "../../src/types";

type AuditArgs = {
  clinicalNote: string;
  billingCode: string;
  policyTitle: string;
  policyRequirements: string[];
  extractedFacts: unknown;
};

type AuditResponse = {
  checks?: PolicyRequirementCheck[];
  missingDocumentation?: MissingDocumentation[];
  summary?: string;
};

export async function auditAgainstPolicy(args: AuditArgs): Promise<AuditResponse> {
  console.log("[Auditor] Calling model:", process.env.BRAIN_MODEL);
  const response = await brainClient.chat.completions.create({
    model: brainModel,
    temperature: 0.1,
    messages: [
      {
        role: "system",
        content:
          "You audit clinical documentation against payer policy requirements. Return valid JSON only.",
      },
      {
        role: "user",
        content: auditorPrompt(args),
      },
    ],
  });

  const content = response.choices[0]?.message?.content;

  if (!content) {
    throw new Error("Auditor returned empty response");
  }

  return parseJsonFromModel<AuditResponse>(content);
}
