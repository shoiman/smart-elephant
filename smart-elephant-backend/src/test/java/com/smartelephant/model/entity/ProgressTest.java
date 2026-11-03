package com.smartelephant.model.entity;

import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.IntStream;

import static org.assertj.core.api.Assertions.assertThat;

class ProgressTest {

    @Test
    void successRateIsCountedPerQuestionNotPerGame() {
        Progress progress = Progress.builder().totalGames(11).totalQuestions(44).totalCorrect(43).build();

        progress.recalculateSuccessRate();

        assertThat(progress.getSuccessRate()).isEqualByComparingTo("97.73");
    }

    @Test
    void successRateNeverExceedsHundred() {
        Progress progress = Progress.builder().totalQuestions(10).totalCorrect(12).build();

        progress.recalculateSuccessRate();

        assertThat(progress.getSuccessRate()).isEqualByComparingTo("100");
    }

    @Test
    void successRateIsZeroWithoutQuestions() {
        Progress progress = Progress.builder().build();

        progress.recalculateSuccessRate();

        assertThat(progress.getSuccessRate()).isEqualByComparingTo(BigDecimal.ZERO);
    }

    @Test
    void levelIsCountedFromTheLastFiveGamesOnly() {
        // newest first: 5 weak recent games (1 of 4), then 6 perfect old ones
        List<GameSession> games = new ArrayList<>();
        IntStream.range(0, 5).forEach(i -> games.add(game(4, 1)));
        IntStream.range(0, 6).forEach(i -> games.add(game(4, 4)));
        Progress progress = Progress.builder().build();

        progress.determineDifficulty(games);

        assertThat(progress.getCurrentLevel()).isEqualTo("EASY");
    }

    @Test
    void levelThresholds() {
        assertThat(levelFor(game(10, 4))).isEqualTo("EASY");    // 40%
        assertThat(levelFor(game(10, 5))).isEqualTo("MEDIUM");  // 50%
        assertThat(levelFor(game(10, 8))).isEqualTo("MEDIUM");  // 80%
        assertThat(levelFor(game(10, 9))).isEqualTo("HARD");    // 90%
    }

    @Test
    void levelIsEasyWithoutGames() {
        Progress progress = Progress.builder().currentLevel("HARD").build();

        progress.determineDifficulty(List.of());

        assertThat(progress.getCurrentLevel()).isEqualTo("EASY");
    }

    private static String levelFor(GameSession game) {
        Progress progress = Progress.builder().build();
        progress.determineDifficulty(List.of(game));
        return progress.getCurrentLevel();
    }

    private static GameSession game(int questions, int correct) {
        return GameSession.builder().totalQuestions(questions).correctAnswers(correct).build();
    }
}
