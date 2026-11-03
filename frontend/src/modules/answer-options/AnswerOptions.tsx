import type { CSSProperties } from "react";

import { findAnimalByName } from "../../data/animals/lookup";
import { useI18n } from "../../shared/i18n";
import { choiceLabel } from "./optionLabels";
import { colorSwatches, getOptionImage } from "./optionImages";
import type { Choice, OptionId } from "./types";
import "./AnswerOptions.css";

interface AnswerOptionsProps {
  readonly choices: readonly Choice[];
  /** When set, cards are buttons and a tap is an answer (toddler level); otherwise they are a visual hint. */
  readonly onSelect?: (choice: Choice, label: string) => void;
  readonly disabled?: boolean;
}

export function CardArt({ choice }: { readonly choice: Choice }) {
  if (choice.topic === "color") {
    // CSS custom properties are not in CSSProperties, hence the cast
    const swatch = { "--swatch": colorSwatches[choice.id as OptionId] } as CSSProperties;
    return <span aria-hidden="true" className="answer-card__swatch" style={swatch} />;
  }
  // "Who is this?" cards show the animal's own artwork
  const image = choice.topic === "animal" ? findAnimalByName(choice.id)?.image : getOptionImage(choice.id as OptionId);
  return image ? <img alt="" className="answer-card__image" draggable={false} src={image} /> : null;
}

export function AnswerOptions({ choices, onSelect, disabled = false }: AnswerOptionsProps) {
  const { language } = useI18n();
  if (choices.length === 0) return null;

  const listClass = `answer-options answer-options--${choices.length}`;

  return (
    <ul className={listClass}>
      {choices.map((choice) => {
        const label = choiceLabel(choice, language);
        return (
          <li className="answer-options__item" key={choice.id}>
            {onSelect ? (
              <button
                className="answer-card answer-card--button"
                disabled={disabled}
                onClick={() => onSelect(choice, label)}
                type="button"
              >
                <CardArt choice={choice} />
                <span className="answer-card__label">{label}</span>
              </button>
            ) : (
              <div className="answer-card">
                <CardArt choice={choice} />
                <span className="answer-card__label">{label}</span>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}

export default AnswerOptions;
