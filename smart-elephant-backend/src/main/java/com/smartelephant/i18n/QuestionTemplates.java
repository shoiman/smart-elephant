package com.smartelephant.i18n;

import com.smartelephant.i18n.AnimalCatalog.AnimalContent;
import com.smartelephant.i18n.AnimalCatalog.Gender;
import com.smartelephant.i18n.AnimalCatalog.LocalizedName;
import com.smartelephant.model.enums.QuestionDifficulty;
import org.springframework.stereotype.Component;

import java.util.EnumMap;
import java.util.EnumSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.random.RandomGenerator;

/**
 * Localized question templates for the mock question generator.
 *
 * Used until the real Claude API is connected (Phase 2), so a child always hears
 * questions in the language selected in the UI instead of English.
 * Animal names, answers and available topics come from {@link AnimalCatalog}.
 *
 * Placeholders:
 *   {name}  - animal name as is (lowercase in ru/uk/en, Hebrew has no case)
 *   {Name}  - animal name with the first letter capitalized (start of a sentence)
 *   {the}   - Hebrew definite form: "הפיל", "חזיר הבר"
 *   {inThe} - Hebrew "in/about the ...": "בפיל", "באייל הקורא"
 */
@Component
public class QuestionTemplates {

    /** Question topics, aligned with the game's question sequence. */
    public enum Topic {
        HABITAT, COLOR, SOUND, DIET, SIZE, UNIQUE
    }

    /** A question phrased for each grammatical gender; identical text when the phrase is gender-neutral. */
    record Template(String masculine, String feminine, String neuter) {
        static Template of(String text) {
            return new Template(text, text, text);
        }

        static Template of(String masculine, String feminine) {
            return new Template(masculine, feminine, masculine);
        }

        String forGender(Gender gender) {
            return switch (gender) {
                case FEMININE -> feminine;
                case NEUTER -> neuter;
                default -> masculine;
            };
        }
    }

    /**
     * A generated question together with its topic and correct answer.
     * answer is null when no answer is known for this animal (unknown animal).
     */
    public record LocalizedQuestion(Topic topic, String text, String answer) {
    }

    /** How hard each topic is on its own; used only to weight the choice of topic. */
    private static final Map<Topic, QuestionDifficulty> TOPIC_DIFFICULTY = Map.of(
            Topic.HABITAT, QuestionDifficulty.EASY,
            Topic.COLOR, QuestionDifficulty.EASY,
            Topic.SOUND, QuestionDifficulty.EASY,
            Topic.DIET, QuestionDifficulty.MEDIUM,
            Topic.SIZE, QuestionDifficulty.MEDIUM,
            Topic.UNIQUE, QuestionDifficulty.HARD
    );

    private static final Map<GameLanguage, Map<Topic, List<Template>>> TEMPLATES = new EnumMap<>(GameLanguage.class);
    private static final Map<GameLanguage, Map<QuestionDifficulty, List<String>>> HINTS = new EnumMap<>(GameLanguage.class);

    static {
        TEMPLATES.put(GameLanguage.HE, Map.of(
                Topic.HABITAT, List.of(
                        Template.of("איפה גר {the}?", "איפה גרה {the}?"),
                        Template.of("איפה הבית של {the}?")),
                Topic.COLOR, List.of(
                        Template.of("מה הצבע של {the}?"),
                        Template.of("באיזה צבע {the}?")),
                Topic.SOUND, List.of(
                        Template.of("איזה קול עושה {the}?"),
                        Template.of("איך מדבר {the}?", "איך מדברת {the}?")),
                Topic.DIET, List.of(
                        Template.of("מה אוכל {the}?", "מה אוכלת {the}?"),
                        Template.of("מה האוכל של {the}?")),
                Topic.SIZE, List.of(
                        Template.of("{the} גדול או קטן?", "{the} גדולה או קטנה?")),
                Topic.UNIQUE, List.of(
                        Template.of("מה מיוחד {inThe}?"),
                        Template.of("במה {the} שונה מחיות אחרות?"))
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
                        new Template("{Name} большой или маленький?", "{Name} большая или маленькая?",
                                "{Name} большое или маленькое?")),
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
                        new Template("{Name} великий чи маленький?", "{Name} велика чи маленька?",
                                "{Name} велике чи маленьке?")),
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

    private final AnimalCatalog catalog;

    public QuestionTemplates(AnimalCatalog catalog) {
        this.catalog = catalog;
    }

    /**
     * Builds a question about the animal in the requested language.
     * Every topic the animal has can be asked at any difficulty (a fish is never asked about
     * its sound). Difficulty only changes how often a topic comes up: see {@link #topicWeight}.
     *
     * @param englishAnimalName animal name as stored in the database (e.g. "Zebra")
     */
    public LocalizedQuestion question(String englishAnimalName, QuestionDifficulty difficulty,
                                      GameLanguage language, RandomGenerator random) {
        return question(englishAnimalName, difficulty, language, true, random);
    }

    /**
     * Same as above; when allowUnique is false the "what is special about it" question is never
     * asked (it is only for the parent-selected level "Сам" / older).
     */
    public LocalizedQuestion question(String englishAnimalName, QuestionDifficulty difficulty,
                                      GameLanguage language, boolean allowUnique, RandomGenerator random) {
        Set<Topic> available = catalog.find(englishAnimalName)
                .map(AnimalContent::topics)
                .orElse(EnumSet.allOf(Topic.class));
        Topic topic = pickTopic(available, difficulty, allowUnique, random);
        return question(englishAnimalName, topic, language, random);
    }

    /** Weighted random choice among the animal's topics. */
    static Topic pickTopic(Set<Topic> available, QuestionDifficulty difficulty, RandomGenerator random) {
        return pickTopic(available, difficulty, true, random);
    }

    static Topic pickTopic(Set<Topic> available, QuestionDifficulty difficulty, boolean allowUnique,
                           RandomGenerator random) {
        EnumSet<Topic> allowed = available.isEmpty() ? EnumSet.noneOf(Topic.class) : EnumSet.copyOf(available);
        if (!allowUnique) {
            allowed.remove(Topic.UNIQUE);
        }
        if (allowed.isEmpty()) {
            return Topic.HABITAT;
        }
        List<Topic> topics = List.copyOf(allowed); // EnumSet order: stable for tests
        int total = topics.stream().mapToInt(topic -> topicWeight(topic, difficulty)).sum();
        int roll = random.nextInt(total);
        for (Topic topic : topics) {
            roll -= topicWeight(topic, difficulty);
            if (roll < 0) {
                return topic;
            }
        }
        return topics.get(topics.size() - 1);
    }

    /**
     * Weight of a topic for the child's difficulty: 3 when the topic matches the difficulty,
     * 2 one step away, 1 two steps away. E.g. on EASY "what does it eat" comes up
     * about half as often as "where does it live", but still comes up.
     */
    static int topicWeight(Topic topic, QuestionDifficulty difficulty) {
        QuestionDifficulty own = TOPIC_DIFFICULTY.getOrDefault(topic, QuestionDifficulty.EASY);
        QuestionDifficulty level = difficulty != null ? difficulty : QuestionDifficulty.EASY;
        return 3 - Math.abs(own.ordinal() - level.ordinal());
    }

    /** Builds a question on a specific topic; package-private for tests. */
    LocalizedQuestion question(String englishAnimalName, Topic topic, GameLanguage language, RandomGenerator random) {
        Optional<AnimalContent> animal = catalog.find(englishAnimalName);
        LocalizedName localized = animal.flatMap(content -> content.name(language)).orElse(null);
        // An animal without content keeps its English name, so use English phrasing for it
        GameLanguage templateLanguage = localized == null ? GameLanguage.EN : language;
        if (localized == null) {
            localized = new LocalizedName(englishAnimalName.toLowerCase(Locale.ROOT), Gender.MASCULINE, null);
        }

        List<Template> templates = TEMPLATES.get(templateLanguage).get(topic);
        Template template = templates.get(random.nextInt(templates.size()));
        String definite = localized.definite() != null ? localized.definite() : "ה" + localized.name();
        String inThe = "ב" + (definite.startsWith("ה") ? definite.substring(1) : definite);
        String text = template.forGender(localized.gender())
                .replace("{Name}", capitalize(localized.name()))
                .replace("{name}", localized.name())
                .replace("{the}", definite)
                .replace("{inThe}", inThe);
        String answer = animal.flatMap(content -> content.answer(topic, templateLanguage)).orElse(null);
        return new LocalizedQuestion(topic, text, answer);
    }

    public List<String> hints(QuestionDifficulty difficulty, GameLanguage language) {
        return HINTS.get(language).getOrDefault(difficulty, List.of());
    }

    private static String capitalize(String text) {
        if (text.isEmpty()) {
            return text;
        }
        return text.substring(0, 1).toUpperCase(Locale.ROOT) + text.substring(1);
    }
}
