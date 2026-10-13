/**
 * Question Service
 * API calls for question generation and answer validation
 */

import { httpClient } from './http-client';
import { ENDPOINTS } from './api-config';
import type { Question, AnswerRequest, AnswerResponse } from './api-types';

export class QuestionService {
  /**
   * Get next question for a child
   *
   * GET /questions/next?childId={childId}
   */
  static async getNextQuestion(childId: number): Promise<Question> {
    const endpoint = `${ENDPOINTS.questions.next}?childId=${childId}`;
    // Never serve a cached question: every call must return a new one
    return httpClient.get<Question>(endpoint, { cache: false });
  }

  /**
   * Submit an answer to a question
   *
   * POST /questions/answer
   */
  static async submitAnswer(request: AnswerRequest): Promise<AnswerResponse> {
    return httpClient.post<AnswerResponse>(
      ENDPOINTS.questions.answer,
      request
    );
  }

  /**
   * Get next question and submit answer in one flow
   * (Helper method for common game loop)
   */
  static createQuestionFlow(childId: number) {
    return {
      question: () => this.getNextQuestion(childId),
      submitAnswer: (request: Omit<AnswerRequest, 'questionId' | 'animalId'>) =>
        this.submitAnswer(request as AnswerRequest),
    };
  }
}

export default QuestionService;
