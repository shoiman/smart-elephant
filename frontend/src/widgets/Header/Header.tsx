import { Link, useLocation, useNavigate } from "react-router-dom";

import { ProgressDots } from "../../components/ProgressDots/ProgressDots";
import { ArrowBackIcon } from "../../shared/icons/Icons";
import { formatMessage, useI18n } from "../../shared/i18n";
import { usePageHeaderState } from "../../shared/layout/PageHeaderContext";
import { LanguageSwitcher } from "../LanguageSwitcher/LanguageSwitcher";
import "./Header.css";

export function Header() {
  const { t } = useI18n();
  const { config } = usePageHeaderState();
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/";

  function goBack() {
    // Fall back to home when the page was opened directly (no history entry)
    const historyState = window.history.state as { idx?: number } | null;
    if (historyState?.idx && historyState.idx > 0) {
      navigate(-1);
    } else {
      navigate("/");
    }
  }

  return (
    <header className="app-header">
      <div className="app-header__inner">
        <div className="app-header__side">
          {!isHome && (
            <button aria-label={t("nav.back")} className="app-header__back" onClick={goBack} type="button">
              <ArrowBackIcon className="app-header__back-icon" />
            </button>
          )}
        </div>

        <div className="app-header__center">
          {isHome ? (
            <Link aria-label={t("nav.home")} className="app-header__brand" to="/">
              <span className="app-header__name" dir="ltr">Smart Elephant</span>
              <span className="app-header__tagline">{t("app.tagline")}</span>
            </Link>
          ) : config.progress ? (
            <ProgressDots
              current={config.progress.current}
              label={formatMessage(t("game.progress"), config.progress)}
              total={config.progress.total}
            />
          ) : (
            config.title && <h1 className="app-header__title">{config.title}</h1>
          )}
        </div>

        <div className="app-header__side app-header__side--end">
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
}
