package com.smartelephant.service;

import com.smartelephant.i18n.AnimalCatalog;
import com.smartelephant.i18n.AnimalCatalog.AnimalContent;
import com.smartelephant.i18n.GameLanguage;
import com.smartelephant.i18n.QuestionTemplates;
import com.smartelephant.i18n.QuestionTemplates.LocalizedQuestion;
import com.smartelephant.i18n.QuestionTemplates.Topic;
import com.smartelephant.model.dto.QuestionResponse;
import com.smartelephant.model.entity.Animal;
import com.smartelephant.model.entity.Child;
import com.smartelephant.model.entity.GameSession;
import com.smartelephant.model.enums.QuestionDifficulty;
import com.smartelephant.repository.AnimalRepository;
import com.smartelephant.repository.GameSessionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.EnumSet;
import java.util.List;
import java.util.Locale;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.ThreadLocalRandom;

/**
 * Service for question generation and management
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class QuestionService {

    private final LLMService llmService;
    private final AnimalRepository animalRepository;
    private final GameSessionRepository gameSessionRepository;
    private final QuestionTemplates questionTemplates;
    private final TtsService ttsService;
    private final AnimalCatalog animalCatalog;
    private final HostLineService hostLineService;

    /**
     * Generate the next question for a child
     * Considers:
     * 1. Child's age
     * 2. Language selected in the UI (falls back to the child's profile language)
     * 3. Last 20 games for difficulty adaptation
     *
     * @param requestedLanguage language code from the client ("he", "ru", "uk"), may be null
     * @param answerLevel       level picked by the parent: "toddler", "middle" or "older", may be null.
     *                          The "what is special about it" question is asked only on "older".
     * @param animalName        animal of the current game (English name or id); null starts a new animal
     * @param askedTopics       topics already asked about that animal, comma-separated ("NAME,COLOR"), may be null.
     *                          A new animal always starts with "Who is this?" (NAME); when every topic of the
     *                          animal has been asked, a new animal is picked.
     */
    public QuestionResponse generateNextQuestion(Child child, String requestedLanguage, String answerLevel,
                                                 String animalName, String askedTopics) {
        GameLanguage language = GameLanguage.fromCode(
                requestedLanguage != null && !requestedLanguage.isBlank() ? requestedLanguage : child.getLanguage());
        log.info("Generating next question for child: {} (age: {}, language: {})",
                child.getName(), child.getAge(), language.getCode());

        // Get last 20 games to determine difficulty
        List<GameSession> last20Games = gameSessionRepository.findLast20ByChildId(child.getId());
        QuestionDifficulty difficulty = determineDifficulty(last20Games);

        log.debug("Determined difficulty for child {}: {}", child.getId(), difficulty);

        boolean allowUnique = "older".equalsIgnoreCase(answerLevel);
        Optional<Animal> current = findCurrentAnimal(animalName);
        Set<Topic> asked = current.isPresent() ? parseTopics(askedTopics) : EnumSet.noneOf(Topic.class);
        Animal animal = current.orElseGet(this::selectRandomAnimal);

        // Generate question using LLM
        Optional<LocalizedQuestion> next = llmService.generateQuestion(
                animal, difficulty, child.getAge(), language, allowUnique, asked);
        if (next.isEmpty()) {
            // Every topic of this animal has been asked: start a new animal with "Who is this?"
            animal = selectRandomAnimal();
            asked = EnumSet.noneOf(Topic.class);
            next = llmService.generateQuestion(animal, difficulty, child.getAge(), language, allowUnique, asked);
        }
        LocalizedQuestion question = next.orElseThrow(
                () -> new IllegalStateException("No question for animal " + current.map(Animal::getName).orElse("?")));
        Set<Topic> askedAfter = EnumSet.copyOf(asked);
        askedAfter.add(question.topic());

        // Build response
        return QuestionResponse.builder()
                .questionId("q-" + UUID.randomUUID().toString())
                .animalId(animal.getId())
                .animalName(animal.getName())
                .questionText(question.text())
                .topic(question.topic().name())
                .answer(question.answer())
                .audioUrl(ttsService.audioUrl(question.text(), language))
                .answerAudioUrl(ttsService.audioUrl(question.answer(), language))
                .feedbackAudio(hostLineService.screenAudioUrls(language, question.answer()))
                .remainingQuestions(questionTemplates.remainingQuestions(animal.getName(), askedAfter, allowUnique))
                .difficulty(difficulty.getValue())
                .hints(questionTemplates.hints(difficulty, language))
                .createdAt(LocalDateTime.now())
                .build();
    }

    /** The animal of the current game, when the client sent one that exists. */
    private Optional<Animal> findCurrentAnimal(String animalName) {
        if (animalName == null || animalName.isBlank()) {
            return Optional.empty();
        }
        return animalCatalog.find(animalName)
                .flatMap(content -> animalRepository.findByNameIgnoreCase(content.nameEn()))
                .or(() -> animalRepository.findByNameIgnoreCase(animalName.trim()));
    }

    /** "NAME, color" -> {NAME, COLOR}; unknown names are ignored. */
    static Set<Topic> parseTopics(String csv) {
        Set<Topic> topics = EnumSet.noneOf(Topic.class);
        if (csv == null) {
            return topics;
        }
        for (String part : csv.split(",")) {
            String name = part.trim().toUpperCase(Locale.ROOT);
            Arrays.stream(Topic.values()).filter(topic -> topic.name().equals(name)).forEach(topics::add);
        }
        return topics;
    }

    /**
     * Picks a random animal that has game content (names, answers, rules), so every question
     * can be asked in the child's language and checked. Falls back to any animal in the database.
     */
    private Animal selectRandomAnimal() {
        List<AnimalContent> animals = animalCatalog.all();
        AnimalContent content = animals.get(ThreadLocalRandom.current().nextInt(animals.size()));
        return animalRepository.findByNameIgnoreCase(content.nameEn())
                .or(animalRepository::findRandomAnimal)
                .orElseThrow(() -> new RuntimeException("No animals found in database"));
    }

    /**
     * Determine difficulty based on success rate from last 20 games
     * Logic:
     * - < 50% success: EASY (child is struggling)
     * - 50-80% success: MEDIUM (optimal learning zone)
     * - > 80% success: HARD (challenge them)
     */
    private QuestionDifficulty determineDifficulty(List<GameSession> lastGames) {
        if (lastGames.isEmpty()) {
            return QuestionDifficulty.EASY; // Start with EASY
        }

        // Calculate success rate from last games
        long totalQuestions = lastGames.stream()
                .mapToInt(GameSession::getTotalQuestions)
                .sum();

        long correctAnswers = lastGames.stream()
                .mapToInt(GameSession::getCorrectAnswers)
                .sum();

        if (totalQuestions == 0) {
            return QuestionDifficulty.EASY;
        }

        double successRate = (double) correctAnswers / totalQuestions * 100;
        log.debug("Success rate: {}%", successRate);

        if (successRate < 50) {
            return QuestionDifficulty.EASY;
        } else if (successRate > 80) {
            return QuestionDifficulty.HARD;
        } else {
            return QuestionDifficulty.MEDIUM;
        }
    }

}
