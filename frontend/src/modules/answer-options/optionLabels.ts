import { findAnimalByName } from "../../data/animals/lookup";
import type { Language } from "../../shared/i18n";
import type { Choice, OptionId } from "./types";

/** Card captions; the same word is sent to the backend when a toddler taps a card. */
export const optionLabels: Readonly<Record<Language, Readonly<Record<OptionId, string>>>> = {
  he: {
    forest: "יער", savanna: "סוואנה", jungle: "ג׳ונגל", sea: "ים", river: "נהר",
    farm: "חווה", house: "בית", arctic: "קרח", desert: "מדבר", mountains: "הרים",
    grass: "עשב", leaves: "עלים", banana: "בננה", meat: "בשר", fish: "דגים", carrot: "גזר",
    grain: "זרעים", insects: "חרקים", nuts: "אגוזים", honey: "דבש", bamboo: "במבוק", milk: "חלב", flowers: "פרחים",
    gray: "אפור", brown: "חום", orange: "כתום", yellow: "צהוב", white: "לבן",
    black: "שחור", pink: "ורוד", green: "ירוק", blue: "כחול", red: "אדום", purple: "סגול",
  },
  ru: {
    forest: "лес", savanna: "саванна", jungle: "джунгли", sea: "море", river: "река",
    farm: "ферма", house: "дом", arctic: "льды", desert: "пустыня", mountains: "горы",
    grass: "трава", leaves: "листья", banana: "бананы", meat: "мясо", fish: "рыба", carrot: "морковка",
    grain: "зёрна", insects: "жучки", nuts: "орехи", honey: "мёд", bamboo: "бамбук", milk: "молоко", flowers: "цветы",
    gray: "серый", brown: "коричневый", orange: "оранжевый", yellow: "жёлтый", white: "белый",
    black: "чёрный", pink: "розовый", green: "зелёный", blue: "синий", red: "красный", purple: "фиолетовый",
  },
  uk: {
    forest: "ліс", savanna: "савана", jungle: "джунглі", sea: "море", river: "річка",
    farm: "ферма", house: "дім", arctic: "крига", desert: "пустеля", mountains: "гори",
    grass: "трава", leaves: "листя", banana: "банани", meat: "м'ясо", fish: "риба", carrot: "морква",
    grain: "зерна", insects: "жучки", nuts: "горіхи", honey: "мед", bamboo: "бамбук", milk: "молоко", flowers: "квіти",
    gray: "сірий", brown: "коричневий", orange: "помаранчевий", yellow: "жовтий", white: "білий",
    black: "чорний", pink: "рожевий", green: "зелений", blue: "синій", red: "червоний", purple: "фіолетовий",
  },
};

/**
 * Caption of any card; the same word is sent to the backend when a toddler taps it.
 * Animal cards use the animal's name in lower case like the other cards ("Или корова?"); Hebrew has no case.
 */
export function choiceLabel(choice: Choice, language: Language): string {
  if (choice.topic === "animal") {
    const name = findAnimalByName(choice.id)?.names[language] ?? choice.id;
    return name.toLocaleLowerCase(language);
  }
  return optionLabels[language][choice.id as OptionId];
}
