/**
 * GamesPage - Main Game Flow
 * 
 * Real backend integration with API:
 * 1. POST /games/start → get gameSessionId
 * 2. GET /questions/next → display real LLM-generated questions
 * 3. POST /questions/answer → validate with LLM
 * 4. POST /games/{id}/end → complete game and update progress
 */

import { useI18n } from "../shared/i18n";
import { useState, useEffect } from "react";
import SpeechBubble from "../components/SpeechBubble/SpeechBubble";
import Background from "../components/Background/Background";
import Host from "../components/Host/Host";
import Animal from "../components/Animal/Animal";
import RewardStar from "../components/RewardStar/RewardStar";
import type { Animal as AnimalType } from "../types/animal";
import { animals } from "../data/animals/animals";
import boyImage from "../assets/characters/boy_shows.png";
import { playAudio } from "../services/audioService";
import {
  useStartGame,
  useNextQuestion,
  useSubmitAnswer,
  useEndGame,
} from "../services/useApi";

import "./GamesPage.css";

// Mock child ID - in real app, this would come from user auth/selection
const MOCK_CHILD_ID = 1;
const QUESTIONS_PER_GAME = 5;

interface GameState {
  gameSessionId: number | null;
  currentQuestion: any | null;
  questionsAnswered: number;
  correctAnswers: number;
  isGameActive: boolean;
  isWaitingForNextQuestion: boolean;
  showReward: boolean;
  answerStartTime: number | null;
}

export function GamesPage() {
  const { t } = useI18n();

  // Game flow state
  const [gameState, setGameState] = useState<GameState>({
    gameSessionId: null,
    currentQuestion: null,
    questionsAnswered: 0,
    correctAnswers: 0,
    isGameActive: false,
    isWaitingForNextQuestion: false,
    showReward: false,
    answerStartTime: null,
  });

  // API hooks
  const startGameHook = useStartGame(MOCK_CHILD_ID, QUESTIONS_PER_GAME);
  const questionHook = useNextQuestion(gameState.gameSessionId ? MOCK_CHILD_ID : null);
  const { submitAnswer, loading: isSubmittingAnswer } = useSubmitAnswer();
  const endGameHook = useEndGame(gameState.gameSessionId);

  // 1. Show a random animal while waiting to start
  const [displayAnimal, setDisplayAnimal] = useState<AnimalType | null>(null);

  useEffect(() => {
    // In real app, fetch animals from API
    // For now, use local data as fallback
    if (animals && animals.length > 0) {
      const randomIndex = Math.floor(Math.random() * animals.length);
      setDisplayAnimal(animals[randomIndex]);
    }
  }, []);

  // 2. Start game when user clicks animal
  const handleGameStart = async () => {
    if (gameState.isGameActive) return;

    try {
      const result = await startGameHook.retry();
      if (result) {
        setGameState((prev) => ({
          ...prev,
          gameSessionId: result.gameSessionId,
          isGameActive: true,
          isWaitingForNextQuestion: true,
        }));
      }
    } catch (error) {
      console.error("Failed to start game:", error);
      alert(`Error starting game: ${error}`);
    }
  };

  // 3. When game starts, fetch first question
  useEffect(() => {
    if (gameState.isGameActive && gameState.isWaitingForNextQuestion) {
      loadNextQuestion();
    }
  }, [gameState.isGameActive, gameState.isWaitingForNextQuestion]);

  const loadNextQuestion = async () => {
    try {
      const question = await questionHook.retry();
      if (question) {
        setGameState((prev) => ({
          ...prev,
          currentQuestion: question,
          isWaitingForNextQuestion: false,
          answerStartTime: Date.now(),
        }));

        // Play question audio if available
        if (question.audioUrl) {
          playAudio(question.audioUrl);
        }

        // Display speech bubble
        // This would trigger visual feedback in a real implementation
      }
    } catch (error) {
      console.error("Failed to load question:", error);
    }
  };

  // 4. Handle animal click = submit answer
  const handleAnimalClick = async () => {
    if (!gameState.isGameActive || !gameState.currentQuestion || isSubmittingAnswer) {
      return;
    }

    // In a real implementation, this would:
    // - Capture the child's spoken answer (speech recognition)
    // - Or show an input field for the answer
    // For now, we'll show a simple prompt (not ideal for 2-6 year olds)
    
    const answer = window.prompt(`Question: ${gameState.currentQuestion.questionText}\n\nAnswer:`);
    if (!answer) return;

    try {
      const responseTimeMs = gameState.answerStartTime
        ? Date.now() - gameState.answerStartTime
        : 0;

      const result = await submitAnswer({
        gameSessionId: gameState.gameSessionId!,
        questionId: gameState.currentQuestion.questionId,
        animalId: gameState.currentQuestion.animalId,
        answer,
        responseTimeMs,
        questionText: gameState.currentQuestion.questionText,
        difficulty: gameState.currentQuestion.difficulty,
      });

      // Update game stats
      setGameState((prev) => ({
        ...prev,
        questionsAnswered: prev.questionsAnswered + 1,
        correctAnswers: prev.correctAnswers + (result.isCorrect ? 1 : 0),
        showReward: result.isCorrect,
      }));

      // Show feedback
      if (result.explanation) {
        alert(`${result.isCorrect ? "✓ Correct!" : "✗ Not quite..."}\n\n${result.explanation}`);
      }

      // Check if game is complete
      if (gameState.questionsAnswered + 1 >= QUESTIONS_PER_GAME) {
        // Game is complete, show reward and wait for end
        setTimeout(() => {
          handleGameEnd();
        }, 2000);
      } else {
        // Load next question
        setTimeout(() => {
          setGameState((prev) => ({
            ...prev,
            showReward: false,
            isWaitingForNextQuestion: true,
          }));
        }, 2000);
      }
    } catch (error) {
      console.error("Failed to submit answer:", error);
      alert(`Error submitting answer: ${error}`);
    }
  };

  // 5. End game when all questions answered
  const handleGameEnd = async () => {
    if (!gameState.gameSessionId) return;

    try {
      const result = await endGameHook.retry();
      if (result) {
        console.log("Game ended:", result);
        // Reset game state
        setGameState({
          gameSessionId: null,
          currentQuestion: null,
          questionsAnswered: 0,
          correctAnswers: 0,
          isGameActive: false,
          isWaitingForNextQuestion: false,
          showReward: false,
          answerStartTime: null,
        });

        // Show final score
        alert(`Game Complete!\n\nScore: ${result.finalScore}%\n\nCorrect: ${result.correctAnswers}/${result.totalQuestions}`);
      }
    } catch (error) {
      console.error("Failed to end game:", error);
    }
  };

  // Render current animal
  const currentAnimal: AnimalType | null = gameState.currentQuestion
    ? {
        id: gameState.currentQuestion.animalId,
        name: gameState.currentQuestion.animalName,
        image: displayAnimal?.image || "", // In real app, fetch from API
        habitat: displayAnimal?.habitat || "farm",
      }
    : displayAnimal;

  return (
    <section className="games-page" aria-label={t("app.name")}>
      <Background />
      <div className="games-page__scene">
        <div className="host-container">
          {!gameState.isGameActive && !displayAnimal && (
            <SpeechBubble text="Loading game..." />
          )}

          {!gameState.isGameActive && displayAnimal && (
            <SpeechBubble text={t("question.whoIsIt")} />
          )}

          {gameState.isGameActive && gameState.currentQuestion && !gameState.showReward && (
            <SpeechBubble text={gameState.currentQuestion.questionText} />
          )}

          {gameState.isGameActive && gameState.showReward && (
            <SpeechBubble text={t("reward.excellent")} />
          )}

          {isSubmittingAnswer && (
            <SpeechBubble text="Checking your answer..." />
          )}

          <Host image={boyImage} />
        </div>

        {currentAnimal && (
          <Animal
            image={currentAnimal.image}
            onClick={
              gameState.isGameActive && !gameState.isWaitingForNextQuestion && !isSubmittingAnswer
                ? handleAnimalClick
                : !gameState.isGameActive
                ? handleGameStart
                : undefined
            }
          />
        )}
      </div>

      {gameState.showReward && (
        <RewardStar onClick={() => {}} /> // Reward shown automatically
      )}

      {/* Game Progress Indicator */}
      {gameState.isGameActive && (
        <div style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          color: "#333",
          fontSize: "18px",
          fontWeight: "bold",
        }}>
          Question {gameState.questionsAnswered + 1}/{QUESTIONS_PER_GAME}
        </div>
      )}
    </section>
  );
}

export default GamesPage;
