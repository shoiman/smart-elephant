import { useEffect, useId, useRef, useState } from "react";

import { CheckIcon, ChevronDownIcon } from "../../shared/icons/Icons";
import { languageOptions, useI18n, type Language } from "../../shared/i18n";
import "./LanguageSwitcher.css";

/** Compact language menu: a pill with the current code that opens the full list. */
export function LanguageSwitcher() {
  const { language, setLanguage, t } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const menuId = useId();
  const current = languageOptions.find((option) => option.code === language)!;

  useEffect(() => {
    if (!isOpen) return;

    function handlePointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setIsOpen(false);
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
        rootRef.current?.querySelector<HTMLButtonElement>(".language-menu__trigger")?.focus();
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    // Move focus into the menu so keyboard users can pick a language right away
    rootRef.current?.querySelector<HTMLButtonElement>('[aria-checked="true"]')?.focus();

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  function choose(code: Language) {
    setLanguage(code);
    setIsOpen(false);
  }

  return (
    <div className="language-menu" ref={rootRef}>
      <button
        aria-controls={menuId}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-label={`${t("languageSwitcher.label")}: ${current.label}`}
        className="language-menu__trigger"
        dir="ltr"
        onClick={() => setIsOpen((open) => !open)}
        type="button"
      >
        <span>{current.shortLabel}</span>
        <ChevronDownIcon className="language-menu__chevron" />
      </button>

      {isOpen && (
        <div aria-label={t("languageSwitcher.label")} className="language-menu__list" id={menuId} role="menu">
          {languageOptions.map((option) => (
            <button
              aria-checked={option.code === language}
              className="language-menu__item"
              dir={option.direction}
              key={option.code}
              lang={option.code}
              onClick={() => choose(option.code)}
              role="menuitemradio"
              type="button"
            >
              <span>{option.label}</span>
              {option.code === language && <CheckIcon className="language-menu__check" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
