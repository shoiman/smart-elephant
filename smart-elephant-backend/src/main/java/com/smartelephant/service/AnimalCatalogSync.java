package com.smartelephant.service;

import com.smartelephant.i18n.AnimalCatalog;
import com.smartelephant.i18n.AnimalCatalog.AnimalContent;
import com.smartelephant.model.entity.Animal;
import com.smartelephant.repository.AnimalRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

/**
 * Keeps the animals table in line with the content files (resources/content) on startup.
 *
 * The content files are the source of truth for which animals exist; the table holds them
 * because answers and sessions reference animals by id. Missing animals are inserted and the
 * habitat column is updated to the animal's category. Rows are never deleted: old answers
 * may still point to them.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class AnimalCatalogSync implements ApplicationRunner {

    private final AnimalCatalog catalog;
    private final AnimalRepository animalRepository;

    @Override
    public void run(ApplicationArguments args) {
        int created = 0;
        int updated = 0;
        for (AnimalContent content : catalog.all()) {
            Animal animal = animalRepository.findByNameIgnoreCase(content.nameEn()).orElse(null);
            if (animal == null) {
                animalRepository.save(Animal.builder()
                        .name(content.nameEn())
                        .habitat(content.category())
                        .build());
                created++;
            } else if (!content.category().equals(animal.getHabitat())) {
                animal.setHabitat(content.category());
                animalRepository.save(animal);
                updated++;
            }
        }
        log.info("Animal catalog: {} animals, {} added to the database, {} updated",
                catalog.all().size(), created, updated);
    }
}
