package com.smartelephant.i18n;

import java.util.Locale;

/**
 * Languages the game can speak to a child in.
 * Codes match the frontend language switcher ("he", "ru", "uk").
 */
public enum GameLanguage {
    HE("he"),
    RU("ru"),
    UK("uk"),
    EN("en");

    private final String code;

    GameLanguage(String code) {
        this.code = code;
    }

    public String getCode() {
        return code;
    }

    /**
     * Resolves a language code ("he", "RU", "uk-UA", ...) to a supported language.
     * Unknown or empty codes fall back to English.
     */
    public static GameLanguage fromCode(String code) {
        if (code == null || code.isBlank()) {
            return EN;
        }
        String normalized = code.trim().toLowerCase(Locale.ROOT);
        for (GameLanguage language : values()) {
            if (normalized.equals(language.code) || normalized.startsWith(language.code + "-")) {
                return language;
            }
        }
        // "iw" is the legacy ISO code for Hebrew that some browsers still send
        if (normalized.startsWith("iw")) {
            return HE;
        }
        return EN;
    }
}
