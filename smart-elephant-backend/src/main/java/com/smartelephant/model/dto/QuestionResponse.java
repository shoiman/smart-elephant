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
    /** Question topic: HABITAT, COLOR, SOUND, DIET, SIZE, UNIQUE */
    private String topic;
    /** Correct answer in the question's language; null if unknown for this animal */
    private String answer;
    /** mp3 with the question read aloud; null when TTS is disabled */
    private String audioUrl;
    /** mp3 with the answer read aloud; null when TTS is disabled or no answer */
    private String answerAudioUrl;
    private String difficulty;
    private List<String> hints;
    private LocalDateTime createdAt;
}
