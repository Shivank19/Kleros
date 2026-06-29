import type { AuditDecision, PolicyRequirementCheck } from "../../src/types";

export function deriveDecision(checks: PolicyRequirementCheck[]): AuditDecision {
    const hasNotMet = checks.some((check) => check.status === "NOT_MET");
    const hasUnclear = checks.some(
        (check) => check.status === "AMBIGUOUS" || check.status === "NOT_DOCUMENTED"
    );

    if (hasNotMet) {
        return "NOT_SUPPORTED";
    }

    if(hasUnclear){
        return "NEEDS_HUMAN_REVIEW";
    }

    return "SUPPORTED";
}
