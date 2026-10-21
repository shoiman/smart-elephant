import type { Language } from "../shared/i18n";

/** Animal categories; the same values as "category" in the backend content files. */
export type AnimalCategory =
  | "farm"
  | "savanna"
  | "jungle"
  | "forest"
  | "river_lake"
  | "sea"
  | "australia"
  | "garden"
  | "cold";

export interface Animal {
  /** Image and content id, e.g. "hippo" */
  id: string;
  /** English name as the backend sends it in animalName, e.g. "Hippopotamus" */
  name: string;
  image: string;
  habitat: AnimalCategory;
  /** Name shown to the child, in every UI language */
  names: Readonly<Record<Language, string>>;
}
