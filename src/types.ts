export type VerdictStatus = 'Supported' | 'Not Supported' | 'Needs Human Review';

export type RequirementStatus = 'Met' | 'Not Met' | 'Ambiguous';

export type MissingSeverity = 'High' | 'Medium' | 'Low';

export type AuditTrailStatus = 'Complete' | 'Running' | 'Pending' | 'Warning';

export interface PolicyRequirement {
  id: string;
  label: string;
  status: RequirementStatus;
  evidence: string;
}

export interface MissingDoc {
  id: string;
  severity: MissingSeverity;
  item: string;
  recommendation: string;
}

export interface ClinicalFact {
  label: string;
  value: string;
}

export interface AuditTrailNode {
  id: string;
  icon: string;
  action: string;
  label: string;
  status: AuditTrailStatus;
  timestamp: string;
  detail: string;
}

export interface AuditResult {
  verdict: VerdictStatus;
  confidence: number;
  billingCode: string;
  policyRef: string;
  runAt: string;
  policyRequirements: PolicyRequirement[];
  missingDocumentation: MissingDoc[];
  clinicalFacts: ClinicalFact[];
  auditTrail: AuditTrailNode[];
  rawAgentOutput: Record<string, unknown>;
}
