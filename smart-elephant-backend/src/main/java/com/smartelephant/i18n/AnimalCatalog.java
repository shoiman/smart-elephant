package com.smartelephant.i18n;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.smartelephant.i18n.QuestionTemplates.Topic;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Collections;
import java.util.EnumMap;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

/**
 * Game content for every animal: localized names, correct answers and answer-checking rules.
 *
 * The content lives in JSON files under {@code resources/content/} (not in code), so adding an
 * animal or fixing a phrase does not touch Java:
 * <ul>
 *   <li>{@code catalog.json} - which files to load</li>
 *   <li>{@code concepts.json} - keyword "concepts" (word stems per language) shared by all animals</li>
 *   <li>{@code animals/*.json} - animals, grouped by category</li>
 *   <li>{@code name_forms.json} - extra accepted forms for the "Who is this?" question</li>
 * </ul>
 * The "Who is this?" (NAME) topic is not written in the animal files: every animal gets it
 * automatically, its answer is the animal's name and its rule accepts the name (see {@link #nameStem}).
 * The content is validated when the application starts: a broken file fails fast with a clear message
 * instead of producing wrong questions for a child.
 */
@Component
public class AnimalCatalog {

    private static final String ROOT = "content/";
    private static final String INDEX = ROOT + "catalog.json";

    /** Languages that must have a localized animal name (English uses {@code nameEn}). */
    private static final List<GameLanguage> NAMED_LANGUAGES = List.of(GameLanguage.HE, GameLanguage.RU, GameLanguage.UK);

    /** Every animal needs these topics, so each difficulty level always has a question to ask. */
    private static final Set<Topic> REQUIRED_TOPICS = Set.of(Topic.HABITAT, Topic.COLOR, Topic.UNIQUE);

    /** Grammatical gender of an animal name; questions agree with it ("большой/большая/большое"). */
    public enum Gender {
        MASCULINE, FEMININE, NEUTER;

        static Gender fromCode(String code) {
            return switch (code == null ? "" : code.trim().toLowerCase(Locale.ROOT)) {
                case "m" -> MASCULINE;
                case "f" -> FEMININE;
                case "n" -> NEUTER;
                default -> throw new IllegalArgumentException("gender must be m, f or n, got: " + code);
            };
        }
    }

    /**
     * Animal name in one language.
     *
     * @param definite Hebrew only: definite form for multi-word names ("חזיר הבר", "האייל הקורא");
     *                 null means "ה" + name
     */
    public record LocalizedName(String name, Gender gender, String definite) {
    }

    /** A keyword concept ("SAVANNA", "MOO"): normalized word stems per language. */
    record Concept(String id, Map<GameLanguage, List<String>> stems) {
    }

    /** What counts as a correct answer: any accepted concept and none of the rejected ones. */
    record Rule(List<Concept> accepted, List<Concept> rejected) {
    }

    /** Extra accepted forms of an animal name (name_forms.json) and animals whose names must not be accepted. */
    record NameForms(Map<GameLanguage, List<String>> stems, List<String> rejectAnimals) {
        static final NameForms NONE = new NameForms(Map.of(), List.of());
    }

    /** Last letters dropped from a Russian/Ukrainian name, so "корова" also accepts "коровка". */
    private static final String SLAVIC_ENDINGS = "аяоеьйиыуюіїє";

    /** Everything the game knows about one animal. */
    public record AnimalContent(String id, String nameEn, String category,
                                Map<GameLanguage, LocalizedName> names,
                                Map<GameLanguage, Map<Topic, String>> answers,
                                Map<Topic, Rule> rules) {

        /** Topics this animal can be asked about (e.g. no SOUND for a fish). */
        public Set<Topic> topics() {
            return rules.keySet();
        }

        public Optional<String> answer(Topic topic, GameLanguage language) {
            return Optional.ofNullable(answers.getOrDefault(language, Map.of()).get(topic));
        }

        /** Localized name; English is the lowercase English name. */
        public Optional<LocalizedName> name(GameLanguage language) {
            if (language == GameLanguage.EN) {
                return Optional.of(new LocalizedName(nameEn.toLowerCase(Locale.ROOT), Gender.MASCULINE, null));
            }
            return Optional.ofNullable(names.get(language));
        }
    }

    private final List<AnimalContent> animals;
    private final Map<String, AnimalContent> byKey;

    /** Loads the content shipped with the application. */
    public AnimalCatalog() {
        this(new ObjectMapper());
    }

    AnimalCatalog(ObjectMapper mapper) {
        JsonNode index = read(mapper, INDEX);
        Map<String, Concept> concepts = parseConcepts(read(mapper, ROOT + text(index, "concepts", INDEX)));

        List<AnimalContent> loaded = new ArrayList<>();
        Map<String, AnimalContent> keys = new HashMap<>();
        for (JsonNode file : index.path("animals")) {
            String path = ROOT + file.asText();
            for (JsonNode node : read(mapper, path).path("animals")) {
                AnimalContent animal = parseAnimal(node, concepts, path);
                for (String key : List.of(animal.id(), animal.nameEn())) {
                    AnimalContent previous = keys.put(normalizeKey(key), animal);
                    if (previous != null && previous != animal) {
                        throw new IllegalStateException(path + ": duplicate animal '" + key + "'");
                    }
                }
                loaded.add(animal);
            }
        }
        if (loaded.isEmpty()) {
            throw new IllegalStateException("No animals found in " + INDEX);
        }

        // "Who is this?": built from the names after all animals are known (rules may reject other animals)
        Set<String> ids = new HashSet<>();
        loaded.forEach(animal -> ids.add(animal.id()));
        Map<String, NameForms> forms = new HashMap<>();
        if (index.hasNonNull("nameForms")) {
            String path = ROOT + index.get("nameForms").asText();
            forms = parseNameForms(read(mapper, path), ids, path);
        }
        Map<String, Concept> nameConcepts = new HashMap<>();
        for (AnimalContent animal : loaded) {
            nameConcepts.put(animal.id(), nameConcept(animal, forms.getOrDefault(animal.id(), NameForms.NONE)));
        }
        List<AnimalContent> withNames = new ArrayList<>();
        Map<String, AnimalContent> withNamesByKey = new HashMap<>();
        for (AnimalContent animal : loaded) {
            AnimalContent full = withNameTopic(animal, nameConcepts, forms.getOrDefault(animal.id(), NameForms.NONE));
            withNames.add(full);
            withNamesByKey.put(normalizeKey(full.id()), full);
            withNamesByKey.put(normalizeKey(full.nameEn()), full);
        }
        this.animals = Collections.unmodifiableList(withNames);
        this.byKey = Map.copyOf(withNamesByKey);
    }

    /** All animals, in file order. */
    public List<AnimalContent> all() {
        return animals;
    }

    /** Finds an animal by its English name ("Hippopotamus") or id ("hippo"), case-insensitive. */
    public Optional<AnimalContent> find(String nameOrId) {
        return nameOrId == null ? Optional.empty() : Optional.ofNullable(byKey.get(normalizeKey(nameOrId)));
    }

    // ---------- Parsing ----------

    private static Map<String, Concept> parseConcepts(JsonNode root) {
        Map<String, Concept> concepts = new HashMap<>();
        Iterator<Map.Entry<String, JsonNode>> fields = root.fields();
        while (fields.hasNext()) {
            Map.Entry<String, JsonNode> field = fields.next();
            Map<GameLanguage, List<String>> stems = new EnumMap<>(GameLanguage.class);
            for (GameLanguage language : GameLanguage.values()) {
                List<String> list = new ArrayList<>();
                for (JsonNode stem : field.getValue().path(language.getCode())) {
                    list.add(prepareStem(stem.asText()));
                }
                if (list.isEmpty()) {
                    throw new IllegalStateException("concepts.json: concept " + field.getKey()
                            + " has no stems for language '" + language.getCode() + "'");
                }
                stems.put(language, List.copyOf(list));
            }
            concepts.put(field.getKey(), new Concept(field.getKey(), stems));
        }
        return concepts;
    }

    private static AnimalContent parseAnimal(JsonNode node, Map<String, Concept> concepts, String path) {
        String id = text(node, "id", path);
        String where = path + " [" + id + "]";
        String nameEn = text(node, "nameEn", where);
        String category = text(node, "category", where);

        Map<GameLanguage, LocalizedName> names = new EnumMap<>(GameLanguage.class);
        for (GameLanguage language : NAMED_LANGUAGES) {
            JsonNode name = node.path("names").path(language.getCode());
            if (name.isMissingNode()) {
                throw new IllegalStateException(where + ": no name for language '" + language.getCode() + "'");
            }
            String definite = name.hasNonNull("definite") ? name.get("definite").asText() : null;
            try {
                names.put(language, new LocalizedName(text(name, "name", where),
                        Gender.fromCode(name.path("gender").asText(null)), definite));
            } catch (IllegalArgumentException e) {
                throw new IllegalStateException(where + " " + language.getCode() + ": " + e.getMessage(), e);
            }
        }

        Map<Topic, Rule> rules = new EnumMap<>(Topic.class);
        Iterator<Map.Entry<String, JsonNode>> checks = node.path("check").fields();
        while (checks.hasNext()) {
            Map.Entry<String, JsonNode> check = checks.next();
            Topic topic = topic(check.getKey(), where);
            List<Concept> accepted = conceptList(check.getValue().path("accept"), concepts, where);
            if (accepted.isEmpty()) {
                throw new IllegalStateException(where + ": topic " + check.getKey() + " accepts nothing");
            }
            rules.put(topic, new Rule(accepted, conceptList(check.getValue().path("reject"), concepts, where)));
        }
        for (Topic required : REQUIRED_TOPICS) {
            if (!rules.containsKey(required)) {
                throw new IllegalStateException(where + ": missing required topic " + required.name().toLowerCase(Locale.ROOT));
            }
        }

        Map<GameLanguage, Map<Topic, String>> answers = new EnumMap<>(GameLanguage.class);
        for (GameLanguage language : GameLanguage.values()) {
            Map<Topic, String> byTopic = new EnumMap<>(Topic.class);
            Iterator<Map.Entry<String, JsonNode>> fields = node.path("answers").path(language.getCode()).fields();
            while (fields.hasNext()) {
                Map.Entry<String, JsonNode> field = fields.next();
                byTopic.put(topic(field.getKey(), where), field.getValue().asText());
            }
            if (!byTopic.keySet().equals(rules.keySet())) {
                throw new IllegalStateException(where + ": answers in '" + language.getCode()
                        + "' cover topics " + byTopic.keySet() + " but check covers " + rules.keySet());
            }
            answers.put(language, Collections.unmodifiableMap(byTopic));
        }

        return new AnimalContent(id, nameEn, category, Collections.unmodifiableMap(names),
                Collections.unmodifiableMap(answers), Collections.unmodifiableMap(rules));
    }

    // ---------- "Who is this?" (NAME) ----------

    private static Map<String, NameForms> parseNameForms(JsonNode root, Set<String> animalIds, String path) {
        Map<String, NameForms> result = new HashMap<>();
        Iterator<Map.Entry<String, JsonNode>> animalsIt = root.fields();
        while (animalsIt.hasNext()) {
            Map.Entry<String, JsonNode> animal = animalsIt.next();
            if (animal.getKey().startsWith("_")) {
                continue; // comments
            }
            String where = path + " [" + animal.getKey() + "]";
            if (!animalIds.contains(animal.getKey())) {
                throw new IllegalStateException(where + ": unknown animal id");
            }
            Map<GameLanguage, List<String>> stems = new EnumMap<>(GameLanguage.class);
            List<String> reject = new ArrayList<>();
            Iterator<Map.Entry<String, JsonNode>> entries = animal.getValue().fields();
            while (entries.hasNext()) {
                Map.Entry<String, JsonNode> entry = entries.next();
                if (entry.getKey().equals("rejectAnimals")) {
                    for (JsonNode id : entry.getValue()) {
                        if (!animalIds.contains(id.asText())) {
                            throw new IllegalStateException(where + ": rejectAnimals has unknown animal " + id.asText());
                        }
                        reject.add(id.asText());
                    }
                    continue;
                }
                GameLanguage language = languageOf(entry.getKey(), where);
                List<String> list = new ArrayList<>();
                for (JsonNode stem : entry.getValue()) {
                    list.add(stem.asText());
                }
                stems.put(language, List.copyOf(list));
            }
            result.put(animal.getKey(), new NameForms(Map.copyOf(stems), List.copyOf(reject)));
        }
        return result;
    }

    private static GameLanguage languageOf(String code, String where) {
        for (GameLanguage language : GameLanguage.values()) {
            if (language.getCode().equals(code)) {
                return language;
            }
        }
        throw new IllegalStateException(where + ": unknown language '" + code + "'");
    }

    /** The animal's name in every language plus the extra forms from name_forms.json. */
    private static Concept nameConcept(AnimalContent animal, NameForms forms) {
        Map<GameLanguage, List<String>> stems = new EnumMap<>(GameLanguage.class);
        for (GameLanguage language : GameLanguage.values()) {
            List<String> list = new ArrayList<>();
            list.add(prepareStem(nameStem(localizedName(animal, language), language)));
            for (String extra : forms.stems().getOrDefault(language, List.of())) {
                list.add(prepareStem(extra));
            }
            stems.put(language, List.copyOf(list));
        }
        return new Concept("NAME:" + animal.id(), stems);
    }

    /**
     * Stem that accepts an animal name and its usual endings:
     * "корова" -> "коров" ("коровка", "коровушка"), "слон" -> "слон" ("слоник"),
     * "божья коровка" -> "~божьякоровк" (multi-word names match as a substring), "פיל" -> "פיל".
     * Short stems (2 letters, "ёж", "עז") are matched as whole words by {@link AnswerChecker}.
     */
    static String nameStem(String name, GameLanguage language) {
        String normalized = AnswerChecker.normalize(name);
        boolean multiWord = normalized.contains(" ");
        String stem = normalized.replace(" ", "");
        boolean slavic = language == GameLanguage.RU || language == GameLanguage.UK;
        if (slavic && stem.length() > 3 && SLAVIC_ENDINGS.indexOf(stem.charAt(stem.length() - 1)) >= 0) {
            stem = stem.substring(0, stem.length() - 1);
        }
        return multiWord ? "~" + stem : stem;
    }

    /** Adds the NAME topic: its answer is the name ("Корова", "פרה"), its rule accepts the name. */
    private static AnimalContent withNameTopic(AnimalContent animal, Map<String, Concept> nameConcepts, NameForms forms) {
        Map<Topic, Rule> rules = new EnumMap<>(Topic.class);
        rules.putAll(animal.rules());
        List<Concept> rejected = forms.rejectAnimals().stream().map(nameConcepts::get).toList();
        rules.put(Topic.NAME, new Rule(List.of(nameConcepts.get(animal.id())), rejected));

        Map<GameLanguage, Map<Topic, String>> answers = new EnumMap<>(GameLanguage.class);
        for (GameLanguage language : GameLanguage.values()) {
            Map<Topic, String> byTopic = new EnumMap<>(Topic.class);
            byTopic.putAll(animal.answers().get(language));
            byTopic.put(Topic.NAME, capitalize(localizedName(animal, language)));
            answers.put(language, Collections.unmodifiableMap(byTopic));
        }
        return new AnimalContent(animal.id(), animal.nameEn(), animal.category(), animal.names(),
                Collections.unmodifiableMap(answers), Collections.unmodifiableMap(rules));
    }

    private static String localizedName(AnimalContent animal, GameLanguage language) {
        return animal.name(language).map(LocalizedName::name).orElse(animal.nameEn());
    }

    private static String capitalize(String text) {
        return text.isEmpty() ? text : text.substring(0, 1).toUpperCase(Locale.ROOT) + text.substring(1);
    }

    private static List<Concept> conceptList(JsonNode ids, Map<String, Concept> concepts, String where) {
        List<Concept> result = new ArrayList<>();
        for (JsonNode id : ids) {
            Concept concept = concepts.get(id.asText());
            if (concept == null) {
                throw new IllegalStateException(where + ": unknown concept " + id.asText());
            }
            result.add(concept);
        }
        return List.copyOf(result);
    }

    private static Topic topic(String key, String where) {
        try {
            return Topic.valueOf(key.trim().toUpperCase(Locale.ROOT));
        } catch (IllegalArgumentException e) {
            throw new IllegalStateException(where + ": unknown topic '" + key + "'", e);
        }
    }

    /** Stems are normalized like answers, so they can be written naturally (final letters, "ё", "-"). */
    private static String prepareStem(String stem) {
        String prefix = stem.startsWith("~") || stem.startsWith("=") ? stem.substring(0, 1) : "";
        return prefix + AnswerChecker.normalize(stem.substring(prefix.length())).replace(" ", "");
    }

    private static String text(JsonNode node, String field, String where) {
        JsonNode value = node.get(field);
        if (value == null || value.asText().isBlank()) {
            throw new IllegalStateException(where + ": missing '" + field + "'");
        }
        return value.asText();
    }

    private static String normalizeKey(String key) {
        return key.trim().toLowerCase(Locale.ROOT);
    }

    private static JsonNode read(ObjectMapper mapper, String path) {
        try (InputStream in = AnimalCatalog.class.getClassLoader().getResourceAsStream(path)) {
            if (in == null) {
                throw new IllegalStateException("Content file not found on classpath: " + path);
            }
            return mapper.readTree(in);
        } catch (IOException e) {
            throw new IllegalStateException("Cannot read content file " + path + ": " + e.getMessage(), e);
        }
    }
}
