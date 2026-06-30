# Kleros

### Evidence-backed claim review for trusted healthcare payment decisions

**Kleros** is an AI-assisted claim auditing proof of concept for healthcare payment integrity. It helps reviewers compare clinical documentation against billing and payer policy requirements, then produces an evidence-backed audit trail for human review.

Kleros shows how AI can support healthcare payment integrity by turning clinical documentation review into a structured, evidence-backed workflow. The key artifact is the auditable decision trace, which shows the extracted facts, requirement-level checks, missing documentation and deterministic final recommendation.

> Synthetic data only. AI-generated recommendation.

---

## Overview

When a provider submits a claim, the clinical note must support the billed service under payer policy requirements. Human auditors often need to read the note, interpret the policy, identify missing documentation and then decide whether the claim is supported.

Kleros demonstrates a lightweight workflow for that process:

1. **Ingest** a clinical note, billing code and policy/LCD.
2. **Extract** structured clinical facts from the note.
3. **Evaluate** each policy requirement against the extracted facts.
4. **Classify** each requirement as `MET`, `NOT_MET`, `AMBIGUOUS` or `NOT_DOCUMENTED`.
5. **Derive** the final recommendation using deterministic logic.
6. **Display** an evidence-backed audit trail for human review.

The LLM does not make an unbounded payment decision. It performs fact extraction and requirement-level comparison. The final decision is derived by transparent business logic.

## Notes

- Uses synthetic data only.
- Does not process real PHI.
- Does not make final payment or denial decisions.
- Does not replace professional clinical or claims review.
- LLM output may vary and must be reviewed by a human.
- Simplified policy requirements are used for demonstration.

---

## Core Decision Logic

Kleros uses canonical internal labels:

```text
Decision:
SUPPORTED
NOT_SUPPORTED
NEEDS_HUMAN_REVIEW

Requirement Status:
MET
NOT_MET
AMBIGUOUS
NOT_DOCUMENTED
```

The final recommendation is determined as:

```ts
if any requirement is NOT_MET:
  decision = NOT_SUPPORTED

else if any requirement is AMBIGUOUS or NOT_DOCUMENTED:
  decision = NEEDS_HUMAN_REVIEW

else:
  decision = SUPPORTED
```

This keeps the final recommendation explainable and consistent.

---

## Tech Stack

### Frontend

- Vite
- React
- TypeScript
- Material UI

### Backend

- Node.js
- Express for local development
- Vercel Functions for production API routes
- TypeScript
- Llama3.3-70B / Qwen3-32B

### LLM Configuration

The backend uses generic environment variables so the model provider can be changed without rewriting the pipeline:

```env
BRAIN_API_KEY=
BRAIN_MODEL=llama-3.3-70b-versatile
BRAIN_BASE_URL=https://api.groq.com/openai/v1
```

---

## Environment Variables

Create a local `.env` file in the project root.

```env
# Frontend
VITE_API_BASE_URL=http://localhost:3001
VITE_USE_MOCK_AUDIT=false

# Backend
PORT=3001
BRAIN_API_KEY={your_groq_api_key_here}
BRAIN_MODEL=llama-3.3-70b-versatile
BRAIN_BASE_URL=https://api.groq.com/openai/v1
```

For Vercel, omit `VITE_API_BASE_URL` or leave it empty. The deployed frontend calls same-origin API routes such as `/api/audit`.

---

## Running Locally

Installation

```bash
npm install
```

If needed:

```bash
npm install express cors dotenv openai zod
npm install -D tsx concurrently @types/node @types/express @types/cors
```

Start both the frontend and backend:

```bash
npm run dev
```

Local URLs:

```text
Frontend: http://localhost:5173
Backend:  http://localhost:3001
```

Check backend health:

```bash
curl http://localhost:3001/api/health
```

Expected response:

```json
{
  "status": "ok",
  "service": "kleros-audit-api",
  "model": "llama-3.3-70b-versatile",
  "baseUrl": "https://api.groq.com/openai/v1",
  "hasBrainKey": true
}
```

---

## Deploying To Vercel

Kleros is prepared for a single Vercel deployment:

- Vite builds the React frontend into `dist`.
- `api/health.ts` exposes `GET /api/health`.
- `api/audit.ts` exposes `POST /api/audit`.
- The existing `server/pipeline/*` files are reused by the Vercel API route.
- `server/index.ts` remains available for local Express development.

Vercel project settings:

```text
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
```

Add these environment variables in Vercel:

```env
BRAIN_API_KEY=your_groq_api_key_here
BRAIN_MODEL=llama-3.3-70b-versatile
BRAIN_BASE_URL=https://api.groq.com/openai/v1
VITE_USE_MOCK_AUDIT=false
```

Do not set `VITE_API_BASE_URL` on Vercel unless the API is deployed separately. Leaving it empty makes the frontend call the Vercel functions on the same domain.

After deployment, verify:

```text
https://your-app.vercel.app/api/health
```

---

## API

### `GET /api/health`

Returns backend health and model configuration status.

### `POST /api/audit`

Request body:

```json
{
  "clinicalNote": "Patient presented with shortness of breath...",
  "billingCode": "CPT 99285 - ED Visit, Level 5",
  "policyId": "LCD L34559",
  "policyTitle": "Emergency Medicine",
  "policyRequirements": [
    "Chief complaint must be documented.",
    "Relevant diagnosis must be documented.",
    "Medical decision making must support high-complexity emergency department care."
  ]
}
```

Response shape:

```ts
type AuditResult = {
  runId: string;
  decision: "SUPPORTED" | "NOT_SUPPORTED" | "NEEDS_HUMAN_REVIEW";
  confidence: number;
  billingCode: string;
  policyReference: string;
  runAt: string;
  requirementChecks: PolicyRequirementCheck[];
  missingDocumentation: MissingDocumentation[];
  extractedFacts: ClinicalFact[];
  auditTrail: AuditTrailStep[];
  rawAgentOutput: unknown;
};
```

---

## Future Work

Kleros is currently implemented as a bounded, human-in-the-loop LLM audit pipeline. The prototype focuses on evidence extraction, requirement-level policy comparison, deterministic decision logic, and an auditable review trail. Future versions could extend this into a more agentic and production-ready payment integrity platform.

### 1. Policy Retrieval Agent

The current prototype uses a predefined set of simplified policy requirements. A future version could include a policy retrieval agent that automatically searches payer policies, LCDs, NCDs, coding guidance, and contract rules based on the submitted billing code.

This would allow the system to move from manually selected requirements to dynamic policy grounding.

Potential capabilities:

- Retrieve relevant policy sections for a selected CPT, ICD, or HCPCS code.
- Identify documentation requirements from payer policy text.
- Show source citations for each retrieved rule.
- Compare policies across payers or contract versions.

### 2. Evidence Verification Agent

The current system asks the LLM to evaluate each policy requirement against the clinical note. A future verifier agent could independently re-check every requirement marked as `MET` and confirm that the cited evidence actually appears in the source note.

This would reduce hallucination risk and improve reviewer trust.

Potential capabilities:

- Verify that each requirement has direct source evidence.
- Flag unsupported or weak evidence.
- Detect when the model inferred a fact that was not documented.
- Require stronger evidence for high-risk or high-dollar claims.

### 3. Human Feedback Loop

The current prototype produces an AI-generated recommendation for human review. A future version could capture auditor decisions and use them to improve future reviews.

Potential capabilities:

- Record whether auditors agree or disagree with the recommendation.
- Capture override reasons.
- Track recurring documentation gaps.
- Improve prompts, rule weights, and review routing based on feedback.
- Build a reviewer-facing learning loop without allowing the model to make final payment decisions.

### 4. Provider and Claim Pattern Analysis

Kleros could be extended beyond single-claim review into pattern recognition across claims, providers, codes, or time periods.

Potential capabilities:

- Cluster claims by provider, billing code, denial reason, or documentation gap.
- Detect repeated unsupported high-level billing patterns.
- Identify providers with unusually high rates of ambiguous documentation.
- Surface operational trends for payment integrity teams.

### 5. Time-Series Anomaly Detection

A future analytics layer could monitor claim volume and billing behavior over time.

Potential capabilities:

- Detect sudden increases in high-complexity claims.
- Identify unusual shifts in CPT or diagnosis code distribution.
- Flag spikes in claims requiring human review.
- Support operational dashboards for payment integrity monitoring.

### 6. RAG-Based Policy Grounding

The current version uses simplified structured policy requirements. A future version could add retrieval-augmented generation over a controlled policy knowledge base.

Potential capabilities:

- Store policy documents in a searchable index.
- Retrieve only the most relevant policy sections for each claim.
- Ground requirement checks in cited policy text.
- Reduce reliance on prompt-only policy interpretation.

### 7. Multi-Model Orchestration

Different models may perform better at different stages of the workflow. Future versions could route tasks to specialized models.

Potential capabilities:

- Use a fast model for initial extraction.
- Use a stronger reasoning model for requirement evaluation.
- Use a verifier model for evidence validation.
- Compare model outputs and route disagreements to human review.

### 8. Safer Agentic Workflow

The current system is intentionally not a fully autonomous claim adjudication agent. A future version could introduce bounded agentic behavior while keeping humans in control.

Potential capabilities:

- A retrieval agent to gather policy context.
- An extraction agent to structure clinical evidence.
- An auditor agent to evaluate requirements.
- A verifier agent to check evidence quality.
- A routing agent to decide whether the claim should be escalated.
- A human reviewer as the final authority.

The goal would be faster, more consistent and a more transparent human review, not autonomous denial or payment.

### 9. Production Governance and Compliance Controls

The current POC uses synthetic data only and is not intended for production use. A production version would require privacy, security, and governance controls.
