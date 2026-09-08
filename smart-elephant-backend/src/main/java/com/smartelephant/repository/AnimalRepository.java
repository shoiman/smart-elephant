package com.smartelephant.repository;

import com.smartelephant.model.entity.Animal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface AnimalRepository extends JpaRepository<Animal, Long> {

    Optional<Animal> findByNameIgnoreCase(String name);

    List<Animal> findByHabitatIgnoreCase(String habitat);

    @Query(value = "SELECT * FROM animals ORDER BY RANDOM() LIMIT 1", nativeQuery = true)
    Optional<Animal> findRandomAnimal();

    @Query(value = "SELECT * FROM animals ORDER BY RANDOM() LIMIT :limit", nativeQuery = true)
    List<Animal> findRandomAnimals(int limit);
}
