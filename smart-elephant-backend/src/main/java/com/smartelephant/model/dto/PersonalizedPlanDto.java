package com.smartelephant.model.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PersonalizedPlanDto {
    private String focusAnimal;
    private Integer suggestedQuestions;
    private String nextSession;
}
