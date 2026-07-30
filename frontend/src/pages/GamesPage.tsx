
//import { useI18n } from "../shared/i18n";
import Host from "../components/Host/Host";
import Animal from "../components/Animal/Animal";
import boyImage from "../assets/characters/Eitan1_1_na_kolinkax.png";
import elephantImage from "../assets/animals/savanna_3_elephant.jpg";

import "./GamesPage.css";

export function GamesPage() {
  //const { t } = useI18n();

  return (
     <main className="games-page">
        <Host image={boyImage} />
        <Animal image={elephantImage} />
    </main>
  );
}

export default GamesPage;


