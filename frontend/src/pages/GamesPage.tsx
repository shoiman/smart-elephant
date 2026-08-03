
import { useI18n } from "../shared/i18n";
import {useEffect, useState } from "react";
import SpeechBubble from "../components/SpeechBubble/SpeechBubble";
import Host from "../components/Host/Host";
import Animal from "../components/Animal/Animal";
import type { Animal as AnimalType } from "../types/animal";
import boyImage from "../assets/characters/boy_shows.png";
import { animals } from "../data/animals/animals";
import whoIsItRu from "../assets/audio/questions/who-is-it-ru.wav";
import whoIsItHe from "../assets/audio/questions/who-is-it-he.wav";
import whoIsItUk from "../assets/audio/questions/who-is-it-uk.wav";
import { playAudio } from "../services/audioService";

import "./GamesPage.css";



export function GamesPage() {
  const { t, language } = useI18n();
  

  const questionAudio = {
  ru: whoIsItRu,
  he: whoIsItHe,
  uk: whoIsItUk,
};

 const [showSpeechBubble, setShowSpeechBubble] = useState(false);
 const [currentAnimal, setCurrentAnimal] = useState<AnimalType | null>(null);

 const handleAnimalClick = () => {
  setShowSpeechBubble(true);
  playAudio(questionAudio[language]);
};

const selectRandomAnimal = () => {
  const randomIndex = Math.floor(Math.random() * animals.length);
  const randomAnimal = animals[randomIndex];
  setCurrentAnimal(randomAnimal);
};

useEffect(() => {
  selectRandomAnimal();
}, []);

  return (
     <main className="games-page">

      <div className="host-container">
        {showSpeechBubble && (
          <SpeechBubble text={t("question.whoIsIt")} />
        )}

        <Host image={boyImage} />
      </div>
        {currentAnimal !== null && (
          <Animal
            image={currentAnimal.image}
            onClick={handleAnimalClick}
          />
      )}
    </main>
  );
}

export default GamesPage;


