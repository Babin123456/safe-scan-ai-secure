export type ScamCategory =
  | "electricity_disconnection"
  | "sim_telecom_block"
  | "fake_challan_fine"
  | "job_telegram_task"
  | "apk_malware_lure"
  | "courier_customs_hold"
  | "digital_arrest_police"
  | "pan_kyc_freeze";

export type HinglishPatternMatch = {
  category: ScamCategory;
  categoryLabel: string;
  matchedPhrases: string[];
  severity: "critical" | "warning";
  explanation: string;
};

const HINGLISH_LURE_RULES: {
  category: ScamCategory;
  label: string;
  severity: "critical" | "warning";
  explanation: string;
  keywords: string[];
}[] = [
  {
    category: "electricity_disconnection",
    label: "Electricity Cut-Off Scam (Bijli Bill)",
    severity: "critical",
    explanation: "Scammers claim your power supply will be cut tonight unless you call a personal 10-digit number or pay via an unverified link.",
    keywords: [
      "bijli", "electricity will be disconnected", "cut ho jayega", "power disconnected tonight",
      "bill update kare", "officer number", "previous month bill not updated", "line cut kar di jayegi",
      "9:30 pm", "power office", "substation"
    ],
  },
  {
    category: "sim_telecom_block",
    label: "SIM Deactivation / DoT Block Scam",
    severity: "critical",
    explanation: "Threatens that your SIM card or telecom service will be disconnected within hours unless verification is completed.",
    keywords: [
      "sim block ho jayega", "sim deactivation", "sim blocked within 24 hours", "trai",
      "telecom verification", "aadhar link kare", "sim suspend", "esim update"
    ],
  },
  {
    category: "fake_challan_fine",
    label: "Traffic Police / E-Challan Fake Notice",
    severity: "critical",
    explanation: "Impersonates traffic police sending a fake challan notice with a link downloading a malicious APK or stealing banking credentials.",
    keywords: [
      "challan", "echallan", "traffic police fine", "parivahan notice", "court summon",
      "fine pay kare", "vahan registration penalty"
    ],
  },
  {
    category: "job_telegram_task",
    label: "Work from Home / Telegram Task Fraud",
    severity: "critical",
    explanation: "Promises high daily income (₹2000-₹5000/day) for YouTube video likes, Google Map ratings, or hotel reviews, leading to investment traps.",
    keywords: [
      "part time job", "work from home", "ghar baithe", "earn 2000 daily", "youtube like",
      "telegram task", "daily income", "per day 3000", "hr manager", "freelance task"
    ],
  },
  {
    category: "apk_malware_lure",
    label: "Malicious APK Install Trap",
    severity: "critical",
    explanation: "Prompts the recipient to download an Android APK file (e.g. via WhatsApp or SMS link) which installs spyware to steal SMS OTPs.",
    keywords: [
      ".apk", "download app", "install kare", "pm-yojana.apk", "sbi-rewards.apk",
      "update-app.apk", "rewards.apk", "cashback.apk", "apk file"
    ],
  },
  {
    category: "courier_customs_hold",
    label: "Postal / Customs Package Hold Scam",
    severity: "warning",
    explanation: "Claims an India Post or courier parcel is held due to incomplete address and demands a nominal ₹5 or ₹25 re-delivery fee to steal card credentials.",
    keywords: [
      "india post", "parcel hold", "address update required", "package delayed",
      "redelivery fee", "customs hold", "courier tracking"
    ],
  },
  {
    category: "digital_arrest_police",
    label: "Digital Arrest / Law Enforcement Impersonation",
    severity: "critical",
    explanation: "Falsely alleges money laundering, narcotic parcel confiscation, or CBI/ED investigation demanding immediate video call compliance.",
    keywords: [
      "digital arrest", "cbi", "narcotics department", "money laundering case",
      "mumbai police", "cyber cell warrant", "arrest warrant", "ed inquiry"
    ],
  },
  {
    category: "pan_kyc_freeze",
    label: "PAN-Aadhaar Linking / Bank Freeze Threat",
    severity: "critical",
    explanation: "Urges immediate PAN/Aadhaar re-validation with claims that the bank account or debit card has been frozen.",
    keywords: [
      "pan update", "aadhar link", "account frozen", "band ho jayega", "turant update kare",
      "netbanking blocked", "kyc expire", "sbi yono blocked"
    ],
  },
];

export function detectHinglishScamPatterns(rawText: string): HinglishPatternMatch[] {
  const lower = rawText.toLowerCase();
  const matches: HinglishPatternMatch[] = [];

  for (const rule of HINGLISH_LURE_RULES) {
    const hits = rule.keywords.filter((kw) => lower.includes(kw));
    if (hits.length > 0) {
      matches.push({
        category: rule.category,
        categoryLabel: rule.label,
        matchedPhrases: hits,
        severity: rule.severity,
        explanation: rule.explanation,
      });
    }
  }

  return matches;
}

export type TokenHighlight = {
  text: string;
  type: "threat" | "lure" | "link" | "normal";
  note?: string;
};

export function tokenizeMessageForHighlight(rawText: string): TokenHighlight[] {
  // Regex to extract URLs, phone numbers, and common lure terms
  const urlRegex = /https?:\/\/[^\s]+|[a-z0-9-]+\.(?:com|org|in|top|xyz|cc|me|tk|vip|apk)(?:\/[^\s]*)?/gi;
  const criticalThreats = /(?:disconnected|cut ho jayega|block ho jayega|blocked|suspended|frozen|arrest|fine|penalty|court summon|challan)/gi;
  const lures = /(?:kyc|update|reward|cashback|lottery|earn|income|free|apk|telegram|winner|₹\s*\d+|rs\.?\s*\d+)/gi;

  const tokens: TokenHighlight[] = [];
  const words = rawText.split(/(\s+)/);

  for (const part of words) {
    if (!part.trim()) {
      tokens.push({ text: part, type: "normal" });
      continue;
    }

    if (urlRegex.test(part)) {
      tokens.push({ text: part, type: "link", note: "Suspicious or unverified URL link" });
    } else if (criticalThreats.test(part)) {
      tokens.push({ text: part, type: "threat", note: "Urgent threat designed to induce panic" });
    } else if (lures.test(part)) {
      tokens.push({ text: part, type: "lure", note: "Bait keyword used to entice action" });
    } else {
      tokens.push({ text: part, type: "normal" });
    }
  }

  return tokens;
}
