
import { useI18n } from "../shared/i18n";
import { useState } from "react";
import SpeechBubble from "../components/SpeechBubble/SpeechBubble";
import Host from "../components/Host/Host";
import Animal from "../components/Animal/Animal";
import boyImage from "../assets/characters/boy_shows.png";
import elephantImage from "../assets/animals/elephant.png";
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

 const handleAnimalClick = () => {
  setShowSpeechBubble(true);

  playAudio(questionAudio[language]);
};

  return (
     <main className="games-page">

      <div className="host-container">
        {showSpeechBubble && (
          <SpeechBubble text={t("question.whoIsIt")} />
        )}

        <Host image={boyImage} />
      </div>
        <Animal image={elephantImage} 
                onClick={handleAnimalClick}/>
    </main>
  );
}

export default GamesPage;


