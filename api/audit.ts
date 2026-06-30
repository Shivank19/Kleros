import { runAuditPipeline } from "../server/pipeline/runAuditPipeline";
import type { AuditRequest } from "../src/types";

type VercelRequest = {
  method?: string;
  body?: unknown;
};

type VercelResponse = {
  status: (code: number) => VercelResponse;
  json: (body: unknown) => void;
  setHeader: (name: string, value: string) => void;
};

function parseBody(body: unknown): AuditRequest {
  if (typeof body === "string") {
    return JSON.parse(body) as AuditRequest;
  }

  return body as AuditRequest;
}

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    response.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const payload = parseBody(request.body);
    const result = await runAuditPipeline(payload);

    response.status(200).json(result);
  } catch (error) {
    console.error("Audit Error:", error);

    response.status(500).json({
      error: "Audit failed",
      message: error instanceof Error ? error.message : "Unknown server error",
    });
  }
}
