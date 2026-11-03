package com.smartelephant.controller;

import com.smartelephant.model.dto.ProgressResponse;
import com.smartelephant.service.ProgressService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/** The parent's progress screen */
@RestController
@RequestMapping("/progress")
@RequiredArgsConstructor
@Slf4j
public class ProgressController {

    private final ProgressService progressService;

    /**
     * GET /api/progress/{childId}?period=week|month|all&tz=Asia/Jerusalem
     * period defaults to week; tz is the client's zone ("today", days of the week), the server's zone if missing
     */
    @GetMapping("/{childId}")
    public ResponseEntity<ProgressResponse> getProgress(@PathVariable Long childId,
                                                        @RequestParam(required = false) String period,
                                                        @RequestParam(required = false) String tz) {
        log.info("GET /progress/{} period={} tz={}", childId, period, tz);
        return ResponseEntity.ok(progressService.getProgress(childId, period, tz));
    }
}
