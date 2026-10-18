package com.smartelephant.i18n;

import com.smartelephant.i18n.QuestionTemplates.Topic;
import org.springframework.stereotype.Component;

import java.text.Normalizer;
import java.util.ArrayList;
import java.util.EnumMap;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;

/**
 * Checks a child's spoken answer with keyword "concepts" instead of an exact phrase.
 *
 * A child may answer "in the savanna", "in Africa" or "in the water" for a hippo - all fine.
 * Each animal + topic lists accepted concepts (and optionally rejected ones, e.g. "small"
 * for a big animal). A concept is a set of word stems per language.
 *
 * Stem syntax:
 *   "сер"   - a word starting with this stem ("серый", "серенький", "серая")
 *   "=иа"   - the whole word must be exactly this (short words that would match too much)
 *   "~ррр"  - substring of the answer with spaces and dashes removed (sounds: "р-р-р")
 * Stems of 2 letters or less are matched as whole words automatically.
 *
 * Until Claude API is connected this is the answer validation; later it is the fast,
 * free first step, and only unmatched answers will go to the LLM.
 */
@Component
public class AnswerChecker {

    /** A word-stem set per language. */
    record Concept(Map<GameLanguage, List<String>> stems) {
    }

    /** What counts as correct (any accepted, none rejected) for one animal + topic. */
    record Rule(List<Concept> accepted, List<Concept> rejected) {
    }

    // ---------- Concepts (he | ru | uk | en, stems separated by "|") ----------

    private static final Concept SAVANNA = concept("סוואנ|סוונ|אפריק|ספארי", "саванн|африк|сафари", "саван|африц|африк|сафарі", "savann|africa|safari");
    private static final Concept RIVER = concept("נהר|מים|אגם|ביצה|בוץ", "рек|речк|вод|озер|болот|грязь", "річк|рік|вод|озер|болот", "river|water|lake|swamp|mud");
    private static final Concept COLD = concept("=קר|קרח|שלג|אנטארקטיק|קוטב|=ים", "холод|лед|льд|снег|антаркт|север|полюс|мор", "холод|лід|льод|сніг|антаркт|північ|полюс|мор", "cold|ice|snow|antarctic|pole|sea");

    private static final Concept GRAY = concept("אפור", "сер", "сір", "gray|grey");
    private static final Concept YELLOW = concept("צהוב|כתום|זהב|זהוב", "желт|рыж|оранж|золот", "жовт|руд|помаранч|золот", "yellow|orange|gold");
    private static final Concept BLACK_WHITE = concept("שחור|לבן|=פס|פסים|מפוספס", "черн|бел|полос", "чорн|біл|смуж|смуг", "black|white|stripe");
    private static final Concept SPOTS = concept("כתמ|נקוד|מנומר", "пятн", "плям", "spot");
    private static final Concept BROWN = concept("=חום|חומ", "коричн", "коричн", "brown");

    private static final Concept TRUMPET = concept("~טוטו|חצוצר|מחצצר", "~туту|труб", "~туту|сурм", "~toot|trumpet");
    private static final Concept ROAR = concept("~ררר|~רר|שואג|שאג|נוהם|נהמ", "~рр|рыч|рев", "~рр|гарч|рик|рев", "~grr|roar|growl");
    private static final Concept SQUEAK = concept("~פיפי|מצייצ|ציוצ|צועק", "~пипи|пищ|крич", "~піпі|пищ|крич", "~peep|squeak");
    private static final Concept HUM = concept("~מממ|מזמזמ|זמזומ|שקט", "~ммм|мыч|тих|молч", "~ммм|мук|тих|мовч", "~mmm|hum|quiet");
    private static final Concept HIPPO_SOUND = concept("~הוהו|נוחר|נחיר|שואג", "~оо|~хрю|рев|фырк|рыч", "~оо|~хрю|рев|фирк|гарч", "~hoho|grunt|roar|snort");
    private static final Concept ZEBRA_SOUND = concept("~איאה|צועק|צוהל|נוער", "=иа|~иаиа|крич|ржет|~игого", "=іа|~іаіа|крич|ірж|~ігого", "~heehaw|neigh|bark");

    private static final Concept GRASS = concept("עשב|דשא|צמח|חציר", "трав|сен|растен", "трав|сін|рослин", "grass|hay|plant");
    private static final Concept LEAVES = concept("עלה|עלים|=עץ|עצים|ענפ", "лист|ветк|дерев", "лист|гілк|дерев", "leaf|leaves|tree|branch");
    private static final Concept FRUIT = concept("פרי|פירות|בננ|תפוח", "фрукт|банан|яблок", "фрукт|банан|яблук", "fruit|banana|apple");
    private static final Concept MEAT = concept("בשר|חיות|ציד", "мяс|живот|охот", "мяс|тварин|полю", "meat|animal|hunt");
    private static final Concept FISH = concept("=דג|דגים|דגה", "рыб", "риб", "fish");

    private static final Concept BIG = concept("גדול|ענק|גבוה", "больш|огромн|высок|велик|громадн", "велик|величез|висок|здоров", "big|large|huge|tall|giant");
    private static final Concept SMALL = concept("קטנ", "маленьк|=мал|небольш|крошечн", "маленьк|=мал|невелик|крихітн", "small|little|tiny");

    private static final Concept TRUNK = concept("חדק|=אף|אוזנ|=חט|חטים", "хобот|нос|уши|ушей|ушк|бивн", "хобот|ніс|нос|вуха|вух|бивн", "trunk|nose|ear|tusk");
    private static final Concept MANE = concept("רעמה|שיער|=מלך", "грив|цар|корол|волос", "грив|цар|корол|волос", "mane|king|hair");
    private static final Concept SWIM = concept("שוחה|שוחים|שחיי|צולל|=ים|מים", "плава|ныря|вод", "плава|пірна|вод", "swim|dive|water");
    private static final Concept NECK = concept("צוואר|צואר|ארוכ|גבוה", "шея|шеи|шею|шейк|длинн|высок", "шия|шиї|шию|довг|висок", "neck|long|tall");
    private static final Concept STRIPES = concept("=פס|פסים|מפוספס", "полос", "смуж|смуг", "stripe");
    private static final Concept MOUTH = concept("=פה|שיניים|ניבים", "рот|пасть|зуб", "рот|паща|пащ|зуб", "mouth|teeth|tooth");
    private static final Concept CLIMB = concept("מטפס|טיפוס|עצים|=עץ|מהיר|=רץ|רצה", "лаз|дерев|быстр|бега", "лаз|дерев|швидк|бiга|біга", "climb|tree|fast|run");

    /** animal (English, lowercase) -> topic -> rule */
    private static final Map<String, Map<Topic, Rule>> RULES = new HashMap<>();

    static {
        rules("elephant",
                accept(SAVANNA), accept(GRAY), accept(TRUMPET),
                accept(GRASS, LEAVES, FRUIT), rule(List.of(BIG), List.of(SMALL)), accept(TRUNK, BIG));
        rules("lion",
                accept(SAVANNA), accept(YELLOW, BROWN), accept(ROAR),
                accept(MEAT), rule(List.of(BIG), List.of(SMALL)), accept(MANE));
        rules("penguin",
                accept(COLD), accept(BLACK_WHITE), accept(SQUEAK),
                accept(FISH), rule(List.of(SMALL), List.of(BIG)), accept(SWIM, COLD));
        rules("giraffe",
                accept(SAVANNA), accept(YELLOW, SPOTS, BROWN), accept(HUM),
                accept(LEAVES), rule(List.of(BIG), List.of(SMALL)), accept(NECK, SPOTS));
        rules("hippopotamus",
                accept(RIVER, SAVANNA), accept(GRAY), accept(HIPPO_SOUND),
                accept(GRASS), rule(List.of(BIG), List.of(SMALL)), accept(RIVER, MOUTH, BIG));
        rules("zebra",
                accept(SAVANNA), accept(BLACK_WHITE, STRIPES), accept(ZEBRA_SOUND),
                accept(GRASS), rule(List.of(BIG), List.of(SMALL)), accept(STRIPES, BLACK_WHITE));
        rules("leopard",
                accept(SAVANNA), accept(YELLOW, SPOTS), accept(ROAR),
                accept(MEAT), rule(List.of(BIG), List.of(SMALL)), accept(CLIMB, SPOTS));
    }

    /**
     * Returns true/false when the answer can be judged, or empty when there are no rules
     * for this animal/topic (the caller then falls back to another validation).
     */
    public Optional<Boolean> check(String englishAnimalName, Topic topic, GameLanguage language, String answer) {
        if (englishAnimalName == null || topic == null) {
            return Optional.empty();
        }
        Map<Topic, Rule> byTopic = RULES.get(englishAnimalName.trim().toLowerCase(Locale.ROOT));
        if (byTopic == null || !byTopic.containsKey(topic)) {
            return Optional.empty();
        }
        if (answer == null || answer.isBlank()) {
            return Optional.of(false);
        }

        Rule rule = byTopic.get(topic);
        String normalized = normalize(answer);
        List<String> words = wordVariants(normalized, language);
        String compact = normalized.replace(" ", "");

        boolean accepted = rule.accepted().stream().anyMatch(c -> matches(c, language, words, compact));
        boolean rejected = rule.rejected().stream().anyMatch(c -> matches(c, language, words, compact));
        return Optional.of(accepted && !rejected);
    }

    // ---------- Matching ----------

    private static boolean matches(Concept concept, GameLanguage language, List<String> words, String compact) {
        for (String stem : concept.stems().getOrDefault(language, List.of())) {
            if (stem.startsWith("~")) {
                if (compact.contains(stem.substring(1))) {
                    return true;
                }
            } else if (stem.startsWith("=") || stem.length() <= 2) {
                String exact = stem.startsWith("=") ? stem.substring(1) : stem;
                if (words.contains(exact)) {
                    return true;
                }
            } else if (words.stream().anyMatch(word -> word.startsWith(stem))) {
                return true;
            }
        }
        return false;
    }

    /** Words of the answer; for Hebrew also each word without prefixes like ה, ב, ו ("ובסוואנה" -> "סוואנה"). */
    private static List<String> wordVariants(String normalized, GameLanguage language) {
        List<String> result = new ArrayList<>();
        for (String word : normalized.split(" ")) {
            if (word.isEmpty()) {
                continue;
            }
            result.add(word);
            if (language == GameLanguage.HE) {
                String stripped = word;
                for (int i = 0; i < 2 && stripped.length() > 2 && "והבלמשכ".indexOf(stripped.charAt(0)) >= 0; i++) {
                    stripped = stripped.substring(1);
                    result.add(stripped);
                }
            }
        }
        return result;
    }

    /**
     * Lowercase, "ё" -> "е", no Hebrew vowel marks, final Hebrew letters -> regular ones,
     * apostrophes/gershayim removed ("м'ясо" -> "мясо", "ג׳ירפה" -> "גירפה"), other symbols -> spaces.
     */
    static String normalize(String text) {
        String result = Normalizer.normalize(text, Normalizer.Form.NFC).toLowerCase(Locale.ROOT)
                .replace('ё', 'е')
                .replaceAll("[\\u0591-\\u05C7]", "")
                .replaceAll("['’ʼ`׳״\"]", "")
                .replace('ך', 'כ').replace('ם', 'מ').replace('ן', 'נ').replace('ף', 'פ').replace('ץ', 'צ')
                .replaceAll("[^\\p{L}]+", " ")
                .trim();
        return result;
    }

    // ---------- Builders ----------

    private static Concept concept(String he, String ru, String uk, String en) {
        Map<GameLanguage, List<String>> stems = new EnumMap<>(GameLanguage.class);
        stems.put(GameLanguage.HE, stems(he));
        stems.put(GameLanguage.RU, stems(ru));
        stems.put(GameLanguage.UK, stems(uk));
        stems.put(GameLanguage.EN, stems(en));
        return new Concept(stems);
    }

    /** Stems are normalized like answers, so they can be written naturally (final letters, "ё"). */
    private static List<String> stems(String list) {
        List<String> result = new ArrayList<>();
        for (String stem : list.split("\\|")) {
            String prefix = stem.startsWith("~") || stem.startsWith("=") ? stem.substring(0, 1) : "";
            result.add(prefix + normalize(stem.substring(prefix.length())).replace(" ", ""));
        }
        return result;
    }

    private static Rule accept(Concept... concepts) {
        return new Rule(List.of(concepts), List.of());
    }

    private static Rule rule(List<Concept> accepted, List<Concept> rejected) {
        return new Rule(accepted, rejected);
    }

    /** Arguments follow the Topic order: habitat, color, sound, diet, size, unique. */
    private static void rules(String animal, Rule habitat, Rule color, Rule sound, Rule diet, Rule size, Rule unique) {
        Map<Topic, Rule> byTopic = new EnumMap<>(Topic.class);
        byTopic.put(Topic.HABITAT, habitat);
        byTopic.put(Topic.COLOR, color);
        byTopic.put(Topic.SOUND, sound);
        byTopic.put(Topic.DIET, diet);
        byTopic.put(Topic.SIZE, size);
        byTopic.put(Topic.UNIQUE, unique);
        RULES.put(animal, byTopic);
    }
}
