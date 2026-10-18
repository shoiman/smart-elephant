package com.smartelephant.i18n;

import com.smartelephant.model.enums.QuestionDifficulty;
import org.springframework.stereotype.Component;

import java.util.EnumMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.random.RandomGenerator;

/**
 * Localized question templates and animal names for the mock question generator.
 *
 * Used until the real Claude API is connected (Phase 2), so a child always hears
 * questions in the language selected in the UI instead of English.
 *
 * Placeholders:
 *   {name} - animal name as is (lowercase in ru/uk/en, Hebrew has no case)
 *   {Name} - animal name with the first letter capitalized (start of a sentence)
 */
@Component
public class QuestionTemplates {

    /** Question topics, aligned with the game's question sequence. */
    public enum Topic {
        HABITAT, COLOR, SOUND, DIET, SIZE, UNIQUE
    }

    /** Grammatical gender of an animal name; some questions need agreement (e.g. "большой/большая"). */
    enum Gender {
        MASCULINE, FEMININE
    }

    /** A question phrased for both genders; identical text when the phrase is gender-neutral. */
    record Template(String masculine, String feminine) {
        static Template of(String text) {
            return new Template(text, text);
        }

        String forGender(Gender gender) {
            return gender == Gender.FEMININE ? feminine : masculine;
        }
    }

    record LocalizedName(String name, Gender gender) {
    }

    /**
     * A generated question together with its topic and correct answer.
     * answer is null when no answer is known for this animal (unknown animal).
     */
    public record LocalizedQuestion(Topic topic, String text, String answer) {
    }

    private static final Map<QuestionDifficulty, List<Topic>> TOPICS_BY_DIFFICULTY = Map.of(
            QuestionDifficulty.EASY, List.of(Topic.HABITAT, Topic.COLOR, Topic.SOUND),
            QuestionDifficulty.MEDIUM, List.of(Topic.DIET, Topic.SIZE),
            QuestionDifficulty.HARD, List.of(Topic.UNIQUE)
    );

    private static final Map<GameLanguage, Map<Topic, List<Template>>> TEMPLATES = new EnumMap<>(GameLanguage.class);
    private static final Map<GameLanguage, Map<QuestionDifficulty, List<String>>> HINTS = new EnumMap<>(GameLanguage.class);

    /** Keyed by the English animal name from the database, lowercase. */
    private static final Map<String, Map<GameLanguage, LocalizedName>> ANIMAL_NAMES = Map.of(
            "elephant", names("פיל", Gender.MASCULINE, "слон", Gender.MASCULINE, "слон", Gender.MASCULINE),
            "lion", names("אריה", Gender.MASCULINE, "лев", Gender.MASCULINE, "лев", Gender.MASCULINE),
            "penguin", names("פינגווין", Gender.MASCULINE, "пингвин", Gender.MASCULINE, "пінгвін", Gender.MASCULINE),
            "giraffe", names("ג׳ירפה", Gender.FEMININE, "жираф", Gender.MASCULINE, "жираф", Gender.MASCULINE),
            "hippopotamus", names("היפופוטם", Gender.MASCULINE, "бегемот", Gender.MASCULINE, "бегемот", Gender.MASCULINE),
            "zebra", names("זברה", Gender.FEMININE, "зебра", Gender.FEMININE, "зебра", Gender.FEMININE),
            "leopard", names("נמר", Gender.MASCULINE, "леопард", Gender.MASCULINE, "леопард", Gender.MASCULINE)
    );

    static {
        TEMPLATES.put(GameLanguage.HE, Map.of(
                Topic.HABITAT, List.of(
                        new Template("איפה גר ה{name}?", "איפה גרה ה{name}?"),
                        Template.of("איפה הבית של ה{name}?")),
                Topic.COLOR, List.of(
                        Template.of("מה הצבע של ה{name}?"),
                        Template.of("באיזה צבע ה{name}?")),
                Topic.SOUND, List.of(
                        Template.of("איזה קול עושה ה{name}?"),
                        Template.of("איך מדבר ה{name}?")),
                Topic.DIET, List.of(
                        new Template("מה אוכל ה{name}?", "מה אוכלת ה{name}?"),
                        Template.of("מה האוכל של ה{name}?")),
                Topic.SIZE, List.of(
                        new Template("ה{name} גדול או קטן?", "ה{name} גדולה או קטנה?")),
                Topic.UNIQUE, List.of(
                        Template.of("מה מיוחד ב{name}?"),
                        Template.of("במה ה{name} שונה מחיות אחרות?"))
        ));

        TEMPLATES.put(GameLanguage.RU, Map.of(
                Topic.HABITAT, List.of(
                        Template.of("Где живёт {name}?"),
                        Template.of("Как ты думаешь, где живёт {name}?")),
                Topic.COLOR, List.of(
                        Template.of("Какого цвета {name}?"),
                        Template.of("Скажи, какого цвета {name}?")),
                Topic.SOUND, List.of(
                        Template.of("Как говорит {name}?"),
                        Template.of("Какой звук издаёт {name}?")),
                Topic.DIET, List.of(
                        Template.of("Что ест {name}?"),
                        Template.of("Что любит есть {name}?")),
                Topic.SIZE, List.of(
                        new Template("{Name} большой или маленький?", "{Name} большая или маленькая?")),
                Topic.UNIQUE, List.of(
                        Template.of("Чем {name} отличается от других животных?"))
        ));

        // The Ukrainian key is "uk" (language code), not "ua" (country code)
        TEMPLATES.put(GameLanguage.UK, Map.of(
                Topic.HABITAT, List.of(
                        Template.of("Де живе {name}?"),
                        Template.of("Як ти думаєш, де живе {name}?")),
                Topic.COLOR, List.of(
                        Template.of("Якого кольору {name}?"),
                        Template.of("Скажи, якого кольору {name}?")),
                Topic.SOUND, List.of(
                        Template.of("Як говорить {name}?"),
                        Template.of("Який звук видає {name}?")),
                Topic.DIET, List.of(
                        Template.of("Що їсть {name}?"),
                        Template.of("Що любить їсти {name}?")),
                Topic.SIZE, List.of(
                        new Template("{Name} великий чи маленький?", "{Name} велика чи маленька?")),
                Topic.UNIQUE, List.of(
                        Template.of("Чим {name} відрізняється від інших тварин?"))
        ));

        TEMPLATES.put(GameLanguage.EN, Map.of(
                Topic.HABITAT, List.of(
                        Template.of("Where does the {name} live?"),
                        Template.of("Where is the home of the {name}?")),
                Topic.COLOR, List.of(
                        Template.of("What color is the {name}?"),
                        Template.of("Can you tell the color of the {name}?")),
                Topic.SOUND, List.of(
                        Template.of("What sound does the {name} make?"),
                        Template.of("How does the {name} talk?")),
                Topic.DIET, List.of(
                        Template.of("What does the {name} eat?"),
                        Template.of("What does the {name} like to eat?")),
                Topic.SIZE, List.of(
                        Template.of("Is the {name} big or small?")),
                Topic.UNIQUE, List.of(
                        Template.of("What is special about the {name}?"),
                        Template.of("How is the {name} different from other animals?"))
        ));

        HINTS.put(GameLanguage.HE, Map.of(
                QuestionDifficulty.EASY, List.of("תסתכל טוב על התמונה", "איפה ראית את החיה הזאת?"),
                QuestionDifficulty.MEDIUM, List.of("חשוב מה החיה הזאת אוהבת", "תשווה אותה לחתול"),
                QuestionDifficulty.HARD, List.of("מה יש לחיה הזאת שאין לאחרות?", "מה היא יודעת לעשות?")
        ));
        HINTS.put(GameLanguage.RU, Map.of(
                QuestionDifficulty.EASY, List.of("Посмотри внимательно на картинку", "Где ты видел это животное?"),
                QuestionDifficulty.MEDIUM, List.of("Подумай, что любит это животное", "Сравни его с кошкой"),
                QuestionDifficulty.HARD, List.of("Что есть у этого животного, чего нет у других?", "Что оно умеет делать?")
        ));
        HINTS.put(GameLanguage.UK, Map.of(
                QuestionDifficulty.EASY, List.of("Подивись уважно на картинку", "Де ти бачив цю тварину?"),
                QuestionDifficulty.MEDIUM, List.of("Подумай, що любить ця тварина", "Порівняй її з котиком"),
                QuestionDifficulty.HARD, List.of("Що є в цієї тварини, чого немає в інших?", "Що вона вміє робити?")
        ));
        HINTS.put(GameLanguage.EN, Map.of(
                QuestionDifficulty.EASY, List.of("Look carefully at the picture", "Where have you seen this animal?"),
                QuestionDifficulty.MEDIUM, List.of("Think about what this animal likes", "Compare it to a cat"),
                QuestionDifficulty.HARD, List.of("What does this animal have that others don't?", "What can it do?")
        ));
    }

    /**
     * Builds a question about the animal in the requested language.
     *
     * @param englishAnimalName animal name as stored in the database (e.g. "Zebra")
     */
    public LocalizedQuestion question(String englishAnimalName, QuestionDifficulty difficulty,
                           GameLanguage language, RandomGenerator random) {
        List<Topic> topics = TOPICS_BY_DIFFICULTY.getOrDefault(difficulty, List.of(Topic.HABITAT));
        Topic topic = topics.get(random.nextInt(topics.size()));
        return question(englishAnimalName, topic, language, random);
    }

    /** Builds a question on a specific topic; package-private for tests. */
    LocalizedQuestion question(String englishAnimalName, Topic topic, GameLanguage language, RandomGenerator random) {
        LocalizedName localized = localizedName(englishAnimalName, language);
        // An animal without a translation keeps its English name, so use English phrasing for it
        GameLanguage templateLanguage = localized == null ? GameLanguage.EN : language;
        if (localized == null) {
            localized = new LocalizedName(englishAnimalName.toLowerCase(Locale.ROOT), Gender.MASCULINE);
        }

        List<Template> templates = TEMPLATES.get(templateLanguage).get(topic);
        Template template = templates.get(random.nextInt(templates.size()));
        String text = template.forGender(localized.gender())
                .replace("{Name}", capitalize(localized.name()))
                .replace("{name}", localized.name());
        String answer = AnimalAnswers.answer(englishAnimalName, topic, templateLanguage).orElse(null);
        return new LocalizedQuestion(topic, text, answer);
    }

    public List<String> hints(QuestionDifficulty difficulty, GameLanguage language) {
        return HINTS.get(language).getOrDefault(difficulty, List.of());
    }

    /** Returns null when the animal has no translation for this language. */
    private static LocalizedName localizedName(String englishAnimalName, GameLanguage language) {
        if (englishAnimalName == null) {
            return null;
        }
        String key = englishAnimalName.trim().toLowerCase(Locale.ROOT);
        if (language == GameLanguage.EN) {
            return new LocalizedName(key, Gender.MASCULINE);
        }
        Map<GameLanguage, LocalizedName> byLanguage = ANIMAL_NAMES.get(key);
        return byLanguage == null ? null : byLanguage.get(language);
    }

    private static Map<GameLanguage, LocalizedName> names(String he, Gender heGender,
                                                         String ru, Gender ruGender,
                                                         String uk, Gender ukGender) {
        Map<GameLanguage, LocalizedName> map = new EnumMap<>(GameLanguage.class);
        map.put(GameLanguage.HE, new LocalizedName(he, heGender));
        map.put(GameLanguage.RU, new LocalizedName(ru, ruGender));
        map.put(GameLanguage.UK, new LocalizedName(uk, ukGender));
        return map;
    }

    private static String capitalize(String text) {
        if (text.isEmpty()) {
            return text;
        }
        return text.substring(0, 1).toUpperCase(Locale.ROOT) + text.substring(1);
    }
}
