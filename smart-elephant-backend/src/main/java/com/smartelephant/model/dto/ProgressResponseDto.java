package com.smartelephant.model.dto;

import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProgressResponseDto {
    private Long childId;
    private Integer totalGames;
    private Integer totalCorrect;
    private Double successRate;
    private String currentLevel;
    private LocalDateTime lastGameAt;
    private List<RecentGameDto> recentGames;
}
