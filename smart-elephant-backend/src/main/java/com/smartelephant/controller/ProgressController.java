package com.smartelephant.controller;

import com.smartelephant.model.dto.ProgressAnalysisResponseDto;
import com.smartelephant.model.dto.ProgressResponseDto;
import com.smartelephant.service.ProgressService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST API Controller for child progress tracking and analysis
 */
@RestController
@RequestMapping("/progress")
@RequiredArgsConstructor
@Slf4j
public class ProgressController {

    private final ProgressService progressService;

    /**
     * Get a child's progress summary
     * GET /api/progress/{childId}
     */
    @GetMapping("/{childId}")
    public ResponseEntity<ProgressResponseDto> getProgress(@PathVariable Long childId) {
        log.info("GET /progress/{}", childId);

        try {
            ProgressResponseDto response = progressService.getProgress(childId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error getting progress", e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    /**
     * Analyze a child's progress (mock heuristic analysis until Phase 2 LLM lands)
     * POST /api/progress/analyze
     */
    @PostMapping("/analyze")
    public ResponseEntity<ProgressAnalysisResponseDto> analyzeProgress(@RequestBody ProgressAnalyzeRequestBody request) {
        log.info("POST /progress/analyze - childId: {}", request.getChildId());

        try {
            ProgressAnalysisResponseDto response = progressService.analyzeProgress(request.getChildId());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error analyzing progress", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    /**
     * Local request body record for the analyze endpoint
     */
    public static class ProgressAnalyzeRequestBody {
        private Long childId;

        public Long getChildId() {
            return childId;
        }

        public void setChildId(Long childId) {
            this.childId = childId;
        }
    }
}
