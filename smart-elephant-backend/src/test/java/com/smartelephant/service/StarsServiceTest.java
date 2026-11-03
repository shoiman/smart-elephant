package com.smartelephant.service;

import com.smartelephant.i18n.AnimalCatalog;
import com.smartelephant.model.dto.StarsResponse;
import com.smartelephant.model.dto.StarsResponse.NextAnimal;
import com.smartelephant.model.dto.StarsResponse.Sticker;
import com.smartelephant.model.entity.Animal;
import com.smartelephant.model.entity.ChildSticker;
import com.smartelephant.model.entity.ChildStickerId;
import com.smartelephant.repository.AnimalRepository;
import com.smartelephant.repository.ChildRepository;
import com.smartelephant.repository.ChildStickerRepository;
import com.smartelephant.repository.GameSessionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.Clock;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class StarsServiceTest {

    private static final AnimalCatalog CATALOG = new AnimalCatalog();
    private static final long CHILD = 1L;

    /** Server in UTC; 2026-11-03 10:00 UTC is 12:00 in Jerusalem, so "today" there starts at 2026-11-02 22:00 UTC */
    private final Clock clock = Clock.fixed(Instant.parse("2026-11-03T10:00:00Z"), ZoneOffset.UTC);
    private static final LocalDateTime JERUSALEM_MIDNIGHT_IN_UTC = LocalDateTime.of(2026, 11, 2, 22, 0);

    private final ChildRepository childRepository = mock(ChildRepository.class);
    private final ChildStickerRepository stickerRepository = mock(ChildStickerRepository.class);
    private final GameSessionRepository sessionRepository = mock(GameSessionRepository.class);
    private final AnimalRepository animalRepository = mock(AnimalRepository.class);
    private final StarsService service = new StarsService(
            childRepository, stickerRepository, sessionRepository, animalRepository, CATALOG, clock);

    private final Animal elephant = animal(1L, "Elephant");
    private final Animal lion = animal(2L, "Lion");
    private final Animal oldSeedOnly = animal(3L, "Unicorn");

    @BeforeEach
    void setUp() {
        when(childRepository.existsById(CHILD)).thenReturn(true);
        when(animalRepository.findAll()).thenReturn(List.of(elephant, lion, oldSeedOnly));
    }

    @Test
    void todayStartsAtMidnightInTheClientsZone() {
        assertThat(service.startOfToday("Asia/Jerusalem")).isEqualTo(JERUSALEM_MIDNIGHT_IN_UTC);
    }

    @Test
    void unknownZoneFallsBackToTheServersZone() {
        assertThat(service.startOfToday("Mars/Olympus")).isEqualTo(LocalDateTime.of(2026, 11, 3, 0, 0));
        assertThat(service.startOfToday(null)).isEqualTo(LocalDateTime.of(2026, 11, 3, 0, 0));
    }

    @Test
    void countsTodaysStarsFromGamesFinishedSinceMidnight() {
        when(sessionRepository.countByChildIdAndCompletedAtGreaterThanEqual(eq(CHILD), eq(JERUSALEM_MIDNIGHT_IN_UTC)))
                .thenReturn(5L);
        when(stickerRepository.findByIdChildIdOrderByEarnedAtDesc(CHILD)).thenReturn(List.of());

        assertThat(service.getStars(CHILD, "Asia/Jerusalem").todayStars()).isEqualTo(5);
    }

    @Test
    void marksStickersEarnedTodayAsNewAndSkipsAnimalsMissingFromTheCatalog() {
        when(stickerRepository.findByIdChildIdOrderByEarnedAtDesc(CHILD)).thenReturn(List.of(
                sticker(lion, JERUSALEM_MIDNIGHT_IN_UTC.plusMinutes(30)),
                sticker(oldSeedOnly, JERUSALEM_MIDNIGHT_IN_UTC.minusDays(2)),
                sticker(elephant, JERUSALEM_MIDNIGHT_IN_UTC.minusMinutes(1))));

        List<Sticker> stickers = service.getStars(CHILD, "Asia/Jerusalem").stickers();

        assertThat(stickers).extracting(Sticker::animalName).containsExactly("Lion", "Elephant");
        assertThat(stickers).extracting(Sticker::isNew).containsExactly(true, false);
    }

    @Test
    void nextAnimalsAreTheFirstThreeNotCollectedInCatalogOrder() {
        when(stickerRepository.findByIdChildIdOrderByEarnedAtDesc(CHILD)).thenReturn(List.of(
                sticker(elephant, JERUSALEM_MIDNIGHT_IN_UTC)));

        StarsResponse stars = service.getStars(CHILD, "Asia/Jerusalem");

        List<String> expected = CATALOG.all().stream()
                .map(AnimalCatalog.AnimalContent::nameEn)
                .filter(name -> !name.equals("Elephant"))
                .limit(3)
                .toList();
        assertThat(stars.next()).extracting(NextAnimal::animalName).containsExactlyElementsOf(expected);
        assertThat(stars.next().get(0).animalId()).isEqualTo(expected.get(0).equals("Lion") ? 2L : null);
    }

    private static Animal animal(Long id, String name) {
        return Animal.builder().id(id).name(name).habitat("savanna").build();
    }

    private static ChildSticker sticker(Animal animal, LocalDateTime earnedAt) {
        return new ChildSticker(new ChildStickerId(CHILD, animal.getId()), earnedAt);
    }
}
