package com.smartelephant.service;

import com.smartelephant.i18n.GameLanguage;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Duration;
import java.util.HexFormat;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.regex.Pattern;

/**
 * Text-to-speech with Azure AI Speech, cached as mp3 files on disk.
 *
 * Browsers often have no Hebrew voice (Chrome has none at all), so the game gets
 * real audio files from the backend instead of relying on window.speechSynthesis.
 *
 * Security: only phrases registered by the backend itself (questions and answers it
 * generated) can be synthesized, so the public /audio endpoint cannot be used to
 * spend the Azure quota on arbitrary text.
 *
 * When no Azure key is configured, TTS is disabled: audio URLs are null and the
 * frontend falls back to the browser voice.
 */
@Service
@Slf4j
public class TtsService {

    private static final Pattern AUDIO_ID = Pattern.compile("[0-9a-f]{32}");
    private static final String OUTPUT_FORMAT = "audio-24khz-48kbitrate-mono-mp3";

    /** Warm, clear neural voices; child-friendly speaking rate is set in SSML. */
    private static final Map<GameLanguage, Voice> VOICES = Map.of(
            GameLanguage.HE, new Voice("he-IL", "he-IL-HilaNeural"),
            GameLanguage.RU, new Voice("ru-RU", "ru-RU-SvetlanaNeural"),
            GameLanguage.UK, new Voice("uk-UA", "uk-UA-PolinaNeural"),
            GameLanguage.EN, new Voice("en-US", "en-US-AnaNeural")
    );

    record Voice(String locale, String name) {
    }

    record Phrase(GameLanguage language, String text) {
    }

    private final String apiKey;
    private final String region;
    private final Path cacheDir;
    private final HttpClient httpClient;

    /** Phrases the backend generated; key is the audio id. */
    private final Map<String, Phrase> registeredPhrases = new ConcurrentHashMap<>();

    public TtsService(
            @Value("${app.tts.azure.key:}") String apiKey,
            @Value("${app.tts.azure.region:}") String region,
            @Value("${app.tts.cache-dir:./audio-cache}") String cacheDir) {
        this.apiKey = apiKey == null ? "" : apiKey.trim();
        this.region = region == null ? "" : region.trim();
        this.cacheDir = Path.of(cacheDir);
        this.httpClient = HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(5)).build();

        if (isEnabled()) {
            log.info("Azure TTS enabled (region: {}, cache: {})", this.region, this.cacheDir.toAbsolutePath());
        } else {
            log.info("Azure TTS disabled: set AZURE_SPEECH_KEY and AZURE_SPEECH_REGION to enable it");
        }
    }

    public boolean isEnabled() {
        return !apiKey.isEmpty() && !region.isEmpty();
    }

    /**
     * Registers a phrase and returns its audio URL, or null when TTS is disabled or the text is empty.
     * The URL is content-addressed: the same text and voice always give the same URL.
     */
    public String audioUrl(String text, GameLanguage language) {
        if (!isEnabled() || text == null || text.isBlank()) {
            return null;
        }
        String id = audioId(text, language);
        registeredPhrases.putIfAbsent(id, new Phrase(language, text));
        return "/api/audio/" + id + ".mp3";
    }

    /**
     * Returns mp3 bytes for an audio id: from the disk cache, or synthesized once via Azure.
     * Empty when the id is unknown or synthesis failed.
     */
    public Optional<byte[]> audio(String id) {
        if (id == null || !AUDIO_ID.matcher(id).matches()) {
            return Optional.empty();
        }
        Path file = cacheDir.resolve(id + ".mp3");
        try {
            if (Files.exists(file)) {
                return Optional.of(Files.readAllBytes(file));
            }
        } catch (IOException e) {
            log.warn("Cannot read cached audio {}: {}", file, e.getMessage());
        }

        Phrase phrase = registeredPhrases.get(id);
        if (phrase == null || !isEnabled()) {
            return Optional.empty();
        }

        Optional<byte[]> audio = synthesize(phrase);
        audio.ifPresent(bytes -> saveToCache(file, bytes));
        return audio;
    }

    private Optional<byte[]> synthesize(Phrase phrase) {
        Voice voice = VOICES.get(phrase.language());
        String ssml = "<speak version='1.0' xml:lang='" + voice.locale() + "'>"
                + "<voice name='" + voice.name() + "'>"
                + "<prosody rate='-10%'>" + escapeXml(phrase.text()) + "</prosody>"
                + "</voice></speak>";

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("https://" + region + ".tts.speech.microsoft.com/cognitiveservices/v1"))
                .timeout(Duration.ofSeconds(10))
                .header("Ocp-Apim-Subscription-Key", apiKey)
                .header("Content-Type", "application/ssml+xml")
                .header("X-Microsoft-OutputFormat", OUTPUT_FORMAT)
                .header("User-Agent", "smart-elephant")
                .POST(HttpRequest.BodyPublishers.ofString(ssml, StandardCharsets.UTF_8))
                .build();

        try {
            HttpResponse<byte[]> response = httpClient.send(request, HttpResponse.BodyHandlers.ofByteArray());
            if (response.statusCode() == 200 && response.body().length > 0) {
                log.debug("Synthesized {} bytes for [{}] {}", response.body().length, phrase.language(), phrase.text());
                return Optional.of(response.body());
            }
            log.warn("Azure TTS returned HTTP {} for [{}] {}", response.statusCode(), phrase.language(), phrase.text());
        } catch (IOException e) {
            log.warn("Azure TTS request failed: {}", e.getMessage());
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        return Optional.empty();
    }

    /** Writes via a temp file + move, so a half-written file is never served. */
    private void saveToCache(Path file, byte[] bytes) {
        try {
            Files.createDirectories(cacheDir);
            Path tmp = Files.createTempFile(cacheDir, "tts-", ".tmp");
            Files.write(tmp, bytes);
            Files.move(tmp, file, StandardCopyOption.REPLACE_EXISTING, StandardCopyOption.ATOMIC_MOVE);
        } catch (IOException e) {
            log.warn("Cannot cache audio {}: {}", file, e.getMessage());
        }
    }

    /** Stable id for (voice, text); changing the voice gives new files automatically. */
    static String audioId(String text, GameLanguage language) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest((VOICES.get(language).name() + "|" + text.trim())
                    .getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hash).substring(0, 32);
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-256 is not available", e);
        }
    }

    private static String escapeXml(String text) {
        return text.replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace("\"", "&quot;")
                .replace("'", "&apos;");
    }
}
