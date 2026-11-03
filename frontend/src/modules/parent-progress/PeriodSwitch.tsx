import type { ProgressPeriod } from "../../services/api-types";
import { useI18n } from "../../shared/i18n";

const PERIODS: readonly ProgressPeriod[] = ["week", "month", "all"];

interface PeriodSwitchProps {
  readonly value: ProgressPeriod;
  readonly onChange: (period: ProgressPeriod) => void;
}

/** "Week / Month / All time": changes every block below */
export function PeriodSwitch({ value, onChange }: PeriodSwitchProps) {
  const { t } = useI18n();
  return (
    <div aria-label={t("progress.period.label")} className="pp-seg" role="radiogroup">
      {PERIODS.map((period) => (
        <button
          aria-checked={period === value}
          className={`pp-seg__option ${period === value ? "pp-seg__option--on" : ""}`}
          key={period}
          onClick={() => onChange(period)}
          role="radio"
          type="button"
        >
          {t(`progress.period.${period}`)}
        </button>
      ))}
    </div>
  );
}
