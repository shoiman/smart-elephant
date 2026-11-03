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
  readonly "progress.title": string;
  readonly "progress.world": string;
  readonly "progress.lastGame": string;
  readonly "progress.today": string;
  readonly "progress.yesterday": string;
  readonly "progress.period.label": string;
  readonly "progress.period.week": string;
  readonly "progress.period.month": string;
  readonly "progress.period.all": string;
  readonly "progress.games": string;
  readonly "progress.minutes": string;
  readonly "progress.animals": string;
  readonly "progress.activity": string;
  readonly "progress.questions": string;
  readonly "progress.answers.title": string;
  readonly "progress.answers.firstTry": string;
  readonly "progress.answers.secondTry": string;
  readonly "progress.answers.together": string;
  readonly "progress.level.title": string;
  readonly "progress.level.note": string;
  readonly "progress.topics.title": string;
  readonly "progress.topic.NAME": string;
  readonly "progress.topic.HABITAT": string;
  readonly "progress.topic.COLOR": string;
  readonly "progress.topic.SOUND": string;
  readonly "progress.topic.DIET": string;
  readonly "progress.topic.SIZE": string;
  readonly "progress.topic.UNIQUE": string;
  readonly "progress.status.CONFIDENT": string;
  readonly "progress.status.LEARNING": string;
  readonly "progress.status.HARD_FOR_NOW": string;
  readonly "progress.repeat.title": string;
  readonly "progress.tip.title": string;
  readonly "progress.tip.NAME": string;
  readonly "progress.tip.HABITAT": string;
  readonly "progress.tip.COLOR": string;
  readonly "progress.tip.SOUND": string;
  readonly "progress.tip.DIET": string;
  readonly "progress.tip.SIZE": string;
  readonly "progress.tip.UNIQUE": string;
  readonly "progress.recent.title": string;
  readonly "progress.recent.all": string;
  readonly "progress.recent.less": string;
  readonly "progress.recent.minutes": string;
  readonly "progress.recent.stars": string;
  readonly "progress.empty": string;
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
    "progress.title": "התקדמות",
    "progress.world": "עולם החיות",
    "progress.lastGame": "משחק אחרון: {day}",
    "progress.today": "היום",
    "progress.yesterday": "אתמול",
    "progress.period.label": "תקופה",
    "progress.period.week": "שבוע",
    "progress.period.month": "חודש",
    "progress.period.all": "כל הזמן",
    "progress.games": "משחק|משחקים",
    "progress.minutes": "דקה|דקות",
    "progress.animals": "חיה|חיות",
    "progress.activity": "פעילות בדקות",
    "progress.questions": "שאלה|שאלות",
    "progress.answers.title": "איך עונה",
    "progress.answers.firstTry": "לבד, מהפעם הראשונה",
    "progress.answers.secondTry": "בניסיון השני",
    "progress.answers.together": "אמרנו ביחד",
    "progress.level.title": "רמה: {level}",
    "progress.level.note": "משנים את הרמה בדף הבית",
    "progress.topics.title": "נושאי השאלות",
    "progress.topic.NAME": "מי זה",
    "progress.topic.HABITAT": "איפה גר",
    "progress.topic.COLOR": "באיזה צבע",
    "progress.topic.SOUND": "איזה קול עושה",
    "progress.topic.DIET": "מה אוכל",
    "progress.topic.SIZE": "באיזה גודל",
    "progress.topic.UNIQUE": "מה מיוחד",
    "progress.status.CONFIDENT": "בביטחון",
    "progress.status.LEARNING": "בלמידה",
    "progress.status.HARD_FOR_NOW": "עדיין קשה",
    "progress.repeat.title": "לחזור בבית",
    "progress.tip.title": "רעיון להיום",
    "progress.tip.NAME": "{animal}: הראו תמונה או צעצוע ושאלו ״מי זה?״. תגידו את השם ביחד.",
    "progress.tip.HABITAT": "{animal}: חפשו בספר איפה החיה הזאת גרה ותגידו את המקום ביחד.",
    "progress.tip.COLOR": "{animal}: מצאו בבית דברים באותו צבע ותגידו את הצבע ביחד.",
    "progress.tip.SOUND": "{animal}: חקו את הקול של החיה הזאת, והילד ינחש ויחזור אחריכם.",
    "progress.tip.DIET": "{animal}: בארוחה שאלו מה החיה הזאת אוכלת. הראו אוכל דומה — כך המילה תיזכר מהר יותר.",
    "progress.tip.SIZE": "{animal}: הראו בידיים אם החיה הזאת גדולה או קטנה, והשוו לצעצועים.",
    "progress.tip.UNIQUE": "{animal}: הסתכלו יחד על התמונה ומצאו מה הכי מיוחד. הילד יראה ויגיד.",
    "progress.recent.title": "משחקים אחרונים",
    "progress.recent.all": "כל המשחקים",
    "progress.recent.less": "להסתיר",
    "progress.recent.minutes": "{n} דק׳",
    "progress.recent.stars": "כוכבים: {n}",
    "progress.empty": "עדיין אין משחקים בתקופה הזאת",
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
    "progress.title": "Прогресс",
    "progress.world": "Мир «Животные»",
    "progress.lastGame": "последняя игра {day}",
    "progress.today": "сегодня",
    "progress.yesterday": "вчера",
    "progress.period.label": "Период",
    "progress.period.week": "Неделя",
    "progress.period.month": "Месяц",
    "progress.period.all": "Всё время",
    "progress.games": "игра|игры|игр",
    "progress.minutes": "минута|минуты|минут",
    "progress.animals": "животное|животных|животных",
    "progress.activity": "Активность в минутах",
    "progress.questions": "вопрос|вопроса|вопросов",
    "progress.answers.title": "Как отвечает",
    "progress.answers.firstTry": "Сам, с первого раза",
    "progress.answers.secondTry": "Со второй попытки",
    "progress.answers.together": "Сказали вместе",
    "progress.level.title": "Уровень: {level}",
    "progress.level.note": "Меняется на главной странице",
    "progress.topics.title": "Темы вопросов",
    "progress.topic.NAME": "Кто это",
    "progress.topic.HABITAT": "Где живёт",
    "progress.topic.COLOR": "Какого цвета",
    "progress.topic.SOUND": "Как говорит",
    "progress.topic.DIET": "Что ест",
    "progress.topic.SIZE": "Какой величины",
    "progress.topic.UNIQUE": "Чем особенный",
    "progress.status.CONFIDENT": "уверенно",
    "progress.status.LEARNING": "учится",
    "progress.status.HARD_FOR_NOW": "пока трудно",
    "progress.repeat.title": "Повторить дома",
    "progress.tip.title": "Идея на сегодня",
    "progress.tip.NAME": "{animal}: покажите картинку или игрушку и спросите «Кто это?». Назовите вместе.",
    "progress.tip.HABITAT": "{animal}: найдите в книжке, где живёт это животное, и назовите место вместе.",
    "progress.tip.COLOR": "{animal}: найдите дома вещи такого же цвета и назовите цвет вместе.",
    "progress.tip.SOUND": "{animal}: изобразите, как говорит это животное, — пусть малыш угадает и повторит.",
    "progress.tip.DIET": "{animal}: за обедом спросите, что ест это животное. Покажите похожую еду — так слово запомнится быстрее.",
    "progress.tip.SIZE": "{animal}: покажите руками, большое это животное или маленькое, и сравните с игрушками.",
    "progress.tip.UNIQUE": "{animal}: рассмотрите вместе картинку и найдите самое необычное. Пусть малыш покажет и назовёт.",
    "progress.recent.title": "Последние игры",
    "progress.recent.all": "Все игры",
    "progress.recent.less": "Свернуть",
    "progress.recent.minutes": "{n} мин",
    "progress.recent.stars": "Звёзд: {n}",
    "progress.empty": "Пока нет игр за этот период",
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
    "progress.title": "Прогрес",
    "progress.world": "Світ «Тварини»",
    "progress.lastGame": "остання гра {day}",
    "progress.today": "сьогодні",
    "progress.yesterday": "вчора",
    "progress.period.label": "Період",
    "progress.period.week": "Тиждень",
    "progress.period.month": "Місяць",
    "progress.period.all": "Весь час",
    "progress.games": "гра|гри|ігор",
    "progress.minutes": "хвилина|хвилини|хвилин",
    "progress.animals": "тварина|тварини|тварин",
    "progress.activity": "Активність у хвилинах",
    "progress.questions": "питання|питання|питань",
    "progress.answers.title": "Як відповідає",
    "progress.answers.firstTry": "Сам, з першого разу",
    "progress.answers.secondTry": "З другої спроби",
    "progress.answers.together": "Сказали разом",
    "progress.level.title": "Рівень: {level}",
    "progress.level.note": "Змінюється на головній сторінці",
    "progress.topics.title": "Теми запитань",
    "progress.topic.NAME": "Хто це",
    "progress.topic.HABITAT": "Де живе",
    "progress.topic.COLOR": "Якого кольору",
    "progress.topic.SOUND": "Як говорить",
    "progress.topic.DIET": "Що їсть",
    "progress.topic.SIZE": "Якого розміру",
    "progress.topic.UNIQUE": "Чим особливий",
    "progress.status.CONFIDENT": "впевнено",
    "progress.status.LEARNING": "вчиться",
    "progress.status.HARD_FOR_NOW": "поки важко",
    "progress.repeat.title": "Повторити вдома",
    "progress.tip.title": "Ідея на сьогодні",
    "progress.tip.NAME": "{animal}: покажіть картинку або іграшку й спитайте «Хто це?». Назвіть разом.",
    "progress.tip.HABITAT": "{animal}: знайдіть у книжці, де живе ця тварина, і назвіть місце разом.",
    "progress.tip.COLOR": "{animal}: знайдіть удома речі такого ж кольору й назвіть колір разом.",
    "progress.tip.SOUND": "{animal}: зобразіть, як говорить ця тварина, — нехай малюк вгадає і повторить.",
    "progress.tip.DIET": "{animal}: за обідом спитайте, що їсть ця тварина. Покажіть схожу їжу — так слово запам'ятається швидше.",
    "progress.tip.SIZE": "{animal}: покажіть руками, велика ця тварина чи маленька, і порівняйте з іграшками.",
    "progress.tip.UNIQUE": "{animal}: роздивіться разом картинку й знайдіть найнезвичніше. Нехай малюк покаже й назве.",
    "progress.recent.title": "Останні ігри",
    "progress.recent.all": "Усі ігри",
    "progress.recent.less": "Згорнути",
    "progress.recent.minutes": "{n} хв",
    "progress.recent.stars": "Зірок: {n}",
    "progress.empty": "Поки немає ігор за цей період",
  },
};
