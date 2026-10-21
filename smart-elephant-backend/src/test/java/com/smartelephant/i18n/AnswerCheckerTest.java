package com.smartelephant.i18n;

import com.smartelephant.i18n.QuestionTemplates.Topic;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class AnswerCheckerTest {

    private final AnswerChecker checker = new AnswerChecker(new AnimalCatalog());

    @ParameterizedTest(name = "[{0}] {1} {2}: \"{3}\" -> {4}")
    @CsvSource(delimiter = ';', value = {
            // Hippo habitat: river AND savanna are both fine
            "HE; hippopotamus; HABITAT; בסוואנה; true",
            "HE; hippopotamus; HABITAT; ההיפופוטם גר בנהר; true",
            "HE; hippopotamus; HABITAT; במים; true",
            "HE; hippopotamus; HABITAT; בבית; false",
            "RU; hippopotamus; HABITAT; в речке; true",
            "RU; hippopotamus; HABITAT; в Африке; true",
            "UK; hippopotamus; HABITAT; у воді; true",
            "UK; hippopotamus; HABITAT; у річці; true",
            "UK; hippopotamus; HABITAT; в річечці; true",
            "UK; hippopotamus; HABITAT; в савані; true",
            // Colors with word forms and Hebrew vowel marks
            "HE; elephant; COLOR; אָפוֹר; true",
            "HE; elephant; COLOR; ורוד; false",
            "RU; elephant; COLOR; серенький; true",
            "RU; elephant; COLOR; синий; false",
            "UK; elephant; COLOR; сірий; true",
            "RU; zebra; COLOR; в полосочку; true",
            "HE; giraffe; COLOR; צהובה עם כתמים; true",
            // Sounds written as onomatopoeia
            "RU; lion; SOUND; р-р-р; true",
            "HE; lion; SOUND; ררר; true",
            "RU; lion; SOUND; мяу; false",
            "RU; zebra; SOUND; иа; true",
            "RU; elephant; SOUND; ту-ту; true",
            // Diet
            "RU; elephant; DIET; травку кушает; true",
            "HE; penguin; DIET; דגים; true",
            "HE; penguin; DIET; דג; true",
            "UK; lion; DIET; м'ясо; true",
            "RU; lion; DIET; траву; false",
            // Size: "both" is not an answer
            "RU; elephant; SIZE; большой; true",
            "RU; zebra; SIZE; большая; true",
            "RU; elephant; SIZE; большой или маленький; false",
            "HE; penguin; SIZE; קטן; true",
            "HE; penguin; SIZE; גדול; false",
            "UK; giraffe; SIZE; дуже високий; true",
            // Unique
            "RU; elephant; UNIQUE; у него хобот; true",
            "HE; giraffe; UNIQUE; צוואר ארוך; true",
            "RU; penguin; UNIQUE; он плавает; true",
            "UK; zebra; UNIQUE; смужки; true",
            // Animals from resources/content: word forms a child really says
            "RU; penguin; COLOR; серый; true",
            "RU; cow; SOUND; му-у; true",
            "UK; cow; SOUND; мичить; true",
            "RU; cow; COLOR; коричневая; false",
            "RU; sheep; SOUND; бе-е-е; true",
            "RU; horse; SOUND; ржёт; true",
            "RU; rabbit; DIET; морковку; true",
            "RU; rabbit; UNIQUE; ушки; true",
            "RU; chicken; DIET; зёрнышки; true",
            "RU; frog; HABITAT; в пруду; true",
            "RU; frog; SOUND; ква-ква; true",
            "RU; catfish; UNIQUE; усы; true",
            "RU; shark; HABITAT; в море; true",
            "RU; shark; HABITAT; в холоде; false",
            "RU; octopus; COLOR; красный; false",
            "RU; squirrel; DIET; орешки; true",
            "RU; raven; COLOR; белая; false",
            "RU; parrot; SOUND; привет; true",
            "HE; boar; SOUND; חרר; true",
            "RU; bee; HABITAT; в улье; true",
            "UK; fly; HABITAT; в будинку; true",
            "RU; grasshopper; SOUND; тр-р-р; true",
            "RU; ladybug; UNIQUE; точки; true",
            "HE; parrot; HABITAT; בג׳ונגל; true",
            // Silence or nonsense
            "RU; elephant; COLOR; ' '; false",
    })
    void judgesChildAnswers(GameLanguage language, String animal, Topic topic, String answer, boolean expected) {
        assertThat(checker.check(animal, topic, language, answer)).hasValue(expected);
    }

    @Test
    void unknownAnimalOrTopicCannotBeJudged() {
        assertThat(checker.check("unicorn", Topic.COLOR, GameLanguage.RU, "серый")).isEmpty();
        assertThat(checker.check("elephant", null, GameLanguage.RU, "серый")).isEmpty();
    }

    @Test
    void normalizeRemovesVowelMarksFinalLettersAndApostrophes() {
        assertThat(AnswerChecker.normalize("גִ׳ירָפָה")).isEqualTo("גירפה");
        assertThat(AnswerChecker.normalize("כתמים")).isEqualTo("כתמימ");
        assertThat(AnswerChecker.normalize("М'ЯСО!")).isEqualTo("мясо");
        assertThat(AnswerChecker.normalize("Жёлтый")).isEqualTo("желтый");
    }
}
