export const supportedLanguages = ["he", "ru", "uk"] as const;

export type Language = (typeof supportedLanguages)[number];

export type TextDirection = "ltr" | "rtl";

export interface LanguageOption {
  readonly code: Language;
  readonly direction: TextDirection;
  readonly label: string;
}

export const languageOptions: readonly LanguageOption[] = [
  { code: "he", direction: "rtl", label: "עברית" },
  { code: "ru", direction: "ltr", label: "Русский" },
  { code: "uk", direction: "ltr", label: "Українська" },
];
