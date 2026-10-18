let currentAudio: HTMLAudioElement | null = null;

/**
 * Plays an audio file. onError runs if the file cannot be played
 * (missing file, network error, autoplay blocked), e.g. to fall back to speakText.
 */
export function playAudio(src: string, onError?: () => void) {
  // Do not talk over a file with the browser voice
  if ("speechSynthesis" in window) window.speechSynthesis.cancel();

  // If there's already an audio playing, pause it and reset its time
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
  }

  currentAudio = new Audio(src);

  currentAudio.onended = () => {
    currentAudio = null;
  };

  let failed = false;
  const fail = (error: unknown) => {
    if (failed) return;
    failed = true;
    console.error("Audio playback failed:", error);
    onError?.();
  };
  currentAudio.onerror = () => fail(currentAudio?.error ?? "load error");
  currentAudio.play().catch(fail);
}

const speechLocales: Readonly<Record<string, string>> = { he: "he-IL", ru: "ru-RU", uk: "uk-UA" };

/** Browsers load voices asynchronously: getVoices() is often empty right after page load. */
function loadVoices(): Promise<SpeechSynthesisVoice[]> {
  const voices = window.speechSynthesis.getVoices();
  if (voices.length > 0) return Promise.resolve(voices);
  return new Promise((resolve) => {
    const done = () => resolve(window.speechSynthesis.getVoices());
    window.speechSynthesis.addEventListener("voiceschanged", done, { once: true });
    // Some browsers never fire voiceschanged; do not wait forever
    window.setTimeout(done, 1500);
  });
}

function normalizeLang(lang: string): string {
  return lang.replace("_", "-").toLowerCase();
}

/** Picks the best voice for a locale: exact match first, then same language; prefers natural/online voices. */
function findVoice(voices: SpeechSynthesisVoice[], locale: string): SpeechSynthesisVoice | undefined {
  const target = normalizeLang(locale);
  const base = target.split("-")[0];
  // "iw" is the legacy code for Hebrew that some systems still use
  const bases = base === "he" ? ["he", "iw"] : [base];
  const candidates = voices.filter((voice) => {
    const lang = normalizeLang(voice.lang);
    return lang === target || bases.includes(lang.split("-")[0]);
  });
  const score = (voice: SpeechSynthesisVoice) =>
    (normalizeLang(voice.lang) === target ? 2 : 0) + (/natural|online|google/i.test(voice.name) ? 1 : 0);
  return candidates.sort((a, b) => score(b) - score(a))[0];
}

/** True if the browser has a voice for this language (useful to show a hint to parents). */
export async function hasVoiceFor(language: string): Promise<boolean> {
  if (!("speechSynthesis" in window)) return false;
  const voices = await loadVoices();
  return findVoice(voices, speechLocales[language] ?? language) !== undefined;
}

/** Reads text aloud with the browser's built-in speech synthesis (no-op if unsupported). */
export function speakText(text: string, language: string): boolean {
  if (!("speechSynthesis" in window) || !text) return false;

  const synth = window.speechSynthesis;
  const locale = speechLocales[language] ?? language;
  const wasBusy = synth.speaking || synth.pending;
  synth.cancel();

  void loadVoices().then((voices) => {
    const voice = findVoice(voices, locale);
    if (!voice) {
      console.warn(
        `[audio] No speech voice for "${locale}". Available:`,
        voices.map((v) => `${v.name} (${v.lang})`),
      );
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = locale;
    if (voice) utterance.voice = voice;
    utterance.rate = 0.9;
    utterance.onerror = (event) => console.warn("[audio] Speech failed:", event.error);

    // Chrome may drop an utterance queued right after cancel(); give it a moment
    window.setTimeout(() => {
      synth.resume(); // Chrome can get stuck in a paused state after long idle
      synth.speak(utterance);
    }, wasBusy ? 100 : 0);
  });
  return true;
}
