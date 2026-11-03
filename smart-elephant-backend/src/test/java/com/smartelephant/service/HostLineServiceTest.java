package com.smartelephant.service;

import com.smartelephant.i18n.AnimalCatalog;
import com.smartelephant.i18n.GameLanguage;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

class HostLineServiceTest {

    private static final AnimalCatalog CATALOG = new AnimalCatalog();

    /** A fake key turns TTS on; audio URLs are built without calling Azure. */
    private final TtsService tts = new TtsService("test-key", "test-region", "./target/test-audio-cache");
    private final HostLineService service = new HostLineService(tts, CATALOG);

    @Test
    void voicesHebrewLinesForTheCardWord() {
        Map<String, String> lines = service.audioUrls(GameLanguage.HE, List.of("חגב", "פרפר"));
        assertThat(lines.keySet()).contains("תגידו שוב: חגב!", "לא שמעתי. תגידו שוב: חגב!", "או פרפר?",
                "נכון! חגב!", "כל הכבוד!");
        assertThat(lines.get("כל הכבוד!")).isEqualTo(tts.audioUrl("כל הכבוד!", GameLanguage.HE));
    }

    @Test
    void russianLinesUseCapitalAtTheStartAndLowerCaseInside() {
        Map<String, String> lines = service.audioUrls(GameLanguage.RU, List.of("корова", "лес"));
        assertThat(lines.keySet()).contains("Правильно! Корова!", "Или корова?", "Корова?",
                "Давай скажем вместе: лес!", "Я не услышала. Скажи ещё раз: корова!");
    }

    @Test
    void unknownWordsAreNeverVoiced() {
        Map<String, String> lines = service.audioUrls(GameLanguage.RU, List.of("купи слона", "hello"));
        assertThat(lines.keySet()).doesNotContain("Правильно! Купи слона!", "Или hello?");
        assertThat(lines.keySet()).contains("Молодец!"); // lines without a word are still there
    }

    @Test
    void microphoneScreenLinesUseTheBackendAnswer() {
        Map<String, String> lines = service.screenAudioUrls(GameLanguage.RU, "Слон серый");
        assertThat(lines.keySet()).containsExactly("Попробуем ещё?", "Не расслышала. Попробуем ещё?",
                "Правильно! Слон серый", "Давай скажем вместе: Слон серый");
        assertThat(service.screenAudioUrls(GameLanguage.HE, null).keySet())
                .containsExactly("ננסה שוב?", "לא שמעתי. ננסה שוב?");
    }

    @Test
    void nothingWhenTtsIsDisabled() {
        HostLineService disabled = new HostLineService(new TtsService("", "", "./target/test-audio-cache"), CATALOG);
        assertThat(disabled.audioUrls(GameLanguage.HE, List.of("חגב"))).isEmpty();
    }
}
