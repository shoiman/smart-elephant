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
  readonly "progress.subtitle": string;
  readonly "progress.loading": string;
  readonly "progress.error": string;
  readonly "progress.totalGames": string;
  readonly "progress.successRate": string;
  readonly "progress.currentLevel": string;
  readonly "progress.correctAnswers": string;
  readonly "progress.overallProgress": string;
  readonly "progress.correct": string;
  readonly "progress.recentGames": string;
  readonly "progress.points": string;
  readonly "progress.analysis": string;
  readonly "progress.analyzing": string;
  readonly "progress.analyzeProgress": string;
  readonly "progress.strengths": string;
  readonly "progress.improvements": string;
  readonly "progress.recommendations": string;
  readonly "progress.nextDifficulty": string;
  readonly "progress.projectedLevel": string;
  readonly "progress.lastGameAt": string;
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
  readonly "question.whoIsIt": string;
  readonly "reward.excellent": string;
}

export type TranslationKey = keyof TranslationMessages;

export const translations: Readonly<Record<Language, TranslationMessages>> = {
  he: {
    "app.name": "הפיל החכם",
    "languageSwitcher.label": "בחירת שפה",
    "home.title": "ברוכים הבאים לפיל החכם",
    "animals.title": "חיות",
    "animals.subtitle": "בואו נכיר חברים חדשים",
    "animals.savanna.title": "חיות הסוואנה",
    "games.title": "משחקים",
    "progress.title": "ההתקדמות שלי",
    "progress.subtitle": "עקוב אחר ההתקדמות החינוכית שלך",
    "progress.loading": "טוען תוכן...",
    "progress.error": "שגיאה בטעינת נתונים",
    "progress.totalGames": "סה״כ משחקים",
    "progress.successRate": "שיעור הצלחה",
    "progress.currentLevel": "רמה נוכחית",
    "progress.correctAnswers": "תשובות נכונות",
    "progress.overallProgress": "התקדמות כוללת",
    "progress.correct": "נכון",
    "progress.recentGames": "משחקים אחרונים",
    "progress.points": "נקודות",
    "progress.analysis": "ניתוח מפורט",
    "progress.analyzing": "מנתח...",
    "progress.analyzeProgress": "בקש ניתוח",
    "progress.strengths": "חוזקות",
    "progress.improvements": "תחומי שיפור",
    "progress.recommendations": "המלצות",
    "progress.nextDifficulty": "רמת קושי הבאה",
    "progress.projectedLevel": "רמה צפויה",
    "progress.lastGameAt": "המשחק האחרון",
    "animal.elephant.name": "פיל",
    "animal.elephant.habitat": "סוואנה",
    "animal.lion.name": "אריה",
    "animal.lion.habitat": "סוואנה",
    "animal.penguin.name": "פינגווין",
    "animal.penguin.habitat": "אנטארקטיקה",
    "animal.giraffe.name": "ג׳ירפה",
    "animal.giraffe.habitat": "סוואנה",
    "animal.hippopotamus.name": "היפופוטם",
    "animal.hippopotamus.habitat": "סוואנה",
    "animal.zebra.name": "זברה",
    "animal.zebra.habitat": "סוואנה",
    "animal.leopard.name": "נמר",
    "animal.leopard.habitat": "סוואנה",
    "question.whoIsIt": "מי זה?",
    "reward.excellent": "כל הכבוד!",
  },
  ru: {
    "app.name": "Умный слон",
    "languageSwitcher.label": "Выбор языка",
    "home.title": "Добро пожаловать в «Умного слона»",
    "animals.title": "Животные",
    "animals.subtitle": "Познакомься с новыми друзьями",
    "animals.savanna.title": "Животные саванны",
    "games.title": "Игры",
    "progress.title": "Мой прогресс",
    "progress.subtitle": "Следи за своим образовательным развитием",
    "progress.loading": "Загрузка...",
    "progress.error": "Ошибка при загрузке данных",
    "progress.totalGames": "Всего игр",
    "progress.successRate": "Процент успеха",
    "progress.currentLevel": "Текущий уровень",
    "progress.correctAnswers": "Правильные ответы",
    "progress.overallProgress": "Общий прогресс",
    "progress.correct": "правильно",
    "progress.recentGames": "Недавние игры",
    "progress.points": "очков",
    "progress.analysis": "Подробный анализ",
    "progress.analyzing": "Анализирует...",
    "progress.analyzeProgress": "Запросить анализ",
    "progress.strengths": "Сильные стороны",
    "progress.improvements": "Области для улучшения",
    "progress.recommendations": "Рекомендации",
    "progress.nextDifficulty": "Следующий уровень сложности",
    "progress.projectedLevel": "Прогнозируемый уровень",
    "progress.lastGameAt": "Последняя игра",
    "animal.elephant.name": "Слон",
    "animal.elephant.habitat": "Саванна",
    "animal.lion.name": "Лев",
    "animal.lion.habitat": "Саванна",
    "animal.penguin.name": "Пингвин",
    "animal.penguin.habitat": "Антарктика",
    "animal.giraffe.name": "Жираф",
    "animal.giraffe.habitat": "Саванна",
    "animal.hippopotamus.name": "Бегемот",
    "animal.hippopotamus.habitat": "Саванна",
    "animal.zebra.name": "Зебра",
    "animal.zebra.habitat": "Саванна",
    "animal.leopard.name": "Леопард",
    "animal.leopard.habitat": "Саванна",
    "question.whoIsIt": "Кто это?",
    "reward.excellent": "Молодец!",
  },
  uk: {
    "app.name": "Розумний слон",
    "languageSwitcher.label": "Вибір мови",
    "home.title": "Ласкаво просимо до «Розумного слона»",
    "animals.title": "Тварини",
    "animals.subtitle": "Познайомся з новими друзями",
    "animals.savanna.title": "Тварини савани",
    "games.title": "Ігри",
    "progress.title": "Мій прогрес",
    "progress.subtitle": "Слідкуй за своїм навчальним розвитком",
    "progress.loading": "Завантаження...",
    "progress.error": "Помилка при завантаженні даних",
    "progress.totalGames": "Всього ігор",
    "progress.successRate": "Відсоток успіху",
    "progress.currentLevel": "Поточний рівень",
    "progress.correctAnswers": "Правильні відповіді",
    "progress.overallProgress": "Загальний прогрес",
    "progress.correct": "правильно",
    "progress.recentGames": "Недавні ігри",
    "progress.points": "очків",
    "progress.analysis": "Детальний аналіз",
    "progress.analyzing": "Аналізує...",
    "progress.analyzeProgress": "Запросити аналіз",
    "progress.strengths": "Сильні сторони",
    "progress.improvements": "Області для поліпшення",
    "progress.recommendations": "Рекомендації",
    "progress.nextDifficulty": "Наступний рівень складності",
    "progress.projectedLevel": "Прогнозований рівень",
    "progress.lastGameAt": "Остання гра",
    "animal.elephant.name": "Слон",
    "animal.elephant.habitat": "Савана",
    "animal.lion.name": "Лев",
    "animal.lion.habitat": "Савана",
    "animal.penguin.name": "Пінгвін",
    "animal.penguin.habitat": "Антарктика",
    "animal.giraffe.name": "Жираф",
    "animal.giraffe.habitat": "Савана",
    "animal.hippopotamus.name": "Бегемот",
    "animal.hippopotamus.habitat": "Савана",
    "animal.zebra.name": "Зебра",
    "animal.zebra.habitat": "Савана",
    "animal.leopard.name": "Леопард",
    "animal.leopard.habitat": "Савана",
    "question.whoIsIt": "Хто це?",
    "reward.excellent": "Молодець!",
  },
};
