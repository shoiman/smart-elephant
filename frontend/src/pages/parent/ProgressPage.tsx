/**
 * "Progress": the parents' screen behind the gate (design/results-screen/results-redesign.html, screen 2).
 * The period switch changes every block; the level and the last games do not depend on it.
 */
import { useEffect, useState } from "react";

import { AnswersCard } from "../../modules/parent-progress/AnswersCard";
import { DailyTip } from "../../modules/parent-progress/DailyTip";
import { dayLabel } from "../../modules/parent-progress/format";
import { LevelCard } from "../../modules/parent-progress/LevelCard";
import { PeriodSwitch } from "../../modules/parent-progress/PeriodSwitch";
import { ProgressEmpty } from "../../modules/parent-progress/ProgressEmpty";
import { RecentGames } from "../../modules/parent-progress/RecentGames";
import { RepeatCard } from "../../modules/parent-progress/RepeatCard";
import { SummaryCard } from "../../modules/parent-progress/SummaryCard";
import { TopicsCard } from "../../modules/parent-progress/TopicsCard";
import type { ProgressPeriod, ProgressResponse } from "../../services/api-types";
import ProgressService from "../../services/progressService";
import { formatMessage, useI18n } from "../../shared/i18n";
import "../../modules/parent-progress/ParentProgress.css";

// Mock child ID - in real app, this would come from user auth/selection
const MOCK_CHILD_ID = 1;

export function ProgressPage() {
  const { t, language } = useI18n();
  const [period, setPeriod] = useState<ProgressPeriod>("week");
  const [progress, setProgress] = useState<ProgressResponse | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  /** Bumped by "retry" to load again */
  const [loadCount, setLoadCount] = useState(0);

  // State changes only in the response callbacks; a response for an older period is dropped
  useEffect(() => {
    let ignore = false;
    ProgressService.getProgress(MOCK_CHILD_ID, period)
      .then((response) => {
        if (ignore) return;
        setProgress(response);
        setStatus("ready");
      })
      .catch((error: unknown) => {
        if (ignore) return;
        console.error("Failed to load progress:", error);
        setStatus("error");
      });
    return () => {
      ignore = true;
    };
  }, [period, loadCount]);

  function changePeriod(next: ProgressPeriod) {
    if (next === period) return;
    setStatus("loading");
    setPeriod(next);
  }

  function retry() {
    setStatus("loading");
    setLoadCount((count) => count + 1);
  }

  const lastGame = progress?.lastGameAt
    ? formatMessage(t("progress.lastGame"), {
        day: dayLabel(progress.lastGameAt, language, t("progress.today"), t("progress.yesterday")),
      })
    : null;

  return (
    <section className="pp">
      <div>
        <h1 className="pp__title">{t("progress.title")}</h1>
        <p className="pp__sub">
          {t("progress.world")}
          {lastGame && ` · ${lastGame}`}
        </p>
      </div>

      <PeriodSwitch onChange={changePeriod} value={period} />

      {status === "loading" && <p className="pp__status">{t("game.loading")}</p>}

      {status === "error" && (
        <div className="pp__status" role="alert">
          <p>{t("game.error")}</p>
          <button className="btn btn--primary btn--lg" onClick={retry} type="button">
            {t("game.retry")}
          </button>
        </div>
      )}

      {status === "ready" && progress && progress.games === 0 && <ProgressEmpty />}

      {status === "ready" && progress && progress.games > 0 && (
        <>
          <SummaryCard progress={progress} />
          {progress.answers.total > 0 && <AnswersCard answers={progress.answers} />}
          <LevelCard />
          {progress.topics.length > 0 && <TopicsCard topics={progress.topics} />}
          {progress.repeat.length > 0 && <RepeatCard repeat={progress.repeat} />}
          {progress.repeat.length > 0 && <DailyTip pair={progress.repeat[0]} />}
          {progress.recentGames.length > 0 && <RecentGames games={progress.recentGames} />}
        </>
      )}
    </section>
  );
}

export default ProgressPage;
