package com.smartelephant.service.progress;

import com.smartelephant.i18n.QuestionTemplates.Topic;
import com.smartelephant.model.dto.ProgressResponse;
import com.smartelephant.model.dto.ProgressResponse.Activity;
import com.smartelephant.model.dto.ProgressResponse.Repeat;
import com.smartelephant.model.dto.ProgressResponse.TopicStats;
import com.smartelephant.model.entity.Animal;
import com.smartelephant.model.entity.Answer;
import com.smartelephant.model.entity.GameSession;
import com.smartelephant.model.enums.AnswerOutcome;
import com.smartelephant.model.enums.ProgressPeriod;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.List;

import static com.smartelephant.model.enums.AnswerOutcome.FIRST_TRY;
import static com.smartelephant.model.enums.AnswerOutcome.SECOND_TRY;
import static com.smartelephant.model.enums.AnswerOutcome.TOGETHER;
import static org.assertj.core.api.Assertions.assertThat;

class ProgressStatsTest {

    private static final ZoneId SERVER = ZoneOffset.UTC;
    private static final ZoneId JERUSALEM = ZoneId.of("Asia/Jerusalem");
    private static final LocalDate TODAY = LocalDate.of(2026, 11, 3);

    private final Animal rabbit = animal(1L, "Rabbit");
    private final Animal lion = animal(2L, "Lion");
    private long nextAnswerId = 1;

    @Test
    void onlyTheLastAnswerWithAnOutcomeCountsForAQuestion() {
        GameSession game = game(1L, LocalDateTime.of(2026, 11, 3, 8, 0), 5);
        List<Answer> answers = List.of(
                answer(game, rabbit, "What does it eat?", Topic.DIET, null),        // wrong first attempt
                answer(game, rabbit, "What does it eat?", Topic.DIET, SECOND_TRY),
                answer(game, rabbit, "Who is it?", Topic.NAME, FIRST_TRY),
                answer(game, rabbit, "Old answer", null, null));                    // saved before outcomes

        ProgressResponse.Answers counts = ProgressStats.answers(ProgressStats.finalAnswers(answers));

        assertThat(counts).isEqualTo(new ProgressResponse.Answers(2, 1, 1, 0));
    }

    @Test
    void topicStatusUsesTheShareAnsweredOnTheFirstTryAndHidesSmallTopics() {
        List<Answer> finals = new ArrayList<>();
        GameSession game = game(1L, LocalDateTime.of(2026, 11, 3, 8, 0), 5);
        for (int i = 0; i < 4; i++) finals.add(answer(game, rabbit, "color " + i, Topic.COLOR, FIRST_TRY));    // 100%
        for (int i = 0; i < 2; i++) finals.add(answer(game, rabbit, "home " + i, Topic.HABITAT, FIRST_TRY));
        for (int i = 0; i < 3; i++) finals.add(answer(game, rabbit, "home x" + i, Topic.HABITAT, SECOND_TRY));  // 40%
        finals.add(answer(game, rabbit, "eat 1", Topic.DIET, TOGETHER));
        finals.add(answer(game, rabbit, "eat 2", Topic.DIET, TOGETHER));
        finals.add(answer(game, rabbit, "eat 3", Topic.DIET, FIRST_TRY));                                      // 33%
        finals.add(answer(game, rabbit, "size 1", Topic.SIZE, FIRST_TRY));                                     // 2 questions
        finals.add(answer(game, rabbit, "size 2", Topic.SIZE, FIRST_TRY));

        assertThat(ProgressStats.topics(finals)).containsExactly(
                new TopicStats("HABITAT", 5, 2, "LEARNING"),
                new TopicStats("COLOR", 4, 4, "CONFIDENT"),
                new TopicStats("DIET", 3, 1, "HARD_FOR_NOW"));
    }

    @Test
    void repeatListsTheHardestAnimalTopicPairsFirst() {
        GameSession game = game(1L, LocalDateTime.of(2026, 11, 3, 8, 0), 5);
        List<Answer> finals = List.of(
                answer(game, lion, "lion home", Topic.HABITAT, SECOND_TRY),
                answer(game, rabbit, "rabbit eat", Topic.DIET, TOGETHER),
                answer(game, rabbit, "rabbit eat 2", Topic.DIET, SECOND_TRY),
                answer(game, lion, "lion color", Topic.COLOR, FIRST_TRY));

        assertThat(ProgressStats.repeat(finals)).containsExactly(
                new Repeat(1L, "Rabbit", "DIET"),
                new Repeat(2L, "Lion", "HABITAT"));
    }

    @Test
    void weekActivityIsByDayInTheClientsZoneAndLongGamesAreCapped() {
        // 23:30 UTC on Nov 2 is already Nov 3 in Jerusalem; a 2-hour game counts 30 minutes
        GameSession lateEvening = game(1L, LocalDateTime.of(2026, 11, 2, 23, 30), 6);
        GameSession leftOpen = game(2L, LocalDateTime.of(2026, 10, 30, 9, 0), 120);

        ProgressResponse response = ProgressStats.build(input(ProgressPeriod.WEEK, List.of(lateEvening, leftOpen)));

        assertThat(response.activity()).extracting(Activity::label)
                .containsExactly("2026-10-28", "2026-10-29", "2026-10-30", "2026-10-31", "2026-11-01", "2026-11-02", "2026-11-03");
        assertThat(response.activity()).extracting(Activity::minutes).containsExactly(0, 0, 30, 0, 0, 0, 6);
        assertThat(response.minutes()).isEqualTo(36);
        assertThat(response.games()).isEqualTo(2);
    }

    @Test
    void monthActivityIsByWeekAndAllTimeByMonth() {
        GameSession game = game(1L, LocalDateTime.of(2026, 9, 15, 9, 0), 10);

        assertThat(ProgressStats.build(input(ProgressPeriod.MONTH, List.of())).activity())
                .extracting(Activity::label).containsExactly("2026-10-07", "2026-10-14", "2026-10-21", "2026-10-28");
        assertThat(ProgressStats.build(input(ProgressPeriod.ALL, List.of(game))).activity())
                .extracting(Activity::label).containsExactly("2026-09", "2026-10", "2026-11");
    }

    @Test
    void recentGamesListTheirAnimalsWithAStarEach() {
        GameSession game = game(7L, LocalDateTime.of(2026, 11, 3, 8, 0), 5);
        List<Answer> answers = List.of(
                answer(game, lion, "q1", Topic.NAME, FIRST_TRY),
                answer(game, lion, "q2", Topic.COLOR, FIRST_TRY));
        ProgressStats.Input in = new ProgressStats.Input(ProgressPeriod.WEEK, TODAY, SERVER, JERUSALEM,
                List.of(game), answers, List.of(game), answers);

        ProgressResponse response = ProgressStats.build(in);

        assertThat(response.recentGames()).singleElement().satisfies(recent -> {
            assertThat(recent.animals()).containsExactly("Lion");
            assertThat(recent.stars()).isEqualTo(1);
            assertThat(recent.minutes()).isEqualTo(5);
            assertThat(recent.completedAt()).isEqualTo(LocalDateTime.of(2026, 11, 3, 10, 0)); // Jerusalem time
        });
        assertThat(response.lastGameAt()).isEqualTo(LocalDateTime.of(2026, 11, 3, 10, 0));
        assertThat(response.animals()).isEqualTo(1);
    }

    @Test
    void emptyPeriodHasNoGamesAndNoLastGame() {
        ProgressResponse response = ProgressStats.build(input(ProgressPeriod.WEEK, List.of()));

        assertThat(response.games()).isZero();
        assertThat(response.lastGameAt()).isNull();
        assertThat(response.answers().total()).isZero();
        assertThat(response.topics()).isEmpty();
        assertThat(response.repeat()).isEmpty();
    }

    private ProgressStats.Input input(ProgressPeriod period, List<GameSession> sessions) {
        return new ProgressStats.Input(period, TODAY, SERVER, JERUSALEM, sessions, List.of(), List.of(), List.of());
    }

    private static GameSession game(Long id, LocalDateTime completedAt, int minutes) {
        return GameSession.builder().id(id).completedAt(completedAt).startedAt(completedAt.minusMinutes(minutes)).build();
    }

    private Answer answer(GameSession game, Animal animal, String question, Topic topic, AnswerOutcome outcome) {
        return Answer.builder().id(nextAnswerId++).gameSession(game).animal(animal)
                .questionText(question).topic(topic).outcome(outcome).build();
    }

    private static Animal animal(Long id, String name) {
        return Animal.builder().id(id).name(name).habitat("savanna").build();
    }
}
