package com.smartelephant.model.enums;

/**
 * How a question ended for the child. Only the final answer to a question has an outcome;
 * a first wrong attempt is followed by a second one and stays without it.
 */
public enum AnswerOutcome {
    /** Correct on the first attempt, on their own */
    FIRST_TRY,
    /** Correct on the second attempt, after the host's hint */
    SECOND_TRY,
    /** Not answered: the host said the answer together with the child */
    TOGETHER;

    /** Two misses at most: "almost", then "let's say it together" (product brief). */
    public static final int MAX_ATTEMPTS = 2;

    /**
     * @param isCorrect    whether this answer was correct
     * @param attempt      1 or 2; values outside are clamped
     * @param saidTogether the client reports that the host said the answer together (e.g. after silence)
     * @return the outcome, or {@code null} when the question goes on (a wrong first attempt)
     */
    public static AnswerOutcome of(boolean isCorrect, int attempt, boolean saidTogether) {
        if (saidTogether) {
            return TOGETHER;
        }
        int clamped = clampAttempt(attempt);
        if (isCorrect) {
            return clamped == 1 ? FIRST_TRY : SECOND_TRY;
        }
        return clamped >= MAX_ATTEMPTS ? TOGETHER : null;
    }

    /** Attempt number sent by the client; missing or out of range values become 1..MAX_ATTEMPTS. */
    public static int clampAttempt(Integer attempt) {
        if (attempt == null || attempt < 1) {
            return 1;
        }
        return Math.min(attempt, MAX_ATTEMPTS);
    }
}
