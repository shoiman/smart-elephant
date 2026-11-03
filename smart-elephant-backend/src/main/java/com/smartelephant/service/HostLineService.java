package com.smartelephant.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.smartelephant.i18n.AnimalCatalog;
import com.smartelephant.i18n.AnswerChecker;
import com.smartelephant.i18n.GameLanguage;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Collection;
import java.util.EnumMap;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;

/**
 * Audio for the host's lines on the toddler level ("Правильно! Корова!", "תגידו שוב: חגב!").
 *
 * The lines are built in the frontend; browsers often have no voice for them (Chrome has no Hebrew
 * voice at all), so the backend voices them with Azure like the questions. To protect the Azure quota
 * only the line templates from content/host_lines.json can be voiced, and the {X}/{x} placeholder only
 * with a known card word: an animal name or an answer-option caption.
 */
@Service
public class HostLineService {

    private static final String FILE = "content/host_lines.json";
    /** One request covers the cards of one question (2-4) */
    static final int MAX_WORDS = 6;

    private final TtsService ttsService;
    private final Map<GameLanguage, List<String>> lines = new EnumMap<>(GameLanguage.class);
    /** Microphone screen lines; "correct" and "together" contain {answer} */
    private final Map<GameLanguage, List<String>> screenLines = new EnumMap<>(GameLanguage.class);
    /** Normalized card words per language */
    private final Map<GameLanguage, Set<String>> cardWords = new EnumMap<>(GameLanguage.class);

    public HostLineService(TtsService ttsService, AnimalCatalog catalog) {
        this.ttsService = ttsService;
        JsonNode root = read();
        for (GameLanguage language : List.of(GameLanguage.HE, GameLanguage.RU, GameLanguage.UK)) {
            List<String> templates = new ArrayList<>();
            root.path("lines").path(language.getCode()).forEach(line -> templates.add(line.asText()));
            if (templates.isEmpty()) {
                throw new IllegalStateException(FILE + ": no lines for language '" + language.getCode() + "'");
            }
            lines.put(language, List.copyOf(templates));

            List<String> screen = new ArrayList<>();
            root.path("screenLines").path(language.getCode()).forEach(line -> screen.add(line.asText()));
            screenLines.put(language, List.copyOf(screen));

            Set<String> words = new HashSet<>();
            root.path("cardWords").path(language.getCode()).forEach(word -> words.add(AnswerChecker.normalize(word.asText())));
            catalog.all().forEach(animal -> animal.name(language)
                    .ifPresent(name -> words.add(AnswerChecker.normalize(name.name()))));
            cardWords.put(language, Set.copyOf(words));
        }
    }

    /**
     * Every host line for these card words, as text -> audio URL. Unknown words are skipped;
     * the map is empty when TTS is disabled or the language has no lines.
     */
    public Map<String, String> audioUrls(GameLanguage language, Collection<String> words) {
        Map<String, String> result = new LinkedHashMap<>();
        List<String> templates = lines.get(language);
        if (templates == null || !ttsService.isEnabled()) {
            return result;
        }
        List<String> known = words == null ? List.of() : words.stream()
                .filter(word -> word != null && isCardWord(language, word))
                .map(String::trim)
                .distinct()
                .limit(MAX_WORDS)
                .toList();
        for (String template : templates) {
            if (!template.contains("{X}") && !template.contains("{x}")) {
                put(result, template, language);
                continue;
            }
            for (String word : known) {
                put(result, template.replace("{X}", capitalize(word)).replace("{x}", word), language);
            }
        }
        return result;
    }

    /**
     * Lines of the microphone screen (levels ★★ and ★★★) for one question, as text -> audio URL:
     * "Попробуем ещё?", "Правильно! {answer}", "Давай скажем вместе: {answer}". The answer is the
     * backend's own answer to the question, so nothing from the client is voiced here.
     */
    public Map<String, String> screenAudioUrls(GameLanguage language, String answer) {
        Map<String, String> result = new LinkedHashMap<>();
        if (!ttsService.isEnabled()) {
            return result;
        }
        for (String template : screenLines.getOrDefault(language, List.of())) {
            if (!template.contains("{answer}")) {
                put(result, template, language);
            } else if (answer != null && !answer.isBlank()) {
                put(result, template.replace("{answer}", answer), language);
            }
        }
        return result;
    }

    boolean isCardWord(GameLanguage language, String word) {
        // Short words only: card captions, never sentences
        return word.length() <= 30 && cardWords.getOrDefault(language, Set.of()).contains(AnswerChecker.normalize(word));
    }

    private void put(Map<String, String> result, String text, GameLanguage language) {
        String url = ttsService.audioUrl(text, language);
        if (url != null) {
            result.put(text, url);
        }
    }

    /** Same as the frontend: only the first letter becomes upper case. */
    private static String capitalize(String text) {
        return text.isEmpty() ? text : text.substring(0, 1).toUpperCase(Locale.ROOT) + text.substring(1);
    }

    private static JsonNode read() {
        try (InputStream in = HostLineService.class.getClassLoader().getResourceAsStream(FILE)) {
            if (in == null) {
                throw new IllegalStateException("Content file not found on classpath: " + FILE);
            }
            return new ObjectMapper().readTree(in);
        } catch (IOException e) {
            throw new IllegalStateException("Cannot read " + FILE + ": " + e.getMessage(), e);
        }
    }
}
