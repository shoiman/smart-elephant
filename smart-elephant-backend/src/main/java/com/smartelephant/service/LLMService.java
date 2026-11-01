package com.smartelephant.service;

import com.smartelephant.i18n.AnswerChecker;
import com.smartelephant.i18n.GameLanguage;
import com.smartelephant.i18n.QuestionTemplates;
import com.smartelephant.i18n.QuestionTemplates.LocalizedQuestion;
import com.smartelephant.i18n.QuestionTemplates.Topic;
import com.smartelephant.model.entity.Animal;
import com.smartelephant.model.enums.QuestionDifficulty;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ThreadLocalRandom;

/**
 * Service for interacting with Claude API
 * Generates questions, validates answers, and performs analysis
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class LLMService {

    private final QuestionTemplates questionTemplates;
    private final AnswerChecker answerChecker;

    @Value("${app.claude.api-key}")
    private String claudeApiKey;

    @Value("${app.claude.model}")
    private String claudeModel;

    @Value("${app.claude.max-tokens}")
    private Integer maxTokens;

    /**
     * Generate a question about an animal based on difficulty level.
     * Returns the question text together with its topic and correct answer.
     */
    public LocalizedQuestion generateQuestion(
            Animal animal,
            QuestionDifficulty difficulty,
            Integer childAge,
            GameLanguage language,
            boolean allowUnique) {

        log.info("Generating question for animal: {}, difficulty: {}, age: {}, language: {}",
                animal.getName(), difficulty, childAge, language);

        // Build prompt based on difficulty
        String prompt = buildQuestionPrompt(animal, difficulty, childAge, language);

        // For now, return a mock question from localized templates
        // In Phase 2, we'll integrate actual Claude API
        return questionTemplates.question(animal.getName(), difficulty, language, allowUnique,
                ThreadLocalRandom.current());
    }

    /**
     * Validate if an answer is correct
     */
    public Map<String, Object> validateAnswer(String answer, Animal animal, Topic topic, GameLanguage language) {
        log.info("Validating answer: '{}' (animal: {}, topic: {}, language: {})",
                answer, animal.getName(), topic, language.getCode());

        // Step 1: free keyword check against the known answer concepts
        Optional<Boolean> keywordResult = answerChecker.check(animal.getName(), topic, language, answer);
        if (keywordResult.isPresent()) {
            boolean isCorrect = keywordResult.get();
            Map<String, Object> result = new HashMap<>();
            result.put("isCorrect", isCorrect);
            result.put("explanation", isCorrect ? "Great job! That's correct!" : "Not quite right, but keep trying!");
            result.put("score", isCorrect ? 100 : 0);
            return result;
        }

        // No rules for this animal/topic yet: lenient mock validation
        // In Phase 2, unmatched answers will go to Claude
        return generateMockValidation(answer, animal);
    }

    /**
     * Build prompt for question generation
     */
    private String buildQuestionPrompt(
            Animal animal,
            QuestionDifficulty difficulty,
            Integer childAge,
            GameLanguage language) {

        StringBuilder prompt = new StringBuilder();
        prompt.append("Generate a question for a child about the animal: ").append(animal.getName()).append("\n");
        prompt.append("Child age: ").append(childAge).append("\n");
        prompt.append("Language (ISO 639-1): ").append(language.getCode()).append("\n");
        prompt.append("Write the question only in this language.\n");
        prompt.append("Difficulty level: ").append(difficulty.getValue()).append("\n");
        prompt.append("Requirements:\n");

        switch (difficulty) {
            case EASY:
                prompt.append("- Simple, direct question\n");
                prompt.append("- Vocabulary appropriate for 2-3 year olds\n");
                prompt.append("- About habitat, color, or sound\n");
                break;
            case MEDIUM:
                prompt.append("- Moderately complex question\n");
                prompt.append("- Vocabulary appropriate for 4-5 year olds\n");
                prompt.append("- About diet, behavior, or relationships\n");
                break;
            case HARD:
                prompt.append("- Complex reasoning question\n");
                prompt.append("- Vocabulary appropriate for 5-6 year olds\n");
                prompt.append("- Why/How questions, comparisons\n");
                break;
        }

        prompt.append("Return only the question text, no explanation.\n");
        return prompt.toString();
    }

    /**
     * Mock answer validation for Phase 1
     */
    private Map<String, Object> generateMockValidation(String answer, Animal animal) {
        Map<String, Object> result = new HashMap<>();

        // Simple mock: if answer contains key facts, it's correct
        boolean isCorrect = isAnswerReasonable(answer, animal);

        result.put("isCorrect", isCorrect);
        result.put("explanation", isCorrect ? "Great job! That's correct!" :
                "Not quite right, but keep trying!");
        result.put("score", isCorrect ? 100 : 50);

        return result;
    }

    /**
     * Check if answer is reasonable
     */
    private boolean isAnswerReasonable(String answer, Animal animal) {
        if (answer == null || answer.isEmpty()) {
            return false;
        }

        String lowerAnswer = answer.toLowerCase();
        String animalName = animal.getName().toLowerCase();
        String habitat = animal.getHabitat().toLowerCase();

        // Very basic check - can be improved
        return !lowerAnswer.equals("i don't know") && !lowerAnswer.equals("no idea");
    }
}
