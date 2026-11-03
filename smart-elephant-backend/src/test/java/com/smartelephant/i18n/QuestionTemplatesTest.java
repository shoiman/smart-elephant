package com.smartelephant.i18n;

import com.smartelephant.i18n.QuestionTemplates.Topic;
import com.smartelephant.model.enums.QuestionDifficulty;
import org.junit.jupiter.api.Test;

import java.util.EnumMap;
import java.util.EnumSet;
import java.util.Map;
import java.util.Random;

import static org.assertj.core.api.Assertions.assertThat;

class QuestionTemplatesTest {

    private static final AnimalCatalog CATALOG = new AnimalCatalog();
    private final QuestionTemplates templates = new QuestionTemplates(CATALOG);

    @Test
    void languageCodesResolveWithEnglishFallback() {
        assertThat(GameLanguage.fromCode("he")).isEqualTo(GameLanguage.HE);
        assertThat(GameLanguage.fromCode("RU")).isEqualTo(GameLanguage.RU);
        assertThat(GameLanguage.fromCode("uk-UA")).isEqualTo(GameLanguage.UK);
        assertThat(GameLanguage.fromCode("iw")).isEqualTo(GameLanguage.HE);
        assertThat(GameLanguage.fromCode("fr")).isEqualTo(GameLanguage.EN);
        assertThat(GameLanguage.fromCode(null)).isEqualTo(GameLanguage.EN);
    }

    @Test
    void hebrewQuestionUsesHebrewNameAndFeminineAgreement() {
        String question = templates.question("Zebra", Topic.SIZE, GameLanguage.HE, new Random(1)).text();
        assertThat(question).isEqualTo("הזברה גדולה או קטנה?");
    }

    @Test
    void hebrewMultiWordNamesUseTheirDefiniteForm() {
        assertThat(templates.question("Boar", Topic.SIZE, GameLanguage.HE, new Random(1)).text())
                .isEqualTo("חזיר הבר גדול או קטן?");
        assertThat(templates.question("Ladybug", Topic.SIZE, GameLanguage.HE, new Random(1)).text())
                .isEqualTo("פרת משה רבנו גדולה או קטנה?");
        assertThat(templates.question("Moose", Topic.UNIQUE, GameLanguage.HE, new Random(1)).text())
                .isIn("מה מיוחד באייל הקורא?", "במה האייל הקורא שונה מחיות אחרות?");
    }

    @Test
    void russianQuestionCapitalizesNameAtSentenceStart() {
        assertThat(templates.question("Elephant", Topic.SIZE, GameLanguage.RU, new Random(1)).text())
                .isEqualTo("Слон большой или маленький?");
        assertThat(templates.question("Zebra", Topic.SIZE, GameLanguage.RU, new Random(1)).text())
                .isEqualTo("Зебра большая или маленькая?");
    }

    @Test
    void neuterNamesAgreeInUkrainian() {
        assertThat(templates.question("Ladybug", Topic.SIZE, GameLanguage.UK, new Random(1)).text())
                .isEqualTo("Сонечко велике чи маленьке?");
    }

    @Test
    void ukrainianQuestionUsesUkrainianName() {
        String question = templates.question("Penguin", Topic.DIET, GameLanguage.UK, new Random(1)).text();
        assertThat(question).contains("пінгвін").startsWith("Що");
    }

    @Test
    void everyDifficultyProducesTextWithoutPlaceholdersOrLatinLetters() {
        Random random = new Random(42);
        for (GameLanguage language : new GameLanguage[]{GameLanguage.HE, GameLanguage.RU, GameLanguage.UK}) {
            for (QuestionDifficulty difficulty : QuestionDifficulty.values()) {
                for (int i = 0; i < 20; i++) {
                    QuestionTemplates.LocalizedQuestion question = templates.question("Giraffe", difficulty, language, random);
                    assertThat(question.text()).doesNotContain("{").doesNotContainPattern("[A-Za-z]");
                    assertThat(question.answer()).isNotBlank().doesNotContainPattern("[A-Za-z]");
                }
                assertThat(templates.hints(difficulty, language)).isNotEmpty();
            }
        }
    }

    @Test
    void unknownAnimalFallsBackToEnglishPhrasing() {
        QuestionTemplates.LocalizedQuestion question =
                templates.question("Unicorn", Topic.HABITAT, GameLanguage.RU, new Random(1));
        assertThat(question.text()).contains("unicorn").doesNotContain("{");
        assertThat(question.answer()).isNull();
    }

    @Test
    void answerMatchesTheTopicOfTheQuestion() {
        Random random = new Random(1);
        assertThat(templates.question("Elephant", Topic.COLOR, GameLanguage.HE, random).answer()).isEqualTo("הפיל אפור");
        assertThat(templates.question("Elephant", Topic.DIET, GameLanguage.RU, random).answer()).isEqualTo("Слон ест траву и листья");
        assertThat(templates.question("Zebra", Topic.SIZE, GameLanguage.UK, random).answer()).isEqualTo("Зебра велика");
        assertThat(templates.question("Zebra", Topic.SIZE, GameLanguage.UK, random).topic()).isEqualTo(Topic.SIZE);
    }

    @Test
    void everyTopicComesUpAtEveryDifficulty() {
        for (QuestionDifficulty difficulty : QuestionDifficulty.values()) {
            Map<Topic, Integer> counts = countTopics(difficulty);
            // NAME is not chosen at random: it is always the first question (see NameTopicTest)
            assertThat(counts.keySet()).as(difficulty.name())
                    .containsAll(EnumSet.complementOf(EnumSet.of(Topic.NAME)));
        }
    }

    @Test
    void difficultyMakesItsOwnTopicsMoreFrequent() {
        Map<Topic, Integer> easy = countTopics(QuestionDifficulty.EASY);
        assertThat(easy.get(Topic.HABITAT)).isGreaterThan(easy.get(Topic.DIET));
        assertThat(easy.get(Topic.DIET)).isGreaterThan(easy.get(Topic.UNIQUE));

        Map<Topic, Integer> medium = countTopics(QuestionDifficulty.MEDIUM);
        assertThat(medium.get(Topic.DIET)).isGreaterThan(medium.get(Topic.HABITAT));

        Map<Topic, Integer> hard = countTopics(QuestionDifficulty.HARD);
        assertThat(hard.get(Topic.UNIQUE)).isGreaterThan(hard.get(Topic.DIET));
        assertThat(hard.get(Topic.DIET)).isGreaterThan(hard.get(Topic.HABITAT));
    }

    @Test
    void topicsTheAnimalDoesNotHaveAreNeverPicked() {
        Random random = new Random(7);
        EnumSet<Topic> noSound = EnumSet.complementOf(EnumSet.of(Topic.SOUND));
        for (int i = 0; i < 500; i++) {
            assertThat(QuestionTemplates.pickTopic(noSound, QuestionDifficulty.EASY, random)).isNotEqualTo(Topic.SOUND);
        }
        assertThat(QuestionTemplates.pickTopic(EnumSet.noneOf(Topic.class), QuestionDifficulty.EASY, random))
                .isEqualTo(Topic.HABITAT);
    }

    @Test
    void uniqueTopicIsAskedOnlyWhenAllowed() {
        Random random = new Random(11);
        for (QuestionDifficulty difficulty : QuestionDifficulty.values()) {
            for (int i = 0; i < 500; i++) {
                assertThat(QuestionTemplates.pickTopic(EnumSet.allOf(Topic.class), difficulty, false, random))
                        .isNotEqualTo(Topic.UNIQUE);
            }
        }
        // An animal with nothing but UNIQUE still gets a question
        assertThat(QuestionTemplates.pickTopic(EnumSet.of(Topic.UNIQUE), QuestionDifficulty.HARD, false, random))
                .isEqualTo(Topic.HABITAT);
    }

    private static Map<Topic, Integer> countTopics(QuestionDifficulty difficulty) {
        Random random = new Random(3);
        Map<Topic, Integer> counts = new EnumMap<>(Topic.class);
        for (int i = 0; i < 6000; i++) {
            counts.merge(QuestionTemplates.pickTopic(EnumSet.allOf(Topic.class), difficulty, random), 1, Integer::sum);
        }
        return counts;
    }
}
