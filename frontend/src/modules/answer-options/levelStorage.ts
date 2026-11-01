import type { AnswerLevel } from "./types";

const LEVEL_STORAGE_KEY = "smart-elephant.level";

export const ANSWER_LEVELS: readonly AnswerLevel[] = ["toddler", "middle", "older"];
export const DEFAULT_LEVEL: AnswerLevel = "middle";

export function isAnswerLevel(value: string | null): value is AnswerLevel {
  return value !== null && (ANSWER_LEVELS as readonly string[]).includes(value);
}

/** Level the parent chose on this device; storage may be unavailable (private mode). */
export function loadStoredLevel(): AnswerLevel | null {
  try {
    const value = window.localStorage.getItem(LEVEL_STORAGE_KEY);
    return isAnswerLevel(value) ? value : null;
  } catch {
    return null;
  }
}

export function saveLevel(level: AnswerLevel): void {
  try {
    window.localStorage.setItem(LEVEL_STORAGE_KEY, level);
  } catch {
    // Not critical: the game falls back to the default level
  }
}
