package com.smartelephant.repository;

import com.smartelephant.model.entity.ChildSticker;
import com.smartelephant.model.entity.ChildStickerId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ChildStickerRepository extends JpaRepository<ChildSticker, ChildStickerId> {

    /** Adds the sticker; an animal collected earlier keeps its first date. */
    @Modifying
    @Query(value = "INSERT INTO child_stickers (child_id, animal_id) VALUES (:childId, :animalId) " +
            "ON CONFLICT DO NOTHING", nativeQuery = true)
    void addIfAbsent(@Param("childId") Long childId, @Param("animalId") Long animalId);
}
