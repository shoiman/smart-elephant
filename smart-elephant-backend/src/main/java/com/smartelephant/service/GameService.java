package com.smartelephant.service;

import com.smartelephant.model.dto.AnswerRequest;
import com.smartelephant.model.dto.AnswerResponse;
import com.smartelephant.model.dto.GameSessionResponse;
import com.smartelephant.model.entity.*;
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

        // Validate answer using LLM
        Map<String, Object> validation = llmService.validateAnswer(
                request.getAnswer(),
                request.getQuestionId(),
                animal
        );

        Boolean isCorrect = (Boolean) validation.get("isCorrect");
        String explanation = (String) validation.get("explanation");
        Integer score = (Integer) validation.get("score");

        log.info("Answer validation: isCorrect={}, score={}", isCorrect, score);

        // Save answer
        // questionText/difficulty are echoed back by the client from the QuestionResponse
        // it received from GET /questions/next - fall back to safe defaults if missing
        String questionText = (request.getQuestionText() != null && !request.getQuestionText().isBlank())
                ? request.getQuestionText()
                : "Unknown question (id: " + request.getQuestionId() + ")";

        String difficulty = (request.getDifficulty() != null && !request.getDifficulty().isBlank())
                ? request.getDifficulty()
                : "MEDIUM";

        Answer answer = Answer.builder()
                .gameSession(session)
                .animal(animal)
                .questionText(questionText)
                .answerText(request.getAnswer())
                .isCorrect(isCorrect)
                .difficulty(difficulty)
                .responseTimeMs(request.getResponseTimeMs())
                .build();

        answerRepository.save(answer);

        // Update session
        session.setTotalQuestions(session.getTotalQuestions() + 1);
        if (isCorrect) {
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
                        .build());

        // Calculate totals from all completed games
        var sessions = gameSessionRepository.findCompletedGamesByChildId(childId);

        long totalGames = sessions.size();
        long totalCorrect = sessions.stream()
                .mapToLong(GameSession::getCorrectAnswers)
                .sum();

        progress.setTotalGames((int) totalGames);
        progress.setTotalCorrect((int) totalCorrect);
        progress.recalculateSuccessRate();
        progress.determineDifficulty();
        progress.setLastGameAt(LocalDateTime.now());

        progressRepository.save(progress);
        log.debug("Progress updated: {}", progress);
    }
}
