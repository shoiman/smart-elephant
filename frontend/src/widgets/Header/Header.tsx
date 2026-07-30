import { useI18n } from "../../shared/i18n";
import { LanguageSwitcher } from "../LanguageSwitcher/LanguageSwitcher";

export function Header() {
  const { t } = useI18n();

  return (
    <header>
      <h2>{t("app.name")}</h2>
      <LanguageSwitcher />
    </header>
  );
}
