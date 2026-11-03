import { findAnimalByName } from "../../data/animals/lookup";
import type { ProgressResponse } from "../../services/api-types";
import { useI18n } from "../../shared/i18n";
import { localeOf } from "./format";

/** Up to 3 chips "picture + animal · topic": what to talk about at home */
export function RepeatCard({ repeat }: { readonly repeat: ProgressResponse["repeat"] }) {
  const { t, language } = useI18n();
  return (
    <div className="pp-card">
      <h2 className="pp-card__title">{t("progress.repeat.title")}</h2>
      <ul className="pp-chips">
        {repeat.map((item) => {
          const animal = findAnimalByName(item.animalName);
          const name = animal?.names[language] ?? item.animalName;
          const topic = t(`progress.topic.${item.topic}`).toLocaleLowerCase(localeOf(language));
          return (
            <li className="pp-chip" key={`${item.animalId}-${item.topic}`}>
              <span className="pp-chip__pic">{animal && <img alt="" className="pp-chip__img" src={animal.image} />}</span>
              {name} · {topic}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
