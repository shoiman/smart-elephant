import type { Language } from "./types";

export interface TranslationMessages {
  readonly "app.name": string;
  readonly "languageSwitcher.label": string;
  readonly "home.title": string;
  readonly "animals.title": string;
  readonly "animals.subtitle": string;
  readonly "animals.savanna.title": string;
  readonly "games.title": string;
  readonly "progress.title": string;
  readonly "animal.elephant.name": string;
  readonly "animal.elephant.habitat": string;
  readonly "animal.lion.name": string;
  readonly "animal.lion.habitat": string;
  readonly "animal.penguin.name": string;
  readonly "animal.penguin.habitat": string;
  readonly "animal.giraffe.name": string;
  readonly "animal.giraffe.habitat": string;
  readonly "animal.hippopotamus.name": string;
  readonly "animal.hippopotamus.habitat": string;
  readonly "animal.zebra.name": string;
  readonly "animal.zebra.habitat": string;
  readonly "animal.leopard.name": string;
  readonly "animal.leopard.habitat": string;
}

export type TranslationKey = keyof TranslationMessages;

export const translations: Readonly<Record<Language, TranslationMessages>> = {
  he: {
    "app.name": "הפיל החכם", "languageSwitcher.label": "בחירת שפה", "home.title": "ברוכים הבאים לפיל החכם", "animals.title": "חיות", "animals.subtitle": "בואו נכיר חברים חדשים", "animals.savanna.title": "חיות הסוואנה", "games.title": "משחקים", "progress.title": "ההתקדמות שלי", "animal.elephant.name": "פיל", "animal.elephant.habitat": "סוואנה", "animal.lion.name": "אריה", "animal.lion.habitat": "סוואנה", "animal.penguin.name": "פינגווין", "animal.penguin.habitat": "אנטארקטיקה", "animal.giraffe.name": "ג׳ירפה", "animal.giraffe.habitat": "סוואנה", "animal.hippopotamus.name": "היפופוטם", "animal.hippopotamus.habitat": "סוואנה", "animal.zebra.name": "זברה", "animal.zebra.habitat": "סוואנה", "animal.leopard.name": "נמר", "animal.leopard.habitat": "סוואנה",
  },
  ru: {
    "app.name": "Умный слон", "languageSwitcher.label": "Выбор языка", "home.title": "Добро пожаловать в «Умного слона»", "animals.title": "Животные", "animals.subtitle": "Познакомься с новыми друзьями", "animals.savanna.title": "Животные саванны", "games.title": "Игры", "progress.title": "Мой прогресс", "animal.elephant.name": "Слон", "animal.elephant.habitat": "Саванна", "animal.lion.name": "Лев", "animal.lion.habitat": "Саванна", "animal.penguin.name": "Пингвин", "animal.penguin.habitat": "Антарктика", "animal.giraffe.name": "Жираф", "animal.giraffe.habitat": "Саванна", "animal.hippopotamus.name": "Бегемот", "animal.hippopotamus.habitat": "Саванна", "animal.zebra.name": "Зебра", "animal.zebra.habitat": "Саванна", "animal.leopard.name": "Леопард", "animal.leopard.habitat": "Саванна",
  },
  uk: {
    "app.name": "Розумний слон", "languageSwitcher.label": "Вибір мови", "home.title": "Ласкаво просимо до «Розумного слона»", "animals.title": "Тварини", "animals.subtitle": "Познайомся з новими друзями", "animals.savanna.title": "Тварини савани", "games.title": "Ігри", "progress.title": "Мій прогрес", "animal.elephant.name": "Слон", "animal.elephant.habitat": "Савана", "animal.lion.name": "Лев", "animal.lion.habitat": "Савана", "animal.penguin.name": "Пінгвін", "animal.penguin.habitat": "Антарктика", "animal.giraffe.name": "Жираф", "animal.giraffe.habitat": "Савана", "animal.hippopotamus.name": "Бегемот", "animal.hippopotamus.habitat": "Савана", "animal.zebra.name": "Зебра", "animal.zebra.habitat": "Савана", "animal.leopard.name": "Леопард", "animal.leopard.habitat": "Савана",
  },
};
