import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

import { fetchHostLineAudio } from "../../../services/hostLineService";
import type { Language } from "../../../shared/i18n";
import { choiceLabel } from "../optionLabels";
import type { Choice } from "../types";
import { hostPhrase } from "./hostPhrases";
import { sayLine, stopHostVoice, type HostLine } from "./hostVoice";
import type { ToddlerPhase } from "./toddlerCardState";

/** Two misses at most (product brief): "almost", then "let's say it together". */
export const MAX_ATTEMPTS = 2;

/** Timings from the design spec */
const PAUSE_BEFORE_QUESTION_MS = 500;
const PAUSE_AFTER_PRAISE_MS = 600;
const IDLE_REPEAT_MS = 5000;
const IDLE_HAND_MS = 8000;
/** SAY: the hand points at the mic after 5 s; without a tap the game moves on after 12 s */
const SAY_HAND_MS = 5000;
const SAY_SKIP_MS = 12000;
/** The repeated word gets one more try ("say it again"), then the game moves on */
const MAX_REPEAT_ATTEMPTS = 2;
/** A line waits at most this long for the host-line audio list, then uses the browser voice */
const LINE_AUDIO_WAIT_MS = 1500;

/** Title and text as one spoken line; an empty title is skipped. */
function joinLine(title: string, text: string): string {
  return [title, text].filter(Boolean).join(" ");
}

/** What the bubble shows; tone colours it: green "right", apricot "almost". */
export interface BubbleContent {
  readonly title?: string;
  readonly text: string;
  readonly tone: "plain" | "right" | "almost";
}

type ListenError = "no-speech" | "not-allowed" | "failed";

export interface ToddlerFlowSpeech {
  readonly isSupported: boolean;
  readonly listen: (callbacks: { onResult: (text: string) => void; onError: (error: ListenError) => void }) => void;
  readonly stop: () => void;
}

export interface ToddlerFlowOptions {
  /** Changes for every new question; the scene restarts when it does */
  readonly questionKey: string;
  readonly questionText: string;
  readonly questionAudioUrl?: string | null;
  readonly choices: readonly Choice[];
  readonly language: Language;
  readonly speech: ToddlerFlowSpeech;
  /** Sends the caption to the backend; resolves to "is correct", rejects on network error or timeout */
  readonly checkAnswer: (caption: string) => Promise<boolean>;
  /** Checks the repeated word without recording it; rejects on network error or timeout */
  readonly checkRepeat: (spoken: string) => Promise<boolean>;
  /** The question is over; earned = answered without "let's say it together" */
  readonly onDone: (result: { readonly earned: boolean }) => void;
}

/**
 * Drives one question on the toddler level: ASK → PRESENT → TURN → PRESS → RIGHT | ALMOST | TOGETHER
 * → SAY → DONE. Each phase starts with the host's line, the next one starts when it has ended.
 *
 * Every new action takes a new "run" number; async steps of an older run see that they are stale
 * and stop, so an interrupted chain (tap during a line, next question) never continues.
 */
export function useToddlerFlow(options: ToddlerFlowOptions) {
  const [phase, setPhaseState] = useState<ToddlerPhase>("ask");
  const [spot, setSpot] = useState(-1);
  const [press, setPress] = useState(-1);
  const [wrong, setWrong] = useState(-1);
  const [bubble, setBubble] = useState<BubbleContent>({ text: options.questionText, tone: "plain" });
  const [isTalking, setIsTalking] = useState(false);
  const [isHandVisible, setIsHandVisible] = useState(false);

  // Latest props for the async chains (they outlive the render that started them)
  const optionsRef = useRef(options);
  useLayoutEffect(() => {
    optionsRef.current = options;
  });

  const phaseRef = useRef<ToddlerPhase>("ask");
  const runRef = useRef(0);
  const timersRef = useRef<number[]>([]);
  const attemptsRef = useRef(0);
  const earnedRef = useRef(true);
  const repeatAttemptsRef = useRef(0);
  /** Azure audio for this question's host lines (text -> URL); loaded when the scene starts */
  const lineAudioRef = useRef<Promise<Record<string, string>>>(Promise.resolve({}));

  const correctIndex = options.choices.findIndex((choice) => choice.isCorrect);

  const setPhase = useCallback((next: ToddlerPhase) => {
    phaseRef.current = next;
    setPhaseState(next);
  }, []);

  const caption = useCallback((index: number) => {
    const { choices, language } = optionsRef.current;
    const choice = choices[index];
    return choice ? choiceLabel(choice, language) : "";
  }, []);

  const correctCaption = useCallback(() => {
    return caption(optionsRef.current.choices.findIndex((choice) => choice.isCorrect));
  }, [caption]);

  const phrase = useCallback(
    (key: Parameters<typeof hostPhrase>[1], text = "") => hostPhrase(optionsRef.current.language, key, text),
    [],
  );

  const questionLine = useCallback((): HostLine => {
    const { questionText, questionAudioUrl } = optionsRef.current;
    return { text: questionText, audioUrl: questionAudioUrl };
  }, []);

  // ---------- run control ----------

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];
  }, []);

  /** Stops everything that is going on and starts a new run. */
  const interrupt = useCallback((): number => {
    runRef.current += 1;
    clearTimers();
    stopHostVoice();
    optionsRef.current.speech.stop();
    setIsTalking(false);
    setIsHandVisible(false);
    return runRef.current;
  }, [clearTimers]);

  const isCurrent = (run: number) => run === runRef.current;

  const later = useCallback((callback: () => void, ms: number) => {
    timersRef.current.push(window.setTimeout(callback, ms));
  }, []);

  const wait = useCallback(
    (run: number, ms: number) => new Promise<boolean>((resolve) => later(() => resolve(run === runRef.current), ms)),
    [later],
  );

  /** Says a line; resolves to false if the run was interrupted meanwhile. */
  const speak = useCallback(async (run: number, line: HostLine): Promise<boolean> => {
    setIsTalking(true);
    let audioUrl = line.audioUrl;
    if (!audioUrl) {
      // Host lines come with Azure audio from the backend; without it the browser voice is tried
      const timeout = new Promise<Record<string, string>>((resolve) => window.setTimeout(() => resolve({}), LINE_AUDIO_WAIT_MS));
      const lines = await Promise.race([lineAudioRef.current, timeout]);
      if (run !== runRef.current) return false;
      audioUrl = lines[line.text];
    }
    await sayLine({ ...line, audioUrl }, optionsRef.current.language);
    if (run !== runRef.current) return false;
    setIsTalking(false);
    return true;
  }, []);

  // ---------- phases ----------

  const finish = useCallback(
    async (run: number, good: boolean) => {
      setPhase("done");
      const text = phrase(good ? "praise" : "praise.next");
      setBubble({ text, tone: "plain" });
      if (!(await speak(run, { text }))) return;
      if (!(await wait(run, PAUSE_AFTER_PRAISE_MS))) return;
      optionsRef.current.onDone({ earned: earnedRef.current });
    },
    [phrase, setPhase, speak, wait],
  );

  /** TURN: the child's move. Idle hints: repeat the question at 5 s, show the hand at 8 s. */
  const armIdle = useCallback(
    (run: number) => {
      later(() => {
        if (isCurrent(run) && phaseRef.current === "turn") void speak(run, questionLine());
      }, IDLE_REPEAT_MS);
      later(() => {
        if (isCurrent(run) && phaseRef.current === "turn") setIsHandVisible(true);
      }, IDLE_HAND_MS);
    },
    [later, questionLine, speak],
  );

  /** SAY idle hints: the hand points at the mic, later the game moves on without a penalty. */
  const armSayIdle = useCallback(
    (run: number) => {
      later(() => {
        if (isCurrent(run) && phaseRef.current === "say") setIsHandVisible(true);
      }, SAY_HAND_MS);
      later(() => {
        if (isCurrent(run) && phaseRef.current === "say") void finish(run, false);
      }, SAY_SKIP_MS);
    },
    [finish, later],
  );

  const toTurn = useCallback(
    (run: number) => {
      setPhase("turn");
      setSpot(-1);
      setPress(-1);
      setWrong(-1);
      setBubble({ text: optionsRef.current.questionText, tone: "plain" });
      armIdle(run);
    },
    [armIdle, setPhase],
  );

  /** SAY: "now say the word"; without a tap on the mic the game moves on after 9 s, no penalty. */
  const askRepeat = useCallback(
    async (run: number) => {
      if (!optionsRef.current.speech.isSupported) {
        await finish(run, earnedRef.current);
        return;
      }
      setPhase("say");
      const text = phrase("say.repeat", correctCaption());
      setBubble({ text, tone: "plain" });
      if (!(await speak(run, { text }))) return;
      armSayIdle(run);
    },
    [armSayIdle, correctCaption, finish, phrase, setPhase, speak],
  );

  /** Wrong or no repeated word: one more try ("say it again"), then move on without praise. */
  const repeatMiss = useCallback(
    async (run: number, reason: "wrong" | "silence") => {
      repeatAttemptsRef.current += 1;
      if (repeatAttemptsRef.current >= MAX_REPEAT_ATTEMPTS) {
        await finish(run, false);
        return;
      }
      setPhase("say");
      const title = phrase(reason === "wrong" ? "almost.title" : "notHeard.title");
      const text = phrase("say.again", correctCaption());
      setBubble({ title: title || undefined, text, tone: "almost" });
      if (!(await speak(run, { text: joinLine(title, text) }))) return;
      armSayIdle(run);
    },
    [armSayIdle, correctCaption, finish, phrase, setPhase, speak],
  );

  const right = useCallback(
    async (run: number) => {
      setPhase("right");
      const word = correctCaption();
      setBubble({ title: phrase("right.title"), text: phrase("right.text", word), tone: "right" });
      if (!(await speak(run, { text: `${phrase("right.title")} ${phrase("right.text", word)}` }))) return;
      await askRepeat(run);
    },
    [askRepeat, correctCaption, phrase, setPhase, speak],
  );

  const almost = useCallback(
    async (run: number, index: number) => {
      setWrong(index);
      setPhase("almost");
      const title = phrase("almost.title");
      const text = phrase("almost.text");
      setBubble({ title: title || undefined, text, tone: "almost" });
      if (!(await speak(run, { text: joinLine(title, text) }))) return;
      toTurn(run);
    },
    [phrase, setPhase, speak, toTurn],
  );

  const together = useCallback(
    async (run: number) => {
      earnedRef.current = false;
      setPhase("together");
      const text = phrase("together", correctCaption());
      setBubble({ text, tone: "plain" });
      if (!(await speak(run, { text }))) return;
      await askRepeat(run);
    },
    [askRepeat, correctCaption, phrase, setPhase, speak],
  );

  /** Starts the scene for the current question: ASK → PRESENT → TURN. */
  const start = useCallback(async () => {
    const run = interrupt();
    attemptsRef.current = 0;
    repeatAttemptsRef.current = 0;
    earnedRef.current = true;
    const { choices, language } = optionsRef.current;
    lineAudioRef.current = fetchHostLineAudio(language, choices.map((_, index) => caption(index)));
    setSpot(-1);
    setPress(-1);
    setWrong(-1);
    setPhase("ask");
    setBubble({ text: optionsRef.current.questionText, tone: "plain" });

    if (!(await wait(run, PAUSE_BEFORE_QUESTION_MS))) return;
    if (!(await speak(run, questionLine()))) return;

    setPhase("present");
    const count = optionsRef.current.choices.length;
    for (let i = 0; i < count; i++) {
      setSpot(i);
      const text = phrase(i === count - 1 ? "present.last" : "present.item", caption(i));
      if (!(await speak(run, { text }))) return;
    }
    toTurn(run);
  }, [caption, interrupt, phrase, questionLine, setPhase, speak, toTurn, wait]);

  // ---------- child's actions ----------

  /** Tap on a card: an answer, but only in TURN (cards are dimmed or busy otherwise). */
  const pick = useCallback(
    async (index: number) => {
      if (phaseRef.current !== "turn") return;
      const run = interrupt(); // a tap cuts the host's line (e.g. the repeated question)
      setPress(index);
      setPhase("press");

      let isCorrect: boolean;
      try {
        isCorrect = await optionsRef.current.checkAnswer(caption(index));
      } catch (error) {
        // Network error or timeout: quietly back to TURN, the attempt is not spent
        console.warn("[toddler] answer check failed:", error);
        if (isCurrent(run)) toTurn(run);
        return;
      }
      if (!isCurrent(run)) return;

      setPress(-1);
      if (isCorrect) {
        await right(run);
        return;
      }
      attemptsRef.current += 1;
      if (attemptsRef.current < MAX_ATTEMPTS) await almost(run, index);
      else await together(run);
    },
    [almost, caption, interrupt, right, setPhase, together, toTurn],
  );

  /** Mic in SAY: the repeated word is checked (not recorded); a miss gets one more try. */
  const micTap = useCallback(() => {
    if (phaseRef.current !== "say") return;
    const run = interrupt(); // recognition never runs while the host is talking
    setPhase("listen");
    setBubble({ text: phrase("listen"), tone: "plain" });
    optionsRef.current.speech.listen({
      onResult: (spoken) => {
        if (!isCurrent(run)) return;
        optionsRef.current
          .checkRepeat(spoken)
          .then((isCorrect) => {
            if (!isCurrent(run)) return;
            if (isCorrect) void finish(run, true);
            else void repeatMiss(run, "wrong");
          })
          .catch((error: unknown) => {
            // Network problem: do not blame the child, just move on
            console.warn("[toddler] repeat check failed:", error);
            if (isCurrent(run)) void finish(run, false);
          });
      },
      onError: (error) => {
        if (!isCurrent(run)) return;
        if (error === "no-speech") void repeatMiss(run, "silence");
        else void finish(run, false); // no mic permission or recognition failure
      },
    });
  }, [finish, interrupt, phrase, repeatMiss, setPhase]);

  /** Tap on the host: repeat the current line (TURN — the question, SAY — "now say") and restart idle timers. */
  const replay = useCallback(async () => {
    const current = phaseRef.current;
    if (current === "turn") {
      const run = interrupt();
      if (await speak(run, questionLine())) armIdle(run);
    } else if (current === "say") {
      const run = interrupt();
      setPhase("say");
      await askRepeat(run);
    }
  }, [armIdle, askRepeat, interrupt, questionLine, setPhase, speak]);

  /** Any touch on the screen hides the hand and restarts the idle countdown. */
  const touch = useCallback(() => {
    const current = phaseRef.current;
    if (current !== "turn" && current !== "say") return;
    setIsHandVisible(false);
    clearTimers();
    if (current === "turn") armIdle(runRef.current);
    else armSayIdle(runRef.current);
  }, [armIdle, armSayIdle, clearTimers]);

  // Start the scene for every new question (deferred one tick so the effect itself sets no state);
  // the component is keyed by question, so a new question also means a fresh state
  useEffect(() => {
    const id = window.setTimeout(() => void start(), 0);
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options.questionKey]);

  useEffect(
    () => () => {
      runRef.current += 1;
      timersRef.current.forEach((id) => window.clearTimeout(id));
      stopHostVoice();
    },
    [],
  );

  return {
    phase,
    bubble,
    isTalking,
    isHandVisible,
    cards: { spot, press, wrong, correct: correctIndex },
    pick,
    micTap,
    replay,
    touch,
  };
}
