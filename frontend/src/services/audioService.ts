let currentAudio: HTMLAudioElement | null = null;

export function playAudio(src: string) {
  // If there's already an audio playing, pause it and reset its time
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
  }

  currentAudio = new Audio(src);

  currentAudio.onended = () => {
    currentAudio = null;
  };

  currentAudio.play().catch((error) => {
    console.error("Audio playback failed:", error);
  });
}

const speechLocales: Readonly<Record<string, string>> = { he: "he-IL", ru: "ru-RU", uk: "uk-UA" };

/** Reads text aloud with the browser's built-in speech synthesis (no-op if unsupported). */
export function speakText(text: string, language: string): boolean {
  if (!("speechSynthesis" in window) || !text) return false;

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = speechLocales[language] ?? language;
  utterance.rate = 0.9;
  window.speechSynthesis.speak(utterance);
  return true;
}
