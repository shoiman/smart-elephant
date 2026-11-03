/**
 * GamesPage - main game flow.
 *
 * One game is one animal: the first question is always "Who is this?" (it also picks the animal),
 * the next ones are about the same animal ("What color is it?", "What does it eat?"...).
 * If the child does not name the animal, the host says it together with the child and the game goes on.
 *
 * Backend flow:
 * 1. GET /questions/next → "Who is this?" about a new animal (and how many questions it has)
 * 2. POST /games/start → gameSessionId
 * 3. GET /questions/next?animal=…&asked=… → next question about the same animal
 * 3. POST /games/answer → backend validates the answer
 * 4. POST /games/{id}/end → final score, progress update
 *
 * The child answers by voice (Web Speech API); a text field is the fallback
 * when the browser has no speech recognition.
 */
import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";

import Host from "../components/Host/Host";
import RewardStar from "../components/RewardStar/RewardStar";
import SpeechBubble from "../components/SpeechBubble/SpeechBubble";
import { findAnimalByName } from "../data/animals/lookup";
import { useSpeechRecognition, type RecognitionError } from "../hooks/useSpeechRecognition";
import {
  AnswerOptions,
  buildQuestionChoices,
  HandHintIcon,
  shouldShowChoices,
  startHandHint,
  ToddlerQuestion,
  useAnswerLevel,
} from "../modules/answer-options";
import type { GameEndResponse, Question } from "../services/api-types";
import { playAudio, speakText } from "../services/audioService";
import GameService from "../services/gameService";
import QuestionService from "../services/questionService";
import { AlbumIcon, ArrowForwardIcon, MicIcon, RefreshIcon, SendIcon, SpeakerIcon } from "../shared/icons/Icons";
import { formatMessage, useI18n } from "../shared/i18n";
import { usePageHeader } from "../shared/layout/PageHeaderContext";
import "./GamesPage.css";

// Mock child ID - in real app, this would come from user auth/selection
const MOCK_CHILD_ID = 1;
/** At most this many questions about one animal ("Who is this?" included); fewer if the animal has fewer topics. */
const QUESTIONS_PER_GAME = 5;
// Toddler cards: a pressed card waits for the backend at most this long, then quietly comes back
const TODDLER_ANSWER_TIMEOUT_MS = 5000;
// After this many wrong attempts (silence included) the host says the answer together with the child.
// 2 = one encouragement with picture hints, then "let's say it together" (see docs/PRODUCT_BRIEF.md)
const MAX_ATTEMPTS = 2;
/** Microphone-only screen: the hand points at the mic after this long without a touch. */
const MIC_HAND_MS = 5000;

type Phase =
  | "starting"
  | "loading"
  | "question"
  | "checking"
  | "correct"
  | "incorrect"
  | "together"
  | "finishing"
  | "finished"
  | "error";

export function GamesPage() {
  const { t, language } = useI18n();
  const speech = useSpeechRecognition(language);

  const [phase, setPhase] = useState<Phase>("starting");
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [question, setQuestion] = useState<Question | null>(null);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [heardAnswer, setHeardAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [typedAnswer, setTypedAnswer] = useState("");
  const [result, setResult] = useState<GameEndResponse | null>(null);
  const [retryAction, setRetryAction] = useState<(() => void) | null>(null);
  /** Number of questions in this game (one animal) */
  const [gameLength, setGameLength] = useState(QUESTIONS_PER_GAME);
  /** Topics already asked about the current animal; sent to the backend so it does not repeat them */
  const askedTopicsRef = useRef<string[]>([]);
  const answerStartRef = useRef(0);
  const hasStartedRef = useRef(false);

  usePageHeader({
    progress:
      phase === "finished" ? undefined : { current: Math.min(answeredCount + 1, gameLength), total: gameLength },
  });

  const animal = findAnimalByName(question?.animalName);
  const localizedName = animal?.names[language] ?? question?.animalName ?? "";
  // The answer to the question that was asked; older backends only know the animal name
  const correctAnswer = question?.answer || (localizedName ? formatMessage(t("game.thisIs"), { name: localizedName }) : "");
  const togetherAnswer = question?.answer || localizedName;

  // Picture answer cards; shuffled once per question so they don't jump on re-render
  const level = useAnswerLevel();
  const choices = useMemo(
    () => buildQuestionChoices(animal?.id, question?.topic, level),
    [animal?.id, question, level],
  );
  const showChoices = choices.length > 0 && shouldShowChoices(level, attempts);
  // Toddler level with picture cards runs the new voiced scene (design spec); other cases use the old flow for now
  const isToddlerScene = level === "toddler" && choices.length > 0;

  const fail = useCallback((retry: () => void) => {
    setRetryAction(() => retry);
    setPhase("error");
  }, []);

  // Microphone-only screen (no toddler cards): the mic pulses while it waits for the child, and on
  // levels "Показываю" / "С подсказкой" a hand points at it after MIC_HAND_MS without a touch.
  const sectionRef = useRef<HTMLElement>(null);
  const micRef = useRef<HTMLButtonElement>(null);
  const handRef = useRef<SVGSVGElement>(null);
  const isWaitingForVoice = phase === "question" && !isToddlerScene && speech.isSupported && !speech.isListening;
  const isHandAllowed = isWaitingForVoice && level !== "older";
  // Id of the question the hand is shown for (null = hidden); a new question starts hidden by itself
  const [handFor, setHandFor] = useState<string | null>(null);
  const [idleRestart, setIdleRestart] = useState(0);
  const questionId = question?.questionId ?? null;
  const isHandShown = isHandAllowed && handFor !== null && handFor === questionId;

  useEffect(() => {
    if (!isHandAllowed || !questionId) return undefined;
    const timer = window.setTimeout(() => setHandFor(questionId), MIC_HAND_MS);
    return () => window.clearTimeout(timer);
  }, [isHandAllowed, questionId, idleRestart]);

  useEffect(() => {
    const section = sectionRef.current;
    const hand = handRef.current;
    const mic = micRef.current;
    if (!isHandShown || !section || !hand || !mic) return undefined;
    return startHandHint(section, hand, [mic]);
  }, [isHandShown]);

  /** Any touch hides the hand and restarts the countdown. */
  const handleScreenTouch = useCallback(() => {
    setHandFor(null);
    setIdleRestart((count) => count + 1);
  }, []);

  const askQuestion = useCallback(
    (nextQuestion: Question) => {
      const speak = () => speakText(nextQuestion.questionText, language);
      // Prefer the backend audio file; the browser voice is a fallback (Chrome has no Hebrew voice)
      if (nextQuestion.audioUrl) playAudio(nextQuestion.audioUrl, speak);
      else speak();
    },
    [language],
  );

  /** True when the question will be played by the toddler scene, which voices the question itself. */
  const usesToddlerScene = useCallback(
    (nextQuestion: Question) =>
      level === "toddler" &&
      buildQuestionChoices(findAnimalByName(nextQuestion.animalName)?.id, nextQuestion.topic, level).length > 0,
    [level],
  );

  const showQuestion = useCallback(
    (nextQuestion: Question) => {
      if (nextQuestion.topic) askedTopicsRef.current = [...askedTopicsRef.current, nextQuestion.topic];
      setQuestion(nextQuestion);
      setAttempts(0);
      setHeardAnswer("");
      setFeedback("");
      setTypedAnswer("");
      answerStartRef.current = Date.now();
      setPhase("question");
      if (!usesToddlerScene(nextQuestion)) askQuestion(nextQuestion);
    },
    [askQuestion, usesToddlerScene],
  );

  /** Next question about the same animal; the backend skips the topics already asked. */
  const loadQuestion = useCallback(
    async (animalName: string) => {
      setPhase("loading");
      try {
        const nextQuestion = await QuestionService.getNextQuestion(MOCK_CHILD_ID, language, level, {
          animal: animalName,
          asked: askedTopicsRef.current,
        });
        showQuestion(nextQuestion);
      } catch (error) {
        console.error("Failed to load question:", error);
        fail(() => void loadQuestion(animalName));
      }
    },
    [fail, language, level, showQuestion],
  );

  const startGame = useCallback(async () => {
    setPhase("starting");
    setAnsweredCount(0);
    setResult(null);
    askedTopicsRef.current = [];
    try {
      // "Who is this?" about a new animal; it also tells how many questions this animal has
      const first = await QuestionService.getNextQuestion(MOCK_CHILD_ID, language, level);
      const length = Math.min(QUESTIONS_PER_GAME, 1 + (first.remainingQuestions ?? QUESTIONS_PER_GAME - 1));
      setGameLength(length);
      const started = await GameService.startGame({ childId: MOCK_CHILD_ID, numQuestions: length });
      setSessionId(started.gameSessionId);
      showQuestion(first);
    } catch (error) {
      console.error("Failed to start game:", error);
      fail(() => void startGame());
    }
  }, [fail, language, level, showQuestion]);

  // The host's feedback aloud: praise, encouragement after a miss, or the answer said together.
  // Azure audio comes with the question (feedbackAudio, keyed by the exact text); the browser voice is
  // only a fallback (Chrome has no Hebrew voice)
  useEffect(() => {
    const voiced = question?.feedbackAudio ?? {};
    const say = (text: string, fallbackUrl?: string | null) => {
      const speak = () => speakText(text, language);
      const url = voiced[text] ?? fallbackUrl;
      if (url) playAudio(url, speak);
      else speak();
    };
    if (phase === "correct" && correctAnswer) {
      say(`${t("game.correctTitle")} ${correctAnswer}`, question?.answerAudioUrl);
    } else if (phase === "together" && togetherAnswer) {
      say(`${t("game.together")} ${togetherAnswer}`, question?.answerAudioUrl);
    } else if (phase === "incorrect" && feedback) {
      say(feedback);
    }
    // Only react to phase changes, not to re-renders
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  // Start automatically when the page opens (guarded against StrictMode double mount)
  useEffect(() => {
    if (hasStartedRef.current) return;
    hasStartedRef.current = true;
    void startGame();
  }, [startGame]);

  /**
   * A miss: a wrong answer (already sent) or silence (nothing sent).
   * When it ends the question with "let's say it together" after silence, the backend is told separately.
   */
  function registerWrongAttempt(message: string, wasAnswerSent = true) {
    const nextAttempts = attempts + 1;
    const isTogether = nextAttempts >= MAX_ATTEMPTS;
    setAttempts(nextAttempts);
    setFeedback(message);
    setPhase(isTogether ? "together" : "incorrect");
    if (isTogether && !wasAnswerSent) reportTogether(nextAttempts);
  }

  /** Records that the host said the answer together with a silent child; the game does not wait for it. */
  function reportTogether(attempt: number) {
    if (!question || sessionId === null) return;
    QuestionService.submitAnswer({
      gameSessionId: sessionId,
      questionId: question.questionId,
      animalId: question.animalId,
      answer: "",
      questionText: question.questionText,
      difficulty: question.difficulty,
      topic: question.topic,
      language,
      attempt,
      outcome: "TOGETHER",
    }).catch((error) => console.warn("Failed to record 'together':", error));
  }

  async function submitAnswer(answer: string) {
    if (!question || sessionId === null) return;
    setHeardAnswer(answer);
    setPhase("checking");
    try {
      const response = await QuestionService.submitAnswer({
        gameSessionId: sessionId,
        questionId: question.questionId,
        animalId: question.animalId,
        answer,
        responseTimeMs: Date.now() - answerStartRef.current,
        questionText: question.questionText,
        difficulty: question.difficulty,
        topic: question.topic,
        language,
        attempt: attempts + 1,
      });
      if (response.isCorrect) {
        setPhase("correct");
      } else {
        registerWrongAttempt(t("game.incorrect"));
      }
    } catch (error) {
      console.error("Failed to submit answer:", error);
      fail(() => void submitAnswer(answer));
    }
  }

  function handleMicClick() {
    if (speech.isListening) {
      // Second tap: the child has finished, submit what was heard so far
      speech.finish();
      return;
    }
    speech.listen({
      onResult: (transcript) => void submitAnswer(transcript),
      onError: (error: RecognitionError) => {
        if (error === "not-allowed") setFeedback(t("game.micDenied"));
        else if (error === "no-speech") registerWrongAttempt(t("game.notHeard"), false); // silence = failed attempt
        else setFeedback(t("game.error"));
      },
    });
  }

  // Toddler level: tapping a card is an answer; its caption goes to the backend like a spoken word
  function handleChoiceSelect(label: string) {
    speech.stop();
    void submitAnswer(label);
  }

  /** Toddler scene: checks a card caption; rejects on network error or timeout (the scene retries quietly). */
  async function checkToddlerAnswer(caption: string, attempt: number): Promise<boolean> {
    if (!question || sessionId === null) throw new Error("No active question");
    const response = await QuestionService.submitAnswer(
      {
        gameSessionId: sessionId,
        questionId: question.questionId,
        animalId: question.animalId,
        answer: caption,
        responseTimeMs: Date.now() - answerStartRef.current,
        questionText: question.questionText,
        difficulty: question.difficulty,
        topic: question.topic,
        language,
        attempt,
      },
      { timeout: TODDLER_ANSWER_TIMEOUT_MS, retries: 1 },
    );
    return response.isCorrect;
  }

  /** Toddler scene: checks the repeated word; nothing is saved and the score does not change. */
  async function checkToddlerRepeat(spoken: string): Promise<boolean> {
    if (!question) throw new Error("No active question");
    const response = await QuestionService.checkAnswer(
      { animalId: question.animalId, topic: question.topic, language, answer: spoken },
      { timeout: TODDLER_ANSWER_TIMEOUT_MS, retries: 1 },
    );
    return response.isCorrect;
  }

  function handleTypedSubmit(event: FormEvent) {
    event.preventDefault();
    const answer = typedAnswer.trim();
    if (answer) void submitAnswer(answer);
  }

  function tryAgain() {
    setFeedback("");
    setHeardAnswer("");
    setTypedAnswer("");
    setPhase("question");
    if (question) askQuestion(question);
  }

  async function goNext() {
    speech.stop();
    const nextCount = answeredCount + 1;
    setAnsweredCount(nextCount);
    if (nextCount < gameLength && question) {
      await loadQuestion(question.animalName);
      return;
    }
    if (sessionId === null) return;
    setPhase("finishing");
    try {
      setResult(await GameService.endGame(sessionId));
      setPhase("finished");
    } catch (error) {
      console.error("Failed to end game:", error);
      fail(() => void goNext());
    }
  }

  function replayQuestion() {
    if (question) askQuestion(question);
  }

  // ---------- Render ----------

  if (phase === "finished") {
    return (
      <section aria-live="polite" className="game game--reward">
        <h1 className="reward__title">{t("reward.title")}</h1>
        <p className="reward__subtitle">{t("reward.subtitle")}</p>
        <div className="reward__art">
          <RewardStar className="reward__star" />
          <Host className="reward__host" pose="happy" />
        </div>
        {result && (
          <p className="reward__score">
            {formatMessage(t("reward.score"), { correct: result.correctAnswers, total: result.totalQuestions })}
          </p>
        )}
        <button className="btn btn--primary btn--xl btn--block reward__continue" onClick={() => void startGame()} type="button">
          {t("reward.continue")}
          <ArrowForwardIcon className="btn__icon" />
        </button>
        <Link className="btn btn--secondary btn--lg btn--block reward__album" to="/stars">
          <AlbumIcon className="btn__icon" />
          {t("stars.album")}
        </Link>
      </section>
    );
  }

  if (phase === "error") {
    return (
      <section className="game game--status" role="alert">
        <Host className="game__status-host" />
        <p className="game__status-text">{t("game.error")}</p>
        <button className="btn btn--primary btn--lg" onClick={() => retryAction?.()} type="button">
          <RefreshIcon className="btn__icon" />
          {t("game.retry")}
        </button>
      </section>
    );
  }

  if (!question || phase === "starting" || phase === "loading" || phase === "finishing") {
    return (
      <section aria-busy="true" className="game game--status">
        <Host className="game__status-host game__status-host--bob" />
        <p className="game__status-text">{t("game.loading")}</p>
      </section>
    );
  }

  if (isToddlerScene && phase === "question") {
    return (
      <ToddlerQuestion
        animalAlt={localizedName || question.animalName}
        animalImage={animal?.image}
        checkAnswer={checkToddlerAnswer}
        checkRepeat={checkToddlerRepeat}
        choices={choices}
        key={question.questionId}
        onDone={() => void goNext()}
        questionAudioUrl={question.audioUrl}
        questionKey={question.questionId}
        questionText={question.questionText}
        speech={speech}
      />
    );
  }

  const isResult = phase === "correct" || phase === "incorrect" || phase === "together";

  return (
    <section
      aria-label={question.questionText}
      className={`game game--${phase}${showChoices && !isResult ? " game--with-options" : ""}`}
      onPointerDown={handleScreenTouch}
      ref={sectionRef}
    >
      <div className={`game__stage${isResult ? " game__stage--result" : ""}`}>
        {phase === "correct" && (
          <>
            <SpeechBubble className="game__bubble game__bubble--success" tail="bottom">
              {t("game.correctTitle")}
              {correctAnswer && <span className="game__bubble-line">{correctAnswer}</span>}
            </SpeechBubble>
            <RewardStar className="game__stars" size="md" />
          </>
        )}
        {phase === "incorrect" && (
          <SpeechBubble className="game__bubble game__bubble--soft" tail="bottom">
            {feedback}
          </SpeechBubble>
        )}
        {phase === "together" && (
          <SpeechBubble className="game__bubble game__bubble--soft" tail="bottom">
            {t("game.together")}
            {togetherAnswer && <span className="game__bubble-line game__bubble-line--answer">{togetherAnswer}</span>}
          </SpeechBubble>
        )}

        {animal ? (
          <img alt={localizedName || question.animalName} className="game__animal" draggable={false} src={animal.image} />
        ) : (
          <p className="game__no-image">{t("game.unknownAnimal")}</p>
        )}

        {isResult && <Host className="game__peek" pose={phase === "correct" ? "happy" : "greeting"} />}

        <button aria-label={t("game.listen")} className="game__speaker" onClick={replayQuestion} type="button">
          <SpeakerIcon className="game__speaker-icon" />
        </button>
      </div>

      {isResult ? (
        <div className="game__actions">
          {phase !== "together" && (
            <button className={`btn btn--lg ${phase === "correct" ? "btn--secondary" : "btn--primary"}`} onClick={tryAgain} type="button">
              <RefreshIcon className="btn__icon" />
              {t("game.again")}
            </button>
          )}
          <button
            className={`btn btn--lg ${phase === "incorrect" ? "btn--secondary" : "btn--primary"}`}
            onClick={() => void goNext()}
            type="button"
          >
            {t("game.next")}
            <ArrowForwardIcon className="btn__icon" />
          </button>
        </div>
      ) : (
        <>
          <div className="host-bar">
            <Host className="host-bar__avatar" variant="avatar" />
            <p className="host-bar__text" dir="auto">
              {question.questionText}
            </p>
          </div>

          {showChoices && (
            <AnswerOptions
              choices={choices}
              disabled={phase === "checking"}
              onSelect={level === "toddler" ? (_choice, label) => handleChoiceSelect(label) : undefined}
            />
          )}

          <div className="voice">
            {speech.isSupported ? (
              <>
                <div
                  className={`voice__control${speech.isListening ? " voice__control--listening" : ""}${isWaitingForVoice ? " voice__control--waiting" : ""}`}
                >
                  <span aria-hidden="true" className="voice__wave">
                    <i /><i /><i /><i />
                  </span>
                  <button
                    aria-label={speech.isListening ? t("game.listening") : t("game.micStart")}
                    aria-pressed={speech.isListening}
                    className="voice__mic"
                    disabled={phase === "checking"}
                    onClick={handleMicClick}
                    ref={micRef}
                    type="button"
                  >
                    <MicIcon className="voice__mic-icon" />
                  </button>
                  <span aria-hidden="true" className="voice__wave">
                    <i /><i /><i /><i />
                  </span>
                </div>
                <p aria-live="polite" className="voice__status">
                  {phase === "checking"
                    ? `${t("game.checking")}${heardAnswer ? ` ${t("game.heard")} «${heardAnswer}»` : ""}`
                    : speech.isListening
                      ? t("game.listening")
                      : feedback || t("game.micStart")}
                </p>
              </>
            ) : (
              <form className="voice__form" onSubmit={handleTypedSubmit}>
                <p className="voice__status">{t("game.noSpeech")}</p>
                <div className="voice__row">
                  <input
                    aria-label={t("game.typePlaceholder")}
                    className="voice__input"
                    dir="auto"
                    disabled={phase === "checking"}
                    onChange={(event) => setTypedAnswer(event.target.value)}
                    placeholder={t("game.typePlaceholder")}
                    value={typedAnswer}
                  />
                  <button aria-label={t("game.send")} className="voice__send" disabled={phase === "checking" || !typedAnswer.trim()} type="submit">
                    <SendIcon className="voice__send-icon" />
                  </button>
                </div>
                {phase === "checking" && <p aria-live="polite" className="voice__status">{t("game.checking")}</p>}
              </form>
            )}
          </div>
        </>
      )}

      <HandHintIcon ref={handRef} />
    </section>
  );
}

export default GamesPage;
