import type { AnimalOptions, AnswerLevel, Choice, OptionTopic } from "./types";

/** Backend Question.topic → picture-card topic. Other topics (SOUND, SIZE, UNIQUE) have no cards. */
const BACKEND_TOPICS: Readonly<Record<string, OptionTopic>> = {
  HABITAT: "habitat",
  DIET: "food",
  COLOR: "color",
};

export function toOptionTopic(backendTopic: string | undefined): OptionTopic | undefined {
  return backendTopic ? BACKEND_TOPICS[backendTopic.toUpperCase()] : undefined;
}

function shuffle<T>(items: readonly T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Picks the cards to show: one correct answer plus wrong options for the level, in random order.
 * Returns an empty list when the animal or topic has no data — the game then works by voice only.
 */
export function buildChoices(animalOptions: AnimalOptions | undefined, topic: OptionTopic | undefined, level: AnswerLevel): Choice[] {
  if (!animalOptions || !topic) return [];
  const topicOptions = animalOptions.options[topic];
  if (!topicOptions) return [];

  const correct = topicOptions.correct[0];
  const wrong = level === "toddler" ? topicOptions.easy.slice(0, 1) : topicOptions.medium.slice(0, 3);
  if (wrong.length === 0) return [];

  return shuffle([
    { id: correct, topic, isCorrect: true },
    ...wrong.map((id) => ({ id, topic, isCorrect: false })),
  ]);
}

/** On the older level the cards appear only after the first wrong attempt. */
export function shouldShowChoices(level: AnswerLevel, attempts: number): boolean {
  return level !== "older" || attempts > 0;
}
