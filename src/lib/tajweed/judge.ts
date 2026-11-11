/** Fold Arabic so a student's speech or typing can be compared to the lesson. */
export function arabicFold(input: string): string {
  return input
    .replace(/[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED\u0640]/g, "")
    .replace(/[أإآٱ]/g, "ا")
    .replace(/ؤ/g, "و")
    .replace(/ئ/g, "ي")
    .replace(/ة/g, "ه")
    .replace(/ى/g, "ي")
    .replace(/[^\u0621-\u064A\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function phraseScore(heard: string, expected: string): number {
  const heardWords = arabicFold(heard).split(" ").filter(Boolean);
  const expectedWords = arabicFold(expected).split(" ").filter((word) => word.length >= 2);
  if (!expectedWords.length || !heardWords.length) return 0;
  let hit = 0;
  for (const word of expectedWords) {
    if (heardWords.some((said) => said === word || said.includes(word) || word.includes(said))) hit += 1;
  }
  return hit / expectedWords.length;
}

const LABELS: Record<string, string[]> = {
  izhar: ["اظهار حلقي", "الاظهار الحلقي", "اظهار"],
  "idgham-gh": ["ادغام بغنه", "بغنه"],
  "idgham-nogh": ["ادغام بغير غنه", "ادغام بلا غنه", "بغير غنه", "بلا غنه"],
  iqlab: ["اقلاب", "الاقلاب"],
  ikhfa: ["اخفاء حقيقي", "الاخفاء الحقيقي", "اخفاء"],
  mutlaq: ["اظهار مطلق", "الاظهار المطلق"],
};

export type TextVerdict = "right" | "partial" | "wrong";

export function judgeText(text: string, correct: string): TextVerdict {
  const folded = arabicFold(text);
  if (!folded) return "wrong";
  if (correct === "mutlaq") return folded.includes("مطلق") ? "right" : "wrong";
  if (correct === "izhar") {
    if (folded.includes("مطلق") || folded.includes("ادغام") || folded.includes("اخفاء") || folded.includes("اقلاب")) {
      return "wrong";
    }
  }
  if ((correct === "idgham-gh" || correct === "idgham-nogh") && folded.includes("ادغام") && !folded.includes("غن")) {
    return "partial";
  }
  const keys = LABELS[correct] ?? [];
  return keys.some((key) => folded.includes(arabicFold(key))) ? "right" : "wrong";
}
