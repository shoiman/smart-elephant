import { Link, useNavigate } from "react-router-dom";

import meadowImage from "../assets/backgrounds/meadow-mobile.png";
import Host from "../components/Host/Host";
import SpeechBubble from "../components/SpeechBubble/SpeechBubble";
import { ArrowForwardIcon, GamepadIcon, PawIcon, StarIcon } from "../shared/icons/Icons";
import { useI18n } from "../shared/i18n";
import "./HomePage.css";

export function HomePage() {
  const { t } = useI18n();
  const navigate = useNavigate();

  const sections = [
    { to: "/animals", label: t("animals.title"), icon: <PawIcon className="home-nav__icon" />, tone: "paw" },
    { to: "/games", label: t("games.title"), icon: <GamepadIcon className="home-nav__icon" />, tone: "game" },
    { to: "/progress", label: t("nav.rewards"), icon: <StarIcon className="home-nav__icon" />, tone: "star" },
  ] as const;

  return (
    <div className="home">
      <section aria-label={t("home.greeting")} className="home__scene">
        <div aria-hidden="true" className="home__backdrop" style={{ backgroundImage: `url(${meadowImage})` }} />
        <SpeechBubble className="home__bubble" tail="bottom-start" tone="cream">
          {t("home.greeting")}
        </SpeechBubble>
        <Host className="home__host" />
      </section>

      <button className="btn btn--primary btn--xl home__start" onClick={() => navigate("/games")} type="button">
        {t("home.start")}
        <ArrowForwardIcon className="btn__icon" />
      </button>

      <nav aria-label={t("app.name")} className="home-nav">
        {sections.map((section) => (
          <Link className={`home-nav__item home-nav__item--${section.tone}`} key={section.to} to={section.to}>
            <span className="home-nav__circle">{section.icon}</span>
            <span className="home-nav__label">{section.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}

export default HomePage;
