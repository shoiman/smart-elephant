/** Topics that can be answered with picture cards. */
export type OptionTopic = "habitat" | "food" | "color";

export const HABITAT_IDS = [
  "forest", "savanna", "jungle", "sea", "river", "farm", "house", "arctic", "desert", "mountains",
  // Garden insects live among flowers and grass; these reuse the food icons
  "flowers", "grass",
] as const;
export const FOOD_IDS = [
  "grass", "leaves", "banana", "meat", "fish", "carrot", "grain", "insects", "nuts", "honey", "bamboo", "milk", "flowers",
] as const;
export const COLOR_IDS = [
  "gray", "brown", "orange", "yellow", "white", "black", "pink", "green", "blue", "red", "purple",
] as const;

export type HabitatId = (typeof HABITAT_IDS)[number];
export type FoodId = (typeof FOOD_IDS)[number];
export type ColorId = (typeof COLOR_IDS)[number];
export type OptionId = HabitatId | FoodId | ColorId;

/** Answer options of one topic for one animal (see the ChatGPT prompt for the rules). */
export interface TopicOptions {
  /** Main answers the child is taught */
  readonly correct: readonly OptionId[];
  /** Also true — never shown as a wrong option */
  readonly alsoTrue: readonly OptionId[];
  /** 1 clearly wrong option for the toddler level */
  readonly easy: readonly OptionId[];
  /** 3 wrong options for the middle and older levels */
  readonly medium: readonly OptionId[];
}

export interface AnimalOptions {
  /** Animal id, the same as Animal.id in data/animals ("hippo") */
  readonly animal: string;
  readonly options: Readonly<Partial<Record<OptionTopic, TopicOptions>>>;
}

/**
 * How much picture support the child gets:
 * - toddler: 2 cards, tapping a card is an answer
 * - middle: 4 cards as a visual hint, the answer is spoken
 * - older: no cards until the first wrong attempt, then 4 cards
 */
export type AnswerLevel = "toddler" | "middle" | "older";

export interface Choice {
  readonly id: OptionId;
  readonly topic: OptionTopic;
  readonly isCorrect: boolean;
}
