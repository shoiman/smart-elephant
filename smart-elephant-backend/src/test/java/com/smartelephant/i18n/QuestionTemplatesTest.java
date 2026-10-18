package com.smartelephant.i18n;

import com.smartelephant.i18n.QuestionTemplates.Topic;
import com.smartelephant.model.enums.QuestionDifficulty;
import org.junit.jupiter.api.Test;

import java.util.Random;

import static org.assertj.core.api.Assertions.assertThat;

class QuestionTemplatesTest {

    private final QuestionTemplates templates = new QuestionTemplates();

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
    void russianQuestionCapitalizesNameAtSentenceStart() {
        assertThat(templates.question("Elephant", Topic.SIZE, GameLanguage.RU, new Random(1)).text())
                .isEqualTo("Слон большой или маленький?");
        assertThat(templates.question("Zebra", Topic.SIZE, GameLanguage.RU, new Random(1)).text())
                .isEqualTo("Зебра большая или маленькая?");
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
                templates.question("Kangaroo", Topic.HABITAT, GameLanguage.RU, new Random(1));
        assertThat(question.text()).contains("kangaroo").doesNotContain("{");
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
}
