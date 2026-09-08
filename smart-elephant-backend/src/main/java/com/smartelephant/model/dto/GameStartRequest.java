package com.smartelephant.model.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GameStartRequest {
    private Long childId;
    private Integer numQuestions;

    // Default to 5 questions if not specified
    public Integer getNumQuestions() {
        return numQuestions != null ? numQuestions : 5;
    }
}
