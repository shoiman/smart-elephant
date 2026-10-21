package com.smartelephant.i18n;

import com.smartelephant.i18n.AnimalCatalog.Concept;
import com.smartelephant.i18n.AnimalCatalog.Rule;
import com.smartelephant.i18n.QuestionTemplates.Topic;
import org.springframework.stereotype.Component;

import java.text.Normalizer;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Optional;

/**
 * Checks a child's spoken answer with keyword "concepts" instead of an exact phrase.
 *
 * A child may answer "in the savanna", "in Africa" or "in the water" for a hippo - all fine.
 * Each animal + topic lists accepted concepts (and optionally rejected ones, e.g. "small"
 * for a big animal). The rules and concepts come from {@link AnimalCatalog} (resources/content).
 *
 * Stem syntax (in concepts.json):
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

    private final AnimalCatalog catalog;

    public AnswerChecker(AnimalCatalog catalog) {
        this.catalog = catalog;
    }

    /**
     * Returns true/false when the answer can be judged, or empty when there are no rules
     * for this animal/topic (the caller then falls back to another validation).
     */
    public Optional<Boolean> check(String englishAnimalName, Topic topic, GameLanguage language, String answer) {
        if (topic == null) {
            return Optional.empty();
        }
        Optional<Rule> rule = catalog.find(englishAnimalName).map(animal -> animal.rules().get(topic));
        if (rule.isEmpty()) {
            return Optional.empty();
        }
        if (answer == null || answer.isBlank()) {
            return Optional.of(false);
        }

        String normalized = normalize(answer);
        List<String> words = wordVariants(normalized, language);
        String compact = normalized.replace(" ", "");

        boolean accepted = rule.get().accepted().stream().anyMatch(c -> matches(c, language, words, compact));
        boolean rejected = rule.get().rejected().stream().anyMatch(c -> matches(c, language, words, compact));
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
        return Normalizer.normalize(text, Normalizer.Form.NFC).toLowerCase(Locale.ROOT)
                .replace('ё', 'е')
                .replaceAll("[\\u0591-\\u05C7]", "")
                .replaceAll("['’ʼ`׳״\"]", "")
                .replace('ך', 'כ').replace('ם', 'מ').replace('ן', 'נ').replace('ף', 'פ').replace('ץ', 'צ')
                .replaceAll("[^\\p{L}]+", " ")
                .trim();
    }
}
