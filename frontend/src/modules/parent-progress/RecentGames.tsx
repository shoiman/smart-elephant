import { useState } from "react";

import { findAnimalByName } from "../../data/animals/lookup";
import type { RecentGame } from "../../services/api-types";
import { StarIcon } from "../../shared/icons/Icons";
import { formatMessage, useI18n } from "../../shared/i18n";
import { capitalize, dayLabel } from "./format";

/** Rows shown before "All games" */
const COLLAPSED = 3;

/** The last games: first animal's picture, the animals, "<day> · N min", a star per animal */
export function RecentGames({ games }: { readonly games: readonly RecentGame[] }) {
  const { t, language } = useI18n();
  const [isExpanded, setIsExpanded] = useState(false);
  const shown = isExpanded ? games : games.slice(0, COLLAPSED);

  return (
    <div className="pp-card">
      <h2 className="pp-card__title">{t("progress.recent.title")}</h2>
      <ul className="pp-games">
        {shown.map((game) => {
          const animals = game.animals.map((name) => findAnimalByName(name));
          const names = game.animals.map((name, index) => animals[index]?.names[language] ?? name);
          const day = dayLabel(game.completedAt, language, t("progress.today"), t("progress.yesterday"));
          return (
            <li className="pp-game" key={game.gameSessionId}>
              <span className="pp-game__pic">
                {animals[0] && <img alt="" className="pp-game__img" src={animals[0].image} />}
              </span>
              <span className="pp-game__text">
                {capitalize(names.join(", "))}
                <small className="pp-game__meta">
                  {capitalize(day)} · {formatMessage(t("progress.recent.minutes"), { n: game.minutes })}
                </small>
              </span>
              <span aria-label={formatMessage(t("progress.recent.stars"), { n: game.stars })} className="pp-game__stars" role="img">
                {Array.from({ length: Math.min(game.stars, 5) }, (_, index) => (
                  <StarIcon className="pp-game__star" key={index} />
                ))}
              </span>
            </li>
          );
        })}
      </ul>
      {games.length > COLLAPSED && (
        <button className="pp-link" onClick={() => setIsExpanded((value) => !value)} type="button">
          {t(isExpanded ? "progress.recent.less" : "progress.recent.all")}
        </button>
      )}
    </div>
  );
}
