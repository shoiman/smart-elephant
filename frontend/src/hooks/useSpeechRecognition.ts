import { useCallback, useEffect, useRef, useState } from "react";

/* Minimal typings for the Web Speech API (not included in TypeScript's DOM lib). */
interface RecognitionAlternative {
  readonly transcript: string;
}

interface RecognitionResultEvent {
  readonly results: ArrayLike<ArrayLike<RecognitionAlternative>>;
}

interface RecognitionErrorEvent {
  readonly error: string;
}

interface Recognition {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  continuous: boolean;
  onresult: ((event: RecognitionResultEvent) => void) | null;
  onerror: ((event: RecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  abort: () => void;
}

type RecognitionConstructor = new () => Recognition;

export type RecognitionError = "no-speech" | "not-allowed" | "failed";

const locales: Readonly<Record<string, string>> = { he: "he-IL", ru: "ru-RU", uk: "uk-UA" };

/**
 * Timing for young children (2-6): they pause to find words, so we decide when the answer
 * is over instead of the browser (Chrome stops after ~1 s of silence in one-shot mode).
 */
/** Silence after the last heard word that ends the answer */
const PAUSE_AFTER_SPEECH_MS = 2500;
/** How long to wait for the child to start speaking */
const WAIT_FOR_SPEECH_MS = 8000;
/** Hard limit for one answer */
const MAX_LISTEN_MS = 15000;

function getRecognitionConstructor(): RecognitionConstructor | undefined {
  const scope = window as unknown as {
    SpeechRecognition?: RecognitionConstructor;
    webkitSpeechRecognition?: RecognitionConstructor;
  };
  return scope.SpeechRecognition ?? scope.webkitSpeechRecognition;
}

interface ListenCallbacks {
  readonly onResult: (transcript: string) => void;
  readonly onError: (error: RecognitionError) => void;
}

/** Joins all recognized segments (final and in-progress) into one answer. */
function joinTranscript(results: ArrayLike<ArrayLike<RecognitionAlternative>>): string {
  const parts: string[] = [];
  for (let i = 0; i < results.length; i++) {
    const text = results[i]?.[0]?.transcript?.trim();
    if (text) parts.push(text);
  }
  return parts.join(" ").trim();
}

/** Wraps browser speech recognition for one answer in the given UI language. */
export function useSpeechRecognition(language: string) {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<Recognition | null>(null);
  const timersRef = useRef<number[]>([]);
  /** Ends the current session and reports what was heard so far */
  const finishRef = useRef<(() => void) | null>(null);
  const isSupported = getRecognitionConstructor() !== undefined;

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];
  }, []);

  /** Cancels listening and discards the answer (e.g. leaving the question). */
  const stop = useCallback(() => {
    clearTimers();
    finishRef.current = null;
    const recognition = recognitionRef.current;
    if (recognition) {
      // Detach handlers first so an aborted session does not report "silence"
      recognition.onresult = null;
      recognition.onerror = null;
      recognition.onend = null;
      recognition.abort();
    }
    recognitionRef.current = null;
    setIsListening(false);
  }, [clearTimers]);

  /** Stops listening now and submits what was heard so far (second tap on the mic). */
  const finish = useCallback(() => {
    finishRef.current?.();
  }, []);

  const listen = useCallback(
    ({ onResult, onError }: ListenCallbacks) => {
      const RecognitionImpl = getRecognitionConstructor();
      if (!RecognitionImpl) {
        onError("failed");
        return;
      }

      stop();
      const recognition = new RecognitionImpl();
      recognition.lang = locales[language] ?? language;
      // Keep listening through pauses and get partial text, so we control when the answer ends
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      let transcript = "";
      let settled = false;
      let pauseTimer: number | undefined;

      const settle = (report: () => void) => {
        if (settled) return;
        settled = true;
        stop(); // clears timers, detaches handlers, aborts the session
        report();
      };
      const finishWithTranscript = () =>
        settle(() => (transcript ? onResult(transcript) : onError("no-speech")));

      const schedule = (callback: () => void, ms: number) => {
        const id = window.setTimeout(callback, ms);
        timersRef.current.push(id);
        return id;
      };

      recognition.onresult = (event) => {
        const heard = joinTranscript(event.results);
        if (!heard) return;
        transcript = heard;
        // Every new word restarts the "child has finished" pause timer
        if (pauseTimer !== undefined) window.clearTimeout(pauseTimer);
        pauseTimer = schedule(finishWithTranscript, PAUSE_AFTER_SPEECH_MS);
      };
      recognition.onerror = (event) => {
        if (event.error === "aborted") return;
        if (event.error === "not-allowed" || event.error === "service-not-allowed") {
          settle(() => onError("not-allowed"));
        } else if (event.error === "no-speech") {
          finishWithTranscript();
        } else {
          // Network or audio problems: keep what we heard, otherwise report a failure
          settle(() => (transcript ? onResult(transcript) : onError("failed")));
        }
      };
      // The browser may end the session by itself (e.g. its own limits): use what we have
      recognition.onend = finishWithTranscript;

      schedule(() => {
        if (!transcript) finishWithTranscript();
      }, WAIT_FOR_SPEECH_MS);
      schedule(finishWithTranscript, MAX_LISTEN_MS);

      recognitionRef.current = recognition;
      finishRef.current = finishWithTranscript;
      setIsListening(true);
      try {
        recognition.start();
      } catch {
        settle(() => onError("failed"));
      }
    },
    [language, stop],
  );

  // Stop listening when the component unmounts or the language changes
  useEffect(() => stop, [stop, language]);

  return { isSupported, isListening, listen, stop, finish };
}
