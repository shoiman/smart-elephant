package com.smartelephant.controller;

import com.smartelephant.model.dto.QuestionResponse;
import com.smartelephant.model.entity.Child;
import com.smartelephant.repository.ChildRepository;
import com.smartelephant.service.QuestionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST API Controller for question management
 */
@RestController
@RequestMapping("/questions")
@RequiredArgsConstructor
@Slf4j
public class QuestionController {

    private final QuestionService questionService;
    private final ChildRepository childRepository;

    /**
     * Get next question for a child
     * GET /api/questions/next?childId={childId}&language={he|ru|uk}
     * language is optional; without it the child's profile language is used
     */
    @GetMapping("/next")
    public ResponseEntity<QuestionResponse> getNextQuestion(
            @RequestParam Long childId,
            @RequestParam(required = false) String language) {
        log.info("GET /questions/next?childId={}&language={}", childId, language);

        try {
            // Get child
            Child child = childRepository.findById(childId)
                    .orElseThrow(() -> new RuntimeException("Child not found: " + childId));

            // Generate next question
            QuestionResponse response = questionService.generateNextQuestion(child, language);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error generating next question", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }
}
