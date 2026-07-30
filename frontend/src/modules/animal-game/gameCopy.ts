import type { Language } from "../../shared/i18n";

export type HabitatId = "savanna" | "farm" | "riverLake";

interface GameCopy {
  readonly animalName: string;
  readonly habitats: Readonly<Record<HabitatId, string>>;
  readonly hint: string;
  readonly incorrect: string;
  readonly question: string;
  readonly restart: string;
  readonly successBody: string;
  readonly successTitle: string;
  readonly title: string;
}

export const animalGameCopy: Readonly<Record<Language, GameCopy>> = {
  he: {
    title: "מי גר כאן?",
    question: "איפה גר הפיל?",
    hint: "בחרו את הבית הנכון",
    animalName: "פיל",
    habitats: { savanna: "סוואנה", farm: "חווה", riverLake: "נהר ואגם" },
    incorrect: "כמעט! נסו שוב.",
    successTitle: "כל הכבוד!",
    successBody: "הפיל גר בסוואנה.",
    restart: "שחקו שוב",
  },
  ru: {
    title: "Кто где живёт?",
    question: "Где живёт слон?",
    hint: "Выбери правильный дом",
    animalName: "Слон",
    habitats: { savanna: "Саванна", farm: "Ферма", riverLake: "Река и озеро" },
    incorrect: "Почти! Попробуй ещё раз.",
    successTitle: "Ура! Правильно!",
    successBody: "Слон живёт в саванне.",
    restart: "Сыграть ещё раз",
  },
  uk: {
    title: "Хто де живе?",
    question: "Де живе слон?",
    hint: "Обери правильний дім",
    animalName: "Слон",
    habitats: { savanna: "Савана", farm: "Ферма", riverLake: "Річка й озеро" },
    incorrect: "Майже! Спробуй ще раз.",
    successTitle: "Ура! Правильно!",
    successBody: "Слон живе в савані.",
    restart: "Зіграти ще раз",
  },
};
