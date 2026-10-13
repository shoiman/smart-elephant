export const supportedLanguages = ["he", "ru", "uk"] as const;

export type Language = (typeof supportedLanguages)[number];

export type TextDirection = "ltr" | "rtl";

export interface LanguageOption {
  readonly code: Language;
  readonly direction: TextDirection;
  readonly label: string;
  /** Compact label for the header switcher */
  readonly shortLabel: string;
}

export const languageOptions: readonly LanguageOption[] = [
  { code: "he", direction: "rtl", label: "עברית", shortLabel: "HE" },
  { code: "ru", direction: "ltr", label: "Русский", shortLabel: "RU" },
  { code: "uk", direction: "ltr", label: "Українська", shortLabel: "UK" },
];
