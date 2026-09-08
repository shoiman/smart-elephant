package com.smartelephant.service;

import com.smartelephant.exception.ResourceNotFoundException;
import com.smartelephant.model.dto.ChildRegistrationRequest;
import com.smartelephant.model.dto.ChildResponse;
import com.smartelephant.model.entity.Child;
import com.smartelephant.repository.ChildRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Service for child registration and profile management
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ChildService {

    private final ChildRepository childRepository;

    /**
     * Register a new child profile
     */
    @Transactional
    public ChildResponse registerChild(ChildRegistrationRequest request) {
        log.info("Registering new child: name={}, age={}, language={}",
                request.getName(), request.getAge(), request.getLanguage());

        Child child = Child.builder()
                .name(request.getName().trim())
                .age(request.getAge())
                .language(request.getLanguage().toLowerCase())
                .build();

        Child saved = childRepository.save(child);
        log.info("Child registered with id: {}", saved.getId());

        return toResponse(saved);
    }

    /**
     * Get a child by ID
     */
    public ChildResponse getChildById(Long id) {
        Child child = childRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Child not found: " + id));
        return toResponse(child);
    }

    /**
     * Get all registered children
     */
    public List<ChildResponse> getAllChildren() {
        return childRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    private ChildResponse toResponse(Child child) {
        return ChildResponse.builder()
                .id(child.getId())
                .name(child.getName())
                .age(child.getAge())
                .language(child.getLanguage())
                .createdAt(child.getCreatedAt())
                .build();
    }
}
