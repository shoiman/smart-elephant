import rawAnimalOptions from "./animalOptions.json";
import { parseAnimalOptions } from "./parseAnimalOptions";
import type { AnimalOptions } from "./types";

// Parsed once when the module is first imported
const animalOptions = parseAnimalOptions(rawAnimalOptions);

export function findAnimalOptions(animalId: string | undefined): AnimalOptions | undefined {
  return animalId ? animalOptions.get(animalId) : undefined;
}
