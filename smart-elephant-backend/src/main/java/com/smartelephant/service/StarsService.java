package com.smartelephant.service;

import com.smartelephant.exception.ResourceNotFoundException;
import com.smartelephant.i18n.AnimalCatalog;
import com.smartelephant.model.dto.StarsResponse;
import com.smartelephant.model.dto.StarsResponse.NextAnimal;
import com.smartelephant.model.dto.StarsResponse.Sticker;
import com.smartelephant.model.entity.Animal;
import com.smartelephant.model.entity.ChildSticker;
import com.smartelephant.repository.AnimalRepository;
import com.smartelephant.repository.ChildRepository;
import com.smartelephant.repository.ChildStickerRepository;
import com.smartelephant.repository.GameSessionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Clock;
import java.time.DateTimeException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

/** Builds the child's "My stars" screen. */
@Service
@RequiredArgsConstructor
@Slf4j
public class StarsService {

    /** Silhouettes of the next animals; the rest of the catalog stays hidden (no "wall of empty cells") */
    static final int NEXT_ANIMALS = 3;

    private final ChildRepository childRepository;
    private final ChildStickerRepository childStickerRepository;
    private final GameSessionRepository gameSessionRepository;
    private final AnimalRepository animalRepository;
    private final AnimalCatalog catalog;
    private final Clock clock;

    /**
     * @param timeZone the client's IANA zone ("Asia/Jerusalem"); "today" starts at midnight there.
     *                 Missing or unknown zones fall back to the server's zone.
     */
    @Transactional(readOnly = true)
    public StarsResponse getStars(Long childId, String timeZone) {
        if (!childRepository.existsById(childId)) {
            throw new ResourceNotFoundException("Child not found: " + childId);
        }
        LocalDateTime startOfToday = startOfToday(timeZone);

        int todayStars = (int) gameSessionRepository.countByChildIdAndCompletedAtGreaterThanEqual(childId, startOfToday);

        Map<Long, Animal> animalsById = animalRepository.findAll().stream()
                .collect(Collectors.toMap(Animal::getId, Function.identity()));

        List<Sticker> stickers = childStickerRepository.findByIdChildIdOrderByEarnedAtDesc(childId).stream()
                .map(sticker -> toSticker(sticker, animalsById, startOfToday))
                .flatMap(Optional::stream)
                .toList();

        return new StarsResponse(todayStars, stickers, nextAnimals(stickers, animalsById));
    }

    /** Midnight in the client's zone, as the server-zone time the database timestamps use. */
    LocalDateTime startOfToday(String timeZone) {
        ZoneId clientZone = parseZone(timeZone).orElse(clock.getZone());
        return LocalDate.now(clock.withZone(clientZone))
                .atStartOfDay(clientZone)
                .withZoneSameInstant(clock.getZone())
                .toLocalDateTime();
    }

    /** Stickers of animals no longer in the content files (old seed data) are skipped: there is no picture for them. */
    private Optional<Sticker> toSticker(ChildSticker sticker, Map<Long, Animal> animalsById, LocalDateTime startOfToday) {
        Animal animal = animalsById.get(sticker.getId().getAnimalId());
        if (animal == null || catalog.find(animal.getName()).isEmpty()) {
            return Optional.empty();
        }
        boolean isNew = !sticker.getEarnedAt().isBefore(startOfToday);
        return Optional.of(new Sticker(animal.getId(), animal.getName(), sticker.getEarnedAt(), isNew));
    }

    /** The first animals of the catalog the child has not collected yet. */
    private List<NextAnimal> nextAnimals(List<Sticker> stickers, Map<Long, Animal> animalsById) {
        Set<String> collected = new HashSet<>();
        stickers.forEach(sticker -> collected.add(key(sticker.animalName())));
        Map<String, Animal> animalsByName = animalsById.values().stream()
                .collect(Collectors.toMap(animal -> key(animal.getName()), Function.identity(), (first, second) -> first));

        return catalog.all().stream()
                .filter(content -> !collected.contains(key(content.nameEn())))
                .limit(NEXT_ANIMALS)
                .map(content -> {
                    Animal animal = animalsByName.get(key(content.nameEn()));
                    return new NextAnimal(animal != null ? animal.getId() : null, content.nameEn());
                })
                .toList();
    }

    private static Optional<ZoneId> parseZone(String timeZone) {
        if (timeZone == null || timeZone.isBlank()) {
            return Optional.empty();
        }
        try {
            return Optional.of(ZoneId.of(timeZone.trim()));
        } catch (DateTimeException e) {
            log.warn("Unknown time zone '{}', using the server's zone", timeZone);
            return Optional.empty();
        }
    }

    private static String key(String name) {
        return name.trim().toLowerCase(Locale.ROOT);
    }
}
