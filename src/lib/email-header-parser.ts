export type AuthVerdict = "pass" | "fail" | "softfail" | "neutral" | "none" | "temperror";

export type ParsedEmailHeaders = {
  fromRaw: string;
  displayName: string;
  fromAddress: string;
  fromDomain: string;
  replyToAddress?: string;
  replyToDomain?: string;
  returnPath?: string;
  subject?: string;
  spfVerdict: AuthVerdict;
  dkimVerdict: AuthVerdict;
  dmarcVerdict: AuthVerdict;
  receivedHopsCount: number;
  suspiciousRelayFound: boolean;
  warnings: string[];
};

export function parseDisplayNameAndEmail(rawFrom: string): { displayName: string; email: string; domain: string } {
  const trimmed = rawFrom.trim();
  const angleMatch = trimmed.match(/^(?:["']?([^"']*)["']?\s*)?<([^>]+)>/);

  if (angleMatch) {
    const displayName = (angleMatch[1] ?? "").trim();
    const email = (angleMatch[2] ?? "").trim().toLowerCase();
    const domain = (email.split("@")[1] ?? "").toLowerCase();
    return { displayName, email, domain };
  }

  // Bare email address or unquoted string
  const emailMatch = trimmed.match(/[\w.-]+@[\w.-]+\.[a-z]{2,}/i);
  if (emailMatch) {
    const email = emailMatch[0].toLowerCase();
    const domain = (email.split("@")[1] ?? "").toLowerCase();
    const displayName = trimmed.replace(emailMatch[0], "").replace(/[<>]/g, "").trim();
    return { displayName, email, domain };
  }

  return { displayName: "", email: trimmed, domain: "" };
}

export function parseRawEmailHeaders(rawText: string): ParsedEmailHeaders {
  const lines = rawText.split(/\r?\n/);
  const headers: Record<string, string> = {};
  let currentKey = "";
  let receivedCount = 0;

  for (const line of lines) {
    if (/^\s+[^\s]/.test(line) && currentKey) {
      // Continuation line (RFC 2822 folding)
      headers[currentKey] = (headers[currentKey] + " " + line.trim()).trim();
    } else {
      const match = line.match(/^([\w-]+):\s*(.*)$/);
      if (match) {
        currentKey = match[1]!.toLowerCase();
        if (currentKey === "received") {
          receivedCount++;
          headers["received"] = (headers["received"] ? headers["received"] + " \n " : "") + match[2]!;
        } else {
          headers[currentKey] = match[2]!.trim();
        }
      }
    }
  }

  const rawFrom = headers["from"] ?? "";
  const { displayName, email: fromAddress, domain: fromDomain } = parseDisplayNameAndEmail(rawFrom);

  const rawReplyTo = headers["reply-to"];
  let replyToAddress: string | undefined;
  let replyToDomain: string | undefined;
  if (rawReplyTo) {
    const parsedReply = parseDisplayNameAndEmail(rawReplyTo);
    replyToAddress = parsedReply.email;
    replyToDomain = parsedReply.domain;
  }

  const returnPath = headers["return-path"]?.replace(/[<>]/g, "").trim();
  const subject = headers["subject"];

  // Authentication results parsing (SPF, DKIM, DMARC)
  const authResults = (headers["authentication-results"] ?? "") + " " + (headers["received-spf"] ?? "");
  const authLower = authResults.toLowerCase();

  const parseAuth = (protocol: "spf" | "dkim" | "dmarc"): AuthVerdict => {
    if (new RegExp(`${protocol}=pass`).test(authLower)) return "pass";
    if (new RegExp(`${protocol}=fail`).test(authLower)) return "fail";
    if (new RegExp(`${protocol}=softfail`).test(authLower)) return "softfail";
    if (new RegExp(`${protocol}=neutral`).test(authLower)) return "neutral";
    return "none";
  };

  const spfVerdict = parseAuth("spf");
  const dkimVerdict = parseAuth("dkim");
  const dmarcVerdict = parseAuth("dmarc");

  const warnings: string[] = [];

  // Check Display Name Brand Spoofing
  const knownBrands = ["sbi", "hdfc", "icici", "axis", "kotak", "paypal", "google", "microsoft", "amazon", "netflix", "apple"];
  const displayLower = displayName.toLowerCase();
  const brandMentioned = knownBrands.find((b) => displayLower.includes(b));

  if (brandMentioned && fromDomain && !fromDomain.includes(brandMentioned)) {
    warnings.push(
      `🎭 Display Name Spoof: Sender claims to be "${displayName}" but the actual email domain is "${fromDomain}".`
    );
  }

  // Reply-To mismatch
  if (replyToDomain && fromDomain && replyToDomain !== fromDomain) {
    warnings.push(
      `⚠️ Reply-To Mismatch: Replies are routed to "${replyToAddress}" (${replyToDomain}), which differs from the From domain (${fromDomain}).`
    );
  }

  // Authentication flags
  if (spfVerdict === "fail" || spfVerdict === "softfail") {
    warnings.push(`❌ SPF Authentication Failed: The sending server IP is not authorized to send on behalf of ${fromDomain}.`);
  }
  if (dkimVerdict === "fail") {
    warnings.push(`❌ DKIM Signature Invalid: The cryptographic email signature is corrupted or forged.`);
  }
  if (dmarcVerdict === "fail") {
    warnings.push(`❌ DMARC Policy Rejected: Email failed strict domain alignment policies.`);
  }

  return {
    fromRaw: rawFrom,
    displayName,
    fromAddress,
    fromDomain,
    replyToAddress,
    replyToDomain,
    returnPath,
    subject,
    spfVerdict,
    dkimVerdict,
    dmarcVerdict,
    receivedHopsCount: receivedCount,
    suspiciousRelayFound: receivedCount > 6 || /dynamic|dsl|cable|unknown/i.test(headers["received"] ?? ""),
    warnings,
  };
}
