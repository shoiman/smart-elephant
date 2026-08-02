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
