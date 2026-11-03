package com.smartelephant.i18n;

import com.smartelephant.i18n.AnimalCatalog.AnimalContent;
import com.smartelephant.i18n.QuestionTemplates.LocalizedQuestion;
import com.smartelephant.i18n.QuestionTemplates.Topic;
import com.smartelephant.model.enums.QuestionDifficulty;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.EnumSet;
import java.util.List;
import java.util.Optional;
import java.util.Random;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;

/** "Who is this?" (NAME): asked first about every animal, answered with the animal's name. */
class NameTopicTest {

    private static final AnimalCatalog CATALOG = new AnimalCatalog();
    private static final List<GameLanguage> CHILD_LANGUAGES = List.of(GameLanguage.HE, GameLanguage.RU, GameLanguage.UK);
    private final AnswerChecker checker = new AnswerChecker(CATALOG);
    private final QuestionTemplates templates = new QuestionTemplates(CATALOG);

    private boolean accepted(String animal, GameLanguage language, String answer) {
        return checker.check(animal, Topic.NAME, language, answer).equals(Optional.of(true));
    }

    @Test
    void everyAnimalHasTheNameTopic() {
        for (AnimalContent animal : CATALOG.all()) {
            assertThat(animal.topics()).as(animal.id()).contains(Topic.NAME);
        }
    }

    @Test
    void questionTextInEveryLanguage() {
        Random random = new Random(1);
        assertThat(templates.question("Cow", Topic.NAME, GameLanguage.RU, random).text()).isEqualTo("Кто это?");
        assertThat(templates.question("Cow", Topic.NAME, GameLanguage.UK, random).text()).isEqualTo("Хто це?");
    }

    @Test
    void hebrewQuestionAgreesWithTheAnimalsGender() {
        Random random = new Random(1);
        assertThat(templates.question("Cow", Topic.NAME, GameLanguage.HE, random).text()).isEqualTo("מי זאת?");
        assertThat(templates.question("Elephant", Topic.NAME, GameLanguage.HE, random).text()).isEqualTo("מי זה?");
        assertThat(templates.question("Giraffe", Topic.NAME, GameLanguage.HE, random).text()).isEqualTo("מי זאת?");
    }

    @Test
    void answerIsTheCapitalizedName() {
        Random random = new Random(1);
        assertThat(templates.question("Cow", Topic.NAME, GameLanguage.RU, random).answer()).isEqualTo("Корова");
        assertThat(templates.question("Cow", Topic.NAME, GameLanguage.HE, random).answer()).isEqualTo("פרה");
        assertThat(templates.question("Ladybug", Topic.NAME, GameLanguage.RU, random).answer()).isEqualTo("Божья коровка");
    }

    @Test
    void acceptsTheNameInPhrasesAndDiminutives() {
        assertThat(accepted("Cow", GameLanguage.RU, "корова")).isTrue();
        assertThat(accepted("Cow", GameLanguage.RU, "это коровка")).isTrue();
        assertThat(accepted("Elephant", GameLanguage.RU, "слоник")).isTrue();
        assertThat(accepted("Elephant", GameLanguage.UK, "слоненя")).isTrue();
        assertThat(accepted("Hedgehog", GameLanguage.RU, "ёжик")).isTrue();
        assertThat(accepted("Hedgehog", GameLanguage.RU, "ёж")).isTrue();
        assertThat(accepted("Pig", GameLanguage.RU, "хрюшка")).isTrue();
        assertThat(accepted("Cow", GameLanguage.HE, "זאת פרה")).isTrue();
        assertThat(accepted("Cow", GameLanguage.HE, "הפרה")).isTrue();
        assertThat(accepted("Ladybug", GameLanguage.RU, "божья коровка")).isTrue();
        assertThat(accepted("Boar", GameLanguage.HE, "חזיר בר")).isTrue();
    }

    @Test
    void doesNotAcceptAnotherAnimal() {
        assertThat(accepted("Cow", GameLanguage.RU, "собака")).isFalse();
        assertThat(accepted("Cow", GameLanguage.RU, "сова")).isFalse();
        assertThat(accepted("Cow", GameLanguage.RU, "божья коровка")).isFalse();
        assertThat(accepted("Pig", GameLanguage.HE, "חזיר בר")).isFalse();
        assertThat(accepted("Cow", GameLanguage.RU, "")).isFalse();
    }

    /**
     * Picture cards show other animals' names: the name of any other animal must never be accepted,
     * otherwise tapping the wrong card would be praised.
     */
    @Test
    void noAnimalAcceptsTheNameOfAnotherAnimal() {
        List<String> clashes = new ArrayList<>();
        for (AnimalContent target : CATALOG.all()) {
            for (AnimalContent other : CATALOG.all()) {
                if (other == target) {
                    continue;
                }
                for (GameLanguage language : CHILD_LANGUAGES) {
                    String otherName = other.answer(Topic.NAME, language).orElseThrow();
                    if (accepted(target.nameEn(), language, otherName)) {
                        clashes.add(target.id() + " accepts " + other.id() + " (" + language + ": " + otherName + ")");
                    }
                }
            }
        }
        assertThat(clashes).isEmpty();
    }

    @Test
    void nameIsAlwaysTheFirstQuestionThenOtherTopicsWithoutRepeats() {
        Random random = new Random(5);
        for (AnimalContent animal : CATALOG.all()) {
            Set<Topic> asked = EnumSet.noneOf(Topic.class);
            LocalizedQuestion first = templates.nextQuestion(animal.nameEn(), asked, QuestionDifficulty.EASY,
                    GameLanguage.RU, false, random).orElseThrow();
            assertThat(first.topic()).as(animal.id()).isEqualTo(Topic.NAME);
            asked.add(first.topic());

            int remaining = templates.remainingQuestions(animal.nameEn(), asked, false);
            for (int i = 0; i < remaining; i++) {
                LocalizedQuestion next = templates.nextQuestion(animal.nameEn(), asked, QuestionDifficulty.EASY,
                        GameLanguage.RU, false, random).orElseThrow();
                assertThat(next.topic()).isNotEqualTo(Topic.NAME).isNotEqualTo(Topic.UNIQUE).isNotIn(asked);
                asked.add(next.topic());
            }
            assertThat(templates.nextQuestion(animal.nameEn(), asked, QuestionDifficulty.EASY,
                    GameLanguage.RU, false, random)).as(animal.id()).isEmpty();
        }
    }

    @Test
    void randomTopicChoiceNeverPicksName() {
        Random random = new Random(9);
        for (int i = 0; i < 200; i++) {
            assertThat(QuestionTemplates.pickTopic(EnumSet.allOf(Topic.class), QuestionDifficulty.EASY, random))
                    .isNotEqualTo(Topic.NAME);
        }
    }
}
