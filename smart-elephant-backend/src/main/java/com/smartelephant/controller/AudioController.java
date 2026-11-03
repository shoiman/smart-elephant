package com.smartelephant.controller;

import com.smartelephant.i18n.GameLanguage;
import com.smartelephant.service.HostLineService;
import com.smartelephant.service.TtsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.CacheControl;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.time.Duration;
import java.util.List;
import java.util.Map;

/**
 * Serves synthesized speech for questions and answers.
 * GET /api/audio/{id}.mp3 - id comes from audioUrl / answerAudioUrl in QuestionResponse
 *   or from POST /api/audio/host-lines
 */
@RestController
@RequiredArgsConstructor
public class AudioController {

    private final TtsService ttsService;
    private final HostLineService hostLineService;

    /** Card words of one question in the child's language */
    public record HostLinesRequest(String language, List<String> words) {
    }

    /** Line text exactly as the host says it -> audio URL */
    public record HostLinesResponse(Map<String, String> lines) {
    }

    /**
     * Audio for the host's lines on the toddler level ("Правильно! Корова!").
     * POST /api/audio/host-lines {"language":"he","words":["חגב","פרפר"]}
     */
    @PostMapping("/audio/host-lines")
    public HostLinesResponse hostLines(@RequestBody HostLinesRequest request) {
        GameLanguage language = GameLanguage.fromCode(request.language());
        return new HostLinesResponse(hostLineService.audioUrls(language, request.words()));
    }

    @GetMapping("/audio/{id:[0-9a-f]+}.mp3")
    public ResponseEntity<byte[]> getAudio(@PathVariable String id) {
        return ttsService.audio(id)
                .map(bytes -> ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType("audio/mpeg"))
                        // URLs are content-addressed, so the file never changes
                        .cacheControl(CacheControl.maxAge(Duration.ofDays(365)).cachePublic().immutable())
                        .body(bytes))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
