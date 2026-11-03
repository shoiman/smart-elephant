import elephantReading from "../../assets/characters/elephant-reading.png";
import { useI18n } from "../../shared/i18n";

/** No games in the chosen period */
export function ProgressEmpty() {
  const { t } = useI18n();
  return (
    <div className="pp-card pp-empty">
      <img alt="" className="pp-empty__host" draggable={false} src={elephantReading} />
      <p className="pp-empty__text">{t("progress.empty")}</p>
    </div>
  );
}
