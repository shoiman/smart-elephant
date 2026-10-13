import type { Animal } from "../../types/animal";
import type { TranslationKey } from "../../shared/i18n/translations";
import { animals } from "./animals";

/** Backend animal names that differ from local image ids. */
const backendNameAliases: Readonly<Record<string, string>> = {
  hippopotamus: "hippo",
};

function normalize(name: string): string {
  return name.trim().toLowerCase();
}

/** Finds the local animal (with its original artwork) for a backend animal name. */
export function findAnimalByName(name: string | undefined): Animal | undefined {
  if (!name) return undefined;
  const key = normalize(name);
  const id = backendNameAliases[key] ?? key;
  return animals.find((animal) => animal.id === id);
}

/** Translation key for an animal name, if one exists (e.g. "animal.lion.name"). */
export function animalNameKey(name: string | undefined): TranslationKey | undefined {
  if (!name) return undefined;
  return `animal.${normalize(name)}.name` as TranslationKey;
}
