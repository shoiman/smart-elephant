import { useState } from "react";

import elephantImage from "../assets/animal-library/animals/savanna_3_elephant.jpg";
import farmBackground from "../assets/animal-library/backgrounds/farm_bg.jpg";
import riverLakeBackground from "../assets/animal-library/backgrounds/river_lake_bg.jpg";
import savannaBackground from "../assets/animal-library/backgrounds/savanna_bg.jpg";
import { animalGameCopy, type HabitatId } from "../modules/animal-game/gameCopy";
import { useI18n } from "../shared/i18n";

const correctHabitat: HabitatId = "savanna";

const habitatChoices: readonly { readonly id: HabitatId; readonly image: string }[] = [
  { id: "savanna", image: savannaBackground },
  { id: "farm", image: farmBackground },
  { id: "riverLake", image: riverLakeBackground },
];

export function AnimalsPage() {
  const { language } = useI18n();
  const [selectedHabitat, setSelectedHabitat] = useState<HabitatId | null>(null);
  const copy = animalGameCopy[language];
  const hasCorrectAnswer = selectedHabitat === correctHabitat;

  function chooseHabitat(habitat: HabitatId) {
    setSelectedHabitat(habitat);
  }

  function restartRound() {
    setSelectedHabitat(null);
  }

  return (
    <section aria-labelledby="animal-game-title" className="animal-game">
      <div className="animal-game__intro">
        <p className="animal-game__eyebrow">Smart Elephant</p>
        <h1 id="animal-game-title">{copy.title}</h1>
        <p>{copy.hint}</p>
      </div>

      <section aria-labelledby="animal-game-question" className="animal-game__question">
        <img alt={copy.animalName} className="animal-game__animal" src={elephantImage} />
        <h2 id="animal-game-question">{copy.question}</h2>
      </section>

      <div className="animal-game__choices" role="group" aria-label={copy.question}>
        {habitatChoices.map((habitat) => {
          const isSelected = selectedHabitat === habitat.id;
          const isIncorrect = isSelected && habitat.id !== correctHabitat;

          return (
            <button
              aria-pressed={isSelected}
              className={`habitat-choice${isIncorrect ? " habitat-choice--incorrect" : ""}`}
              key={habitat.id}
              onClick={() => chooseHabitat(habitat.id)}
              type="button"
            >
              <img alt="" src={habitat.image} />
              <span>{copy.habitats[habitat.id]}</span>
            </button>
          );
        })}
      </div>

      <p aria-live="polite" className="animal-game__feedback">
        {selectedHabitat && !hasCorrectAnswer ? copy.incorrect : ""}
      </p>

      {hasCorrectAnswer && (
        <div aria-labelledby="celebration-title" aria-modal="true" className="celebration-backdrop" role="dialog">
          <section className="celebration-dialog">
            <span aria-hidden="true" className="celebration-dialog__star">★</span>
            <h2 id="celebration-title">{copy.successTitle}</h2>
            <p>{copy.successBody}</p>
            <button onClick={restartRound} type="button">{copy.restart}</button>
          </section>
        </div>
      )}
    </section>
  );
}

export default AnimalsPage;
