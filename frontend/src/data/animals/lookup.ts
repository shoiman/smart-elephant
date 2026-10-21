import type { Animal } from "../../types/animal";
import { animals } from "./animals";

function normalize(name: string): string {
  return name.trim().toLowerCase();
}

/**
 * Finds the local animal (artwork + localized names) for the animal name sent by the backend.
 * Matches the English name ("Hippopotamus") or the id ("hippo").
 */
export function findAnimalByName(name: string | undefined): Animal | undefined {
  if (!name) return undefined;
  const key = normalize(name);
  return animals.find((animal) => animal.id === key || normalize(animal.name) === key);
}
