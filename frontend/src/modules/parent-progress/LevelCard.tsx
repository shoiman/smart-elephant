import { useLevelPreference } from "../answer-options";
import { formatMessage, useI18n } from "../../shared/i18n";

/**
 * The answer level the parent chose on the home page (it does not change by itself), with what it means
 * for the child. Neutral on purpose: no colours, no "easy/hard" judgement of the child.
 */
export function LevelCard() {
  const { t } = useI18n();
  const [level] = useLevelPreference();

  return (
    <div className="pp-card pp-level">
      <span aria-hidden="true" className="pp-level__badge">
        <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth={2.2} viewBox="0 0 24 24">
          <path d="M4 18h4v-5H4zM10 18h4V9h-4zM16 18h4V5h-4z" />
        </svg>
      </span>
      <p className="pp-level__text">
        <strong className="pp-level__title">{formatMessage(t("progress.level.title"), { level: t(`level.${level}`) })}</strong>
        {t(`level.${level}.hint`)}. {t("progress.level.note")}.
      </p>
    </div>
  );
}
