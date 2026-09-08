package com.smartelephant.model.dto;

import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AnswerResponse {
    private Boolean isCorrect;
    private String correctAnswer;
    private String explanation;
    private Integer score;
    private LocalDateTime nextQuestionAvailableAt;
}
