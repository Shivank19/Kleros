export type AuditDecision = 'SUPPORTED' | 'NOT_SUPPORTED' | 'NEEDS_HUMAN_REVIEW';

export type RequirementStatus = 'MET' | 'NOT_MET' | 'AMBIGUOUS' | 'NOT_DOCUMENTED';

export type ClinicalFact = {
  label: string; 
  value: string;
  evidence: string;
}

export type PolicyRequirementCheck = {
  id: string;
  requirement: string;
  status: RequirementStatus;
  evidence: string;
  explanation: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
}

export type MissingDocumentation = {
  id: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  title: string;
  recommendation: string;
}

export type AuditTrailStep = {
  id: string;
  label: string;
  status: "COMPLETE" | "WARNING" | "ERROR";
  timestamp: string;
  description: string;
  detail?: string;
};

export type AuditResult = {
  runId: string;
  decision: AuditDecision;
  confidence: number;
  summary: string;
  billingCode: string;
  policyReference: string;
  requirementChecks: PolicyRequirementCheck[];
  missingDocumentation: MissingDocumentation[];
  extractedFacts: ClinicalFact[];
  auditTrail: AuditTrailStep[];
  rawOutput: unknown;
};

export type AuditRequest = {
  clinicalNote: string;
  billingCode: string;
  billingCodeDescription?: string;
  policyId: string;
  policyTitle: string;
  policyRequirements: string[];
};