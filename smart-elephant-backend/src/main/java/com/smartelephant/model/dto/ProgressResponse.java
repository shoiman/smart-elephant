package com.smartelephant.model.dto;

import java.time.LocalDateTime;
import java.util.List;

/**
 * GET /progress/{childId}?period=week|month|all&tz=... - the parent's progress screen.
 * All times are in the client's zone. Texts are not here: the frontend translates the codes.
 *
 * @param period      week | month | all
 * @param lastGameAt  the last finished game, whatever the period; null when there are none
 * @param games       games finished in the period
 * @param minutes     time spent in those games (a single game counts 30 minutes at most)
 * @param animals     different animals asked about in the period
 * @param activity    minutes per day (week), per week (month) or per month (all)
 * @param answers     how each question of the period ended
 * @param topics      per question topic, topics with fewer than 3 questions left out
 * @param repeat      up to 3 (animal, topic) pairs that were hardest in the period
 * @param recentGames the last 20 finished games, whatever the period, newest first
 */
public record ProgressResponse(
        String period,
        LocalDateTime lastGameAt,
        int games,
        int minutes,
        int animals,
        List<Activity> activity,
        Answers answers,
        List<TopicStats> topics,
        List<Repeat> repeat,
        List<RecentGame> recentGames) {

    /** @param label ISO date of the day or of the week's first day (2026-10-26), or a month (2026-10) */
    public record Activity(String label, int minutes) {
    }

    public record Answers(int total, int firstTry, int secondTry, int together) {
    }

    /** @param status CONFIDENT (75%+ on the first try), LEARNING (40-74%), HARD_FOR_NOW (below 40%) */
    public record TopicStats(String topic, int total, int firstTry, String status) {
    }

    public record Repeat(Long animalId, String animalName, String topic) {
    }

    /** @param animals English animal names, as in questions; @param stars one per animal of the finished game */
    public record RecentGame(Long gameSessionId, LocalDateTime completedAt, int minutes, List<String> animals, int stars) {
    }
}
