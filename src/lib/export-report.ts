import type { ScanEntry } from "./store";

/**
 * Forensic Report Exporter
 * Generates downloadable JSON and CSV summaries for submission
 * to India Cybercrime Reporting Portal (cybercrime.gov.in) and bank helplines.
 */

export function exportScansAsJson(scans: ScanEntry[]): void {
  const payload = {
    exportedAt: new Date().toISOString(),
    generator: "SafeScan AI Forensic Exporter v1.0",
    totalIncidents: scans.length,
    incidents: scans.map((s) => ({
      incidentId: s.id,
      scannerType: s.kind.toUpperCase(),
      targetPayload: s.subject,
      trustScore: s.score,
      riskLevel: s.level.toUpperCase(),
      timestampIso: new Date(s.at).toISOString(),
    })),
  };

  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  downloadBlob(blob, `safescan-cybercrime-evidence-${Date.now()}.json`);
}

export function exportScansAsCsv(scans: ScanEntry[]): void {
  const headers = ["ID", "Scanner Type", "Target / Payload", "Trust Score (0-100)", "Risk Severity", "Timestamp (UTC)"];
  const rows = scans.map((s) => [
    `"${s.id}"`,
    `"${s.kind.toUpperCase()}"`,
    `"${s.subject.replace(/"/g, '""')}"`,
    s.score,
    `"${s.level.toUpperCase()}"`,
    `"${new Date(s.at).toISOString()}"`,
  ]);

  const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\r\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  downloadBlob(blob, `safescan-incident-report-${Date.now()}.csv`);
}

function downloadBlob(blob: Blob, filename: string): void {
  if (typeof window === "undefined") return;
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}
