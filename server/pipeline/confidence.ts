import type { PolicyRequirementCheck } from "../../src/types";

export function calculateConfidence(checks: PolicyRequirementCheck[]) {
    if(checks.length === 0)
        return 0;

    let score = 95;
    for(const check of checks){
        if(check.status === "AMBIGUOUS")
            score -= 12;
        if(check.status === "NOT_DOCUMENTED")
            score -= 18;
        if(check.status === "NOT_MET")
            score -= 28;
    }

    return Math.max(5, Math.min(95, score));

}
