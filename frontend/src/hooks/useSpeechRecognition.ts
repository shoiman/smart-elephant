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

/** Wraps browser speech recognition for one-shot answers in the given UI language. */
export function useSpeechRecognition(language: string) {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<Recognition | null>(null);
  const isSupported = getRecognitionConstructor() !== undefined;

  const stop = useCallback(() => {
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
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;
      recognition.continuous = false;

      let settled = false;
      recognition.onresult = (event) => {
        const transcript = event.results[0]?.[0]?.transcript?.trim() ?? "";
        settled = true;
        if (transcript) onResult(transcript);
        else onError("no-speech");
      };
      recognition.onerror = (event) => {
        if (settled || event.error === "aborted") return;
        settled = true;
        if (event.error === "no-speech") onError("no-speech");
        else if (event.error === "not-allowed" || event.error === "service-not-allowed") onError("not-allowed");
        else onError("failed");
      };
      recognition.onend = () => {
        setIsListening(false);
        // Ended without any result: treat as silence
        if (!settled) {
          settled = true;
          onError("no-speech");
        }
      };

      recognitionRef.current = recognition;
      setIsListening(true);
      try {
        recognition.start();
      } catch {
        setIsListening(false);
        onError("failed");
      }
    },
    [language, stop],
  );

  // Stop listening when the component unmounts or the language changes
  useEffect(() => stop, [stop, language]);

  return { isSupported, isListening, listen, stop };
}
