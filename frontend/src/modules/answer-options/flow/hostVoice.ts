import { playAudio, speakText, stopAudio } from "../../../services/audioService";

/** A line the host says: the text is always shown in the bubble, the file is optional. */
export interface HostLine {
  readonly text: string;
  readonly audioUrl?: string | null;
}

/** When there is no sound, the line stays on screen for this long so the scene still flows. */
export function fallbackDurationMs(text: string): number {
  return Math.max(900, 75 * text.length);
}

/** Never wait for a line longer than its fallback time plus this (lost "ended" events). */
const SAFETY_EXTRA_MS = 8000;

let cancelCurrent: (() => void) | null = null;

/** Stops the current line; its promise resolves right away. */
export function stopHostVoice() {
  const cancel = cancelCurrent;
  cancelCurrent = null;
  cancel?.();
}

/**
 * Says one line and resolves when it is over: the audio file has ended, or the browser voice
 * has finished, or — without any sound — after fallbackDurationMs. Only one line plays at a time:
 * a new line stops the previous one.
 */
export function sayLine(line: HostLine, language: string): Promise<void> {
  stopHostVoice();

  return new Promise((resolve) => {
    const startedAt = Date.now();
    const fallbackMs = fallbackDurationMs(line.text);
    const timers: number[] = [];
    let settled = false;

    const finish = () => {
      if (settled) return;
      settled = true;
      timers.forEach((id) => window.clearTimeout(id));
      if (cancelCurrent === cancel) cancelCurrent = null;
      resolve();
    };
    // No sound: keep the line on screen for the rest of the fallback time
    const silentFinish = () => {
      if (settled) return;
      const left = Math.max(0, fallbackMs - (Date.now() - startedAt));
      timers.push(window.setTimeout(finish, left));
    };
    const cancel = () => {
      stopAudio();
      finish();
    };
    cancelCurrent = cancel;
    timers.push(window.setTimeout(finish, fallbackMs + SAFETY_EXTRA_MS));

    const viaBrowserVoice = () => {
      if (settled) return;
      speakText(line.text, language, { onEnd: finish, onFail: silentFinish });
    };
    if (line.audioUrl) playAudio(line.audioUrl, viaBrowserVoice, finish);
    else viaBrowserVoice();
  });
}
