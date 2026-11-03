package com.smartelephant.controller;

import com.smartelephant.model.dto.ChildRegistrationRequest;
import com.smartelephant.model.dto.ChildResponse;
import com.smartelephant.model.dto.StarsResponse;
import com.smartelephant.service.ChildService;
import com.smartelephant.service.StarsService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST API Controller for child registration and profile management
 */
@RestController
@RequestMapping("/children")
@RequiredArgsConstructor
@Slf4j
public class ChildController {

    private final ChildService childService;
    private final StarsService starsService;

    /**
     * Register a new child
     * POST /api/children
     */
    @PostMapping
    public ResponseEntity<ChildResponse> registerChild(@Valid @RequestBody ChildRegistrationRequest request) {
        log.info("POST /children - registering child: {}", request.getName());
        ChildResponse response = childService.registerChild(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Get child by ID
     * GET /api/children/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<ChildResponse> getChild(@PathVariable Long id) {
        log.info("GET /children/{}", id);
        return ResponseEntity.ok(childService.getChildById(id));
    }

    /**
     * The child's "My stars" screen: today's stars, the album, the next animals
     * GET /api/children/{id}/stars?tz=Asia/Jerusalem
     */
    @GetMapping("/{id}/stars")
    public ResponseEntity<StarsResponse> getStars(@PathVariable Long id, @RequestParam(required = false) String tz) {
        log.info("GET /children/{}/stars tz={}", id, tz);
        return ResponseEntity.ok(starsService.getStars(id, tz));
    }

    /**
     * Get all registered children
     * GET /api/children
     */
    @GetMapping
    public ResponseEntity<List<ChildResponse>> getAllChildren() {
        log.info("GET /children - listing all");
        return ResponseEntity.ok(childService.getAllChildren());
    }
}
