package com.smartelephant.model.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AnswerRequest {
    private Long gameSessionId;
    private String questionId;
    private Long animalId;
    private String answer;
    private Integer responseTimeMs;
    private String questionText; // Echoed back from the QuestionResponse the client received
    private String difficulty;   // Echoed back from the QuestionResponse (EASY/MEDIUM/HARD)
    private String topic;        // Echoed back from the QuestionResponse (HABITAT, COLOR, ...)
    private String language;     // UI language the child answered in (he/ru/uk)
}
