package com.smartelephant.model.entity;

import lombok.*;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "progress")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Progress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "child_id", nullable = false, unique = true)
    private Child child;

    @Column(name = "total_games")
    @Builder.Default
    private Integer totalGames = 0;

    @Column(name = "total_correct")
    @Builder.Default
    private Integer totalCorrect = 0;

    /** Sum of planned questions over all completed games - the denominator of successRate. */
    @Column(name = "total_questions")
    @Builder.Default
    private Integer totalQuestions = 0;

    @Column(name = "success_rate")
    private BigDecimal successRate; // Percentage

    @Column(name = "current_level", length = 20)
    @Builder.Default
    private String currentLevel = "EASY"; // 'EASY', 'MEDIUM', 'HARD'

    @Column(name = "last_game_at")
    private LocalDateTime lastGameAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    /** The level adapts to how the child plays now, not over all time. */
    public static final int RECENT_GAMES_FOR_LEVEL = 5;

    private static final BigDecimal HUNDRED = BigDecimal.valueOf(100);
    private static final BigDecimal EASY_BELOW = BigDecimal.valueOf(50);
    private static final BigDecimal HARD_ABOVE = BigDecimal.valueOf(80);

    /**
     * Share of correctly answered questions over all completed games, 0-100.
     * Divides by questions, not by games: 43 correct of 11 games x 4 questions is 98%, not 391%.
     */
    public void recalculateSuccessRate() {
        this.successRate = percent(totalCorrect, totalQuestions);
    }

    /**
     * EASY below 50%, MEDIUM 50-80%, HARD above 80% - counted over the given recent games only.
     *
     * @param recentGames the last completed games, newest first; at most {@link #RECENT_GAMES_FOR_LEVEL} are used
     */
    public void determineDifficulty(List<GameSession> recentGames) {
        List<GameSession> window = recentGames.stream().limit(RECENT_GAMES_FOR_LEVEL).toList();
        int questions = window.stream().mapToInt(game -> valueOrZero(game.getTotalQuestions())).sum();
        int correct = window.stream().mapToInt(game -> valueOrZero(game.getCorrectAnswers())).sum();

        if (questions == 0) {
            this.currentLevel = "EASY";
            return;
        }

        BigDecimal recentRate = percent(correct, questions);
        if (recentRate.compareTo(EASY_BELOW) < 0) {
            this.currentLevel = "EASY";
        } else if (recentRate.compareTo(HARD_ABOVE) <= 0) {
            this.currentLevel = "MEDIUM";
        } else {
            this.currentLevel = "HARD";
        }
    }

    private static BigDecimal percent(Integer part, Integer whole) {
        if (whole == null || whole == 0 || part == null) {
            return BigDecimal.ZERO;
        }
        BigDecimal rate = BigDecimal.valueOf(part)
                .multiply(HUNDRED)
                .divide(BigDecimal.valueOf(whole), 2, RoundingMode.HALF_UP);
        return rate.min(HUNDRED);
    }

    private static int valueOrZero(Integer value) {
        return value == null ? 0 : value;
    }
}
