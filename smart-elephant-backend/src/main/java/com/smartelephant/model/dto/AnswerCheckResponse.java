package com.smartelephant.model.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AnswerCheckResponse {
    private Boolean isCorrect;
}
