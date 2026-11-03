package com.smartelephant.model.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/** An animal the child has collected in the album ("My stars" screen). */
@Entity
@Table(name = "child_stickers")
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ChildSticker {

    @EmbeddedId
    private ChildStickerId id;

    @Column(name = "earned_at", nullable = false, insertable = false, updatable = false)
    private LocalDateTime earnedAt;
}
