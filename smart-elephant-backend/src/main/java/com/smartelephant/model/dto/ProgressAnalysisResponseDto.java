package com.smartelephant.model.dto;

import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProgressAnalysisResponseDto {
    private Long childId;
    private LocalDateTime analysisDate;
    private List<String> strengths;
    private List<String> areasForImprovement;
    private List<String> recommendations;
    private String nextDifficulty;
    private String projectedLevel;
    private PersonalizedPlanDto personalizedPlan;
}
