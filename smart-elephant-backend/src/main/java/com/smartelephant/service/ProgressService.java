package com.smartelephant.service;

import com.smartelephant.model.dto.*;
import com.smartelephant.model.entity.GameSession;
import com.smartelephant.model.entity.Progress;
import com.smartelephant.repository.GameSessionRepository;
import com.smartelephant.repository.ProgressRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service for child progress tracking and (mock) LLM-based analysis.
 * Phase 2 (Claude API) is paused, so analyzeProgress() returns a
 * heuristic-based mock response until the real integration lands.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ProgressService {

    private final ProgressRepository progressRepository;
    private final GameSessionRepository gameSessionRepository;

    /**
     * Get a child's progress summary, including recent game history.
     */
    public ProgressResponseDto getProgress(Long childId) {
        Progress progress = progressRepository.findByChildId(childId)
                .orElse(Progress.builder()
                        .totalGames(0)
                        .totalCorrect(0)
                        .successRate(java.math.BigDecimal.ZERO)
                        .currentLevel("EASY")
                        .build());

        List<GameSession> recentSessions = gameSessionRepository.findLast20ByChildId(childId);

        List<RecentGameDto> recentGames = recentSessions.stream()
                .limit(5)
                .map(gs -> RecentGameDto.builder()
                        .gameSessionId(gs.getId())
                        .completedAt(gs.getCompletedAt())
                        .totalQuestions(gs.getTotalQuestions())
                        .correctAnswers(gs.getCorrectAnswers())
                        .finalScore(gs.getScore() != null ? gs.getScore().doubleValue() : 0.0)
                        .build())
                .collect(Collectors.toList());

        return ProgressResponseDto.builder()
                .childId(childId)
                .totalGames(progress.getTotalGames())
                .totalCorrect(progress.getTotalCorrect())
                .successRate(progress.getSuccessRate() != null ? progress.getSuccessRate().doubleValue() : 0.0)
                .currentLevel(progress.getCurrentLevel())
                .lastGameAt(progress.getLastGameAt())
                .recentGames(recentGames)
                .build();
    }

    /**
     * Analyze a child's progress. Mock heuristic version for Phase 1/pre-Phase-2
     * (no Claude API key configured yet) — replace with real LLM call once
     * Phase 2 resumes.
     */
    public ProgressAnalysisResponseDto analyzeProgress(Long childId) {
        Progress progress = progressRepository.findByChildId(childId)
                .orElse(Progress.builder()
                        .totalGames(0)
                        .totalCorrect(0)
                        .successRate(java.math.BigDecimal.ZERO)
                        .currentLevel("EASY")
                        .build());

        double successRate = progress.getSuccessRate() != null ? progress.getSuccessRate().doubleValue() : 0.0;
        String currentLevel = progress.getCurrentLevel() != null ? progress.getCurrentLevel() : "EASY";

        List<String> strengths;
        List<String> improvements;
        List<String> recommendations;
        String nextDifficulty;
        String projectedLevel;

        if (successRate >= 80) {
            strengths = List.of("Быстро отвечает на вопросы", "Уверенно определяет животных", "Хорошо справляется с текущим уровнем сложности");
            improvements = List.of("Можно переходить к более сложным вопросам");
            recommendations = List.of("Попробовать вопросы уровня HARD", "Добавить новых животных для изучения");
            nextDifficulty = "HARD";
            projectedLevel = "Advanced";
        } else if (successRate >= 50) {
            strengths = List.of("Стабильный прогресс", "Хорошо запоминает изученных животных");
            improvements = List.of("Нужно больше практики со средними вопросами", "Иногда путает похожих животных");
            recommendations = List.of("Продолжать практику на уровне MEDIUM", "Повторить животных саванны");
            nextDifficulty = "MEDIUM";
            projectedLevel = "Intermediate";
        } else {
            strengths = List.of("Делает первые шаги в изучении животных");
            improvements = List.of("Нужно больше практики с простыми вопросами", "Стоит повторить основных животных");
            recommendations = List.of("Продолжать с простыми вопросами (EASY)", "Играть чаще для закрепления материала");
            nextDifficulty = "EASY";
            projectedLevel = "Beginner";
        }

        PersonalizedPlanDto plan = PersonalizedPlanDto.builder()
                .focusAnimal("Lion")
                .suggestedQuestions(5)
                .nextSession("Завтра")
                .build();

        return ProgressAnalysisResponseDto.builder()
                .childId(childId)
                .analysisDate(LocalDateTime.now())
                .strengths(strengths)
                .areasForImprovement(improvements)
                .recommendations(recommendations)
                .nextDifficulty(nextDifficulty)
                .projectedLevel(projectedLevel)
                .personalizedPlan(plan)
                .build();
    }
}
