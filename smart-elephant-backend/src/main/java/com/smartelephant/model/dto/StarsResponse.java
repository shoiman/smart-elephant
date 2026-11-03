package com.smartelephant.model.dto;

import java.time.LocalDateTime;
import java.util.List;

/**
 * The child's "My stars" screen: today's stars, the album and the next animals to meet.
 *
 * @param todayStars one star per game finished today (a game is about one animal), even if the sticker was there already
 * @param stickers   collected animals, the newest first
 * @param next       up to 3 animals not collected yet, in catalog order
 */
public record StarsResponse(int todayStars, List<Sticker> stickers, List<NextAnimal> next) {

    /**
     * @param animalName English name, the same as animalName in questions (the frontend finds the picture by it)
     * @param isNew      earned today in the client's time zone
     */
    public record Sticker(Long animalId, String animalName, LocalDateTime earnedAt, boolean isNew) {
    }

    public record NextAnimal(Long animalId, String animalName) {
    }
}
