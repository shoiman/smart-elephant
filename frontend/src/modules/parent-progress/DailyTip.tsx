import { findAnimalByName } from "../../data/animals/lookup";
import type { ProgressResponse } from "../../services/api-types";
import { formatMessage, useI18n } from "../../shared/i18n";
import { capitalize } from "./format";

/**
 * "Idea for today": one hint for the parent about the hardest pair from "Repeat at home".
 * Templates per topic for now; later the text can come from the Claude API.
 */
export function DailyTip({ pair }: { readonly pair: ProgressResponse["repeat"][number] }) {
  const { t, language } = useI18n();
  const name = findAnimalByName(pair.animalName)?.names[language] ?? pair.animalName;

  return (
    <div className="pp-tip">
      <svg aria-hidden="true" className="pp-tip__icon" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth={2} viewBox="0 0 24 24">
        <path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10.5c.7.7 1 1.5 1 2.5h6c0-1 .3-1.8 1-2.5A6 6 0 0 0 12 3z" />
      </svg>
      <p className="pp-tip__text">
        <strong className="pp-tip__title">{t("progress.tip.title")}</strong>
        {formatMessage(t(`progress.tip.${pair.topic}`), { animal: capitalize(name) })}
      </p>
    </div>
  );
}
