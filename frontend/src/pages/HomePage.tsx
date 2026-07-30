import { useI18n } from "../shared/i18n";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";

export function HomePage() {
  const { t } = useI18n();
  const navigate = useNavigate();

  return(
    <div className="home-page">
      <h1>{t("home.title")}</h1>
      <p>"слон works"</p>
      <button className="go-button" onClick={() => navigate("/games")}>
        Go
      </button>
    </div>
  )
}

export default HomePage;
