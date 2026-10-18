package com.smartelephant.controller;

import com.smartelephant.service.TtsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.CacheControl;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.time.Duration;

/**
 * Serves synthesized speech for questions and answers.
 * GET /api/audio/{id}.mp3 - id comes from audioUrl / answerAudioUrl in QuestionResponse
 */
@RestController
@RequiredArgsConstructor
public class AudioController {

    private final TtsService ttsService;

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
