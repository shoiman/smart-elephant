# Вопросы, ответы, озвучка, микрофон — статус (2026-10-18)

## Что сделано (локально в C:\STUDY\smart-elephant, на момент записи НЕ закоммичено)

### Вопросы на языке ребёнка
- Фронтенд шлёт `GET /api/questions/next?childId=1&language=he|ru|uk`; без параметра — язык из профиля ребёнка.
- Пакет `com.smartelephant.i18n`:
  - `GameLanguage` — he/ru/uk/en, неизвестный код → en.
  - `QuestionTemplates` — шаблоны вопросов с учётом рода (иврит/русский/украинский), названия 7 животных, подсказки.
  - `AnimalAnswers` — правильный ответ на каждый вопрос (7 животных × 6 тем × 4 языка).
  - `AnswerChecker` — проверка ответа ребёнка по «понятиям» с синонимами (саванна/река/Африка…), нормализация: никуд, приставки ה/ב/ו/ל, конечные буквы, ё, апострофы; для SIZE ответ «и то и то» не засчитывается.
- Темы по сложности: EASY — где живёт / цвет / звук; MEDIUM — что ест / размер; HARD — чем отличается.
- `QuestionResponse`: + `topic`, `answer`, `audioUrl`, `answerAudioUrl`. `animalName` остаётся английским (по нему фронт ищет картинку).
- `AnswerRequest`: + `topic`, `language`. Исправлен баг: в validateAnswer раньше уходил questionId вместо текста.
- Животное без правил → старая мягкая mock-проверка (место для Claude API в будущем).

### Озвучка — Azure AI Speech
- `TtsService` + `GET /api/audio/{id}.mp3`. Голоса: he-IL-HilaNeural, ru-RU-SvetlanaNeural, uk-UA-PolinaNeural, en-US-AnaNeural, rate -10%.
- Кэш mp3 в Docker volume `tts_cache` (`/app/audio-cache`); id = sha256(голос|текст). Каждая фраза синтезируется один раз.
- Озвучиваются только фразы, сгенерированные backend (защита квоты). Без ключа TTS выключен → голос браузера.
- Причина: в Chrome нет голоса иврита (на украинском браузерный голос был).
- Azure: подписка «Azure subscription 1», группа `smart-elephant`, ресурс Speech, тариф Free F0, регион **northeurope** (West Europe не принимал новых клиентов).
- `.env`: `AZURE_SPEECH_KEY`, `AZURE_SPEECH_REGION=northeurope`. Локально проверено: `Azure TTS enabled`.

### Микрофон
- `useSpeechRecognition`: continuous + interimResults; конец ответа — 2.5 с тишины после последнего слова, ждать начала речи 8 с, максимум 15 с; второе нажатие на микрофон отправляет услышанное. Нату устраивает, при необходимости подстроить (для детей с трудностями речи — 3–4 с).

## Что осталось
1. Закоммитить и запушить с ноутбука.
2. Прогнать JUnit-тесты (в Docker-сборке `-DskipTests`):
   `docker run --rm -v "${PWD}\smart-elephant-backend:/app" -w /app maven:3.9-eclipse-temurin-21 mvn -q test`
3. Сервер: добавить `AZURE_SPEECH_KEY` / `AZURE_SPEECH_REGION` в `/opt/smart-elephant/.env`, `git pull && docker compose up -d --build`.
4. Azure: подписка-триал через 30 дней требует Upgrade до Pay-As-You-Go (F0 остаётся бесплатным); можно поставить Budget-алерт.
5. Позже: Claude API только для ответов, которые не распознал AnswerChecker.
