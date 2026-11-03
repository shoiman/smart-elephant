import type { ProgressResponse } from "../../services/api-types";
import { useI18n } from "../../shared/i18n";
import { TopicIcon } from "./TopicIcon";

/** A row per question topic with a status pill: confident / learning / hard for now */
export function TopicsCard({ topics }: { readonly topics: ProgressResponse["topics"] }) {
  const { t } = useI18n();
  return (
    <div className="pp-card">
      <h2 className="pp-card__title">{t("progress.topics.title")}</h2>
      <ul className="pp-topics">
        {topics.map((topic) => (
          <li className="pp-topic" key={topic.topic}>
            <TopicIcon className="pp-topic__icon" topic={topic.topic} />
            <span>{t(`progress.topic.${topic.topic}`)}</span>
            <span className={`pp-pill pp-pill--${topic.status.toLowerCase()}`}>{t(`progress.status.${topic.status}`)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
