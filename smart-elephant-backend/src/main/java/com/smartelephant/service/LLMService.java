package com.smartelephant.service;

import com.smartelephant.model.entity.Animal;
import com.smartelephant.model.enums.QuestionDifficulty;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.Map;

/**
 * Service for interacting with Claude API
 * Generates questions, validates answers, and performs analysis
 */
@Service
@Slf4j
public class LLMService {

    @Value("${app.claude.api-key}")
    private String claudeApiKey;

    @Value("${app.claude.model}")
    private String claudeModel;

    @Value("${app.claude.max-tokens}")
    private Integer maxTokens;

    /**
     * Generate a question about an animal based on difficulty level
     */
    public String generateQuestion(
            Animal animal,
            QuestionDifficulty difficulty,
            Integer childAge,
            String language) {

        log.info("Generating question for animal: {}, difficulty: {}, age: {}, language: {}",
                animal.getName(), difficulty, childAge, language);

        // Build prompt based on difficulty
        String prompt = buildQuestionPrompt(animal, difficulty, childAge, language);

        // For now, return a mock question
        // In Phase 2, we'll integrate actual Claude API
        return generateMockQuestion(animal, difficulty);
    }

    /**
     * Validate if an answer is correct
     */
    public Map<String, Object> validateAnswer(String answer, String questionText, Animal animal) {
        log.info("Validating answer: {}", answer);

        // For Phase 1, simple mock validation
        // In Phase 2, we'll use Claude to validate
        return generateMockValidation(answer, animal);
    }

    /**
     * Build prompt for question generation
     */
    private String buildQuestionPrompt(
            Animal animal,
            QuestionDifficulty difficulty,
            Integer childAge,
            String language) {

        StringBuilder prompt = new StringBuilder();
        prompt.append("Generate a question for a child about the animal: ").append(animal.getName()).append("\n");
        prompt.append("Child age: ").append(childAge).append("\n");
        prompt.append("Language: ").append(language).append("\n");
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
     * Mock question generation for Phase 1
     */
    private String generateMockQuestion(Animal animal, QuestionDifficulty difficulty) {
        Map<String, String[]> questions = new HashMap<>();

        // EASY questions
        questions.put("EASY_habitat", new String[]{
                "Where does {} live?",
                "What is the home of {}?",
                "Where can we find {}?"
        });

        questions.put("EASY_color", new String[]{
                "What color is {}?",
                "Can you tell the color of {}?",
                "What is the color of {}?"
        });

        questions.put("EASY_sound", new String[]{
                "What sound does {} make?",
                "How does {} sound?",
                "What noise does {} make?"
        });

        // MEDIUM questions
        questions.put("MEDIUM_diet", new String[]{
                "What does {} eat?",
                "What is the diet of {}?",
                "Is {} a meat eater or plant eater?"
        });

        questions.put("MEDIUM_size", new String[]{
                "Is {} big or small?",
                "How large is {}?",
                "Compare the size of {} to a cat"
        });

        // HARD questions
        questions.put("HARD_why", new String[]{
                "Why does {} have {} as its feature?",
                "What is the purpose of {} in {}?",
                "Why is {} important for {}?"
        });

        questions.put("HARD_compare", new String[]{
                "How is {} different from {}?",
                "Compare {} and {} in terms of habitat",
                "What makes {} unique compared to other animals?"
        });

        // Select a random question template for this difficulty
        String key = difficulty.getValue() + "_" +
                (difficulty == QuestionDifficulty.EASY ? "habitat" :
                 difficulty == QuestionDifficulty.MEDIUM ? "diet" : "why");

        String[] questionTemplates = questions.getOrDefault(key,
                new String[]{"Where does {} live?"});

        String template = questionTemplates[(int) (Math.random() * questionTemplates.length)];
        return template.replace("{}", animal.getName());
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
