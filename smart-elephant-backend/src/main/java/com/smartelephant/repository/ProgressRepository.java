package com.smartelephant.repository;

import com.smartelephant.model.entity.Progress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProgressRepository extends JpaRepository<Progress, Long> {

    /**
     * Find progress by child ID
     */
    Optional<Progress> findByChildId(Long childId);

    /**
     * Check if progress exists for child
     */
    boolean existsByChildId(Long childId);
}
