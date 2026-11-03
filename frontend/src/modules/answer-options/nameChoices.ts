import { animals } from "../../data/animals/animals";
import type { Animal } from "../../types/animal";
import { findAnimalOptions } from "./animalOptions";
import { buildChoices, toOptionTopic } from "./buildChoices";
import type { AnswerLevel, Choice } from "./types";

/**
 * Animals that are never shown together as "Who is this?" cards:
 * they look alike (horse/zebra, tiger/leopard) or their names sound alike in one of the languages
 * (корова/сова/божья коровка, פרה/פרפר, uk кінь/коник), so a child could pick the wrong one by mistake.
 */
const CONFUSABLE_GROUPS: readonly (readonly string[])[] = [
  ["horse", "zebra", "alpaca", "moose"],
  ["sheep", "goat", "alpaca"],
  ["lion", "tiger", "leopard"],
  ["pig", "boar", "hippo", "rhino"],
  ["chicken", "duck", "bird", "raven", "owl", "parrot", "swan", "heron"],
  ["whale", "dolphin", "shark", "tuna", "catfish"],
  ["bee", "fly", "dragonfly"],
  ["cow", "owl", "ladybug", "butterfly"],
  ["horse", "grasshopper"],
];

function areConfusable(a: string, b: string): boolean {
  return CONFUSABLE_GROUPS.some((group) => group.includes(a) && group.includes(b));
}

function shuffle<T>(items: readonly T[], random: () => number): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Cards for "Who is this?": the animal itself plus other animals (1 on the toddler level, 3 otherwise),
 * in random order. Other animals come from other habitats and are never confusable with the animal
 * or with each other; the habitat rule is relaxed only if there are not enough animals.
 */
export function buildNameChoices(animalId: string | undefined, level: AnswerLevel, random: () => number = Math.random): Choice[] {
  const target = animals.find((animal) => animal.id === animalId);
  if (!target) return [];
  const count = level === "toddler" ? 1 : 3;

  const pool = shuffle(
    animals.filter((animal) => animal.id !== target.id && !areConfusable(animal.id, target.id)),
    random,
  );
  const picked: Animal[] = [];
  for (const strict of [true, false]) {
    for (const animal of pool) {
      if (picked.length >= count) break;
      if (picked.includes(animal) || picked.some((other) => areConfusable(other.id, animal.id))) continue;
      const habitatTaken = animal.habitat === target.habitat || picked.some((other) => other.habitat === animal.habitat);
      if (strict && habitatTaken) continue;
      picked.push(animal);
    }
  }

  return shuffle(
    [
      { id: target.id, topic: "animal", isCorrect: true },
      ...picked.map((animal): Choice => ({ id: animal.id, topic: "animal", isCorrect: false })),
    ],
    random,
  );
}

/** Cards for any question: animal cards for NAME, answer-option cards for HABITAT / DIET / COLOR, none otherwise. */
export function buildQuestionChoices(animalId: string | undefined, backendTopic: string | undefined, level: AnswerLevel): Choice[] {
  if (backendTopic?.toUpperCase() === "NAME") return buildNameChoices(animalId, level);
  return buildChoices(findAnimalOptions(animalId), toOptionTopic(backendTopic), level);
}
