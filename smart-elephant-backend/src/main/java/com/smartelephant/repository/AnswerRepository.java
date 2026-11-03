package com.smartelephant.repository;

import com.smartelephant.model.entity.Answer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AnswerRepository extends JpaRepository<Answer, Long> {

    /**
     * Get all answers in a game session
     */
    List<Answer> findByGameSessionId(Long gameSessionId);

    /**
     * Count correct answers in a session
     */
    @Query("SELECT COUNT(a) FROM Answer a WHERE a.gameSession.id = :sessionId AND a.isCorrect = true")
    long countCorrectAnswersInSession(@Param("sessionId") Long sessionId);

    /**
     * True if this question was already answered correctly in the session,
     * so a retry after "correct" ("again" button) is not counted twice
     */
    @Query("SELECT CASE WHEN COUNT(a) > 0 THEN true ELSE false END FROM Answer a " +
            "WHERE a.gameSession.id = :sessionId AND a.questionText = :questionText AND a.isCorrect = true")
    boolean existsCorrectAnswer(@Param("sessionId") Long sessionId, @Param("questionText") String questionText);

    /** Answers of several games at once (progress screen) */
    List<Answer> findByGameSessionIdIn(java.util.Collection<Long> gameSessionIds);

    /** Animals asked about in the session (a game is about one animal) */
    @Query("SELECT DISTINCT a.animal.id FROM Answer a WHERE a.gameSession.id = :sessionId")
    List<Long> findAnimalIdsInSession(@Param("sessionId") Long sessionId);

    /**
     * Get answers by animal and child for analysis
     */
    @Query("SELECT a FROM Answer a WHERE a.gameSession.child.id = :childId AND a.animal.id = :animalId " +
            "ORDER BY a.answeredAt DESC")
    List<Answer> findAnswersByChildAndAnimal(@Param("childId") Long childId, @Param("animalId") Long animalId);
}
