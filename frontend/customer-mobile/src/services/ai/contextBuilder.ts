/**
 * Builds dynamic, grounded user context for PharmaBot AI.
 * Injects user's saved medicine cabinet, scan history, and active safety alerts
 * directly into the LLM system prompt to eliminate hallucinations.
 */

import { SavedMedicine } from '../../types';
import { ScanHistoryRecord } from '../../store/customerStore';
import { SAFETY_ALERTS } from '../../data/customerData';
import { getBaseSystemPrompt, MEDICAL_DISCLAIMER } from './guardrails';

export interface UserContextParams {
  userName?: string;
  savedMedicines: SavedMedicine[];
  scanHistory: ScanHistoryRecord[];
}

export function buildSystemPromptWithContext(params: UserContextParams): string {
  const { userName = 'Verified Patient', savedMedicines, scanHistory } = params;

  // 1. Format Saved Medicines
  let medicineSummary = "No medicines currently saved in cabinet.";
  if (savedMedicines.length > 0) {
    medicineSummary = savedMedicines
      .map((m, idx) => {
        return `[Item ${idx + 1}]
- Brand Name: ${m.name}
- Generic Name: ${m.genericName || 'N/A'}
- Dosage: ${m.dosage || 'Standard'}
- Batch Number: ${m.batchNumber}
- Manufacturer: ${m.manufacturer || 'Certified Producer'}
- Status: ${m.status} (Safety Score: ${m.safetyScore ?? 95}/100)
- Expiry Date: ${m.expiryDate} (${m.daysToExpiry} days remaining)
- Category: ${m.category || 'General'}
- Instructions: ${m.instructions || 'Follow doctor advice'}`;
      })
      .join('\n\n');
  }

  // 2. Format Recent Scans
  let scanSummary = "No recent QR scans recorded.";
  if (scanHistory.length > 0) {
    scanSummary = scanHistory
      .slice(0, 5) // Most recent 5
      .map((s, idx) => {
        return `[Scan ${idx + 1}]
- Medicine: ${s.name} (${s.genericName || 'N/A'})
- Pack ID: ${s.packId}
- Batch: ${s.batchNumber}
- Manufacturer: ${s.manufacturer}
- Verification Status: ${s.status} (Trust Score: ${s.trustScore}/100)
- Scanned At: ${s.scannedAt}
- Location: ${s.location || 'Local Dispensary'}`;
      })
      .join('\n\n');
  }

  // 3. Format Active Alerts
  const alertSummary = SAFETY_ALERTS.map(
    (a) => `- [${a.severity.toUpperCase()}] ${a.title}: ${a.summary} (Affected: ${a.affectedBatches.join(', ')})`
  ).join('\n');

  const contextSection = `
=== VERIFIED USER & APP ACTIVITY CONTEXT ===
Active User: ${userName}

--- SAVED MEDICINES IN CABINET (${savedMedicines.length} items) ---
${medicineSummary}

--- RECENT QR SCAN HISTORY (${scanHistory.length} total) ---
${scanSummary}

--- ACTIVE CDSCO / REGULATORY ALERTS ---
${alertSummary}
=== END OF USER CONTEXT ===

REMINDER: Cite the above data precisely when responding to user activity queries. If a requested drug or batch is not listed, notify the user that no such record exists in their PharmaChain account.`;

  return `${getBaseSystemPrompt()}\n\n${contextSection}`;
}
