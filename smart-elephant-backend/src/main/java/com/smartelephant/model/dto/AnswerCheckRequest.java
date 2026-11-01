package com.smartelephant.model.dto;

import lombok.*;

/**
 * A spoken word to check without recording it (toddler's "now say the word" step).
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AnswerCheckRequest {
    private Long animalId;
    private String topic;    // HABITAT, COLOR, ... as in QuestionResponse
    private String language; // he/ru/uk
    private String answer;
}
