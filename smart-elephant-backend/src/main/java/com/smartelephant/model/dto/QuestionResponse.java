package com.smartelephant.model.dto;

import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuestionResponse {
    private String questionId;
    private Long animalId;
    private String animalName;
    private String questionText;
    private String difficulty;
    private List<String> hints;
    private LocalDateTime createdAt;
}
