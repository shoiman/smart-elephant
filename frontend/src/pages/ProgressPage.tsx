import { useI18n } from "../shared/i18n";

export function ProgressPage() {
  const { t } = useI18n();

  return <h1>{t("progress.title")}</h1>;
}

export default ProgressPage;
