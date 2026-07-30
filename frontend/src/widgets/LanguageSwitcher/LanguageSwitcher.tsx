import { languageOptions, useI18n } from "../../shared/i18n";

export function LanguageSwitcher() {
  const { language, setLanguage, t } = useI18n();

  return (
    <fieldset className="language-switcher">
      <legend className="visually-hidden">{t("languageSwitcher.label")}</legend>
      {languageOptions.map((option) => (
        <button aria-pressed={language === option.code} className="language-switcher__button" key={option.code} lang={option.code} onClick={() => setLanguage(option.code)} type="button">
          {option.label}
        </button>
      ))}
    </fieldset>
  );
}
