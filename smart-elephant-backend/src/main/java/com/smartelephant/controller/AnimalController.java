package com.smartelephant.controller;

import com.smartelephant.model.entity.Animal;
import com.smartelephant.repository.AnimalRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST API Controller for animal management
 */
@RestController
@RequestMapping("/animals")
@RequiredArgsConstructor
@Slf4j
public class AnimalController {

    private final AnimalRepository animalRepository;

    /**
     * Get all animals
     * GET /api/animals
     */
    @GetMapping
    public ResponseEntity<List<Animal>> getAllAnimals() {
        log.info("GET /animals - getting all animals");

        try {
            List<Animal> animals = animalRepository.findAll();
            return ResponseEntity.ok(animals);
        } catch (Exception e) {
            log.error("Error fetching animals", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get animal by ID
     * GET /api/animals/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<Animal> getAnimalById(@PathVariable Long id) {
        log.info("GET /animals/{}", id);

        try {
            Animal animal = animalRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Animal not found: " + id));
            return ResponseEntity.ok(animal);
        } catch (Exception e) {
            log.error("Error fetching animal", e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    /**
     * Create a new animal (for testing/setup)
     * POST /api/animals
     */
    @PostMapping
    public ResponseEntity<Animal> createAnimal(@RequestBody Animal animal) {
        log.info("POST /animals - creating new animal: {}", animal.getName());

        try {
            Animal saved = animalRepository.save(animal);
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
        } catch (Exception e) {
            log.error("Error creating animal", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }
}
