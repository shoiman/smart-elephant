import type { ProgressResponse } from "../../services/api-types";
import { useI18n } from "../../shared/i18n";
import { plural } from "./format";

/** One stacked bar: on their own / on the second try / said together; the legend carries the numbers */
export function AnswersCard({ answers }: { readonly answers: ProgressResponse["answers"] }) {
  const { t, language } = useI18n();
  const parts = [
    { key: "firstTry", value: answers.firstTry, label: t("progress.answers.firstTry") },
    { key: "secondTry", value: answers.secondTry, label: t("progress.answers.secondTry") },
    { key: "together", value: answers.together, label: t("progress.answers.together") },
  ] as const;

  return (
    <div className="pp-card">
      <h2 className="pp-card__title">
        {t("progress.answers.title")}
        <small className="pp-card__aside">
          {answers.total} {plural(t("progress.questions"), answers.total, language)}
        </small>
      </h2>
      <div aria-hidden="true" className="pp-stack">
        {parts
          .filter((part) => part.value > 0)
          .map((part) => (
            <span className={`pp-stack__part pp-tone--${part.key}`} key={part.key} style={{ flexGrow: part.value }} />
          ))}
      </div>
      <ul className="pp-legend">
        {parts.map((part) => (
          <li className="pp-legend__row" key={part.key}>
            <span aria-hidden="true" className={`pp-legend__dot pp-tone--${part.key}`} />
            {part.label}
            <b className="pp-legend__value">{part.value}</b>
          </li>
        ))}
      </ul>
    </div>
  );
}
