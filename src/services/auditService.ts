import type { AuditRequest, AuditResult } from "../types";
import { MOCK_AUDIT_RESULT } from "../mockData";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.DEV ? "http://localhost:3001" : "");

const USE_MOCK_AUDIT = import.meta.env.VITE_USE_MOCK_AUDIT === "true";

export async function runLiveAudit(payload: AuditRequest): Promise<AuditResult> {
  if (USE_MOCK_AUDIT) {
    console.log('[auditService] Returning MOCK_AUDIT_RESULT');
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return MOCK_AUDIT_RESULT;
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
