/**
 * NPCI UPI Specification Validator & Threat Analyzer
 * Validates virtual payment addresses (VPA), handles, merchant codes,
 * and detects UPI "collect-request" reverse debits.
 */

export const KNOWN_UPI_HANDLES = new Set([
  "okaxis", "oksbi", "okhdfcbank", "okicici", "ybl", "ibl", "axl", "paytm",
  "apl", "upi", "sbi", "hdfcbank", "icici", "axisbank", "kotak", "pnb", "boi",
  "cnrb", "barodampay", "fbl", "yesbank", "idfcbank", "indus", "federal",
  "aubank", "postbank", "ikwik", "freecharge", "jupiteraxis", "slc", "waaxis",
  "wahdfcbank", "wasbi", "waicici", "airtel", "slice"
]);

export type UpiValidationResult = {
  isValidVpa: boolean;
  handleProvider: string;
  isRegisteredProvider: boolean;
  isCollectRequest: boolean;
  warnings: string[];
  riskPenalty: number;
};

export function validateUpiPayload(
  vpa: string,
  merchantName: string,
  rawPayload: string
): UpiValidationResult {
  const warnings: string[] = [];
  let riskPenalty = 0;

  const cleanVpa = vpa.trim().toLowerCase();
  const vpaParts = cleanVpa.split("@");
  const username = vpaParts[0] ?? "";
  const handle = vpaParts[1] ?? "";

  const isValidVpa = Boolean(cleanVpa && vpaParts.length === 2 && username.length >= 2 && handle.length >= 2);
  const isRegisteredProvider = KNOWN_UPI_HANDLES.has(handle);

  if (!isValidVpa) {
    warnings.push("Malformed or missing UPI virtual payment address");
    riskPenalty += 40;
  } else if (!isRegisteredProvider) {
    warnings.push(`Unrecognized or non-standard UPI handle (@${handle})`);
    riskPenalty += 20;
  }

  // Detect collect mode / payment request disguised as receiving money
  const isCollectRequest =
    /mode=02|mode=04/i.test(rawPayload) ||
    /collect|request|debit/i.test(merchantName) ||
    /collect/i.test(rawPayload);

  if (isCollectRequest) {
    warnings.push("⚠️ Collect request detected: This will DEBIT money from your account, not credit it");
    riskPenalty += 55;
  }

  // Detect bank impersonation in VPA handle without official bank registration
  const bankNames = ["sbi", "hdfc", "icici", "axis", "kotak", "pnb"];
  const claimsBankInMerchant = bankNames.some((b) => merchantName.toLowerCase().includes(b));
  const isBankInHandle = bankNames.some((b) => handle.includes(b));

  if (claimsBankInMerchant && !isBankInHandle && !isRegisteredProvider) {
    warnings.push("Merchant claims to be a bank but UPI handle does not belong to any official banking PSP");
    riskPenalty += 45;
  }

  // Auto-generated numerical / random usernames
  if (/^\d{8,}$/.test(username) || /^[a-z]{1,3}\d{6,}$/.test(username)) {
    warnings.push("Payment handle uses auto-generated disposable numbers rather than an established merchant VPA");
    riskPenalty += 25;
  }

  return {
    isValidVpa,
    handleProvider: handle,
    isRegisteredProvider,
    isCollectRequest,
    warnings,
    riskPenalty,
  };
}
