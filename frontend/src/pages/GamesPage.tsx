
import { useI18n } from "../shared/i18n";
import { useState } from "react";
import SpeechBubble from "../components/SpeechBubble/SpeechBubble";
import Background from "../components/Background/Background";
import Host from "../components/Host/Host";
import Animal from "../components/Animal/Animal";
import RewardStar from "../components/RewardStar/RewardStar";
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
 const [showRewardStar, setShowRewardStar] = useState(false);
 const [currentAnimal, setCurrentAnimal] = useState<AnimalType>(() => {
  const randomIndex = Math.floor(Math.random() * animals.length);
  return animals[randomIndex];
});

 const handleAnimalClick = () => {
  if (showSpeechBubble) {
  return;
}
  setShowSpeechBubble(true);
  playAudio(questionAudio[language]);

  setTimeout(() => {
    setShowRewardStar(true);
  }, 7000);
};

const handleNextAnimal = () => {
  setShowRewardStar(false);
  setShowSpeechBubble(false);

  const randomIndex = Math.floor(Math.random() * animals.length);
  setCurrentAnimal(animals[randomIndex]);
};


  return (
    <section className="games-page" aria-label={t("app.name")}>
      <Background />
      <div className="games-page__scene">
        <div className="host-container">
          {showSpeechBubble && (
            <SpeechBubble text={t("question.whoIsIt")} />
          )}

          <Host image={boyImage} />
        </div>
        <Animal
          image={currentAnimal.image}
          onClick={handleAnimalClick}
        />
      </div>
      {showRewardStar && (
  <RewardStar
    onClick={handleNextAnimal}
  />
)}
    </section>
  );
 
}

export default GamesPage;
