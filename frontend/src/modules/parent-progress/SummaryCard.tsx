import type { ProgressResponse } from "../../services/api-types";
import { useI18n } from "../../shared/i18n";
import { activityLabel, plural } from "./format";

/** Bars grow up to this height; a day without games is a thin grey line */
const BAR_MAX_PX = 52;

/** Games, minutes, animals and the activity bars of the period */
export function SummaryCard({ progress }: { readonly progress: ProgressResponse }) {
  const { t, language } = useI18n();
  const maxMinutes = Math.max(1, ...progress.activity.map((bucket) => bucket.minutes));
  const kpis = [
    { value: progress.games, forms: t("progress.games") },
    { value: progress.minutes, forms: t("progress.minutes") },
    { value: progress.animals, forms: t("progress.animals") },
  ];

  return (
    <div className="pp-card">
      <div className="pp-kpis">
        {kpis.map(({ value, forms }) => (
          <div className="pp-kpi" key={forms}>
            <b className="pp-kpi__value">{value}</b>
            <span className="pp-kpi__label">{plural(forms, value, language)}</span>
          </div>
        ))}
      </div>

      {progress.activity.length > 0 && (
        <ul aria-label={t("progress.activity")} className="pp-bars">
          {progress.activity.map((bucket) => {
            const label = activityLabel(bucket.label, progress.period, language);
            return (
              <li className="pp-bars__item" key={bucket.label}>
                <span
                  aria-label={`${label}: ${bucket.minutes} ${plural(t("progress.minutes"), bucket.minutes, language)}`}
                  className={`pp-bars__bar ${bucket.minutes === 0 ? "pp-bars__bar--zero" : ""}`}
                  role="img"
                  style={bucket.minutes > 0 ? { height: `${Math.max(6, (bucket.minutes / maxMinutes) * BAR_MAX_PX)}px` } : undefined}
                />
                <span aria-hidden="true" className="pp-bars__label">
                  {label}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
