/**
 * Universal QR Payload Decoder
 * Supports WiFi configuration, vCard digital contacts, UPI payments,
 * web URLs, and plain text with threat indicators.
 */

export type QrPayloadType = "upi" | "wifi" | "vcard" | "url" | "text";

export type ParsedQrPayload = {
  type: QrPayloadType;
  label: string;
  icon: string;
  summary: string;
  details: { label: string; value: string }[];
  isSecuritySensitive: boolean;
  securityRecommendation: string;
};

export function parseQrPayload(raw: string): ParsedQrPayload {
  const trimmed = raw.trim();

  // 1. WiFi Configuration QR
  if (/^WIFI:/i.test(trimmed)) {
    const ssidMatch = trimmed.match(/S:([^;]+);/i);
    const typeMatch = trimmed.match(/T:([^;]+);/i);
    const passMatch = trimmed.match(/P:([^;]+);/i);
    const hiddenMatch = trimmed.match(/H:([^;]+);/i);

    const ssid = ssidMatch?.[1] ?? "Hidden SSID";
    const authType = typeMatch?.[1] ?? "WPA/WPA2";
    const hasPassword = Boolean(passMatch?.[1]);

    return {
      type: "wifi",
      label: "Wi-Fi Network Configuration",
      icon: "📶",
      summary: `Wi-Fi Network: ${ssid}`,
      details: [
        { label: "Network Name (SSID)", value: ssid },
        { label: "Authentication Type", value: authType },
        { label: "Security Status", value: authType.toUpperCase() === "NOPASS" ? "Open (Unencrypted)" : "Password Protected" },
        { label: "Hidden Network", value: hiddenMatch?.[1] === "true" ? "Yes" : "No" },
      ],
      isSecuritySensitive: authType.toUpperCase() === "NOPASS",
      securityRecommendation:
        authType.toUpperCase() === "NOPASS"
          ? "Caution: Open unencrypted Wi-Fi hotspots can allow attackers on the same network to intercept unencrypted traffic."
          : "Verify you are at the physical venue of this Wi-Fi before connecting.",
    };
  }

  // 2. Contact Card (vCard / MeCard)
  if (/^(BEGIN:VCARD|MECARD:)/i.test(trimmed)) {
    const fnMatch = trimmed.match(/FN:([^\r\n;]+)/i) || trimmed.match(/N:([^\r\n;]+)/i);
    const telMatch = trimmed.match(/TEL[^:]*:([^\r\n;]+)/i);
    const emailMatch = trimmed.match(/EMAIL[^:]*:([^\r\n;]+)/i);
    const orgMatch = trimmed.match(/ORG:([^\r\n;]+)/i);

    const name = fnMatch?.[1]?.trim() ?? "Unnamed Contact";
    const tel = telMatch?.[1]?.trim() ?? "None provided";
    const email = emailMatch?.[1]?.trim() ?? "None provided";
    const org = orgMatch?.[1]?.trim();

    return {
      type: "vcard",
      label: "Contact Card (vCard)",
      icon: "📇",
      summary: `Contact: ${name}`,
      details: [
        { label: "Full Name", value: name },
        { label: "Phone Number", value: tel },
        { label: "Email Address", value: email },
        ...(org ? [{ label: "Organization", value: org }] : []),
      ],
      isSecuritySensitive: false,
      securityRecommendation: "Check phone number and email validity before saving new unknown contacts to your address book.",
    };
  }

  // 3. UPI Payment QR
  if (/^upi:\/\//i.test(trimmed) || /^[\w.-]+@[a-z0-9]+$/i.test(trimmed) || /pa=[\w.-]+@/i.test(trimmed)) {
    let pa = "";
    let pn = "";
    let am = "";
    try {
      const q = trimmed.includes("?") ? trimmed.slice(trimmed.indexOf("?") + 1) : "";
      const params = new URLSearchParams(q);
      pa = params.get("pa") ?? "";
      pn = params.get("pn") ?? "Unknown Merchant";
      am = params.get("am") ?? "";
    } catch {
      pa = trimmed;
    }
    return {
      type: "upi",
      label: "UPI Payment Request",
      icon: "💳",
      summary: pn ? `Payment to ${pn}` : "Direct UPI payment transfer",
      details: [
        { label: "Payee / Merchant", value: pn || "Unspecified" },
        { label: "UPI VPA Handle", value: pa || "Not specified" },
        { label: "Pre-filled Amount", value: am ? `₹${am}` : "User enters amount" },
      ],
      isSecuritySensitive: true,
      securityRecommendation:
        "Never enter your UPI PIN to receive money. UPI PIN is solely required when debiting money from your account.",
    };
  }

  // 4. Web URL
  if (/^https?:\/\//i.test(trimmed) || /^[a-z0-9-]+\.[a-z]{2,}/i.test(trimmed)) {
    return {
      type: "url",
      label: "Web Destination URL",
      icon: "🔗",
      summary: trimmed.slice(0, 60),
      details: [
        { label: "Target URL", value: trimmed },
        { label: "Protocol", value: /^https:/i.test(trimmed) ? "HTTPS (Encrypted)" : "HTTP / Unencrypted" },
      ],
      isSecuritySensitive: true,
      securityRecommendation: "Always verify destination domain spelling and SSL certificate before typing any credentials.",
    };
  }

  // 5. Plain Text
  return {
    type: "text",
    label: "Plain Text Content",
    icon: "📄",
    summary: trimmed.slice(0, 50) + (trimmed.length > 50 ? "..." : ""),
    details: [
      { label: "Length", value: `${trimmed.length} characters` },
      { label: "Preview", value: trimmed.slice(0, 100) },
    ],
    isSecuritySensitive: false,
    securityRecommendation: "Plain text payload. Check for coercive instructions or instructions to dial unknown codes.",
  };
}
