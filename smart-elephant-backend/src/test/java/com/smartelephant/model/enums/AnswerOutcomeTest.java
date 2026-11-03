package com.smartelephant.model.enums;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class AnswerOutcomeTest {

    @Test
    void correctOnFirstAttemptIsFirstTry() {
        assertThat(AnswerOutcome.of(true, 1, false)).isEqualTo(AnswerOutcome.FIRST_TRY);
    }

    @Test
    void correctOnSecondAttemptIsSecondTry() {
        assertThat(AnswerOutcome.of(true, 2, false)).isEqualTo(AnswerOutcome.SECOND_TRY);
    }

    @Test
    void wrongFirstAttemptHasNoOutcomeYet() {
        assertThat(AnswerOutcome.of(false, 1, false)).isNull();
    }

    @Test
    void wrongSecondAttemptIsTogether() {
        assertThat(AnswerOutcome.of(false, 2, false)).isEqualTo(AnswerOutcome.TOGETHER);
    }

    @Test
    void reportedTogetherWinsOverEverything() {
        assertThat(AnswerOutcome.of(false, 1, true)).isEqualTo(AnswerOutcome.TOGETHER);
    }

    @Test
    void attemptIsClampedToOneOrTwo() {
        assertThat(AnswerOutcome.clampAttempt(null)).isEqualTo(1);
        assertThat(AnswerOutcome.clampAttempt(0)).isEqualTo(1);
        assertThat(AnswerOutcome.clampAttempt(5)).isEqualTo(2);
        assertThat(AnswerOutcome.of(true, 7, false)).isEqualTo(AnswerOutcome.SECOND_TRY);
    }
}
