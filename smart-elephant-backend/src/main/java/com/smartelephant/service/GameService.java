package com.smartelephant.service;

import com.smartelephant.i18n.GameLanguage;
import com.smartelephant.i18n.QuestionTemplates.Topic;
import com.smartelephant.model.dto.AnswerCheckRequest;
import com.smartelephant.model.dto.AnswerCheckResponse;
import com.smartelephant.model.dto.AnswerRequest;
import com.smartelephant.model.dto.AnswerResponse;
import com.smartelephant.model.dto.GameSessionResponse;
import com.smartelephant.model.entity.*;
import com.smartelephant.model.enums.AnswerOutcome;
import com.smartelephant.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Map;

/**
 * Service for managing game sessions
 * Handles: start game, submit answer, end game
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class GameService {

    private final GameSessionRepository gameSessionRepository;
    private final AnswerRepository answerRepository;
    private final ChildRepository childRepository;
    private final AnimalRepository animalRepository;
    private final ProgressRepository progressRepository;
    private final ChildStickerRepository childStickerRepository;
    private final LLMService llmService;

    /**
     * Start a new game session for a child
     */
    @Transactional
    public GameSessionResponse startGame(Long childId, Integer numQuestions) {
        log.info("Starting new game for child: {}, num questions: {}", childId, numQuestions);

        // Validate child exists
        Child child = childRepository.findById(childId)
                .orElseThrow(() -> new RuntimeException("Child not found: " + childId));

        // Create new game session
        GameSession session = GameSession.builder()
                .child(child)
                .totalQuestions(numQuestions)
                .correctAnswers(0)
                .build();

        GameSession savedSession = gameSessionRepository.save(session);
        log.info("Game session created: {}", savedSession.getId());

        return GameSessionResponse.builder()
                .gameSessionId(savedSession.getId())
                .childId(child.getId())
                .startedAt(savedSession.getStartedAt())
                .questionsAnswered(0)
                .correctAnswers(0)
                .totalQuestions(numQuestions)
                .build();
    }

    /**
     * Submit an answer and get validation
     */
    @Transactional
    public AnswerResponse submitAnswer(AnswerRequest request) {
        log.info("Submitting answer for session: {}", request.getGameSessionId());

        // Get session
        GameSession session = gameSessionRepository.findById(request.getGameSessionId())
                .orElseThrow(() -> new RuntimeException("Game session not found: " + request.getGameSessionId()));

        // Get animal
        Animal animal = animalRepository.findById(request.getAnimalId())
                .orElseThrow(() -> new RuntimeException("Animal not found: " + request.getAnimalId()));

        Topic topic = parseTopic(request.getTopic());
        int attempt = AnswerOutcome.clampAttempt(request.getAttempt());
        // The child did not answer (e.g. silence) and the host said it together: nothing to validate
        boolean saidTogether = AnswerOutcome.TOGETHER.name().equalsIgnoreCase(request.getOutcome());

        Boolean isCorrect = false;
        String explanation = null;
        Integer score = 0;
        if (!saidTogether) {
            // Language the child answered in; falls back to the child's profile language
            String languageCode = request.getLanguage() != null && !request.getLanguage().isBlank()
                    ? request.getLanguage()
                    : session.getChild().getLanguage();
            Map<String, Object> validation = llmService.validateAnswer(
                    request.getAnswer(),
                    animal,
                    topic,
                    GameLanguage.fromCode(languageCode)
            );
            isCorrect = (Boolean) validation.get("isCorrect");
            explanation = (String) validation.get("explanation");
            score = (Integer) validation.get("score");
        }
        AnswerOutcome outcome = AnswerOutcome.of(isCorrect, attempt, saidTogether);

        log.info("Answer validation: isCorrect={}, score={}, attempt={}, outcome={}", isCorrect, score, attempt, outcome);

        // Save answer
        // questionText/difficulty are echoed back by the client from the QuestionResponse
        // it received from GET /questions/next - fall back to safe defaults if missing
        String questionText = (request.getQuestionText() != null && !request.getQuestionText().isBlank())
                ? request.getQuestionText()
                : "Unknown question (id: " + request.getQuestionId() + ")";

        String difficulty = (request.getDifficulty() != null && !request.getDifficulty().isBlank())
                ? request.getDifficulty()
                : "MEDIUM";

        // Checked before saving this answer: one correct answer per question counts
        boolean alreadyAnsweredCorrectly = isCorrect
                && answerRepository.existsCorrectAnswer(session.getId(), questionText);

        Answer answer = Answer.builder()
                .gameSession(session)
                .animal(animal)
                .questionText(questionText)
                .answerText(request.getAnswer() != null ? request.getAnswer() : "")
                .isCorrect(isCorrect)
                .difficulty(difficulty)
                .responseTimeMs(request.getResponseTimeMs())
                .topic(topic)
                .attempt((short) attempt)
                .outcome(outcome)
                .build();

        answerRepository.save(answer);

        // Update session. totalQuestions is the number of questions planned at start
        // (not the number of attempts), so retries do not inflate "5 of 11"
        if (isCorrect && !alreadyAnsweredCorrectly) {
            session.setCorrectAnswers(session.getCorrectAnswers() + 1);
        }
        gameSessionRepository.save(session);

        // Return response
        return AnswerResponse.builder()
                .isCorrect(isCorrect)
                .correctAnswer(animal.getName()) // Simplified for Phase 1
                .explanation(explanation)
                .score(score)
                .nextQuestionAvailableAt(LocalDateTime.now().plusSeconds(2))
                .build();
    }

    /**
     * End a game session
     */
    @Transactional
    public GameSessionResponse endGame(Long sessionId) {
        log.info("Ending game session: {}", sessionId);

        // Get session
        GameSession session = gameSessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Game session not found: " + sessionId));

        // Calculate final score
        session.setCompletedAt(LocalDateTime.now());
        session.setScore(session.calculateScore());
        gameSessionRepository.save(session);

        // Update child's progress
        updateProgress(session.getChild().getId());
        // The game is over: the animal goes into the child's album
        addStickers(session);

        log.info("Game session completed: {}", sessionId);

        return GameSessionResponse.builder()
                .gameSessionId(session.getId())
                .childId(session.getChild().getId())
                .startedAt(session.getStartedAt())
                .completedAt(session.getCompletedAt())
                .totalQuestions(session.getTotalQuestions())
                .correctAnswers(session.getCorrectAnswers())
                .finalScore(session.getScore())
                .build();
    }

    /**
     * Update child's progress after game ends
     */
    @Transactional
    private void updateProgress(Long childId) {
        log.debug("Updating progress for child: {}", childId);

        // Get or create progress record
        Progress progress = progressRepository.findByChildId(childId)
                .orElseGet(() -> Progress.builder()
                        .child(childRepository.findById(childId).orElseThrow())
                        .totalGames(0)
                        .totalCorrect(0)
                        .totalQuestions(0)
                        .build());

        // Totals over all completed games; the list is ordered newest first
        var sessions = gameSessionRepository.findCompletedGamesByChildId(childId);

        int totalCorrect = sessions.stream()
                .mapToInt(GameSession::getCorrectAnswers)
                .sum();
        int totalQuestions = sessions.stream()
                .mapToInt(GameSession::getTotalQuestions)
                .sum();

        progress.setTotalGames(sessions.size());
        progress.setTotalCorrect(totalCorrect);
        progress.setTotalQuestions(totalQuestions);
        progress.recalculateSuccessRate();
        progress.determineDifficulty(sessions);
        progress.setLastGameAt(LocalDateTime.now());

        progressRepository.save(progress);
        log.debug("Progress updated: {}", progress);
    }

    /** Adds a sticker for each animal of the finished game; animals collected earlier are kept as they are. */
    private void addStickers(GameSession session) {
        Long childId = session.getChild().getId();
        for (Long animalId : answerRepository.findAnimalIdsInSession(session.getId())) {
            childStickerRepository.addIfAbsent(childId, animalId);
        }
    }

    /**
     * Checks an answer without saving it and without touching the score.
     * Used for the toddler's repeated word: the question has already been scored by the card tap,
     * and after "let's say it together" a correct repeat must not turn it into a correct answer.
     */
    public AnswerCheckResponse checkAnswer(AnswerCheckRequest request) {
        Animal animal = animalRepository.findById(request.getAnimalId())
                .orElseThrow(() -> new RuntimeException("Animal not found: " + request.getAnimalId()));

        Map<String, Object> validation = llmService.validateAnswer(
                request.getAnswer(),
                animal,
                parseTopic(request.getTopic()),
                GameLanguage.fromCode(request.getLanguage())
        );
        boolean isCorrect = Boolean.TRUE.equals(validation.get("isCorrect"));
        log.info("Answer check (not saved): '{}' -> {}", request.getAnswer(), isCorrect);
        return AnswerCheckResponse.builder().isCorrect(isCorrect).build();
    }

    /** Topic echoed back by the client; null when missing or unknown (older clients). */
    private static Topic parseTopic(String topic) {
        if (topic == null || topic.isBlank()) {
            return null;
        }
        try {
            return Topic.valueOf(topic.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            return null;
        }
    }
}
