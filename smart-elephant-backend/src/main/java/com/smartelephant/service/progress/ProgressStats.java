package com.smartelephant.service.progress;

import com.smartelephant.i18n.QuestionTemplates.Topic;
import com.smartelephant.model.dto.ProgressResponse;
import com.smartelephant.model.dto.ProgressResponse.Activity;
import com.smartelephant.model.dto.ProgressResponse.Answers;
import com.smartelephant.model.dto.ProgressResponse.RecentGame;
import com.smartelephant.model.dto.ProgressResponse.Repeat;
import com.smartelephant.model.dto.ProgressResponse.TopicStats;
import com.smartelephant.model.entity.Animal;
import com.smartelephant.model.entity.Answer;
import com.smartelephant.model.entity.GameSession;
import com.smartelephant.model.enums.AnswerOutcome;
import com.smartelephant.model.enums.ProgressPeriod;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.EnumMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

/**
 * The numbers of the parent's progress screen, computed from games and answers already loaded.
 * No database and no clock here, so every rule is easy to test.
 */
public final class ProgressStats {

    /** A game left open is not counted as hours of play */
    static final Duration MAX_GAME_DURATION = Duration.ofMinutes(30);
    /** A topic with fewer questions in the period says nothing yet */
    static final int MIN_TOPIC_QUESTIONS = 3;
    static final int CONFIDENT_PERCENT = 75;
    static final int LEARNING_PERCENT = 40;
    static final int MAX_REPEAT = 3;
    /** "All time" activity shows at most this many months */
    static final int MAX_MONTHS = 12;
    static final int WEEK_DAYS = 7;
    static final int MONTH_WEEKS = 4;

    /**
     * @param today          today in the client's zone
     * @param periodSessions finished games of the period
     * @param periodAnswers  answers of those games
     * @param recentSessions the last finished games, newest first (not limited by the period)
     * @param recentAnswers  answers of those games
     */
    public record Input(ProgressPeriod period, LocalDate today, ZoneId serverZone, ZoneId clientZone,
                        List<GameSession> periodSessions, List<Answer> periodAnswers,
                        List<GameSession> recentSessions, List<Answer> recentAnswers) {
    }

    private ProgressStats() {
    }

    /** First day of the period in the client's zone; null for "all time". */
    public static LocalDate periodStart(ProgressPeriod period, LocalDate today) {
        return switch (period) {
            case WEEK -> today.minusDays(WEEK_DAYS - 1);
            case MONTH -> today.minusDays((long) MONTH_WEEKS * WEEK_DAYS - 1);
            case ALL -> null;
        };
    }

    public static ProgressResponse build(Input in) {
        List<Answer> finals = finalAnswers(in.periodAnswers());
        int animals = (int) in.periodAnswers().stream().map(answer -> answer.getAnimal().getId()).distinct().count();
        List<RecentGame> recentGames = recentGames(in);

        return new ProgressResponse(
                in.period().name().toLowerCase(),
                recentGames.isEmpty() ? null : recentGames.get(0).completedAt(),
                in.periodSessions().size(),
                minutes(in.periodSessions().stream().map(ProgressStats::duration).reduce(Duration.ZERO, Duration::plus)),
                animals,
                activity(in),
                answers(finals),
                topics(finals),
                repeat(finals),
                recentGames);
    }

    /**
     * The last answer with an outcome for each question of each game. A wrong first attempt has no outcome
     * (the question went on), so it never counts on its own. Answers saved before outcomes existed are skipped.
     */
    static List<Answer> finalAnswers(List<Answer> answers) {
        Map<String, Answer> last = new LinkedHashMap<>();
        for (Answer answer : answers) {
            if (answer.getOutcome() == null) {
                continue;
            }
            String question = answer.getGameSession().getId() + "\u0000" + answer.getQuestionText();
            last.merge(question, answer, (a, b) -> b.getId() > a.getId() ? b : a);
        }
        return List.copyOf(last.values());
    }

    static Answers answers(List<Answer> finals) {
        Map<AnswerOutcome, Long> counts = finals.stream()
                .collect(Collectors.groupingBy(Answer::getOutcome, () -> new EnumMap<>(AnswerOutcome.class), Collectors.counting()));
        return new Answers(finals.size(),
                counts.getOrDefault(AnswerOutcome.FIRST_TRY, 0L).intValue(),
                counts.getOrDefault(AnswerOutcome.SECOND_TRY, 0L).intValue(),
                counts.getOrDefault(AnswerOutcome.TOGETHER, 0L).intValue());
    }

    static List<TopicStats> topics(List<Answer> finals) {
        Map<Topic, List<Answer>> byTopic = finals.stream()
                .filter(answer -> answer.getTopic() != null)
                .collect(Collectors.groupingBy(Answer::getTopic, () -> new EnumMap<>(Topic.class), Collectors.toList()));
        List<TopicStats> result = new ArrayList<>();
        byTopic.forEach((topic, list) -> {
            if (list.size() < MIN_TOPIC_QUESTIONS) {
                return;
            }
            int firstTry = (int) list.stream().filter(answer -> answer.getOutcome() == AnswerOutcome.FIRST_TRY).count();
            result.add(new TopicStats(topic.name(), list.size(), firstTry, status(firstTry, list.size())));
        });
        return result;
    }

    static String status(int firstTry, int total) {
        int percent = firstTry * 100 / total;
        if (percent >= CONFIDENT_PERCENT) {
            return "CONFIDENT";
        }
        return percent >= LEARNING_PERCENT ? "LEARNING" : "HARD_FOR_NOW";
    }

    /** (animal, topic) pairs said together (weight 2) or answered on the second try (weight 1), hardest first. */
    static List<Repeat> repeat(List<Answer> finals) {
        record Pair(Animal animal, Topic topic) {
        }
        Map<Long, Map<Topic, Integer>> weights = new LinkedHashMap<>();
        Map<Long, Animal> animals = new LinkedHashMap<>();
        for (Answer answer : finals) {
            int weight = switch (answer.getOutcome()) {
                case TOGETHER -> 2;
                case SECOND_TRY -> 1;
                case FIRST_TRY -> 0;
            };
            if (weight == 0 || answer.getTopic() == null) {
                continue;
            }
            animals.putIfAbsent(answer.getAnimal().getId(), answer.getAnimal());
            weights.computeIfAbsent(answer.getAnimal().getId(), id -> new EnumMap<>(Topic.class))
                    .merge(answer.getTopic(), weight, Integer::sum);
        }
        Map<Pair, Integer> pairs = new LinkedHashMap<>();
        weights.forEach((animalId, byTopic) ->
                byTopic.forEach((topic, weight) -> pairs.put(new Pair(animals.get(animalId), topic), weight)));
        return pairs.entrySet().stream()
                .sorted(Map.Entry.<Pair, Integer>comparingByValue().reversed())
                .limit(MAX_REPEAT)
                .map(entry -> new Repeat(entry.getKey().animal().getId(), entry.getKey().animal().getName(),
                        entry.getKey().topic().name()))
                .toList();
    }

    static List<Activity> activity(Input in) {
        Map<LocalDate, Duration> byDay = new LinkedHashMap<>();
        for (GameSession session : in.periodSessions()) {
            byDay.merge(clientDay(session.getCompletedAt(), in), duration(session), Duration::plus);
        }
        return switch (in.period()) {
            case WEEK -> buckets(in.today().minusDays(WEEK_DAYS - 1), 1, WEEK_DAYS, byDay);
            case MONTH -> buckets(periodStart(ProgressPeriod.MONTH, in.today()), WEEK_DAYS, MONTH_WEEKS, byDay);
            case ALL -> months(in.today(), byDay);
        };
    }

    /** count buckets of `days` days each, starting at `from`; label = the bucket's first day */
    private static List<Activity> buckets(LocalDate from, int days, int count, Map<LocalDate, Duration> byDay) {
        List<Activity> result = new ArrayList<>();
        for (int i = 0; i < count; i++) {
            LocalDate start = from.plusDays((long) i * days);
            LocalDate end = start.plusDays(days);
            Duration total = byDay.entrySet().stream()
                    .filter(day -> !day.getKey().isBefore(start) && day.getKey().isBefore(end))
                    .map(Map.Entry::getValue)
                    .reduce(Duration.ZERO, Duration::plus);
            result.add(new Activity(start.toString(), minutes(total)));
        }
        return result;
    }

    /** Calendar months from the first game to this month, the last 12 at most */
    private static List<Activity> months(LocalDate today, Map<LocalDate, Duration> byDay) {
        if (byDay.isEmpty()) {
            return List.of();
        }
        Map<YearMonth, Duration> byMonth = new LinkedHashMap<>();
        byDay.forEach((day, duration) -> byMonth.merge(YearMonth.from(day), duration, Duration::plus));
        YearMonth last = YearMonth.from(today);
        YearMonth first = byMonth.keySet().stream().min(Comparator.naturalOrder()).orElse(last);
        if (first.isBefore(last.minusMonths(MAX_MONTHS - 1))) {
            first = last.minusMonths(MAX_MONTHS - 1);
        }
        List<Activity> result = new ArrayList<>();
        for (YearMonth month = first; !month.isAfter(last); month = month.plusMonths(1)) {
            result.add(new Activity(month.toString(), minutes(byMonth.getOrDefault(month, Duration.ZERO))));
        }
        return result;
    }

    static List<RecentGame> recentGames(Input in) {
        Map<Long, List<Answer>> bySession = in.recentAnswers().stream()
                .sorted(Comparator.comparing(Answer::getId))
                .collect(Collectors.groupingBy(answer -> answer.getGameSession().getId(), LinkedHashMap::new, Collectors.toList()));
        return in.recentSessions().stream()
                .map(session -> {
                    List<String> animals = bySession.getOrDefault(session.getId(), List.of()).stream()
                            .map(answer -> answer.getAnimal().getName())
                            .filter(Objects::nonNull)
                            .distinct()
                            .toList();
                    return new RecentGame(session.getId(), toClient(session.getCompletedAt(), in),
                            Math.max(1, minutes(duration(session))), animals, animals.size());
                })
                .toList();
    }

    static Duration duration(GameSession session) {
        if (session.getStartedAt() == null || session.getCompletedAt() == null) {
            return Duration.ZERO;
        }
        Duration played = Duration.between(session.getStartedAt(), session.getCompletedAt());
        if (played.isNegative()) {
            return Duration.ZERO;
        }
        return played.compareTo(MAX_GAME_DURATION) > 0 ? MAX_GAME_DURATION : played;
    }

    /** Whole minutes, rounded to the nearest */
    static int minutes(Duration duration) {
        return (int) Math.round(duration.toSeconds() / 60.0);
    }

    private static LocalDate clientDay(LocalDateTime serverTime, Input in) {
        return toClient(serverTime, in).toLocalDate();
    }

    private static LocalDateTime toClient(LocalDateTime serverTime, Input in) {
        return serverTime.atZone(in.serverZone()).withZoneSameInstant(in.clientZone()).toLocalDateTime();
    }
}
