import type { Language } from "../../../shared/i18n";

/**
 * The host's lines around the answer cards (keys from the design spec).
 * {X} — card caption with a capital letter, {x} — as is (lower case in ru/uk mid-sentence).
 * The host is a girl elephant: feminine first-person forms. Hebrew addresses the child in plural.
 * No "almost" title in any language (Nata: no "Почти!/Майже!/כמעט" after a wrong answer), only "think again".
 * Later these lines move to the backend so Azure can voice them (plan, stage 3).
 */
export type HostPhraseKey =
  | "present.item"
  | "present.last"
  | "turn.pressMic"
  | "hint.sayWords"
  | "listen"
  | "right.title"
  | "right.text"
  | "almost.title"
  | "almost.text"
  | "almost.silence"
  | "together"
  | "say.repeat"
  | "say.again"
  | "notHeard.title"
  | "praise"
  | "praise.next";

const phrases: Readonly<Record<Language, Readonly<Record<HostPhraseKey, string>>>> = {
  ru: {
    "present.item": "{X}?",
    "present.last": "Или {x}?",
    "turn.pressMic": "Нажми на микрофон и скажи!",
    "hint.sayWords": "Скажи словами!",
    listen: "Слушаю…",
    "right.title": "Правильно!",
    "right.text": "{X}!",
    "almost.title": "",
    "almost.text": "Подумай ещё",
    "almost.silence": "Я не услышала. Скажи ещё раз",
    together: "Давай скажем вместе: {x}!",
    "say.repeat": "Теперь скажи: {x}!",
    "say.again": "Скажи ещё раз: {x}!",
    "notHeard.title": "Я не услышала.",
    praise: "Молодец!",
    "praise.next": "Хорошо! Идём дальше",
  },
  he: {
    "present.item": "{X}?",
    "present.last": "או {X}?",
    "turn.pressMic": "לחצו על המיקרופון ותגידו!",
    "hint.sayWords": "תגידו במילים!",
    listen: "אני מקשיבה…",
    "right.title": "נכון!",
    "right.text": "{X}!",
    "almost.title": "",
    "almost.text": "חשבו שוב",
    "almost.silence": "לא שמעתי. נסו שוב",
    together: "בואו נגיד ביחד: {X}!",
    "say.repeat": "עכשיו אומרים: {X}!",
    "say.again": "תגידו שוב: {X}!",
    "notHeard.title": "לא שמעתי.",
    praise: "כל הכבוד!",
    "praise.next": "יופי! ממשיכים",
  },
  uk: {
    "present.item": "{X}?",
    "present.last": "Або {x}?",
    "turn.pressMic": "Натисни на мікрофон і скажи!",
    "hint.sayWords": "Скажи словами!",
    listen: "Слухаю…",
    "right.title": "Правильно!",
    "right.text": "{X}!",
    "almost.title": "",
    "almost.text": "Подумай ще",
    "almost.silence": "Я не почула. Скажи ще раз",
    together: "Скажімо разом: {x}!",
    "say.repeat": "Тепер скажи: {x}!",
    "say.again": "Скажи ще раз: {x}!",
    "notHeard.title": "Я не почула.",
    praise: "Молодець!",
    "praise.next": "Добре! Йдемо далі",
  },
};

function capitalize(text: string): string {
  return text.charAt(0).toLocaleUpperCase() + text.slice(1);
}

/** Returns the host's line with the card caption filled in. */
export function hostPhrase(language: Language, key: HostPhraseKey, caption = ""): string {
  return phrases[language][key].replace("{X}", capitalize(caption)).replace("{x}", caption);
}
