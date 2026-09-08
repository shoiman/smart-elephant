package com.smartelephant.service;

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
import java.util.List;
import java.util.Optional;
import java.util.UUID;

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

    /**
     * Generate the next question for a child
     * Considers:
     * 1. Child's age
     * 2. Child's language
     * 3. Last 20 games for difficulty adaptation
     */
    public QuestionResponse generateNextQuestion(Child child) {
        log.info("Generating next question for child: {} (age: {})", child.getName(), child.getAge());

        // Get last 20 games to determine difficulty
        List<GameSession> last20Games = gameSessionRepository.findLast20ByChildId(child.getId());
        QuestionDifficulty difficulty = determineDifficulty(last20Games);

        log.debug("Determined difficulty for child {}: {}", child.getId(), difficulty);

        // Select random animal
        Optional<Animal> animalOpt = animalRepository.findRandomAnimal();
        if (animalOpt.isEmpty()) {
            throw new RuntimeException("No animals found in database");
        }
        Animal animal = animalOpt.get();

        // Generate question using LLM
        String questionText = llmService.generateQuestion(
                animal,
                difficulty,
                child.getAge(),
                child.getLanguage()
        );

        // Build response
        return QuestionResponse.builder()
                .questionId("q-" + UUID.randomUUID().toString())
                .animalId(animal.getId())
                .animalName(animal.getName())
                .questionText(questionText)
                .difficulty(difficulty.getValue())
                .hints(generateHints(animal, difficulty))
                .createdAt(LocalDateTime.now())
                .build();
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

    /**
     * Generate hints based on difficulty
     */
    private List<String> generateHints(Animal animal, QuestionDifficulty difficulty) {
        // Mock hints for Phase 1
        switch (difficulty) {
            case EASY:
                return List.of(
                        "Think about where this animal lives",
                        "Where do you see this animal?"
                );
            case MEDIUM:
                return List.of(
                        "Think about what this animal eats",
                        "What is its favorite food?",
                        "Is it a meat eater or plant eater?"
                );
            case HARD:
                return List.of(
                        "Think deeply about why this feature is useful",
                        "How does this help the animal survive?",
                        "What is the purpose?"
                );
            default:
                return List.of("Try to think carefully");
        }
    }
}
