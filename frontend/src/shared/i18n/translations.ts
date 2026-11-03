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
  readonly "level.label": string;
  readonly "level.toddler": string;
  readonly "level.middle": string;
  readonly "level.older": string;
  readonly "level.toddler.hint": string;
  readonly "level.middle.hint": string;
  readonly "level.older.hint": string;
  readonly "reward.title": string;
  readonly "reward.subtitle": string;
  readonly "reward.score": string;
  readonly "reward.continue": string;
  readonly "stars.title": string;
  readonly "stars.greetingNew": string;
  readonly "stars.greeting": string;
  readonly "stars.greetingEmpty": string;
  readonly "stars.soon": string;
  readonly "stars.listen": string;
  readonly "stars.today": string;
  readonly "stars.album": string;
  readonly "stars.next": string;
  readonly "stars.playMore": string;
  readonly "stars.parents": string;
  readonly "parentGate.title": string;
  readonly "parentGate.hint": string;
  readonly "parentGate.hold": string;
  readonly "parentGate.back": string;
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
    "question.whoIsIt": "מי זה?",
    "reward.excellent": "כל הכבוד!",
    "home.greeting": "שלום! בואו נשחק ונכיר חיות!",
    "home.start": "בואו נשחק",
    "nav.rewards": "פרסים",
    "game.loading": "רגע, מכינים שאלה…",
    "game.listen": "להקשיב לשאלה",
    "game.micStart": "לחצו ודברו",
    "game.listening": "מקשיבה…",
    "game.checking": "בודקת…",
    "game.correctTitle": "נכון!",
    "game.thisIs": "זה {name}!",
    "game.incorrect": "ננסה שוב?",
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
    "level.label": "רמה",
    "level.toddler": "מצביע",
    "level.middle": "עם רמז",
    "level.older": "לבד",
    "level.toddler.hint": "הילד בוחר מבין שתי תמונות — אפשר פשוט ללחוץ",
    "level.middle.hint": "ארבע תמונות עוזרות לענות בקול",
    "level.older.hint": "הילד עונה לבד, תמונות — רק אם קשה",
    "reward.title": "מצוין!",
    "reward.subtitle": "כל הכבוד, אלופים!",
    "reward.score": "תשובות נכונות: {correct} מתוך {total}",
    "reward.continue": "ממשיכים",
    "stars.title": "הכוכבים שלי",
    "stars.greetingNew": "יש! חברים חדשים באלבום!",
    "stars.greeting": "תראו כמה חברים יש לכם!",
    "stars.greetingEmpty": "בואו נאסוף חברים לאלבום!",
    "stars.soon": "עוד מעט נכיר!",
    "stars.listen": "להקשיב",
    "stars.today": "הכוכבים של היום",
    "stars.album": "האלבום שלי",
    "stars.next": "חבר חדש",
    "stars.playMore": "משחקים עוד",
    "stars.parents": "להורים",
    "parentGate.title": "להורים",
    "parentGate.hint": "לחצו והחזיקו 3 שניות",
    "parentGate.hold": "החזיקו כדי לפתוח",
    "parentGate.back": "חזרה לכוכבים",
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
    "game.incorrect": "Попробуем ещё?",
    "game.notHeard": "Не расслышала. Попробуем ещё?",
    "game.together": "Давай скажем вместе:",
    "game.again": "Ещё раз",
    "game.next": "Дальше",
    "game.heard": "Я услышала:",
    "game.typePlaceholder": "Напиши ответ",
    "game.send": "Отправить",
    "game.noSpeech": "Микрофон недоступен в этом браузере — можно написать ответ",
    "game.micDenied": "Нет доступа к микрофону. Разреши его в настройках браузера.",
    "game.error": "Что-то пошло не так. Попробуем снова?",
    "game.retry": "Попробовать снова",
    "game.progress": "Вопрос {current} из {total}",
    "game.unknownAnimal": "Для этого животного нет картинки",
    "level.label": "Уровень",
    "level.toddler": "Показываю",
    "level.middle": "С подсказкой",
    "level.older": "Сам",
    "level.toddler.hint": "Ребёнок выбирает из двух картинок — можно просто нажать",
    "level.middle.hint": "Четыре картинки помогают ответить голосом",
    "level.older.hint": "Ребёнок отвечает сам, картинки — если трудно",
    "reward.title": "Отлично!",
    "reward.subtitle": "Ты большой молодец!",
    "reward.score": "Правильных ответов: {correct} из {total}",
    "reward.continue": "Продолжить",
    "stars.title": "Мои звёзды",
    "stars.greetingNew": "Ура! Новые друзья в альбоме!",
    "stars.greeting": "Смотри, сколько у тебя друзей!",
    "stars.greetingEmpty": "Давай соберём друзей в альбом!",
    "stars.soon": "Скоро познакомимся!",
    "stars.listen": "Послушать",
    "stars.today": "Звёзды за сегодня",
    "stars.album": "Мой альбом",
    "stars.next": "Новый друг",
    "stars.playMore": "Играть ещё",
    "stars.parents": "Для родителей",
    "parentGate.title": "Для родителей",
    "parentGate.hint": "Нажмите и держите 3 секунды",
    "parentGate.hold": "Держите, чтобы открыть",
    "parentGate.back": "Назад к звёздам",
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
    "game.incorrect": "Спробуємо ще?",
    "game.notHeard": "Не почула. Спробуємо ще?",
    "game.together": "Давай скажемо разом:",
    "game.again": "Ще раз",
    "game.next": "Далі",
    "game.heard": "Я почула:",
    "game.typePlaceholder": "Напиши відповідь",
    "game.send": "Надіслати",
    "game.noSpeech": "Мікрофон недоступний у цьому браузері — можна написати відповідь",
    "game.micDenied": "Немає доступу до мікрофона. Дозволь його в налаштуваннях браузера.",
    "game.error": "Щось пішло не так. Спробуємо знову?",
    "game.retry": "Спробувати знову",
    "game.progress": "Питання {current} з {total}",
    "game.unknownAnimal": "Для цієї тварини немає картинки",
    "level.label": "Рівень",
    "level.toddler": "Показую",
    "level.middle": "З підказкою",
    "level.older": "Сам",
    "level.toddler.hint": "Дитина обирає з двох картинок — можна просто натиснути",
    "level.middle.hint": "Чотири картинки допомагають відповісти голосом",
    "level.older.hint": "Дитина відповідає сама, картинки — якщо важко",
    "reward.title": "Чудово!",
    "reward.subtitle": "Ти великий молодець!",
    "reward.score": "Правильних відповідей: {correct} з {total}",
    "reward.continue": "Продовжити",
    "stars.title": "Мої зірки",
    "stars.greetingNew": "Ура! Нові друзі в альбомі!",
    "stars.greeting": "Дивись, скільки в тебе друзів!",
    "stars.greetingEmpty": "Збираймо друзів в альбом!",
    "stars.soon": "Скоро познайомимося!",
    "stars.listen": "Послухати",
    "stars.today": "Зірки за сьогодні",
    "stars.album": "Мій альбом",
    "stars.next": "Новий друг",
    "stars.playMore": "Грати ще",
    "stars.parents": "Для батьків",
    "parentGate.title": "Для батьків",
    "parentGate.hint": "Натисніть і тримайте 3 секунди",
    "parentGate.hold": "Тримайте, щоб відкрити",
    "parentGate.back": "Назад до зірок",
  },
};
