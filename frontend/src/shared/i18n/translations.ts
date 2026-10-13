import type { Language } from "./types";

export interface TranslationMessages {
  readonly "app.name": string;
  readonly "languageSwitcher.label": string;
  readonly "app.tagline": string;
  readonly "nav.back": string;
  readonly "nav.home": string;
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
  readonly "home.greeting": string;
  readonly "home.start": string;
  readonly "nav.rewards": string;
  readonly "game.loading": string;
  readonly "game.listen": string;
  readonly "game.micStart": string;
  readonly "game.listening": string;
  readonly "game.checking": string;
  readonly "game.correctTitle": string;
  readonly "game.thisIs": string;
  readonly "game.incorrect": string;
  readonly "game.notHeard": string;
  readonly "game.together": string;
  readonly "game.again": string;
  readonly "game.next": string;
  readonly "game.heard": string;
  readonly "game.typePlaceholder": string;
  readonly "game.send": string;
  readonly "game.noSpeech": string;
  readonly "game.micDenied": string;
  readonly "game.error": string;
  readonly "game.retry": string;
  readonly "game.progress": string;
  readonly "game.unknownAnimal": string;
  readonly "reward.title": string;
  readonly "reward.subtitle": string;
  readonly "reward.score": string;
  readonly "reward.continue": string;
}

export type TranslationKey = keyof TranslationMessages;

export const translations: Readonly<Record<Language, TranslationMessages>> = {
  he: {
    "app.name": "הפיל החכם",
    "languageSwitcher.label": "בחירת שפה",
    "app.tagline": "משחקים · מדברים · גדלים",
    "nav.back": "חזרה",
    "nav.home": "לדף הבית",
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
    "home.greeting": "שלום! בואו נשחק ונכיר חיות!",
    "home.start": "בואו נשחק",
    "nav.rewards": "פרסים",
    "game.loading": "רגע, מכינים שאלה…",
    "game.listen": "להקשיב לשאלה",
    "game.micStart": "לחצו ודברו",
    "game.listening": "מקשיב…",
    "game.checking": "בודק…",
    "game.correctTitle": "נכון!",
    "game.thisIs": "זה {name}!",
    "game.incorrect": "כמעט! ננסה שוב?",
    "game.notHeard": "לא שמעתי. ננסה שוב?",
    "game.together": "בואו נגיד יחד:",
    "game.again": "שוב",
    "game.next": "הלאה",
    "game.heard": "שמעתי:",
    "game.typePlaceholder": "הקלידו תשובה",
    "game.send": "שליחה",
    "game.noSpeech": "המיקרופון לא זמין בדפדפן הזה — אפשר להקליד תשובה",
    "game.micDenied": "אין גישה למיקרופון. אפשרו גישה בהגדרות הדפדפן.",
    "game.error": "משהו השתבש. ננסה שוב?",
    "game.retry": "לנסות שוב",
    "game.progress": "שאלה {current} מתוך {total}",
    "game.unknownAnimal": "אין תמונה לחיה הזו",
    "reward.title": "מצוין!",
    "reward.subtitle": "כל הכבוד, אלופים!",
    "reward.score": "תשובות נכונות: {correct} מתוך {total}",
    "reward.continue": "ממשיכים",
  },
  ru: {
    "app.name": "Умный слон",
    "languageSwitcher.label": "Выбор языка",
    "app.tagline": "Играем · Говорим · Растём",
    "nav.back": "Назад",
    "nav.home": "На главную",
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
    "home.greeting": "Привет! Давай играть и узнавать животных!",
    "home.start": "Начать игру",
    "nav.rewards": "Награды",
    "game.loading": "Сейчас будет вопрос…",
    "game.listen": "Послушать вопрос",
    "game.micStart": "Нажми и скажи",
    "game.listening": "Слушаю…",
    "game.checking": "Проверяю…",
    "game.correctTitle": "Правильно!",
    "game.thisIs": "Это {name}!",
    "game.incorrect": "Почти! Попробуем ещё?",
    "game.notHeard": "Не расслышал. Попробуем ещё?",
    "game.together": "Давай скажем вместе:",
    "game.again": "Ещё раз",
    "game.next": "Дальше",
    "game.heard": "Я услышал:",
    "game.typePlaceholder": "Напиши ответ",
    "game.send": "Отправить",
    "game.noSpeech": "Микрофон недоступен в этом браузере — можно написать ответ",
    "game.micDenied": "Нет доступа к микрофону. Разреши его в настройках браузера.",
    "game.error": "Что-то пошло не так. Попробуем снова?",
    "game.retry": "Попробовать снова",
    "game.progress": "Вопрос {current} из {total}",
    "game.unknownAnimal": "Для этого животного нет картинки",
    "reward.title": "Отлично!",
    "reward.subtitle": "Ты большой молодец!",
    "reward.score": "Правильных ответов: {correct} из {total}",
    "reward.continue": "Продолжить",
  },
  uk: {
    "app.name": "Розумний слон",
    "languageSwitcher.label": "Вибір мови",
    "app.tagline": "Граємо · Говоримо · Ростемо",
    "nav.back": "Назад",
    "nav.home": "На головну",
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
    "home.greeting": "Привіт! Давай гратися та знайомитися з тваринами!",
    "home.start": "Почати гру",
    "nav.rewards": "Нагороди",
    "game.loading": "Зараз буде питання…",
    "game.listen": "Послухати питання",
    "game.micStart": "Натисни і скажи",
    "game.listening": "Слухаю…",
    "game.checking": "Перевіряю…",
    "game.correctTitle": "Правильно!",
    "game.thisIs": "Це {name}!",
    "game.incorrect": "Майже! Спробуємо ще?",
    "game.notHeard": "Не почув. Спробуємо ще?",
    "game.together": "Давай скажемо разом:",
    "game.again": "Ще раз",
    "game.next": "Далі",
    "game.heard": "Я почув:",
    "game.typePlaceholder": "Напиши відповідь",
    "game.send": "Надіслати",
    "game.noSpeech": "Мікрофон недоступний у цьому браузері — можна написати відповідь",
    "game.micDenied": "Немає доступу до мікрофона. Дозволь його в налаштуваннях браузера.",
    "game.error": "Щось пішло не так. Спробуємо знову?",
    "game.retry": "Спробувати знову",
    "game.progress": "Питання {current} з {total}",
    "game.unknownAnimal": "Для цієї тварини немає картинки",
    "reward.title": "Чудово!",
    "reward.subtitle": "Ти великий молодець!",
    "reward.score": "Правильних відповідей: {correct} з {total}",
    "reward.continue": "Продовжити",
  },
};
