export function extractorPrompt(clinicalNote: string){
    return `
        You are a clinical documentation extraction assistant.

        Your task:
        Extract only facts explicitly documented in the clinical note.
        Do not infer facts that are not stated.
        For every fact, include supporting evidence copied from the note.

        Return JSON only.

        Clinical note:
        """
        ${clinicalNote}
        """
        Return this structure:
        {
        "facts": [
            {
            "label": "string",
            "value": "string",
            "evidence": "exact supporting sentence or phrase from note"
            }
        ]
        }
    `
}

export function auditorPrompt(args: {
    clinicalNote: string;
    billingCode: string;
    policyTitle: string;
    policyRequirements: string[];
    extractedFacts: unknown;
}){
    return `
        You are a healthcare payment integrity auditor.
        Your task:
        Compare the extracted clinical facts against the policy requirements for the submitted billing code.

        Important Rules:
        - Use only the clinical note, extracted facts, and policy requirements provided.
        - Do not invent or assume any missing documentation.
        - If evidence is unclear, mark the requirement as AMBIGUOUS.
        - If evidence is absent, mark the requirement as NOT_DOCUMENTED.
        - If the evidence contradicts the requirement, mark it as NOT_MET.
        - If the evidence clearly satisfies the requirement, mark it as MET.
        - Return JSON only.

        Billing code:
        ${args.billingCode}

        Policy:
        ${args.policyTitle}

        Policy requirements:
        ${args.policyRequirements
        .map((requirement, index) => `${index + 1}. ${requirement}`)
        .join("\n")}

        Extracted facts:
        ${JSON.stringify(args.extractedFacts, null, 2)}

        Clinical note:
        """
        ${args.clinicalNote}
        """
        
        Return this structure:
        {
        "checks": [
            {
            "id": "PR-01",
            "requirement": "string",
            "status": "MET | NOT_MET | AMBIGUOUS | NOT_DOCUMENTED",
            "evidence": "supporting evidence from note, or empty string",
            "explanation": "brief explanation",
            "severity": "LOW | MEDIUM | HIGH"
            }
        ],
        "missingDocumentation": [
            {
            "id": "MD-01",
            "severity": "LOW | MEDIUM | HIGH",
            "title": "string",
            "recommendation": "string"
            }
        ],
        "summary": "brief audit summary"
        }
    `
}