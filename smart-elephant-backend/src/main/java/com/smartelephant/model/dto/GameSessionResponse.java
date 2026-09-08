package com.smartelephant.model.dto;

import lombok.*;
import java.time.LocalDateTime;
import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GameSessionResponse {
    private Long gameSessionId;
    private Long childId;
    private LocalDateTime startedAt;
    private LocalDateTime completedAt;
    private Integer questionsAnswered;
    private Integer correctAnswers;
    private BigDecimal currentScore;
    private Integer totalQuestions;
    private BigDecimal finalScore;
}
