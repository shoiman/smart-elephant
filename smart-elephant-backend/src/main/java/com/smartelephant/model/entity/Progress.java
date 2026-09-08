package com.smartelephant.model.entity;

import lombok.*;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

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

    /**
     * Calculate success rate as percentage
     */
    public void recalculateSuccessRate() {
        if (totalGames == null || totalGames == 0) {
            this.successRate = BigDecimal.ZERO;
        } else {
            this.successRate = BigDecimal.valueOf(totalCorrect)
                    .divide(BigDecimal.valueOf(totalGames), 2, java.math.RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100));
        }
    }

    /**
     * Determine difficulty level based on success rate
     */
    public void determineDifficulty() {
        if (successRate == null) {
            this.currentLevel = "EASY";
            return;
        }

        if (successRate.compareTo(BigDecimal.valueOf(50)) < 0) {
            this.currentLevel = "EASY"; // < 50% - struggling, go easy
        } else if (successRate.compareTo(BigDecimal.valueOf(80)) <= 0) {
            this.currentLevel = "MEDIUM"; // 50-80% - optimal zone
        } else {
            this.currentLevel = "HARD"; // > 80% - challenge them
        }
    }
}
