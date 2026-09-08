package com.smartelephant.repository;

import com.smartelephant.model.entity.GameSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GameSessionRepository extends JpaRepository<GameSession, Long> {

    /**
     * Get last N completed games for a child
     */
    @Query("SELECT gs FROM GameSession gs WHERE gs.child.id = :childId AND gs.completedAt IS NOT NULL " +
            "ORDER BY gs.completedAt DESC")
    List<GameSession> findCompletedGamesByChildId(@Param("childId") Long childId);

    /**
     * Get last 20 games for adaptive difficulty
     */
    @Query(value = "SELECT * FROM game_sessions WHERE child_id = :childId AND completed_at IS NOT NULL " +
            "ORDER BY completed_at DESC LIMIT 20", nativeQuery = true)
    List<GameSession> findLast20ByChildId(@Param("childId") Long childId);

    /**
     * Get total games count for a child
     */
    @Query("SELECT COUNT(gs) FROM GameSession gs WHERE gs.child.id = :childId AND gs.completedAt IS NOT NULL")
    long countCompletedGames(@Param("childId") Long childId);
}
