package com.smartelephant.model.enums;

public enum QuestionDifficulty {
    EASY("EASY"),
    MEDIUM("MEDIUM"),
    HARD("HARD");

    private final String value;

    QuestionDifficulty(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }

    public static QuestionDifficulty fromValue(String value) {
        for (QuestionDifficulty difficulty : QuestionDifficulty.values()) {
            if (difficulty.value.equalsIgnoreCase(value)) {
                return difficulty;
            }
        }
        return EASY; // default
    }
}
