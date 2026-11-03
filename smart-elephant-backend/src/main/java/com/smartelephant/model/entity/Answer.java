package com.smartelephant.model.entity;

import com.smartelephant.i18n.QuestionTemplates.Topic;
import com.smartelephant.model.enums.AnswerOutcome;
import lombok.*;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "answers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Answer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "game_session_id", nullable = false)
    private GameSession gameSession;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "animal_id", nullable = false)
    private Animal animal;

    @Column(name = "question_text", nullable = false, columnDefinition = "TEXT")
    private String questionText;

    @Column(name = "answer_text", nullable = false, columnDefinition = "TEXT")
    private String answerText;

    @Column(name = "is_correct", nullable = false)
    private Boolean isCorrect;

    @Column(name = "difficulty", nullable = false, length = 20)
    private String difficulty; // 'EASY', 'MEDIUM', 'HARD'

    @Column(name = "response_time_ms")
    private Integer responseTimeMs; // Time to answer in milliseconds

    /** Topic of the question; null for answers saved before the topic was recorded */
    @Enumerated(EnumType.STRING)
    @Column(name = "topic", length = 20)
    private Topic topic;

    /** 1 or 2: which attempt at the question this answer was */
    @Column(name = "attempt", nullable = false)
    @Builder.Default
    private Short attempt = 1;

    /** How the question ended; null while it goes on (a wrong first attempt) */
    @Enumerated(EnumType.STRING)
    @Column(name = "outcome", length = 16)
    private AnswerOutcome outcome;

    @Column(name = "answered_at", nullable = false, updatable = false)
    private LocalDateTime answeredAt;

    @PrePersist
    protected void onCreate() {
        answeredAt = LocalDateTime.now();
    }
}
