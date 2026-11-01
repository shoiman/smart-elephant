let currentAudio: HTMLAudioElement | null = null;
/** Bumped by stopAudio(): a browser utterance queued before the stop must not start after it */
let speechGeneration = 0;

/** Stops the audio file and the browser voice, whatever is playing now. */
export function stopAudio() {
  speechGeneration++;
  if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  if (currentAudio) {
    currentAudio.onended = null;
    currentAudio.onerror = null;
    currentAudio.pause();
    currentAudio = null;
  }
}

/**
 * Plays an audio file. onError runs if the file cannot be played
 * (missing file, network error, autoplay blocked), e.g. to fall back to speakText.
 * onEnded runs when the file has played to the end.
 */
export function playAudio(src: string, onError?: () => void, onEnded?: () => void) {
  // Do not talk over a file with the browser voice
  stopAudio();

  const audio = new Audio(src);
  currentAudio = audio;

  audio.onended = () => {
    if (currentAudio === audio) currentAudio = null;
    onEnded?.();
  };

  let failed = false;
  const fail = (error: unknown) => {
    if (failed) return;
    failed = true;
    console.error("Audio playback failed:", error);
    onError?.();
  };
  audio.onerror = () => fail(audio.error ?? "load error");
  audio.play().catch(fail);
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

interface SpeakCallbacks {
  /** The utterance has been spoken to the end */
  readonly onEnd?: () => void;
  /** No voice for the language or the utterance failed */
  readonly onFail?: () => void;
}

/**
 * Reads text aloud with the browser's built-in speech synthesis (no-op if unsupported).
 * Without callbacks it speaks even with no matching voice (old behaviour); with callbacks it
 * reports onFail instead, so the caller can keep the line on screen for a while.
 */
export function speakText(text: string, language: string, callbacks?: SpeakCallbacks): boolean {
  if (!("speechSynthesis" in window) || !text) {
    callbacks?.onFail?.();
    return false;
  }

  const synth = window.speechSynthesis;
  const locale = speechLocales[language] ?? language;
  const wasBusy = synth.speaking || synth.pending;
  stopAudio();
  const generation = speechGeneration;

  void loadVoices().then((voices) => {
    if (generation !== speechGeneration) return; // stopped while voices were loading
    const voice = findVoice(voices, locale);
    if (!voice) {
      console.warn(
        `[audio] No speech voice for "${locale}". Available:`,
        voices.map((v) => `${v.name} (${v.lang})`),
      );
      if (callbacks) {
        callbacks.onFail?.();
        return;
      }
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = locale;
    if (voice) utterance.voice = voice;
    utterance.rate = 0.9;
    utterance.onend = () => callbacks?.onEnd?.();
    utterance.onerror = (event) => {
      console.warn("[audio] Speech failed:", event.error);
      callbacks?.onFail?.();
    };

    // Chrome may drop an utterance queued right after cancel(); give it a moment
    window.setTimeout(() => {
      if (generation !== speechGeneration) return; // stopped in the meantime
      synth.resume(); // Chrome can get stuck in a paused state after long idle
      synth.speak(utterance);
    }, wasBusy ? 100 : 0);
  });
  return true;
}
