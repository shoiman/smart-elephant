package com.smartelephant.model.dto;

import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecentGameDto {
    private Long gameSessionId;
    private LocalDateTime completedAt;
    private Integer totalQuestions;
    private Integer correctAnswers;
    private Double finalScore;
}
