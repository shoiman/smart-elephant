package com.smartelephant.model.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.*;

import java.io.Serializable;

/** Primary key of a sticker: one sticker per animal per child. */
@Embeddable
@Getter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class ChildStickerId implements Serializable {

    @Column(name = "child_id")
    private Long childId;

    @Column(name = "animal_id")
    private Long animalId;
}
