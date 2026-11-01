package com.smartelephant.i18n;

import com.smartelephant.i18n.AnimalCatalog.AnimalContent;
import com.smartelephant.i18n.QuestionTemplates.LocalizedQuestion;
import com.smartelephant.i18n.QuestionTemplates.Topic;
import com.smartelephant.model.enums.QuestionDifficulty;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Random;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Guards the content in resources/content: every change to the JSON files is checked here,
 * so a typo in a stem or a phrase that does not match its own rule fails the build.
 */
class AnimalCatalogTest {

    private static final AnimalCatalog CATALOG = new AnimalCatalog();
    private final AnswerChecker checker = new AnswerChecker(CATALOG);
    private final QuestionTemplates templates = new QuestionTemplates(CATALOG);

    @Test
    void loadsAllAnimalsAndFindsThemByNameOrId() {
        assertThat(CATALOG.all()).hasSize(48);
        assertThat(CATALOG.find("Hippopotamus")).isEqualTo(CATALOG.find("hippo"));
        assertThat(CATALOG.find("LADYBUG")).isPresent();
        assertThat(CATALOG.find("unicorn")).isEmpty();
    }

    /** The correct answer the game shows and speaks must itself be accepted by the checker. */
    @Test
    void everyAnswerPassesItsOwnCheck() {
        List<String> failures = new ArrayList<>();
        for (AnimalContent animal : CATALOG.all()) {
            for (GameLanguage language : GameLanguage.values()) {
                for (Topic topic : animal.topics()) {
                    String answer = animal.answer(topic, language).orElseThrow();
                    if (!checker.check(animal.nameEn(), topic, language, answer).equals(Optional.of(true))) {
                        failures.add(animal.id() + " " + language + " " + topic + ": " + answer);
                    }
                }
            }
        }
        assertThat(failures).isEmpty();
    }

    @Test
    void everyQuestionIsLocalizedAndHasAnAnswer() {
        Random random = new Random(7);
        List<String> failures = new ArrayList<>();
        for (AnimalContent animal : CATALOG.all()) {
            for (GameLanguage language : List.of(GameLanguage.HE, GameLanguage.RU, GameLanguage.UK)) {
                for (Topic topic : animal.topics()) {
                    for (int i = 0; i < 4; i++) {
                        LocalizedQuestion question = templates.question(animal.nameEn(), topic, language, random);
                        if (question.text().contains("{") || question.text().matches(".*[A-Za-z].*")
                                || question.answer() == null || question.answer().isBlank()) {
                            failures.add(animal.id() + " " + language + " " + topic + ": " + question);
                        }
                    }
                }
            }
        }
        assertThat(failures).isEmpty();
    }

    @Test
    void animalsWithoutSoundAreNeverAskedAboutSound() {
        Random random = new Random(3);
        for (int i = 0; i < 50; i++) {
            assertThat(templates.question("Shark", QuestionDifficulty.EASY, GameLanguage.RU, random).topic())
                    .isNotEqualTo(Topic.SOUND);
        }
    }

    @Test
    void missingTopicIsNeverAskedButOtherTopicsStillComeUp() {
        // The crow has no SIZE topic: it is never asked, while DIET comes up at any difficulty
        Random random = new Random(5);
        for (QuestionDifficulty difficulty : new QuestionDifficulty[]{QuestionDifficulty.EASY, QuestionDifficulty.MEDIUM}) {
            java.util.Set<Topic> asked = java.util.EnumSet.noneOf(Topic.class);
            for (int i = 0; i < 200; i++) {
                asked.add(templates.question("Raven", difficulty, GameLanguage.RU, random).topic());
            }
            assertThat(asked).as(difficulty.name()).doesNotContain(Topic.SIZE).contains(Topic.DIET);
        }
    }
}
