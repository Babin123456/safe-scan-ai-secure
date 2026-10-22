export type FamilyMember = {
  id: string;
  name: string;
  emoji: string;
  relation: string;
  phone?: string;
  on: boolean;
  guardian: boolean;
};

export type EmergencyAlertLog = {
  id: string;
  timestamp: number;
  memberName: string;
  threatHeadline: string;
  status: "dispatched" | "acknowledged";
};

const FAMILY_KEY = "safescan-family-members-v1";
const ALERTS_KEY = "safescan-family-alerts-v1";

const DEFAULT_MEMBERS: FamilyMember[] = [
  { id: "m1", name: "Grandma", emoji: "👵", relation: "Uses WhatsApp & UPI daily", phone: "+919876543210", on: true, guardian: false },
  { id: "m2", name: "Grandpa", emoji: "👴", relation: "Receives bank SMS alerts", phone: "+919876543211", on: true, guardian: false },
  { id: "m3", name: "Mom", emoji: "👩", relation: "Pays shop QRs regularly", phone: "+919876543212", on: false, guardian: true },
];

export function getFamilyMembers(): FamilyMember[] {
  if (typeof window === "undefined") return DEFAULT_MEMBERS;
  try {
    const raw = localStorage.getItem(FAMILY_KEY);
    if (!raw) return DEFAULT_MEMBERS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_MEMBERS;
  } catch {
    return DEFAULT_MEMBERS;
  }
}

export function saveFamilyMembers(members: FamilyMember[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(FAMILY_KEY, JSON.stringify(members));
  } catch {
    /* ignore */
  }
}

export function getAlertLogs(): EmergencyAlertLog[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(ALERTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function recordAlertLog(log: Omit<EmergencyAlertLog, "id" | "timestamp">): EmergencyAlertLog {
  const newLog: EmergencyAlertLog = {
    ...log,
    id: `alt-${Date.now()}`,
    timestamp: Date.now(),
  };

  if (typeof window !== "undefined") {
    try {
      const existing = getAlertLogs();
      const updated = [newLog, ...existing].slice(0, 20);
      localStorage.setItem(ALERTS_KEY, JSON.stringify(updated));
    } catch {
      /* ignore */
    }
  }

  return newLog;
}

export function generateWhatsAppAlertUrl(guardianPhone: string | undefined, elderName: string, threat: string): string {
  const message = encodeURIComponent(
    `🚨 SafeScan Family Urgent Alert!\n\nA high-risk scam threat was detected on ${elderName}'s device.\nThreat: ${threat}\n\nPlease contact them immediately and ensure they do NOT click any links, share OTPs, or transfer money.`
  );
  const cleanPhone = (guardianPhone ?? "").replace(/\D/g, "");
  return cleanPhone
    ? `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${message}`
    : `https://api.whatsapp.com/send?text=${message}`;
}
