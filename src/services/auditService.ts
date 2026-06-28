import type {AuditRequest, AuditResult} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string || 'http://localhost:3000';

export async function runLiveAudit(payload: AuditRequest): Promise<AuditResult> {

    const response = await fetch(`${API_BASE_URL}/api/audit`, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify(payload),
    });

    if(!response.ok){
        const errorText = await response.text();
        throw new Error(`Failed to run live audit: ${errorText}`);
    }

    return response.json();
}