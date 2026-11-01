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
import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from "react";

import Host from "../components/Host/Host";
import RewardStar from "../components/RewardStar/RewardStar";
import SpeechBubble from "../components/SpeechBubble/SpeechBubble";
import { findAnimalByName } from "../data/animals/lookup";
import { useSpeechRecognition, type RecognitionError } from "../hooks/useSpeechRecognition";
import {
  AnswerOptions,
  buildChoices,
  findAnimalOptions,
  shouldShowChoices,
  toOptionTopic,
  ToddlerQuestion,
  useAnswerLevel,
} from "../modules/answer-options";
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
// Toddler cards: a pressed card waits for the backend at most this long, then quietly comes back
const TODDLER_ANSWER_TIMEOUT_MS = 5000;
// After this many wrong attempts (silence included) the host says the answer together with the child.
// 2 = one encouragement with picture hints, then "let's say it together" (see docs/PRODUCT_BRIEF.md)
const MAX_ATTEMPTS = 2;

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
  const localizedName = animal?.names[language] ?? question?.animalName ?? "";
  // The answer to the question that was asked; older backends only know the animal name
  const correctAnswer = question?.answer || (localizedName ? formatMessage(t("game.thisIs"), { name: localizedName }) : "");
  const togetherAnswer = question?.answer || localizedName;

  // Picture answer cards; shuffled once per question so they don't jump on re-render
  const level = useAnswerLevel();
  const choices = useMemo(
    () => buildChoices(findAnimalOptions(animal?.id), toOptionTopic(question?.topic), level),
    [animal?.id, question, level],
  );
  const showChoices = choices.length > 0 && shouldShowChoices(level, attempts);
  // Toddler level with picture cards runs the new voiced scene (design spec); other cases use the old flow for now
  const isToddlerScene = level === "toddler" && choices.length > 0;

  const fail = useCallback((retry: () => void) => {
    setRetryAction(() => retry);
    setPhase("error");
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
      buildChoices(findAnimalOptions(findAnimalByName(nextQuestion.animalName)?.id), toOptionTopic(nextQuestion.topic), level).length > 0,
    [level],
  );

  const loadQuestion = useCallback(async () => {
    setPhase("loading");
    try {
      const nextQuestion = await QuestionService.getNextQuestion(MOCK_CHILD_ID, language);
      setQuestion(nextQuestion);
      setAttempts(0);
      setHeardAnswer("");
      setFeedback("");
      setTypedAnswer("");
      answerStartRef.current = Date.now();
      setPhase("question");
      if (!usesToddlerScene(nextQuestion)) askQuestion(nextQuestion);
    } catch (error) {
      console.error("Failed to load question:", error);
      fail(() => void loadQuestion());
    }
  }, [askQuestion, fail, language, usesToddlerScene]);

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

  // Say the answer aloud: praise after a correct answer, or say it together with the child
  useEffect(() => {
    const answerAudio = question?.answerAudioUrl;
    if (phase === "correct" && correctAnswer) {
      const speak = () => speakText(`${t("game.correctTitle")} ${correctAnswer}`, language);
      if (answerAudio) playAudio(answerAudio, speak);
      else speak();
    } else if (phase === "together" && togetherAnswer) {
      const speak = () => speakText(togetherAnswer, language);
      if (answerAudio) playAudio(answerAudio, speak);
      else speak();
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
        topic: question.topic,
        language,
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
        else if (error === "no-speech") registerWrongAttempt(t("game.notHeard")); // silence = failed attempt
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
  async function checkToddlerAnswer(caption: string): Promise<boolean> {
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
      },
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

  if (isToddlerScene && phase === "question") {
    return (
      <ToddlerQuestion
        animalAlt={localizedName || question.animalName}
        animalImage={animal?.image}
        checkAnswer={checkToddlerAnswer}
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
    <section aria-label={question.questionText} className={`game game--${phase}${showChoices && !isResult ? " game--with-options" : ""}`}>
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
