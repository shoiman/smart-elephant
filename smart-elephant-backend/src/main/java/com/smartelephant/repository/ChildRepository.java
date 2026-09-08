package com.smartelephant.repository;

import com.smartelephant.model.entity.Child;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface ChildRepository extends JpaRepository<Child, Long> {

    Optional<Child> findByNameIgnoreCase(String name);

    List<Child> findByLanguage(String language);

    List<Child> findByAgeBetween(Integer minAge, Integer maxAge);
}
