package com.smartelephant.i18n;

import com.smartelephant.i18n.QuestionTemplates.Topic;

import java.util.EnumMap;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;

/**
 * Correct answers for every animal, topic and language.
 *
 * The game shows (and later speaks) this sentence after a correct answer
 * and in the "let's say it together" step, so it must answer the exact question asked.
 * Answers are short full sentences a 2-4 year old can repeat.
 */
final class AnimalAnswers {

    /** animal (English, lowercase) -> language -> topic -> answer */
    private static final Map<String, Map<GameLanguage, Map<Topic, String>>> ANSWERS = new HashMap<>();

    static {
        add("elephant", GameLanguage.HE,
                "הפיל גר בסוואנה", "הפיל אפור", "הפיל מחצצר: טו-טו-טו!",
                "הפיל אוכל עשב ועלים", "הפיל גדול", "לפיל יש חדק ארוך");
        add("elephant", GameLanguage.RU,
                "Слон живёт в саванне", "Слон серый", "Слон трубит: ту-ту-у!",
                "Слон ест траву и листья", "Слон большой", "У слона длинный хобот");
        add("elephant", GameLanguage.UK,
                "Слон живе в савані", "Слон сірий", "Слон сурмить: ту-ту-у!",
                "Слон їсть траву і листя", "Слон великий", "У слона довгий хобот");
        add("elephant", GameLanguage.EN,
                "The elephant lives in the savanna", "The elephant is gray", "The elephant trumpets: toot-toot!",
                "The elephant eats grass and leaves", "The elephant is big", "The elephant has a long trunk");

        add("lion", GameLanguage.HE,
                "האריה גר בסוואנה", "האריה צהוב", "האריה שואג: ררר!",
                "האריה אוכל בשר", "האריה גדול", "לאריה יש רעמה גדולה");
        add("lion", GameLanguage.RU,
                "Лев живёт в саванне", "Лев жёлтый", "Лев рычит: р-р-р!",
                "Лев ест мясо", "Лев большой", "У льва пышная грива");
        add("lion", GameLanguage.UK,
                "Лев живе в савані", "Лев жовтий", "Лев гарчить: р-р-р!",
                "Лев їсть м'ясо", "Лев великий", "У лева пишна грива");
        add("lion", GameLanguage.EN,
                "The lion lives in the savanna", "The lion is yellow", "The lion roars: grrr!",
                "The lion eats meat", "The lion is big", "The lion has a big mane");

        add("penguin", GameLanguage.HE,
                "הפינגווין גר במקום קר, עם קרח ושלג", "הפינגווין שחור ולבן", "הפינגווין מצייץ: פי-פי!",
                "הפינגווין אוכל דגים", "הפינגווין קטן", "הפינגווין לא עף, אבל שוחה מצוין");
        add("penguin", GameLanguage.RU,
                "Пингвин живёт там, где лёд и снег", "Пингвин чёрно-белый", "Пингвин пищит: пи-пи!",
                "Пингвин ест рыбу", "Пингвин маленький", "Пингвин не летает, но отлично плавает");
        add("penguin", GameLanguage.UK,
                "Пінгвін живе там, де лід і сніг", "Пінгвін чорно-білий", "Пінгвін пищить: пі-пі!",
                "Пінгвін їсть рибу", "Пінгвін маленький", "Пінгвін не літає, але чудово плаває");
        add("penguin", GameLanguage.EN,
                "The penguin lives where there is ice and snow", "The penguin is black and white", "The penguin squeaks: pee-pee!",
                "The penguin eats fish", "The penguin is small", "The penguin can't fly, but swims very well");

        add("giraffe", GameLanguage.HE,
                "הג׳ירפה גרה בסוואנה", "הג׳ירפה צהובה עם כתמים חומים", "הג׳ירפה מזמזמת בשקט: מממ",
                "הג׳ירפה אוכלת עלים מהעצים", "הג׳ירפה גדולה וגבוהה מאוד", "לג׳ירפה יש צוואר ארוך מאוד");
        add("giraffe", GameLanguage.RU,
                "Жираф живёт в саванне", "Жираф жёлтый с коричневыми пятнами", "Жираф тихонько мычит: м-м-м",
                "Жираф ест листья с деревьев", "Жираф очень большой и высокий", "У жирафа очень длинная шея");
        add("giraffe", GameLanguage.UK,
                "Жираф живе в савані", "Жираф жовтий з коричневими плямами", "Жираф тихенько мукає: м-м-м",
                "Жираф їсть листя з дерев", "Жираф дуже великий і високий", "У жирафа дуже довга шия");
        add("giraffe", GameLanguage.EN,
                "The giraffe lives in the savanna", "The giraffe is yellow with brown spots", "The giraffe hums quietly: mmm",
                "The giraffe eats leaves from trees", "The giraffe is very big and tall", "The giraffe has a very long neck");

        add("hippopotamus", GameLanguage.HE,
                "ההיפופוטם גר בנהר", "ההיפופוטם אפור", "ההיפופוטם נוחר: הו-הו!",
                "ההיפופוטם אוכל עשב", "ההיפופוטם גדול", "ההיפופוטם אוהב לשבת במים");
        add("hippopotamus", GameLanguage.RU,
                "Бегемот живёт в реке", "Бегемот серый", "Бегемот ревёт: о-о-о!",
                "Бегемот ест траву", "Бегемот большой", "Бегемот любит сидеть в воде");
        add("hippopotamus", GameLanguage.UK,
                "Бегемот живе в річці", "Бегемот сірий", "Бегемот реве: о-о-о!",
                "Бегемот їсть траву", "Бегемот великий", "Бегемот любить сидіти у воді");
        add("hippopotamus", GameLanguage.EN,
                "The hippo lives in the river", "The hippo is gray", "The hippo grunts: ho-ho!",
                "The hippo eats grass", "The hippo is big", "The hippo likes to sit in the water");

        add("zebra", GameLanguage.HE,
                "הזברה גרה בסוואנה", "הזברה מפוספסת בשחור ולבן", "הזברה צועקת: אִי-אָה!",
                "הזברה אוכלת עשב", "הזברה גדולה", "לזברה יש פסים על כל הגוף");
        add("zebra", GameLanguage.RU,
                "Зебра живёт в саванне", "Зебра в чёрно-белую полоску", "Зебра кричит: иа-иа!",
                "Зебра ест траву", "Зебра большая", "Зебра вся в полосках");
        add("zebra", GameLanguage.UK,
                "Зебра живе в савані", "Зебра в чорно-білу смужку", "Зебра кричить: іа-іа!",
                "Зебра їсть траву", "Зебра велика", "Зебра вся в смужках");
        add("zebra", GameLanguage.EN,
                "The zebra lives in the savanna", "The zebra has black and white stripes", "The zebra calls: hee-haw!",
                "The zebra eats grass", "The zebra is big", "The zebra has stripes all over");

        add("leopard", GameLanguage.HE,
                "הנמר גר בסוואנה", "הנמר צהוב עם כתמים שחורים", "הנמר נוהם: ררר!",
                "הנמר אוכל בשר", "הנמר גדול", "הנמר מטפס על עצים");
        add("leopard", GameLanguage.RU,
                "Леопард живёт в саванне", "Леопард жёлтый с чёрными пятнами", "Леопард рычит: р-р-р!",
                "Леопард ест мясо", "Леопард большой", "Леопард лазит по деревьям");
        add("leopard", GameLanguage.UK,
                "Леопард живе в савані", "Леопард жовтий з чорними плямами", "Леопард гарчить: р-р-р!",
                "Леопард їсть м'ясо", "Леопард великий", "Леопард лазить по деревах");
        add("leopard", GameLanguage.EN,
                "The leopard lives in the savanna", "The leopard is yellow with black spots", "The leopard growls: grrr!",
                "The leopard eats meat", "The leopard is big", "The leopard climbs trees");
    }

    private AnimalAnswers() {
    }

    /** Returns the answer, or empty when the animal or translation is unknown. */
    static Optional<String> answer(String englishAnimalName, Topic topic, GameLanguage language) {
        if (englishAnimalName == null) {
            return Optional.empty();
        }
        return Optional.ofNullable(ANSWERS.get(englishAnimalName.trim().toLowerCase(Locale.ROOT)))
                .map(byLanguage -> byLanguage.get(language))
                .map(byTopic -> byTopic.get(topic));
    }

    /** Arguments follow the Topic order: habitat, color, sound, diet, size, unique. */
    private static void add(String animal, GameLanguage language,
                            String habitat, String color, String sound,
                            String diet, String size, String unique) {
        Map<Topic, String> byTopic = new EnumMap<>(Topic.class);
        byTopic.put(Topic.HABITAT, habitat);
        byTopic.put(Topic.COLOR, color);
        byTopic.put(Topic.SOUND, sound);
        byTopic.put(Topic.DIET, diet);
        byTopic.put(Topic.SIZE, size);
        byTopic.put(Topic.UNIQUE, unique);
        ANSWERS.computeIfAbsent(animal, key -> new EnumMap<>(GameLanguage.class)).put(language, byTopic);
    }
}
