/**
 * React Hooks for API Services
 * Convenient hooks for using API services in React components
 */

import { useState, useCallback, useEffect } from 'react';
import GameService from './gameService';
import QuestionService from './questionService';
import ProgressService from './progressService';
import AnimalService from './animalService';
import type {
  AnswerResponse,
  AnswerRequest,
} from './api-types';

/**
 * Generic async hook state
 */
interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

/**
 * useAsync - Generic hook for async operations
 *
 * IMPORTANT: `asyncFunction` must be a STABLE reference (e.g. wrapped in
 * useCallback by the caller with correct dependencies). If a new function
 * is passed on every render, `execute` and the effect below will also be
 * recreated every render, causing an infinite update loop.
 */
function useAsync<T>(
  asyncFunction: () => Promise<T>,
  immediate: boolean = true
): AsyncState<T> & { retry: () => Promise<T> } {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: immediate,
    error: null,
  });

  const execute = useCallback(async () => {
    setState({ data: null, loading: true, error: null });
    try {
      const response = await asyncFunction();
      setState({ data: response, loading: false, error: null });
      return response;
    } catch (error) {
      setState({ data: null, loading: false, error: error as Error });
      throw error;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [asyncFunction]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return {
    ...state,
    retry: execute,
  };
}

// ============================================================================
// Game Hooks
// ============================================================================

/**
 * useStartGame - Start a new game session
 */
export function useStartGame(childId: number, numQuestions: number = 5) {
  const fn = useCallback(
    () => GameService.startGame({ childId, numQuestions }),
    [childId, numQuestions]
  );
  return useAsync(fn, false);
}

/**
 * useGameSession - Get current game session status
 */
export function useGameSession(sessionId: number | null) {
  const fn = useCallback(
    () => GameService.getGameSession(sessionId!),
    [sessionId]
  );
  return useAsync(fn, !!sessionId);
}

/**
 * useEndGame - End a game session
 */
export function useEndGame(sessionId: number | null) {
  const fn = useCallback(() => GameService.endGame(sessionId!), [sessionId]);
  return useAsync(fn, false);
}

// ============================================================================
// Question Hooks
// ============================================================================

/**
 * useNextQuestion - Get next question for a child
 */
export function useNextQuestion(childId: number | null) {
  const fn = useCallback(
    () => QuestionService.getNextQuestion(childId!),
    [childId]
  );
  return useAsync(fn, !!childId);
}

/**
 * useSubmitAnswer - Submit an answer to a question
 */
export function useSubmitAnswer() {
  const [state, setState] = useState<AsyncState<AnswerResponse>>({
    data: null,
    loading: false,
    error: null,
  });

  const submitAnswer = useCallback(
    async (request: AnswerRequest) => {
      setState({ data: null, loading: true, error: null });
      try {
        const response = await QuestionService.submitAnswer(request);
        setState({ data: response, loading: false, error: null });
        return response;
      } catch (error) {
        setState({ data: null, loading: false, error: error as Error });
        throw error;
      }
    },
    []
  );

  return { ...state, submitAnswer };
}

// ============================================================================
// Progress Hooks
// ============================================================================

/**
 * useProgress - Get child's progress data
 */
export function useProgress(childId: number | null) {
  const fn = useCallback(
    () => ProgressService.getProgress(childId!),
    [childId]
  );
  return useAsync(fn, !!childId);
}

/**
 * useProgressAnalysis - Analyze child's progress with LLM
 */
export function useProgressAnalysis(childId: number | null) {
  const fn = useCallback(
    () => ProgressService.analyzeProgress(childId!),
    [childId]
  );
  return useAsync(fn, false); // manual trigger
}

// ============================================================================
// Animal Hooks
// ============================================================================

/**
 * useAnimals - Get all animals
 */
export function useAnimals() {
  const fn = useCallback(() => AnimalService.getAllAnimals(), []);
  return useAsync(fn, true);
}

/**
 * useAnimal - Get single animal by ID
 */
export function useAnimal(animalId: number | null) {
  const fn = useCallback(
    () => AnimalService.getAnimal(animalId!),
    [animalId]
  );
  return useAsync(fn, !!animalId);
}
