import { type PropsWithChildren, useEffect, useMemo, useState } from "react";

import { I18nContext, type I18nContextValue } from "./I18nContext";
import { translations } from "./translations";
import { languageOptions, type Language } from "./types";

const LANGUAGE_STORAGE_KEY = "smart-elephant.language";
const defaultLanguage: Language = "he";

function getInitialLanguage(): Language {
  const storedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);

  return languageOptions.some((option) => option.code === storedLanguage)
    ? (storedLanguage as Language)
    : defaultLanguage;
}

export function I18nProvider({ children }: PropsWithChildren) {
  const [language, setLanguage] = useState<Language>(getInitialLanguage);
  const direction = languageOptions.find((option) => option.code === language)!.direction;

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = direction;
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  }, [direction, language]);

  const value = useMemo<I18nContextValue>(
    () => ({ language, direction, setLanguage, t: (key) => translations[language][key] }),
    [direction, language],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}
