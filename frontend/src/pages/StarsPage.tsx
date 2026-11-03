/**
 * "My stars": the child's reward screen. Today's stars, the album of collected animals and the next
 * three animals as silhouettes. No numbers, percentages or dates: the host says the line aloud and
 * a sticker says its animal's name when tapped. The small lock in the corner leads to the parents' zone.
 */
import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { Link } from "react-router-dom";

import elephantReading from "../assets/characters/elephant-reading.png";
import { SpeechBubble } from "../components/SpeechBubble/SpeechBubble";
import { findAnimalByName } from "../data/animals/lookup";
import { useHostVoice } from "../modules/stars/useHostVoice";
import { StarsService } from "../services/starsService";
import type { StarsResponse } from "../services/api-types";
import { AlbumIcon, LockIcon, PlayIcon, SpeakerIcon, StarIcon } from "../shared/icons/Icons";
import { useI18n } from "../shared/i18n";
import type { TranslationKey } from "../shared/i18n/translations";
import { usePageHeader } from "../shared/layout/PageHeaderContext";
import type { Animal } from "../types/animal";
import "./StarsPage.css";

// Mock child ID - in real app, this would come from user auth/selection
const MOCK_CHILD_ID = 1;
/** More stars than this would not fit the jar; the child does not count them anyway */
const MAX_TODAY_STARS = 10;
/** Delay between the stars appearing one by one */
const STAR_DELAY_MS = 120;

interface AlbumSticker {
  readonly animal: Animal;
  readonly isNew: boolean;
}

/** Same as the host's lines: only the first letter becomes upper case. */
function capitalize(text: string): string {
  return text.charAt(0).toLocaleUpperCase() + text.slice(1);
}

export function StarsPage() {
  const { t, language } = useI18n();
  const { say } = useHostVoice(language);
  usePageHeader({ title: t("stars.title") });

  const [stars, setStars] = useState<StarsResponse | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  /** Sticker that bounces now; the counter restarts the animation on a repeated tap */
  const [bounce, setBounce] = useState<{ readonly id: string; readonly count: number } | null>(null);

  /** Bumped by "retry" to load the stars again */
  const [loadCount, setLoadCount] = useState(0);

  // State changes only in the response callbacks; "ignore" drops a response that came after leaving the page
  useEffect(() => {
    let ignore = false;
    StarsService.getStars(MOCK_CHILD_ID)
      .then((response) => {
        if (ignore) return;
        setStars(response);
        setStatus("ready");
      })
      .catch((error: unknown) => {
        if (ignore) return;
        console.error("Failed to load stars:", error);
        setStatus("error");
      });
    return () => {
      ignore = true;
    };
  }, [loadCount]);

  function retry() {
    setStatus("loading");
    setLoadCount((count) => count + 1);
  }

  // New stickers first, then the rest in the backend's order (newest first); animals without a picture are skipped
  const stickers = useMemo<AlbumSticker[]>(() => {
    const known = (stars?.stickers ?? []).flatMap((sticker) => {
      const animal = findAnimalByName(sticker.animalName);
      return animal ? [{ animal, isNew: sticker.isNew }] : [];
    });
    return [...known.filter((sticker) => sticker.isNew), ...known.filter((sticker) => !sticker.isNew)];
  }, [stars]);

  const nextAnimals = useMemo(
    () => (stars?.next ?? []).flatMap((next) => findAnimalByName(next.animalName) ?? []),
    [stars],
  );

  const todayStars = Math.min(stars?.todayStars ?? 0, MAX_TODAY_STARS);

  const greetingKey: TranslationKey = stickers.some((sticker) => sticker.isNew)
    ? "stars.greetingNew"
    : stickers.length > 0
      ? "stars.greeting"
      : "stars.greetingEmpty";
  const greeting = t(greetingKey);

  // The host greets the child as soon as the album is there (the child may not read yet)
  useEffect(() => {
    if (status === "ready") void say(greeting);
  }, [status, greeting, say]);

  function tapSticker(animal: Animal) {
    setBounce((current) => ({ id: animal.id, count: (current?.count ?? 0) + 1 }));
    const name = animal.names[language];
    void say(`${capitalize(name)}!`, name);
  }

  if (status !== "ready") {
    return (
      <section aria-live="polite" className="stars stars--status">
        {status === "loading" ? (
          <p className="stars__status-text">{t("game.loading")}</p>
        ) : (
          <>
            <p className="stars__status-text">{t("game.error")}</p>
            <button className="btn btn--primary btn--lg" onClick={retry} type="button">
              {t("game.retry")}
            </button>
          </>
        )}
      </section>
    );
  }

  return (
    <section className="stars">
      <div className="stars__top">
        <Link aria-label={t("stars.parents")} className="stars__lock" to="/parent/progress">
          <LockIcon className="stars__lock-icon" />
        </Link>
      </div>

      <div className="stars__hero">
        <img alt="" className="stars__host" draggable={false} src={elephantReading} />
        <SpeechBubble className="stars__bubble" tail="start">
          <p className="stars__greeting">{greeting}</p>
          <button aria-label={t("stars.listen")} className="stars__speak" onClick={() => void say(greeting)} type="button">
            <SpeakerIcon className="stars__speak-icon" />
          </button>
        </SpeechBubble>
      </div>

      {todayStars > 0 && (
        <div aria-label={t("stars.today")} className="stars__jar" role="img">
          {Array.from({ length: todayStars }, (_, index) => (
            <span
              className="stars__jar-star"
              key={index}
              style={{ "--star-delay": `${index * STAR_DELAY_MS}ms` } as CSSProperties}
            >
              <StarIcon className="stars__jar-icon" />
            </span>
          ))}
        </div>
      )}

      <h2 className="stars__album-title">
        <AlbumIcon className="stars__album-icon" />
        {t("stars.album")}
      </h2>

      <ul className="stars__album">
        {stickers.map(({ animal, isNew }) => (
          <li key={animal.id}>
            <button
              aria-label={animal.names[language]}
              className={[
                "stars__sticker",
                isNew ? "stars__sticker--new" : "",
                bounce?.id === animal.id ? "stars__sticker--bounce" : "",
              ].join(" ")}
              // A new key on every tap restarts the bounce
              key={bounce?.id === animal.id ? bounce.count : 0}
              onAnimationEnd={() => setBounce(null)}
              onClick={() => tapSticker(animal)}
              type="button"
            >
              <img alt="" className="stars__animal" draggable={false} src={animal.image} />
              {isNew && <StarIcon className="stars__sticker-star" />}
            </button>
          </li>
        ))}
        {nextAnimals.map((animal) => (
          <li key={animal.id}>
            <button
              aria-label={t("stars.next")}
              className="stars__sticker stars__sticker--next"
              onClick={() => void say(t("stars.soon"))}
              type="button"
            >
              <img alt="" className="stars__animal" draggable={false} src={animal.image} />
            </button>
          </li>
        ))}
      </ul>

      <div className="stars__cta">
        <Link className="stars__play" to="/games">
          <span className="stars__play-circle">
            <PlayIcon className="stars__play-icon" />
          </span>
          {t("stars.playMore")}
        </Link>
      </div>
    </section>
  );
}

export default StarsPage;
