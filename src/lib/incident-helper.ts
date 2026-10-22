export type BankHotline = {
  id: string;
  name: string;
  category: "bank" | "wallet_upi" | "government";
  phone: string;
  altPhone?: string;
  website: string;
  notes: string;
};

export const EMERGENCY_HOTLINES: BankHotline[] = [
  {
    id: "national-cyber-crime",
    name: "National Cyber Crime Reporting Helpline",
    category: "government",
    phone: "1930",
    website: "https://cybercrime.gov.in",
    notes: "Operated by I4C (MHA). Call within golden hour (< 2 hours) to halt illicit fund transfers across banks.",
  },
  {
    id: "chakshu-telecom",
    name: "Chakshu (DoT Fraud Call/SMS Portal)",
    category: "government",
    phone: "1945",
    website: "https://sancharsaathi.gov.in/sfc/",
    notes: "Report suspicious WhatsApp numbers, fraudulent caller IDs, and malicious SMS senders.",
  },
  {
    id: "sbi",
    name: "State Bank of India (SBI)",
    category: "bank",
    phone: "1800111109",
    altPhone: "18004253800",
    website: "https://cms.onlinesbi.sbi/cms/",
    notes: "Dedicated 24x7 unauthorized electronic transactions reporting desk.",
  },
  {
    id: "hdfc",
    name: "HDFC Bank",
    category: "bank",
    phone: "18001600",
    altPhone: "18002664060",
    website: "https://www.hdfcbank.com",
    notes: "Press 1 immediately to block net banking, cards, and PayZapp UPI handles.",
  },
  {
    id: "icici",
    name: "ICICI Bank",
    category: "bank",
    phone: "18001080",
    website: "https://www.icicibank.com",
    notes: "Report cyber fraud to freeze debit/credit cards and iMobile access instantly.",
  },
  {
    id: "axis",
    name: "Axis Bank",
    category: "bank",
    phone: "18604195555",
    altPhone: "18605005555",
    website: "https://www.axisbank.com",
    notes: "Emergency hotline for blocking fraudulent digital debit channels.",
  },
  {
    id: "pnb",
    name: "Punjab National Bank (PNB)",
    category: "bank",
    phone: "18001802222",
    website: "https://www.pnbindia.in",
    notes: "24/7 dedicated helpline for blocking ATM cards and internet banking.",
  },
  {
    id: "gpay",
    name: "Google Pay (India Support)",
    category: "wallet_upi",
    phone: "18004190157",
    website: "https://support.google.com/pay/india",
    notes: "Report compromised Google Pay transactions and rogue collect requests.",
  },
  {
    id: "phonepe",
    name: "PhonePe Fraud Helpline",
    category: "wallet_upi",
    phone: "08068727374",
    altPhone: "02268727374",
    website: "https://support.phonepe.com",
    notes: "Report unauthorized VPA debit, merchant scam, or stolen PIN session.",
  },
  {
    id: "paytm",
    name: "Paytm Cyber Fraud Helpdesk",
    category: "wallet_upi",
    phone: "01203888388",
    website: "https://paytm.com/care",
    notes: "Instant dispute filing for unauthorized wallet and UPI transactions.",
  },
];

export type ChecklistItem = {
  id: string;
  title: string;
  action: string;
  urgency: "immediate" | "high" | "followup";
};

export const INCIDENT_CHECKLIST_TEMPLATE: ChecklistItem[] = [
  {
    id: "call-1930",
    title: "Dial 1930 Cyber Crime Helpline",
    action: "Call immediately with transaction details (Bank name, Account No, UTR/Ref No, and Date/Time).",
    urgency: "immediate",
  },
  {
    id: "block-cards-upi",
    title: "Freeze Bank Account & Cards",
    action: "Call your bank hotline to block debit/credit cards, net banking, and UPI access.",
    urgency: "immediate",
  },
  {
    id: "capture-evidence",
    title: "Take Screenshots & Evidence",
    action: "Screenshot scam SMS, WhatsApp chat, phishing URL, payment confirmation screen with UTR.",
    urgency: "high",
  },
  {
    id: "change-credentials",
    title: "Change Account Passwords & PINs",
    action: "Reset primary email password, bank login password, and UPI PINs from an uncompromised device.",
    urgency: "high",
  },
  {
    id: "file-cybercrime-fir",
    title: "File Formal Complaint on Cybercrime.gov.in",
    action: "Submit an online complaint report attaching screenshots, bank statements, and scammer details.",
    urgency: "followup",
  },
  {
    id: "chakshu-report",
    title: "Report Fraud Phone / SMS on Chakshu",
    action: "Visit sancharsaathi.gov.in/sfc/ to flag suspect mobile numbers for national telecom blacklisting.",
    urgency: "followup",
  },
];

export type ComplaintFormData = {
  victimName: string;
  victimPhone: string;
  incidentDateTime: string;
  scamCategory: string;
  financialLossAmount?: string;
  bankName?: string;
  transactionRef?: string;
  suspectDetails: string;
  incidentDescription: string;
};

export function generateFormalComplaintText(data: ComplaintFormData): string {
  const lossSection = data.financialLossAmount && Number(data.financialLossAmount) > 0
    ? `Total Financial Loss: INR ${data.financialLossAmount}\nBank / Platform: ${data.bankName || "Not specified"}\nTransaction Ref / UTR: ${data.transactionRef || "Pending Statement"}`
    : "Financial Loss: No direct funds transferred / Attempted Phishing only";

  return `FORMAL CYBER CRIME COMPLAINT DRAFT
=====================================================
To: Cyber Crime Cell / National Cyber Crime Reporting Portal (cybercrime.gov.in)
Date of Complaint: ${new Date().toISOString().split("T")[0]}

COMPLAINANT DETAILS:
Name: ${data.victimName.trim() || "[Victim Full Name]"}
Contact Number: ${data.victimPhone.trim() || "[Victim Mobile]"}

INCIDENT PARTICULARS:
Incident Date & Time: ${data.incidentDateTime || "[Approximate Date & Time]"}
Category of Scam: ${data.scamCategory}

${lossSection}

SUSPECT IDENTIFIERS:
${data.suspectDetails.trim() || "Suspect Phone/UPI ID/URL: [Not Provided]"}

CHRONOLOGICAL EVENT DESCRIPTION:
${data.incidentDescription.trim() || "The complainant received fraudulent correspondence and was targeted with a malicious scheme. Relevant digital screenshots and payment receipts are preserved for investigation."}

PRAYER / REQUEST:
1. Kindly register this cyber fraud complaint and take swift measures under relevant sections of the Information Technology Act (IT Act 2000) and Bharatiya Nyaya Sanhita (BNS).
2. Direct the concerned intermediary/bank to trace and freeze the beneficiary destination accounts.
3. Initiate action against the identified suspicious phone number/URL.

Enclosures: Preserved screenshots, SMS/WhatsApp chat logs, bank transaction statement.
Complainant Signature: ${data.victimName.trim() || "[Complainant]"}
`;
}
