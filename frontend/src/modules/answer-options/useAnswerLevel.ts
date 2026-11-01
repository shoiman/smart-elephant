import { useSearchParams } from "react-router-dom";

import type { AnswerLevel } from "./types";

const LEVELS: readonly AnswerLevel[] = ["toddler", "middle", "older"];
const DEFAULT_LEVEL: AnswerLevel = "middle";

function isAnswerLevel(value: string | null): value is AnswerLevel {
  return value !== null && (LEVELS as readonly string[]).includes(value);
}

/**
 * Current answer level. For now it comes from the URL (?level=toddler) so every level
 * can be tested; step 2 replaces this with the parent's age choice.
 */
export function useAnswerLevel(): AnswerLevel {
  const [searchParams] = useSearchParams();
  const value = searchParams.get("level");
  return isAnswerLevel(value) ? value : DEFAULT_LEVEL;
}
