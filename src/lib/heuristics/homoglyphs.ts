/**
 * Homoglyph and Zero-Width Character Detection Utility
 * Detects internationalized domain spoofing (IDN homograph attacks)
 * and hidden bypass characters commonly found in phishing lures.
 */

const CONFUSABLES: Record<string, string> = {
  // Cyrillic to Latin lookalikes
  "а": "a", "с": "c", "е": "e", "о": "o", "р": "p", "ѕ": "s", "х": "x", "у": "y",
  "А": "A", "В": "B", "С": "C", "Е": "E", "Н": "H", "І": "I", "Ј": "J", "К": "K",
  "М": "M", "О": "O", "Р": "P", "Ѕ": "S", "Т": "T", "Х": "X",
  // Greek to Latin lookalikes
  "α": "a", "ε": "e", "ι": "i", "κ": "k", "ο": "o", "ρ": "p", "υ": "u", "ν": "v",
  // Fullwidth characters
  "ａ": "a", "ｂ": "b", "ｃ": "c", "ｄ": "d", "ｅ": "e", "ｆ": "f", "ｇ": "g",
  "ｈ": "h", "ｉ": "i", "ｊ": "j", "ｋ": "k", "ｌ": "l", "ｍ": "m", "ｎ": "n",
  "ｏ": "o", "ｐ": "p", "ｑ": "q", "ｒ": "r", "ｓ": "s", "ｔ": "t", "ｕ": "u",
  "ｖ": "v", "ｗ": "w", "ｘ": "x", "ｙ": "y", "ｚ": "z",
};

const ZERO_WIDTH_REGEX = /[\u200B-\u200D\uFEFF\u00AD\u2060]/g;

export type HomoglyphAnalysis = {
  hasHomoglyphs: boolean;
  hasPunycode: boolean;
  hasZeroWidthChars: boolean;
  normalizedText: string;
  detectedCharacters: string[];
  riskNote?: string;
};

export function inspectHomoglyphs(input: string): HomoglyphAnalysis {
  const hasZeroWidthChars = ZERO_WIDTH_REGEX.test(input);
  const cleanInput = input.replace(ZERO_WIDTH_REGEX, "");

  const hasPunycode = /(?:^|\.)xn--[a-z0-9]+/i.test(cleanInput);
  const detectedCharacters: string[] = [];

  let normalizedText = "";
  for (const char of cleanInput) {
    if (CONFUSABLES[char]) {
      detectedCharacters.push(char);
      normalizedText += CONFUSABLES[char];
    } else {
      normalizedText += char;
    }
  }

  const hasHomoglyphs = detectedCharacters.length > 0;

  let riskNote: string | undefined;
  if (hasPunycode) {
    riskNote = "Punycode (xn--) domain detected — frequently used to mask fake lookalike URLs";
  } else if (hasHomoglyphs) {
    riskNote = `Lookalike unicode characters detected (${detectedCharacters.slice(0, 3).join(", ")}) attempting to impersonate legitimate brand letters`;
  } else if (hasZeroWidthChars) {
    riskNote = "Zero-width hidden characters detected attempting to evade security keyword filters";
  }

  return {
    hasHomoglyphs,
    hasPunycode,
    hasZeroWidthChars,
    normalizedText,
    detectedCharacters,
    riskNote,
  };
}
