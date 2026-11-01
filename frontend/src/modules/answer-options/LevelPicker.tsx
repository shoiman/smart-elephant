import { useId } from "react";

import { StarIcon } from "../../shared/icons/Icons";
import { useI18n } from "../../shared/i18n";
import { ANSWER_LEVELS } from "./levelStorage";
import type { AnswerLevel } from "./types";
import "./LevelPicker.css";

interface LevelPickerProps {
  readonly value: AnswerLevel;
  readonly onChange: (level: AnswerLevel) => void;
  readonly className?: string;
}

const LEVEL_TEXT = {
  toddler: { label: "level.toddler", hint: "level.toddler.hint", stars: 1 },
  middle: { label: "level.middle", hint: "level.middle.hint", stars: 2 },
  older: { label: "level.older", hint: "level.older.hint", stars: 3 },
} as const;

/**
 * Level for the parent, named by what the child does (not by age: children with speech
 * difficulties may need an easier level than their age suggests).
 * Native radio buttons styled as a segmented control; the hint explains the chosen level.
 */
export function LevelPicker({ value, onChange, className = "" }: LevelPickerProps) {
  const { t } = useI18n();
  const name = useId();
  const hintId = useId();

  return (
    <fieldset aria-describedby={hintId} className={`level-picker ${className}`.trim()}>
      <legend className="level-picker__legend">{t("level.label")}</legend>
      <div className="level-picker__options">
        {ANSWER_LEVELS.map((level) => (
          <label className="level-picker__option" key={level}>
            <input
              checked={value === level}
              className="level-picker__input"
              name={name}
              onChange={() => onChange(level)}
              type="radio"
              value={level}
            />
            <span className="level-picker__text">
              <span aria-hidden="true" className="level-picker__stars">
                {Array.from({ length: LEVEL_TEXT[level].stars }, (_, index) => (
                  <StarIcon className="level-picker__star" key={index} />
                ))}
              </span>
              {t(LEVEL_TEXT[level].label)}
            </span>
          </label>
        ))}
      </div>
      <p aria-live="polite" className="level-picker__hint" id={hintId}>
        {t(LEVEL_TEXT[value].hint)}
      </p>
    </fieldset>
  );
}

export default LevelPicker;
