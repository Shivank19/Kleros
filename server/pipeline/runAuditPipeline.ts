import { extractClinicalFacts } from "./extractor";
import { auditAgainstPolicy } from "./auditor";
import { deriveDecision } from "./decisionEngine";
import { calculateConfidence } from "./confidence";
import type { AuditRequest, AuditResult, AuditTrailStep } from "../../src/types";

function nowTimestamp() {
    return new Date().toLocaleTimeString();
}

function createRunId(){
    return `run_${Math.random().toString(16).slice(2)}${Date.now()
    .toString(16)
    .slice(-4)}`;
}

export async function runAuditPipeline(request: AuditRequest): Promise<AuditResult> {
    console.log("[Pipeline] Audit started:", {
        billingCode: request.billingCode,
        policyId: request.policyId,
        noteLength: request.clinicalNote.length,
    });
    if (!request.clinicalNote || !request.billingCode || !request.policyRequirements) {
    throw new Error("Missing required audit input");
  }

  const runId = createRunId();

  const extraction = await extractClinicalFacts(request.clinicalNote);

  const audit = await auditAgainstPolicy({
    clinicalNote: request.clinicalNote,
    billingCode: request.billingCode,
    policyTitle: request.policyTitle,
    policyRequirements: request.policyRequirements,
    extractedFacts: extraction,
  });

  const checks = audit.checks || [];
  const decision = deriveDecision(checks);
  const confidence = calculateConfidence(checks);

  const metCount = checks.filter((check) => check.status === "MET").length;
  const ambiguousCount = checks.filter((check) => check.status === "AMBIGUOUS").length;
  const notMetCount = checks.filter((check) => check.status === "NOT_MET").length;
  const notDocumentedCount = checks.filter((check) => check.status === "NOT_DOCUMENTED").length;

  const auditTrail: AuditTrailStep[] = [
    {
        id: "claim_ingested",
        label: "CLAIM_INGESTED",
        status: "COMPLETE",
        timestamp: nowTimestamp(),
        description: "Clinical note and billing data received.",
        detail: `${request.billingCode} - ${request.policyId}`,
    },
    {
        id: "nlp_extraction",
        label: "NLP_EXTRACTION",
        status: "COMPLETE",
        timestamp: nowTimestamp(),
        description: "Clinical note processed and relevant facts extracted from note.",
        detail: `${extraction.facts?.length || 0} facts extracted`,
    },
    {
        id: "policy_lookup",
        label: "POLICY_LOOKUP",
        status: "COMPLETE",
        timestamp: nowTimestamp(),
        description: "Policy requirements retrieved.",
        detail: `${request.policyRequirements.length} requirements retrieved`,
    },
    {
        id: "requirement_eval",
        label: "REQUIREMENT_EVAL",
        status: notMetCount > 0 || ambiguousCount > 0 || notDocumentedCount > 0 ? "WARNING" : "COMPLETE",
        timestamp: nowTimestamp(),
        description: "Policy requirements evaluated against extracted facts.",
        detail: `${metCount} Met - ${ambiguousCount} Ambiguous - ${notMetCount} Not Met - ${notDocumentedCount} Not Documented`,
    },
    {
      id: "confidence_scoring",
      label: "CONFIDENCE_SCORING",
      status: "COMPLETE",
      timestamp: nowTimestamp(),
      description: "Confidence score computed",
      detail: `Score ${confidence}%`,
    },
    {
      id: "verdict_issued",
      label: "VERDICT_ISSUED",
      status: decision === "SUPPORTED" ? "COMPLETE" : "WARNING",
      timestamp: nowTimestamp(),
      description: "Audit recommendation finalized",
      detail: decision,
    },
  ];

  return {
    runId, decision, confidence,
    billingCode: request.billingCode,
    policyReference: `${request.policyId} - ${request.policyTitle}`,
    requirementChecks: checks,
    missingDocumentation: audit.missingDocumentation || [],
    extractedFacts: extraction.facts || [],
    auditTrail,
    runAt: new Date().toISOString(),
    rawAgentOutput: {
        model: process.env.BRAIN_MODEL || "llama-3.3-70b-versatile",
        runId,
        input: {
            billingCode: request.billingCode,
            policyId: request.policyId,
            noteLength: request.clinicalNote.length,
        },
        extraction,
        audit,
        decision,
        confidence,
    },
  };
}

