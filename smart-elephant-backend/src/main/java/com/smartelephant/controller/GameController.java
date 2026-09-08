package com.smartelephant.controller;

import com.smartelephant.model.dto.GameStartRequest;
import com.smartelephant.model.dto.GameSessionResponse;
import com.smartelephant.model.dto.AnswerRequest;
import com.smartelephant.model.dto.AnswerResponse;
import com.smartelephant.service.GameService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST API Controller for game management
 */
@RestController
@RequestMapping("/games")
@RequiredArgsConstructor
@Slf4j
public class GameController {

    private final GameService gameService;

    /**
     * Start a new game
     * POST /api/games/start
     */
    @PostMapping("/start")
    public ResponseEntity<GameSessionResponse> startGame(@RequestBody GameStartRequest request) {
        log.info("POST /games/start - childId: {}, numQuestions: {}", request.getChildId(), request.getNumQuestions());

        try {
            GameSessionResponse response = gameService.startGame(
                    request.getChildId(),
                    request.getNumQuestions()
            );
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            log.error("Error starting game", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    /**
     * Get game session details
     * GET /api/games/{sessionId}
     */
    @GetMapping("/{sessionId}")
    public ResponseEntity<?> getGameSession(@PathVariable Long sessionId) {
        log.info("GET /games/{} - getting session details", sessionId);

        try {
            // For Phase 1, return basic info
            return ResponseEntity.ok().body(new Object() {
                public final Long sessionId_val = sessionId;
                public final String status = "active";
            });
        } catch (Exception e) {
            log.error("Error getting game session", e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    /**
     * Submit an answer
     * POST /api/games/answer
     */
    @PostMapping("/answer")
    public ResponseEntity<AnswerResponse> submitAnswer(@RequestBody AnswerRequest request) {
        log.info("POST /games/answer - sessionId: {}, animalId: {}", request.getGameSessionId(), request.getAnimalId());

        try {
            AnswerResponse response = gameService.submitAnswer(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error submitting answer", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    /**
     * End a game session
     * POST /api/games/{sessionId}/end
     */
    @PostMapping("/{sessionId}/end")
    public ResponseEntity<GameSessionResponse> endGame(@PathVariable Long sessionId) {
        log.info("POST /games/{}/end - ending session", sessionId);

        try {
            GameSessionResponse response = gameService.endGame(sessionId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error ending game", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }
}
