import { createContext } from "react";

import type { TranslationKey } from "./translations";
import type { Language, TextDirection } from "./types";

export interface I18nContextValue {
  readonly language: Language;
  readonly direction: TextDirection;
  readonly setLanguage: (language: Language) => void;
  readonly t: (key: TranslationKey) => string;
}

export const I18nContext = createContext<I18nContextValue | null>(null);
