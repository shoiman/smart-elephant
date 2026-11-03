package com.smartelephant.service;

import com.smartelephant.exception.ResourceNotFoundException;
import com.smartelephant.model.dto.ProgressResponse;
import com.smartelephant.model.entity.Answer;
import com.smartelephant.model.entity.GameSession;
import com.smartelephant.model.enums.ProgressPeriod;
import com.smartelephant.repository.AnswerRepository;
import com.smartelephant.repository.ChildRepository;
import com.smartelephant.repository.GameSessionRepository;
import com.smartelephant.service.progress.ProgressStats;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/** The parent's progress screen: loads the games and answers, ProgressStats does the counting. */
@Service
@RequiredArgsConstructor
public class ProgressService {

    /** "All games" on the screen shows at most this many */
    static final int RECENT_GAMES = 20;

    private final ChildRepository childRepository;
    private final GameSessionRepository gameSessionRepository;
    private final AnswerRepository answerRepository;
    private final ClientTime clientTime;

    @Transactional(readOnly = true)
    public ProgressResponse getProgress(Long childId, String period, String timeZone) {
        if (!childRepository.existsById(childId)) {
            throw new ResourceNotFoundException("Child not found: " + childId);
        }
        ProgressPeriod progressPeriod = ProgressPeriod.from(period);
        ZoneId clientZone = clientTime.zone(timeZone);
        LocalDate today = clientTime.today(clientZone);

        LocalDate start = ProgressStats.periodStart(progressPeriod, today);
        List<GameSession> periodSessions = start == null
                ? gameSessionRepository.findCompletedGamesByChildId(childId)
                : gameSessionRepository.findCompletedSince(childId, clientTime.startOfDayOnServer(start, clientZone));
        List<GameSession> recentSessions = gameSessionRepository.findLast20ByChildId(childId).stream()
                .limit(RECENT_GAMES)
                .toList();

        // One query for the answers of both lists
        Set<Long> sessionIds = new HashSet<>();
        periodSessions.forEach(session -> sessionIds.add(session.getId()));
        recentSessions.forEach(session -> sessionIds.add(session.getId()));
        List<Answer> answers = sessionIds.isEmpty() ? List.of() : answerRepository.findByGameSessionIdIn(sessionIds);

        return ProgressStats.build(new ProgressStats.Input(
                progressPeriod, today, clientTime.serverZone(), clientZone,
                periodSessions, answersOf(periodSessions, answers),
                recentSessions, answersOf(recentSessions, answers)));
    }

    private static List<Answer> answersOf(List<GameSession> sessions, List<Answer> answers) {
        Set<Long> ids = new HashSet<>();
        sessions.forEach(session -> ids.add(session.getId()));
        return answers.stream().filter(answer -> ids.contains(answer.getGameSession().getId())).toList();
    }
}
