import type { AuditRequest, AuditResult } from "../types";
import { MOCK_AUDIT_RESULT } from "../mockData";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.DEV ? "http://localhost:3001" : "");

const USE_MOCK_AUDIT = import.meta.env.VITE_USE_MOCK_AUDIT === "true";

export function createTimedMockAuditResult(now = new Date()): AuditResult {
  const runId = `run_${Math.random().toString(16).slice(2)}${now
    .getTime()
    .toString(16)
    .slice(-4)}`;
  const offsetsMs = [0, 311, 517, 1103, 1440, 1708, 1890];

  return {
    ...MOCK_AUDIT_RESULT,
    runId,
    runAt: new Date(now.getTime() + offsetsMs[offsetsMs.length - 1]).toISOString(),
    auditTrail: MOCK_AUDIT_RESULT.auditTrail.map((step, idx) => ({
      ...step,
      timestamp: new Date(now.getTime() + (offsetsMs[idx] ?? 0)).toISOString(),
    })),
    rawAgentOutput: {
      ...(MOCK_AUDIT_RESULT.rawAgentOutput && typeof MOCK_AUDIT_RESULT.rawAgentOutput === "object"
        ? MOCK_AUDIT_RESULT.rawAgentOutput
        : {}),
      runId,
    },
  };
}

export async function runLiveAudit(payload: AuditRequest): Promise<AuditResult> {
  if (USE_MOCK_AUDIT) {
    console.log('[auditService] Returning MOCK_AUDIT_RESULT');
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return createTimedMockAuditResult();
  }
  console.log('[auditService] Calling live backend...');

  const response = await fetch(`${API_BASE_URL}/api/audit`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Audit failed: ${errorText}`);
  }

  return response.json();
}
