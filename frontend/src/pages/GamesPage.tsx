/**
 * GamesPage - main game flow ("Who is it?").
 *
 * Backend flow (unchanged API calls):
 * 1. POST /games/start → gameSessionId
 * 2. GET /questions/next → question about an animal
 * 3. POST /games/answer → backend validates the answer
 * 4. POST /games/{id}/end → final score, progress update
 *
 * The child answers by voice (Web Speech API); a text field is the fallback
 * when the browser has no speech recognition.
 */
import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";

import Host from "../components/Host/Host";
import RewardStar from "../components/RewardStar/RewardStar";
import SpeechBubble from "../components/SpeechBubble/SpeechBubble";
import { animalNameKey, findAnimalByName } from "../data/animals/lookup";
import { useSpeechRecognition, type RecognitionError } from "../hooks/useSpeechRecognition";
import type { GameEndResponse, Question } from "../services/api-types";
import { playAudio, speakText } from "../services/audioService";
import GameService from "../services/gameService";
import QuestionService from "../services/questionService";
import { ArrowForwardIcon, MicIcon, RefreshIcon, SendIcon, SpeakerIcon } from "../shared/icons/Icons";
import { formatMessage, useI18n } from "../shared/i18n";
import { usePageHeader } from "../shared/layout/PageHeaderContext";
import "./GamesPage.css";

// Mock child ID - in real app, this would come from user auth/selection
const MOCK_CHILD_ID = 1;
const QUESTIONS_PER_GAME = 5;
// After this many wrong attempts the host says the answer together with the child
const MAX_ATTEMPTS = 3;

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
  const answerStartRef = useRef(0);
  const hasStartedRef = useRef(false);

  usePageHeader({
    progress:
      phase === "finished" ? undefined : { current: Math.min(answeredCount + 1, QUESTIONS_PER_GAME), total: QUESTIONS_PER_GAME },
  });

  const animal = findAnimalByName(question?.animalName);
  const nameKey = animalNameKey(question?.animalName);
  const localizedName = nameKey ? t(nameKey) ?? question?.animalName ?? "" : "";

  const fail = useCallback((retry: () => void) => {
    setRetryAction(() => retry);
    setPhase("error");
  }, []);

  const askQuestion = useCallback(
    (nextQuestion: Question) => {
      if (nextQuestion.audioUrl) playAudio(nextQuestion.audioUrl);
      else speakText(nextQuestion.questionText, language);
    },
    [language],
  );

  const loadQuestion = useCallback(async () => {
    setPhase("loading");
    try {
      const nextQuestion = await QuestionService.getNextQuestion(MOCK_CHILD_ID);
      setQuestion(nextQuestion);
      setAttempts(0);
      setHeardAnswer("");
      setFeedback("");
      setTypedAnswer("");
      answerStartRef.current = Date.now();
      setPhase("question");
      askQuestion(nextQuestion);
    } catch (error) {
      console.error("Failed to load question:", error);
      fail(() => void loadQuestion());
    }
  }, [askQuestion, fail]);

  const startGame = useCallback(async () => {
    setPhase("starting");
    setAnsweredCount(0);
    setResult(null);
    try {
      const started = await GameService.startGame({ childId: MOCK_CHILD_ID, numQuestions: QUESTIONS_PER_GAME });
      setSessionId(started.gameSessionId);
      await loadQuestion();
    } catch (error) {
      console.error("Failed to start game:", error);
      fail(() => void startGame());
    }
  }, [fail, loadQuestion]);

  // Start automatically when the page opens (guarded against StrictMode double mount)
  useEffect(() => {
    if (hasStartedRef.current) return;
    hasStartedRef.current = true;
    void startGame();
  }, [startGame]);

  function registerWrongAttempt(message: string) {
    const nextAttempts = attempts + 1;
    setAttempts(nextAttempts);
    setFeedback(message);
    setPhase(nextAttempts >= MAX_ATTEMPTS ? "together" : "incorrect");
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
      speech.stop();
      return;
    }
    speech.listen({
      onResult: (transcript) => void submitAnswer(transcript),
      onError: (error: RecognitionError) => {
        if (error === "not-allowed") setFeedback(t("game.micDenied"));
        else if (error === "no-speech") registerWrongAttempt(t("game.notHeard")); // silence = failed attempt
        else setFeedback(t("game.error"));
      },
    });
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
    if (nextCount < QUESTIONS_PER_GAME) {
      await loadQuestion();
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

  const isResult = phase === "correct" || phase === "incorrect" || phase === "together";

  return (
    <section aria-label={question.questionText} className={`game game--${phase}`}>
      <div className={`game__stage${isResult ? " game__stage--result" : ""}`}>
        {phase === "correct" && (
          <>
            <SpeechBubble className="game__bubble game__bubble--success" tail="bottom">
              {t("game.correctTitle")}
              {localizedName && <span className="game__bubble-line">{formatMessage(t("game.thisIs"), { name: localizedName })}</span>}
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
            {localizedName && <span className="game__bubble-line game__bubble-line--answer">{localizedName}</span>}
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

          <div className="voice">
            {speech.isSupported ? (
              <>
                <div className={`voice__control${speech.isListening ? " voice__control--listening" : ""}`}>
                  <span aria-hidden="true" className="voice__wave">
                    <i /><i /><i /><i />
                  </span>
                  <button
                    aria-label={speech.isListening ? t("game.listening") : t("game.micStart")}
                    aria-pressed={speech.isListening}
                    className="voice__mic"
                    disabled={phase === "checking"}
                    onClick={handleMicClick}
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

    </section>
  );
}

export default GamesPage;
