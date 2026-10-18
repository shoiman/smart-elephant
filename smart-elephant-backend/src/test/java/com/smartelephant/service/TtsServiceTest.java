package com.smartelephant.service;

import com.smartelephant.i18n.GameLanguage;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;

import java.nio.file.Files;
import java.nio.file.Path;

import static org.assertj.core.api.Assertions.assertThat;

class TtsServiceTest {

    @TempDir
    Path cacheDir;

    @Test
    void disabledWithoutKeySoFrontendFallsBackToBrowserVoice() {
        TtsService tts = new TtsService("", "", cacheDir.toString());
        assertThat(tts.isEnabled()).isFalse();
        assertThat(tts.audioUrl("איפה גר הפיל?", GameLanguage.HE)).isNull();
    }

    @Test
    void audioUrlIsStableAndDependsOnLanguageVoice() {
        TtsService tts = new TtsService("key", "westeurope", cacheDir.toString());
        String url = tts.audioUrl("Слон", GameLanguage.RU);
        assertThat(url).matches("/api/audio/[0-9a-f]{32}\\.mp3");
        assertThat(tts.audioUrl("Слон", GameLanguage.RU)).isEqualTo(url);
        assertThat(tts.audioUrl("Слон", GameLanguage.UK)).isNotEqualTo(url);
    }

    @Test
    void unknownOrInvalidIdsAreNotSynthesized() {
        TtsService tts = new TtsService("key", "westeurope", cacheDir.toString());
        assertThat(tts.audio("0123456789abcdef0123456789abcdef")).isEmpty();
        assertThat(tts.audio("../../etc/passwd")).isEmpty();
        assertThat(tts.audio(null)).isEmpty();
    }

    @Test
    void cachedFileIsServedWithoutCallingAzure() throws Exception {
        TtsService tts = new TtsService("key", "westeurope", cacheDir.toString());
        String id = TtsService.audioId("Где живёт слон?", GameLanguage.RU);
        Files.write(cacheDir.resolve(id + ".mp3"), new byte[]{1, 2, 3});
        assertThat(tts.audio(id)).hasValueSatisfying(bytes -> assertThat(bytes).containsExactly(1, 2, 3));
    }
}
