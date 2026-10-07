/**
 * Progress Service
 * API calls for child progress tracking and LLM-based analysis
 */

import { httpClient } from './http-client';
import { ENDPOINTS } from './api-config';
import type {
  ProgressResponse,
  ProgressAnalyzeRequest,
  ProgressAnalysisResponse,
} from './api-types';

export class ProgressService {
  /**
   * Get child's progress data
   *
   * GET /progress/{childId}
   */
  static async getProgress(childId: number): Promise<ProgressResponse> {
    return httpClient.get<ProgressResponse>(ENDPOINTS.progress.get(childId));
  }

  /**
   * Analyze child's progress using LLM (long-context Claude)
   *
   * POST /progress/analyze
   */
  static async analyzeProgress(childId: number): Promise<ProgressAnalysisResponse> {
    const request: ProgressAnalyzeRequest = { childId };
    return httpClient.post<ProgressAnalysisResponse>(
      ENDPOINTS.progress.analyze,
      request
    );
  }

  /**
   * Get quick progress summary (from cache if available)
   */
  static async getProgressSummary(childId: number): Promise<{
    totalGames: number;
    successRate: number;
    currentLevel: string;
  }> {
    const progress = await this.getProgress(childId);
    return {
      totalGames: progress.totalGames,
      successRate: progress.successRate,
      currentLevel: progress.currentLevel,
    };
  }
}

export default ProgressService;
