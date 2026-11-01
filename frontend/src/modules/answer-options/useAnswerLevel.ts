import { useCallback, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { DEFAULT_LEVEL, isAnswerLevel, loadStoredLevel, saveLevel } from "./levelStorage";
import type { AnswerLevel } from "./types";

/**
 * Level used by the game: ?level=… in the URL (handy for testing) wins,
 * then the age the parent chose on the home page, then the default.
 */
export function useAnswerLevel(): AnswerLevel {
  const [searchParams] = useSearchParams();
  const fromUrl = searchParams.get("level");
  return isAnswerLevel(fromUrl) ? fromUrl : (loadStoredLevel() ?? DEFAULT_LEVEL);
}

/** The parent's age choice on the home page, remembered on this device. */
export function useLevelPreference(): readonly [AnswerLevel, (level: AnswerLevel) => void] {
  const [level, setLevel] = useState<AnswerLevel>(() => loadStoredLevel() ?? DEFAULT_LEVEL);

  const changeLevel = useCallback((next: AnswerLevel) => {
    setLevel(next);
    saveLevel(next);
  }, []);

  return [level, changeLevel] as const;
}
